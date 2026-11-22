/** Texto -> HTML seguro para inserir no editor: `&`, `<`, `>` e `"` viram entidades (o texto nunca vira marcacao). */
export function escaparHtml(texto: string): string {
  return texto.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
