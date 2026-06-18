/**
 * SEI Pro PRF — background service worker (ES module).
 *
 * ⚠️ DORMANT / NOT WIRED. This ESM rewrite is NOT built or shipped. The effective
 * service worker is `dist/js/background.js` (referenced by manifest.base.json as
 * `js/background.js`), which is the source of truth and is maintained verbatim.
 *
 * The Phase 5 build (scripts/build.mjs) intentionally bundles ONLY the content
 * core stack (src/content/core-stack.js); it does NOT bundle this file. The two
 * background sources currently differ — DO NOT assume this file reflects shipped
 * behaviour. Reconciling them (port dist -> here, then add to the build) is a
 * deferred follow-up. See PLANO_MIGRACAO_ARQUITETURA.md §5 Fase 5.
 */
const isChrome = typeof browser === 'undefined';
if (isChrome) {
    globalThis.browser = chrome;
}

const SEI_PRO_PROCESS_NOTIFICATIONS_KEY = 'seiProProcessNotifications';
const SEI_PRO_PROCESS_NOTIFICATION_ID = 'sei-pro-new-process';
const SEI_PRO_BUG_REPORT_TIMEOUT_MS = 15000;

function handleInstalled(details) {
    if (details.reason === 'install') {
        browser.tabs.create({ url: 'https://sei-pro.github.io/sei-pro/' });
        browser.storage.local.set({ InstallOrUpdate: true });
    } else if (details.reason === 'update') {
        browser.storage.local.get('CheckTypes', function (item) {
            browser.storage.local.set({ InstallOrUpdate: true });
            if (!item.CheckTypes || item.CheckTypes.indexOf('hidemsgupdate') === -1) {
                browser.tabs.create({ url: 'https://sei-pro.github.io/sei-pro/pages/HISTORICO.html' });
            }
        });
    }
}

browser.runtime.onInstalled.addListener(handleInstalled);

function getProcessNotificationState(callback) {
    browser.storage.local.get(SEI_PRO_PROCESS_NOTIFICATIONS_KEY, function (items) {
        let state = items && items[SEI_PRO_PROCESS_NOTIFICATIONS_KEY];
        if (!state || typeof state !== 'object') state = {};
        callback(state);
    });
}

function setProcessNotificationState(state, callback) {
    const payload = {};
    payload[SEI_PRO_PROCESS_NOTIFICATIONS_KEY] = state || {};
    browser.storage.local.set(payload, function () {
        if (typeof callback === 'function') callback();
    });
}

function clearProcessNotificationBadge() {
    if (browser.action && typeof browser.action.setBadgeText === 'function') {
        browser.action.setBadgeText({ text: '' });
    }
}

function setProcessNotificationBadge(count) {
    if (!browser.action || typeof browser.action.setBadgeText !== 'function') return;

    let text = '';
    if (count > 0) {
        text = count > 99 ? '99+' : String(count);
        if (typeof browser.action.setBadgeBackgroundColor === 'function') {
            browser.action.setBadgeBackgroundColor({ color: '#b3261e' });
        }
    }
    browser.action.setBadgeText({ text });
}

function createProcessNotification(diffCount, totalCount, label) {
    if (!browser.notifications || typeof browser.notifications.create !== 'function') return;

    const title = diffCount > 1 ? diffCount + ' novos processos' : 'Novo processo';
    const message = totalCount > 1
        ? 'Agora existem ' + totalCount + ' processos não visualizados' + (label ? ' em ' + label : '') + '.'
        : 'Existe 1 processo não visualizado' + (label ? ' em ' + label : '') + '.';

    browser.notifications.create(SEI_PRO_PROCESS_NOTIFICATION_ID + '-' + Date.now(), {
        type: 'basic',
        iconUrl: browser.runtime.getURL('icons/icon-128.png'),
        title,
        message
    });
}

function syncProcessNotificationState(message, sendResponse) {
    const key = message && message.key ? message.key : '';
    const enabled = !!(message && message.enabled);
    const count = Math.max(0, parseInt(message && message.count, 10) || 0);
    const label = message && message.label ? String(message.label) : '';

    if (!key) {
        clearProcessNotificationBadge();
        sendResponse({ ok: false });
        return;
    }

    getProcessNotificationState(function (state) {
        const previous = state[key];
        const previousCount = previous && typeof previous.count === 'number' ? previous.count : null;

        state[key] = {
            count,
            label,
            enabled,
            updatedAt: new Date().toISOString()
        };

        setProcessNotificationState(state, function () {
            if (!enabled) {
                clearProcessNotificationBadge();
                sendResponse({ ok: true, notified: false });
                return;
            }

            setProcessNotificationBadge(count);

            const diffCount = previousCount === null ? 0 : count - previousCount;
            if (diffCount > 0) {
                createProcessNotification(diffCount, count, label);
                sendResponse({ ok: true, notified: true });
                return;
            }

            sendResponse({ ok: true, notified: false });
        });
    });
}

function syncProcessNotificationConfig(message, sendResponse) {
    if (message && message.enabled === false) {
        clearProcessNotificationBadge();
    }
    sendResponse({ ok: true });
}

function isAllowedBugReportSender(sender) {
    if (!sender || !sender.url) return false;
    try {
        return new URL(sender.url).hostname === 'sei.prf.gov.br';
    } catch (e) {
        return false;
    }
}

const SEI_PRO_FETCH_ALLOWED_HOSTS = [
    'generativelanguage.googleapis.com' // Gemini — resolveCaptchaAI (Fase 4 piloto)
];

function isAllowedSender(sender) {
    return !!(sender && sender.id === browser.runtime.id && sender.url);
}

function isAllowedFetchUrl(url) {
    try {
        return SEI_PRO_FETCH_ALLOWED_HOSTS.indexOf(new URL(url).hostname) !== -1;
    } catch (e) {
        return false;
    }
}

function respondOnce(sendResponse) {
    let done = false;
    return function (payload) {
        if (done) return;
        done = true;
        sendResponse(payload);
    };
}

function storageErrorMessage(error) {
    return error && error.message ? error.message : String(error);
}

function settleStorage(result, onDone, onError) {
    if (result && typeof result.then === 'function') {
        result.then(onDone, onError);
    }
}

function buildBugReportPayloadJson(payload) {
    try {
        return JSON.stringify(payload || {});
    } catch (e) {
        return null;
    }
}

function fetchWithTimeout(url, options, timeoutMs) {
    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    let timer = null;
    const requestOptions = Object.assign({}, options || {});

    if (controller) {
        requestOptions.signal = controller.signal;
        timer = setTimeout(function () {
            controller.abort();
        }, timeoutMs);
    }

    return fetch(url, requestOptions).finally(function () {
        if (timer) clearTimeout(timer);
    });
}

browser.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    const action = message && message.action ? message.action : '';

    if (action === 'syncNotificacaoProcessos') {
        syncProcessNotificationState(message, sendResponse);
        return true;
    }

    if (action === 'syncNotificacaoProcessosConfig') {
        syncProcessNotificationConfig(message, sendResponse);
        return false;
    }

    if (action === 'fetch') {
        if (!isAllowedSender(sender)) {
            sendResponse({ ok: false, error: 'Remetente não autorizado' });
            return false;
        }
        if (!message || !message.url) {
            sendResponse({ ok: false, error: 'URL ausente' });
            return false;
        }
        if (!isAllowedFetchUrl(message.url)) {
            sendResponse({ ok: false, error: 'URL não permitida' });
            return false;
        }
        fetchWithTimeout(message.url, message.options || {}, SEI_PRO_BUG_REPORT_TIMEOUT_MS)
            .then(function (response) {
                return response.text().then(function (body) {
                    sendResponse({
                        ok: response.ok,
                        status: response.status,
                        body
                    });
                });
            })
            .catch(function (error) {
                sendResponse({ ok: false, error: error.message });
            });
        return true;
    }

    if (action === 'storageGet') {
        const areaGet = message.area === 'session' ? 'session' : (message.area === 'local' ? 'local' : 'sync');
        const storageGetApi = browser.storage[areaGet];
        if (!storageGetApi || typeof storageGetApi.get !== 'function') {
            sendResponse({ ok: false, error: 'Storage area unavailable' });
            return false;
        }
        const respGet = respondOnce(sendResponse);
        const okGet = function (items) { respGet({ ok: true, data: items }); };
        const errGet = function (e) { respGet({ ok: false, error: storageErrorMessage(e) }); };
        settleStorage(storageGetApi.get(message.keys || null, okGet), okGet, errGet);
        return true;
    }

    if (action === 'storageSet') {
        const areaSet = message.area === 'session' ? 'session' : (message.area === 'local' ? 'local' : 'sync');
        const storageSetApi = browser.storage[areaSet];
        if (!storageSetApi || typeof storageSetApi.set !== 'function') {
            sendResponse({ ok: false, error: 'Storage area unavailable' });
            return false;
        }
        const respSet = respondOnce(sendResponse);
        const okSet = function () { respSet({ ok: true, data: true }); };
        const errSet = function (e) { respSet({ ok: false, error: storageErrorMessage(e) }); };
        settleStorage(storageSetApi.set(message.items || {}, okSet), okSet, errSet);
        return true;
    }

    if (action === 'storageRemove') {
        const areaRemove = message.area === 'session' ? 'session' : (message.area === 'local' ? 'local' : 'sync');
        const storageRemoveApi = browser.storage[areaRemove];
        if (!storageRemoveApi || typeof storageRemoveApi.remove !== 'function') {
            sendResponse({ ok: false, error: 'Storage area unavailable' });
            return false;
        }
        const respRemove = respondOnce(sendResponse);
        const okRemove = function () { respRemove({ ok: true, data: true }); };
        const errRemove = function (e) { respRemove({ ok: false, error: storageErrorMessage(e) }); };
        settleStorage(storageRemoveApi.remove(message.keys || [], okRemove), okRemove, errRemove);
        return true;
    }

    if (action === 'enviarRelatorioBug') {
        if (!isAllowedBugReportSender(sender)) {
            sendResponse({ ok: false, erro: 'Relatório desabilitado fora do SEI da PRF' });
            return false;
        }
        if (!message || !message.url) {
            sendResponse({ ok: false, erro: 'URL do relatório ausente' });
            return false;
        }
        const payloadJson = buildBugReportPayloadJson(message.payload);
        if (!payloadJson) {
            sendResponse({ ok: false, erro: 'Falha ao serializar relatório' });
            return false;
        }

        function parseResponse(response) {
            return response.text().then(function (text) {
                let data = {};
                try {
                    data = text ? JSON.parse(text) : {};
                } catch (e) {}
                return {
                    ok: response.ok && (!data.status || data.status === 'ok'),
                    data
                };
            });
        }

        function sendViaGet() {
            const encoded = btoa(unescape(encodeURIComponent(payloadJson)));
            const url = message.url + '?d=' + encodeURIComponent(encoded);
            return fetchWithTimeout(url, { method: 'GET', redirect: 'follow' }, SEI_PRO_BUG_REPORT_TIMEOUT_MS)
                .then(parseResponse);
        }

        fetchWithTimeout(message.url, {
            method: 'POST',
            redirect: 'follow',
            headers: {
                'Content-Type': 'text/plain;charset=utf-8'
            },
            body: payloadJson
        }, SEI_PRO_BUG_REPORT_TIMEOUT_MS)
            .then(parseResponse)
            .then(function (result) {
                if (result.ok) {
                    sendResponse({ ok: true });
                    return;
                }
                return sendViaGet().then(function (fallbackResult) {
                    sendResponse({
                        ok: fallbackResult.ok,
                        erro: fallbackResult.ok ? '' : (fallbackResult.data && fallbackResult.data.mensagem ? fallbackResult.data.mensagem : 'Falha ao enviar relat\u00F3rio')
                    });
                });
            })
            .catch(function (postError) {
                sendViaGet()
                    .then(function (fallbackResult) {
                        sendResponse({
                            ok: fallbackResult.ok,
                            erro: fallbackResult.ok ? '' : (fallbackResult.data && fallbackResult.data.mensagem ? fallbackResult.data.mensagem : postError.message)
                        });
                    })
                    .catch(function (getError) {
                        sendResponse({ ok: false, erro: getError.message || postError.message });
                    });
            });
        return true;
    }
});
