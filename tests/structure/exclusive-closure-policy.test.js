/**
 * Exclusive-closure policy probes (002-ts-zero-legacy).
 */
import { describe, expect, it } from 'vitest';
import { assertExclusiveClosure } from '../../scripts/policy/assert-exclusive-closure.mjs';
import { buildFeatureMaturityIndex } from '../../scripts/policy/feature-maturity-index.mjs';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

function makeClosureFixture() {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'sei-policy-closure-'));
    const alpha = path.join(root, 'src/features/alpha');
    const beta = path.join(root, 'src/features/beta');
    fs.mkdirSync(alpha, { recursive: true });
    fs.mkdirSync(beta, { recursive: true });
    fs.writeFileSync(
        path.join(alpha, 'feature.ts'),
        "import { beta } from '../beta/api.ts'; export default { id: 'alpha', maturity: 'exclusive', contexts: ['lista'], install() {}, api: { beta } };\n"
    );
    fs.writeFileSync(
        path.join(beta, 'feature.ts'),
        "export default { id: 'beta', maturity: 'wired', contexts: ['lista'], install() {}, api: {} };\n"
    );
    fs.writeFileSync(path.join(beta, 'api.ts'), 'export const beta = true;\n');
    return root;
}

describe('exclusive-closure policy', () => {
    it('P0: docs-only skips exclusive rules', () => {
        const r = assertExclusiveClosure({ paths: ['docs/architecture.md', 'README.md'] });
        expect(r.scope).toBe('docs-only');
        expect(r.ok).toBe(true);
        expect(r.skipped).toContain('P3');
    });

    it('FR-017: tooling-only does not require exclusive maturity', () => {
        const r = assertExclusiveClosure({
            paths: ['scripts/policy-check.mjs']
        });
        expect(r.scope).toBe('tooling-only');
        expect(r.ok).toBe(true);
        expect(r.skipped).toContain('P3');
    });

    it('P3: touching a wired feature fails until exclusive', () => {
        const index = buildFeatureMaturityIndex();
        const wired = [...index.values()].find((f) => f.maturity === 'wired');
        expect(wired, 'need a wired feature for probe').toBeTruthy();
        const r = assertExclusiveClosure({
            paths: [`${wired.rootDir}/feature.ts`]
        });
        expect(r.scope).toBe('product-runtime');
        expect(r.ok).toBe(false);
        expect(r.failures.some((f) => f.code === 'P3' && f.message.includes(wired.id))).toBe(true);
    });

    it('allowlisted exclusive feature touch can pass P3 when exclusive and clean', () => {
        const index = buildFeatureMaturityIndex();
        const ex = [...index.values()].find((f) => f.maturity === 'exclusive' && f.id === 'quick-highlight');
        expect(ex).toBeTruthy();
        const r = assertExclusiveClosure({
            paths: [`${ex.rootDir}/feature.ts`]
        });
        expect(r.scope).toBe('product-runtime');
        expect(r.ok).toBe(true);
        expect(r.failures.some((f) => f.code === 'P3')).toBe(false);
    });

    it('P1: touching a historical product JS file fails even when allowlisted by the whole-tree ratchet', () => {
        const r = assertExclusiveClosure({ paths: ['src/shared/legacy/sei-pro-icons.js'] });
        expect(r.ok).toBe(false);
        expect(r.failures.some((f) => f.code === 'P1')).toBe(true);
    });

    it('P4: an exclusive module importing a wired feature fails', () => {
        const root = makeClosureFixture();
        try {
            const r = assertExclusiveClosure({
                root,
                skipRegistry: true,
                paths: ['src/features/alpha/feature.ts']
            });
            expect(r.ok).toBe(false);
            expect(r.failures.some((f) => f.code === 'P3')).toBe(true);
            expect(r.failures.some((f) => f.code === 'P4')).toBe(true);
        } finally {
            fs.rmSync(root, { recursive: true, force: true });
        }
    });

    it('T1/T2: tooling debt and wired-feature imports fail without forcing P3', () => {
        const root = makeClosureFixture();
        try {
            fs.mkdirSync(path.join(root, 'scripts'), { recursive: true });
            fs.writeFileSync(
                path.join(root, 'scripts/bad.mjs'),
                "// @ts-nocheck\nimport { beta } from '../src/features/beta/api.ts'; export { beta };\n"
            );
            const r = assertExclusiveClosure({
                root,
                skipRegistry: true,
                paths: ['scripts/bad.mjs']
            });
            expect(r.scope).toBe('tooling-only');
            expect(r.failures.some((f) => f.code === 'T1')).toBe(true);
            expect(r.failures.some((f) => f.code === 'T2')).toBe(true);
            expect(r.failures.some((f) => f.code === 'P3')).toBe(false);
        } finally {
            fs.rmSync(root, { recursive: true, force: true });
        }
    });

    it('P6: a stale generated registry fails the closure gate', () => {
        const root = fs.mkdtempSync(path.join(os.tmpdir(), 'sei-policy-registry-'));
        try {
            const featureDir = path.join(root, 'src/features/fixture');
            const generatedDir = path.join(root, 'src/generated');
            fs.mkdirSync(featureDir, { recursive: true });
            fs.mkdirSync(generatedDir, { recursive: true });
            fs.writeFileSync(
                path.join(featureDir, 'feature.ts'),
                "export default { id: 'fixture', maturity: 'exclusive', contexts: ['lista'], install() {}, api: {} };\n"
            );
            fs.writeFileSync(path.join(generatedDir, 'lista-feature-registry.ts'), '// stale\n');
            const r = assertExclusiveClosure({
                root,
                paths: ['src/features/fixture/feature.ts']
            });
            expect(r.failures.some((f) => f.code === 'P6')).toBe(true);
        } finally {
            fs.rmSync(root, { recursive: true, force: true });
        }
    });
});
