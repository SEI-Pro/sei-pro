/**
 * Event bus leve para eventos transversais entre features.
 * Whitelist: config:changed, monitorados:updated, process-list:refreshed.
 */
import { getSeiPro } from '../core/global.js';

const ALLOWED = new Set([
    'config:changed',
    'monitorados:updated',
    'process-list:refreshed'
]);

function createBus() {
    const listeners = new Map();

    function on(event, handler) {
        if (!ALLOWED.has(event) || typeof handler !== 'function') return () => {};
        if (!listeners.has(event)) listeners.set(event, new Set());
        listeners.get(event).add(handler);
        return function off() {
            const set = listeners.get(event);
            if (set) set.delete(handler);
        };
    }

    function emit(event, payload) {
        if (!ALLOWED.has(event)) return;
        const set = listeners.get(event);
        if (!set || !set.size) return;
        set.forEach((handler) => {
            try { handler(payload); } catch (e) { /* ignore listener errors */ }
        });
    }

    return Object.freeze({ on, emit, ALLOWED: Object.freeze([...ALLOWED]) });
}

export function installBus() {
    const ns = getSeiPro();
    if (ns.platform && ns.platform.bus) return ns.platform.bus;
    ns.platform = ns.platform || {};
    ns.platform.bus = createBus();
    return ns.platform.bus;
}

export function getBus() {
    const ns = typeof globalThis !== 'undefined' && globalThis.SeiPro;
    if (ns && ns.platform && ns.platform.bus) return ns.platform.bus;
    return installBus();
}

export const bus = {
    on(event, handler) { return getBus().on(event, handler); },
    emit(event, payload) { return getBus().emit(event, payload); }
};
