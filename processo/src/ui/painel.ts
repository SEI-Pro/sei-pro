/**
 * A casca de um painel (opção A da spec, "lista refinada"): cabeçalho com ícone e título, ações à direita,
 * botão de recolher e um corpo que só este painel redesenha. A casca nasce uma vez; o que muda é o conteúdo.
 */
import { type Filho, h } from "@comum/ui/dom";
import type { EstadoFatia } from "../modelo/tipos";
import { glifo, type NomeGlifo } from "./glifos";

export interface AcaoPainel {
  icone: NomeGlifo;
  rotulo: string;
  aoClicar(): void;
  perigo?: boolean;
  /** Destaca a ação (ex.: urgência ligada). */
  ativa?: boolean;
}

export interface Desenho {
  /** Troca o ícone do cabeçalho (o nível de acesso muda o ícone, como no legado). */
  icone?: NomeGlifo;
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
  icone: NomeGlifo;
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
    glifo(a.icone, 16),
  );
}

/**
 * Põe `novos` como filhos de `pai` MEXENDO O MÍNIMO: um nó que já está na posição certa não é tocado. `replaceChildren` tira
 * e recoloca todos os filhos, e tirar da página um campo com o foco (o editor da anotação) o deixa sem foco e sem a seleção.
 */
export function sincronizarFilhos(pai: HTMLElement, novos: Array<Node | string>): void {
  const doc = pai.ownerDocument;
  const nos = novos.map((n) => (typeof n === "string" ? doc.createTextNode(n) : n));
  nos.forEach((no, i) => {
    const atual = pai.childNodes[i];
    if (atual === no) return;
    if (atual && atual.nodeType === 3 && no.nodeType === 3 && atual.textContent === no.textContent) return;
    pai.insertBefore(no, atual ?? null);
  });
  while (pai.childNodes.length > nos.length) pai.lastChild?.remove();
}

export function criarCasca(o: OpcoesCasca): Casca {
  const acoes = h("div", { class: "spro-p-acoes" });
  const corpo = h("div", { class: "spro-p-corpo", id: `spro-p-corpo-${o.tipo}`, role: "region", "aria-label": o.titulo });
  const chevron = glifo("chevron", 16);
  const alternar = h(
    "button",
    { type: "button", class: "spro-p-alternar", "aria-controls": corpo.id, "aria-label": `Recolher ou expandir ${o.titulo}` },
    chevron,
  );
  const marca = h("span", { class: "spro-p-icone", "aria-hidden": "true" }, glifo(o.icone, 16));
  const el = h(
    "section",
    { class: "spro-p-painel", "data-spro-painel": o.tipo, "data-estado": "carregando" },
    h("header", {}, h("div", { class: "spro-p-titulo" }, marca, h("h3", {}, o.titulo)), acoes, alternar),
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
  let iconeAtual = o.icone;
  return {
    el,
    definirAberto,
    atualizar(estado, d) {
      el.setAttribute("data-estado", estado);
      if (d.icone && d.icone !== iconeAtual) {
        iconeAtual = d.icone;
        marca.replaceChildren(glifo(d.icone, 16));
      }
      acoes.replaceChildren(...(d.acoes ?? []).map(botaoDeAcao));
      sincronizarFilhos(corpo, d.corpo.filter((f) => f !== null && f !== undefined && f !== false) as Array<Node | string>);
    },
  };
}
