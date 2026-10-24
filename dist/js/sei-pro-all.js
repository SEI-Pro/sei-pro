const loadSEIProAll = true;
var logBackup = console.log;
var logMessages = [];
var pagesInfiniteSearch = [];
var frmPesquisaProtocolo = ($('#seiSearch').length) ? '#seiSearch' : '#frmPesquisaProtocolo';

function getTableInfiniteSearch(ifrView, formID, tableID, index) {
    // console.log(pagesInfiniteSearch, index, pagesInfiniteSearch);
    // isNewSEI vem do sei-functions-pro.js, que costuma chegar DEPOIS deste arquivo: resolvido no carregamento, o seletor
    // ficava 'div.paginas' no SEI 4/5, a paginacao nunca era trocada e a rolagem parava na 2a pagina
    var divPaginas = typeof isNewSEI !== 'undefined' && isNewSEI ? 'div.pesquisaPaginas' : 'div.paginas';
    if (pagesInfiniteSearch.length == 0 || $.inArray(index, pagesInfiniteSearch) === -1) {
        var form = ifrView.find(formID);
        var href = form.attr('action');
        var param = {};
            form.find("input, select").map(function () { 
                if ($(this).attr('name')) {
                    if ( $(this).is('[type="radio"]') || $(this).is('[type="checkbox"]') ) {
                        if ($(this).is(':checked')) {
                            param[$(this).attr('name')] = $(this).val();
                        }
                    } else {
                        param[$(this).attr('name')] = ($(this).val()) ? removeAcentos($(this).val()) : '';
                    }
                }
            });
            param['hdnInicio'] = index;
            pagesInfiniteSearch.push(index);
            htmlPro(ifrView.find(divPaginas), '<label class="loadRemovePag"><i class="fas fa-sync fa-spin"></i></label>', 'append');
            // console.log(param, href);

        $.ajax({ 
            method: 'POST',
            data: param,
            url: href
        }).done(function (html) {
            let $html = lerHtmlPro(html);
            var table = $html.find(tableID);
            if(table.length > 0) {
                table.each(function(index){
                    ifrView.find(tableID).last().after(this);
                });
            } else {
                param['hdnInicio'] = 0;
                $.ajax({  method: 'POST', data: param, url: href });
            }
            ifrView.find(divPaginas).after($html.find(divPaginas)).remove();
            startQuickViewSearch();
            // console.log('startQuickViewSearch');
        });
    }
}
function getInfiniteSearch() {
    var nrPage = parseInt($(isNewSEI ? 'div.pesquisaPaginas .pesquisaPaginaSelecionada' : 'div.paginas b').text()+'0');
    if ($(isNewSEI ? 'div.pesquisaPaginas a' : 'div.paginas span.pequeno').last().text() == 'Pr\u00F3xima') {
        getTableInfiniteSearch($('#divInfraAreaTela'), frmPesquisaProtocolo, isNewSEI ? 'table.pesquisaResultado' : 'table.resultado', nrPage);
    }  
}
function startPagesInfiniteSearch(index = false) {
    $(isNewSEI ? '#divInfraAreaTelaD' :  window).scroll(function () {
        // No SEI 4/5 quem rola e o #divInfraAreaTelaD e a janela fica parada; medir a janela ali dava verdadeiro
        // em qualquer rolagem (ate para cima). Mede o proprio elemento que rolou.
        var fimDaLista = (this === window)
            ? $(window).scrollTop() >= $(document).height() - $(window).height() - 120
            : this.scrollTop + this.clientHeight >= this.scrollHeight - 120;
        if (fimDaLista) {
            getInfiniteSearch();
        }
    });
}
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
        if ($(frmPesquisaProtocolo).length == 0) { 
            checkboxRangerSelectShift();
        }
    } else {
        setTimeout(function(){ 
            initRangerSelectShift(TimeOut - 100); 
            if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage'))console.log('Reload initRangerSelectShift'); 
        }, 500);
    }
}
function initSetMomentPtBr(TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    else if (TimeOut < 7000) { 
        if (typeof URL_SPRO !== 'undefined') $.getScript(URL_SPRO+"js/lib/moment.min.js"); 
    }
    if (typeof moment !== 'undefined' && typeof setMomentPtBr !== 'undefined') { 
        setMomentPtBr();
    } else {
        setTimeout(function(){ 
            initSetMomentPtBr(TimeOut - 100); 
            if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage'))console.log('Reload initSetMomentPtBr'); 
        }, 500);
    }
}
function initTableSorter(TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    // typeof moment: a extracao de texto das colunas de data (filterTextExtractDate) usa o moment, que entra por $.getScript
    // em paralelo com o tablesorter. Se ele chegasse depois, 'moment is not defined' abortava o setTableSorter (tabela sem
    // os botoes Baixar/Copiar/Pesquisar) e, na primeira chamada, o initSeiProAll inteiro.
    if (typeof corrigeTableSEI !== 'undefined' && typeof checkConfigValue !== 'undefined' && typeof jmespath !== 'undefined' && typeof moment !== 'undefined' && typeof $().tablesorter !== 'undefined') { 
        if (checkConfigValue('ordernartabela') && $(frmPesquisaProtocolo).length == 0) {
            setTableSorter();
        }
    } else {
        setTimeout(function(){ 
            if (typeof $().tablesorter === 'undefined' && TimeOut == 9000 && typeof URL_SPRO !== 'undefined') { $.getScript((URL_SPRO+"js/lib/jquery.tablesorter.combined.min.js")) }
            initTableSorter(TimeOut - 100); 
            if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage'))console.log('Reload initTableSorter'); 
        }, 500);
    }
}
function initInsertNewLinksMenu(TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    if (typeof checkConfigValue !== 'undefined' && typeof jmespath !== 'undefined') { 
        insertNewLinksMenu();
    } else {
        setTimeout(function(){ 
            initInsertNewLinksMenu(TimeOut - 100); 
            if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage'))console.log('Reload initInsertNewLinksMenu'); 
        }, 500);
    }
}
// Icones dos itens no menu do SEI 4/5, no padrao dos nativos (SVG 24x24, desenhos do Material Design Icons).
// A cor vem do link (currentColor), que o SEI pinta de #E7E7E7, a mesma dos SVGs nativos. O SEI 3 nao tem icones no menu.
var iconesMenuPro = {
    link: 'M10.59,13.41C11,13.8 11,14.44 10.59,14.83C10.2,15.22 9.56,15.22 9.17,14.83C7.22,12.88 7.22,9.71 9.17,7.76V7.76L12.71,4.22C14.66,2.27 17.83,2.27 19.78,4.22C21.73,6.17 21.73,9.34 19.78,11.29L18.29,12.78C18.3,11.96 18.17,11.14 17.89,10.36L18.36,9.88C19.54,8.71 19.54,6.81 18.36,5.64C17.19,4.46 15.29,4.46 14.12,5.64L10.59,9.17C9.41,10.34 9.41,12.24 10.59,13.41M13.41,9.17C13.8,8.78 14.44,8.78 14.83,9.17C16.78,11.12 16.78,14.29 14.83,16.24V16.24L11.29,19.78C9.34,21.73 6.17,21.73 4.22,19.78C2.27,17.83 2.27,14.66 4.22,12.71L5.71,11.22C5.7,12.04 5.83,12.86 6.11,13.65L5.64,14.12C4.46,15.29 4.46,17.19 5.64,18.36C6.81,19.54 8.71,19.54 9.88,18.36L13.41,14.83C14.59,13.66 14.59,11.76 13.41,10.59C13,10.2 13,9.56 13.41,9.17Z',
    historico: 'M13.5,8H12V13L16.28,15.54L17,14.33L13.5,12.25V8M13,3A9,9 0 0,0 4,12H1L4.96,16.03L9,12H6A7,7 0 0,1 13,5A7,7 0 0,1 20,12A7,7 0 0,1 13,19C11.07,19 9.32,18.21 8.06,16.94L6.64,18.36C8.27,20 10.5,21 13,21A9,9 0 0,0 22,12A9,9 0 0,0 13,3',
    pdf: 'M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3M9.5 11.5C9.5 12.3 8.8 13 8 13H7V15H5.5V9H8C8.8 9 9.5 9.7 9.5 10.5V11.5M14.5 13.5C14.5 14.3 13.8 15 13 15H10.5V9H13C13.8 9 14.5 9.7 14.5 10.5V13.5M18.5 10.5H17V11.5H18.5V13H17V15H15.5V9H18.5V10.5M12 10.5H13V13.5H12V10.5M7 10.5H8V11.5H7V10.5Z',
    lote: 'M22,4H14L12,2H6A2,2 0 0,0 4,4V16A2,2 0 0,0 6,18H22A2,2 0 0,0 24,16V6A2,2 0 0,0 22,4M2,6H0V11H0V20A2,2 0 0,0 2,22H20V20H2V6Z'
};
function iconeMenuPro(nome) {
    if (!isNewSEI || !iconesMenuPro[nome]) return '';
    // O desenho das pastas ocupa os 24px inteiros; a folga no viewBox o deixa do tamanho dos outros.
    var viewBox = nome == 'lote' ? '-1 -1 26 26' : '0 0 24 24';
    return '<svg class="iconMenuPro" width="24" height="24" viewBox="'+viewBox+'" aria-hidden="true"><path fill="currentColor" d="'+iconesMenuPro[nome]+'"/></svg>';
}
function insertNewLinksMenu() {
    // A trava olha o primeiro item desta lista, e nao a classe: o item "Agente de IA" (agente-ia/src/ponte/aba.ts)
    // usa a mesma classe newLinksMenuPro e, entrando antes, fazia estes quatro itens nunca aparecerem (desde a 2.0).
    if ($(idMenu).find('#pesquisaLinkPermanentePro').length == 0) {
        var newLinkMenu =  '<li><a id="pesquisaLinkPermanentePro" class="newLinksMenuPro" data-spro-click="initBoxSearchProtocoloSEI" data-spro-args="'+argsPro()+'">'+iconeMenuPro('link')+'<span>Pesquisar Link Permanente</span></a></li>';

        if (checkConfigValue('historicoproc')) newLinkMenu += '<li><a id="historicoProcessosPro" class="newLinksMenuPro" data-spro-click="getHistoryProcessosPro" data-spro-args="'+argsPro()+'">'+iconeMenuPro('historico')+'<span>Hist\u00F3rico de Processos Visitados</span></a></li>';
        if (checkConfigValue('ferramentaspdf')) newLinkMenu += '<li><a id="ferramentasPdfPro" class="newLinksMenuPro" href="'+URL_SPRO+'html/ferramentas-pdf.html" target="_blank" rel="noopener">'+iconeMenuPro('pdf')+'<span>Ferramentas de PDF</span></a></li>';
        if (checkConfigValue('proclote')) newLinkMenu += '<li><a id="processosLotePro" class="newLinksMenuPro" data-spro-click="abrirProcessosLotePro">'+iconeMenuPro('lote')+'<span>Processos em Lote</span></a></li>';
        if (checkConfigValue('ordenarmenu')) initMenuSEISortable();
        htmlPro($(idMenu), newLinkMenu, 'append');
    }
}
// A guarda do onclick antigo: o sei-pro-proc-lote.js nao carrega em toda tela (na Pesquisa, por
// exemplo), e ali o item do menu nao fazia nada, em silencio.
function abrirProcessosLotePro() {
    if (typeof initProcLoteModal === 'function') initProcLoteModal();
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
    var tableSorter = $('#divInfraAreaTabela table.infraTable, #frmEstatisticas table.infraTable').not('.tabelaControle, #tblTipoProcedimento');
    if (tableSorter.length > 0) {
        tableSorter.each(function(){
            if (typeof $(this).attr('id') === 'undefined') {
                $(this).attr('id','infraTable_'+randomString(4));
            }
        });

        tableSorter.each(function(){
            if ($(this).find('table').hasClass('infraTableOrdenacao')) { 
                $('#divInfraAreaTabela table.infraTable table.infraTableOrdenacao').each(function(){
                    $(this).after(document.createTextNode($(this).text())).remove();
                });
            }
            corrigeTableSEI(this);
            if (!$('#frmEstatisticas').length) $(this).css('background-color','#ccc').find("thead th:eq(0)").data("sorter", false);
            $(this).find('thead th').each(function(){
                if ($(this).text().trim().toLowerCase().indexOf('data') !== -1) { $(this).attr('data-date-format','mmddyyyy') }
            });

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
                        },
                        2: function (elem, table, cellIndex) {
                            var text = $(elem).text();
                            console.log(elem, table, cellIndex, text);
                            return text;
                        }
                    }
                : {
                    0: function (elem, table, cellIndex) {
                        return filterTextExtractDate(elem, table, cellIndex);
                    },
                    1: function (elem, table, cellIndex) {
                        return filterTextExtractDate(elem, table, cellIndex);
                    },
                    2: function (elem, table, cellIndex) {
                        return filterTextExtractDate(elem, table, cellIndex);
                    },
                    3: function (elem, table, cellIndex) {
                        return filterTextExtractDate(elem, table, cellIndex);
                    },
                    4: function (elem, table, cellIndex) {
                        return filterTextExtractDate(elem, table, cellIndex);
                    },
                    5: function (elem, table, cellIndex) {
                        return filterTextExtractDate(elem, table, cellIndex);
                    },
                    6: function (elem, table, cellIndex) {
                        return filterTextExtractDate(elem, table, cellIndex);
                    },
                    7: function (elem, table, cellIndex) {
                        return filterTextExtractDate(elem, table, cellIndex);
                    },
                    8: function (elem, table, cellIndex) {
                        return filterTextExtractDate(elem, table, cellIndex);
                    },
                    9: function (elem, table, cellIndex) {
                        return filterTextExtractDate(elem, table, cellIndex);
                    }
                };

            $(this).tablesorter({
                sortLocaleCompare : true,
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
                                    '   <button type="button" data-spro-click="downloadTablePro" data-icon="fas fa-download" style="padding: 0.1rem .5rem; font-size: 9pt;" data-value="Baixar" class="btn btn-sm btn-light">'+
                                    '       <i class="fas fa-download" style="padding-right: 3px; cursor: pointer; font-size: 10pt; color: #888;"></i>'+
                                    '       <span class="text">Baixar</span>'+
                                    '   </button>'+
                                    '   <button type="button" data-spro-click="copyTablePro" data-icon="fas fa-copy" style="padding: 0.1rem .5rem; font-size: 9pt;" data-value="Copiar" class="btn btn-sm btn-light">'+
                                    '       <i class="fas fa-copy" style="padding-right: 3px; cursor: pointer; font-size: 10pt; color: #888;"></i>'+
                                    '       <span class="text">Copiar</span>'+
                                    '   </button>'+
                                    '   <button type="button" data-spro-click="filterIfraTable" style="padding: 0.1rem .5rem; font-size: 9pt;" data-value="Pesquisar" class="btn btn-sm btn-light '+(_this.find('tr.tablesorter-filter-row').hasClass('hideme') ? '' : 'active')+'">'+
                                    '       <i class="fas fa-search" style="padding-right: 3px; cursor: pointer; font-size: 10pt;"></i>'+
                                    '       Pesquisar'+
                                    '   </button>'+
                                    '</div>'+
                                    // '<a class="newLink filterIfraTable '+(_this.find('tr.tablesorter-filter-row').hasClass('hideme') ? '' : 'newLink_active')+'" onclick="filterIfraTable(this)" onmouseover="return infraTooltipMostrar(\'Pesquisar na tabela\');" onmouseout="return infraTooltipOcultar();" style="left: 0; top: -20px; position: absolute;">'+
                                    // '   <i class="fas fa-search cinzaColor" style="padding-right: 3px; cursor: pointer; font-size: 12pt;"></i> Pesquisar'+
                                    // '</a>'+
                                    '';
                _this.find('thead .filterIfraTable').remove();
                htmlPro(_this.find('thead'), htmlFilter, 'prepend');
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
                    ($('#seiSearch').length ? 
                    '            <th>Url Processo</th>'+
                    '            <th>Url Documento</th>'+
                    '' : '')+
                    '        </tr>'+
                    '    </thead>'+
                    '    <tbody>';

    $(frmPesquisaProtocolo).find(isNewSEI ? '#conteudo table.pesquisaResultado tr' : '#conteudo table.resultado').each(function(i){
        var tr = isNewSEI ? $(this) : $(this).find('tr');
        var urlArvore = isNewSEI ? tr.find('a.protocoloNormal').attr('href') : tr.eq(0).find('a.arvore').attr('href');
        var paramsUrl = (typeof urlArvore !== 'undefined') ? getParamsUrlPro(url_host.replace('controlador.php','')+urlArvore) : false;
        var urlTable = (paramsUrl) ? url_host+'?acao=procedimento_trabalhar&id_procedimento='+paramsUrl.id_procedimento+(typeof paramsUrl.id_documento !== 'undefined' ? '&id_documento='+paramsUrl.id_documento : '') : false;
        if (isNewSEI && i % 3 == 0) {
            var nomeProcesso = (urlTable) ? '<a href="'+urlTable+'" target="_blank">'+tr.find('td.pesquisaTituloEsquerda span').text().replace('N\u00BA', '').trim()+'</a>' : tr.find('td.pesquisaTituloEsquerda span').text().replace('N\u00BA', '').trim();
                htmlTable +=    '       <tr>'+
                                '           <td>'+nomeProcesso+'</td>'+
                                ''+(!modePesquisaDProc ?
                                '           <td>'+tr.find('td.pesquisaTituloDireita').text().trim()+'</td>'+
                                '           <td>'+tr.next().find('td.pesquisaSnippet').text().trim().replace(/\n|\r/g, " ").replace(/;/g, ',')+'</td>'+
                                '           <td>'+tr.next().next().find('td.pesquisaMetatag').eq(0).find('a').text().trim()+'</td>'+
                                '           <td>'+tr.next().next().find('td.pesquisaMetatag').eq(1).find('a').text().trim()+'</td>'+
                                '           <td>'+tr.next().next().find('td.pesquisaMetatag').eq(2).text().replace('Inclus\u00E3o:', '').trim()+'</td>'+
                                '' : 
                                '           <td>'+tr.next().next().find('td.pesquisaMetatag').eq(0).find('a').text().trim()+'</td>'+
                                '           <td>'+tr.next().next().find('td.pesquisaMetatag').eq(1).find('a').text().trim()+'</td>'+
                                '           <td>'+tr.next().next().find('td.pesquisaMetatag').eq(2).text().replace('Inclus\u00E3o:', '').trim()+'</td>'+
                                '')+
                                ($('#seiSearch').length ? 
                                '            <td>'+window.location.href.split('md_')[0]+tr.find('td.pesquisaTituloEsquerda a.arvore').attr('href')+'</td>'+
                                '            <td>'+window.location.href.split('md_')[0]+tr.find('td.pesquisaTituloEsquerda a.protocoloNormal').eq(1).attr('href')+'</td>'+
                                '' : '')+
                                '       </tr>';
        } else if (!isNewSEI) {
            var nomeProcesso = (urlTable) ? '<a href="'+urlTable+'" target="_blank">'+tr.eq(0).find('td').eq(0).text().trim()+'</a>' : tr.eq(0).find('td').eq(0).text().trim();
                htmlTable +=    '       <tr>'+
                                '           <td>'+nomeProcesso+'</td>'+
                                ''+(!modePesquisaDProc ?
                                '           <td>'+tr.eq(0).find('td').eq(1).text().trim()+'</td>'+
                                '           <td>'+tr.eq(1).find('td').eq(0).text().trim().replace(/\n|\r/g, " ").replace(/;/g, ',')+'</td>'+
                                '           <td>'+tr.eq(2).find('td').eq(0).find('table').find('tr').eq(0).find('td').eq(0).find('a').text().trim()+'</td>'+
                                '           <td>'+tr.eq(2).find('td').eq(0).find('table').find('tr').eq(0).find('td').eq(1).find('a').text().trim()+'</td>'+
                                '           <td>'+tr.eq(2).find('td').eq(0).find('table').find('tr').eq(0).find('td').eq(2).text().replace('Data:', '').trim()+'</td>'+
                                '' : 
                                '           <td>'+tr.eq(1).find('td').eq(0).find('table').find('tr').eq(0).find('td').eq(0).find('a').text().trim()+'</td>'+
                                '           <td>'+tr.eq(1).find('td').eq(0).find('table').find('tr').eq(0).find('td').eq(1).find('a').text().trim()+'</td>'+
                                '           <td>'+tr.eq(1).find('td').eq(0).find('table').find('tr').eq(0).find('td').eq(2).text().replace('Data:', '').trim()+'</td>'+
                                '')+
                                ($('#seiSearch').length ? 
                                '            <td>'+window.location.href.split('md_')[0]+tr.eq(0).find('a').first().attr('href')+'</td>'+
                                '            <td>'+window.location.href.split('md_')[0]+tr.eq(0).find('a').eq(2).attr('href')+'</td>'+
                                '' : '')+
                                '       </tr>';
        }
    });

    htmlTable +=    '    </tbody>'+
                    '</table>';

    if (mode == 'download') {
        downloadTablePesquisa(this_, lerHtmlPro(htmlTable));
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
        _this.find('.text').text('Baixado lista...');
        _this.find('i').attr('class','fas fa-thumbs-up');
        setTimeout(function(){ 
            _this.find('.text').text(data.value);
            _this.find('i').attr('class',data.icon);
        }, 1500);

}
function setTablePesquisaDownload() {
    var htmlFilter =    '<div class="btn-group filterIfraTable" role="group" style="'+(typeof isNewSEI !== 'undefined' && isNewSEI ? 'right: 220px;top: 10px;z-index: 999;position: absolute;' : 'right: 0;top: -40px;z-index: 999;position: absolute;')+'">'+
                        '   <button type="button" data-spro-click="getTablePesquisaDownload" data-spro-args="'+argsPro('$el', 'download')+'" data-icon="fas fa-download" style="padding: 0.1rem .5rem; font-size: 9pt;" data-value="Baixar Lista" class="btn btn-sm btn-light">'+
                        '       <i class="fas fa-download" style="padding-right: 3px; cursor: pointer; font-size: 10pt; color: #888;"></i>'+
                        '       <span class="text">Baixar Lista</span>'+
                        '   </button>'+
                        '   <button type="button" data-spro-click="getTablePesquisaDownload" data-spro-args="'+argsPro('$el', 'copy')+'" data-icon="fas fa-copy" style="padding: 0.1rem .5rem; font-size: 9pt;" data-value="Copiar" class="btn btn-sm btn-light">'+
                        '       <i class="fas fa-copy" style="padding-right: 3px; cursor: pointer; font-size: 10pt; color: #888;"></i>'+
                        '       <span class="text">Copiar</span>'+
                        '   </button>'+
                        '   <button type="button" data-spro-click="downloadAllDocsSearch" data-icon="fas fa-download" style="padding: 0.1rem .5rem; font-size: 9pt;" data-value="Baixar Documentos" class="btn btn-sm btn-light">'+
                        '       <i class="fas fa-download" style="padding-right: 3px; cursor: pointer; font-size: 10pt; color: #888;"></i>'+
                        '       <span class="text">Baixar Documentos</span>'+
                        '   </button>'+
                        '</div>';

    var tablePesquisa = $(frmPesquisaProtocolo).find(typeof isNewSEI !== 'undefined' && isNewSEI ? '#conteudo .pesquisaBarra' : '#conteudo');
        tablePesquisa.css('position','relative').find('.filterIfraTable').remove();
        htmlPro(tablePesquisa, htmlFilter, 'prepend');
        if (typeof URL_SPRO !== 'undefined') $.getScript(URL_SPRO+"js/lib/moment.min.js"); 
}
function initTablePesquisaDownload(TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    var resultado = $(frmPesquisaProtocolo).find(typeof isNewSEI !== 'undefined' && isNewSEI ? '#conteudo table.pesquisaResultado' : '#conteudo table.resultado');
    if (resultado.length > 0) {
        setTablePesquisaDownload();
        if (typeof isNewSEI !== 'undefined' && !isNewSEI) initScrollToElement();
    } else {
        // A tabela de resultados da pesquisa pode ainda nao estar no DOM quando esta funcao roda.
        // Antes havia uma unica tentativa: se ela chegasse depois, os botoes "Baixar Lista",
        // "Copiar" e "Baixar Documentos" nunca eram injetados e so apareciam recarregando a
        // pagina ate acertar o timing. Passa a repetir a checagem como os demais init* do projeto.
        setTimeout(function () {
            initTablePesquisaDownload(TimeOut - 100);
            if (typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage')) console.log('Reload initTablePesquisaDownload => ' + TimeOut);
        }, 500);
    }
}
function initScrollToElement(TimeOut = 9000) {
    if (TimeOut <= 0 || (typeof isJanelaAuxiliarPro === 'function' ? isJanelaAuxiliarPro(parent) : parent.window.name != '')) { return; }
    if (typeof scrollToElement !== 'undefined') {
        scrollToElement($('html'), $(frmPesquisaProtocolo).find('#conteudo table.resultado'), 50);
    } else {
        setTimeout(function(){ 
            initScrollToElement(TimeOut - 100); 
            if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage'))console.log('Reload initScrollToElement => '+TimeOut); 
        }, 500);
    }
}
function initAppendIconFavorites(TimeOut = 9000) {
    var table = $('#frmRelBlocoProtocoloLista .infraTable, #frmAcompanhamentoLista .infraTable, #frmProcedimentoSobrestar .infraTable');
    if (TimeOut <= 0 || (typeof isJanelaAuxiliarPro === 'function' ? isJanelaAuxiliarPro(parent) : parent.window.name != '') ||  table.length == 0) { return; }
    // typeof jmespath: ver initPagesInfiniteSearch
    if (typeof getParamsUrlPro !== 'undefined' && typeof checkConfigValue !== 'undefined' && typeof jmespath !== 'undefined' && typeof htmlIconFavorites !== 'undefined' && typeof getStoreFavoritePro !== 'undefined') {
        if (checkConfigValue('gerenciarfavoritos')) {
            setAppendIconFavorites();
        }
    } else {
        setTimeout(function(){ 
            initAppendIconFavorites(TimeOut - 100); 
            if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage'))console.log('Reload initAppendIconFavorites => '+TimeOut); 
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
function setOnClickExcluirProcBloco() {
    var table = $('#frmRelBlocoProtocoloLista .infraTable');
    if (table.length > 0) {
        table.find('a[onclick*="acaoExcluir("]').on('click', function(event){
            var id_procedimento = $(event.currentTarget).attr('href').split('-')[1];
            var listProcessos = sessionStorageRestorePro('dadosSessionProcessoPro');
            var objIndexDoc = (!listProcessos) ? -1 : listProcessos.findIndex((obj => obj.listAndamento.id_procedimento == String(id_procedimento)));
            if (objIndexDoc !== -1) {
                listProcessos[objIndexDoc].listAndamento.historico_completo = false;
                sessionStorageStorePro('dadosSessionProcessoPro', listProcessos);
            }
        });
    }
}
function loadScriptEntidade() {
    // $.getScript(URL_SPRO+"js/sei-pro-icons.js");
    /*
    if (window.location.host.indexOf('.antaq.gov.br') !== -1 && !urlServerAtiv && !userHashAtiv) {
        initEmptyAtividades();
        $('.panelHome').find('.iconAtividade_update i').removeClass('fa-spin');
        $('#tabelaAtivPanel').attr('class','').css('text-align','center').html('<a class="newLink" onclick="getResendKey()" style="transform: scale(1.4);margin: 10px 0;"><i class="fas fa-key laranjaColor"></i> Solicitar chave de acesso</a>');
    }
    console.log('loadScriptEntidade');
    */
}
function appendIconEntidade() {
    if ($('.infraTituloLogoSistema').length > 0 && $('#iconEntidade').length == 0) {
        initGetConfigHost();
    }
}
function initGetConfigHost(TimeOut = 9000) {
    if (TimeOut <= 0 || (typeof isJanelaAuxiliarPro === 'function' ? isJanelaAuxiliarPro(parent) : parent.window.name != '')) { return; }
    if (typeof getConfigHost === 'function' && typeof urlServerAtiv !== 'undefined') {
        if (sessionStorage.getItem('configHost_Pro') !== null) {
            setConfigHost(JSON.parse(sessionStorage.getItem('configHost_Pro')), loadScriptEntidade);
        } else {
            getConfigHost(loadScriptEntidade);
        }
    } else {
        setTimeout(function(){ 
            initGetConfigHost(TimeOut - 100); 
            if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage'))console.log('Reload initIconEntidade => '+TimeOut); 
        }, 500);
    }
}
function initReplaceSelectAll(TimeOut = 12000) {
    if (TimeOut <= 0 || (typeof isJanelaAuxiliarPro === 'function' ? isJanelaAuxiliarPro(parent) : parent.window.name != '')) { return; }
    // typeof jmespath: ver initPagesInfiniteSearch
    if (typeof $().chosen !== 'undefined' && typeof verifyConfigValue === 'function' && typeof jmespath !== 'undefined') {
        if (parent.verifyConfigValue('substituiselecao') && $('#frmDocumentoGeracaoMultiplo').length == 0 ) { 
            $('select')
                .not('[multiple]')
                .not('#selStaIcone')
                .not('#filterTableHome')
                .not('#selectGroupTablePro')
                .not('#selMarcador')
                .filter(function() { 
                    return !($(this).css('visibility') == 'hidden' || $(this).css('display') == 'none' || typeof $(this).data('chosen') !== 'undefined')
                })
                .not('[name="selProcedimentos"]')
                .chosen({
                    placeholder_text_single: ' ',
                    no_results_text: 'Nenhum resultado encontrado',
                    normalize_search_text: function(text) {
                        return removeAcentos(text.toLowerCase());
                    }
                });
            chosenReparePosition();
        }
    } else {
        if (typeof $().chosen === 'undefined' && typeof URL_SPRO !== 'undefined') $.getScript(URL_SPRO+"js/lib/chosen.jquery.min.js");
        setTimeout(function(){ 
            initReplaceSelectAll(TimeOut - 100); 
            if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage'))console.log('Reload initReplaceSelectAll => '+TimeOut); 
        }, 500);
    }
}
function appendVersionSEIPro() {
    var logoSEI = $('#divInfraBarraSistemaE img[src*="sei_logo"]');
    if (typeof NAMESPACE_SPRO !== 'undefined' && !logoSEI.hasClass('versionSEIPro')) {
        logoSEI.attr('title', logoSEI.attr('title', )+' ('+NAMESPACE_SPRO+': Vers\u00E3o '+VERSION_SPRO+')').addClass('versionSEIPro');
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
function initRemovePaginacaoAll(TimeOut = 9000) {
    if (TimeOut <= 0 || (typeof isJanelaAuxiliarPro === 'function' ? isJanelaAuxiliarPro(parent) : parent.window.name != '')) { return; }
    // typeof jmespath: ver initPagesInfiniteSearch
    if (typeof verifyConfigValue !== 'undefined' && typeof jmespath !== 'undefined') {
        if (verifyConfigValue('removepaginacao')) {
            if ($('#frmAcompanhamentoLista').length > 0) {
                getTablePaginacao($('#divInfraAreaTela'), '#frmAcompanhamentoLista', '#divInfraAreaTabela table', 1);
            } else if ($('#frmProcedimentoSobrestar').length > 0) {
                getTablePaginacao($('#divInfraAreaTela'), '#frmProcedimentoSobrestar', '#divInfraAreaTabela table', 1);
            } else if ($('#frmBlocoLista').length > 0) {
                getTablePaginacao($('#divInfraAreaTela'), '#frmBlocoLista', '#divInfraAreaTabela table', 1);
            } else if ($('#frmProtocoloModeloLista').length > 0) {
                getTablePaginacao($('#divInfraAreaTela'), '#frmProtocoloModeloLista', '#divInfraAreaTabela table', 1);
            } else if ($('#frmTextoPadraoInternoLista').length > 0) {
                getTablePaginacao($('#divInfraAreaTela'), '#frmTextoPadraoInternoLista', '#divInfraAreaTabela table', 1);
            } else if ($('#frmContatoLista').length > 0) {
                getTablePaginacao($('#divInfraAreaTela'), '#frmContatoLista', '#divInfraAreaTabela table', 1);
            } else if ($('#frmMarcadorLista').length > 0) {
                getTablePaginacao($('#divInfraAreaTela'), '#frmMarcadorLista', '#divInfraAreaTabela table', 1);
            } else if ($('#frmContatoRelatorioTemporarios').length > 0) {
                getTablePaginacao($('#divInfraAreaTela'), '#frmContatoRelatorioTemporarios', '#divInfraAreaTabela table', 1);
            } else if ($('#frmProcedimentoRelatorioSigilosos').length > 0) {
                getTablePaginacao($('#divInfraAreaTela'), '#frmProcedimentoRelatorioSigilosos', '#divInfraAreaTabela table', 1);
            } else if ($('#frmUnidadeLista').length > 0) {
                getTablePaginacao($('#divInfraAreaTela'), '#frmUnidadeLista', '#divInfraAreaTabela table', 1);
            } else if ($('#frmAssinanteLista').length > 0) {
                getTablePaginacao($('#divInfraAreaTela'), '#frmAssinanteLista', '#divInfraAreaTabela table', 1);
            } else if ($('#frmGrupoContatoLista').length > 0) {
                getTablePaginacao($('#divInfraAreaTela'), '#frmGrupoContatoLista', '#divInfraAreaTabela table', 1);
            } else if ($('#frmGrupoUnidadeLista').length > 0) {
                getTablePaginacao($('#divInfraAreaTela'), '#frmGrupoUnidadeLista', '#divInfraAreaTabela table', 1);
            } else if ($('#frmHipoteseLegalLista').length > 0) {
                getTablePaginacao($('#divInfraAreaTela'), '#frmHipoteseLegalLista', '#divInfraAreaTabela table', 1);
            } else if ($('#frmUsuarioLista').length > 0) {
                getTablePaginacao($('#divInfraAreaTela'), '#frmUsuarioLista', '#divInfraAreaTabela table', 1);
            }
        }
    } else {
        setTimeout(function(){ 
            initRemovePaginacaoAll(TimeOut - 100); 
            if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage'))console.log('Reload initRemovePaginacaoAll => '+TimeOut); 
        }, 500);
    }
}
function initPagesInfiniteSearch(TimeOut = 9000) {
    if (TimeOut <= 0 || (typeof isJanelaAuxiliarPro === 'function' ? isJanelaAuxiliarPro(parent) : parent.window.name != '')) { return; }
    // verifyConfigValue le as opcoes com o jmespath do mundo da PAGINA e, sem ele, devolve sempre false. Na Pesquisa (e
    // nas demais telas que so tem o init_all.js) quem injeta o jmespath na pagina e o initSeiProAll, no mesmo instante
    // em que agenda esta funcao: o typeof jmespath do init_all.js roda no mundo isolado, onde o manifest ja o carregou,
    // e nunca injeta. Se o jmespath chegasse depois, a opcao era lida como desligada uma unica vez e a rolagem infinita
    // nao era ligada ate recarregar. Espera o jmespath como ja faz initTableSorter.
    if (typeof verifyConfigValue !== 'undefined' && typeof jmespath !== 'undefined') {
        if (verifyConfigValue('rolageminfinita') && $(frmPesquisaProtocolo).length > 0) {
            startPagesInfiniteSearch();
        }
    } else {
        setTimeout(function(){ 
            initPagesInfiniteSearch(TimeOut - 100); 
            if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage'))console.log('Reload initPagesInfiniteSearch => '+TimeOut); 
        }, 500);
    }
}
function initQuickViewSearch(TimeOut = 9000) {
    if (TimeOut <= 0 || (typeof isJanelaAuxiliarPro === 'function' ? isJanelaAuxiliarPro(parent) : parent.window.name != '')) { return; }
    if (typeof verifyConfigValue !== 'undefined') {
        if ($(frmPesquisaProtocolo).length > 0) {
            startQuickViewSearch();
        }
    } else {
        setTimeout(function(){ 
            initQuickViewSearch(TimeOut - 100); 
            if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage'))console.log('Reload initQuickViewSearch => '+TimeOut); 
        }, 500);
    }
}
function markQuickViewSearch(this_) {
    var _this = $(this_);
    $('#conteudo .resultado tr.infraTrAcessada').removeClass('infraTrAcessada');
    _this.closest('tr').addClass('infraTrAcessada');
}
// Dois handlers numa acao so: o onclick fazia markQuickViewSearch(this);openSEINrPro(this, nr).
function abrirVisualizacaoRapidaPro(el, nrSEI) {
    markQuickViewSearch(el);
    openSEINrPro(el, nrSEI);
}
function abrirAnexoRapidoPro(el) {
    markQuickViewSearch(el);
    openDialogAnexo(el);
}
function startQuickViewSearch() { 
    $('a.quickview').remove();
    $(isNewSEI ? '#conteudo .pesquisaTituloEsquerda a[href*="controlador.php?acao=documento_visualizar"]' : '#conteudo .resultado a[href*="controlador.php?acao=documento_visualizar"]').each(function(){
        var nrSEI = isNewSEI ? $(this).closest('tr').find('td.pesquisaTituloDireita a').text().trim() :  $(this).closest('tr').find('td.resTituloDireita').text().trim();
        var html = '<a class="quickview" style="font-size: 12px;" data-spro-tip="Visualiza\u00E7\u00E3o r\u00E1pida" data-spro-click="abrirVisualizacaoRapidaPro" data-spro-args="'+argsPro('$el', String(nrSEI))+'"><i style="margin: 0 3px;" class="fas fa-eye azulColor"></i></a>';
        htmlPro($(this), html, 'after');
    });
    $(isNewSEI ? '#conteudo .pesquisaTituloEsquerda a[href*="controlador.php?acao=documento_download_anexo"]' : '#conteudo .resultado a[href*="controlador.php?acao=documento_download_anexo"]').each(function(){
        var href = $(this).attr('href');
        var text = $(this).text();
        var html = '<a class="quickview" style="font-size: 12px;" data-spro-tip="Visualiza\u00E7\u00E3o r\u00E1pida" data-spro-click="abrirAnexoRapidoPro" data-url="'+href+'" data-title="'+text+'"><i style="margin: 0 3px;" class="fas fa-eye azulColor"></i></a>';
        htmlPro($(this), html, 'after');
    });
}
function downloadAllDocsSearch(this_) {
    var _this = $(this_);
    var data = _this.data();
        _this.find('.text').text('Baixado documentos...');
        _this.find('i').attr('class','fas fa-thumbs-up');
        setTimeout(function(){ 
            _this.find('.text').text(data.value);
            _this.find('i').attr('class',data.icon);
        }, 1500);

    $('tr:not(.infraDocBaixado) a.downloadview').remove();
    $(isNewSEI 
            ? '#conteudo tr:not(.infraDocBaixado) .pesquisaTituloEsquerda a[href*="controlador.php?acao=documento_visualizar"], #conteudo tr:not(.infraDocBaixado) .pesquisaTituloEsquerda a[href*="controlador.php?acao=documento_download_anexo"]' 
            : '#conteudo .resultado tr:not(.infraDocBaixado) a[href*="controlador.php?acao=documento_visualizar"], #conteudo .resultado tr:not(.infraDocBaixado) a[href*="controlador.php?acao=documento_download_anexo"]'
        ).each(function(index){
        var text = $(this).text().trim();
        var href = $(this).attr('href');
        var nrSEI = isNewSEI ? $(this).closest('tr').find('td.pesquisaTituloDireita a').text().trim() :  $(this).closest('tr').find('td.resTituloDireita').text().trim();
        var html = '<a class="downloadview" style="font-size: 12px;" data-spro-tip="Baixando documento..."><i style="margin: 0 3px;" class="fas fa-hourglass-half roxoColor"></i></a>';
        htmlPro($(this), html, 'after');
        var _this = $(this).closest('td').find('.downloadview');
        console.log(text, href, nrSEI);
        setTimeout(function(){
            if (typeof href !== 'undefined' && href.indexOf('?acao=documento_visualizar') !== -1) {
                getIDProtocoloSEI(nrSEI,  
                    function(html){
                        let $html = lerHtmlPro(html);
                        var param = getParamsUrlPro($html.find('#ifrArvore').attr('src'));
                            console.log(param);
                            openDialogDoc(param, true, _this);
                    }, 
                    function(){
                        _this.attr('data-spro-tip', 'Erro ao baixar documento').find('i').attr('class', 'fas fa-exclamation-circle vermelhoColor');
                    }
                );
            } else if (typeof href !== 'undefined' && href.indexOf('?acao=documento_download_anexo') !== -1) {
                var link = document.createElement('a');
                link.href = href;
                link.download = text;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                _this.attr('data-spro-tip', 'Documento baixado').find('i').attr('class', 'fas fa-download verdeColor');
                _this.closest('tr').addClass('infraTrAcessada').addClass('infraDocBaixado');
            }
        }, index*2000);
    });
}
function initObserveUrlPage(TimeOut = 9000) {
    if (TimeOut <= 0 || (typeof isJanelaAuxiliarPro === 'function' ? isJanelaAuxiliarPro(parent) : parent.window.name != '')) { return; }
    if (typeof getParamsUrlPro !== 'undefined') {
        observeUrlPage();
    } else {
        setTimeout(function(){ 
            initObserveUrlPage(TimeOut - 100); 
            if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage'))console.log('Reload initObserveUrlPage => '+TimeOut); 
        }, 500);
    }
}
function observeUrlPage() {
    var hash = window.location.hash;
    if (hash != '' && hash.indexOf('#') !== -1 && (hash.indexOf('/') !== -1 || hash.indexOf('@') !== -1) ) {
        var protocolo = hash.replace('#','');
            protocolo = (protocolo.indexOf('@') !== -1) ? protocolo.split('@')[1] : protocolo;
            protocolo = (protocolo == '') 
                        ? (hash.indexOf('@') !== -1) ? hash.replace('#','').split('@')[0] : protocolo
                        : protocolo;
        console.log('observeUrlPage',protocolo);
        if (typeof protocolo !== 'undefined' && protocolo !== null && protocolo != '') {
            var xhr = new XMLHttpRequest();
            var href = $('#frmProtocoloPesquisaRapida').attr('action');
            $.ajax({ 
                method: 'POST',
                data: { txtPesquisaRapida: protocolo },
                url: href,
                xhr: function() {
                    return xhr;
                },
                success: function(data) { 
                    var _return = getParamsUrlPro(xhr.responseURL);
                    if ( _return.id_protocolo != 0 && typeof _return.id_protocolo !== 'undefined' ) {
                        window.location.replace(xhr.responseURL);
                    }
                }
            });
        }
    }
}
function initSlimPro() {
    // Com o Estilo Avancado no pacote (marca posta pelo init_estilo.js), o interruptor e a paleta controlam o novo
    // e o estilo antigo fica desativado. O content script ouve os eventos abaixo e mantem o interruptor em dia.
    var estilo2 = document.documentElement.hasAttribute('data-spro-estilo2');
    var estiloLigado = estilo2 ? document.documentElement.hasAttribute('data-spro-tema-ativo') : !!localStorage.getItem('seiSlim');
    var htmlSlimPro =   '       <div data-ref="infraAcaoBarraSistema" style="display: inline-block;float: right;margin:3px 10px 0 0">'+
                        '           <div class="infraAncoraSigla" style="display:inline-block;transform:scale(0.7)" onmouseout="return infraTooltipOcultar();" onmouseover="return infraTooltipMostrar(\''+(estiloLigado ? 'Desativar estilo avan\u00E7ado' : 'Ativar estilo avan\u00E7ado')+'\')">'+
                        '               <input type="checkbox" onchange="'+(estilo2 ? "document.dispatchEvent(new CustomEvent('spro-estilo2-alternar'))" : 'changeSlimPro(this)')+'" name="infraAncoraSigla" class="infraLinkOrgao" id="changeSlimPro" tabindex="0" '+(estiloLigado ? 'checked' : '')+'>'+
                        '               <label class="infraAreaDados" for="changeSlimPro" style="border-color: #ffffff7a;"></label>'+
                        '           </div>'+
                        '           <i onclick="'+(estilo2 ? "document.dispatchEvent(new CustomEvent('spro-estilo2-paleta'))" : 'openStyleBoxSlimPro()')+'" onmouseout="return infraTooltipOcultar();" onmouseover="return infraTooltipMostrar(\''+(estilo2 ? 'Personalizar a apar\u00EAncia' : (localStorage.getItem('seiSlim') ? 'Escolher cor principal' : 'Ativar estilo avan\u00E7ado'))+'\')" class="fas fa-palette brancoColor" style="float: right;font-size: 16pt;cursor: pointer;"></i> '+
                        '       </div>';

    var htmlDarkMode =   '           <i onclick="setDarkModePro(this)" id="iconDarkMode" onmouseout="return infraTooltipOcultar();" onmouseover="return infraTooltipMostrar(\''+(localStorage.getItem('darkModePro') ? 'Desativar modo noturno' : 'Ativar modo noturno')+'\')" class="fas fa-'+(localStorage.getItem('darkModePro') ? 'house-day' : 'house-night')+' brancoColor" style="font-size: 16pt;cursor: pointer;position: absolute;margin: 5px -35px;"></i> ';

    $('div[data-ref="infraAcaoBarraSistema"]').remove();
    $(typeof isNewSEI !== 'undefined' && isNewSEI ? '#divInfraBarraSistemaPadraoD' : '#divInfraBarraSistemaD').append(htmlSlimPro);
    $(typeof isNewSEI !== 'undefined' && isNewSEI && localStorage.getItem('seiSlim') ? '#divInfraBarraSistemaPadraoD' : '#divInfraBarraSistemaD').prepend(htmlDarkMode);
    initStyleBoxSlimPro();
}
function initStyleBoxSlimPro(TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    if (typeof sessionStorageRestorePro !== 'undefined' ) { 
        if (sessionStorageRestorePro('seiSlim_openBox')) { 
            openStyleBoxSlimPro();
        }
        if (getOptionsPro('colorSlimPro')) {
            setColorSlimPro(getOptionsPro('colorSlimPro'));
        }
        $(document).ready(function () { initToolbarOnTop() });
    } else {
        setTimeout(function(){ 
            initStyleBoxSlimPro(TimeOut - 100); 
            if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage'))console.log('Reload initStyleBoxSlimPro'); 
        }, 500);
    }
}
function initMarcadorUserColor(TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    // typeof jmespath: ver initPagesInfiniteSearch
    if (typeof extractHexColor !== 'undefined' && typeof jmespath !== 'undefined') { 
        if (checkConfigValue('coresmarcadores')) {
            setMarcadorUserColor();
        }
    } else {
        setTimeout(function(){ 
            initMarcadorUserColor(TimeOut - 100); 
            if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage')) console.log('Reload initMarcadorUserColor'); 
        }, 500);
    }
}
function setMarcadorUserColor() {
    if ($('#frmMarcadorCadastro').length) {
        var txtNome = $('#txtNome');
        var oldColor = extractHexColor(txtNome.val());
            oldColor = (oldColor !== null) ? oldColor : '';
        var htmlUserColor = '<div style="position: absolute;top: 0;left: 63%;">'+
                            '   <label id="lblUserColor" for="txaUserColor" style="display: block;" class="infraLabelOpcional">Cor Personalizada:</label>'+
                            '   <input data-spro-change="changeMarcadorUserColor" type="color" value="'+oldColor+'">'+
                            '</div>';
        htmlPro(txtNome, htmlUserColor, 'after');
        replaceColorsIcons($('#selStaIcone a.dd-option'));
        replaceColorsIcons($('#selStaIcone a.dd-selected'));
    } else if ($('#frmGerenciarMarcador').length) {
        replaceColorsIcons($('#selMarcador a.dd-option'));
        replaceColorsIcons($('#selMarcador a.dd-selected'));
    } else if ($('#frmProcedimentoControlar #tblMarcadores').length) {
        $('span.infraImgPro[data-img*="/marcador_"]').each(function() { 
            var titleMarcador = $(this).closest('td').next().text().trim();
            $(this).addClass('tagUserColorPro').attr('data-color',true).find('img').attr('title',titleMarcador);
            $(this).closest('td').next().text(titleMarcador.replace(extractHexColor(titleMarcador),''));
        });
        replaceColorsIcons($('.tagUserColorPro[data-color="true"]'));        
    } else if ($('#frmMarcadorLista').length) {
        replaceColorsIcons($('#frmMarcadorLista td:nth-child(2) a[href="#"]'));
    } else {
        replaceColorsIcons($('a[href*="andamento_marcador_gerenciar"]'));
        if ($('#btnLiberarMarcador').length) {
            $('#btnLiberarMarcador').each(function() { 
                var titleMarcador = $(this).attr('title');
                $(this).addClass('tagUserColorPro').attr('data-color',true).find('img').attr('title',titleMarcador);
            });
            replaceColorsIcons($('#btnLiberarMarcador[data-color="true"]'));
        }
    }
}
function changeMarcadorUserColor(this_) {
    var _this = $(this_);
    var txtNome = $('#txtNome');
    var oldColor = extractHexColor(txtNome.val());
    var newText = (oldColor !== null && oldColor != '') ? txtNome.val().replace(oldColor[0], _this.val()) : txtNome.val()+' '+_this.val();
        txtNome.val(newText);
}
function checkBlankPageSEI() {
    var title = $('#divInfraBarraLocalizacao').text();
    var content = $('#divInfraAreaDados').text();
    var urlHome = $(isNewSEI ? '#infraMenu' : '#main-menu').find('a[href*="controlador.php?acao=procedimento_controlar"]').attr('href');
    setTimeout(function(){ 
        if (window.location.hash == '' && typeof title !== 'undefined' && typeof content !== 'undefined' && title.trim() == '' && content.trim() == '' && typeof urlHome !== 'undefined' && window.location.href.indexOf('controlador.php') === -1) {
            console.log('redirect checkBlankPageSEI'); 
            window.location.href = urlHome;
        }
    }, 3000);
}
function initCheckLoadJqueryUI() {
    setTimeout(function(){ 
        if (typeof checkLoadJqueryUI !== 'undefined') checkLoadJqueryUI();
    }, 2000);
}
function checkPageParent() {
    if ($('#frmProcedimentoCadastro').length > 0 && $('#frmProcedimentoCadastro').attr('action').indexOf('acao=procedimento_gerar&acao_origem=procedimento_gerar') !== -1) {
        $('body').addClass('seiSlim_view');
        var checkMenu = $('#divInfraAreaTelaE').is(':visible');
        $('#divInfraAreaTelaD').attr('style',(checkMenu ? 'width: 78% !important' : 'width: 99% !important'));
    }
}
function initInfraImg(TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    if (typeof setInfraImg !== 'undefined' ) { 
        setInfraImg();
    } else {
        setTimeout(function(){ 
            initInfraImg(TimeOut - 100); 
            if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage'))console.log('Reload initInfraImg'); 
        }, 500);
    }
}
function initQRCodeLib() {
    if ($('#ifrArvore').length > 0 && typeof $().qrcode !== 'function' && typeof URL_SPRO !== 'undefined') {
        $.getScript(URL_SPRO+"js/lib/jquery-qrcode-0.18.0.min.js");
    }
}
function initNewProcDefault(TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    // typeof jmespath: ver initPagesInfiniteSearch (setNewProcDefault le as opcoes uma unica vez)
    if ($('form#frmProcedimentoCadastro').length && typeof moment == 'function' && typeof jmespath !== 'undefined') {
        setNewProcDefault();
    } else if (!$('#frmProcedimentoControlar').length) {
        setTimeout(function(){ 
            if (TimeOut == 9000 && typeof moment === 'undefined' && typeof URL_SPRO !== 'undefined') $.getScript(URL_SPRO+"js/lib/moment.min.js");
            if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage')) console.log('Reload initInfraImg'); 
            initNewProcDefault(TimeOut - 100); 
        }, 500);
    }
}
function initConfigSEIPro() {
    if ($('form#frmInfraConfigurar').length && typeof URL_SPRO !== 'undefined') {
        // Construido por DOM API: o sanitizador do portao remove <iframe>.
        let ifrConfig = document.createElement('iframe');
        ifrConfig.id = 'ifrConfig';
        ifrConfig.src = URL_SPRO + 'html/options.html';
        ifrConfig.setAttribute('style', 'border: 0;margin: 20px auto;display: block;height: 800px');
        ifrConfig.setAttribute('width', '800');
        ifrConfig.setAttribute('frameborder', '0');
        ifrConfig.setAttribute('scrolling', 'yes');
        $('#ifrConfig').remove();
        $('#frmInfraConfigurar').after(ifrConfig);
        setTimeout(() => {
            let height = $('#ifrConfig').offset().top + 20;
            let cssHeigth = `calc(100vh - ${height}px)`;
            if ($('body').height() - height > 600) $('#ifrConfig').css('height', cssHeigth);
            console.log(height);
        }, 500);
    }
}
function initCaixaSelecaoUnidadesSEI(TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    // typeof jmespath: ver initPagesInfiniteSearch. O checkHostLimit tambem le 'disablequery' pelo jmespath e, sem ele,
    // devolve sempre false: avaliado no initSeiProAll, no mesmo instante em que o jmespath e pedido, montava a caixa (e
    // fazia a consulta a troca de unidade) mesmo com as consultas adicionais desativadas. Por isso fica aqui dentro.
    if (typeof verifyConfigValue !== 'undefined' && typeof checkHostLimit !== 'undefined' && typeof jmespath !== 'undefined' && verifyConfigValue('trocaunidade') && typeof getUnidadesPermissaoSEI === 'function') {
        if (!checkHostLimit() && !$('#ifrArvore').length) { getUnidadesPermissaoSEI() }
    } else {
        setTimeout(function(){ 
            initCaixaSelecaoUnidadesSEI(TimeOut - 100); 
            if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage')) console.log('Reload initCaixaSelecaoUnidadesSEI'); 
        }, 500);
    }
}
function initSeiProAll() {
    if (typeof jmespath === 'undefined' && typeof URL_SPRO !== 'undefined') $.getScript(URL_SPRO+"js/lib/jmespath.min.js");
    if (typeof DOMPurify === 'undefined' && typeof URL_SPRO !== 'undefined') $.getScript(URL_SPRO+"js/lib/purify.min.js");
    if (typeof moment === 'undefined' && typeof URL_SPRO !== 'undefined') $.getScript(URL_SPRO+"js/lib/moment.min.js");
    if (typeof $.tablesorter === 'undefined' && typeof URL_SPRO !== 'undefined') $.getScript(URL_SPRO+"js/lib/jquery.tablesorter.combined.min.js");
    if (typeof $().chosen === 'undefined' && typeof URL_SPRO !== 'undefined') $.getScript(URL_SPRO+"js/lib/chosen.jquery.min.js"); 

    if (typeof checkHostLimit !== 'undefined') initCaixaSelecaoUnidadesSEI();
    if (!!localStorage.getItem('seiSlim')) initInfraImg();
    checkPageParent();
    setTimeout(() => { initMarcadorUserColor() }, 500);
    if (typeof isNewSEI !== 'undefined' && !isNewSEI) initNewProcDefault();
    appendVersionSEIPro();
    initTableSorter();
    repairLnkControleProcesso();
    initRangerSelectShift();
    initInsertNewLinksMenu();
    initSetMomentPtBr();
    initTablePesquisaDownload();
    initReplaceSelectAll();
    initAppendIconFavorites();
    initQuickViewSearch();
    initObserveUrlPage();
    initSlimPro();
    initCheckLoadJqueryUI();
    initQRCodeLib();
    setOnClickExcluirProcBloco();
    setTimeout(() => { 
        initConfigSEIPro();
        initRemovePaginacaoAll();
        initPagesInfiniteSearch();
    }, 1000);
    // initReplaceNewIconsBar();
    // observeIfrArvore();
    //checkBlankPageSEI();
    if (typeof isSEI_5 !== 'undefined' && isSEI_5) $.getScript(URL_SPRO+"js/lib/modalLink.js");

    if (typeof NAMESPACE_SPRO !== 'undefined' && NAMESPACE_SPRO != 'SEI Pro Lab') {
        console.log = function() { 
            logMessages.push.apply(logMessages, arguments);
            logBackup.apply(console, arguments);
        };
        
        window.onerror = function(a, b, c, d, e) {
            debugScreen = true;
            appendDebugReport();
            console.log({
                message: a,
                source: b,
                lineno: c,
                colno: d,
                error: e.message,
                stack: e.stack.replace(/(?:\r\n|\r|\n)/g, "<br>"+"&emsp;".repeat(24))
            });
        };
    }
}
// Mesma corrida do initSeiPro (ver initSeiProAposFunctions, no sei-pro.js): este arquivo e o
// sei-functions-pro.js entram por $.getScript e executam na ordem em que terminam de carregar. Medido no
// SEI 4.1.5: este arquivo, pedido DEPOIS do sei-functions-pro.js, executou antes dele. Nesse caso as
// guardas typeof abaixo pulam em silencio a caixa de troca de unidade (checkHostLimit), o modalLink do
// SEI 5 (isSEI_5) e a versao no logo (NAMESPACE_SPRO). Se o sei-functions-pro.js ja chegou, nada muda.
// O purify.min.js corre do mesmo jeito (init_all.js): sem ele, o htmlPro aborta a insercao -- a barra
// da pesquisa e os icones de visualizacao rapida sumiam (medido no SEI SP 4.1.5 em 22/10/2026).
function initSeiProAllAposFunctions(TimeOut = 10000) {
    if ((typeof checkHostLimit === 'undefined' || typeof DOMPurify === 'undefined') && TimeOut > 0) {
        setTimeout(function(){ initSeiProAllAposFunctions(TimeOut - 100) }, 100);
        return;
    }
    initSeiProAll();
}
$(document).ready(function () { initSeiProAllAposFunctions() });