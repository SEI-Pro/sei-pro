/**
 * O construtor de DOM do painel (`h`).
 *
 * Existe por um defeito real: `<textarea>` NÃO tem atributo `value` — o valor
 * inicial é o conteúdo do elemento. Como o `h` guardava tudo com
 * `setAttribute`, toda caixa de texto do Estúdio de Fluxo abria VAZIA, como se
 * o mapeamento tivesse sumido, inclusive a proposta que o usuário precisa
 * revisar antes de salvar.
 */

import { DOMParser } from "linkedom";
import { h } from "../src/painel/dom";
import { checar, secao } from "./util";

// `h` usa o `document` global; nos testes ele vem do linkedom.
const doc = new DOMParser().parseFromString("<html><body></body></html>", "text/html") as unknown as Document;
(globalThis as { document?: Document }).document = doc;

export function verificarDom(): void {
  secao("dom: h");
  checar("textarea mostra o valor guardado", h("textarea", { value: "Nota Técnica\nNT" }).value === "Nota Técnica\nNT", h("textarea", { value: "x" }).value);
  checar("textarea sem valor fica vazio", h("textarea", {}).value === "");
  checar("input continua funcionando", h("input", { type: "text", value: "abc" }).value === "abc");
  checar("classe vai para className", h("div", { class: "a b" }).className === "a b");
  checar("atributo booleano entra vazio", h("button", { disabled: true }).getAttribute("disabled") === "");
  checar("atributo false nao entra", h("button", { disabled: false }).hasAttribute("disabled") === false);
  checar("texto entra como no de texto", h("p", {}, "oi").textContent === "oi");
}
