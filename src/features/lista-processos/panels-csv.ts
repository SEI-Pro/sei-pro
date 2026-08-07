// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/**
 * Lista de processos — panels, sheets, CSV.
 * (ponte temporária: jQuery/DOM legado; fatia do antigo body.js)
 */
import {
    checkLoadedTableSorter,
    getArrayProcessoRecebido,
    handleClientLoadPro,
    removeAllTags,
    storeGroupTablePro
} from './modules.js';

export function checkLoadConfigSheets(TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    if (typeof checkConfigValue !== 'undefined') { 
        if (
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
export function orderDivPanel(html, idOrder, name) {
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
export function insertDivPanelControleProc() {
    var sidebar = SeiPro.sei.supports
        ? SeiPro.sei.supports.sidebarLayout()
        : SeiPro.sei.adapter.isNewSEI();
    var sels = SeiPro.sei.selectors;
    var processForm = sels && sels.PROCESS_CONTROL_FORM;
    var localizationBar = sels && sels.LOCALIZATION_BAR;
    if (!processForm || !localizationBar) return;
    var elementControleProc = sidebar ? 'collapseTabelaProcesso' : 'frmProcedimentoControlar';
    var statusView = ( getOptionsPro(elementControleProc) == 'hide' ) ? 'none' : 'initial';
    var statusIconShow = ( getOptionsPro(elementControleProc) == 'hide' ) ? '' : 'display:none;';
    var statusIconHide = ( getOptionsPro(elementControleProc) == 'hide' ) ? 'display:none;' : '';
    var idControleProc = sidebar ? '.'+elementControleProc : '#'+elementControleProc;
    var idOrder = (getOptionsPro('orderPanelHome') && typeof jmespath !== 'undefined' && jmespath.search(getOptionsPro('orderPanelHome'), "[?name=='processosSEIPro'].index | length(@)") > 0) ? jmespath.search(getOptionsPro('orderPanelHome'), "[?name=='processosSEIPro'].index | [0]") : '';
    var htmlIconTable =     '<i class="controleProcPro '+(localStorage.getItem('seiSlim') ? 'fad fa-folders' : 'fas fa-folder-open')+' cinzaColor" style="margin: 0 10px 0 0; font-size: 1.1em;"></i>';
    var htmlToggleTable =   '<a class="controleProcPro newLink" id="'+elementControleProc+'_showIcon" onclick="toggleTablePro(\''+idControleProc+'\',\'show\')" onmouseover="return infraTooltipMostrar(\'Mostrar Tabela\');" onmouseout="return infraTooltipOcultar();" style="font-size: 11pt; '+statusIconShow+'"><i class="fas fa-plus-square cinzaColor"></i></a>'+
                            '<a class="controleProcPro newLink" id="'+elementControleProc+'_hideIcon" onclick="toggleTablePro(\''+idControleProc+'\',\'hide\')" onmouseover="return infraTooltipMostrar(\'Recolher Tabela\');" onmouseout="return infraTooltipOcultar();" style="font-size: 11pt; '+statusIconHide+'"><i class="fas fa-minus-square cinzaColor"></i></a>';
    var htmlDivPanel = '<div class="controleProcPro panelHomePro" style="display: inline-block; width: 100%;" id="processosSEIPro" data-order="'+idOrder+'"></div>';
    
    if (sidebar) $('#divFiltro, #collapseControle, #newFiltro, #divTabelaProcesso').addClass('collapseTabelaProcesso');

    if ($('.controleProcPro').length == 0) {
        $(localizationBar).css('width', '100%').addClass('titlePanelHome').append(htmlToggleTable).prepend(htmlIconTable);
        $(idControleProc).css('width', '100%');
        if (!sidebar) $(idControleProc).css('display', statusView);
        $('#panelHomePro').prepend(htmlDivPanel);
        $(processForm).moveTo('#processosSEIPro');
        $(localizationBar).moveTo('#processosSEIPro');
        if (sidebar && getOptionsPro(elementControleProc) == 'hide') $(idControleProc).addClass('displayNone');
        if (!checkLoadedTableSorter() && (typeof storeGroupTablePro() === 'undefined' || storeGroupTablePro() == '')) removeAllTags(false, 3);
    }
}
export function insertDivPanel() {
    var processForm = SeiPro.sei.selectors && SeiPro.sei.selectors.PROCESS_CONTROL_FORM;
    if ($('#panelHomePro').length == 0 && $('#tblMarcadores').length == 0 && processForm) { 
        $(processForm).after('<div id="panelHomePro" style="display: inline-block; width: 100%;"></div>'); 
        initSortDivPanel();
    }
}
export function initSortDivPanel(TimeOut = 9000) {
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
export function getTableProcessosCSV() {
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
    var pt = SeiPro.sei.selectors && SeiPro.sei.selectors.PROCESS_TABLE;
    if (!pt) return;
    var table = ($(pt.gerados).is(':visible')) ? $(pt.recebidos + ', ' + pt.gerados) : $(pt.recebidos);
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

export function copyTableResultProtocoloSEI() {
    var htmlTable = $('.tableResultProtocoloSEI')[0].outerHTML;
        copyToClipboardHTML(htmlTable);
}
export function downloadTableResultProtocoloSEI() {
    downloadTableCSV($('.tableResultProtocoloSEI'), 'PesquisaProtocolo_SEIPro');
}
export function initFilterTableProcessos(this_, TimeOut = 9000) {
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
export function filterTableProcessos(this_) {
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
