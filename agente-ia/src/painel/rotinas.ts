/**
 * Rotinas: perguntas que o agente faz sozinho, de tempos em tempos.
 *
 * "Toda segunda, os processos parados há mais de 30 dias" é trabalho que
 * ninguém lembra de fazer — e é exatamente o tipo de leitura chata que vale
 * automatizar.
 *
 * Um limite que não dá para contornar, e que o usuário precisa entender: a
 * extensão só existe com o navegador aberto e a sessão do SEI viva. Não há
 * servidor do SEI Pro guardando a sua sessão para agir de madrugada — e é
 * bom que não haja. Então "toda segunda às 8h" significa, de verdade, "na
 * primeira vez que você abrir o agente depois das 8h de segunda".
 *
 * Rotina é SÓ LEITURA. Nada que roda sem alguém olhando deve escrever no SEI.
 */

export type Frequencia = "diaria" | "semanal" | "mensal";

export interface Rotina {
  id: string;
  nome: string;
  /** O pedido, como você digitaria na conversa. */
  pergunta: string;
  frequencia: Frequencia;
  /** "08:00" — antes disso no dia, a rotina ainda não está vencida. */
  hora: string;
  /** 1 = segunda ... 7 = domingo (só na semanal). */
  diaSemana?: number;
  /** 1 a 28 (só na mensal). */
  diaMes?: number;
  ativa: boolean;
  ultimaEm?: number;
  /** Resumo da última execução, mostrado na configuração. */
  ultimoResultado?: string;
}

const CHAVE = "agenteIA_rotinas";

export const DIAS = ["segunda", "terça", "quarta", "quinta", "sexta", "sábado", "domingo"];

export async function listarRotinas(): Promise<Rotina[]> {
  try {
    const v = await chrome.storage.local.get(CHAVE);
    const lista = (v?.[CHAVE] as Rotina[]) ?? [];
    return Array.isArray(lista) ? lista : [];
  } catch {
    return [];
  }
}

export async function guardarRotinas(lista: Rotina[]): Promise<void> {
  await chrome.storage.local.set({ [CHAVE]: lista });
}

/** 1 = segunda ... 7 = domingo (o `getDay` do JS começa no domingo). */
const diaDaSemana = (d: Date): number => ((d.getDay() + 6) % 7) + 1;

const minutos = (hora: string): number => {
  const [h, m] = hora.split(":").map((x) => Number(x) || 0);
  return h * 60 + m;
};

/** O momento em que a rotina passou a estar vencida na janela atual, ou `null`. */
export function vencimento(r: Rotina, agora: Date): Date | null {
  const hoje = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate());
  const naHora = new Date(hoje.getTime() + minutos(r.hora) * 60_000);
  if (r.frequencia === "diaria") return agora >= naHora ? naHora : null;
  if (r.frequencia === "semanal") {
    const alvo = r.diaSemana ?? 1;
    // Volta até o último dia da semana pedido (hoje inclusive).
    const atraso = (diaDaSemana(agora) - alvo + 7) % 7;
    const dia = new Date(hoje.getTime() - atraso * 86_400_000);
    const quando = new Date(dia.getTime() + minutos(r.hora) * 60_000);
    return agora >= quando ? quando : null;
  }
  const alvo = Math.min(Math.max(r.diaMes ?? 1, 1), 28);
  const desteMes = new Date(agora.getFullYear(), agora.getMonth(), alvo, 0, 0);
  const quando = new Date(desteMes.getTime() + minutos(r.hora) * 60_000);
  if (agora >= quando) return quando;
  const mesPassado = new Date(agora.getFullYear(), agora.getMonth() - 1, alvo, 0, 0);
  return new Date(mesPassado.getTime() + minutos(r.hora) * 60_000);
}

/**
 * Rotinas que deveriam ter rodado e ainda não rodaram.
 *
 * Quem ficou uma semana de férias volta com UMA execução pendente, não sete:
 * o que interessa é a foto de agora, não o histórico do que não foi visto.
 */
export function vencidas(rotinas: Rotina[], agora = new Date()): Rotina[] {
  return rotinas.filter((r) => {
    if (!r.ativa || !r.pergunta.trim()) return false;
    const quando = vencimento(r, agora);
    return Boolean(quando) && (!r.ultimaEm || r.ultimaEm < (quando as Date).getTime());
  });
}

/** Texto curto de quando a rotina roda, para a lista da configuração. */
export function descreverFrequencia(r: Rotina): string {
  if (r.frequencia === "diaria") return `todo dia, a partir das ${r.hora}`;
  if (r.frequencia === "semanal") return `toda ${DIAS[(r.diaSemana ?? 1) - 1]}, a partir das ${r.hora}`;
  return `todo dia ${r.diaMes ?? 1}, a partir das ${r.hora}`;
}
