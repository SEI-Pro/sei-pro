import { callAtiv } from './call.js';
/**
 * Atividades — relatórios detalhados e afastamentos resumidos.
 *
 * Esta fatia mantém apenas a superfície legada necessária durante a migração.
 * O estado compartilhado é instalado por runtime.js e os nomes antigos são
 * publicados exclusivamente por legacy-api.js.
 */
import './runtime.js';
import { getServerAtividades } from './server.js';

export function getTableRelatorioPlano(this_) {
    let _this = $(this_);
    let _data = _this.data();
    let id_plano = _data.id_plano;
    let id_entrega = typeof _data.id_entrega !== 'undefined' ? _data.id_entrega : false;
    let indice_mes_entrega = typeof _data.indice_mes_entrega !== 'undefined' ? _data.indice_mes_entrega : false;
    resetDialogBoxPro('dialogBoxPro');
    dialogBoxPro = $('#dialogBoxPro')
        .html('<div id="view_doc" class="atividadeWork seipro-atividades-work"><div id="tabs_report-demandas"><div class="dataFallback dataLoading" style="z-index: 1;" data-text="Nenhum dado dispon\u00EDvel"></div></div></div>')
        .dialog({
            title: 'Lista de ' + __.Demandas + ' do Plano',
            width: $(window).width() - 50,
            height: $(window).height() - 100,
            open: function () {
                var action = 'report_demandas';
                var param = {
                    action: action,
                    disabled: 'hide',
                    all_data: false,
                    id_programa: 0,
                    id: id_plano,
                    type: 'planos',
                    id_plano: id_plano,
                    id_entrega: id_entrega,
                    indice_mes_entrega: indice_mes_entrega,
                    offset: 0
                };
                getServerAtividades(param, action);
            },
            close: function () {
                resetDialogBoxPro('dialogBoxPro');
            },
            buttons: [{
                text: 'Imprimir',
                icon: 'ui-icon-print',
                click: function (event) {
                    printDocumento();
                }
            }, {
                text: 'Ok',
                class: 'confirm',
                click: function (event) {
                    $('#view_doc').remove();
                    resetDialogBoxPro('dialogBoxPro');
                }
            }]
        });
}
export function getTableRelatorioPanel(data, param) {
    var type = param.action.replace('report_', '');
    var relatorioID = '#tabs_report-' + type;
    var tabelaRelatorio = $(relatorioID);
    var listRelatorios = data.result;
    var isInitOffset = (typeof data.offset === 'undefined' || data.offset == 0) ? true : false;
    var offset = (typeof data.offset !== 'undefined' && data.offset != 0) ? data.offset : false;
    // var arrayProcessosUnidade = getProcessoUnidadePro();
    var numRegistros = $('#tableRelatorio_' + type + ' caption.infraCaption span.count');
    numRegistros = (numRegistros.length > 0) ? parseInt(numRegistros.text()) : 0;
    var novosRegistros = (typeof listRelatorios !== 'undefined' && listRelatorios.length > 0 && listRelatorios != 0) ? listRelatorios.length : 0;
    var totalRegistros = numRegistros + novosRegistros;
    var countRelatorios = (totalRegistros == 1) ? '<span class="count">' + totalRegistros + '</span> registro:' : '<span class="count">' + totalRegistros + '</span> registros:';
    var loadingRegistros = '<span class="progress" style="color: #777;font-size: 0.9em !important;padding: 5px;margin: 5px;"><i class="fas fa-sync fa-spin cinzaColor"></i> carregando dados... <a class="cancel" style="cursor:pointer" data-act="atividades-tablesorter-cancel"><i class="fas fa-times cinzaColor" style="font-size: 100%;"></i></a></span>';
    if (typeof listRelatorios !== 'undefined' && listRelatorios.length > 0 && listRelatorios != 0) {
        var htmlTableRelatorios = getColumnsPanelRelatorios(data, type, isInitOffset, countRelatorios + loadingRegistros);

        var tableRelatorioID = 'tabelaRelatorioPanel_' + type;
        if (isInitOffset) {
            tabelaRelatorio.html('<div id="' + tableRelatorioID + '" class="tabelaPanelScroll" style="margin-top: 5px;">' + htmlTableRelatorios + '<div>');
        } else {
            if ($('#tableRelatorio_' + type + ' caption.infraCaption a.cancel').is(':visible')) {
                tabelaRelatorio.show();
            }
        }
        getRowsPanelRelatorios(listRelatorios, type, offset);

        if ($('#tableRelatorio_' + type + ' caption.infraCaption a.cancel').is(':visible') && (typeof data.next_offset !== 'undefined' || !data.next_offset) && callAtiv('getOptionEntidade','limit_paginacao') != 0) {
            callAtiv('getTabReport',type, 'get', data, data.next_offset, param);
        } else {
            $('#tableRelatorio_' + type + ' caption.infraCaption span.progress').remove();
        }

        var tableRelatorioElem = $('#' + tableRelatorioID);
        if (!getOptionsPro('panelHeight_relatoriosTabelaPro_' + type) && tableRelatorioElem.height() > 800 && !data.id_plano) { setOptionsPro('panelHeight_relatoriosTabelaPro_' + type, 800) }
        if (!data.id_plano) {
            initPanelResize('#' + tableRelatorioID, 'relatoriosTabelaPro_' + type);
        } else {
            tableRelatorioElem.css('max-height', '700px');
        }
        initFunctionPanelRelatorios(data, param, type);
    } else {
        if (totalRegistros == 0) {
            removeOptionsPro('selectReport_' + type);
            var htmlTableRelatorios = getColumnsPanelRelatorios(data, type, isInitOffset, countRelatorios + loadingRegistros);
            tabelaRelatorio.html('<div id="' + tableRelatorioID + '" class="tabelaPanelScroll" style="margin-top: 5px;">' + htmlTableRelatorios + '<div>');
            var colspan = $('#tableRelatorio_' + type + ' thead th').length;
            $('#tableRelatorio_' + type + ' tbody').html('<tr><td colspan="' + colspan + '"><div class="dataFallback" style="z-index: 1;" data-text="Nenhum dado dispon\u00EDvel"></div></td></tr>');
            $('#tableRelatorio_' + type + ' caption.infraCaption span.progress').remove();
            initFunctionPanelRelatorios(data, param, type);
        } else {
            $('#tableRelatorio_' + type + ' caption.infraCaption span.progress').remove();
        }
    }
}
export function initFunctionPanelRelatorios(data, param, type) {
    var relatorioTabela = $('#tableRelatorio_' + type);
    relatorioTabela.tablesorter({
        sortLocaleCompare: true,
        /**/
        textExtraction: {
            1: function (elem, table, cellIndex) { return filterTextExtractDate(elem, table, cellIndex) },
            2: function (elem, table, cellIndex) { return filterTextExtractDate(elem, table, cellIndex) },
            3: function (elem, table, cellIndex) { return filterTextExtractDate(elem, table, cellIndex) },
            4: function (elem, table, cellIndex) { return filterTextExtractDate(elem, table, cellIndex) },
            5: function (elem, table, cellIndex) { return filterTextExtractDate(elem, table, cellIndex) },
            6: function (elem, table, cellIndex) { return filterTextExtractDate(elem, table, cellIndex) },
            7: function (elem, table, cellIndex) { return filterTextExtractDate(elem, table, cellIndex) },
            8: function (elem, table, cellIndex) { return filterTextExtractDate(elem, table, cellIndex) },
            9: function (elem, table, cellIndex) { return filterTextExtractDate(elem, table, cellIndex) },
            10: function (elem, table, cellIndex) { return filterTextExtractDate(elem, table, cellIndex) },
            11: function (elem, table, cellIndex) { return filterTextExtractDate(elem, table, cellIndex) },
            12: function (elem, table, cellIndex) { return filterTextExtractDate(elem, table, cellIndex) },
            13: function (elem, table, cellIndex) { return filterTextExtractDate(elem, table, cellIndex) },
            14: function (elem, table, cellIndex) { return filterTextExtractDate(elem, table, cellIndex) },
            15: function (elem, table, cellIndex) { return filterTextExtractDate(elem, table, cellIndex) },
            16: function (elem, table, cellIndex) { return filterTextExtractDate(elem, table, cellIndex) },
            17: function (elem, table, cellIndex) { return filterTextExtractDate(elem, table, cellIndex) },
            18: function (elem, table, cellIndex) { return filterTextExtractDate(elem, table, cellIndex) },
            19: function (elem, table, cellIndex) { return filterTextExtractDate(elem, table, cellIndex) },
            20: function (elem, table, cellIndex) { return filterTextExtractDate(elem, table, cellIndex) },
            21: function (elem, table, cellIndex) { return filterTextExtractDate(elem, table, cellIndex) },
            22: function (elem, table, cellIndex) { return filterTextExtractDate(elem, table, cellIndex) },
            23: function (elem, table, cellIndex) { return filterTextExtractDate(elem, table, cellIndex) },
            24: function (elem, table, cellIndex) { return filterTextExtractDate(elem, table, cellIndex) },
            25: function (elem, table, cellIndex) { return filterTextExtractDate(elem, table, cellIndex) },
            26: function (elem, table, cellIndex) { return filterTextExtractDate(elem, table, cellIndex) }
        },
        /**/
        widgets: ["saveSort", "filter"],
        widgetOptions: {
            saveSort: false,
            filter_hideFilters: true,
            filter_columnFilters: true,
            filter_saveFilters: true,
            filter_hideEmpty: true,
            filter_excludeFilter: {}
        },
        sortReset: true
    }).on("filterEnd", function (event, data_filter) {
        $(this).find('caption span.count').text(data_filter.filteredRows);
        $(this).find("tbody > tr:visible > td > input").prop('disabled', false);
        $(this).find("tbody > tr:hidden > td > input").prop('disabled', true);
        calcFilterResume(relatorioTabela);
        let filter = callAtiv('getFilterTable',type, 'report');
        filter = filter ? JSON.stringify(filter) : false;
        let return_filter = typeof param !== 'undefined' && typeof param.filter !== 'undefined' ? param.filter : false;
        if (filter && (return_filter || typeof param === 'undefined') && return_filter != filter) callAtiv('getTabReport',type, 'get');
        setTimeout(() => { if (typeof param !== 'undefined' && typeof param.column_filter !== 'undefined') $('#tableConfiguracoesPanel_' + type).find('input.tablesorter-filter[data-column="' + param.column_filter + '"]').focus() }, 500);
    });

    // if (typeof data.programas !== 'undefined' && data.programas !== null && data.programas.length > 0) {
    var check_programas = typeof data.programas !== 'undefined' && data.programas !== null && data.programas.length > 0 ? true : false;
    var filterRelatorio = relatorioTabela.find('.tablesorter-filter-row').addClass('notCopy').get(0);
    if (typeof filterRelatorio !== 'undefined') {
        var observerFilterRelatorio = new MutationObserver(function (mutations) {
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

            var btnAllData = (check_programas && ((!data.id_plano && callAtiv('checkCapacidade','report_alldata')) || (!data.id_plano && callAtiv('checkPerfilNivelAdm',))) ?
                '   <div class="viewTableToggle editTableToggle" style="right: 600px;">' +
                '           <label class="label" for="changeViewTableRelatorio_' + type + '"><i class="fas fa-university cinzaColor" style="margin: 0px 6px 0 4px;"></i> Toda entidade</label>' +
                '           <div class="onoffswitch">' +
                '               <input type="checkbox" name="onoffswitch" data-type="' + type + '" data-act="atividades-call" data-fn="changeViewTableReport" class="onoffswitch-checkbox" id="changeViewTableRelatorio_' + type + '" tabindex="0" ' + (getOptionsPro('changeViewTableReport_' + type) == 'show' ? 'checked' : false) + '>' +
                '               <label class="onoff-switch-label" for="changeViewTableRelatorio_' + type + '"></label>' +
                '           </div>' +
                '   </div>'
                : '');

            var btnViewDisabled = (type == 'atividades' ?
                '   <div class="editTableToggle hideDisabledItens" style="right: 440px;top: 50px;">' +
                '           <label class="label" for="changeDisabledTableReport_' + type + '"><i class="fas fa-eye-slash ' + (getOptionsPro('changeDisabledTableReport_' + type) && getOptionsPro('changeDisabledTableReport_' + type) == 'show' ? 'azulColor' : 'cinzaColor') + '" style="margin: 0px 6px 0 4px;"></i> Inativos</label>' +
                '           <div class="onoffswitch">' +
                '               <input type="checkbox" name="onoffswitch" data-type="' + type + '" data-act="atividades-call" data-fn="changeDisabledTableReport" class="onoffswitch-checkbox" id="changeDisabledTableReport_' + type + '" tabindex="0" ' + (getOptionsPro('changeDisabledTableReport_' + type) && getOptionsPro('changeDisabledTableReport_' + type) == 'show' ? 'checked' : '') + '>' +
                '               <label class="onoff-switch-label" for="changeDisabledTableReport_' + type + '"></label>' +
                '           </div>' +
                '   </div>'
                : '');

            var selectListProgramas = (check_programas && type != 'atividades' && !data.id_plano) ? '<select id="selectReportProgramas_' + type + '" data-type="' + type + '" data-act="atividades-call" data-fn="changeReportPrograma" data-placeholder="Filtrar por ' + __.programa + '" style="max-width: 260px; width: 300px; float: right;" class="selectPro chosen-min"><option value="0" data-label="">&nbsp;</option></select>' : '';

            var htmlFilterRelatorio = '<div class="btn-group filterTablePro notCopy" role="group" style="right: 55px;top: 50px;z-index: 999;position: absolute;">' +
                '   ' + selectListProgramas +
                '   <button type="button" data-act="atividades-call" data-fn="downloadTablePro" data-icon="fas fa-download" style="padding: 0.1rem .5rem; font-size: 9pt; margin-left: 20px;" data-value="Baixar" class="btn btn-sm btn-light">' +
                '       <i class="fas fa-download" style="padding-right: 3px; cursor: pointer; font-size: 10pt; color: #888;"></i>' +
                '       <span class="text">Baixar</span>' +
                '   </button>' +
                '   <button type="button" data-act="atividades-call" data-fn="copyTablePro" data-icon="fas fa-copy" style="padding: 0.1rem .5rem; font-size: 9pt;" data-value="Copiar" class="btn btn-sm btn-light">' +
                '       <i class="fas fa-copy" style="padding-right: 3px; cursor: pointer; font-size: 10pt; color: #888;"></i>' +
                '       <span class="text">Copiar</span>' +
                '   </button>' +
                '   <button type="button" data-act="atividades-call" data-fn="filterTablePro" style="padding: 0.1rem .5rem; font-size: 9pt;" data-value="Pesquisar" class="btn btn-sm btn-light ' + (relatorioTabela.find('tr.tablesorter-filter-row').hasClass('hideme') ? '' : 'active') + '">' +
                '       <i class="fas fa-search" style="padding-right: 3px; cursor: pointer; font-size: 10pt; color: #888;"></i>' +
                '       Pesquisar' +
                '   </button>' +
                '</div>';
            relatorioTabela.find('thead .filterTablePro').remove();
            relatorioTabela.find('thead').prepend(btnAllData + btnViewDisabled + htmlFilterRelatorio);
            observerFilterRelatorio.observe(filterRelatorio, {
                attributes: true
            });
            calcFilterResume(relatorioTabela);
            callAtiv('setSelectProgramas',data.programas, 'selectReportProgramas_' + type, 'selectReport_' + type);

            $('div[id*="selectReport"]').on('click', function () {
                if ($(this).find('.chosen-drop').is(':visible')) {
                    $(this).closest('.btn-group').css('z-index', '9999');
                } else {
                    $(this).closest('.btn-group').css('z-index', '999');
                }
            });
        }, 500);
        if (typeof $().visible == 'undefined') $.getScript(URL_SPRO + "js/lib/jquery-visible.min.js");
    }
    // }
    relatorioTabela.find('.tablesorter-filter-row input.tablesorter-filter[aria-label*="Data"]').attr('type', 'date');
    if (data.id_plano) {
        setTimeout(function () {
            relatorioTabela.before('<div id="statusUserPlano" style="width:700px;display: inline-block;"><canvas id="chartStatusUserPlano" width="700" height="100"></canvas></div>');

            var element = $('#chartStatusUserPlano');
            var plano = jmespath.search(data.planos, "[?id_plano==`" + data.id_plano + "`] | [0]");
            plano = (plano === null) ? jmespath.search(tableConfigList.planos, "[?id_plano==`" + data.id_plano + "`] | [0]") : null;
            plano = (plano === null) ? jmespath.search(arrayConfigAtividades.planos, "[?id_plano==`" + data.id_plano + "`] | [0]") : null;
            plano = (plano !== null) ? plano : false;
            var mostrar_notas = plano ? jmespath.search(arrayConfigAtividades.unidades, "[?id_unidade==`" + plano.id_unidade + "`] | [0].config.planos.mostrar_notas") : false;
            var apelido_display = (mostrar_notas !== null && mostrar_notas) ? 'apelido_avaliacao' : 'apelido';
            var chartStatusUser = callAtiv('getSingleChartTempoPlano',element, plano, plano[apelido_display]);
            chartStatusUser.options.scales.x.ticks.display = false;
            chartStatusUser.update();
        }, 1000);
    }
}
export function getColumnsPanelRelatorios(data, type, isInitOffset, captionReport) {
    var htmlTableRelatorios = '';
    if (type == 'demandas' || type == 'demandas_excluidas') {
        htmlTableRelatorios = (isInitOffset) ?
            '<table id="tableRelatorio_' + type + '" data-name-table="Relatorio_' + type + '" style="width: max-content !important; margin-top: ' + (!data.id_plano ? '20px' : '-30px') + ';" class="tableInfo tableZebra tableFollow tableAtividades tableRelatorioView seipro-atividades-table" data-tabletype="relatorios">' +
            '   <caption class="infraCaption" style="text-align: left; margin-top: 20px;">' + captionReport + '</caption>' +
            '   <thead>' +
            '       <tr class="tableHeader" style="height: 30px;">' +
            '           <th class="tituloControle" style="width: 50px;">ID</th>' +
            (type == 'demandas' || (type == 'demandas_excluidas' && callAtiv('checkCapacidade','restory_atividade')) ?
                '           <th class="tituloControle" style="width: 100px;">A\u00E7\u00E3o</th>' +
                '' : '') +
            '           <th class="tituloControle" style="width: 80px;">Unidade <div class="filterResume" data-resumemod="dist" data-resumetype="sigla_unidade"></div></th>' +
            '           <th class="tituloControle" style="width: 210px;">Processo <div class="filterResume" data-resumemod="dist" data-resumetype="processo"></div></th>' +
            (callAtiv('checkOptionEntidade','dispensa_tipos_requisicao') ? '' :
                '           <th class="tituloControle" style="width: 180px;">Requisi\u00E7\u00E3o <div class="filterResume" data-resumemod="dist" data-resumetype="requisicao"></div></th>' +
                '') +
            '           <th class="tituloControle" style="width: 400px;">' + __.Assunto + '</th>' +
            '           <th class="tituloControle" style="width: 400px;">' + __.Atividade + ' <div class="filterResume" data-resumemod="dist" data-resumetype="nome_atividade"></div></th>' +
            '           <th class="tituloControle" style="width: 400px;">Macro' + __.atividade + ' <div class="filterResume" data-resumemod="dist" data-resumetype="macroatividade"></div></th>' +
            '           <th class="tituloControle" style="width: 180px;">Etiquetas</th>' +
            '           <th class="tituloControle" style="width: 180px;">Plano de Trabalho <div class="filterResume" data-resumemod="dist" data-resumetype="plano"></div></th>' +
            (callAtiv('checkOptionEntidade','exigir_homologacao_programas') ?
                '           <th class="tituloControle" style="width: 180px;">Entrega <div class="filterResume" data-resumemod="dist" data-resumetype="entrega"></div></th>' +
                '' : '') +
            '           <th class="tituloControle" style="width: 180px;">Respons\u00E1vel <div class="filterResume" data-resumemod="dist" data-resumetype="responsavel"></div></th>' +
            '           <th class="tituloControle" style="width: 140px;">Tempo Planejado (horas) <div class="filterResume" data-resumemod="sum" data-resumetype="tempo_planejado"></div></th>' +
            '           <th class="tituloControle" style="width: 120px;">Dias de Planejamento <div class="filterResume" data-resumemod="avg" data-resumetype="dias_planejado"></div></th>' +
            '           <th class="tituloControle tituloFilter sorter-date-range-dmy" style="width: 100px;">Data de Distribui\u00E7\u00E3o</th>' +
            '           <th class="tituloControle tituloFilter sorter-date-range-dmy" style="width: 100px;">Prazo de Entrega</th>' +
            '           <th class="tituloControle" style="width: 140px;">Tempo Pactuado (horas) <div class="filterResume" data-resumemod="sum" data-resumetype="tempo_pactuado"></div></th>' +
            '           <th class="tituloControle" style="width: 120px;">Fator de ' + __.Complexidade + ' <div class="filterResume" data-resumemod="avg" data-resumetype="fator_complexidade"></div></th>' +
            '           <th class="tituloControle tituloFilter sorter-date-range-dmy" style="width: 100px;">Data de In\u00EDcio</th>' +
            '           <th class="tituloControle tituloFilter sorter-date-range-dmy" style="width: 100px;">Data de Conclus\u00E3o</th>' +
            '           <th class="tituloControle" style="width: 210px;">Status Entrega</th>' +
            '           <th class="tituloControle" style="width: 210px;">Documento Entregue <div class="filterResume" data-resumemod="dist" data-resumetype="documento_entregue"></div></th>' +
            '           <th class="tituloControle" style="width: 140px;">Tempo Despendido (horas) <div class="filterResume" data-resumemod="sum" data-resumetype="tempo_despendido"></div></th>' +
            (!callAtiv('checkOptionEntidade','desativa_produtividade_geral') ?
                '           <th class="tituloControle" style="width: 120px;">Produtividade por agilidade<div class="filterResume" data-resumemod="avg" data-resumetype="produtividade"></div></th>' +
                '           <th class="tituloControle" style="width: 120px;">Produtividade por antecipa\u00E7\u00E3o <div class="filterResume" data-resumemod="avg" data-resumetype="produtividade_executada"></div></th>' +
                '' : '') +
            '           <th class="tituloControle" style="width: 140px;">Tempo Homologado (horas) <div class="filterResume" data-resumemod="sum" data-resumetype="tempo_homologado"></div></th>' +
            '           <th class="tituloControle" style="width: 80px;">Nota Atribu\u00EDda <div class="filterResume" data-resumemod="avg" data-resumetype="nota_atribuida"></div></th>' +
            '           <th class="tituloControle" style="width: 120px;">Coment\u00E1rios</th>' +
            '           <th class="tituloControle" style="width: 120px;">Justificativas</th>' +
            '           <th class="tituloControle tituloFilter sorter-date-range-dmy" style="width: 100px;">Data de Avalia\u00E7\u00E3o</th>' +
            '           <th class="tituloControle tituloFilter sorter-date-range-dmy" style="width: 100px;">Data de ' + __.Arquivamento + '</th>' +
            '           <th class="tituloControle tituloFilter sorter-date-range-dmy" style="width: 100px;">\u00DAltima Atualiza\u00E7\u00E3o</th>' +
            '       </tr>' +
            '   </thead>' +
            '   <tbody>'
            : '';
    } else if (type == 'planos') {
        htmlTableRelatorios = (isInitOffset) ?
            '<table id="tableRelatorio_' + type + '" data-name-table="Relatorio_' + type + '" style="width: max-content !important; margin-top: 20px;" class="tableInfo tableZebra tableFollow tableAtividades tableRelatorioView seipro-atividades-table" data-tabletype="relatorios">' +
            '   <caption class="infraCaption" style="text-align: left; margin-top: 20px;">' + captionReport + '</caption>' +
            '   <thead>' +
            '       <tr class="tableHeader" style="height: 30px;">' +
            '           <th class="tituloControle" style="width: 50px;">ID</th>' +
            '           <th class="tituloControle" style="width: 80px;">Status</th>' +
            '           <th class="tituloControle" style="width: 100px;">Unidade <div class="filterResume" data-resumemod="dist" data-resumetype="sigla_unidade"></div></th>' +
            '           <th class="tituloControle" style="width: 210px;">Nome Completo <div class="filterResume" data-resumemod="dist" data-resumetype="nome_completo"></div></th>' +
            '           <th class="tituloControle" style="width: 80px;">Apelido <div class="filterResume" data-resumemod="dist" data-resumetype="apelido"></div></th>' +
            '           <th class="tituloControle" style="width: 80px;">Matr\u00EDcula <div class="filterResume" data-resumemod="dist" data-resumetype="matricula"></div></th>' +
            '           <th class="tituloControle">Tipo de Modalidade <div class="filterResume" data-resumemod="dist" data-resumetype="nome_modalidade"></div></th>' +
            '           <th class="tituloControle" style="width: 100px;">Carga Hor\u00E1ria <div class="filterResume" data-resumemod="avg" data-resumetype="carga_horaria"><div></th>' +
            '           <th class="tituloControle" style="width: 150px;">Data de In\u00EDcio</th>' +
            '           <th class="tituloControle" style="width: 150px;">Data de Encerramento</th>' +
            '           <th class="tituloControle" style="width: 150px;">Data de Arquivamento</th>' +
            '           <th class="tituloControle" style="width: 80px;">Meta Total do Plano (horas) <div class="filterResume" data-resumemod="sum" data-resumetype="tempo_total"><div></th>' +
            '           <th class="tituloControle" style="width: 80px;">Meta Parcial do Plano (horas) <div class="filterResume" data-resumemod="sum" data-resumetype="tempo_proporcional"><div></th>' +
            '           <th class="tituloControle" style="width: 80px;">Tempo Pactuado (horas) <div class="filterResume" data-resumemod="sum" data-resumetype="tempo_entregue"><div></th>' +
            '           <th class="tituloControle" style="width: 80px;">Tempo Entregue (horas) <div class="filterResume" data-resumemod="sum" data-resumetype="tempo_entregue"><div></th>' +
            '           <th class="tituloControle" style="width: 80px;">Tempo Homologado (horas) <div class="filterResume" data-resumemod="sum" data-resumetype="tempo_homologado"><div></th>' +
            '           <th class="tituloControle" style="width: 80px;">Tempo Despendido (horas) <div class="filterResume" data-resumemod="sum" data-resumetype="tempo_despendido"><div></th>' +
            '           <th class="tituloControle" style="width: 80px;">Quantidade de demandas <div class="filterResume" data-resumemod="sum" data-resumetype="quantidade_demandas"><div></th>' +
            (callAtiv('checkOptionEntidade','exigir_homologacao_programas') ?
                '           <th class="tituloControle" style="width: 80px;">Quantidade de entregas <div class="filterResume" data-resumemod="dist" data-resumetype="quantidade_entregas"><div></th>' +
                '' : '') +
            '           <th class="tituloControle" style="width: 80px;">Execu\u00E7\u00E3o do Plano <div class="filterResume" data-resumemod="avg" data-resumetype="execucao_plano"><div></th>' +
            (!callAtiv('checkOptionEntidade','desativa_produtividade_geral') ?
                '           <th class="tituloControle" style="width: 80px;">Produtividade do Plano <div class="filterResume" data-resumemod="avg" data-resumetype="produtividade_plano"><div></th>' +
                '' : '') +
            '           <th class="tituloControle" style="width: 80px;">Nota M\u00E9dia Atribu\u00EDda <div class="filterResume" data-resumemod="avg" data-resumetype="nota_media"><div></th>' +
            '           <th class="tituloControle" style="width: 80px;">Total de Avalia\u00E7\u00F5es <div class="filterResume" data-resumemod="sum" data-resumetype="total_avaliacoes"><div></th>' +
            '           <th class="tituloControle" style="">Assinatura</th>' +
            '           <th class="tituloControle" style="">Status Assinatura</th>' +
            '       </tr>' +
            '   </thead>' +
            '   <tbody>'
            : '';
    } else if (type == 'atividades') {
        htmlTableRelatorios = (isInitOffset) ?
            '<table id="tableRelatorio_' + type + '" data-name-table="Relatorio_' + type + '" style="width: max-content !important; margin-top: 20px;" class="tableInfo tableZebra tableFollow tableAtividades tableRelatorioView seipro-atividades-table" data-tabletype="relatorios">' +
            '   <caption class="infraCaption" style="text-align: left; margin-top: 20px;">' + captionReport + '</caption>' +
            '   <thead>' +
            '       <tr class="tableHeader" style="height: 30px;">' +
            '           <th class="tituloControle" style="width: 50px;">ID</th>' +
            '           <th class="tituloControle" style="width: 80px;">Status</th>' +
            '           <th class="tituloControle" style="width: 210px;">Nome da Atividade</th>' +
            '           <th class="tituloControle" style="width: 120px;">Macroatividade</th>' +
            '           <th class="tituloControle" style="width: 100px;">Sigla da Unidade</th>' +
            '           <th class="tituloControle" style="width: 120px;">Processo da Cadeia de Valor</th>' +
            '           <th class="tituloControle" style="width: 80px;">Tempo Pactuado <div class="filterResume" data-resumemod="avg" data-resumetype="tempo_pactuado"><div></th>' +
            '           <th class="tituloControle" style="width: 80px;">Dias de Planejamento <div class="filterResume" data-resumemod="avg" data-resumetype="dias_planejado"><div></th>' +
            '           <th class="tituloControle" style="width: 100px;">Entregas</th>' +
            '           <th class="tituloControle" style="width: 150px;">Par\u00E2metros</th>' +
            '           <th class="tituloControle" style="width: 150px;">' + __.Complexidade + '</th>' +
            '           <th class="tituloControle" style="width: 80px;">Data In\u00EDcio de Vig\u00EAncia</th>' +
            '           <th class="tituloControle" style="width: 80px;">Data Fim de Vig\u00EAncia</th>' +
            '           <th class="tituloControle" style="width: 80px;">Recalcula Prazo</th>' +
            '           <th class="tituloControle" style="width: 80px;">Tempo M\u00EDnimo <div class="filterResume" data-resumemod="avg" data-resumetype="tempo_minimo"><div></th>' +
            '           <th class="tituloControle" style="width: 80px;">Tipos de Processos</th>' +
            '           <th class="tituloControle" style="width: 80px;">Homologado</th>' +
            '       </tr>' +
            '   </thead>' +
            '   <tbody>'
            : '';
    } else if (type == 'afastamentos') {
        htmlTableRelatorios = (isInitOffset) ?
            '<table id="tableRelatorio_' + type + '" data-name-table="Relatorio_' + type + '" style="width: max-content !important; margin-top: 20px;" class="tableInfo tableZebra tableFollow tableAtividades tableRelatorioView seipro-atividades-table" data-tabletype="relatorios">' +
            '   <caption class="infraCaption" style="text-align: left; margin-top: 20px;">' + captionReport + '</caption>' +
            '   <thead>' +
            '       <tr class="tableHeader" style="height: 30px;">' +
            '           <th class="tituloControle" style="width: 50px;">ID</th>' +
            '           <th class="tituloControle" style="width: 80px;">Status</th>' +
            '           <th class="tituloControle">Nome Completo</th>' +
            '           <th class="tituloControle" style="width: 210px;">Matr\u00EDcula</th>' +
            '           <th class="tituloControle">Tipo de Afastamento</th>' +
            '           <th class="tituloControle">Observa\u00E7\u00F5es</th>' +
            '           <th class="tituloControle" style="width: 120px;">Data In\u00EDcio</th>' +
            '           <th class="tituloControle" style="width: 120px;">Data Fim</th>' +
            '       </tr>' +
            '   </thead>' +
            '   <tbody>'
            : '';
    } else if (type == 'produtividade') {
        htmlTableRelatorios = (isInitOffset) ?
            '<table id="tableRelatorio_' + type + '" data-name-table="Relatorio_' + type + '" style="width: max-content !important; margin-top: 20px;" class="tableInfo tableZebra tableFollow tableAtividades tableRelatorioView seipro-atividades-table" data-tabletype="relatorios">' +
            '   <caption class="infraCaption" style="text-align: left; margin-top: 20px;">' + captionReport + '</caption>' +
            '   <thead>' +
            '       <tr class="tableHeader" style="height: 30px;">' +
            '           <th class="tituloControle">Nome Completo</th>' +
            '           <th class="tituloControle" style="width: 210px;">Matr\u00EDcula</th>' +
            '           <th class="tituloControle" style="width: 210px;">Unidade</th>' +
            '           <th class="tituloControle">Per\u00EDodo</th>' +
            '           <th class="tituloControle">M\u00E9dia de Avalia\u00E7\u00F5es</th>' +
            '           <th class="tituloControle">Total de Avalia\u00E7\u00F5es</th>' +
            '           <th class="tituloControle">Produtividade por agilidade<br>(% M\u00E9dia)</th>' +
            '           <th class="tituloControle">Produtividade por antecipa\u00E7\u00E3o <br>(% M\u00E9dia)</th>' +
            '       </tr>' +
            '   </thead>' +
            '   <tbody>'
            : '';
    } else if (type == 'prescricoes') {
        htmlTableRelatorios = (isInitOffset) ?
            '<table id="tableRelatorio_' + type + '" data-name-table="Relatorio_' + type + '" style="width: max-content !important; margin-top: 20px;" class="tableInfo tableZebra tableFollow tableAtividades tableRelatorioView seipro-atividades-table" data-tabletype="relatorios">' +
            '   <caption class="infraCaption" style="text-align: left; margin-top: 20px;">' + captionReport + '</caption>' +
            '   <thead>' +
            '       <tr class="tableHeader" style="height: 30px;">' +
            '           <th class="tituloControle" style="width: 210px;">Processo</th>' +
            '           <th class="tituloControle" style="width: 400px;">Tipo de ' + __.Prescricao + '</th>' +
            '           <th class="tituloControle">Status</th>' +
            '           <th class="tituloControle">Prazo (Dias)</th>' +
            '           <th class="tituloControle">Dias Decorridos</th>' +
            '           <th class="tituloControle">% Decorrida</th>' +
            '           <th class="tituloControle" style="width: 400px;">\u00DAltimo Documento Vinculado</th>' +
            '           <th class="tituloControle">Data</th>' +
            '       </tr>' +
            '   </thead>' +
            '   <tbody>'
            : '';
    } else if (type == 'email') {
        htmlTableRelatorios = (isInitOffset) ?
            '<table id="tableRelatorio_' + type + '" data-name-table="Relatorio_' + type + '" style="width: max-content !important; margin-top: 20px;" class="tableInfo tableZebra tableFollow tableAtividades tableRelatorioView seipro-atividades-table" data-tabletype="relatorios">' +
            '   <caption class="infraCaption" style="text-align: left; margin-top: 20px;">' + captionReport + '</caption>' +
            '   <thead>' +
            '       <tr class="tableHeader" style="height: 30px;">' +
            '           <th class="tituloControle">ID</th>' +
            '           <th class="tituloControle">ID Usu\u00E1rio</th>' +
            '           <th class="tituloControle" style="width: 400px;">Nome Usu\u00E1rio</th>' +
            '           <th class="tituloControle">A\u00E7\u00E3o</th>' +
            '           <th class="tituloControle">Assunto</th>' +
            '           <th class="tituloControle">Data</th>' +
            '           <th class="tituloControle" style="width: 600px;">Mensagem</th>' +
            '           <th class="tituloControle">Tabela</th>' +
            '           <th class="tituloControle">Refer\u00EAncia</th>' +
            '       </tr>' +
            '   </thead>' +
            '   <tbody>'
            : '';
    } else if (type == 'log') {
        htmlTableRelatorios = (isInitOffset) ?
            '<table id="tableRelatorio_' + type + '" data-name-table="Relatorio_' + type + '" style="width: max-content !important; margin-top: 20px;" class="tableInfo tableZebra tableFollow tableAtividades tableRelatorioView seipro-atividades-table" data-tabletype="relatorios">' +
            '   <caption class="infraCaption" style="text-align: left; margin-top: 20px;">' + captionReport + '</caption>' +
            '   <thead>' +
            '       <tr class="tableHeader" style="height: 30px;">' +
            '           <th class="tituloControle">ID</th>' +
            '           <th class="tituloControle">ID Usu\u00E1rio</th>' +
            '           <th class="tituloControle" style="width: 400px;">Nome Usu\u00E1rio</th>' +
            '           <th class="tituloControle">A\u00E7\u00E3o</th>' +
            '           <th class="tituloControle">Capacidade</th>' +
            '           <th class="tituloControle">Data</th>' +
            '           <th class="tituloControle">Tabela</th>' +
            '           <th class="tituloControle">Refer\u00EAncia</th>' +
            '       </tr>' +
            '   </thead>' +
            '   <tbody>'
            : '';
    }
    htmlTableRelatorios += (isInitOffset) ?
        '   </tbody>' +
        '</table>'
        : '';
    return htmlTableRelatorios;
}
export function getRowsPanelRelatorios(storeRelatorios, type, offset) {
    var tableReport = $('#tableRelatorio_' + type);
    var tableReportBody = $('#tableRelatorio_' + type + ' tbody');

    function setRowsPanelRelatorios(value, index) {
        if (type == 'demandas' || type == 'demandas_excluidas') {
            var linkProc = (parseInt(value.id_procedimento) == 0) ? '' : url_host + '?acao=procedimento_trabalhar&id_procedimento=' + value.id_procedimento;
            var linkReq = (parseInt(value.id_documento_requisicao) == 0) ? '' : url_host + '?acao=procedimento_trabalhar&id_procedimento=' + value.id_procedimento + '&id_documento=' + value.id_documento_requisicao;
            var linkDoc = (parseInt(value.id_documento_entregue) == 0) ? '' : url_host + '?acao=procedimento_trabalhar&id_procedimento=' + value.id_procedimento + '&id_documento=' + value.id_documento_requisicao;
            var documentoTips = (typeof value.documento_sei !== 'undefined' && value.documento_sei !== null && value.documento_sei != '' && parseInt(value.documento_sei) != 0) ? value.nome_documento + ' (' + value.documento_sei + ')' : value.nome_documento;
            documentoTips = (documentoTips === null) ? false : documentoTips;
            var requisicaoTips = (typeof value.requisicao_sei !== 'undefined' && value.requisicao_sei !== null && value.requisicao_sei != '' && parseInt(value.requisicao_sei) != 0) ? value.nome_requisicao + ' (' + value.requisicao_sei + ')' : value.nome_requisicao;
            requisicaoTips = (requisicaoTips === null) ? false : requisicaoTips;
            var iconProcesso = ($.inArray(value.processo_sei, arrayProcessosUnidade) == -1) ? 'fas fa-folder' : 'far fa-folder-open';
            var tipsProcesso = ($.inArray(value.processo_sei, arrayProcessosUnidade) == -1) ? 'Processo fechado nesta unidade' : 'Processo aberto nesta unidade';
            var nameUser = (value.id_user != 0 ? value.nome_completo : 'N\u00E3o atribu\u00EDdo');
            var planoUser = (typeof value.id_user !== 'undefined' && typeof value.id_plano !== 'undefined' && value.id_user != 0 && value.id_plano != 0 && typeof value.plano !== 'undefined' && typeof value.plano.data_inicio_vigencia !== 'undefined' && typeof value.plano.data_fim_vigencia !== 'undefined')
                ? '#' + value.id_plano + ' ' + moment(value.plano.data_inicio_vigencia, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY') + ' \u00E0 ' + moment(value.plano.data_fim_vigencia, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY')
                : 'N\u00E3o vinculado';
            var iconRequisicao = (value.data_entrega == '0000-00-00 00:00:00') ? 'far fa-list-alt' : 'fas fa-list-alt';

            var processoHtml = (value.processo_sei !== null && value.processo_sei != '')
                ? '               <a ' + (linkProc == '' ? 'style="cursor: auto;"' : 'style="text-decoration: underline;" class="bLink" href="' + linkProc + '" target="_blank"') + '>' +
                '                   <i class="' + iconProcesso + ' ' + (linkProc == '' ? '' : 'bLink') + '" ' + (linkProc == '' ? 'style="color: #a2a2a2;"' : 'style="text-decoration: underline;"') + '></i> ' +
                '                   <span ' + (linkProc == '' ? '' : 'class="bLink"') + '></i> ' +
                '                       ' + value.processo_sei +
                '                   </span>' +
                '               </a>'
                : '';

            var requisicaoHtml = (!requisicaoTips) ? '' :
                '               <a ' + (linkReq == '' ? 'style="cursor: auto;"' : 'style="text-decoration: underline;" class="bLink" href="' + linkReq + '" target="_blank"') + '>' +
                '                   <i class="' + iconRequisicao + ' ' + (linkReq == '' ? '' : 'bLink') + '" ' + (linkReq == '' ? 'style="color: #a2a2a2;"' : 'style="text-decoration: underline;"') + ' data-tip="' + requisicaoTips + '"></i> ' +
                '                   <span ' + (linkReq == '' ? '' : 'class="bLink"') + '></i> ' +
                '                       ' + requisicaoTips +
                '                   </span>' +
                '               </a>';

            var documentoHtml = (!documentoTips || value.data_entrega == '0000-00-00 00:00:00') ? '' :
                '               <a ' + (linkDoc == '' ? 'style="cursor: auto;"' : 'style="text-decoration: underline;" class="bLink" href="' + linkDoc + '" target="_blank"') + '>' +
                '                   <i class="' + iconRequisicao + ' ' + (linkDoc == '' ? '' : 'bLink') + '" ' + (linkDoc == '' ? 'style="color: #a2a2a2;"' : 'style="text-decoration: underline;"') + ' data-tip="' + documentoTips + '"></i> ' +
                '                   <span ' + (linkDoc == '' ? '' : 'class="bLink"') + '></i> ' +
                '                       ' + documentoTips +
                '                   </span>' +
                '               </a>';

            var statusAtividade = (moment(value.prazo_entrega, 'YYYY-MM-DD HH:mm:ss') < moment()) ? 'Atrasado' : 'No prazo';
            statusAtividade = (value.data_entrega != '0000-00-00 00:00:00' && moment(value.data_entrega, 'YYYY-MM-DD HH:mm:ss') <= moment(value.prazo_entrega, 'YYYY-MM-DD HH:mm:ss')) ? 'Entregue no prazo' : statusAtividade;
            statusAtividade = (value.data_entrega != '0000-00-00 00:00:00' && moment(value.data_entrega, 'YYYY-MM-DD HH:mm:ss') > moment(value.prazo_entrega, 'YYYY-MM-DD HH:mm:ss')) ? 'Entregue fora do prazo' : statusAtividade;

            var value_avaliacao = value.data_avaliacao != '0000-00-00 00:00:00' && value.avaliacao && value.avaliacao != 0 && value.avaliacao.length ? jmespath.search(value.avaliacao, "reverse(sort_by([*],&data_avaliacao)) | [0]") : false;

            var htmlTableRelatorios = '       <tr data-tagname="SemGrupo" data-index="' + index + '" data-id="' + value.id_demanda + '">' +
                '           <td align="center">' + value.id_demanda + '</td>' +
                (type == 'demandas_excluidas' && callAtiv('checkCapacidade','restory_atividade') ?
                    '           <td align="center"><a class="newLink info_noclick" style="font-size: 9pt;" data-act="atividades-call" data-fn="recoveryDemanda" data-scope="parent" data-id="' + value.id_demanda + '">' +
                    '               <i class="fas fa-undo" style="padding-right: 3px;"></i>Restaurar</a>' +
                    '           </td>' +
                    '' : '') +
                (type == 'demandas' && callAtiv('checkCapacidade','send_cancel_atividade') ?
                    '           <td align="center">' +
                    (value.data_envio != '0000-00-00 00:00:00' ?
                        '               <a class="newLink info_noclick" style="font-size: 9pt;" data-act="atividades-call" data-fn="sendCancelAtividadeReport" data-scope="parent" data-id="' + value.id_demanda + '"><i class="fas fa-reply" style="padding-right: 3px;"></i>Desarquivar</a>' +
                        '' : '') +
                    '           </td>' +
                    '' : '') +
                '           <td align="left" class="filterResume_sigla_unidade">' + value.sigla_unidade + '</td>' +
                '           <td align="left" class="filterResume_processo">' + processoHtml + '</td>' +
                (callAtiv('checkOptionEntidade','dispensa_tipos_requisicao') ? '' :
                    '           <td align="left" class="filterResume_requisicao">' + requisicaoHtml + '</td>' +
                    '') +
                '           <td align="left">' + value.assunto + '</td>' +
                '           <td align="left" class="filterResume_nome_atividade">' + (value.nome_atividade === null ? '' : value.nome_atividade) + '</td>' +
                '           <td align="left" class="filterResume_macroatividade">' + (value.macroatividade === null ? '' : value.macroatividade) + '</td>' +
                '           <td align="left">' + (value.etiquetas ? value.etiquetas.join('; ') : '') + '</td>' +
                '           <td align="left" class="filterResume_plano">' + planoUser + '</td>' +
                (callAtiv('checkOptionEntidade','exigir_homologacao_programas') ?
                    '           <td align="left" class="filterResume_entrega editCellSelect" data-key="entregas">' + (value.nome_entrega_sigla || '') + '</td>' +
                    '' : '') +
                '           <td align="left" class="filterResume_responsavel">' + nameUser + '</td>' +
                '           <td align="center" class="filterResume_tempo_planejado">' + value.tempo_planejado + '</td>' +
                '           <td align="center" class="filterResume_dias_planejado">' + value.dias_planejado + '</td>' +
                '           <td align="center">' +
                '               <span class="info_dates_monitorado" data-time-sorter="' + value.data_distribuicao + '">' +
                '                   ' + (value.data_distribuicao == '0000-00-00 00:00:00' ? '' : moment(value.data_distribuicao, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY HH:mm')) +
                '               </span>' +
                '           </td>' +
                '           <td align="center">' +
                '               <span class="info_dates_monitorado" data-time-sorter="' + value.prazo_entrega + '">' +
                '                   ' + (value.prazo_entrega == '0000-00-00 00:00:00' ? '' : moment(value.prazo_entrega, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY HH:mm')) +
                '               </span>' +
                '           </td>' +
                '           <td align="center" class="filterResume_tempo_pactuado">' + value.tempo_pactuado + '</td>' +
                '           <td align="center" class="filterResume_fator_complexidade">' + value.fator_complexidade + '</td>' +
                '           <td align="center">' +
                '               <span class="info_dates_monitorado" data-time-sorter="' + value.data_inicio + '">' +
                '                   ' + (value.data_inicio == '0000-00-00 00:00:00' ? '' : moment(value.data_inicio, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY HH:mm')) +
                '               </span>' +
                '           </td>' +
                '           <td align="center">' +
                '               <span class="info_dates_monitorado" data-time-sorter="' + value.data_entrega + '">' +
                '                   ' + (value.data_entrega == '0000-00-00 00:00:00' ? '' : moment(value.data_entrega, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY HH:mm')) +
                '               </span>' +
                '           </td>' +
                '           <td align="left">' + statusAtividade + '</td>' +
                '           <td align="left" class="filterResume_documento_entregue">' + documentoHtml + '</td>' +
                '           <td align="center" class="filterResume_tempo_despendido">' + value.tempo_despendido + '</td>' +
                (!callAtiv('checkOptionEntidade','desativa_produtividade_geral') ?
                    '           <td align="left" class="filterResume_produtividade">' + (value.produtividade == 0 ? '' : ((value.produtividade * 100).toFixed(2) + '%')) + '</td>' +
                    '           <td align="left" class="filterResume_produtividade_executada">' + (value.produtividade_executada == 0 ? '' : ((value.produtividade_executada * 100).toFixed(2) + '%')) + '</td>' +
                    '' : '') +
                '           <td align="center" class="filterResume_tempo_homologado">' + value.tempo_homologado + '</td>' +
                '           <td align="center" class="filterResume_nota_atribuida">' + (value_avaliacao && value_avaliacao.nota_atribuida ? value_avaliacao.nota_atribuida : '') + '</td>' +
                '           <td align="left">' + (value_avaliacao && value_avaliacao.comentarios ? value_avaliacao.comentarios : '') + '</td>' +
                '           <td align="left">' + (value_avaliacao && value_avaliacao.justificativas ? $.map(value_avaliacao.justificativas, function (v) { return v.nome_justificativa }).join(', ') : '') + '</td>' +
                '           <td align="center">' +
                '               <span class="info_dates_monitorado" data-time-sorter="' + value.data_avaliacao + '">' +
                '                   ' + (value.data_avaliacao == '0000-00-00 00:00:00' ? '' : moment(value.data_avaliacao, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY HH:mm')) +
                '               </span>' +
                '           </td>' +
                '           <td align="center">' +
                '               <span class="info_dates_monitorado" data-time-sorter="' + value.data_envio + '">' +
                '                   ' + (value.data_envio == '0000-00-00 00:00:00' ? '' : moment(value.data_envio, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY HH:mm')) +
                '               </span>' +
                '           </td>' +
                '           <td align="center">' +
                '               <span class="info_dates_monitorado" data-time-sorter="' + value.datetime + '">' +
                '                   ' + (value.datetime == '0000-00-00 00:00:00' ? '' : moment(value.datetime, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY HH:mm')) +
                '               </span>' +
                '           </td>' +
                '       </tr>';
        } else if (type == 'planos') {
            var status = (moment(value.data_fim, 'YYYY-MM-DD HH:mm:ss') < moment() && value.data_fim != '0000-00-00 00:00:00') ? 'DESATIVADO' : 'ATIVO';
            status = (moment(value.data_fim_vigencia, 'YYYY-MM-DD HH:mm:ss') < moment()) ? 'ENCERRADO' : status;
            status = (moment(value.data_inicio_vigencia, 'YYYY-MM-DD HH:mm:ss') > moment()) ? 'FUTURO' : status;
            status = (typeof value.data_arquivamento !== 'undefined' && moment(value.data_arquivamento, 'YYYY-MM-DD HH:mm:ss') < moment() && value.data_arquivamento != '0000-00-00 00:00:00') ? 'ARQUIVADO' : status;
            var ref_assinatura = typeof value.ref_assinatura !== 'undefined' ? value.ref_assinatura : 'planos';
            var id_reference = typeof value.id_reference !== 'undefined' ? value.id_reference : value.id_plano;

            var modalidade = jmespath.search(arrayConfigAtividades.tipos_modalidades, "[?id_tipo_modalidade==`" + value.id_tipo_modalidade + "`] | [0]");
            var modalidade_config = modalidade !== null && modalidade.hasOwnProperty('config') && typeof modalidade.config !== 'undefined' && modalidade.config !== null ? modalidade.config : false;
            var exige_entregas_programa = (modalidade_config && modalidade_config.hasOwnProperty('exige_entregas_programa')) ? modalidade_config.exige_entregas_programa : false;
            var view_modelos = (modalidade_config && modalidade_config.hasOwnProperty('modelos')) ? modalidade_config.modelos : false;
            var assinatura = (typeof value.config !== 'undefined' && value.config !== null && typeof value.config.assinatura !== 'undefined' && value.config.hasOwnProperty('assinatura')) ? value.config.assinatura : false;
            var statusAssinatura = (view_modelos) ? (assinatura ? 'Termo de Ades\u00E3o assinado eletronicamente por ' + assinatura[0].nome_completo + ', em ' + moment(assinatura[0].datetime, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY [\u00E0s] HH:mm') : 'Termo de Ades\u00E3o pendente de assinatura') : 'Assinatura indispon\u00EDvel';
            statusAssinatura = (status == 'FUTURO' && !assinatura)
                ? 'Dispon\u00EDvel para assinatura ap\u00F3s iniciada a vig\u00EAncia do plano'
                : statusAssinatura;
            var type_documento = !callAtiv('getOptionEntidade','tipo_vinculacao_termo') || callAtiv('getOptionEntidade','tipo_vinculacao_termo') == 1 ? 'planos' : 'termos';
            var btnAssinatura = (view_modelos) ? '<a class="newLink viewModelDoc" data-type="' + ref_assinatura + '" data-sign="true" data-user="' + value.id_user + '" data-id_reference="' + id_reference + '" data-icon="pencil-alt" data-action="view" data-mode="modelo_termo_adesao" data-title="Termo de Ades\u00E3o" data-act="atividades-call" data-fn="editModelConfigItem" style="cursor: pointer; margin: 5px;display: inline-block;" data-tip="' + statusAssinatura + '"><i class="fas fa-signature ' + (assinatura ? 'azulColor' : 'cinzaColor') + '" style="font-size: 100%;"></i> <i class="fas fa-' + (assinatura ? 'user-edit azulColor' : 'pencil-alt cinzaColor') + '" style="font-size: 100%; margin-left: -10px;"></i></a>' : '';
            btnAssinatura = (status == 'FUTURO' && !assinatura)
                ? '<a class="newLink viewModelDoc" style="cursor: pointer; margin: 5px;display: inline-block;" data-tip="' + statusAssinatura + '"><i class="fas fa-signature cinzaColor" style="font-size: 100%;"></i> <i class="fas fa-pencil-alt cinzaColor" style="font-size: 100%; margin-left: -10px;"></i></a>'
                : btnAssinatura;
            var execucao_plano = (value.tempo_proporcional > 0) ? ((value.tempo_homologado / value.tempo_proporcional) * 100).toFixed(2) + '%' : '0%';
            var produtividade_plano = (value.tempo_despendido > 0) ? ((value.tempo_pactuado / value.tempo_despendido) * 100).toFixed(2) + '%' : '0%';
            var nota_media = (typeof value.avaliacao !== 'undefined' && value.avaliacao !== null && typeof value.avaliacao.nota_atribuida !== 'undefined' && value.avaliacao.hasOwnProperty('nota_atribuida') && value.avaliacao.nota_atribuida !== null) ? value.avaliacao.nota_atribuida : '-';
            var total_avaliacoes = (typeof value.avaliacao !== 'undefined' && value.avaliacao !== null && typeof value.avaliacao.total_avaliacoes !== 'undefined' && value.avaliacao.hasOwnProperty('total_avaliacoes') && value.avaliacao.total_avaliacoes !== null) ? value.avaliacao.total_avaliacoes : '-';
            var htmlTableRelatorios = '       <tr data-tagname="SemGrupo" data-index="' + index + '">' +
                '           <td align="center">' + value.id_plano + '</td>' +
                '           <td align="center">' + status + '</td>' +
                '           <td align="center" class="filterResume_sigla_unidade">' + value.sigla_unidade + '</td>' +
                '           <td align="left" class="filterResume_nome_completo">' + value.nome_completo + '</td>' +
                '           <td align="left" class="filterResume_apelido">' + value.apelido + '</td>' +
                '           <td align="left" class="filterResume_matricula">' + value.matricula + '</td>' +
                '           <td align="left" class="filterResume_nome_modalidade">' + value.nome_modalidade + '</td>' +
                '           <td align="left" class="filterResume_carga_horaria">' + value.carga_horaria + '</td>' +
                '           <td align="left" style="text-align:center;" data-time-sorter="' + moment(value.data_inicio_vigencia, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD') + '">' + moment(value.data_inicio_vigencia, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY') + '</td>' +
                '           <td align="left" style="text-align:center;" data-time-sorter="' + moment(value.data_fim_vigencia, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD') + '">' + moment(value.data_fim_vigencia, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY') + '</td>' +
                (typeof value.data_arquivamento !== 'undefined' && value.data_arquivamento != '0000-00-00 00:00:00' ?
                    '           <td align="left" style="text-align:center;" data-time-sorter="' + moment(value.data_arquivamento, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD') + '">' + moment(value.data_arquivamento, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY') + '</td>' +
                    '' :
                    '           <td align="left" style="text-align:center;"></td>' +
                    '') +
                '           <td align="left" class="filterResume_tempo_total" style="text-align: center;">' + parseFloat(format2Decimal(value.tempo_total)) + '</td>' +
                '           <td align="left" class="filterResume_tempo_proporcional" style="text-align: center;">' + parseFloat(format2Decimal(value.tempo_proporcional)) + '</td>' +
                '           <td align="left" class="filterResume_tempo_pactuado" style="text-align: center;">' + parseFloat(value.tempo_pactuado.toFixed(2)) + '</td>' +
                '           <td align="left" class="filterResume_tempo_entregue" style="text-align: center;">' + parseFloat(value.tempo_entregue.toFixed(2)) + '</td>' +
                '           <td align="left" class="filterResume_tempo_homologado" style="text-align: center;">' + parseFloat(value.tempo_homologado.toFixed(2)) + '</td>' +
                '           <td align="left" class="filterResume_tempo_despendido" style="text-align: center;">' + parseFloat(value.tempo_despendido.toFixed(2)) + '</td>' +
                '           <td align="left" class="filterResume_quantidade_demandas" style="text-align: center;">' + value.quantidade_demandas + '</td>' +
                (callAtiv('checkOptionEntidade','exigir_homologacao_programas') ?
                    '           <td align="left" class="filterResume_quantidade_entregas" style="text-align: center;">' + (exige_entregas_programa ? value.quantidade_entregas : '-') + '</td>' +
                    '' : '') +
                '           <td align="left" class="filterResume_execucao_plano" style="text-align: center;">' + execucao_plano + '</td>' +
                (!callAtiv('checkOptionEntidade','desativa_produtividade_geral') ?
                    '           <td align="left" class="filterResume_produtividade_plano" style="text-align: center;">' + produtividade_plano + '</td>' +
                    '' : '') +
                '           <td align="left" class="filterResume_nota_media" style="text-align: center;">' + nota_media + '</td>' +
                '           <td align="left" class="filterResume_total_avaliacoes" style="text-align: center;">' + total_avaliacoes + '</td>' +
                '           <td align="left" style="text-align: center;">' + btnAssinatura + '</td>' +
                '           <td align="left" style="">' + statusAssinatura + '</td>' +
                '       </tr>';
        } else if (type == 'atividades') {
            var status = (moment(value.data_fim, 'YYYY-MM-DD HH:mm:ss') < moment() && value.data_fim != '0000-00-00 00:00:00') ? 'DESATIVADO' : 'ATIVO';
            status = (moment(value.data_fim_vigencia, 'YYYY-MM-DD HH:mm:ss') < moment()) ? 'ENCERRADO' : status;
            status = (moment(value.data_inicio_vigencia, 'YYYY-MM-DD HH:mm:ss') > moment()) ? 'FUTURO' : status;

            var data_inicio = (value.data_inicio != '0000-00-00 00:00:00' ? moment(value.data_inicio, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD') : '0000-00-00');
            var data_inicio_br = (value.data_inicio != '0000-00-00 00:00:00' ? moment(value.data_inicio, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY') : '-');
            var data_fim = (value.data_fim != '0000-00-00 00:00:00' ? moment(value.data_fim, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD') : '0000-00-00');
            var data_fim_br = (value.data_fim != '0000-00-00 00:00:00' ? moment(value.data_fim, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY') : '-');
            var entregas = (value.config !== null && typeof value.config.entregas !== 'undefined' && value.config.entregas !== null) ? value.config.entregas : false;
            entregas = entregas && entregas.length ? $.map(entregas, function (v) { return unicodeToChar(v[0]) }).join(', ') : entregas;
            var parametros = (value.config !== null && typeof value.config.parametros !== 'undefined' && value.config.parametros !== null) ? value.config.parametros : false;
            parametros = parametros && parametros.length ? $.map(parametros, function (v) { return unicodeToChar(v[0]) }).join(', ') : parametros;
            var tipo_processo = (value.config !== null && typeof value.config.tipo_processo !== 'undefined' && value.config.tipo_processo !== null) ? value.config.tipo_processo : false;
            tipo_processo = tipo_processo && tipo_processo.length ? $.map(tipo_processo, function (v) { return unicodeToChar(v[0]) }).join(', ') : tipo_processo;
            var complexidade = (value.config !== null && typeof value.config.complexidade !== 'undefined' && value.config.complexidade !== null) ? value.config.complexidade : false;
            complexidade = complexidade ? $.map(complexidade, function (v, i) {
                return unicodeToChar(v.complexidade) + ': ' + parseFloat((v.fator * value.tempo_pactuado).toFixed(2)) + ' hora(s)' + (v.default ? ' (Padr\u00E3o)' : '') + '<br>';
            }).join('') : complexidade;
            var tempo_minimo = (value.config !== null && typeof value.config.tempo_minimo !== 'undefined' && value.config.tempo_minimo !== null) ? value.config.tempo_minimo : false;

            var htmlTableRelatorios = '       <tr data-tagname="SemGrupo" data-index="' + index + '">' +
                '           <td align="center">' + value.id_atividade + '</td>' +
                '           <td align="center">' + status + '</td>' +
                '           <td align="left">' + value.nome_atividade + '</td>' +
                '           <td align="left">' + value.macroatividade + '</td>' +
                '           <td align="left">' + value.sigla_unidade + '</td>' +
                '           <td align="left">' + value.nome_processo + '</td>' +
                '           <td align="center" class="filterResume_tempo_pactuado">' + value.tempo_pactuado + '</td>' +
                '           <td align="center" class="filterResume_dias_planejado">' + value.dias_planejado + '</td>' +
                '           <td align="left">' + (entregas ? entregas : '') + '</td>' +
                '           <td align="left">' + (parametros ? parametros : '') + '</td>' +
                '           <td align="left">' + (complexidade ? complexidade : '') + '</td>' +
                '           <td align="left" style="text-align:center;" data-time-sorter="' + data_inicio + '">' + data_inicio_br + '</td>' +
                '           <td align="left" style="text-align:center;" data-time-sorter="' + data_fim + '">' + data_fim_br + '</td>' +
                '           <td align="center">' + (value.recalcula_prazo ? 'Sim' : '') + '</td>' +
                '           <td align="center" class="filterResume_tempo_minimo">' + (tempo_minimo ? tempo_minimo : '') + '</td>' +
                '           <td align="left">' + (tipo_processo ? tipo_processo : '') + '</td>' +
                '           <td align="center">' + (value.homologado ? 'Sim' : '') + '</td>' +
                '       </tr>';
        } else if (type == 'afastamentos') {
            var status = (moment(value.fim_afastamento, 'YYYY-MM-DD HH:mm:ss') < moment()) ? 'ENCERRADO' : status;
            status = (moment(value.inicio_afastamento, 'YYYY-MM-DD HH:mm:ss') > moment()) ? 'FUTURO' : status;

            var data_inicio = (value.inicio_afastamento != '0000-00-00 00:00:00' ? moment(value.inicio_afastamento, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm') : '0000-00-00');
            var data_inicio_br = (value.inicio_afastamento != '0000-00-00 00:00:00' ? moment(value.inicio_afastamento, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY HH:mm') : '-');
            var data_fim = (value.fim_afastamento != '0000-00-00 00:00:00' ? moment(value.fim_afastamento, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm') : '0000-00-00');
            var data_fim_br = (value.fim_afastamento != '0000-00-00 00:00:00' ? moment(value.fim_afastamento, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY HH:mm') : '-');

            var htmlTableRelatorios = '       <tr data-tagname="SemGrupo" data-index="' + index + '">' +
                '           <td align="center">' + value.id_afastamento + '</td>' +
                '           <td align="center">' + status + '</td>' +
                '           <td align="left">' + value.nome_completo + '</td>' +
                '           <td align="left">' + value.matricula + '</td>' +
                '           <td align="left">' + value.nome_motivo + '</td>' +
                '           <td align="left">' + value.observacoes + '</td>' +
                '           <td align="left" style="text-align:center;" data-time-sorter="' + data_inicio + '">' + data_inicio_br + '</td>' +
                '           <td align="left" style="text-align:center;" data-time-sorter="' + data_fim + '">' + data_fim_br + '</td>' +
                '       </tr>';
        } else if (type == 'produtividade') {
            var htmlTableRelatorios = '       <tr data-tagname="SemGrupo" data-index="' + index + '">' +
                '           <td align="left">' + value.nome_completo + '</td>' +
                '           <td align="center">' + value.matricula + '</td>' +
                '           <td align="left">' + value.nome_unidade + ' - ' + value.sigla_unidade + '</td>' +
                '           <td align="left">' + getDatesFormatBR(value.data_distribuicao) + ' \u00E0 ' + getDatesFormatBR(value.data_entrega) + '</td>' +
                '           <td align="center">' + (value.nota_atribuida ? parseFloat(value.nota_atribuida).toLocaleString('pt-br', { minimumFractionDigits: 2 }) : '') + '</td>' +
                '           <td align="center">' + (value.total_avaliacoes ? parseInt(value.total_avaliacoes).toLocaleString('pt-br') : '') + '</td>' +
                '           <td align="center">' + (value.produtividade_despendida ? parseFloat((value.produtividade_despendida * 100).toFixed(2)).toLocaleString('pt-br', { minimumFractionDigits: 2 }) + '%' : '') + '</td>' +
                '           <td align="center">' + (value.produtividade_executada ? parseFloat((value.produtividade_executada * 100).toFixed(2)).toLocaleString('pt-br', { minimumFractionDigits: 2 }) + '%' : '') + '</td>' +
                '       </tr>';
        } else if (type == 'prescricoes') {
            var linkProc = !value.id_procedimento ? '' : url_host + '?acao=procedimento_trabalhar&id_procedimento=' + value.id_procedimento;
            linkProc = value.processo_sei && linkProc == '' ? url_host.replace('controlador.php', '') + '#' + value.processo_sei : linkProc;
            var iconProcesso = ($.inArray(value.processo_sei, arrayProcessosUnidade) == -1) ? 'fas fa-folder' : 'far fa-folder-open';
            var processoHtml = (value.processo_sei !== null && value.processo_sei != '')
                ? '               <a ' + (linkProc == '' ? 'style="cursor: auto;"' : 'style="text-decoration: underline;" class="bLink" href="' + linkProc + '" target="_blank"') + '>' +
                '                   <i class="' + iconProcesso + ' ' + (linkProc == '' ? '' : 'bLink') + '" ' + (linkProc == '' ? 'style="color: #a2a2a2;"' : 'style="text-decoration: underline;"') + '></i> ' +
                '                   <span ' + (linkProc == '' ? '' : 'class="bLink"') + '></i> ' +
                '                       ' + value.processo_sei +
                '                   </span>' +
                '               </a>'
                : '';

            var linkDoc = !value.id_documento_sei ? '' : url_host + '?acao=procedimento_trabalhar&id_procedimento=' + value.id_procedimento + '&id_documento=' + value.id_documento_sei;
            var documentoHtml = !value.documento_relacionado ? '' :
                '               <a ' + (linkDoc == '' ? 'style="cursor: auto;"' : 'style="text-decoration: underline;" class="bLink" href="' + linkDoc + '" target="_blank"') + '>' +
                '                   <i class="fas fa-list-alt ' + (linkDoc == '' ? '' : 'bLink') + '" ' + (linkDoc == '' ? 'style="color: #a2a2a2;"' : 'style="text-decoration: underline;"') + ' data-tip="' + value.documento_relacionado + '"></i> ' +
                '                   <span ' + (linkDoc == '' ? '' : 'class="bLink"') + '></i> ' +
                '                       ' + value.documento_relacionado +
                '                   </span>' +
                '               </a>';

            var porcentagem = parseFloat(((value.tempo_decorrido / value.prazo) * 100).toFixed(2));

            var htmlTableRelatorios = '       <tr data-tagname="SemGrupo" data-index="' + index + '">' +
                '           <td align="center">' + processoHtml + '</td>' +
                '           <td align="left">' + value.nome_prescricao + '</td>' +
                '           <td align="left">' + (value.suspensao ? 'Suspenso' : (value.data_fim == '0000-00-00 00:00:00' ? 'Em decurso' : 'Encerrado')) + '</td>' +
                '           <td align="center">' + value.prazo + '</td>' +
                '           <td align="center">' + value.tempo_decorrido + '</td>' +
                '           <td align="center">' + porcentagem.toLocaleString('pt-BR') + '</td>' +
                '           <td align="center">' + documentoHtml + '</td>' +
                '           <td align="center">' + getDatesFormatBR(value.data_inicio) + '</td>' +
                '       </tr>';
        } else if (type == 'email') {
            var htmlTableRelatorios = '       <tr data-tagname="SemGrupo" data-index="' + index + '">' +
                '           <td align="center">' + value.id_email + '</td>' +
                '           <td align="center">' + value.id_user + '</td>' +
                '           <td align="left">' + value.nome_completo + '</td>' +
                '           <td align="center">' + value.acao + '</td>' +
                '           <td align="left">' + value.assunto + '</td>' +
                '           <td align="center">' + getDatesFormatBR(value.datetime) + '</td>' +
                '           <td align="left" class="message-content">' + value.mensagem + '</td>' +
                '           <td align="center">' + value.table_ref + '</td>' +
                '           <td align="center">' + value.id_ref + '</td>' +
                '       </tr>';
        } else if (type == 'log') {
            var htmlTableRelatorios = '       <tr data-tagname="SemGrupo" data-index="' + index + '">' +
                '           <td align="center">' + value.id_log + '</td>' +
                '           <td align="center">' + value.id_user + '</td>' +
                '           <td align="left">' + value.nome_completo + '</td>' +
                '           <td align="center">' + value.acao + '</td>' +
                '           <td align="left">' + value.capacidade + '</td>' +
                '           <td align="center">' + getDatesFormatBR(value.datetime) + '</td>' +
                '           <td align="center">' + value.table_ref + '</td>' +
                '           <td align="center">' + value.id_ref + '</td>' +
                '       </tr>';
        }

        var label_id = getLabIdTables(type);

        var tr_report = tableReportBody.find('tr[data-id="' + value['id_' + label_id] + '"]');
        if (tr_report.length > 0) {
            tr_report.before(htmlTableRelatorios).remove();
        } else {
            tableReportBody.append(htmlTableRelatorios);
        }
    }
    function initRowsPanelRelatorios(index) {
        loadRowsPanelReport = true;
        var totaldados = storeRelatorios.length;
        var caption = tableReport.find('caption.infraCaption');
        var numRegistros = caption.find('span.count');
        numRegistros = (numRegistros.length > 0) ? parseInt(numRegistros.text()) + totaldados : 0;
        if (offset) caption.find('span.count').text(numRegistros);
        setTimeout(() => {
            if (totaldados - 1 <= index && !caption.find('a.cancel').is(':visible')) {
                loadRowsPanelReport = false;
                setTimeout(() => { if (!loadRowsPanelReport) { tableReport.trigger('updateAll') } }, 1000);
            }
        }, 1000);
    }
    var limit = 100;
    var time = offset + 200;
    storeRelatorios.forEach(function (value, index) {
        if (index >= limit) {
            setTimeout(function () {
                setRowsPanelRelatorios(value, index);
                if (storeRelatorios.length - 1 == index || index % 100 == 0) {
                    initRowsPanelRelatorios(index);
                }
            }, time * index);
        } else {
            setRowsPanelRelatorios(value, index);
            loadRowsPanelReport = false;
        }
    });
    if (storeRelatorios.length <= limit) { initRowsPanelRelatorios(100) }
    // initEditPanelRelatorios(tableReport);
}
export function initEditPanelRelatorios(tableReport) {
    reportEditor = new SimpleTableCellEditor(tableReport);
    // console.log(tableReport, reportEditor);
    reportEditor.SetEditableClass("editCellSelect", {
        internals: {
            renderEditor: (elem, oldVal) => {
                var data = $(elem).data();
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
    reportEditor.on("cell:edited", function (event) {
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
            if (typeof event.newValue !== 'undefined') {
                // console.log(_this, type, value, data, data_tr);
                // updateConfigServerInline(_this, type, value, data, data_tr);
            }
        }
    });
}
