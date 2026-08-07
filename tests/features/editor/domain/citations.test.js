// @vitest-environment jsdom

import { describe, expect, it } from 'vitest';
import { verifyCitations } from '../../../../src/features/editor/domain/citations.ts';

const parseHtml = (html) => new DOMParser().parseFromString(html, 'text/html');

describe('citation verification', () => {
    it('flags SEI references absent from the process', () => {
        const findings = verifyCitations(
            '<p>Conforme documento SEI nº 9999999.</p>',
            [{ numeroSEI: '1234567' }],
            { parseHtml }
        );
        expect(findings).toContainEqual(expect.objectContaining({
            type: 'unknown-sei-reference',
            value: '9999999'
        }));
    });

    it('flags legislation markers without a verifiable link', () => {
        const findings = verifyCitations(
            '<p><a class="legisSeiPro" data-norma="Lei8112">Lei nº 8.112</a></p>',
            [],
            { parseHtml }
        );
        expect(findings.some((item) => item.type === 'broken-legal-citation')).toBe(true);
    });
});
