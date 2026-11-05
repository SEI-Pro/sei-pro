/**
 * O menu vertical agrupado (Copiar, Abrir, Ações) que abre junto do documento ou do número do processo.
 *
 * Camada flutuante em `position: fixed` (a de `@comum/ui/flutuante`), sem `title` (o Estilo Avançado converte `title`
 * do SEI): rótulos por `aria-label`. Teclado do padrão ARIA de menu: setas, Home, End, Enter, Esc e Tab, com o foco
 * de volta no gatilho ao fechar. Aberto pelo mouse, o menu não rouba o foco da página.
 */
import { h, icone } from "@comum/ui/dom";
import { abrirFlutuante } from "@comum/ui/flutuante";
import type { ItemMenu } from "./acoes";
import { GRUPOS, ROTULO_DO_GRUPO } from "./catalogo";

export interface MenuAberto {
  el: HTMLElement;
  fechar(): void;
}

export interface OpcoesAbrir {
  /** Nome acessível do menu. */
  rotulo: string;
  escuro: boolean;
  /** Foca o primeiro item (abertura pelo teclado). */
  focar: boolean;
  /** Itens fixos no pé do menu, depois de um separador ("Personalizar menu"). */
  rodape?: ItemMenu[];
  largura?: number;
  /** O menu se fechou (por qualquer motivo). */
  aoFechar(): void;
  /** Roda um item; devolve quando terminar (erros são do chamador). */
  aoEscolher(item: ItemMenu): void;
}

export function abrirMenu(ancora: HTMLElement, itens: ItemMenu[], o: OpcoesAbrir): MenuAberto {
  const doc = ancora.ownerDocument;
  const camada = h("div", {
    class: "spro-menu-pop spro-pm",
    role: "menu",
    "aria-label": o.rotulo,
    ...(o.escuro ? { "data-tema": "escuro" } : {}),
  });
  const botoes: HTMLButtonElement[] = [];
  let fechado = false;

  const criarBotao = (it: ItemMenu): HTMLButtonElement => {
    const b = h(
      "button",
      {
        type: "button",
        role: "menuitem",
        class: `spro-menu-item${it.perigo ? " spro-menu-perigo" : ""}${it.desativado ? " spro-pm-desativado" : ""}`,
        tabindex: "-1",
        "data-item": it.id,
        ...(it.desativado ? { "aria-disabled": "true" } : {}),
      },
      h("span", { class: "spro-menu-icone", "aria-hidden": "true" }, icone(it.icone, 15)),
      h("span", { class: "spro-menu-rotulo" }, it.rotulo),
      it.dica ? h("span", { class: "spro-menu-dica" }, it.dica) : null,
    );
    b.addEventListener("click", (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      if (it.desativado) return;
      fechar(true);
      o.aoEscolher(it);
    });
    botoes.push(b);
    return b;
  };

  for (const g of GRUPOS) {
    const doGrupo = itens.filter((i) => i.grupo === g);
    if (!doGrupo.length) continue;
    camada.append(
      h(
        "div",
        { class: "spro-pm-grupo", role: "group", "aria-label": ROTULO_DO_GRUPO[g] },
        h("div", { class: "spro-pm-titulo", "aria-hidden": "true" }, ROTULO_DO_GRUPO[g]),
        ...doGrupo.map(criarBotao),
      ),
    );
  }
  if (o.rodape?.length) {
    camada.append(h("div", { class: "spro-menu-sep", role: "separator" }), ...o.rodape.map(criarBotao));
  }

  const focar = (i: number) => {
    if (!botoes.length) return;
    const n = (i + botoes.length) % botoes.length;
    for (const [k, b] of botoes.entries()) b.setAttribute("tabindex", k === n ? "0" : "-1");
    botoes[n]?.focus?.({ preventScroll: true });
  };
  for (const b of botoes) b.addEventListener("pointermove", () => focar(botoes.indexOf(b)));

  const flut = abrirFlutuante(ancora, camada, {
    largura: o.largura ?? 236,
    alturaMaxima: 440,
    // Aberto pelo mouse: sem vão entre o ícone e o menu, senão o trajeto passa pelo documento de baixo.
    distancia: -8,
    aoFechar: () => fechar(false),
  });
  ancora.setAttribute("aria-haspopup", "menu");
  ancora.setAttribute("aria-expanded", "true");

  function fechar(devolverFoco: boolean): void {
    if (fechado) return;
    fechado = true;
    const focoDentro = camada.contains(doc.activeElement);
    flut.fechar();
    ancora.setAttribute("aria-expanded", "false");
    doc.removeEventListener("keydown", aoTeclar, true);
    if (devolverFoco || focoDentro) ancora.focus?.({ preventScroll: true });
    o.aoFechar();
  }

  function aoTeclar(ev: KeyboardEvent): void {
    if (ev.key === "Escape") {
      ev.preventDefault();
      ev.stopPropagation();
      fechar(true);
      return;
    }
    // Teclas do menu valem com o foco nele (aberto pelo teclado, ou o mouse passou pelos itens).
    if (!o.focar && !camada.contains(doc.activeElement)) return;
    const atual = botoes.findIndex((b) => b.getAttribute("tabindex") === "0");
    switch (ev.key) {
      case "ArrowDown":
        focar(atual + 1);
        break;
      case "ArrowUp":
        focar(atual - 1);
        break;
      case "Home":
        focar(0);
        break;
      case "End":
        focar(botoes.length - 1);
        break;
      case "Enter":
      case " ":
        botoes[atual]?.click();
        break;
      case "Tab":
        fechar(true);
        return;
      default:
        return;
    }
    ev.preventDefault();
    ev.stopPropagation();
  }
  doc.addEventListener("keydown", aoTeclar, true);
  if (o.focar) focar(0);

  return { el: camada, fechar: () => fechar(false) };
}
