import { describe, it, expect } from 'vitest';
import { normalizeQuickText, getQuickTokens, buildQuickRanges } from '@src/features/quick-highlight/core.ts';

describe('quick-highlight/core (puro)', () => {
    it('normalizeQuickText: minúsculo, sem acento, espaços colapsados', () => {
        expect(normalizeQuickText('  Inspeção   Técnica ')).toBe('inspecao tecnica');
        expect(normalizeQuickText(null)).toBe('');
    });

    it('getQuickTokens divide em tokens não-vazios', () => {
        expect(getQuickTokens('a  b c')).toEqual(['a', 'b', 'c']);
        expect(getQuickTokens('   ')).toEqual([]);
    });

    it('buildQuickRanges mescla ocorrências adjacentes (start <= prev.end)', () => {
        // "abcabc"/"abc" → [0,3] e [3,6] adjacentes → mesclam em [0,6]
        expect(buildQuickRanges('abcabc', ['abc'])).toEqual([{ start: 0, end: 6 }]);
        // com gap não mescla
        expect(buildQuickRanges('abc-abc', ['abc'])).toEqual([{ start: 0, end: 3 }, { start: 4, end: 7 }]);
    });

    it('buildQuickRanges mescla ranges adjacentes/sobrepostos de tokens diferentes', () => {
        // "processo": tokens "pro" [0,3] e "oce" [2,5] → mescla [0,5]
        const r = buildQuickRanges('processo', ['pro', 'oce']);
        expect(r[0]).toEqual({ start: 0, end: 5 });
    });

    it('buildQuickRanges ignora token ausente', () => {
        expect(buildQuickRanges('abc', ['xyz'])).toEqual([]);
    });
});
