// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
import { getSeiPro, globalRef } from '../core/global.js';

/**
 * Transporte para o service worker via runtime.sendMessage (isolated-world).
 * Sem mundo MAIN, `chrome.runtime` está sempre presente; a rejeição abaixo só
 * ocorre em contexto degenerado (API ausente).
 *
 * Factory pura (ADR-0005): não muta global. `installMessaging` anexa ao namespace.
 *
 * @param {{ runtime?: { sendMessage: Function } }} [deps]
 */
export function createMessaging(deps = {}) {
    function getRuntime() {
        if (deps.runtime && typeof deps.runtime.sendMessage === 'function') {
            return deps.runtime;
        }
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
            const action = (message && message.action) || 'desconhecida';
            return Promise.reject(new Error(
                'SeiPro.messaging: chrome.runtime indisponível. Ação "' + action +
                '" não pôde ser entregue ao service worker.'
            ));
        }
        return new Promise(function (resolve, reject) {
            try {
                const result = runtime.sendMessage(message, function (response) {
                    const lastError = globalRef.chrome && globalRef.chrome.runtime && globalRef.chrome.runtime.lastError;
                    if (lastError) { reject(new Error(lastError.message)); return; }
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

    return { sendMessage };
}

/** Compat: anexa messaging em SeiPro.core.messaging. */
export function installMessaging() {
    const messaging = createMessaging();
    getSeiPro().core.messaging = messaging;
    return messaging;
}
