function repairLnkControleProcesso() {
    if (typeof $('#lnkControleProcessos').attr('onclick') !== 'undefined') {
        var lnk = $('#lnkControleProcessos').attr('onclick').match(/'(.*?)'/);
        var url = lnk ? lnk[0].replace(/'/g, '') : false;
        if (url) { $('#lnkControleProcessos').attr('href', url).removeAttr('onclick') }
    }
}
function initRangerSelectShift(TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    if (typeof checkboxRangerSelectShift !== 'undefined' ) { 
        if ($('#frmPesquisaProtocolo').length == 0) { 
            checkboxRangerSelectShift();
        }
    } else {
        setTimeout(function(){ 
            initRangerSelectShift(TimeOut - 100); 
            console.log('Reload initRangerSelectShift'); 
        }, 500);
    }
}
function initHideMenuSistemaView(TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    if (typeof getOptionsPro !== 'undefined' && typeof hideMenuSistemaView !== 'undefined' && typeof checkConfigValue !== 'undefined') { 
        if (checkConfigValue('menususpenso')) {
            hideMenuSistemaView();
        }
    } else {
        setTimeout(function(){ 
            initHideMenuSistemaView(TimeOut - 100); 
            console.log('Reload initHideMenuSistemaView'); 
        }, 500);
    }
}
function initSetMomentPtBr(TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    else if (TimeOut < 7000) { 
        $.getScript(URL_SEIPRO+"js/lib/moment.min.js"); 
    }
    if (typeof moment !== 'undefined' && typeof setMomentPtBr !== 'undefined') { 
        setMomentPtBr();
    } else {
        setTimeout(function(){ 
            initSetMomentPtBr(TimeOut - 100); 
            console.log('Reload initSetMomentPtBr'); 
        }, 500);
    }
}
function initTableSorter(TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    if (typeof corrigeTableSEI !== 'undefined' && typeof checkConfigValue !== 'undefined' && typeof $().tablesorter !== 'undefined') { 
        if (checkConfigValue('ordernartabela') && $('#frmPesquisaProtocolo').length == 0) {
            setTableSorter();
            console.log('initTableSorter'); 
        }
    } else {
        setTimeout(function(){ 
            initTableSorter(TimeOut - 100); 
            console.log('Reload initTableSorter'); 
        }, 500);
    }
}
function initInsertNewLinksMenu(TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    if (typeof checkConfigValue !== 'undefined') { 
        insertNewLinksMenu();
    } else {
        setTimeout(function(){ 
            initInsertNewLinksMenu(TimeOut - 100); 
            console.log('Reload initInsertNewLinksMenu'); 
        }, 500);
    }
}
function insertNewLinksMenu() {
    if ($('#divInfraAreaTelaE #main-menu').find('.newLinksMenuPro').length == 0) {
        var newLinkMenu =  '<li><a id="pesquisaLinkPermanentePro" class="newLinksMenuPro" onclick="initBoxSearchProtocoloSEI()">Pesquisar Link Permanente</a></li>';

        if (checkConfigValue('historicoproc')) {
            newLinkMenu += '<li><a id="historicoProcessosPro" class="newLinksMenuPro" onclick="getHistoryProcessosPro()">Hist\u00F3rico de Processos Visitados</a></li>';
        }
            $('#divInfraAreaTelaE #main-menu').append(newLinkMenu);
    }
}
function setTableSorter() {
    var observerFilterTable = new MutationObserver(function(mutations) {
        var _this = $(mutations[0].target);
        var _parent = _this.closest('table');
        var iconFilter = _parent.find('.filterIfraTable');
        var checkIconFilter = iconFilter.hasClass('active');
        var hideme = _this.hasClass('hideme');
        if (hideme && checkIconFilter) {
            iconFilter.removeClass('active');
        }
    });
    var tableSorter = $('#divInfraAreaTabela table.infraTable').not('.tabelaControle, #tblTipoProcedimento');
    if (tableSorter.length > 0) {
        tableSorter.each(function(){
            if (typeof $(this).attr('id') === 'undefined') {
                $(this).attr('id','infraTable_'+randomString(4));
            }
        });
        tableSorter.each(function(){
            if ($(this).find('table').hasClass('infraTableOrdenacao')) { 
                $('#divInfraAreaTabela table.infraTable table.infraTableOrdenacao').each(function(){
                    $(this).after($(this).text()).remove();
                });
            }
            corrigeTableSEI(this);
            $(this).css('background-color','#ccc').find("thead th:eq(0)").data("sorter", false);
            $(this).find('thead th').each(function(){
                if ($(this).text().trim() == 'Data/Hora') { $(this).attr('data-date-format','mmddyyyy') }
            })

            var headerTdCheck = ($('#lnkInfraCheck').length > 0) ? { 0: { sorter: false, filter: false } } : null;
            var textExtraction = ($('#tblProcessosDetalhado').length > 0) ? 
                    {
                        1: function (elem, table, cellIndex) {
                            var text_return = '';
                            $(elem).find('img').each(function(){
                                var prioridade = $(this).attr('src').indexOf('prioridade') != -1 ? '1' : '2';
                                var texttip = $(this).closest('a').attr('onmouseover');
                                    texttip = (typeof texttip !== 'undefined') ? texttip : $(this).attr('onmouseover');
                                    texttip = (typeof texttip !== 'undefined') ? extractTooltip(texttip) : ''; 
                                text_return += prioridade+' '+texttip;
                            });
                            return (text_return == '') ? '3' : text_return;
                        } 
                    }
                : null;

            $(this).tablesorter({
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
                headers: headerTdCheck,
                dateFormat: 'uk',
                textExtraction: textExtraction
            }).on("sortEnd", function (event, data) {
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
            setTimeout(function(){ 
                var htmlFilter =    '<div class="btn-group filterIfraTable" role="group" style="left: 0; top: -20px;z-index: 999; position: absolute;">'+
                                    '   <button type="button" onclick="downloadTablePro(this)" data-icon="fas fa-download" style="padding: 0.1rem .5rem; font-size: 9pt;" data-value="Baixar" class="btn btn-sm btn-light">'+
                                    '       <i class="fas fa-download" style="padding-right: 3px; cursor: pointer; font-size: 10pt; color: #888;"></i>'+
                                    '       <span class="text">Baixar</span>'+
                                    '   </button>'+
                                    '   <button type="button" onclick="copyTablePro(this)" data-icon="fas fa-copy" style="padding: 0.1rem .5rem; font-size: 9pt;" data-value="Copiar" class="btn btn-sm btn-light">'+
                                    '       <i class="fas fa-copy" style="padding-right: 3px; cursor: pointer; font-size: 10pt; color: #888;"></i>'+
                                    '       <span class="text">Copiar</span>'+
                                    '   </button>'+
                                    '   <button type="button" onclick="filterIfraTable(this)" style="padding: 0.1rem .5rem; font-size: 9pt;" data-value="Pesquisar" class="btn btn-sm btn-light '+(_this.find('tr.tablesorter-filter-row').hasClass('hideme') ? '' : 'active')+'">'+
                                    '       <i class="fas fa-search" style="padding-right: 3px; cursor: pointer; font-size: 10pt;"></i>'+
                                    '       Pesquisar'+
                                    '   </button>'+
                                    '</div>'+
                                    // '<a class="newLink filterIfraTable '+(_this.find('tr.tablesorter-filter-row').hasClass('hideme') ? '' : 'newLink_active')+'" onclick="filterIfraTable(this)" onmouseover="return infraTooltipMostrar(\'Pesquisar na tabela\');" onmouseout="return infraTooltipOcultar();" style="left: 0; top: -20px; position: absolute;">'+
                                    // '   <i class="fas fa-search cinzaColor" style="padding-right: 3px; cursor: pointer; font-size: 12pt;"></i> Pesquisar'+
                                    // '</a>'+
                                    '';
                _this.find('thead .filterIfraTable').remove();
                _this.find('thead').prepend(htmlFilter);
                observerFilterTable.observe(filter, {
                    attributes: true
                });

                if ($('#frmProcedimentoAtribuicaoLista').length > 0) {
                    $('#divInfraAreaDados').css('margin-bottom','20px');
                }

                if (tableSorter.find('thead .tablesorter-filter-row td').length > tableSorter.find('thead .tablesorter-headerRow th:visible').length) {
                    tableSorter.find('thead .tablesorter-filter-row td:last-child').remove();
                    console.log('removeLastTD');
                }
            }, 500);
        });
    }
}
function getTablePesquisaDownload(this_, mode){
    var modePesquisaDProc = ($('input[name="rdoPesquisarEm"]:checked').val() == 'P') ? true: false;
    var htmlTable = '<table>'+
                    '    <thead>'+
                    '        <tr>'+
                    '            <th>Pesquisa</th>'+
                    ''+(!modePesquisaDProc ?
                    '            <th>N\u00FAmero SEI</th>'+
                    '            <th>Descri\u00E7\u00E3o</th>'+
                    '' : '')+
                    '            <th>Unidade Geradora</th>'+
                    '            <th>Usu\u00E1rio</th>'+
                    '            <th>Data</th>'+
                    '        </tr>'+
                    '    </thead>'+
                    '    <tbody>';

    $('#frmPesquisaProtocolo').find('#conteudo table.resultado').each(function(){
        var tr = $(this).find('tr');
        var urlArvore = tr.eq(0).find('a.arvore').attr('href');
        var params = (typeof urlArvore !== 'undefined') ? getParamsUrlPro(url_host.replace('controlador.php','')+urlArvore) : false;
        var urlTable = (params) ? url_host+'?acao=procedimento_trabalhar&id_procedimento='+params.id_procedimento+'&id_documento='+params.id_documento : false;
        var nomeProcesso = (urlTable) ? '<a href="'+urlTable+'" target="_blank">'+tr.eq(0).find('td').eq(0).text().trim()+'</a>' : tr.eq(0).find('td').eq(0).text().trim();
        htmlTable +=    '       <tr>'+
                        '           <td>'+nomeProcesso+'</td>'+
                        ''+(!modePesquisaDProc ?
                        '           <td>'+tr.eq(0).find('td').eq(1).text().trim()+'</td>'+
                        '           <td>'+tr.eq(1).find('td').eq(0).text().trim().replace(/\n|\r/g, " ")+'</td>'+
                        '           <td>'+tr.eq(2).find('td').eq(0).find('table').find('tr').eq(0).find('td').eq(0).find('a').text().trim()+'</td>'+
                        '           <td>'+tr.eq(2).find('td').eq(0).find('table').find('tr').eq(0).find('td').eq(1).find('a').text().trim()+'</td>'+
                        '           <td>'+tr.eq(2).find('td').eq(0).find('table').find('tr').eq(0).find('td').eq(2).text().replace('Data:', '').trim()+'</td>'+
                        '' : 
                        '           <td>'+tr.eq(1).find('td').eq(0).find('table').find('tr').eq(0).find('td').eq(0).find('a').text().trim()+'</td>'+
                        '           <td>'+tr.eq(1).find('td').eq(0).find('table').find('tr').eq(0).find('td').eq(1).find('a').text().trim()+'</td>'+
                        '           <td>'+tr.eq(1).find('td').eq(0).find('table').find('tr').eq(0).find('td').eq(2).text().replace('Data:', '').trim()+'</td>'+
                        '')+
                        '       </tr>';
    });

    htmlTable +=    '    </tbody>'+
                    '</table>';

    if (mode == 'download') {
        downloadTablePesquisa(this_, $(htmlTable));
    } else if (mode == 'copy') {
        copyTablePesquisa(this_, htmlTable);
    }
}
function copyTablePesquisa(this_, table){
    var _this = $(this_);
    var data = _this.data();
    copyToClipboardHTML(table);
    _this.find('.text').text('Copiado...');
    _this.find('i').attr('class','fas fa-thumbs-up');
    setTimeout(function(){ 
        _this.find('.text').text(data.value);
        _this.find('i').attr('class',data.icon);
    }, 1500);
}
function downloadTablePesquisa(this_, table){
    var _this = $(this_);
    var data = _this.data();
    downloadTableCSV(table, 'Pesquisa_SEIPro');
    _this.find('.text').text('Baixado...');
    _this.find('i').attr('class','fas fa-thumbs-up');
    setTimeout(function(){ 
        _this.find('.text').text(data.value);
        _this.find('i').attr('class',data.icon);
    }, 1500);

}
function setTablePesquisaDownload() {
    var htmlFilter =    '<div class="btn-group filterIfraTable" role="group" style="right: 0;top: -40px;z-index: 999;position: absolute;">'+
                        '   <button type="button" onclick="getTablePesquisaDownload(this, \'download\')" data-icon="fas fa-download" style="padding: 0.1rem .5rem; font-size: 9pt;" data-value="Baixar" class="btn btn-sm btn-light">'+
                        '       <i class="fas fa-download" style="padding-right: 3px; cursor: pointer; font-size: 10pt; color: #888;"></i>'+
                        '       <span class="text">Baixar</span>'+
                        '   </button>'+
                        '   <button type="button" onclick="getTablePesquisaDownload(this, \'copy\')" data-icon="fas fa-copy" style="padding: 0.1rem .5rem; font-size: 9pt;" data-value="Copiar" class="btn btn-sm btn-light">'+
                        '       <i class="fas fa-copy" style="padding-right: 3px; cursor: pointer; font-size: 10pt; color: #888;"></i>'+
                        '       <span class="text">Copiar</span>'+
                        '   </button>'+
                        '   </button>'+
                        '</div>';

    var tablePesquisa = $('#frmPesquisaProtocolo').find('#conteudo');
        tablePesquisa.css('position','relative').find('.filterIfraTable').remove();
        tablePesquisa.prepend(htmlFilter);
        $.getScript(URL_SEIPRO+"js/lib/moment.min.js"); 
}
function initTablePesquisaDownload() {
    if ($('#frmPesquisaProtocolo').find('#conteudo table.resultado').length > 0) {
        setTablePesquisaDownload();
    }
}
function initAppendIconFavorites(TimeOut = 9000) {
    var table = $('#frmRelBlocoProtocoloLista .infraTable, #frmAcompanhamentoLista .infraTable, #frmProcedimentoSobrestar .infraTable');
    if (TimeOut <= 0 || parent.window.name != '' || table.length == 0) { return; }
    if (typeof getParamsUrlPro !== 'undefined' && typeof checkConfigValue !== 'undefined' && typeof htmlIconFavorites !== 'undefined') {
        if (checkConfigValue('gerenciarfavoritos')) {
            setAppendIconFavorites();
        }
    } else {
        setTimeout(function(){ 
            initAppendIconFavorites(TimeOut - 100); 
            console.log('Reload initAppendIconFavorites', TimeOut); 
        }, 500);
    }
}
function setAppendIconFavorites() {
    var table = $('#frmRelBlocoProtocoloLista .infraTable, #frmAcompanhamentoLista .infraTable, #frmProcedimentoSobrestar .infraTable');
    if (table.length > 0) {
        table.find('tbody tr').each(function(){
            var _this = $(this);
            var td = _this.find('td').eq(2);
            var id_procedimento = td.find('a[href*="acao=procedimento_trabalhar"]').attr('href');
                id_procedimento = (typeof id_procedimento !== 'undefined') ? String(getParamsUrlPro(id_procedimento).id_procedimento) : false;
            var iconStar = (id_procedimento) ? htmlIconFavorites(id_procedimento, 'left') : '';
                td.find('.iconFavoritePro').remove();
                td.prepend(iconStar);
        });
    }
}
function appenIconPRF(){
    var iconPRF = '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAeCAYAAAA2Lt7lAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA65pVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ4IDc5LjE2NDAzNiwgMjAxOS8wOC8xMy0wMTowNjo1NyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjAyMCBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NDdDQzJGMzZGMTVDMTFFQjlENEVFN0Y5NDlERUE4NzUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NDdDQzJGMzdGMTVDMTFFQjlENEVFN0Y5NDlERUE4NzUiPiA8ZGM6dGl0bGU+IDxyZGY6QWx0PiA8cmRmOmxpIHhtbDpsYW5nPSJ4LWRlZmF1bHQiPnNlaS1wcm8taWNvbjwvcmRmOmxpPiA8L3JkZjpBbHQ+IDwvZGM6dGl0bGU+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjUzN0FDMEZGRjE1NTExRUI5RDRFRTdGOTQ5REVBODc1IiBzdFJl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" style="margin-left: 10px;" id="iconPRF">';
    if ($('.infraTituloLogoSistema').length > 0 && $('#iconPRF').length == 0 && window.location.host.indexOf('.prf.gov.br') !== -1) {
        $('.infraTituloLogoSistema').before(iconPRF);
    }
}
function initReplaceSelectAll(TimeOut = 12000) {
    if (TimeOut <= 0 || parent.window.name != '') { return; }
    if (typeof $().chosen !== 'undefined' && typeof verifyConfigValue === 'function') {
        if (parent.verifyConfigValue('substituiselecao') && $('#frmDocumentoGeracaoMultiplo').length == 0 ) { 
            $('select:visible').not('[multiple="multiple"]').not('[name="selProcedimentos"]').chosen({
                placeholder_text_single: ' ',
                no_results_text: 'Nenhum resultado encontrado'
            });
            chosenReparePosition();
        }
    } else {
        if (typeof $().chosen === 'undefined') { 
            $.getScript(URL_SEIPRO+"js/lib/chosen.jquery.min.js");
            console.log('@load chosen');
        }
        setTimeout(function(){ 
            initReplaceSelectAll(TimeOut - 100); 
            console.log('Reload initReplaceSelectAll', TimeOut); 
        }, 500);
    }
}
function appendVersionSEIPro() {
    var logoSEI = $('#divInfraBarraSistemaE img[src*="sei_logo"]');
    if (!logoSEI.hasClass('versionSEIPro')) {
        logoSEI.attr('title', logoSEI.attr('title', )+' (SEI Pro Vers\u00E3o '+VERSION_SEIPRO+')').addClass('versionSEIPro');
    }
}
function filterIfraTable(this_) {
    var _this = $(this_);
    var _parent = _this.closest('thead');
    var table = _this.closest('table');
    var filter = _parent.find('.tablesorter-filter-row');
    if (_this.hasClass('active')) {
        filter.addClass('hideme');
        _this.removeClass('active');
        table.trigger('filterReset');
    } else {
        filter.removeClass('hideme').find('input:visible').eq(1).focus();
        _this.addClass('active');
    }
}
function initSeiProAll() {
    appenIconPRF();
    appendVersionSEIPro();
    initTableSorter();
    repairLnkControleProcesso();
    initRangerSelectShift();
    initHideMenuSistemaView();
    initInsertNewLinksMenu();
    initSetMomentPtBr();
    initTablePesquisaDownload();
    initReplaceSelectAll();
    initAppendIconFavorites();
    // observeIfrArvore();
    console.log('initSeiProAll');
}
$(document).ready(function () { initSeiProAll() });