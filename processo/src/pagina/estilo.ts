/**
 * O CSS do módulo viaja dentro do JS e é posto numa <style> do documento (o quadro da árvore e a janela de
 * topo, onde os modais abrem). Sem arquivo de folha de estilo no manifest e sem depender da ordem de carga.
 */

import { seiEscuro } from "@comum/pagina/tema";

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

export function temaEscuro(doc: Document): boolean {
  try {
    return seiEscuro(doc, doc.defaultView?.localStorage ?? localStorage);
  } catch {
    return false;
  }
}
