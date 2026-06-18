import { getSeiPro, globalRef } from './global.js';

export function installMessaging() {
    function getRuntime() {
        if (typeof globalRef.browser !== 'undefined' && globalRef.browser.runtime) {
            return globalRef.browser.runtime;
        }
        if (typeof globalRef.chrome !== 'undefined' && globalRef.chrome.runtime) {
            return globalRef.chrome.runtime;
        }
        return null;
    }

    function sendMessage(message) {
        const runtime = getRuntime();
        if (!runtime || typeof runtime.sendMessage !== 'function') {
            // chrome.runtime só existe no mundo ISOLADO. No mundo MAIN da página
            // (onde rodam os arquivos carregados via $.getScript) esta fachada não
            // alcança o service worker — exigiria uma ponte MAIN→isolado com
            // validação de origem (RISCO CONHECIDO, ver PLANO_MIGRACAO_ARQUITETURA.md
            // §4 e SMOKE_TEST.md). Falha explícita em vez de silenciosa.
            const action = (message && message.action) || 'desconhecida';
            return Promise.reject(new Error(
                'SeiPro.messaging: runtime de extensão indisponível (provável mundo MAIN). ' +
                'Ação "' + action + '" não pôde ser entregue ao service worker.'
            ));
        }
        return new Promise(function (resolve, reject) {
            try {
                const result = runtime.sendMessage(message, function (response) {
                    const lastError = globalRef.chrome && globalRef.chrome.runtime && globalRef.chrome.runtime.lastError;
                    if (lastError) {
                        reject(new Error(lastError.message));
                        return;
                    }
                    resolve(response);
                });
                if (result && typeof result.then === 'function') {
                    result.then(resolve).catch(reject);
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    const messaging = { sendMessage };
    getSeiPro().core.messaging = messaging;
    return messaging;
}
