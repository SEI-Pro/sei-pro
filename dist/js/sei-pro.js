var actionTest = 'ondblclick="removeCacheGroupTable(this)"';
var totalSecondsTest = 0;
var totalSecondsTestText = '';
var timerTest;
var tableHomePro = [];

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
            console.log('Reload handleClientLoadPro'); 
        }, 500);
    }
}

//// Agrupamento de lista de processos
function getListTypes(acaoType) {
    var orderbyTableGroup = getOptionsPro('orderbyTableGroup') ? getOptionsPro('orderbyTableGroup') : 'asc';
    var arrayTag = [''];
    if (acaoType == 'tags' || acaoType == 'deadline') {
    	var acaoType_ = 'acao=andamento_marcador_gerenciar';
	} else if (acaoType == 'types') {
		var acaoType_ = 'acao=procedimento_trabalhar';
    } else if (acaoType == 'users') {
		var acaoType_ = 'acao=procedimento_atribuicao_listar';
    } else if (acaoType == 'checkpoints') {
		var acaoType_ = 'acao=andamento_situacao_gerenciar';
    } else if (acaoType == 'arrivaldate' || acaoType == 'acessdate' || acaoType == 'senddate' || acaoType == 'senddepart' || acaoType == 'createdate') {
		var acaoType_ = 'acao=procedimento_trabalhar';
	}
    $('#divRecebidos').find('table tr').attr('data-tagname', 'SemGrupo');
    $('#divRecebidos').find('table a').each(function(index){
        var link = $(this).attr('href');
        if ( typeof link !== 'undefined' && link.indexOf(acaoType_) !== -1 ) {
            var tag = ( acaoType == 'tags' || acaoType == 'types' ) ? $(this).attr('onmouseover').split("','")[1].replace("');","") : '';
                tag = ( acaoType == 'users' ) ? $(this).text() : tag;
                tag = ( acaoType == 'checkpoints' ) ? $(this).attr('onmouseover').split("'")[1] : tag;
                tag = ( acaoType == 'senddepart' ) ? getArrayProcessoRecebido($(this).attr('href')).unidadesendfull : tag;
                tag = ( acaoType == 'deadline' ) ? $(this).closest('tr').find('td.prazoBoxDisplay .dateboxDisplay').data('time-sorter') : tag;
                tag = ( (acaoType == 'deadline' || acaoType == 'senddepart') && typeof tag === 'undefined') ? '' : tag;
                tag = ( acaoType == 'deadline' && tag != '') ? moment(tag, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY HH:mm') : tag;
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
                        dataRecebido =  (acaoType == 'deadline') ? $(this).closest('tr').find('td.prazoBoxDisplay .dateboxDisplay').data('time-sorter') : dataRecebido;
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
    $('#divRecebidosAreaTabela').addClass('tabelaPanelScroll');
    
    var tbody = $('#divRecebidos tbody');
    tbody.find('tr').each(function() {
        var dataRecebido = ($(this).find('td').eq(2).find('a').length) ? getArrayProcessoRecebido($(this).find('td').eq(2).find('a').attr('href')) : '';
            dataRecebido = (dataRecebido != '' && type == 'arrivaldate') ? moment(dataRecebido.datahora, 'YYYY-MM-DD HH:mm:ss').unix() : dataRecebido;
            dataRecebido = (dataRecebido != '' && type == 'acessdate') ? moment(dataRecebido.datetime, 'YYYY-MM-DD HH:mm:ss').unix() : dataRecebido;
            dataRecebido = (dataRecebido != '' && type == 'createdate') ? moment(dataRecebido.datageracao, 'YYYY-MM-DD HH:mm:ss').unix() : dataRecebido;
            dataRecebido = (dataRecebido != '' && (type == 'senddate' || type == 'senddate')) ? moment(dataRecebido.datesend, 'YYYY-MM-DD HH:mm:ss').unix() : dataRecebido;
        if (dataRecebido != '' && !isNaN(dataRecebido)) { $(this).attr('data-order', dataRecebido) }
    }).sort(function(a, b) {
      var tda = $(a).data('order');
      var tdb = $(b).data('order');
      return (type == 'arrivaldate' || type == 'senddate' || type == 'senddepart' || type == 'createdate') 
                ? tda > tdb 
                    ? (orderbyDesc ? 1 : -1) 
                    : tda < tdb 
                        ? (orderbyDesc ? -1 : 1) : 0 
                : tda > tdb 
                    ? (orderbyDesc ? -1 : 1) 
                    : tda < tdb 
                        ? (orderbyDesc ? 1 : -1) : 0;
    }).appendTo(tbody);
    initPanelResize('#divRecebidosAreaTabela.tabelaPanelScroll', 'recebidosPro');
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
        var checkbox = $(this_).closest('table').find(tagname_select).find('input[type=checkbox]');
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
        var checkbox = $(this_).closest('table').find(tagname_select).find('input[type=checkbox]:checked');
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
        infraTooltipMostrar(text);
    } else {
        infraTooltipOcultar();
    }
}
function replaceSelectAll() {
    var tableProc = $('#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado');
    if ( tableProc.length > 0 ) {
        tableProc.find('#lnkInfraCheck').after('<a onclick="setSelectAllTr(this);" onmouseover="updateTipSelectAll(this)" onmouseenter="return infraTooltipMostrar(\'Selecionar Tudo\')" onmouseout="return infraTooltipOcultar();"><img src="/infra_css/'+(isNewSEI ? 'svg/check.svg': 'imagens/check.gif')+'" class="infraImg"></a>').remove();
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
            console.log('notinclude', i, storeRecebimento[i]['id_procedimento'], storeRecebimento[i]['processo']);
            storeRecebimento.splice(i,1);
            i--;
        }
    }
    localStorageStorePro('configDataRecebimentoPro', storeRecebimento);
}
function removeAllTags() {
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
    if (isNewSEI) $('#divTabelaProcesso').removeClass('displayInitial');

    $('#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado')
        .trigger('filterReset')
        .trigger('update')
        .find('.filterTableProcessos').removeClass('newLink_active');
    initControlePrazo();
    tableHomeDestroy(true);
}
function getUniqueTableTag(i, tagName, type) {
	var tagName_ = (typeof tagName !== 'undefined' && tagName != '' ) ? removeAcentos(tagName).replace(/\ /g, '') : 'SemGrupo' ;
		tagName = (typeof tagName === 'undefined' && tagName == '' ) ? ' ' : tagName;
        tagName = ( (type == 'arrivaldate' || type == 'acessdate' || type == 'senddate' || type == 'createdate' || type == 'deadline') && tagName.indexOf('.') !== -1 ) ? tagName.split('.')[1] : tagName;
        tagName = ( type == 'tags' && tagName.indexOf('#') !== -1 ) ? tagName.replace(extractHexColor(tagName),'') : tagName;
	var tbRecebidos = $('#divRecebidos table');
	var countTd = tbRecebidos.find('tr:not(.tablesorter-headerRow)').eq(1).find('td').length;
	var iconSelect = '<label class="lblInfraCheck" for="lnkInfraCheck" accesskey=";"></label><a id="lnkInfraCheck" onclick="getSelectAllTr(this, \''+tagName_+'\');" onmouseover="updateTipSelectAll(this)" onmouseenter="return infraTooltipMostrar(\'Selecionar Tudo\')" onmouseout="return infraTooltipOcultar();"><img src="/infra_css/'+(isNewSEI ? 'svg/check.svg': 'imagens/check.gif')+'" id="imgRecebidosCheck" class="infraImg"></a></th>';
	var tagCount = $('#divRecebidos table tbody').find('tr[data-tagname="'+tagName_+'"]:visible').length;
    var collapseBtn =   '<span class="tagintable">'+
                        '   <a class="controleTableTag newLink" data-htagname="'+tagName_+'" onclick="toggleGroupTablePro(this)" data-action="show" onmouseover="return infraTooltipMostrar(\'Mostrar Agrupamento\');" onmouseout="return infraTooltipOcultar();" style="font-size: 11pt;'+(getOptionsPro('panelGroup_'+tagName_) ? '' : 'display:none;' )+'">'+
                        '       <i class="fas fa-plus-square cinzaColor"></i>'+
                        '   </a>'+
                        '   <a class="controleTableTag newLink" data-htagname="'+tagName_+'" onclick="toggleGroupTablePro(this)" data-action="hide" onmouseover="return infraTooltipMostrar(\'Recolher Agrupamento\');" onmouseout="return infraTooltipOcultar();" style="font-size: 11pt;'+(getOptionsPro('panelGroup_'+tagName_) ? 'display:none;' : '' )+'">'+
                        '       <i class="fas fa-minus-square cinzaColor"></i>'+
                        '   </a>';
                        '</span>';
	var htmlBody = '<tr class="infraCaption tagintable"><td colspan="'+(countTd+3)+'"><span '+actionTest+'>'+tagCount+' registros:</span></td></tr>'
					+'<tr data-htagname="'+tagName_+'" class="tagintable tableHeader">'
					+'<th class="tituloControle '+(isNewSEI ? 'infraTh' : '')+'" width="5%" align="center">'+iconSelect+'</th>'
					+'<th class="tituloControle '+(isNewSEI ? 'infraTh' : '')+'" colspan="'+(countTd+2)+'">'+tagName+collapseBtn+'</th>'
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
    	var dataTag = $(this).attr('data-tagname');
    		dataTag = ( dataTag == '' ) ? 'SemGrupo' : dataTag;
    	if ( typeof dataTag !== 'undefined' && $(this).find('td').eq(2).find('a').length > 0 ) {
    		var desc = $(this).find('td').eq(2).find('a').attr('onmouseover').split("','");            
    		var htmlDesc = (type == 'all')
                ? '<td class="tagintable">'+desc[0].replace("return infraTooltipMostrar('", "")+'</td>'
                : '<td class="tagintable">'+desc[0].replace("return infraTooltipMostrar('", "")+'</td><td class="tagintable">'+desc[1].replace("');","")+'</td>';
            var dataRecebido = getArrayProcessoRecebido($(this).find('td').eq(2).find('a').attr('href'));
            var textBoxDesc =   (type == 'arrivaldate' || type == 'acessdate') 
                                ? dataRecebido.descricao+' em: '+moment(dataRecebido.datahora, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY HH:mm')+'<br>'
                                : (dataRecebido.datesend != '') ? dataRecebido.descricaosend+' em: '+moment(dataRecebido.datesend, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY HH:mm')+'<br>' : '';
                textBoxDesc =   (type == 'createdate') ? dataRecebido.descricaodatageracao+' em: '+moment(dataRecebido.datageracao, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY HH:mm')+'<br>' : textBoxDesc;
            var textBox = textBoxDesc+'\u00DAltimo acesso em: '+moment(dataRecebido.datetime, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY HH:mm');
            var textDataRecebido = (dataRecebido != '' && type == 'acessdate') ? moment(dataRecebido.datetime, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY HH:mm') : '';
                textDataRecebido = (dataRecebido != '' && type == 'arrivaldate') ? moment(dataRecebido.datahora, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY') : textDataRecebido;
                textDataRecebido = (dataRecebido != '' && type == 'createdate') ? moment(dataRecebido.datageracao, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY') : textDataRecebido;
                textDataRecebido = (dataRecebido != '' && (type == 'senddate' || type == 'senddepart') && dataRecebido.datesend != '') ? moment(dataRecebido.datesend, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY') : textDataRecebido;
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
        var newColumns =    '<th class="tituloControle newRowControle '+(isNewSEI ? 'infraTh' : '')+'" style="text-align: center;">Especifica\u00E7\u00E3o</th>'+
                            // '<th class="tituloControle newRowControle" style="text-align: center;">Tipo</th>'+
                            (checkConfigValue('gerenciarprazos') ? '<th class="tituloControle newRowControle '+(isNewSEI ? 'infraTh' : '')+'" style="text-align: center;">Prazos</th>' : '');
        var titleCaption = $('#tblProcessosRecebidos').find('tbody').find('.tableHeader, .infraCaption').text();
            titleCaption = (titleCaption !== '') ? ' <span class="newRowControle">(Agrupados: '+titleCaption+')</span>' : '';
        $('#tblProcessosRecebidos').find('caption.infraCaption').show().append(titleCaption);
        $('#tblProcessosRecebidos').find('thead').show().find('.tablesorter-headerRow').append(newColumns);
        $('#tblProcessosRecebidos').find('tbody').find('.tableHeader, .infraCaption').remove();
        $('#tblProcessosRecebidos').find('thead').find('.prazoBoxDisplay').remove();
        tableHomeDestroy(true);
    }
    if (type != '' && type != 'all') {
        var orderbyTableGroup = getOptionsPro('orderbyTableGroup') ? getOptionsPro('orderbyTableGroup') : 'asc';
        $('#processoToCSV').after('<a class="newLink" data-order="'+orderbyTableGroup+'" onclick="orderbyTableGroup(this)" id="orderbyTableGroup" onmouseover="return infraTooltipMostrar(\'Classificar dados pela ordem '+(orderbyTableGroup == 'asc' ? 'decrescente' : 'crescente')+'\');" onmouseout="return infraTooltipOcultar();" style="margin: 0;font-size: 10pt;float: right;"><i class="fas fa-sort-numeric-'+(orderbyTableGroup == 'asc' ? 'up' : 'down')+' cinzaColor"></i></a>');
    }
    if (isNewSEI && type != '') {
        $('#divTabelaProcesso').addClass('displayInitial');
    } else if (isNewSEI) {
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
        infraTooltipOcultar();
        updateGroupTable($('#selectGroupTablePro'));
}
function getArrayProcessoRecebido(href) {
    var storeRecebimento = ( typeof localStorageRestorePro('configDataRecebimentoPro') !== 'undefined' && !$.isEmptyObject(localStorageRestorePro('configDataRecebimentoPro')) ) ? localStorageRestorePro('configDataRecebimentoPro') : [];
    var id_procedimento = String(getParamsUrlPro(href).id_procedimento);
    var dadosRecebido = (jmespath.search(storeRecebimento, "[?id_procedimento=='"+id_procedimento+"'] | length(@)") > 0) ? jmespath.search(storeRecebimento, "[?id_procedimento=='"+id_procedimento+"'] | [0]") : '';
    return dadosRecebido;
}
function updateGroupTablePro(valueSelect, mode) {
    //var unidade = $('#selInfraUnidades').find('option:selected').text().trim();
    var selectGroup = localStorageRestorePro('selectGroupTablePro');
    if ($.isArray(selectGroup) && selectGroup.length > 0) {
        if (jmespath.search(selectGroup, "[?unidade=='"+unidade+"'].unidade | length(@)") > 0) {
            for (i = 0; i < selectGroup.length; i++) {
                if(selectGroup[i]['unidade'] == unidade) {
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
            selectGroup.push({unidade: unidade, selected: valueSelect});
        }
        localStorageStorePro('selectGroupTablePro', selectGroup);
        console.log('selectGroup',selectGroup);
    } else {
        if (mode == 'remove') {
            localStorageRemovePro('selectGroupTablePro');
            console.log('localStorageRemovePro');
        } else {
            localStorageStorePro('selectGroupTablePro', [{unidade: unidade, selected: valueSelect}]);
            console.log('selectGroup',[{unidade: unidade, selected: valueSelect}]);
            console.log('NOT',{unidade: unidade, selected: valueSelect});
        }
    }
}
function storeGroupTablePro() {
    if (typeof localStorageRestorePro !== "undefined" && localStorageRestorePro('selectGroupTablePro') != null) {
        //var unidade = $('#selInfraUnidades').find('option:selected').text().trim();
        var selectGroup = localStorageRestorePro('selectGroupTablePro');
        if ($.isArray(selectGroup) && typeof jmespath !== 'undefined' && jmespath.search(selectGroup, "[?unidade=='"+unidade+"'].unidade | [0]") == unidade ) {
            return jmespath.search(selectGroup, "[?unidade=='"+unidade+"'].selected | [0]");
        } else if (!$.isArray(selectGroup)) {
            localStorageStorePro('selectGroupTablePro', [{unidade: unidade, selected: selectGroup}]);
            console.log('selectGroupTablePro', [{unidade: unidade, selected: selectGroup}]);
            return selectGroup;
        }
    } else {
        return false;
    }
}
function insertGroupTable(TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    if (typeof checkConfigValue !== 'undefined' && (checkConfigValue('agruparlista') || verifyConfigValue('removepaginacao')) ) {
        if (checkConfigValue('agruparlista')) { 
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
            var statusTableAll =            ( storeGroupTablePro() == 'all' ) ? 'selected' : '';
            var filterTableHome = selectFilterTableHome();
            var htmlControl =    '<div id="newFiltro">'+
                                 '  '+filterTableHome+
                                 '   <select id="selectGroupTablePro" class="groupTable selectPro" onchange="updateGroupTable(this)" data-placeholder="Agrupar processos...">'+
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
                                 '  </select>'+
                                 '  <a class="newLink" onclick="getTableProcessosCSV()" id="processoToCSV" onmouseover="return infraTooltipMostrar(\'Exportar informa\u00E7\u00F5es de processos em planilha CSV\');" onmouseout="return infraTooltipOcultar();" style="margin: 0;font-size: 10pt;float: right;"><i class="fas fa-file-download cinzaColor"></i></a>'+
                                 '</div>';

            if ( $('#selectGroupTablePro').length == 0 && $('#tblProcessosDetalhado').length == 0) { 
                $('#divFiltro').after(htmlControl).css('width','50%');
                setTimeout(function(){ 
                    updateGroupTable($('#selectGroupTablePro'));
                    if ($('#selectGroupTablePro_chosen').length == 0 && verifyConfigValue('substituiselecao')) {
                        initChosenFilterHome();
                    }
                }, 500);
            }
            if ( $('#idSelectTipoBloco').length != 0 ) { 
                $("#idSelectTipoBloco").appendTo("#newFiltro");
                $("#idSelectBloco").appendTo("#newFiltro");
            }
        } else {
            initProcessoPaginacao($('#selectGroupTablePro'));
        }
    } else {
        setTimeout(function(){ 
            insertGroupTable(TimeOut - 100); 
            console.log('Reload insertGroupTable'); 
        }, 500);
    }
}
function initChosenFilterHome(TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    if (typeof $().chosen !== 'undefined') { 
        $('#newFiltro .selectPro').chosen({
            placeholder_text_single: ' ',
            no_results_text: 'Nenhum resultado encontrado'
        });
        forcePlaceHoldChosen();
    } else {
        if (typeof $().chosen === 'undefined' && typeof URL_SPRO !== 'undefined' && TimeOut == 9000) { 
            $.getScript(URL_SPRO+"js/lib/chosen.jquery.min.js");
            console.log('@load chosen');
        }
        setTimeout(function(){ 
            initChosenFilterHome(TimeOut - 100); 
            console.log('Reload initChosenFilterHome'); 
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
function updateGroupTable(this_) {
    if (typeof checkConfigValue !== 'undefined' && verifyConfigValue('removepaginacao')) {
        initProcessoPaginacao(this_);
    } else {
        initUpdateGroupTable(this_);
    }
}
function initUpdateGroupTable(this_) {
    if (typeof checkConfigValue !== 'undefined' && checkConfigValue('agruparlista')) {
        var valueSelect = $(this_).val();
        initTableTag(valueSelect);
        console.log('valueSelect', valueSelect);
        if ( typeof valueSelect !== 'undefined' && valueSelect != '' ) { 
            $('#filterTableHome').val('').trigger('chosen:updated');
            updateGroupTablePro(valueSelect, 'insert');
            if (valueSelect == 'arrivaldate' || valueSelect == 'acessdate' || valueSelect == 'senddate' || valueSelect == 'senddepart' || valueSelect == 'createdate') { 
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
function getTableTag(type) {
    var listTags = getListTypes(type);
    $.each(listTags, function (i, val) {
        getUniqueTableTag(i, val, type);
    });
}
function initTableTag(type = '') {
    cleanConfigDataRecebimento();
	removeAllTags();
	if ( type != '' ) {
        $('#divRecebidos thead').hide();
		appendGerados(type);
		getTableTag(type);
		getTableOnTag(type);
        checkboxRangerSelectShift();
	}
    initNewTabProcesso();
    setTimeout(function(){ 
        forcePlaceHoldChosen();
        urgenteProMoveOnTop();
        if (type != '' && type != 'all' && $('#tblProcessosRecebidos tbody a.urgentePro[href*="controlador.php?acao=procedimento_trabalhar"]').length > 0) {
            $('#tblProcessosRecebidos tr.tagintable[data-htagname="(URGENTE)"').remove();
            $('#tblProcessosRecebidos tr.urgentePro').show().attr('data-tagname','(URGENTE)');
            var colspan = $('#tblProcessosRecebidos tr:not(.tableHeader)').eq(1).find('td').length;
                colspan = (typeof colspan !== 'undefined' && colspan > 0) ? colspan+2 : 7;
            var htmlHeadUrgente =   '<tr data-htagname="(URGENTE)" class="tagintable tableHeader">'+
                                    '   <th class="tituloControle '+(isNewSEI ? 'infraTh' : '')+'" width="5%" align="center">'+
                                    '       <label class="lblInfraCheck" for="lnkInfraCheck" accesskey=";"></label>'+
                                    '       <a id="lnkInfraCheck" onclick="getSelectAllTr(this, \'(URGENTE)\');" onmouseover="updateTipSelectAll(this)" onmouseenter="return infraTooltipMostrar(\'Selecionar Tudo\')" onmouseout="return infraTooltipOcultar();">'+
                                    '           <img src="/infra_css/'+(isNewSEI ? 'svg/check.svg': 'imagens/check.gif')+'" id="imgRecebidosCheck" class="infraImg">'+
                                    '       </a>'+
                                    '   </th>'+
                                    '   <th class="tituloControle '+(isNewSEI ? 'infraTh' : '')+'" colspan="'+colspan+'">(URGENTE)</th>'+
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
function getFilterTableHome(this_) {
    if (tableHomePro.length > 0 && $('.filterTableProcessos').length > 0) {
        if ($('#selectGroupTablePro').val() != '') {
            $('#selectGroupTablePro').val('').trigger('change').trigger('chosen:updated');
        }
        var _this = $(this_);
        var value = _this.val();
        var data = _this.find('option:selected').data();
        var filters = [];
        if (data.type == 'user') {
            filters[3] = (value == '' ? '""' : '('+value+')');
        } else if (data.type == 'proc') {
            value = (value != '') ? extractOnlyAlphaNum(removeAcentos(value)) : value;
            filters[2] = (value == '' ? '""' : value);
        } else if (data.type == 'tag') {
            value = (value != '') ? extractOnlyAlphaNum(removeAcentos(value)) : value;
            filters[1] = (value == '' ? '' : 'Marcador? '+value);
        } else if (data.type == 'clean') {
            $.each(tableHomePro, function(i){
                tableHomePro[i].trigger('filterReset');
            });
            _this.val('');
            if (verifyConfigValue('substituiselecao')) {
                forcePlaceHoldChosen();
                _this.chosen("destroy").chosen();
            }
        }
        if (filters.length > 0) {
            setTimeout(function(){ 
                $.each(tableHomePro, function(i){
                    $.tablesorter.setFilters( tableHomePro[i][0], filters, true );
                });
            }, 100);
        }
    } else {
        tableHomeDestroy(true);
    }
}
function selectFilterTableHome() {
    var tableProc = $('#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado');
        tableProc.find('a[href*="acao=procedimento_atribuicao_listar"]').map(function(){ return $(this).text() }).get();

    var users = tableProc.find('a[href*="acao=procedimento_atribuicao_listar"]').map(function(){ return $(this).text() }).get();
        users = (typeof users !== 'undefined' && users !== null) ? uniqPro(users) : [];

    var tipos = tableProc.find('a[href*="acao=procedimento_trabalhar"]').map(function(){ 
            var tipoNomeProc = extractTooltipToArray($(this).attr('onmouseover'));
                tipoNomeProc = (tipoNomeProc) ? tipoNomeProc[1] : false;
            if (tipoNomeProc) {
                return tipoNomeProc;
            }
        }).get();
        tipos = (typeof tipos !== 'undefined' && tipos !== null) ? uniqPro(tipos) : [];

    var marcadores = tableProc.find('a[href*="acao=andamento_marcador_gerenciar"]').map(function(){ 
            var tipoNomeTag = extractTooltipToArray($(this).attr('onmouseover'));
                tipoNomeTag = (tipoNomeTag) ? tipoNomeTag[1] : false;
            if (tipoNomeTag) {
                return tipoNomeTag;
            }
        }).get();
        marcadores = (typeof marcadores !== 'undefined' && marcadores !== null) ? uniqPro(marcadores) : [];

    var html =  '<select id="filterTableHome" class="selectPro" style="width:250px;margin-right:20px !important;" onchange="getFilterTableHome(this)" data-placeholder="Filtrar processos...">'+
                '   <option value="" data-type="clean">&nbsp;</option>'+
                '   <option value="all" data-type="clean">Todos os processos</option>';

        if (users.length > 0) {
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
            $.each(marcadores, function(i, v){
                html += '       <option value="'+v+'" data-type="tag">'+v+'</option>';
            });
            html += '   </optgroup>';
        }

        html += '</select>';
    return html;
}
function initDadosProcesso(TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    if (typeof getParamsUrlPro !== 'undefined' && typeof getDadosIframeProcessoPro !== 'undefined'  && typeof $("#ifrArvore").contents().find('#topmenu').find('a[target="ifrVisualizacao"]').eq(0).attr('href') !== 'undefined' ) { 
        var id_procedimento = getParamsUrlPro(window.location.href).id_procedimento;
            id_procedimento = (typeof id_procedimento === 'undefined') ? getParamsUrlPro($('#ifrArvore').attr('src')).id_procedimento : id_procedimento;
            id_procedimento = (typeof id_procedimento === 'undefined') ? getParamsUrlPro(window.location.href).id_protocolo : id_procedimento;
            // idProcedimento = (typeof idProcedimento !== 'undefined') ? idProcedimento : getParamsUrlPro($("#ifrArvore").contents().find('#topmenu').find('a[target="ifrVisualizacao"]').eq(0).attr('href')).id_procedimento;
            // console.log(id_procedimento, 'processo');
            getDadosIframeProcessoPro(id_procedimento, 'processo');
    } else {
        setTimeout(function(){ 
            initDadosProcesso(TimeOut - 100); 
            console.log('Reload initDadosProcesso'); 
        }, 500);
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
                var totalItens = parseInt(NroItens_.val())+parseInt(NroItens);
                    NroItens_.val(totalItens);
                    $('#tblProcessos'+tipo).find('caption.infraCaption').html('<span '+actionTest+'>'+totalItens+' registros:</span>');
                var Itens = $html.find('#hdn'+tipo+'Itens').val();
                var Itens_ = $('#hdn'+tipo+'Itens');
                    //Itens_.val(Itens_.val()+','+Itens);
                var ItensHash = $html.find('#hdn'+tipo+'ItensHash').val();
                var ItensHash_ = $('#hdn'+tipo+'ItensHash');
                    //ItensHash_.val(ItensHash);
                getProcessosPaginacao(this_, index+1, tipo);
                if (checkConfigValue('gerenciarfavoritos')) appendStarOnProcess();
                initControlePrazo(true);
            } else {
                param['hdn'+tipo+'PaginaAtual'] = 0;
                $.ajax({  method: 'POST', data: param, url: href });
                initUpdateGroupTable(this_);
            }
    });
}
function checkProcessoPaginacao(this_, tipo) {
    var pgnAtual = $('#hdn'+tipo+'PaginaAtual'); console.log(parseInt(pgnAtual.val()));
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
                $('#ifrVisualizacao').attr('src', href.attr('href'));
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
function initNewTabProcesso() { 
    var iconLabel = localStorage.getItem('iconLabel');
    var iconBoxSlim = localStorage.getItem('seiSlim');
    var observerTableControle = new MutationObserver(function(mutations) {
        var _this = $(mutations[0].target);
        var _parent = _this.closest('table');
        if (_parent.find('tr.infraTrMarcada').length > 0) {
            $('#divComandos').find('.iconPro_Observe').removeClass('botaoSEI_hide');
            removeDuplicateValue('#hdnRecebidosItensSelecionados');
            removeDuplicateValue('#hdnGeradosItensSelecionados');
        } else {
            $('#divComandos').find('.iconPro_Observe').addClass('botaoSEI_hide');
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
            '       <i class="fas fa-user-check" style="font-size: 17pt; color: #fff;"></i>'+
            '    </span>'+
            (iconLabel ?
            '    <span class="newIconTitle">'+__.Nova_Demanda+'</span>'+
            '' : '')+
            '</a>'
            : '';

        var htmlBtnPrazo =  (checkConfigValue('gerenciarprazos')) ? 
                            '<a class="botaoSEI botaoSEI_hide '+(iconLabel ? 'iconLabel' : '')+' '+(iconBoxSlim ? 'iconBoxSlim' : '')+' iconPro_Observe iconPrazo_new" '+(iconLabel ? '' : 'onmouseout="return infraTooltipOcultar();" onmouseover="return infraTooltipMostrar(\'Adicionar prazo\')"')+' onclick="addControlePrazo()" style="position: relative; margin-left: -3px;">'+
                            '    <img class="infraCorBarraSistema" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" title="Adicionar prazo">'+
                            '    <span class="botaoSEI_iconBox">'+
                            '       <i class="far fa-clock" style="font-size: 17pt; color: #fff;"></i>'+
                            '    </span>'+
                            (iconLabel ?
                            '    <span class="newIconTitle">Adicionar prazo</span>'+
                            '' : '')+
                            '</a>'
                            : '';

        htmlBtn =   '<a tabindex="451" class="botaoSEI botaoSEI_hide '+(iconLabel ? 'iconLabel' : '')+' '+(iconBoxSlim ? 'iconBoxSlim' : '')+' iconPro_Observe iconPro_newtab" '+(iconLabel ? '' : 'onmouseout="return infraTooltipOcultar();" onmouseover="return infraTooltipMostrar(\'Abrir Processos em Nova Aba\')"')+' onclick="openListNewTab(this)" style="position: relative; margin-left: -3px;">'+
                    '    <img class="infraCorBarraSistema" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" title="Abrir Processos em Nova Aba">'+
                    '    <span class="botaoSEI_iconBox">'+
                    '       <i class="fas fa-external-link-alt" style="font-size: 17pt; color: #fff;"></i>'+
                    '    </span>'+
                    (iconLabel ?
                    '    <span class="newIconTitle">Abrir Processos em Nova Aba</span>'+
                    '' : '')+
                    '</a>'+htmlBtnAtiv+htmlBtnPrazo;
        $('#divComandos').find('.iconPro_Observe').remove();
        $('#divComandos').append(htmlBtn);
    }, 500);
}
function openListNewTab(this_) {
    var elemCheckbox = isNewSEI ? '.infraCheckboxInput' : '.infraCheckbox';
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
function initPanelFavorites(TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    if (typeof localStorageRestorePro !== 'undefined' && typeof setPanelFavorites !== 'undefined' && typeof orderDivPanel !== 'undefined') { 
        if (checkConfigValue('gerenciarfavoritos') && typeof getStoreFavoritePro() !== 'undefined' && getStoreFavoritePro().hasOwnProperty('favorites')) {
            setTimeout(function(){ 
                setPanelFavorites('insert');
                console.log('setPanelFavorites');
            }, 500);
        }
    } else {
        setTimeout(function(){ 
            initPanelFavorites(TimeOut - 100); 
            console.log('Reload initPanelFavorites'); 
        }, 500);
    }
}
function checkLoadConfigSheets(TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    if (typeof checkConfigValue !== 'undefined') { 
        if (
            (checkConfigValue('gerenciarprojetos') && typeof spreadsheetIdProjetos_Pro !== 'undefined' && spreadsheetIdProjetos_Pro !== false && spreadsheetIdProjetos_Pro !== 'undefined') ||
            (checkConfigValue('gerenciarformularios') && typeof spreadsheetIdFormularios_Pro !== 'undefined' && spreadsheetIdFormularios_Pro !== false && spreadsheetIdFormularios_Pro !== 'undefined') ||
            (checkConfigValue('sincronizarprocessos') && typeof spreadsheetIdSyncProcessos_Pro !== 'undefined' && spreadsheetIdSyncProcessos_Pro !== false && spreadsheetIdSyncProcessos_Pro !== 'undefined')
        ){
            handleClientLoadPro();
            console.log('handleClientLoadPro');
        }
    } else {
        setTimeout(function(){ 
            checkLoadConfigSheets(TimeOut - 100); 
            console.log('Reload checkLoadConfigSheets'); 
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
    var elementControleProc = isNewSEI ? 'collapseTabelaProcesso' : 'frmProcedimentoControlar';
    var statusView = ( getOptionsPro(elementControleProc) == 'hide' ) ? 'none' : 'initial';
    var statusIconShow = ( getOptionsPro(elementControleProc) == 'hide' ) ? '' : 'display:none;';
    var statusIconHide = ( getOptionsPro(elementControleProc) == 'hide' ) ? 'display:none;' : '';
    var idControleProc = isNewSEI ? '.'+elementControleProc : '#'+elementControleProc;
    var idOrder = (getOptionsPro('orderPanelHome') && typeof jmespath !== 'undefined' && jmespath.search(getOptionsPro('orderPanelHome'), "[?name=='processosSEIPro'].index | length(@)") > 0) ? jmespath.search(getOptionsPro('orderPanelHome'), "[?name=='processosSEIPro'].index | [0]") : '';
    var htmlIconTable =     '<i class="controleProcPro '+(localStorage.getItem('seiSlim') ? 'fad fa-folders' : 'fas fa-folder-open')+' cinzaColor" style="margin: 0 10px 0 0; font-size: 1.1em;"></i>';
    var htmlToggleTable =   '<a class="controleProcPro newLink" id="'+elementControleProc+'_showIcon" onclick="toggleTablePro(\''+idControleProc+'\',\'show\')" onmouseover="return infraTooltipMostrar(\'Mostrar Tabela\');" onmouseout="return infraTooltipOcultar();" style="font-size: 11pt; '+statusIconShow+'"><i class="fas fa-plus-square cinzaColor"></i></a>'+
                            '<a class="controleProcPro newLink" id="'+elementControleProc+'_hideIcon" onclick="toggleTablePro(\''+idControleProc+'\',\'hide\')" onmouseover="return infraTooltipMostrar(\'Recolher Tabela\');" onmouseout="return infraTooltipOcultar();" style="font-size: 11pt; '+statusIconHide+'"><i class="fas fa-minus-square cinzaColor"></i></a>';
    var htmlDivPanel = '<div class="controleProcPro panelHomePro" style="display: inline-block; width: 100%;" id="processosSEIPro" data-order="'+idOrder+'"></div>';
    
    if (isNewSEI) $('#divFiltro, #collapseControle, #newFiltro, #divTabelaProcesso').addClass('collapseTabelaProcesso');

    if ($('.controleProcPro').length == 0) {
        $('#divInfraBarraLocalizacao').css('width', '100%').addClass('titlePanelHome').append(htmlToggleTable).prepend(htmlIconTable);
        $(idControleProc).css({'width': '100%', 'display': statusView});
        $('#panelHomePro').append(htmlDivPanel);
        $('#frmProcedimentoControlar').moveTo('#processosSEIPro');
        $('#divInfraBarraLocalizacao').moveTo('#processosSEIPro');
        if (isNewSEI && getOptionsPro(elementControleProc) == 'hide') $(idControleProc).addClass('displayNone');
    }
}
function insertDivPanel() {
    if ($('#panelHomePro').length == 0) { 
        $('#frmProcedimentoControlar').after('<div id="panelHomePro" style="display: inline-block; width: 100%;"></div>'); 
        initSortDivPanel();
    }
}
function initSortDivPanel(TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    if (typeof $('#panelHomePro').sortable !== 'undefined' && typeof getOptionsPro !== 'undefined' && typeof setSortDivPanel !== 'undefined' && typeof $().moveTo !== 'undefined') { 
        insertDivPanelControleProc();
        setSortDivPanel();
    } else {
        setTimeout(function(){ 
            initSortDivPanel(TimeOut - 100); 
            console.log('Reload initSortDivPanel', TimeOut); 
            if (TimeOut == 9000) fnJqueryPro();
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
            if (typeof $().tablesorter === 'undefined' && TimeOut == 1000) { $.getScript((URL_SPRO+"js/lib/jquery.tablesorter.combined.min.js")) }
            initTableSorterHome(TimeOut - 100); 
            console.log('Reload initTableSorterHome'); 
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
                    corrigeTableSEI(this);
                    /*
                    $('#txtPesquisaRapida').attr('data-column','all').unbind().on('keypress',function(e) {
                        if (tableHomePro.length > 0) {
                            $.each(tableHomePro, function(i){
                                $.tablesorter.filter.bindSearch( tableHomePro[i][0], $('#txtPesquisaRapida'), false);
                            });
                        }
                        if(e.which == 13) {
                            $('#frmProtocoloPesquisaRapida').submit();
                            tableSorterHome.trigger('filterReset');
                            $('#txtPesquisaRapida').val('');
                        }
                    });
                    */
                   if (isNewSEI) {
                        tableSorterHome.find('th:nth-child(2)').each(function(){
                            var _this = $(this);
                            if (_this.attr('colspan') == 3) {
                                    _this.removeAttr('colspan');
                                var beforeTh = _this.clone().text('');
                                var aftereTh = _this.clone().text('');
                                    _this.before(beforeTh);
                                    _this.after(aftereTh);
                            }
                        });
                   }
                    
                    var elemID = $(this).attr('id');
                    var _this = $('#'+$(this).attr('id'));
                    var sortListArray = (typeof sortListSaved !== 'undefined' && sortListSaved && typeof sortListSaved[elemID] !== 'undefined') ? sortListSaved[elemID].sortList : [];
                    var configSorter = {
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
                                    // console.log(texttip);
                                return urgente+nrProc+' '+texttip;
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
                            filter_saveFilters: false,
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
                            var caption = $(this).find("caption").eq(0);
                            var tx = caption.text();
                                caption.text(tx.replace(/\d+/g, data.filteredRows));
                                $(this).find("tbody > tr:visible > td > input").prop('disabled', false);
                                $(this).find("tbody > tr:hidden > td > input").prop('disabled', true);
                        });
                        
                    tableHomePro.push(tableHomeThis);

                    var filter = _this.find('.tablesorter-filter-row').get(0);
                    if (typeof filter !== 'undefined') {
                        setTimeout(function(){ 
                            var htmlFilter =    '<a class="newLink filterTableProcessos '+(_this.find('tr.tablesorter-filter-row').hasClass('hideme') ? '' : 'newLink_active')+'" onclick="filterTableProcessos(this)" onmouseover="return infraTooltipMostrar(\'Pesquisar na tabela\');" onmouseout="return infraTooltipOcultar();" style="left: 0; top: -20px; position: absolute;">'+
                                                '   <i class="fas fa-search cinzaColor" style="padding-right: 3px; cursor: pointer; font-size: 12pt;"></i>'+
                                                '</a>';
                            _this.find('thead .filterTableProcessos').remove();
                            _this.find('thead').prepend(htmlFilter);
                            observerFilterHome.observe(filter, {
                                attributes: true
                            });
                            tableSorterHome.find('.tablesorter-filter-row input.tablesorter-filter[aria-label*="Prazos"]').attr('type','date');
                        }, 500);
                    }
                }
            });
            if (tableSorterHome.find('tbody tr td:nth-child(2)').find('img').length > 0) {
                tableSorterHome.find('thead tr:first th:nth-child(2)').css('width','150px');
            }

            setTimeout(function(){ 
                if ($('.filterTableProcessos').length == 0) {
                    setTimeout(function(){ 
                        console.log('Reload tableHomeDestroy');
                        tableHomeDestroy(true);
                    }, 1000);
                }
                var filterStore = (typeof tableHomePro[0] !== 'undefined' && typeof tableHomePro[0][0] !== 'undefined') ? $.tablesorter.storage(tableHomePro[0][0], 'tablesorter-filters') : [];
                if (typeof filterStore !== 'undefined' && filterStore !== null && filterStore.length > 0) {
                    var filterUser = filterStore[3];
                        filterUser = (typeof filterUser !== 'undefined' && filterUser !== null) ? filterUser.replace('(','').replace(')','') : false;
                    if (filterUser) {
                        $('#filterTableHome').val(filterUser).trigger('chosen:updated');
                    }
                }
            }, 1000);
        }
}
function tableHomeDestroy(reload = false, Timeout = 3000) {
    if (tableHomePro.length > 0) {
        $.each(tableHomePro, function(i){
            tableHomePro[i].trigger("destroy");
        });
        $('.filterTableProcessos').remove();
        window.tableHomePro = [];
        if (reload && Timeout > 0) {
            initTableSorterHome();
            console.log('reload initTableSorterHome', Timeout);
            setTimeout(function(){ 
                forceTableHomeDestroy(Timeout);
            }, 1000);
        }
    } else {
        initTableSorterHome();
    }
}
function forceTableHomeDestroy(Timeout) {
    if (Timeout <= 0) { return; }
    var force = false;
    $.each(tableHomePro, function(i){
        var filter = $.tablesorter.storage( tableHomePro[i][0], 'tablesorter-filters');
        var rowFilter = $(tableHomePro[i][0]).find('tr.tablesorter-filter-row').hasClass('hideme');
        force = (typeof filter !== 'undefined' && filter !== null && filter.length > 0 && rowFilter) ? true : force;
    });
    if (force && Timeout > 0 && $('#tblProcessosGerados').is(':visible')) {
        tableHomeDestroy(true, Timeout-1000);
        console.log('Reload forceTableHomeDestroy', Timeout);
    }
}
function forceOnLoadBody() {
    var onload = new Function($('body').attr('onload'));
    onload();
}
function observeAreaTela(TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    if (typeof setResizeAreaTelaD !== 'undefined') { 
        new ResizeObserver(setResizeAreaTelaD).observe(divInfraAreaTelaD);
    } else {
        setTimeout(function(){ 
            observeAreaTela(TimeOut - 100); 
            console.log('Reload observeAreaTela'); 
        }, 500);
    }
}

function replaceSticknoteHome() {
    var arraySticknoteHome = [];
    $('#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado').find('a[href*="acao=anotacao_registrar"]').each(function(){
        var tooltip = $(this).attr('onmouseover');
            tooltip = (typeof tooltip !== 'undefined') ? tooltip.split("'") : false; 
        if (tooltip) {
            var id_protocolo = $(this).attr('href');
                id_protocolo = (typeof id_protocolo !== 'undefined') ? getParamsUrlPro(id_protocolo).id_protocolo : false;
            var texttip = tooltip[1];
            var usertip = tooltip[3];
            var _return = $.map(texttip.split('\\n'), function(v){
                if (v != '') { 
                    var check = (v.indexOf('[ ]') !== -1) ? true : false;
                    var checked = (v.indexOf('[X]') !== -1) ? true : false;
                    var style = (checked) ? ' style=\\"text-decoration: line-through;\\"' : '';
                    var text = (check) ? '<i class=\\"far fa-square\\"></i> '+v.replace('[ ]','').trim() : v;
                        text = (checked) ? '<i class=\\"fas fa-check-square\\"></i> '+v.replace('[X]','').trim() : text;
                    return (check || checked) ? '<div'+style+'>'+text+'</div>' : v;

                } else { 
                    return v;
                } 
            }).join('');
            $(this).attr('onmouseover', 'return infraTooltipMostrar(\''+_return+'\',\''+usertip+'\');');
            if (id_protocolo) {
                arraySticknoteHome.push({id_protocolo: id_protocolo, usertip: usertip, texttip: texttip});
            }
        }
    });
    setOptionsPro('arraySticknoteHome', arraySticknoteHome);
}
function initReplaceSticknoteHome(TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    if (typeof checkConfigValue !== 'undefined') { 
        if (checkConfigValue('infoarvore')) {
            replaceSticknoteHome();
        }
    } else {
        setTimeout(function(){ 
            initReplaceSticknoteHome(TimeOut - 100); 
            console.log('Reload initReplaceSticknoteHome'); 
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
            console.log('Reload initReloadModalLink'); 
        }, 500);
    }
}
function initReplaceNewIcons(TimeOut = 9000) {
    if (localStorage.getItem('seiSlim') === null || (TimeOut <= 0 || parent.window.name != '')) { return; }
    if (typeof replaceNewIcons === 'function') {
        replaceNewIcons($('.infraBarraComandos a.botaoSEI'));
    } else {
        setTimeout(function(){ 
            initReplaceNewIcons(TimeOut - 100); 
            console.log('Reload initReplaceNewIcons', TimeOut); 
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
            console.log('Reload initObserveUrlChange', TimeOut); 
        }, 500);
    }
}
function setObserveUrlChange() {
    if (parent.verifyConfigValue('urlamigavel')) {
        $(window).bind('hashchange', function() {
            var ifrArvore = $('#ifrArvore').contents();
            var sourceLink = ifrArvore.find('.infraArvoreNoSelecionado').eq(0).closest('a[target="ifrVisualizacao"]');
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
function addControlePrazo(this_ = false) {
    var dateRef = moment().format('YYYY-MM-DD');
    var timeRef = '23:59';
    var dueSetDate = true;
    var tagName = false;
    var textTag = '';
    var textControle = 'Adicionar';
    var form = $('#frmProcedimentoControlar');
    var href = isNewSEI
            ? $('#divComandos a[onclick*="andamento_marcador_cadastrar"]').attr('onclick') 
            : $('#divComandos a[onclick*="andamento_marcador_gerenciar"]').attr('onclick');
        href = (typeof href !== 'undefined') ? href.match(RegExp(/(?<=(["']))(?:(?=(\\?))\2.)*?(?=\1)/, 'g')) : false;
        href = (href && href !== null && href.length > 0 && href[0] != '') ? href[0] : false;
    if (this_) {
        var _this = $(this_);
        var _data = _this.data();
        var _parent = _this.closest('tr');
        var _processo = _parent.find('a[href*="procedimento_trabalhar"]');
        var _tag = _parent.find('a[href*="andamento_marcador_gerenciar"]').attr('onmouseover');
        var tag = (typeof _tag !== 'undefined') ? _tag.match(RegExp(/(?<=(["']))(?:(?=(\\?))\2.)*?(?=\1)/, 'g')) : false;
            tagName = (tag && tag !== null && tag.length > 0 && tag[2] != '') ? tag[2] : false;
            textTag = (tag && tag !== null && tag.length > 0 && tag[0] != '') ? tag[0] : false;

        var processo = _processo.text().trim();
        var linkParams = getParamsUrlPro(_processo.attr('href'));
        var id_procedimento = (linkParams && typeof linkParams.id_procedimento !== 'undefined') ? linkParams.id_procedimento : false;
            dateRef = (typeof _data.timeSorter !== 'undefined') ? moment(_data.timeSorter, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD') : dateRef;
            timeRef = (typeof _data.timeSorter !== 'undefined') ? moment(_data.timeSorter, 'YYYY-MM-DD HH:mm').format('HH:mm') : timeRef;
            textControle = (typeof _data.timeSorter !== 'undefined') ? 'Alterar' : textControle;
            dueSetDate = (typeof _data.duesetdate !== 'undefined') ? _data.duesetdate : dueSetDate;

            _this.closest('table').find('thead th a[onclick*="setSelectAllTr"]').data('index',1).trigger('click');
            _parent.find('input[type="checkbox"]').trigger('click');
            textTag = (typeof _data.timeSorter !== 'undefined') ? textTag.replace(moment(_data.timeSorter, 'YYYY-MM-DD HH:mm').format('DD/MM/YYYY HH:mm'), '').replace('Ate ', '').trim() : textTag;
            textTag = (typeof textTag !== 'undefined' && textTag !== null && textTag != '') ? textTag.replace(/\\n/g, "") : '';
    }
    var tblProcessos = $('#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado');
    
    var htmlBox =   '<div class="dialogBoxDiv">'+
                    '   <table style="font-size: 10pt;width: 100%;" class="seiProForm">'+
                    '      <tr style="height: 40px;">'+
                    '          <td style="vertical-align: bottom;">'+
                    '               <i class="iconPopup iconSwitch fas fa-calendar-alt '+(dueSetDate ? 'azulColor' : 'cinzaColor')+'"></i> '+
                    '               Controlar vencimento?'+
                    '          </td>'+
                    '          <td>'+
                    '              <div class="onoffswitch" style="float: right;">'+
                    '                  <input type="checkbox" onchange="configDatesSwitchChangeHome(this)" name="onoffswitch" class="onoffswitch-checkbox" id="configDatesBox_duesetdate" data-type="duesetdate" tabindex="0" '+(dueSetDate ? 'checked' : '')+'>'+
                    '                  <label class="onoffswitch-label" for="configDatesBox_duesetdate"></label>'+
                    '              </div>'+
                    '          </td>'+
                    '      </tr>'+
                    '      <tr style="height: 40px;" class="configDates_duesetdate">'+
                    '          <td class="label" style="vertical-align: bottom;">'+
                    '               <i class="iconPopup '+(dueSetDate ? 'fas fa-clock' : 'far fa-clock')+' azulColor"></i> <span>'+(dueSetDate ? 'Data de vencimento' : 'Data inicial')+'</span>'+
                    '          </td>'+
                    '          <td class="input" style="position:relative">'+
                    '               <span class="newLink_active" style="margin: 0px;padding: 5px 8px;border-radius: 5px;position: absolute;top: 10px;'+(dueSetDate ? 'display:block;' : 'display:none;')+'">At\u00E9</span>'+
                    '               <input type="date" onkeypress="if (event.which == 13) { $(this).closest(\'.ui-dialog\').find(\'.confirm.ui-button\').trigger(\'click\') }" id="configDatesBox_date" value="'+dateRef+'" style="width:130px; margin-left: 50px !important;">'+
                    '               <input type="time" onkeypress="if (event.which == 13) { $(this).closest(\'.ui-dialog\').find(\'.confirm.ui-button\').trigger(\'click\') }" id="configDatesBox_time" value="'+timeRef+'" style="width:80px; float: right;">'+
                    '           </td>'+
                    '      </tr>'+
                    '      <tr style="height: 40px;">'+
                    '          <td class="label" style="vertical-align: bottom;">'+
                    '               <i class="iconPopup fas fa-tags azulColor"></i> <span>Marcador</span>'+
                    '          </td>'+
                    '          <td>'+
                    '               <select id="configDatesBox_tag" style="width:310px; float: right;">'+
                    '               </select>'+
                    '           </td>'+
                    '      </tr>'+
                    '      <tr style="height: 40px;">'+
                    '          <td class="label" style="vertical-align: bottom;">'+
                    '               <i class="iconPopup fas fa-comment-alt azulColor"></i> <span>Texto</span>'+
                    '          </td>'+
                    '          <td>'+
                    '               <input type="text" id="configDatesBox_text" style="width:290px; float: right;" value="'+textTag+'">'+
                    '           </td>'+
                    '      </tr>'+
                    '   </table>'+
                    '</div>';

    var btnDialogBoxPro =   [{
            text: (this_) ? 'Remover Prazo' : 'Remover Prazos',
            icon: 'ui-icon-closethick',
            click: function(event) { 
                setPrazoMarcador('remove', this_, form, href);
            }
        },{
            text: textControle+' Prazo',
            class: 'confirm',
            icon: 'ui-icon-tag',
            click: function() { 
                setPrazoMarcador('add', this_, form, href);
            }
        }];

    resetDialogBoxPro('dialogBoxPro');
    dialogBoxPro = $('#dialogBoxPro')
        .html('<div class="dialogBoxDiv"> '+htmlBox+'</div>')
        .dialog({
            title: (this_) ? textControle+' controle de prazo ('+processo+')' : 'Controle de prazo em processos ('+tblProcessos.find('input[type="checkbox"]:checked').length+')',
            width: 550,
            open: function() {
                var listaMarcadores = getOptionsPro('listaMarcadores');
                var listaMarcadores_unidade = getOptionsPro('listaMarcadores_unidade');
                if (listaMarcadores && listaMarcadores_unidade == $('#selInfraUnidades').val()) {
                    var htmlOptions = $.map(listaMarcadores, function(v){
                                        var selected = (tagName && tagName == v.name) ? 'selected' : '';
                                        return '<option data-img-src="'+v.img+'" value="'+v.value+'" '+selected+'>'+v.name+'</option>';
                                    }).join('');
                    $('#configDatesBox_tag').html(htmlOptions).chosenImage();
                } else {
                    var param = {};
                        form.find("input[type=hidden]").map(function () {
                            if ( $(this).attr('name') && $(this).attr('id').indexOf('hdn') !== -1) {
                                param[$(this).attr('name')] = $(this).val(); 
                            }
                        });
                    $.ajax({ 
                        method: 'POST',
                        data: param,
                        url: href
                    }).done(function (html) {
                        var $html = $(html);
                            listaMarcadores = getListaMarcadores($html).array;
                        var htmlOptions = $.map(listaMarcadores, function(v){
                                            var selected = (tagName && tagName == v.name) ? 'selected' : '';
                                            return '<option data-img-src="'+v.img+'" value="'+v.value+'" '+selected+'>'+v.name+'</option>';
                                        }).join('');
                        $('#configDatesBox_tag').html(htmlOptions).chosenImage();
                    });
                }
            },
            close: function() {
                if (this_) _this.closest('table').find('thead th a[onclick*="setSelectAllTr"]').data('index',1).trigger('click');
            },
            buttons: btnDialogBoxPro
    });
}
function setPrazoMarcador(mode, this_, form, href) {

    var _this = (this_) ? $(this_) : false;
    var tblProcessos = $('#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado');
    var _dateRef = $('#configDatesBox_date').val();
    var _timeRef = $('#configDatesBox_time').val();
    var _tagSelected = $('#configDatesBox_tag').val();
    var _textTag = $('#configDatesBox_text').val();
        _textTag = (_textTag != '') ? '\n'+_textTag : '';
    if (mode == 'add' && _dateRef == '') {
        alertaBoxPro('Error', 'exclamation-triangle', 'Selecione uma data!');
    } else {
        var param = {};
            form.find("input[type=hidden]").map(function () {
                if ( $(this).attr('name') && $(this).attr('id').indexOf('hdn') !== -1) {
                    param[$(this).attr('name')] = $(this).val(); 
                }
            });
            _dateRef = _dateRef+' '+(_timeRef != '' ? _timeRef : '23:59');
        var _dateTo = ($('#configDatesBox_duesetdate').is(':checked')) ? _dateRef : false;
        
        if (href && href != '') {
            tblProcessos.find('tr.infraTrMarcada td.prazoBoxDisplay').html('<i class="fas fa-sync fa-spin '+(isNewSEI ? 'brancoColor' : 'azulColor')+'"></i>');
            $.ajax({ 
                method: 'POST',
                data: param,
                url: href
            }).done(function (html) {
                var $html = $(html);
                var xhr = new XMLHttpRequest();
                var formTag = isNewSEI ? $html.find('#frmAndamentoMarcadorCadastro') : $html.find('#frmGerenciarMarcador');
                var hrefTag = formTag.attr('action');
                var dateSubmit = (_dateTo) ? 'Ate '+moment(_dateTo, 'YYYY-MM-DD HH:mm').format('DD/MM/YYYY HH:mm') : moment(_dateRef, 'YYYY-MM-DD HH:mm').format('DD/MM/YYYY HH:mm');
                    dateSubmit = dateSubmit+_textTag;
                var optionsMarcadores = getListaMarcadores($html);
                var selectTags = optionsMarcadores.array;
                var indexSelected = optionsMarcadores.indexSelected;
                // var tagSelected = (typeof selectTags[indexSelected] !== 'undefined') ? selectTags[indexSelected].value : selectTags[0].value;

                var paramTag = {};
                    formTag.find("input[type=hidden], textarea, button").map(function () {
                        if ( $(this).attr('name')) {
                            paramTag[$(this).attr('name')] = $(this).val(); 
                        }
                    });
                    paramTag['txaTexto'] = (mode == 'remove') ? '' : dateSubmit;
                    paramTag['hdnIdMarcador'] = _tagSelected;

                    var postDataTag = '';
                    for (var k in paramTag) {
                        if (postDataTag !== '') postDataTag = postDataTag + '&';
                        var valor = (k!='txaTexto') ? paramTag[k] : escapeComponent(paramTag[k]);
                            postDataTag = postDataTag + k + '=' + valor;
                    }
                    // console.log(postDataTag);

                if (hrefTag && hrefTag != '') {
                    $.ajax({ 
                        method: 'POST',
                        // data: paramTag,
                        data: postDataTag,
                        contentType: 'application/x-www-form-urlencoded; charset=ISO-8859-1',
                        xhr: function() {
                            return xhr;
                        },
                        url: hrefTag
                    }).done(function (htmlResult) {
                        if (xhr.responseURL != hrefTag) {
                            var $htmlResult = $(htmlResult);
                            var ids = paramTag['hdnIdProtocolo'];
                                ids = (ids.indexOf(',') !== -1) ? ids.split(',') : [ids];
                            var tagResult = $htmlResult.find('a[href*="andamento_marcador_gerenciar"]').map(function(){ 
                                var tagResultLink = getParamsUrlPro($(this).attr('href'));
                                if (tagResultLink && typeof tagResultLink.id_procedimento !== 'undefined' && $.inArray(tagResultLink.id_procedimento, ids) !== -1) {
                                    return {id_procedimento: tagResultLink.id_procedimento, html: this.outerHTML};
                                }
                            }).get();
                            
                            if (tagResult.length > 0) {
                                $.each(tagResult, function(i, v){
                                    var _dateConfig = moment(_dateRef, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD HH:mm:ss');
                                    var tr = $('tr#P'+v.id_procedimento);
                                    var td = tr.find('td').eq(1);
                                    td.find('a[href*="andamento_marcador_gerenciar"]').remove();
                                    td.append(v.html);
                                    if (mode == 'add') {
                                        var config = {
                                                            date: _dateConfig, 
                                                            dateDue: (_dateTo) ? _dateConfig : undefined, 
                                                            countdays: true, 
                                                            workday: false, 
                                                            duesetdate: _dateTo,
                                                            displayformat: 'DD/MM/YYYY HH:mm',
                                                            action: 'addControlePrazo(this)'
                                                        };
                                        var htmlDatePreview = getDatesPreview(config);
                                            tr.find('td.prazoBoxDisplay').html(htmlDatePreview);
                                            if ($(htmlDatePreview).hasClass('tagTableText_date_atrasado')) {
                                                // tr.css('background-color','#fff1f0');
                                                tr.addClass('infraTrAtrasada');
                                            } else if (moment(_dateRef, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD') == moment().format('YYYY-MM-DD')) {
                                                // tr.css('background-color','#fdf9df');
                                                tr.addClass('infraTrAlerta');
                                            } else {
                                                // tr.css('background-color','transparent');
                                                tr.removeClass('infraTrAlerta').removeClass('infraTrAtrasada');
                                            }
                                    } else {
                                        // tr.css('background-color','transparent');
                                        tr.removeClass('infraTrAlerta').removeClass('infraTrAtrasada');
                                        tr.find('td.prazoBoxDisplay').html('');
                                        setControlePrazo();
                                    }
                                });
                                if (this_) tblProcessos.find('thead th a[onclick*="setSelectAllTr"]').data('index',1).trigger('click');
                                setTimeout(function(){ 
                                    console.log('Reload tableHomeDestroy');
                                    tableHomeDestroy(true);
                                }, 500);
                            }
                        }
                    });
                }
            });
        }
        resetDialogBoxPro('dialogBoxPro');
    }
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
function configDatesSwitchChangePrazo(this_) {
    var _this = $(this_);
    var _parent = _this.closest('.ui-dialog');
    if (_this.is(':checked')) {
        _parent.find('.configDates_setdate').show();
        _parent.find('.configDates_duesetdate').show();
        _this.closest('tr').find('.iconSwitch').addClass('azulColor');
    } else {
        _parent.find('.configDates_setdate').hide();
        _parent.find('.configDates_duesetdate').hide();
        _this.closest('tr').find('.iconSwitch').removeClass('azulColor');
    }
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
function setControlePrazo(force = false) {
    var tblProcessos = $('#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado');
    if (
        tblProcessos.find('tbody tr').not('.tableHeader').find('td.prazoBoxDisplay').length == 0 ||
        tblProcessos.find('thead tr').find('th.prazoBoxDisplay').length < 2 ||
        force == true
        ) {
            tblProcessos.find('.prazoBoxDisplay').remove();
            tblProcessos.find('tbody tr').not('.tableHeader').append('<td class="prazoBoxDisplay" style="text-align: center;"></td>');

        if ( tblProcessos.find('thead').length > 0 ) {
            tblProcessos.find('thead tr').append('<th class="tituloControle tablesorter-header prazoBoxDisplay '+(isNewSEI ? 'infraTh' : '')+'" style="width: 140px;min-width: 140px;"> Prazos</th>');
        } else {
            $('#tblProcessosRecebidos tbody tr:first, #tblProcessosGerados tbody tr:first, #tblProcessosDetalhado tbody tr:first').find('.prazoBoxDisplay').remove();
            $('#tblProcessosRecebidos tbody tr:first, #tblProcessosGerados tbody tr:first, #tblProcessosDetalhado tbody tr:first').not('.tableHeader').append('<th class="tituloControle tablesorter-header prazoBoxDisplay '+(isNewSEI ? 'infraTh' : '')+'" style="width: 140px;min-width: 140px;"> Prazos</th>');
        }
    }
    tblProcessos.find('tbody tr').each(function(){
        var _tag = $(this).find('a[href*="andamento_marcador_gerenciar"]').attr('onmouseover');
        var _checkbox = $(this).find('input[type="checkbox"]');
        var _processo = $(this).find('a[href*="procedimento_trabalhar"]');
        var content = (typeof _tag !== 'undefined') ? _tag.match(RegExp(/(?<=(["']))(?:(?=(\\?))\2.)*?(?=\1)/, 'g')) : false;
            content = (content && content !== null && content.length > 0 && content[0] != '') ? content[0] : false;
        var dateTo = (content && removeAcentos(content).toLowerCase().indexOf('ate') !== -1) ? true : false;

        var dateContent = (content) ? content.match(/(0[1-9]|[1-2][0-9]|3[0-1])\/(0[1-9]|1[0-2])\/[0-9]{4}/img) : null;
        var timeContent = (content) ? content.match(/(\d{1,2}:\d{2})/img) : null;
        var dateTag = (dateContent !== null) ? dateContent[0]+' '+(timeContent !== null ? timeContent[0] : '23:59') : false;
            dateTag = (dateTag) ? moment(dateTag,'DD/MM/YYYY HH:mm') : false;

        // var dateTag = (content && content.indexOf(' ') !== -1) ? content.split(' ')[1] : (content) ? content : false;
            // dateTag = (dateTag && dateTag != '') ? moment(dateTag,'DD/MM/YYYY') : false;
        var linkParams = getParamsUrlPro(_processo.attr('href'));
        var id_procedimento = (linkParams && typeof linkParams.id_procedimento !== 'undefined') ? linkParams.id_procedimento : false;
        var processo = _processo.text();
        if (dateTag && dateTag.isValid()) {
            var config = {
                                date: dateTag.format('YYYY-MM-DD HH:mm:ss'), 
                                dateDue: (dateTo) ? dateTag.format('YYYY-MM-DD HH:mm:ss') : undefined, 
                                dateMaxProgress: 30,
                                countdays: true, 
                                workday: false, 
                                duesetdate: dateTo,
                                displayformat: 'DD/MM/YYYY HH:mm',
                                action: 'addControlePrazo(this)'
                            };
            var htmlDatePreview = getDatesPreview(config);
            $(this).find('td.prazoBoxDisplay').html(htmlDatePreview);
            if ($(htmlDatePreview).hasClass('tagTableText_date_atrasado')) {
                // $(this).css('background-color','#fff1f0');
                $(this).addClass('infraTrAtrasada');
            } else if (dateTag.format('YYYY-MM-DD') == moment().format('YYYY-MM-DD')) {
                // $(this).css('background-color','#fdf9df');
                $(this).addClass('infraTrAlerta');
            }
        } else if (!_checkbox.is(':disabled')) {
            var htmlDateAdd =   '<a class="addControlePrazo" onclick="addControlePrazo(this)">'+
                                '   <i class="fas fa-clock azulColor"></i>'+
                                '   <span style="font-size: 9pt;color: #666;font-style: italic;">Adicionar prazo</span>'+
                                '</a>';
            $(this).find('td.prazoBoxDisplay').html(htmlDateAdd);
        }
    });
}
function initControlePrazo(force = false, TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    if (typeof checkConfigValue !== 'undefined' && typeof moment == 'function') { 
        if (checkConfigValue('gerenciarprazos')) {
            setControlePrazo(force);
        }
    } else {
        setTimeout(function(){ 
            initControlePrazo(force, TimeOut - 100); 
            console.log('Reload initControlePrazo'); 
        }, 500);
    }
}
function getAllMarcadoresHome() {
    var arrayMarcadores = [];
    $('#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado').find('tr').each(function(){
        var _processo = $(this).find('a[href*="acao=procedimento_trabalhar"]');
        var _marcador = $(this).find('a[href*="acao=andamento_marcador_gerenciar"]');
        var marcador = false;

        if (_processo.length > 0 && _marcador.length > 0) {

            var _tags = (typeof _marcador.attr('onmouseover') !== 'undefined') ? _marcador.attr('onmouseover').match(RegExp(/(?<=(["']))(?:(?=(\\?))\2.)*?(?=\1)/, 'g')) : false;
            var tagName = (_tags && _tags !== null && _tags.length > 0 && _tags[2] != '') ? _tags[2] : false;
            var textName = (_tags && _tags !== null && _tags.length > 0 && _tags[0] != '') ? _tags[0] : false;

            arrayMarcadores.push({
                id_procedimento: getParamsUrlPro(_processo.attr('href')).id_procedimento,
                icon: _marcador.find('img').attr('src'),
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
            console.log('Reload initAllMarcadoresHome'); 
        }, 500);
    }
}
function initUrgentePro() {
    $('a div.urgentePro').remove();
    $('a[href*="controlador.php?acao=procedimento_trabalhar"][onmouseover*="(URGENTE)"]')
        .prepend('<div class="urgentePro"></div>')
        .addClass('urgentePro')
        .closest('tr')
        .addClass('urgentePro');
}
function initSeiPro() {
	if ( $('#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado').length > 0 ) {
        $.getScript((URL_SPRO+"js/lib/jquery-table-edit.min.js"));
        $.getScript((URL_SPRO+"js/lib/moment-duration-format.min.js"));
        initTableSorterHome();
        insertGroupTable();
        replaceSelectAll();
        initPanelFavorites();
        checkLoadConfigSheets();
        insertDivPanel();
        initNewTabProcesso();
        forceOnLoadBody();
        observeAreaTela();
        initReplaceSticknoteHome();
        initReplaceNewIcons();
        initControlePrazo();
        initAllMarcadoresHome();
        initUrgentePro();
	} else if ( $("#ifrArvore").length > 0 ) {
        initDadosProcesso();
        initObserveUrlChange();
        checkLoadConfigSheets();
        //observeHistoryBrowserPro();
	}
    initReloadModalLink();
}
$(document).ready(function () { initSeiPro() });