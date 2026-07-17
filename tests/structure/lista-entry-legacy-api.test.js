import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, expect, it } from 'vitest';

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '../..');
const read = (file) => readFileSync(join(rootDir, file), 'utf8');

describe('entry da lista — ponte legacy-api', () => {
    it('instala os wrappers legados na entry e remove as duplicatas do monólito', () => {
        const entry = read('src/entries/lista.js');
        const bridge = read('src/entries/lista/legacy-api.js');
        const legacy = read('src/features/lista-processos/sei-pro.js');

        expect(entry).toContain("import './lista/legacy-api.js';");
        expect(bridge).toContain("aliasGlobal('getListaEntryContextLegacy'");
        expect(bridge).toContain("aliasGlobal('runListaProcessosViewLegacy'");
        expect(legacy).not.toMatch(/function getListaEntryContextLegacy\s*\(/);
        expect(legacy).not.toMatch(/function runListaProcessosViewLegacy\s*\(/);
        expect(legacy).toContain('var listaEntryContext = getListaEntryContextLegacy();');
        expect(legacy).toContain('if (runListaProcessosViewLegacy())');
    });

    it('mantém o bundle da entry antes da fachada legada nos contextos de lista', () => {
        const manifest = JSON.parse(read('manifest.base.json'));
        const entries = manifest.content_scripts.filter((item) => item.js.includes('js/lista.bundle.js'));
        expect(entries.length).toBe(2);
        for (const item of entries) {
            expect(item.js.indexOf('js/lista.bundle.js')).toBeLessThan(item.js.indexOf('js/sei-pro.js'));
        }
        expect(read('scripts/build.mjs')).toContain("src/entries/' + f");
    });
});
