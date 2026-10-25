import { h } from "@comum/ui/dom";
import type { AnotacaoProcesso } from "@nucleo/dominio/painelProcesso";
import type { DadoAnotacao } from "../../modelo/dados";
import { dataBrasileira, dataIsoDaAnotacao, linhasDaAnotacao, situacaoDoPrazo } from "../../modelo/texto";
import { corpoPorEstado } from "../../ui/estados";
import { glifo } from "../../ui/glifos";
import { avisarNoTopo } from "../comum";
import type { ContextoProcesso } from "../contexto";
import { confirmar } from "../modais/comum";
import { criarEditorAnotacao, type EditorAnotacao, type Encerramento } from "./anotacaoEditor";
import { type DefPainel, fatia, notaIndisponivel } from "./comum";

async function gravar(ctx: ContextoProcesso, fazer: () => Promise<unknown>): Promise<void> {
  try {
    await fazer();
  } catch (e) {
    avisarNoTopo(ctx, e instanceof Error ? e.message : "Não foi possível gravar a anotação.", 7000);
  }
  ctx.recarregar("anotacao");
}

/** Um editor aberto por processo (por contexto). O painel o devolve a cada redesenho: o campo não é refeito nem perde o foco. */
const editores = new WeakMap<ContextoProcesso, EditorAnotacao>();

function encerrarEdicao(ctx: ContextoProcesso, r: Encerramento): void {
  editores.get(ctx)?.destruir();
  editores.delete(ctx);
  if (r.gravou) {
    // A escrita do núcleo só volta com sucesso se o SEI confirmou (`aplicar: true`): o valor gravado já vale na tela, e a releitura
    // logo depois confere com o SEI.
    ctx.loja.definir<DadoAnotacao>("anotacao", {
      estado: "pronto",
      dado: { disponivel: true, valor: r.valor },
      em: ctx.agora().getTime(),
    });
    ctx.recarregar("anotacao");
  } else ctx.loja.renotificar("anotacao");
}

/** Abre o editor NO LUGAR do cartão (sem modal). */
export function editarAnotacao(ctx: ContextoProcesso, atual: AnotacaoProcesso | null): void {
  const aberto = editores.get(ctx);
  if (aberto) {
    aberto.focar();
    return;
  }
  const ed = criarEditorAnotacao(ctx, { inicial: atual, aoEncerrar: (r) => encerrarEdicao(ctx, r) });
  editores.set(ctx, ed);
  ctx.loja.renotificar("anotacao");
  ed.focar();
}

const INTERATIVO = "label.item, input, a, button, textarea";

export const painelAnotacoes: DefPainel = {
  tipo: "anotacoes",
  titulo: "Anotações",
  icone: "nota",
  desenhar(ctx) {
    const f = fatia<DadoAnotacao>(ctx, "anotacao");
    // A barra do processo não oferece anotação (processo fechado na unidade): como no legado, o painel nem aparece.
    if (f.dado && !f.dado.disponivel && f.dado.motivo === "acao") return null;
    const disp = f.dado?.disponivel ? f.dado : null;
    const atual = disp?.valor ?? null;
    const editor = editores.get(ctx);
    if (editor) {
      // A fatia pode mudar enquanto se escreve: o editor só marca o aviso; o campo (e o foco) ficam como estão.
      editor.fatiaMudou(atual);
      return { estado: f.estado, desenho: { acoes: [], corpo: [editor.el] } };
    }
    return {
      estado: f.estado,
      desenho: {
        acoes: disp
          ? atual
            ? [
                {
                  icone: "alerta",
                  rotulo: atual.prioridade ? "Tirar a prioridade" : "Marcar como prioridade",
                  ativa: atual.prioridade,
                  aoClicar: () => void gravar(ctx, () => ctx.op.alternarPrioridadeDaAnotacao()),
                },
                { icone: "lapis", rotulo: "Editar anotação", aoClicar: () => editarAnotacao(ctx, atual) },
                {
                  icone: "lixeira",
                  rotulo: "Remover anotação",
                  perigo: true,
                  aoClicar: () =>
                    void confirmar(ctx, "Tem certeza que deseja remover esta anotação?", "Remover").then((sim) => {
                      if (sim) void gravar(ctx, () => ctx.op.anotar({ texto: "", prioridade: false }));
                    }),
                },
              ]
            : [{ icone: "mais", rotulo: "Adicionar anotação", aoClicar: () => editarAnotacao(ctx, null) }]
          : [],
        corpo: corpoPorEstado(
          f,
          () => ctx.recarregar("anotacao"),
          (d) => {
            if (!d.disponivel) return [notaIndisponivel(d.motivo, "As anotações")];
            if (!d.valor)
              return [
                h(
                  "div",
                  { class: "spro-p-vazio" },
                  "Sem anotação.",
                  " ",
                  h("button", { type: "button", class: "spro-p-link", onclick: () => editarAnotacao(ctx, null) }, "Adicionar anotação"),
                ),
              ];
            const valor = d.valor;
            const { texto, prioridade } = valor;
            const iso = dataIsoDaAnotacao(texto);
            const s = iso ? situacaoDoPrazo({ data: iso, hora: "23:59", vencimento: true }, ctx.agora()) : null;
            const itens = linhasDaAnotacao(texto).map((l, i) =>
              l.marca === null
                ? h("div", { class: "spro-p-nota-linha" }, l.texto || " ")
                : h(
                    "label",
                    { class: `spro-p-nota-linha item${l.marca === "feito" ? " feito" : ""}` },
                    h("input", {
                      type: "checkbox",
                      checked: l.marca === "feito",
                      onchange: () => void gravar(ctx, () => ctx.op.alternarItemDaAnotacao(i)),
                    }),
                    h("span", {}, l.texto),
                  ),
            );
            return [
              h(
                "div",
                {
                  class: `spro-p-post-it editavel${prioridade ? " prioridade" : ""}`,
                  // Clicar no papel (fora das caixas da checklist) abre o editor no lugar; o teclado tem o lápis do cabeçalho.
                  onclick: (ev) => {
                    const alvo = ev.target as Element | null;
                    if (alvo?.closest(INTERATIVO)) return;
                    editarAnotacao(ctx, valor);
                  },
                },
                prioridade ? h("span", { class: "spro-p-chip vencido" }, glifo("alerta", 12), "prioridade") : null,
                ...itens,
                iso && s
                  ? h(
                      "span",
                      { class: `spro-p-chip ${s.nivel}` },
                      glifo("calendarioMais", 12),
                      `${dataBrasileira({ data: iso, hora: "23:59", vencimento: true })} · ${s.rotulo}`,
                    )
                  : null,
              ),
            ];
          },
        ),
      },
    };
  },
};
