// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/**
 * Cross-fatia command bus.
 *
 * Internal feature code dispatches through the registered command map.  The
 * namespace lookup is an integration boundary for independently loaded
 * bundles; direct global-name fallback is intentionally opt-in and exists
 * only for old external pages during the rollout.
 */

import { getAtividadesContext } from './context.js';

let injectedDispatcher = null;

function legacyFallbackEnabled() {
    return typeof globalThis !== 'undefined'
        && globalThis.__SEI_PRO_ENABLE_LEGACY_ATIVIDADES__ === true;
}

export function createAtividadesDispatcher({ registry = {}, fallback = null } = {}) {
    const map = registry;
    return Object.freeze({
        resolve(name) {
            if (typeof map[name] === 'function') return map[name];
            return typeof fallback === 'function' ? fallback(name) : null;
        },
        call(name, ...args) {
            const fn = this.resolve(name);
            return typeof fn === 'function' ? fn(...args) : undefined;
        },
        has(name) { return typeof this.resolve(name) === 'function'; }
    });
}

export function installAtividadesDispatcher(dispatcher) {
    injectedDispatcher = dispatcher || null;
    return injectedDispatcher;
}

export function callAtiv(name, ...args) {
    if (!name) return undefined;
    if (injectedDispatcher && typeof injectedDispatcher.call === 'function') {
        const available = typeof injectedDispatcher.has === 'function'
            ? injectedDispatcher.has(name)
            : typeof injectedDispatcher.resolve === 'function' && typeof injectedDispatcher.resolve(name) === 'function';
        // A command may legitimately return undefined. Resolve the target
        // before calling so that such commands are not invoked twice through
        // the context fallback.
        if (available) return injectedDispatcher.call(name, ...args);
    }
    const context = getAtividadesContext();
    if (context && context.api && typeof context.api.dispatch === 'function') {
        const available = typeof context.api.resolve === 'function'
            ? context.api.resolve(name)
            : null;
        if (typeof available === 'function') return context.api.dispatch(name, ...args);
    }
    const feature = (typeof globalThis !== 'undefined'
        && globalThis.SeiPro
        && globalThis.SeiPro.features
        && globalThis.SeiPro.features.atividades) || null;
    const api = feature && feature.api;
    const fromCommands = api && api.commands && typeof api.commands[name] === 'function'
        ? api.commands[name]
        : null;
    const fromQueries = api && api.queries && typeof api.queries[name] === 'function'
        ? api.queries[name]
        : null;
    const fromHandlers = api && api.handlers && typeof api.handlers[name] === 'function'
        ? api.handlers[name]
        : null;
    const fromGlobal = (legacyFallbackEnabled() && typeof globalThis[name] === 'function')
        ? globalThis[name]
        : null;
    const fn = fromCommands || fromQueries || fromHandlers || fromGlobal;
    if (typeof fn !== 'function') return undefined;
    return fn(...args);
}

/** True when a named handler/global is available (replaces typeof fn !== 'undefined'). */
export function hasAtiv(name) {
    if (!name) return false;
    if (injectedDispatcher && typeof injectedDispatcher.has === 'function' && injectedDispatcher.has(name)) return true;
    const context = getAtividadesContext();
    if (context && context.api && typeof context.api.resolve === 'function'
        && typeof context.api.resolve(name) === 'function') return true;
    const feature = (typeof globalThis !== 'undefined'
        && globalThis.SeiPro
        && globalThis.SeiPro.features
        && globalThis.SeiPro.features.atividades) || null;
    const api = feature && feature.api;
    if (api && api.commands && typeof api.commands[name] === 'function') return true;
    if (api && api.queries && typeof api.queries[name] === 'function') return true;
    if (api && api.handlers && typeof api.handlers[name] === 'function') return true;
    return legacyFallbackEnabled() && typeof globalThis[name] === 'function';
}
