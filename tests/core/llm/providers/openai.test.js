import { describe, expect, it } from 'vitest';
import {
    buildRequest,
    parseChunk,
    parseComplete
} from '../../../../src/core/llm/providers/openai.ts';

const tool = {
    name: 'read_document',
    description: 'Read one document',
    parameters: {
        type: 'object',
        properties: { number: { type: 'string' } },
        required: ['number']
    }
};

describe('OpenAI provider', () => {
    it('builds an OpenAI chat completions request', () => {
        const request = buildRequest({
            apiKey: 'secret',
            model: 'gpt-test',
            system: 'System instruction',
            messages: [{ role: 'user', content: 'Hello' }],
            tools: [tool],
            temperature: 0.3,
            maxTokens: 200,
            stream: true
        });

        expect(request.url).toBe('https://api.openai.com/v1/chat/completions');
        expect(request.headers.Authorization).toBe('Bearer secret');
        expect(request.body).toMatchObject({
            model: 'gpt-test',
            stream: true,
            temperature: 0.3,
            max_tokens: 200
        });
        expect(request.body.messages[0]).toEqual({
            role: 'system',
            content: 'System instruction'
        });
        expect(request.body.tools[0]).toEqual({
            type: 'function',
            function: tool
        });
    });

    it('normalizes a complete response fixture', () => {
        const result = parseComplete({
            choices: [{
                message: {
                    content: 'Draft text',
                    tool_calls: [{
                        id: 'call-1',
                        function: {
                            name: 'read_document',
                            arguments: '{"number":"123"}'
                        }
                    }]
                },
                finish_reason: 'stop'
            }],
            usage: {
                prompt_tokens: 10,
                completion_tokens: 4,
                total_tokens: 14
            }
        });

        expect(result).toEqual({
            content: 'Draft text',
            toolCalls: [{
                id: 'call-1',
                name: 'read_document',
                arguments: { number: '123' }
            }],
            finishReason: 'stop',
            usage: { inputTokens: 10, outputTokens: 4, totalTokens: 14 }
        });
    });

    it('normalizes streaming deltas and the done sentinel', () => {
        expect(parseChunk({
            data: '{"choices":[{"delta":{"content":"Hello"},"finish_reason":null}]}'
        })).toEqual({ delta: 'Hello' });
        expect(parseChunk({ data: '[DONE]', done: true })).toBeNull();
    });
});
