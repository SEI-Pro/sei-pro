import { getSeiPro } from './global.js';

export function installStorage() {
    function storageGet(area, keys) {
        return getSeiPro().core.messaging.sendMessage({
            action: 'storageGet',
            area,
            keys
        }).then(function (response) {
            if (!response || !response.ok) {
                throw new Error((response && response.error) || 'storageGet failed');
            }
            return response.data;
        });
    }

    function storageSet(area, items) {
        return getSeiPro().core.messaging.sendMessage({
            action: 'storageSet',
            area,
            items
        }).then(function (response) {
            if (!response || !response.ok) {
                throw new Error((response && response.error) || 'storageSet failed');
            }
            return response.data;
        });
    }

    function storageRemove(area, keys) {
        return getSeiPro().core.messaging.sendMessage({
            action: 'storageRemove',
            area,
            keys
        }).then(function (response) {
            if (!response || !response.ok) {
                throw new Error((response && response.error) || 'storageRemove failed');
            }
            return response.data;
        });
    }

    function fetchRequest(url, options) {
        return getSeiPro().core.messaging.sendMessage({
            action: 'fetch',
            url,
            options: options || {}
        }).then(function (response) {
            if (!response) {
                throw new Error('fetch failed');
            }
            // The service worker returns { ok, status, body } for any completed
            // HTTP response (including 4xx/5xx) and { ok: false, error } only on a
            // transport-level failure (blocked URL, network error). Resolve the
            // former so callers can inspect status/body — matching fetch()
            // semantics, which rejects only on network failure, not HTTP status.
            if (typeof response.status === 'undefined') {
                throw new Error(response.error || 'fetch failed');
            }
            return response;
        });
    }

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

    const net = { fetch: fetchRequest };

    getSeiPro().core.storage = storage;
    getSeiPro().core.net = net;

    return { storage, net };
}
