#!/usr/bin/env node
/**
 * Build do Agente de IA.
 *
 *   dist/js/agente/painel.js   painel lateral (ESM; pdf.js entra em chunk sob demanda)
 *   dist/js/init_agente.js     content script do SEI (IIFE, mundo isolado)
 *   dist/html/agente.html      página do painel (cópia de estatico/)
 *   dist/css/agente.css        estilos do painel (cópia de estatico/)
 *
 * O pdf.js e o worker são os MESMOS das Ferramentas de PDF: o painel importa
 * `ferramentas-pdf/src/lib/ferramentas/pdfjs.ts`, que aponta para
 * `vendor/ferramentas-pdf/pdfjs/`, copiado pelo build de lá.
 */

import { build } from "esbuild";
import { copyFile, mkdir, rm, readdir, stat } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const AQUI = dirname(fileURLToPath(import.meta.url));
const DIST = resolve(AQUI, "..", "dist");
const SAIDA_PAINEL = join(DIST, "js", "agente");

const comum = {
  bundle: true,
  minify: true,
  target: ["chrome116", "firefox115"],
  // Acentos saem como \uXXXX: regra do projeto para JS da extensão.
  charset: "ascii",
  logLevel: "warning",
  legalComments: "none",
  banner: { js: "/* GERADO por agente-ia/build.mjs. NAO EDITE ESTE ARQUIVO. Rode: npm run build */" },
};

await rm(SAIDA_PAINEL, { recursive: true, force: true });
await mkdir(SAIDA_PAINEL, { recursive: true });

await build({
  ...comum,
  entryPoints: [resolve(AQUI, "src/painel/main.ts")],
  outdir: SAIDA_PAINEL,
  entryNames: "painel",
  format: "esm",
  splitting: true,
});

await build({
  ...comum,
  entryPoints: [resolve(AQUI, "src/ponte/aba.ts")],
  outfile: join(DIST, "js", "init_agente.js"),
  format: "iife",
});

await copyFile(resolve(AQUI, "estatico/agente.html"), join(DIST, "html", "agente.html"));
await copyFile(resolve(AQUI, "estatico/agente.css"), join(DIST, "css", "agente.css"));

const kb = async (f) => `${Math.round((await stat(f)).size / 1024)} KB`;
console.log("\nAgente de IA -- build");
for (const f of await readdir(SAIDA_PAINEL)) console.log(`  js/agente/${f.padEnd(28)} ${await kb(join(SAIDA_PAINEL, f))}`);
console.log(`  js/init_agente.js${" ".repeat(20)} ${await kb(join(DIST, "js", "init_agente.js"))}`);
console.log("  html/agente.html, css/agente.css\nok\n");
