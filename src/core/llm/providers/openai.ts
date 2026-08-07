// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
const DEFAULT_BASE_URL = 'https://api.openai.com';

export function buildRequest({
    apiKey,
    baseUrl = DEFAULT_BASE_URL,
    model,
    messages = [],
    system,
    tools = [],
    temperature,
    maxTokens,
    stream = false,
    reasoning_effort,
    reasoningEffort
} = {}) {
    const normalizedMessages = [];
    if (system) normalizedMessages.push({ role: 'system', content: system });
    normalizedMessages.push(...messages);

    const body = {
        model,
        messages: normalizedMessages,
        stream: Boolean(stream)
    };
    if (tools.length) {
        body.tools = tools.map(function (tool) {
            return {
                type: 'function',
                function: {
                    name: tool.name,
                    description: tool.description || '',
                    parameters: tool.parameters
                }
            };
        });
    }
    if (temperature != null) body.temperature = temperature;
    if (maxTokens != null) body.max_tokens = maxTokens;
    const requestedReasoningEffort = reasoning_effort ?? reasoningEffort;
    if (requestedReasoningEffort != null) body.reasoning_effort = requestedReasoningEffort;

    const headers = { 'Content-Type': 'application/json' };
    if (apiKey) headers.Authorization = `Bearer ${apiKey}`;

    return {
        url: chatCompletionsUrl(baseUrl),
        headers,
        body
    };
}

export function parseChunk(event) {
    if (!event || event.done || event.data === '[DONE]') return null;
    const json = readEventData(event);
    if (!json) return null;

    const choice = json.choices && json.choices[0];
    const delta = choice && choice.delta ? choice.delta : {};
    const result = {};
    if (delta.content != null) result.delta = delta.content;
    if (delta.reasoning_content != null) result.reasoningContent = delta.reasoning_content;
    if (delta.tool_calls) result.toolCalls = normalizeToolCalls(delta.tool_calls);
    if (choice && choice.finish_reason != null) result.finishReason = choice.finish_reason;
    if (json.usage) result.usage = normalizeUsage(json.usage);
    return Object.keys(result).length ? result : null;
}

export function parseComplete(json) {
    if (!json || typeof json !== 'object') return {};
    const choice = json.choices && json.choices[0];
    const message = choice && choice.message ? choice.message : {};
    const result = {};
    if (message.content != null) result.content = message.content;
    if (message.reasoning_content != null) result.reasoningContent = message.reasoning_content;
    if (message.tool_calls) result.toolCalls = normalizeToolCalls(message.tool_calls);
    if (choice && choice.finish_reason != null) result.finishReason = choice.finish_reason;
    if (json.usage) result.usage = normalizeUsage(json.usage);
    return result;
}

function normalizeToolCalls(calls) {
    return calls.map(function (call) {
        const fn = call.function || {};
        const normalized = { arguments: parseArguments(fn.arguments) };
        if (call.id != null) normalized.id = call.id;
        if (call.index != null) normalized.index = call.index;
        if (fn.name != null) normalized.name = fn.name;
        return normalized;
    });
}

function parseArguments(value) {
    if (typeof value !== 'string') return value;
    try {
        return JSON.parse(value);
    } catch (_) {
        return value;
    }
}

function normalizeUsage(usage) {
    return {
        inputTokens: usage.prompt_tokens,
        outputTokens: usage.completion_tokens,
        totalTokens: usage.total_tokens
    };
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

function chatCompletionsUrl(baseUrl) {
    const base = String(baseUrl || DEFAULT_BASE_URL).replace(/\/+$/, '');
    return base.endsWith('/v1')
        ? `${base}/chat/completions`
        : `${base}/v1/chat/completions`;
}
