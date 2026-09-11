/**
 * Despacho das operações de PDF.
 *
 * Módulo único usado pelo worker E pelo recuo na thread principal. Se cada um
 * tivesse o seu `switch`, o caminho de recuo seria justamente o menos testado
 * e o que divergiria em silêncio.
 *
 * Continua livre de DOM e de React: os módulos que ele carrega são os mesmos
 * exercitados pelo script de verificação em Node.
 */

import type { ArquivoEntrada, ProgressoCallback } from "@/types/ferramentas";
import type { EntradaWorker, OperacaoPdf, SaidaWorker } from "./protocoloWorker";

export interface ContextoDespacho {
  aoProgredir?: ProgressoCallback;
  cancelado?: () => boolean;
}

/** Converte a entrada do protocolo no formato dos módulos puros. */
function comoArquivos(entradas: EntradaWorker[]): ArquivoEntrada[] {
  return entradas.map((e, i) => ({
    id: String(i),
    nome: e.nome,
    tamanho: e.bytes.byteLength,
    bytes: e.bytes,
    senha: e.senha,
  }));
}

export async function despacharOperacao(
  operacao: OperacaoPdf,
  entradas: EntradaWorker[],
  opcoes: Record<string, unknown>,
  ctx: ContextoDespacho = {},
): Promise<SaidaWorker[]> {
  const arquivos = comoArquivos(entradas);
  const { aoProgredir, cancelado } = ctx;

  switch (operacao) {
    case "juntar": {
      const { juntarPdfs } = await import("./juntar");
      const r = await juntarPdfs(arquivos, {
        aoProgredir,
        cancelado,
        nomeSaida: opcoes.nomeSaida as string | undefined,
      });
      return [{ nome: r.nomeArquivo, bytes: r.bytes }];
    }

    case "dividir": {
      const { dividirPdf } = await import("./dividir");
      const partes = await dividirPdf(arquivos[0], {
        aoProgredir,
        cancelado,
        modo: opcoes.modo as never,
        intervalos: opcoes.intervalos as never,
        paginasPorParte: opcoes.paginasPorParte as number | undefined,
        tamanhoMaximoBytes: opcoes.tamanhoMaximoBytes as number | undefined,
      });
      return partes.map((p) => ({ nome: p.nomeArquivo, bytes: p.bytes }));
    }

    case "organizar": {
      const { organizarPdf } = await import("./organizar");
      const r = await organizarPdf(arquivos[0], {
        aoProgredir,
        cancelado,
        ordem: opcoes.ordem as number[],
        rotacoes: opcoes.rotacoes as Record<number, number> | undefined,
      });
      return [{ nome: r.nomeArquivo, bytes: r.bytes }];
    }

    case "imagemParaPdf": {
      const { imagensParaPdf } = await import("./imagemParaPdf");
      const r = await imagensParaPdf(arquivos, {
        aoProgredir,
        cancelado,
        tamanhoPagina: opcoes.tamanhoPagina as never,
        margemMm: opcoes.margemMm as number | undefined,
        nomeSaida: opcoes.nomeSaida as string | undefined,
      });
      return [{ nome: r.nomeArquivo, bytes: r.bytes }];
    }

    case "numerarPaginas": {
      const { numerarPaginas } = await import("./numerarPaginas");
      const r = await numerarPaginas(arquivos[0], {
        aoProgredir,
        cancelado,
        posicao: opcoes.posicao as never,
        formato: opcoes.formato as never,
        comecarEm: opcoes.comecarEm as number | undefined,
        pularPrimeira: opcoes.pularPrimeira as boolean | undefined,
      });
      return [{ nome: r.nomeArquivo, bytes: r.bytes }];
    }

    case "comprimir": {
      const { comprimirPdf } = await import("./comprimir");
      const r = await comprimirPdf(arquivos[0], {
        aoProgredir,
        cancelado,
        nivel: opcoes.nivel as never,
        alvoBytes: opcoes.alvoBytes as number | undefined,
      });
      // O relatório da compressão viaja em `meta` porque a interface precisa
      // dizer ao usuário se houve ganho, quantas imagens foram puladas e se o
      // alvo foi alcançado. Sem isso, "não deu para reduzir" viraria silêncio.
      return [
        {
          nome: r.nomeArquivo,
          bytes: r.bytes,
          meta: {
            bytesOriginais: r.bytesOriginais,
            bytesFinais: r.bytesFinais,
            imagensReamostradas: r.imagensReamostradas,
            imagensPuladas: r.imagensPuladas,
            reamostragemIndisponivel: r.reamostragemIndisponivel,
            semGanho: r.semGanho,
            alvoNaoAlcancado: r.alvoNaoAlcancado,
          },
        },
      ];
    }

    default: {
      const nunca: never = operacao;
      throw new Error(`operação desconhecida: ${String(nunca)}`);
    }
  }
}
