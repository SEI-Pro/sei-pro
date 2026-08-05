/**
 * Editor module — migrated from body.js (CKEditor 4 / SEI 4.1).
 * Uses lib/domq.js (`q`) instead of the jQuery library.
 */
import { q } from '../lib/domq.js';
import { state } from '../state.js';
import { api } from '../api.js';

export function initPasteImgToBase64(editor) {
    if (editor.addFeature) {
        editor.addFeature({
            allowedContent: 'img[alt,id,!src]{width,height};'
        });
    }
    var editableElement = editor.editable ? editor.editable() : editor.document;
    editableElement.on("paste", api.onPastePro, null, {editor: editor});
}

export function onPastePro(event) {
    var editor = event.listenerData && event.listenerData.editor;
    var $event = event.data.$;
    var clipboardData = $event.clipboardData;
    var found = false;
    var imageType = /^image/;
    if (!clipboardData) {
        return;
    }
    return Array.prototype.forEach.call(clipboardData.types, function (type, i) {
        if (found) {
            return;
        }
        if (type.match(imageType) || clipboardData.items[i].type.match(imageType)) {
            api.readImageAsBase64(clipboardData.items[i], editor);
            return found = true;
        }
    });
}

export function readImageAsBase64(item, editor) {
    if (!item || typeof item.getAsFile !== 'function') {
        return;
    }
    var file = item.getAsFile();
    var reader = new FileReader();
    reader.onload = function (evt) {
        var element = editor.document.createElement('img', {
            attributes: {
                src: evt.target.result,
                class: 'img-base64'
            }
        });

        if (state.qualidadeImagens > 0) api.qualityImages(element.$, element.$);
        // We use a timeout callback to prevent a bug where insertElement inserts at first caret position
        setTimeout(function () {
            editor.insertElement(element);
            var select = editor.getSelection().getStartElement();
            var p = q(select.$).closest('p');
                p.find('img[src*="http"]').not('.img-base64').remove();
        }, 10);
    };
    reader.readAsDataURL(file);
}
export function loadPasteImgToBase64() {
	q(state.txaEditor).each(function(index){
		var idEditor_ = q(this).attr('id').replace('cke_', '');
		var iframe_ = q('iframe[title*="'+idEditor_+'"]').contents();
		if ( iframe_.find('body').attr('contenteditable') == 'true' ) {
			state.oEditor = CKEDITOR.instances[idEditor_];
				api.initPasteImgToBase64(state.oEditor);
		}
	});
}
export function tableSorterPro( editor ) {
    if ( editor.contextMenu && typeof editor.getMenuItem('sortasc') === 'undefined' ) {
        editor.addMenuGroup( 'tableproGroup' );
        editor.addMenuGroup( 'tablesorterGroup' );
        editor.addMenuItem( 'addestilo', {
            label: 'Adicionar Estilo',
            icon: URL_SPRO+'icons/editor/addestilotabela.png',
            command: 'addestilo',
            group: 'tableproGroup'
        });
        editor.addMenuItem( 'clonetable', {
            label: 'Duplicar Tabela',
            icon: URL_SPRO+'icons/editor/duplicartabela.png',
            command: 'clonetable',
            group: 'tableproGroup'
        });
        editor.addMenuItem( 'sortasc', {
            label: 'Classificar A \u2192 Z',
            command: 'sortasc',
            group: 'tablesorterGroup'
        });
        editor.addMenuItem( 'sortdesc', {
            label: 'Classificar Z \u2192 A',
            command: 'sortdesc',
            group: 'tablesorterGroup'
        });

        editor.contextMenu.addListener( function( element ) {
            if ( element.getAscendant( 'tr', true ) ) {
                return { addestilo: CKEDITOR.TRISTATE_OFF};
            }
        });
        editor.contextMenu.addListener( function( element ) {
            if ( element.getAscendant( 'tr', true ) ) {
                return { clonetable: CKEDITOR.TRISTATE_OFF};
            }
        });
        editor.contextMenu.addListener( function( element ) {
            if ( element.getAscendant( 'tr', true ) ) {
                return { sortasc: CKEDITOR.TRISTATE_OFF};
            }
        });
        editor.contextMenu.addListener( function( element ) {
            if ( element.getAscendant( 'tr', true ) ) {
                return { sortdesc: CKEDITOR.TRISTATE_OFF};
            }
        });

        editor.addCommand( 'addestilo', {
            exec: function( editor ) {
                editor.openDialog('TabelaSEI');
            }
        });
        editor.addCommand( 'sortasc', {
            exec: function( editor ) {
                tablesort('asc');
            }
        });
        editor.addCommand( 'sortdesc', {
            exec: function( editor ) {
                tablesort('desc');
            }
        });
        editor.addCommand( 'clonetable', {
            exec: function( editor ) {
                cloneTablePro();
            }
        });

        var cloneTablePro = function(){
            var selection = editor.getSelection();
            var select = selection.getStartElement();
            if ( select ){
                editor.focus();
                editor.fire('saveSnapshot');
                var tableElement = q(select.$).closest('table');
                var htmlTable = tableElement[0].outerHTML;
                var newLine = '<p class="Texto_Justificado_Recuo_Primeira_Linha"><br></p>';
                tableElement.after(newLine+htmlTable);
                editor.fire('saveSnapshot');
            }
        }
        var tablesort = function( order ){
            var selection = editor.getSelection();
            var element = selection.getStartElement();
            if ( element ){
                editor.focus();
                editor.fire('saveSnapshot');
                var column_nr = element.getAscendant( { td:1, th:1 }, true ).getIndex();
                var table = element.getAscendant({table:1});
                var tbody = table.getElementsByTag('tbody').getItem(0);
                if (tbody == undefined) tbody = table;
                var items = tbody.$.childNodes;
                var itemsArr = [];
                for (var i in items) {
                    if (items[i].nodeType == 1) // get rid of the whitespace text nodes
                        itemsArr.push(items[i]);
                }

                itemsArr.sort(function(a, b) {
                    var aText = a.childNodes[column_nr].innerText.trim();
                    var bText = b.childNodes[column_nr].innerText.trim();
                    if (!aText || 0 === aText.length)
                        if (!bText || 0 === bText.length) return 0;
                        else return 1;
                    if (!bText || 0 === bText.length) return -1;
                    if (order == 'desc') return bText.localeCompare(aText, undefined, {numeric:true});
                    return aText.localeCompare(bText, undefined, {numeric:true});
                });

                for (i = 0; i < itemsArr.length; ++i) {
                  tbody.$.appendChild(itemsArr[i]);
                }
                editor.fire('saveSnapshot');
            }
        }
    }
}
export function initContextMenuPro() {
    q(state.txaEditor).each(function(){
            var idEditor_ = q(this).attr('id').replace('cke_', '');
            if (q('iframe[title*="'+idEditor_+'"]').length == 0) {
                q(this).find('iframe').attr('title', 'Editor de Rich Text, '+idEditor_);
            }
        });
        setTimeout(function () {
            q(state.txaEditor).each(function(index){
                var idEditor_ = q(this).attr('id').replace('cke_', '');
                var iframe_ = q('iframe[title*="'+idEditor_+'"]').contents();
                if ( iframe_.find('body').attr('contenteditable') == 'true' ) {
                    var oEditor_ = CKEDITOR.instances[idEditor_];
                        api.tableSorterPro(oEditor_);
                        api.menuCopyStyle(oEditor_);
                        api.menuBlockEdition(oEditor_);
                        if (restrictConfigValue('ferramentasia') && typeof api.menuPlataformAI === 'function') {
                            api.menuPlataformAI(oEditor_);
                        }
                        if (checkConfigValue('editarimagens')) {
                            api.editImgPro(oEditor_);
                        }
                }
            });
        }, 2000);
}
// INSERE FUNCAO ARRASTA E SOLTA PARA IMAGENS
export function initDropImages() {
    if (checkConfigValue('editarimagens')) {
        setTimeout(function () {
            q('iframe.cke_wysiwyg_frame').each(function(index){
                var iframe = q(this).contents();
                var instanceIframe = q(this).attr('title');
                    instanceIframe = (typeof instanceIframe !== 'undefined') ? instanceIframe.split(',')[1].trim() : '';
                if ( iframe.find('body').attr('contenteditable') == 'true' ) {
                    iframe.find('body').attr('data-editor', instanceIframe).unbind().on('drop dragdrop',function(e){
                        var items = e.originalEvent.dataTransfer.items;
                        if (typeof items !== 'undefined') {
                            var currentEditor = CKEDITOR.instances[q(e.currentTarget).data('editor')];
                            if (typeof currentEditor !== 'undefined') {
                                for (var i = 0; i < items.length; i++) {
                                    if (items[i].type.indexOf("image") !== -1) {
                                        api.readImageAsBase64(items[i], currentEditor);
                                    }
                                }
                            }
                        }
                    });
                    api.setOnBodyActs(iframe);
                }
            });
        }, 1000);
    }
}
export function qualityImages( src, dst, quality, type) {
    var tmp = new Image(),
        canvas, context, cW, cH;

        type = type || 'image/jpeg';
        quality = quality || state.qualidadeImagens*0.01;

        cW = src.naturalWidth;
        cH = src.naturalHeight;

        tmp.src = src.src;
        tmp.onload = function() {
            canvas = document.createElement( 'canvas' );

            cW /= 2;
            cH /= 2;

            if ( cW < src.width ) cW = src.width;
            if ( cH < src.height ) cH = src.height;

            canvas.width = cW;
            canvas.height = cH;
            context = canvas.getContext( '2d' );
            context.drawImage( tmp, 0, 0, cW, cH );

            dst.src = canvas.toDataURL( type, quality );

            if ( cW <= src.width || cH <= src.height )
                return;

            tmp.src = dst.src;
            setTimeout(() => { api.removeDataCkeSavedImg() }, 500);
        }
}
// INSERE LINK DE DOCUMENTO PUBLICO
api.initPasteImgToBase64 = initPasteImgToBase64;
api.onPastePro = onPastePro;
api.readImageAsBase64 = readImageAsBase64;
api.loadPasteImgToBase64 = loadPasteImgToBase64;
api.tableSorterPro = tableSorterPro;
api.initContextMenuPro = initContextMenuPro;
api.initDropImages = initDropImages;
api.qualityImages = qualityImages;
