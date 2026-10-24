/**
 * A barra do filtro da árvore: busca e três chips acima da lista, no quadro da árvore. Só esconde nós (ver `dom.ts`),
 * sem rede, sem tocar na árvore do SEI. O estado vive só na tela: recarregar a árvore volta ao filtro limpo.
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

  const pintarTema = (): void => {
    if (temaEscuro(doc)) ui.raiz.setAttribute("data-tema", "escuro");
    else ui.raiz.removeAttribute("data-tema");
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
    ui.raiz.hidden = ultimo.total === 0 && ultimo.pastas === 0 && !ativo;
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
  ui.busca.addEventListener("keydown", (ev) => {
    if ((ev as KeyboardEvent).key === "Escape" && filtroAtivo(estado)) {
      ev.preventDefault();
      ev.stopPropagation();
      limpar();
    }
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
  pintarTema();
  aplicar();

  return {
    estado: () => ({ ...estado }),
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
      desligarTema();
      limparDoDom(doc);
      ui.raiz.remove();
    },
  };
}
