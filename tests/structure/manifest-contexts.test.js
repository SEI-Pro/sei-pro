import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { generateManifest } from '../../scripts/generate-manifest.mjs';

const rootDir = process.cwd();
const manifest = JSON.parse(readFileSync(join(rootDir, 'manifest.base.json'), 'utf8'));
const FROZEN = JSON.parse(
    readFileSync(join(rootDir, 'tests/structure/manifest-contexts.snapshot.json'), 'utf8')
);

function blockByScript(script) {
    return manifest.content_scripts.filter((entry) => (entry.js || []).includes(script));
}

function projectBlock(block) {
    const out = {
        // Chrome cannot express URL queries in `matches`; globs carry the
        // action-specific part and are the effective selector for these blocks.
        matches: block.include_globs?.length ? block.include_globs : block.matches || [],
        exclude_matches: [
            ...(block.exclude_matches || []),
            ...(block.exclude_globs || [])
        ],
        js: block.js || [],
        css: block.css || []
    };
    if (block.all_frames === true) out.all_frames = true;
    if (block.run_at) out.run_at = block.run_at;
    return out;
}

/**
 * Snapshots of all content_scripts (effective URL selectors + script order).
 * Required before full manifest generation (ADR-0004 / plan 3.4).
 * Update tests/structure/manifest-contexts.snapshot.json deliberately when
 * enxugando a block — never silently.
 */
describe('manifest context snapshots (ADR-0004 / 3.4)', () => {
    it('has exactly 10 content_script blocks', () => {
        expect(manifest.content_scripts).toHaveLength(10);
        expect(FROZEN).toHaveLength(10);
    });

    it('matches and script order match the frozen snapshot', () => {
        expect(manifest.content_scripts.map(projectBlock)).toEqual(FROZEN);
    });

    it('login context is a single entry bundle', () => {
        const blocks = blockByScript('js/login.bundle.js');
        expect(blocks.length).toBeGreaterThan(0);
        for (const block of blocks) {
            expect(block.js).toEqual(['js/login.bundle.js']);
            expect(block.js).not.toContain('js/core-stack.bundle.js');
            expect(block.js).not.toContain('js/lib/jquery-3.7.1.min.js');
        }
    });

    it('db context is a single entry bundle', () => {
        const blocks = blockByScript('js/db.bundle.js');
        expect(blocks.length).toBeGreaterThan(0);
        for (const block of blocks) {
            expect(block.js).toEqual(['js/db.bundle.js']);
            expect(block.js).not.toContain('js/lib/jquery-3.7.1.min.js');
        }
    });

    it('documento stays a single-script block', () => {
        for (const script of ['js/documento.bundle.js']) {
            const blocks = blockByScript(script);
            expect(blocks.length, script).toBeGreaterThan(0);
            for (const block of blocks) {
                expect(block.js, script).toEqual([script]);
            }
        }
    });

    it('login/db entries boot via src/app', () => {
        const login = readFileSync(join(rootDir, 'src/entries/login.ts'), 'utf8');
        const db = readFileSync(join(rootDir, 'src/entries/db.ts'), 'utf8');
        // Composition roots pass an explicit deps object (ADR-0005).
        expect(login).toMatch(/boot\(\s*['"]login['"]\s*,/);
        expect(db).toMatch(/boot\(\s*['"]db['"]\s*,/);
        expect(login).toMatch(/createLogger|createStorage|createMessaging/);
        expect(db).toMatch(/createLogger|createStorage|createMessaging/);
        expect(login).toMatch(/registerLoginExclusiveFeatures/);
        expect(db).toMatch(/registerDbExclusiveFeatures/);
        expect(login).not.toMatch(/registerPilotFeatures/);
        expect(db).not.toMatch(/registerPilotFeatures/);
    });

    it('records remaining broad-block script count as a regression guard', () => {
        const broad = manifest.content_scripts.find(
            (entry) =>
                (entry.js || []).includes('js/core-stack.bundle.js') &&
                (entry.js || []).includes('js/init_all.js')
        );
        expect(broad).toBeTruthy();
        expect(broad.js.length).toBeLessThanOrEqual(28);
    });

    it('largest content_script block stays at most 40 scripts', () => {
        const max = Math.max(...manifest.content_scripts.map((b) => (b.js || []).length));
        expect(max).toBeLessThanOrEqual(40);
    });

    it('generate-manifest validates descriptors against committed manifest', () => {
        const { descriptors, text } = generateManifest();
        expect(descriptors).toHaveLength(37);
        expect(text).toBe(readFileSync(join(rootDir, 'manifest.base.json'), 'utf8'));
    });
});
