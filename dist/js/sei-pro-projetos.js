var taskSelect = {macroetapa: [], responsavel: [], grupo: []};

function setProjetos(mode = 'insert', arrayProjetos = arrayConfigAtividades.projetos, query_id_projeto = false) {
    if (checkUnidadeFuncBeta() && !$('#ifrArvore').length) {
        var btnGroup = '<div class="btn-group" role="group" style="float: right;margin-right: 10px;">'+
                       '   <button type="button" data-value="Day" class="btn btn-sm btn-light">Dia</button>'+
                       '      <button type="button" data-value="Week" class="btn btn-sm btn-light">Semana</button>'+
                       '      <button type="button" data-value="Month" class="btn btn-sm btn-light active">M\u00EAs</button>'+
                       '</div>';
        var htmlSelectTipoProjeto = (typeof arrayProjetos !== 'undefined' && arrayProjetos !== null && arrayProjetos.length) ? '<select id="selectTipoProjetoPro" style="max-width: 260px;" class="infraText txtsheetsSelect selectPro" id="tipoProjetoGantt">'+getOptionsTiposProjetos(getOptionsPro('idTipoProjetoSelected'))+'</select>' : '';

        var idOrder = (getOptionsPro('orderPanelHome') && jmespath.search(getOptionsPro('orderPanelHome'), "[?name=='projetosGantt'].index | length(@)") > 0) ? jmespath.search(getOptionsPro('orderPanelHome'), "[?name=='projetosGantt'].index | [0]") : '';
        var htmlProjetosGantt = '<div class="panelHomePro" style="display: inline-block; width: 100%;" id="projetosGantt" data-order="'+idOrder+'">'+
                                '   <div class="infraBarraLocalizacao titlePanelHome"><i class="fa fa-tasks azulColor" style="margin: 0 5px; font-size: 1.1em;"></i> Projetos'+
                                '       <a class="newLink" id="projetosGanttDiv_showIcon" onclick="toggleTablePro(\'#projetosGanttDiv\',\'show\')" onmouseover="return infraTooltipMostrar(\'Mostrar Tabela\');" onmouseout="return infraTooltipOcultar();" style="font-size: 11pt; '+(getOptionsPro('projetosGanttDiv') == 'hide' ? '' : 'display:none;')+'"><i class="fas fa-plus-square cinzaColor"></i></a>'+
                                '       <a class="newLink" id="projetosGanttDiv_hideIcon" onclick="toggleTablePro(\'#projetosGanttDiv\',\'hide\')" onmouseover="return infraTooltipMostrar(\'Recolher Tabela\');" onmouseout="return infraTooltipOcultar();" style="font-size: 11pt; '+(getOptionsPro('projetosGanttDiv') == 'hide' ? 'display:none;' : '')+'"><i class="fas fa-minus-square cinzaColor"></i></a>'+
                                '   </div>'+
                                '   <div id="projetosGanttDiv" style="width: 100%;'+(getOptionsPro('projetosGanttDiv') == 'hide' ? 'display:none;' : 'display: inline-table;')+'">'+
                                '   	<div id="projetosProActions" class="panelHome panelHomeProjeto"  style="position: absolute;z-index: 19999;left: 200px;width: calc(100% - 220px);top: 0;">'+
                                btnGroup+htmlSelectTipoProjeto+
                                '           <a class="newLink iconAtividade_update" onclick="updateAtividade_(this)" onmouseover="return infraTooltipMostrar(\'Atualizar Informa\u00E7\u00F5es\');" onmouseout="return infraTooltipOcultar();" style="margin: 0;font-size: 14pt;float: right;">'+
                                '               <i class="fas fa-sync-alt"></i>'+
                                '           </a>'+
                                '           <a class="newLink iconboxProjeto iconProjeto_config" onclick="openProjetoConfig()" onmouseover="return infraTooltipMostrar(\'Configura\u00E7\u00F5es\');" onmouseout="return infraTooltipOcultar();" style="margin: 0;font-size: 14pt;float: right;">'+
                                '               <i class="fas fa-cog"></i>'+
                                '           </a>'+
                                '           <a class="newLink iconBoxProjeto iconBoxSlim iconProjeto_add" onclick="saveProjeto()" title="Adicionar Novo Projeto" onmouseover="return infraTooltipMostrar(\'Adicionar Novo Projeto\');" onmouseout="return infraTooltipOcultar();" style="margin: 0; font-size: 14pt;">'+
                                '               <i class="fas fa-plus"></i>'+
                                '           </a>'+
                                '           <a class="newLink iconBoxProjeto iconBoxSlim iconProjeto_filter" onclick="openFilterProjeto()" title="Gerar Relat\u00F3rio Filtrado" onmouseover="return infraTooltipMostrar(\'Gerar Relat\u00F3rio Filtrado\');" onmouseout="return infraTooltipOcultar();" style="margin: 0; font-size: 14pt;">'+
                                '               <i class="fas fa-filter"></i>'+
                                '           </a>'+
                                '   	</div>'+
                                '        <div id="projetosTabs">'+
                                '            <ul></ul>'+
                                '        </div>'+
                                '   </div>'+
                                '</div>';

		if ( mode == 'insert' ) {
			if ( $('#projetosGantt').length > 0 ) { $('#projetosGantt').remove(); }
            orderDivPanel(htmlProjetosGantt, idOrder, 'projetosGantt');
            if (getOptionsPro('panelSortPro')) {
                initSortDivPanel();
            }
        } else if ( mode == 'refresh' ) {
			$('#projetosGantt').attr('id', 'projetosGantt_temp');
			$('#projetosGantt_temp').after(htmlProjetosGantt);
			$('#projetosGantt_temp').remove();
		}

            ganttProject = (mode == 'update') ? ganttProject : [];
        
        var width = $('#projetosGanttDiv').width();    
        var dadosProjetosSelected = (getOptionsPro('idTipoProjetoSelected')) ? (jmespath.search(arrayProjetos, "[?id_tipo_projeto==`"+getOptionsPro('idTipoProjetoSelected')+"`]")) : arrayProjetos;
            dadosProjetosSelected = dadosProjetosSelected !== null && dadosProjetosSelected.length ? dadosProjetosSelected : arrayProjetos;
    
        var dadosProjetos = (getOptionsPro('stateArquivadosGantt')) 
                                ? jmespath.search(dadosProjetosSelected, "sort_by([*],&nome_projeto) | [*]")
                                : jmespath.search(dadosProjetosSelected, "sort_by([*],&nome_projeto) | [?ativo==`true`]");

        if ( typeof dadosProjetos !== 'undefined' && dadosProjetos.length > 0 ) {
            $.each(dadosProjetos, function (index, value) {
                var stateOrderGantt = getOptionsPro('stateOrderGantt');
                    stateOrderGantt = !stateOrderGantt ? 'data_inicio' : stateOrderGantt;
                var permiteEdicao = checkPermissionProjeto(value) && checkCapacidade('update_projeto_etapa');
                var dadosEtapas = value.etapas;
                if (dadosEtapas && dadosEtapas.length > 0 ) {
                    dadosEtapas = stateOrderGantt == 'data_inicio' ? dadosEtapas.sort(function(a, b){
                                    var aa = a.data_inicio_programado.split('/').reverse().join(),
                                        bb = b.data_inicio_programado.split('/').reverse().join();
                                    return aa < bb ? -1 : (aa > bb ? 1 : 0);
                                    }) : dadosEtapas;
                    dadosEtapas = stateOrderGantt == 'nome_etapa' ? dadosEtapas.sort((a, b) => a.nome_etapa.localeCompare(b.nome_etapa)) : dadosEtapas;
                    dadosEtapas = stateOrderGantt == 'id_etapa' ? dadosEtapas.sort((a, b) => a.id_etapa - b.id_etapa) : dadosEtapas;
                    var task = [];

                    $.each(dadosEtapas, function (i, v) {
                        var start = moment(v.data_inicio_programado, 'YYYY-MM-DD HH:mm:ss');
                        var end = moment(v.data_fim_programado, 'YYYY-MM-DD HH:mm:ss');
                        var progresso_execucao = v.progresso_execucao;

                        if ( v.data_inicio_progresso_automatico != '0000-00-00 00:00:00' && v.data_fim_execucao == '0000-00-00 00:00:00' && progresso_execucao < 100 ) {
                            var percentProgress = ganttAutoProgressPercent(moment(v.data_inicio_progresso_automatico,'YYYY-MM-DD HH:mm:ss'), moment(v.data_fim_progresso_automatico,'YYYY-MM-DD HH:mm:ss'));
                            if (v.data_inicio_progresso_automatico != '0000-00-00 00:00:00' && percentProgress < 100 && percentProgress != progresso_execucao && percentProgress >= 0 ) {
                                progresso_execucao = percentProgress;
                                setTimeout(() => { updateProgressoProjeto(v.id_projeto, v.id_etapa, progresso_execucao) }, 1000);
                            }
                        }

                        var customClass = ( moment() <= end && moment() >= start ) ? 'bar-ongoing' : 'bar-inday';   
                            customClass = ( progresso_execucao < 100 && end < moment() ) ? 'bar-delay' : customClass;
                            customClass = ( v.data_fim_execucao != '0000-00-00 00:00:00' ) ? 'bar-complete' : customClass;

                        var taskProjeto = {
                                            id: v.id_etapa.toString(),
                                            etapa: v,
                                            index: i,
                                            show_full_popup: true,
                                            name: v.nome_etapa,
                                            start: moment(v.data_inicio_programado, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD'),
                                            end: moment(v.data_fim_programado, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD'),
                                            progress: progresso_execucao ? progresso_execucao : 0,
                                            dependencies: v.id_dependencia ? [v.id_dependencia.toString()] : [],
                                            custom_class: customClass
                                        };

                        task.push(taskProjeto);

                        if (getOptionsPro('stateExecucaoGantt') && v.data_inicio_execucao != '0000-00-00 00:00:00' && v.data_fim_execucao != '0000-00-00 00:00:00') {
                            var taskProjetoExec = {
                                                id: v.id_etapa.toString()+'_',
                                                etapa: v,
                                                index: i,
                                                show_full_popup: false,
                                                name: v.nome_etapa,
                                                start: moment(v.data_inicio_execucao, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD'),
                                                end: moment(v.data_fim_execucao, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD'),
                                                progress: progresso_execucao ? progresso_execucao : 0,
                                                dependencies: [v.id_etapa.toString()],
                                                custom_class: 'bar-executed'
                                            };
                                task.push(taskProjetoExec);
                        }

                        if (v.macroetapa) taskSelect.macroetapa.push(v.macroetapa);
                        if (v.responsavel) taskSelect.responsavel.push(v.responsavel);
                        if (v.grupo) taskSelect.grupo.push(v.grupo);
                    });
                    var toolbarProjetosGantt =  '<div class="Gantt_Toolbar" style="display: inline-block; position: absolute; z-index: 9; width: 98%;">'+
                                                (checkCapacidade('save_projeto_etapa') && permiteEdicao ? 
                                                '   <a class="newLink boxConfig" data-id_projeto="'+value.id_projeto+'"  data-id_etapa="0" onclick="saveEtapa(this)" onmouseover="return infraTooltipMostrar(\'Adicionar Etapa\');" onmouseout="return infraTooltipOcultar();" style="margin: 0; font-size: 14pt;float: right;"><i class="fas fa-plus-circle"></i></a>'+
                                                '' : '')+
                                                (checkCapacidade('edit_projeto') && permiteEdicao ? 
                                                '   <a class="newLink boxConfig" data-id_projeto="'+value.id_projeto+'" onclick="saveProjeto(this)" onmouseover="return infraTooltipMostrar(\'Editar Projeto\');" onmouseout="return infraTooltipOcultar();" style="margin: 0; font-size: 14pt;float: right;"><i class="fas fa-edit"></i></a>'+
                                                '' : '')+
                                                (checkCapacidade('share_projeto') && arrayConfigAtivUnidade.sigla_unidade == value.sigla_unidade ? 
                                                '   <a class="newLink boxConfig" data-id_projeto="'+value.id_projeto+'" onclick="shareProjeto(this)" onmouseover="return infraTooltipMostrar(\'Compartilhar Projeto\');" onmouseout="return infraTooltipOcultar();" style="margin: 0; font-size: 14pt;float: right;"><i class="fas fa-share-square"></i></a>'+
                                                '' : '')+
                                                '</div>';

                    var nameDisplayUnidade = (arrayConfigAtivUnidade.sigla_unidade != value.sigla_unidade) ? '<span class="tagState">'+value.sigla_unidade+'</span>' : '';
                    var nameDisplayState = (!jmespath.search(arrayProjetos, "[?id_projeto==`"+value.id_projeto+"`] | [0].ativo") ) ? '<span class="tagState">ARQUIVADO</span>' : '';
                    var svgProjetosGantt =   '<div id="svgtab_'+value.id_projeto+'" class="resizeObserve">'+toolbarProjetosGantt+'<svg id="gantt_'+value.id_projeto+'" class="svg_gantt"></svg></div>';
                    var liTabsProjetosGantt = '<li><a href="#svgtab_'+value.id_projeto+'">'+value.nome_projeto+nameDisplayUnidade+nameDisplayState+'</a></li>';

                    if (mode != 'update') {
                        $('#projetosTabs #svgtab_'+value.id_projeto).remove();
                        $('#projetosTabs a[href="#svgtab_'+value.id_projeto+'"]').remove();
                        
                        $('#projetosTabs ul').append(liTabsProjetosGantt);
                        $('#projetosTabs').append(svgProjetosGantt);
                    }

                    var gantt = (mode == 'update') ? false : new Gantt("#gantt_"+value.id_projeto, task ,{
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
                        id_projeto: value.id_projeto,
                        edit_task: permiteEdicao && getOptionsPro('stateVisualGantt'),
                        view_mode: 'Month',   
                        date_format: 'YYYY-MM-DD HH:mm:ss',
                        custom_popup_html: function(task) {
                            return customPopupHtmlProjeto(task, arrayProjetos, permiteEdicao);
                        },
                        on_click: function (task) {
                            // console.log('on_click',task);
                        },
                        on_date_change: function(task, start, end) {
                            if (checkCapacidade('update_projeto_etapa')) updateDatesProjetos(task, start, end);
                        },
                        on_progress_change: function(task, progresso_execucao) {
                            if (checkCapacidade('update_projeto_etapa')) updateProgressoProjeto(task.etapa.id_projeto, task.etapa.id_etapa, progresso_execucao);
                        },
                        on_view_change: function(mode) {
                            // console.log('on_view_change',mode);
                        }
                    });
                    if ( mode == 'update' && query_id_projeto == value.id_projeto) {
                        objIndexProj = (typeof ganttProject === 'undefined' || ganttProject.length == 0) ? -1 : ganttProject.findIndex((obj => obj.options.id_projeto == value.id_projeto));
                        if (objIndexProj !== -1) {
                            var scrollGantt = $('#svgtab_'+value.id_projeto+' .gantt-container').scrollLeft();
                                ganttProject[objIndexProj].hide_popup();
                                ganttProject[objIndexProj].refresh(task);
                                $('#svgtab_'+value.id_projeto+' .gantt-container').scrollLeft(scrollGantt);
                        }
                    } else {
                        if (gantt) ganttProject.push(gantt);
                    }
                }
            });
            var taskMacroetapa = uniqPro(taskSelect.macroetapa);
            var taskResponsavel = uniqPro(taskSelect.responsavel);
            var taskGrupo = uniqPro(taskSelect.grupo);
                taskSelect = {macroetapa: taskMacroetapa, responsavel: taskResponsavel, grupo: taskGrupo};
        } else {
            var htmlFallback =  '<div class="dataFallback" style="z-index: 9" data-text="Nenhum projeto dispon\u00EDvel">'+
                                '   <div style="position: absolute;top: calc(50% - 60px);width: 100%;text-align: center;">'+
                                '       <a class="newLink iconProjeto_add" data-icon="fas fa-tasks icon-parent" onclick="saveProjeto()" onmouseover="return infraTooltipMostrar(\'Adicionar Novo Projeto\');" onmouseout="return infraTooltipOcultar();" style="margin: 0;font-size: 14pt;">'+
                                '           <span class="fa-layers fa-fw">'+
                                '               <i class="fas fa-tasks icon-parent"></i>'+
                                '               <i class="fas fa-plus-circle fa-layers-counter fa-layers-bottom"></i>'+
                                '           </span>'+
                                '       </a>'+
                                '   </div>'+
                                '</div>';

            $('#projetosTabs ul').append(htmlFallback);
        }
        if (mode != 'update') {
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
                    $('#projetosTabs').tabs({
                        activate: function (event, ui) {
                            var active = $(this).tabs( "option", "active" );
                            setOptionsPro('projetosGanttActiveTabs', active);
                            scrollProjetoGanttToFirstBar();
                            resetDialogBoxPro('dialogBoxPro');
                        }
                    }); 
                    var activeTab = ( getOptionsPro('projetosGanttActiveTabs') && parseInt(getOptionsPro('projetosGanttActiveTabs')) >= 0 ) ? parseInt(getOptionsPro('projetosGanttActiveTabs')) : 0;
                    $('#projetosTabs').tabs( "option", "active",  activeTab);
                }
                $('#selectTipoProjetoPro').on('change', function(){
                        setOptionsPro('idTipoProjetoSelected', $('option:selected', this).val());
                        setProjetos('refresh');
                }).chosen("destroy").chosen({
                    placeholder_text_single: ' ',
                    no_results_text: 'Nenhum resultado encontrado'
                });
                scrollProjetoGanttToFirstBar();
                normalizeAreaTela();
            }, 300);
        }
    } else {
        $('#projetosGantt').remove();
    }
}
function resizeHeightCanvasProjeto(id_projeto) {
    setTimeout(() => {
        $('#svgtab_'+id_projeto+' .gantt-container').attr('style','max-width:'+$('#svgtab_'+id_projeto+' .gantt-container').css('max-width'));
        $('#svgtab_'+id_projeto+' .gantt-container').css('height',$('#svgtab_'+id_projeto+' .gantt-container')[0].scrollHeight+20);
    });
}
function customPopupHtmlProjeto(task, arrayProjetos = arrayConfigAtividades.projetos, permiteEdicao = false) {
    var etapa = task.etapa;
    resizeHeightCanvasProjeto(etapa.id_projeto);
    var txtDateAutoProgress = (etapa.data_inicio_progresso_automatico != '0000-00-00 00:00:00' ) ? moment(etapa.data_inicio_progresso_automatico,'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY HH:mm')+' \u00E0 '+moment(etapa.data_fim_progresso_automatico,'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY HH:mm') : '';
    var htmlAutoProgress = (etapa.data_inicio_progresso_automatico != '0000-00-00 00:00:00') 
            ?   '<a class="ui-button ui-corner-all ui-widget ui-state-active" style="margin-left: 15px; color: #2b2b2b; text-decoration: none;padding: 3px; height: 15px;" data-id_etapa="'+etapa.id_etapa+'" data-id_projeto="'+etapa.id_projeto+'" data-mode="edit" onclick="setAutoProgressProjeto(this)" onmouseover="return infraTooltipMostrar(\'Editar execu\u00E7\u00E3o autom\u00E1tica de etapa ('+txtDateAutoProgress+') \');" onmouseout="return infraTooltipOcultar();">'+
                '       <i class="fas fa-cog brancoColor"></i>'+
                '   </a>' 
            :   '<a class="ui-button ui-corner-all ui-widget" style="margin-left: 15px; color: #2b2b2b; text-decoration: none;padding: 3px; height: 15px;" data-id_etapa="'+etapa.id_etapa+'" data-id_projeto="'+etapa.id_projeto+'" data-mode="config" onclick="setAutoProgressProjeto(this)" onmouseover="return infraTooltipMostrar(\'Configurar execu\u00E7\u00E3o autom\u00E1tica de etapa\');" onmouseout="return infraTooltipOcultar();">'+
                '   <i class="fas fa-cog cinzaColor"></i>'+
                '</a>';
        htmlAutoProgress = (etapa.data_inicio_execucao != '0000-00-00 00:00:00' && etapa.data_fim_execucao == '0000-00-00 00:00:00' && !etapa.id_demandas && permiteEdicao && task.show_full_popup) ? htmlAutoProgress : '';
    var htmlPercent = (etapa.data_inicio_execucao != '0000-00-00 00:00:00' && etapa.data_fim_execucao == '0000-00-00 00:00:00' && !etapa.id_demandas && permiteEdicao && task.show_full_popup) 
            ? '<input onchange="changePercentRange(this)" data-id_etapa="'+etapa.id_etapa+'" data-id_projeto="'+etapa.id_projeto+'" oninput="changePercentRange(this)" type="range" value="'+(etapa.progresso_execucao || 0)+'" min="0" max="100" step="25" style="width: calc( 100% - 20px) !important; border: none; padding: 0 !important;">' 
            : 
                (etapa.data_inicio_execucao == '0000-00-00 00:00:00' && etapa.data_fim_execucao == '0000-00-00 00:00:00' && !etapa.id_demandas && permiteEdicao && task.show_full_popup) 
                ? 
                    '<span>'+
                    '   <a class="ui-button ui-corner-all ui-widget" style="margin-left: 15px; color: #2b2b2b; text-decoration: none;padding: 3px 10px; height: 15px;" onclick="showExecucaoEtapa(this)">'+
                    '       <i class="fas fa-play cinzaColor" style="margin: 0 5px;"></i> Iniciar execu\u00E7\u00E3o'+
                    '   </a>'+
                    '</span>'+
                    '<span style="display:none;" class="span_data_inicio_execucao">'+
                    '   <input type="datetime-local" id="proj_data_inicio_execucao" style="display: inline;width: 120px;padding: 6px !important;" data-key="data_inicio_execucao" value="'+moment().format('YYYY-MM-DDTHH:mm')+'">'+
                    '   <a class="ui-button ui-corner-all ui-widget" style="color: #2b2b2b;text-decoration: none;padding: 7px;" data-id_etapa="'+etapa.id_etapa+'" data-id_projeto="'+etapa.id_projeto+'" data-mode="init" onclick="setExecucaoEtapa(this)" onmouseover="return infraTooltipMostrar(\'Salvar\');" onmouseout="return infraTooltipOcultar();">'+
                    '       <i class="fas fa-check cinzaColor"></i>'+
                    '   </a>'+
                    '</span>'
                : '';
        htmlPercent = ((etapa.data_inicio_execucao != '0000-00-00 00:00:00' &&  etapa.data_inicio_progresso_automatico != '0000-00-00 00:00:00') || !permiteEdicao || !task.show_full_popup ) ? '' : htmlPercent;
    
    var htmlEtiqueta = (etapa.etiqueta) 
            ? etapa.etiqueta.indexOf(',') !== -1
                ? $.map(etapa.etiqueta.split(','), function(v){
                    return getHtmlEtiqueta(v)
                }).join('')
                : getHtmlEtiqueta(etapa.etiqueta)
            : '';
        
    var htmlDocumento_Rel = (etapa.documento_relacionado) 
            ?   '<tr>'+
                '   <td colspan="2">'+
                '       <p>'+
                '           <i class="iconPopup fas fa-file-alt cinzaColor"></i> '+
                '           <span class="boxInfo">'+
                '               <strong>'+
                '                   <a style="font-size: 12px;" onmouseover="return infraTooltipMostrar(\'Visualiza\u00E7\u00E3o r\u00E1pida\');" onmouseout="return infraTooltipOcultar();" '+(etapa.documento_sei ? 'onclick="openSEINrPro(this, \''+etapa.documento_sei+'\')"' : '')+'>'+
                (etapa.documento_relacionado ? etapa.documento_relacionado : '' )+
                '                       <i class="fas fa-eye bLink" style="font-size: 80%;vertical-align: top;margin-left: 5px;"></i>'+
                '                   </a>'+
                '               </strong>'+
                '           </span>'+
                '       </p>'+
                '   </td>'+
                '</tr>' 
            : '';
    var htmlObservacao = (etapa.observacoes) 
            ?   '<tr>'+
                '   <td colspan="2">'+
                '       <p>'+
                '           <i class="iconPopup fas fa-comment-alt cinzaColor"></i> '+
                '           <strong style="font-style: italic; color: #585858;">'+
                '               <span class="boxInfo">'+(etapa.observacoes || '')+'</span>'+
                '           </strong>'+
                '       </p>'+
                '   </td>'+
                '</tr>' 
            : '';

    var html = '<div class="details-container seiProForm">'+
               '   <table class="tableInfo">'+
               '      <tr>'+
               '        <td colspan="2">'+
               '            <h5>'+
               '                <input type="hidden" value="'+etapa.id_projeto+'" id="dtBoxIDProjeto"><i class="iconPopup fas fa-project-diagram cinzaColor"></i> '+
               '                <span class="boxInfo" style="font-size: 11pt;font-weight: bold;width: 270px;display: inline-block;margin-top: 8px;">'+(etapa.nome_etapa || '')+'</span>'+
               '                <a style="float: right; margin: -4px -4px 0 0; padding: 5px;" onclick="closeAllPopupsProjeto()">'+
               '                    <i class="far fa-times-circle cinzaColor"></i>'+
               '                </a>'+
               (permiteEdicao && task.show_full_popup ?
               '                <a style="float: right; margin: -4px -4px 0 0; padding: 5px;" data-id_projeto="'+etapa.id_projeto+'" data-id_etapa="'+etapa.id_etapa+'" onclick="saveEtapa(this)">'+
               '                    <i class="far fa-edit cinzaColor"></i>'+  
               '                </a>'+
               '' : '')+
               '            </h5>'+
               '        </td>'+
               '      </tr>'+
               (etapa.id_procedimento ?
               '      <tr>'+
               '        <td colspan="3">'+
               '            <h5>'+
               '                <i class="iconPopup fas fa-folder-open cinzaColor"></i> '+
               '                <p class="boxInfo">'+
               '                    <a target="_blank" href="controlador.php?acao=procedimento_trabalhar&id_procedimento='+etapa.id_procedimento+'">'+(etapa.processo_sei || '')+' '+
               '                        <i class="fas fa-external-link-alt bLink" style="font-size: 90%;"></i>'+
               '                    </a>'+
               '                </p>'+
               '            </h5>'+
               '        </td>'+
               '      </tr>'+
               '' : '')+
               '      <tr>'+
               '        <td>'+
               '            <p style="display: inline-flex;">'+
               '                <i class="iconPopup fas fa-percentage cinzaColor"></i>  '+
               '                <span style="padding: 3px 5px 0 0; width: 115px;">'+
               '                    <span class="gantt-percent" style="width: 25px; display: inline-block; text-align: right;">'+(etapa.progresso_execucao || 0)+'</span>% Executado'+
               '                </span>'+
               '        </td>'+
               '        <td>'+
               '            <p style="display: inline-flex;">'+htmlPercent+htmlAutoProgress+'</p>'+
               '        </td>'+
               '      </tr>'+
               (etapa.id_demandas && typeof etapa.id_demandas_titles !== 'undefined' && etapa.id_demandas_titles.length ?
               '      <tr>'+
               '        <td colspan="2">'+
               '            <p>'+
               '                <i class="iconPopup fas fa-check-circle cinzaColor"></i> Demandas Vinculadas:'+
               '            </p>'+
               '        </td>'+
               '      </tr>'+
               '      <tr>'+
               '        <td colspan="2">'+
               '            <p>'+
               '                <div class="boxInfo" style="overflow-y: auto;max-height: 250px;">'+
                                    $.map(etapa.id_demandas_titles, function(v){ 
                                        var click = (jmespath.search(arrayAtividadesPro,"[?id_demanda==`"+v.id_demanda+"`] | [0]") !== null) ? 'onclick="infoAtividade('+v.id_demanda+')"' : '';
                                        return '<a class="newLink" style="font-size: 9pt;color: initial;text-decoration: inherit;background-color: #f5f5f5;margin: 5px 0;line-height: 15pt;" '+click+'>'+getDemandaVinculadaBox(v)+'</a>'
                                    }).join('')+
               '                </div>'+
               '            </p>'+
               '        </td>'+
               '      </tr>'+
               '' : '')+
               '      <tr>'+
               (task.show_full_popup ?
               '      <tr>'+
               '        <td>'+
               '            <p>'+
               '                <i class="iconPopup fas fa-clock cinzaColor"></i> In\u00EDcio da Etapa:'+
               '            </p>'+
               '        </td>'+
               '        <td>'+
               '            <p>'+
               '                <span class="boxInfo">'+moment(etapa.data_inicio_programado,'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY HH:mm')+'</span>'+
               '            </p>'+
               '        </td>'+
               '      </tr>'+
               '      <tr>'+
               '        <td>'+
               '            <p>'+
               '                <i class="iconPopup far fa-clock cinzaColor"></i> Fim da Etapa:'+
               '            </p>'+
               '        </td>'+
               '        <td>'+
               '            <p>'+
               '                <span class="boxInfo">'+moment(etapa.data_fim_programado,'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY HH:mm')+'</span>'+
               '            </p>'+
               '        </td>'+
               '      </tr>'+
               '' : '')+
               (etapa.data_inicio_execucao != '0000-00-00 00:00:00' ? 
               '      <tr>'+
               '        <td>'+
               '            <p>'+
               '                <i class="iconPopup fas fa-hourglass-start cinzaColor"></i> In\u00EDcio da Execu\u00E7\u00E3o:'+
               '            </p>'+
               '        </td>'+
               '        <td>'+
               '            <p>'+
               '                <span class="boxInfo">'+moment(etapa.data_inicio_execucao,'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY HH:mm')+'</span>'+
               '            </p>'+
               '        </td>'+
               '      </tr>'+
               '' : '')+
               (etapa.data_fim_execucao != '0000-00-00 00:00:00' ? 
               '      <tr>'+
               '        <td>'+
               '            <p>'+
               '                <i class="iconPopup far fa-hourglass-end cinzaColor"></i> Fim da Execu\u00E7\u00E3o:'+
               '            </p>'+
               '        </td>'+
               '        <td>'+
               '            <p>'+
               '                <span class="boxInfo">'+moment(etapa.data_fim_execucao,'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY HH:mm')+'</span>'+
               '            </p>'+
               '        </td>'+
               '      </tr>'+
               '' : '')+
               '      <tr>'+
               '        <td colspan="3" style="height: 10px !important;border-top: 1px solid #ccc;">'+
               '            <a style="float: right;margin-top: -14px;background: #fff;padding: 5px;border-radius: 5px;" onclick="showProjetoDetalhe(this);resizeHeightCanvasProjeto('+etapa.id_projeto+');">'+
               '                <i class="fas cinzaColor fa-plus-circle"></i>'+
               '            </a>'+
               '        </td>'+
               '      </tr>'+
               '      <tr class="detalheBox" style="display:none">'+
               '        <td>'+
               '            <p>'+
               '                <i class="iconPopup fas fa-user-tie cinzaColor"></i> Respons\u00E1vel:'+
               '            </p>'+
               '        </td>'+
               '        <td>'+
               '            <p>'+
               '                <span class="boxInfo">'+(etapa.responsavel || '')+'</span>'+
               '            </p>'+
               '        </td>'+
               '      </tr>'+
               '      <tr class="detalheBox" style="display:none">'+
               '        <td>'+
               '            <p>'+
               '                <i class="iconPopup fas fa-layer-group cinzaColor"></i> Macroetapa:'+
               '            </p>'+
               '        </td>'+
               '        <td>'+
               '            <p>'+
               '                <span class="boxInfo">'+(etapa.macroetapa || '')+'</span>'+
               '            </p>'+
               '        </td>'+
               '      </tr>'+
               '      <tr class="detalheBox" style="display:none">'+
               '        <td>'+
               '            <p>'+
               '                <i class="iconPopup fas fa-retweet cinzaColor"></i> Depend\u00EAncia:'+
               '            </p>'+
               '        </td>'+
               '        <td>'+
               '            <p>'+
               '                <span class="boxInfo">'+( jmespath.search(arrayProjetos,"[].etapas | [] | [?id_etapa==`"+etapa.id_dependencia+"`] | [0].nome_etapa") || '' )+'</span>'+
               '            </p>'+
               '        </td>'+
               '      </tr>'+
               '      <tr class="detalheBox" style="display:none">'+
               '        <td>'+
               '            <p>'+
               '                <i class="iconPopup far fa-object-group cinzaColor"></i> Grupo:'+
               '            </p>'+
               '        </td>'+
               '        <td>'+
               '            <p>'+
               '                <span class="boxInfo">'+(etapa.grupo || '')+'</span>'+
               '            </p>'+
               '        </td>'+
               '      </tr>'+
               '      <tr class="detalheBox" style="display:none">'+
               '        <td>'+
               '            <p>'+
               '                <i class="iconPopup fas fa-tags cinzaColor"></i> Etiqueta:'+
               '            </p>'+
               '        </td>'+
               '        <td>'+
               '            <p>'+
               '                <span class="boxInfo info_tags_follow">'+htmlEtiqueta+'</span>'+
               '            </p>'+
               '        </td>'+
               '      </tr>'+
               '      '+htmlDocumento_Rel+htmlObservacao+
               (etapa.data_inicio_execucao != '0000-00-00 00:00:00' && etapa.data_fim_execucao != '0000-00-00 00:00:00' && permiteEdicao && task.show_full_popup ?
               '      <tr class="detalheBox" style="display:none">'+
               '        <td colspan="2" style="height: 30px !important;">'+
               '            <a class="ui-button ui-corner-all ui-widget" style="color: #2b2b2b; text-decoration: none; float: right;" data-id_etapa="'+etapa.id_etapa+'" data-id_projeto="'+etapa.id_projeto+'" onclick="cancelCompleteEtapa(this)">'+
               '            <i style="margin-right: 3px;" class="fas fa-times-circle vermelhoColor"></i>Cancelar Conclus\u00E3o da Etapa'+
               '            </a>'+
               '        </td>'+
               '      </tr>'+
               '' : '')+
               (etapa.data_inicio_execucao != '0000-00-00 00:00:00' && etapa.data_fim_execucao == '0000-00-00 00:00:00' && !etapa.id_demandas && permiteEdicao && task.show_full_popup ?
               '      <tr>'+
               '        <td colspan="2" style="height: 30px !important;">'+
               '            <a class="ui-button ui-corner-all ui-widget" style="color: #2b2b2b; text-decoration: none; float: right;" data-id_etapa="'+etapa.id_etapa+'" data-id_projeto="'+etapa.id_projeto+'" onclick="completeEtapa(this)">'+
               '            <i style="margin-right: 3px;" class="fas fa-check-circle verdeColor"></i>Concluir Etapa'+
               '            </a>'+
               '        </td>'+
               '      </tr>'+
               '' : '')+
               '   </table>'+
               '</div>';
    return html;
}
function openProjetoConfig() {
    var stateVisualGantt = ( (typeof ganttProject[0] !== 'undefined' && ganttProject[0].options.edit_task == true) || ( getOptionsPro('stateVisualGantt') == true ) ) ? 'checked' : '';
    var stateArquivadosGantt = getOptionsPro('stateArquivadosGantt') ? 'checked' : '';
    var stateExecucaoGantt = getOptionsPro('stateExecucaoGantt') ? 'checked' : '';
    var statePanelSortPro = ( getOptionsPro('panelSortPro') ) ? 'checked' : '';
    var textBox =   '<table style="font-size: 10pt;width: 100%;">'+
                    '   <tr style="height: 40px;">'+
                    '       <td colspan="2">'+
                    '           <table style="font-size: 10pt;width: 100%;">'+
                    '              <tr style="height: 40px;">'+
                    '                  <td><i class="iconPopup fas fa-sort-alpha-up cinzaColor"></i> Ordena\u00E7\u00E3o das etapas</td>'+
                    '                  <td style="text-align:right;">'+
                    '                      <select id="editOrdemProjetos" onchange="changeOrdemProjetos(this)">'+
                    '                           <option value="data_inicio" '+(!getOptionsPro('stateOrderGantt') || getOptionsPro('stateOrderGantt') == 'data_inicio' ? 'selected' : '')+'>Data de in\u00EDcio</option>'+
                    '                           <option value="nome_etapa" '+(getOptionsPro('stateOrderGantt') == 'nome_etapa' ? 'selected' : '')+'>Nome da etapa</option>'+
                    '                           <option value="id_etapa" '+(getOptionsPro('stateOrderGantt') == 'id_etapa' ? 'selected' : '')+'>Data de cadastro</option>'+
                    '                      </select>'+
                    '                  </td>'+
                    '              </tr>'+
                    '           </table>'+
                    '       </td>'+
                    '   </tr>'+
                    '   <tr style="height: 40px;">'+
                    '       <td><i class="iconPopup fas fa-hand-paper cinzaColor"></i> Ativar modo de edi\u00E7\u00E3o visual (arrastar e soltar)</td>'+
                    '       <td>'+
                    '           <div class="onoffswitch">'+
                    '               <input type="checkbox" onchange="changeVisualProjetos(this)" name="onoffswitch" class="onoffswitch-checkbox" id="editVisualProjetos" tabindex="0" '+stateVisualGantt+'>'+
                    '               <label class="onoffswitch-label" for="editVisualProjetos"></label>'+
                    '           </div>'+
                    '       </td>'+
                    '   </tr>'+
                    '   <tr style="height: 40px;">'+
                    '       <td><i class="iconPopup fas fa-check-double cinzaColor"></i> Visualizar datas de execu\u00E7\u00E3o em etapas distintas</td>'+
                    '       <td>'+
                    '           <div class="onoffswitch">'+
                    '               <input type="checkbox" onchange="changeExecucaoProjetos(this)" name="onoffswitch" class="onoffswitch-checkbox" id="editExecucaoProjetos" tabindex="0" '+stateExecucaoGantt+'>'+
                    '               <label class="onoffswitch-label" for="editExecucaoProjetos"></label>'+
                    '           </div>'+
                    '       </td>'+
                    '   </tr>'+
                    '   <tr style="height: 40px;">'+
                    '       <td><i class="iconPopup fas fa-archive cinzaColor"></i> Visualizar projetos arquivados</td>'+
                    '       <td>'+
                    '           <div class="onoffswitch">'+
                    '               <input type="checkbox" onchange="viewProjetosArquivados(this)" name="onoffswitch" class="onoffswitch-checkbox" id="viewProjetosArquivados" tabindex="0" '+stateArquivadosGantt+'>'+
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
                    '</table>';
    resetDialogBoxPro('dialogBoxPro');
    dialogBoxPro = $('#dialogBoxPro')
        .html('<div class="dialogBoxDiv"> '+textBox+'</span>')
        .dialog({
        	width: 450,
            title: 'Configura\u00E7\u00F5es de Projetos',
            open: function() { 
                initChosenReplace('box_init', this, true);
            },
        	buttons: [{
                text: "Ok",
                class: 'confirm',
                click: function() {
                    $(this).dialog('close');
                }
            }]
    });
}
function changeProjetoProcesso(this_) {
	var _this = $(this_);
    var _parent = _this.closest('table');
    var selected = _this.find('option:selected');
    var id_procedimento = selected.data('id_procedimento');
    var processo_sei = _this.val();
    if (processo_sei != '0') {
        _parent.find('#proj_processo_sei').val(processo_sei);
        _parent.find('#proj_id_procedimento').val(id_procedimento);
    } else {
        _parent.find('#proj_id_procedimento').val('');
        _parent.find('#proj_select_processo_sei').hide();
        _parent.find('#proj_select_processo_sei_chosen').hide();
        _parent.find('#proj_processo_sei').show().val('').focus();
    }
}
function changePercentRange(this_) {
	var _this = $(this_);
	var data = _this.data();
    var id_etapa = data.id_etapa;
    var id_projeto = data.id_projeto;
	var progresso_execucao = parseInt(_this.val());
    if (checkPermissionProjeto(valueProjeto(id_projeto))) {
        $(this_).closest('tr').find('.gantt-percent').text(progresso_execucao);
        updateProgressoProjeto(id_projeto, id_etapa, progresso_execucao);
    }
}
function updateProgressoProjeto(id_projeto, id_etapa, progresso_execucao) {
    if (checkPermissionProjeto(valueProjeto(id_projeto))) {
        var action = 'update_projeto_etapa';
        var param = {
            action: action, 
            mode: 'progresso_execucao',
            id_projeto: id_projeto,
            id_etapa: id_etapa,
            progresso_execucao: progresso_execucao
        };
        getServerAtividades(param, action);

        var container = $('#svgtab_'+id_projeto+' .gantt-container');
        var widthMax = container.find('g.bar-wrapper[data-id="'+id_etapa+'"]').find('.bar').attr('width');
        var widthProgress = Math.round(parseFloat(widthMax)*(progresso_execucao/100));
            container.find('g.bar-wrapper[data-id="'+id_etapa+'"]').find('.bar-progress').attr('width', widthProgress);

        for (i = 0; i < ganttProject.length; i++) {
            for (j = 0; j < ganttProject[i].tasks.length; j++) {
                if (ganttProject[i].tasks[j].id === id_etapa.toString() ) {
                    ganttProject[i].tasks[j].progress = progresso_execucao;
                    ganttProject[i].tasks[j].etapa.progresso_execucao = progresso_execucao;
                }
            }
        }
    }
}
function setAutoProgressProjeto(this_, arrayProjetos = arrayConfigAtividades.projetos) {
	var _this = $(this_);
	var data = _this.data();
    var id_etapa = data.id_etapa;
    var id_etapa = typeof data !== 'undefined' ? data.id_etapa : undefined;
        id_etapa = typeof id_etapa !== 'undefined' ? id_etapa : 0;
    var id_projeto = typeof data !== 'undefined' ? data.id_projeto : undefined;
        id_projeto = typeof id_projeto !== 'undefined' ? id_projeto : 0;

    if (checkPermissionProjeto(valueProjeto(id_projeto))) {
        var mode = typeof data !== 'undefined' ? data.mode : undefined;
            mode = typeof mode !== 'undefined' ? mode : 'config';
        var value = valueEtapa(id_projeto, id_etapa);
        var dataInicio = (value.data_inicio_progresso_automatico != '0000-00-00 00:00:00' ) ? moment(value.data_inicio_progresso_automatico,'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DDTHH:mm') : moment().format('YYYY-MM-DDTHH:mm');
        var dataFim = (value.data_fim_progresso_automatico != '0000-00-00 00:00:00' ) ? moment(value.data_fim_progresso_automatico,'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DDTHH:mm') : moment().add(1,'months').format('YYYY-MM-DDTHH:mm');

        var htmlBox =   '<div id="boxProjeto" class="atividadeWork" data-projeto="'+id_projeto+'" data-etapa="'+id_etapa+'">'+
                        '   <table style="font-size: 10pt;width: 100%;" class="seiProForm">'+
                        '      <tr>'+
                        '          <td style="vertical-align: bottom; text-align: left;width: 230px;" class="label">'+
                        '               <label for="proj_data_inicio_progresso_automatico"><i class="iconPopup iconSwitch fas fa-clock cinzaColor"></i>In\u00EDcio da Execu\u00E7\u00E3o (autom\u00E1tico):</label>'+
                        '           </td>'+
                        '           <td class="required date">'+
                        '               <input type="datetime-local" id="proj_data_inicio_progresso_automatico" onchange="updateDatesRange(this);checkThisAtivRequiredFields(this)" data-range="inicio" data-key="data_inicio_progresso_automatico" value="'+dataInicio+'" max="'+dataFim+'" required>'+
                        '           </td>'+
                        '      </tr>'+
                        '      <tr>'+
                        '           <td style="vertical-align: bottom; text-align: left;" class="label">'+
                        '               <label for="proj_data_fim_progresso_automatico"><i class="iconPopup iconSwitch fas fa-clock cinzaColor" style="float: initial;"></i>Fim da Execu\u00E7\u00E3o (autom\u00E1tico):</label>'+
                        '           </td>'+
                        '           <td class="required date">'+
                        '               <input type="datetime-local" id="proj_data_fim_progresso_automatico" onchange="updateDatesRange(this);checkThisAtivRequiredFields(this)" data-range="fim" data-key="data_fim_progresso_automatico" min="'+dataInicio+'" value="'+dataFim+'" required>'+
                        '           </td>'+
                        '      </tr>'+
                        '   </table>'+
                        '</div>';

        var btnActions = ( mode == 'edit' ) ? 
                    [{
                    text: "Excluir",
                    icon: "ui-icon-trash", 
                    click: function() {
                        if (checkAtivRequiredFields($('#proj_data_inicio_progresso_automatico')[0], 'mark')) {
                            getAutoProgressProjeto(this, 'delete');
                        }
                    }},{
                    text: "Editar",
                    icon: "ui-icon-disk",
                    class: 'confirm',
                    click: function() {
                        if (checkAtivRequiredFields($('#proj_data_inicio_progresso_automatico')[0], 'mark')) {
                            getAutoProgressProjeto(this);
                        }
                    }}]
                        :
                    [{
                    text: "Salvar",
                    icon: 'ui-icon-disk',
                    class: 'confirm',
                    click: function() {
                        if (checkAtivRequiredFields($('#proj_data_inicio_progresso_automatico')[0], 'mark')) {
                            getAutoProgressProjeto(this);
                        }
                    }}];
                    
        resetDialogBoxPro('dialogBoxPro');
        dialogBoxPro = $('#dialogBoxPro')
        .html('<div class="dialogBoxDiv">'+htmlBox+'</span>')
            .dialog({
                width: 500,
                title: 'Execu\u00E7\u00E3o autom\u00E1tica de etapa',
                open: function() { 
                    updateButtonConfirm(this, true);
                    prepareFieldsReplace(this);
                },
                buttons: btnActions
        });
    }
}
function getAutoProgressProjeto(this_, mode = 'insert') {
    var _parent = $(this_);
    var id_projeto = _parent.find('#boxProjeto').data('projeto');
    if (checkPermissionProjeto(valueProjeto(id_projeto))) {
        var id_etapa = _parent.find('#boxProjeto').data('etapa');
        var data_inicio_progresso_automatico = _parent.find('[data-key="data_inicio_progresso_automatico"]').val();
            data_inicio_progresso_automatico = typeof data_inicio_progresso_automatico !== 'undefined' ? moment(data_inicio_progresso_automatico,'YYYY-MM-DDTHH:mm').format('YYYY-MM-DD HH:mm:ss') : false;
            data_inicio_progresso_automatico = mode == 'delete' ? '0000-00-00 00:00:00' : data_inicio_progresso_automatico;
        var data_fim_progresso_automatico = _parent.find('[data-key="data_fim_progresso_automatico"]').val();
            data_fim_progresso_automatico = typeof data_fim_progresso_automatico !== 'undefined' ? moment(data_fim_progresso_automatico,'YYYY-MM-DDTHH:mm').format('YYYY-MM-DD HH:mm:ss') : false;
            data_fim_progresso_automatico = mode == 'delete' ? '0000-00-00 00:00:00' : data_fim_progresso_automatico;

        var action = 'update_projeto_etapa';
        var param = {
            action: action, 
            mode: 'progresso_automatico',
            id_projeto: id_projeto,
            id_etapa: id_etapa,
            data_inicio_progresso_automatico: data_inicio_progresso_automatico,
            data_fim_progresso_automatico: data_fim_progresso_automatico
        };
        getServerAtividades(param, action);
    }
}
function viewProjetosArquivados(this_) {
    setOptionsPro('stateArquivadosGantt', $(this_).is(':checked'));
    if ($(this_).is(':checked')) {
        setTimeout(() => {
            updateAtividade_(false);
            loadingButtonConfirm(false);
            $('#projetosProActions .iconAtividade_update').addClass('fa-spin');
        }, 1000);
    } else {
        setProjetos('refresh');
    }
}
function updateDatesProjetos(task, start, end) {
    if (checkPermissionProjeto(valueProjeto(task.etapa.id_projeto))) {
        var action = 'update_projeto_etapa';
        var param = {
            action: action, 
            mode: 'data_programado',
            id_projeto: task.etapa.id_projeto,
            id_etapa: task.etapa.id_etapa,
            data_inicio_programado: moment(start).format('YYYY-MM-DD HH:mm:ss'),
            data_fim_programado: moment(end).format('YYYY-MM-DD HH:mm:ss')
        };
        getServerAtividades(param, action);

        for (i = 0; i < ganttProject.length; i++) {
            for (j = 0; j < ganttProject[i].tasks.length; j++) {
                if (ganttProject[i].tasks[j].id === task.id ) {
                    ganttProject[i].tasks[j]._start = start;
                    ganttProject[i].tasks[j].start = moment(start).format('YYYY-MM-DD');
                    ganttProject[i].tasks[j].etapa.data_inicio_programado = moment(start).format('YYYY-MM-DD HH:mm:ss');
                    ganttProject[i].tasks[j]._end = end;
                    ganttProject[i].tasks[j].end = moment(end).format('YYYY-MM-DD');
                    ganttProject[i].tasks[j].etapa.data_fim_programado = moment(end).format('YYYY-MM-DD HH:mm:ss');
                }
            }
        }
	}
}
function changeExecucaoProjetos(this_) {
    setOptionsPro('stateExecucaoGantt', $(this_).is(':checked'));
    setProjetos('refresh');
}
function changeOrdemProjetos(this_) {
    var _this = $(this_);
    var value = _this.val();
    setOptionsPro('stateOrderGantt', value);
    setProjetos('refresh');
}
function changeVisualProjetos(this_) {
    var stateVisualGantt = $(this_).is(':checked');
    $.each(ganttProject, function (index, value) {
        var permiteEdicao = checkPermissionProjeto(valueProjeto(ganttProject[index].options.id_projeto));
        var editTask = stateVisualGantt && permiteEdicao ? true : false;
            ganttProject[index].options.edit_task = editTask;
            ganttProject[index].hide_popup();
            ganttProject[index].refresh(ganttProject[index].tasks);
    });
    setOptionsPro('stateVisualGantt', stateVisualGantt);
}
function scrollProjetoGanttToFirstBar() {
    for (i = 0; i < ganttProject.length; i++) {
        var scrollLeft = ganttProject[i].bars[0].x-20;
        var windowDiv = $('#'+ganttProject[i].$svg.id).closest('.gantt-container');
            windowDiv.animate({scrollLeft: scrollLeft}, 500);
    }
}
function showProjetoDetalhe(this_) {
    var _this = $(this_);
        _this.closest('table').find('.detalheBox').toggle();
    if ( _this.find('i').hasClass('fa-plus-circle') ) {
        _this.find('i').attr('class','fas cinzaColor fa-minus-circle');
    } else {
        _this.find('i').attr('class','fas cinzaColor fa-plus-circle');
    }
}
function getOptionsTiposProjetos(val_selected = false, arrayProjetos = arrayConfigAtividades.projetos) {
    var arrayTiposProjetos = uniqPro(jmespath.search(arrayProjetos, "[*].id_tipo_projeto")); 
    var optionSelectTipoProjeto = ( arrayTiposProjetos.length > 0 ) 
        ? 
            $.map(arrayTiposProjetos, function(v){ 
                var selected = (val_selected && val_selected == v) ? 'selected' : '';
                var tipo_projeto = jmespath.search(arrayConfigAtividades.tipos_projetos, "[?id_tipo_projeto==`"+v+"`] | [0].tipo_projeto");
                    tipo_projeto = tipo_projeto === null ? '' : tipo_projeto;
                return '<option '+selected+' value="'+v+'">'+tipo_projeto+'</option>';
            }).join('') 
        : '';
    return '<option>&nbsp;</option>'+optionSelectTipoProjeto;
}
function saveProjeto(this_, arrayProjetos = arrayConfigAtividades.projetos) {
    var _this = $(this_);
    var data = _this.data();
    var id_projeto = typeof data !== 'undefined' ? data.id_projeto : undefined;
        id_projeto = typeof id_projeto !== 'undefined' ? id_projeto : 0;
    var value = valueProjeto(id_projeto);
    if (checkPermissionProjeto(value) || id_projeto == 0) {
        var textLabel = (id_projeto == 0) ? 'Inserir Novo' : 'Editar';
        var optionProcessos = $.map(getProcessoUnidadePro(false, true),function(v){
                                    return '<option data-id_procedimento="'+v.id_procedimento+'" value="'+v.processo_sei+'">'+v.especificacao+' ('+v.processo_sei+')</option>';
                                }).join('');

        var htmlBox =  '<div id="boxProjeto" class="atividadeWork" data-projeto="'+(value && value.id_projeto ? value.id_projeto : 0)+'">'+
                    '   <table style="font-size: 10pt;width: 100%;" class="seiProForm">'+
                    '      <tr>'+
                    '          <td style="vertical-align: bottom; text-align: left;" class="label">'+
                    '               <label for="proj_nome_projeto"><i class="iconPopup iconSwitch fas fa-tasks cinzaColor"></i>Nome do Projeto:</label>'+
                    '           </td>'+
                    '           <td class="required" colspan="3">'+
                    '               <input type="text" data-key="nome_projeto" id="proj_nome_projeto" class="data_extract" value="'+(value && value.nome_projeto ? value.nome_projeto : '')+'" required>'+
                    '           </td>'+
                    '      </tr>'+
                    '      <tr>'+
                    '           <td style="vertical-align: bottom; text-align: left;" class="label">'+
                    '               <label for="proj_processo_sei"><i class="iconPopup iconSwitch fas fa-folder-open cinzaColor" style="float: initial;"></i>Processo SEI:</label>'+
                    '           </td>'+
                    '           <td style="text-align: left;width: 200px; max-width: 250px;">'+
                    '               <select id="proj_select_processo_sei" style="font-size: 1em; max-width: 250px;" onchange="changeProjetoProcesso(this)"><option>&nbsp;</option>'+optionProcessos+'<option value="0">:: OUTRO PROCESSO ::</option></select>'+
                    '               <input type="text" style="display:none" id="proj_processo_sei" maxlength="255" onchange="changeProtocoloBoxAtiv(this)" data-key="processo_sei" value="'+(value && value.processo_sei ? value.processo_sei : '' )+'">'+
                    '               <input type="hidden" id="proj_id_procedimento" data-key="id_procedimento" data-param="id_procedimento" value="'+(value && value.id_procedimento ? value.id_procedimento : '' )+'">'+
                    '           </td>'+
                    '           <td style="vertical-align: bottom; text-align: left;" class="label">'+
                    '               <label class="last" for="proj_id_tipo_projeto"><i class="iconPopup iconSwitch fas fa-flag-checkered cinzaColor" style="float: initial;"></i>Tipo do Projeto:</label>'+
                    '           </td>'+
                    '           <td style="text-align: left;">'+
                    '               <select class="data_extract" style="font-size: 1em;" data-key="id_tipo_projeto" onchange="addNewItemSelect(this)" id="proj_id_tipo_projeto">'+getOptionsTiposProjetos(value && value.id_tipo_projeto ? value.id_tipo_projeto : false)+'<option value="0">:: NOVO ITEM ::</option></select>'+
                    '           </td>'+
                    '      </tr>'+
                    '   </table>'+
                    '</div>';

        var textButton = value && value.ativo ? ['Arquivar', 'ui-icon-arrowthickstop-1-s'] : ['Reativar', 'ui-icon-arrowthickstop-1-n'];
        var btnDialogBoxPro = ( id_projeto == 0 ) 
                ? [{
                        text: 'Inserir Projeto',
                        icon: 'ui-icon-disk',
                        class: 'confirm',
                        click: function() {
                            saveProjetoSend(this, 'save');
                        }
                    }]
                : [{
                        text: 'Editar Projeto',
                        class: 'confirm',
                        icon: 'ui-icon-pencil',
                        click: function() {
                            saveProjetoSend(this, 'edit');
                        }
                    }];

                    if (checkCapacidade('archive_projeto') && id_projeto > 0 && checkPermissionProjeto(value)) {
                        btnDialogBoxPro.unshift({
                            text: textButton[0],
                            icon: textButton[1],
                            click: function() {
                                archiveProjeto(id_projeto, textButton[0]);
                            }
                        });
                    }
                    if (checkCapacidade('clone_projeto') && id_projeto > 0 && checkPermissionProjeto(value) && value && value.ativo) {
                        btnDialogBoxPro.unshift({
                            text: 'Duplicar',
                            icon: 'ui-icon-copy',
                            click: function() {
                                cloneProjeto(id_projeto);
                            }
                        });
                    }
                    if (checkCapacidade('delete_projeto') && id_projeto > 0 && checkPermissionProjeto(value) && value && !value.ativo) {
                        btnDialogBoxPro.unshift({
                            text: 'Deletar',
                            icon: 'ui-icon-trash',
                            click: function() {
                                deleteProjeto(id_projeto);
                            }
                        });
                    }
        
        resetDialogBoxPro('dialogBoxPro');
        dialogBoxPro = $('#dialogBoxPro')
            .html('<div class="dialogBoxDiv">'+htmlBox+'</span>')
            .dialog({
                title: textLabel+" Projeto",
                width: 780,
                open: function() { 
                    updateButtonConfirm(this, true);
                    prepareFieldsReplace(this);
                },
                buttons: btnDialogBoxPro
        });
    }
}
function saveEtapa(this_, arrayProjetos = arrayConfigAtividades.projetos) {
    var _this = $(this_);
    var data = _this.data();
    var id_projeto = typeof data !== 'undefined' ? data.id_projeto : undefined;
        id_projeto = typeof id_projeto !== 'undefined' ? id_projeto : 0;
    var valueP = valueProjeto(id_projeto);

    if (checkPermissionProjeto(valueP)) {
        var id_etapa = typeof data !== 'undefined' ? data.id_etapa : undefined;
            id_etapa = typeof id_etapa !== 'undefined' ? id_etapa : 0;
        var value = valueEtapa(id_projeto, id_etapa);
        var textLabel = (id_etapa == 0) ? 'Inserir Nova' : 'Editar';
        var projeto_processo_sei = valueP && valueP.processo_sei ? valueP.processo_sei : '';
        var projeto_id_procedimento = valueP && valueP.id_procedimento ? valueP.id_procedimento : '';

        var optionSelectResponsavel = (taskSelect && taskSelect.responsavel.length > 0 ) ? $.map(taskSelect.responsavel, function(v){ return ( value.responsavel == v ) ? '<option selected>'+v+'</option>' : '<option>'+v+'</option>' }).join('') : '';
        var optionSelectMacroetapa = (taskSelect && taskSelect.macroetapa.length > 0 ) ? $.map(taskSelect.macroetapa, function(v){ return ( value.macroetapa == v ) ? '<option selected>'+v+'</option>' : '<option>'+v+'</option>' }).join('') : '';
        var optionSelectGrupo = (taskSelect && taskSelect.grupo.length > 0 ) ? $.map(taskSelect.grupo, function(v){ return ( value.grupo == v ) ? '<option selected>'+v+'</option>' : '<option>'+v+'</option>' }).join('') : '';
        var optionSelectDependencies = $.map(valueP.etapas, function(v){ if (v.id_etapa != value.id_etapa) { return ( value && value.id_dependencia == v.id_etapa ) ? '<option selected value="'+v.id_etapa+'">'+v.nome_etapa+'</option>' : '<option value="'+v.id_etapa+'">'+v.nome_etapa+'</option>' } }).join('');

        var htmlSelectResponsavel = '<select id="proj_responsavel" onchange="addNewItemSelect(this)" data-key="responsavel"><option>&nbsp;</option><option value="0">:: NOVO ITEM ::</option>'+optionSelectResponsavel+'</select>';
        var htmlSelectMacroetapa = '<select id="proj_macroetapa" onchange="addNewItemSelect(this)" data-key="macroetapa"><option>&nbsp;</option><option value="0">:: NOVO ITEM ::</option>'+optionSelectMacroetapa+'</select>';
        var htmlSelectDependencies = '<select id="proj_dependencia" data-key="id_dependencia"><option>&nbsp;</option>'+optionSelectDependencies+'</select>';
        var htmlSelectGrupo = '<select id="proj_grupo" onchange="addNewItemSelect(this)" data-key="grupo"><option>&nbsp;</option><option value="0">:: NOVO ITEM ::</option>'+optionSelectGrupo+'</select>';

        var dataInicio = value && value.data_inicio_programado ? moment(value.data_inicio_programado,'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DDTHH:mm') : moment().format('YYYY-MM-DDTHH:mm');
        var dataFim = value && value.data_fim_programado ? moment(value.data_fim_programado,'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DDTHH:mm') : moment().add(1,'months').format('YYYY-MM-DDTHH:mm');
        var optionSelectAtividade = typeof arrayAtividadesPro !== 'undefined' && arrayAtividadesPro && arrayAtividadesPro != 0 && arrayAtividadesPro.length
                                    ?   $.map(arrayAtividadesPro, function(v){ 
                                            return (id_etapa > 0 && $.inArray(v.id_demanda.toString(), value.id_demandas) !== -1 ? '' : '<option value="'+v.id_demanda+'">'+getTitleDialogBox(v)+'</option>')
                                        }).join('') 
                                    :   '';
            optionSelectAtividade = (id_etapa > 0 && typeof value.id_demandas_titles !== 'undefined' && value.id_demandas_titles.length) 
                                    ?   $.map(value.id_demandas_titles, function(v){ 
                                            return '<option value="'+v.id_demanda+'" selected>'+getTitleDialogBox(v)+'</option>'
                                        }).join('')+optionSelectAtividade
                                    : optionSelectAtividade;

        var htmlBox =   '<div id="boxProjeto" class="atividadeWork" data-projeto="'+id_projeto+'" data-etapa="'+id_etapa+'">'+
                        '   <table style="font-size: 10pt;width: 100%;" class="seiProForm">'+
                        '      <tr>'+
                        '          <td style="vertical-align: bottom; text-align: left;" class="label">'+
                        '               <label for="proj_nome_etapa"><i class="iconPopup iconSwitch fas fa-bars cinzaColor"></i>Nome da Etapa:</label>'+
                        '           </td>'+
                        '           <td class="required" style="width: 250px;">'+
                        '               <input type="text" id="proj_nome_etapa" maxlength="255" onchange="checkThisAtivRequiredFields(this)" data-key="nome_etapa" value="'+(value && value.nome_etapa ? value.nome_etapa : '' )+'" required>'+
                        '           </td>'+
                        '           <td style="vertical-align: bottom;" class="label">'+
                        '               <label class="last" for="proj_dependencia"><i class="iconPopup iconSwitch fas fa-retweet cinzaColor" style="float: initial;"></i>Depend\u00EAncia:</label>'+
                        '           </td>'+
                        '           <td style="width: 250px;">'+
                        '               '+htmlSelectDependencies+
                        '           </td>'+
                        '      </tr>'+
                        '      <tr>'+
                        '          <td style="vertical-align: bottom; text-align: left;" class="label">'+
                        '               <label for="proj_data_inicio_programado"><i class="iconPopup iconSwitch fas fa-clock cinzaColor"></i>In\u00EDcio da Etapa (programado):</label>'+
                        '           </td>'+
                        '           <td class="required date">'+
                        '               <input type="datetime-local" id="proj_data_inicio_programado" onchange="updateDatesRange(this);checkThisAtivRequiredFields(this)" data-range="inicio" data-key="data_inicio_programado" value="'+dataInicio+'" max="'+dataFim+'" required>'+
                        '           </td>'+
                        '           <td style="vertical-align: bottom;" class="label">'+
                        '               <label class="last" for="proj_data_fim_programado"><i class="iconPopup iconSwitch fas fa-clock cinzaColor" style="float: initial;"></i>Fim da Etapa (programado):</label>'+
                        '           </td>'+
                        '           <td class="required date">'+
                        '               <input type="datetime-local" id="proj_data_fim_programado" onchange="updateDatesRange(this);checkThisAtivRequiredFields(this)" data-range="fim" data-key="data_fim_programado" min="'+dataInicio+'" value="'+dataFim+'" required>'+
                        '           </td>'+
                        '      </tr>'+
                        (value.data_fim_execucao == '0000-00-00 00:00:00' || id_etapa == 0  ?
                        '      <tr>'+
                        '          <td style="vertical-align: bottom; text-align: left;" class="label">'+
                        '               <label for="proj_id_demandas"><i class="iconPopup iconSwitch fas fa-check-circle cinzaColor"></i>Demanda Vinculada:</label>'+
                        '           </td>'+
                        '           <td colspan="3" style="text-align:left;">'+
                        '               <select id="proj_id_demandas" onchange="getSelectedItemBox(this)" data-placeholder="Selecione uma ou mais demandas de vincula\u00E7\u00E3o (opcional)" multiple="multiple" data-key="id_demandas"><option>&nbsp;</option>'+optionSelectAtividade+'</select>'+
                        '           </td>'+
                        '      </tr>'+
                        '' : '')+
                        '      <tr id="previewItemAtividade" style="display:none;">'+
                        '           <td colspan="2">'+
                        '               <div class="preview_atividade" style="padding: 20px;background-color: #f4f5f5;border-radius: 5px;margin-top: 10px;"></div>'+
                        '           </td>'+
                        '      </tr>'+
                        '      <tr style="height: 20px;"><td colspan="4"></td></tr>'+
                        '      <tr style="height: 10px;" class="hrForm">'+
                        '        <td colspan="4">'+
                        '            <a class="newLink newLink_active" style="font-size: 10pt;cursor: pointer;margin: -12px 0 0 0;float: right; background-color: #fff;" onclick="showProjetoDetalhe(this)">'+
                        '                <i class="fas cinzaColor fa-plus-circle"></i> Op\u00E7\u00F5es'+
                        '            </a>'+
                        '        </td>'+
                        '      </tr>'+
                        '      <tr class="detalheBox" style="display:none">'+
                        '          <td style="vertical-align: bottom; text-align: left;" class="label">'+
                        '               <label for="proj_responsavel"><i class="iconPopup iconSwitch fas fa-user-tie cinzaColor"></i>Respons\u00E1vel:</label>'+
                        '           </td>'+
                        '           <td>'+
                        '               '+htmlSelectResponsavel+
                        '           </td>'+
                        '           <td style="vertical-align: bottom;" class="label">'+
                        '               <label class="last" for="proj_observacoes"><i class="iconPopup iconSwitch fas fa-comment-alt cinzaColor" style="float: initial;"></i>Observa\u00E7\u00F5es:</label>'+
                        '           </td>'+
                        '           <td>'+
                        '               <input type="text" id="proj_observacoes" maxlength="255" data-key="observacoes" value="'+(value && value.observacoes ? value.observacoes : '' )+'">'+
                        '           </td>'+
                        '      </tr>'+
                        '      <tr class="detalheBox" style="display:none">'+
                        '          <td style="vertical-align: bottom; text-align: left;" class="label">'+
                        '               <label for="proj_macroetapa"><i class="iconPopup iconSwitch fas fa-layer-group cinzaColor"></i>Macroetapa:</label>'+
                        '           </td>'+
                        '           <td>'+
                        '               '+htmlSelectMacroetapa+
                        '           </td>'+
                        '           <td style="vertical-align: bottom;" class="label">'+
                        '               <label class="last" for="proj_grupo"><i class="iconPopup iconSwitch fas fa-object-group cinzaColor" style="float: initial;"></i>Grupo:</label>'+
                        '           </td>'+
                        '           <td>'+
                        '               '+htmlSelectGrupo+
                        '           </td>'+
                        '      </tr>'+
                        '      <tr class="detalheBox" style="display:none">'+
                        '          <td style="vertical-align: bottom; text-align: left;" class="label">'+
                        '               <label for="proj_etiqueta"><i class="iconPopup iconSwitch fas fa-tags cinzaColor"></i>Etiqueta:</label>'+
                        '           </td>'+
                        '           <td>'+
                        '               <input type="text" id="proj_etiqueta" data-key="etiqueta" value="'+(value && value.etiqueta ? value.etiqueta : '' )+'">'+
                        '           </td>'+
                        '           <td style="vertical-align: bottom;" class="label">'+
                        '               <label class="last" for="proj_processo_sei"><i class="iconPopup iconSwitch fas fa-folder-open cinzaColor" style="float: initial;"></i>Processo SEI:</label>'+
                        '           </td>'+
                        '           <td>'+
                        '               <input type="text" id="proj_processo_sei" maxlength="255" onchange="changeProtocoloBoxAtiv(this)" data-key="processo_sei" value="'+(value && value.processo_sei ? value.processo_sei : (id_etapa == 0 ? projeto_processo_sei : '') )+'">'+
                        '               <input type="hidden" id="proj_id_procedimento" data-key="id_procedimento" data-param="id_procedimento" value="'+(value && value.id_procedimento ? value.id_procedimento : (id_etapa == 0 ? projeto_id_procedimento : '') )+'">'+
                        '           </td>'+
                        '      </tr>'+
                        '   </table>'+
                        '</div>';

        var btnDialogBoxPro = (id_etapa == 0) 
                ? [{
                        text: 'Inserir Etapa',
                        icon: 'ui-icon-disk',
                        class: 'confirm',
                        click: function() {
                            if (checkAtivRequiredFields($('#proj_nome_etapa')[0], 'mark')) {
                                saveEtapaSend(this, 'save');
                            }
                        }
                    }]
                : [{
                        text: 'Editar Etapa',
                        class: 'confirm',
                        icon: 'ui-icon-pencil',
                        click: function() {
                            saveEtapaSend(this, 'edit');
                        }
                    }];

            if (checkCapacidade('delete_projeto_etapa') && id_etapa != 0) {
                btnDialogBoxPro.unshift({
                    text: 'Deletar etapa',
                    icon: 'ui-icon-trash',
                    click: function() {
                        deleteProjetoEtapa(this);
                    }
                });
            }

        resetDialogBoxPro('dialogBoxPro');
        dialogBoxPro = $('#dialogBoxPro')
            .html('<div class="dialogBoxDiv">'+htmlBox+'</span>')
            .dialog({
                title: textLabel+" Etapa",
                width: 830,
                open: function() { 
                    // updateButtonConfirm(this, true);
                    prepareFieldsReplace(this);
                    $('#proj_etiqueta').tagsInput({
                        interactive: true,
                        placeholder: 'Adicionar',
                        hide: true,
                        delimiter: [','],
                        unique: true,
                        removeWithBackspace: true,
                    });
                    $('#proj_id_demandas').chosen("destroy").chosen({
                        placeholder_text_single: 'Selecione uma ou mais demandas de vincula\u00E7\u00E3o (opcional)',
                        no_results_text: 'Nenhum resultado encontrado'
                    });
                },
                buttons: btnDialogBoxPro
        });
    }
}
function showExecucaoEtapa(this_) {
    $(this_).closest('span').hide();
    $(this_).closest('td').find('.span_data_inicio_execucao').show();
}
function setExecucaoEtapa(this_) {
    var _this = $(this_);
    var _parent = _this.closest('td');
    var data = _this.data();
    var id_projeto = typeof data !== 'undefined' ? data.id_projeto : undefined;
        id_projeto = typeof id_projeto !== 'undefined' ? id_projeto : 0;
    if (checkPermissionProjeto(valueProjeto(id_projeto))) {
        var id_etapa = typeof data !== 'undefined' ? data.id_etapa : undefined;
            id_etapa = typeof id_etapa !== 'undefined' ? id_etapa : 0;
        var data_inicio_execucao = _parent.find('[data-key="data_inicio_execucao"]').val();
            data_inicio_execucao = typeof data_inicio_execucao !== 'undefined' ? moment(data_inicio_execucao,'YYYY-MM-DDTHH:mm').format('YYYY-MM-DD HH:mm:ss') : false;
        if (id_projeto && id_etapa && data_inicio_execucao) {
            var action = 'update_projeto_etapa';
            var param = {
                action: action, 
                mode: 'data_inicio_execucao',
                id_projeto: id_projeto,
                id_etapa: id_etapa,
                data_inicio_execucao: data_inicio_execucao
            };
            getServerAtividades(param, action);
            _this.find('i').attr('class','fas fa-spinner fa-spin cinzaColor');
        }
    }
}
function saveEtapaSend(this_, mode) {
    var _parent = $(this_);
    var id_projeto = _parent.find('#boxProjeto').data('projeto');
    if (checkPermissionProjeto(valueProjeto(id_projeto))) {
        var id_etapa = _parent.find('#boxProjeto').data('etapa');
        var nome_etapa = _parent.find('[data-key="nome_etapa"]').val();
            nome_etapa = typeof nome_etapa !== 'undefined' && nome_etapa.trim() != '' ? nome_etapa : false;
        var id_dependencia = _parent.find('[data-key="id_dependencia"]').val();
            id_dependencia = (id_dependencia.trim() == '') ? false : id_dependencia;
        var data_inicio_programado = _parent.find('[data-key="data_inicio_programado"]').val();
            data_inicio_programado = typeof data_inicio_programado !== 'undefined' ? moment(data_inicio_programado,'YYYY-MM-DDTHH:mm').format('YYYY-MM-DD HH:mm:ss') : false;
        var data_fim_programado = _parent.find('[data-key="data_fim_programado"]').val();
            data_fim_programado = typeof data_fim_programado !== 'undefined' ? moment(data_fim_programado,'YYYY-MM-DDTHH:mm').format('YYYY-MM-DD HH:mm:ss') : false;
        var responsavel = _parent.find('[data-key="responsavel"]').val();
            responsavel = (responsavel.trim() == '') ? false : responsavel;
        var observacoes = _parent.find('[data-key="observacoes"]').val();
            observacoes = (observacoes.trim() == '') ? false : observacoes;
        var macroetapa = _parent.find('[data-key="macroetapa"]').val();
            macroetapa = (macroetapa.trim() == '') ? false : macroetapa;
        var grupo = _parent.find('[data-key="grupo"]').val();
            grupo = (grupo.trim() == '') ? false : grupo;
        var etiqueta = _parent.find('[data-key="etiqueta"]').val();
            etiqueta = (etiqueta.trim() == '') ? false : etiqueta;
        var processo_sei = _parent.find('[data-key="processo_sei"]').val();
            processo_sei = (processo_sei.trim() == '') ? false : processo_sei;
        var id_procedimento = _parent.find('[data-key="id_procedimento"]').val();
            id_procedimento = (id_procedimento.trim() == '') ? false : id_procedimento;
        var id_demandas = _parent.find('[data-key="id_demandas"]').val();
            id_demandas = ($.isArray(id_demandas) &&  id_demandas.length) ? id_demandas : false;
        
        var action = (mode == 'save') ? 'save_projeto_etapa' : 'edit_projeto_etapa';
        var param = {
            action: action, 
            id_projeto: parseInt(id_projeto),
            id_etapa: parseInt(id_etapa),
            nome_etapa: nome_etapa,
            id_dependencia: id_dependencia,
            data_inicio_programado: data_inicio_programado,
            data_fim_programado: data_fim_programado,
            responsavel: responsavel,
            observacoes: observacoes,
            macroetapa: macroetapa,
            grupo: grupo,
            etiqueta: etiqueta,
            processo_sei: processo_sei,
            id_procedimento: id_procedimento,
            id_demandas: JSON.stringify(id_demandas)
        };
        if (id_projeto && nome_etapa && data_inicio_programado && data_fim_programado) getServerAtividades(param, action);
    }
}
function deleteProjetoEtapa(this_) {
    var _parent = $(this_);
    var id_projeto = _parent.find('#boxProjeto').data('projeto');
    if (checkPermissionProjeto(valueProjeto(id_projeto))) {
        confirmaFraseBoxPro('Tem certeza que deseja <b style="font-weight: bold;">DELETAR</b> a etapa?', 'SIM', 
        function(){
            var id_etapa = _parent.find('#boxProjeto').data('etapa');
            var action = 'delete_projeto_etapa';
            var param = {
                action: action, 
                id_projeto: parseInt(id_projeto),
                id_etapa: parseInt(id_etapa)
            };
            if (id_projeto && id_etapa) getServerAtividades(param, action);
        });
    }
}
function cloneProjeto(id_projeto) {
    if (checkPermissionProjeto(valueProjeto(id_projeto))) {
        confirmaFraseBoxPro('Tem certeza que deseja <b style="font-weight: bold;">DUPLICAR</b> o projeto?', 'SIM', 
        function(){
            var action = 'clone_projeto';
            var param = {
                action: action, 
                id_projeto: id_projeto
            };
            getServerAtividades(param, action);
            resetDialogBoxPro('dialogBoxPro');
        });
    }
}
function deleteProjeto(id_projeto) {
    if (checkPermissionProjeto(valueProjeto(id_projeto))) {
        confirmaFraseBoxPro('Tem certeza que deseja <b style="font-weight: bold;">DELETAR</b> o projeto?', 'SIM', 
        function(){
            var action = 'delete_projeto';
            var param = {
                action: action, 
                id_projeto: id_projeto
            };
            getServerAtividades(param, action);
            resetDialogBoxPro('dialogBoxPro');
        });
    }
}
function archiveProjeto(id_projeto, textButton) {
    if (checkPermissionProjeto(valueProjeto(id_projeto))) {
        confirmaFraseBoxPro('Tem certeza que deseja <b style="font-weight: bold;">'+textButton.toUpperCase()+'</b> o projeto?', 'SIM', 
        function(){
            var action = 'archive_projeto';
            var param = {
                action: action, 
                mode: textButton,
                id_projeto: id_projeto
            };
            getServerAtividades(param, action);
            resetDialogBoxPro('dialogBoxPro');
        });
    }
}
function saveProjetoSend(this_, mode) {
    var _parent = $(this_);
    var id_projeto = _parent.find('#boxProjeto').data('projeto');
    if (checkPermissionProjeto(valueProjeto(id_projeto)) || id_projeto == 0) {
        var nome_projeto = _parent.find('[data-key="nome_projeto"]').val();
        var id_tipo_projeto = _parent.find('[data-key="id_tipo_projeto"]').val();
            id_tipo_projeto = (id_tipo_projeto.trim() == '' || !isNumeric(id_tipo_projeto)) ? 0 : id_tipo_projeto;
        var nome_tipo_projeto = _parent.find('[data-key="id_tipo_projeto"] option:selected').text();
            nome_tipo_projeto = (nome_tipo_projeto.trim() == '') ? 0 : nome_tipo_projeto;
        var processo_sei = _parent.find('[data-key="processo_sei"]').val();
            processo_sei = (processo_sei.trim() == '') ? false : processo_sei;
        var id_procedimento = _parent.find('[data-key="id_procedimento"]').val();
            id_procedimento = (id_procedimento.trim() == '') ? false : id_procedimento;

        var action = (mode == 'save') ? 'save_projeto' : 'edit_projeto';
        var param = {
            action: action, 
            nome_projeto: nome_projeto,
            id_projeto: id_projeto,
            nome_tipo_projeto: nome_tipo_projeto,
            processo_sei: processo_sei,
            id_procedimento: id_procedimento,
            id_tipo_projeto: parseInt(id_tipo_projeto)
        };
        getServerAtividades(param, action);
    }
}
function completeEtapa(this_, arrayProjetos = arrayConfigAtividades.projetos) {
    var _this = $(this_);
    var data = _this.data();
    var id_projeto = typeof data !== 'undefined' ? data.id_projeto : undefined;
        id_projeto = typeof id_projeto !== 'undefined' ? id_projeto : 0;
    if (checkPermissionProjeto(valueProjeto(id_projeto))) {
        var id_etapa = typeof data !== 'undefined' ? data.id_etapa : undefined;
            id_etapa = typeof id_etapa !== 'undefined' ? id_etapa : 0;
        var value = valueEtapa(id_projeto, id_etapa);

        var dataInicio = value && value.data_inicio_execucao && value.data_inicio_execucao != '0000-00-00 00:00:00' ? moment(value.data_inicio_execucao,'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DDTHH:mm') : moment().format('YYYY-MM-DDTHH:mm');
        var dataFim = value && value.data_fim_execucao && value.data_fim_execucao != '0000-00-00 00:00:00' ? moment(value.data_fim_execucao,'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DDTHH:mm') : moment().add(1,'months').format('YYYY-MM-DDTHH:mm');
        var htmlSelectDocSEI = '<select id="proj_documento_relacionado" onchange="changeDocumentoRelacionado(this)" data-key="documento_relacionado"><option>&nbsp;</option></select>';

        var htmlBox =   '<div id="boxProjeto" class="atividadeWork" data-projeto="'+id_projeto+'" data-etapa="'+id_etapa+'">'+
                        '   <table style="font-size: 10pt;width: 100%;" class="seiProForm">'+
                        '      <tr>'+
                        '          <td style="vertical-align: bottom;text-align: left;width: 160px;" class="label">'+
                        '               <label for="proj_data_inicio_execucao"><i class="iconPopup iconSwitch fas fa-hourglass-start cinzaColor"></i>In\u00EDcio da Execu\u00E7\u00E3o:</label>'+
                        '           </td>'+
                        '           <td class="required date">'+
                        '               <input type="datetime-local" id="proj_data_inicio_execucao" onchange="updateDatesRange(this);checkThisAtivRequiredFields(this)" data-range="inicio" data-key="data_inicio_execucao" value="'+dataInicio+'" max="'+dataFim+'" required>'+
                        '           </td>'+
                        '      </tr>'+
                        '      <tr>'+
                        '          <td style="vertical-align: bottom; text-align: left;" class="label">'+
                        '               <label for="proj_data_fim_execucao"><i class="iconPopup iconSwitch fas fa-hourglass-end cinzaColor" style="float: initial;"></i>Fim da Execu\u00E7\u00E3o:</label>'+
                        '           </td>'+
                        '           <td class="required date">'+
                        '               <input type="datetime-local" id="proj_data_fim_execucao" onchange="updateDatesRange(this);checkThisAtivRequiredFields(this)" data-range="fim" data-key="data_fim_execucao" min="'+dataInicio+'" value="'+dataFim+'" required>'+
                        '           </td>'+
                        '      </tr>'+
                        '      <tr>'+
                        '          <td style="vertical-align: bottom; text-align: left;" class="label">'+
                        '               <label for="proj_documento_relacionado"><i class="iconPopup iconSwitch fas fa-file-alt cinzaColor"></i>Documento Relacionado:</label>'+
                        '           </td>'+
                        '           <td>'+
                        '               '+htmlSelectDocSEI+
                        '               <input type="hidden" id="proj_id_documento_sei" data-key="id_documento_sei" value="'+(value.id_documento_sei ? value.id_documento_sei : 0)+'">'+
                        '               <input type="hidden" id="proj_documento_sei" data-key="documento_sei" value="'+(value.documento_sei ? value.documento_sei : 0)+'">'+
                        '           </td>'+
                        '      </tr>'+
                        '   </table>'+
                        '</div>';

        var btnDialogBoxPro = [{
                        text: 'Concluir Etapa',
                        class: 'confirm',
                        icon: 'ui-icon-pencil',
                        click: function() {
                            if (checkAtivRequiredFields($('#proj_data_inicio_execucao')[0], 'mark')) {
                                completeEtapaSend(this);
                            }
                        }
                    }];

        resetDialogBoxPro('dialogBoxPro');
        dialogBoxPro = $('#dialogBoxPro')
            .html('<div class="dialogBoxDiv">'+htmlBox+'</span>')
            .dialog({
                title: "Concluir Etapa",
                width: 550,
                open: function() { 
                    updateButtonConfirm(this, true);
                    prepareFieldsReplace(this);
                    if (typeof value.id_procedimento !== 'undefined' && value.id_procedimento) {
                        $("#proj_documento_relacionado").empty().append($('<option>Carrengando documentos...<option/>')).chosen("destroy").chosen({placeholder_text_single: ' ', no_results_text: 'Nenhum resultado encontrado' });
                        $('#proj_documento_relacionado_chosen').addClass('chosenLoading');
                        getDadosIframeProcessoPro(String(value.id_procedimento), 'projeto');
                    }
                },
                buttons: btnDialogBoxPro
        });
    }
}
function completeEtapaSend(this_) {
    var _parent = $(this_);
    var id_projeto = _parent.find('#boxProjeto').data('projeto');
    if (checkPermissionProjeto(valueProjeto(id_projeto))) {
        var id_etapa = _parent.find('#boxProjeto').data('etapa');
        var data_inicio_execucao = _parent.find('[data-key="data_inicio_execucao"]').val();
            data_inicio_execucao = typeof data_inicio_execucao !== 'undefined' ? moment(data_inicio_execucao,'YYYY-MM-DDTHH:mm').format('YYYY-MM-DD HH:mm:ss') : false;
        var data_fim_execucao = _parent.find('[data-key="data_fim_execucao"]').val();
            data_fim_execucao = typeof data_fim_execucao !== 'undefined' ? moment(data_fim_execucao,'YYYY-MM-DDTHH:mm').format('YYYY-MM-DD HH:mm:ss') : false;
        var documento_relacionado = _parent.find('[data-key="documento_relacionado"]').val();
            documento_relacionado = (documento_relacionado.trim() == '') ? false : documento_relacionado;
        var documento_sei = _parent.find('[data-key="documento_sei"]').val();
            documento_sei = (parseInt(documento_sei) > 0) ? documento_sei : false;
        var id_documento_sei = _parent.find('[data-key="id_documento_sei"]').val();
            id_documento_sei = (parseInt(id_documento_sei) > 0) ? id_documento_sei : false;

        var action = 'update_projeto_etapa';
        var param = {
            action: action, 
            mode: 'complete_execucao',
            id_projeto: id_projeto,
            id_etapa: id_etapa,
            data_inicio_execucao: data_inicio_execucao,
            data_fim_execucao: data_fim_execucao,
            documento_relacionado: documento_relacionado,
            documento_sei: documento_sei,
            id_documento_sei: id_documento_sei
        };
        getServerAtividades(param, action);
    }
}
function cancelCompleteEtapa(this_) {
    var _this = $(this_);
    var data = _this.data();
    var id_projeto = typeof data !== 'undefined' ? data.id_projeto : undefined;
        id_projeto = typeof id_projeto !== 'undefined' ? id_projeto : 0;
    if (checkPermissionProjeto(valueProjeto(id_projeto))) {
        confirmaFraseBoxPro('Tem certeza que deseja <b style="font-weight: bold;">CANCELAR</b> a conclus\u00E3o da etapa?', 'SIM', 
        function(){
            var id_etapa = typeof data !== 'undefined' ? data.id_etapa : undefined;
                id_etapa = typeof id_etapa !== 'undefined' ? id_etapa : 0;

            var action = 'update_projeto_etapa';
            var param = {
                action: action, 
                mode: 'cancel_complete_execucao',
                id_projeto: id_projeto,
                id_etapa: id_etapa
            };
            getServerAtividades(param, action);
        });
    }
}
function getDemandaVinculadaBox(v, full = false) {
    var value = jmespath.search(arrayAtividadesPro,"[?id_demanda==`"+v.id_demanda+"`] | [0]");
        value = value === null ? false : value;
    var nome_atividade = (v.nome_atividade && v.nome_atividade.length > 50) 
                            ? v.nome_atividade.replace(/^(.{50}[^\s]*).*/, "$1")+'...' 
                            : (v.nome_atividade ? v.nome_atividade : '');
    var assunto = (v.assunto && v.assunto.length > 50) 
                            ? v.assunto.replace(/^(.{50}[^\s]*).*/, "$1")+'...' 
                            : (v.assunto ? v.assunto : '');
    var nameAtiv = (full) 
                    ? (v.assunto ? v.assunto +' / ': '')+v.nome_atividade
                    : (assunto ? assunto : '')+(nome_atividade != '' ? ' / '+nome_atividade : '');
    var iconAtiv = (v.data_inicio == '0000-00-00 00:00:00') ? '<i class="fas fa-stop-circle cinzaColor"></i> N\u00E3o iniciada ' : '';
        iconAtiv = (v.data_inicio != '0000-00-00 00:00:00') ? '<i class="fas fa-play-circle azulColor"></i> Iniciada ' : iconAtiv;
        iconAtiv = (v.data_entrega != '0000-00-00 00:00:00') ? '<i class="fas fa-check-circle verdeColor"></i> Entregue ' : iconAtiv;
        iconAtiv = (v.data_entrega == '0000-00-00 00:00:00' && v.data_pausa != '0000-00-00 00:00:00' && v.data_retomada == '0000-00-00 00:00:00') ? '<i class="fas fa-pause-circle laranjaColor"></i> Pausada ' : iconAtiv;

    var statusAtiv = (v.data_entrega == '0000-00-00 00:00:00' && moment(v.prazo_entrega, "YYYY-MM-DD HH:mm:ss") < moment() ) ? ' (Em atraso) ' : '';

    var itensCompletosChecklist = (value && typeof value.checklist !== 'undefined' && value.checklist !== null && value.checklist.length ) ? jmespath.search(value.checklist, "[?data_fim!='0000-00-00 00:00:00'] | length(@)")  : false;
    var progressChecklist = (itensCompletosChecklist) ? (itensCompletosChecklist/value.checklist.length)*100  : false;
    var htmlProgressChecklist = (v.data_entrega == '0000-00-00 00:00:00' && progressChecklist) 
            ?   '<div class="info_checklist">'+
                '   <div class="checklist_progress ui-progressbar ui-corner-all ui-widget ui-widget-content">'+
                '       <div class="ui-progressbar-value ui-corner-left ui-widget-header" style="width: '+progressChecklist+'%;"></div>'+
                '   </div>'+
                '</div>' 
            : '';

    var displayTitle =  '<span class="type-id">#'+v.id_demanda+'</span> '+iconAtiv+statusAtiv+'<br>'+(v.nome_requisicao ? v.nome_requisicao+' - ' : '')+(v.requisicao_sei ? '('+v.requisicao_sei+') - ' : '')+(v.apelido ? v.apelido+' ' : '');
        displayTitle = (displayTitle != '') ? displayTitle+'/ '+nameAtiv : nameAtiv;
        displayTitle = displayTitle+htmlProgressChecklist;

    return displayTitle;
}
function shareProjeto(this_, arrayProjetos = arrayConfigAtividades.projetos) {
    var _this = $(this_);
    var data = _this.data();
    var id_projeto = typeof data !== 'undefined' ? data.id_projeto : undefined;
        id_projeto = typeof id_projeto !== 'undefined' ? id_projeto : 0;
    var value = valueProjeto(id_projeto);
    if (checkPermissionProjeto(value)) {

        var htmlBox =   '<div id="boxProjeto" class="atividadeWork" data-projeto="'+id_projeto+'">'+
                        '   <table style="font-size: 10pt;width: 100%;" class="seiProForm tableLine">'+
                        '      <tr>'+
                        '          <td style="vertical-align: middle; text-align: left;" class="label">'+
                        '               <label><i class="iconPopup iconSwitch fas fa-briefcase cinzaColor"></i>Unidades:</label>'+
                        '           </td>'+
                        '           <td>'+
                        '               <div class="tabelaPanelScroll" style="max-height: 200px;">'+
                        '                   <table id="shareBox_unidade" data-format="obj_mult" data-key="unidade" style="font-size: 8pt !important;width: 100%;" class="tableOptionConfig tableSortable seiProForm tableDialog tableInfo tableZebra tableFollow tableAtividades shareBoxProjeto">'+
                        '                        <thead>'+
                        '                            <tr>'+
                        '                                <th colspan="3" style="text-align: right;">'+
                        '                                    <a class="newLink addConfigItem" onclick="addConfigItem(this)" style="cursor: pointer; margin: 5px;display: inline-block;">'+
                        '                                        <i class="fas fa-plus-circle cinzaColor" style="padding-right: 3px; cursor: pointer; font-size: 12pt;"></i>'+
                        '                                        Adicionar novo item'+
                        '                                    </a>'+
                        '                                </th>'+
                        '                            </tr>'+
                        '                            <tr class="tableHeader">'+
                        '                                <th class="tituloControle">Unidade</th>'+
                        '                                <th class="tituloControle" style="width: 50px;">Pode editar</th>'+
                        '                                <th class="tituloControle" style="width: 50px;"></th>'+
                        '                            </tr>'+
                        '                        </thead>'+
                        '                        <tbody>';
        var unidade = (value.projetos_compartilhados !== null && typeof value.projetos_compartilhados !== 'undefined') ? value.projetos_compartilhados : false;
            unidade = unidade ? jmespath.search(unidade,"[?id_unidade]") : unidade;
        var unidade_len = (unidade) ? unidade.length : 0;
        if (unidade) {
            $.each(unidade, function(i, v){
                htmlBox +=  '                           <tr data-index="'+i+'" data-id="'+v.id_projeto_compartilhado+'" data-id_projeto="'+id_projeto+'" data-value="'+v.id_unidade+'" data-edicao="'+v.edicao+'" data-key="id_unidade" style="text-align: left;">'+
                            '                               <td class="" data-type="num_switch" data-key="unidade" style="padding: 0 10px;">'+unicodeToChar(v.sigla_unidade+' - '+v.nome_unidade)+'</td>'+
                            '                               <td data-key="default" data-type="switch" data-required="true" style="width: 50px; text-align: center;">'+
                            '                                  <div class="onoffswitch" style="transform: scale(0.8);">'+
                            '                                      <input type="checkbox" name="onoffswitch" data-mode="change_edicao" data-key="unidade" class="onoffswitch-checkbox switch_unidadeDefault switch_unidadeDefault_'+i+'" onchange="shareProjetoSend(this)" id="changeItemConfig_unidades_'+i+'" tabindex="0" '+(v.edicao == 1  ? 'checked' : '')+'>'+
                            '                                      <label class="onoffswitch-label" for="changeItemConfig_unidades_'+i+'"></label>'+
                            '                                  </div>'+
                            '                               </td>'+
                            '                               <td style="width: 50px; text-align: center;">'+
                            '                                    <i class="fas fa-trash-alt cinzaColor removeTrConfig" data-mode="remove_share" data-key="unidade" style="cursor: pointer;float: right;margin-right: 20px;" onclick="shareProjetoSend(this)"></i>'+
                            '                               </td>'+ 
                            '                           </tr>';
            });
        }
        htmlBox +=      '                           <tr data-index="'+unidade_len+'" data-id="new" data-id_projeto="'+id_projeto+'" data-value="" data-key="id_unidade" data-edicao="0" style="text-align: left;">'+
                        '                               <td class="editCellSelect" data-type="num" data-key="unidade" style="padding: 0 10px;"></td>'+
                        '                               <td data-key="default" data-type="switch" data-required="true" style="width: 50px; text-align: center;">'+
                        '                                  <div class="onoffswitch" style="transform: scale(0.8);">'+
                        '                                      <input type="checkbox" name="onoffswitch" data-mode="change_edicao" data-key="unidade" class="onoffswitch-checkbox switch_unidadeDefault switch_unidadeDefault_'+unidade_len+'" onchange="shareProjetoSend(this)" id="changeItemConfig_unidades_'+unidade_len+'" tabindex="0">'+
                        '                                      <label class="onoffswitch-label" for="changeItemConfig_unidades_'+unidade_len+'"></label>'+
                        '                                  </div>'+
                        '                               </td>'+
                        '                               <td style="width: 50px; text-align: center;">'+
                        '                                    <i class="fas fa-trash-alt cinzaColor removeTrConfig" data-mode="remove_share" data-key="unidade" style="cursor: pointer;float: right;margin-right: 20px;" onclick="shareProjetoSend(this)"></i>'+
                        '                               </td>'+ 
                        '                           </tr>'+
                        '                       </tbody>'+
                        '                   </table>'+
                        '                </div>'+
                        '           </td>'+
                        '      </tr>'+
                        '      <tr>'+
                        '          <td style="vertical-align: middle; text-align: left;" class="label">'+
                        '               <label><i class="iconPopup iconSwitch fas fa-users cinzaColor"></i>Usu\u00E1rios:</label>'+
                        '           </td>'+
                        '           <td>'+
                        '               <div class="tabelaPanelScroll" style="max-height: 200px;">'+
                        '                   <table id="shareBox_usuario" data-format="obj_mult" data-key="usuario" style="font-size: 8pt !important;width: 100%;" class="tableOptionConfig tableSortable seiProForm tableDialog tableInfo tableZebra tableFollow tableAtividades">'+
                        '                        <thead>'+
                        '                            <tr>'+
                        '                                <th colspan="3" style="text-align: right;">'+
                        '                                    <a class="newLink addConfigItem" onclick="addConfigItem(this)" style="cursor: pointer; margin: 5px;display: inline-block;">'+
                        '                                        <i class="fas fa-plus-circle cinzaColor" style="padding-right: 3px; cursor: pointer; font-size: 12pt;"></i>'+
                        '                                        Adicionar novo item'+
                        '                                    </a>'+
                        '                                </th>'+
                        '                            </tr>'+
                        '                            <tr class="tableHeader">'+
                        '                                <th class="tituloControle">Usu\u00E1rio</th>'+
                        '                                <th class="tituloControle" style="width: 50px;">Pode editar</th>'+
                        '                                <th class="tituloControle" style="width: 50px;"></th>'+
                        '                            </tr>'+
                        '                        </thead>'+
                        '                        <tbody>';
        var usuario = (value.projetos_compartilhados !== null && typeof value.projetos_compartilhados !== 'undefined') ? value.projetos_compartilhados : false;
            usuario = usuario ? jmespath.search(usuario,"[?id_user]") : usuario;
        var usuario_len = (usuario) ? usuario.length : 0;
        if (usuario) {
            $.each(usuario, function(i, v){
                htmlBox +=  '                           <tr data-index="'+i+'" data-id="'+v.id_projeto_compartilhado+'" data-id_projeto="'+id_projeto+'" data-value="'+v.id_user+'" data-edicao="'+v.edicao+'" data-key="id_user" style="text-align: left;">'+
                            '                               <td class="" data-type="num_switch" data-key="usuario" style="padding: 0 10px;">'+unicodeToChar(v.nome_completo)+'</td>'+
                            '                               <td data-key="default" data-type="switch" data-required="true" style="width: 50px; text-align: center;">'+
                            '                                  <div class="onoffswitch" style="transform: scale(0.8);">'+
                            '                                      <input type="checkbox" name="onoffswitch" data-mode="change_edicao" data-key="usuario" class="onoffswitch-checkbox switch_usuarioDefault switch_usuarioDefault_'+i+'" onchange="shareProjetoSend(this)" id="changeItemConfig_usuarios_'+i+'" tabindex="0" '+(v.edicao == 1  ? 'checked' : '')+'>'+
                            '                                      <label class="onoffswitch-label" for="changeItemConfig_usuarios_'+i+'"></label>'+
                            '                                  </div>'+
                            '                               </td>'+
                            '                               <td style="width: 50px; text-align: center;">'+
                            '                                    <i class="fas fa-trash-alt cinzaColor removeTrConfig" data-mode="remove_share" data-key="usuario" style="cursor: pointer;float: right;margin-right: 20px;" onclick="shareProjetoSend(this)"></i>'+
                            '                               </td>'+ 
                            '                           </tr>';
            });
        }
        htmlBox +=      '                            <tr data-index="'+usuario_len+'" data-id="new" data-id_projeto="'+id_projeto+'" data-value="" data-key="id_user" data-edicao="0" style="text-align: left;">'+
                        '                                <td class="editCellSelect" data-type="num" data-key="usuario" style="padding: 0 10px;"></td>'+
                        '                                <td data-key="default" data-type="switch" data-required="true" style="width: 50px; text-align: center;">'+
                        '                                   <div class="onoffswitch" style="transform: scale(0.8);">'+
                        '                                       <input type="checkbox" name="onoffswitch" data-mode="change_edicao" data-key="usuario" class="onoffswitch-checkbox switch_usuarioDefault switch_usuarioDefault_'+usuario_len+'" onchange="shareProjetoSend(this)" id="changeItemConfig_usuarios_'+usuario_len+'" tabindex="0">'+
                        '                                       <label class="onoffswitch-label" for="changeItemConfig_usuarios_'+usuario_len+'"></label>'+
                        '                                   </div>'+
                        '                                </td>'+
                        '                                <td style="width: 50px; text-align: center;">'+
                        '                                     <i class="fas fa-trash-alt cinzaColor removeTrConfig" data-mode="remove_share" data-key="usuario" style="cursor: pointer;float: right;margin-right: 20px;" onclick="shareProjetoSend(this)"></i>'+
                        '                                </td>'+ 
                        '                            </tr>'+
                        '                        </tbody>'+
                        '                    </table>'+
                        '               </td>'+
                        '          </tr>'+
                        '       </table>'+
                        '   </div>'+
                        '</div>';

        resetDialogBoxPro('dialogBoxPro');
        dialogBoxPro = $('#dialogBoxPro')
            .html('<div class="dialogBoxDiv">'+htmlBox+'</span>')
            .dialog({
                title: "Compartilhar Projeto",
                width: 900,
                open: function() { 
                    updateButtonConfirm(this, true);

                    if (typeof arrayConfigAtividades.unidades_all === 'undefined' || typeof arrayConfigAtividades.usuarios_all === 'undefined') {
                        var action = 'share_projeto';
                        var param = {
                            action: action,
                            mode: 'list_select'
                        };
                        getServerAtividades(param, action);
                    }

                    var configShareEditor = {
                        internals: {
                            renderEditor: (elem, oldVal) => {
                                var _this = $(elem);
                                var data = _this.data();
                                var value = valueProjeto(_this.closest('tr').data('id_projeto'));
                                var projetos_compartilhados = value && value.projetos_compartilhados 
                                        ? data.key == 'usuario'
                                            ? jmespath.search(value.projetos_compartilhados,"[?id_user].id_user")
                                            : jmespath.search(value.projetos_compartilhados,"[?id_unidade].id_unidade")
                                        : null;
                                    projetos_compartilhados = projetos_compartilhados === null ? [] : projetos_compartilhados;

                                var arraySelect = (data.key == 'unidade' && typeof arrayConfigAtividades.unidades_all !== 'undefined' && arrayConfigAtividades.unidades_all !== null && arrayConfigAtividades.unidades_all.length) ? arrayConfigAtividades.unidades_all : [];
                                    arraySelect = (data.key == 'usuario' && typeof arrayConfigAtividades.usuarios_all !== 'undefined' && arrayConfigAtividades.usuarios_all !== null && arrayConfigAtividades.usuarios_all.length) ? arrayConfigAtividades.usuarios_all : arraySelect;
                                    var htmlOptions = $.map(arraySelect, function(v){
                                                                return data.key == 'unidade' 
                                                                    ? $.inArray(v.id_unidade, projetos_compartilhados) !== -1 ? '' : '<option value="'+v.id_unidade+'">'+v.sigla_unidade+' - '+v.nome_unidade+'</option>'
                                                                    : $.inArray(v.id_user, projetos_compartilhados) !== -1 ? '' : '<option value="'+v.id_user+'">'+v.nome_completo+'</option>';

                                                        }).join('');
                                _this.html(`<select data-old="`+oldVal+`" data-type="unidade" data-mode="insert_`+data.key+`" onchange="shareTableNewItem(this)"><option value="0">&nbsp;</option>`+htmlOptions).find('select').focus().chosen({
                                    placeholder_text_single: ' ',
                                    no_results_text: 'Nenhum resultado encontrado'
                                });
                                if (checkBrowser() == 'Firefox') _this.find('.chosen-container').addClass('chosen-repair-firefox');
                            },
                            renderValue: (elem, formattedNewVal) => { 
                                var _this = $(elem);
                                if (formattedNewVal != 'new') {
                                    _this.text(formattedNewVal); 
                                }
                            },
                            extractEditorValue: (elem) => { 
                                return extractEditorValue_(elem); 
                            },
                        }
                    };

                    shareEditorUnidade = new SimpleTableCellEditor('shareBox_unidade');
                    shareEditorUnidade.SetEditableClass("editCellSelect", configShareEditor);
                    shareEditorUsuario = new SimpleTableCellEditor('shareBox_usuario');
                    shareEditorUsuario.SetEditableClass("editCellSelect", configShareEditor);
                }
        });
    }
}
function extractEditorValue_(elem) {
    var _this = $(elem);
        _this.data('newvalue',_this.find('select').val());
        _this.closest('tr').attr('data-value',_this.find('select').val()).data('value', _this.find('select').val());
        shareProjetoSend(elem, _this.closest('tr').data());
    return _this.find('select').find('option:selected').text().trim(); 
}
function shareProjetoSend(this_, data = false) {
    var _this = $(this_);
    var data_this = _this.data();
    var tr = _this.closest('tr');
    var table = _this.closest('table');
        data = !data ? tr.data() : data;
    var id_projeto = (typeof data !== 'undefined' && typeof data.id_projeto !== 'undefined') ? data.id_projeto : false;

    if (checkPermissionProjeto(valueProjeto(id_projeto))) {
        if (data.id == 'new' && data.value > 0) {
            var action = 'share_projeto';
            var param = {
                action: action,
                mode: 'insert_'+data_this.key,
                key: data_this.key,
                id_projeto: id_projeto,
                id_unidade: data_this.key == 'unidade' ? data.value : false,
                id_user: data_this.key == 'usuario' ? data.value : false,
                edicao: data.edicao
            };
            getServerAtividades(param, action);
            tr.find('td').eq(0).addClass('editCellLoading');
        } else if (data_this.mode == 'remove_share') {
            confirmaBoxPro('Tem certeza que deseja excluir este item?', function(){
                var action = 'share_projeto';
                var param = {
                    action: action,
                    mode: data_this.mode,
                    key: data_this.key,
                    id_projeto: id_projeto,
                    id_projeto_compartilhado: data.id,
                    id_unidade: data_this.key == 'unidade' ? data.value : false,
                    id_user: data_this.key == 'usuario' ? data.value : false
                };
                getServerAtividades(param, action);
                tr.find('td').eq(0).addClass('editCellLoading');
            }, 'Excluir');
        } else if (data_this.mode == 'change_edicao') {
            if (data.value == '') {
                var _td = $('#shareBox_'+data_this.key).find('.editCellSelect.inEdit');
                var textResult = extractEditorValue_(_td[0]);
                    _td.text(textResult);
                    _td.closest('tr').find('.onoffswitch-checkbox').prop('checked',false);
                    if (textResult == '') $(this_).prop('checked',false);
            } else {
                var edicao = _this.is(':checked') ? 1 : 0;
                var action = 'share_projeto';
                var param = {
                    action: action,
                    mode: data_this.mode,
                    key: data_this.key,
                    id_projeto: id_projeto,
                    id_projeto_compartilhado: data.id,
                    id_unidade: data_this.key == 'unidade' ? data.value : false,
                    id_user: data_this.key == 'usuario' ? data.value : false,
                    edicao: edicao
                };
                getServerAtividades(param, action);
                tr.attr('data-edicao',edicao);
                tr.find('td').eq(0).addClass('editCellLoading');    
            }
        }
    }
}
function shareTableNewItem(this_) {
    var _this = $(this_);
    var td = _this.closest('td');
    var tr = _this.closest('tr');
    if (_this.val() == 'new') {
        setTimeout(function(){ 
            td.removeClass('inEdit').removeClass('editCellSelect').addClass('editCellNew');
            td.html('').trigger('click');
        }, 100);
    }
}
function checkPermissionProjeto(value) {
    var id_unidade = arrayConfigAtivUnidade.id_unidade;
    var id_user = arrayConfigAtividades.perfil.id_user;
    var projetos_compartilhados = (value.projetos_compartilhados !== null && typeof value.projetos_compartilhados !== 'undefined' && value.projetos_compartilhados.length) ? value.projetos_compartilhados : false;
    var compartilhado =  projetos_compartilhados ? jmespath.search(value.projetos_compartilhados, "[?id_unidade==`"+id_unidade+"`] | [0]") : null;
        compartilhado =  compartilhado == null ? jmespath.search(value.projetos_compartilhados, "[?id_user==`"+id_user+"`] | [0]") : compartilhado;
        compartilhado = (id_unidade === null || id_user === null) ? false : compartilhado;
    var permiteEdicao = value.id_unidade == id_unidade || (compartilhado && compartilhado.edicao == 1) ? true : false;
    return permiteEdicao;
}
function valueProjeto(id_projeto, arrayProjetos = arrayConfigAtividades.projetos) {
    var value = (id_projeto == 0) ? null : jmespath.search(arrayProjetos, "[?id_projeto==`"+id_projeto+"`] | [0]");
        value = value === null ? false : value;
    return value;
}
function valueEtapa(id_projeto, id_etapa, arrayProjetos = arrayConfigAtividades.projetos) {
    var value = (id_projeto == 0 || id_etapa == 0) ? null : jmespath.search(arrayProjetos, "[?id_projeto==`"+id_projeto+"`] | [0].etapas | [?id_etapa==`"+id_etapa+"`] | [0]");
        value = value === null ? false : value;
    return value;
}
function changeDocumentoRelacionado(this_) {
    var _this = $(this_);
    var _parent = _this.closest('table');
    var _id_documento_sei = _parent.find('[data-key="id_documento_sei"]');
    var _documento_sei = _parent.find('[data-key="documento_sei"]');
    if (_id_documento_sei.length) _id_documento_sei.val(_this.find('option:selected').attr('data_id_documento_sei'));
    if (_documento_sei.length) _documento_sei.val(_this.find('option:selected').attr('data_nr_sei'));
}
function updateSelectConcluirProjetoEtapa() {
	var docsArray = dadosProcessoPro.listDocumentos;
    var select = $("#proj_documento_relacionado");
	select.empty().append($('<option/>'));
    $.each(docsArray, function (index, valueSelect) {
        select.append($('<option/>', { 
            data_id_documento_sei: valueSelect.id_protocolo,
            value : valueSelect.documento+' ('+valueSelect.nr_sei+')',
            text : valueSelect.documento+' ('+valueSelect.nr_sei+')',
			data_nr_sei : valueSelect.nr_sei,
			data_assinatura : valueSelect.data_assinatura,
			data_documento : valueSelect.documento
        })).chosen("destroy").chosen({
            placeholder_text_single: ' ',
            no_results_text: 'Nenhum resultado encontrado'
        });
    });
    $('#proj_documento_relacionado_chosen').removeClass('chosenLoading');
}

function openFilterProjeto(arrayProjetos = arrayConfigAtividades.projetos) {
    var macroetapaList = jmespath.search(arrayProjetos,"[*].etapas[?macroetapa] | [0] | [*].macroetapa");
        macroetapaList = uniqPro(macroetapaList);
    var grupoList = jmespath.search(arrayProjetos, "[*].etapas[?grupo] | [0] | [*].grupo");
        grupoList = uniqPro(grupoList);
    var responsavelList = jmespath.search(arrayProjetos, "[*].etapas[?responsavel] | [0] | [*].responsavel");
        responsavelList = uniqPro(responsavelList);
    var optionSelectMacroetapa = ( macroetapaList.length > 0 ) ? $.map(macroetapaList, function(v,k){ return '<option data-name="macroetapa" value="'+v+'">Macroetapa: '+v+'</option>' }).join('') : '';
    var optionSelectGrupo = ( grupoList.length > 0 ) ? $.map(grupoList, function(v,k){ return '<option data-name="grupo" value="'+v+'">Grupo: '+v+'</option>' }).join('') : '';
    var optionSelectResponsavel = ( responsavelList.length > 0 ) ? $.map(responsavelList, function(v,k){ return '<option data-name="responsavel" value="'+v+'">Respons\u00E1vel: '+v+'</option>' }).join('') : '';
    var selectFilter =  '<select style="width: 100%; height: 30px; margin: 0 !important; padding: 0 5px !important;" class="required infraText txtsheetsSelect" id="selectBoxFilter">'+
                        '   <option data-name="em_execucao" value="">Etapas em execu\u00E7\u00E3o</option>'+
                        '   <option data-name="concluidas" value="">Etapas conclu\u00EDdas</option>'+
                        '   <option data-name="ainiciar" value="">Etapas a iniciar (30 dias)</option>'+
                        '   <option data-name="aconcluir" value="">Etapas a concluir (30 dias)</option>'+
                        '   <option data-name="atrasadas" value="">Etapas atrasadas</option>'+
                            optionSelectMacroetapa+
                            optionSelectGrupo+
                            optionSelectResponsavel+
                        '</select>';

    var htmlBox =   '<div id="boxProjeto" class="atividadeWork">'+
                   '   <table style="font-size: 10pt;width: 100%;" class="seiProForm">'+
                   '      <tr>'+
                   '          <td style="vertical-align: bottom; text-align: left;width: 230px;" class="label">'+
                   '               <label for="selectBoxFilter"><i class="iconPopup iconSwitch fas fa-clock cinzaColor"></i>Filtro do Relat\u00F3rio:</label>'+
                   '           </td>'+
                   '           <td class="required">'+
                   '               '+selectFilter+
                   '           </td>'+
                   '      </tr>'+
                   '   </table>'+
                   '</div>';
    
    resetDialogBoxPro('dialogBoxPro');
    dialogBoxPro = $('#dialogBoxPro')
        .html('<div class="dialogBoxDiv"> '+htmlBox+'</span>')
        .dialog({
            title: "Gerar Relat\u00F3rio Filtrado",
        	width: 600,
            open: function() { 
                updateButtonConfirm(this, true);
                prepareFieldsReplace(this);
            },
        	buttons: [{
                text: "Ok",
                class: 'confirm',
                click: function() {
                    var select = $('#selectBoxFilter');
                    var nameFilter = select.find('option:selected').data('name');
                    var valueFilter = select.find('option:selected').val();
                    var filter = {name: nameFilter, value: valueFilter};
                    filterProjetos(filter);
                    resetDialogBoxPro('dialogBoxPro');
                }
            }]
    });
}
function filterProjetos(filter, arrayProjetos = arrayConfigAtividades.projetos) {
    var dadosEtapasObj = jmespath.search(arrayProjetos,"[*].etapas[]");
    if ( filter.name == 'em_execucao' ) {
        // Etapas em execucao
        var dadosEtapasReport = jmespath.search(dadosEtapasObj, "[?data_fim_execucao=='0000-00-00 00:00:00'] | [?progresso_execucao>`0`] | [?progresso_execucao<`100`]");
        var nameReport = '(Etapas em execu\u00E7\u00E3o)';
    } else if ( filter.name == 'concluidas' ) {
        // Etapas concluidas
        var dadosEtapasReport = jmespath.search(dadosEtapasObj, "[?data_fim_execucao!='0000-00-00 00:00:00'] | [?progresso_execucao==`100`]");
        var nameReport = '(Etapas conclu\u00EDdas)';
    } else if ( filter.name == 'aconcluir' ) {
        // Etapas a concluir (30 dias)
        var dadosEtapasReport = $.map(jmespath.search(dadosEtapasObj, "[?data_fim_execucao=='0000-00-00 00:00:00'] | [?progresso_execucao!=`100`]"), function(v,k){ if ( moment(v.data_fim_programado,'YYYY-MM-DD HH:mm:ss') >= moment().add(30, 'days') ) return v });
        var nameReport = '(Etapas a concluir)';
    } else if ( filter.name == 'ainiciar' ) {
        // Etapas a iniciar (30 dias)
        var dadosEtapasReport = $.map(jmespath.search(dadosEtapasObj, "[?data_fim_execucao=='0000-00-00 00:00:00'] | [?progresso_execucao!=`100`]"), function(v,k){ if ( moment(v.data_inicio_programado,'YYYY-MM-DD HH:mm:ss') >= moment().add(30, 'days') ) return v });
        var nameReport = '(Etapas a iniciar)';
    } else if ( filter.name == 'atrasadas' ) {
        // Etapas atrasadas
        var dadosEtapasReport = $.map(jmespath.search(dadosEtapasObj, "[?data_fim_execucao=='0000-00-00 00:00:00'] | [?progresso_execucao!=`100`]"), function(v,k){ if ( moment(v.data_fim_programado,'YYYY-MM-DD HH:mm:ss') < moment() ) return v });
        var nameReport = '(Etapas atrasadas)';
    } else if ( filter.name == 'grupo' ) {
        // Etapas por grupo
        var dadosEtapasReport = jmespath.search(dadosEtapasObj, "[?grupo=='"+filter.value+"']");
        var valueAssunto = ( filter.value.length > 50 ) ? filter.value.replace(/^(.{50}[^\s]*).*/, "$1")+'...' : filter.value;
        var nameReport = '(Grupo: '+valueAssunto+')';
    } else if ( filter.name == 'macroetapa' ) {
        // Etapas por macroetapa
        var dadosEtapasReport = jmespath.search(dadosEtapasObj, "[?macroetapa=='"+filter.value+"']");
        var valueAssunto = ( filter.value.length > 50 ) ? filter.value.replace(/^(.{50}[^\s]*).*/, "$1")+'...' : filter.value;
        var nameReport = '(Macroetapa: '+valueAssunto+')';
    } else if ( filter.name == 'responsavel' ) {
        // Etapas por responsavel
        var dadosEtapasReport = jmespath.search(dadosEtapasObj, "[?responsavel=='"+filter.value+"']");
        var valueAssunto = ( filter.value.length > 50 ) ? filter.value.replace(/^(.{50}[^\s]*).*/, "$1")+'...' : filter.value;
        var nameReport = '(Respons\u00E1vel: '+valueAssunto+')';
    }
    var dadosProjetosReport = uniqPro(jmespath.search(dadosEtapasReport, "[*].id_projeto"));
    
    if (typeof dadosProjetosReport !== 'undefined' && dadosProjetosReport.length > 0) {
        var idReport = randomString(8);
        var width = $('#projetosGanttDiv').width();
        var iconCloseTab = '<i class="fas fa-times-circle closeReport" onclick="deletReportProjetos(this)"></i>';
            $('#projetosTabs ul').append('<li><a href="#svgtab_report_'+idReport+'">Relat\u00F3rio '+nameReport+' '+iconCloseTab+'</a></li>');
            $('#projetosTabs').append('<div id="svgtab_report_'+idReport+'" class="ganttReport resizeObserve"></div>');
    
        $.each(dadosProjetosReport, function (index, value) {
            var nameID = value;
            var dadosEtapas = jmespath.search(dadosEtapasReport, "[?id_projeto==`"+value+"`]");
            if (dadosEtapas.length > 0) {
                dadosEtapas = dadosEtapas.sort(function(a, b){
                                var aa = a.data_inicio_programado.split('/').reverse().join(),
                                    bb = b.data_inicio_programado.split('/').reverse().join();
                                return aa < bb ? -1 : (aa > bb ? 1 : 0);
                              });
                var task = [];
                var nameDisplay = jmespath.search(arrayProjetos, "[?id_projeto==`"+value+"`].nome_projeto | [0]");

                $('#projetosTabs #svgtab_report_'+idReport+'').append('<h2>'+nameDisplay+'</h2><svg id="gantt_report_'+idReport+'_'+nameID+'" class="svg_gantt"></svg>');
                
                $.each(dadosEtapas, function (i, v) {
                    var start = moment(v.data_inicio_programado, "DD/MM/YYYY");
                    var end = moment(v.data_fim_programado, "DD/MM/YYYY");
                    var progresso_execucao = v.progresso_execucao;

                    var customClass = ( moment() <= end && moment() >= start ) ? 'bar-ongoing' : 'bar-inday';   
                        customClass = ( progresso_execucao < 100 && end < moment() ) ? 'bar-delay' : customClass;
                        customClass = ( v.data_fim_execucao != '' ) ? 'bar-complete' : customClass;

                    var taskProjeto = {
                                        id: v.id_etapa.toString(),
                                        etapa: v,
                                        index: i,
                                        show_full_popup: true,
                                        name: v.nome_etapa,
                                        start: moment(v.data_inicio_programado, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD'),
                                        end: moment(v.data_fim_programado, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD'),
                                        progress: progresso_execucao ? progresso_execucao : 0,
                                        dependencies: v.id_dependencia ? [v.id_dependencia.toString()] : [],
                                        custom_class: customClass
                                      };

                    task.push(taskProjeto);
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
                        return customPopupHtmlProjeto(task);
                    }
                });
                ganttProject.push(gantt);
            }
        });
        $('#projetosTabs').tabs('refresh');
        $('.gantt-container').css('max-width',(width-20)).addClass('resizeObserve');
        var activeTab = $('#projetosTabs .ui-tabs-nav li').length-1;
        $('#projetosTabs').tabs( "option", "active",  activeTab);
        scrollProjetoGanttToFirstBar();
    } else {
        setTimeout(() => {
            alertaBoxPro('Error', 'exclamation-triangle', 'Nenhuma etapa atende ao filtro proposto');
        }, 500);
    }
}
function deletReportProjetos(this_) {
    var id = $(this_).closest('li').attr('aria-controls');
    var id_ = id.replace('svgtab_report','gantt_report');
        $(this_).closest('li').remove();
        $('#'+id).remove();
        $('#projetosTabs').tabs('refresh');
	for (i = 0; i < ganttProject.length; i++) {
		if ( typeof ganttProject[i] !== 'undefined' && ganttProject[i].$svg.id.indexOf(id_) !== -1 ) {   
            ganttProject.splice(i,1);
            i--;
		}
	}
}
function closeAllPopupsProjeto() {
    for (i = 0; i < ganttProject.length; i++) {
    	ganttProject[i].hide_popup();
        var id_projeto = ganttProject[i].options.id_projeto;
        $('#svgtab_'+id_projeto+' .gantt-container').attr('style','max-width:'+$('#svgtab_'+id_projeto+' .gantt-container').css('max-width'));
    }
}