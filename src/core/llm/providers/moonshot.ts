// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
import {
    buildRequest as buildOpenAiRequest,
    parseChunk,
    parseComplete
} from './openai.js';

const DEFAULT_BASE_URL = 'https://api.moonshot.ai';

/*
 * Kimi K3 can return reasoning_content. Preserve it in assistant messages and
 * echo it back on later turns. The OpenAI adapter exposes it as reasoningContent.
 */
export function buildRequest(options = {}) {
    const messages = (options.messages || []).map(function (message) {
        if (message.role !== 'assistant' || message.reasoningContent == null) return message;
        const { reasoningContent, ...normalized } = message;
        return { ...normalized, reasoning_content: reasoningContent };
    });
    return buildOpenAiRequest({
        ...options,
        messages,
        baseUrl: options.baseUrl || DEFAULT_BASE_URL,
        reasoning_effort: options.reasoning_effort ?? options.reasoningEffort
    });
}

export { parseChunk, parseComplete };
