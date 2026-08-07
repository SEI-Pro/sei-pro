/**
 * ADR-0006: catch blocks must log, report, throw, return, or carry an intentional comment.
 * Legacy verbatim scripts are out of scope. Debt is ratcheted by count (ADR-0008).
 */
import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const baseline = JSON.parse(
    fs.readFileSync(path.join(root, 'tests/structure/silent-catches.baseline.json'), 'utf8')
);

/** Paths copied verbatim by build.mjs — not in the modern error-handling contract yet. */
const LEGACY_VERBATIM = new Set([
    'src/features/todas-paginas/sei-pro-all.js',
    'src/features/prescricoes/sei-pro-prescricoes.js',
    'src/features/visualizacao/sei-pro-visualizacao.js',
    'src/features/visualizacao/sei-pro-visualizacao-chosen.js',
    'src/shared/legacy/sei-pro-icons.js',
    'src/shared/legacy/sei-pro-db-transition.js',
    'src/bootstrap/init.js',
    'src/bootstrap/init_all.js',
    'src/bootstrap/init_arvore.js',
    'src/bootstrap/init_db.js',
    'src/bootstrap/init_visualizacao.js',
    'src/bootstrap/init_visualizacao_html.js',
    'src/bootstrap/init-flags.js',
    'src/bootstrap/getscript-isolated.js',
    'src/bootstrap/editor-loader.js',
    'src/platform/inline-stubs-main.js',
    'src/shared/qr-code-main.js',
    'src/background/storage-handler.js',
    'src/background/fetch-handler.js',
    'src/background/bug-report-handler.js',
    'src/background/process-notification-handler.js',
    'src/background/install-handler.js',
    'src/background/router.js',
    'src/background/background.js'
]);

const INTENTIONAL_RE =
    /intentional|intentionally|ignore|ignored|swallow|expected|noop|no-op|ADR-|TODO\(/i;
const HANDLED_RE = /\b(console|logger|log|report|throw|return)\b/;

function walk(dir, out = []) {
    if (!fs.existsSync(dir)) return out;
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, ent.name);
        if (ent.isDirectory()) walk(full, out);
        else if (/\.(js|ts)$/.test(ent.name)) out.push(full);
    }
    return out;
}

function toRel(abs) {
    return path.relative(root, abs).split(path.sep).join('/');
}

function extractCatchBodies(src) {
    const bodies = [];
    const re = /\bcatch\s*(?:\([^)]*\))?\s*\{/g;
    let m;
    while ((m = re.exec(src))) {
        let i = m.index + m[0].length;
        let depth = 1;
        while (i < src.length && depth > 0) {
            const ch = src[i++];
            if (ch === '{') depth += 1;
            else if (ch === '}') depth -= 1;
        }
        bodies.push(src.slice(m.index + m[0].length, i - 1));
    }
    return bodies;
}

export function countSilentCatches() {
    let count = 0;
    for (const file of walk(path.join(root, 'src'))) {
        const rel = toRel(file);
        if (LEGACY_VERBATIM.has(rel)) continue;
        if (rel.startsWith('src/shared/legacy/')) continue;
        const text = fs.readFileSync(file, 'utf8');
        for (const body of extractCatchBodies(text)) {
            if (!body.trim()) {
                count += 1;
                continue;
            }
            if (INTENTIONAL_RE.test(body)) continue;
            if (HANDLED_RE.test(body)) continue;
            count += 1;
        }
    }
    return count;
}

describe('no silent catch (ADR-0006)', () => {
    it('silent catch count equals baseline', () => {
        const actual = countSilentCatches();
        const expected = baseline.silentCatches;
        if (actual > expected) {
            throw new Error(
                `Silent catches increased: actual=${actual} baseline=${expected}. ` +
                    'Add logging/report/throw/return or an intentional comment.'
            );
        }
        if (actual < expected) {
            throw new Error(
                `Silent catches decreased: actual=${actual} baseline=${expected}. ` +
                    'Update tests/structure/silent-catches.baseline.json in the same commit.'
            );
        }
        expect(actual).toBe(expected);
    });
});
