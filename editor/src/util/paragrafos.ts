import type { Contexto } from "../recursos/tipos";

/**
 * Operacoes sobre paragrafos que o CK4 e o CK5 fazem de jeitos diferentes:
 *  - CK4: o documento da secao e um iframe e o DOM dele e a fonte da verdade (mutar `class`/`style` persiste);
 *  - CK5: o DOM e so a view; o estilo SEI do paragrafo e o atributo `estilo` do model (EstiloEditing) e o
 *    estilo inline vai pelo General HTML Support (`SeiProGhs`). Mutar o DOM nao entra no model nem e salvo.
 */
export interface OperacoesParagrafo {
  /** Os <p> abrangidos pela selecao (do paragrafo inicial ao final, em qualquer sentido); o do cursor se nao ha selecao. */
  selecionados(ed: object): HTMLElement[];
  /** A classe de estilo SEI do paragrafo: CK4, o atributo `class`; CK5, o atributo `estilo` do model. */
  classeDeEstilo(ed: object, p: HTMLElement): string;
  /** Troca a classe de estilo SEI do paragrafo. */
  definirClasse(ed: object, p: HTMLElement, classe: string): void;
  /** Alinhamento inline (paragrafo fora das familias de estilo do SEI). */
  definirTextAlign(ed: object, p: HTMLElement, valor: string): void;
}

// biome-ignore lint/suspicious/noExplicitAny: o CKEditor 5 do SEI nao tem tipos
type Qualquer = any;

const paragrafoDe = (no: Node | null): HTMLElement | null => {
  const el = no?.nodeType === 1 ? (no as Element) : (no?.parentElement ?? null);
  return (el?.closest("p") as HTMLElement | null) ?? null;
};

export function operacoesDeParagrafo(c: Contexto): OperacoesParagrafo {
  const ck5 = () => c.adaptador.versao === 5;
  const modelDe = (ed: Qualquer, p: Element) => {
    const visao = ed.editing.view.domConverter.mapDomToView(p);
    return visao ? ed.editing.mapper.toModelElement(visao) : null;
  };

  return {
    selecionados(ed) {
      const do_cursor = () => {
        const p = c.adaptador.getSelectionParagraph(ed) as HTMLElement | null;
        return p ? [p] : [];
      };
      if (ck5()) {
        const e = ed as Qualquer;
        const blocos = [...e.model.document.selection.getSelectedBlocks()] as Qualquer[];
        const ps = blocos
          .map((b) => {
            const v = e.editing.mapper.toViewElement(b);
            return v ? (e.editing.view.domConverter.mapViewToDom(v) as HTMLElement | null) : null;
          })
          .filter((el): el is HTMLElement => !!el && el.tagName === "P");
        return ps.length ? ps : do_cursor();
      }
      // CK4: a selecao nativa e a do documento do iframe da secao, nao a da janela do editor
      const doc = c.adaptador.getBodyContainer(ed)?.ownerDocument;
      const sel = doc?.getSelection?.();
      if (!sel || sel.rangeCount === 0 || !sel.anchorNode) return do_cursor();
      let ini = paragrafoDe(sel.anchorNode);
      let fim = paragrafoDe(sel.focusNode);
      if (!ini && !fim) return do_cursor();
      ini = ini ?? fim;
      fim = fim ?? ini;
      if (!ini || !fim) return do_cursor();
      if (ini === fim) return [ini];
      // anchor/focus podem estar invertidos (selecao de baixo para cima)
      let primeiro = ini;
      let ultimo = fim;
      if (ini.compareDocumentPosition(fim) & 2 /* DOCUMENT_POSITION_PRECEDING */) {
        primeiro = fim;
        ultimo = ini;
      }
      const saida: HTMLElement[] = [];
      let atual: Element | null = primeiro;
      for (let guarda = 0; atual && guarda < 5000; guarda += 1) {
        if (atual.tagName.toLowerCase() === "p") saida.push(atual as HTMLElement);
        if (atual === ultimo) break;
        atual = atual.nextElementSibling;
      }
      return saida.length ? saida : [primeiro];
    },

    classeDeEstilo(ed, p) {
      if (ck5()) return modelDe(ed, p)?.getAttribute("estilo") ?? "";
      return p.getAttribute("class") ?? "";
    },

    definirClasse(ed, p, classe) {
      if (ck5()) {
        const e = ed as Qualquer;
        const m = modelDe(e, p);
        if (m) e.model.change((w: Qualquer) => w.setAttribute("estilo", classe, m));
        return;
      }
      p.removeAttribute("style");
      p.setAttribute("class", classe);
    },

    definirTextAlign(ed, p, valor) {
      if (ck5()) {
        (c.win as Qualquer).SeiProGhs?.setEstilos(p, { "text-align": valor }, ed);
        return;
      }
      p.removeAttribute("style");
      p.style.textAlign = valor;
    },
  };
}
