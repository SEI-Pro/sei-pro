import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { readListaProcessosSource } from '../helpers/read-lista-processos.js';

const rootDir = process.cwd();
const read = (relPath) => readFileSync(join(rootDir, relPath), 'utf8');

describe('migration: lista-processos full ESM facade', () => {
  it('instala a ponte dedicada no entry e aliasa os módulos fatiados', () => {
    const index = read('src/features/lista-processos/index.ts');
    const bridge = read('src/features/lista-processos/legacy-api.ts');

    expect(index).toContain("import { installListaProcessosLegacyApi } from './legacy-api.js';");
    expect(index).toContain('installListaProcessosLegacyApi();');
    expect(index).toContain("from './modules.js'");
    expect(index).toContain('publishFeature');
    expect(bridge).toContain("import { aliasGlobal } from '../../core/global.js';");
    expect(bridge).toContain("import * as domain from './domain.js';");
    expect(bridge).toContain("import * as io from './io.js';");
    expect(bridge).toContain("import * as modules from './modules.js'");
  });

  it('não mantém o monolito body.js nem a cópia sei-pro.js em src/', () => {
    expect(existsSync(join(rootDir, 'src/features/lista-processos/sei-pro.js'))).toBe(false);
    expect(existsSync(join(rootDir, 'src/features/lista-processos/body.js'))).toBe(false);
    expect(existsSync(join(rootDir, 'src/features/lista-processos/modules.ts'))).toBe(true);
    expect(existsSync(join(rootDir, 'src/features/lista-processos/boot.ts'))).toBe(true);
    expect(existsSync(join(rootDir, 'src/features/lista-processos/state.ts'))).toBe(true);
    expect(existsSync(join(rootDir, 'src/features/lista-processos/templates.ts'))).toBe(true);
    expect(existsSync(join(rootDir, 'src/features/lista-processos/style.css'))).toBe(true);
    expect(existsSync(join(rootDir, 'src/features/lista-processos/domain.ts'))).toBe(true);

    const clusters = readdirSync(join(rootDir, 'src/features/lista-processos'))
      .filter((name) => name.match(/\.(js|ts)$/));
    expect(clusters.length).toBeGreaterThanOrEqual(15);
  });

  it('empacota a feature como dist/js/sei-pro.js sem cópia verbatim', () => {
    const build = read('scripts/build.mjs') + '\n' + read('scripts/dist-pipeline.mjs');
    expect(build).toContain("{ entry: 'src/features/lista-processos/index.ts', out: 'dist/js/sei-pro.js' }");
    expect(build).not.toContain("'src/features/lista-processos/sei-pro.js'");
    expect(build).toContain('src/features/lista-processos/style.css');
  });

  it('preserva o wire da lista no manifest e os call-sites dos clusters', () => {
    const manifest = JSON.parse(read('manifest.base.json'));
    const contexts = manifest.content_scripts.filter(({ js = [] }) =>
      js.includes('js/lista-context.bundle.js')
    );

    expect(contexts.length).toBeGreaterThanOrEqual(2);
    for (const context of contexts) {
      if (!(context.css || []).length) continue;
      expect(context.css).toContain('css/lista-processos.css');
      expect(context.js).not.toContain('js/sei-pro.js');
    }

    const source = readListaProcessosSource();
    expect(source).toContain('export function initSeiPro');
    expect(source).toContain('export function insertGroupTable');
    expect(source).toContain('export function getFilterTableHome');
    expect(source).toContain('export function setTableSorterHome');
  });

  it('publica o contrato canônico { id, api, install }', () => {
    const index = read('src/features/lista-processos/index.ts');
    expect(index).toContain("id: 'lista-processos'");
    expect(index).toContain("nsKey: 'listaProcessos'");
    expect(index).toContain('install: installListaProcessos');
  });
});
