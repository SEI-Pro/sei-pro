#!/usr/bin/env node
/**
 * Build do Projetos.
 *
 *   dist/js/init_projetos.js   content script (IIFE, mundo isolado, todos os frames, document_start): so o
 *                              CARREGADOR (src/pagina/main.ts): marca o <html>, tira os textos internos do seletor
 *                              e decide pela tela; nos outros frames para ali (T11)
 *   dist/js/projetos/pagina.js pacote da pagina (ESM, src/pagina/principal.ts): o carregador o importa (import() do
 *                              endereco da extensao) so na janela de topo com unidade e no frame da arvore
 *   dist/js/projetos/balao.js  o balao do processo, com o base.css como texto (src/pagina/pacoteBalao.ts): o pacote
 *                              da pagina o importa so na primeira abertura
 *   dist/js/projetos/pagina-comum.js  o que os dois acima usam em comum (divisao do esbuild): nada se duplica
 *   dist/js/projetos/app.js    app de html/projetos.html (ESM): painel embutido, lateral e impressao
 *   dist/html/projetos.html    copia de estatico/
 *   dist/css/projetos.css      sei-comum/src/ui/base.css + lista.css + alturaRedimensionavel.css + estatico/projetos.css + estatico/gantt.css
 *                              (os dois do sei-comum sem os comentarios, que tem acento: a saida fica ASCII)
 *
 * Os tres arquivos do pacote da pagina sao importados por um content script: precisam estar no
 * web_accessible_resources do manifest Lab (dist/manifest.json). NA RECEITA DO PACOTE OFICIAL, saem com o
 * init_projetos.js e as entradas de html/projetos.html, js/projetos/app.js e css/projetos.css.
 *
 * Portoes (o build grava e depois reprova; confira que a saida nao tem linha "ERRO:"):
 *   - JS so ASCII (o charset "ascii" do esbuild nao escapa caractere cru em regex literal, e o grep BSD
 *     nao enxerga); CSS e HTML gerados tambem;
 *   - DOM seguro: nenhuma escrita de innerHTML/outerHTML, nenhum insertAdjacentHTML, nenhuma acao em
 *     atributo on*; no app, que leva a Frappe, nem a palavra innerHTML/outerHTML (no mundo da pagina o
 *     paginaDe do nucleo LE outerHTML);
 *   - nada que roda na pagina do SEI (o carregador e os tres do pacote da pagina) BUSCA a arvore do processo
 *     nem o formulario de atribuicao: buscar a arvore grava "Processo recebido" em nome do usuario (ruling da
 *     T12). Nenhum destes enderecos do SEI pode estar no pacote, nem em codigo morto que um dia volte a ser
 *     chamado. (No P5 a arvore JA aberta no proprio frame e lida por lerArvore sobre a pagina: nenhuma
 *     requisicao; o abrirArvore do nucleo, que tem esses enderecos, sai do pacote pelo tree-shaking.)
 *   - a divisao (T11): o carregador sem o pacote pesado (nem o repositorio, nem o base.css) e pequeno; o
 *     pacote da pagina sem o balao (nem import estatico dele); exatamente os tres arquivos esperados, todos no
 *     WAR do manifest Lab, e nenhuma entrada js/projetos/ do WAR sem arquivo.
 */
import { copyFile, mkdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { basename, dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";

const AQUI = dirname(fileURLToPath(import.meta.url));
const DIST = resolve(AQUI, "..", "dist");

// Opcoes comuns do esbuild (as mesmas do historico/build.mjs).
const comum = {
  bundle: true,
  minify: true,
  target: ["chrome116", "firefox115"],
  // Acentos saem como \uXXXX: regra do projeto para JS da extensao.
  charset: "ascii",
  logLevel: "warning",
  legalComments: "none",
  // O fonte original da Frappe 1.2.2 tem dois metodos view_is (vale o segundo, como no pacote publicado).
  logOverride: { "duplicate-class-member": "silent" },
  loader: { ".css": "text" },
  banner: { js: "/* GERADO por projetos/build.mjs. NAO EDITE ESTE ARQUIVO. Rode: npm run build */" },
  metafile: true,
};

const CONTENT_SCRIPT = "js/init_projetos.js";
const PAGINA = "js/projetos/pagina.js";
const BALAO = "js/projetos/balao.js";
const PAGINA_COMUM = "js/projetos/pagina-comum.js";
const APP = "js/projetos/app.js";
/** O pacote da pagina: o que o content script importa por import() (todos no WAR do manifest Lab). */
const PACOTE_PAGINA = [PAGINA, BALAO, PAGINA_COMUM];
/** Tudo o que roda na pagina do SEI (mundo isolado): o carregador e o pacote da pagina. */
const NA_PAGINA = [CONTENT_SCRIPT, ...PACOTE_PAGINA];
/** O carregador roda em todo frame: acima disto, algo pesado entrou nele. */
const TETO_CARREGADOR = 16 * 1024;

// Escrita de HTML cru em qualquer pacote; no app (com a Frappe vendorizada), nem a palavra.
const ESCRITA_HTML = /\.(innerHTML|outerHTML)\s*=(?!=)|insertAdjacentHTML/;
const PALAVRA_HTML = /innerHTML|outerHTML|insertAdjacentHTML/;
// on<evento>=" dentro de literal, como tools/check-dom-injection.mjs ("el.onclick = fn" nao casa).
const HANDLER = /\bon[a-z]+\s*=\s*\\?["']/;
// Enderecos do SEI que o content script nunca chama (arvore do processo e lista do formulario de atribuicao).
const SEI_PROIBIDO = ["procedimento_visualizar", "arvore_montar", "procedimento_atribuicao_cadastrar"];
// Modulos que nao podem entrar no carregador (o pacote pesado) nem no pacote da pagina (o balao sob demanda).
const PESADOS = ["src/repositorio.ts", "sei-comum/src/ui/base.css", "src/pagina/principal.ts", "src/pagina/pacoteBalao.ts"];
const DO_BALAO = [
  "sei-comum/src/ui/base.css",
  "src/pagina/pacoteBalao.ts",
  "src/pagina/balaoProcesso.ts",
  "src/pagina/balao.ts",
  "src/pagina/conteudo.ts",
  "src/pagina/adicionar.ts",
];

let falhou = false;
const erro = (m) => {
  console.error(`ERRO: ${m}`);
  falhou = true;
};
const primeiroNaoAscii = (bytes) => bytes.findIndex((b) => b > 0x7f);
const trecho = (bytes, i) => bytes.subarray(Math.max(0, i - 40), i + 10).toString("utf8");
/** Caminho do metafile (relativo ao cwd) -> relativo a dist/ ("js/projetos/pagina.js"). */
const daDist = (p) => relative(DIST, resolve(p)).split("\\").join("/");
/** Os modulos de entrada de uma saida do metafile, relativos a raiz do repositorio. */
const modulosDe = (meta, saida) => {
  const o = Object.entries(meta.outputs).find(([p]) => daDist(p) === saida)?.[1];
  return o ? Object.keys(o.inputs).map((i) => relative(resolve(AQUI, ".."), resolve(i)).split("\\").join("/")) : [];
};
const leva = (modulos, alvo) => modulos.some((m) => m === alvo || m.endsWith(`/${alvo}`) || m === `projetos/${alvo}`);

await rm(join(DIST, "js", "projetos"), { recursive: true, force: true });
await mkdir(join(DIST, "js", "projetos"), { recursive: true });
await mkdir(join(DIST, "html"), { recursive: true });
await mkdir(join(DIST, "css"), { recursive: true });

const carregador = await build({
  ...comum,
  entryPoints: [resolve(AQUI, "src/pagina/main.ts")],
  outfile: join(DIST, CONTENT_SCRIPT),
  format: "iife",
});
// Uma build so com divisao: o que a pagina e o balao usam em comum vai para pagina-comum.js, uma vez
// (o repositorio, o "balao aberto agora"). Um segundo pedaco comum colide no nome e o esbuild reprova.
const pacote = await build({
  ...comum,
  entryPoints: [
    { in: resolve(AQUI, "src/pagina/principal.ts"), out: "pagina" },
    { in: resolve(AQUI, "src/pagina/pacoteBalao.ts"), out: "balao" },
  ],
  outdir: join(DIST, "js", "projetos"),
  format: "esm",
  splitting: true,
  chunkNames: basename(PAGINA_COMUM, ".js"),
});
await build({ ...comum, entryPoints: [resolve(AQUI, "src/app/main.ts")], outfile: join(DIST, APP), format: "esm" });

await copyFile(resolve(AQUI, "estatico/projetos.html"), join(DIST, "html", "projetos.html"));
const COMUNS = ["../sei-comum/src/ui/base.css", "../sei-comum/src/ui/lista.css", "../sei-comum/src/ui/alturaRedimensionavel.css"];
const PROPRIOS = ["estatico/projetos.css", "estatico/gantt.css"];
const semComentarios = (css) => css.replace(/\/\*[\s\S]*?\*\//g, "");
const css = [
  ...(await Promise.all(COMUNS.map(async (f) => semComentarios(await readFile(resolve(AQUI, f), "utf8"))))),
  ...(await Promise.all(PROPRIOS.map((f) => readFile(resolve(AQUI, f), "utf8")))),
];
await writeFile(join(DIST, "css", "projetos.css"), `/* GERADO por projetos/build.mjs. NAO EDITE ESTE ARQUIVO. */\n${css.join("\n")}`);

// Os portoes de bytes, DOM e enderecos em todo JS gerado.
const geradosDoPacote = Object.keys(pacote.metafile.outputs).map(daDist);
for (const saida of [CONTENT_SCRIPT, ...geradosDoPacote, APP]) {
  const bytes = await readFile(join(DIST, saida));
  const i = primeiroNaoAscii(bytes);
  if (i >= 0) erro(`byte nao-ASCII em dist/${saida} (posicao ${i}): ${trecho(bytes, i)}`);
  const texto = bytes.toString("utf8");
  if ((saida === APP ? PALAVRA_HTML : ESCRITA_HTML).test(texto)) erro(`dist/${saida}: innerHTML/outerHTML/insertAdjacentHTML no pacote`);
  if (HANDLER.test(texto)) erro(`dist/${saida}: acao em atributo on* no pacote`);
  if (saida !== APP)
    for (const p of SEI_PROIBIDO) if (texto.includes(p)) erro(`dist/${saida}: "${p}" na pagina do SEI (busca da arvore do processo / atribuicao)`);
}
for (const f of [...PROPRIOS.map((p) => resolve(AQUI, p)), join(DIST, "css", "projetos.css"), join(DIST, "html", "projetos.html")]) {
  const bytes = await readFile(f);
  const j = primeiroNaoAscii(bytes);
  if (j >= 0) erro(`byte nao-ASCII em ${f} (posicao ${j}): ${trecho(bytes, j)}`);
}

// A divisao (T11).
const doCarregador = modulosDe(carregador.metafile, CONTENT_SCRIPT);
for (const m of PESADOS) if (leva(doCarregador, m)) erro(`dist/${CONTENT_SCRIPT}: o carregador leva ${m} (o pacote pesado vai por import())`);
const tamanhoCarregador = (await stat(join(DIST, CONTENT_SCRIPT))).size;
if (tamanhoCarregador > TETO_CARREGADOR)
  erro(`dist/${CONTENT_SCRIPT}: ${tamanhoCarregador} bytes (teto ${TETO_CARREGADOR}): algo pesado entrou no carregador, que roda em todo frame`);
const esperados = [...PACOTE_PAGINA].sort().join();
if ([...geradosDoPacote].sort().join() !== esperados)
  erro(`pacote da pagina: saiu ${geradosDoPacote.join(", ")}; o esperado (e declarado no WAR) e ${PACOTE_PAGINA.join(", ")}`);
for (const saida of [PAGINA, PAGINA_COMUM])
  for (const m of DO_BALAO) if (leva(modulosDe(pacote.metafile, saida), m)) erro(`dist/${saida}: leva ${m} (o balao vem sob demanda, em ${BALAO})`);
if (!leva(modulosDe(pacote.metafile, BALAO), "src/pagina/conteudo.ts") || !leva(modulosDe(pacote.metafile, BALAO), "sei-comum/src/ui/base.css"))
  erro(`dist/${BALAO}: sem o conteudo do balao ou sem o base.css`);
const saidaPagina = Object.entries(pacote.metafile.outputs).find(([p]) => daDist(p) === PAGINA)?.[1];
const estaticoDoBalao = (saidaPagina?.imports ?? []).filter((i) => i.kind !== "dynamic-import" && daDist(i.path) === BALAO);
if (estaticoDoBalao.length) erro(`dist/${PAGINA}: import estatico de ${BALAO} (o balao so por import(), na primeira abertura)`);
const manifest = JSON.parse(await readFile(join(DIST, "manifest.json"), "utf8"));
const war = (manifest.web_accessible_resources ?? []).flatMap((w) => w.resources ?? []);
for (const saida of geradosDoPacote)
  if (!war.includes(saida)) erro(`dist/manifest.json: ${saida} fora do web_accessible_resources (o import() do content script falharia)`);
for (const r of war.filter((x) => x.startsWith("js/projetos/")))
  if (![...geradosDoPacote, APP].includes(r)) erro(`dist/manifest.json: ${r} no web_accessible_resources sem arquivo gerado`);

const kb = async (f) => `${((await stat(join(DIST, f))).size / 1024).toFixed(1)} KB`;
console.log("\nProjetos -- build");
for (const f of [CONTENT_SCRIPT, ...PACOTE_PAGINA, APP, "html/projetos.html", "css/projetos.css"]) console.log(`  ${f.padEnd(28)} ${await kb(f)}`);
if (falhou) process.exit(1);
console.log("  portoes: ASCII, DOM seguro e content script sem busca de arvore/atribuicao ok");
console.log("  divisao: carregador sem o pacote pesado, balao sob demanda, pacote da pagina no WAR ok");
