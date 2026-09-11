#!/usr/bin/env node
/**
 * Build das Ferramentas de PDF.
 *
 * Gera, a partir de `src/`, os arquivos que a extensao carrega em `dist/`:
 *
 *   dist/js/ferramentas-pdf/app.js         pagina (ESM, com chunks sob demanda)
 *   dist/js/ferramentas-pdf/pdf.worker.js  worker de PDF (IIFE, classico)
 *   dist/js/sei-pro-ferramentaspdf.js      glue injetado no SEI (IIFE, classico)
 *   dist/vendor/ferramentas-pdf/**         assets do pdf.js e do Tesseract
 *
 * POR QUE A COPIA DOS ASSETS E PASSO DO BUILD, e nao copia manual: e a unica
 * forma de garantir que o worker e a biblioteca estejam SEMPRE na mesma versao.
 * Copiar a mao exige lembrar de atualizar uma constante de versao junto, e
 * esquecer produz um worker antigo conversando com uma biblioteca nova -- falha
 * que so aparece no navegador do usuario, com o empacotamento passando.
 *
 * Os cmaps do pdf.js (1,6 MB) NAO sao copiados de proposito. Ver `pdfjs.ts`.
 * Do Tesseract vai UMA variante de core (SIMD), nao as tres: as outras custam
 * 7,8 MB e o `ocrDisponivel()` ja recusa navegador sem SIMD com mensagem.
 */

import { build } from "esbuild";
import { cp, mkdir, rm, stat, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const AQUI = dirname(fileURLToPath(import.meta.url));
const RAIZ_EXT = resolve(AQUI, "..", "dist");
const VENDOR = join(RAIZ_EXT, "vendor", "ferramentas-pdf");
const SAIDA_JS = join(RAIZ_EXT, "js", "ferramentas-pdf");

const ALVOS = ["chrome109", "firefox115"];

/**
 * O QUE NAO ENTRA DE `pdfjs-dist/wasm`, e por que.
 *
 * `quickjs-eval` e o interpretador de JavaScript que o pdf.js usa para executar
 * script EMBUTIDO NO PDF -- exatamente o que `enableScripting: false` desliga em
 * `pdfjs.ts`. Deixar de empacota-lo economiza 475 KB e, o que importa mais,
 * torna a trava estrutural: sem o interpretador no pacote, reativar a opcao por
 * engano no futuro nao basta para executar codigo vindo de um documento.
 *
 * Os `*_nowasm_fallback.js` FICAM: sao os decodificadores JBIG2 e OpenJPEG em
 * JavaScript puro, o recuo para quando o WASM nao esta disponivel. Sao 596 KB
 * que salvam a leitura de digitalizacao justamente no ambiente mais restrito.
 */
const EXCLUIR_DO_WASM = ["quickjs-eval.js", "quickjs-eval.wasm"];

/** Assets copiados de node_modules (e de assets/, para o que nao vem do npm). */
const ASSETS = [
  // pdf.js
  { de: "node_modules/pdfjs-dist/build/pdf.worker.min.mjs", para: "pdfjs/pdf.worker.min.mjs" },
  { de: "node_modules/pdfjs-dist/wasm", para: "pdfjs/wasm", excluir: EXCLUIR_DO_WASM },
  { de: "node_modules/pdfjs-dist/standard_fonts", para: "pdfjs/standard_fonts" },
  { de: "node_modules/pdfjs-dist/iccs", para: "pdfjs/iccs" },
  // Tesseract
  { de: "node_modules/tesseract.js/dist/worker.min.js", para: "tesseract/worker.min.js" },
  {
    de: "node_modules/tesseract.js-core/tesseract-core-simd-lstm.wasm.js",
    para: "tesseract/core/tesseract-core-simd-lstm.wasm.js",
  },
  // Nao vem do npm: o modelo de portugues do tessdata_fast.
  { de: "assets/tesseract/por.traineddata.gz", para: "tesseract/lang/por.traineddata.gz" },
];

async function tamanhoDe(caminho) {
  const s = await stat(caminho);
  if (s.isFile()) return s.size;
  let total = 0;
  for (const item of await readdir(caminho, { withFileTypes: true })) {
    total += await tamanhoDe(join(caminho, item.name));
  }
  return total;
}

function humano(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

async function copiarAssets() {
  await rm(VENDOR, { recursive: true, force: true });
  await mkdir(VENDOR, { recursive: true });
  let total = 0;
  for (const { de, para, excluir = [] } of ASSETS) {
    const origem = resolve(AQUI, de);
    if (!existsSync(origem)) {
      throw new Error(
        `asset ausente: ${de}\n` +
          `  Rode "npm install" neste diretorio. Se o arquivo vem de assets/, ` +
          `ele precisa estar versionado no repositorio.`,
      );
    }
    const destino = join(VENDOR, para);
    await mkdir(dirname(destino), { recursive: true });
    await cp(origem, destino, {
      recursive: true,
      filter: (src) => !excluir.some((nome) => src.endsWith(`/${nome}`)),
    });
    const t = await tamanhoDe(destino);
    total += t;
    console.log(`  ${para.padEnd(52)} ${humano(t).padStart(8)}`);
  }
  console.log(`  ${"".padEnd(52)} ${"".padStart(8, "-")}`);
  console.log(`  ${"total de assets".padEnd(52)} ${humano(total).padStart(8)}`);
  return total;
}

async function empacotar() {
  // Limpa a saida antes de gerar.
  //
  // Os nomes de chunk carregam um hash do conteudo, entao cada build deixa os
  // anteriores para tras: sem isto a pasta acumula dezenas de arquivos orfaos,
  // que vao para o pacote publicado e atrapalham qualquer diagnostico -- um
  // erro apontando "chunk-ABC.js" pode ser de um build de dias atras.
  await rm(SAIDA_JS, { recursive: true, force: true });
  await mkdir(SAIDA_JS, { recursive: true });

  const comum = {
    bundle: true,
    minify: true,
    target: ALVOS,
    // `charset: "ascii"` e o padrao do esbuild e resolve de graca a regra do
    // projeto: acento em dist/js/*.js precisa sair como \uXXXX, porque UTF-8
    // cru vira mojibake quando o SEI injeta o script sem charset.
    charset: "ascii",
    logLevel: "warning",
    banner: {
      js: "/* GERADO por ferramentas-pdf/build.mjs. NAO EDITE ESTE ARQUIVO. Rode: npm run build */",
    },
  };

  // 1) Pagina: ESM com splitting, para Tarjar e OCR entrarem sob demanda.
  await build({
    ...comum,
    entryPoints: [resolve(AQUI, "src/ui/main.ts")],
    outdir: SAIDA_JS,
    entryNames: "app",
    format: "esm",
    splitting: true,
  });

  // 2) Worker de PDF: IIFE classico. Ver o comentario em clienteWorker.ts.
  await build({
    ...comum,
    entryPoints: [resolve(AQUI, "src/lib/ferramentas/pdf.worker.ts")],
    outfile: join(SAIDA_JS, "pdf.worker.js"),
    format: "iife",
    splitting: false,
  });

  // 3) Glue do SEI: IIFE classico, entra por $.getScript no mundo da pagina.
  await build({
    ...comum,
    entryPoints: [resolve(AQUI, "src/ponte/sei-pro-ferramentaspdf.ts")],
    outfile: join(RAIZ_EXT, "js", "sei-pro-ferramentaspdf.js"),
    format: "iife",
    splitting: false,
  });

  // 4) Content script do MUNDO ISOLADO: e o unico lado que enxerga chrome.*,
  //    e por isso e ele quem abre a porta para a pagina da ferramenta.
  await build({
    ...comum,
    entryPoints: [resolve(AQUI, "src/ponte/init-ferramentaspdf.ts")],
    outfile: join(RAIZ_EXT, "js", "init_ferramentaspdf.js"),
    format: "iife",
    splitting: false,
  });
}

async function main() {
  console.log("\nFerramentas de PDF -- build\n");
  console.log("assets:");
  await copiarAssets();
  console.log("\nbundles:");
  await empacotar();
  for (const f of await readdir(SAIDA_JS)) {
    console.log(`  js/ferramentas-pdf/${f.padEnd(36)} ${humano(await tamanhoDe(join(SAIDA_JS, f))).padStart(8)}`);
  }
  for (const nome of ["sei-pro-ferramentaspdf.js", "init_ferramentaspdf.js"]) {
    const caminho = join(RAIZ_EXT, "js", nome);
    console.log(`  js/${nome.padEnd(45)} ${humano(await tamanhoDe(caminho)).padStart(8)}`);
  }
  console.log("\nok\n");
}

main().catch((e) => {
  console.error("\nFALHOU:", e.message, "\n");
  process.exit(1);
});
