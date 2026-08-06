/**
 * Atividades — IO boundary (storage/network adapters).
 *
 * Does not call view. The large response router remains in server.js until each
 * branch can take an explicit callback instead of touching DOM/globals.
 */

/** Current Atividades backend URL from runtime state. */
export function getAtividadesServerUrl(globalRef = globalThis) {
    return globalRef.urlServerAtiv || false;
}

/**
 * POST JSON to the Atividades server. Inject `ajax` in tests; defaults to jQuery
 * while the wire format still matches the legacy Apps Script contract.
 *
 * @returns {Promise<any>}
 */
export function postAtividadesServer(url, data, {
    ajax,
    beforeSend
} = {}) {
    const runAjax = ajax
        || (typeof globalThis !== 'undefined' && globalThis.$ && typeof globalThis.$.ajax === 'function'
            ? globalThis.$.ajax.bind(globalThis.$)
            : null);

    if (typeof runAjax !== 'function') {
        return Promise.reject(new Error('postAtividadesServer: ajax transport unavailable'));
    }
    if (!url) {
        return Promise.reject(new Error('postAtividadesServer: missing url'));
    }

    return new Promise((resolve, reject) => {
        runAjax({
            type: 'POST',
            beforeSend,
            url,
            dataType: 'json',
            data,
            success: resolve,
            error: function (xhr, status, err) {
                reject({ xhr: xhr, status: status, err: err });
            }
        });
    });
}

/** Read a hybrid-storage key when helpers exist; otherwise null. */
export function restoreAtividadesHybrid(key, {
    hybridStorageRestorePro,
    getOptionsPro
} = {}) {
    const restore = hybridStorageRestorePro
        || (typeof globalThis !== 'undefined' ? globalThis.hybridStorageRestorePro : null);
    const opts = getOptionsPro
        || (typeof globalThis !== 'undefined' ? globalThis.getOptionsPro : null);
    if (typeof restore !== 'function') return null;
    if (typeof opts === 'function' && opts('panelLocalStorePro')) return null;
    const value = restore(key);
    return value === null || typeof value === 'undefined' ? null : value;
}
