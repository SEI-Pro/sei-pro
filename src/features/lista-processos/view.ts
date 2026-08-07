// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/**
 * Lista de processos — view adapters (thin during big-bang).
 * Most DOM orchestration remains in body.js; this file is the extension point
 * for future extraction of filter/sorter/upload UI.
 */
export function noopListaView() {
    return null;
}
