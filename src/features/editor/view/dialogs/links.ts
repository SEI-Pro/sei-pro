// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/**
 * Editor module — migrated from body.js (CKEditor 4 / SEI 4.1).
 * Uses lib/domq.js (`q`) instead of the jQuery library.
 */
import { q } from '../../lib/domq.js';
import { state } from '../../state.js';
import { api } from '../../api.js';

export function loadResizeImg() {
	q(state.txaEditor).each(function(index){
		var idEditor_ = q(this).attr('id').replace('cke_', '');
		var iframe_ = q('iframe[title*="'+idEditor_+'"]').contents();
		if ( iframe_.find('body').attr('contenteditable') == 'true' ) {
			var oEditor_ = CKEDITOR.instances[idEditor_];
				initResizeImg(oEditor_);
				loadCSSResize(iframe_);
		}
	});
}
//// Insere o texto selecionado no documento no campo 'Texto vis\u00EDvel' do janela de propriedades do link
export function insertTextTotLink(idEditor) {
    var selectTxt = state.oEditor.getSelection().getSelectedText();
    if ( isValidHttpUrl(selectTxt) ) {
        var link = '<a href="'+selectTxt+'" target="_blank">'+selectTxt+'</a>';
            CKEDITOR.dialog.getCurrent().hide();
            state.oEditor.insertHtml(link);
    } else {
        setTimeout(function(){
            if ( typeof selectTxt !== 'undefined' && selectTxt != '' ) {
                CKEDITOR.dialog.getCurrent().getContentElement('general', 'contents').setValue(selectTxt);
            }
        }, 100);
    }
}
//// Insere o texto selecionado no documento no campo 'Protocolo' do janela de adicionar protocolo SEI
export function insertProtocoloOnBox(idEditor) {
    var selectTxt = state.oEditor.getSelection().getSelectedText();
    setTimeout(function(){
        if ( typeof selectTxt !== 'undefined' && selectTxt != '' ) {
            CKEDITOR.dialog.getCurrent().getContentElement('general', 'protocolo').setValue(selectTxt);
            document.getElementById(CKEDITOR.dialog.getCurrent().getButton('ok').domId).click();
        }
    }, 100);
}

export function openLinkPro(linkRef, idEditor) {
    var url = state.iframeEditor.find('a[data-reflinkpro="'+linkRef+'"]').attr('href');
    var win = window.open(url, '_blank');
    if (win) {
        win.focus();
    } else {
        alertaBoxPro('Error', 'exclamation-triangle', 'Por favor, permita popups para essa p\u00E1gina');
    }
}
export function removeLinkPro(linkRef, idEditor) {
    if ( iframeEditor.find('a[data-reflinkpro="'+linkRef+'"]').closest('span').attr('contenteditable') == 'false' ) {
        state.iframeEditor.find('a[data-reflinkpro="'+linkRef+'"]').closest('span').removeAttr('contenteditable');
    }
    state.iframeEditor.find('a[data-reflinkpro="'+linkRef+'"]').after(state.iframeEditor.find('a[data-reflinkpro="'+linkRef+'"]').html()).remove();
    state.iframeEditor.find('.linkDisplayPro').remove();
}
export function copyLinkPro(linkRef, idEditor) {
    var el = state.iframeEditor.find('a[data-reflinkpro="'+linkRef+'"]');
    var url = el.attr('href');
    copyToClipboard(url);
    el.find('.info').text('Link copiado!').show();
    setTimeout(function () {
        el.find('.info').text('').hide();
    }, 2000)
}
export function editLinkPro(idEditor) {
    state.oEditor.openDialog('editLinkPro');
}
export function getDialogLinkPro() {
      CKEDITOR.dialog.add( 'editLinkPro', function(editor)
      {
         return {
            title : 'Editar link',
            minWidth : 400,
            minHeight : 80,
            buttons: [ CKEDITOR.dialog.cancelButton, CKEDITOR.dialog.okButton ],
            onOk: function(event, a, b) {
                var urlLink = this.getContentElement( 'tab1', 'urlLink' ).getValue();
                var nomeLink = this.getContentElement( 'tab1', 'nomeLink' ).getValue();
                if ( urlLink != '' ) {
                        nomeLink = ( nomeLink == '' ) ? urlLink : nomeLink;
                    var select = state.oEditor.getSelection().getStartElement();
                    var aElement = q(select.$);
                    var linkRef = q('#refLinkProForm').val();
                        state.iframeEditor.find('a[data-reflinkpro="'+linkRef+'"]').attr('href', urlLink).attr('data-cke-saved-href', urlLink).text(nomeLink);
                    event.data.hide = true;
                } else {
                    alertaBoxPro('Error', 'exclamation-triangle', 'Digite um link');
					event.data.hide = false;
				}
            },
            onShow : function() {
                var select = state.oEditor.getSelection().getStartElement();
                var aElement = q(select.$);
                var linkRef = aElement.attr('data-reflinkpro');
                var idInputUrl = this.getContentElement( 'tab1', 'urlLink' )._.inputId;
                var idInputNome = this.getContentElement( 'tab1', 'nomeLink' )._.inputId;
                if ( aElement.length ) {
                    setTimeout(function(){
                        q('.cke_dialog #'+idInputUrl).val(aElement.attr('href'));
                        q('.cke_dialog #'+idInputNome).val(aElement.text()).after('<input style="display:none" type="hidden" value="'+linkRef+'" id="refLinkProForm">');
                    }, 500);
                }
            },
            contents :
            [
               {
                  id : 'tab1',
                  label : 'Editar link',
                  elements :
                  [
                    {
             			type: 'text',
             			id: 'nomeLink',
             			label: 'Texto vis\u00EDvel',
             			'default': ''
             		},{
             			type: 'text',
             			id: 'urlLink',
             			label: 'URL',
						required : true,
             			'default': ''
             		}
                  ]
               }
            ]
         };
      } );
}
export function openDialogBatchImgQuality(this_) {
    api.setParamEditor(this_);
    state.oEditor.openDialog('batchImgQuality');
}
export function getDialogBatchImgQuality() {
      CKEDITOR.dialog.add( 'batchImgQuality', function(editor)
      {
         return {
            title : 'Reduzir qualidade das imagens',
            minWidth : 400,
            minHeight : 80,
            buttons: [ CKEDITOR.dialog.cancelButton, CKEDITOR.dialog.okButton ],
            onOk: function(event, a, b) {
                var qualityImg = this.getContentElement( 'tab1', 'quality' ).getValue();
                if ( qualityImg != '' ) {
                    state.iframeEditor.find('img').each(function(){
                        api.qualityImages(this, this, qualityImg*0.01);
                    })
                    event.data.hide = true;
                } else {
                    alertaBoxPro('Error', 'exclamation-triangle', 'Digite um valor');
					event.data.hide = false;
				}
            },
            onShow : function() {
                this.getContentElement("tab1", "quality").getInputElement().setAttribute('type','range').setAttribute('max','100').setAttribute('min','1');
            },
            contents :
            [
               {
                  id : 'tab1',
                  label : 'Qualidade',
                  elements :
                  [
                    {
             			type: 'text',
             			id: 'quality',
             			label: 'Qualidade da Imagem',
             			'default': state.qualidadeImagens
             		}
                  ]
               }
            ]
         };
      } );
}
export function initDialogUploadImgBase64() {
    if (checkConfigValue('editarimagens')) {
        api.getDialogUploadImgBase64();
    }
}
api.loadResizeImg = loadResizeImg;
api.insertTextTotLink = insertTextTotLink;
api.insertProtocoloOnBox = insertProtocoloOnBox;
api.openLinkPro = openLinkPro;
api.removeLinkPro = removeLinkPro;
api.copyLinkPro = copyLinkPro;
api.editLinkPro = editLinkPro;
api.getDialogLinkPro = getDialogLinkPro;
api.openDialogBatchImgQuality = openDialogBatchImgQuality;
api.getDialogBatchImgQuality = getDialogBatchImgQuality;
api.initDialogUploadImgBase64 = initDialogUploadImgBase64;
