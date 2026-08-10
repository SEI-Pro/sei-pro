import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { readSeiFunctionsSource } from '../helpers/read-sei-functions.js';

const rootDir = process.cwd();
const read = (relPath) => readFileSync(join(rootDir, relPath), 'utf8');

const CAPABILITIES = [
  'acoes-capa',
  'editor-captcha',
  'dialogs-host',
  'interessados-forms',
  'cores-marcadores',
  'midia-documentos',
  'notificacoes-processo',
  'historico-processos',
  'chrome-ui',
  'tabelas-arquivos',
  'menus-rapidos',
  'url-amigavel'
];

describe('migration: dissolução de sei-functions por capacidade', () => {
  it('remove o agregado e não cria um barrel equivalente', () => {
    expect(existsSync(join(rootDir, 'src/features/sei-functions'))).toBe(false);
    expect(existsSync(join(rootDir, 'src/shared/sei-runtime/deps.ts'))).toBe(true);
    expect(read('src/shared/sei-runtime/deps.ts')).not.toContain("from './modules.js'");
  });

  it('cada cluster tem fronteira nomeada e descritor', () => {
    for (const id of CAPABILITIES) {
      expect(existsSync(join(rootDir, 'src/features', id, 'feature.ts')), id).toBe(true);
      expect(existsSync(join(rootDir, 'src/features', id, 'index.ts')), id).toBe(true);
      const descriptor = read(`src/features/${id}/feature.ts`);
      expect(descriptor).toContain(`id: '${id}'`);
      expect(descriptor).toMatch(/maturity:\s*'wired'/);
      expect(descriptor).toMatch(/install:/);
      expect(descriptor).toMatch(/api:/);
    }
  });

  it('a raiz transversal é a única composição ampla e não auto-carrega clusters', () => {
    const entry = read('src/entries/legacy-context.ts');
    for (const installer of [
      'installDialogsHost',
      'installHistoricoProcessos',
      'installCoresMarcadores',
      'installMenusRapidos',
      'installChromeUi',
      'installTabelasArquivos',
      'installAcoesCapa',
      'installInteressadosForms',
      'installMidiaDocumentos',
      'installNotificacoesProcesso',
      'installEditorCaptcha',
      'installUrlAmigavel'
    ]) {
      expect(entry).toContain(installer);
    }
    expect(entry).toContain('runInstallersSafely');
    expect(entry).toContain('installRuntime || installSeiRuntime');
    expect(entry).toContain('startRuntime || startSeiRuntime');
    expect(entry).toContain('bootLegacyContext();');
    expect(read('src/shared/sei-runtime/boot.ts')).not.toMatch(/\nloadScriptPro\(\);\s*$/);
    expect(read('scripts/build.mjs')).not.toContain('src/entries/sei-functions.ts');
  });

  it('preserva a superfície pública dos clusters e o wire gerado', () => {
    const source = readSeiFunctionsSource();
    expect(source).toContain('export function fnJqueryPro');
    expect(source).toContain('export function loadScriptPro');
    expect(source).toContain('export function resetDialogBoxPro');

    const manifest = JSON.parse(read('manifest.base.json'));
    const contexts = manifest.content_scripts.filter(({ js = [] }) => js.includes('js/legacy-context.bundle.js'));
    expect(contexts.length).toBeGreaterThanOrEqual(7);
    for (const context of contexts) {
      expect(context.css || []).toContain('css/legacy-sei.css');
      expect(context.js).not.toContain('js/sei-functions-pro.js');
    }
  });
});
