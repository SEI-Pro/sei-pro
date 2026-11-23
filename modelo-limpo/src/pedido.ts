/**
 * Pedido de limpeza entre a tela "Gerar Documento" e o editor do documento que ela cria.
 *
 * As duas telas não se falam: o SEI grava o documento e abre o editor em outra janela. O botão deixa um
 * pedido em `chrome.storage.local` e o editor o consome uma vez. Três travas evitam limpar o documento
 * errado: o processo tem de ser o mesmo, o pedido vale por pouco tempo e é apagado no primeiro uso.
 */

export const CHAVE_PEDIDO = 'spro-modelo-limpo-pedido';
/** Do clique em "Salvar" até o editor abrir. O SEI costuma levar poucos segundos. */
export const VALIDADE_MS = 2 * 60 * 1000;

export interface Pedido {
  idProcedimento: string;
  /** Nº SEI do modelo, só para o aviso ao usuário. */
  modelo: string;
  criadoEm: number;
}

export function pedidoValido(pedido: unknown, idProcedimento: string | undefined, agora: number): pedido is Pedido {
  if (!pedido || typeof pedido !== 'object') return false;
  const p = pedido as Partial<Pedido>;
  if (typeof p.idProcedimento !== 'string' || typeof p.criadoEm !== 'number') return false;
  if (!idProcedimento || p.idProcedimento !== idProcedimento) return false;
  return agora - p.criadoEm >= 0 && agora - p.criadoEm <= VALIDADE_MS;
}
