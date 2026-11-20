import { avisarEditor } from "../ui/avisar";
import type { Contexto, Recurso } from "./tipos";

/**
 * Aumentar/diminuir a fonte do texto selecionado em 2px (porte de `font-size.js`). So vale entre 8px e 68px
 * (limites exclusivos 7 e 70 do legado). No CK4 aplica um estilo `span`; no CK5 reinsere a selecao dentro de
 * um `span`. O HTML selecionado ja vem serializado do proprio editor (um `<` do usuario ja e `&lt;`), por
 * isso NAO e escapado de novo: escapar corromperia a formatacao da selecao.
 */
function tamanhoEmPx(el: Element | null): number {
  if (!el) return 16;
  const px = Number.parseFloat(el.ownerDocument.defaultView?.getComputedStyle?.(el)?.fontSize ?? "");
  return Number.isNaN(px) ? 16 : px;
}

export const recurso: Recurso = {
  id: "font-size",
  globais: (c: Contexto) => ({
    changeFontSize(this_: Element | null, modo: "up" | "down") {
      const ed = c.adaptador.getInstance(this_);
      if (!ed) return;
      const html = c.adaptador.getSelectedHtml(ed);
      if (!html || html.trim() === "") {
        avisarEditor(c.doc, "Selecione um texto para alterar o tamanho da fonte");
        return;
      }
      const atual = tamanhoEmPx(c.adaptador.getSelectionElement(ed));
      const novo = modo === "up" ? atual + 2 : atual - 2;
      if (!(novo > 7 && novo < 70)) return;
      c.adaptador.withEdit(ed, () => {
        if (c.adaptador.versao === 4) c.adaptador.applyStyle(ed, { element: "span", attributes: { style: `font-size: ${novo}px` } });
        else c.adaptador.insertHtml(ed, `<span style="font-size: ${novo}px">${html}</span>`);
      });
    },
  }),
};
