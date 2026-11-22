import { modeloDe } from "../util/ck5";
import { inserirAntesDoParagrafo } from "../util/inserirAntes";
import type { Contexto, Recurso } from "./tipos";

/**
 * Quebra de secao: um paragrafo vazio que zera os contadores da numeracao (paragrafos, itens, incisos,
 * alineas), porte de `session-break.js`. O espaco final do `style` e do legado e fica.
 */
const QUEBRA_SECAO =
  '<p class="sessionBreakPro" style="counter-reset: paragrafo-n1 paragrafo-n2 paragrafo-n3 paragrafo-n4 romano_maiusculo letra_minuscula item-n1 item-n2 item-n3 item-n4 "></p>';

/** O `counter-reset` do paragrafo da quebra (o valor do `style` acima, para o CK5, que o descarta na importacao por HTML). */
const COUNTER_RESET =
  "paragrafo-n1 paragrafo-n2 paragrafo-n3 paragrafo-n4 romano_maiusculo letra_minuscula item-n1 item-n2 item-n3 item-n4 ";

export const recurso: Recurso = {
  id: "session-break",
  globais: (c: Contexto) => ({
    getSessionBreak: (this_: Element | null) =>
      inserirAntesDoParagrafo(c, this_, QUEBRA_SECAO, (ed, p) => {
        // CK5: o `style="counter-reset: ..."` do HTML e descartado na importacao (medido ao vivo); aplica pelo GHS no
        // elemento recem-inserido (o irmao anterior de `p` no model), no MESMO model.change da insercao.
        if (c.adaptador.versao !== 5) return;
        // biome-ignore lint/suspicious/noExplicitAny: o CKEditor 5 do SEI nao tem tipos
        const e = ed as any;
        const ghs = e.plugins?.has("GeneralHtmlSupport") ? e.plugins.get("GeneralHtmlSupport") : null;
        const novo = modeloDe(e, p)?.previousSibling;
        if (ghs && novo?.name === "paragraph") ghs.setModelHtmlStyles("p", { "counter-reset": COUNTER_RESET }, novo);
      }),
  }),
};
