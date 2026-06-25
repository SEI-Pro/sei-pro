import { getSeiPro } from '../core/global.js';

/**
 * Fachada de storage delegada ao service worker (centraliza chrome.storage).
 * Camada de plataforma — isolated-world.
 */
export function installStorage() {
    function call(action, area, payload) {
        return getSeiPro().core.messaging.sendMessage(
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

    const storage = {
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

    getSeiPro().core.storage = storage;
    return storage;
}
