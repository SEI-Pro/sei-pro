import { describe, expect, it } from 'vitest';
import { createSseParser, parseSseBlock } from '../../../src/core/llm/sse.js';

describe('SSE parser', () => {
    it('parses event fields and joins repeated data lines', () => {
        expect(parseSseBlock('id: 7\nevent: update\ndata: first\ndata: second\nretry: 1000'))
            .toEqual({
                id: '7',
                event: 'update',
                data: 'first\nsecond',
                retry: 1000
            });
    });

    it('marks the terminal sentinel', () => {
        expect(parseSseBlock('data: [DONE]')).toEqual({ data: '[DONE]', done: true });
    });

    it('ignores comments and malformed empty blocks', () => {
        expect(parseSseBlock(': heartbeat')).toBeNull();
        expect(parseSseBlock('')).toBeNull();
    });

    it('splits multiple frames in one chunk', () => {
        const parser = createSseParser();
        expect(parser.push('data: one\n\ndata: two\n\n')).toEqual([
            { data: 'one' },
            { data: 'two' }
        ]);
    });

    it('accumulates frames split at arbitrary chunk boundaries', () => {
        const parser = createSseParser();
        expect(parser.push('data: {"content":"hel')).toEqual([]);
        expect(parser.push('lo"}\r')).toEqual([]);
        expect(parser.push('\n\r\n')).toEqual([{ data: '{"content":"hello"}' }]);
    });

    it('flushes a final frame without a trailing blank line', () => {
        const parser = createSseParser();
        parser.push('data: final');
        expect(parser.flush()).toEqual([{ data: 'final' }]);
        expect(parser.flush()).toEqual([]);
    });
});
