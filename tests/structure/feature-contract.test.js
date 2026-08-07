import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const rootDir = process.cwd();
const read = (rel) => readFileSync(join(rootDir, rel), 'utf8');

describe('architecture: feature public contract', () => {
  it('documents the canonical contract', () => {
    const arch = read('docs/architecture.md');
    expect(arch).toMatch(/\{ id, api, install \}/);
    expect(arch).toMatch(/Tier S/);
    expect(arch).toMatch(/Tier C/);
    expect(arch).toMatch(/src\/app\//);
    expect(arch).toMatch(/platform\/bus\.js/);
  });

  it('pilot features publish { id, api, install }', () => {
    for (const file of [
      'src/features/login/index.js',
      'src/features/external-config/index.js',
      'src/features/monitorados/index.js',
      'src/features/docs-lote/index.js',
      'src/features/anotacao-controle/index.js',
      'src/features/lista-processos/index.js',
      'src/features/arvore/index.js'
    ]) {
      const src = read(file);
      expect(src, file).toMatch(/publishFeature\s*\(/);
      expect(src, file).toMatch(/\bid\s*:/);
      expect(src, file).toMatch(/\bapi\s*:/);
      expect(src, file).toMatch(/\binstall\s*:/);
    }
  });

  it('atividades exposes id + install alongside api', () => {
    const src = read('src/features/atividades/index.js');
    expect(src).toMatch(/id:\s*['"]atividades['"]/);
    expect(src).toMatch(/install:\s*installAtividadesFeature/);
    expect(src).toMatch(/api:\s*featureApi/);
  });

  it('core/stack does not install feature helpers', () => {
    const stack = read('src/core/stack.js');
    expect(stack).not.toMatch(/installQuickFilter|installSticknote|installDocsLote/);
    expect(stack).toMatch(/installBus\s*\(/);
  });
});
