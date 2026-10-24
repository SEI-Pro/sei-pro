/**
 * Infra dos modais de edição. Abrem na janela de topo (o quadro da árvore é estreito demais), com o mesmo
 * `dialog.spro-dialogo` dos outros módulos: sem botão Cancelar (o X e o Esc fecham). Durante a gravação, X e Esc
 * ficam travados, os botões desabilitados, e o erro volta no próprio modal, sem perder o que o usuário digitou.
 */
import { type Combo, criarCombo, type OpcaoCombo } from "@comum/ui/combobox";
import { type Filho, h, icone, type NomeIcone } from "@comum/ui/dom";
import type { ResultadoEscrita } from "@nucleo/dominio/escrita";
import { avisarNoTopo, mensagemDeErro } from "../comum";
import type { ContextoProcesso } from "../contexto";
import { garantirEstilo, temaEscuro } from "../estilo";

export interface Dialogo {
  el: HTMLDialogElement;
  corpo: HTMLElement;
  fechar(): void;
  /** Mostra o erro dentro do modal (some na próxima gravação). */
  erro(msg: string): void;
  /** Roda uma gravação: trava o modal, mostra o resultado e fecha. Devolve true se gravou. */
  gravar(fn: () => Promise<ResultadoEscrita | undefined>, botoes?: HTMLButtonElement[]): Promise<boolean>;
}

export interface OpcoesDialogo {
  titulo: string;
  icone: NomeIcone;
  conteudo: Filho[];
  /** Largura em px (padrão 480). */
  largura?: number;
  aoFechar?: () => void;
}

export function abrirDialogo(ctx: Pick<ContextoProcesso, "topo" | "doc">, o: OpcoesDialogo): Dialogo {
  garantirEstilo(ctx.topo);
  const dlg = h("dialog", { class: "spro-dialogo spro-p-dialogo", "aria-label": o.titulo });
  if (temaEscuro(ctx.doc)) dlg.setAttribute("data-tema", "escuro");
  dlg.style.width = `min(${o.largura ?? 480}px, calc(100vw - 24px))`;
  let ocupado = false;
  const x = h("button", { type: "button", class: "spro-botao-icone", "aria-label": "Fechar (Esc)" }, icone("fechar", 16));
  const aviso = h("div", { class: "spro-p-erro", role: "alert", hidden: true });
  const corpo = h("div", { class: "spro-dialogo-corpo" }, aviso, ...o.conteudo);
  dlg.append(
    h("header", {}, h("span", { class: "spro-dialogo-icone", "aria-hidden": "true" }, icone(o.icone, 18)), h("h2", {}, o.titulo), x),
    corpo,
  );
  const fechar = () => {
    if (!ocupado && dlg.open) dlg.close();
  };
  x.addEventListener("click", fechar);
  // Esc durante a gravação não pode fechar o modal e deixar o usuário sem saber o resultado.
  dlg.addEventListener("cancel", (ev) => {
    if (ocupado) ev.preventDefault();
  });
  dlg.addEventListener("close", () => {
    dlg.remove();
    o.aoFechar?.();
  });
  ctx.topo.body.append(dlg);
  dlg.showModal();
  dlg
    .querySelector<HTMLElement>(
      ".spro-dialogo-corpo :is(input:not([type=hidden]):not([type=checkbox]), textarea, select, button[role=combobox])",
    )
    ?.focus({ preventScroll: true });
  return {
    el: dlg,
    corpo,
    fechar,
    erro(msg) {
      aviso.textContent = msg;
      aviso.hidden = !msg;
    },
    async gravar(fn, botoes = []) {
      this.erro("");
      ocupado = true;
      x.disabled = true;
      for (const b of botoes) b.disabled = true;
      dlg.setAttribute("aria-busy", "true");
      try {
        const r = await fn();
        ocupado = false;
        dlg.close();
        if (r) avisarNoTopo(ctx, r.aplicado ? r.resumo : r.resumo || "Nada a alterar.");
        return true;
      } catch (e) {
        ocupado = false;
        x.disabled = false;
        for (const b of botoes) b.disabled = false;
        dlg.removeAttribute("aria-busy");
        this.erro(mensagemDeErro(e));
        return false;
      }
    },
  };
}

/** `replaceChildren` que aceita o que `h()` aceita (nulos e falsos somem). */
export function preencher(lugar: HTMLElement, ...filhos: Filho[]): void {
  lugar.replaceChildren(...(filhos.filter((f) => f !== null && f !== undefined && f !== false) as Array<Node | string>));
}

/** Rótulo + controle, com dica opcional. */
export function campo(rotulo: string, controle: Filho, dica?: string): HTMLElement {
  return h(
    "label",
    { class: "spro-p-campo" },
    h("span", { class: "spro-p-campo-rotulo" }, rotulo),
    controle,
    dica ? h("span", { class: "spro-p-campo-dica" }, dica) : null,
  );
}

export function rodape(...filhos: Filho[]): HTMLElement {
  return h("div", { class: "spro-dialogo-rodape" }, ...filhos);
}

export function botaoPrimario(texto: string, aoClicar: () => void): HTMLButtonElement {
  return h("button", { type: "button", class: "spro-botao primario", onclick: aoClicar }, texto);
}

/** Interruptor com texto (checkbox acessível). */
export function interruptor(rotulo: string, marcado: boolean, aoMudar: (v: boolean) => void): { el: HTMLElement; input: HTMLInputElement } {
  const input = h("input", { type: "checkbox", class: "spro-p-interruptor" });
  input.checked = marcado;
  input.addEventListener("change", () => aoMudar(input.checked));
  return { el: h("label", { class: "spro-p-opcao" }, input, h("span", {}, rotulo)), input };
}

export interface ConfigEscolha {
  /** Rótulo acessível do campo. */
  rotulo: string;
  /** Texto do botão sem nada escolhido. */
  vazio: string;
  /** Opções já em mãos... */
  opcoes?: OpcaoCombo[];
  /** ...ou a carga delas: o botão mostra "Carregando…", a lista um esqueleto, e a falha oferece "Tentar de novo". */
  carregar?: () => Promise<OpcaoCombo[]>;
  /** Só carrega quando alguém chamar `carregarAgora()` (ex.: a hipótese legal, que só existe no nível restrito). */
  adiar?: boolean;
  /** Valor inicial; a função recebe as opções que chegaram (a atual pode depender delas). */
  valor?: string | ((opcoes: OpcaoCombo[]) => string | undefined);
  aoMudar?: (valor: string) => void;
  /** Caixa de busca: padrão é mostrar sempre (a lista é de escolha única e quase sempre longa). */
  busca?: boolean;
  limite?: number;
  resumo?: (mostradas: number, achadas: number, total: number) => string;
  dicaBusca?: string;
}

export interface EscolhaComBusca {
  /** O botão do seletor (`role=combobox`). */
  el: HTMLButtonElement;
  combo: Combo;
  valor(): string;
  definir(v: string): void;
  opcoes(): OpcaoCombo[];
  /** Resolve quando a carga terminou (bem ou mal). */
  pronto: Promise<void>;
  /** Começa a carga adiada (e não repete uma que já está feita ou em curso). */
  carregarAgora(): Promise<void>;
}

/** Seletor de escolha única com busca (o `criarCombo` do SEI Pro): no lugar do `<select>` nativo e do Chosen do legado. */
export function escolhaComBusca(cfg: ConfigEscolha): EscolhaComBusca {
  let lista = cfg.opcoes ?? [];
  let atual = typeof cfg.valor === "string" ? cfg.valor : "";
  const escolhidos = (): string[] => (atual || lista.some((o) => o.valor === "") ? [atual] : []);
  const combo = criarCombo({
    rotulo: cfg.rotulo,
    opcoes: () => lista,
    valor: escolhidos(),
    vazio: cfg.carregar && !cfg.adiar ? "Carregando…" : cfg.vazio,
    busca: cfg.busca ?? true,
    ...(cfg.limite !== undefined ? { limite: cfg.limite } : {}),
    ...(cfg.resumo ? { resumo: cfg.resumo } : {}),
    ...(cfg.dicaBusca ? { dicaBusca: cfg.dicaBusca } : {}),
    classe: "spro-p-combo",
    larguraLista: 260,
    aoMudar: (v) => {
      atual = v[0] ?? "";
      cfg.aoMudar?.(atual);
    },
  });
  const carregar = cfg.carregar;
  let andamento: Promise<void> | null = null;
  const carregarAgora = (): Promise<void> => {
    if (!andamento) andamento = buscar();
    return andamento;
  };
  async function buscar(): Promise<void> {
    if (!carregar) return;
    combo.definirVazio("Carregando…");
    combo.definirEstado({ tipo: "carregando" });
    try {
      lista = await carregar();
      if (typeof cfg.valor === "function") atual = cfg.valor(lista) ?? atual;
      combo.definir(escolhidos());
      combo.definirVazio(cfg.vazio);
      combo.definirEstado({ tipo: "pronto" });
    } catch (e) {
      combo.definirVazio("Não foi possível carregar");
      combo.definirEstado({ tipo: "erro", mensagem: mensagemDeErro(e), tentar: () => void buscar() });
    }
  }
  return {
    el: combo.el,
    combo,
    valor: () => atual,
    definir(v) {
      atual = v;
      combo.definir(escolhidos());
    },
    opcoes: () => lista,
    pronto: cfg.adiar ? Promise.resolve() : carregarAgora(),
    carregarAgora,
  };
}

/** Pergunta de confirmação (a exceção em que "Cancelar" é a própria pergunta). */
export function confirmar(ctx: Pick<ContextoProcesso, "topo" | "doc">, texto: string, rotulo: string): Promise<boolean> {
  return new Promise<boolean>((resolver) => {
    let resposta = false;
    const sim = h("button", { type: "button", class: "spro-botao primario perigo" }, rotulo);
    const nao = h("button", { type: "button", class: "spro-botao" }, "Cancelar");
    const d = abrirDialogo(ctx, {
      titulo: "Confirmar",
      icone: "alerta",
      largura: 400,
      conteudo: [h("p", { class: "spro-p-pergunta" }, texto), rodape(nao, sim)],
      aoFechar: () => resolver(resposta),
    });
    nao.addEventListener("click", () => d.fechar());
    sim.addEventListener("click", () => {
      resposta = true;
      d.fechar();
    });
  });
}
