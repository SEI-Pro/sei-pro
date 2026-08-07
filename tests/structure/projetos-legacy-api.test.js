import { describe, expect, it } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { ALL_FILE_PAIRS } from '../../scripts/asset-manifest.mjs';

const root = path.resolve(import.meta.dirname, '../..');

function read(rel) {
    return readFileSync(path.join(root, rel), 'utf8');
}

describe('structure/projetos-legacy-api', () => {
    it('index installs legacy api and boots', () => {
        const index = read('src/features/projetos/index.ts');
        expect(index).toMatch(/installProjetosLegacyApi/);
        expect(index).toMatch(/bootProjetos/);
        expect(index).toMatch(/installProjetosStore/);
    });

    it('only legacy-api.js uses aliasGlobal in the feature', () => {
        const files = [
            'src/features/projetos/index.ts',
            'src/features/projetos/boot.ts',
            'src/features/projetos/store.ts',
            'src/features/projetos/io.ts',
            'src/features/projetos/gantt-adapter.ts',
            'src/features/projetos/commands.ts',
            'src/features/projetos/templates.ts',
            'src/features/projetos/view/panel.ts',
            'src/features/projetos/view/helpers.ts',
            'src/features/projetos/view/projeto-form.ts',
            'src/features/projetos/view/etapa-form.ts',
            'src/features/projetos/view/popup.ts',
            'src/features/projetos/view/share.ts',
            'src/features/projetos/view/report.ts',
            'src/features/projetos/view/portfolio.ts'
        ];
        for (const f of files) {
            const src = read(f);
            expect(src.includes('aliasGlobal'), f + ' must not call aliasGlobal').toBe(false);
        }
        const legacy = read('src/features/projetos/legacy-api.ts');
        expect(legacy).toMatch(/aliasGlobal/);
        expect(legacy).toMatch(/loadProjetosPro/);
    });

    it('monolith sei-pro-projetos.js is gone from src', () => {
        expect(existsSync(path.join(root, 'src/features/projetos/sei-pro-projetos.js'))).toBe(false);
    });

    it('build bundles projetos and does not copy legacy monolith', () => {
        const build = read('scripts/build.mjs');
        expect(build).toMatch(/src\/features\/projetos\/index\.(js|ts)/);
        expect(build).toMatch(/dist\/js\/sei-pro-projetos\.js/);
        expect(build).not.toMatch(/'src\/features\/projetos\/sei-pro-projetos\.js'/);
        expect(build).toMatch(/projetos\.css/);
    });

    it('frappe-gantt ships from vendor/ via the asset manifest', () => {
        // O mapeamento de assets vive em scripts/asset-manifest.mjs (ADR-0011),
        // não no texto de build.mjs.
        const gantt = ALL_FILE_PAIRS.filter(({ src }) => src.startsWith('vendor/frappe-gantt/'));
        expect(gantt.map(({ out }) => out)).toEqual(
            expect.arrayContaining(['dist/js/lib/frappe-gantt.js', 'dist/css/frappe-gantt.css'])
        );
    });

    it('manifest loads sei-pro-projetos.js and projetos.css', () => {
        const manifest = read('manifest.base.json');
        expect(manifest).toMatch(/js\/sei-pro-projetos\.js/);
        expect(manifest).toMatch(/css\/projetos\.css/);
        expect(manifest).toMatch(/js\/lib\/frappe-gantt\.js/);
        expect(manifest).not.toMatch(/frappe-gantt\.esm\.js/);
    });
});
