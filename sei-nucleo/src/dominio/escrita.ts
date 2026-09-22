/**
 * Convenção de toda operação de escrita do núcleo.
 *
 * A MESMA função calcula a prévia e grava: com `aplicar: false` ela abre a
 * tela, lê o estado atual e devolve o "antes → depois" sem enviar nada; com
 * `aplicar: true` segue até o POST e a prova de sucesso. Ter um caminho só é
 * o que garante que a prévia mostrada ao usuário é exatamente o que será
 * gravado — duas funções divergiriam com o tempo.
 */

export interface OpcoesEscrita {
  aplicar: boolean;
  sinal?: AbortSignal;
}

export interface ResultadoEscrita {
  /** Protocolo do processo ou nº SEI do documento afetado. */
  alvo: string;
  /** Campo a campo, o que muda. Vazio quando nada mudaria. */
  mudancas: Array<{ campo: string; antes: string; depois: string }>;
  aplicado: boolean;
  /** Mensagem curta para humanos (e para o modelo). */
  resumo: string;
  /** Dados extras (ex.: número do documento criado). */
  dados?: Record<string, string>;
}

export function mudanca(campo: string, antes: string | undefined, depois: string | undefined): ResultadoEscrita["mudancas"] {
  const a = (antes ?? "").trim();
  const d = (depois ?? "").trim();
  return depois === undefined || a === d ? [] : [{ campo, antes: a, depois: d }];
}

export const NIVEIS: Record<string, string> = { publico: "0", restrito: "1" };
export const NOME_NIVEL: Record<string, string> = { "0": "P\u00FAblico", "1": "Restrito", "2": "Sigiloso" };
