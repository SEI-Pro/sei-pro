import { describe, expect, it } from 'vitest';
import { formatRepeatedCitation } from '../../../src/features/legis/domain.js';

describe('legislation citation formatting', () => {
    it('shortens a repeated full citation to its title and year', () => {
        expect(formatRepeatedCitation('Lei nº 8.112, de 11 de dezembro de 1990'))
            .toBe('Lei nº 8.112, de 1990');
    });

    it('supports citations whose date contains only a year', () => {
        expect(formatRepeatedCitation('Lei nº 14.133, de 2021'))
            .toBe('Lei nº 14.133, de 2021');
    });

    it('preserves text without a recognizable citation year', () => {
        expect(formatRepeatedCitation('Constituição Federal'))
            .toBe('Constituição Federal');
        expect(formatRepeatedCitation('Lei sem data, publicação pendente'))
            .toBe('Lei sem data, publicação pendente');
    });
});
