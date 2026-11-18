/**
 * Recorte de uma figura para o `ver_imagem`, no painel.
 *
 * PDF: a página é renderizada pelo pdf.js e a figura recortada pela caixa que
 * a leitura marcou (`figurasDasPaginas`, a mesma conta das marcas). Imagem
 * (documento externo ou imagem embutida no editor do SEI): decodificada e
 * reduzida. Sai sempre um JPEG de no máximo 1536 px no lado maior — é isso,
 * e só isso, que vai ao serviço de IA, depois da permissão do usuário.
 */

import type { ImagemPronta } from "../motor/tipos";
import { figurasDasPaginas, lerIdFigura, type Caixa, type PaginaComFiguras } from "./figuras";
import { comPdf, ORCAMENTO_FIGURAS, paginasVistasDoPdf } from "./pdf";

export type { ImagemPronta };

const LADO_MAXIMO = 1536;
const QUALIDADE = 0.85;
const MARGEM = 0.02;
const ESCALA_MAXIMA = 4;

const erroDeFigura = (mensagem: string) => Object.assign(new Error(mensagem), { codigo: "FIGURA_INEXISTENTE" });

/** A caixa da figura `pP-I`, pela mesma conta que gerou a marca. */
export function figuraNoDocumento(paginas: PaginaComFiguras[], id: { tipo: "figura"; pagina: number; indice: number }): Caixa {
  const { figuras } = figurasDasPaginas(paginas);
  const alvo = figuras.find((f) => f.id === `p${id.pagina}-${id.indice}`);
  if (alvo) return alvo.caixa;
  const existem = figuras.map((f) => f.id).join(", ");
  throw erroDeFigura(`A figura p${id.pagina}-${id.indice} não existe neste documento. ${existem ? `Figuras marcadas: ${existem}.` : "Nenhuma figura foi marcada nele."} Qualquer página inteira pode ser vista com "pN".`);
}

/**
 * Caixa em pontos PDF (origem embaixo) → retângulo em pixels da página
 * renderizada (origem em cima), com a rotação da página. Fórmulas conferidas
 * com `convertToViewportPoint` do pdf.js 6.3.289 nas quatro rotações.
 */
export function retanguloEmPixels(caixa: Caixa, pagina: { largura: number; altura: number; rotacao: number }, escala: number, margem = MARGEM): Caixa {
  const W = pagina.largura;
  const H = pagina.altura;
  const x0 = Math.max(0, caixa.x - margem * W);
  const y0 = Math.max(0, caixa.y - margem * H);
  const x1 = Math.min(W, caixa.x + caixa.largura + margem * W);
  const y1 = Math.min(H, caixa.y + caixa.altura + margem * H);
  const r = ((pagina.rotacao % 360) + 360) % 360;
  const [px, py, pl, pa] =
    r === 90 ? [y0, x0, y1 - y0, x1 - x0] : r === 180 ? [W - x1, y0, x1 - x0, y1 - y0] : r === 270 ? [H - y1, W - x1, y1 - y0, x1 - x0] : [x0, H - y1, x1 - x0, y1 - y0];
  return { x: px * escala, y: py * escala, largura: pl * escala, altura: pa * escala };
}

export function reduzir(largura: number, altura: number, max = LADO_MAXIMO): { largura: number; altura: number } {
  const maior = Math.max(largura, altura);
  if (maior <= max) return { largura, altura };
  const f = max / maior;
  return { largura: Math.round(largura * f), altura: Math.round(altura * f) };
}

const base64ParaBytes = (b64: string) => Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));

/** Copia um trecho de uma fonte desenhável para um JPEG reduzido. */
function paraJpeg(fonte: CanvasImageSource, recorte: Caixa, descricao: string): ImagemPronta {
  const { largura, altura } = reduzir(Math.max(1, Math.round(recorte.largura)), Math.max(1, Math.round(recorte.altura)));
  const tela = document.createElement("canvas");
  tela.width = largura;
  tela.height = altura;
  const ctx = tela.getContext("2d");
  if (!ctx) throw new Error("O navegador não deixou desenhar a imagem.");
  // Fundo branco: PNG transparente viraria preto no JPEG.
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, largura, altura);
  ctx.drawImage(fonte, recorte.x, recorte.y, recorte.largura, recorte.altura, 0, 0, largura, altura);
  return { dataUrl: tela.toDataURL("image/jpeg", QUALIDADE), largura, altura, descricao };
}

interface PaginaRenderizavel {
  rotate: number;
  view: number[];
  getViewport(o: { scale: number }): { width: number; height: number };
  render(o: { canvasContext: CanvasRenderingContext2D; viewport: unknown; canvas?: HTMLCanvasElement }): { promise: Promise<void> };
}

/** Recorta e reduz a figura pedida. `conteudo` é o arquivo do documento (PDF ou imagem). */
export async function prepararImagem(conteudo: { tipo: string; base64: string }, figura: string, descricao: string): Promise<ImagemPronta> {
  const id = lerIdFigura(figura);
  if (!id) throw erroDeFigura(`"${figura}" não é um id de figura. Use o que veio na marca: p3-1 (figura), p3 (página inteira), img-2 (imagem do editor) ou arquivo.`);
  const bytes = base64ParaBytes(conteudo.base64);
  if (/^image\//i.test(conteudo.tipo)) {
    if (/svg/i.test(conteudo.tipo)) throw erroDeFigura("Imagem SVG não é lida nesta versão.");
    const bitmap = await createImageBitmap(new Blob([bytes], { type: conteudo.tipo }));
    try {
      return paraJpeg(bitmap, { x: 0, y: 0, largura: bitmap.width, altura: bitmap.height }, descricao);
    } finally {
      bitmap.close();
    }
  }
  if (conteudo.tipo !== "application/pdf") throw erroDeFigura(`Arquivo ${conteudo.tipo}: só PDF e imagem têm figura para ver.`);
  if (id.tipo !== "figura" && id.tipo !== "pagina") throw erroDeFigura(`"${figura}" não vale para PDF: use p3-1 (figura) ou p3 (página inteira).`);
  // Mesmo teto de páginas da leitura, sem o de tempo: a numeração das
  // figuras tem de bater com a das marcas, e o tempo varia de uma vez para outra.
  const caixa = id.tipo === "figura" ? figuraNoDocumento((await paginasVistasDoPdf(bytes, { maxPaginas: ORCAMENTO_FIGURAS.maxPaginas, maxMs: Infinity })).paginas, id) : null;
  return comPdf(bytes, async (doc) => {
    if (id.pagina > doc.numPages) throw erroDeFigura(`O documento tem ${doc.numPages} página(s); não existe a página ${id.pagina}.`);
    const pagina = (await doc.getPage(id.pagina)) as unknown as PaginaRenderizavel;
    const [x0 = 0, y0 = 0, x1 = 0, y1 = 0] = pagina.view;
    const dims = { largura: x1 - x0, altura: y1 - y0, rotacao: pagina.rotate ?? 0 };
    const alvo = caixa ?? { x: 0, y: 0, largura: dims.largura, altura: dims.altura };
    const escala = Math.min(ESCALA_MAXIMA, LADO_MAXIMO / Math.max(alvo.largura, alvo.altura, 1));
    const viewport = pagina.getViewport({ scale: escala });
    const tela = document.createElement("canvas");
    tela.width = Math.ceil(viewport.width);
    tela.height = Math.ceil(viewport.height);
    const ctx = tela.getContext("2d");
    if (!ctx) throw new Error("O navegador não deixou desenhar a página.");
    await pagina.render({ canvasContext: ctx, viewport, canvas: tela }).promise;
    return paraJpeg(tela, retanguloEmPixels(alvo, dims, escala, caixa ? MARGEM : 0), descricao);
  });
}
