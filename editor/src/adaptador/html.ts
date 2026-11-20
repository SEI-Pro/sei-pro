/**
 * HTML -> nos, sem `innerHTML`: o texto vai a um `DOMParser` (documento inerte, sem scripts nem
 * carregamento de recursos) e os nos sao importados para o documento de destino. O embrulho
 * `<html><body>` e necessario: sem ele o parser do linkedom devolve o corpo vazio.
 */
export function htmlParaNos(doc: Document, html: string): Node[] {
  const Parser = (doc.defaultView as (Window & typeof globalThis) | null)?.DOMParser ?? globalThis.DOMParser;
  const inerte = new Parser().parseFromString(`<!doctype html><html><body>${html}</body></html>`, "text/html");
  return Array.from(inerte.body.childNodes).map((n) => doc.importNode(n, true));
}
