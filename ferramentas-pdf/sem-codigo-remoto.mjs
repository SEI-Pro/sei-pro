/**
 * Portao "sem codigo hospedado remotamente" (Manifest V3).
 *
 * A Chrome Web Store rejeitou o pacote 3.9 do SEI Pro Lab (ref. "Blue Argon",
 * 18/11/2026) porque o tesseract.js traz, como VALOR PADRAO, URLs do
 * `cdn.jsdelivr.net` para o worker, o core e os idiomas. O SEI Pro nunca usa
 * esses padroes: `ocr.ts` passa `workerPath`, `corePath` e `langPath` apontando
 * para `vendor/ferramentas-pdf/tesseract/` dentro da extensao. Mas a revisao
 * automatica le o texto do pacote, nao o fluxo, e reprova o literal.
 *
 * Por isso, depois de gerar os bundles e copiar o worker, este modulo troca o
 * prefixo do CDN por um caminho LOCAL inexistente. Se algum dia o codigo
 * esquecer de passar um caminho, o OCR falha de forma visivel em vez de buscar
 * codigo na rede (falha fechada).
 *
 * Usado por ferramentas-pdf/build.mjs e agente-ia/build.mjs.
 */
import { readFile, readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const CDN = "https://cdn.jsdelivr.net/npm/";
// Relativo, sem esquema: nada que um revisor (ou o navegador) leia como remoto.
const LOCAL_DESATIVADO = "vendor/ferramentas-pdf/tesseract/_cdn-desativado/";

/** Troca o prefixo do CDN em um texto. Devolve o texto novo e quantas trocas fez. */
export function neutralizar(texto) {
  let trocas = 0;
  const novo = texto.replaceAll(CDN, () => {
    trocas += 1;
    return LOCAL_DESATIVADO;
  });
  return { texto: novo, trocas };
}

async function arquivosJs(pasta) {
  const achados = [];
  for (const item of await readdir(pasta, { withFileTypes: true })) {
    const caminho = join(pasta, item.name);
    if (item.isDirectory()) achados.push(...(await arquivosJs(caminho)));
    else if (item.name.endsWith(".js") || item.name.endsWith(".mjs")) achados.push(caminho);
  }
  return achados;
}

/**
 * Neutraliza o CDN em todos os .js/.mjs das pastas e confere que nao sobrou nada.
 * Lanca erro se restar qualquer `cdn.jsdelivr.net`.
 */
export async function blindarPastas(pastas) {
  let total = 0;
  for (const pasta of pastas) {
    for (const arquivo of await arquivosJs(pasta)) {
      const original = await readFile(arquivo, "utf8");
      if (!original.includes(CDN)) continue;
      const { texto, trocas } = neutralizar(original);
      await writeFile(arquivo, texto);
      total += trocas;
    }
  }
  const restantes = [];
  for (const pasta of pastas) {
    for (const arquivo of await arquivosJs(pasta)) {
      if ((await readFile(arquivo, "utf8")).includes("cdn.jsdelivr.net")) restantes.push(arquivo);
    }
  }
  if (restantes.length) {
    throw new Error(`codigo remoto (cdn.jsdelivr.net) ainda presente em:\n  ${restantes.join("\n  ")}`);
  }
  return total;
}
