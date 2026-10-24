/**
 * O lado do quadro da árvore na conversa com a capa (ver `capa/ponte.ts`): a árvore é a dona da escrita da loja, então é
 * ela quem carrega as fatias que a capa lê e quem coleta o histórico completo quando o usuário clica em "Calcular".
 * A coleta só começa por esse clique (spec 8.2); o progresso volta em `data-spro-capa-coleta` no <html> da árvore.
 */
import { textoDaColeta } from "../capa/ponte";
import { obterHistorico } from "../gantt/coleta";
import { ATRIBUTO_COLETA, EVENTO_CAPA_CALCULAR, EVENTO_CAPA_CANCELAR, EVENTO_CAPA_PEDIR } from "../modelo/constantes";
import type { NomeFatia } from "../modelo/tipos";
import { mensagemDeLeitura } from "./comum";
import type { ContextoProcesso } from "./contexto";

/** As fatias de que a capa precisa (só as do cadastro; o resto do cache a capa só lê, se houver). */
export const FATIAS_DA_CAPA: readonly NomeFatia[] = ["dadosProcesso", "marcador"];

const cancelado = (e: unknown): boolean => !!e && typeof e === "object" && (e as { codigo?: unknown }).codigo === "CANCELADO";

export function ligarPonteDaCapa(doc: Document, obterCtx: () => Promise<ContextoProcesso | null>): () => void {
  let controle: AbortController | null = null;
  const marcar = (e: Parameters<typeof textoDaColeta>[0]): void => {
    const t = textoDaColeta(e);
    if (t === null) doc.documentElement?.removeAttribute(ATRIBUTO_COLETA);
    else doc.documentElement?.setAttribute(ATRIBUTO_COLETA, t);
  };

  const aoPedir = () => {
    void obterCtx()
      .then((ctx) => {
        if (!ctx || ctx.sigiloso) return;
        for (const n of FATIAS_DA_CAPA) if (ctx.loja.ler(n).estado !== "pronto") ctx.recarregar(n);
      })
      .catch((e) => console.warn("[SEI Pro] capa do processo:", e));
  };

  const aoCalcular = () => {
    if (controle) return; // uma coleta por vez
    const c = new AbortController();
    controle = c;
    marcar({ fase: "coletando", feito: 0, total: 0 });
    void obterCtx()
      .then(async (ctx) => {
        if (!ctx || ctx.sigiloso) throw new Error("O histórico não está disponível para este processo.");
        await obterHistorico(ctx, {
          sinal: c.signal,
          aoProgresso: (feito, total) => marcar({ fase: "coletando", feito, total }),
        });
        marcar("pronto");
      })
      .catch((e) => {
        if (cancelado(e) || c.signal.aborted) marcar({ fase: "parada" });
        else marcar({ fase: "erro", mensagem: mensagemDeLeitura(e) });
      })
      .finally(() => {
        controle = null;
      });
  };

  const aoCancelar = () => controle?.abort();

  doc.addEventListener(EVENTO_CAPA_PEDIR, aoPedir);
  doc.addEventListener(EVENTO_CAPA_CALCULAR, aoCalcular);
  doc.addEventListener(EVENTO_CAPA_CANCELAR, aoCancelar);
  return () => {
    doc.removeEventListener(EVENTO_CAPA_PEDIR, aoPedir);
    doc.removeEventListener(EVENTO_CAPA_CALCULAR, aoCalcular);
    doc.removeEventListener(EVENTO_CAPA_CANCELAR, aoCancelar);
  };
}
