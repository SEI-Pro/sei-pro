#!/usr/bin/env node
/**
 * Build do Historico.
 *
 *   dist/js/init_historico.js  content script (IIFE, mundo isolado, todos os frames)
 *   dist/js/historico/app.js   app de html/historico.html (ESM): modal sobre o SEI ou aba da barra lateral
 *   dist/html/historico.html   copia de estatico/ (modal e aba da barra lateral)
 *   dist/css/historico.css     sei-comum/src/ui/base.css + sei-comum/src/ui/lista.css + sei-comum/src/ui/acoesNumeroProcesso.css + estatico/historico.css
 * JS todo ASCII (portao de bytes abaixo).
 */
import { build } from "esbuild";
import { copyFile, mkdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const AQUI = dirname(fileURLToPath(import.meta.url));
const DIST = resolve(AQUI, "..", "dist");

// Opcoes comuns do esbuild, usadas por cada `build({ ...comum, ... })` das entradas.
const comum = {
  bundle: true,
  minify: true,
  target: ["chrome116", "firefox115"],
  // Acentos saem como \uXXXX: regra do projeto para JS da extensao.
  charset: "ascii",
  logLevel: "warning",
  legalComments: "none",
  loader: { ".css": "text" },
  banner: { js: "/* GERADO por historico/build.mjs. NAO EDITE ESTE ARQUIVO. Rode: npm run build */" },
};

await rm(join(DIST, "js", "historico"), { recursive: true, force: true });
await mkdir(join(DIST, "js", "historico"), { recursive: true });

await build({ ...comum, entryPoints: [resolve(AQUI, "src/app/main.ts")], outfile: join(DIST, "js", "historico", "app.js"), format: "esm" });
await build({ ...comum, entryPoints: [resolve(AQUI, "src/pagina/main.ts")], outfile: join(DIST, "js", "init_historico.js"), format: "iife" });

const SAIDAS = ["js/init_historico.js", "js/historico/app.js"];

// Pagina do app e CSS: base + lista (sei-comum, o desenho do Favoritos) + o do historico.
await mkdir(join(DIST, "html"), { recursive: true });
await mkdir(join(DIST, "css"), { recursive: true });
await copyFile(resolve(AQUI, "estatico/historico.html"), join(DIST, "html", "historico.html"));
const css = await Promise.all(
  ["../sei-comum/src/ui/base.css", "../sei-comum/src/ui/lista.css", "../sei-comum/src/ui/acoesNumeroProcesso.css", "estatico/historico.css"].map((f) => readFile(resolve(AQUI, f), "utf8")),
);
await writeFile(join(DIST, "css", "historico.css"), `/* GERADO por historico/build.mjs. NAO EDITE ESTE ARQUIVO. */\n${css.join("\n")}`);

// Regra do projeto: JS da extensao so com ASCII (conferencia byte a byte, como no Favoritos).
for (const f of SAIDAS) {
  const bytes = await readFile(join(DIST, f));
  const i = bytes.findIndex((b) => b > 0x7f);
  if (i >= 0) {
    console.error(`ERRO: byte nao-ASCII em dist/${f} (posicao ${i}): ${bytes.subarray(Math.max(0, i - 40), i + 10).toString("utf8")}`);
    process.exit(1);
  }
}

const kb = async (f) => `${Math.round((await stat(join(DIST, f))).size / 1024)} KB`;
console.log("\nHistorico -- build");
for (const f of [...SAIDAS, "html/historico.html", "css/historico.css"]) console.log(`  ${f.padEnd(26)} ${await kb(f)}`);
