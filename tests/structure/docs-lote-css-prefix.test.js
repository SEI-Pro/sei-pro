import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '../..');

function read(relPath) {
  return readFileSync(join(rootDir, relPath), 'utf8');
}

describe('migration: docs-lote CSS classes stay prefixed', () => {
  it('adds a feature hook to the initial document-selection panel while preserving the shared form class', () => {
    const templates = read('src/features/docs-lote/templates.js');

    expect(templates).toContain('class="seiProForm seipro-doclote-selection-panel"');
    expect(templates).toContain('id="dialogBoxDocLote"');
    expect(templates).toContain('class="dialogBoxDiv seipro-doclote-dialog"');
    expect(templates).toContain('id="docLoteSelect" class="seipro-doclote-model-select"');
    expect(templates).toContain('id="textoPadraoSelect" class="seipro-doclote-template-select"');
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

  it('delegates the new-process toggle through a feature hook while preserving its legacy id and execution flow', () => {
    const templates = read('src/features/docs-lote/templates.js');
    const view = read('src/features/docs-lote/view.js');

    expect(templates).toContain('class="onoffswitch-checkbox seipro-doclote-new-process-toggle" id="newProcs"');
    expect(templates).toContain('for="newProcs"');
    expect(view).toContain(".on('change', '.seipro-doclote-new-process-toggle'");
    expect(view).toContain("createNewProcs: $('#newProcs').is(':checked')");
    expect(view).toContain("$('.seipro-doclote-process-type-fields').show()");

    expect(view).not.toMatch(/\.on\('change', '#newProcs'/);
  });

  it('adds a feature hook to the new-process switch wrapper while preserving its shared switch contract', () => {
    const templates = read('src/features/docs-lote/templates.js');

    expect(templates).toContain('class="onoffswitch seipro-doclote-new-process-switch"');
    expect(templates).toContain('class="onoffswitch-checkbox seipro-doclote-new-process-toggle" id="newProcs"');
    expect(templates).toContain('class="onoff-switch-label" for="newProcs"');
  });

  it('delegates the process-type selector through a feature hook while preserving its legacy id and validation flow', () => {
    const templates = read('src/features/docs-lote/templates.js');
    const view = read('src/features/docs-lote/view.js');

    expect(templates).toContain('id="tipoProcessoSelect" class="seipro-doclote-process-type-select"');
    expect(view).toContain(".on('change', '.seipro-doclote-process-type-select'");
    expect(view).toContain("$('#tipoProcessoSelect').chosen");
    expect(view).toContain("idTipoProcedimento: $('#tipoProcessoSelect').val()");
    expect(view).not.toMatch(/\.on\('change', '#tipoProcessoSelect'/);
  });

  it('delegates the model document-type selector through a feature hook while preserving the analysis flow', () => {
    const view = read('src/features/docs-lote/view.js');

    expect(view).toContain('id="tipoDocumentoSelect" class="seipro-doclote-document-type-select"');
    expect(view).toContain(".on('change', '.seipro-doclote-document-type-select'");
    expect(view).toContain("const id_tipo_documento = $('#tipoDocumentoSelect').val()");
    expect(view).toContain('S.selectedModel.id_tipo_documento = id_tipo_documento');
    expect(view).toContain("$('#btnConfirmAnalysis').prop('disabled', false)");

    expect(view).not.toMatch(/\$\('#tipoDocumentoSelect'\)\.on\('change'/);
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

  it('uses a seipro-prefixed class for both force-name option wrappers', () => {
    const templates = read('src/features/docs-lote/templates.js');

    expect(templates.match(/class="seipro-doclote-force-names"/g)).toHaveLength(2);
    expect(templates).toContain('id="checkForceNames"');
    expect(templates).toContain('for="checkForceNames"');

    expect(templates).not.toMatch(/divInputForceNames/);
  });

  it('adds a feature hook to the force-names toggle while preserving its execution contract', () => {
    const templates = read('src/features/docs-lote/templates.js');
    const view = read('src/features/docs-lote/view.js');

    expect(templates).toContain('class="onoffswitch-checkbox seipro-doclote-force-names-toggle" id="checkForceNames"');
    expect(templates).toContain('name="onoffswitch"');
    expect(templates).toContain('data-type="setdate"');
    expect(templates).toContain('for="checkForceNames"');
    expect(view).toContain("forceNames: $('#checkForceNames').is(':checked')");
  });

  it('adds a seipro-prefixed hook to the model document selector while preserving its legacy id', () => {
    const templates = read('src/features/docs-lote/templates.js');
    const view = read('src/features/docs-lote/view.js');

    expect(templates).toContain('id="docLoteSelect" class="seipro-doclote-model-select"');
    expect(templates).toContain('for="docLoteSelect"');
    expect(view).toContain("$('#docLoteSelect')");
    expect(view).toContain('getDocsArvore_fillSelect');
  });

  it('delegates model-document changes through the feature hook while preserving the selection flow', () => {
    const view = read('src/features/docs-lote/view.js');

    expect(view).toContain(".on('change', '.seipro-doclote-model-select'");
    expect(view).toContain("$('#textoPadraoSelect').val('').trigger('chosen:updated')");
    expect(view).toContain("$('#btnSelecaoDoc').prop('disabled', false)");

    expect(view).not.toMatch(/\$\('#docLoteSelect'\)\s*\.on\('change'/);
  });

  it('adds a seipro-prefixed hook to the standard-text selector while preserving its mutual reset flow', () => {
    const templates = read('src/features/docs-lote/templates.js');
    const view = read('src/features/docs-lote/view.js');

    expect(templates).toContain('id="textoPadraoSelect" class="seipro-doclote-template-select"');
    expect(templates).toContain('for="textoPadraoSelect"');
    expect(view).toContain("$('#textoPadraoSelect')");
    expect(view).toContain("$('#docLoteSelect').val('').trigger('chosen:updated')");
  });

  it('delegates standard-text changes through the feature hook while preserving the model reset flow', () => {
    const view = read('src/features/docs-lote/view.js');

    expect(view).toContain(".on('change', '.seipro-doclote-template-select'");
    expect(view).toContain("$('#docLoteSelect').val('').trigger('chosen:updated')");
    expect(view).toContain("$('#btnSelecaoDoc').prop('disabled', false)");

    expect(view).not.toMatch(/\$\('#textoPadraoSelect'\)\s*\.on\('change'/);
  });

  it('adds a seipro-prefixed hook to the CSV upload input while preserving its file contract', () => {
    const templates = read('src/features/docs-lote/templates.js');
    const view = read('src/features/docs-lote/view.js');

    expect(templates).toContain('id="inputBD" class="seipro-doclote-csv-input" type="file" accept=".csv, text/csv"');
    expect(templates).toContain('for="inputBD"');
    expect(view).toContain(".on('change.docsLoteEncoding', '.seipro-doclote-csv-input'");
    expect(view).toContain(".on('change.docsLoteAdvance', '.seipro-doclote-csv-input'");
    expect(view).toContain("$('#inputBD')[0].files[0]");
    expect(view).toContain('jschardet.detect(csvResult.toString()).encoding.toLowerCase()');

    expect(view).not.toMatch(/\$\('#inputBD'\)\.change\(/);
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

  it('adds feature hooks to the analysis-stage titles while preserving their text', () => {
    const templates = read('src/features/docs-lote/templates.js');

    expect(templates).toContain('class="seipro-doclote-analysis-title">Análise do documento modelo:</p>');
    expect(templates).toContain('class="seipro-doclote-analysis-csv-title">Análise da base de dados:</p>');
    expect(templates).not.toContain('<p>Análise do documento modelo:</p>');
    expect(templates).not.toContain('<p>Análise da base de dados:</p>');
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
    expect(templates).toContain('class="seiProForm tableInfo tableZebra tableFollow seipro-doclote-result-table"');
  });

  it('adds a seipro-prefixed hook to the data-crossing panel while preserving its legacy id', () => {
    const templates = read('src/features/docs-lote/templates.js');

    expect(templates).toContain('id="divTableDataCrossing" class="seipro-doclote-crossing-panel"');
    expect(templates).toContain('id="tableDataCrossing"');
    expect(templates).toContain('id="newProcs"');
  });

  it('uses a seipro-prefixed class for the result action bar emitted by Docs em Lote', () => {
    const templates = read('src/features/docs-lote/templates.js');

    expect(templates).toContain('seipro-doclote-result-actions');
    expect(templates).toContain('seipro-doclote-download');
    expect(templates).toContain('seipro-doclote-copy');
    expect(templates).toContain('id="tableDataResult"');

    expect(templates).not.toMatch(/class="btn-group filterTablePro/);
  });

  it('adds a feature hook to the process-specification input while preserving its execution contract', () => {
    const templates = read('src/features/docs-lote/templates.js');
    const view = read('src/features/docs-lote/view.js');

    expect(templates).toContain('class="infraText seipro-doclote-process-specification-input" id="txtEspecificacaoProcesso"');
    expect(templates).toContain('placeholder="Ex: Certificado de ##nome_aluno##"');
    expect(view).toContain("txtEspecificacaoProcesso: $('#txtEspecificacaoProcesso').val()");
  });

  it('adds a feature hook to both document-name selectors while preserving their chosen flow', () => {
    const templates = read('src/features/docs-lote/templates.js');
    const view = read('src/features/docs-lote/view.js');

    expect(templates.match(/id="nomesDoc" class="seipro-doclote-document-name-select"/g)).toHaveLength(2);
    expect(templates).toContain('${selectData}</select>');
    expect(view).toContain("$('#nomesDoc').chosen");
    expect(view).toContain("placeholder_text_single: ' '");
  });

  it('adds a feature hook to the CSV-selection panel while preserving its shared form class', () => {
    const templates = read('src/features/docs-lote/templates.js');

    expect(templates).toContain('class="seiProForm seipro-doclote-csv-selection-panel"');
    expect(templates).toContain('id="inputBD" class="seipro-doclote-csv-input"');
    expect(templates).toContain('accept=".csv, text/csv"');
  });

  it('adds a feature hook to the Docs em Lote credit while preserving its attribution link', () => {
    const templates = read('src/features/docs-lote/templates.js');

    expect(templates).toContain('class="seipro-doclote-credit"');
    expect(templates).toContain('href="https://github.com/tcgontijo" target="_blank"');
    expect(templates).toContain('Código-fonte gentilmente cedido por');
    expect(templates).toContain('PluriDocs SEI!');
  });

  it('adds a feature hook to the crossing-panel introduction while preserving its text', () => {
    const templates = read('src/features/docs-lote/templates.js');

    expect(templates).toContain('class="seipro-doclote-crossing-intro">Segue abaixo o relacionamento entre cabeçalhos da base de dados e os campos dinâmicos do documento modelo:</p>');
  });

  it('adds a feature hook to the execution cancel action while preserving its legacy id and abort flow', () => {
    const view = read('src/features/docs-lote/view.js');

    expect(view).toContain("id: 'cancelExecute'");
    expect(view).toContain("class: 'seipro-doclote-cancel-execution'");
    expect(view).toContain('docsLote_abortAjax()');
    expect(view).toContain("$('#cancelExecute').hide()");
  });

  it('adds a feature hook to the execution completion message while preserving its text and result flow', () => {
    const view = read('src/features/docs-lote/view.js');

    expect(view).toContain('seipro-doclote-execution-complete');
    expect(view).toContain('Progresso finalizado! 👏');
    expect(view).toContain("$('#progress').html");
    expect(view).toContain('${tableResult}');
  });

  it('adds a feature hook to the execution error confirmation action while preserving its reset flow', () => {
    const view = read('src/features/docs-lote/view.js');

    expect(view).toContain("class: 'ui-state-active seipro-doclote-error-confirm'");
    expect(view).toContain("text: 'OK'");
    expect(view).toContain("resetDialogBoxPro('dialogBoxPro')");
  });

  it('adds feature hooks to generated document links while preserving the legacy link contract', () => {
    const view = read('src/features/docs-lote/view.js');

    expect(view).toContain('class="bLink seipro-doclote-generated-document-link"');
    expect(view).toContain('target="_blank"');
    expect(view).toContain('${v.url_doc || \'\'}');
  });
});
