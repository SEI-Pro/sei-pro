import { h, icone } from "@comum/ui/dom";
import type { DadoAcompanhamento, DadoProcesso } from "../../modelo/dados";
import { situacaoDoPrazo } from "../../modelo/texto";
import { corpoPorEstado, vazio } from "../../ui/estados";
import { abrirModalAcompanhamento } from "../modais/acompanhamento";
import { copiavel, type DefPainel, fatia, linha, notaIndisponivel } from "./comum";

function chipReabertura(reabertura: string, agora: Date): HTMLElement {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{2}):(\d{2}))?/.exec(reabertura);
  const s = m
    ? situacaoDoPrazo({ data: `${m[3]}-${m[2]}-${m[1]}`, hora: `${m[4] ?? "00"}:${m[5] ?? "00"}`, vencimento: false }, agora)
    : null;
  return h(
    "span",
    { class: `spro-p-chip ${s?.nivel === "vencido" ? "atencao" : (s?.nivel ?? "ok")}` },
    icone("relogio", 11),
    `Reabertura: ${reabertura}${s ? ` · ${s.rotulo}` : ""}`,
  );
}

export const painelAcompanhamento: DefPainel = {
  tipo: "acompanhamento_especial",
  titulo: "Acompanhamento Especial",
  icone: "olho",
  desenhar(ctx) {
    const f = fatia<DadoAcompanhamento>(ctx, "acompanhamento");
    const dados = fatia<DadoProcesso>(ctx, "dadosProcesso").dado;
    const especificacao = dados?.disponivel ? dados.valor.especificacao : "";
    const atual = f.dado?.disponivel ? f.dado.valor : null;
    const pode = Boolean(f.dado?.disponivel) && !ctx.sigiloso;
    return {
      estado: f.estado,
      desenho: {
        acoes: pode
          ? [
              {
                icone: atual ? "lapis" : "mais",
                rotulo: atual ? "Editar acompanhamento especial" : "Incluir acompanhamento especial",
                aoClicar: () => abrirModalAcompanhamento(ctx, atual, especificacao),
              },
            ]
          : [],
        corpo: corpoPorEstado(
          f,
          () => ctx.recarregar("acompanhamento"),
          (d) => {
            if (!d.disponivel) return [notaIndisponivel(d.motivo, "O acompanhamento especial")];
            if (!d.valor) return [vazio("Sem acompanhamento especial.")];
            const { observacao, grupo, reabertura } = d.valor;
            return [
              linha(copiavel(ctx, observacao ? `${observacao}${grupo ? ` (${grupo})` : ""}` : (grupo ?? "Acompanhado"))),
              reabertura ? linha(chipReabertura(reabertura, ctx.agora())) : null,
            ];
          },
        ),
      },
    };
  },
};
