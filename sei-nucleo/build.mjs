#!/usr/bin/env node
/**
 * Build do sei-nucleo.
 *
 *   dist/js/sei-nucleo.js   IIFE com `window.SeiNucleo`, para o legado adotar
 *                           aos poucos (ver MIGRACAO.md).
 *
 * O agente NÃO usa este arquivo: importa o código-fonte e empacota junto.
 * `--saida <arquivo>` gera em outro lugar (testes ao vivo).
 */
import { build } from "esbuild";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const AQUI = dirname(fileURLToPath(import.meta.url));
const i = process.argv.indexOf("--saida");
const saida = i > 0 ? resolve(process.argv[i + 1]) : resolve(AQUI, "..", "dist", "js", "sei-nucleo.js");

await build({
  entryPoints: [resolve(AQUI, "src/index.ts")],
  outfile: saida,
  bundle: true,
  minify: i < 0,
  format: "iife",
  globalName: "SeiNucleo",
  target: ["chrome109", "firefox115"],
  charset: "ascii",
  logLevel: "warning",
  banner: { js: "/* GERADO por sei-nucleo/build.mjs. NAO EDITE ESTE ARQUIVO. */" },
});
console.log("ok", saida);
