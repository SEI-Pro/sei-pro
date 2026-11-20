import { checar } from "../../sei-comum/tests/util";

export * from "../../sei-comum/tests/util";

/** Compara por valor (JSON) e mostra o obtido na falha; undefined e ausente contam como iguais. */
export function igual(nome: string, obtido: unknown, esperado: unknown): void {
  checar(nome, JSON.stringify(obtido) === JSON.stringify(esperado), { obtido, esperado });
}
