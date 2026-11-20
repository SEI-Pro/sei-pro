import { h } from "@comum/ui/dom";

/** Coluna de campos do dialogo: um abaixo do outro, com espaco entre eles. */
export function colunaDeFormulario(...filhos: Array<Node | null>): HTMLElement {
  return h("div", { style: "display:grid;gap:12px;min-width:360px;" }, ...filhos);
}

/** Rotulo em cima, campo embaixo, em largura total (o rotulo envolve o campo: clicar no texto foca o campo). */
export function linhaDeCampo(rotulo: string, campo: HTMLElement): HTMLElement {
  campo.classList.add("spro-campo");
  campo.style.width = "100%";
  return h("label", { style: "display:grid;gap:4px;font-size:13px;" }, h("span", {}, rotulo), campo);
}
