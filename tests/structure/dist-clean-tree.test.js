/**
 * FR-004a: official build leaves no leftovers from prior runs.
 * Builds into an isolated SEI_PRO_DIST_DIR so Vitest file parallelism cannot race repo dist/.
 */
import { describe, expect, it } from 'vitest';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const root = process.cwd();

function runOfficialBuild(distDir) {
    execFileSync(process.execPath, ['scripts/build.mjs'], {
        cwd: root,
        env: { ...process.env, SEI_PRO_DIST_DIR: distDir },
        stdio: 'pipe'
    });
}

describe('dist clean tree (official build wipe)', () => {
    it('remove órfãos plantados ao rodar o build oficial', () => {
        const distDir = mkdtempSync(path.join(os.tmpdir(), 'sei-pro-clean-'));
        try {
            mkdirSync(path.join(distDir, 'js'), { recursive: true });
            const orphanAbs = path.join(distDir, 'js', '__orphan_probe__.js');
            writeFileSync(orphanAbs, 'orphan probe — must not survive official build\n', 'utf8');
            expect(existsSync(orphanAbs)).toBe(true);

            runOfficialBuild(distDir);

            expect(existsSync(orphanAbs), 'órfão sobreviveu ao build oficial').toBe(false);
            expect(existsSync(path.join(distDir, 'manifest.json'))).toBe(true);

            const manifest = JSON.parse(readFileSync(path.join(distDir, 'manifest.json'), 'utf8'));
            const sw = manifest.background?.service_worker;
            if (sw) {
                expect(existsSync(path.join(distDir, sw))).toBe(true);
            }
        } finally {
            rmSync(distDir, { recursive: true, force: true });
        }
    });
});
