import { describe, expect, it } from 'vitest';
import { formatEditorDate } from '../../../../src/features/editor/domain/dates.js';

describe('formatEditorDate', () => {
    it('formats a Date with the default long pt-BR style', () => {
        expect(formatEditorDate(new Date(2026, 6, 30))).toMatch(/30/);
        expect(formatEditorDate(new Date(2026, 6, 30))).toMatch(/2026/);
    });

    it('parses YYYY-MM-DD as a local calendar date (no UTC shift)', () => {
        const formatted = formatEditorDate('2026-07-30', 'medium');
        expect(formatted).toContain('30');
        expect(formatted).toContain('2026');
        expect(formatted).not.toMatch(/29/);
    });

    it('returns empty string for invalid values', () => {
        expect(formatEditorDate('not-a-date')).toBe('');
        expect(formatEditorDate(Number.NaN)).toBe('');
    });
});
