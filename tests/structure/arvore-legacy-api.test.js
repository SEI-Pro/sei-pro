import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const rootDir = process.cwd();
const read = (relPath) => readFileSync(join(rootDir, relPath), 'utf8');

describe('migration: arvore upload legacy facade', () => {
  it('instala a ponte dedicada no entry da árvore', () => {
    const index = read('src/features/arvore/index.js');
    const bridge = read('src/features/arvore/legacy-api.js');

    expect(index).toContain("import { installArvoreLegacyApi } from './legacy-api.js';");
    expect(index).toContain('installArvoreLegacyApi();');
    expect(bridge).toContain("import { aliasGlobal } from '../../core/global.js';");
    expect(bridge).toContain("import * as domain from './domain.js';");
    expect(bridge).toContain("import * as io from './io.js';");
    expect(bridge).toContain("import * as view from './view.js';");
    expect(bridge).toMatch(/aliasGlobal\(name, mod\[name\]\)/);
    expect(bridge).toContain("aliasGlobal('bindArvoreToolbarProcess', view.bindArvoreToolbarProcess);");
    expect(bridge).toContain("aliasGlobal('bindUploadArvoreNativeDragEvents'");
    expect(bridge).toContain('view.bindUploadArvoreNativeDragEvents({');
  });

  it('não duplica no legado os helpers dos adapters exportados pela feature', () => {
    const legacy = read('src/features/arvore/sei-pro-arvore.js');
    expect(legacy).not.toMatch(/function\s+bindArvoreToolbarProcess\s*\(/);
    expect(legacy).toContain("typeof bindArvoreToolbarProcess === 'function'");
    expect(legacy).toContain('toolbarBinder({ element: elemProc, $, onAction: actionToolbarPro });');
    for (const name of [
      'bindUploadArvoreNativeDragEvents',
      'fetchUploadPage',
      'postUploadForm',
      'postSavedUpload',
      'extractUploadExtensions',
      'sortUploadFiles'
    ]) {
      expect(legacy).not.toMatch(new RegExp(`function\\s+${name}\\s*\\(`));
    }
  });

  it('mantém o bundle da feature e a cópia legada registrados no build', () => {
    const build = read('scripts/build.mjs');
    const index = read('src/features/arvore/index.js');
    expect(build).toContain("{ entry: 'src/features/arvore/index.js', out: 'dist/js/arvore-menu-domain.bundle.js' }");
    expect(build).toContain("'src/features/arvore/sei-pro-arvore.js'");
    expect(index).toContain('namespace.features.arvoreUploadIO');
    expect(index).toContain("import { bindArvoreToolbarProcess, bindUploadArvoreNativeDragEvents } from './view.js';");
    expect(index).toContain('namespace.features.arvoreUploadView = { bindArvoreToolbarProcess, bindUploadArvoreNativeDragEvents };');
  });

  it('preserva o wire da árvore no manifest e os call-sites legados', () => {
    const manifest = JSON.parse(read('manifest.base.json'));
    const contexts = manifest.content_scripts.filter(({ js = [] }) =>
      js.includes('js/sei-pro-arvore.js')
    );

    expect(contexts.length).toBeGreaterThan(0);
    for (const context of contexts) {
      const scripts = context.js;
      const dependency = scripts.indexOf('js/sei-functions-pro.js');
      const bundle = scripts.indexOf('js/arvore-menu-domain.bundle.js');
      const legacy = scripts.indexOf('js/sei-pro-arvore.js');
      expect(dependency).toBeGreaterThanOrEqual(0);
      expect(bundle).toBeGreaterThan(dependency);
      expect(legacy).toBeGreaterThan(bundle);
    }

    const legacy = read('src/features/arvore/sei-pro-arvore.js');
    expect(legacy).toContain('bindUploadArvoreNativeDragEvents();');
    expect(legacy).toContain('SeiPro.features.arvoreUploadIO');
    expect(legacy).toContain('SeiPro.features.arvoreUpload');
  });
});
