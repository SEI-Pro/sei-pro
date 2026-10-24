import { h } from "@comum/ui/dom";
import type { FormularioDoProcesso, OpcaoLista } from "@nucleo/dominio/painelProcesso";
import type { ContextoProcesso } from "../contexto";
import { abrirDialogo, botaoPrimario, campo, type Dialogo, listaComBusca, rodape } from "./comum";
import { abrirModalLupa, type CargaLupa } from "./lupa";

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

const aoCarregarDoFormulario = (ctx: ContextoProcesso, qual: "interessados" | "assuntos") => async (): Promise<CargaLupa> => {
  const fp = await ctx.op.formularioDoProcesso();
  return qual === "assuntos"
    ? { atuais: fp.assuntos, negados: fp.assuntosNegados, pesquisar: (t, sinal) => fp.pesquisarAssuntos(t, sinal) }
    : { atuais: fp.interessados, negados: fp.interessadosNegados, pesquisar: (t, sinal) => fp.pesquisarContatos(t, sinal) };
};

/** Interessados: retirar e acrescentar (pesquisa de contatos no próprio SEI). */
export function abrirModalInteressados(ctx: ContextoProcesso): void {
  abrirModalLupa(ctx, {
    titulo: "Interessados do processo",
    icone: "pessoa",
    nome: "interessado",
    nomePlural: "interessados",
    dica: "Digite o nome do contato para pesquisar.",
    carregar: aoCarregarDoFormulario(ctx, "interessados"),
    gravar: (itens) => ctx.op.alterarProcesso({ interessados: itens }),
    depois: () => ctx.recarregar("dadosProcesso"),
  });
}

/** Assuntos: retirar e acrescentar (pesquisa de assuntos no próprio SEI). O SEI exige ao menos um. */
export function abrirModalAssuntos(ctx: ContextoProcesso): void {
  abrirModalLupa(ctx, {
    titulo: "Assuntos do processo",
    icone: "etiqueta",
    nome: "assunto",
    nomePlural: "assuntos",
    dica: "Digite o código ou parte da descrição do assunto.",
    carregar: aoCarregarDoFormulario(ctx, "assuntos"),
    gravar: (itens) => ctx.op.alterarProcesso({ assuntos: itens }),
    depois: () => ctx.recarregar("dadosProcesso"),
    obrigatorio: "O processo precisa ter ao menos um assunto.",
  });
}
