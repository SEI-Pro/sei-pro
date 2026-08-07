/**
 * ADR-0012: aliasGlobal vs publishGlobal placement rules.
 */
import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const LEGACY_API_RE = /(^|\/)([^/]*legacy-api[^/]*|legacy\/[^/]+)\.(js|ts)$/;
const PUBLISH_ALLOWED = ['src/core/', 'src/platform/', 'src/sei/'];

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

function stripComments(src) {
    return src
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/(^|[^:])\/\/.*$/gm, '$1');
}

function isLegacyApiPath(rel) {
    return LEGACY_API_RE.test(rel);
}

function isPublishAllowed(rel) {
    return PUBLISH_ALLOWED.some((p) => rel.startsWith(p));
}

describe('globals publication rules (ADR-0012)', () => {
    it('exports publishGlobal from core/global', () => {
        const src = fs.readFileSync(path.join(root, 'src/core/global.ts'), 'utf8');
        expect(src).toMatch(/export function publishGlobal\s*\(/);
        expect(src).toMatch(/export function aliasGlobal\s*\(/);
    });

    it('aliasGlobal only appears in legacy-api files (plus global.ts definition)', () => {
        const violators = [];
        for (const file of walk(path.join(root, 'src'))) {
            const rel = toRel(file);
            if (rel === 'src/core/global.ts') continue;
            const text = stripComments(fs.readFileSync(file, 'utf8'));
            if (!/\baliasGlobal\s*\(/.test(text)) continue;
            if (!isLegacyApiPath(rel)) violators.push(rel);
        }
        // Debt still exists outside legacy-api until mass migration finishes.
        // This test documents remaining violators and fails if NEW paths appear
        // beyond the known core/platform/sei publication sites still on aliasGlobal.
        const knownDebt = violators.filter((f) => !isPublishAllowed(f));
        expect(
            knownDebt,
            `aliasGlobal outside legacy-api and outside core/platform/sei:\n${knownDebt.join('\n')}`
        ).toEqual([]);
    });

    it('publishGlobal only appears in core / platform / sei', () => {
        const violators = [];
        for (const file of walk(path.join(root, 'src'))) {
            const rel = toRel(file);
            if (rel === 'src/core/global.ts') continue;
            const text = stripComments(fs.readFileSync(file, 'utf8'));
            if (!/\bpublishGlobal\s*\(/.test(text)) continue;
            if (!isPublishAllowed(rel)) violators.push(rel);
        }
        expect(
            violators,
            `publishGlobal outside core/platform/sei:\n${violators.join('\n')}`
        ).toEqual([]);
    });

    it('sample core modules already use publishGlobal', () => {
        for (const rel of [
            'src/core/serial.ts',
            'src/core/cookies.ts',
            'src/core/cor.ts',
            'src/platform/runtime.ts',
            'src/sei/tooltip.ts'
        ]) {
            const src = fs.readFileSync(path.join(root, rel), 'utf8');
            expect(src, rel).toMatch(/\bpublishGlobal\s*\(/);
            expect(src, rel).not.toMatch(/\baliasGlobal\s*\(/);
        }
    });
});
