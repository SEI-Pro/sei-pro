import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '../..');
const source = (file) => readFileSync(join(rootDir, file), 'utf8');

describe('migration: lista-agrupamento legacy bridge', () => {
  it('centraliza os aliases e a fachada de toggle na ponte', () => {
    const bridge = source('src/features/lista-agrupamento/legacy-api.js');
    const index = source('src/features/lista-agrupamento/index.js');
    const legacy = source('src/features/lista-processos/sei-pro.js');

    expect(index).toMatch(/import\s+['"]\.\/legacy-api\.js['"]/);
    expect(bridge).toMatch(/import \{ aliasGlobal, globalRef \}/);
    expect(bridge).toMatch(/import \{\s*clearGroupCollapsed,\s*persistGroupCollapsed\s*\}/s);
    expect(bridge).toMatch(/import \{ toggleGroupTable \}/);
    expect(bridge).toMatch(/aliasGlobal\(\s*['"]extractGroupTableTooltipToArray['"]/);
    expect(bridge).toMatch(/aliasGlobal\(\s*['"]getTagName['"]/);
    expect(bridge).toMatch(/aliasGlobal\(\s*['"]toggleGroupTablePro['"]/);
    expect(bridge).toMatch(/toggleGroupTable\(\s*this_/);
    expect(legacy).not.toMatch(/function\s+toggleGroupTablePro\s*\(/);
    expect(legacy).not.toMatch(/function\s+listaAgrupamentoView\s*\(/);
  });
});
