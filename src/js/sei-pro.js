/*function localStorageRestorePro(item) {
    return JSON.parse(localStorage.getItem(item));
}
function localStorageStorePro(item, result) {
    localStorage.setItem(item, JSON.stringify(result));
}
function localStorageRemovePro(item) {
    localStorage.removeItem(item);
}
function removeAcentos(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
function uniqPro(a) {
    return a.sort().filter(function(item, pos, ary) {
        return !pos || item != ary[pos - 1];
    })
}*/
// On load, called to load the auth2 library and API client library.
function handleClientLoadPro(TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    if (typeof gapi !== 'undefined' && typeof initClientPro !== 'undefined') { 
        gapi.load('client:auth2', initClientPro);
    } else {
        setTimeout(function(){ 
            handleClientLoadPro(TimeOut - 100); 
            console.log('Reload handleClientLoadPro'); 
        }, 500);
    }
}

//// Agrupo lista de processos
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
    } else if (acaoType == 'arrivaldate' || acaoType == 'acessdate' || acaoType == 'senddate' || acaoType == 'senddepart') {
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
                if ( acaoType == 'arrivaldate' || acaoType == 'acessdate'  || acaoType == 'senddate' ) {
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
    $('#divGerados table tr').each(function(index){
        if ( $(this).find('th').length == 0 ) {
        	/*
            var idItem = parseInt($('#hdnRecebidosNroItens').val())+1;
        	$(this).addClass('typeGerados').find('input[type=checkbox]')
        		.attr('id','chkGeradosItem'+idItem)
        		.attr("onclick","infraSelecionarItens(this,'Gerados')")
        		.attr('name','chkGeradosItem'+idItem);
        	var lnkRecebidos = $(this).find('td').eq(0).find('a').eq(0);
        		lnkRecebidos.attr('id', 'lnkGerados'+lnkRecebidos.attr('name'));
            var outerHTML = $(this)[0].outerHTML;
            $('#hdnRecebidosNroItens').val(idItem);
            $('#hdnRecebidosItens').val($('#hdnRecebidosItens').val()+','+$(this).find('input[type=checkbox]').val());
            */
            var outerHTML = $('<div>').append($(this).clone().addClass('typeGerados')).html();
            $('#divRecebidos').find('table tbody').append(outerHTML);
        }
    });
    $('#divGerados').hide();
    $('#divRecebidos').addClass('tagintable');
    
    var tbody = $('#divRecebidos tbody');
    tbody.find('tr').each(function() {
        var dataRecebido = ($(this).find('td').eq(2).find('a').length) ? getArrayProcessoRecebido($(this).find('td').eq(2).find('a').attr('href')) : '';
            dataRecebido = (dataRecebido != '' && type == 'arrivaldate') ? moment(dataRecebido.datahora, 'YYYY-MM-DD HH:mm:ss').unix() : dataRecebido;
            dataRecebido = (dataRecebido != '' && type == 'acessdate') ? moment(dataRecebido.datetime, 'YYYY-MM-DD HH:mm:ss').unix() : dataRecebido;
            dataRecebido = (dataRecebido != '' && (type == 'senddate' || type == 'senddate')) ? moment(dataRecebido.datesend, 'YYYY-MM-DD HH:mm:ss').unix() : dataRecebido;
        if (dataRecebido != '' && !isNaN(dataRecebido)) { $(this).attr('data-order', dataRecebido) }

    }).sort(function(a, b) {
      var tda = $(a).attr('data-order');
      var tdb = $(b).attr('data-order');
      return (type == 'arrivaldate' || type == 'senddate' || type == 'senddepart') ? tda > tdb ? -1 : tda < tdb ? 1 : 0 : tda > tdb ? 1 : tda < tdb ? -1 : 0;
    }).appendTo(tbody);
}
function getSelectAllTr(tagname) {
	$('tr[data-tagname="'+tagname+'"]').find('input[type=checkbox]').trigger('click');
}
function cleanConfigDataRecebimento() {
    var storeRecebimento = ( typeof localStorageRestorePro('configDataRecebimentoPro') !== 'undefined' && !$.isEmptyObject(localStorageRestorePro('configDataRecebimentoPro')) ) ? localStorageRestorePro('configDataRecebimentoPro') : [];
    var array_procedimentos = [];
    $('#frmProcedimentoControlar').find('a.processoVisualizado').each(function(i) {
      array_procedimentos.push(String(getParamsUrlPro($(this).attr('href')).id_procedimento));
    });
    uniqPro(array_procedimentos);
    for (i = 0; i < storeRecebimento.length; i++) {
        if( $.inArray(String(storeRecebimento[i]['id_procedimento']), array_procedimentos, 0) == -1) {
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
	        /*
            $('#hdnRecebidosNroItens').val(parseInt($('#hdnRecebidosNroItens').val())-1);
	        var idTr = $(this).find('input[type=checkbox]').val();
	        var hdnRecebidosItens = $('#hdnRecebidosItens').val();
	        var ArrayRecebidosItens = hdnRecebidosItens.split(',');
	        var FilterRecebidosItens =  $.grep(ArrayRecebidosItens, function( a ) { return a !== idTr; }).join(',');
	            $('#hdnRecebidosItens').val(FilterRecebidosItens);
            */
	     } else {
	        $(this).show(); 
	    }
	});
	$('#divRecebidos').removeClass('tagintable').find('caption').show();
	$('#divGerados').show();
    $('table tr.tablesorter-headerRow').show();
}
function getUniqueTableTag(i, tagName, type) {
	var tagName_ = (typeof tagName !== 'undefined' && tagName != '' ) ? removeAcentos(tagName).replace(/\ /g, '') : 'SemGrupo' ;
		tagName = (typeof tagName === 'undefined' && tagName == '' ) ? ' ' : tagName;
        tagName = ( (type == 'arrivaldate' || type == 'acessdate' || type == 'senddate') && tagName.indexOf('.') !== -1 ) ? tagName.split('.')[1] : tagName;
	var tbRecebidos = $('#divRecebidos table');
	var countTd = tbRecebidos.find('tr:not(.tablesorter-headerRow)').eq(1).find('td').length;
	var iconSelect = '<label id="lblInfraCheck" for="lnkInfraCheck" accesskey=";"></label><a id="lnkInfraCheck" onclick="getSelectAllTr(\''+tagName_+'\');"><img src="/infra_css/imagens/check.gif" id="imgRecebidosCheck" title="Selecionar Tudo" alt="Selecionar Tudo" class="infraImg"></a></th>';
	var tagCount = $('#divRecebidos table tbody').find('tr[data-tagname="'+tagName_+'"]:visible').length;
	var htmlBody = '<tr class="infraCaption tagintable"><td colspan="'+(countTd+3)+'">'+tagCount+' registros:</td></tr>'
					+'<tr head-tagname="'+tagName_+'" class="tagintable">'
					+'<th class="tituloControle" width="5%" align="center">'+iconSelect+'</th>'
					+'<th class="tituloControle" colspan="'+(countTd+2)+'">'+tagName+'</th>'
					+'</tr>';
		$(htmlBody).appendTo('#divRecebidos table tbody');
		if ( i == 0 ) { tbRecebidos.find('tr').eq(0).hide(); tbRecebidos.find('caption').hide(); }
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
            var textBox = textBoxDesc+'\u00DAltimo acesso em: '+moment(dataRecebido.datetime, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY HH:mm');
            var textDataRecebido = (dataRecebido != '' && type == 'acessdate') ? moment(dataRecebido.datetime, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY HH:mm') : '';
                textDataRecebido = (dataRecebido != '' && type == 'arrivaldate') ? moment(dataRecebido.datahora, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY') : textDataRecebido;
                textDataRecebido = (dataRecebido != '' && (type == 'senddate' || type == 'senddepart') && dataRecebido.datesend != '') ? moment(dataRecebido.datesend, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY') : textDataRecebido;
            var htmlDataRecebido = (dataRecebido != '') ? '<td class="tagintable"><span onmouseout="return infraTooltipOcultar();" onmouseover="return infraTooltipMostrar(\''+textBox+'\')">'+textDataRecebido+'</span></td>' : '<td class="tagintable"></td>';
    			$(this).find('td').eq(3).after(htmlDesc+htmlDataRecebido);
    		var cloneTr = $(this).clone();
    		$('#divRecebidos table tbody').find('tr[head-tagname="'+dataTag+'"]').after(cloneTr);
    		$(this).remove(); 
    	}
    });
    var tbody = $('#divRecebidos table tbody');
    var nrSemGrupo = tbody.find('tr[data-tagname="SemGrupo"]:visible').length;
    if (nrSemGrupo == 0) { 
        tbody.find('tr.infraCaption.tagintable').eq(0).remove();
        tbody.find('tr[head-tagname="SemGrupo"]').remove();
    } else {
        var textRegistros = (nrSemGrupo == 1) ? nrSemGrupo+' registro:' : nrSemGrupo+' registros:' ;
        tbody.find('tr.infraCaption.tagintable').eq(0).find('td').text(textRegistros);
    }
}
function getArrayProcessoRecebido(href) {
    var storeRecebimento = ( typeof localStorageRestorePro('configDataRecebimentoPro') !== 'undefined' && !$.isEmptyObject(localStorageRestorePro('configDataRecebimentoPro')) ) ? localStorageRestorePro('configDataRecebimentoPro') : [];
    var id_procedimento = String(getParamsUrlPro(href).id_procedimento);
    var dadosRecebido = (jmespath.search(storeRecebimento, "[?id_procedimento=='"+id_procedimento+"'] | length(@)") > 0) ? jmespath.search(storeRecebimento, "[?id_procedimento=='"+id_procedimento+"'] | [0]") : '';
    return dadosRecebido;
}
function insertGroupTable(TimeOut = 9000) {
    if (typeof checkConfigValue !== 'undefined' && checkConfigValue('agruparlista')) {
        var statusTableTags = ( typeof localStorageRestorePro !== "undefined" && localStorageRestorePro('selectGroupTablePro') != null && localStorageRestorePro('selectGroupTablePro') == 'tags' ) ? 'selected' : '';
        var statusTableTypes = ( typeof localStorageRestorePro !== "undefined" && localStorageRestorePro('selectGroupTablePro') != null && localStorageRestorePro('selectGroupTablePro') == 'types' ) ? 'selected' : '';
        var statusTableUsers = ( typeof localStorageRestorePro !== "undefined" && localStorageRestorePro('selectGroupTablePro') != null && localStorageRestorePro('selectGroupTablePro') == 'users' ) ? 'selected' : '';
        var statusTableCheckpoints = ( typeof localStorageRestorePro !== "undefined" && localStorageRestorePro('selectGroupTablePro') != null && localStorageRestorePro('selectGroupTablePro') == 'checkpoints' ) ? 'selected' : '';
        var statusTableArrivaldate = ( typeof localStorageRestorePro !== "undefined" && localStorageRestorePro('selectGroupTablePro') != null && localStorageRestorePro('selectGroupTablePro') == 'arrivaldate' ) ? 'selected' : '';
        var statusTableSenddate = ( typeof localStorageRestorePro !== "undefined" && localStorageRestorePro('selectGroupTablePro') != null && localStorageRestorePro('selectGroupTablePro') == 'senddate' ) ? 'selected' : '';
        var statusTableAcessdate = ( typeof localStorageRestorePro !== "undefined" && localStorageRestorePro('selectGroupTablePro') != null && localStorageRestorePro('selectGroupTablePro') == 'acessdate' ) ? 'selected' : '';
        var statusTableDepartSend = ( typeof localStorageRestorePro !== "undefined" && localStorageRestorePro('selectGroupTablePro') != null && localStorageRestorePro('selectGroupTablePro') == 'senddepart' ) ? 'selected' : '';
        var htmlControl =    '<div id="newFiltro" style="display: inline-block;vertical-align: top;float: right;text-align: right;width: 100%;">'
                            +'  <select id="selectGroupTablePro" class="groupTable" onchange="updateGroupTable(this)">'
                            +'     <option value="">Agrupar processos recebidos/gerados</option>'
                            +'     <option value="arrivaldate" '+statusTableArrivaldate+'>Agrupar processos por data de recebimento</option>'
                            +'     <option value="senddate" '+statusTableSenddate+'>Agrupar processos por data de envio</option>'
                            +'     <option value="acessdate" '+statusTableAcessdate+'>Agrupar processos por data do \u00FAltimo acesso</option>'
                            +'     <option value="tags" '+statusTableTags+'>Agrupar processos por marcadores</option>'
                            +'     <option value="types" '+statusTableTypes+'>Agrupar processos por tipo</option>'
                            +'     <option value="users" '+statusTableUsers+'>Agrupar processos por respons\u00E1vel</option>'
                            +'     <option value="checkpoints" '+statusTableCheckpoints+'>Agrupar processos por ponto de controle</option>'
                            +'     <option value="senddepart" '+statusTableDepartSend+'>Agrupar processos por unidade de envio</option>'
                            +' </select>'
                            +'</div>';

        if ( $('#selectGroupTablePro').length == 0 ) { $('#divFiltro').after(htmlControl); updateGroupTable($('#selectGroupTablePro')); }
        if ( $('#idSelectTipoBloco').length != 0 ) { 
            $("#idSelectTipoBloco").appendTo("#newFiltro");
            $("#idSelectBloco").appendTo("#newFiltro");
        }
    } else {
        setTimeout(function(){ 
            insertGroupTable(TimeOut - 100); 
            console.log('Reload insertGroupTable'); 
        }, 500);
    }
}
function updateGroupTable(this_) {
    var valueSelect = $(this_).val();
    initTableTag(valueSelect);
    if ( typeof valueSelect !== 'undefined' && valueSelect != '' ) { 
        localStorageStorePro('selectGroupTablePro', valueSelect);
        if (valueSelect == 'arrivaldate' || valueSelect == 'acessdate' || valueSelect == 'senddate' || valueSelect == 'senddepart') { 
            statusPesquisaDadosProcedimentos = true;
            getDadosProcedimentosControlar(); 
        } else {
            cancelDadosProcedimentosControlar();
        }
    } else if ( typeof valueSelect !== 'undefined' ) { 
         if ( typeof localStorageRemovePro !== "undefined" ) { localStorageRemovePro('selectGroupTablePro'); }
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
		appendGerados(type);
		getTableTag(type);
		getTableOnTag(type);
	}
}
function initDadosProcesso(TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    if (typeof getParamsUrlPro !== 'undefined' && typeof getDadosIframeProcessoPro !== 'undefined') { 
        var idProcedimento = getParamsUrlPro(window.location.href).id_procedimento;
        getDadosIframeProcessoPro(idProcedimento, 'processo');	
    } else {
        setTimeout(function(){ 
            initDadosProcesso(TimeOut - 100); 
            console.log('Reload initDadosProcesso'); 
        }, 500);
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

function initSeiPro() {
	if ( $('#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado').length > 0 ) {
        insertGroupTable();
        if ((typeof spreadsheetIdProjetos_Pro !== 'undefined' || typeof spreadsheetIdAtividades_Pro !== 'undefined') && typeof checkConfigValue !== 'undefined' && checkConfigValue('gerenciarprojetos')) { 
            handleClientLoadPro();
        }
	} else if ( $("#ifrArvore").length > 0 ) {
        initDadosProcesso();
        //observeHistoryBrowserPro();
	}
}
$(document).ready(function () { initSeiPro() });
