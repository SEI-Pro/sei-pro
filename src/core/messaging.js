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
            return Promise.reject(new Error('Extension runtime unavailable'));
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
