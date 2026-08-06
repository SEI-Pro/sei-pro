import { createLlmClient } from '../core/llm/client.js';
import { getProvider } from '../core/llm/providers/index.js';

const LLM_PORT_NAME = 'seipro-llm';
const BUILT_IN_HOSTS = [
    'api.openai.com',
    'api.anthropic.com',
    'generativelanguage.googleapis.com',
    'api.moonshot.ai',
    'localhost',
    '127.0.0.1'
];

// MV3 still requires host permission for service-worker fetches. The known
// providers are declared as optional_host_permissions today; custom trusted
// profile hosts will be requested at runtime by the settings flow later.

function errorMessage(error) {
    return error && error.message ? error.message : String(error);
}

export function isAllowedSender(sender, browserApi) {
    return Boolean(
        sender
        && browserApi
        && browserApi.runtime
        && sender.id === browserApi.runtime.id
        && sender.url
    );
}

function parseProfileUrl(value) {
    if (!value) return null;
    try {
        const parsed = new URL(value);
        const isLocal = parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1';
        if (parsed.protocol !== 'https:' && !(isLocal && parsed.protocol === 'http:')) return null;
        return parsed;
    } catch (_) {
        return null;
    }
}

export function buildAllowedHosts(profile = {}) {
    const hosts = new Set(BUILT_IN_HOSTS);
    const configuredUrl = parseProfileUrl(profile.baseUrl);
    if (configuredUrl) hosts.add(configuredUrl.hostname);
    return hosts;
}

export function isAllowedLlmUrl(url, profile = {}) {
    try {
        const parsed = new URL(url);
        const profileUrl = parseProfileUrl(profile.baseUrl);
        const isLocal = parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1';
        if (parsed.protocol !== 'https:' && !(isLocal && parsed.protocol === 'http:')) return false;
        if (!buildAllowedHosts(profile).has(parsed.hostname)) return false;

        if (profileUrl && parsed.hostname === profileUrl.hostname) {
            return parsed.origin === profileUrl.origin;
        }
        return true;
    } catch (_) {
        return false;
    }
}

function readProfiles(browserApi) {
    return new Promise(function (resolve, reject) {
        const storage = browserApi && browserApi.storage && browserApi.storage.local;
        if (!storage || typeof storage.get !== 'function') {
            reject(new Error('Local LLM profile storage is unavailable'));
            return;
        }

        let settled = false;
        function finish(items) {
            if (settled) return;
            settled = true;
            const profiles = items && Array.isArray(items.llmProfiles) ? items.llmProfiles : [];
            resolve(profiles);
        }
        function fail(error) {
            if (settled) return;
            settled = true;
            reject(error);
        }

        try {
            const result = storage.get('llmProfiles', finish);
            if (result && typeof result.then === 'function') result.then(finish, fail);
        } catch (error) {
            fail(error);
        }
    });
}

function sameConfiguredEndpoint(requestedBaseUrl, storedBaseUrl) {
    if (!requestedBaseUrl || !storedBaseUrl) return true;
    const requested = parseProfileUrl(requestedBaseUrl);
    const stored = parseProfileUrl(storedBaseUrl);
    return Boolean(requested && stored && requested.origin === stored.origin);
}

export async function resolveLlmRequest(request, browserApi) {
    if (!request || typeof request !== 'object') throw new TypeError('LLM request is required');

    const requestProfile = request.profile && typeof request.profile === 'object'
        ? request.profile
        : {};
    const profileId = request.profileId || requestProfile.id;
    if (!profileId) throw new Error('LLM profile id is required');

    const profiles = await readProfiles(browserApi);
    const storedProfile = profiles.find(function (profile) {
        return profile && profile.id === profileId;
    });
    if (!storedProfile) throw new Error('LLM profile was not found');

    if (!sameConfiguredEndpoint(requestProfile.baseUrl, storedProfile.baseUrl)) {
        throw new Error('LLM profile base URL does not match stored configuration');
    }

    const baseUrl = requestProfile.baseUrl || storedProfile.baseUrl;
    const parsedBaseUrl = parseProfileUrl(baseUrl);
    if (baseUrl && !parsedBaseUrl) throw new Error('LLM profile base URL is invalid');

    if (parsedBaseUrl && BUILT_IN_HOSTS.indexOf(parsedBaseUrl.hostname) === -1 && storedProfile.trusted !== true) {
        throw new Error('Custom LLM profile host is not trusted');
    }

    const {
        profile: _profile,
        profileId: _profileId,
        apiKey: _apiKey,
        key: _key,
        providerId: _providerId,
        baseUrl: _baseUrl,
        ...safeRequest
    } = request;

    return {
        ...safeRequest,
        requestId: request.requestId,
        providerId: storedProfile.providerId,
        baseUrl,
        model: request.model || storedProfile.model,
        apiKey: storedProfile.key || '',
        profile: {
            id: storedProfile.id,
            baseUrl,
            trusted: storedProfile.trusted === true
        }
    };
}

function assertFetchResponse(response) {
    if (!response) throw new Error('LLM provider returned no response');
    if (response.ok === false || (response.status != null && response.status >= 400)) {
        const status = response.status || 'unknown';
        if (Number(status) === 429) {
            const retryAfter = response.headers?.get?.('retry-after');
            const wait = retryAfter ? ` Aguarde ${formatRetryAfter(retryAfter)} antes de tentar novamente.` : '';
            throw new Error(`O provedor de IA atingiu o limite de requisições (429).${wait}`);
        }
        if (Number(status) === 401 || Number(status) === 403) {
            throw new Error(`O provedor de IA recusou a autenticação (${status}). Verifique a chave e o perfil selecionado.`);
        }
        throw new Error(`O provedor de IA recusou a solicitação (${status}).`);
    }
}

function formatRetryAfter(value) {
    const seconds = Number(value);
    if (Number.isFinite(seconds) && seconds > 0) {
        return seconds < 60 ? `${seconds} segundos` : `${Math.ceil(seconds / 60)} minutos`;
    }
    return 'alguns instantes';
}

export function createFetchTransport(profile) {
    function requestOptions(outgoing) {
        if (!isAllowedLlmUrl(outgoing.url, profile)) {
            throw new Error('LLM provider URL is not allowed');
        }
        return {
            method: 'POST',
            headers: outgoing.headers || {},
            body: JSON.stringify(outgoing.body || {}),
            signal: outgoing.signal
        };
    }

    return {
        async post(outgoing) {
            const response = await fetch(outgoing.url, requestOptions(outgoing));
            assertFetchResponse(response);
            return response;
        },

        async postStream(outgoing) {
            const response = await fetch(outgoing.url, requestOptions(outgoing));
            assertFetchResponse(response);
            if (!response.body || typeof response.body.getReader !== 'function') {
                throw new Error('LLM provider returned no readable stream');
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            return {
                async *[Symbol.asyncIterator]() {
                    try {
                        while (true) {
                            const chunk = await reader.read();
                            if (chunk.done) break;
                            const text = decoder.decode(chunk.value, { stream: true });
                            if (text) yield text;
                        }
                        const trailing = decoder.decode();
                        if (trailing) yield trailing;
                    } finally {
                        if (typeof reader.releaseLock === 'function') reader.releaseLock();
                    }
                }
            };
        }
    };
}

function createClient(profile) {
    return createLlmClient({
        transport: createFetchTransport(profile),
        getProvider
    });
}

function safePost(port, payload) {
    try {
        port.postMessage(payload);
        return true;
    } catch (_) {
        return false;
    }
}

function forwardChunk(port, requestId, chunk, metadata, startedTools) {
    if (!chunk) return;
    if (chunk.delta != null || chunk.reasoningContent != null) {
        safePost(port, {
            type: 'delta',
            requestId,
            delta: chunk.delta || '',
            reasoningContent: chunk.reasoningContent
        });
    }

    (chunk.toolCalls || []).forEach(function (tool) {
        const toolKey = tool.index == null ? (tool.id || tool.name) : String(tool.index);
        const previous = metadata.toolCalls.get(toolKey) || {};
        metadata.toolCalls.set(toolKey, mergeToolCall(previous, tool));
        if (!startedTools.has(toolKey)) {
            startedTools.add(toolKey);
            safePost(port, { type: 'tool_start', requestId, tool });
        }
    });
    (chunk.toolResults || []).forEach(function (result) {
        safePost(port, { type: 'tool_result', requestId, result });
    });

    if (chunk.finishReason != null) metadata.finishReason = chunk.finishReason;
    if (chunk.usage != null) metadata.usage = chunk.usage;
}

function mergeToolCall(previous, next) {
    const merged = { ...previous, ...next };
    const oldArgs = previous.arguments;
    const newArgs = next.arguments;
    if (typeof newArgs === 'string') {
        if (typeof oldArgs === 'string') {
            merged.arguments = newArgs.startsWith(oldArgs) ? newArgs : oldArgs + newArgs;
        } else {
            merged.arguments = newArgs;
        }
    } else if (newArgs === undefined && oldArgs !== undefined) {
        merged.arguments = oldArgs;
    }
    return merged;
}

export function handleLlmConnect(port, browserApi) {
    if (!port || port.name !== LLM_PORT_NAME) return false;
    if (!isAllowedSender(port.sender, browserApi)) {
        safePost(port, { type: 'error', error: 'Unauthorized LLM stream sender' });
        if (typeof port.disconnect === 'function') port.disconnect();
        return false;
    }

    const active = new Map();
    const cancelled = new Set();

    async function start(message) {
        const requestId = message.requestId || (message.request && message.request.requestId);
        if (!requestId) {
            safePost(port, { type: 'error', error: 'LLM request id is required' });
            return;
        }
        if (active.has(requestId)) {
            safePost(port, { type: 'error', requestId, error: 'LLM request is already active' });
            return;
        }

        try {
            const resolved = await resolveLlmRequest({
                ...(message.request || {}),
                requestId
            }, browserApi);
            const client = createClient(resolved.profile);
            const metadata = { toolCalls: new Map() };
            const startedTools = new Set();
            active.set(requestId, client);

            for await (const chunk of client.stream(resolved)) {
                forwardChunk(port, requestId, chunk, metadata, startedTools);
            }
            safePost(port, {
                type: 'done',
                requestId,
                finishReason: metadata.finishReason,
                usage: metadata.usage,
                toolCalls: [...metadata.toolCalls.values()]
            });
        } catch (error) {
            if (cancelled.has(requestId) || (error && error.name === 'AbortError')) {
                safePost(port, { type: 'done', requestId, cancelled: true });
            } else {
                safePost(port, { type: 'error', requestId, error: errorMessage(error) });
            }
        } finally {
            active.delete(requestId);
            cancelled.delete(requestId);
        }
    }

    function cancel(requestId) {
        const client = active.get(requestId);
        if (!client) return false;
        cancelled.add(requestId);
        return client.cancel(requestId);
    }

    port.onMessage.addListener(function (message) {
        if (!message) return;
        if (message.type === 'start') start(message);
        if (message.type === 'cancel') cancel(message.requestId);
    });
    port.onDisconnect.addListener(function () {
        active.forEach(function (client, requestId) {
            cancelled.add(requestId);
            client.cancel(requestId);
        });
        active.clear();
    });
    return true;
}

export function handleLlmCompleteMessage(message, sender, sendResponse, browserApi) {
    if (!isAllowedSender(sender, browserApi)) {
        sendResponse({ ok: false, error: 'Unauthorized LLM completion sender' });
        return false;
    }

    resolveLlmRequest(message && message.request, browserApi)
        .then(async function (resolved) {
            const client = createClient(resolved.profile);
            const result = await client.complete(resolved);
            sendResponse({ ok: true, result });
        })
        .catch(function (error) {
            sendResponse({ ok: false, error: errorMessage(error) });
        });
    return true;
}

globalThis.SeiProBackgroundLlm = {
    handleLlmCompleteMessage,
    handleLlmConnect,
    isAllowedLlmUrl
};
