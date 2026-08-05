export const PROVIDER_IDS = [
    'openai',
    'anthropic',
    'gemini',
    'moonshot',
    'ollama',
    'openai_compatible'
];

export const MESSAGE_ROLES = ['system', 'user', 'assistant', 'tool'];

export function normalizeMessage(role, content) {
    if (!MESSAGE_ROLES.includes(role)) {
        throw new Error(`Unsupported message role: ${role}`);
    }
    if (typeof content !== 'string' && !Array.isArray(content)) {
        throw new TypeError('Message content must be a string or an array');
    }
    return { role, content };
}

export function createChatRequest({
    providerId,
    model,
    messages = [],
    system,
    tools = [],
    temperature,
    maxTokens,
    stream = false
} = {}) {
    if (!PROVIDER_IDS.includes(providerId)) {
        throw new Error(`Unsupported provider: ${providerId}`);
    }
    if (typeof model !== 'string' || !model.trim()) {
        throw new TypeError('A model is required');
    }
    if (!Array.isArray(messages)) {
        throw new TypeError('Messages must be an array');
    }
    if (!Array.isArray(tools)) {
        throw new TypeError('Tools must be an array');
    }

    return {
        providerId,
        model: model.trim(),
        messages: messages.map(function (message) {
            if (!message || typeof message !== 'object') {
                throw new TypeError('Each message must be an object');
            }
            return normalizeMessage(message.role, message.content);
        }),
        system: system == null ? undefined : String(system),
        tools: tools.map(normalizeToolDefinition),
        temperature: temperature == null ? undefined : Number(temperature),
        maxTokens: maxTokens == null ? undefined : Number(maxTokens),
        stream: Boolean(stream)
    };
}

function normalizeToolDefinition(tool) {
    if (!tool || typeof tool !== 'object' || typeof tool.name !== 'string' || !tool.name.trim()) {
        throw new TypeError('Each tool must have a name');
    }
    if (!tool.parameters || typeof tool.parameters !== 'object' || Array.isArray(tool.parameters)) {
        throw new TypeError(`Tool "${tool.name}" must have JSON Schema parameters`);
    }
    return {
        name: tool.name.trim(),
        description: tool.description == null ? '' : String(tool.description),
        parameters: tool.parameters
    };
}
