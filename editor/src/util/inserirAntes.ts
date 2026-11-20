import type { Contexto } from "../recursos/tipos";

/**
 * Insere `html` imediatamente ANTES do paragrafo onde esta o cursor, num unico passo de desfazer.
 * Sem editor ou sem paragrafo sob o cursor nao faz nada; em secao somente leitura o adaptador tambem nao escreve.
 */
export function inserirAntesDoParagrafo(c: Contexto, ref: Element | null, html: string): void {
  const ed = c.adaptador.getInstance(ref);
  if (!ed) return;
  const p = c.adaptador.getSelectionParagraph(ed);
  if (!p) return;
  c.adaptador.withEdit(ed, () => c.adaptador.insertHtmlBefore(ed, p, html));
}
