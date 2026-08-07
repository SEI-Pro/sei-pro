// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/** Explicit query/permission port for Atividades. */
const QUERIES = Object.freeze([
    'getAtividades', 'getAtividadeData', 'getKanbanItem', 'checkCapacidade',
    'checkPerfilNivelAdm', 'checkAtivRequiredFields', 'checkThisAtivRequiredFields',
    'getConfigServer', 'getConfigServerDoc'
]);

export function createAtividadesQueries({ handlers = {}, context } = {}) {
    const queries = Object.create(null);
    QUERIES.forEach((name) => {
        if (typeof handlers[name] === 'function') queries[name] = (...args) => handlers[name](...args);
    });
    queries.getState = () => context.store.get();
    return Object.freeze(queries);
}

export { QUERIES as ATIVIDADES_QUERY_NAMES };

