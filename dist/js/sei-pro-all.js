var logBackup = console.log;
var logMessages = [];
var pagesInfiniteSearch = [];
var frmPesquisaProtocolo = ($('#seiSearch').length) ? '#seiSearch' : '#frmPesquisaProtocolo';
var divPaginas = isNewSEI ? 'div.pesquisaPaginas' : 'div.paginas';

function getTableInfiniteSearch(ifrView, formID, tableID, index) {
    console.log(pagesInfiniteSearch, index, pagesInfiniteSearch);
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
            ifrView.find(divPaginas).append('<label class="loadRemovePag"><i class="fas fa-sync fa-spin"></i></label>');
            console.log(param, href);

        $.ajax({ 
            method: 'POST',
            data: param,
            url: href
        }).done(function (html) {
            let $html = $(html);
            var table = $html.find(tableID);
            if(table.length > 0) {
                table.each(function(index){
                    ifrView.find(tableID).last().after($(this)[0].outerHTML);
                });
            } else {
                param['hdnInicio'] = 0;
                $.ajax({  method: 'POST', data: param, url: href });
            }
            ifrView.find(divPaginas).after($html.find(divPaginas)).remove();
            startQuickViewSearch();
            console.log('startQuickViewSearch');
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
       if ($(window).scrollTop() >= $(document).height() - $(window).height() - 120) {
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
            if(verifyConfigValue('debugpage')) console.log('Reload initRangerSelectShift'); 
        }, 500);
    }
}
function initHideMenuSistemaView(TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    if (typeof getOptionsPro !== 'undefined' && typeof hideMenuSistemaView !== 'undefined' && typeof checkConfigValue !== 'undefined' && typeof jmespath !== 'undefined') { 
        if (verifyConfigValue('menususpenso')) {
            hideMenuSistemaView();
        }
    } else {
        setTimeout(function(){ 
            initHideMenuSistemaView(TimeOut - 100); 
            if(verifyConfigValue('debugpage')) console.log('Reload initHideMenuSistemaView'); 
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
            if(verifyConfigValue('debugpage')) console.log('Reload initSetMomentPtBr'); 
        }, 500);
    }
}
function initTableSorter(TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    if (typeof corrigeTableSEI !== 'undefined' && typeof checkConfigValue !== 'undefined' && typeof jmespath !== 'undefined' && typeof $().tablesorter !== 'undefined') { 
        if (checkConfigValue('ordernartabela') && $(frmPesquisaProtocolo).length == 0) {
            setTableSorter();
        }
    } else {
        setTimeout(function(){ 
            if (typeof $().tablesorter === 'undefined' && TimeOut == 9000 && typeof URL_SPRO !== 'undefined') { $.getScript((URL_SPRO+"js/lib/jquery.tablesorter.combined.min.js")) }
            initTableSorter(TimeOut - 100); 
            if(verifyConfigValue('debugpage')) console.log('Reload initTableSorter'); 
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
            if(verifyConfigValue('debugpage')) console.log('Reload initInsertNewLinksMenu'); 
        }, 500);
    }
}
function insertNewLinksMenu() {
    if ($(idMenu).find('.newLinksMenuPro').length == 0) {
        var newLinkMenu =  '<li><a id="pesquisaLinkPermanentePro" class="newLinksMenuPro" onclick="initBoxSearchProtocoloSEI()"><span>Pesquisar Link Permanente</span></a></li>';

        if (checkConfigValue('historicoproc')) {
            newLinkMenu += '<li><a id="historicoProcessosPro" class="newLinksMenuPro" onclick="getHistoryProcessosPro()"><span>Hist\u00F3rico de Processos Visitados</span></a></li>';
        }
            $(idMenu).append(newLinkMenu);
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
                    $(this).after($(this).text()).remove();
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
                    ($('#seiSearch').length ? 
                    '            <th>Url Processo</th>'+
                    '            <th>Url Documento</th>'+
                    '' : '')+
                    '        </tr>'+
                    '    </thead>'+
                    '    <tbody>';

    $(frmPesquisaProtocolo).find(isNewSEI ? '#conteudo table.pesquisaResultado tr' : '#conteudo table.resultado').each(function(i){
        var tr = isNewSEI ? $(this) : $(this).find('tr');
        var urlArvore = tr.eq(0).find('a.arvore').attr('href');
        var params = (typeof urlArvore !== 'undefined') ? getParamsUrlPro(url_host.replace('controlador.php','')+urlArvore) : false;
        var urlTable = (params) ? url_host+'?acao=procedimento_trabalhar&id_procedimento='+params.id_procedimento+'&id_documento='+params.id_documento : false;
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
        _this.find('.text').text('Baixado lista...');
        _this.find('i').attr('class','fas fa-thumbs-up');
        setTimeout(function(){ 
            _this.find('.text').text(data.value);
            _this.find('i').attr('class',data.icon);
        }, 1500);

}
function setTablePesquisaDownload() {
    var htmlFilter =    '<div class="btn-group filterIfraTable" role="group" style="'+(isNewSEI ? 'right: 220px;top: 10px;z-index: 999;position: absolute;' : 'right: 0;top: -40px;z-index: 999;position: absolute;')+'">'+
                        '   <button type="button" onclick="getTablePesquisaDownload(this, \'download\')" data-icon="fas fa-download" style="padding: 0.1rem .5rem; font-size: 9pt;" data-value="Baixar Lista" class="btn btn-sm btn-light">'+
                        '       <i class="fas fa-download" style="padding-right: 3px; cursor: pointer; font-size: 10pt; color: #888;"></i>'+
                        '       <span class="text">Baixar Lista</span>'+
                        '   </button>'+
                        '   <button type="button" onclick="getTablePesquisaDownload(this, \'copy\')" data-icon="fas fa-copy" style="padding: 0.1rem .5rem; font-size: 9pt;" data-value="Copiar" class="btn btn-sm btn-light">'+
                        '       <i class="fas fa-copy" style="padding-right: 3px; cursor: pointer; font-size: 10pt; color: #888;"></i>'+
                        '       <span class="text">Copiar</span>'+
                        '   </button>'+
                        '   <button type="button" onclick="downloadAllDocsSearch(this)" data-icon="fas fa-download" style="padding: 0.1rem .5rem; font-size: 9pt;" data-value="Baixar Documentos" class="btn btn-sm btn-light">'+
                        '       <i class="fas fa-download" style="padding-right: 3px; cursor: pointer; font-size: 10pt; color: #888;"></i>'+
                        '       <span class="text">Baixar Documentos</span>'+
                        '   </button>'+
                        '</div>';

    var tablePesquisa = $(frmPesquisaProtocolo).find(isNewSEI ? '#conteudo .pesquisaBarra' : '#conteudo');
        tablePesquisa.css('position','relative').find('.filterIfraTable').remove();
        tablePesquisa.prepend(htmlFilter);
        if (typeof URL_SPRO !== 'undefined') $.getScript(URL_SPRO+"js/lib/moment.min.js"); 
}
function initTablePesquisaDownload() {
    var resultado = $(frmPesquisaProtocolo).find(isNewSEI ? '#conteudo table.pesquisaResultado' : '#conteudo table.resultado');
    if (resultado.length > 0) {
        setTablePesquisaDownload();
        if (!isNewSEI) initScrollToElement();
    }
}
function initScrollToElement(TimeOut = 9000) {
    if (TimeOut <= 0 || parent.window.name != '') { return; }
    if (typeof scrollToElement !== 'undefined') {
        scrollToElement($('html'), $(frmPesquisaProtocolo).find('#conteudo table.resultado'), 50);
    } else {
        setTimeout(function(){ 
            initScrollToElement(TimeOut - 100); 
            if(verifyConfigValue('debugpage')) console.log('Reload initScrollToElement => '+TimeOut); 
        }, 500);
    }
}
function initAppendIconFavorites(TimeOut = 9000) {
    var table = $('#frmRelBlocoProtocoloLista .infraTable, #frmAcompanhamentoLista .infraTable, #frmProcedimentoSobrestar .infraTable');
    if (TimeOut <= 0 || parent.window.name != '' ||  table.length == 0) { return; }
    if (typeof getParamsUrlPro !== 'undefined' && typeof checkConfigValue !== 'undefined' && typeof htmlIconFavorites !== 'undefined' && typeof getStoreFavoritePro !== 'undefined') {
        if (checkConfigValue('gerenciarfavoritos')) {
            setAppendIconFavorites();
        }
    } else {
        setTimeout(function(){ 
            initAppendIconFavorites(TimeOut - 100); 
            if(verifyConfigValue('debugpage')) console.log('Reload initAppendIconFavorites => '+TimeOut); 
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
    if (TimeOut <= 0 || parent.window.name != '') { return; }
    if (typeof getConfigHost === 'function' && typeof urlServerAtiv !== 'undefined') {
        if (sessionStorage.getItem('configHost_Pro') !== null) {
            setConfigHost(JSON.parse(sessionStorage.getItem('configHost_Pro')), loadScriptEntidade);
        } else {
            getConfigHost(loadScriptEntidade);
        }
    } else {
        setTimeout(function(){ 
            initGetConfigHost(TimeOut - 100); 
            if(verifyConfigValue('debugpage')) console.log('Reload initIconEntidade => '+TimeOut); 
        }, 500);
    }
}
function initReplaceSelectAll(TimeOut = 12000) {
    if (TimeOut <= 0 || parent.window.name != '') { return; }
    if (typeof $().chosen !== 'undefined' && typeof verifyConfigValue === 'function') {
        if (parent.verifyConfigValue('substituiselecao') && $('#frmDocumentoGeracaoMultiplo').length == 0 ) { 
            $('select')
                .not('[multiple]')
                .not('#selStaIcone')
                .not('#selMarcador')
                .filter(function() { 
                    return !($(this).css('visibility') == 'hidden' || $(this).css('display') == 'none') 
                })
                .not('[name="selProcedimentos"]')
                .chosen({
                    placeholder_text_single: ' ',
                    no_results_text: 'Nenhum resultado encontrado'
                });
            chosenReparePosition();
        }
    } else {
        if (typeof $().chosen === 'undefined') { 
            if (typeof URL_SPRO !== 'undefined') $.getScript(URL_SPRO+"js/lib/chosen.jquery.min.js");
        }
        setTimeout(function(){ 
            initReplaceSelectAll(TimeOut - 100); 
            if(verifyConfigValue('debugpage')) console.log('Reload initReplaceSelectAll => '+TimeOut); 
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
    if (TimeOut <= 0 || parent.window.name != '') { return; }
    if (typeof verifyConfigValue !== 'undefined') {
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
            if(verifyConfigValue('debugpage')) console.log('Reload initRemovePaginacaoAll => '+TimeOut); 
        }, 500);
    }
}
function initPagesInfiniteSearch(TimeOut = 9000) {
    if (TimeOut <= 0 || parent.window.name != '') { return; }
    if (typeof verifyConfigValue !== 'undefined') {
        if (verifyConfigValue('rolageminfinita') && $(frmPesquisaProtocolo).length > 0) {
            startPagesInfiniteSearch();
        }
    } else {
        setTimeout(function(){ 
            initPagesInfiniteSearch(TimeOut - 100); 
            if(verifyConfigValue('debugpage')) console.log('Reload initPagesInfiniteSearch => '+TimeOut); 
        }, 500);
    }
}
function initQuickViewSearch(TimeOut = 9000) {
    if (TimeOut <= 0 || parent.window.name != '') { return; }
    if (typeof verifyConfigValue !== 'undefined') {
        if ($(frmPesquisaProtocolo).length > 0) {
            startQuickViewSearch();
        }
    } else {
        setTimeout(function(){ 
            initQuickViewSearch(TimeOut - 100); 
            if(verifyConfigValue('debugpage')) console.log('Reload initQuickViewSearch => '+TimeOut); 
        }, 500);
    }
}
function markQuickViewSearch(this_) {
    var _this = $(this_);
    $('#conteudo .resultado tr.infraTrAcessada').removeClass('infraTrAcessada');
    _this.closest('tr').addClass('infraTrAcessada');
}
function startQuickViewSearch() { 
    $('a.quickview').remove();
    $(isNewSEI ? '#conteudo .pesquisaTituloEsquerda a[href*="controlador.php?acao=documento_visualizar"]' : '#conteudo .resultado a[href*="controlador.php?acao=documento_visualizar"]').each(function(){
        var nrSEI = isNewSEI ? $(this).closest('tr').find('td.pesquisaTituloDireita a').text().trim() :  $(this).closest('tr').find('td.resTituloDireita').text().trim();
        var html = '<a class="quickview" style="font-size: 12px;" onmouseover="return infraTooltipMostrar(\'Visualiza\u00E7\u00E3o r\u00E1pida\');" onmouseout="return infraTooltipOcultar();" onclick="markQuickViewSearch(this);openSEINrPro(this, \''+nrSEI+'\')"><i style="margin: 0 3px;" class="fas fa-eye azulColor"></i></a>';
        $(this).after(html);
    });
    $(isNewSEI ? '#conteudo .pesquisaTituloEsquerda a[href*="controlador.php?acao=documento_download_anexo"]' : '#conteudo .resultado a[href*="controlador.php?acao=documento_download_anexo"]').each(function(){
        var href = $(this).attr('href');
        var text = $(this).text();
        var html = '<a class="quickview" style="font-size: 12px;" onmouseover="return infraTooltipMostrar(\'Visualiza\u00E7\u00E3o r\u00E1pida\');" onmouseout="return infraTooltipOcultar();" onclick="markQuickViewSearch(this);openDialogAnexo(this)" data-url="'+href+'" data-title="'+text+'"><i style="margin: 0 3px;" class="fas fa-eye azulColor"></i></a>';
        $(this).after(html);
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
        var html = '<a class="downloadview" style="font-size: 12px;" onmouseover="return infraTooltipMostrar(\'Baixando documento...\');" onmouseout="return infraTooltipOcultar();"><i style="margin: 0 3px;" class="fas fa-hourglass-half roxoColor"></i></a>';
        $(this).after(html);
        var _this = $(this).closest('td').find('.downloadview');
        console.log(text, href, nrSEI);
        setTimeout(function(){
            if (typeof href !== 'undefined' && href.indexOf('?acao=documento_visualizar') !== -1) {
                getIDProtocoloSEI(nrSEI,  
                    function(html){
                        let $html = $(html);
                        var param = getParamsUrlPro($html.find('#ifrArvore').attr('src'));
                            console.log(param);
                            openDialogDoc(param, true, _this);
                    }, 
                    function(){
                        _this.attr('onmouseover','return infraTooltipMostrar(\'Erro ao baixar documento\')').find('i').attr('class', 'fas fa-exclamation-circle vermelhoColor');
                    }
                );
            } else if (typeof href !== 'undefined' && href.indexOf('?acao=documento_download_anexo') !== -1) {
                var link = document.createElement('a');
                link.href = href;
                link.download = text;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                _this.attr('onmouseover','return infraTooltipMostrar(\'Documento baixado\')').find('i').attr('class', 'fas fa-download verdeColor');
                _this.closest('tr').addClass('infraTrAcessada').addClass('infraDocBaixado');
            }
        }, index*2000);
    });
}
function initObserveUrlPage(TimeOut = 9000) {
    if (TimeOut <= 0 || parent.window.name != '') { return; }
    if (typeof getParamsUrlPro !== 'undefined') {
        observeUrlPage();
    } else {
        setTimeout(function(){ 
            initObserveUrlPage(TimeOut - 100); 
            if(verifyConfigValue('debugpage')) console.log('Reload initObserveUrlPage => '+TimeOut); 
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
    var htmlSlimPro =   '       <div id="controlSlimPro" style="display: inline-block;float: right;margin:3px 10px 0 0">'+
                        '           <div class="onoffswitch" style="display:inline-block;transform:scale(0.7)" onmouseout="return infraTooltipOcultar();" onmouseover="return infraTooltipMostrar(\''+(localStorage.getItem('seiSlim') ? 'Desativar estilo avan\u00E7ado' : 'Ativar estilo avan\u00E7ado')+'\')">'+
                        '               <input type="checkbox" onchange="changeSlimPro(this)" name="onoffswitch" class="onoffswitch-checkbox" id="changeSlimPro" tabindex="0" '+(localStorage.getItem('seiSlim') ? 'checked' : '')+'>'+
                        '               <label class="onoffswitch-label" for="changeSlimPro" style="border-color: #ffffff7a;"></label>'+
                        '           </div>'+
                        '           <i onclick="openStyleBoxSlimPro()" onmouseout="return infraTooltipOcultar();" onmouseover="return infraTooltipMostrar(\''+(localStorage.getItem('seiSlim') ? 'Escolher cor principal' : 'Ativar estilo avan\u00E7ado')+'\')" class="fas fa-palette brancoColor" style="float: right;font-size: 16pt;cursor: pointer;"></i> '+
                        '       </div>';
    $('#controlSlimPro').remove();
    $(isNewSEI ? '#divInfraBarraSistemaPadraoD' : '#divInfraBarraSistemaD').append(htmlSlimPro);
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
            if(verifyConfigValue('debugpage')) console.log('Reload initStyleBoxSlimPro'); 
        }, 500);
    }
}
function initMarcadorUserColor(TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    if (typeof extractHexColor !== 'undefined' ) { 
        if (checkConfigValue('coresmarcadores')) {
            setMarcadorUserColor();
        }
    } else {
        setTimeout(function(){ 
            initMarcadorUserColor(TimeOut - 100); 
            if(verifyConfigValue('debugpage')) console.log('Reload initMarcadorUserColor'); 
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
                            '   <input onchange="changeMarcadorUserColor(this)" type="color" value="'+oldColor+'">'+
                            '</div>';
        txtNome.after(htmlUserColor);
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
    var urlHome = $('#main-menu').find('a[href*="controlador.php?acao=procedimento_controlar"]').attr('href');
    setTimeout(function(){ 
        if (window.location.hash == '' && typeof title !== 'undefined' && typeof content !== 'undefined' && title.trim() == '' && content.trim() == '' && typeof urlHome !== 'undefined' && window.location.href.indexOf('controlador.php') === -1) {
            console.log('redirect checkBlankPageSEI'); 
            window.location.href = urlHome;
        }
    }, 3000);
}
function initCheckLoadJqueryUI() {
    setTimeout(function(){ 
        checkLoadJqueryUI();
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
            if(verifyConfigValue('debugpage')) console.log('Reload initInfraImg'); 
        }, 500);
    }
}
function initQRCodeLib() {
    if ($('#ifrArvore').length > 0 && typeof $().qrcode !== 'function' && typeof URL_SPRO !== 'undefined') {
        $.getScript(URL_SPRO+"js/lib/jquery-qrcode-0.18.0.min.js");
    }
}
function initSeiProAll() {
    initInfraImg();
    checkPageParent();
    initMarcadorUserColor();
    // appendIconEntidade();
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
    // initReplaceNewIconsBar();
    initRemovePaginacaoAll();
    initPagesInfiniteSearch();
    initQuickViewSearch();
    // observeIfrArvore();
    initObserveUrlPage();
    initSlimPro();
    //checkBlankPageSEI();
    initCheckLoadJqueryUI();
    initQRCodeLib();
    setOnClickExcluirProcBloco();

    if (NAMESPACE_SPRO != 'SEI Pro Lab') {
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
$(document).ready(function () { initSeiProAll() });