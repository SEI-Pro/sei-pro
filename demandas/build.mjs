#!/usr/bin/env node
/**
 * Build do Gestor de Demandas.
 *
 *   dist/js/init_demandas.js   CARREGADOR do content script (IIFE, mundo isolado, todo frame): marca o <html>, decide pela tela
 *   dist/js/demandas/pagina.js pacote da pagina (ESM, src/pagina/principal.ts): o carregador o importa so na janela de topo
 *                              e no frame da barra de acoes do processo (D17)
 *   dist/js/demandas/balao.js  o balao do processo, com o base.css como texto (src/pagina/pacoteBalao.ts): o pacote da
 *                              pagina o importa so na primeira abertura
 *   dist/js/demandas/pagina-comum.js  o que os dois acima usam em comum (divisao do esbuild): nada se duplica
 *   dist/js/demandas/app.js    app de html/demandas.html (ESM): painel embutido, lateral e pagina
 *   dist/html/demandas.html    copia de estatico/
 *   dist/css/demandas.css      sei-comum/src/ui/base.css + sei-comum/src/ui/lista.css + sei-comum/src/ui/alturaRedimensionavel.css + estatico/demandas.css + ../projetos/estatico/gantt.css
 *
 * Portoes (o build grava e depois reprova; confira que a saida nao tem linha "ERRO:"):
 *   - JS so ASCII; CSS e HTML gerados tambem;
 *   - DOM seguro: nenhuma escrita de innerHTML/outerHTML, nenhum insertAdjacentHTML, nenhuma acao em atributo on*;
 *   - nada que roda no SEI BUSCA a arvore do processo nem o formulario de atribuicao (grava "Processo recebido");
 *   - o carregador nao leva nada pesado (teto de 16 KB), o pacote da pagina nao leva o app, a Frappe nem o balao (nem
 *     import estatico dele) e o balao leva o conteudo e o base.css;
 *   - exatamente os tres arquivos do pacote da pagina, todos no web_accessible_resources do dist/manifest.json (e
 *     nenhuma entrada js/demandas/ do WAR sem arquivo).
 */
import { copyFile, mkdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { basename, dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";

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
  metafile: true,
  // O fonte original da Frappe 1.2.2 tem dois metodos view_is (vale o segundo, como no pacote publicado).
  logOverride: { "duplicate-class-member": "silent" },
  loader: { ".css": "text" },
  banner: { js: "/* GERADO por demandas/build.mjs. NAO EDITE ESTE ARQUIVO. Rode: npm run build */" },
};

const CONTENT_SCRIPT = "js/init_demandas.js";
const APP = "js/demandas/app.js";
const PAGINA = "js/demandas/pagina.js";
const BALAO = "js/demandas/balao.js";
const PAGINA_COMUM = "js/demandas/pagina-comum.js";
/** O pacote da pagina: o que o content script importa por import() (todos no WAR do manifest Lab). */
const PACOTE_PAGINA = [PAGINA, BALAO, PAGINA_COMUM];
/** O carregador roda em TODO frame do SEI: nada pesado entra nele. */
const TETO_CARREGADOR = 16 * 1024;

const ESCRITA_HTML = /\.(innerHTML|outerHTML)\s*=(?!=)|insertAdjacentHTML/;
const HANDLER = /\bon[a-z]+\s*=\s*\\?["']/;
// Modulos que nao podem entrar no carregador (o pacote pesado) nem no pacote da pagina (o balao sob demanda).
const PESADOS = ["src/repositorio.ts", "sei-comum/src/ui/base.css", "src/pagina/principal.ts", "src/pagina/pacoteBalao.ts"];
const DO_BALAO = [
  "sei-comum/src/ui/base.css",
  "src/pagina/pacoteBalao.ts",
  "src/pagina/balaoDemandas.ts",
  "src/pagina/conteudo.ts",
  "src/pagina/acoes.ts",
  "src/pagina/consentir.ts",
  "projetos/src/pagina/balao.ts",
];
const SEI_PROIBIDO = ["procedimento_visualizar", "arvore_montar", "procedimento_atribuicao_cadastrar"];

let falhou = false;
const erro = (m) => {
  console.error(`ERRO: ${m}`);
  falhou = true;
};
/** Caminho do metafile (relativo ao cwd) -> relativo a dist/ ("js/demandas/pagina.js"). */
const daDist = (p) => relative(DIST, resolve(p)).split("\\").join("/");
/** Os modulos de entrada de uma saida do metafile, relativos a raiz do repositorio. */
const modulosDe = (meta, saida) => {
  const o = Object.entries(meta.outputs).find(([p]) => daDist(p) === saida)?.[1];
  return o ? Object.keys(o.inputs).map((i) => relative(resolve(AQUI, ".."), resolve(i)).split("\\").join("/")) : [];
};
const leva = (modulos, alvo) => modulos.some((m) => m === alvo || m.endsWith(`/${alvo}`) || m === `demandas/${alvo}`);
const primeiroNaoAscii = (bytes) => bytes.findIndex((b) => b > 0x7f);
const trecho = (bytes, i) => bytes.subarray(Math.max(0, i - 40), i + 10).toString("utf8");

await rm(join(DIST, "js", "demandas"), { recursive: true, force: true });
await mkdir(join(DIST, "js", "demandas"), { recursive: true });
await mkdir(join(DIST, "html"), { recursive: true });
await mkdir(join(DIST, "css"), { recursive: true });

await build({ ...comum, entryPoints: [resolve(AQUI, "src/app/main.ts")], outfile: join(DIST, APP), format: "esm" });
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
  outdir: join(DIST, "js", "demandas"),
  format: "esm",
  splitting: true,
  chunkNames: basename(PAGINA_COMUM, ".js"),
});

await copyFile(resolve(AQUI, "estatico/demandas.html"), join(DIST, "html", "demandas.html"));
// Os dois do sei-comum sem os comentarios (tem acento): a saida fica ASCII.
const semComentarios = (c) => c.replace(/\/\*[\s\S]*?\*\//g, "");
const css = [
  ...(await Promise.all(
    [
      "../sei-comum/src/ui/base.css",
      "../sei-comum/src/ui/lista.css",
      "../sei-comum/src/ui/alturaRedimensionavel.css",
    ].map(async (f) =>
      semComentarios(await readFile(resolve(AQUI, f), "utf8")),
    ),
  )),
  await readFile(resolve(AQUI, "estatico/demandas.css"), "utf8"),
  // O Gantt (Frappe + situacoes) e o do Projetos, sem copia: o escopo e a classe .spro-gantt.
  await readFile(resolve(AQUI, "../projetos/estatico/gantt.css"), "utf8"),
];
await writeFile(join(DIST, "css", "demandas.css"), `/* GERADO por demandas/build.mjs. NAO EDITE ESTE ARQUIVO. */\n${css.join("\n")}`);

// Portoes de bytes, DOM e enderecos em todo JS gerado.
const geradosDoPacote = Object.keys(pacote.metafile.outputs).map(daDist);
for (const saida of [CONTENT_SCRIPT, ...geradosDoPacote, APP]) {
  const bytes = await readFile(join(DIST, saida));
  const i = primeiroNaoAscii(bytes);
  if (i >= 0) erro(`byte nao-ASCII em dist/${saida} (posicao ${i}): ${trecho(bytes, i)}`);
  const texto = bytes.toString("utf8");
  if (ESCRITA_HTML.test(texto)) erro(`dist/${saida}: innerHTML/outerHTML/insertAdjacentHTML no pacote`);
  if (HANDLER.test(texto)) erro(`dist/${saida}: acao em atributo on* no pacote`);
  for (const p of SEI_PROIBIDO) if (texto.includes(p)) erro(`dist/${saida}: "${p}" (busca da arvore do processo / atribuicao)`);
}
for (const f of [join(DIST, "css", "demandas.css"), join(DIST, "html", "demandas.html")]) {
  const bytes = await readFile(f);
  const j = primeiroNaoAscii(bytes);
  if (j >= 0) erro(`byte nao-ASCII em ${f} (posicao ${j}): ${trecho(bytes, j)}`);
}

// A divisao (D17).
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
const doBalao = modulosDe(pacote.metafile, BALAO);
if (!leva(doBalao, "src/pagina/conteudo.ts") || !leva(doBalao, "sei-comum/src/ui/base.css")) erro(`dist/${BALAO}: sem o conteudo do balao ou sem o base.css`);
const saidaPagina = Object.entries(pacote.metafile.outputs).find(([p]) => daDist(p) === PAGINA)?.[1];
const estaticoDoBalao = (saidaPagina?.imports ?? []).filter((i) => i.kind !== "dynamic-import" && daDist(i.path) === BALAO);
if (estaticoDoBalao.length) erro(`dist/${PAGINA}: import estatico de ${BALAO} (o balao so por import(), na primeira abertura)`);
for (const saida of [PAGINA, PAGINA_COMUM, CONTENT_SCRIPT])
  if (/frappe/i.test(await readFile(join(DIST, saida), "utf8"))) erro(`dist/${saida}: a Frappe entrou no pacote da pagina`);

{
  const manifest = JSON.parse(await readFile(join(DIST, "manifest.json"), "utf8"));
  const war = (manifest.web_accessible_resources ?? []).flatMap((w) => w.resources ?? []);
  for (const saida of [...geradosDoPacote, APP, "html/demandas.html", "css/demandas.css"])
    if (!war.includes(saida)) erro(`dist/manifest.json: ${saida} fora do web_accessible_resources (o import() do content script falharia)`);
  for (const r of war.filter((x) => x.startsWith("js/demandas/")))
    if (![...geradosDoPacote, APP].includes(r)) erro(`dist/manifest.json: ${r} no web_accessible_resources sem arquivo gerado`);
  const scripts = (manifest.content_scripts ?? []).flatMap((c) => c.js ?? []);
  if (!scripts.includes(CONTENT_SCRIPT)) erro(`dist/manifest.json: ${CONTENT_SCRIPT} fora dos content_scripts`);
}

const kb = async (f) => `${((await stat(join(DIST, f))).size / 1024).toFixed(1)} KB`;
console.log("\nDemandas -- build");
for (const f of [CONTENT_SCRIPT, ...PACOTE_PAGINA, APP, "html/demandas.html", "css/demandas.css"]) console.log(`  ${f.padEnd(28)} ${await kb(f)}`);
if (falhou) process.exit(1);
console.log("  portoes: ASCII, DOM seguro e sem busca de arvore/atribuicao ok");
console.log("  divisao: carregador sem o pacote pesado, balao sob demanda, pacote da pagina no WAR ok");
