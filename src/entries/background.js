/**
 * Raiz de composição do contexto SERVICE WORKER — ADR-0002/0005.
 *
 * O service worker continua classic (importScripts) porque os adapters legados
 * ainda compartilham contratos globais. A diferença importante é que a ordem de
 * carga e o registro dos listeners agora pertencem a uma entry explícita, em vez
 * de serem um arquivo solto misturado aos handlers.
 */

const HANDLER_SCRIPTS = [
    'storage-handler.js',
    'fetch-handler.js',
    'llm-handler.js',
    'bug-report-handler.js',
    'process-notification-handler.js',
    'install-handler.js',
    'router.js'
];

function resolveBrowserApi(globalApi = globalThis) {
    return globalApi && (globalApi.browser || globalApi.chrome);
}

function loadHandlers(globalApi, importScriptsApi) {
    if (typeof importScriptsApi === 'function') {
        importScriptsApi(...HANDLER_SCRIPTS);
    }
    return globalApi;
}

/**
 * Boot the worker against an injectable browser API. The injectable seam keeps
 * listener registration testable without starting a real service worker.
 */
export function bootBackgroundContext(options = {}) {
    const globalApi = options.globalApi || globalThis;
    const importScriptsApi = options.importScriptsApi || globalApi.importScripts;
    const browserApi = resolveBrowserApi(globalApi);
    if (!browserApi || !browserApi.runtime) return false;

    loadHandlers(globalApi, importScriptsApi);

    function handleInstalled(details) {
        if (!globalApi.SeiProBackgroundInstall || typeof globalApi.SeiProBackgroundInstall.handleInstalled !== 'function') {
            return;
        }
        globalApi.SeiProBackgroundInstall.handleInstalled(details, browserApi);
    }

    function handleMessage(message, sender, sendResponse) {
        if (!globalApi.SeiProBackgroundRouter || typeof globalApi.SeiProBackgroundRouter.handleMessage !== 'function') {
            sendResponse({ ok: false, error: 'Background router unavailable' });
            return false;
        }
        return globalApi.SeiProBackgroundRouter.handleMessage(message, sender, sendResponse, browserApi);
    }

    function handleConnect(port) {
        if (!globalApi.SeiProBackgroundLlm || typeof globalApi.SeiProBackgroundLlm.handleLlmConnect !== 'function') {
            return false;
        }
        return globalApi.SeiProBackgroundLlm.handleLlmConnect(port, browserApi);
    }

    browserApi.runtime.onInstalled?.addListener(handleInstalled);
    browserApi.runtime.onMessage?.addListener(handleMessage);
    browserApi.runtime.onConnect?.addListener(handleConnect);
    return true;
}

// A bundled service-worker script has no module consumer; boot only when the
// extension API is present so importing the entry in a test remains harmless.
if (resolveBrowserApi()) {
    bootBackgroundContext();
}
