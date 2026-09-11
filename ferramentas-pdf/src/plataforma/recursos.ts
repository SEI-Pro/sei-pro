/**
 * Resolucao de caminho de asset dentro da extensao.
 *
 * Na extensao os arquivos nao moram na raiz de um site: moram no pacote, sob
 * `chrome-extension://<id>/` (ou `moz-extension://<id>/` no Firefox). A API que
 * traduz um caminho do pacote em URL absoluta e `runtime.getURL`, e ela existe
 * tanto em `chrome` quanto em `browser` -- o proprio SEI Pro ja faz essa
 * bifurcacao em `dist/js/init.js` (`getUrlExtension`).
 *
 * O recuo por `import.meta.url` NAO e decoracao: sem ele, qualquer execucao
 * fora do navegador (os verificadores em Node, um servidor de desenvolvimento)
 * quebraria no primeiro acesso a `chrome`. Como o nucleo e testado em Node de
 * proposito, o recuo e o que mantem os testes possiveis.
 */

interface RuntimeComGetURL {
  getURL(caminho: string): string;
}

function runtimeDaExtensao(): RuntimeComGetURL | null {
  const global = globalThis as {
    chrome?: { runtime?: Partial<RuntimeComGetURL> };
    browser?: { runtime?: Partial<RuntimeComGetURL> };
  };
  const candidato = global.chrome?.runtime ?? global.browser?.runtime;
  return typeof candidato?.getURL === "function"
    ? (candidato as RuntimeComGetURL)
    : null;
}

/**
 * Devolve a URL absoluta de um arquivo do pacote da extensao.
 *
 * O caminho e sempre relativo a raiz do pacote, sem barra inicial:
 * `recursoDaExtensao("vendor/ferramentas-pdf/pdfjs/pdf.worker.min.mjs")`.
 */
export function recursoDaExtensao(caminho: string): string {
  const runtime = runtimeDaExtensao();
  if (runtime) return runtime.getURL(caminho);
  // Fora da extensao (Node, servidor de desenvolvimento): resolve relativo a
  // este modulo, que vive em `src/plataforma/`, dois niveis abaixo da raiz.
  return new URL(`../../${caminho}`, import.meta.url).href;
}

/** Verdadeiro quando o codigo esta rodando dentro da extensao. */
export function dentroDaExtensao(): boolean {
  return runtimeDaExtensao() !== null;
}
