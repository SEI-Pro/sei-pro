import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const rootDir = process.cwd();
const read = (relPath) => readFileSync(join(rootDir, relPath), 'utf8');

describe('migration: sei-functions full ESM facade', () => {
  it('instala a ponte dedicada no entry e aliasa o body migrado', () => {
    const index = read('src/features/sei-functions/index.js');
    const bridge = read('src/features/sei-functions/legacy-api.js');

    expect(index).toContain("import { installSeiFunctionsLegacyApi } from './legacy-api.js';");
    expect(index).toContain('installSeiFunctionsLegacyApi();');
    expect(index).toContain("import { fnJqueryPro } from './body.js';");
    expect(bridge).toContain("import { aliasGlobal } from '../../core/global.js';");
    expect(bridge).toContain("import * as body from './body.js';");
  });

  it('não mantém o monolito global em shared/legacy/', () => {
    expect(existsSync(join(rootDir, 'src/shared/legacy/sei-functions-pro.js'))).toBe(false);
    expect(existsSync(join(rootDir, 'src/features/sei-functions/body.js'))).toBe(true);
    expect(existsSync(join(rootDir, 'src/features/sei-functions/state.js'))).toBe(true);
    expect(existsSync(join(rootDir, 'src/features/sei-functions/templates.js'))).toBe(true);
    expect(existsSync(join(rootDir, 'src/features/sei-functions/style.css'))).toBe(true);
  });

  it('empacota a feature como dist/js/sei-functions-pro.js sem cópia verbatim', () => {
    const build = read('scripts/build.mjs');
    expect(build).toContain("{ entry: 'src/features/sei-functions/index.js', out: 'dist/js/sei-functions-pro.js' }");
    expect(build).not.toContain("'src/shared/legacy/sei-functions-pro.js'");
    expect(build).toContain('src/features/sei-functions/style.css');
  });

  it('preserva o wire no manifest e os call-sites do body', () => {
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

    const body = read('src/features/sei-functions/body.js');
    expect(body).toContain('export function fnJqueryPro');
    expect(body).toContain('export function loadScriptPro');
    expect(body).toContain('export function resetDialogBoxPro');
  });
});
