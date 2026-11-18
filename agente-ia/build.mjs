#!/usr/bin/env node
/**
 * Build do Agente de IA.
 *
 *   dist/js/agente/painel.js   painel lateral (ESM; pdf.js entra em chunk sob demanda)
 *   dist/js/estudio/estudio.js Estudio de Fluxo, pagina em tela cheia (ESM)
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
import { execFileSync } from "node:child_process";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { blindarPastas } from "../ferramentas-pdf/sem-codigo-remoto.mjs";

const AQUI = dirname(fileURLToPath(import.meta.url));
const DIST = resolve(AQUI, "..", "dist");
const SAIDA_PAINEL = join(DIST, "js", "agente");
const SAIDA_ESTUDIO = join(DIST, "js", "estudio");

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
await rm(SAIDA_ESTUDIO, { recursive: true, force: true });
await mkdir(SAIDA_ESTUDIO, { recursive: true });

await build({
  ...comum,
  entryPoints: [resolve(AQUI, "src/painel/main.ts")],
  outdir: SAIDA_PAINEL,
  entryNames: "painel",
  format: "esm",
  splitting: true,
});

// Sem `splitting`: e uma entrada so, e chunk compartilhado nao teria com quem
// compartilhar -- daria um arquivo a mais para declarar no web_accessible_resources.
await build({
  ...comum,
  entryPoints: [resolve(AQUI, "src/estudio/main.ts")],
  outfile: join(SAIDA_ESTUDIO, "estudio.js"),
  format: "esm",
});

await build({
  ...comum,
  entryPoints: [resolve(AQUI, "src/ponte/aba.ts")],
  outfile: join(DIST, "js", "init_agente.js"),
  format: "iife",
});

// Mundo da página, só na janela do editor (o CKEditor aberto não é visível do mundo isolado).
await build({
  ...comum,
  entryPoints: [resolve(AQUI, "src/ponte/editorPagina.ts")],
  outfile: join(DIST, "js", "sei-pro-agente-editor.js"),
  format: "iife",
});

// O esbuild escapa o acento de string e de template, mas NAO o de literal de regex (/habilita[çc][ãa]o/).
// A regra do projeto vale para todo o JS da extensao, então o que sobrou é escapado aqui (\uXXXX no
// regex é o mesmo caractere). Idempotente.
const gerados = [
  ...(await readdir(SAIDA_PAINEL)).map((f) => join(SAIDA_PAINEL, f)),
  ...(await readdir(SAIDA_ESTUDIO)).map((f) => join(SAIDA_ESTUDIO, f)),
  join(DIST, "js", "init_agente.js"),
  join(DIST, "js", "sei-pro-agente-editor.js"),
].filter((f) => f.endsWith(".js"));
execFileSync(process.execPath, [resolve(AQUI, "escape-nonascii.mjs"), ...gerados], { stdio: "inherit" });

// Portao do Manifest V3: o tesseract.js empacotado traz URLs de CDN como valor padrao. O Agente passa
// caminhos locais, mas a revisao da loja le o texto do pacote (ver ferramentas-pdf/sem-codigo-remoto.mjs).
const trocasCdn = await blindarPastas([SAIDA_PAINEL, SAIDA_ESTUDIO]);
console.log(`portao: ${trocasCdn} URL(s) de CDN neutralizada(s), nenhuma sobrou`);

await copyFile(resolve(AQUI, "estatico/agente.html"), join(DIST, "html", "agente.html"));
await copyFile(resolve(AQUI, "estatico/fluxos.html"), join(DIST, "html", "fluxos.html"));
await copyFile(resolve(AQUI, "estatico/agente.css"), join(DIST, "css", "agente.css"));

const kb = async (f) => `${Math.round((await stat(f)).size / 1024)} KB`;
console.log("\nAgente de IA -- build");
for (const f of await readdir(SAIDA_PAINEL)) console.log(`  js/agente/${f.padEnd(28)} ${await kb(join(SAIDA_PAINEL, f))}`);
for (const f of await readdir(SAIDA_ESTUDIO)) console.log(`  js/estudio/${f.padEnd(27)} ${await kb(join(SAIDA_ESTUDIO, f))}`);
console.log(`  js/init_agente.js${" ".repeat(20)} ${await kb(join(DIST, "js", "init_agente.js"))}`);
console.log("  html/agente.html, html/fluxos.html, css/agente.css\nok\n");
