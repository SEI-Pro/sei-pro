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
import { h, markdown } from "../src/painel/dom";
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

  /**
   * O renderizador roda a CADA fragmento do streaming, com texto que ainda
   * está pela metade. Uma linha começando com "|" sem a separadora da tabela
   * não era consumida por ramo nenhum: o índice ficava parado e o laço rodava
   * para sempre, congelando o painel inteiro (relato do Tavares/SOG-ANTAQ em
   * 25/09/2026, com uma skill que manda o agente responder em tabela).
   *
   * Cada caso aqui roda sob um cronômetro: travar é a falha que se procura,
   * então um teste que "demora" é um teste que falhou.
   */
  secao("dom: markdown nao trava com tabela pela metade");
  const emTempo = (nome: string, texto: string, conferir: (f: DocumentFragment) => boolean) => {
    const t = Date.now();
    const frag = markdown(texto);
    const ms = Date.now() - t;
    checar(`${nome} (${ms} ms)`, ms < 1000 && conferir(frag), ms >= 1000 ? "demorou demais: laco infinito" : "conteudo inesperado");
  };
  // `DocumentFragment.textContent` vem nulo no linkedom: lê-se pelo elemento.
  const texto = (f: DocumentFragment) => {
    const caixa = doc.createElement("div");
    caixa.append(f.cloneNode(true));
    return (caixa.textContent ?? "").replace(/\s+/g, " ").trim();
  };
  const html = (f: DocumentFragment) => {
    const caixa = doc.createElement("div");
    caixa.append(f.cloneNode(true));
    return caixa.innerHTML;
  };

  emTempo("linha solta com |", "| conclusao preliminar", (f) => texto(f).includes("conclusao preliminar"));
  emTempo("cabecalho de tabela sem a separadora", "| Item | Resultado |", (f) => texto(f).includes("Item"));
  emTempo(
    "tabela chegando pela metade, com texto antes e depois",
    "Segue o quadro:\n| Item | Resultado |\nE continuo escrevendo.",
    (f) => texto(f).includes("Segue o quadro") && texto(f).includes("E continuo escrevendo"),
  );
  emTempo("pipe no meio da frase nao vira tabela", "use o caractere | para separar", (f) => texto(f).includes("para separar"));

  secao("dom: markdown com tabela completa");
  const completa = markdown("| Item | Resultado |\n| --- | --- |\n| Prazo | 10 dias |");
  checar("tabela valida vira <table>", html(completa).startsWith("<table>"), html(completa).slice(0, 40));
  checar("com cabecalho e corpo", texto(completa).includes("Prazo") && texto(completa).includes("10 dias"));
  const depois = markdown("| A | B |\n| --- | --- |\n| 1 | 2 |\n\nTexto final.");
  checar("texto depois da tabela continua sendo processado", texto(depois).includes("Texto final") && html(depois).includes("<table>"));
}
