/**
 * Conversão de imagens em PDF.
 *
 * O caso de uso real é a foto do documento tirada no celular, ou a página
 * digitalizada que saiu como JPG. O órgão aceita PDF; o que a pessoa tem é
 * imagem.
 */

import { PDFDocument, PDFImage } from "@cantoo/pdf-lib";

import type {
  ArquivoEntrada,
  ProgressoCallback,
  ResultadoOperacao,
} from "@/types/ferramentas";
import { ErroFerramenta, comoErroFerramenta } from "./erros";
import { conferirCancelamento, OperacaoCancelada } from "./juntar";
import { higienizarNome, semExtensaoPdf } from "./nomearArquivos";

/** A4 em pontos PostScript (1 pt = 1/72 pol). */
const A4 = { largura: 595.28, altura: 841.89 };

export type TamanhoPagina = "a4" | "ajustar";

export interface OpcoesImagemParaPdf {
  /**
   * "a4" põe cada imagem numa página A4, centralizada e com margem — é o que o
   * protocolo espera, porque a peça é lida e impressa em papel.
   * "ajustar" faz a página do tamanho exato da imagem.
   */
  tamanhoPagina?: TamanhoPagina;
  margemMm?: number;
  nomeSaida?: string;
  aoProgredir?: ProgressoCallback;
  cancelado?: () => boolean;
}

const MM_POR_POLEGADA = 25.4;
const PONTOS_POR_POLEGADA = 72;

function mmParaPontos(mm: number): number {
  return (mm / MM_POR_POLEGADA) * PONTOS_POR_POLEGADA;
}

/** Assinaturas de arquivo, porque a extensão do nome não prova nada. */
function detectarFormato(bytes: Uint8Array): "jpg" | "png" | null {
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "jpg";
  if (
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47
  ) {
    return "png";
  }
  return null;
}

export async function imagensParaPdf(
  entradas: ArquivoEntrada[],
  opcoes: OpcoesImagemParaPdf = {},
): Promise<ResultadoOperacao> {
  const {
    tamanhoPagina = "a4",
    margemMm = 10,
    nomeSaida,
    aoProgredir,
    cancelado,
  } = opcoes;

  if (entradas.length === 0) throw new ErroFerramenta("NENHUM_ARQUIVO");

  try {
    const doc = await PDFDocument.create();
    const margem = mmParaPontos(margemMm);
    aoProgredir?.(0, entradas.length);

    for (let i = 0; i < entradas.length; i += 1) {
      conferirCancelamento(cancelado);
      const entrada = entradas[i];
      const formato = detectarFormato(entrada.bytes);

      if (!formato) {
        // HEIC do iPhone cai aqui. Não há decodificador HEIC no navegador sem
        // biblioteca extra, e o próprio iOS converte para JPG ao compartilhar.
        throw new ErroFerramenta("TIPO_NAO_SUPORTADO", { nome: entrada.nome });
      }

      let imagem: PDFImage;
      try {
        imagem =
          formato === "jpg"
            ? await doc.embedJpg(entrada.bytes)
            : await doc.embedPng(entrada.bytes);
      } catch {
        throw new ErroFerramenta("ARQUIVO_CORROMPIDO", { nome: entrada.nome });
      }

      if (tamanhoPagina === "ajustar") {
        const pagina = doc.addPage([imagem.width, imagem.height]);
        pagina.drawImage(imagem, { x: 0, y: 0, width: imagem.width, height: imagem.height });
      } else {
        // Retrato ou paisagem conforme a imagem, para não deitar uma foto
        // horizontal numa página vertical e desperdiçar metade da folha.
        const deitada = imagem.width > imagem.height;
        const largura = deitada ? A4.altura : A4.largura;
        const altura = deitada ? A4.largura : A4.altura;
        const pagina = doc.addPage([largura, altura]);

        const util = { largura: largura - margem * 2, altura: altura - margem * 2 };
        const escala = Math.min(util.largura / imagem.width, util.altura / imagem.height);
        const w = imagem.width * escala;
        const h = imagem.height * escala;

        pagina.drawImage(imagem, {
          x: (largura - w) / 2,
          y: (altura - h) / 2,
          width: w,
          height: h,
        });
      }

      aoProgredir?.(i + 1, entradas.length);
    }

    const bytes = await doc.save({ useObjectStreams: true });
    const raiz = nomeSaida
      ? higienizarNome(semExtensaoPdf(nomeSaida))
      : higienizarNome(semExtensaoPdf(entradas[0].nome), "documento");

    return { bytes, nomeArquivo: `${raiz}.pdf` };
  } catch (e) {
    if (e instanceof OperacaoCancelada) throw e;
    throw comoErroFerramenta(e);
  }
}
