import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const rootDir = process.cwd();
const read = (relPath) => readFileSync(join(rootDir, relPath), 'utf8');

describe('migration: arvore CSS', () => {
  it('ships a prefixed feature stylesheet', () => {
    const cssPath = join(rootDir, 'src/features/arvore/style.css');
    expect(existsSync(cssPath)).toBe(true);
    const css = read('src/features/arvore/style.css');
    expect(css).toContain('.seipro-arvore-');
    expect(css).toContain('#divMsgClipboard.msgGeral.msgSucesso');
  });

  it('preserva os hooks externos e compartilhados necessários ao upload e à árvore', () => {
    const body = read('src/features/arvore/body.js');
    const sharedLegacy = read('src/shared/legacy/sei-functions-pro.js');
    const arvoreInfo = read('src/features/arvore-info/index.js');

    expect(body).toContain("previewsContainer: '#divArvore'");
    expect(body).toContain("items: '.dz-file-preview'");
    expect(body).toContain("handle: '.dz-filename'");
    expect(body).toContain('class="action-doc action-');
    expect(body).toContain('loading-action-doc');
    expect(body).toContain('class="panelDadosArvore');
    expect(body).toContain('class="stickDadosArvore');
    expect(body).toContain('class="anchorJoinPro"');
    expect(sharedLegacy).toContain('.action-doc[data-id=');
    expect(sharedLegacy).toContain("closest('.no_notifyPro')");
    expect(arvoreInfo).toContain("querySelector('.panelDadosArvore')");
  });

  it('carrega Dropzone, bundle e CSS da árvore no contexto do manifest', () => {
    const manifest = JSON.parse(read('manifest.base.json'));
    const entries = manifest.content_scripts.filter(({ js = [] }) =>
      js.includes('js/sei-pro-arvore.js')
    );

    expect(entries.length).toBeGreaterThan(0);
    for (const entry of entries) {
      expect(entry.js).toContain('js/sei-pro-arvore.js');
      expect(entry.js).toContain('js/lib/dropzone.min.js');
      expect(entry.css).toContain('css/dropzone.min.css');
      expect(entry.css).toContain('css/arvore.css');
    }
  });
});
