/******************************************************************************
 SEI Pro PRF Dev: background service worker.
 Abre a página de boas-vindas na instalação e o histórico de mudanças
 nas atualizações (exceto se o usuário desativou a notificação).
*******************************************************************************/

const isChrome = (typeof browser === 'undefined');
if (isChrome) { var browser = chrome; }

if (typeof importScripts === 'function') {
    importScripts('storage-handler.js', 'fetch-handler.js', 'llm-handler.js', 'bug-report-handler.js', 'process-notification-handler.js', 'install-handler.js', 'router.js');
}

function handleInstalled(details) {
    if (!globalThis.SeiProBackgroundInstall || typeof globalThis.SeiProBackgroundInstall.handleInstalled !== 'function') {
        return;
    }
    globalThis.SeiProBackgroundInstall.handleInstalled(details, browser);
}

function handleMessage(message, sender, sendResponse) {
    if (!globalThis.SeiProBackgroundRouter || typeof globalThis.SeiProBackgroundRouter.handleMessage !== 'function') {
        sendResponse({ ok: false, error: 'Background router unavailable' });
        return false;
    }
    return globalThis.SeiProBackgroundRouter.handleMessage(message, sender, sendResponse, browser);
}

function handleConnect(port) {
    if (!globalThis.SeiProBackgroundLlm || typeof globalThis.SeiProBackgroundLlm.handleLlmConnect !== 'function') {
        return false;
    }
    return globalThis.SeiProBackgroundLlm.handleLlmConnect(port, browser);
}

browser.runtime.onInstalled.addListener(handleInstalled);
browser.runtime.onMessage.addListener(handleMessage);
browser.runtime.onConnect.addListener(handleConnect);
