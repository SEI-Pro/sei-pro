/** Mensagens entre a página e o Worker da comparação, e o tratador puro (testável sem Worker). */
import type { Bloco } from "@cd/modelo/blocos";
import { compararBlocos, type Edicao } from "@cd/modelo/diff";

export interface Pedido {
  id: number;
  antes: Bloco[];
  depois: Bloco[];
}

export type Resposta = { id: number; ok: true; edicao: Edicao } | { id: number; ok: false; erro: string };

export function tratar(p: Pedido): Resposta {
  try {
    return { id: p.id, ok: true, edicao: compararBlocos(p.antes, p.depois) };
  } catch (e) {
    return { id: p.id, ok: false, erro: e instanceof Error ? e.message : String(e) };
  }
}
