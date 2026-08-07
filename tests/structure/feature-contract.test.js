import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const rootDir = process.cwd();
const read = (rel) => readFileSync(join(rootDir, rel), 'utf8');

describe('architecture: feature public contract', () => {
  // Assert the contract and where its rationale lives — not the prose around it.
  // The previous version asserted doc wording ("Tier S", "platform/bus.js"), which made
  // improving the document fail the build. See ADR-0008 on what a fitness function
  // should verify.
  it('documents the canonical contract and points to its ADR', () => {
    const arch = read('docs/architecture.md');
    expect(arch).toMatch(/\{ id, api, install \}/);
    expect(arch).toMatch(/docs\/adr|\.\/adr\//);

    const adrIndex = read('docs/adr/README.md');
    expect(adrIndex).toMatch(/0004-features-autodescritivas-manifest-gerado\.md/);
  });

  it('pilot features publish { id, api, install }', () => {
    for (const file of [
      'src/features/login/index.ts',
      'src/features/external-config/index.ts',
      'src/features/monitorados/index.ts',
      'src/features/docs-lote/index.ts',
      'src/features/anotacao-controle/index.ts',
      'src/features/lista-processos/index.ts',
      'src/features/arvore/index.ts'
    ]) {
      const src = read(file);
      expect(src, file).toMatch(/publishFeature\s*\(/);
      expect(src, file).toMatch(/\bid\s*:/);
      expect(src, file).toMatch(/\bapi\s*:/);
      expect(src, file).toMatch(/\binstall\s*:/);
    }
  });

  it('atividades exposes id + install alongside api', () => {
    const src = read('src/features/atividades/index.ts');
    expect(src).toMatch(/id:\s*['"]atividades['"]/);
    expect(src).toMatch(/install:\s*installAtividadesFeature/);
    expect(src).toMatch(/api:\s*featureApi/);
  });

  it('core/stack does not install feature helpers or bus', () => {
    const stack = read('src/core/stack.ts');
    expect(stack).not.toMatch(/installQuickFilter|installSticknote|installDocsLote/);
    expect(stack).not.toMatch(/installBus\s*\(|platform\/bus/);
  });
});
