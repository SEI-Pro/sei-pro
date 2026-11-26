/**
 * Painel de pastas em Shadow DOM: árvore com subpastas e documentos, chevrons de
 * recolher/expandir, contagens, "Sem pasta" e órfãos riscados.
 *
 * A UI só lê o modelo e emite intenções (as `AcoesPainel`); quem fala com o SEI
 * e com o repositório é o montar. Nunca innerHTML com dado: títulos vão por
 * textContent (links de documento usam o href colhido da lista).
 */

import { icone } from "@comum/ui/dom";
import type { PastaExibida } from "../arvore/mesclar";
import type { Vinculo } from "../arvore/modelo";
import { nomeNumerado, numeroDaPasta } from "../arvore/numeracao";
import type { ItemBase } from "../nucleo/tipos";
import { lerArrasto, MIME_ARRASTO, type PayloadArrasto, serializarArrasto } from "./arrasto";

export interface EstadoPainel {
  pastas: PastaExibida[];
  semPasta: ItemBase[];
  orfaos: Vinculo[];
  /** Pasta selecionada; null = "Sem pasta", undefined/ausente = nenhuma (tabela inteira). */
  selecionada: string | null | undefined;
  busca: string;
  /** Faixa de aviso (ex.: "Indisponível nesta unidade"). */
  aviso?: string;
  /** Documentos vivos por pasta (id da pasta → itens). */
  itensPorPasta: Readonly<Record<string, ItemBase[]>>;
  /** Pastas recolhidas (chevron fechado). */
  recolhidas: ReadonlySet<string>;
  /** Mostra o número de ordem antes do nome (preferência por navegador). */
  numerar: boolean;
}

export interface AcoesPainel {
  aoSelecionar(id: string | null): void;
  aoAlternarPasta(id: string): void;
  aoNovaPasta(pai: string | null): void;
  aoRenomear(id: string): void;
  aoExcluir(id: string): void;
  aoMoverPasta(id: string): void;
  aoMoverItem(agrupador: string): void;
  aoRemoverItem(agrupador: string): void;
  aoBuscar(texto: string): void;
  /** Ligou/desligou a numeração de ordem (preferência por navegador). */
  aoNumerar(ligado: boolean): void;
  /** Soltou um documento ou uma pasta sobre um destino (pasta id, ou null = Sem pasta/raiz). */
  aoSoltar(payload: PayloadArrasto, destino: string | null): void;
}

export interface OpcoesPainel {
  doc?: Document;
  /** O CSS do painel (o main importa painel.css como texto; os testes passam o arquivo). */
  css?: string;
}

export function montarPainel(
  acoes: AcoesPainel,
  o: OpcoesPainel = {},
): { host: HTMLElement; render(estado: EstadoPainel): void; destruir(): void } {
  const doc = o.doc ?? document;
  const host = doc.createElement("div");
  host.className = "spro-bc-host";
  const raiz = host.attachShadow({ mode: "open" });

  if (o.css) {
    const estilo = doc.createElement("style");
    estilo.textContent = o.css;
    raiz.appendChild(estilo);
  }

  const painel = doc.createElement("div");
  painel.className = "painel";

  const topo = doc.createElement("div");
  topo.className = "topo";
  const titulo = doc.createElement("span");
  titulo.className = "titulo";
  titulo.textContent = "Pastas";
  const nova = doc.createElement("button");
  nova.type = "button";
  nova.className = "nova";
  nova.setAttribute("aria-label", "Nova pasta");
  nova.textContent = "＋ Nova pasta";
  nova.addEventListener("click", () => acoes.aoNovaPasta(atual.selecionada ?? null));
  const busca = doc.createElement("input");
  busca.type = "search";
  busca.className = "busca";
  busca.placeholder = "Buscar…";
  busca.setAttribute("aria-label", "Buscar na árvore");
  busca.addEventListener("input", () => acoes.aoBuscar(busca.value));
  topo.append(titulo, nova, busca);

  const numerar = doc.createElement("label");
  numerar.className = "numerar";
  const caixaNum = doc.createElement("input");
  caixaNum.type = "checkbox";
  caixaNum.checked = false;
  caixaNum.addEventListener("change", () => acoes.aoNumerar(caixaNum.checked));
  const rotuloNum = doc.createElement("span");
  rotuloNum.textContent = "Numerar pastas";
  numerar.append(caixaNum, rotuloNum);

  const arvore = doc.createElement("div");
  arvore.className = "arvore";

  const avisoEl = doc.createElement("div");
  avisoEl.className = "aviso";
  avisoEl.setAttribute("role", "status");
  avisoEl.hidden = true;

  const nota = doc.createElement("div");
  nota.className = "nota";
  nota.textContent = "Clique na seta para recolher/expandir. No menu ⋯ da pasta: renomear, nova subpasta, excluir.";

  painel.append(topo, numerar, avisoEl, arvore, nota);
  raiz.appendChild(painel);

  let atual: EstadoPainel = {
    pastas: [],
    semPasta: [],
    orfaos: [],
    selecionada: null,
    busca: "",
    itensPorPasta: {},
    recolhidas: new Set<string>(),
    numerar: false,
  };

  const el = (tag: string, classe?: string): HTMLElement => {
    const e = doc.createElement(tag);
    if (classe) e.className = classe;
    return e;
  };

  function tornarArrastavel(el: HTMLElement, payload: PayloadArrasto): void {
    el.setAttribute("draggable", "true");
    el.addEventListener("dragstart", (ev) => {
      const e = ev as DragEvent;
      e.stopPropagation();
      if (e.dataTransfer) {
        e.dataTransfer.setData(MIME_ARRASTO, serializarArrasto(payload));
        e.dataTransfer.effectAllowed = "move";
      }
    });
  }

  function tornarAlvo(el: HTMLElement, destino: string | null): void {
    el.addEventListener("dragover", (ev) => {
      ev.preventDefault();
      if (ev.dataTransfer) ev.dataTransfer.dropEffect = "move";
      el.classList.add("alvo");
    });
    el.addEventListener("dragenter", () => el.classList.add("alvo"));
    el.addEventListener("dragleave", () => el.classList.remove("alvo"));
    el.addEventListener("drop", (ev) => {
      ev.preventDefault();
      el.classList.remove("alvo");
      const payload = lerArrasto(ev.dataTransfer);
      if (payload) acoes.aoSoltar(payload, destino);
    });
  }

  const combina = (texto: string): boolean => {
    const b = atual.busca.trim().toLowerCase();
    return b === "" || texto.toLowerCase().includes(b);
  };
  const pastaCombina = (p: PastaExibida): boolean =>
    combina(p.nome) || (atual.itensPorPasta[p.id] ?? []).some((i) => combina(i.titulo)) || p.filhas.some(pastaCombina);

  function linhaItem(
    agrupador: string,
    titulo: string,
    href: string | null,
    rotuloAcao: string,
    agir: () => void,
    orfao: boolean,
  ): HTMLElement {
    const li = el("li");
    const div = el("div", orfao ? "item orfao" : "item");
    const ic = icone(orfao ? "alerta" : "nota", 16, doc);
    ic.setAttribute("aria-hidden", "true");
    let rotulo: HTMLElement;
    if (href && !orfao) {
      const a = doc.createElement("a") as HTMLAnchorElement;
      a.className = "rotulo";
      a.href = href;
      a.target = "_blank";
      a.rel = "noopener";
      a.textContent = titulo;
      rotulo = a;
    } else {
      rotulo = el("span", "rotulo");
      rotulo.textContent = titulo;
    }
    const acao = el("button", "acao-item");
    acao.setAttribute("type", "button");
    acao.textContent = rotuloAcao;
    acao.addEventListener("click", agir);
    acao.dataset.agrupador = agrupador;
    if (!orfao) tornarArrastavel(div, { tipo: "item", agrupador });
    div.append(ic, rotulo, acao);
    li.append(div);
    return li;
  }

  function linhaPasta(p: PastaExibida): HTMLElement {
    const li = el("li");
    const linha = el("div", "linha");
    const documentos = atual.itensPorPasta[p.id] ?? [];
    const temFilhos = p.filhas.length > 0 || documentos.length > 0;
    const recolhida = atual.recolhidas.has(p.id);

    if (temFilhos) {
      const chevron = el("button", "chevron");
      chevron.setAttribute("type", "button");
      chevron.setAttribute("aria-expanded", recolhida ? "false" : "true");
      chevron.setAttribute("aria-label", `${recolhida ? "Expandir" : "Recolher"} pasta ${p.nome}`);
      chevron.setAttribute("data-pasta-id", p.id);
      chevron.textContent = recolhida ? "▸" : "▾";
      chevron.addEventListener("click", () => acoes.aoAlternarPasta(p.id));
      linha.append(chevron);
    } else {
      const vazio = el("span", "chevron vazio");
      vazio.setAttribute("aria-hidden", "true");
      linha.append(vazio);
    }

    const botao = el("button", "pasta");
    botao.setAttribute("type", "button");
    botao.setAttribute("data-pasta-id", p.id);
    if (atual.selecionada === p.id) botao.setAttribute("aria-current", "true");
    const ic = icone("pasta", 18, doc);
    ic.setAttribute("aria-hidden", "true");
    const nome = el("span");
    nome.textContent = atual.numerar ? nomeNumerado(p.nome, numeroDaPasta(atual.pastas, p.id)) : p.nome;
    const cont = el("span", "contagem");
    cont.textContent = `(${p.contagem})`;
    cont.title = `${p.contagem} ${p.contagem === 1 ? "documento" : "documentos"}`;
    botao.append(ic, nome, cont);
    botao.addEventListener("click", () => acoes.aoSelecionar(p.id));
    tornarArrastavel(botao, { tipo: "pasta", id: p.id });
    tornarAlvo(linha, p.id);

    const menu = el("button", "menu");
    menu.setAttribute("type", "button");
    menu.setAttribute("aria-label", "Ações da pasta");
    menu.textContent = "⋯";
    const acoesDiv = el("div", "acoes oculto");
    const renomear = el("button");
    renomear.setAttribute("type", "button");
    renomear.textContent = "Renomear";
    renomear.addEventListener("click", () => acoes.aoRenomear(p.id));
    const sub = el("button");
    sub.setAttribute("type", "button");
    sub.textContent = "Nova subpasta";
    sub.addEventListener("click", () => acoes.aoNovaPasta(p.id));
    const mover = el("button");
    mover.setAttribute("type", "button");
    mover.textContent = "Mover para…";
    mover.addEventListener("click", () => acoes.aoMoverPasta(p.id));
    const excluir = el("button");
    excluir.setAttribute("type", "button");
    excluir.textContent = "Excluir";
    excluir.addEventListener("click", () => acoes.aoExcluir(p.id));
    acoesDiv.append(renomear, sub, mover, excluir);
    menu.addEventListener("click", () => acoesDiv.classList.toggle("oculto"));

    linha.append(botao, menu);
    li.append(linha, acoesDiv);

    if (temFilhos && !recolhida) {
      const ul = el("ul", "filhas");
      for (const f of p.filhas) ul.append(linhaPasta(f));
      li.append(ul);
      if (documentos.length) {
        const ulDocs = el("ul", "filhas itens");
        for (const i of documentos)
          if (combina(i.titulo))
            ulDocs.append(linhaItem(i.agrupador, i.titulo, i.visualizar, "Mover para…", () => acoes.aoMoverItem(i.agrupador), false));
        if (ulDocs.childNodes.length) li.append(ulDocs);
      }
    }
    return li;
  }

  function render(estado: EstadoPainel): void {
    atual = estado;
    caixaNum.checked = estado.numerar;
    arvore.replaceChildren();
    avisoEl.hidden = !estado.aviso;
    avisoEl.textContent = estado.aviso ?? "";

    const ul = el("ul");
    for (const p of estado.pastas) if (pastaCombina(p)) ul.append(linhaPasta(p));
    arvore.append(ul);

    const liSem = el("li");
    const linhaSem = el("div", "linha");
    const vazio = el("span", "chevron vazio");
    vazio.setAttribute("aria-hidden", "true");
    const botaoSem = el("button", "pasta sem-pasta");
    botaoSem.setAttribute("type", "button");
    if (estado.selecionada === null) botaoSem.setAttribute("aria-current", "true");
    const icSem = icone("nota", 18, doc);
    icSem.setAttribute("aria-hidden", "true");
    const nomeSem = el("span");
    nomeSem.textContent = "Sem pasta";
    const contSem = el("span", "contagem");
    contSem.textContent = `(${estado.semPasta.length})`;
    contSem.title = `${estado.semPasta.length} ${estado.semPasta.length === 1 ? "documento" : "documentos"}`;
    botaoSem.append(icSem, nomeSem, contSem);
    botaoSem.addEventListener("click", () => acoes.aoSelecionar(null));
    tornarAlvo(linhaSem, null);
    linhaSem.append(vazio, botaoSem);
    liSem.append(linhaSem);

    const ulItens = el("ul", "filhas");
    for (const i of estado.semPasta)
      if (combina(i.titulo))
        ulItens.append(linhaItem(i.agrupador, i.titulo, i.visualizar, "Mover para…", () => acoes.aoMoverItem(i.agrupador), false));
    for (const v of estado.orfaos)
      if (combina(v.titulo)) ulItens.append(linhaItem(v.id, v.titulo, null, "esquecer", () => acoes.aoRemoverItem(v.id), true));
    if (ulItens.childNodes.length) liSem.append(ulItens);
    arvore.append(liSem);
  }

  return {
    host,
    render,
    destruir: () => host.remove(),
  };
}
