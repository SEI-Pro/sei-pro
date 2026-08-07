// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/**
 * Lista de processos — IO boundary (thin).
 *
 * Prefer lista-agrupamento IO when available for group order / collapse.
 */
export function listaAgrupamentoIO(globalRef = globalThis) {
    return globalRef.SeiPro && globalRef.SeiPro.features && globalRef.SeiPro.features.listaAgrupamentoIO;
}

export function readGroupOrder(getOption, fallback = 'asc') {
    const io = listaAgrupamentoIO();
    if (io && typeof io.readGroupOrder === 'function') {
        return io.readGroupOrder(getOption, fallback);
    }
    const value = typeof getOption === 'function' ? getOption('orderbyTableGroup') : null;
    return value || fallback;
}

export function readGroupOrderLegacy() {
    return readGroupOrder(typeof getOptionsPro === 'function' ? getOptionsPro : null, 'asc');
}
