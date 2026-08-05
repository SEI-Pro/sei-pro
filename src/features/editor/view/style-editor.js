/**
 * Editor module — migrated from body.js (CKEditor 4 / SEI 4.1).
 * Uses lib/domq.js (`q`) instead of the jQuery library.
 */
import { q } from '../lib/domq.js';
import { state } from '../state.js';
import { api } from '../api.js';

export function getBoxStyleEditor(this_) {
    var btn = q('.getNewStyleButton');
	if ( btn.hasClass('cke_button_off') ) {
        btn.addClass('cke_button_on').removeClass('cke_button_off');
        api.updateStyleEditor('set');
	} else {
        btn.addClass('cke_button_off').removeClass('cke_button_on');
        api.updateStyleEditor('remove');
	}
}
export function updateStyleEditor(mode) {
    if (mode == 'set') {
        localStorage.setItem('seiSlim_editor', true);
        q('head').find('link[data-style="seipro-fonticon"]').remove();
        q('head').find('style[data-style="seipro-fonticon"]').remove();
        if (typeof insertFontIcon === 'function') insertFontIcon('head');
        q('body').addClass('seiSlim seiSlim_parent seiSlim_view');
    } else {
        localStorage.removeItem('seiSlim_editor');
        q('body').attr('class','');
    }
}
api.getBoxStyleEditor = getBoxStyleEditor;
api.updateStyleEditor = updateStyleEditor;
