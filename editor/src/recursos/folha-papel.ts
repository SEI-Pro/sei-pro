import type { Contexto, Recurso } from "./tipos";

/**
 * "Ver o texto como folha de papel" (porte de `folha-papel.js`): a pagina do editor vira uma mesa e o texto
 * uma folha branca de 940px. So CSS e marcas no DOM; o estado fica em `localStorage.spro_editor_folha`.
 */
const CHAVE = "spro_editor_folha";
const ID_ESTILO = "seipro-folha-editor";
const ATRIBUTO = "data-spro-folha-editor";

/** Fundo da folha DENTRO do iframe do CK4 (branco; escuro quando o tema deixa o texto claro), inclusive nas secoes somente leitura que o tema pinta de cinza; so cor, sem margem (a altura do iframe e fixa). */
function cssFundoIframe(cor: string): string {
  return (
    "html:root, html:root body, html:root body.cke_editable.cke_editable.cke_editable," +
    ` html:root body[contenteditable] { background-color: ${cor} !important; background-image: none !important; }\n`
  );
}

/** CSS da pagina: folha de 940px (828 de texto + 2 x 56 de margem, a mesma largura da visualizacao). */
export function cssPagina(escuro: boolean): string {
  const a = `html[${ATRIBUTO}]`;
  const at = `[${ATRIBUTO}]`;
  const mesa = escuro ? "#141619" : "#f3f4f7";
  const borda = escuro ? "#2a2d33" : "#e3e6ee";
  const folha = escuro ? "#202123" : "#ffffff";
  const sombra = "rgba(20, 25, 50, .13)";
  const lados = `14px 0 24px -14px ${sombra}, -14px 0 24px -14px ${sombra}`;
  const base = `0 14px 24px -14px ${sombra}`;
  const c = `${a} .cke_contents[data-spro-folha]`;
  return (
    // mesa
    `${a} #divEditores, ${a} .cke_inner, ${a} .cke { background-color: ${mesa} !important; }\n` +
    `${a} #divEditores { padding-bottom: 28px; }\n` +
    // CK4: cada .cke_contents e um pedaco da folha
    `${c} { max-width: 828px; margin: 0 auto; padding: 0 56px; background-color: ${folha} !important;` +
    ` border: 0 solid ${borda}; border-width: 0 1px; box-shadow: ${lados}; clip-path: inset(0 -30px); }\n` +
    `${c}[data-spro-folha~="primeira"] { margin-top: 24px; padding-top: 40px; border-top-width: 1px; border-radius: 12px 12px 0 0; }\n` +
    `${c}[data-spro-folha~="ultima"] { padding-bottom: 40px; border-bottom-width: 1px; border-radius: 0 0 12px 12px;` +
    ` box-shadow: ${lados}, ${base}; clip-path: inset(0 -30px -30px); }\n` +
    `${c}[data-spro-folha~="primeira"][data-spro-folha~="ultima"] { border-radius: 12px; }\n` +
    `@media (max-width: 1000px) { ${c} { padding-left: 20px; padding-right: 20px; } }\n` +
    // CK5: as secoes sao editores irmaos dentro de um unico container; a folha e o container, as secoes ficam coladas dentro
    `${a} .infra-editor__editor-completo { background-color: ${mesa} !important; }\n` +
    `${a} .infra-editor__editable-inner-container { box-sizing: border-box; width: min(940px, calc(100% - 24px));` +
    ` margin: 28px auto; padding: 0; background-color: ${folha} !important; border: 1px solid ${borda}; border-radius: 12px;` +
    ` box-shadow: 0 1px 2px rgba(20, 25, 50, .08), 0 8px 28px rgba(20, 25, 50, .12); }\n` +
    `${a} .infra-editor__editable-inner-container > .ck-content { box-sizing: border-box; width: 100%; max-width: none;` +
    ` margin: 0 !important; padding: 12px 56px !important; background-color: transparent !important; border: 0 !important;` +
    ` border-radius: 0 !important; box-shadow: none !important; }\n` +
    `${a} .infra-editor__editable-inner-container > .ck-content:first-child { padding-top: 40px !important; }\n` +
    `${a} .infra-editor__editable-inner-container > .ck-content:last-child { padding-bottom: 40px !important; }\n` +
    // tema escuro do Estilo Avancado: texto claro, entao a folha escurece junto (acompanha a troca de tema sem religar)
    `html[data-spro-tema="escuro"]${at} .infra-editor__editor-completo { background-color: #141619 !important; }\n` +
    `html[data-spro-tema="escuro"]${at} .infra-editor__editable-inner-container { background-color: #202123 !important; border-color: #2a2d33; }\n`
  );
}

/** Poe (css) ou tira (null) o `<style>` da extensao num documento; sempre um so. */
function injetarEstilo(doc: Document, css: string | null): void {
  if (!doc.head) return;
  doc.querySelector(`style[data-style="${ID_ESTILO}"]`)?.remove();
  if (!css) return;
  const el = doc.createElement("style");
  el.setAttribute("data-style", ID_ESTILO);
  el.textContent = css;
  doc.head.append(el);
}

/** Fundo branco inline `!important` (so ele vence regra `!important` alheia); guarda o original em `data-spro-folha-bg` para devolver. */
function fundoInline(el: HTMLElement | null, ligar: boolean, cor = "#ffffff"): void {
  if (!el?.style) return;
  const guardado = el.getAttribute("data-spro-folha-bg");
  if (ligar) {
    if (guardado === null)
      el.setAttribute(
        "data-spro-folha-bg",
        `${el.style.getPropertyValue("background-color")}|${el.style.getPropertyPriority("background-color")}`,
      );
    el.style.setProperty("background-color", cor, "important");
  } else if (guardado !== null) {
    const [valor, prioridade] = guardado.split("|");
    el.removeAttribute("data-spro-folha-bg");
    el.style.removeProperty("background-color");
    if (valor) el.style.setProperty("background-color", valor, prioridade || "");
  }
}

export const recurso: Recurso = {
  id: "folha-papel",
  globais(c: Contexto) {
    const doc = c.doc;
    const ligada = () => !!c.win.localStorage?.getItem(CHAVE);
    const modoEscuro = () =>
      !!c.win.localStorage?.getItem("darkModePro") || doc.documentElement.getAttribute("data-spro-tema") === "escuro";
    let ligouCk4 = false;

    function aplicarNosIframes(ligar: boolean): void {
      for (const f of doc.querySelectorAll<HTMLIFrameElement>("iframe.cke_wysiwyg_frame")) {
        const d = f.contentDocument;
        if (!d?.head) continue;
        const cor = modoEscuro() ? "#202123" : "#ffffff";
        injetarEstilo(d, ligar ? cssFundoIframe(cor) : null);
        fundoInline(d.documentElement, ligar, cor);
        fundoInline(d.body, ligar, cor);
      }
    }

    /** Primeira/ultima secao (CK4) para o CSS fechar a folha; as de dentro sao "meio". */
    function marcarSecoes(ligar: boolean): void {
      const itens = [...doc.querySelectorAll(".cke_contents")];
      itens.forEach((el, i) => {
        if (!ligar) {
          el.removeAttribute("data-spro-folha");
          return;
        }
        const papel = [i === 0 ? "primeira" : "", i === itens.length - 1 ? "ultima" : ""].filter(Boolean);
        el.setAttribute("data-spro-folha", papel.join(" ") || "meio");
      });
    }

    function aplicarFolhaEditorPro(ligar: boolean): void {
      injetarEstilo(doc, ligar ? cssPagina(modoEscuro()) : null);
      aplicarNosIframes(ligar);
      marcarSecoes(ligar);
      if (ligar) doc.documentElement.setAttribute(ATRIBUTO, "");
      else doc.documentElement.removeAttribute(ATRIBUTO);
      for (const b of doc.querySelectorAll(".getPaperViewButtom")) {
        b.classList.toggle("cke_button_on", ligar);
        b.classList.toggle("cke_button_off", !ligar);
        b.setAttribute("aria-pressed", ligar ? "true" : "false");
      }
    }

    return {
      aplicarFolhaEditorPro,

      getPaperViewButtom(_this: Element | null) {
        const ligar = !ligada();
        if (ligar) c.win.localStorage.setItem(CHAVE, "1");
        else c.win.localStorage.removeItem(CHAVE);
        aplicarFolhaEditorPro(ligar);
      },

      /** Boot: o iframe do CK4 e recriado em certas trocas (codigo-fonte etc.), entao o branco e reaplicado; depois reaplica o estado salvo. */
      initFolhaEditorPro() {
        const ck = (
          c.win as unknown as { CKEDITOR?: { on?: unknown; instances?: Record<string, { on(ev: string, fn: () => void): void }> } }
        ).CKEDITOR;
        if (typeof ck?.on === "function" && !ligouCk4) {
          ligouCk4 = true;
          const religar = (editor: { on(ev: string, fn: () => void): void }) =>
            editor.on("contentDom", () => ligada() && aplicarNosIframes(true));
          for (const ed of Object.values(ck.instances ?? {})) religar(ed);
          (ck.on as (ev: string, fn: (e: { editor: { on(ev: string, fn: () => void): void } }) => void) => void)("instanceReady", (e) =>
            religar(e.editor),
          );
        }
        aplicarFolhaEditorPro(ligada());
      },
    };
  },
};
