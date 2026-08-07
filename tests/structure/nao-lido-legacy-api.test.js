import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { readListaProcessosSource } from '../helpers/read-lista-processos.js';

const rootDir = process.cwd();
const read = (relPath) => readFileSync(join(rootDir, relPath), 'utf8');

describe('migration: nao-lido legacy facade', () => {
  it('keeps the entry wired through the dedicated legacy bridge', () => {
    const index = read('src/features/nao-lido/index.ts');
    const bridge = read('src/features/nao-lido/legacy-api.ts');

    expect(index).toMatch(/import\s+['"]\.\/legacy-api\.js['"]/);
    expect(bridge).toMatch(/import \{ aliasGlobal \} from ['"]\.\.\/\.\.\/core\/global\.js['"]/);
    expect(bridge).toMatch(/import \* as io from ['"]\.\/io\.js['"]/);
    expect(bridge).toMatch(/import \* as view from ['"]\.\/view\.js['"]/);
    expect(bridge).toMatch(/typeof mod\[name\] === 'function'/);
  });

  it('does not duplicate the migrated globals in the lista-processos clusters', () => {
    const legacy = readListaProcessosSource();
    const view = read('src/features/nao-lido/view.ts');
    const io = read('src/features/nao-lido/io.ts');

    expect(legacy).not.toMatch(/function\s+(?:initNaoVisualizadoPro|marcarProcessoNaoLido|marcarUmProcessoNaoLido)\s*\(/);
    expect(view).toMatch(/export function initNaoVisualizadoPro\s*\(/);
    expect(view).toMatch(/export async function marcarProcessoNaoLido\s*\(/);
    expect(view).toMatch(/export async function marcarUmProcessoNaoLido\s*\(/);
    expect(io).toMatch(/export function serializeSeiForm\s*\(/);
  });

    it('loads the lista composition root after the shared legacy dependency in every context', () => {
    const manifest = JSON.parse(read('manifest.base.json'));
    const entries = manifest.content_scripts.filter((entry) =>
      entry.js.includes('js/lista-context.bundle.js')
    );

    expect(entries.length).toBe(2);
    for (const entry of entries) {
        const requiredBeforeFeature = [
        'js/core-stack.bundle.js',
        'js/sei-functions-pro.js'
      ];
      const bundleIndex = entry.js.indexOf('js/lista-context.bundle.js');

      for (const dependency of requiredBeforeFeature) {
        const dependencyIndex = entry.js.indexOf(dependency);
        expect(dependencyIndex, `${dependency} must be present`).toBeGreaterThanOrEqual(0);
        expect(bundleIndex, `${dependency} must load before lista context`).toBeGreaterThan(dependencyIndex);
      }
      expect(entry.js[bundleIndex]).toBe('js/lista-context.bundle.js');
      expect(entry.js).not.toContain('js/sei-pro.js');
      expect(entry.js.includes('js/sei-pro-nao-lido.js')).toBe(false);
    }
  });

  it('keeps the legacy producer on the data-act contract without inline action handlers', () => {
    const legacy = readListaProcessosSource();
    const view = read('src/features/nao-lido/view.ts');

    expect(legacy).toContain('data-act="nao-lido-marcar"');
    expect(legacy).not.toMatch(/data-act="nao-lido-marcar"[^>]*on(click|change)=/);
    expect(view).toMatch(/on\(target, ['\"]click['\"], ['\"]\[data-act=.*nao-lido-marcar/);
    expect(view).toContain('marcarProcessoNaoLido();');
  });

  it('installs exclusively through the lista context registry', () => {
    const build = read('scripts/build.mjs');
    const index = read('src/features/nao-lido/index.ts');
    const descriptor = read('src/features/nao-lido/feature.ts');
    const entry = read('src/entries/lista-context.ts');

    expect(build).not.toContain("{ entry: 'src/features/nao-lido/index.ts', out: 'dist/js/sei-pro-nao-lido.js' }");
    expect(index).toContain("import './legacy-api.js';");
    expect(index).not.toContain('installNaoLido(document)');
    expect(descriptor).toContain("maturity: 'exclusive'");
    expect(entry).toContain('registerListaExclusiveFeatures()');
    expect(entry).toMatch(/boot\(\s*['"]lista['"]\s*,/);
  });
});
