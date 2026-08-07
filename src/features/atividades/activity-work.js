import { callAtiv } from './call.js';
/**
 * Atividades — criação, edição e recorrência de demandas.
 *
 * Esta fatia mantém apenas a superfície legada necessária durante a migração.
 * O estado compartilhado é instalado por runtime.js e os nomes antigos são
 * publicados exclusivamente por legacy-api.js.
 */
import { getServerAtividades } from './server.js';
import { getNameGenre } from '../../shared/nomenclatura.js';

export function initFunctionsPanelAtiv(TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    if (typeof $('.atividadeTagsPro').tagsInput !== 'undefined' &&
        typeof $('.tabelaPanelScroll').resizable !== 'undefined' &&
        typeof $().tablesorter !== 'undefined' &&
        typeof $('.ui-autocomplete-input').autocomplete !== 'undefined') {

        var tabelaAtiv = $('#tabelaAtivPanel table.tableAtividades');

        if (tabelaAtiv.length) {
            initChosenReplace('panel');
            getAtividadeTagsPro();
            initNewTabProcesso();

            function getFilterTableAtiv(elem) {
                var _this = $(elem);
                var data = _this.data();
                var _return = $(elem).text();
                if (data.type == 'proc') {
                    var id = $(elem).find('.type-id').text().replace('#', '');
                    var target = $(elem).find('a').not('.followLink').eq(0);
                    var texttip_span = target.find('span').attr('data-tip') || target.find('span').attr('onmouseover');
                    texttip_span = (typeof texttip_span !== 'undefined' && texttip_span !== false)
                        ? (String(texttip_span).indexOf('infraTooltipMostrar') >= 0 ? extractTooltip(texttip_span) : texttip_span)
                        : '';
                    var texttip_i = target.find('i').attr('data-tip') || target.find('i').attr('onmouseover');
                    texttip_i = (typeof texttip_i !== 'undefined' && texttip_i !== false)
                        ? (String(texttip_i).indexOf('infraTooltipMostrar') >= 0 ? extractTooltip(texttip_i) : texttip_i)
                        : '';
                    _return = id + ' ' + target.text().trim() + ' ' + texttip_span + ' ' + texttip_i;
                } else if (data.type == 'date') {
                    var target = $(elem).find('.dateboxDisplay').eq(0);
                    var text_date = target.data('time-sorter');
                    _return = text_date;
                }
                return _return;
            }

            tabelaAtiv.tablesorter({
                sortLocaleCompare: true,
                textExtraction: {
                    1: function (elem, table, cellIndex) {
                        return getFilterTableAtiv(elem);
                    },
                    2: function (elem, table, cellIndex) {
                        return getFilterTableAtiv(elem);
                    },
                    3: function (elem, table, cellIndex) {
                        return getFilterTableAtiv(elem);
                    },
                    4: function (elem, table, cellIndex) {
                        return getFilterTableAtiv(elem);
                    },
                    5: function (elem, table, cellIndex) {
                        return getFilterTableAtiv(elem);
                    },
                    6: function (elem, table, cellIndex) {
                        return getFilterTableAtiv(elem);
                    }
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
                    4: { filter: true }
                }
            }).on("sortEnd", function (event, data) {
                checkboxRangerSelectShift();
                repareStickColumnsSortable(tabelaAtiv, true);
            }).on("filterEnd", function (event, data) {
                var caption = $(this).find("caption").eq(0);
                var tx = caption.text();
                caption.text(tx.replace(/\d+/g, data.filteredRows));
                $(this).find("tbody > tr:visible > td > input").prop('disabled', false);
                $(this).find("tbody > tr:hidden > td > input").prop('disabled', true);
            });

            var filterAtiv = tabelaAtiv.find('.tablesorter-filter-row').get(0);
            if (typeof filterAtiv !== 'undefined') {
                var observerFilterAtiv = new MutationObserver(function (mutations) {
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
                    var selectFilterTable = callAtiv('getSelectViewControl','tabelaAtivPanel');
                    var topPosition = (typeof arrayConfigAtividades.perfil.id_user !== 'undefined' && jmespath.search(arrayConfigAtividades.planos, "[?id_user==`" + arrayConfigAtividades.perfil.id_user + "`] | [0]") !== null) ? '140px' : '52px';
                    var htmlFlashFilterTable = '<div class="filterTablePro filterTableAtivStatus seipro-atividades-filter-status" style="position: absolute;top: ' + topPosition + ';text-align: right;right: 320px;z-index: 9999;">' +
                        '   <span class="info_dates_monitorado" style="margin: 0; margin-right: 20px;">' +
                        '       <span class="dateboxDisplay tag-remove filterTagClean" data-tip="Limpar Filtros" data-act="atividades-composite" data-chain="filterTagView|filterReset" data-scope="parent" style="display:none; font-size: 9pt;padding: 3px 10px;background-color: #f9fafa;">' +
                        '           <span class="dateBoxIcon">' +
                        '               <i class="fas fa-eraser" style="color: #9d9d9d; padding-right: 3px; cursor: pointer; font-size: 12pt;"></i>' +
                        '           </span>' +
                        '           <span class="text">Limpar Filtros</span>' +
                        '       </span>' +
                        '       <span class="dateboxDisplay tagTableText_date_noprazo" data-tip="Filtrar demandas no prazo" data-colortag="#eef4f9" data-tagname="date_noprazo" data-nametag="No prazo" data-type="date" data-act="atividades-call" data-fn="filterTagView" data-scope="parent" style="font-size: 9pt;padding: 3px 10px;background-color: #f9fafa;">' +
                        '           <span class="dateBoxIcon">' +
                        '               <i class="far fa-clock" style="color: #4285f4; padding-right: 3px; cursor: pointer; font-size: 12pt;"></i>' +
                        '           </span>' +
                        '           <span class="text">No prazo (' + tabelaAtiv.find('tbody tr.tagTableName_date_noprazo').length + ')</span>' +
                        '       </span>' +
                        '       <span class="dateboxDisplay tagTableText_date_atrasado" data-tip="Filtrar demandas atrasadas" data-colortag="#f9e2e0" data-tagname="date_atrasado" data-nametag="Atrasada" data-type="date" data-act="atividades-call" data-fn="filterTagView" data-scope="parent" style="font-size: 9pt;padding: 3px 10px;background-color: #f9fafa;">' +
                        '           <span class="dateBoxIcon">' +
                        '               <i class="fas fa-exclamation-triangle vermelhoColor" style="color: #4285f4; padding-right: 3px; cursor: pointer; font-size: 12pt;"></i>' +
                        '           </span>' +
                        '           <span class="text">Atrasadas (' + tabelaAtiv.find('tbody tr.tagTableName_date_atrasado').length + ')</span>' +
                        '       </span>' +
                        '       <span class="dateboxDisplay tagTableText_date_entregue" data-tip="Filtrar demandas entregues" data-colortag="#ddf1dd" data-tagname="date_entregue" data-nametag="Entregue" data-type="date" data-act="atividades-call" data-fn="filterTagView" data-scope="parent" style="font-size: 9pt;padding: 3px 10px;background-color: #f9fafa;">' +
                        '           <span class="dateBoxIcon">' +
                        '               <i class="fas fa-check-circle verdeColor" style="color: #4285f4; padding-right: 3px; cursor: pointer; font-size: 12pt;"></i>' +
                        '           </span>' +
                        '           <span class="text">Entregues (' + tabelaAtiv.find('tbody tr.tagTableName_date_entregue').length + ')</span>' +
                        '       </span>' +
                        '       <span class="dateboxDisplay tagTableText_date_avaliado" data-tip="Filtrar demandas avaliadas" data-colortag="#f1ecdd" data-tagname="date_avaliado" data-nametag="Avaliada" data-type="date" data-act="atividades-call" data-fn="filterTagView" data-scope="parent" style="font-size: 9pt;padding: 3px 10px;background-color: #f9fafa;">' +
                        '           <span class="dateBoxIcon">' +
                        '               <i class="fas fa-star starGold" style="color: #4285f4; padding-right: 3px; cursor: pointer; font-size: 12pt;"></i>' +
                        '           </span>' +
                        '           <span class="text">Avaliadas (' + tabelaAtiv.find('tbody tr.tagTableName_date_avaliado').length + ')</span>' +
                        '       </span>' +
                        '   </span>' +
                        '   ' + selectFilterTable +
                        '</div>';

                    var htmlFilterAtiv = '<div class="btn-group filterTablePro" role="group" style="right: 55px;top: ' + topPosition + ';z-index: 9999;position: absolute;">' +
                        '   <button type="button" data-tip="Baixar" data-act="atividades-call" data-fn="downloadTablePro" data-icon="fas fa-download" style="padding: 0.1rem .5rem; font-size: 9pt;" data-value="Baixar" class="btn btn-sm btn-light">' +
                        '       <i class="fas fa-download" style="padding-right: 3px; cursor: pointer; font-size: 10pt; color: #888;"></i>' +
                        '       <span class="text">Baixar</span>' +
                        '   </button>' +
                        '   <button type="button" data-tip="Copiar" data-act="atividades-call" data-fn="copyTablePro" data-icon="fas fa-copy" style="padding: 0.1rem .5rem; font-size: 9pt;" data-value="Copiar" class="btn btn-sm btn-light">' +
                        '       <i class="fas fa-copy" style="padding-right: 3px; cursor: pointer; font-size: 10pt; color: #888;"></i>' +
                        '       <span class="text">Copiar</span>' +
                        '   </button>' +
                        '   <button type="button" data-tip="Pesquisar" data-act="atividades-call" data-fn="filterTablePro" style="padding: 0.1rem .5rem; font-size: 9pt;" data-value="Pesquisar" class="btn btn-sm btn-light ' + (tabelaAtiv.find('tr.tablesorter-filter-row').hasClass('hideme') ? '' : 'active') + '">' +
                        '       <i class="fas fa-search" style="padding-right: 3px; cursor: pointer; font-size: 10pt; color: #888;"></i>' +
                        '       <span class="text">Pesquisar</span>' +
                        '   </button>' +
                        '</div>';
                    tabelaAtiv.find('thead .filterTablePro').remove();
                    tabelaAtiv.find('thead').prepend(htmlFlashFilterTable + htmlFilterAtiv);
                    observerFilterAtiv.observe(filterAtiv, {
                        attributes: true
                    });
                    if (typeof $().chosen !== 'undefined') {
                        $('#selectViewControl_tabelaAtivPanel').chosen({
                            placeholder_text_single: ' ',
                            no_results_text: 'Nenhum resultado encontrado',
                            normalize_search_text: function (text) {
                                return removeAcentos(text.toLowerCase());
                            }
                        });
                        forcePlaceHoldChosen();
                        setResizeAreaTelaD();
                    }
                }, 300);
                if (typeof $().visible == 'undefined') $.getScript(URL_SPRO + "js/lib/jquery-visible.min.js");
            }

            var tagName = getOptionsPro('filterTag_atividades');
            if (typeof tagName !== 'undefined' && tagName != '') {
                setTimeout(function () {
                    $('.tableAtividades .tagTableText_' + tagName).eq(0).trigger('click');
                }, 500);
            } else if (tagName == '' && (callAtiv('checkCapacidade','only_self_atividades') && !setOptionsPro('filterTag_removed'))) {
                var tagName_thisUser = normalizeNameTag(arrayConfigAtividades.perfil.apelido);
                setTimeout(function () {
                    $('.tableAtividades .tagTableText_' + tagName_thisUser).eq(0).trigger('click');
                }, 500);
            }

            var observerTableAtiv = new MutationObserver(function (mutations, observer) {
                // observer.disconnect();
                var _this = $(mutations[0].target);
                var _parent = _this.closest('table');
                var idsSelected = _parent.find('tr.infraTrMarcada').map(function () { return $(this).data('index') }).get();
                var iconsCount = { start: [], complete: [], rate: [], send: [], all: [] };

                $.each(arrayAtividadesPro, function (index, value) {
                    if ($.inArray(value.id_demanda, idsSelected) !== -1) {
                        if (!callAtiv('checkLimitAvaliacaoSubordinada',value) && checkPermissionAtiv(value) && value.data_inicio == '0000-00-00 00:00:00') {
                            iconsCount.start.push({ id: value.id_demanda, id_unidade: value.id_unidade });
                        } else if (!callAtiv('checkLimitAvaliacaoSubordinada',value) && checkPermissionAtiv(value) && value.data_inicio != '0000-00-00 00:00:00' && value.data_entrega == '0000-00-00 00:00:00') {
                            iconsCount.complete.push({ id: value.id_demanda, id_unidade: value.id_unidade });
                        } else if (!callAtiv('checkLimitAvaliacaoSubordinada',value) && checkPermissionAtiv(value) && value.data_inicio != '0000-00-00 00:00:00' && value.data_entrega != '0000-00-00 00:00:00' && value.data_avaliacao == '0000-00-00 00:00:00') {
                            iconsCount.rate.push({ id: value.id_demanda, id_unidade: value.id_unidade });
                        } else if (!callAtiv('checkLimitAvaliacaoSubordinada',value) && checkPermissionAtiv(value) && value.data_inicio != '0000-00-00 00:00:00' && value.data_entrega != '0000-00-00 00:00:00' && value.data_avaliacao != '0000-00-00 00:00:00') {
                            iconsCount.send.push({ id: value.id_demanda, id_unidade: value.id_unidade });
                        }
                        if (checkPermissionAtiv(value)) iconsCount.all.push({ id: value.id_demanda, id_unidade: value.id_unidade });
                    }
                });
                // console.log(iconsCount);

                $('#atividadesProActions').find('.iconBoxAtividade').data('list', false).find('.fa-layers-counter').text('').hide();
                $('#atividadesProActions').find('.iconBoxAtividade:visible').each(function () {
                    if ($(this).hasClass('iconAtividade_start') && iconsCount.start.length != 0) {
                        $(this).data('list', iconsCount.start).find('.fa-layers-counter').text(iconsCount.start.length).show();
                    } else if ($(this).hasClass('iconAtividade_complete') && iconsCount.complete.length != 0) {
                        $(this).data('list', iconsCount.complete).find('.fa-layers-counter').text(iconsCount.complete.length).show();
                    } else if ($(this).hasClass('iconAtividade_rate') && iconsCount.rate.length != 0) {
                        $(this).data('list', iconsCount.rate).find('.fa-layers-counter').text(iconsCount.rate.length).show();
                    } else if ($(this).hasClass('iconAtividade_send') && iconsCount.send.length != 0) {
                        $(this).data('list', iconsCount.send).find('.fa-layers-counter').text(iconsCount.send.length).show();
                    } else if ($(this).hasClass('iconAtividade_delete') && iconsCount.start.length != 0 && !callAtiv('checkPerfilNivelAdm',)) {
                        $(this).data('list', iconsCount.start).find('.fa-layers-counter').text(iconsCount.start.length).show();
                    } else if ($(this).hasClass('iconAtividade_delete') && callAtiv('checkPerfilNivelAdm',) && iconsCount.all.length != 0) {
                        $(this).data('list', iconsCount.all).find('.fa-layers-counter').text(iconsCount.all.length).show();
                    }
                });
                // console.log('observerTableAtiv');
            });
            setTimeout(function () {
                if (tabelaAtiv.length > 0) {
                    observerTableAtiv.observe(tabelaAtiv[0], {
                        attributes: true,
                        childList: true,
                        subtree: true
                    });
                    checkboxRangerSelectShift();
                }
                forcePlaceHoldChosen();
                // dragColumnTable(tabelaAtiv);
                if (getOptionsPro('panelSortColumnsPro')) {
                    dragColumnTable(tabelaAtiv);
                }
            }, 500);

            initPanelResize('#atividadesProDiv .tabelaPanelScroll', 'atividadesPro');
            callAtiv('getInsertIconAtividade',);
            checkboxRangerSelectShift();
            setResizeAreaTelaD();
        }
    } else {
        if (typeof $().tagsInput === 'undefined') { $.getScript((URL_SPRO + "js/lib/jquery.tagsinput-revisited.js")) }
        if (typeof $().tablesorter === 'undefined') { $.getScript((URL_SPRO + "js/lib/jquery.tablesorter.combined.min.js")) }
        setTimeout(function () {
            initFunctionsPanelAtiv(TimeOut - 100);
            if (typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage')) console.log('Reload initFunctionsPanelAtiv');
        }, 500);
    }
}
export function changeReportPrograma(this_) {
    var _this = $(this_);
    var type = _this.data('type');
    var _parent = _this.closest('.filterTablePro');
    var data = _this.find('option:selected').data();
    data = (typeof data !== 'undefined' && data !== null) ? data : false;
    var id_programa = (typeof _this !== 'undefined' && _this.val() !== null) ? _this.val() : 0;

    var _param = { id_programa: id_programa };
    _parent.find('.loadChartUserAtiv').remove();
    _parent.prepend('<i class="fas fa-spinner fa-spin loadChartUserAtiv" style="float: right; font-size: 12pt; margin: 5px;"></i>');

    setOptionsPro('selectReport_' + type, _param);
    callAtiv('getTabReport',type, 'get');
    $('#tableRelatorio_' + type + ' tbody').html('');
    $('#tableRelatorio_' + type + ' caption.infraCaption span.count').text('0');
}
export function getAtividadeTagsPro() {
    if (typeof $('.atividadeTagsPro').tagsInput !== 'undefined') {
        $('.atividadeTagsPro').tagsInput({
            interactive: true,
            placeholder: 'Adicionar etiqueta',
            minChars: 2,
            maxChars: 100,
            limit: 8,
            autocomplete_url: '',
            autocomplete: { 'source': sugestEtiquetaPro('ativ') },
            hide: true,
            delimiter: [';'],
            unique: true,
            removeWithBackspace: true,
            onAddTag: saveFollowEtiqueta,
            onRemoveTag: saveFollowEtiqueta,
            onChange: saveFollowEtiqueta
        });
    }
}
export function checkPermissionAtiv(value) {
    return ((callAtiv('checkCapacidade','edit_atividade') && !callAtiv('checkCapacidade','only_self_atividades')) || (callAtiv('checkCapacidade','only_self_atividades') && value.id_user == parseInt(arrayConfigAtividades.perfil.id_user))) ? true : false
}
export function checkPermissionAfast(value, capacidade) {
    return ((callAtiv('checkCapacidade',capacidade) && !callAtiv('checkCapacidade','only_self_afastamentos')) || (callAtiv('checkCapacidade','only_self_afastamentos') && value.id_user == parseInt(arrayConfigAtividades.perfil.id_user))) ? true : false
}
// BOX DE DEMANDA SIMPLIFICADA
export function saveAtividadeSimple(id_demanda = 0) {
    var checkPlanos = (typeof arrayConfigAtividades.planos !== 'undefined' && arrayConfigAtividades.planos != 0 && arrayConfigAtividades.planos.length > 0) ? true : false;
    if (!checkPlanos) {
        alertaBoxPro('Error', 'exclamation-triangle', 'Nenhum plano de trabalho ativo!');
    } else {
        var value = callAtiv('getAtividadeData',id_demanda);
        var unidades = (typeof arrayConfigAtividades.atividades !== 'undefined' && arrayConfigAtividades.atividades != 0 && arrayConfigAtividades.atividades.length > 0)
            ? uniqPro(jmespath.search(arrayConfigAtividades.atividades, "[?sigla_unidade].sigla_unidade"))
            : [];
        var countUnidades = (arrayConfigAtividades.atividades.length > 0) ? unidades.length : 0;
        var unidadesPlanos = (checkPlanos)
            ? uniqPro(jmespath.search(arrayConfigAtividades.planos, "[?sigla_unidade].sigla_unidade"))
            : [];
        var countUnidadesPlanos = (checkPlanos) ? unidadesPlanos.length : 0;
        var config_unidade = callAtiv('getConfigDadosUnidade',(id_demanda != 0 ? value.sigla_unidade : null));
        var dadosIfrArvore = getIfrArvoreDadosProcesso();
        if (value) {
            var dataDistribuicao = moment(value.data_distribuicao, 'YYYY-MM-DD HH:mm:ss').format(config_unidade.hora_format);
            var prazoEntrega = moment(value.prazo_entrega, 'YYYY-MM-DD HH:mm:ss').format(config_unidade.hora_format);
        } else {
            var dt_init = (dadosIfrArvore && dadosIfrArvore.data_documento && dadosIfrArvore.data_documento != '')
                ? moment(dadosIfrArvore.data_documento, 'DD/MM/YYYY HH:mm') : moment();
            var hr_init = dt_init.format('HH:mm');
            var dataDistribuicao = dt_init.format(config_unidade.hora_format);
            dataDistribuicao = (moment(hr_init, 'HH:mm') > moment(config_unidade.h_util_fim, 'HH:mm'))
                ? moment(dt_init.format('YYYY-MM-DD') + 'T' + config_unidade.h_util_fim).add(-1, 'hours').format(config_unidade.hora_format)
                : dataDistribuicao;
            dataDistribuicao = (moment(hr_init, 'HH:mm') < moment(config_unidade.h_util_inicio, 'HH:mm'))
                ? moment(dt_init.format('YYYY-MM-DD') + 'T' + config_unidade.h_util_inicio).format(config_unidade.hora_format)
                : dataDistribuicao;
            var prazoEntrega = dt_init.add(1, 'days').format(config_unidade.hora_format);
            prazoEntrega = (moment(hr_init, 'HH:mm') > moment(config_unidade.h_util_fim, 'HH:mm'))
                ? moment(dt_init.format('YYYY-MM-DD') + 'T' + config_unidade.h_util_fim).format(config_unidade.hora_format)
                : prazoEntrega;
            prazoEntrega = (moment(hr_init, 'HH:mm') < moment(config_unidade.h_util_inicio, 'HH:mm'))
                ? moment(dt_init.format('YYYY-MM-DD') + 'T' + config_unidade.h_util_inicio).add(1, 'hours').format(config_unidade.hora_format)
                : prazoEntrega;
        }

        var optionSelectResponsavel = '';
        if (countUnidadesPlanos > 1) {
            $.each(unidadesPlanos, function (index, v) {
                var arrayResp = jmespath.search(arrayConfigAtividades.planos, "[?sigla_unidade=='" + v + "'] | [?vigencia==`true`]");
                optionSelectResponsavel += '<optgroup label="' + v + '">';
                optionSelectResponsavel += callAtiv('getOptionsSelectResp',arrayResp, value);
                optionSelectResponsavel += '</optgroup>';
            });
        } else {
            var arrayResp = jmespath.search(arrayConfigAtividades.planos, "[?vigencia==`true`]");
            optionSelectResponsavel += callAtiv('getOptionsSelectResp',arrayResp, value);
        }

        var dadosMultProcessos = (
            dadosIfrArvore &&
            dadosIfrArvore.processos &&
            dadosIfrArvore.processos[0].id_procedimento != dadosIfrArvore.id_procedimento
        )
            ? dadosIfrArvore.processos
            : getProcessoUnidadePro(true).length > 0
                ? getProcessoUnidadePro(true, true)
                : false;
        var checkProcessoHome = (!value && !dadosIfrArvore && dadosMultProcessos && dadosMultProcessos.length > 0) ? true : false;
        var htmlMultProcessos = '';
        if (dadosMultProcessos) {
            htmlMultProcessos += '<div class="listMultProcessos seipro-atividades-processos-list">';
            $.each(dadosMultProcessos, function (index, value) {
                htmlMultProcessos += '<span class="ativProcessos seipro-atividades-processos" data-procedimento="' + value.id_procedimento + '" data-processo="' + value.processo_sei + '">' +
                    '   <i class="fas fa-folder-open cinzaColor" style="font-size: 9pt;margin-right: 5px;"></i>' +
                    '   ' + value.processo_sei +
                    '   <i class="fas fa-times vermelhoColor"  data-act="atividades-call" data-fn="multProcessRemove" style="font-size: 9pt;margin-left: 5px;cursor: pointer;user-select: none;"></i>' +
                    '</span>';
            })
            htmlMultProcessos += "<input type='hidden' id='ativ_id_procedimentos' data-key='id_procedimentos' data-param='id_procedimentos' value='[]'>";
            htmlMultProcessos += '</div>';
        }

        var selectResponsavel = '<select id="ativ_id_user" data-key="id_user" ' + (callAtiv('checkOptionEntidade','exigir_atribuicao_demandas') ? 'class="requiredSelect"' : '') + ' data-type="user" data-act="atividades-call" data-fn="updateAtivSelectUser"><option>&nbsp;</option>' + optionSelectResponsavel + '</select>';
        // var prazoDemandasRetroativas = checkOptionEntidade('limitar_demandas_retroativas') && checkOptionEntidade('prazo_demandas_retroativas') ? getOptionEntidade('prazo_demandas_retroativas') : false;
        // var minDataDistribuicao = prazoDemandasRetroativas ? 'min="'+moment().add(-prazoDemandasRetroativas, 'days').format('YYYY-MM-DDTHH:mm')+'"' : '';
        var minDataDistribuicao = '';
        var idBox = 'boxAtividade';

        var htmlBox = '<div id="' + idBox + '" class="atividadeWork seipro-atividades-work" data-demanda="' + (value && value.id_demanda ? value.id_demanda : 0) + '">' +
            '<div id="' + idBox + '_tabs" style="border: none; min-height: 300px; margin: 0;">' +
            '   <ul style="font-size: 10px;">' +
            '       <li><a href="#tabs_' + idBox + '_basico">B\u00E1sico</a></li>' +
            '       <li><a href="#tabs_' + idBox + '_avancado"><i class="fas fa-plus-circle cinzaColor"></i> Op\u00E7\u00F5es</a></li>' +
            '   </ul>' +
            '   <div id="tabs_' + idBox + '_basico">' +
            '   <table style="font-size: 10pt;width: 100%;" class="seiProForm">' +
            '      <tr ' + (dadosIfrArvore || value ? '' : 'style="display:none;"') + '>' +
            '          <td style="vertical-align: bottom; text-align: left;" class="label">' +
            '               <label for="ativ_processo_sei"><i class="iconPopup iconSwitch fas fa-folder-open cinzaColor"></i>Processo SEI:</label>' +
            '               <input type="hidden" id="ativ_id_demanda" data-key="id_demanda" data-param="id_demanda" value="' + id_demanda + '">' +
            '           </td>' +
            '           <td>' +
            '               <input type="text" id="ativ_processo_sei" data-act="atividades-call" data-fn="changeProtocoloBoxAtiv" data-key="processo_sei" value="' + (value && value.processo_sei ? value.processo_sei : (dadosIfrArvore ? dadosIfrArvore.processo_sei : '')) + '">' +
            '               <input type="hidden" id="ativ_id_procedimento" data-key="id_procedimento" data-param="id_procedimento" value="' + (value && value.id_procedimento ? value.id_procedimento : (dadosIfrArvore ? dadosIfrArvore.id_procedimento : '')) + '">' +
            '           </td>' +
            '           <td style="vertical-align: bottom;" class="label">' +
            '               <label class="last" for="ativ_requisicao_sei"><i class="iconPopup iconSwitch fas fa-file cinzaColor"></i>SEI n\u00BA:</label>' +
            '           </td>' +
            '           <td>' +
            '               <input type="text" maxlength="11" data-input-filter="digits" id="ativ_requisicao_sei" data-act="atividades-call" data-fn="changeProtocoloBoxAtiv" data-key="requisicao_sei" value="' + (value && value.requisicao_sei ? value.requisicao_sei : (dadosIfrArvore ? dadosIfrArvore.nr_sei : '')) + '">' +
            '               <input type="hidden" id="ativ_id_documento_requisicao" data-key="id_documento_requisicao" data-param="id_documento" value="' + (value && value.id_documento_requisicao ? value.id_documento_requisicao : (dadosIfrArvore ? dadosIfrArvore.id_documento : '')) + '">' +
            '           </td>' +
            '      </tr>' +
            '      <tr ' + (checkProcessoHome ? '' : 'style="display:none;"') + ' class="ativMultiProcesso">' +
            '          <td style="vertical-align: middle; text-align: left;" class="label">' +
            '               <label for="ativ_processo_sei"><i class="iconPopup iconSwitch fas fa-folder-open cinzaColor" style="height: 50px;"></i>Processos SEI ' + (checkProcessoHome ? 'Selecionados' : 'Listados') + ': <br><span class="counterMultProcessos"></span></label>' +
            '           </td>' +
            '           <td colspan="3">' +
            '               ' + htmlMultProcessos +
            '           </td>' +
            '      </tr>' +
            '      <tr>' +
            '          <td style="vertical-align: bottom; text-align: left;" class="label">' +
            '               <label for="ativ_assunto"><i class="iconPopup iconSwitch fas fa-comment-dots cinzaColor"></i>' + __.Assunto + ':</label>' +
            '               <input type="hidden" class="hiddenOptionConfig" id="ativ_id_unidade" data-type="text" data-key="id_unidade" value="' + (value && value.id_unidade ? value.id_unidade : arrayConfigAtivUnidade.id_unidade) + '">' +
            '               <input type="hidden" class="hiddenOptionConfig" id="ativ_id_tipo_requisicao" data-type="text" data-key="id_tipo_requisicao" value="' + (value && value.id_tipo_requisicao ? value.id_tipo_requisicao : 0) + '">' +
            '               <input type="hidden" class="hiddenOptionConfig" id="ativ_id_atividade" data-type="text" data-key="id_atividade" value="' + (value && value.id_atividade ? value.id_atividade : 0) + '">' +
            (callAtiv('checkOptionEntidade','exigir_homologacao_programas') ?
                '               <input type="hidden" class="hiddenOptionConfig" id="ativ_id_entrega" data-type="text" data-key="id_entrega" value="' + (value && value.id_entrega ? value.id_entrega : 0) + '">' +
                '' : '') +
            '               <input type="hidden" class="hiddenOptionConfig" id="ativ_tempo_pactuado" data-type="text" data-key="tempo_pactuado" value="' + (value && value.tempo_pactuado ? value.tempo_pactuado : '') + '">' +
            '               <input type="hidden" class="hiddenOptionConfig" id="ativ_fator_complexidade" data-type="text" data-key="fator_complexidade" value="' + (value && value.fator_complexidade ? value.fator_complexidade : 0) + '">' +
            '           </td>' +
            '           <td class="required" colspan="3">' +
            '               <input type="text" id="ativ_assunto" data-act="atividades-call" data-fn="checkThisAtivRequiredFields" maxlength="255" data-key="assunto" value="' + (value && value.assunto ? value.assunto : (dadosIfrArvore && dadosIfrArvore.assunto ? dadosIfrArvore.assunto : '')) + '" required>' +
            '           </td>' +
            '      </tr>' +
            '      <tr>' +
            '          <td style="vertical-align: middle; text-align: left;" class="label">' +
            '               <label for="ativ_observacao_gerencial"><i class="iconPopup iconSwitch fas fa-comment-alt cinzaColor"></i>' + __.Observacao + ' ' + __.Gerencial + ':</label>' +
            '           </td>' +
            '           <td colspan="3" style="text-align: left;">' +
            '               <textarea type="text" id="ativ_observacao_gerencial" ' + (value ? '' : 'data-act="atividades-call" data-fn="checkboxAnotacoesProcessoAtiv" data-on="input"') + ' style="width: 97%;" data-key="observacao_gerencial">' + ((value && value.observacao_gerencial !== null && value.observacao_gerencial != '') ? value.observacao_gerencial : '') + '</textarea>' +
            '' + ($('#ifrArvore').length > 0 ?
                '               <table style="width: 100%;font-size: 10pt; display:none" id="tableAnotacoesProcessoAtiv">' +
                '                   <tbody>' +
                '                       <tr style="height: 40px;">' +
                '                           <td style="text-align: left;vertical-align: bottom;">' +
                '                               <label for="ativ_anotacoes_processo">' +
                '                                   <i class="iconPopup iconSwitch fas fa-sticky-note cinzaColor"></i>Adicionar ' + __.observacao + ' ' + __.gerencial + ' nas anota\u00E7\u00F5es do processo?</label>' +
                '                           </td>' +
                '                           <td style="width: 50px;">' +
                '                               <div class="onoffswitch" style="float: right;">' +
                '                                   <input type="checkbox" data-key="anotacoes_processo" name="onoffswitch" class="onoffswitch-checkbox" id="ativ_anotacoes_processo" tabindex="0">' +
                '                                   <label class="onoff-switch-label" for="ativ_anotacoes_processo"></label>' +
                '                               </div>' +
                '                           </td>' +
                '                       </tr>' +
                '                   </tbody>' +
                '               </table>' +
                '' : '') +
            '           </td>' +
            '      </tr>' +
            '      <tr>' +
            '          <td style="vertical-align: bottom; text-align: left;" class="label">' +
            '               <label for="ativ_id_user"><i class="iconPopup iconSwitch fas fa-user-tie cinzaColor"></i>Respons\u00E1vel:</label>' +
            '           </td>' +
            '           <td colspan="3" ' + (callAtiv('checkOptionEntidade','exigir_atribuicao_demandas') ? 'class="required"' : '') + '>' +
            '               ' + selectResponsavel +
            '           </td>' +
            '      </tr>' +
            '      <tr style="height: auto;">' +
            '           <td colspan="4">' +
            '               <table style="font-size: 10pt;width: 100%;">' +
            '                   <tr class="modoDistribuicao_determinada">' +
            '                       <td style="vertical-align: bottom; text-align: left;" class="label">' +
            '                            <label for="ativ_data_distribuicao"><i class="iconPopup iconSwitch fas fa-briefcase cinzaColor"></i>Data de Distribui\u00E7\u00E3o:</label>' +
            '                        </td>' +
            '                        <td class="required date" style="width: 210px;">' +
            '                            <input type="' + (config_unidade.count_horas ? 'datetime-local' : 'date') + '" data-act="atividades-call" data-fn="changeDadosTrabalho" id="ativ_data_distribuicao" ' + minDataDistribuicao + ' data-key="data_distribuicao" data-type="inicio" data-name="data de distribui\u00E7\u00E3o" value="' + dataDistribuicao + '" required>' +
            '                        </td>' +
            '                        <td style="vertical-align: bottom;" class="label">' +
            '                            <label class="last" for="ativ_prazo_entrega"><i class="iconPopup iconSwitch fas fa-business-time cinzaColor" style="float: initial;"></i>Prazo de Entrega:</label>' +
            '                        </td>' +
            '                        <td class="required date">' +
            '                            <input type="' + (config_unidade.count_horas ? 'datetime-local' : 'date') + '" data-act="atividades-call" data-fn="changeDadosTrabalho" id="ativ_prazo_entrega" data-key="prazo_entrega" data-type="fim" data-name="prazo de entrega" value="' + prazoEntrega + '" required>' +
            '                        </td>' +
            '                   </tr>' +
            '                   <tr style="display:none">' +
            '                       <td style="vertical-align: bottom; text-align: left;" class="label">' +
            '                            <label for="ativ_tempo_planejado"><i class="iconPopup iconSwitch fas fa-hourglass-half cinzaColor"></i>' +
            '                           <i class="fas fa-info-circle azulColor" style="margin: 0px 2px;float: right;" data-tip="Tempo l\u00EDquido entre a data de distribui\u00E7\u00E3o ' + getNameGenre('demanda', 'do', 'da') + ' ' + __.demanda + ' e seu <u>prazo de entrega</u>"></i>' +
            '                           Tempo Planejado:</label>' +
            '                        </td>' +
            '                        <td style="width: 210px;">' +
            '                            <input type="number" min="1" id="ativ_tempo_planejado" data-act="atividades-call" data-fn="changeDadosTrabalho" data-key="tempo_planejado" data-type="tempo" value="' + (value && value.tempo_planejado ? value.tempo_planejado : '') + '" disabled>' +
            '                        </td>' +
            '                        <td style="vertical-align: bottom;" class="label">' +
            '                            <label class="last" for="ativ_dias_planejado"><i class="iconPopup iconSwitch fas fa-calendar-alt cinzaColor" style="float: initial;"></i><span id="ativ_dias_planejado_label">Dias ' + (config_unidade.count_dias_uteis ? '\u00FAteis' : '') + ' de Planejamento</span>:</label>' +
            '                        </td>' +
            '                        <td class="required number">' +
            '                            <input type="number" min="0" id="ativ_dias_planejado" data-act="atividades-call" data-fn="changeDadosTrabalho" data-key="dias_planejado" data-type="dias" value="' + (value && value.dias_planejado ? value.dias_planejado : '0') + '" required>' +
            '                        </td>' +
            '                   </tr>' +
            '               </table>' +
            '           </td>' +
            '      </tr>' +
            '   </table>' +
            '   </div>' +
            '   <div id="tabs_' + idBox + '_avancado">' +
            '   <table style="font-size: 10pt;width: 100%;" class="seiProForm tableLine">' +
            '      <tr style="height: auto;">' +
            '           <td colspan="4">' +
            '               <table style="font-size: 10pt;width: 100%; display:none;" class="moreInfoBox">' +
            '                   <tr class="hrForm"><td colspan="4"></td></tr>' +
            '                   <tr ' + (dadosMultProcessos && !value ? '' : 'style="display:none;"') + '>' +
            '                       <td style="vertical-align: bottom; text-align: left;" class="label" colspan="2">' +
            '                           <table style="width: 100%; font-size: 10pt;">' +
            '                               <tr>' +
            '                                   <td style="padding-top: 15px;width: 250px;text-align: left;">' +
            '                                       <label for="ativ_multiprocesso"><i class="iconPopup iconSwitch fas fa-clone cinzaColor"></i>Clonar ' + __.esta_demanda + ' nos processos <br> listados no documento?</label>' +
            '                                   </td>' +
            '                                   <td style="text-align: left;' + (dadosMultProcessos ? '' : 'display:none;') + '">' +
            '                                       <div class="onoffswitch" style="float: left;">' +
            '                                           <input type="checkbox" data-key="multiprocesso" data-act="atividades-call" data-fn="changeAtivMultiProcesso" name="onoffswitch" class="onoffswitch-checkbox" id="ativ_multiprocesso" tabindex="0">' +
            '                                           <label class="onoff-switch-label" for="ativ_multiprocesso"></label>' +
            '                                       </div>' +
            '                                   </td>' +
            '                               </tr>' +
            '                           </table>' +
            '                   </tr>' +
            '                   <tr ' + (value ? 'style="display:none"' : '') + '>' +
            '                       <td style="vertical-align: bottom; text-align: left;" class="label" colspan="2">' +
            '                            <table style="width: 100%; font-size: 10pt;">' +
            '                                <tr>' +
            '                                    <td style="padding-top: 15px;width: 130px;text-align: left;">' +
            '                                        <label for="ativ_multiplicacao"><i class="iconPopup iconSwitch fas fa-retweet cinzaColor"></i>Multiplicar ' + __.demanda + '?</label>' +
            '                                    </td>' +
            '                                    <td style="text-align: left;width: 50px;">' +
            '                                        <div class="onoffswitch">' +
            '                                            <input type="checkbox" data-key="multiplicacao" data-act="atividades-call" data-fn="changeAtivMultiSwitch" name="onoffswitch" class="onoffswitch-checkbox" id="ativ_multiplicacao" tabindex="0">' +
            '                                            <label class="onoff-switch-label" for="ativ_multiplicacao"></label>' +
            '                                        </div>' +
            '                                    </td>' +
            '                                    <td>' +
            '                                        <div id="div_ativ_fator_multiplicacao" style="display:none">' +
            '                                            <label style="margin-right: 10px;">x</label>' +
            '                                            <input type="number" min="1" style="width: 50px !important;" id="ativ_fator_multiplicacao" data-act="atividades-call" data-fn="updateAtivTempoPactuado" data-key="fator_multiplicacao" value="1">' + '' +
            '                                        </div>' +
            '                                    </td>' +
            '                                </tr>' +
            '                            </table>' +
            '                        </td>' +
            '                   </tr>' +
            '                   <tr id="trAtivVinculacao" ' + (value ? 'style="display:none"' : '') + '>' +
            '                       <td style="vertical-align: bottom; text-align: left;" class="label" colspan="4">' +
            '                            <table style="width: 100%; font-size: 10pt;">' +
            '                                <tr>' +
            '                                    <td style="padding-top: 15px; width: 130px; text-align: left;">' +
            '                                        <label for="ativ_vinculacao"><i class="iconPopup iconSwitch fas fa-random cinzaColor"></i>Vincular ' + __.demanda + '?</label>' +
            '                                    </td>' +
            '                                    <td style="width: 50px; text-align: left;">' +
            '                                        <div class="onoffswitch">' +
            '                                            <input type="checkbox" data-key="vinculacao" data-act="atividades-call" data-fn="changeAtivVinculacaoSwitch" name="onoffswitch" class="onoffswitch-checkbox" id="ativ_vinculacao" tabindex="0">' +
            '                                            <label class="onoff-switch-label" for="ativ_vinculacao"></label>' +
            '                                        </div>' +
            '                                    </td>' +
            '                                    <td>' +
            '                                        <div id="div_ativ_lista_vinculacao" style="text-align: right; display:none;width: 530px !important;">' +
            '                                            <select id="ativ_lista_vinculacao" data-key="lista_vinculacao">' +
            '                                               <option value="0">&nbsp;</option>' +
            '                                               ' + callAtiv('getListAtivVinculacao',) +
            '                                           </select>' +
            '                                        </div>' +
            '                                    </td>' +
            '                                </tr>' +
            '                            </table>' +
            '                        </td>' +
            '                   </tr>' +
            '                   <tr id="trAtivPrioridade" ' + (!value ? 'style="display:none"' : '') + '>' +
            '                       <td style="vertical-align: bottom; text-align: left;" class="label" colspan="4">' +
            '                            <table style="width: 100%; font-size: 10pt;">' +
            '                                <tr>' +
            '                                    <td style="padding-top: 15px; width: 130px; text-align: left;">' +
            '                                        <label for="ativ_prioridades"><i class="iconPopup iconSwitch fas fa-exclamation cinzaColor"></i>Priorizar ' + __.demanda + '?</label>' +
            '                                    </td>' +
            '                                    <td style="width: 50px; text-align: left;">' +
            '                                        <div class="onoffswitch">' +
            '                                            <input type="checkbox" data-key="prioridades" data-act="atividades-call" data-fn="changeAtivPrioritySwitch" name="onoffswitch" class="onoffswitch-checkbox" id="ativ_prioridades" tabindex="0">' +
            '                                            <label class="onoff-switch-label" for="ativ_prioridades"></label>' +
            '                                        </div>' +
            '                                    </td>' +
            '                                    <td>' +
            '                                        <div id="div_ativ_lista_prioridades" style="text-align: right; display:none;width: 530px !important;">' +
            '                                            <select id="ativ_lista_prioridades" data-key="lista_prioridades"><option value="0">&nbsp;</option></select>' +
            '                                        </div>' +
            '                                    </td>' +
            '                                </tr>' +
            '                            </table>' +
            '                        </td>' +
            '                   </tr>' +
            (value ? '' :
                '                   <tr id="trAtivChecklist">' +
                '                       <td style="vertical-align: bottom; text-align: left;" class="label" colspan="4">' +
                '                            <input type="hidden" id="ativ_checklist" data-key="lista_checklist" data-param="lista_checklist" value="' + (value && value.checklist ? value.checklist : '') + '">' +
                '                            <table style="width: 100%; font-size: 10pt;">' +
                '                                <tr>' +
                '                                    <td style="padding-top: 15px; width: 130px; text-align: left;">' +
                '                                        <label for="ativ_insert_checklist"><i class="iconPopup iconSwitch fas fa-check-double cinzaColor"></i>Inserir <br>Checklist?</label>' +
                '                                    </td>' +
                '                                    <td style="width: 50px; text-align: left;">' +
                '                                        <div class="onoffswitch">' +
                '                                            <input type="checkbox" data-key="checklist" data-act="atividades-call" data-fn="changeAtivChecklistSwitch" name="onoffswitch" class="onoffswitch-checkbox" id="ativ_insert_checklist" tabindex="0">' +
                '                                            <label class="onoff-switch-label" for="ativ_insert_checklist"></label>' +
                '                                        </div>' +
                '                                    </td>' +
                '                                    <td>' +
                '                                        <div id="div_ativ_lista_checklist" class="tabelaPanelScroll" style="text-align: right; display:none;">' +
                '                                            <table id="ativBox_checklist" data-format="array" data-key="checklist" data-mode-insert="' + (value && value.checklist ? 'manual' : 'auto') + '" style="font-size: 8pt !important;width: 100%; margin:0" class="tableOptionConfig tableSortable seiProForm tableDialog tableInfo tableZebraOdd tableFollow tableAtividades seipro-atividades-table">' +
                '                                                 <thead>' +
                '                                                    <tr>' +
                '                                                        <th colspan="3" style="text-align: right;">' +
                '                                                            <a class="newLink addConfigItem" data-act="atividades-call" data-fn="addConfigItem" style="cursor: pointer; margin: 5px;display: inline-block;">' +
                '                                                                <i class="fas fa-plus-circle cinzaColor" style="padding-right: 3px; cursor: pointer; font-size: 12pt;"></i>' +
                '                                                                Adicionar novo item' +
                '                                                            </a>' +
                '                                                        </th>' +
                '                                                    </tr>' +
                '                                                 </thead>' +
                '                                                 <tbody>' +
                '                                                 </tbody>' +
                '                                            </table>' +
                '                                        </div>' +
                '                                    </td>' +
                '                                </tr>' +
                '                            </table>' +
                '                        </td>' +
                '                   </tr>' +
                '                   <tr>' +
                '                       <td style="vertical-align: bottom; text-align: left;" class="label">' +
                '                            <label for="ativ_etiquetas"><i class="iconPopup iconSwitch fas fa-tags cinzaColor"></i>Etiquetas:</label>' +
                '                        </td>' +
                '                        <td colspan="3">' +
                '                            <input type="text" id="ativ_etiquetas" class="seipro-atividades-etiquetas" data-key="etiquetas" value="' + (value && value.etiquetas ? (value.etiquetas !== null && value.etiquetas.length > 0 ? value.etiquetas.join(';') : '') : '') + '">' +
                '                        </td>' +
                '                   </tr>' +
                '') +
            '               </table>' +
            '           </td>' +
            '       </tr>' +
            '   </table>' +
            '   </div>' +
            '</div>';

        var btnDialogBoxPro = [{
            text: (id_demanda != 0) ? 'Editar' : 'Salvar',
            class: 'confirm',
            click: function (event) {
                if (callAtiv('checkAtivRequiredFields',this, 'mark')) {
                    var action = (id_demanda != 0) ? 'edit_atividade' : 'save_atividade';
                    var param = callAtiv('extractDataAtiv',this);
                    param.action = action;
                    var id_plano = jmespath.search(arrayConfigAtividades.planos, "[?id_user==`" + param.id_user + "`] | [0].id_plano");
                    id_plano = (id_plano === null) ? 0 : id_plano;
                    if (!callAtiv('checkCapacidade','check_entregas_atividades') || typeof param.id_plano === 'undefined') param.id_plano = id_plano;
                    var id_atividade = (param.id_atividade.trim() == '') ? 0 : param.id_atividade;
                    param.id_atividade = id_atividade;
                    getServerAtividades(param, action);
                }
            }
        }];
        if (id_demanda != 0) {
            if (value.data_inicio != '0000-00-00 00:00:00') {
                if (callAtiv('checkCapacidade','complete_atividade') || callAtiv('checkCapacidade','complete_edit_atividade')) {
                    btnDialogBoxPro.unshift({
                        text: (value.data_entrega == '0000-00-00 00:00:00') ? 'Concluir ' + __.Demanda + '' : 'Editar Conclus\u00E3o',
                        icon: 'ui-icon-check',
                        click: function (event) {
                            callAtiv('completeAtividade',id_demanda);
                        }
                    });
                }
            } else {
                if (callAtiv('checkCapacidade','start_atividade')) {
                    btnDialogBoxPro.unshift({
                        text: 'Iniciar Execu\u00E7\u00E3o',
                        icon: 'ui-icon-play',
                        click: function (event) {
                            callAtiv('startAtividade',id_demanda);
                        }
                    });
                }
            }
            btnDialogBoxPro.unshift({
                text: 'Gerar Notifica\u00E7\u00E3o',
                icon: 'ui-icon-mail-closed',
                click: function (event) {
                    callAtiv('notifyAtividade',id_demanda, event);
                }
            });
            if (callAtiv('checkCapacidade','delete_atividade') || callAtiv('checkCapacidade','delete_atividade_all')) {
                btnDialogBoxPro.unshift({
                    text: 'Excluir',
                    icon: 'ui-icon-trash',
                    click: function (event) {
                        deleteAtividade_(value);
                    }
                });
            }
        } else {
            if (callAtiv('checkCapacidade','edit_atividade')) {
                btnDialogBoxPro.unshift({
                    text: 'Cadastro Avan\u00E7ado',
                    icon: 'ui-icon-notice',
                    click: function (event) {
                        changeSaveAtividade('full');
                    }
                });
            }
        }
        var titleBox = (id_demanda != 0)
            ? 'Editar ' + __.demanda + ': ' + callAtiv('getTitleDialogBox',value)
            : 'Criar  ' + __.nova_demanda;
        resetDialogBoxPro('dialogBoxPro');
        dialogBoxPro = $('#dialogBoxPro')
            .html('<div class="dialogBoxDiv">' + htmlBox + '</div>')
            .dialog({
                title: titleBox,
                width: 780,
                open: function () {
                    prepareFieldsReplace(this);
                    if ($('#' + idBox + '_tabs').length > 0) {
                        $('#' + idBox + '_tabs').tabs();
                    }
                    setTimeout(function () {
                        centralizeDialogBox(dialogBoxPro);
                    }, 100);
                },
                close: function () {
                    $('#boxAtividade').remove();
                    callAtiv('cancelSelectedItensAtiv',id_demanda);
                    resetDialogBoxPro('dialogBoxPro');
                },
                buttons: btnDialogBoxPro
            });
        checkTagsIput();

        var selectUser = $('#ativ_id_user');
        if (dadosIfrArvore && id_demanda == 0) {
            var tipo_processo = dadosIfrArvore.tipo;
            var usuario = dadosIfrArvore.usuario;
            var prazo = dadosIfrArvore.prazo;
            if (usuario) {
                selectUser.find('option').each(function () {
                    var text = $(this).text().toLowerCase();
                    if (text == usuario.toLowerCase()) {
                        if ($(this).prop('disabled') == false && $(this).closest('optgroup').prop('disabled') == false) {
                            selectUser.val($(this).val()).trigger('change');
                            return false;
                        }
                    }
                });
            }
            if (prazo) { $('#ativ_dias_planejado').val(prazo).trigger('change') }
        }
        if (!callAtiv('checkCapacidade','select_user_atividade')) {
            selectUser.val(arrayConfigAtividades.perfil.id_user).trigger('change');
        }
        if (checkProcessoHome) {
            multProcessUpdateInput();
        }
    }
}
export function deleteAtividade_(value) {
    if (value.data_avaliacao != '0000-00-00 00:00:00') {
        confirmaFraseBoxPro(__.A_demanda + ' j\u00E1 possui avalia\u00E7\u00E3o cadastrada. Tem certeza que deseja excluir?', 'EXCLUIR', function () { callAtiv('deleteAtividade',value.id_demanda) });
    } else if (value.data_entrega != '0000-00-00 00:00:00') {
        confirmaFraseBoxPro(__.A_demanda + ' j\u00E1 possui entrega realizada. Tem certeza que deseja excluir?', 'EXCLUIR', function () { callAtiv('deleteAtividade',value.id_demanda) });
    } else {
        confirmaBoxPro('Tem certeza que deseja excluir ' + __.esta_demanda + '?', function () { callAtiv('deleteAtividade',value.id_demanda) }, 'Excluir');
    }
}
export function sendCancelAtividadeReport(this_, id_demanda) {
    var _this = $(this_);
    if (id_demanda > 0) {
        callAtiv('sendCancelAtividade',id_demanda);
        _this.find('i').attr('class', 'fas fa-spinner fa-spin cinzaColor');
        infraTooltipOcultar();
    }
}
export function recoveryDemanda(this_, id_demanda) {
    var _this = $(this_);
    if (id_demanda > 0) {
        var action = 'restory_atividade';
        var param = {
            action: action,
            id_unidade: arrayConfigAtivUnidade.id_unidade,
            id_demanda: id_demanda
        };
        getServerAtividades(param, action);
        _this.find('i').attr('class', 'fas fa-spinner fa-spin cinzaColor');
        infraTooltipOcultar();
    }
}
export function changeSaveAtividade(type) {
    var assunto = $('#ativ_assunto').val();
    var observacao_gerencial = $('#ativ_observacao_gerencial').val();
    var id_user = $('#ativ_id_user').val();
    var data_distribuicao = $('#ativ_data_distribuicao').val();
    var prazo_entrega = $('#ativ_prazo_entrega').val();
    if (type == 'simple') {
        saveAtividadeSimple();
    } else if (type == 'quick') {
        saveAtividadeQuick();
    } else {
        saveAtividadeFull();
    }
    setOptionsPro('formSaveAtividade', type);
    setTimeout(function () {
        $('#ativ_assunto').val(assunto);
        $('#ativ_observacao_gerencial').val(observacao_gerencial).trigger('change');
        $('#ativ_id_user').val(id_user).trigger('change');
        $('#ativ_data_distribuicao').val(data_distribuicao).trigger('change');
        $('#ativ_prazo_entrega').val(prazo_entrega).trigger('change');
    }, 300);
}
export function checkMaxDateAvaliacao() {
    var daysMaxAvaliacao = (callAtiv('checkOptionEntidade','checar_avaliacao') && callAtiv('checkOptionEntidade','prazo_avaliacao')) ? callAtiv('getOptionEntidade','prazo_avaliacao') : 40;
    var dateMaxAvaliacao = moment().add(-daysMaxAvaliacao, 'day').format('YYYY-MM-DD HH:mm:ss');
    var checkMaxAvaliacao = jmespath.search(arrayAtividadesPro, "[?data_entrega!='0000-00-00 00:00:00'] | [?id_avaliacao==`0`] | [?data_entrega < `" + dateMaxAvaliacao + "`]");
    return (checkMaxAvaliacao === null || checkMaxAvaliacao.length == 0 || !callAtiv('checkOptionEntidade','checar_avaliacao')) ? true : false;
}
export function saveAtividade(id_demanda = 0) {
    if (checkMaxDateAvaliacao()) {
        if (
            id_demanda == 0 &&
            // (getOptionsPro('formSaveAtividade') == 'simple' || (!getOptionsPro('formSaveAtividade') && checkOptionEntidade('cadastro_simplificado'))) 
            (getOptionsPro('formSaveAtividade') == 'simple' && callAtiv('checkOptionEntidade','cadastro_simplificado') && !callAtiv('checkOptionEntidade','cadastro_rapido'))
        ) {
            saveAtividadeSimple(id_demanda);
        } else if (
            id_demanda == 0 &&
            ((getOptionsPro('formSaveAtividade') == 'quick' || !getOptionsPro('formSaveAtividade')) && callAtiv('checkCapacidade','save_atividade_rapida'))
        ) {
            saveAtividadeQuick();
        } else {
            saveAtividadeFull(id_demanda);
        }
    } else {
        // alertaBoxPro('Error', 'exclamation-triangle', 'Existem demandas n\u00E3o avaliadas h\u00E1 mais de 40 dias. Solicite ao gestor que as avalie antes de prosseguir!');

        var daysMaxAvaliacao = (callAtiv('checkOptionEntidade','checar_avaliacao') && callAtiv('checkOptionEntidade','prazo_avaliacao')) ? callAtiv('getOptionEntidade','prazo_avaliacao') : 40;
        var htmlBox = '<strong class="alertaErrorPro dialogBoxDiv">' +
            '   <i class="fas fa-exclamation-triangle" style="margin-right: 5px;"></i> ' +
            '   Existem demandas n\u00E3o avaliadas h\u00E1 mais de ' + daysMaxAvaliacao + ' dias. <br>' + (callAtiv('checkCapacidade','rate_atividade') ? 'Avalie-as antes de prosseguir.' : 'Solicite ao gestor que as avalie antes de prosseguir!') +
            '</strong>';

        resetDialogBoxPro('dialogBoxPro');
        dialogBoxPro = $('#dialogBoxPro')
            .html('<div class="dialogBoxDiv">' + htmlBox + '</div>')
            .dialog({
                title: NAMESPACE_SPRO,
                width: 450,
                open: function () {
                    updateButtonConfirm(this, true);
                },
                close: function () {
                    resetDialogBoxPro('dialogBoxPro');
                    callAtiv('updateAtividade_',false);
                },
                buttons: [{
                    text: (callAtiv('checkCapacidade','rate_atividade') && $('#ifrArvore').length == 0 ? 'Visualizar ' + __.demandas : 'Ok'),
                    class: (callAtiv('checkCapacidade','rate_atividade') ? 'confirm' : ''),
                    click: function (event) {
                        if (callAtiv('checkCapacidade','rate_atividade')) {
                            selectDemanadasPendentesAvaliacao(daysMaxAvaliacao);
                        } else {
                            callAtiv('updateAtividade_',false);
                        }
                        resetDialogBoxPro('dialogBoxPro');
                    }
                }]
            });
    }
}
export function selectDemanadasPendentesAvaliacao(daysMaxAvaliacao) {
    $('.filterTablePro.filterTableAtivStatus .tagTableText_date_entregue').trigger('click');
    $('#tabelaAtivPanel').find('.tableAtividades').trigger("sorton", [[[0, 0], [2, 0]]]);

    $('#tabelaAtivPanel').find('thead th a[onclick*="setSelectAllTr"]').data('index', 1).trigger('click');

    $('.dateboxDisplay.tagTableText_date_entregue').each(function () {
        if (moment($(this).data('time-sorter'), 'YYYY-MM-DD HH:mm:ss').add(daysMaxAvaliacao, 'd') < moment()) {
            $(this).closest('tr').find('input[type="checkbox"][onclick*="followSelecionarItens("]').trigger('click');
        }
    });
}
// BOX DE DEMANDA COMPLETA
export function saveAtividadeFull(id_demanda = 0) {
    var checkPlanos = (typeof arrayConfigAtividades.planos !== 'undefined' && arrayConfigAtividades.planos != 0 && arrayConfigAtividades.planos.length > 0) ? true : false;
    if (!checkPlanos) {
        alertaBoxPro('Error', 'exclamation-triangle', 'Nenhum plano de trabalho ativo!');
    } else {
        var value = callAtiv('getAtividadeData',id_demanda);
        var unidades = (typeof arrayConfigAtividades.atividades !== 'undefined' && arrayConfigAtividades.atividades != 0 && arrayConfigAtividades.atividades.length > 0)
            ? uniqPro(jmespath.search(arrayConfigAtividades.atividades, "[?sigla_unidade].sigla_unidade"))
            : [];
        var countUnidades = (arrayConfigAtividades.atividades.length > 0) ? unidades.length : 0;
        var unidadesPlanos = (checkPlanos)
            ? uniqPro(jmespath.search(arrayConfigAtividades.planos, "[?sigla_unidade].sigla_unidade"))
            : [];
        var countUnidadesPlanos = (checkPlanos) ? unidadesPlanos.length : 0;
        var config_unidade = callAtiv('getConfigDadosUnidade',(id_demanda != 0 ? value.sigla_unidade : null));
        var dadosIfrArvore = getIfrArvoreDadosProcesso();
        if (value) {
            var dataDistribuicao = moment(value.data_distribuicao, 'YYYY-MM-DD HH:mm:ss').format(config_unidade.hora_format);
            var prazoEntrega = moment(value.prazo_entrega, 'YYYY-MM-DD HH:mm:ss').format(config_unidade.hora_format);
        } else {
            var dt_init = (dadosIfrArvore && dadosIfrArvore.data_documento && dadosIfrArvore.data_documento != '')
                ? moment(dadosIfrArvore.data_documento, 'DD/MM/YYYY HH:mm') : moment();
            var hr_init = dt_init.format('HH:mm');
            var dataDistribuicao = dt_init.format(config_unidade.hora_format);
            dataDistribuicao = (moment(hr_init, 'HH:mm') > moment(config_unidade.h_util_fim, 'HH:mm'))
                ? moment(dt_init.format('YYYY-MM-DD') + 'T' + config_unidade.h_util_fim).add(-1, 'hours').format(config_unidade.hora_format)
                : dataDistribuicao;
            dataDistribuicao = (moment(hr_init, 'HH:mm') < moment(config_unidade.h_util_inicio, 'HH:mm'))
                ? moment(dt_init.format('YYYY-MM-DD') + 'T' + config_unidade.h_util_inicio).format(config_unidade.hora_format)
                : dataDistribuicao;
            var prazoEntrega = dt_init.add(1, 'hours').format(config_unidade.hora_format);
            prazoEntrega = (moment(hr_init, 'HH:mm') > moment(config_unidade.h_util_fim, 'HH:mm'))
                ? moment(dt_init.format('YYYY-MM-DD') + 'T' + config_unidade.h_util_fim).format(config_unidade.hora_format)
                : prazoEntrega;
            prazoEntrega = (moment(hr_init, 'HH:mm') < moment(config_unidade.h_util_inicio, 'HH:mm'))
                ? moment(dt_init.format('YYYY-MM-DD') + 'T' + config_unidade.h_util_inicio).add(1, 'hours').format(config_unidade.hora_format)
                : prazoEntrega;
        }

        var optionSelectRequisicoes = (arrayConfigAtividades.tipos_requisicoes.length > 0) ? $.map(arrayConfigAtividades.tipos_requisicoes, function (v, k) { return ((value && v.id_tipo_requisicao == value.id_tipo_requisicao) || (dadosIfrArvore && dadosIfrArvore.nome_documento.indexOf(v.nome_requisicao) !== -1)) ? '<option value="' + v.id_tipo_requisicao + '" selected>' + v.nome_requisicao + '</option>' : '<option value="' + v.id_tipo_requisicao + '">' + v.nome_requisicao + '</option>' }).join('') : '';
        var selectRequisicoes = '<select id="ativ_id_tipo_requisicao" class="requiredSelect" data-act="atividades-call" data-fn="checkThisAtivRequiredFields" data-key="id_tipo_requisicao" required><option>&nbsp;</option>' + optionSelectRequisicoes + '</select>';
        selectRequisicoes = (callAtiv('checkOptionEntidade','dispensa_tipos_requisicao')) ? '<input type="hidden" id="ativ_id_tipo_requisicao" data-key="id_tipo_requisicao" data-param="id_tipo_requisicao" value="0">' : selectRequisicoes;

        var optionSelectAtividades = '';
        // var arrayTabelaAtividades = jmespath.search(arrayConfigAtividades.atividades,"[?homologado==`true`]");
        // arrayTabelaAtividades = (arrayTabelaAtividades !== null) ? arrayTabelaAtividades : [];
        var arrayTabelaAtividades = arrayConfigAtividades.atividades;
        if (countUnidades > 1) {
            $.each(unidades, function (index, v) {
                var arrayAtiv = jmespath.search(arrayTabelaAtividades, "[?sigla_unidade=='" + v + "']");
                optionSelectAtividades += '<optgroup label="' + v + '">' +
                    '   ' + callAtiv('getOptionsSelectAtivGroup',arrayAtiv, value, true) +
                    '</optgroup>';
            });
        } else {
            optionSelectAtividades += callAtiv('getOptionsSelectAtivGroup',arrayTabelaAtividades, value, true);
        }
        var selectAtividades = '<select id="ativ_id_atividade" data-key="id_atividade" data-act="atividades-call" data-fn="changeAtivSelect"><option>&nbsp;</option>' + optionSelectAtividades + '</select>';

        var optionSelectResponsavel = '';
        if (countUnidadesPlanos > 1) {
            $.each(unidadesPlanos, function (index, v) {
                var arrayResp = jmespath.search(arrayConfigAtividades.planos, "[?sigla_unidade=='" + v + "'] | [?vigencia==`true`]");
                optionSelectResponsavel += '<optgroup label="' + v + '">';
                optionSelectResponsavel += callAtiv('getOptionsSelectResp',arrayResp, value);
                optionSelectResponsavel += '</optgroup>';
            });
        } else {
            var arrayResp = jmespath.search(arrayConfigAtividades.planos, "[?vigencia==`true`]");
            optionSelectResponsavel += callAtiv('getOptionsSelectResp',arrayResp, value);
        }

        var dadosMultProcessos = (
            dadosIfrArvore &&
            dadosIfrArvore.processos &&
            dadosIfrArvore.processos[0].id_procedimento != dadosIfrArvore.id_procedimento
        )
            ? dadosIfrArvore.processos
            : getProcessoUnidadePro(true).length > 0
                ? getProcessoUnidadePro(true, true)
                : false;
        var checkProcessoHome = (!value && !dadosIfrArvore && dadosMultProcessos && dadosMultProcessos.length > 0) ? true : false;
        var htmlMultProcessos = '';
        if (dadosMultProcessos) {
            htmlMultProcessos += '<div class="listMultProcessos seipro-atividades-processos-list">';
            $.each(dadosMultProcessos, function (index, value) {
                htmlMultProcessos += '<span class="ativProcessos seipro-atividades-processos" data-procedimento="' + value.id_procedimento + '" data-processo="' + value.processo_sei + '">' +
                    '   <i class="fas fa-folder-open cinzaColor" style="font-size: 9pt;margin-right: 5px;"></i>' +
                    '   ' + value.processo_sei +
                    '   <i class="fas fa-times vermelhoColor"  data-act="atividades-call" data-fn="multProcessRemove" style="font-size: 9pt;margin-left: 5px;cursor: pointer;user-select: none;"></i>' +
                    '</span>';
            })
            htmlMultProcessos += "<input type='hidden' id='ativ_id_procedimentos' data-key='id_procedimentos' data-param='id_procedimentos' value='[]'>";
            htmlMultProcessos += '</div>';
        }

        var selectResponsavel = '<select id="ativ_id_user" data-key="id_user" ' + (callAtiv('checkOptionEntidade','exigir_atribuicao_demandas') ? 'class="requiredSelect"' : '') + ' data-type="user" data-act="atividades-call" data-fn="updateAtivSelectUser"><option>&nbsp;</option>' + optionSelectResponsavel + '</select>';
        // var prazoDemandasRetroativas = checkOptionEntidade('limitar_demandas_retroativas') && checkOptionEntidade('prazo_demandas_retroativas') ? getOptionEntidade('prazo_demandas_retroativas') : false;
        // var minDataDistribuicao = prazoDemandasRetroativas ? 'min="'+moment().add(-prazoDemandasRetroativas, 'days').format('YYYY-MM-DDTHH:mm')+'"' : '';
        var minDataDistribuicao = '';
        var idBox = 'boxAtividade';

        var htmlBox = '<div id="' + idBox + '" class="atividadeWork seipro-atividades-work" data-demanda="' + (value && value.id_demanda ? value.id_demanda : 0) + '">' +
            '<div id="' + idBox + '_tabs" style="border: none; min-height: 300px; margin: 0;">' +
            '   <ul style="font-size: 10px;">' +
            '       <li><a href="#tabs_' + idBox + '_basico">B\u00E1sico</a></li>' +
            '       <li><a href="#tabs_' + idBox + '_avancado"><i class="fas fa-plus-circle cinzaColor"></i> Op\u00E7\u00F5es</a></li>' +
            '   </ul>' +
            '   <div id="tabs_' + idBox + '_basico">' +
            '   <table style="font-size: 10pt;width: 100%;" class="seiProForm">' +
            '      <tr ' + (dadosIfrArvore || value ? '' : 'style="display:none;"') + '>' +
            '          <td style="vertical-align: bottom; text-align: left;" class="label">' +
            '               <label for="ativ_processo_sei"><i class="iconPopup iconSwitch fas fa-folder-open cinzaColor"></i>Processo SEI:</label>' +
            '               <input type="hidden" id="ativ_id_demanda" data-key="id_demanda" data-param="id_demanda" value="' + id_demanda + '">' +
            '           </td>' +
            '           <td colspan="' + (dadosMultProcessos ? '' : '3') + '">' +
            '               <input type="text" id="ativ_processo_sei" data-act="atividades-call" data-fn="changeProtocoloBoxAtiv" data-key="processo_sei" value="' + (value && value.processo_sei ? value.processo_sei : (dadosIfrArvore ? dadosIfrArvore.processo_sei : '')) + '">' +
            '               <input type="hidden" id="ativ_id_procedimento" data-key="id_procedimento" data-param="id_procedimento" value="' + (value && value.id_procedimento ? value.id_procedimento : (dadosIfrArvore ? dadosIfrArvore.id_procedimento : '')) + '">' +
            '           </td>' +
            '           <td colspan="2" ' + (dadosMultProcessos && !value ? '' : 'style="display:none;"') + '>' +
            '               <table style="width: 100%; font-size: 10pt;">' +
            '                   <tr>' +
            '                       <td colspan="2" style="padding-top: 15px;text-align: left;padding-left: 25px;">' +
            '                           <label for="ativ_multiprocesso"><i class="iconPopup iconSwitch fas fa-clone cinzaColor"></i>Clonar ' + __.esta_demanda + ' nos processos <br> listados no documento?</label>' +
            '                       </td>' +
            '                       <td ' + (dadosMultProcessos ? '' : 'style="display:none;"') + '>' +
            '                           <div class="onoffswitch" style="float: right;">' +
            '                               <input type="checkbox" data-key="multiprocesso" data-act="atividades-call" data-fn="changeAtivMultiProcesso" name="onoffswitch" class="onoffswitch-checkbox" id="ativ_multiprocesso" tabindex="0">' +
            '                               <label class="onoff-switch-label" for="ativ_multiprocesso"></label>' +
            '                           </div>' +
            '                       </td>' +
            '                   </tr>' +
            '               </table>' +
            '           </td>' +
            '      </tr>' +
            '      <tr ' + (checkProcessoHome ? '' : 'style="display:none;"') + ' class="ativMultiProcesso">' +
            '          <td style="vertical-align: middle; text-align: left;" class="label">' +
            '               <label for="ativ_processo_sei"><i class="iconPopup iconSwitch fas fa-folder-open cinzaColor" style="height: 50px;"></i>Processos SEI ' + (checkProcessoHome ? 'Selecionados' : 'Listados') + ': <br><span class="counterMultProcessos"></span></label>' +
            '           </td>' +
            '           <td colspan="3">' +
            '               ' + htmlMultProcessos +
            '           </td>' +
            '      </tr>' +
            '      <tr ' + (callAtiv('checkOptionEntidade','dispensa_tipos_requisicao') && !dadosIfrArvore && !value ? 'style="display:none;"' : '') + '>' +
            '          <td style="vertical-align: bottom; text-align: left; ' + (callAtiv('checkOptionEntidade','dispensa_tipos_requisicao') ? 'display:none;' : '') + '" class="label">' +
            '               <label for="ativ_id_tipo_requisicao"><i class="iconPopup iconSwitch fas fa-inbox cinzaColor"></i>Requisi\u00E7\u00E3o:</label>' +
            '           </td>' +
            '           <td class="required" style="width: 210px;max-width: 210px; ' + (callAtiv('checkOptionEntidade','dispensa_tipos_requisicao') ? 'display:none;' : '') + '">' +
            '               ' + selectRequisicoes +
            '           </td>' +
            '           <td style="vertical-align: bottom; ' + (dadosIfrArvore || value ? '' : 'display:none;') + '" class="label">' +
            '               <label class="' + (callAtiv('checkOptionEntidade','dispensa_tipos_requisicao') ? '' : 'last') + '" for="ativ_requisicao_sei"><i class="iconPopup iconSwitch fas fa-file cinzaColor"></i>SEI n\u00BA:</label>' +
            '           </td>' +
            '           <td ' + (dadosIfrArvore || value ? '' : 'style="display:none;"') + '>' +
            '               <input type="text" data-input-filter="digits" id="ativ_requisicao_sei" data-act="atividades-call" data-fn="changeProtocoloBoxAtiv" data-key="requisicao_sei" value="' + (value && value.requisicao_sei ? value.requisicao_sei : (dadosIfrArvore ? dadosIfrArvore.nr_sei : '')) + '">' +
            '               <input type="hidden" id="ativ_id_documento_requisicao" data-key="id_documento_requisicao" data-param="id_documento" value="' + (value && value.id_documento_requisicao ? value.id_documento_requisicao : (dadosIfrArvore ? dadosIfrArvore.id_documento : '')) + '">' +
            '           </td>' +
            '      </tr>' +
            '      <tr>' +
            '          <td style="vertical-align: bottom; text-align: left;" class="label">' +
            '               <label for="ativ_assunto"><i class="iconPopup iconSwitch fas fa-comment-dots cinzaColor"></i>' + __.Assunto + ':</label>' +
            '           </td>' +
            '           <td class="required" colspan="3">' +
            '               <input type="text" id="ativ_assunto" data-act="atividades-call" data-fn="checkThisAtivRequiredFields" maxlength="255" data-key="assunto" value="' + (value && value.assunto ? value.assunto : (dadosIfrArvore && dadosIfrArvore.assunto ? dadosIfrArvore.assunto : '')) + '" required>' +
            '           </td>' +
            '      </tr>' +
            '      <tr class="hrForm"><td colspan="4"></td></tr>' +
            '      <tr>' +
            '          <td style="vertical-align: bottom; text-align: left;" class="label">' +
            '               <label for="ativ_id_atividade"><i class="iconPopup iconSwitch fas fa-clipboard-list cinzaColor"></i>' + __.Atividade + ':</label>' +
            '           </td>' +
            '           <td colspan="3">' +
            '               ' + selectAtividades +
            '               <input type="hidden" id="ativ_id_unidade" data-key="id_unidade" data-param="id_unidade" value="">' +
            '               <input type="hidden" id="ativ_id_plano" data-key="id_plano" data-param="id_plano" value="' + (value && value.id_plano ? value.id_plano : '0') + '">' +
            '           </td>' +
            '      </tr>' +
            '      <tr>' +
            '           <td style="vertical-align: bottom; text-align: left;" class="label">' +
            '               <label for="ativ_fator_complexidade"><i class="iconPopup iconSwitch fas fa-graduation-cap cinzaColor"></i>Grau de ' + __.Complexidade + ':</label>' +
            '           </td>' +
            '           <td>' +
            '               <select id="ativ_fator_complexidade" data-key="fator_complexidade" data-act="atividades-call" data-fn="updateAtivTempoPactuado"><option>&nbsp;</option></select>' +
            '           </td>' +
            '           <td colspan="2" rowspan="3">' +
            '               <div id="chartUser" style="width: 380px; height: 85px;"></div>' +
            '           </td>' +
            '      </tr>' +
            '      <tr>' +
            '          <td style="vertical-align: bottom; text-align: left;" class="label">' +
            '               <label for="ativ_id_user"><i class="iconPopup iconSwitch fas fa-user-tie cinzaColor"></i>Respons\u00E1vel:</label>' +
            '           </td>' +
            '           <td ' + (callAtiv('checkOptionEntidade','exigir_atribuicao_demandas') ? 'class="required"' : '') + '>' +
            '               ' + selectResponsavel +
            '           </td>' +
            '      </tr>' +
            '      <tr>' +
            '          <td style="vertical-align: bottom; text-align: left;" class="label">' +
            '               <label for="ativ_tempo_pactuado"><i class="iconPopup iconSwitch fas fa-user-clock cinzaColor"></i>Tempo pactuado:</label>' +
            '           </td>' +
            '           <td>' +
            '               <input type="text" id="ativ_tempo_pactuado" data-key="tempo_pactuado" value="' + (value && value.tempo_pactuado ? value.tempo_pactuado : '') + '" data-tempo-pactuado="' + (value && value.tempo_pactuado ? value.tempo_pactuado : '') + '" disabled>' +
            '           </td>' +
            '      </tr>' +
            '      <tr ' + (value ? 'style="display:none"' : '') + '>' +
            '          <td style="vertical-align: bottom; text-align: left;" class="label" colspan="2">' +
            '               <table style="width: 100%; font-size: 10pt;">' +
            '                   <tr>' +
            '                       <td style="padding-top: 15px;">' +
            '                           <label for="ativ_multiplicacao"><i class="iconPopup iconSwitch fas fa-retweet cinzaColor"></i>Multiplicar ' + __.demanda + '?</label>' +
            '                       </td>' +
            '                       <td>' +
            '                           <div class="onoffswitch" style="float: right;">' +
            '                               <input type="checkbox" data-key="multiplicacao" data-act="atividades-call" data-fn="changeAtivMultiSwitch" name="onoffswitch" class="onoffswitch-checkbox" id="ativ_multiplicacao" tabindex="0">' +
            '                               <label class="onoff-switch-label" for="ativ_multiplicacao"></label>' +
            '                           </div>' +
            '                       </td>' +
            '                       <td style="width: 105px;">' +
            '                           <div id="div_ativ_fator_multiplicacao" style="text-align: right; display:none">' +
            '                               <label style="margin-right: 10px;">x</label>' +
            '                               <input type="number" min="1" style="width: 50px !important;" id="ativ_fator_multiplicacao" data-act="atividades-call" data-fn="updateAtivTempoPactuado" data-key="fator_multiplicacao" value="1">' + '' +
            '                           </div>' +
            '                       </td>' +
            '                   </tr>' +
            '               </table>' +
            '           </td>' +
            '      </tr>' +
            '      <tr class="hrForm">' +
            '           <td colspan="4">' +
            (!callAtiv('checkOptionEntidade','desativa_demandas_recorrentes') ?
                '               <div ' + (value ? 'style="display:none"' : '') + ' class="btn-group atividadesBtnModeDist" role="group" style="float: right;margin: -15px -20px 8px 0;transform: scale(0.9);">' +
                '                   <button type="button" data-act="atividades-call" data-fn="changeModeDistribuicao" data-value="Determinada" class="btn btn-sm btn-light active">' +
                '                       <i class="far fa-calendar-check" style="color: #888;"></i> <span class="text">\u00DAnica</span>' +
                '                   </button>' +
                '                   <button type="button" data-act="atividades-call" data-fn="changeModeDistribuicao" data-value="Recorrente" class="btn btn-sm btn-light">' +
                '                       <i class="fas fa-redo-alt" style="color: #888;"></i> <span class="text">Recorrente</span>' +
                '                   </button>' +
                '               </div>' +
                '' : '') +
            '           </td>' +
            '      </tr>' +
            '      </tr>' +
            '      <tr style="height: auto;">' +
            '           <td colspan="4">' +
            '               <table style="font-size: 10pt;width: 100%;">' +
            '                   <tr class="modoDistribuicao_determinada">' +
            '                       <td style="vertical-align: bottom; text-align: left;" class="label">' +
            '                            <label for="ativ_data_distribuicao"><i class="iconPopup iconSwitch fas fa-briefcase cinzaColor"></i>Data de Distribui\u00E7\u00E3o:</label>' +
            '                        </td>' +
            '                        <td class="required date" style="width: 210px;">' +
            '                            <input type="' + (config_unidade.count_horas ? 'datetime-local' : 'date') + '" data-act="atividades-call" data-fn="changeDadosTrabalho" id="ativ_data_distribuicao" ' + minDataDistribuicao + ' data-key="data_distribuicao" data-type="inicio" data-name="data de distribui\u00E7\u00E3o" value="' + dataDistribuicao + '" required>' +
            '                        </td>' +
            '                        <td style="vertical-align: bottom;" class="label">' +
            '                            <label class="last" for="ativ_prazo_entrega"><i class="iconPopup iconSwitch fas fa-business-time cinzaColor" style="float: initial;"></i>Prazo de Entrega:</label>' +
            '                        </td>' +
            '                        <td class="required date">' +
            '                            <input type="' + (config_unidade.count_horas ? 'datetime-local' : 'date') + '" data-act="atividades-call" data-fn="changeDadosTrabalho" id="ativ_prazo_entrega" data-key="prazo_entrega" data-type="fim" data-name="prazo de entrega" value="' + prazoEntrega + '" required>' +
            '                        </td>' +
            '                   </tr>' +
            '                   <tr>' +
            '                       <td style="vertical-align: bottom; text-align: left;" class="label">' +
            '                            <label for="ativ_tempo_planejado"><i class="iconPopup iconSwitch fas fa-hourglass-half cinzaColor"></i>' +
            '                            <i class="fas fa-info-circle azulColor" style="margin: 0px 2px;float: right;" data-tip="Tempo l\u00EDquido entre a data de distribui\u00E7\u00E3o ' + getNameGenre('demanda', 'do', 'da') + ' ' + __.demanda + ' e seu prazo de entrega"></i>' +
            '                            Tempo Planejado:</label>' +
            '                        </td>' +
            '                        <td style="width: 210px;">' +
            '                            <input type="number" min="1" id="ativ_tempo_planejado" data-act="atividades-call" data-fn="changeDadosTrabalho" data-key="tempo_planejado" data-type="tempo" value="' + (value && value.tempo_planejado ? value.tempo_planejado : '') + '" disabled>' +
            '                        </td>' +
            '                        <td style="vertical-align: bottom;" class="label">' +
            '                            <label class="last" for="ativ_dias_planejado"><i class="iconPopup iconSwitch fas fa-calendar-alt cinzaColor" style="float: initial;"></i><span id="ativ_dias_planejado_label">Dias ' + (config_unidade.count_dias_uteis ? '\u00FAteis' : '') + ' de Planejamento</span>:</label>' +
            '                        </td>' +
            '                        <td class="required number">' +
            '                            <input type="number" min="0" id="ativ_dias_planejado" data-act="atividades-call" data-fn="changeDadosTrabalho" data-key="dias_planejado" data-type="dias" value="' + (value && value.dias_planejado ? value.dias_planejado : '0') + '" required>' +
            '                        </td>' +
            '                   </tr>' +
            '               </table>' +
            '           </td>' +
            '      </tr>' +
            '      <tr style="height: auto;">' +
            '           <td colspan="4">' +
            '               <input type="hidden" id="ativ_recorrencia" data-key="lista_recorrencia" data-param="lista_recorrencia" value="[]">' +
            '               <table style="font-size: 10pt;width: 100%; display:none; margin-bottom: 15px;" class="modoDistribuicao_recorrente">' +
            '                   <tr>' +
            '                        <td style="vertical-align: bottom; text-align: left;" class="label">' +
            '                            <label for="ativ_modo_recorrencia"><i class="iconPopup iconSwitch fas fa-redo-alt cinzaColor"></i>Recorr\u00EAncia ' + __.da_Demanda + ':</label>' +
            '                        </td>' +
            '                        <td style="width: 210px;">' +
            '                            <select id="ativ_modo_recorrencia" data-key="modo_recorrencia" data-type="modo_recorrencia" data-act="atividades-call" data-fn="changeModoRecorrenciaFields">' +
            '                               <option value="semana1" data-view="hide">Semanal (Segundas-feira)</option>' +
            '                               <option value="semana5" data-view="hide">Semanal (Sextas-feira)</option>' +
            '                               <option value="quinzena1" data-view="hide">Quinzenal (Segundas-feira)</option>' +
            '                               <option value="quinzena5" data-view="hide">Quinzenal (Sextas-feira)</option>' +
            '                               <option value="mes_inicio" data-view="hide">Mensal (Come\u00E7o do M\u00EAs)</option>' +
            '                               <option value="mes_fim" data-view="hide">Mensal (Final do M\u00EAs)</option>' +
            '                               <option value="3mes_inicio" data-view="hide">Trimestral (Come\u00E7o do Trimestre)</option>' +
            '                               <option value="3mes_fim" data-view="hide">Trimestral (Final do Trimestre)</option>' +
            '                               <option value="6mes_inicio" data-view="hide">Semestral (Come\u00E7o do Semestre)</option>' +
            '                               <option value="6mes_fim" data-view="hide">Semestral (Final do Semestre)</option>' +
            '                               <option value="ano_inicio" data-view="hide">Anual (Come\u00E7o do Ano)</option>' +
            '                               <option value="ano_fim" data-view="hide">Anual (Final do Ano)</option>' +
            '                               <option value="diaria" data-view="hide">Di\u00E1ria</option>' +
            '                               <option value="numero_fixo_uteis" data-view="show">A cada (n) dias \u00FAteis</option>' +
            '                               <option value="numero_fixo" data-view="show">A cada (n) dias corridos</option>' +
            '                            </select>' +
            '                        </td>' +
            '                        <td colspan="2">' +
            '                           <table style="font-size: 10pt;width: 100%; display:none;" class="modoDistribuicao_recorrente_modo_recorrencia">' +
            '                               <tr>' +
            '                                   <td style="vertical-align: bottom;" class="label">' +
            '                                       <label class="last" for="ativ_recorrencia_numero_fixo" id="label_recorrencia_numero_fixo"><i class="iconPopup iconSwitch fas fa-calendar-day cinzaColor" style="float: initial;"></i>N\u00FAmero de Dias de Recorr\u00EAncia:</label>' +
            '                                       <label class="last" for="ativ_recorrencia_numero_fixo" id="label_recorrencia_numero_fixo_uteis"><i class="iconPopup iconSwitch fas fa-calendar-day cinzaColor" style="float: initial;"></i>N\u00FAmero de Dias \u00DAteis de Recorr\u00EAncia:</label>' +
            '                                   </td>' +
            '                                   <td>' +
            '                                       <input type="number" id="ativ_recorrencia_numero_fixo" data-act="atividades-call" data-fn="calculoRecorrenciaAtiv" data-key="recorrencia_numero_fixo" value="1">' +
            '                                   </td>' +
            '                               </tr>' +
            '                           </table>' +
            '                        </td>' +
            '                   </tr>' +
            '                   <tr>' +
            '                        <td style="vertical-align: bottom; text-align: left;" class="label">' +
            '                            <label for="ativ_data_inicio_recorrencia"><i class="iconPopup iconSwitch fas fa-briefcase cinzaColor"></i>Data Inicial da Recorr\u00EAncia:</label>' +
            '                        </td>' +
            '                        <td class="date" style="width: 210px;">' +
            '                            <input type="' + (config_unidade.count_horas ? 'datetime-local' : 'date') + '" data-act="atividades-call" data-fn="calculoRecorrenciaAtiv" id="ativ_data_inicio_recorrencia" data-key="data_inicio_recorrencia" data-name="data inicial de eecorr\u00EAncia" value="' + dataDistribuicao + '">' +
            '                        </td>' +
            '                        <td style="vertical-align: baseline;padding-top: 18px;" class="label">' +
            '                            <label class="last" for="ativ_modo_fim_recorrencia"><i class="iconPopup iconSwitch fas fa-business-time cinzaColor" style="float: initial;"></i>Data Final da Recorr\u00EAncia:</label>' +
            '                        </td>' +
            '                        <td>' +
            '                            <select id="ativ_modo_fim_recorrencia" data-key="modo_fim_recorrencia" data-type="fim_recorrencia" data-act="atividades-call" data-fn="changeModoRecorrenciaFields">' +
            '                               <option value="plano_trabalho" data-view="hide">Fim do Plano de Trabalho</option>' +
            '                               <option value="data_determinada" data-view="show">Data determinada</option>' +
            '                            </select>' +
            '                        </td>' +
            '                   </tr>' +
            '                   <tr style="display:none;" class="modoDistribuicao_recorrente_fim_recorrencia">' +
            '                        <td style="vertical-align: bottom; text-align: left;" class="label" colspan="2">' +
            '                        </td>' +
            '                        <td>' +
            '                        </td>' +
            '                        <td class="date">' +
            '                            <input type="' + (config_unidade.count_horas ? 'datetime-local' : 'date') + '" data-act="atividades-call" data-fn="calculoRecorrenciaAtiv" id="ativ_data_fim_recorrencia" data-key="data_fim_recorrencia" data-name="data final de recorr\u00EAncia" value="' + prazoEntrega + '">' +
            '                        </td>' +
            '                   </tr>' +
            '                   <tr>' +
            '                        <td style="vertical-align: top; text-align: center;" class="label" colspan="4">' +
            '                           <div id="ganttRecorrenciaPanel" class="seipro-atividades-gantt-recorrencia" style="max-width: 725px;position: relative;"></div>' +
            '                        </td>' +
            '                   </tr>' +
            '               </table>' +
            '           </td>' +
            '      </tr>' +
            (callAtiv('checkOptionEntidade','exigir_homologacao_programas') ?
                '      <tr>' +
                '          <td style="vertical-align: bottom; text-align: left;" class="label">' +
                '               <label for="ativ_id_entrega"><i class="iconPopup iconSwitch fas fa-hand-holding cinzaColor"></i>Entrega:</label>' +
                '           </td>' +
                '           <td colspan="3" style="text-align: left;">' +
                '               <select id="ativ_id_entrega" data-act="atividades-call" data-fn="changeSelectEntregas" data-key="id_entrega" data-old_id_entrega="' + (value && value.id_entrega ? value.id_entrega : 'false') + '" data-type="number"><option>&nbsp;</option><option disabled>Selecione um respons\u00E1vel antes de vincular uma entrega</option></select>' +
                '               <a class="newLink linkDialogEntrega" style="cursor: pointer;display:none;" data-act="atividades-call" data-fn="openDialogEntrega" data-tip="Visualiza\u00E7\u00E3o detalhes da entrega">' +
                '                   <i class="fas fa-eye" style="font-size: 80%;"></i>' +
                '               </a>' +
                '           </td>' +
                '      </tr>' +
                '' : '') +
            '   </table>' +
            '   </div>' +
            '   <div id="tabs_' + idBox + '_avancado">' +
            '   <table style="font-size: 10pt;width: 100%;" class="seiProForm tableLine">' +
            '      <tr style="height: auto;">' +
            '           <td colspan="4">' +
            '               <table style="font-size: 10pt;width: 100%;">' +
            '                   <tr>' +
            '                       <td style="padding-top: 15px; width: 130px; text-align: left;">' +
            '                           <label for="ativ_recalcula_prazo"><i class="iconPopup iconSwitch fas fa-calendar-check cinzaColor"></i>Prazo M\u00F3vel?</label>' +
            '                       </td>' +
            '                       <td style="width: 50px; text-align: left;">' +
            '                           <div class="onoffswitch">' +
            '                               <input type="checkbox" data-key="recalcula_prazo" data-act="atividades-call" data-fn="changeAtivRecalcPrazoSwitch" name="onoffswitch" class="onoffswitch-checkbox" id="ativ_recalcula_prazo" tabindex="0" data-mode-insert="' + (value && typeof value.recalcula_prazo !== 'undefined' ? 'manual' : 'auto') + '" ' + (value && typeof value.recalcula_prazo !== 'undefined' && value.recalcula_prazo == 1 ? 'checked' : '') + '>' +
            '                               <label class="onoff-switch-label" for="ativ_recalcula_prazo"></label>' +
            '                           </div>' +
            '                       </td>' +
            '                       <td style="text-align: left;">' +
            '                           <span style="color: #777; ' + (value && value.recalcula_prazo ? '' : 'display:none;') + '" class="infoAtivRecalcPrazo">' +
            '                               <i class="fas fa-info-circle laranjaColor" style="float: initial;"></i> Recalcula o prazo de entrega assim que ' + __.a_demanda + ' for ' + getNameGenre('demanda', 'iniciado', 'iniciada') + ', acrescentando o n\u00FAmero de dias de planejamento ao prazo final.' +
            '                           </span>' +
            '                       </td>' +
            '                   </tr>' +
            '                   <tr id="trAtivMarcador" ' + (dadosIfrArvore ? '' : 'style="display:none"') + '>' +
            '                       <td style="vertical-align: bottom; text-align: left;" class="label" colspan="4">' +
            '                            <table style="width: 100%; font-size: 10pt;">' +
            '                                <tr>' +
            '                                    <td style="padding-top: 15px; width: 130px; text-align: left;">' +
            '                                        <label for="ativ_marcador"><i class="iconPopup iconSwitch fas fa-clock cinzaColor"></i>Adicionar Prazo no Processo?</label>' +
            '                                    </td>' +
            '                                    <td style="width: 50px; text-align: left;">' +
            '                                        <div class="onoffswitch">' +
            '                                            <input type="checkbox" data-key="marcador" data-act="atividades-call" data-fn="changeAtivMarcadorSwitch" name="onoffswitch" class="onoffswitch-checkbox" id="ativ_marcador" tabindex="0">' +
            '                                            <label class="onoff-switch-label" for="ativ_marcador"></label>' +
            '                                        </div>' +
            '                                    </td>' +
            '                                    <td>' +
            '                                        <div id="div_ativ_lista_marcador" style="text-align: right; display:none;width: 530px !important;">' +
            '                                            <select id="ativ_lista_marcador" data-key="id_marcador">' +
            '                                           </select>' +
            '                                        </div>' +
            '                                    </td>' +
            '                                </tr>' +
            '                            </table>' +
            '                        </td>' +
            '                   </tr>' +
            '                   <tr id="trAtivVinculacao" ' + (value ? 'style="display:none"' : '') + '>' +
            '                       <td style="vertical-align: bottom; text-align: left;" class="label" colspan="4">' +
            '                            <table style="width: 100%; font-size: 10pt;">' +
            '                                <tr>' +
            '                                    <td style="padding-top: 15px; width: 130px; text-align: left;">' +
            '                                        <label for="ativ_vinculacao"><i class="iconPopup iconSwitch fas fa-random cinzaColor"></i>Vincular ' + __.demanda + '?</label>' +
            '                                    </td>' +
            '                                    <td style="width: 50px; text-align: left;">' +
            '                                        <div class="onoffswitch">' +
            '                                            <input type="checkbox" data-key="vinculacao" data-act="atividades-call" data-fn="changeAtivVinculacaoSwitch" name="onoffswitch" class="onoffswitch-checkbox" id="ativ_vinculacao" tabindex="0">' +
            '                                            <label class="onoff-switch-label" for="ativ_vinculacao"></label>' +
            '                                        </div>' +
            '                                    </td>' +
            '                                    <td>' +
            '                                        <div id="div_ativ_lista_vinculacao" style="text-align: right; display:none;width: 530px !important;">' +
            '                                            <select id="ativ_lista_vinculacao" data-key="lista_vinculacao">' +
            '                                               <option value="0">&nbsp;</option>' +
            '                                               ' + callAtiv('getListAtivVinculacao',) +
            '                                           </select>' +
            '                                        </div>' +
            '                                    </td>' +
            '                                </tr>' +
            '                            </table>' +
            '                        </td>' +
            '                   </tr>' +
            '                   <tr id="trAtivPrioridade" ' + (!value ? 'style="display:none"' : '') + '>' +
            '                       <td style="vertical-align: bottom; text-align: left;" class="label" colspan="4">' +
            '                            <table style="width: 100%; font-size: 10pt;">' +
            '                                <tr>' +
            '                                    <td style="padding-top: 15px; width: 130px; text-align: left;">' +
            '                                        <label for="ativ_prioridades"><i class="iconPopup iconSwitch fas fa-exclamation cinzaColor"></i>Priorizar ' + __.demanda + '?</label>' +
            '                                    </td>' +
            '                                    <td style="width: 50px; text-align: left;">' +
            '                                        <div class="onoffswitch">' +
            '                                            <input type="checkbox" data-key="prioridades" data-act="atividades-call" data-fn="changeAtivPrioritySwitch" name="onoffswitch" class="onoffswitch-checkbox" id="ativ_prioridades" tabindex="0">' +
            '                                            <label class="onoff-switch-label" for="ativ_prioridades"></label>' +
            '                                        </div>' +
            '                                    </td>' +
            '                                    <td>' +
            '                                        <div id="div_ativ_lista_prioridades" style="text-align: right; display:none;width: 530px !important;">' +
            '                                            <select id="ativ_lista_prioridades" data-key="lista_prioridades"><option value="0">&nbsp;</option></select>' +
            '                                        </div>' +
            '                                    </td>' +
            '                                </tr>' +
            '                            </table>' +
            '                        </td>' +
            '                   </tr>' +
            (value ?
                '                   <tr id="trAtivChecklist">' +
                '                       <td style="vertical-align: bottom; text-align: left;" class="label" colspan="4">' +
                '                            <table style="width: 100%; font-size: 10pt;">' +
                '                                <tr>' +
                '                                    <td style="padding-top: 15px; width: 130px; text-align: left;">' +
                '                                        <label for="ativ_insert_checklist"><i class="iconPopup iconSwitch fas fa-check-double cinzaColor"></i>Checklist</label>' +
                '                                    </td>' +
                '                                    <td style="text-align: left;">' +
                '                                       ' + callAtiv('getInfoAtividadeChecklist',value, 'actions') +
                '                                    </td>' +
                '                                </tr>' +
                '                            </table>' +
                '                       </td>' +
                '                   </tr>'
                :
                '                   <tr id="trAtivChecklist">' +
                '                       <td style="vertical-align: bottom; text-align: left;" class="label" colspan="4">' +
                '                            <input type="hidden" id="ativ_checklist" data-key="lista_checklist" data-param="lista_checklist" value="' + (value && value.checklist ? value.checklist : '') + '">' +
                '                            <table style="width: 100%; font-size: 10pt;">' +
                '                                <tr>' +
                '                                    <td style="padding-top: 15px; width: 130px; text-align: left;">' +
                '                                        <label for="ativ_insert_checklist"><i class="iconPopup iconSwitch fas fa-check-double cinzaColor"></i>Inserir <br>Checklist?</label>' +
                '                                    </td>' +
                '                                    <td style="width: 50px; text-align: left;">' +
                '                                        <div class="onoffswitch">' +
                '                                            <input type="checkbox" data-key="checklist" data-act="atividades-call" data-fn="changeAtivChecklistSwitch" name="onoffswitch" class="onoffswitch-checkbox" id="ativ_insert_checklist" tabindex="0">' +
                '                                            <label class="onoff-switch-label" for="ativ_insert_checklist"></label>' +
                '                                        </div>' +
                '                                    </td>' +
                '                                    <td>' +
                '                                        <div id="div_ativ_lista_checklist" class="tabelaPanelScroll" style="text-align: right; display:none;">' +
                '                                            <table id="ativBox_checklist" data-format="array" data-key="checklist" data-mode-insert="' + (value && value.checklist ? 'manual' : 'auto') + '" style="font-size: 8pt !important;width: 100%; margin:0" class="tableOptionConfig tableSortable seiProForm tableDialog tableInfo tableZebraOdd tableFollow tableAtividades seipro-atividades-table">' +
                '                                                 <thead>' +
                '                                                    <tr>' +
                '                                                        <th colspan="3" style="text-align: right;">' +
                '                                                            <a class="newLink addConfigItem" data-act="atividades-call" data-fn="addConfigItem" style="cursor: pointer; margin: 5px;display: inline-block;">' +
                '                                                                <i class="fas fa-plus-circle cinzaColor" style="padding-right: 3px; cursor: pointer; font-size: 12pt;"></i>' +
                '                                                                Adicionar novo item' +
                '                                                            </a>' +
                '                                                        </th>' +
                '                                                    </tr>' +
                '                                                 </thead>' +
                '                                                 <tbody>' +
                '                                                 </tbody>' +
                '                                            </table>' +
                '                                        </div>' +
                '                                    </td>' +
                '                                </tr>' +
                '                            </table>' +
                '                        </td>' +
                '                   </tr>' +
                '') +
            '                   <tr>' +
            '                       <td style="vertical-align: middle; text-align: left;" class="label">' +
            '                            <label for="ativ_observacao_gerencial"><i class="iconPopup iconSwitch fas fa-comment-alt cinzaColor"></i>' + __.Observacao + ' ' + __.Gerencial + ':</label>' +
            '                        </td>' +
            '                        <td colspan="3" style="text-align: left;">' +
            '                            <textarea type="text" id="ativ_observacao_gerencial" ' + (value ? 'data-act="atividades-call" data-fn="userTyped" data-on="input"' : 'data-act="atividades-composite" data-chain="checkboxAnotacoesProcessoAtiv|userTyped" data-on="input"') + ' style="width: 97%;" data-key="observacao_gerencial">' + ((value && value.observacao_gerencial !== null && value.observacao_gerencial != '') ? value.observacao_gerencial : '') + '</textarea>' +
            '' + ($('#ifrArvore').length > 0 ?
                '                               <table style="width: 100%;font-size: 10pt; display:none" id="tableAnotacoesProcessoAtiv">' +
                '                                   <tbody>' +
                '                                       <tr style="height: 40px;">' +
                '                                           <td style="text-align: left;vertical-align: bottom;">' +
                '                                               <label for="ativ_anotacoes_processo">' +
                '                                                   <i class="iconPopup iconSwitch fas fa-sticky-note cinzaColor"></i>Adicionar ' + __.observacao + ' ' + __.gerencial + ' nas anota\u00E7\u00F5es do processo?</label>' +
                '                                           </td>' +
                '                                           <td style="width: 50px;">' +
                '                                               <div class="onoffswitch" style="float: right;">' +
                '                                                   <input type="checkbox" data-key="anotacoes_processo" name="onoffswitch" class="onoffswitch-checkbox" id="ativ_anotacoes_processo" tabindex="0">' +
                '                                                   <label class="onoff-switch-label" for="ativ_anotacoes_processo"></label>' +
                '                                               </div>' +
                '                                           </td>' +
                '                                       </tr>' +
                '                                   </tbody>' +
                '                               </table>' +
                '' : '') +
            '                        </td>' +
            '                   </tr>' +
            '                   <tr>' +
            '                       <td style="vertical-align: bottom; text-align: left;" class="label">' +
            '                            <label for="ativ_etiquetas"><i class="iconPopup iconSwitch fas fa-tags cinzaColor"></i>Etiquetas:</label>' +
            '                        </td>' +
            '                        <td colspan="3">' +
            '                            <input type="text" id="ativ_etiquetas" class="seipro-atividades-etiquetas" data-key="etiquetas" value="' + (value && value.etiquetas ? (value.etiquetas !== null && value.etiquetas.length > 0 ? value.etiquetas.join(';') : '') : '') + '">' +
            '                        </td>' +
            '                   </tr>' +
            '               </table>' +
            '           </td>' +
            '       </tr>' +
            '   </table>' +
            '   </div>' +
            '</div>';

        var btnDialogBoxPro = [{
            text: (id_demanda != 0) ? 'Editar' : 'Salvar',
            class: 'confirm',
            click: function (event) {
                if (callAtiv('checkAtivRequiredFields',this, 'mark')) {
                    var action = (id_demanda != 0) ? 'edit_atividade' : 'save_atividade';
                    var param = callAtiv('extractDataAtiv',this);
                    param.action = action;
                    var id_plano = jmespath.search(arrayConfigAtividades.planos, "[?id_user==`" + param.id_user + "`] | [0].id_plano");
                    id_plano = (id_plano === null) ? 0 : id_plano;
                    if (!callAtiv('checkCapacidade','check_entregas_atividades') || typeof param.id_plano === 'undefined') param.id_plano = id_plano;
                    var id_atividade = (param.id_atividade.trim() == '') ? 0 : param.id_atividade;
                    param.id_atividade = id_atividade;
                    getServerAtividades(param, action);
                }
            }
        }];
        if (id_demanda != 0) {
            if (value.data_inicio != '0000-00-00 00:00:00') {
                if (callAtiv('checkCapacidade','complete_atividade') || callAtiv('checkCapacidade','complete_edit_atividade')) {
                    btnDialogBoxPro.unshift({
                        text: (value.data_entrega == '0000-00-00 00:00:00') ? 'Concluir ' + __.Demanda + '' : 'Editar Conclus\u00E3o',
                        icon: 'ui-icon-check',
                        click: function (event) {
                            callAtiv('completeAtividade',id_demanda);
                        }
                    });
                }
            } else {
                if (callAtiv('checkCapacidade','start_atividade')) {
                    btnDialogBoxPro.unshift({
                        text: 'Iniciar Execu\u00E7\u00E3o',
                        icon: 'ui-icon-play',
                        click: function (event) {
                            callAtiv('startAtividade',id_demanda);
                        }
                    });
                }
            }
            btnDialogBoxPro.unshift({
                text: 'Gerar Notifica\u00E7\u00E3o',
                icon: 'ui-icon-mail-closed',
                click: function (event) {
                    callAtiv('notifyAtividade',id_demanda, event);
                }
            });
            if (callAtiv('checkCapacidade','delete_atividade') || callAtiv('checkCapacidade','delete_atividade_all')) {
                btnDialogBoxPro.unshift({
                    text: 'Excluir',
                    icon: 'ui-icon-trash',
                    click: function (event) {
                        if (value.data_avaliacao != '0000-00-00 00:00:00') {
                            confirmaFraseBoxPro(__.A_demanda + ' j\u00E1 possui avalia\u00E7\u00E3o cadastrada. Tem certeza que deseja excluir?', 'EXCLUIR', function () { callAtiv('deleteAtividade',id_demanda) });
                        } else if (value.data_entrega != '0000-00-00 00:00:00') {
                            confirmaFraseBoxPro(__.A_demanda + ' j\u00E1 possui entrega realizada. Tem certeza que deseja excluir?', 'EXCLUIR', function () { callAtiv('deleteAtividade',id_demanda) });
                        } else {
                            confirmaBoxPro('Tem certeza que deseja excluir ' + __.esta_demanda + '?', function () { callAtiv('deleteAtividade',id_demanda) }, 'Excluir');
                        }
                    }
                });
            }
        } else {
            if (callAtiv('checkCapacidade','edit_atividade')) {
                btnDialogBoxPro.unshift({
                    text: 'Editar ' + __.Demandas,
                    icon: 'ui-icon-pencil',
                    click: function (event) {
                        callAtiv('selectAtividadeBox','edit');
                    }
                });
                if (callAtiv('checkOptionEntidade','cadastro_simplificado')) {
                    btnDialogBoxPro.unshift({
                        text: 'Cadastro Simplificado',
                        icon: 'ui-icon-check',
                        click: function (event) {
                            changeSaveAtividade('simple');
                        }
                    });
                }
            }
            if (callAtiv('checkCapacidade','save_atividade_rapida')) {
                btnDialogBoxPro.unshift({
                    text: 'Cadastro R\u00E1pido',
                    icon: 'ui-icon-check',
                    click: function (event) {
                        changeSaveAtividade('quick');
                    }
                });
            }
        }

        var titleBox = (id_demanda != 0)
            ? 'Editar ' + __.demanda + ': ' + callAtiv('getTitleDialogBox',value)
            : 'Criar  ' + __.nova_demanda;
        resetDialogBoxPro('dialogBoxPro');
        dialogBoxPro = $('#dialogBoxPro')
            .html('<div class="dialogBoxDiv">' + htmlBox + '</div>')
            .dialog({
                title: titleBox,
                width: 780,
                open: function () {
                    prepareFieldsReplace(this);
                    if ($('#' + idBox + '_tabs').length > 0) {
                        $('#' + idBox + '_tabs').tabs();
                    }
                    setTimeout(function () {
                        centralizeDialogBox(dialogBoxPro);
                    }, 100);
                },
                close: function () {
                    $('#boxAtividade').remove();
                    callAtiv('cancelSelectedItensAtiv',id_demanda)
                    resetDialogBoxPro('dialogBoxPro');
                },
                buttons: btnDialogBoxPro
            });
        checkTagsIput();

        var selectAtiv = $('#ativ_id_atividade');
        var selectUser = $('#ativ_id_user');
        if (id_demanda != 0) {
            var selectComplexidade = $('#ativ_fator_complexidade');
            var inputPrazoEntrega = $('#ativ_prazo_entrega');
            selectAtiv.trigger('change');
            selectUser.trigger('change');
            selectComplexidade.val(value.fator_complexidade).trigger('change');
            inputPrazoEntrega.trigger('change');
        }
        if (dadosIfrArvore && id_demanda == 0) {
            var tipo_processo = dadosIfrArvore.tipo;
            var usuario = dadosIfrArvore.usuario;
            var prazo = dadosIfrArvore.prazo;
            if (tipo_processo) {
                selectAtiv.find('option').each(function () {
                    var config = $(this).data('config');
                    var config_tipo_processo = (typeof config !== 'undefined' && typeof config.tipo_processo !== 'undefined') ? config.tipo_processo : [];

                    if (config && config_tipo_processo.length > 0 && $.inArray(tipo_processo, config_tipo_processo) !== -1) {
                        selectAtiv.val($(this).val()).trigger('change');
                        return false;
                    }
                });
            }
            if (usuario) {
                selectUser.find('option').each(function () {
                    var text = $(this).text().toLowerCase();
                    if (text == usuario.toLowerCase()) {
                        if ($(this).prop('disabled') == false && $(this).closest('optgroup').prop('disabled') == false) {
                            selectUser.val($(this).val()).trigger('change');
                            return false;
                        }
                    }
                });
            }
            if (prazo) { $('#ativ_dias_planejado').val(prazo).trigger('change') }
        }
        if (!callAtiv('checkCapacidade','select_user_atividade')) {
            selectUser.val(arrayConfigAtividades.perfil.id_user).trigger('change');
        }
        if (checkProcessoHome) {
            multProcessUpdateInput();
        }
    }
}
// BOX DE DEMANDA RAPIDA
export function saveAtividadeQuick(id_demanda = 0) {
    var checkPlanos = (typeof arrayConfigAtividades.planos !== 'undefined' && arrayConfigAtividades.planos != 0 && arrayConfigAtividades.planos.length > 0) ? true : false;
    if (!checkPlanos) {
        alertaBoxPro('Error', 'exclamation-triangle', 'Nenhum plano de trabalho ativo!');
    } else {
        var value = callAtiv('getAtividadeData',id_demanda);
        var unidades = (typeof arrayConfigAtividades.atividades !== 'undefined' && arrayConfigAtividades.atividades != 0 && arrayConfigAtividades.atividades.length > 0)
            ? uniqPro(jmespath.search(arrayConfigAtividades.atividades, "[?sigla_unidade].sigla_unidade"))
            : [];
        var countUnidades = (arrayConfigAtividades.atividades.length > 0) ? unidades.length : 0;
        var unidadesPlanos = (checkPlanos)
            ? uniqPro(jmespath.search(arrayConfigAtividades.planos, "[?sigla_unidade].sigla_unidade"))
            : [];
        var countUnidadesPlanos = (checkPlanos) ? unidadesPlanos.length : 0;
        var config_unidade = callAtiv('getConfigDadosUnidade',(id_demanda != 0 ? value.sigla_unidade : null));
        var dadosIfrArvore = getIfrArvoreDadosProcesso();
        var dt_init = (dadosIfrArvore && dadosIfrArvore.data_documento && dadosIfrArvore.data_documento != '')
            ? moment(dadosIfrArvore.data_documento, 'DD/MM/YYYY HH:mm') : moment();
        var hr_init = dt_init.format('HH:mm');
        var dataDistribuicao = dt_init.format(config_unidade.hora_format);
        dataDistribuicao = (moment(hr_init, 'HH:mm') > moment(config_unidade.h_util_fim, 'HH:mm'))
            ? moment(dt_init.format('YYYY-MM-DD') + 'T' + config_unidade.h_util_fim).add(-1, 'hours').format(config_unidade.hora_format)
            : dataDistribuicao;
        dataDistribuicao = (moment(hr_init, 'HH:mm') < moment(config_unidade.h_util_inicio, 'HH:mm'))
            ? moment(dt_init.format('YYYY-MM-DD') + 'T' + config_unidade.h_util_inicio).format(config_unidade.hora_format)
            : dataDistribuicao;
        var prazoEntrega = dt_init.add(1, 'hours').format(config_unidade.hora_format);
        prazoEntrega = (moment(hr_init, 'HH:mm') > moment(config_unidade.h_util_fim, 'HH:mm'))
            ? moment(dt_init.format('YYYY-MM-DD') + 'T' + config_unidade.h_util_fim).format(config_unidade.hora_format)
            : prazoEntrega;
        prazoEntrega = (moment(hr_init, 'HH:mm') < moment(config_unidade.h_util_inicio, 'HH:mm'))
            ? moment(dt_init.format('YYYY-MM-DD') + 'T' + config_unidade.h_util_inicio).add(1, 'hours').format(config_unidade.hora_format)
            : prazoEntrega;

        var dataInicio = dataDistribuicao;
        var dataEntrega = dataDistribuicao;

        var optionSelectRequisicoes = (arrayConfigAtividades.tipos_requisicoes.length > 0) ? $.map(arrayConfigAtividades.tipos_requisicoes, function (v, k) { return ((value && v.id_tipo_requisicao == value.id_tipo_requisicao) || (dadosIfrArvore && dadosIfrArvore.nome_documento.indexOf(v.nome_requisicao) !== -1)) ? '<option value="' + v.id_tipo_requisicao + '" selected>' + v.nome_requisicao + '</option>' : '<option value="' + v.id_tipo_requisicao + '">' + v.nome_requisicao + '</option>' }).join('') : '';
        var selectRequisicoes = '<select id="ativ_id_tipo_requisicao" data-act="atividades-call" data-fn="checkThisAtivRequiredFields" data-key="id_tipo_requisicao" required><option value="0"></option>' + optionSelectRequisicoes + '</select>';
        selectRequisicoes = (callAtiv('checkOptionEntidade','dispensa_tipos_requisicao')) ? '<input type="hidden" id="ativ_id_tipo_requisicao" data-key="id_tipo_requisicao" data-param="id_tipo_requisicao" value="0">' : selectRequisicoes;

        var optionSelectAtividades = '';
        var arrayTabelaAtividades = arrayConfigAtividades.atividades;
        if (countUnidades > 1) {
            $.each(unidades, function (index, v) {
                var arrayAtiv = jmespath.search(arrayTabelaAtividades, "[?sigla_unidade=='" + v + "']");
                optionSelectAtividades += '<optgroup label="' + v + '">' +
                    '   ' + callAtiv('getOptionsSelectAtivGroup',arrayAtiv, value, true) +
                    '</optgroup>';
            });
        } else {
            optionSelectAtividades += callAtiv('getOptionsSelectAtivGroup',arrayTabelaAtividades, value, true);
        }
        var selectAtividades = '<select id="ativ_id_atividade" class="requiredSelect" data-key="id_atividade" data-act="atividades-composite" data-chain="changeAtivSelect|repairTemposDemandaQuick"><option value="0"></option>' + optionSelectAtividades + '</select>';

        var optionSelectResponsavel = '';
        if (countUnidadesPlanos > 1) {
            $.each(unidadesPlanos, function (index, v) {
                var arrayResp = jmespath.search(arrayConfigAtividades.planos, "[?sigla_unidade=='" + v + "'] | [?vigencia==`true`]");
                optionSelectResponsavel += '<optgroup label="' + v + '">';
                optionSelectResponsavel += callAtiv('getOptionsSelectResp',arrayResp, value);
                optionSelectResponsavel += '</optgroup>';
            });
        } else {
            var arrayResp = jmespath.search(arrayConfigAtividades.planos, "[?vigencia==`true`]");
            optionSelectResponsavel += callAtiv('getOptionsSelectResp',arrayResp, value);
        }

        var selectResponsavel = '<select id="ativ_id_user" class="requiredSelect" data-key="id_user" data-type="user" data-act="atividades-composite" data-chain="updateAtivSelectUser|repairTemposDemandaQuick"><option value="0"></option>' + optionSelectResponsavel + '</select>';
        var optionSelectDocumentos = (arrayConfigAtividades.tipos_documentos.length > 0) ? $.map(arrayConfigAtividades.tipos_documentos, function (v, k) { return ((value && v.id_tipo_documento == value.id_tipo_documento) || (dadosIfrArvore && dadosIfrArvore.nome_documento.indexOf(v.nome_documento) !== -1)) ? '<option value="' + v.id_tipo_documento + '" selected>' + v.nome_documento + '</option>' : '<option value="' + v.id_tipo_documento + '">' + v.nome_documento + '</option>' }).join('') : '';
        var selectDocumentos = '<select id="ativ_id_tipo_documento" data-act="atividades-call" data-fn="checkThisAtivRequiredFields" data-key="id_tipo_documento" required><option value="0"></option>' + optionSelectDocumentos + '</select>';
        selectDocumentos = (callAtiv('checkOptionEntidade','dispensa_tipos_requisicao')) ? '<input type="hidden" id="ativ_id_tipo_documento" data-key="id_tipo_documento" data-param="id_tipo_documento" value="0">' : selectDocumentos;
        // var prazoDemandasRetroativas = checkOptionEntidade('limitar_demandas_retroativas') && checkOptionEntidade('prazo_demandas_retroativas') ? getOptionEntidade('prazo_demandas_retroativas') : false;
        // var minDataDistribuicao = prazoDemandasRetroativas ? 'min="'+moment().add(-prazoDemandasRetroativas, 'days').format('YYYY-MM-DDTHH:mm')+'"' : '';
        var minDataDistribuicao = '';

        var htmlBox = '<div id="boxAtividade" class="seipro-atividades-box atividadeWork seipro-atividades-work" data-demanda="' + (value && value.id_demanda ? value.id_demanda : 0) + '">' +
            '   <table style="font-size: 10pt;width: 100%;" class="seiProForm">' +
            '      <tr style="display:none;">' +
            '           <td style="display:nones;">' +
            '               ' + selectRequisicoes +
            '               ' + selectDocumentos +
            '               <input type="hidden" id="ativ_id_demanda" data-key="id_demanda" data-param="id_demanda" value="' + id_demanda + '">' +
            '               <input type="hidden" id="ativ_processo_sei" data-act="atividades-call" data-fn="changeProtocoloBoxAtiv" data-key="processo_sei" value="' + (value && value.processo_sei ? value.processo_sei : (dadosIfrArvore ? dadosIfrArvore.processo_sei : '')) + '">' +
            '               <input type="hidden" id="ativ_id_procedimento" data-key="id_procedimento" data-param="id_procedimento" value="' + (value && value.id_procedimento ? value.id_procedimento : (dadosIfrArvore ? dadosIfrArvore.id_procedimento : '')) + '">' +
            '               <input type="hidden" id="ativ_numero_documento" data-act="atividades-call" data-fn="checkThisAtivRequiredFields" maxlength="255" data-key="numero_documento" value="' + (value && value.numero_documento !== null ? value.numero_documento : (dadosIfrArvore && dadosIfrArvore.numero_documento ? dadosIfrArvore.numero_documento : '')) + '">' +
            '               <input type="hidden" data-input-filter="digits" id="ativ_documento_sei" data-act="atividades-call" data-fn="changeProtocoloBoxAtiv" maxlength="11" data-key="documento_sei" value="' + (value && value.documento_sei !== null && parseInt(value.documento_sei) != 0 ? value.documento_sei : (dadosIfrArvore && dadosIfrArvore.nr_sei ? dadosIfrArvore.nr_sei : '')) + '">' +
            '               <input type="hidden" id="ativ_id_documento_entregue" data-key="id_documento_entregue" data-param="id_documento_entregue" value="' + (value && value.id_documento_entregue !== null && value.id_documento_entregue != '0' ? value.id_documento_entregue : (dadosIfrArvore && dadosIfrArvore.id_documento ? dadosIfrArvore.id_documento : '')) + '">' +
            '               <input type="hidden" min="0" id="ativ_dias_executado" data-act="atividades-call" data-fn="changeDadosTrabalho" data-key="dias_executado" data-type="dias_executado" value="' + (value && value.dias_executado ? value.dias_executado : '0') + '" required>' +
            '               <input type="hidden" min="0.1" step=".1" id="ativ_tempo_executado" data-key="tempo_executado" data-type="tempo_executado" value="' + (value && value.tempo_executado ? value.tempo_executado : '0') + '" disabled>' +
            '               <input type="hidden" min="0" id="ativ_dias_despendido" data-act="atividades-call" data-fn="changeDadosTrabalho" data-key="dias_despendido" data-type="dias" value="' + (value && value.dias_despendido ? value.dias_despendido : '0') + '" required>' +
            '               <input type="hidden" min="0.1" step=".1" id="ativ_tempo_despendido" data-act="atividades-call" data-fn="changeDadosTrabalho" data-key="tempo_despendido" data-type="tempo" value="' + (value && value.tempo_despendido ? value.tempo_despendido : '0') + '" disabled>' +
            '               <input type="hidden" data-input-filter="digits" id="ativ_requisicao_sei" data-act="atividades-call" data-fn="changeProtocoloBoxAtiv" data-key="requisicao_sei" value="' + (value && value.requisicao_sei ? value.requisicao_sei : (dadosIfrArvore ? dadosIfrArvore.nr_sei : '')) + '">' +
            '               <input type="hidden" id="ativ_id_documento_requisicao" data-key="id_documento_requisicao" data-param="id_documento" value="' + (value && value.id_documento_requisicao ? value.id_documento_requisicao : (dadosIfrArvore ? dadosIfrArvore.id_documento : '')) + '">' +
            '               <input type="hidden" min="1" id="ativ_tempo_planejado" data-act="atividades-call" data-fn="changeDadosTrabalho" data-key="tempo_planejado" data-type="tempo" value="' + (value && value.tempo_planejado ? value.tempo_planejado : '') + '" disabled>' +
            '               <input type="hidden" min="0" id="ativ_dias_planejado" data-act="atividades-call" data-fn="changeDadosTrabalho" data-key="dias_planejado" data-type="dias" value="' + (value && value.dias_planejado ? value.dias_planejado : '0') + '" required>' +
            '               <input type="' + (config_unidade.count_horas ? 'datetime-local' : 'date') + '" data-act="atividades-call" data-fn="changeDadosTrabalho" id="ativ_data_distribuicao" ' + minDataDistribuicao + ' data-key="data_distribuicao" data-type="inicio" data-name="data de distribui\u00E7\u00E3o" value="' + dataDistribuicao + '" required>' +
            '               <input type="' + (config_unidade.count_horas ? 'datetime-local' : 'date') + '" data-act="atividades-call" data-fn="changeDadosTrabalho" id="ativ_prazo_entrega" data-key="prazo_entrega" data-type="fim" data-name="prazo de entrega" value="' + prazoEntrega + '" required>' +
            '               <input type="hidden" id="ativ_tempo_pactuado" data-key="tempo_pactuado" value="' + (value && value.tempo_pactuado ? value.tempo_pactuado : '') + '" data-tempo-pactuado="' + (value && value.tempo_pactuado ? value.tempo_pactuado : '') + '" disabled>' +
            '               <input type="hidden" id="ativ_id_plano" data-key="id_plano" data-param="id_plano" value="' + (value && value.id_plano ? value.id_plano : '0') + '">' +
            '           </td>' +
            '      </tr>' +
            '      <tr>' +
            '          <td style="vertical-align: bottom; text-align: left;" class="label">' +
            '               <label for="ativ_assunto"><i class="iconPopup iconSwitch fas fa-comment-dots cinzaColor"></i>' + __.Assunto + ':</label>' +
            '           </td>' +
            '           <td class="required" colspan="3">' +
            '               <input type="text" id="ativ_assunto" data-act="atividades-call" data-fn="checkThisAtivRequiredFields" maxlength="255" data-key="assunto" value="' + (value && value.assunto ? value.assunto : (dadosIfrArvore && dadosIfrArvore.assunto ? dadosIfrArvore.assunto : '')) + '" required>' +
            '           </td>' +
            '      </tr>' +
            '      <tr>' +
            '          <td style="vertical-align: bottom; text-align: left;" class="label">' +
            '               <label for="ativ_id_atividade"><i class="iconPopup iconSwitch fas fa-clipboard-list cinzaColor"></i>' + __.Atividade + ':</label>' +
            '           </td>' +
            '           <td class="required" colspan="3">' +
            '               ' + selectAtividades +
            '               <input type="hidden" id="ativ_id_unidade" data-key="id_unidade" data-param="id_unidade" value="">' +
            '           </td>' +
            '      </tr>' +
            '      <tr>' +
            '           <td style="vertical-align: bottom; text-align: left;" class="label">' +
            '               <label for="ativ_fator_complexidade"><i class="iconPopup iconSwitch fas fa-graduation-cap cinzaColor"></i>Grau de ' + __.Complexidade + ':</label>' +
            '           </td>' +
            '           <td class="required">' +
            '               <select id="ativ_fator_complexidade" class="requiredSelect" data-key="fator_complexidade" data-act="atividades-composite" data-chain="updateAtivTempoPactuado|repairTemposDemandaQuick"><option>&nbsp;</option></select>' +
            '           </td>' +
            '          <td style="vertical-align: bottom; text-align: left;" class="label">' +
            '               <label for="ativ_id_user"><i class="iconPopup iconSwitch fas fa-user-tie cinzaColor"></i>Respons\u00E1vel:</label>' +
            '           </td>' +
            '           <td class="required">' +
            '               ' + selectResponsavel +
            '           </td>' +
            '      </tr>' +
            '      <tr class="hrForm"><td colspan="4"></td></tr>' +
            '      <tr>' +
            '          <td style="vertical-align: bottom; text-align: left;" class="label">' +
            '               <label for="ativ_data_inicio"><i class="iconPopup iconSwitch fas fa-play-circle cinzaColor"></i>Data de In\u00EDcio:</label>' +
            '           </td>' +
            '           <td class="required date">' +
            '               <input type="' + (config_unidade.count_horas ? 'datetime-local' : 'date') + '" data-act="atividades-call" data-fn="repairTemposDemandaQuick" data-pass-el="0" id="ativ_data_inicio" data-key="data_inicio" data-type="inicio" data-name="data de in\u00EDcio" value="' + dataInicio + '" required>' +
            '           </td>' +
            '           <td style="vertical-align: bottom;" class="label">' +
            '               <label class="last" for="ativ_data_entrega"><i class="iconPopup iconSwitch fas fa-user-clock cinzaColor" style="float: initial;"></i>Data de Entrega:</label>' +
            '           </td>' +
            '           <td class="required date">' +
            '               <input type="' + (config_unidade.count_horas ? 'datetime-local' : 'date') + '" data-act="atividades-call" data-fn="repairTemposDemandaQuick" data-pass-el="0" id="ativ_data_entrega" data-key="data_entrega" data-type="fim" data-name="data de entrega" value="' + dataEntrega + '" required>' +
            '           </td>' +
            '      </tr>' +
            (callAtiv('checkOptionEntidade','exigir_homologacao_programas') ?
                '      <tr>' +
                '          <td style="vertical-align: bottom; text-align: left;" class="label">' +
                '               <label for="ativ_id_entrega"><i class="iconPopup iconSwitch fas fa-hand-holding cinzaColor"></i>Entrega:</label>' +
                '           </td>' +
                '           <td colspan="3" style="text-align: left;">' +
                '               <select id="ativ_id_entrega" data-act="atividades-call" data-fn="changeSelectEntregas" data-key="id_entrega" data-old_id_entrega="' + (value && value.id_entrega ? value.id_entrega : 'false') + '" data-type="number"><option>&nbsp;</option><option disabled>Selecione um respons\u00E1vel antes de vincular uma entrega</option></select>' +
                '               <a class="newLink linkDialogEntrega" style="cursor: pointer;display:none;" data-act="atividades-call" data-fn="openDialogEntrega" data-tip="Visualiza\u00E7\u00E3o detalhes da entrega">' +
                '                   <i class="fas fa-eye" style="font-size: 80%;"></i>' +
                '               </a>' +
                '           </td>' +
                '      </tr>' +
                '' : '') +
            (!callAtiv('checkOptionEntidade','desativa_produtividade_geral') ?
                '      <tr>' +
                '          <td style="vertical-align: bottom; text-align: left;" class="label">' +
                '               <label for="ativ_produtividade"><i class="iconPopup iconSwitch fas fa-toolbox cinzaColor"></i>Produtividade:</label>' +
                '           </td>' +
                '           <td colspan="3" style="text-align: left;">' +
                '               <div id="ativ_produtividade" style="margin: 5px 0;"></div>' +
                '               <div id="ativ_produtividade_executada" style="margin: 5px 0;"></div>' +
                '           </td>' +
                '      </tr>' +
                '' : '') +
            '   </table>' +
            '</div>';

        var btnDialogBoxPro = [{
            text: 'Salvar',
            class: 'confirm',
            click: function (event) {
                if (callAtiv('checkAtivRequiredFields',this, 'mark')) {
                    repairTemposDemandaQuick(false);
                    var action = 'save_atividade_rapida';
                    var param = callAtiv('extractDataAtiv',this);
                    param.action = action;
                    var id_plano = jmespath.search(arrayConfigAtividades.planos, "[?id_user==`" + param.id_user + "`] | [0].id_plano");
                    id_plano = (id_plano === null) ? 0 : id_plano;
                    if (!callAtiv('checkCapacidade','check_entregas_atividades') || typeof param.id_plano === 'undefined') param.id_plano = id_plano;
                    var id_atividade = (param.id_atividade.trim() == '') ? 0 : param.id_atividade;
                    param.id_atividade = id_atividade;
                    getServerAtividades(param, action);
                    // console.log(param, action);
                }
            }
        }];

        if (callAtiv('checkCapacidade','edit_atividade')) {
            btnDialogBoxPro.unshift({
                text: 'Cadastro Avan\u00E7ado',
                icon: 'ui-icon-notice',
                click: function (event) {
                    delayCrash = true;
                    changeSaveAtividade('full');
                    setTimeout(() => { delayCrash = false; }, 2000);
                }
            });
        }

        var titleBox = 'Criar ' + __.nova_demanda + ' r\u00E1pida';
        resetDialogBoxPro('dialogBoxPro');
        dialogBoxPro = $('#dialogBoxPro')
            .html('<div class="dialogBoxDiv">' + htmlBox + '</div>')
            .dialog({
                title: titleBox,
                width: 780,
                open: function () {
                    prepareFieldsReplace(this);
                },
                close: function () {
                    $('#boxAtividade').remove();
                    callAtiv('cancelSelectedItensAtiv',id_demanda)
                    resetDialogBoxPro('dialogBoxPro');
                },
                buttons: btnDialogBoxPro
            });

        var selectAtiv = $('#ativ_id_atividade');
        var selectUser = $('#ativ_id_user');
        var selectComplexidade = $('#ativ_fator_complexidade');
        if (dadosIfrArvore && id_demanda == 0) {
            var tipo_processo = dadosIfrArvore.tipo;
            var usuario = dadosIfrArvore.usuario;
            var prazo = dadosIfrArvore.prazo;
            if (tipo_processo) {
                selectAtiv.find('option').each(function () {
                    var config = $(this).data('config');
                    var config_tipo_processo = (typeof config !== 'undefined' && typeof config.tipo_processo !== 'undefined') ? config.tipo_processo : [];

                    if (config && config_tipo_processo.length > 0 && $.inArray(tipo_processo, config_tipo_processo) !== -1) {
                        selectAtiv.val($(this).val()).trigger('change');
                        return false;
                    }
                });
            }
            if (usuario) {
                selectUser.find('option').each(function () {
                    var text = $(this).text().toLowerCase();
                    if (text == usuario.toLowerCase()) {
                        if ($(this).prop('disabled') == false && $(this).closest('optgroup').prop('disabled') == false) {
                            selectUser.val($(this).val()).trigger('change');
                            return false;
                        }
                    }
                });
            }
            if (prazo) { $('#ativ_dias_planejado').val(prazo).trigger('change') }
        }
        if (!callAtiv('checkCapacidade','select_user_atividade')) {
            selectUser.val(arrayConfigAtividades.perfil.id_user).trigger('change');
        }
        var paramDemanda = getOptionsPro('recordParamDemanda');
        if (paramDemanda) {
            setTimeout(() => {
                delayCrash = true;
                if (selectUser.length && selectUser.val() !== null && selectUser.val().trim() == '' && paramDemanda.id_user) selectUser.val(paramDemanda.id_user).trigger('chosen:updated').trigger('change');
                if (selectAtiv.length && selectAtiv.val() !== null && selectAtiv.val().trim() == '' && paramDemanda.id_atividade) selectAtiv.val(paramDemanda.id_atividade).trigger('chosen:updated').trigger('change');
                setTimeout(() => {
                    if (selectComplexidade.length && paramDemanda.fator_complexidade) {
                        selectComplexidade.val(paramDemanda.fator_complexidade).trigger('chosen:updated').trigger('change');
                    }
                }, 200);

                setTimeout(() => {
                    repairTemposDemandaQuick();
                    delayCrash = false;
                }, 2000);
            }, 500);
        }
    }
}
export function repairTemposDemandaQuick(check_entrega = true) {
    var this_ = $('#ativ_data_entrega')[0];
    var param = callAtiv('extractDataAtiv',this_);
    var dias = callAtiv('checkTemposDemanda',param, 'tempo_executado', false);
    var tempo = callAtiv('checkTemposDemanda',param, 'tempo_executado');
    $('#ativ_prazo_entrega').val($('#ativ_data_entrega').val());
    $('#ativ_data_distribuicao').val($('#ativ_data_inicio').val());
    $('#ativ_tempo_planejado').val(tempo);
    $('#ativ_tempo_executado').val(tempo);
    $('#ativ_tempo_despendido').val(tempo);
    $('#ativ_dias_planejado').val(dias);
    $('#ativ_dias_executado').val(dias);
    $('#ativ_dias_despendido').val(dias);
    $('#ativ_data_entrega').attr('min', $('#ativ_data_inicio').val());
    $('#ativ_data_inicio').attr('max', $('#ativ_data_entrega').val());
    if (!callAtiv('checkOptionEntidade','desativa_produtividade_geral') && callAtiv('checkAtivRequiredFields',this_, 'check')) {
        $('#ativ_produtividade').html(callAtiv('getInfoAtividadeProdutividade',false, true, 'despendido', true));
        $('#ativ_produtividade_executada').html(callAtiv('getInfoAtividadeProdutividade',false, true, 'executado', true));
    } else {
        $('#ativ_produtividade').html('');
        $('#ativ_produtividade_executada').html('');
    }
    if (check_entrega) callAtiv('checkTempoPlanoEntrega',this_, 'get');
}
export function checkTagsIput(TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    if (typeof $().tagsInput !== 'undefined') {
        var ativEtiquetas = $('#ativ_etiquetas').tagsInput({
            interactive: true,
            placeholder: 'Adicionar etiqueta',
            minChars: 2,
            maxChars: 100,
            limit: 8,
            autocomplete_url: '',
            autocomplete: { 'source': sugestEtiquetaPro('ativ') },
            hide: true,
            delimiter: [';'],
            unique: true,
            removeWithBackspace: true,
            onAddTag: changeAtivEtiqueta,
            onRemoveTag: changeAtivEtiqueta,
            onChange: changeAtivEtiqueta
        });
        $('.atividadeWork input.tag-input').on('blur', function (ev) {
            var text = $(this).val().trim();
            if (text != '') {
                $(this).val('');
                ativEtiquetas.addTag(text);
            }
        });
    } else {
        $.getScript((URL_SPRO + "js/lib/jquery.tagsinput-revisited.js"));
        setTimeout(function () {
            checkTagsIput(TimeOut - 100);
            if (typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage')) console.log('Reload checkTagsIput');
        }, 500);
    }
}
export function prepareFieldsReplace(this_) {
    if (checkBrowser() == 'Firefox') {
        changeInputDateTime(this_);
    }
    initChosenReplace('box_init', this_, true);
}
export function calculoRecorrenciaAtiv(this_) {
    clearTimeout(dly);
    dly = setTimeout(function () {
        initCalculoRecorrenciaAtiv(this_);
    }, 800);
}
export function initCalculoRecorrenciaAtiv(this_, TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    if (typeof Gantt !== 'undefined') {
        calculoRecorrenciaAtiv_(this_);
    } else {
        if (typeof Gantt === 'undefined' && typeof URL_SPRO !== 'undefined' && TimeOut == 9000) {
            if (typeof loadStylePro === 'function') loadStylePro(URL_SPRO + 'css/frappe-gantt.css');
            $.getScript(URL_SPRO + "js/lib/frappe-gantt.js");
        }
        setTimeout(function () {
            initCalculoRecorrenciaAtiv(this_, TimeOut - 100);
            if (typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage')) console.log('Reload initCalculoRecorrenciaAtiv');
        }, 500);
    }
}
export function calculoRecorrenciaAtiv_(this_) {
    var _this = $(this_);
    var _parent = _this.closest('.atividadeWork');
    var config_unidade = callAtiv('getBoxConfigDadosUnidade',_parent);
    var config_data_format = (config_unidade.count_horas) ? 'DD/MM/YYYY HH:mm' : 'DD/MM/YYYY';
    var _dias_planejado = _parent.find('#ativ_dias_planejado');
    var dias_planejado = parseInt(_dias_planejado.val());
    var _modo = _parent.find('#ativ_modo_recorrencia');
    var modo = _modo.val();
    var _numero_fixo = _parent.find('#ativ_recorrencia_numero_fixo');
    var _data_inicio = _parent.find('#ativ_data_inicio_recorrencia');
    var data_inicio = moment(_data_inicio.val(), config_unidade.hora_format);
    var hora_inicio_recorrencia = (config_unidade.count_horas) ? data_inicio.format('HH:mm') : config_unidade.h_util_inicio;
    var _modo_fim = _parent.find('#ativ_modo_fim_recorrencia');
    var _data_fim = _parent.find('#ativ_data_fim_recorrencia');
    var data_fim = moment(_data_fim.val(), config_unidade.hora_format);
    var hora_fim_recorrencia = (config_unidade.count_horas) ? data_fim.format('HH:mm') : config_unidade.h_util_fim;
    var _plano_user = _parent.find('#ativ_id_user').find('option:selected').data('config');
    _plano_user = (typeof _plano_user !== 'undefined') ? jmespath.search(arrayConfigAtividades.planos, "[?id_plano==`" + _plano_user.id_plano + "`] | [0]") : null;
    var _plano_user_data_fim_vigencia = (_plano_user !== null) ? _plano_user.data_fim_vigencia : false;
    var carga_horaria = (_plano_user !== null) ? _plano_user.carga_horaria : false;
    var data_fim_recorrencia = (_modo_fim.val() == 'data_determinada')
        ? moment(_data_fim.val(), config_unidade.hora_format)
        : moment(_plano_user_data_fim_vigencia, 'YYYY-MM-DD HH:mm:ss');
    var dias_acrescimo = (modo != 'numero_fixo' && modo != 'numero_fixo_uteis') ? 1 : parseInt(_numero_fixo.val());
    dias_acrescimo = (modo == 'quinzena1' || modo == 'quinzena5') ? 2 : dias_acrescimo;
    dias_acrescimo = (modo == '3mes_inicio' || modo == '3mes_fim') ? 3 : dias_acrescimo;
    dias_acrescimo = (modo == '6mes_inicio' || modo == '6mes_inicio') ? 6 : dias_acrescimo;

    var viewModeGantt = (getOptionsPro('ganttRecorrenciasView')) ? getOptionsPro('ganttRecorrenciasView') : 'Week';

    var config_feriados = (typeof config_unidade.feriados !== 'undefined' && config_unidade.feriados !== null) ? config_unidade.feriados : false;
    var arrayFeriados = (config_unidade.count_dias_uteis && data_inicio.isValid() && data_fim_recorrencia.isValid())
        ? jmespath.search(getHolidayBetweenDates(data_inicio.format('Y') + '-01-01', data_fim.clone().add(1, 'Y').format('Y') + '-01-01', config_feriados), "[*].d_")
        : [];

    var diff_acresc = (modo == 'diaria' || modo == 'numero_fixo' || modo == 'numero_fixo_uteis') ? 'days' : false;
    diff_acresc = (
        modo == 'mes_inicio' || modo == 'mes_fim' ||
        modo == '3mes_inicio' || modo == '3mes_fim' ||
        modo == '6mes_inicio' || modo == '6mes_fim'
    ) ? 'months' : diff_acresc;
    diff_acresc = (modo == 'semana1' || modo == 'semana5' || modo == 'quinzena1' || modo == 'quinzena5') ? 'weeks' : diff_acresc;
    diff_acresc = (modo == 'ano_inicio' || modo == 'ano_fim') ? 'years' : diff_acresc;

    // console.log({diff_acresc: diff_acresc, arrayFeriados: arrayFeriados, dias_acrescimo: dias_acrescimo, config_unidade: config_unidade, _dias_planejado: _dias_planejado.val(),  _modo: _modo.val(),  _numero_fixo: _numero_fixo.val(),  _data_inicio: _data_inicio.val(),  _modo_fim: _modo_fim.val(),  _data_fim: _data_fim.val(),   _plano_user: _plano_user, data_fim_recorrencia: data_fim_recorrencia});

    var taskRecorrencia = [];
    var dataFall = '';

    if (diff_acresc) {
        var index = 0
        var dataInitRef = data_inicio.clone();
        if (modo == 'numero_fixo_uteis') {
            getDateAddWeekdaysFromSet(dataInitRef, 0);
        } else {
            var initDate = getRecorrenciaAtiv(data_inicio.clone(), dias_planejado, arrayFeriados, modo, config_unidade, index, hora_inicio_recorrencia, hora_fim_recorrencia, dataInitRef, data_fim_recorrencia);
            if (initDate) {
                taskRecorrencia.push(initDate);
                // console.log('check', initDate.start_ >= dataInitRef, initDate.start_.format(config_data_format), dataInitRef.format(config_data_format), data_fim_recorrencia.format(config_data_format));
                index++;
            }
            while (data_inicio.add(dias_acrescimo, diff_acresc).diff(data_fim_recorrencia) < 0) {
                var dataRef = data_inicio.clone();
                var newDate = getRecorrenciaAtiv(dataRef, dias_planejado, arrayFeriados, modo, config_unidade, index, hora_inicio_recorrencia, hora_fim_recorrencia, dataInitRef, data_fim_recorrencia);
                if (newDate) {
                    taskRecorrencia.push(newDate);
                    index++;
                    // console.log('check', newDate.start_ >= dataInitRef, newDate.start_.format(config_data_format), dataInitRef.format(config_data_format), data_fim_recorrencia.format(config_data_format));
                }
            }
            // console.log(taskRecorrencia, _data_inicio.val(), dias_acrescimo, diff_acresc, _data_fim.val(), data_fim_recorrencia.format(config_data_format));
        }

        function getDateAddWeekdaysFromSet(dt_init, index) {
            if (index == 0) {
                var nextIndex = index + 1;
                var dt_next = (dt_init.weekday() != 0 && arrayFeriados.indexOf(dt_init.format('YYYY-MM-DD')) === -1) ? dt_init : dt_init.clone().addWorkdays(0, arrayFeriados);
                // dias_acrescimo = (dias_acrescimo > 0) ? dias_acrescimo-1 : dias_acrescimo;
            } else if (dt_init <= data_fim_recorrencia) {
                var nextIndex = index + 1;
                var dt_next = dt_init.isoAddWeekdaysFromSet({
                    'workdays': dias_acrescimo,
                    'weekdays': [1, 2, 3, 4, 5],
                    'exclusions': arrayFeriados
                });
            } else {
                var dt_next = false;
            }
            if (dt_next) {
                // console.log(dt_init.format('DD/MM/YYYY'), dt_next.format('DD/MM/YYYY'), data_fim.format('DD/MM/YYYY'));
                var initDateWk = getRecorrenciaAtiv(dt_next, dias_planejado, arrayFeriados, modo, config_unidade, nextIndex, hora_inicio_recorrencia, hora_fim_recorrencia, dataInitRef, data_fim_recorrencia);
                if (initDateWk) { taskRecorrencia.push(initDateWk) }
                getDateAddWeekdaysFromSet(dt_next, nextIndex);
            }
        }

        $('#ganttRecorrenciaPanel').html('');
        if (taskRecorrencia.length > 0) {

            var param = {
                count_dias_uteis: config_unidade.count_dias_uteis,
                count_horas: config_unidade.count_horas,
                h_dataInicio: taskRecorrencia[0].start_,
                h_dataFim: taskRecorrencia[0].end_,
                h_utilInicio: moment(taskRecorrencia[0].end_.format('YYYY-MM-DD') + 'T' + config_unidade.h_util_inicio, 'YYYY-MM-DDTHH:mm'),
                h_utilFim: moment(taskRecorrencia[0].start_.format('YYYY-MM-DD') + 'T' + config_unidade.h_util_fim, 'YYYY-MM-DDTHH:mm'),
                carga_horaria: carga_horaria,
                valueDias: dias_planejado
            };
            var tempoTrabalho = (carga_horaria) ? callAtiv('getTempoTrabalhoAtiv',param) : false;
            // console.log(param, tempoTrabalho);

            if (tempoTrabalho) {
                tempoTrabalho = (tempoTrabalho < 1) ? tempoTrabalho.toFixed(3) : tempoTrabalho.toFixed(1);
                _parent.find('#ativ_tempo_planejado').val(tempoTrabalho);
                var updateAtiv = _parent.find('#ativ_fator_complexidade');
                // var updateAtiv = _parent.find('#ativ_id_atividade');

                if (typeof updateAtiv.data('update_recorrencia') === 'undefined' || updateAtiv.data('update_recorrencia') == false) {
                    updateAtiv.data('update_recorrencia', true);
                    setTimeout(function () {
                        updateAtiv.trigger('change');
                        setTimeout(function () { updateAtiv.data('update_recorrencia', false) }, 1500);
                    }, 500);
                }
            }

            var arrayTaskRecorrencia = jmespath.search(taskRecorrencia, "[*].{id: id, data_distribuicao: start_format, prazo_entrega: end_format}");
            _parent.find('#ativ_recorrencia').val(JSON.stringify(arrayTaskRecorrencia));
            // console.log('arrayTaskRecorrencia',arrayTaskRecorrencia);

            var gantt = new Gantt("#ganttRecorrenciaPanel", taskRecorrencia, {
                header_height: 50,
                column_width: 10,
                step: 24,
                                language: 'ptBr',
                view_modes: ['Day', 'Week', 'Month'],
                bar_height: 15,
                bar_corner_radius: 3,
                arrow_curve: 5,
                padding: 18,
                edit_task: false,
                view_mode: viewModeGantt,
                date_format: 'YYYY-MM-DD',
                custom_popup_html: function (task) {
                    var html = '<div class="details-container seiProForm">' +
                        '   <table class="tableInfo tableLine">' +
                        '      <tr>' +
                        '           <td colspan="2" class="td_view">' +
                        '               <h5><i class="iconPopup fas fa-check-circle cinzaColor"></i> ' +
                        '                   <span class="boxInfo" style="font-size: 11pt;font-weight: bold;width: 85%;text-align: left;display: inline-block;">' + __.Demanda + ' #' + (parseInt(task.id) + 1) + '</span>' +
                        '                   <a style="float: right; margin: -4px -4px 0 0; padding: 5px;" data-act="atividades-gantt-hide-popup" data-gantt="ganttRecorrencias"><i class="far fa-times-circle cinzaColor"></i></a>' +
                        '               </h5>' +
                        '           </td>' +
                        '      </tr>' +
                        '      <tr style="height: 40px;">' +
                        '          <td style="vertical-align: bottom; width: 180px;"><i class="iconPopup iconSwitch fas fa-briefcase cinzaColor"></i>Data de Distribui\u00E7\u00E3o:</td>' +
                        '          <td class="td_view">' + task.start_.format(config_data_format) + '</td>' +
                        '      </tr>' +
                        '      <tr style="height: 40px;">' +
                        '          <td style="vertical-align: bottom;"><i class="iconPopup iconSwitch fas fa-business-time cinzaColor"></i>Prazo de Entrega:</td>' +
                        '          <td class="td_view">' + task.end_.format(config_data_format) + '</td>' +
                        '      </tr>' +
                        '   </table>' +
                        '</div>';
                    return html;
                },
                on_click: function (task) {
                }
            });
            ganttRecorrencias = gantt;
            if (!getOptionsPro('panelHeight_recorrenciasGanttPro') && $('#ganttRecorrenciaPanel').height() > 500) { setOptionsPro('panelHeight_recorrenciasGanttPro', 500) }
            $('#ganttRecorrenciaPanel').find('.gantt-container').addClass('tabelaPanelScroll');
            initPanelResize('.gantt-container', 'ganttRecorrenciaPanel');

            if (ganttRecorrencias && ganttRecorrencias.bars.length > 0) {
                var scrollLeft = ganttRecorrencias.bars[0].x - 20;
                var windowDiv = $('#ganttRecorrenciaPanel').find('.gantt-container');
                windowDiv.animate({ scrollLeft: scrollLeft }, 500);

                var popupRecorreAtiv = $('#ganttRecorrenciaPanel').find('.popup-wrapper');
                if (popupRecorreAtiv.length > 0) {
                    var observerPopupRecorreAtiv = new MutationObserver(function (mutations) {
                        var _this = $(mutations[0].target);
                        var _parent = _this.closest('.gantt-container');
                        if (_this.is(':visible')) {
                            _parent.attr('style', function (i, s) { return (s || '') + 'position: relative !important;' });
                            _parent.find('.ui-resizable-handle').hide();
                        } else {
                            _parent.attr('style', function (i, s) { return (s || '') + 'position: initial !important;' });
                            _parent.find('.ui-resizable-handle').show();
                        }
                    });
                    observerPopupRecorreAtiv.observe(popupRecorreAtiv.get(0), {
                        attributes: true
                    });
                }
            }
        } else {
            dataFall = '<div class="gantt-container dataFallback" style="z-index:9;" data-text="Nenhum dado dispon\u00EDvel"></div>';
        }

        var btnGroupView = '<div style="position: absolute; right: 0; z-index: 99;">' +
            '   <div class="btn-group" role="group" style="float: right;">' +
            '       <button type="button" data-value="Day" class="btn btn-sm btn-light ' + (getOptionsPro('ganttRecorrenciasView') == 'Day' ? 'active' : '') + '">Dia</button>' +
            '       <button type="button" data-value="Week" class="btn btn-sm btn-light ' + (getOptionsPro('ganttRecorrenciasView') == 'Week' ? 'active' : '') + '">Semana</button>' +
            '       <button type="button" data-value="Month" class="btn btn-sm btn-light ' + (getOptionsPro('ganttRecorrenciasView') == 'Month' || !getOptionsPro('ganttRecorrenciasView') ? 'active' : '') + '">M\u00EAs</button>' +
            '       <button type="button" data-value="Year" class="btn btn-sm btn-light ' + (getOptionsPro('ganttRecorrenciasView') == 'Year' ? 'active' : '') + '">Ano</button>' +
            '   </div>' +
            '</div>';

        var counterTaskRecorrencia = (taskRecorrencia.length > 0)
            ? '<div style="padding:8px;color:#666;text-align: right;font-size: 9pt;"><i class="fa fa-info-circle azulColor"></i> ' + (taskRecorrencia.length > 1 ? taskRecorrencia.length + ' ' + __.demandas_programadas : '1 ' + __.demanda_programada) + '</div>'
            : '';

        $('#ganttRecorrenciaPanel').prepend(counterTaskRecorrencia + btnGroupView + dataFall);
        $("#ganttRecorrenciaPanel .btn-group").on("click", "button", function () {
            $btn = $(this);
            var mode = $btn.data('value');
            $btn.parent().find('button').removeClass('active');
            $btn.addClass('active');
            ganttRecorrencias.change_view_mode(mode);
            setOptionsPro('ganttRecorrenciasView', mode);
        });
    }
}
export function getRecorrenciaAtiv(newDate, dias_planejado, arrayFeriados, modo, config_unidade, index, hora_inicio_recorrencia, hora_fim_recorrencia, dataInitRef, dataEndRef) {
    var config_data_format = (config_unidade.count_horas) ? 'DD/MM/YYYY HH:mm' : 'DD/MM/YYYY';
    var config_data_format_sys = 'YYYY-MM-DD HH:mm:ss';
    newDate = (modo == 'semana1' || modo == 'quinzena1') ? newDate.startOf('isoweek') : newDate;
    newDate = (modo == 'semana5' || modo == 'quinzena5') ? newDate.startOf('isoweek').add('days', 4) : newDate;
    newDate = (modo == 'mes_inicio' || modo == '3mes_inicio' || modo == '6mes_inicio') ? newDate.startOf('month') : newDate;
    newDate = (modo == 'mes_fim' || modo == '3mes_fim' || modo == '6mes_fim') ? newDate.endOf('month') : newDate;
    newDate = (modo == 'ano_inicio') ? newDate.startOf('year') : newDate;
    newDate = (modo == 'ano_fim') ? newDate.endOf('year') : newDate;
    var newDate_format = newDate.format('YYYY-MM-DD');
    if (modo) {
        // if ((modo != 'diaria' && modo != 'numero_fixo') || ((modo == 'diaria' || modo == 'numero_fixo') && newDate.weekday() != 6 && newDate.weekday() != 0 && arrayFeriados.indexOf(newDate_format) === -1)) {
        var dt_init_ativ = nextWorkDay(newDate, arrayFeriados, modo, config_unidade);
        dt_init_ativ = (config_unidade.count_horas) ? moment(dt_init_ativ.format('YYYY-MM-DD') + 'T' + hora_inicio_recorrencia, config_unidade.hora_format) : dt_init_ativ;
        var dt_end_ativ = (dias_planejado > 0)
            ? (config_unidade.count_dias_uteis)
                ? dt_init_ativ.clone().addWorkdays(dias_planejado, arrayFeriados)
                : dt_init_ativ.clone().add(dias_planejado)
            : dt_init_ativ;
        dt_end_ativ = (config_unidade.count_horas) ? moment(dt_end_ativ.format('YYYY-MM-DD') + 'T' + hora_fim_recorrencia, config_unidade.hora_format) : dt_end_ativ;
        // console.log(newDate_format, newDate.weekday(), dt_init_ativ.format(config_data_format), dt_end_ativ.format(config_data_format));

        return (dt_init_ativ >= dataInitRef && dt_init_ativ <= dataEndRef)
            ? {
                id: index.toString(),
                start_: dt_init_ativ,
                start: dt_init_ativ.format('YYYY-MM-DD'),
                start_format: dt_init_ativ.format(config_data_format_sys),
                end_: dt_end_ativ,
                end: dt_end_ativ.format('YYYY-MM-DD'),
                end_format: dt_end_ativ.format(config_data_format_sys),
                progress: 0,
                custom_class: 'bar-iniciado seipro-atividades-bar--iniciado',
                name: __.Demanda + ' #' + (index + 1) + ' em ' + dt_init_ativ.format(config_data_format),
                dependencies: (index == 0 ? '' : index - 1).toString()
            } : false;
    } else {
        return false;
    }
}
export function nextWorkDay(date, arrayFeriados, modo, config_unidade) {
    var date_format = date.format('YYYY-MM-DD');
    if (config_unidade.count_dias_uteis && (date.weekday() == 6 || date.weekday() == 0 || arrayFeriados.indexOf(date_format) !== -1)) {
        return date.addWorkdays((modo == 'mes_fim' ? -1 : 1), arrayFeriados);
    } else {
        return date;
    }
}
export function changeModoRecorrenciaFields(this_) {
    var _this = $(this_);
    var _parent = _this.closest('.atividadeWork');
    var type = _this.data('type');
    var mode_select = _this.find('option:selected').data('view');
    if (mode_select == 'show') {
        _parent.find('.modoDistribuicao_recorrente_' + type).show();
        if (_this.val() == 'numero_fixo_uteis') {
            _parent.find('#label_recorrencia_numero_fixo').hide();
            _parent.find('#label_recorrencia_numero_fixo_uteis').show();
        } else if (_this.val() == 'numero_fixo') {
            _parent.find('#label_recorrencia_numero_fixo').show();
            _parent.find('#label_recorrencia_numero_fixo_uteis').hide();

        } else {
            _parent.find('#label_recorrencia_numero_fixo').hide();
            _parent.find('#label_recorrencia_numero_fixo_uteis').hide();
        }
    } else {
        _parent.find('.modoDistribuicao_recorrente_' + type).hide();
    }
    calculoRecorrenciaAtiv(this_);
}
export function addAtividadesAlertModeMult(this_, mode = 'remove') {
    var _this = $(this_);
    var _parent = _this.closest('.atividadeWork');
    _parent.find('.atividadesAlertModeMult').remove();
    if (mode != 'remove') {
        var htmlAtivAlertMult = '<div class="atividadesAlertModeMult" style="float: left;margin: -14px 0 0 0;transform: scale(0.9);background-color: #f9efad;padding: 5px 8px;border-radius: 5px;">' +
            '   <i class="fas fa-exclamation-circle azulColor"></i>  ' + __.Demanda + ' recorrente incompat\u00EDvel com a cria\u00E7\u00E3o de ' + __.demandas + ' em m\u00FAltiplos processos' +
            '</div>';
        _parent.find('.atividadesBtnModeDist').before(htmlAtivAlertMult);
    }
}
export function changeModeDistribuicao(this_) {
    var _this = $(this_);
    var _parent = _this.closest('.atividadeWork');
    var data = _this.data();
    if (data.value == 'Determinada') {
        _parent.find('.modoDistribuicao_determinada').show();
        _parent.find('.modoDistribuicao_recorrente').hide();
        _parent.find('#ativ_recorrencia').val('[]');
        _parent.find('#ativ_prazo_entrega').trigger('change');
        setTimeout(function () {
            _parent.find('#ativ_fator_complexidade').trigger('change');
        }, 500);
        if (!_parent.find('.ativMultiProcesso').is(':visible') && !_parent.find('#ativ_multiprocesso').is(':visible') && _parent.find('.ativMultiProcesso .ativProcessos').length > 0) {
            _parent.find('.ativMultiProcesso').show();
            multProcessUpdateInput();
        }
        addAtividadesAlertModeMult(this_, 'remove');
    } else if (data.value == 'Recorrente') {
        _parent.find('.modoDistribuicao_determinada').hide();
        _parent.find('.modoDistribuicao_recorrente').show();
        calculoRecorrenciaAtiv(this_);
        if (_parent.find('#ativ_multiprocesso').is(':visible') && _parent.find('#ativ_multiprocesso').is(':checked')) {
            _parent.find('#ativ_multiprocesso').prop('checked', false).trigger('change');
            addAtividadesAlertModeMult(this_, 'add');
        }
        if (_parent.find('.ativMultiProcesso').is(':visible') && !_parent.find('#ativ_multiprocesso').is(':visible')) {
            _parent.find('.ativMultiProcesso').hide();
            _parent.find('#ativ_id_procedimentos').val('[]');
            _parent.find('#ativ_id_user').trigger('change');
            addAtividadesAlertModeMult(this_, 'add');
        }
    }
    _this.closest('.atividadesBtnModeDist').find('.btn').removeClass('active');
    _this.addClass('active');
    initChosenReplace('box_reload', this_, true);
}
export function changeAtivMultiProcesso(this_) {
    var _this = $(this_);
    var _parent = _this.closest('.atividadeWork');
    if (_this.is(':checked')) {
        _parent.find('.ativMultiProcesso').show();
        multProcessUpdateInput();
        if ($('.atividadesBtnModeDist button[data-value="Recorrente"]').hasClass('active')) {
            $('.atividadesBtnModeDist button[data-value="Determinada"]').trigger('click');
            addAtividadesAlertModeMult(this_, 'remove');
        }
    } else {
        _parent.find('.ativMultiProcesso').hide();
        _parent.find('#ativ_id_procedimentos').val('[]');
        _parent.find('#ativ_id_user').trigger('change');
    }
}
export function multProcessUpdateInput() {
    var _parent = $('#boxAtividade.atividadeWork');
    var divList = _parent.find('.ativMultiProcesso');
    var ativProcessos = divList.find('.listMultProcessos span.ativProcessos').map(function () {
        return { processo_sei: $(this).data('processo'), id_procedimento: $(this).data('procedimento').toString() }
    }).get();
    divList.find('#ativ_id_procedimentos').val(JSON.stringify(ativProcessos));
    divList.find('.counterMultProcessos').text('(' + ativProcessos.length + ' ' + (ativProcessos.length > 1 ? 'processos' : 'processo') + ')');
    _parent.find('#ativ_id_user').trigger('change');
}
export function multProcessRemove(this_) {
    var _this = $(this_);
    var _parent = _this.closest('.atividadeWork');
    _this.closest('.ativProcessos').remove();
    multProcessUpdateInput();
}
