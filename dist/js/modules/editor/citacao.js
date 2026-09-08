/**
 * SEI Pro - Editor / Feature: Citacao de documento
 *
 * Insere uma referencia (ancora SEI) a um ou mais documentos do processo no
 * corpo do texto. Entrada: getCitacaoDocumento (clique do botao); abre o
 * dialogo getDialogCitacaoDocumento (jQuery UI) com um multi-select dos
 * documentos do processo; insertCitacaoDocumento monta o HTML da citacao e
 * insere via adapter.
 *
 * EXTRAIDO (nao portado): a feature ja estava limpa -- usa o dialogo nativo
 * do SEI Pro (resetDialogBoxPro + $('#dialogBoxPro').dialog, jQuery UI) e
 * roteia todas as operacoes de editor pelo SeiProEditorAdapter
 * (getInstance/withEdit/insertHtml/insertText). Nenhuma chamada CK4 crua
 * (sem oEditor, CKEDITOR.*, iframe).
 *
 * Globais que permanecem no monolito / sei-functions-pro.js (shared), todas
 * chamadas em tempo de clique: checkProcessoSigiloso, alertaBoxPro,
 * sanitizeHTML, resetDialogBoxPro, initChosenReplace, resizeHeigthDialogBox,
 * getCitacaoDoc, getConfigValue, verifyConfigValue, jmespath, dadosProcessoPro,
 * dialogBoxPro. Ver README.md.
 */
(function () {
    'use strict';

    window.getCitacaoDocumento = function (this_, TimeOut = 9000) {
        if (checkProcessoSigiloso()) {
            alertaBoxPro('Error', 'exclamation-triangle', ' N\u00E3o dispon\u00EDvel para processos sigilosos');
            // Adapter mantem a inst\u00E2ncia ativa em escopo; dialog segue.
            SeiProEditorAdapter.getInstance(this_);
        } else {
            if (TimeOut <= 0) { return; }
            if (typeof dadosProcessoPro.listDocumentos !== 'undefined') {
                SeiProEditorAdapter.getInstance(this_);
                getDialogCitacaoDocumento(this_);
            } else {
                setTimeout(function(){
                    getCitacaoDocumento(this_, TimeOut - 100);
                    $(this_).fadeOut(200).fadeIn(200);
                    if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage'))console.log('Reload getCitacaoDocumento');
                }, 500);
            }
        }
    };

    window.getDialogCitacaoDocumento = function (this_) {
        if (!checkProcessoSigiloso()) {
            // Captura a inst\u00E2ncia atual do editor no escopo do di\u00E1logo. Evita
            // depend\u00EAncia da vari\u00E1vel global `oEditor` (setada por setParamEditor).
            var editor = SeiProEditorAdapter.getInstance(this_);

            var listDocumentos = $.map(dadosProcessoPro.listDocumentos, function (value) {
                var select_text = ( value.nr_sei != '' ) ? value.documento+' ('+value.nr_sei+')' : value.documento;
                if ( value.documento != '' ) { return `<option value="${value.id_protocolo}">${select_text}</option>`; }
            }).join('');

            const htmlBox = sanitizeHTML(`
                <div class="dialogBoxDiv" style="font-size: 11pt;line-height: 12pt;color: #616161;">
                    <table style="font-size: 10pt;width: 100%;" class="seiProForm">
                        <tr>
                            <td style="vertical-align: bottom; text-align: left;" class="label">
                                <label for="selectCitacaoDocumento"><i class="iconPopup iconSwitch fas fa-file cinzaColor"></i>Documentos do processo:</label>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <select multiple="multiple" id="selectCitacaoDocumento">
                                ${listDocumentos}
                                </select>
                            </td>
                        </tr>
                    </table>
                </div>
            `);

            resetDialogBoxPro('dialogBoxPro');
            dialogBoxPro = $('#dialogBoxPro')
                .html(htmlBox)
                .dialog({
                    title : 'Inserir refer\u00EAncia de documento do processo',
                    width : 600,
                    height : 220,
                    open: function () {
                        initChosenReplace('box_multiple', this, true);
                        $('#selectCitacaoDocumento').on('change', function() { resizeHeigthDialogBox(dialogBoxPro) });
                    },
                    buttons: [{
                        text: 'Inserir',
                        class: 'confirm ui-state-active',
                        click: function(event) {
                            var selectMult = $('#selectCitacaoDocumento option:checked');
                            var list_protocolo = $.map(selectMult,function(e){
                                if (e.value != '') return e.value
                            });
                            if ($.isArray(list_protocolo) && list_protocolo.length) {
                                $.each(list_protocolo, function(index, id_protocolo){
                                    if (id_protocolo != '') {
                                        var insert = insertCitacaoDocumento(id_protocolo, editor);
                                        if (insert && index < list_protocolo.length-2) SeiProEditorAdapter.insertText(editor, ', ');
                                        if (insert && index == list_protocolo.length-2) SeiProEditorAdapter.insertText(editor, ' e ');
                                    }
                                });
                                resetDialogBoxPro('dialogBoxPro');
                            }
                        }
                    }]
                });
        }
    };

    window.insertCitacaoDocumento = function (id_protocolo, editor) {
        editor = editor || SeiProEditorAdapter.getInstance();
        if (!editor) return false;
        var dataValue = jmespath.search(dadosProcessoPro.listDocumentos, "[?id_protocolo=='"+id_protocolo+"'] | [0]");
        if ( typeof dataValue !== 'undefined' && dataValue !== null && dataValue.documento ) {
            var nrSei = ( dataValue.nr_sei != '' ) ? dataValue.nr_sei : dataValue.documento;
            var citacaoDoc = getCitacaoDoc();
            var nrSeiHtml = '<span contenteditable="false" style="text-indent:0;"><a class="ancoraSei" id="lnkSei'+dataValue.id_protocolo+'" style="text-indent:0;">'+nrSei+'</a></span>';
            var citacaoDocumento = ( dataValue.nr_sei != '' || getConfigValue('citacaodoc') == 'citacaodoc_4') ? dataValue.documento.trim()+'&nbsp;('+citacaoDoc+nrSeiHtml+')' : nrSeiHtml;
            SeiProEditorAdapter.withEdit(editor, function () {
                SeiProEditorAdapter.insertHtml(editor, citacaoDocumento);
            });
            return true;
        }
        return false;
    };

    if (window.SeiProEditorAdapter && SeiProEditorAdapter.registerFeature) {
        SeiProEditorAdapter.registerFeature({ id: 'citacao' });
    }
})();
