/**
 * Numeração de páginas.
 *
 * Para quem protocola, isto não é enfeite: peça remetida sem paginação obriga
 * o servidor a numerar do outro lado, e petição que remete a "fls. 42" precisa
 * que a folha 42 exista de fato.
 */

import { PDFFont, StandardFonts, rgb } from "@cantoo/pdf-lib";

import type {
  ArquivoEntrada,
  ProgressoCallback,
  ResultadoOperacao,
} from "@/types/ferramentas";
import { abrirPdf } from "./analisarPdf";
import { comoErroFerramenta } from "./erros";
import { conferirCancelamento, OperacaoCancelada } from "./juntar";
import { higienizarNome, semExtensaoPdf } from "./nomearArquivos";

export type PosicaoNumero =
  | "inferiorDireito"
  | "inferiorCentro"
  | "inferiorEsquerdo"
  | "superiorDireito"
  | "superiorCentro"
  | "superiorEsquerdo";

export type FormatoNumero =
  /** 1 */
  | "simples"
  /** 1 de 20 */
  | "comTotal"
  /** fls. 1 */
  | "folha"
  /** Fl. 1 de 20 */
  | "folhaComTotal";

export interface OpcoesNumeracao {
  posicao?: PosicaoNumero;
  formato?: FormatoNumero;
  /** Número impresso na primeira página numerada. Útil para continuar um volume. */
  comecarEm?: number;
  /** Deixa a capa sem número, prática comum em peça com folha de rosto. */
  pularPrimeira?: boolean;
  tamanhoFonte?: number;
  aoProgredir?: ProgressoCallback;
  cancelado?: () => boolean;
}

const MARGEM = 28;

function textoDoNumero(
  formato: FormatoNumero,
  numero: number,
  total: number,
): string {
  switch (formato) {
    case "comTotal":
      return `${numero} de ${total}`;
    case "folha":
      return `fls. ${numero}`;
    case "folhaComTotal":
      return `fls. ${numero} de ${total}`;
    default:
      return String(numero);
  }
}

function coordenadas(
  posicao: PosicaoNumero,
  largura: number,
  altura: number,
  larguraTexto: number,
  tamanhoFonte: number,
): { x: number; y: number } {
  const emCima = posicao.startsWith("superior");
  const y = emCima ? altura - MARGEM - tamanhoFonte : MARGEM;

  if (posicao.endsWith("Esquerdo")) return { x: MARGEM, y };
  if (posicao.endsWith("Centro")) return { x: (largura - larguraTexto) / 2, y };
  return { x: largura - MARGEM - larguraTexto, y };
}

export async function numerarPaginas(
  entrada: ArquivoEntrada,
  opcoes: OpcoesNumeracao = {},
): Promise<ResultadoOperacao> {
  const {
    posicao = "inferiorDireito",
    formato = "simples",
    comecarEm = 1,
    pularPrimeira = false,
    tamanhoFonte = 10,
    aoProgredir,
    cancelado,
  } = opcoes;

  try {
    const doc = await abrirPdf(entrada.bytes, {
      nome: entrada.nome,
      senha: entrada.senha,
    });

    // Helvetica é uma das 14 fontes padrão do PDF: não precisa ser embutida e
    // sua codificação WinAnsi cobre o português, inclusive ç, ã e é. Texto
    // livre do usuário exigiria fontkit e uma TTF embutida (~300 KB), e por
    // isso ficou fora desta versão.
    const fonte: PDFFont = await doc.embedFont(StandardFonts.Helvetica);

    const paginas = doc.getPages();
    const numeradas = pularPrimeira ? paginas.slice(1) : paginas;
    const total = numeradas.length;
    aoProgredir?.(0, total);

    for (let i = 0; i < numeradas.length; i += 1) {
      conferirCancelamento(cancelado);
      const pagina = numeradas[i];
      const texto = textoDoNumero(formato, comecarEm + i, comecarEm + total - 1);
      const larguraTexto = fonte.widthOfTextAtSize(texto, tamanhoFonte);

      // getSize() já devolve a caixa considerando a rotação da página, então
      // uma folha digitalizada de lado recebe o número no canto certo.
      const { width, height } = pagina.getSize();
      const { x, y } = coordenadas(posicao, width, height, larguraTexto, tamanhoFonte);

      pagina.drawText(texto, {
        x,
        y,
        size: tamanhoFonte,
        font: fonte,
        color: rgb(0.1, 0.1, 0.1),
      });

      aoProgredir?.(i + 1, total);
    }

    const bytes = await doc.save({ useObjectStreams: true });
    const raiz = higienizarNome(semExtensaoPdf(entrada.nome), "documento");

    return { bytes, nomeArquivo: `${raiz}-numerado.pdf` };
  } catch (e) {
    if (e instanceof OperacaoCancelada) throw e;
    throw comoErroFerramenta(e, "FALHA_INESPERADA", { nome: entrada.nome });
  }
}
