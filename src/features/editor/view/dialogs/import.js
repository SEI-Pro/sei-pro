/**
 * Editor module — migrated from body.js (CKEditor 4 / SEI 4.1).
 * Uses lib/domq.js (`q`) instead of the jQuery library.
 */
import { q, qLoadScript } from '../../lib/domq.js';
import { state } from '../../state.js';
import { api } from '../../api.js';

export function importDocPro(this_) {
    api.setParamEditor(this_);
    var tipsDocs = '<label class="cke_dialog_ui_labeled_label" style="font-style: italic;color: #616161;"><i class="fas fa-info-circle" style="color: #007fff;"></i> Antes de importar, confira se o documento est\u00E1 acess\u00EDvel por qualquer<br>pessoa na internet. <a href="https://sei-pro.github.io/sei-pro/pages/INSERIRDOC.html" target="_blank" style="text-decoration: underline; cursor: pointer; color: rgb(0, 0, 238);">Consulte nossa ajuda para mais informa\u00E7\u00F5es.</a></label>'
    var tipsSheets = '<label class="cke_dialog_ui_labeled_label" style="font-style: italic;color: #616161;"><i class="fas fa-info-circle" style="color: #007fff;"></i> Antes de importar, confira se a planilha est\u00E1 publicada na web.<br> Aten\u00E7\u00E3o: O URL publicado na web \u00E9 diferente do URL da planilha. <br><a href="https://sei-pro.github.io/sei-pro/pages/INSERIRPLANILHA.html" target="_blank" style="text-decoration: underline; cursor: pointer; color: rgb(0, 0, 238);">Consulte nossa ajuda para mais informa\u00E7\u00F5es.</a></label>'

    const htmlBox = sanitizeHTML(`
        <div class="dialogBoxDiv" style="font-size: 11pt;line-height: 12pt;color: #616161;">
            <div id="tabDialog" style="border: none;margin: 0;">
                <ul style="font-size: 0.8em;">
                   <li><a href="#tabDialog-tab1"><i class="fas fa-upload cinzaColor" style="margin-right: 5px;"></i> Arquivo Word (docx) ou HTML</a></li>
                   <li><a href="#tabDialog-tab2"><i class="fas fa-file-alt cinzaColor" style="margin-right: 5px;"></i> Google Docs</a></li>
                   <li><a href="#tabDialog-tab3"><i class="fas fa-file-spreadsheet cinzaColor" style="margin-right: 5px;"></i> Google Planilhas</a></li>
                </ul>
                <div id="tabDialog-tab1">
                    <table style="font-size: 10pt;width: 100%;" class="seiProForm">
                        <tr>
                            <td style="vertical-align: bottom; text-align: left;" class="label">
                                <label for="fileInputImportHTMLDocx"><i class="iconPopup iconSwitch fas fa-upload cinzaColor"></i>Inserir texto de arquivo Word (docx) ou HTML:</label>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <input style="width:95%" id="fileInputImportHTMLDocx" type="file" accept=".docx,.html">
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div style="display: flex;">
                                    <div class="onoffswitch" style="transform: scale(0.5);display: inline-block;float: left;">
                                        <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="importWord" tabindex="0">
                                        <label class="onoff-switch-label" for="importWord"></label>
                                    </div>
                                    <label style="font-size: 80%;padding-top: 5px;display: inline-block;" for="importWord">Corrigir erros de codifica\u00E7\u00E3o de documentos Word</label>
                                </div>
                                <div style="display: flex;">
                                    <div class="onoffswitch" style="transform: scale(0.5);display: inline-block;float: left;">
                                        <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="replaceText" tabindex="0" checked>
                                        <label class="onoff-switch-label" for="replaceText"></label>
                                    </div>
                                    <label style="font-size: 80%;padding-top: 5px;display: inline-block;" for="replaceText">Substituir todo o documento pelo conte\u00FAdo externo</label>
                                </div>
                                <div style="display: flex;">
                                    <div class="onoffswitch" style="transform: scale(0.5);display: inline-block;float: left;">
                                        <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="replaceTags" tabindex="0" checked>
                                        <label class="onoff-switch-label" for="replaceTags"></label>
                                    </div>
                                    <label style="font-size: 80%;padding-top: 5px;display: inline-block;" for="replaceTags">Substituir campos din\u00E2micos no documento (se dispon\u00EDvel)</label>
                                </div>
                            </td>
                        </tr>
                    </table>
                </div>
                <div id="tabDialog-tab2">
                    <table style="font-size: 10pt;width: 100%;" class="seiProForm">
                        <tr>
                            <td style="vertical-align: bottom; text-align: left;" class="label">
                                <label for="urlGDocs"><i class="iconPopup iconSwitch fas fa-file-alt cinzaColor"></i>URL do Google Docs:</label>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <input style="width:95%" id="urlGDocs" type="text">
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div style="display: flex;">
                                    <div class="onoffswitch" style="transform: scale(0.5);display: inline-block;float: left;">
                                        <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="replaceTextDocs" tabindex="0" checked>
                                        <label class="onoff-switch-label" for="replaceTextDocs"></label>
                                    </div>
                                    <label style="font-size: 80%;padding-top: 5px;display: inline-block;" for="replaceTextDocs">Substituir todo o documento pelo conte\u00FAdo externo</label>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label style="font-style: italic;color: #616161;margin-top: 15px;display: block;">
                                    <i class="fas fa-info-circle" style="color: #007fff;"></i>
                                    Antes de importar, confira se o documento est\u00E1 acess\u00EDvel por qualquer<br>pessoa na internet.
                                    <a href="https://sei-pro.github.io/sei-pro/pages/INSERIRDOC.html" target="_blank" style="text-decoration: underline; cursor: pointer; color: rgb(0, 0, 238);">Consulte nossa ajuda para mais informa\u00E7\u00F5es.</a>
                                </label>
                            </td>
                        </tr>
                    </table>
                </div>
                <div id="tabDialog-tab3">
                    <table style="font-size: 10pt;width: 100%;" class="seiProForm">
                        <tr>
                            <td style="vertical-align: bottom; text-align: left;" class="label">
                                <label for="urlGSheets"><i class="iconPopup iconSwitch fas fa-file-alt cinzaColor"></i>URL do Google Planilhas (Publicar na Web)</label>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <input style="width:95%" id="urlGSheets" type="text">
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div style="display: flex;">
                                    <div class="onoffswitch" style="transform: scale(0.5);display: inline-block;float: left;">
                                        <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="replaceTextSheets" tabindex="0" checked>
                                        <label class="onoff-switch-label" for="replaceTextSheets"></label>
                                    </div>
                                    <label style="font-size: 80%;padding-top: 5px;display: inline-block;" for="replaceTextSheets">Substituir todo o documento pelo conte\u00FAdo externo</label>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label style="font-style: italic;color: #616161;margin-top: 15px;display: block;">
                                    <i class="fas fa-info-circle" style="color: #007fff;"></i>
                                    Antes de importar, confira se a planilha est\u00E1 publicada na web.<br> Aten\u00E7\u00E3o: O URL publicado na web \u00E9 diferente do URL da planilha.
                                    <br><a href="https://sei-pro.github.io/sei-pro/pages/INSERIRPLANILHA.html" target="_blank" style="text-decoration: underline; cursor: pointer; color: rgb(0, 0, 238);">Consulte nossa ajuda para mais informa\u00E7\u00F5es.</a>
                                </label>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
    `);

    resetDialogBoxPro('dialogBoxPro');
    dialogBoxPro = q('#dialogBoxPro')
        .html(htmlBox)
        .dialog({
            title : 'Inserir texto de conte\u00FAdo externo',
            width : 600,
            height : 400,
            open: function () {
                qLoadScript(URL_SPRO+"js/lib/mammoth.browser.min.js").catch(function(){});
                q('#tabDialog').tabs();
                initChosenReplace('box_multiple', this, true);
                setTimeout(function () {
                    q('#fileInputImportHTMLDocx').val('');
                }, 500);
            },
            buttons: [{
                text: 'Inserir',
                class: 'confirm ui-state-active',
                click: function(event) {
                    var inputFile = document.getElementById('fileInputImportHTMLDocx').files
                    var urlGDocs = q('#urlGDocs').val();
                    var urlGSheets = q('#urlGSheets' ).val();
                    if ( inputFile.length ) {
                        api.handleFileImport(inputFile);
                    } else if ( urlGDocs != '' ) {
                        api.getGoogleDocs(urlGDocs);
                    } else if ( urlGSheets != '' ) {
                        api.getGoogleSheets(urlGSheets);
                    }
                }
            }]
        });
}
export function getGoogleDocs(url) {
    var regex = "\\/d\\/(.*?)(\\/|$)";
    var regDocs = new RegExp(regex).exec(url);
    if ( regDocs !== null ) {
        var urlDocs = 'https://docs.google.com/feeds/download/documents/export/Export?id='+regDocs[1]+'&exportFormat=html';
        loadGoogleDocs(urlDocs, state.iframeEditor, 'docs');
    } else {
        alertaBoxPro('Error', 'exclamation-triangle', 'Url do documento inv\u00E1lido!');
    }
}
export function getGoogleSheets(url) {
    var regex = "\\/e\\/(.*?)(\\/|$)";
    var regSheets = new RegExp(regex).exec(url);
    if ( regSheets !== null ) {
        var urlSheets = 'https://docs.google.com/spreadsheets/d/e/'+regSheets[1]+'/pubhtml';
        loadGoogleDocs(urlSheets, state.iframeEditor, 'sheets');
    } else {
        alertaBoxPro('Error', 'exclamation-triangle', 'Url do documento inv\u00E1lido!');
    }
}
export function handleFileImport(inputFile) {
    const file = inputFile[0];
    if (!file) return;

    const ext = file.name.split('.').pop().toLowerCase();

    if (ext === "docx") {
      converterDocxParaHtml(inputFile);
    } else if (ext === "html" || ext === "htm") {
      api.loadFileImportHTML(inputFile);
    } else {
      alertaBoxPro('Error', 'exclamation-triangle', "Formato não suportado. Use um arquivo .docx ou .html");
    }
}
async function converterDocxParaHtml(inputFile) {
    try {
      const file = inputFile[0];
      if (!file) throw new Error("Nenhum arquivo .docx selecionado.");

      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer });

        var r = (!q('#replaceText').is(':checked'))
            ? true
            : confirm("Deseja substituir o conte\u00FAdo atual pelo arquivo importado?");
        if (r == true) {
            api.loadFileImportEditor(result.value);
        }

      if (result.messages.length > 0) {
        console.warn("Mensagens da conversão:", result.messages);
      }
    } catch (erro) {
      console.error("Erro ao converter .docx:", erro);
    }
}
export function loadFileImportHTML(files) {
    if (files.length <= 0) { return false; }

    var fr = new FileReader();
    fr.onload = function(e) {
        var result = e.target.result;
        if ( q('iframe[title*="'+idEditor+'"]').length ) {
            var r = (!q('#replaceText').is(':checked'))
                    ? true
                    : confirm("Deseja substituir o conte\u00FAdo atual pelo arquivo importado?");
            if (r == true) {
                api.loadFileImportEditor(result);
            }
        }
    }
    if ( q('#importWord').val() == true ) {
        fr.readAsText(files.item(0), "cP1252");
    } else {
        fr.readAsText(files.item(0));
    }
    // console.log(CKEDITOR.dialog.getCurrent().getContentElement('tab1', 'replaceTags').getValue());
    if ( q('#replaceTags').val() == true ) {
        setTimeout(function(){ api.replaceDadosEditor() }, 500);
    }
}
export function loadFileImportEditor(result) {
    state.oEditor.focus();
    state.oEditor.fire('saveSnapshot');
    if ( state.frmEditor.length ) {
        if ( q('#replaceText').is(':checked') ) {
            state.iframeEditor.find('body').html(result);
        } else {
            var select = state.oEditor.getSelection().getStartElement();
            var pElement = q(select.$).closest('p');
            if ( pElement.length ) {
                state.iframeEditor.find(pElement).before(result);
            }
        }
    } else {
        if ( q('#replaceText').is(':checked') ) {
            state.iframeEditor.html(result);
        } else {
            var select = state.oEditor.getSelection().getStartElement();
            var pElement = q(select.$).closest('p');
            if ( pElement.length ) {
                pElement.before(result);
            }
        }
    }
    api.wordToSEI(state.iframeEditor);
    state.oEditor.fire('saveSnapshot');
    enableButtonSavePro();
    resetDialogBoxPro('dialogBoxPro');
}
export function wordToSEI(iframe) {
    iframe.find('body link').remove();
    iframe.find('body script').remove();
    iframe.find('body style').remove();
    iframe.find('body meta').remove();
    iframe.find('o\\:p').remove();
    iframe.find('a.msocomanchor').remove();
    iframe.find('div[style="mso-element:comment-list"]').remove();
    iframe.find('*').contents().each(function() {
        if (this.nodeType === Node.COMMENT_NODE) {
            q(this).remove();
        }
    });

    iframe.find('p.MsoNormal').each(function(){
        var align = q(this).attr('align');
        var style = ( align == 'center' ) ? 'Texto_Centralizado': 'Texto_Justificado_Recuo_Primeira_Linha';

        q(this).removeClass('MsoNormal').removeAttr('align').removeAttr('style').addClass(style);

        q(this).find('span').replaceWith(function() {
         return q( this ).contents();
        });

        q(this).find('del').each(function(){
                var text = q(this).html();
                if (text != '' && text != '&nbsp;') { q(this).after('<span style="color:#FF0000;"><s>'+text+'</s></span> '); }
                q(this).remove();
        });
        q(this).find('ins').each(function(){
                var text = q(this).html();
                if (text != '' && text != '&nbsp;') { q(this).after('<span style="color:#0000FF;"><u>'+text+'</u></span> '); }
                q(this).remove();
        });
    });

    iframe.find('.WordSection1').replaceWith(function() {
         return q( this ).contents();
    });
}
api.importDocPro = importDocPro;
api.getGoogleDocs = getGoogleDocs;
api.getGoogleSheets = getGoogleSheets;
api.handleFileImport = handleFileImport;
api.loadFileImportHTML = loadFileImportHTML;
api.loadFileImportEditor = loadFileImportEditor;
api.wordToSEI = wordToSEI;
