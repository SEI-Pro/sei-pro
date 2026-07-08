/******************************************************************************
 SEI Pro PRF Dev: storage message adapter for background service worker.

 Mantém a compatibilidade das ações legadas `storageGet`, `storageSet` e
 `storageRemove`, mas isola a lógica de roteamento/normalização do storage para
 reduzir o monólito de `background.js` de forma incremental.
*******************************************************************************/

(function (global) {
    'use strict';

    function respondOnce(sendResponse) {
        var done = false;
        return function (payload) {
            if (done) return;
            done = true;
            sendResponse(payload);
        };
    }

    function storageErrorMessage(error) {
        return error && error.message ? error.message : String(error);
    }

    // Normalize browser.storage results across Chrome (callback) and Firefox
    // (Promise) MV3 implementations: settle from whichever path the engine uses.
    function settleStorage(result, onDone, onError) {
        if (result && typeof result.then === 'function') {
            result.then(onDone, onError);
        }
    }

    function getStorageAreaName(area) {
        return area === 'session' ? 'session' : (area === 'local' ? 'local' : 'sync');
    }

    function getStorageApi(browserApi, area) {
        return browserApi.storage[getStorageAreaName(area)];
    }

    function handleStorageMessage(action, message, sendResponse, browserApi) {
        if (action === 'storageGet') {
            var storageGetApi = getStorageApi(browserApi, message.area);
            if (!storageGetApi || typeof storageGetApi.get !== 'function') {
                sendResponse({ ok: false, error: 'Storage area unavailable' });
                return false;
            }
            var respGet = respondOnce(sendResponse);
            var okGet = function (items) { respGet({ ok: true, data: items }); };
            var errGet = function (e) { respGet({ ok: false, error: storageErrorMessage(e) }); };
            settleStorage(storageGetApi.get(message.keys || null, okGet), okGet, errGet);
            return true;
        }

        if (action === 'storageSet') {
            var storageSetApi = getStorageApi(browserApi, message.area);
            if (!storageSetApi || typeof storageSetApi.set !== 'function') {
                sendResponse({ ok: false, error: 'Storage area unavailable' });
                return false;
            }
            var respSet = respondOnce(sendResponse);
            var okSet = function () { respSet({ ok: true, data: true }); };
            var errSet = function (e) { respSet({ ok: false, error: storageErrorMessage(e) }); };
            settleStorage(storageSetApi.set(message.items || {}, okSet), okSet, errSet);
            return true;
        }

        if (action === 'storageRemove') {
            var storageRemoveApi = getStorageApi(browserApi, message.area);
            if (!storageRemoveApi || typeof storageRemoveApi.remove !== 'function') {
                sendResponse({ ok: false, error: 'Storage area unavailable' });
                return false;
            }
            var respRemove = respondOnce(sendResponse);
            var okRemove = function () { respRemove({ ok: true, data: true }); };
            var errRemove = function (e) { respRemove({ ok: false, error: storageErrorMessage(e) }); };
            settleStorage(storageRemoveApi.remove(message.keys || [], okRemove), okRemove, errRemove);
            return true;
        }

        return null;
    }

    global.SeiProBackgroundStorage = {
        getStorageAreaName: getStorageAreaName,
        handleStorageMessage: handleStorageMessage
    };
})(typeof globalThis !== 'undefined' ? globalThis : this);
