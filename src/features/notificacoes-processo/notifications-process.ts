// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/**
 * Sei Functions Pro — notifications, signature, process model.
 * (ponte temporária: jQuery/DOM legado; fatia do antigo body.js)
 */
import {
    callAtividades
} from '../../shared/sei-runtime/atividades-bridge.js';

import {
    alertaBoxPro,
    checkProcessoSigiloso,
    checkboxRangerSelectShift,
    getArrayHistorico,
    getDadosAjaxMonitoradoPro,
    getDadosHistoricoUrlPro,
    getDocumentosActions,
    getIframeArvoreElement,
    getLinksArvoreAjax,
    getListaAtribuicaoProcesso,
    pullDadosProcessoSession,
    resetDialogBoxPro,
    resizeArvoreMaxWidth,
    setHistoryProcessosPro,
    setSessionProcessosPro,
    setTabelaPanelScrollHeight,
    updateTitlePage
} from '../../shared/sei-runtime/deps.js';

export function getProcessNotificationCountPro() {
    return $('#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado')
        .find('a.processoNaoVisualizado, a.processoNaoVisualizadoSigiloso, a.processoCredencialAssinaturaSigiloso')
        .length;
}
// [migrado para core/texto.js] normalizeSignatureSelectionTextPro
export function getCurrentUserNamePro() {
    var userTitle = $('#lnkUsuarioSistema').attr('title') || '';
    var userText = $('#lnkUsuarioSistema').text() || '';
    var userName = '';
    var titleMatchers = [
        /(.+)\s-\s/,
        /(.+)\s\(.*/,
        /(.+?)\s*\/\s*.*/
    ];

    $.each(titleMatchers, function(_, matcher) {
        var match = userTitle.match(matcher);
        if (!userName && match && match[1]) {
            userName = match[1].trim();
        }
    });

    if (!userName && userTitle) {
        userName = userTitle.split('\n')[0].trim();
    }

    if (!userName && userText) {
        userName = userText.trim();
    }

    return userName;
}
export function getSignatureBlockTablePro() {
    var table = $('#tblProtocolosBlocos').first();
    if (table.length) return table;

    table = $('#frmRelBlocoProtocoloLista #divInfraAreaTabela table.infraTable').first();
    return table.length ? table : $('table.infraTable').first();
}
export function getSignatureColumnIndexPro(table) {
    var indexAssinatura = -1;
    var headerCells = table.find('thead tr:first th, thead tr:first td');

    if (!headerCells.length) {
        headerCells = table.find('tbody tr.tableHeader:first th, tbody tr.tableHeader:first td');
    }
    if (!headerCells.length) {
        headerCells = table.find('tr:first th, tr:first td');
    }

    headerCells.each(function(index) {
        if (/^Assinaturas?$/i.test($(this).text().trim())) {
            indexAssinatura = index;
            return false;
        }
    });

    return indexAssinatura;
}
export function getSignatureBlockRowsPro(table, indexAssinatura) {
    return table.find('tbody tr').filter(function() {
        var tr = $(this);
        return !tr.hasClass('tableHeader')
            && !tr.hasClass('infraCaption')
            && tr.find('input[type="checkbox"]').length > 0
            && tr.find('td').length > indexAssinatura;
    });
}
export function toggleSignatureCheckboxPro(checkbox, checked) {
    var _checkbox = $(checkbox);
    if (_checkbox.prop('checked') !== checked) {
        _checkbox.trigger('click');
    }
}
export function applySignatureBlockSelectionPro(type) {
    var table = getSignatureBlockTablePro();
    var indexAssinatura = getSignatureColumnIndexPro(table);
    var usuario = normalizeSignatureSelectionTextPro(getCurrentUserNamePro());

    if (!table.length || indexAssinatura < 0) return false;

    getSignatureBlockRowsPro(table, indexAssinatura).each(function() {
        var tr = $(this);
        var checkbox = tr.find('input[type="checkbox"]').first();
        var assinatura = normalizeSignatureSelectionTextPro(tr.find('td').eq(indexAssinatura).text());
        var hasAssinatura = assinatura.length > 0;
        var hasMinhaAssinatura = !!(usuario && hasAssinatura && assinatura.indexOf(usuario) !== -1);

        if (type === 'todos') {
            toggleSignatureCheckboxPro(checkbox, true);
        } else if (type === 'nenhum') {
            toggleSignatureCheckboxPro(checkbox, false);
        } else if (type === 'sem-assinatura') {
            toggleSignatureCheckboxPro(checkbox, !hasAssinatura);
        } else if (type === 'sem-minha-assinatura') {
            toggleSignatureCheckboxPro(checkbox, !hasMinhaAssinatura);
        } else if (type === 'com-minha-assinatura') {
            toggleSignatureCheckboxPro(checkbox, hasMinhaAssinatura);
        }
    });

    return true;
}
export function renderSignatureBlockSelectionPro() {
    var table = getSignatureBlockTablePro();
    var caption = $('#tblProtocolosBlocos caption.infraCaption').first();
    if (!caption.length) {
        caption = table.find('caption.infraCaption').first();
    }
    var toolbar = $('#frmRelBlocoProtocoloLista #divInfraBarraComandosSuperior').first();
    var target = caption.length ? caption : toolbar;

    if (!table.length || !target.length || target.find('.seiProSignatureSelection').length) {
        return false;
    }

    var htmlSelection = ''
        + '<span class="seiProSignatureSelection">'
        + '    <span class="seiProSignatureSelection_label">Selecionar:</span>'
        + '    <a class="newLink" href="#" data-selection-signature="todos">Todos</a>'
        + '    <a class="newLink" href="#" data-selection-signature="nenhum">Nenhum</a>'
        + '    <a class="newLink" href="#" data-selection-signature="sem-assinatura">Sem assinatura</a>'
        + '    <a class="newLink" href="#" data-selection-signature="sem-minha-assinatura">Sem minha assinatura</a>'
        + '    <a class="newLink" href="#" data-selection-signature="com-minha-assinatura">Com minha assinatura</a>'
        + '</span>';

    if (caption.length) {
        caption.append(htmlSelection);
    } else {
        toolbar.append(htmlSelection);
    }

    return true;
}
window.initSmartSignatureSelectionPro = function initSmartSignatureSelectionPro() {
    if (
        window.location.href.indexOf('acao=rel_bloco_protocolo_listar') === -1 ||
        window.__SEI_PRO_SMART_SIGNATURE_SELECTION__
    ) {
        return false;
    }

    var start = function() {
        if (window.__SEI_PRO_SMART_SIGNATURE_SELECTION__) return;
        if (!checkConfigValue('selecaointeligenteblocoassinatura')) return;
        if (!$('#frmRelBlocoProtocoloLista').length || !$('#tblProtocolosBlocos').length) return;
        if (!$('#btnAssinar').length) return;
        if (!renderSignatureBlockSelectionPro()) return;

        // Reimplementação inspirada funcionalmente no seletor de documentos para assinatura do projeto SEI++.
        $(document).on('click', '.seiProSignatureSelection a[data-selection-signature]', function(event) {
            event.preventDefault();
            applySignatureBlockSelectionPro($(this).attr('data-selection-signature'));
        });

        window.__SEI_PRO_SMART_SIGNATURE_SELECTION__ = true;
    };

    if (window.__SEI_PRO_CONFIG_READY__) {
        start();
    } else {
        window.addEventListener('sei-pro-config-ready', start, { once: true });
    }

    return true;
}
export function syncProcessNotificationsPro(force) {
    if (typeof checkConfigValue !== 'function') return false;

    var enabled = checkConfigValue('notificacaonovoprocesso');
    var count = enabled ? getProcessNotificationCountPro() : 0;
    var stateKey = [
        window.location.host || '',
        $('#lnkUsuarioSistema').attr('title') || getOptionsPro('usuarioSistema') || '',
        siglaUnidadeAtual || ''
    ].join('::');

    if (!stateKey.replace(/:/g, '').trim()) return false;

    if (
        !force &&
        window.__SEI_PRO_PROCESS_NOTIFICATION_LAST__ &&
        window.__SEI_PRO_PROCESS_NOTIFICATION_LAST__.enabled === enabled &&
        window.__SEI_PRO_PROCESS_NOTIFICATION_LAST__.count === count &&
        window.__SEI_PRO_PROCESS_NOTIFICATION_LAST__.key === stateKey
    ) {
        return false;
    }

    window.__SEI_PRO_PROCESS_NOTIFICATION_LAST__ = {
        enabled: enabled,
        count: count,
        key: stateKey
    };

    var runtimeApi = (typeof browser !== 'undefined' && browser.runtime)
        ? browser
        : ((typeof chrome !== 'undefined' && chrome.runtime) ? chrome : null);

    if (!runtimeApi || !runtimeApi.runtime || typeof runtimeApi.runtime.sendMessage !== 'function') {
        return false;
    }

    // Reimplementação inspirada funcionalmente no recurso de aviso de novos processos do projeto SEI++.
    runtimeApi.runtime.sendMessage({
        action: 'syncNotificacaoProcessos',
        enabled: enabled,
        count: count,
        key: stateKey,
        label: siglaUnidadeAtual || window.location.host || ''
    }, function() {
        var runtimeError = runtimeApi.runtime && runtimeApi.runtime.lastError;
        if (runtimeError && verifyConfigValue && verifyConfigValue('debugpage')) {
            console.warn('Falha ao sincronizar notificações de processos:', runtimeError.message);
        }
    });

    return true;
}
window.initProcessNotificationsPro = function initProcessNotificationsPro() {
    if (window.__SEI_PRO_PROCESS_NOTIFICATION_INTERVAL__) return;

    var start = function() {
        if (window.__SEI_PRO_PROCESS_NOTIFICATION_INTERVAL__) return;
        syncProcessNotificationsPro(true);
        window.__SEI_PRO_PROCESS_NOTIFICATION_INTERVAL__ = window.setInterval(function() {
            syncProcessNotificationsPro(false);
        }, 10000);
    };

    if (window.__SEI_PRO_CONFIG_READY__) {
        start();
    } else {
        window.addEventListener('sei-pro-config-ready', start, { once: true });
    }
}
// [migrado para core/options.js] setOptionsPro, removeOptionsPro, updateOptionsPro
// [migrado para core/cookies.js] createCookiePro, readCookiePro, eraseCookiePro
// [migrado para core/texto.js] encodeURI_toHex, encodeJSON_toHex, unicodeToChar
// [migrado para core/sei] capitalizeFirstLetter
// [migrado para core/sei] randomString
// randomNumber migrada para SeiPro.core.numeros (src/core/numeros.js) — Fase 6
export function getProcessoUnidadePro(selected = false, obj = false) {
    if ($('#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado').length > 0) {
        var processosUnidade = [];
        var selectTableTr = (selected) 
                            ? $('#tblProcessosRecebidos, #tblProcessosGerados, .infraTable').find('tr.infraTrMarcada')
                            : $('#tblProcessosRecebidos, #tblProcessosGerados, .infraTable').find('tr');
        if (selectTableTr.length > 0) {
            selectTableTr.each(function(index){ 
                var a = $(this).find('td').eq(2).find('a').eq(0)
                var processo_sei = a.text();
                    processo_sei = (typeof processo_sei !== 'undefined') ? processo_sei : false;
                var id_procedimento = getParamsUrlPro(a.attr('href')).id_procedimento;
                    id_procedimento = (typeof id_procedimento !== 'undefined') ? id_procedimento : false;
                var especificacao = extractTooltipToArray(a.attr('onmouseover'));
                    especificacao = (especificacao) ? especificacao[0] : false;
                if (processo_sei && id_procedimento) { 
                    var _return = (obj) 
                                    ? {processo_sei: processo_sei, id_procedimento: id_procedimento, especificacao: especificacao}
                                    : processo_sei;
                    processosUnidade.push(_return); 
                }
            });
            if (obj) {
                processosUnidade.filter((processosUnidade, index, self) =>
                    index === self.findIndex((t) => (
                        t.processo_sei === processosUnidade.processo_sei
                    ))
                );
                setOptionsPro('objProcessoUnidade', processosUnidade);
            } else {
                uniqPro(processosUnidade);
                setOptionsPro('listaProcessoUnidade', processosUnidade);
            }
        } else {
            processosUnidade = false;
        }
        return processosUnidade;
    } else {
        if (obj)
            return getOptionsPro('objProcessoUnidade');
        else
            return getOptionsPro('listaProcessoUnidade');
    }
}
export function initListTypesSEI(callback = false, TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    if (typeof arrayListTypesSEI.selectTipoProc !== 'undefined' ) { 
        if (typeof callback === 'function') callback();
    } else {
        setTimeout(function(){ 
            if (TimeOut == 9000) getListTypesSEI();
            initListTypesSEI(callback, TimeOut - 100); 
            if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage'))console.log('Reload initListTypesSEI'); 
        }, 500);
    }
}
export function getListTypesSEI() {
    var hrefConsulta = $(mainMenu).find('a[href*="protocolo_pesquisa"]').attr('href');
    if (typeof hrefConsulta !== 'undefined' && hrefConsulta != '') {
        $.ajax({ url: hrefConsulta }).done(function (html) {
            var $htmlConsulta = $(html);
            var form = $htmlConsulta.find('#frmPesquisaProtocolo');
            var param = {};
                param['selectTipoProc'] = $htmlConsulta.find('#selTipoProcedimentoPesquisa option').map(function(){ if($(this).text().trim() != '') { return {name: $(this).text().trim(), value: $(this).val()} } }).get();
                param['selSeriePesquisa'] = $htmlConsulta.find('#selSeriePesquisa option').map(function(){ if($(this).text().trim() != '') { return {name: $(this).text().trim(), value: $(this).val()} } }).get();
            arrayListTypesSEI = param;
        });
    }
}
export function getCheckerProcessoPro() {
    $('<iframe>', {
        id:  'frmCheckerProcessoPro',
        name:  'frmCheckerProcessoPro',
        frameborder: 0,
        style: (checkBrowser() == 'Firefox') 
            ? 'width: 1px; height: 1px; position: absolute; top: -100px;' 
            // : 'width: 80%;height: 400px;position: absolute;top: 0;z-index: 99999;left: 0;background: #fff;border: 1px solid #999;',
            : 'width: 1px; height: 1px; position: absolute; top: -100px; display: none;',
        tableindex: '-1',
        scrolling: 'no'
    }).appendTo('body');
}
export function getDadosIframeProcessoPro(idProcedimento, mode) {
    if (typeof idProcedimento !== 'undefined' && idProcedimento != '' && !checkProcessoSigiloso() ) {
        if (mode == 'monitorados') {
            getDadosAjaxMonitoradoPro(idProcedimento);
            return;
        }
        if ( $('#frmCheckerProcessoPro').length == 0 ) { getCheckerProcessoPro(); }
        var url = url_host.replace('controlador.php','')+'controlador.php?acao=procedimento_trabalhar&id_procedimento='+idProcedimento;
        if (!checkProcessoSigiloso()) {
            $('#frmCheckerProcessoPro').attr('src', url).unbind().on('load', function(){
                checkDadosIframeProcessoPro(mode);
            });
        }
    }
}
export function checkDadosIframeProcessoPro(mode) {
    var iframe = $('#frmCheckerProcessoPro').contents();  
    var _ifrVisualizacao = iframe.find($ifrVisualizacao).contents();
    var _ifrArvore = iframe.find('#ifrArvore').contents();  
    var ifrArvoreElem = iframe.find('#ifrArvore');  

    if (!checkProcessoSigiloso(iframe)) {
        setTimeout(function () { 
            if ( _ifrVisualizacao.find('#divArvoreAcoes').length > 0) {
                getDadosProcessoPro(_ifrVisualizacao, _ifrArvore, mode);
                getLinksProcessoPro(_ifrVisualizacao, _ifrArvore);
                getLinksArvorePro(_ifrArvore);
                getDadosPesquisaPro(iframe, mode);
                getListaAtribuicaoProcesso(ifrArvoreElem, mode);
                unidade = SeiPro.sei.adapter.isNewSEI() ? $('#lnkInfraUnidade').text() : $('#selInfraUnidades').find('option:selected').text().trim();
            } else {
                checkDadosIframeProcessoPro(mode);
            }
        }, 500);
    } else {
        $('#frmCheckerProcessoPro, .sparkling-modal-container, #divInfraModalFundo').remove();
    }
}
export function getDadosPesquisaPro(iframe, mode) {
    var href = iframe.find(mainMenu).find('li a').map(function () { if (typeof $(this).attr('href') !== 'undefined' && $(this).attr('href').indexOf('acao=protocolo_pesquisar') !== -1) { return $(this).attr('href') } }).get().join();
    if (href != '') {
        var tiposDocumentos = [];
        $.ajax({ url: href }).done(function (html) {
            let $html = $(html);
                $html.find("#selSeriePesquisa").find('option').each(function(){
                    var id = $(this).attr('value');
                    var name = $(this).text().trim();
                    if ( name != '' ) { tiposDocumentos.push({id: id, name: name}) }
                });
                dadosProcessoPro.tiposDocumentos = tiposDocumentos;
        });
    }
}

export const getTypeSEI = async (type = 'documentos') => {
    try {
        if (type == 'documentos' && typeof dadosProcessoPro !== 'undefined' && typeof dadosProcessoPro.tiposDocumentos !== 'undefined' && dadosProcessoPro.tiposDocumentos.length) return dadosProcessoPro.tiposDocumentos;
        if (type == 'processos' && typeof dadosProcessoPro !== 'undefined' && typeof dadosProcessoPro.propProcesso !== 'undefined' && typeof dadosProcessoPro.propProcesso.selTipoProcedimento_select !== 'undefined' && dadosProcessoPro.propProcesso.selTipoProcedimento_select.length) return dadosProcessoPro.propProcesso.selTipoProcedimento_select
        
        const href = $(mainMenu).find('li a').map(function () { 
            if (typeof $(this).attr('href') !== 'undefined' && $(this).attr('href').indexOf('acao=protocolo_pesquisar') !== -1) { 
                return $(this).attr('href'); 
            } 
        }).get().join();
        
        if (href === '') {
            throw new Error('Erro ao obter a URL de pesquisa de protocolos');
        }
        
        const html = await $.ajax({ url: href });
        const $html = $(html);
        let listArray = [];
        const elemSelect = type === 'documentos' ? $html.find("#selSeriePesquisa") : $html.find("#selTipoProcedimentoPesquisa");
        
        elemSelect.find('option').each(function(){
            const id = $(this).attr('value');
            const name = $(this).text().trim();
            if (name !== '') { listArray.push({id: id, name: name}); }
        });
        
        return listArray;
        
    } catch (error) {
        console.error('Erro ao obter tipos de documentos:', error);
        alertaBoxPro('Error', 'exclamation-triangle', error.message);
        return [];
    }
};

export function getDadosProcessoPro(_ifrVisualizacao, _ifrArvore, mode) {
    var processo = {};

    var acompEsp = _ifrArvore.find('a[target="ifrVisualizacao"][href*="controlador.php?acao=acompanhamento_cadastrar"]');
    var arrayAcompEsp = (acompEsp.length > 0) ? {url: acompEsp.attr('href'), title: acompEsp.find('img').attr('title').split(/\r?\n|\r|\n/g)[1]} : '';

    if (_ifrVisualizacao.find('#divArvoreAcoes a').length) {
        _ifrVisualizacao.find('#divArvoreAcoes a').each(function(index){
            var href = $(this).attr('href');
            if ((href.indexOf('acao=procedimento_alterar') !== -1) || (href.indexOf('acao=procedimento_consultar') !== -1)) {
                ajaxDadosProcessoPro(href, mode, arrayAcompEsp);
            } else if (href.indexOf('acao=procedimento_gerar_pdf') !== -1) {
                ajaxDadosDocumentosPro(href, mode);
            }
        });
    } else {
        var linkArvore = getLinksArvoreAjax(_ifrArvore.find('html').html());
        if (linkArvore.length) {
            $.each(linkArvore,function(i,v){
                var href = v.url;
                if ((href.indexOf('acao=procedimento_alterar') !== -1) || (href.indexOf('acao=procedimento_consultar') !== -1)) {
                    ajaxDadosProcessoPro(href, mode, arrayAcompEsp);
                } else if (href.indexOf('acao=procedimento_gerar_pdf') !== -1) {
                    ajaxDadosDocumentosPro(href, mode);
                }
            });
        }
    }
}
export function getLisDocsProcessoPro() {
    var ifrArvore = $('#ifrArvore');
    var arrayLinksArvore = getTreeLinksSession();
    var href = getTreeLinkUrlByName('Gerar Arquivo PDF do Processo');
    if (href !== null) {
        ajaxDadosDocumentosPro(href, false);
    }
}
export function getLinksArvorePro(_ifrArvore) { 
    
    if (SeiPro.sei.adapter.isNewSEI() && getSeiVersionPro() && compareVersionNumbers(getSeiVersionPro(),'4.1.0') >= 0) {
        var link = _ifrArvore.find('#divConsultarAndamento a').attr('onclick');
            link = typeof link !== 'undefined' ? link.split("'")[1] : false;
            if (link) getDadosAndamentoPro(link);
    } else {
        _ifrArvore.find('script').each(function(i){
            if (typeof $(this).attr('src') === 'undefined' && $(this).html().indexOf('consultarAndamento') !== -1) { 
                var text = $(this).html();
                var link = $.map(text.split("'"), function(substr, i) {
                return (i % 2 && substr.indexOf('controlador.php?acao=') !== -1) ? substr : null;
                });
                if ( link.length > 0 ) {
                    $.each(link,function(index, value){
                        var name = '';
                        if ( value.indexOf('?acao=procedimento_consultar_historico') !== -1 ) { 
                            getDadosAndamentoPro(value);
                            // console.log('&&',value);
                        }
                    });
                }
            }
        });
    }
}
export function getDadosAndamentoPro(href) {
    //var andamento = [];
        $.ajax({ url: href }).done(function (html) {
            let $html = $(html);
                /*
                $html.find("#tblHistorico").find('tr').each(function(){
                    var datahora = $(this).find('td').eq(0).text().trim();
                        datahora = moment(datahora,'DD/MM/YYYY HH:mm').format('YYYY-MM-DD HH:mm:ss');
                    var unidade = $(this).find('td').eq(1).text();
                    var usuario = $(this).find('td').eq(2).text();
                    var descricao = $(this).find('td').eq(3).text();
                    var descricao_alt = $(this).find('td').eq(3).find('a').attr('alt');
                    if ( unidade != '' ) { andamento.push({datahora: datahora, unidade: unidade, usuario: usuario, descricao: descricao, descricao_alt: descricao_alt}) }
                });
                */
            var andamento = getArrayHistorico($html);
            var processo = $html.find('#divInfraBarraLocalizacao').text().trim().split(' ');
                processo = processo[processo.length-1];
            var id_procedimento = $html.find('#frmProcedimentoHistorico').attr('action'); 
                id_procedimento = (typeof id_procedimento !== 'undefined' && id_procedimento != '') ? getParamsUrlPro(id_procedimento).id_procedimento : '';
                
            var listAndamento = {historico_completo: false, processo: processo, id_procedimento: id_procedimento, andamento: andamento};
            if (typeof dadosProcessoPro.listAndamento !== 'undefined' && typeof dadosProcessoPro.listAndamento.historico_completo !== 'undefined' && dadosProcessoPro.listAndamento.historico_completo) {
                console.log('Ignore getDataRecebimentoPro');
            } else {
                dadosProcessoPro.listAndamento = listAndamento;
                setSessionProcessosPro(dadosProcessoPro);
                getDataRecebimentoPro(listAndamento);
            }
        });
}
// getDataRecebimentoPro is provided by shared/legacy/datas-legacy-api.js.
export function getLinksProcessoPro(_ifrVisualizacao, _ifrArvore) {
    var linksArvore = [];
    _ifrVisualizacao.find('script').each(function(i){
        if (typeof $(this).attr('src') === 'undefined' && $(this).html().indexOf('objAjaxVerificacaoAssinatura') !== -1) { 
            var text = $(this).html();
            var link = $.map(text.split("'"), function(substr, i) {
               return (i % 2 && substr.indexOf('controlador.php?acao=') !== -1) ? substr : null;
            });
            if ( link.length > 0 ) {
                $.each(link,function(index, value){
                        var name = '';
                        //var icon = '';
                        //var alt = '';
                        if ( value.indexOf('?acao=procedimento_concluir') !== -1 && _ifrVisualizacao.find('img[title="Concluir Processo"]').length > 0 ) { 
                            name = 'Concluir Processo';
                        } else if ( value.indexOf('?acao=procedimento_ciencia') !== -1 && _ifrVisualizacao.find('img[title="Ci\u00EAncia"]').length > 0 ) { 
                            name = 'Ci\u00EAncia'; 
                        } else if ( value.indexOf('?acao=procedimento_enviar_email') !== -1 && _ifrVisualizacao.find('img[title="Enviar Correspond\u00EAncia Eletr\u00F4nica"]').length > 0 ) { 
                            name = 'Enviar Correspond\u00EAncia Eletr\u00F4nica';
                        } else if ( value.indexOf('?acao=bloco_selecionar_processo') !== -1 && _ifrVisualizacao.find('img[title="Incluir em Bloco"]').length > 0 ) { 
                            name = 'Incluir em Bloco';
                        } else if ( value.indexOf('?acao=procedimento_reabrir') !== -1 && _ifrVisualizacao.find('img[title="Reabrir Processo"]').length > 0 ) { 
                            name = 'Reabrir Processo';
                        } else if ( value.indexOf('?acao=procedimento_atualizar_andamento') !== -1 && _ifrVisualizacao.find('img[title="Atualizar Andamento"]').length > 0 ) { 
                            name = 'Atualizar Andamento';
                        } 
                        var data = (typeof jmespath !== 'undefined' && parent.iconsFlashMenu)
                            ? jmespath.search(parent.iconsFlashMenu, "[?name=='"+name+"'] | [0]")
                            : null;
                        if ( name != '' && data ) { linksArvore.push({ url: value, name: data.name, icon: data.icon, alt: data.alt}); }
                        else if ( name != '' ) { linksArvore.push({ url: value, name: name, icon: '', alt: name}); }
                });
            }
        }
    });
    if (SeiPro.sei.adapter.isNewSEI() && getSeiVersionPro() && compareVersionNumbers(getSeiVersionPro(),'4.1.0') >= 0) {
        linksArvore = getLinksArvoreAjax(_ifrArvore.find('html').html());
        dadosProcessoPro.listLinks = linksArvore;
    } else {
        dadosProcessoPro.listLinks = linksArvore;
    }
    var ifrArvore = getIframeArvoreElement();
    if (ifrArvore && ifrArvore.contentWindow && typeof ifrArvore.contentWindow.initSeiProArvore === 'function') { ifrArvore.contentWindow.initSeiProArvore(); }
}
export function ajaxDadosDocumentosPro(href, mode, callback = false) {
    var documentos = [];
    $.ajax({ url: href }).done(function (html) {
        let $html = $(html);
        $html.find('#tblDocumentos tbody tr.infraTrClara').each(function () { 
            var a = $(this).find('td').eq(1).find('a');
            if ( a.attr('href') ) {
                documentos.push({
                    id_documento: getParamsUrlPro(a.attr('href')).id_documento,
                    id_protocolo: getParamsUrlPro(href).id_procedimento,
                    nr_sei: a.text(),
                    nome_documento: $(this).find('td').eq(2).text(),
                    documento: $(this).find('td').eq(2).text(),
                    data_assinatura: $(this).find('td').eq(3).text(),
                    assinatura: undefined,
                    sigilo: undefined,
                    nativo: undefined
                });
            }
        });
        dadosProcessoPro.listDocumentosAssinados = documentos;
        setSessionProcessosPro(dadosProcessoPro);
        if (typeof callback === 'function') callback(documentos);
    });
}
export function ajaxDadosProcessoPro(href, mode, arrayAcompEsp, callback = false) {
    var processo = {};
    $.ajax({ url: href }).done(function (html) {
        let $html = $(html);
        processo.action = $html.find("#frmProcedimentoCadastro").attr('action');
        processo.acompanhamentoEsp = arrayAcompEsp;
        processo.selAssuntos_select = $html.find("#selAssuntos option").map(function () { return $(this).text(); }).get();
        processo.selTipoProcedimento_select = $html.find("#selTipoProcedimento option").map(function () { return {id: $(this).val(), name: $(this).text() }; }).get();
        processo.selHipoteseLegal_select = $html.find("#selHipoteseLegal option").map(function () { return {id: $(this).val(), name: $(this).text() }; }).get();
        $html.find('form input[type=hidden]').each(function () { 
            if ( $(this).attr('id') && $(this).attr('id').indexOf('hdn') !== -1) {
                processo[$(this).attr('id')] = $(this).val();
            }
        });
        $html.find('form input[type=text]').each(function () { 
            if ( $(this).attr('id') && $(this).attr('id').indexOf('txt') !== -1) {
                processo[$(this).attr('id')] = $(this).val();
            }
        });
        $html.find('form select').each(function () { 
            if ( $(this).attr('id') && $(this).attr('id').indexOf('sel') !== -1) {
                processo[$(this).attr('id')] = $(this).val();
            }
        });
        processo.selInteressadosProcedimento = $html.find("#selInteressadosProcedimento option").map(function () { return $(this).text(); }).get();
        processo.selInteressadosProcedimento_list = $html.find("#selInteressadosProcedimento option").map(function () { return {name: $(this).text(), value: $(this).attr('value')} }).get();
        processo.selAssuntos = $html.find("#selAssuntos option").map(function () { return $(this).text(); }).get();
        processo.rdoNivelAcesso = $html.find('input[name=rdoNivelAcesso]:checked').val();
        processo.urlHipoteseLegal = getUrlHipoteseLegal(html);
        
        /*
        var arrayObs = [{unidade: unidade, observacao: $html.find('#txaObservacoes').val()}];
        if ($html.find('#divObservacoesOutras').length > 0) { 
            var arrayObs1 = $html.find('#divObservacoesOutras').find('tbody tr').map(function () { if ($(this).find('td').eq(0).text() != '') { return {unidade: $(this).find('td').eq(0).text(), observacao: $(this).find('td').eq(1).text()} } }).get();
            Array.prototype.push.apply(arrayObs,arrayObs1);
        }
        processo.txaObservacoes = arrayObs;
        */        

        var txtObs = $html.find('#txaObservacoes').val();
            txtObs = (txtObs.indexOf('\n') !== -1) 
                    ? $.map(txtObs.split('\n'), function(substr, i) { if (substr.charAt(0) != '#') { return substr.trim() } }).join(' ') 
                    : (txtObs.charAt(0) != '#') ? txtObs : '';
        var arrayObs = [{unidade: siglaUnidadeAtual, observacao: txtObs}];
        if ($html.find('#divObservacoesOutras').length > 0) { 
            var arrayObsList = $html.find('#divObservacoesOutras').find('tbody tr').map(function () { 
                                    if ($(this).find('td').eq(0).text() != '') { 
                                        var txtObsTd = $(this).find('td').eq(1).text();
                                            txtObsTd = (txtObsTd.indexOf('\n') !== -1) 
                                                    ? $.map(txtObsTd.split('\n'), function(substr, i) { if (substr.charAt(0) != '#') { return substr.trim() } }).join(' ') 
                                                    : (txtObsTd.charAt(0) != '#') ? txtObsTd : '';
                                        return {unidade: $(this).find('td').eq(0).text(), observacao: txtObsTd} 
                                    } 
                                }).get();
                if (arrayObsList.length > 0) { Array.prototype.push.apply(arrayObs,arrayObsList) }
        }
        processo.txaObservacoes = arrayObs;
        
        var tagsObs = $html.find('#txaObservacoes').val();
            tagsObs = (tagsObs.indexOf('\n') !== -1) 
                    ?   $.map(tagsObs.split('\n'), function(substr, i) { if (substr.charAt(0) == '#') { 
                            return (substr.indexOf(':') !== -1) ? [{name: removeAcentos(substr.split(':')[0].replace('#','')).replace(/\ /g, '').toLowerCase().trim(), value: substr.split(':')[1].trim()}] : null;
                        } })
                    : (tagsObs.charAt(0) == '#') 
                           ? (tagsObs.indexOf(':') !== -1) ? [{name: removeAcentos(tagsObs.split(':')[0].replace('#','')).replace(/\ /g, '').toLowerCase().trim(), value: tagsObs.split(':')[1].trim()}] : null
                           : null;
        var arrayTags = (tagsObs !== null) ? [{unidade: siglaUnidadeAtual, tags: tagsObs}] : null; 
        if ($html.find('#divObservacoesOutras').length > 0) { 
            var arrayTagsList = $html.find('#divObservacoesOutras').find('tbody tr').map(function () { 
                                    if ($(this).find('td').eq(0).text() != '') { 
                                        var tagsObsTd = $(this).find('td').eq(1).text();
                                            tagsObsTd = (tagsObsTd.indexOf('\n') !== -1) 
                                                    ? $.map(tagsObsTd.split('\n'), function(substr, i) { 
                                                        if (substr.charAt(0) == '#') { 
                                                            return (substr.indexOf(':') !== -1) ? [{name: removeAcentos(substr.split(':')[0].replace('#','')).replace(/\ /g, '').toLowerCase().trim(), value: substr.split(':')[1].trim()}] : null;
                                                        } })
                                                    : (tagsObsTd.charAt(0) == '#') 
                                                        ? (tagsObsTd.indexOf(':') !== -1) ? [{name: removeAcentos(tagsObsTd.split(':')[0].replace('#','')).replace(/\ /g, '').toLowerCase().trim(), value: tagsObsTd.split(':')[1].trim()}] : null
                                                        : null;
                                        return (tagsObsTd !== null) ? {unidade: $(this).find('td').eq(0).text(), tags: tagsObsTd} : null
                                    } 
                                }).get();
                if (typeof arrayTags !== 'undefined' && arrayTags !== null && typeof arrayTagsList !== 'undefined' && arrayTagsList !== null && arrayTagsList.length > 0) { Array.prototype.push.apply(arrayTags,arrayTagsList) }
        }
        processo.txaTagsObservacoes = arrayTags;
        
        dadosProcessoPro.propProcesso = processo;
        if (typeof callback === 'function') callback(processo);

        if (checkConfigValue('historicoproc')) {
            setHistoryProcessosPro(dadosProcessoPro);
        }

        setTimeout(function(){ 
            updateTitlePage(mode);
            callAtividades('setTipoPrescricaoProcesso');
        }, 500);
        if (mode == 'editor' || mode == 'gantt' || mode == 'projeto' || mode == 'dados' || mode == 'processo') { 
            checkDadosIframeDocumentosPro(mode);
        }
        if (mode == 'processo') { 
            setTimeout(function(){ resizeArvoreMaxWidth() }, 500);
        }
    }).fail(function(data){
        console.log(dadosProcessoPro.propProcesso, 'Erro ao acessar dadosProcessoPro.propProcesso');
    });
}
// [migrado para sei/urls.js] getUrlHipoteseLegal
export function getHipoteseLegal(urlHipoteseLegal = dadosProcessoPro.propProcesso.urlHipoteseLegal, nivelAcesso = 1, callback = false) {
    $.ajax({
        type: "POST",
        url: urlHipoteseLegal,
        dataType: 'text',
        data: {
            primeiroItemValor: null,
            primeiroItemDescricao: '',
            valorItemSelecionado: '',
            staNivelAcesso: parseInt(nivelAcesso)
        },
        success: function(result){
            var html_result = $(result.replace('<?xml version="1.0" encoding="iso-8859-1"?>','')).html();
            if (html_result != '' && typeof callback === 'function') {
                callback(html_result);
            }
        }
    });
}
export function checkDadosIframeDocumentosPro(mode) {
    var i = 0;
    var ifrArvore = $('#frmCheckerProcessoPro').contents().find('#ifrArvore').contents();
        ifrArvore.find('#topmenu a').each(function(index){
            var href = $(this).attr('href');
            if (typeof href !== 'undefined' && href.indexOf('&abrir_pastas=1') !== -1) {
                i = 1;
                $('#frmCheckerProcessoPro').attr('src', href).unbind().on('load', function(){
                    var ifrArvoreOpen = $('#frmCheckerProcessoPro').contents();
                        // Stub de atualizarVisualizacao (no-op) para a SEI não tentar
                        // auto-refresh nesse iframe checker oculto. Antes injetava
                        // <script> inline via jQuery append — bloqueado pela CSP da
                        // página SEI (script-src 'self', sem 'unsafe-inline'). O iframe
                        // é MESMA ORIGEM (domínio do SEI), então dá pra atribuir a
                        // propriedade direto no contentWindow — acesso cross-frame
                        // same-origin padrão, não precisa de <script> nenhum.
                        var ifrWin = this.contentWindow;
                        if (ifrWin) { ifrWin.atualizarVisualizacao = function () { return; }; }
                        arrayDadosIframeDocumentosPro(ifrArvoreOpen, mode);
                });
            }
        });
        if ( i == 0 ) { arrayDadosIframeDocumentosPro(ifrArvore, mode) }
}
export function arrayDadosIframeDocumentosPro(ifrArvore, mode) {
    getListDocumentosArvore(ifrArvore);
    if (mode == 'editor') { 
        // getDialogCitacaoDocumento();
        // These live on the MAIN-world editor bundle after WAR inject; isolated
        // sei-functions cannot see them. Soft-call when present (legacy same-world).
        setTimeout(function(){ 
            if (typeof getDialogDadosEditor === 'function') getDialogDadosEditor();
        }, 1000);
        if (typeof insertAutomaticMinutaWatermark === 'function') insertAutomaticMinutaWatermark();
        try {
            document.documentElement.setAttribute('data-seipro-processo-dados', 'ready');
            window.dispatchEvent(new CustomEvent('seipro-processo-dados-ready'));
        } catch (e) { /* noop */ }
    } else if (mode == 'gantt') { 
        updateSelectConcluirEtapa();
    } else if (mode == 'projeto') { 
        updateSelectConcluirProjetoEtapa();
    } else if (mode == 'monitorados') {
        parent.updateSelectMonitorados();
        // initAppendIconMonitorados migrado p/ ESM (monitorados/boot.js); alias no parent.
        if (typeof parent.initAppendIconMonitorados === 'function') parent.initAppendIconMonitorados();
        console.log('updateSelectMonitorados');
    } else if (mode == 'dados') {
        //loopIDProcedimentos();
    }
    var dadosProcessoPro = pullDadosProcessoSession();
    // console.log('->seetSessionProcessosPro', dadosProcessoPro.listAndamento);
    setSessionProcessosPro(dadosProcessoPro);
    if ($('#actionsTablePro').length) {
        getDocumentosActions();
    }
}
export function getArvoreInitSignature(root) {
    var scope = (root && typeof root.find === 'function') ? root : $(root || document);
    var targetFrame = (typeof ifrVisualizacao_ !== 'undefined' && ifrVisualizacao_) ? ifrVisualizacao_ : null;
    if (!targetFrame) return '';
    var anchors = scope.find('a[id*="anchor"][target="' + targetFrame + '"]');
    if (!anchors.length) return '';
    return anchors.map(function() {
        return [
            $(this).attr('id') || '',
            $(this).attr('href') || ''
        ].join('|');
    }).get().join('::');
}
export function getListDocumentosArvore(ifrArvore) {
    var processo = [];
    var dadosProcessoPro = pullDadosProcessoSession();
    var existingDocs = (typeof dadosProcessoPro.listDocumentos !== 'undefined' && $.isArray(dadosProcessoPro.listDocumentos)) ? dadosProcessoPro.listDocumentos : [];
    var docsById = {};
    var docsOrder = [];

    function hasValue(value) {
        return typeof value !== 'undefined' && value !== null && value !== '';
    }

    function mergePreservedFields(baseDoc, prevDoc) {
        var mergedDoc = $.extend({}, baseDoc);
        var fieldsToPreserve = ['assinatura', 'data_documento', 'data_assinatura', 'unidade', 'assinado', 'sigilo', 'nativo'];
        $.each(fieldsToPreserve, function(_, field) {
            if (!hasValue(mergedDoc[field]) && hasValue(prevDoc[field])) {
                mergedDoc[field] = prevDoc[field];
            }
        });
        return mergedDoc;
    }

    ifrArvore.find(`#divArvore a[target="${ifrVisualizacao_}"]`).each(function(index){
        var txt = $(this).text().trim();
        var text = txt.split(' ');
        var id_protocolo = $(this).attr('id').replace('anchor','');
        var nr_sei = (txt.indexOf(' ') !== -1) ? text[text.length-1] : '';
        var documento = txt.replace(nr_sei, '').trim();
            nr_sei = (nr_sei.indexOf('(') !== -1) ? nr_sei.replace(')','').replace('(','') : nr_sei;
        var assinatura = (ifrArvore.find('#anchorA'+id_protocolo).length) ? (ifrArvore.find('#anchorA'+id_protocolo+' img').attr('title') || '').replace('Assinado por:','').trim() : '';
        var sigilo = (ifrArvore.find('#iconNA'+id_protocolo).length) ? (ifrArvore.find('#iconNA'+id_protocolo+'').attr('title') || '').trim() : '';
        var data_assinatura =   (typeof dadosProcessoPro.listDocumentosAssinados !== 'undefined' && !$.isEmptyObject(dadosProcessoPro.listDocumentosAssinados) && jmespath.search(dadosProcessoPro.listDocumentosAssinados, "[?id_documento=='"+id_protocolo+"'].data_assinatura | length(@)") > 0)
                                ? jmespath.search(dadosProcessoPro.listDocumentosAssinados, "[?id_documento=='"+id_protocolo+"'].data_assinatura | [0]")
                                : '';
        var nativo = (ifrArvore.find('#anchorImg'+id_protocolo+' img[src*="'+nameDocInterno+'"]').length) ? true : false;
        if (id_protocolo.indexOf('CD') === -1) { 
            var doc = {
                id_protocolo: id_protocolo,
                nr_sei: nr_sei,
                documento: documento,
                assinatura: assinatura,
                data_documento: (data_assinatura && data_assinatura != '' ? moment(data_assinatura, 'DD/MM/YYYY').format('YYYY-MM-DD HH:mm:ss') : false),
                data_assinatura: data_assinatura,
                sigilo: sigilo,
                nativo: nativo
            };
            if (typeof docsById[id_protocolo] === 'undefined') {
                docsById[id_protocolo] = doc;
                docsOrder.push(id_protocolo);
            } else {
                docsById[id_protocolo] = mergePreservedFields(doc, docsById[id_protocolo]);
            }
        }
    });

    $.each(existingDocs, function(_, existingDoc) {
        if (!existingDoc || !hasValue(existingDoc.id_protocolo)) return true;
        var idDoc = existingDoc.id_protocolo;
        if (typeof docsById[idDoc] === 'undefined') {
            docsById[idDoc] = existingDoc;
            docsOrder.push(idDoc);
        } else {
            docsById[idDoc] = mergePreservedFields(docsById[idDoc], existingDoc);
        }
    });

    $.each(docsOrder, function(_, idDoc) {
        if (typeof docsById[idDoc] !== 'undefined') {
            processo.push(docsById[idDoc]);
        }
    });

        dadosProcessoPro.treeModel = buildTreeModel({
            documents: processo,
            links: typeof arrayLinksArvore !== 'undefined' ? arrayLinksArvore : [],
            linksAll: typeof arrayLinksArvoreAll !== 'undefined' ? arrayLinksArvoreAll : [],
            iconsView: typeof arrayIconsView !== 'undefined' ? arrayIconsView : [],
            pageLinks: typeof arrayLinksPage !== 'undefined' ? arrayLinksPage : [],
            signature: getArvoreInitSignature(ifrArvore),
            source: window.location.href
        });
        dadosProcessoPro.listDocumentos = dadosProcessoPro.treeModel.documents;
        // console.log('->seetSessionProcessosPro', dadosProcessoPro.listAndamento);
        setSessionProcessosPro(dadosProcessoPro); 
}
export function buildTreeModel(treeModel = {}) {
    var model = {
        documents: [],
        documentsSigned: [],
        links: [],
        linksAll: [],
        iconsView: [],
        pageLinks: [],
        signature: '',
        source: ''
    };
    model.documents = normalizeTreeDocuments(treeModel.documents || treeModel.listDocumentos || []);
    model.documentsSigned = normalizeTreeDocuments(treeModel.documentsSigned || treeModel.listDocumentosAssinados || []);
    model.links = $.isArray(treeModel.links) ? treeModel.links.slice() : [];
    model.linksAll = $.isArray(treeModel.linksAll) ? treeModel.linksAll.slice() : [];
    model.iconsView = $.isArray(treeModel.iconsView) ? treeModel.iconsView.slice() : [];
    model.pageLinks = $.isArray(treeModel.pageLinks) ? treeModel.pageLinks.slice() : [];
    model.signature = typeof treeModel.signature !== 'undefined' && treeModel.signature !== null ? String(treeModel.signature) : '';
    model.source = typeof treeModel.source !== 'undefined' && treeModel.source !== null ? String(treeModel.source) : '';
    return model;
}
export function syncTreeModelSession(dadosProcesso = pullDadosProcessoSession(), patch = {}) {
    if (!dadosProcesso || typeof dadosProcesso !== 'object') {
        return buildTreeModel(patch);
    }
    var treeModel = getTreeModelSession(dadosProcesso);
    treeModel = buildTreeModel($.extend({}, treeModel, patch || {}));
    dadosProcesso.treeModel = treeModel;
    dadosProcesso.listDocumentos = treeModel.documents;
    dadosProcesso.listDocumentosAssinados = treeModel.documentsSigned;
    dadosProcesso.listLinks = treeModel.links;
    dadosProcesso.listLinksAll = treeModel.linksAll;
    dadosProcesso.treeIconsView = treeModel.iconsView;
    dadosProcesso.treePageLinks = treeModel.pageLinks;
    dadosProcesso.treeSignature = treeModel.signature;
    setSessionProcessosPro(dadosProcesso);
    return treeModel;
}
export function normalizeTreeDocuments(listDocumentos) {
    var docs = [];
    var docsById = {};
    var docsOrder = [];

    function hasValue(value) {
        return typeof value !== 'undefined' && value !== null && value !== '';
    }

    function addDoc(doc) {
        if (!doc || !hasValue(doc.id_protocolo)) return;
        var idDoc = doc.id_protocolo;
        if (typeof docsById[idDoc] === 'undefined') {
            docsById[idDoc] = $.extend({}, doc);
            docsOrder.push(idDoc);
        } else {
            docsById[idDoc] = $.extend({}, docsById[idDoc], doc);
        }
    }

    $.each(listDocumentos || [], function(_, doc) {
        addDoc(doc);
    });

    $.each(docsOrder, function(_, idDoc) {
        if (typeof docsById[idDoc] !== 'undefined') {
            docs.push(docsById[idDoc]);
        }
    });

    return docs;
}
export function getTreeModelSession(dadosProcesso = pullDadosProcessoSession()) {
    if (!dadosProcesso || typeof dadosProcesso !== 'object') {
        return buildTreeModel();
    }
    var treeModel = (typeof dadosProcesso.treeModel !== 'undefined' && dadosProcesso.treeModel !== null)
        ? buildTreeModel($.extend({}, dadosProcesso.treeModel))
        : buildTreeModel({
        documents: typeof dadosProcesso.listDocumentos !== 'undefined' ? dadosProcesso.listDocumentos : [],
        documentsSigned: typeof dadosProcesso.listDocumentosAssinados !== 'undefined' ? dadosProcesso.listDocumentosAssinados : [],
        links: typeof dadosProcesso.listLinks !== 'undefined' ? dadosProcesso.listLinks : [],
        linksAll: typeof dadosProcesso.listLinksAll !== 'undefined' ? dadosProcesso.listLinksAll : [],
        iconsView: typeof dadosProcesso.treeIconsView !== 'undefined' ? dadosProcesso.treeIconsView : [],
        pageLinks: typeof dadosProcesso.treePageLinks !== 'undefined' ? dadosProcesso.treePageLinks : [],
        signature: typeof dadosProcesso.treeSignature !== 'undefined' ? dadosProcesso.treeSignature : ''
    });
    if (!treeModel.links.length && $.isArray(dadosProcesso.listLinks)) {
        treeModel.links = $.merge([], dadosProcesso.listLinks);
    }
    if (!treeModel.links.length && typeof arrayLinksArvore !== 'undefined' && $.isArray(arrayLinksArvore)) {
        treeModel.links = $.merge([], arrayLinksArvore);
    }
    if (!treeModel.linksAll.length && $.isArray(dadosProcesso.listLinksAll)) {
        treeModel.linksAll = $.merge([], dadosProcesso.listLinksAll);
    }
    if (!treeModel.linksAll.length && typeof arrayLinksArvoreAll !== 'undefined' && $.isArray(arrayLinksArvoreAll)) {
        treeModel.linksAll = $.merge([], arrayLinksArvoreAll);
    }
    if (!treeModel.iconsView.length && $.isArray(dadosProcesso.treeIconsView)) {
        treeModel.iconsView = $.merge([], dadosProcesso.treeIconsView);
    }
    if (!treeModel.iconsView.length && typeof arrayIconsView !== 'undefined' && $.isArray(arrayIconsView)) {
        treeModel.iconsView = $.merge([], arrayIconsView);
    }
    if (!treeModel.pageLinks.length && $.isArray(dadosProcesso.treePageLinks)) {
        treeModel.pageLinks = $.merge([], dadosProcesso.treePageLinks);
    }
    if (!treeModel.pageLinks.length && typeof arrayLinksPage !== 'undefined' && $.isArray(arrayLinksPage)) {
        treeModel.pageLinks = $.merge([], arrayLinksPage);
    }
    if (!treeModel.documents.length && $.isArray(dadosProcesso.listDocumentos)) {
        treeModel.documents = normalizeTreeDocuments(dadosProcesso.listDocumentos);
    }
    if (!treeModel.documentsSigned.length && $.isArray(dadosProcesso.listDocumentosAssinados)) {
        treeModel.documentsSigned = normalizeTreeDocuments(dadosProcesso.listDocumentosAssinados);
    }
    return buildTreeModel(treeModel);
}
export function getTreeDocumentsSession(dadosProcesso = pullDadosProcessoSession()) {
    var treeModel = getTreeModelSession(dadosProcesso);
    return (treeModel && $.isArray(treeModel.documents)) ? treeModel.documents : [];
}
export function getTreeSignedDocumentsSession(dadosProcesso = pullDadosProcessoSession()) {
    var treeModel = getTreeModelSession(dadosProcesso);
    return (treeModel && $.isArray(treeModel.documentsSigned)) ? treeModel.documentsSigned : [];
}
export function getTreeLinksSession(dadosProcesso = pullDadosProcessoSession()) {
    var treeModel = getTreeModelSession(dadosProcesso);
    return (treeModel && $.isArray(treeModel.links)) ? treeModel.links : [];
}
export function getTreeLinksAllSession(dadosProcesso = pullDadosProcessoSession()) {
    var treeModel = getTreeModelSession(dadosProcesso);
    return (treeModel && $.isArray(treeModel.linksAll)) ? treeModel.linksAll : [];
}
export function getTreeIconsViewSession(dadosProcesso = pullDadosProcessoSession()) {
    var treeModel = getTreeModelSession(dadosProcesso);
    return (treeModel && $.isArray(treeModel.iconsView)) ? treeModel.iconsView : [];
}
export function getTreePageLinksSession(dadosProcesso = pullDadosProcessoSession()) {
    var treeModel = getTreeModelSession(dadosProcesso);
    return (treeModel && $.isArray(treeModel.pageLinks)) ? treeModel.pageLinks : [];
}
export function getTreeLinkByName(nameLink, dadosProcesso = pullDadosProcessoSession(), includePageLinks = false) {
    if (!nameLink) return false;
    var listLinks = getTreeLinksSession(dadosProcesso);
    var link = $.grep(listLinks, function(item) {
        return item && item.name == nameLink;
    })[0];
    if (!link && includePageLinks) {
        listLinks = getTreePageLinksSession(dadosProcesso);
        link = $.grep(listLinks, function(item) {
            return item && item.name == nameLink;
        })[0];
    }
    return link || false;
}
export function getTreeLinkUrlByName(nameLink, dadosProcesso = pullDadosProcessoSession(), includePageLinks = false) {
    var link = getTreeLinkByName(nameLink, dadosProcesso, includePageLinks);
    return (link && typeof link.url !== 'undefined' && link.url !== null && link.url !== '') ? link.url : false;
}
export function getTreeDocumentIndexById(id_documento, dadosProcesso = pullDadosProcessoSession()) {
    var docs = getTreeDocumentsSession(dadosProcesso);
    if (!id_documento || !docs.length) return -1;
    return docs.findIndex(function(doc) {
        return doc && doc.id_protocolo == id_documento;
    });
}
export function updateTreeDocumentById(id_documento, patch, dadosProcesso = pullDadosProcessoSession()) {
    var docs = getTreeDocumentsSession(dadosProcesso);
    var index = getTreeDocumentIndexById(id_documento, dadosProcesso);
    if (index === -1) return false;
    docs[index] = $.extend({}, docs[index], patch || {});
    dadosProcesso.listDocumentos = normalizeTreeDocuments(docs);
    return docs[index];
}
export function removeTreeDocumentById(id_documento, dadosProcesso = pullDadosProcessoSession()) {
    var docs = getTreeDocumentsSession(dadosProcesso);
    var index = getTreeDocumentIndexById(id_documento, dadosProcesso);
    if (index === -1) return false;
    docs.splice(index, 1);
    dadosProcesso.listDocumentos = normalizeTreeDocuments(docs);
    return true;
}
export function getHistoryProcessosPro() {
    $(infraBarraS+'.barSuspenso').trigger('click');
    var dadosHistoricoProcessoPro = localStorageRestorePro('dadosHistoricoProcessoPro');
        var htmlBox =       '<div id="boxHistory" class="tabelaPanelScroll seipro-atividades-history" style="margin-top: 10px;height: 400px;">'+
                            '   <table id="historyTablePro" style="margin-top: 35px; font-size: 8pt !important;width: 100%;" class="seiProForm tableAtividades seipro-atividades-table tableDialog tableInfo tableZebra">'+
                            '        <thead>'+
                            '            <tr class="tableHeader">'+
                            '                <th class="tituloControle" style="text-align: center; width: 180px;">Processo</th>'+
                            '                <th class="tituloControle" style="text-align: center;font-weight: bold;">Tipo / Descri\u00E7\u00E3o</th>'+
                            '                <th class="tituloControle" style="text-align: center;font-weight: bold;">Acesso</th>'+
                            '            </tr>'+
                            '        </thead>'+
                            '        <tbody>';
        if (dadosHistoricoProcessoPro){
            $.each(dadosHistoricoProcessoPro, function(i, v){
                htmlBox +=  '   <tr style="text-align: left;">'+
                            '       <td>'+
                            '           <a style="margin-left: 5px;" href="'+url_host+'?acao=procedimento_trabalhar&id_procedimento='+v.id_procedimento+'" target="_blank">'+
                            '               <span class="bLink">'+
                            '                   '+v.protocolo+
                            '                   <i class="fas fa-external-link-alt bLink" style="font-size: 90%; text-decoration: underline;"></i>'+
                            '               </span>'+
                            '           </a>'+
                            '       </td>'+
                            '       <td>'+
                            '           <div style="color: #666; padding-top: 5px;">'+v.tipo_processo+'</div>'+
                            '           <div style="font-weight: bold; padding: 5px 0;">'+v.descricao+'</div>'+
                            '       <td data-time-sorter="'+v.datetime+'">'+
                            '           <div onmouseover="return infraTooltipMostrar(\'Acessado em '+moment(v.datetime,'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY [\u00E0s] HH:mm')+'\');" onmouseout="return infraTooltipOcultar();">'+
                            '               '+getDatesPreview({date: v.datetime})+
                            '           </div>'+
                            '       <td>'+
                            '   </tr>';
            });
        }
        htmlBox +=          '   </table>'+
                            '</div>';

    resetDialogBoxPro('dialogBoxPro');
    dialogBoxPro = $('#dialogBoxPro')
        .html('<div class="dialogBoxDiv">'+htmlBox+'</div>')
        .dialog({
            title: 'Hist\u00F3rio de Processos Visitados',
            width: 980,
            height: 450,
            resize: function(event, ui) {
                setTabelaPanelScrollHeight('#boxHistory', 30);
            },
            open: function(event, ui) {
                setTabelaPanelScrollHeight('#boxHistory', 30);
            },
            close: function() { 
                $('#boxHistory').remove();
                resetDialogBoxPro('dialogBoxPro');
            }
    });
    setTimeout(function(){ 
        var historyTable = $('#historyTablePro');
            historyTable.tablesorter({
                sortLocaleCompare : true,
                sortList: [[2,1]],
                textExtraction: {
                    2: function (elem, table, cellIndex) {
                        var text_date = $(elem).data('time-sorter');
                        return text_date;
                    }
                },
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
                headers: {
                    0: { sorter: true},
                    1: { filter: true },
                    2: { filter: true }
                }
            }).on("filterEnd", function (event, data) {
                checkboxRangerSelectShift();
                var caption = $(this).find("caption").eq(0);
                var tx = caption.text();
                    caption.text(tx.replace(/\d+/g, data.filteredRows));
                    $(this).find("tbody > tr:visible > td > input").prop('disabled', false);
                    $(this).find("tbody > tr:hidden > td > input").prop('disabled', true);
            });
            // initPanelResize('#boxHistory', 'historicoPro');

        var filterHistory = historyTable.find('.tablesorter-filter-row').get(0);
        if (typeof filterHistory !== 'undefined') {
            var observerFilterHistory = new MutationObserver(function(mutations) {
                var _this = $(mutations[0].target);
                var _parent = _this.closest('table');
                var iconFilter = _parent.find('.filterTableHistory button');
                var checkIconFilter = iconFilter.hasClass('active');
                var hideme = _this.hasClass('hideme');
                if (hideme && checkIconFilter) {
                    iconFilter.removeClass('active');
                }
            });
            setTimeout(function(){ 
                var htmlFilterHistory =    '<div class="btn-group filterTableHistory" role="group" style="right: 45px;top: 18px;z-index: 999;position: absolute;">'+
                                            '   <button type="button" onclick="downloadTablePro(this)" data-icon="fas fa-download" style="padding: 0.1rem .5rem; font-size: 9pt;" data-value="Baixar" class="btn btn-sm btn-light">'+
                                            '       <i class="fas fa-download" style="padding-right: 3px; cursor: pointer; font-size: 10pt; color: #888;"></i>'+
                                            '       <span class="text">Baixar</span>'+
                                            '   </button>'+
                                            '   <button type="button" onclick="copyTablePro(this)" data-icon="fas fa-copy" style="padding: 0.1rem .5rem; font-size: 9pt;" data-value="Copiar" class="btn btn-sm btn-light">'+
                                            '       <i class="fas fa-copy" style="padding-right: 3px; cursor: pointer; font-size: 10pt; color: #888;"></i>'+
                                            '       <span class="text">Copiar</span>'+
                                            '   </button>'+
                                            '   <button type="button" onclick="cleanHistoryPro(this)" style="padding: 0.1rem .5rem; font-size: 9pt;" data-value="Apagar" class="btn btn-sm btn-light">'+
                                            '       <i class="fas fa-trash-alt" style="padding-right: 3px; cursor: pointer; font-size: 10pt;"></i>'+
                                            '       Apagar'+
                                            '   </button>'+
                                            '   <button type="button" onclick="filterTablePro(this)" style="padding: 0.1rem .5rem; font-size: 9pt;" data-value="Pesquisar" class="btn btn-sm btn-light '+(historyTable.find('tr.tablesorter-filter-row').hasClass('hideme') ? '' : 'active')+'">'+
                                            '       <i class="fas fa-search" style="padding-right: 3px; cursor: pointer; font-size: 10pt;"></i>'+
                                            '       Pesquisar'+
                                            '   </button>'+
                                            '</div>';
                    historyTable.find('thead .filterTableHistory').remove();
                    historyTable.find('thead').prepend(htmlFilterHistory);
                    observerFilterHistory.observe(filterHistory, {
                        attributes: true
                    });
                    historyTable.find('.tablesorter-filter-row input.tablesorter-filter').eq(2).attr('type','date');
            }, 500);
        }
    }, 500);
    if (typeof $().visible == 'undefined') $.getScript(URL_SPRO+"js/lib/jquery-visible.min.js");
}
export function getAllLinksFolder() {
    var _ifrArvore = $('#ifrArvore');
    var ifrArvore = _ifrArvore.contents();
        ifrArvore.find('a[id*="ancjoin"]').each(function(){
            if ($(this).find('img').attr('src').indexOf('plus.gif') !== -1) {
                var idPasta = $(this).attr('id').replace('ancjoin','');
                _ifrArvore[0].contentWindow.getLinksArvorePasta(idPasta); 
            } 
        });
        _ifrArvore[0].contentWindow.getLinksArvore();
}
export function initMergeAllAndamentosProcesso(callback, TimeOut = 9000) {
    if (TimeOut <= 0 || parent.window.name != '') { return; }
    if (typeof dadosProcessoPro !== 'undefined') {
        mergeAllAndamentosProcesso(callback);
    } else {
        setTimeout(function(){ 
            initMergeAllAndamentosProcesso(callback, TimeOut - 100); 
            if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage'))console.log('Reload initMergeAllAndamentosProcesso => '+TimeOut); 
        }, 500);
    }
}
export function mergeAllAndamentosProcesso(callback = false) {
    // if (typeof dadosProcessoPro.listAndamento !== 'undefined' && typeof dadosProcessoPro.listAndamento.historico_completo !== 'undefined' && dadosProcessoPro.listAndamento.historico_completo) {
        // if (typeof callback === 'function') callback();
    // } else {
        var _ifrArvore = $('#ifrArvore');
        var ifrArvore = _ifrArvore.contents();
        var arrayLinksArvoreAll = getTreeLinksAllSession();
        var id_procedimento = getParamsUrlPro(_ifrArvore.attr('src')).id_procedimento;
        var processo = ifrArvore.find(`a[target="${ifrVisualizacao_}"]`).eq(0).text().trim();
        var linkHistorico = SeiPro.sei.adapter.isSEI5() 
        ? ifrArvore.find('#divConsultarAndamento a').attr('onclick').match(/consultarAndamento\('([^']+)'\)/)?.[1]
        : typeof arrayLinksArvoreAll !== 'undefined' ? arrayLinksArvoreAll.filter(function(v){ return (v.indexOf('procedimento_consultar_historico') !== -1) }) : [];
        if (linkHistorico.length > 0) {
            var linkHistorico_ = SeiPro.sei.adapter.isSEI5() ? linkHistorico : linkHistorico[0];
            var listProc = {processo: processo, id_procedimento: id_procedimento};
            getDadosHistoricoUrlPro(linkHistorico_, listProc, true, function(andamento){
                var dadosProcessoPro = (typeof pullDadosProcessoSession().listAndamento !== 'undefined') ? pullDadosProcessoSession() : dadosProcessoPro;
                    dadosProcessoPro = (typeof dadosProcessoPro !== 'undefined') ? dadosProcessoPro : {};
                    dadosProcessoPro.listAndamento = andamento;
                    
                    $.each(getTreeDocumentsSession(dadosProcessoPro), function(index, value){
                        var data_documento = jmespath.search(dadosProcessoPro.listAndamento.andamento, "[?id_documento=='"+value.id_protocolo+"'] | [?contains(descricao, 'Gerado documento')] | [0].datahora");
                            data_documento = (data_documento !== null) ? data_documento : false;
                        var assinatura = jmespath.search(dadosProcessoPro.listAndamento.andamento, "[?id_documento=='"+value.id_protocolo+"'] | [?contains(descricao, 'Assinado')||contains(descricao, 'assinatura')]");
                        var data_assinatura = (assinatura !== null) ? assinatura : false;
                            data_assinatura = (data_assinatura && data_assinatura.length > 0 && typeof data_assinatura[0].descricao !== 'undefined' && data_assinatura[0].descricao.indexOf('Assinado Documento') !== -1) 
                                ? data_assinatura[0].datahora 
                                : value['data_assinatura'];
                            data_assinatura = (data_assinatura && data_assinatura.length > 0 && typeof data_assinatura[0].descricao !== 'undefined' && data_assinatura[0].descricao.indexOf('Cancelamento de assinatura') !== -1) 
                                ? false 
                                : data_assinatura;
                        var assinado = (assinatura && assinatura !== null && assinatura.length > 0 && typeof assinatura[0].descricao !== 'undefined' && assinatura[0].descricao.indexOf('Assinado Documento') !== -1) ? true : false;
                        var unidade = jmespath.search(dadosProcessoPro.listAndamento.andamento, "[?id_documento=='"+value.id_protocolo+"'] | [?contains(descricao, 'Gerado documento')] | [0].unidade");
                            unidade = (unidade !== null) ? unidade : false;

                        updateTreeDocumentById(value.id_protocolo, {
                            unidade: unidade,
                            data_assinatura: data_assinatura,
                            data_documento: data_documento,
                            assinado: assinado
                        }, dadosProcessoPro);
                        // console.log(index, value.id_protocolo, unidade, dadosProcessoPro.listDocumentos);
                    });
                    dadosProcessoPro.listAndamento.historico_completo = true;
                    // console.log('->seetSessionProcessosPro', dadosProcessoPro.listAndamento);
                    setSessionProcessosPro(dadosProcessoPro);
                    if (typeof callback === 'function') callback();
            });
        }
    // }
}
