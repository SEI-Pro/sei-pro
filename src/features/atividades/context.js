/**
 * Explicit runtime context for Atividades.
 *
 * Feature code can now receive this object instead of reaching into the page
 * environment.  `createAtividadesContext` is dependency-injection friendly;
 * `getAtividadesContext` is the one boundary adapter used by the browser boot.
 */
import { globalRef } from '../../core/global.js';
import { createAtividadesStore } from './store.js';

const CONTEXT_KEY = '__SEI_PRO_ATIVIDADES_CONTEXT__';

function safeCall(fn, fallback, args) {
    if (typeof fn !== 'function') return fallback;
    try { return fn(...args); } catch (e) { return fallback; }
}

export function createAtividadesContext(options = {}) {
    const page = options.globalRef || globalRef;
    const store = options.store || createAtividadesStore(options.initialState || {});
    const jquery = options.jquery || page.$;
    const documentRef = options.document || page.document;
    const clock = options.clock || (() => new Date());
    const schedule = options.schedule || ((fn, delay) => page.setTimeout(fn, delay));
    const cancelSchedule = options.cancelSchedule || ((id) => page.clearTimeout(id));
    const getOption = options.getOption || ((key) => safeCall(page.getOptionsPro, undefined, [key]));
    const setOption = options.setOption || ((key, value) => safeCall(page.setOptionsPro, undefined, [key, value]));
    const verifyConfig = options.verifyConfig || ((key) => safeCall(page.verifyConfigValue, false, [key]));
    const checkConfig = options.checkConfig || ((key) => safeCall(page.checkConfigValue, false, [key]));
    const checkCapability = options.checkCapability || ((name) => {
        const feature = page.SeiPro && page.SeiPro.features && page.SeiPro.features.atividades;
        const api = feature && feature.api;
        const fn = api && api.handlers && api.handlers.checkCapacidade;
        return typeof fn === 'function' ? fn(name) : false;
    });

    const context = {
        page,
        store,
        clock,
        schedule,
        cancelSchedule,
        dom: {
            document: documentRef,
            $: jquery,
            query(selector, root = documentRef) {
                return root && typeof root.querySelector === 'function' ? root.querySelector(selector) : null;
            },
            queryAll(selector, root = documentRef) {
                return root && typeof root.querySelectorAll === 'function' ? Array.from(root.querySelectorAll(selector)) : [];
            },
            html(value, root) {
                if (root) root.innerHTML = value == null ? '' : String(value);
                return value;
            }
        },
        options: { get: getOption, set: setOption, verifyConfig, checkConfig },
        permissions: { check: checkCapability },
        storage: {
            local: options.localStorage || page.localStorage,
            session: options.sessionStorage || page.sessionStorage
        },
        effects: {
            loading(value) { return safeCall(options.loading || page.loadingButtonConfirm, undefined, [value]); },
            alert(...args) { return safeCall(options.alert || page.alertaBoxPro, undefined, args); },
            confirm(...args) { return safeCall(options.confirm || page.confirmaBoxPro, undefined, args); },
            notify(...args) { return safeCall(options.notify || page.notificacaoBoxPro, undefined, args); }
        },
        events: {
            emit(name, detail) {
                if (typeof options.emit === 'function') return options.emit(name, detail);
                if (documentRef && typeof documentRef.dispatchEvent === 'function' && typeof page.CustomEvent === 'function') {
                    documentRef.dispatchEvent(new page.CustomEvent(name, { detail }));
                }
                return undefined;
            }
        },
        api: {
            resolve(name) {
                const feature = page.SeiPro && page.SeiPro.features && page.SeiPro.features.atividades;
                const api = feature && feature.api;
                if (api && api.handlers && typeof api.handlers[name] === 'function') {
                    return api.handlers[name];
                }
                return null;
            },
            dispatch(name, ...args) {
                const fn = this.resolve(name);
                return typeof fn === 'function' ? fn(...args) : undefined;
            }
        }
    };
    return Object.freeze(context);
}

export function installAtividadesContext(context, page = globalRef) {
    if (!context || !context.store) throw new TypeError('Atividades context requires a store');
    page[CONTEXT_KEY] = context;
    return context;
}

export function getAtividadesContext(page = globalRef) {
    if (page[CONTEXT_KEY]) return page[CONTEXT_KEY];
    return installAtividadesContext(createAtividadesContext({ globalRef: page }), page);
}

export function resetAtividadesContext(page = globalRef) {
    const previous = page[CONTEXT_KEY];
    try { delete page[CONTEXT_KEY]; } catch (e) { page[CONTEXT_KEY] = undefined; }
    return previous;
}

export const ATIVIDADES_CONTEXT_KEY = CONTEXT_KEY;
