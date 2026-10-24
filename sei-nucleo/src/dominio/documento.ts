/**
 * Documento: localizar, ler o conteúdo, alterar metadados e criar.
 *
 * Substitui no legado: `getContentDocSEI`, `getDownloadAnexoFromArvore`,
 * a ação "alterar sigilo" das Ações em Lote (iframe oculto + clique em Salvar,
 * sem conferir o resultado), `getFormDocPro`, `setNewDoc`,
 * `docsLote_clickNewDoc`/`selectDocType`/`formNewDoc`/`confirmDocData`.
 */

import { acaoNaArvore, type Arvore, type DocumentoArvore } from "./arvore";
import { hipotesesDoFormulario, mudanca, NIVEIS, NOME_NIVEL, type OpcoesEscrita, type ResultadoEscrita } from "./escrita";
import { escolherItem, Formulario, type ItemLupa } from "../formulario/formulario";
import { type AlteracaoLista, aplicarModo, linkAutoCompletar, pesquisarNoAutoCompletar, valorCodificadoNoAutoCompletar } from "./lupas";
import { linkDaAcao, parametros } from "../links/links";
import { textoDe } from "../sessao/dom";
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
  /** Observações desta unidade (`txaObservacoes`). `undefined` mantém; "" esvazia. */
  observacao?: string;
  /** Interessados: acrescentar (sem duplicar), remover por id ou substituir a lista. */
  interessados?: AlteracaoLista;
  /** Classificação por assuntos, mesma semântica dos interessados. */
  assuntos?: AlteracaoLista;
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
    const lista = await hipotesesDoFormulario(sei, form, nivel, sinal);
    const h = escolherItem(lista, alt.hipotese, "Hip\u00F3tese legal");
    m.push({ campo: "Hip\u00F3tese legal", antes: "", depois: h.texto });
    form.definir({ selHipoteseLegal: h.id, hdnIdHipoteseLegal: h.id });
  }
  return m;
}

/** Tela "Alterar Documento" (interno ou externo), com a recusa de sigiloso. */
async function telaAlteracao(sei: Sei, numero: string, sinal?: AbortSignal): Promise<{ d: DocumentoLocalizado; acao: string; form: Formulario }> {
  const d = await localizarDocumento(sei, numero, { sinal });
  if (d.documento.nivel === "sigiloso") throw new ErroSei("SEI_SIGILOSO", "Documento sigiloso: o agente n\u00E3o atua nele.");
  const acao = d.documento.externo ? "documento_alterar_recebido" : "documento_alterar";
  const link = linkDaAcao(d.documento.acoes, acao) ?? linkDaAcao(d.documento.acoes, /^documento_alterar/);
  if (!link) throw new ErroSei("SEI_ACAO_INDISPONIVEL", `O documento ${d.documento.numero} n\u00E3o pode ser alterado por voc\u00EA (assinado por outra unidade, ou processo fechado).`);
  const form = await Formulario.abrir(sei.http, link, "#frmDocumentoCadastro", { sinal });
  return { d, acao, form };
}

const textos = (itens: ItemLupa[]) => itens.map((i) => i.texto).join("; ");

/** Aplica o modo pedido a uma lupa do formulário; só mexe nela se a lista mudar. */
function aplicarLista(form: Formulario, select: string, campo: string, alt: AlteracaoLista | undefined): ResultadoEscrita["mudancas"] {
  if (!alt) return [];
  const atuais = form.itensLupa(select);
  const novos = aplicarModo(atuais, alt.modo, alt.itens);
  if (atuais.map((i) => i.id).join(",") === novos.map((i) => i.id).join(",")) return [];
  form.definirLupa(select, novos);
  return [{ campo, antes: textos(atuais), depois: textos(novos) }];
}

/** Altera descrição, observação, interessados, assuntos, nível de acesso e hipótese legal de um documento. */
export async function alterarDocumento(sei: Sei, numero: string, alt: AlteracaoDocumento, op: OpcoesEscrita): Promise<ResultadoEscrita> {
  const { d, acao, form } = await telaAlteracao(sei, numero, op.sinal);

  const mudancas: ResultadoEscrita["mudancas"] = [];
  if (alt.descricao !== undefined) {
    mudancas.push(...mudanca("Descri\u00E7\u00E3o", form.valor("txtDescricao"), alt.descricao));
    form.definir({ txtDescricao: alt.descricao.slice(0, 250) });
  }
  mudancas.push(...aplicarLista(form, "selInteressados", "Interessados", alt.interessados));
  mudancas.push(...aplicarLista(form, "selAssuntos", "Assuntos", alt.assuntos));
  if (alt.observacao !== undefined) {
    mudancas.push(...mudanca("Observa\u00E7\u00F5es da unidade", form.valor("txaObservacoes"), alt.observacao));
    // A tela limita a 1000 caracteres (infraLimitarTexto).
    form.definir({ txaObservacoes: alt.observacao.slice(0, 1000) });
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

/** Autocompletar da tela de alteração do documento: link colhido do JS da tela. */
async function pesquisarNaTela(sei: Sei, refDocumento: string, hdnId: string, nome: string, termo: string, sinal?: AbortSignal): Promise<ItemLupa[]> {
  const { form } = await telaAlteracao(sei, refDocumento, sinal);
  const link = linkAutoCompletar(form.pagina.html, hdnId);
  if (!link) throw new ErroSei("SEI_VERSAO_NAO_SUPORTADA", `A tela de altera\u00E7\u00E3o do documento n\u00E3o tem a pesquisa de ${nome}.`);
  return pesquisarNoAutoCompletar(sei, link, termo, sinal, valorCodificadoNoAutoCompletar(form.pagina.html, hdnId));
}

/** Contatos (para interessados) pelo autocompletar da tela "Alterar Documento" de `refDocumento`. */
export async function pesquisarContatos(sei: Sei, refDocumento: string, termo: string, sinal?: AbortSignal): Promise<ItemLupa[]> {
  return pesquisarNaTela(sei, refDocumento, "hdnIdInteressado", "contatos", termo, sinal);
}

/** Assuntos pelo autocompletar da tela "Alterar Documento" de `refDocumento`. */
export async function pesquisarAssuntos(sei: Sei, refDocumento: string, termo: string, sinal?: AbortSignal): Promise<ItemLupa[]> {
  return pesquisarNaTela(sei, refDocumento, "hdnIdAssunto", "assuntos", termo, sinal);
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
  /** Id exato do tipo: quando presente, só ele vale (`tipo` vira rótulo) e id fora da lista da unidade é recusado. */
  tipoId?: string;
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
  /**
   * Id exato de um texto padrão da unidade (vence `textoPadrao`). Com a lista
   * `selTextoPadrao` na tela, id fora dela é recusado: o casamento por nome do
   * `textoPadrao` aceitaria um nome que CONTÉM o texto ("5" casaria "Ofício 5
   * anos"). Sem a lista (SEI 4.1, autocompletar), o id vai no `hdnIdTextoPadrao`.
   */
  textoPadraoId?: string;
  /**
   * Valor do Número só quando o tipo o exige (`lblNumero` obrigatório), como o
   * Documentos em Lote do legado: o nome da linha vira o Número no tipo que
   * não cria sem ele. Com Número opcional, o campo fica como a tela trouxe.
   * `numero` vence.
   */
  numeroSeExigido?: string;
  /**
   * Avisa as fases do POST de cadastro, para quem precisa distinguir "nada foi
   * criado" de "talvez criado": `enviando` logo antes do POST (dali em diante
   * o documento pode existir) e `enviado` quando a resposta confirmou, com o
   * id lido dela (antes da releitura da árvore, que ainda pode falhar).
   */
  acompanharCadastro?: (fase: { fase: "enviando" } | { fase: "enviado"; idDocumento: string; idProcedimento: string }) => void;
}

/**
 * Escolha do tipo para um documento novo: tela de tipos (todos) e o tipo pedido.
 * `soPorId`: o tipo vem de outro documento (`hdnIdSerie`), então só vale o id
 * exato. O `escolherItem` aceitaria um nome que CONTÉM o texto ("5" casaria
 * um tipo com "5" no nome) e criaria um documento de outro tipo, em silêncio.
 */
async function prepararCriacao(sei: Sei, arv: Arvore, refTipo: string, sinal?: AbortSignal, soPorId = false): Promise<{ escolha: Formulario; tipo: ItemLupa }> {
  if (arv.nivel === "sigiloso") throw new ErroSei("SEI_SIGILOSO", "Processo sigiloso: o agente n\u00E3o atua nele.");
  const escolha = await telaEscolherTipo(sei, arv, sinal);
  const tipos = lerTipos(escolha.pagina).filter((t) => t.id !== "-1").map((t) => ({ id: t.id, texto: t.nome }));
  if (soPorId) {
    const tipo = tipos.find((t) => t.id === refTipo);
    if (!tipo) throw new ErroSei("SEI_ACAO_INDISPONIVEL", `O tipo (id ${refTipo}) n\u00E3o est\u00E1 dispon\u00EDvel nesta unidade.`);
    return { escolha, tipo };
  }
  return { escolha, tipo: escolherItem(tipos, refTipo, "Tipo de documento") };
}

/** O que vai no formulário de cadastro, além do que `NovoDocumento` já descreve. */
interface Cadastro extends NovoDocumento {
  interessados?: ItemLupa[];
  assuntos?: ItemLupa[];
  observacao?: string;
}

/**
 * Miolo da criação, comum a `criarDocumento` e `duplicarDocumento`: escolhe o
 * tipo, preenche `#frmDocumentoCadastro`, envia com prova e relê a árvore para
 * achar o número do documento novo. `ref` é a referência com que a árvore
 * foi pedida (protocolo ou nº SEI), para a releitura usar o mesmo cache.
 */
async function cadastrar(sei: Sei, ref: string, arv: Arvore, escolha: Formulario, tipo: ItemLupa, novo: Cadastro, sinal?: AbortSignal): Promise<{ idDocumento: string; numero: string; titulo: string }> {
  const cadastro = await escolha.definir({ hdnIdSerie: tipo.id }).enviar({ sinal });
  const form = Formulario.de(cadastro, "#frmDocumentoCadastro", sei.http);
  const rotuloNumero = form.pagina.doc.querySelector("#lblNumero");
  const exigeNumero = rotuloNumero !== null && !/infraLabelOpcional/.test(rotuloNumero.getAttribute("class") ?? "");
  form.definir({
    txtDescricao: (novo.descricao ?? "").slice(0, 250),
    txtNumero: novo.numero ?? (exigeNumero ? novo.numeroSeExigido : undefined) ?? form.valor("txtNumero") ?? "",
    txtNomeArvore: novo.nomeArvore ?? form.valor("txtNomeArvore") ?? "",
    rdoTextoInicial: "N",
  });
  if (novo.documentoModelo) form.definir({ rdoTextoInicial: "D", txtProtocoloDocumentoTextoBase: novo.documentoModelo });
  if (novo.textoPadraoId) {
    const id = novo.textoPadraoId;
    if (form.pagina.doc.querySelector("#frmDocumentoCadastro select[name='selTextoPadrao'], #frmDocumentoCadastro select#selTextoPadrao")) {
      const ok = form.opcoes("selTextoPadrao").some((o) => o.valor === id && o.valor !== "null");
      if (!ok) throw new ErroSei("SEI_ACAO_INDISPONIVEL", `O texto padr\u00E3o (id ${id}) n\u00E3o est\u00E1 dispon\u00EDvel nesta unidade.`);
    }
    form.definir({ rdoTextoInicial: "T", selTextoPadrao: id, hdnIdTextoPadrao: id });
  } else if (novo.textoPadrao) {
    const lista = form.opcoes("selTextoPadrao").filter((o) => o.valor !== "null").map((o) => ({ id: o.valor, texto: o.texto }));
    const tp = escolherItem(lista, novo.textoPadrao, "Texto padr\u00E3o");
    form.definir({ rdoTextoInicial: "T", selTextoPadrao: tp.id, hdnIdTextoPadrao: tp.id });
  }
  // Interessados: lista vazia (não `undefined`) LIMPA o que a tela de cadastro
  // já trouxe, como o legado, que sempre sobrescrevia com os do original.
  if (novo.interessados?.length) form.definirLupa("selInteressados", novo.interessados);
  else if (novo.interessados && form.itensLupa("selInteressados").length) form.definirLupa("selInteressados", []);
  // Assuntos: só substitui quando há o que copiar. Vazio mantém o que a tela
  // trouxe (sugestão do tipo), porque o assunto pode ser obrigatório no órgão e
  // esvaziar faria o SEI recusar o cadastro.
  if (novo.assuntos?.length) form.definirLupa("selAssuntos", novo.assuntos);
  if (novo.observacao) form.definir({ txaObservacoes: novo.observacao.slice(0, 1000) });
  await aplicarNivel(sei, form, { nivel: novo.nivel ?? "publico", hipotese: novo.hipotese }, sinal);
  form.definir({ hdnFlagDocumentoCadastro: "2" });

  novo.acompanharCadastro?.({ fase: "enviando" });
  const resposta = await form.enviar({
    sinal,
    operacao: `a cria\u00E7\u00E3o do documento em ${arv.protocolo}`,
    sucesso: (p) => /acao_origem=documento_(?:gerar|cadastrar)/.test(p.url) || /editor_montar/.test(p.html),
  });
  const idDocumento = parametros(resposta.url).get("id_documento") ?? /id_documento=(\d+)/.exec(resposta.html)?.[1] ?? "";
  novo.acompanharCadastro?.({ fase: "enviado", idDocumento, idProcedimento: arv.idProcedimento });
  sei.invalidar(arv.idProcedimento);
  const nova = await sei.arvore(ref, { forcar: true, sinal });
  const noNovo = nova.documentos.find((d) => d.id === idDocumento);
  return { idDocumento, numero: noNovo?.numero ?? "", titulo: noNovo?.titulo ?? "" };
}

/** Cria um documento interno (vazio ou a partir de modelo/texto padrão). Devolve o número e o link do editor. */
export async function criarDocumento(sei: Sei, refProcesso: string, novo: NovoDocumento, op: OpcoesEscrita): Promise<ResultadoEscrita> {
  const arv = await sei.arvore(refProcesso, { sinal: op.sinal });
  const { escolha, tipo } = novo.tipoId
    ? await prepararCriacao(sei, arv, novo.tipoId, op.sinal, true)
    : await prepararCriacao(sei, arv, novo.tipo, op.sinal);

  const mudancas: ResultadoEscrita["mudancas"] = [
    { campo: "Documento", antes: "", depois: `${tipo.texto}${novo.numero ? ` ${novo.numero}` : ""}${novo.nomeArvore ? ` ${novo.nomeArvore}` : ""}` },
  ];
  if (novo.descricao) mudancas.push({ campo: "Descri\u00E7\u00E3o", antes: "", depois: novo.descricao });
  const nivel = novo.nivel ?? "publico";
  mudancas.push({ campo: "N\u00EDvel de acesso", antes: "", depois: NOME_NIVEL[NIVEIS[nivel]] });
  if (nivel === "restrito" && !novo.hipotese) throw new ErroSei("ARGUMENTO_INVALIDO", "Documento restrito exige hip\u00F3tese legal.");
  const base: ResultadoEscrita = { alvo: arv.protocolo, mudancas, aplicado: false, resumo: "" };
  if (!op.aplicar) return { ...base, resumo: `Vai criar ${tipo.texto} no processo ${arv.protocolo}.` };

  const { idDocumento, numero } = await cadastrar(sei, refProcesso, arv, escolha, tipo, { ...novo, nivel }, op.sinal);
  return {
    ...base,
    aplicado: true,
    resumo: `${tipo.texto} ${numero} criado no processo ${arv.protocolo}.`,
    dados: { idDocumento, numero },
  };
}

/**
 * Tipo (série) de um documento, lido da tela "Alterar Documento" (`hdnIdSerie`).
 * O nome vem da lista de tipos da unidade (id exato); se o id não estiver nela,
 * cai no texto da série na própria tela e, na falta, no id. Não lança por causa do nome.
 */
export async function tipoDoDocumento(sei: Sei, numero: string, sinal?: AbortSignal): Promise<{ id: string; nome: string }> {
  const { d, form } = await telaAlteracao(sei, numero, sinal);
  if (d.documento.nivel === "sigiloso" || d.arvore.nivel === "sigiloso") throw new ErroSei("SEI_SIGILOSO", "Documento sigiloso: o agente n\u00E3o atua nele.");
  const id = form.valor("hdnIdSerie") ?? "";
  if (!id) throw new ErroSei("SEI_VERSAO_NAO_SUPORTADA", `A tela do documento ${d.documento.numero} n\u00E3o informa o tipo (hdnIdSerie).`);
  let nome = "";
  try {
    nome = lerTipos((await telaEscolherTipo(sei, d.arvore, sinal)).pagina).find((t) => t.id === id)?.nome ?? "";
  } catch (e) {
    if (sinal?.aborted || !(e instanceof ErroSei) || e.codigo === "SEI_SIGILOSO") throw e;
  }
  if (!nome) nome = form.opcoes("selSerie").find((o) => o.valor === id)?.texto?.trim() ?? "";
  return { id, nome: nome || id };
}

/** "Despacho - Minuta" vira "Despacho": a palavra, o hifen que a liga ao resto e os espacos que sobram. */
export function tirarMinuta(texto: string): string {
  return texto
    .replace(/(?:\s*[-\u2013]\s*)?\bminuta\b/gi, "")
    .replace(/\s{2,}/g, " ")
    .replace(/^[-\u2013\s]+/, "")
    .trim();
}

/** Número que o usuário digitou (ex.: "A-12/2026"). Numérico puro é o SEI quem dá, e copiar repetiria o número. */
const numeroACopiar = (n: string | undefined) => (n && !/^\d+$/.test(n.trim()) ? n : undefined);

/**
 * Duplica um documento interno no mesmo processo: novo documento do mesmo tipo,
 * com o original como texto inicial (`rdoTextoInicial` D) e os dados da tela
 * "Alterar Documento" dele: descrição, número (se não numérico), nome na
 * árvore, interessados, assuntos, observação da unidade, nível e hipótese.
 *
 * Substitui no legado: `getDadosDoc`, `getDuplicateDoc`, `saveDuplicateArvore`
 * (`sei-pro-arvore.js`), que escolhiam o tipo pelo começo do nome na árvore.
 */
export async function duplicarDocumento(
  sei: Sei,
  numero: string,
  op: OpcoesEscrita,
  o: {
    /**
     * Tira a palavra MINUTA da descrição e do nome na árvore da cópia (a pergunta "Deseja duplicar sem a denominação
     * MINUTA?" do menu da árvore). O tipo vem do original, então só o texto muda.
     */
    semMinuta?: boolean;
  } = {},
): Promise<ResultadoEscrita> {
  const loc = await localizarDocumento(sei, numero, { sinal: op.sinal });
  if (loc.documento.nivel === "sigiloso" || loc.arvore.nivel === "sigiloso") throw new ErroSei("SEI_SIGILOSO", "Documento sigiloso: o agente n\u00E3o atua nele.");
  if (loc.documento.externo) {
    throw new ErroSei("SEI_ACAO_INDISPONIVEL", `O documento ${loc.documento.numero} \u00E9 externo (anexo): s\u00F3 documento gerado no SEI pode ser duplicado.`);
  }
  const { d, form: original } = await telaAlteracao(sei, numero, op.sinal);
  const doc = d.documento;
  const nivelAtual = original.pagina.doc.querySelector("input[name=rdoNivelAcesso][checked]")?.getAttribute("value") ?? original.valor("hdnStaNivelAcessoLocal") ?? "0";
  if (nivelAtual === "2" || d.arvore.nivel === "sigiloso") throw new ErroSei("SEI_SIGILOSO", "Documento sigiloso: o agente n\u00E3o atua nele.");
  const nivel = nivelAtual === "1" ? "restrito" : "publico";
  const hipotese =
    nivel === "restrito"
      ? (original.valor("hdnIdHipoteseLegal") || original.opcoes("selHipoteseLegal").find((o) => o.selecionada && o.valor !== "null")?.valor) ?? undefined
      : undefined;
  const idSerie = original.valor("hdnIdSerie") ?? "";
  if (!idSerie) throw new ErroSei("SEI_VERSAO_NAO_SUPORTADA", `A tela do documento ${doc.numero} n\u00E3o informa o tipo (hdnIdSerie).`);

  const { escolha, tipo } = await prepararCriacao(sei, d.arvore, idSerie, op.sinal, true);

  const base: ResultadoEscrita = {
    alvo: doc.numero,
    mudancas: [{ campo: "Documento", antes: "", depois: `${tipo.texto} (c\u00F3pia de ${doc.numero})` }],
    aplicado: false,
    resumo: "",
  };
  if (!op.aplicar) return { ...base, resumo: `Vai duplicar ${doc.titulo} (${doc.numero}) no processo ${d.arvore.protocolo}.` };

  const { idDocumento, numero: novoNumero, titulo: tituloNovo } = await cadastrar(
    sei,
    numero,
    d.arvore,
    escolha,
    tipo,
    {
      tipo: tipo.id,
      descricao: o.semMinuta ? tirarMinuta(original.valor("txtDescricao") ?? "") : (original.valor("txtDescricao") ?? ""),
      numero: numeroACopiar(original.valor("txtNumero")),
      nomeArvore: original.valor("txtNomeArvore") ? (o.semMinuta ? tirarMinuta(original.valor("txtNomeArvore") ?? "") : (original.valor("txtNomeArvore") ?? "")) : undefined,
      documentoModelo: doc.numero,
      interessados: original.itensLupa("selInteressados"),
      assuntos: original.itensLupa("selAssuntos"),
      observacao: original.valor("txaObservacoes") ?? "",
      nivel,
      hipotese,
    },
    op.sinal,
  );
  return {
    ...base,
    aplicado: true,
    resumo: `Documento ${doc.numero} duplicado: ${tituloNovo || tipo.texto} ${novoNumero ? `(${novoNumero}) ` : ""}no processo ${d.arvore.protocolo}.`,
    dados: { idDocumento, numero: novoNumero },
  };
}
