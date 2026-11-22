import { inserirAntesDoParagrafo } from "../util/inserirAntes";
import type { Contexto, Recurso } from "./tipos";

/** Quebra de pagina: o `div` que o SEI imprime como "page-break-after: always" (porte de `page-break.js`). */
const QUEBRA_PAGINA = '<div class="pageBreakPro" style="page-break-after: always"></div>';

export const recurso: Recurso = {
  id: "page-break",
  globais: (c: Contexto) => ({
    getPageBreak: (this_: Element | null) => inserirAntesDoParagrafo(c, this_, QUEBRA_PAGINA),
  }),
};
