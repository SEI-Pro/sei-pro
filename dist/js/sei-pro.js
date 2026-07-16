var actionTest = 'ondblclick="removeCacheGroupTable(this)"';
var totalSecondsTest = 0;
var totalSecondsTestText = '';
var timerTest;
var tableHomePro = [];
var kanbanProcessos = false;
var kanbanProcessosMoving = false;
var containerUpload = 'body';
var arvoreDropzone = false;
var contentW = false;
var pathArvore = typeof isNewSEI !== 'undefined' && SeiPro.sei.adapter.isNewSEI() ? '/infra_js/arvore/24/' : '/infra_js/arvore/';
var elemCheckbox = typeof isNewSEI !== 'undefined' && SeiPro.sei.adapter.isNewSEI() ? '.infraCheckboxInput' : '.infraCheckbox';
const objProcessosUnidadePro = typeof getProcessoUnidadePro !== 'undefined' ? getProcessoUnidadePro(false, true) : false;
const arrayProcessosUnidadePro = typeof getProcessoUnidadePro !== 'undefined' ? getProcessoUnidadePro() : false;

function setTimeTest() {
    ++totalSecondsTest;
    var hours = Math.floor((totalSecondsTest % (60 * 60 * 24)) / (3600));
    var minutes = Math.floor((totalSecondsTest % (60 * 60)) / 60);
    var seconds = Math.floor(totalSecondsTest % 60);
    totalSecondsTestText = pad(hours,2)+':'+pad(minutes,2)+':'+pad(seconds,2);
}
// On load, called to load the auth2 library and API client library.
function handleClientLoadPro(TimeOut = 3000) {
    if (TimeOut <= 0) { return; }
    if ((typeof spreadsheetIdProjetos_Pro !== 'undefined' || typeof spreadsheetIdFormularios_Pro !== 'undefined' || typeof spreadsheetIdSyncProcessos_Pro !== 'undefined') && typeof gapi !== 'undefined' && typeof initClientPro !== 'undefined') { 
        gapi.load('client:auth2', initClientPro);
    } else if (
            (typeof spreadsheetIdProjetos_Pro !== 'undefined' && spreadsheetIdProjetos_Pro === false) || 
            (typeof spreadsheetIdFormularios_Pro !== 'undefined' && spreadsheetIdFormularios_Pro === false) ||
            (typeof spreadsheetIdSyncProcessos_Pro !== 'undefined' && spreadsheetIdSyncProcessos_Pro === false)
        ) {
        console.log('notConfig handleClientLoadPro'); 
        return;
    } else {
        setTimeout(function(){
            handleClientLoadPro(TimeOut - 100); 
            if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage'))console.log('Reload handleClientLoadPro'); 
        }, 500);
    }
}

//// Agrupamento de lista de processos
function extractGroupTableTooltipToArray(elem) {
    if (typeof elem === 'undefined' || elem === null || elem === '') {
        return false;
    }

    elem = $("<div>").html(elem).text();
    elem = elem.replace(/<[^>]*>?/gm, '');
    elem = elem.replace('return infraTooltipMostrar(', '').replace(');', '').replace(/["']/g, '"');

    var array = (elem != '' && isJson('['+elem+']')) ? JSON.parse('['+elem+']') : [];
    return (array.length > 0) ? array : false;
}
function getGroupTableLabelFromLink(linkElem, acaoType) {
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
function getProcessoLinkFromGroupRow(row) {
    return $(row).find('a[href*="acao=procedimento_trabalhar"], a[href*="controlador.php?acao=procedimento_trabalhar"]').first();
}
function getListTypes(acaoType) {
    var orderbyTableGroup = getOptionsPro('orderbyTableGroup') ? getOptionsPro('orderbyTableGroup') : 'asc';
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
                if (getOptionsPro('panelGroup_'+tag_))  tr_tag.hide();

            arrayTag.push(tag);
        }
    });
    return uniqPro(arrayTag).sort();
}
function appendGerados(type) {
    var orderbyDesc = (getOptionsPro('orderbyTableGroup') == 'desc') ? true : false;
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
function removeDuplicateValue(element) {
    if ($(element).length) {
        $(element).val(uniqPro($(element).val().split(',')).join(','));
    }
}
function setSelectAllTr(this_, tagname = false) {
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
function getSelectAllTr(this_, tagname) {
    if ($(this_).closest('table').find('tr[data-tagname="SemGrupo"]:visible input[type=checkbox]:checked').length > 0) {
        setSelectAllTr(this_, 'SemGrupo');
    } else {
        setSelectAllTr(this_, tagname);
    }
    removeDuplicateValue('#hdnRecebidosItensSelecionados');
    removeDuplicateValue('#hdnGeradosItensSelecionados');
}
function updateTipSelectAll(this_) {
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
function replaceSelectAll() {
    var tableProc = $('#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado');
    if ( tableProc.length > 0 ) {
        tableProc.find('#lnkInfraCheck').after('<a onclick="setSelectAllTr(this);" onmouseover="updateTipSelectAll(this)" onmouseenter="return infraTooltipMostrar(\'Selecionar Tudo\')" onmouseout="return infraTooltipOcultar();"><img src="/infra_css/'+(typeof isNewSEI !== 'undefined' && SeiPro.sei.adapter.isNewSEI() ? 'svg/check.svg': 'imagens/check.gif')+'" class="infraImg"></a>').remove();
    }
}
function cleanConfigDataRecebimento() {
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
function removeAllTags(forceFilter = false, n) {
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
function getTagName(tagName, type) {
	var tagName_ = (typeof tagName !== 'undefined' && tagName != '' ) ? removeAcentos(tagName).replace(/\ /g, '') : 'SemGrupo' ;
		tagName = (typeof tagName === 'undefined' || tagName == '' ) ? ' ' : tagName;
        tagName = ( (type == 'arrivaldate' || type == 'acessdate' || type == 'senddate' || type == 'createdate' || type == 'deadline') && tagName.indexOf('.') !== -1 ) ? tagName.split('.')[1] : tagName;
        tagName = ( type == 'tags' && tagName.indexOf('#') !== -1 ) ? tagName.replace(extractHexColor(tagName),'') : tagName;
    return tagName_;
}
function getUniqueTableTag(i, tagName, type) {
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
function toggleGroupTablePro(this_) {
    var _this = $(this_);
    var data = _this.data();
    if (data.action == 'hide') {
        _this.closest('table').find('tr[data-tagname="'+data.htagname+'"]').hide();
        _this.closest('span').find('a[data-action="show"]').show();
        _this.closest('span').find('a[data-action="hide"]').hide();
        setOptionsPro('panelGroup_'+data.htagname, true);
    } else {
        _this.closest('table').find('tr[data-tagname="'+data.htagname+'"]').show();
        _this.closest('span').find('a[data-action="show"]').hide();
        _this.closest('span').find('a[data-action="hide"]').show();
        removeOptionsPro('panelGroup_'+data.htagname);
    }
}
function getTableOnTag(type) {
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
        var orderbyTableGroup = getOptionsPro('orderbyTableGroup') ? getOptionsPro('orderbyTableGroup') : 'asc';
        $('#processoToCSV').after('<a class="newLink" data-order="'+orderbyTableGroup+'" onclick="orderbyTableGroup(this)" id="orderbyTableGroup" onmouseover="return infraTooltipMostrar(\'Classificar dados pela ordem '+(orderbyTableGroup == 'asc' ? 'decrescente' : 'crescente')+'\');" onmouseout="return infraTooltipOcultar();" style="margin: 0;font-size: 10pt;float: right;"><i class="fas fa-sort-numeric-'+(orderbyTableGroup == 'asc' ? 'up' : 'down')+' cinzaColor"></i></a>');
    }
    if (SeiPro.sei.adapter.isNewSEI() && type != '') {
        $('#divTabelaProcesso').addClass('displayInitial');
    } else if (SeiPro.sei.adapter.isNewSEI()) {
        $('#divTabelaProcesso').removeClass('displayInitial');
    }
}
function orderbyTableGroup(this_) {
    var _this = $(this_);
    var data = _this.data();
    var setOrder = data.order == 'asc' ? 'desc' : 'asc';
        setOptionsPro('orderbyTableGroup',setOrder);
        _this.attr('data-order',setOrder);
        _this.find('i').attr('class','fas fa-sort-numeric-'+data.order == 'asc' ? 'down' : 'up');
        if (typeof infraTooltipOcultar === 'function') infraTooltipOcultar();
        updateGroupTable($('#selectGroupTablePro'));
}
function getArrayProcessoRecebido(href) {
    var storeRecebimento = (typeof localStorageRestorePro !== 'undefined' && typeof localStorageRestorePro('configDataRecebimentoPro') !== 'undefined' && !$.isEmptyObject(localStorageRestorePro('configDataRecebimentoPro')) ) ? localStorageRestorePro('configDataRecebimentoPro') : [];
    var id_procedimento = (typeof getParamsUrlPro !== 'undefined') ? String(getParamsUrlPro(href).id_procedimento) : false;
    var dadosRecebido = (typeof jmespath !== 'undefined' && jmespath.search(storeRecebimento, "[?id_procedimento=='"+id_procedimento+"'] | length(@)") > 0) ? jmespath.search(storeRecebimento, "[?id_procedimento=='"+id_procedimento+"'] | [0]") : '';
    return dadosRecebido;
}
function updateGroupTablePro(valueSelect, mode) {
    //var unidade = $('#selInfraUnidades').find('option:selected').text().trim();
    var selectGroup = localStorageRestorePro('selectGroupTablePro');
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
function storeGroupTablePro() {
    if (typeof localStorageRestorePro !== "undefined" && localStorageRestorePro('selectGroupTablePro') != null) {
        //var unidade = $('#selInfraUnidades').find('option:selected').text().trim();
        var selectGroup = localStorageRestorePro('selectGroupTablePro');
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
function insertGroupTable(TimeOut = 9000) {
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
                           '  <a class="newLink" onclick="getTableProcessosCSV()" id="processoToCSV" onmouseover="return infraTooltipMostrar(\'Exportar informa\u00E7\u00F5es de processos em planilha CSV\');" onmouseout="return infraTooltipOcultar();" style="margin: 0;font-size: 10pt;float: right;"><i class="fas fa-file-download cinzaColor"></i></a>';
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
function initChosenFilterHome(TimeOut = 9000) {
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
function removeCacheGroupTable(this_) {
    localStorageRemovePro('configDataRecebimentoPro');
    console.log('localStorageRemovePro');
    $(this_).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
    console.log('Remove configDataRecebimentoPro');
    //$('#selectGroupTablePro').val('');
    //updateGroupTable($('#selectGroupTablePro'));
}
function hideProcessoPaginacaoSuperior() {
    if (typeof verifyConfigValue !== 'function') { return; }
    $('body').toggleClass('seiProHideProcessoPaginacaoSuperior', !!verifyConfigValue('ocultarpaginacaosuperior'));
}
function bindProcessoPaginacaoSuperiorVisibility() {
    hideProcessoPaginacaoSuperior();
}
if (typeof window !== 'undefined') {
    if (window.__SEI_PRO_CONFIG_READY__) {
        bindProcessoPaginacaoSuperiorVisibility();
    } else {
        window.addEventListener('sei-pro-config-ready', bindProcessoPaginacaoSuperiorVisibility, { once: true });
    }
}
function updateGroupTable(this_) {
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
function initUpdateGroupTable(this_) {
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
function getTableTag(type) {
    var listTags = getListTypes(type);
    $.each(listTags, function (i, val) {
        getUniqueTableTag(i, val, type);
    });
}
function initTableTag(type = '') {
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
function urgenteProMoveOnTop() {
    $("#tblProcessosRecebidos tbody").prepend($('#tblProcessosRecebidos tbody a.urgentePro[href*="controlador.php?acao=procedimento_trabalhar"]').closest('tr'));
    $("#tblProcessosGerados tbody").prepend($('#tblProcessosGerados tbody a.urgentePro[href*="controlador.php?acao=procedimento_trabalhar"]').closest('tr'));
    $("#tblProcessosDetalhado tbody").prepend($('#tblProcessosDetalhado tbody a.urgentePro[href*="controlador.php?acao=procedimento_trabalhar"]').closest('tr'));
}
function checkLoadedTableSorter() {
    return typeof tableHomePro !== 'undefined' && typeof tableHomePro[0] !== 'undefined' && typeof tableHomePro[0].data('tablesorter') !== 'undefined' && typeof tableHomePro[0].data('tablesorter').$filters !== 'undefined';
}
function normalizeHomeFilterText(value) {
    return String(value || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9 ]/gi, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .toLowerCase();
}
function normalizeHomeFilterKey(value) {
    return String(value || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]/gi, '')
        .toLowerCase();
}
function updateHomeFilterCaption(table, filteredRows) {
    var caption = table.find('caption.infraCaption').eq(0);
    if (caption.length === 0) {
        return;
    }

    var baseCaption = caption.data('seiProCaptionBase');
    if (typeof baseCaption === 'undefined' || baseCaption === null || baseCaption === '') {
        baseCaption = caption.text();
        caption.data('seiProCaptionBase', baseCaption);
    }

    var visibleRows = (typeof filteredRows === 'number' && !isNaN(filteredRows))
        ? filteredRows
        : table.find('tbody tr').filter(function(){
            var row = $(this);
            return row.is(':visible') &&
                !row.hasClass('tableHeader') &&
                !row.hasClass('tagintable') &&
                !row.hasClass('infraCaption') &&
                row.find('a[href*="acao=procedimento_trabalhar"]').length > 0;
        }).length;
    var singular = (visibleRows === 1) ? 'registro' : 'registros';
    var updatedCaption = String(baseCaption).replace(/\(\s*\d+\s+registros?\s*\)/i, '('+visibleRows+' '+singular+')');

    if (updatedCaption === baseCaption) {
        updatedCaption = String(baseCaption).replace(/\d+/, visibleRows);
    }

    caption.text(updatedCaption);
}
function syncHomeProcessCaption() {
    updateHomeFilterCaption($('#tblProcessosRecebidos'));
    updateHomeFilterCaption($('#tblProcessosGerados'));
}
function updateVisibleHeadersForHomeFilter(table) {
    var currentHeader = null;
    var hasVisibleRows = false;

    table.find('tbody tr').each(function(){
        var row = $(this);
        if (row.hasClass('tableHeader') || row.hasClass('tagintable') || row.hasClass('infraCaption')) {
            if (currentHeader !== null) {
                currentHeader.toggle(hasVisibleRows);
            }
            currentHeader = row;
            hasVisibleRows = false;
            return;
        }

        if (!row.hasClass('seiProHomeFilterHidden')) {
            hasVisibleRows = true;
        }
    });

    if (currentHeader !== null) {
        currentHeader.toggle(hasVisibleRows);
    }
}
function getHomeRowTagValue(row) {
    var tagName = row.attr('data-tagname');
    if (typeof tagName !== 'undefined' && tagName !== null && tagName !== '') {
        return String(tagName);
    }

    var markerLink = row.find('a[href*="acao=andamento_marcador_gerenciar"]').first();
    if (markerLink.length > 0) {
        var markerTooltip = extractGroupTableTooltipToArray(markerLink.attr('onmouseover'));
        var markerName = (markerTooltip && typeof markerTooltip[1] !== 'undefined' && markerTooltip[1] !== '') ? markerTooltip[1] : '';
        if (markerName === '') {
            var ariaLabel = markerLink.attr('aria-label');
            if (typeof ariaLabel !== 'undefined' && ariaLabel !== '') {
                markerName = ariaLabel.split('/').pop().trim();
            } else {
                markerName = markerLink.text().trim();
            }
        }
        if (markerName !== '') {
            return String(markerName);
        }
    }

    return 'SemGrupo';
}
function rowMatchesHomeFilter(row, value, dataType) {
    var normalizedValue = normalizeHomeFilterText(value);

    if (dataType == 'user') {
        return normalizeHomeFilterText(getProcessoAtribuicaoValue(row)) === normalizedValue;
    }

    if (dataType == 'tag') {
        var tagName = getHomeRowTagValue(row);
        if (value === 'null') {
            return tagName === 'SemGrupo' || row.find('a[href*="acao=andamento_marcador_gerenciar"]').length === 0;
        }
        return normalizeHomeFilterKey(tagName) === normalizeHomeFilterKey(value);
    }

    if (dataType == 'proc') {
        if (normalizedValue === 'nao visualizado') {
            return row.find('a.processoNaoVisualizado, a.processoNaoVisualizadoSigiloso').length > 0;
        }
        var processLink = row.find('a[href*="controlador.php?acao=procedimento_trabalhar"]').first();
        var processText = processLink.text() || '';
        var tooltip = extractTooltipToArray(processLink.attr('onmouseover'));
        var tooltipText = (tooltip && tooltip.length > 0) ? tooltip.join(' ') : '';
        var rowText = normalizeHomeFilterText(processText + ' ' + tooltipText + ' ' + row.text());
        return rowText.indexOf(normalizedValue) !== -1;
    }

    return true;
}
function applyHomeFilterFallback(value, dataType) {
    var tables = $('#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado');
    var normalizedType = String(dataType || 'clean');
    var normalizedValue = String(value || '');

    tables.each(function(){
        var table = $(this);
        table.find('tbody tr').each(function(){
            var row = $(this);
            if (row.hasClass('tableHeader') || row.hasClass('tagintable') || row.hasClass('infraCaption')) {
                row.removeClass('seiProHomeFilterHidden');
                return;
            }

            var show = (normalizedType === 'clean' || normalizedValue === 'all') ? true : rowMatchesHomeFilter(row, normalizedValue, normalizedType);
            row.toggle(show);
            row.toggleClass('seiProHomeFilterHidden', !show);
        });

        updateVisibleHeadersForHomeFilter(table);
        updateHomeFilterCaption(table);
    });
}
function getFilterTableHome(this_) {
    var _this = $(this_);
    var value = _this.val() || '';
    var data = _this.find('option:selected').data() || {};
    var filters = [];
    var tagFilterSelected = data.type == 'tag';
    var hasTablesorterHome = checkLoadedTableSorter() && tableHomePro.length > 0;
    var clearFilters = ['', '', '', '', ''];

    if ($('#selectGroupTablePro').val() != '') {
        $('#selectGroupTablePro').val('').trigger('change').trigger('chosen:updated');
    }

    if (value === 'all' || data.type === 'clean') {
        applyHomeFilterFallback('', 'clean');
        $.each(tableHomePro, function(i){
            if (tableHomePro[i] && typeof tableHomePro[i].trigger === 'function') {
                tableHomePro[i].trigger('filterReset').trigger('update');
            }
        });
        sessionStorageRemovePro('setFiltersTableHome');
        if (verifyConfigValue('substituiselecao')) {
            forcePlaceHoldChosen();
            _this.trigger('chosen:updated');
        }
        return;
    }

    if (data.type == 'user') {
        filters[3] = (value == '' ? '""' : '('+value+')');
    } else if (data.type == 'proc') {
        filters[2] = (value == '' ? '""' : extractOnlyAlphaNum(removeAcentos(value)));
    } else if (data.type == 'tag') {
        filters[1] = (value == 'null') ? '!Marcador?' : (value == '' ? '' : 'Marcador? '+extractOnlyAlphaNum(removeAcentos(value)));
    }

    if (tagFilterSelected && hasTablesorterHome) {
        setTimeout(function() {
            $.each(tableHomePro, function(i){
                $.tablesorter.setFilters(tableHomePro[i][0], clearFilters, true);
                tableHomePro[i].trigger('update');
            });
            applyHomeFilterFallback(value, data.type);
            sessionStorageStorePro('setFiltersTableHome', {value: value, type: data.type});
        }, 100);
    } else {
        applyHomeFilterFallback(value, data.type);

        if (hasTablesorterHome && filters.length > 0) {
            setTimeout(function() {
                $.each(tableHomePro, function(i){
                    $.tablesorter.setFilters(tableHomePro[i][0], filters, true);
                });
                sessionStorageStorePro('setFiltersTableHome', filters);
            });
        } else {
            sessionStorageStorePro('setFiltersTableHome', {value: value, type: data.type});
        }
    }

    if (verifyConfigValue('substituiselecao')) {
        forcePlaceHoldChosen();
        _this.trigger('chosen:updated');
    }
}
function normalizeProcessoAtribuicaoText(link) {
    var target = $(link);
    var title = target.attr('title');
    if (typeof title !== 'undefined' && title !== '') {
        title = title.replace('Atribu\u00EDdo para', '').trim().split(/(\s).+\s/).join("");
        if (title) {
            return title;
        }
    }
    return target.text().trim();
}
function selectFilterTableHome(includeUserFilters = true) {
    var tableProc = $('#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado');
        tableProc.find('a[href*="acao=procedimento_atribuicao_listar"]').map(function(){ return normalizeProcessoAtribuicaoText(this) }).get();

    var users = tableProc.find('a[href*="acao=procedimento_atribuicao_listar"]').map(function(){ return normalizeProcessoAtribuicaoText(this) }).get();
        users = (typeof users !== 'undefined' && users !== null) ? uniqPro(users) : [];

    var tipos = tableProc.find('a[href*="acao=procedimento_trabalhar"]').map(function(){ 
            var tipoNomeProc = extractGroupTableTooltipToArray($(this).attr('onmouseover'));
                tipoNomeProc = (tipoNomeProc) ? tipoNomeProc[1] : false;
            if (tipoNomeProc) {
                return tipoNomeProc;
            }
        }).get();
        tipos = (typeof tipos !== 'undefined' && tipos !== null) ? uniqPro(tipos) : [];

    var marcadores = tableProc.find('a[href*="acao=andamento_marcador_gerenciar"]').map(function(){ 
            var tipoNomeTag = extractGroupTableTooltipToArray($(this).attr('onmouseover'));
                tipoNomeTag = (tipoNomeTag) ? tipoNomeTag[1] : false;
            if (tipoNomeTag) {
                return tipoNomeTag;
            }
        }).get();
        marcadores = (typeof marcadores !== 'undefined' && marcadores !== null) ? uniqPro(marcadores) : [];

    var html =  '<select id="filterTableHome" class="selectPro" style="width:250px;margin-right:20px !important;" onchange="getFilterTableHome(this)" data-placeholder="Filtrar processos...">'+
                '   <option value="" data-type="clean">&nbsp;</option>'+
                '   <option value="all" data-type="clean">Todos os processos</option>'+
                '   <option value="(N\u00E3o visualizado)" data-type="proc">Processos n\u00E3o visualizados</option>';

        if (includeUserFilters && users.length > 0) {
            html += '   <optgroup label="Por atribui\u00E7\u00E3o">'+
                    '       <option value="" data-type="user">Processos sem atribui\u00E7\u00E3o</option>';
            $.each(users, function(i, v){
                html += '       <option value="'+v+'" data-type="user">Atribu\u00EDdos \u00E0 '+v+'</option>';
            });
            html += '   </optgroup>';
        }

        if (tipos.length > 0) {
            html += '   <optgroup label="Por tipo de processo">';
            $.each(tipos, function(i, v){
                html += '       <option value="'+v+'" data-type="proc">'+v+'</option>';
            });
            html += '   </optgroup>';
        }

        if (marcadores.length > 0) {
            html += '   <optgroup label="Por marcadores">';
            html += '       <option value="null" data-type="tag">Sem marcador</option>';
            $.each(marcadores, function(i, v){
                html += '       <option value="'+v+'" data-type="tag">'+v+'</option>';
            });
            html += '   </optgroup>';
        }

        html += '</select>';
    return html;
}
function getAssignmentFilterOptionsHome() {
    var tableProc = $('#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado');
    var users = tableProc.find('a[href*="acao=procedimento_atribuicao_listar"]').map(function(){
        return normalizeProcessoAtribuicaoText(this);
    }).get();

    users = (typeof users !== 'undefined' && users !== null) ? uniqPro(users.filter(function(user){ return user !== ''; })) : [];

    return users;
}
function selectAssignmentFilterHome() {
    var users = getAssignmentFilterOptionsHome();
    var html =  '<select id="filterAssignmentTableHome" class="selectPro" style="width:250px;margin-right:20px !important;" onchange="getFilterAssignmentTableHome(this)" data-placeholder="Filtrar atribui\u00E7\u00E3o...">'+
                '   <option value="">&nbsp;</option>'+
                '   <option value="">Todos os processos</option>'+
                '   <option value="__unassigned__">Processos sem atribui\u00E7\u00E3o</option>';
    $.each(users, function(i, v){
        html += '   <option value="'+v+'">Atribu\u00EDdos \u00E0 '+v+'</option>';
    });
    html += '</select>';
    return html;
}
function getProcessoAtribuicaoValue(row) {
    var link = row.find('a[href*="acao=procedimento_atribuicao_listar"]').first();
    if (link.length === 0) {
        return '';
    }
    return normalizeProcessoAtribuicaoText(link);
}
function updateVisibleHeadersForAssignmentFilter(table) {
    var currentHeader = null;
    var hasVisibleRows = false;

    table.find('tbody tr').each(function(){
        var row = $(this);
        if (row.hasClass('tableHeader') || row.hasClass('tagintable')) {
            if (currentHeader !== null) {
                currentHeader.toggle(hasVisibleRows);
            }
            currentHeader = row;
            hasVisibleRows = false;
            return;
        }

        if (currentHeader !== null && row.is(':visible')) {
            hasVisibleRows = true;
        }
    });

    if (currentHeader !== null) {
        currentHeader.toggle(hasVisibleRows);
    }
}
function applyAssignmentFilterHomeFallback(value) {
    var filterValue = value || '';
    var tables = $('#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado');

    tables.each(function(){
        var table = $(this);
        table.find('tbody tr').not('.tableHeader').not('.tagintable').not('.infraCaption').each(function(){
            var row = $(this);
            var assignedTo = getProcessoAtribuicaoValue(row);
            var show = true;

            if (filterValue === '__unassigned__') {
                show = assignedTo === '';
            } else if (filterValue !== '') {
                show = assignedTo === filterValue;
            }

            row.toggle(show);
        });

        updateVisibleHeadersForAssignmentFilter(table);
    });
}
function getFilterAssignmentTableHome(this_) {
    var value = $(this_).val() || '';
    sessionStorageStorePro('filterAssignmentTableHome', value);

    if (typeof tableHomePro !== 'undefined' && tableHomePro.length > 0 && typeof $.tablesorter !== 'undefined') {
        $.each(tableHomePro, function(i){
            var tableElement = tableHomePro[i][0];
            var filters = $.tablesorter.storage(tableElement, 'tablesorter-filters') || [];
            filters[3] = value === '__unassigned__' ? '""' : (value !== '' ? '('+value+')' : '');
            $.tablesorter.setFilters(tableElement, filters, true);
        });
    } else {
        applyAssignmentFilterHomeFallback(value);
    }
}
function restoreAssignmentFilterHome() {
    var target = $('#filterAssignmentTableHome');
    if (target.length === 0) {
        return;
    }

    var savedValue = sessionStorageRestorePro('filterAssignmentTableHome');
    if (typeof savedValue === 'undefined' || savedValue === null) {
        savedValue = '';
    }

    target.val(savedValue);
    if (verifyConfigValue('substituiselecao')) {
        target.trigger('chosen:updated');
    }
    getFilterAssignmentTableHome(target);
}
// Feature "Filtrar a página pelo campo de pesquisa rápida" (config filtrarpaginapelapesquisarapida)
// migrada para src/features/quick-filter/ (bundle quick-filter-list.bundle.js, self-boot). — Fase 6.
function initDadosProcesso(TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    if (typeof getParamsUrlPro !== 'undefined' && typeof getDadosIframeProcessoPro === 'function') { 
        var id_procedimento = getParamsUrlPro(window.location.href).id_procedimento;
            id_procedimento = (typeof id_procedimento === 'undefined') ? getParamsUrlPro($('#ifrArvore').attr('src')).id_procedimento : id_procedimento;
            id_procedimento = (typeof id_procedimento === 'undefined') ? getParamsUrlPro(window.location.href).id_protocolo : id_procedimento;
        if (typeof id_procedimento !== 'undefined' && id_procedimento !== '') {
            getDadosIframeProcessoPro(id_procedimento, 'processo');
            return;
        } else {
            setTimeout(function(){ 
                initDadosProcesso(TimeOut - 100); 
                if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage'))console.log('Reload initDadosProcesso'); 
            }, 500);
        }
    }
}

// REMOVE PAGINACAO DA PAGINA
function getProcessosPaginacao(this_, index, tipo) {
    var form = $('#frmProcedimentoControlar');
    var href = form.attr('action');
    var param = {};
        form.find("input[type=hidden]").map(function () { 
            if ( $(this).attr('name') && $(this).attr('id').indexOf('hdn') !== -1) { 
                param[$(this).attr('name')] = $(this).val(); 
            }
        });
        param['hdn'+tipo+'PaginaAtual'] = index;

    $.ajax({ 
        method: 'POST',
        data: param,
        url: href
    }).done(function (html) {
        let $html = $(html);
        var tr = $html.find('#tblProcessos'+tipo+' tbody').find('tr.infraTrClara');
            if(tr.length > 0) {
                tr.each(function(index){
                    $(this).find('input.infraCheckbox').attr('disabled', true).closest('td').attr('onmouseout','return infraTooltipOcultar()').attr('onmouseover','return infraTooltipMostrar(\'Desative a op\u00E7\u00E3o "Remover pagina\u00E7\u00E3o de processos" nas configura\u00E7\u00F0es do '+NAMESPACE_SPRO+' para utilizar esta sele\u00E7\u00E3o\')');
                    $('#tblProcessos'+tipo).append($(this)[0].outerHTML);
                });
                var NroItens = $html.find('#hdn'+tipo+'NroItens').val();
                var NroItens_ = $('#hdn'+tipo+'NroItens');
                var totalItens = $('#tblProcessos'+tipo).find('tbody tr.infraTrClara').filter(function(){
                    return $(this).find('a[href*="acao=procedimento_trabalhar"]').length > 0;
                }).length;
                    NroItens_.val(totalItens);
                    $('#tblProcessos'+tipo).find('caption.infraCaption').html('<span '+actionTest+'>'+totalItens+' registros:</span>');
                var Itens = $html.find('#hdn'+tipo+'Itens').val();
                var Itens_ = $('#hdn'+tipo+'Itens');
                    //Itens_.val(Itens_.val()+','+Itens);
                var ItensHash = $html.find('#hdn'+tipo+'ItensHash').val();
                var ItensHash_ = $('#hdn'+tipo+'ItensHash');
                    //ItensHash_.val(ItensHash);
                getProcessosPaginacao(this_, index+1, tipo);
                if (checkConfigValue('gerenciarmonitorados')) appendStarOnProcess();
                initControlePrazo(true);
                initViewEspecifacaoProcesso();
                addAcompanhamentoEspIcon();
            } else {
                param['hdn'+tipo+'PaginaAtual'] = 0;
                $.ajax({  method: 'POST', data: param, url: href });
                initUpdateGroupTable(this_);
            }
    });
}
function checkProcessoPaginacao(this_, tipo) {
    var pgnAtual = $('#hdn'+tipo+'PaginaAtual');
    if ( parseInt(pgnAtual.val()) > 0) {
         pgnAtual.val(0);
         $('#frmProcedimentoControlar').submit();
    } else {
        getProcessosPaginacao(this_, 1, tipo);
        $('#div'+tipo+' .infraAreaPaginacao').find('a, select').hide();
    }
}
function initProcessoPaginacao(this_) {
    if ($('.infraAreaPaginacao a').is(':visible')) {
        if ($('#divRecebidosAreaPaginacaoSuperior a').is(':visible')) {
            checkProcessoPaginacao(this_, 'Recebidos');
        }
        if ($('#divGeradosAreaPaginacaoSuperior a').is(':visible')) {
            checkProcessoPaginacao(this_, 'Gerados');
        } 
    } else {
        initUpdateGroupTable(this_);
    }
}
/*
function observeHistoryBrowserPro() {
    (function(history){
        var pushState = history.pushState;
        history.pushState = function(state) {
            if (typeof history.onpushstate == "function") {
                history.onpushstate({state: state});
            }
            return pushState.apply(history, arguments);
        }
    })(window.history);
    
    window.onpopstate = history.onpushstate = function(e) {
        //iHistory++;
        var iframeArvore = $('#ifrArvore').contents();
        if (typeof e.state.id_procedimento !== 'undefined' && typeof e.state.id_documento !== 'undefined') {
            var id_procedimento = e.state.id_procedimento;
            var id_documento = e.state.id_documento;
            var linkDoc = '&id_procedimento='+id_procedimento+'&id_documento='+id_documento;
            var href = iframeArvore.find('a[href*="'+linkDoc+'"]');
            var hCurrent = jmespath.search(iHistoryArray, "[?link=='"+window.location.href+"'].id | [0]");
            if (!href.find('span').hasClass('infraArvoreNoSelecionado')) {
                href.trigger('click');
                $($ifrVisualizacao).attr('src', href.attr('href'));
                console.log(hCurrent, iHistoryCurrent, iHistoryArray, linkDoc, href.find('span').hasClass('infraArvoreNoSelecionado'), e.state);
                //history.forward();
                history.back(); 
                iHistoryCurrent = hCurrent;
            } else {
                console.log(hCurrent, iHistoryArray, linkDoc, href.find('span').hasClass('infraArvoreNoSelecionado'), e.state);
            }
        }
    };
}
*/
function initNewTabProcesso(TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    if (typeof verifyConfigValue !== 'undefined') { 
        getNewTabProcesso();
    } else {
        setTimeout(function(){ 
            initNewTabProcesso(TimeOut - 100); 
            if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage'))console.log('Reload initNewTabProcesso'); 
        }, 500);
    }
}
function getNewTabProcesso() {
    var iconLabel = localStorage.getItem('iconLabel');
    var iconBoxSlim = localStorage.getItem('seiSlim');
    var observerTableControle = new MutationObserver(function(mutations) {
        var _this = $(mutations[0].target);
        var _parent = _this.closest('table');
        if (_parent.find('tr.infraTrMarcada').length > 0) {
            $(`${divComandos}${infraBarraComandos}`).find('.iconPro_Observe').removeClass('botaoSEI_hide');
            removeDuplicateValue('#hdnRecebidosItensSelecionados');
            removeDuplicateValue('#hdnGeradosItensSelecionados');
        } else {
            $(`${divComandos}${infraBarraComandos}`).find('.iconPro_Observe').addClass('botaoSEI_hide');
        }
    });
    setTimeout(function(){ 
        $('#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado').find('tbody tr').each(function(){
            observerTableControle.observe(this, {
                    attributes: true
            });
        });
        htmlBtnAtiv = (parent.checkConfigValue('gerenciaratividades') && localStorage.getItem('configBasePro_atividades') !== null && typeof checkCapacidade !== 'undefined' && parent.checkCapacidade('save_atividade') && typeof __ !== 'undefined') 
        ?   '<a tabindex="451" class="botaoSEI botaoSEI_hide '+(iconLabel ? 'iconLabel' : '')+' iconBoxAtividade '+(iconBoxSlim ? 'iconBoxSlim' : '')+' iconPro_Observe iconAtividade_save" '+(iconLabel ? '' : 'onmouseout="return infraTooltipOcultar();" onmouseover="return infraTooltipMostrar(\''+__.Nova_Demanda+'\')"')+' onclick="parent.saveAtividade()" style="position: relative; margin-left: -3px;">'+
            '    <img class="infraCorBarraSistema" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" title="'+__.Nova_Demanda+'">'+
            '    <span class="botaoSEI_iconBox">'+
            '       <i class="fad fa-user-check" style="font-size: 17pt; color: #fff;"></i>'+
            '    </span>'+
            (iconLabel ?
            '    <span class="newIconTitle">'+__.Nova_Demanda+'</span>'+
            '' : '')+
            '</a>'
            : '';

        var htmlBtnTypes =  (checkConfigValue('gerenciarprazos')) ? 
                            '<a class="botaoSEI botaoSEI_hide '+(iconLabel ? 'iconLabel' : '')+' '+(iconBoxSlim ? 'iconBoxSlim' : '')+' iconPro_Observe iconPrazo_new" '+(iconLabel ? '' : 'onmouseout="return infraTooltipOcultar();" onmouseover="return infraTooltipMostrar(\'Alterar informa\u00E7\u00F5es do processso\')"')+' onclick="dialogChangeTypeProc()" style="position: relative; margin-left: -3px;">'+
                            '    <img class="infraCorBarraSistema" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" title="Alterar informa\u00E7\u00F5es do processso">'+
                            '    <span class="botaoSEI_iconBox">'+
                            '       <i class="fad fa-info-circle" style="font-size: 17pt; color: #fff;"></i>'+
                            '    </span>'+
                            (iconLabel ?
                            '    <span class="newIconTitle">Alterar informa\u00E7\u00F5es do processso</span>'+
                            '' : '')+
                            '</a>'
                            : '';

        var htmlBtnUpload =  (checkConfigValue('uploaddocsexternos')) ? 
                            '<a class="botaoSEI botaoSEI_hide '+(iconLabel ? 'iconLabel' : '')+' '+(iconBoxSlim ? 'iconBoxSlim' : '')+' iconPro_Observe iconUpload_new" '+(iconLabel ? '' : 'onmouseout="return infraTooltipOcultar();" onmouseover="return infraTooltipMostrar(\'Enviar documentos em processos\')"')+' onclick="initUploadFilesInProcess()" style="position: relative; margin-left: -3px;">'+
                            '    <img class="infraCorBarraSistema" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" title="Enviar documentos em processos">'+
                            '    <span class="botaoSEI_iconBox">'+
                            '       <i class="fad fa-file-upload" style="font-size: 17pt; color: #fff;"></i>'+
                            '    </span>'+
                            (iconLabel ?
                            '    <span class="newIconTitle">Enviar documentos em processos</span>'+
                            '' : '')+
                            '</a>'
                            : '';

        var htmlBtnPrazo =  (checkConfigValue('gerenciarprazos')) ? 
                            '<a class="botaoSEI botaoSEI_hide '+(iconLabel ? 'iconLabel' : '')+' '+(iconBoxSlim ? 'iconBoxSlim' : '')+' iconPro_Observe iconPrazo_new" '+(iconLabel ? '' : 'onmouseout="return infraTooltipOcultar();" onmouseover="return infraTooltipMostrar(\'Adicionar prazo\')"')+' data-seipro-add-prazo-all="1" style="position: relative; margin-left: -3px; cursor: pointer;">'+
                            '    <img class="infraCorBarraSistema" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" title="Adicionar prazo">'+
                            '    <span class="botaoSEI_iconBox">'+
                            '       <i class="fad fa-clock" style="font-size: 17pt; color: #fff;"></i>'+
                            '    </span>'+
                            (iconLabel ?
                            '    <span class="newIconTitle">Adicionar prazo</span>'+
                            '' : '')+
                            '</a>'
                            : '';

        var htmlBtnNaoLido =  (checkConfigValue('marcar_naolido')) ? 
                            '<a class="botaoSEI botaoSEI_hide '+(iconLabel ? 'iconLabel' : '')+' '+(iconBoxSlim ? 'iconBoxSlim' : '')+' iconPro_Observe iconNaoLido" '+(iconLabel ? '' : 'onmouseout="return infraTooltipOcultar();" onmouseover="return infraTooltipMostrar(\'Marcar como n\u00E3o visualizado\')"')+' data-act="nao-lido-marcar" style="position: relative; margin-left: -3px; cursor: pointer;">'+
                            '    <img class="infraCorBarraSistema" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" title="Marcar como n\u00E3o visualizado">'+
                            '    <span class="botaoSEI_iconBox">'+
                            '       <i class="fad fa-eye-slash" style="font-size: 17pt; color: #fff;"></i>'+
                            '    </span>'+
                            (iconLabel ?
                            '    <span class="newIconTitle">Marcar como n\u00E3o visualizado</span>'+
                            '' : '')+
                            '</a>'
                            : '';

        htmlBtn =   '<a tabindex="451" class="botaoSEI botaoSEI_hide '+(iconLabel ? 'iconLabel' : '')+' '+(iconBoxSlim ? 'iconBoxSlim' : '')+' iconPro_Observe iconPro_newtab" '+(iconLabel ? '' : 'onmouseout="return infraTooltipOcultar();" onmouseover="return infraTooltipMostrar(\'Abrir Processos em Nova Aba\')"')+' onclick="openListNewTab(this)" style="position: relative; margin-left: -3px;">'+
                    '    <img class="infraCorBarraSistema" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" title="Abrir Processos em Nova Aba">'+
                    '    <span class="botaoSEI_iconBox">'+
                    '       <i class="fad fa-external-link-alt" style="font-size: 17pt; color: #fff;"></i>'+
                    '    </span>'+
                    (iconLabel ?
                    '    <span class="newIconTitle">Abrir Processos em Nova Aba</span>'+
                    '' : '')+

                    '</a>'+htmlBtnAtiv+htmlBtnPrazo+htmlBtnTypes+htmlBtnUpload+htmlBtnNaoLido;
                    
        $(`${divComandos}${infraBarraComandos}`).each(function(){
            var _this = $(this);
                _this.find('.iconPro_Observe').remove();
                _this.append(htmlBtn);            
        });
    }, 500);
}
function openListNewTab(this_) {
    var listNewTag = $('#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado').find(elemCheckbox+':checked').map(function(){ return $(this).val() }).get();
    if (listNewTag.length > 0) {
        $.each(listNewTag, function(index, value){
            var url = url_host+'?acao=procedimento_trabalhar&id_procedimento='+value;
            var win = window.open(url, '_blank');
            if (win) {
                win.focus();
            } else {
                console.log('Por favor, permita popups para essa p\u00E1gina');
            }
        })
    }
}
function dialogChangeTypeProc(this_) {
    initListTypesSEI(function (){
        var htmlOption = $.map(arrayListTypesSEI.selectTipoProc, function(v){
            return '<option value="'+v.value+'">'+v.name+'</option>';
        });
        $('#dialogBoxTipoProc').html(htmlOption);
        initChosenReplace('box_reload', $('#dialogBoxTipoProc')[0], true);
    });

    var htmlBox =   '<div class="dialogBoxDiv seiProForm">'+
                    '   <table style="font-size: 10pt;width: 100%;">'+
                    '      <tr style="height: 40px;">'+
                    '          <td class="label" style="vertical-align: bottom;">'+
                    '               <i class="iconPopup fas fa-inbox azulColor"></i> <span>Tipo de procedimento</span>'+
                    '          </td>'+
                    '          <td>'+
                    '               <select id="dialogBoxTipoProc" style="font-size: 10pt; width: 100%;">'+
                    '                   <option value="0">Carregando lista...</option>'+
                    '               </select>'+
                    '           </td>'+
                    '      </tr>'+
                    '   </table>'+
                    '</div>';

    resetDialogBoxPro('dialogBoxPro');
    dialogBoxPro = $('#dialogBoxPro')
        .html(htmlBox)
        .dialog({
            title: "Alterar informa\u00E7\u00F5es do processso",
        	width: 600,
        	buttons: [{
                text: "Alterar",
                class: 'confirm',
                click: function() {
                    changeTypeProc();
                }
            }]
    });
}
function changeTypeProc(this_) {
    var idTypeProc = $('#dialogBoxTipoProc').val();
    var txtTypeProc = $('#dialogBoxTipoProc').find('option:selected').text();
        getChangeTypeProc(idTypeProc, txtTypeProc);
        loadingButtonConfirm(true);
}
function getChangeTypeProc(idTypeProc, txtTypeProc) {
    var tableProc = $('#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado');
    var listProcs = tableProc.find(elemCheckbox+':checked').map(function(){ return $(this).val() }).get();
    if (listProcs.length > 0) {
        var id_protocolo = listProcs[0];
        var tr = tableProc.find('tr#P'+id_protocolo+'');
        var td = tr.find('td.tagintable').eq(1);
            td.find('.sucessEdit').remove();
            td.html(txtTypeProc+'<i class="fas fa-check azulColor sucessEdit" style="margin-left:10px;"></i>');
            updateDadosArvore('Consultar/Alterar Processo', 'selTipoProcedimento', idTypeProc, id_protocolo, function(){ 
                td.find('.sucessEdit').remove();
                td.append('<i class="fas fa-check-double azulColor sucessEdit" style="margin-left:10px;"></i>');
                setTimeout(function(){ td.find('.sucessEdit').remove(); }, 2000);
                setTimeout(function(){ 
                        tr.find(elemCheckbox+':checked').trigger('click');
                    var alink = tr.find('a[href*="controlador.php?acao=procedimento_trabalhar"]');
                    var txttooltip = alink.attr('onmouseover');
                    var tooltip = extractTooltipToArray(txttooltip);
                        alink.attr('onmouseover',txttooltip.replace(tooltip[1], txtTypeProc));
                        getChangeTypeProc(idTypeProc, txtTypeProc);
                }, 500);
            });
    } else {
        resetDialogBoxPro('dialogBoxPro');
        alertaBoxPro('Sucess', 'check-circle', 'Informa\u00E7\u00F5es editadas com sucesso!');
    }
}
// initPanelMonitorados migrado para ESM (src/features/monitorados/boot.js); exposto
// como global via monitorados/legacy-api.js. O call-site abaixo usa o alias.
function checkLoadConfigSheets(TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    if (typeof checkConfigValue !== 'undefined') { 
        if (
            (checkConfigValue('gerenciarprojetos') && typeof spreadsheetIdProjetos_Pro !== 'undefined' && spreadsheetIdProjetos_Pro !== false && spreadsheetIdProjetos_Pro !== 'undefined') ||
            (checkConfigValue('gerenciarformularios') && typeof spreadsheetIdFormularios_Pro !== 'undefined' && spreadsheetIdFormularios_Pro !== false && spreadsheetIdFormularios_Pro !== 'undefined') ||
            (checkConfigValue('sincronizarprocessos') && typeof spreadsheetIdSyncProcessos_Pro !== 'undefined' && spreadsheetIdSyncProcessos_Pro !== false && spreadsheetIdSyncProcessos_Pro !== 'undefined')
        ){
            handleClientLoadPro();
            // console.log('handleClientLoadPro');
        }
    } else {
        setTimeout(function(){ 
            checkLoadConfigSheets(TimeOut - 100); 
            if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage'))console.log('Reload checkLoadConfigSheets'); 
        }, 500);
    }
}
function orderDivPanel(html, idOrder, name) {
    if (typeof getParamsUrlPro(window.location.href).acao_pro === 'undefined') {
        if ($('.panelHomePro').length > 0) {
            $('.panelHomePro').each(function(){
                var id = parseInt($(this).data('order'));
                    if (id > idOrder) {
                        $(html).insertBefore($(this));
                        return false;
                    }
            });
            if ($('#'+name).length == 0) {
                $('#panelHomePro').append(html);
            }
        } else {
            $('#panelHomePro').append(html);
        }
        //$('#'+name).find('.infraBarraLocalizacao').append('<span>'+idOrder+'</span>');
    }
}
function insertDivPanelControleProc() {
    var elementControleProc = SeiPro.sei.adapter.isNewSEI() ? 'collapseTabelaProcesso' : 'frmProcedimentoControlar';
    var statusView = ( getOptionsPro(elementControleProc) == 'hide' ) ? 'none' : 'initial';
    var statusIconShow = ( getOptionsPro(elementControleProc) == 'hide' ) ? '' : 'display:none;';
    var statusIconHide = ( getOptionsPro(elementControleProc) == 'hide' ) ? 'display:none;' : '';
    var idControleProc = SeiPro.sei.adapter.isNewSEI() ? '.'+elementControleProc : '#'+elementControleProc;
    var idOrder = (getOptionsPro('orderPanelHome') && typeof jmespath !== 'undefined' && jmespath.search(getOptionsPro('orderPanelHome'), "[?name=='processosSEIPro'].index | length(@)") > 0) ? jmespath.search(getOptionsPro('orderPanelHome'), "[?name=='processosSEIPro'].index | [0]") : '';
    var htmlIconTable =     '<i class="controleProcPro '+(localStorage.getItem('seiSlim') ? 'fad fa-folders' : 'fas fa-folder-open')+' cinzaColor" style="margin: 0 10px 0 0; font-size: 1.1em;"></i>';
    var htmlToggleTable =   '<a class="controleProcPro newLink" id="'+elementControleProc+'_showIcon" onclick="toggleTablePro(\''+idControleProc+'\',\'show\')" onmouseover="return infraTooltipMostrar(\'Mostrar Tabela\');" onmouseout="return infraTooltipOcultar();" style="font-size: 11pt; '+statusIconShow+'"><i class="fas fa-plus-square cinzaColor"></i></a>'+
                            '<a class="controleProcPro newLink" id="'+elementControleProc+'_hideIcon" onclick="toggleTablePro(\''+idControleProc+'\',\'hide\')" onmouseover="return infraTooltipMostrar(\'Recolher Tabela\');" onmouseout="return infraTooltipOcultar();" style="font-size: 11pt; '+statusIconHide+'"><i class="fas fa-minus-square cinzaColor"></i></a>';
    var htmlDivPanel = '<div class="controleProcPro panelHomePro" style="display: inline-block; width: 100%;" id="processosSEIPro" data-order="'+idOrder+'"></div>';
    
    if (SeiPro.sei.adapter.isNewSEI()) $('#divFiltro, #collapseControle, #newFiltro, #divTabelaProcesso').addClass('collapseTabelaProcesso');

    if ($('.controleProcPro').length == 0) {
        $('#divInfraBarraLocalizacao').css('width', '100%').addClass('titlePanelHome').append(htmlToggleTable).prepend(htmlIconTable);
        $(idControleProc).css('width', '100%');
        if (!SeiPro.sei.adapter.isNewSEI()) $(idControleProc).css('display', statusView);
        $('#panelHomePro').prepend(htmlDivPanel);
        $('#frmProcedimentoControlar').moveTo('#processosSEIPro');
        $('#divInfraBarraLocalizacao').moveTo('#processosSEIPro');
        if (SeiPro.sei.adapter.isNewSEI() && getOptionsPro(elementControleProc) == 'hide') $(idControleProc).addClass('displayNone');
        if (!checkLoadedTableSorter() && (typeof storeGroupTablePro() === 'undefined' || storeGroupTablePro() == '')) removeAllTags(false, 3);
    }
}
function insertDivPanel() {
    if ($('#panelHomePro').length == 0 && $('#tblMarcadores').length == 0) { 
        $('#frmProcedimentoControlar').after('<div id="panelHomePro" style="display: inline-block; width: 100%;"></div>'); 
        initSortDivPanel();
    }
}
function initSortDivPanel(TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    if (typeof $('#panelHomePro').sortable !== 'undefined' && typeof getOptionsPro !== 'undefined' && typeof setSortDivPanel !== 'undefined' && typeof $().moveTo !== 'undefined') { 
        if ($('#tblMarcadores').length == 0) {
            insertDivPanelControleProc();
            setSortDivPanel();
            if (!checkLoadedTableSorter() && (typeof storeGroupTablePro() === 'undefined' || storeGroupTablePro() == '')) removeAllTags(true, 4);
        } 
    } else {
        setTimeout(function(){ 
            initSortDivPanel(TimeOut - 100); 
            if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage'))console.log('Reload initSortDivPanel => '+TimeOut); 
            if (TimeOut == 9000 && typeof fnJqueryPro !== 'undefined') fnJqueryPro();
        }, 500);
    }
}

// GERA LISTA DE PROCESSOS EM CSV
function getTableProcessosCSV() {
    var htmlTable = '<table>'+
                    '   <thead>'+
                    '       <tr>'+
                    '           <th>ID</th>'+
                    '           <th>Protocolo</th>'+
                    '           <th>Link_Permanente</th>'+
                    '           <th>Atribuicao</th>'+
                    '           <th>Etiqueta</th>'+
                    '           <th>Etiqueta_Descricao</th>'+
                    '           <th>Anotacao</th>'+
                    '           <th>Anotacao_Responsavel</th>'+
                    '           <th>Ponto_Controle</th>'+
                    '           <th>Especificacao</th>'+
                    '           <th>Tipo</th>'+
                    '           <th>Data_Autuacao</th>'+
                    '           <th>Data_Autuacao_Descricao</th>'+
                    '           <th>Data_Recebimento</th>'+
                    '           <th>Data_Recebimento_Descricao</th>'+
                    '           <th>Data_Envio</th>'+
                    '           <th>Data_Envio_Descricao</th>'+
                    '           <th>Unidade_Envio</th>'+
                    '           <th>Documento_Incluido</th>'+
                    '           <th>Observacoes</th>'+
                    '           <th>Acompanhamento_Especial</th>'+
                    '       </tr>'+
                    '   </thead>'+
                    '   <tbody>';
    var table = ($('#tblProcessosGerados').is(':visible')) ? $('#tblProcessosRecebidos, #tblProcessosGerados') : $('#tblProcessosRecebidos');
    var tableSelect = (table.find('tbody tr.infraTrMarcada').length > 0) ? table.find('tbody tr.infraTrMarcada') : table.find('tbody tr.infraTrClara');
        tableSelect.each(function(){
            var td = $(this).find('td');
            var id_protocolo = $(this).attr('id').replace('P', '');
            var etiqueta = td.eq(1).find('a[href*="andamento_marcador_gerenciar"]').attr('onmouseover');
            var etiqueta_array = (typeof etiqueta !== 'undefined' && etiqueta != '') ? extractAllTextBetweenQuotes(etiqueta) : false;
            var anotacao = td.eq(1).find('a[href*="anotacao_registrar"]').attr('onmouseover');
            var doc_incluido = td.eq(1).find('img[src*="exclamacao.png"]').length > 0 ? 'Um novo documento foi incluido ou assinado' : '';
            var anotacao_array = (typeof anotacao !== 'undefined' && anotacao != '') ? extractAllTextBetweenQuotes(anotacao) : false;
            var pontocontrole = td.eq(1).find('a[href*="andamento_situacao_gerenciar"]').attr('onmouseover');
            var pontocontrole_array = (typeof pontocontrole !== 'undefined' && pontocontrole != '') ? extractAllTextBetweenQuotes(pontocontrole) : false;
            var processo = td.eq(2).find('a[href*="procedimento_trabalhar"]');
            var descricao = processo.attr('onmouseover');
            var descricao_array = (typeof descricao !== 'undefined' && descricao != '') ? extractAllTextBetweenQuotes(descricao) : false;
            var nr_processo = processo.text().trim();
            var url_processo = processo.attr('href');
            var atribuicao = td.eq(3).find('a[href*="procedimento_atribuicao_listar"]').text().trim();
            var info_array = getArrayProcessoRecebido(url_processo);
            var data_visita = (typeof info_array.datetime !== 'undefined' && info_array.datetime != '') ? moment(info_array.datetime, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY HH:mm:ss') : '-';
            var data_geracao = (typeof info_array.datageracao !== 'undefined' && info_array.datageracao != '') ? moment(info_array.datageracao, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY HH:mm:ss') : '-';
            var desc_geracao = (typeof info_array.descricaodatageracao !== 'undefined') ? info_array.descricaodatageracao.replaceAll(';','') : '-';
            var data_recebimento = (typeof info_array.datahora !== 'undefined' && info_array.datahora != '') ? moment(info_array.datahora, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY HH:mm:ss') : '-';
            var desc_recebimento = (typeof info_array.descricao !== 'undefined') ? info_array.descricao.replaceAll(';','') : '-';
            var data_envio = (typeof info_array.datesend !== 'undefined' && info_array.datesend != '') ? moment(info_array.datesend, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY HH:mm:ss') : '-';
            var desc_envio = (typeof info_array.descricaosend !== 'undefined') ? info_array.descricaosend.replaceAll(';','') : '-';
            var unidade_envio = (typeof info_array.unidadesend !== 'undefined') ? info_array.unidadesend : '-';
            var observacoes = (typeof info_array.observacoes !== 'undefined' && info_array.observacoes != '') ? $.map(info_array.observacoes, function(v){ if(v.unidade != '') return v.unidade+': '+v.observacao }) : '-';
            var acompanhamento_especial = (typeof info_array.acompanhamentoesp !== 'undefined') ? info_array.acompanhamentoesp : '-';

                htmlTable +=    '       <tr>'+
                                '           <td>'+id_protocolo+'</td>'+
                                '           <td>'+nr_processo+'</td>'+
                                '           <td>'+url_host+'?acao=procedimento_trabalhar&id_procedimento='+id_protocolo+'</td>'+
                                '           <td>'+(atribuicao != '' ? atribuicao : '-')+'</td>'+
                                '           <td>'+(etiqueta_array && etiqueta_array[1] != '' ? etiqueta_array[1].replaceAll(';','') : '-')+'</td>'+
                                '           <td>'+(etiqueta_array && etiqueta_array[0] != '' ? etiqueta_array[0].replaceAll(';','') : '-')+'</td>'+
                                '           <td>'+(anotacao_array && anotacao_array[0] != '' ? anotacao_array[0].replaceAll(';','') : '-')+'</td>'+
                                '           <td>'+(anotacao_array && anotacao_array[1] != '' ? anotacao_array[1].replaceAll(';','') : '-')+'</td>'+
                                '           <td>'+(pontocontrole_array && pontocontrole_array[1] != '' ? pontocontrole_array[0].replaceAll(';','') : '-')+'</td>'+
                                '           <td>'+(descricao_array && descricao_array[0] != '' ? descricao_array[0].replaceAll(';','') : '-')+'</td>'+
                                '           <td>'+(descricao_array && descricao_array[1] != '' ? descricao_array[1].replaceAll(';','') : '-')+'</td>'+
                                '           <td>'+data_geracao+'</td>'+
                                '           <td>'+desc_geracao+'</td>'+
                                '           <td>'+data_recebimento+'</td>'+
                                '           <td>'+desc_recebimento+'</td>'+
                                '           <td>'+data_envio+'</td>'+
                                '           <td>'+desc_envio+'</td>'+
                                '           <td>'+unidade_envio+'</td>'+
                                '           <td>'+doc_incluido+'</td>'+
                                '           <td>'+observacoes+'</td>'+
                                '           <td>'+acompanhamento_especial+'</td>'+
                                '       </tr>';
            //console.log(id_protocolo, nr_processo, etiqueta_array, anotacao_array, descricao_array, atribuicao, data_visita, data_geracao, data_recebimento, data_envio, unidade_envio);
        });
    htmlTable +=    '       </tbody>'+
                    '</table>';
    downloadTableCSV($(htmlTable), 'ListaProcessos_SEIPro');
}

function copyTableResultProtocoloSEI() {
    var htmlTable = $('.tableResultProtocoloSEI')[0].outerHTML;
        copyToClipboardHTML(htmlTable);
}
function downloadTableResultProtocoloSEI() {
    downloadTableCSV($('.tableResultProtocoloSEI'), 'PesquisaProtocolo_SEIPro');
}
function initFilterTableProcessos(this_, TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    if (checkLoadedTableSorter()) { 
        filterTableProcessos(this_);
    } else {
        if (TimeOut == 9000) removeAllTags(false, 5);
        setTimeout(function(){ 
            initFilterTableProcessos(this_, TimeOut - 100); 
            if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage')) console.log('Reload initFilterTableProcessos'); 
        }, 1500);
    }
}
function filterTableProcessos(this_) {
    var _this = $(this_);
    var _parent = _this.closest('thead');
    var table = _this.closest('table');
    var filter = _parent.find('.tablesorter-filter-row');
    if (_this.hasClass('newLink_active')) {
        filter.addClass('hideme');
        _this.removeClass('newLink_active');
        table.trigger('filterReset');
    } else {
        filter.removeClass('hideme').find('input:visible').eq(1).focus();
        _this.addClass('newLink_active');
    }
}
function initTableSorterHome(TimeOut = 1000) {
    if (TimeOut <= 0) { return; }
    if (
        typeof corrigeTableSEI !== 'undefined' && 
        typeof checkConfigValue !== 'undefined' && 
        typeof $().tablesorter !== 'undefined' && 
        $('#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado').find('tbody tr').length > 0
    ) { 
        if (checkConfigValue('ordernartabela') && $('#frmPesquisaProtocolo').length == 0) {
            setTableSorterHome();
        }
    } else {
        setTimeout(function(){ 
            if (typeof $().tablesorter === 'undefined' && TimeOut == 1000) { $.getScript(parent.URL_SPRO+"js/lib/jquery.tablesorter.combined.min.js") }
            initTableSorterHome(TimeOut - 100); 
            if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage'))console.log('Reload initTableSorterHome'); 
        }, 500);
    }
}
function setTableSorterHome() {
    var observerFilterHome = new MutationObserver(function(mutations) {
        var _this = $(mutations[0].target);
        var _parent = _this.closest('table');
        var iconFilter = _parent.find('.filterTableProcessos');
        var checkIconFilter = iconFilter.hasClass('newLink_active');
        var hideme = _this.hasClass('hideme');
        if (hideme && checkIconFilter) {
            iconFilter.removeClass('newLink_active');
        }
    });
    var tableSorterHome = $('#tblProcessosGerados, #tblProcessosRecebidos, #tblProcessosDetalhado');
        if (tableSorterHome.length > 0) {
            window.tableHomePro = [];
            setSortLocaleCompare();
            tableSorterHome.each(function(i){

                if (!$(this).hasClass('infraTableOrdenacao')) {
                    $(this).find('thead tr.tablesorter-filter-row').remove();
                    corrigeTableSEI(this);
                   if (SeiPro.sei.adapter.isNewSEI()) {
                        $(this).find('thead [colspan]').each(function(){
                            var _this = $(this);
                            var colspan = parseInt(_this.attr('colspan'));
                            if (colspan > 1) {
                                _this.removeAttr('colspan');
                                for (var i = 1; i < colspan; i++) {
                                    _this.after(_this.clone().text(''));
                                }
                            }
                        });
                        var theadCols = $(this).find('thead tr:first th, thead tr:first td').length;
                        var tbodyCols = $(this).find('tbody tr:not(.tableHeader):first td').length;
                        var theadRow = $(this).find('thead tr:first');
                        for (var j = theadCols; j < tbodyCols; j++) {
                            theadRow.append('<th></th>');
                        }
                        // #ancLiberarMeusProcessos precisa de bind: testado ao vivo (2026-06-30) —
                        // o SEI não liga nenhum handler de clique nesse botão (jQuery._data confirma
                        // zero listeners), embora a função nativa verMeusProcessos exista e funcione
                        // (ela só existe no mundo MAIN da página — chamá-la direto do mundo isolado
                        // lança ReferenceError, como tentamos antes). verMeusProcessos('T') faz só
                        // duas coisas (confirmado lendo o código-fonte da função na página real):
                        // seta #hdnMeusProcessos='T' e submete #frmProcedimentoControlar — isso É
                        // manipulação de DOM pura, que o mundo isolado replica sem cruzar mundos.
                        // O servidor decide ligar/desligar o filtro pelo estado de sessão, não pelo
                        // valor estático do campo — por isso sempre 'T', tanto para ativar quanto
                        // para remover (mesmo padrão usado pelo link "Ver atribuídos a mim").
                        $('#ancLiberarMeusProcessos').click(function (e) {
                            e.preventDefault();
                            var hdn = document.getElementById('hdnMeusProcessos');
                            var form = document.getElementById('frmProcedimentoControlar');
                            if (hdn && form) {
                                hdn.value = 'T';
                                form.submit();
                            }
                        });
                   }
                    
                    var elemID = $(this).attr('id');
                    var _this = $('#'+$(this).attr('id'));
                    var sortListArray = (typeof sortListSaved !== 'undefined' && sortListSaved && typeof sortListSaved[elemID] !== 'undefined') ? sortListSaved[elemID].sortList : [];
                    var configSorter = {
                        sortLocaleCompare : true,
                        textExtraction: {
                            1: function (elem, table, cellIndex) {
                                var text_return = '';
                                if ($(elem).find('img').length > 0) {
                                    $(elem).find('img').each(function(){
                                        var type_img = $(this).attr('src').indexOf('anotacao') != -1 ? 'Nota:' : '';
                                            type_img = $(this).attr('src').indexOf('marcador') != -1 ? 'Marcador:' : type_img;
                                        var prioridade = $(this).attr('src').indexOf('prioridade') != -1 ? '1' : '2';
                                        var texttip = $(this).closest('a').attr('onmouseover');
                                            texttip = (typeof texttip !== 'undefined') ? texttip : $(this).attr('onmouseover');
                                            texttip = (typeof texttip !== 'undefined') ? extractTooltip(texttip) : ''; 
                                        text_return += prioridade+' '+type_img+' '+texttip;
                                    });
                                }
                                text_return = (text_return == '') ? '3' : text_return.replace(/  /g, ' ');
                                // console.log(text_return);
                                return text_return;
                            },
                            2: function (elem, table, cellIndex) {
                                var processo = $(elem).find('a').eq(0);
                                var nrProc = processo.text().trim();
                                var texttip = processo.attr('onmouseover');
                                    texttip = (typeof texttip !== 'undefined') ? extractTooltip(texttip) : '';
                                var urgente = (texttip != '' && texttip.toLowerCase().indexOf('(urgente)') !== -1) ? '0 ' : '';
                                var prescricao = $(elem).find('.progressPrescricao').attr('aria-percent'); 
                                    prescricao = typeof prescricao !== 'undefined' ? ' '+prescricao+' ' : ' 0 ';
                                return urgente+prescricao+nrProc+' '+texttip;
                            },
                            4: function (elem, table, cellIndex) {
                              var target = $(elem).find('.dateboxDisplay').eq(0);
                              var text_date = (typeof target !== 'undefined' && target.length > 0) ? target.data('time-sorter') : $(elem).text().trim();
                              return text_date;
                            }
                        },
                        widgets: ["saveSort", "filter"],
                        widgetOptions: {
                            saveSort: true,
                            // filter_external: '#txtPesquisaRapida',
                            filter_hideFilters: true,
                            filter_columnFilters: true,
                            filter_saveFilters: true,
                            filter_hideEmpty: true,
                            filter_excludeFilter: {}
                        },
                        sortList: sortListArray,
                        sortReset: true,
                        ignoreCase: true,
                        sortLocaleCompare: true,
                        headers: {
                            0: { sorter: false, filter: false },
                            1: { sorter: true, filter: true },
                            2: { sorter: true, filter: true },
                            3: { sorter: true, filter: true },
                            4: { sorter: true, filter: true },
                            4: { sorter: true, filter: true }
                        }
                    };
                    
                    _this.find("thead th:eq(0)").data("sorter", false);
                    var tableHomeThis = _this.tablesorter(configSorter).on("sortEnd", function (event, data) {
                            checkboxRangerSelectShift();
                        }).on("filterEnd", function (event, data) {
                            checkboxRangerSelectShift();
                            updateHomeFilterCaption($(this));
                                $(this).find("tbody > tr:visible > td > input").prop('disabled', false);
                                $(this).find("tbody > tr:hidden > td > input").prop('disabled', true);
                        });
                    tableHomeThis.find("caption").each(function(){
                        $(this).data('seiProCaptionBase', $(this).text());
                    });
                        
                    tableHomePro.push(tableHomeThis);

                    var _tableId = _this.attr('id') || 'tblProcessos';
                    _this.find('.tablesorter-filter-row input.tablesorter-filter').each(function() {
                        $(this).attr('name', _tableId + '_filter_col' + ($(this).attr('data-column') || '0'));
                    });

                    var filter = _this.find('.tablesorter-filter-row').get(0);
                    if (typeof filter !== 'undefined') {
                        setTimeout(function(){ 
                            var htmlFilter =    '<a class="newLink filterTableProcessos '+(_this.find('tr.tablesorter-filter-row').hasClass('hideme') ? '' : 'newLink_active')+'" onclick="initFilterTableProcessos(this)" onmouseover="return infraTooltipMostrar(\'Pesquisar na tabela\');" onmouseout="return infraTooltipOcultar();" style="left: 0; top: -20px; position: absolute;">'+
                                                '   <i class="fas fa-search cinzaColor" style="padding-right: 3px; cursor: pointer; font-size: 12pt;"></i>'+
                                                '</a>';
                            _this.find('thead .filterTableProcessos').remove();
                            _this.find('thead').prepend(htmlFilter);
                            observerFilterHome.observe(filter, {
                                attributes: true
                            });
                            tableSorterHome.find('.tablesorter-filter-row input.tablesorter-filter[aria-label*="Prazos"]').attr('type','date');
                        });
                    }
                }
            });
            if (tableSorterHome.find('tbody tr td:nth-child(2)').find('img').length > 0) {
                tableSorterHome.find('thead tr:first th:nth-child(2)').css('width','150px');
            }

            setTimeout(function(){ 
                if ($('.filterTableProcessos').length == 0) {
                    setTimeout(function(){ 
                        if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage'))console.log('Reload tableHomeDestroy *****');
                        tableHomeDestroy(true);
                    }, 1000);
                }
                var filterStore = (typeof tableHomePro[0] !== 'undefined' && typeof tableHomePro[0][0] !== 'undefined') ? $.tablesorter.storage(tableHomePro[0][0], 'tablesorter-filters') : [];
                if (typeof filterStore !== 'undefined' && filterStore !== null && filterStore.length > 0) {
                    var filterUser = filterStore[3];
                        filterUser = (typeof filterUser !== 'undefined' && filterUser !== null) ? filterUser.replace('(','').replace(')','') : false;
                        filterUser = filterUser === '""' ? '__unassigned__' : filterUser;
                    if (filterUser) {
                        if ($('#filterAssignmentTableHome').length > 0) {
                            $('#filterAssignmentTableHome').val(filterUser).trigger('chosen:updated');
                        } else {
                            $('#filterTableHome').val(filterUser).trigger('chosen:updated');
                        }
                    } else if ($('#filterAssignmentTableHome').length > 0) {
                        $('#filterAssignmentTableHome').val('').trigger('chosen:updated');
                    } else {
                        $('#filterTableHome').val('').trigger('chosen:updated');
                    }
                }
                if (typeof verifyConfigValue !== 'undefined' && verifyConfigValue('mostraranotacaocontrole')) {
                    // Feature migrada p/ src/features/anotacao-controle (bundle isolado).
                    if (window.SeiPro && SeiPro.features && SeiPro.features.anotacaoControle) SeiPro.features.anotacaoControle.render();
                }
            }, 1000);
        }
}
function tableHomeDestroy(reload = false, tableHomeTimeout = 3000) {
    if (tableHomePro.length > 0) {
        $.each(tableHomePro, function(i){
            tableHomePro[i].trigger("destroy");
        });
        $('.filterTableProcessos').remove();
        window.tableHomePro = [];
        if (reload && tableHomeTimeout > 0) {
            initTableSorterHome();
            if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage'))console.log('Reload initTableSorterHome => '+tableHomeTimeout);
            setTimeout(function(){ 
                forceTableHomeDestroy(tableHomeTimeout-500);
            }, 1000);
        }
    } else {
        initTableSorterHome();
    }
}
function forceTableHomeDestroy(Timeout = 3000) {
    if (Timeout <= 0) { return; }
    var force = false;
    $.each(tableHomePro, function(i){
        var filter = $.tablesorter.storage( tableHomePro[i][0], 'tablesorter-filters');
        var rowFilter = $(tableHomePro[i][0]).find('tr.tablesorter-filter-row').hasClass('hideme');
        force = (typeof filter !== 'undefined' && filter !== null && filter.length > 0 && rowFilter) ? true : force;
    });
    if (force && Timeout > 0 && $('#tblProcessosGerados').is(':visible')) {
        tableHomeDestroy(true, Timeout-1000);
        if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage'))console.log('Reload forceTableHomeDestroy => '+TimeOut);
    }
}
function forceOnLoadBody() {
    // No-op intencional. Antes rodava o onload nativo do <body> do SEI via
    // new Function($('body').attr('onload')) — removido porque:
    //  1) a CSP da extensão bloqueia eval/new Function no mundo isolado, gerando o
    //     aviso "unsafe-eval" no console (e a chamada sempre caía no catch);
    //  2) o código desse onload referencia globais do mundo MAIN da página
    //     (infra*), inacessíveis a partir do content script isolado.
    // O onload real do <body> já é executado pelo próprio navegador ao carregar a
    // página; não há o que re-disparar daqui. modalLink já é carregado eager.
}
function observeAreaTela(TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    if (typeof setResizeAreaTelaD !== 'undefined') { 
        new ResizeObserver(setResizeAreaTelaD).observe(divInfraAreaTelaD);
    } else {
        setTimeout(function(){ 
            observeAreaTela(TimeOut - 100); 
            if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage'))console.log('Reload observeAreaTela'); 
        }, 500);
    }
}

// ============================================================================
// Feature "Mostrar anotação na tela de controle" (config mostraranotacaocontrole)
// MIGRADA para src/features/anotacao-controle/ (bundle isolado próprio).
// Núcleo puro: src/core/sticknote.js. View: anotacao-controle/view.js.
// Acionada via SeiPro.features.anotacaoControle.init()/render() (ver call-sites acima).
// ============================================================================
function initFullnameAtribuicao(TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    if (typeof checkConfigValue !== 'undefined') { 
        if (verifyConfigValue('nomesusuarios')) {
            fullnameAtribuicao();
        }
    } else {
        setTimeout(function(){ 
            initFullnameAtribuicao(TimeOut - 100); 
            if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage'))console.log('Reload initFullnameAtribuicao');  
        }, 500);
    }
}
function initViewEspecifacaoProcesso(TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    if (typeof checkConfigValue !== 'undefined') { 
        if (verifyConfigValue('especificaprocesso')) {
            viewEspecifacaoProcesso();
        }
    } else {
        setTimeout(function(){ 
            initViewEspecifacaoProcesso(TimeOut - 100); 
            if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage'))console.log('Reload initViewEspecifacaoProcesso'); 
        }, 500);
    }
}
function initFaviconNrProcesso(TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    if (typeof Favico !== 'undefined' && typeof checkConfigValue !== 'undefined') { 
        if (checkConfigValue('contadoricone')) {
            getFaviconNrProcesso();
        }
    } else {
        setTimeout(function(){ 
            initFaviconNrProcesso(TimeOut - 100); 
            if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage'))console.log('Reload initFaviconNrProcesso'); 
        }, 500);
    }
}
function initReloadModalLink(TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    if (typeof reloadModalLink !== 'undefined') { 
        reloadModalLink();
    } else {
        setTimeout(function(){ 
            initReloadModalLink(TimeOut - 100); 
            if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage'))console.log('Reload initReloadModalLink'); 
        }, 500);
    }
}
function initReplaceNewIcons(TimeOut = 9000) {
    if (typeof isNewSEI !== 'undefined' && SeiPro.sei.adapter.isNewSEI()) $(divComandos+' a').addClass('botaoSEI');
    if (localStorage.getItem('seiSlim') === null || (TimeOut <= 0 || parent.window.name != '')) { return; }
    if (typeof replaceNewIcons === 'function') {
        replaceNewIcons($(`${infraBarraComandos} a.botaoSEI`));
    } else {
        setTimeout(function(){ 
            initReplaceNewIcons(TimeOut - 100); 
            if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage'))console.log('Reload initReplaceNewIcons => '+TimeOut); 
        }, 500);
    }
}
function initObserveUrlChange(TimeOut = 9000) {
    if (TimeOut <= 0 || parent.window.name != '') { return; }
    if (typeof parent.verifyConfigValue === 'function') {
        setObserveUrlChange();
    } else {
        setTimeout(function(){ 
            initObserveUrlChange(TimeOut - 100); 
            if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage'))console.log('Reload initObserveUrlChange => '+TimeOut); 
        }, 500);
    }
}
function setObserveUrlChange() {
    if (parent.verifyConfigValue('urlamigavel')) {
        $(window).bind('hashchange', function() {
            var ifrArvore = $('#ifrArvore').contents();
            var sourceLink = ifrArvore.find('.infraArvoreNoSelecionado').eq(0).closest(`a[target="${ifrVisualizacao_}"]`);
            var nrSEI = (typeof sourceLink !== 'undefined' && sourceLink !== null) ? getNrSei(sourceLink.text().trim()) : false;
                nrSEI = (nrSEI == '') ? false : nrSEI;
            var nrSEI_URL = (window.location.hash.indexOf('@') !== -1) ? window.location.hash.replace('#','').split('@')[1] : false;
                nrSEI_URL = (nrSEI_URL == '') ? false : nrSEI_URL;

            var idSource = (iHistoryArray.length > 0) ? jmespath.search(iHistoryArray, "[?sei=='@"+nrSEI+"'] | [0].id") : null;
                idSource = (idSource === null) ? false : idSource;
            var idTarget = (iHistoryArray.length > 0) ? jmespath.search(iHistoryArray, "[?sei=='@"+nrSEI_URL+"'] | [0].id") : null;
                idTarget = (idTarget === null) ? false : idTarget;
            // console.log(nrSEI, nrSEI_URL, window.location.hash, window.history.length, iHistory, iHistoryArray, idSource, idTarget);

            if (nrSEI_URL && nrSEI_URL && nrSEI != nrSEI_URL && !delayCrash) {
                delayCrash = true;
                setTimeout(function(){ delayCrash = false }, 300);
                sourceLink.closest('.infraArvore').find('.infraArvoreNoSelecionado').removeClass('infraArvoreNoSelecionado');
                var targetLink = ifrArvore.find('a[target="ifrVisualizacao"]:contains("'+nrSEI_URL+'")');
                var pastaArvore = targetLink.closest('.infraArvore');
                    targetLink.unbind('click').trigger('click');
                    if (idSource && idTarget && idSource > idTarget) {
                        window.history.back(-1);
                    } else {
                        window.history.go(1);
                    }
                    setClickUrlAmigavel();
                if (!pastaArvore.is(':visible')) {
                    var pastaID = pastaArvore.attr('id').replace('div','');
                    ifrArvore.find('#ancjoin'+pastaID).trigger('click');
                }
            }
        });
    }
}
function selectPanelKanbanHome() {
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
function removeDataPanelProc(_this) {
    removeOptionsPro('listaMarcadores');
    removeOptionsPro('arrayListUsersSEI');
    getPanelProc(_this);
}
function getPanelProc(this_) {
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
function installPanelProcDelegation(root) {
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
function initAddKanbanProc(type = storeGroupTablePro(), loop = 3, TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    if (typeof jKanban !== 'undefined') { 
        addKanbanProc(type, loop);
    } else {
        if (typeof jKanban === 'undefined') $.getScript(URL_SPRO+"js/lib/jkanban.min.js");
        setTimeout(function(){ 
            initAddKanbanProc(type, loop, TimeOut - 100); 
            if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage'))console.log('Reload initAddKanbanProc'); 
        }, 500);
    }
}
function addKanbanProc(type = storeGroupTablePro(), loop = 3) {
    if (typeof jKanban === 'undefined') $.getScript(URL_SPRO+"js/lib/jkanban.min.js");
    if (!type || type == 'all' || type == '') {
        setOptionsPro('panelProcessosView', 'Tabela');
        // Chamada direta no mundo isolado (evita .trigger('click') → MAIN onclick).
        var btnTabela = document.querySelector('#processosProActions .btn[data-value="Tabela"]');
        if (btnTabela) getPanelProc(btnTabela);
    } else {
        var tableProc = $('#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado');
        if (type == 'users') {
            if (getOptionsPro('arrayListUsersSEI') && getOptionsPro('arrayListUsersSEI').length > 0) {
                $('#processosProActions [data-value="Quadro"] i').attr('class','fas fa-project-diagram');
                var itensKanban = $.map(getOptionsPro('arrayListUsersSEI'),function(v){
                    return (typeof getAtribuicaoDisplayLabel === 'function')
                        ? getAtribuicaoDisplayLabel(v.name, v.name, checkConfigValue('nomesusuarios'))
                        : v.name;
                });
                itensKanban.unshift('');
            } else if (loop > 0) {
                getAjaxListaAtribuicao();
                setTimeout(function(){ initAddKanbanProc(type, loop-1); }, 2000);
                $('#processosProActions [data-value="Quadro"] i').attr('class','fas fa-spinner fa-spin');
            }
        } else if (type == 'tags') {
            if (getOptionsPro('listaMarcadores') && getOptionsPro('listaMarcadores').length > 0) {
                $('#processosProActions [data-value="Quadro"] i').attr('class','fas fa-project-diagram');
                var itensKanban = $.map(getOptionsPro('listaMarcadores'),function(v){
                    return v.name;
                });
                itensKanban.unshift('');
            } else if (loop > 0) {
                getAjaxListaMarcador();
                setTimeout(function(){ initAddKanbanProc(type, loop-1); }, 2000);
                $('#processosProActions [data-value="Quadro"] i').attr('class','fas fa-spinner fa-spin');
            }
        } else {
            var itensKanban = getListTypes(type);
            $('#processosProActions [data-value="Quadro"] i').attr('class','fas fa-project-diagram');
        }
        if (!!itensKanban && type != '') {
            itensKanban = $.map(itensKanban, function(v, i){ return {order: i, name: v, id: getTagName(v, type)} });
            var tr = tableProc.find('tr[data-tagname]:not(.tagintable)');
            var itens = tr.map(function(){ 
                    var tagName = $(this).data('tagname');
                    var idTag = 'id_'+tagName;
                    var itemBoard = $.grep(itensKanban, function(item){ return item.id == tagName; })[0];
                    var nameLabel = (itemBoard && itemBoard.name !== '') ? itemBoard.name : 'Sem Grupo';
                    var linkProc = $(this).find('a[href*="acao=procedimento_trabalhar"]');
                    var tip = extractTooltipToArray(linkProc.attr('onmouseover'));
                        tip = (typeof tip !== 'undefined') ? tip : false;
                    var linkParams = getParamsUrlPro(linkProc.attr('href'));
                    var id_protocolo = (linkParams && typeof linkParams.id_procedimento !== 'undefined') ? linkParams.id_procedimento : false;
                    if (id_protocolo !== false && id_protocolo !== 'false' && id_protocolo !== '' && id_protocolo !== null && typeof id_protocolo !== 'undefined') {
                        return {
                            id: idTag,
                            title: nameLabel,
                            id_protocolo: String(id_protocolo),
                            processo: linkProc.text(),
                            especificacao: tip ? tip[0] : false,
                            tipo: tip ? tip[1] : false,
                            html_icons: $(this).find('td').eq(1).html(),
                            html_proc: $(this).find('td').eq(2).html(),
                            html_atribuicao: $(this).find('td').eq(3).html(),
                            html_prazo: $(this).find('td.seipro-prazo-box-display').html(),
                            color: $(this).data('color') ? $(this).css('color') : false
                        }
                    }
            }).get();

            $('#processosKanban').remove();
            $('#newFiltro').after('<div id="processosKanban" style="display: inline-block;margin-top: 60px;width: 100%;"></div>');

            var bords_list = $.map(itensKanban, function(v, i){
                var item = $.grep(itens, function(row){ return row.id == 'id_'+v.id; });
                var title = v.name == '' ? 'Sem Grupo' : v.name;
                    title = ((type == 'arrivaldate' || type == 'acessdate' || type == 'senddate' || type == 'createdate' || type == 'deadline') && title.indexOf('.') !== -1 ) ? title.split('.')[1] : title;
                var boardOrderStore = getOptionsPro('panelProcessosOrder_'+type);
                var boardOrderItem = (boardOrderStore && $.isArray(boardOrderStore)) ? $.grep(boardOrderStore, function(row){ return row.id == v.id; })[0] : null;
                var order_board = boardOrderItem && typeof boardOrderItem.order !== 'undefined' ? boardOrderItem.order : i;
                    order_board = order_board === null ? 9999 : order_board;
                var collapse_board = boardOrderItem && typeof boardOrderItem.collapse !== 'undefined' ? boardOrderItem.collapse : false;

                var itens_board = $.map(item,function(value, index){
                    if (!value || !value.id_protocolo || value.id_protocolo === 'false') {
                        return;
                    }

                    var iten_urgente = value.especificacao && value.especificacao.toLowerCase().indexOf('(urgente)') !== -1 ? true : false;
                    var item_pinboard = false;
                    var order_item = false;
                    if (boardOrderItem && $.isArray(boardOrderItem.itens)) {
                        order_item = $.grep(boardOrderItem.itens, function(row){ return row.id == String(value.id_protocolo); })[0] || false;
                    }
                        item_pinboard = order_item === null || order_item === false ? item_pinboard : order_item.pinboard;
                        order_item = order_item === null || order_item === false ? 9999 : order_item.order;
                        order_item = iten_urgente ? -1 : order_item;
                    var pinBoard = '<span style="float: right;margin: -5px -10px 0 0;" class="kanban-pinboard info_noclick"><a class="newLink info_noclick '+(item_pinboard ? 'newLink_active' : '')+'" onclick="pinKanbanItensProc(this, '+value.id_protocolo+')" onmouseover="return infraTooltipMostrar(\''+(item_pinboard ? 'Remover do topo' : 'Fixar no topo')+'\');" onmouseout="return infraTooltipOcultar();"><i class="fas fa-thumbtack cinzaColor"></i></a></span>';
                    
                    return {
                        id: value.id_protocolo,
                        order: order_item,
                        title:  pinBoard+
                                '<div class="kanban-content">'+
                                '   <div class="kanban-title-card content_edit" data-field="assunto" data-id="'+value.id_protocolo+'">'+
                                '       <span class="info" data-type="proc" style="width: 75%;">'+
                                '           '+value.html_proc+
                                '           <a class="newLink info_noclick followLinkNewtab" href="controlador.php?acao=procedimento_trabalhar&id_procedimento='+value.id_protocolo+'" onmouseover="return infraTooltipMostrar(\'Abrir em nova aba\');" onmouseout="return infraTooltipOcultar();" target="_blank"><i class="fas fa-external-link-alt" style="font-size: 90%; text-decoration: underline;"></i></a>'+
                                '       </span>'+
                                '   </div>'+
                                '   <div class="kanban-description">'+
                                '       <span class="sub info_noclick" data-type="especificacao">'+value.especificacao+'</span>'+
                                '       <span class="sub info_noclick" data-type="tipo">'+value.tipo+'</span>'+
                                '       <span class="sub info_noclick" data-type="atribuicao">'+value.html_atribuicao+'</span>'+
                                '       <span class="sub info_noclick" data-type="icons">'+value.html_icons+'</span>'+
                                '       <span class="sub info_noclick" data-type="prazo">'+value.html_prazo+'</span>'+
                                '   </div>'+
                                '</div>',
                        click: function(el) {
                            var id_protocolo = el.dataset.eid;
                            var checkOver = ($(el).find('.info_noclick:hover').length > 0) ? $(el).find('.info_noclick:hover') : false;
                            var newTab = ($(el).find('.followLinkNewtab:hover').length > 0) ? $(el).find('.followLinkNewtab:hover') : false;
                            if (!dialogBoxPro && !checkOver && id_protocolo) window.location.href = 'controlador.php?acao=procedimento_trabalhar&id_procedimento='+id_protocolo;
                            if (!dialogBoxPro && id_protocolo && newTab) openLinkNewTab('controlador.php?acao=procedimento_trabalhar&id_procedimento='+id_protocolo);
                        },
                        class: iten_urgente ? 'urgente' : ''
                    }
                });
                itens_board.sort(function(a,b){ return a.order - b.order;});

                if (v.id == 'SemGrupo' && itens_board.length === 0) {
                    return null;
                }

                return {
                    id: v.id,
                    title: title,
                    order: order_board,
                    class: 'proc_'+type,
                    color: (typeof item[0] !== 'undefined') ? item[0].color : false,
                    collapse: collapse_board,
                    item: itens_board
                }
            });

            bords_list.sort(function(a,b){ return a.order - b.order;});

            var kanban = new jKanban({
                element: '#processosKanban',
                gutter: '10px',
                widthBoard: "calc(25% - 20px)",
                // responsivePercentage: true,
                itemHandleOptions:{
                    enabled: true,
                },
                dragEl: function(el, source){
                    var sourceEl = source.parentElement.getAttribute('data-id');
                    var id_protocolo = el.dataset.eid;
                    var elemItem = $('#processosKanban .kanban-item[data-eid="'+id_protocolo+'"]');
                        kanbanProcessosMoving = {source: sourceEl, id: el.dataset.eid, order: elemItem.index()};
                        // drag_auto_scroll(el);
                },
                dropEl: function(el, target, source, sibling){
                    updateOrderKanbanBoardProc();

                    var targetEl = target.parentElement.getAttribute('data-id');
                    var sourceEl = source.parentElement.getAttribute('data-id');
                    var id_protocolo = el.dataset.eid;
                    var elemItem = $('#processosKanban .kanban-item[data-eid="'+id_protocolo+'"]');
                    var titleSource = elemItem.closest('.kanban-board').find('.kanban-title-board').text();
                    var elemContent = elemItem.find('.kanban-content');
                    var elemProc = elemContent.find('span[data-type="proc"]');
                    var elemUser = elemContent.find('span[data-type="atribuicao"]');
                    var elemIcons = elemContent.find('span[data-type="icons"]');
                    var elemTypes = elemContent.find('span[data-type="tipo"]');

                    if (type == 'users' && sourceEl != targetEl) {
                        var arrayListUsersSEI = getOptionsPro('arrayListUsersSEI');
                        if (arrayListUsersSEI) {
                            var userMatch = $.grep(arrayListUsersSEI, function(item){
                                return item.name && item.name.indexOf(targetEl) !== -1;
                            })[0];
                            var idUser = userMatch ? userMatch.value : false;
                                idUser = idUser == 'SemGrupo' ? 'null' : idUser;
                            var linkAtribuicao = tableProc.find('a[href*="&id_usuario_atribuicao='+idUser+'"]').attr('href');
                                elemProc.prepend('<i class="fas fa-sync fa-spin cinzaColor" style="margin-right: 5px;"></i>');

                                updateDadosArvore('Atribuir Processo', 'selAtribuicao', idUser, id_protocolo, function(){ 
                                    if (targetEl != 'SemGrupo') {
                                        var targetAtribuicao = '(<a href="'+linkAtribuicao+'" title="Atribu\u00EDdo para '+targetEl+'" class="ancoraSigla">'+targetEl+'</a>)';
                                        elemUser.html(targetAtribuicao);
                                        tableProc.find('tr[id="P'+id_protocolo+'"]').find('td').eq(3).html(targetAtribuicao);
                                    } else {
                                        elemUser.html('');
                                        tableProc.find('tr[id="P'+id_protocolo+'"]').find('td').eq(3).html('');
                                    }
                                    elemProc.find('i.fa-sync').remove();
                                    elemProc.prepend('<i class="fas fa-check-double verdeColor" style="margin-right: 5px;"></i>');
                                    setTimeout(function(){ elemProc.find('i.fa-check-double').remove(); }, 2000);
                                });
                        }
                    } else if (type == 'tags' && sourceEl != targetEl) {
                        var listMarcadores = getOptionsPro('listaMarcadores');
                            listMarcadores = listMarcadores ? $.map(listMarcadores, function(v){
                                                return {name: getTagName(v.name, type), value: v.value, img: v.img}
                                            }) : false;
                            listMarcadores = listMarcadores !== null ? listMarcadores : false;    

                        var arrayMarcador = listMarcadores ? $.grep(listMarcadores, function(item){ return item.name == targetEl; })[0] : false;
                        var valueMarcador = arrayMarcador !== null && arrayMarcador ? arrayMarcador.value : false;  
                        var elemIconTag = elemIcons.find('a[href*="acao=andamento_marcador_gerenciar"]');
                        var elemIconTagTable = tableProc.find('tr[id="P'+id_protocolo+'"]').find('td').eq(1).find('a[href*="acao=andamento_marcador_gerenciar"]');
                        var valueText = elemIconTag.attr('onmouseover');
                            valueText = (typeof valueText !== 'undefined') ? extractTooltipToArray(valueText) : false;
                            valueText = valueText ? valueText[0] : false;
                            valueText = typeof valueText !== 'undefined' && valueText ? valueText : '';

                            if (valueMarcador || targetEl == 'SemGrupo') {
                                var valuesIframe = [
                                    {element: 'txaTexto', value: valueText},
                                    {element: 'hdnIdMarcador', value: (targetEl == 'SemGrupo') ? '' : valueMarcador}
                                ];

                                updateDadosArvoreMult('Gerenciar Marcador', valuesIframe, id_protocolo, function(){ 
                                    var arrayListMarcadores = sessionStorageRestorePro('dadosMarcadoresProcessoPro');
                                    var markerStyle = arrayListMarcadores && valueMarcador ? $.grep(arrayListMarcadores, function(item){ return item.icon == arrayMarcador.img; })[0] : null;
                                    var styleMarcador = markerStyle && typeof markerStyle.style !== 'undefined' ? markerStyle.style : null;
                                        styleMarcador = styleMarcador !== null ? styleMarcador : '';
                                    if (targetEl != 'SemGrupo' && sourceEl != 'SemGrupo') {
                                        elemIconTag.attr('style', styleMarcador).attr('onmouseover', 'return infraTooltipMostrar(\''+valueText+'\',\''+titleSource+'\');').find('img').attr('src', arrayMarcador.img);
                                        elemIconTagTable.attr('style', styleMarcador).attr('onmouseover', 'return infraTooltipMostrar(\''+valueText+'\',\''+titleSource+'\');').find('img').attr('src', arrayMarcador.img);
                                    } else if (targetEl != 'SemGrupo' && sourceEl == 'SemGrupo') {
                                        var targetMarcador = '<a href="#controlador.php?acao=andamento_marcador_gerenciar&acao_origem=procedimento_controlar&acao_retorno=procedimento_controlar&id_procedimento='+id_protocolo+'" onmouseover="return infraTooltipMostrar(\''+valueText+'\',\''+titleSource+'\');" onmouseout="return infraTooltipOcultar();" data-color="true" style="'+styleMarcador+'"><img src="'+arrayMarcador.img+'" class="imagemStatus"></a>';
                                            elemIcons.append(targetMarcador);
                                            tableProc.find('tr[id="P'+id_protocolo+'"]').find('td').eq(1).append(targetMarcador);
                                    } else if (targetEl == 'SemGrupo') {
                                        elemIconTag.remove();
                                        elemIconTagTable.remove();
                                    }
                                    elemProc.find('i.fa-sync').remove();
                                    elemProc.prepend('<i class="fas fa-check-double verdeColor" style="margin-right: 5px;"></i>');
                                    setTimeout(function(){ elemProc.find('i.fa-check-double').remove(); }, 2000);
                                    getAllMarcadoresHome();
                                });
                            }

                    } else if (type == 'types' && sourceEl != targetEl && targetEl != 'SemGrupo') {
                        elemProc.prepend('<i class="fas fa-sync fa-spin cinzaColor" style="margin-right: 5px;"></i>');
                        initListTypesSEI(function (){
                            var tipoMatch = (typeof arrayListTypesSEI.selectTipoProc !== 'undefined') ? $.grep(arrayListTypesSEI.selectTipoProc, function(item){ return item.name == titleSource; })[0] : null;
                            var idTypeProc = tipoMatch ? tipoMatch.value : false;
                                if (idTypeProc) {
                                    updateDadosArvore('Consultar/Alterar Processo', 'selTipoProcedimento', idTypeProc, id_protocolo, function(){ 
                                        elemTypes.text(titleSource);
                                        elemProc.find('i.fa-sync').remove();
                                        elemProc.prepend('<i class="fas fa-check-double verdeColor" style="margin-right: 5px;"></i>');
                                        setTimeout(function(){ elemProc.find('i.fa-check-double').remove(); }, 2000);
                                    });
                                } else {
                                    elemProc.find('i.fa-sync').remove();
                                    elemProc.prepend('<i class="fas fa-times vemelhoColor" style="margin-right: 5px;"></i>');
                                    setTimeout(function(){ elemProc.find('i.fa-times').remove(); }, 2000);
                                }
                        });
                    } else if (sourceEl != targetEl) {
                        cancelMoveKanbanItensProc();
                    }
                    kanbanProcessosMoving = false;
                },
                dragendBoard: function(el){
                    updateOrderKanbanBoardProc();
                },
                boards: bords_list
            });
            /*
            autoScroll([
                    document.querySelector('.kanban-container')
                ],{
                    margin: 20,
                    maxSpeed: 5,
                    scrollWhenOutside: true,
                    autoScroll: function(){
                        //Only scroll when the pointer is down, and there is a child being dragged.
                        console.log('***', this.down, kanban.drake.dragging);
                        return this.down && kanban.drake.dragging;
                    }
                }
            );
            */

            kanbanProcessos = kanban;
            tableProc.hide();
            updateCountKanbanBoardProc();
        }
    }
}
function cancelMoveKanbanItensProc() {
    var itemMove = kanbanProcessosMoving;
    if (itemMove && $('#processosKanban').is(':visible')) {
        var item = jmespath.search(kanbanProcessos.options.boards,"[?id=='"+itemMove.source+"'] | [0].item | [?id=='"+itemMove.id+"'] | [0]");
            item = item == null ? false : item;
            kanbanProcessos.removeElement(item.id);
            kanbanProcessos.addElement(itemMove.source, item, itemMove.order);
    }
}
function pinKanbanItensProc(this_, id_protocolo) {
    var _this = $(this_);
    var _parent = _this.closest('.kanban-board');
    var _hasActive = _this.hasClass('newLink_active');
    var source = _parent.data('id');
    var order = (_hasActive) ? -1 : 0;
    var item = jmespath.search(kanbanProcessos.options.boards,"[?id=='"+source+"'] | [0].item | [?id=='"+id_protocolo+"'] | [0]");
        item = item == null ? false : item;
    if (item) {
        kanbanProcessos.removeElement(item.id);
        kanbanProcessos.addElement(source, item, order);
        
        if (!_hasActive) {
            $('#processosKanban .kanban-container').animate({scrollTop: 0}, 500, function() {
                $('#processosKanban .kanban-item[data-eid="'+id_protocolo+'"] .kanban-pinboard a').addClass('newLink_active').attr('onmouseover', 'return infraTooltipMostrar(\'Remover do topo\')');
                updateOrderKanbanBoardProc();
            });
        } else {
            $('#processosKanban .kanban-item[data-eid="'+id_protocolo+'"] .kanban-pinboard a').removeClass('newLink_active').attr('onmouseover', 'return infraTooltipMostrar(\'Fixar no topo\')');
            updateOrderKanbanBoardProc();
        }
        if (typeof infraTooltipOcultar === 'function') infraTooltipOcultar();
    }
}
function updateOrderKanbanBoardProc() {
    var type = storeGroupTablePro();
    var arrayOrder = $('#processosKanban .kanban-board').map(function(){
                        var _this = $(this);
                        var itens = _this.find('.kanban-item').map(function(i){ return {id: String($(this).data('eid')), order: i, pinboard: $(this).find('.kanban-pinboard a').hasClass('newLink_active') }  }).get();
                        var boards = {id: _this.data('id'), order: _this.data('order'), collapse: _this.data('collapse'), itens: itens};
                        return boards;
                    }).get();
    setOptionsPro('panelProcessosOrder_'+type, arrayOrder);
    // console.log('panelProcessosOrder_'+type, arrayOrder);
}
function collapseKanbanBoardProc(this_) {
    var _this = $(this_);
    var _parent = _this.closest('.kanban-board');
    var _data = _parent.data();
        _parent.attr('data-collapse', _data.collapse ? false : true).data('collapse', _data.collapse ? false : true);
        _parent.find('.kanban-collapse i').attr('class', _data.collapse ? 'fas fa-plus-square azulColor' : 'fas fa-minus-square cinzaColor');
        updateOrderKanbanBoardProc();
}
function updateCountKanbanBoardProc() {
    if (!kanbanProcessos || !kanbanProcessos.options || !$.isArray(kanbanProcessos.options.boards)) {
        return;
    }
    $.each(kanbanProcessos.options.boards, function(i, v){
        var elemBoard = $('#processosKanban .kanban-board[data-id="'+v.id+'"]');
        var countBoard = elemBoard.find('.kanban-item:visible').length;
        var iconCollapse = elemBoard.find('.kanban-collapse').length ? false : '<div class="kanban-collapse" onclick="collapseKanbanBoardProc(this)"><i class="fas fa-'+(v.collapse ? 'plus': 'minus')+'-square '+(v.collapse ? 'azulColor': 'cinzaColor')+'"></i></div>';
            elemBoard.attr('data-collapse',v.collapse).find('.kanban-title-board').attr('data-count',countBoard).after(iconCollapse);
    });
}
function addAcompanhamentoEspIcon() {
    var storeRecebimento = (typeof localStorageRestorePro !== 'undefined' &&  typeof localStorageRestorePro('configDataRecebimentoPro') !== 'undefined' && !$.isEmptyObject(localStorageRestorePro('configDataRecebimentoPro')) ) ? localStorageRestorePro('configDataRecebimentoPro') : [];
    var array_procedimentos = [];
    $('.acompanhamentoesp_icon').remove();
    $('#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado').find('a.processoVisualizado').each(function(i) {
      var acompanhamentoesp = getArrayProcessoRecebido($(this).attr('href')).acompanhamentoesp;
            acompanhamentoesp = (typeof acompanhamentoesp !== 'undefined' && acompanhamentoesp !== null && acompanhamentoesp != '') ? acompanhamentoesp : false;
        if (acompanhamentoesp) {
            $(this).closest('tr').find('td').eq(1).append('<a class="acompanhamentoesp_icon" onmouseover="return infraTooltipMostrar(\'Acompanhamento Especial\',\''+acompanhamentoesp+'\');" onmouseout="return infraTooltipOcultar();"><i class="fas fa-eye azulColor"><i></a>');
        }
    });
}
function quoteInlineJsText(text) {
    return '\'' + String(text || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\r?\n/g, '\\n') + '\'';
}
function getListaMarcadores(html) {
    var indexSelected = 0;
    var selectTags = html.find('#selMarcador').find('option').map(function(i, v){ 
                        if ($(this).is(':selected')) indexSelected = i-1;
                        if ($(this).text().trim() != '') { 
                            return {name: $(this).text().trim(), value: $(this).val(), img: $(this).attr('data-imagesrc') } 
                        } 
                    }).get();
        if (selectTags.length > 0) {
            setOptionsPro('listaMarcadores',selectTags);
            setOptionsPro('listaMarcadores_unidade',$('#selInfraUnidades').val());
        }
    return {array: selectTags, indexSelected: indexSelected};
}
function configDatesSwitchChangeHome(this_) {
    var _this = $(this_);
    var _parent = _this.closest('.ui-dialog');
    if (_this.is(':checked')) {
        _parent.find('.configDates_duesetdate .label i').attr('class','iconPopup fas fa-clock azulColor');
        _parent.find('.configDates_duesetdate .label span').text('Data de vencimento');
        _parent.find('.configDates_duesetdate .input span').show();
        _this.closest('tr').find('.iconSwitch').addClass('azulColor');
    } else {
        _parent.find('.configDates_duesetdate .label i').attr('class','iconPopup far fa-clock azulColor');
        _parent.find('.configDates_duesetdate .label span').text('Data inicial');
        _parent.find('.configDates_duesetdate .input span').hide();
        _this.closest('tr').find('.iconSwitch').removeClass('azulColor');
    }
}
function getMapaControleProcesso() {
    return $('#tblProcessosRecebidos').find('tbody tr').not('.tableHeader').not('.infraCaption').map(function(){
        let _this = $(this);
        let _td = _this.find('td');
        let id_procedimento = _this.attr('id');
            id_procedimento = typeof id_procedimento !== 'undefined' ? parseInt(id_procedimento.replace('P','')) : false;
        let protocolo = _td.eq(2).text();
        let link_atribuicao = _td.eq(3).find('a[href*="controlador.php?acao=procedimento_atribuicao_listar"]');
        let nome_atribuicao = (typeof getAtribuicaoDisplayLabel === 'function')
            ? getAtribuicaoDisplayLabel(link_atribuicao.attr('title'), link_atribuicao.text(), true)
            : link_atribuicao.attr('title');
            nome_atribuicao = typeof nome_atribuicao !== 'undefined' ? nome_atribuicao : false;
        let usuario_atribuicao = link_atribuicao.text().trim();
        let descricao = _td.eq(4).text();
        let tipo_processo = _td.eq(5).text();
        
        let _return = {
            id_procedimento: id_procedimento,
            protocolo: protocolo,
            atribuicao : nome_atribuicao ? {nome: nome_atribuicao, usuario: usuario_atribuicao} : false,
            descricao : descricao,
            tipo_processo: tipo_processo
           }
        return _return;
    }).get();
}
function updateCountIconDist() {
    var counter = $('#distribAutTablePro').find('input[type="checkbox"]:checked').length;
    if (counter > 0) {
        $('.iconConfig_distrib').find('.fa-layers-counter').text(counter).show();
    } else {
        $('.iconConfig_distrib').find('.fa-layers-counter').hide();
    }
}

/* txtPadrao_setConfig({
    nome: 'DISTRIBUICAO_AUTOMATICA_SEIPRO',
    descricao: `Configura\u00E7\u00F5es interna para distribui\u00E7\u00E3o autom\u00E1tica de processos (criado pelo SEI Pro)`,
    conteudo: `<p>[{"tipo_processo": "Material: Baixa de Material de Consumo", "atribuicao": "Pedro.Soares"},{"tipo_processo": "Gest\u00E3o e Controle: Execu\u00E7\u00E3o de Auditoria Interna", "atribuicao": "Pedro.Soares"}]</p>`
}); */

// var conteudoDist = await txtPadrao_getConfig('DISTRIBUICAO_AUTOMATICA_SEIPRO');
// console.log(conteudoDist);

var txtPadrao_getList = async () => {
    var htmlTxtPadrao = await $.get(urlTxtPadrao);
    var listTxtPadrao = $(htmlTxtPadrao).find('#divInfraAreaTabela table.infraTable tr').map(function(){
        var td = $(this).find('td');
        var link = td.eq(4).find('a');
        var id = td.eq(1).text();
        var name = td.eq(2).text();
        var description = td.eq(3).text();
        if (name) {
            return {
                id: id,
                name: name,
                description: description,
                view: link.eq(0).attr('href'),
                edit: link.eq(1).attr('href')
            }
        }
    }).get();
    return listTxtPadrao;
}
var txtPadrao_newLink = async () => {
    var htmlTxtPadrao = await $.get(urlTxtPadrao);
    var urlNew = $(htmlTxtPadrao).find('#btnNovo').attr('onclick');
        urlNew = typeof urlNew !== 'undefined' && urlNew.indexOf("'") !== -1 ? urlNew.split("'")[1] : false;
    return urlNew;
}
var txtPadrao_getConfig = async (idTxt) => {
    var htmlTxtPadrao = await $.get(urlTxtPadrao);
    var urlView = $(htmlTxtPadrao).find('.infraAreaTabela tr').map(function(){ if ($(this).find('td').eq(2).text() == '[_'+idTxt+']') return $(this).find('a[href*="acao=texto_padrao_interno_consultar"]').attr('href') }).get();
        urlView = typeof urlView !== 'undefined' && urlView !== null && urlView.length ? urlView[0] : false;

    if (urlView) {
        var htmlTxtPadrao = await $.get(urlView);
        var conteudoTxtPadrao = $(htmlTxtPadrao).find('#txaConteudo').val();
            conteudoTxtPadrao = typeof conteudoTxtPadrao !== 'undefined' && conteudoTxtPadrao !== null && conteudoTxtPadrao.trim() != '' ? $(conteudoTxtPadrao).text() : false;
            conteudoTxtPadrao = conteudoTxtPadrao && isJson(conteudoTxtPadrao) ? JSON.parse(conteudoTxtPadrao) : false;
            conteudoTxtPadrao = conteudoTxtPadrao && $.isArray(conteudoTxtPadrao) ? conteudoTxtPadrao : false;
        return conteudoTxtPadrao;
    } else {
        return false;
    };
}
var txtPadrao_setConfig = async (data) => {
    var htmlTxtPadrao = await $.get(urlTxtPadrao);
    var urlEdit = $(htmlTxtPadrao).find('.infraAreaTabela tr').map(function(){ if ($(this).find('td').eq(2).text() == '[_'+data.nome+']') return $(this).find('a[href*="acao=texto_padrao_interno_alterar"]').attr('href') }).get();
        urlEdit = typeof urlEdit !== 'undefined' && urlEdit !== null && urlEdit.length ? urlEdit[0] : false;
    var urlPage = urlEdit ? urlEdit : await txtPadrao_newLink();
    var htmlLink = await $.get(urlPage);
    var form = $(htmlLink).find('#frmTextoPadraoInternoCadastro');
    var urlForm = form.attr('action');
    var createConfig = await txtPadrao_createConfig(form, urlForm, data);
    return createConfig;
}
var txtPadrao_createConfig = async (form, urlForm, data) => {
    let params = {};
        form.find("input[type=hidden]").each(function () {
            if ($(this).attr('name') && $(this).attr('id').includes('hdn')) {
                params[$(this).attr('name')] = $(this).val();
            }
        });
        form.find('input[type=text]').each(function () {
            if ($(this).attr('id') && $(this).attr('id').includes('txt')) {
                params[$(this).attr('id')] = $(this).val();
            }
        });
        params.txtNome = '[_'+data.nome+']';
        params.txtDescricao = data.descricao;
        params.txaConteudo = '<p>'+JSON.stringify(data.conteudo)+'</p>';
        params.sbmCadastrarTextoPadraoInterno = 'Salvar';
        params.sbmAlterarTextoPadraoInterno = 'Salvar';
    
    var postData = '';
    for (var k in params) {
        if (postData !== '') postData = postData + '&';
        var valor = (k=='txtDescricao' || k=='txaConteudo') ? escapeComponent(params[k]) : params[k];
            postData = postData + k + '=' + valor;
    }
    
    var htmlTxtPadraoCreated = await $.ajax({
        method: 'POST',
        url: urlForm,
        data: postData,
        contentType: 'application/x-www-form-urlencoded; charset=ISO-8859-1'
    });
    return htmlTxtPadraoCreated;
}
var getTableDistribAutomatica = async () => {
    var dadosDistribuicao = await txtPadrao_getConfig('DISTRIBUICAO_AUTOMATICA_SEIPRO');
        window.dadosDistribuicaoAut = dadosDistribuicao;
    var htmlBox =       '<div id="boxDistribAut" class="tabelaPanelScroll" style="margin-top: 10px;height: 400px;">'+
                        '               <a class="newLink iconConfig_distrib" onclick="getAtribuicaoAutomatica(this)" onmouseover="return infraTooltipMostrar(\'Atribuir processos\');" onmouseout="return infraTooltipOcultar();" style="margin: 0px; font-size: 14pt;">'+
                        '                   <span class="fa-layers fa-fw">'+
                        '                       <i class="fas fa-user-friends"></i>'+
                        '                       <span class="fa-layers-counter" style="display:none"></span>'+
                        '                   </span>'+
                        '                   <span style="font-size: 80%;">Atribuir Processos</span>'+
                        '               </a>'+
                        '               <a class="newLink iconConfig_distrib" onclick="setAtribuicaoAutomatica(this)" onmouseover="return infraTooltipMostrar(\'Configura\u00E7\u00F5es de atribui\u00E7\u00E3o\');" onmouseout="return infraTooltipOcultar();" style="margin: 0px;font-size: 14pt;right: 280px;position: absolute;">'+
                        '                   <i class="fas fa-cog"></i>'+
                        '               </a>'+
                        '   <table id="distribAutTablePro" style="margin-top: 5px; font-size: 9pt !important;width: 100%;" class="seiProForm tableAtividades tableDialog tableInfo tableZebra">'+
                        '        <thead>'+
                        '            <tr class="tableHeader">'+
                        '                <th class="tituloControle " width="5%" align="center">'+
	                        '                   <span class="lblInfraCheck" aria-hidden="true"></span>'+
                        '                   <a id="lnkInfraCheck" onclick="getSelectAllTr(this, \'SemGrupo\');" onmouseover="updateTipSelectAll(this)" onmouseenter="return infraTooltipMostrar(\'Selecionar Todos\')" onmouseout="return infraTooltipOcultar();">'+
                        '                       <img src="/infra_css/imagens/check.gif" id="imgRecebidosCheck" class="infraImg">'+
                        '                   </a>'+
                        '                </th>'+
                        '                <th class="tituloControle" style="text-align: center; width: 180px;">Processo</th>'+
                        '                <th class="tituloControle" style="text-align: center;font-weight: bold;">Descri\u00E7\u00E3o</th>'+
                        '                <th class="tituloControle" style="text-align: center;font-weight: bold;">Tipo</th>'+
                        '                <th class="tituloControle" style="text-align: center;font-weight: bold;">Atualmente atribu\u00EDdo</th>'+
                        '                <th class="tituloControle" style="text-align: center;font-weight: bold;">Nova atribui\u00E7\u00E3o</th>'+
                        '            </tr>'+
                        '        </thead>'+
                        '        <tbody>';
        $.each(getMapaControleProcesso(),function(i, v){
            let distribuicao = dadosDistribuicaoAut ? dadosDistribuicaoAut.filter(function(p){ return p.tipo_processo == v.tipo_processo }) : [];
            let nova_atribuicao = distribuicao.length ? distribuicao[0] : false;
            let atribuicao = v.atribuicao ? v.atribuicao.usuario : '';
            htmlBox +=  '   <tr style="text-align: left;" data-tagname="SemGrupo">'+
                        '       <td class="tituloControle" style="text-align:center;">'+
                        '           <input type="checkbox" onclick="updateCountIconDist()" id="chkDistrib_'+v.id_procedimento+'" '+(nova_atribuicao && nova_atribuicao.atribuicao != atribuicao ? 'checked' : '')+' '+(!nova_atribuicao ? 'disabled' : '')+' name="chkDistrib_'+v.id_procedimento+'" value="'+v.id_procedimento+'">'+
                        '       </td>'+
                        '       <td>'+
                        '           <a style="margin-left: 5px;" href="'+url_host+'?acao=procedimento_trabalhar&id_procedimento='+v.id_procedimento+'" target="_blank">'+
                        '               <span class="bLink">'+
                        '                   '+v.protocolo+
                        '                   <i class="fas fa-external-link-alt bLink" style="font-size: 90%; text-decoration: underline;"></i>'+
                        '               </span>'+
                        '           </a>'+
                        '       </td>'+
                        '       <td>'+v.tipo_processo+'</div>'+
                        '       <td>'+v.descricao+'</div>'+
                        '       <td>'+atribuicao+'</td>'+
                        '       <td>'+(nova_atribuicao ? nova_atribuicao.atribuicao : '')+'</td>'+
                        '   </tr>';
        });
        htmlBox +=      '   </table>'+
                        '</div>';
    resetDialogBoxPro('dialogBoxPro');
    dialogBoxPro = $('#dialogBoxPro')
        .html('<div class="dialogBoxDiv">'+htmlBox+'</div>')
        .dialog({
            title: 'Distribui\u00E7\u00E3o Autom\u00E1tica de Processos',
            width: $('body').width()-300,
            height: 450,
            open: function() { 
                setTimeout(function(){ 
                    var distribTable = $('#distribAutTablePro');
                        distribTable.tablesorter({
                            sortLocaleCompare : true,
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
                                5: { filter: true }
                            }
                        }).on("filterEnd", function (event, data) {
                            checkboxRangerSelectShift();
                            var caption = $(this).find("caption").eq(0);
                            var tx = caption.text();
                                caption.text(tx.replace(/\d+/g, data.filteredRows));
                                $(this).find("tbody > tr:visible > td > input").prop('disabled', false);
                                $(this).find("tbody > tr:hidden > td > input").prop('disabled', true);
                        });
                        initPanelResize('#boxDistribAut', 'distribPro');

                    var filterDistrib = distribTable.find('.tablesorter-filter-row').get(0);
                    if (typeof filterDistrib !== 'undefined') {
                        var observerFilterDistrib = new MutationObserver(function(mutations) {
                            var _this = $(mutations[0].target);
                            var _parent = _this.closest('table');
                            var iconFilter = _parent.find('.filterTableDistrib button');
                            var checkIconFilter = iconFilter.hasClass('active');
                            var hideme = _this.hasClass('hideme');
                            if (hideme && checkIconFilter) {
                                iconFilter.removeClass('active');
                            }
                            updateCountIconDist();
                        });
                        setTimeout(function(){ 
                            var htmlfilterDistrib =    '<div class="btn-group filterTableDistrib" role="group" style="right: 45px;top: 18px;z-index: 999;position: absolute;">'+
                                                        '   <button type="button" onclick="downloadTablePro(this)" data-icon="fas fa-download" style="padding: 0.1rem .5rem; font-size: 9pt;" data-value="Baixar" class="btn btn-sm btn-light">'+
                                                        '       <i class="fas fa-download" style="padding-right: 3px; cursor: pointer; font-size: 10pt; color: #888;"></i>'+
                                                        '       <span class="text">Baixar</span>'+
                                                        '   </button>'+
                                                        '   <button type="button" onclick="copyTablePro(this)" data-icon="fas fa-copy" style="padding: 0.1rem .5rem; font-size: 9pt;" data-value="Copiar" class="btn btn-sm btn-light">'+
                                                        '       <i class="fas fa-copy" style="padding-right: 3px; cursor: pointer; font-size: 10pt; color: #888;"></i>'+
                                                        '       <span class="text">Copiar</span>'+
                                                        '   </button>'+
                                                        '   <button type="button" onclick="filterTablePro(this)" style="padding: 0.1rem .5rem; font-size: 9pt;" data-value="Pesquisar" class="btn btn-sm btn-light '+(distribTable.find('tr.tablesorter-filter-row').hasClass('hideme') ? '' : 'active')+'">'+
                                                        '       <i class="fas fa-search" style="padding-right: 3px; cursor: pointer; font-size: 10pt;"></i>'+
                                                        '       Pesquisar'+
                                                        '   </button>'+
                                                        '</div>';
                                distribTable.find('thead .filterTableDistrib').remove();
                                distribTable.find('thead').prepend(htmlfilterDistrib);
                                observerFilterDistrib.observe(filterDistrib, {
                                    attributes: true
                                });
                                distribTable.find('.tablesorter-filter-row input.tablesorter-filter').eq(2).attr('type','date');
                                updateCountIconDist(filterDistrib);
                        }, 500);
                    }
                }, 500);
                if (typeof $().visible == 'undefined') $.getScript(URL_SPRO+"js/lib/jquery-visible.min.js");
            },
            close: function() { 
                $('#boxDistribAut').remove();
                resetDialogBoxPro('dialogBoxPro');
            }
    });

}
function setAtribuicaoAutomatica() {

    var htmlBox =       '<div id="boxDistribAut" class="tabelaPanelScroll" style="margin-top: 10px;height: 400px;">'+
                        '</div>';
                        
    resetDialogBoxPro('dialogBoxPro');
    dialogBoxPro = $('#dialogBoxPro')
        .html('<div class="dialogBoxDiv">'+htmlBox+'</div>')
        .dialog({
            title: 'Distribui\u00E7\u00E3o Autom\u00E1tica de Processos',
            width: $('body').width()-300,
            height: 450,
            open: function() { 
            },
            close: function() { 
                $('#boxDistribAut').remove();
                resetDialogBoxPro('dialogBoxPro');
            }
    });
}
// Reconcilia a soma de colspans do cabeçalho com o nº de tds do corpo (a coluna "Prazos"
// desalinha porque o cabeçalho do SEI usa colspan e outras features [anotação] adicionam th
// sem casar com o corpo). Ajusta o th principal (maior colspan) de cada tabela.
function getAllMarcadoresHome() {
    var arrayMarcadores = [];
    $('#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado').find('tr').each(function(){
        var _processo = $(this).find('a[href*="acao=procedimento_trabalhar"]');
        var _marcador = $(this).find('a[href*="acao=andamento_marcador_gerenciar"]');

        if (_processo.length > 0 && _marcador.length > 0) {

            var _tags = (typeof _marcador.attr('onmouseover') !== 'undefined') ? _marcador.attr('onmouseover').match(RegExp(/(?<=(["']))(?:(?=(\\?))\2.)*?(?=\1)/, 'g')) : false;
            var tagName = (_tags && _tags !== null && _tags.length > 0 && _tags[2] != '') ? _tags[2] : false;
            var textName = (_tags && _tags !== null && _tags.length > 0 && _tags[0] != '') ? _tags[0] : false;

            arrayMarcadores.push({
                id_procedimento: getParamsUrlPro(_processo.attr('href')).id_procedimento,
                icon: _marcador.find('img').attr('src'),
                style: _marcador.attr('style'),
                tag: tagName,
                name: textName
            });
        }
    });
    sessionStorageStorePro('dadosMarcadoresProcessoPro', arrayMarcadores);
}
function initAllMarcadoresHome(TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    if (typeof getParamsUrlPro !== 'undefined') { 
        getAllMarcadoresHome();
    } else {
        setTimeout(function(){ 
            initAllMarcadoresHome(TimeOut - 100); 
            if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage'))console.log('Reload initAllMarcadoresHome'); 
        }, 500);
    }
}
// initNaoVisualizadoPro migrada para src/features/nao-lido/view.js (feature
// marcar_naolido). Global preservado via aliasGlobal no bundle js/sei-pro-nao-lido.js.
function initUrgentePro() {
    $('a div.urgentePro').remove();
    $('a[href*="controlador.php?acao=procedimento_trabalhar"][onmouseover*="(URGENTE)"]')
        .prepend('<div class="urgentePro"></div>')
        .addClass('urgentePro')
        .closest('tr')
        .addClass('urgentePro');
}

function initUploadFilesInProcess() {
    if (typeof Dropzone === 'function') {
        setUploadFilesInProcess();
    } else {
        $.getScript(URL_SPRO+"js/lib/dropzone.min.js",function(){ setUploadFilesInProcess() });
    }
}
function getListIdProtocoloSelected() {
    var tableProc = $('#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado');
    var listId = tableProc.find(elemCheckbox+':checked').map(function(){ return $(this).val() }).get();
    if (listId.length === 0) {
        listId = tableProc.find('tr.infraTrMarcada').map(function(){
            var value = $(this).find(elemCheckbox).val();
            if (typeof value !== 'undefined' && value !== null && value !== '') {
                return value;
            }
            return $(this).attr('id') ? $(this).attr('id').replace(/^P/, '') : false;
        }).get();
    }
    return (listId.length > 0) ? listId : false;
}
function setUploadFilesInProcess(load_upload = true) {
    var listId = getListIdProtocoloSelected();
    if (listId.length > 0) {
        $('#frmCheckerProcessoPro').remove();
        loadIframeProcessUpload(listId[0], load_upload);
    }
}
function loadIframeProcessUpload(idProcedimento, load_upload = true) {
    if ( $('#frmCheckerProcessoPro').length == 0 ) { getCheckerProcessoPro(); }
    
    var url = 'controlador.php?acao=procedimento_trabalhar&id_procedimento='+idProcedimento;
    $(divComandos+' .iconUpload_new').addClass('iconLoading');
    
    $('#frmCheckerProcessoPro').attr('src', url).unbind().on('load', function(){
        var ifrArvore = $('#frmCheckerProcessoPro').contents().find('#ifrArvore');
            contentW = (typeof getIframeArvoreWindow === 'function') ? getIframeArvoreWindow() : (typeof ifrArvore[0] !== 'undefined' && ifrArvore[0] ? ifrArvore[0].contentWindow : null);
            $(divComandos+' .iconUpload_new').removeClass('iconLoading');
            if (load_upload) {
                getUploadFilesInProcess();
            } else {
                contentW.sendUploadArvore('upload', false, arvoreDropzone, $(containerUpload));
            }
    });
}
function completeIdProtocoloSelected() {
    var listId = getListIdProtocoloSelected();
        $('#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado').find('tr#P'+listId[0]).find(elemCheckbox+':checked').trigger('click');
}
function nextUploadFilesInProcess() {
    completeIdProtocoloSelected();

    if (getListIdProtocoloSelected()) {
        cleanUploadFilesInProcess();
        setUploadFilesInProcess(false);
    } else {
        removeUploadFilesInProcess();
        alertaBoxPro('Sucess', 'check-circle', 'Arquivos enviados com sucesso!');
    }
}
function removeUploadFilesInProcess() {
    $('#uploadListPro').remove();
    $('.dz-infoupload-home').remove();
    $(containerUpload).data('index',0);
    if (typeof arvoreDropzone !== 'undefined' && typeof arvoreDropzone.destroy === 'function') arvoreDropzone.destroy();
    $(containerUpload).unbind('click');
}
function onClickRemoveDragHoverHome() {
    $(containerUpload).on('click', function(){
        if ($(this).hasClass('dz-drag-hover')) {
            $(this).removeClass('dz-drag-hover');
            $(containerUpload).unbind('click');
        }
    })
}
function cleanUploadFilesInProcess() {
    $('#uploadListPro').html('');
    $(containerUpload).data('index',0);
    if (typeof arvoreDropzone.files !== 'undefined' && arvoreDropzone.files.length) {
        $.each(arvoreDropzone.files, function(i, v){
            arvoreDropzone.addFile(v);
        });
    }
}
function getUploadFilesInProcess() {
    var _containerUpload = $(containerUpload);
    var html =  '<div id="uploadListPro"></div>'+
                '<div id="dz-infoupload" class="dz-infoupload dz-infoupload-home">'+
                '   <span class="text">Arraste e solte aquivos aqui<br>ou clique para selecionar</span>'+
                '   <span class="cancel" onclick="dropzoneCancelInfo(event); removeUploadFilesInProcess(); return false;">'+
                '       <i class="far fa-times-circle icon"></i>'+
                '       <span class="label">CANCELAR</span>'+
                '   </span>'+
                '</div>';

    if (_containerUpload.find('.dz-infoupload').length == 0) {
        _containerUpload.find(divComandos).after(html).data('index', 0);
    }

    arvoreDropzone = new Dropzone(containerUpload, {
        url: url_host,
        createImageThumbnails: false,
        autoProcessQueue: false,
        parallelUploads: 1,
        clickable: '#dz-infoupload',
        previewsContainer: '#uploadListPro',
        timeout: 900000,
        paramName: 'filArquivo',
        renameFile: function (file) {
            return parent.removeAcentos(file.name).replace(/[&\/\\#+()$~%'":*?<>{}]/g,'_');
        },
        previewTemplate:    '<div class="dz-preview dz-file-preview">'+
                            '   <div class="dz-details">'+
                            '       <span class="dz-error-mark"><i data-dz-remove class="fas fa-trash vermelhoColor" style="margin: 5px 8px;cursor: pointer; font-size: 10pt;"></i></span>'+
                            '       <span class="dz-error-message"><span data-dz-errormessage></span></span>'+
                            '       <span class="dz-progress">'+
                            '           <span class="dz-upload" data-dz-uploadprogress></span>'+
                            '       </span>'+
                            '       <a id="anchorImgID" data-img="'+(parent.isNewSEI ? 'svg/documento_pdf.svg' : 'imagens/pdf.gif')+'" style="margin-left: -4px;" class="clipboard" title="Clique para copiar o n\u00FAmero do protocolo para a \u00E1rea de transfer\u00EAncia">'+
                            '           <img class="dz-link-icon" src="/infra_css/'+(parent.isNewSEI ? 'svg/documento_pdf.svg' : 'imagens/pdf.gif')+'" align="absbottom" id="iconID">'+
                            '       </a>'+
                            '       <span class="dz-progress-mark"><i class="fas fa-cog fa-spin" style="color: #017FFF; font-size: 10pt;"></i></span>'+
                            '       <a id="anchorID" target="'+ifrVisualizacao_+'" class="dz-filename">'+
                            '           <span data-dz-name title="" id="spanID"></span>'+
                            '       </a>'+
                            '       <span class="dz-size" data-dz-size></span>'+
                            '       <span class="dz-remove" data-dz-remove><i class="fas fa-trash-alt vermelhoColor" style="cursor:pointer"></i></span>'+
                            '   </div>'+
                            '</div>',
        dictDefaultMessage: "Solte aqui os arquivos para enviar",
        dictFallbackMessage: "Seu navegador n\u00E3o suporta uploads de arrastar e soltar.",
        dictFallbackText: "Por favor, use o formul\u00E1rio abaixo para enviar seus arquivos como antigamente.",
        dictFileTooBig: "O arquivo \u00E9 muito grande ({{filesize}}MB). Tamanho m\u00E1ximo permitido: {{maxFilesize}}MB.",
        dictInvalidFileType: "Voc\u00EA n\u00E3o pode fazer upload de arquivos desse tipo.",
        dictResponseError: "O servidor respondeu com o c\u00F3digo {{statusCode}}.",
        dictCancelUpload: "Cancelar envio",
        dictCancelUploadConfirmation: "Tem certeza de que deseja cancelar este envio?",
        dictRemoveFile: "Remover arquivo",
        dictMaxFilesExceeded: "Voc\u00EA s\u00F3 pode fazer upload de {{maxFiles}} arquivos."          
    });

    arvoreDropzone.on("addedfiles", function(files) {
        dropzoneCancelInfo();
        // console.log(arvoreDropzone.files);
        if (verifyConfigValue('sortbeforeupload') && arvoreDropzone.getQueuedFiles().length > 1) {
            sortUploadArvore();
        } else {
            contentW.sendUploadArvore('upload', false, arvoreDropzone, _containerUpload);
        }
    }).on("addedfile", function(file) {
        // console.log('Files', file);
        //dropzoneNormalizeImg(file);
    }).on("removedfile", function(file) {
        //dropzoneNormalizeImg(file);
    }).on('success', function(result) {
        var params = arvoreDropzone.options.params;
        var response = result.xhr.response.split('#');
            params.paramsForm.hdnAnexos = encodeUrlUploadArvore(response, params);

        var postData = '';
        for (var k in params.paramsForm) {
            if (postData !== '') postData = postData + '&';
            var valor = (k=='hdnAnexos') ? params.paramsForm[k] : escapeComponent(params.paramsForm[k]);
                valor = (k=='txtNumero') ? parent.encodeURI_toHex(params.paramsForm[k].normalize('NFC')) : valor;                
                postData = postData + k + '=' + valor;
        }
        params.paramsForm = postData;
        contentW.sendUploadArvore('save', params, arvoreDropzone, _containerUpload);
    }).on('error', function(e) {
        contentW.sendUploadArvore('upload', false, arvoreDropzone, _containerUpload);
    }).on('dragleave', function(e) {
        _containerUpload.addClass('dz-drag-hover');
        onClickRemoveDragHoverHome();
    });

    var extUpload = localStorageRestorePro('arvoreDropzone_acceptedFiles');
    if (extUpload !== null) {
        arvoreDropzone.options.acceptedFiles = extUpload;
    }
}
function sendUploadArvoreHomeStart() {
    contentW.sendUploadArvore('upload', false, arvoreDropzone, $(containerUpload));
}
function sortUploadArvore() {
    var htmlUpload =    '<div id="divUploadDoc" class="panelDadosArvore" style="margin: 15px 0; padding: 1.2em 0 0 0 !important;">'+
                        '   <a style="cursor:pointer;" onclick="sendUploadArvoreHomeStart();" class="newLink newLink_confirm">'+
                        '       <i class="fas fa-upload azulColor"></i>'+
                        '       <span style="font-size:1.2em;color: #fff;"> Enviar documentos</span>'+
                        '   </a>'+
                        '</div>';

    $('#divUploadDoc').remove();
    $('#uploadListPro').sortable({
        items: '.dz-file-preview',
        cursor: 'grabbing',
        handle: '.dz-filename',
        forceHelperSize: true,
        opacity: 0.5,
        update: function(event, ui) {
            var files = arvoreDropzone.getQueuedFiles();
            files.sort(function(a, b){
                return ($(a.previewElement).index() > $(b.previewElement).index()) ? 1 : -1;
            })
            arvoreDropzone.removeAllFiles();
            arvoreDropzone.handleFiles(files);
        }
    }).after(htmlUpload);
}
function storeLinkUsuarioSistema() {
    if (typeof setOptionsPro !== 'undefined') setOptionsPro('usuarioSistema',$('#lnkUsuarioSistema').attr('title'));
}
function storeVersionSEI() {
    if (typeof getSeiVersionPro !== 'undefined' && getSeiVersionPro()) 
        getSeiVersionPro();
    else if (typeof setSeiVersionPro !== 'undefined') setSeiVersionPro();
}
function initSeiPro() {
    if (typeof checkHostLimit !== 'function') {
        setTimeout(function(){
            initSeiPro();
            if (typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage')) console.log('Reload initSeiPro checkHostLimit');
        }, 300);
        return;
    }
	if ( $('#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado').length > 0 ) {
        bindProcessoPaginacaoSuperiorVisibility();
        if (typeof URL_SPRO !== 'undefined' && typeof SimpleTableCellEdition === 'undefined') $.getScript((URL_SPRO+"js/lib/jquery-table-edit.min.js"));
        if (typeof URL_SPRO !== 'undefined' && (typeof moment === 'undefined' || typeof moment.duration === 'undefined')) $.getScript((URL_SPRO+"js/lib/moment-duration-format.min.js"));
        initTableSorterHome();
        insertGroupTable();
        replaceSelectAll();
        // Migrado p/ ESM (monitorados/boot.js); alias provido pelo monitorados.bundle
        // (co-injetado nestes blocos). Guarda por segurança de ordem de carga.
        if (typeof initPanelMonitorados === 'function') initPanelMonitorados();
        checkLoadConfigSheets();
        insertDivPanel();
        setTimeout(() => {
            initNewTabProcesso();
            syncHomeProcessCaption();
        }, 2000);
        forceOnLoadBody();
        observeAreaTela();
        // Feature migrada p/ src/features/anotacao-controle (bundle isolado).
        if (window.SeiPro && SeiPro.features && SeiPro.features.anotacaoControle) SeiPro.features.anotacaoControle.init();
        initReplaceNewIcons();
        initControlePrazo();
        initViewEspecifacaoProcesso(); 
        initFullnameAtribuicao();
        initFaviconNrProcesso();
        addAcompanhamentoEspIcon();
        initAllMarcadoresHome();
        initUrgentePro();
        initNaoVisualizadoPro();
        if (typeof initProcessNotificationsPro === 'function') initProcessNotificationsPro();
        storeLinkUsuarioSistema();
        storeVersionSEI();
        if (sessionStorage.getItem('configHost_Pro') === null && typeof getConfigHost !== 'undefined') getConfigHost();
	} else if ( $("#ifrArvore").length > 0 ) {
        if (!checkHostLimit()) initDadosProcesso();
        initObserveUrlChange();
        checkLoadConfigSheets();
        //observeHistoryBrowserPro();
	}
    initReloadModalLink();
    if (typeof initSmartSignatureSelectionPro === 'function') initSmartSignatureSelectionPro();
    // #ancLiberarMeusProcessos: mesmo bind de setTableSorterHome acima (ver comentário lá
    // — testado ao vivo, SEI não liga handler nesse botão; fix via DOM puro, sem cruzar
    // mundos). Religar aqui também replica o comportamento original do legado (que tinha
    // o mesmo bind duplicado nos dois pontos) — inofensivo, pois o 1º clique já navega
    // (form.submit()) antes do 2º handler ter efeito.
    // #ancLiberarMarcador/#ancLiberarTipoProcedimento/#ancLiberarTipoPrioridade ficam
    // de fora por ora: corpos de filtrarMarcador/filtrarTipoProcedimento/filtrarTipoPrioridade
    // são bem maiores (838-881 chars) e não foram lidos com segurança — não replicar
    // 'no escuro'. Gap documentado, não corrigido.
    $('#ancLiberarMeusProcessos').click(function (e) {
        e.preventDefault();
        var hdn = document.getElementById('hdnMeusProcessos');
        var form = document.getElementById('frmProcedimentoControlar');
        if (hdn && form) {
            hdn.value = 'T';
            form.submit();
        }
    });
}
$(document).ready(function () { initSeiPro() });
