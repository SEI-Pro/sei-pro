/**
 * Atividades state adapter.
 *
 * New code uses the store/context APIs.  The global projection below is kept
 * deliberately small and isolated so the old SEI page can finish its rollout
 * without making globals the source of truth again.
 */
import { globalRef } from '../../core/global.js';
import { createAtividadesContext, getAtividadesContext, installAtividadesContext } from './context.js';
import { ATIVIDADES_STATE_DEFAULTS, createAtividadesStore } from './store.js';

const STATE_KEYS = Object.keys(ATIVIDADES_STATE_DEFAULTS);

function readInitialState(g) {
    return STATE_KEYS.reduce((out, key) => {
        if (typeof g[key] !== 'undefined') out[key] = g[key];
        return out;
    }, {});
}

function projectStoreToPage(store, g) {
    store.subscribe((state, changed) => {
        Object.keys(changed).forEach((key) => {
            const descriptor = Object.getOwnPropertyDescriptor(g, key);
            if (!descriptor || typeof descriptor.set !== 'function') g[key] = state[key];
        });
    });
    const current = store.get();
    STATE_KEYS.forEach((key) => { g[key] = current[key]; });
}
export function installAtividadesState(g = globalRef) {
    if (g.__SEI_PRO_ATIVIDADES_STATE_INSTALLED__) return g;
    const store = createAtividadesStore(readInitialState(g));
    const existing = g.__SEI_PRO_ATIVIDADES_CONTEXT__;
    const context = existing || createAtividadesContext({ globalRef: g, store });
    if (!existing) installAtividadesContext(context, g);
    STATE_KEYS.forEach((key) => {
        const descriptor = Object.getOwnPropertyDescriptor(g, key);
        if (descriptor && descriptor.configurable === false) return;
        try {
            Object.defineProperty(g, key, {
                configurable: true,
                enumerable: true,
                get: () => context.store.get()[key],
                set: (value) => context.store.patch({ [key]: value })
            });
        } catch (e) {
            // Hosts with sealed window objects retain the projected value.
            g[key] = context.store.get()[key];
        }
    });
    projectStoreToPage(context.store, g);
    g.__SEI_PRO_ATIVIDADES_STATE_INSTALLED__ = true;
    return g;
}

/**
 * Re-run storage-backed selectors after options/hybrid storage are available.
 * Runtime initialization assigns the storage-backed values; this is a second
 * pass at boot after the page adapters become available.
 */
export function refreshAtividadesState(g = globalThis) {
    const context = getAtividadesContext(g);
    const store = context.store;
    try {
        const jquery = context.dom && context.dom.$;
        if (typeof jquery === 'function') {
            const arrayAtividades = (jquery('#ifrArvore').length > 0)
                ? (g.arrayAtividadesProcPro || [])
                : (g.arrayAtividadesPro || []);
            store.patch({ arrayAtividades });
        }
    } catch (e) { /* ignore */ }

    try {
        const storage = context.storage && context.storage.local;
        if (typeof g.Chart !== 'undefined' && g.chartColors && g.Chart.defaults) {
            const darkMode = storage && typeof storage.getItem === 'function'
                ? storage.getItem('darkModePro')
                : false;
            g.Chart.defaults.color = darkMode
                ? g.chartColors.light_grey
                : g.chartColors.dark_grey;
        }
    } catch (e) { /* ignore */ }

    return g;
}

export function getAtividadesState() {
    return getAtividadesContext().store.get();
}

/** Capture one-time values produced by the browser boot adapter. */
export function syncAtividadesStateFromPage(g = globalRef) {
    const context = getAtividadesContext(g);
    const values = STATE_KEYS.reduce((out, key) => {
        if (typeof g[key] !== 'undefined') out[key] = g[key];
        return out;
    }, {});
    context.store.patch(values);
    return context.store.get();
}

export { ATIVIDADES_STATE_DEFAULTS, createAtividadesStore } from './store.js';
export { createAtividadesContext, getAtividadesContext, installAtividadesContext } from './context.js';
