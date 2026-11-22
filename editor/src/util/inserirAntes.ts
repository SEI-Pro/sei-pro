import type { Contexto } from "../recursos/tipos";

/**
 * Insere `html` imediatamente ANTES do paragrafo onde esta o cursor, num unico passo de desfazer.
 * `aposInserir` roda DENTRO do mesmo passo (o CK5 ainda nao atualizou o DOM, mas o model ja tem o elemento novo). Sem editor ou sem paragrafo sob o cursor nao faz nada; em secao somente leitura o adaptador tambem nao escreve.
 */
export function inserirAntesDoParagrafo(
  c: Contexto,
  ref: Element | null,
  html: string,
  aposInserir?: (ed: object, p: Element) => void,
): void {
  const ed = c.adaptador.getInstance(ref);
  if (!ed) return;
  const p = c.adaptador.getSelectionParagraph(ed);
  if (!p) return;
  // secao somente leitura: avisa e NAO roda o callback (ele escreve por conta propria, p.ex. no irmao anterior de `p`)
  if (c.adaptador.somenteLeitura(ed)) {
    c.adaptador.recusarEscrita();
    return;
  }
  c.adaptador.withEdit(ed, () => {
    c.adaptador.insertHtmlBefore(ed, p, html);
    aposInserir?.(ed, p);
  });
}
