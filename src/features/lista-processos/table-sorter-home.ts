// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/**
 * Lista de processos — tablesorter + chrome observers.
 * (ponte temporária: jQuery/DOM legado; fatia do antigo body.js)
 */
import {
    updateHomeFilterCaption
} from './modules.js';

export function initTableSorterHome(TimeOut = 1000) {
    if (TimeOut <= 0) { return; }
    if (
        typeof corrigeTableSEI !== 'undefined' && 
        typeof checkConfigValue !== 'undefined' && 
        typeof $().tablesorter !== 'undefined' && 
        $('#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado').find('tbody tr').length > 0
    ) { 
        if (checkConfigValue('ordernartabela') && $('#frmPesquisaProtocolo').length == 0) {
            setTableSorterHome();
        }
    } else {
        setTimeout(function(){ 
            if (typeof $().tablesorter === 'undefined' && TimeOut == 1000) { $.getScript(parent.URL_SPRO+"js/lib/jquery.tablesorter.combined.min.js") }
            initTableSorterHome(TimeOut - 100); 
            if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage'))console.log('Reload initTableSorterHome'); 
        }, 500);
    }
}
export function setTableSorterHome() {
    var observerFilterHome = new MutationObserver(function(mutations) {
        var _this = $(mutations[0].target);
        var _parent = _this.closest('table');
        var iconFilter = _parent.find('.filterTableProcessos');
        var checkIconFilter = iconFilter.hasClass('newLink_active');
        var hideme = _this.hasClass('hideme');
        if (hideme && checkIconFilter) {
            iconFilter.removeClass('newLink_active');
        }
    });
    var tableSorterHome = $('#tblProcessosGerados, #tblProcessosRecebidos, #tblProcessosDetalhado');
        if (tableSorterHome.length > 0) {
            window.tableHomePro = [];
            setSortLocaleCompare();
            tableSorterHome.each(function(i){

                if (!$(this).hasClass('infraTableOrdenacao')) {
                    $(this).find('thead tr.tablesorter-filter-row').remove();
                    corrigeTableSEI(this);
                   if (SeiPro.sei.adapter.isNewSEI()) {
                        $(this).find('thead [colspan]').each(function(){
                            var _this = $(this);
                            var colspan = parseInt(_this.attr('colspan'));
                            if (colspan > 1) {
                                _this.removeAttr('colspan');
                                for (var i = 1; i < colspan; i++) {
                                    _this.after(_this.clone().text(''));
                                }
                            }
                        });
                        var theadCols = $(this).find('thead tr:first th, thead tr:first td').length;
                        var tbodyCols = $(this).find('tbody tr:not(.tableHeader):first td').length;
                        var theadRow = $(this).find('thead tr:first');
                        for (var j = theadCols; j < tbodyCols; j++) {
                            theadRow.append('<th></th>');
                        }
                        // #ancLiberarMeusProcessos precisa de bind: testado ao vivo (2026-06-30) —
                        // o SEI não liga nenhum handler de clique nesse botão (jQuery._data confirma
                        // zero listeners), embora a função nativa verMeusProcessos exista e funcione
                        // (ela só existe no mundo MAIN da página — chamá-la direto do mundo isolado
                        // lança ReferenceError, como tentamos antes). verMeusProcessos('T') faz só
                        // duas coisas (confirmado lendo o código-fonte da função na página real):
                        // seta #hdnMeusProcessos='T' e submete #frmProcedimentoControlar — isso É
                        // manipulação de DOM pura, que o mundo isolado replica sem cruzar mundos.
                        // O servidor decide ligar/desligar o filtro pelo estado de sessão, não pelo
                        // valor estático do campo — por isso sempre 'T', tanto para ativar quanto
                        // para remover (mesmo padrão usado pelo link "Ver atribuídos a mim").
                        $('#ancLiberarMeusProcessos').click(function (e) {
                            e.preventDefault();
                            var hdn = document.getElementById('hdnMeusProcessos');
                            var form = document.getElementById('frmProcedimentoControlar');
                            if (hdn && form) {
                                hdn.value = 'T';
                                form.submit();
                            }
                        });
                   }
                    
                    var elemID = $(this).attr('id');
                    var _this = $('#'+$(this).attr('id'));
                    var sortListArray = (typeof sortListSaved !== 'undefined' && sortListSaved && typeof sortListSaved[elemID] !== 'undefined') ? sortListSaved[elemID].sortList : [];
                    var configSorter = {
                        textExtraction: {
                            1: function (elem, table, cellIndex) {
                                var text_return = '';
                                if ($(elem).find('img').length > 0) {
                                    $(elem).find('img').each(function(){
                                        var type_img = $(this).attr('src').indexOf('anotacao') != -1 ? 'Nota:' : '';
                                            type_img = $(this).attr('src').indexOf('marcador') != -1 ? 'Marcador:' : type_img;
                                        var prioridade = $(this).attr('src').indexOf('prioridade') != -1 ? '1' : '2';
                                        var texttip = $(this).closest('a').attr('onmouseover');
                                            texttip = (typeof texttip !== 'undefined') ? texttip : $(this).attr('onmouseover');
                                            texttip = (typeof texttip !== 'undefined') ? extractTooltip(texttip) : ''; 
                                        text_return += prioridade+' '+type_img+' '+texttip;
                                    });
                                }
                                text_return = (text_return == '') ? '3' : text_return.replace(/  /g, ' ');
                                // console.log(text_return);
                                return text_return;
                            },
                            2: function (elem, table, cellIndex) {
                                var processo = $(elem).find('a').eq(0);
                                var nrProc = processo.text().trim();
                                var texttip = processo.attr('onmouseover');
                                    texttip = (typeof texttip !== 'undefined') ? extractTooltip(texttip) : '';
                                var urgente = (texttip != '' && texttip.toLowerCase().indexOf('(urgente)') !== -1) ? '0 ' : '';
                                var prescricao = $(elem).find('.progressPrescricao').attr('aria-percent'); 
                                    prescricao = typeof prescricao !== 'undefined' ? ' '+prescricao+' ' : ' 0 ';
                                return urgente+prescricao+nrProc+' '+texttip;
                            },
                            4: function (elem, table, cellIndex) {
                              var target = $(elem).find('.dateboxDisplay').eq(0);
                              var text_date = (typeof target !== 'undefined' && target.length > 0) ? target.data('time-sorter') : $(elem).text().trim();
                              return text_date;
                            }
                        },
                        widgets: ["saveSort", "filter"],
                        widgetOptions: {
                            saveSort: true,
                            // filter_external: '#txtPesquisaRapida',
                            filter_hideFilters: true,
                            filter_columnFilters: true,
                            filter_saveFilters: true,
                            filter_hideEmpty: true,
                            filter_excludeFilter: {}
                        },
                        sortList: sortListArray,
                        sortReset: true,
                        ignoreCase: true,
                        sortLocaleCompare: true,
                        headers: {
                            0: { sorter: false, filter: false },
                            1: { sorter: true, filter: true },
                            2: { sorter: true, filter: true },
                            3: { sorter: true, filter: true },
                            4: { sorter: true, filter: true },
                            4: { sorter: true, filter: true }
                        }
                    };
                    
                    _this.find("thead th:eq(0)").data("sorter", false);
                    var tableHomeThis = _this.tablesorter(configSorter).on("sortEnd", function (event, data) {
                            checkboxRangerSelectShift();
                        }).on("filterEnd", function (event, data) {
                            checkboxRangerSelectShift();
                            updateHomeFilterCaption($(this));
                                $(this).find("tbody > tr:visible > td > input").prop('disabled', false);
                                $(this).find("tbody > tr:hidden > td > input").prop('disabled', true);
                        });
                    tableHomeThis.find("caption").each(function(){
                        $(this).data('seiProCaptionBase', $(this).text());
                    });
                        
                    tableHomePro.push(tableHomeThis);

                    var _tableId = _this.attr('id') || 'tblProcessos';
                    _this.find('.tablesorter-filter-row input.tablesorter-filter').each(function() {
                        $(this).attr('name', _tableId + '_filter_col' + ($(this).attr('data-column') || '0'));
                    });

                    var filter = _this.find('.tablesorter-filter-row').get(0);
                    if (typeof filter !== 'undefined') {
                        setTimeout(function(){ 
                            var htmlFilter =    '<a class="newLink filterTableProcessos '+(_this.find('tr.tablesorter-filter-row').hasClass('hideme') ? '' : 'newLink_active')+'" onclick="initFilterTableProcessos(this)" onmouseover="return infraTooltipMostrar(\'Pesquisar na tabela\');" onmouseout="return infraTooltipOcultar();" style="left: 0; top: -20px; position: absolute;">'+
                                                '   <i class="fas fa-search cinzaColor" style="padding-right: 3px; cursor: pointer; font-size: 12pt;"></i>'+
                                                '</a>';
                            _this.find('thead .filterTableProcessos').remove();
                            _this.find('thead').prepend(htmlFilter);
                            observerFilterHome.observe(filter, {
                                attributes: true
                            });
                            tableSorterHome.find('.tablesorter-filter-row input.tablesorter-filter[aria-label*="Prazos"]').attr('type','date');
                        });
                    }
                }
            });
            if (tableSorterHome.find('tbody tr td:nth-child(2)').find('img').length > 0) {
                tableSorterHome.find('thead tr:first th:nth-child(2)').css('width','150px');
            }

            setTimeout(function(){ 
                if ($('.filterTableProcessos').length == 0) {
                    setTimeout(function(){ 
                        if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage'))console.log('Reload tableHomeDestroy *****');
                        tableHomeDestroy(true);
                    }, 1000);
                }
                var filterStore = (typeof tableHomePro[0] !== 'undefined' && typeof tableHomePro[0][0] !== 'undefined') ? $.tablesorter.storage(tableHomePro[0][0], 'tablesorter-filters') : [];
                if (typeof filterStore !== 'undefined' && filterStore !== null && filterStore.length > 0) {
                    var filterUser = filterStore[3];
                        filterUser = (typeof filterUser !== 'undefined' && filterUser !== null) ? filterUser.replace('(','').replace(')','') : false;
                        filterUser = filterUser === '""' ? '__unassigned__' : filterUser;
                    if (filterUser) {
                        if ($('#filterAssignmentTableHome').length > 0) {
                            $('#filterAssignmentTableHome').val(filterUser).trigger('chosen:updated');
                        } else {
                            $('#filterTableHome').val(filterUser).trigger('chosen:updated');
                        }
                    } else if ($('#filterAssignmentTableHome').length > 0) {
                        $('#filterAssignmentTableHome').val('').trigger('chosen:updated');
                    } else {
                        $('#filterTableHome').val('').trigger('chosen:updated');
                    }
                }
                if (typeof verifyConfigValue !== 'undefined' && verifyConfigValue('mostraranotacaocontrole')) {
                    // Feature migrada p/ src/features/anotacao-controle (bundle isolado).
                    if (window.SeiPro && SeiPro.features && SeiPro.features.anotacaoControle && SeiPro.features.anotacaoControle.api) SeiPro.features.anotacaoControle.api.render();
                }
            }, 1000);
        }
}
export function tableHomeDestroy(reload = false, tableHomeTimeout = 3000) {
    if (tableHomePro.length > 0) {
        $.each(tableHomePro, function(i){
            tableHomePro[i].trigger("destroy");
        });
        $('.filterTableProcessos').remove();
        window.tableHomePro = [];
        if (reload && tableHomeTimeout > 0) {
            initTableSorterHome();
            if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage'))console.log('Reload initTableSorterHome => '+tableHomeTimeout);
            setTimeout(function(){ 
                forceTableHomeDestroy(tableHomeTimeout-500);
            }, 1000);
        }
    } else {
        initTableSorterHome();
    }
}
export function forceTableHomeDestroy(Timeout = 3000) {
    if (Timeout <= 0) { return; }
    var force = false;
    $.each(tableHomePro, function(i){
        var filter = $.tablesorter.storage( tableHomePro[i][0], 'tablesorter-filters');
        var rowFilter = $(tableHomePro[i][0]).find('tr.tablesorter-filter-row').hasClass('hideme');
        force = (typeof filter !== 'undefined' && filter !== null && filter.length > 0 && rowFilter) ? true : force;
    });
    if (force && Timeout > 0 && $('#tblProcessosGerados').is(':visible')) {
        tableHomeDestroy(true, Timeout-1000);
        if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage'))console.log('Reload forceTableHomeDestroy => '+TimeOut);
    }
}
export function forceOnLoadBody() {
    // No-op intencional. Antes rodava o onload nativo do <body> do SEI via
    // new Function($('body').attr('onload')) — removido porque:
    //  1) a CSP da extensão bloqueia eval/new Function no mundo isolado, gerando o
    //     aviso "unsafe-eval" no console (e a chamada sempre caía no catch);
    //  2) o código desse onload referencia globais do mundo MAIN da página
    //     (infra*), inacessíveis a partir do content script isolado.
    // O onload real do <body> já é executado pelo próprio navegador ao carregar a
    // página; não há o que re-disparar daqui. modalLink já é carregado eager.
}
export function observeAreaTela(TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    if (typeof setResizeAreaTelaD !== 'undefined') { 
        new ResizeObserver(setResizeAreaTelaD).observe(divInfraAreaTelaD);
    } else {
        setTimeout(function(){ 
            observeAreaTela(TimeOut - 100); 
            if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage'))console.log('Reload observeAreaTela'); 
        }, 500);
    }
}

// ============================================================================
// Feature "Mostrar anotação na tela de controle" (config mostraranotacaocontrole)
// MIGRADA para src/features/anotacao-controle/ (bundle isolado próprio).
// Núcleo puro: src/core/sticknote.js. View: anotacao-controle/view.js.
// Acionada via SeiPro.features.anotacaoControle.init()/render() (ver call-sites acima).
// ============================================================================
export function initFullnameAtribuicao(TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    if (typeof checkConfigValue !== 'undefined') { 
        if (verifyConfigValue('nomesusuarios')) {
            fullnameAtribuicao();
        }
    } else {
        setTimeout(function(){ 
            initFullnameAtribuicao(TimeOut - 100); 
            if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage'))console.log('Reload initFullnameAtribuicao');  
        }, 500);
    }
}
export function initViewEspecifacaoProcesso(TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    if (typeof checkConfigValue !== 'undefined') { 
        if (verifyConfigValue('especificaprocesso')) {
            viewEspecifacaoProcesso();
        }
    } else {
        setTimeout(function(){ 
            initViewEspecifacaoProcesso(TimeOut - 100); 
            if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage'))console.log('Reload initViewEspecifacaoProcesso'); 
        }, 500);
    }
}
export function initFaviconNrProcesso(TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    if (typeof Favico !== 'undefined' && typeof checkConfigValue !== 'undefined') { 
        if (checkConfigValue('contadoricone')) {
            getFaviconNrProcesso();
        }
    } else {
        setTimeout(function(){ 
            initFaviconNrProcesso(TimeOut - 100); 
            if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage'))console.log('Reload initFaviconNrProcesso'); 
        }, 500);
    }
}
export function initReloadModalLink(TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    if (typeof reloadModalLink !== 'undefined') { 
        reloadModalLink();
    } else {
        setTimeout(function(){ 
            initReloadModalLink(TimeOut - 100); 
            if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage'))console.log('Reload initReloadModalLink'); 
        }, 500);
    }
}
export function initReplaceNewIcons(TimeOut = 9000) {
    if (typeof isNewSEI !== 'undefined' && SeiPro.sei.adapter.isNewSEI()) $(divComandos+' a').addClass('botaoSEI');
    if (localStorage.getItem('seiSlim') === null || (TimeOut <= 0 || parent.window.name != '')) { return; }
    if (typeof replaceNewIcons === 'function') {
        replaceNewIcons($(`${infraBarraComandos} a.botaoSEI`));
    } else {
        setTimeout(function(){ 
            initReplaceNewIcons(TimeOut - 100); 
            if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage'))console.log('Reload initReplaceNewIcons => '+TimeOut); 
        }, 500);
    }
}
export function initObserveUrlChange(TimeOut = 9000) {
    if (TimeOut <= 0 || parent.window.name != '') { return; }
    if (typeof parent.verifyConfigValue === 'function') {
        setObserveUrlChange();
    } else {
        setTimeout(function(){ 
            initObserveUrlChange(TimeOut - 100); 
            if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage'))console.log('Reload initObserveUrlChange => '+TimeOut); 
        }, 500);
    }
}
export function setObserveUrlChange() {
    if (parent.verifyConfigValue('urlamigavel')) {
        $(window).bind('hashchange', function() {
            var ifrArvore = $('#ifrArvore').contents();
            var sourceLink = ifrArvore.find('.infraArvoreNoSelecionado').eq(0).closest(`a[target="${ifrVisualizacao_}"]`);
            var nrSEI = (typeof sourceLink !== 'undefined' && sourceLink !== null) ? getNrSei(sourceLink.text().trim()) : false;
                nrSEI = (nrSEI == '') ? false : nrSEI;
            var nrSEI_URL = (window.location.hash.indexOf('@') !== -1) ? window.location.hash.replace('#','').split('@')[1] : false;
                nrSEI_URL = (nrSEI_URL == '') ? false : nrSEI_URL;

            var idSource = (iHistoryArray.length > 0) ? jmespath.search(iHistoryArray, "[?sei=='@"+nrSEI+"'] | [0].id") : null;
                idSource = (idSource === null) ? false : idSource;
            var idTarget = (iHistoryArray.length > 0) ? jmespath.search(iHistoryArray, "[?sei=='@"+nrSEI_URL+"'] | [0].id") : null;
                idTarget = (idTarget === null) ? false : idTarget;
            // console.log(nrSEI, nrSEI_URL, window.location.hash, window.history.length, iHistory, iHistoryArray, idSource, idTarget);

            if (nrSEI_URL && nrSEI_URL && nrSEI != nrSEI_URL && !delayCrash) {
                delayCrash = true;
                setTimeout(function(){ delayCrash = false }, 300);
                sourceLink.closest('.infraArvore').find('.infraArvoreNoSelecionado').removeClass('infraArvoreNoSelecionado');
                var targetLink = ifrArvore.find('a[target="ifrVisualizacao"]:contains("'+nrSEI_URL+'")');
                var pastaArvore = targetLink.closest('.infraArvore');
                    targetLink.unbind('click').trigger('click');
                    if (idSource && idTarget && idSource > idTarget) {
                        window.history.back(-1);
                    } else {
                        window.history.go(1);
                    }
                    setClickUrlAmigavel();
                if (!pastaArvore.is(':visible')) {
                    var pastaID = pastaArvore.attr('id').replace('div','');
                    ifrArvore.find('#ancjoin'+pastaID).trigger('click');
                }
            }
        });
    }
}
