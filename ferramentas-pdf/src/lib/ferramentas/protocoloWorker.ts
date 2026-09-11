/**
 * Contrato de mensagens entre a aba e o worker de PDF.
 *
 * Fica em módulo próprio, sem nenhum import pesado, para que tanto a thread
 * principal quanto o worker possam carregá-lo sem arrastar o motor de PDF
 * junto.
 */

import type { CodigoErroFerramenta } from "@/types/ferramentas";

/** Operações que o worker sabe executar. */
export type OperacaoPdf =
  | "juntar"
  | "dividir"
  | "organizar"
  | "imagemParaPdf"
  | "numerarPaginas"
  | "comprimir";

/** Um arquivo de entrada, já lido para bytes. */
export interface EntradaWorker {
  nome: string;
  bytes: Uint8Array;
  senha?: string;
}

/** Um arquivo de saída. */
export interface SaidaWorker {
  nome: string;
  bytes: Uint8Array;
  /**
   * Dados que a interface precisa mostrar além do arquivo em si.
   *
   * Hoje só a compressão usa: sem eles, "não foi possível reduzir" viraria
   * silêncio, e o usuário baixaria o original achando que comprimiu.
   */
  meta?: Record<string, unknown>;
}

export interface PedidoWorker {
  id: number;
  operacao: OperacaoPdf;
  entradas: EntradaWorker[];
  /** Parâmetros específicos da operação. Cada handler valida os seus. */
  opcoes?: Record<string, unknown>;
}

export type RespostaWorker =
  | { id: number; tipo: "progresso"; feito: number; total: number; etapa?: string }
  | { id: number; tipo: "ok"; saidas: SaidaWorker[] }
  | { id: number; tipo: "erro"; codigo: CodigoErroFerramenta; nomeArquivo?: string };

/** Mensagem de cancelamento enviada da aba para o worker. */
export interface CancelamentoWorker {
  id: number;
  cancelar: true;
}

export type MensagemParaWorker = PedidoWorker | CancelamentoWorker;

export function ehCancelamento(m: MensagemParaWorker): m is CancelamentoWorker {
  return (m as CancelamentoWorker).cancelar === true;
}
