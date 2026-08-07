// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
import { callAtiv } from './call.js';
/**
 * Atividades — filtros e carregamento de relatórios.
 *
 * Esta fatia mantém apenas a superfície legada necessária durante a migração.
 * O estado compartilhado é instalado por runtime.js e os nomes antigos são
 * publicados exclusivamente por legacy-api.js.
 */
import { getServerAtividades } from './server.js';

export function getTabsRelatorio(this_) {
    $('#chartRelatorioPanel').hide();
    var _this = $(this_);
    var panel = 'tableRelatorioPanel';
    var tabs = 'tabsPanelRelatorio'; //tabelaPanelScroll resizeObserve
    var htmlToolbar = '<div id="' + tabs + '" style="border: none; min-height: 300px; margin: 0;">' +
        '    <ul>' +
        (callAtiv('checkCapacidade','report_demandas') ?
            '       <li><a href="#tabs_report-demandas"><i class="fas fa-list-alt cinzaColor" style="margin-right: 5px;"></i> ' + __.Demandas + '</a></li>' +
            '' : '') +
        (callAtiv('checkCapacidade','report_planos') ?
            '       <li><a href="#tabs_report-planos"><i class="fas fa-list-alt cinzaColor" style="margin-right: 5px;"></i> Planos de Trabalho</a></li>' +
            '' : '') +
        (callAtiv('checkCapacidade','report_atividades') ?
            '       <li><a href="#tabs_report-atividades"><i class="fas fa-list-alt cinzaColor" style="margin-right: 5px;"></i> ' + __.Atividades + '</a></li>' +
            '' : '') +
        (callAtiv('checkCapacidade','report_afastamentos') ?
            '       <li><a href="#tabs_report-afastamentos"><i class="fas fa-list-alt cinzaColor" style="margin-right: 5px;"></i> Afastamentos</a></li>' +
            '' : '') +
        (!callAtiv('checkOptionEntidade','desativa_produtividade_geral') && callAtiv('checkCapacidade','report_produtividade') ?
            '       <li><a href="#tabs_report-produtividade"><i class="fas fa-list-alt cinzaColor" style="margin-right: 5px;"></i> Produtividade</a></li>' +
            '' : '') +
        (callAtiv('checkCapacidade','report_demandas_excluidas') ?
            '       <li><a href="#tabs_report-demandas_excluidas"><i class="fas fa-list-alt cinzaColor" style="margin-right: 5px;"></i> ' + __.Demandas + ' exclu\u00EDdas</a></li>' +
            '' : '') +
        (callAtiv('checkCapacidade','report_prescricoes') ?
            '       <li><a href="#tabs_report-prescricoes"><i class="fas fa-history cinzaColor" style="margin-right: 5px;"></i> ' + __.Prescricoes + '</a></li>' +
            '' : '') +
        (callAtiv('checkCapacidade','report_email') ?
            '       <li><a href="#tabs_report-email"><i class="fas fa-at cinzaColor" style="margin-right: 5px;"></i> E-mail</a></li>' +
            '' : '') +
        (callAtiv('checkCapacidade','report_log') ?
            '       <li><a href="#tabs_report-log"><i class="fas fa-user-secret cinzaColor" style="margin-right: 5px;"></i> Log</a></li>' +
            '' : '') +
        '    </ul>' +
        (callAtiv('checkCapacidade','report_demandas') ?
            '    <div id="tabs_report-demandas" class="" style="overflow-x: scroll; padding: 0;"><div class="dataFallback" style="z-index: 1;" data-text="Nenhum dado dispon\u00EDvel"></div></div>' +
            '' : '') +
        (callAtiv('checkCapacidade','report_planos') ?
            '    <div id="tabs_report-planos" class="" style="overflow-x: scroll; padding: 0;"><div class="dataFallback" style="z-index: 1;" data-text="Nenhum dado dispon\u00EDvel"></div></div>' +
            '' : '') +
        (callAtiv('checkCapacidade','report_atividades') ?
            '    <div id="tabs_report-atividades" class="" style="overflow-x: scroll; padding: 0;"><div class="dataFallback" style="z-index: 1;" data-text="Nenhum dado dispon\u00EDvel"></div></div>' +
            '' : '') +
        (callAtiv('checkCapacidade','report_afastamentos') ?
            '    <div id="tabs_report-afastamentos" class="" style="overflow-x: scroll; padding: 0;"><div class="dataFallback" style="z-index: 1;" data-text="Nenhum dado dispon\u00EDvel"></div></div>' +
            '' : '') +
        (!callAtiv('checkOptionEntidade','desativa_produtividade_geral') && callAtiv('checkCapacidade','report_produtividade') ?
            '    <div id="tabs_report-produtividade" class="" style="overflow-x: scroll; padding: 0;"><div class="dataFallback" style="z-index: 1;" data-text="Nenhum dado dispon\u00EDvel"></div></div>' +
            '' : '') +
        (callAtiv('checkCapacidade','report_demandas_excluidas') ?
            '    <div id="tabs_report-demandas_excluidas" class="" style="overflow-x: scroll; padding: 0;"><div class="dataFallback" style="z-index: 1;" data-text="Nenhum dado dispon\u00EDvel"></div></div>' +
            '' : '') +
        (callAtiv('checkCapacidade','report_prescricoes') ?
            '    <div id="tabs_report-prescricoes" class="" style="overflow-x: scroll; padding: 0;"><div class="dataFallback" style="z-index: 1;" data-text="Nenhum dado dispon\u00EDvel"></div></div>' +
            '' : '') +
        (callAtiv('checkCapacidade','report_email') ?
            '    <div id="tabs_report-email" class="" style="overflow-x: scroll; padding: 0;"><div class="dataFallback" style="z-index: 1;" data-text="Nenhum dado dispon\u00EDvel"></div></div>' +
            '' : '') +
        (callAtiv('checkCapacidade','report_log') ?
            '    <div id="tabs_report-log" class="" style="overflow-x: scroll; padding: 0;"><div class="dataFallback" style="z-index: 1;" data-text="Nenhum dado dispon\u00EDvel"></div></div>' +
            '' : '') +
        '</div>';
    $('#' + panel).html(htmlToolbar).show();
    $('#' + tabs).tabs({
        activate: function (event, ui) {
            var active = $(this).tabs("option", "active");
            var type = ui.newPanel[0].id.replace('tabs_report-', '');
            setOptionsPro('report_' + tabs + 'ActiveTabs', active);
            removeOptionsPro('rememberScroll_report_' + type);
            resetDialogBoxPro('dialogBoxPro');
            getTabReport(type, 'get');
            $('.tableRelatorioView caption.infraCaption').html('');
        }
    });
    var tabActive = getOptionsPro('report_' + tabs + 'ActiveTabs');
    if (tabActive) {
        $('#' + tabs).tabs("option", "active", tabActive);
    } else {
        getTabReport('demandas', 'get');
    }
    //initDaterangePicker();
}
export function initDaterangePicker(TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    if (typeof $().daterangepicker === 'function') {
        $('input[name="dates"]').daterangepicker({
            "locale": {
                "format": "DD/MM/YYYY",
                "separator": " - ",
                "applyLabel": "Aplicar",
                "cancelLabel": "Cancelar",
                "daysOfWeek": [
                    "Dom",
                    "Seg",
                    "Ter",
                    "Qua",
                    "Qui",
                    "Sex",
                    "Sab"
                ],
                "monthNames": [
                    "Janeiro",
                    "Fevereiro",
                    "Mar\u00E7o",
                    "Abril",
                    "Maio",
                    "Junho",
                    "Julho",
                    "Agosto",
                    "Setembro",
                    "Outubro",
                    "Novembro",
                    "Dezembro"
                ],
                "firstDay": 1
            }
        });
    } else {
        setTimeout(function () {
            if (TimeOut == 9000) {
                $.getScript((URL_SPRO + "js/lib/daterangepicker.js"));
                loadStylePro(URL_SPRO + "css/daterangepicker.css");
            }
            initDaterangePicker(TimeOut - 100);
            if (typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage')) console.log('Reload initDaterangePicker');
        }, 500);
    }
}
export function getTabReport(type, mode, data_ = false, offset = 0, return_param = false) {
    if (callAtiv('checkCapacidade','report_' + type) && mode == 'get') {
        var filter = callAtiv('getFilterTable',type, 'report');
        var data = getOptionsPro('selectReport_' + type);
        data = (typeof data !== 'undefined' && data !== null && data) ? data : return_param;
        var id_programa = (data && typeof data.id_programa !== 'undefined' && data.id_programa !== null) ? data.id_programa : 0;
        id_programa = (id_programa == 0) ? jmespath.search(arrayConfigAtividades.programas, "[*].id_programa | [0]") : id_programa;
        id_programa = (id_programa === null) ? 0 : id_programa;
        var id_plano = (return_param && typeof return_param.id_plano !== 'undefined' && return_param.id_plano !== null) ? return_param.id_plano : false;
        var disabled = (getOptionsPro('changeDisabledTableReport_' + type) && getOptionsPro('changeDisabledTableReport_' + type) == 'show') ? 'show' : 'hide';
        var return_empty = (type == 'email' || type == 'log') && !filter ? true : false;
        var all_data = (getOptionsPro('changeViewTableReport_' + type) == 'show') ? true : false;
        var column_filter = $('#tableRelatorio_' + type).find('input.tablesorter-filter:focus').attr('data-column');
        var action = 'report_' + type;
        var param = {
            action: action,
            disabled: disabled,
            all_data: all_data,
            id_programa: id_programa,
            id_plano: id_plano,
            offset: offset,
            return_empty: return_empty,
            filter: JSON.stringify(filter),
            column_filter: column_filter
        };
        getServerAtividades(param, action, type);
        if (return_empty && !filter) {
            setTimeout(() => {
                // console.log('****');
                let tableConfig = $('#tableRelatorio_' + type);
                tableConfig.find('button[data-value="Pesquisar"]').trigger('click');
                tableConfig.find('.dataFallback').attr('data-text', 'Digite um termo para iniciar a pesquisa').find('a')
                    .removeAttr('onclick')
                    .attr({ 'data-act': 'atividades-call', 'data-fn': 'initFilterBtn', 'data-tip': 'Iniciar a pesquisa' })
                    .find('i.icon-parent').attr('class', 'fas fa-search icon-parent').end().find('i.fa-layers-bottom').remove();
            }, 2000);
        } else {
            $('#tabs_report-' + type).css('width', $('#tabsPanelRelatorio').width()).find('.dataFallback').addClass('dataLoading');
        }
    } else if (callAtiv('checkCapacidade','report_' + type) && mode == 'set') {
        updateServerTabReport(data, param);
        infraTooltipOcultar();
    }
}
export function updateServerTabReport(data, param) {
    loadingButtonConfirm(false);
    callAtiv('getTableRelatorioPanel',data, param);
}
