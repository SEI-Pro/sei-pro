/**
 * Verificacao dos icones.
 *
 * POR QUE ISTO EXISTE: a extensao embarca o Font Awesome 5, e os nomes de
 * classe mudaram no 6 (`fa-scissors`, `fa-magnifying-glass`,
 * `fa-triangle-exclamation`...). Usar um nome do 6 NAO da erro: a folha de
 * estilo ate tem a regra, mas sem glifo, e o icone simplesmente nao aparece.
 * Foi o que aconteceu com treze classes de uma vez, e so tres estavam em lugar
 * visivel o bastante para alguem reparar.
 *
 * A conferencia le as classes direto do codigo-fonte e as procura no CSS que a
 * extensao carrega, entao acompanha o codigo sem ninguem precisar manter lista.
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const AQUI = dirname(fileURLToPath(import.meta.url));
const SRC = resolve(AQUI, "..", "src");
const CSS = resolve(AQUI, "..", "..", "dist", "css", "fontawesome.pro.min.css");

let passou = 0;
let falhou = 0;

function checar(nome: string, condicao: boolean, detalhe?: string) {
  if (condicao) {
    passou += 1;
    console.log(`  ok    ${nome}`);
  } else {
    falhou += 1;
    console.log(`  FALHA ${nome}${detalhe ? ` -- ${detalhe}` : ""}`);
  }
}

function arquivosTs(dir: string): string[] {
  const saida: string[] = [];
  for (const item of readdirSync(dir)) {
    const caminho = join(dir, item);
    if (statSync(caminho).isDirectory()) saida.push(...arquivosTs(caminho));
    else if (item.endsWith(".ts")) saida.push(caminho);
  }
  return saida;
}

/** Nomes de icone usados no codigo, sem os modificadores de estilo. */
function iconesUsados(): Set<string> {
  const usados = new Set<string>();
  for (const arquivo of arquivosTs(SRC)) {
    const texto = readFileSync(arquivo, "utf8");
    for (const m of texto.matchAll(/"(?:fas|far|fad|fab|fal) ((?:fa-[a-z0-9-]+\s*)+)"/g)) {
      for (const classe of m[1].trim().split(/\s+/)) {
        // `fa-spin` e animacao, nao icone: nao tem glifo proprio.
        if (classe !== "fa-spin" && classe !== "fa-fw") usados.add(classe);
      }
    }
  }
  return usados;
}

/**
 * Icones que a folha de estilo desenha de verdade.
 *
 * Vale so o que tem `content` com um caractere real. O Font Awesome 5 declara
 * regras para nomes do 6 com content vazio, e e exatamente essa a armadilha.
 */
function iconesComGlifo(): Set<string> {
  const css = readFileSync(CSS, "utf8");
  const comGlifo = new Set<string>();
  for (const m of css.matchAll(/\.(fa-[a-z0-9-]+):before\s*\{\s*content:\s*"([^"]*)"/g)) {
    if (m[2] && m[2] !== "") comGlifo.add(m[1]);
  }
  // Formato agrupado: `.fa-a:before,.fa-b:before{content:"\f000"}`
  for (const m of css.matchAll(/((?:\.fa-[a-z0-9-]+:before,?)+)\{content:"([^"]*)"\}/g)) {
    if (!m[2]) continue;
    for (const sel of m[1].split(",")) {
      const nome = sel.trim().replace(":before", "").replace(".", "");
      if (nome.startsWith("fa-")) comGlifo.add(nome);
    }
  }
  return comGlifo;
}

const usados = iconesUsados();
const disponiveis = iconesComGlifo();

console.log("\n== icones ==");
console.log(`  (${usados.size} usados no codigo, ${disponiveis.size} desenhaveis na fonte embarcada)`);

checar("o CSS do Font Awesome foi lido", disponiveis.size > 500, `${disponiveis.size} icones`);

const semGlifo = [...usados].filter((i) => !disponiveis.has(i)).sort();
checar(
  "todo icone usado existe na versao embarcada",
  semGlifo.length === 0,
  semGlifo.length ? `sem glifo: ${semGlifo.join(", ")}` : undefined,
);

// Trava explicita nos nomes que ja quebraram uma vez: se alguem trouxer um
// trecho de codigo escrito para o Font Awesome 6, isto acusa na hora.
const NOMES_DO_FA6 = [
  "fa-scissors",
  "fa-magnifying-glass",
  "fa-triangle-exclamation",
  "fa-circle-check",
  "fa-arrows-up-down-left-right",
  "fa-shield-halved",
  "fa-rotate-right",
];
const reincidentes = NOMES_DO_FA6.filter((n) => usados.has(n));
checar(
  "nenhum nome do Font Awesome 6 voltou ao codigo",
  reincidentes.length === 0,
  reincidentes.join(", "),
);

console.log(`\n${passou} conferem, ${falhou} falham\n`);
process.exit(falhou === 0 ? 0 : 1);
