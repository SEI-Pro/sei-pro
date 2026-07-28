import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const rootDir = process.cwd();
const read = (relPath) => readFileSync(join(rootDir, relPath), 'utf8');

describe('migration: lista-processos full ESM facade', () => {
  it('instala a ponte dedicada no entry e aliasa o body migrado', () => {
    const index = read('src/features/lista-processos/index.js');
    const bridge = read('src/features/lista-processos/legacy-api.js');

    expect(index).toContain("import { installListaProcessosLegacyApi } from './legacy-api.js';");
    expect(index).toContain('installListaProcessosLegacyApi();');
    expect(index).toContain("import { initSeiPro } from './body.js';");
    expect(bridge).toContain("import { aliasGlobal } from '../../core/global.js';");
    expect(bridge).toContain("import * as domain from './domain.js';");
    expect(bridge).toContain("import * as io from './io.js';");
    expect(bridge).toContain("import * as body from './body.js';");
  });

  it('não mantém o monolito global sei-pro.js em src/', () => {
    expect(existsSync(join(rootDir, 'src/features/lista-processos/sei-pro.js'))).toBe(false);
    expect(existsSync(join(rootDir, 'src/features/lista-processos/body.js'))).toBe(true);
    expect(existsSync(join(rootDir, 'src/features/lista-processos/state.js'))).toBe(true);
    expect(existsSync(join(rootDir, 'src/features/lista-processos/templates.js'))).toBe(true);
    expect(existsSync(join(rootDir, 'src/features/lista-processos/style.css'))).toBe(true);
    expect(existsSync(join(rootDir, 'src/features/lista-processos/domain.js'))).toBe(true);
  });

  it('empacota a feature como dist/js/sei-pro.js sem cópia verbatim', () => {
    const build = read('scripts/build.mjs');
    expect(build).toContain("{ entry: 'src/features/lista-processos/index.js', out: 'dist/js/sei-pro.js' }");
    expect(build).not.toContain("'src/features/lista-processos/sei-pro.js'");
    expect(build).toContain('src/features/lista-processos/style.css');
  });

  it('preserva o wire da lista no manifest e os call-sites do body', () => {
    const manifest = JSON.parse(read('manifest.base.json'));
    const contexts = manifest.content_scripts.filter(({ js = [] }) =>
      js.includes('js/sei-pro.js')
    );

    expect(contexts.length).toBeGreaterThanOrEqual(2);
    for (const context of contexts) {
      if (!(context.css || []).length) continue;
      if ((context.js || []).includes('js/lista.bundle.js')) {
        expect(context.css).toContain('css/lista-processos.css');
      }
    }

    const body = read('src/features/lista-processos/body.js');
    expect(body).toContain('export function initSeiPro');
    expect(body).toContain('export function insertGroupTable');
    expect(body).toContain('export function getFilterTableHome');
    expect(body).toContain('export function setTableSorterHome');
  });
});
