// @vitest-environment jsdom

import { describe, expect, it } from 'vitest';
import { scanChecklist } from '../../../../src/features/editor/domain/checklist.ts';

const parseHtml = (html) => new DOMParser().parseFromString(html, 'text/html');

describe('pre-signature checklist', () => {
    it('reports unresolved tags, required placeholders, and pending reviews', () => {
        const result = scanChecklist(`
            <p>Referente ao #processo e ao #documento.</p>
            <p data-required="true">&nbsp;</p>
            <p>Responsável: [PREENCHER NOME]</p>
            <p><span class="reviewSeiPro" data-review="add">new wording</span></p>
        `, { parseHtml });

        expect(result.ok).toBe(false);
        expect(result.issues.filter(({ type }) => type === 'unresolved-tag')
            .map(({ context }) => context)).toEqual(['#processo', '#documento']);
        expect(result.issues.filter(({ type }) => type === 'required-field')).toHaveLength(2);
        expect(result.issues.find(({ type }) => type === 'pending-review')?.message)
            .toBe('1 marca(s) de revisão pendente(s)');
    });

    it('detects empty paragraphs following a short field label', () => {
        const result = scanChecklist(`
            <p>Decision:</p>
            <p><br></p>
        `, { parseHtml });

        expect(result.issues).toEqual(expect.arrayContaining([
            expect.objectContaining({
                type: 'required-field',
                message: 'Campo obrigatório aparentemente vazio',
                context: 'Decision:'
            })
        ]));
    });

    it('detects the default placeholders shipped by SEI document templates', () => {
        const result = scanChecklist(`
            <p>[Texto. Exemplo: Tendo em vista...]</p>
            <p>[Texto]</p>
            <p>NOME COMPLETO</p>
            <p>Cargo ou Função</p>
        `, { parseHtml });

        expect(result.issues.filter(({ type }) => type === 'required-field')).toHaveLength(4);
    });

    it('reports broken internal references and accepts valid targets', () => {
        const result = scanChecklist(`
            <p><a href="#valid">Valid</a> <a href="#missing">Missing</a></p>
            <p id="valid">Destination</p>
        `, { parseHtml });

        expect(result.issues.filter(({ type }) => type === 'broken-reference')).toEqual([
            expect.objectContaining({
                message: 'Referência interna quebrada: #missing',
                context: 'Missing'
            })
        ]);
    });

    it('returns a clean result for resolved document HTML', () => {
        const result = scanChecklist(`
            <p>Completed decision text.</p>
            <p><a href="#conclusion">Go to conclusion</a></p>
            <p><a name="conclusion"></a>Conclusion.</p>
        `, { parseHtml });

        expect(result).toEqual({ issues: [], counts: {}, ok: true });
    });
});
