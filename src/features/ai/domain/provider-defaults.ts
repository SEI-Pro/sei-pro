// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/** Pure provider UI defaults (no storage / chrome.*). */
const DEFAULTS = Object.freeze({
    openai: { baseUrl: 'https://api.openai.com', model: 'gpt-4.1-mini' },
    anthropic: { baseUrl: 'https://api.anthropic.com', model: 'claude-sonnet-4-20250514' },
    gemini: { baseUrl: 'https://generativelanguage.googleapis.com', model: 'gemini-2.5-flash' },
    moonshot: { baseUrl: 'https://api.moonshot.ai', model: 'kimi-k3' },
    ollama: { baseUrl: 'http://localhost:11434', model: 'llama3.2' },
    openai_compatible: { baseUrl: '', model: '' }
});

export function providerDefaults(providerId) {
    return { ...(DEFAULTS[providerId] || DEFAULTS.openai) };
}
