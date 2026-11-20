/**
 * Diff em duas fases, puro (roda no Worker): blocos iguais passam direto (fase 1); nos trechos que mudaram, blocos
 * parecidos são pareados e só neles se faz diff de palavras (fase 2). A saída diz, para cada bloco do "depois", o
 * HTML final do seu conteúdo e, à parte, os blocos que só existiam no "antes" e onde inseri-los.
 */
import { alinharBlocos } from "./alinhar";
import type { Bloco } from "./blocos";
import { COR_ACRESCENTADO, COR_REMOVIDO } from "./constantes";
import { diffPalavras } from "./palavras";

export interface Edicao {
  /** Conteúdo final de cada bloco do "depois" (mesma ordem). */
  depois: string[];
  /** Blocos só do "antes", como bloco completo (<p><del>..</del></p>), a inserir antes do bloco `antesDe` do "depois". */
  removidos: Array<{ antesDe: number; html: string }>;
}

/** Semelhança mínima (Jaccard de palavras) para tratar dois blocos como o mesmo bloco editado. */
export const LIMIAR_PAREAMENTO = 0.5;
/** Quantos blocos do "antes" olhar à frente ao procurar o par de um bloco do "depois". */
const JANELA = 12;

const palavras = (t: string): Set<string> => new Set(t.toLowerCase().split(" ").filter(Boolean));

function jaccard(a: Set<string>, b: Set<string>): number {
  if (!a.size && !b.size) return 1;
  let comum = 0;
  const [menor, maior] = a.size <= b.size ? [a, b] : [b, a];
  for (const p of menor) if (maior.has(p)) comum++;
  return comum / (a.size + b.size - comum);
}

const novo = (html: string): string => `<ins style="${COR_ACRESCENTADO}">${html}</ins>`;
const removido = (html: string): string => `<p><del style="${COR_REMOVIDO}">${html}</del></p>`;

export function compararBlocos(antes: Bloco[], depois: Bloco[]): Edicao {
  const saida: Edicao = { depois: depois.map((b) => b.html), removidos: [] };
  const conjAntes = new Map<number, Set<string>>();
  const conjA = (i: number): Set<string> => {
    let c = conjAntes.get(i);
    if (!c) {
      c = palavras(antes[i]!.texto);
      conjAntes.set(i, c);
    }
    return c;
  };

  const trecho = (a0: number, a1: number, d0: number, d1: number): void => {
    // Mesmo número de blocos dos dois lados, entre blocos iguais: são edições, pareadas posição a posição (blocos curtos,
    // como "R$ 1.000,00" -> "R$ 1.200,00" ou "Deferido" -> "Indeferido", nunca passam do limiar de semelhança).
    if (a1 > a0 && a1 - a0 === d1 - d0) {
      for (let k = 0; k < a1 - a0; k++) saida.depois[d0 + k] = diffPalavras(antes[a0 + k]!.html, depois[d0 + k]!.html);
      return;
    }
    let cursor = a0;
    let ultimoPar = d0 - 1;
    for (let d = d0; d < d1; d++) {
      const conjD = palavras(depois[d]!.texto);
      let melhor = -1;
      let nota = LIMIAR_PAREAMENTO;
      for (let a = cursor; a < Math.min(a1, cursor + JANELA); a++) {
        const n = jaccard(conjA(a), conjD);
        // O primeiro entre os de mesma nota fica (o ">=" sozinho escolheria o último e deslocaria os pares seguintes).
        if (melhor < 0 ? n >= nota : n > nota) {
          nota = n;
          melhor = a;
        }
      }
      if (melhor >= 0) {
        for (let a = cursor; a < melhor; a++) saida.removidos.push({ antesDe: d, html: removido(antes[a]!.html) });
        saida.depois[d] = diffPalavras(antes[melhor]!.html, depois[d]!.html);
        cursor = melhor + 1;
        ultimoPar = d;
      } else saida.depois[d] = novo(depois[d]!.html);
    }
    // O que sobrou do "antes" entra antes dos blocos inseridos que vêm depois do último par (retirado antes do acrescentado).
    for (let a = cursor; a < a1; a++) saida.removidos.push({ antesDe: ultimoPar + 1, html: removido(antes[a]!.html) });
  };

  let a = 0;
  let d = 0;
  for (const p of alinharBlocos(antes, depois).iguais) {
    trecho(a, p.antes, d, p.depois);
    a = p.antes + 1;
    d = p.depois + 1;
  }
  trecho(a, antes.length, d, depois.length);
  return saida;
}
