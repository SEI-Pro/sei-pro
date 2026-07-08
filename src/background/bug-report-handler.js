/******************************************************************************
 SEI Pro PRF Dev: bug report message adapter for background service worker.

 Mantém a compatibilidade da ação legada `enviarRelatorioBug`, mas isola a
 validação do remetente, serialização e fallback POST→GET para reduzir o
 monólito de `background.js` de forma incremental.
*******************************************************************************/

(function (global) {
    'use strict';

    const SEI_PRO_BUG_REPORT_TIMEOUT_MS = 15000;

    function isAllowedBugReportSender(sender) {
        if (!sender || !sender.url) return false;
        try {
            return new URL(sender.url).hostname === 'sei.prf.gov.br';
        } catch (e) {
            return false;
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

    function parseBugReportResponse(response) {
        return response.text().then(function(text) {
            var data = {};
            try {
                data = text ? JSON.parse(text) : {};
            } catch (e) {}
            return {
                ok: response.ok && (!data.status || data.status === 'ok'),
                data: data
            };
        });
    }

    function handleBugReportMessage(message, sender, sendResponse) {
        if (!isAllowedBugReportSender(sender)) {
            sendResponse({ ok: false, erro: 'Relatório desabilitado fora do SEI da PRF' });
            return false;
        }
        if (!message || !message.url) {
            sendResponse({ ok: false, erro: 'URL do relatório ausente' });
            return false;
        }
        var payloadJson = buildBugReportPayloadJson(message.payload);
        if (!payloadJson) {
            sendResponse({ ok: false, erro: 'Falha ao serializar relatório' });
            return false;
        }

        function sendViaGet() {
            var encoded = btoa(unescape(encodeURIComponent(payloadJson)));
            var url = message.url + '?d=' + encodeURIComponent(encoded);
            return fetchWithTimeout(url, { method: 'GET', redirect: 'follow' }, SEI_PRO_BUG_REPORT_TIMEOUT_MS)
                .then(parseBugReportResponse);
        }

        fetchWithTimeout(message.url, {
            method: 'POST',
            redirect: 'follow',
            headers: {
                'Content-Type': 'text/plain;charset=utf-8'
            },
            body: payloadJson
        }, SEI_PRO_BUG_REPORT_TIMEOUT_MS)
        .then(parseBugReportResponse)
        .then(function(result) {
            if (result.ok) {
                sendResponse({ ok: true });
                return;
            }
            return sendViaGet().then(function(fallbackResult) {
                sendResponse({
                    ok: fallbackResult.ok,
                    erro: fallbackResult.ok ? '' : (fallbackResult.data && fallbackResult.data.mensagem ? fallbackResult.data.mensagem : 'Falha ao enviar relat\u00F3rio')
                });
            });
        })
        .catch(function(postError) {
            sendViaGet()
                .then(function(fallbackResult) {
                    sendResponse({
                        ok: fallbackResult.ok,
                        erro: fallbackResult.ok ? '' : (fallbackResult.data && fallbackResult.data.mensagem ? fallbackResult.data.mensagem : postError.message)
                    });
                })
                .catch(function(getError) {
                    sendResponse({ ok: false, erro: getError.message || postError.message });
                });
        });
        return true; // mantém o canal aberto para resposta assíncrona
    }

    global.SeiProBackgroundBugReport = {
        buildBugReportPayloadJson: buildBugReportPayloadJson,
        handleBugReportMessage: handleBugReportMessage,
        isAllowedBugReportSender: isAllowedBugReportSender
    };
})(typeof globalThis !== 'undefined' ? globalThis : this);
