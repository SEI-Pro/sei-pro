/** `http:` ou `https:` valido (o `isValidHttpUrl` do legado). */
export function urlHttpValida(texto: string): boolean {
  try {
    const u = new URL(texto);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}
