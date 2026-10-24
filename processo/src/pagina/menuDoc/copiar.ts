/**
 * Os textos que o menu copia, iguais aos do legado (`callActionsArvore` e `getCitacaoDoc` em sei-pro-arvore.js):
 * o número SEI e o nome vêm do TEXTO do nó na árvore (como o usuário o vê), e a citação respeita a opção
 * `citacaodoc` das configurações.
 */

export interface Copia {
  /** Texto puro (e, quando há `html`, a versão sem marcação). */
  texto: string;
  /** Versão com hiperlink, para colar num documento do SEI. */
  html?: string;
}

/** Último "pedaço" do nome do nó: o número SEI, com ou sem parênteses. */
function ultimoPedaco(rotulo: string): string {
  return rotulo.includes(" ") ? (rotulo.split(" ").pop() ?? "") : "";
}

/** "Despacho (0103947)" e "Despacho 0103947" dão "0103947"; o legado (`getNrSei`) tira os parênteses. */
export function numeroSeiDoRotulo(rotulo: string): string {
  const p = ultimoPedaco(rotulo.trim());
  return p.includes("(") ? p.replace(")", "").replace("(", "").trim() : p;
}

/** O nome sem o número (`getNomeSei` do legado): "Despacho (0103947)" dá "Despacho". */
export function nomeSeiDoRotulo(rotulo: string): string {
  const r = rotulo.trim();
  const p = ultimoPedaco(r);
  return p && r.split(" ").includes(p) ? r.replace(p, "").trim() : r;
}

/** "SEI nº " (padrão), "SEI ", "Doc. SEI nº " ou nada, conforme `citacaodoc`. */
export function citacaoDoDocumento(opcao: unknown): string {
  if (opcao === "citacaodoc_2") return "SEI ";
  if (opcao === "citacaodoc_5") return "Doc. SEI nº ";
  if (opcao === "citacaodoc_3" || opcao === "citacaodoc_4") return "";
  return "SEI nº ";
}

const escaparAtributo = (s: string): string => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const escaparTexto = (s: string): string => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export interface DadosDaCopia {
  /** Texto do nó do documento na árvore. */
  rotulo: string;
  /** Valor de `citacaodoc` (padrão: "SEI nº "). */
  citacaoOpcao: unknown;
  /** Link permanente do documento (`procedimento_trabalhar` com `id_documento`). */
  linkDocumento: string;
}

const ancora = (link: string, texto: string): string => `<a href="${escaparAtributo(link)}" target="_blank">${escaparTexto(texto)}</a>`;

export const copiaDoNumero = (d: DadosDaCopia): Copia => ({ texto: numeroSeiDoRotulo(d.rotulo) });

export function copiaDoNome(d: DadosDaCopia): Copia {
  const nr = numeroSeiDoRotulo(d.rotulo);
  if (d.citacaoOpcao === "citacaodoc_4") return { texto: nr };
  return { texto: `${nomeSeiDoRotulo(d.rotulo)} (${citacaoDoDocumento(d.citacaoOpcao)}${nr})` };
}

export const copiaDoLink = (d: DadosDaCopia): Copia => ({ texto: d.linkDocumento });

export function copiaDoNumeroComLink(d: DadosDaCopia): Copia {
  const nr = numeroSeiDoRotulo(d.rotulo);
  return { texto: nr, html: ancora(d.linkDocumento, nr) };
}

export function copiaDoNomeComLink(d: DadosDaCopia): Copia {
  const nr = numeroSeiDoRotulo(d.rotulo);
  if (d.citacaoOpcao === "citacaodoc_4") return { texto: nr, html: ancora(d.linkDocumento, nr) };
  const nome = nomeSeiDoRotulo(d.rotulo);
  const cita = citacaoDoDocumento(d.citacaoOpcao);
  return { texto: `${nome} (${cita}${nr})`, html: `${escaparTexto(nome)} (${escaparTexto(cita)}${ancora(d.linkDocumento, nr)})` };
}

/** Só os dígitos do número do processo (`onlyNumber` do legado). */
export const soNumeros = (protocolo: string): string => (/\d/.test(protocolo) ? (protocolo.match(/\d+/g) ?? []).join("") : protocolo);

/** Link permanente do documento ou do processo: o único endereço que o SEI aceita sem assinatura. */
export function linkPermanente(base: string, idProcedimento: string, idDocumento?: string): string {
  return `${base}?acao=procedimento_trabalhar&id_procedimento=${idProcedimento}${idDocumento ? `&id_documento=${idDocumento}` : ""}`;
}
