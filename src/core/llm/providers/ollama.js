import {
    buildRequest as buildOpenAiRequest,
    parseChunk,
    parseComplete
} from './openai.js';

const DEFAULT_BASE_URL = 'http://localhost:11434';

export function buildRequest(options = {}) {
    return buildOpenAiRequest({
        ...options,
        baseUrl: options.baseUrl || DEFAULT_BASE_URL
    });
}

export { parseChunk, parseComplete };
