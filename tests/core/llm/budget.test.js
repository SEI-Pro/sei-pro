import { describe, expect, it } from 'vitest';
import { estimateTokens, trimContext } from '../../../src/core/llm/budget.js';

describe('LLM context budget', () => {
    it('estimates tokens with the chars-per-four heuristic', () => {
        expect(estimateTokens('12345678')).toBe(2);
        expect(estimateTokens('12345')).toBe(2);
        expect(estimateTokens('')).toBe(0);
    });

    it('keeps preferred documents before newer documents', () => {
        const chunks = [
            { id: 'named', text: 'a'.repeat(16), date: '2024-01-01' },
            { id: 'newest', text: 'b'.repeat(16), date: '2026-01-01' },
            { id: 'middle', text: 'c'.repeat(16), date: '2025-01-01' }
        ];
        expect(trimContext(chunks, { maxTokens: 8, preferIds: ['named'] }).map(chunk => chunk.id))
            .toEqual(['named', 'newest']);
    });

    it('uses input recency when dates are absent', () => {
        const chunks = [
            { id: 'old', text: 'aaaa' },
            { id: 'new', text: 'bbbb' }
        ];
        expect(trimContext(chunks, { maxTokens: 1 }).map(chunk => chunk.id)).toEqual(['new']);
    });
});
