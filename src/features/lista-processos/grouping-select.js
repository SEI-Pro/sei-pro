/**
 * Lista de processos — agrupamento, select-all, tags.
 * (ponte temporária: jQuery/DOM legado; fatia do antigo body.js)
 */
import * as templates from './templates.js';
import { listaAgrupamentoIO, readGroupOrderLegacy } from './io.js';

import {
    addAcompanhamentoEspIcon,
    applyHomeFilterFallback,
    getFilterTableHome,
    getPanelProc,
    initAddKanbanProc,
    initNewTabProcesso,
    initProcessoPaginacao,
    initViewEspecifacaoProcesso,
    restoreAssignmentFilterHome,
    selectAssignmentFilterHome,
    selectFilterTableHome,
    selectPanelKanbanHome,
    tableHomeDestroy
} from './modules.js';

//// Agrupamento de lista de processos

export function isGroupCollapsedLegacy(tagName) {
    var io = listaAgrupamentoIO();
    return io && typeof io.isGroupCollapsed === 'function' ? io.isGroupCollapsed(getOptionsPro, tagName) : getOptionsPro('panelGroup_'+tagName);
}
export function persistGroupCollapsedLegacy(tagName) {
    var io = listaAgrupamentoIO();
    if (io && typeof io.persistGroupCollapsed === 'function') return io.persistGroupCollapsed(setOptionsPro, tagName);
    setOptionsPro('panelGroup_'+tagName, true);
}
export function clearGroupCollapsedLegacy(tagName) {
    var io = listaAgrupamentoIO();
    if (io && typeof io.clearGroupCollapsed === 'function') return io.clearGroupCollapsed(removeOptionsPro, tagName);
    removeOptionsPro('panelGroup_'+tagName);
}
export function getGroupTableLabelFromLink(linkElem, acaoType) {
    var $link = $(linkElem);
    var href = $link.attr('href');
    if (typeof href === 'undefined' || href === '') {
        return false;
    }

    var title = '';
    if (acaoType == 'users') {
        title = $link.text().trim();
        if (!title && typeof getAtribuicaoDisplayLabel === 'function') {
            title = getAtribuicaoDisplayLabel($link.attr('title'), '', checkConfigValue('nomesusuarios'));
        }
    } else if (acaoType == 'checkpoints') {
        var checkpointTooltip = extractGroupTableTooltipToArray($link.attr('onmouseover'));
        title = (checkpointTooltip && typeof checkpointTooltip[0] !== 'undefined') ? checkpointTooltip[0] : '';
    } else if (acaoType == 'tags' || acaoType == 'types') {
        var typeTooltip = extractGroupTableTooltipToArray($link.attr('onmouseover'));
        title = (typeTooltip && typeof typeTooltip[1] !== 'undefined') ? typeTooltip[1] : '';
    } else if (acaoType == 'senddepart') {
        var dadosRecebido = getArrayProcessoRecebido(href);
        title = (dadosRecebido && typeof dadosRecebido.unidadesendfull !== 'undefined') ? dadosRecebido.unidadesendfull : '';
    } else if (acaoType == 'acompanhamentoesp') {
        var dadosAcomp = getArrayProcessoRecebido(href);
        title = (dadosAcomp && typeof dadosAcomp.acompanhamentoesp !== 'undefined') ? dadosAcomp.acompanhamentoesp : '';
    } else if (acaoType == 'deadline') {
        title = $link.closest('tr').find('td.seipro-prazo-box-display .dateboxDisplay').data('time-sorter');
        title = (typeof title !== 'undefined' && title !== null) ? String(title).trim() : '';
        if (title !== '' && typeof moment === 'function') {
            title = moment(title, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY HH:mm');
        }
    }

    return (typeof title !== 'undefined' && title !== null) ? String(title).trim() : '';
}
export function getProcessoLinkFromGroupRow(row) {
    return $(row).find('a[href*="acao=procedimento_trabalhar"], a[href*="controlador.php?acao=procedimento_trabalhar"]').first();
}
export function getListTypes(acaoType) {
    var orderbyTableGroup = readGroupOrderLegacy();
    var arrayTag = [''];
    if (acaoType == 'tags') {
    	var acaoType_ = 'acao=andamento_marcador_gerenciar';
	} else if (acaoType == 'types') {
		var acaoType_ = 'acao=procedimento_trabalhar';
    } else if (acaoType == 'users') {
		var acaoType_ = 'acao=procedimento_atribuicao_listar';
    } else if (acaoType == 'checkpoints') {
		var acaoType_ = 'acao=andamento_situacao_gerenciar';
    } else if (acaoType == 'arrivaldate' || acaoType == 'acessdate' || acaoType == 'senddate' || acaoType == 'senddepart' || acaoType == 'createdate' || acaoType == 'acompanhamentoesp' || acaoType == 'deadline') {
		var acaoType_ = 'acao=procedimento_trabalhar';
	}
    $('#divRecebidos').find('table tr').attr('data-tagname', 'SemGrupo');
    $('#divRecebidos').find('table a').each(function(index){
        var link = $(this).attr('href');
        if ( typeof link !== 'undefined' && link.indexOf(acaoType_) !== -1 ) {
            var tag = getGroupTableLabelFromLink(this, acaoType);
                if ( acaoType == 'arrivaldate' || acaoType == 'acessdate' || acaoType == 'senddate' || acaoType == 'createdate' || acaoType == 'deadline' ) {
                    var startDateNow = moment();
                    var startDateYesterday = moment().subtract(1, 'days');
                    var startDate1Yesterday = moment().subtract(2, 'days');
                    var startDateWeek = moment().startOf('isoWeek');
                    var endDateWeek = moment().endOf('isoWeek');
                    var startDateLastWeek = moment().subtract(1, 'weeks').startOf('isoWeek');
                    var endDateLastWeek = moment().subtract(1, 'weeks').endOf('isoWeek');
                    var startDate2LastWeek = moment().subtract(2, 'weeks').startOf('isoWeek');
                    var endDate2LastWeek = moment().subtract(2, 'weeks').endOf('isoWeek');
                    var startDate3LastWeek = moment().subtract(3, 'weeks').startOf('isoWeek');
                    var endDate3LastWeek = moment().subtract(3, 'weeks').endOf('isoWeek');
                    var startDate4LastWeek = moment().subtract(4, 'weeks').startOf('isoWeek');
                    var endDate4LastWeek = moment().subtract(4, 'weeks').endOf('isoWeek');
                    var startDate5LastWeek = moment().subtract(5, 'weeks').startOf('isoWeek');
                    var endDate5LastWeek = moment().subtract(5, 'weeks').endOf('isoWeek');
                    var startDateLastMonth = moment().subtract(1, 'months').startOf('month');
                    var endDateLastMonth = moment().subtract(1, 'months').endOf('month');
                    var startDate2LastMonth = moment().subtract(2, 'months').startOf('month');
                    var endDate2LastMonth = moment().subtract(2, 'months').endOf('month');
                    var startDate3LastMonth = moment().subtract(3, 'months').startOf('month');
                    var endDate3LastMonth = moment().subtract(3, 'months').endOf('month');
                    var startDateLastQuarter = moment().subtract(10, 'months').startOf('month');
                    var endDateLastQuarter = moment().subtract(4, 'months').endOf('month');
                    var startDateLastYear = moment().subtract(1, 'years');
                    var endDateLastYear = moment().subtract(11, 'months').endOf('month');

                    var startDateTomorrow = moment().add(1, 'day');
                    var startDate1Tomorrow = moment().add(2, 'day');
                    var startDateNextWeek = moment().add(1, 'week').startOf('isoWeek');
                    var endDateNextWeek = moment().add(1, 'week').endOf('isoWeek');
                    var startDate2NextWeek = moment().add(2, 'week').startOf('isoWeek');
                    var endDate2NextWeek = moment().add(2, 'week').endOf('isoWeek');
                    var startDate3NextWeek = moment().add(3, 'week').startOf('isoWeek');
                    var endDate3NextWeek = moment().add(3, 'week').endOf('isoWeek');
                    var startDate4NextWeek = moment().add(4, 'week').startOf('isoWeek');
                    var endDate4NextWeek = moment().add(4, 'week').endOf('isoWeek');
                    var startDate5NextWeek = moment().add(5, 'week').startOf('isoWeek');
                    var endDate5NextWeek = moment().add(5, 'week').endOf('isoWeek');
                    var startDateNextMonth = moment().add(1, 'month').startOf('month');
                    var endDateNextMonth = moment().add(1, 'month').endOf('month');
                    var startDate2NextMonth = moment().add(2, 'month').startOf('month');
                    var endDate2NextMonth = moment().add(2, 'month').endOf('month');
                    var startDate3NextMonth = moment().add(3, 'month').startOf('month');
                    var endDate3NextMonth = moment().add(3, 'month').endOf('month');
                    var startDateNextQuarter = moment().add(4, 'month').startOf('month');
                    var endDateNextQuarter = moment().add(6, 'month').endOf('month');
                    var startDateNextYear = moment().add(1, 'year');
                    var endDateNextYear = moment().add(11, 'month').endOf('month');
                    var dataRecebido =  (acaoType == 'arrivaldate') ? getArrayProcessoRecebido($(this).attr('href')).datahora : '';
                        dataRecebido =  (acaoType == 'acessdate') ? getArrayProcessoRecebido($(this).attr('href')).datetime : dataRecebido;
                        dataRecebido =  (acaoType == 'senddate') ? getArrayProcessoRecebido($(this).attr('href')).datesend : dataRecebido;
                        dataRecebido =  (acaoType == 'createdate') ? getArrayProcessoRecebido($(this).attr('href')).datageracao : dataRecebido;
                        dataRecebido =  (acaoType == 'deadline') ? $(this).closest('tr').find('td.seipro-prazo-box-display .dateboxDisplay').data('time-sorter') : dataRecebido;
                        dataRecebido = (typeof dataRecebido !== 'undefined' && dataRecebido != '') ? moment(dataRecebido,'YYYY-MM-DD HH:mm:ss') : '';
                        
                    if (dataRecebido != '' && dataRecebido.isBetween(startDateWeek, endDateWeek) ) { tag = (orderbyTableGroup == 'asc' ? 'l' : 'k')+'.Essa semana'; }
                    if (dataRecebido != '' && dataRecebido.isBetween(startDateLastWeek, endDateLastWeek) ) { tag = (orderbyTableGroup == 'asc' ? 'k' : 'r')+'.Semana passada'; }
                    if (dataRecebido != '' && dataRecebido.isBetween(startDate2LastWeek, endDate2LastWeek) ) { tag = (orderbyTableGroup == 'asc' ? 'j' : 's')+'.Duas semana atr\u00E1s'; }
                    if (dataRecebido != '' && dataRecebido.isBetween(startDate3LastWeek, endDate3LastWeek) ) { tag = (orderbyTableGroup == 'asc' ? 'i' : 't')+'.Tr\u00EAs semana atr\u00E1s'; }
                    if (dataRecebido != '' && dataRecebido.isBetween(startDate4LastWeek, endDate4LastWeek) ) { tag = (orderbyTableGroup == 'asc' ? 'h' : 'u')+'.Quatro semana atr\u00E1s'; }
                    if (dataRecebido != '' && dataRecebido.isBetween(startDate5LastWeek, endDate5LastWeek) ) { tag = (orderbyTableGroup == 'asc' ? 'g' : 'v')+'.Cinco semana atr\u00E1s'; }
                    if (dataRecebido != '' && dataRecebido.isBetween(startDateLastMonth, endDateLastMonth) ) { tag = (orderbyTableGroup == 'asc' ? 'f' : 'w')+'.Um m\u00EAs atr\u00E1s'; }
                    if (dataRecebido != '' && dataRecebido.isBetween(startDate2LastMonth, endDate2LastMonth) ) { tag = (orderbyTableGroup == 'asc' ? 'e' : 'x')+'.Dois meses atr\u00E1s'; }
                    if (dataRecebido != '' && dataRecebido.isBetween(startDate3LastMonth, endDate3LastMonth) ) { tag = (orderbyTableGroup == 'asc' ? 'd' : 'y')+'.Tr\u00EAs meses atr\u00E1s'; }
                    if (dataRecebido != '' && dataRecebido.isBetween(startDateLastQuarter, endDateLastQuarter) ) { tag = (orderbyTableGroup == 'asc' ? 'c' : 'za')+'.Seis meses atr\u00E1s'; }
                    if (dataRecebido != '' && dataRecebido.isBetween(startDateLastYear, endDateLastYear) ) { tag = (orderbyTableGroup == 'asc' ? 'b' : 'zb')+'.Um ano atr\u00E1s'; }
                    if (dataRecebido != '' && dataRecebido < endDateLastYear ) { tag = (orderbyTableGroup == 'asc' ? 'a' : 'zc')+'.Maior que um ano atr\u00E1s'; }

                    if (dataRecebido != '' && dataRecebido > endDateNextYear ) { tag = (orderbyTableGroup == 'asc' ? 'zc' : 'a')+'.Maior que um ano'; }
                    if (dataRecebido != '' && dataRecebido.isBetween(startDateNextYear, endDateNextYear) ) { tag = (orderbyTableGroup == 'asc' ? 'zb' : 'b')+'.Em um ano'; }
                    if (dataRecebido != '' && dataRecebido.isBetween(startDateNextQuarter, endDateNextQuarter) ) { tag = (orderbyTableGroup == 'asc' ? 'za' : 'c')+'.Em seis meses'; }
                    if (dataRecebido != '' && dataRecebido.isBetween(startDate3NextMonth, endDate3NextMonth) ) { tag = (orderbyTableGroup == 'asc' ? 'y' : 'd')+'.Em tr\u00EAs meses'; }
                    if (dataRecebido != '' && dataRecebido.isBetween(startDate2NextMonth, endDate2NextMonth) ) { tag = (orderbyTableGroup == 'asc' ? 'x' : 'e')+'.Em dois meses'; }
                    if (dataRecebido != '' && dataRecebido.isBetween(startDateNextMonth, endDateNextMonth) ) { tag = (orderbyTableGroup == 'asc' ? 'w' : 'f')+'.Em um m\u00EAs'; }
                    if (dataRecebido != '' && dataRecebido.isBetween(startDate5NextWeek, endDate5NextWeek) ) { tag = (orderbyTableGroup == 'asc' ? 'v' : 'g')+'.Em cinco semana'; }
                    if (dataRecebido != '' && dataRecebido.isBetween(startDate4NextWeek, endDate4NextWeek) ) { tag = (orderbyTableGroup == 'asc' ? 'u' : 'h')+'.Em quatro semana'; }
                    if (dataRecebido != '' && dataRecebido.isBetween(startDate3NextWeek, endDate3NextWeek) ) { tag = (orderbyTableGroup == 'asc' ? 't' : 'i')+'.Em tr\u00EAs semana'; }
                    if (dataRecebido != '' && dataRecebido.isBetween(startDate2NextWeek, endDate2NextWeek) ) { tag = (orderbyTableGroup == 'asc' ? 's' : 'j')+'.Em duas semana'; }
                    if (dataRecebido != '' && dataRecebido.isBetween(startDateNextWeek, endDateNextWeek) ) { tag = (orderbyTableGroup == 'asc' ? 'r' : 'k')+'.Semana quem vem'; }

                    if (dataRecebido != '' && dataRecebido.format('YYYY-MM-DD') == startDate1Tomorrow.format('YYYY-MM-DD') ) { tag = (orderbyTableGroup == 'asc' ? 'q' : 'l')+'.Depois de amanh\u00E3'; } 
                    if (dataRecebido != '' && dataRecebido.format('YYYY-MM-DD') == startDateTomorrow.format('YYYY-MM-DD') ) { tag = (orderbyTableGroup == 'asc' ? 'p' : 'm')+'.Amanh\u00E3'; } 
                    if (dataRecebido != '' && dataRecebido.format('YYYY-MM-DD') == startDateNow.format('YYYY-MM-DD') ) { tag = (orderbyTableGroup == 'asc' ? 'o' : 'n')+'.Hoje'; }
                    if (dataRecebido != '' && dataRecebido.format('YYYY-MM-DD') == startDateYesterday.format('YYYY-MM-DD') ) { tag = (orderbyTableGroup == 'asc' ? 'n' : 'o')+'.Ontem'; } 
                    if (dataRecebido != '' && dataRecebido.format('YYYY-MM-DD') == startDate1Yesterday.format('YYYY-MM-DD') ) { tag = (orderbyTableGroup == 'asc' ? 'm' : 'p')+'.Anteontem'; } 

                    /*
                    var datas = [
                        {startDateNow: moment(startDateNow).format('DD/MM/YYYY'), startDateYesterday: moment(startDateYesterday).format('DD/MM/YYYY'), startDate1Yesterday: moment(startDate1Yesterday).format('DD/MM/YYYY')},
                        {startDateWeek: moment(startDateWeek).format('DD/MM/YYYY'), endDateWeek: moment(endDateWeek).format('DD/MM/YYYY')},
                        {startDateLastWeek: moment(startDateLastWeek).format('DD/MM/YYYY'), endDateLastWeek: moment(endDateLastWeek).format('DD/MM/YYYY')},
                        {startDate2LastWeek: moment(startDate2LastWeek).format('DD/MM/YYYY'), endDate2LastWeek: moment(endDate2LastWeek).format('DD/MM/YYYY')},
                        {startDate3LastWeek: moment(startDate3LastWeek).format('DD/MM/YYYY'), endDate3LastWeek: moment(endDate3LastWeek).format('DD/MM/YYYY')},
                        {startDate4LastWeek: moment(startDate4LastWeek).format('DD/MM/YYYY'), endDate4LastWeek: moment(endDate4LastWeek).format('DD/MM/YYYY')},
                        {startDate5LastWeek: moment(startDate5LastWeek).format('DD/MM/YYYY'), endDate5LastWeek: moment(endDate5LastWeek).format('DD/MM/YYYY')},
                        {startDateLastMonth: moment(startDateLastMonth).format('DD/MM/YYYY'), endDateLastMonth: moment(endDateLastMonth).format('DD/MM/YYYY')},
                        {startDate2LastMonth: moment(startDate2LastMonth).format('DD/MM/YYYY'), endDate2LastMonth: moment(endDate2LastMonth).format('DD/MM/YYYY')},
                        {startDate3LastMonth: moment(startDate3LastMonth).format('DD/MM/YYYY'), endDate3LastMonth: moment(endDate3LastMonth).format('DD/MM/YYYY')},
                        {startDateLastQuarter: moment(startDateLastQuarter).format('DD/MM/YYYY'), endDateLastQuarter: moment(endDateLastQuarter).format('DD/MM/YYYY')},
                        {startDateLastYear: moment(startDateLastYear).format('DD/MM/YYYY'), endDateLastYear: moment(endDateLastYear).format('DD/MM/YYYY')}
                    ]
                    console.log(acaoType, $(this).text(), tag, {dataRecebido:dataRecebido.format('YYYY-MM-DD'), startDateNow:startDateNow.format('YYYY-MM-DD')}, dataRecebido.format('DD/MM/YYYY'), datas);
                    */
                }
            //console.log(tag, acaoType);
            var tag_ = (typeof tag !== 'undefined' && tag != '' ) ? removeAcentos(tag).replace(/\ /g, '') : 'SemGrupo';
            var tr_tag = $(this).closest('tr')
                tr_tag.attr('data-tagname', tag_);
                if (isGroupCollapsedLegacy(tag_))  tr_tag.hide();

            arrayTag.push(tag);
        }
    });
    return uniqPro(arrayTag).sort();
}
export function appendGerados(type) {
    var orderbyDesc = (readGroupOrderLegacy() == 'desc') ? true : false;
    $('#divGerados table tr').not('.tablesorter-filter-row').each(function(index){
        if ( $(this).find('th').length == 0 ) {
            var outerHTML = $('<div>').append($(this).clone().addClass('typeGerados')).html();
            $('#divRecebidos').find('table tbody').append(outerHTML);
        }
    });
    $('#divGerados').addClass('displayNone');
    $('#divRecebidos').addClass('tagintable');
    $('#divRecebidosAreaTabela').removeClass('tabelaPanelScroll').css({height: '', overflowY: ''});
    if($('#divRecebidosAreaTabela').find('.ui-resizable-handle.ui-resizable-s').length > 0 && typeof $('#divRecebidosAreaTabela').resizable !== 'undefined') {
        $('#divRecebidosAreaTabela').resizable().resizable('destroy');
    }
    
    var tbody = $('#divRecebidos tbody');
    tbody.find('tr').each(function() {
        var processoLink = getProcessoLinkFromGroupRow(this);
        var dataRecebido = (processoLink.length) ? getArrayProcessoRecebido(processoLink.attr('href')) : '';
            dataRecebido = (dataRecebido != '' && type == 'arrivaldate') ? moment(dataRecebido.datahora, 'YYYY-MM-DD HH:mm:ss').unix() : dataRecebido;
            dataRecebido = (dataRecebido != '' && type == 'acessdate') ? moment(dataRecebido.datetime, 'YYYY-MM-DD HH:mm:ss').unix() : dataRecebido;
            dataRecebido = (dataRecebido != '' && type == 'createdate') ? moment(dataRecebido.datageracao, 'YYYY-MM-DD HH:mm:ss').unix() : dataRecebido;
            dataRecebido = (dataRecebido != '' && (type == 'senddate' || type == 'senddate')) ? moment(dataRecebido.datesend, 'YYYY-MM-DD HH:mm:ss').unix() : dataRecebido;
        if (dataRecebido != '' && !isNaN(dataRecebido)) { $(this).attr('data-order', dataRecebido) }
    }).sort(function(a, b) {
      var tda = $(a).data('order');
      var tdb = $(b).data('order');
      return (type == 'arrivaldate' || type == 'senddate' || type == 'senddepart' || type == 'createdate' || type == 'acompanhamentoesp') 
                ? tda > tdb 
                    ? (orderbyDesc ? 1 : -1) 
                    : tda < tdb 
                        ? (orderbyDesc ? -1 : 1) : 0 
                : tda > tdb 
                    ? (orderbyDesc ? -1 : 1) 
                    : tda < tdb 
                        ? (orderbyDesc ? 1 : -1) : 0;
    }).appendTo(tbody);
    if ($('#divRecebidosAreaPaginacaoInferior a').length == 0) { $('#divRecebidosAreaPaginacaoInferior').hide() }
}
export function removeDuplicateValue(element) {
    if ($(element).length) {
        $(element).val(uniqPro($(element).val().split(',')).join(','));
    }
}
export function setSelectAllTr(this_, tagname = false) {
    var limit = 100;
    var index = (typeof $(this_).data('index') !== 'undefined') ? $(this_).data('index') : 0;
    var tagname_select = (tagname) ? 'tr[data-tagname="'+tagname+'"]:visible' : 'tr:visible';
    var listCheckbox = [];
    if (index < 1) {
        var checkbox = $(this_).closest('table').find(tagname_select).find('input[type=checkbox]:not(.onoffswitch-checkbox)');
        var t = (checkbox.length > limit) ? Math.round(checkbox.length/limit) : true;
        
        if (t) {
            for (i = 0; i <= t; i++) {
                var init = i*limit;
                var end = (i+1)*limit;
                listCheckbox.push(checkbox.slice(init,end));
            }
        } else {
            checkbox.trigger('click');
        }
        $(this_).data('index',index+1);
    } else {
        var checkbox = $(this_).closest('table').find(tagname_select).find('input[type=checkbox]:not(.onoffswitch-checkbox):checked');
        var t = (checkbox.length > limit) ? Math.round(checkbox.length/limit) : false;
        
        if (t) {
            for (i = 0; i <= t; i++) {
                var init = i*limit;
                var end = (i+1)*limit;
                listCheckbox.push(checkbox.slice(init,end));
            }
        } else {
            checkbox.trigger('click');
        }
        $(this_).data('index',0);
    }
    updateTipSelectAll(this_);
    
    if (t) {
        listCheckbox.forEach(function(value, i) {
            setTimeout(function(){ 
                value.trigger('click');
            });
        });
    }
}
export function getSelectAllTr(this_, tagname) {
    if ($(this_).closest('table').find('tr[data-tagname="SemGrupo"]:visible input[type=checkbox]:checked').length > 0) {
        setSelectAllTr(this_, 'SemGrupo');
    } else {
        setSelectAllTr(this_, tagname);
    }
    removeDuplicateValue('#hdnRecebidosItensSelecionados');
    removeDuplicateValue('#hdnGeradosItensSelecionados');
}
export function updateTipSelectAll(this_) {
    var _this = $(this_);
    var data = _this.data();
    var table = _this.closest('table');
    var text = (table.find('input[type="checkbox"]:checked').length > 0) ? 'Inverter Sele\u00E7\u00E3o' : 'Selecionar Todos';
        text = (typeof data.index != 'undefined' && data.index == 1) ? 'Remover Sele\u00E7\u00E3o' : text;
    $(this_).attr('onmouseenter','return infraTooltipMostrar(\''+text+'\')');
    if (_this.is(':hover')) {
        if (typeof infraTooltipMostrar === 'function') infraTooltipMostrar(text);
    } else {
        if (typeof infraTooltipOcultar === 'function') infraTooltipOcultar();
    }
}
export function replaceSelectAll() {
    var tableProc = $('#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado');
    if ( tableProc.length > 0 ) {
        tableProc.find('#lnkInfraCheck').after('<a onclick="setSelectAllTr(this);" onmouseover="updateTipSelectAll(this)" onmouseenter="return infraTooltipMostrar(\'Selecionar Tudo\')" onmouseout="return infraTooltipOcultar();"><img src="/infra_css/'+(typeof isNewSEI !== 'undefined' && SeiPro.sei.adapter.isNewSEI() ? 'svg/check.svg': 'imagens/check.gif')+'" class="infraImg"></a>').remove();
    }
}
export function cleanConfigDataRecebimento() {
    var storeRecebimento = ( typeof localStorageRestorePro('configDataRecebimentoPro') !== 'undefined' && !$.isEmptyObject(localStorageRestorePro('configDataRecebimentoPro')) ) ? localStorageRestorePro('configDataRecebimentoPro') : [];
    var array_procedimentos = [];
    $('#frmProcedimentoControlar').find('a.processoVisualizado').each(function(i) {
      array_procedimentos.push(String(getParamsUrlPro($(this).attr('href')).id_procedimento));
    });
    uniqPro(array_procedimentos);
    for (i = 0; i < storeRecebimento.length; i++) {
        if( $.inArray(String(storeRecebimento[i]['id_procedimento']), array_procedimentos, 0) == -1 && moment().diff(moment(storeRecebimento[i]['datetime'], 'YYYY-MM-DD HH:mm:ss'), 'days') > 30) {
            // console.log('notinclude', i, storeRecebimento[i]['id_procedimento'], storeRecebimento[i]['processo']);
            storeRecebimento.splice(i,1);
            i--;
        }
    }
    localStorageStorePro('configDataRecebimentoPro', storeRecebimento);
}
export function removeAllTags(forceFilter = false, n) {
    $('#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado').find('.especifProc').remove();
	$('#divRecebidos table tbody').find('.tagintable').remove();
	$('#divRecebidos table tbody tr').each(function(index){ 
	    if ( $(this).hasClass('typeGerados') ) { 
	        $(this).remove();
	     } else {
	        $(this).show(); 
	    }
	});
	$('#divRecebidosAreaTabela').removeClass('tabelaPanelScroll');
    if($('#divRecebidosAreaTabela').find('.ui-resizable-handle.ui-resizable-s').length > 0 && typeof $('#divRecebidosAreaTabela').resizable !== 'undefined') { $('#divRecebidosAreaTabela').resizable().resizable('destroy') }
	$('#divRecebidos').removeClass('tagintable').find('caption').show();
	$('#divRecebidos .newRowControle').remove();
	$('#divGerados').removeClass('displayNone');
	$('#divRecebidos thead').show();
    $('table tr.tablesorter-headerRow').show();
    $('#orderbyTableGroup').remove();
    if (SeiPro.sei.adapter.isNewSEI()) $('#divTabelaProcesso').removeClass('displayInitial');

    $('#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado')
        .trigger('filterReset')
        .trigger('update')
        .find('.filterTableProcessos').removeClass('newLink_active');
    applyHomeFilterFallback('', 'clean');
    if (!forceFilter) {
        sessionStorageRemovePro('setFiltersTableHome');
    }
    initControlePrazo();
    initViewEspecifacaoProcesso();
    addAcompanhamentoEspIcon();
    tableHomeDestroy(true);
    // console.log('### removeAllTags', n, checkLoadedTableSorter(), storeGroupTablePro(), forceFilter, sessionStorageRestorePro('setFiltersTableHome'));
    if (forceFilter && sessionStorageRestorePro('setFiltersTableHome')) {
        setTimeout(function(){ 
            var storedFiltersHome = sessionStorageRestorePro('setFiltersTableHome');
            if ($.isArray(storedFiltersHome)) {
                $.each(tableHomePro, function(i){
                    $.tablesorter.setFilters( tableHomePro[i][0], storedFiltersHome, true );
                    tableHomePro[i].trigger('update');
                });
            } else if (storedFiltersHome && typeof storedFiltersHome.value !== 'undefined' && typeof storedFiltersHome.type !== 'undefined') {
                var filterHome = $('#filterTableHome');
                if (filterHome.length > 0) {
                    filterHome.val(storedFiltersHome.value);
                    getFilterTableHome(filterHome[0]);
                }
            }
        }, 1000);
    }
}

export function getUniqueTableTag(i, tagName, type) {
	var tagName_ = getTagName(tagName, type);
    var txtTagName = ( (type == 'arrivaldate' || type == 'acessdate' || type == 'senddate' || type == 'createdate' || type == 'deadline') && tagName.indexOf('.') !== -1 ) ? tagName.split('.')[1] : tagName;
	var tbRecebidos = $('#divRecebidos table');
	var countTd = tbRecebidos.find('tr:not(.tablesorter-headerRow)').eq(1).find('td').length;
	var iconSelect = '<span class="lblInfraCheck" aria-hidden="true"></span><a id="lnkInfraCheck" onclick="getSelectAllTr(this, \''+tagName_+'\');" onmouseover="updateTipSelectAll(this)" onmouseenter="return infraTooltipMostrar(\'Selecionar Tudo\')" onmouseout="return infraTooltipOcultar();"><img src="/infra_css/'+(SeiPro.sei.adapter.isNewSEI() ? 'svg/check.svg': 'imagens/check.gif')+'" id="imgRecebidosCheck" class="infraImg"></a></th>';
	var tagCount = $('#divRecebidos table tbody').find('tr[data-tagname="'+tagName_+'"]:visible').length;
    var collapseBtn =   '<span class="tagintable">'+
                        '   <a class="controleTableTag newLink" data-htagname="'+tagName_+'" onclick="toggleGroupTablePro(this)" data-action="show" onmouseover="return infraTooltipMostrar(\'Mostrar Agrupamento\');" onmouseout="return infraTooltipOcultar();" style="font-size: 11pt;'+(getOptionsPro('panelGroup_'+tagName_) ? '' : 'display:none;' )+'">'+
                        '       <i class="fas fa-plus-square cinzaColor"></i>'+
                        '   </a>'+
                        '   <a class="controleTableTag newLink" data-htagname="'+tagName_+'" onclick="toggleGroupTablePro(this)" data-action="hide" onmouseover="return infraTooltipMostrar(\'Recolher Agrupamento\');" onmouseout="return infraTooltipOcultar();" style="font-size: 11pt;'+(getOptionsPro('panelGroup_'+tagName_) ? 'display:none;' : '' )+'">'+
                        '       <i class="fas fa-minus-square cinzaColor"></i>'+
                        '   </a>'+
                        '</span>';
	var htmlBody = '<tr class="infraCaption tagintable"><td colspan="'+(countTd+3)+'"><span '+actionTest+'>'+tagCount+' registros:</span></td></tr>'
					+'<tr data-htagname="'+tagName_+'" class="tagintable tableHeader">'
					+'<th class="tituloControle '+(SeiPro.sei.adapter.isNewSEI() ? 'infraTh' : '')+'" width="5%" align="center">'+iconSelect+'</th>'
					+'<th class="tituloControle '+(SeiPro.sei.adapter.isNewSEI() ? 'infraTh' : '')+'" colspan="'+(countTd+2)+'">'+txtTagName+collapseBtn+'</th>'
					+'</tr>';
		$(htmlBody).appendTo('#divRecebidos table tbody');
		if ( i == 0 ) { 
            // tbRecebidos.find('tr').eq(0).hide(); 
            tbRecebidos.find('caption').hide(); 
        }
}
export function getTableOnTag(type) {
    $('#divRecebidos table tbody tr').each(function(index){
        var processoLink = getProcessoLinkFromGroupRow(this);
    	var dataTag = $(this).attr('data-tagname');
    		dataTag = ( dataTag == '' ) ? 'SemGrupo' : dataTag;
    	if ( typeof dataTag !== 'undefined' && processoLink.length > 0 ) {
            var descAttr = processoLink.attr('onmouseover');
            var desc = (typeof descAttr !== 'undefined' && descAttr !== '') ? extractGroupTableTooltipToArray(descAttr) : false;
            var txt_desc = (desc && typeof desc[0] !== 'undefined') ? desc[0] : '';
            var txt_tipo_proc = (desc && typeof desc[1] !== 'undefined') ? desc[1] : '';
            var editDesc = '<a class="newLink newLink_active followLink followLinkDesc content_btnsave" onclick="editFieldProc(this)" style="right: 0;top: 0;" onmouseover="return infraTooltipMostrar(\'Editar descri\u00E7\u00E3o\');" onmouseout="return infraTooltipOcultar();"><i class="fas fa-edit" style="font-size: 100%;"></i></a>';        
    		var htmlDesc = (type == 'all')
                ? '<td class="tagintable" data-old="'+txt_desc+'"><span class="info">'+txt_desc+'</span>'+editDesc+'</td>'
                : '<td class="tagintable" data-old="'+txt_desc+'"><span class="info">'+txt_desc+'</span>'+editDesc+'</td><td class="tagintable">'+txt_tipo_proc+'</td>';
            var dataRecebido = getArrayProcessoRecebido(processoLink.attr('href'));
            var textBoxDesc =   (type == 'arrivaldate' || type == 'acessdate') 
                                ? dataRecebido.descricao+' em: '+moment(dataRecebido.datahora, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY HH:mm')+'<br>'
                                : (dataRecebido.datesend != '') ? dataRecebido.descricaosend+' em: '+moment(dataRecebido.datesend, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY HH:mm')+'<br>' : '';
                textBoxDesc =   (type == 'createdate') ? dataRecebido.descricaodatageracao+' em: '+moment(dataRecebido.datageracao, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY HH:mm')+'<br>' : textBoxDesc;
            var textBox = textBoxDesc+'\u00DAltimo acesso em: '+moment(dataRecebido.datetime, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY HH:mm');
            var textDataRecebido = (dataRecebido != '' && type == 'acessdate') ? moment(dataRecebido.datetime, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY HH:mm') : '';
                textDataRecebido = (dataRecebido != '' && type == 'arrivaldate') ? moment(dataRecebido.datahora, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY') : textDataRecebido;
                textDataRecebido = (dataRecebido != '' && type == 'createdate') ? moment(dataRecebido.datageracao, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY') : textDataRecebido;
                textDataRecebido = (dataRecebido != '' && (type == 'senddate' || type == 'senddepart' || type == 'acompanhamentoesp') && dataRecebido.datesend != '') ? moment(dataRecebido.datesend, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY') : textDataRecebido;
            var htmlDataRecebido = (dataRecebido != '') ? '<td class="tagintable"><span onmouseout="return infraTooltipOcultar();" onmouseover="return infraTooltipMostrar(\''+textBox+'\')">'+textDataRecebido+'</span></td>' : '<td class="tagintable"></td>';
                htmlDataRecebido = (type == 'all') ? '' : htmlDataRecebido;
    			$(this).find('td').eq(3).after(htmlDesc+htmlDataRecebido);
    		var cloneTr = $(this).clone();
    		$('#divRecebidos table tbody').find('tr[data-htagname="'+dataTag+'"]').after(cloneTr);
    		$(this).remove(); 
    	}
    });
    var tbody = $('#divRecebidos table tbody');
    var nrSemGrupo = tbody.find('tr[data-tagname="SemGrupo"]:visible').length;
    if (nrSemGrupo == 0) { 
        tbody.find('tr.infraCaption.tagintable').eq(0).remove();
        tbody.find('tr[data-htagname="SemGrupo"]').remove();
    } else {
        var textRegistros = (nrSemGrupo == 1) ? nrSemGrupo+' registro:' : nrSemGrupo+' registros:' ;
        tbody.find('tr.infraCaption.tagintable').eq(0).find('td').html('<span '+actionTest+'>'+textRegistros+'</span>');
        tbody.find('tr[data-tagname="SemGrupo"]:not(.infraTrClara)').eq(0).hide();
    }
    if (type == 'all') {
        var newColumns =    '<th class="tituloControle newRowControle '+(SeiPro.sei.adapter.isNewSEI() ? 'infraTh' : '')+'" style="text-align: center;">Especifica\u00E7\u00E3o</th>'+
                            // '<th class="tituloControle newRowControle" style="text-align: center;">Tipo</th>'+
                            (checkConfigValue('gerenciarprazos') ? '<th class="tituloControle newRowControle '+(SeiPro.sei.adapter.isNewSEI() ? 'infraTh' : '')+'" style="text-align: center;">Prazos</th>' : '');
        var titleCaption = $('#tblProcessosRecebidos').find('tbody').find('.tableHeader, .infraCaption').text();
            titleCaption = (titleCaption !== '') ? ' <span class="newRowControle">(Agrupados: '+titleCaption+')</span>' : '';
        $('#tblProcessosRecebidos').find('caption.infraCaption').show().append(titleCaption);
        $('#tblProcessosRecebidos').find('thead').show().find('.tablesorter-headerRow').append(newColumns);
        $('#tblProcessosRecebidos').find('tbody').find('.tableHeader, .infraCaption').remove();
        $('#tblProcessosRecebidos').find('thead').find('.seipro-prazo-box-display').remove();
        tableHomeDestroy(true);
    }
    if (type != '' && type != 'all') {
        var orderbyTableGroup = readGroupOrderLegacy();
        $('#processoToCSV').after('<a class="newLink" data-order="'+orderbyTableGroup+'" onclick="orderbyTableGroup(this)" id="orderbyTableGroup" onmouseover="return infraTooltipMostrar(\'Classificar dados pela ordem '+(orderbyTableGroup == 'asc' ? 'decrescente' : 'crescente')+'\');" onmouseout="return infraTooltipOcultar();" style="margin: 0;font-size: 10pt;float: right;"><i class="fas fa-sort-numeric-'+(orderbyTableGroup == 'asc' ? 'up' : 'down')+' cinzaColor"></i></a>');
    }
    if (SeiPro.sei.adapter.isNewSEI() && type != '') {
        $('#divTabelaProcesso').addClass('displayInitial');
    } else if (SeiPro.sei.adapter.isNewSEI()) {
        $('#divTabelaProcesso').removeClass('displayInitial');
    }
}
export function orderbyTableGroup(this_) {
    var _this = $(this_);
    var data = _this.data();
    var setOrder = data.order == 'asc' ? 'desc' : 'asc';
        setOptionsPro('orderbyTableGroup',setOrder);
        _this.attr('data-order',setOrder);
        _this.find('i').attr('class','fas fa-sort-numeric-'+data.order == 'asc' ? 'down' : 'up');
        if (typeof infraTooltipOcultar === 'function') infraTooltipOcultar();
        updateGroupTable($('#selectGroupTablePro'));
}
export function getArrayProcessoRecebido(href) {
    var io = listaAgrupamentoIO();
    if (io && typeof io.readReceivedProcess === 'function') {
        return io.readReceivedProcess(localStorageRestorePro, getParamsUrlPro, jmespath, href);
    }
    var storeRecebimento = (typeof localStorageRestorePro !== 'undefined' && typeof localStorageRestorePro('configDataRecebimentoPro') !== 'undefined' && !$.isEmptyObject(localStorageRestorePro('configDataRecebimentoPro')) ) ? localStorageRestorePro('configDataRecebimentoPro') : [];
    var id_procedimento = (typeof getParamsUrlPro !== 'undefined') ? String(getParamsUrlPro(href).id_procedimento) : false;
    var dadosRecebido = (typeof jmespath !== 'undefined' && jmespath.search(storeRecebimento, "[?id_procedimento=='"+id_procedimento+"'] | length(@)") > 0) ? jmespath.search(storeRecebimento, "[?id_procedimento=='"+id_procedimento+"'] | [0]") : '';
    return dadosRecebido;
}
export function updateGroupTablePro(valueSelect, mode) {
    //var unidade = $('#selInfraUnidades').find('option:selected').text().trim();
    var io = listaAgrupamentoIO();
    var selectGroup = io && typeof io.readSelectedGroup === 'function' ? io.readSelectedGroup(localStorageRestorePro) : localStorageRestorePro('selectGroupTablePro');
    if ($.isArray(selectGroup) && selectGroup.length > 0) {
        if (jmespath.search(selectGroup, "[?unidade=='"+siglaUnidadeAtual+"'].unidade | length(@)") > 0) {
            for (i = 0; i < selectGroup.length; i++) {
                if(selectGroup[i]['unidade'] == siglaUnidadeAtual) {
                    //console.log('unidade', i, selectGroup[i], unidade, mode);
                    if (mode == 'remove') {
                        selectGroup.splice(i,1);
                        i--;
                    } else {
                        selectGroup[i]['selected'] = valueSelect;
                    }
                }
            }
        } else if (valueSelect != '') {
            selectGroup.push({unidade: siglaUnidadeAtual, selected: valueSelect});
        }
        localStorageStorePro('selectGroupTablePro', selectGroup);
        // console.log('selectGroup',selectGroup);
    } else {
        if (mode == 'remove') {
            localStorageRemovePro('selectGroupTablePro');
        } else {
            localStorageStorePro('selectGroupTablePro', [{unidade: siglaUnidadeAtual, selected: valueSelect}]);
            // console.log('selectGroup',[{unidade: unidade, selected: valueSelect}]);
            // console.log('NOT',{unidade: unidade, selected: valueSelect});
        }
    }
}
export function storeGroupTablePro() {
    if (typeof localStorageRestorePro !== "undefined" && localStorageRestorePro('selectGroupTablePro') != null) {
        //var unidade = $('#selInfraUnidades').find('option:selected').text().trim();
        var io = listaAgrupamentoIO();
    var selectGroup = io && typeof io.readSelectedGroup === 'function' ? io.readSelectedGroup(localStorageRestorePro) : localStorageRestorePro('selectGroupTablePro');
        if ($.isArray(selectGroup) && typeof jmespath !== 'undefined' && jmespath.search(selectGroup, "[?unidade=='"+siglaUnidadeAtual+"'].unidade | [0]") == siglaUnidadeAtual ) {
            return jmespath.search(selectGroup, "[?unidade=='"+siglaUnidadeAtual+"'].selected | [0]");
        } else if (!$.isArray(selectGroup)) {
            localStorageStorePro('selectGroupTablePro', [{unidade: siglaUnidadeAtual, selected: selectGroup}]);
            // console.log('selectGroupTablePro', [{unidade: unidade, selected: selectGroup}]);
            return selectGroup;
        }
    } else {
        return false;
    }
}
export function insertGroupTable(TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    if (
        typeof window.__SEI_PRO_CONFIG_READY__ === 'boolean' &&
        !window.__SEI_PRO_CONFIG_READY__
    ) {
        setTimeout(function(){ 
            insertGroupTable(TimeOut - 100); 
            if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage'))console.log('Reload insertGroupTable => config'); 
        }, 500);
        return;
    }
    if (typeof checkConfigValue === 'undefined' || typeof verifyConfigValue === 'undefined') {
        setTimeout(function(){ 
            insertGroupTable(TimeOut - 100); 
            if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage'))console.log('Reload insertGroupTable => helpers'); 
        }, 500);
        return;
    }
    var enableGroupTable = checkConfigValue('agruparlista');
    var enablePaginationRemoval = verifyConfigValue('removepaginacao');
    var enableAssignmentFilter = checkConfigValue('filtroporatribuicao');

    if (!enableGroupTable && !enablePaginationRemoval && !enableAssignmentFilter) {
        hideProcessoPaginacaoSuperior();
        return;
    }

    if ($('#tblProcessosDetalhado').length == 0 && $('#newFiltro').length == 0) {
        var htmlControl = '<div id="newFiltro">';

        if (enableGroupTable || enablePaginationRemoval) {
            htmlControl += selectFilterTableHome(!enableAssignmentFilter);
        }

        if (enableAssignmentFilter) {
            htmlControl += selectAssignmentFilterHome();
        }

        if (enableGroupTable) { 
            var statusTableTags =           ( storeGroupTablePro() == 'tags' ) ? 'selected' : '';
            var statusTableTypes =          ( storeGroupTablePro() == 'types' ) ? 'selected' : '';
            var statusTableUsers =          ( storeGroupTablePro() == 'users' ) ? 'selected' : '';
            var statusTableCheckpoints =    ( storeGroupTablePro() == 'checkpoints' ) ? 'selected' : '';
            var statusTableArrivaldate =    ( storeGroupTablePro() == 'arrivaldate' ) ? 'selected' : '';
            var statusTableSenddate =       ( storeGroupTablePro() == 'senddate' ) ? 'selected' : '';
            var statusTableDeadline =       ( storeGroupTablePro() == 'deadline' ) ? 'selected' : '';
            var statusTableAcessdate =      ( storeGroupTablePro() == 'acessdate' ) ? 'selected' : '';
            var statusTableDepartSend =     ( storeGroupTablePro() == 'senddepart' ) ? 'selected' : '';
            var statusTableCreatedate =     ( storeGroupTablePro() == 'createdate' ) ? 'selected' : '';
            var statusTableAcompEsp =       ( storeGroupTablePro() == 'acompanhamentoesp' ) ? 'selected' : '';
            var statusTableAll =            ( storeGroupTablePro() == 'all' ) ? 'selected' : '';
            var panelKanbanHome = selectPanelKanbanHome();

            htmlControl += '   <select id="selectGroupTablePro" class="groupTable selectPro" onchange="updateGroupTable(this)" data-placeholder="Agrupar processos...">'+
                           '     <option value="">&nbsp;</option>'+
                           '     <option value="">Sem agrupamento</option>'+
                           '     <option value="all" '+statusTableAll+'>Agrupar processos recebidos/gerados</option>'+
                           '     <option value="deadline" '+statusTableDeadline+'>Agrupar processos por prazo</option>'+
                           '     <option value="createdate" '+statusTableCreatedate+'>Agrupar processos por data de autua\u00E7\u00E3o</option>'+
                           '     <option value="arrivaldate" '+statusTableArrivaldate+'>Agrupar processos por data de recebimento</option>'+
                           '     <option value="senddate" '+statusTableSenddate+'>Agrupar processos por data de envio</option>'+
                           '     <option value="acessdate" '+statusTableAcessdate+'>Agrupar processos por data do \u00FAltimo acesso</option>'+
                           '     <option value="tags" '+statusTableTags+'>Agrupar processos por marcadores</option>'+
                           '     <option value="types" '+statusTableTypes+'>Agrupar processos por tipo</option>'+
                           '     <option value="users" '+statusTableUsers+'>Agrupar processos por respons\u00E1vel</option>'+
                           '     <option value="checkpoints" '+statusTableCheckpoints+'>Agrupar processos por ponto de controle</option>'+
                           '     <option value="senddepart" '+statusTableDepartSend+'>Agrupar processos por unidade de envio</option>'+
                           '     <option value="acompanhamentoesp" '+statusTableAcompEsp+'>Agrupar processos por acompanhamento especial</option>'+
                           '  </select>'+
                           '  '+panelKanbanHome+
                           '  '+templates.csvExportLinkHtml();
        }

        htmlControl += '</div>';
        $('#divFiltro').after(htmlControl).css({
            'width': 'auto',
            'display': 'inline-flex',
            'vertical-align': 'top'
        });
        if ($('#divFiltroLinhaPro').length == 0) {
            $('#divFiltro, #newFiltro').wrapAll('<div id="divFiltroLinhaPro" class="collapseTabelaProcesso"></div>');
        }

        if ($('#idSelectTipoBloco').length != 0 ) { 
            $("#idSelectTipoBloco").appendTo("#newFiltro");
            $("#idSelectBloco").appendTo("#newFiltro");
        }
    }

    if ($('#newFiltro').length > 0 && enableAssignmentFilter && $('#filterAssignmentTableHome').length == 0) {
        $('#newFiltro').prepend(selectAssignmentFilterHome());
    }

    setTimeout(function(){ 
        if (enableGroupTable && $('#selectGroupTablePro').length > 0) {
            updateGroupTable($('#selectGroupTablePro'));
        } else if (enablePaginationRemoval) {
            initProcessoPaginacao($('#selectGroupTablePro'));
        }

        if (enableAssignmentFilter && $('#filterAssignmentTableHome').length > 0) {
            restoreAssignmentFilterHome();
        }

        if (verifyConfigValue('substituiselecao') && $('#newFiltro .selectPro').length > 0) {
            initChosenFilterHome();
        }
    }, 500);
}
export function initChosenFilterHome(TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    if (typeof $().chosen !== 'undefined') { 
        setTimeout(() => {
            $('#newFiltro .selectPro').chosen({
                placeholder_text_single: ' ',
                no_results_text: 'Nenhum resultado encontrado',
                normalize_search_text: function(text) {
                    return removeAcentos(text.toLowerCase());
                }
            });
            forcePlaceHoldChosen();
        }, 2000);
    } else {
        if (typeof $().chosen === 'undefined' && typeof URL_SPRO !== 'undefined' && TimeOut == 9000) { 
            $.getScript(URL_SPRO+"js/lib/chosen.jquery.min.js");
        }
        setTimeout(function(){ 
            initChosenFilterHome(TimeOut - 100); 
            if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage'))console.log('Reload initChosenFilterHome'); 
        }, 500);
    }
}
export function removeCacheGroupTable(this_) {
    localStorageRemovePro('configDataRecebimentoPro');
    console.log('localStorageRemovePro');
    $(this_).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
    console.log('Remove configDataRecebimentoPro');
    //$('#selectGroupTablePro').val('');
    //updateGroupTable($('#selectGroupTablePro'));
}
export function hideProcessoPaginacaoSuperior() {
    if (typeof verifyConfigValue !== 'function') { return; }
    $('body').toggleClass('seiProHideProcessoPaginacaoSuperior', !!verifyConfigValue('ocultarpaginacaosuperior'));
}
export function bindProcessoPaginacaoSuperiorVisibility() {
    hideProcessoPaginacaoSuperior();
}
if (typeof window !== 'undefined') {
    if (window.__SEI_PRO_CONFIG_READY__) {
        bindProcessoPaginacaoSuperiorVisibility();
    } else {
        window.addEventListener('sei-pro-config-ready', bindProcessoPaginacaoSuperiorVisibility, { once: true });
    }
}
export function updateGroupTable(this_) {
    hideProcessoPaginacaoSuperior();
    if (typeof checkConfigValue !== 'undefined' && verifyConfigValue('removepaginacao')) {
        initProcessoPaginacao(this_);
    } else {
        initUpdateGroupTable(this_);
    }
    if (typeof checkConfigValue === 'function' && checkConfigValue('filtroporatribuicao')) {
        setTimeout(function(){
            restoreAssignmentFilterHome();
        }, 1200);
    }
}
export function initUpdateGroupTable(this_) {
    hideProcessoPaginacaoSuperior();
    if (typeof checkConfigValue !== 'undefined' && checkConfigValue('agruparlista')) {
        var valueSelect = $(this_).val();
        initTableTag(valueSelect);

        if (!valueSelect || valueSelect == 'all' || valueSelect == '') {
            setOptionsPro('panelProcessosView', 'Tabela');
            setTimeout(function(){
                // Chamada direta no mundo isolado — não usar .trigger('click') em
                // botão com handler legado (avaliaria onclick no MAIN).
                var btnTabela = document.querySelector('#processosProActions .btn[data-value="Tabela"]');
                if (btnTabela) getPanelProc(btnTabela);
            }, 500);
        } 

        if (getOptionsPro('panelProcessosView') == 'Quadro') {
            initAddKanbanProc(valueSelect);
            updateGroupTablePro(valueSelect, 'insert');
        } else {
            if ( typeof valueSelect !== 'undefined' && valueSelect != '' ) { 
                $('#filterTableHome').val('').trigger('chosen:updated');
                updateGroupTablePro(valueSelect, 'insert');
                if (valueSelect == 'arrivaldate' || valueSelect == 'acessdate' || valueSelect == 'senddate' || valueSelect == 'senddepart' || valueSelect == 'createdate' || valueSelect == 'acompanhamentoesp') { 
                    statusPesquisaDadosProcedimentos = true;
                    getDadosProcedimentosControlar();
                } else if (statusPesquisaDadosProcedimentos) {
                    breakDadosProcedimentosControlar();
                }
            } else if ( typeof valueSelect !== 'undefined' ) { 
                if ( typeof localStorageRemovePro !== "undefined" ) { 
                    updateGroupTablePro(valueSelect, 'remove'); 
                    if (statusPesquisaDadosProcedimentos) {
                        breakDadosProcedimentosControlar();
                    }
                }
            }
        }
    }
}
export function getTableTag(type) {
    var listTags = getListTypes(type);
    $.each(listTags, function (i, val) {
        getUniqueTableTag(i, val, type);
    });
}
export function initTableTag(type = '') {
    cleanConfigDataRecebimento();
	removeAllTags(false, 1);
	if ( type != '' ) {
        $('#divRecebidos thead').hide();
		appendGerados(type);
		getTableTag(type);
		getTableOnTag(type);
	}
    setTimeout(function(){
        initNewTabProcesso();
        forcePlaceHoldChosen();
        urgenteProMoveOnTop();
        checkboxRangerSelectShift();
        if (type != '' && type != 'all' && $('#tblProcessosRecebidos tbody a.urgentePro[href*="controlador.php?acao=procedimento_trabalhar"]').length > 0) {
            $('#tblProcessosRecebidos tr.tagintable[data-htagname="(URGENTE)"]').remove();
            $('#tblProcessosRecebidos tr.urgentePro').show().attr('data-tagname','(URGENTE)');
            var colspan = $('#tblProcessosRecebidos tr:not(.tableHeader)').eq(1).find('td').length;
                colspan = (typeof colspan !== 'undefined' && colspan > 0) ? colspan+2 : 7;
            var htmlHeadUrgente =   '<tr data-htagname="(URGENTE)" class="tagintable tableHeader">'+
                                    '   <th class="tituloControle '+(SeiPro.sei.adapter.isNewSEI() ? 'infraTh' : '')+'" width="5%" align="center">'+
	                                    '       <span class="lblInfraCheck" aria-hidden="true"></span>'+
                                    '       <a id="lnkInfraCheck" onclick="getSelectAllTr(this, \'(URGENTE)\');" onmouseover="updateTipSelectAll(this)" onmouseenter="return infraTooltipMostrar(\'Selecionar Tudo\')" onmouseout="return infraTooltipOcultar();">'+
                                    '           <img src="/infra_css/'+(SeiPro.sei.adapter.isNewSEI() ? 'svg/check.svg': 'imagens/check.gif')+'" id="imgRecebidosCheck" class="infraImg">'+
                                    '       </a>'+
                                    '   </th>'+
                                    '   <th class="tituloControle '+(SeiPro.sei.adapter.isNewSEI() ? 'infraTh' : '')+'" colspan="'+colspan+'">(URGENTE)</th>'+
                                    '</tr>';
            $("#tblProcessosRecebidos tbody").prepend(htmlHeadUrgente);
        }
    }, 1000);
}
export function urgenteProMoveOnTop() {
    $("#tblProcessosRecebidos tbody").prepend($('#tblProcessosRecebidos tbody a.urgentePro[href*="controlador.php?acao=procedimento_trabalhar"]').closest('tr'));
    $("#tblProcessosGerados tbody").prepend($('#tblProcessosGerados tbody a.urgentePro[href*="controlador.php?acao=procedimento_trabalhar"]').closest('tr'));
    $("#tblProcessosDetalhado tbody").prepend($('#tblProcessosDetalhado tbody a.urgentePro[href*="controlador.php?acao=procedimento_trabalhar"]').closest('tr'));
}
export function checkLoadedTableSorter() {
    return typeof tableHomePro !== 'undefined' && typeof tableHomePro[0] !== 'undefined' && typeof tableHomePro[0].data('tablesorter') !== 'undefined' && typeof tableHomePro[0].data('tablesorter').$filters !== 'undefined';
}
