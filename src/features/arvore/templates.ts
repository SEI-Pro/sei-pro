// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/**
 * Árvore — HTML/template factories (markup extracted from the monolito).
 * Visual hooks keep legacy dz-* class names so sei-pro.css continues to style
 * the queue; structural hooks use data-seipro-* / .seipro-arvore-*.
 */
import { sticknotePresetRankIconHtml } from './domain.js';
import { formatFileSize } from '../../shared/ui/file-queue.js';

export function clipboardSuccessStyleCss() {
    return [
        "#divMsgClipboard.msgGeral.msgSucesso {",
        "  margin-top: -50px !important;",
        "  padding: .4em;",
        "  border: .2em solid #d9d9d9;",
        "  background: #ffffaa;",
        "  box-shadow: 0 0 5px #a0a0a0;",
        "}"
    ].join('\n');
}

export function dropzoneInfoHoverHtml() {
    return (
        '<div id="dz-infoupload" class="dz-infoupload seipro-arvore-dz-info" data-seipro-arvore-upload-overlay>' +
        '   <span class="text">Arraste e solte aquivos aqui<br>ou clique para selecionar</span>' +
        '   <span class="cancel seipro-arvore-dz-cancel" data-seipro-arvore-action="dropzone-cancel">' +
        '       <i class="far fa-times-circle icon"></i>' +
        '       <span class="label">CANCELAR</span>' +
        '   </span>' +
        '</div>'
    );
}

export function loadingActionDocHtml(idDocumento) {
    return (
        '<span class="loading-action-doc seipro-arvore-loading-action" data-id="' + idDocumento + '">' +
        '<i class="fas fa-cog fa-spin" style="color: #017FFF; font-size: 10pt;"></i></span>'
    );
}

export function uploadConfirmBarHtml() {
    return (
        '<div id="divUploadDoc" class="panelDadosArvore seipro-arvore-upload-confirm" style="margin-top: 15px; padding: 1.2em 0 0 0 !important;">' +
        '   <a style="cursor:pointer;" data-seipro-arvore-action="send-upload" class="newLink newLink_confirm">' +
        '       <i class="fas fa-upload azulColor"></i>' +
        '       <span>Enviar documentos</span>' +
        '   </a>' +
        '</div>'
    );
}

/**
 * Preview row for a queued file (tree iframe). `opts.hasPasta` adds join spacing.
 */
export function uploadPreviewHtml(opts = {}) {
    const hasPasta = !!opts.hasPasta;
    const pathArvore = opts.pathArvore || '/infra_js/arvore/';
    const ifrTarget = opts.ifrTarget || 'ifrVisualizacao';
    // PRF: file-type SVGs under svg/documento_* 404; GIFs are the reliable icons.
    const iconSrc = opts.iconSrc || '/infra_css/imagens/pdf.gif';
    const iconData = opts.iconData || 'imagens/pdf.gif';
    const sizeLabel = formatFileSize(opts.size || 0);
    const name = opts.name || '';
    return (
        '<div class="dz-preview dz-file-preview seipro-arvore-file-preview">' +
        '   <div class="dz-details">' +
        '       <span class="dz-error-mark"' + (hasPasta ? ' style="left:30px"' : '') + '>' +
        '           <i data-seipro-file-remove data-dz-remove class="fas fa-trash vermelhoColor" style="margin: 5px 8px;cursor: pointer; font-size: 10pt;"></i>' +
        '       </span>' +
        '       <span class="dz-error-message"' + (hasPasta ? ' style="left:30px"' : '') + '>' +
        '           <span data-seipro-file-error data-dz-errormessage></span>' +
        '       </span>' +
        '       <span class="dz-progress">' +
        '           <span class="dz-upload" data-seipro-file-progress data-dz-uploadprogress></span>' +
        '       </span>' +
        (hasPasta ? '<img style="margin-left: -3px;" src="' + pathArvore + 'empty.gif" align="absbottom">' : '') +
        '       <span class="anchorJoinPro" data-img="' + pathArvore + 'joinbottom.gif">' +
        '           <img src="' + pathArvore + 'join.gif" align="absbottom">' +
        '       </span>' +
        '       <a id="anchorImgID" data-img="' + iconData + '" style="margin-left: -4px;" class="clipboard" title="Clique para copiar o n\u00FAmero do protocolo para a \u00E1rea de transfer\u00EAncia">' +
        '           <img class="dz-link-icon" src="' + iconSrc + '" align="absbottom" id="iconID">' +
        '       </a>' +
        '       <span class="dz-progress-mark"><i class="fas fa-cog fa-spin" style="color: #017FFF; font-size: 10pt;"></i></span>' +
        '       <a id="anchorID" target="' + ifrTarget + '" class="dz-filename">' +
        '           <span data-dz-name title="">' + name.replace(/</g, '&lt;') + '</span>' +
        '       </a>' +
        '       <span class="dz-size" data-dz-size>' + sizeLabel + '</span>' +
        '       <span class="dz-remove" data-seipro-file-remove data-dz-remove><i class="fas fa-trash-alt vermelhoColor" style="cursor:pointer"></i></span>' +
        '   </div>' +
        '</div>'
    );
}

export function uploadPreviewHomeHtml(opts = {}) {
    const ifrTarget = opts.ifrTarget || 'ifrVisualizacao';
    const iconSrc = opts.iconSrc || '/infra_css/imagens/pdf.gif';
    const iconData = opts.iconData || 'imagens/pdf.gif';
    const sizeLabel = formatFileSize(opts.size || 0);
    const name = opts.name || '';
    return (
        '<div class="dz-preview dz-file-preview seipro-arvore-file-preview">' +
        '   <div class="dz-details">' +
        '       <span class="dz-error-mark"><i data-seipro-file-remove data-dz-remove class="fas fa-trash vermelhoColor" style="margin: 5px 8px;cursor: pointer; font-size: 10pt;"></i></span>' +
        '       <span class="dz-error-message"><span data-seipro-file-error data-dz-errormessage></span></span>' +
        '       <span class="dz-progress"><span class="dz-upload" data-seipro-file-progress data-dz-uploadprogress></span></span>' +
        '       <a id="anchorImgID" data-img="' + iconData + '" style="margin-left: -4px;" class="clipboard">' +
        '           <img class="dz-link-icon" src="' + iconSrc + '" align="absbottom" id="iconID">' +
        '       </a>' +
        '       <span class="dz-progress-mark"><i class="fas fa-cog fa-spin" style="color: #017FFF; font-size: 10pt;"></i></span>' +
        '       <a id="anchorID" target="' + ifrTarget + '" class="dz-filename">' +
        '           <span data-dz-name title="">' + name.replace(/</g, '&lt;') + '</span>' +
        '       </a>' +
        '       <span class="dz-size" data-dz-size>' + sizeLabel + '</span>' +
        '       <span class="dz-remove" data-seipro-file-remove data-dz-remove><i class="fas fa-trash-alt vermelhoColor" style="cursor:pointer"></i></span>' +
        '   </div>' +
        '</div>'
    );
}

export { sticknotePresetRankIconHtml };
