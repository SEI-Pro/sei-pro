// @vitest-environment jsdom

import { describe, expect, it } from 'vitest';
import {
    filterProcessFields,
    processFieldPreview
} from '../../../../src/features/editor/domain/process-fields.ts';

describe('process field search', () => {
    const fields = [
        ['Interessado: Maria', 'Maria'],
        ['Data de Autuação: 30/07/2026', '30/07/2026'],
        ['Assunto: Apuração', 'Apuração']
    ];

    it('filters without depending on accents or case', () => {
        expect(filterProcessFields(fields, 'AUTUACAO')).toEqual([fields[1]]);
        expect(filterProcessFields(fields, 'assunto apuracao')).toEqual([fields[2]]);
    });

    it('creates a safe text preview from formatted content', () => {
        expect(processFieldPreview('<a>Processo <strong>123</strong></a>', {
            parseHtml: (html) => new DOMParser().parseFromString(html, 'text/html')
        })).toBe('Processo 123');
    });
});
