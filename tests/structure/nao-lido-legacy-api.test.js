import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const rootDir = process.cwd();
const read = (relPath) => readFileSync(join(rootDir, relPath), 'utf8');

function manifestWithNaoLido() {
  return JSON.parse(read('manifest.base.json')).content_scripts.filter((entry) =>
    entry.js.includes('js/sei-pro-nao-lido.js')
  );
}

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
    const entries = manifestWithNaoLido();

    expect(entries.length).toBeGreaterThan(0);
    for (const entry of entries) {
      const legacyIndex = entry.js.indexOf('js/sei-pro.js');
      const bundleIndex = entry.js.indexOf('js/sei-pro-nao-lido.js');
      expect(legacyIndex).toBeGreaterThanOrEqual(0);
      expect(bundleIndex).toBeGreaterThan(legacyIndex);
    }
  });

  it('keeps the ESM bundle and generated output contract', () => {
    const build = read('scripts/build.mjs');

    expect(build).toContain("{ entry: 'src/features/nao-lido/index.js', out: 'dist/js/sei-pro-nao-lido.js' }");
    expect(read('src/features/nao-lido/index.js')).toContain('installNaoLido(document)');
  });
});
