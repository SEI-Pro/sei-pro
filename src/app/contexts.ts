// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/**
 * Contextos SEI conhecidos (ADR-0002 / ADR-0004).
 * Feature ids vêm do registry (descritores). Contextos sem uma raiz exclusiva
 * ainda ficam vazios até sua migração; não há fallback paralelo mantido à mão.
 */
import { KNOWN_CONTEXT_IDS, featureIdsForContext } from './scan-features.js';

export const CONTEXTS = Object.freeze(
    Object.fromEntries(
        KNOWN_CONTEXT_IDS.map((id) => [
            id,
            Object.freeze({
                id,
                get features() {
                    const fromRegistry = featureIdsForContext(id);
                    return Object.freeze(fromRegistry);
                }
            })
        ])
    )
);

export function getContext(contextId) {
    return CONTEXTS[contextId] || null;
}

export function listContextIds() {
    return KNOWN_CONTEXT_IDS.slice();
}
