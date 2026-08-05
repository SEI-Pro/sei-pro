import { getSeiPro, globalRef } from '../core/global.js';

const LLM_PORT_NAME = 'seipro-llm';
let requestSequence = 0;

function getRuntime() {
    if (globalRef.browser && globalRef.browser.runtime) return globalRef.browser.runtime;
    if (globalRef.chrome && globalRef.chrome.runtime) return globalRef.chrome.runtime;
    return null;
}

function createRequestId() {
    requestSequence += 1;
    return `llm-${Date.now()}-${requestSequence}`;
}

/**
 * Open a streaming LLM request through the background service worker.
 * @returns {{ port, cancel(), requestId }}
 * Events on port: { type: 'delta'|'done'|'error'|'tool_start'|'tool_result', ... }
 */
export function openLlmStream(request = {}) {
    const runtime = getRuntime();
    if (!runtime || typeof runtime.connect !== 'function') {
        throw new Error('SeiPro LLM streaming is unavailable: chrome.runtime.connect is missing');
    }

    const requestId = request.requestId || createRequestId();
    const port = runtime.connect({ name: LLM_PORT_NAME });
    let cancelled = false;

    port.postMessage({
        type: 'start',
        requestId,
        request: { ...request, requestId }
    });

    return {
        port,
        requestId,
        cancel() {
            if (cancelled) return false;
            cancelled = true;
            try {
                port.postMessage({ type: 'cancel', requestId });
                return true;
            } catch (_) {
                return false;
            }
        }
    };
}

/**
 * Run a non-streaming LLM request through the background service worker.
 */
export function completeLlm(request = {}) {
    const messaging = getSeiPro().core.messaging;
    if (!messaging || typeof messaging.sendMessage !== 'function') {
        return Promise.reject(new Error('SeiPro.messaging is unavailable'));
    }

    return messaging.sendMessage({
        action: 'llmComplete',
        request
    }).then(function (response) {
        if (!response || response.ok !== true) {
            throw new Error((response && response.error) || 'LLM completion failed');
        }
        return response.result;
    });
}
