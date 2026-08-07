// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/**
 * Editor module — migrated from body.js (CKEditor 4 / SEI 4.1).
 * Uses lib/domq.js (`q`) instead of the jQuery library.
 */
import { q } from '../../lib/domq.js';
import { state } from '../../state.js';
import { api } from '../../api.js';

export function getMarkSigilo(this_) {
    api.setParamEditor(this_);
    var select = state.oEditor.getSelection().getStartElement();
    var checkClass = q(select.$).closest('span').hasClass('sigiloSEI');

    var style = new CKEDITOR.style({
        element: 'span',
        attributes: {
            'class': 'sigiloSEI'
        }
    });
    if (api.hasSelection(state.oEditor) && !checkClass) {
        state.oEditor.focus();
        state.oEditor.fire('saveSnapshot');
        state.oEditor.applyStyle(style);
        state.oEditor.fire('saveSnapshot');
    } else if (checkClass) {
        var element = q(select.$).closest('.sigiloSEI');
            element.after(element.html()).remove();
        console.log(element.html());
    }
}
export function getTarjaSigilo(this_) {
    api.setParamEditor(this_);

    var style = new CKEDITOR.style({
        element: 'span',
        attributes: {
            'class': 'sigiloSEI'
        }
    });
    if (api.hasSelection(state.oEditor)) {
        state.oEditor.focus();
        state.oEditor.fire('saveSnapshot');
        state.oEditor.applyStyle(style);
        api.actionsMarkSigilo(undefined, 'apply');
        state.oEditor.fire('saveSnapshot');
    }
}
export function getBoxSigilo(this_) {
    api.setParamEditor(this_);
    state.oEditor.openDialog('SigiloSEI');
}
export function actionsMarkSigilo(this_, mode, text = false, increment = false) {
    var _this = q(this_);
    var _parent = _this.closest('.cke_dialog_page_contents');
    var result = '';
    if (mode == 'replace') {
        var textFind = (text) ? text : _parent.find('#cke_inputSigilo2_textInput').val().trim();
        if (textFind != '') {
            var i_increment = (increment) ? parseInt(q('#tabSigilo2_result .count').length ? q('#tabSigilo2_result .count').text() : 0) : 0; console.log(i_increment);
            var i = 0;
            var displayResult = '';
            var tagSigilo = state.iframeEditor.find('p:contains("'+textFind+'") span.sigiloSEI');
            if (tagSigilo.length) { tagSigilo.after(tagSigilo.html()).remove() }
            var matches = state.iframeEditor.find('p').map(function(){ return q(this).text() }).get().join(' ').match(new RegExp('\\b'+textFind+'\\b', 'igm'));
                i = matches ? matches.length : 0;
            if (i > 0) {
                state.oEditor.focus();
                state.oEditor.fire('saveSnapshot');
                state.iframeEditor.find('p').wrapInTag({'class': 'sigiloSEI', 'words' : [textFind]});

                oEditor.fire('saveSnapshot');
                matches = state.iframeEditor.find('p').map(function(){ return q(this).text() }).get().join(' ').match(new RegExp('\\b'+textFind+'\\b', 'igm'));
                i = matches ? matches.length : 0;
                i = i+i_increment;
                displayResult = '  <i class="fas fa-check-circle verdeColor"></i> <span class="count">'+i+'</span> '+(i==1 ? 'marca' : 'marcas')+' '+(i==1 ? 'adicionada' : 'adicionadas')+' com sucesso!';
            } else {
                displayResult = '  <i class="fas fa-info-circle" style="color: #007fff;"></i> Nenhum texto encontrado!';
            }
            result = '<label class="cke_dialog_ui_labeled_label" style="font-style: italic; color: #616161;">'+
                         displayResult+
                         '</label>';
        } else {
            result = '<label class="cke_dialog_ui_labeled_label" style="font-style: italic; color: #616161;">'+
                     '  <i class="fas fa-info-circle" style="color: #007fff;"></i> Digite um texto para adicionar a marca de sigilo'+
                     '</label>';
        }
        _parent.find('#tabSigilo2_result').show().html(result);
        q('#tabSigilo3_result').hide().html('');
        api.htmlTabSigiloResult();
    } else if (mode == 'remove') {
       var i = 0;
        state.oEditor.focus();
        oEditor.fire('saveSnapshot');
        state.iframeEditor.find('span.sigiloSEI').each(function(){
            q(this).after(q(this).html()).remove();
            i++;
        });
        state.iframeEditor.find('span.sigiloSEI_tarja').each(function(){
            if (typeof q(this).data('text') !== 'undefined' && q(this).data('text') != '') {
                q(this).after(q(this).data('text')).remove();
                i++;
            }
        });
        state.oEditor.fire('saveSnapshot');
        var displayResult = (i==0)
                    ? '  <i class="fas fa-info-circle" style="color: #007fff;"></i> Nenhuma marca encontrada!'
                    : '  <i class="fas fa-check-circle verdeColor"></i> '+i+' '+(i==1 ? 'marca' : 'marcas')+' '+(i==1 ? 'removida' : 'removidas')+' com sucesso!';
            result = '<label class="cke_dialog_ui_labeled_label" style="font-style: italic; color: #616161;">'+
                     displayResult+
                     '</label>';
            _parent.find('#tabSigilo3_result').show().html(result);
            q('#tabSigilo2_result').hide().html('');
            api.htmlTabSigiloResult();
    } else if (mode == 'apply') {
        var i = 0;
        var redactor = '\u2588';
            state.oEditor.focus();
            state.oEditor.fire('saveSnapshot');
            state.iframeEditor.find('span.sigiloSEI').each(function(){
                var rand = randomNumber(8, 15);
                q(this).data('text', q(this).html()).text(redactor.repeat(rand)).attr('class', 'sigiloSEI_tarja');
                i++;
            });
            state.oEditor.fire('saveSnapshot');
            if (i > 0) {
                result = '<label class="cke_dialog_ui_labeled_label" style="font-style: italic; color: #616161;">'+
                         '  <i class="fas fa-check-circle verdeColor"></i> '+i+' '+(i==1 ? 'marca' : 'marcas')+' '+(i==1 ? 'tarjada' : 'tarjadas')+' com sucesso!<br>'+
                         '  <i class="fas fa-exclamation-triangle laranjaColor"></i>  '+(i==1 ? 'Esta marca tarjada poder\u00E1 ser revertida' : 'Estas marcas tarjadas poder\u00E3o ser revertidas')+' na aba "Remover marcas"<br> somente enquanto aberto este editor de documentos.'+
                         '</label>';
                _parent.find('#tabSigilo1_result').show().html(result);
            } else {
                api.htmlTabSigiloResult();
            }
            q('#tabSigilo2_result').hide().html('');
            q('#tabSigilo3_result').hide().html('');
            api.rodapeSigiloMark();
    } else if (mode == 'email_cpf') {
        oEditor.focus();
        q('#tabSigilo2_result').html('');
        var arrayEmails = extractEmails(state.iframeEditor.text());
            arrayEmails = (arrayEmails.length) ? uniqPro(arrayEmails) : [];
        var arrayCPFs = extractCPFs(state.iframeEditor.text());
            arrayCPFs = (arrayCPFs.length) ? uniqPro(arrayCPFs) : [];
        var arrayDadosSensiveis = q.merge(arrayCPFs, arrayEmails);
            if (arrayDadosSensiveis.length) {
                q.each(arrayDadosSensiveis, function(i,v){
                    api.actionsMarkSigilo(this_, 'replace', v, true);
                });
            }
    }
}
export function rodapeSigiloMark() {
    var lastFrame = false;
    var countMarks = 0;
    q('iframe.cke_wysiwyg_frame').each(function(index){
        var iframe = q(this).contents();
        if ( iframe.find('body').attr('contenteditable') == 'true' ) {
            lastFrame = iframe;
            countMarks = countMarks+iframe.find('.sigiloSEI_tarja').length;
        }
    });
    lastFrame.find('body .sigiloSEI_sigilo_mark').remove();
    if (countMarks > 0) {
        lastFrame.find('body').append('<p class="sigiloSEI_sigilo_mark" contenteditable="false" style="font-size: 6pt;color: #ccc;font-family: monospace;">#_contem_'+countMarks+'_marcas_sigilo</p>');
    }
}
export function htmlTabSigiloResult() {
    var result = '';
    var tagSigilo = state.iframeEditor.find('p span.sigiloSEI');
    var i = tagSigilo.length;
    var iconMarkSigilo = q('#cke_'+state.idEditor).find('.getMarkSigiloButton .cke_button_icon').attr('style');
    if (i == 0) {
        result = '<label class="cke_dialog_ui_labeled_label" style="font-style: italic; color: #616161;">'+
                  '  <i class="fas fa-info-circle" style="color: #007fff;"></i> Nenhuma marca de sigilo no documento! Adicione marcas de sigilo na aba <br>'+
                  ' "Localizar texto" ou adicione manualmente com o bot\u00E3o <span style="width: 16px; height: 16px; display: inline-block; '+iconMarkSigilo+'">&nbsp;</span>';
                  '</label>';
        q('#tabSigilo1_result').show().html(result);
    } else {
        result =  '<label class="cke_dialog_ui_labeled_label" style="font-style: italic; color: #616161;">'+
                  '  <i class="fas fa-info-circle" style="color: #007fff;"></i> '+i+' '+(i==1 ? 'marca' : 'marcas')+' de sigilo '+(i==1 ? 'encontrada' : 'encontradas')+' no documento! <br>'+
                  '</label>';
    }
    q('#tabSigilo1_result').show().html(result);
}
export function getDialogSigilo() {
    CKEDITOR.dialog.add( 'SigiloSEI', function(editor)
      {
         return {
            title : 'Gerenciar marcas de sigilo do documento',
            minWidth : 700,
            minHeight : 80,
            buttons: [ CKEDITOR.dialog.okButton ],
            onShow : function() {
                setTimeout(function(){
                    q('.tabSigilo_result').html('').hide();
                    api.htmlTabSigiloResult();
                    var textSelected = editor.getSelection().getSelectedText();
                    q('#cke_inputSigilo2_textInput').val(textSelected);
                }, 500);
            },
            contents :
            [
               {
                  id : 'tab2',
                  label : '1. Localizar texto e dados pessoais',
                  elements :
                  [
                    {
                        type: 'html',
                        html: '<table role="presentation" class="cke_dialog_ui_hbox">'+
                              ' <tbody>'+
                              '     <tr class="cke_dialog_ui_hbox">'+
                              '         <td class="cke_dialog_ui_hbox_first" role="presentation" style="width:50%; padding:0px">'+
                              '             <label class="cke_dialog_ui_labeled_label" id="cke_inputSigilo2_label" for="cke_inputSigilo2_textInput">Localizar texto e adicionar marca <br>de sigilo em todo o documento</label>'+
                              '         </td>'+
                              '         <td class="cke_dialog_ui_hbox_last" role="presentation" style="width:50%; padding:0px">'+
                              '             <span class="cke_dialog_ui_labeled_content" id="cke_inputSigilo2_uiElement">'+
                              '                 <div class="cke_dialog_ui_input_text" role="presentation" style="width:200px">'+
                              '                     <input class="cke_dialog_ui_input_text" id="cke_inputSigilo2_textInput" type="text" aria-labelledby="cke_inputSigilo2_label">'+
                              '                 </div>'+
                              '             </span>'+
                              '         </td>'+
                              '     </tr>'+
                              '     <tr class="cke_dialog_ui_hbox">'+
                              '         <td class="cke_dialog_ui_hbox_first" role="presentation" style="width:50%; padding:0px">'+
                              '         </td>'+
                              '         <td class="cke_dialog_ui_hbox_last" role="presentation" style="width:50%; padding:0px">'+
                              '             <a style="user-select: none;" data-seipro-action="actionsMarkSigilo" data-seipro-mode="replace" title="Adicionar" hidefocus="true" class="cke_dialog_ui_button cke_dialog_ui_button_cancel" role="button" aria-labelledby="buttonSigilo2_label" id="buttonSigilo2_uiElement">'+
                              '                 <span id="buttonSigilo2_label" class="cke_dialog_ui_button">Adicionar</span>'+
                              '             </a>'+
                              '         </td>'+
                              '     </tr>'+
                              '     <tr class="cke_dialog_ui_hbox">'+
                              '         <td class="cke_dialog_ui_hbox_first" role="presentation" style="width:50%; padding:20px 0 0">'+
                              '             <label class="cke_dialog_ui_labeled_label" id="cke_inputSigilo2_label" for="cke_inputSigilo2_textInput">Localizar dados pessoais como <br>e-mails e CPFs em todo o documento</label>'+
                              '         </td>'+
                              '         <td class="cke_dialog_ui_hbox_last" role="presentation" style="width:50%; padding:20px 0 0">'+
                              '             <a style="user-select: none;" data-seipro-action="actionsMarkSigilo" data-seipro-mode="email_cpf" title="Localizar dados pessoais" hidefocus="true" class="cke_dialog_ui_button cke_dialog_ui_button_cancel" role="button" aria-labelledby="buttonSigilo2_label" id="buttonSigilo2_uiElement">'+
                              '                 <span id="buttonSigilo2_label" class="cke_dialog_ui_button">Localizar dados pessoais</span>'+
                              '             </a>'+
                              '         </td>'+
                              '     </tr>'+
                              ' </tbody>'+
                              '</table>'+
                              '<div id="tabSigilo2_result" class="tabSigilo_result" style="display:none; margin-top: 15px;"></div>'
             		}
                  ]
               }, {
                id : 'tab1',
                label : '2. Tarjar marcas de sigilo',
                elements :
                [
                  {
                      type: 'html',
                      html: '<table role="presentation" class="cke_dialog_ui_hbox">'+
                            ' <tbody>'+
                            '     <tr class="cke_dialog_ui_hbox">'+
                            '         <td class="cke_dialog_ui_hbox_first" role="presentation" style="width:50%; padding:0px">'+
                            '             <label class="cke_dialog_ui_labeled_label" id="cke_inputSigilo1_label">Aplicar tarja de sigilo <br> no documento</label>'+
                            '         </td>'+
                            '         <td class="cke_dialog_ui_hbox_last" role="presentation" style="width:50%; padding:0px">'+
                            '             <a style="user-select: none;" data-seipro-action="actionsMarkSigilo" data-seipro-mode="apply" title="Aplicar" hidefocus="true" class="cke_dialog_ui_button cke_dialog_ui_button_cancel" role="button" aria-labelledby="buttonSigilo1_label" id="buttonSigilo1_uiElement">'+
                            '                 <span id="buttonSigilo1_label" class="cke_dialog_ui_button">Aplicar</span>'+
                            '             </a>'+
                            '         </td>'+
                            '     </tr>'+
                            ' </tbody>'+
                            '</table>'+
                            '<div id="tabSigilo1_result" class="tabSigilo_result" style="display:none; margin-top: 15px;"></div>'
                   }
                ]
             }, {
                  id : 'tab3',
                  label : 'Remover marcas',
                  elements :
                  [
                    {
                        type: 'html',
                        html: '<table role="presentation" class="cke_dialog_ui_hbox">'+
                              ' <tbody>'+
                              '     <tr class="cke_dialog_ui_hbox">'+
                              '         <td class="cke_dialog_ui_hbox_first" role="presentation" style="width:50%; padding:0px">'+
                              '             <label class="cke_dialog_ui_labeled_label" id="cke_inputSigilo_label">Remover todas as marcas <br>de sigilo no documento</label>'+
                              '         </td>'+
                              '         <td class="cke_dialog_ui_hbox_last" role="presentation" style="width:50%; padding:0px">'+
                              '             <a style="user-select: none;" data-seipro-action="actionsMarkSigilo" data-seipro-mode="remove" title="Remover" hidefocus="true" class="cke_dialog_ui_button cke_dialog_ui_button_cancel" role="button" aria-labelledby="buttonSigilo3_label" id="buttonSigilo3_uiElement">'+
                              '                 <span id="buttonSigilo3_label" class="cke_dialog_ui_button">Remover</span>'+
                              '             </a>'+
                              '         </td>'+
                              '     </tr>'+
                              ' </tbody>'+
                              '</table>'+
                              '<div id="tabSigilo3_result" class="tabSigilo_result" style="display:none; margin-top: 15px;"></div>'+
                              '<div id="tabSigilo3_info" style="margin-top: 15px;">'+
                              '     <label class="cke_dialog_ui_labeled_label" style="font-style: italic; color: #616161;">'+
                              '       <i class="fas fa-exclamation-triangle laranjaColor"></i> Marcas de sigilo j\u00E1 tarjadas n\u00E3o poder\u00E3o ser revertidas ap\u00F3s salvar e abandonar <br>este editor de documentos.'+
                              '     </label>'+
                              '</div>'
             		}
                  ]
               }, {
                  id : 'tab4',
                  label : 'Guia r\u00E1pido',
                  elements :
                  [
                    {
                        type: 'html',
                        html: '<table role="presentation" class="cke_dialog_ui_hbox">'+
                              ' <tbody>'+
                              '     <tr class="cke_dialog_ui_hbox">'+
                              '         <td class="cke_dialog_ui_hbox_first" role="presentation" style="width:100%; padding:0px">'+
                              '             <label class="cke_dialog_ui_labeled_label" id="cke_inputSigilo_label">Acesse o guia r\u00E1pido sobre como <a target="_blank" href="https://sei-pro.github.io/sei-pro/pages/SIGILODOC.html" class="linkDialog">Adicionar marca de sigilo e tarjas pretas de confidencialidade <i class="fas fa-external-link-alt bLink" style="font-size: 90%; text-decoration: underline;"></i></a></label>'+
                              '         </td>'+
                              '     </tr>'+
                              ' </tbody>'+
                              '</table>'
             		}
                  ]
               }
            ]
         };
      } );
}
api.getMarkSigilo = getMarkSigilo;
api.getTarjaSigilo = getTarjaSigilo;
api.getBoxSigilo = getBoxSigilo;
api.actionsMarkSigilo = actionsMarkSigilo;
api.rodapeSigiloMark = rodapeSigiloMark;
api.htmlTabSigiloResult = htmlTabSigiloResult;
api.getDialogSigilo = getDialogSigilo;
