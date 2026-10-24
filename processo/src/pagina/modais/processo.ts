import { h } from "@comum/ui/dom";
import type { FormularioDoProcesso, OpcaoLista } from "@nucleo/dominio/painelProcesso";
import type { ItemLupa } from "@nucleo/formulario/formulario";
import type { ContextoProcesso } from "../contexto";
import { abrirDialogo, botaoPrimario, campo, type Dialogo, listaComBusca, rodape } from "./comum";

/** Dados que os modais do "Consultar/Alterar Processo" precisam do que já está na tela. */
export interface AtualDoProcesso {
  especificacao: string;
  observacoes: string;
  nivel: string;
}

async function comFormulario(
  ctx: ContextoProcesso,
  d: Dialogo,
  lugar: HTMLElement,
  montar: (fp: FormularioDoProcesso) => void | Promise<void>,
): Promise<void> {
  try {
    const fp = await ctx.op.formularioDoProcesso();
    if (d.el.isConnected) await montar(fp);
  } catch (e) {
    d.erro(e instanceof Error ? e.message : "Não foi possível carregar o formulário do processo.");
    lugar.replaceChildren();
  }
}

const carregando = (texto: string): HTMLElement => h("div", { class: "spro-p-modal-lugar" }, h("p", { class: "spro-p-nota" }, texto));

/** Especificação do processo (até 100 caracteres). */
export function abrirModalEspecificacao(ctx: ContextoProcesso, atual: AtualDoProcesso): void {
  const campoTexto = h("input", { type: "text", class: "spro-campo", maxlength: "100", "aria-label": "Especificação" });
  campoTexto.value = atual.especificacao;
  const salvar = botaoPrimario("Salvar", () => void enviar());
  const d = abrirDialogo(ctx, {
    titulo: "Editar especificação do processo",
    icone: "documento",
    conteudo: [campo("Especificação", campoTexto), rodape(salvar)],
  });
  campoTexto.addEventListener("keydown", (ev) => {
    if (ev.key === "Enter") {
      ev.preventDefault();
      void enviar();
    }
  });
  const enviar = async () => {
    const ok = await d.gravar(() => ctx.op.alterarProcesso({ especificacao: campoTexto.value.trim() }), [salvar]);
    if (ok) ctx.recarregar("dadosProcesso");
  };
}

export function abrirModalTipo(ctx: ContextoProcesso, tipoAtual: string): void {
  const lugar = carregando("Carregando os tipos de processo…");
  const d = abrirDialogo(ctx, { titulo: "Editar tipo de processo", icone: "pasta", conteudo: [lugar] });
  void comFormulario(ctx, d, lugar, (fp) => {
    const doAtual = fp.tipoAtual ?? fp.tipos.find((t) => t.texto === tipoAtual)?.valor;
    const lista = listaComBusca(fp.tipos, doAtual, "tipos de processo");
    const salvar = botaoPrimario("Salvar", async () => {
      if (!lista.valor()) {
        d.erro("Escolha um tipo.");
        return;
      }
      const ok = await d.gravar(() => ctx.op.alterarProcesso({ tipo: lista.valor() }), [salvar]);
      if (ok) ctx.recarregar("dadosProcesso");
    });
    lugar.replaceChildren(campo("Tipo de processo", lista.el), rodape(salvar));
  });
}

/** Nível de acesso: público ou restrito (com hipótese legal). O sigiloso não se define por aqui. */
export function abrirModalNivel(ctx: ContextoProcesso): void {
  const lugar = carregando("Carregando o formulário do processo…");
  const d = abrirDialogo(ctx, { titulo: "Editar nível de acesso", icone: "cadeado", conteudo: [lugar] });
  void comFormulario(ctx, d, lugar, async (fp) => {
    let nivel: "publico" | "restrito" = fp.nivel === "1" ? "restrito" : "publico";
    const botoes = ["publico", "restrito"].map((n) =>
      h(
        "button",
        { type: "button", role: "radio", "aria-checked": String(n === nivel), "data-nivel": n },
        n === "publico" ? "Público" : "Restrito",
      ),
    );
    const segmentado = h("div", { class: "spro-segmentado", role: "radiogroup", "aria-label": "Nível de acesso" }, ...botoes);
    const zonaHipotese = h("div", { class: "spro-p-modal-lugar", hidden: nivel !== "restrito" });
    let lista: ReturnType<typeof listaComBusca> | null = null;
    let opcoesHip: OpcaoLista[] = [];
    const carregarHipoteses = async () => {
      if (lista) return;
      zonaHipotese.replaceChildren(h("p", { class: "spro-p-nota" }, "Carregando as hipóteses legais…"));
      try {
        opcoesHip = await fp.hipoteses("1");
        lista = listaComBusca(opcoesHip, fp.hipoteseAtual, "hipóteses legais");
        zonaHipotese.replaceChildren(campo("Hipótese legal", lista.el));
      } catch (e) {
        zonaHipotese.replaceChildren();
        d.erro(e instanceof Error ? e.message : "Não foi possível carregar as hipóteses legais.");
      }
    };
    for (const b of botoes) {
      b.addEventListener("click", () => {
        nivel = b.getAttribute("data-nivel") === "restrito" ? "restrito" : "publico";
        for (const x of botoes) x.setAttribute("aria-checked", String(x === b));
        zonaHipotese.hidden = nivel !== "restrito";
        if (nivel === "restrito") void carregarHipoteses();
      });
    }
    const salvar = botaoPrimario("Salvar", async () => {
      if (nivel === "restrito" && !lista?.valor()) {
        d.erro("Escolha a hipótese legal.");
        return;
      }
      const ok = await d.gravar(
        () => ctx.op.alterarProcesso(nivel === "restrito" ? { nivel, hipotese: lista?.valor() ?? "" } : { nivel }),
        [salvar],
      );
      if (ok) ctx.recarregar("dadosProcesso");
    });
    lugar.replaceChildren(segmentado, zonaHipotese, rodape(salvar));
    if (nivel === "restrito") await carregarHipoteses();
  });
}

/** Observações DESTA unidade (as das outras só se leem). */
export function abrirModalObservacoes(ctx: ContextoProcesso, atual: AtualDoProcesso): void {
  const texto = h("textarea", { class: "spro-campo", rows: "5", maxlength: "1000", "aria-label": "Observações desta unidade" });
  texto.value = atual.observacoes;
  const salvar = botaoPrimario("Salvar", () => void enviar());
  const d = abrirDialogo(ctx, {
    titulo: "Observações desta unidade",
    icone: "nota",
    conteudo: [campo("Observações", texto, "Linhas que começam com # são etiquetas e não aparecem no painel."), rodape(salvar)],
  });
  const enviar = async () => {
    const ok = await d.gravar(() => ctx.op.alterarProcesso({ observacoes: texto.value.trim() }), [salvar]);
    if (ok) ctx.recarregar("dadosProcesso");
  };
}

/** Interessados: retirar os que não cabem mais (incluir novos continua na tela “Consultar/Alterar Processo” do SEI). */
export function abrirModalInteressados(ctx: ContextoProcesso): void {
  const lugar = carregando("Carregando os interessados…");
  const d = abrirDialogo(ctx, { titulo: "Interessados do processo", icone: "pessoa", conteudo: [lugar] });
  void comFormulario(ctx, d, lugar, (fp) => {
    const restantes = new Map<string, ItemLupa>(fp.interessados.map((i) => [i.id, i]));
    const linhas = fp.interessados.map((i) => {
      const retirar = h(
        "button",
        { type: "button", class: "spro-p-acao perigo", "aria-pressed": "false", "aria-label": `Retirar ${i.texto}` },
        "Retirar",
      );
      const linha = h("li", { class: "spro-p-linha-modal" }, h("span", { class: "spro-p-texto-modal" }, i.texto), retirar);
      retirar.addEventListener("click", () => {
        const sai = restantes.has(i.id);
        if (sai) restantes.delete(i.id);
        else restantes.set(i.id, i);
        linha.toggleAttribute("data-retirado", sai);
        retirar.textContent = sai ? "Manter" : "Retirar";
        retirar.setAttribute("aria-pressed", String(sai));
        salvar.disabled = restantes.size === fp.interessados.length;
      });
      return linha;
    });
    const salvar = botaoPrimario("Salvar", async () => {
      const ok = await d.gravar(
        () => ctx.op.alterarProcesso({ interessados: fp.interessados.filter((i) => restantes.has(i.id)) }),
        [salvar],
      );
      if (ok) ctx.recarregar("dadosProcesso");
    });
    salvar.disabled = true;
    lugar.replaceChildren(
      linhas.length
        ? h("ul", { class: "spro-p-lista-modal" }, ...linhas)
        : h("p", { class: "spro-p-nota" }, "O processo não tem interessados."),
      h("p", { class: "spro-p-nota" }, "Para incluir um interessado, use Consultar/Alterar Processo no SEI."),
      rodape(salvar),
    );
  });
}
