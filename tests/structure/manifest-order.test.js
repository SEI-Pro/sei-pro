import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '../..');

function readManifest() {
    return JSON.parse(readFileSync(join(rootDir, 'dist/manifest.json'), 'utf8'));
}

const JQUERY_RE = /jquery-[\d.]+(?:\.min)?\.js/;
const BUNDLE = 'js/core-stack.bundle.js';

function entriesWithCore() {
    const manifest = readManifest();
    return (manifest.content_scripts || []).filter(
        (cs) => Array.isArray(cs.js) && cs.js.includes(BUNDLE)
    );
}

// Phase 5: the core/sei layer is shipped as a single bundled IIFE built from
// src/ (js/core-stack.bundle.js), replacing the per-file core/sei scripts.
describe('manifest content_scripts load order (bundled core)', () => {
    it('loads the core-stack bundle first where the core is present', () => {
        entriesWithCore().forEach((cs, i) => {
            expect(cs.js.indexOf(BUNDLE), `entry ${i}`).toBe(0);
        });
    });

    it('loads the core-stack bundle before sei-functions-pro and init scripts', () => {
        entriesWithCore().forEach((cs, i) => {
            const bundle = cs.js.indexOf(BUNDLE);
            const seiFns = cs.js.indexOf('js/sei-functions-pro.js');
            const initAll = cs.js.indexOf('js/init_all.js');
            if (seiFns !== -1) {
                expect(bundle, `entry ${i}: bundle before sei-functions-pro`).toBeLessThan(seiFns);
            }
            if (initAll !== -1) {
                expect(bundle, `entry ${i}: bundle before init_all`).toBeLessThan(initAll);
            }
        });
    });

    it('loads jQuery before sei-functions-pro and init scripts that need it', () => {
        entriesWithCore().forEach((cs, i) => {
            const jq = cs.js.findIndex((f) => JQUERY_RE.test(f));
            if (jq === -1) return;
            const seiFns = cs.js.indexOf('js/sei-functions-pro.js');
            const initAll = cs.js.indexOf('js/init_all.js');
            if (seiFns !== -1) {
                expect(jq, `entry ${i}: jQuery before sei-functions-pro`).toBeLessThan(seiFns);
            }
            if (initAll !== -1) {
                expect(jq, `entry ${i}: jQuery before init_all`).toBeLessThan(initAll);
            }
        });
    });

    it('no longer references per-file core/sei scripts (superseded by the bundle)', () => {
        const manifest = readManifest();
        for (const cs of manifest.content_scripts || []) {
            for (const f of cs.js || []) {
                expect(f, 'no per-file core/sei script').not.toMatch(/^js\/(core|sei)\//);
            }
        }
    });
});

// Fase 6 — the tree-info capability is now composed by the tree entry.
const FEATURE_BUNDLE = 'js/sei-pro-arvore.js';

describe('feature bundle: arvore (Informações adicionais na árvore)', () => {
    it('is referenced by the tree composition entry', () => {
        const manifest = readManifest();
        const blocks = (manifest.content_scripts || []).filter(
            (cs) => Array.isArray(cs.js) && cs.js.includes(FEATURE_BUNDLE)
        );
        expect(blocks.length, 'tree composition bundle present').toBeGreaterThan(0);
        for (const cs of manifest.content_scripts || []) {
            for (const f of cs.js || []) {
                expect(f, 'legacy tree-info bundle removed').not.toBe('js/arvore-info.bundle.js');
            }
        }
    });

    it('loads the core stack and legacy dependency before the composed tree bundle', () => {
        const manifest = readManifest();
        const cs = manifest.content_scripts || [];
        const featIdx = cs.findIndex((b) => Array.isArray(b.js) && b.js.includes(FEATURE_BUNDLE));
        expect(featIdx, 'feature block found').toBeGreaterThanOrEqual(0);
        const scripts = cs[featIdx].js || [];
        expect(scripts[0]).toBe(BUNDLE);
        expect(scripts.indexOf('js/sei-functions-pro.js')).toBeLessThan(scripts.indexOf(FEATURE_BUNDLE));
    });
});

// Guard against double injection of sei-functions-pro.js on editor pages
// (SyntaxError: Identifier 'loadFunctionsPro' has already been declared).
const EDITOR_ACTIONS = [
    'editor_montar',
    'texto_padrao_interno_alterar',
    'secao_modelo_alterar',
    'texto_padrao_interno_cadastrar'
];

describe('manifest: editor pages avoid duplicate sei-functions-pro', () => {
    it('has a dedicated editor content_scripts block with sei-functions-pro', () => {
        const manifest = readManifest();
        const editorBlocks = (manifest.content_scripts || []).filter(
            (cs) => Array.isArray(cs.matches) &&
                cs.matches.some((m) => m.includes('acao=editor_montar')) &&
                Array.isArray(cs.js) && cs.js.includes('js/sei-functions-pro.js')
        );
        expect(editorBlocks.length, 'dedicated editor block').toBe(1);
    });

    it('excludes editor actions from the broad init_all content_scripts block', () => {
        const manifest = readManifest();
        const broad = (manifest.content_scripts || []).find(
            (cs) => Array.isArray(cs.js) && cs.js.includes('js/init_all.js')
        );
        expect(broad, 'broad init_all block exists').toBeTruthy();
        const excludes = broad.exclude_matches || [];
        for (const action of EDITOR_ACTIONS) {
            expect(
                excludes.some((m) => m.includes(`acao=${action}`)),
                `broad block excludes acao=${action}`
            ).toBe(true);
        }
    });
});
