import { describe, expect, it } from 'vitest';
import {
    addDays,
    diffDays,
    formatDate,
    formatDateTime,
    formatDateTimeLocal,
    isEmptyDate,
    parseDate
} from '../../../src/features/projetos/domain/datas.js';

describe('projetos/domain/datas', () => {
    it('parses legacy YYYY-MM-DD HH:mm:ss', () => {
        const d = parseDate('2026-07-29 14:30:00');
        expect(d).toBeInstanceOf(Date);
        expect(d.getFullYear()).toBe(2026);
        expect(d.getMonth()).toBe(6);
        expect(d.getDate()).toBe(29);
        expect(d.getHours()).toBe(14);
    });

    it('parses datetime-local and BR formats', () => {
        expect(formatDate(parseDate('2026-07-29T09:15'))).toBe('2026-07-29');
        expect(formatDate(parseDate('29/07/2026 09:15:00'))).toBe('2026-07-29');
    });

    it('treats empty sentinel as empty', () => {
        expect(isEmptyDate('0000-00-00 00:00:00')).toBe(true);
        expect(isEmptyDate('0000-00-00')).toBe(true);
        expect(isEmptyDate(null)).toBe(true);
        expect(isEmptyDate('2026-01-01 00:00:00')).toBe(false);
    });

    it('formats round-trip', () => {
        const d = parseDate('2026-07-29 14:30:00');
        expect(formatDateTime(d)).toBe('2026-07-29 14:30:00');
        expect(formatDateTimeLocal(d)).toBe('2026-07-29T14:30');
    });

    it('diffDays and addDays', () => {
        const a = parseDate('2026-07-01 00:00:00');
        const b = addDays(a, 5);
        expect(diffDays(a, b)).toBe(5);
    });
});
