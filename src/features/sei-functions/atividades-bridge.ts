// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/**
 * Cross-feature Atividades bridge — only talks to SeiPro.features.atividades.api.
 */
export function atividadesApi() {
    var root = typeof globalThis !== 'undefined' ? globalThis.SeiPro : null;
    var feature = root && root.features && root.features.atividades;
    return (feature && feature.api) || null;
}
export function callAtividades(name) {
    var api = atividadesApi();
    var fn = (api && api.commands && typeof api.commands[name] === 'function') ? api.commands[name]
        : (api && api.queries && typeof api.queries[name] === 'function') ? api.queries[name]
        : (api && api.handlers && typeof api.handlers[name] === 'function') ? api.handlers[name]
        : (api && api.handlers && typeof api.handlers[name] === 'function') ? api.handlers[name] : null;
    if (typeof fn !== 'function') return undefined;
    var args = Array.prototype.slice.call(arguments, 1);
    return fn.apply(null, args);
}
export function getAtividadesServer() {
    var api = atividadesApi();
    if (api && typeof api.legacyRequest === 'function') return api.legacyRequest;
    if (api && typeof api.request === 'function') return api.request;
    return null;
}

export function checkCapacidade(nome) {
    var r = callAtividades('checkCapacidade', nome);
    return typeof r === 'undefined' ? false : r;
}
export function checkPerfilNivelAdm() {
    var r = callAtividades('checkPerfilNivelAdm');
    return typeof r === 'undefined' ? false : r;
}

// Cross-feature commands formerly read from the global alias map. Keep these
// tiny local adapters so the large SEI functions module depends only on the
// explicit Atividades namespace.
export function atividadeCommand(name, ...args) { return callAtividades(name, ...args); }
export function atividadesState() {
    var api = atividadesApi();
    return api && api.state && typeof api.state.get === 'function' ? api.state.get() : {};
}
export function checkPageAtividadesVisualizacao(...args) { return atividadeCommand('checkPageAtividadesVisualizacao', ...args); }
export function checkUnidadeFuncBeta(...args) { return atividadeCommand('checkUnidadeFuncBeta', ...args); }
export function setParamEditorAtiv(...args) { return atividadeCommand('setParamEditorAtiv', ...args); }
export function extractDataDocument(...args) { return atividadeCommand('extractDataDocument', ...args); }
export function getConfigServerDoc(...args) { return atividadeCommand('getConfigServerDoc', ...args); }
export function getConfigServer(...args) { return atividadeCommand('getConfigServer', ...args); }
export function dialogDebugScreen(...args) { return atividadeCommand('dialogDebugScreen', ...args); }
export function updateCountKanbanBoard(...args) { return atividadeCommand('updateCountKanbanBoard', ...args); }
export function getKanbanUserPriority(...args) { return atividadeCommand('getKanbanUserPriority', ...args); }
export function getHtmlKanbanUserPriority(...args) { return atividadeCommand('getHtmlKanbanUserPriority', ...args); }
export function signCancelDocumento(...args) { return atividadeCommand('signCancelDocumento', ...args); }
