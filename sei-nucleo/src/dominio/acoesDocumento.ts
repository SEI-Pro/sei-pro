/**
 * Ações de um clique sobre documento e processo: excluir documento, cancelar
 * assinatura e dar ciência.
 *
 * Todas são GET em links que a tela do documento (`arvore_visualizar` com
 * `id_documento`) declara em variáveis JavaScript (`sei/web/js/arvore_visualizar.js`
 * do SEI 5):
 *
 *   linkExcluirDocumento   excluirDocumento(): confirm() e location.href
 *   linkCienciaDocumento   cienciaDocumento(): carrega no iframe
 *   linkCienciaProcesso    cienciaProcesso(): idem
 *   linkEditarConteudo     editarConteudo('S'): em documento assinado, o SEI avisa
 *                          que "perderá a assinatura" — abrir o editor cancela
 *
 * Os links existem na tela mesmo quando o usuário não pode usar a ação; quem
 * diz se pode é a barra de botões do documento (`DocumentoArvore.botoes`).
 * A prova de sucesso é sempre a releitura (árvore ou histórico).
 *
 * Substitui no legado: as ações Excluir, Cancelar assinatura e Ciência das
 * Ações em Lote (`getBatchActionsPro`), que não conferiam o resultado.
 */

import { localizarDocumento, type DocumentoLocalizado } from "./documento";
import type { OpcoesEscrita, ResultadoEscrita } from "./escrita";
import { andamentos } from "./historico";
import { Formulario, normalizar } from "../formulario/formulario";
import { linkDaAcao, parametros } from "../links/links";
import { ErroSei } from "../sessao/erros";
import type { Sei } from "../sei";

/** Link de uma das variáveis `var linkX = '...'` da tela do documento. */
async function linkDaTela(sei: Sei, d: DocumentoLocalizado, variavel: string, sinal?: AbortSignal): Promise<string> {
  const tela = await sei.http.obter(d.documento.link, { sinal });
  const m = new RegExp(`var\\s+${variavel}\\s*=\\s*'([^']+)'`).exec(tela.html);
  if (!m) throw new ErroSei("SEI_VERSAO_NAO_SUPORTADA", `A tela do documento n\u00E3o tem ${variavel}.`);
  return m[1].replace(/&amp;/g, "&");
}

const temBotao = (d: DocumentoLocalizado, ...titulos: string[]) =>
  d.documento.botoes.some((b) => titulos.some((t) => normalizar(b).startsWith(normalizar(t))));

async function documentoOperavel(sei: Sei, numero: string, sinal?: AbortSignal): Promise<DocumentoLocalizado> {
  const d = await localizarDocumento(sei, numero, { sinal, forcar: true });
  if (d.documento.nivel === "sigiloso" || d.arvore.nivel === "sigiloso") throw new ErroSei("SEI_SIGILOSO", "Documento sigiloso: o agente n\u00E3o atua nele.");
  return d;
}

/** Exclui um documento (só o SEI decide se pode: gerado na unidade, sem assinatura de outros, processo aberto...). */
export async function excluirDocumento(sei: Sei, numero: string, op: OpcoesEscrita): Promise<ResultadoEscrita> {
  const d = await documentoOperavel(sei, numero, op.sinal);
  const doc = d.documento;
  const base: ResultadoEscrita = {
    alvo: doc.numero,
    mudancas: [{ campo: "Documento", antes: `${doc.titulo} (${doc.numero})`, depois: "exclu\u00EDdo" }],
    aplicado: false,
    resumo: `Vai excluir ${doc.titulo} (${doc.numero}).`,
  };
  if (!temBotao(d, "Excluir")) throw new ErroSei("SEI_ACAO_INDISPONIVEL", `O SEI n\u00E3o oferece excluir o documento ${doc.numero} para voc\u00EA (assinado, j\u00E1 tramitado ou de outra unidade).`);
  if (!op.aplicar) return base;
  await sei.http.obter(await linkDaTela(sei, d, "linkExcluirDocumento", op.sinal), { sinal: op.sinal });
  sei.invalidar(d.arvore.idProcedimento);
  const depois = await sei.arvore(d.arvore.protocolo, { sinal: op.sinal, forcar: true });
  const ainda = depois.documentos.find((x) => x.id === doc.id);
  if (ainda && !ainda.cancelado) throw new ErroSei("SEI_RESPOSTA_INESPERADA", `O SEI n\u00E3o excluiu o documento ${doc.numero}.`);
  return { ...base, aplicado: true, resumo: `Documento ${doc.numero} exclu\u00EDdo.` };
}

/**
 * Cancela um documento (tela "Cancelar Documento", `#frmDocumentoCancelar`,
 * motivo obrigatório). É o que o SEI oferece no lugar de "Excluir" depois que
 * o processo tramitou: o documento continua na árvore, marcado como cancelado.
 */
export async function cancelarDocumento(sei: Sei, numero: string, motivo: string, op: OpcoesEscrita): Promise<ResultadoEscrita> {
  if (!motivo?.trim()) throw new ErroSei("ARGUMENTO_INVALIDO", "Cancelar documento exige o motivo.");
  const d = await documentoOperavel(sei, numero, op.sinal);
  const doc = d.documento;
  const base: ResultadoEscrita = { alvo: doc.numero, mudancas: [], aplicado: false, resumo: "" };
  if (doc.cancelado) return { ...base, resumo: `O documento ${doc.numero} j\u00E1 est\u00E1 cancelado.` };
  const link = linkDaAcao(doc.acoes, "documento_cancelar");
  if (!link || !temBotao(d, "Cancelar Documento")) {
    throw new ErroSei("SEI_ACAO_INDISPONIVEL", `O SEI n\u00E3o oferece cancelar o documento ${doc.numero}${temBotao(d, "Excluir") ? " (ele ainda pode ser exclu\u00EDdo)" : ""}.`);
  }
  base.mudancas = [{ campo: "Documento", antes: `${doc.titulo} (${doc.numero})`, depois: `cancelado: ${motivo}` }];
  if (!op.aplicar) return { ...base, resumo: `Vai cancelar ${doc.titulo} (${doc.numero}).` };
  const form = await Formulario.abrir(sei.http, link, "#frmDocumentoCancelar", { sinal: op.sinal });
  form.definir({ txaMotivo: motivo.slice(0, 500) });
  await form.enviar({ sinal: op.sinal, botao: "sbmSalvar", operacao: `o cancelamento de ${doc.numero}`, sucesso: (p) => parametros(p.url).get("acao") !== "documento_cancelar" });
  sei.invalidar(d.arvore.idProcedimento);
  const depois = await localizarDocumento(sei, numero, { sinal: op.sinal, forcar: true }).catch(() => null);
  if (depois && !depois.documento.cancelado) throw new ErroSei("SEI_RESPOSTA_INESPERADA", `O SEI n\u00E3o cancelou o documento ${doc.numero}.`);
  return { ...base, aplicado: true, resumo: `Documento ${doc.numero} cancelado.` };
}

/** Cancela as assinaturas de um documento interno (o SEI faz isso ao abrir o editor de um documento assinado). */
export async function cancelarAssinatura(sei: Sei, numero: string, op: OpcoesEscrita): Promise<ResultadoEscrita> {
  const d = await documentoOperavel(sei, numero, op.sinal);
  const doc = d.documento;
  const base: ResultadoEscrita = { alvo: doc.numero, mudancas: [], aplicado: false, resumo: "" };
  if (!doc.assinado) return { ...base, resumo: `O documento ${doc.numero} n\u00E3o est\u00E1 assinado.` };
  if (doc.externo) throw new ErroSei("ARGUMENTO_INVALIDO", `O documento ${doc.numero} \u00E9 externo: a autentica\u00E7\u00E3o de externo n\u00E3o se cancela pelo editor.`);
  if (!temBotao(d, "Editar Conte")) throw new ErroSei("SEI_ACAO_INDISPONIVEL", `Voc\u00EA n\u00E3o pode editar o documento ${doc.numero}, ent\u00E3o n\u00E3o pode cancelar a assinatura.`);
  base.mudancas = [{ campo: "Assinaturas", antes: doc.assinaturas.join("; ") || "assinado", depois: "canceladas (o documento precisar\u00E1 ser assinado de novo)" }];
  if (!op.aplicar) return { ...base, resumo: `Vai cancelar as assinaturas de ${doc.titulo} (${doc.numero}).` };
  await sei.http.obter(await linkDaTela(sei, d, "linkEditarConteudo", op.sinal), { sinal: op.sinal });
  sei.invalidar(d.arvore.idProcedimento);
  const depois = await localizarDocumento(sei, numero, { sinal: op.sinal, forcar: true });
  if (depois.documento.assinado) throw new ErroSei("SEI_RESPOSTA_INESPERADA", `O SEI manteve a assinatura do documento ${doc.numero}.`);
  return { ...base, aplicado: true, resumo: `Assinaturas do documento ${doc.numero} canceladas.` };
}

/** Dá ciência num documento ou, com `processo: true`, no processo dele. */
export async function darCiencia(sei: Sei, referencia: string, o: { processo?: boolean }, op: OpcoesEscrita): Promise<ResultadoEscrita> {
  if (o.processo) {
    const arv = await sei.arvore(referencia, { sinal: op.sinal, forcar: true });
    if (arv.nivel === "sigiloso") throw new ErroSei("SEI_SIGILOSO", "Processo sigiloso: o agente n\u00E3o atua nele.");
    if (!arv.botoesProcesso.some((b) => normalizar(b).startsWith("ciencia"))) throw new ErroSei("SEI_ACAO_INDISPONIVEL", `O SEI n\u00E3o oferece ci\u00EAncia no processo ${arv.protocolo}.`);
    const base: ResultadoEscrita = { alvo: arv.protocolo, mudancas: [{ campo: "Ci\u00EAncia", antes: "", depois: "registrada no processo" }], aplicado: false, resumo: `Vai dar ci\u00EAncia no processo ${arv.protocolo}.` };
    if (!op.aplicar) return base;
    const tela = await sei.http.obter(arv.linkProcesso, { sinal: op.sinal });
    const link = /var\s+linkCienciaProcesso\s*=\s*'([^']+)'/.exec(tela.html)?.[1];
    if (!link) throw new ErroSei("SEI_VERSAO_NAO_SUPORTADA", "A tela do processo n\u00E3o tem linkCienciaProcesso.");
    await sei.http.obter(link.replace(/&amp;/g, "&"), { sinal: op.sinal });
    await confirmarCiencia(sei, arv.protocolo, null, op.sinal);
    return { ...base, aplicado: true, resumo: `Ci\u00EAncia registrada no processo ${arv.protocolo}.` };
  }
  const d = await documentoOperavel(sei, referencia, op.sinal);
  if (!temBotao(d, "Ci\u00EAncia", "Ciencia")) throw new ErroSei("SEI_ACAO_INDISPONIVEL", `O SEI n\u00E3o oferece ci\u00EAncia no documento ${d.documento.numero}.`);
  const base: ResultadoEscrita = {
    alvo: d.documento.numero,
    mudancas: [{ campo: "Ci\u00EAncia", antes: "", depois: `registrada em ${d.documento.titulo}` }],
    aplicado: false,
    resumo: `Vai dar ci\u00EAncia no documento ${d.documento.numero}.`,
  };
  if (!op.aplicar) return base;
  await sei.http.obter(await linkDaTela(sei, d, "linkCienciaDocumento", op.sinal), { sinal: op.sinal });
  await confirmarCiencia(sei, d.arvore.protocolo, d.documento.numero, op.sinal);
  return { ...base, aplicado: true, resumo: `Ci\u00EAncia registrada no documento ${d.documento.numero}.` };
}

/** A ciência vira andamento no histórico: é a prova. */
async function confirmarCiencia(sei: Sei, protocolo: string, numeroDoc: string | null, sinal?: AbortSignal): Promise<void> {
  sei.invalidar();
  const h = await andamentos(sei, protocolo, { tipo: "completo", limite: 10, sinal });
  const achou = h.andamentos.some((a) => /ci[e\u00EA]ncia/i.test(a.descricao) && (!numeroDoc || a.descricao.includes(numeroDoc)));
  if (!achou) throw new ErroSei("SEI_RESPOSTA_INESPERADA", "O SEI n\u00E3o registrou a ci\u00EAncia no hist\u00F3rico.");
}
