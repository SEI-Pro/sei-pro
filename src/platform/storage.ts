// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
import { getSeiPro } from '../core/global.js';

/**
 * Fachada de storage delegada ao service worker (centraliza chrome.storage).
 * Camada de plataforma — isolated-world.
 *
 * Factory pura (ADR-0005): não muta global. `installStorage` anexa ao namespace
 * legado; raízes de composição devem preferir `createStorage`.
 *
 * @param {{ messaging?: { sendMessage: (msg: object) => Promise<any> } }} [deps]
 */
export function createStorage(deps = {}) {
    function resolveMessaging() {
        if (deps.messaging && typeof deps.messaging.sendMessage === 'function') {
            return deps.messaging;
        }
        return getSeiPro().core.messaging;
    }

    function call(action, area, payload) {
        return resolveMessaging().sendMessage(
            Object.assign({ action, area }, payload)
        ).then(function (response) {
            if (!response || !response.ok) {
                throw new Error((response && response.error) || (action + ' failed'));
            }
            return response.data;
        });
    }

    function storageGet(area, keys) { return call('storageGet', area, { keys }); }
    function storageSet(area, items) { return call('storageSet', area, { items }); }
    function storageRemove(area, keys) { return call('storageRemove', area, { keys }); }

    return {
        getSync: function (keys) { return storageGet('sync', keys); },
        setSync: function (items) { return storageSet('sync', items); },
        removeSync: function (keys) { return storageRemove('sync', keys); },
        getLocal: function (keys) { return storageGet('local', keys); },
        setLocal: function (items) { return storageSet('local', items); },
        removeLocal: function (keys) { return storageRemove('local', keys); },
        getSession: function (keys) { return storageGet('session', keys); },
        setSession: function (items) { return storageSet('session', items); },
        removeSession: function (keys) { return storageRemove('session', keys); }
    };
}

/** Compat: anexa a fachada em SeiPro.core.storage. */
export function installStorage() {
    const storage = createStorage();
    getSeiPro().core.storage = storage;
    return storage;
}
