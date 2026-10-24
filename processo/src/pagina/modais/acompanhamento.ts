import { h } from "@comum/ui/dom";
import type { AcompanhamentoProcesso, OpcaoLista } from "@nucleo/dominio/painelProcesso";
import { comporObservacaoAcompanhamento, reaberturaBrasileira, reaberturaParaCampo } from "../../modelo/texto";
import type { ContextoProcesso } from "../contexto";
import { abrirDialogo, botaoPrimario, campo, interruptor, preencher, rodape } from "./comum";

/** Inclui ou altera o acompanhamento especial: grupo, texto e, se a opção estiver ligada, a reabertura programada. */
export function abrirModalAcompanhamento(ctx: ContextoProcesso, atual: AcompanhamentoProcesso | null, textoPadrao: string): void {
  const lugar = h("div", { class: "spro-p-modal-lugar" }, h("p", { class: "spro-p-nota" }, "Carregando os grupos…"));
  const d = abrirDialogo(ctx, {
    titulo: atual ? "Editar acompanhamento especial" : "Acompanhamento especial",
    icone: "olho",
    largura: 520,
    conteudo: [lugar],
  });
  void ctx.op
    .opcoesAcompanhamento()
    .then(({ grupos, atual: grupoAtual }) => {
      if (!d.el.isConnected) return;
      montar(ctx, d, lugar, grupos, grupoAtual, atual, textoPadrao);
    })
    .catch((e) => {
      d.erro(e instanceof Error ? e.message : "Não foi possível carregar os grupos.");
      lugar.replaceChildren();
    });
}

function montar(
  ctx: ContextoProcesso,
  d: ReturnType<typeof abrirDialogo>,
  lugar: HTMLElement,
  grupos: OpcaoLista[],
  grupoAtual: string | undefined,
  atual: AcompanhamentoProcesso | null,
  textoPadrao: string,
): void {
  const grupo = h(
    "select",
    { class: "spro-campo", "aria-label": "Grupo" },
    h("option", { value: "" }, "(sem grupo)"),
    ...grupos.map((g) => h("option", { value: g.valor }, g.texto)),
  );
  grupo.value = grupoAtual ?? "";
  const texto = h("textarea", { class: "spro-campo", rows: "3", maxlength: "450", placeholder: "Observação" });
  texto.value = atual ? (atual.observacao ?? "") : textoPadrao.slice(0, 450);
  const podeReabrir = ctx.reaberturaProgramada || Boolean(atual?.reabertura);
  const reabrir = interruptor("Reabertura programada", Boolean(atual?.reabertura), (v) => (quando.hidden = !v));
  const quando = h("input", {
    type: "datetime-local",
    class: "spro-campo",
    "aria-label": "Data e hora da reabertura",
    hidden: !atual?.reabertura,
  });
  quando.value = atual?.reabertura ? reaberturaParaCampo(atual.reabertura) : "";

  const salvar = botaoPrimario("Salvar", () => void enviar());
  const enviar = async () => {
    if (podeReabrir && reabrir.input.checked && !quando.value) {
      d.erro("Informe a data da reabertura.");
      return;
    }
    const observacao = comporObservacaoAcompanhamento(
      texto.value,
      podeReabrir && reabrir.input.checked ? reaberturaBrasileira(quando.value) : null,
    );
    const ok = await d.gravar(() => ctx.op.acompanhar({ grupo: grupo.value, observacao }), [salvar]);
    if (ok) ctx.recarregar("acompanhamento");
  };
  preencher(
    lugar,
    podeReabrir ? reabrir.el : null,
    podeReabrir ? h("div", { class: "spro-p-grade" }, quando) : null,
    campo("Grupo", grupo),
    campo("Observação", texto),
    rodape(salvar),
  );
}
