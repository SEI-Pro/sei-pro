import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { readListaProcessosSource } from '../helpers/read-lista-processos.js';

const rootDir = process.cwd();
const read = (relPath) => readFileSync(join(rootDir, relPath), 'utf8');

function manifestWithAnotacaoControle() {
  return JSON.parse(read('manifest.base.json')).content_scripts.filter((entry) =>
    entry.js.includes('js/lista-context.bundle.js')
  );
}

describe('migration: anotacao-controle legacy facade', () => {
  it('keeps the entry wired through the dedicated legacy bridge', () => {
    const index = read('src/features/anotacao-controle/index.ts');
    const bridge = read('src/features/anotacao-controle/legacy-api.ts');

    expect(index).toContain('installAnotacaoControleLegacyApi');
    expect(bridge).toMatch(/import \{ aliasGlobal \} from ['"]\.\.\/\.\.\/core\/global\.js['"]/);
    expect(bridge).toMatch(/import \* as domain from ['"]\.\/domain\.js['"]/);
    expect(bridge).toMatch(/import \* as io from ['"]\.\/io\.js['"]/);
    expect(bridge).toMatch(/import \* as view from ['"]\.\/view\.js['"]/);
    expect(bridge).toMatch(/typeof mod\[name\] === 'function'/);
  });

  it('does not duplicate the migrated helpers in the lista-processos clusters', () => {
    const legacy = readListaProcessosSource();
    const domain = read('src/features/anotacao-controle/domain.ts');
    const io = read('src/features/anotacao-controle/io.ts');
    const view = read('src/features/anotacao-controle/view.ts');

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
        'js/legacy-context.bundle.js'
      ];
      const bundleIndex = entry.js.indexOf('js/lista-context.bundle.js');

      for (const dependency of requiredBeforeFeature) {
        const dependencyIndex = entry.js.indexOf(dependency);
        expect(dependencyIndex, `${dependency} must be present`).toBeGreaterThanOrEqual(0);
        expect(bundleIndex, `${dependency} must load before anotacao-controle`).toBeGreaterThan(dependencyIndex);
      }

      const initIndex = entry.js.indexOf('js/init.js');
      expect(initIndex, 'init.js must be present').toBeGreaterThan(bundleIndex);
      expect(entry.css).toContain('css/anotacao-controle.css');
      expect(entry.js).not.toContain('js/anotacao-controle.bundle.js');
    }
  });

  it('keeps the migrated lifecycle call-sites on the feature api', () => {
    const legacy = readListaProcessosSource();

    expect(legacy).toContain('SeiPro.features.anotacaoControle.api.init()');
    expect(legacy).toContain('SeiPro.features.anotacaoControle.api.render()');
    expect(legacy).not.toMatch(/\b(initReplaceSticknoteHome|renderSticknoteHomeInline|replaceSticknoteHome)\s*\(/);
  });

  it('keeps the ESM bundle output contract', () => {
    const build = read('scripts/build.mjs') + '\n' + read('scripts/dist-pipeline.mjs');
    const index = read('src/features/anotacao-controle/index.ts');

    expect(build).toContain("{ entry: 'src/features/anotacao-controle/index.ts', out: 'dist/js/anotacao-controle.bundle.js' }");
    expect(index).toContain('installAnotacaoControleLegacyApi');
    expect(index).toContain('install: installAnotacaoControle');
    expect(index).toContain("publishFeature({");
    expect(index).toContain("nsKey: 'anotacaoControle'");
    expect(index).toMatch(/api:\s*Object\.freeze\(\{[\s\S]*init:\s*initReplaceSticknoteHome/);
  });
});
