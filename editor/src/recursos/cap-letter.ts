import { avisarEditor } from "../ui/avisar";
import { capitalizar } from "../util/capitalizar";
import { escaparHtml } from "../util/html";
import type { Contexto, Recurso } from "./tipos";

/**
 * "Converter a primeira letra": o texto selecionado vira "Titulo Assim". Correcoes sobre o legado: o texto
 * volta ao editor ESCAPADO (antes `a<b` entrava como marcacao) e selecao so de espacos conta como vazia
 * (antes apagava os espacos, porque `capitalizar` devolve "").
 */
export const recurso: Recurso = {
  id: "cap-letter",
  globais: (c: Contexto) => ({
    convertFirstLetter(this_: Element | null) {
      const ed = c.adaptador.getInstance(this_);
      if (!ed) return;
      const selecionado = c.adaptador.getSelectedText(ed);
      if (!selecionado || selecionado.trim() === "") {
        avisarEditor(c.doc, "Selecione um texto para converter");
        return;
      }
      c.adaptador.insertHtml(ed, escaparHtml(capitalizar(selecionado)));
    },
  }),
};
