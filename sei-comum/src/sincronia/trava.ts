/**
 * Uma aba sincroniza por vez: Web Locks, quando a página tem. O SEI servido
 * por HTTP não tem (não é contexto seguro): aí a função roda direto e quem
 * protege é a comparação de conteúdo do motor (conteúdo igual não é regravado).
 */

import { pedirTrava } from "./locksFirefox";

export type Travar = <T>(nome: string, fn: () => Promise<T>) => Promise<T | null>;
export type TravarEsperando = <T>(nome: string, fn: () => Promise<T>) => Promise<T>;
export type GerenteDeTravas = Pick<LockManager, "request">;

function locksDaPagina(): GerenteDeTravas | null {
  return (globalThis.navigator as (Navigator & { locks?: LockManager }) | undefined)?.locks ?? null;
}

/** Roda `fn` com a trava; devolve null se outra aba já está com ela. `locks: null` = página sem Web Locks. */
export function travarComLocks<T>(nome: string, fn: () => Promise<T>, locks: GerenteDeTravas | null = locksDaPagina()): Promise<T | null> {
  if (!locks) return fn();
  return pedirTrava(
    locks as Parameters<typeof pedirTrava>[0],
    nome,
    { ifAvailable: true },
    async (lock): Promise<T | null> => (lock ? fn() : null),
  );
}

/** A mesma trava, esperando a vez (o "apagar do SEI" nunca pode ser pulado). */
export function travarEsperando<T>(nome: string, fn: () => Promise<T>, locks: GerenteDeTravas | null = locksDaPagina()): Promise<T> {
  if (!locks) return fn();
  return pedirTrava(locks as Parameters<typeof pedirTrava>[0], nome, null, () => fn());
}
