import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = join(fileURLToPath(new URL('../..', import.meta.url)));
const cssPath = join(rootDir, 'src/features/arvore-info/arvore-info.css');

describe('arvore-info CSS isolation', () => {
    it('owns a feature stylesheet with seipro- hooks', () => {
        expect(existsSync(cssPath)).toBe(true);
        const css = readFileSync(cssPath, 'utf8');
        expect(css).toMatch(/\.seipro-infoarvore-/);
        expect(css).toMatch(/\.panelDadosArvore/);
        expect(css).toMatch(/\.seipro-anot-/);
    });

    it('is registered in the dist pipeline', () => {
        const pipeline = readFileSync(join(rootDir, 'scripts/dist-pipeline.mjs'), 'utf8');
        expect(pipeline).toContain("src: 'src/features/arvore-info/arvore-info.css'");
        expect(pipeline).toContain("out: 'dist/css/arvore-info.css'");
    });

    it('is declared on the arvore content script css list', () => {
        const manifest = readFileSync(join(rootDir, 'manifest.base.json'), 'utf8');
        expect(manifest).toContain('css/arvore-info.css');
    });
});

describe('arvore-info zero @ts-nocheck', () => {
    it('has no @ts-nocheck under src/features/arvore-info', () => {
        const dir = join(rootDir, 'src/features/arvore-info');
        const offenders = [];
        function walk(d) {
            for (const name of readdirSync(d, { withFileTypes: true })) {
                const p = join(d, name.name);
                if (name.isDirectory()) walk(p);
                else if (/\.ts$/.test(name.name)) {
                    const text = readFileSync(p, 'utf8');
                    if (text.includes('@ts-nocheck')) offenders.push(p.replace(rootDir + '/', ''));
                }
            }
        }
        walk(dir);
        expect(offenders).toEqual([]);
    });
});
