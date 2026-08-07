/**
 * Contextos SEI conhecidos e features associadas (piloto: login + db).
 * Matches/CSS do manifest continuam em manifest.base.json até geração automática.
 */

export const CONTEXTS = Object.freeze({
    login: Object.freeze({
        id: 'login',
        features: Object.freeze(['login'])
    }),
    db: Object.freeze({
        id: 'db',
        features: Object.freeze(['external-config'])
    })
});

export function getContext(contextId) {
    return CONTEXTS[contextId] || null;
}

export function listContextIds() {
    return Object.keys(CONTEXTS);
}
