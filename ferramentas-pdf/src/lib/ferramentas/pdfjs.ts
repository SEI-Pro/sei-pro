/**
 * Ponto único de configuração do pdf.js.
 *
 * Todos os caminhos de asset são ABSOLUTOS e apontam para dentro do pacote da
 * extensão, resolvidos por `runtime.getURL`. Duas razões:
 *
 * 1. O pdf.js resolve `cMapUrl` e companhia relativos à URL do documento atual.
 *    Caminho relativo aqui apontaria para dentro de `html/`, e o arquivo não
 *    existiria.
 * 2. Numa extensão os assets PRECISAM vir do pacote. Buscar de CDN seria uma
 *    requisição a terceiro numa ferramenta cujo argumento inteiro é que o
 *    documento não sai da máquina — e, com a política de segurança de MV3,
 *    seria bloqueado.
 *
 * A VERSÃO É COPIADA PELO BUILD, não à mão: `build.mjs` lê os assets de
 * `node_modules/pdfjs-dist` e os grava em `dist/vendor/ferramentas-pdf/pdfjs/`.
 * Por isso o caminho não carrega número de versão: não existe a possibilidade
 * de a constante daqui e os arquivos copiados divergirem.
 */

import { recursoDaExtensao } from "@/plataforma/recursos";

const BASE = "vendor/ferramentas-pdf/pdfjs";

/**
 * Os cmaps (1,6 MB) NÃO são empacotados: servem a PDFs com fonte CJK codificada
 * por CMap externo, que não aparecem em processo administrativo brasileiro.
 * Consequência honesta: um PDF desses renderiza glifos errados — não quebra.
 *
 * Declarar `cMapUrl` para uma pasta que não existe encheria o console de
 * ERR_FILE_NOT_FOUND a cada documento aberto, então a opção é OMITIDA.
 */
const CMAPS_EMBUTIDOS = false;

export const CAMINHOS_PDFJS = {
  worker: recursoDaExtensao(`${BASE}/pdf.worker.min.mjs`),
  standardFontDataUrl: recursoDaExtensao(`${BASE}/standard_fonts/`),
  iccUrl: recursoDaExtensao(`${BASE}/iccs/`),
  wasmUrl: recursoDaExtensao(`${BASE}/wasm/`),
} as const;

type PdfJs = typeof import("pdfjs-dist");

let modulo: PdfJs | null = null;

/** Carrega o pdf.js sob demanda e o configura uma única vez. */
export async function carregarPdfJs(): Promise<PdfJs> {
  if (modulo) return modulo;
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = CAMINHOS_PDFJS.worker;
  modulo = pdfjs;
  return pdfjs;
}

/** Opções de `getDocument` com todos os assets no lugar certo. */
export function opcoesDocumento(dados: Uint8Array, senha?: string) {
  return {
    data: dados,
    password: senha,
    ...(CMAPS_EMBUTIDOS
      ? { cMapUrl: recursoDaExtensao(`${BASE}/cmaps/`), cMapPacked: true }
      : {}),
    standardFontDataUrl: CAMINHOS_PDFJS.standardFontDataUrl,
    iccUrl: CAMINHOS_PDFJS.iccUrl,
    wasmUrl: CAMINHOS_PDFJS.wasmUrl,
    // Desativa o download de recursos por fetch dentro do worker do pdf.js: os
    // assets já estão no pacote e são servidos como recurso da extensão.
    useWorkerFetch: false,
    // As DUAS travas abaixo desligam execução de código vindo do documento.
    // Não são redundantes entre si e nenhuma é opcional aqui:
    //
    // `isEvalSupported: false` impede o `new Function()` do avaliador de
    // funções PostScript do pdf.js, que a política de segurança bloquearia de
    // qualquer forma — mas bloquear pela política significa erro em tempo de
    // execução no meio de um documento, e não um caminho que simplesmente não
    // é tomado.
    //
    // `enableScripting: false` desliga o interpretador de JavaScript EMBUTIDO
    // NO PDF (ação de abertura, scripts de campo de formulário). É a mitigação
    // que o próprio aviso da CVE-2026-16633 recomenda, e faz sentido
    // independente dela: um PDF de processo não tem por que executar código, e
    // esta ferramenta abre arquivo de terceiro por definição.
    isEvalSupported: false,
    enableScripting: false,
    // XFA é formulário da Adobe, praticamente extinto e uma superfície de
    // ataque a mais. O `analisarPdf` já avisa quando o documento usa XFA.
    enableXfa: false,
  };
}
