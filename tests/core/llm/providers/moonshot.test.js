import { describe, expect, it } from 'vitest';
import {
    buildRequest,
    parseChunk
} from '../../../../src/core/llm/providers/moonshot.ts';

describe('Moonshot provider contract', () => {
    it('uses the Moonshot endpoint and echoes reasoning content on later turns', () => {
        const request = buildRequest({
            apiKey: 'moonshot-secret',
            model: 'kimi-k3',
            reasoningEffort: 'high',
            messages: [{
                role: 'assistant',
                content: 'Resposta anterior',
                reasoningContent: 'raciocínio anterior'
            }]
        });
        expect(request.url).toBe('https://api.moonshot.ai/v1/chat/completions');
        expect(request.body.reasoning_effort).toBe('high');
        expect(request.body.messages[0]).toEqual({
            role: 'assistant',
            content: 'Resposta anterior',
            reasoning_content: 'raciocínio anterior'
        });
    });

    it('preserves reasoning content from streaming fixtures', () => {
        expect(parseChunk({
            data: JSON.stringify({
                choices: [{ delta: { reasoning_content: 'análise' }, finish_reason: null }]
            })
        })).toEqual({ reasoningContent: 'análise' });
    });
});
