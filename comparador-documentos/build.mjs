#!/usr/bin/env node
/**
 * Build do Comparador de Documentos.
 *
 *   dist/js/init_comparador.js           content script (IIFE, mundo isolado, todos os frames)
 *   dist/js/comparador/app.js            app de html/comparador-documentos.html (ESM): janela do comparador
 *   dist/js/comparador/worker.js         Web Worker da comparacao (IIFE)
 *   dist/html/comparador-documentos.html copia de estatico/
 *   dist/css/comparador-documentos.css   sei-comum base + lista + alturaRedimensionavel + estatico/comparador-documentos.css
 * JS todo ASCII (portao de bytes abaixo).
 */
import { build } from "esbuild";
import { existsSync } from "node:fs";
import { copyFile, mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const AQUI = dirname(fileURLToPath(import.meta.url));
const DIST = resolve(AQUI, "..", "dist");

const comum = {
  bundle: true,
  minify: true,
  target: ["chrome116", "firefox115"],
  // Acentos saem como \uXXXX: regra do projeto para JS da extensao.
  charset: "ascii",
  logLevel: "warning",
  legalComments: "none",
  loader: { ".css": "text" },
  banner: { js: "/* GERADO por comparador-documentos/build.mjs. NAO EDITE ESTE ARQUIVO. Rode: npm run build */" },
};

// Entradas previstas. Uma cuja fonte ainda nao existe e pulada com aviso, para o build rodar desde o esqueleto.
const ENTRADAS = [
  { fonte: "src/app/main.ts", saida: "js/comparador/app.js", format: "esm" },
  { fonte: "src/worker/main.ts", saida: "js/comparador/worker.js", format: "iife" },
  { fonte: "src/pagina/main.ts", saida: "js/init_comparador.js", format: "iife" },
];

const SAIDAS = [];
for (const { fonte, saida, format } of ENTRADAS) {
  if (!existsSync(resolve(AQUI, fonte))) {
    console.log(`  (pulado) ${fonte} ainda nao existe; ${saida} nao foi gerado`);
    continue;
  }
  await mkdir(dirname(join(DIST, saida)), { recursive: true });
  await build({ ...comum, entryPoints: [resolve(AQUI, fonte)], outfile: join(DIST, saida), format });
  SAIDAS.push(saida);
}

const PAGINA = resolve(AQUI, "estatico/comparador-documentos.html");
const ESTILO = resolve(AQUI, "estatico/comparador-documentos.css");
const ARQUIVOS = [];
if (existsSync(PAGINA) && existsSync(ESTILO)) {
  await mkdir(join(DIST, "html"), { recursive: true });
  await mkdir(join(DIST, "css"), { recursive: true });
  await copyFile(PAGINA, join(DIST, "html", "comparador-documentos.html"));
  const css = await Promise.all(
    ["../sei-comum/src/ui/base.css", "../sei-comum/src/ui/lista.css", "../sei-comum/src/ui/alturaRedimensionavel.css", "estatico/comparador-documentos.css"].map((f) =>
      readFile(resolve(AQUI, f), "utf8"),
    ),
  );
  await writeFile(join(DIST, "css", "comparador-documentos.css"), `/* GERADO por comparador-documentos/build.mjs. NAO EDITE ESTE ARQUIVO. */\n${css.join("\n")}`);
  ARQUIVOS.push("html/comparador-documentos.html", "css/comparador-documentos.css");
} else {
  console.log("  (pulado) estatico/comparador-documentos.{html,css} ainda nao existem");
}

// Regra do projeto: JS da extensao so com ASCII (conferencia byte a byte).
for (const f of SAIDAS) {
  const bytes = await readFile(join(DIST, f));
  const i = bytes.findIndex((b) => b > 0x7f);
  if (i >= 0) {
    console.error(`ERRO: byte nao-ASCII em dist/${f} (posicao ${i}): ${bytes.subarray(Math.max(0, i - 40), i + 10).toString("utf8")}`);
    process.exit(1);
  }
}

const kb = async (f) => `${Math.round((await stat(join(DIST, f))).size / 1024)} KB`;
console.log("\nComparador de Documentos -- build");
for (const f of [...SAIDAS, ...ARQUIVOS]) console.log(`  ${f.padEnd(32)} ${await kb(f)}`);
