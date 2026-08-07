// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/**
 * Lista de processos — upload files in process.
 * (ponte temporária: jQuery/DOM legado; fatia do antigo body.js)
 */
import { createFileQueue } from '../../shared/ui/file-queue.js';

import { createSortable } from '../../shared/ui/sortable.js';

import { uploadPreviewHomeHtml, dropzoneInfoHoverHtml } from '../arvore/templates.js';

import { resolveDropzoneIcon } from '../arvore/domain.js';

export function initUploadFilesInProcess() {
    setUploadFilesInProcess();
}
export function getListIdProtocoloSelected() {
    var tableProc = $('#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado');
    var listId = tableProc.find(elemCheckbox+':checked').map(function(){ return $(this).val() }).get();
    if (listId.length === 0) {
        listId = tableProc.find('tr.infraTrMarcada').map(function(){
            var value = $(this).find(elemCheckbox).val();
            if (typeof value !== 'undefined' && value !== null && value !== '') {
                return value;
            }
            return $(this).attr('id') ? $(this).attr('id').replace(/^P/, '') : false;
        }).get();
    }
    return (listId.length > 0) ? listId : false;
}
export function setUploadFilesInProcess(load_upload = true) {
    var listId = getListIdProtocoloSelected();
    if (listId.length > 0) {
        $('#frmCheckerProcessoPro').remove();
        loadIframeProcessUpload(listId[0], load_upload);
    }
}
export function loadIframeProcessUpload(idProcedimento, load_upload = true) {
    if ( $('#frmCheckerProcessoPro').length == 0 ) { getCheckerProcessoPro(); }

    var url = 'controlador.php?acao=procedimento_trabalhar&id_procedimento='+idProcedimento;
    $(divComandos+' .iconUpload_new').addClass('iconLoading');

    $('#frmCheckerProcessoPro').attr('src', url).unbind().on('load', function(){
        var ifrArvore = $('#frmCheckerProcessoPro').contents().find('#ifrArvore');
            contentW = (typeof getIframeArvoreWindow === 'function') ? getIframeArvoreWindow() : (typeof ifrArvore[0] !== 'undefined' && ifrArvore[0] ? ifrArvore[0].contentWindow : null);
            $(divComandos+' .iconUpload_new').removeClass('iconLoading');
            if (load_upload) {
                getUploadFilesInProcess();
            } else {
                contentW.sendUploadArvore('upload', false, arvoreDropzone, $(containerUpload));
            }
    });
}
export function completeIdProtocoloSelected() {
    var listId = getListIdProtocoloSelected();
        $('#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado').find('tr#P'+listId[0]).find(elemCheckbox+':checked').trigger('click');
}
export function nextUploadFilesInProcess() {
    completeIdProtocoloSelected();

    if (getListIdProtocoloSelected()) {
        cleanUploadFilesInProcess();
        setUploadFilesInProcess(false);
    } else {
        removeUploadFilesInProcess();
        alertaBoxPro('Sucess', 'check-circle', 'Arquivos enviados com sucesso!');
    }
}
export function removeUploadFilesInProcess() {
    $('#uploadListPro').remove();
    $('.dz-infoupload-home, [data-seipro-arvore-upload-overlay]').remove();
    var root = (typeof containerUpload === 'string') ? document.querySelector(containerUpload) : containerUpload;
    if (root && root.dataset) root.dataset.seiproUploadIndex = '0';
    if (typeof arvoreDropzone !== 'undefined' && arvoreDropzone && typeof arvoreDropzone.destroy === 'function') arvoreDropzone.destroy();
    arvoreDropzone = false;
}
export function onClickRemoveDragHoverHome() {
    var root = document.querySelector(containerUpload) || document.body;
    function handler() {
        if (root.classList.contains('dz-drag-hover') || root.classList.contains('seipro-arvore-upload-hover')) {
            root.classList.remove('dz-drag-hover', 'seipro-arvore-upload-hover');
            root.removeEventListener('click', handler);
        }
    }
    root.addEventListener('click', handler);
}
export function cleanUploadFilesInProcess() {
    var list = document.getElementById('uploadListPro');
    if (list) list.innerHTML = '';
    var root = document.querySelector(containerUpload) || document.body;
    if (root && root.dataset) root.dataset.seiproUploadIndex = '0';
    if (arvoreDropzone && arvoreDropzone.files && arvoreDropzone.files.length) {
        var kept = arvoreDropzone.files.slice();
        arvoreDropzone.removeAllFiles();
        kept.forEach(function (f) { arvoreDropzone.addFile(f); });
    }
}
export function getUploadFilesInProcess() {
    var root = document.querySelector(containerUpload) || document.body;
    var _containerUpload = $(containerUpload);
    if (!document.getElementById('uploadListPro')) {
        var list = document.createElement('div');
        list.id = 'uploadListPro';
        var overlayWrap = document.createElement('div');
        overlayWrap.innerHTML = dropzoneInfoHoverHtml();
        var overlayEl = overlayWrap.firstElementChild;
        overlayEl.classList.add('dz-infoupload-home');
        var cancelBtn = overlayEl.querySelector('[data-seipro-arvore-action="dropzone-cancel"]');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', function (event) {
                event.preventDefault();
                if (typeof dropzoneCancelInfo === 'function') dropzoneCancelInfo(event);
                removeUploadFilesInProcess();
            });
        }
        var anchor = root.querySelector(divComandos);
        if (!anchor && _containerUpload.find(divComandos).length) anchor = _containerUpload.find(divComandos)[0];
        if (anchor && anchor.parentNode) {
            anchor.parentNode.insertBefore(list, anchor.nextSibling);
            anchor.parentNode.insertBefore(overlayEl, list.nextSibling);
        } else {
            root.appendChild(list);
            root.appendChild(overlayEl);
        }
        if (root.dataset) root.dataset.seiproUploadIndex = '0';
    }

    function createHomePreview(item) {
        var iconPath = resolveDropzoneIcon(item.file.type, SeiPro.sei.adapter.isNewSEI());
        var iconSrc = (iconPath.indexOf('svg/') === 0 || iconPath.indexOf('imagens/') === 0)
            ? '/infra_css/' + iconPath.replace(/^\/infra_css\//, '')
            : (iconPath.startsWith('/') ? iconPath : '/infra_css/' + iconPath);
        var wrap = document.createElement('div');
        wrap.innerHTML = uploadPreviewHomeHtml({
            newSEI: SeiPro.sei.adapter.isNewSEI(),
            ifrTarget: typeof ifrVisualizacao_ !== 'undefined' ? ifrVisualizacao_ : 'ifrVisualizacao',
            iconSrc: iconSrc,
            iconData: iconPath,
            size: item.file.size,
            name: item.uploadName || item.file.name
        });
        return wrap.firstElementChild;
    }

    arvoreDropzone = createFileQueue({
        previewsContainer: document.getElementById('uploadListPro'),
        clickable: '#dz-infoupload',
        paramName: 'filArquivo',
        timeout: 900000,
        renameFile: function (file) {
            var remove = (typeof removeAcentos === 'function') ? removeAcentos : function (s) { return s; };
            return remove(file.name).replace(/[&\/\\#+()$~%'":*?<>{}]/g, '_');
        },
        createPreview: createHomePreview,
        onAddedFiles: function () {
            if (typeof dropzoneCancelInfo === 'function') dropzoneCancelInfo();
            if (verifyConfigValue('sortbeforeupload') && arvoreDropzone.getQueuedFiles().length > 1) {
                sortUploadArvore();
            } else {
                contentW.sendUploadArvore('upload', false, arvoreDropzone, _containerUpload);
            }
        },
        onSuccess: function (file) {
            var params = arvoreDropzone.options.params;
            var response = String(file.xhr.response || '').split('#');
            params.paramsForm.hdnAnexos = encodeUrlUploadArvore(response, params);
            var postData = '';
            for (var k in params.paramsForm) {
                if (postData !== '') postData = postData + '&';
                var valor = (k=='hdnAnexos') ? params.paramsForm[k] : escapeComponent(params.paramsForm[k]);
                valor = (k=='txtNumero' && typeof encodeURI_toHex === 'function') ? encodeURI_toHex(String(params.paramsForm[k]).normalize('NFC')) : valor;
                postData = postData + k + '=' + valor;
            }
            params.paramsForm = postData;
            contentW.sendUploadArvore('save', params, arvoreDropzone, _containerUpload);
        },
        onError: function () {
            contentW.sendUploadArvore('upload', false, arvoreDropzone, _containerUpload);
        }
    });

    root.addEventListener('dragleave', function () {
        root.classList.add('dz-drag-hover', 'seipro-arvore-upload-hover');
        onClickRemoveDragHoverHome();
    });

    var extUpload = localStorageRestorePro('arvoreDropzone_acceptedFiles');
    if (extUpload !== null && typeof arvoreDropzone.setAcceptedFiles === 'function') {
        arvoreDropzone.setAcceptedFiles(extUpload);
    }
}
export function sendUploadArvoreHomeStart() {
    contentW.sendUploadArvore('upload', false, arvoreDropzone, $(containerUpload));
}
export function sortUploadArvore() {
    var htmlUpload =
        '<div id="divUploadDoc" class="panelDadosArvore seipro-arvore-upload-confirm" style="margin: 15px 0; padding: 1.2em 0 0 0 !important;">' +
        '   <a style="cursor:pointer;" data-seipro-arvore-action="send-upload-home" class="newLink newLink_confirm">' +
        '       <i class="fas fa-upload azulColor"></i>' +
        '       <span style="font-size:1.2em;color: #fff;"> Enviar documentos</span>' +
        '   </a>' +
        '</div>';

    var old = document.getElementById('divUploadDoc');
    if (old) old.remove();
    var list = document.getElementById('uploadListPro');
    if (!list) return;
    list.insertAdjacentHTML('afterend', htmlUpload);
    createSortable(list, {
        items: '.dz-file-preview',
        handle: '.dz-filename',
        onUpdate: function (ordered) {
            if (arvoreDropzone && typeof arvoreDropzone.reorderByPreview === 'function') {
                arvoreDropzone.reorderByPreview(ordered);
            }
        }
    });
    var sendBtn = document.querySelector('[data-seipro-arvore-action="send-upload-home"]');
    if (sendBtn && !sendBtn.__bound) {
        sendBtn.__bound = true;
        sendBtn.addEventListener('click', function (e) {
            e.preventDefault();
            sendUploadArvoreHomeStart();
        });
    }
}
