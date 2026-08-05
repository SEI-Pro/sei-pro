/**
 * Editor module — migrated from body.js (CKEditor 4 / SEI 4.1).
 * Uses lib/domq.js (`q`) instead of the jQuery library.
 */
import { q } from '../lib/domq.js';
import { state } from '../state.js';
import { api } from '../api.js';

export function repairSaveButtonBug(loop = true) {
    if (q('.cke_button.cke_button__save').hasClass('cke_button_off')) {
        for (var i in CKEDITOR.instances) {
            var edit = CKEDITOR.instances[i];
            if (!edit.readOnly) {
                edit.on('saveSnapshot', habilitaSalvar);
                edit.on('key', habilitaSalvar);
                edit.on('afterCommandExec', habilitaSalvar);
                edit.on('tableResize', habilitaSalvar);
            } else {
                edit.document.$.body.style.background=readOnlyColor;
            }
        }
        redimensionar();
        console.log('reparSaveButtonBug');
    }
    if (loop) {
        setTimeout(function(){
            api.repairSaveButtonBug(false);
        }, 3000);
    }
}
api.repairSaveButtonBug = repairSaveButtonBug;
