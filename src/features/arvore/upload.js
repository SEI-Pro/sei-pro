/**
 * Árvore — upload / file-queue (vanilla).
 *
 * Replaces Dropzone.js + jQuery orchestration. Shared primitive:
 *   src/shared/ui/file-queue.js
 * View: ./view.js · IO: ./io.js · domain: ./domain.js · templates: ./templates.js
 */
import { installArvoreState } from './state.js';
import {
    hasUploadFiles as domainHasUploadFiles,
    serializeUploadAttachment,
    resolveDropzoneIcon,
    parseInfraUploadMeta,
    resolveUploadSerie,
    buildUploadDocumentTitle,
    findArvoreUpdateTargets,
    findDocumentoNoInArvoreHtml
} from './domain.js';
import {
    fetchText,
    postFormData,
    postSavedUpload,
    parseUploadPageHtml,
    readEscolherTipoForm
} from './io.js';
import {
    bindUploadArvoreNativeDragEvents,
    bindUploadConfirmActions,
    setUploadHover,
    ensureUploadOverlay,
    setPreviewError,
    updatePreviewAfterSave,
    bindUploadSortable,
    statusUploadButton,
    qsUploadPreview,
    getUploadIndex,
    setUploadIndex
} from './view.js';
import * as templates from './templates.js';
import { createFileQueue, formatFileSize } from '../../shared/ui/file-queue.js';
import { parseDocument } from '../../dom/index.js';

installArvoreState();

function uploadRoot() {
    return typeof document !== 'undefined' ? document.querySelector(containerUpload) || document.body : null;
}

function renameUploadFile(file) {
    const remove = (typeof parent !== 'undefined' && parent.removeAcentos)
        || (typeof globalThis.removeAcentos === 'function' && globalThis.removeAcentos)
        || ((s) => s);
    return remove(file.name).replace(/[&\/\\#+()$~%'":*?<>{}]/g, '_');
}

function formatBytes(n) {
    if (typeof infraFormatarTamanhoBytes === 'function') return infraFormatarTamanhoBytes(n);
    return formatFileSize(n);
}

function getIfrTarget() {
    return (typeof ifrVisualizacao_ !== 'undefined' && ifrVisualizacao_) || 'ifrVisualizacao';
}

export function dropzoneCancelInfo(e) {
    if (e && typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();
    setUploadHover(uploadRoot(), false);
    return false;
}

export function hasUploadFiles(dataTransfer) {
    return domainHasUploadFiles(dataTransfer);
}

export function encodeUrlUploadArvore(response, params) {
    return serializeUploadAttachment(response, params, formatBytes);
}

export function openModalDropzone() {
    setUploadHover(uploadRoot(), true);
}

export function statusUploadArvore(el) {
    statusUploadButton(el);
}

export function dropzoneDivInfoHover() {
    const root = uploadRoot();
    ensureUploadOverlay(root, templates.dropzoneInfoHoverHtml());
    bindUploadConfirmActions({
        root: document,
        onCancel: dropzoneCancelInfo,
        onSend: () => sendUploadArvore('upload'),
        onStatus: statusUploadArvore
    });
}

export function dropzoneNormalizeImg(file) {
    const preview = (file && file.previewElement)
        || document.querySelector('#divArvore .dz-preview:last-child');
    if (!preview) return;
    const urlIcon = resolveDropzoneIcon(file && file.type, parent.isNewSEI);
    const img = preview.querySelector('.dz-link-icon');
    const anchor = img && img.closest('a');
    if (img) img.setAttribute('src', urlIcon.startsWith('/') || urlIcon.startsWith('svg/')
        ? (urlIcon.startsWith('svg/') ? '/infra_css/' + urlIcon : urlIcon)
        : '/infra_css/' + urlIcon);
    if (anchor) anchor.setAttribute('data-img', urlIcon);
    const joins = document.querySelectorAll('#divArvore img[src*="joinbottom.gif"], #divArvore img[src*="join.gif"]');
    // Keep last join as joinbottom (legacy visual)
    const lastJoin = document.querySelector('#divArvore .dz-preview:last-child .anchorJoinPro img');
    if (lastJoin) {
        lastJoin.setAttribute('src', pathArvore + 'joinbottom.gif');
    }
    void joins;
}

function createTreePreview(item) {
    const root = uploadRoot();
    const hasPasta = !!(root && root.querySelector('a[id*="anchorImgPASTA"]'));
    const iconPath = resolveDropzoneIcon(item.file.type, parent.isNewSEI);
    const iconSrc = iconPath.indexOf('svg/') === 0 || iconPath.indexOf('imagens/') === 0
        ? '/infra_css/' + iconPath.replace(/^\/infra_css\//, '')
        : (iconPath.startsWith('/') ? iconPath : '/infra_css/' + iconPath);
    const wrap = document.createElement('div');
    wrap.innerHTML = templates.uploadPreviewHtml({
        hasPasta,
        pathArvore,
        newSEI: parent.isNewSEI,
        ifrTarget: getIfrTarget(),
        iconSrc,
        iconData: iconPath,
        size: item.file.size,
        name: item.uploadName || item.file.name
    });
    return wrap.firstElementChild;
}

export function loadUploadArvore() {
    dropzoneDivInfoHover();
    const previews = document.querySelector('#divArvore');
    const accepted = (typeof localStorageRestorePro === 'function')
        ? localStorageRestorePro('arvoreDropzone_acceptedFiles')
        : null;

    arvoreDropzone = createFileQueue({
        previewsContainer: previews,
        clickable: '#dz-infoupload',
        paramName: 'filArquivo',
        accept: accepted,
        timeout: 900000,
        renameFile: renameUploadFile,
        createPreview: createTreePreview,
        onAddedFiles: () => {
            dropzoneCancelInfo();
            const queued = arvoreDropzone.getQueuedFiles();
            if (typeof verifyConfigValue === 'function' && verifyConfigValue('sortbeforeupload') && queued.length > 1) {
                sortUploadArvore();
            } else {
                sendUploadArvore('upload', false);
            }
        },
        onAddedFile: (file) => dropzoneNormalizeImg(file),
        onRemovedFile: (file) => dropzoneNormalizeImg(file),
        onSuccess: (file) => {
            const params = arvoreDropzone.options.params;
            if (!params || !file.xhr) return;
            const response = String(file.xhr.response || '').split('#');
            params.paramsForm.hdnAnexos = (
                (typeof parent !== 'undefined' && parent.parent && typeof parent.parent.encodeUrlUploadArvore === 'function')
                    ? parent.parent.encodeUrlUploadArvore(response, params)
                    : encodeUrlUploadArvore(response, params)
            );
            let postData = '';
            for (const k of Object.keys(params.paramsForm)) {
                if (postData !== '') postData += '&';
                let valor = (k === 'hdnAnexos')
                    ? params.paramsForm[k]
                    : (typeof escapeComponent === 'function' ? escapeComponent(params.paramsForm[k]) : encodeURIComponent(params.paramsForm[k]));
                if (k === 'txtNumero' && typeof parent.encodeURI_toHex === 'function') {
                    valor = parent.encodeURI_toHex(String(params.paramsForm[k]).normalize('NFC'));
                }
                postData += k + '=' + valor;
            }
            params.paramsForm = postData;
            sendUploadArvore('save', params);
        },
        onError: () => {
            sendUploadArvore('upload');
        }
    });

    bindUploadArvoreNativeDragEvents({
        root: document,
        hasUploadFiles,
        openModalDropzone,
        cancelUpload: dropzoneCancelInfo,
        getDropzone: () => arvoreDropzone
    });
}

export function sortUploadArvore() {
    const bar = templates.uploadConfirmBarHtml();
    const existing = document.getElementById('divUploadDoc');
    if (existing) existing.remove();
    const tree = document.getElementById('divArvore');
    if (!tree) return;
    tree.insertAdjacentHTML('afterend', bar);
    bindUploadSortable(tree, {
        onReorder: (ordered) => {
            if (arvoreDropzone && typeof arvoreDropzone.reorderByPreview === 'function') {
                arvoreDropzone.reorderByPreview(ordered);
            }
        }
    });
    bindUploadConfirmActions({
        root: document,
        onCancel: dropzoneCancelInfo,
        onSend: () => sendUploadArvore('upload'),
        onStatus: statusUploadArvore
    });
}

function previewAt(index, rootEl) {
    const root = rootEl || uploadRoot() || document;
    let el = qsUploadPreview(root, index);
    if (!el && typeof parent !== 'undefined' && parent.parent && parent.parent.document) {
        el = qsUploadPreview(parent.parent.document, index);
    }
    return el;
}

export function sendUploadArvore(mode, result = false, arrayDropzone = arvoreDropzone, _containerUpload = null) {
    const container = _containerUpload
        || uploadRoot()
        || document.body;
    // jQuery-wrapped containers from lista still supported
    const containerEl = container && container.jquery ? container[0] : container;
    const indexUpload = getUploadIndex(containerEl);
    const elem = previewAt(indexUpload, containerEl);
    const queue = (arrayDropzone && typeof arrayDropzone.getQueuedFiles === 'function')
        ? arrayDropzone
        : (typeof parent !== 'undefined' && parent.parent && parent.parent.arvoreDropzone);
    const queuedFiles = queue && typeof queue.getQueuedFiles === 'function' ? queue.getQueuedFiles() : [];

    if (mode === 'upload' && queuedFiles.length > 0) {
        let href = null;
        try {
            href = jmespath.search(getTreeLinksSession(), "[?name=='Incluir Documento'].url | [0]");
        } catch (_e) {
            href = null;
        }
        if (href) {
            fetchText(href).then((html) => {
                const parsed = parseUploadPageHtml(html);
                if (parsed.documentoReceberHref) {
                    ajaxGetUploadArvore(parsed.documentoReceberHref, queuedFiles, mode, result, queue, containerEl);
                } else if (parsed.isPostFlow) {
                    ajaxPostUploadArvore(parsed.doc, queuedFiles, mode, result, queue, containerEl);
                } else {
                    setPreviewError(elem, 'Link para upload n\u00E3o encontrado');
                }
            }).catch(() => setPreviewError(elem, 'Link para upload n\u00E3o encontrado'));
        } else {
            setPreviewError(elem, 'Link para incluir documento n\u00E3o encontrado. Processo est\u00E1 aberto na unidade?');
        }
    } else if (mode === 'save' && result) {
        const href = result.urlForm;
        const param = result.paramsForm;
        postSavedUpload({
            url: href,
            data: param,
            onSuccess: (htmlResult, xhr) => {
                const status = (xhr.responseURL || '').indexOf('acao=arvore_visualizar&acao_origem=documento_receber') !== -1;
                if (status) {
                    sendUploadArvore('upload', false, queue, containerEl);
                    getInfoArvoreLastDoc(htmlResult, xhr.responseURL, queue, containerEl);
                } else {
                    setPreviewError(elem, 'Não foi possível fazer o upload do arquivo');
                }
            }
        });
    }
}

export function ajaxPostUploadArvore(docOrJquery, queuedFiles, mode, result = false, arrayDropzone = arvoreDropzone, _containerUpload = null) {
    const doc = docOrJquery && docOrJquery.querySelector
        ? docOrJquery
        : (docOrJquery && docOrJquery[0] ? parseDocument(docOrJquery[0].outerHTML || '') : parseDocument(''));
    // When called with jQuery $html from legacy, re-parse via outerHTML is lossy — prefer Document
    let escolher;
    if (docOrJquery && docOrJquery.querySelector) {
        escolher = readEscolherTipoForm(docOrJquery);
    } else if (docOrJquery && typeof docOrJquery.find === 'function') {
        // jQuery object from lista path — convert
        const html = docOrJquery[0] ? (docOrJquery[0].ownerDocument ? new XMLSerializer().serializeToString(docOrJquery[0].ownerDocument) : '') : '';
        escolher = readEscolherTipoForm(parseDocument(html || String(docOrJquery.html && docOrJquery.html() || '')));
    } else {
        escolher = readEscolherTipoForm(doc);
    }
    postFormData(escolher.urlForm, escolher.param).then((htmlAnexo) => {
        submitUploadArvore(htmlAnexo, queuedFiles, mode, result, arrayDropzone, _containerUpload);
    });
}

export function ajaxGetUploadArvore(urlDocExterno, queuedFiles, mode, result, arrayDropzone, _containerUpload) {
    fetchText(urlDocExterno).then((htmlAnexo) => {
        submitUploadArvore(htmlAnexo, queuedFiles, mode, result, arrayDropzone, _containerUpload);
    });
}

export function submitUploadArvore(htmlAnexo, queuedFiles, mode, result, arrayDropzone, _containerUpload) {
    const parsed = parseUploadPageHtml(htmlAnexo);
    const meta = parsed.meta || parseInfraUploadMeta(htmlAnexo);
    const cadastro = parsed.cadastro;
    const param = { ...cadastro.fields };
    const extUpload = meta.extensions || [];
    if (extUpload.length > 0 && arrayDropzone) {
        if (typeof arrayDropzone.setAcceptedFiles === 'function') arrayDropzone.setAcceptedFiles(extUpload.join(','));
        else if (arrayDropzone.options) arrayDropzone.options.acceptedFiles = extUpload.join(',');
        if (typeof parent !== 'undefined' && parent.parent && typeof parent.parent.localStorageStorePro === 'function') {
            parent.parent.localStorageStorePro('arvoreDropzone_acceptedFiles', extUpload.join(','));
        }
    }

    const nexFileQueued = queuedFiles[0];
    if (!nexFileQueued) return;
    const modified = nexFileQueued.lastModifiedDate || (nexFileQueued.lastModified ? new Date(nexFileQueued.lastModified) : new Date());
    const txtDataElaboracao = (typeof moment === 'function')
        ? moment(modified).format('DD/MM/YYYY')
        : modified.toLocaleDateString('pt-BR');
    const nameFile = nexFileQueued.name;
    const removeAccents = (typeof parent !== 'undefined' && parent.parent && parent.parent.removeAcentos)
        || (typeof parent !== 'undefined' && parent.removeAcentos)
        || ((s) => s);
    const { selSerie, selSerieSelected } = resolveUploadSerie({
        fileName: nameFile,
        seriesOptions: cadastro.seriesOptions,
        defaultDocName: typeof getConfigValue === 'function' ? getConfigValue('newdocname') : '',
        removeAccents
    });
    const nameDoc = buildUploadDocumentTitle(nameFile, selSerieSelected && selSerieSelected.name);

    let valueSigilo = typeof parent !== 'undefined' && parent.parent && typeof parent.parent.getConfigValue === 'function'
        ? parent.parent.getConfigValue('newdocsigilo')
        : '';
    valueSigilo = (valueSigilo && valueSigilo.indexOf('|') !== -1) ? valueSigilo.split('|') : false;
    const checkCfg = (k) => (typeof parent !== 'undefined' && parent.parent && parent.parent.checkConfigValue)
        ? parent.parent.checkConfigValue(k)
        : (typeof checkConfigValue === 'function' && checkConfigValue(k));
    const getCfg = (k) => (typeof parent !== 'undefined' && parent.parent && parent.parent.getConfigValue)
        ? parent.parent.getConfigValue(k)
        : (typeof getConfigValue === 'function' && getConfigValue(k));

    const valueNivelAcesso = checkCfg('newdocnivel') ? '0' : (valueSigilo ? valueSigilo[1] : '0');
    param.selSerie = selSerie;
    param.hdnIdSerie = selSerie;
    param.rdoNivelAcesso = cadastro.checkedNivel != null ? cadastro.checkedNivel : valueNivelAcesso;
    param.hdnStaNivelAcessoLocal = param.rdoNivelAcesso;
    param.rdoFormato = (checkCfg('newdocformat') && getCfg('newdocformat') && String(getCfg('newdocformat')).indexOf('digitalizado') !== -1) ? 'D' : 'N';
    param.hdnFlagDocumentoCadastro = '2';
    param.hdnIdHipoteseLegal = valueSigilo ? valueSigilo[0] : param.selHipoteseLegal;
    param.selHipoteseLegal = param.hdnIdHipoteseLegal;
    param.selTipoConferencia = (checkCfg('newdocformat') && getCfg('newdocformat') && String(getCfg('newdocformat')).indexOf('digitalizado') !== -1 && String(getCfg('newdocformat')).indexOf('_') !== -1)
        ? String(getCfg('newdocformat')).split('_')[1]
        : '';
    param.hdnIdTipoConferencia = param.selTipoConferencia;
    param.txaObservacoes = '';
    param.txtDataElaboracao = txtDataElaboracao;
    param.txtNumero = typeof escapeComponent === 'function' ? escapeComponent(nameDoc) : encodeURIComponent(nameDoc);

    arrayDropzone.options.url = meta.urlUpload;
    arrayDropzone.options.params = {
        urlForm: cadastro.hrefForm,
        paramsForm: param,
        userUnidade: meta.userUnidade
    };
    arrayDropzone.processQueue();
}

export function getInfoArvoreLastDoc(dataResult, urlParent, arrayDropzone = arvoreDropzone, _containerUpload = null) {
    const containerEl = _containerUpload && _containerUpload.jquery ? _containerUpload[0] : (_containerUpload || uploadRoot());
    const indexUpload = getUploadIndex(containerEl);
    const param = typeof getParamsUrlPro === 'function' ? getParamsUrlPro(urlParent) : {};
    const queue = (arrayDropzone && typeof arrayDropzone.getQueuedFiles === 'function')
        ? arrayDropzone
        : (parent.parent && parent.parent.arvoreDropzone);
    const queuedFiles = queue && queue.getQueuedFiles ? queue.getQueuedFiles() : [];
    const { urlArvore } = findArvoreUpdateTargets(dataResult, param.id_procedimento, param.id_documento);
    if (!urlArvore) return;
    fetchText(urlArvore).then((htmlArvore) => {
        const node = findDocumentoNoInArvoreHtml(htmlArvore, param.id_documento, param.id_procedimento);
        const elem = previewAt(indexUpload, containerEl);
        if (node && elem) {
            updatePreviewAfterSave(elem, {
                idDocumento: param.id_documento,
                href: node.href,
                title: node.title,
                icon: node.icon,
                ifrTarget: getIfrTarget()
            });
            if (typeof parent !== 'undefined' && parent.parent && typeof parent.parent.scrollToElementArvore === 'function') {
                setTimeout(() => parent.parent.scrollToElementArvore(param.id_documento), 500);
            }
        }
        setUploadIndex(containerEl, indexUpload + 1);
        if (queuedFiles.length === 0) {
            dropzoneAlertBoxInfo();
            setTimeout(() => { window.location.reload(); }, 500);
            if (typeof parent !== 'undefined' && parent.parent && typeof parent.parent.nextUploadFilesInProcess === 'function' && parent.parent.arvoreDropzone) {
                parent.parent.nextUploadFilesInProcess();
            }
        }
    });
}

export function dropzoneAlertBoxInfo() {
    if (!arvoreDropzone || typeof arvoreDropzone.getAcceptedFiles !== 'function') return;
    const accepted = arvoreDropzone.getAcceptedFiles();
    const rejected = arvoreDropzone.getRejectedFiles();
    let html = '';
    const htmlRejected = rejected.length > 0
        ? '<div style="margin: 10px 0;"><i class="fas fa-exclamation-triangle vermelhoColor" style="margin-right: 5px;"></i>' +
          rejected.length + ' ' + (rejected.length === 1 ? 'arquivo rejeitado' : 'arquivos rejeitados') + ' pelo SEI:' +
          rejected.map((value) => {
              const msg = (value._queueItem && value._queueItem.errorMessage)
                  || (value.previewElement && value.previewElement.querySelector('[data-seipro-file-error], .dz-error-message span')
                      && value.previewElement.querySelector('[data-seipro-file-error], .dz-error-message span').textContent)
                  || '';
              return '<div style="font-size: 9pt; background: #eaeaea; border-radius: 5px; padding: 5px; margin: 8px 5px;"><i class="fas fa-file cinzaColor" style="margin-right: 5px;"></i>' +
                  value.name +
                  '<span style="background: #fff0f0;display: block;margin-top: 5px;padding: 3px 5px;border-radius: 5px;color: #f54040;">' + msg + '</span></div>';
          }).join('') +
          '</div>'
        : '';
    const htmlNotify =
        '<div>' +
        '   <span id="no_notify" class="no_notifyPro" data-notify="upload" style="font-size: 8pt; margin: 10px 0; display: block;">' +
        '       <input data-seipro-arvore-action="no-notify-upload" type="checkbox" id="no_notifyPro_input">' +
        '       <label class="txt_cinza" id="no_notifyPro_label" for="no_notifyPro_input">' +
        '           Ok, n\u00E3o avisar novamente.' +
        '       </label>' +
        '   </span>' +
        '</div>';

    if (accepted.length > 0) {
        html = accepted.length + ' ' + (accepted.length === 1 ? 'arquivo enviado' : 'arquivos enviados') + ' com sucesso!';
        html = (rejected.length > 0) ? html + htmlRejected : html + htmlNotify;
        if (!getOptionsPro('noNotify_upload') || rejected.length > 0) {
            parent.alertaBoxPro('Sucess', 'check-circle', html);
        }
    } else if (rejected.length > 0) {
        parent.alertaBoxPro('Error', 'exclamation-triangle', htmlRejected);
    }
}

export function initUploadArvore(TimeOut = 9000) {
    if (TimeOut <= 0) return;
    if (document.querySelector('div#divArvore')) {
        if (typeof arvoreDropzone !== 'object' || !arvoreDropzone) {
            loadUploadArvore();
        }
        return;
    }
    setTimeout(() => {
        initUploadArvore(TimeOut - 100);
        if (typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage')) {
            console.log('Reload initUploadArvore => ' + TimeOut);
        }
    }, 500);
}

// Keep legacy alias names used by lista / alerts
export { formatFileSize };
