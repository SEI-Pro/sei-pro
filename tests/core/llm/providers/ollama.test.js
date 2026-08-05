import { describe, expect, it } from 'vitest';
import {
    buildRequest,
    parseComplete
} from '../../../../src/core/llm/providers/ollama.js';

describe('Ollama provider contract', () => {
    it('uses the local OpenAI-compatible endpoint without requiring a key', () => {
        const request = buildRequest({
            model: 'llama3.2',
            messages: [{ role: 'user', content: 'Olá' }],
            stream: true
        });
        expect(request.url).toBe('http://localhost:11434/v1/chat/completions');
        expect(request.headers.Authorization).toBeUndefined();
        expect(request.body).toMatchObject({ model: 'llama3.2', stream: true });
    });

    it('normalizes a complete OpenAI-compatible response', () => {
        expect(parseComplete({
            choices: [{ message: { content: 'Texto local' }, finish_reason: 'stop' }]
        })).toEqual({ content: 'Texto local', finishReason: 'stop' });
    });
});
