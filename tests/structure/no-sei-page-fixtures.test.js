/**
 * FR-016: do not persist SEI page HTML/screenshots as fixtures.
 */
import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const FORBIDDEN = [
    /(?:^|\/)(?:sei-page|sei-live|sei-dom|pagina-sei|processo-sei)[-_].*\.(html?|json|txt)$/i,
    /(?:^|\/)(?:sei-screenshot|pagina-sei-screenshot)[-_].*\.(png|jpe?g|webp)$/i,
    /\/fixtures\/(?:sei-live|sei-page)\//i
];

/** Explicit allowlist file paths (none by default). */
const ALLOWLIST = new Set([]);

function walk(dir, out = []) {
    if (!fs.existsSync(dir)) return out;
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
        if (ent.name === 'node_modules' || ent.name === 'dist' || ent.name === '.git') continue;
        const full = path.join(dir, ent.name);
        if (ent.isDirectory()) walk(full, out);
        else out.push(full);
    }
    return out;
}

describe('no SEI page fixtures (FR-016)', () => {
    it('rejects forbidden SEI capture filename patterns', () => {
        const bad = [];
        for (const abs of walk(root)) {
            const rel = path.relative(root, abs).split(path.sep).join('/');
            if (ALLOWLIST.has(rel)) continue;
            if (FORBIDDEN.some((re) => re.test(rel))) bad.push(rel);
        }
        expect(bad, `forbidden SEI persistence paths:\n${bad.join('\n')}`).toEqual([]);
    });
});
