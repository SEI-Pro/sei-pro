// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/**
 * Bridge para parent.SeiPro.features.atividades.api (iframe da árvore).
 */
export function atividadesApiParent() {
    var feature = typeof parent !== 'undefined' && parent.SeiPro && parent.SeiPro.features && parent.SeiPro.features.atividades;
    return (feature && feature.api) || null;
}

export function atividadesStateParent() {
    var api = atividadesApiParent();
    return api && api.state && typeof api.state.get === 'function' ? api.state.get() : {};
}

export function callParentAtividades(name) {
    var api = atividadesApiParent();
    var fn = (api && api.commands && typeof api.commands[name] === 'function') ? api.commands[name]
        : (api && api.queries && typeof api.queries[name] === 'function') ? api.queries[name]
        : (api && api.handlers && typeof api.handlers[name] === 'function') ? api.handlers[name]
        : null;
    if (typeof fn !== 'function') return undefined;
    var args = Array.prototype.slice.call(arguments, 1);
    return fn.apply(null, args);
}
