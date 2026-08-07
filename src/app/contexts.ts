// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/**
 * Contextos SEI conhecidos (ADR-0002 / ADR-0004).
 * Feature ids vêm do registry (descritores); o fallback cobre o piloto
 * login/db antes de registerPilotFeatures() rodar.
 */
import { KNOWN_CONTEXT_IDS, featureIdsForContext } from './scan-features.js';

/** @deprecated prefer KNOWN_CONTEXT_IDS — kept for callers expecting CONTEXTS shape */
const PILOT_FALLBACK = Object.freeze({
    login: Object.freeze(['login']),
    db: Object.freeze(['external-config'])
});

export const CONTEXTS = Object.freeze(
    Object.fromEntries(
        KNOWN_CONTEXT_IDS.map((id) => [
            id,
            Object.freeze({
                id,
                get features() {
                    const fromRegistry = featureIdsForContext(id);
                    if (fromRegistry.length) return Object.freeze(fromRegistry);
                    return PILOT_FALLBACK[id] || Object.freeze([]);
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
