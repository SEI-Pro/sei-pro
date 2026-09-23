/**
 * Blocos de assinatura e blocos internos (`bloco_assinatura_listar`,
 * `bloco_interno_listar`, `rel_bloco_protocolo_listar`).
 *
 * O bloco é como a unidade junta documentos para assinar de uma vez ou para
 * outra unidade trabalhar neles. A listagem traz número, estado (Gerado,
 * Disponibilizado, Retornado, Concluído), unidade geradora, as unidades a quem
 * foi disponibilizado, grupo e descrição; o número abre a relação de
 * documentos, que é outra tela (`rel_bloco_protocolo_listar&id_bloco=N`).
 *
 * Escrita também: criar, incluir documento, retirar, assinar, disponibilizar,
 * cancelar a disponibilização, retornar, concluir, reabrir e excluir. Nenhuma
 * dessas ações é um link: a tela põe o alvo em `hdnInfraItemId` e envia o
 * formulário da lista (`#frmBlocoLista`, `#frmRelBlocoProtocoloLista`) para a
 * ação assinada que está no SCRIPT da página — por isso os links se colhem do
 * HTML inteiro, não dos `href` da linha.
 *
 * O filtro da lista vem sem "Concluído": bloco concluído só aparece quando se
 * marcam todos os estados, e o filtro é devolvido como estava depois.
 *
 * Substitui no legado: nada — o SEI Pro não tinha nada de blocos.
 */

import type { OpcoesEscrita, ResultadoEscrita } from "./escrita";
import { Formulario, normalizar } from "../formulario/formulario";
import { acaoNaArvore } from "./arvore";
import { localizarDocumento } from "./documento";
import { resolverUnidade } from "./tramitacao";
import { linkDaAcao, linksAssinados, parametros } from "../links/links";
import { decodificarEntidades, textoDe } from "../sessao/dom";
import { ErroSei } from "../sessao/erros";
import type { OpcoesHttp, Pagina } from "../sessao/http";
import type { Sei } from "../sei";

export type TipoBloco = "assinatura" | "interno";

export interface Bloco {
  numero: string;
  tipo: TipoBloco;
  /** Gerado, Disponibilizado, Retornado, Concluído. */
  estado: string;
  descricao: string;
  /** Unidade que gerou o bloco. */
  geradora: string;
  /** Unidades a quem o bloco foi disponibilizado. */
  disponibilizado: string[];
  grupo: string;
  atribuido: string;
  /** Link da relação de documentos (`rel_bloco_protocolo_listar`). */
  link: string;
}

/**
 * Linha do conteúdo de um bloco. No bloco de ASSINATURA cada linha é um
 * DOCUMENTO (com processo, nº SEI e quem já assinou); no bloco INTERNO é um
 * PROCESSO (sem documento e sem assinaturas) — a tela tem colunas diferentes.
 */
export interface ItemDoBloco {
  sequencia: string;
  processo: string;
  documento?: string;
  /** Tipo do documento (assinatura) ou do processo (interno). */
  tipo: string;
  assinaturas?: string[];
  anotacao?: string;
}

const ACAO: Record<TipoBloco, string> = {
  assinatura: "bloco_assinatura_listar",
  interno: "bloco_interno_listar",
};

/** Texto de uma célula, com as várias unidades separadas por barra virando lista. */
const lista = (texto: string): string[] =>
  texto
    .split(/[\n;/]|\s{2,}/)
    .map((x) => x.trim())
    .filter(Boolean);

/**
 * Colunas pelo CABEÇALHO, não pela posição: o bloco interno não tem a coluna
 * "Disponibilização" que o de assinatura tem, e contar índices trocaria grupo
 * por descrição — em silêncio.
 */
function colunas(tabela: Element | null): Record<string, number> {
  const mapa: Record<string, number> = {};
  const cabecalho = [...(tabela?.querySelectorAll("tr") ?? [])].find((tr) => tr.querySelector("th")) ?? tabela?.querySelector("tr");
  [...(cabecalho?.querySelectorAll("th, td") ?? [])].forEach((c, i) => {
    // "Seq." e "Nº" viram "seq" e "n": pontuação fora, só letras e números.
    const nome = normalizar(textoDe(c)).replace(/[^a-z0-9 ]/g, "").trim();
    if (nome) mapa[nome] = i;
  });
  return mapa;
}

function lerBlocos(p: Pagina, tipo: TipoBloco): Bloco[] {
  const tabela = p.doc.querySelector("#tblBlocos");
  const col = colunas(tabela);
  const blocos: Bloco[] = [];
  for (const tr of tabela?.querySelectorAll("tr") ?? []) {
    const chk = tr.querySelector("input[type=checkbox]");
    const numero = chk?.getAttribute("value") ?? "";
    if (!numero) continue;
    const tds = [...tr.querySelectorAll("td")];
    const celula = (nome: string) => (col[nome] === undefined ? "" : textoDe(tds[col[nome]]).replace(/\s+/g, " ").trim());
    const link = [...tr.querySelectorAll("a")]
      .map((a) => a.getAttribute("href") ?? "")
      .find((h) => h.includes("rel_bloco_protocolo_listar"));
    blocos.push({
      numero,
      tipo,
      estado: celula("estado"),
      descricao: celula("descricao"),
      geradora: celula("geradora"),
      disponibilizado: lista(celula("disponibilizacao")),
      grupo: celula("grupo"),
      atribuido: celula("atribuicao"),
      link: (link ?? "").replace(/&amp;/g, "&"),
    });
  }
  return blocos;
}

/** Blocos da unidade. `filtro` casa com número, descrição, estado ou grupo. */
/** Caixas de estado do filtro da tela de blocos (a de concluído vem desmarcada). */
const ESTADOS_FILTRO = ["chkSinEstadoGerado", "chkSinEstadoDisponibilizado", "chkSinEstadoRecebido", "chkSinEstadoRetornado", "chkSinEstadoConcluido"];

async function abrirLista(sei: Sei, tipo: TipoBloco, sinal?: AbortSignal): Promise<{ pagina: Pagina; blocos: Bloco[] }> {
  const pagina = await sei.http.obter(sei.linkMenu(ACAO[tipo]), { sinal, aceitarValidacao: true });
  return { pagina, blocos: lerBlocos(pagina, tipo) };
}

/**
 * A mesma tela com TODOS os estados marcados — sem isso, bloco concluído
 * simplesmente não aparece (o filtro do SEI vem sem "Concluído") e reabrir ou
 * excluir um bloco concluído viraria "bloco não encontrado".
 *
 * O filtro fica guardado na sessão do SEI, então o que foi marcado aqui é
 * devolvido ao estado anterior antes de sair.
 */
async function abrirListaCompleta(
  sei: Sei,
  tipo: TipoBloco,
  sinal?: AbortSignal,
): Promise<{ pagina: Pagina; blocos: Bloco[]; restaurar: () => Promise<void> }> {
  const inicial = await abrirLista(sei, tipo, sinal);
  const marcadas = ESTADOS_FILTRO.filter((c) => inicial.pagina.doc.querySelector(`#${c}`)?.hasAttribute("checked"));
  const faltando = ESTADOS_FILTRO.filter((c) => !marcadas.includes(c) && inicial.pagina.doc.querySelector(`#${c}`));
  if (!faltando.length) return { ...inicial, restaurar: async () => {} };

  const filtro = (ligadas: string[]) =>
    Formulario.de(inicial.pagina, "#frmBlocoLista", sei.http).definir({
      ...Object.fromEntries(ESTADOS_FILTRO.map((c) => [c, ligadas.includes(c) ? "on" : null])),
      hdnInfraItemId: "",
      hdnInfraItensSelecionados: "",
    });
  const pagina = await filtro(ESTADOS_FILTRO).enviar({ sinal, botao: "sbmPesquisar", aceitarValidacao: true });
  return {
    pagina,
    blocos: lerBlocos(pagina, tipo),
    restaurar: async () => {
      await filtro(marcadas).enviar({ sinal, botao: "sbmPesquisar", aceitarValidacao: true });
    },
  };
}

export async function listarBlocos(
  sei: Sei,
  tipo: TipoBloco = "assinatura",
  o: { filtro?: string; concluidos?: boolean; sinal?: AbortSignal } = {},
): Promise<Bloco[]> {
  let todos: Bloco[];
  if (o.concluidos) {
    const completa = await abrirListaCompleta(sei, tipo, o.sinal);
    todos = completa.blocos;
    await completa.restaurar();
  } else {
    todos = (await abrirLista(sei, tipo, o.sinal)).blocos;
  }
  if (!o.filtro) return todos;
  const f = o.filtro.toLowerCase();
  return todos.filter((b) => [b.numero, b.descricao, b.estado, b.grupo].join(" ").toLowerCase().includes(f));
}

/** Um bloco pelo número, procurando nos dois tipos quando não se sabe qual é. */
export async function acharBloco(sei: Sei, numero: string, tipo?: TipoBloco, op?: OpcoesHttp): Promise<Bloco> {
  const alvo = String(numero).trim();
  const tipos = tipo ? [tipo] : (["assinatura", "interno"] as TipoBloco[]);
  for (const t of tipos) {
    const achado = (await listarBlocos(sei, t, { sinal: op?.sinal })).find((b) => b.numero === alvo);
    if (achado) return achado;
  }
  // Não estava na lista do dia a dia: pode ser um bloco concluído, que o filtro esconde.
  for (const t of tipos) {
    const completa = await abrirListaCompleta(sei, t, op?.sinal);
    const achado = completa.blocos.find((b) => b.numero === alvo);
    await completa.restaurar();
    if (achado) return achado;
  }
  throw new ErroSei("SEI_NAO_ENCONTRADO", `A unidade não tem o bloco ${numero} na lista de blocos${tipo ? ` de ${tipo}` : ""}.`);
}

/** A tela do bloco com o valor do checkbox de cada linha (`idDocumento-idBloco`), que a assinatura em lote exige. */
async function abrirBloco(
  sei: Sei,
  numero: string,
  o: { tipo?: TipoBloco; sinal?: AbortSignal },
): Promise<{ bloco: Bloco; pagina: Pagina; linhas: Array<{ campo: string; item: string; acoes: string; dados: ItemDoBloco }> }> {
  const bloco = await acharBloco(sei, numero, o.tipo, { sinal: o.sinal });
  if (!bloco.link) throw new ErroSei("SEI_ACAO_INDISPONIVEL", `O SEI n\u00E3o oferece abrir o bloco ${numero}.`);
  const pagina = await sei.http.obter(bloco.link, { sinal: o.sinal, aceitarValidacao: true });
  if (parametros(pagina.url).get("acao") !== "rel_bloco_protocolo_listar") {
    throw new ErroSei("SEI_RESPOSTA_INESPERADA", `A tela do bloco ${numero} n\u00E3o veio como esperado.`);
  }
  const tabela = pagina.doc.querySelector("#tblProtocolosBlocos");
  const col = colunas(tabela);
  const linhas: Array<{ campo: string; item: string; acoes: string; dados: ItemDoBloco }> = [];
  for (const tr of tabela?.querySelectorAll("tr") ?? []) {
    const chk = tr.querySelector("input[type=checkbox]");
    if (!chk) continue;
    const tds = [...tr.querySelectorAll("td")];
    const celula = (nome: string) => (col[nome] === undefined ? "" : textoDe(tds[col[nome]]).replace(/\s+/g, " ").trim());
    const documento = celula("documento");
    const assinaturas = col.assinaturas === undefined ? [] : lista(textoDe(tds[col.assinaturas]));
    const anotacao = celula("anotacoes");
    linhas.push({
      campo: chk.getAttribute("name") ?? "",
      item: chk.getAttribute("value") ?? "",
      acoes: tr.innerHTML,
      dados: {
        sequencia: celula("seq"),
        processo: celula("processo"),
        tipo: celula("tipo"),
        ...(documento ? { documento } : {}),
        ...(assinaturas.length ? { assinaturas } : {}),
        ...(anotacao ? { anotacao } : {}),
      },
    });
  }
  return { bloco, pagina, linhas };
}

/** Conteúdo de um bloco, na ordem da tela: documentos (assinatura) ou processos (interno). */
export async function conteudoDoBloco(
  sei: Sei,
  numero: string,
  o: { tipo?: TipoBloco; sinal?: AbortSignal } = {},
): Promise<{ bloco: Bloco; itens: ItemDoBloco[] }> {
  const { bloco, linhas } = await abrirBloco(sei, numero, o);
  return { bloco, itens: linhas.map((l) => l.dados) };
}

/**
 * Assina, de uma vez, os documentos de um bloco de assinatura — o que a tela
 * faz com o botão "Assinar" depois de marcar as caixas.
 *
 * O caminho é o do próprio SEI: a lista do bloco (`#frmRelBlocoProtocoloLista`)
 * é postada para `documento_assinar` com os itens marcados em
 * `hdnInfraItensSelecionados` (`idDocumento-idBloco`, separados por vírgula);
 * o SEI responde com a tela de assinatura, a mesma de um documento só.
 *
 * Sem `senha`, é a prévia: diz o que seria assinado e devolve os cargos em
 * `dados.cargos`. Quem já assinou fica de fora — assinar de novo não faz nada
 * e só confundiria a prévia.
 */
export async function assinarBloco(
  sei: Sei,
  numero: string,
  a: { documentos?: string[]; cargo?: string; senha?: string },
  op: OpcoesEscrita,
): Promise<ResultadoEscrita> {
  const { bloco, pagina, linhas } = await abrirBloco(sei, numero, { tipo: "assinatura", sinal: op.sinal });
  if (bloco.tipo !== "assinatura") throw new ErroSei("ARGUMENTO_INVALIDO", `O bloco ${numero} \u00E9 interno: bloco interno n\u00E3o se assina.`);
  const usuario = sei.contexto().usuario.nome;
  const pedidos = (a.documentos ?? []).map((d) => String(d).trim()).filter(Boolean);
  const escolhidas = pedidos.length ? linhas.filter((l) => pedidos.includes(l.dados.documento ?? "")) : linhas;
  if (pedidos.length) {
    const faltando = pedidos.filter((d) => !linhas.some((l) => l.dados.documento === d));
    if (faltando.length) throw new ErroSei("ARGUMENTO_INVALIDO", `O bloco ${numero} n\u00E3o tem ${faltando.join(", ")}.`);
  }
  // A coluna de assinaturas junta nome e cargo sem separador confiável
  // ("Coordenador(a)Fulano de Tal"), então a checagem é por CONTER o nome.
  const assinou = (l: { dados: ItemDoBloco }) => normalizar((l.dados.assinaturas ?? []).join(" ")).includes(normalizar(usuario));
  const pendentes = escolhidas.filter((l) => !assinou(l));
  const base: ResultadoEscrita = {
    alvo: `bloco ${bloco.numero}`,
    mudancas: pendentes.map((l) => ({
      campo: `Documento ${l.dados.documento}`,
      antes: (l.dados.assinaturas ?? []).length ? `assinado por ${(l.dados.assinaturas ?? [])[0]}` : "sem assinatura",
      depois: `assinado por ${usuario}${a.cargo ? ` (${a.cargo})` : ""}`,
    })),
    aplicado: false,
    resumo: "",
  };
  if (!pendentes.length) {
    return { ...base, resumo: `Voc\u00EA j\u00E1 assinou ${escolhidas.length === 1 ? "esse documento" : "todos esses documentos"} do bloco ${bloco.numero}.` };
  }

  // O POST abaixo só ABRE a tela de assinatura (é o que o botão da tela faz);
  // quem assina é o segundo envio, com a senha.
  // O link da assinatura em lote é o que NÃO traz `id_documento`: os primeiros
  // `documento_assinar` do HTML são os de cada linha, e usá-los assinaria o
  // documento daquela linha — não a seleção.
  const link = linksAssinados(pagina.html).find((l) => {
    const q = parametros(l);
    return q.get("acao") === "documento_assinar" && !q.get("id_documento") && q.get("id_bloco");
  });
  if (!link) throw new ErroSei("SEI_ACAO_INDISPONIVEL", `O SEI n\u00E3o oferece assinar o bloco ${bloco.numero} (ele pode estar conclu\u00EDdo ou ser de outra unidade).`);
  // A seleção vai como a tela manda: os checkboxes marcados E a lista escondida.
  const selecao = Formulario.de(pagina, "#frmRelBlocoProtocoloLista", sei.http).definir({
    hdnInfraItensSelecionados: pendentes.map((l) => l.item).join(","),
    hdnInfraItemId: "",
    ...Object.fromEntries(pendentes.map((l) => [l.campo, l.item])),
  });
  const tela = await sei.http.enviar(link, selecao.pares(), { sinal: op.sinal, aceitarValidacao: true });
  const form = Formulario.de(tela, "#frmAssinaturas", sei.http);
  // Trava: a tela de assinatura diz quais documentos vai assinar. Se não forem
  // exatamente os escolhidos, nada é enviado — assinar documento errado não se desfaz.
  const idsNaTela = (form.valor("hdnIdDocumentos") ?? "").split(",").map((x) => x.trim()).filter(Boolean);
  const idsEscolhidos = pendentes.map((l) => l.item.split("-")[0]);
  const iguais = idsNaTela.length === idsEscolhidos.length && idsEscolhidos.every((x) => idsNaTela.includes(x));
  if (idsNaTela.length && !iguais) {
    throw new ErroSei(
      "SEI_RESPOSTA_INESPERADA",
      `A tela de assinatura do bloco ${bloco.numero} veio com outros documentos (${idsNaTela.join(", ")}) e nada foi assinado.`,
    );
  }
  const cargos = form.opcoes("selCargoFuncao").filter((o) => o.valor && o.valor !== "null").map((o) => o.texto);
  const previa: ResultadoEscrita = {
    ...base,
    resumo: `Vai assinar ${pendentes.length} documento(s) do bloco ${bloco.numero}.`,
    dados: { cargos: cargos.join("|") },
  };
  if (!op.aplicar) return previa;
  if (!a.senha || !a.cargo) throw new ErroSei("ARGUMENTO_INVALIDO", "Para assinar \u00E9 preciso cargo e senha, informados pelo usu\u00E1rio.");

  const orgaoUsuario = normalizar(sei.contexto().usuario.orgao ?? "");
  const orgao = form.opcoes("selOrgao").find((o) => o.valor !== "null" && normalizar(o.texto) === orgaoUsuario);
  if (orgao) form.definir({ selOrgao: orgao.valor });
  form.escolher("selCargoFuncao", a.cargo);
  form.definir({ pwdSenha: a.senha, hdnFormaAutenticacao: "S" });
  await form.enviar({ sinal: op.sinal, operacao: `a assinatura do bloco ${bloco.numero}` });

  // Prova: a própria tela do bloco tem que passar a mostrar o usuário assinando.
  const depois = await abrirBloco(sei, numero, { tipo: "assinatura", sinal: op.sinal });
  const alvo = new Set(pendentes.map((l) => l.item));
  const faltou = depois.linhas.filter((l) => alvo.has(l.item) && !assinou(l));
  if (faltou.length) {
    throw new ErroSei(
      "SEI_RESPOSTA_INESPERADA",
      `O SEI n\u00E3o registrou a sua assinatura em ${faltou.map((l) => l.dados.documento).join(", ")} (senha ou cargo incorretos?).`,
    );
  }
  return { ...previa, aplicado: true, resumo: `${pendentes.length} documento(s) do bloco ${bloco.numero} assinados.`, dados: {} };
}

/**
 * Inclui documentos num bloco de assinatura — a tela "Incluir em Bloco de
 * Assinatura" (`bloco_escolher`), que lista os documentos DO PROCESSO com
 * caixas de seleção e um select com os blocos abertos da unidade.
 *
 * Como a tela é por processo, documentos de processos diferentes são incluídos
 * numa passada por processo. Documento que já está no bloco fica de fora: a
 * própria tela mostra, na coluna "Blocos", em quais ele já está.
 *
 * `disponibilizar` usa o botão "Incluir e Disponibilizar", que além de incluir
 * manda o bloco para as unidades de destino.
 */
export async function incluirNoBloco(
  sei: Sei,
  numero: string,
  documentos: string[],
  o: { disponibilizar?: boolean },
  op: OpcoesEscrita,
): Promise<ResultadoEscrita> {
  const pedidos = documentos.map((d) => String(d).trim()).filter(Boolean);
  if (!pedidos.length) throw new ErroSei("ARGUMENTO_INVALIDO", "Informe ao menos um documento para incluir no bloco.");
  const bloco = await acharBloco(sei, numero, "assinatura", { sinal: op.sinal });

  // Agrupa por processo: a tela de inclusão é de um processo só. O link dela
  // vem da ÁRVORE — a tela do documento, buscada direto, não traz a barra de
  // ações (ela depende do contexto em que o SEI a monta).
  const porProcesso = new Map<string, { link: string; documentos: string[] }>();
  for (const d of pedidos) {
    const achado = await localizarDocumento(sei, d, { sinal: op.sinal });
    if (achado.documento.nivel === "sigiloso" || achado.arvore.nivel === "sigiloso") {
      throw new ErroSei("SEI_SIGILOSO", `Documento ${d} \u00E9 sigiloso: o agente n\u00E3o atua nele.`);
    }
    const chave = achado.arvore.protocolo;
    const atual = porProcesso.get(chave) ?? { link: acaoNaArvore(achado.arvore, "bloco_escolher") ?? "", documentos: [] };
    atual.documentos.push(achado.documento.numero);
    porProcesso.set(chave, atual);
  }

  const mudancas: ResultadoEscrita["mudancas"] = [];
  const incluir: Array<{ form: Formulario; campos: Record<string, string>; itens: string[] }> = [];
  for (const [processo, grupo] of porProcesso) {
    if (!grupo.link) throw new ErroSei("SEI_ACAO_INDISPONIVEL", `O SEI n\u00E3o oferece incluir em bloco os documentos de ${processo} (processo fechado na unidade?).`);
    const form = await Formulario.abrir(sei.http, grupo.link, "#frmBlocoEscolher", { sinal: op.sinal });
    const campos: Record<string, string> = {};
    const itens: string[] = [];
    for (const alvo of grupo.documentos) {
      const linha = form.linhas("#tblDocumentos").find((tr) => [...tr.querySelectorAll("td")].some((td) => textoDe(td).trim() === alvo));
      const chk = linha?.querySelector("input[type=checkbox]");
      if (!linha || !chk) throw new ErroSei("SEI_ACAO_INDISPONIVEL", `O documento ${alvo} n\u00E3o aparece na tela de incluir em bloco (assinado por outra unidade ou externo?).`);
      const jaNoBloco = [...linha.querySelectorAll("td")].some((td) => textoDe(td).split(/[\s,]+/).includes(bloco.numero));
      if (jaNoBloco) {
        mudancas.push({ campo: `Documento ${alvo}`, antes: `j\u00E1 no bloco ${bloco.numero}`, depois: `j\u00E1 no bloco ${bloco.numero}` });
        continue;
      }
      campos[chk.getAttribute("name") ?? ""] = chk.getAttribute("value") ?? "";
      itens.push(chk.getAttribute("value") ?? "");
      mudancas.push({ campo: `Documento ${alvo}`, antes: "fora do bloco", depois: `no bloco ${bloco.numero}${o.disponibilizar ? ", disponibilizado" : ""}` });
    }
    if (itens.length) incluir.push({ form, campos, itens });
  }

  const novos = mudancas.filter((m) => m.antes !== m.depois);
  const base: ResultadoEscrita = { alvo: `bloco ${bloco.numero}`, mudancas: novos, aplicado: false, resumo: "" };
  if (!novos.length) return { ...base, resumo: `Esses documentos j\u00E1 est\u00E3o no bloco ${bloco.numero}.` };
  if (!op.aplicar) return { ...base, resumo: `Vai incluir ${novos.length} documento(s) no bloco ${bloco.numero}.` };

  for (const { form, campos, itens } of incluir) {
    form.escolher("selBloco", bloco.numero);
    // Seleção nos checkboxes E na lista escondida, como a tela faz.
    form.definir({ ...campos, hdnDocumentosItensSelecionados: itens.join(","), hdnDocumentosItemId: "" });
    await form.enviar({
      sinal: op.sinal,
      botao: o.disponibilizar ? "sbmIncluirDisponibilizar" : "sbmIncluir",
      operacao: `a inclus\u00E3o no bloco ${bloco.numero}`,
    });
  }

  const depois = await conteudoDoBloco(sei, bloco.numero, { tipo: "assinatura", sinal: op.sinal });
  const dentro = new Set(depois.itens.map((i) => i.documento));
  const faltou = pedidos.filter((d) => !dentro.has(d));
  if (faltou.length) throw new ErroSei("SEI_RESPOSTA_INESPERADA", `O SEI n\u00E3o incluiu ${faltou.join(", ")} no bloco ${bloco.numero}.`);
  return { ...base, aplicado: true, resumo: `${novos.length} documento(s) inclu\u00EDdo(s) no bloco ${bloco.numero}${o.disponibilizar ? " e o bloco foi disponibilizado" : ""}.` };
}

/**
 * Retira documentos (ou processos, no bloco interno) de um bloco — o "Excluir"
 * da tela do bloco, que tira do bloco sem apagar nada do processo.
 *
 * Cada linha traz o próprio link de retirada; aqui, ao contrário da
 * assinatura, o link POR LINHA é justamente o certo.
 */
export async function retirarDoBloco(
  sei: Sei,
  numero: string,
  itens: string[],
  op: OpcoesEscrita,
): Promise<ResultadoEscrita> {
  const pedidos = itens.map((d) => String(d).trim()).filter(Boolean);
  if (!pedidos.length) throw new ErroSei("ARGUMENTO_INVALIDO", "Informe o que retirar do bloco.");
  const cabe = (i: ItemDoBloco) => pedidos.includes(i.documento ?? "") || pedidos.includes(i.processo);
  const { bloco, linhas } = await abrirBloco(sei, numero, { sinal: op.sinal });
  const alvos = linhas.filter((l) => cabe(l.dados));
  const base: ResultadoEscrita = {
    alvo: `bloco ${bloco.numero}`,
    mudancas: alvos.map((l) => ({ campo: `Documento ${l.dados.documento ?? l.dados.processo}`, antes: `no bloco ${bloco.numero}`, depois: "fora do bloco" })),
    aplicado: false,
    resumo: "",
  };
  if (!alvos.length) return { ...base, resumo: `Nada a retirar: ${pedidos.join(", ")} n\u00E3o est\u00E1(\u00E3o) no bloco ${bloco.numero}.` };
  if (!op.aplicar) return { ...base, resumo: `Vai retirar ${alvos.length} item(ns) do bloco ${bloco.numero}.` };

  // A retirada da tela do bloco n\u00E3o \u00E9 um link: \u00E9 o `acaoExcluir(...)` do
  // pr\u00F3prio SEI, que p\u00F5e o item em `hdnInfraItemId` e envia a lista para
  // `rel_bloco_protocolo_excluir`. O link assinado dessa a\u00E7\u00E3o est\u00E1 no script
  // da p\u00E1gina (por isso `linksAssinados`, que varre o HTML inteiro).
  // Um item por vez, relendo a tela: os itens mudam de \u00EDndice a cada retirada.
  for (const alvo of alvos) {
    const atual = await abrirBloco(sei, numero, { sinal: op.sinal });
    const linha = atual.linhas.find((l) => l.item === alvo.item);
    if (!linha) continue;
    const link = linkDaAcao(atual.pagina.html, "rel_bloco_protocolo_excluir");
    if (!link) {
      throw new ErroSei("SEI_ACAO_INDISPONIVEL", `O SEI n\u00E3o oferece retirar itens do bloco ${bloco.numero} (ele pode estar conclu\u00EDdo ou ser de outra unidade).`);
    }
    const form = Formulario.de(atual.pagina, "#frmRelBlocoProtocoloLista", sei.http).definir({
      hdnInfraItemId: linha.item,
      hdnInfraItensSelecionados: "",
    });
    await sei.http.enviar(link, form.pares(), { sinal: op.sinal, aceitarValidacao: true });
  }

  const depois = await conteudoDoBloco(sei, bloco.numero, { sinal: op.sinal });
  const ainda = depois.itens.filter((i) => cabe(i));
  if (ainda.length) {
    throw new ErroSei("SEI_RESPOSTA_INESPERADA", `O SEI n\u00E3o retirou ${ainda.map((i) => i.documento ?? i.processo).join(", ")} do bloco ${bloco.numero}.`);
  }
  return { ...base, aplicado: true, resumo: `${alvos.length} item(ns) retirado(s) do bloco ${bloco.numero}.` };
}

/** O que a tela de blocos oferece por linha, além de abrir e anotar. */
export type AcaoDeBloco = "disponibilizar" | "cancelar" | "concluir" | "reabrir" | "retornar" | "excluir";

/**
 * Cada ação, a ação do SEI por trás, o estado que ela produz e os estados em
 * que ela não faz sentido (o SEI nem mostra o ícone).
 */
const ACOES: Record<AcaoDeBloco, { sei: string; vira: string; ja?: string[]; exige?: string[]; frase: (n: string) => string }> = {
  disponibilizar: { sei: "bloco_disponibilizar", vira: "Disponibilizado", ja: ["Disponibilizado"], exige: ["Gerado", "Retornado"], frase: (n) => `disponibilizar o bloco ${n}` },
  cancelar: { sei: "bloco_cancelar_disponibilizacao", vira: "Gerado", ja: ["Gerado"], exige: ["Disponibilizado"], frase: (n) => `cancelar a disponibiliza\u00E7\u00E3o do bloco ${n}` },
  concluir: { sei: "bloco_concluir", vira: "Conclu\u00EDdo", ja: ["Conclu\u00EDdo"], frase: (n) => `concluir o bloco ${n}` },
  reabrir: { sei: "bloco_reabrir", vira: "Gerado", ja: ["Gerado", "Disponibilizado", "Retornado"], exige: ["Conclu\u00EDdo"], frase: (n) => `reabrir o bloco ${n}` },
  retornar: { sei: "bloco_retornar", vira: "Retornado", ja: ["Retornado"], exige: ["Disponibilizado"], frase: (n) => `retornar o bloco ${n}` },
  excluir: { sei: "bloco_excluir", vira: "(exclu\u00EDdo)", frase: (n) => `excluir o bloco ${n}` },
};

/**
 * Disponibilizar, cancelar, concluir, reabrir, retornar ou excluir um bloco —
 * os ícones da linha na tela de blocos.
 *
 * Como a retirada de documento, nenhum deles é link: o SEI põe o número do
 * bloco em `hdnInfraItemId` e envia `#frmBlocoLista` para a ação assinada que
 * está no script da página. A prova é reler a lista e ver o estado novo.
 */
export async function mudarBloco(
  sei: Sei,
  numero: string,
  acao: AcaoDeBloco,
  op: OpcoesEscrita,
): Promise<ResultadoEscrita> {
  const regra = ACOES[acao];
  if (!regra) throw new ErroSei("ARGUMENTO_INVALIDO", `A\u00E7\u00E3o de bloco desconhecida: ${acao}.`);
  const alvo = String(numero).trim();
  const tipo = (await acharBloco(sei, alvo, undefined, { sinal: op.sinal })).tipo;

  // A tela que traz o bloco é a que traz o link assinado da ação: um bloco
  // concluído só aparece (e só oferece "Reabrir") na lista com todos os estados.
  const achar = async () => {
    const normal = await abrirLista(sei, tipo, op.sinal);
    const nela = normal.blocos.find((b) => b.numero === alvo);
    if (nela) return { pagina: normal.pagina, bloco: nela, restaurar: async () => {} };
    const completa = await abrirListaCompleta(sei, tipo, op.sinal);
    const nessa = completa.blocos.find((b) => b.numero === alvo);
    return { pagina: completa.pagina, bloco: nessa, restaurar: completa.restaurar };
  };
  const { pagina, bloco, restaurar } = await achar();
  if (!bloco) {
    await restaurar();
    throw new ErroSei("SEI_NAO_ENCONTRADO", `A unidade n\u00E3o tem o bloco ${alvo} na lista de blocos.`);
  }

  const base: ResultadoEscrita = {
    alvo: `bloco ${bloco.numero}`,
    mudancas: [{ campo: "Estado", antes: bloco.estado, depois: regra.vira }],
    aplicado: false,
    resumo: "",
  };
  const sair = async <T>(r: T): Promise<T> => {
    await restaurar();
    return r;
  };
  if (regra.ja?.includes(bloco.estado)) {
    return sair({ ...base, mudancas: [], resumo: `O bloco ${bloco.numero} j\u00E1 est\u00E1 ${bloco.estado.toLowerCase()}.` });
  }
  if (regra.exige && !regra.exige.includes(bloco.estado)) {
    await restaurar();
    throw new ErroSei(
      "SEI_ACAO_INDISPONIVEL",
      `N\u00E3o d\u00E1 para ${regra.frase(bloco.numero)}: ele est\u00E1 ${bloco.estado.toLowerCase()} e o SEI s\u00F3 permite quando est\u00E1 ${regra.exige.join(" ou ").toLowerCase()}.`,
    );
  }
  if (acao === "disponibilizar") {
    if (!bloco.disponibilizado.length) {
      await restaurar();
      throw new ErroSei(
        "ARGUMENTO_INVALIDO",
        `O bloco ${bloco.numero} n\u00E3o tem unidades para disponibiliza\u00E7\u00E3o. Inclua as unidades no cadastro do bloco antes.`,
      );
    }
    // Bloco vazio o SEI simplesmente não disponibiliza, sem dizer por quê.
    const { itens } = await conteudoDoBloco(sei, bloco.numero, { tipo, sinal: op.sinal });
    if (!itens.length) {
      await restaurar();
      throw new ErroSei("ARGUMENTO_INVALIDO", `O bloco ${bloco.numero} est\u00E1 vazio: inclua documentos antes de disponibilizar.`);
    }
  }
  if (!op.aplicar) return sair({ ...base, resumo: `Vai ${regra.frase(bloco.numero)}.` });

  const link = linkDaAcao(pagina.html, regra.sei);
  if (!link) {
    await restaurar();
    throw new ErroSei("SEI_ACAO_INDISPONIVEL", `O SEI n\u00E3o oferece ${regra.frase(bloco.numero)} nesta unidade.`);
  }
  const form = Formulario.de(pagina, "#frmBlocoLista", sei.http).definir({
    hdnInfraItemId: bloco.numero,
    hdnInfraItensSelecionados: "",
  });
  await sei.http.enviar(link, form.pares(), { sinal: op.sinal });
  await restaurar();

  if (acao === "excluir") {
    const ainda = await acharBloco(sei, alvo, tipo, { sinal: op.sinal }).catch(() => null);
    if (ainda) throw new ErroSei("SEI_RESPOSTA_INESPERADA", `O SEI n\u00E3o excluiu o bloco ${bloco.numero}.`);
    return { ...base, aplicado: true, resumo: `Bloco ${bloco.numero} exclu\u00EDdo.` };
  }
  const depois = await acharBloco(sei, alvo, tipo, { sinal: op.sinal }).catch(() => null);
  // Retornar tira o bloco da lista da unidade que recebeu: sumir é sucesso.
  if (!depois) return { ...base, aplicado: true, resumo: `Bloco ${bloco.numero} ${regra.vira.toLowerCase()}.` };
  if (normalizar(depois.estado) !== normalizar(regra.vira)) {
    throw new ErroSei("SEI_RESPOSTA_INESPERADA", `O SEI n\u00E3o mudou o bloco ${bloco.numero}: ele continua ${depois.estado.toLowerCase()}.`);
  }
  return { ...base, mudancas: [{ campo: "Estado", antes: bloco.estado, depois: depois.estado }], aplicado: true, resumo: `Bloco ${bloco.numero} ${depois.estado.toLowerCase()}.` };
}

/**
 * Cria um bloco (de assinatura ou interno) — a tela "Novo Bloco"
 * (`bloco_assinatura_cadastrar` / `bloco_interno_cadastrar`).
 *
 * As unidades para disponibilização (só no bloco de assinatura) são resolvidas
 * pelo autocompletar da própria tela, como no envio de processo: unidade
 * ambígua é erro, não chute. O número do bloco não vem na resposta — ele é o
 * que apareceu na lista depois de salvar.
 */
export async function criarBloco(
  sei: Sei,
  a: { tipo?: TipoBloco; descricao: string; unidades?: string[]; grupo?: string },
  op: OpcoesEscrita,
): Promise<ResultadoEscrita> {
  const tipo: TipoBloco = a.tipo ?? "assinatura";
  const descricao = (a.descricao ?? "").trim();
  if (!descricao) throw new ErroSei("ARGUMENTO_INVALIDO", "Informe a descri\u00E7\u00E3o do bloco.");
  const unidades = (a.unidades ?? []).map((u) => u.trim()).filter(Boolean);
  if (tipo === "interno" && unidades.length) {
    throw new ErroSei("ARGUMENTO_INVALIDO", "Bloco interno n\u00E3o se disponibiliza: ele n\u00E3o tem unidades.");
  }
  const { pagina, blocos } = await abrirLista(sei, tipo, op.sinal);
  const link = linkDaAcao(pagina.html, tipo === "assinatura" ? "bloco_assinatura_cadastrar" : "bloco_interno_cadastrar");
  if (!link) throw new ErroSei("SEI_ACAO_INDISPONIVEL", "A sua unidade n\u00E3o pode criar blocos aqui.");
  const form = await Formulario.abrir(sei.http, link, "#frmBlocoCadastro", { sinal: op.sinal });

  const destinos = [];
  if (unidades.length) {
    const ajax = /controlador_ajax\.php\?acao_ajax=unidade_auto_completar_outras[^'"]*/.exec(form.pagina.html)?.[0];
    if (!ajax) throw new ErroSei("SEI_VERSAO_NAO_SUPORTADA", "A tela do bloco n\u00E3o tem a busca de unidades esperada.");
    for (const u of unidades) destinos.push(await resolverUnidade(sei, decodificarEntidades(ajax), u, op.sinal));
  }
  const grupo = a.grupo ? form.opcoes("selGrupoBloco").find((o) => o.valor && normalizar(o.texto).includes(normalizar(a.grupo ?? ""))) : undefined;
  if (a.grupo && !grupo) {
    throw new ErroSei("ARGUMENTO_INVALIDO", `A unidade n\u00E3o tem o grupo de blocos "${a.grupo}".`, form.opcoes("selGrupoBloco").map((o) => o.texto).join(" | "));
  }

  const base: ResultadoEscrita = {
    alvo: `bloco ${tipo === "assinatura" ? "de assinatura" : "interno"}`,
    mudancas: [
      { campo: "Descri\u00E7\u00E3o", antes: "", depois: descricao },
      ...(destinos.length ? [{ campo: "Unidades", antes: "", depois: destinos.map((d) => d.texto).join("; ") }] : []),
      ...(grupo ? [{ campo: "Grupo", antes: "", depois: grupo.texto }] : []),
    ],
    aplicado: false,
    resumo: "",
  };
  if (!op.aplicar) return { ...base, resumo: `Vai criar um bloco ${tipo === "assinatura" ? "de assinatura" : "interno"}: "${descricao}".` };

  form.definir({ txtDescricao: descricao, ...(grupo ? { selGrupoBloco: grupo.valor } : {}) });
  if (destinos.length) form.definirLupa("selUnidades", destinos);
  await form.enviar({ sinal: op.sinal, botao: "sbmCadastrarBloco", operacao: "a cria\u00E7\u00E3o do bloco" });

  const antes = new Set(blocos.map((b) => b.numero));
  const novos = (await abrirLista(sei, tipo, op.sinal)).blocos.filter((b) => !antes.has(b.numero));
  const criado = novos.find((b) => normalizar(b.descricao) === normalizar(descricao)) ?? novos[0];
  if (!criado) throw new ErroSei("SEI_RESPOSTA_INESPERADA", "O SEI n\u00E3o mostrou o bloco criado na lista.");
  return { ...base, alvo: `bloco ${criado.numero}`, aplicado: true, resumo: `Bloco ${criado.numero} criado: "${descricao}".`, dados: { bloco: criado.numero } };
}
