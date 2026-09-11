/**
 * Reordenação, rotação e remoção de páginas.
 *
 * Uma operação só, e não três, porque na prática elas são feitas juntas: quem
 * digitalizou um processo mexe na ordem, endireita as páginas que entraram de
 * lado e descarta as folhas em branco do scanner na mesma passada.
 */

import { PDFDocument, degrees } from "@cantoo/pdf-lib";

import type {
  ArquivoEntrada,
  ProgressoCallback,
  ResultadoOperacao,
} from "@/types/ferramentas";
import { abrirPdf } from "./analisarPdf";
import { ErroFerramenta, comoErroFerramenta } from "./erros";
import { conferirCancelamento, OperacaoCancelada } from "./juntar";
import { higienizarNome, semExtensaoPdf } from "./nomearArquivos";

export interface OpcoesOrganizacao {
  /**
   * Índices 0-based na ordem final desejada.
   *
   * Página ausente da lista é REMOVIDA. É assim que a interface expressa
   * exclusão: em vez de um segundo parâmetro, quem sai simplesmente não entra.
   */
  ordem: number[];
  /** Rotação por índice ORIGINAL da página, em graus (90, 180 ou 270). */
  rotacoes?: Record<number, number>;
  aoProgredir?: ProgressoCallback;
  cancelado?: () => boolean;
}

/** Normaliza para os quatro ângulos que o PDF aceita em /Rotate. */
function normalizarAngulo(g: number): number {
  const a = ((Math.round(g / 90) * 90) % 360 + 360) % 360;
  return a;
}

export async function organizarPdf(
  entrada: ArquivoEntrada,
  opcoes: OpcoesOrganizacao,
): Promise<ResultadoOperacao> {
  const { ordem, rotacoes = {}, aoProgredir, cancelado } = opcoes;

  try {
    const origem = await abrirPdf(entrada.bytes, {
      nome: entrada.nome,
      senha: entrada.senha,
    });
    const total = origem.getPageCount();

    if (ordem.length === 0) throw new ErroFerramenta("NENHUM_ARQUIVO");
    if (ordem.some((i) => !Number.isInteger(i) || i < 0 || i >= total)) {
      throw new ErroFerramenta("FALHA_INESPERADA");
    }

    aoProgredir?.(0, ordem.length);

    const destino = await PDFDocument.create();
    const paginas = await destino.copyPages(origem, ordem);

    for (let i = 0; i < paginas.length; i += 1) {
      conferirCancelamento(cancelado);
      const pagina = paginas[i];
      const giroPedido = rotacoes[ordem[i]];
      if (giroPedido) {
        // Soma ao giro que a página já trazia: um documento digitalizado de
        // lado costuma chegar com /Rotate 90, e substituir o valor em vez de
        // somar desfaz a correção que o scanner já tinha feito.
        const atual = pagina.getRotation().angle;
        pagina.setRotation(degrees(normalizarAngulo(atual + giroPedido)));
      }
      destino.addPage(pagina);
      aoProgredir?.(i + 1, ordem.length);
    }

    const bytes = await destino.save({ useObjectStreams: true });
    const raiz = higienizarNome(semExtensaoPdf(entrada.nome), "documento");

    return { bytes, nomeArquivo: `${raiz}-organizado.pdf` };
  } catch (e) {
    if (e instanceof OperacaoCancelada) throw e;
    throw comoErroFerramenta(e, "FALHA_INESPERADA", { nome: entrada.nome });
  }
}
