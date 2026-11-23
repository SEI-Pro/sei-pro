import type { Contexto, Recurso } from "./tipos";

/**
 * Botao "estilo do editor" (porte de `style-editor.js`): liga/desliga o visual "slim" do editor. O estado
 * fica em `localStorage.seiSlim_editor`; as classes slim vao no `<body>` e a fonte de icones e recarregada.
 */
const CLASSES_SLIM = ["seiSlim", "seiSlim_parent", "seiSlim_view"];
const CHAVE = "seiSlim_editor";

function marcarBotoes(c: Contexto, ligado: boolean): void {
  for (const b of c.doc.querySelectorAll(".getNewStyleButton")) {
    b.classList.toggle("cke_button_on", ligado);
    b.classList.toggle("cke_button_off", !ligado);
  }
}

/** So a tela: classes slim no corpo e fonte de icones. Nao mexe no storage (quem chama decide). */
function aplicarNaTela(c: Contexto, ligado: boolean): void {
  if (ligado) {
    for (const el of c.doc.head.querySelectorAll('link[data-style="seipro-fonticon"], style[data-style="seipro-fonticon"]')) el.remove();
    (c.win as unknown as { insertFontIcon?(alvo: string): void }).insertFontIcon?.("head"); // helper do legado (sei-functions-pro.js)
    c.doc.body.classList.add(...CLASSES_SLIM);
    // O CSS escuro da barra e do documento depende de body.dark-mode, que o Estilo Avancado novo nao poe.
    if (c.win.localStorage?.getItem("darkModePro") || c.doc.documentElement.getAttribute("data-spro-tema") === "escuro")
      c.doc.body.classList.add("dark-mode");
  } else {
    c.doc.body.classList.remove(...CLASSES_SLIM);
    if (!c.win.localStorage?.getItem("seiSlim")) c.doc.body.classList.remove("dark-mode"); // com o estilo antigo ligado o `dark-mode` e dele
  }
}

export const recurso: Recurso = {
  id: "style-editor",

  /**
   * O Estilo Avancado (em outra aba) liga e desliga `seiSlim_editor`: o evento `storage` chega a este editor aberto
   * e o visual acompanha na hora, sem recarregar. O evento so dispara em OUTRO documento, entao o botao do proprio
   * editor nao entra em ciclo.
   */
  iniciar(c: Contexto) {
    c.win.addEventListener("storage", (e) => {
      const ev = e as StorageEvent;
      if (ev.key !== CHAVE) return;
      const ligado = !!ev.newValue;
      marcarBotoes(c, ligado);
      aplicarNaTela(c, ligado);
    });
  },

  globais(c: Contexto) {
    function updateStyleEditor(modo: "set" | "remove"): void {
      if (modo === "set") c.win.localStorage.setItem(CHAVE, "true");
      else c.win.localStorage.removeItem(CHAVE);
      aplicarNaTela(c, modo === "set");
    }

    return {
      getBoxStyleEditor(_this: Element | null) {
        const ligar = !c.win.localStorage.getItem(CHAVE);
        marcarBotoes(c, ligar);
        updateStyleEditor(ligar ? "set" : "remove");
      },
      updateStyleEditor,
    };
  },
};
