/**
 * Documento: localizar, ler o conteúdo, alterar metadados e criar.
 *
 * Substitui no legado: `getContentDocSEI`, `getDownloadAnexoFromArvore`,
 * a ação "alterar sigilo" das Ações em Lote (iframe oculto + clique em Salvar,
 * sem conferir o resultado), `getFormDocPro`, `setNewDoc`,
 * `docsLote_clickNewDoc`/`selectDocType`/`formNewDoc`/`confirmDocData`.
 */

import { acaoNaArvore, type Arvore, type DocumentoArvore } from "./arvore";
import { mudanca, NIVEIS, NOME_NIVEL, type OpcoesEscrita, type ResultadoEscrita } from "./escrita";
import { Formulario, normalizar } from "../formulario/formulario";
import { linkDaAcao, parametros } from "../links/links";
import { decodificarEntidades, textoDe } from "../sessao/dom";
import { ErroSei } from "../sessao/erros";
import type { Arquivo, OpcoesHttp, Pagina } from "../sessao/http";
import type { Sei } from "../sei";

export interface DocumentoLocalizado {
  arvore: Arvore;
  documento: DocumentoArvore;
}

/** Nº SEI do documento → documento na árvore do processo dele. */
export async function localizarDocumento(sei: Sei, numero: string, op?: OpcoesHttp & { forcar?: boolean }): Promise<DocumentoLocalizado> {
  const loc = await sei.localizar(numero, op);
  const arvore = await sei.arvore(numero, op);
  const alvo = numero.replace(/\D/g, "");
  const documento =
    arvore.documentos.find((d) => d.id === loc.idDocumento) ??
    arvore.documentos.find((d) => d.numero.replace(/\D/g, "") === alvo);
  if (!documento) throw new ErroSei("SEI_NAO_ENCONTRADO", `O documento ${numero} n\u00E3o est\u00E1 na \u00E1rvore do processo ${arvore.protocolo}.`);
  return { arvore, documento };
}

export type ConteudoDocumento =
  | { forma: "html"; html: string }
  | { forma: "arquivo"; arquivo: Arquivo };

/**
 * Conteúdo bruto do documento. Converter em texto (HTML → texto, PDF → texto,
 * OCR) é trabalho de quem consome: o núcleo não carrega pdf.js.
 *
 * Recusa documento sigiloso ANTES de baixar qualquer byte.
 */
export async function lerConteudo(sei: Sei, d: DocumentoLocalizado, op?: OpcoesHttp): Promise<ConteudoDocumento> {
  const { documento: doc, arvore } = d;
  if (doc.nivel === "sigiloso" || arvore.nivel === "sigiloso") {
    throw new ErroSei("SEI_SIGILOSO", `O documento ${doc.numero} \u00E9 sigiloso: o agente n\u00E3o l\u00EA o conte\u00FAdo.`);
  }
  if (doc.cancelado) throw new ErroSei("SEI_NAO_ENCONTRADO", `O documento ${doc.numero} foi cancelado.`);
  if (!doc.src) throw new ErroSei("SEI_ACAO_INDISPONIVEL", `Voc\u00EA n\u00E3o tem acesso ao conte\u00FAdo do documento ${doc.numero}.`);
  if (/documento_download_anexo/.test(doc.src)) {
    return { forma: "arquivo", arquivo: await sei.http.baixar(doc.src, op) };
  }
  const p = await sei.http.obter(doc.src, op);
  return { forma: "html", html: p.html };
}

export interface AlteracaoDocumento {
  descricao?: string;
  nivel?: "publico" | "restrito";
  hipotese?: string;
}

async function hipotesesDaTela(sei: Sei, form: Formulario, nivel: string, sinal?: AbortSignal) {
  const ajax = /controlador_ajax\.php\?acao_ajax=hipotese_legal_select[^'"]*/.exec(form.pagina.html)?.[0];
  if (!ajax) return form.opcoes("selHipoteseLegal").filter((o) => o.valor !== "null").map((o) => ({ id: o.valor, texto: o.texto }));
  return sei.ajax(decodificarEntidades(ajax), [
    ["primeiroItemValor", "null"],
    ["primeiroItemDescricao", " "],
    ["valorItemSelecionado", ""],
    ["staNivelAcesso", nivel],
  ], { sinal });
}

function escolherItem<T extends { id: string; texto: string }>(itens: T[], ref: string, oque: string): T {
  const alvo = normalizar(ref);
  const achado =
    itens.find((i) => i.id === ref) ??
    itens.find((i) => normalizar(i.texto) === alvo) ??
    (itens.filter((i) => normalizar(i.texto).includes(alvo)).length === 1 ? itens.find((i) => normalizar(i.texto).includes(alvo)) : undefined);
  if (!achado) throw new ErroSei("ARGUMENTO_INVALIDO", `${oque} "${ref}" n\u00E3o encontrado(a) ou amb\u00EDguo(a).`, itens.slice(0, 40).map((i) => i.texto).join(" | "));
  return achado;
}

/** Aplica nível e hipótese no formulário de cadastro/alteração de documento. */
async function aplicarNivel(sei: Sei, form: Formulario, alt: AlteracaoDocumento, sinal?: AbortSignal): Promise<ResultadoEscrita["mudancas"]> {
  const m: ResultadoEscrita["mudancas"] = [];
  const nivelAtual = form.valor("rdoNivelAcesso") ?? form.valor("hdnStaNivelAcessoLocal") ?? "";
  const nivel = alt.nivel ? NIVEIS[alt.nivel] : nivelAtual;
  if (alt.nivel) {
    m.push(...mudanca("N\u00EDvel de acesso", NOME_NIVEL[nivelAtual] ?? "", NOME_NIVEL[nivel]));
    form.definir({ rdoNivelAcesso: nivel, hdnStaNivelAcessoLocal: nivel });
  }
  if (nivel === "0") {
    form.definir({ selHipoteseLegal: "null", hdnIdHipoteseLegal: "" });
  } else if (alt.hipotese !== undefined || (alt.nivel === "restrito" && nivel !== nivelAtual)) {
    if (!alt.hipotese) throw new ErroSei("ARGUMENTO_INVALIDO", "Documento restrito exige hip\u00F3tese legal. Informe a hip\u00F3tese.");
    const lista = await hipotesesDaTela(sei, form, nivel, sinal);
    const h = escolherItem(lista, alt.hipotese, "Hip\u00F3tese legal");
    m.push({ campo: "Hip\u00F3tese legal", antes: "", depois: h.texto });
    form.definir({ selHipoteseLegal: h.id, hdnIdHipoteseLegal: h.id });
  }
  return m;
}

/** Altera descrição, nível de acesso e hipótese legal de um documento. */
export async function alterarDocumento(sei: Sei, numero: string, alt: AlteracaoDocumento, op: OpcoesEscrita): Promise<ResultadoEscrita> {
  const d = await localizarDocumento(sei, numero, { sinal: op.sinal });
  if (d.documento.nivel === "sigiloso") throw new ErroSei("SEI_SIGILOSO", "Documento sigiloso: o agente n\u00E3o atua nele.");
  const acao = d.documento.externo ? "documento_alterar_recebido" : "documento_alterar";
  const link = linkDaAcao(d.documento.acoes, acao) ?? linkDaAcao(d.documento.acoes, /^documento_alterar/);
  if (!link) throw new ErroSei("SEI_ACAO_INDISPONIVEL", `O documento ${d.documento.numero} n\u00E3o pode ser alterado por voc\u00EA (assinado por outra unidade, ou processo fechado).`);
  const form = await Formulario.abrir(sei.http, link, "#frmDocumentoCadastro", { sinal: op.sinal });

  const mudancas: ResultadoEscrita["mudancas"] = [];
  if (alt.descricao !== undefined) {
    mudancas.push(...mudanca("Descri\u00E7\u00E3o", form.valor("txtDescricao"), alt.descricao));
    form.definir({ txtDescricao: alt.descricao.slice(0, 250) });
  }
  mudancas.push(...(await aplicarNivel(sei, form, alt, op.sinal)));

  const base: ResultadoEscrita = { alvo: d.documento.numero, mudancas, aplicado: false, resumo: "" };
  if (!mudancas.length) return { ...base, resumo: "Nada a alterar: os valores j\u00E1 s\u00E3o esses." };
  if (!op.aplicar) return { ...base, resumo: `${mudancas.length} campo(s) a alterar no documento ${d.documento.numero}.` };

  form.definir({ hdnFlagDocumentoCadastro: "2" });
  await form.enviar({
    sinal: op.sinal,
    operacao: `a altera\u00E7\u00E3o do documento ${d.documento.numero}`,
    sucesso: (p) => parametros(p.url).get("acao") !== acao,
  });
  sei.invalidar(d.arvore.idProcedimento);
  return { ...base, aplicado: true, resumo: `Documento ${d.documento.numero} alterado.` };
}

export interface TipoDocumento {
  id: string;
  nome: string;
}

async function telaEscolherTipo(sei: Sei, arv: Arvore, sinal?: AbortSignal): Promise<Formulario> {
  const link = acaoNaArvore(arv, "documento_escolher_tipo");
  if (!link) throw new ErroSei("SEI_ACAO_INDISPONIVEL", `N\u00E3o \u00E9 poss\u00EDvel incluir documento no processo ${arv.protocolo} (fechado na unidade?).`);
  let form = await Formulario.abrir(sei.http, link, "#frmDocumentoEscolherTipo", { sinal });
  if (form.tem("hdnFiltroSerie") && form.valor("hdnFiltroSerie") !== "T") {
    // A tela abre só com os tipos mais usados; "T" lista todos.
    const todos = await form.definir({ hdnFiltroSerie: "T" }).enviar({ sinal });
    form = Formulario.de(todos, "#frmDocumentoEscolherTipo", sei.http);
  }
  return form;
}

function lerTipos(p: Pagina): TipoDocumento[] {
  const vistos = new Map<string, string>();
  for (const a of p.doc.querySelectorAll("[onclick*='escolher(']")) {
    const id = /escolher\((-?\d+)\)/.exec(a.getAttribute("onclick") ?? "")?.[1];
    if (id && !vistos.has(id)) vistos.set(id, textoDe(a));
  }
  // SEI 3/4 antigos: âncoras com href para documento_cadastrar&id_serie=
  for (const a of p.doc.querySelectorAll("a[href*='id_serie=']")) {
    const id = parametros(a.getAttribute("href") ?? "").get("id_serie");
    if (id && !vistos.has(id)) vistos.set(id, textoDe(a));
  }
  return [...vistos].filter(([, nome]) => nome).map(([id, nome]) => ({ id, nome }));
}

/** Tipos de documento que o usuário pode gerar no processo (id -1 = documento externo). */
export async function tiposDocumento(sei: Sei, refProcesso: string, sinal?: AbortSignal): Promise<TipoDocumento[]> {
  const arv = await sei.arvore(refProcesso, { sinal });
  return lerTipos((await telaEscolherTipo(sei, arv, sinal)).pagina);
}

export interface NovoDocumento {
  /** Nome ou id do tipo (série), ex.: "Despacho". */
  tipo: string;
  descricao?: string;
  /** Número (para tipos numerados pelo usuário) e nome na árvore. */
  numero?: string;
  nomeArvore?: string;
  nivel?: "publico" | "restrito";
  hipotese?: string;
  /** Nº SEI de um documento para usar como texto inicial. */
  documentoModelo?: string;
  /** Nome (ou id) de um texto padrão da unidade. */
  textoPadrao?: string;
}

/** Cria um documento interno (vazio ou a partir de modelo/texto padrão). Devolve o número e o link do editor. */
export async function criarDocumento(sei: Sei, refProcesso: string, novo: NovoDocumento, op: OpcoesEscrita): Promise<ResultadoEscrita> {
  const arv = await sei.arvore(refProcesso, { sinal: op.sinal });
  if (arv.nivel === "sigiloso") throw new ErroSei("SEI_SIGILOSO", "Processo sigiloso: o agente n\u00E3o atua nele.");
  const escolha = await telaEscolherTipo(sei, arv, op.sinal);
  const tipos = lerTipos(escolha.pagina).filter((t) => t.id !== "-1");
  const tipo = escolherItem(tipos.map((t) => ({ id: t.id, texto: t.nome })), novo.tipo, "Tipo de documento");

  const mudancas: ResultadoEscrita["mudancas"] = [
    { campo: "Documento", antes: "", depois: `${tipo.texto}${novo.numero ? ` ${novo.numero}` : ""}${novo.nomeArvore ? ` ${novo.nomeArvore}` : ""}` },
  ];
  if (novo.descricao) mudancas.push({ campo: "Descri\u00E7\u00E3o", antes: "", depois: novo.descricao });
  const nivel = novo.nivel ?? "publico";
  mudancas.push({ campo: "N\u00EDvel de acesso", antes: "", depois: NOME_NIVEL[NIVEIS[nivel]] });
  if (nivel === "restrito" && !novo.hipotese) throw new ErroSei("ARGUMENTO_INVALIDO", "Documento restrito exige hip\u00F3tese legal.");
  const base: ResultadoEscrita = { alvo: arv.protocolo, mudancas, aplicado: false, resumo: "" };
  if (!op.aplicar) return { ...base, resumo: `Vai criar ${tipo.texto} no processo ${arv.protocolo}.` };

  const cadastro = await escolha.definir({ hdnIdSerie: tipo.id }).enviar({ sinal: op.sinal });
  const form = Formulario.de(cadastro, "#frmDocumentoCadastro", sei.http);
  form.definir({
    txtDescricao: (novo.descricao ?? "").slice(0, 250),
    txtNumero: novo.numero ?? form.valor("txtNumero") ?? "",
    txtNomeArvore: novo.nomeArvore ?? form.valor("txtNomeArvore") ?? "",
    rdoTextoInicial: "N",
  });
  if (novo.documentoModelo) form.definir({ rdoTextoInicial: "D", txtProtocoloDocumentoTextoBase: novo.documentoModelo });
  if (novo.textoPadrao) {
    const lista = form.opcoes("selTextoPadrao").filter((o) => o.valor !== "null").map((o) => ({ id: o.valor, texto: o.texto }));
    const tp = escolherItem(lista, novo.textoPadrao, "Texto padr\u00E3o");
    form.definir({ rdoTextoInicial: "T", selTextoPadrao: tp.id, hdnIdTextoPadrao: tp.id });
  }
  await aplicarNivel(sei, form, { nivel, hipotese: novo.hipotese }, op.sinal);
  form.definir({ hdnFlagDocumentoCadastro: "2" });

  const resposta = await form.enviar({
    sinal: op.sinal,
    operacao: `a cria\u00E7\u00E3o do documento em ${arv.protocolo}`,
    sucesso: (p) => /acao_origem=documento_(?:gerar|cadastrar)/.test(p.url) || /editor_montar/.test(p.html),
  });
  const idDocumento = parametros(resposta.url).get("id_documento") ?? /id_documento=(\d+)/.exec(resposta.html)?.[1] ?? "";
  sei.invalidar(arv.idProcedimento);
  const nova = await sei.arvore(refProcesso, { forcar: true, sinal: op.sinal });
  const criado = nova.documentos.find((d) => d.id === idDocumento);
  return {
    ...base,
    aplicado: true,
    resumo: `${tipo.texto} ${criado?.numero ?? ""} criado no processo ${arv.protocolo}.`,
    dados: { idDocumento, numero: criado?.numero ?? "" },
  };
}
