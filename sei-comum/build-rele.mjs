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
  target: ["firefox115"],
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
