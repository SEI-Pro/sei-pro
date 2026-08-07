import { callAtiv } from './call.js';
/**
 * Atividades — kanban, checklist e gantt de atividades.
 *
 * Esta fatia mantém apenas a superfície legada necessária durante a migração.
 * O estado compartilhado é instalado por runtime.js e os nomes antigos são
 * publicados exclusivamente por legacy-api.js.
 */
import { withSeiproBarClasses } from './templates.js';
import { getServerAtividades } from './server.js';
import { getNameGenre } from '../../shared/nomenclatura.js';

function callParentAtividades(name, ...args) {
    const root = typeof parent !== 'undefined' ? parent : globalThis;
    const feature = root && root.SeiPro && root.SeiPro.features && root.SeiPro.features.atividades;
    const api = feature && feature.api;
    const fn = (api && api.commands && typeof api.commands[name] === 'function') ? api.commands[name]
        : (api && api.queries && typeof api.queries[name] === 'function') ? api.queries[name]
        : (api && api.handlers && typeof api.handlers[name] === 'function') ? api.handlers[name]
        : (api && api.handlers && typeof api.handlers[name] === 'function' ? api.handlers[name] : null);
    if (typeof fn === 'function') return fn(...args);
    return callAtiv(name, ...args);
}

export function initKanbanAtividades(this_, TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    loadKanbanStyleAtividades();
    if (typeof jKanban !== 'undefined') {
        getKanbanAtividades(this_);
    } else {
        loadKanbanStyleAtividades();
        if (typeof jKanban === 'undefined') $.getScript(URL_SPRO + "js/lib/jkanban.min.js");
        setTimeout(function () {
            initKanbanAtividades(this_, TimeOut - 100);
            if (typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage')) console.log('Reload initKanbanAtividades');
        }, 500);
    }
}
export function getKanbanAtividades(this_) {
    if (arrayAtividadesPro) {
        var kanbanElem = '#kanbanAtivPanel';
        var kanbanDiv = $(kanbanElem);
        kanbanDiv.html('').show();
        var listAtividadesNIniciadas = jmespath.search(arrayAtividadesPro, "[?data_inicio=='0000-00-00 00:00:00']");
        listAtividadesNIniciadas = getSortKanbanItens(listAtividadesNIniciadas, '_niniciadas');
        var listAtividadesIniciadas = jmespath.search(arrayAtividadesPro, "[?data_inicio!='0000-00-00 00:00:00'] | [?data_retomada!='0000-00-00 00:00:00'] | [?data_entrega=='0000-00-00 00:00:00']");
        listAtividadesIniciadas = getSortKanbanItens(listAtividadesIniciadas, '_iniciadas');
        var listAtividadesPausadas = jmespath.search(arrayAtividadesPro, "[?data_inicio!='0000-00-00 00:00:00'] | [?data_pausa] | [?data_pausa!='0000-00-00 00:00:00'] | [?data_retomada=='0000-00-00 00:00:00'] | [?data_entrega=='0000-00-00 00:00:00']");
        listAtividadesPausadas = (listAtividadesPausadas !== null && listAtividadesPausadas.length > 0) ? getSortKanbanItens(listAtividadesPausadas, '_pausadas') : false;
        var listAtividadesConcluidas = jmespath.search(arrayAtividadesPro, "[?data_entrega!='0000-00-00 00:00:00'] | [?data_avaliacao=='0000-00-00 00:00:00']");
        listAtividadesConcluidas = getSortKanbanItens(listAtividadesConcluidas, '_concluidas');
        var listAtividadesAvaliadas = jmespath.search(arrayAtividadesPro, "[?data_avaliacao!='0000-00-00 00:00:00'] | [?data_envio=='0000-00-00 00:00:00']");
        listAtividadesAvaliadas = getSortKanbanItens(listAtividadesAvaliadas, '_avaliadas');

        var listAtividadesArquivadas = getOptionsPro('panelAtividadesViewSend') ? jmespath.search(arrayAtividadesPro, "[?data_avaliacao!='0000-00-00 00:00:00'] | [?data_envio!='0000-00-00 00:00:00']") : null;
        listAtividadesArquivadas = (listAtividadesArquivadas !== null) ? getSortKanbanItens(listAtividadesArquivadas, '_arquivadas') : false;

        var bords_list = [
            {
                id: "_niniciadas",
                title: "N\u00E3o Iniciadas",
                class: "",
                dragTo: (callAtiv('checkCapacidade','start_atividade') ? ["_iniciadas"] : []),
                item: getKanbanItensAtividade(listAtividadesNIniciadas)
            },
            {
                id: "_iniciadas",
                title: "Iniciadas",
                dragTo: ((callAtiv('checkCapacidade','complete_atividade') && callAtiv('checkCapacidade','start_cancel_atividade'))
                    ? ["_niniciadas", "_concluidas"]
                    : (callAtiv('checkCapacidade','complete_atividade') && !callAtiv('checkCapacidade','start_cancel_atividade'))
                        ? ["_concluidas"]
                        : (!callAtiv('checkCapacidade','complete_atividade') && callAtiv('checkCapacidade','start_cancel_atividade'))
                            ? ["_niniciadas"]
                            : []
                ),
                class: "start",
                item: getKanbanItensAtividade(listAtividadesIniciadas)
            }
        ];

        if (listAtividadesPausadas) {
            bords_list.push({
                id: "_pausadas",
                title: "Pausadas",
                class: "paused",
                dragTo: ((callAtiv('checkCapacidade','pause_atividade'))
                    ? ["_iniciadas", "_concluidas"]
                    : []
                ),
                item: getKanbanItensAtividade(listAtividadesPausadas)
            });
        }

        bords_list.push({
            id: "_concluidas",
            title: "Conclu\u00EDdas",
            class: "complete",
            dragTo: ((callAtiv('checkCapacidade','rate_atividade') && callAtiv('checkCapacidade','complete_cancel_atividade'))
                ? ["_iniciadas", "_avaliadas"]
                : (callAtiv('checkCapacidade','rate_atividade') && !callAtiv('checkCapacidade','complete_cancel_atividade'))
                    ? ["_avaliadas"]
                    : (!callAtiv('checkCapacidade','rate_atividade') && callAtiv('checkCapacidade','complete_cancel_atividade'))
                        ? ["_iniciadas"]
                        : []
            ),
            item: getKanbanItensAtividade(listAtividadesConcluidas)
        },
            {
                id: "_avaliadas",
                title: "Avaliadas",
                class: "rate",
                dragTo: (callAtiv('checkCapacidade','rate_cancel_atividade') ? ["_concluidas"] : []),
                item: getKanbanItensAtividade(listAtividadesAvaliadas)
            }
        );

        if (listAtividadesArquivadas) {
            bords_list.push({
                id: "_arquivadas",
                title: __.Arquivadas,
                class: "send",
                dragTo: (callAtiv('checkCapacidade','send_cancel_atividade') ? ["_avaliadas"] : []),
                item: getKanbanItensAtividade(listAtividadesArquivadas)
            });
        }
        var widthBoard = (listAtividadesArquivadas || listAtividadesPausadas ? "calc(20% - 20px)" : "calc(25% - 20px)");
        widthBoard = (listAtividadesArquivadas && listAtividadesPausadas) ? "calc(16.66% - 20px)" : widthBoard;

        var kanban = (bords_list === null) ? false : new jKanban({
            element: kanbanElem,
            gutter: '10px',
            widthBoard: widthBoard,
            // responsivePercentage: true,
            itemHandleOptions: {
                enabled: true,
            },
            dropEl: function (el, target, source, sibling) {
                var targetEl = target.parentElement.getAttribute('data-id');
                var sourceEl = source.parentElement.getAttribute('data-id');
                var idEl = (el.dataset.eid.indexOf('_id_') !== -1) ? parseInt(el.dataset.eid.replace('_id_', '')) : el.dataset.eid;
                if (targetEl == '_iniciadas' && sourceEl == '_niniciadas') {
                    callAtiv('startAtividade',idEl);
                } else if (targetEl == '_niniciadas' && sourceEl == '_iniciadas') {
                    callAtiv('startCancelAtividade',idEl);
                } else if (targetEl == '_concluidas' && sourceEl == '_iniciadas') {
                    callAtiv('completeAtividade',idEl);
                } else if (targetEl == '_pausadas' || sourceEl == '_pausadas') {
                    callAtiv('pauseAtividade',idEl);
                } else if (targetEl == '_iniciadas' && sourceEl == '_concluidas') {
                    callAtiv('completeCancelAtividade',idEl);
                } else if (targetEl == '_avaliadas' && sourceEl == '_concluidas') {
                    callAtiv('rateAtividade',idEl);
                } else if (targetEl == '_concluidas' && sourceEl == '_avaliadas') {
                    callAtiv('rateCancelAtividade',idEl);
                } else if (targetEl == '_arquivadas' && sourceEl == '_avaliadas') {
                    callAtiv('archiveAtividade',idEl);
                } else if (targetEl == '_avaliadas' && sourceEl == '_arquivadas') {
                    callAtiv('sendCancelAtividade',idEl);
                }
                kanbanAtividadesMoving = { target: targetEl, source: sourceEl, id: el.dataset.eid, id_demanda: idEl };
                setStoreOrderKanbanItens();
                if (targetEl == '_niniciadas' && sourceEl == '_niniciadas' && $('#filterTagKanban_user').length > 0 && callAtiv('checkCapacidade','update_prioridades')) {
                    setStorePriorityKanbanItens('_niniciadas');
                }
            },
            boards: bords_list
        });

        kanbanAtividades = kanban;

        // adiciona altura maxima ao painel e redimenssionamento dinamico
        if (!getOptionsPro('panelHeight_atividadesKanbanPro') && kanbanDiv.height() > 800) { setOptionsPro('panelHeight_atividadesKanbanPro', 800) }
        $('.kanban-container').addClass('tabelaPanelScroll');
        initPanelResize('.kanban-container', 'atividadesKanbanPro');

        // corrige a altura de todos os quadros pelo maior deles
        var maxHeightBoard = Math.max.apply(null, kanbanDiv.find('.kanban-board').map(function () { return $(this).height() }).get());
        kanbanDiv.find('.kanban-board').css('min-height', maxHeightBoard + 'px');
        kanbanDiv.find('.kanban-board .kanban-drag').css('min-height', (maxHeightBoard - 48) + 'px');

        var tagName = getOptionsPro('filterTag_kanban');
        if (typeof tagName !== 'undefined' && tagName != '') {
            setTimeout(function () {
                $('.kanbanAtividade .tagTableText_' + tagName).eq(0).trigger('click');
            }, 100);
        } else if ((!tagName || tagName == '') && (callAtiv('checkCapacidade','only_self_atividades')) && !setOptionsPro('filterTag_removed')) {
            var tagName_thisUser = normalizeNameTag(arrayConfigAtividades.perfil.apelido);
            setTimeout(function () {
                $('.kanbanAtividade .tagTableText_' + tagName_thisUser).eq(0).trigger('click');
            }, 500);
        }

        var target = ($('#ifrArvore').length > 0) ? $('#ifrArvore').contents() : $('body');
        var progress = target.find('.kanban-item .checklist_progress');
        if (typeof $().progressbar !== 'undefined') {
            progress.each(function () {
                $(this).progressbar({
                    value: $(this).data('valuenow'),
                    max: $(this).data('max')
                });
                if ($(this).find('.ui-progressbar-value').length > 1) { $(this).find('.ui-progressbar-value').eq(0).remove() }
            });
        }
        var selectFilterKanban = callAtiv('getSelectViewControl','kanbanAtivPanel');

        var htmlViewControl = '<div class="viewControlPro" style="right: 10px;top: 10px;z-index: 100;position: absolute;">' +
            '   ' + selectFilterKanban +
            '   <div class="btn-group" role="group" style="margin-left: 20px;">' +
            '      <button type="button" data-act="atividades-call" data-fn="changeViewControl" style="padding: 0.1rem .5rem; font-size: 9pt;" data-value="compacto" class="btn btn-sm btn-light ' + (getOptionsPro('panelKanbanView') == 'compacto' ? 'active' : '') + '">' +
            '          <i class="fas fa-minus" style="padding-right: 3px; cursor: pointer; font-size: 10pt; color: #888;"></i>' +
            '          Compacto' +
            '      </button>' +
            '      <button type="button" data-act="atividades-call" data-fn="changeViewControl" style="padding: 0.1rem .5rem; font-size: 9pt;" data-value="padrao" class="btn btn-sm btn-light ' + (!getOptionsPro('panelKanbanView') || getOptionsPro('panelKanbanView') == 'padrao' ? 'active' : '') + '">' +
            '          <i class="far fa-minus-square" style="padding-right: 3px; cursor: pointer; font-size: 10pt; color: #888;"></i>' +
            '          Padr\u00E3o' +
            '      </button>' +
            '      <button type="button" data-act="atividades-call" data-fn="changeViewControl" style="padding: 0.1rem .5rem; font-size: 9pt;" data-value="expandido" class="btn btn-sm btn-light ' + (getOptionsPro('panelKanbanView') == 'expandido' ? 'active' : '') + '">' +
            '          <i class="far fa-plus-square" style="padding-right: 3px; cursor: pointer; font-size: 10pt; color: #888;"></i>' +
            '          Expandido' +
            '      </button>' +
            '   </div>' +
            '</div>';
        kanbanDiv.find('.viewControlPro').remove();
        kanbanDiv.prepend(htmlViewControl);
        if (typeof $().chosen === 'function') {
            $('#selectViewControl_kanbanAtivPanel').chosen({
                placeholder_text_single: ' ',
                no_results_text: 'Nenhum resultado encontrado',
                normalize_search_text: function (text) {
                    return removeAcentos(text.toLowerCase());
                }
            });
            forcePlaceHoldChosen();
        }
        if (getOptionsPro('panelKanbanView')) {
            kanbanDiv.find('.viewControlPro button[data-value="' + getOptionsPro('panelKanbanView') + '"]').trigger('click');
        }
        updateCountKanbanBoard();
        callAtiv('loopRepairKanbanPinMoveCard',);
    }
}
export function changeViewControl(this_) {
    var _this = $(this_);
    var value = _this.data('value');
    var container = _this.closest('.kanbanAtividade').find('.kanban-container');
    if (value == 'expandido') {
        container.addClass('view_full').removeClass('view_min');
    } else if (value == 'padrao') {
        container.removeClass('view_full').removeClass('view_min');
    } else if (value == 'compacto') {
        container.removeClass('view_full').addClass('view_min');
    }

    _this.parent().find('button').removeClass('active');
    _this.addClass('active');
    setOptionsPro('panelKanbanView', value);
}
export function updateCountKanbanBoard() {
    $.each(kanbanAtividades.options.boards, function (i, v) {
        var countBoard = $('#kanbanAtivPanel .kanban-board[data-id="' + v.id + '"] .kanban-item:visible').length;
        $('#kanbanAtivPanel .kanban-board[data-id="' + v.id + '"] .kanban-title-board').attr('data-count', countBoard);
    });
}
export function getStoreOrderKanbanItens(nameBoard) {
    var itemStore = getOptionsPro('kanbanAtividadesOrder');
    var itens = jmespath.search(itemStore, "[?name=='" + nameBoard + "'].order | [0]");
    return (itens !== null) ? itens : false;
}
export function getPinKanbanItem(id_demanda) {
    var pin = false;
    if (getOptionsPro('kanbanAtividadesOrder')) {
        var item = $.map(getOptionsPro('kanbanAtividadesOrder'), function (v) {
            var order = jmespath.search(v.order, "[?id_demanda==`" + id_demanda + "`] | [0]");
            if (order && order !== null) return order;
        });
        pin = (typeof item[0] !== 'undefined' && item[0].pin) ? true : false;
    }
    return pin;
}
export function updatePriorityKanbanItens(board, mode) {
    $('#kanbanAtivPanel').find('.kanban-board[data-id="' + board + '"]').find('.kanban-item:visible').each(function (i) {
        var priority = $(this).find('.kanban-item-priority');
        var data = priority.data();
        var index = (mode == 'update') ? i + 1 : data.priority;
        priority.data('priority', index).html('<span>' + index + '</span>');
    });
}
export function setStorePriorityKanbanItens(board) {
    var priority = [];
    $('#kanbanAtivPanel').find('.kanban-board[data-id="' + board + '"]').find('.kanban-item:visible').each(function (i) {
        var data = $(this).data();
        var id = parseInt(data.eid.replace('_id_', ''));
        var index = i + 1;
        priority.push({ id_demanda: id, prioridade: index });
    });
    if (priority.length > 0) {
        $('#kanbanAtivPanel').find('.kanban-board[data-id="' + board + '"]').find('.kanban-item:visible .kanban-item-priority').html('<span><i class="fas fa-sync fa-spin" style="color: #fff;"></i></span>');
        var action = 'update_prioridades';
        var param = {
            action: action,
            prioridades: priority,
            board: board
        };
        getServerAtividades(param, action);
    }
}
export function setStoreOrderKanbanItens() {
    var itens = [{
        name: '_niniciadas',
        order: getOrderKanbanItens('_niniciadas')
    }, {
        name: '_iniciadas',
        order: getOrderKanbanItens('_iniciadas')
    }, {
        name: '_concluidas',
        order: getOrderKanbanItens('_concluidas')
    }, {
        name: '_avaliadas',
        order: getOrderKanbanItens('_avaliadas')
    }];
    setOptionsPro('kanbanAtividadesOrder', itens);
}
export function getOrderKanbanItens(board) {
    var order = [];
    $('.kanban-board[data-id="' + board + '"] .kanban-item').each(function (index, value) {
        var id = $(this).data('eid');
        var id_demanda = (id.indexOf('_id_') !== -1) ? parseInt(id.replace('_id_', '')) : id;
        var pin = $(this).find('.kanban-pinboard a').hasClass('newLink_active');
        order.push({ id_demanda: id_demanda, order: index, pin: pin });
    });
    return order;
}
export function getSortKanbanItens(listAtividades, nameBoard) {
    var order = getStoreOrderKanbanItens(nameBoard);
    var type = getOptionsPro('filterTagType_kanban');
    if (type == 'user') {
        listAtividades = jmespath.search(listAtividades, "sort_by([*],&prioridade)");
    } else if (order.length > 0) {
        var checkPin = jmespath.search(order, "[?pin==`true`]");
        checkPin = (checkPin !== null && checkPin.length > 0) ? true : false;
        if (checkPin) {
            $.each(listAtividades, function (i, value) {
                listAtividades[i]['id_order'] = (jmespath.search(order, "[?id_demanda==`" + value.id_demanda + "`] | length(@)") > 0)
                    ? jmespath.search(order, "[?id_demanda==`" + value.id_demanda + "`].order | [0]")
                    : moment(value.prazo_entrega, 'YYYY-MM-DD HH:mm:ss').unix();
            });
            listAtividades = jmespath.search(listAtividades, "sort_by([*],&id_order)");
        } else {
            listAtividades = jmespath.search(listAtividades, "sort_by([*],&prazo_entrega)");
        }
    } else {
        listAtividades = jmespath.search(listAtividades, "sort_by([*],&prazo_entrega)");
    }
    return listAtividades;
}
export function cancelSelectedItensAtiv(id_demanda) {
    var tableDemanda = $('#tabelaAtivPanel table');
    var tr = tableDemanda.find('tr[data-index="' + id_demanda + '"]');
    // console.log(tr.is(':visible'), tr.hasClass('infraTrMarcada'));
    if (tr.is(':visible') && tr.hasClass('infraTrMarcada')) {
        tableDemanda.find('.lnkInfraCheck').data('index', 1).trigger('click');
        // console.log(tr.find('.lnkInfraCheck').data('index'));
    }
}
export function pinKanbanItens(this_, id_demanda) {
    var _this = $(this_);
    var _parent = _this.closest('.kanban-board');
    var _hasActive = _this.hasClass('newLink_active');
    var source = _parent.data('id');
    var value = callAtiv('getAtividadeData',id_demanda);
    var item = getKanbanItem(value);
    var order = (_hasActive) ? -1 : 0;

    kanbanAtividades.removeElement(item.id);
    kanbanAtividades.addElement(source, item, order);

    if (!_hasActive) {
        $('.kanban-container').animate({ scrollTop: 0 }, 500, function () {
            $('.kanban-item[data-eid="_id_' + id_demanda + '"] .kanban-pinboard a').addClass('newLink_active').attr('data-tip', 'Remover do topo');
            setStoreOrderKanbanItens();
        });
    } else {
        $('.kanban-item[data-eid="_id_' + id_demanda + '"] .kanban-pinboard a').removeClass('newLink_active').attr('data-tip', 'Fixar no topo');
        setStoreOrderKanbanItens();
    }
    infraTooltipOcultar();
}
export function cancelMoveKanbanItens() {
    var item = kanbanAtividadesMoving;
    if (item && $('#kanbanAtivPanel').is(':visible')) {
        var value = jmespath.search(arrayAtividadesPro, "[?id_demanda==`" + item.id_demanda + "`] | [0]");
        kanbanAtividades.removeElement(item.id);
        kanbanAtividades.addElement(item.source, getKanbanItem(value), 0);
    }
}
export function getKanbanItem(value) {
    var classes = [];
    if (typeof value.etiquetas !== 'undefined' && value.etiquetas !== null) {
        $.each(value.etiquetas, function (i, v) {
            var tag = 'tagKanName_' + normalizeNameTag(v);
            classes.push(tag);
        });
    }
    var tagUser = (value.id_user != 0) ? 'tagKanName_' + normalizeNameTag(value.apelido) : 'tagKanName_naoatribuido';
    classes.push(tagUser);
    classes.push('tagKanName_' + normalizeNameTag(value.sigla_unidade));
    if (value.id_user != 0 && value.id_user != parseInt(arrayConfigAtividades.perfil.id_user) && callAtiv('checkCapacidade','only_self_atividades')) {
        classes.push('tagKanban_notmove');
    }
    var tagDate = getDatesPreview(callAtiv('getConfigDateAtiv',value));

    var check_ispaused = (typeof value.data_retomada !== 'undefined' && value.data_retomada !== null && value.data_retomada == '0000-00-00 00:00:00') ? true : false;
    var checkConfigAtiv = jmespath.search(arrayConfigAtividades.atividades, "[?id_atividade==`" + value.id_atividade + "`] | [0].config.desativa_produtividade");

    var btnPause = (!checkConfigAtiv && value.data_inicio != '0000-00-00 00:00:00' && value.data_entrega == '0000-00-00 00:00:00' && callAtiv('checkCapacidade','pause_atividade') && callAtiv('checkPermissionAtiv',value))
        ? '<span class="info_dates_pause" style="display:block; padding: 0;opacity: 1;">' +
        '   <a class="newLink datePausado info_noclick" data-act="atividades-call" data-fn="pauseAtividade" data-scope="parent" data-pass-el="0" data-id="' + value.id_demanda + '">' +
        '       <i class="fas fa-' + (check_ispaused ? 'play' : 'pause') + '-circle ' + (check_ispaused ? 'azulColor' : 'laranjaColor') + '" style="padding-right: 3px;"></i>' +
        '       ' + (check_ispaused ? __.Retomar + ' ' + __.demanda : 'Inserir ' + __.paralisacao) +
        '   </a> ' +
        '</span>'
        : '';

    var timerAtiv = (value.data_inicio != '0000-00-00 00:00:00' && value.data_entrega == '0000-00-00 00:00:00')
        ? callAtiv('getTagTempoDecorridoAtiv',value)
        : (value.data_entrega != '0000-00-00 00:00:00' && value.data_avaliacao == '0000-00-00 00:00:00')
            ? callAtiv('getTagTempoDespendidoAtiv',value)
            : '';
    timerAtiv = (!callAtiv('checkOptionEntidade','desativa_produtividade_geral')) ? timerAtiv : '';

    var btnActionAtiv = callAtiv('getBtnActionsAtividade',value);

    var btnExtend = (value.data_inicio != '0000-00-00 00:00:00' && value.data_entrega == '0000-00-00 00:00:00' && callAtiv('checkCapacidade','extend_atividade') && callAtiv('checkPermissionAtiv',value))
        ? '<span class="info_dates_extend" style="display:block; padding: 0;opacity: 1;">' +
        '   <a class="newLink dateExtend info_noclick" data-act="atividades-call" data-fn="extendAtividade" data-scope="parent" data-pass-el="0" data-id="' + value.id_demanda + '">' +
        '      <i class="fas fa-retweet azulColor" style="padding-right: 3px;"></i>' +
        '      ' + __.Prorrogar + ' ' + __.demanda +
        '   </a>' +
        '</span>'
        : '';

    var btnVariation = (value.data_inicio != '0000-00-00 00:00:00' && value.data_avaliacao == '0000-00-00 00:00:00' && (callAtiv('checkCapacidade','variation_atividade') || callAtiv('checkCapacidade','type_atividade')) && callAtiv('checkPermissionAtiv',value))
        ? '<span class="info_dates_extend" style="display:block; padding: 0;opacity: 1;">' +
        '   <a class="newLink dateExtend info_noclick" data-act="atividades-call" data-fn="variationAtividade" data-scope="parent" data-pass-el="0" data-id="' + value.id_demanda + '">' +
        '      <i class="fas fa-' + (value.tempo_pactuado == 0 ? 'clipboard-list' : 'graduation-cap') + ' azulColor" style="padding-right: 3px;"></i>' +
        '      ' + (value.tempo_pactuado == 0 ? 'Atribuir ' + __.atividade : 'Alterar ' + __.complexidade) +
        '   </a>' +
        '</span>'
        : '';

    var tempoPactuado = (value.tempo_pactuado == 0) ? 'N\u00E3o pactuado' : decimalHourToMinute(value.tempo_pactuado) + ' ' + (value.tempo_pactuado > 1 ? 'horas' : 'hora');
    var tagPacto = '<span class="info_tags_follow info_tags_pacto">' +
        '   <span data-colortag="#bfd5e8" style="background-color: #eef4f9;" class="tag_text" title="' + value.tempo_pactuado + ' ' + (value.tempo_pactuado > 1 ? 'horas' : 'hora') + '">' +
        '       <i data-colortag="#406987" class="fas fa-handshake" style="font-size: 90%; margin: 0px 2px; color: #406987;"></i>' +
        '       ' + tempoPactuado +
        '   </span>' +
        '</span>';

    var infoAtiv = ($(btnActionAtiv).find('.fa-info-circle').length > 0)
        ? ' '
        : '<span class="info_ativ" style="display:block; padding: 0;opacity: 1;">' +
        '   <a class="newLink info_noclick" data-act="atividades-call" data-fn="infoAtividade" data-scope="parent" data-pass-el="0" data-id="' + value.id_demanda + '">' +
        '      <i class="fas fa-info-circle azulColor" style="padding-right: 3px;"></i>' +
        '      Informa\u00E7\u00F5es ' + __.da_demanda + '' +
        '   </a>' +
        '</span>';

    var obsGerencial = (value && value.observacao_gerencial !== null && value.observacao_gerencial != '')
        ? '<span class="inlineAlert content_edit" data-field="observacao_gerencial" style="position:relative" data-id="' + value.id_demanda + '">' +
        '   <i class="fas fa-comment-alt" style="color: #7baaf7;position: absolute;"></i>' +
        '   <span class="info" style="text-indent: 20px;display: block;">' + replaceTextToProcessoSEI(replaceTextToUrl(value.observacao_gerencial)) + '</span>' +
        '   ' + (callAtiv('checkCapacidade','edit_field') && callAtiv('checkPermissionAtiv',value) && callAtiv('checkCapacidade','edit_observacao_gerencial') ? '<a class="newLink newLink_active followLink followLinkDesc content_btnsave kanban-actions-edit info_noclick" style="right: -15px;top: 5px;" data-act="atividades-call" data-fn="editFieldAtiv" data-scope="parent" data-tip="Editar ' + __.Observacao + ' ' + __.Gerencial + '"><i class="fas fa-edit azulColor" style="font-size: 100%;"></i></a>' : '') +
        '</span>'
        : '';

    var obsTecnica = (value && value.observacao_tecnica !== null && value.observacao_tecnica != '')
        ? '<span class="inlineAlert content_edit" data-field="observacao_tecnica" style="position:relative" data-id="' + value.id_demanda + '">' +
        '   <i class="fas fa-reply-all" style="color: #7baaf7;position: absolute;"></i>' +
        '   <span class="info" style="text-indent: 20px;display: block;">' + replaceTextToProcessoSEI(replaceTextToUrl(value.observacao_tecnica)) + '</span>' +
        '   ' + (callAtiv('checkCapacidade','edit_field') && callAtiv('checkPermissionAtiv',value) && callAtiv('checkCapacidade','edit_observacao_tecnica') ? '<a class="newLink newLink_active followLink followLinkDesc content_btnsave kanban-actions-edit info_noclick" style="right: -15px;top: 5px;" data-act="atividades-call" data-fn="editFieldAtiv" data-scope="parent" data-tip="Editar ' + __.Observacao + ' ' + __.Tecnica + '"><i class="fas fa-edit azulColor" style="font-size: 100%;"></i></a>' : '') +
        '</span>'
        : '';

    var pinBoard = '<span style="float: right;margin: -5px -10px 0 0;" class="kanban-pinboard info_noclick"><a class="newLink info_noclick ' + (getPinKanbanItem(value.id_demanda) ? 'newLink_active' : '') + '" data-act="atividades-call" data-fn="pinKanbanItens" data-id="' + value.id_demanda + '" data-tip="' + (getPinKanbanItem(value.id_demanda) ? 'Remover do topo' : 'Fixar no topo') + '"><i class="fas fa-thumbtack cinzaColor"></i></a></span>';

    var checklist = callAtiv('getInfoAtividadeChecklist',value, 'actions');
    var titleReumeDemanda = (typeof value.assunto !== 'undefined' && value.assunto.length > 50 ? value.assunto.replace(/^(.{50}[^\s]*).*/, "$1") + '...' : value.assunto);

    if (tagDate != '') { classes.push('tagKanName_' + $(tagDate).data('tagname')) }
    var item = {
        id: "_id_" + value.id_demanda,
        title: pinBoard +
            '<div class="kanban-content">' +
            '   <div class="kanban-title-card content_edit" data-field="assunto" data-id="' + value.id_demanda + '">' +
            '       <span class="info" style="width: 75%;">' + value.assunto + '</span>' +
            '       ' + (callAtiv('checkCapacidade','edit_field') && callAtiv('checkPermissionAtiv',value) && callAtiv('checkCapacidade','edit_assunto') ? '<a style="margin: -6px -10px 0 -20px;" class="newLink newLink_active followLink content_btnsave kanban-actions-edit info_noclick" data-act="atividades-call" data-fn="editFieldAtiv" data-scope="parent" data-tip="Editar ' + __.assunto + '"><i class="fas fa-edit azulColor" style="font-size: 100%;"></i></a>' : '') +
            '   </div>' +
            '   <div class="kanban-description">' +
            '       <sub title="' + callAtiv('getTitleDialogBox',value, true) + '">' +
            '       <div style="margin: 0 0 8px 0;" class="info_noclick">' + callAtiv('getHtmlLinkRequisicao',value, true) + '</div>' +
            '       ' + callAtiv('getTitleDialogBox',value) +
            '       </sub>' +
            '       ' + obsGerencial +
            '       ' + obsTecnica +
            '       <span class="info_tags_follow info_tags_follow_etiquetas" style="float: right;display: block;">' +
            '           ' + (typeof value.etiquetas !== 'undefined' && value.etiquetas !== null && value.etiquetas.length > 0 ? $.map(value.etiquetas, function (i) { return $(getHtmlEtiqueta(i, 'ativ'))[0].outerHTML }).join('') : '') +
            '       </span>' +
            '       <span class="info_tags_follow">' + callAtiv('getHtmlEtiquetaUnidade',value) + tagPacto + '</span>' +
            '       <span class="info_dates_monitorado" style="display: block; margin: 10px 0;">' + timerAtiv + tagDate + '</span>' +
            '   </div>' +
            '   <div class="kanban-actions">' +
            '       ' + btnActionAtiv +
            '       ' + btnPause +
            '       ' + btnExtend +
            '       ' + btnVariation +
            '       ' + infoAtiv +
            '       ' + checklist +
            '   </div>' +
            '</div>',
        click: function (el) {
            var checkOver = ($(el).find('.info_noclick:hover').length > 0) ? $(el).find('.info_noclick:hover') : false;
            if (!dialogBoxPro && !checkOver) {
                callAtiv('infoAtividade',value.id_demanda);
            }
        },
        class: classes
    };
    return item;
}
export function checklistOpen(this_) {
    var _this = $(this_);
    var type_container = (_this.closest('.kanban-item').length > 0) ? 'kanban' : 'table';
    var _container = (type_container == 'kanban') ? _this.closest('.kanban-item') : _this.closest('td');
    _this.closest('.info_checklist_btn').hide();
    _container.find('.info_checklist').show().find('.checklist_edit').trigger('click');

}
export function checklistToggle(this_) {
    var _this = $(this_);
    var _parent = _this.closest('.info_checklist');
    var itens = _parent.find('.info_checklist_itens');
    itens.toggle();
    _this.find('i').toggleClass('fa-chevron-down fa-chevron-right');
}
export function checklistEdit(this_) {
    var _this = $(this_);
    var _parent = _this.closest('.info_checklist');
    _parent.toggleClass('edit');
    var itens = _parent.find('.info_checklist_itens');
    if (!_parent.hasClass('edit')) {
        itens.sortable('destroy');
        itens.find('.label_name').prop('contenteditable', false);
    } else {
        itens.sortable({
            items: '.info_checklist_item',
            cursor: 'grabbing',
            handle: '.checklist_order',
            forceHelperSize: true,
            opacity: 0.5,
            axis: 'y',
            dropOnEmpty: false,
            update: function (event, ui) {
                var list_ordem = [];
                $(this).find('.info_checklist_item').each(function (i) {
                    $(this).attr('data-ordem', i);
                    list_ordem.push({ id_checklist: $(this).data('id-checklist'), ordem: i });
                });
                updateChecklistOrder(list_ordem, $(this).data('id-demanda'));
                $(this).closest('.info_checklist').find('.checklist_edit i').attr('class', 'fas fa-sync-alt fa-spin azulColor');
            }
        });
    }
}
export function updateChecklistOrder(list_ordem, id_demanda) {
    if (callAtiv('checkCapacidade','update_checklist_all') || callAtiv('checkCapacidade','update_checklist')) {
        var action = 'update_checklist';
        var param = {
            action: action,
            mode: 'order',
            list_ordem: list_ordem,
            id_demanda: id_demanda
        };
        getServerAtividades(param, action);
    }
}
export function updateProgressChecklist(id_checklist) {
    var target = ($('#ifrArvore').length > 0) ? $('#ifrArvore').contents() : $('body');
    var item = (target.find('.info_checklist_item[data-id-checklist="' + id_checklist + '"]').length > 0)
        ? target.find('.info_checklist_item[data-id-checklist="' + id_checklist + '"]')
        : target.find('.info_checklist_item').first();
    var _parent = item.closest('.kanban-item');
    _parent = (_parent.length == 0) ? item.closest('.tableInfo') : _parent;
    var value = _parent.find('.info_checklist_item.checklist_checked').length;
    var max = _parent.find('.info_checklist_item').length;
    var progress = _parent.find('.checklist_progress');
    progress.attr('data-valuenow', value).attr('data-max', max);
    progress.progressbar({
        value: value,
        max: max
    });
    if (progress.find('.ui-progressbar-value').length > 1) { progress.find('.ui-progressbar-value').eq(0).remove() }
}
export function checklistUpdate(this_, mode, data = false, param = false) {
    if (mode == 'send') {
        var _this = $(this_);
        var _parent = _this.closest('.info_checklist_item');
        var data_this = _parent.data();
        var value = jmespath.search(arrayAtividadesPro, "[?id_demanda==`" + data_this.idDemanda + "`] | [0]");
        var _parent_list = _this.closest('.info_checklist');
        if (_parent_list.hasClass('edit')) {
            _this.find('.label_name').prop('contenteditable', true).focus();
        } else {
            if (value.data_inicio == '0000-00-00 00:00:00' && !callAtiv('checkCapacidade','update_checklist_all')) {
                confirmaBoxPro(__.A_demanda + ' ainda n\u00E3o foi ' + getNameGenre('demanda', 'iniciado', 'iniciada') + '. Deseja iniciar agora?', function () { callAtiv('startAtividade',data_this.idDemanda) }, 'Iniciar');
            } else {
                var checked = _parent.hasClass('checklist_checked');
                var action = 'update_checklist';
                var param = {
                    action: action,
                    mode: 'check',
                    checked: checked,
                    id_checklist: data_this.idChecklist,
                    id_demanda: data_this.idDemanda
                };
                getServerAtividades(param, action);
                _parent.find('.label_item i').attr('class', 'fas fa-sync-alt fa-spin');
            }
        }
    } else if (mode == 'update') {
        var target = ($('#ifrArvore').length > 0) ? $('#ifrArvore').contents() : $('body');
        var value = jmespath.search(arrayAtividadesPro, "[?id_demanda==`" + param.id_demanda + "`] | [0]");
        loadingButtonConfirm(false);
        if (param.mode == 'check') {
            var item = target.find('.info_checklist_item[data-id-checklist="' + param.id_checklist + '"]');
            if (item.hasClass('checklist_checked')) {
                item.removeClass('checklist_checked').find('.label_item i').attr('class', 'far fa-square').end().find('.checklist_date').text('').attr('data-date-fim', '0000-00-00 00:00:00');
            } else {
                item.addClass('checklist_checked').find('.label_item i').attr('class', 'fas fa-check-square').end().find('.checklist_date').text(getDateSemantic({ date: data.data_fim }).dateref).attr('data-date-fim', data.data_fim);
            }
            updateProgressChecklist(param.id_checklist);
        } else if (param.mode == 'order') {
            var checklist = target.find('.info_checklist[data-id-demanda="' + param.id_demanda + '"]');
            if (data.update_all) {
                checklist.find('.checklist_edit i').attr('class', 'fas fa-edit azulColor');
            } else {
                checklist.find('.checklist_edit i').attr('class', 'fas fa-exclamation-circle vermelhoColor');
            }
        } else if (param.mode == 'remove') {
            var item = target.find('.info_checklist_item[data-id-checklist="' + param.id_checklist + '"]');
            item.slideUp('slow', function () {
                $(this).remove();
                setTimeout(function () {
                    updateProgressChecklist(param.id_checklist);
                }, 500);
            });
        } else if (param.mode == 'rename') {
            var item = target.find('.info_checklist_item[data-id-checklist="' + param.id_checklist + '"]');
            if (item.hasClass('checklist_checked')) {
                item.find('.label_item i').attr('class', 'fas fa-check-square');
            } else {
                item.find('.label_item i').attr('class', 'far fa-square');
            }
            var itens = item.closest('.info_checklist').find('.info_checklist_item');
            var iten_num = itens.index(item) + 1;
            iten_num = (iten_num > itens.length - 1) ? 0 : iten_num;
            itens.eq(iten_num).find('.label_name').prop('contenteditable', true).focus();
        } else if (param.mode == 'new') {
            var checklist = target.find('.info_checklist[data-id-demanda="' + param.id_demanda + '"]');
            var verifyCheck = ((callAtiv('checkCapacidade','update_checklist') && value.id_user == arrayConfigAtividades.perfil.id_user) || callAtiv('checkCapacidade','update_checklist_all')) ? true : false;
            checklist.find('.checklist_new i').attr('class', 'fas fa-plus-circle azulColor');

            var htmlItem = '   <span class="info_checklist_item" data-id-checklist="' + data.id_checklist + '" data-id-demanda="' + param.id_demanda + '" data-ordem="999" data-old-value="Novo Item">' +
                '       <span class="label_item" data-act="atividades-call" data-fn="checklistUpdate" data-scope="parent" data-arg="send" data-enter-fn="checklistUpdate" data-enter-arg="rename" style="cursor:pointer" >' +
                '           <i class="far fa-square" style="color: #406987; margin-right: 3px; cursor: pointer; font-size: 12pt;"></i> ' +
                '           <span class="label_name" ' + (verifyCheck ? 'data-act="atividades-call" data-fn="checklistUpdate" data-scope="parent" data-arg="rename" data-on="blur"' : '') + ' contenteditable="true">Novo Item</span>' +
                '       </span>' +
                '       <span class="label_options">' +
                '           <span class="checklist_remove" data-act="atividades-call" data-fn="checklistUpdate" data-scope="parent" data-arg="remove" style="cursor:pointer"><i class="far fa-trash-alt cinzaColor" style="font-size: 10pt;"></i></span>' +
                '           <span class="checklist_order" ><i class="fas fa-bars cinzaColor" style="font-size: 12pt;"></i></span>' +
                '           <span class="checklist_date" data-date-fim="0000-00-00 00:00:00"></span>' +
                '       </span>' +
                '   </span>';
            checklist.find('.info_checklist_itens').append(htmlItem);
            var label = checklist.find('.info_checklist_item').last().find('.label_name');
            setTimeout(function () {
                label.focus();
                selectTextPro(label[0]);
            }, 100);
        }
    } else if (mode == 'remove') {
        var _this = $(this_);
        var _parent = _this.closest('.info_checklist_item');
        var data_this = _parent.data();
        confirmaBoxPro('Tem certeza que deseja excluir este item?', function () {
            var action = 'update_checklist';
            var param = {
                action: action,
                mode: 'remove',
                id_checklist: data_this.idChecklist,
                id_demanda: data_this.idDemanda
            };
            getServerAtividades(param, action);
            _this.find('i').attr('class', 'fas fa-sync-alt fa-spin cinzaColor');
        }, 'Excluir');
    } else if (mode == 'rename') {
        var _this = $(this_);
        var _parent = _this.closest('.info_checklist_item');
        var _parent_list = _this.closest('.info_checklist');
        var data_this = _parent.data();
        var text = _this.text().trim();
        if (_parent_list.hasClass('edit') && (data_this.oldValue != text)) {
            var action = 'update_checklist';
            var param = {
                action: action,
                mode: 'rename',
                nome_checklist: text,
                id_checklist: data_this.idChecklist,
                id_demanda: data_this.idDemanda
            };
            getServerAtividades(param, action);
            _parent.find('.label_item i').attr('class', 'fas fa-sync-alt fa-spin');
            _parent.find('.label_name').text(text)
            _parent.data('old-value', text);
        }
    } else if (mode == 'new') {
        var _this = $(this_);
        var _parent = _this.closest('.info_checklist');
        var data_this = _parent.data();
        var action = 'update_checklist';
        var param = {
            action: action,
            mode: 'new',
            id_demanda: data_this.idDemanda
        };
        getServerAtividades(param, action);
        _this.find('i').attr('class', 'fas fa-sync-alt fa-spin');
    }
    checklistUpdateArray(param.id_demanda, data.checklist);
}
export function checklistUpdateArray(targetID_demanda, dataChecklist) {
    checklistUpdateArrayAtiv(targetID_demanda, dataChecklist);
    var value = callAtiv('getAtividadeData',targetID_demanda);
    var checklistHtml = (value.checklist && value.checklist.length > 0) ? callAtiv('getInfoAtividadeChecklist',value, 'icon') : '';
    var tr = $('#tabelaAtivPanel tr[data-index="' + targetID_demanda + '"] td[data-type="user"]');
    if (checklistHtml != '') {
        tr.find('.info_checklist_icon').remove();
        tr.append(checklistHtml);
        callAtiv('getHtmlTableAtiv',);
    }
}
export function checklistUpdateArrayAtiv(targetID_demanda, dataChecklist) {
    var demandaIndex = (!arrayAtividades) ? -1 : arrayAtividades.findIndex((obj => obj.id_demanda == targetID_demanda));
    if (demandaIndex !== -1 && typeof dataChecklist !== 'undefined') arrayAtividades[demandaIndex].checklist = dataChecklist;

    var demandaIndexPro = (!arrayAtividadesPro) ? -1 : arrayAtividadesPro.findIndex((obj => obj.id_demanda == targetID_demanda));
    if (demandaIndexPro !== -1 && typeof dataChecklist !== 'undefined') arrayAtividadesPro[demandaIndexPro].checklist = dataChecklist;

    var demandaIndexProc = (!arrayAtividadesProcPro) ? -1 : arrayAtividadesProcPro.findIndex((obj => obj.id_demanda == targetID_demanda));
    if (demandaIndexProc !== -1 && typeof dataChecklist !== 'undefined') arrayAtividadesProcPro[demandaIndexProc].checklist = dataChecklist;

    hybridStorageStorePro('configDataAtividadesPro', arrayAtividadesPro);

    return arrayAtividades;
}
export function checkAtivProdutividade(this_, value) {
    var _this = $(this_);
    var _parent = _this.closest('.ui-dialog');
    if (!callAtiv('checkOptionEntidade','desativa_produtividade_geral') && _parent.find('.info_alerta_produtividade').length > 0) {
        confirmaFraseBoxPro('O tempo despendido para ' + __.esta_demanda + ' est\u00E1 abaixo do esperado para ' + __.a_atividade + '. <br><br> Tempos despendidos anormais, fora do m\u00EDnimo esperado, poder\u00E3o motivar a <b style="font-weight: bold;">REVIS\u00C3O</b> dos atuais tempos pactuados desta unidade. <br><br> Deseja continuar?', 'SIM', function () {
            if (checkAtivChecklist(this_, value)) {
                callAtiv('sendCompleteAtividade',this_, value);
            }
        });
        return false;
    } else {
        return true;
    }
}
export function checkAtivChecklist(this_, value) {
    var checklist = value.checklist;
    if (checklist && checklist.length > 0) {
        var _this = $(this_);
        var checklist_div = _this.find('.info_checklist');
        var totalItens = checklist_div.find('.info_checklist_itens .info_checklist_item').length;
        var checkedItens = checklist_div.find('.info_checklist_itens .info_checklist_item.checklist_checked').length;
        var decimalItensCheckeds = (typeof totalItens !== 'undefined' && isNumeric(totalItens) && totalItens > 0) ? checkedItens / totalItens : 1;
        var tempoPactuadoProporcional = parseInt((value.tempo_pactuado * decimalItensCheckeds).toFixed(2));
        var tempoPactuadoRestante = parseInt((value.tempo_pactuado - (value.tempo_pactuado * decimalItensCheckeds)).toFixed(2));
        if (totalItens == checkedItens) {
            return true;
        } else {
            confirmaFraseBoxPro('Existem itens do <b style="font-weight: bold;">CHECKLIST</b> pendentes de conclus\u00E3o. <br><br><i class="fas fa-exclamation-triangle vermelhoColor" style="margin: 0 5px;"></i><strong style="color: red;">Aten\u00E7\u00E3o:</strong> O tempo pactuado para a demanda (' + decimalHourToMinute(value.tempo_pactuado) + ' horas) ser\u00E1 reduzido proporcionalmente ao n\u00FAmero de itens cumpridos do checklist (' + decimalHourToMinute(tempoPactuadoProporcional) + ' horas). <br><br>Deseja continuar?', 'SIM', function () { callAtiv('sendCompleteAtividade',this_, value, tempoPactuadoRestante) });
            return false;
        }
    } else {
        return true;
    }
}
export function getKanbanUserPriority(this_, mode) {
    var _this = $(this_);
    var _parent = _this.closest('#kanbanAtivPanel');
    if (mode == 'add') {
        _parent.find('.kanban-board').addClass('kanban-priority').each(function () {
            var data = $(this).data();
            if (data.id == '_niniciadas') {
                $(this).find('.kanban-item:visible').each(function (index, value) {
                    var priority = index + 1;
                    var htmlPriority = '<div class="kanban-item-priority ' + (!callAtiv('checkCapacidade','update_prioridades') ? 'disabled' : '') + '" data-priority="' + priority + '"><span>' + priority + '</span></div>';
                    $(this).find('.kanban-item-priority').remove();
                    $(this).prepend(htmlPriority);
                });
            }
        });
    } else if (mode == 'remove') {
        $('#kanbanAtivPanel').find('.kanban-board').removeClass('kanban-priority');
        _parent.find('.kanban-item-priority').remove();
    }
}
export function getHtmlKanbanUserPriority() {
    var html = '<div id="filterTagKanban_user" style="margin-top: 10px;">' +
        '   <span class="alertaBoxDisplay"> ' +
        '       <i class="fas fa-info-circle azulColor" style="margin: 0 5px;"></i> ' +
        '       Dica: Priorize ' + __.as_demandas + ' a serem ' + getNameGenre('demanda', 'executados', 'executadas') + '! Utilize o \u00EDcone <i class="fas fa-bars cinzaColor" style="margin: 0 5px;"></i> para arrastar os cart\u00F5es para cima ou para baixo' +
        '   </span>' +
        '</div>';
    return html;
}
export function getKanbanItensAtividade(listAtividades) {
    var boards = [];
    $.each(listAtividades, function (index, value) {
        var itens = getKanbanItem(value);
        boards.push(itens);
    });
    return boards;
}
export function initGanttAtividades(bar_class = false, TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    if (typeof Gantt !== 'undefined') {
        getGanttAtividades(bar_class);
    } else {
        if (typeof Gantt === 'undefined' && typeof URL_SPRO !== 'undefined' && TimeOut == 9000) {
            if (typeof loadStylePro === 'function') loadStylePro(URL_SPRO + 'css/frappe-gantt.css');
            $.getScript(URL_SPRO + "js/lib/frappe-gantt.js");
        }
        setTimeout(function () {
            initGanttAtividades(bar_class, TimeOut - 100);
            if (typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage')) console.log('Reload initGanttAtividades');
        }, 500);
    }
}
export function getGanttAtividades(bar_class = false) {
    $('#ganttAtivPanel').html('').show();
    var task = [];
    var dataFall = '';
    var listAtividades = jmespath.search(arrayAtividadesPro, "reverse(@)");
    if (listAtividades.length > 0) {
        var viewModeGantt = (getOptionsPro('ganttAtividadesView')) ? getOptionsPro('ganttAtividadesView') : 'Week';
        $.each(listAtividades, function (index, value) {
            var distribuicao = moment(value.data_distribuicao, "YYYY-MM-DD HH:mm:ss");
            var prazo = moment(value.prazo_entrega, "YYYY-MM-DD HH:mm:ss");
            var entrega = moment(value.data_entrega, "YYYY-MM-DD HH:mm:ss");
            var customClass = (moment() <= prazo && moment() >= distribuicao) ? 'bar-em-execucao' : 'bar-fora-execucao';
            customClass = (value.data_inicio != '0000-00-00 00:00:00' && prazo > moment()) ? 'bar-iniciado' : customClass;
            customClass = (value.data_inicio != '0000-00-00 00:00:00' && prazo < moment()) ? 'bar-ematraso' : customClass;
            customClass = (value.data_inicio == '0000-00-00 00:00:00' && prazo < moment()) ? 'bar-nao-iniciado' : customClass;
            customClass = (value.data_entrega != '0000-00-00 00:00:00' && entrega <= prazo) ? 'bar-concluido-noprazo' : customClass;
            customClass = (value.data_entrega != '0000-00-00 00:00:00' && entrega > prazo) ? 'bar-concluido-foraprazo' : customClass;
            customClass = (value.data_entrega == '0000-00-00 00:00:00' && prazo < moment()) ? 'bar-ematraso' : customClass;
            customClass = (value.data_entrega != '0000-00-00 00:00:00' && value.data_avaliacao == '0000-00-00 00:00:00' && value.data_envio == '0000-00-00 00:00:00') ? customClass + ' date_entregue' : customClass;
            customClass = (value.data_entrega != '0000-00-00 00:00:00' && value.data_avaliacao != '0000-00-00 00:00:00' && value.data_envio == '0000-00-00 00:00:00') ? customClass + ' date_avaliado' : customClass;
            customClass = (value.data_entrega == '0000-00-00 00:00:00' && prazo > moment()) ? customClass + ' date_noprazo' : customClass;
            customClass = (value.data_entrega == '0000-00-00 00:00:00' && prazo < moment()) ? customClass + ' date_atrasado' : customClass;
            customClass = (typeof value.apelido !== 'undefined') ? customClass + ' ' + normalizeNameTag(value.apelido) : customClass;
            customClass = (typeof value.etiquetas !== 'undefined' && value.etiquetas !== null) ? customClass + ' ' + $.map(value.etiquetas, function (i) { return normalizeNameTag(i); }).join(' ') : customClass;

            var dependencia_array = (typeof value.id_vinculacao !== 'undefined' && value.id_vinculacao !== null && value.id_vinculacao.indexOf('_') !== -1) ? value.id_vinculacao.split('_') : false;
            var dependencia = (dependencia_array)
                ? (parseInt(dependencia_array[1]) != 0) ? (dependencia_array[0] + '_' + (parseInt(dependencia_array[1]) - 1).toString()) : false
                : false;
            dependencia = (dependencia) ? jmespath.search(listAtividades, "[?id_vinculacao=='" + dependencia + "'] | [0].id_demanda") : false;
            dependencia = (dependencia && dependencia !== null) ? dependencia.toString() : '';
            var task_title_asunto = (value.assunto.length > 50 ? value.assunto.replace(/^(.{50}[^\s]*).*/, "$1") + '...' : value.assunto);
            var task_title = (typeof value.apelido !== 'undefined' ? '(' + value.apelido + ') ' : '') + task_title_asunto;

            // console.log(value.id_vinculacao, dependencia_array, dependencia, dependencia_array[0], parseInt(dependencia_array[1])-1, (parseInt(dependencia_array[1])-1).toString());
            var taskAtividade = {
                id: value.id_demanda.toString(),
                name: task_title,
                start: distribuicao.format("YYYY-MM-DD"),
                end: prazo.format("YYYY-MM-DD"),
                progress: (value.data_entrega != '0000-00-00 00:00:00')
                    ? 100
                    : (value.data_inicio != '0000-00-00 00:00:00') ? (value.checklist ? callAtiv('getInfoAtividadeChecklist',value, 'percent') : 50) : 0,
                dependencies: dependencia,
                custom_class: withSeiproBarClasses(customClass)
            };
            if (!bar_class || (bar_class && customClass.indexOf(bar_class) !== -1)) {
                task.push(taskAtividade);
            }
        });
        if (task.length > 0) {
            var gantt = new Gantt("#ganttAtivPanel", task, {
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
                    var value = jmespath.search(arrayAtividadesPro, "[?id_demanda==`" + task.id + "`] | [0]");
                    var htmlActionsAtividade = callAtiv('actionsAtividade',value.id_demanda, 'icon');
                    var html = '<div class="details-container seiProForm">' +
                        '   <table class="tableInfo tableLine">' +
                        '      <tr>' +
                        '           <td colspan="2">' +
                        '               <h5><i class="iconPopup fas fa-comment-dots cinzaColor"></i> ' +
                        '                   <span class="boxInfo" style="font-size: 11pt;font-weight: bold;width: 85%;display: inline-block;">' + value.assunto + '</span>' +
                        '                   <a style="float: right; margin: -4px -4px 0 0; padding: 5px;" data-act="atividades-gantt-hide-popup" data-gantt="ganttAtividades"><i class="far fa-times-circle cinzaColor"></i></a>' +
                        '               </h5>' +
                        '           </td>' +
                        '      </tr>' +
                        '   ' + callAtiv('getInfoAtividade',value) +
                        '      <tr class="trCinza">' +
                        '           <td style="vertical-align: middle; padding: 0 10px;" colspan="2">' +
                        '               <p>' +
                        '                   <span class="boxInfo">' +
                        '                       <a class="ui-button ui-corner-all ui-widget" style="color: #2b2b2b; text-decoration: none; float: right;" data-act="atividades-call" data-fn="actionsAtividade" data-pass-el="0" data-id="' + value.id_demanda + '">' +
                        '                           <i style="margin-right: 3px; color: #8a8a8a;" class="' + htmlActionsAtividade.icon + '"></i>' +
                        '                           ' + htmlActionsAtividade.name +
                        '                       </a>' +
                        '                   </span>' +
                        '               </p>' +
                        '           </td>' +
                        '      </tr>' +
                        '   </table>' +
                        '</div>';
                    return html;
                },
                on_click: function (task) {
                }
            });
            ganttAtividades = gantt;
            if (!getOptionsPro('panelHeight_atividadesGanttPro') && $('#ganttAtivPanel').height() > 800) { setOptionsPro('panelHeight_atividadesGanttPro', 800) }
            $('.gantt-container').addClass('tabelaPanelScroll');
            initPanelResize('.gantt-container', 'atividadesGanttPro');
        } else {
            dataFall = '<div class="gantt-container dataFallback" data-text="Nenhum dado dispon\u00EDvel"></div>';
        }
        var btnGroupView = '<div style="position: absolute; right: 0; z-index: 99;">' +
            '   <div class="btn-group" role="group" style="float: right;">' +
            '       <button type="button" data-value="Day" class="btn btn-sm btn-light ' + (getOptionsPro('ganttAtividadesView') == 'Day' ? 'active' : '') + '">Dia</button>' +
            '       <button type="button" data-value="Week" class="btn btn-sm btn-light ' + (getOptionsPro('ganttAtividadesView') == 'Week' || !getOptionsPro('ganttAtividadesView') ? 'active' : '') + '">Semana</button>' +
            '       <button type="button" data-value="Month" class="btn btn-sm btn-light ' + (getOptionsPro('ganttAtividadesView') == 'Month' ? 'active' : '') + '">M\u00EAs</button>' +
            '   </div>' +
            '</div>';

        var selectFilterGantt = callAtiv('getSelectViewControl','ganttAtivPanel');

        var legendFilter = '<div class="filterGanttTag">' + selectFilterGantt +
            '   <span class="filterCustom" style="display:none">' + getFilterGanttTag(ganttAtividades, 'bar-custom', '-', bar_class, 'atividade') + '</span>' +
            '   ' + getFilterGanttTag(ganttAtividades, 'bar-nao-iniciado', 'Fora do prazo', bar_class, 'atividade') +
            '   ' + getFilterGanttTag(ganttAtividades, 'bar-em-execucao', 'No prazo', bar_class, 'atividade') +
            '   ' + getFilterGanttTag(ganttAtividades, 'bar-iniciado', 'Iniciada', bar_class, 'atividade') +
            '   ' + getFilterGanttTag(ganttAtividades, 'bar-ematraso', 'Iniciada em atraso', bar_class, 'atividade') +
            '   ' + getFilterGanttTag(ganttAtividades, 'bar-concluido-noprazo', 'Conclu\u00EDda no prazo', bar_class, 'atividade') +
            '   ' + getFilterGanttTag(ganttAtividades, 'bar-concluido-foraprazo', 'Conclu\u00EDda fora do prazo', bar_class, 'atividade') +
            '</div>';
        $('#ganttAtivPanel').css('max-width', ($('#atividadesProDiv').width() - 20)).prepend(legendFilter + btnGroupView + dataFall);

        if (ganttAtividades && ganttAtividades.bars.length > 0) {
            var scrollLeft = ganttAtividades.bars[0].x - 20;
            var windowDiv = $('#ganttAtivPanel').find('.gantt-container');
            windowDiv.animate({ scrollLeft: scrollLeft }, 500);

            var popupAtiv = $('#ganttAtivPanel').find('.popup-wrapper');
            if (popupAtiv.length > 0) {
                var observerPopupAtiv = new MutationObserver(function (mutations) {
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
                observerPopupAtiv.observe(popupAtiv.get(0), {
                    attributes: true
                });
            }
        }
        $("#ganttAtivPanel .btn-group").on("click", "button", function () {
            $btn = $(this);
            var mode = $btn.data('value');
            $btn.parent().find('button').removeClass('active');
            $btn.addClass('active');
            ganttAtividades.change_view_mode(mode);
            setOptionsPro('ganttAtividadesView', mode);
        });
        if (typeof $().chosen === 'function') {
            $('#selectViewControl_ganttAtivPanel').chosen({
                placeholder_text_single: ' ',
                no_results_text: 'Nenhum resultado encontrado',
                normalize_search_text: function (text) {
                    return removeAcentos(text.toLowerCase());
                }
            });
            forcePlaceHoldChosen();
        }
    } else {
        $('#ganttAtivPanel').html('<div class="dataFallback" data-text="Nenhum dado dispon\u00EDvel"></div>').show();
    }
}
export function getFilterGanttTag(gantt, bar_class, text, actived, mode) {
    var checkTasks = jmespath.search(gantt.tasks, "[?contains(custom_class, '" + bar_class + "')]");
    var counter = (checkTasks !== null && checkTasks.length > 0 && !actived) ? '<span class="counter">' + checkTasks.length + '</span>' : '';
    var html = '    <span title="' + text + ' (' + (checkTasks !== null ? checkTasks.length : '') + ')" class="bar-wrapper ' + bar_class + ' ' + (bar_class == actived ? 'active' : (actived) ? 'inative' : '') + '" data-bar="' + bar_class + '" data-mode="' + mode + '" data-act="atividades-call" data-fn="setFilterGanttTag">' +
        '        <span class="bar">' +
        '           ' + counter +
        '            <g class="bar-progress"></g>' +
        '        </span><span class="text">' + text + '</span>' +
        '    </span>';
    return ((checkTasks !== null && checkTasks.length > 0 && !actived) || actived) ? html : '';
    // return (checkTasks !== null && checkTasks.length > 0) ? html : '';
}
export function setFilterGanttTag(this_) {
    var _this = $(this_);
    var active = _this.hasClass('active');
    var data = _this.data();
    if (!active) {
        if (data.mode == 'atividade') {
            initGanttAtividades(data.bar);
            setOptionsPro('ganttAtividadesFilter', data.bar);
        } else if (data.mode == 'afastamento') {
            callAtiv('initGanttAfastamento',data.bar);
            setOptionsPro('ganttAfastamentosFilter', data.bar);
        }
    } else {
        if (data.mode == 'atividade') {
            initGanttAtividades();
            removeOptionsPro('ganttAtividadesFilter');
        } else if (data.mode == 'afastamento') {
            callAtiv('initGanttAfastamento',);
            removeOptionsPro('ganttAfastamentosFilter');
        }
    }
}
export function getChartAtividades(bar_class = false) {
    var panelChart = $('#chartAtivPanel');
    panelChart.show();
    if (typeof $().chosen === 'function') {
        panelChart.find('select').chosen({
            placeholder_text_single: ' ',
            no_results_text: 'Nenhum resultado encontrado',
            normalize_search_text: function (text) {
                return removeAcentos(text.toLowerCase());
            }
        });
    }
    if (panelChart.is(':visible')) { setTimeout(function () { initGetChartDemandas() }, 500); }
}
export function initGetChartDemandas(TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    if ($('.chartAtivPanelDiv').is(':visible')) {
        var selectChart = getOptionsPro('selectChartAtiv');
        var selectPrograma = $('#selectChartProgramasAtiv');
        var selectUnidadeID = selectPrograma.find('option:selected').data('id_unidade');
        selectUnidadeID = (typeof selectUnidadeID !== 'undefined' && selectUnidadeID !== null) ? selectUnidadeID : 0;
        var selectProgramaID = selectPrograma.val();
        selectProgramaID = (typeof selectProgramaID !== 'undefined' && selectProgramaID !== null) ? selectProgramaID : 0;
        var param = {
            id_user: (typeof selectChart !== 'undefined' && selectChart.id_user !== null && typeof selectChart.id_user !== 'undefined') ? selectChart.id_user : $('#selectChartUserAtiv').val(),
            id_unidade: (typeof selectChart !== 'undefined' && selectChart.id_unidade !== null && typeof selectChart.id_unidade !== 'undefined') ? selectChart.id_unidade : selectUnidadeID,
            id_programa: (typeof selectChart !== 'undefined' && selectChart.id_programa !== null && typeof selectChart.id_programa !== 'undefined') ? selectChart.id_programa : selectProgramaID
        };
        callAtiv('getChartDemandas',param);
    } else {
        setTimeout(function () {
            initGetChartDemandas(TimeOut - 100);
            if (typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage')) console.log('Reload initGetChartDemandas');
        }, 500);
    }
}
export function initToolbarFunc(this_, TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    if (typeof $().toolbar !== 'undefined') {
        setToolbarFunc(this_);
    } else {
        if (TimeOut == 9000) $.getScript((URL_SPRO + "js/lib/jquery.toolbar.min.js"));
        setTimeout(function () {
            initToolbarFunc(this_, TimeOut - 100);
            if (typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage')) console.log('Reload initToolbarFunc');
        }, 500);
    }
}
export function setToolbarFunc(this_) {
    var _this = $(this_);

    if ($('#toolbar_atividades').length == 0) {
        $('#atividadesProDiv').append(callAtiv('setToolbarAtiv',));
    }
    if (!_this.hasClass('toolbar_control')) {
        _this.addClass('toolbar_control');
        $('.toolbar_control').toolbar({
            content: '#toolbar_atividades',
            position: 'bottom',
            event: 'click',
            hideOnClick: true,
            adjustment: 5,
            style: 'menu'
        }).on('toolbarShown', function (event) {
            var id = $(event.currentTarget).data('index');
            var toolbar = $('.tool-container.tool-bottom.toolbar-menu.animate-standard:visible');
            setTimeout(function () {
                if (typeof id !== 'undefined' && id !== null && toolbar.length > 0) {
                    var value = jmespath.search(arrayAtividadesPro, "[?id_demanda==`" + id + "`] | [0]");
                    value = (value !== null) ? value : false;

                    toolbar.find('.tool-item').hide().each(function () {
                        var action = $(this).data('action');
                        var mode = $(this).data('mode');
                        var show = false;
                        if (callAtiv('checkPermissionAtiv',value)) {
                            if (!callAtiv('checkLimitAvaliacaoSubordinada',value) && mode.indexOf('rate_atividade') !== -1 && (action == 'none' || callAtiv('checkCapacidade',action)) && value.data_avaliacao == '0000-00-00 00:00:00' && value.data_entrega != '0000-00-00 00:00:00' && value.data_envio == '0000-00-00 00:00:00') { // rate_atividade
                                show = true;
                            } else if (!callAtiv('checkLimitAvaliacaoSubordinada',value) && mode.indexOf('complete_atividade') !== -1 && (action == 'none' || callAtiv('checkCapacidade',action)) && value.data_inicio != '0000-00-00 00:00:00' && value.data_entrega == '0000-00-00 00:00:00' && value.data_envio == '0000-00-00 00:00:00') { // complete_atividade
                                show = true;
                                if (mode.indexOf('pause_atividade') !== -1 && typeof value.data_retomada !== 'undefined' && value.data_retomada !== null && value.data_retomada == '0000-00-00 00:00:00') {
                                    show = false;
                                } else if (mode.indexOf('play_atividade') !== -1 && (typeof value.data_retomada === 'undefined' || value.data_retomada === null || value.data_retomada != '0000-00-00 00:00:00')) {
                                    show = false;
                                }
                            } else if (!callAtiv('checkLimitAvaliacaoSubordinada',value) && mode.indexOf('send_atividade') !== -1 && (action == 'none' || callAtiv('checkCapacidade',action)) && value.data_avaliacao != '0000-00-00 00:00:00' && value.data_envio == '0000-00-00 00:00:00') { // send_atividade
                                show = true;
                            } else if (!callAtiv('checkLimitAvaliacaoSubordinada',value) && mode.indexOf('start_atividade') !== -1 && (action == 'none' || callAtiv('checkCapacidade',action)) && value.data_inicio == '0000-00-00 00:00:00' && value.data_envio == '0000-00-00 00:00:00' && value.data_avaliacao == '0000-00-00 00:00:00') { // start_atividade
                                show = true;
                            } else if (mode.indexOf('delete_atividade') !== -1 && callAtiv('checkCapacidade',action + '_all')) { // delete_atividade_all
                                show = true;
                            } else if (!callAtiv('checkLimitAvaliacaoSubordinada',value) && mode.indexOf('archive_atividade') !== -1 && (action == 'none' || callAtiv('checkCapacidade',action)) && value.data_avaliacao != '0000-00-00 00:00:00' && value.data_envio != '0000-00-00 00:00:00') { // archive_atividade
                                show = true;
                            } else if (mode == 'none' && (value.data_envio == '0000-00-00 00:00:00' || action == 'history_atividade')) {
                                show = true;
                            } else if (!callAtiv('checkLimitAvaliacaoSubordinada',value) && action == 'rate_default_atividade' && moment(value.prazo_entrega, 'YYYY-MM-DD HH:mm:ss') < moment() && value.data_entrega == '0000-00-00 00:00:00' && value.data_avaliacao == '0000-00-00 00:00:00' && value.data_envio == '0000-00-00 00:00:00') {
                                show = true;
                            }
                            if (action == 'type_atividade' && value.tempo_pactuado != 0) {
                                show = false;
                            } else if (action == 'variation_atividade' && value.tempo_pactuado == 0) {
                                show = false;
                            }
                            // console.log(this, show, action, value, moment(value.prazo_entrega,'YYYY-MM-DD HH:mm:ss') < moment(), value.data_entrega == '0000-00-00 00:00:00', value.data_avaliacao == '0000-00-00 00:00:00', value.data_envio == '0000-00-00 00:00:00')
                        }
                        if (show) {
                            $(this).show();
                        }
                    });
                }
            }, 300);
        }).on('toolbarItemClick', function (event, triggerButton) {
            event.preventDefault();
            event.stopPropagation();
            var id = $(this).data('index');
            var action = $(triggerButton).data('action');
            var subaction = $(triggerButton).data('subaction');

            if (typeof id !== 'undefined' && id !== null) {
                var value = jmespath.search(arrayAtividadesPro, "[?id_demanda==`" + id + "`] | [0]");
                value = (value !== null) ? value : false;
                if (action == 'info_atividade') {
                    callParentAtividades('infoAtividade', value.id_demanda);
                } else if (action == 'history_atividade') {
                    callParentAtividades('historyAtividade', value.id_demanda);
                } else if (action == 'variation_atividade' || action == 'type_atividade') {
                    callParentAtividades('variationAtividade', value.id_demanda);
                } else if (action == 'start_cancel_atividade') {
                    callParentAtividades('startCancelAtividade', value.id_demanda);
                } else if (action == 'pause_atividade') {
                    callParentAtividades('pauseAtividade', value.id_demanda);
                } else if (action == 'edit_atividade') {
                    if (subaction == 'notify_atividade') {
                        callParentAtividades('notifyAtividade', value.id_demanda, event);
                    } else {
                        callParentAtividades('saveAtividade', value.id_demanda);
                    }
                } else if (action == 'delete_atividade' || action == 'delete_atividade_all') {
                    callParentAtividades('deleteAtividade_', value);
                } else if (action == 'extend_atividade') {
                    callParentAtividades('extendAtividade', value.id_demanda);
                } else if (action == 'complete_edit_atividade') {
                    callParentAtividades('completeAtividade', value.id_demanda);
                } else if (action == 'complete_cancel_atividade') {
                    callParentAtividades('completeCancelAtividade', value.id_demanda);
                } else if (action == 'rate_edit_atividade') {
                    callParentAtividades('rateAtividade', value.id_demanda);
                } else if (action == 'rate_default_atividade') {
                    callParentAtividades('rateAtividade', value.id_demanda, true);
                } else if (action == 'rate_cancel_atividade') {
                    callParentAtividades('rateCancelAtividade', value.id_demanda);
                } else if (action == 'send_cancel_atividade') {
                    callParentAtividades('sendCancelAtividade', value.id_demanda);
                }
            }
        }).on('toolbarHidden', function (event) {
            event.preventDefault();
            event.stopPropagation();
            // $('.tool-container.tool-bottom.toolbar-menu.animate-standard').remove();
            // $(event.currentTarget).removeClass('toolbar_control');
            // console.log(event.currentTarget);
        });
        _this.trigger('click');
    }
}
// INICIA FUNCOES DO PAINEL DE GESTAO DE ATIVIDADES
