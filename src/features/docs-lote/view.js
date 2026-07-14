// docs-lote / view — diálogos do wizard (jQuery UI, mantido na transição), renderers
// de análise, orquestrador de execução e DELEGAÇÃO de eventos (sem onclick/onchange
// inline nossos — esses não rodariam no mundo isolado). HTML/markup pertencem a esta
// camada; rede vem do io; lógica pura do domain.
//
// `dialogBoxPro` é global EXTERNO (definido/lido por sei-functions-pro e outros) e é
// REATRIBUÍDO aqui — em bundle ESM (strict) precisa ser `window.dialogBoxPro`.

import { S, helpPageUrl } from './state.js';
import * as io from './io.js';
import * as tpl from './templates.js';

// Barra de progresso textual (█ x n + ▒ x (6-n)) — igual ao legado.
const setProgress = (n) => { $('#progress span').text('█'.repeat(n) + '▒'.repeat(6 - n)); };

// ---------- delegação (instalada uma vez) — substitui os onchange/onclick inline ----------
// Guard em window (não em módulo): o bundle pode ser executado mais de uma vez (manifest
// + $.getScript do init.js); um guard de módulo reiniciaria a cada execução e duplicaria
// os handlers delegados.
export function installDocsLoteDelegation() {
    if (window.__SEI_PRO_DOCLOTE_DELEGATION__) return;
    window.__SEI_PRO_DOCLOTE_DELEGATION__ = true;
    // Antes: onchange="changeNewProcs(this)" no #newProcs.
    $(document).on('change', '.seipro-doclote-new-process-toggle', function () { changeNewProcs(this); });
    // Antes: onchange="checkTipoProcessoSelect()" no controle de tipo de processo.
    $(document).on('change', '.seipro-doclote-process-type-select', function () { checkTipoProcessoSelect(); });
    // Antes: onclick="downloadTablePro(this)" / "copyTablePro(this)" na tabela de resultado.
    $(document).on('click', '.seipro-doclote-download', function () {
        if (typeof downloadTablePro === 'function') downloadTablePro(this);
    });
    $(document).on('click', '.seipro-doclote-copy', function () {
        if (typeof copyTablePro === 'function') copyTablePro(this);
    });
}

// ---------- carregamento dos selects de documento da árvore (global legado) ----------
export function docsLote_getDocsArvore(optionBlank = false, disableId = false) {
    getDocsArvore(
        $('#docLoteSelect'),
        function (select, optionBlank, disableId) { getDocsArvore_fillSelect(select, optionBlank, disableId); },
        function () {},
        optionBlank,
        disableId
    );
}

// ---------- análise do documento modelo / texto padrão ----------
async function docsLote_docAnalysis(protocolo, nrTxtPadrao) {
    $('#fieldList').remove();
    S.dynamicFields = [];

    if (!$('#loaderAnalysis')[0]) {
        $('#dialogBoxDocLote').append(`<div id='loaderAnalysis' class="seipro-doclote-analysis-loader" style='height: 40px; text-align: center; display: block;'><i class="fas fa-spinner fa-spin azulColor" style="scale:3;"></i></div>`);
        $('#btnConfirmAnalysis').prop('disabled', true).addClass('ui-button-disabled ui-state-disabled');
    }

    const selectedDoc = protocolo ? dataDocs.find((doc) => doc.id_documento.toString() === protocolo.toString()) : false;
    const selectedTxtPadrao = nrTxtPadrao ? S.listTxtPadraoDoc.find((txtPadrao) => txtPadrao.id.toString() === nrTxtPadrao.toString()) : false;

    if (selectedTxtPadrao) {
        $.get(selectedTxtPadrao.view).done((contentTxtPadrao) => {
            selectedTxtPadrao.nome = selectedTxtPadrao.name;
            selectedTxtPadrao.numero = selectedTxtPadrao.id;
            const body = $(contentTxtPadrao).find('#txaConteudo').text();
            const matches = Array.from(new Set(body.match(/##.+?##/gm)));
            docsLote_fillModelAnalysis(matches, selectedTxtPadrao, true);
        }).then(() => { $('#loaderAnalysis').remove(); });
    } else {
        $.get(selectedDoc.src).done((contentDoc) => {
            const body = contentDoc.substring(contentDoc.indexOf('<body>'), contentDoc.lastIndexOf('</body>'));
            const matches = Array.from(new Set(body.match(/##.+?##/gm)));
            docsLote_fillModelAnalysis(matches, selectedDoc);
        }).then(() => { $('#loaderAnalysis').remove(); });
    }
}

async function docsLote_fillModelAnalysis(matches, selectedDoc, txtModelo = false) {
    S.selectedModel = selectedDoc;
    S.dynamicFields = matches.map((field) => field.trim());

    $('#dialogBoxDocLote').append(`<div id='fieldList'></div>`);
    $('#fieldList').append(`<p class="seipro-doclote-analysis-text"><i class='fas fa-${txtModelo ? 'keyboard' : 'file-alt'} cinzaColor'></i> ${txtModelo ? 'Texto Padrão' : 'Documento'} : ${selectedDoc.nome}</p>`);
    if (txtModelo) {
        $('#btnConfirmAnalysis').prop('disabled', true).addClass('ui-button-disabled ui-state-disabled');

        const tiposDocumentos = await getTypeSEI('documentos');
        const selectTiposDocumentos = tiposDocumentos ? $.map(tiposDocumentos, function (v) { return '<option value="' + v.id + '">' + v.name + '</option>'; }).join('') : false;

        $('#fieldList').append(`
            <p class="seipro-doclote-analysis-text">
                <i class='fas fa-file-alt cinzaColor'></i> Tipo de Documento:
            </p>
            <p class="seipro-doclote-analysis-text">
                <select style="width:300px" id="tipoDocumentoSelect" class="seipro-doclote-document-type-select"><option value="">Selecione um tipo de documento</option>${selectTiposDocumentos}</select>
            </p>
            `);

        $('#tipoDocumentoSelect').chosen({
            placeholder_text_single: ' ',
            no_results_text: 'Nenhum resultado encontrado',
            normalize_search_text: function (text) { return removeAcentos(text.toLowerCase()); }
        });
        $(document).off('change', '.seipro-doclote-document-type-select').on('change', '.seipro-doclote-document-type-select', function () {
            const id_tipo_documento = $('#tipoDocumentoSelect').val();
            const tipoDocumento = tiposDocumentos.find((tipo) => tipo.id === id_tipo_documento);
            if (tipoDocumento) {
                S.selectedModel.nome = tipoDocumento.name;
                S.selectedModel.id_tipo_documento = id_tipo_documento;
                $('#btnConfirmAnalysis').prop('disabled', false).removeClass('ui-button-disabled ui-state-disabled');
            } else {
                $('#btnConfirmAnalysis').prop('disabled', true).addClass('ui-button-disabled ui-state-disabled');
            }
        });
    }
    if (matches.length) {
        let lista = `<ul class="seipro-doclote-analysis-text" style="max-height: 250px;overflow-y: auto;">\n`;
        matches.forEach((field) => { lista += `<li>${field.replaceAll('#', '')}</li>\n`; });
        lista += '</ul>';
        $('#fieldList').append(`<p class="seipro-doclote-analysis-text seipro-doclote-field-title"><i class='fas fa-hashtag cinzaColor'></i> Campos dinâmicos detectados:</p>`);
        $('#fieldList').append(lista);
        if (!txtModelo) $('#btnConfirmAnalysis').prop('disabled', false).removeClass('ui-button-disabled ui-state-disabled');
    } else {
        $('#fieldList').append(`<small class="seipro-doclote-field-error">Não foi identificado nenhum campo dinâmico no documento modelo informado. Verifique se os mesmos foram redigidos corretamente com o padrão ##nome do campo##.</small>`);
    }
    centralizeDialogBox(window.dialogBoxPro);
}

// ---------- análise do CSV ----------
function docsLote_detectEncodingCSV() {
    $(document).off('change.docsLoteEncoding', '.seipro-doclote-csv-input').on('change.docsLoteEncoding', '.seipro-doclote-csv-input', function () {
        const file = $(this)[0].files[0];
        const reader = new FileReader();
        reader.onload = function (e) {
            const csvResult = e.target.result.split(/\r|\n|\r\n/);
            S.CSVEncoding = jschardet.detect(csvResult.toString()).encoding.toLowerCase();
        };
        reader.readAsBinaryString(file);
    });
}

function docsLote_CSVAnalysis(file) {
    $('#fieldListCSV').remove();
    if (!$('#loaderAnalysisCSV')[0]) $('#dialogBoxDocLote').append(`<div id='loaderAnalysisCSV' class="seipro-doclote-csv-analysis-loader" style='height: 40px; text-align: center; display: block;'><i class="fas fa-spinner fa-spin azulColor" style="scale:3;"></i></div>`);

    Papa.parse(file, {
        header: true,
        skipEmptyLines: 'greedy',
        encoding: S.CSVEncoding,
        complete: (results) => {
            docsLote_fillCSVAnalysis(results, file.name);
            $('#loaderAnalysisCSV').remove();
            centralizeDialogBox(window.dialogBoxPro);
        }
    });
}

function docsLote_fillCSVAnalysis(parseData, filename) {
    S.CSVFileName = filename;
    S.CSVData = parseData.data;
    if (typeof S.CSVData[0] !== 'undefined' && S.CSVData[0] !== null) {
        S.CSVHeaders = Object.keys(S.CSVData[0]).filter(Boolean);

        $('#dialogBoxDocLote').append(`<div id='fieldListCSV'></div>`);
        $('#fieldListCSV').append(`<p class="seipro-doclote-analysis-text"><i class='fas fa-file-csv azulColor'></i> Arquivo: ${filename}</p>`);
        if (S.CSVHeaders.length) {
            let lista = `<ul class="seipro-doclote-analysis-text" style="max-height: 250px;overflow-y: auto;">\n`;
            S.CSVHeaders.forEach((field) => { lista += `<li>${field}</li>\n`; });
            lista += '</ul>';
            $('#fieldListCSV').append(`
                <p class="seipro-doclote-analysis-text seipro-doclote-field-title"><i class='fas fa-layer-group cinzaColor'></i> Quantidade de registros: ${S.CSVData.length}</p>
                <p class="seipro-doclote-analysis-text seipro-doclote-field-title"><i class='fas fa-hashtag cinzaColor'></i> Cabeçalhos detectados:</p>
                ${lista}`);
            $('#btnConfirmAnalysis').prop('disabled', false).removeClass('ui-button-disabled ui-state-disabled');
        } else {
            docsLote_printFieldError();
        }
    } else {
        docsLote_printFieldError();
    }
}

function docsLote_printFieldError() {
    $('#dialogBoxDocLote').append(`<p class="seipro-doclote-field-error"><i class="fas fa-exclamation-triangle vermelhoColor"></i> Não foi identificado nenhum cabeçalho no arquivo enviado. <br><br>🤔 Verifique se a planilha não está vazia.</p>`);
    $('#btnConfirmAnalysis').prop('disabled', true).addClass('ui-button-disabled ui-state-disabled');
}

// ---------- cruzamento de dados ----------
async function docsLote_printDataCrossing() {
    S.dataCrossing = [];
    const cleanFields = S.dynamicFields.map((field) => field.replaceAll('#', ''));
    S.CSVHeaders.forEach((header) => {
        try {
            const matchedDynamicField = cleanFields.find((field) => field === header);
            if (matchedDynamicField) S.dataCrossing.push(header);
        } catch { return; }
    });

    if (!S.dataCrossing[0]) {
        $('#dialogBoxDocLote').html(`<p class="seipro-doclote-field-error"><i class="fas fa-exclamation-triangle vermelhoColor"></i> Não existe correspondência no arquivo CSV informado!</p>`);
        $('#btnConfirm').prop('disabled', true).addClass('ui-button-disabled ui-state-disabled');
    } else {
        let tbody = '';
        S.dataCrossing.forEach((data) => {
            tbody += `<tr>
                        <td style="padding-left: 10px;">${data}</td>
                        <td style="text-align:center;"><i class='fas fa-arrow-right azulColor'></i></td>
                        <td>##${data}##</td>
                    </tr>`;
        });

        let selectData = '';
        S.CSVHeaders.forEach((header) => { selectData += `<option>${header}</option>`; });

        const tiposProcessos = await getTypeSEI('processos');
        const selectTiposProcessos = tiposProcessos ? $.map(tiposProcessos, function (v) { return '<option value="' + v.id + '">' + v.name + '</option>'; }).join('') : false;

        $('#dialogBoxDocLote').append(tpl.dataCrossingPanel({
            csvFileName: S.CSVFileName,
            modeloNome: S.selectedModel.nome,
            tbody,
            selectData,
            isNewSEI: SeiPro.sei.adapter.isNewSEI(),
            selectTiposProcessos
        }));
        $('#nomesDoc').chosen({
            placeholder_text_single: ' ',
            no_results_text: 'Nenhum resultado encontrado',
            normalize_search_text: function (text) { return removeAcentos(text.toLowerCase()); }
        });
        $('#tipoProcessoSelect').chosen({
            placeholder_text_single: ' ',
            no_results_text: 'Nenhum resultado encontrado',
            normalize_search_text: function (text) { return removeAcentos(text.toLowerCase()); }
        });
        $('#tipoProcessoSelect_chosen').css('width', '500px');
    }
    setTimeout(() => { centralizeDialogBox(window.dialogBoxPro); }, 300);
    setTimeout(() => { $('#dialogBoxPro').removeAttr('style'); }, 500);
}

// Handlers antes inline (onchange) — agora chamados pela delegação acima.
function changeNewProcs(this_) {
    if ($(this_).is(':checked')) {
        $('.seipro-doclote-process-type-fields').show();
        checkTipoProcessoSelect();
    } else {
        $('.seipro-doclote-process-type-fields').hide();
        $('#btnConfirm').prop('disabled', false).removeClass('ui-button-disabled ui-state-disabled');
    }
}

function checkTipoProcessoSelect() {
    if ($('#tipoProcessoSelect').val() && $('#tipoProcessoSelect').val() != 'null') {
        $('#btnConfirm').prop('disabled', false).removeClass('ui-button-disabled ui-state-disabled');
    } else {
        $('#btnConfirm').prop('disabled', true).addClass('ui-button-disabled ui-state-disabled');
    }
}

// ---------- execução (orquestrador: loop sobre o CSV chamando o pipeline do io) ----------
async function docsLote_execute(param) {
    S.aborted = false;

    if (!param.createNewProcs && !getUrlNewDocArvore()) {
        S.flagError = true;
        alertaBoxPro('Error', 'exclamation-triangle', 'Erro ao localizar o link de inserir documento. Verifique se o processo encontra-se aberto em sua unidade!');
        return;
    }

    if (!SeiPro.sei.adapter.isNewSEI()) {
        S.forceNames = param.forceNames;
        const hasSpecialChars = S.CSVData.some((data) => SeiPro.core.docslote.hasDocsLoteSpecialChars(data[param.docsNames], S.CSVEncoding));
        if (hasSpecialChars) {
            const confirmSpecialChars = confirm(`
                Os nomes escolhidos para constar na árvore de processos contém caracteres especiais.

                O ideal é que não possuam.Portanto, é possível que ocorram alguns problemas de formatação.

                Deseja continuar ?
                `);
            if (!confirmSpecialChars) {
                docLoteModalCruzamentoDados(param.nrDoc, param.csvFile, param.nrTxtPadrao);
                S.flagConfirmSpecialChars = true;
                return;
            }
        }
    }

    for (let i = 0; i < S.CSVData.length; i++) {
        try {
            const urlNewDoc = await io.docsLote_getLinkNewDoc(param, S.CSVData[i]);
            const response1 = await io.docsLote_clickNewDoc(urlNewDoc, setProgress);
            const response2 = await io.docsLote_selectDocType(response1.urlExpandDocList, setProgress);
            const response3 = await io.docsLote_formNewDoc(response2.urlFormNewDoc, S.CSVData[i], param, setProgress);
            const response4 = await io.docsLote_confirmDocData(response3.urlConfirmDocData, response3.params, setProgress);
            const response5 = await io.docsLote_editDocContent(response4.urlEditor, S.CSVData[i], setProgress);
            const response6 = await io.docsLote_saveDoc(response5.urlSubmitForm, response5.paramsSaveDoc, setProgress);

            response6.success && $('#progress').html(`<p style="text-align:center">${i + 1}/${S.CSVData.length}<span style="display:block;white-space: nowrap;color: #ccc;font-size: 8pt;padding:5px">▒▒▒▒▒▒</span></p>`);

            if (i + 1 === S.CSVData.length) throw new Error('cancel');
        } catch (e) {
            if (e.message && e.message === 'cancel') {
                $('#ifrArvore').contents()[0].location.reload();
                setTimeout(() => {
                    const htmlFilterDoclote = tpl.resultFilterBar;

                    let theadRows = '<tr>';
                    theadRows += $.map(Object.keys(S.docsCriados[0].data_doc), function (k) { return `<th class="tituloControle seipro-doclote-result-table-header">${k}</th>`; }).join('');
                    theadRows += '   <th class="tituloControle seipro-doclote-result-table-header" style="white-space: nowrap;">nome_documento_gerado</th>';
                    theadRows += '   <th class="tituloControle seipro-doclote-result-table-header" style="white-space: nowrap;">numero_sei_gerado</th>';
                    theadRows += '   <th class="tituloControle seipro-doclote-result-table-header" style="white-space: nowrap;">link_documento_gerado</th>';
                    theadRows += '</tr>';

                    const tbodyRows = $.map(S.docsCriados, function (v) {
                        let _return = '<tr>';
                        _return += $.map(v.data_doc, function (d) { return `<td style="white-space: nowrap;">${d}</td>`; }).join('');
                        _return += `   <td style="white-space: nowrap;">${v.nome_documento || ''} ${v.data_doc[param.docsNames] || ''}</td>`;
                        _return += `   <td style="white-space: nowrap;">${v.nr_sei || ''}</td>`;
                        _return += `   <td style="white-space: nowrap;"><a href="${v.url_doc || ''}" target="_blank" class="bLink seipro-doclote-generated-document-link" style="font-size: 9pt;">${v.url_doc || ''}</a></td>`;
                        _return += '</tr>';
                        return _return;
                    }).join('');
                    const tableResult = tpl.resultTable(theadRows, tbodyRows);
                    $('#preparingProgressCircular').remove();
                    $('#cancelExecute').hide();
                    $('#progress').html(`<h4 class="seipro-doclote-execution-complete" style="text-align:center;margin: 30px 0 10px 0; font-size: 1.5rem;"><i class="fas fa-check-circle verdeColor" style="font-size: 1em;"></i> Progresso finalizado! 👏</h4>${tableResult}`);
                    window.dialogBoxPro.dialog('option', 'width', 870);
                    window.dialogBoxPro.dialog('option', 'height', 500);
                    $('#tableDataResult').find('thead').prepend(htmlFilterDoclote);
                }, 500);
            } else {
                S.flagError = true;
                console.log('Erro 😢 -> ', e);
                docLoteModalErro();
            }
            S.aborted = false;
            break;
        }
    }
}

function docsLote_abortAjax() {
    if (!S.flagError && !S.flagConfirmSpecialChars) {
        S.aborted = true;
        $('#cancelExecute').hide();
        $('#progress').html(`<p style="text-align:center">Cancelando progresso</p>`);
    } else {
        S.flagError = false;
        S.flagConfirmSpecialChars = false;
        S.aborted = false;
    }
}

// ============================================================================
// Diálogos do wizard (1/6 → 6/6)
// ============================================================================

export function docLoteModalSelecaoDoc() {
    const urlNewDoc = getUrlNewDocArvore();
    if (!urlNewDoc) {
        S.flagError = true;
        alertaBoxPro('Error', 'exclamation-triangle', 'Erro ao localizar o link de inserir documento. Verifique se o processo encontra-se aberto em sua unidade!');
        return;
    }
    const credito = restrictConfigValue('documentosemlote') ? tpl.creditoTcgontijo : '';
    const htmlBox = tpl.selecaoDocBox(credito);

    resetDialogBoxPro('dialogBoxPro');
    window.dialogBoxPro = $('#dialogBoxPro')
        .html(htmlBox)
        .dialog({
            title: 'Documento modelo - Seleção (1/6)',
            width: 600,
            open: () => {
                if (typeof URL_SPRO !== 'undefined' && typeof jschardet === 'undefined') $.getScript(`${URL_SPRO}js/lib/jschardet.min.js`);
                if (typeof URL_SPRO !== 'undefined' && typeof Papa === 'undefined') $.getScript(`${URL_SPRO}js/lib/papaparse.js`);
                $('#btnSelecaoDoc').prop('disabled', true).addClass('ui-button-disabled ui-state-disabled');
                $('#docLoteSelect')
                    .chosen({
                        placeholder_text_single: ' ',
                        no_results_text: 'Nenhum resultado encontrado',
                        normalize_search_text: function (text) { return removeAcentos(text.toLowerCase()); }
                    });
                $(document).off('change', '.seipro-doclote-model-select').on('change', '.seipro-doclote-model-select', () => {
                    $('#textoPadraoSelect').val('').trigger('chosen:updated');
                    $('#btnSelecaoDoc').prop('disabled', false).removeClass('ui-button-disabled ui-state-disabled');
                });
                $('#textoPadraoSelect').chosen({
                    placeholder_text_single: ' ',
                    no_results_text: 'Nenhum resultado encontrado',
                    normalize_search_text: function (text) { return removeAcentos(text.toLowerCase()); }
                });
                docsLote_getDocsArvore(true);
                S.docsCriados = [];
                $(document).off('change', '.seipro-doclote-template-select').on('change', '.seipro-doclote-template-select', () => {
                        $('#docLoteSelect').val('').trigger('chosen:updated');
                        $('#btnSelecaoDoc').prop('disabled', false).removeClass('ui-button-disabled ui-state-disabled');
                });
                $('#textoPadraoSelect').html('<option value="">&nbsp;</option>');
                txtPadrao_getList().then((listTxtPadrao) => {
                    S.listTxtPadraoDoc = listTxtPadrao;
                    $('#textoPadraoSelect').append(listTxtPadrao.map((item) => `<option value="${item.id}">${item.name}</option>`).join(''));
                    $('#textoPadraoSelect').trigger('chosen:updated');
                });
            },
            buttons: [{
                text: 'Ajuda',
                icon: 'ui-icon-help',
                click: function () { window.open(helpPageUrl()); }
            }, {
                id: 'btnSelecaoDoc',
                text: 'Avançar',
                icon: 'ui-icon-arrowthick-1-e',
                class: 'confirm ui-state-active seipro-doclote-selection-confirm',
                click: function () {
                    if ($(this).find('small')[0]) {
                        resetDialogBoxPro('dialogBoxPro');
                    } else {
                        const nrDoc = $('#docLoteSelect').find('option:selected').data('id_documento');
                        const nrTxtPadrao = $('#textoPadraoSelect').val();
                        docLoteModalAnaliseDocModelo(nrDoc, nrTxtPadrao);
                    }
                }
            }]
        });
}

function docLoteModalSelecaoBaseDados(nrDoc, csvFile, nrTxtPadrao) {
    const htmlBox = tpl.selecaoBaseDadosBox();

    resetDialogBoxPro('dialogBoxPro');
    window.dialogBoxPro = $('#dialogBoxPro')
        .html(htmlBox)
        .dialog({
            title: 'Base de dados - Upload (3/6)',
            width: 600,
            open: () => {
                docsLote_detectEncodingCSV();
                $('#btnEnviaCSV').prop('disabled', true).addClass('ui-button-disabled ui-state-disabled');
                $(document).off('change.docsLoteAdvance', '.seipro-doclote-csv-input').on('change.docsLoteAdvance', '.seipro-doclote-csv-input', () => {
                    $('#btnEnviaCSV').prop('disabled', false).removeClass('ui-button-disabled ui-state-disabled');
                });
            },
            buttons: [{
                text: 'Ajuda',
                icon: 'ui-icon-help',
                click: function () { window.open(helpPageUrl()); }
            }, {
                text: 'Voltar',
                icon: 'ui-icon-arrowthick-1-w',
                click: function () { docLoteModalAnaliseDocModelo(nrDoc, nrTxtPadrao); }
            }, {
                id: 'btnEnviaCSV',
                text: 'Avançar',
                disabled: true,
                icon: 'ui-icon-arrowthick-1-e',
                class: 'confirm ui-state-active seipro-doclote-csv-confirm',
                click: () => {
                    $('#baseDados small').remove();
                    const file = $('#inputBD')[0].files[0];
                    if (file.name.substring(file.name.lastIndexOf('.'), file.name.length).toLocaleLowerCase().trim() === '.csv') {
                        docLoteModalAnaliseCSV(nrDoc, $('#inputBD')[0].files[0], nrTxtPadrao);
                    } else {
                        $('#inputBD').after(`<small class="seipro-doclote-field-error">Arquivo inválido! Selecione um documento no formato "CSV".</small>`);
                    }
                }
            }]
        });
}

function docLoteModalLoader(paramData) {
    const htmlBox = tpl.loaderBox();

    resetDialogBoxPro('dialogBoxPro');
    window.dialogBoxPro = $('#dialogBoxPro')
        .html(htmlBox)
        .dialog({
            title: 'Documentos em lote - Criando (6/6)',
            width: 300,
            open: () => { docsLote_execute(paramData); },
            close: () => { docsLote_abortAjax(); },
            buttons: [{
                text: 'Cancelar',
                id: 'cancelExecute',
                class: 'seipro-doclote-cancel-execution',
                icon: 'ui-icon-cancel',
                click: function () { docsLote_abortAjax(); }
            }]
        });
}

function docLoteModalErro(textError = false) {
    const htmlBox = tpl.erroBox(textError);

    resetDialogBoxPro('dialogBoxPro');
    window.dialogBoxPro = $('#dialogBoxPro')
        .html(htmlBox)
        .dialog({
            title: '🤦‍♂️ Ops...',
            width: 600,
            buttons: [{
                text: 'OK',
                class: 'ui-state-active seipro-doclote-error-confirm',
                click: function () { resetDialogBoxPro('dialogBoxPro'); }
            }]
        });
}

function docLoteModalCruzamentoDados(nrDoc, csvFile, nrTxtPadrao) {
    const htmlBox = tpl.cruzamentoDadosBox();

    resetDialogBoxPro('dialogBoxPro');
    window.dialogBoxPro = $('#dialogBoxPro')
        .html(htmlBox)
        .dialog({
            title: 'Cruzamento de dado (5/6)',
            width: 600,
            maxHeight: (window.innerHeight * 0.9),
            open: () => docsLote_printDataCrossing(),
            buttons: [{
                text: 'Ajuda',
                icon: 'ui-icon-help',
                click: function () { window.open(helpPageUrl()); }
            }, {
                text: 'Voltar',
                icon: 'ui-icon-arrowthick-1-w',
                click: function () { docLoteModalSelecaoBaseDados(nrDoc, csvFile, nrTxtPadrao); }
            }, {
                id: 'btnConfirm',
                text: 'Iniciar',
                icon: 'ui-icon-play',
                class: 'confirm ui-state-active seipro-doclote-crossing-confirm',
                click: function () {
                    const paramData = {
                        docsNames: $('#nomesDoc').val(),
                        forceNames: $('#checkForceNames').is(':checked'),
                        createNewProcs: $('#newProcs').is(':checked'),
                        idTipoProcedimento: $('#tipoProcessoSelect').val(),
                        txtEspecificacaoProcesso: $('#txtEspecificacaoProcesso').val(),
                        nrDoc: nrDoc,
                        csvFile: csvFile,
                        nrTxtPadrao: nrTxtPadrao
                    };
                    docLoteModalLoader(paramData);
                }
            }]
        });
}

function docLoteModalAnaliseDocModelo(nrDoc, nrTxtPadrao) {
    const htmlBox = tpl.analiseDocModeloBox();

    resetDialogBoxPro('dialogBoxPro');
    window.dialogBoxPro = $('#dialogBoxPro')
        .html(htmlBox)
        .dialog({
            title: 'Documento modelo - Campos dinâmicos (2/6)',
            width: 600,
            maxHeight: (window.innerHeight * 0.9),
            open: () => {
                docsLote_docAnalysis(nrDoc, nrTxtPadrao);
                setTimeout(() => { $('#dialogBoxPro').removeAttr('style'); }, 500);
            },
            buttons: [{
                text: 'Ajuda',
                icon: 'ui-icon-help',
                click: function () { window.open(helpPageUrl()); }
            }, {
                text: 'Voltar',
                icon: 'ui-icon-arrowthick-1-w',
                click: function () { docLoteModalSelecaoDoc(); }
            }, {
                id: 'btnConfirmAnalysis',
                text: 'Avançar',
                icon: 'ui-icon-arrowthick-1-e',
                class: 'confirm ui-state-active',
                click: function () { docLoteModalSelecaoBaseDados(nrDoc, null, nrTxtPadrao); }
            }]
        });
}

function docLoteModalAnaliseCSV(nrDoc, csvFile, nrTxtPadrao) {
    const htmlBox = tpl.analiseCsvBox();

    resetDialogBoxPro('dialogBoxPro');
    window.dialogBoxPro = $('#dialogBoxPro')
        .html(htmlBox)
        .dialog({
            title: 'Base de dados - Cabeçalhos e registros (4/6)',
            width: 600,
            open: () => { docsLote_CSVAnalysis(csvFile); },
            buttons: [{
                text: 'Ajuda',
                icon: 'ui-icon-help',
                click: function () { window.open(helpPageUrl()); }
            }, {
                text: 'Voltar',
                icon: 'ui-icon-arrowthick-1-w',
                click: function () { docLoteModalSelecaoBaseDados(nrDoc, csvFile, nrTxtPadrao); }
            }, {
                id: 'btnConfirmAnalysisCSV',
                text: 'Avançar',
                icon: 'ui-icon-arrowthick-1-e',
                class: 'confirm ui-state-active',
                click: function () { docLoteModalCruzamentoDados(nrDoc, csvFile, nrTxtPadrao); }
            }]
        });
}
