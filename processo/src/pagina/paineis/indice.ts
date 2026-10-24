import { painelAcompanhamento } from "./acompanhamento";
import { painelAnotacoes } from "./anotacoes";
import { painelAtribuicao } from "./atribuicao";
import { painelBlocoInterno } from "./blocoInterno";
import type { DefPainel } from "./comum";
import { painelAssuntos, painelDescricao, painelInteressados, painelNivel, painelObservacoes, painelTipo } from "./dadosProcesso";
import { painelMarcador } from "./marcador";

export type { DefPainel } from "./comum";

/** Todos os painéis; a ordem na tela vem de `ORDEM_FINAL` (Anotações vai à parte, logo depois do “Consultar Andamento”). */
export const PAINEIS: readonly DefPainel[] = [
  painelAnotacoes,
  painelAtribuicao,
  painelBlocoInterno,
  painelMarcador,
  painelAcompanhamento,
  painelDescricao,
  painelTipo,
  painelNivel,
  painelInteressados,
  painelAssuntos,
  painelObservacoes,
];
