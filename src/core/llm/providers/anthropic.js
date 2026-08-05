const DEFAULT_BASE_URL = 'https://api.anthropic.com';
const defaultStreamState = createStreamState();

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
    const body = {
        model,
        messages: messages.filter(function (message) {
            return message.role !== 'system';
        }),
        max_tokens: maxTokens == null ? 4096 : maxTokens,
        stream: Boolean(stream)
    };
    const messageSystem = messages
        .filter(function (message) { return message.role === 'system'; })
        .map(function (message) { return message.content; })
        .join('\n\n');
    if (system || messageSystem) body.system = [system, messageSystem].filter(Boolean).join('\n\n');
    if (tools.length) {
        body.tools = tools.map(function (tool) {
            return {
                name: tool.name,
                description: tool.description || '',
                input_schema: tool.parameters
            };
        });
    }
    if (temperature != null) body.temperature = temperature;

    return {
        url: `${String(baseUrl).replace(/\/+$/, '')}/v1/messages`,
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey || '',
            'anthropic-version': '2023-06-01',
            'anthropic-dangerous-direct-browser-access': 'true'
        },
        body
    };
}

export function parseChunk(event, state = defaultStreamState) {
    if (!event || event.done || event.data === '[DONE]') return null;
    const json = readEventData(event);
    if (!json) return null;

    if (json.type === 'message_start') {
        state.tools.clear();
        const usage = json.message && json.message.usage;
        return usage ? { usage: normalizeUsage(usage) } : null;
    }

    if (json.type === 'content_block_start') {
        const block = json.content_block || {};
        if (block.type === 'text' && block.text) return { delta: block.text };
        if (block.type === 'tool_use') {
            state.tools.set(json.index, {
                id: block.id,
                name: block.name,
                json: block.input && Object.keys(block.input).length ? JSON.stringify(block.input) : ''
            });
            return {
                toolCalls: [{
                    id: block.id,
                    index: json.index,
                    name: block.name,
                    arguments: block.input || {}
                }]
            };
        }
    }

    if (json.type === 'content_block_delta') {
        const delta = json.delta || {};
        if (delta.type === 'text_delta') return { delta: delta.text || '' };
        if (delta.type === 'input_json_delta') {
            const tool = state.tools.get(json.index) || { id: undefined, name: undefined, json: '' };
            tool.json += delta.partial_json || '';
            state.tools.set(json.index, tool);
            return {
                toolCalls: [{
                    id: tool.id,
                    index: json.index,
                    name: tool.name,
                    arguments: parseArguments(tool.json)
                }]
            };
        }
    }

    if (json.type === 'content_block_stop' && state.tools.has(json.index)) {
        const tool = state.tools.get(json.index);
        state.tools.delete(json.index);
        return {
            toolCalls: [{
                id: tool.id,
                index: json.index,
                name: tool.name,
                arguments: parseArguments(tool.json)
            }]
        };
    }

    if (json.type === 'message_delta') {
        const result = {};
        if (json.delta && json.delta.stop_reason != null) result.finishReason = json.delta.stop_reason;
        if (json.usage) result.usage = normalizeUsage(json.usage);
        return Object.keys(result).length ? result : null;
    }
    if (json.type === 'message_stop') state.tools.clear();
    return null;
}

export function parseComplete(json) {
    if (!json || typeof json !== 'object') return {};
    const result = {};
    const blocks = Array.isArray(json.content) ? json.content : [];
    const text = blocks
        .filter(function (block) { return block.type === 'text'; })
        .map(function (block) { return block.text || ''; })
        .join('');
    const tools = blocks
        .filter(function (block) { return block.type === 'tool_use'; })
        .map(function (block, index) {
            return { id: block.id, index, name: block.name, arguments: block.input || {} };
        });
    if (text) result.content = text;
    if (tools.length) result.toolCalls = tools;
    if (json.stop_reason != null) result.finishReason = json.stop_reason;
    if (json.usage) result.usage = normalizeUsage(json.usage);
    return result;
}

export function createStreamState() {
    return { tools: new Map() };
}

function normalizeUsage(usage) {
    const inputTokens = usage.input_tokens;
    const outputTokens = usage.output_tokens;
    return {
        inputTokens,
        outputTokens,
        totalTokens: (inputTokens || 0) + (outputTokens || 0)
    };
}

function parseArguments(value) {
    if (!value) return {};
    try {
        return JSON.parse(value);
    } catch (_) {
        return value;
    }
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
