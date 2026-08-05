import { describe, expect, it } from 'vitest';
import {
    buildRequest,
    createStreamState,
    parseChunk
} from '../../../../src/core/llm/providers/anthropic.js';

describe('Anthropic provider', () => {
    it('includes all browser-direct authentication headers', () => {
        const request = buildRequest({
            apiKey: 'anthropic-secret',
            model: 'claude-test',
            messages: [{ role: 'user', content: 'Hello' }],
            system: 'System instruction'
        });

        expect(request.url).toBe('https://api.anthropic.com/v1/messages');
        expect(request.headers).toMatchObject({
            'x-api-key': 'anthropic-secret',
            'anthropic-version': '2023-06-01',
            'anthropic-dangerous-direct-browser-access': 'true'
        });
        expect(request.body.system).toBe('System instruction');
    });

    it('accumulates streamed tool input JSON', () => {
        const state = createStreamState();
        parseChunk({
            data: JSON.stringify({
                type: 'content_block_start',
                index: 1,
                content_block: { type: 'tool_use', id: 'tool-1', name: 'read_document', input: {} }
            })
        }, state);
        const first = parseChunk({
            data: JSON.stringify({
                type: 'content_block_delta',
                index: 1,
                delta: { type: 'input_json_delta', partial_json: '{"number":' }
            })
        }, state);
        const second = parseChunk({
            data: JSON.stringify({
                type: 'content_block_delta',
                index: 1,
                delta: { type: 'input_json_delta', partial_json: '"123"}' }
            })
        }, state);

        expect(first.toolCalls[0].arguments).toBe('{"number":');
        expect(second.toolCalls[0].arguments).toEqual({ number: '123' });
    });
});
