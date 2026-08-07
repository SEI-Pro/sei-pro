// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/**
 * Editor module — migrated from body.js (CKEditor 4 / SEI 4.1).
 * Uses lib/domq.js (`q`) instead of the jQuery library.
 */
import { q } from '../lib/domq.js';
import { state } from '../state.js';
import { api } from '../api.js';

export function setChosenInCke(multiple = false, max_width = '500px') {
    var minWidth = multiple ? '450px' : '200px';
    if (verifyConfigValue('substituiselecao')) {
        if (multiple) q('select.cke_dialog_ui_input_select').attr('multiple','multiple');
        q('div.cke_dialog_ui_input_select').css({'position':'absolute', 'max-width': max_width, 'min-width': minWidth});
        q('span.cke_dialog_ui_labeled_content').css({'height':'27px', 'display': 'flex'});
        q('select.cke_dialog_ui_input_select').each(function(){
            if (q('#'+q(this).attr('id')+'_chosen').length == 0) {
                initChosenReplace(multiple ? 'box_multiple' : 'box_init',this);
            } else {
                q(this).chosen("destroy").chosen({
                    placeholder_text_single: ' ',
                    no_results_text: 'Nenhum resultado encontrado',
                    normalize_search_text: function(text) {
                        return removeAcentos(text.toLowerCase());
                    }
                });
            }
        });
        setTimeout(function(){
            q('.cke_dialog_ui_labeled_content .chosen-container-single').css({'max-width': max_width, 'min-width': minWidth});
            if (multiple) {
                q('.cke_dialog_ui_labeled_content .chosen-container-multi').css('width', '-webkit-fill-available');
                q('.cke_dialog_ui_labeled_content .chosen-container-multi .chosen-choices').css({'max-height': '90px', 'overflow-y': 'auto'});
            }
        }, 800);
    }
}
export function hasSelection(editor) {
    var sel = editor.getSelection();
    var ranges = sel.getRanges();
    for (var i = 0, len = ranges.length; i < len; ++i) {
        if (!ranges[i].collapsed) {
            return true;
        }
    }
    return false;
}

// Aplica estilo a selecao
export function getElementStyleSelected(element) {
    var fontSize = (parseFloat(element.css('font-size')) == 16 && (element.closest('sub').length || element.closest('sup').length)) ? false : parseFloat(element.css('font-size'));
    var color = (element.css('color') == 'rgb(0, 0, 0)') ? false : element.css('color');
    var backgroundColor = (element.css('background-color') == 'rgba(0, 0, 0, 0)') ? false : element.css('background-color');
    var bold = (element.closest('strong').length) ? true : false;
    var underline = (element.closest('u').length) ? true : false;
    var italic = (element.closest('em').length) ? true : false;
    var strike = (element.closest('s').length) ? true : false;
    var subscript = (element.closest('sub').length) ? true : false;
    var superscript = (element.closest('sup').length) ? true : false;
    return {fontSize: fontSize, color: color, backgroundColor: backgroundColor, bold: bold, underline: underline, italic: italic, strike: strike, subscript: subscript, superscript: superscript}
}
export function setCopyStyle(this_) {
    api.setParamEditor(this_);
    api.actionCopyStyle(oEditor);
}
export function actionCopyStyle(editor) {
    var select = editor.getSelection().getStartElement();
    var element = q(select.$);
    var style = api.getElementStyleSelected(element);
    if (q('#cke_'+state.idEditor).find('.getCopyStyleButtom').hasClass('cke_button_on')) {
        api.removeCopyStyle();
    } else {
        sessionStorage.setItem('copyStylePro', JSON.stringify(style));
        element.closest('body').addClass('cke_copyformatting_active');
        q('#cke_'+state.idEditor).find('.getCopyStyleButtom').addClass('cke_button_on').removeClass('cke_button_off');
    }
}
export function getCopyStyle() {
    return JSON.parse(sessionStorage.getItem('copyStylePro'));
}
export function applyCopyStyle() {
    var select = state.oEditor.getSelection().getStartElement();
    var element = q(select.$);
    var p = element.closest('p').attr('class');
    var style = api.getCopyStyle();
    if (api.hasSelection(state.oEditor) || element.closest('body').hasClass('cke_copyformatting_active')) {
        q('#cke_'+state.idEditor).find('.getCopyStyleButtom').removeClass('cke_button_disabled');
    } else {
        q('#cke_'+state.idEditor).find('.getCopyStyleButtom').addClass('cke_button_disabled');
    }
    if (typeof style !== 'undefined' && api.hasSelection(state.oEditor) && element.closest('body').hasClass('cke_copyformatting_active')) {
        state.oEditor.focus();
        oEditor.fire('saveSnapshot');
        oEditor.fire('lockSnapshot');
        oEditor.execCommand('removeFormat');
        if (typeof style !== 'undefined' && style.backgroundColor && style.backgroundColor != '') {
            var styleBackgroundColor = new CKEDITOR.style({
                element: 'span',
                attributes: {
                    'style': 'background-color: '+style.backgroundColor
                }
            });
            state.oEditor.applyStyle(styleBackgroundColor);
        }
        if (typeof style !== 'undefined' && style.fontSize > 0 ) {
            var styleFontSize = new CKEDITOR.style({
                element: 'span',
                attributes: {
                    'style': 'font-size: '+style.fontSize+'px'
                }
            });
            state.oEditor.applyStyle(styleFontSize);
        }
        if (typeof style !== 'undefined' && style.bold) { oEditor.execCommand('bold'); }
        if (typeof style !== 'undefined' && style.underline) { oEditor.execCommand('underline'); }
        if (typeof style !== 'undefined' && style.italic) { oEditor.execCommand('italic'); }
        if (typeof style !== 'undefined' && style.strike) { oEditor.execCommand('strike'); }
        if (typeof style !== 'undefined' && style.subscript) { oEditor.execCommand('subscript'); }
        if (typeof style !== 'undefined' && style.superscript) { oEditor.execCommand('superscript'); }
        if (typeof style !== 'undefined' && style.color && style.color != '') {
            var styleColor = new CKEDITOR.style({
                element: 'span',
                attributes: {
                    'style': 'color: '+style.color
                }
            });
            state.oEditor.applyStyle(styleColor);
        }
        if (!window.event.altKey) { api.removeCopyStyle(); }
        element.closest('p').attr('class', p);
        oEditor.fire('unlockSnapshot');
        oEditor.fire('saveSnapshot');
    }
}
export function removeCopyStyle() {
    var select = state.oEditor.getSelection().getStartElement();
    var element = q(select.$);
    element.closest('body').removeClass('cke_copyformatting_active');
    sessionStorage.removeItem('copyStylePro');
    q('#cke_'+state.idEditor).find('.getCopyStyleButtom').addClass('cke_button_off').removeClass('cke_button_on');
}
export function menuCopyStyle( editor ) {
    if ( editor.contextMenu && typeof editor.getMenuItem('copystyle') === 'undefined' ) {
        editor.addMenuGroup( 'copystyleGroup', -10 * 3 );
        editor.addMenuItem( 'copystyle', {
            label: 'Copiar formata\u00E7\u00E3o',
            icon: URL_SPRO+'icons/editor/copiarformatacao.png',
            command: 'copystyle',
            group: 'copystyleGroup'
        });
        editor.contextMenu.addListener( function( element ) {
            if ( element.getAscendant( 'p', true ) && api.hasSelection(editor) ) {
                return { copystyle: CKEDITOR.TRISTATE_OFF};
            }
        });
        editor.addCommand( 'copystyle', {
            exec: function( editor ) {
                api.actionCopyStyle(editor);
            }
        });
    }
}
export function menuBlockEdition( editor ) {
    if ( editor.contextMenu && typeof editor.getMenuItem('blockedition') === 'undefined' ) {
        editor.addMenuGroup( 'blockGroup', -10 * 3 );
        editor.addMenuItem( 'blockedition', {
            label: 'Bloquear Edi\u00E7\u00E3o',
            icon: URL_SPRO+'icons/editor/blockedition.png',
            command: 'blockedition',
            group: 'blockGroup'
        });
        editor.contextMenu.addListener( function( element ) {
            if ( element.getAscendant( 'p', true ) && api.hasSelection(editor) ) {
                return { blockedition: CKEDITOR.TRISTATE_OFF};
            }
        });
        editor.addCommand( 'blockedition', {
            exec: function( editor ) {
                var sel = editor.getSelection();
                var select = sel.getStartElement();

                function setNextElem(element) {
                    var editorIfm = q('iframe[title*="'+state.idEditor+'"]');
                    var selWin = editorIfm[0].contentWindow.getSelection();
                    var selEnd = q(selWin.anchorNode.parentNode);
                    var selStart = q(selWin.focusNode.parentNode);
                    var editable = typeof element.attr('contenteditable') !== 'undefined' && element.attr('contenteditable') == 'false' ? true : false;
                        element.attr('contenteditable',editable);
                        // console.log(editable, element.attr('contenteditable'), selEnd[0],  element[0]);
                        if (!editable && selEnd[0] != element[0]) {
                            setNextElem(element.next());
                        }
                }

                var element = q(select.$);
                if (element.is('p')) {
                    setNextElem(element);
                }
            }
        });
    }
}
export function menuPlataformAI(editor) {
    if (editor.contextMenu && typeof editor.getMenuItem('plataform_ai') === 'undefined') {
        editor.addMenuGroup('openaiGroup', -10 * 3);
        editor.addMenuItem('plataform_ai', {
            label: 'Abrir Assistente IA',
            icon: URL_SPRO + 'icons/editor/ferramentasia.png',
            command: 'plataform_ai',
            group: 'openaiGroup'
        });
        editor.contextMenu.addListener(function () {
            if (api.hasSelection(editor)) {
                return { plataform_ai: CKEDITOR.TRISTATE_OFF };
            }
        });
        editor.addCommand('plataform_ai', {
            exec: function (ed) {
                if (typeof api.loadPlataformAI === 'function') {
                    api.loadPlataformAI(ed.container && ed.container.$);
                }
            }
        });
    }
}
export function stylesEditorKeystroke() {
    if (getOptionsPro('stylesEditor')) {
        q.each(getOptionsPro('stylesEditor'), function(i, v){
            state.oEditor.addCommand(v, {
                exec: function( editor ) {
                    var select = editor.getSelection().getStartElement();
                    var element = q(select.$);
                    if (element.is('p')) {
                        element.attr('class',v);
                    }
                }
            });
            if (i < 36) {
                var key = (i <= 9) ? 48+i : 55+i;
                    if (getConfigValue('combinacaoteclas') == 'combinacaoteclas_1') {
                        state.oEditor.setKeystroke(CKEDITOR.CTRL + CKEDITOR.ALT + CKEDITOR.SHIFT + key, v);
                    } else if (getConfigValue('combinacaoteclas') == 'combinacaoteclas_2') {
                        state.oEditor.setKeystroke(CKEDITOR.CTRL + CKEDITOR.SHIFT + key, v);
                    } else if (getConfigValue('combinacaoteclas') == 'combinacaoteclas_3') {
                        state.oEditor.setKeystroke(CKEDITOR.CTRL + CKEDITOR.ALT + key, v);
                    } else if (getConfigValue('combinacaoteclas') == 'combinacaoteclas_4') {
                        state.oEditor.setKeystroke(CKEDITOR.ALT + CKEDITOR.SHIFT + key, v);
                    } else {
                        state.oEditor.setKeystroke(CKEDITOR.CTRL + CKEDITOR.ALT + CKEDITOR.SHIFT + key, v);
                    }
            }
        });
        if (getOptionsPro('stylesEditor')) {
            q('a.cke_combo_button[href*="Estilos de Format"]').on('click',function(){
                var ckePanel = q('iframe[class="cke_panel_frame"]').contents();
                var style = '<style type="text/css" data-style="seipro-styleeditor">'+
                            '   .cke_panel_listItem a p {'+
                            '       overflow: hidden;'+
                            '   }'+
                            '   .cke_panel_listItem a {'+
                            '       padding-right: 160px;'+
                            '       position: relative;'+
                            '   }'+
                            '   sup {'+
                            '       position: absolute;'+
                            '       right: 10px;'+
                            '       font-family: monospace;'+
                            '       background: #ccc;'+
                            '       padding: 3px 5px;'+
                            '       border-radius: 5px;'+
                            '       opacity: 0.5;'+
                            '       top: calc(50% - 10px);'+
                            '   }'+
                            '</style>';
                if (ckePanel.find('style[data-style="seipro-styleeditor"]').length == 0) {
                    ckePanel.find('head').append(style);
                }
                    ckePanel.find('sup').remove();
                    var isMac = navigator.platform.toUpperCase().indexOf('MAC') !== -1 ? true : false;
                    q.each(getOptionsPro('stylesEditor'), function(i, v){
                        if (i < 36) {
                            var key = (i <= 9) ? 48+i : 55+i;
                            var combinacaoteclas = isMac ? 'CMD + OPTION + SHIFT' : 'CTRL + ALT + SHIFT';
                            if (getConfigValue('combinacaoteclas') == 'combinacaoteclas_1') {
                                combinacaoteclas = isMac ? 'CMD + OPTION + SHIFT' : 'CTRL + ALT + SHIFT';
                            } else if (getConfigValue('combinacaoteclas') == 'combinacaoteclas_2') {
                                combinacaoteclas = isMac ? 'CMD + SHIFT' : 'CTRL + SHIFT';
                            } else if (getConfigValue('combinacaoteclas') == 'combinacaoteclas_3') {
                                combinacaoteclas = isMac ? 'CMD + OPTION' : 'CTRL + ALT';
                            } else if (getConfigValue('combinacaoteclas') == 'combinacaoteclas_4') {
                                combinacaoteclas = isMac ? 'OPTION + SHIFT' : 'ALT + SHIFT';
                            }
                            ckePanel.find('li.cke_panel_listItem a[title="'+v+'"]').prepend('<sup>'+combinacaoteclas+' + <strong>'+String.fromCharCode(key)+'</strong></sup>');
                        }
                    });
            });
        }
    }
}
export function editImgPro( editor ) {
    if ( editor.contextMenu && !delayCrash && typeof editor.getMenuItem('ImageEditorPro') === 'undefined') {

        delayCrash = true;
        setTimeout(function(){ delayCrash = false }, 300);

        editor.removeMenuItem('image');

        editor.addMenuGroup( 'base64imageGroup', 30);
        editor.addMenuItem( 'base64imageItem', {
            label: 'Formatar Imagem',
            icon: URL_SPRO+'icons/editor/formatarimagem.png',
            command: 'base64imageDialog',
            group: 'base64imageGroup'
        });
        editor.contextMenu.addListener( function( element ) {
            if (element && element.getName() === "img") {
                editor.getSelection().selectElement(element);
                return { base64imageItem: CKEDITOR.TRISTATE_ON };
            }
            return null;
        });
        editor.addCommand( 'base64imageDialog', {
            exec: function( editor ) {
                api.openDialogUploadImgBase64(editor);
            }
        });

        editor.addMenuItem( 'ImageEditorPro', {
            label: 'Editar Imagem',
            icon: URL_SPRO+'icons/editor/editarimagem.png',
            command: 'ImageEditorPro',
            group: 'base64imageGroup'
        });
        editor.contextMenu.addListener( function( element ) {
            if (element && element.getName() === "img") {
                editor.getSelection().selectElement(element);
                return { ImageEditorPro: CKEDITOR.TRISTATE_ON };
            }
            return null;
        });
        editor.addCommand( 'ImageEditorPro', {
            exec: function( editor ) {
                api.openImageEditorPro(editor);
            }
        });

        editor.on("doubleclick", function(evt){
            if(evt.data.element && !evt.data.element.isReadOnly() && evt.data.element.getName() === "img") {
                evt.data.dialog = 'base64imageDialog';
                editor.getSelection().selectElement(evt.data.element);
            }
        });
    }
}

// Adiciona tabela rapida
api.setChosenInCke = setChosenInCke;
api.hasSelection = hasSelection;
api.getElementStyleSelected = getElementStyleSelected;
api.setCopyStyle = setCopyStyle;
api.actionCopyStyle = actionCopyStyle;
api.getCopyStyle = getCopyStyle;
api.applyCopyStyle = applyCopyStyle;
api.removeCopyStyle = removeCopyStyle;
api.menuCopyStyle = menuCopyStyle;
api.menuBlockEdition = menuBlockEdition;
api.menuPlataformAI = menuPlataformAI;
api.stylesEditorKeystroke = stylesEditorKeystroke;
api.editImgPro = editImgPro;
