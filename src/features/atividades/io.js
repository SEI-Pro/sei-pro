/**
 * Atividades — IO boundary (thin during big-bang).
 * Server calls remain in body.js; this is the extension point for fetch adapters.
 */
export function getAtividadesServerUrl(globalRef = globalThis) {
    return globalRef.urlServerAtiv || false;
}
