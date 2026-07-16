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
    expect(bridge).toContain("aliasGlobal('bindUploadArvoreNativeDragEvents'");
    expect(bridge).toContain('view.bindUploadArvoreNativeDragEvents({');
  });

  it('não duplica no legado os helpers dos adapters exportados pela feature', () => {
    const legacy = read('src/features/arvore/sei-pro-arvore.js');
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
  });
});
