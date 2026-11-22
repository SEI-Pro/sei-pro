import { parseHTML } from "linkedom";

export type JanelaFalsa = Window & typeof globalThis & Record<string, unknown>;

/**
 * Pagina linkedom vazia (a base dos falsos de CK4 e CK5).
 *
 * O `window` do linkedom compartilha as globais atribuidas entre paginas (um `CKEDITOR` posto numa
 * vaza para a outra), entao cada pagina recebe um Proxy que guarda as atribuicoes so dela e le o
 * resto do `window` real.
 */
export function paginaFalsa(corpo = ""): { doc: Document; win: JanelaFalsa } {
  const { window, document } = parseHTML(`<!doctype html><html><head></head><body>${corpo}</body></html>`);
  const proprias = new Map<PropertyKey, unknown>();
  const win = new Proxy(window as object, {
    get: (t, k) => (proprias.has(k) ? proprias.get(k) : Reflect.get(t, k)),
    set: (_t, k, v) => {
      proprias.set(k, v);
      return true;
    },
    has: (t, k) => proprias.has(k) || Reflect.has(t, k),
    deleteProperty: (_t, k) => proprias.delete(k),
  });
  return { doc: document as unknown as Document, win: win as unknown as JanelaFalsa };
}
