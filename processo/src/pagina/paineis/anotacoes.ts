import { h, icone } from "@comum/ui/dom";
import type { DadoAnotacao } from "../../modelo/dados";
import { alternarItem, dataBrasileira, dataIsoDaAnotacao, linhasDaAnotacao, situacaoDoPrazo } from "../../modelo/texto";
import { corpoPorEstado } from "../../ui/estados";
import { avisarNoTopo } from "../comum";
import type { ContextoProcesso } from "../contexto";
import { abrirModalAnotacao } from "../modais/anotacao";
import { confirmar } from "../modais/comum";
import { type DefPainel, fatia, notaIndisponivel } from "./comum";

async function gravar(ctx: ContextoProcesso, texto: string, prioridade: boolean): Promise<void> {
  try {
    await ctx.op.anotar({ texto, prioridade });
  } catch (e) {
    avisarNoTopo(ctx, e instanceof Error ? e.message : "Não foi possível gravar a anotação.", 7000);
  }
  ctx.recarregar("anotacao");
}

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
                  aoClicar: () => void gravar(ctx, atual.texto, !atual.prioridade),
                },
                { icone: "lapis", rotulo: "Editar anotação", aoClicar: () => abrirModalAnotacao(ctx, atual) },
                {
                  icone: "lixeira",
                  rotulo: "Remover anotação",
                  perigo: true,
                  aoClicar: () =>
                    void confirmar(ctx, "Tem certeza que deseja remover esta anotação?", "Remover").then((sim) => {
                      if (sim) void gravar(ctx, "", false);
                    }),
                },
              ]
            : [{ icone: "mais", rotulo: "Adicionar anotação", aoClicar: () => abrirModalAnotacao(ctx, null) }]
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
                  h("button", { type: "button", class: "spro-p-link", onclick: () => abrirModalAnotacao(ctx, null) }, "Adicionar anotação"),
                ),
              ];
            const { texto, prioridade } = d.valor;
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
                      onchange: () => void gravar(ctx, alternarItem(texto, i), prioridade),
                    }),
                    h("span", {}, l.texto),
                  ),
            );
            return [
              h(
                "div",
                { class: `spro-p-post-it${prioridade ? " prioridade" : ""}` },
                prioridade ? h("span", { class: "spro-p-chip vencido" }, icone("alerta", 11), "prioridade") : null,
                ...itens,
                iso && s
                  ? h(
                      "span",
                      { class: `spro-p-chip ${s.nivel}` },
                      icone("calendario", 11),
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
