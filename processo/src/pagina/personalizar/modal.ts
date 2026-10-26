/**
 * A tela "Personalizar menu rápido" (no lugar do modal jQuery UI do legado, `configFlashMenuPro`): quatro abas (Processo,
 * Documentos, Árvore, Painel), cada uma com a chave geral da função e a lista de itens com ícone, nome e interruptor.
 *
 * Abre na janela de topo (o quadro da árvore é estreito), no `dialog.spro-dialogo` do módulo, sem botão Cancelar nem Ok: o X
 * e o Esc fecham, e TUDO é salvo ao mudar (mesmas chaves e formatos do legado: `modelo.ts`) e aplicado ao vivo
 * (`mudancas.ts`: o menu, os ícones fixos e os painéis reagem sem recarregar).
 *
 * Teclado: Tab percorre; nas abas, setas/Home/End; nos interruptores (botões nativos `role=switch`), Espaço e Enter; Alt+seta
 * para cima/baixo move o item de lugar (as mesmas ações dos botões de subir/descer, que também são o jeito de quem usa teclado).
 */
import { corDoTemaSei } from "@comum/pagina/tema";
import { h, icone } from "@comum/ui/dom";
import { glifoMenu } from "../../ui/glifosMenu";
import { aoMudarTema, temaEscuro } from "../estilo";
import { NOME_MENU_AO_CLICAR } from "../menuDoc/catalogo";
import { abrirDialogo, confirmar, type Dialogo } from "../modais/comum";
import { ABAS, type DefAba, type IdAba, ITEM_MENU_AO_CLICAR, type ItemPersonalizar } from "./catalogo";
import {
  type Arm,
  casaComBusca,
  contar,
  type EstadoAba,
  gravarGeral,
  gravarLista,
  lerAba,
  mover,
  moverPara,
  podeMover,
  restaurarPadrao,
  semNenhum,
} from "./modelo";
import { avisarPersonalizacao } from "./mudancas";

export interface DepsPersonalizar {
  /** A janela de topo, onde o modal abre. */
  topo: Document;
  /** O quadro da árvore (tema e cor do SEI). */
  doc: Document;
  armazenamento: Arm;
  /** Aba que abre primeiro (o menu do documento abre em Documentos; o do processo, em Processo). */
  aba?: IdAba;
  /** Aviso por aba quando a função está desligada nas Opções do SEI Pro (as escolhas só valem depois de ligar). */
  avisos?: Partial<Record<IdAba, string>>;
  /** Para os testes: a confirmação de "Restaurar padrão". */
  confirmar?: (texto: string, rotulo: string) => Promise<boolean>;
  /** Avisa que uma aba mudou (padrão: o barramento de `mudancas.ts`). */
  aoMudar?: (aba: IdAba) => void;
}

export interface PersonalizarAberto {
  dialogo: Dialogo;
  /** Troca de aba por código (testes e quem abre já numa aba). */
  selecionar(id: IdAba): void;
  fechar(): void;
}

interface PartesAba {
  def: DefAba;
  estado: EstadoAba;
  botaoAba: HTMLButtonElement;
  contaDaAba: HTMLElement;
  painel: HTMLElement;
  geral: HTMLButtonElement;
  contador: HTMLElement;
  semNada: HTMLElement;
  vazioBusca: HTMLElement;
  lista: HTMLUListElement;
}

const abertos = new WeakMap<Document, PersonalizarAberto>();

const rotuloDeAtivos = (n: number, total: number): string => `${n} de ${total} ativos`;

function interruptor(rotulo: string, ligado: boolean, descricaoId?: string): HTMLButtonElement {
  return h(
    "button",
    {
      type: "button",
      role: "switch",
      class: "spro-pp-switch",
      "aria-checked": String(ligado),
      "aria-label": rotulo,
      ...(descricaoId ? { "aria-describedby": descricaoId } : {}),
    },
    h("span", { class: "spro-pp-knob", "aria-hidden": "true" }),
  );
}

const marcar = (b: HTMLElement, ligado: boolean): void => {
  b.setAttribute("aria-checked", String(ligado));
};

export function abrirPersonalizar(d: DepsPersonalizar): PersonalizarAberto {
  const anterior = abertos.get(d.topo);
  if (anterior?.dialogo.el.isConnected) {
    if (d.aba) anterior.selecionar(d.aba);
    return anterior;
  }

  const arm = d.armazenamento;
  const avisar = d.aoMudar ?? ((a: IdAba) => avisarPersonalizacao(a));
  const pedirConfirmacao = d.confirmar ?? ((texto: string, rotulo: string) => confirmar({ topo: d.topo, doc: d.doc }, texto, rotulo));
  let busca = "";
  let atual: IdAba = d.aba ?? "processo";
  let timerSalvo: ReturnType<typeof setTimeout> | undefined;
  let nomeParaFoco: { nome: string; controle: "subir" | "descer" | "switch" } | null = null;
  let arrastando: string | null = null;
  const partes = new Map<IdAba, PartesAba>();

  // ---- cabeçalho: busca, restaurar, estado do salvamento -------------------------------------------------------------
  const campoBusca = h("input", {
    type: "search",
    class: "spro-campo spro-pp-busca",
    placeholder: "Buscar item pelo nome",
    "aria-label": "Buscar item pelo nome",
    autocomplete: "off",
    spellcheck: "false",
  });
  const botaoRestaurar = h("button", { type: "button", class: "spro-botao pequeno" }, "Restaurar padrão");
  const situacao = h("span", { class: "spro-pp-situacao", role: "status", "aria-live": "polite" }, "As mudanças são salvas na hora.");
  const barraAbas = h("div", { class: "spro-pp-abas", role: "tablist", "aria-label": "Partes do menu rápido" });
  const palco = h("div", { class: "spro-pp-palco" });

  const dica = (texto: string): void => {
    situacao.textContent = texto;
  };
  const salvouAgora = (): void => {
    dica("Salvo.");
    situacao.setAttribute("data-salvo", "");
    clearTimeout(timerSalvo);
    timerSalvo = setTimeout(() => {
      situacao.removeAttribute("data-salvo");
      dica("As mudanças são salvas na hora.");
    }, 2200);
  };

  const dialogo = abrirDialogo(
    { topo: d.topo, doc: d.doc },
    {
      titulo: "Personalizar menu rápido",
      icone: "ajustes",
      largura: 660,
      conteudo: [
        h("div", { class: "spro-pp-topo" }, campoBusca, botaoRestaurar),
        barraAbas,
        palco,
        h("div", { class: "spro-pp-rodape" }, situacao),
      ],
      aoFechar: () => {
        clearTimeout(timerSalvo);
        sairTema();
        if (abertos.get(d.topo)?.dialogo === dialogo) abertos.delete(d.topo);
      },
    },
  );
  dialogo.el.classList.add("spro-pp");

  // ---- tema e cor de destaque do SEI (como a capa) -------------------------------------------------------------------
  const aplicarTema = (): void => {
    if (temaEscuro(d.doc)) dialogo.el.setAttribute("data-tema", "escuro");
    else dialogo.el.removeAttribute("data-tema");
    const cor = corDoTemaSei(d.doc) ?? corDoTemaSei(d.topo);
    if (cor) {
      dialogo.el.style.setProperty("--spro-cor-sei", cor);
      dialogo.el.setAttribute("data-cor-sei", "");
    } else {
      dialogo.el.style.removeProperty("--spro-cor-sei");
      dialogo.el.removeAttribute("data-cor-sei");
    }
  };
  aplicarTema();
  const sairTema = aoMudarTema(d.doc, aplicarTema);

  // ---- gravação -------------------------------------------------------------------------------------------------------
  /** Roda uma gravação; se o navegador recusar (cota, janela privada), o erro aparece no modal e a tela volta ao que está salvo. */
  const gravar = (p: PartesAba, fn: () => void): boolean => {
    try {
      fn();
      dialogo.erro("");
      avisar(p.def.id);
      salvouAgora();
      return true;
    } catch {
      dialogo.erro("Não foi possível salvar a personalização neste navegador (armazenamento cheio ou bloqueado).");
      p.estado = lerAba(arm, p.def);
      desenharAba(p);
      return false;
    }
  };

  // ---- uma aba ---------------------------------------------------------------------------------------------------------
  const visivel = (p: PartesAba) => {
    const casam = casaComBusca(todosOsItens(p.def), busca);
    return (nome: string): boolean => casam.has(nome);
  };

  function todosOsItens(def: DefAba): ItemPersonalizar[] {
    return def.id === "documentos" ? [ITEM_MENU_AO_CLICAR, ...def.itens] : [...def.itens];
  }

  const itemDe = (def: DefAba, nome: string): ItemPersonalizar =>
    def.itens.find((i) => i.nome === nome) ?? { nome, glifo: "documentoTexto" };

  function criarLinha(p: PartesAba, item: ItemPersonalizar, indice: number, ativo: boolean, ordenavel: boolean): HTMLLIElement {
    const id = `spro-pp-${p.def.id}-${indice}`;
    const nomeEl = h("span", { class: "spro-pp-nome" }, item.nome);
    const descricao = item.dica ? h("span", { class: "spro-pp-dica", id: `${id}-dica` }, item.dica) : null;
    const sw = interruptor(item.nome, ativo, descricao ? `${id}-dica` : undefined);
    const li = h(
      "li",
      { class: "spro-pp-linha", "data-nome": item.nome, "data-ativo": String(ativo) },
      ordenavel
        ? h("span", { class: "spro-pp-alca", draggable: "true", "aria-hidden": "true" }, icone("alca", 14, d.topo))
        : h("span", { class: "spro-pp-alca vazio", "aria-hidden": "true" }),
      h("span", { class: "spro-pp-glifo", "aria-hidden": "true" }, glifoMenu(item.glifo, 16, d.topo)),
      h("span", { class: "spro-pp-texto" }, nomeEl, descricao),
      item.grupo ? h("span", { class: "spro-pp-grupo" }, item.grupo) : null,
    );
    if (ordenavel) {
      const subir = h(
        "button",
        { type: "button", class: "spro-botao-icone spro-pp-mover", "data-mover": "subir", "aria-label": `Subir ${item.nome}` },
        icone("setaCima", 14, d.topo),
      );
      const descer = h(
        "button",
        { type: "button", class: "spro-botao-icone spro-pp-mover", "data-mover": "descer", "aria-label": `Descer ${item.nome}` },
        icone("setaBaixo", 14, d.topo),
      );
      subir.addEventListener("click", () => moverItem(p, item.nome, -1, "subir"));
      descer.addEventListener("click", () => moverItem(p, item.nome, 1, "descer"));
      li.append(h("span", { class: "spro-pp-setas" }, subir, descer));
    } else {
      li.append(h("span", { class: "spro-pp-setas vazio", "aria-hidden": "true" }));
    }
    li.append(sw);
    sw.addEventListener("click", () => alternarItem(p, item.nome, li, sw));
    li.addEventListener("keydown", (ev) => {
      const e = ev as KeyboardEvent;
      if (!ordenavel || !e.altKey || (e.key !== "ArrowUp" && e.key !== "ArrowDown")) return;
      e.preventDefault();
      // O SEI (janela de topo) usa Alt+setas para andar pela árvore e puxaria o foco para lá.
      e.stopPropagation();
      moverItem(p, item.nome, e.key === "ArrowUp" ? -1 : 1, "switch");
    });
    if (ordenavel) ligarArrastar(p, li, item.nome);
    return li;
  }

  function ligarArrastar(p: PartesAba, li: HTMLLIElement, nome: string): void {
    li.querySelector(".spro-pp-alca")?.addEventListener("dragstart", (ev) => {
      const e = ev as DragEvent;
      arrastando = nome;
      e.dataTransfer?.setData("text/plain", nome);
      if (e.dataTransfer) e.dataTransfer.effectAllowed = "move";
      li.setAttribute("data-arrastando", "");
    });
    li.querySelector(".spro-pp-alca")?.addEventListener("dragend", () => {
      arrastando = null;
      li.removeAttribute("data-arrastando");
      for (const x of p.lista.querySelectorAll("[data-sobre]")) x.removeAttribute("data-sobre");
    });
    li.addEventListener("dragover", (ev) => {
      if (!arrastando || arrastando === nome) return;
      ev.preventDefault();
      li.setAttribute("data-sobre", "");
    });
    li.addEventListener("dragleave", () => li.removeAttribute("data-sobre"));
    li.addEventListener("drop", (ev) => {
      ev.preventDefault();
      li.removeAttribute("data-sobre");
      const origem = arrastando;
      arrastando = null;
      if (!origem || origem === nome) return;
      const linhas = p.estado.linhas;
      const i = linhas.findIndex((l) => l.nome === origem);
      const j = linhas.findIndex((l) => l.nome === nome);
      if (i < 0 || j < 0) return;
      // Arrastar para baixo cai DEPOIS da linha alvo; para cima, ANTES dela.
      const antesDe = i < j ? (linhas[j + 1]?.nome ?? null) : nome;
      aplicarOrdem(p, moverPara(linhas, origem, antesDe), { nome: origem, controle: "switch" });
    });
  }

  function aplicarOrdem(p: PartesAba, linhas: EstadoAba["linhas"], foco: typeof nomeParaFoco): void {
    const antes = p.estado.linhas;
    p.estado = { ...p.estado, linhas };
    if (linhas.every((l, i) => l.nome === antes[i]?.nome)) return;
    nomeParaFoco = foco;
    if (gravar(p, () => gravarLista(arm, p.def, p.estado))) desenharAba(p);
  }

  function moverItem(p: PartesAba, nome: string, delta: -1 | 1, controle: "subir" | "descer" | "switch"): void {
    if (!p.estado.geral) return;
    aplicarOrdem(p, mover(p.estado.linhas, nome, delta, visivel(p)), { nome, controle });
  }

  function alternarItem(p: PartesAba, nome: string, li: HTMLElement, sw: HTMLButtonElement): void {
    if (!p.estado.geral) return;
    if (nome === NOME_MENU_AO_CLICAR) {
      p.estado = { ...p.estado, aoClicar: !p.estado.aoClicar };
      marcar(sw, p.estado.aoClicar);
      li.setAttribute("data-ativo", String(p.estado.aoClicar));
    } else {
      p.estado = { ...p.estado, linhas: p.estado.linhas.map((l) => (l.nome === nome ? { ...l, ativo: !l.ativo } : l)) };
      const ligado = p.estado.linhas.find((l) => l.nome === nome)?.ativo ?? false;
      marcar(sw, ligado);
      li.setAttribute("data-ativo", String(ligado));
    }
    gravar(p, () => gravarLista(arm, p.def, p.estado));
    atualizarResumo(p);
  }

  function alternarGeral(p: PartesAba): void {
    p.estado = { ...p.estado, geral: !p.estado.geral };
    gravar(p, () => gravarGeral(arm, p.def, p.estado.geral));
    desenharAba(p);
  }

  async function restaurar(): Promise<void> {
    const p = partes.get(atual);
    if (!p) return;
    const ok = await pedirConfirmacao(
      `Restaurar o padrão de “${p.def.titulo}”? Os itens e a ordem voltam ao padrão do SEI Pro e a função fica ligada.`,
      "Restaurar",
    );
    if (!ok) return;
    try {
      p.estado = restaurarPadrao(arm, p.def);
      dialogo.erro("");
      avisar(p.def.id);
      salvouAgora();
      dica("Padrão restaurado.");
    } catch {
      dialogo.erro("Não foi possível salvar a personalização neste navegador (armazenamento cheio ou bloqueado).");
      return;
    }
    desenharAba(p);
  }

  // ---- desenho ----------------------------------------------------------------------------------------------------------
  /** Contador, aviso de lista vazia e contagem da busca: o que muda a cada interruptor sem refazer as linhas. */
  /** Só um item ligado se move (a ordem dos ligados é a que vale), e só para onde há outro ligado; os botões e a alça acompanham. */
  function atualizarMovers(p: PartesAba): void {
    if (!p.def.ordenavel) return;
    const casam = visivel(p);
    for (const li of p.lista.querySelectorAll<HTMLElement>("li")) {
      const nome = li.getAttribute("data-nome") ?? "";
      const subir = li.querySelector<HTMLButtonElement>('button[data-mover="subir"]');
      const descer = li.querySelector<HTMLButtonElement>('button[data-mover="descer"]');
      if (subir) subir.disabled = !p.estado.geral || !podeMover(p.estado.linhas, nome, -1, casam);
      if (descer) descer.disabled = !p.estado.geral || !podeMover(p.estado.linhas, nome, 1, casam);
      const ativo = p.estado.linhas.find((l) => l.nome === nome)?.ativo === true;
      const alca = li.querySelector<HTMLElement>(".spro-pp-alca[draggable]");
      if (alca) alca.setAttribute("draggable", String(ativo && p.estado.geral));
    }
  }

  function atualizarResumo(p: PartesAba): void {
    atualizarMovers(p);
    const { ativos, total } = contar(p.estado.linhas);
    p.contador.textContent = rotuloDeAtivos(ativos, total);
    p.semNada.hidden = !(p.estado.geral && semNenhum(p.def, p.estado));
  }

  function desenharAba(p: PartesAba): void {
    const { def, estado } = p;
    marcar(p.geral, estado.geral);
    p.painel.setAttribute("data-geral", String(estado.geral));
    p.lista.setAttribute("aria-disabled", String(!estado.geral));
    const linhas: HTMLLIElement[] = [];
    if (def.id === "documentos") {
      const li = criarLinha(p, ITEM_MENU_AO_CLICAR, 0, estado.aoClicar, false);
      li.classList.add("spro-pp-especial");
      linhas.push(li);
    }
    for (const [i, l] of estado.linhas.entries()) linhas.push(criarLinha(p, itemDe(def, l.nome), i + 1, l.ativo, def.ordenavel));
    p.lista.replaceChildren(...linhas);
    for (const sw of p.lista.querySelectorAll<HTMLButtonElement>("button")) sw.disabled = !estado.geral;
    atualizarResumo(p);
    aplicarBusca(p);
    if (nomeParaFoco) {
      const li = [...p.lista.querySelectorAll<HTMLElement>("li")].find((x) => x.getAttribute("data-nome") === nomeParaFoco?.nome);
      const alvo = li?.querySelector<HTMLElement>(
        nomeParaFoco.controle === "switch" ? "button[role=switch]" : `button[data-mover="${nomeParaFoco.controle}"]`,
      );
      (alvo && !(alvo as HTMLButtonElement).disabled ? alvo : li?.querySelector<HTMLElement>("button[role=switch]"))?.focus?.({
        preventScroll: false,
      });
      nomeParaFoco = null;
    }
  }

  function aplicarBusca(p: PartesAba): void {
    const casam = visivel(p);
    let mostradas = 0;
    for (const li of p.lista.querySelectorAll<HTMLElement>("li")) {
      const mostra = casam(li.getAttribute("data-nome") ?? "");
      li.hidden = !mostra;
      if (mostra) mostradas += 1;
    }
    atualizarMovers(p);
    p.vazioBusca.hidden = mostradas > 0;
    p.vazioBusca.textContent = `Nenhum item com “${busca.trim()}”.`;
    const achados = [...casaComBusca(todosOsItens(p.def), busca)].length;
    p.contaDaAba.textContent = busca.trim() ? String(achados) : "";
    p.contaDaAba.hidden = !busca.trim();
    p.botaoAba.setAttribute(
      "aria-label",
      busca.trim() ? `${p.def.rotulo} (${achados} ${achados === 1 ? "item" : "itens"} com a busca)` : p.def.rotulo,
    );
  }

  function construirAba(def: DefAba): PartesAba {
    const estado = lerAba(arm, def);
    const idAba = `spro-pp-aba-${def.id}`;
    const idPainel = `spro-pp-painel-${def.id}`;
    const contaDaAba = h("span", { class: "spro-pp-aba-conta", hidden: true });
    const botaoAba = h(
      "button",
      {
        type: "button",
        role: "tab",
        id: idAba,
        class: "spro-pp-aba",
        "aria-controls": idPainel,
        "aria-selected": "false",
        tabindex: "-1",
        "data-aba": def.id,
      },
      h("span", { class: "spro-pp-aba-glifo", "aria-hidden": "true" }, glifoMenu(def.glifo, 15, d.topo)),
      h("span", {}, def.rotulo),
      contaDaAba,
    );
    const geral = interruptor(def.rotuloGeral, estado.geral);
    geral.classList.add("spro-pp-geral");
    const contador = h("span", { class: "spro-pp-contador", role: "status", "aria-live": "polite" });
    const semNada = h(
      "p",
      { class: "spro-pp-aviso", role: "status", hidden: true },
      "Nenhum item marcado: o SEI Pro usa a lista padrão. Para esconder tudo, desligue a chave de cima.",
    );
    const vazioBusca = h("p", { class: "spro-pp-vazio", role: "status", hidden: true });
    const lista = h("ul", { class: "spro-pp-lista", "aria-label": def.titulo });
    const avisoDaOpcao = d.avisos?.[def.id];
    const painel = h(
      "div",
      { role: "tabpanel", id: idPainel, class: "spro-pp-painel", "aria-labelledby": idAba, hidden: true, "data-aba": def.id },
      h(
        "div",
        { class: "spro-pp-cabeca" },
        h("span", { class: "spro-pp-cabeca-glifo", "aria-hidden": "true" }, glifoMenu(def.glifo, 20, d.topo)),
        h("div", { class: "spro-pp-cabeca-texto" }, h("h3", {}, def.titulo), h("p", {}, def.descricao)),
        geral,
      ),
      avisoDaOpcao ? h("p", { class: "spro-pp-aviso", role: "note" }, avisoDaOpcao) : null,
      h("div", { class: "spro-pp-resumo" }, contador),
      semNada,
      lista,
      vazioBusca,
    );
    const p: PartesAba = { def, estado, botaoAba, contaDaAba, painel, geral, contador, semNada, vazioBusca, lista };
    geral.addEventListener("click", () => alternarGeral(p));
    botaoAba.addEventListener("click", () => selecionar(def.id, true));
    botaoAba.addEventListener("keydown", (ev) => {
      const e = ev as KeyboardEvent;
      const i = ABAS.findIndex((a) => a.id === def.id);
      const ir = (n: number): void => {
        e.preventDefault();
        const destino = ABAS[(n + ABAS.length) % ABAS.length];
        if (destino) selecionar(destino.id, true);
      };
      if (e.key === "ArrowRight") ir(i + 1);
      else if (e.key === "ArrowLeft") ir(i - 1);
      else if (e.key === "Home") ir(0);
      else if (e.key === "End") ir(ABAS.length - 1);
    });
    return p;
  }

  function selecionar(id: IdAba, focar = false): void {
    atual = id;
    for (const [aid, p] of partes) {
      const eh = aid === id;
      p.painel.hidden = !eh;
      p.botaoAba.setAttribute("aria-selected", String(eh));
      p.botaoAba.tabIndex = eh ? 0 : -1;
      if (eh && focar) p.botaoAba.focus?.({ preventScroll: true });
    }
  }

  for (const def of ABAS) {
    const p = construirAba(def);
    partes.set(def.id, p);
    barraAbas.append(p.botaoAba);
    palco.append(p.painel);
    desenharAba(p);
  }
  selecionar(atual);

  campoBusca.addEventListener("input", () => {
    busca = campoBusca.value;
    for (const p of partes.values()) aplicarBusca(p);
  });
  campoBusca.addEventListener("keydown", (ev) => {
    // Esc limpa a busca primeiro (o segundo Esc fecha o modal), como em qualquer campo de busca.
    if ((ev as KeyboardEvent).key === "Escape" && campoBusca.value) {
      ev.preventDefault();
      ev.stopPropagation();
      campoBusca.value = "";
      campoBusca.dispatchEvent(new (d.topo.defaultView as unknown as { Event: typeof Event }).Event("input", { bubbles: true }));
    }
  });
  botaoRestaurar.addEventListener("click", () => void restaurar());

  const aberto: PersonalizarAberto = { dialogo, selecionar: (id) => selecionar(id), fechar: () => dialogo.fechar() };
  abertos.set(d.topo, aberto);
  return aberto;
}
