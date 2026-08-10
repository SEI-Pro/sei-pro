/**
 * Fail on new inline DOM handlers in touched UI sources (002-ts-zero-legacy US2).
 * Semantic element choice remains human (H3).
 */
import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { resolveTouchedPaths } from '../../scripts/policy/touched-paths.mjs';

const root = process.cwd();
const INLINE_RE = /\son[a-z][a-z0-9_-]*\s*=/i;

describe('touched DOM policy', () => {
    it('fails when touched paths contain inline handler attributes', () => {
        const env = process.env.POLICY_TOUCHED_PATHS;
        const paths = env
            ? env.split(/[,:\n]/).map((s) => s.trim()).filter(Boolean)
            : resolveTouchedPaths();
        if (!paths.length) {
            // Empty diff: retain a deterministic regression check for the matcher.
            const sample = '<button onclick="doThing()">x</button>';
            expect(INLINE_RE.test(sample)).toBe(true);
            return;
        }
        const hits = [];
        for (const rel of paths) {
            const abs = path.join(root, rel);
            if (!fs.existsSync(abs)) continue;
            if (!rel.startsWith('src/') || !/\.(ts|js|html|css)$/.test(rel)) continue;
            const text = fs.readFileSync(abs, 'utf8');
            if (INLINE_RE.test(text)) hits.push(rel);
        }
        expect(hits, `inline handlers in touched files: ${hits.join(', ')}`).toEqual([]);
    });
});
