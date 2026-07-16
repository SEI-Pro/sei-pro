/******************************************************************************
 SEI Pro PRF Dev: fetch message adapter for background service worker.

 Mantém a compatibilidade da ação legada `fetch`, mas isola a validação de
 remetente/host e o fetch com timeout para reduzir o monólito de `background.js`
 de forma incremental.
*******************************************************************************/

(function (global) {
    'use strict';

    const SEI_PRO_FETCH_TIMEOUT_MS = 15000;

    // Hosts the generic `fetch` action is permitted to reach. The service worker runs
    // with host permissions, so an unrestricted fetch action would let any injected
    // script use the extension as a cross-origin proxy. The action rejects anything
    // not matched here. Keep this list tight — only hosts a migrated call-site
    // actually delegates to belong here (see DEVELOPMENT.md — platform / background).
    const SEI_PRO_FETCH_ALLOWED_HOSTS = [
        'generativelanguage.googleapis.com' // Gemini — resolveCaptchaAI (Fase 4 piloto)
    ];

    // Only accept messages that originated from this extension's own content scripts.
    function isAllowedSender(sender, browserApi) {
        return !!(sender && browserApi && sender.id === browserApi.runtime.id && sender.url);
    }

    function isAllowedFetchUrl(url) {
        try {
            return SEI_PRO_FETCH_ALLOWED_HOSTS.indexOf(new URL(url).hostname) !== -1;
        } catch (e) {
            return false;
        }
    }

    function fetchWithTimeout(url, options, timeoutMs) {
        var controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
        var timer = null;
        var requestOptions = Object.assign({}, options || {});

        if (controller) {
            requestOptions.signal = controller.signal;
            timer = setTimeout(function() {
                controller.abort();
            }, timeoutMs);
        }

        return fetch(url, requestOptions).finally(function() {
            if (timer) clearTimeout(timer);
        });
    }

    function handleFetchMessage(message, sender, sendResponse, browserApi) {
        if (!isAllowedSender(sender, browserApi)) {
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
        fetchWithTimeout(message.url, message.options || {}, SEI_PRO_FETCH_TIMEOUT_MS)
            .then(function (response) {
                return response.text().then(function (body) {
                    sendResponse({
                        ok: response.ok,
                        status: response.status,
                        body: body
                    });
                });
            })
            .catch(function (error) {
                sendResponse({ ok: false, error: error.message });
            });
        return true;
    }

    global.SeiProBackgroundFetch = {
        handleFetchMessage: handleFetchMessage,
        fetchWithTimeout: fetchWithTimeout,
        isAllowedFetchUrl: isAllowedFetchUrl
    };
})(typeof globalThis !== 'undefined' ? globalThis : this);
