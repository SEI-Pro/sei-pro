#!/usr/bin/env node
/**
 * Build do Processo.
 *
 *   dist/js/init_processo_arvore.js  content script do quadro da arvore (IIFE, mundo isolado)   [src/pagina/main.ts]
 *   dist/js/init_processo_capa.js    content script do quadro do visualizador (IIFE)            [src/capa/main.ts]
 * O CSS (sei-comum/src/ui/base.css + estatico/processo.css) vai DENTRO do JS, como texto, e entra numa <style>.
 * Entradas que ainda nao existem sao puladas (o pacote cresce por etapas).
 * Portoes: JS todo ASCII; nada de innerHTML & cia; e, no codigo que roda na pagina, nenhum dos enderecos
 * que gravam "Processo recebido" em nome do usuario (procedimento_visualizar, arvore_montar,
 * procedimento_atribuicao_cadastrar): so se le a arvore que o quadro ja tem na tela.
 */
import { build } from "esbuild";
import { existsSync } from "node:fs";
import { mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const AQUI = dirname(fileURLToPath(import.meta.url));
const DIST = resolve(AQUI, "..", "dist");

const comum = {
  bundle: true,
  minify: true,
  target: ["chrome116", "firefox115"],
  charset: "ascii",
  logLevel: "warning",
  legalComments: "none",
  loader: { ".css": "text" },
  banner: { js: "/* GERADO por processo/build.mjs. NAO EDITE ESTE ARQUIVO. Rode: npm run build */" },
};

const ENTRADAS = [
  { fonte: "src/pagina/main.ts", saida: "js/init_processo_arvore.js" },
  { fonte: "src/capa/main.ts", saida: "js/init_processo_capa.js" },
];

// Enderecos/APIs que o codigo que roda na pagina nao pode conter (ver Global Constraints do plano).
const PROIBIDOS = [
  [/\binnerHTML\b|\bouterHTML\b|insertAdjacentHTML/, "HTML por string (use h() de @comum/ui/dom)"],
  [/procedimento_visualizar|arvore_montar|procedimento_atribuicao_cadastrar/, "endereco que grava \"Processo recebido\""],
];

// marca.ts so LE a propria URL para saber se este quadro e o da arvore (acao=procedimento_visualizar); nao busca nada.
const SO_LEITURA_DA_PROPRIA_URL = new Set(["src/pagina/marca.ts"]);

async function fontes(dir) {
  const saida = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) saida.push(...(await fontes(p)));
    else if (p.endsWith(".ts")) saida.push(p);
  }
  return saida;
}

// Portao nas fontes de pagina, antes de gerar.
for (const dir of ["src/pagina", "src/capa", "src/ui", "src/gantt"]) {
  const abs = resolve(AQUI, dir);
  if (!existsSync(abs)) continue;
  for (const f of await fontes(abs)) {
    const codigo = (await readFile(f, "utf8")).replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
    const rel = f.replace(`${AQUI}/`, "");
    for (const [re, motivo] of PROIBIDOS) {
      if (re.test(codigo) && !(SO_LEITURA_DA_PROPRIA_URL.has(rel) && motivo.startsWith("endereco"))) {
        console.error(`ERRO: ${f.replace(AQUI + "/", "")} contem ${motivo}.`);
        process.exit(1);
      }
    }
  }
}

const geradas = [];
for (const { fonte, saida } of ENTRADAS) {
  if (!existsSync(resolve(AQUI, fonte))) continue;
  await mkdir(dirname(join(DIST, saida)), { recursive: true });
  await build({ ...comum, entryPoints: [resolve(AQUI, fonte)], outfile: join(DIST, saida), format: "iife" });
  geradas.push(saida);
}

for (const f of geradas.filter((g) => g.endsWith(".js"))) {
  const bytes = await readFile(join(DIST, f));
  const i = bytes.findIndex((b) => b > 0x7f);
  if (i >= 0) {
    console.error(`ERRO: byte nao-ASCII em dist/${f} (posicao ${i}): ${bytes.subarray(Math.max(0, i - 40), i + 10).toString("utf8")}`);
    process.exit(1);
  }
}

console.log("\nProcesso -- build");
if (!geradas.length) console.log("  (nenhuma entrada ainda)");
for (const f of geradas) console.log(`  ${f.padEnd(30)} ${Math.round((await stat(join(DIST, f))).size / 1024)} KB`);
