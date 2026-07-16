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

  it('keeps the feature wire after its legacy dependencies in every context', () => {
    const entries = manifestWithAnotacaoControle();

    expect(entries.length).toBe(2);
    for (const entry of entries) {
      const requiredBeforeFeature = [
        'js/core-stack.bundle.js',
        'js/sei-functions-pro.js',
        'js/sei-pro.js'
      ];
      const bundleIndex = entry.js.indexOf('js/anotacao-controle.bundle.js');

      for (const dependency of requiredBeforeFeature) {
        const dependencyIndex = entry.js.indexOf(dependency);
        expect(dependencyIndex, `${dependency} must be present`).toBeGreaterThanOrEqual(0);
        expect(bundleIndex, `${dependency} must load before anotacao-controle`).toBeGreaterThan(dependencyIndex);
      }

      const initIndex = entry.js.indexOf('js/init.js');
      expect(initIndex, 'init.js must be present').toBeGreaterThan(bundleIndex);
      expect(entry.css).toContain('css/anotacao-controle.css');
    }
  });

  it('keeps the migrated lifecycle call-sites on the feature namespace', () => {
    const legacy = read('src/features/lista-processos/sei-pro.js');

    expect(legacy).toContain('SeiPro.features.anotacaoControle.init()');
    expect(legacy).toContain('SeiPro.features.anotacaoControle.render()');
    expect(legacy).not.toMatch(/\b(initReplaceSticknoteHome|renderSticknoteHomeInline|replaceSticknoteHome)\s*\(/);
  });

  it('keeps the ESM bundle output contract', () => {
    const build = read('scripts/build.mjs');
    const index = read('src/features/anotacao-controle/index.js');

    expect(build).toContain("{ entry: 'src/features/anotacao-controle/index.js', out: 'dist/js/anotacao-controle.bundle.js' }");
    expect(index).toContain("import './legacy-api.js';");
    expect(index).toContain('win.SeiPro.features.anotacaoControle');
  });
});
