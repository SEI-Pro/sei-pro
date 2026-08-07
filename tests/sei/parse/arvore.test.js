import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { JSDOM } from 'jsdom';
import { parseArvore } from '../../../src/sei/parse/arvore.ts';

const fixture = readFileSync(
    join(process.cwd(), 'tests/fixtures/arvore/arvore_visualizar.html'),
    'utf8'
);

describe('sei.parse.arvore', () => {
    it('parses tree nodes from the synthetic fixture', () => {
        const { document } = new JSDOM(fixture).window;
        const parsed = parseArvore(document);

        expect(parsed.treePresent).toBe(true);
        expect(parsed.nodes.length).toBeGreaterThanOrEqual(2);
        expect(parsed.idProcedimento).toBe('00000000');

        const processNode = parsed.nodes.find((n) => n.isProcess);
        expect(processNode).toBeTruthy();
        expect(processNode.label).toBe('00000.000000/0000-00');

        const docNode = parsed.nodes.find((n) => n.idDocumento === '00000002');
        expect(docNode).toBeTruthy();
        expect(docNode.target).toBe('ifrConteudoVisualizacao');
    });

    it('returns plain serializable data', () => {
        const { document } = new JSDOM(fixture).window;
        const parsed = parseArvore(document);
        expect(() => JSON.stringify(parsed)).not.toThrow();
    });
});
