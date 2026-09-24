/**
 * Operações que a aba do SEI executa a pedido do painel.
 *
 * Roda no MUNDO ISOLADO do content script: o `fetch` daqui leva os cookies da
 * sessão do SEI, e nenhum script da página enxerga o que passa por aqui.
 *
 * Cada operação é uma função do `sei-nucleo` com a saída REDUZIDA a dados:
 * nada de link assinado, `infra_hash`, HTML de tela ou id de sessão sai desta
 * camada. O painel só recebe o que pode (depois de anonimizado) chegar ao modelo.
 */

import { lerArvore, type Arvore, type DocumentoArvore } from "@nucleo/dominio/arvore";
import { assinarBloco, conteudoDoBloco, criarBloco, incluirNoBloco, listarBlocos, mudarBloco, retirarDoBloco, type AcaoDeBloco, type TipoBloco } from "@nucleo/dominio/blocos";
import { listarCaixa } from "@nucleo/dominio/caixa";
import {
  alterarDocumento,
  criarDocumento,
  lerConteudo,
  localizarDocumento,
  type AlteracaoDocumento,
  type NovoDocumento,
} from "@nucleo/dominio/documento";
import { abrirEditor, editarConteudo, textoDoHtml, type EditorDocumento } from "@nucleo/dominio/editor";
import { andamentos, type TipoHistorico } from "@nucleo/dominio/historico";
import { listarOpcoes, type ListaOpcoes } from "@nucleo/dominio/opcoes";
import { alterarProcesso, concluirProcesso, consultarProcesso, reabrirProcesso, type AlteracaoProcesso } from "@nucleo/dominio/processo";
import {
  atribuirProcesso,
  definirAcompanhamento,
  definirAnotacao,
  definirMarcador,
  marcadoresDoProcesso,
  registrarAndamento,
} from "@nucleo/dominio/acoesProcesso";
import { assinarDocumento, enviarProcesso } from "@nucleo/dominio/tramitacao";
import { pesquisar, type ResultadoPesquisa } from "@nucleo/dominio/pesquisa";
import { cancelarAssinatura, cancelarDocumento, darCiencia, excluirDocumento } from "@nucleo/dominio/acoesDocumento";
import { parametros } from "@nucleo/links/links";
import { ErroSei } from "@nucleo/sessao/erros";
import type { Pagina } from "@nucleo/sessao/http";
import { lerContexto, type Sei } from "@nucleo/sei";
import type { TelaAtual } from "../motor/motor";
import { diagnosticar, type MotivoSemSugestao, type ProcessoNaTela } from "../fluxos/avaliar";
import { contem, normalizar, type Fluxo, type Ignorados } from "../fluxos/modelo";

type Op = (sei: Sei, a: Record<string, unknown>, sinal: AbortSignal) => Promise<unknown>;

const txt = (v: unknown) => (v === undefined || v === null ? undefined : String(v));
const aplicar = (a: Record<string, unknown>) => a.aplicar === true;

/** Documento como o modelo o vê. */
export function resumoDocumento(d: DocumentoArvore) {
  return {
    numero: d.numero,
    /** id interno: o modelo usa para o link "ancoraSei" ao citar o documento. */
    id: d.id,
    titulo: d.titulo,
    formato: d.formato,
    externo: d.externo,
    nivel: d.nivel,
    ...(d.hipotese ? { hipotese: d.hipotese } : {}),
    assinado: d.assinado,
    ...(d.assinaturas.length ? { assinaturas: d.assinaturas } : {}),
    ...(d.cancelado ? { cancelado: true } : {}),
    ...(d.unidadeGeradora ? { unidade: d.unidadeGeradora } : {}),
  };
}

function resumoArvore(a: Arvore) {
  return {
    protocolo: a.protocolo,
    tipo: a.tipo,
    nivel: a.nivel,
    ...(a.hipotese ? { hipotese: a.hipotese } : {}),
    marcadores: a.marcadores,
    total: a.documentos.length,
    // Documento sigiloso aparece só pelo número: título e conteúdo não saem.
    documentos: a.documentos.map((d) => (d.nivel === "sigiloso" ? { numero: d.numero, nivel: "sigiloso" } : resumoDocumento(d))),
  };
}

/** Lê a tela atual da aba (sem requisição, só o DOM vivo). */
export function lerTela(doc: Document, url: string): TelaAtual {
  const pagina: Pagina = { url, status: 200, html: doc.documentElement.outerHTML, doc };
  const tela: TelaAtual = {};
  try {
    const c = lerContexto(pagina);
    Object.assign(tela, { unidade: c.unidade.sigla, usuario: c.usuario.nome, versao: c.versao });
  } catch {
    /* tela sem cabeçalho (janela do editor, por exemplo) */
  }
  // Qual tela do SEI está aberta (`acao` do controlador): é o que deixa o painel
  // sugerir o que faz sentido ali — na caixa da unidade, num processo, na pesquisa.
  tela.acao = parametros(url).get("acao") ?? undefined;
  const arv = arvoreNaTela(doc);
  if (arv) {
    tela.processo = { protocolo: arv.protocolo, tipo: arv.tipo, nivel: arv.nivel };
    tela.sigiloso = arv.nivel === "sigiloso";
    try {
      // Qual documento está aberto à direita. No SEI 5 o visualizador é um
      // iframe só; no SEI 4.1 o `ifrVisualizacao` fica ANINHADO dentro do
      // `ifrConteudoVisualizacao`, e só o de dentro carrega o id_documento.
      const enderecos: string[] = [];
      const anotar = (j: Window | null | undefined) => {
        try {
          if (j?.location.href) enderecos.push(j.location.href);
        } catch {
          /* outro domínio: não interessa */
        }
      };
      const conteudo = doc.querySelector<HTMLIFrameElement>("#ifrConteudoVisualizacao");
      anotar(conteudo?.contentWindow);
      anotar(conteudo?.contentDocument?.querySelector<HTMLIFrameElement>("#ifrVisualizacao")?.contentWindow);
      anotar(doc.querySelector<HTMLIFrameElement>("#ifrVisualizacao")?.contentWindow);
      const idDoc = enderecos.map((u) => /[?&]id_documento=(\d+)/.exec(u)?.[1]).find(Boolean);
      const d = idDoc ? arv.documentos.find((x) => x.id === idDoc) : undefined;
      if (d && !tela.sigiloso && d.nivel !== "sigiloso") tela.documento = { numero: d.numero, titulo: d.titulo };
    } catch {
      /* visualizador ainda carregando */
    }
  }
  const marcados = [...doc.querySelectorAll<HTMLInputElement>("#tblProcessosRecebidos input:checked, #tblProcessosGerados input:checked, #tblProcessosDetalhado input:checked")]
    .map((i) => i.getAttribute("title") ?? "")
    .filter(Boolean);
  if (marcados.length) tela.selecionados = marcados;
  return tela;
}

/**
 * A árvore que JÁ está na tela, lida do iframe vivo, sem requisição.
 *
 * Serve ao `lerTela` (que só precisa saber QUE processo está aberto). NÃO serve
 * para avaliar fluxo: o SEI só carrega o conteúdo de uma pasta quando o usuário
 * a abre, então num processo com pastas isto devolve a árvore pela metade — ver
 * a operação `fluxo.avaliar`.
 */
export function arvoreNaTela(doc: Document): Arvore | null {
  const docArvore = doc.querySelector<HTMLIFrameElement>("#ifrArvore")?.contentDocument;
  if (!docArvore?.documentElement) return null;
  try {
    return lerArvore({ url: docArvore.URL, status: 200, html: docArvore.documentElement.outerHTML, doc: docArvore });
  } catch {
    return null; // árvore ainda carregando
  }
}

/**
 * Árvore do núcleo → o processo que o Estúdio de Fluxo avalia.
 *
 * `unidade` é a da TELA (a unidade em que o usuário está), não a do documento:
 * é ela que a etapa com `daMinhaUnidade` compara.
 *
 * Documento sigiloso NÃO sai da lista: sumir deslocaria a cronologia, e uma
 * etapa passaria a casar com documento que veio antes dele. Ele fica sem
 * título, guardando o lugar — e sem título nunca cumpre etapa nenhuma.
 */
export function processoParaFluxo(arv: Arvore, unidade?: string): ProcessoNaTela {
  return {
    protocolo: arv.protocolo,
    tipo: arv.tipo,
    marcadores: arv.marcadores,
    unidade,
    ...(arv.nivel === "sigiloso" ? { sigiloso: true } : {}),
    documentos: arv.documentos.map((d) =>
      d.nivel === "sigiloso"
        ? { numero: d.numero, titulo: "", assinado: false, nivel: "sigiloso" }
        : { numero: d.numero, titulo: d.titulo, assinado: d.assinado, unidade: d.unidadeGeradora, cancelado: d.cancelado, externo: d.externo, nivel: d.nivel },
    ),
  };
}

/** O que o painel recebe quando há sugestão: ids e texto, nada do SEI. */
export interface SugestaoDeFluxo {
  protocolo: string;
  fluxoId: string;
  /** Etapa que falta. */
  etapaId: string;
  etapaAnteriorId: string;
  /** Documento que cumpriu a etapa anterior: o "o que foi encontrado" do cartão. */
  anterior: { numero: string; titulo: string; assinado: boolean };
  cumpridas: Array<{ etapaId: string; numero: string; titulo: string }>;
}

/**
 * O que a ponte devolve em `fluxo.avaliar`.
 *
 * Quando não há sugestão, vem o MOTIVO. "Nada aconteceu" é o pior resultado
 * possível: quem mapeou o rito, ligou o fluxo e abriu o processo não tem como
 * saber se errou o tipo, se o rito já está cumprido ou se a ferramenta quebrou.
 * O Estúdio usa isto para explicar o silêncio na própria tela.
 */
export interface RespostaFluxo {
  sugestao: SugestaoDeFluxo | null;
  /** Ausente quando há sugestão. */
  motivo?: MotivoSemSugestao;
  protocolo?: string;
  tipo?: string;
  /** Fluxo que se aplica ao processo, mesmo sem sugestão. */
  fluxoId?: string;
  /** "rito-cumprido": última etapa cumprida. */
  etapaAtualId?: string;
  /** "rito-nao-comecou": etapa que o fluxo espera primeiro. */
  primeiraId?: string;
  /** "ignorada": etapa que falta, mas está silenciada neste processo. */
  etapaIgnoradaId?: string;
  cumpridas?: number;
}

/**
 * Algum fluxo ligado ainda PODE casar com um processo deste tipo?
 *
 * O tipo vem da tela, de graça. Um fluxo que declara tipos e não casa nenhum
 * está descartado sem ler a árvore — sem isto, uma unidade com um fluxo de PAF
 * buscaria a árvore de todo processo que abrisse, de qualquer tipo. Fluxo sem
 * critério de tipo não dá para descartar: esse manda buscar.
 */
function podeCasarPeloTipo(fluxos: Fluxo[], tipo: string | undefined): boolean {
  // Tela sem tipo é DESCONHECIDO, não "nenhum": aí não se descarta nada.
  if (!tipo) return true;
  return fluxos.some((f) => {
    const tipos = f.aplicaSe.tipoProcessoContem;
    return !tipos?.length || tipos.some((t) => contem(tipo, t));
  });
}

/**
 * Avalia os fluxos do usuário contra um processo.
 *
 * BUSCA A ÁRVORE COMPLETA (`sei.arvore`, com as pastas abertas) em vez de ler o
 * iframe da tela. O desenho original lia o DOM vivo para não gerar requisição
 * nenhuma; a prova em campo derrubou a regra: num Procedimento de Fiscalização
 * real da ANTAQ, com seis pastas, a árvore recém-carregada tem 16 dos 111 nós.
 * O fluxo não sugeria nada, sem avisar — e uma ferramenta que lê o processo
 * pela metade não cumpre o papel dela. (Decisão do autor, 23/09/2026.)
 *
 * A carga fica contida por quatro coisas: só o painel do agente aberto dispara
 * isto; só há busca quando há processo na tela E a unidade tem fluxo ligado; o
 * tipo da tela já descarta fluxo que não pode casar; e o `sei.arvore` guarda o
 * que buscou por 30 s.
 *
 * A saída é REDUZIDA a ids e texto: nenhum link assinado nem `infra_hash`
 * atravessa a ponte.
 */
const avaliarFluxo: Op = async (sei, a, sinal): Promise<RespostaFluxo> => {
  const fluxos = (a.fluxos as Fluxo[]) ?? [];
  const processo = txt(a.processo);
  const tipoDaTela = txt(a.tipo);
  if (!processo) return { sugestao: null, motivo: "sem-processo" };
  const ligados = fluxos.filter((f) => f.ativo);
  if (!ligados.length) return { sugestao: null, motivo: "sem-fluxo-ligado" };
  if (!podeCasarPeloTipo(ligados, tipoDaTela)) return { sugestao: null, motivo: "nao-se-aplica", tipo: tipoDaTela };

  const arv = await sei.arvore(processo, { sinal });
  const d = diagnosticar(ligados, processoParaFluxo(arv, txt(a.unidade)), (a.ignorados as Ignorados) ?? {});
  const comum: RespostaFluxo = {
    sugestao: null,
    protocolo: arv.protocolo,
    tipo: arv.tipo,
    ...(d.fluxo ? { fluxoId: d.fluxo.id } : {}),
    ...(d.avaliacao ? { cumpridas: d.avaliacao.cumpridas.length } : {}),
  };
  if (!d.sugestao) {
    return {
      ...comum,
      motivo: d.motivo,
      ...(d.avaliacao?.etapaAtual ? { etapaAtualId: d.avaliacao.etapaAtual.id } : {}),
      ...(d.primeira ? { primeiraId: d.primeira.id } : {}),
      ...(d.lacunaIgnorada ? { etapaIgnoradaId: d.lacunaIgnorada.etapa.id } : {}),
    };
  }
  const { fluxo, avaliacao, lacuna } = d.sugestao;
  return {
    ...comum,
    sugestao: {
      protocolo: arv.protocolo,
      fluxoId: fluxo.id,
      etapaId: lacuna.etapa.id,
      etapaAnteriorId: lacuna.etapaAnterior.id,
      anterior: { numero: lacuna.anterior.numero, titulo: lacuna.anterior.titulo, assinado: lacuna.anterior.assinado },
      cumpridas: avaliacao.cumpridas.map((c) => ({ etapaId: c.etapa.id, numero: c.documento.numero, titulo: c.documento.titulo })),
    },
  };
};

function bytesParaBase64(b: Uint8Array): string {
  let s = "";
  for (let i = 0; i < b.length; i += 0x8000) s += String.fromCharCode(...b.subarray(i, i + 0x8000));
  return btoa(s);
}

const LIMITE_ARQUIVO = 25 * 1024 * 1024;

export const OPERACOES: Record<string, Op> = {
  "caixa.listar": async (sei, a, sinal) => {
    const r = await listarCaixa(sei, { limite: Number(a.limite ?? 2000), sinal });
    return {
      total: r.total,
      processos: r.processos.map((p) =>
        p.sigiloso
          ? { protocolo: p.protocolo, grupo: p.grupo, sigiloso: true }
          : { protocolo: p.protocolo, grupo: p.grupo, tipo: p.tipo, especificacao: p.especificacao, novo: p.novo, atribuido: p.atribuido, sinais: p.sinais },
      ),
    };
  },

  "blocos.listar": async (sei, a, sinal) => {
    const blocos = await listarBlocos(sei, (a.tipo as TipoBloco) ?? "assinatura", { filtro: txt(a.filtro), concluidos: Boolean(a.concluidos), sinal });
    return blocos.map(({ link: _l, ...b }) => b);
  },

  "bloco.conteudo": async (sei, a, sinal) => {
    const r = await conteudoDoBloco(sei, String(a.bloco), { tipo: a.tipo as TipoBloco | undefined, sinal });
    const { link: _l, ...bloco } = r.bloco;
    return { bloco, itens: r.itens };
  },

  "bloco.incluir": (sei, a, sinal) =>
    incluirNoBloco(sei, String(a.bloco), (a.documentos as string[]) ?? [], { disponibilizar: a.disponibilizar === true }, { aplicar: aplicar(a), sinal }),

  "bloco.criar": (sei, a, sinal) =>
    criarBloco(
      sei,
      { tipo: a.tipo as TipoBloco | undefined, descricao: String(a.descricao ?? ""), unidades: (a.unidades as string[]) ?? [], grupo: a.grupo ? String(a.grupo) : undefined },
      { aplicar: aplicar(a), sinal },
    ),

  "bloco.mudar": (sei, a, sinal) => mudarBloco(sei, String(a.bloco), a.acao as AcaoDeBloco, { aplicar: aplicar(a), sinal }),

  "bloco.retirar": (sei, a, sinal) => retirarDoBloco(sei, String(a.bloco), (a.itens as string[]) ?? [], { aplicar: aplicar(a), sinal }),

  // A senha chega do painel (cartão de aprovação) e só vai para o POST.
  "bloco.assinar": (sei, a, sinal) =>
    assinarBloco(sei, String(a.bloco), { documentos: a.documentos as string[] | undefined, cargo: txt(a.cargo), senha: txt(a.senha) }, { aplicar: aplicar(a), sinal }),

  "processo.consultar": async (sei, a, sinal) => {
    const p = await consultarProcesso(sei, String(a.processo), { sinal });
    const { idProcedimento: _id, ...resto } = p;
    return resto;
  },

  "processo.arvore": async (sei, a, sinal) => {
    const arv = await sei.arvore(String(a.processo), { sinal, forcar: a.forcar === true });
    if (arv.nivel === "sigiloso") throw new ErroSei("SEI_SIGILOSO", "Processo sigiloso: o agente n\u00E3o atua nele.");
    return resumoArvore(arv);
  },

  "processo.historico": async (sei, a, sinal) =>
    andamentos(sei, String(a.processo), { tipo: (a.tipo as TipoHistorico) ?? "resumido", limite: Number(a.limite ?? 200), sinal }),

  "processo.marcadores": async (sei, a, sinal) => (await marcadoresDoProcesso(sei, String(a.processo), sinal)).map(({ id: _id, ...m }) => m),

  "processo.alterar": (sei, a, sinal) => alterarProcesso(sei, String(a.processo), a.alteracao as AlteracaoProcesso, { aplicar: aplicar(a), sinal }),
  "processo.concluir": (sei, a, sinal) => concluirProcesso(sei, String(a.processo), { reabrirEm: txt(a.reabrir_em) }, { aplicar: aplicar(a), sinal }),
  "processo.reabrir": (sei, a, sinal) => reabrirProcesso(sei, String(a.processo), { aplicar: aplicar(a), sinal }),
  "processo.enviar": (sei, a, sinal) =>
    enviarProcesso(
      sei,
      String(a.processo),
      { unidades: (a.unidades as string[]) ?? [], manterAberto: a.manter_aberto === true, removerAnotacao: a.remover_anotacao === true, enviarEmail: a.enviar_email === true, retornoEm: txt(a.retorno_em) },
      { aplicar: aplicar(a), sinal },
    ),
  // A senha chega do painel (digitada pelo usuário no cartão de aprovação) e só vai para o POST.
  "documento.assinar": (sei, a, sinal) => assinarDocumento(sei, String(a.numero), { cargo: txt(a.cargo), senha: txt(a.senha) }, { aplicar: aplicar(a), sinal }),
  "documento.excluir": (sei, a, sinal) => excluirDocumento(sei, String(a.numero), { aplicar: aplicar(a), sinal }),
  "documento.cancelar": (sei, a, sinal) => cancelarDocumento(sei, String(a.numero), String(a.motivo ?? ""), { aplicar: aplicar(a), sinal }),
  "documento.cancelarAssinatura": (sei, a, sinal) => cancelarAssinatura(sei, String(a.numero), { aplicar: aplicar(a), sinal }),
  ciencia: (sei, a, sinal) => darCiencia(sei, String(a.alvo), { processo: a.processo === true }, { aplicar: aplicar(a), sinal }),
  "processo.marcador": (sei, a, sinal) =>
    definirMarcador(sei, String(a.processo), { marcador: String(a.marcador), texto: txt(a.texto), remover: a.remover === true }, { aplicar: aplicar(a), sinal }),
  "processo.anotacao": (sei, a, sinal) =>
    definirAnotacao(sei, String(a.processo), { texto: String(a.texto ?? ""), prioridade: a.prioridade as boolean | undefined }, { aplicar: aplicar(a), sinal }),
  "processo.andamento": (sei, a, sinal) => registrarAndamento(sei, String(a.processo), String(a.texto), { aplicar: aplicar(a), sinal }),
  "processo.atribuir": (sei, a, sinal) => atribuirProcesso(sei, String(a.processo), a.usuario ? String(a.usuario) : null, { aplicar: aplicar(a), sinal }),
  "processo.acompanhamento": (sei, a, sinal) =>
    definirAcompanhamento(sei, String(a.processo), { grupo: txt(a.grupo), observacao: txt(a.observacao) }, { aplicar: aplicar(a), sinal }),

  "documento.ler": async (sei, a, sinal) => {
    const d = await localizarDocumento(sei, String(a.numero), { sinal });
    const meta = { ...resumoDocumento(d.documento), processo: d.arvore.protocolo };
    if (a.somenteMetadados === true) return meta;
    const c = await lerConteudo(sei, d, { sinal });
    if (c.forma === "html") {
      const corpo = /<body[^>]*>([\s\S]*)<\/body>/i.exec(c.html)?.[1] ?? c.html;
      return { ...meta, conteudo: { forma: "texto", texto: textoDoHtml(corpo.replace(/<(script|style)[\s\S]*?<\/\1>/gi, "")) } };
    }
    const { bytes, tipo, nome } = c.arquivo;
    if (/^text\/|html|xml|json|csv/.test(tipo)) return { ...meta, conteudo: { forma: "texto", texto: new TextDecoder().decode(bytes) } };
    if (bytes.length > LIMITE_ARQUIVO) return { ...meta, conteudo: { forma: "grande", tipo, tamanho: bytes.length } };
    // PDF e imagem viram texto no painel (pdf.js / OCR), fora do alcance da página.
    return { ...meta, conteudo: { forma: "arquivo", tipo, nome, base64: bytesParaBase64(bytes) } };
  },

  /**
   * Cria e, quando aplicado, devolve junto o CATÁLOGO DE ESTILOS do documento
   * recém-criado — que é o que o modelo precisa para escrever o conteúdo com a
   * formatação daquele órgão. Ler os estilos é cortesia: se falhar, a criação
   * (que já deu certo no SEI) volta assim mesmo.
   */
  "documento.criar": async (sei, a, sinal) => {
    const r = await criarDocumento(sei, String(a.processo), a.novo as NovoDocumento, { aplicar: aplicar(a), sinal });
    const numero = r.dados?.numero;
    if (!r.aplicado || !numero) return r;
    const estilos = await estilosDoDocumento(sei, numero, sinal).catch(() => null);
    return estilos ? { ...r, dados: { ...r.dados }, estilos } : r;
  },

  "documento.estilos": async (sei, a, sinal) => estilosDoDocumento(sei, String(a.numero), sinal),

  /**
   * Documentos do mesmo tipo para o agente aprender estrutura e linguagem.
   *
   * Duas buscas: uma restrita ao mesmo tipo de processo e outra ampla. A
   * restrita sozinha devolveria pouco em unidade nova; a ampla sozinha
   * devolveria Despacho de férias para quem escreve Despacho de fiscalização.
   * A ordenação junta as duas (ver `ordenarSimilares`).
   */
  "documentos.similares": async (sei, a, sinal) => {
    const tipoDocumento = String(a.tipo_documento ?? "").trim();
    if (!tipoDocumento) throw new ErroSei("ARGUMENTO_INVALIDO", "Informe o tipo de documento a procurar.");
    const tipoProcesso = txt(a.tipo_processo) ?? "";
    const limite = Math.min(Number(a.limite ?? 6), 20);
    const buscar = (tp?: string) =>
      pesquisar(sei, { em: "documentos", tipoDocumento, tipoProcesso: tp, limite: 40 }, sinal).then((r) => r.resultados).catch(() => [] as ResultadoPesquisa[]);
    const doTipo = tipoProcesso ? await buscar(tipoProcesso) : [];
    const gerais = await buscar(undefined);
    const { usuario } = sei.contexto();
    const ordenados = ordenarSimilares([...doTipo, ...gerais], {
      login: usuario.login,
      nome: usuario.nome,
      tipoProcesso,
      excluirProcesso: txt(a.excluir_processo),
    });
    return {
      total: ordenados.length,
      usuario: usuario.login,
      candidatos: ordenados.slice(0, limite).map((r) => ({
        processo: r.protocolo,
        tipoProcesso: r.tipoProcesso,
        documento: r.documento?.numero ?? "",
        tipo: r.documento?.tipo ?? "",
        unidade: r.unidade,
        usuario: r.usuario,
        data: r.data,
        meu: r.meu === true,
        mesmoTipoProcesso: r.mesmoTipoProcesso === true,
      })),
    };
  },
  "documento.alterar": (sei, a, sinal) => alterarDocumento(sei, String(a.numero), a.alteracao as AlteracaoDocumento, { aplicar: aplicar(a), sinal }),
  "documento.editar": (sei, a, sinal) =>
    editarConteudo(sei, String(a.numero), { html: String(a.html), modo: a.modo as "substituir" | "acrescentar" | undefined, secao: txt(a.secao) }, { aplicar: aplicar(a), sinal }),

  pesquisar: (sei, a, sinal) =>
    pesquisar(
      sei,
      {
        texto: txt(a.texto),
        em: a.em === "documentos" ? "documentos" : "processos",
        especificacao: txt(a.especificacao),
        tipoProcesso: txt(a.tipo_processo),
        tipoDocumento: txt(a.tipo_documento),
        numeroDocumento: txt(a.numero_documento),
        dataInicio: txt(a.data_inicio),
        dataFim: txt(a.data_fim),
        limite: a.limite === undefined ? undefined : Number(a.limite),
      },
      sinal,
    ),
  opcoes: (sei, a, sinal) => listarOpcoes(sei, a.lista as ListaOpcoes, String(a.processo), { filtro: txt(a.filtro), sinal }),

  "fluxo.avaliar": avaliarFluxo,
};

export async function executarOperacao(sei: Sei, op: string, args: Record<string, unknown>, sinal: AbortSignal): Promise<unknown> {
  const f = OPERACOES[op];
  if (!f) throw new ErroSei("ARGUMENTO_INVALIDO", `Opera\u00E7\u00E3o desconhecida: ${op}`);
  return f(sei, args, sinal);
}

/**
 * Estilos de parágrafo que o editor daquele documento oferece, seção a seção.
 *
 * Lista fixa NÃO serve: o conjunto de estilos é configurável por órgão e por
 * seção do modelo, e o SEI ignora em silêncio a classe que não existe — o
 * documento sai sem formatação e ninguém vê erro nenhum.
 *
 * ABRE O EDITOR do documento para ler a configuração (é de lá que a lista sai).
 * No caminho normal isso não custa nada a mais: quem vai escrever abriria o
 * editor logo em seguida.
 */
async function estilosDoDocumento(sei: Sei, numero: string, sinal: AbortSignal) {
  const d = await localizarDocumento(sei, numero, { sinal });
  return resumoEstilos(await abrirEditor(sei, d, sinal), d.documento.numero);
}

function resumoEstilos(ed: EditorDocumento, numero: string) {
  return {
    documento: numero,
    editor: ed.tipo,
    secoes: ed.secoes
      .filter((sec) => !sec.somenteLeitura)
      .map((sec) => ({
        secao: sec.nome,
        titulo: sec.titulo,
        ...(sec.principal ? { principal: true } : {}),
        ...(sec.estiloPadrao ? { estiloPadrao: sec.estiloPadrao } : {}),
        estilos: sec.estilos.map((e) => e.classe),
      })),
  };
}

/** Um candidato a documento parecido, já classificado. */
export interface Similar extends ResultadoPesquisa {
  /** Gerado ou assinado pelo usuário que está pedindo. */
  meu?: boolean;
  mesmoTipoProcesso?: boolean;
}

/** "10/09/2026 14:30" → número comparável. Data vazia vai para o fim. */
function quando(data: string): number {
  const m = /(\d{2})\/(\d{2})\/(\d{4})/.exec(data);
  return m ? Number(`${m[3]}${m[2]}${m[1]}`) : 0;
}

/**
 * Ordena os candidatos a "documento parecido".
 *
 * A ordem É a regra de negócio, e foi pedida assim: mesmo TIPO DE PROCESSO
 * primeiro (é o que faz o documento se parecer de verdade — um Despacho de
 * fiscalização não se parece com um Despacho de férias), depois os do próprio
 * usuário, depois os mais recentes.
 *
 * O SEI não devolve o assinante na pesquisa, só o usuário que gerou. Quem
 * assinou sem gerar não é reconhecido aqui; o agente confere ao ler o
 * documento, onde as assinaturas aparecem.
 */
export function ordenarSimilares(
  itens: ResultadoPesquisa[],
  o: { login: string; nome: string; tipoProcesso: string; excluirProcesso?: string },
): Similar[] {
  const meuLogin = normalizar(o.login);
  const meuNome = normalizar(o.nome);
  // Compara por PALAVRA: "pedro.soares.junior" não é "pedro.soares".
  const souEu = (usuario: string) => {
    const partes = normalizar(usuario).split(/[^a-z0-9._-]+/).filter(Boolean);
    return Boolean(meuLogin) && (partes.includes(meuLogin) || (Boolean(meuNome) && normalizar(usuario).startsWith(meuNome)));
  };
  const vistos = new Set<string>();
  const saida: Similar[] = [];
  for (const r of itens) {
    if (o.excluirProcesso && r.protocolo === o.excluirProcesso) continue;
    const chave = `${r.protocolo}|${r.documento?.numero ?? ""}`;
    if (vistos.has(chave)) continue;
    vistos.add(chave);
    saida.push({ ...r, meu: souEu(r.usuario), mesmoTipoProcesso: Boolean(o.tipoProcesso) && contem(r.tipoProcesso, o.tipoProcesso) });
  }
  const peso = (x: Similar) => (x.mesmoTipoProcesso ? 2 : 0) + (x.meu ? 1 : 0);
  return saida.sort((a, b) => peso(b) - peso(a) || quando(b.data) - quando(a.data));
}

/** O que a tela do SEI deve mostrar depois de uma escrita do agente. */
export interface AlvoNaTela {
  /** id interno do documento (o nó da árvore é `#anchor<id>`). */
  id?: string;
  /** nº SEI, quando o id interno não é conhecido. */
  numero?: string;
  /** A árvore mudou de conteúdo e precisa ser relida. */
  recarregarArvore: boolean;
}

/**
 * Decide se a tela do SEI muda depois de uma escrita, e em que documento.
 *
 * Criar documento pela ponte deixava a árvore velha: o documento existia no SEI
 * e não aparecia na tela até alguém recarregar à mão. Editar o conteúdo tinha o
 * problema irmão — a árvore já estava certa, mas o visualizador seguia
 * mostrando o texto antigo (ou vazio, no documento recém-nascido).
 *
 * O que ESTA função guarda é o "quando não": prévia não mexe na tela (nada foi
 * ao SEI), escrita não aplicada não mexe, e operação que não é de documento não
 * mexe. Recarregar a árvore por engano faz o usuário perder a pasta que tinha
 * aberto.
 */
export function alvoParaMostrar(op: string, args: Record<string, unknown>, resultado: unknown): AlvoNaTela | null {
  const r = resultado as { aplicado?: boolean; dados?: Record<string, string> } | null;
  if (!r || typeof r !== "object" || r.aplicado !== true) return null;
  if (op === "documento.criar") {
    const id = r.dados?.idDocumento;
    return id ? { id, recarregarArvore: true } : null;
  }
  if (op === "documento.editar") {
    const numero = txt(args.numero);
    // A árvore não muda ao editar conteúdo: recarregá-la fecharia as pastas que
    // o usuário abriu, de graça.
    return numero ? { numero, recarregarArvore: false } : null;
  }
  return null;
}
