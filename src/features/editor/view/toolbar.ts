// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/**
 * Editor module — migrated from body.js (CKEditor 4 / SEI 4.1).
 * Uses lib/domq.js (`q`) instead of the jQuery library.
 */
import { q } from '../lib/domq.js';
import { state } from '../state.js';
import { api } from '../api.js';

export function addButton(TimeOut = 9000) {
    if (TimeOut <= 0) return;
    setTimeout(function() {
        // Re-bind on every attempt — iframe may appear after first boot wait
        if (typeof api.getPageCkeditor === 'function') {
            const cke = api.getPageCkeditor();
            if (cke && typeof api.bindCkeditorGlobal === 'function') api.bindCkeditorGlobal(cke);
        }
        if (typeof globalThis.CKEDITOR === 'undefined' || !globalThis.CKEDITOR.dialog) {
            api.addButton(TimeOut - 100);
            return;
        }
        if (q(state.txaEditor).length && !q('.cke_buttonPro').length) {
            if (!q('#idEditor').length) q('#divComandos').append('<input style="display:none" type="hidden" id="idEditor">');
            q(state.txaEditor).each(function() {
                var currentEditorId = q(this).attr('id').replace('cke_', '');
                var editorInstance = globalThis.CKEDITOR.instances[currentEditorId];
                var editable = editorInstance
                    ? editorInstance.readOnly === false
                    : q('iframe[title*="'+currentEditorId+'"]').contents().find('body').attr('contenteditable') == 'true';
                var status = editable ? '' : 'disable';
                q(this).find('span.cke_toolbox').append(api.htmlButton(status).default);
                q(this).find('span.cke_toolgroup .cke_button__table').before(api.htmlButton(status).tables);
                q(this).find('span.cke_toolgroup .cke_button__minuscula').after(api.htmlButton(status).afterletters);
                q(this).find('span.cke_toolgroup .cke_button__cut').before(api.htmlButton(status).beforeCut);
                q(this).find('span.cke_toolgroup .cke_button__numberedlist').before(api.htmlButton(status).beforeList);
                q(this).find('span.cke_toolgroup .cke_button__base64image').after(api.htmlButton(status).afterImage);
                q(this).find('span.cke_toolbox').append(api.htmlButton(status).newBlock);
                if (editable && typeof insertFontIcon === 'function') {
                    insertFontIcon('head', q('iframe[title*="'+currentEditorId+'"]').contents());
                }
            });
            api.setClickButtons();
            api.initFunctions();
            api.addStyleIframes();
        } else {
            api.addButton(TimeOut - 100);
            console.log('addButton Reload => '+TimeOut);
        }
    }, 500);
}
export const setClickButtons = () => {
    // A toolbar é criada de forma assíncrona e existe uma cópia por seção do
    // documento. Os cliques são tratados por delegação em delegated-actions.js.
    return true;
}
api.addButton = addButton;
api.setClickButtons = setClickButtons;
