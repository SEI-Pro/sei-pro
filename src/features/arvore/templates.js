/**
 * Árvore — HTML/template factories (markup extracted from the monolito).
 */
import { sticknotePresetRankIconHtml } from './domain.js';

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
        '<div id="dz-infoupload" class="dz-infoupload seipro-arvore-dz-info">' +
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

export { sticknotePresetRankIconHtml };
