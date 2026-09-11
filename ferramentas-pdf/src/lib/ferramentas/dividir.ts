/**
 * Divisão de PDF.
 *
 * Quatro modos, e o que existe por causa do protocolo em órgão público é o
 * `tamanho`: quando o sistema do órgão recusa o arquivo por peso, a saída é
 * quebrá-lo em partes que caibam, e não tentar de novo esperando outro
 * resultado.
 */

import { PDFDocument } from "@cantoo/pdf-lib";

import type {
  ArquivoEntrada,
  ProgressoCallback,
  ResultadoOperacao,
} from "@/types/ferramentas";
import { abrirPdf } from "./analisarPdf";
import { ErroFerramenta, comoErroFerramenta } from "./erros";
import { conferirCancelamento, OperacaoCancelada } from "./juntar";
import { higienizarNome, semExtensaoPdf } from "./nomearArquivos";

export type ModoDivisao =
  /** Uma página por arquivo. */
  | "porPagina"
  /** Blocos de N páginas. */
  | "porQuantidade"
  /** Intervalos escolhidos pelo usuário (ex.: 1-3, 8, 12-20). */
  | "porIntervalos"
  /** Partes que caibam num teto de bytes. */
  | "porTamanho";

export interface Intervalo {
  /** 1-based, como o usuário conta páginas. */
  inicio: number;
  fim: number;
}

export interface OpcoesDivisao {
  modo: ModoDivisao;
  intervalos?: Intervalo[];
  paginasPorParte?: number;
  tamanhoMaximoBytes?: number;
  aoProgredir?: ProgressoCallback;
  cancelado?: () => boolean;
}

/**
 * Converte "1-3, 8, 12-20" em intervalos.
 *
 * Aceita espaços, ponto e vírgula e traço comum ou travessão, porque a pessoa
 * costuma colar de um despacho. Ignora silenciosamente pedaço vazio, mas
 * recusa número fora do documento: pedir a página 90 de um PDF de 12 é engano,
 * não detalhe.
 */
export function interpretarIntervalos(texto: string, totalPaginas: number): Intervalo[] {
  const partes = texto
    .split(/[,;]/)
    .map((p) => p.trim())
    .filter(Boolean);

  const intervalos: Intervalo[] = [];
  for (const parte of partes) {
    const m = parte.match(/^(\d+)\s*(?:[-–—]\s*(\d+))?$/);
    if (!m) throw new ErroFerramenta("FALHA_INESPERADA");
    const inicio = Number(m[1]);
    const fim = m[2] ? Number(m[2]) : inicio;
    if (inicio < 1 || fim < inicio || fim > totalPaginas) {
      throw new ErroFerramenta("FALHA_INESPERADA");
    }
    intervalos.push({ inicio, fim });
  }
  if (intervalos.length === 0) throw new ErroFerramenta("NENHUM_ARQUIVO");
  return intervalos;
}

/** Extrai um conjunto de páginas (índices 0-based) para um documento novo. */
async function extrair(origem: PDFDocument, indices: number[]): Promise<Uint8Array> {
  const destino = await PDFDocument.create();
  const paginas = await destino.copyPages(origem, indices);
  for (const p of paginas) destino.addPage(p);
  return destino.save({ useObjectStreams: true });
}

/**
 * Quebra o documento em partes que caibam no teto de bytes.
 *
 * O algoritmo é guloso e MEDE cada tentativa em vez de estimar: a compressão
 * de um PDF não é linear no número de páginas, porque fontes e imagens são
 * compartilhadas entre páginas e um corte muda o que cada parte precisa
 * carregar. Estimar por média produziria partes acima do teto justamente nos
 * documentos mais pesados, que são os que motivam a divisão.
 *
 * Cresce a parte página a página enquanto couber; quando estoura, fecha na
 * página anterior. Uma página que sozinha não cabe vira uma parte própria e
 * acima do teto: é melhor entregar o arquivo com o aviso do que travar.
 */
async function dividirPorTamanho(
  origem: PDFDocument,
  tetoBytes: number,
  aoProgredir?: ProgressoCallback,
  cancelado?: () => boolean,
): Promise<{ indices: number[]; bytes: Uint8Array }[]> {
  const total = origem.getPageCount();
  const partes: { indices: number[]; bytes: Uint8Array }[] = [];

  let inicio = 0;
  while (inicio < total) {
    conferirCancelamento(cancelado);

    let fim = inicio;
    let melhor: Uint8Array | null = null;

    while (fim < total) {
      const candidatoIndices = Array.from({ length: fim - inicio + 1 }, (_, k) => inicio + k);
      const candidato = await extrair(origem, candidatoIndices);

      if (candidato.byteLength > tetoBytes && melhor !== null) break;

      melhor = candidato;
      fim += 1;

      // Página única que já estoura o teto: fecha a parte com ela mesma.
      if (candidato.byteLength > tetoBytes) break;
    }

    const indices = Array.from({ length: fim - inicio }, (_, k) => inicio + k);
    partes.push({ indices, bytes: melhor as Uint8Array });
    aoProgredir?.(fim, total);
    inicio = fim;
  }

  return partes;
}

/** Divide o documento conforme o modo escolhido. */
export async function dividirPdf(
  entrada: ArquivoEntrada,
  opcoes: OpcoesDivisao,
): Promise<ResultadoOperacao[]> {
  const { modo, aoProgredir, cancelado } = opcoes;

  try {
    const origem = await abrirPdf(entrada.bytes, {
      nome: entrada.nome,
      senha: entrada.senha,
    });
    const total = origem.getPageCount();
    const raiz = higienizarNome(semExtensaoPdf(entrada.nome), "documento");

    if (total < 2 && modo !== "porIntervalos") {
      throw new ErroFerramenta("UM_ARQUIVO_SO");
    }

    let grupos: number[][] = [];

    if (modo === "porPagina") {
      grupos = Array.from({ length: total }, (_, i) => [i]);
    } else if (modo === "porQuantidade") {
      const n = Math.max(1, Math.floor(opcoes.paginasPorParte ?? 1));
      for (let i = 0; i < total; i += n) {
        grupos.push(Array.from({ length: Math.min(n, total - i) }, (_, k) => i + k));
      }
    } else if (modo === "porIntervalos") {
      const intervalos = opcoes.intervalos ?? [];
      if (intervalos.length === 0) throw new ErroFerramenta("NENHUM_ARQUIVO");
      grupos = intervalos.map((iv) =>
        Array.from({ length: iv.fim - iv.inicio + 1 }, (_, k) => iv.inicio - 1 + k),
      );
    } else {
      const teto = opcoes.tamanhoMaximoBytes ?? 0;
      if (teto <= 0) throw new ErroFerramenta("FALHA_INESPERADA");
      const partes = await dividirPorTamanho(origem, teto, aoProgredir, cancelado);
      return partes.map((p, i) => ({
        bytes: p.bytes,
        nomeArquivo: `${raiz}-parte-${String(i + 1).padStart(2, "0")}.pdf`,
      }));
    }

    aoProgredir?.(0, grupos.length);
    const saidas: ResultadoOperacao[] = [];

    for (let i = 0; i < grupos.length; i += 1) {
      conferirCancelamento(cancelado);
      const bytes = await extrair(origem, grupos[i]);
      const g = grupos[i];
      const rotulo =
        g.length === 1
          ? `pagina-${g[0] + 1}`
          : `paginas-${g[0] + 1}-a-${g[g.length - 1] + 1}`;
      saidas.push({ bytes, nomeArquivo: `${raiz}-${rotulo}.pdf` });
      aoProgredir?.(i + 1, grupos.length);
    }

    return saidas;
  } catch (e) {
    if (e instanceof OperacaoCancelada) throw e;
    throw comoErroFerramenta(e, "FALHA_INESPERADA", { nome: entrada.nome });
  }
}
