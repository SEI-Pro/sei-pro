import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '../..');

function read(relPath) {
  return readFileSync(join(rootDir, relPath), 'utf8');
}

describe('migration: docs-lote CSS classes stay prefixed', () => {
  it('adds a seipro-prefixed hook to the Docs em Lote dialog wrapper while preserving the shared dialog class', () => {
    const templates = read('src/features/docs-lote/templates.js');

    expect(templates).toContain('id="dialogBoxDocLote"');
    expect(templates).toContain('class="dialogBoxDiv seipro-doclote-dialog"');
  });

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

  it('uses seipro-prefixed classes for analysis text and headings emitted by the wizard', () => {
    const view = read('src/features/docs-lote/view.js');

    expect(view).toContain('seipro-doclote-analysis-text');
    expect(view).toContain('seipro-doclote-field-title');
    expect(view).toContain('id="tipoDocumentoSelect"');
    expect(view).toContain('id=\'fieldList\'');
    expect(view).toContain('id=\'fieldListCSV\'');

    expect(view).not.toMatch(/class="textAnalysis/);
    expect(view).not.toMatch(/`<ul class="textAnalysis/);
    expect(view).not.toMatch(/dFielTitle/);
  });

  it('uses a seipro-prefixed class for the force-name option wrapper', () => {
    const templates = read('src/features/docs-lote/templates.js');

    expect(templates).toContain('seipro-doclote-force-names');
    expect(templates).toContain('id="checkForceNames"');
    expect(templates).toContain('for="checkForceNames"');

    expect(templates).not.toMatch(/divInputForceNames/);
  });

  it('adds a seipro-prefixed hook to the model document selector while preserving its legacy id', () => {
    const templates = read('src/features/docs-lote/templates.js');
    const view = read('src/features/docs-lote/view.js');

    expect(templates).toContain('id="docLoteSelect" class="seipro-doclote-model-select"');
    expect(templates).toContain('for="docLoteSelect"');
    expect(view).toContain("$('#docLoteSelect')");
    expect(view).toContain('getDocsArvore_fillSelect');
  });

  it('adds a seipro-prefixed hook to the standard-text selector while preserving its mutual reset flow', () => {
    const templates = read('src/features/docs-lote/templates.js');
    const view = read('src/features/docs-lote/view.js');

    expect(templates).toContain('id="textoPadraoSelect" class="seipro-doclote-template-select"');
    expect(templates).toContain('for="textoPadraoSelect"');
    expect(view).toContain("$('#textoPadraoSelect')");
    expect(view).toContain("$('#docLoteSelect').val('').trigger('chosen:updated')");
  });

  it('adds a seipro-prefixed hook to the CSV upload input while preserving its file contract', () => {
    const templates = read('src/features/docs-lote/templates.js');
    const view = read('src/features/docs-lote/view.js');

    expect(templates).toContain('id="inputBD" class="seipro-doclote-csv-input" type="file" accept=".csv, text/csv"');
    expect(templates).toContain('for="inputBD"');
    expect(view).toContain("$('#inputBD').on('change'");
    expect(view).toContain("$('#inputBD')[0].files[0]");
  });

  it('adds a seipro-prefixed hook to the model-analysis loader while preserving its legacy id and spinner', () => {
    const view = read('src/features/docs-lote/view.js');

    expect(view).toContain("id='loaderAnalysis' class=\"seipro-doclote-analysis-loader\"");
    expect(view).toContain("if (!$('#loaderAnalysis')[0])");
    expect(view).toContain('fas fa-spinner fa-spin azulColor');
    expect(view).toContain("$('#loaderAnalysis').remove()");
  });

  it('adds a seipro-prefixed hook to the CSV-analysis loader while preserving its legacy id and spinner', () => {
    const view = read('src/features/docs-lote/view.js');

    expect(view).toContain("id='loaderAnalysisCSV' class=\"seipro-doclote-csv-analysis-loader\"");
    expect(view).toContain("if (!$('#loaderAnalysisCSV')[0])");
    expect(view).toContain('fas fa-spinner fa-spin azulColor');
    expect(view).toContain("$('#loaderAnalysisCSV').remove()");
  });

  it('adds a seipro-prefixed hook to the execution loader while preserving its progress contract', () => {
    const templates = read('src/features/docs-lote/templates.js');
    const view = read('src/features/docs-lote/view.js');

    expect(templates).toContain('id="preparingProgressCircular" class="seipro-doclote-execution-loader"');
    expect(templates).toContain('id="preparingProgress"');
    expect(templates).toContain('fas fa-spinner fa-spin azulColor');
    expect(view).toContain("$('#preparingProgressCircular').remove()");
    expect(view).toContain('docsLote_execute(paramData)');
  });

  it('adds a seipro-prefixed hook to the execution progress while preserving its legacy id and updates', () => {
    const templates = read('src/features/docs-lote/templates.js');
    const view = read('src/features/docs-lote/view.js');

    expect(templates).toContain('id="progress" class="seipro-doclote-execution-progress"');
    expect(templates).toContain('id="preparingProgress"');
    expect(view).toContain("$('#progress span').text");
    expect(view).toContain("$('#progress').html");
  });

  it('adds a seipro-prefixed hook to the execution error dialog while preserving its message contract', () => {
    const templates = read('src/features/docs-lote/templates.js');

    expect(templates).toContain('<div class="seipro-doclote-error-dialog">');
    expect(templates).toContain('Eita! Algo deu errado na replicação de documentos');
    expect(templates).toContain('Verifique as configurações selecionadas e tente novamente.');
    expect(templates).toContain('<p>${textError}</p>');
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

  it('uses seipro-prefixed classes for Docs em Lote scroll wrappers while preserving table contracts', () => {
    const templates = read('src/features/docs-lote/templates.js');

    expect(templates).toContain('seipro-doclote-crossing-scroll');
    expect(templates).toContain('id="tableDataCrossing"');
    expect(templates).toContain('seipro-doclote-result-scroll');
    expect(templates).toContain('id="tableDataResult"');
    expect(templates).toContain('class="seiProForm tableInfo tableZebra tableFollow"');
  });

  it('uses a seipro-prefixed class for the result action bar emitted by Docs em Lote', () => {
    const templates = read('src/features/docs-lote/templates.js');

    expect(templates).toContain('seipro-doclote-result-actions');
    expect(templates).toContain('seipro-doclote-download');
    expect(templates).toContain('seipro-doclote-copy');
    expect(templates).toContain('id="tableDataResult"');

    expect(templates).not.toMatch(/class="btn-group filterTablePro/);
  });
});
