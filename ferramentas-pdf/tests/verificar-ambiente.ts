/**
 * Guardas de ambiente.
 *
 * Cada asserção aqui existe por causa de um modo de falha que NÃO aparece no
 * console: o OCR que busca o motor numa CDN, o asset que some do pacote, o
 * manifest de um órgão que ficou sem a política de segurança. Todos passam no
 * empacotamento e quebram só na máquina do usuário — e alguns quebram calados,
 * o que é pior.
 *
 * Roda em Node, sem navegador. Por isso `recursoDaExtensao` cai no recuo por
 * `import.meta.url` e devolve `file://...` — o que se confere aqui é a FORMA do
 * caminho e a existência do arquivo, não a URL final.
 */

import { readFileSync, existsSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { CAMINHOS_PDFJS } from "@/lib/ferramentas/pdfjs";
import { CAMINHOS_TESSERACT, suportaSimd } from "@/lib/ferramentas/tesseract";

const AQUI = dirname(fileURLToPath(import.meta.url));
const RAIZ_EXT = resolve(AQUI, "..", "..", "dist");

let passou = 0;
let falhou = 0;

function checar(nome: string, condicao: boolean, detalhe?: string) {
  if (condicao) {
    passou += 1;
    console.log(`  ok    ${nome}`);
  } else {
    falhou += 1;
    console.log(`  FALHA ${nome}${detalhe ? ` -- ${detalhe}` : ""}`);
  }
}

/** Converte a URL resolvida de volta no caminho relativo ao pacote. */
function caminhoNoPacote(url: string): string {
  const marca = "ferramentas-pdf/";
  const i = url.indexOf(`vendor/${marca}`);
  return i === -1 ? url : url.slice(i);
}

function main() {
  const todos = [
    ...Object.entries(CAMINHOS_PDFJS),
    ...Object.entries(CAMINHOS_TESSERACT),
  ];

  console.log("\n== nenhum asset vem da rede ==");
  // O pior defeito possível nesta ferramenta: pedir o motor de OCR a um
  // terceiro. Não vaza o documento, mas conta a um estranho que aquela pessoa
  // está fazendo OCR agora -- e contradiz o que a página afirma.
  for (const [nome, url] of todos) {
    checar(
      `${nome} nao aponta para http(s)`,
      !/^https?:/i.test(url),
      url.slice(0, 80),
    );
  }

  console.log("\n== a armadilha do corePath ==");
  // Verificado dentro do worker.min.js: se o corePath NAO termina em "js", o
  // worker o trata como diretorio, detecta a capacidade do navegador, monta o
  // nome do arquivo -- e, se ele faltar, cai no jsDelivr.
  checar(
    "corePath do Tesseract termina em .js (aponta o ARQUIVO)",
    CAMINHOS_TESSERACT.core.endsWith(".js"),
    CAMINHOS_TESSERACT.core.slice(-40),
  );
  checar(
    "e e a variante SIMD, que e a unica empacotada",
    CAMINHOS_TESSERACT.core.includes("simd-lstm"),
  );
  checar("a deteccao de SIMD funciona neste Node", suportaSimd());

  console.log("\n== todo asset declarado existe no pacote ==");
  const semVendor = !existsSync(join(RAIZ_EXT, "vendor", "ferramentas-pdf"));
  if (semVendor) {
    console.log("  (pulado: rode 'npm run build' primeiro)");
  } else {
    for (const [nome, url] of todos) {
      const rel = caminhoNoPacote(url);
      const alvo = join(RAIZ_EXT, rel);
      checar(`${nome} existe em dist/`, existsSync(alvo), rel);
    }
    checar(
      "o modelo de portugues foi empacotado",
      existsSync(join(RAIZ_EXT, "vendor/ferramentas-pdf/tesseract/lang/por.traineddata.gz")),
    );
    // Ver EXCLUIR_DO_WASM em build.mjs: sem o interpretador no pacote, nem uma
    // reativacao acidental de enableScripting executa codigo de um documento.
    checar(
      "o interpretador de JavaScript do pdf.js NAO foi empacotado",
      !existsSync(join(RAIZ_EXT, "vendor/ferramentas-pdf/pdfjs/wasm/quickjs-eval.wasm")),
    );
  }

  console.log("\n== o content script do mundo isolado ==");
  // A pagina abre por link comum, mas quem a conecta ao SEI e este content
  // script -- e so um content script DECLARADO no manifest roda no mundo
  // isolado, o unico com acesso a chrome.runtime. Sem a declaracao, a pagina
  // abre e as integracoes somem sem qualquer aviso.
  {
    const arquivo = join(RAIZ_EXT, "js", "init_ferramentaspdf.js");
    if (!existsSync(arquivo)) {
      console.log("  (pulado: rode 'npm run build' primeiro)");
    } else {
      checar("o arquivo foi gerado", true);
      for (const nome of readdirSync(RAIZ_EXT).filter((f) => /^manifest.*\.json$/.test(f))) {
        const m = JSON.parse(readFileSync(join(RAIZ_EXT, nome), "utf8"));
        const declarado = (m.content_scripts ?? []).some((b: { js?: string[] }) =>
          (b.js ?? []).includes("js/init_ferramentaspdf.js"),
        );
        checar(`${nome}: declarado em content_scripts`, declarado);
      }
    }
  }

  console.log("\n== acentos no arquivo injetado no SEI ==");
  // A regra vale para o que o SEI INJETA, nao para tudo em dist/js. O glue e
  // carregado por $.getScript dentro de uma pagina do SEI, que serve o script
  // sem charset -- acento cru ali vira mojibake. Ja os pedacos da pagina das
  // Ferramentas de PDF sao carregados por <script type="module"> de um
  // documento que declara UTF-8, entao podem ter acento normalmente.
  const glue = join(RAIZ_EXT, "js", "sei-pro-ferramentaspdf.js");
  if (!existsSync(glue)) {
    console.log("  (pulado: rode 'npm run build' primeiro)");
  } else {
    const conteudo = readFileSync(glue, "utf8");
    const forasteiros = [...conteudo].filter((c) => c.codePointAt(0)! > 127);
    checar(
      "o glue injetado no SEI e ASCII puro",
      forasteiros.length === 0,
      forasteiros.length ? `${forasteiros.length} caractere(s): ${forasteiros.slice(0, 5).join(" ")}` : undefined,
    );
  }

  console.log("\n== os manifests da extensao ==");
  const manifests = readdirSync(RAIZ_EXT).filter(
    (f) => f.startsWith("manifest") && f.endsWith(".json"),
  );
  checar("os 12 manifests foram encontrados", manifests.length === 12, String(manifests.length));

  for (const arquivo of manifests) {
    const m = JSON.parse(readFileSync(join(RAIZ_EXT, arquivo), "utf8"));
    const mv3 = m.manifest_version === 3;

    // Sem 'wasm-unsafe-eval' o OCR morre e o pdf.js falha em JBIG2/JPX -- ou
    // seja, justamente em digitalizacao, que e o caso de uso principal.
    const csp = mv3
      ? m.content_security_policy?.extension_pages
      : m.content_security_policy;
    checar(
      `${arquivo}: CSP permite WebAssembly`,
      typeof csp === "string" && csp.includes("wasm-unsafe-eval"),
    );

    // Sem isto o SEI nao consegue navegar ate a pagina da extensao.
    const war = m.web_accessible_resources;
    const recursos: string[] = Array.isArray(war)
      ? typeof war[0] === "string"
        ? (war as string[])
        : (war as { resources: string[] }[]).flatMap((b) => b.resources ?? [])
      : [];
    for (const necessario of [
      "html/ferramentas-pdf.html",
      "js/sei-pro-ferramentaspdf.js",
      "icons/menu/ferramentas_pdf.svg",
      // O OCR das Ferramentas de IA roda dentro da pagina do SEI e carrega
      // estes tres de la. Sem a declaracao, ele volta a buscar o motor na
      // CDN -- em silencio, porque a biblioteca tem esse caminho como padrao.
      "vendor/ferramentas-pdf/tesseract/worker.min.js",
      "vendor/ferramentas-pdf/tesseract/core/tesseract-core-simd-lstm.wasm.js",
      "vendor/ferramentas-pdf/tesseract/lang/por.traineddata.gz",
    ]) {
      checar(`${arquivo}: WAR tem ${necessario}`, recursos.includes(necessario));
    }

    // O Firefox so entende 'wasm-unsafe-eval' a partir da 102: abaixo disso o
    // WASM e bloqueado pela CSP em SILENCIO e o OCR nunca comeca.
    if (!mv3) {
      const gecko = m.browser_specific_settings?.gecko ?? {};
      checar(
        `${arquivo}: Firefox minimo >= 102 (exigencia do WASM)`,
        parseInt(String(gecko.strict_min_version ?? "0"), 10) >= 102,
        String(gecko.strict_min_version),
      );
    }
  }

  console.log(`\n${passou} conferem, ${falhou} falham\n`);
  process.exit(falhou === 0 ? 0 : 1);
}

main();
