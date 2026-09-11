/**
 * OCR: torna pesquisável um PDF digitalizado, sem enviá-lo a lugar nenhum.
 *
 * POR QUE ISTO IMPORTA PARA O PÚBLICO DA PÁGINA. A Portaria 11/2016 e os
 * manuais de peticionamento de vários órgãos exigem documento digitalizado com
 * reconhecimento óptico de caracteres; o CADE o faz por resolução própria. A
 * orientação oficial que esses manuais dão é baixar um programa de desktop. As
 * alternativas online mandam o documento para um servidor, o que para petição
 * sob sigilo é exatamente o que não se pode fazer.
 *
 * A ESTRATÉGIA, e ela decide a qualidade do resultado: o PDF ORIGINAL é
 * preservado, e sobre cada página é escrita uma camada de texto INVISÍVEL nas
 * coordenadas em que o Tesseract encontrou cada palavra. O documento continua
 * com a mesma aparência e o mesmo tamanho de imagem; o que muda é que passa a
 * ser pesquisável e a permitir copiar texto. A alternativa preguiçosa seria
 * rasterizar tudo e montar um PDF novo, o que degrada a imagem e costuma
 * inchar o arquivo — justamente o oposto do que quem tem limite de MB precisa.
 *
 * ONDE ISTO RODA: na thread da aba, e não no worker de PDF do projeto. O
 * trabalho pesado já acontece dentro do worker do próprio Tesseract, então não
 * há ganho em empilhar mais um nível — e haveria risco: worker aninhado só é
 * suportado no Safari a partir da 16.4, e a falha apareceria como tela morta
 * apenas no navegador de quem usa Mac antigo.
 */

import { PDFDocument, StandardFonts, TextRenderingMode } from "@cantoo/pdf-lib";
import {
  beginText,
  endText,
  moveText,
  popGraphicsState,
  pushGraphicsState,
  setFontAndSize,
  setTextRenderingMode,
  showText,
} from "@cantoo/pdf-lib";

import type { ArquivoEntrada, ProgressoCallback } from "@/types/ferramentas";
import { comoErroFerramenta, ErroFerramenta } from "./erros";
import { conferirCancelamento, OperacaoCancelada } from "./juntar";
import { higienizarNome, semExtensaoPdf } from "./nomearArquivos";
import { carregarPdfJs, opcoesDocumento } from "./pdfjs";
import { higienizarTexto } from "./textoWinAnsi";
import {
  CAMINHOS_TESSERACT,
  DPI_PADRAO,
  IDIOMA_OCR,
  MAX_PAGINAS_OCR, suportaSimd } from "./tesseract";

export interface OpcoesOcr {
  aoProgredir?: ProgressoCallback;
  cancelado?: () => boolean;
  /** Resolução de rasterização. Ver a justificativa de 200 dpi em `tesseract.ts`. */
  dpi?: number;
  /**
   * Pula páginas que já têm camada de texto.
   *
   * Ligado por padrão. Rodar OCR sobre página que já é pesquisável não melhora
   * nada e ainda sobrepõe uma segunda camada de texto, o que faz a busca no
   * leitor encontrar a mesma palavra duas vezes.
   */
  pularPaginasComTexto?: boolean;
}

export interface ResultadoOcr {
  bytes: Uint8Array;
  nomeArquivo: string;
  paginasProcessadas: number;
  /** Páginas ignoradas por já terem texto. */
  paginasPuladas: number;
  palavrasReconhecidas: number;
  /** Nenhuma palavra foi encontrada em página nenhuma. */
  semTexto: boolean;
}

/** Palavra reconhecida, em coordenadas do canvas rasterizado. */
interface PalavraOcr {
  texto: string;
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  confianca: number;
}

/** O navegador tem o que este caminho exige? */
export function ocrDisponivel(): boolean {
  return (
    typeof OffscreenCanvas !== "undefined" &&
    typeof createImageBitmap === "function" &&
    "convertToBlob" in OffscreenCanvas.prototype &&
    // O core empacotado é a variante SIMD, única das três para não pesar 7,8 MB
    // a mais. Sem esta checagem o worker morre sem mensagem e o usuário vê o
    // OCR "travar" para sempre, em vez de ler que o navegador não serve.
    suportaSimd()
  );
}

type WorkerTesseract = {
  recognize: (
    imagem: Blob,
    opcoes?: Record<string, unknown>,
    saida?: Record<string, boolean>,
  ) => Promise<{ data: unknown }>;
  terminate: () => Promise<unknown>;
};

async function criarWorker(
  aoProgredir?: (fracao: number) => void,
): Promise<WorkerTesseract> {
  const { createWorker } = await import("tesseract.js");

  // A CHAVE `logger` SÓ PODE EXISTIR SE HOUVER FUNÇÃO. O tesseract.js verifica
  // a presença da chave, não o valor, e chama o que estiver lá: passar
  // `logger: undefined` produz "logger is not a function" a cada mensagem do
  // worker. O sintoma é traiçoeiro, porque o reconhecimento não estoura — ele
  // termina devolvendo zero palavra, e a ferramenta diz que o documento não
  // tinha texto reconhecível.
  const opcoes: Record<string, unknown> = {
    // Todos os caminhos apontam para o nosso domínio. Ver `tesseract.ts`.
    workerPath: CAMINHOS_TESSERACT.worker,
    corePath: CAMINHOS_TESSERACT.core,
    langPath: CAMINHOS_TESSERACT.lang,
    // O modelo empacotado é o `.gz`.
    gzip: true,
    // OBRIGATÓRIO NA EXTENSÃO. Por padrão o tesseract.js baixa o worker e o
    // recria a partir de um `blob:` — e a política de segurança de MV3
    // (`script-src 'self'`) recusa worker de blob, com "Failed to construct
    // 'Worker'". Com `false`, o worker é carregado direto da URL da extensão,
    // que é mesma origem.
    workerBlobURL: false,
  };
  if (aoProgredir) {
    opcoes.logger = (m: { status?: string; progress?: number }) => {
      if (m.status === "recognizing text" && typeof m.progress === "number") {
        aoProgredir(m.progress);
      }
    };
  }

  return (await createWorker(
    IDIOMA_OCR,
    undefined,
    opcoes as never,
  )) as unknown as WorkerTesseract;
}

/**
 * Extrai as palavras com caixa delimitadora do retorno do Tesseract.
 *
 * A árvore é `blocks[] -> paragraphs[] -> lines[] -> words[]`, e a descida é
 * feita nível a nível de propósito, em vez de uma busca genérica em
 * profundidade. Duas armadilhas justificam isso, e as duas já morderam:
 *
 * 1. `data.blocks` é um ARRAY. Entregá-lo a uma função que espera um nó faz a
 *    travessia morrer no primeiro passo, sem erro nenhum: o resultado é zero
 *    palavra e a ferramenta anuncia que o documento não tinha texto.
 * 2. Bloco, parágrafo, linha e palavra têm todos `text` e `bbox`. Um critério
 *    de folha por "tem texto e caixa" captura o bloco inteiro como se fosse
 *    uma palavra só, e a camada invisível sai com o texto da página empilhado
 *    num ponto.
 */
function extrairPalavras(data: unknown): PalavraOcr[] {
  const palavras: PalavraOcr[] = [];

  const acrescentar = (no: unknown) => {
    const n = no as {
      text?: unknown;
      confidence?: unknown;
      bbox?: { x0: number; y0: number; x1: number; y1: number };
    };
    if (!n?.bbox || typeof n.text !== "string") return;
    palavras.push({
      texto: n.text,
      x0: n.bbox.x0,
      y0: n.bbox.y0,
      x1: n.bbox.x1,
      y1: n.bbox.y1,
      confianca: typeof n.confidence === "number" ? n.confidence : 0,
    });
  };

  const d = data as {
    blocks?: Array<{ paragraphs?: Array<{ lines?: Array<{ words?: unknown[] }> }> }> | null;
    words?: unknown[];
  };

  for (const bloco of d?.blocks ?? []) {
    for (const paragrafo of bloco?.paragraphs ?? []) {
      for (const linha of paragrafo?.lines ?? []) {
        for (const palavra of linha?.words ?? []) acrescentar(palavra);
      }
    }
  }

  // Formato antigo do tesseract.js, com `words` no topo. Mantido como recuo
  // para que uma mudança de versão degrade em vez de zerar o resultado.
  if (palavras.length === 0 && Array.isArray(d?.words)) d.words.forEach(acrescentar);

  return palavras;
}

export async function ocrPdf(
  arquivo: ArquivoEntrada,
  opcoes: OpcoesOcr = {},
): Promise<ResultadoOcr> {
  const {
    aoProgredir,
    cancelado,
    dpi = DPI_PADRAO,
    pularPaginasComTexto = true,
  } = opcoes;

  if (!ocrDisponivel()) {
    throw new ErroFerramenta("NAVEGADOR_SEM_SUPORTE", {});
  }

  let worker: WorkerTesseract | null = null;

  try {
    const pdfjs = await carregarPdfJs();
    const doc = await pdfjs.getDocument(
      opcoesDocumento(new Uint8Array(arquivo.bytes), arquivo.senha),
    ).promise;

    const total = Math.min(doc.numPages, MAX_PAGINAS_OCR);
    // `ignoreEncryption` porque um digitalizado costuma trazer restrição de
    // edição do próprio scanner. Sem isso, o pdf-lib recusa o arquivo que o
    // pdf.js abriu sem reclamar, e o usuário não entende a diferença.
    const saida = await PDFDocument.load(new Uint8Array(arquivo.bytes), {
      ignoreEncryption: true,
    });
    const fonte = await saida.embedFont(StandardFonts.Helvetica);

    let paginasProcessadas = 0;
    let paginasPuladas = 0;
    let palavrasReconhecidas = 0;

    for (let i = 1; i <= total; i += 1) {
      conferirCancelamento(cancelado);
      aoProgredir?.(i - 1, total);

      const pagina = await doc.getPage(i);

      if (pularPaginasComTexto) {
        const conteudo = await pagina.getTextContent();
        const jaTemTexto = conteudo.items.some(
          (it) => "str" in it && typeof it.str === "string" && it.str.trim().length > 2,
        );
        if (jaTemTexto) {
          paginasPuladas += 1;
          pagina.cleanup();
          continue;
        }
      }

      // pdf.js entrega o viewport em pontos a 72 dpi; a escala é a razão.
      const escala = dpi / 72;
      const viewport = pagina.getViewport({ scale: escala });
      const canvas = new OffscreenCanvas(
        Math.max(1, Math.floor(viewport.width)),
        Math.max(1, Math.floor(viewport.height)),
      );
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new ErroFerramenta("NAVEGADOR_SEM_SUPORTE", {});

      await pagina.render({
        canvas: canvas as unknown as HTMLCanvasElement,
        canvasContext: ctx as unknown as CanvasRenderingContext2D,
        viewport,
      }).promise;

      conferirCancelamento(cancelado);

      if (!worker) {
        worker = await criarWorker();
      }

      const blob = await canvas.convertToBlob({ type: "image/png" });
      // `blocks: true` NÃO É OPCIONAL AQUI. Por padrão o tesseract.js devolve
      // apenas `text` corrido e deixa `blocks` em null, e sem a árvore de
      // blocos não há caixa delimitadora de palavra — ou seja, não há onde
      // posicionar a camada invisível. O sintoma sem isto é cruel: o
      // reconhecimento funciona, a confiança vem alta, e mesmo assim o
      // resultado é "nenhum texto reconhecido".
      const { data } = await worker.recognize(blob, {}, { blocks: true, text: true });
      const palavras = extrairPalavras(data);

      const paginaSaida = saida.getPage(i - 1);
      const { width: larguraPt, height: alturaPt } = paginaSaida.getSize();
      // A razão entre o PDF e o que foi rasterizado. Usar `viewport` e não o
      // dpi nominal: o canvas foi arredondado para inteiro, e um pixel de
      // diferença desloca a camada inteira em documento longo.
      const porPixelX = larguraPt / canvas.width;
      const porPixelY = alturaPt / canvas.height;

      paginaSaida.setFont(fonte);
      const [, chaveFonte] = paginaSaida.getFont();

      let escritas = 0;
      for (const p of palavras) {
        // Confiança baixa costuma ser ruído de borda e mancha de digitalização.
        // Deixar entrar suja a busca com lixo que o usuário não vê e não
        // consegue explicar.
        if (p.confianca < 40) continue;
        const texto = higienizarTexto(p.texto);
        if (!texto) continue;

        const alturaCaixaPt = (p.y1 - p.y0) * porPixelY;
        if (alturaCaixaPt <= 0.5) continue;

        // O eixo Y do Tesseract cresce para baixo; o do PDF, para cima.
        const x = p.x0 * porPixelX;
        const y = alturaPt - p.y1 * porPixelY;

        paginaSaida.pushOperators(
          pushGraphicsState(),
          beginText(),
          // Modo 3: o texto entra no documento, é buscável e copiável, e não
          // é desenhado. É assim que um PDF pesquisável de verdade é feito.
          setTextRenderingMode(TextRenderingMode.Invisible),
          setFontAndSize(chaveFonte, alturaCaixaPt),
          moveText(x, y),
          showText(fonte.encodeText(texto)),
          endText(),
          popGraphicsState(),
        );
        escritas += 1;
      }

      palavrasReconhecidas += escritas;
      paginasProcessadas += 1;
      // Libera o que o pdf.js reteve desta página. Sem isto, um documento de
      // 100 páginas mantém as 100 na memória até o documento inteiro morrer.
      pagina.cleanup();
      aoProgredir?.(i, total);
    }

    conferirCancelamento(cancelado);

    const bytes = await saida.save({ useObjectStreams: true });
    const raiz = higienizarNome(semExtensaoPdf(arquivo.nome));

    return {
      bytes,
      nomeArquivo: `${raiz}-pesquisavel.pdf`,
      paginasProcessadas,
      paginasPuladas,
      palavrasReconhecidas,
      semTexto: palavrasReconhecidas === 0 && paginasProcessadas > 0,
    };
  } catch (e) {
    if (e instanceof OperacaoCancelada) throw e;
    if (e instanceof ErroFerramenta) throw e;
    throw comoErroFerramenta(e, "FALHA_INESPERADA", { nome: arquivo.nome });
  } finally {
    // O worker do Tesseract segura o modelo inteiro em memória. Não encerrar
    // deixaria alguns megabytes presos por uso, e quem processa vários
    // arquivos seguidos acabaria com a aba morta sem entender por quê.
    if (worker) {
      try {
        await worker.terminate();
      } catch {
        /* encerrar é melhor esforço; não pode derrubar um OCR bem-sucedido */
      }
    }
  }
}
