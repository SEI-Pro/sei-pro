import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const rootDir = process.cwd();
const read = (relPath) => readFileSync(join(rootDir, relPath), 'utf8');

describe('migration: atividades full ESM facade', () => {
  it('instala a ponte dedicada e compõe todas as fatias migradas', () => {
    const index = read('src/features/atividades/index.js');
    const bridge = read('src/features/atividades/legacy-api.js');
    const modules = read('src/features/atividades/modules.js');

    expect(index).toContain("import { installAtividadesLegacyApi } from './legacy-api.js';");
    expect(index).toContain('installAtividadesLegacyApi();');
    expect(index).toContain("import { initializeAtividadesRuntime } from './runtime.js';");
    expect(index).toContain("import { installAtividadesView } from './view.js';");
    expect(index).toContain("import { initPerfilLoginAtiv, checkHostPermission } from './boot.js';");
    expect(index).toContain('initializeAtividadesRuntime();');
    expect(index).toContain('installAtividadesView();');
    expect(index).toContain("import { getName, getNameGenre } from '../../shared/nomenclatura.js';");
    expect(bridge).toContain("import { aliasGlobal } from '../../core/global.js';");
    expect(bridge).toContain("import * as nomenclatura from '../../shared/nomenclatura.js';");
    expect(bridge).toContain("import { atividadesHandlers } from './handlers.js';");
    expect(bridge).toContain('export const atividadesLegacyApi');
    expect(bridge).toContain('export const ATIVIDADES_EXTERNAL_GLOBALS');
    expect(bridge).toContain("'getServerAtividades'");
    expect(bridge).toContain("'checkCapacidade'");
    expect(bridge).toContain("'saveAtividade'");
    expect(bridge).toMatch(/TODO:\s*remover installAtividadesLegacyApi/);
    expect(bridge).toContain('ATIVIDADES_EXTERNAL_GLOBALS');
    expect(bridge).toContain('callAtiv()');
    expect(bridge).not.toContain('aliasMap(atividadesHandlers');
    expect(read('src/features/atividades/call.js')).toContain('export function callAtiv');
    expect(read('src/features/atividades/call.js')).toContain('export function hasAtiv');
    expect(read('src/features/atividades/panel.js')).toContain("callAtiv('checkCapacidade'");
    expect(read('src/features/atividades/view.js')).toContain('export function installAtividadesView');
    expect(read('src/features/atividades/view.js')).toContain('resolveAtividadesHandler');
    expect(read('src/features/atividades/handlers.js')).toContain('export const atividadesHandlers');
    expect(read('src/features/atividades/server.js')).toContain("from './io.js'");
    expect(read('src/features/atividades/server.js')).toContain('postAtividadesServer');
    expect(read('src/features/atividades/panel.js')).toContain('data-act="atividades-panel-view"');
    expect(read('src/features/atividades/panel.js')).toContain('seipro-atividades-root');
    expect(read('src/features/atividades/view.js')).toContain("act === 'atividades-call'");
    expect(index).toContain('legacyRequest: getServerAtividades');
    expect(index).toContain('namespace.features.atividades =');
    expect(index).toContain('api: featureApi');
    expect(index).not.toContain('...atividadesHandlers');
    expect(index).not.toContain('saveAtividade: atividadesHandlers');
    expect(modules).toContain("import * as server from './server.js';");
    expect(modules).toContain("import * as serverResponse from './server-response.js';");
    expect(modules).toContain("import * as application from './application.js';");
    expect(modules).toContain("import * as ports from './ports.js';");
    expect(modules).toContain("import * as handlers from './handlers.js';");
    expect(modules).toContain("import * as configOptions from './config-options.js';");
    expect(modules).toContain("import * as activityActions from './activity-actions.js';");
  });

  it('fatias de atividades importam getServerAtividades de server.js', () => {
    const needImport = [
      'boot.js', 'config-panel.js', 'config-options.js', 'config-table.js',
      'reports-detail.js', 'activity-work.js', 'charts.js', 'activity-actions.js',
      'kanban.js', 'reports-panel.js', 'afastamentos.js', 'activity-form.js', 'ratings.js', 'panel.js'
    ];
    for (const file of needImport) {
      const src = read(`src/features/atividades/${file}`);
      expect(src, file).toContain("import { getServerAtividades } from './server.js'");
    }
    const server = read('src/features/atividades/server.js');
    for (const file of needImport) {
      const mod = file.replace(/\.js$/, '');
      expect(server).not.toContain(`from './${mod}.js'`);
    }
  });

  it('não emite handlers HTML inline de ação nas fatias de atividades', () => {
    const dir = join(rootDir, 'src/features/atividades');
    for (const file of readdirSync(dir).filter((f) => f.endsWith('.js'))) {
      const src = read(`src/features/atividades/${file}`);
      expect(src, file).not.toMatch(/\bonclick\s*=\s*["']/);
      expect(src, file).not.toMatch(/\bonchange\s*=\s*["']/);
      expect(src, file).not.toMatch(/\bonkeypress\s*=\s*["']/);
      expect(src, file).not.toMatch(/\bonblur\s*=\s*["']/);
      expect(src, file).not.toMatch(/\bonkeyup\s*=\s*["']/);
      expect(src, file).not.toMatch(/\boninput\s*=\s*["']/);
      expect(src, file).not.toMatch(/\bonmouseover\s*=\s*["']/);
      expect(src, file).not.toMatch(/\bonmouseout\s*=\s*["']/);
      expect(src, file).not.toMatch(/\bonmouseenter\s*=\s*["']/);
      expect(src, file).not.toMatch(/\.attr\(\s*['"]onclick['"]/);
    }
  });

  it('não mantém nenhum monólito legado em src/', () => {
    expect(existsSync(join(rootDir, 'src/features/atividades/sei-pro-atividades.js'))).toBe(false);
    expect(existsSync(join(rootDir, 'src/features/atividades/body.js'))).toBe(false);
    for (const file of [
      'runtime.js', 'compat.js', 'server.js', 'data.js', 'charts.js', 'panel.js',
      'reports-panel.js', 'config-panel.js', 'config-table.js', 'config-options.js',
      'reports-detail.js', 'afastamentos.js', 'kanban.js', 'activity-work.js',
      'activity-actions.js', 'activity-form.js', 'ratings.js', 'boot.js', 'modules.js'
    ]) {
      expect(existsSync(join(rootDir, 'src/features/atividades', file))).toBe(true);
    }
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

  it('preserva o wire no manifest e os call-sites públicos', () => {
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

    const boot = read('src/features/atividades/boot.js');
    const compat = read('src/features/atividades/compat.js');
    const runtime = read('src/features/atividades/runtime.js');
    expect(boot).toContain('export function initAtividades');
    expect(boot).toContain('export function initPerfilLoginAtiv');
    expect(boot).toContain('export function checkHostPermission');
    expect(compat).toContain('export function getAppsScriptUrlAtiv');
    expect(compat).toContain("from './domain.js'");
    expect(compat).toContain("from '../../shared/nomenclatura.js'");
    expect(runtime).toContain('export function initializeAtividadesRuntime');
  });
});
