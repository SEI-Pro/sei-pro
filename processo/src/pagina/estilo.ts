/**
 * O CSS do módulo viaja dentro do JS e é posto numa <style> do documento (o quadro da árvore e a janela de
 * topo, onde os modais abrem). Sem arquivo de folha de estilo no manifest e sem depender da ordem de carga.
 */

import { esquemaDoEstilo2 } from "@comum/pagina/tema";

const ID = "spro-processo-estilo";
let css = "";

/** O texto do CSS vem do `main.ts` (o Node dos testes não importa .css). */
export function definirCss(texto: string): void {
  css = texto;
}

export function garantirEstilo(doc: Document): void {
  if (!css || doc.getElementById(ID)) return;
  const el = doc.createElement("style");
  el.id = ID;
  el.textContent = css;
  (doc.head ?? doc.documentElement).append(el);
}

/**
 * O SEI está escuro? Manda o Estilo Avançado (`data-spro-tema` no <html>); senão, o modo noturno antigo, que só vale
 * quando o legado de fato pintou a página (classe `dark-mode` no <body>): a chave `darkModePro` sozinha não escurece nada.
 */
export function temaEscuro(doc: Document): boolean {
  const novo = esquemaDoEstilo2(doc);
  if (novo) return novo === "escuro";
  return doc.body?.classList.contains("dark-mode") ?? false;
}

/** Avisa quando o tema muda (Estilo Avançado ligado/desligado/trocado, ou o legado pôs `dark-mode` no corpo). */
export function aoMudarTema(doc: Document, cb: () => void): () => void {
  const Observador =
    (doc.defaultView as unknown as { MutationObserver?: typeof MutationObserver } | null)?.MutationObserver ?? globalThis.MutationObserver;
  if (typeof Observador !== "function") return () => {};
  const o = new Observador(cb);
  if (doc.documentElement) o.observe(doc.documentElement, { attributes: true, attributeFilter: ["data-spro-tema"] });
  if (doc.body) o.observe(doc.body, { attributes: true, attributeFilter: ["class"] });
  return () => o.disconnect();
}
