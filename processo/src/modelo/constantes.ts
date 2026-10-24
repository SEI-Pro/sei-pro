/** Atributo no <html> que cede a peça correspondente do legado (marcado em document_start). */
export const ATRIBUTO_PAINEIS = "data-seipro-processo-paineis";
export const ATRIBUTO_MENU = "data-seipro-processo-menu";
export const ATRIBUTO_CAPA = "data-seipro-processo-capa";
export const ATRIBUTO_GANTT = "data-seipro-processo-gantt";

/** Teto do cache: cota do chrome.storage.local é dividida com Favoritos, Histórico e Agente. */
export const MAX_PROCESSOS_CACHE = 200;
export const MAX_BYTES_CACHE = 2 * 1024 * 1024;
/** Uma entrada maior que isto não vai para o cache (a fatia segue em memória). */
export const MAX_BYTES_ENTRADA = 64 * 1024;
/** A cada quantas gravações o cache confere o teto de bytes (a contagem é conferida sempre). */
export const PODA_A_CADA = 25;

export const TENTATIVAS_PADRAO = 2;
export const ESPERA_TENTATIVA_MS = 400;

export const prefixoCache = "processo/";
export const chaveCache = (escopo: string, id: string): string => `${prefixoCache}${escopo}/${id}`;
/** host|login com as duas partes: só com elas o cache é gravado. */
export const escopoValido = (escopo: string): boolean => {
  const i = escopo.indexOf("|");
  return i > 0 && i < escopo.length - 1;
};
