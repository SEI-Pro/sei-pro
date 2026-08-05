/******************************************************************************
 SEI Pro PRF Dev: message router for background service worker.

 Mantém a compatibilidade das ações legadas do service worker, mas isola o
 roteamento de mensagens do bootstrap `background.js`. Cada ação continua sendo
 delegada para o adapter dedicado já carregado por `importScripts`.
*******************************************************************************/

(function (global) {
    'use strict';

    function handleMessage(message, sender, sendResponse, browserApi) {
        var action = message && message.action ? message.action : '';

        if (action === 'syncNotificacaoProcessos' || action === 'syncNotificacaoProcessosConfig') {
            if (!global.SeiProBackgroundProcessNotification || typeof global.SeiProBackgroundProcessNotification.handleProcessNotificationMessage !== 'function') {
                sendResponse({ ok: false, error: 'Process notification handler unavailable' });
                return false;
            }
            return global.SeiProBackgroundProcessNotification.handleProcessNotificationMessage(action, message, sendResponse, browserApi);
        }

        if (action === 'fetch') {
            if (!global.SeiProBackgroundFetch || typeof global.SeiProBackgroundFetch.handleFetchMessage !== 'function') {
                sendResponse({ ok: false, error: 'Fetch handler unavailable' });
                return false;
            }
            return global.SeiProBackgroundFetch.handleFetchMessage(message, sender, sendResponse, browserApi);
        }

        if (action === 'llmComplete') {
            if (!global.SeiProBackgroundLlm || typeof global.SeiProBackgroundLlm.handleLlmCompleteMessage !== 'function') {
                sendResponse({ ok: false, error: 'LLM handler unavailable' });
                return false;
            }
            return global.SeiProBackgroundLlm.handleLlmCompleteMessage(message, sender, sendResponse, browserApi);
        }

        if (
            action === 'storageGet'
            || action === 'storageSet'
            || action === 'storageRemove'
            || action === 'llmProfilesList'
            || action === 'llmSaveProfile'
            || action === 'llmDeleteProfile'
        ) {
            if (!global.SeiProBackgroundStorage || typeof global.SeiProBackgroundStorage.handleStorageMessage !== 'function') {
                sendResponse({ ok: false, error: 'Storage handler unavailable' });
                return false;
            }
            return global.SeiProBackgroundStorage.handleStorageMessage(action, message, sendResponse, browserApi);
        }

        if (action === 'enviarRelatorioBug') {
            if (!global.SeiProBackgroundBugReport || typeof global.SeiProBackgroundBugReport.handleBugReportMessage !== 'function') {
                sendResponse({ ok: false, erro: 'Bug report handler unavailable' });
                return false;
            }
            return global.SeiProBackgroundBugReport.handleBugReportMessage(message, sender, sendResponse);
        }

        return undefined;
    }

    global.SeiProBackgroundRouter = {
        handleMessage: handleMessage
    };
})(typeof globalThis !== 'undefined' ? globalThis : this);
