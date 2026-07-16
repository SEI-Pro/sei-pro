import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const rootDir = process.cwd();
const read = (relPath) => readFileSync(join(rootDir, relPath), 'utf8');

function manifestWithAnotacaoControle() {
  return JSON.parse(read('manifest.base.json')).content_scripts.filter((entry) =>
    entry.js.includes('js/anotacao-controle.bundle.js')
  );
}

describe('migration: anotacao-controle legacy facade', () => {
  it('keeps the entry wired through the dedicated legacy bridge', () => {
    const index = read('src/features/anotacao-controle/index.js');
    const bridge = read('src/features/anotacao-controle/legacy-api.js');

    expect(index).toMatch(/import\s+['"]\.\/legacy-api\.js['"]/);
    expect(bridge).toMatch(/import \{ aliasGlobal \} from ['"]\.\.\/\.\.\/core\/global\.js['"]/);
    expect(bridge).toMatch(/import \* as domain from ['"]\.\/domain\.js['"]/);
    expect(bridge).toMatch(/import \* as io from ['"]\.\/io\.js['"]/);
    expect(bridge).toMatch(/import \* as view from ['"]\.\/view\.js['"]/);
    expect(bridge).toMatch(/typeof mod\[name\] === 'function'/);
  });

  it('does not duplicate the migrated helpers in the lista-processos monolith', () => {
    const legacy = read('src/features/lista-processos/sei-pro.js');
    const domain = read('src/features/anotacao-controle/domain.js');
    const io = read('src/features/anotacao-controle/io.js');
    const view = read('src/features/anotacao-controle/view.js');

    expect(legacy).not.toMatch(/function\s+(?:replaceSticknoteHome|renderSticknoteHomeInline|initReplaceSticknoteHome)\s*\(/);
    expect(domain).toMatch(/export function (?:buildSticknoteHomeRecord|sticknoteChecklistClass)/);
    expect(io).toMatch(/export function fetchSticknotePriority\s*\(/);
    expect(view).toMatch(/export \{ initReplaceSticknoteHome, renderSticknoteHomeInline, replaceSticknoteHome \}/);
  });

  it('keeps the feature bundle after the legacy lista-processos script', () => {
    const entries = manifestWithAnotacaoControle();

    expect(entries.length).toBeGreaterThan(0);
    for (const entry of entries) {
      const legacyIndex = entry.js.indexOf('js/sei-pro.js');
      const bundleIndex = entry.js.indexOf('js/anotacao-controle.bundle.js');
      expect(legacyIndex).toBeGreaterThanOrEqual(0);
      expect(bundleIndex).toBeGreaterThan(legacyIndex);
    }
  });

  it('keeps the ESM bundle output contract', () => {
    const build = read('scripts/build.mjs');

    expect(build).toContain("{ entry: 'src/features/anotacao-controle/index.js', out: 'dist/js/anotacao-controle.bundle.js' }");
  });
});
