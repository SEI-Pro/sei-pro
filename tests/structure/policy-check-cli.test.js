/**
 * Runs policy-check against current git touched paths (CI path).
 */
import { describe, expect, it } from 'vitest';
import { execFileSync } from 'node:child_process';
import path from 'node:path';

const root = process.cwd();

describe('policy-check CLI on current tree', () => {
    it('exits 0 for current change set (or reports actionable failures)', () => {
        try {
            const out = execFileSync(process.execPath, ['scripts/policy-check.mjs'], {
                cwd: root,
                encoding: 'utf8'
            });
            expect(out).toMatch(/PASS/);
        } catch (err) {
            // Surface stderr for debugging
            const msg = `${err.stdout || ''}\n${err.stderr || ''}\n${err.message}`;
            expect.fail(`policy-check failed:\n${msg}`);
        }
    });

    it('fails closed when CI is given an unavailable merge base', () => {
        let error;
        try {
            execFileSync(process.execPath, ['scripts/policy-check.mjs'], {
                cwd: root,
                encoding: 'utf8',
                env: {
                    ...process.env,
                    CI: 'true',
                    POLICY_MERGE_BASE: 'missing-policy-base'
                }
            });
        } catch (caught) {
            error = caught;
        }
        expect(error).toBeTruthy();
        expect(`${error?.stdout || ''}\n${error?.stderr || ''}`).toMatch(/FAIL P0/);
    });
});
