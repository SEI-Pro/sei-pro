// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/** Fronteira IO do agrupamento, com dependências legadas injetadas. */

export function readGroupOrder(getOptions, fallback = 'asc') {
    const value = typeof getOptions === 'function' ? getOptions('orderbyTableGroup') : undefined;
    return value || fallback;
}

export function isGroupCollapsed(getOptions, tagName) {
    return typeof getOptions === 'function' && Boolean(getOptions('panelGroup_' + tagName));
}

export function persistGroupCollapsed(setOptions, tagName) {
    if (typeof setOptions === 'function') setOptions('panelGroup_' + tagName, true);
}

export function clearGroupCollapsed(removeOptions, tagName) {
    if (typeof removeOptions === 'function') removeOptions('panelGroup_' + tagName);
}

export function readSelectedGroup(restore) {
    return typeof restore === 'function' ? restore('selectGroupTablePro') : undefined;
}

export function readReceivedProcess(restore, getParams, jmespath, href) {
    const stored = typeof restore === 'function' ? restore('configDataRecebimentoPro') : undefined;
    const records = stored && typeof stored === 'object' ? stored : [];
    const id = typeof getParams === 'function' ? String(getParams(href || '').id_procedimento) : false;
    if (!id || !jmespath || typeof jmespath.search !== 'function') return '';
    return jmespath.search(records, "[?id_procedimento=='" + id + "'] | [0]") || '';
}

export function installListaAgrupamentoIO(globalRef = globalThis) {
    globalRef.SeiPro = globalRef.SeiPro || {};
    globalRef.SeiPro.features = globalRef.SeiPro.features || {};
    globalRef.SeiPro.features.listaAgrupamentoIO = {
        readGroupOrder,
        isGroupCollapsed,
        persistGroupCollapsed,
        clearGroupCollapsed,
        readSelectedGroup,
        readReceivedProcess
    };
}