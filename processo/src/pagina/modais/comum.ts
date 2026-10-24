/**
 * Infra dos modais de edição. Abrem na janela de topo (o quadro da árvore é estreito demais), com o mesmo
 * `dialog.spro-dialogo` dos outros módulos: sem botão Cancelar (o X e o Esc fecham). Durante a gravação, X e Esc
 * ficam travados, os botões desabilitados, e o erro volta no próprio modal, sem perder o que o usuário digitou.
 */
import { type Filho, h, icone, type NomeIcone } from "@comum/ui/dom";
import type { ResultadoEscrita } from "@nucleo/dominio/escrita";
import type { OpcaoLista } from "@nucleo/dominio/painelProcesso";
import { paraBusca } from "../../modelo/texto";
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
    .querySelector<HTMLElement>(".spro-dialogo-corpo :is(input:not([type=hidden]):not([type=checkbox]), textarea, select)")
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

export interface ListaComBusca {
  el: HTMLElement;
  valor(): string;
  definir(v: string): void;
}

/** Lista de escolha com caixa de busca (no lugar do select com Chosen do legado); filtra sem diferenciar acento nem caixa. */
export function listaComBusca(
  opcoes: OpcaoLista[],
  atual: string | undefined,
  rotulo: string,
  aoMudar?: (v: string) => void,
): ListaComBusca {
  const sel = h("select", {
    class: "spro-campo spro-p-lista",
    size: String(Math.min(8, Math.max(4, opcoes.length))),
    "aria-label": rotulo,
  });
  let valor = atual ?? "";
  const desenhar = (termo: string) => {
    const t = paraBusca(termo);
    const visiveis = t ? opcoes.filter((x) => paraBusca(x.texto).includes(t)) : opcoes;
    sel.replaceChildren(
      ...visiveis.map((x) => {
        const o = h("option", { value: x.valor }, x.texto);
        o.selected = x.valor === valor;
        return o;
      }),
    );
  };
  sel.addEventListener("change", () => {
    valor = sel.value;
    aoMudar?.(valor);
  });
  const busca = h("input", { type: "search", class: "spro-campo", placeholder: "Buscar…", "aria-label": `Buscar em ${rotulo}` });
  busca.addEventListener("input", () => desenhar(busca.value));
  desenhar("");
  const el = h("div", { class: "spro-p-busca" }, opcoes.length > 8 ? busca : null, sel);
  return {
    el,
    valor: () => valor,
    definir(v) {
      valor = v;
      desenhar(busca.value);
    },
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
