import { describe, expect, it } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '../..');

function read(rel) {
    return readFileSync(path.join(root, rel), 'utf8');
}

describe('structure/projetos-legacy-api', () => {
    it('index installs legacy api and boots', () => {
        const index = read('src/features/projetos/index.js');
        expect(index).toMatch(/installProjetosLegacyApi/);
        expect(index).toMatch(/bootProjetos/);
        expect(index).toMatch(/installProjetosStore/);
    });

    it('only legacy-api.js uses aliasGlobal in the feature', () => {
        const files = [
            'src/features/projetos/index.js',
            'src/features/projetos/boot.js',
            'src/features/projetos/store.js',
            'src/features/projetos/io.js',
            'src/features/projetos/gantt-adapter.js',
            'src/features/projetos/commands.js',
            'src/features/projetos/templates.js',
            'src/features/projetos/view/panel.js',
            'src/features/projetos/view/helpers.js',
            'src/features/projetos/view/projeto-form.js',
            'src/features/projetos/view/etapa-form.js',
            'src/features/projetos/view/popup.js',
            'src/features/projetos/view/share.js',
            'src/features/projetos/view/report.js',
            'src/features/projetos/view/portfolio.js'
        ];
        for (const f of files) {
            const src = read(f);
            expect(src.includes('aliasGlobal'), f + ' must not call aliasGlobal').toBe(false);
        }
        const legacy = read('src/features/projetos/legacy-api.js');
        expect(legacy).toMatch(/aliasGlobal/);
        expect(legacy).toMatch(/loadProjetosPro/);
    });

    it('monolith sei-pro-projetos.js is gone from src', () => {
        expect(existsSync(path.join(root, 'src/features/projetos/sei-pro-projetos.js'))).toBe(false);
    });

    it('build bundles projetos and does not copy legacy monolith', () => {
        const build = read('scripts/build.mjs');
        expect(build).toMatch(/src\/features\/projetos\/index\.js/);
        expect(build).toMatch(/dist\/js\/sei-pro-projetos\.js/);
        expect(build).not.toMatch(/'src\/features\/projetos\/sei-pro-projetos\.js'/);
        expect(build).toMatch(/projetos\.css/);
        expect(build).toMatch(/vendor\/frappe-gantt/);
    });

    it('manifest loads sei-pro-projetos.js and projetos.css', () => {
        const manifest = read('manifest.base.json');
        expect(manifest).toMatch(/js\/sei-pro-projetos\.js/);
        expect(manifest).toMatch(/css\/projetos\.css/);
        expect(manifest).toMatch(/frappe-gantt\.esm\.js/);
    });
});
