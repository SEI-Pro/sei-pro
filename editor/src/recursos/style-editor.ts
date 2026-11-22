import type { Contexto, Recurso } from "./tipos";

/**
 * Botao "estilo do editor" (porte de `style-editor.js`): liga/desliga o visual "slim" do editor. O estado
 * fica em `localStorage.seiSlim_editor`; as classes slim vao no `<body>` e a fonte de icones e recarregada.
 */
const CLASSES_SLIM = ["seiSlim", "seiSlim_parent", "seiSlim_view"];

export const recurso: Recurso = {
  id: "style-editor",
  globais(c: Contexto) {
    const botoes = () => [...c.doc.querySelectorAll(".getNewStyleButton")];
    const marcar = (ligado: boolean) => {
      for (const b of botoes()) {
        b.classList.add(ligado ? "cke_button_on" : "cke_button_off");
        b.classList.remove(ligado ? "cke_button_off" : "cke_button_on");
      }
    };

    function updateStyleEditor(modo: "set" | "remove"): void {
      if (modo === "set") {
        c.win.localStorage.setItem("seiSlim_editor", "true");
        for (const el of c.doc.head.querySelectorAll('link[data-style="seipro-fonticon"], style[data-style="seipro-fonticon"]'))
          el.remove();
        (c.win as unknown as { insertFontIcon?(alvo: string): void }).insertFontIcon?.("head"); // helper do legado (sei-functions-pro.js)
        c.doc.body.classList.add(...CLASSES_SLIM);
      } else {
        c.win.localStorage.removeItem("seiSlim_editor");
        c.doc.body.classList.remove(...CLASSES_SLIM);
      }
    }

    return {
      getBoxStyleEditor(_this: Element | null) {
        if (!c.win.localStorage.getItem("seiSlim_editor")) {
          marcar(true);
          updateStyleEditor("set");
        } else {
          marcar(false);
          updateStyleEditor("remove");
        }
      },
      updateStyleEditor,
    };
  },
};
