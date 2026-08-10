/**
 * ADR-0014 — TypeScript boundary for product sources.
 * @see docs/adr/0014-typescript-para-codigo-novo.md
 */
import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

/**
 * Remaining product .js (verbatim / stubs). Shrink-only: removing a path from disk
 * without removing it here fails; adding a new .js outside this set fails.
 */
const JS_ALLOWLIST = new Set([
    'src/platform/inline-stubs-main.js',
    'src/features/editor/ckeditor-main.js',
    'src/features/prescricoes/sei-pro-prescricoes.js',
    'src/features/todas-paginas/sei-pro-all.js',
    'src/features/visualizacao/sei-pro-visualizacao-chosen.js',
    'src/features/visualizacao/sei-pro-visualizacao.js',
    'src/shared/legacy/sei-pro-db-transition.js',
    'src/shared/legacy/sei-pro-icons.js',
    'src/shared/qr-code-main.js',
    'src/entries/background.js'
]);

function walk(dir, out = []) {
    if (!fs.existsSync(dir)) return out;
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, ent.name);
        if (ent.isDirectory()) walk(full, out);
        else out.push(full);
    }
    return out;
}

function toRel(abs) {
    return path.relative(root, abs).split(path.sep).join('/');
}

function loadTsconfig() {
    const raw = fs.readFileSync(path.join(root, 'tsconfig.json'), 'utf8');
    // Do not strip /* */ globally — globs like src/**/*.ts contain /**
    const noLineComments = raw.replace(/^\s*\/\/.*$/gm, '');
    return JSON.parse(noLineComments);
}

describe('typescript boundary (ADR-0014)', () => {
    it('feature descriptors are feature.ts', () => {
        const featuresRoot = path.join(root, 'src/features');
        for (const dir of fs.readdirSync(featuresRoot, { withFileTypes: true })) {
            if (!dir.isDirectory()) continue;
            const ts = path.join(featuresRoot, dir.name, 'feature.ts');
            const js = path.join(featuresRoot, dir.name, 'feature.js');
            expect(fs.existsSync(ts), `${dir.name} missing feature.ts`).toBe(true);
            expect(fs.existsSync(js), `${dir.name} must not use feature.js`).toBe(false);
        }
    });

    it('modern layer product .js is shrink-only allowlisted (ADR-0014)', () => {
        const layers = ['features', 'core', 'sei', 'platform', 'shared', 'config', 'app', 'entries'];
        const found = [];
        for (const layer of layers) {
            for (const abs of walk(path.join(root, 'src', layer))) {
                const rel = toRel(abs);
                if (!rel.endsWith('.js')) continue;
                found.push(rel);
            }
        }
        found.sort();
        const unexpected = found.filter((f) => !JS_ALLOWLIST.has(f));
        expect(unexpected, `new product .js outside allowlist:\n${unexpected.join('\n')}`).toEqual([]);
        const stale = [...JS_ALLOWLIST].filter((p) => !fs.existsSync(path.join(root, p)));
        expect(stale, `stale JS_ALLOWLIST entries: ${stale.join(', ')}`).toEqual([]);
    });

    it('tsconfig is strict and includes src TypeScript', () => {
        const tsconfig = loadTsconfig();
        const include = tsconfig.include || [];
        expect(include.some((p) => String(p).includes('src/**/*.ts'))).toBe(true);
        expect(tsconfig.compilerOptions?.strict).toBe(true);
    });
});
