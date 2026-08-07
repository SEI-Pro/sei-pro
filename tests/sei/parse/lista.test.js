import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { JSDOM } from 'jsdom';
import { parseListaProcessos } from '../../../src/sei/parse/lista.ts';

const fixture = readFileSync(
    join(process.cwd(), 'tests/fixtures/lista/procedimento_controlar.html'),
    'utf8'
);

describe('sei.parse.lista', () => {
    it('parses process tables from the production skeleton fixture', () => {
        const { document } = new JSDOM(fixture).window;
        const parsed = parseListaProcessos(document);

        expect(parsed.hasProcessCommands).toBe(true);
        expect(parsed.formAction).toMatch(/acao=procedimento_controlar/);
        expect(parsed.tables.recebidos.length).toBeGreaterThan(0);
        expect(parsed.tables.gerados.length).toBeGreaterThan(0);

        const row = parsed.tables.recebidos[0];
        expect(row.rowId).toMatch(/^P/);
        expect(row.processHref).toMatch(/acao=procedimento_trabalhar/);
        expect(row.checkboxId).toBeTruthy();
        expect(typeof row.visualizado).toBe('boolean');
    });

    it('returns plain data (no DOM / jQuery in the payload)', () => {
        const { document } = new JSDOM(fixture).window;
        const parsed = parseListaProcessos(document);
        const json = JSON.parse(JSON.stringify(parsed));
        expect(json.tables.recebidos[0].rowId).toBe(parsed.tables.recebidos[0].rowId);
        expect(parsed.tables.recebidos[0].nodeType).toBeUndefined();
        expect(parsed.tables.recebidos[0].jquery).toBeUndefined();
    });
});
