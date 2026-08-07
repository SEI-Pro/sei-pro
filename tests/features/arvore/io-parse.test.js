// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { parseUploadPageHtml } from '@src/features/arvore/io.ts';

describe('arvore/io — parseUploadPageHtml', () => {
    it('lê documento_receber no HTML do SEI', () => {
        const parsed = parseUploadPageHtml(
            '<html><body><table id="tblSeries"><tr><td><a href="controlador.php?acao=documento_receber">ext</a></td></tr></table></body></html>'
        );
        expect(parsed.documentoReceberHref).toContain('documento_receber');
    });
});
