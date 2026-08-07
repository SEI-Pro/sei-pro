/**
 * Bridge para SeiPro.features.atividades.api (lista de processos).
 */
export function atividadesApi() {
    var root = (typeof parent !== 'undefined' && parent.SeiPro) ? parent.SeiPro
        : (typeof SeiPro !== 'undefined' ? SeiPro : null);
    var feature = root && root.features && root.features.atividades;
    return (feature && feature.api) || null;
}
export function callAtividades(name) {
    var api = atividadesApi();
    var fn = (api && api.commands && typeof api.commands[name] === 'function') ? api.commands[name]
        : (api && api.queries && typeof api.queries[name] === 'function') ? api.queries[name]
        : (api && api.handlers && typeof api.handlers[name] === 'function') ? api.handlers[name]
        : null;
    if (typeof fn !== 'function') return undefined;
    var args = Array.prototype.slice.call(arguments, 1);
    return fn.apply(null, args);
}
