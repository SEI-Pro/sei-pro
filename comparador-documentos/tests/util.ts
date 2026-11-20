import { checar } from "../../sei-comum/tests/util";

export * from "../../sei-comum/tests/util";

/** Compara por valor (JSON) e mostra o obtido na falha; undefined e ausente contam como iguais. */
export function igual(nome: string, obtido: unknown, esperado: unknown): void {
  checar(nome, JSON.stringify(obtido) === JSON.stringify(esperado), { obtido, esperado });
}

/** O seletor inteligente (combobox) pelo rótulo. */
export function combo(raiz: ParentNode, rotulo: string): HTMLButtonElement | null {
  return raiz.querySelector<HTMLButtonElement>(`button[role="combobox"][aria-label="${rotulo}"]`);
}

/** Escolhe uma opção do seletor: abre e clica a opção pelo valor. */
export function escolherCombo(raiz: ParentNode, rotulo: string, valor: string): void {
  const b = combo(raiz, rotulo);
  if (!b) throw new Error(`seletor "${rotulo}" não encontrado`);
  if (b.getAttribute("aria-expanded") !== "true") b.click();
  const op = b.ownerDocument.querySelector<HTMLElement>(`.spro-combo-pop [role="option"][data-valor="${valor}"]`);
  if (!op) throw new Error(`opção "${valor}" não encontrada em "${rotulo}"`);
  op.click();
  if (b.getAttribute("aria-expanded") === "true") b.click();
}
