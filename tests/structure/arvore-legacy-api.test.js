import { describe, expect, it } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const rootDir = process.cwd();
const read = (relPath) => readFileSync(join(rootDir, relPath), 'utf8');

describe('migration: arvore full ESM facade', () => {
  it('instala a ponte dedicada no entry da árvore e aliasa o body migrado', () => {
    const index = read('src/features/arvore/index.js');
    const bridge = read('src/features/arvore/legacy-api.js');

    expect(index).toContain("import { installArvoreLegacyApi } from './legacy-api.js';");
    expect(index).toContain('installArvoreLegacyApi();');
    expect(index).toContain("import { initSeiProArvore } from './body.js';");
    expect(bridge).toContain("import { aliasGlobal } from '../../core/global.js';");
    expect(bridge).toContain("import * as domain from './domain.js';");
    expect(bridge).toContain("import * as io from './io.js';");
    expect(bridge).toContain("import * as view from './view.js';");
    expect(bridge).toContain("import * as body from './body.js';");
    expect(bridge).toContain("aliasGlobal('bindArvoreToolbarProcess', view.bindArvoreToolbarProcess);");
    expect(bridge).toContain("aliasGlobal('bindUploadArvoreNativeDragEvents'");
  });

  it('não mantém o monolito global sei-pro-arvore.js em src/', () => {
    expect(existsSync(join(rootDir, 'src/features/arvore/sei-pro-arvore.js'))).toBe(false);
    expect(existsSync(join(rootDir, 'src/features/arvore/body.js'))).toBe(true);
    expect(existsSync(join(rootDir, 'src/features/arvore/state.js'))).toBe(true);
    expect(existsSync(join(rootDir, 'src/features/arvore/templates.js'))).toBe(true);
    expect(existsSync(join(rootDir, 'src/features/arvore/style.css'))).toBe(true);
  });

  it('empacota a feature como dist/js/sei-pro-arvore.js sem cópia verbatim', () => {
    const build = read('scripts/build.mjs');
    expect(build).toContain("{ entry: 'src/features/arvore/index.js', out: 'dist/js/sei-pro-arvore.js' }");
    expect(build).not.toContain("'src/features/arvore/sei-pro-arvore.js'");
    expect(build).toContain("src/features/arvore/style.css");
  });

  it('preserva o wire da árvore no manifest e os call-sites do body', () => {
    const manifest = JSON.parse(read('manifest.base.json'));
    const contexts = manifest.content_scripts.filter(({ js = [] }) =>
      js.includes('js/sei-pro-arvore.js')
    );

    expect(contexts.length).toBeGreaterThanOrEqual(1);
    for (const context of contexts) {
      const scripts = context.js;
      const dependency = scripts.indexOf('js/sei-functions-pro.js');
      const bundle = scripts.indexOf('js/sei-pro-arvore.js');
      const init = scripts.indexOf('js/init_arvore.js');
      expect(scripts).not.toContain('js/arvore-menu-domain.bundle.js');
      if (dependency >= 0) {
        expect(bundle).toBeGreaterThan(dependency);
      }
      if (init >= 0) {
        expect(init).toBeGreaterThan(bundle);
      }
    }

    const body = read('src/features/arvore/body.js');
    expect(body).toContain('export function initSeiProArvore');
    expect(body).toContain('export function actionToolbarPro');
    expect(body).toContain('export function loadUploadArvore');
    expect(body).toContain('export function sticknoteUpdate');
    expect(body).toContain('bindUploadArvoreNativeDragEvents');
    expect(body).toContain('toolbarBinder({ element: elemProc, $, onAction: actionToolbarPro });');
  });
});
