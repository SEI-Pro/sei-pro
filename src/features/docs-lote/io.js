// docs-lote / io — efeitos: scraping e POSTs ao SEI (same-origin, via $.ajax — jQuery
// mantido nesta camada durante a transição). Não toca o DOM da página: o progresso é
// reportado por callback (`onProgress`) injetado pela view. Usa o estado (S) e o domínio.
//
// Helpers globais do SEI lidos do escopo isolado (definidos por core/sei-functions-pro):
//   $, getParamsUrlPro, removeAcentos, escapeComponent, trycatch, uniqPro, getHashTagsPro,
//   camposDinamicosProcesso, dadosProcessoPro, url_host, mainMenu, getUrlNewDocArvore,
//   alertaBoxPro, SeiPro.sei.adapter, SeiPro.core.docslote.

import { S } from './state.js';
import {
    extractEditorUrl,
    extractNewDocUrl,
    interpolateEspecificacao,
    buildCrossingRegex,
    serializeParams
} from './domain.js';

const cancel = () => { throw new Error('cancel'); };

// ---------- criação de processo novo (opção "criar cada doc num novo processo") ----------

const getInitialProcUrl = async () => {
    const urlInitProc = $(`${mainMenu} a[href*="acao=procedimento_escolher_tipo"]`).attr('href');
    if (!urlInitProc) throw new Error('Erro ao iniciar a criação do processo');
    return urlInitProc;
};

const getInitialProcHtml = async (urlInitProc) => $(await $.ajax({ url: urlInitProc }));

const getFullProcList = async (htmlInitProc) => {
    const form = SeiPro.sei.adapter.isSEI5()
        ? htmlInitProc.find('#frmProcedimentoEscolherTipo')
        : htmlInitProc.find('#frmIniciarProcessoEscolhaTipo');
    const hrefForm = form.attr('action');

    const param = {};
    form.find('input[type=hidden]').each(function () {
        if ($(this).attr('name') && $(this).attr('id').indexOf('hdn') !== -1) {
            param[$(this).attr('name')] = $(this).val();
        }
    });
    param.hdnFiltroTipoProcedimento = 'T';

    return $(await $.ajax({ method: 'POST', data: param, url: hrefForm }));
};

const getProcForm = async (htmlFullList, id_tipo_procedimento) => {
    let urlProc = htmlFullList.find(`a[href*="procedimento_escolher_tipo&id_tipo_procedimento=${id_tipo_procedimento}"]`).attr('href');

    let checkPost = htmlFullList.find('#tblTipoProcedimento').find('a.ancoraOpcao').attr('href');
    checkPost = typeof checkPost !== 'undefined' && checkPost == '#';

    if (checkPost) urlProc = await getSerieForm(htmlFullList, id_tipo_procedimento);

    if (!urlProc) {
        throw new Error('Erro ao selecionar o tipo de processo. Verifique se o tipo está disponível no sistema e tente novamente');
    }
    return $(await $.ajax({ url: urlProc }));
};

export const getSerieForm = async (htmlFullList, id_tipo_procedimento, nameDoc = null, id_tipo_documento = null) => {
    const urlForm = !nameDoc ? htmlFullList.find('#frmProcedimentoEscolherTipo') : htmlFullList.find('#frmDocumentoEscolherTipo');
    const param = {};
    urlForm.find('input[type=hidden]').each(function () {
        if ($(this).attr('name') && $(this).attr('id').indexOf('hdn') !== -1) {
            param[$(this).attr('name')] = $(this).val();
        }
    });

    if (id_tipo_documento) {
        param.hdnIdSerie = id_tipo_documento;
    } else if (nameDoc) {
        let hdnIdSerie = false;
        urlForm.find('input.infraCheckbox').each(function () {
            if ($(this).attr('title').startsWith(nameDoc)) { hdnIdSerie = $(this).val(); return false; }
        });
        if (!hdnIdSerie) {
            throw new Error('Erro ao selecionar o tipo de documento. Verifique se o tipo está disponível no sistema e tente novamente');
        }
        param.hdnIdSerie = hdnIdSerie;
    } else {
        param.hdnIdTipoProcedimento = id_tipo_procedimento;
    }

    const xhr = new XMLHttpRequest();
    await $.ajax({
        method: 'POST',
        data: param,
        url: urlForm.attr('action'),
        contentType: 'application/x-www-form-urlencoded; charset=ISO-8859-1',
        xhr: () => xhr
    });
    return xhr.responseURL;
};

const extractFormParams = (form) => {
    const param = {};
    form.find('input[type=hidden]').each(function () {
        if ($(this).attr('name') && $(this).attr('id').indexOf('hdn') !== -1) param[$(this).attr('name')] = $(this).val();
    });
    form.find('input[type=text]').each(function () {
        if ($(this).attr('id') && $(this).attr('id').indexOf('txt') !== -1) param[$(this).attr('id')] = $(this).val();
    });
    form.find('select').each(function () {
        if ($(this).attr('id') && $(this).attr('id').indexOf('sel') !== -1) param[$(this).attr('id')] = $(this).val();
    });
    form.find('input[type=radio]').each(function () {
        if ($(this).attr('name') && $(this).attr('name').indexOf('rdo') !== -1) param[$(this).attr('name')] = $(this).val();
    });
    return param;
};

const prepareFormData = (param, htmlFormProc, txtEspecificacaoProcesso) => {
    param.rdoNivelAcesso = '0';
    param.hdnFlagProcedimentoCadastro = '2';
    param.rdoProtocolo = 'M';
    param.txaObservacoes = '';
    param.txtDescricao = txtEspecificacaoProcesso ? txtEspecificacaoProcesso.substring(0, 100).trim() : '';
    param.hdnAssuntos = (htmlFormProc.find('#selAssuntos option').length === 0)
        ? []
        : htmlFormProc.find('#selAssuntos option')
            .map(function () { return $(this).val() + '±' + $(this).text(); })
            .get().join('¥').replaceAll(' ', '+');
    param.hdnInteressados = htmlFormProc.find('#selInteressados option')
        .map(function () { return $(this).val() + '±' + $(this).text(); })
        .get().join('¥').replaceAll(' ', '+');

    return serializeParams(
        param,
        (k) => k === 'hdnNomeTipoProcedimento' || k === 'hdnAssuntos' || k === 'txtDescricao',
        escapeComponent
    );
};

const createProc = async (hrefForm, postData) => {
    const xhr = new XMLHttpRequest();
    const htmlResult = await $.ajax({
        method: 'POST',
        data: postData,
        url: hrefForm,
        contentType: 'application/x-www-form-urlencoded; charset=ISO-8859-1',
        xhr: () => xhr
    });
    return { htmlResult, xhr };
};

const extractProcId = (htmlResult) => {
    const linkProc = $(htmlResult).find('#ifrArvore').attr('src');
    if (!linkProc) return false;
    const id_procedimento = getParamsUrlPro(linkProc).id_procedimento;
    return (typeof id_procedimento !== 'undefined') ? id_procedimento : false;
};

export const docsLote_setNewProc = async (id_tipo_procedimento, txtEspecificacaoProcesso) => {
    try {
        const urlInitProc = await getInitialProcUrl();
        const htmlInitProc = await getInitialProcHtml(urlInitProc);
        const htmlFullList = await getFullProcList(htmlInitProc);
        const htmlFormProc = await getProcForm(htmlFullList, id_tipo_procedimento);

        const form = htmlFormProc.find('#frmProcedimentoCadastro');
        const hrefForm = form.attr('action');
        const param = extractFormParams(form);
        const postData = prepareFormData(param, htmlFormProc, txtEspecificacaoProcesso);

        const { htmlResult, xhr } = await createProc(hrefForm, postData);
        const status = xhr.responseURL.indexOf('controlador.php?acao=procedimento_trabalhar&acao_origem=procedimento_gerar') !== -1;

        if (status) {
            const id_procedimento = extractProcId(htmlResult);
            if (id_procedimento) {
                return url_host.replace('controlador.php', '') +
                    `controlador.php?acao=procedimento_trabalhar&id_procedimento=${String(id_procedimento)}`;
            }
            alertaBoxPro('Error', 'exclamation-triangle', 'Não foi possível abrir o processo gerado. Verifique na caixa de entrada de sua unidade');
            return null;
        }
    } catch (error) {
        console.error('Erro na criação do procedimento:', error);
        alertaBoxPro('Error', 'exclamation-triangle', error.message);
        return null;
    }
};

// ---------- URL de novo documento no processo (existente ou recém-criado) ----------

const getProcessHtml = async (urlProcesso) => $(await $.ajax({ url: urlProcesso }));

const getTreeUrl = (html) => {
    const urlArvore = html.find('#ifrArvore').attr('src');
    if (!urlArvore) throw new Error('Erro ao obter a URL da árvore do processo');
    return urlArvore;
};

const getTreeHtml = async (urlArvore) => $.ajax({ url: urlArvore });

export const docsLote_getUrlNewDoc = async (urlProcesso) => {
    try {
        const html = await getProcessHtml(urlProcesso);
        const urlArvore = getTreeUrl(html);
        const htmlArvore = await getTreeHtml(urlArvore);
        return extractNewDocUrl(htmlArvore);
    } catch (error) {
        console.error('Erro ao obter URL de novo documento:', error);
        alertaBoxPro('Error', 'exclamation-triangle', error.message);
        return null;
    }
};

export const docsLote_getLinkNewDoc = async (param, dataCSV) => {
    if (param.createNewProcs) {
        const txtEspecificacaoProcesso = interpolateEspecificacao(param.txtEspecificacaoProcesso, dataCSV);
        const urlProcesso = await docsLote_setNewProc(param.idTipoProcedimento, txtEspecificacaoProcesso);
        return urlProcesso ? await docsLote_getUrlNewDoc(urlProcesso) : false;
    }
    return getUrlNewDocArvore();
};

// ---------- pipeline de criação de UM documento (6 sub-passos) ----------
// `onProgress(stepIndex)` (1..6) é injetado pela view para atualizar a barra de progresso
// sem que o io conheça o DOM. Aborto via S.aborted (a view seta no cancelar).

export const docsLote_clickNewDoc = async (urlNewDoc, onProgress) => {
    const htmlChooseDocType = await $.get(urlNewDoc);
    const urlExpandDocList = $(htmlChooseDocType).find('#frmDocumentoEscolherTipo').attr('action');
    if (S.aborted) cancel();
    if (typeof urlExpandDocList !== 'undefined') onProgress(1);
    return { urlExpandDocList, success: true };
};

export const docsLote_selectDocType = async (urlExpandDocList, onProgress) => {
    const htmlExpandedDocList = await $.ajax({ method: 'POST', url: urlExpandDocList, data: { hdnFiltroSerie: 'T' } });
    const htmlTypeList = $(htmlExpandedDocList).find('.ancoraOpcao');

    let checkPost = htmlTypeList.attr('href');
    checkPost = typeof checkPost !== 'undefined' && checkPost == '#';

    let urlFormNewDoc = false;
    if (checkPost) {
        urlFormNewDoc = await getSerieForm($(htmlExpandedDocList), null, S.selectedModel.nome, S.selectedModel.id_tipo_documento);
    } else {
        const typeList = [];
        for (let i = 0; i < htmlTypeList.length; i++) {
            typeList.push({ nome: htmlTypeList[i].textContent, url: htmlTypeList[i].getAttribute('href') });
        }
        typeList.some((type) => {
            if (S.selectedModel.nome.startsWith(type.nome)) { urlFormNewDoc = type.url; return true; }
        });
    }
    if (S.aborted) cancel();
    if (urlFormNewDoc) onProgress(2);
    return { urlFormNewDoc, success: true };
};

export const docsLote_formNewDoc = async (urlFormNewDoc, data, dataDialog, onProgress) => {
    const htmlFormNewDoc = await $.get(urlFormNewDoc);
    const form = $(htmlFormNewDoc).find('#frmDocumentoCadastro');
    const urlConfirmDocData = form.attr('action');
    const numeroOpcional = form.find('#lblNumero').attr('class') === 'infraLabelOpcional';
    const nomeOpcional = form.find('#lblNomeArvore').attr('class') === 'infraLabelOpcional';

    const params = {};
    form.find('input[type=hidden]').each(function () {
        if ($(this).attr('name') && $(this).attr('id').includes('hdn')) params[$(this).attr('name')] = $(this).val();
    });
    form.find('input[type=text]').each(function () {
        if ($(this).attr('id') && $(this).attr('id').includes('txt')) params[$(this).attr('id')] = $(this).val();
    });
    form.find('select').each(function () {
        if ($(this).attr('id') && $(this).attr('id').includes('sel')) params[$(this).attr('id')] = $(this).val();
    });
    form.find('input[type=radio]').each(function () {
        if ($(this).attr('name') && $(this).attr('name').includes('rdo')) params[$(this).attr('name')] = $(this).val();
    });
    params.rdoNivelAcesso = '0';
    params.hdnFlagDocumentoCadastro = '2';
    params.txaObservacoes = '';
    params.txtDescricao = '';
    if (dataDialog.nrTxtPadrao) params.selTextoPadrao = S.selectedModel.numero;
    else params.txtProtocoloDocumentoTextoBase = S.selectedModel.numero;

    const nomeArvore = removeAcentos(data[dataDialog.docsNames].substring(0, 50)).trim();
    if (!numeroOpcional || S.forceNames) params.txtNumero = nomeArvore;
    else params.txtNumero = '';
    params.txtNomeArvore = (nomeOpcional && SeiPro.sei.adapter.isNewSEI()) ? decodeURIComponent(escape(nomeArvore)) : '';

    if (S.aborted) cancel();
    if (typeof urlConfirmDocData !== 'undefined') onProgress(3);
    return { urlConfirmDocData, params, success: true };
};

export const docsLote_confirmDocData = async (urlConfirmDocData, params, onProgress) => {
    const postData = serializeParams(params, (k) => k === 'txtNomeArvore', escapeComponent);

    const htmlDocCreated = await $.ajax({
        method: 'POST',
        url: urlConfirmDocData,
        data: postData,
        contentType: 'application/x-www-form-urlencoded; charset=ISO-8859-1'
    });

    const urlEditor = extractEditorUrl(htmlDocCreated);
    if (S.aborted) cancel();
    onProgress(4);
    return { urlEditor, success: true };
};

export const docsLote_editDocContent = async (urlEditor, data, onProgress) => {
    const htmlEditor = await $.get(urlEditor); // TODO: identificar e excluir doc gerado erroneamente em erro
    const urlSubmitForm = $(htmlEditor).filter((_, el) => $(el).attr('id') === 'frmEditor').attr('action');
    const urlParams = getParamsUrlPro(urlEditor);
    const docTitle = trycatch(() => htmlEditor.match(/<title[^>]*>([^<]+)<\/title>/)[1], false);
    const { nrSEI, nomeDocumento } = SeiPro.core.docslote.parseDocsLoteDocTitle(docTitle);

    const textAreas = $(htmlEditor).find('div#divEditores textarea');
    const regex1 = buildCrossingRegex(S.dataCrossing);

    const textAreasReplaced = textAreas.map((_, el) =>
        $(el).text().replace(regex1, (match) =>
            SeiPro.core.docslote.encodeDocsLoteSpecialChars(data[match.substring(2, match.length - 2)])
        )
    );

    const paramsSaveDoc = {};
    textAreasReplaced.each((i, textArea) => {
        paramsSaveDoc[$(textAreas).eq(i).attr('name')] = textArea;
    });

    $(htmlEditor).find('input[type=hidden').each((_, input) => {
        if (!$(input).attr('name').toLowerCase().includes('unidade')) {
            paramsSaveDoc[$(input).attr('name')] = SeiPro.core.docslote.encodeDocsLoteSpecialChars($(input).val());
        }
    });

    if (S.aborted) cancel();
    if (typeof urlSubmitForm !== 'undefined') onProgress(5);

    S.docsCriados.push({
        nr_sei: nrSEI,
        id_documento: urlParams.id_documento,
        id_procedimento: urlParams.id_procedimento,
        data_doc: data,
        nome_documento: nomeDocumento,
        url_doc: `${url_host}?acao=procedimento_trabalhar&id_procedimento=${urlParams.id_procedimento}&id_documento=${urlParams.id_documento}`
    });

    return { urlSubmitForm, paramsSaveDoc, success: true, nrSEI };
};

export const docsLote_saveDoc = async (urlSubmitForm, paramsSaveDoc, onProgress) => {
    const responseSave = await $.ajax({ method: 'POST', url: urlSubmitForm, data: paramsSaveDoc });
    if (S.aborted) cancel();
    if (responseSave.startsWith('OK')) {
        if (typeof urlSubmitForm !== 'undefined') onProgress(6);
        return { success: true };
    }
    throw new Error(responseSave);
};
