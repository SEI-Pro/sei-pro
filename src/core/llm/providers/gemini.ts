// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
const DEFAULT_BASE_URL = 'https://generativelanguage.googleapis.com';

export function buildRequest({
    apiKey,
    baseUrl = DEFAULT_BASE_URL,
    model,
    messages = [],
    system,
    tools = [],
    temperature,
    maxTokens,
    stream = false
} = {}) {
    const method = stream ? 'streamGenerateContent' : 'generateContent';
    const query = new URLSearchParams();
    query.set('key', apiKey || '');
    if (stream) query.set('alt', 'sse');

    const body = {
        contents: messages
            .filter(function (message) { return message.role !== 'system'; })
            .map(mapMessage)
    };
    const messageSystem = messages
        .filter(function (message) { return message.role === 'system'; })
        .map(function (message) { return message.content; })
        .join('\n\n');
    if (system || messageSystem) {
        body.systemInstruction = {
            parts: [{ text: [system, messageSystem].filter(Boolean).join('\n\n') }]
        };
    }
    if (tools.length) {
        body.tools = [{
            functionDeclarations: tools.map(function (tool) {
                return {
                    name: tool.name,
                    description: tool.description || '',
                    parameters: tool.parameters
                };
            })
        }];
    }
    if (temperature != null || maxTokens != null) {
        body.generationConfig = {};
        if (temperature != null) body.generationConfig.temperature = temperature;
        if (maxTokens != null) body.generationConfig.maxOutputTokens = maxTokens;
    }

    return {
        url: `${String(baseUrl).replace(/\/+$/, '')}/v1beta/models/${encodeURIComponent(model)}:${method}?${query}`,
        headers: { 'Content-Type': 'application/json' },
        body
    };
}

export function parseChunk(event) {
    if (!event || event.done || event.data === '[DONE]') return null;
    const json = readEventData(event);
    return json ? parseResponse(json, true) : null;
}

export function parseComplete(json) {
    return parseResponse(json, false) || {};
}

function parseResponse(json, streaming) {
    if (!json || typeof json !== 'object') return null;
    const candidate = json.candidates && json.candidates[0];
    const parts = candidate && candidate.content && Array.isArray(candidate.content.parts)
        ? candidate.content.parts
        : [];
    const text = parts
        .filter(function (part) { return typeof part.text === 'string'; })
        .map(function (part) { return part.text; })
        .join('');
    const toolCalls = parts
        .filter(function (part) { return part.functionCall; })
        .map(function (part, index) {
            return {
                index,
                name: part.functionCall.name,
                arguments: part.functionCall.args || {}
            };
        });
    const result = {};
    if (text) result[streaming ? 'delta' : 'content'] = text;
    if (toolCalls.length) result.toolCalls = toolCalls;
    if (candidate && candidate.finishReason != null) result.finishReason = candidate.finishReason;
    if (json.usageMetadata) {
        result.usage = {
            inputTokens: json.usageMetadata.promptTokenCount,
            outputTokens: json.usageMetadata.candidatesTokenCount,
            totalTokens: json.usageMetadata.totalTokenCount
        };
    }
    return Object.keys(result).length ? result : null;
}

function mapMessage(message) {
    const role = message.role === 'assistant' ? 'model' : 'user';
    if (Array.isArray(message.content)) return { role, parts: message.content };
    return { role, parts: [{ text: String(message.content) }] };
}

function readEventData(event) {
    if (typeof event === 'string') {
        try {
            return JSON.parse(event);
        } catch (_) {
            return null;
        }
    }
    if (typeof event.data === 'object') return event.data;
    try {
        return JSON.parse(event.data);
    } catch (_) {
        return null;
    }
}
