#!/usr/bin/env node
/**
 * Build do Editor.
 *
 *   dist/js/editor/pagina.js   bundle do MUNDO DA PAGINA (IIFE): instala os globais dos recursos
 *   dist/js/init_editor.js     content script isolado (IIFE): marca a cedencia e injeta o bundle
 * JS todo ASCII (portao de bytes abaixo).
 */
import { build } from "esbuild";
import { existsSync } from "node:fs";
import { mkdir, readFile, stat } from "node:fs/promises";
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
  format: "iife",
  banner: { js: "/* GERADO por editor/build.mjs. NAO EDITE ESTE ARQUIVO. Rode: npm run build */" },
};

const ENTRADAS = [
  { fonte: "src/pagina/main.ts", saida: "js/editor/pagina.js" },
  { fonte: "src/ponte/init.ts", saida: "js/init_editor.js" },
];

const SAIDAS = [];
for (const { fonte, saida } of ENTRADAS) {
  if (!existsSync(resolve(AQUI, fonte))) {
    console.log(`  (pulado) ${fonte} ainda nao existe; ${saida} nao foi gerado`);
    continue;
  }
  await mkdir(dirname(join(DIST, saida)), { recursive: true });
  await build({ ...comum, entryPoints: [resolve(AQUI, fonte)], outfile: join(DIST, saida) });
  SAIDAS.push(saida);
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

if (SAIDAS.length) {
  console.log("\nEditor -- build");
  for (const f of SAIDAS) console.log(`  ${f.padEnd(28)} ${Math.round((await stat(join(DIST, f))).size / 1024)} KB`);
}
