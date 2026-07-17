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

    it('mantém a entry sem CSS próprio e preserva a responsabilidade dos bundles de feature', () => {
        const entry = read('src/entries/lista.js');
        const view = read('src/entries/lista/view.js');
        const io = read('src/entries/lista/io.js');
        const bridge = read('src/entries/lista/legacy-api.js');

        for (const source of [entry, view, io, bridge]) {
            expect(source).not.toMatch(/import\s+['\"]\.\/.*\.css['\"]/);
            expect(source).not.toMatch(/class(?:Name)?\s*[:=]|class=|class\\s*\\+/);
        }
        expect(entry).not.toContain('seipro-');
        expect(view).not.toContain('seipro-');
        expect(read('src/features/monitorados/monitorados.css')).toContain('.seipro-');
        expect(read('manifest.base.json')).toContain('css/monitorados.css');
    });

    it('mantém o bundle da entry antes da fachada legada nos contextos de lista', () => {
        const manifest = JSON.parse(read('manifest.base.json'));
        const entries = manifest.content_scripts.filter((item) => item.js.includes('js/lista.bundle.js'));
        expect(entries.length).toBe(2);
        for (const item of entries) {
            const requiredOrder = [
                'js/core-stack.bundle.js',
                'js/sei-functions-pro.js',
                'js/lista-agrupamento.bundle.js',
                'js/lista.bundle.js',
                'js/sei-pro.js',
                'js/sei-pro-controle-prazo.js',
                'js/sei-pro-nao-lido.js',
                'js/monitorados.bundle.js',
                'js/init.js'
            ];
            const positions = requiredOrder.map((script) => item.js.indexOf(script));
            expect(positions.every((position) => position >= 0)).toBe(true);
            expect(positions).toEqual([...positions].sort((a, b) => a - b));
        }
        const build = read('scripts/build.mjs');
        expect(build).toContain("src/entries/' + f");
        expect(build).toContain("out: 'dist/js/' + f.replace(/\\.js$/, '.bundle.js')");
        expect(build).toContain("'src/features/lista-processos/sei-pro.js'");
    });
});
