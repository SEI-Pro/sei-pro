/**
 * A dica do Gantt: um balão próprio (HTML, `role="tooltip"`), nunca o atributo `title` (o Estilo Avançado o converte e o
 * navegador o mostra com atraso). Fica dentro do contêiner do desenho, posicionado junto do alvo.
 */
import { h } from "@comum/ui/dom";
import type { Dica } from "./modelo";

export interface BalaoDeDica {
  el: HTMLElement;
  mostrar(d: Dica, alvo: Element): void;
  ocultar(): void;
}

/** `quadro` é o contêiner posicionado (position: relative) que envolve a rolagem; o balão é filho dele. */
export function criarDica(quadro: HTMLElement, id: string): BalaoDeDica {
  const el = h("div", { class: "spro-g-dica", role: "tooltip", id, hidden: true });
  quadro.append(el);
  return {
    el,
    mostrar(d, alvo) {
      el.replaceChildren(
        h("div", { class: "spro-g-dica-titulo" }, d.titulo, d.selo ? h("span", { class: "spro-g-dica-selo" }, d.selo) : null),
        ...d.linhas.map((l) =>
          h("div", { class: "spro-g-dica-linha" }, h("span", { class: "spro-g-dica-rotulo" }, l.rotulo), h("span", {}, l.valor)),
        ),
        ...(d.documentos?.length
          ? [
              h(
                "div",
                { class: "spro-g-dica-docs" },
                h("span", { class: "spro-g-dica-rotulo" }, "Documentos gerados"),
                ...d.documentos.map((t) => h("div", {}, t)),
              ),
            ]
          : []),
      );
      el.hidden = false;
      posicionar(el, quadro, alvo);
    },
    ocultar() {
      el.hidden = true;
    },
  };
}

function posicionar(el: HTMLElement, quadro: HTMLElement, alvo: Element): void {
  try {
    const q = quadro.getBoundingClientRect();
    const a = alvo.getBoundingClientRect();
    const largura = el.offsetWidth || 300;
    const altura = el.offsetHeight || 120;
    let x = a.left - q.left + a.width / 2 - largura / 2;
    x = Math.max(6, Math.min(x, q.width - largura - 6));
    // Em cima do alvo; se não couber, embaixo.
    let y = a.top - q.top - altura - 8;
    if (y < 4) y = a.bottom - q.top + 8;
    el.style.left = `${Math.round(x)}px`;
    el.style.top = `${Math.round(y)}px`;
  } catch {
    // sem geometria (testes): o balão fica onde o CSS o põe
  }
}
