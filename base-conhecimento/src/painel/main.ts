/**
 * Página da aba "Conhecimento" do painel lateral: preferência de numeração das
 * pastas (só apresentação — o content script lê a mesma chave no storage local).
 */

import type { Area } from "@comum/armazenamento/area";
import { areaChrome } from "@comum/armazenamento/area";
import { CHAVE_NUMERAR, lerNumeracao } from "../preferencias";

export interface PaginaMontada {
  destruir(): void;
}

/** Monta a página (testável com linkedom; a entrada chama com o #app do html). */
export function montarPagina(raiz: HTMLElement, area: Area): PaginaMontada {
  const doc = raiz.ownerDocument;
  raiz.replaceChildren();

  const titulo = doc.createElement("h1");
  titulo.textContent = "Base de Conhecimento";

  const opcao = doc.createElement("label");
  opcao.className = "opcao";
  const caixa = doc.createElement("input");
  caixa.type = "checkbox";
  caixa.id = "spro-bc-numerar";
  caixa.checked = false;
  const rotulo = doc.createElement("span");
  rotulo.textContent = "Numerar pastas";
  opcao.append(caixa, rotulo);

  const ajuda = doc.createElement("p");
  ajuda.className = "ajuda";
  ajuda.textContent = "Mostra a ordem antes dos nomes: 1. Pasta, 1.1 Sub-pasta, 1.1.1 Sub-sub-pasta.";

  const nota = doc.createElement("p");
  nota.className = "nota";
  nota.textContent =
    "Vale só neste navegador. Aparece na árvore, nos caminhos e na coluna Pasta; mover ou reordenar pastas renumera automaticamente.";

  let interagiu = false;
  const aoTrocar = (): void => {
    interagiu = true;
    void area.gravar({ [CHAVE_NUMERAR]: caixa.checked ? "sim" : "nao" });
  };
  caixa.addEventListener("change", aoTrocar);

  raiz.append(titulo, opcao, ajuda, nota);
  // O valor gravado vale ao abrir; se o usuário já clicou, o clique manda.
  void lerNumeracao(area).then((ligada) => {
    if (!interagiu) caixa.checked = ligada;
  });

  return {
    destruir(): void {
      caixa.removeEventListener("change", aoTrocar);
      raiz.replaceChildren();
    },
  };
}

// Entrada da página: o html da aba tem <main id="app">.
const alvo = typeof document === "undefined" ? null : document.getElementById("app");
if (alvo && typeof chrome !== "undefined") {
  montarPagina(alvo, areaChrome(chrome.storage.local, "local"));
}
