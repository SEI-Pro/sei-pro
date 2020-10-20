function localStorageRestorePro(item) {
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
}
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
	}
    $('#divRecebidos').find('table tr').attr('data-tagname', 'SemGrupo');
    $('#divRecebidos').find('table a').each(function(index){
        var link = $(this).attr('href');
        if ( typeof link !== 'undefined' && link.indexOf(acaoType_) !== -1 ) {
            var tag = ( acaoType == 'tags' || acaoType == 'types' ) ? $(this).attr('onmouseover').split("','")[1].replace("');","") : '';
                tag = ( acaoType == 'users' ) ? $(this).text() : tag;
                tag = ( acaoType == 'checkpoints' ) ? $(this).attr('onmouseover').split("'")[1] : tag;
            var tag_ = ( tag != '' ) ? removeAcentos(tag).replace(/\ /g, '') : 'SemGrupo' ;
            $(this).closest('tr').attr('data-tagname', tag_);
            arrayTag.push(tag);
        }
    });
    return uniqPro(arrayTag).sort();
}
function appendGerados() {
    $('#divGerados table tr').each(function(index){
        if ( $(this).find('th').length == 0 ) {
        	var idItem = parseInt($('#hdnRecebidosNroItens').val())+1;
        	$(this).addClass('typeGerados').find('input[type=checkbox]')
        		.attr('id','chkRecebidosItem'+idItem)
        		.attr("onclick","infraSelecionarItens(this,'Recebidos')")
        		.attr('name','chkRecebidosItem'+idItem);
        	var lnkRecebidos = $(this).find('td').eq(0).find('a').eq(0);
        		lnkRecebidos.attr('id', 'lnkRecebidos'+lnkRecebidos.attr('name'));
            var outerHTML = $(this)[0].outerHTML;
            $('#divRecebidos').find('table tbody').append(outerHTML);
            $('#hdnRecebidosNroItens').val(idItem);
            $('#hdnRecebidosItens').val($('#hdnRecebidosItens').val()+','+$(this).find('input[type=checkbox]').val());
        }
    });
    $('#divGerados').hide();
    $('#divRecebidos').addClass('tagintable');
}
function getSelectAllTr(tagname) {
	$('tr[data-tagname="'+tagname+'"]').find('input[type=checkbox]').trigger('click')
}
function removeAllTags() {
	$('#divRecebidos table tbody').find('.tagintable').remove();
	$('#divRecebidos table tbody tr').each(function(index){ 
	    if ( $(this).hasClass('typeGerados') ) { 
	        $(this).remove();
	        $('#hdnRecebidosNroItens').val(parseInt($('#hdnRecebidosNroItens').val())-1);
	        var idTr = $(this).find('input[type=checkbox]').val();
	        var hdnRecebidosItens = $('#hdnRecebidosItens').val();
	        var ArrayRecebidosItens = hdnRecebidosItens.split(',');
	        var FilterRecebidosItens =  $.grep(ArrayRecebidosItens, function( a ) { return a !== idTr; }).join(',');
	            $('#hdnRecebidosItens').val(FilterRecebidosItens);
	     } else {
	        $(this).show(); 
	    }
	});
	$('#divRecebidos').removeClass('tagintable').find('caption').show();
	$('#divGerados').show();
    $('table tr.tablesorter-headerRow').show();
}
function getUniqueTableTag(i, tagName) {
	var tagName_ = ( tagName != '' ) ? removeAcentos(tagName).replace(/\ /g, '') : 'SemGrupo' ;
		tagName = ( tagName == '' ) ? ' ' : tagName;
	var tbRecebidos = $('#divRecebidos table');
	var countTd = tbRecebidos.find('tr:not(.tablesorter-headerRow)').eq(1).find('td').length;
	var iconSelect = '<label id="lblInfraCheck" for="lnkInfraCheck" accesskey=";"></label><a id="lnkInfraCheck" onclick="getSelectAllTr(\''+tagName_+'\');"><img src="/infra_css/imagens/check.gif" id="imgRecebidosCheck" title="Selecionar Tudo" alt="Selecionar Tudo" class="infraImg"></a></th>';
	var tagCount = $('#divRecebidos table tbody').find('tr[data-tagname="'+tagName_+'"]').length;
	var htmlBody = '<tr class="infraCaption tagintable"><td colspan="'+(countTd+2)+'">'+tagCount+' registros:</td></tr>'
					+'<tr head-tagname="'+tagName_+'" class="tagintable">'
					+'<th class="tituloControle" width="5%" align="center">'+iconSelect+'</th>'
					+'<th class="tituloControle" colspan="'+(countTd+1)+'">'+tagName+'</th>'
					+'</tr>';
		$(htmlBody).appendTo('#divRecebidos table tbody');
		if ( i == 0 ) { tbRecebidos.find('tr').eq(0).hide(); tbRecebidos.find('caption').hide(); }
}
function getTableOnTag() {
    $('#divRecebidos table tbody tr').each(function(index){
    	var dataTag = $(this).attr('data-tagname');
    		dataTag = ( dataTag == '' ) ? 'SemGrupo' : dataTag;
    	if ( typeof dataTag !== 'undefined' && $(this).find('td').eq(2).find('a').length > 0 ) {
    		var desc = $(this).find('td').eq(2).find('a').attr('onmouseover').split("','");
    		var htmlDesc = '<td class="tagintable">'+desc[0].replace("return infraTooltipMostrar('", "")+'</td><td class="tagintable">'+desc[1].replace("');","")+'</td>';
    			$(this).find('td').eq(3).after(htmlDesc);
    		var cloneTr = $(this).clone();
    		$('#divRecebidos table tbody').find('tr[head-tagname="'+dataTag+'"]').after(cloneTr);
    		$(this).remove(); 
    	}
    });
}
function insertGroupTable() {
	var statusTableTags = ( typeof localStorageRestorePro !== "undefined" && localStorageRestorePro('selectGroupTablePro') != null && localStorageRestorePro('selectGroupTablePro') == 'tags' ) ? 'selected' : '';
	var statusTableTypes = ( typeof localStorageRestorePro !== "undefined" && localStorageRestorePro('selectGroupTablePro') != null && localStorageRestorePro('selectGroupTablePro') == 'types' ) ? 'selected' : '';
	var statusTableUsers = ( typeof localStorageRestorePro !== "undefined" && localStorageRestorePro('selectGroupTablePro') != null && localStorageRestorePro('selectGroupTablePro') == 'users' ) ? 'selected' : '';
	var statusTableCheckpoints = ( typeof localStorageRestorePro !== "undefined" && localStorageRestorePro('selectGroupTablePro') != null && localStorageRestorePro('selectGroupTablePro') == 'checkpoints' ) ? 'selected' : '';
	var htmlControl =    '<div id="newFiltro" style="display: inline-block;vertical-align: top;float: right;text-align: right;width: 100%;">'
                        +'  <select id="selectGroupTablePro" class="groupTable" onchange="updateGroupTable(this)">'
	                    +'     <option value="">Agrupar processos recebidos/gerados</option>'
	                    +'     <option value="tags" '+statusTableTags+'>Agrupar processos por marcadores</option>'
	                    +'     <option value="types" '+statusTableTypes+'>Agrupar processos por tipo</option>'
	                    +'     <option value="users" '+statusTableUsers+'>Agrupar processos por respons\u00E1vel</option>'
	                    +'     <option value="checkpoints" '+statusTableCheckpoints+'>Agrupar processos por ponto de controle</option>'
	                    +' </select>'
	                    +'</div>';
	
	if ( $('#selectGroupTablePro').length == 0 ) { $('#divFiltro').after(htmlControl); updateGroupTable($('#selectGroupTablePro')); }
	if ( $('#idSelectTipoBloco').length != 0 ) { 
        $("#idSelectTipoBloco").appendTo("#newFiltro");
        $("#idSelectBloco").appendTo("#newFiltro");
    }
}
function updateGroupTable(this_) {
    var valueSelect = $(this_).val();
    initTableTag(valueSelect);
    if ( typeof valueSelect !== 'undefined' && valueSelect != '' ) { 
        localStorageStorePro('selectGroupTablePro', valueSelect);
    } else if ( typeof valueSelect !== 'undefined' ) { 
         if ( typeof localStorageRemovePro !== "undefined" ) { localStorageRemovePro('selectGroupTablePro'); }
    }
}
function getTableTag(type) {
    var listTags = getListTypes(type);
    $.each(listTags, function (i, val) {
        getUniqueTableTag(i, val);
    });
}
function initTableTag(type = '') {
	removeAllTags();
	if ( type != '' ) {
		appendGerados();
		getTableTag(type);
		getTableOnTag();
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

function initSeiPro() {
	if ( $('#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado').length > 0 ) {
		insertGroupTable();
        if ( typeof spreadsheetIdProjetos_Pro !== 'undefined' || typeof spreadsheetIdAtividades_Pro !== 'undefined' ) { handleClientLoadPro() }
	} else if ( $("#ifrArvore").length > 0 ) {
	   initDadosProcesso();
	}
}
$(document).ready(function () { initSeiPro() });