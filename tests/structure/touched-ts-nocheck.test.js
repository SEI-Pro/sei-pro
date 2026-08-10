/**
 * Touched product files must lose @ts-nocheck / any / @ts-ignore (002-ts-zero-legacy).
 */
import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { assertExclusiveClosure } from '../../scripts/policy/assert-exclusive-closure.mjs';

function withFixture(source, callback) {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'sei-policy-ts-'));
    try {
        const featureDir = path.join(root, 'src/features/fixture');
        fs.mkdirSync(featureDir, { recursive: true });
        fs.writeFileSync(
            path.join(featureDir, 'feature.ts'),
            "export default { id: 'fixture', maturity: 'exclusive', contexts: ['lista'], install() {}, api: {} };\n"
        );
        fs.writeFileSync(path.join(featureDir, 'touched.ts'), source);
        return callback(root);
    } finally {
        fs.rmSync(root, { recursive: true, force: true });
    }
}

describe('touched ts-nocheck policy', () => {
    it('detects @ts-nocheck on a touched product path deterministically', () => {
        const result = withFixture('// @ts-nocheck\nexport const value = 1;\n', (root) =>
            assertExclusiveClosure({
                root,
                skipRegistry: true,
                paths: ['src/features/fixture/touched.ts']
            })
        );
        expect(result.ok).toBe(false);
        expect(result.failures.some((f) => f.code === 'P2')).toBe(true);
    });

    it('does not flag a prose mention of the directive', () => {
        const result = withFixture('// A policy example mentions @ts-nocheck here.\nexport const value = 1;\n', (root) =>
            assertExclusiveClosure({
                root,
                skipRegistry: true,
                paths: ['src/features/fixture/touched.ts']
            })
        );
        expect(result.failures.some((f) => f.code === 'P2')).toBe(false);
    });
});
