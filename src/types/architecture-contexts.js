/**
 * Vocabulário arquitetural canônico.
 *
 * Este arquivo é JavaScript propositalmente: o runtime da extensão, o build
 * Node e os testes conseguem importar a mesma lista sem transpilar TypeScript.
 * Os tipos derivados vivem em architecture.d.ts.
 */

/** Onde o código executa e quais APIs ele pode usar. */
export const EXECUTION_CONTEXT_IDS = Object.freeze([
    'service-worker',
    'isolated-content',
    'main-world',
    'options'
]);

/** Página/caso de uso do SEI que uma feature pode atender. */
export const PAGE_CONTEXT_IDS = Object.freeze([
    'login',
    'db',
    'lista',
    'visualizacao',
    'arvore',
    'documento',
    'editor'
]);

/** Escopo amplo de injeção legado; não representa uma página primária. */
export const CONTENT_SCOPE_IDS = Object.freeze(['all']);

/** Contextos permitidos em descritores de feature. */
export const FEATURE_CONTEXT_IDS = Object.freeze([
    ...PAGE_CONTEXT_IDS,
    ...CONTENT_SCOPE_IDS
]);

export function isExecutionContextId(value) {
    return EXECUTION_CONTEXT_IDS.includes(value);
}

export function isPageContextId(value) {
    return PAGE_CONTEXT_IDS.includes(value);
}

export function isFeatureContextId(value) {
    return FEATURE_CONTEXT_IDS.includes(value);
}

/**
 * Capacidade é o identificador estável e legível pelo usuário de uma feature.
 * O catálogo concreto é gerado a partir dos descritores; esta função protege
 * as fronteiras públicas contra ids vazios ou fora da convenção.
 */
export function isCapabilityId(value) {
    return typeof value === 'string' && /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(value);
}
