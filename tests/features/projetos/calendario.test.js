import { describe, expect, it } from 'vitest';
import {
    addBusinessDays,
    countBusinessDays,
    holidaysBr,
    isBusinessDay,
    isWeekend
} from '../../../src/features/projetos/domain/calendario.js';

describe('projetos/domain/calendario', () => {
    it('detects weekends', () => {
        expect(isWeekend(new Date(2026, 6, 25))).toBe(true); // Saturday
        expect(isWeekend(new Date(2026, 6, 27))).toBe(false); // Monday
    });

    it('includes fixed BR holidays', () => {
        const list = holidaysBr(2026);
        const isos = list.map((h) => h.iso);
        expect(isos).toContain('2026-01-01');
        expect(isos).toContain('2026-12-25');
        expect(isos).toContain('2026-09-07');
    });

    it('skips weekends when adding business days', () => {
        // Friday 2026-07-24 + 1 business day → Monday 2026-07-27
        const start = new Date(2026, 6, 24);
        const next = addBusinessDays(start, 1, []);
        expect(next.getDay()).toBe(1);
        expect(next.getDate()).toBe(27);
    });

    it('counts business days excluding holidays', () => {
        const holidays = holidaysBr(2026);
        // 2026-09-07 is Independencia (Monday)
        const start = new Date(2026, 8, 7);
        const end = new Date(2026, 8, 8);
        expect(isBusinessDay(start, holidays)).toBe(false);
        expect(countBusinessDays(start, end, holidays)).toBe(1); // only Tue 8th
    });
});
