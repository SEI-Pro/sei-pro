import { describe, expect, it } from 'vitest';
import { JSDOM } from 'jsdom';
import { htmlToMarkdown } from '../../../src/core/markdown/html-to-markdown.ts';

describe('SEI HTML to Markdown', () => {
    it('preserves headings, paragraphs, emphasis, links, and lists', () => {
        const markdown = htmlToMarkdown(`
            <h2>Decision</h2>
            <p>A <strong>relevant</strong> <a href="https://example.test">reference</a>.</p>
            <ul><li>First</li><li><em>Second</em></li></ul>
        `);

        expect(markdown).toContain('## Decision');
        expect(markdown).toContain('A **relevant** [reference](https://example.test).');
        expect(markdown).toContain('- First\n- *Second*');
    });

    it('drops table columns that are empty in every row', () => {
        const markdown = htmlToMarkdown(`
            <table>
                <tr><th>Document</th><th>&nbsp;</th><th>Date</th></tr>
                <tr><td>Dispatch</td><td></td><td>2026-07-29</td></tr>
            </table>
        `);

        expect(markdown).toBe([
            '| Document | Date |',
            '| --- | --- |',
            '| Dispatch | 2026-07-29 |'
        ].join('\n'));
    });

    it('retains numbering represented by common SEI paragraph classes', () => {
        const markdown = htmlToMarkdown(`
            <p class="Paragrafo_Numerado_Nivel1">Scope</p>
            <p class="Paragrafo_Numerado_Nivel2">Details</p>
            <p class="Item_Inciso_Romano">Requirement</p>
            <p class="Item_Alinea_Letra">Condition</p>
        `);

        expect(markdown).toContain('1. Scope');
        expect(markdown).toContain('1.1. Details');
        expect(markdown).toContain('I - Requirement');
        expect(markdown).toContain('a) Condition');
    });

    it('accepts an injected HTML parser', () => {
        const markdown = htmlToMarkdown('<p>Hello</p>', {
            parseHtml(html) {
                return new JSDOM(html).window.document;
            }
        });
        expect(markdown).toBe('Hello');
    });
});
