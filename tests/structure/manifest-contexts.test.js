import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const rootDir = process.cwd();
const manifest = JSON.parse(readFileSync(join(rootDir, 'manifest.base.json'), 'utf8'));

function blockByScript(script) {
  return manifest.content_scripts.filter((entry) => (entry.js || []).includes(script));
}

/**
 * Snapshots of per-context content_scripts. Keep these tight as contexts migrate
 * to single entry bundles. Manifest generation comes only after these stabilize.
 */
describe('manifest context snapshots (slim entries)', () => {
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

  it('login/db entries boot via src/app', () => {
    const login = readFileSync(join(rootDir, 'src/entries/login.js'), 'utf8');
    const db = readFileSync(join(rootDir, 'src/entries/db.js'), 'utf8');
    expect(login).toMatch(/boot\(\s*['"]login['"]\s*\)/);
    expect(db).toMatch(/boot\(\s*['"]db['"]\s*\)/);
    expect(login).toMatch(/registerPilotFeatures/);
    expect(db).toMatch(/registerPilotFeatures/);
  });

  it('records remaining broad-block script count as a regression guard', () => {
    const broad = manifest.content_scripts.find((entry) =>
      (entry.js || []).includes('js/core-stack.bundle.js') &&
      (entry.js || []).includes('js/init_all.js')
    );
    expect(broad).toBeTruthy();
    // Enxugar este número é o alvo pós-registry; snapshot evita crescimento acidental.
    expect(broad.js.length).toBeLessThanOrEqual(28);
  });
});
