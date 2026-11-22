import type { Contexto, Recurso } from "./tipos";

/**
 * Copiar formatacao / "pincel" (porte de `copy-style.js`): captura a formatacao do ponto do cursor (cor, fundo,
 * tamanho, negrito, sublinhado, italico, tachado, sub/sobrescrito) e a aplica na proxima selecao. O estado fica em
 * `sessionStorage.copyStylePro` (o estilo capturado) e na classe `cke_copyformatting_active` do corpo.
 *
 * Correcoes sobre o legado: (1) as marcas (negrito...) sao aplicadas ANTES de embrulhar a selecao no `span`: o
 * legado inseria o `span` primeiro, o que colapsa a selecao, e aplicava as marcas num cursor sem texto;
 * (2) o estilo guardado vem do `sessionStorage` (da pagina) e entra num atributo `style=""`: cor, fundo e tamanho sao
 * validados antes de montar o HTML.
 */
export interface EstiloCapturado {
  fontSize: number | false;
  color: string | false;
  backgroundColor: string | false;
  bold: boolean;
  underline: boolean;
  italic: boolean;
  strike: boolean;
  subscript: boolean;
  superscript: boolean;
}

const CHAVE = "copyStylePro";
const CLASSE_ATIVO = "cke_copyformatting_active";
/** Cor segura para um atributo style: #hex, rgb()/rgba() numerico ou nome simples. */
const COR_VALIDA = /^(?:#[0-9a-f]{3,8}|rgba?\(\s*\d{1,3}(?:\.\d+)?\s*(?:,\s*\d{1,3}(?:\.\d+)?\s*){2,3}\)|[a-z]{3,30})$/i;

/** O estilo do elemento do cursor (o `getElementStyleSelected` do monolito, sem jQuery). */
export function lerEstiloDoElemento(el: Element): EstiloCapturado {
  const cs = el.ownerDocument.defaultView?.getComputedStyle?.(el);
  const tamanho = Number.parseFloat(cs?.fontSize ?? "");
  const emSubSup = !!el.closest("sub") || !!el.closest("sup");
  return {
    fontSize: Number.isNaN(tamanho) || (tamanho === 16 && emSubSup) ? false : tamanho,
    color: !cs?.color || cs.color === "rgb(0, 0, 0)" ? false : cs.color,
    backgroundColor: !cs?.backgroundColor || cs.backgroundColor === "rgba(0, 0, 0, 0)" ? false : cs.backgroundColor,
    bold: !!el.closest("strong, b"),
    underline: !!el.closest("u"),
    italic: !!el.closest("em, i"),
    strike: !!el.closest("s, strike, del"),
    subscript: !!el.closest("sub"),
    superscript: !!el.closest("sup"),
  };
}

export const recurso: Recurso = {
  id: "copy-style",
  globais(c: Contexto) {
    const a = c.adaptador;
    const storage = () => c.win.sessionStorage;

    const lerGuardado = (): EstiloCapturado | null => {
      try {
        return JSON.parse(storage().getItem(CHAVE) ?? "null");
      } catch {
        return null;
      }
    };
    const temSelecao = (ed: object): boolean => a.getSelectedHtml(ed).trim() !== "" || a.getSelectedText(ed).trim() !== "";
    const pincelAtivo = (ed: object): boolean => !!a.getBodyContainer(ed)?.classList.contains(CLASSE_ATIVO);
    /** `true` liga (on), `false` desliga (off), "desabilitar"/"habilitar" mexem so no estado disabled. */
    const botao = (estado: boolean | "habilitar" | "desabilitar") => {
      for (const b of c.doc.querySelectorAll(".getCopyStyleButtom")) {
        if (estado === "desabilitar") b.classList.add("cke_button_disabled");
        else if (estado === "habilitar") b.classList.remove("cke_button_disabled");
        else {
          b.classList.toggle("cke_button_on", estado);
          b.classList.toggle("cke_button_off", !estado);
        }
      }
    };

    function removeCopyStyle(): void {
      const ed = a.getInstance();
      if (ed) a.getBodyContainer(ed)?.classList.remove(CLASSE_ATIVO);
      storage().removeItem(CHAVE);
      botao(false);
    }

    function actionCopyStyle(editor?: object): void {
      const ed = editor ?? a.getInstance();
      if (!ed) return;
      if (pincelAtivo(ed)) {
        removeCopyStyle();
        return;
      }
      const el = a.getSelectionElement(ed);
      if (!el) return;
      storage().setItem(CHAVE, JSON.stringify(lerEstiloDoElemento(el)));
      a.getBodyContainer(ed)?.classList.add(CLASSE_ATIVO);
      botao(true);
    }

    /** Chamado em todo mouseup pelo monolito: so age com o pincel ativo E selecao; tambem (des)habilita o botao. */
    function applyCopyStyle(): void {
      const ed = a.getInstance();
      if (!ed) return;
      const selecionado = temSelecao(ed);
      const ativo = pincelAtivo(ed);
      botao(selecionado || ativo ? "habilitar" : "desabilitar");
      const estilo = lerGuardado();
      if (!(estilo && selecionado && ativo)) return;

      a.withEdit(ed, () => {
        a.execCommand(ed, "removeFormat");
        // marcas primeiro: com a selecao ainda de pe (embrulhar em span a colapsa)
        for (const [marca, comando] of [
          [estilo.bold, "bold"],
          [estilo.underline, "underline"],
          [estilo.italic, "italic"],
          [estilo.strike, "strike"],
          [estilo.subscript, "subscript"],
          [estilo.superscript, "superscript"],
        ] as const) {
          if (marca === true) a.execCommand(ed, comando);
        }
        const css: string[] = [];
        if (typeof estilo.backgroundColor === "string" && COR_VALIDA.test(estilo.backgroundColor))
          css.push(`background-color: ${estilo.backgroundColor}`);
        if (typeof estilo.fontSize === "number" && Number.isFinite(estilo.fontSize) && estilo.fontSize > 0 && estilo.fontSize < 400)
          css.push(`font-size: ${estilo.fontSize}px`);
        if (typeof estilo.color === "string" && COR_VALIDA.test(estilo.color)) css.push(`color: ${estilo.color}`);
        if (css.length) {
          const html = a.getSelectedHtml(ed);
          if (html !== "") a.insertHtml(ed, `<span style="${css.join("; ")}">${html}</span>`);
        }
      });
      // com Alt apertado o pincel continua (aplicacao em sequencia)
      const alt = !!(c.win as unknown as { event?: { altKey?: boolean } }).event?.altKey;
      if (!alt) removeCopyStyle();
    }

    return {
      setCopyStyle(this_: Element | null) {
        const ed = a.getInstance(this_);
        if (ed) actionCopyStyle(ed);
      },
      actionCopyStyle,
      getCopyStyle: lerGuardado,
      applyCopyStyle,
      removeCopyStyle,
      /** Menu de contexto "Copiar formatacao" no CK4; no SEI 5 o menu do navegador (copiar/corretor) fica. */
      menuCopyStyle(editor: object) {
        if (!editor) return;
        a.addContextMenu(editor, (alvo) => {
          if (a.versao === 5) return [];
          if (alvo?.closest("p") && temSelecao(editor)) return [{ label: "Copiar formatação", action: () => actionCopyStyle(editor) }];
          return [];
        });
      },
    };
  },
};
