/**
 * Lista de processos — panel/kanban chrome + initAddKanban.
 * (ponte temporária: jQuery/DOM legado; fatia do antigo body.js)
 */
import {
    addKanbanProc,
    initTableTag,
    storeGroupTablePro
} from './modules.js';

export function loadKanbanStylePro() {
    var base = typeof URL_SPRO !== 'undefined' ? URL_SPRO : '';
    if (!base || typeof loadStylePro !== 'function') return;
    loadStylePro(base + 'css/jkanban.min.css');
}

export function selectPanelKanbanHome() {
    var type = storeGroupTablePro();
        type = (!type || type == 'all' || type == '') ? false : true;
    // data-act (não onclick): handlers inline rodam no mundo MAIN e não enxergam
    // getPanelProc no content script isolado — ver DEVELOPMENT.md (isolated-first).
    var html =  '<div id="processosProActions" class="panelHome panelHomeProcessos" style="'+(type ? 'display: inline-block;' : 'display:none;')+' vertical-align: middle; margin-left: 10px; width: auto;">'+
                '    <div class="btn-group processosBtnPanel" role="group" style="margin-right: 10px;">'+
                '       <button type="button" data-act="panel-proc" data-value="Tabela" class="btn btn-sm btn-light '+(getOptionsPro('panelProcessosView') == 'Tabela' || !getOptionsPro('panelProcessosView') ? 'active' : '')+'"><i class="fas fa-table" style="color: #888;"></i> <span class="text">Tabela</span></button>'+
                '       <button type="button" data-act="panel-proc" data-act-dbl="panel-proc-refresh" title="D\u00EA um duplo clique para atualizar o quadro" data-value="Quadro" class="btn btn-sm btn-light '+(getOptionsPro('panelProcessosView') == 'Quadro' ? 'active' : '')+'"><i class="fas fa-project-diagram" style="color: #888;"></i> <span class="text">Quadro</span></button>'+
                '    </div>'+
                '</div>';
    return html;
}
export function removeDataPanelProc(_this) {
    removeOptionsPro('listaMarcadores');
    removeOptionsPro('arrayListUsersSEI');
    getPanelProc(_this);
}
export function getPanelProc(this_) {
    var data = $(this_).data();
    var mode = data.value;
    $(this_).closest('#processosProActions').find('.btn.active').removeClass('active');
    $(this_).addClass('active');
    if (mode == 'Quadro') {
        var type = storeGroupTablePro();
        if (!type || type == 'all' || type == '') {
            var selectGroupTablePro = $('#selectGroupTablePro');
                selectGroupTablePro.val('tags').trigger('change');
                if (verifyConfigValue('substituiselecao')) {
                    selectGroupTablePro.chosen('destroy').chosen({
                        placeholder_text_single: ' ',
                        no_results_text: 'Nenhum resultado encontrado',
                        normalize_search_text: function(text) {
                            return removeAcentos(text.toLowerCase());
                        }
                    }).trigger('chosen:updated');
                }
                setTimeout(function(){ 
                    initAddKanbanProc();
                }, 500);
        } else {
            initAddKanbanProc();
        }
    } else {
        $('#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado').show();
        $('#processosKanban').remove();
        initTableTag(storeGroupTablePro());
    }
    setOptionsPro('panelProcessosView', mode);
}
// Delegação isolated-world para os botões Tabela/Quadro (substitui onclick/ondblclick).
export function installPanelProcDelegation(root) {
    var target = root || document;
    if (target.__seiproPanelProcBound) return;
    target.__seiproPanelProcBound = true;
    target.addEventListener('click', function (ev) {
        var el = ev.target && ev.target.closest && ev.target.closest('[data-act="panel-proc"]');
        if (!el || !target.contains(el)) return;
        ev.preventDefault();
        getPanelProc(el);
    });
    target.addEventListener('dblclick', function (ev) {
        var el = ev.target && ev.target.closest && ev.target.closest('[data-act-dbl="panel-proc-refresh"]');
        if (!el || !target.contains(el)) return;
        ev.preventDefault();
        removeDataPanelProc(el);
    });
}
installPanelProcDelegation(document);
export function initAddKanbanProc(type = storeGroupTablePro(), loop = 3, TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    loadKanbanStylePro();
    if (typeof jKanban !== 'undefined') { 
        addKanbanProc(type, loop);
    } else {
        loadKanbanStylePro();
        if (typeof jKanban === 'undefined') $.getScript(URL_SPRO+"js/lib/jkanban.min.js");
        setTimeout(function(){ 
            initAddKanbanProc(type, loop, TimeOut - 100); 
            if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage'))console.log('Reload initAddKanbanProc'); 
        }, 500);
    }
}
