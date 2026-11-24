import type { Contexto, Recurso } from "./tipos";

/**
 * Marca d'agua de "MINUTA" / "MODELO" (porte de `minuta-watermark.js`). A marca persiste no HTML salvo como um paragrafo
 * com um `<span class="minutaAncora">` (legenda no inicio do texto) e um `<style data-style="seipro-watermark">` que pinta
 * a marca de fundo por pseudo-elemento (`body:after` na pagina publicada; `.ck-editor__editable_inline:after` durante a
 * edicao no CK5, onde o editavel nao e um `<body>`).
 *
 * - `getMinutaWatermark`: botao da barra. Sem marca insere MINUTA; MINUTA troca para MODELO; MODELO troca para MINUTA.
 * - `insertMinutaWatermark(_iframe, type, mode)`: insere o paragrafo no inicio do corpo (`type` manual|auto; `mode`
 *   minuta|modelo). Como no legado, nao ha trava de duplicidade: quem chama decide.
 * - `insertAutomaticMinutaWatermark`: chamada no boot (monolito). Se o nome do documento contem "minuta" e nao ha marca,
 *   insere com type=auto; senao remove as marcas automaticas.
 */

type TipoMarca = "manual" | "auto";
type ModoMarca = "minuta" | "modelo";

interface DocumentoDoProcesso {
  id_protocolo: string;
  documento: string;
}

/** O que o monolito deixa em `window` e este recurso usa (todos opcionais). */
interface Monolito {
  dadosProcessoPro?: { listDocumentos?: DocumentoDoProcesso[] };
  enableButtonSavePro?(): void;
}

/** O paragrafo da marca (identico ao legado, incluindo o `<style>` com as regras do CK4/CK5 e do modo escuro). */
export function htmlDaMarca(texto: "MINUTA" | "MODELO", tipo: TipoMarca): string {
  return (
    '<p class="Texto_Alinhado_Esquerda">\n' +
    `   <span contenteditable="false" class="minutaAncora" data-type="${tipo}">\n` +
    '      <a class="ancoraSei" contenteditable="false" style="text-indent:0;">\n' +
    '          <style type="text/css" data-style="seipro-watermark">\n' +
    `              body:after, .ck-editor__editable_inline:after { content: "${texto}"; font-size: 9em; color: rgb(167 167 167 / 20%); z-index: 999; display: flex; align-items: center; justify-content: center; position: fixed; transform: rotate(-45deg); top: 0; right: 0; left: 0; bottom: 0; pointer-events: none; user-select: none; font-family: Arial; }\n` +
    "              html.dark-mode .minutaAncora, html.dark-mode .minutaAncora:after { background: #6f7071 !important; color: #f9f9f9 !important; }\n" +
    "              .minutaAncora { text-indent: 0; font-size: .8em; padding: 2px 5px; background: #e4e4e4; border-radius: 5px; font-weight: bold; color:#d45656; margin: 0 5px; }\n" +
    '              body.cke_editable .minutaAncora:after, .ck-editor__editable_inline .minutaAncora:after { content: " [delete isto para remover a marca d\'agua]"; color:#888; font-weight: normal; font-size: .85em; margin: 0 5px; }\n' +
    "              body.cke_editable:after, .ck-editor__editable_inline:after { width: fit-content; margin: 0 33%; overflow: hidden; }\n" +
    "          </style>\n" +
    `          * ${texto} DE DOCUMENTO` +
    "      </a>" +
    "   </span>&nbsp;&nbsp;\n" +
    "</p>\n"
  );
}

export const recurso: Recurso = {
  id: "minuta-watermark",
  globais(c: Contexto) {
    const A = c.adaptador;
    const w = c.win as unknown as Monolito;

    /** Roda `fn` sobre o corpo de um documento inerte (DOMParser) e devolve o HTML resultante. */
    function comCorpo(html: string, fn: (corpo: HTMLElement) => void): string {
      const Parser = (c.win as unknown as { DOMParser?: typeof DOMParser }).DOMParser ?? globalThis.DOMParser;
      const inerte = new Parser().parseFromString(`<!doctype html><html><body>${html}</body></html>`, "text/html");
      fn(inerte.body as HTMLElement);
      return inerte.body.innerHTML;
    }

    /** Tira do corpo o paragrafo (ou, sem paragrafo, o proprio span) de cada ancora que casa com `seletor`. */
    function removerMarcas(editor: object, seletor: string): void {
      A.transformBodyHtml(editor, (html) =>
        comCorpo(html, (corpo) => {
          for (const sp of Array.from(corpo.querySelectorAll(seletor))) {
            const p = sp.closest("p");
            if (p?.parentNode) p.parentNode.removeChild(p);
            else sp.parentNode?.removeChild(sp);
          }
        }),
      );
    }

    /** Nome do documento atual (`id_documento` da URL na lista do processo); null se faltar algum dado. */
    function nomeDoDocumento(): string | null {
      try {
        const lista = w.dadosProcessoPro?.listDocumentos;
        if (!Array.isArray(lista)) return null;
        const idDoc = new URL(c.win.location.href).searchParams.get("id_documento");
        const achado = lista.find((d) => d.id_protocolo === idDoc)?.documento;
        return typeof achado === "string" ? achado : null;
      } catch {
        return null;
      }
    }

    function insertMinutaWatermark(_iframe: unknown, tipo: TipoMarca, modo: ModoMarca = "minuta"): void {
      const editor = A.getInstance();
      if (!editor) return;
      const nome = nomeDoDocumento();
      const texto = (nome?.toLowerCase().includes("modelo") ?? false) || modo === "modelo" ? "MODELO" : "MINUTA";
      const marca = htmlDaMarca(texto, tipo);
      A.transformBodyHtml(editor, (html) => marca + (html || ""));
      w.enableButtonSavePro?.();
    }

    /** Pisca a nova ancora e a rola ate a vista (adiado para o CK5 reconciliar a view). */
    function destacar(editor: object): void {
      setTimeout(() => {
        const nova = A.findInBody(editor, ".minutaAncora")[0];
        if (!nova) return;
        const passos = [0, 1, 0, 1];
        passos.forEach((op, i) => {
          setTimeout(
            () => {
              nova.style.opacity = String(op);
            },
            100 * (i + 1),
          );
        });
        setTimeout(() => nova.style.removeProperty("opacity"), 100 * (passos.length + 1));
        nova.scrollIntoView?.();
      }, 0);
    }

    function getMinutaWatermark(this_: Element | null): void {
      const editor = A.getInstance(this_);
      if (!editor) return;
      const ancoras = A.findInBody(editor, ".minutaAncora");
      if (ancoras.length === 0) {
        insertMinutaWatermark(null, "manual");
        return;
      }
      const textoAtual = ancoras.map((a) => a.textContent ?? "").join("");
      const proximo: ModoMarca = textoAtual.includes("MINUTA") ? "modelo" : "minuta";
      removerMarcas(editor, ".minutaAncora");
      insertMinutaWatermark(null, "manual", proximo);
      destacar(editor);
    }

    function insertAutomaticMinutaWatermark(): void {
      const editor = A.getInstance();
      if (!editor) return;
      const nome = nomeDoDocumento();
      if (nome?.toLowerCase().includes("minuta")) {
        if (A.findInBody(editor, ".minutaAncora").length === 0) insertMinutaWatermark(null, "auto");
      } else if (A.findInBody(editor, '.minutaAncora[data-type="auto"]').length > 0) {
        removerMarcas(editor, '.minutaAncora[data-type="auto"]');
      }
    }

    return { getMinutaWatermark, insertMinutaWatermark, insertAutomaticMinutaWatermark };
  },
};
