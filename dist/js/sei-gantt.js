// INSERE ACOMPANHAMENTO DE PROJETOS
function loadEtapasSheet() {
    loadSheetIconPro('load');
    var ranges = [
                    rangeEtapasPro,
                    rangeProjetosPro,
					rangeFeriadosNacionaisPro,
                    rangeConfigGeral
                ];
    gapi.client.sheets.spreadsheets.values.batchGet({
      spreadsheetId: spreadsheetIdProjetos_Pro,
      ranges: ranges
    }).then((response) => {
        loadSheetIconPro('complete');
        loadEtapasSheetAction(response.result);
        localStorageStorePro('loadEtapasSheet', response.result);
    }, function(error) {
        loadSheetIconPro('noperfil');
        console.log(error.result.error.message, error);
        var msg_error = JSON.stringify(error.result.error.message, null, 2);
        var htmlBox =   msg_error+
                        '<div style="margin-top: 30px;"><table style="font-size: 10pt;width: 100%;" class="seiProForm">'+
                        '   <tbody>'+
                        '       <tr style="height: 40px;">'+
                        '          <td><i class="iconPopup fas fa-sync-alt cinzaColor"></i> Alternar base de dados</td>'+
                        '          <td>'+getSelectConfigGantt()+'</td>'+
                        '      </tr>'+
                        '   </tbody>'+
                        '</div></table>';
        alertaBoxPro('Error', 'exclamation-triangle', htmlBox);
    });
}
function loadEtapasSheetAction(result) {
    if ($('#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado').length > 0) {
        dadosEtapasObj = arraySheetToJSON(result.valueRanges[0].values);
        dadosProjetosObj = arraySheetToJSON(result.valueRanges[1].values);
        feriadosNacionaisProArray = result.valueRanges[2].values;
        configGeralObj = arraySheetToJSON(result.valueRanges[3].values);
        setProjetosGantt('insert');
    }
}
function deletReportProjetosGantt(this_) {
    var id = $(this_).closest('li').attr('aria-controls');
    var id_ = id.replace('svgtab_report','gantt_report');
        $(this_).closest('li').remove();
        $('#'+id).remove();
        $('#projetosGanttTabs').tabs('refresh');
	for (i = 0; i < ganttProject.length; i++) {
		if ( typeof ganttProject[i] !== 'undefined' && ganttProject[i].$svg.id.indexOf(id_) !== -1 ) {   
            ganttProject.splice(i,1);
            i--;
		}
	}
}
function openFilterProjetoGantt() {
    var macroetapaList = uniqPro(jmespath.search(ganttProjectSelect, "[*].Macroetapa | []"));
    var grupoList = uniqPro(jmespath.search(ganttProjectSelect, "[*].Grupo | []"));
    var responsavelList = uniqPro(jmespath.search(ganttProjectSelect, "[*].Responsavel | []"));
    var optionSelectMacroetapa = ( macroetapaList.length > 0 ) ? $.map(macroetapaList, function(v,k){ return '<option data-name="macroetapa" value="'+v+'">Macroetapa: '+v+'</option>' }).join('') : '';
    var optionSelectGrupo = ( grupoList.length > 0 ) ? $.map(grupoList, function(v,k){ return '<option data-name="grupo" value="'+v+'">Grupo: '+v+'</option>' }).join('') : '';
    var optionSelectResponsavel = ( responsavelList.length > 0 ) ? $.map(responsavelList, function(v,k){ return '<option data-name="responsavel" value="'+v+'">Respons\u00E1vel: '+v+'</option>' }).join('') : '';
    var selectFilter = '<select style="width: 100%; height: 30px; margin: 0 !important; padding: 0 5px !important;" class="required infraText txtsheetsSelect" id="selectBoxFilter">'+
                        '<option data-name="em_execucao" value="">Etapas em execu\u00E7\u00E3o</option>'+
                        '<option data-name="concluidas" value="">Etapas conclu\u00EDdas</option>'+
                        '<option data-name="atrasadas" value="">Etapas atrasadas</option>'+
                        optionSelectMacroetapa+
                        optionSelectGrupo+
                        optionSelectResponsavel+
                        '</select>';
    var textBox =  '<div class="details-container seiProForm GanttFormInsertProjeto">'+
                   '   <table class="tableInfo popup-wrapper">'+
                   '      <tr><td><p><i class="iconPopup fas fa-filter cinzaColor"></i> Filtro do Relat\u00F3rio *</p></td><td><p>'+selectFilter+'</p></td></tr>'+
                   '   </table>'+
                   '</div>';
    
    resetDialogBoxPro('dialogBoxPro');
    dialogBoxPro = $('#dialogBoxPro')
        .html('<div class="dialogBoxDiv"> '+textBox+'</span>')
        .dialog({
            title: "Gerar Relat\u00F3rio Filtrado",
        	width: 600,
        	buttons: [{
                text: "Ok",
                class: 'confirm',
                click: function() {
                    var nameFilter = $('#selectBoxFilter option:selected').data('name');
                    var valueFilter = $('#selectBoxFilter option:selected').val();
                    var filter = {name: nameFilter, value: valueFilter};
                    filterProjetosGantt(filter);
                    $(this).dialog('close');
                }
            }]
    });
}
function filterProjetosGantt(filter) {
    if ( filter.name == 'em_execucao' ) {
        // Etapas em execucao
        var dadosEtapasReport = jmespath.search(dadosEtapasObj, "[?Data_Conclusao==''] | [?Progresso_Execucao!='0']");
        var nameReport = '(Etapas em execu\u00E7\u00E3o)';
    } else if ( filter.name == 'concluidas' ) {
        // Etapas concluidas
        var dadosEtapasReport = jmespath.search(dadosEtapasObj, "[?Data_Conclusao!=''] | [?Progresso_Execucao=='100']");
        var nameReport = '(Etapas conclu\u00EDdas)';
    } else if ( filter.name == 'atrasadas' ) {
        // Etapas atrasadas
        var dadosEtapasReport = [];
        var t = jmespath.search(dadosEtapasObj, "[?Data_Conclusao==''] | [?Progresso_Execucao!='100']");
            $.map(t, function(v,k){ return ( moment(v['Data_Fim'],'DD/MM/YYYY') < moment() ) ? dadosEtapasReport.push(v) : '' });
        var nameReport = '(Etapas atrasadas)';
    } else if ( filter.name == 'grupo' ) {
        // Etapas por Grupo
        var dadosEtapasReport = jmespath.search(dadosEtapasObj, "[?Grupo=='"+filter.value+"']");
        var valueAssunto = ( filter.value.length > 50 ) ? filter.value.replace(/^(.{50}[^\s]*).*/, "$1")+'...' : filter.value;
        var nameReport = '(Grupo: '+valueAssunto+')';
    } else if ( filter.name == 'macroetapa' ) {
        // Etapas por Macroetapa
        var dadosEtapasReport = jmespath.search(dadosEtapasObj, "[?Macroetapa=='"+filter.value+"']");
        var valueAssunto = ( filter.value.length > 50 ) ? filter.value.replace(/^(.{50}[^\s]*).*/, "$1")+'...' : filter.value;
        var nameReport = '(Macroetapa: '+valueAssunto+')';
    } else if ( filter.name == 'responsavel' ) {
        // Etapas por Responsavel
        var dadosEtapasReport = jmespath.search(dadosEtapasObj, "[?Responsavel=='"+filter.value+"']");
        var valueAssunto = ( filter.value.length > 50 ) ? filter.value.replace(/^(.{50}[^\s]*).*/, "$1")+'...' : filter.value;
        var nameReport = '(Respons\u00E1vel: '+valueAssunto+')';
    }
    var dadosProjetosReport = uniqPro(jmespath.search(dadosEtapasReport, "[*].ID_Projeto"));
    
if ( typeof dadosProjetosReport !== 'undefined' && dadosProjetosReport.length > 0 ) {
        var divGantt = '';
        var idReport = randomString(8);
        var width = $('#projetosGanttDiv').width();
        var iconCloseTab = '<i class="fas fa-times-circle closeReport" onclick="deletReportProjetosGantt(this)"></i>';
            $('#projetosGanttTabs ul').append('<li><a href="#svgtab_report_'+idReport+'">Relat\u00F3rio '+nameReport+' '+iconCloseTab+'</a></li>');
            $('#projetosGanttTabs').append('<div id="svgtab_report_'+idReport+'" class="ganttReport resizeObserve"></div>');
    
        $.each(dadosProjetosReport, function (index, value) {
            var nameID = value;
            var dadosTask = jmespath.search(dadosEtapasReport, "[?ID_Projeto=='"+value+"']");
            if ( dadosTask.length > 0 ) {
                dadosTask = dadosTask.sort(function(a, b){
                              var aa = a.Data_Inicio.split('/').reverse().join(),
                                  bb = b.Data_Inicio.split('/').reverse().join();
                              return aa < bb ? -1 : (aa > bb ? 1 : 0);
                              });
                var task = [];
                var nameDisplay = jmespath.search(dadosProjetosObj, "[?ID_Projeto=='"+value+"'].Nome_Projeto | [0]");
                var taskMacroetapa = [];
                var taskResponsavel = [];
                var taskDependencies = [['']];
                var taskGrupo = [];
                var processoSEI = '';
                var protocoloSEI = '';

                $('#projetosGanttTabs #svgtab_report_'+idReport+'').append('<h2>'+nameDisplay+'</h2><svg id="gantt_report_'+idReport+'_'+nameID+'" class="svg_gantt"></svg>');
                
                $.each(dadosTask, function (indexT, dTask) {
                    //nameDisplay = jmespath.search(dadosProjetosObj, "[?ID_Projeto=='"+dTask.ID_Projeto+"'].Nome_Projeto | [0]");
                    var start = moment(dTask.Data_Inicio, "DD/MM/YYYY");
                    var end = moment(dTask.Data_Fim, "DD/MM/YYYY");
                    var progress = parseFloat(dTask.Progresso_Execucao);
                    var dependencies = ( jmespath.search(dadosEtapasReport, "[?ID_Projeto=='"+dTask.ID_Projeto+"'] | [?ID=='"+dTask.Dependencia+"'] | [0]") ) ? dTask.Dependencia : '';

                    if ( dTask.Progresso_Automatico_Inicio != '' && dTask.Data_Conclusao == '' && progress < 100 ) {
                        var percentProgress = ganttAutoProgressPercent(moment(dTask.Progresso_Automatico_Inicio, 'DD/MM/YYYY'), moment(dTask.Progresso_Automatico_Fim, 'DD/MM/YYYY'));
                        if ( typeof gapi.client !== 'undefined' && dTask.Progresso_Automatico_Inicio != '' && percentProgress < 100 && percentProgress != progress && percentProgress >= 0 ) {
                            updateProgressoGantt(dTask.ROW, percentProgress, 'inline', []);
                            progress = percentProgress;
                        }
                    }
                    var customClass = ( moment() <= end && moment() >= start ) ? 'bar-ongoing' : 'bar-inday';   
                        customClass = ( progress < 100 && end < moment() ) ? 'bar-delay' : customClass;
                        customClass = ( dTask.Data_Conclusao != '' ) ? 'bar-complete' : customClass;
                    var taskProjeto = {
                                        id: dTask.ID,
                                        rowTask: dTask.ROW,
                                        idProjeto: dTask.ID_Projeto,
                                        index: index,
                                        name: dTask.Nome_Etapa,
                                        start: moment(dTask.Data_Inicio, "DD/MM/YYYY").format("YYYY-MM-DD"),
                                        end: moment(dTask.Data_Fim, "DD/MM/YYYY").format("YYYY-MM-DD"),
                                        progress: progress,
                                        dependencies: dependencies,
                                        custom_class: customClass
                                      };
                    task.push(taskProjeto);
                    processoSEI = dTask.Processo_SEI;
                    protocoloSEI = dTask.Protocolo_SEI;
                });

                var gantt = new Gantt("#gantt_report_"+idReport+"_"+nameID, task,{
                    header_height: 50,
                    column_width: 10,
                    step: 24,
                    language: 'en',
                    language: 'ptBr',
                    view_modes: ['Day', 'Week', 'Month'],
                    bar_height: 15,
                    bar_corner_radius: 3,
                    arrow_curve: 5,
                    padding: 18,
                    edit_task: false,
                    view_mode: 'Month',   
                    date_format: 'YYYY-MM-DD',
                    custom_popup_html: function(task) {
                        var dataProj = jmespath.search(dadosEtapasReport, "[?ROW=='"+task.rowTask+"'] | [0]");
                        var linkConcluirEtapa = ( dataProj.Data_Conclusao == '' ) ? '<a class="ui-button ui-corner-all ui-widget" style="color: #2b2b2b; text-decoration: none; float: right;" onclick="concluirEtapaGantt(\''+task.rowTask+'\')"><i style="margin-right: 3px;" class="fas fa-check-circle verdeColor"></i>Concluir Etapa</a>' : '';
                        var linkEditarEtapa =   '<span class="boxInfo"><a class="ui-button ui-corner-all ui-widget" style="color: #2b2b2b; text-decoration: none;" onclick="editarEtapaGantt(this, \''+task.rowTask+'\')"><i style="margin-right: 3px;" class="fas fa-pencil-alt"></i></a></span>';
                        var linkSalvarEtapa =   '<span class="boxInput" style="display:none"><a class="ui-button ui-corner-all ui-widget" style="color: #2b2b2b; text-decoration: none;float: right;" onclick="salvarEtapaGantt(this, \''+task.rowTask+'\')"><i style="margin-right: 3px;" class="fas fa-save"></i>Salvar</a></span>';
                        var linkExcluirEtapa = '<span class="boxInput" style="display:none"><a class="ui-button ui-corner-all ui-widget" style="color: #9c0000; text-decoration: none;" onclick="excluirEtapaGantt(this, \''+task.rowTask+'\')"><i style="margin-right: 3px;" class="fas fa-trash-alt vermelhoColor"></i>Excluir Etapa</a></span>';
                        var htmlConclusaoEtapa = ( dataProj.Data_Conclusao != '' ) ? '<tr><td><p><i class="iconPopup fas fa-check-circle cinzaColor"></i> Conclus\u00E3o da etapa: </strong></p></td><td><p><strong><span class="boxInfo">'+dataProj.Data_Conclusao+'</span><span class="boxInput" style="display:none"><input type="date" style="margin: 0 !important; padding: 0 5px !important; width: 90%" class="required infraText txtsheetsSelect" id="dtBoxConclusaoEtapa" value="'+moment(dataProj.Data_Conclusao,'DD/MM/YYYY').format('YYYY-MM-DD')+'"></span></p></td></tr>' : '';
                        var htmlDocumento_Rel = ( dataProj.Documento_Relacionado != '' ) ? '<tr><td colspan="2"><p><i class="iconPopup fas fa-file-alt cinzaColor"></i> <span class="boxInfo"><strong><a style="font-size: 12px;" onmouseover="return infraTooltipMostrar(\'Visualiza\u00E7\u00E3o r\u00E1pida\');" onmouseout="return infraTooltipOcultar();" onclick="openSEINrPro(this, \''+dataProj.SEI_Relacionado+'\')">'+dataProj.Documento_Relacionado+' ('+dataProj.SEI_Relacionado+') <i class="fas fa-eye bLink" style="font-size: 80%;vertical-align: top;margin-left: 5px;"></i></a></strong></span></p></td></tr>' : '';
                        var htmlObservacao = ( dataProj.Observacao != '' ) ? '<tr><td colspan="2"><p><i class="iconPopup fas fa-comment-alt cinzaColor"></i> <strong style="font-style: italic; color: #585858;"><span class="boxInfo">'+dataProj.Observacao+'</span></strong></p></td></tr>' : '';
                        var textLabelContagemDias = ( jmespath.search(dadosProjetosObj, "[?ID_Projeto=='"+dataProj.ID_Projeto+"'].Contagem_Dias | [0]") == 'Dias_Uteis' ) ? 'Dias \u00FAteis' : 'Dias';
                        var html = '<div class="details-container seiProForm">'+
                                   '   <table class="tableInfo">'+
                                   '      <tr><td colspan="3"><h5><input type="hidden" value="'+dataProj.ID_Projeto+'" id="dtBoxIDProjeto"><i class="iconPopup fas fa-project-diagram cinzaColor"></i> <span class="boxInfo" style="font-size: 11pt; font-weight: bold;">'+dataProj.Nome_Etapa+'</span><a style="float: right; margin: -4px -4px 0 0; padding: 5px;" onclick="closeAllPopups()"><i class="far fa-times-circle cinzaColor"></i></a></h5></td></tr>'+
                                   '      <tr><td colspan="3"><h5><input type="hidden" value="'+dataProj.Protocolo_SEI+'" id="dtBoxProtocoloSEI"><i class="iconPopup fas fa-folder-open cinzaColor"></i> <span class="boxInfo"><a onclick="openLinkSEIPro(\''+dataProj.Protocolo_SEI+'\')">'+dataProj.Processo_SEI+' <i class="fas fa-external-link-alt bLink" style="font-size: 90%;"></i></a></span></h5></td></tr>'+
                                   '      <tr><td><p style="display: inline-flex;"><i class="iconPopup fas fa-percentage cinzaColor"></i>  <span style="padding: 3px 5px 0 0; width: 115px;"><span class="gantt-percent" style="width: 25px; display: inline-block; text-align: right;">'+task.progress+'</span>% Executado</span></td></tr>'+
                                   '      <tr><td><p><i class="iconPopup fas fa-clock cinzaColor"></i> In\u00EDcio da Etapa:</td><td><span class="boxInfo">'+moment(task.start,'YYYY-MM-DD').format('DD/MM/YYYY')+'</span></p></td></tr>'+
                                   '      <tr><td><p><i class="iconPopup far fa-clock cinzaColor"></i> Fim da Etapa:</td><td><span class="boxInfo">'+moment(task.end,'YYYY-MM-DD').format('DD/MM/YYYY')+'</span></p></td></tr>'+
                                   '      <tr><td colspan="3" style="height: 10px !important;border-top: 1px solid #ccc;"><a style="float: right;margin-top: -14px;background: #fff;padding: 5px;" onclick="showDetalheGantt(this)"><i class="fas fa-angle-down cinzaColor"></i></a></td></tr>'+
                                   '      <tr class="detalheBox" style="display:none"><td><p><i class="iconPopup fas fa-business-time cinzaColor"></i> '+textLabelContagemDias+':</td><td><span class="boxInfo">'+dataProj.Dias_Execucao+'</span></p></td></tr>'+
                                   '      <tr class="detalheBox" style="display:none"><td><p><i class="iconPopup fas fa-user-tie cinzaColor"></i> Respons\u00E1vel:</td><td><span class="boxInfo">'+dataProj.Responsavel+'</span></p></td></tr>'+
                                   '      <tr class="detalheBox" style="display:none"><td><p><i class="iconPopup fas fa-layer-group cinzaColor"></i> Macroetapa:</td><td><span class="boxInfo">'+dataProj.Macroetapa+'</span></p></td></tr>'+
                                   '      <tr class="detalheBox" style="display:none"><td><p><i class="iconPopup fas fa-retweet cinzaColor"></i> Depend\u00EAncia:</td><td><span class="boxInfo">'+( jmespath.search(dadosEtapasReport, "[?ID=='"+dataProj.Dependencia+"'] | [0].Nome_Etapa") || '' )+'</span></p></td></tr>'+
                                   '      <tr class="detalheBox" style="display:none"><td><p><i class="iconPopup far fa-object-group cinzaColor"></i> Grupo:</td><td><span class="boxInfo">'+dataProj.Grupo+'</span></p></td></tr>'+
                                   '      <tr class="detalheBox" style="display:none"><td><p><i class="iconPopup fas fa-tags cinzaColor"></i> Etiqueta:</td><td><span class="boxInfo">'+( dataProj.Etiqueta || '' )+'</span></p></td></tr>'+
                                   '      '+htmlConclusaoEtapa+htmlDocumento_Rel+htmlObservacao+
                                   '      <tr style="height: 10px;"></tr>'+
                                   '   </table>'+
                                   '</div>';
                        return html;
                    }
                });
                ganttProject.push(gantt);
                //ganttProjectSelect.push({ID_Projeto: nameID, Processo_SEI: processoSEI, Protocolo_SEI: protocoloSEI, Nome_Projeto: nameDisplay, Macroetapa: taskMacroetapa, Responsavel: taskResponsavel, Dependencias: taskDependencies, Grupo: taskGrupo});
            }
        });
    }
    $('#projetosGanttTabs').tabs('refresh');
    $('.gantt-container').css('max-width',(width-20)).addClass('resizeObserve');
    var activeTab = $('#projetosGanttTabs .ui-tabs-nav li').length-1;
    $('#projetosGanttTabs').tabs( "option", "active",  activeTab);
    scrollGanttToFirstBar();
}
function setProjetosGantt(mode) {
    //if ( typeof dadosEtapasObj !== 'undefined' && dadosEtapasObj.length > 0 ) {
        var statusView = ( getOptionsPro('projetosGanttDiv') == 'hide' ) ? 'display:none;' : 'display: inline-table;';
        var statusIconShow = ( getOptionsPro('projetosGanttDiv') == 'hide' ) ? '' : 'display:none;';
        var statusIconHide = ( getOptionsPro('projetosGanttDiv') == 'hide' ) ? 'display:none;' : '';
        var stateVisualGantt = ( getOptionsPro('stateVisualGantt') == true ) ? true : false;
        var stateArquivadosGantt = ( getOptionsPro('stateArquivadosGantt') == true ) ? true : false;
        var tipoProjetoSelected = ( getOptionsPro('tipoProjetoSelected') != '' ) ? getOptionsPro('tipoProjetoSelected') : '';
        var btnGroup = '<div class="btn-group" role="group" style="float: right;margin-right: 10px;">'+
                       '   <button type="button" data-value="Day" class="btn btn-sm btn-light">Dia</button>'+
                       '      <button type="button" data-value="Week" class="btn btn-sm btn-light">Semana</button>'+
                       '      <button type="button" data-value="Month" class="btn btn-sm btn-light active">M\u00EAs</button>'+
                       '</div>';
        var linkPowerBI = jmespath.search(configGeralObj, "[?Chave=='Painel_PowerBI'].Valor | [0]");
        var iconPainel = ( linkPowerBI !== null ) ? '<a class="newLink" target="_blank" id="painelBI" onmouseover="return infraTooltipMostrar(\'Abrir Painel PowerBI\');" onmouseout="return infraTooltipOcultar();" style="margin: 0; font-size: 14pt;float: right;" href="'+linkPowerBI+'"><i class="fas fa-chart-pie"></i></a>' : '';
        var iconConfig = '<a class="newLink boxConfig" onclick="openConfigGantt()" onmouseover="return infraTooltipMostrar(\'Configura\u00E7\u00F5es\');" onmouseout="return infraTooltipOcultar();" style="margin: 0; font-size: 14pt;float: right;"><i class="fas fa-cog"></i></a>';
        var tipoProjetoArray = uniqPro(jmespath.search(dadosProjetosObj, "[*].Tipo_Projeto")); 
        var optionSelectTipoProjeto = ( tipoProjetoArray.length > 0 ) ? $.map(tipoProjetoArray, function(v,k){ return ( tipoProjetoSelected == v ) ? '<option selected>'+v+'</option>' : '<option>'+v+'</option>' }).join('') : '';
        var htmlSelectTipoProjeto = '<select id="selectTipoProjetoPro" style="max-width: 160px;" class="infraText txtsheetsSelect selectPro" id="tipoProjetoGantt"><option></option>'+optionSelectTipoProjeto+'</select>';

        var idOrder = (getOptionsPro('orderPanelHome') && jmespath.search(getOptionsPro('orderPanelHome'), "[?name=='projetosGantt'].index | length(@)") > 0) ? jmespath.search(getOptionsPro('orderPanelHome'), "[?name=='projetosGantt'].index | [0]") : '';
        var htmlProjetosGantt = '<div class="panelHomePro" style="display: inline-block; width: 100%;" id="projetosGantt" data-order="'+idOrder+'">'+
                                '   <div class="infraBarraLocalizacao titlePanelHome"><i class="fa fa-tasks azulColor" style="margin: 0 5px; font-size: 1.1em;"></i> Projetos'+
                                '       <a class="newLink" id="projetosGanttDiv_showIcon" onclick="toggleTablePro(\'#projetosGanttDiv\',\'show\')" onmouseover="return infraTooltipMostrar(\'Mostrar Tabela\');" onmouseout="return infraTooltipOcultar();" style="font-size: 11pt; '+statusIconShow+'"><i class="fas fa-plus-square cinzaColor"></i></a>'+
                                '       <a class="newLink" id="projetosGanttDiv_hideIcon" onclick="toggleTablePro(\'#projetosGanttDiv\',\'hide\')" onmouseover="return infraTooltipMostrar(\'Recolher Tabela\');" onmouseout="return infraTooltipOcultar();" style="font-size: 11pt; '+statusIconHide+'"><i class="fas fa-minus-square cinzaColor"></i></a>'+
                                '   </div>'+
                                '   <div id="projetosGanttDiv" style="width: 100%;'+statusView+'">'+
                                '   	<div style="position: absolute; z-index: 9; right: 0px; top: 0px;">'+
                                        htmlSelectTipoProjeto+iconConfig+iconPainel+btnGroup+
                                '   	</div>'+
                                '        <div id="projetosGanttTabs">'+
                                '            <ul></ul>'+
                                '        </div>'+
                                '   </div>'+
                                '</div>';

		if ( mode == 'insert' ) {
			if ( $('#projetosGantt').length > 0 ) { $('#projetosGantt').remove(); }
			//$('#panelHomePro').append(htmlProjetosGantt);
            orderDivPanel(htmlProjetosGantt, idOrder, 'projetosGantt');

            if (getOptionsPro('panelSortPro')) {
                initSortDivPanel();
            }

        } else if ( mode == 'refresh' ) {
			$('#projetosGantt').attr('id', 'projetosGantt_temp');
			$('#projetosGantt_temp').after(htmlProjetosGantt);
			$('#projetosGantt_temp').remove();
		}

		ganttProject = [];
		ganttProjectSelect = [];
        var width = $('#projetosGanttDiv').width();    
    
        var dadosProjetosSelected = ( tipoProjetoSelected == '' )
                                    ? dadosProjetosObj
                                    : (jmespath.search(dadosProjetosObj, "[?Tipo_Projeto=='"+tipoProjetoSelected+"'] | length(@)") > 0) 
                                        ? jmespath.search(dadosProjetosObj, "[?Tipo_Projeto=='"+tipoProjetoSelected+"']")
                                        : dadosProjetosObj;
    
        var dadosProjetos = ( stateArquivadosGantt == true ) 
                                ? jmespath.search(dadosProjetosSelected, "sort_by([*],&Nome_Projeto) | [*].ID_Projeto")
                                : jmespath.search(dadosProjetosSelected, "sort_by([*],&Nome_Projeto) | [?Ativo=='TRUE'].ID_Projeto");                
			dadosProjetosUniq = dadosProjetos;

    if ( typeof dadosProjetos !== 'undefined' && dadosProjetos.length > 0 ) {
        $.each(dadosProjetos, function (index, value) {
            var nameID = value;
            var dadosTask = jmespath.search(dadosEtapasObj, "[?ID_Projeto=='"+value+"']");
            if ( dadosTask.length > 0 ) {
                dadosTask = dadosTask.sort(function(a, b){
                              var aa = a.Data_Inicio.split('/').reverse().join(),
                                  bb = b.Data_Inicio.split('/').reverse().join();
                              return aa < bb ? -1 : (aa > bb ? 1 : 0);
                              });
                var task = [];
                var nameDisplay = '';
                var taskMacroetapa = [];
                var taskResponsavel = [];
                var taskDependencies = [['']];
                var taskGrupo = [];
                var processoSEI = '';
                var protocoloSEI = '';
                $.each(dadosTask, function (indexT, dTask) {
                    nameDisplay = jmespath.search(dadosProjetosObj, "[?ID_Projeto=='"+dTask.ID_Projeto+"'].Nome_Projeto | [0]");
                    var start = moment(dTask.Data_Inicio, "DD/MM/YYYY");
                    var end = moment(dTask.Data_Fim, "DD/MM/YYYY");
                    var progress = parseFloat(dTask.Progresso_Execucao);
                    var dependencies = ( jmespath.search(dadosEtapasObj, "[?ID_Projeto=='"+dTask.ID_Projeto+"'] | [?ID=='"+dTask.Dependencia+"'] | [0]") ) ? dTask.Dependencia : '';

                    if ( dTask.Progresso_Automatico_Inicio != '' && dTask.Data_Conclusao == '' && progress < 100 ) {
                        var percentProgress = ganttAutoProgressPercent(moment(dTask.Progresso_Automatico_Inicio, 'DD/MM/YYYY'), moment(dTask.Progresso_Automatico_Fim, 'DD/MM/YYYY'));
                        if ( typeof gapi.client !== 'undefined' && dTask.Progresso_Automatico_Inicio != '' && percentProgress < 100 && percentProgress != progress && percentProgress >= 0 ) {
                            updateProgressoGantt(dTask.ROW, percentProgress, 'inline', []);
                            progress = percentProgress;
                        }
                    }
                    var customClass = ( moment() <= end && moment() >= start ) ? 'bar-ongoing' : 'bar-inday';   
                        customClass = ( progress < 100 && end < moment() ) ? 'bar-delay' : customClass;
                        customClass = ( dTask.Data_Conclusao != '' ) ? 'bar-complete' : customClass;
                    var taskProjeto = {
                                        id: dTask.ID,
                                        rowTask: dTask.ROW,
                                        idProjeto: dTask.ID_Projeto,
                                        index: index,
                                        name: dTask.Nome_Etapa,
                                        start: moment(dTask.Data_Inicio, "DD/MM/YYYY").format("YYYY-MM-DD"),
                                        end: moment(dTask.Data_Fim, "DD/MM/YYYY").format("YYYY-MM-DD"),
                                        progress: progress,
                                        dependencies: dependencies,
                                        custom_class: customClass
                                      };
                    task.push(taskProjeto);
                    taskMacroetapa.push(dTask.Macroetapa);
                    taskResponsavel.push(dTask.Responsavel);
                    taskDependencies.push(dTask.ID);
                    taskGrupo.push(dTask.Grupo);
                    processoSEI = dTask.Processo_SEI;
                    protocoloSEI = dTask.Protocolo_SEI;
                });
                var toolbarProjetosGantt =  '<div class="Gantt_Toolbar" style="display: inline-block; position: absolute; z-index: 9; width: 98%;">'+
                                            '   <a class="newLink boxConfig" onclick="adicionarEtapaGantt(\''+nameID+'\')" onmouseover="return infraTooltipMostrar(\'Adicionar Etapa\');" onmouseout="return infraTooltipOcultar();" style="margin: 0; font-size: 14pt;float: right;"><i class="fas fa-plus-circle"></i></a>'+
                                            '   <a class="newLink boxConfig" onclick="adicionarProjetoGantt(\''+nameID+'\')" onmouseover="return infraTooltipMostrar(\'Editar Projeto\');" onmouseout="return infraTooltipOcultar();" style="margin: 0; font-size: 14pt;float: right;"><i class="fas fa-edit"></i></a>'+
                                            '</div>';
                var nameDisplayState = ( jmespath.search(dadosProjetosObj, "[?ID_Projeto=='"+value+"'].Ativo | [0]") == 'FALSE' ) ? '<span class="tagState">ARQUIVADO</span>' : '';
                var svgProjetosGantt =   '<div id="svgtab_'+nameID+'" class="resizeObserve">'+toolbarProjetosGantt+'<svg id="gantt_'+nameID+'" class="svg_gantt"></svg></div>';
                var liTabsProjetosGantt = '<li><a href="#svgtab_'+nameID+'">'+nameDisplay+nameDisplayState+'</a></li>';
                    $('#projetosGanttTabs ul').append(liTabsProjetosGantt);
                    $('#projetosGanttTabs').append(svgProjetosGantt);
                    taskMacroetapa = uniqPro(taskMacroetapa);
                    taskResponsavel = uniqPro(taskResponsavel);
                    taskGrupo = uniqPro(taskGrupo);

                var gantt = new Gantt("#gantt_"+nameID, task,{
                    header_height: 50,
                    column_width: 10,
                    step: 24,
                    language: 'en',
                    language: 'ptBr',
                    view_modes: ['Day', 'Week', 'Month'],
                    bar_height: 15,
                    bar_corner_radius: 3,
                    arrow_curve: 5,
                    padding: 18,
                    edit_task: stateVisualGantt,
                    view_mode: 'Month',   
                    date_format: 'YYYY-MM-DD',
                    custom_popup_html: function(task) {
                        var dataProj = jmespath.search(dadosEtapasObj, "[?ROW=='"+task.rowTask+"'] | [0]");
                        var linkConcluirEtapa = ( dataProj.Data_Conclusao == '' ) ? '<a class="ui-button ui-corner-all ui-widget" style="color: #2b2b2b; text-decoration: none; float: right;" onclick="concluirEtapaGantt(\''+task.rowTask+'\')"><i style="margin-right: 3px;" class="fas fa-check-circle verdeColor"></i>Concluir Etapa</a>' : '';
                        var linkEditarEtapa =   '<span class="boxInfo"><a class="ui-button ui-corner-all ui-widget" style="color: #2b2b2b; text-decoration: none;" onclick="editarEtapaGantt(this, \''+task.rowTask+'\')"><i style="margin-right: 3px;" class="fas fa-pencil-alt"></i></a></span>';
                        var linkSalvarEtapa =   '<span class="boxInput" style="display:none"><a class="ui-button ui-corner-all ui-widget" style="color: #2b2b2b; text-decoration: none;float: right;" onclick="salvarEtapaGantt(this, \''+task.rowTask+'\')"><i style="margin-right: 3px;" class="fas fa-save"></i>Salvar</a></span>';
                        var linkExcluirEtapa = '<span class="boxInput" style="display:none"><a class="ui-button ui-corner-all ui-widget" style="color: #9c0000; text-decoration: none;" onclick="excluirEtapaGantt(this, \''+task.rowTask+'\')"><i style="margin-right: 3px;" class="fas fa-trash-alt vermelhoColor"></i>Excluir Etapa</a></span>';
                        var htmlConclusaoEtapa = ( dataProj.Data_Conclusao != '' ) ? '<tr><td><p><i class="iconPopup fas fa-check-circle cinzaColor"></i> Conclus\u00E3o da etapa: </strong></p></td><td><p><strong><span class="boxInfo">'+dataProj.Data_Conclusao+'</span><span class="boxInput" style="display:none"><input type="date" style="margin: 0 !important; padding: 0 5px !important; width: 90%" class="required infraText txtsheetsSelect" id="dtBoxConclusaoEtapa" value="'+moment(dataProj.Data_Conclusao,'DD/MM/YYYY').format('YYYY-MM-DD')+'"></span></p></td></tr>' : '';
                        var txtDateAutoProgress = ( typeof dataProj.Progresso_Automatico_Inicio !== 'undefined' && dataProj.Progresso_Automatico_Inicio != '' ) ? dataProj.Progresso_Automatico_Inicio+' \u00E0 '+dataProj.Progresso_Automatico_Fim : '';
                        var htmlAutoProgress = (typeof dataProj.Progresso_Automatico_Inicio !== 'undefined' && dataProj.Progresso_Automatico_Inicio != '') 
                            ? '<a class="ui-button ui-corner-all ui-widget ui-state-active" style="margin-left: 15px; color: #2b2b2b; text-decoration: none;padding: 3px; height: 15px;" onclick="ganttAutoProgress(\''+task.rowTask+'\',\'edit\')" onmouseover="return infraTooltipMostrar(\'Editar execu\u00E7\u00E3o autom\u00E1tica de etapa ('+txtDateAutoProgress+') \');" onmouseout="return infraTooltipOcultar();"><i class="fas fa-cog brancoColor"></i></a>' 
                            : '<a class="ui-button ui-corner-all ui-widget" style="margin-left: 15px; color: #2b2b2b; text-decoration: none;padding: 3px; height: 15px;" onclick="ganttAutoProgress(\''+task.rowTask+'\',\'config\')" onmouseover="return infraTooltipMostrar(\'Configurar execu\u00E7\u00E3o autom\u00E1tica de etapa\');" onmouseout="return infraTooltipOcultar();"><i class="fas fa-cog cinzaColor"></i></a>';
                           htmlAutoProgress = ( dataProj.Data_Conclusao == '' ) ? htmlAutoProgress : '';
                        var htmlPercent = ( dataProj.Data_Conclusao == '' ) ? '<input onchange="ganttPercentRange(this, \'change\', \''+task.rowTask+'\')" oninput="ganttPercentRange(this, \'input\')" type="range" value="'+task.progress+'" min="0" max="100" step="25" style="width: calc( 100% - 20px) !important; border: none; padding: 0 !important;">' : '';
                            htmlPercent = ( typeof dataProj.Progresso_Automatico_Inicio !== 'undefined' && dataProj.Progresso_Automatico_Inicio != '' ) ? '' : htmlPercent;
                        var optionSelectResponsavel = ( taskResponsavel.length > 0 ) ? $.map(taskResponsavel, function(v,k){ return ( dataProj.Responsavel == v ) ? '<option selected>'+v+'</option>' : '<option>'+v+'</option>' }).join('') : '';
                        var optionSelectMacroetapa = ( taskMacroetapa.length > 0 ) ? $.map(taskMacroetapa, function(v,k){ return ( dataProj.Macroetapa == v ) ? '<option selected>'+v+'</option>' : '<option>'+v+'</option>' }).join('') : '';
                        var optionSelectDependencies = ( taskDependencies.length > 0 ) ? $.map(taskDependencies, function(v,k){ var dependencieName = ( v != '' ) ? jmespath.search(dadosEtapasObj, "[?ID=='"+v+"'] | [0].Nome_Etapa") : ''; return ( dataProj.Dependencia == v ) ? '<option selected value="'+v+'">'+dependencieName+'</option>' : '<option value="'+v+'">'+dependencieName+'</option>' }).join('') : '';
                        var optionSelectGrupo = ( taskGrupo.length > 0 ) ? $.map(taskGrupo, function(v,k){ return ( dataProj.Grupo == v ) ? '<option selected>'+v+'</option>' : '<option>'+v+'</option>' }).join('') : '';
                        var htmlSelectResponsavel = '<select style="width: 95%; height: auto; margin: 0 !important; padding: 0 5px !important;" class="required infraText txtsheetsSelect" id="dtBoxResponsavel" onchange="observeNewItem(this)">'+optionSelectResponsavel+'<option value="0">:: NOVO ITEM ::</option></select>';
                        var htmlSelectMacroetapa = '<select style="width: 95%; height: auto; margin: 0 !important; padding: 0 5px !important;" class="required infraText txtsheetsSelect" id="dtBoxMacroetapa" onchange="observeNewItem(this)">'+optionSelectMacroetapa+'<option value="0">:: NOVO ITEM ::</option></select>';
                        var htmlSelectDependencies = '<select style="width: 95%; height: auto; margin: 0 !important; padding: 0 5px !important;" class="required infraText txtsheetsSelect" id="dtBoxDependencies" onchange="observeNewItem(this)">'+optionSelectDependencies+'<option value="0">:: NOVO ITEM ::</option></select>';
                        var htmlSelectGrupo = '<select style="width: 95%; height: auto; margin: 0 !important; padding: 0 5px !important;" class="required infraText txtsheetsSelect" id="dtBoxGrupo" onchange="observeNewItem(this)">'+optionSelectGrupo+'<option value="0">:: NOVO ITEM ::</option></select>';
                        var htmlDocumento_Rel = ( dataProj.Documento_Relacionado != '' ) ? '<tr><td colspan="2"><p><i class="iconPopup fas fa-file-alt cinzaColor"></i> <span class="boxInfo"><strong><a style="font-size: 12px;" onmouseover="return infraTooltipMostrar(\'Visualiza\u00E7\u00E3o r\u00E1pida\');" onmouseout="return infraTooltipOcultar();" onclick="openSEINrPro(this, \''+dataProj.SEI_Relacionado+'\')">'+dataProj.Documento_Relacionado+' ('+dataProj.SEI_Relacionado+') <i class="fas fa-eye bLink" style="font-size: 80%;vertical-align: top;margin-left: 5px;"></i></a></strong></span><span class="boxInput" style="display:none"><select style="width: 88%; height: auto; margin: 0 !important; padding: 0 5px !important;" class="required infraText txtsheetsSelect" id="dtBoxDocRelacionado" data-seirelacionado="'+dataProj.SEI_Relacionado+'"><option value="0">Aguarde...</option></select></span></p></td></tr>' : '';
                        var htmlObservacao = ( dataProj.Observacao != '' ) ? '<tr><td colspan="2"><p><i class="iconPopup fas fa-comment-alt cinzaColor"></i> <strong style="font-style: italic; color: #585858;"><span class="boxInfo">'+dataProj.Observacao+'</span></strong><span class="boxInput" style="display:none"><textarea style="margin: 0 !important;padding: 0 5px !important;width: 84%;border: 1px solid rgb(204, 204, 204);border-radius: 5px; color: rgb(102, 102, 102);" class="required infraText txtsheetsSelect" id="dtBoxObservacao" >'+dataProj.Observacao+'</textarea></span></p></td></tr>' : '';
                        var textLabelContagemDias = ( jmespath.search(dadosProjetosObj, "[?ID_Projeto=='"+dataProj.ID_Projeto+"'].Contagem_Dias | [0]") == 'Dias_Uteis' ) ? 'Dias \u00FAteis' : 'Dias';
                        var html = '<div class="details-container seiProForm">'+
                                   '   <table class="tableInfo">'+
                                   '      <tr><td colspan="3"><h5><input type="hidden" value="'+dataProj.ID_Projeto+'" id="dtBoxIDProjeto"><i class="iconPopup fas fa-project-diagram cinzaColor"></i> <span class="boxInfo" style="font-size: 11pt; font-weight: bold;">'+dataProj.Nome_Etapa+'</span><span class="boxInput" style="display:none"><input type="text" style="margin: 0 !important; padding: 0 5px !important;width: 78%;font-size: 11pt;font-weight: bold;" class="required infraText txtsheetsSelect" id="dtBoxNomeEtapa" value="'+dataProj.Nome_Etapa+'"></span><a style="float: right; margin: -4px -4px 0 0; padding: 5px;" onclick="closeAllPopups()"><i class="far fa-times-circle cinzaColor"></i></a></h5></td></tr>'+
                                   '      <tr><td colspan="3"><h5><input type="hidden" value="'+dataProj.Protocolo_SEI+'" id="dtBoxProtocoloSEI"><i class="iconPopup fas fa-folder-open cinzaColor"></i> <span class="boxInfo"><a onclick="openLinkSEIPro(\''+dataProj.Protocolo_SEI+'\')">'+dataProj.Processo_SEI+' <i class="fas fa-external-link-alt bLink" style="font-size: 90%;"></i></a></span><span class="boxInput" style="display:none"><input type="text" style="margin: 0 !important; padding: 0 5px !important; width: 84%" class="required infraText txtsheetsSelect" onchange="changeProcessoSEI(this, \'box\')" id="dtBoxProcessoEtapa" value="'+dataProj.Processo_SEI+'"></span></h5></td></tr>'+
                                   '      <tr><td><p style="display: inline-flex;"><i class="iconPopup fas fa-percentage cinzaColor"></i>  <span style="padding: 3px 5px 0 0; width: 115px;"><span class="gantt-percent" style="width: 25px; display: inline-block; text-align: right;">'+task.progress+'</span>% Executado</span></td><td><p style="display: inline-flex;">'+htmlPercent+htmlAutoProgress+'</p></td></tr>'+
                                   '      <tr><td><p><i class="iconPopup fas fa-clock cinzaColor"></i> In\u00EDcio da Etapa:</td><td><span class="boxInfo">'+moment(task.start,'YYYY-MM-DD').format('DD/MM/YYYY')+'</span><span class="boxInput" style="display:none"><input type="date" style="margin: 0 !important; padding: 0 5px !important; width: 90%" class="required infraText txtsheetsSelect" id="dtBoxInicioEtapa" max="'+task.end+'" onchange="changeDiasEtapaGantt(this)" value="'+task.start+'"></span></p></td></tr>'+
                                   '      <tr><td><p><i class="iconPopup far fa-clock cinzaColor"></i> Fim da Etapa:</td><td><span class="boxInfo">'+moment(task.end,'YYYY-MM-DD').format('DD/MM/YYYY')+'</span><span class="boxInput" style="display:none"><input type="date" style="margin: 0 !important; padding: 0 5px !important; width: 90%" class="required infraText txtsheetsSelect" id="dtBoxFimEtapa" min="'+task.start+'" onchange="changeDiasEtapaGantt(this)" value="'+task.end+'"></span></p></td></tr>'+
                                   '      <tr><td colspan="3" style="height: 10px !important;border-top: 1px solid #ccc;"><a style="float: right;margin-top: -14px;background: #fff;padding: 5px;border-radius: 5px;" onclick="showDetalheGantt(this)"><i class="fas fa-angle-down cinzaColor"></i></a></td></tr>'+
                                   '      <tr class="detalheBox" style="display:none"><td><p><i class="iconPopup fas fa-business-time cinzaColor"></i> '+textLabelContagemDias+':</td><td><span class="boxInfo">'+dataProj.Dias_Execucao+'</span><span class="boxInput" style="display:none"><input type="number" style="margin: 0 !important; padding: 0 5px !important; width: 90%" class="required infraText txtsheetsSelect" id="dtBoxDiasAnalise" onchange="changeDiasEtapaGantt(this)" min="0" value="'+dataProj.Dias_Execucao+'"></span></p></td></tr>'+
                                   '      <tr class="detalheBox" style="display:none"><td><p><i class="iconPopup fas fa-user-tie cinzaColor"></i> Respons\u00E1vel:</td><td><span class="boxInfo">'+dataProj.Responsavel+'</span><span class="boxInput" style="display:none">'+htmlSelectResponsavel+'</span></p></td></tr>'+
                                   '      <tr class="detalheBox" style="display:none"><td><p><i class="iconPopup fas fa-layer-group cinzaColor"></i> Macroetapa:</td><td><span class="boxInfo">'+dataProj.Macroetapa+'</span><span class="boxInput" style="display:none">'+htmlSelectMacroetapa+'</span></p></td></tr>'+
                                   '      <tr class="detalheBox" style="display:none"><td><p><i class="iconPopup fas fa-retweet cinzaColor"></i> Depend\u00EAncia:</td><td><span class="boxInfo">'+( jmespath.search(dadosEtapasObj, "[?ID=='"+dataProj.Dependencia+"'] | [0].Nome_Etapa") || '' )+'</span><span class="boxInput" style="display:none">'+htmlSelectDependencies+'</span></p></td></tr>'+
                                   '      <tr class="detalheBox" style="display:none"><td><p><i class="iconPopup far fa-object-group cinzaColor"></i> Grupo:</td><td><span class="boxInfo">'+dataProj.Grupo+'</span><span class="boxInput" style="display:none">'+htmlSelectGrupo+'</span></p></td></tr>'+
                                   '      <tr class="detalheBox" style="display:none"><td><p><i class="iconPopup fas fa-tags cinzaColor"></i> Etiqueta:</td><td><span class="boxInfo">'+( dataProj.Etiqueta || '' )+'</span><span class="boxInput" style="display:none"><input type="text" style="margin: 0 !important; padding: 0 5px !important; width: 89%" class="required infraText txtsheetsSelect" id="dtBoxEtiqueta" value="'+( dataProj.Etiqueta || '' )+'"></span></p></td></tr>'+
                                   '      '+htmlConclusaoEtapa+htmlDocumento_Rel+htmlObservacao+
                                   '      <tr style="height: 10px;"></tr>'+
                                   '      <tr class="trCinza"><td><p>'+linkEditarEtapa+linkExcluirEtapa+'</p></td><td><p><span class="boxInfo">'+linkConcluirEtapa+'</span><span class="boxInput" style="display:none">'+linkSalvarEtapa+'</span></p></td></tr>'+
                                   '   </table>'+
                                   '</div>';
                        return html;
                    },
                    on_click: function (task) {
                        console.log(task);
                    },
                    on_date_change: function(task, start, end) {
                        updateDatesProjetosGantt(task, start, end);
                    },
                    on_progress_change: function(task, progress) {
                        updateProgressoGantt(task.rowTask, progress, 'inline', []);
                    },
                    on_view_change: function(mode) {
                        //console.log(mode);
                    }
                });
                ganttProject.push(gantt);
                ganttProjectSelect.push({ID_Projeto: nameID, Processo_SEI: processoSEI, Protocolo_SEI: protocoloSEI, Nome_Projeto: nameDisplay, Macroetapa: taskMacroetapa, Responsavel: taskResponsavel, Dependencias: taskDependencies, Grupo: taskGrupo});
            }
        });
    }
    $('.gantt-container').css('max-width',(width-20));
    $("#projetosGantt .btn-group").on("click", "button", function() {
        $btn = $(this);
        var mode = $btn.data('value');
        $btn.parent().find('button').removeClass('active'); 
        $btn.addClass('active');
        $.each(ganttProject, function (index, value) {
            value.change_view_mode(mode);
        });
    });
    
    setTimeout(function(){ 
        if ($().tabs ) { 
            var toolbarProjetosGantt =  '<div class="Gantt_Toolbar" style="display: contents;position: absolute;z-index: 9;float: right;">'+
                                        '   <a class="newLink boxConfig" onclick="atualizaGantt(this)" onmouseover="return infraTooltipMostrar(\'Atualizar Informa\u00E7\u00F5es\');" onmouseout="return infraTooltipOcultar();" style="margin: 0; font-size: 14pt;float: right;"><i class="fas fa-sync-alt"></i></a>'+
                                        '   <a class="newLink boxConfig" onclick="adicionarProjetoGantt(0)" onmouseover="return infraTooltipMostrar(\'Adicionar Novo Projeto\');" onmouseout="return infraTooltipOcultar();" style="margin: 0; font-size: 14pt;float: right;"><i class="fas fa-plus"></i></a>'+
                                        '   <a class="newLink boxConfig" onclick="openFilterProjetoGantt()" onmouseover="return infraTooltipMostrar(\'Gerar Relat\u00F3rio Filtrado\');" onmouseout="return infraTooltipOcultar();" style="margin: 2px 0; font-size: 12pt;float: right;"><i class="fas fa-filter"></i></a>'+
                                        '</div>';
            $('#projetosGanttTabs').tabs({
                activate: function (event, ui) {
                    var active = $(this).tabs( "option", "active" );
                    setOptionsPro('projetosGanttActiveTabs', active);
                    scrollGanttToFirstBar();
                }
            }).prepend(toolbarProjetosGantt); 
            var activeTab = ( getOptionsPro('projetosGanttActiveTabs') && parseInt(getOptionsPro('projetosGanttActiveTabs')) >= 0 ) ? parseInt(getOptionsPro('projetosGanttActiveTabs')) : 0;
            $('#projetosGanttTabs').tabs( "option", "active",  activeTab);
        }
        $('#selectTipoProjetoPro').on('change', function(){
            var value = $('option:selected', this).val();
                setOptionsPro('tipoProjetoSelected', value);
                setProjetosGantt('refresh');
        });
        scrollGanttToFirstBar();
        normalizeAreaTela();
    }, 300);
}
function atualizaGantt(_this = false) {
    if (_this) { $(_this).find('i').addClass('fa-spin'); }
    loadEtapasSheet();
}
function showDetalheGantt(_this) {
    $(_this).closest('table').find('.detalheBox').toggle();
    if ( $(_this).find('i').hasClass('fa-flip-vertical') ) {
        $(_this).find('i').removeClass('fa-flip-vertical');
    } else {
        $(_this).find('i').addClass('fa-flip-vertical');
    }
}
function adicionarProjetoGantt(idProjeto) {
    var textLabel = ( idProjeto == 0 ) ? 'Inserir' : 'Editar';
    var arrayTipoProjeto = uniqPro(jmespath.search(dadosProjetosObj, "[*].Tipo_Projeto"));
    var optionSelectTipoProjeto = ( arrayTipoProjeto.length > 0 ) ? $.map(arrayTipoProjeto, function(v,k){ return '<option>'+v+'</option>' }).join('') : '';
    var textBox =  '<div class="details-container seiProForm GanttFormInsertProjeto">'+
                   '   <table class="tableInfo popup-wrapper">'+
                   '      <tr><td><p><i class="iconPopup fas fa-briefcase cinzaColor"></i> Nome do Projeto *</td><td><input type="text" style="margin: 0 !important; padding: 0 5px !important; width: 90%" class="required infraText txtsheetsSelect" id="dtBoxNomeProjeto" value=""></span></p></td></tr>'+
                   '      <tr><td><p><i class="iconPopup fas fa-tasks cinzaColor"></i> Tipo do Projeto</td><td><select style="width: 95%; height: auto; margin: 0 !important; padding: 0 5px !important; max-width: 280px;" class="infraText txtsheetsSelect" id="dtBoxTipoProjeto" onchange="observeNewItem(this)"><option></option>'+optionSelectTipoProjeto+'<option value="0">:: NOVO ITEM ::</option></select></p></td></tr>'+
                   '      <tr><td><p><i class="iconPopup fas fa-clock cinzaColor"></i> Contagem de Dias</td><td><select style="width: 95%; height: auto; margin: 0 !important; padding: 0 5px !important; max-width: 280px;" class="infraText txtsheetsSelect" id="dtBoxContagemDias" ><option value="Dias_Uteis">Dias \u00FAteis</option><option value="Dias_Corridos">Dias corridos</option></select></p></td></tr>'+
                   '      <tr><td colspan="2" class="displayInfo" style="display:none;"><p style="color:#E46E64"></p></td></tr>'+
                   '   </table>'+
                   '</div>';
    var textButton = ( jmespath.search(dadosProjetosObj, "[?ID_Projeto=='"+idProjeto+"'].Ativo | [0]") == 'TRUE' ) 
                        ? ['Arquivar', 'ui-icon-arrowthickstop-1-s']
                        : ['Reativar', 'ui-icon-arrowthickstop-1-n'];
    var buttons = ( idProjeto == 0 ) 
            ? [{
                text: 'Inserir Projeto',
                icon: 'ui-icon-disk',
                class: 'confirm',
                click: function() {
                        adicionarProjetoGanttSend();
                    }
                }]
            : [{
                text: textButton[0],
                icon: textButton[1],
                click: function() {
                        arquivarProjetoGantt(idProjeto);
                        $(this).dialog('close');
                    }
                },{
                text: 'Duplicar',
                icon: 'ui-icon-copy',
                click: function() {
                        clonarProjetoGantt(idProjeto);
                        $(this).dialog('close');
                    }
                },{
                text: 'Editar Projeto',
                class: 'confirm',
                icon: 'ui-icon-pencil',
                click: function() {
                        editarProjetoGanttSend(idProjeto);
                    }
                }];
    
    resetDialogBoxPro('dialogBoxPro');
    dialogBoxPro = $('#dialogBoxPro')
        .html('<div class="dialogBoxDiv"> '+textBox+'</span>')
        .dialog({
            title: textLabel+" novo projeto",
        	width: 480,
        	buttons: buttons
    });
    if ( idProjeto != 0 ) {
        var dadosProj = jmespath.search(dadosProjetosObj, "[?ID_Projeto=='"+idProjeto+"'] | [0]");
            $('.GanttFormInsertProjeto #dtBoxNomeProjeto').val(dadosProj.Nome_Projeto);
            $('.GanttFormInsertProjeto #dtBoxTipoProjeto').val(dadosProj.Tipo_Projeto);
            $('.GanttFormInsertProjeto #dtBoxContagemDias').val(dadosProj.Contagem_Dias);
    }
}
function clonarProjetoGantt(idProjetoClone) {
    loadingButtonConfirm(true);
    $('.GanttFormInsertProjeto .displayInfo').hide().find('p').html('');
    
    var d = new Date();
    var dateTimeSheet = d.toLocaleString();    
    var dadosProj = jmespath.search(dadosProjetosObj, "[?ID_Projeto=='"+idProjetoClone+"'] | [0]");
    var idProjeto = randomString(8);
    var nomeProjeto = dadosProj.Nome_Projeto+' (C\u00F3pia)';
    var tipoProjeto = dadosProj.Tipo_Projeto;
    var contagemDias = dadosProj.Contagem_Dias;
    var dadosProjeto = [dateTimeSheet, null, idProjeto, nomeProjeto, tipoProjeto, contagemDias, 'TRUE'];
    
    var range = rangeProjetosPro+"!A1";
    var values = [ dadosProjeto ];
    var data = [];
    data.push({ range: range, values: values });
    var body = { values: values };
    
    gapi.client.sheets.spreadsheets.values.append({
        spreadsheetId: spreadsheetIdProjetos_Pro,
        range: range,
        valueInputOption: "USER_ENTERED",
        resource: body
    }).then((response) => {
        var result = response.result;
        if ( result.updates.updatedRows > 0 ) {
            loadingButtonConfirm(false);
            resetDialogBoxPro('dialogBoxPro');
            alertaBoxPro('Sucess', 'check-circle', 'Projeto duplicado com sucesso!');
            var dadosNewProjetoObj = {
                                    ROW: String(parseInt(dadosProjetosObj[dadosProjetosObj.length-1].ROW)+1),	
                                    ID_Projeto: String(dadosProjeto[2]),
                                    Nome_Projeto: dadosProjeto[3],
                                    Tipo_Projeto: dadosProjeto[4],
                                    Contagem_Dias: dadosProjeto[5],
                                    Ativo: 'TRUE'
                                };
            dadosProjetosObj.push(dadosNewProjetoObj);
            clonarEtapaGanttModelo(idProjeto, idProjetoClone);
        } else {
            loadingButtonConfirm(false);
            alertaBoxPro('Error', 'exclamation-triangle', 'Erro ao duplicar o projeto!');
        }
    }, function(err) { 
        loadingButtonConfirm(false);
        console.error("Execute error", err); 
        alertaBoxPro('Error', 'exclamation-triangle', err.result.error.message );
    });
}
function clonarEtapaGanttModelo(idProjeto, idProjetoClone) {
    var dadosClone = jmespath.search(dadosEtapasObj, "[?ID_Projeto=='"+idProjetoClone+"']");
    var dadosEtapa = [];
    if ( dadosClone.length > 0 ) {
        for (i = 0; i < dadosClone.length; i++) {
            var d = new Date();
            var dateTimeSheet = d.toLocaleString();
            var idTask = randomString(8);
            dadosEtapa.push([
                dateTimeSheet, 
                null, 
                dadosClone[i].ID, 
                idProjeto, 
                dadosClone[i].Dependencia, 
                dadosClone[i].Processo_SEI, 
                dadosClone[i].Protocolo_SEI, 
                dadosClone[i].Nome_Etapa, 
                dadosClone[i].Responsavel, 
                dadosClone[i].Data_Inicio, 
                dadosClone[i].Dias_Execucao, 
                dadosClone[i].Data_Fim, 
                dadosClone[i].Progresso_Execucao, 
                dadosClone[i].Progresso_Automatico_Inicio, 
                dadosClone[i].Progresso_Automatico_Fim, 
                dadosClone[i].Data_Conclusao, 
                dadosClone[i].Documento_Relacionado, 
                dadosClone[i].SEI_Relacionado, 
                dadosClone[i].Observacao, 
                dadosClone[i].Macroetapa, 
                dadosClone[i].Grupo, 
                dadosClone[i].Etiqueta 
            ]);
        }
    }
    
    var range = rangeEtapasPro+"!A1"; 
    var values = dadosEtapa;
    var data = [];
        data.push({ range: range, values: values });
    var body = { values: values };

    gapi.client.sheets.spreadsheets.values.append({
       spreadsheetId: spreadsheetIdProjetos_Pro,
       range: range,
       valueInputOption: "USER_ENTERED",
       resource: body
    }).then((response) => {
        var result = response.result;
        if ( result.updates.updatedRows > 0 ) {
            if ( dadosEtapa.length > 0 ) {
                for (i = 0; i < dadosEtapa.length; i++) {
                    var dadosNewEtapaObj = {
                                    ROW: String(parseInt(dadosEtapasObj[dadosEtapasObj.length-1].ROW)+1),	
                                    ID: dadosEtapa[2],
                                    ID_Projeto: String(dadosEtapa[3]),
                                    Dependencia: dadosEtapa[4],
                                    Processo_SEI: dadosEtapa[5],
                                    Protocolo_SEI: dadosEtapa[6],
                                    Nome_Etapa: dadosEtapa[7],
                                    Responsavel: dadosEtapa[8],
                                    Data_Inicio: dadosEtapa[9],
                                    Dias_Execucao: dadosEtapa[10],
                                    Data_Fim: dadosEtapa[11],
                                    Progresso_Execucao: dadosEtapa[12],
                                    Progresso_Automatico_Inicio: dadosEtapa[13],
                                    Progresso_Automatico_Fim: dadosEtapa[14],
                                    Data_Conclusao: dadosEtapa[15],
                                    Documento_Relacionado: dadosEtapa[16],
                                    SEI_Relacionado: dadosEtapa[17],
                                    Observacao: dadosEtapa[18],
                                    Macroetapa: dadosEtapa[19],
                                    Grupo: dadosEtapa[20],
                                    Etiqueta: dadosEtapa[21]
                                };
                    dadosEtapasObj.push(dadosNewEtapaObj);
                }
            }
            handleClientLoadPro();
        }
    });
}
function arquivarProjetoGantt(idProjeto) {
    loadingButtonConfirm(true);
    $('.GanttFormInsertProjeto .displayInfo').hide().find('p').html('');
    
    var d = new Date();
    var dateTimeSheet = d.toLocaleString();        
    var rowProjeto = jmespath.search(dadosProjetosObj, "[?ID_Projeto=='"+idProjeto+"'].ROW | [0]");
    var statusProjeto = ( jmespath.search(dadosProjetosObj, "[?ID_Projeto=='"+idProjeto+"'].Ativo | [0]") == 'TRUE' ) ? 'FALSE' : 'TRUE';
    var textStatus = ( statusProjeto == 'FALSE' ) ? 'arquivado' : 'reativado';
    var arrayDadosProjeto = [ [dateTimeSheet], [null], [null], [null], [null], [null], [statusProjeto] ];
    
    gapi.client.sheets.spreadsheets.values.update({
        spreadsheetId: spreadsheetIdProjetos_Pro,
        range: rangeProjetosPro+'!A'+rowProjeto,
        majorDimension: 'COLUMNS',
        valueInputOption: 'USER_ENTERED',
        values: arrayDadosProjeto
    }).then(function(response) {
        var result = response.result;
        if ( result.updatedColumns > 0 ) {
                loadingButtonConfirm(false);
                resetDialogBoxPro('dialogBoxPro');
                alertaBoxPro('Sucess', 'check-circle', 'Projeto '+textStatus+' com sucesso!');
                for (i = 0; i < dadosProjetosObj.length; i++) {
                    if (dadosProjetosObj[i].ROW === rowProjeto.toString() ) {
                        dadosProjetosObj[i].Ativo = arrayDadosProjeto[6][0];
                    }
                }
                setProjetosGantt('refresh');
        } else {
            loadingButtonConfirm(false);
            alertaBoxPro('Error', 'exclamation-triangle', 'Erro ao arquivar o projeto!');
        }
    }, function(err) {
        loadingButtonConfirm(false);
        console.error("Execute error", err); 
        alertaBoxPro('Error', 'exclamation-triangle', err.result.error.message );
    });
}
function editarProjetoGanttSend(idProjeto) {
    if ( checkFormRequiredPro('.GanttFormInsertProjeto') ) {
        loadingButtonConfirm(true);
        $('.GanttFormInsertProjeto .displayInfo').hide().find('p').html('');
        
        var d = new Date();
        var dateTimeSheet = d.toLocaleString();        
        var rowProjeto = jmespath.search(dadosProjetosObj, "[?ID_Projeto=='"+idProjeto+"'].ROW | [0]");
        var statusProjeto = jmespath.search(dadosProjetosObj, "[?ID_Projeto=='"+idProjeto+"'].Ativo | [0]");
        var nomeProjeto = $('.GanttFormInsertProjeto #dtBoxNomeProjeto').val();
        var tipoProjeto = $('.GanttFormInsertProjeto #dtBoxTipoProjeto option:selected').val();
        var contagemDias = $('.GanttFormInsertProjeto #dtBoxContagemDias option:selected').val();
        var arrayDadosProjeto = [ [dateTimeSheet], [null], [null], [nomeProjeto], [tipoProjeto], [contagemDias], [statusProjeto] ];
        
        gapi.client.sheets.spreadsheets.values.update({
            spreadsheetId: spreadsheetIdProjetos_Pro,
            range: rangeProjetosPro+'!A'+rowProjeto,
            majorDimension: 'COLUMNS',
            valueInputOption: 'USER_ENTERED',
            values: arrayDadosProjeto
        }).then(function(response) {
            var result = response.result;
            if ( result.updatedColumns > 0 ) {
                    loadingButtonConfirm(false);
                    resetDialogBoxPro('dialogBoxPro');
                    alertaBoxPro('Sucess', 'check-circle', 'Projeto editado com sucesso!');
                    for (i = 0; i < dadosProjetosObj.length; i++) {
                        if (dadosProjetosObj[i].ROW === rowProjeto.toString() ) {
                            dadosProjetosObj[i].Nome_Projeto = arrayDadosProjeto[3][0];
                            dadosProjetosObj[i].Tipo_Projeto = arrayDadosProjeto[4][0];
                            dadosProjetosObj[i].Contagem_Dias = arrayDadosProjeto[5][0];
                            dadosProjetosObj[i].Ativo = arrayDadosProjeto[6][0];
                        }
                    }
                    setProjetosGantt('refresh');
            } else {
                loadingButtonConfirm(false);
                alertaBoxPro('Error', 'exclamation-triangle', 'Erro ao editar o projeto!');
            }
        }, function(err) { 
            loadingButtonConfirm(false);
            console.error("Execute error", err); 
            alertaBoxPro('Error', 'exclamation-triangle', err.result.error.message );
        });
    } else {
        loadingButtonConfirm(false);
        $('.GanttFormInsertProjeto .displayInfo').show().find('p').html('<i class="iconPopup fas fa-exclamation-circle vermelhoColor"></i> Preencha os campos obrigat\u00F3rios (*)');
    }
}
function adicionarProjetoGanttSend() {
    if ( checkFormRequiredPro('.GanttFormInsertProjeto') ) {
        loadingButtonConfirm(true);
        $('.GanttFormInsertProjeto .displayInfo').hide().find('p').html('');
        
        var d = new Date();
        var dateTimeSheet = d.toLocaleString();        
        var idProjeto = randomString(8);
        var nomeProjeto = $('.GanttFormInsertProjeto #dtBoxNomeProjeto').val();
        var tipoProjeto = $('.GanttFormInsertProjeto #dtBoxTipoProjeto option:selected').val();
        var contagemDias = $('.GanttFormInsertProjeto #dtBoxContagemDias option:selected').val();
        var dadosProjeto = [dateTimeSheet, null, idProjeto, nomeProjeto, tipoProjeto, contagemDias, 'TRUE'];

        
        var range = rangeProjetosPro+"!A1";
        var values = [ dadosProjeto ];
        var data = [];
            data.push({ range: range, values: values });
        var body = { values: values };

        gapi.client.sheets.spreadsheets.values.append({
           spreadsheetId: spreadsheetIdProjetos_Pro,
           range: range,
           valueInputOption: "USER_ENTERED",
           resource: body
        }).then((response) => {
            var result = response.result;
            if ( result.updates.updatedRows > 0 ) {
                loadingButtonConfirm(false);
                resetDialogBoxPro('dialogBoxPro');
                alertaBoxPro('Sucess', 'check-circle', 'Projeto cadastrado com sucesso!');
                var dadosNewProjetoObj = {
                                        ROW: String(parseInt(dadosProjetosObj[dadosProjetosObj.length-1].ROW)+1),	
                                        ID_Projeto: String(dadosProjeto[2]),
                                        Nome_Projeto: dadosProjeto[3],
                                        Tipo_Projeto: dadosProjeto[4],
                                        Contagem_Dias: dadosProjeto[5],
                                        Ativo: 'TRUE'
                                    };
                dadosProjetosObj.push(dadosNewProjetoObj);
                adicionarEtapaGanttModelo(idProjeto);
            } else {
                loadingButtonConfirm(false);
                alertaBoxPro('Error', 'exclamation-triangle', 'Erro ao cadastrar o projeto!');
            }
        }, function(err) { 
            loadingButtonConfirm(false);
            console.error("Execute error", err); 
            alertaBoxPro('Error', 'exclamation-triangle', err.result.error.message );
        });
    } else {
        loadingButtonConfirm(false);
        $('.GanttFormInsertProjeto .displayInfo').show().find('p').html('<i class="iconPopup fas fa-exclamation-circle vermelhoColor"></i> Preencha os campos obrigat\u00F3rios (*)');
    }
}
function adicionarEtapaGanttModelo(idProjeto) {
        var d = new Date();
        var dateTimeSheet = d.toLocaleString();
        var idTask = randomString(8);
        var dataInicio = moment().format('DD/MM/YYYY');
        var contagemDias = jmespath.search(dadosProjetosObj, "[?ID_Projeto=='"+idProjeto+"'].Contagem_Dias | [0]");
        var arrayFeriados = feriadosNacionaisProArray[0].map((col, i) => feriadosNacionaisProArray.map(row => moment(row[i], "DD/MM/YYYY").format("YYYY-MM-DD") ))[0];
        var dataFim = ( contagemDias == 'Dias_Uteis' ) 
                            ? moment(dataInicio, 'DD/MM/YYYY').isoAddWeekdaysFromSet({  
                              'workdays': 10,  
                              'weekdays': [1,2,3,4,5],  
                              'exclusions': arrayFeriados
                            }).format('DD/MM/YYYY')
                            : moment().add(10, 'days').format('DD/MM/YYYY');   
        var dadosEtapa = [dateTimeSheet, null, idTask, idProjeto, '', '', '', 'Etapa Modelo', '', dataInicio, 10, dataFim, 0, '', '', '', '', '', '', '', '', '' ];
        
        var range = rangeEtapasPro+"!A1";
        var values = [ dadosEtapa ];
        var data = [];
            data.push({ range: range, values: values });
        var body = { values: values };

        gapi.client.sheets.spreadsheets.values.append({
           spreadsheetId: spreadsheetIdProjetos_Pro,
           range: range,
           valueInputOption: "USER_ENTERED",
           resource: body
        }).then((response) => {
            var result = response.result;
            if ( result.updates.updatedRows > 0 ) {
                var dadosNewEtapaObj = {
                                        ROW: String(parseInt(dadosEtapasObj[dadosEtapasObj.length-1].ROW)+1),	
                                        ID: dadosEtapa[2],
                                        ID_Projeto: String(dadosEtapa[3]),
                                        Dependencia: dadosEtapa[4],
                                        Processo_SEI: dadosEtapa[5],
                                        Protocolo_SEI: dadosEtapa[6],
                                        Nome_Etapa: dadosEtapa[7],
                                        Responsavel: dadosEtapa[8],
                                        Data_Inicio: dadosEtapa[9],
                                        Dias_Execucao: dadosEtapa[10],
                                        Data_Fim: dadosEtapa[11],
                                        Progresso_Execucao: dadosEtapa[12],
                                        Progresso_Automatico_Inicio: dadosEtapa[13],
                                        Progresso_Automatico_Fim: dadosEtapa[14],
                                        Data_Conclusao: dadosEtapa[15],
                                        Documento_Relacionado: dadosEtapa[16],
                                        SEI_Relacionado: dadosEtapa[17],
                                        Observacao: dadosEtapa[18],
                                        Macroetapa: dadosEtapa[19],
                                        Grupo: dadosEtapa[20],
                                        Etiqueta: dadosEtapa[21]
                                    };
                dadosEtapasObj.push(dadosNewEtapaObj);
                setProjetosGantt('refresh');
            }
        });
}
function adicionarEtapaGantt(id) {
    var arrayResponsavel = jmespath.search(ganttProjectSelect, "[?ID_Projeto=='"+id+"'].Responsavel | [0]");
    var arrayMacroetapa = jmespath.search(ganttProjectSelect, "[?ID_Projeto=='"+id+"'].Macroetapa | [0]");
    var arrayDependencias = jmespath.search(ganttProjectSelect, "[?ID_Projeto=='"+id+"'].Dependencias | [0]");
    var arrayGrupo = jmespath.search(ganttProjectSelect, "[?ID_Projeto=='"+id+"'].Grupo | [0]");
    var processoSEI = jmespath.search(ganttProjectSelect, "[?ID_Projeto=='"+id+"'].Processo_SEI | [0]");
    var protocoloSEI = jmespath.search(ganttProjectSelect, "[?ID_Projeto=='"+id+"'].Protocolo_SEI | [0]");
    var optionSelectResponsavel = ( arrayResponsavel.length > 0 ) ? $.map(arrayResponsavel, function(v,k){ return '<option>'+v+'</option>' }).join('') : '';
    var optionSelectMacroetapa = ( arrayMacroetapa.length > 0 ) ? $.map(arrayMacroetapa, function(v,k){ return '<option>'+v+'</option>' }).join('') : '';
    var optionSelectDependencias = ( arrayDependencias.length > 0 ) ? $.map(arrayDependencias, function(v,k){ var dependencieName = ( v != '' ) ? jmespath.search(dadosEtapasObj, "[?ID=='"+v+"'] | [0].Nome_Etapa") : ''; return '<option value="'+v+'">'+dependencieName+'</option>' }).join('') : '';
    var optionSelectGrupo = ( arrayGrupo.length > 0 ) ? $.map(arrayGrupo, function(v,k){ return '<option>'+v+'</option>' }).join('') : '';
    var textLabelContagemDias = ( jmespath.search(dadosProjetosObj, "[?ID_Projeto=='"+id+"'].Contagem_Dias | [0]") == 'Dias_Uteis' ) ? 'Dias \u00FAteis' : 'Dias';
    
    var textBox =  '<div class="details-container seiProForm GanttFormInsert">'+
                   '   <table class="tableInfo popup-wrapper">'+
                   '      <tr><td><p><input type="hidden" value="'+id+'" id="dtBoxIDProjeto"><i class="iconPopup fas fa-project-diagram cinzaColor"></i> Nome da Etapa *</td><td><input type="text" style="margin: 0 !important; padding: 0 5px !important; width: 90%" class="required infraText txtsheetsSelect" id="dtBoxNomeEtapa" value=""></span></p></td></tr>'+
                   '      <tr><td><p><input type="hidden" value="'+protocoloSEI+'" id="dtBoxProtocoloSEI"><i class="iconPopup fas fa-folder-open cinzaColor"></i> Processo *</td><td><input type="text" style="margin: 0 !important; padding: 0 5px !important; width: 90%" class="required infraText txtsheetsSelect" onchange="changeProcessoSEI(this, \'inline\')" id="dtBoxProcessoEtapa" value="'+processoSEI+'"></span></p></td></tr>'+
                   '      <tr><td><p><i class="iconPopup fas fa-clock cinzaColor"></i> In\u00EDcio da Etapa *</td><td><input type="date" style="margin: 0 !important; padding: 0 5px !important; width: 90%" class="required infraText txtsheetsSelect" id="dtBoxInicioEtapa" max="" onchange="changeDiasEtapaGantt(this)" value="'+moment().format('YYYY-MM-DD')+'"></span></p></td></tr>'+
                   '      <tr><td><p><i class="iconPopup far fa-clock cinzaColor"></i> Fim da Etapa *</td><td><input type="date" style="margin: 0 !important; padding: 0 5px !important; width: 90%" class="required infraText txtsheetsSelect" id="dtBoxFimEtapa" min="" onchange="changeDiasEtapaGantt(this)" value="'+moment().format('YYYY-MM-DD')+'"></p></td></tr>'+
                   '      <tr><td><p><i class="iconPopup fas fa-business-time cinzaColor"></i> '+textLabelContagemDias+' *</td><td><input type="number" style="margin: 0 !important; padding: 0 5px !important; width: 90%" class="required infraText txtsheetsSelect" id="dtBoxDiasAnalise" onchange="changeDiasEtapaGantt(this)" min="0" value="0"></p></td></tr>'+
                   '      <tr><td><p><i class="iconPopup fas fa-user-tie cinzaColor"></i> Respons\u00E1vel</td><td><select style="width: 95%; height: auto; margin: 0 !important; padding: 0 5px !important; max-width: 280px;" class="infraText txtsheetsSelect" id="dtBoxResponsavel" onchange="observeNewItem(this)"><option></option>'+optionSelectResponsavel+'<option value="0">:: NOVO ITEM ::</option></select></p></td></tr>'+
                   '      <tr><td><p><i class="iconPopup fas fa-layer-group cinzaColor"></i> Macroetapa</td><td><select style="width: 95%; height: auto; margin: 0 !important; padding: 0 5px !important; max-width: 280px;" class="infraText txtsheetsSelect" id="dtBoxMacroetapa" onchange="observeNewItem(this)"><option></option>'+optionSelectMacroetapa+'<option value="0">:: NOVO ITEM ::</option></select></p></td></tr>'+
                   '      <tr><td><p><i class="iconPopup fas fa-retweet cinzaColor"></i> Depend\u00EAncia</td><td><select style="width: 95%; height: auto; margin: 0 !important; padding: 0 5px !important; max-width: 280px;" class="infraText txtsheetsSelect" id="dtBoxDependencies">'+optionSelectDependencias+'</select></p></td></tr>'+
                   '      <tr><td><p><i class="iconPopup far fa-object-group cinzaColor"></i> Grupo</td><td><select style="width: 95%; height: auto; margin: 0 !important; padding: 0 5px !important; max-width: 280px;" class="infraText txtsheetsSelect" id="dtBoxGrupo" onchange="observeNewItem(this)"><option></option>'+optionSelectGrupo+'<option value="0">:: NOVO ITEM ::</option></select></p></td></tr>'+
                   '      <tr><td><p><i class="iconPopup fas fa-tags cinzaColor"></i> Etiqueta</td><td><input type="text" style="margin: 0 !important; padding: 0 5px !important; width: 90%" class="infraText txtsheetsSelect" id="dtBoxEtiqueta" value=""></span></p></td></tr>'+
                   '      <tr><td colspan="2" class="displayInfo" style="display:none;"><p style="color:#E46E64"></p></td></tr>'+
                   '   </table>'+
                   '</div>';
    resetDialogBoxPro('dialogBoxPro');
    dialogBoxPro = $('#dialogBoxPro')
        .html('<div class="dialogBoxDiv"> '+textBox+'</span>')
        .dialog({
            title: "Inserir nova etapa",
        	width: 480,
        	buttons: [{
                text: "Inserir",
                class: 'confirm',
                click: function() {
                    adicionarEtapaGanttSend();
                }
            }]
    });
    closeAllPopups();
}
function changeProcessoSEI(_this, mode) {
    var protocoloSEI = $(_this).val();
    var boxIdProtocolo = $(_this).closest('table').find('#dtBoxProtocoloSEI');
        $(_this).removeClass('error');
        getIDProtocoloSEI(protocoloSEI, 
            function(html){
                let $html = $(html);
                var params = getParamsUrlPro($html.find('#ifrArvore').attr('src'));
                boxIdProtocolo.val(params.id_procedimento);
                console.log(boxIdProtocolo.length, $(_this), params);
            }, 
            function(){
                $(_this).addClass('error');
                boxIdProtocolo.val('');
                if ( mode == 'inline' ) {
                    $('.GanttFormInsert .displayInfo').show().find('p').html('<i class="iconPopup fas fa-exclamation-circle vermelhoColor"></i> Processo n\u00E3o encontrado!');
                } else {
                    alertaBoxPro('Error', 'exclamation-triangle', 'Processo n\u00E3o encontrado!');
                }
            });
}
function adicionarEtapaGanttSend() {
    if ( checkFormRequiredPro('.GanttFormInsert') ) {
        loadingButtonConfirm(true);
        $('.GanttFormInsert .displayInfo').hide().find('p').html('');
        
        var d = new Date();
        var dateTimeSheet = d.toLocaleString();        
        var objIDProjeto = $('.GanttFormInsert #dtBoxIDProjeto');
        var idTask = randomString(8);
        var nomeProjeto = jmespath.search(ganttProjectSelect, "[?ID_Projeto=='"+objIDProjeto.val()+"'].Nome_Projeto | [0]")
        var arrayDadosEtapa = extractFieldsEtapaGantt(objIDProjeto);
        arrayDadosEtapa.unshift([objIDProjeto.val()]);
        arrayDadosEtapa.unshift([idTask]);
        arrayDadosEtapa.unshift([null]);
        arrayDadosEtapa.unshift([dateTimeSheet]);
        arrayDadosEtapa[12] = [0];
        var dadosEtapa = [];
        $.each(arrayDadosEtapa, function(index,value){
            dadosEtapa.push(value[0]);
        });
        
        var range = rangeEtapasPro+"!A1";
        var values = [ dadosEtapa ];
        var data = [];
        data.push({ range: range, values: values });
        var body = { values: values };
        
        gapi.client.sheets.spreadsheets.values.append({
            spreadsheetId: spreadsheetIdProjetos_Pro,
            range: range,
            valueInputOption: "USER_ENTERED",
            resource: body
        }).then((response) => {
            var result = response.result;
            if ( result.updates.updatedRows > 0 ) {
                loadingButtonConfirm(false);
                resetDialogBoxPro('dialogBoxPro');
                alertaBoxPro('Sucess', 'check-circle', 'Etapa cadastrada com sucesso!');
                var dadosNewEtapaObj = {
                                        ROW: (parseInt(dadosEtapasObj[dadosEtapasObj.length-1].ROW)+1).toString(),	
                                        ID: dadosEtapa[2].toString(),
                                        ID_Projeto: dadosEtapa[3],
                                        Dependencia: (dadosEtapa[4] || ''),
                                        Processo_SEI: (dadosEtapa[5] || ''),
                                        Protocolo_SEI: (dadosEtapa[6] || ''),
                                        Nome_Etapa: (dadosEtapa[7] || ''),
                                        Responsavel: (dadosEtapa[8] || ''),
                                        Data_Inicio: (dadosEtapa[9] || ''),
                                        Dias_Execucao: (dadosEtapa[10] || ''),
                                        Data_Fim: (dadosEtapa[11] || ''),
                                        Progresso_Execucao: (dadosEtapa[12] || ''),
                                        Progresso_Automatico_Inicio: (dadosEtapa[13] || ''),
                                        Progresso_Automatico_Fim: (dadosEtapa[14] || ''),
                                        Data_Conclusao: (dadosEtapa[15] || ''),
                                        Documento_Relacionado: (dadosEtapa[16] || ''),
                                        SEI_Relacionado: (dadosEtapa[17] || ''),
                                        Observacao: (dadosEtapa[18] || ''),
                                        Macroetapa: (dadosEtapa[19] || ''),
                                        Grupo: (dadosEtapa[20] || ''),
                                        Etiqueta: (dadosEtapa[21] || '')
                                    };
                dadosEtapasObj.push(dadosNewEtapaObj);
                setProjetosGantt('refresh');
            } else {
                loadingButtonConfirm(false);
                alertaBoxPro('Error', 'exclamation-triangle', 'Erro ao cadastrar a etapa!');
            }
        }, function(err) { 
            loadingButtonConfirm(false);
            console.error("Execute error", err); 
            alertaBoxPro('Error', 'exclamation-triangle', err.result.error.message );
        });
    } else {
        loadingButtonConfirm(false);
        $('.GanttFormInsert .displayInfo').show().find('p').html('<i class="iconPopup fas fa-exclamation-circle vermelhoColor"></i> Preencha os campos obrigat\u00F3rios (*)');
    }
}
function getSelectConfigGantt() {
    var configBaseSelected = ( getOptionsPro('configBaseSelectedPro') ) ? getOptionsPro('configBaseSelectedPro') : '';
    var configBasePro = ( localStorageRestorePro('configBasePro') != null ) ? localStorageRestorePro('configBasePro') : '';
        configBasePro = ( configBasePro != '' && jmespath.search(configBasePro, "[?baseTipo=='projetos'] | length(@)") > 0 ) ? jmespath.search(configBasePro, "[?baseTipo=='projetos']") : configBasePro;
    var configBaseName = ( configBasePro != '' ) ? jmespath.search(configBasePro, "[*].baseName") : [];
    var configBaseLinkSelected = ( configBaseSelected == '' ) ? jmespath.search(configBasePro, "[0].spreadsheetId") : jmespath.search(configBasePro, "[?baseName=='"+configBaseSelected+"'].spreadsheetId | [0]");
    var configBaseLink = ( configBasePro != '' ) ? configBaseLinkSelected : '';
    var htmlLinkBasedados = ( configBaseLink != '') ? '<a id="linkBaseDados" href="https://docs.google.com/spreadsheets/d/'+configBaseLink+'" target="_blank" onmouseover="return infraTooltipMostrar(\'Abrir Base de Dados (Google Spreadsheets)\');" onmouseout="return infraTooltipOcultar();"><i class="iconPopup fas fa-database cinzaColor" style="float: right;"></i></a>' : '';
    var optionSelectConfigBasePro = ( configBaseName.length > 0 ) ? $.map(configBaseName, function(v,k){ return ( configBaseSelected == v ) ? '<option selected>'+v+'</option>' : '<option>'+v+'</option>' }).join('') : '';
    var htmlSelectConfigBase = '<select style="width: 75%; height: auto; margin: 0 !important; padding: 0 5px !important;" class="required infraText txtsheetsSelect" id="selectBaseDados" onchange="changeBaseDados()">'+optionSelectConfigBasePro+'</select>';
    return htmlSelectConfigBase+htmlLinkBasedados;
}
function openConfigGantt() {
    var stateVisualGantt = ( (typeof ganttProject[0] !== 'undefined' && ganttProject[0].options.edit_task == true) || ( getOptionsPro('stateVisualGantt') == true ) ) ? 'checked' : '';
    var stateArquivadosGantt = ( getOptionsPro('stateArquivadosGantt') == true ) ? 'checked' : '';
    var statePanelSortPro = ( getOptionsPro('panelSortPro') ) ? 'checked' : '';
    var htmlSelectConfigBase = getSelectConfigGantt();
    var textBox =   '<table style="font-size: 10pt;width: 100%;">'+
                    '   <tr style="height: 40px;">'+
                    '       <td><i class="iconPopup fas fa-hand-paper cinzaColor"></i> Ativar modo de edi\u00E7\u00E3o visual (arrastar e soltar)</td>'+
                    '       <td>'+
                    '           <div class="onoffswitch">'+
                    '               <input type="checkbox" onchange="changeVisualGantt()" name="onoffswitch" class="onoffswitch-checkbox" id="editVisualGantt" tabindex="0" '+stateVisualGantt+'>'+
                    '               <label class="onoffswitch-label" for="editVisualGantt"></label>'+
                    '           </div>'+
                    '       </td>'+
                    '   </tr>'+
                    '   <tr style="height: 40px;">'+
                    '       <td><i class="iconPopup fas fa-archive cinzaColor"></i> Visualizar projetos arquivados</td>'+
                    '       <td>'+
                    '           <div class="onoffswitch">'+
                    '               <input type="checkbox" onchange="viewProjetosArquivados()" name="onoffswitch" class="onoffswitch-checkbox" id="viewProjetosArquivados" tabindex="0" '+stateArquivadosGantt+'>'+
                    '               <label class="onoffswitch-label" for="viewProjetosArquivados"></label>'+
                    '           </div>'+
                    '       </td>'+
                    '   </tr>'+
                    '   <tr style="height: 40px;">'+
                    '       <td><i class="iconPopup far fa-hand-rock cinzaColor"></i> Ordenar pain\u00E9is de gest\u00E3o arrastando e soltando</td>'+
                    '       <td>'+
                    '           <div class="onoffswitch">'+
                    '               <input type="checkbox" onchange="changePanelSortPro(this)" name="onoffswitch" class="onoffswitch-checkbox" id="panelSortPro" tabindex="0" '+statePanelSortPro+'>'+
                    '               <label class="onoffswitch-label" for="panelSortPro"></label>'+
                    '           </div>'+
                    '       </td>'+
                    '   </tr>'+
                    '</table>'+
                    '<table style="font-size: 10pt;width: 100%;" class="seiProForm">'+
                    '   <tr style="height: 40px;">'+
                    '       <td><i class="iconPopup fas fa-sync-alt cinzaColor"></i> Alternar base de dados</td>'+
                    '       <td>'+
                                htmlSelectConfigBase+
                    '       </td>'+
                    '   </tr>'+
                    '</table>';
    resetDialogBoxPro('dialogBoxPro');
    dialogBoxPro = $('#dialogBoxPro')
        .html('<div class="dialogBoxDiv"> '+textBox+'</span>')
        .dialog({
        	width: 450,
            title: 'Configura\u00E7\u00F5es',
        	buttons: [{
                text: "Ok",
                class: 'confirm',
                click: function() {
                    $(this).dialog('close');
                }
            }]
    });
}
function changeBaseDados() {
    var dataValues = localStorageRestorePro('configBasePro');
    var selectedPerfil =  $('#selectBaseDados option:selected').val();
    var dataPerfil = [];
    for (var i = 0; i < dataValues.length; i++) {
        if ( dataValues[i].baseName == selectedPerfil ) { dataPerfil = dataValues[i]; }
    }

    var CLIENT_ID_PRO_Old = CLIENT_ID_PRO;
    var CLIENT_ID_PRO_New = dataPerfil.CLIENT_ID;
    var API_KEY_PRO_New = dataPerfil.API_KEY;
    var spreadsheetIdProjetos_Pro_New = dataPerfil.spreadsheetId;

    $('#linkBaseDados').attr('href', 'https://docs.google.com/spreadsheets/d/'+spreadsheetIdProjetos_Pro);
    $('script[data-config="base-projetos-seipro"]').remove();
    var scriptText =    "<script data-config='base-projetos-seipro'>\n"+
                        "   var CLIENT_ID_PRO = '"+CLIENT_ID_PRO_New+"';\n"+
                        "   var API_KEY_PRO = '"+API_KEY_PRO_New+"';\n"+
                        "   var spreadsheetIdProjetos_Pro = '"+spreadsheetIdProjetos_Pro_New+"';\n"+
                        "</script>";
    $(scriptText).appendTo('head');
    handleClientLoadPro();
    setOptionsPro('configBaseSelectedPro', selectedPerfil);
    if ( CLIENT_ID_PRO_Old != CLIENT_ID_PRO_New ) { setTimeout(function () { location.reload(true) },1000) }
}
function viewProjetosArquivados() {
    var stateArquivadosGantt = $('#viewProjetosArquivados').is(':checked');
    setOptionsPro('stateArquivadosGantt', stateArquivadosGantt);
    setProjetosGantt('refresh');
}
function observeNewItem(_this) {
    if ( $(_this).val() == 0 ) {
    var textBox =   'Digite o nome do novo item:'+
                    '<br><br><span class="seiProForm" style="text-align: center; display: block; font-size: 9pt;">'+
                    '   <input type="text" style="width: 90% !important;" class="required infraText txtsheetsSelect" value="" name="nomeNovoItem" id="nomeNovoItem">'+
                    '</span>';
        resetDialogBoxPro('alertBoxPro');
        alertBoxPro = $('#alertaBoxPro')
            .html('<div class="dialogBoxDiv"> '+textBox+'</span>')
            .dialog({
                width: 400,
                title: 'Adicionar novo item',
                buttons: [{
                    text: "Ok",
                    class: 'confirm',
                    click: function() {
                        saveNewItem(_this);
                    }
                }]
        });
        $('#nomeNovoItem').focus();
    }
}
function saveNewItem(_this) {
    var value = $('#nomeNovoItem').val();
    if ( value != '' ) {
        resetDialogBoxPro('alertBoxPro');
        $(_this).prepend('<option selected>'+value+'</option>').val(value).change();
    }
}
function changeVisualGantt() {
    var stateVisualGantt = $('#editVisualGantt').is(':checked');
    $.each(ganttProject, function (index, value) {
        ganttProject[index].options.edit_task = stateVisualGantt;
        ganttProject[index].hide_popup();
        ganttProject[index].refresh(ganttProject[index].tasks);
    });
    setOptionsPro('stateVisualGantt', stateVisualGantt);
}
function updateDatesProjetosGantt(task, start, end) {
    var contagemDias = jmespath.search(dadosProjetosObj, "[?ID_Projeto=='"+task.idProjeto+"'].Contagem_Dias | [0]");
    var ID_Projeto = '';
    var rowTask = task.rowTask;
    var idBar = task.id;
    var dtStart = moment(start).format('DD/MM/YYYY');
    var dtEnd = moment(end).format('DD/MM/YYYY');
    var arrayFeriados = feriadosNacionaisProArray[0].map((col, i) => feriadosNacionaisProArray.map(row => moment(row[i], "DD/MM/YYYY").format("YYYY-MM-DD") ))[0];
    var nrDias = ( contagemDias == 'Dias_Uteis' )
                    ? moment().isoWeekdayCalc({  
                      rangeStart: moment(dtStart,'DD/MM/YYYY'),  
                      rangeEnd: moment(dtEnd,'DD/MM/YYYY'),  
                      weekdays: [1,2,3,4,5],  
                      exclusions: arrayFeriados
                    }) 
                    : moment(dtEnd,'DD/MM/YYYY').diff(moment(dtStart,'DD/MM/YYYY'), 'days');
    var arrayDadosEtapa = [ [dtStart], [(nrDias)-1], [dtEnd] ];
    
    if( rowTask != '' ) {
        gapi.client.sheets.spreadsheets.values.update({
            spreadsheetId: spreadsheetIdProjetos_Pro,
            range: rangeEtapasPro+'!J'+rowTask,
            majorDimension: 'COLUMNS',
            valueInputOption: 'USER_ENTERED',
            values: arrayDadosEtapa
        }).then(function(response) {
              var result = response.result;
              if ( result.updatedColumns > 0 ) {
                for (i = 0; i < dadosEtapasObj.length; i++) {
                    if (dadosEtapasObj[i].ROW === rowTask.toString() ) {
                        dadosEtapasObj[i].Data_Inicio = arrayDadosEtapa[0][0];
                        dadosEtapasObj[i].Dias_Execucao = arrayDadosEtapa[1][0];
                        dadosEtapasObj[i].Data_Fim = arrayDadosEtapa[2][0];
                        ID_Projeto = dadosEtapasObj[i].ID_Projeto;
                    }
                }
                for (i = 0; i < dadosProjetosUniq.length; i++) {
                    if (dadosProjetosUniq[i] === ID_Projeto ) {
                        id = i;
                    }
                }
                for (i = 0; i < ganttProject[id].tasks.length; i++) {
                    if (ganttProject[id].tasks[i].id === idBar ) {
                        ganttProject[id].tasks[i].start = moment(arrayDadosEtapa[0][0],'DD/MM/YYYY').format('YYYY-MM-DD');
                        ganttProject[id].tasks[i].end = moment(arrayDadosEtapa[2][0],'DD/MM/YYYY').format('YYYY-MM-DD');
                    }
                }
              }
        }, function(err) { 
            console.error("Execute error", err); 
            $('#alertaBoxProError').html(err);
        });
    }
}
function changeDiasEtapaGantt(_this) {
    var idInput = $(_this).attr('id');
	var idProjeto = $(_this).closest('table').find('#dtBoxIDProjeto').val();
    var contagemDias = jmespath.search(dadosProjetosObj, "[?ID_Projeto=='"+idProjeto+"'].Contagem_Dias | [0]");
	var dtStart = $(_this).closest('table').find('#dtBoxInicioEtapa').val();
    var arrayFeriados = feriadosNacionaisProArray[0].map((col, i) => feriadosNacionaisProArray.map(row => moment(row[i], "DD/MM/YYYY").format("YYYY-MM-DD") ))[0];
    var dtEnd_Contagem = ( contagemDias == 'Dias_Uteis' ) 
                                                ? moment(dtStart).isoAddWeekdaysFromSet({  
                                                  'workdays': parseInt($(_this).closest('table').find('#dtBoxDiasAnalise').val()),  
                                                  'weekdays': [1,2,3,4,5],  
                                                  'exclusions': arrayFeriados
                                                }).format('YYYY-MM-DD')
                                                : moment(dtStart, 'YYYY-MM-DD').add(parseInt($(_this).closest('table').find('#dtBoxDiasAnalise').val()), 'days').format('YYYY-MM-DD');
    var dtEnd = ( idInput == 'dtBoxFimEtapa' )  ? $(_this).closest('table').find('#dtBoxFimEtapa').val() 
                                                : dtEnd_Contagem;
    var nrDias_Contagem = ( contagemDias == 'Dias_Uteis' ) 
                                                ? moment().isoWeekdayCalc({  
                                                  rangeStart: dtStart,  
                                                  rangeEnd: dtEnd,  
                                                  weekdays: [1,2,3,4,5],  
                                                  exclusions: arrayFeriados
                                                })
                                                : moment(dtEnd, 'YYYY-MM-DD').diff(moment(dtStart, 'YYYY-MM-DD'), 'days');
	var nrDias = ( idInput == 'dtBoxFimEtapa' ) ? nrDias_Contagem
                                                : $(_this).closest('table').find('#dtBoxDiasAnalise').val();
    if ( idInput == 'dtBoxFimEtapa' ) { $(_this).closest('table').find('#dtBoxDiasAnalise').val(nrDias) }
    $(_this).closest('table').find('#dtBoxFimEtapa').val(dtEnd).attr('min', dtStart);
    $(_this).closest('table').find('#dtBoxInicioEtapa').attr('max', dtEnd);
}
function editarEtapaGantt(_this, rowTask) {
    $(_this).closest('table').find('.boxInfo').hide();
    $(_this).closest('table').find('.boxInput').show();
    $(_this).closest('table').find('.detalheBox').show();
    $(_this).find('i').addClass('fa-flip-vertical');
    
    if ( $('#dtBoxDocRelacionado').length > 0 ) { 
        var dataProj = jmespath.search(dadosEtapasObj, "[?ROW=='"+rowTask+"'] | [0]");	
        getDadosIframeProcessoPro(dataProj.Protocolo_SEI, 'gantt');
    }
}
function excluirEtapaGantt(_this, rowTask) {
    var textBox = 'Deseja realmente excluir essa etapa?';
    resetDialogBoxPro('alertBoxPro');
    alertBoxPro = $('#alertaBoxPro')
        .html('<span class="alertaAttencionPro dialogBoxDiv"><i class="fas fa-exclamation-circle"></i> '+textBox+'</span>')
        .dialog({
            width: 350,
            title: 'Excluir etapa',
            position: { my: "center", at: "center", of: window },
            buttons: [{
                text: "Cancelar",
                click: function() {
                    resetDialogBoxPro('alertBoxPro');
                }
            },{
                text: "Excluir Etapa",
                icon: "ui-icon-trash",
                class: 'confirm',
                click: function() {
                    resetDialogBoxPro('alertBoxPro');
                    excluirEtapaGanttConfirm(_this, rowTask); 
                }
            }]
    });
}
function excluirEtapaGanttConfirm(_this, rowTask) {
    var d = new Date();
    var dateTimeSheet = d.toLocaleString();
    var arrayDadosEtapa = [ [dateTimeSheet], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''] ];
    if( rowTask != '' ) {
        gapi.client.sheets.spreadsheets.values.update({
            spreadsheetId: spreadsheetIdProjetos_Pro,
            range: rangeEtapasPro+'!A'+rowTask,
            majorDimension: 'COLUMNS',
            valueInputOption: 'USER_ENTERED',
            values: arrayDadosEtapa
        }).then(function(response) {
              var result = response.result;
              if ( result.updatedColumns > 0 ) {
                alertaBoxPro('Sucess', 'check-circle', 'Etapa exclu\u00EDda com sucesso!');
                // refreshDeleteEtapaGantt(rowTask, arrayDadosEtapa);
                atualizaGantt();
              }
        }, function(err) { 
            console.error("Execute error", err); 
            $('#alertaBoxProError').html(err);
        });
    }
}
function salvarEtapaGantt(_this, rowTask) {
    $(_this).closest('table').find('.boxInfo').show();
    $(_this).closest('table').find('.boxInput').hide();
    
    $(_this).closest('table').find('.boxInput input, .boxInput select').each(function(){
        var txtInput = ( $(this).prev().is('select') ) ? $('option:selected', this).val() : $(this).val();
            txtInput = ( $(this).attr('type') == 'date' ) ? moment($(this).val(), 'YYYY-MM-DD').format('DD/MM/YYYY') : txtInput;
        $(this).closest('td').find('.boxInfo').text(txtInput);
    });
    
    var arrayDadosEtapa = extractFieldsEtapaGantt(_this);
    sendEtapaGantt(_this, rowTask, arrayDadosEtapa, 'editada');
}
function extractFieldsEtapaGantt(_this) {
    var dependeciaEtapa = $(_this).closest('table').find('#dtBoxDependencies option:selected').val();
	var dtStart = $(_this).closest('table').find('#dtBoxInicioEtapa').val();
	var dtEnd = $(_this).closest('table').find('#dtBoxFimEtapa').val();
    var nrDias = $(_this).closest('table').find('#dtBoxDiasAnalise').val();
    var respEtapa = $(_this).closest('table').find('#dtBoxResponsavel option:selected').val();
        respEtapa = ( respEtapa != "0" ) ? respEtapa : null;
    var macroEtapa = $(_this).closest('table').find('#dtBoxMacroetapa option:selected').val();
        macroEtapa = ( macroEtapa != "0" ) ? macroEtapa : null;
    var nomeEtapa = $(_this).closest('table').find('#dtBoxNomeEtapa').val();    
    var selectDocRel = $('#dtBoxDocRelacionado option:selected');
	var tipoDocString = ( selectDocRel.length > 0 ) ? selectDocRel.attr('data_documento') : null;
	var nrSEI = ( selectDocRel.length > 0 ) ? selectDocRel.attr('data_nr_sei') : null;
    var obsEtapa = ( $('#dtBoxObservacao').length > 0 ) ? $('#dtBoxObservacao').val() : null;
    var dataConclusao = ( $('#dtBoxConclusaoEtapa').length > 0 ) ? $('#dtBoxConclusaoEtapa').val() : null;
		dataConclusao = ( dataConclusao != null ) ? moment(dataConclusao, "YYYY-MM-DD").format("DD/MM/YYYY") : null;
    var protocoloSEI = ( $('#dtBoxProtocoloSEI').length > 0 ) ? $('#dtBoxProtocoloSEI').val() : null;
    var processoSEI = ( $('#dtBoxProcessoEtapa').length > 0 ) ? $('#dtBoxProcessoEtapa').val() : null;
    var grupo = $(_this).closest('table').find('#dtBoxGrupo option:selected').val();
        grupo = ( grupo != "0" ) ? grupo : null;
    var etiqueta = ( $('#dtBoxEtiqueta').length > 0 ) ? $('#dtBoxEtiqueta').val() : null;

    
    var arrayDadosEtapa = [ 
            [dependeciaEtapa], [processoSEI], [protocoloSEI],
            [nomeEtapa], 
            [respEtapa], 
            [moment(dtStart, 'YYYY-MM-DD').format('DD/MM/YYYY')], 
            [nrDias], 
            [moment(dtEnd, 'YYYY-MM-DD').format('DD/MM/YYYY')], 
            [null], [null], [null], 
            [dataConclusao], [tipoDocString], [nrSEI], [obsEtapa], 
            [macroEtapa], [grupo], [etiqueta]
        ];
    return arrayDadosEtapa;
}
function sendEtapaGantt(_this, rowTask, arrayDadosEtapa, modeTxt) {
    if( rowTask != '' ) {
        gapi.client.sheets.spreadsheets.values.update({
            spreadsheetId: spreadsheetIdProjetos_Pro,
            range: rangeEtapasPro+'!E'+rowTask,
            majorDimension: 'COLUMNS',
            valueInputOption: 'USER_ENTERED',
            values: arrayDadosEtapa
        }).then(function(response) {
              var result = response.result;
              if ( result.updatedColumns > 0 ) {
                alertaBoxPro('Sucess', 'check-circle', 'Etapa '+modeTxt+' com sucesso!');
                // refreshEtapaGantt(rowTask, arrayDadosEtapa);
                atualizaGantt();
              }
        }, function(err) { 
            console.error("Execute error", err); 
            $('#alertaBoxProError').html(err);
        });
    }
}
function refreshDeleteEtapaGantt(rowTask, arrayDadosEtapa) {
	var ID_Projeto = '';
	var id = '';
	for (i = 0; i < dadosEtapasObj.length; i++) {
		if (dadosEtapasObj[i].ROW === rowTask.toString() ) {
			ID_Projeto = dadosEtapasObj[i].ID_Projeto;
            dadosEtapasObj.splice(i,1);
		}
	}
	for (i = 0; i < dadosProjetosUniq.length; i++) {
		if (dadosProjetosUniq[i] === ID_Projeto ) {
			id = i;
		}
	}
	for (i = 0; i < ganttProject[id].tasks.length; i++) {
		if (ganttProject[id].tasks[i].rowTask === rowTask ) {
            ganttProject[id].tasks.splice(i,1);
		}
	}
	ganttProject[id].hide_popup();
	ganttProject[id].refresh(ganttProject[id].tasks);
}
function closeAllPopups() {
    for (i = 0; i < ganttProject.length; i++) {
    	ganttProject[i].hide_popup();
    }
}
function refreshEtapaGantt(rowTask, arrayDadosEtapa) {
	var ID_Projeto = '';
	var id = ''; 
	for (i = 0; i < dadosEtapasObj.length; i++) {
		if (dadosEtapasObj[i].ROW === rowTask.toString() ) {
			dadosEtapasObj[i].Dependencia = ( arrayDadosEtapa[0][0] || '' );
			dadosEtapasObj[i].Nome_Etapa = ( arrayDadosEtapa[3][0] || '' );
			dadosEtapasObj[i].Responsavel = ( arrayDadosEtapa[4][0] || '' );
			dadosEtapasObj[i].Data_Inicio = arrayDadosEtapa[5][0];
			dadosEtapasObj[i].Dias_Execucao = ( arrayDadosEtapa[6][0] || '' );
			dadosEtapasObj[i].Data_Fim = ( arrayDadosEtapa[7][0] || '' );
			dadosEtapasObj[i].Data_Conclusao = ( arrayDadosEtapa[11][0] || '' );
			dadosEtapasObj[i].Documento_Relacionado = ( arrayDadosEtapa[12][0] || '' );
			dadosEtapasObj[i].SEI_Relacionado = ( arrayDadosEtapa[13][0] || '' );
			dadosEtapasObj[i].Observacao = ( arrayDadosEtapa[14][0] || '' );
			dadosEtapasObj[i].Macroetapa = ( arrayDadosEtapa[15][0] || '' );
			ID_Projeto = dadosEtapasObj[i].ID_Projeto; 
		}
	}
    console.log('Data_Conclusao', arrayDadosEtapa[11][0]);
	for (i = 0; i < dadosProjetosUniq.length; i++) {
		if (dadosProjetosUniq[i] === ID_Projeto ) {
			id = i;
		}
	}
	for (i = 0; i < ganttProject[id].tasks.length; i++) {
		if (ganttProject[id].tasks[i].rowTask === rowTask ) {
			ganttProject[id].tasks[i].dependencies = [arrayDadosEtapa[0][0]];
			ganttProject[id].tasks[i].name = arrayDadosEtapa[3][0];
			ganttProject[id].tasks[i].start = moment(arrayDadosEtapa[5][0],'DD/MM/YYYY').format('YYYY-MM-DD');
			ganttProject[id].tasks[i].end = moment(arrayDadosEtapa[7][0],'DD/MM/YYYY').format('YYYY-MM-DD');
		}
	}
	ganttProject[id].hide_popup();
	ganttProject[id].refresh(ganttProject[id].tasks);
}
function ganttAutoProgress(rowTask, mode) {
    var dataProj = jmespath.search(dadosEtapasObj, "[?ROW=='"+rowTask+"'] | [0]");
    var valueDataInicioExecucao = ( typeof dataProj.Progresso_Automatico_Inicio !== 'undefined' && dataProj.Progresso_Automatico_Inicio != '' ) ? moment(dataProj.Progresso_Automatico_Inicio,'DD/MM/YYYY').format('YYYY-MM-DD') : '';
    var valueDataFimExecucao = ( typeof dataProj.Progresso_Automatico_Fim !== 'undefined' && dataProj.Progresso_Automatico_Fim != '' ) ? moment(dataProj.Progresso_Automatico_Fim,'DD/MM/YYYY').format('YYYY-MM-DD') : '';
    var textBox =   'Selecione a data de in\u00EDcio e fim da execu\u00E7\u00E3o autom\u00E1tica da etapa.'+
                    '<br><br><span class="seiProForm" style="text-align: center; display: block; font-size: 9pt;">'+
                    '   <input type="date" style="width: 120px !important;" class="required infraText txtsheetsSelect" value="'+valueDataInicioExecucao+'" name="dataInicioExecucao" id="dataInicioExecucao">'+
                    '   <span style="padding:0 5px">\u00E0</span>'+
                    '   <input type="date" style="width: 120px !important;" class="required infraText txtsheetsSelect" value="'+valueDataFimExecucao+'" name="dataFimExecucao" id="dataFimExecucao">'+
                    '   <span style="display: block; padding:5px; color:red" id="alertaBoxProError"></span>'+
                    '</span>';
    var btnActions = ( mode == 'edit' ) ? 
                [{
                text: "Excluir",
                icon: "ui-icon-trash", 
                click: function() {
                    ganttAutoProgressSheet(rowTask, 'delete')
                }},{
                text: "Salvar",
                icon: "ui-icon-disk",
                class: 'confirm',
                click: function() {
                    ganttAutoProgressCheck(rowTask);
                }}]
                    :
                [{
                text: "Salvar",
                class: 'confirm',
                click: function() {
                    ganttAutoProgressCheck(rowTask);
                }}];
                  
    resetDialogBoxPro('dialogBoxPro');
    dialogBoxPro = $('#dialogBoxPro')
        .html('<span class="alertaAttencionPro dialogBoxDiv"><i class="fas fa-exclamation-circle"></i> '+textBox+'</span>')
        .dialog({
        	width: 400,
            title: 'Execu\u00E7\u00E3o autom\u00E1tica de etapa',
        	buttons: btnActions
    });
}
function ganttAutoProgressCheck(rowTask) {
    var dataInicioExecucao = $('#dataInicioExecucao').val();
    var dataFimExecucao = $('#dataFimExecucao').val();
    $('#alertaBoxProError').html('');
    if ( dataInicioExecucao != '' && dataFimExecucao != '' && moment(dataInicioExecucao, "YYYY-MM-DD") <= moment(dataFimExecucao, "YYYY-MM-DD")) {
        $('#alertaBoxProError').html('');
        ganttAutoProgressSheet(rowTask, 'insert');
    } else {
        $('#alertaBoxProError').html('Selecione uma data v\u00E1lida');
    }
}
function ganttAutoProgressSheet(rowTask, mode) {
    var dataInicioExecucao = $('#dataInicioExecucao').val();
    var dataFimExecucao = $('#dataFimExecucao').val();
    var dataProj = jmespath.search(dadosEtapasObj, "[?ROW=='"+rowTask+"'] | [0]");
    if ( mode == 'insert' ) {
        var txtAlertBox = 'cadastrada';
        var percentProgress = ganttAutoProgressPercent(moment(dataInicioExecucao,'YYYY-MM-DD'), moment(dataFimExecucao,'YYYY-MM-DD'));
        var arrayDadosEtapa = [ [percentProgress], [moment(dataInicioExecucao,'YYYY-MM-DD').format('DD/MM/YYYY')], [moment(dataFimExecucao,'YYYY-MM-DD').format('DD/MM/YYYY')] ];
    } else if ( mode == 'delete' ) {
        var txtAlertBox = 'exclu\u00EDda';
        var arrayDadosEtapa = [ [null], [''], [''] ];
    }

    //$('#dialogBoxPro').dialog('close');
    
    if( rowTask != '' ) {
        gapi.client.sheets.spreadsheets.values.update({
            spreadsheetId: spreadsheetIdProjetos_Pro,
            range: rangeEtapasPro+'!M'+rowTask,
            majorDimension: 'COLUMNS',
            valueInputOption: 'USER_ENTERED',
            values: arrayDadosEtapa
        }).then(function(response) {
            var result = response.result;
            if ( result.updatedColumns > 0 ) {
                resetDialogBoxPro('dialogBoxPro');
                alertaBoxPro('Sucess', 'check-circle', 'Execu\u00E7\u00E3o autom\u00E1tica '+txtAlertBox+' com sucesso!');
                // ganttAutoProgressRefresh(rowTask, arrayDadosEtapa);
                atualizaGantt();
              }
        }, function(err) { 
            console.error("Execute error", err); 
            $('#alertaBoxProError').html(err);
        });
    }
}
function ganttAutoProgressRefresh(rowTask, arrayDadosEtapa) {
	var ID_Projeto = '';
	var id = '';
	for (i = 0; i < dadosEtapasObj.length; i++) {
		if (dadosEtapasObj[i].ROW === rowTask.toString() ) {
			dadosEtapasObj[i].Progresso_Execucao = ( 'null' != arrayDadosEtapa[0][0] ) ? arrayDadosEtapa[0][0] : dadosEtapasObj[i].Progresso_Execucao;
			dadosEtapasObj[i].Progresso_Automatico_Inicio = arrayDadosEtapa[1][0];
			dadosEtapasObj[i].Progresso_Automatico_Fim = arrayDadosEtapa[2][0];
			ID_Projeto = dadosEtapasObj[i].ID_Projeto;
		}
	}
	for (i = 0; i < dadosProjetosUniq.length; i++) {
		if (dadosProjetosUniq[i] === ID_Projeto ) {
			id = i;
		}
	}
	for (i = 0; i < ganttProject[id].tasks.length; i++) {
		if (ganttProject[id].tasks[i].rowTask === rowTask ) {
			ganttProject[id].tasks[i].progress = arrayDadosEtapa[0][0];
		}
	}
	ganttProject[id].hide_popup();
	ganttProject[id].refresh(ganttProject[id].tasks);
}
function ganttPercentRange(this_, mode, rowTask) {
	var value = $(this_).val();
	$(this_).closest('tr').find('.gantt-percent').text(value);
	if ( mode == 'input' ) {
	} else if ( mode == 'change' ) {
		updateProgressoGantt(rowTask, value, 'move', []);
	}
}
function updateSelectConcluirEtapa() {
	var docsArray = dadosProcessoPro.listDocumentos;
	$("#selectCompleteRelDoc, #dtBoxDocRelacionado").empty().append($('<option/>'));
    $.each(docsArray, function (index, valueSelect) {
        $('#selectCompleteRelDoc, #dtBoxDocRelacionado').append($('<option/>', { 
            value: valueSelect.id_protocolo,
            text : valueSelect.documento+' ('+valueSelect.nr_sei+')',
			data_nr_sei : valueSelect.nr_sei,
			data_assinatura : valueSelect.data_assinatura,
			data_documento : valueSelect.documento
        }));
    });
    if ( $('#dtBoxDocRelacionado').length > 0 ) { 
        var valueSelect = $('#dtBoxDocRelacionado').data('seirelacionado');
        $('#dtBoxDocRelacionado option[data_nr_sei="'+valueSelect+'"]').prop('selected', true);
    }
}
function selectCompleteRelDocChange(this_) {
    var data_assinatura = $(this_).find('option:selected').attr('data_assinatura');
    if (typeof data_assinatura !== 'undefined' && data_assinatura != '') { 
        $('#txtCompleteEtapaDataConclusao').val(moment(data_assinatura, 'DD/MM/YYYY').format('YYYY-MM-DD'));
    }
}
function concluirEtapaGantt(rowTask) {
    $('.ui-dialog button').show();
    
    var trDocRel = '';
	var dataProj = jmespath.search(dadosEtapasObj, "[?ROW=='"+rowTask+"'] | [0]");
    if ( typeof dataProj.Protocolo_SEI !== 'undefined' && dataProj.Protocolo_SEI != '' && dataProj.Protocolo_SEI != '0' ) {
        getDadosIframeProcessoPro(String(dataProj.Protocolo_SEI), 'gantt');
    } else {
        trDocRel = 'style="display:none" ';
    }
    
    var htmlDialog =     '      <table style="width: 100%;">'
                        +'      <tr '+trDocRel+'>'
                        +'          <td style="width: 170px;">'
                        +'              <label for="selectCompleteRelDoc">Documento Relacionado</label>'
                        +'          </td><td>'
                        +'              <select class="sheetsSelect" name="selectCompleteRelDoc" onchange="selectCompleteRelDocChange(this)" id="selectCompleteRelDoc"><option value="0">Aguarde...</option></select>'
                        +'      </tr><tr>'
                        +'          <td>'
                        +'              <label for="txtCompleteEtapaDataConclusao">Data de conclus\u00E3o *</label>'
                        +'          </td><td>'
                        +'              <input type="date" value="" style="width: calc( 100% - 1em) !important;" class="required infraText txtsheetsSelect" name="txtCompleteEtapaDataConclusao" id="txtCompleteEtapaDataConclusao">'
                        +'          </td>'
                        +'      </tr><tr>'
                        +'          <td>'
                        +'              <label for="txtCompleteEtapaObs">Observa&ccedil;&otilde;es</label>'
                        +'          </td><td colspan="3">'
                        +'              <textarea style="width: calc( 100% - 0.5em) !important; max-width: calc( 450px - 0.5em) !important; height: 80px;" class="infraText txtsheetsSelect" name="txtCompleteEtapaObs" id="txtCompleteEtapaObs"></textarea>'
                        +'          </td>'
                        +'      </tr>'
                        +'      </table>'
                        +'      <div id="loadingSheetCompleteEtapa" class="loadingSheet" style="display: none;">'
                        +'          <i class="fas fa-spinner fa-spin"></i>'
                        +'      </div>';
    
    $('#sheetsCompleteEtapaForm').html(htmlDialog)
        .dialog({
            title: "Concluir Etapa - "+dataProj.Nome_Etapa,
            width: 470,
            height: 280,
            buttons: [{
                text: "Concluir Etapa",
                icon: "ui-icon-check",
                class: 'confirm',
                click: function() {
                    if ( checkFormRequiredPro('#sheetsCompleteEtapaForm') ) {
                            if ( $('#txtCompleteEtapaDataConclusao').val() != 0 ) {
                                concluirEtapaSheet(rowTask);
                            }
                    } else {
                        alertaBoxPro('Error', 'exclamation-triangle', 'Preencha todos os campos obrigat&oacute;rios! (*)');
                        $('#sheetsCompleteEtapaForm .required').effect('highlight');
                    }
                }
            }]
        });
}
function checkEtapaConclusao(rowTask) {
    var dataProj = jmespath.search(dadosEtapasObj, "[?ROW=='"+rowTask+"'] | [0]");
    var dataConclusao = $('.ui-dialog #txtCompleteEtapaDataConclusao').val();
    var checkEntrega = moment(dataConclusao, "YYYY-MM-DD").diff(moment(dataProj.Data_Inicio, "DD/MM/YYYY"), 'days');

    return ( checkEntrega >= 0 ) ? true : false;
}
function concluirEtapaSheet(rowTask) {
	$('#sheetsCompleteEtapaForm table').hide();
	$('.ui-dialog #loadingSheetCompleteEtapa').show();
	$('.ui-dialog button').hide();
	$('#sheetsCompleteEtapaForm').dialog({ height: 100, position: { my: "center", at: "center", of: window } });
	
    var selectDocRel = $('.ui-dialog #selectCompleteRelDoc option:selected');
	var tipoDocString = selectDocRel.attr('data_documento');
	var nrSEI = selectDocRel.attr('data_nr_sei');
    var obsEtapa = $('.ui-dialog #txtCompleteEtapaObs').val();
    var dataConclusao = $('.ui-dialog #txtCompleteEtapaDataConclusao').val();
		dataConclusao = ( dataConclusao != '' ) ? moment(dataConclusao, "YYYY-MM-DD").format("DD/MM/YYYY") : '';
	var arrayDadosEtapa = [ [dataConclusao], [tipoDocString], [nrSEI], [obsEtapa] ];
		
	gapi.client.sheets.spreadsheets.values.update({
		spreadsheetId: spreadsheetIdProjetos_Pro,
		range: rangeEtapasPro+'!P'+rowTask,
		majorDimension: 'COLUMNS',
		valueInputOption: 'USER_ENTERED',
		values: arrayDadosEtapa
	}).then(function(response) {
		  var result = response.result;
		  if ( result.updatedColumns > 0 ) {
			$('#sheetsCompleteEtapaForm').dialog('close');
			$('.ui-dialog button').show();
			updateProgressoGantt(rowTask, 100, 'refresh', arrayDadosEtapa);
			alertaBoxPro('Sucess', 'check-circle', 'Etapa conclu&iacute;da com sucesso!');
		  } else {
			$('#sheetsCompleteEtapaForm table').show();
			$('.ui-dialog #loadingSheetCompleteEtapa').hide();
			$('#sheetsCompleteEtapaForm').dialog({ height: 350, position: { my: "center", at: "center", of: window } });
			$('.ui-dialog').effect('shake');
			$('.ui-dialog button').show();
		  }
	}, function(err) { 
		console.error("Execute error", err); 
		alertaBoxPro('Error', 'exclamation-triangle', err.result.error.message );
		$('.ui-dialog button').show();
		$('#sheetsCompleteEtapaForm').dialog('close');
	});
}
function updateProgressoGantt(rowTask, progress, mode, arrayDadosEtapa) {
    if( rowTask != '' ) {
        gapi.client.sheets.spreadsheets.values.update({
            spreadsheetId: spreadsheetIdProjetos_Pro,
            range: rangeEtapasPro+'!M'+rowTask,
            majorDimension: 'COLUMNS',
            valueInputOption: 'USER_ENTERED',
            values: [[progress]]
        }).then(function(response) {
              var result = response.result;
              if ( result.updatedColumns > 0 ) {
				if ( mode == 'move' ) { 
					moveProgressProjetosGantt(rowTask, progress);
				} else if ( mode == 'refresh' ) { 
					refreshProjetosGantt(rowTask, progress, arrayDadosEtapa);
				}
              }
        }, function(err) { 
            console.error("Execute error", err); 
        });
    }
}
function refreshProjetosGantt(rowTask, progress, arrayDadosEtapa) {
	var ID_Projeto = '';
	var id = '';
	for (i = 0; i < dadosEtapasObj.length; i++) {
		if (dadosEtapasObj[i].ROW === rowTask.toString() ) {
			dadosEtapasObj[i].Data_Conclusao = arrayDadosEtapa[0][0];
			dadosEtapasObj[i].Documento_Relacionado = arrayDadosEtapa[1][0];
			dadosEtapasObj[i].SEI_Relacionado = arrayDadosEtapa[2][0];
			dadosEtapasObj[i].Observacao = arrayDadosEtapa[3][0];
			ID_Projeto = dadosEtapasObj[i].ID_Projeto;
		}
	}
	for (i = 0; i < dadosProjetosUniq.length; i++) {
		if (dadosProjetosUniq[i] === ID_Projeto ) {
			id = i;
		}
	}
	for (i = 0; i < ganttProject[id].tasks.length; i++) {
		if (ganttProject[id].tasks[i].rowTask === rowTask ) {
			ganttProject[id].tasks[i].progress = progress;
		}
	}
	ganttProject[id].hide_popup();
	ganttProject[id].refresh(ganttProject[id].tasks);
}
function moveProgressProjetosGantt(rowTask, progress) {
    var idBar = '';
	for (i = 0; i < dadosEtapasObj.length; i++) {
		if (dadosEtapasObj[i].ROW === rowTask.toString() ) {
            dadosEtapasObj[i].Progresso_Execucao = progress;
            idBar = dadosEtapasObj[i].ID;
		}
	}
	for (i = 0; i < ganttProject.length; i++) {
		for (j = 0; j < ganttProject[i].tasks.length; j++) {
			if (ganttProject[i].tasks[j].rowTask === rowTask ) {
				ganttProject[i].tasks[j].progress = progress;
			}
		}
	}
	var widthMax = $('.gantt-container').find('g.bar-wrapper[data-id="'+idBar+'"]').find('.bar').attr('width');
	var widthProgress = Math.round(parseFloat(widthMax)*(progress/100));
		$('.gantt-container').find('g.bar-wrapper[data-id="'+idBar+'"]').find('.bar-progress').attr('width', widthProgress);
}
function scrollGanttToFirstBar() {
    for (i = 0; i < ganttProject.length; i++) {
        var scrollLeft = ganttProject[i].bars[0].x-20;
        var windowDiv = $('#'+ganttProject[i].$svg.id).closest('.gantt-container');
            windowDiv.animate({scrollLeft: scrollLeft}, 500);
    }
}