/**
 * Comparativo de tempo por unidade (funcionalidade 5 da spec): quanto tempo o processo ficou em cada unidade, em dias,
 * em percentual do total e em número de passagens, do maior para o menor.
 *
 * Regras:
 * - A unidade é a raia do Gantt (`chave`): a sigla, ou sigla e nome quando duas unidades de mesma sigla estiveram com o
 *   processo ao mesmo tempo.
 * - Passagem em curso conta até agora: `duracaoMs` já foi calculada com o relógio de hoje (`calcularPassagens`).
 * - Passagens simultâneas (remessa para várias unidades, ou unidade que remeteu mantendo o processo aberto) contam cada
 *   uma em sua unidade: o total é a SOMA do tempo de todas as passagens (“tempo-unidade”), não o relógio corrido. Assim os
 *   percentuais fecham em 100% e a tabela não depende de como o processo se ramificou. O tempo corrido (do primeiro
 *   recebimento até hoje) é informado à parte.
 * - Passagem aguardando recebimento (a unidade ainda não abriu o processo) conta: é onde o processo está.
 * - Dias e percentual com uma casa decimal (arredondamento comum).
 */
import type { Passagem } from "@nucleo/dominio/passagens";
import { diasDe, fimDaPassagem, rotuloDaRaia } from "./modelo";

export interface TempoDaUnidade {
  unidade: string;
  /** Nome da unidade, quando a raia a separa de outra de mesma sigla. */
  chave: string;
  dias: number;
  /** Tempo exato (ms), para ordenar e somar sem perder o arredondamento. */
  ms: number;
  /** 0 a 100, uma casa. */
  percentual: number;
  passagens: number;
  /** Alguma passagem desta unidade ainda está em curso. */
  emCurso: boolean;
}

export function tempoPorUnidade(passagens: readonly Passagem[]): TempoDaUnidade[] {
  const porChave = new Map<string, { unidade: string; chave: string; ms: number; n: number; emCurso: boolean }>();
  for (const p of passagens) {
    const a = porChave.get(p.chave) ?? { unidade: p.unidade, chave: p.chave, ms: 0, n: 0, emCurso: false };
    a.ms += Math.max(0, p.duracaoMs);
    a.n += 1;
    a.emCurso ||= p.emCurso;
    porChave.set(p.chave, a);
  }
  const total = [...porChave.values()].reduce((t, a) => t + a.ms, 0);
  return [...porChave.values()]
    .map((a) => ({
      unidade: a.unidade,
      chave: a.chave,
      dias: diasDe(a.ms),
      ms: a.ms,
      percentual: total > 0 ? Math.round((a.ms / total) * 1000) / 10 : 0,
      passagens: a.n,
      emCurso: a.emCurso,
    }))
    .sort((x, y) => y.ms - x.ms || x.unidade.localeCompare(y.unidade, "pt-BR"));
}

export interface ResumoDoTempo {
  /** Soma do tempo de todas as passagens (ms). */
  totalMs: number;
  /** Do primeiro recebimento ao último fim (ou a hoje, se algo está em curso) (ms). */
  corridoMs: number;
  unidades: number;
  passagens: number;
}

export function resumoDoTempo(passagens: readonly Passagem[]): ResumoDoTempo {
  if (!passagens.length) return { totalMs: 0, corridoMs: 0, unidades: 0, passagens: 0 };
  let menor = Number.POSITIVE_INFINITY;
  let maior = Number.NEGATIVE_INFINITY;
  let total = 0;
  for (const p of passagens) {
    menor = Math.min(menor, p.recebido.getTime());
    maior = Math.max(maior, fimDaPassagem(p));
    total += Math.max(0, p.duracaoMs);
  }
  return {
    totalMs: total,
    corridoMs: Math.max(0, maior - menor),
    unidades: new Set(passagens.map((p) => p.chave)).size,
    passagens: passagens.length,
  };
}

/** “GPF” ou “GPF 3x” (para a mesma regra de rótulo do Gantt). */
export const rotuloDoComparativo = (t: TempoDaUnidade): string => rotuloDaRaia(t.unidade, t.passagens);
