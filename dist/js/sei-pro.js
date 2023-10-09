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
var pathArvore = typeof isNewSEI !== 'undefined' && isNewSEI ? '/infra_js/arvore/24/' : '/infra_js/arvore/';
var elemCheckbox = typeof isNewSEI !== 'undefined' && isNewSEI ? '.infraCheckboxInput' : '.infraCheckbox';

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
            if(verifyConfigValue('debugpage')) console.log('Reload handleClientLoadPro'); 
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
    } else if (acaoType == 'arrivaldate' || acaoType == 'acessdate' || acaoType == 'senddate' || acaoType == 'senddepart' || acaoType == 'createdate' || acaoType == 'acompanhamentoesp') {
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
                tag = ( acaoType == 'acompanhamentoesp' ) 
                        ? typeof getArrayProcessoRecebido($(this).attr('href')).acompanhamentoesp !== 'undefined' ? getArrayProcessoRecebido($(this).attr('href')).acompanhamentoesp : ''
                        : tag;
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
        tableProc.find('#lnkInfraCheck').after('<a onclick="setSelectAllTr(this);" onmouseover="updateTipSelectAll(this)" onmouseenter="return infraTooltipMostrar(\'Selecionar Tudo\')" onmouseout="return infraTooltipOcultar();"><img src="/infra_css/'+(typeof isNewSEI !== 'undefined' && isNewSEI ? 'svg/check.svg': 'imagens/check.gif')+'" class="infraImg"></a>').remove();
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
function removeAllTags() {
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
    if (isNewSEI) $('#divTabelaProcesso').removeClass('displayInitial');

    $('#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado')
        .trigger('filterReset')
        .trigger('update')
        .find('.filterTableProcessos').removeClass('newLink_active');
    initControlePrazo();
    initViewEspecifacaoProcesso();
    addAcompanhamentoEspIcon();
    tableHomeDestroy(true);
}
function getTagName(tagName, type) {
	var tagName_ = (typeof tagName !== 'undefined' && tagName != '' ) ? removeAcentos(tagName).replace(/\ /g, '') : 'SemGrupo' ;
		tagName = (typeof tagName === 'undefined' && tagName == '' ) ? ' ' : tagName;
        tagName = ( (type == 'arrivaldate' || type == 'acessdate' || type == 'senddate' || type == 'createdate' || type == 'deadline') && tagName.indexOf('.') !== -1 ) ? tagName.split('.')[1] : tagName;
        tagName = ( type == 'tags' && tagName.indexOf('#') !== -1 ) ? tagName.replace(extractHexColor(tagName),'') : tagName;
    return tagName_;
}
function getUniqueTableTag(i, tagName, type) {
	var tagName_ = getTagName(tagName, type);
    var txtTagName = ( (type == 'arrivaldate' || type == 'acessdate' || type == 'senddate' || type == 'createdate' || type == 'deadline') && tagName.indexOf('.') !== -1 ) ? tagName.split('.')[1] : tagName;
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
					+'<th class="tituloControle '+(isNewSEI ? 'infraTh' : '')+'" colspan="'+(countTd+2)+'">'+txtTagName+collapseBtn+'</th>'
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
            var txt_desc = (typeof desc[0] !== 'undefined') ? desc[0].replace("return infraTooltipMostrar('", "") : '';
            var txt_tipo_proc = (typeof desc[1] !== 'undefined') ? desc[0].replace("return infraTooltipMostrar('", "") : '';
            var editDesc = '<a class="newLink newLink_active followLink followLinkDesc content_btnsave" onclick="editFieldProc(this)" style="right: 0;top: 0;" onmouseover="return infraTooltipMostrar(\'Editar descri\u00E7\u00E3o\');" onmouseout="return infraTooltipOcultar();"><i class="fas fa-edit" style="font-size: 100%;"></i></a>';        
    		var htmlDesc = (type == 'all')
                ? '<td class="tagintable" data-old="'+txt_desc+'"><span class="info">'+txt_desc+'</span>'+editDesc+'</td>'
                : '<td class="tagintable" data-old="'+txt_desc+'"><span class="info">'+txt_desc+'</span>'+editDesc+'</td><td class="tagintable">'+desc[1].replace("');","")+'</td>';
            var dataRecebido = getArrayProcessoRecebido($(this).find('td').eq(2).find('a').attr('href'));
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
    var storeRecebimento = (typeof localStorageRestorePro !== 'undefined' && typeof localStorageRestorePro('configDataRecebimentoPro') !== 'undefined' && !$.isEmptyObject(localStorageRestorePro('configDataRecebimentoPro')) ) ? localStorageRestorePro('configDataRecebimentoPro') : [];
    var id_procedimento = (typeof getParamsUrlPro !== 'undefined') ? String(getParamsUrlPro(href).id_procedimento) : false;
    var dadosRecebido = (typeof jmespath !== 'undefined' && jmespath.search(storeRecebimento, "[?id_procedimento=='"+id_procedimento+"'] | length(@)") > 0) ? jmespath.search(storeRecebimento, "[?id_procedimento=='"+id_procedimento+"'] | [0]") : '';
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
        // console.log('selectGroup',selectGroup);
    } else {
        if (mode == 'remove') {
            localStorageRemovePro('selectGroupTablePro');
            console.log('localStorageRemovePro');
        } else {
            localStorageStorePro('selectGroupTablePro', [{unidade: unidade, selected: valueSelect}]);
            // console.log('selectGroup',[{unidade: unidade, selected: valueSelect}]);
            // console.log('NOT',{unidade: unidade, selected: valueSelect});
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
            // console.log('selectGroupTablePro', [{unidade: unidade, selected: selectGroup}]);
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
            var statusTableAcompEsp =       ( storeGroupTablePro() == 'acompanhamentoesp' ) ? 'selected' : '';
            var statusTableAll =            ( storeGroupTablePro() == 'all' ) ? 'selected' : '';
            var filterTableHome = selectFilterTableHome();
            var panelKanbanHome = selectPanelKanbanHome();
            var htmlControl =    '<div id="newFiltro">'+
                                 '  '+filterTableHome+
                                 '  '+panelKanbanHome+
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
                                 '     <option value="acompanhamentoesp" '+statusTableAcompEsp+'>Agrupar processos por acompanhamento especial</option>'+
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
            if(verifyConfigValue('debugpage')) console.log('Reload insertGroupTable'); 
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
        }
        setTimeout(function(){ 
            initChosenFilterHome(TimeOut - 100); 
            if(verifyConfigValue('debugpage')) console.log('Reload initChosenFilterHome'); 
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

        if (!valueSelect || valueSelect == 'all' || valueSelect == '') {
            setOptionsPro('panelProcessosView', 'Tabela');
            setTimeout(function(){ 
                $('#processosProActions').find('.btn[data-value="Tabela"]').trigger('click');
            }, 500);
        } 

        if (getOptionsPro('panelProcessosView') == 'Quadro') {
            addKanbanProc(valueSelect);
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
	removeAllTags();
	if ( type != '' ) {
        $('#divRecebidos thead').hide();
		appendGerados(type);
		getTableTag(type);
		getTableOnTag(type);
	}
    initNewTabProcesso();
    setTimeout(function(){ 
        forcePlaceHoldChosen();
        urgenteProMoveOnTop();
        checkboxRangerSelectShift();
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
                '   <option value="all" data-type="clean">Todos os processos</option>'+
                '   <option value="(N\u00E3o visualizado)" data-type="proc">Processos n\u00E3o visualizados</option>';

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
            if(verifyConfigValue('debugpage')) console.log('Reload initDadosProcesso'); 
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
function initNewBtnHome() { 
    var base64IconReaberturaPro = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAADINJREFUeJy9mQl0FPUdx78zszN7ZHPsJiEhJCSYGA4NICKgQsAqikUt+jxqW/Wp9VXp06ctWqx39Xk8j2rVCr4qVq3iUVGf2op4RYqCypNAguQgJ9lNskd2s9fsXP39Zw9ycfQ96/+9X2ZmZ+Y/n//vnokFRz+4tBhp+VGGZeTBjnWoN3RMJYxSXhBLLFZ7iSDmlQhSXoloc5UGPHv2XH1/6LqmDuyny7UfFZDgZrsq5n+SN+V0QXSUwWIvg+gopW0RLFIe6c6GweZnStb+4o5Hr3zQ+K2q4QDdpk80ac0UcE9cD1uuHXk8jwKSyfRzTnc/dv/8T+Z9R704E/CDh8BbROsjVUufEywi3avRHPownfme9pNAnIQTUDzzMixb2XPO7QfW73vvSzzxwDVQJBEFooBqgjiOpEawOCoEKb/MYi0otObV5NkKap3W/Bqe50WgYW074DuPJm4hUY8asDgfK4trz11usbqAyGspxXBc6orMls2X2Iyy+Xdyl4a6b7j4gvivHHlT7aJjslPMKReknKmkcdK21QpBNGjFBnlKhO4Lk8dGoSatcLpqKn9zrm/1+UvQpGn4euWt2EUXKIcF/PJpmjPHtbbsxHuAWAOxqaPBsoA0jCB4YzNqz3xZgh4thTFE14fo9wC0eAeSsa1IhEK0DUGJhyBHArSNQ1NFCFIRcotnWu68c/lqXirU+3b9JbJo1v5VXzVjG82cPCSgpqPMVfXTE3lLDmmvczzYyK1Bwav3k1L+Zv40PNCOvqZPwIuFkHJrIDmrSaZDcpfDmVMO0VlB2sxFKuh1WnsScdnQrVYr39/6tsMX2n8GnWgiGTwk4HAMim5YklCDVugTmHYiTdJ+yLsP/gN9qF6xGRZbCUy/NzQczEBcOilFU/sMUYsjmeR1URS4cLBP8wYwYtJDACYUyLoSkwEh19QQk4y20jAG5R5NlaEp9IB4GLGQB7GIjqrTXgEPP3kRuRInIuXSYnp/zJY7mNEMNcJ5B4LxSBzkI4c2rwkYCCOhJqMJc3KmQdJA2NeJSKCbYEIwODudckGwFpOmiiHmHA972QoUT14MXm+my0MpCCMNlwWzjACUzH1NjiIWc+hWLo7WziC7MUAiHxbwna2QFy8eTrA0wgCHvN8jFHOgYNpquJ1FBOYkB7eCFxh7IrVggwLP+Iquj6S1loGzjIYdpUGRAsZn+Hw5iVxuWOr0qAwwiCPkRMu726A/oEQpF6QAw4E+lNdvhKC+Q6d7AEpuZsbSuNF+SMY17zHSgMYEoNxoUCXeB7/flSi3e/J7B024IwOyP6o8HDInI0BdF4gpRrfFJg6QzOCYOzBhaYwbDZsRQzwITJBqoh+JhFVNhDoMAiTnNX3wsHU9BZjwZzVoUEnj9CGMi2imySzc6CCCoacVwczPj4bMABKsrgQMjqtAONitku8z/4scDaChysGQGbwMioIZKi2OUn0WKgPEjsdqdSSo+SyWblTSFAfPgAj/kB0JmRauy0hEJE7l1ZyBwZ7kYAg+ujh6OLisBg3DCKnyEPhkHLzkJsBwOqIxMdhYbaYHu+Prrj5sbuxF+6AMe24BCpwuVLqmoa5kLiorTuFCoVCBV79GX3PzwrPa29v/89prG/0p1U+syRQgECIzw4gFIdqrCDB0EPBwiXsE3GftbfjzFw3Y6x+AaDENAyWo0jTsuTySiox5pQvxy5lXoXJyFX/22WXzenp63qmoqFj/wgsb7vb5fH5M0B2lsqeBkBL3U1wEYXGfRIDDKcCM9g61JVHIFdb+6z18uL8dFkGAnTULci6WVP4aq+avQO3kKjgRx/CwF12KgcYDTQj2hOFIDMBVkC8sWHDSakmSFrz66qtXdnTs34sxUZ3VoCIHKFhCkGwFBNiLCTuaMVuNFnH7Rx/i0+4u2CTqHwi8WJyL2895DKfMqILAs2vo8pfOh5MApSt2otw1E7JmoMfjReuubXByMmpqquevWrXqmQ0bnr96aGiofSRk2gfJxDJ1IMkYcqz5BNhKs47RVgZsxPGm5j34uLsTkiiZx4Jhx5OX/BW1paXpBVASokepi++CQp1NgvJpnLJSjCQnrxSLzzgHWz58D3Z6bm3tjFPr65f9/t13376bbvVmfDILqCXDBBin7pl1NcpoqPRFI4MlIst49rudpDlb1hynV68YBZfUmBiQJy1E3J2CiyYNePoH8eT9t+CK627Geeeei3++vhGTHFbu1FNPu7y5uWl7W1vrRpoilgWkyUKaEoaqKeTgtoMBchjz7un3IEoBkAqIlLnnlc8fpTmF4JKsz2WisMbcgI8S4H1rrkTb94244Ko/QKZesW7JGWht2IwpU46x1dXNvZAAt9I0rUinfgJjGhyiaiaZfjMuxYzd0tg9MGBqj0sDy8koji2enoVj2pPTJjXNyuCCEVx38RJEwiE8/PIXcJdMRbvPwCk1k9HSOIlcxYFZs+Yt3LTpjbk0ZSdJ0gSMyxjSyAcFG5knGZw4gseY2xePZbXHBguQfHvhCDgjCxelRN22vwO3rb7IvO6+5zabcKqe0q7E8Zg0dSqSXR6Ul1e7XC73icFgYAtNGzCf0D2A8LEUxRZbES0/NK7MUSLHvqAfSqZXpAkZoGC2OAdHMDZEYLwZpUmVg10sQUdnF55/6kE07txuau6e9e+jqGwa5UUNOnVQDDIe9qOkQEJnm4Lc3GKutLR0OgHmsylNwOufQHznie0xd9E8Bwh0XJkj2dS2Dx/6h2Cl1osNek2DVbRm4dx5BVjz/pXUNnCmP7qlaqw98x94+/WXcMnPlmPO9Ao88NDDuOOaFexu2J35+OO6LbBSpbG+tJxeC3PQ4boNDkc+bDZ61wXYuwKXCRIko54Bi6OkCnJwXJAwP7tlznxYmxuxJRSBQ7Jj7LBYHWlT68jhK3DtyU9RxALT5y7GvfetgWTPxeq71tF5nnxepx7TBtGWaz7KvvRG7PUlIQxItHALVFVl2jFzV8aJDF3XBkU7AcZ2TliHBdreNPN4xL9twNe6OEp7mcFcwaAqck3943RLvulfx81fintf3AaNwHQwOJhmNYX2Cx00d93l6Pi2Bc5IhJqMGKhesxSjjQRkLP0iRRH15akfyMzUHSI83EtlyoPIcD/2tPrC4X2qby+fx806a/a0nLTWMkOV7bhh6XPgOZcJl4IhaDKUro8AGyFzp3DojVOeo8pSnV+F1tadel/fAQ/SrdhBQHr106K9CARaCWrA6OsfTO7r8g/v7dL8e7vg3b4XXYNDrMUG1cFwv+5qufSEk2dd6LDaWc1BJMLj2kWPmHAsvaQAjKymxsHRb9VFHCpcHLYGkjD8w7AeY0dT0zdDqqr00ZShkYCGnETzaxvW7P7sOyPZSK+73f3opVcpBtSVggJbFeuAWQ+ndLw4uEO0tHJ1C6ZfKEcVLCq6B4XOSkQS6fKWgZtI6Hw5lfwl1TxaYhp2ff4paiYdizi9MTY0fNBN87OmITzKxMtuxDri3EO7zG5sBYNpIOYPStonsj2bFjY8xmfOW4WSvPmrZqysSgQOYHdXP06qKUU0wcMbnhiOp6RwQjlHpuXRKRNceycKEnbklxbizTefjra0UCQCTJKjANOa+STjTjjyd0D9++/2ddQvWPagNDVnnTNPRO/uLdgunIU5lYVYUCXCG6IiTxp17XwUtoQXsdMfwYxJHBRyiu8iKto6OhDc0YQT6urR3r5bf+XVdY2yLLMy14Z0bzgS0MARXqInGNqzz65/maJ3+qJFC2/KEzkEv3oLX3TPQNmcRSh1WuB2CyiyeGDh+qA4NXwbNhCMJ9Dy+ScoFYow9/h6eL2deOyxm1v6vZ6Pac5PSYYzD7Ac+tlHPWLPP//c/Yqi5NXVzb7M7S6W1JAXBz56Ax431df8AogFl5EaaTVf7oAyFIYY03F8+RxKyk60tOzUH3/81pZdu775N821CSmfz1ruhwA0NE3zU9t+W3390rb6+p/8btq0GcVlxZMgCDZ6jdBgROldh5eoQrhhL66EhWp4mMrbBx/8PbJx4/o9Xq+HudbbSH1IGvU57ocANCFJBhoaPn+msXHX17Nnz72otva4ZdOOmVlZWDjZZrPmEmCSErCfzNkjNzV/E9yx/dOuzq6OXaqisM9vDUhlinHfCn8owAxkmFr2rQ0Nn7Vu3drwlruw8IRcZ24N1dZi0rIYjUaSVCUCtO0lv2VfWZnGOpDyuQk/J/+QgBlIVoq6dV0/4Bsc3EbipGMmYhoikQZilULB0XxZ+D8NLQ3BZOS3k//pXxj/BQ18QshF3DfVAAAAAElFTkSuQmCC';
    var lastCheck = getOptionsPro('lastcheck_AcompEsp');
        lastCheck = (lastCheck) ? ' <br>(\u00DAltima verifica\u00E7\u00E3o em: '+moment(lastCheck, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY HH:mm')+')' : false;
    var title = 'Reabertura Programada de Processos'+lastCheck;
    var iconBoxSlim = localStorage.getItem('seiSlim');
    var htmlBtn =   '<a tabindex="451" class="botaoSEI iconReaberturaPro '+(iconBoxSlim ? 'iconBoxSlim' : '')+' iconPro_reopen" onmouseout="return infraTooltipOcultar();" onmouseover="return infraTooltipMostrar(\''+title+'\')" onclick="checkDadosAcompEspecial(true);" style="position: relative; margin-left: -3px;">'+
                    '    <img class="infraCorBarraSistema" src="'+base64IconReaberturaPro+'" title="'+title+'">'+
                    '</a>';
    $('#divComandos').find('.iconReaberturaPro').remove();
    $('#divComandos').append(htmlBtn);
}
function initNewTabProcesso(TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    if (typeof verifyConfigValue !== 'undefined') { 
        getNewTabProcesso();
    } else {
        setTimeout(function(){ 
            initNewTabProcesso(TimeOut - 100); 
            if(verifyConfigValue('debugpage')) console.log('Reload initNewTabProcesso'); 
        }, 500);
    }
}
function getNewTabProcesso() { 
    if (verifyConfigValue('reaberturaprogramada')) initNewBtnHome();

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

        var htmlBtnTypes =  (checkConfigValue('gerenciarprazos')) ? 
                            '<a class="botaoSEI botaoSEI_hide '+(iconLabel ? 'iconLabel' : '')+' '+(iconBoxSlim ? 'iconBoxSlim' : '')+' iconPro_Observe iconPrazo_new" '+(iconLabel ? '' : 'onmouseout="return infraTooltipOcultar();" onmouseover="return infraTooltipMostrar(\'Alterar informa\u00E7\u00F5es do processso\')"')+' onclick="dialogChangeTypeProc()" style="position: relative; margin-left: -3px;">'+
                            '    <img class="infraCorBarraSistema" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" title="Alterar informa\u00E7\u00F5es do processso">'+
                            '    <span class="botaoSEI_iconBox">'+
                            '       <i class="fas fa-info-circle" style="font-size: 17pt; color: #fff;"></i>'+
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
                            '       <i class="fas fa-file-upload" style="font-size: 17pt; color: #fff;"></i>'+
                            '    </span>'+
                            (iconLabel ?
                            '    <span class="newIconTitle">Enviar documentos em processos</span>'+
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

        var htmlBtnNaoLido =  (checkConfigValue('marcar_naolido')) ? 
                            '<a class="botaoSEI botaoSEI_hide '+(iconLabel ? 'iconLabel' : '')+' '+(iconBoxSlim ? 'iconBoxSlim' : '')+' iconPro_Observe iconNaoLido" '+(iconLabel ? '' : 'onmouseout="return infraTooltipOcultar();" onmouseover="return infraTooltipMostrar(\'Marcar como n\u00E3o visualizado\')"')+' onclick="getProcessoNaoLido()" style="position: relative; margin-left: -3px;">'+
                            '    <img class="infraCorBarraSistema" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" title="Marcar como n\u00E3o visualizado">'+
                            '    <span class="botaoSEI_iconBox">'+
                            '       <i class="far fa-eye-slash" style="font-size: 17pt; color: #fff;"></i>'+
                            '    </span>'+
                            (iconLabel ?
                            '    <span class="newIconTitle">Marcar como n\u00E3o visualizado</span>'+
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

                    '</a>'+htmlBtnAtiv+htmlBtnPrazo+htmlBtnTypes+htmlBtnUpload+htmlBtnNaoLido;
                    
        $('#divComandos').find('.iconPro_Observe').remove();
        $('#divComandos').append(htmlBtn);
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
function initPanelFavorites(TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    if (typeof localStorageRestorePro !== 'undefined' && typeof setPanelFavorites !== 'undefined' && typeof orderDivPanel !== 'undefined') { 
        if (checkConfigValue('gerenciarfavoritos') && typeof getStoreFavoritePro() !== 'undefined' && getStoreFavoritePro().hasOwnProperty('favorites')) {
            setTimeout(function(){ 
                setPanelFavorites('insert');
                if(verifyConfigValue('debugpage')) console.log('setPanelFavorites');
            }, 500);
        }
    } else {
        setTimeout(function(){ 
            initPanelFavorites(TimeOut - 100); 
            if(verifyConfigValue('debugpage')) console.log('Reload initPanelFavorites'); 
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
            // console.log('handleClientLoadPro');
        }
    } else {
        setTimeout(function(){ 
            checkLoadConfigSheets(TimeOut - 100); 
            if(verifyConfigValue('debugpage')) console.log('Reload checkLoadConfigSheets'); 
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
        } 
    } else {
        setTimeout(function(){ 
            initSortDivPanel(TimeOut - 100); 
            if(verifyConfigValue('debugpage')) console.log('Reload initSortDivPanel => '+TimeOut); 
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
            if(verifyConfigValue('debugpage')) console.log('Reload initTableSorterHome'); 
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
                        if(verifyConfigValue('debugpage')) console.log('Reload tableHomeDestroy *****');
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
function tableHomeDestroy(reload = false, tableHomeTimeout = 3000) {
    if (tableHomePro.length > 0) {
        $.each(tableHomePro, function(i){
            tableHomePro[i].trigger("destroy");
        });
        $('.filterTableProcessos').remove();
        window.tableHomePro = [];
        if (reload && tableHomeTimeout > 0) {
            initTableSorterHome();
            if(verifyConfigValue('debugpage')) console.log('Reload initTableSorterHome => '+tableHomeTimeout);
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
        if(verifyConfigValue('debugpage')) console.log('Reload forceTableHomeDestroy => '+TimeOut);
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
            if(verifyConfigValue('debugpage')) console.log('Reload observeAreaTela'); 
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
            if(verifyConfigValue('debugpage')) console.log('Reload initReplaceSticknoteHome'); 
        }, 500);
    }
}
function initFullnameAtribuicao(TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    if (typeof checkConfigValue !== 'undefined') { 
        if (verifyConfigValue('nomesusuarios')) {
            fullnameAtribuicao();
        }
    } else {
        setTimeout(function(){ 
            initFullnameAtribuicao(TimeOut - 100); 
            if(verifyConfigValue('debugpage')) console.log('Reload initFullnameAtribuicao');  
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
            if(verifyConfigValue('debugpage')) console.log('Reload initViewEspecifacaoProcesso'); 
        }, 500);
    }
}
function initFaviconNrProcesso(TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    if (typeof Favico !== 'undefined') { 
        if (checkConfigValue('contadoricone')) {
            getFaviconNrProcesso();
        }
    } else {
        setTimeout(function(){ 
            initFaviconNrProcesso(TimeOut - 100); 
            if(verifyConfigValue('debugpage')) console.log('Reload initFaviconNrProcesso'); 
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
            if(verifyConfigValue('debugpage')) console.log('Reload initReloadModalLink'); 
        }, 500);
    }
}
function initReplaceNewIcons(TimeOut = 9000) {
    if (typeof isNewSEI !== 'undefined' && isNewSEI) $('#divComandos a').addClass('botaoSEI');
    if (localStorage.getItem('seiSlim') === null || (TimeOut <= 0 || parent.window.name != '')) { return; }
    if (typeof replaceNewIcons === 'function') {
        replaceNewIcons(isNewSEI ? $('.barraBotoesSEI a.botaoSEI') : $('.infraBarraComandos a.botaoSEI'));
    } else {
        setTimeout(function(){ 
            initReplaceNewIcons(TimeOut - 100); 
            if(verifyConfigValue('debugpage')) console.log('Reload initReplaceNewIcons => '+TimeOut); 
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
            if(verifyConfigValue('debugpage')) console.log('Reload initObserveUrlChange => '+TimeOut); 
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
function selectPanelKanbanHome() {
    var type = storeGroupTablePro();
        type = (!type || type == 'all' || type == '') ? false : true;
        type = true;
    var html =  '<div id="processosProActions" class="panelHome panelHomeProcessos" style="'+(type ? '' : 'display:none;')+' position: absolute;z-index: 999;right: 0;width: auto;margin: 15px 0 0 0;">'+
                '    <div class="btn-group processosBtnPanel" role="group" style="float: right;margin-right: 10px;">'+
                '       <button type="button" onclick="getPanelProc(this)" data-value="Tabela" class="btn btn-sm btn-light '+(getOptionsPro('panelProcessosView') == 'Tabela' || !getOptionsPro('panelProcessosView') ? 'active' : '')+'"><i class="fas fa-table" style="color: #888;"></i> <span class="text">Tabela</span></button>'+
                '       <button type="button" onclick="getPanelProc(this)" title="D\u00EA um duplo clique para atualizar o quadro" ondblclick="removeDataPanelProc(this)" data-value="Quadro" class="btn btn-sm btn-light '+(getOptionsPro('panelProcessosView') == 'Quadro' ? 'active' : '')+'"><i class="fas fa-project-diagram" style="color: #888;"></i> <span class="text">Quadro</span></button>'+
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
                        no_results_text: 'Nenhum resultado encontrado'
                    }).trigger('chosen:updated');
                }
                setTimeout(function(){ 
                    addKanbanProc();
                }, 500);
        } else {
            addKanbanProc();
        }
    } else {
        $('#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado').show();
        $('#processosKanban').remove();
        initTableTag(storeGroupTablePro());
    }
    setOptionsPro('panelProcessosView', mode);
}
function addKanbanProc(type = storeGroupTablePro(), loop = 3) {
    if (!type || type == 'all' || type == '') {
        setOptionsPro('panelProcessosView', 'Tabela');
        $('#processosProActions').find('.btn[data-value="Tabela"]').trigger('click');
    } else {
        var tableProc = $('#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado');
        if (type == 'users') {
            if (getOptionsPro('arrayListUsersSEI') && getOptionsPro('arrayListUsersSEI').length > 0) {
                $('#processosProActions [data-value="Quadro"] i').attr('class','fas fa-project-diagram');
                var itensKanban = $.map(getOptionsPro('arrayListUsersSEI'),function(v){
                    var nameuser = (checkConfigValue('nomesusuarios') && v.name.indexOf('-') !== -1) 
                        ? v.name.split('-')[1].trim().split(/(\s).+\s/).join("") 
                        : (v.name.indexOf('-') !== -1) 
                            ? v.name.split('-')[0].trim() 
                            : v.name
                    return nameuser;
                });
                itensKanban.unshift('');
            } else if (loop > 0) {
                getAjaxListaAtribuicao();
                setTimeout(function(){ addKanbanProc(type, loop-1); }, 2000);
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
                setTimeout(function(){ addKanbanProc(type, loop-1); }, 2000);
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
                    var nameLabel = jmespath.search(itensKanban, "[?id=='"+tagName+"'] | [0].name");
                        nameLabel = nameLabel !== null && nameLabel != ''  ? nameLabel : 'Sem Grupo';
                    var linkProc = $(this).find('a[href*="acao=procedimento_trabalhar"]');
                    var tip = extractTooltipToArray(linkProc.attr('onmouseover'));
                        tip = (typeof tip !== 'undefined') ? tip : false;
                    var id_protocolo = getParamsUrlPro(linkProc.attr('href')).id_procedimento;
                    if (typeof id_protocolo !== 'undefined') {
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
                            html_prazo: $(this).find('td.prazoBoxDisplay').html(),
                            color: $(this).data('color') ? $(this).css('color') : false
                        }
                    }
            }).get();

            $('#processosKanban').remove();
            $('#newFiltro').after('<div id="processosKanban" style="display: inline-block;margin-top: 60px;width: 100%;"></div>');

            var bords_list = $.map(itensKanban, function(v, i){
                var item = jmespath.search(itens, "[?id=='id_"+v.id+"']");
                var title = v.name == '' ? 'Sem Grupo' : v.name;
                    title = ((type == 'arrivaldate' || type == 'acessdate' || type == 'senddate' || type == 'createdate' || type == 'deadline') && title.indexOf('.') !== -1 ) ? title.split('.')[1] : title;
                var order_board = getOptionsPro('panelProcessosOrder_'+type) ? jmespath.search(getOptionsPro('panelProcessosOrder_'+type), "[?id=='"+v.id+"'] | [0].order") : i;
                    order_board = order_board === null ? 9999 : order_board;
                var collapse_board = getOptionsPro('panelProcessosOrder_'+type) ? jmespath.search(getOptionsPro('panelProcessosOrder_'+type), "[?id=='"+v.id+"'] | [0].collapse") : null;
                    collapse_board = collapse_board === null ? false : collapse_board;

                var itens_board = $.map(item,function(value, index){

                    var iten_urgente = value.especificacao && value.especificacao.toLowerCase().indexOf('(urgente)') !== -1 ? true : false;
                    var item_pinboard = false;
                    var order_item = getOptionsPro('panelProcessosOrder_'+type) ? jmespath.search(getOptionsPro('panelProcessosOrder_'+type), "[?id=='"+v.id+"'].itens | [0] | [?id=='"+value.id_protocolo+"'] | [0]") : index;
                        item_pinboard = order_item === null ? item_pinboard : order_item.pinboard;
                        order_item = order_item === null ? 9999 : order_item.order;
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
                            var idUser = jmespath.search(arrayListUsersSEI, "[?contains(name,'"+targetEl+"')] | [0].value");
                                idUser = idUser !== null ? idUser : false;
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

                        var arrayMarcador = listMarcadores ? jmespath.search(listMarcadores, "[?name=='"+targetEl+"'] | [0]") : false;  
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
                                    var styleMarcador = arrayListMarcadores && valueMarcador ? jmespath.search(arrayListMarcadores, "[?icon=='"+arrayMarcador.img+"'] | [0].style") : null;
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
                            var idTypeProc = (typeof arrayListTypesSEI.selectTipoProc !== 'undefined') ? jmespath.search(arrayListTypesSEI.selectTipoProc,"[?name=='"+titleSource+"'] | [0].value") : null;
                                idTypeProc = idTypeProc !== null ? idTypeProc : false;
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
        infraTooltipOcultar();
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
        if (_this.closest('.kanban-item').length) {
            var id = _this.closest('.kanban-item').attr('data-eid');
            $('#P'+id+' td.prazoBoxDisplay [onclick="addControlePrazo(this)"]').trigger('click');
            // console.log(id);
            return false;
        }
        var _data = _this.data();
        var _parent = _this.closest('tr');
            _parent = (typeof _parent === 'undefined') ? _this.closest('.kanban-item') : _parent;
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
function setPrazoMarcador(mode, this_, form, href, param = false, callback = false) {

    var _this = (this_) ? $(this_) : false;
    var tblProcessos = $('#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado');
    var _dateRef = (!param) ? $('#configDatesBox_date').val() : param.date;
    var _timeRef = (!param) ? $('#configDatesBox_time').val() : param.time;
    var _tagSelected = (!param) ? $('#configDatesBox_tag').val() : param.tag;
    var _textTag = (!param) ? $('#configDatesBox_text').val() : param.text;
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
                                        if (param) tr.find(isNewSEI ? '.infraCheckboxInput:checked' : '.infraCheckbox:checked').trigger('click');
                                        if (typeof callback === 'function') {
                                            callback();
                                            // console.log('**** CALBACK');
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
                                    if(verifyConfigValue('debugpage')) console.log('Reload tableHomeDestroy');
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
            if(verifyConfigValue('debugpage')) console.log('Reload initControlePrazo'); 
        }, 500);
    }
}
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
            if(verifyConfigValue('debugpage')) console.log('Reload initAllMarcadoresHome'); 
        }, 500);
    }
}
function initNaoVisualizadoPro() {
    $('.processoNaoVisualizado').each(function(){
        var tooltip = $(this).attr('onmouseover');
            tooltip = typeof tooltip !== 'undefined' ? tooltip.replace("return infraTooltipMostrar('","return infraTooltipMostrar('(N\u00E3o Visualizado) ") : false;
        if (tooltip) $(this).attr('onmouseover',tooltip);
    });
}
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
    var listId = $('#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado').find(elemCheckbox+':checked').map(function(){ return $(this).val() }).get();
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
    $('#divComandos .iconUpload_new').addClass('iconLoading');
    
    $('#frmCheckerProcessoPro').attr('src', url).unbind().on('load', function(){
        var ifrArvore = $('#frmCheckerProcessoPro').contents().find('#ifrArvore');
            contentW = ifrArvore[0].contentWindow;
            $('#divComandos .iconUpload_new').removeClass('iconLoading');
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
        _containerUpload.find('#divComandos').after(html).data('index', 0);
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
                            '       <a id="anchorID" target="ifrVisualizacao" class="dz-filename">'+
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
function initSeiPro() {
	if ( $('#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado').length > 0 ) {
        if (typeof URL_SPRO !== 'undefined') $.getScript((URL_SPRO+"js/lib/jquery-table-edit.min.js"));
        if (typeof URL_SPRO !== 'undefined') $.getScript((URL_SPRO+"js/lib/moment-duration-format.min.js"));
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
        initViewEspecifacaoProcesso(); 
        initFullnameAtribuicao();
        initFaviconNrProcesso();
        addAcompanhamentoEspIcon();
        initAllMarcadoresHome();
        initUrgentePro();
        initNaoVisualizadoPro();
        storeLinkUsuarioSistema();
        if (typeof checkDadosAcompEspecial !== 'undefined') checkDadosAcompEspecial();
	} else if ( $("#ifrArvore").length > 0 ) {
        initDadosProcesso();
        initObserveUrlChange();
        checkLoadConfigSheets();
        //observeHistoryBrowserPro();
	}
    initReloadModalLink();
    if (typeof isNewSEI !== 'undefined' && isNewSEI) {
        // localStorageRemovePro('seiSlim');
        
        //  Força o reestabelecimento de funcionalidades nativas do SEI 4.0
        $('#ancLiberarMeusProcessos').click(function() {
            verMeusProcessos('T')
        });
        $('#ancLiberarMarcador').click(function() {
            filtrarMarcador(null);
        });
        $('#ancLiberarTipoProcedimento').click(function() {
            filtrarTipoProcedimento(null);
        });
    }
}
$(document).ready(function () { initSeiPro() });