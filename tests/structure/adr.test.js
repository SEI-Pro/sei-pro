/**
 * ADR-0001 / ADR-0008 — integridade do registro de decisões.
 *
 * Um ADR sem verificação declarada é intenção, não norma. Este teste é o que impede
 * o conjunto de ADRs de virar a mesma prosa sem dono que ele veio substituir.
 */
import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

const adrDir = path.join(process.cwd(), 'docs/adr');
const files = readdirSync(adrDir)
    .filter((f) => /^\d{4}-.+\.md$/.test(f))
    .sort();
const read = (f) => readFileSync(path.join(adrDir, f), 'utf8');
const index = readFileSync(path.join(adrDir, 'README.md'), 'utf8');

const STATUS = /^- \*\*Status:\*\* (Proposto|Aceito|Substituído por \d{4})/m;

describe('ADR: integridade do registro', () => {
    it('há ADRs para verificar', () => {
        expect(files.length).toBeGreaterThan(0);
    });

    it('a numeração é sequencial e sem duplicatas', () => {
        const numbers = files.map((f) => Number(f.slice(0, 4)));
        expect(numbers).toEqual(numbers.map((_, i) => i + 1));
    });

    it.each(files)('%s declara um Status válido', (file) => {
        expect(read(file), `${file}: Status ausente ou inválido`).toMatch(STATUS);
    });

    it.each(files)('%s tem seções obrigatórias', (file) => {
        const body = read(file);
        for (const section of ['## Contexto', '## Decisão', '## Consequências', '## Verificação']) {
            expect(body, `${file}: falta a seção "${section}"`).toContain(section);
        }
    });

    it.each(files)('%s declara verificação não vazia', (file) => {
        const body = read(file);
        const section = body.split('## Verificação')[1] || '';
        const content = section.split(/\n## /)[0].trim();
        expect(content.length, `${file}: seção Verificação vazia`).toBeGreaterThan(30);
        // Ou aponta um mecanismo executável, ou assume explicitamente que não há.
        expect(
            /tests?\/|CI|ratchet|npm |tsc|git /.test(content) || /Nenhuma\b/.test(content),
            `${file}: Verificação não cita mecanismo executável nem declara "Nenhuma — decisão de processo"`
        ).toBe(true);
    });

    it.each(files)('%s está no índice do README', (file) => {
        expect(index, `${file}: ausente do índice em docs/adr/README.md`).toContain(file);
    });

    it('todo ADR substituído aponta para um ADR existente', () => {
        for (const file of files) {
            const m = read(file).match(/Substituído por (\d{4})/);
            if (!m) continue;
            expect(
                files.some((f) => f.startsWith(m[1])),
                `${file}: aponta para ADR-${m[1]}, que não existe`
            ).toBe(true);
        }
    });
});
