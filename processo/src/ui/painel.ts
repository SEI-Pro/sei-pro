/**
 * A casca de um painel (opção A da spec, "lista refinada"): cabeçalho com ícone e título, ações à direita,
 * botão de recolher e um corpo que só este painel redesenha. A casca nasce uma vez; o que muda é o conteúdo.
 */
import { type Filho, h, icone, type NomeIcone } from "@comum/ui/dom";
import type { EstadoFatia } from "../modelo/tipos";

export interface AcaoPainel {
  icone: NomeIcone;
  rotulo: string;
  aoClicar(): void;
  perigo?: boolean;
  /** Destaca a ação (ex.: urgência ligada). */
  ativa?: boolean;
}

export interface Desenho {
  acoes?: AcaoPainel[];
  corpo: Filho[];
}

export interface Casca {
  el: HTMLElement;
  atualizar(estado: EstadoFatia | "pronto", d: Desenho): void;
  /** Aberto ou recolhido, sem avisar `aoAlternar`. */
  definirAberto(aberto: boolean): void;
}

export interface OpcoesCasca {
  tipo: string;
  titulo: string;
  icone: NomeIcone;
  aberto: boolean;
  aoAlternar(aberto: boolean): void;
}

export function botaoDeAcao(a: AcaoPainel): HTMLButtonElement {
  return h(
    "button",
    {
      type: "button",
      class: `spro-p-acao${a.perigo ? " perigo" : ""}${a.ativa ? " ativa" : ""}`,
      "aria-label": a.rotulo,
      "aria-pressed": a.ativa === undefined ? undefined : String(a.ativa),
      onclick: (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        a.aoClicar();
      },
    },
    icone(a.icone, 14),
  );
}

export function criarCasca(o: OpcoesCasca): Casca {
  const acoes = h("div", { class: "spro-p-acoes" });
  const corpo = h("div", { class: "spro-p-corpo", id: `spro-p-corpo-${o.tipo}`, role: "region", "aria-label": o.titulo });
  const chevron = icone("chevron", 14);
  const alternar = h(
    "button",
    { type: "button", class: "spro-p-alternar", "aria-controls": corpo.id, "aria-label": `Recolher ou expandir ${o.titulo}` },
    chevron,
  );
  const el = h(
    "section",
    { class: "spro-p-painel", "data-spro-painel": o.tipo, "data-estado": "carregando" },
    h(
      "header",
      {},
      h("span", { class: "spro-p-icone", "aria-hidden": "true" }, icone(o.icone, 15)),
      h("h3", {}, o.titulo),
      acoes,
      alternar,
    ),
    corpo,
  );
  const definirAberto = (aberto: boolean) => {
    el.toggleAttribute("data-recolhido", !aberto);
    alternar.setAttribute("aria-expanded", String(aberto));
    corpo.hidden = !aberto;
  };
  definirAberto(o.aberto);
  alternar.addEventListener("click", () => {
    const aberto = el.hasAttribute("data-recolhido");
    definirAberto(aberto);
    o.aoAlternar(aberto);
  });
  return {
    el,
    definirAberto,
    atualizar(estado, d) {
      el.setAttribute("data-estado", estado);
      acoes.replaceChildren(...(d.acoes ?? []).map(botaoDeAcao));
      corpo.replaceChildren(...(d.corpo.filter((f) => f !== null && f !== undefined && f !== false) as Array<Node | string>));
    },
  };
}
