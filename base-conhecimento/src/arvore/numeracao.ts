/**
 * Numeradores de ordem da árvore exibida: "1", "1.2", "1.2.3" (posição dos
 * irmãos, 1-based, na ordem em que a árvore é exibida). Só apresentação: o
 * número é recalculado a cada exibição; nada é gravado no Texto Padrão.
 */

import type { PastaExibida } from "./mesclar";

function indexar(pastas: PastaExibida[], mapa = new Map<string, PastaExibida>(), vistos = new Set<string>()): Map<string, PastaExibida> {
  for (const p of pastas) {
    // Árvore malformada: não entrar em ciclo.
    if (vistos.has(p.id)) continue;
    vistos.add(p.id);
    mapa.set(p.id, p);
    indexar(p.filhas, mapa, vistos);
  }
  return mapa;
}

/** "1", "1.2", "2.1.3" (posição dos irmãos, 1-based); "" se a pasta não está na árvore. */
export function numeroDaPasta(pastas: PastaExibida[], id: string): string {
  const mapa = indexar(pastas);
  let atual: PastaExibida | undefined = mapa.get(id);
  if (!atual) return "";

  const posicoes: number[] = [];
  const vistos = new Set<string>();
  while (atual) {
    // Árvore malformada (ciclo de pais): sem posição possível.
    if (vistos.has(atual.id)) return "";
    vistos.add(atual.id);

    const irmaos = atual.pai === null ? pastas : mapa.get(atual.pai)?.filhas;
    const i = irmaos ? irmaos.findIndex((p) => p.id === atual?.id) : -1;
    // Pai fora da árvore: a cadeia não fecha na raiz.
    if (i < 0) return "";
    posicoes.unshift(i + 1);
    if (atual.pai === null) break;
    atual = mapa.get(atual.pai);
  }
  return posicoes.join(".");
}

/** "1.2. Fiscalização" quando há número; senão o próprio nome. */
export function nomeNumerado(nome: string, numero: string): string {
  return numero === "" ? nome : `${numero}. ${nome}`;
}
