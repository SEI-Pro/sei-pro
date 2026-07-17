import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const rootDir = process.cwd();
const read = (relPath) => readFileSync(join(rootDir, relPath), 'utf8');

describe('migration: datas legacy api', () => {
  it('installs one compatibility alias before the legacy script', () => {
    const stack = read('src/content/core-stack.js');
    const bridge = read('src/shared/legacy/datas-legacy-api.js');

    expect(stack).toContain("import { installDatasLegacyApi } from '../shared/legacy/datas-legacy-api.js';");
    expect(stack).toContain('installCoreStack();\ninstallDatasLegacyApi();');
    expect(bridge).toContain("import { aliasGlobal, globalRef } from '../../core/global.js';");
    expect(bridge).toContain("aliasGlobal('getDataRecebimentoPro', getDataRecebimentoProLegacy);");
  });

  it('removes the duplicate implementation from sei-functions-pro', () => {
    const legacy = read('src/shared/legacy/sei-functions-pro.js');
    const bridge = read('src/shared/legacy/datas-legacy-api.js');
    const view = read('src/shared/legacy/datas-view.js');

    expect(legacy).not.toMatch(/function\s+getDataRecebimentoPro\s*\(/);
    expect(legacy).toContain('getDataRecebimentoPro is provided by shared/legacy/datas-legacy-api.js');
    expect(bridge).toMatch(/export function getDataRecebimentoProLegacy\s*\(/);
    expect(bridge).toContain('recordDataRecebimento(listAndamento');
    expect(view).toMatch(/export function recordDataRecebimento\s*\(/);
  });

  it('preserves the historical wrapper arguments and storage boundary', () => {
    const bridge = read('src/shared/legacy/datas-legacy-api.js');

    expect(bridge).toContain('listAndamento, listProc = false, acompanhamentoEsp = \'\'');
    expect(bridge).toContain('unidadeAtual: globalRef.siglaUnidadeAtual || \'\'');
    expect(bridge).toContain('restore: globalRef.localStorageRestorePro');
    expect(bridge).toContain('store: globalRef.localStorageStorePro');
    expect(bridge).toContain('isEmptyObject: $ && $.isEmptyObject');
  });
});
