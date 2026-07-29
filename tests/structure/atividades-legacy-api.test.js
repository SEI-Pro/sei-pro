import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const rootDir = process.cwd();
const read = (relPath) => readFileSync(join(rootDir, relPath), 'utf8');

describe('migration: atividades full ESM facade', () => {
  it('instala a ponte dedicada no entry e aliasa o body migrado', () => {
    const index = read('src/features/atividades/index.js');
    const bridge = read('src/features/atividades/legacy-api.js');

    expect(index).toContain("import { installAtividadesLegacyApi } from './legacy-api.js';");
    expect(index).toContain('installAtividadesLegacyApi();');
    expect(index).toContain("import { initPerfilLoginAtiv, checkHostPermission } from './body.js';");
    expect(index).toContain("import { getName, getNameGenre } from '../../shared/nomenclatura.js';");
    expect(bridge).toContain("import { aliasGlobal } from '../../core/global.js';");
    expect(bridge).toContain("import * as domain from './domain.js';");
    expect(bridge).toContain("import * as body from './body.js';");
    expect(bridge).toContain("import * as nomenclatura from '../../shared/nomenclatura.js';");
  });

  it('não mantém o monolito sei-pro-atividades.js em src/', () => {
    expect(existsSync(join(rootDir, 'src/features/atividades/sei-pro-atividades.js'))).toBe(false);
    expect(existsSync(join(rootDir, 'src/features/atividades/body.js'))).toBe(true);
    expect(existsSync(join(rootDir, 'src/features/atividades/state.js'))).toBe(true);
    expect(existsSync(join(rootDir, 'src/features/atividades/templates.js'))).toBe(true);
    expect(existsSync(join(rootDir, 'src/features/atividades/style.css'))).toBe(true);
    expect(existsSync(join(rootDir, 'src/features/atividades/domain.js'))).toBe(true);
    expect(existsSync(join(rootDir, 'src/shared/nomenclatura.js'))).toBe(true);
  });

  it('empacota a feature como dist/js/sei-pro-atividades.js sem cópia verbatim', () => {
    const build = read('scripts/build.mjs');
    expect(build).toContain("{ entry: 'src/features/atividades/index.js', out: 'dist/js/sei-pro-atividades.js' }");
    expect(build).not.toContain("'src/features/atividades/sei-pro-atividades.js'");
    expect(build).toContain('src/features/atividades/style.css');
  });

  it('preserva o wire no manifest e os call-sites do body', () => {
    const manifest = JSON.parse(read('manifest.base.json'));
    const contexts = manifest.content_scripts.filter(({ js = [] }) =>
      js.includes('js/sei-pro-atividades.js')
    );
    expect(contexts.length).toBeGreaterThanOrEqual(2);
    for (const context of contexts) {
      if ((context.css || []).length) {
        expect(context.css).toContain('css/atividades.css');
      }
    }

    const war = (manifest.web_accessible_resources || []).flatMap((entry) => entry.resources || []);
    expect(war).toContain('css/atividades.css');

    const body = read('src/features/atividades/body.js');
    expect(body).toContain('export function initAtividades');
    expect(body).toContain('export function initPerfilLoginAtiv');
    expect(body).toContain('export function checkHostPermission');
    expect(body).toContain('export function getAppsScriptUrlAtiv');
    expect(body).toContain('from \'./domain.js\'');
    expect(body).toContain('from \'../../shared/nomenclatura.js\'');
  });
});
