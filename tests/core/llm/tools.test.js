import { describe, expect, it } from 'vitest';
import {
    assertWithinCaps,
    formatToolsForProvider,
    validateToolCall
} from '../../../src/core/llm/tools.js';

const tool = {
    name: 'read_document',
    description: 'Read one document',
    parameters: {
        type: 'object',
        properties: {
            number: { type: 'string', minLength: 1 },
            pages: { type: 'integer', minimum: 1 }
        },
        required: ['number'],
        additionalProperties: false
    }
};

describe('LLM tools', () => {
    it('validates tool arguments against the supported JSON Schema subset', () => {
        expect(validateToolCall(tool, { number: '123', pages: 2 })).toBe(true);
        expect(validateToolCall(tool, '{"number":"123"}')).toBe(true);
        expect(validateToolCall(tool, { pages: 2 })).toBe(false);
        expect(validateToolCall(tool, { number: '123', unknown: true })).toBe(false);
    });

    it('formats tools for each provider protocol', () => {
        expect(formatToolsForProvider('openai', [tool])[0].type).toBe('function');
        expect(formatToolsForProvider('anthropic', [tool])[0].input_schema).toBe(tool.parameters);
        expect(formatToolsForProvider('gemini', [tool])[0].functionDeclarations[0].name)
            .toBe('read_document');
    });

    it('enforces iteration and document caps', () => {
        expect(assertWithinCaps({
            iterations: 8,
            maxIterations: 8,
            docsFetched: 15,
            maxDocs: 15
        })).toBe(true);
        expect(() => assertWithinCaps({ iterations: 9, maxIterations: 8 })).toThrow(/iteration/);
        expect(() => assertWithinCaps({ docsFetched: 16, maxDocs: 15 })).toThrow(/Document/);
    });
});
