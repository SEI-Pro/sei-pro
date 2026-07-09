import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '../..');

function read(relPath) {
  return readFileSync(join(rootDir, relPath), 'utf8');
}

describe('migration: docs-lote CSS classes stay prefixed', () => {
  it('uses a seipro-prefixed class for the new-process type rows', () => {
    const templates = read('src/features/docs-lote/templates.js');
    const view = read('src/features/docs-lote/view.js');

    expect(templates).toContain('seipro-doclote-process-type-fields');
    expect(view).toContain('.seipro-doclote-process-type-fields');
    expect(templates).toContain('id="newProcs"');
    expect(templates).toContain('id="tipoProcessoSelect"');
    expect(templates).toContain('id="txtEspecificacaoProcesso"');

    expect(templates).not.toMatch(/containerTipoProcessoSelect/);
    expect(view).not.toMatch(/containerTipoProcessoSelect/);
  });

  it('uses a seipro-prefixed class for analysis text emitted by the wizard', () => {
    const view = read('src/features/docs-lote/view.js');

    expect(view).toContain('seipro-doclote-analysis-text');
    expect(view).toContain('id="tipoDocumentoSelect"');
    expect(view).toContain('id=\'fieldList\'');
    expect(view).toContain('id=\'fieldListCSV\'');

    expect(view).not.toMatch(/class="textAnalysis/);
    expect(view).not.toMatch(/`<ul class="textAnalysis/);
  });

  it('uses a seipro-prefixed class for the force-name option wrapper', () => {
    const templates = read('src/features/docs-lote/templates.js');

    expect(templates).toContain('seipro-doclote-force-names');
    expect(templates).toContain('id="checkForceNames"');
    expect(templates).toContain('for="checkForceNames"');

    expect(templates).not.toMatch(/divInputForceNames/);
  });

  it('uses a seipro-prefixed class for Docs em Lote field validation messages', () => {
    const view = read('src/features/docs-lote/view.js');
    const legacy = read('src/shared/legacy/sei-functions-pro.js');

    expect(view).toContain('seipro-doclote-field-error');
    expect(view).toContain('Arquivo inválido! Selecione um documento no formato "CSV".');
    expect(view).toContain('Não existe correspondência no arquivo CSV informado!');

    expect(view).not.toMatch(/class="noFieldsError/);
    expect(legacy).toContain('noFieldsError');
  });
});
