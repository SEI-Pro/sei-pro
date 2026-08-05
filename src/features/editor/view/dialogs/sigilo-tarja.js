/**
 * Editor module — migrated from body.js (CKEditor 4 / SEI 4.1).
 * Uses lib/domq.js (`q`) instead of the jQuery library.
 */
import { q } from '../../lib/domq.js';
import { state } from '../../state.js';
import { api } from '../../api.js';

export function initAddButtonTarjaSigilo(TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    if (q('.getMarkSigiloButton').length) {
        api.addButtonTarjaSigilo()
    } else {
        setTimeout(function(){
            api.initAddButtonTarjaSigilo(TimeOut - 100);
            if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage'))console.log('Reload initAddButtonTarjaSigilo');
        }, 500);
    }
}
export function addButtonTarjaSigilo() {
    var icon16baseTarjaSigilo = URL_SPRO + 'icons/menu/tarjasigilo.png';
    var htmlButtonAfterLetters =    '   <a class="getTarjaSigiloButton cke_iconPro cke_button cke_buttonPro cke_button_off" href="#" title="Adicionar tarja de sigilo no texto" hidefocus="true">'+
                                    '      <span class="cke_button_icon" style="background: url(\''+icon16baseTarjaSigilo+'\');">&nbsp;</span>'+
                                    '      <span class="cke_button_label" aria-hidden="false">Adicionar tarja de sigilo no texto</span>'+
                                    '   </a>';
        q(state.txaEditor).each(function(index){
            state.idEditor = q(this).attr('id').replace('cke_', '');
            if ( q('iframe[title*="'+state.idEditor+'"]').contents().find('body').attr('contenteditable') == 'true' ) {
                q(this).find('span.cke_toolgroup .getMarkSigiloButton').after(htmlButtonAfterLetters);
            }
        });
        q('.getTarjaSigiloButton').on('click',function() { if (!q(this).closest('.cke_iconPro').hasClass('cke_button_disabled')) { api.getTarjaSigilo(this) } });
}
api.initAddButtonTarjaSigilo = initAddButtonTarjaSigilo;
api.addButtonTarjaSigilo = addButtonTarjaSigilo;
