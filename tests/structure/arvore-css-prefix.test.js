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
    const upload = read('src/features/arvore/upload.js');
    const view = read('src/features/arvore/view.js');
    const templates = read('src/features/arvore/templates.js');
    const sharedLegacy = read('src/features/sei-functions/body.js');
    const arvoreInfo = read('src/features/arvore-info/index.js');

    expect(upload).toContain('createFileQueue');
    expect(upload).toContain('previewsContainer');
    expect(view).toContain("items: '.dz-file-preview, .seipro-arvore-file-preview'");
    expect(view).toContain("handle: '.dz-filename'");
    expect(body).toContain('class="action-doc action-');
    expect(body).toContain('loading-action-doc');
    expect(body).toContain('class="panelDadosArvore');
    expect(read('src/features/arvore/sticknote-view.js')).toContain('class="stickDadosArvore');
    expect(templates).toContain('anchorJoinPro');
    expect(sharedLegacy).toContain('.action-doc[data-id=');
    expect(sharedLegacy).toContain("closest('.no_notifyPro')");
    expect(arvoreInfo).toContain("querySelector('.panelDadosArvore')");
  });

  it('carrega bundle e CSS da árvore no manifest; upload usa file-queue (sem Dropzone)', () => {
    const manifest = JSON.parse(read('manifest.base.json'));
    const entries = manifest.content_scripts.filter(({ js = [] }) =>
      js.includes('js/sei-pro-arvore.js')
    );
    const war = (manifest.web_accessible_resources || []).flatMap((r) => r.resources || []);
    const initArvore = read('src/bootstrap/init_arvore.js');
    const upload = read('src/features/arvore/upload.js');

    expect(entries.length).toBeGreaterThan(0);
    for (const entry of entries) {
      expect(entry.js).toContain('js/sei-pro-arvore.js');
      expect(entry.js).not.toContain('js/lib/dropzone.min.js');
      expect(entry.css).not.toContain('css/dropzone.min.css');
      expect(entry.css).toContain('css/arvore.css');
    }
    expect(war).not.toContain('js/lib/dropzone.min.js');
    expect(initArvore).not.toContain('dropzone.min.js');
    expect(upload).toContain('createFileQueue');
  });
});
