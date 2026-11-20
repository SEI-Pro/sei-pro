import { ATRIBUTO_BASE, ATRIBUTO_CEDENCIA } from "../contrato";

const MARCA_SCRIPT = "data-seipro-editor";

/**
 * Content script do editor (mundo ISOLADO), em duas coisas, nesta ordem:
 *  1. grava no `<html>` os ids dos recursos que o TS assumiu: o `loadModules` do adapter legado le isto
 *     (o atributo e visivel aos dois mundos) e nao carrega esses modulos. SINCRONO, antes de tudo;
 *  2. injeta o bundle do mundo da pagina (`js/editor/pagina.js`), onde existe o CKEditor.
 * Sem ids nao faz nada: o legado carrega tudo. Idempotente.
 */
export function executarInit(doc: Document, ids: readonly string[], runtime: { getURL(caminho: string): string }): void {
  if (ids.length === 0) return;
  doc.documentElement.setAttribute(ATRIBUTO_CEDENCIA, ids.join(","));
  if (doc.querySelector(`script[${MARCA_SCRIPT}="pagina"]`)) return;
  const s = doc.createElement("script");
  s.setAttribute(MARCA_SCRIPT, "pagina");
  s.setAttribute("src", runtime.getURL("js/editor/pagina.js"));
  s.setAttribute(ATRIBUTO_BASE, runtime.getURL(""));
  (doc.head ?? doc.documentElement).append(s);
}
