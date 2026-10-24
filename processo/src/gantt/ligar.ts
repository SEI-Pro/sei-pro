/**
 * Liga o pedido de abertura do Gantt ao modal. Até a capa nova existir (Etapa 4), quem pede é o link “Histórico de
 * tramitação do processo” da capa legada: `initGanttHistoryProc` (sei-functions-pro.js), cedido pelo atributo
 * `data-seipro-processo-gantt`, dispara `spro-processo-gantt-abrir` no documento do quadro da árvore. A capa nova usará a
 * mesma função `abrirGantt(ctx)`.
 */

import { EVENTO_ABRIR_GANTT } from "../modelo/constantes";
import { avisarNoTopo } from "../pagina/comum";
import type { ContextoProcesso } from "../pagina/contexto";
import { abrirGantt } from "./modal";

export function ligarGantt(doc: Document, obterCtx: () => Promise<ContextoProcesso | null>): () => void {
  const aoPedir = () => {
    void obterCtx()
      .then((ctx) => {
        if (!ctx) {
          avisarNoTopo({ topo: doc }, "Não foi possível abrir o histórico: a árvore do processo não chegou.", 5000);
          return;
        }
        abrirGantt(ctx);
      })
      .catch((e) => console.warn("[SEI Pro] Gantt do processo:", e));
  };
  doc.addEventListener(EVENTO_ABRIR_GANTT, aoPedir);
  return () => doc.removeEventListener(EVENTO_ABRIR_GANTT, aoPedir);
}
