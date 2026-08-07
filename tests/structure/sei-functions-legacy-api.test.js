import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { readSeiFunctionsSource } from '../helpers/read-sei-functions.js';

const rootDir = process.cwd();
const read = (relPath) => readFileSync(join(rootDir, relPath), 'utf8');

describe('migration: sei-functions full ESM facade', () => {
  it('instala a ponte dedicada no entry e aliasa os módulos fatiados', () => {
    const index = read('src/features/sei-functions/index.ts');
    const bridge = read('src/features/sei-functions/legacy-api.ts');

    expect(index).toContain("import { installSeiFunctionsLegacyApi } from './legacy-api.js';");
    expect(index).toContain('installSeiFunctionsLegacyApi();');
    expect(index).toContain("from './modules.js'");
    expect(index).toContain('publishFeature');
    expect(bridge).toContain("import { aliasGlobal } from '../../core/global.js';");
    expect(bridge).toContain("import * as modules from './modules.js';");
  });

  it('não mantém o monolito body.js nem a cópia em shared/legacy/', () => {
    expect(existsSync(join(rootDir, 'src/shared/legacy/sei-functions-pro.js'))).toBe(false);
    expect(existsSync(join(rootDir, 'src/features/sei-functions/body.js'))).toBe(false);
    expect(existsSync(join(rootDir, 'src/features/sei-functions/modules.ts'))).toBe(true);
    expect(existsSync(join(rootDir, 'src/features/sei-functions/boot.ts'))).toBe(true);
    expect(existsSync(join(rootDir, 'src/features/sei-functions/state.ts'))).toBe(true);
    expect(existsSync(join(rootDir, 'src/features/sei-functions/templates.ts'))).toBe(true);
    expect(existsSync(join(rootDir, 'src/features/sei-functions/style.css'))).toBe(true);

    const clusters = readdirSync(join(rootDir, 'src/features/sei-functions'))
      .filter((name) => name.match(/\.(js|ts)$/));
    expect(clusters.length).toBeGreaterThanOrEqual(20);
  });

  it('empacota a feature como dist/js/sei-functions-pro.js sem cópia verbatim', () => {
    const build = read('scripts/build.mjs');
    expect(build).toContain("{ entry: 'src/entries/sei-functions.ts', out: 'dist/js/sei-functions-pro.js' }");
    expect(read('src/entries/sei-functions.ts')).toContain('installSeiFunctionsFeature();');
    expect(read('src/features/sei-functions/index.ts')).not.toMatch(/\ninstallSeiFunctionsFeature\(\);\s*$/);
    expect(build).not.toContain("'src/shared/legacy/sei-functions-pro.js'");
    expect(build).toContain('src/features/sei-functions/style.css');
  });

  it('preserva o wire no manifest e os call-sites dos clusters', () => {
    const manifest = JSON.parse(read('manifest.base.json'));
    const contexts = manifest.content_scripts.filter(({ js = [] }) =>
      js.includes('js/sei-functions-pro.js')
    );
    expect(contexts.length).toBeGreaterThanOrEqual(7);
    for (const context of contexts) {
      if ((context.css || []).length) {
        expect(context.css).toContain('css/sei-functions.css');
      }
    }

    const source = readSeiFunctionsSource();
    expect(source).toContain('export function fnJqueryPro');
    expect(source).toContain('export function loadScriptPro');
    expect(source).toContain('export function resetDialogBoxPro');
  });

  it('publica o contrato canônico { id, api, install }', () => {
    const index = read('src/features/sei-functions/index.ts');
    expect(index).toContain("id: 'sei-functions'");
    expect(index).toContain("nsKey: 'seiFunctions'");
    expect(index).toContain('install: installSeiFunctionsFeature');
  });
});
