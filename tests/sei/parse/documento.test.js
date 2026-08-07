import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { JSDOM } from 'jsdom';
import { parseDocumento } from '../../../src/sei/parse/documento.ts';

const fixture = readFileSync(
    join(process.cwd(), 'tests/fixtures/documento/documento_visualizar.html'),
    'utf8'
);

describe('sei.parse.documento', () => {
    it('parses document chrome from the synthetic fixture', () => {
        const { document } = new JSDOM(fixture).window;
        const parsed = parseDocumento(document);

        expect(parsed.infoPanelId).toBe('divArvoreInformacao');
        expect(parsed.downloadHref).toMatch(/acao=documento_download_anexo/);
        expect(parsed.visualizationIframeId).toBe('ifrConteudoVisualizacao');
        expect(parsed.idDocumento).toBe('00000002');
        expect(parsed.idProcedimento).toBe('00000000');
        expect(parsed.documentFormAction).toMatch(/acao=documento_receber/);
    });

    it('returns plain serializable data', () => {
        const { document } = new JSDOM(fixture).window;
        const parsed = parseDocumento(document);
        expect(() => JSON.stringify(parsed)).not.toThrow();
    });
});
