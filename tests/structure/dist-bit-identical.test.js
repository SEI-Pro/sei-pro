/**
 * FR-004b / SC-002a: two clean official builds → bit-identical trees.
 * Uses isolated SEI_PRO_DIST_DIR so Vitest parallelism does not race repo dist/.
 */
import { describe, expect, it } from 'vitest';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync } from 'node:fs';
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

function walkFiles(dir, base = dir, acc = []) {
    for (const name of readdirSync(dir)) {
        const full = path.join(dir, name);
        if (statSync(full).isDirectory()) walkFiles(full, base, acc);
        else acc.push(path.relative(base, full));
    }
    return acc.sort();
}

function treesEqual(aRoot, bRoot) {
    const aFiles = walkFiles(aRoot);
    const bFiles = walkFiles(bRoot);
    if (aFiles.join('\n') !== bFiles.join('\n')) {
        return {
            ok: false,
            detail: `file set differs\nA-only: ${aFiles.filter((f) => !bFiles.includes(f)).join(', ')}\nB-only: ${bFiles.filter((f) => !aFiles.includes(f)).join(', ')}`
        };
    }
    for (const rel of aFiles) {
        const a = readFileSync(path.join(aRoot, rel));
        const b = readFileSync(path.join(bRoot, rel));
        if (!a.equals(b)) {
            return { ok: false, detail: `content differs: ${rel}` };
        }
    }
    return { ok: true, detail: '' };
}

describe('dist bit-identical (two clean official builds)', () => {
    it('duas builds oficiais limpas produzem árvores idênticas byte a byte', () => {
        const a = mkdtempSync(path.join(os.tmpdir(), 'sei-pro-dist-a-'));
        const b = mkdtempSync(path.join(os.tmpdir(), 'sei-pro-dist-b-'));

        try {
            runOfficialBuild(a);
            expect(existsSync(path.join(a, 'manifest.json'))).toBe(true);

            runOfficialBuild(b);
            expect(existsSync(path.join(b, 'manifest.json'))).toBe(true);

            const result = treesEqual(a, b);
            expect(result.ok, result.detail).toBe(true);
        } finally {
            rmSync(a, { recursive: true, force: true });
            rmSync(b, { recursive: true, force: true });
        }
    });
});
