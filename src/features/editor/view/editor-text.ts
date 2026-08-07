// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/**
 * Editor module — migrated from body.js (CKEditor 4 / SEI 4.1).
 * Uses lib/domq.js (`q`) instead of the jQuery library.
 */
import { q } from '../lib/domq.js';
import { state } from '../state.js';
import { api } from '../api.js';
import { extractTextWithNumbering } from '../domain.js';
import { extractTextFromHtml } from '../domain/html-text.js';
import { bindEditorFocus, collectEditorText } from '../view.js';

export function repareBgTableColor(iframe) {
    iframe.find('span[style*="background-color"],tr[style*="background-color"],td[style*="background-color"]').each(function(){
        api.setBgTableColor(this);
    });
}
export function setBgTableColor(this_) {
    var bgColor = q(this_).css('background-color');
    if (typeof bgColor !== 'undefined' && bgColor !== null) {
        var brightness = getBrightnessColor(rgbToHexString(bgColor));
        var textColour = (brightness > 125) ? 'black' : 'white';
        q(this_).addClass('dark-mode-color-'+textColour);
    }
}
export function extrairTextoComNumeracao(html) {
    return extractTextFromHtml(html, {
        parseHtml: (source) => new DOMParser().parseFromString(source, 'text/html'),
        extract: extractTextWithNumbering
    });
}
export function getAllTextEditor(extract_number = false) {
    return collectEditorText(CKEDITOR.instances, {
        extractNumber: extract_number,
        extractNumbered: api.extrairTextoComNumeracao,
        readHtml: (instance) => instance.getData(),
        readText: (html) => q('<div>').html(html).text()
    });
}
export function getSelectedHtmlFromCKEditor() {
    const selection = state.oEditor.getSelection();
    const range = selection && selection.getRanges()[0];

    if (range) {
        const fragment = range.clone().cloneContents();
        const container = new CKEDITOR.dom.element('div');
        container.append(fragment);
        return container.getHtml();
    }

    return '';
}
export function setCKEDITOR_instances(force = false) {
    bindEditorFocus(CKEDITOR.instances, function(e) { api.setCKEDITOR_SEIPRO(e); });
    for (var id in CKEDITOR.instances) {
        CKEDITOR.instances[id].setKeystroke(CKEDITOR.ALT + 48 /*0*/, false); // desabilita o popup de acessibilidade, que impede acessar o caractere \u00BA no mac (option+0)
    }
    if (force) {
        api.setCKEDITOR_SEIPRO({editor: force});
    }
}
export function setCKEDITOR_SEIPRO(e) {
    // Fill some global var here
    state.idEditor = e.editor.name;
    state.oEditor = CKEDITOR.instances[state.idEditor];
    state.iframeEditor = q('#cke_'+state.idEditor).find('iframe').eq(0).contents();
    q('#state.idEditor').val(state.idEditor);
    if ( state.iframeEditor.find('body').attr('contenteditable') == 'true' || state.frmEditor.length == 0) {
        q('#cke_'+state.idEditor).find('.cke_iconPro').removeClass('cke_button_disabled');
    }
    if (checkConfigValue('editarimagens')) api.editImgPro(oEditor);
    api.loadResizeImg();
    if (typeof insertFontIcon === 'function') {
        insertFontIcon('head',q('iframe[title*="'+state.idEditor+'"]').contents());
    }
    if (checkConfigValue('teclasatalho')) api.stylesEditorKeystroke();
    api.instanceDitadoPro(state.oEditor);
    api.checkHostLimitIcons();
}
export function checkHostLimitIcons() {
    if (checkHostLimit()) {
        var elemEditor = q('#cke_'+state.idEditor);
            elemEditor.find('.getCitacaoDocumentoButtom').addClass('cke_button_disabled');
            elemEditor.find('.getDadosProcessoButtom').addClass('cke_button_disabled');
    }
}
// Adiciona quebra de pagina
api.repareBgTableColor = repareBgTableColor;
api.setBgTableColor = setBgTableColor;
api.extrairTextoComNumeracao = extrairTextoComNumeracao;
api.getAllTextEditor = getAllTextEditor;
api.getSelectedHtmlFromCKEditor = getSelectedHtmlFromCKEditor;
api.setCKEDITOR_instances = setCKEDITOR_instances;
api.setCKEDITOR_SEIPRO = setCKEDITOR_SEIPRO;
api.checkHostLimitIcons = checkHostLimitIcons;
