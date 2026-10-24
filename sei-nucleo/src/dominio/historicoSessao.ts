/**
 * Estado do histórico na SESSÃO do SEI, e quem o protege.
 *
 * Medido no SEI SP de treinamento (4.1.5, 24/10/2026): o SEI guarda na sessão do usuário o tipo (`hdnTipoHistorico`:
 * R resumido, P completo, T total) e a página (`hdnInfraPaginaAtual`) do ÚLTIMO POST do formulário do histórico, e o
 * "Consultar Andamento" aberto depois, em qualquer aba e de qualquer processo, abre nesse estado. Coletar o histórico
 * completo deixava o andamento nativo no tipo completo, na última página ("101 a 150"). Quem percorre o histórico
 * por POST precisa devolver a sessão ao que estava antes (`restaurar`), e só uma coleta por vez pode mexer nela.
 *
 * Duas proteções, ambas de fora do JavaScript da página:
 * - exclusão entre todas as abas e quadros da mesma origem (`navigator.locks`, que o navegador solta sozinho se a
 *   aba morre; sem ele, uma fila dentro do contexto);
 * - pendência de restauro em `localStorage`: gravada ANTES do primeiro POST e apagada depois do restauro. Se a aba
 *   morrer no meio, a próxima coleta (já dentro da exclusão, então o dono anterior não existe mais) restaura primeiro
 *   o estado de antes. Só vale por pouco tempo: depois disso o usuário pode ter escolhido outro estado de propósito.
 *
 * Substitui no legado: `registrarColetaHistoricoPro`, `restaurarColetasInterrompidasPro`, `instalarRestauroAoSairPro`,
 * `outraColetaHistoricoEmCursoPro` e `restaurarPaginacaoHistoricoPro`.
 */

import { comoErroSei } from "../sessao/erros";

const NOME_EXCLUSAO = "seipro-historico-sessao";
const CHAVE_PENDENCIA = "seiProHistoricoRestauro";
const VALIDADE_PENDENCIA_MS = 10 * 60 * 1000;

export interface EstadoHistorico {
  tipo: string;
  pagina: string;
}

interface Pendencia extends EstadoHistorico {
  host: string;
  em: number;
}

/** O mínimo de `Storage` de que se precisa (injetável nos testes). */
export interface ArmazemPendencia {
  getItem(chave: string): string | null;
  setItem(chave: string, valor: string): void;
  removeItem(chave: string): void;
}

let armazemInjetado: ArmazemPendencia | null | undefined;

/** Testes: troca o armazém (`null` desliga a pendência). `undefined` volta ao `localStorage` do contexto. */
export function definirArmazemPendenciaHistorico(a: ArmazemPendencia | null | undefined): void {
  armazemInjetado = a;
}

function armazem(): ArmazemPendencia | null {
  if (armazemInjetado !== undefined) return armazemInjetado;
  try {
    return typeof localStorage !== "undefined" ? localStorage : null;
  } catch {
    return null;
  }
}

export function gravarPendenciaHistorico(host: string, estado: EstadoHistorico, agora = Date.now()): void {
  try {
    const p: Pendencia = { host, tipo: estado.tipo, pagina: estado.pagina, em: agora };
    armazem()?.setItem(CHAVE_PENDENCIA, JSON.stringify(p));
  } catch {
    // Cota ou armazenamento bloqueado: sem pendência, o restauro normal continua valendo.
  }
}

export function limparPendenciaHistorico(): void {
  try {
    armazem()?.removeItem(CHAVE_PENDENCIA);
  } catch {
    // idem
  }
}

/** O estado que uma coleta interrompida deixou de restaurar neste `host`, se ainda valer. */
export function lerPendenciaHistorico(host: string, agora = Date.now()): EstadoHistorico | null {
  try {
    const bruto = armazem()?.getItem(CHAVE_PENDENCIA);
    if (!bruto) return null;
    const p = JSON.parse(bruto) as Partial<Pendencia>;
    if (p.host !== host || typeof p.tipo !== "string" || typeof p.pagina !== "string" || typeof p.em !== "number") return null;
    if (agora - p.em > VALIDADE_PENDENCIA_MS) return null;
    return { tipo: p.tipo, pagina: p.pagina };
  } catch {
    return null;
  }
}

let cadeiaLocal: Promise<unknown> = Promise.resolve();

/**
 * Roda `fn` sozinho em toda a origem. Cancelar enquanto espera a vez lança `ErroSei("CANCELADO")` e `fn` não roda.
 */
export function emExclusaoDoHistorico<T>(fn: () => Promise<T>, sinal?: AbortSignal): Promise<T> {
  const locks = typeof navigator !== "undefined" ? (navigator as Navigator & { locks?: LockManager }).locks : undefined;
  if (locks?.request) {
    const pedido = locks.request(NOME_EXCLUSAO, sinal ? { signal: sinal } : {}, fn) as Promise<T>;
    return pedido.catch((e: unknown) => {
      throw comoErroSei(e);
    });
  }
  const vez = cadeiaLocal.then(() => {
    if (sinal?.aborted) throw comoErroSei(new DOMException("cancelado", "AbortError"));
    return fn();
  });
  cadeiaLocal = vez.catch(() => undefined);
  return vez;
}
