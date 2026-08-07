// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
import { createSseParser } from './sse.js';

export function createLlmClient({ transport, getProvider } = {}) {
    if (!transport || typeof transport.post !== 'function' || typeof transport.postStream !== 'function') {
        throw new TypeError('A transport with post and postStream is required');
    }
    if (typeof getProvider !== 'function') throw new TypeError('getProvider must be a function');

    const controllers = new Map();
    let sequence = 0;

    function startRequest(request) {
        const requestId = request.requestId || `llm-${Date.now()}-${++sequence}`;
        const controller = new AbortController();
        controllers.set(requestId, controller);
        return { requestId, controller };
    }

    return {
        async complete(request) {
            const provider = getProvider(request.providerId);
            const pending = startRequest(request);
            try {
                const outgoing = provider.buildRequest({ ...request, stream: false });
                const response = await transport.post({
                    ...outgoing,
                    signal: pending.controller.signal
                });
                assertSuccessful(response);
                const json = await readJson(response);
                return provider.parseComplete(json);
            } finally {
                controllers.delete(pending.requestId);
            }
        },

        async *stream(request) {
            const provider = getProvider(request.providerId);
            const pending = startRequest(request);
            const parser = createSseParser();
            const providerState = typeof provider.createStreamState === 'function'
                ? provider.createStreamState()
                : {};
            try {
                const outgoing = provider.buildRequest({ ...request, stream: true });
                const chunks = await transport.postStream({
                    ...outgoing,
                    signal: pending.controller.signal
                });
                for await (const chunk of chunks) {
                    const events = parser.push(chunk);
                    for (const event of events) {
                        const delta = provider.parseChunk(event, providerState);
                        if (delta) yield delta;
                    }
                }
                for (const event of parser.flush()) {
                    const delta = provider.parseChunk(event, providerState);
                    if (delta) yield delta;
                }
            } finally {
                controllers.delete(pending.requestId);
            }
        },

        cancel(requestId) {
            const controller = controllers.get(requestId);
            if (!controller) return false;
            controller.abort();
            controllers.delete(requestId);
            return true;
        }
    };
}

function assertSuccessful(response) {
    if (!response) throw new Error('LLM provider returned no response');
    if (response.ok === false || (response.status != null && response.status >= 400)) {
        throw new Error(`LLM provider request failed with status ${response.status || 'unknown'}`);
    }
}

async function readJson(response) {
    if (typeof response.json === 'function') return response.json();
    if (typeof response.body === 'string') return JSON.parse(response.body);
    if (response.body && typeof response.body === 'object') return response.body;
    if (typeof response.text === 'function') return JSON.parse(await response.text());
    return response;
}
