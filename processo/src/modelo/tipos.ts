export type EstadoFatia = "carregando" | "pronto" | "erro" | "desatualizado";

export type NomeFatia = "dadosProcesso" | "anotacao" | "marcador" | "acompanhamento" | "atribuicao" | "relacionados" | "blocoInterno";

export const NOMES_FATIAS: readonly NomeFatia[] = [
  "dadosProcesso",
  "anotacao",
  "marcador",
  "acompanhamento",
  "atribuicao",
  "relacionados",
  "blocoInterno",
];

export interface Fatia<T> {
  estado: EstadoFatia;
  dado?: T;
  erro?: string;
  /** Carimbo de hora (ms) do dado, ou da última mudança de estado quando não há dado. */
  em: number;
}

/** O que o cache guarda de um processo: só os dados prontos, nunca estado nem erro. */
export interface EntradaCache {
  em: number;
  fatias: Partial<Record<NomeFatia, { dado: unknown; em: number }>>;
}
