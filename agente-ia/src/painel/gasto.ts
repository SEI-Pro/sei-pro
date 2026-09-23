/**
 * Teto de gasto.
 *
 * Um agente que lê documentos longos gasta rápido, e a conta chega para o
 * usuário. O teto é uma trava simples e previsível: por conversa e por dia,
 * em reais (é a moeda de quem usa; a conversão usa a cotação do painel).
 *
 * A contagem do dia fica no navegador, por serviço e chave — ninguém manda
 * nada para fora só para saber quanto já se gastou.
 */

const CHAVE = "agenteIA_gastoDiario";

export interface Limites {
  /** Teto por conversa, em reais. 0 = sem limite. */
  conversa: number;
  /** Teto por dia, em reais. 0 = sem limite. */
  dia: number;
}

export const SEM_LIMITE: Limites = { conversa: 0, dia: 0 };

interface RegistroDoDia {
  dia: string;
  reais: number;
}

const hoje = (agora = new Date()): string => agora.toISOString().slice(0, 10);

export async function gastoDeHoje(agora = new Date()): Promise<number> {
  try {
    const v = await chrome.storage.local.get(CHAVE);
    const r = v?.[CHAVE] as RegistroDoDia | undefined;
    return r && r.dia === hoje(agora) ? r.reais : 0;
  } catch {
    return 0;
  }
}

/** Soma ao acumulado do dia (e zera sozinho quando vira o dia). */
export async function somarGastoDoDia(reais: number, agora = new Date()): Promise<number> {
  if (!Number.isFinite(reais) || reais <= 0) return gastoDeHoje(agora);
  const atual = await gastoDeHoje(agora);
  const total = atual + reais;
  await chrome.storage.local.set({ [CHAVE]: { dia: hoje(agora), reais: total } satisfies RegistroDoDia });
  return total;
}

export type Veredito =
  | { permite: true; aviso?: string }
  | { permite: false; motivo: string };

/**
 * Decide se cabe mais uma pergunta.
 *
 * A conta é feita ANTES de enviar, com o que já foi gasto: o custo da rodada
 * que vem só se conhece depois. Por isso o aviso em 80% — é ele que dá tempo
 * de terminar o que está fazendo antes da trava.
 */
export function cabeMaisUma(limites: Limites, gastoConversa: number, gastoDia: number): Veredito {
  const formatar = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  if (limites.conversa > 0 && gastoConversa >= limites.conversa) {
    return {
      permite: false,
      motivo: `Esta conversa já gastou ${formatar(gastoConversa)}, no limite de ${formatar(limites.conversa)} que você definiu. Comece uma conversa nova ou aumente o limite nas configurações.`,
    };
  }
  if (limites.dia > 0 && gastoDia >= limites.dia) {
    return {
      permite: false,
      motivo: `Hoje já foram gastos ${formatar(gastoDia)}, no limite diário de ${formatar(limites.dia)} que você definiu. O limite volta a zerar amanhã, e dá para mudá-lo nas configurações.`,
    };
  }
  const perto = (gasto: number, teto: number) => teto > 0 && gasto >= teto * 0.8;
  if (perto(gastoConversa, limites.conversa)) {
    return { permite: true, aviso: `Esta conversa está perto do limite: ${formatar(gastoConversa)} de ${formatar(limites.conversa)}.` };
  }
  if (perto(gastoDia, limites.dia)) {
    return { permite: true, aviso: `O gasto de hoje está perto do limite: ${formatar(gastoDia)} de ${formatar(limites.dia)}.` };
  }
  return { permite: true };
}
