import { describe, expect, it } from 'vitest';
import { renderSnippet, snippetToHtml } from '../../../../src/features/editor/domain/snippets.js';

describe('unit snippets', () => {
    it('replaces known placeholders and preserves unknown ones', () => {
        expect(renderSnippet(
            'Processo {{ processo }} — {{INTERESSADO}} — {{desconhecido}}',
            { processo: '123', interessado: 'Maria' }
        )).toBe('Processo 123 — Maria — {{desconhecido}}');
    });

    it('escapes user content before inserting paragraphs', () => {
        expect(snippetToHtml('<script>x</script>\\nLinha')).toBe(
            '<p>&lt;script&gt;x&lt;/script&gt;\\nLinha</p>'
        );
        expect(snippetToHtml('A\nB')).toBe('<p>A</p><p>B</p>');
    });
});
