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
import { criarFila, type EstadoFila, type Fila, type OpcoesFila, TETO_PADRAO } from "../pastas/fila";
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
const ESPERA_CONCLUIDA_MS = 4000;

const CHIPS: ReadonlyArray<{ chave: "naoAssinados" | "externos" | "cancelados"; rotulo: string; ajuda: string }> = [
  {
    chave: "naoAssinados",
    rotulo: "Não assinados",
    ajuda: "Mostrar só os documentos do editor da sua unidade que ainda não foram assinados",
  },
  { chave: "externos", rotulo: "Externos", ajuda: "Mostrar só os documentos externos (anexos)" },
  { chave: "cancelados", rotulo: "Cancelados", ajuda: "Mostrar só os documentos cancelados" },
];

/** Quantos documentos há à vista. Com pastas ainda carregando, "nenhum" é provisório e diz isso. */
export function textoDoStatus(r: ResumoDoFiltro, ativo: boolean, carregando = false): { principal: string } {
  if (!ativo) return { principal: "" };
  const palavra = r.total === 1 ? "documento" : "documentos";
  if (r.visiveis === 0) {
    return {
      principal: carregando ? `Nenhum documento até agora (${r.total} na árvore).` : `Nenhum documento encontrado (${r.total} na árvore).`,
    };
  }
  return { principal: `${r.visiveis} de ${r.total} ${palavra}` };
}

export type AcaoDaFila = "parar" | "continuar" | "tentar";

export interface LinhaDaFila {
  texto: string;
  acao: { id: AcaoDaFila; rotulo: string; aria: string } | null;
  /** 0 a 100, ou null (sem barra). */
  progresso: number | null;
  tom: "carregando" | "ok" | "aviso";
}

const plural = (n: number, um: string, varios: string): string => `${n} ${n === 1 ? um : varios}`;

/**
 * A linha de estado do carregamento das pastas: o que dizer, que botão oferecer e quanto da barra encher. Pura (testável).
 * `pastasFechadas` é o que a árvore ainda mostra sem conteúdo; `mostrarConcluida` liga o "Todas as pastas carregadas".
 */
export function linhaDaFila(
  e: EstadoFila,
  ativo: boolean,
  o: { pastasFechadas: number; teto: number; mostrarConcluida: boolean },
): LinhaDaFila | null {
  if (!ativo) return null;
  const progresso = e.total > 0 ? Math.min(100, Math.round((e.feitas / e.total) * 100)) : null;
  const falhou = e.falhas.length;
  const tentar = { id: "tentar" as const, rotulo: "Tentar de novo", aria: "Tentar de novo carregar as pastas que falharam" };
  const continuar = { id: "continuar" as const, rotulo: "Continuar", aria: "Continuar a carregar as pastas fechadas" };
  switch (e.fase) {
    case "carregando": {
      if (e.total === 0) return null; // só reabrindo pastas que já estavam carregadas: nada a mostrar
      const n = Math.min(e.feitas + 1, Math.max(e.total, 1));
      return {
        texto: `Carregando pastas ${n} de ${Math.max(e.total, 1)}${e.nomeAtual ? `: ${e.nomeAtual}` : ""}`,
        acao: { id: "parar", rotulo: "Parar", aria: "Parar de carregar as pastas" },
        progresso,
        tom: "carregando",
      };
    }
    case "pausada":
      return {
        texto: `Em pausa: a aba está oculta (${e.feitas} de ${e.total} pastas)`,
        acao: { id: "parar", rotulo: "Parar", aria: "Parar de carregar as pastas" },
        progresso,
        tom: "carregando",
      };
    case "parada":
      return {
        texto: `Parou: ${plural(e.restantes, "pasta ainda fechada", "pastas ainda fechadas")}.`,
        acao: continuar,
        progresso: null,
        tom: "aviso",
      };
    case "teto":
      return {
        texto: `Limite de ${o.teto} pastas por vez: ${plural(e.restantes, "pasta ainda fechada", "pastas ainda fechadas")}.`,
        acao: continuar,
        progresso: null,
        tom: "aviso",
      };
    case "interrompida":
      if (e.motivo === "sessao")
        return { texto: "A sessão do SEI expirou: entre de novo e atualize a página.", acao: null, progresso: null, tom: "aviso" };
      if (e.motivo === "ocupada")
        return { texto: "Outra carga de pastas está em andamento neste quadro.", acao: tentar, progresso: null, tom: "aviso" };
      return {
        texto: `${plural(falhou, "pasta não carregou", "pastas não carregaram")}; ${plural(e.restantes, "ainda fechada", "ainda fechadas")}.`,
        acao: tentar,
        progresso: null,
        tom: "aviso",
      };
    case "concluida":
      if (falhou > 0)
        return { texto: `${plural(falhou, "pasta não carregou", "pastas não carregaram")}.`, acao: tentar, progresso: null, tom: "aviso" };
      if (e.feitas > 0 && o.mostrarConcluida) return { texto: "Todas as pastas carregadas", acao: null, progresso: 100, tom: "ok" };
      return null;
    default:
      if (o.pastasFechadas > 0)
        return {
          texto: `${plural(o.pastasFechadas, "pasta ainda fechada", "pastas ainda fechadas")}.`,
          acao: continuar,
          progresso: null,
          tom: "aviso",
        };
      return null;
  }
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
  fila: { raiz: HTMLElement; texto: HTMLElement; acao: HTMLButtonElement; barra: HTMLElement; enchimento: HTMLElement };
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
  const filaTexto = h("span", { class: "spro-f-fila-texto" });
  const filaAcao = h("button", { type: "button", class: "spro-f-fila-acao", hidden: true });
  const enchimento = h("div", { class: "spro-f-prog-enchimento" });
  const barraProg = h(
    "div",
    {
      class: "spro-f-prog",
      role: "progressbar",
      "aria-label": "Progresso do carregamento das pastas",
      "aria-valuemin": "0",
      "aria-valuemax": "100",
      hidden: true,
    },
    enchimento,
  );
  const fila = h("div", { class: "spro-f-fila", hidden: true }, h("div", { class: "spro-f-fila-linha" }, filaTexto, filaAcao), barraProg);
  const raiz = h(
    "div",
    { class: "spro-f-barra", role: "search", "aria-label": "Filtro da árvore do processo", "data-spro-processo-filtro": "1" },
    h("div", { class: "spro-f-linha" }, h("span", { class: "spro-f-lupa", "aria-hidden": "true" }, icone("busca", 13)), busca, limpar),
    h("div", { class: "spro-f-chips", role: "group", "aria-label": "Mostrar só" }, ...chips.values()),
    h("div", { class: "spro-f-status", role: "status", "aria-live": "polite", hidden: true }, status, fila),
  );
  return { raiz, busca, limpar, chips, status, fila: { raiz: fila, texto: filaTexto, acao: filaAcao, barra: barraProg, enchimento } };
}

/**
 * Põe a barra acima da árvore e liga o filtro. Devolve null se o quadro não tem a árvore. Se algo tirar a barra da
 * página (a árvore se refaz), ela volta no mesmo lugar e com o mesmo estado.
 */
export interface DepsFiltro {
  Observador?: typeof MutationObserver;
  /** A fila de pastas (testes passam a deles). `null` desliga o carregamento automático das pastas. */
  fila?: Fila | null;
  opcoesFila?: OpcoesFila;
  /** Quanto o "Todas as pastas carregadas" fica na tela. */
  esperaConcluidaMs?: number;
}

export function ligarFiltro(ctx: ContextoFiltro, deps: DepsFiltro = {}): ControleFiltro | null {
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
  const fila: Fila | null = deps.fila === undefined ? criarFila(doc, deps.opcoesFila) : deps.fila;
  const teto = deps.opcoesFila?.teto ?? TETO_PADRAO;
  let concluidaVisivel = false;
  let esperaConcluida: ReturnType<typeof setTimeout> | undefined;

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

  const pintarFila = (linha: LinhaDaFila | null): void => {
    const f = ui.fila;
    f.raiz.hidden = !linha;
    if (!linha) {
      f.raiz.removeAttribute("data-tom");
      return;
    }
    f.raiz.setAttribute("data-tom", linha.tom);
    if (f.texto.textContent !== linha.texto) f.texto.textContent = linha.texto;
    f.acao.hidden = !linha.acao;
    if (linha.acao) {
      if (f.acao.textContent !== linha.acao.rotulo) f.acao.textContent = linha.acao.rotulo;
      f.acao.setAttribute("aria-label", linha.acao.aria);
      f.acao.setAttribute("data-acao", linha.acao.id);
    }
    f.barra.hidden = linha.progresso === null;
    if (linha.progresso !== null) {
      f.barra.setAttribute("aria-valuenow", String(linha.progresso));
      f.enchimento.style.width = `${linha.progresso}%`;
    }
  };

  const pintarEstado = (): void => {
    const ativo = filtroAtivo(estado);
    for (const c of CHIPS) ui.chips.get(c.chave)?.setAttribute("aria-pressed", estado[c.chave] ? "true" : "false");
    if (ui.busca.value !== estado.texto) ui.busca.value = estado.texto;
    ui.limpar.hidden = !ativo;
    const e = fila?.estado();
    const linha = e ? linhaDaFila(e, ativo, { pastasFechadas: ultimo.pastasFechadas, teto, mostrarConcluida: concluidaVisivel }) : null;
    const { principal } = textoDoStatus(ultimo, ativo, e?.fase === "carregando" || e?.fase === "pausada");
    if (ui.status.textContent !== principal) ui.status.textContent = principal;
    pintarFila(linha);
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

  /** Depois de o usuário mexer no filtro: com filtro, carrega as pastas fechadas (uma por vez); sem filtro, para e re-fecha. */
  const acompanharFila = (): void => {
    if (!fila || morto) return;
    if (filtroAtivo(estado)) fila.iniciar();
    else fila.encerrar(true);
  };

  const definir = (parcial: Partial<FiltroArvore>): void => {
    estado = { ...estado, ...parcial };
    aplicar();
    acompanharFila();
  };

  // Eventos: tudo por ouvinte (nada de on*= no HTML).
  ui.busca.addEventListener("input", () => {
    estado = { ...estado, texto: ui.busca.value };
    clearTimeout(esperaDigitacao);
    esperaDigitacao = setTimeout(() => {
      if (morto) return;
      aplicar();
      acompanharFila();
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
    fila?.encerrar(true);
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
    fila?.encerrar(true);
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
  fila?.aoMudar((e) => {
    if (morto) return;
    if (e.fase === "concluida" && e.falhas.length === 0 && e.feitas > 0 && !concluidaVisivel) {
      concluidaVisivel = true;
      clearTimeout(esperaConcluida);
      esperaConcluida = setTimeout(() => {
        concluidaVisivel = false;
        if (!morto) pintarEstado();
      }, deps.esperaConcluidaMs ?? ESPERA_CONCLUIDA_MS);
    } else if (e.fase !== "concluida") {
      concluidaVisivel = false;
    }
    pintarEstado();
    // Documentos que chegaram com a pasta: o observador da árvore já reaplica; a contagem acompanha na hora.
    if (e.fase === "carregando") aplicar();
  });
  ui.fila.acao.addEventListener("click", () => {
    const id = ui.fila.acao.getAttribute("data-acao");
    if (id === "parar") fila?.parar();
    else if (id === "continuar") fila?.continuar();
    else if (id === "tentar") fila?.tentarDeNovo();
  });

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
      fila?.encerrar(true);
      aplicar();
    },
    reaplicar: aplicar,
    barra: () => ui.raiz,
    destruir: () => {
      morto = true;
      clearTimeout(esperaDigitacao);
      clearTimeout(esperaArvore);
      clearTimeout(esperaConcluida);
      fila?.encerrar(true);
      fila?.destruir();
      obs?.disconnect();
      topoObservado.obs?.disconnect();
      lupa.remove();
      desligarTema();
      limparDoDom(doc);
      ui.raiz.remove();
    },
  };
}
