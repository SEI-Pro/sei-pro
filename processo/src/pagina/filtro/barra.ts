/**
 * A barra do filtro da árvore: busca e três chips acima da lista, no quadro da árvore. Só esconde nós (ver `dom.ts`),
 * sem rede, sem tocar na árvore do SEI. O estado vive só na tela: recarregar a árvore volta ao filtro limpo.
 *
 * A barra nasce FECHADA. Uma lupa na fileira de ícones do topo da árvore (ao lado do alvo dos monitorados) abre e fecha;
 * fechar LIMPA o filtro (nenhum documento fica escondido sem a barra à vista). Nada disso persiste.
 */
import { h, icone } from "@comum/ui/dom";
import type { DocumentoArvore } from "@nucleo/dominio/arvore";
import { aoMudarTema, garantirEstilo, temaEscuro } from "../estilo";
import { aplicarNoDom, limparDoDom, type ResumoDoFiltro } from "./dom";
import { FILTRO_VAZIO, type FiltroArvore, filtroAtivo } from "./filtro";

/** O que o filtro precisa do contexto do processo (nos testes, falsos). */
export interface ContextoFiltro {
  doc: Document;
  idProcedimento: string;
  unidade: { sigla: string };
  documentos: { todos(): DocumentoArvore[] };
}

export interface ControleFiltro {
  estado(): FiltroArvore;
  /** A barra está à mostra? (nasce fechada). */
  aberta(): boolean;
  /** Mostra a barra e põe o foco na busca. */
  abrir(): void;
  /** Limpa o filtro e esconde a barra (`comFoco`: devolve o foco à lupa). */
  fechar(comFoco?: boolean): void;
  /** O botão de lupa da fileira de ícones do topo da árvore (null se não há onde pô-lo). */
  lupa(): HTMLButtonElement;
  definir(parcial: Partial<FiltroArvore>): void;
  limpar(): void;
  /** Reaplica agora (depois de a árvore mudar). */
  reaplicar(): ResumoDoFiltro;
  barra(): HTMLElement;
  destruir(): void;
}

const ESPERA_DIGITACAO_MS = 90;
const ESPERA_ARVORE_MS = 120;

const CHIPS: ReadonlyArray<{ chave: "naoAssinados" | "externos" | "cancelados"; rotulo: string; ajuda: string }> = [
  {
    chave: "naoAssinados",
    rotulo: "Não assinados",
    ajuda: "Mostrar só os documentos do editor da sua unidade que ainda não foram assinados",
  },
  { chave: "externos", rotulo: "Externos", ajuda: "Mostrar só os documentos externos (anexos)" },
  { chave: "cancelados", rotulo: "Cancelados", ajuda: "Mostrar só os documentos cancelados" },
];

export function textoDoStatus(r: ResumoDoFiltro, ativo: boolean): { principal: string; dica: string } {
  if (!ativo) return { principal: "", dica: "" };
  const palavra = r.total === 1 ? "documento" : "documentos";
  const principal = r.visiveis === 0 ? `Nenhum documento encontrado (${r.total} na árvore).` : `${r.visiveis} de ${r.total} ${palavra}`;
  const dica = r.pastasFechadas > 0 ? "Pastas fechadas não entram: abra-as para filtrar os documentos delas." : "";
  return { principal, dica };
}

const ROTULO_LUPA = "Filtrar documentos";

/** Lupa PREENCHIDA (os ícones do topo da árvore são glifos cheios, não de traço como o resto do módulo). */
function glifoLupa(doc: Document): SVGSVGElement {
  const NS = "http://www.w3.org/2000/svg";
  const svg = doc.createElementNS(NS, "svg");
  for (const [k, v] of Object.entries({
    viewBox: "0 0 24 24",
    width: "18",
    height: "18",
    fill: "currentColor",
    "aria-hidden": "true",
    focusable: "false",
  }))
    svg.setAttribute(k, v);
  const path = doc.createElementNS(NS, "path");
  path.setAttribute("fill-rule", "evenodd");
  path.setAttribute(
    "d",
    "M10.5 3a7.5 7.5 0 0 1 5.96 12.05l4.74 4.74-1.41 1.41-4.74-4.74A7.5 7.5 0 1 1 10.5 3zm0 2.2a5.3 5.3 0 1 0 0 10.6 5.3 5.3 0 0 0 0-10.6z",
  );
  svg.append(path);
  return svg;
}

function criarLupa(doc: Document): HTMLButtonElement {
  const b = doc.createElement("button");
  b.type = "button";
  b.className = "spro-f-lupa-btn";
  b.setAttribute("aria-label", ROTULO_LUPA);
  b.setAttribute("aria-pressed", "false");
  b.append(glifoLupa(doc));
  return b;
}

const ICONES_PROPRIOS = ".spro-fav-estrela, .spro-fav-abrir, .spro-prj-ic, .iconFavoritePro";

/**
 * Onde a lupa fica na fileira do topo da árvore (`#topmenu`): logo depois do alvo dos monitorados (a estrela dos
 * Favoritos novos ou o ícone do legado); sem ele (opção desligada), depois do último ícone do SEI Pro da fileira; sem
 * nenhum, ao lado do número do processo.
 */
export function destinoDaLupa(topo: Element, lupa: Element): Element | null {
  const filhos = [...topo.children].filter((c) => c !== lupa);
  const monitorados = filhos.find((c) => c.matches(".spro-fav-estrela, .iconFavoritePro"));
  if (monitorados) return monitorados;
  const proprios = filhos.filter((c) => c.matches(ICONES_PROPRIOS));
  if (proprios.length) return proprios[proprios.length - 1] ?? null;
  return filhos.find((c) => c.matches('a.infraArvoreNo, a[target="ifrVisualizacao"], a[target="ifrConteudoVisualizacao"]')) ?? null;
}

function criarBarra(): {
  raiz: HTMLElement;
  busca: HTMLInputElement;
  limpar: HTMLButtonElement;
  chips: Map<string, HTMLButtonElement>;
  status: HTMLElement;
  dica: HTMLElement;
} {
  const busca = h("input", {
    type: "search",
    class: "spro-f-busca",
    placeholder: "Filtrar documentos",
    "aria-label": "Filtrar documentos da árvore por nome ou número SEI",
    autocomplete: "off",
    spellcheck: "false",
  });
  const limpar = h("button", { type: "button", class: "spro-f-limpar", "aria-label": "Limpar filtro", hidden: true }, icone("fechar", 12));
  const chips = new Map<string, HTMLButtonElement>();
  for (const c of CHIPS) {
    chips.set(
      c.chave,
      h(
        "button",
        { type: "button", class: "spro-f-chip", "data-chip": c.chave, "aria-pressed": "false", "aria-label": `${c.rotulo}. ${c.ajuda}` },
        c.rotulo,
      ),
    );
  }
  const status = h("span", { class: "spro-f-status-texto" });
  const dica = h("span", { class: "spro-f-dica" });
  const raiz = h(
    "div",
    { class: "spro-f-barra", role: "search", "aria-label": "Filtro da árvore do processo", "data-spro-processo-filtro": "1" },
    h("div", { class: "spro-f-linha" }, h("span", { class: "spro-f-lupa", "aria-hidden": "true" }, icone("busca", 13)), busca, limpar),
    h("div", { class: "spro-f-chips", role: "group", "aria-label": "Mostrar só" }, ...chips.values()),
    h("div", { class: "spro-f-status", role: "status", "aria-live": "polite", hidden: true }, status, dica),
  );
  return { raiz, busca, limpar, chips, status, dica };
}

/**
 * Põe a barra acima da árvore e liga o filtro. Devolve null se o quadro não tem a árvore. Se algo tirar a barra da
 * página (a árvore se refaz), ela volta no mesmo lugar e com o mesmo estado.
 */
export function ligarFiltro(ctx: ContextoFiltro, deps: { Observador?: typeof MutationObserver } = {}): ControleFiltro | null {
  const doc = ctx.doc;
  const arvore = doc.getElementById("divArvore");
  if (!arvore?.parentElement) return null;
  garantirEstilo(doc);
  const ui = criarBarra();
  const lupa = criarLupa(doc);
  // Sobra de uma instância anterior (a extensão reinjetada no mesmo quadro): só uma lupa por documento.
  for (const velha of doc.querySelectorAll(".spro-f-lupa-btn")) velha.remove();
  let aberta = false;
  let estado: FiltroArvore = { ...FILTRO_VAZIO };
  let ultimo: ResumoDoFiltro = { visiveis: 0, total: 0, pastasFechadas: 0, pastas: 0 };
  let esperaDigitacao: ReturnType<typeof setTimeout> | undefined;
  let esperaArvore: ReturnType<typeof setTimeout> | undefined;
  let morto = false;

  const colocar = (): void => {
    const alvo = doc.getElementById("divArvore");
    if (!alvo?.parentElement) return;
    if (ui.raiz.parentElement !== alvo.parentElement || ui.raiz.nextElementSibling !== alvo) alvo.parentElement.insertBefore(ui.raiz, alvo);
  };

  const topoObservado: { el: Element | null; obs: MutationObserver | null } = { el: null, obs: null };
  /** Põe a lupa (ou a devolve) ao lado do alvo dos monitorados; idempotente. Devolve se ela está na página. */
  const colocarLupa = (): boolean => {
    const topo = doc.getElementById("topmenu");
    if (!topo) return lupa.isConnected;
    if (topoObservado.el !== topo && typeof Observador === "function") {
      topoObservado.obs?.disconnect();
      topoObservado.el = topo;
      // O legado e os outros módulos refazem ícones da fileira (o iframe recarrega, o laço de 1,5 s): a lupa volta ao lugar.
      topoObservado.obs = new Observador(() => {
        if (!morto) {
          colocarLupa();
          pintarEstado();
        }
      });
      topoObservado.obs.observe(topo, { childList: true });
    }
    const alvo = destinoDaLupa(topo, lupa);
    if (!alvo) return lupa.isConnected;
    // Sempre colada ao alvo (o botão "abrir painel" dos Favoritos, que entra depois logo após a estrela, fica depois dela):
    // a fileira não quebra linha e a lupa tem de caber no quadro estreito da árvore.
    const bem = lupa.parentElement === topo && lupa.previousElementSibling === alvo;
    if (!bem) alvo.after(lupa);
    return true;
  };

  const pintarTema = (): void => {
    for (const el of [ui.raiz, lupa]) {
      if (temaEscuro(doc)) el.setAttribute("data-tema", "escuro");
      else el.removeAttribute("data-tema");
    }
  };

  const pintarEstado = (): void => {
    const ativo = filtroAtivo(estado);
    for (const c of CHIPS) ui.chips.get(c.chave)?.setAttribute("aria-pressed", estado[c.chave] ? "true" : "false");
    if (ui.busca.value !== estado.texto) ui.busca.value = estado.texto;
    ui.limpar.hidden = !ativo;
    const { principal, dica } = textoDoStatus(ultimo, ativo);
    if (ui.status.textContent !== principal || ui.dica.textContent !== dica) {
      ui.status.textContent = principal;
      ui.dica.textContent = dica;
    }
    (ui.status.parentElement as HTMLElement).hidden = !ativo;
    ui.raiz.toggleAttribute("data-ativo", ativo);
    // Sem nada para filtrar (processo sem documentos nem pastas) a barra só atrapalharia.
    const nada = ultimo.total === 0 && ultimo.pastas === 0 && !ativo;
    // Sem a lupa na página (quadro sem a fileira de ícones) não haveria como abrir a barra: ela fica sempre à mostra.
    ui.raiz.hidden = nada || (!aberta && lupa.isConnected);
    lupa.hidden = nada;
    lupa.setAttribute("aria-pressed", aberta ? "true" : "false");
    // Filtro valendo com a barra fechada não deve acontecer (fechar limpa); se acontecer, a lupa avisa.
    const escondido = ativo && !aberta;
    lupa.toggleAttribute("data-ativo", escondido);
    lupa.setAttribute("aria-label", escondido ? `${ROTULO_LUPA} (filtro ativo)` : ROTULO_LUPA);
  };

  const aplicar = (): ResumoDoFiltro => {
    ultimo = aplicarNoDom(doc, ctx.documentos.todos(), ctx.idProcedimento, estado, { unidade: ctx.unidade.sigla });
    pintarEstado();
    return ultimo;
  };

  // A árvore mudou por baixo: reaplica logo (no fim da mesma tarefa, antes de pintar, para um nó novo numa linha
  // escondida não piscar) e uma vez mais pouco depois, quando o que chegou de pastas já foi lido.
  let ultimaAplicacao = 0;
  const aoMudarArvore = (): void => {
    if (morto) return;
    colocar();
    colocarLupa();
    const agora = Date.now();
    if (agora - ultimaAplicacao >= ESPERA_ARVORE_MS) {
      ultimaAplicacao = agora;
      aplicar();
    }
    clearTimeout(esperaArvore);
    esperaArvore = setTimeout(() => {
      if (morto) return;
      ultimaAplicacao = Date.now();
      colocar();
      colocarLupa();
      aplicar();
    }, ESPERA_ARVORE_MS);
  };

  const definir = (parcial: Partial<FiltroArvore>): void => {
    estado = { ...estado, ...parcial };
    aplicar();
  };

  // Eventos: tudo por ouvinte (nada de on*= no HTML).
  ui.busca.addEventListener("input", () => {
    estado = { ...estado, texto: ui.busca.value };
    clearTimeout(esperaDigitacao);
    esperaDigitacao = setTimeout(() => {
      if (!morto) aplicar();
    }, ESPERA_DIGITACAO_MS);
  });
  // Esc: com algo filtrado, limpa e mantém o foco na busca; sem nada filtrado, fecha a barra (e devolve o foco à lupa).
  ui.raiz.addEventListener("keydown", (ev) => {
    if ((ev as KeyboardEvent).key !== "Escape") return;
    ev.preventDefault();
    ev.stopPropagation();
    if (filtroAtivo(estado) && ev.target === ui.busca) limpar();
    else fechar(true);
  });
  lupa.addEventListener("click", () => {
    if (aberta) fechar();
    else abrir();
  });
  for (const [chave, botao] of ui.chips) {
    botao.addEventListener("click", () => definir({ [chave]: !estado[chave as "naoAssinados" | "externos" | "cancelados"] }));
  }
  const limpar = (): void => {
    clearTimeout(esperaDigitacao);
    estado = { ...FILTRO_VAZIO };
    aplicar();
    ui.busca.focus();
  };
  ui.limpar.addEventListener("click", limpar);

  const abrir = (): void => {
    if (aberta) {
      ui.busca.focus();
      return;
    }
    aberta = true;
    pintarEstado();
    ui.busca.focus();
  };
  const fechar = (comFoco = false): void => {
    if (!aberta) return;
    clearTimeout(esperaDigitacao);
    const focoDentro = comFoco || ui.raiz.contains(doc.activeElement);
    // Fechar LIMPA: nenhum documento fica escondido sem a barra à vista.
    estado = { ...FILTRO_VAZIO };
    aberta = false;
    aplicar();
    if (focoDentro) lupa.focus();
  };

  // A árvore muda por baixo (pasta aberta, numeração, duas linhas): reaplica sem pressa. Só childList: o filtro mexe
  // em atributos e não pode se disparar. O que muda dentro da própria barra também não conta.
  const Observador =
    deps.Observador ??
    (doc.defaultView as unknown as { MutationObserver?: typeof MutationObserver } | null)?.MutationObserver ??
    globalThis.MutationObserver;
  const alvoObservado = doc.getElementById("frmArvore") ?? arvore.parentElement;
  const obs =
    typeof Observador === "function"
      ? new Observador((muts) => {
          // Nossa própria colocação ou o que muda dentro da barra não conta; a barra tirada da página (desconectada) conta.
          const soDaBarra =
            ui.raiz.isConnected &&
            muts.every(
              (m) =>
                ui.raiz.contains(m.target) ||
                (m.addedNodes.length + m.removedNodes.length > 0 && [...m.addedNodes, ...m.removedNodes].every((n) => n === ui.raiz)),
            );
          if (!soDaBarra) aoMudarArvore();
        })
      : null;
  obs?.observe(alvoObservado, { childList: true, subtree: true });
  const desligarTema = aoMudarTema(doc, pintarTema);

  colocar();
  colocarLupa();
  pintarTema();
  aplicar();

  return {
    estado: () => ({ ...estado }),
    aberta: () => aberta,
    abrir,
    fechar,
    lupa: () => lupa,
    definir,
    limpar: () => {
      clearTimeout(esperaDigitacao);
      estado = { ...FILTRO_VAZIO };
      aplicar();
    },
    reaplicar: aplicar,
    barra: () => ui.raiz,
    destruir: () => {
      morto = true;
      clearTimeout(esperaDigitacao);
      clearTimeout(esperaArvore);
      obs?.disconnect();
      topoObservado.obs?.disconnect();
      lupa.remove();
      desligarTema();
      limparDoDom(doc);
      ui.raiz.remove();
    },
  };
}
