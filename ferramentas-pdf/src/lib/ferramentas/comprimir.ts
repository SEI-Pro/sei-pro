/**
 * Compressão de PDF.
 *
 * ESTE É O MÓDULO MAIS PERIGOSO DA SUÍTE, e a razão não é o risco de falhar:
 * é o risco de ter SUCESSO aparente e entregar um documento corrompido em
 * silêncio. A regra ingênua "só aplica se o arquivo ficar menor" não protege
 * contra isso, porque um JPEG CMYK reescrito como RGB fica menor E fica errado.
 *
 * Por isso a reamostragem opera sob LISTA DE ACEITAÇÃO: só toca no que sabe
 * tratar com segurança e PULA todo o resto sem tentar. Os casos pulados são
 * contados e devolvidos, para que a decisão sobre ampliar a lista seja tomada
 * com dado real e não por palpite.
 *
 * Fora da lista, por decisão:
 *   - JPXDecode (JPEG 2000): recodificar exigiria decodificador próprio.
 *   - JBIG2Decode e CCITTFaxDecode: são compressões BITONAIS, e não existe
 *     codificador delas em JavaScript. Converter para JPEG quase sempre AUMENTA
 *     o arquivo, que é o oposto do pedido.
 *   - Qualquer imagem com /SMask, /Mask ou /Decode: transparência e inversão
 *     de faixa se perdem na reamostragem.
 *   - JPEG de 4 componentes (CMYK/YCCK): notoriamente mal suportado, e trocar
 *     os bytes sem reescrever /ColorSpace faz o leitor interpretar 3 canais
 *     como 4.
 */

import {
  PDFArray,
  PDFDict,
  PDFName,
  PDFNumber,
  PDFRawStream,
} from "@cantoo/pdf-lib";

import type {
  ArquivoEntrada,
  ProgressoCallback,
  ResultadoOperacao,
} from "@/types/ferramentas";
import { abrirPdf, diagnosticar } from "./analisarPdf";
import { ErroFerramenta, comoErroFerramenta } from "./erros";
import { conferirCancelamento, OperacaoCancelada } from "./juntar";
import { higienizarNome, semExtensaoPdf } from "./nomearArquivos";

export type NivelCompressao =
  /** Só reescrita estrutural. Sem perda, sem risco. */
  | "estrutural"
  /** Reamostra imagens grandes com qualidade alta. */
  | "equilibrado"
  /** Reamostra com qualidade menor. Para quando precisa caber num teto. */
  | "agressivo";

export interface OpcoesCompressao {
  nivel?: NivelCompressao;
  /** Quando informado, busca a maior qualidade que ainda cabe neste teto. */
  alvoBytes?: number;
  aoProgredir?: ProgressoCallback;
  cancelado?: () => boolean;
}

export interface RelatorioCompressao extends ResultadoOperacao {
  bytesOriginais: number;
  bytesFinais: number;
  /** Imagens efetivamente reamostradas. */
  imagensReamostradas: number;
  /** Imagens deixadas intactas por não estarem na lista de aceitação. */
  imagensPuladas: number;
  /** A reamostragem não estava disponível neste ambiente. */
  reamostragemIndisponivel: boolean;
  /** Nada foi ganho: o arquivo devolvido é o original, intacto. */
  semGanho: boolean;
  /** Alvo pedido não foi alcançado, apesar de ter havido ganho. */
  alvoNaoAlcancado?: boolean;
}

interface Perfil {
  qualidade: number;
  /** Lado maior máximo, em pixels. Acima disso a imagem é reduzida. */
  ladoMaximo: number;
}

const PERFIS: Record<Exclude<NivelCompressao, "estrutural">, Perfil> = {
  equilibrado: { qualidade: 0.72, ladoMaximo: 2200 },
  agressivo: { qualidade: 0.5, ladoMaximo: 1600 },
};

/** Escada usada na busca por um alvo de tamanho, da melhor para a pior. */
const ESCADA: Perfil[] = [
  { qualidade: 0.82, ladoMaximo: 2600 },
  { qualidade: 0.72, ladoMaximo: 2200 },
  { qualidade: 0.6, ladoMaximo: 1800 },
  { qualidade: 0.5, ladoMaximo: 1600 },
  { qualidade: 0.4, ladoMaximo: 1300 },
  { qualidade: 0.32, ladoMaximo: 1100 },
];

/**
 * A reamostragem depende de OffscreenCanvas com convertToBlob, que só chegou
 * ao Safari 16.4. Sem isso, a compressão estrutural continua funcionando e a
 * interface avisa, em vez de cair em silêncio para a thread principal.
 */
export function reamostragemDisponivel(): boolean {
  return (
    typeof OffscreenCanvas !== "undefined" &&
    typeof createImageBitmap === "function" &&
    "convertToBlob" in OffscreenCanvas.prototype
  );
}

function nomeDoFiltro(dict: PDFDict): string | null {
  const filtro = dict.get(PDFName.of("Filter"));
  if (filtro instanceof PDFName) return filtro.asString();
  // Array de filtros (ex.: [/FlateDecode /DCTDecode]) fica fora: a cadeia
  // precisaria ser desfeita na ordem certa antes de recodificar.
  if (filtro instanceof PDFArray) return null;
  return null;
}

/** Espaço de cor aceito: cinza ou RGB, diretos ou via perfil ICC de 1/3 canais. */
function espacoDeCorAceito(dict: PDFDict): boolean {
  const cs = dict.get(PDFName.of("ColorSpace"));
  if (cs instanceof PDFName) {
    const nome = cs.asString();
    return nome === "/DeviceRGB" || nome === "/DeviceGray";
  }
  if (cs instanceof PDFArray && cs.size() >= 2) {
    const tipo = cs.get(0);
    if (!(tipo instanceof PDFName) || tipo.asString() !== "/ICCBased") return false;
    // O número de componentes vive no stream apontado pelo segundo elemento.
    // Sem resolvê-lo com segurança, tratamos como não aceito.
    return false;
  }
  return false;
}

/** Aplica a lista de aceitação. Qualquer dúvida devolve false. */
function podeReamostrar(dict: PDFDict): boolean {
  const subtipo = dict.get(PDFName.of("Subtype"));
  if (!(subtipo instanceof PDFName) || subtipo.asString() !== "/Image") return false;

  if (nomeDoFiltro(dict) !== "/DCTDecode") return false;
  if (!espacoDeCorAceito(dict)) return false;

  const bpc = dict.get(PDFName.of("BitsPerComponent"));
  if (!(bpc instanceof PDFNumber) || bpc.asNumber() !== 8) return false;

  for (const proibido of ["SMask", "Mask", "Decode", "ImageMask"]) {
    if (dict.get(PDFName.of(proibido))) return false;
  }

  return true;
}

/** Recodifica um JPEG, reduzindo se passar do lado máximo. Devolve null se não ajudar. */
async function recodificarJpeg(
  bytes: Uint8Array,
  perfil: Perfil,
): Promise<{ bytes: Uint8Array; largura: number; altura: number } | null> {
  let bitmap: ImageBitmap;
  try {
    const copia = new Uint8Array(bytes);
    bitmap = await createImageBitmap(new Blob([copia], { type: "image/jpeg" }));
  } catch {
    return null;
  }

  try {
    const maior = Math.max(bitmap.width, bitmap.height);
    const escala = maior > perfil.ladoMaximo ? perfil.ladoMaximo / maior : 1;
    const largura = Math.max(1, Math.round(bitmap.width * escala));
    const altura = Math.max(1, Math.round(bitmap.height * escala));

    const canvas = new OffscreenCanvas(largura, altura);
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(bitmap, 0, 0, largura, altura);

    const blob = await canvas.convertToBlob({
      type: "image/jpeg",
      quality: perfil.qualidade,
    });
    const novos = new Uint8Array(await blob.arrayBuffer());

    // A regra de guarda: se não encolheu, o original fica.
    if (novos.byteLength >= bytes.byteLength) return null;

    return { bytes: novos, largura, altura };
  } catch {
    return null;
  } finally {
    bitmap.close();
  }
}

interface ResultadoPassada {
  bytes: Uint8Array;
  reamostradas: number;
  puladas: number;
}

/** Uma passada de compressão sobre uma cópia limpa do documento. */
async function passada(
  origemBytes: Uint8Array,
  nome: string,
  senha: string | undefined,
  perfil: Perfil | null,
  aoProgredir?: ProgressoCallback,
  cancelado?: () => boolean,
): Promise<ResultadoPassada> {
  // Recarrega do zero a cada passada: mutar o mesmo documento repetidamente
  // recomprimiria a imagem já comprimida, e o artefato se acumularia.
  const doc = await abrirPdf(origemBytes, { nome, senha });

  let reamostradas = 0;
  let puladas = 0;

  if (perfil) {
    const objetos = doc.context.enumerateIndirectObjects();
    const imagens = objetos.filter(
      ([, obj]) =>
        obj instanceof PDFRawStream &&
        obj.dict.get(PDFName.of("Subtype")) instanceof PDFName &&
        (obj.dict.get(PDFName.of("Subtype")) as PDFName).asString() === "/Image",
    );

    aoProgredir?.(0, imagens.length);

    for (let i = 0; i < imagens.length; i += 1) {
      conferirCancelamento(cancelado);
      const [ref, obj] = imagens[i];
      const stream = obj as PDFRawStream;

      if (!podeReamostrar(stream.dict)) {
        puladas += 1;
        aoProgredir?.(i + 1, imagens.length);
        continue;
      }

      const novo = await recodificarJpeg(stream.contents, perfil);
      if (!novo) {
        puladas += 1;
        aoProgredir?.(i + 1, imagens.length);
        continue;
      }

      const dict = stream.dict;
      dict.set(PDFName.of("Width"), PDFNumber.of(novo.largura));
      dict.set(PDFName.of("Height"), PDFNumber.of(novo.altura));
      dict.set(PDFName.of("Length"), PDFNumber.of(novo.bytes.byteLength));
      dict.set(PDFName.of("BitsPerComponent"), PDFNumber.of(8));
      // O canvas sempre entrega RGB, então o espaço de cor é reescrito junto
      // com os bytes. Deixar um /DeviceGray antigo aqui faria o leitor
      // interpretar 3 canais como 1.
      dict.set(PDFName.of("ColorSpace"), PDFName.of("DeviceRGB"));
      dict.set(PDFName.of("Filter"), PDFName.of("DCTDecode"));

      doc.context.assign(ref, PDFRawStream.of(dict, novo.bytes));
      reamostradas += 1;
      aoProgredir?.(i + 1, imagens.length);
    }
  }

  // `rewrite: true` força a reescrita completa dos objetos; sem ele, o
  // `useObjectStreams` do @cantoo/pdf-lib é condicional à versão do PDF e o
  // ganho estrutural pode simplesmente não acontecer.
  const bytes = await doc.save({ useObjectStreams: true, rewrite: true });
  return { bytes, reamostradas, puladas };
}

export async function comprimirPdf(
  entrada: ArquivoEntrada,
  opcoes: OpcoesCompressao = {},
): Promise<RelatorioCompressao> {
  const { nivel = "equilibrado", alvoBytes, aoProgredir, cancelado } = opcoes;
  const bytesOriginais = entrada.bytes.byteLength;
  const raiz = higienizarNome(semExtensaoPdf(entrada.nome), "documento");
  const nomeArquivo = `${raiz}-comprimido.pdf`;

  try {
    // Documento assinado não é comprimido: qualquer reescrita invalida a
    // assinatura, e entregar isso a quem vai protocolar seria um desserviço.
    const doc = await abrirPdf(entrada.bytes, { nome: entrada.nome, senha: entrada.senha });
    if (diagnosticar(doc).temAssinatura) {
      throw new ErroFerramenta("PDF_ASSINADO", { nome: entrada.nome });
    }

    const podeReamostrarAqui = reamostragemDisponivel();
    const querReamostrar = nivel !== "estrutural" || alvoBytes !== undefined;
    const reamostragemIndisponivel = querReamostrar && !podeReamostrarAqui;

    const base = {
      bytesOriginais,
      nomeArquivo,
      reamostragemIndisponivel,
    };

    // Sem alvo: uma passada única com o perfil do nível escolhido.
    if (alvoBytes === undefined) {
      const perfil =
        nivel === "estrutural" || !podeReamostrarAqui ? null : PERFIS[nivel];
      const r = await passada(
        entrada.bytes,
        entrada.nome,
        entrada.senha,
        perfil,
        aoProgredir,
        cancelado,
      );

      if (r.bytes.byteLength >= bytesOriginais) {
        return {
          ...base,
          bytes: entrada.bytes,
          bytesFinais: bytesOriginais,
          imagensReamostradas: 0,
          imagensPuladas: r.puladas,
          semGanho: true,
        };
      }

      return {
        ...base,
        bytes: r.bytes,
        bytesFinais: r.bytes.byteLength,
        imagensReamostradas: r.reamostradas,
        imagensPuladas: r.puladas,
        semGanho: false,
      };
    }

    // Com alvo: desce a escada até caber, guardando sempre o melhor resultado.
    //
    // Varredura linear, e NÃO busca binária: a monotonicidade que a busca
    // binária pressupõe não é garantida aqui. Um perfil mais agressivo pode
    // produzir arquivo MAIOR quando a imagem original era bitonal ou muito
    // pequena, e a busca binária se perderia nesse caso.
    const degraus: (Perfil | null)[] = podeReamostrarAqui ? [null, ...ESCADA] : [null];
    let melhor: ResultadoPassada | null = null;

    for (let i = 0; i < degraus.length; i += 1) {
      conferirCancelamento(cancelado);
      const r = await passada(
        entrada.bytes,
        entrada.nome,
        entrada.senha,
        degraus[i],
        undefined,
        cancelado,
      );
      aoProgredir?.(i + 1, degraus.length);

      if (!melhor || r.bytes.byteLength < melhor.bytes.byteLength) melhor = r;
      if (r.bytes.byteLength <= alvoBytes) break;
    }

    const escolhido = melhor as ResultadoPassada;
    const ganhou = escolhido.bytes.byteLength < bytesOriginais;

    return {
      ...base,
      bytes: ganhou ? escolhido.bytes : entrada.bytes,
      bytesFinais: ganhou ? escolhido.bytes.byteLength : bytesOriginais,
      imagensReamostradas: ganhou ? escolhido.reamostradas : 0,
      imagensPuladas: escolhido.puladas,
      semGanho: !ganhou,
      alvoNaoAlcancado: (ganhou ? escolhido.bytes.byteLength : bytesOriginais) > alvoBytes,
    };
  } catch (e) {
    if (e instanceof OperacaoCancelada) throw e;
    throw comoErroFerramenta(e, "FALHA_INESPERADA", { nome: entrada.nome });
  }
}
