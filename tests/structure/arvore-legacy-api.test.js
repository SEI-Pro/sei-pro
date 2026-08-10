import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { readArvoreSource } from '../helpers/read-arvore.js';

const rootDir = process.cwd();
const read = (relPath) => readFileSync(join(rootDir, relPath), 'utf8');

describe('migration: arvore full ESM facade', () => {
  it('instala a ponte dedicada no entry e aliasa os módulos fatiados', () => {
    const index = read('src/features/arvore/index.ts');
    const bridge = read('src/features/arvore/legacy-api.ts');

    expect(index).toContain("import { installArvoreLegacyApi } from './legacy-api.js';");
    expect(index).toContain('installArvoreLegacyApi();');
    expect(index).toContain("from './modules.js'");
    expect(index).toContain('publishFeature');
    expect(bridge).toContain("import { aliasGlobal } from '../../core/global.js';");
    expect(bridge).toContain("import * as domain from './domain.js';");
    expect(bridge).toContain("import * as io from './io.js';");
    expect(bridge).toContain("import * as view from './view.js';");
    expect(bridge).toContain("import * as modules from './modules.js'");
    expect(bridge).toContain("aliasGlobal('bindArvoreToolbarProcess', view.bindArvoreToolbarProcess);");
    expect(bridge).toContain("aliasGlobal('bindUploadArvoreNativeDragEvents'");
  });

  it('não mantém o monolito body.js nem a cópia sei-pro-arvore.js em src/', () => {
    expect(existsSync(join(rootDir, 'src/features/arvore/sei-pro-arvore.js'))).toBe(false);
    expect(existsSync(join(rootDir, 'src/features/arvore/body.js'))).toBe(false);
    expect(existsSync(join(rootDir, 'src/features/arvore/modules.ts'))).toBe(true);
    expect(existsSync(join(rootDir, 'src/features/arvore/boot.ts'))).toBe(true);
    expect(existsSync(join(rootDir, 'src/features/arvore/upload.ts'))).toBe(true);
    expect(existsSync(join(rootDir, 'src/features/arvore/state.ts'))).toBe(true);
    expect(existsSync(join(rootDir, 'src/features/arvore/templates.ts'))).toBe(true);
    expect(existsSync(join(rootDir, 'src/features/arvore/style.css'))).toBe(true);

    const clusters = readdirSync(join(rootDir, 'src/features/arvore'))
      .filter((name) => name.match(/\.(js|ts)$/));
    expect(clusters.length).toBeGreaterThanOrEqual(12);
  });

  it('empacota a raiz de contexto como dist/js/sei-pro-arvore.js sem cópia verbatim', () => {
    const build = read('scripts/build.mjs');
    expect(build).toContain("{ entry: 'src/entries/arvore.ts', out: 'dist/js/sei-pro-arvore.js' }");
    expect(build).not.toContain("'src/features/arvore/sei-pro-arvore.js'");
    expect(build).toContain("src/features/arvore/style.css");
  });

  it('preserva o wire da árvore no manifest e os call-sites dos clusters', () => {
    const manifest = JSON.parse(read('manifest.base.json'));
    const contexts = manifest.content_scripts.filter(({ js = [] }) =>
      js.includes('js/sei-pro-arvore.js')
    );

    expect(contexts.length).toBeGreaterThanOrEqual(1);
    for (const context of contexts) {
      const scripts = context.js;
      const dependency = scripts.indexOf('js/legacy-context.bundle.js');
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

    const source = readArvoreSource();
    const sticknote = read('src/features/arvore/sticknote-view.ts');
    const upload = read('src/features/arvore/upload.ts');
    expect(source).toContain('export function initSeiProArvore');
    expect(source).toContain('export function actionToolbarPro');
    expect(source).toContain("from './upload.js'");
    expect(source).toContain("from './sticknote-view.js'");
    expect(upload).toContain('export function loadUploadArvore');
    expect(upload).toContain('export function initUploadArvore');
    expect(upload).toContain('createFileQueue');
    expect(upload).toContain('bindUploadArvoreNativeDragEvents');
    expect(sticknote).toContain('export function sticknoteUpdate');
    expect(source).toContain('toolbarBinder({ element: elemProc, $, onAction: actionToolbarPro });');
  });
});
