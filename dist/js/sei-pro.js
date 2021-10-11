var actionTest = 'ondblclick="removeCacheGroupTable(this)"';
var totalSecondsTest = 0;
var totalSecondsTestText = '';
var timerTest;

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
    if (typeof spreadsheetIdProjetos_Pro !== 'undefined' && typeof gapi !== 'undefined' && typeof initClientPro !== 'undefined') { 
        gapi.load('client:auth2', initClientPro);
    } else if (spreadsheetIdProjetos_Pro === false) {
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
    var arrayTag = [''];
    if (acaoType == 'tags') {
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
                tag = ( acaoType == 'senddepart' && typeof tag === 'undefined') ? '' : tag;
                if ( acaoType == 'arrivaldate' || acaoType == 'acessdate'  || acaoType == 'senddate'   || acaoType == 'createdate' ) {
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
                    var dataRecebido =  (acaoType == 'arrivaldate') ? getArrayProcessoRecebido($(this).attr('href')).datahora : '';
                        dataRecebido =  (acaoType == 'acessdate') ? getArrayProcessoRecebido($(this).attr('href')).datetime : dataRecebido;
                        dataRecebido =  (acaoType == 'senddate') ? getArrayProcessoRecebido($(this).attr('href')).datesend : dataRecebido;
                        dataRecebido =  (acaoType == 'createdate') ? getArrayProcessoRecebido($(this).attr('href')).datageracao : dataRecebido;
                        dataRecebido = (dataRecebido != '') ? moment(dataRecebido,'YYYY/MM/DD HH:mm:ss') : '';
                    if (dataRecebido != '' && dataRecebido.format('YYYY-MM-DD') == startDateNow.format('YYYY-MM-DD') ) { tag = 'a.Hoje'; }
                    if (dataRecebido != '' && dataRecebido.format('YYYY-MM-DD') == startDateYesterday.format('YYYY-MM-DD') ) { tag = 'a.Ontem'; } 
                    if (dataRecebido != '' && dataRecebido.format('YYYY-MM-DD') == startDate1Yesterday.format('YYYY-MM-DD') ) { tag = 'b.Anteontem'; } 
                    if (dataRecebido != '' && tag == '' && dataRecebido.isBetween(startDateWeek, endDateWeek) ) { tag = 'c.Essa semana'; }
                    if (dataRecebido != '' && tag == '' && dataRecebido.isBetween(startDateLastWeek, endDateLastWeek) ) { tag = 'd.Semana passada'; }
                    if (dataRecebido != '' && dataRecebido.isBetween(startDate2LastWeek, endDate2LastWeek) ) { tag = 'e.Duas semana atr\u00E1s'; }
                    if (dataRecebido != '' && dataRecebido.isBetween(startDate3LastWeek, endDate3LastWeek) ) { tag = 'f.Tr\u00EAs semana atr\u00E1s'; }
                    if (dataRecebido != '' && dataRecebido.isBetween(startDate4LastWeek, endDate4LastWeek) ) { tag = 'g.Quatro semana atr\u00E1s'; }
                    if (dataRecebido != '' && dataRecebido.isBetween(startDate5LastWeek, endDate5LastWeek) ) { tag = 'h.Cinco semana atr\u00E1s'; }
                    if (dataRecebido != '' && dataRecebido.isBetween(startDateLastMonth, endDateLastMonth) ) { tag = 'i.Um m\u00EAs atr\u00E1s'; }
                    if (dataRecebido != '' && dataRecebido.isBetween(startDate2LastMonth, endDate2LastMonth) ) { tag = 'j.Dois meses atr\u00E1s'; }
                    if (dataRecebido != '' && dataRecebido.isBetween(startDate3LastMonth, endDate3LastMonth) ) { tag = 'k.Tr\u00EAs meses atr\u00E1s'; }
                    if (dataRecebido != '' && dataRecebido.isBetween(startDateLastQuarter, endDateLastQuarter) ) { tag = 'l.Seis meses atr\u00E1s'; }
                    if (dataRecebido != '' && dataRecebido.isBetween(startDateLastYear, endDateLastYear) ) { tag = 'm.Um ano atr\u00E1s'; }
                    if (dataRecebido != '' && dataRecebido < endDateLastYear ) { tag = 'n.Maior que um ano atr\u00E1s'; }
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
            var tag_ = (typeof tag !== 'undefined' && tag != '' ) ? removeAcentos(tag).replace(/\ /g, '') : 'SemGrupo' ;
            $(this).closest('tr').attr('data-tagname', tag_);
            arrayTag.push(tag);
        }
    });
    return uniqPro(arrayTag).sort();
}
function appendGerados(type) {
    $('#divGerados table tr').not('.tablesorter-filter-row').each(function(index){
        if ( $(this).find('th').length == 0 ) {
            var outerHTML = $('<div>').append($(this).clone().addClass('typeGerados')).html();
            $('#divRecebidos').find('table tbody').append(outerHTML);
        }
    });
    $('#divGerados').hide();
    $('#divRecebidos').addClass('tagintable');
    $('#divRecebidosAreaTabela').addClass('tabelaPanelScroll');
    
    var tbody = $('#divRecebidos tbody');
    tbody.find('tr').each(function() {
        var dataRecebido = ($(this).find('td').eq(2).find('a').length) ? getArrayProcessoRecebido($(this).find('td').eq(2).find('a').attr('href')) : '';
            dataRecebido = (dataRecebido != '' && type == 'arrivaldate') ? moment(dataRecebido.datahora, 'YYYY-MM-DD HH:mm:ss').unix() : dataRecebido;
            dataRecebido = (dataRecebido != '' && type == 'acessdate') ? moment(dataRecebido.datetime, 'YYYY-MM-DD HH:mm:ss').unix() : dataRecebido;
            dataRecebido = (dataRecebido != '' && type == 'createdate') ? moment(dataRecebido.datageracao, 'YYYY-MM-DD HH:mm:ss').unix() : dataRecebido;
            dataRecebido = (dataRecebido != '' && (type == 'senddate' || type == 'senddate')) ? moment(dataRecebido.datesend, 'YYYY-MM-DD HH:mm:ss').unix() : dataRecebido;
        if (dataRecebido != '' && !isNaN(dataRecebido)) { $(this).data('order', dataRecebido) }

    }).sort(function(a, b) {
      var tda = $(a).data('order');
      var tdb = $(b).data('order');
      return (type == 'arrivaldate' || type == 'senddate' || type == 'senddepart' || type == 'createdate') ? tda > tdb ? -1 : tda < tdb ? 1 : 0 : tda > tdb ? 1 : tda < tdb ? -1 : 0;
    }).appendTo(tbody);
    initPanelResize('#divRecebidosAreaTabela.tabelaPanelScroll', 'recebidosPro');
    if ($('#divRecebidosAreaPaginacaoInferior a').length == 0) { $('#divRecebidosAreaPaginacaoInferior').hide() }
}
function removeDuplicateValue(element) {
    $(element).val(uniqPro($(element).val().split(',')).join(','));
}
function setSelectAllTr(this_, tagname = false) {
    var index = (typeof $(this_).data('index') !== 'undefined') ? $(this_).data('index') : 0;
    var tagname_select = (tagname) ? 'tr[data-tagname="'+tagname+'"]:visible' : 'tr:visible';
    if (index < 1) {
        $(this_).closest('table').find(tagname_select).find('input[type=checkbox]').trigger('click');
        $(this_).data('index',index+1);
    } else {
        $(this_).closest('table').find(tagname_select).find('input[type=checkbox]:checked').trigger('click');
        $(this_).data('index',0);
    }
    updateTipSelectAll(this_);
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
    }
}
function replaceSelectAll() {
    var tableProc = $('#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado');
    if ( tableProc.length > 0 ) {
        tableProc.find('#lnkInfraCheck').after('<a onclick="setSelectAllTr(this);" onmouseover="updateTipSelectAll(this)" onmouseenter="return infraTooltipMostrar(\'Selecionar Tudo\')" onmouseout="return infraTooltipOcultar();"><img src="/infra_css/imagens/check.gif" class="infraImg"></a>').remove();
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
	$('#divGerados').show();
	$('#divRecebidos thead').show();
    $('table tr.tablesorter-headerRow').show();

    $('#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado')
        .trigger('filterReset')
        .trigger('update')
        .find('.filterTableProcessos').removeClass('newLink_active');
}
function getUniqueTableTag(i, tagName, type) {
	var tagName_ = (typeof tagName !== 'undefined' && tagName != '' ) ? removeAcentos(tagName).replace(/\ /g, '') : 'SemGrupo' ;
		tagName = (typeof tagName === 'undefined' && tagName == '' ) ? ' ' : tagName;
        tagName = ( (type == 'arrivaldate' || type == 'acessdate' || type == 'senddate' || type == 'createdate') && tagName.indexOf('.') !== -1 ) ? tagName.split('.')[1] : tagName;
	var tbRecebidos = $('#divRecebidos table');
	var countTd = tbRecebidos.find('tr:not(.tablesorter-headerRow)').eq(1).find('td').length;
	var iconSelect = '<label class="lblInfraCheck" for="lnkInfraCheck" accesskey=";"></label><a id="lnkInfraCheck" onclick="getSelectAllTr(this, \''+tagName_+'\');" onmouseover="updateTipSelectAll(this)" onmouseenter="return infraTooltipMostrar(\'Selecionar Tudo\')" onmouseout="return infraTooltipOcultar();"><img src="/infra_css/imagens/check.gif" id="imgRecebidosCheck" class="infraImg"></a></th>';
	var tagCount = $('#divRecebidos table tbody').find('tr[data-tagname="'+tagName_+'"]:visible').length;
	var htmlBody = '<tr class="infraCaption tagintable"><td colspan="'+(countTd+3)+'"><span '+actionTest+'>'+tagCount+' registros:</span></td></tr>'
					+'<tr data-htagname="'+tagName_+'" class="tagintable tableHeader">'
					+'<th class="tituloControle" width="5%" align="center">'+iconSelect+'</th>'
					+'<th class="tituloControle" colspan="'+(countTd+2)+'">'+tagName+'</th>'
					+'</tr>';
		$(htmlBody).appendTo('#divRecebidos table tbody');
		if ( i == 0 ) { 
            // tbRecebidos.find('tr').eq(0).hide(); 
            tbRecebidos.find('caption').hide(); 
        }
}
function getTableOnTag(type) {
    $('#divRecebidos table tbody tr').each(function(index){
    	var dataTag = $(this).attr('data-tagname');
    		dataTag = ( dataTag == '' ) ? 'SemGrupo' : dataTag;
    	if ( typeof dataTag !== 'undefined' && $(this).find('td').eq(2).find('a').length > 0 ) {
    		var desc = $(this).find('td').eq(2).find('a').attr('onmouseover').split("','");            
    		var htmlDesc = '<td class="tagintable">'+desc[0].replace("return infraTooltipMostrar('", "")+'</td><td class="tagintable">'+desc[1].replace("');","")+'</td>';
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
    }
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
        if ($.isArray(selectGroup) && jmespath.search(selectGroup, "[?unidade=='"+unidade+"'].unidade | [0]") == unidade ) {
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
    if (typeof checkConfigValue !== 'undefined' && (checkConfigValue('agruparlista') || verifyConfigValue('removepaginacao')) ) {
        if (checkConfigValue('agruparlista')) { 
            var statusTableTags =           ( storeGroupTablePro() == 'tags' ) ? 'selected' : '';
            var statusTableTypes =          ( storeGroupTablePro() == 'types' ) ? 'selected' : '';
            var statusTableUsers =          ( storeGroupTablePro() == 'users' ) ? 'selected' : '';
            var statusTableCheckpoints =    ( storeGroupTablePro() == 'checkpoints' ) ? 'selected' : '';
            var statusTableArrivaldate =    ( storeGroupTablePro() == 'arrivaldate' ) ? 'selected' : '';
            var statusTableSenddate =       ( storeGroupTablePro() == 'senddate' ) ? 'selected' : '';
            var statusTableAcessdate =      ( storeGroupTablePro() == 'acessdate' ) ? 'selected' : '';
            var statusTableDepartSend =     ( storeGroupTablePro() == 'senddepart' ) ? 'selected' : '';
            var statusTableCreatedate =     ( storeGroupTablePro() == 'createdate' ) ? 'selected' : '';
            var htmlControl =    '<div id="newFiltro" style="display: inline-block; vertical-align: top; float: right; text-align: right; width: 100%; margin-right: 30px;">'
                                +'   <select id="selectGroupTablePro" class="groupTable selectPro" onchange="updateGroupTable(this)">'
                                +'     <option value="">Agrupar processos recebidos/gerados</option>'
                                +'     <option value="createdate" '+statusTableCreatedate+'>Agrupar processos por data de autua\u00E7\u00E3o</option>'
                                +'     <option value="arrivaldate" '+statusTableArrivaldate+'>Agrupar processos por data de recebimento</option>'
                                +'     <option value="senddate" '+statusTableSenddate+'>Agrupar processos por data de envio</option>'
                                +'     <option value="acessdate" '+statusTableAcessdate+'>Agrupar processos por data do \u00FAltimo acesso</option>'
                                +'     <option value="tags" '+statusTableTags+'>Agrupar processos por marcadores</option>'
                                +'     <option value="types" '+statusTableTypes+'>Agrupar processos por tipo</option>'
                                +'     <option value="users" '+statusTableUsers+'>Agrupar processos por respons\u00E1vel</option>'
                                +'     <option value="checkpoints" '+statusTableCheckpoints+'>Agrupar processos por ponto de controle</option>'
                                +'     <option value="senddepart" '+statusTableDepartSend+'>Agrupar processos por unidade de envio</option>'
                                +'  </select>'
                                +'  <a class="newLink" onclick="getTableProcessosCSV()" id="processoToCSV" onmouseover="return infraTooltipMostrar(\'Exportar informa\u00E7\u00F5es de processos em planilha CSV\');" onmouseout="return infraTooltipOcultar();" style="margin: 0;font-size: 10pt;float: right;"><i class="fas fa-file-download cinzaColor"></i></a>'
                                +'</div>';

            if ( $('#selectGroupTablePro').length == 0 && $('#tblProcessosDetalhado').length == 0) { 
                $('#divFiltro').after(htmlControl); 
                setTimeout(function(){ 
                    updateGroupTable($('#selectGroupTablePro')); 
                }, 500);
            }
            if ( $('#idSelectTipoBloco').length != 0 ) { 
                $("#idSelectTipoBloco").appendTo("#newFiltro");
                $("#idSelectBloco").appendTo("#newFiltro");
            }
        } else {
            initProcessoPaginacao($('#selectGroupTablePro'));
        }
    } else if (typeof checkConfigValue === 'undefined' ) {
        setTimeout(function(){ 
            insertGroupTable(TimeOut - 100); 
            console.log('Reload insertGroupTable'); 
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
}
function initDadosProcesso(TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    if (typeof getParamsUrlPro !== 'undefined' && typeof getDadosIframeProcessoPro !== 'undefined'  && typeof $("#ifrArvore").contents().find('#topmenu').find('a[target="ifrVisualizacao"]').eq(0).attr('href') !== 'undefined' ) { 
        var idProcedimento = getParamsUrlPro(window.location.href).id_procedimento;
            idProcedimento = (typeof idProcedimento !== 'undefined') ? idProcedimento : getParamsUrlPro($("#ifrArvore").contents().find('#topmenu').find('a[target="ifrVisualizacao"]').eq(0).attr('href')).id_procedimento;
            getDadosIframeProcessoPro(idProcedimento, 'processo');
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
                    $(this).find('input.infraCheckbox').attr('disabled', true).closest('td').attr('onmouseout','return infraTooltipOcultar()').attr('onmouseover','return infraTooltipMostrar(\'Desative a op\u00E7\u00E3o "Remover pagina\u00E7\u00E3o de processos" nas configura\u00E7\u00F0es do SEI Pro para utilizar esta sele\u00E7\u00E3o\')');
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
function initNewTabProcesso() { 
    var observerTableControle = new MutationObserver(function(mutations) {
        var _this = $(mutations[0].target);
        var _parent = _this.closest('table');
        if (_parent.find('tr.infraTrMarcada').length > 0) {
            $('#divComandos').find('.iconPro_newtab').show();
            removeDuplicateValue('#hdnRecebidosItensSelecionados');
            removeDuplicateValue('#hdnGeradosItensSelecionados');
        } else {
            $('#divComandos').find('.iconPro_newtab').hide();
        }
    });
    setTimeout(function(){ 
        $('#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado').find('tbody tr').each(function(){
            observerTableControle.observe(this, {
                    attributes: true
            });
        });
        htmlBtn =   '<a tabindex="451" class="botaoSEI iconBoxPro iconPro_newtab" onmouseout="return infraTooltipOcultar();" onmouseover="return infraTooltipMostrar(\'Abrir Processos em Nova Aba\')" onclick="openListNewTab(this)" style="position: relative; margin-left: -3px; display: none;">'+
                    '    <img class="infraCorBarraSistema" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==">'+
                    '    <span style="position: absolute;width: 40px;margin: 1px 2px;text-align: center;height: 32px;padding-top: 8px;background: transparent;left: 0;user-select: none;pointer-events: none;">'+
                    '       <i class="fas fa-external-link-alt" style="font-size: 17pt; color: #fff;"></i>'+
                    '    </span>'+
                    '</a>';
        $('#divComandos').find('.iconPro_newtab').remove();
        $('#divComandos').append(htmlBtn);
    }, 500);
}
function openListNewTab(this_) {
    var listNewTag = $('#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado').find('.infraCheckbox:checked').map(function(){ return $(this).val() }).get();
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
function checkLoadConfigProject(TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    if (typeof checkConfigValue !== 'undefined') { 
        if (checkConfigValue('gerenciarprojetos') && typeof spreadsheetIdProjetos_Pro !== 'undefined' && spreadsheetIdProjetos_Pro !== false && spreadsheetIdProjetos_Pro !== 'undefined') {
            handleClientLoadPro();
            console.log('handleClientLoadPro');
        }
    } else {
        setTimeout(function(){ 
            checkLoadConfigProject(TimeOut - 100); 
            console.log('Reload checkLoadConfigProject'); 
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
    var statusView = ( getOptionsPro('frmProcedimentoControlar') == 'hide' ) ? 'none' : 'initial';
    var statusIconShow = ( getOptionsPro('frmProcedimentoControlar') == 'hide' ) ? '' : 'display:none;';
    var statusIconHide = ( getOptionsPro('frmProcedimentoControlar') == 'hide' ) ? 'display:none;' : '';
    var idOrder = (getOptionsPro('orderPanelHome') && jmespath.search(getOptionsPro('orderPanelHome'), "[?name=='processosSEIPro'].index | length(@)") > 0) ? jmespath.search(getOptionsPro('orderPanelHome'), "[?name=='processosSEIPro'].index | [0]") : '';
    var htmlIconTable =     '<i class="controleProcPro fas fa-folder-open cinzaColor" style="margin: 0 10px 0 0; font-size: 1.1em;"></i>';
    var htmlToggleTable =   '<a class="controleProcPro newLink" id="frmProcedimentoControlar_showIcon" onclick="toggleTablePro(\'frmProcedimentoControlar\',\'show\')" onmouseover="return infraTooltipMostrar(\'Mostrar Tabela\');" onmouseout="return infraTooltipOcultar();" style="font-size: 11pt; '+statusIconShow+'"><i class="fas fa-plus-square cinzaColor"></i></a>'+
                            '<a class="controleProcPro newLink" id="frmProcedimentoControlar_hideIcon" onclick="toggleTablePro(\'frmProcedimentoControlar\',\'hide\')" onmouseover="return infraTooltipMostrar(\'Recolher Tabela\');" onmouseout="return infraTooltipOcultar();" style="font-size: 11pt; '+statusIconHide+'"><i class="fas fa-minus-square cinzaColor"></i></a>';
    var htmlDivPanel = '<div class="controleProcPro panelHomePro" style="display: inline-block; width: 100%;" id="processosSEIPro" data-order="'+idOrder+'"></div>';
    
    if ($('.controleProcPro').length == 0) {
        $('#divInfraBarraLocalizacao').css('width', '100%').addClass('titlePanelHome').append(htmlToggleTable).prepend(htmlIconTable);
        $('#frmProcedimentoControlar').css({'width': '100%', 'display': statusView});
        $('#panelHomePro').append(htmlDivPanel);
        $('#frmProcedimentoControlar').moveTo('#processosSEIPro');
        $('#divInfraBarraLocalizacao').moveTo('#processosSEIPro');
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
            console.log('Reload initSortDivPanel'); 
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
                    '           <th>Link Permanente</th>'+
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
                                '       </tr>';
            //console.log(id_protocolo, nr_processo, etiqueta_array, anotacao_array, descricao_array, atribuicao, data_visita, data_geracao, data_recebimento, data_envio, unidade_envio);
        });
    htmlTable +=    '       </tbody>'+
                    '</table>';
    downloadTableCSV($(htmlTable), 'ListaProcessos_SEIPro');
}

// PESQUISA PROCESSOS POR LISTA
var arrayProtocoloSEI = [];
function loopIDProtocoloSEI(protocoloSEI, index, TimeOut = 200) {
    if (TimeOut <= 0) { 
        var next = index+1;
        var htmlTr =    '<tr>'+
                        '    <td style="font-size: 9pt; text-align: center;">'+arrayProtocoloSEI[index]+'</td>'+
                        '    <td style="font-size: 9pt; text-align: center;">ERROR</td>'+
                        '    <td style="font-size: 9pt; word-break: break-all;">-</td>'+
                        '</tr>';
        $('.tableResultProtocoloSEI').find('tbody').append(htmlTr);
        loopIDProtocoloSEI(arrayProtocoloSEI[next], next);
        return;
    }
    if (index < arrayProtocoloSEI.length) { 
        getIDProtocoloSEI(protocoloSEI,  
            function(html){
                let $html = $(html);
                var params = getParamsUrlPro($html.find('#ifrArvore').attr('src'));
                var next = index+1;
                loopIDProtocoloSEI(arrayProtocoloSEI[next], next);
                appendSearchProtocoloSEI(params, index);
            }, 
            function(){
                setTimeout(function(){ 
                    loopIDProtocoloSEI(arrayProtocoloSEI[index], index, TimeOut - 100); 
                    console.log('ERROR', 'Reload loopIDProtocoloSEI', TimeOut); 
                }, 500);
            });
    } else {
        setTimeout(function(){ 
            alertaBoxPro('Sucess', 'check-circle', 'Protocolos pesquisados com sucesso!');
            loadingButtonConfirm(false);
            $('.ui-dialog .ui-dialog-buttonset .confirm.ui-button').addClass('ui-state-active');
        }, 500);
    }

}
function appendSearchProtocoloSEI(params, index) {
    var url_host = window.location.href.split('?')[0];
    var documento = (params.id_documento != '') ? '&id_documento='+String(params.id_documento) : '';
    var tipo = (params.id_documento != '') ? '<i class="far fa-file"></i> Documento' : '<i class="far fa-folder-open"></i> Protocolo';
    var href = url_host+'?acao=procedimento_trabalhar&id_procedimento='+String(params.id_procedimento)+documento;
    var htmlTr =    '<tr>'+
                    '    <td style="font-size: 9pt; text-align: center;">'+arrayProtocoloSEI[index]+'</td>'+
                    '    <td style="font-size: 9pt; text-align: center;">'+tipo+'</td>'+
                    '    <td style="font-size: 9pt; word-break: break-all;"><a style="text-decoration: underline; color: #00c; font-size: 9pt;" target="_blank" href="'+href+'">'+href+'</a></td>'+
                    '</tr>';
    $('.tableResultProtocoloSEI').find('tbody').append(htmlTr);
    var d = $('#divResulProtocoloSEI');
        d.scrollTop(d.prop("scrollHeight"));
}
function cleanSearchProtocoloSEI() {
    $('.tableResultProtocoloSEI').find('tbody').html('');
    $('.resultProtocoloSEI').hide();
    $('.searchProtocoloSEI').css('width', '100%');
    $('#resultProtocoloSEI').css('width', '');
    dialogBoxPro.dialog( "option", "width", 300 );
    $('#searchProtocoloSEI').val('');
    loadingButtonConfirm(false);
    $('.ui-dialog .ui-dialog-buttonset .confirm.ui-button').addClass('ui-state-active');
}
function initSearchProtocoloSEI() {
    var lines = $('#searchProtocoloSEI').val().split(/\n/);
        arrayProtocoloSEI = [];
    for (var i=0; i < lines.length; i++) {
      if (/\S/.test(lines[i])) {
        arrayProtocoloSEI.push($.trim(lines[i]));
      }
    }
    if(arrayProtocoloSEI !== null && arrayProtocoloSEI.length > 0 && !checkLoadingButtonConfirm()) {
        loopIDProtocoloSEI(arrayProtocoloSEI[0], 0);
        $('.resultProtocoloSEI').show();
        $('.searchProtocoloSEI').css('width', '30%');
        $('#resultProtocoloSEI').css('width', '70%');
        dialogBoxPro.dialog( "option", "width", 900 );
        loadingButtonConfirm(true);
    }
}
function copyTableResultProtocoloSEI() {
    var htmlTable = $('.tableResultProtocoloSEI')[0].outerHTML;
        copyToClipboardHTML(htmlTable);
}
function downloadTableResultProtocoloSEI() {
    downloadTableCSV($('.tableResultProtocoloSEI'), 'PesquisaProtocolo_SEIPro');
}
function initBoxSearchProtocoloSEI() {
    resetDialogBoxPro();
    var htmlBox =   '<div class="searchProtocoloSEI" style="width: 100%; float: left;"><textarea placeholder="Insira os n\u00FAmeros de processo ou n\u00FAmeros SEI, um em cada linha..." id="searchProtocoloSEI" style="width: 90%; border: 2px solid #c5c5c5; height: 330px; border-radius: 5px;"></textarea></div>'+
                    '<div id="resultProtocoloSEI" class="resultProtocoloSEI" style="float: right; display: none;">'+
                    '    <div id="divResulProtocoloSEI" style="overflow-y: scroll; height: 300px;">'+
                    '       <table style="font-size: 9pt !important; width: 100%;" class="tableInfo tableZebra tableFollow seiProForm tableResultProtocoloSEI resultProtocoloSEI">'+
                    '           <thead>'+
                    '               <tr>'+
                    '                   <th class="tituloControle" style="width: 140px; padding: 5px 0px;">Protocolo</th>'+
                    '                   <th class="tituloControle" style="width: 90px; padding: 5px 0px;">Tipo</th>'+
                    '                   <th class="tituloControle" style="padding: 5px 0px;">Link Permanente</th>'+
                    '               </tr>'+
                    '           </thead>'+
                    '           <tbody>'+
                    '           </thead>'+
                    '       </table>'+
                    '    </div>'+
                    '    <div class="ui-dialog-buttonpane actionsResultProtocoloSEI">'+
                    '        <button type="button" class="ui-button ui-corner-all ui-widget" onclick="copyTableResultProtocoloSEI()">Copiar Tabela</button>'+
                    '        <button type="button" class="ui-button ui-corner-all ui-widget" onclick="downloadTableResultProtocoloSEI()">Baixar CSV</button>'+
                    '    </div>'+
                    '</div>';
    dialogBoxPro = $('#dialogBoxPro')
        .html('<div class="dialogBoxDiv">'+htmlBox+'</div>')
        .dialog({
            title: "Pesquisar Link Permanente",
            width: 300,
            open: function( event, ui ) {
                var processosTela = getProcessoUnidadePro();
                    processosTela = (processosTela.length > 0) ? processosTela.join('\n') : '';
                if (processosTela != '') { 
                    $('#searchProtocoloSEI').val(processosTela);
                }
            },
            close: function() { $('#configDatesBox').remove() },
            buttons: [{
                text: 'Limpar',
                click: function() {
                        cleanSearchProtocoloSEI();
                    }
                },{
                text: 'Pesquisar',
                class: 'confirm ui-state-active',
                click: function() {
                        initSearchProtocoloSEI();
                    }
                }]
        });
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
function initTableSorterHome(TimeOut = 9000) {
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
    var tableSorterHome = $('#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado');
        if (tableSorterHome.length > 0) {
            tableSorterHome.each(function(){

                if (!$(this).hasClass('infraTableOrdenacao')) {
                    corrigeTableSEI(this);
                    
                    var elemID = $(this).attr('id');
                    var sortListArray = (typeof sortListSaved !== 'undefined' && sortListSaved && typeof sortListSaved[elemID] !== 'undefined') ? sortListSaved[elemID].sortList : [];
                    var configSorter = {
                        textExtraction: {
                            1: function (elem, table, cellIndex) {
                                var text_return = '';
                                if ($(elem).find('img').length > 0) {
                                    $(elem).find('img').each(function(){
                                        var prioridade = $(this).attr('src').indexOf('prioridade') != -1 ? '1' : '2';
                                        var texttip = $(this).closest('a').attr('onmouseover');
                                            texttip = (typeof texttip !== 'undefined') ? texttip : $(this).attr('onmouseover');
                                            texttip = (typeof texttip !== 'undefined') ? extractTooltip(texttip) : ''; 
                                        text_return += prioridade+' '+texttip;
                                    });
                                }
                                return (text_return == '') ? '3' : text_return;
                            },
                            2: function (elem, table, cellIndex) {
                                var processo = $(elem).find('a').eq(0);
                                var nrProc = processo.text().trim();
                                var texttip = processo.attr('onmouseover');
                                    texttip = (typeof texttip !== 'undefined') ? extractTooltip(texttip) : ''; 
                                    // console.log(texttip);
                                return nrProc+' '+texttip;
                            }
                            /*,
                            4: function (elem, table, cellIndex) {
                                var text_return = '';
                                var prazo_entrega = '';
                                if ($('.dateboxDisplay').length > 0) {
                                    prazo_entrega = $('.dateboxDisplay').map(function(){ return $(this).data('prazo-entrega') }).get().sort()[0];
                                    $(elem).find('.dateboxDisplay').each(function(){
                                        var texttip = $(this).find('.dateBoxIcon').attr('onmouseover');
                                            texttip = (typeof texttip !== 'undefined') ? extractTooltip(texttip) : ''; 
                                        text_return += texttip;
                                    });
                                }
                                return prazo_entrega+' '+text_return;
                            }*/
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
                        sortList: sortListArray,
                        sortReset: true,
                        headers: {
                            0: { sorter: false, filter: false },
                            1: { filter: true },
                            2: { filter: true },
                            3: { filter: true },
                            4: { filter: true }
                        }
                    };
                    
                    $(this).find("thead th:eq(0)").data("sorter", false);
                    $(this).tablesorter(configSorter).on("sortEnd", function (event, data) {
                        checkboxRangerSelectShift();
                    }).on("filterEnd", function (event, data) {
                        checkboxRangerSelectShift();
                        var caption = $(this).find("caption").eq(0);
                        var tx = caption.text();
                            caption.text(tx.replace(/\d+/g, data.filteredRows));
                            $(this).find("tbody > tr:visible > td > input").prop('disabled', false);
                            $(this).find("tbody > tr:hidden > td > input").prop('disabled', true);
                    });
                    var _this = $('#'+$(this).attr('id'));
                    var filter = $(this).find('.tablesorter-filter-row').get(0);
                    if (typeof filter !== 'undefined') {
                        setTimeout(function(){ 
                            var htmlFilter =    '<a class="newLink filterTableProcessos '+(_this.find('tr.tablesorter-filter-row').hasClass('hideme') ? '' : 'newLink_active')+'" onclick="filterTableProcessos(this)" onmouseover="return infraTooltipMostrar(\'Pesquisar na tabela\');" onmouseout="return infraTooltipOcultar();" style="right: -50px; top: 0; position: absolute;">'+
                                                '   <i class="fas fa-search cinzaColor" style="padding-right: 3px; cursor: pointer; font-size: 12pt;"></i>'+
                                                '</a>';
                            _this.find('thead .filterTableProcessos').remove();
                            _this.find('thead').prepend(htmlFilter);
                            observerFilterHome.observe(filter, {
                                attributes: true
                            });
                        }, 500);
                    }
                }
            });
            if (tableSorterHome.find('tbody tr td:nth-child(2)').find('img').length > 0) {
                tableSorterHome.find('thead tr:first th:nth-child(2)').css('width','150px');
            }
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
function initSeiPro() {
	if ( $('#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado').length > 0 ) {
        $.getScript((URL_SPRO+"js/lib/jquery-table-edit.min.js"));
        $.getScript((URL_SPRO+"js/lib/moment-duration-format.min.js"));
        initTableSorterHome();
        insertGroupTable();
        replaceSelectAll();
        initPanelFavorites();
        checkLoadConfigProject();
        insertDivPanel();
        initNewTabProcesso();
        forceOnLoadBody();
        observeAreaTela();
        initReplaceSticknoteHome();
	} else if ( $("#ifrArvore").length > 0 ) {
        initDadosProcesso();
        //observeHistoryBrowserPro();
	}
    initReloadModalLink();
}
$(document).ready(function () { initSeiPro() });