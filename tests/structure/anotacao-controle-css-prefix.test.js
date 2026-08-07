import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const rootDir = process.cwd();
const read = (relPath) => readFileSync(join(rootDir, relPath), 'utf8');

function cssSelectors(css) {
  return [...css.matchAll(/(^|,)\s*\.([A-Za-z][A-Za-z0-9_-]*)/gm)].map((match) => match[2]);
}

describe('migration: anotacao-controle P6 CSS em lote', () => {
  it('mantém todos os seletores CSS próprios da feature prefixados', () => {
    const css = read('src/features/anotacao-controle/style.css');
    const selectors = cssSelectors(css);
    const sharedSelectors = new Set(['processoVisualizado', 'imagemStatus', 'newLink', 'botaoSEI']);
    const ownSelectors = selectors.filter((selector) => !sharedSelectors.has(selector));

    expect(ownSelectors.length).toBeGreaterThan(0);
    expect(ownSelectors.every((selector) => selector.startsWith('seipro-sticknote-'))).toBe(true);
    expect(css).not.toMatch(/\.(?:stickNotePro|stickNoteCheck|stickNoteChecked|priorityStickNote|setDateStickNote)\b/);
  });

  it('mantém os únicos hooks de checklist compartilhados fora do CSS próprio', () => {
    const domain = read('src/features/anotacao-controle/domain.ts');
    const view = read('src/features/anotacao-controle/view.ts');

    expect(domain).toContain('class="stickNoteCheck stickNoteChecked"');
    expect(domain).toContain('class="stickNoteCheck"');
    expect(view).toMatch(/className:\s*'seipro-sticknote-toggle'/);
    expect(view).not.toMatch(/className:\s*['"][^'"]*(?:stickNotePro|priorityStickNote|setDateStickNote)/);
  });

  it('mantém o bundle e o CSS da feature carregados nos dois contextos do manifest', () => {
    const manifest = JSON.parse(read('manifest.base.json'));
    const entries = manifest.content_scripts.filter((entry) => entry.js.includes('js/lista-context.bundle.js'));

    expect(entries).toHaveLength(2);
    for (const entry of entries) {
      expect(entry.js).toContain('js/lista-context.bundle.js');
      expect(entry.css).toContain('css/anotacao-controle.css');
    }
  });
});
