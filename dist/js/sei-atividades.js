// INSERE ACOMPANHAMENTO DE ATIVIDADES
var dadosDemandasAtiv = [];
var dadosUsuariosAtiv = [];
var dadosMetasAtiv = [];
var dadosPontuacaoAtiv = [];
var arraTblProcessos = [];
var rangeDemandas = "BaseDemandas";
var rangeUsuarios = "BaseUsuarios";
var rangeMetas = "BaseMetas";
var userLogin = $('#hdnInfraPrefixoCookie').val().split('_');
    userLogin = userLogin[userLogin.length-1].toString().toLowerCase();
var idUserLogin = "";


function loadAtividadesSheet() {
    loadSheetIconPro('load');
    var ranges = [
                    rangeDemandas,
                    rangeUsuarios,
                    rangeMetas
                ];
    gapi.client.sheets.spreadsheets.values.batchGet({
      spreadsheetId: spreadsheetIdAtividades_Pro,
      ranges: ranges
    }).then((response) => {
        loadSheetIconPro('complete');
        loadAtividadesControleAction(response.result);
        localStorageStorePro('loadAtividadesSheet', response.result);
    }, function(error) {
        loadSheetIconPro('noperfil');
        console.log(error.result.error.message, error);
    });
}
function getTblProcessos() {
    $('#tblProcessosRecebidos, #tblProcessosGerados').find('tr').each(function(index){ 
    	var text = $(this).find('td').eq(2).text();
    	if ( text != '' ) { arraTblProcessos.push(text); }
    });
    var tblProcessos = $('#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado');
        tblProcessos.find('tbody tr').append('<td class="celStatusAtividade" style="text-align: center;"></td>');

    if ( tblProcessos.find('thead').length > 0 ) {
        tblProcessos.find('thead tr').append('<th class="tituloControle tablesorter-header celStatusAtividade">Status</th>');
    } else {
        $('#tblProcessosRecebidos tbody tr:first, #tblProcessosGerados tbody tr:first, #tblProcessosDetalhado tbody tr:first').find('.celStatusAtividade').remove();
        $('#tblProcessosRecebidos tbody tr:first, #tblProcessosGerados tbody tr:first, #tblProcessosDetalhado tbody tr:first').append('<th class="tituloControle tablesorter-header celStatusAtividade">Status</th>');
    }
    if (  tblProcessos.find('tbody tr').hasClass('tagintable') ) {
        tblProcessos.find('tbody tr').each(function( index ) {
            if ( typeof $(this).attr('head-tagname') !== 'undefined' && $(this).attr('head-tagname') != '' ) {  
                var thTitle = $(this).find('th').eq(1);
                var thColspan = parseInt(thTitle.attr('colspan'))+1;
                    thTitle.attr('colspan', thColspan);
                    $(this).find('.celStatusAtividade').remove();
            }
        });
    }
}
function loadAtividadesControleAction(result) {
    dadosDemandasAtiv = arraySheetToJSON(result.valueRanges[0].values);
    dadosUsuariosAtiv = arraySheetToJSON(result.valueRanges[1].values);
    dadosMetasAtiv = arraySheetToJSON(result.valueRanges[2].values);
    dadosPontuacaoAtiv = getDadosPontuacaoAtiv();

    console.log(dadosPontuacaoAtiv);
    
    getIDUserLogin();
    getTblProcessos();
    getTblIconsProcessos();
    getTblDemandasAnalise();
}
function getDadosPontuacaoAtiv() {
    var dadosPontuacao = []
    var dadosUsuarios = jmespath.search(dadosUsuariosAtiv,"[?Inativo=='FALSE']");
    $.each(dadosUsuarios, function (index, dUsuarios) {
        var pontuacaoEntregue = jmespath.search(dadosDemandasAtiv,"sum([?UsuarioID=='"+dUsuarios.ID+"'] | [?Data_Conclusao!=''].Pontuacao.to_number(@))");
        var pontuacaoDistribuida = jmespath.search(dadosDemandasAtiv,"sum([?UsuarioID=='"+dUsuarios.ID+"'].Pontuacao.to_number(@))");
        var metaUsuario = jmespath.search(dadosMetasAtiv,"[?Inativo=='FALSE'] | [?UsuarioID=='"+dUsuarios.ID+"'].Pontuacao.to_number(@) | [0]");
        if ( metaUsuario !== null && metaUsuario > 0 ) {
            dadosPontuacao.push({
                Nome_Servidor: dUsuarios.Nome_Servidor, 
                Nome_Completo: dUsuarios.Nome_Completo, 
                Login: dUsuarios.Login,
                Pontuacao_Entregue: pontuacaoEntregue,
                Pontuacao_Distribuida: pontuacaoDistribuida,
                Meta_Periodo: metaUsuario
            });
        }
    });
    return dadosPontuacao;
}
function getIDUserLogin() {
    idUserLogin = jmespath.search(dadosUsuariosAtiv,"[?Login=='"+userLogin+"'].ID | [0]");
}
function getTblIconsProcessos() {
    var dadosDemandasAtiv_ = jmespath.search(dadosDemandasAtiv,"[?Data_Envio=='']");
    $.each(dadosDemandasAtiv_, function (index, dDemandas) {
        var status = dDemandas.Status;
        var statusDemanda = ( typeof dDemandas.Dias_Atraso !== 'undefined' && dDemandas.Dias_Atraso != '' ) ? dDemandas.Dias_Atraso+' dias de atraso' : 'at\u00E9 '+dDemandas.Data_Fim;
        var demandaEntregue = ( dDemandas.Documento_Relacionado == '' ) ? statusDemanda : dDemandas.Documento_Relacionado+' ('+dDemandas.SEI_Relacionado+')';
            demandaEntregue = ( dDemandas.SEI_Relacionado != '' ) ? dDemandas.Documento_Relacionado+' ('+dDemandas.SEI_Relacionado+')' : demandaEntregue;
        var observacao = ( dDemandas.Observacao == '' ) ? 'Sem observa\u00E7\u00F5es' : dDemandas.Observacao;
        var nomeUsuario = jmespath.search(dadosUsuariosAtiv,"[?ID=='"+dDemandas.UsuarioID+"'].Login | [0]");
        var responsavel = ( dDemandas.Pontuacao == '' ) ? nomeUsuario : nomeUsuario+' ('+dDemandas.Pontuacao+' pontos)';

        var statusIcon = statusIconAtividade(status).statusIcon;
        var colorIcon = statusIconAtividade(status).colorIcon;
        var SEINrRequisicao = ( dDemandas.Protocolo_SEI != '' && typeof dDemandas.Protocolo_SEI !== 'undefined') ? 'onclick="openSEINrPro(\''+dDemandas.Protocolo_SEI.replace(/\D/g, '')+'\')"' : '';
        var SEINrNota = ( dDemandas.SEI_Relacionado != '' && typeof dDemandas.SEI_Relacionado !== 'undefined' ) ? 'onclick="openSEINrPro(\''+dDemandas.SEI_Relacionado.replace(/\D/g, '')+'\')"' : '';
        var SEINrClick = ( SEINrNota != '' && typeof SEINrNota !== 'undefined' ) ? SEINrNota : SEINrRequisicao;
        var icon =   '<a '+SEINrClick+' onmouseover="return infraTooltipMostrar(\''+demandaEntregue+'<br>'+responsavel+'\',\''+status+'\');" onmouseout="return infraTooltipOcultar();" class="iconAtividade" alt="'+status+'">'
                    +'<i class="fas fa-'+statusIcon+' '+colorIcon+'"></i></a>';

        $('#tblProcessosRecebidos tbody, #tblProcessosGerados tbody, #tblProcessosDetalhado tbody').find('tr').each(function( indexTr ) {
            var this_ = $(this);
            var protocoloTable = this_.find('td').eq(2).text();
            if ( protocoloTable == dDemandas.Processo_SEI ) {
                this_.find('td').last().append(icon);
            }
        });
    });
}
function getTblDemandasAnalise() {
    var dadosDemandasAtiv_ = jmespath.search(dadosDemandasAtiv,"[?Data_Envio=='']");
		if ( !checkUserAdmin() ) {
			dadosDemandasAtiv_ = jmespath.search(dadosDemandasAtiv_, "[?Usuario=='"+idUserLogin+"']");
		}
	    if ( typeof dadosDemandasAtiv_ !== 'undefined' && dadosDemandasAtiv_.length > 0 ) {
			
			if ( $('#atividadesAnalise').length > 0 ) { $('#atividadesAnalise').remove(); }

            var statusTableView = ( typeof localStorageRestorePro('atividadesStatusTablePro') !== 'undefined' && localStorageRestorePro('atividadesStatusTablePro') == 'hide' ) ? 'display:none;' : 'display: inline-table;';
            var statusIconShow = ( typeof localStorageRestorePro('atividadesStatusTablePro') !== 'undefined' && localStorageRestorePro('atividadesStatusTablePro') == 'hide' ) ? '' : 'display:none;';
            var statusIconHide = ( typeof localStorageRestorePro('atividadesStatusTablePro') !== 'undefined' && localStorageRestorePro('atividadesStatusTablePro') == 'hide' ) ? 'display:none;' : '';
						
            var htmlAtividadesAnalise = '<div class="atividadesPanelHome" style="display: inline-block;width: 100%;" id="atividadesAnalise">'+
										'   <div class="infraBarraLocalizacao">Acompanhamento de Atividades'+
										'       <a class="newLink" id="atividadesStatusTablePro_showIcon" onclick="toggleTablePro(\'atividadesStatusTablePro\',\'show\')" onmouseover="return infraTooltipMostrar(\'Mostrar Tabela\');" onmouseout="return infraTooltipOcultar();" style="font-size: 11pt; '+statusIconShow+'"><i class="fas fa-plus-square"></i></a>'+
										'       <a class="newLink" id="atividadesStatusTablePro_hideIcon" onclick="toggleTablePro(\'atividadesStatusTablePro\',\'hide\')" onmouseover="return infraTooltipMostrar(\'Recolher Tabela\');" onmouseout="return infraTooltipOcultar();" style="font-size: 11pt; '+statusIconHide+'"><i class="fas fa-minus-square"></i></a>'+
										'   </div>'+
										'   <div id="atividadesStatusTablePro">'+
										'     <div class="group">'+
                                        '       <h3>Atividades em An&aacute;lise T&eacute;cnica</h3>'+
										'       <div id="atividadesAnaliseTecnicaPro" style="'+statusTableView+'">'+
										'         <table class="infraTable tabelaControle tablesorter tableZebra" style="display: inline-table;">'+
										'             <thead>'+
										'                 <tr>'+
										'                     <th class="tituloControle tablesorter-header" style="width: 15%;">Processo<br>Requisi&ccedil;&atilde;o</th>'+
										'                     <th class="tituloControle tablesorter-header" style="width: 30%;">Atividade<br>Assunto</th>'+
										'                     <th class="tituloControle tablesorter-header">Respons&aacute;vel</th>'+
										'                     <th class="tituloControle tablesorter-header">Pontua&ccedil;&atilde;o</th>'+
										'                     <th class="tituloControle tablesorter-header" data-sorter="shortDate" data-date-format="ddmmyyyy">Distribui&ccedil;&atilde;o</th>'+
										'                     <th class="tituloControle tablesorter-header" data-sorter="shortDate" data-date-format="ddmmyyyy">Entrega</th>'+
										'                     <th class="tituloControle tablesorter-header">Prazo<br>(dias &uacute;teis)</th>'+
										'                     <th class="tituloControle tablesorter-header">Status</th>'+
										'                     <th class="tituloControle tablesorter-header">Dias de<br>atraso</th>'+
										'                 </tr>'+
										'             </thead>'+
										'             <tbody></tbody>'+
										'         </table>'+
										'       </div>'+
										'     </div>';
            if ( checkUserAdmin() ) {
                htmlAtividadesAnalise +=    '     <div class="group">'+
                                            '       <h3>Atividades em An&aacute;lise Gerencial</h3>'+
                                            '       <div id="atividadesAnaliseGerencialPro">'+
                                            '         <table class="infraTable tabelaControle tablesorter tableZebra" style="display: inline-table;">'+
                                            '             <thead>'+
                                            '                 <tr>'+
                                            '                     <th class="tituloControle tablesorter-header" style="width: 15%;">Processo<br>Requisi&ccedil;&atilde;o</th>'+
                                            '                     <th class="tituloControle tablesorter-header" style="width: 30%;">Atividade<br>Assunto</th>'+
                                            '                     <th class="tituloControle tablesorter-header">Respons&aacute;vel</th>'+
                                            '                     <th class="tituloControle tablesorter-header">Pontua&ccedil;&atilde;o</th>'+
                                            '                     <th class="tituloControle tablesorter-header">Demanda entregue</th>'+
                                            '                     <th class="tituloControle tablesorter-header" data-sorter="shortDate" data-date-format="ddmmyyyy">Distribui&ccedil;&atilde;o</th>'+
                                            '                     <th class="tituloControle tablesorter-header" data-sorter="shortDate" data-date-format="ddmmyyyy">Entrega</th>'+
                                            '                     <th class="tituloControle tablesorter-header">Status</th>'+
                                            '                     <th class="tituloControle tablesorter-header">Dias<br>an&aacute;lise t&eacute;cnica</th>'+
                                            '                     <th class="tituloControle tablesorter-header">Dias<br>an&aacute;lise gerencial</th>'+
                                            '                 </tr>'+
                                            '             </thead>'+
                                            '             <tbody></tbody>'+
                                            '         </table>'+
                                            '       </div>'+
                                            '     </div>'+
                                            '     <div class="group">'+
                                            '       <h3>Distribui\u00E7\u00E3o de Atividades</h3>'+
                                            '       <div id="atividadesDistribuicaoPro">'+
                                            '         <table class="infraTable tabelaControle tablesorter tableZebra" style="display: inline-table;margin: 20px;width: 50%;">'+
										    '         </table>'+
                                            '       </div>'+
                                            '     </div>';
            }
				htmlAtividadesAnalise +=  '   </div>'+
										  '</div>';
            
			$('#frmProcedimentoControlar').append(htmlAtividadesAnalise);
				
			var tableAnaliseTecnica = '';
			var tableAnaliseGerencial = '';
			$.each(dadosDemandasAtiv_, function (index, dDemandas) {
				var SEINrRequisicao = ( dDemandas.Protocolo_SEI != '' ) ? dDemandas.Protocolo_SEI.replace(/\D/g, '') : '';
				var SEINrClick = 'onclick="openSEINrPro(\''+SEINrRequisicao+'\')"';
				
                var loginResponsavel = jmespath.search(dadosUsuariosAtiv, "[?ID=='"+dDemandas.UsuarioID+"'].Login | [0]");
				var dtInicio = dDemandas.Data_Inicio.split(' ')[0];
				    dtInicio = moment(dtInicio, 'DD/MM/YYYY');
				var dtFim = dDemandas.Data_Fim.split(' ')[0];
				    dtFim = moment(dtFim, 'DD/MM/YYYY');
				var dtNow = moment();
				var progressoDat = dtFim.diff(dtInicio, 'days');
				var progressoDatNow = dtNow.diff(dtInicio, 'days');
				var progressoBar = '<div data-progresso-value="'+progressoDatNow+'" data-progresso-max="'+progressoDat+'" class="atividadesProgressoBar" id="atividadesProgressoBar_'+index+'"></div>';
				var linkProcesso = ( dDemandas.Procedimento_SEI != '' && typeof dDemandas.Procedimento_SEI !== 'undefined' ) 
                                    ? '<a class="newLink link_line"  onclick="openLinkSEIPro(\''+dDemandas.Procedimento_SEI+'\')" onmouseover="return infraTooltipMostrar(\'Visualizar processo\');" onmouseout="return infraTooltipOcultar();"><i class="fas fa-folder-open azulColor"></i>'+dDemandas.Processo_SEI+'<i class="fas fa-external-link-alt" style="font-size: 90%;"></i></a>' 
                                    : '<a class="newLink link_line" onclick="concluirAtividadeByID(\''+dDemandas.ID+'\')" onmouseover="return infraTooltipMostrar(\'Concluir atividade\');" onmouseout="return infraTooltipOcultar();"><i class="fas fa-check-circle verdeColor"></i>'+dDemandas.Tipo_Requisicao+'</a>';
				var linkDemanda = ( dDemandas.Protocolo_SEI != '' && typeof dDemandas.Protocolo_SEI !== 'undefined' ) ? '<a class="newLink link_line" '+SEINrClick+' onmouseover="return infraTooltipMostrar(\'Visualizar demanda\');" onmouseout="return infraTooltipOcultar();"><i class="fas fa-user-edit cianoColor"></i>'+dDemandas.Tipo_Requisicao+' ('+dDemandas.Protocolo_SEI+')</a>' : '';
				var iconStatus = '<a class="newLink link_line" alt="'+dDemandas.Status+'"><i class="fas fa-'+statusIconAtividade(dDemandas.Status).statusIcon+' '+statusIconAtividade(dDemandas.Status).colorIcon+'"></i>'+dDemandas.Status+'</a> ';
                var diasAtraso = ( dDemandas.Dias_Atraso != '' && typeof dDemandas.Dias_Atraso !== 'undefined' ) ? dDemandas.Dias_Atraso : '';
                var demandaEntregue = dDemandas.Documento_Relacionado;
                    demandaEntregue = ( dDemandas.SEI_Relacionado != '' ) ? '<a class="newLink link_line" onclick="openSEINrPro(\''+dDemandas.SEI_Relacionado+'\')" onmouseover="return infraTooltipMostrar(\'Visualizar documento entregue\');" onmouseout="return infraTooltipOcultar();"><i class="fas fa-file-alt azulColor"></i>'+demandaEntregue+' ('+dDemandas.SEI_Relacionado+')</a>' : demandaEntregue;
                var etiquetas = '';
                var etiquetasClass = '';
                if ( typeof dDemandas.Etiquetas !== 'undefined' && dDemandas.Etiquetas !== '' ) {
                    var arrayEtiquetas = dDemandas.Etiquetas.split(',');
                    $.each(arrayEtiquetas, function (index_, value_) {
                        var etiquetaAlerta = ( (value_.toString().toLowerCase().indexOf('urgente') !== -1) || (value_.toString().toLowerCase().indexOf('prioridade') !== -1) ) ? 'etiquetaListAlert' : '';
                        var etiquetaNameClass = 'etiqueta_'+value_.toString().replace(/[^a-zA-Z]/g, "").toLowerCase();
                        etiquetas += '<span class="etiquetaList '+etiquetaAlerta+'">'+value_+'</span>'; 
                        etiquetasClass += etiquetaNameClass+' '; 
                    });
                }
                if ( typeof dDemandas.Status !== 'undefined' && dDemandas.Status !== '' ) {
                    var etiquetaNameClass = 'etiqueta_'+dDemandas.Status.toString().replace(/[^a-zA-Z]/g, "").toLowerCase();
                        etiquetasClass += etiquetaNameClass+' ';
                }
                if (typeof dDemandas.Data_Conclusao !== 'undefined' && dDemandas.Data_Conclusao == '' ) {
                    tableAnaliseTecnica +=  '<tr class="'+etiquetasClass+'">'+
                                            '   <td>'+linkProcesso+linkDemanda+'</td>'+
                                            '   <td><span style="margin-top: 10px; display: block;">'+dDemandas.Atividade+'</span><span style="font-style: italic;">'+dDemandas.Assunto+'</span>'+progressoBar+etiquetas+'</td>'+
                                            '   <td>'+loginResponsavel+'</td>'+
                                            '   <td>'+dDemandas.Pontuacao+'</td>'+
                                            '   <td>'+dDemandas.Data_Inicio+'</td>'+
                                            '   <td>'+dDemandas.Data_Fim+'</td>'+
                                            '   <td>'+dDemandas.Dias_Execucao+'</td>'+
                                            '   <td>'+iconStatus+'</td>'+
                                            '   <td>'+diasAtraso+'</td>'+
                                            '</tr>';
                } else if (typeof dDemandas.Data_Conclusao !== 'undefined' && dDemandas.Data_Conclusao != '' && checkUserAdmin() ) {
                    tableAnaliseGerencial +=    '<tr class="'+etiquetasClass+'">'+
                                                '   <td>'+linkProcesso+linkDemanda+'</td>'+
                                                '   <td><span style="margin-top: 10px; display: block;">'+dDemandas.Atividade+'</span><span style="font-style: italic;">'+dDemandas.Assunto+'</span>'+progressoBar+etiquetas+'</td>'+
                                                '   <td>'+loginResponsavel+'</td>'+
                                                '   <td>'+dDemandas.Pontuacao+'</td>'+
                                                '   <td>'+demandaEntregue+'</td>'+
                                                '   <td>'+dDemandas.Data_Inicio+'</td>'+
                                                '   <td>'+dDemandas.Data_Conclusao+'</td>'+
                                                '   <td>'+iconStatus+'</td>'+
                                                '   <td>'+dDemandas.Tempo_Analise+'</td>'+
                                                '   <td>'+dDemandas.Tempo_Analise_Gerencial+'</td>'+
                                                '</tr>';
                }
			});
			$('#atividadesAnaliseTecnicaPro table tbody').append(tableAnaliseTecnica);
			if ( checkUserAdmin() ) { 
                $('#atividadesAnaliseGerencialPro table tbody').append(tableAnaliseGerencial);
                if ( typeof dadosPontuacaoAtiv !== 'undefined' && dadosPontuacaoAtiv.length > 0 ) {
                    $.each(dadosPontuacaoAtiv, function (index, dPontuacao) {
                        var nameID = dPontuacao.Login.replace(/[^a-zA-Z ]/g, "").replace(" ", "");
                        var tableProgressoAdmin =   '<tr>'+
                                                    '   <td><span style="text-align: right; font-size: 16pt; vertical-align: middle;"><i class="fas fa-user-circle cinzaColor"></i></span> '+dPontuacao.Nome_Servidor+'</td>'+
                                                    '   <td style="min-width: 130px;">'+
                                                    '       <div style="text-align: right;padding: 6px 0;color: #969696;">Entregas</div>'+
                                                    '       <div style="text-align: right;padding: 6px 0;color: #969696;">Distribui\u00E7\u00E3o</div>'+
                                                    '   </td>'+
                                                    '   <td>'+
                                                    '       <div style="text-align: right; font-size: 16pt;"><i class="far fa-handshake cinzaColor"></i></div>'+
                                                    '       <div style="text-align: right; font-size: 16pt;"><i class="fas fa-tasks cinzaColor"></i></div>'+
                                                    '   </td>'+
                                                    '   <td style="width: 80%;">'+
                                                    '       <div class="txtAtividadesProgresso" style="width: auto;padding: 5px 0 0 20px;display: inline-table;">'+dPontuacao.Pontuacao_Entregue+' Pontos Entregues / '+dPontuacao.Pontuacao_Distribuida+' Pontos Distribu&iacute;dos</div>'+
                                                    '       <div class="atividadesProgressoEntregue" id="atividadesProgressoEntregue_'+nameID+'"></div>'+
                                                    '       <div class="txtAtividadesProgresso" style="width: auto;padding-left: 20px;">'+dPontuacao.Pontuacao_Distribuida+' Pontos Distribu&iacute;dos / '+dPontuacao.Meta_Periodo+' Meta Per\u00EDodo</div>'+
                                                    '       <div class="atividadesProgressoPeriodo" id="atividadesProgressoPeriodo_'+nameID+'"></div>'+
                                                    '   </td>'+
                                                    '</tr>';
                        $('#atividadesDistribuicaoPro table').append(tableProgressoAdmin);
                        $('#atividadesProgressoEntregue_'+nameID).progressbar({ max: parseFloat(dPontuacao.Pontuacao_Distribuida) });
                        $('#atividadesProgressoPeriodo_'+nameID).progressbar({ max: parseFloat(dPontuacao.Meta_Periodo) });
                        setTimeout(function(){ 
                            $('#atividadesProgressoEntregue_'+nameID).progressbar({ value: parseFloat(dPontuacao.Pontuacao_Entregue) });
                            $('#atividadesProgressoPeriodo_'+nameID).progressbar({ value: parseFloat(dPontuacao.Pontuacao_Distribuida) });
                        }, 500+(index*200));
                    });
                }
            }
			if (typeof $.tablesorter !== "undefined") {
				$('#atividadesStatusTable').tablesorter();
			}
            $( "#atividadesStatusTablePro" ).accordion({
                collapsible: true,
                active: false,
                header: "> div > h3"
            })
            .sortable({
                axis: "y",
                handle: "h3",
                stop: function( event, ui ) {
                  ui.item.children( "h3" ).triggerHandler( "focusout" );
                  $( this ).accordion( "refresh" );
                }
            });
            getAtividadesProgressoBar();
			/*
            var etiquetasLabel = '';
            var arrayEtiquetasAtividades = jmespath.search(processosAnalise, "[?[26]!='']|[*][26]").join(',').split(',');
            var arrayEtiquetasStatus = jmespath.search(processosAnalise, "[?[16]!='']|[*][16]");
            var arrayEtiquetas = ( arrayEtiquetasAtividades[0] != '' ) ? arrayEtiquetasAtividades.concat(arrayEtiquetasStatus) : arrayEtiquetasStatus;
            var etiquetasList = uniqPro(arrayEtiquetas);
            $.each(etiquetasList, function (index, value) {
                var etiquetaAlerta = ( (value.toString().toLowerCase().indexOf('urgente') !== -1) || (value.toString().toLowerCase().indexOf('prioridade') !== -1) ) ? 'etiquetaListAlert' : '';
                var count = arrayEtiquetas.filter(name => name.includes(value)).length;
                etiquetasLabel += '<div class="etiquetasFilter"><span onclick="etiquetasFilter(this)" class="etiquetaList '+etiquetaAlerta+'" data-value="'+value+'" data-action="filter">'+value+' ('+count+')</span><span class="clean" onclick="etiquetasFilter(this)" data-action="remove"><i class="fas fa-times brancoColor"></i></span></div>'; 
            });
            if ( etiquetasLabel != '' ) {
                $('#atividadesAnalise').prepend('<div style="float: right;" class="etiquetasLabel">'+etiquetasLabel+'</div>');
            }
            */
	}
}
function getAtividadesProgressoBar() {
    $('.atividadesProgressoBar').each(function( index ) {
    	var max = parseInt($(this).attr('data-progresso-max'));
    	var value = parseInt($(this).attr('data-progresso-value'));
    	var max_width = ( value > max ) ? 50+((value-max)*2) : 50;
    		max_width = ( max_width > 100 ) ? 100 : max_width;
    	var progressoBarClass = ( value > max ) ? 'atividadesProgresso_atraso' : 'atividadesProgresso_analise';
    	
    	$(this).progressbar({
    		value: value,
    		max: max
    	}).css('width',max_width+'%').addClass(progressoBarClass);
    });
}
function statusIconAtividade(status) {
    var return_ = {statusIcon: 'cinzaColor', colorIcon: 'info'};
    
    if ( status == 'Atrasado' ) {
        return_.colorIcon = 'vermelhoColor';
        return_.statusIcon = 'exclamation-triangle';
    } else if ( status == 'Entregue com atraso' ) {
        return_.colorIcon = 'laranjaColor';
        return_.statusIcon = 'check-circle';
    } else if ( status == 'Entregue dentro do prazo' ) {
        return_.colorIcon = 'verdeColor';
        return_.statusIcon = 'check-circle';
    } else if ( status == 'Dentro do Prazo' ) {
        return_.colorIcon = 'cinzaColor';
        return_.statusIcon = 'info-circle';
    }
    return return_;
}
function checkUserAdmin() {
    var userAdminFilter = jmespath.search(dadosUsuariosAtiv, "length([?Login=='"+userLogin+"'] | [?Administrador=='TRUE'])");
        userAdminCheck = ( userAdminFilter > 0 ) ? true : false;
    return userAdminCheck;
}