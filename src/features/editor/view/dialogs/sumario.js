/**
 * Editor module — migrated from body.js (CKEditor 4 / SEI 4.1).
 * Uses lib/domq.js (`q`) instead of the jQuery library.
 */
import { q } from '../../lib/domq.js';
import { state } from '../../state.js';
import { api } from '../../api.js';

export function getSumarioDocumento(this_) {
    api.setParamEditor(this_);
    api.getDialogSumarioDocumento();
}
export function getListStylesDocumento() {
    var arrayStylesDoc = [];
    var editorIds = new Set();
    q(state.txaEditor).each(function(index){
        var id = q(this).attr('id');
        if (!id || editorIds.has(id)) return;

        var idEditor_ = id.replace('cke_', '');
        // Recent SEI versions name editor iframes after their section (for
        // example, "Corpo do Texto"), not after the CKEditor id. Resolve the
        // iframe from its container first; title matching remains for legacy pages.
        // Use the current container rather than a global id lookup: CKEditor
        // renders a detached shared-toolbar container with the same id before
        // the real editor container on current SEI pages.
        var editorFrame = q(this).find('iframe').eq(0);
        var iframe_ = editorFrame.length
            ? editorFrame.contents()
            : q('iframe[title*="' + idEditor_ + '"]').eq(0).contents();

        if ( iframe_.find('body').length ) {
            editorIds.add(id);
            iframe_.find('p').each(function(index){
                var style = ( typeof q(this).attr('class') !== 'undefined' && q(this).attr('class').indexOf(' ') !== -1 ) ? q(this).attr('class').split(' ')[0] : q(this).attr('class');
                arrayStylesDoc.push(style);
            });
        }
    });
    arrayStylesDoc = uniqPro(arrayStylesDoc);

    var optionsStyles = q.map(arrayStylesDoc, function (value) {
        if (value) return `<option value=".${value}">${value}</option>`;
    }).join('');
    return optionsStyles;
}
export function updateSelectDialog(element, array) {
    if ( q('select#'+element).length ) {
        q('select#'+element).html('');
        q.each(array, function (index, value) {
            q('select#'+element).append('<option value="'+value[1]+'">'+value[0]+'</option>');
        });
    }
}
export function getDialogSumarioDocumento() {
    var optionsStyles = api.getListStylesDocumento();
    const htmlBox = sanitizeHTML(`
        <div class="dialogBoxDiv" style="font-size: 11pt;line-height: 12pt;color: #616161;">
            <table style="font-size: 10pt;width: 100%;" class="seiProForm">
                <tr>
                    <td style="vertical-align: bottom; text-align: left;" class="label">
                        <label for="listStyle1"><i class="iconPopup iconSwitch fas fa-h1 cinzaColor"></i>Estilo do T\u00EDtulo 1 (obrigat\u00F3rio):</label>
                    </td>
                    <td>
                        <select id="listStyle1" style="width: 350px;">
                            ${optionsStyles}
                        </select>
                    </td>
                </tr>
                <tr>
                    <td style="vertical-align: bottom; text-align: left;" class="label">
                        <label for="listStyle2"><i class="iconPopup iconSwitch fas fa-h2 cinzaColor"></i>Estilo do T\u00EDtulo 2:</label>
                    </td>
                    <td>
                        <select id="listStyle2" style="width: 350px;">
                            ${optionsStyles}
                        </select>
                    </td>
                </tr>
                <tr>
                    <td style="vertical-align: bottom; text-align: left;" class="label">
                        <label for="listStyle3"><i class="iconPopup iconSwitch fas fa-h3 cinzaColor"></i>Estilo do T\u00EDtulo 3:</label>
                    </td>
                    <td>
                        <select id="listStyle3" style="width: 350px;">
                            ${optionsStyles}
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
            title : 'Inserir sum\u00E1rio',
            width : 650,
            height : 250,
            open: function () {
                initChosenReplace('box_init', this, true);
            },
            buttons: [{
                text: 'Inserir',
                class: 'confirm ui-state-active',
                click: function(event) {
                    var arrayStylesUser = [];
                    var id_style1 = q('#listStyle1' ).val();
                    var id_style2 = q('#listStyle2' ).val();
                    var id_style3 = q('#listStyle3' ).val();
                    if ( id_style1 != '' ) { arrayStylesUser.push(id_style1); }
                    if ( id_style2 != '' ) { arrayStylesUser.push(id_style2); }
                    if ( id_style3 != '' ) { arrayStylesUser.push(id_style3); }
                    if ( arrayStylesUser.length ) {
                        api.insertSumarioDocumento(arrayStylesUser);
                        resetDialogBoxPro('dialogBoxPro');
                    }
                }
            }]
        });
}
export function insertSumarioDocumento(arrayStylesUser) {
    var selectStyles = arrayStylesUser.join(', ');
    var htmlSumario = '<p class="Texto_Alinhado_Esquerda"><strong>SUM\u00C1RIO</strong></p>';
        state.iframeEditor.find(selectStyles).each(function(index){
            var randRef = randomString(16);
            var text = q(this).text().trim();
            htmlSumario+= '<p class="Texto_Alinhado_Esquerda"><a href="#bookmark-'+randRef+'">'+q(this).text().trim()+'</a></p>';
            q(this).find('a.seipro-bookmark').remove();
            q(this).prepend('<a class="seipro-bookmark" name="bookmark-'+randRef+'"></a>');
        });
    var select = state.oEditor.getSelection().getStartElement();
    var pElement = q(select.$).closest('p');
    if ( pElement.length ) {
        state.oEditor.focus();
        state.oEditor.fire('saveSnapshot');
        state.iframeEditor.find(pElement).after(htmlSumario);
        state.oEditor.fire('saveSnapshot');
    }
}

// GERA QR CODE
api.getSumarioDocumento = getSumarioDocumento;
api.getListStylesDocumento = getListStylesDocumento;
api.updateSelectDialog = updateSelectDialog;
api.getDialogSumarioDocumento = getDialogSumarioDocumento;
api.insertSumarioDocumento = insertSumarioDocumento;
