import type { Area } from "../armazenamento/area";
import { h } from "./dom";

/**
 * Altura limitada, com rolagem interna, para listas e grades de painel, e uma alca no fim (uma linha horizontal)
 * que o usuario arrasta para deixar a area mais estreita ou mais larga.
 *
 *  - Arrastar (mouse, toque, caneta: pointer events) ou usar o teclado muda a altura MAXIMA da area (`max-height`):
 *    com poucas linhas a area continua do tamanho do conteudo, como antes.
 *  - Duplo clique (ou Enter/Espaco, ou End) ajusta ao conteudo: modo "auto". A area passa a crescer com as linhas,
 *    sem rolagem interna, ATE o teto `TETO_AUTO_PX`. O teto existe porque, em lista virtualizada (a grade do
 *    Controle), "altura do conteudo" e total de linhas x altura da linha: milhares de linhas pediriam dezenas de
 *    milhares de px e o DOM teria todas elas. Acima do teto a rolagem interna volta (so a partir de ~150 linhas).
 *    Novo duplo clique (ou arrastar, ou setas) volta ao modo limitado, na ultima altura escolhida.
 *  - A escolha (altura e modo) e guardada por painel em `spro_altura:<chave>` na area informada (chrome.storage.local)
 *    e tambem numa memoria do modulo, porque os paineis redesenham o corpo inteiro a cada mudanca: a altura nao pode
 *    piscar de volta ao padrao enquanto a leitura assincrona nao termina. Falha de armazenamento e silenciosa.
 *
 * Nos paineis embutidos (iframe que cresce com o conteudo) `vh` nao serve: a janela do iframe e o proprio conteudo.
 * Eles passam `padraoPx`; a grade do Controle, que vive na pagina do SEI, usa `padraoVh`.
 *
 * Acessibilidade: a alca e um `role="separator"` horizontal, focavel (aria-valuemin/max/now/text); Cima/Baixo ajustam
 * 24 px (Shift: 96 px), Home vai ao minimo, End/Enter/Espaco ajustam ao conteudo. O CSS e alturaRedimensionavel.css.
 */

/** Teto, em px, da altura no modo "ajustar ao conteudo". */
export const TETO_AUTO_PX = 5000;
export const MINIMO_PADRAO_PX = 120;
const PADRAO_PX = 480;
export const PASSO_PX = 24;
export const PASSO_GRANDE_PX = 96;
const PREFIXO_CHAVE = "spro_altura:";

export interface EstadoAltura {
  /** Ajustada ao conteudo (sem rolagem interna ate o teto). */
  auto: boolean;
  /** Ultima altura maxima escolhida no modo limitado; null = o padrao do painel. */
  px: number | null;
}

export interface OpcoesAltura {
  /** A area que rola: recebe a altura maxima e a rolagem. Ja deve ter o conteudo. */
  rolagem: HTMLElement;
  /** Identifica o painel no armazenamento (ex.: "favoritos", "demandas-tabela"). */
  chave: string;
  /** Padrao em vh (so onde o viewport e real, como na pagina do SEI). */
  padraoVh?: number;
  /** Padrao em px (paineis em iframe que cresce com o conteudo). Sem nenhum dos dois: 480 px. */
  padraoPx?: number;
  minPx?: number;
  /** Maximo do arrasto; o padrao e o teto do modo auto. */
  maxPx?: number;
  /** Onde guardar a escolha; sem area, vale so enquanto a pagina estiver aberta. */
  area?: Area | null;
  /** Rotulo acessivel da alca. */
  rotulo?: string;
  /** Depois de cada mudanca (a lista virtualizada precisa redesenhar a janela de linhas). */
  aoMudar?: (e: EstadoAltura) => void;
}

export interface AlturaRedimensionavel {
  /** A linha horizontal: o chamador a coloca logo depois da area (ou use `comAlturaRedimensionavel`). */
  alca: HTMLElement;
  estado(): EstadoAltura;
  /** Modo auto: altura do conteudo ate o teto. Persiste. */
  ajustarAoConteudo(): void;
  /** Volta ao modo limitado, em `px` (ou na ultima altura escolhida / no padrao). Persiste. */
  limitar(px?: number): void;
  destruir(): void;
}

const SEM_AREA = {};
const memoria = new WeakMap<object, Map<string, EstadoAltura>>();
const memoriaDe = (area: Area | null | undefined) => {
  const k = area ?? SEM_AREA;
  const existente = memoria.get(k);
  if (existente) return existente;
  const novo = new Map<string, EstadoAltura>();
  memoria.set(k, novo);
  return novo;
};

/** Valor gravado a mao ou por outra versao nunca quebra: o que nao vale volta ao padrao. */
export function normalizarAltura(bruto: unknown, minPx = MINIMO_PADRAO_PX, maxPx = TETO_AUTO_PX): EstadoAltura {
  const b = (typeof bruto === "object" && bruto !== null ? bruto : {}) as Record<string, unknown>;
  const px = typeof b.px === "number" && Number.isFinite(b.px) ? Math.round(Math.min(maxPx, Math.max(minPx, b.px))) : null;
  return { auto: b.auto === true, px };
}

export function alturaRedimensionavel(o: OpcoesAltura): AlturaRedimensionavel {
  const { rolagem } = o;
  const doc = rolagem.ownerDocument;
  const minPx = o.minPx ?? MINIMO_PADRAO_PX;
  const maxPx = Math.max(minPx, o.maxPx ?? TETO_AUTO_PX);
  const area = o.area ?? null;
  const cache = memoriaDe(area);
  const chaveArmazem = `${PREFIXO_CHAVE}${o.chave}`;
  const valorPadrao = o.padraoVh !== undefined ? `${o.padraoVh}vh` : `${o.padraoPx ?? PADRAO_PX}px`;
  const limitar = (px: number) => Math.round(Math.min(maxPx, Math.max(minPx, px)));

  let e: EstadoAltura = cache.get(o.chave) ?? { auto: false, px: null };
  let tocou = cache.has(o.chave);
  let destruida = false;
  let quadro = 0;
  let arrasto: { y: number; base: number } | null = null;

  const id = `spro-altura-${o.chave.replace(/[^\w-]/g, "-")}`;
  rolagem.classList.add("spro-altura-rolagem");
  if (!rolagem.id) rolagem.id = id;
  const alca = h("div", {
    class: "spro-altura-alca",
    role: "separator",
    "aria-orientation": "horizontal",
    "aria-label": o.rotulo ?? "Redimensionar a altura da lista",
    "aria-controls": rolagem.id,
    "aria-valuemin": String(minPx),
    "aria-valuemax": String(maxPx),
    tabindex: "0",
  });

  const altura = (): number => {
    const r = rolagem.getBoundingClientRect?.().height || rolagem.offsetHeight || 0;
    return r > 0 ? r : (e.px ?? minPx);
  };

  function pintar(): void {
    rolagem.style.setProperty("--spro-altura-max", e.auto ? `${TETO_AUTO_PX}px` : e.px !== null ? `${e.px}px` : valorPadrao);
    const modo = e.auto ? "auto" : "limitada";
    rolagem.setAttribute("data-altura", modo);
    alca.setAttribute("data-altura", modo);
    const agora = Math.round(altura());
    alca.setAttribute("aria-valuenow", String(Math.min(maxPx, Math.max(minPx, agora))));
    alca.setAttribute("aria-valuetext", e.auto ? "Ajustada ao conteúdo" : `${agora} pixels`);
    alca.setAttribute(
      "title",
      e.auto ? "Duplo clique: voltar à altura limitada" : "Arraste para mudar a altura. Duplo clique: ajustar ao conteúdo",
    );
  }

  function persistir(): void {
    cache.set(o.chave, { ...e });
    if (!area) return;
    try {
      void area.gravar({ [chaveArmazem]: { auto: e.auto, px: e.px } }).catch(() => undefined);
    } catch {
      // sem armazenamento: vale so nesta pagina
    }
  }

  function avisar(agora: boolean): void {
    const dispara = () => {
      quadro = 0;
      if (!destruida) o.aoMudar?.({ ...e });
    };
    const win = doc.defaultView;
    if (agora || !win?.requestAnimationFrame) {
      if (quadro && win?.cancelAnimationFrame) win.cancelAnimationFrame(quadro);
      dispara();
      return;
    }
    if (!quadro) quadro = win.requestAnimationFrame(dispara);
  }

  function mudar(proximo: EstadoAltura, mover = false): void {
    tocou = true;
    e = proximo;
    pintar();
    avisar(!mover);
    if (!mover) persistir();
  }

  const irParaAuto = () => mudar({ auto: true, px: e.px });
  const voltarAoLimite = (px?: number) => mudar({ auto: false, px: px !== undefined ? limitar(px) : e.px });

  function aoApertar(ev: Event): void {
    const p = ev as PointerEvent;
    if (p.button !== undefined && p.button > 0) return;
    ev.preventDefault();
    arrasto = { y: p.clientY, base: altura() };
    alca.classList.add("spro-altura-arrastando");
    try {
      alca.setPointerCapture?.(p.pointerId);
    } catch {
      // ponteiro sintetico: segue sem captura
    }
  }
  function aoMover(ev: Event): void {
    if (!arrasto) return;
    const p = ev as PointerEvent;
    mudar({ auto: false, px: limitar(arrasto.base + (p.clientY - arrasto.y)) }, true);
  }
  function aoSoltar(ev: Event): void {
    if (!arrasto) return;
    const p = ev as PointerEvent;
    arrasto = null;
    alca.classList.remove("spro-altura-arrastando");
    try {
      alca.releasePointerCapture?.(p.pointerId);
    } catch {
      // idem
    }
    persistir();
    avisar(true);
  }
  function aoDuploClique(ev: Event): void {
    ev.preventDefault();
    if (e.auto) voltarAoLimite();
    else irParaAuto();
  }
  function aoTecla(ev: Event): void {
    const k = ev as KeyboardEvent;
    ev.stopPropagation();
    const passo = k.shiftKey ? PASSO_GRANDE_PX : PASSO_PX;
    switch (k.key) {
      case "ArrowUp":
        voltarAoLimite(altura() - passo);
        break;
      case "ArrowDown":
        voltarAoLimite(altura() + passo);
        break;
      case "Home":
        voltarAoLimite(minPx);
        break;
      case "End":
        irParaAuto();
        break;
      case "Enter":
      case " ":
        if (e.auto) voltarAoLimite();
        else irParaAuto();
        break;
      default:
        return;
    }
    ev.preventDefault();
  }

  alca.addEventListener("pointerdown", aoApertar);
  alca.addEventListener("pointermove", aoMover);
  alca.addEventListener("pointerup", aoSoltar);
  alca.addEventListener("pointercancel", aoSoltar);
  alca.addEventListener("dblclick", aoDuploClique);
  alca.addEventListener("keydown", aoTecla);
  alca.addEventListener("click", (ev) => ev.stopPropagation());

  pintar();

  // Primeira vez neste contexto: le o que ficou gravado. Se o usuario ja mexeu, a escolha dele vale.
  if (!tocou && area) {
    try {
      void area
        .obter(chaveArmazem)
        .then((r) => {
          if (tocou || destruida || !(chaveArmazem in r)) return;
          e = normalizarAltura(r[chaveArmazem], minPx, maxPx);
          cache.set(o.chave, { ...e });
          pintar();
          avisar(true);
        })
        .catch(() => undefined);
    } catch {
      // sem armazenamento
    }
  }

  return {
    alca,
    estado: () => ({ ...e }),
    ajustarAoConteudo: irParaAuto,
    limitar: (px) => voltarAoLimite(px),
    destruir() {
      destruida = true;
      arrasto = null;
    },
  };
}

/**
 * Atalho para quem tem so a area: devolve um envoltorio `div.spro-altura` com a area e a alca no fim, e o controle.
 * A area precisa estar fora de qualquer pai (ela e movida para dentro do envoltorio).
 */
export function comAlturaRedimensionavel(o: OpcoesAltura): { el: HTMLElement; controle: AlturaRedimensionavel } {
  const controle = alturaRedimensionavel(o);
  return { el: h("div", { class: "spro-altura" }, o.rolagem, controle.alca), controle };
}
