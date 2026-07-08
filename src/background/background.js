/******************************************************************************
 SEI Pro PRF Dev: background service worker.
 Abre a página de boas-vindas na instalação e o histórico de mudanças
 nas atualizações (exceto se o usuário desativou a notificação).
*******************************************************************************/

const isChrome = (typeof browser === 'undefined');
if (isChrome) { var browser = chrome; }

if (typeof importScripts === 'function') {
    importScripts('storage-handler.js', 'fetch-handler.js', 'bug-report-handler.js', 'process-notification-handler.js', 'install-handler.js');
}

function handleInstalled(details) {
    if (!globalThis.SeiProBackgroundInstall || typeof globalThis.SeiProBackgroundInstall.handleInstalled !== 'function') {
        return;
    }
    globalThis.SeiProBackgroundInstall.handleInstalled(details, browser);
}

browser.runtime.onInstalled.addListener(handleInstalled);

// Recebe requisições de envio de relatório de bug dos content scripts
// e faz o fetch a partir do service worker (sem restrições de CORS).
// Preferimos POST para evitar estourar o tamanho da URL quando há logs.
browser.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    var action = message && message.action ? message.action : '';

    if (action === 'syncNotificacaoProcessos' || action === 'syncNotificacaoProcessosConfig') {
        if (!globalThis.SeiProBackgroundProcessNotification || typeof globalThis.SeiProBackgroundProcessNotification.handleProcessNotificationMessage !== 'function') {
            sendResponse({ ok: false, error: 'Process notification handler unavailable' });
            return false;
        }
        return globalThis.SeiProBackgroundProcessNotification.handleProcessNotificationMessage(action, message, sendResponse, browser);
    }

    if (action === 'fetch') {
        if (!globalThis.SeiProBackgroundFetch || typeof globalThis.SeiProBackgroundFetch.handleFetchMessage !== 'function') {
            sendResponse({ ok: false, error: 'Fetch handler unavailable' });
            return false;
        }
        return globalThis.SeiProBackgroundFetch.handleFetchMessage(message, sender, sendResponse, browser);
    }

    if (action === 'storageGet' || action === 'storageSet' || action === 'storageRemove') {
        if (!globalThis.SeiProBackgroundStorage || typeof globalThis.SeiProBackgroundStorage.handleStorageMessage !== 'function') {
            sendResponse({ ok: false, error: 'Storage handler unavailable' });
            return false;
        }
        return globalThis.SeiProBackgroundStorage.handleStorageMessage(action, message, sendResponse, browser);
    }

    if (action === 'enviarRelatorioBug') {
        if (!globalThis.SeiProBackgroundBugReport || typeof globalThis.SeiProBackgroundBugReport.handleBugReportMessage !== 'function') {
            sendResponse({ ok: false, erro: 'Bug report handler unavailable' });
            return false;
        }
        return globalThis.SeiProBackgroundBugReport.handleBugReportMessage(message, sender, sendResponse);
    }
});
