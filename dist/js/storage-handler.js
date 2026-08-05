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

    function getLocalProfiles(browserApi, onDone, onError) {
        var storage = browserApi && browserApi.storage && browserApi.storage.local;
        if (!storage || typeof storage.get !== 'function') {
            onError(new Error('Local LLM profile storage is unavailable'));
            return;
        }
        var settled = false;
        function finish(items) {
            if (settled) return;
            settled = true;
            onDone(items && Array.isArray(items.llmProfiles) ? items.llmProfiles : [], storage);
        }
        function fail(error) {
            if (settled) return;
            settled = true;
            onError(error);
        }
        try {
            settleStorage(storage.get('llmProfiles', finish), finish, fail);
        } catch (error) {
            fail(error);
        }
    }

    function setLocalProfiles(storage, profiles, onDone, onError) {
        var settled = false;
        function finish() {
            if (settled) return;
            settled = true;
            onDone();
        }
        function fail(error) {
            if (settled) return;
            settled = true;
            onError(error);
        }
        try {
            settleStorage(storage.set({ llmProfiles: profiles }, finish), finish, fail);
        } catch (error) {
            fail(error);
        }
    }

    function safeProfile(profile) {
        return {
            id: profile.id,
            providerId: profile.providerId,
            baseUrl: profile.baseUrl || '',
            model: profile.model || '',
            trusted: profile.trusted === true,
            label: profile.label || '',
            hasKey: Boolean(profile.key)
        };
    }

    function handleStorageMessage(action, message, sendResponse, browserApi) {
        if (action === 'llmProfilesList') {
            var respList = respondOnce(sendResponse);
            getLocalProfiles(browserApi, function (profiles) {
                respList({ ok: true, profiles: profiles.map(safeProfile) });
            }, function (error) {
                respList({ ok: false, error: storageErrorMessage(error) });
            });
            return true;
        }

        if (action === 'llmSaveProfile') {
            var respSave = respondOnce(sendResponse);
            var incoming = message && message.profile;
            if (!incoming || !incoming.id || !incoming.providerId || !incoming.model) {
                respSave({ ok: false, error: 'Invalid LLM profile' });
                return false;
            }
            getLocalProfiles(browserApi, function (profiles, storage) {
                var index = profiles.findIndex(function (profile) { return profile.id === incoming.id; });
                var previous = index >= 0 ? profiles[index] : {};
                var stored = {
                    id: String(incoming.id),
                    providerId: String(incoming.providerId),
                    baseUrl: String(incoming.baseUrl || ''),
                    key: incoming.key ? String(incoming.key) : String(previous.key || ''),
                    model: String(incoming.model),
                    trusted: incoming.trusted === true,
                    label: String(incoming.label || '')
                };
                if (index >= 0) profiles[index] = stored;
                else profiles.push(stored);
                setLocalProfiles(storage, profiles, function () {
                    respSave({ ok: true, profile: safeProfile(stored) });
                }, function (error) {
                    respSave({ ok: false, error: storageErrorMessage(error) });
                });
            }, function (error) {
                respSave({ ok: false, error: storageErrorMessage(error) });
            });
            return true;
        }

        if (action === 'llmDeleteProfile') {
            var respDelete = respondOnce(sendResponse);
            var profileId = String(message && message.profileId || '');
            getLocalProfiles(browserApi, function (profiles, storage) {
                var next = profiles.filter(function (profile) { return profile.id !== profileId; });
                setLocalProfiles(storage, next, function () {
                    respDelete({ ok: true });
                }, function (error) {
                    respDelete({ ok: false, error: storageErrorMessage(error) });
                });
            }, function (error) {
                respDelete({ ok: false, error: storageErrorMessage(error) });
            });
            return true;
        }

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
