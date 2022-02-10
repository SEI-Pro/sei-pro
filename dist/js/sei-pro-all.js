var pagesInfiniteSearch = [];
function getTableInfiniteSearch(ifrView, formID, tableID, index) {
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
            ifrView.find('div.paginas').append('<label class="loadRemovePag"><i class="fas fa-sync fa-spin"></i></label>');

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
            ifrView.find('div.paginas').after($html.find('div.paginas')).remove();
        });
    }
}
function getInfiniteSearch() {
    var nrPage = parseInt($('div.paginas b').text()+'0');
    if ($('div.paginas span.pequeno').last().text() == 'Pr\u00F3xima') {
        getTableInfiniteSearch($('#divInfraAreaTela'), '#frmPesquisaProtocolo', 'table.resultado', nrPage);
    }  
}
function startPagesInfiniteSearch(index = false) {
    $(window).scroll(function () { 
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
    if (typeof getOptionsPro !== 'undefined' && typeof hideMenuSistemaView !== 'undefined' && typeof checkConfigValue !== 'undefined' && typeof jmespath !== 'undefined') { 
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
        $.getScript(URL_SPRO+"js/lib/moment.min.js"); 
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
    if (typeof corrigeTableSEI !== 'undefined' && typeof checkConfigValue !== 'undefined' && typeof jmespath !== 'undefined' && typeof $().tablesorter !== 'undefined') { 
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
    if (typeof checkConfigValue !== 'undefined' && typeof jmespath !== 'undefined') { 
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
        $.getScript(URL_SPRO+"js/lib/moment.min.js"); 
}
function initTablePesquisaDownload() {
    if ($('#frmPesquisaProtocolo').find('#conteudo table.resultado').length > 0) {
        setTablePesquisaDownload();
    }
}
function initAppendIconFavorites(TimeOut = 9000) {
    var table = $('#frmRelBlocoProtocoloLista .infraTable, #frmAcompanhamentoLista .infraTable, #frmProcedimentoSobrestar .infraTable');
    if (TimeOut <= 0 || parent.window.name != '' ||  table.length == 0) { return; }
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
function loadScriptEntidade() {
    $.getScript(URL_SPRO+"js/sei-pro-icons.js");
}
function appendIconEntidade() {
    if ($('.infraTituloLogoSistema').length > 0 && $('#iconEntidade').length == 0) {
        initGetConfigHost();
    }
}
function initGetConfigHost(TimeOut = 9000) {
    if (TimeOut <= 0 || parent.window.name != '') { return; }
    if (typeof getConfigHost === 'function') {
        if (sessionStorage.getItem('configHost_Pro') !== null) {
            setConfigHost(JSON.parse(sessionStorage.getItem('configHost_Pro')), loadScriptEntidade);
        } else {
            getConfigHost(loadScriptEntidade);
        }
    } else {
        setTimeout(function(){ 
            initGetConfigHost(TimeOut - 100); 
            console.log('Reload initIconEntidade', TimeOut); 
        }, 500);
    }
}
function initReplaceSelectAll(TimeOut = 12000) {
    if (TimeOut <= 0 || parent.window.name != '') { return; }
    if (typeof $().chosen !== 'undefined' && typeof verifyConfigValue === 'function') {
        if (parent.verifyConfigValue('substituiselecao') && $('#frmDocumentoGeracaoMultiplo').length == 0 ) { 
            $('select')
                .not('[multiple]')
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
            $.getScript(URL_SPRO+"js/lib/chosen.jquery.min.js");
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
function initReplaceNewIconsBar(TimeOut = 9000) {
    if (localStorage.getItem('seiSlim') === null || (TimeOut <= 0 || parent.window.name != '')) { return; }
    if (typeof replaceNewIconsBar === 'function') {
        replaceNewIconsBar($('#divInfraBarraSistema #divInfraBarraSistemaD a'));
        replaceNewIconsMenu($('#divInfraAreaTelaE #main-menu li a'));
    } else {
        setTimeout(function(){ 
            initReplaceNewIconsBar(TimeOut - 100); 
            console.log('Reload initReplaceNewIconsBar', TimeOut); 
        }, 500);
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
            console.log('Reload initRemovePaginacaoAll', TimeOut); 
        }, 500);
    }
}
function initPagesInfiniteSearch(TimeOut = 9000) {
    if (TimeOut <= 0 || parent.window.name != '') { return; }
    if (typeof verifyConfigValue !== 'undefined') {
        if (verifyConfigValue('rolageminfinita') && $('#frmPesquisaProtocolo').length > 0) {
            startPagesInfiniteSearch();
        }
    } else {
        setTimeout(function(){ 
            initPagesInfiniteSearch(TimeOut - 100); 
            console.log('Reload initPagesInfiniteSearch', TimeOut); 
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
    var htmlSlimPro =   '       <div id="controlSlimPro" style="display: inline-block;float: right;margin:0 10px 0 0">'+
                        '           <div class="onoffswitch" style="display:inline-block;transform:scale(0.7)">'+
                        '               <input type="checkbox" onchange="changeSlimPro(this)" name="onoffswitch" class="onoffswitch-checkbox" id="changeSlimPro" tabindex="0" '+(localStorage.getItem('seiSlim') ? 'checked' : '')+'>'+
                        '               <label class="onoffswitch-label" for="changeSlimPro" style="border-color: #ffffff7a;"></label>'+
                        '           </div>'+
                        '           <i class="fas fa-hat-wizard brancoColor" style="float: right;font-size: 1.9em;"></i> '+
                        '       </div>';
    $('#controlSlimPro').remove();
    $('#divInfraBarraSistemaD').append(htmlSlimPro);
}
function changeSlimPro(this_) {
    if ($(this_).is(':checked')) {
        localStorageStorePro('seiSlim', true);
    } else {
        localStorageRemovePro('seiSlim');
    }
    window.location.reload();
}
function initSeiProAll() {
    appendIconEntidade();
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
    initReplaceNewIconsBar();
    initRemovePaginacaoAll();
    initPagesInfiniteSearch();
    // observeIfrArvore();
    observeUrlPage();
    initSlimPro();
    console.log('initSeiProAll');
}
$(document).ready(function () { initSeiProAll() });