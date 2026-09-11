/**
 * União de PDFs.
 *
 * Camada pura: recebe bytes, devolve bytes. Não importa React nem toca no DOM,
 * o que permite exercitá-la por um script Node em `/tests/` — a única forma de
 * verificar automaticamente a parte capaz de corromper o documento do usuário.
 */

import { PDFDocument } from "@cantoo/pdf-lib";

import type {
  ArquivoEntrada,
  ProgressoCallback,
  ResultadoOperacao,
} from "@/types/ferramentas";
import { abrirPdf } from "./analisarPdf";
import { ErroFerramenta, comoErroFerramenta } from "./erros";
import { nomeParaUniao } from "./nomearArquivos";

export interface OpcoesUniao {
  /** Nome do arquivo final, sem extensão. Ausente, deriva do primeiro arquivo. */
  nomeSaida?: string;
  aoProgredir?: ProgressoCallback;
  /**
   * Cancelamento cooperativo, consultado entre um arquivo e o próximo.
   *
   * É uma função e não um `AbortSignal` porque esta operação roda dentro de um
   * Web Worker, e um `AbortSignal` não é estruturalmente clonável: não
   * atravessa o `postMessage`. O worker mantém um conjunto de pedidos
   * cancelados e entrega este predicado.
   */
  cancelado?: () => boolean;
}

/** Erro de cancelamento. Não é falha: sobe intacto para quem chamou decidir. */
export class OperacaoCancelada extends Error {
  constructor() {
    super("Operação cancelada");
    this.name = "OperacaoCancelada";
  }
}

export function conferirCancelamento(cancelado?: () => boolean) {
  if (cancelado?.()) throw new OperacaoCancelada();
}

/**
 * Une os documentos na ordem recebida.
 *
 * A ordem do array é a ordem das páginas no resultado, e é ela que a interface
 * deixa o usuário reordenar. Quem protocola costuma se guiar pela primeira
 * peça, então é dela que sai o nome sugerido do arquivo.
 *
 * O documento gerado NÃO carrega as assinaturas eletrônicas dos originais:
 * qualquer reescrita as invalida. A interface avisa isso antes de processar.
 */
export async function juntarPdfs(
  entradas: ArquivoEntrada[],
  opcoes: OpcoesUniao = {},
): Promise<ResultadoOperacao> {
  const { nomeSaida, aoProgredir, cancelado } = opcoes;

  if (entradas.length === 0) throw new ErroFerramenta("NENHUM_ARQUIVO");
  if (entradas.length === 1) throw new ErroFerramenta("UM_ARQUIVO_SO");

  const total = entradas.length;
  aoProgredir?.(0, total);

  try {
    const destino = await PDFDocument.create();

    for (let i = 0; i < entradas.length; i += 1) {
      conferirCancelamento(cancelado);
      const entrada = entradas[i];

      const origem = await abrirPdf(entrada.bytes, {
        nome: entrada.nome,
        senha: entrada.senha,
      });

      const indices = origem.getPageIndices();
      const paginas = await destino.copyPages(origem, indices);
      for (const pagina of paginas) destino.addPage(pagina);

      aoProgredir?.(i + 1, total);
    }

    conferirCancelamento(cancelado);

    const bytes = await destino.save({ useObjectStreams: true });

    return {
      bytes,
      nomeArquivo: nomeSaida
        ? `${nomeSaida.replace(/\.pdf$/i, "")}.pdf`
        : nomeParaUniao(entradas[0]?.nome),
    };
  } catch (e) {
    // Cancelamento não é falha: sobe intacto para quem chamou decidir.
    if (e instanceof OperacaoCancelada) throw e;
    throw comoErroFerramenta(e);
  }
}
