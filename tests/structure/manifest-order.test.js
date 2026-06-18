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
