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
import { editarConteudo, textoDoHtml } from "@nucleo/dominio/editor";
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
import { pesquisar } from "@nucleo/dominio/pesquisa";
import { cancelarAssinatura, cancelarDocumento, darCiencia, excluirDocumento } from "@nucleo/dominio/acoesDocumento";
import { parametros } from "@nucleo/links/links";
import { ErroSei } from "@nucleo/sessao/erros";
import type { Pagina } from "@nucleo/sessao/http";
import { lerContexto, type Sei } from "@nucleo/sei";
import type { TelaAtual } from "../motor/motor";

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
  const ifr = doc.querySelector<HTMLIFrameElement>("#ifrArvore");
  const docArvore = ifr?.contentDocument;
  if (docArvore?.documentElement) {
    try {
      const arv = lerArvore({ url: docArvore.URL, status: 200, html: docArvore.documentElement.outerHTML, doc: docArvore });
      tela.processo = { protocolo: arv.protocolo, tipo: arv.tipo, nivel: arv.nivel };
      tela.sigiloso = arv.nivel === "sigiloso";
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
      /* árvore ainda carregando */
    }
  }
  const marcados = [...doc.querySelectorAll<HTMLInputElement>("#tblProcessosRecebidos input:checked, #tblProcessosGerados input:checked, #tblProcessosDetalhado input:checked")]
    .map((i) => i.getAttribute("title") ?? "")
    .filter(Boolean);
  if (marcados.length) tela.selecionados = marcados;
  return tela;
}

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

  "documento.criar": (sei, a, sinal) => criarDocumento(sei, String(a.processo), a.novo as NovoDocumento, { aplicar: aplicar(a), sinal }),
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
};

export async function executarOperacao(sei: Sei, op: string, args: Record<string, unknown>, sinal: AbortSignal): Promise<unknown> {
  const f = OPERACOES[op];
  if (!f) throw new ErroSei("ARGUMENTO_INVALIDO", `Opera\u00E7\u00E3o desconhecida: ${op}`);
  return f(sei, args, sinal);
}
