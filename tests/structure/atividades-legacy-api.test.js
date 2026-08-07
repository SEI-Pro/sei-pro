import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const rootDir = process.cwd();
const read = (relPath) => readFileSync(join(rootDir, relPath), 'utf8');

describe('migration: atividades full ESM facade', () => {
  it('instala a ponte dedicada e compõe todas as fatias migradas', () => {
    const index = read('src/features/atividades/index.ts');
    const bridge = read('src/features/atividades/legacy-api.ts');
    const modules = read('src/features/atividades/modules.ts');

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
    expect(read('src/features/atividades/call.ts')).toContain('export function callAtiv');
    expect(read('src/features/atividades/call.ts')).toContain('export function hasAtiv');
    expect(read('src/features/atividades/panel.ts')).toContain("callAtiv('checkCapacidade'");
    expect(read('src/features/atividades/view.ts')).toContain('export function installAtividadesView');
    expect(read('src/features/atividades/view.ts')).toContain('resolveAtividadesHandler');
    expect(read('src/features/atividades/handlers.ts')).toContain('export const atividadesHandlers');
    expect(read('src/features/atividades/server.ts')).toContain("from './io.js'");
    expect(read('src/features/atividades/server.ts')).toContain('postAtividadesServer');
    expect(read('src/features/atividades/panel.ts')).toContain('data-act="atividades-panel-view"');
    expect(read('src/features/atividades/panel.ts')).toContain('seipro-atividades-root');
    expect(read('src/features/atividades/view.ts')).toContain("act === 'atividades-call'");
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
      'boot.ts', 'config-panel.ts', 'config-options.ts', 'config-table.ts',
      'reports-detail.ts', 'activity-work.ts', 'charts.ts', 'activity-actions.ts',
      'kanban.ts', 'reports-panel.ts', 'afastamentos.ts', 'activity-form.ts', 'ratings.ts', 'panel.ts'
    ];
    for (const file of needImport) {
      const src = read(`src/features/atividades/${file}`);
      expect(src, file).toContain("import { getServerAtividades } from './server.js'");
    }
    const server = read('src/features/atividades/server.ts');
    for (const file of needImport) {
      const mod = file.replace(/\.(js|ts)$/, '');
      expect(server).not.toContain(`from './${mod}.js'`);
    }
  });

  it('não emite handlers HTML inline de ação nas fatias de atividades', () => {
    const dir = join(rootDir, 'src/features/atividades');
    for (const file of readdirSync(dir).filter((f) => f.match(/\.(js|ts)$/))) {
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
      'runtime.ts', 'compat.ts', 'server.ts', 'data.ts', 'charts.ts', 'panel.ts',
      'reports-panel.ts', 'config-panel.ts', 'config-table.ts', 'config-options.ts',
      'reports-detail.ts', 'afastamentos.ts', 'kanban.ts', 'activity-work.ts',
      'activity-actions.ts', 'activity-form.ts', 'ratings.ts', 'boot.ts', 'modules.ts'
    ]) {
      expect(existsSync(join(rootDir, 'src/features/atividades', file))).toBe(true);
    }
    expect(existsSync(join(rootDir, 'src/features/atividades/state.ts'))).toBe(true);
    expect(existsSync(join(rootDir, 'src/features/atividades/templates.ts'))).toBe(true);
    expect(existsSync(join(rootDir, 'src/features/atividades/style.css'))).toBe(true);
    expect(existsSync(join(rootDir, 'src/features/atividades/domain.ts'))).toBe(true);
    expect(existsSync(join(rootDir, 'src/shared/nomenclatura.ts'))).toBe(true);
  });

  it('empacota a feature como dist/js/sei-pro-atividades.js sem cópia verbatim', () => {
    const build = read('scripts/build.mjs');
    expect(build).toContain("{ entry: 'src/entries/atividades.ts', out: 'dist/js/sei-pro-atividades.js' }");
    expect(read('src/entries/atividades.ts')).toContain('installAtividadesFeature();');
    expect(read('src/features/atividades/index.ts')).not.toMatch(/\ninstallAtividadesFeature\(\);\s*$/);
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

    const boot = read('src/features/atividades/boot.ts');
    const compat = read('src/features/atividades/compat.ts');
    const runtime = read('src/features/atividades/runtime.ts');
    expect(boot).toContain('export function initAtividades');
    expect(boot).toContain('export function initPerfilLoginAtiv');
    expect(boot).toContain('export function checkHostPermission');
    expect(compat).toContain('export function getAppsScriptUrlAtiv');
    expect(compat).toContain("from './domain.js'");
    expect(compat).toContain("from '../../shared/nomenclatura.js'");
    expect(runtime).toContain('export function initializeAtividadesRuntime');
  });
});
