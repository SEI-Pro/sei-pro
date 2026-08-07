/**
 * chrome.* / browser.* belong in platform, background, bootstrap, options.
 * Other call-sites are debt on ALLOWLIST until migrated (ADR-0002 / architecture.md).
 */
import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const ALLOWED_PREFIXES = [
    'src/platform/',
    'src/background/',
    'src/bootstrap/',
    'src/options/',
    // The MV3 service-worker entry resolves the browser API before composing
    // the classic handlers; it is the context boundary, not feature code.
    'src/entries/background'
];

/**
 * TODO(ADR-0008): shrink — move these behind platform ports.
 * Measured 2026-08-07 (comments stripped).
 */
const ALLOWLIST = [
    'src/features/ai/io/profiles.ts',
    'src/features/arvore/modules.ts',
    'src/features/editor/page-runtime.ts',
    'src/features/editor/view/dialogs/import.ts',
    'src/features/lista-processos/modules.ts',
    'src/features/monitorados/options.ts',
    'src/features/projetos/view/helpers.ts',
    'src/features/sei-functions/boot.ts',
    'src/features/sei-functions/editor-captcha.ts',
    'src/features/sei-functions/modules.ts',
    'src/features/sei-functions/notifications-process.ts'
];

const API_RE = /\b(?:chrome|browser)\./;

function walk(dir, out = []) {
    if (!fs.existsSync(dir)) return out;
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, ent.name);
        if (ent.isDirectory()) walk(full, out);
        else if (/\.(js|ts)$/.test(ent.name)) out.push(full);
    }
    return out;
}

function stripComments(src) {
    return src
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/(^|[^:])\/\/.*$/gm, '$1');
}

function toRel(abs) {
    return path.relative(root, abs).split(path.sep).join('/');
}

function isAllowedPath(rel) {
    return ALLOWED_PREFIXES.some((p) => rel.startsWith(p));
}

describe('platform API boundary', () => {
    it('chrome.* / browser.* only in allowed layers or allowlist', () => {
        const violators = [];
        for (const file of walk(path.join(root, 'src'))) {
            const rel = toRel(file);
            if (isAllowedPath(rel)) continue;
            const text = stripComments(fs.readFileSync(file, 'utf8'));
            if (API_RE.test(text)) violators.push(rel);
        }
        violators.sort();

        const allow = new Set(ALLOWLIST);
        const unexpected = violators.filter((f) => !allow.has(f));
        const stale = ALLOWLIST.filter((f) => !violators.includes(f));

        expect(
            unexpected,
            `New chrome/browser usage outside platform boundary:\n${unexpected.join('\n')}`
        ).toEqual([]);
        expect(
            stale,
            `Stale ALLOWLIST entries — remove from platform-boundary.test.js:\n${stale.join('\n')}`
        ).toEqual([]);
    });
});
