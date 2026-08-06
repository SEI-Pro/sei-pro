import { callAtiv } from './call.js';
/**
 * Atividades — edição e ciclo de vida das configurações.
 *
 * Esta fatia mantém apenas a superfície legada necessária durante a migração.
 * O estado compartilhado é instalado por runtime.js e os nomes antigos são
 * publicados exclusivamente por legacy-api.js.
 */
import './runtime.js';
import { getServerAtividades } from './server.js';

export function getTableTabConfig(type, data, param) {
    var tabsID = $('#tabs-' + type);
    var idConfigTabela = 'tableConfiguracoesPanel_' + type;
    var tabelaConfig = $('#' + idConfigTabela);
    var listConfig = data.config;
    var isInitOffset = (typeof data.offset === 'undefined' || data.offset == 0) ? true : false;
    var offset = (typeof data.offset !== 'undefined' && data.offset != 0) ? data.offset : false;
    var checkListConfig = (typeof listConfig !== 'undefined' && listConfig.length > 0 && listConfig != 0) ? listConfig.length : false;
    var countConfig = (checkListConfig && checkListConfig == 1)
        ? checkListConfig + ' registro:'
        : (checkListConfig && checkListConfig > 1) ? checkListConfig + ' registros:' : 'nenhum registro';

    var numRegistros = tabelaConfig.find('caption.infraCaption span.count');
    numRegistros = (numRegistros.length > 0 && !isInitOffset) ? parseInt(numRegistros.text()) : 0;
    var novosRegistros = (typeof listConfig !== 'undefined' && listConfig.length > 0 && listConfig != 0) ? listConfig.length : 0;
    var totalRegistros = numRegistros + novosRegistros;
    // var totalRegistros = 0;
    var countConfig = (totalRegistros == 1) ? '<span class="count">' + totalRegistros + '</span> registro:' : '<span class="count">' + totalRegistros + '</span> registros:';
    var loadingRegistros = (typeof data.next_offset === 'undefined' || !data.next_offset) ? '' : '<span class="progress" style="color: #777;font-size: 0.9em !important;padding: 5px;margin: 5px;"><i class="fas fa-sync fa-spin cinzaColor"></i> carregando dados... <a class="cancel" style="cursor:pointer" data-act="atividades-tablesorter-cancel"><i class="fas fa-times cinzaColor" style="font-size: 100%;"></i></a></span>';

    if (typeof listConfig !== 'undefined' && listConfig.length > 0 && listConfig != 0) {
        if (checkListConfig) {
            listConfig = listConfig.length && typeof listConfig[0].data_fim !== 'undefined' ? jmespath.search(listConfig, "sort_by([*],&data_fim)") : listConfig;

            var countUnidades = uniqPro(jmespath.search(listConfig, "[?sigla_unidade].sigla_unidade"));
            countUnidades = (countUnidades !== null) ? countUnidades.length : 0;
        } else {
            var countUnidades = 0;
        }

        if (isInitOffset) {
            tableConfigList[type] = listConfig;
        } else {
            tableConfigList[type] = tableConfigList[type].concat(listConfig);
        }

        var tableConfigPanel = tabsID.find('table.tableIDInfo');

        if (isInitOffset) {
            var htmlTableConfig = getColumnPanelConfigs(listConfig, type, idConfigTabela, isInitOffset, countConfig + loadingRegistros);
            tabsID.html(htmlTableConfig);
        } else {
            if (tableConfigPanel.find('caption.infraCaption a.cancel').is(':visible')) {
                tableConfigPanel.find('caption.infraCaption span.count').text(totalRegistros);
            }
        }
        getRowsPanelConfigs(listConfig, type, offset);

        if (tabsID.find('caption.infraCaption a.cancel').is(':visible') && (typeof data.next_offset !== 'undefined' || !data.next_offset)) {
            callAtiv('getTabConfig',type, 'get', data, false, data.next_offset, param);
        } else {
            tableConfigPanel.find('caption.infraCaption span.progress').remove();
        }

        var tableConfigID = '#tabelaConfigPanel_' + type;
        var tableConfigElem = $(tableConfigID);
        if (!getOptionsPro('panelHeight_configuracoesTabelaPro_' + type) && tableConfigElem.height() > 800) { setOptionsPro('panelHeight_configuracoesTabelaPro_' + type, 800) }
        initPanelResize(tableConfigID, 'configuracoesTabelaPro_' + type);
        initChosenReplace('panel');

        $.each(listConfig, function (i, v) {
            var id = (type == 'atividades') ? v.id_atividade : 0;
            id = (type == 'planos') ? v.id_plano : id;
            id = (type == 'programas') ? v.id_programa : id;
            id = (type == 'mapas') ? v.id_mapa : id;
            id = (type == 'acoes') ? v.id_acao : id;
            id = (type == 'entregas') ? v.id_entrega : id;
            id = (type == 'objetivos') ? v.id_objetivo : id;
            id = (type == 'users') ? v.id_user : id;
            id = (type == 'unidades') ? v.id_unidade : id;
            id = (type == 'entidades') ? v.id_entidade : id;
            if (getRecentDateRow(v.data_inicio, -5)) {
                var row = tableConfigElem.find('tbody tr[data-id="' + id + '"]');
                setTimeout(function () {
                    row.find('td').effect('highlight').delay(2).effect('highlight').delay(2).effect('highlight');
                    if (
                        (type == 'atividades' && row.hasClass('new')) ||
                        type == 'planos' ||
                        type == 'programas' ||
                        type == 'objetivos' ||
                        type == 'mapas' ||
                        type == 'acoes' ||
                        type == 'entregas' ||
                        type == 'users' ||
                        type == 'unidades' ||
                        type == 'entidades'
                    ) {
                        row.get(0).scrollIntoView();
                        tableConfigElem.scrollTop(tableConfigElem.scrollTop() - 30);
                    }
                }, 500);
            }
        });
        rememberScroll(tableConfigID, 'config_' + type, false);
        initFunctionsPanelConfigs(idConfigTabela, type, param);

    } else {
        if (totalRegistros == 0 && isInitOffset) {

            var htmlTableConfigs = getColumnPanelConfigs(listConfig, type, idConfigTabela, isInitOffset, countConfig + loadingRegistros);
            tabsID.html(htmlTableConfigs);

            var htmlNullData = '<div class="dataFallback" style="z-index: 9" data-text="Nenhum dado dispon\u00EDvel">' +
                '    <div style="position: absolute;top: calc(50% - 60px);width: 100%;text-align: center;">' +
                '    ' + ($('.actionsConfig_' + type).find('.iconConfig_add')[0].outerHTML) +
                '    </div>' +
                '</div>';

            var tableConfigPanel = tabsID.find('table.tableIDInfo');
            var colspan = tableConfigPanel.find('thead th').length;
            tableConfigPanel.find('tbody').html('<tr><td colspan="' + colspan + 1 + '">' + htmlNullData + '</td></tr>');
            tableConfigPanel.find('caption.infraCaption span.progress').remove();
            initFunctionsPanelConfigs(idConfigTabela, type, param);

        } else {
            tabsID.find('table.tableIDInfo caption.infraCaption span.progress').remove();
        }
    }
}
export function initFunctionsPanelConfigs(idConfigTabela, type, param) {

    var tableSorterList = (type == 'atividades') ? [[4, 0], [1, 0]] : undefined;
    tableSorterList = (type == 'planos') ? [[2, 0], [1, 0]] : tableSorterList;
    tableSorterList = (type == 'programas') ? [[1, 0]] : tableSorterList;
    tableSorterList = (type == 'users') ? [[1, 0]] : tableSorterList;
    tableSorterList = (type == 'unidades') ? [[3, 0], [1, 0]] : tableSorterList;
    tableSorterList = (type == 'entidades') ? [[1, 0]] : tableSorterList;

    var configTabela = $('#' + idConfigTabela);
    configTabela.tablesorter({
        sortList: tableSorterList,
        sortLocaleCompare: true,
        textExtraction: {
            1: function (elem, table, cellIndex) {
                var text = $(elem).find('span').text().trim();
                var tr = $(elem).closest('tr');
                var priority = (tr.hasClass('new')) ? 'AAA ' : 'BBB ';
                priority = (tr.hasClass('closed')) ? 'YYY ' : 'BBB ';
                priority = (tr.hasClass('disabled')) ? 'ZZZ ' : 'BBB ';
                return priority + text;
            },
            2: function (elem, table, cellIndex) { return filterTextExtractDate(elem, table, cellIndex) },
            3: function (elem, table, cellIndex) { return filterTextExtractDate(elem, table, cellIndex) },
            4: function (elem, table, cellIndex) { return filterTextExtractDate(elem, table, cellIndex) },
            5: function (elem, table, cellIndex) { return filterTextExtractDate(elem, table, cellIndex) },
            6: function (elem, table, cellIndex) { return filterTextExtractDate(elem, table, cellIndex) },
            7: function (elem, table, cellIndex) { return filterTextExtractDate(elem, table, cellIndex) },
            8: function (elem, table, cellIndex) { return filterTextExtractDate(elem, table, cellIndex) },
            9: function (elem, table, cellIndex) { return filterTextExtractDate(elem, table, cellIndex) }
        },
        widgets: ["saveSort", "filter"],
        widgetOptions: {
            saveSort: true,
            filter_hideFilters: true,
            filter_columnFilters: true,
            filter_saveFilters: true,
            filter_hideEmpty: true,
            filter_excludeFilter: {}
        },
        sortReset: true,
        headers: {
            0: { sorter: false, filter: false },
            1: { filter: true },
            2: { filter: true },
            3: { filter: true },
            4: { filter: true },
            5: { filter: true },
            6: { filter: true },
            7: { filter: true },
            8: { filter: true },
            9: { filter: true }
        }
    }).on("sortEnd", function (event, data) {
        checkboxRangerSelectShift();
    }).on("filterEnd", function (event, data) {
        checkboxRangerSelectShift();
        $(this).find('caption span.count').text(data.filteredRows);
        $(this).find('tbody > tr:visible > td > input').prop('disabled', false);
        $(this).find('tbody > tr:hidden > td > input').prop('disabled', true);
        let filter = callAtiv('getFilterTable',type);
        filter = filter ? JSON.stringify(filter) : false;
        let show_all = (getOptionsPro('changeAllItensTableConfig_' + type) && getOptionsPro('changeAllItensTableConfig_' + type) == 'show') ? true : false;
        let return_filter = typeof param !== 'undefined' && typeof param.filter !== 'undefined' ? param.filter : false;
        if (filter && !show_all && (return_filter || typeof param === 'undefined') && return_filter != filter) callAtiv('getTabConfig',type, 'get');
        setTimeout(() => { if (typeof param !== 'undefined' && typeof param.column_filter !== 'undefined') $('#tableConfiguracoesPanel_' + type).find('input.tablesorter-filter[data-column="' + param.column_filter + '"]').focus() }, 500);
        // console.log(filter, !show_all, return_filter, return_filter != filter);
    });

    if (callAtiv('checkCapacidade','config_update_' + type)) {
        initTableCellEditor(idConfigTabela, type);
    }

    var filterConfig = configTabela.find('.tablesorter-filter-row').get(0);
    if (typeof filterConfig !== 'undefined') {
        var observerFilterConfig = new MutationObserver(function (mutations) {
            var _this = $(mutations[0].target);
            var _parent = _this.closest('table');
            var iconFilter = _parent.find('.filterTablePro button');
            var checkIconFilter = iconFilter.hasClass('active');
            var hideme = _this.hasClass('hideme');
            if (hideme && checkIconFilter) {
                iconFilter.removeClass('active');
            }
        });
        setTimeout(function () {

            var htmlFilterConfig = '<div class="btn-group filterTablePro" role="group" style="right: 55px;top: -31px;z-index: 99;position: absolute;">' +
                '   <button type="button" data-act="atividades-call" data-fn="downloadTablePro" data-icon="fas fa-download" style="padding: 0.1rem .5rem; font-size: 9pt;" data-value="Baixar" class="btn btn-sm btn-light">' +
                '       <i class="fas fa-download" style="padding-right: 3px; cursor: pointer; font-size: 10pt; color: #888;"></i>' +
                '       <span class="text">Baixar</span>' +
                '   </button>' +
                '   <button type="button" data-act="atividades-call" data-fn="copyTablePro" data-icon="fas fa-copy" style="padding: 0.1rem .5rem; font-size: 9pt;" data-value="Copiar" class="btn btn-sm btn-light">' +
                '       <i class="fas fa-copy" style="padding-right: 3px; cursor: pointer; font-size: 10pt; color: #888;"></i>' +
                '       <span class="text">Copiar</span>' +
                '   </button>' +
                '   <button type="button" data-act="atividades-call" data-fn="filterTablePro" style="padding: 0.1rem .5rem; font-size: 9pt;" data-value="Pesquisar" class="btn btn-sm btn-light ' + (configTabela.find('tr.tablesorter-filter-row').hasClass('hideme') ? '' : 'active') + '">' +
                '       <i class="fas fa-search" style="padding-right: 3px; cursor: pointer; font-size: 10pt; color: #888;"></i>' +
                '       Pesquisar' +
                '   </button>' +
                '</div>';
            configTabela.find('thead .filterTablePro').remove();
            configTabela.find('thead').prepend(htmlFilterConfig);
            observerFilterConfig.observe(filterConfig, {
                attributes: true
            });
            configTabela.find('.tablesorter-filter-row input.tablesorter-filter[aria-label*="Data"]').attr('type', 'date');
        }, 500);
        if (typeof $().visible == 'undefined') $.getScript(URL_SPRO + "js/lib/jquery-visible.min.js");
    }

    var observerTableConfig = new MutationObserver(function (mutations) {
        var _this = $(mutations[0].target);
        var _parent = _this.closest('table');
        var count_all = _parent.find('tr.infraTrMarcada').length;
        var count_disable = _parent.find('tr.infraTrMarcada').not('.disabled').length;
        var count_reactive = _parent.find('tr.infraTrMarcada.disabled').length;
        var count_approve = _parent.find('tr.infraTrMarcada.approve').length;
        var count_disapprove = _parent.find('tr.infraTrMarcada.disapprove').length;
        var count_archivable = _parent.find('tr.infraTrMarcada.archivable').length;
        var count_archived = _parent.find('tr.infraTrMarcada.archived').length;
        if (count_approve > 0) {
            $('#configuracoesProActions .actionsConfig_' + type).find('.iconConfig_disapprove').show().find('.fa-layers-counter').text(count_approve);
        } else {
            $('#configuracoesProActions .actionsConfig_' + type).find('.iconConfig_disapprove').hide();
        }
        if (count_disapprove > 0) {
            $('#configuracoesProActions .actionsConfig_' + type).find('.iconConfig_approve').show().find('.fa-layers-counter').text(count_disapprove);
        } else {
            $('#configuracoesProActions .actionsConfig_' + type).find('.iconConfig_approve').hide();
        }
        if (count_disable > 0) {
            $('#configuracoesProActions .actionsConfig_' + type).find('.iconConfig_remove').show().find('.fa-layers-counter').text(count_disable);
            $('#configuracoesProActions .actionsConfig_' + type).find('.iconConfig_clone').show().find('.fa-layers-counter').text(count_disable);
            $('#configuracoesProActions .actionsConfig_' + type).find('.iconConfig_recalc').show().find('.fa-layers-counter').text(count_disable);
            $('#configuracoesProActions .actionsConfig_' + type).find('.iconConfig_close').show().find('.fa-layers-counter').text(count_disable);
        } else {
            $('#configuracoesProActions .actionsConfig_' + type).find('.iconConfig_remove').hide();
            $('#configuracoesProActions .actionsConfig_' + type).find('.iconConfig_clone').hide();
            $('#configuracoesProActions .actionsConfig_' + type).find('.iconConfig_recalc').hide();
            $('#configuracoesProActions .actionsConfig_' + type).find('.iconConfig_close').hide();
        }
        if (count_reactive > 0) {
            $('#configuracoesProActions .actionsConfig_' + type).find('.iconConfig_reactive').show().find('.fa-layers-counter').text(count_reactive);
        } else {
            $('#configuracoesProActions .actionsConfig_' + type).find('.iconConfig_reactive').hide();
        }
        if (count_archivable > 0) {
            $('#configuracoesProActions .actionsConfig_' + type).find('.iconConfig_archive').show().find('.fa-layers-counter').text(count_archivable);
        } else {
            $('#configuracoesProActions .actionsConfig_' + type).find('.iconConfig_archive').hide();
        }
        if (count_archived > 0) {
            $('#configuracoesProActions .actionsConfig_' + type).find('.iconConfig_unarchive').show().find('.fa-layers-counter').text(count_archived);
        } else {
            $('#configuracoesProActions .actionsConfig_' + type).find('.iconConfig_unarchive').hide();
        }
        if (count_all > 0) {
            // $('#configuracoesProActions .actionsConfig_'+type).find('.iconConfig_clone').show().find('.fa-layers-counter').text(count_all);
            // $('#configuracoesProActions .actionsConfig_'+type).find('.iconConfig_recalc').show().find('.fa-layers-counter').text(count_all);
            // $('#configuracoesProActions .actionsConfig_'+type).find('.iconConfig_close').show().find('.fa-layers-counter').text(count_all);
        } else {
            // $('#configuracoesProActions .actionsConfig_'+type).find('.iconConfig_clone').hide();
            // $('#configuracoesProActions .actionsConfig_'+type).find('.iconConfig_recalc').hide();
            // $('#configuracoesProActions .actionsConfig_'+type).find('.iconConfig_close').hide();
        }
    });
    setTimeout(function () {
        configTabela.find('tbody tr').each(function () {
            observerTableConfig.observe(this, {
                attributes: true
            });
        });
        checkboxRangerSelectShift();
        if (configBoxPro) centralizeDialogBox(configBoxPro);
    }, 500);
    if (type == 'planos' || type == 'termos' || type == 'entidades') initClassicEditor();
    if (type == 'atividades') callAtiv('getAtividadeTagsPro',);
}
export function getColumnPanelConfigs(listConfig, type, idConfigTabela, isInitOffset, captionConfig) {
    var htmlTableConfig = '';
    htmlTableConfig = (!isInitOffset) ? '' :
        '<div id="tabelaConfigPanel_' + type + '" class="tabelaPanelScroll" style="margin-top: 5px;">' +
        (type == 'planos' || type == 'termos' || type == 'programas' || type == 'unidades' || type == 'atividades' || type == 'users' || type == 'entregas' || type == 'acoes' ?
            '   <div class="editTableToggle hideListaInfItens" style="right: 820px;width: 220px;">' +
            '           <label class="label" for="changeListaInfTableConfig_' + type + '"><i class="fas fa-eye-slash ' + (getOptionsPro('changeListaInfTableConfig_' + type) && getOptionsPro('changeListaInfTableConfig_' + type) == 'show' ? 'azulColor' : 'cinzaColor') + '" style="margin: 0px 6px 0 4px;"></i> Unidades Vinculadas</label>' +
            '           <div class="onoffswitch">' +
            '               <input type="checkbox" name="onoffswitch" data-type="' + type + '" data-act="atividades-call" data-fn="changeListaInfTableConfig" class="onoffswitch-checkbox" id="changeListaInfTableConfig_' + type + '" tabindex="0" ' + (getOptionsPro('changeListaInfTableConfig_' + type) && getOptionsPro('changeListaInfTableConfig_' + type) == 'show' ? 'checked' : '') + '>' +
            '               <label class="onoff-switch-label" for="changeListaInfTableConfig_' + type + '"></label>' +
            '           </div>' +
            '   </div>' +
            '' : '') +
        (type == 'planos' && callAtiv('checkCapacidade','config_update_archive_planos') ?
            '   <div class="editTableToggle showAllItens" style="right: 1060px;width: 175px;">' +
            '           <label class="label" for="changeArchivedTableConfig_' + type + '"><i class="fas fa-inbox ' + (getOptionsPro('changeArchivedTableConfig_' + type) && getOptionsPro('changeArchivedTableConfig_' + type) == 'show' ? 'azulColor' : 'cinzaColor') + '" style="margin: 0px 6px 0 4px;"></i> Ver Arquivadas</label>' +
            '           <div class="onoffswitch">' +
            '               <input type="checkbox" name="onoffswitch" data-type="' + type + '" data-act="atividades-call" data-fn="changeArchivedTableConfig" class="onoffswitch-checkbox" id="changeArchivedTableConfig_' + type + '" tabindex="0" ' + (getOptionsPro('changeArchivedTableConfig_' + type) && getOptionsPro('changeArchivedTableConfig_' + type) == 'show' ? 'checked' : '') + '>' +
            '               <label class="onoff-switch-label" for="changeArchivedTableConfig_' + type + '"></label>' +
            '           </div>' +
            '   </div>' +
            '' : '') +
        '   <div class="editTableToggle showAllItens" style="right: 660px;width: 145px;">' +
        '           <label class="label" for="changeAllItensTableConfig_' + type + '"><i class="fas fa-eye-slash ' + (getOptionsPro('changeAllItensTableConfig_' + type) && getOptionsPro('changeAllItensTableConfig_' + type) == 'show' ? 'azulColor' : 'cinzaColor') + '" style="margin: 0px 6px 0 4px;"></i> Ver Todas</label>' +
        '           <div class="onoffswitch">' +
        '               <input type="checkbox" name="onoffswitch" data-type="' + type + '" data-act="atividades-call" data-fn="changeAllItensTableConfig" class="onoffswitch-checkbox" id="changeAllItensTableConfig_' + type + '" tabindex="0" ' + (getOptionsPro('changeAllItensTableConfig_' + type) && getOptionsPro('changeAllItensTableConfig_' + type) == 'show' ? 'checked' : '') + '>' +
        '               <label class="onoff-switch-label" for="changeAllItensTableConfig_' + type + '"></label>' +
        '           </div>' +
        '   </div>' +
        '   <div class="editTableToggle hideDisabledItens" style="right: 500px;width: 140px">' +
        '           <label class="label" for="changeDisabledTableConfig_' + type + '"><i class="fas fa-eye-slash ' + (getOptionsPro('changeDisabledTableConfig_' + type) && getOptionsPro('changeDisabledTableConfig_' + type) == 'show' ? 'azulColor' : 'cinzaColor') + '" style="margin: 0px 6px 0 4px;"></i> Inativos</label>' +
        '           <div class="onoffswitch">' +
        '               <input type="checkbox" name="onoffswitch" data-type="' + type + '" data-act="atividades-call" data-fn="changeDisabledTableConfig" class="onoffswitch-checkbox" id="changeDisabledTableConfig_' + type + '" tabindex="0" ' + (getOptionsPro('changeDisabledTableConfig_' + type) && getOptionsPro('changeDisabledTableConfig_' + type) == 'show' ? 'checked' : '') + '>' +
        '               <label class="onoff-switch-label" for="changeDisabledTableConfig_' + type + '"></label>' +
        '           </div>' +
        '   </div>' +
        (callAtiv('checkCapacidade','config_update_' + type) ?
            '   <div class="editTableToggle" style="width:130px">' +
            '           <label class="label" for="changeViewTableConfig_' + type + '"><i class="fas fa-edit azulColor" style="margin: 0px 6px 0 4px;"></i> Edi\u00E7\u00E3o</label>' +
            '           <div class="onoffswitch">' +
            '               <input type="checkbox" name="onoffswitch" data-type="' + type + '" data-act="atividades-call" data-fn="changeViewTableConfig" class="onoffswitch-checkbox" id="changeViewTableConfig_' + type + '" tabindex="0" checked>' +
            '               <label class="onoff-switch-label" for="changeViewTableConfig_' + type + '"></label>' +
            '           </div>' +
            '   </div>' +
            '' : '') +
        '   <table id="' + idConfigTabela + '" class="tableIDInfo tableInfo tableZebra tableFollow tableAtividades seipro-atividades-table" data-tabletype="' + type + '">' +
        '      <caption class="infraCaption" style="text-align: left; margin-top: 10px;">' + captionConfig + '</caption>' +
        '      <thead style="position:relative">' +
        callAtiv('getRowsTableTabConfig',type, 'header', listConfig) +
        '      </thead>' +
        '      <tbody>';

    htmlTableConfig += (!isInitOffset) ? '' :
        '       </tbody>' +
        '   </table>' +
        '</div>';
    return htmlTableConfig;
}
export function getRowsPanelConfigs(listConfig, type, offset) {
    var tableConfig = $('#tableConfiguracoesPanel_' + type);
    var tableConfigBody = $('#tableConfiguracoesPanel_' + type + ' tbody');

    function initRowsPanelConfigs(index) {
        loadRowsPanelConfig = true;
        var totaldados = listConfig.length;
        var caption = tableConfig.find('caption.infraCaption');
        var numRegistros = caption.find('span.count');
        numRegistros = (numRegistros.length > 0) ? parseInt(numRegistros.text()) + totaldados : 0;
        // caption.find('span.count').text(numRegistros);
        setTimeout(() => {
            if (totaldados - 1 <= index && !caption.find('a.cancel').is(':visible')) {
                loadRowsPanelConfig = false;
                setTimeout(() => { if (!loadRowsPanelConfig && !callAtiv('getFilterTable',type)) { tableConfig.trigger('updateAll') } }, 1000);
            }
        }, 2000);
    }
    var limit = 100;
    var time = offset + 200;
    listConfig.forEach(function (value, index) {
        if (index >= limit) {
            setTimeout(function () {
                var htmlRowConfig = callAtiv('getRowsTableTabConfig',type, 'body', listConfig, value);
                tableConfigBody.append(htmlRowConfig);
                if (listConfig.length - 1 == index || index % 100 == 0) {
                    initRowsPanelConfigs(index);
                }
            }, time * index);
        } else {
            var htmlRowConfig = callAtiv('getRowsTableTabConfig',type, 'body', listConfig, value);
            tableConfigBody.append(htmlRowConfig);
            loadRowsPanelReport = false;
        }
    });
    if (listConfig.length <= limit) { initRowsPanelConfigs(100) }
}
export function initTableCellEditor(idConfigTabela, type, TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    if (typeof SimpleTableCellEditor !== 'undefined') {
        getTableCellEditor(idConfigTabela, type);
    } else {
        if (typeof SimpleTableCellEditor === 'undefined' && typeof URL_SPRO !== 'undefined' && TimeOut == 9000) {
            $.getScript(URL_SPRO + "js/lib/jquery-table-edit.min.js");
        }
        setTimeout(function () {
            initTableCellEditor(idConfigTabela, type, TimeOut - 100);
            if (typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage')) console.log('Reload initTableCellEditor');
        }, 500);
    }
}
export function getTableCellEditor(idConfigTabela, type) {
    var configTabela = $('#' + idConfigTabela);
    configEditor = new SimpleTableCellEditor(idConfigTabela);
    configEditor.SetEditableClass("editCell");
    configEditor.SetEditableClass("editCellCPF", {
        internals: {
            renderEditor: (elem, oldVal) => {
                $(elem).html('<input type="text" style="max-width: 80%;" value="' + oldVal + '" name="editCellCPF">').find('input').mask("999.999.999-99").focus();
            }
        }
    });
    configEditor.SetEditableClass("editCellCNPJ", {
        internals: {
            renderEditor: (elem, oldVal) => {
                $(elem).html('<input type="text" style="max-width: 80%;" value="' + oldVal + '" name="editCellCNPJ">').find('input').mask("99.999.999/9999-99").focus();
            }
        }
    });
    configEditor.SetEditableClass("editCellPhone", {
        internals: {
            renderEditor: (elem, oldVal) => {
                $(elem).html('<input type="text" style="max-width: 80%;" value="' + oldVal + '" name="editCellPhone">').find('input').mask("(99) 99999-9999").focus();
            }
        }
    });
    configEditor.SetEditableClass("editCellPEN", {
        internals: {
            renderEditor: (elem, oldVal) => {
                $(elem).html('<input type="text" style="max-width: 80%;" value="' + oldVal + '" name="editCellPEN">').find('input').mask("99999.999999/9999-99").focus();
            }
        }
    });
    configEditor.SetEditableClass("editCellDatetime", {
        internals: {
            renderEditor: (elem, oldVal) => {
                $(elem).html('<input type="datetime-local" style="max-width:none" value="' + moment(oldVal, 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss') + '" name="editCellDatetime">').find('input').focus();
            },
            renderValue: (elem, formattedNewVal) => {
                $(elem).text(formattedNewVal);
            },
            extractEditorValue: (elem) => {
                return moment($(elem).find('input').val(), 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY HH:mm:ss');
            },
        }
    });
    configEditor.SetEditableClass("editCellNum", {
        validation: $.isNumeric,
        internals: {
            renderEditor: (elem, oldVal) => {
                var min = typeof $(elem).data('min') !== 'undefined' ? ' min="' + $(elem).data('min') + '"' : '';
                var max = typeof $(elem).data('max') !== 'undefined' ? ' max="' + $(elem).data('max') + '"' : '';
                var input = min != '' && max != '' ? ' data-input-filter="clamp-minmax"' : '';
                $(elem).html('<input type="number" style="max-width:none" ' + min + ' ' + max + ' ' + input + ' value="' + oldVal + '" name="editCellNum">').find('input').focus();
            }
        }
    });
    configEditor.SetEditableClass("editCellNumInt", {
        validation: $.isNumeric,
        internals: {
            renderEditor: (elem, oldVal) => {
                $(elem).html('<input type="number" step="1" style="max-width:none" value="' + oldVal + '" name="editCellNumInt">').find('input').focus();
            }
        }
    });
    configEditor.SetEditableClass("editCellNew");
    configEditor.SetEditableClass("editCellDate", {
        internals: {
            renderEditor: (elem, oldVal) => {
                var data = $(elem).data();
                var dateLimit = $(elem).closest('tr').find('td[data-label-limit="' + data.refLimit + '"]').text();
                var arrayDateLimit = (data.limit == 'min')
                    ? 'min="' + moment(dateLimit, 'DD/MM/YYYY').format('YYYY-MM-DD') + '"'
                    : 'max="' + moment(dateLimit, 'DD/MM/YYYY').format('YYYY-MM-DD') + '"';
                $(elem).html('<input type="date" ' + arrayDateLimit + ' style="max-width:none" value="' + moment(oldVal, 'DD/MM/YYYY').format('YYYY-MM-DD') + '" name="editCellDate">').find('input').focus();
            },
            renderValue: (elem, formattedNewVal) => {
                formattedNewVal = formattedNewVal == '' ? '-' : formattedNewVal;
                $(elem).text(formattedNewVal);
            },
            extractEditorValue: (elem) => {
                var value = $(elem).find('input').val();
                return value != '' ? moment(value, 'YYYY-MM-DD').format('DD/MM/YYYY') : '';
                // return moment($(elem).find('input').val(),'YYYY-MM-DD').format('DD/MM/YYYY');
            },
        }
    });
    configEditor.SetEditableClass("editCellSelect", {
        internals: {
            renderEditor: (elem, oldVal) => {
                var data = $(elem).data();
                var newItem = (typeof data.newItem !== 'undefined' && data.newItem == false) ? '' : '<option value="new">\u2795 Novo Item</option>';
                var arraySelect = (data.array == 'self') ? tableConfigList[type] : arrayConfigAtividades[data.array];
                arraySelect = (data.array == 'tipos_requisicoes' || data.array == 'tipos_documentos') ? jmespath.search(arrayListTypesSEI.selSeriePesquisa, "[*].{label: name, value: name}") : arraySelect;
                arraySelect = (data.array == 'tipos_metadados') ? listLabelsTiposMetadados : arraySelect;
                arraySelect = type == data.array && (data.array == 'cadeia_valor' || data.array == 'objetivos') ? tableConfigList[type] : arraySelect;
                arraySelect = type != data.array && (data.array == 'cadeia_valor' || data.array == 'objetivos' || data.array == 'mapas' || data.array == 'acoes' || data.array == 'tipos_entregas') ? arrayConfigAtividades[data.array] : arraySelect;
                arraySelect = typeof arraySelect === 'undefined' && type != data.array && (data.array == 'cadeia_valor' || data.array == 'objetivos' || data.array == 'mapas' || data.array == 'acoes' || data.array == 'tipos_entregas') ? tableConfigList[data.array] : arraySelect;
                arraySelect = (data.array == 'tipos_avaliacoes') ? [{ label: 'Demanda', value: 1 }, { label: 'Plano de Trabalho', value: 2 }, { label: __.programa, value: 3 }] : arraySelect;
                arraySelect = (data.array == 'tipos_avaliacoes' && data.key == 'tipo_execucao') ? [{ label: 'Execu\u00E7\u00E3o integral', value: 1 }, { label: 'Execu\u00E7\u00E3o parcial', value: 2 }, { label: 'Inexecu\u00E7\u00E3o', value: 3 }] : arraySelect;

                var key_ref = (typeof data.keyref !== 'undefined') ? data.keyref : data.key;
                var selectArray = (data.array == 'tipos_requisicoes' || data.array == 'tipos_documentos' || data.array == 'tipos_metadados' || data.array == 'tipos_avaliacoes')
                    ? arraySelect
                    : (data.array == 'tipos_modalidades')
                        ? jmespath.search(arraySelect, (!callAtiv('checkPerfilNivelAdm',) ? "[?vigencia==`true`] | " : "") + "[*].{label: " + data.value + ", value: " + key_ref + "}")
                        : jmespath.search(arraySelect, "[*].{label: " + data.value + ", value: " + key_ref + "}");

                selectArray = selectArray.filter((v, i, a) => a.findIndex(t => (t.value === v.value)) === i);

                if (data.array == 'cadeia_valor') {
                    var htmlOptions = callAtiv('getOptionSelectDependencia',arraySelect, type != data.array, data.parent_id, $(elem).text().trim());
                } else {
                    var htmlOptions = $.map(selectArray, function (v) {
                        var disabled = typeof data.parent_id !== 'undefined' && data.parent_id == v.value ? 'disabled' : '';
                        var selected = (v.label == $(elem).text().trim()) ? 'selected' : '';
                        return '<option value="' + v.value + '" ' + selected + ' ' + disabled + '>' + v.label + '</option>';
                    }).join('');
                }
                var htmlBlankOption = (typeof data.blankItem !== 'undefined' && data.blankItem == true) ? '<option value="' + (typeof data.blankValue !== 'undefined' ? data.blankValue : 0) + '">&nbsp;</option>' : '';
                $(elem)
                    .html(`<select data-old="` + oldVal + `" data-type="` + type + `" data-act="atividades-call" data-fn="configTableNewItem">` + htmlBlankOption + newItem + htmlOptions + '</select>')
                    .find('select')
                    .focus()
                    .chosen({
                        placeholder_text_single: ' ',
                        no_results_text: 'Nenhum resultado encontrado',
                        normalize_search_text: function (text) {
                            return removeAcentos(text.toLowerCase());
                        }
                    })
                    .on('chosen:showing_dropdown', function (evt, params) {
                        let elementScroll = $(this).closest('.tabelaPanelScroll');
                        setTimeout(() => {
                            scrollToElement(elementScroll, elementScroll.find('div.chosen-container'), elementScroll.find('.tableHeader').height());
                        }, 500);
                    });
                if (checkBrowser() == 'Firefox') $(elem).find('.chosen-container').addClass('chosen-repair-firefox');
            },
            renderValue: (elem, formattedNewVal) => {
                if (formattedNewVal != 'new') {
                    $(elem).text(formattedNewVal);
                }
            },
            extractEditorValue: (elem) => {
                $(elem).data('newvalue', $(elem).find('select').val());
                return $(elem).find('select').find('option:selected').text().trim();
            }
        }
    });
    tableConfigEditor[type] = configEditor;

    configTabela.on("cell:edited", function (event) {
        var _this = $(event.element);
        var td = _this.closest('td');
        var tr = _this.closest('tr');
        var data = td.data();
        var data_tr = tr.data();
        var value = event.newValue;
        if (_this.hasClass('editCellSelect')) {
            if (typeof event.newValue === 'undefined' || event.newValue == 'new') {
                _this.text(event.oldValue);
            }
            if (typeof event.newValue !== 'undefined' && typeof data.newvalue !== 'undefined') {
                value = data.newvalue;
            }
        } else if (_this.hasClass('editCellCPF') && typeof event.newValue !== 'undefined') {
            if (!validaCPF(event.newValue)) {
                // _this.text(event.oldValue);
                td.addClass('editCellLoadingError');
                return false;
            }
        } else if (_this.hasClass('editCellDate') && typeof event.newValue !== 'undefined') {
            var value_nottime = moment(event.newValue, 'DD/MM/YYYY').format('YYYY-MM-DD');
            if (value_nottime == 'Invalid date' && data_tr.type == 'entregas' && data.key == 'data_fim_vigencia') {
                value = '0000-00-00 00:00:00';
            } else if (value_nottime == 'Invalid date') {
                _this.text(event.oldValue);
                td.addClass('editCellLoadingError');
                return false;
            } else {
                td.attr('data-time-sorter', value_nottime);
                value = (data.key == 'data_fim_vigencia')
                    ? moment(value, 'DD/MM/YYYY').endOf('day').format('YYYY-MM-DD HH:mm:ss')
                    : moment(value, 'DD/MM/YYYY').format('YYYY-MM-DD HH:mm:ss');
                // console.log('dateEnd',value);
                if (data_tr.type == 'planos' || data_tr.type == 'programas') {
                    var data_inicio = (data.key == 'data_inicio_vigencia') ? value_nottime : tr.find('td[data-key="data_inicio_vigencia"]').data('time-sorter');
                    var data_fim = (data.key == 'data_fim_vigencia') ? value_nottime : tr.find('td[data-key="data_fim_vigencia"]').data('time-sorter');
                    var listDados = jmespath.search(tableConfigList[data_tr.type], "[?vigencia==`true`]");
                    var check = callAtiv('checkDatesLoopArray',listDados, data_inicio, data_fim, data_tr.idref, data_tr.id, { inicio: 'data_inicio_vigencia', fim: 'data_fim_vigencia', idreftype: data_tr.idreftype, id: data_tr.rowindex });
                    if (check && check.length > 0) {
                        // if (1==2) {
                        td.addClass('editCellLoadingError');
                        var v = jmespath.search(listDados, "[?" + data_tr.rowindex + "==`" + check[0] + "`] | [0]");
                        // console.log(v);
                        var text_conflict = (data_tr.type == 'programas')
                            ? '<br><br>' + v.sigla_unidade + ' <b style="font-weight: bold;">' + moment(v.data_inicio_vigencia, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY') + ' \u00E0 ' + moment(v.data_fim_vigencia, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY') + '</b>'
                            : '<br><br>' + v.nome_completo + ' (' + v.nome_modalidade + ') <b style="font-weight: bold;">' + moment(v.data_inicio_vigencia, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY') + ' \u00E0 ' + moment(v.data_fim_vigencia, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY') + '</b>';

                        var text_box_conflict = (data_tr.type == 'programas')
                            ? 'Um ou mais dias ' + getNameGenre('programa', 'deste', 'desta') + ' ' + __.programa + ' j\u00E1 est\u00E3o inclu\u00EDdos em outr' + __.o_programa + ' da unidade! '
                            : 'Um ou mais dias deste plano de trabalho j\u00E1 est\u00E3o inclu\u00EDdos em outro plano de trabalho do usu\u00E1rio!';
                        setTimeout(function () {
                            alertaBoxPro('Error', 'exclamation-triangle', text_box_conflict + text_conflict);
                        }, 100);
                        return false;
                    }
                }
            }
        }
        if (typeof event.newValue !== 'undefined' && _this.hasClass('editCellNew')) {
            _this.removeClass('editCellNew').addClass('editCellSelect');
        }
        if (typeof event.newValue !== 'undefined' && typeof data.text !== 'undefined' && event.newValue.trim().indexOf('(C\u00F3pia)') === -1) {
            tr.removeClass('clone');
        }
        if (typeof event.newValue !== 'undefined' && typeof data.text !== 'undefined' && event.newValue.trim().indexOf('(Novo)') === -1) {
            tr.removeClass('new');
        }
        if (typeof event.newValue !== 'undefined' && data.key == 'data_fim_vigencia' && moment(value, 'YYYY-MM-DD HH:mm:ss') < moment()) {
            tr.addClass('closed');
        } else {
            tr.removeClass('closed');
        }
        if (typeof event.newValue !== 'undefined' && data.key == 'data_inicio_vigencia' && moment(value, 'YYYY-MM-DD HH:mm:ss') > moment()) {
            tr.addClass('future');
        } else {
            tr.removeClass('future');
        }
        if (typeof event.newValue !== 'undefined') {

            td.addClass('editCellLoading');
            if (td.hasClass('alertAssinatura')) {
                confirmaFraseBoxPro('Editar essas informa\u00E7\u00F5es ir\u00E1 <b style="font-weight: bold;">CANCELAR A ASSINATURA</b> vinculada. Deseja prosseguir?', 'CANCELAR', function () {
                    updateConfigServerInline(_this, type, value, data, data_tr);
                }, function () {
                    td.removeClass('editCellLoading').text(event.oldValue);
                });
            } else if (td.hasClass('alertHomologacao')) {
                confirmaFraseBoxPro('Editar essas informa\u00E7\u00F5es ir\u00E1 <b style="font-weight: bold;">CANCELAR A HOMOLOGA\u00C7\u00C3O</b> vinculada. Deseja prosseguir?', 'CANCELAR', function () {
                    updateConfigServerInline(_this, type, value, data, data_tr);
                }, function () {
                    td.removeClass('editCellLoading').text(event.oldValue);
                });
            } else {
                updateConfigServerInline(_this, type, value, data, data_tr);
            }
        }
    });
}
export function calcLimitePlanosModalidade(value) {
    var id_unidade = value.id_unidade;
    var id_programa = value.id_programa;
    var arraylistPlanos = typeof tableConfigList.planos !== 'undefined' && tableConfigList.planos !== null && tableConfigList.planos.length > 0 ? tableConfigList.planos : arrayConfigAtividades.planos;
    var listPlanos = jmespath.search(arraylistPlanos, "[?id_unidade==`" + id_unidade + "`] | [?id_programa==`" + id_programa + "`] | [?em_execucao==`true`]");
    listPlanos = (listPlanos === null || listPlanos.length == 0) ? jmespath.search(arraylistPlanos, "[?id_unidade==`" + id_unidade + "`] | [?id_programa==`" + id_programa + "`] | [?execucao_futura==`true`]") : listPlanos;
    var modalidadeAtual = jmespath.search(arrayConfigAtividades.tipos_modalidades, "[?id_tipo_modalidade==`" + value.id_tipo_modalidade + "`] | [0]");
    modalidadeAtual = typeof modalidadeAtual !== 'undefined' && modalidadeAtual !== null ? modalidadeAtual.config : false;
    var limiteModalidadeAtual = modalidadeAtual && !modalidadeAtual.exclui_calculo_vagas && isNumeric(modalidadeAtual.limite_planos) && modalidadeAtual.limite_planos < 100 && modalidadeAtual.limite_planos > 0 ? modalidadeAtual.limite_planos : 100;
    var minimoModalidadeAtual = modalidadeAtual && !modalidadeAtual.exclui_calculo_vagas && isNumeric(modalidadeAtual.minimo_participantes) && modalidadeAtual.minimo_participantes >= 0 ? modalidadeAtual.minimo_participantes : 0;
    var listTiposModalidades = jmespath.search(arrayConfigAtividades.tipos_modalidades, "[?config.exclui_calculo_vagas==`false`] | [*].id_tipo_modalidade");
    var listaPlanosTotais = $.map(listPlanos, function (v) {
        if ($.inArray(v.id_tipo_modalidade, listTiposModalidades) !== -1 && (v.em_execucao || v.execucao_futura)) {
            return v;
        }
    });
    var countVagasTotais = typeof listaPlanosTotais !== 'undefined' && listaPlanosTotais !== null ? listaPlanosTotais.length : 0;
    var limiteVagasModalidadeAtual = Math.ceil((limiteModalidadeAtual / 100) * countVagasTotais);
    var countVagasModalidadeAtual = jmespath.search(listPlanos, "[?id_tipo_modalidade==`" + value.id_tipo_modalidade + "`]");
    countVagasModalidadeAtual = typeof countVagasModalidadeAtual !== 'undefined' && countVagasModalidadeAtual !== null ? countVagasModalidadeAtual.length : 0;
    var checkLimitePlano = limiteModalidadeAtual < 100 && (countVagasTotais < minimoModalidadeAtual || countVagasModalidadeAtual > limiteVagasModalidadeAtual) ? true : false;
    var _return = {
        excede_limite: checkLimitePlano,
        planos_vigentes: countVagasModalidadeAtual,
        limite_vagas: limiteVagasModalidadeAtual,
        vagas_programa: countVagasTotais,
        limite_modalidade: limiteModalidadeAtual,
        minimo_participantes: minimoModalidadeAtual,
        modalidade: modalidadeAtual
    }
    // console.log(_return);
    return _return;
}
export function updateConfigServerInline(_this, type, value, data, data_tr, objIndex) {
    if (delayServerAtiv == 1) return;
    var disabled = (getOptionsPro('changeDisabledTableConfig_' + type) && getOptionsPro('changeDisabledTableConfig_' + type) == 'show') ? 'show' : 'hide';
    var lista_inferior = (getOptionsPro('changeListaInfTableConfig_' + type) && getOptionsPro('changeListaInfTableConfig_' + type) == 'show') ? 'show' : 'hide';
    var update = callAtiv('updateConfigServer',{ mode: 'update', id: data_tr.id, type: data_tr.type, key: data.key, value: value, disabled: disabled, lista_inferior: lista_inferior, rowindex: data_tr.rowindex });
    if (type == 'planos' && (data.key == 'data_inicio_vigencia' || data.key == 'data_fim_vigencia' || data.key == 'carga_horaria')) {
        updateConfigTempoPactuado(_this, data_tr.id, update.objIndex, data_tr);
        // console.log('updateConfigTempoPactuado',_this, data_tr.id, update.objIndex, data_tr);
    }
    delayServerAtiv = 1; setTimeout(function () { delayServerAtiv = 0; }, 1000);
}
export function changeListaInfTableConfig(this_) {
    var _this = $(this_);
    var type = _this.data('type');
    var checkbox = _this.is(':checked');
    var table = $('#tableConfiguracoesPanel_' + type);
    var icon = _this.closest('.editTableToggle').find('.label i');
    icon.toggleClass('fa-eye-slash fa-sync-alt').addClass('fa-spin');
    if (checkbox) {
        icon.addClass('azulColor').removeClass('cinzaColor');
        setOptionsPro('changeListaInfTableConfig_' + type, 'show');
    } else {
        icon.addClass('cinzaColor').removeClass('azulColor');
        setOptionsPro('changeListaInfTableConfig_' + type, 'hide');
    }
    callAtiv('getTabConfig',type, 'get');
}
export function changeAllItensTableConfig(this_) {
    var _this = $(this_);
    var type = _this.data('type');
    var checkbox = _this.is(':checked');
    var table = $('#tableConfiguracoesPanel_' + type);
    var icon = _this.closest('.editTableToggle').find('.label i');
    icon.toggleClass('fa-eye-slash fa-sync-alt').addClass('fa-spin');
    if (checkbox) {
        icon.addClass('azulColor').removeClass('cinzaColor');
        setOptionsPro('changeAllItensTableConfig_' + type, 'show');
        table.trigger('filterReset');
    } else {
        icon.addClass('cinzaColor').removeClass('azulColor');
        setOptionsPro('changeAllItensTableConfig_' + type, 'hide');
    }
    callAtiv('getTabConfig',type, 'get');
}
export function changeArchivedTableConfig(this_) {
    var _this = $(this_);
    var type = _this.data('type');
    var checkbox = _this.is(':checked');
    var table = $('#tableConfiguracoesPanel_' + type);
    var icon = _this.closest('.editTableToggle').find('.label i');
    icon.toggleClass('fa-inbox fa-sync-alt').addClass('fa-spin');
    if (checkbox) {
        icon.addClass('azulColor').removeClass('cinzaColor');
        setOptionsPro('changeArchivedTableConfig_' + type, 'show');
    } else {
        icon.addClass('cinzaColor').removeClass('azulColor');
        setOptionsPro('changeArchivedTableConfig_' + type, 'hide');
    }
    callAtiv('getTabConfig',type, 'get');
}
export function changeDisabledTableConfig(this_) {
    var _this = $(this_);
    var type = _this.data('type');
    var checkbox = _this.is(':checked');
    var table = $('#tableConfiguracoesPanel_' + type);
    var icon = _this.closest('.editTableToggle').find('.label i');
    icon.toggleClass('fa-eye-slash fa-sync-alt').addClass('fa-spin');
    if (checkbox) {
        icon.addClass('azulColor').removeClass('cinzaColor');
        setOptionsPro('changeDisabledTableConfig_' + type, 'show');
    } else {
        icon.addClass('cinzaColor').removeClass('azulColor');
        setOptionsPro('changeDisabledTableConfig_' + type, 'hide');
    }
    callAtiv('getTabConfig',type, 'get');
}
export function changeDisabledTableReport(this_) {
    var _this = $(this_);
    var type = _this.data('type');
    var checkbox = _this.is(':checked');
    var icon = _this.closest('.editTableToggle').find('.label i');
    icon.toggleClass('fa-eye-slash fa-sync-alt').addClass('fa-spin');
    if (checkbox) {
        icon.addClass('azulColor').removeClass('cinzaColor');
        setOptionsPro('changeDisabledTableReport_' + type, 'show');
    } else {
        icon.addClass('cinzaColor').removeClass('azulColor');
        setOptionsPro('changeDisabledTableReport_' + type, 'hide');
    }
    callAtiv('getTabReport',type, 'get');
}
export function changeViewTableConfig(this_) {
    var _this = $(this_);
    var type = _this.data('type');
    var checkbox = _this.is(':checked');
    var table = $('#tableConfiguracoesPanel_' + type);
    var icon = _this.closest('.editTableToggle').find('.label i');
    tableConfigEditor[type].Toggle(checkbox);
    if (checkbox) {
        table.removeClass('editDisabled').find('.checkboxSelectConfiguracoes').prop('disabled', false);
        icon.addClass('azulColor').removeClass('cinzaColor');
    } else {
        table.find('.checkboxSelectConfiguracoes:checked').trigger('click');
        table.addClass('editDisabled').find('.checkboxSelectConfiguracoes').prop('disabled', true);
        icon.addClass('cinzaColor').removeClass('azulColor');
    }
}
export function changeViewTableReport(this_) {
    var _this = $(this_);
    var type = _this.data('type');
    var checkbox = _this.is(':checked');
    var table = $('#tableRelatorio_' + type);
    var icon = _this.closest('.viewTableToggle').find('.label i');
    icon.toggleClass('fa-university fa-sync-alt').addClass('fa-spin');
    if (checkbox) {
        icon.addClass('azulColor').removeClass('cinzaColor');
        setOptionsPro('changeViewTableReport_' + type, 'show');
    } else {
        icon.addClass('cinzaColor').removeClass('azulColor');
        setOptionsPro('changeViewTableReport_' + type, 'hide');
    }
    callAtiv('getTabReport',type, 'get');
}
export function getWorkDaysBetweenDates(inicio, fim, sigla_unidade) {
    var config_unidade = callAtiv('getConfigDadosUnidade',sigla_unidade);
    var config_feriados = (typeof config_unidade.feriados !== 'undefined' && config_unidade.feriados !== null) ? config_unidade.feriados : false;
    var arrayFeriados = (config_unidade.count_dias_uteis && inicio != '' && fim != '')
        ? getHolidayBetweenDates(moment(inicio, 'YYYY-MM-DD HH:mm:ss').format('Y') + '-01-01', moment(fim, 'YYYY-MM-DD HH:mm:ss').add(1, 'Y').format('Y') + '-01-01', config_feriados)
        : [];
    var listFeriados = (typeof arrayFeriados !== 'undefined' && arrayFeriados !== null) ? jmespath.search(arrayFeriados, "[*].d_") : [];
    var dias = (config_unidade.count_dias_uteis)
        ? moment().isoWeekdayCalc({
            rangeStart: inicio,
            rangeEnd: fim,
            weekdays: [1, 2, 3, 4, 5],
            exclusions: listFeriados
        })
        : moment(fim, 'YYYY-MM-DD HH:mm:ss').diff(moment(inicio, 'YYYY-MM-DD HH:mm:ss'), 'days');
    dias = (dias < 0) ? false : dias;

    var dias_feriados = callAtiv('calcRelatorioMetaProporcional','feriados', { dias: dias, feriados: arrayFeriados, lista_feriados: listFeriados });

    dias = dias_feriados > dias ? dias_feriados : dias;

    // console.log('feriados', {dias: dias, dias_feriados: dias_feriados, feriados: arrayFeriados, lista_feriados: listFeriados});
    return { dias: dias, feriados: arrayFeriados };
}
export function updateConfigTempoPactuadoById(id_plano, force = false, hide = false, callback = false) {
    var objIndex = (typeof tableConfigList.planos === 'undefined' || tableConfigList.planos == 0 || tableConfigList.planos.length == 0) ? -1 : tableConfigList.planos.findIndex((obj => obj['id_plano'] == id_plano));
    if (objIndex !== -1) {
        var tableConfigElem = $('#tableConfiguracoesPanel_planos');
        var tableConfigScroll = $('#tabelaConfigPanel_planos');
        var _parent = tableConfigElem.find('tr[data-id="' + id_plano + '"]');
        var _this = _parent.find('td[data-key="data_fim_vigencia"]');
        var data_tr = _parent.data();

        if (!force && !hide) {
            _parent.find('td[data-key="tempo_total"]').addClass('editCellLoading')
            _parent.get(0).scrollIntoView();
            tableConfigScroll.scrollTop(tableConfigScroll.scrollTop() - 35);
        }
        updateConfigTempoPactuado(_this, data_tr.id, objIndex, data_tr, force);
        if (typeof callback === 'function') callback();
        return true;
    } else {
        return false;
    }
}
export function updateConfigTempoPactuado(_this, id, objIndex, data_tr, force = false) {
    var value = jmespath.search(tableConfigList.planos, "[?id_plano==`" + id + "`] | [0]");
    if (value !== null) {
        var dates = getWorkDaysBetweenDates(value.data_inicio_vigencia, value.data_fim_vigencia, value.sigla_unidade);
        if (dates.dias) {
            var tempo_total = parseFloat(dates.dias) * parseFloat(value.carga_horaria);
            var tr = _this.closest('tr');
            tr.find('td[data-key="tempo_total"]').text(tempo_total);
            tableConfigList.planos[objIndex].tempo_total = tempo_total;


            var array_tempo_proporcional = callAtiv('checkDatesPlanoAfast',value);
            var check_afastamento_list = jmespath.search(arrayConfigAtividades.afastamentos.lista, "[?id_user==`" + array_tempo_proporcional.id_user + "`]");
            check_afastamento_list = typeof check_afastamento_list !== 'undefined' && check_afastamento_list !== null && check_afastamento_list.length > 0 && check_afastamento_list != 0 ? true : false;
            if (typeof array_tempo_proporcional !== 'undefined' &&
                (
                    (array_tempo_proporcional.tempo_proporcional != value.tempo_proporcional && check_afastamento_list) ||
                    (value.tempo_total < value.tempo_proporcional) ||
                    callAtiv('checkPerfilNivelAdm',)
                )
            ) {
                var tempo_proporcional = array_tempo_proporcional.tempo_proporcional;
                tempo_proporcional = parseInt(tempo_proporcional.toFixed(2));
                tempo_proporcional = tempo_proporcional < 0 ? 0 : tempo_proporcional;

                if (!force) tr.find('td[data-key="tempo_proporcional"]').text(tempo_proporcional).addClass('editCellLoading');
                tableConfigList.planos[objIndex].tempo_proporcional = tempo_proporcional;
                if (!force) callAtiv('updateConfigServer',{ mode: 'update', id: id, type: 'planos', key: 'tempo_proporcional', value: tempo_proporcional, rowindex: data_tr.rowindex });
            }

            tempo_total = parseInt(tempo_total.toFixed(2));

            if (!force) callAtiv('updateConfigServer',{ mode: 'update', id: id, type: 'planos', key: 'tempo_total', value: tempo_total, rowindex: data_tr.rowindex });
        }
    }
}
export function reactiveConfig(this_) {
    var _this = $(this_);
    var data_this = _this.data();
    var id = data_this.id;
    var ids = $('#tabelaConfigPanel_' + data_this.type).find('.checkboxSelectConfiguracoes:checked').map(function () { if ($(this).closest('tr').hasClass('disabled')) { return $(this).val() } }).get();
    if (id != 0 || ids.length > 0) {
        var action_all = 'config_update_' + data_this.type;
        var action_self = 'config_update_self_' + data_this.type;
        var check_action = callAtiv('checkCapacidade',action_all) ? action_all : false;
        check_action = callAtiv('checkCapacidade',action_self) ? action_self : check_action;
        if (check_action) {
            var param = {
                action: check_action,
                id: id,
                ids: ids,
                type: data_this.type,
                key: 'data_fim',
                mode: 'reactive'
            };
            getServerAtividades(param, check_action);
        }
    }
}
export function cloneConfig(this_, e) {
    var _this = $(this_);
    var data_this = _this.data();
    var id = data_this.id;
    var action_all = 'config_update_' + data_this.type;
    var action_self = 'config_update_self_' + data_this.type;
    var check_action = callAtiv('checkCapacidade',action_all) ? action_all : false;
    check_action = callAtiv('checkCapacidade',action_self) ? action_self : check_action;

    var table = $('#tabelaConfigPanel_' + data_this.type);
    var ids = table.find('.checkboxSelectConfiguracoes:checked').map(function () { if (!$(this).closest('tr').hasClass('disabled')) { return $(this).val() } }).get();
    var param = {
        action: check_action,
        id: id,
        ids: ids,
        type: data_this.type,
        key: 'all',
        mode: 'clone'
    };
    var countSelected = table.find('tr.infraTrMarcada').length;
    if (id != 0) {
        _this.find('i').attr('class', 'fas fa-spinner fa-spin');
        getConfigServer(check_action, param);
    } else if (ids.length > 0) {
        confirmaFraseBoxPro('Tem certeza que deseja <b style="font-weight: bold;">DUPLICAR</b> ' + (countSelected > 1 ? 'os registros' : 'o registro') + (id == 0 ? (countSelected > 1 ? ' selecionados' : ' selecionado') : '') + '?', 'SIM',
            function () {
                getConfigServer(check_action, param);
            });
    }
    setOptionsPro('rememberScroll_config_' + data_this.type, table.scrollTop());
}
export function newConfig_(this_) {
    var _this = $(this_);
    var type = _this.data('type');
    if (type == 'users' || (type == 'planos' && !callAtiv('checkCapacidade','config_self_planos'))) {
        newConfig(this_);
    } else {
        var tipAttr = _this.attr('data-tip');
        var textBox = (typeof tipAttr !== 'undefined' && tipAttr !== false && tipAttr !== '')
            ? tipAttr
            : ((typeof _this.attr('onmouseover') !== 'undefined') ? extractTooltip(_this.attr('onmouseover')) : 'adicionar novo item');
        confirmaBoxPro('Tem certeza que deseja ' + textBox.toLowerCase() + '?', function () {
            if (!$('#tableConfiguracoesPanel_' + type + ' .tablesorter-filter-row').hasClass('hideme')) $('.filterTablePro [data-value="Pesquisar"').trigger('click');
            newConfig(this_);
        });
    }
}
export function newConfig(this_) {
    var _this = $(this_);
    var data_this = _this.data();
    var type = data_this.type;

    var config_unidade = (typeof arrayConfigAtivUnidade !== 'undefined' && arrayConfigAtivUnidade !== null && typeof arrayConfigAtivUnidade.config !== 'undefined' && arrayConfigAtivUnidade.config !== null) ? arrayConfigAtivUnidade.config : false;
    var duracao_padrao = (config_unidade && typeof config_unidade.planos !== 'undefined' && config_unidade.planos !== null && typeof config_unidade.planos.duracao_padrao !== 'undefined' && config_unidade.planos.duracao_padrao !== null) ? config_unidade.planos.duracao_padrao : 1;
    duracao_padrao = parseInt(duracao_padrao) - 1;

    var config_entidade = jmespath.search(arrayConfigAtividades.entidades, "[?id_entidade==`" + arrayConfigAtividades.perfil.id_entidade + "`] |[0].config");
    config_entidade = (config_entidade !== null) ? config_entidade : false;
    var carga_horaria_padrao = (config_entidade && typeof config_entidade.carga_horaria_padrao !== 'undefined' && config_entidade.carga_horaria_padrao !== null) ? config_entidade.carga_horaria_padrao : 8;
    var limitar_ano_civil = (config_entidade && typeof config_entidade.limitar_ano_civil !== 'undefined' && config_entidade.limitar_ano_civil !== null) ? config_entidade.limitar_ano_civil : false;
    // var tipo_modalidade_padrao = jmespath.search(arrayConfigAtividades.entidades,"[?id_entidade==`"+arrayConfigAtividades.perfil.id_entidade+"`] |[0].config.tipo_modalidade_padrao");
    // tipo_modalidade_padrao = (tipo_modalidade_padrao == null) ? 4 : tipo_modalidade_padrao;
    var tipo_modalidade_padrao = (config_entidade && typeof config_entidade.tipo_modalidade_padrao !== 'undefined' && config_entidade.tipo_modalidade_padrao !== null) ? config_entidade.tipo_modalidade_padrao : 4;

    var action = (callAtiv('checkCapacidade','config_new_' + type)) ? 'config_new_' + type : 'config_update_' + type;
    var dates_inicio = (type == 'planos' || type == 'programas' || type == 'termos' || type == 'mapas' || type == 'acoes' || type == 'entregas') ? moment().startOf('month').format('YYYY-MM-DD HH:mm:ss') : false;
    var dates_fim = (type == 'planos' || type == 'programas' || type == 'mapas' || type == 'acoes' || type == 'entregas')
        ? (duracao_padrao > 0)
            ? moment().add(duracao_padrao, 'months').endOf('month').format('YYYY-MM-DD HH:mm:ss')
            : moment().endOf('month').format('YYYY-MM-DD HH:mm:ss')
        : false;
    dates_fim = ((type == 'planos' || type == 'programas' || type == 'mapas') && limitar_ano_civil && moment(dates_fim, 'YYYY-MM-DD HH:mm:ss') > moment(dates_inicio, 'YYYY-MM-DD HH:mm:ss').endOf('year'))
        ? moment(dates_inicio, 'YYYY-MM-DD HH:mm:ss').endOf('year').format('YYYY-MM-DD HH:mm:ss')
        : dates_fim;
    var datesKey = (type == 'planos' || type == 'programas') ? getWorkDaysBetweenDates(dates_inicio, dates_fim, arrayConfigAtivUnidade.sigla_unidade) : false;
    var key = (type == 'atividades')
        ? {
            id_unidade: arrayConfigAtivUnidade.id_unidade,
            id_cadeia_valor: 0,
            nome_atividade: '(Novo)',
            tempo_pactuado: 1,
            dias_planejado: 1,
            macroatividade: 'NULL',
            config:
            {
                etiqueta: [],
                complexidade: [
                    {
                        complexidade: "Baixo",
                        fator: 0.5,
                        default: true
                    }, {
                        complexidade: "M\u00E9dio",
                        fator: 1,
                        default: false
                    }, {
                        complexidade: "Alto",
                        fator: 1.5,
                        default: false
                    }],
                tipo_processo: []
            }
        } : [];

    key = (type == 'planos')
        ? {
            id_user: parseInt(arrayConfigAtividades.perfil.id_user),
            id_unidade: parseInt(arrayConfigAtivUnidade.id_unidade),
            id_tipo_modalidade: tipo_modalidade_padrao,
            carga_horaria: carga_horaria_padrao,
            tempo_total: datesKey.dias * carga_horaria_padrao,
            tempo_proporcional: datesKey.dias * carga_horaria_padrao,
            data_inicio_vigencia: dates_inicio,
            data_fim_vigencia: dates_fim,
            config: {
                atividades_lista_integral: true
            }
        } : key;

    key = (type == 'termos')
        ? {
            id_user: parseInt(arrayConfigAtividades.perfil.id_user),
            id_tipo_modalidade: tipo_modalidade_padrao,
            id_unidade: parseInt(arrayConfigAtividades.perfil.id_unidade),
            data_inicio_vigencia: dates_inicio,
            data_fim_vigencia: dates_fim,
            config: []
        } : key;

    key = (type == 'programas')
        ? {
            id_unidade: arrayConfigAtivUnidade.id_unidade,
            data_inicio_vigencia: dates_inicio,
            data_fim_vigencia: dates_fim,
            config: []
        } : key;

    key = (type == 'unidades')
        ? {
            sigla_unidade: 'SIGLA',
            nome_unidade: '(Novo)',
            entidade: arrayConfigAtividades.entidades[0].id_entidade.toString(),
            dependencia: arrayConfigAtivUnidade.id_unidade,
            config: {
                atividades: {
                    lista_superior: true
                },
                planos: {
                    prazo_comparecimento: 1,
                    data_comparecimento: "Dia"
                },
                distribuicao: {
                    horario_util: {
                        inicio: "00:00",
                        fim: "23:59"
                    },
                    count_dias_uteis: true,
                    count_horas: true,
                    notificacao: {
                        texto_criacao: "Prezado(a) {usuario}, \n\nInformo a edi\u00E7\u00E3o da {requisicao}, relativa \u00E0 " + __.atividade + " {atividade}: \n\nProcesso: {processo} \n\nAssunto: {assunto} \n\nPrazo: {prazo} dias \u00FAteis \n\nAtenciosamente,",
                        texto_conclusao: "Prezado(a), \n\nInformo a cria\u00E7\u00E3o do documento {documento_produto} para a aprecia\u00E7\u00E3o " + __.Gerencial + ", relativa \u00E0 " + __.atividade + " {atividade}: \n\nProcesso: {processo} \n\nAssunto: {assunto} \n\nData de Entrega: at\u00E9 {data_entrega} \n\nObserva\u00E7\u00F5es: {observacoes} \n\nAtenciosamente,".replace(/'/g, "\\'"),
                        email: "sigla@" + window.location.hostname.replace(window.location.hostname.split('.')[0] + '.', '')
                    }
                }
            },
        } : key;

    key = (type == 'tipos_eixos')
        ? {
            nome_eixo: '(Novo)'
        } : key;

    key = (type == 'tipos_entregas')
        ? {
            nome_tipo_entrega: '(Novo)'
        } : key;

    key = (type == 'tipos_documentos')
        ? {
            nome_documento: '(Novo)'
        } : key;

    key = (type == 'tipos_metadados')
        ? {
            ref_metadado: 'novo',
            nome_metadado: '(Novo)'
        } : key;

    key = (type == 'tipos_justificativas')
        ? {
            nome_justificativa: '(Novo)'
        } : key;


    key = (type == 'tipos_avaliacoes')
        ? {
            nome_avaliacao: '(Novo)'
        } : key;

    key = (type == 'tipos_modalidades')
        ? {
            nome_modalidade: '(Novo)'
        } : key;

    key = (type == 'tipos_motivos')
        ? {
            nome_motivo: '(Novo)'
        } : key;

    key = (type == 'tipos_capacidades')
        ? {
            nome_capacidade: '(Novo)'
        } : key;

    key = (type == 'perfis')
        ? {
            nome_perfil: '(Novo)'
        } : key;

    key = (type == 'tipos_requisicoes')
        ? {
            nome_requisicao: '(Novo)'
        } : key;

    key = (type == 'mapas')
        ? {
            nome_mapa: '(Novo)',
            data_inicio_vigencia: dates_inicio,
            data_fim_vigencia: dates_fim,
            config: []
        } : key;

    key = (type == 'acoes')
        ? {
            nome_acao: '(Novo)',
            data_inicio_vigencia: dates_inicio,
            data_fim_vigencia: dates_fim,
            config: []
        } : key;

    key = (type == 'entregas')
        ? {
            nome_entrega: '(Novo)',
            data_inicio_vigencia: dates_inicio,
            data_fim_vigencia: dates_fim,
            config: []
        } : key;

    key = (type == 'objetivos')
        ? {
            nome_objetivo: '(Novo)',
            config: []
        } : key;

    key = (type == 'cadeia_valor')
        ? {
            nome_processo: '(Novo)',
            dependencia: 0,
            config: [],
            selecionavel: 0
        } : key;

    key = (type == 'tipos_prescricoes')
        ? {
            nome_prescricao: '(Novo)',
            config: [],
            prazo: 60
        } : key;

    key = (type == 'nomenclaturas')
        ? {
            ref_nomenclatura: 'novo',
            nome_nomenclatura: '(Novo)',
            config: []
        } : key;

    key = (type == 'entidades')
        ? {
            nome_entidade: '(Novo)',
            sigla_entidade: 'SIGLA',
            config: []
        } : key;


    if (type != 'users' && (type != 'planos' || callAtiv('checkCapacidade','config_self_planos'))) {
        var filter = callAtiv('getFilterTable',type);
        var param = {
            action: action,
            id: -1,
            ids: [],
            type: data_this.type,
            filter: JSON.stringify(filter),
            key: (type == 'unidades' ? key : JSON.stringify(key)),
            mode: 'new'
        };
        _this.find('i.icon-parent').attr('class', 'fas fa-spinner fa-spin icon-parent');
        getConfigServer(action, param);
    } else if (type == 'planos' && !callAtiv('checkCapacidade','config_self_planos')) {
        newConfigPlano(this_);
    } else if (type == 'users') {
        newConfigUser(this_);
    }
}
export function changeConfigCargaHPadrao(this_) {
    var _this = $(this_);
    var carga_horaria_padrao = _this.find('option:selected').data('carga_horaria_padrao');
    _this.closest('table').find('#carga_horaria').val(carga_horaria_padrao);
}
export function newConfigPlano(this_) {
    var _this = $(this_);
    var carga_horaria_entidade = jmespath.search(arrayConfigAtividades.entidades, "[?id_entidade==`" + arrayConfigAtividades.perfil.id_entidade + "`] |[0].config.carga_horaria_padrao");
    carga_horaria_entidade = (carga_horaria_entidade == null) ? 8 : carga_horaria_entidade;
    var selectModalidadesOptions = $.map(arrayConfigAtividades.tipos_modalidades, function (v) {
        var exclui_unidades = (v.hasOwnProperty('config') && typeof v.config !== 'undefined' && v.config !== null && v.config.hasOwnProperty('exclui_unidades')) ? v.config.exclui_unidades : false;
        var checkExcluiUnidades = (exclui_unidades) ? jmespath.search(exclui_unidades, "[?id_unidade==`" + arrayConfigAtividades.perfil.id_unidade + "`]") : false;
        checkExcluiUnidades = (exclui_unidades && checkExcluiUnidades !== null && checkExcluiUnidades.length > 0) ? true : false;
        if (!checkExcluiUnidades && (v.data_fim == '0000-00-00 00:00:00' || callAtiv('checkPerfilNivelAdm',))) {
            var carga_horaria_padrao = (v.config && typeof v.config.carga_horaria_padrao !== 'undefined' && v.config.carga_horaria_padrao !== null) ? v.config.carga_horaria_padrao : 8;
            return '<option value="' + v.id_tipo_modalidade + '" data-carga_horaria_padrao="' + carga_horaria_padrao + '">' + v.nome_modalidade + '</option>';
        }
    }).join('');

    var config_unidade = (typeof arrayConfigAtivUnidade !== 'undefined' && arrayConfigAtivUnidade !== null && typeof arrayConfigAtivUnidade.config !== 'undefined' && arrayConfigAtivUnidade.config !== null) ? arrayConfigAtivUnidade.config : false;
    var duracao_padrao = (config_unidade && typeof config_unidade.planos !== 'undefined' && config_unidade.planos !== null && typeof config_unidade.planos.duracao_padrao !== 'undefined' && config_unidade.planos.duracao_padrao !== null) ? config_unidade.planos.duracao_padrao : 1;
    duracao_padrao = parseInt(duracao_padrao) - 1;

    var selectUsuariosOptions = $.map(arrayConfigAtividades.usuarios, function (v) {
        return '<option value="' + v.id_user + '">' + v.nome_completo + '</option>';
    }).join('');
    var htmlBox = '<div id="boxPlano" class="atividadeWork seipro-atividades-work">' +
        '   <table style="font-size: 10pt;width: 100%;" class="seiProForm">' +
        '      <tr>' +
        '          <td style="vertical-align: bottom; text-align: left;" class="label">' +
        '               <label for="id_user"><i class="iconPopup iconSwitch fas fa-user-tie cinzaColor"></i>Nome do Respons\u00E1vel:</label>' +
        '           </td>' +
        '           <td class="required" colspan="3">' +
        '               <select class="singleOptionConfig" data-key="id_user" id="id_user">' +
        '               ' + selectUsuariosOptions +
        '               </select>' +
        '           </td>' +
        '      </tr>' +
        '      <tr>' +
        '          <td style="vertical-align: bottom; text-align: left;" class="label">' +
        '               <label for="id_tipo_modalidade"><i class="iconPopup iconSwitch fas fa-wrench cinzaColor"></i>Tipo de Modalidade:</label>' +
        '           </td>' +
        '           <td class="required">' +
        '               <select class="singleOptionConfig" data-act="atividades-call" data-fn="changeConfigCargaHPadrao" data-key="id_tipo_modalidade" id="id_tipo_modalidade">' +
        '               ' + selectModalidadesOptions +
        '               </select>' +
        '           </td>' +
        '           <td style="vertical-align: bottom;" class="label">' +
        '               <label class="last" for="carga_horaria"><i class="iconPopup iconSwitch fas fa-user-circle cinzaColor" style="float: initial;"></i>Carga hor\u00E1ria</label>' +
        '           </td>' +
        '           <td class="required">' +
        '               <input id="carga_horaria" type="number" min="1" max="24" value="' + carga_horaria_entidade + '" required>' +
        '           </td>' +
        '      </tr>' +
        '      <tr>' +
        '          <td style="vertical-align: bottom; text-align: left;" class="label">' +
        '               <label for="data_inicio_vigencia"><i class="iconPopup iconSwitch fas fa-calendar-check cinzaColor"></i>Data de In\u00EDcio:</label>' +
        '           </td>' +
        '           <td class="required">' +
        '               <input id="data_inicio_vigencia" class="data_inicio_vigencia" data-act="atividades-call" data-fn="checkLimitePlano" type="date" value="' + moment().startOf('month').format('YYYY-MM-DD') + '" required>' +
        '           </td>' +
        '           <td style="vertical-align: bottom;" class="label">' +
        '               <label class="last" for="data_fim_vigencia"><i class="iconPopup iconSwitch fas fa-calendar-check cinzaColor" style="float: initial;"></i>Data de Encerramento:</label>' +
        '           </td>' +
        '           <td class="required">' +
        '               <input id="data_fim_vigencia" class="data_fim_vigencia" data-act="atividades-call" data-fn="checkLimitePlano" type="date" value="' + moment().add(duracao_padrao, 'month').endOf('month').format('YYYY-MM-DD') + '" required>' +
        '           </td>' +
        '      </tr>' +
        '   </table>' +
        '</div>';

    resetDialogBoxPro('dialogBoxPro');
    dialogBoxPro = $('#dialogBoxPro')
        .html('<div class="dialogBoxDiv">' + htmlBox + '</div>')
        .dialog({
            title: 'Adicionar Plano de Trabalho',
            width: 780,
            open: function () {
                updateButtonConfirm(this, true);
                initChosenReplace('box_init', this, true);
                $('.dialogBoxDiv #id_tipo_modalidade').trigger('change');
            },
            close: function () {
                $('#boxUser').remove();
                resetDialogBoxPro('dialogBoxPro');
            },
            buttons: [{
                id: 'addPlanoBtn',
                text: 'Adicionar',
                class: 'confirm',
                click: function (event) {
                    var _parent = $(this).closest('.ui-dialog');
                    var id_user = _parent.find('select#id_user').val();
                    var id_tipo_modalidade = _parent.find('select#id_tipo_modalidade').val();
                    var carga_horaria = _parent.find('input#carga_horaria').val();
                    var data_inicio_vigencia = moment(_parent.find('input#data_inicio_vigencia').val(), 'YYYY-MM-DD').startOf('day').format('YYYY-MM-DD HH:mm:ss');
                    var data_fim_vigencia = moment(_parent.find('input#data_fim_vigencia').val(), 'YYYY-MM-DD').endOf('day').format('YYYY-MM-DD HH:mm:ss');
                    var datesKey = getWorkDaysBetweenDates(data_inicio_vigencia, data_fim_vigencia, arrayConfigAtivUnidade.sigla_unidade);

                    if (callAtiv('checkAtivRequiredFields',_parent.find('select#id_user'), 'mark')) {
                        var key = {
                            id_user: parseInt(id_user),
                            id_unidade: parseInt(arrayConfigAtivUnidade.id_unidade),
                            id_tipo_modalidade: parseInt(id_tipo_modalidade),
                            carga_horaria: parseInt(carga_horaria),
                            tempo_total: datesKey.dias * carga_horaria,
                            tempo_proporcional: datesKey.dias * carga_horaria,
                            data_inicio_vigencia: data_inicio_vigencia,
                            data_fim_vigencia: data_fim_vigencia,
                            config: {
                                atividades_lista_integral: true
                            }
                        };
                        var action = 'config_new_planos';
                        var param = {
                            action: action,
                            id: -1,
                            ids: [],
                            type: 'planos',
                            key: JSON.stringify(key),
                            mode: 'new'
                        };
                        _this.find('i.icon-parent').attr('class', 'fas fa-spinner fa-spin icon-parent');
                        getConfigServer(action, param);
                    }
                }
            }]
        });
}
export function checkLimitePlano(this_) {
    var _this = $(this_);
    var _parent = _this.closest('table');
    var _data_inicio_vigencia = _parent.find('.data_inicio_vigencia');
    var _data_fim_vigencia = _parent.find('.data_fim_vigencia');
    var data_inicio_vigencia = moment(_data_inicio_vigencia.val(), 'YYYY-MM-DD');
    var data_fim_vigencia = moment(_data_fim_vigencia.val(), 'YYYY-MM-DD');
    var limiteMesesPlanos = callAtiv('checkOptionEntidade','limite_meses_planos') ? callAtiv('getOptionEntidade','limite_meses_planos') : 6;
    var totalMesesForm = data_fim_vigencia.diff(data_inicio_vigencia, 'months', true);
    if (totalMesesForm < 0 || totalMesesForm > limiteMesesPlanos) {
        $("#addPlanoBtn").prop('disabled', true).addClass('ui-button-disabled ui-state-disabled');
        this_.setCustomValidity('*');
        this_.setCustomValidity('Ultrapassado o limite de ' + limiteMesesPlanos + ' mes(es) para os planos de trabalho');
        _this.addClass('requiredNull');
        var isValid = this_.reportValidity();
        var userValidation = this_.checkValidity();
    } else {
        $("#addPlanoBtn").prop('disabled', false).removeClass('ui-button-disabled ui-state-disabled');
        _parent.find('input.requiredNull').removeClass('requiredNull');
        this_.setCustomValidity('');
    }
    // console.log(totalMesesForm, limiteMesesPlanos);
}
export function newConfigUser(this_) {
    var _this = $(this_);

    var perfilOptions = $.map(arrayConfigAtividades.perfis, function (v) {
        if (arrayConfigAtividades.perfil.nivel <= v.nivel) {
            return '<option value="' + v.id_perfil + '">' + v.nome_perfil + '</option>';
        }
    }).join('');

    var htmlBox = '<div id="boxUser" class="atividadeWork seipro-atividades-work">' +
        '   <table style="font-size: 10pt;width: 100%;" class="seiProForm">' +
        '      <tr>' +
        '          <td style="vertical-align: bottom; text-align: left;" class="label">' +
        '               <label for="user_nome_completo"><i class="iconPopup iconSwitch fas fa-user-tie cinzaColor"></i>Nome Completo:</label>' +
        '           </td>' +
        '           <td class="required">' +
        '               <input id="user_nome_completo" type="text" required>' +
        '           </td>' +
        '           <td style="vertical-align: bottom;" class="label">' +
        '               <label class="last" for="user_email"><i class="iconPopup iconSwitch fas fa-envelope cinzaColor" style="float: initial;"></i>E-mail:</label>' +
        '           </td>' +
        '           <td class="required">' +
        '               <input id="user_email" type="email" data-server="true" data-act="atividades-call" data-fn="checkInputEmail" data-on="blur" style="font-size: 1em;" placeholder="usuario' + '@' + window.location.hostname.replace(window.location.hostname.split('.')[0] + '.', '') + '" required>' +
        '           </td>' +
        '      </tr>' +
        '      <tr>' +
        '          <td style="vertical-align: bottom; text-align: left;" class="label">' +
        '               <label for="user_apelido"><i class="iconPopup iconSwitch fas fa-user-circle cinzaColor"></i>Apelido:</label>' +
        '           </td>' +
        '           <td class="required">' +
        '               <input id="user_apelido" type="text" required>' +
        '           </td>' +
        '           <td style="" class="label">' +
        '               <label class="last" for="user_login"><i class="iconPopup iconSwitch fas fa-user-shield cinzaColor" style="float: initial;"></i>Usu\u00E1rio SEI:</label>' +
        '           </td>' +
        '           <td class="required">' +
        '               <input id="user_login" type="text" data-server="true" data-act="atividades-call" data-fn="checkInputUserServer" data-on="blur" style="font-size: 1em;" value="" required>' +
        '           </td>' +
        '      </tr>' +
        '      <tr>' +
        '          <td style="vertical-align: bottom; text-align: left;" class="label">' +
        '               <label for="matricula"><i class="iconPopup iconSwitch fas fa-id-badge cinzaColor"></i>Matr\u00EDcula:</label>' +
        '           </td>' +
        '           <td>' +
        '               <input id="matricula" data-server="true" data-act="atividades-call" data-fn="checkInputUserServer" data-on="blur" type="text">' +
        '           </td>' +
        '           <td style="vertical-align: bottom;" class="label">' +
        '               <label class="last" for="id_perfil"><i class="iconPopup iconSwitch fas fa-user-cog cinzaColor" style="float: initial;"></i>Perfil:</label>' +
        '           </td>' +
        '           <td class="required">' +
        '               <select id="id_perfil" style="font-size: 1em;" required>' + perfilOptions +
        '               </select>' +
        '           </td>' +
        '      </tr>' +
        '      <tr style="height: 20px;">' +
        '           <td style="font-size: 9pt;text-align: left;" colspan="4">' +
        '              <div class="onoffswitch" style="float: left;transform: scale(0.8);">' +
        '                  <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="novo_plano" tabindex="0" checked>' +
        '                  <label class="onoff-switch-label" for="novo_plano"></label>' +
        '              </div>' +
        '              <label for="novo_plano" style="vertical-align: sub;color: #666;">Cria plano de trabalho vinculado \u00E0 unidade ' + arrayConfigAtivUnidade.nome_unidade + '</label>' +
        '           </td>' +
        '      </tr>' +
        '   </table>' +
        '</div>';

    resetDialogBoxPro('dialogBoxPro');
    dialogBoxPro = $('#dialogBoxPro')
        .html('<div class="dialogBoxDiv">' + htmlBox + '</div>')
        .dialog({
            title: 'Adicionar Usu\u00E1rio',
            width: 780,
            open: function () {
                updateButtonConfirm(this, true);
                initChosenReplace('box_init', this, true);
            },
            close: function () {
                $('#boxUser').remove();
                resetDialogBoxPro('dialogBoxPro');
            },
            buttons: [{
                text: 'Adicionar',
                class: 'confirm',
                click: function (event) {
                    var _parent = $(this).closest('.ui-dialog');
                    var nome_completo = _parent.find('input#user_nome_completo');
                    var user_login = _parent.find('input#user_login');
                    var apelido = _parent.find('input#user_apelido');
                    var matricula = _parent.find('input#matricula');
                    var id_perfil = _parent.find('select#id_perfil');
                    id_perfil = (typeof id_perfil.val() !== 'undefined') ? parseInt(id_perfil.val()) : false;
                    var email = _parent.find('input#user_email');
                    var novo_plano = (_parent.find('input#novo_plano').is(':checked')) ? true : false;
                    var carga_horaria_padrao = jmespath.search(arrayConfigAtividades.entidades, "[?id_entidade==`" + arrayConfigAtividades.perfil.id_entidade + "`] |[0].config.carga_horaria_padrao");
                    carga_horaria_padrao = (carga_horaria_padrao == null) ? 8 : carga_horaria_padrao;
                    var tipo_modalidade_padrao = jmespath.search(arrayConfigAtividades.entidades, "[?id_entidade==`" + arrayConfigAtividades.perfil.id_entidade + "`] |[0].config.tipo_modalidade_padrao");
                    tipo_modalidade_padrao = (tipo_modalidade_padrao == null) ? 4 : tipo_modalidade_padrao;
                    var dates_inicio = moment().startOf('month').format('YYYY-MM-DD HH:mm:ss');
                    var dates_fim = moment().endOf('month').format('YYYY-MM-DD HH:mm:ss');
                    var datesKey = getWorkDaysBetweenDates(dates_inicio, dates_fim, arrayConfigAtivUnidade.sigla_unidade);

                    if (callAtiv('checkAtivRequiredFields',nome_completo[0], 'mark')) {
                        var key = {
                            id_unidade: arrayConfigAtivUnidade.id_unidade,
                            nome_completo: nome_completo.val(),
                            login: user_login.val(),
                            apelido: apelido.val(),
                            matricula: matricula.val(),
                            id_perfil: id_perfil,
                            novo_plano: novo_plano,
                            host: url_host.replace('controlador.php', ''),
                            email: email.val(),
                            plano: {
                                id_tipo_modalidade: tipo_modalidade_padrao,
                                carga_horaria: carga_horaria_padrao,
                                tempo_total: datesKey.dias * carga_horaria_padrao,
                                data_inicio_vigencia: dates_inicio,
                                data_fim_vigencia: dates_fim,
                                config: {
                                    atividades_lista_integral: true
                                }
                            },
                            config: []
                        };
                        var action = 'config_update_users';
                        var param = {
                            action: action,
                            id: -1,
                            ids: [],
                            type: 'users',
                            key: JSON.stringify(key),
                            mode: 'new'
                        };
                        _this.find('i.icon-parent').attr('class', 'fas fa-spinner fa-spin icon-parent');
                        getConfigServer(action, param);
                    }
                }
            }]
        });
}
export function getConfigServerDoc(action, param) {
    param.hash = userHashAtiv;
    param.version = VERSION_SPRO;
    param.perfil = (getOptionsPro('perfilAtividadesSelected')) ? getOptionsPro('perfilAtividadesSelected') : '';
    $.ajax({
        type: "POST",
        url: urlServerAtiv,
        processData: false,
        dataType: "json",
        // contentType: 'application/json',
        data: JSON.stringify(param),
        success: function (ativData) {
            loadingButtonConfirm(false);
            if (ativData.status == 0 || ativData.length == 0) {
                alertaBoxPro('Error', 'exclamation-triangle', (typeof ativData.status_txt != 'undefined' ? ativData.status_txt : 'Erro ao enviar sua informa\u00E7\u00F5es.'));
            } else {
                resetDialogBoxPro('editorBoxPro');
                callAtiv('updateAtividade_',false);
                var txtAlert = (action == 'sign_documento') ? 'Documento assinado' : 'Assinatura do documento cancelada';
                alertaBoxPro('Sucess', 'check-circle', txtAlert + ' com sucesso!');
                if (typeof ativData.refresh_page !== 'undefined' && ativData.refresh_page && $('#tableConfiguracoesPanel_' + param.type).is(':visible')) {
                    callAtiv('getTabConfig',param.type, 'get');
                }
                setTimeout(function () {
                    loadingButtonConfirm(false);
                }, 1500);
            }

        }
    }).fail(function (data, textStatus) {
        callAtiv('failureScreen',data, textStatus, param);
    });
}
export function getConfigServer(action, param) {
    if (callAtiv('checkCapacidade',action)) {
        getServerAtividades(param, action);
    }
}
export function approveConfig(this_) {
    var _this = $(this_);
    var td = _this.closest('td');
    var tr = _this.closest('tr');
    var data = td.data();
    var data_this = _this.data();
    var label = (data_this.mode == 'disapprove') ? '<b style="font-weight: bold;">CANCELAR A HOMOLOGA\u00C7\u00C3O</b> d' : '<b style="font-weight: bold;">HOMOLOGAR</b> ';
    var id = data_this.id;
    var text_alert = data_this.alert || '';
    var word_alert = data_this.word || 'SIM';
    var data_tr = tr.data();
    data_tr = (typeof data_tr !== 'undefined') ? tr.data() : data_this;
    var ids = [];
    var idTable = '#tableConfiguracoesPanel_' + data_tr.type;
    var countSelected = $(idTable + ' tr.infraTrMarcada').length;
    if (id != 0) {
        if ($(idTable).is(':visible') && countSelected > 0) {
            $(idTable).find('.lnkInfraCheck').data('index', 1).trigger('click');
        }
        _this.closest('tr').find('td').eq(0).find('input[type="checkbox"]').trigger('click');
    } else {
        ids = $(idTable).find('.checkboxSelectConfiguracoes:checked').map(function () { if (!$(this).closest('tr').hasClass('disabled')) { return $(this).val() } }).get();
    }

    confirmaFraseBoxPro('Tem certeza que deseja ' + label + (countSelected > 1 ? 'os registros' : 'o registro') + (id == 0 ? (countSelected > 1 ? ' selecionados' : ' selecionado') : '') + '? ' + text_alert, word_alert,
        function () {
            var action = 'config_update_' + data_this.type;
            if (callAtiv('checkCapacidade',action)) {
                var param = {
                    action: action,
                    id: id,
                    ids: ids,
                    type: data_this.type,
                    key: 'homologado',
                    mode: data_this.mode
                };
                getServerAtividades(param, action);
            }
        }, function () {
            if (id != 0) {
                if ($(idTable).is(':visible') && _this.closest('tr').hasClass('infraTrMarcada')) {
                    $(idTable).find('.lnkInfraCheck').data('index', 1).trigger('click');
                }
            }
        }
    );
}
export function updateCalcPlanos(this_) {
    var _this = $(this_);
    var td = _this.closest('td');
    var tr = _this.closest('tr');
    var data = td.data();
    var data_this = _this.data();
    var label = '<b style="font-weight: bold;">RECALCULAR</b>';
    var id = data_this.id;
    var data_tr = tr.data();
    data_tr = (typeof data_tr !== 'undefined') ? tr.data() : data_this;
    var ids = [];
    var idTable = '#tableConfiguracoesPanel_' + data_tr.type;
    var countSelected = $(idTable + ' tr.infraTrMarcada').length;
    if (id != 0) {
        if ($(idTable).is(':visible') && countSelected > 0) {
            $(idTable).find('.lnkInfraCheck').data('index', 1).trigger('click');
        }
        _this.closest('tr').find('td').eq(0).find('input[type="checkbox"]').trigger('click');
    } else {
        ids = $(idTable).find('.checkboxSelectConfiguracoes:checked').map(function () { if (!$(this).closest('tr').hasClass('disabled')) { return $(this).val() } }).get();
    }

    confirmaFraseBoxPro('Tem certeza que deseja ' + label + (countSelected > 1 ? 'os registros' : 'o registro') + (id == 0 ? (countSelected > 1 ? ' selecionados' : ' selecionado') : '') + '?', 'SIM',
        function () {
            var action = callAtiv('checkCapacidade','config_update_self_' + data_this.type) ? 'config_update_self_' + data_this.type : 'config_update_' + data_this.type;
            var listUpdate = [];
            if (callAtiv('checkCapacidade',action)) {
                $.each(tableConfigList.planos, function (i, v) {
                    if ($.inArray(v.id_plano.toString(), ids) !== -1) {
                        listUpdate.push(v);
                    }
                });
                if (listUpdate.length > 0) {
                    callAtiv('dialogUpdateCalcPlanos',listUpdate, 'update');
                }
            }
        }, function () {
            if (id != 0) {
                if ($(idTable).is(':visible') && _this.closest('tr').hasClass('infraTrMarcada')) {
                    $(idTable).find('.lnkInfraCheck').data('index', 1).trigger('click');
                }
            }
        }
    );
}
export function disableConfig_(this_) {
    var _this = $(this_);
    var data_this = _this.data();
    if (data_this.type == 'users') {
        var value = jmespath.search(tableConfigList[data_this.type], "[?id_" + data_this.type.slice(0, -1) + " == `" + data_this.id + "`] | [0]");
        value = (value == null) ? false : value;
        if (value && typeof value.list_planos !== 'undefined' && value.list_planos !== null && value.list_planos !== '' && value.list_planos) {
            alertaBoxPro('Error', 'exclamation-triangle', 'Existe plano de trabalho ativo na unidade ' + value.list_planos + '. <br><br>Encerre-o antes de prosseguir.');
        } else {
            disableConfig(this_);
        }
    } else if (data_this.type == 'unidades') {
        var value = jmespath.search(tableConfigList[data_this.type], "[?id_" + data_this.type.slice(0, -1) + " == `" + data_this.id + "`] | [0]");
        value = (value == null) ? false : value;
        if (value && typeof value.planos_ativos !== 'undefined' && value.planos_ativos !== null && value.planos_ativos !== '' && value.planos_ativos > 0) {
            var txt = value.planos_ativos == 1 ? 'Existe 1 (um) plano de trabalho ativo na unidade ' + value.nome_unidade + '. <br><br>Encerre-o antes de prosseguir.' : 'Existem ' + value.planos_ativos + ' planos de trabalho ativos na unidade ' + value.nome_unidade + '. <br><br>Encerre-os antes de prosseguir.';
            alertaBoxPro('Error', 'exclamation-triangle', txt);
        } else {
            disableConfig(this_);
        }
    } else {
        disableConfig(this_);
    }
}
export function disableConfig(this_) {
    var _this = $(this_);
    var td = _this.closest('td');
    var tr = _this.closest('tr');
    var data = td.data();
    var data_this = _this.data();
    var id = data_this.id;
    var data_tr = tr.data();
    data_tr = (typeof data_tr !== 'undefined') ? tr.data() : data_this;
    var ids = [];
    var idTable = '#tableConfiguracoesPanel_' + data_tr.type;
    var countSelected = $(idTable + ' tr.infraTrMarcada').length;
    if (id != 0) {
        if ($(idTable).is(':visible') && countSelected > 0) {
            $(idTable).find('.lnkInfraCheck').data('index', 1).trigger('click');
        }
        _this.closest('tr').find('td').eq(0).find('input[type="checkbox"]').trigger('click');
    } else {
        ids = $(idTable).find('.checkboxSelectConfiguracoes:checked').map(function () { if (!$(this).closest('tr').hasClass('disabled')) { return $(this).val() } }).get();
    }

    confirmaFraseBoxPro('Tem certeza que deseja <b style="font-weight: bold;">DESATIVAR</b> ' + (countSelected > 1 ? 'os registros' : 'o registro') + (id == 0 ? (countSelected > 1 ? ' selecionados' : ' selecionado') : '') + '?', 'SIM',
        function () {
            var action_all = 'config_update_' + data_this.type;
            var action_self = 'config_update_self_' + data_this.type;
            var check_action = callAtiv('checkCapacidade',action_all) ? action_all : false;
            check_action = callAtiv('checkCapacidade',action_self) ? action_self : check_action;
            if (check_action) {
                var param = {
                    action: check_action,
                    id: id,
                    ids: ids,
                    type: data_this.type,
                    key: 'data_fim',
                    mode: 'disable'
                };
                getServerAtividades(param, check_action);
            }
        }, function () {
            if (id != 0) {
                if ($(idTable).is(':visible') && _this.closest('tr').hasClass('infraTrMarcada')) {
                    $(idTable).find('.lnkInfraCheck').data('index', 1).trigger('click');
                }
            }
        }
    );
}
export function archiveConfig(this_) {
    var _this = $(this_);
    var td = _this.closest('td');
    var tr = _this.closest('tr');
    var data = td.data();
    var data_this = _this.data();
    var id = data_this.id;
    var data_tr = tr.data();
    data_tr = (typeof data_tr !== 'undefined') ? tr.data() : data_this;
    var ids = [];
    var idTable = '#tableConfiguracoesPanel_' + data_tr.type;
    var countSelected = $(idTable + ' tr.infraTrMarcada').length;
    if (id != 0) {
        if ($(idTable).is(':visible') && countSelected > 0) {
            $(idTable).find('.lnkInfraCheck').data('index', 1).trigger('click');
        }
        _this.closest('tr').find('td').eq(0).find('input[type="checkbox"]').trigger('click');
    } else {
        ids = $(idTable).find('.checkboxSelectConfiguracoes:checked').map(function () { if (!$(this).closest('tr').hasClass('disabled')) { return $(this).val() } }).get();
    }

    confirmaFraseBoxPro('Tem certeza que deseja <b style="font-weight: bold;">ARQUIVAR</b> ' + (countSelected > 1 ? 'os registros' : 'o registro') + (id == 0 ? (countSelected > 1 ? ' selecionados' : ' selecionado') : '') + '?', 'SIM',
        function () {
            var action = 'config_update_archive_' + data_this.type;
            if (callAtiv('checkCapacidade',action)) {
                var param = {
                    action: action,
                    id: id,
                    ids: ids,
                    type: data_this.type,
                    mode: data_this.mode,
                    key: 'data_arquivamento'
                };
                getServerAtividades(param, action);
            }
        }, function () {
            if (id != 0) {
                if ($(idTable).is(':visible') && _this.closest('tr').hasClass('infraTrMarcada')) {
                    $(idTable).find('.lnkInfraCheck').data('index', 1).trigger('click');
                }
            }
        }
    );
}
export function postponeConfig(this_) {
    var _this = $(this_);
    var data_this = _this.data();
    var id_plano_deducao = data_this.id_plano_deducao;
    var data_inicio_vigencia = data_this.data_inicio_vigencia;
    console.log(data_inicio_vigencia);
    var inputText = (data_this.type == 'planos_deducao') ? '<br>Nova data de in\u00EDcio de vig\u00EAncia: <input id="configPostpone_date" type="date" style="width: 200px;" min="' + moment(data_inicio_vigencia, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD') + '" value="' + moment().format('YYYY-MM-DD') + '"">' : '';
    var typeText = data_this.type == 'planos_deducao' ? 'da dedu\u00E7\u00E3o de horas do plano de trabalho' : '';

    confirmaFraseBoxPro('Tem certeza que deseja <b style="font-weight: bold;">POSTERGAR</b> a data de vig\u00EAncia ' + typeText + '?<br>' + inputText, 'Sim',
        function () {
            if (callAtiv('checkPerfilNivelAdm',)) {
                var action = 'config_update_planos';
                var param = {
                    action: action,
                    id: id_plano_deducao,
                    key: 'data_inicio_vigencia',
                    date_config: $('#configPostpone_date').length ? $('#configPostpone_date').val() : false,
                    mode: 'postpone',
                    type: data_this.type
                };
                getServerAtividades(param, action);
            }
        }
    );
}
export function closeConfig(this_) {
    var _this = $(this_);
    var td = _this.closest('td');
    var tr = _this.closest('tr');
    var data = td.data();
    var data_this = _this.data();
    var id = data_this.id;
    var data_tr = tr.data();
    data_tr = (typeof data_tr !== 'undefined') ? tr.data() : data_this;
    var ids = [];
    var idTable = '#tableConfiguracoesPanel_' + data_tr.type;
    var countSelected = $(idTable + ' tr.infraTrMarcada').length;
    if (id != 0) {
        if ($(idTable).is(':visible') && countSelected > 0) {
            $(idTable).find('.lnkInfraCheck').data('index', 1).trigger('click');
        }
        _this.closest('tr').find('td').eq(0).find('input[type="checkbox"]').trigger('click');
    } else {
        ids = $(idTable).find('.checkboxSelectConfiguracoes:checked').map(function () { if (!$(this).closest('tr').hasClass('disabled')) { return $(this).val() } }).get();
    }
    var typeText = (countSelected > 1) ? 'os registros' : 'o registro';
    var inputText = '';

    if (data_this.type == 'planos') {
        typeText = (countSelected > 1) ? 'os planos de trabalho' : 'o plano de trabalho';
        var dateMinMax = (id != 0)
            ? jmespath.search(tableConfigList[data_this.type], "[?id_plano==`" + id + "`]")
            : $.map(tableConfigList[data_this.type], function (v) {
                if ($.inArray(v.id_plano.toString(), ids) !== -1) { return v }
            });
        var dateInicio = jmespath.search(dateMinMax, "[*].data_inicio_vigencia");
        dateInicio = (dateInicio == null) ? null : dateInicio.reduce(function (a, b) { return a > b ? a : b; });
        dateInicio = (dateInicio == null) ? null : moment(dateInicio, 'YYYY-MM-DD HH:mm:ss');
        var dateFim = jmespath.search(dateMinMax, "[*].data_fim_vigencia");
        dateFim = (dateFim == null) ? null : dateFim.reduce(function (a, b) { return a > b ? a : b; });
        dateFim = (dateFim == null) ? null : moment(dateFim, 'YYYY-MM-DD HH:mm:ss');
        var inputText = (data_this.type == 'planos') ? '<br>Data de encerramento do plano: <input id="configClose_date" type="date" style="width: 200px;" min="' + dateInicio.format('YYYY-MM-DD') + '" value="' + (moment() > dateFim ? dateFim : moment().format('YYYY-MM-DD')) + '" max="' + dateFim.format('YYYY-MM-DD') + '">' : '';
    } else if (data_this.type == 'termos') {
        typeText = (countSelected > 1) ? 'os termos de ci\u00EAncia e responsabilidade' : 'o termo de ci\u00EAncia e responsabilidade';
        var dateMinMax = (id != 0)
            ? jmespath.search(tableConfigList[data_this.type], "[?id_termo==`" + id + "`]")
            : $.map(tableConfigList[data_this.type], function (v) {
                if ($.inArray(v.id_plano.toString(), ids) !== -1) { return v }
            });
        var dateInicio = jmespath.search(dateMinMax, "[*].data_inicio_vigencia");
        dateInicio = (dateInicio == null) ? null : dateInicio.reduce(function (a, b) { return a > b ? a : b; });
        dateInicio = (dateInicio == null) ? null : moment(dateInicio, 'YYYY-MM-DD HH:mm:ss');
        var dateFim = jmespath.search(dateMinMax, "[*].data_fim_vigencia");
        dateFim = (dateFim == null) ? null : dateFim.reduce(function (a, b) { return a > b ? a : b; });
        dateFim = (dateFim == null) ? null : moment(dateFim, 'YYYY-MM-DD HH:mm:ss');
        var inputText = (data_this.type == 'termos') ? '<br>Data de encerramento do termo: <input id="configClose_date" type="date" style="width: 200px;" min="' + dateInicio.format('YYYY-MM-DD') + '" value="' + (moment() > dateFim ? dateFim : moment().format('YYYY-MM-DD')) + '" max="' + dateFim.format('YYYY-MM-DD') + '">' : '';
    }
    typeText = typeText + (id == 0 ? (countSelected > 1 ? ' selecionados' : ' selecionado') : '');

    confirmaFraseBoxPro('Tem certeza que deseja <b style="font-weight: bold;">ENCERRAR ANTECIPADAMENTE</b> ' + typeText + '?' + inputText, 'ENCERRAR',
        function () {
            var action_all = 'config_update_' + data_this.type;
            var action_self = 'config_update_self_' + data_this.type;
            var check_action = callAtiv('checkCapacidade',action_all) ? action_all : false;
            check_action = callAtiv('checkCapacidade',action_self) ? action_self : check_action;
            if (check_action) {
                var param = {
                    action: check_action,
                    id: id,
                    ids: ids,
                    type: data_this.type,
                    key: 'data_fim_vigencia',
                    date_config: ($('#configClose_date').length ? $('#configClose_date').val() : false),
                    mode: 'close'
                };
                getServerAtividades(param, check_action);
            }
        }, function () {
            if (id != 0) {
                if ($(idTable).is(':visible') && _this.closest('tr').hasClass('infraTrMarcada')) {
                    $(idTable).find('.lnkInfraCheck').data('index', 1).trigger('click');
                }
            }
        }
    );
}
