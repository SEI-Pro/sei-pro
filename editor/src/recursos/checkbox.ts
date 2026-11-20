import { textoAleatorio } from "../util/aleatorio";
import type { Contexto, Recurso } from "./tipos";

/** Caixa de selecao do SEI: ancora com `data-id` unico; o clique alterna `&#9744;`/`&#9745;` (`toggleCheckboxSEI`, no monolito). */
const caixa = () =>
  `<span class="ancoraSei checkboxSEI" data-id="${textoAleatorio(16)}" style="font-size: 1.5em;font-weight: bold;">&#9744;</span>&nbsp;`;

export const recurso: Recurso = {
  id: "checkbox",
  globais: (c: Contexto) => ({
    getInsertCheckboxButtom(this_: Element | null) {
      const ed = c.adaptador.getInstance(this_);
      if (!ed) return;
      c.adaptador.withEdit(ed, () => c.adaptador.insertHtml(ed, caixa()));
    },
  }),
};
