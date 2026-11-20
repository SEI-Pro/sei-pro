import { inserirAntesDoParagrafo } from "../util/inserirAntes";
import type { Contexto, Recurso } from "./tipos";

/**
 * Quebra de secao: um paragrafo vazio que zera os contadores da numeracao (paragrafos, itens, incisos,
 * alineas), porte de `session-break.js`. O espaco final do `style` e do legado e fica.
 */
const QUEBRA_SECAO =
  '<p class="sessionBreakPro" style="counter-reset: paragrafo-n1 paragrafo-n2 paragrafo-n3 paragrafo-n4 romano_maiusculo letra_minuscula item-n1 item-n2 item-n3 item-n4 "></p>';

export const recurso: Recurso = {
  id: "session-break",
  globais: (c: Contexto) => ({
    getSessionBreak: (this_: Element | null) => inserirAntesDoParagrafo(c, this_, QUEBRA_SECAO),
  }),
};
