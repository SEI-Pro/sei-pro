/**
 * Editor module — migrated from body.js (CKEditor 4 / SEI 4.1).
 * Uses lib/domq.js (`q`) instead of the jQuery library.
 */
import { q } from '../../lib/domq.js';
import { state } from '../../state.js';
import { api } from '../../api.js';
import {
    buildProcessDocumentReference,
    listProcessDocuments,
    processDocumentId
} from '../../domain/process-documents.js';

export function convertFirstLetter(this_) {
    api.setParamEditor(this_);
    var selectTxt = state.oEditor.getSelection().getSelectedText();
    if ( selectTxt != '' ) {
        var text = capitalizeFirstLetter(selectTxt);
        state.oEditor.insertHtml(text);
    } else {
        alertaBoxPro('Error', 'exclamation-triangle', 'Selecione um texto para convers\u00E3o');
    }
}

export function getCitacaoDocumento(this_, TimeOut = 9000) {
    if (checkProcessoSigiloso()) {
        alertaBoxPro('Error', 'exclamation-triangle', ' N\u00E3o dispon\u00EDvel para processos sigilosos');
        api.setParamEditor(this_);
    } else {
        const documents = listProcessDocuments(globalThis);
        if (documents.length) {
            api.setParamEditor(this_);
            api.getDialogCitacaoDocumento();
        } else if (TimeOut <= 0) {
            alertaBoxPro('Aviso', 'exclamation-triangle', 'N\u00E3o foi poss\u00EDvel carregar os documentos do processo. Atualize a p\u00E1gina e tente novamente.');
        } else {
            if (typeof loadEditorProcessDocuments === 'function') {
                try { loadEditorProcessDocuments(); } catch (_) { /* retry below */ }
            }
            setTimeout(function(){
                api.getCitacaoDocumento(this_, TimeOut - 100);
                q(this_).fadeOut(200).fadeIn(200);
                if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage'))console.log('Reload getCitacaoDocumento');
            }, 500);
        }
    }
}
export function getDialogCitacaoDocumento() {
    if (!checkProcessoSigiloso()) {
        const viewportWidth = Number(globalThis.innerWidth) || 1024;
        const viewportHeight = Number(globalThis.innerHeight) || 700;
        const dialogWidth = Math.min(900, Math.max(620, viewportWidth - 40));
        const dialogHeight = Math.min(500, Math.max(320, viewportHeight - 120));
        var listDocumentos = q.map(listProcessDocuments(globalThis), function (value) {
            var id = processDocumentId(value);
            var label = String(value.documento || '').trim();
            var number = String(value.nr_sei || value.numeroSEI || value.numero || '').trim();
            var select_text = number ? label+' ('+number+')' : label;
            if ( id && label ) { return `<option value="${id}">${select_text}</option>`; }
        }).join('');

        const htmlBox = sanitizeHTML(`
            <div class="dialogBoxDiv" style="font-size: 11pt;line-height: 12pt;color: #616161;min-height: 250px;">
                <table style="font-size: 10pt;width: 100%;" class="seiProForm">
                    <tr>
                        <td style="vertical-align: bottom; text-align: left;" class="label">
                            <label for="selectCitacaoDocumento"><i class="iconPopup iconSwitch fas fa-file cinzaColor"></i>Documentos do processo:</label>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <select multiple="multiple" id="selectCitacaoDocumento" style="width: 100%; min-height: 220px;">
                            ${listDocumentos}
                            </select>
                        </td>
                    </tr>
                </table>
            </div>
        `);

        resetDialogBoxPro('dialogBoxPro');
        dialogBoxPro = q('#dialogBoxPro')
            .html(htmlBox)
            .dialog({
                title : 'Inserir refer\u00EAncia de documento do processo',
                width : dialogWidth,
                height : dialogHeight,
                open: function () {
                    initChosenReplace('box_multiple', this, true);
                    q('#selectCitacaoDocumento').on('change', function() { resizeHeigthDialogBox(dialogBoxPro) });
                },
                buttons: [{
                    text: 'Inserir',
                    class: 'confirm ui-state-active',
                    click: function(event) {
                        var selectMult = q('#selectCitacaoDocumento option:checked');
                        var list_protocolo = q.map(selectMult,function(e){
                            if (e.value != '') return e.value
                        });
                        if (q.isArray(list_protocolo) && list_protocolo.length) {
                            q.each(list_protocolo, function(index, id_protocolo){
                                if (id_protocolo != '') {
                                    var insert = api.insertCitacaoDocumento(id_protocolo);
                                    if (insert && index < list_protocolo.length-2) state.oEditor.insertText(', ');
                                    if (insert && index == list_protocolo.length-2) state.oEditor.insertText(' e ');
                                }
                            });
                            resetDialogBoxPro('dialogBoxPro');
                        }
                    }
                }]
            });
    }
}
export function insertCitacaoDocumento(id_protocolo) {
    var dataValue = listProcessDocuments(globalThis).find((document) =>
        String(document?.id_protocolo || document?.id_documento || document?.id || '') === String(id_protocolo)
    );
    // console.log(dataValue, id_protocolo);
    if ( typeof dataValue !== 'undefined' && dataValue !== null && dataValue.documento ) {
        var documentId = processDocumentId(dataValue);
        var referenceNumber = String(dataValue.nr_sei || dataValue.numeroSEI || dataValue.numero || '').trim();
        var linkText = referenceNumber || String(dataValue.documento || '').trim();
        var citacaoDoc = getCitacaoDoc();
        var nrSeiHtml = buildProcessDocumentReference({ ...dataValue, id_protocolo: documentId, nr_sei: linkText });
        var citacaoDocumento = ( referenceNumber || getConfigValue('citacaodoc') == 'citacaodoc_4') ? String(dataValue.documento).trim()+'&nbsp;('+citacaoDoc+nrSeiHtml+')' : nrSeiHtml;
        state.oEditor.focus();
        state.oEditor.fire('saveSnapshot');
        state.oEditor.insertHtml(citacaoDocumento);
        state.oEditor.fire('saveSnapshot');
        return true;
    } else {
        return false;
    }
}

// INSERE NOTAS DE RODAPE
api.convertFirstLetter = convertFirstLetter;
api.getCitacaoDocumento = getCitacaoDocumento;
api.getDialogCitacaoDocumento = getDialogCitacaoDocumento;
api.insertCitacaoDocumento = insertCitacaoDocumento;
