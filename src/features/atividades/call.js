/**
 * Cross-fatia calls without import cycles.
 *
 * Fatias must not import each other (cycles). They also must not rely on
 * aliasGlobal for internal dispatch. Resolve through the feature handlers map
 * installed on SeiPro.features.atividades (see handlers.js / index.js).
 */

export function callAtiv(name, ...args) {
    if (!name) return undefined;
    const api = (typeof globalThis !== 'undefined'
        && globalThis.SeiPro
        && globalThis.SeiPro.features
        && globalThis.SeiPro.features.atividades) || null;
    const fromHandlers = api && api.handlers && typeof api.handlers[name] === 'function'
        ? api.handlers[name]
        : null;
    const fromNamespace = api && typeof api[name] === 'function' ? api[name] : null;
    const fromGlobal = (typeof globalThis !== 'undefined' && typeof globalThis[name] === 'function')
        ? globalThis[name]
        : null;
    const fn = fromHandlers || fromNamespace || fromGlobal;
    if (typeof fn !== 'function') return undefined;
    return fn(...args);
}

/** True when a named handler/global is available (replaces typeof fn !== 'undefined'). */
export function hasAtiv(name) {
    if (!name) return false;
    const api = (typeof globalThis !== 'undefined'
        && globalThis.SeiPro
        && globalThis.SeiPro.features
        && globalThis.SeiPro.features.atividades) || null;
    if (api && api.handlers && typeof api.handlers[name] === 'function') return true;
    if (api && typeof api[name] === 'function') return true;
    return typeof globalThis !== 'undefined' && typeof globalThis[name] === 'function';
}
