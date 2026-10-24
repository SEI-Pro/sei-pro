/**
 * A coleta do histórico completo do processo, por clique (spec 8.2): quem pede (o Gantt, o gancho do Bloco Interno)
 * chama `obterHistorico`. Dentro de 30 minutos da última coleta o resultado vem do cache, sem rede; fora disso (ou com
 * `forcar`) a coleta roda aproveitando o cache como base (atualização incremental do núcleo: só a primeira página
 * quando nada mudou). Processo sigiloso nunca coleta nem guarda.
 */

import type { Andamento, HistoricoColetado, OpcoesColeta } from "@nucleo/dominio/historico";
import { blocoInternoDoHistorico } from "@nucleo/dominio/painelProcesso";
import { type HistoricoGuardado, historicoVale } from "../modelo/dados";
import type { LojaProcesso } from "../modelo/loja";

export type ColetorHistorico = (o: OpcoesColeta) => Promise<HistoricoColetado>;

/** O que a coleta precisa do contexto do processo (o `ContextoProcesso` serve; os testes montam um mínimo). */
export interface ContextoColeta {
  loja: LojaProcesso;
  sigiloso: boolean;
  unidade: { sigla: string };
  agora(): Date;
  coletarHistorico: ColetorHistorico;
}

export interface PedidoHistorico {
  sinal?: AbortSignal;
  /** Páginas já lidas e total (“página 7 de 34”). */
  aoProgresso?: (feito: number, total: number) => void;
  /** Coleta mesmo que o cache ainda valha (botão “Atualizar”). */
  forcar?: boolean;
}

export interface HistoricoPronto {
  andamentos: Andamento[];
  /** Quando foi coletado ou conferido (ms). */
  coletadoEm: number;
  /** De onde veio agora: do cache (sem rede) ou de uma coleta. */
  origem: "cache" | "rede";
  /** A coleta só conferiu a primeira página e aproveitou o resto. */
  aproveitouCache?: boolean;
}

export class ProcessoSigilosoErro extends Error {
  readonly codigo = "PROCESSO_SIGILOSO";
  constructor() {
    super("Processo sigiloso: o histórico completo não é coletado.");
  }
}

/** O Bloco Interno do histórico entra na fatia do painel, que redesenha sozinho. */
export function publicarBlocoInterno(ctx: Pick<ContextoColeta, "loja" | "unidade" | "agora">, h: HistoricoGuardado): void {
  ctx.loja.definir("blocoInterno", {
    estado: "pronto",
    dado: { descricao: blocoInternoDoHistorico(h.andamentos, ctx.unidade.sigla), coletadoEm: h.coletadoEm },
    em: ctx.agora().getTime(),
  });
}

/** O histórico guardado, e se ainda vale (30 min). Sem rede. */
export async function historicoGuardado(
  ctx: Pick<ContextoColeta, "loja" | "agora" | "sigiloso">,
): Promise<{ historico: HistoricoGuardado; vale: boolean } | null> {
  if (ctx.sigiloso) return null;
  const h = await ctx.loja.lerHistorico();
  return h ? { historico: h, vale: historicoVale(h.coletadoEm, ctx.agora().getTime()) } : null;
}

/** Ao abrir o processo: se o histórico completo ainda vale no cache, o Bloco Interno aparece sem pedir nada ao SEI. */
export async function restaurarBlocoInterno(ctx: ContextoColeta): Promise<boolean> {
  const g = await historicoGuardado(ctx);
  if (!g?.vale) return false;
  publicarBlocoInterno(ctx, g.historico);
  return true;
}

export async function obterHistorico(ctx: ContextoColeta, pedido: PedidoHistorico = {}): Promise<HistoricoPronto> {
  if (ctx.sigiloso) throw new ProcessoSigilosoErro();
  const g = await historicoGuardado(ctx);
  if (g?.vale && !pedido.forcar) {
    publicarBlocoInterno(ctx, g.historico);
    return { andamentos: g.historico.andamentos, coletadoEm: g.historico.coletadoEm, origem: "cache" };
  }
  const base = g?.historico;
  const r = await ctx.coletarHistorico({
    ...(pedido.sinal ? { sinal: pedido.sinal } : {}),
    ...(pedido.aoProgresso ? { aoProgresso: pedido.aoProgresso } : {}),
    cache: base ? { hash: base.hash, total: base.total, andamentos: base.andamentos } : null,
  });
  if (!r.completo) throw new Error("O histórico veio incompleto.");
  const novo: HistoricoGuardado = { coletadoEm: ctx.agora().getTime(), hash: r.hash, total: r.total, andamentos: r.andamentos };
  await ctx.loja.guardarHistorico(novo);
  publicarBlocoInterno(ctx, novo);
  return { andamentos: r.andamentos, coletadoEm: novo.coletadoEm, origem: "rede", aproveitouCache: r.aproveitouCache };
}
