/**
 * Fase 1: alinhamento dos blocos por texto idêntico (LCS sobre ids inteiros). Poda prefixo e sufixo iguais (o caso
 * comum: quase tudo igual), resolve o miolo por programação dinâmica quando é pequeno e, quando é grande, por âncoras
 * (itens únicos nos dois lados, em ordem crescente) com recursão nos intervalos entre elas.
 */
import type { Bloco } from "./blocos";

export interface Par {
  antes: number;
  depois: number;
}

/** Acima disto (células da tabela), o miolo usa âncoras em vez da tabela inteira. */
const LIMITE_TABELA = 4_000_000;

export function lcsIndices(a: number[], b: number[]): Par[] {
  const pares: Par[] = [];
  resolver(a, b, 0, a.length, 0, b.length, pares);
  return pares;
}

function resolver(a: number[], b: number[], a0: number, a1: number, b0: number, b1: number, saida: Par[]): void {
  let ini = 0;
  while (a0 + ini < a1 && b0 + ini < b1 && a[a0 + ini] === b[b0 + ini]) ini++;
  for (let k = 0; k < ini; k++) saida.push({ antes: a0 + k, depois: b0 + k });
  a0 += ini;
  b0 += ini;
  let fim = 0;
  while (a1 - fim > a0 && b1 - fim > b0 && a[a1 - 1 - fim] === b[b1 - 1 - fim]) fim++;
  const a1m = a1 - fim;
  const b1m = b1 - fim;
  if (a1m > a0 && b1m > b0) {
    if ((a1m - a0) * (b1m - b0) <= LIMITE_TABELA) tabela(a, b, a0, a1m, b0, b1m, saida);
    else ancoras(a, b, a0, a1m, b0, b1m, saida);
  }
  for (let k = 0; k < fim; k++) saida.push({ antes: a1m + k, depois: b1m + k });
}

function tabela(a: number[], b: number[], a0: number, a1: number, b0: number, b1: number, saida: Par[]): void {
  const n = a1 - a0;
  const m = b1 - b0;
  const larg = m + 1;
  const t = new Uint32Array((n + 1) * larg);
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      t[i * larg + j] = a[a0 + i] === b[b0 + j] ? t[(i + 1) * larg + j + 1]! + 1 : Math.max(t[(i + 1) * larg + j]!, t[i * larg + j + 1]!);
    }
  }
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (a[a0 + i] === b[b0 + j]) {
      saida.push({ antes: a0 + i, depois: b0 + j });
      i++;
      j++;
    } else if (t[(i + 1) * larg + j]! >= t[i * larg + j + 1]!) i++;
    else j++;
  }
}

/** Âncoras: ids que aparecem uma vez em cada lado; a maior subsequência crescente delas divide o problema. */
function ancoras(a: number[], b: number[], a0: number, a1: number, b0: number, b1: number, saida: Par[]): void {
  const contaA = new Map<number, number>();
  for (let i = a0; i < a1; i++) contaA.set(a[i]!, (contaA.get(a[i]!) ?? 0) + 1);
  const contaB = new Map<number, number>();
  for (let j = b0; j < b1; j++) contaB.set(b[j]!, (contaB.get(b[j]!) ?? 0) + 1);
  const posB = new Map<number, number>();
  for (let j = b0; j < b1; j++) if (contaB.get(b[j]!) === 1 && contaA.get(b[j]!) === 1) posB.set(b[j]!, j);
  // Pares (i, j) em ordem de i; LIS por j.
  const cand: Par[] = [];
  for (let i = a0; i < a1; i++) {
    const j = posB.get(a[i]!);
    if (j !== undefined) cand.push({ antes: i, depois: j });
  }
  if (!cand.length) return; // sem ancora: o miolo fica como mudado (custo linear em vez de quadratico)
  const cauda: number[] = [];
  const pai: number[] = new Array(cand.length).fill(-1);
  for (let k = 0; k < cand.length; k++) {
    let lo = 0;
    let hi = cauda.length;
    while (lo < hi) {
      const meio = (lo + hi) >> 1;
      if (cand[cauda[meio]!]!.depois < cand[k]!.depois) lo = meio + 1;
      else hi = meio;
    }
    if (lo > 0) pai[k] = cauda[lo - 1]!;
    cauda[lo] = k;
  }
  const cadeia: Par[] = [];
  for (let k = cauda[cauda.length - 1]!; k !== -1; k = pai[k]!) cadeia.push(cand[k]!);
  cadeia.reverse();
  let pa = a0;
  let pb = b0;
  for (const p of cadeia) {
    resolver(a, b, pa, p.antes, pb, p.depois, saida);
    saida.push(p);
    pa = p.antes + 1;
    pb = p.depois + 1;
  }
  resolver(a, b, pa, a1, pb, b1, saida);
}

/** Casa blocos pelo texto idêntico; pares em ordem crescente nos dois lados. */
export function alinharBlocos(antes: Bloco[], depois: Bloco[]): { iguais: Par[] } {
  const ids = new Map<string, number>();
  const id = (t: string): number => {
    let v = ids.get(t);
    if (v === undefined) {
      v = ids.size;
      ids.set(t, v);
    }
    return v;
  };
  return {
    iguais: lcsIndices(
      antes.map((x) => id(x.texto)),
      depois.map((x) => id(x.texto)),
    ),
  };
}
