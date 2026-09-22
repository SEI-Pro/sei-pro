/**
 * Leitura de literais JavaScript embutidos no HTML do SEI.
 *
 * Boa parte do estado útil do SEI não está no DOM, e sim em chamadas geradas
 * pelo servidor dentro de `<script>`: `new infraArvoreNo("DOCUMENTO", ...)`,
 * `Nos[3].acoes = '...'`, `new infraArvoreAcao(...)`. Casar isso com regex por
 * campo quebra no primeiro título com vírgula ou aspas escapadas — a árvore
 * de teste tem `Relatório D2 depois - \&quot;aspas curvas\&quot;`. Aqui há um
 * leitor de verdade para a gramática mínima que o SEI emite: strings com aspas
 * simples ou duplas e escapes, `null`, `true`, `false` e números.
 */

import { decodificarEntidades } from "./dom";

export type Literal = string | number | boolean | null;

const ESCAPES: Record<string, string> = { n: "\n", r: "\r", t: "\t", b: "\b", f: "\f", v: "\v", "0": "\0" };

/** Lê uma string JS a partir da aspa em `i`. Devolve o valor e o índice após a aspa final. */
export function lerString(fonte: string, i: number): [string, number] {
  const aspa = fonte[i];
  let s = "";
  i += 1;
  while (i < fonte.length) {
    const c = fonte[i];
    if (c === "\\") {
      const n = fonte[i + 1];
      if (n === "u" && /^[0-9a-fA-F]{4}$/.test(fonte.slice(i + 2, i + 6))) {
        s += String.fromCharCode(parseInt(fonte.slice(i + 2, i + 6), 16));
        i += 6;
        continue;
      }
      s += ESCAPES[n] ?? n; // \" \' \\ \/ e o "\&" que o SEI emite viram o próprio caractere
      i += 2;
      continue;
    }
    if (c === aspa) return [s, i + 1];
    s += c;
    i += 1;
  }
  return [s, i];
}

/**
 * Lê a lista de argumentos que começa logo após o `(` em `inicio`.
 * Devolve os argumentos e o índice após o `)`.
 */
export function lerArgumentos(fonte: string, inicio: number): [Literal[], number] {
  const args: Literal[] = [];
  let i = inicio;
  while (i < fonte.length) {
    const c = fonte[i];
    if (c === ")") return [args, i + 1];
    if (c === "," || /\s/.test(c)) {
      i += 1;
      continue;
    }
    if (c === '"' || c === "'") {
      const [s, j] = lerString(fonte, i);
      args.push(s);
      i = j;
      continue;
    }
    const m = /^(null|true|false|-?\d+(?:\.\d+)?)/.exec(fonte.slice(i, i + 32));
    if (m) {
      const t = m[1];
      args.push(t === "null" ? null : t === "true" ? true : t === "false" ? false : Number(t));
      i += t.length;
      continue;
    }
    // Expressão que não é literal (variável, concatenação): registra como null e pula até a vírgula.
    let profundidade = 0;
    while (i < fonte.length) {
      const d = fonte[i];
      if (d === "(") profundidade += 1;
      else if (d === ")") {
        if (profundidade === 0) break;
        profundidade -= 1;
      } else if (d === "," && profundidade === 0) break;
      i += 1;
    }
    args.push(null);
  }
  return [args, i];
}

/** Todas as chamadas `new Nome(...)` (ou `Nome(...)`) de um texto, com os argumentos lidos. */
export function chamadas(fonte: string, nome: string): Literal[][] {
  const saida: Literal[][] = [];
  const re = new RegExp(`\\b${nome}\\(`, "g");
  for (const m of fonte.matchAll(re)) {
    const [args] = lerArgumentos(fonte, m.index! + m[0].length);
    saida.push(args);
  }
  return saida;
}

/** Texto de um literal, com entidades HTML decodificadas. */
export function texto(v: Literal | undefined): string {
  return typeof v === "string" ? decodificarEntidades(v) : v == null ? "" : String(v);
}
