/**
 * Exibição da árvore: cruza as entidades (pastas + vínculos) com a lista real de
 * itens do SEI. Puro, sem DOM e sem área — testável à parte.
 *
 * Regras: item sem vínculo (ou com vínculo para pasta inexistente/removida) cai
 * em "Sem pasta"; vínculo cujo item não está mais na lista é órfão; pasta cujo
 * pai sumiu vira raiz.
 */

import type { ItemBase } from "../nucleo/tipos";
import type { EntidadesArvore, Vinculo } from "./modelo";
import { nomeNumerado, numeroDaPasta } from "./numeracao";

export interface PastaExibida {
  id: string;
  nome: string;
  /** Pai efetivo (null quando a original sumiu). */
  pai: string | null;
  ordem: string;
  filhas: PastaExibida[];
  /** Vínculos diretos (não conta subpastas). */
  contagem: number;
}

export interface Exibicao {
  /** Raízes, ordenadas por índice fracionário. */
  pastas: PastaExibida[];
  /** Itens sem pasta viva, na ordem em que vieram do SEI. */
  semPasta: ItemBase[];
  /** Vínculos cujo item não está mais na lista. */
  orfaos: Vinculo[];
}

const porOrdem = <T extends { ordem: string }>(a: T, b: T): number => (a.ordem < b.ordem ? -1 : a.ordem > b.ordem ? 1 : 0);

export function montarExibicao(ent: EntidadesArvore, itens: ItemBase[]): Exibicao {
  const vivas = ent.p.filter((p) => p.removidoEm === undefined);
  const idsVivos = new Set(vivas.map((p) => p.id));
  const mapa = new Map<string, PastaExibida>();
  for (const p of vivas) {
    mapa.set(p.id, {
      id: p.id,
      nome: p.nome,
      pai: p.pai !== null && idsVivos.has(p.pai) ? p.pai : null,
      ordem: p.ordem,
      filhas: [],
      contagem: 0,
    });
  }
  for (const e of mapa.values()) if (e.pai !== null) mapa.get(e.pai)?.filhas.push(e);

  const ordenar = (lista: PastaExibida[]): void => {
    lista.sort(porOrdem);
    for (const f of lista) ordenar(f.filhas);
  };
  const raizes = [...mapa.values()].filter((e) => e.pai === null);
  ordenar(raizes);

  const porAgrupador = new Map(itens.map((i) => [i.agrupador, i]));
  const destino = new Map<string, string | null>();
  const orfaos: Vinculo[] = [];
  for (const v of ent.v) {
    if (v.removidoEm !== undefined) continue;
    if (!porAgrupador.has(v.id)) {
      orfaos.push(v);
      continue;
    }
    const alvo = v.pasta !== null && mapa.has(v.pasta) ? v.pasta : null;
    destino.set(v.id, alvo);
    if (alvo !== null) {
      const pasta = mapa.get(alvo);
      if (pasta) pasta.contagem += 1;
    }
  }

  const semPasta = itens.filter((i) => (destino.get(i.agrupador) ?? null) === null);
  return { pastas: raizes, semPasta, orfaos };
}

/** Vínculos cujo título em cache difere do título real do item (para atualizar). */
export function vinculosDesatualizados(ent: EntidadesArvore, itens: ItemBase[]): Vinculo[] {
  const porAgrupador = new Map(itens.map((i) => [i.agrupador, i.titulo]));
  return ent.v.filter((v) => v.removidoEm === undefined && porAgrupador.has(v.id) && porAgrupador.get(v.id) !== v.titulo);
}

/** "Fiscalizacao › Notas Tecnicas" (raízes até a pasta); "" se a pasta não está na árvore. Com `numerar`, cada segmento ganha o número de ordem ("1. Fiscalizacao › 1.1. Notas Tecnicas"). */
export function caminhoDaPasta(pastas: PastaExibida[], id: string, numerar = false): string {
  const mapa = new Map<string, PastaExibida>();
  const indexar = (lista: PastaExibida[]): void => {
    for (const p of lista) {
      mapa.set(p.id, p);
      indexar(p.filhas);
    }
  };
  indexar(pastas);

  let atual = mapa.get(id);
  if (!atual) return "";
  const nomes: string[] = [];
  const vistos = new Set<string>();
  while (atual && !vistos.has(atual.id)) {
    vistos.add(atual.id);
    nomes.unshift(numerar ? nomeNumerado(atual.nome, numeroDaPasta(pastas, atual.id)) : atual.nome);
    atual = atual.pai !== null ? mapa.get(atual.pai) : undefined;
  }
  return nomes.join(" › ");
}
