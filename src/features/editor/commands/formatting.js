/**
 * Editor module — migrated from body.js (CKEditor 4 / SEI 4.1).
 * Uses lib/domq.js (`q`) instead of the jQuery library.
 */
import { q } from '../lib/domq.js';
import { state } from '../state.js';
import { api } from '../api.js';

export function getPageBreak(this_) {
    api.setParamEditor(this_);

    var htmlBreakPage = '<div class="pageBreakPro" style="page-break-after: always"></div>';
    var select = state.oEditor.getSelection().getStartElement();
    var pElement = q(select.$).closest('p');
    if ( pElement.length ) {
        state.oEditor.focus();
        state.oEditor.fire('saveSnapshot');
        if (state.frmEditor.length) {
            state.iframeEditor.find(pElement).before(htmlBreakPage);
        } else {
            pElement.before(htmlBreakPage);
        }
        state.oEditor.fire('saveSnapshot');
    }
}
// Adiciona quebra de pagina
export function getSessionBreak(this_) {
    api.setParamEditor(this_);

    var htmlSessionPage = '<p class="sessionBreakPro" style="counter-reset: paragrafo-n1 paragrafo-n2 paragrafo-n3 paragrafo-n4 romano_maiusculo letra_minuscula item-n1 item-n2 item-n3 item-n4 "></p>';
    var select = state.oEditor.getSelection().getStartElement();
    var pElement = q(select.$).closest('p');
    if ( pElement.length ) {
        state.oEditor.focus();
        state.oEditor.fire('saveSnapshot');
        if (state.frmEditor.length) {
            state.iframeEditor.find(pElement).before(htmlSessionPage);
        } else {
            pElement.before(htmlSessionPage);
        }
        oEditor.fire('saveSnapshot');
    }
}
export function setNextElemEditor(element, callback = false) {
    var editorIfm = q('iframe[title*="'+state.idEditor+'"]');
    var selWin = editorIfm[0].contentWindow.getSelection();
    var selEnd = q(selWin.anchorNode.parentNode);

    if (typeof callback === 'function') callback(element);
    if (selEnd[0] != element[0]) api.setNextElemEditor(element.next(), callback);
}
// Altera o alinhamento do texto
export function setAlignText(this_, mode) {
    api.setParamEditor(this_);
    var select = state.oEditor.getSelection().getStartElement();
    var elementInit = q(select.$);
    api.setNextElemEditor(elementInit, function(element){
        var p = element.closest('p').attr('class');
        var newClass = '';
        if ( p == 'Texto_Alinhado_Esquerda' || p == 'Texto_Centralizado' || p == 'Texto_Alinhado_Direita' || p == 'Texto_Justificado' ) {
            if ( mode == 'left' ) { newClass = 'Texto_Alinhado_Esquerda' }
            if ( mode == 'center' ) { newClass = 'Texto_Centralizado' }
            if ( mode == 'right' ) { newClass = 'Texto_Alinhado_Direita' }
            if ( mode == 'justify' ) { newClass = 'Texto_Justificado' }
        } else if ( p == 'Tabela_Texto_Alinhado_Esquerda' || p == 'Tabela_Texto_Centralizado' || p == 'Tabela_Texto_Alinhado_Direita' || p == 'Tabela_Texto_Justificado' ) {
            if ( mode == 'left' ) { newClass = 'Tabela_Texto_Alinhado_Esquerda' }
            if ( mode == 'center' ) { newClass = 'Tabela_Texto_Centralizado' }
            if ( mode == 'right' ) { newClass = 'Tabela_Texto_Alinhado_Direita' }
            if ( mode == 'justify' ) { newClass = 'Tabela_Texto_Justificado' }
        } else if ( p == 'Texto_Alinhado_Esquerda_Maiusc' || p == 'Texto_Centralizado_Maiusculas' || p == 'Texto_Alinhado_Direita_Maiusc' || p == 'Texto_Justificado_Maiusculas' ) {
            if ( mode == 'left' ) { newClass = 'Texto_Alinhado_Esquerda_Maiusc' }
            if ( mode == 'center' ) { newClass = 'Texto_Centralizado_Maiusculas' }
            if ( mode == 'right' ) { newClass = 'Texto_Alinhado_Direita_Maiusc' }
            if ( mode == 'justify' ) { newClass = 'Texto_Justificado_Maiusculas' }
        }
        state.oEditor.focus();
        state.oEditor.fire('saveSnapshot');
        if ( newClass != '' ) {
            element.closest('p').removeAttr('style').attr('class', newClass);
        } else {
            element.closest('p').removeAttr('style').css('text-align', mode);
        }
        state.oEditor.fire('saveSnapshot');
        console.log('>> api.setAlignText ');
    });
}
export function openAlignText(this_) {
    if (q(this_).hasClass('cke_button_on')) {
        q(this_).addClass('cke_button_off').removeClass('cke_button_on').closest('.cke_top').find('.seipro-editor-align-menu').hide();
    } else {
        q(this_).addClass('cke_button_on').removeClass('cke_button_off').closest('.cke_top').find('.seipro-editor-align-menu').show();
    }
}
export function closeAlignText() {
    //var idEditor = $('#idEditor').val();
    q('#cke_'+idEditor).find('.getAlignButtom').addClass('cke_button_off').removeClass('cke_button_on').closest('.cke_top').find('.seipro-editor-align-menu').hide();
}

// Modifica o tamanho da fonte
export function changeFontSize(this_, mode) {
    api.setParamEditor(this_);
    var select = state.oEditor.getSelection().getStartElement();
    var fontSize = parseFloat(q(select.$).css('font-size'));
    var newFontSize = (mode=='up') ? fontSize+2 : fontSize-2;

    var style = new CKEDITOR.style({
        element: 'span',
        attributes: {
            'style': 'font-size: '+newFontSize+'px'
        }
    });
    if (newFontSize > 7 && newFontSize < 70 && api.hasSelection(state.oEditor)) {
        state.oEditor.focus();
        state.oEditor.fire('saveSnapshot');
        state.oEditor.applyStyle(style);
        state.oEditor.fire('saveSnapshot');
    }
}
// Adiciona/Remove marca de sigilo
api.getPageBreak = getPageBreak;
api.getSessionBreak = getSessionBreak;
api.setNextElemEditor = setNextElemEditor;
api.setAlignText = setAlignText;
api.openAlignText = openAlignText;
api.closeAlignText = closeAlignText;
api.changeFontSize = changeFontSize;
