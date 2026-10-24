/**
 * O modal do Gantt no padrão `dialog.spro-dialogo` (sem botão Cancelar: o X e o Esc fecham). Abre na janela de topo.
 * Fechar o modal para a coleta em curso; o botão “Cancelar coleta” para só a coleta e deixa o modal aberto.
 */
import type { ContextoProcesso } from "../pagina/contexto";
import { abrirDialogo } from "../pagina/modais/comum";
import { type DepsVisao, montarVisao, type VisaoGantt } from "./visao";
import { abrirVisualizacaoRapida } from "./visualizacao";

export const CLASSE_DIALOGO_GANTT = "spro-g-dialogo";

export interface GanttAberto extends VisaoGantt {
  fechar(): void;
}

/**
 * Abre o Gantt (ou volta a ele, se já estiver aberto). A coleta do histórico só começa aqui, por clique do usuário
 * (spec 8.2); dentro de 30 minutos da última o resultado vem do cache.
 */
export function abrirGantt(
  ctx: ContextoProcesso,
  deps: Partial<Pick<DepsVisao, "abrirDocumento" | "escala" | "aba">> = {},
): GanttAberto | null {
  const aberto = ctx.topo.querySelector<HTMLDialogElement>(`dialog.${CLASSE_DIALOGO_GANTT}`);
  if (aberto) {
    aberto.querySelector<HTMLElement>("[role=tab][aria-selected=true]")?.focus();
    return null;
  }
  const visao = montarVisao({ ctx, abrirDocumento: (d) => void abrirVisualizacaoRapida(ctx, d), ...deps });
  const dlg = abrirDialogo(ctx, {
    titulo: `Histórico de tramitação - ${ctx.protocolo}`,
    icone: "gantt",
    largura: 1180,
    conteudo: [visao.el],
    aoFechar: () => visao.destruir(),
  });
  dlg.el.classList.add(CLASSE_DIALOGO_GANTT);
  return { ...visao, fechar: dlg.fechar };
}
