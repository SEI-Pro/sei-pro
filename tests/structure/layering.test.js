/**
 * ADR-0002 / architecture.md: dependency direction.
 * entries/features may import core/sei/platform/shared.
 * core, sei, and platform must not import features.
 *
 * Existing violators (if any) stay on ALLOWLIST with a TODO until removed.
 */
import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

/** @type {string[]} TODO(ADR-0008): shrink — files that currently import features from forbidden layers */
const ALLOWLIST = [
    // Measured 2026-08-07: no core/sei/platform → features imports.
];

const IMPORT_RE =
    /(?:import|export)\s+(?:type\s+)?(?:[^'";]*?\s+from\s+)?['"]([^'"]+)['"]|import\s*\(\s*['"]([^'"]+)['"]\s*\)/g;

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

function resolveSpec(fromFile, spec) {
    if (spec.startsWith('@src/')) {
        return `src/${spec.slice('@src/'.length)}`;
    }
    if (!spec.startsWith('.')) return null;
    return toRel(path.resolve(path.dirname(fromFile), spec));
}

function layerOf(rel) {
    if (!rel) return null;
    for (const name of ['features', 'entries', 'core', 'sei', 'platform', 'shared', 'app']) {
        if (rel === `src/${name}` || rel.startsWith(`src/${name}/`)) return name;
    }
    return 'other';
}

function findViolations() {
    const forbiddenLayers = new Set(['core', 'sei', 'platform']);
    const violations = [];
    for (const file of walk(path.join(root, 'src'))) {
        const fromRel = toRel(file);
        const fromLayer = layerOf(fromRel);
        if (!forbiddenLayers.has(fromLayer)) continue;
        const text = fs.readFileSync(file, 'utf8');
        for (const m of text.matchAll(IMPORT_RE)) {
            const spec = m[1] || m[2];
            if (!spec) continue;
            const target = resolveSpec(file, spec);
            if (layerOf(target) === 'features') {
                violations.push(fromRel);
                break;
            }
        }
    }
    return [...new Set(violations)].sort();
}

describe('architecture layering', () => {
    it('core / sei / platform do not import features (allowlisted debt only)', () => {
        const violations = findViolations();
        const allow = new Set(ALLOWLIST);
        const unexpected = violations.filter((f) => !allow.has(f));
        const stale = ALLOWLIST.filter((f) => !violations.includes(f));

        expect(
            unexpected,
            `New layering violations (remove import of features):\n${unexpected.join('\n')}`
        ).toEqual([]);
        expect(
            stale,
            `Stale ALLOWLIST entries — remove from layering.test.js:\n${stale.join('\n')}`
        ).toEqual([]);
    });
});
