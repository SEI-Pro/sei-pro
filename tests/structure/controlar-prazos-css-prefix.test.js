import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '../..');

function read(relPath) {
  return readFileSync(join(rootDir, relPath), 'utf8');
}

describe('migration: controlar-prazos CSS classes stay prefixed', () => {
  it('uses seipro-prefixed classes for the prazo column and add action', () => {
    const view = read('src/features/controlar-prazos/view.js');
    const css = read('src/features/controlar-prazos/style.css');
    const listaProcessos = read('src/features/lista-processos/sei-pro.js');
    const monitoradosPanel = read('src/features/monitorados/panel.js');

    expect(view).toContain('seipro-prazo-box-display');
    expect(view).toContain('seipro-add-controle-prazo');
    expect(css).toContain('.seipro-prazo-box-display');
    expect(css).toContain('.seipro-add-controle-prazo');
    expect(listaProcessos).toContain('seipro-prazo-box-display');
    expect(monitoradosPanel).toContain('seipro-prazo-box-display');

    expect(view).not.toMatch(/prazoBoxDisplay/);
    expect(css).not.toMatch(/prazoBoxDisplay|\.addControlePrazo\b/);
    expect(listaProcessos).not.toMatch(/prazoBoxDisplay/);
    expect(monitoradosPanel).not.toMatch(/prazoBoxDisplay/);
  });
});
