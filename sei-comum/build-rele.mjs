#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
/**
 * Build do relé do Firefox: dist/js/ponte-firefox.js (background do manifest MV2 do Firefox, NAO do Chrome).
 * JS todo ASCII (regra do projeto).
 */
import { build } from "esbuild";

const AQUI = dirname(fileURLToPath(import.meta.url));
const SAIDA = join(resolve(AQUI, "..", "dist"), "js", "ponte-firefox.js");

await build({
  entryPoints: [resolve(AQUI, "src/ponte/rele-firefox.ts")],
  outfile: SAIDA,
  bundle: true,
  minify: true,
  format: "iife",
  // O mesmo piso do manifest do Firefox (browser_specific_settings.gecko.strict_min_version).
  target: ["firefox102"],
  charset: "ascii",
  logLevel: "warning",
  legalComments: "none",
  banner: { js: "/* GERADO por sei-comum/build-rele.mjs. NAO EDITE ESTE ARQUIVO. Rode: npm run build-rele */" },
});
// Janela de nivel superior onde o seletor de arquivo funciona (issue #186): dist/js/escolher-arquivo.js.
const SAIDA_ESCOLHA = join(resolve(AQUI, "..", "dist"), "js", "escolher-arquivo.js");
await build({
  entryPoints: [resolve(AQUI, "src/ponte/escolher-arquivo-janela.ts")],
  outfile: SAIDA_ESCOLHA,
  bundle: true,
  minify: true,
  format: "iife",
  target: ["chrome110"],
  charset: "ascii",
  logLevel: "warning",
  legalComments: "none",
  banner: { js: "/* GERADO por sei-comum/build-rele.mjs. NAO EDITE ESTE ARQUIVO. Rode: npm run build-rele */" },
});
const bytes = await readFile(SAIDA);
if (bytes.some((b) => b > 0x7f)) {
  console.error("ERRO: byte nao-ASCII em dist/js/ponte-firefox.js");
  process.exit(1);
}
console.log(`ponte-firefox.js: ${bytes.length} bytes`);
if ((await readFile(SAIDA_ESCOLHA)).some((b) => b > 0x7f)) {
  console.error("ERRO: byte nao-ASCII em dist/js/escolher-arquivo.js");
  process.exit(1);
}
