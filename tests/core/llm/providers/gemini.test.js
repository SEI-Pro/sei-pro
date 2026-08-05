import { describe, expect, it } from 'vitest';
import {
    buildRequest,
    parseChunk,
    parseComplete
} from '../../../../src/core/llm/providers/gemini.js';

const tool = {
    name: 'ler_documento',
    description: 'Lê um documento',
    parameters: { type: 'object', properties: { numero_sei: { type: 'string' } } }
};

describe('Gemini provider contract', () => {
    it('maps system, tools and streaming to the Gemini schema', () => {
        const request = buildRequest({
            apiKey: 'gemini-secret',
            model: 'gemini-test',
            system: 'Sistema',
            messages: [{ role: 'user', content: 'Olá' }],
            tools: [tool],
            stream: true,
            maxTokens: 400
        });
        expect(request.url).toContain('/v1beta/models/gemini-test:streamGenerateContent?');
        expect(request.url).toContain('key=gemini-secret');
        expect(request.url).toContain('alt=sse');
        expect(request.body.systemInstruction.parts[0].text).toBe('Sistema');
        expect(request.body.tools[0].functionDeclarations[0]).toEqual(tool);
        expect(request.body.generationConfig.maxOutputTokens).toBe(400);
    });

    it('normalizes text, tool calls and usage in complete and streamed fixtures', () => {
        const fixture = {
            candidates: [{
                content: { parts: [
                    { text: 'Resposta' },
                    { functionCall: { name: 'ler_documento', args: { numero_sei: '123' } } }
                ] },
                finishReason: 'STOP'
            }],
            usageMetadata: {
                promptTokenCount: 10,
                candidatesTokenCount: 3,
                totalTokenCount: 13
            }
        };
        expect(parseComplete(fixture)).toEqual({
            content: 'Resposta',
            toolCalls: [{ index: 0, name: 'ler_documento', arguments: { numero_sei: '123' } }],
            finishReason: 'STOP',
            usage: { inputTokens: 10, outputTokens: 3, totalTokens: 13 }
        });
        expect(parseChunk({ data: JSON.stringify(fixture) })).toEqual(
            expect.objectContaining({ delta: 'Resposta' })
        );
    });
});
