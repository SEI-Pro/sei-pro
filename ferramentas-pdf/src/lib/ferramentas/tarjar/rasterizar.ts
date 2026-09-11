/**
 * Rasterização de página com as tarjas queimadas no bitmap, e a fonte de
 * documento que o motor consome.
 *
 * É a metade do tarjamento que só existe no navegador: depende de `pdf.js`,
 * de `OffscreenCanvas` e de `convertToBlob`. O motor em `tarjar.ts` não importa
 * nada disto — recebe por injeção — e é por isso que ele pode ser exercitado
 * inteiro num script Node.
 *
 * A DECISÃO QUE MAIS REDUZ RISCO AQUI é rasterizar sempre com `rotation: 0` e
 * deixar o `/Rotate` intacto na página de saída. O bitmap fica no espaço nativo
 * da página, o leitor gira como girava antes, e — o que importa de verdade — as
 * coordenadas de `getTextContent()` vão direto para a camada de texto sem
 * nenhuma conversão. Rasterizar já rotacionado e zerar o `/Rotate` obrigaria a
 * trocar largura por altura no MediaBox em 90 e 270 graus, quebraria "o mesmo
 * MediaBox de antes" e faria o resultado divergir do original em qualquer
 * junção posterior.
 */

import type { PDFPageProxy } from "pdfjs-dist";

import type { Caixa } from "./geometria";
import type {
  FonteDoDocumento,
  PaginaRasterizada,
  PerfilRaster,
  Rasterizador,
} from "./tarjar";
import { ErroFerramenta } from "../erros";
import { carregarPdfJs, opcoesDocumento } from "../pdfjs";

/**
 * Teto de pixels por página.
 *
 * NÃO É PRECAUÇÃO TEÓRICA. O Chrome recusa canvas acima de ~268 Mpx com erro,
 * o que seria administrável; o Safari no iOS devolve o canvas EM BRANCO acima
 * de ~16,7 Mpx, sem lançar exceção nenhuma. Numa ferramenta de tarja isso
 * significaria entregar uma página em branco anunciando que a tarja foi
 * aplicada — a falha mais cara possível. Uma A4 a 300 dpi tem 8,7 Mpx, então o
 * teto abaixo só morde papel grande, e nesse caso reduz a resolução em vez de
 * falhar.
 */
const LIMITE_PIXELS_PADRAO = 12_000_000;
const LIMITE_PIXELS_TOQUE = 6_000_000;

/** Abaixo desta luminância, o pixel conta como "tinta no papel". */
const LIMIAR_PIXEL_ESCURO = 200;

/** De quantos em quantos pixels a varredura anda, em cada eixo. */
const PASSO_VARREDURA = 3;

/** O navegador tem o que este caminho exige? */
export function rasterizacaoDisponivel(): boolean {
  return (
    typeof OffscreenCanvas !== "undefined" &&
    typeof createImageBitmap === "function" &&
    "convertToBlob" in OffscreenCanvas.prototype
  );
}

function limiteDePixels(): number {
  const toque =
    typeof navigator !== "undefined" && (navigator.maxTouchPoints ?? 0) > 0;
  return toque ? LIMITE_PIXELS_TOQUE : LIMITE_PIXELS_PADRAO;
}

/**
 * O bitmap tem alguma tinta, ou saiu em branco?
 *
 * A PRIMEIRA VERSÃO DISTO ESTAVA ERRADA e o erro só apareceu ao rodar a
 * ferramenta sobre um documento de verdade: ela comparava a luminância MÉDIA
 * com um limiar alto, e uma página de texto é quase toda branca — a média fica
 * em torno de 252. Resultado: toda página normal era acusada de ter saído em
 * branco, e o tarjamento falhava sempre.
 *
 * A pergunta certa não é "quão claro está", é "existe ao menos um pixel
 * escuro". A varredura para no primeiro que encontra, o que na prática
 * significa parar na primeira linha de texto.
 */
function temPixelEscuro(ctx: OffscreenCanvasRenderingContext2D, l: number, a: number): boolean {
  const dados = ctx.getImageData(0, 0, l, a).data;
  for (let y = 0; y < a; y += PASSO_VARREDURA) {
    const base = y * l * 4;
    for (let x = 0; x < l; x += PASSO_VARREDURA) {
      const i = base + x * 4;
      const luminancia = 0.2126 * dados[i] + 0.7152 * dados[i + 1] + 0.0722 * dados[i + 2];
      if (luminancia < LIMIAR_PIXEL_ESCURO) return true;
    }
  }
  return false;
}

/**
 * Cria a fonte de documento do navegador.
 *
 * Abre o PDF UMA vez no pdf.js e serve as três coisas que o motor precisa:
 * quantas páginas há, o texto de cada uma, e a rasterização com as tarjas
 * queimadas.
 */
export async function criarFontePdfJs(
  bytes: Uint8Array,
  senha?: string,
): Promise<FonteDoDocumento> {
  if (!rasterizacaoDisponivel()) {
    throw new ErroFerramenta("RASTERIZACAO_INDISPONIVEL", {});
  }

  const pdfjs = await carregarPdfJs();
  // Cópia obrigatória: o pdf.js DESTACA o buffer que recebe, e quem chamou
  // ainda precisa dos bytes originais para o pdf-lib abrir o documento.
  // A tarefa de carga precisa ficar guardada: a partir do pdf.js 6 o `destroy()`
  // vive nela, e não mais no documento. Chamar `doc.destroy()` compila em 5.x e
  // some em 6.x — e sem destruir, o worker do pdf.js fica vivo depois que a
  // ferramenta fecha, segurando o documento inteiro na memória.
  const tarefa = pdfjs.getDocument(opcoesDocumento(new Uint8Array(bytes), senha));
  const doc = await tarefa.promise;

  const rasterizar: Rasterizador = async ({ pagina, tarjas, perfil, cancelado }) => {
    const pag = await doc.getPage(pagina);
    try {
      return await rasterizarPagina(pag, tarjas, perfil, pagina, cancelado);
    } finally {
      pag.cleanup();
    }
  };

  return {
    totalDePaginas: doc.numPages,
    rasterizar,
    async lerTexto(pagina: number) {
      const pag = await doc.getPage(pagina);
      try {
        const conteudo = await pag.getTextContent();
        return conteudo as unknown as Awaited<ReturnType<FonteDoDocumento["lerTexto"]>>;
      } catch {
        // Página sem texto extraível não é erro: é digitalização. A camada
        // invisível simplesmente não tem o que reescrever ali.
        return null;
      } finally {
        pag.cleanup();
      }
    },
    async destruir() {
      await tarefa.destroy();
    },
  };
}

async function rasterizarPagina(
  pag: PDFPageProxy,
  tarjas: Caixa[],
  perfil: PerfilRaster,
  numeroDaPagina: number,
  cancelado?: () => boolean,
): Promise<PaginaRasterizada> {
  // Página sem texto é quase sempre digitalização: rasterizar acima de 200 dpi
  // triplica o arquivo sem acrescentar um pixel de informação.
  let dpi = perfil.dpi;
  try {
    const conteudo = await pag.getTextContent();
    if (conteudo.items.length === 0) dpi = Math.min(dpi, 200);
  } catch {
    dpi = Math.min(dpi, 200);
  }

  // `rotation: 0` SEMPRE. Ver o comentário no topo do arquivo.
  let escala = dpi / 72;
  let viewport = pag.getViewport({ scale: escala, rotation: 0 });

  const limite = limiteDePixels();
  const pixels = viewport.width * viewport.height;
  if (pixels > limite) {
    escala *= Math.sqrt(limite / pixels);
    dpi = Math.round(escala * 72);
    viewport = pag.getViewport({ scale: escala, rotation: 0 });
  }

  const largura = Math.max(1, Math.floor(viewport.width));
  const altura = Math.max(1, Math.floor(viewport.height));

  const canvas = new OffscreenCanvas(largura, altura);
  // `willReadFrequently` porque este contexto é lido de volta várias vezes: uma
  // na guarda de canvas em branco e uma por item descartado na autoconferência
  // de eixo. Sem a dica, o Chrome mantém o bitmap na GPU e cada `getImageData`
  // paga uma transferência.
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new ErroFerramenta("RASTERIZACAO_INDISPONIVEL", {});

  // Fundo branco explícito: o canvas nasce transparente, e transparência num
  // JPEG vira preto.
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, largura, altura);

  await pag.render({
    canvas: canvas as unknown as HTMLCanvasElement,
    canvasContext: ctx as unknown as CanvasRenderingContext2D,
    viewport,
  }).promise;

  if (cancelado?.()) throw new ErroFerramenta("FALHA_INESPERADA", {});

  // O canvas em branco silencioso do Safari: se a página TEM texto e mesmo
  // assim o bitmap saiu todo claro, algo falhou sem avisar. Abortar é a única
  // resposta honesta — entregar seria anunciar uma tarja sobre nada.
  try {
    const conteudo = await pag.getTextContent();
    if (conteudo.items.length > 0 && !temPixelEscuro(ctx, largura, altura)) {
      throw new ErroFerramenta("PAGINA_GRANDE_DEMAIS", { pagina: numeroDaPagina });
    }
  } catch (e) {
    if (e instanceof ErroFerramenta) throw e;
  }

  // `rawDims` é declarado como `Object` nos tipos do pdf.js; a forma real está
  // em `pdf.mjs:1290` e é o viewBox da página (CropBox ∩ MediaBox).
  const { pageX, pageY, pageWidth, pageHeight } = viewport.rawDims as {
    pageWidth: number;
    pageHeight: number;
    pageX: number;
    pageY: number;
  };
  const view: [number, number, number, number] = [
    pageX,
    pageY,
    pageX + pageWidth,
    pageY + pageHeight,
  ];

  // Queima as tarjas. A conversão sai do próprio pdf.js: reimplementá-la seria
  // reabrir a porta para o erro de sinal em Y que a autoconferência existe
  // para pegar.
  ctx.fillStyle = "#000000";
  for (const tarja of tarjas) {
    const [ax, ay] = viewport.convertToViewportPoint(tarja.x0, tarja.y0);
    const [bx, by] = viewport.convertToViewportPoint(tarja.x1, tarja.y1);
    const x = Math.floor(Math.min(ax, bx));
    const y = Math.floor(Math.min(ay, by));
    const l = Math.ceil(Math.abs(bx - ax));
    const a = Math.ceil(Math.abs(by - ay));
    if (l > 0 && a > 0) ctx.fillRect(x, y, l, a);
  }

  const blob = await canvas.convertToBlob({
    type: "image/jpeg",
    quality: perfil.qualidade,
  });
  const bytes = new Uint8Array(await blob.arrayBuffer());

  return {
    bytes,
    larguraPx: largura,
    alturaPx: altura,
    dpiEfetivo: dpi,
    view,
    amostrarPixelDoUsuario(x: number, y: number) {
      const [px, py] = viewport.convertToViewportPoint(x, y);
      const ix = Math.round(px);
      const iy = Math.round(py);
      if (ix < 0 || iy < 0 || ix >= largura || iy >= altura) return null;
      const d = ctx.getImageData(ix, iy, 1, 1).data;
      return [d[0], d[1], d[2]];
    },
  };
}
