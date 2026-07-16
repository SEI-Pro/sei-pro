import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const rootDir = process.cwd();
const read = (relPath) => readFileSync(join(rootDir, relPath), 'utf8');

describe('migration: nao-lido legacy facade', () => {
  it('keeps the entry wired through the dedicated legacy bridge', () => {
    const index = read('src/features/nao-lido/index.js');
    const bridge = read('src/features/nao-lido/legacy-api.js');

    expect(index).toMatch(/import\s+['"]\.\/legacy-api\.js['"]/);
    expect(bridge).toMatch(/import \{ aliasGlobal \} from ['"]\.\.\/\.\.\/core\/global\.js['"]/);
    expect(bridge).toMatch(/import \* as io from ['"]\.\/io\.js['"]/);
    expect(bridge).toMatch(/import \* as view from ['"]\.\/view\.js['"]/);
    expect(bridge).toMatch(/typeof mod\[name\] === 'function'/);
  });

  it('does not duplicate the migrated globals in the legacy lista-processos monolith', () => {
    const legacy = read('src/features/lista-processos/sei-pro.js');
    const view = read('src/features/nao-lido/view.js');
    const io = read('src/features/nao-lido/io.js');

    expect(legacy).not.toMatch(/function\s+(?:initNaoVisualizadoPro|marcarProcessoNaoLido|marcarUmProcessoNaoLido)\s*\(/);
    expect(view).toMatch(/export function initNaoVisualizadoPro\s*\(/);
    expect(view).toMatch(/export async function marcarProcessoNaoLido\s*\(/);
    expect(view).toMatch(/export async function marcarUmProcessoNaoLido\s*\(/);
    expect(io).toMatch(/export function serializeSeiForm\s*\(/);
  });

  it('loads the feature bundle after the legacy lista-processos script in every context', () => {
    const manifest = JSON.parse(read('manifest.base.json'));
    const entries = manifest.content_scripts.filter((entry) =>
      entry.js.includes('js/sei-pro-nao-lido.js')
    );

    expect(entries.length).toBe(2);
    for (const entry of entries) {
      const requiredBeforeFeature = [
        'js/core-stack.bundle.js',
        'js/sei-functions-pro.js',
        'js/sei-pro.js'
      ];
      const bundleIndex = entry.js.indexOf('js/sei-pro-nao-lido.js');

      for (const dependency of requiredBeforeFeature) {
        const dependencyIndex = entry.js.indexOf(dependency);
        expect(dependencyIndex, `${dependency} must be present`).toBeGreaterThanOrEqual(0);
        expect(bundleIndex, `${dependency} must load before nao-lido`).toBeGreaterThan(dependencyIndex);
      }
      expect(entry.js[bundleIndex]).toBe('js/sei-pro-nao-lido.js');
      expect(entry.js.includes('js/sei-pro-nao-lido.js')).toBe(true);
    }
  });

  it('keeps the legacy producer on the data-act contract without inline action handlers', () => {
    const legacy = read('src/features/lista-processos/sei-pro.js');
    const view = read('src/features/nao-lido/view.js');

    expect(legacy).toContain('data-act="nao-lido-marcar"');
    expect(legacy).not.toMatch(/data-act="nao-lido-marcar"[^>]*on(click|change)=/);
    expect(view).toMatch(/on\(target, ['\"]click['\"], ['\"]\[data-act=.*nao-lido-marcar/);
    expect(view).toContain('marcarProcessoNaoLido();');
  });

  it('keeps the ESM bundle and generated output contract', () => {
    const build = read('scripts/build.mjs');
    const index = read('src/features/nao-lido/index.js');

    expect(build).toContain("{ entry: 'src/features/nao-lido/index.js', out: 'dist/js/sei-pro-nao-lido.js' }");
    expect(index).toContain("import './legacy-api.js';");
    expect(index).toContain('installNaoLido(document)');
    expect(index).toContain("ready(function () { installNaoLido(document); });");
  });
});
