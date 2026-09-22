/**
 * Acesso ao parser de HTML.
 *
 * No navegador é o `DOMParser` nativo. Nos testes, o do linkedom, instalado
 * com `definirAnalisador`. Nenhum outro arquivo do núcleo chama `DOMParser`
 * diretamente, e é isso que permite testar tudo fora do navegador.
 */

export type Analisador = (html: string) => Document;

let analisadorAtual: Analisador | null = null;

export function definirAnalisador(fn: Analisador | null): void {
  analisadorAtual = fn;
}

export function analisarHtml(html: string): Document {
  if (analisadorAtual) return analisadorAtual(html);
  return new DOMParser().parseFromString(html, "text/html");
}

/** Texto visível de um elemento, com espaços normalizados. */
export function textoDe(el: Element | null | undefined): string {
  return (el?.textContent ?? "").replace(/\s+/g, " ").trim();
}

export { decodificarEntidades } from "./entidades";
