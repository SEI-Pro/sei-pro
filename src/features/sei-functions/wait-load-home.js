/**
 * Sei Functions Pro — wait/load + home dados procedimentos.
 * (ponte temporária: jQuery/DOM legado; fatia do antigo body.js)
 */
import {
    alertaBoxPro,
    checkProcessoSigiloso,
    getCheckerProcessoPro,
    mergeAllAndamentosProcesso,
    pullDadosProcessoSession,
    resetDialogBoxPro,
    setSessionProcessosPro,
    updateUrlPage
} from './modules.js';

export function waitLoadPro(Obj, ElemRaiz, Elem, func, TimeOut = 6000) {
  if (TimeOut <= 0) return;

  var $obj = (Obj && typeof Obj.find === 'function') ? Obj : $(Obj);
  var $root = $obj.find(ElemRaiz);
  var hasTarget = function() {
    return $root.find(Elem).length > 0;
  };

  if (hasTarget()) {
    func();
    return;
  }

  if (typeof MutationObserver === 'function') {
    var rootNode = $root.get(0) || $obj.get(0) || document.body || document.documentElement;
    if (rootNode && rootNode.nodeType === 9) {
      rootNode = rootNode.documentElement || rootNode.body || rootNode;
    }
    if (rootNode) {
      window.__SEI_PRO_WAIT_LOAD_OBSERVERS__ = window.__SEI_PRO_WAIT_LOAD_OBSERVERS__ || new WeakMap();
      var rootObservers = window.__SEI_PRO_WAIT_LOAD_OBSERVERS__.get(rootNode);
      if (!rootObservers) {
        rootObservers = {};
        window.__SEI_PRO_WAIT_LOAD_OBSERVERS__.set(rootNode, rootObservers);
      }

      var waitKey = ElemRaiz + '::' + Elem;
      if (rootObservers[waitKey]) return;

      var observer = new MutationObserver(function() {
        if (hasTarget()) {
          observer.disconnect();
          delete rootObservers[waitKey];
          func();
        }
      });

      rootObservers[waitKey] = observer;
      observer.observe(rootNode, {
        childList: true,
        subtree: true
      });
      return;
    }
  }

  setTimeout(function () {
    waitLoadPro($obj, ElemRaiz, Elem, func, TimeOut - 100);
  }, 100);
}
export function waitLoadProSimple(Elem, func, TimeOut = 6000) {
  if (TimeOut <= 0) return;

  var $elem = (Elem && typeof Elem.length !== 'undefined') ? Elem : $(Elem);
  if ($elem && $elem.length > 0) {
    func();
    return;
  }

  if (typeof MutationObserver === 'function') {
    var rootNode = document.body || document.documentElement;
    if (rootNode) {
      window.__SEI_PRO_WAIT_LOAD_SIMPLE_OBSERVER__ = window.__SEI_PRO_WAIT_LOAD_SIMPLE_OBSERVER__ || false;
      if (window.__SEI_PRO_WAIT_LOAD_SIMPLE_OBSERVER__) return;
      window.__SEI_PRO_WAIT_LOAD_SIMPLE_OBSERVER__ = true;
      var observer = new MutationObserver(function() {
        var currentElem = (Elem && typeof Elem.length !== 'undefined') ? Elem : $(Elem);
        if (currentElem && currentElem.length > 0) {
          observer.disconnect();
          window.__SEI_PRO_WAIT_LOAD_SIMPLE_OBSERVER__ = false;
          func();
        }
      });
      observer.observe(rootNode, {
        childList: true,
        subtree: true
      });
      return;
    }
  }

  setTimeout(function () {
    waitLoadProSimple($elem, func, TimeOut - 100);
  }, 100);
}
export function execArvorePro(func) {
  var Obj = $("#ifrArvore").contents();
  waitLoadPro(Obj, "#divArvore > div", `a[target="${ifrVisualizacao_}"]`, function () {
    func();
    Obj.find("#divArvore > div > div:hidden").each(function () {
      var idPasta = Obj.find(this).attr("id").substr(3);
    //   console.log(idPasta + " -> evento click adicionado.");
      Obj.find("#ancjoin" + idPasta).on('click', function () {
        waitLoadPro(Obj, "#div" + idPasta, `a[target="${ifrVisualizacao_}"]`, func);
        // console.log(idPasta + " -> evento click adicionado2."); 
        $('#ifrArvore')[0].contentWindow.getLinksArvorePasta(idPasta);
        $(this).off("click");
      });
    });
  });
}
export function setClickUrlAmigavel() {
    $("#ifrArvore").contents().find('a[target="ifrVisualizacao"]').unbind().on('click',function(){
        updateUrlPage(false);
    });
}
export function arrayIDProcedimentos() {
    return localStorageRestorePro('arrayIDProcedimentos');
}
export function setArrayIDProcedimentos(newArray) {
    localStorageStorePro('arrayIDProcedimentos', newArray);
    if(typeof newArray !== 'undefined' && newArray.length > 0) { console.log('setArrayIDProcedimentos', '->', window.name, '->', 'count->'+newArray.length, 'time->'+totalSecondsTestText) }
    parent.updateCountnewFiltro(newArray);
}
export function callInitCheckDadosProcedimentosFrame(frame, attemptsLeft = 20) {
    if (!frame || !frame.contentWindow) {
        return;
    }

    var frameWindow = frame.contentWindow;
    if (typeof frameWindow.initCheckDadosProcedimentos === 'function') {
        frameWindow.statusPesquisaDadosProcedimentos = true;
        frameWindow.initCheckDadosProcedimentos();
        return;
    }

    if (attemptsLeft <= 0) {
        return;
    }

    setTimeout(function(){
        callInitCheckDadosProcedimentosFrame(frame, attemptsLeft - 1);
    }, 200);
}
export function updateCountnewFiltro(newArray) {
    var max = parseInt($('#selectProgressoBar_GroupTable').attr('aria-valuemax'));
        max = (typeof max !== 'undefined') ? max : 0;
    var index = (typeof newArray !== 'undefined' && newArray.length > 0 && max > 0) ? max-newArray.length : 0;
    var i = (index >  0 && max > 0) ? index+'/'+max : '';
    $('#newFiltroCounter').html(i);
}
export function getDadosProcedimentosControlar() {
    var newArrayIDProcedimentos = []
    var storeRecebimento = ( typeof localStorageRestorePro('configDataRecebimentoPro') !== 'undefined' && !$.isEmptyObject(localStorageRestorePro('configDataRecebimentoPro')) ) ? localStorageRestorePro('configDataRecebimentoPro') : [];
    $('#frmProcedimentoControlar').find('a.processoVisualizado').not('.processoNaoVisualizado, .processoNaoVisualizadoSigiloso, .processoVisualizadoSigiloso, .processoCredencialAssinaturaSigiloso').each(function(){
        var id_procedimento = String(getParamsUrlPro($(this).attr('href')).id_procedimento);
        var processo = $(this).text().trim();
        if (  jmespath.search(storeRecebimento, "[?id_procedimento=='"+id_procedimento+"'] | length(@)") == 0 
            && jmespath.search(newArrayIDProcedimentos, "[?processo=='"+processo+"'] | length(@)") == 0 ) {
            newArrayIDProcedimentos.push({processo: processo, id_procedimento: id_procedimento});
        }
    });
    setArrayIDProcedimentos(newArrayIDProcedimentos);
    initCheckDadosProcedimentos();
}
export function newTabDadosProcedimentosControlar() {  
    var href = window.location.href+'#&acao_pro=pesquisa_agrupamento';
    cancelDadosProcedimentosControlar();
    if (typeof infraTooltipOcultar === 'function') infraTooltipOcultar();
    setOptionsPro('newTabSearchProcedimentos', true);
    newTab = window.open(href,'Pesquisa de Processos','height=100,width=400,toolbar=0,menubar=0,location=0');
    if (window.focus) {newTab.focus()}
    observeNewTabDados();
    $('#frmCheckerProcessoPro').remove();
}
export function observeNewTabDados() {  
    var loopNewTab = setInterval(function() {   
        if((typeof newTab !== 'undefined' && newTab.closed) || !getOptionsPro('newTabSearchProcedimentos')) {  
            clearInterval(loopNewTab);  
            updateGroupTable($('#selectGroupTablePro'));
            setOptionsPro('newTabSearchProcedimentos', false);
            console.log('## close tab');
        } else {
            console.log('@ reload tab');
        }
    }, 1000);
}
export function initCheckDadosProcesso(TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    if (typeof jmespath !== 'undefined') { 
        getCheckDadosProcesso();
    } else {
        setTimeout(function(){ 
            initInfraImg(TimeOut - 100); 
            if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage'))console.log('Reload initInfraImg'); 
        }, 500);
    }
}
export function getCheckDadosProcesso() {   
    var acao_pro = getParamsUrlPro(window.location.href).acao_pro;
    if (getUrlAcaoPro('duplicar_documento')) {
        var arrayCurrentCloneDoc = getOptionsPro('currentCloneDoc');
        if (arrayCurrentCloneDoc) {
            console.log('duplicar_documento', arrayCurrentCloneDoc);
            $('#ifrArvore')[0].contentWindow.getDuplicateDoc(arrayCurrentCloneDoc.nameDoc, arrayCurrentCloneDoc.paramDoc);
            removeOptionsPro('currentCloneDoc');
            history.replaceState("", document.title, window.location.href.split('#')[0]); 
        }
    }
}
export function initCheckDadosProcedimentos() {   
    var acao_pro = getParamsUrlPro(window.location.href).acao_pro;

    if (typeof acao_pro === 'undefined' && arrayIDProcedimentos().length > 0) {
        if (!getOptionsPro('newTabSearchProcedimentos')) {
            if ( $('#frmCheckerProcessoPro').length == 0 ) { getCheckerProcessoPro(); }
            var href = window.location.href+'#&acao_pro=pesquisa_agrupamento';
            $('#frmCheckerProcessoPro').attr('src', href).unbind().on('load', function(){
                callInitCheckDadosProcedimentosFrame(this);
                $(this).unbind();
            });
        } else {
            observeNewTabDados();
        }
    } else if (getUrlAcaoPro('pesquisa_agrupamento')) {
        if (arrayIDProcedimentos().length) {
            if (!$('#newFiltroProgress').is(':visible')) { 
                parent.setProcessGroupTable();
                cleanPageProgress();
                loopIDProcedimentos();
                timerTest = setInterval(setTimeTest, 1000);
            }
        }
    }
}
export function cleanPageProgress() {
    $('#divInfraBarraSuperior').remove();
    $('#divInfraBarraSistema').hide();
    $('#divInfraBarraSistemaPadrao').hide();
    $('#divInfraAreaTelaE').remove();
    $('#divInfraBarraLocalizacao').remove();
    $(divComandos).remove();
    $('#divFiltro').remove();
    $('#divRecebidos').remove();
    $('#divGerados').remove();
    $('#panelHomePro').remove();
    $('#selectGroupTablePro').remove();
    $('#newFiltro').css({'text-align':'left','padding':'20px 0', 'float': 'left', 'width': 'auto'});
    $('#newFiltroProgress').css({'margin':'20px 0', 'left': 'calc(50% - 113px)'});
    $('#divInfraAreaTelaD').removeAttr('style').removeAttr('class');
    $('#divInfraAreaTela').removeAttr('style').removeAttr('class');
    $('#divInfraAreaGlobal').removeAttr('style').removeAttr('class');
    $('#newTabFiltroProgress').remove();
    $('#newFiltroReturnTab').show();
    $('#newFiltroCancel').attr('class', 'fas fa-sign-in-alt cinzaColor').attr("onmouseover", "return infraTooltipMostrar(\'Retornar janela de pesquisa\')");
    var clearNewTabSearchProcedimentos = function() {
        setOptionsPro('newTabSearchProcedimentos', false);
    };

    if (!window.__seiProSearchProgressExitHandlerInstalled__) {
        window.__seiProSearchProgressExitHandlerInstalled__ = true;
        window.addEventListener('pagehide', clearNewTabSearchProcedimentos, { once: true });
        window.addEventListener('visibilitychange', function() {
            if (document.visibilityState === 'hidden') {
                clearNewTabSearchProcedimentos();
            }
        });
    }
}
export function updateProcessGroupTable() {
    if ($('#selectProgressoBar_GroupTable .ui-progressbar-value').length) {
        var maxProgress = parseFloat($('#selectProgressoBar_GroupTable').attr('aria-valuemax'));
        var valueProgress = maxProgress-arrayIDProcedimentos().length;
        $('#selectProgressoBar_GroupTable').progressbar({ value: valueProgress });
        if (maxProgress < 10 ) { 
            parent.initTableTag($('#selectGroupTablePro', window.parent.document).val()); 
            //console.log('#### updateProcessGroupTable', maxProgress);
        }
    }
}
export function setProcessGroupTable() {
    var progressoBar =  '<div id="newFiltroProgress" style="display: inline-block;position: absolute;margin: 50px 0 0 0; z-index: 99; width: '+($('#selectGroupTablePro').width())+'px;right: 220px;">'+
                        '    <span id="newFiltroCounter" class="azulColor" style="float: left;margin: -4px 8px 0 0; color: #777"></span>'+
                        '    <i class="fas fa-sync-alt fa-spin azulColor" style="float: left;margin: -4px 8px 0 0;"></i>'+
                        '    <i id="newFiltroCancel" onclick="breakDadosProcedimentosControlar()" class="fas fa-times-circle cinzaColor" style="float: right;margin: -4px;padding-left: 10px;cursor: pointer;" onmouseout="return infraTooltipOcultar();" onmouseover="return infraTooltipMostrar(\'Cancelar pesquisa\')"></i>'+
                        '    <i onclick="newTabDadosProcedimentosControlar()" id="newTabFiltroProgress" class="fas fa-external-link-alt cinzaColor" style="float: right; margin: -4px; padding: 0 15px 0 20px; cursor: pointer;" onmouseout="return infraTooltipOcultar();" onmouseover="return infraTooltipMostrar(\'Pesquisar em nova aba\')"></i>'+
                        '    <div onmouseout="return infraTooltipOcultar();" onmouseover="return infraTooltipMostrar(\'Encontrando datas dos processos da unidade...\')" class="selectProgressoBar" id="selectProgressoBar_GroupTable"></div>'+
                        '</div>';
    if ($('#newFiltroProgress').length == 0) { 
        $('#selectGroupTablePro').before(progressoBar);
    } else {
        $('#newFiltroProgress').show();
    }
    setTimeout(function(){ 
        $('#selectProgressoBar_GroupTable').progressbar({value: 0, max: arrayIDProcedimentos().length });
    }, 800);
}
export function cleanTimeTest() {
    clearInterval(timerTest);
    // console.log('###FIM cleanTimeTest', totalSecondsTestText);
    totalSecondsTest = 0;
    totalSecondsTestText = '';
}
export function cancelDadosProcedimentosControlar() {
    statusPesquisaDadosProcedimentos = false;
    if(arrayIDProcedimentos() !== null && arrayIDProcedimentos().length > 0) {
        endProcessGroupTable();
    }
    cleanTimeTest();
}
// [migrado para sei/urls.js] getUrlAcaoPro
export function endProcessGroupTable() {
    $('#newFiltroProgress').hide();
    setTimeout(function(){ 
        parent.updateGroupTable($('#selectGroupTablePro', window.parent.document));
        if (getUrlAcaoPro('pesquisa_agrupamento')) { window.close(); }
    }, 800);
}
export function breakDadosProcedimentosControlar() {
    cancelDadosProcedimentosControlar();
    if (typeof infraTooltipOcultar === 'function') infraTooltipOcultar();
    var valueSelect = $('#selectGroupTablePro').val();
    if (valueSelect == 'arrivaldate' || valueSelect == 'acessdate' || valueSelect == 'senddate' || valueSelect == 'senddepart' || valueSelect == 'createdate') { 
        localStorageStorePro('selectGroupTablePro', '');
    }
    localStorageRemovePro('arrayIDProcedimentos');
    $('#frmCheckerProcessoPro').attr('src', 'about:blank').unbind();
}
export function loopIDProcedimentos() {
    if (statusPesquisaDadosProcedimentos) {
        if (arrayIDProcedimentos() !== null && arrayIDProcedimentos().length > 0) {
                getArrayDadosHistorico(0);
                parent.updateProcessGroupTable();
        } else {
            parent.endProcessGroupTable();
            cleanTimeTest();
        }
    }
}
export function getArrayDadosHistorico(index) {
        var i = arrayIDProcedimentos()[index];
        if (typeof i !== 'undefined') { 
            var newArrayIDProcedimentos = $.grep(arrayIDProcedimentos(), function(value) {
                  return value.id_procedimento != i.id_procedimento;
                });
            setArrayIDProcedimentos(newArrayIDProcedimentos);
            getDadosHistoricoPro(i);
        }
}
export function getDadosHistoricoPro(listProc, fullHistory = false, callback = false) {
    //setTimeout(function(){ loopIDProcedimentos() }, 500);
    if (!checkProcessoSigiloso()) {
        var href = 'controlador.php?acao=procedimento_trabalhar&id_procedimento='+String(listProc.id_procedimento);
        $.ajax({ url: href }).done(function (html) {
            let $html = $(html);
            var urlArvore = $html.find("#ifrArvore").attr('src');
            //loopIDProcedimentos();
            $.ajax({ url: urlArvore }).done(function (htmlArvore) {
                var acompanhamentoEsp = getLinksAcompanhamento(htmlArvore);
                var urlHistorico = $.map(htmlArvore.split('\n'), function(substr, i) {
                        return (substr.indexOf('?acao=procedimento_consultar_historico') !== -1) ? substr : null;
                    }).join('');
                    urlHistorico = urlHistorico.split("'")[3];
                    getDadosHistoricoUrlPro(urlHistorico, listProc, fullHistory, callback, acompanhamentoEsp);
            });
        });
    }
}
export function getLinksArvoreAjax(htmlArvore) {
    var links = [];
    if (htmlArvore.indexOf('Nos[0].acoes = ') !== -1) {
        $.each(htmlArvore.split('\n'), function(ind, val){
            if (val.indexOf('Nos[0].acoes = ') !== -1) {
                var barraControle = val.trim().replace("Nos[0].acoes = '",'').slice(0,-2);
                $('<div>'+barraControle+'</div>').find(parent.isNewSEI ? 'a[href*="controlador.php?acao="]' : 'a.botaoSEI').each(function(){ 
                    if (typeof $(this).attr('href') !== 'undefined' && $(this).attr('href') != '#') { 
                        links.push({name: $(this).find('img').attr('title'), url: $(this).attr('href')}); 
                    }
                });
            }
        });
    }
    return links;
}
export function getLinksAcompanhamento(htmlArvore) {
    var _return = '';
    if (htmlArvore.indexOf('NosAcoes[0] = new infraArvoreAcao("ACOMPANHAMENTO"') !== -1) {
        $.each(htmlArvore.split('\n'), function(ind, val){
            if (val.indexOf('NosAcoes[0] = new infraArvoreAcao("ACOMPANHAMENTO"') !== -1) {
                var param = val.trim().replace("NosAcoes[0] = new infraArvoreAcao(",'').slice(0,-2);
                    param = param.split('"');
                _return = param[11].split('\\n')[1];
            }
        });
    }
    return _return;
}
export function getDadosHistoricoUrlPro(urlHistorico, listProc, fullHistory = false, callback = false, acompanhamentoEsp = '') {
    $.ajax({ url: urlHistorico }).done(function (htmlHistorico) {
        if($(htmlHistorico).find('.infraAreaPaginacao').html().trim() != '') {
            var pg = ($(htmlHistorico).find('#selInfraPaginacaoSuperior').length > 0) ? $(htmlHistorico).find('#selInfraPaginacaoSuperior option').length-1 : 1;
            if (fullHistory) {
                getDadosHistoricoPaginacao($(htmlHistorico), listProc, 0, pg, fullHistory, callback, acompanhamentoEsp);
            } else {
                andamentoPaginacaoTemp = getArrayHistorico($(htmlHistorico));
                getDadosHistoricoPaginacao($(htmlHistorico), listProc, 1, pg, fullHistory, callback, acompanhamentoEsp);
            }
        } else {
            if (fullHistory) {
                getDadosHistoricoPaginacao($(htmlHistorico), listProc, 0, 1, fullHistory, callback, acompanhamentoEsp);
            } else {
                var andamento = getArrayHistorico($(htmlHistorico));
                var listAndamento = {historico_completo: false, processo: listProc.processo, id_procedimento: listProc.id_procedimento, andamento: andamento};
                if (!callback) {
                    loopIDProcedimentos();
                    getDataRecebimentoPro(listAndamento, listProc, acompanhamentoEsp);
                } else if (typeof callback === 'function') {
                    callback(listAndamento);
                }
            }
            //console.log('getDadosHistoricoPro',listAndamento);
        }
    });
}
export function getArrayHistorico(htmlHistorico) {
    var andamento = [];
    htmlHistorico.find("#tblHistorico").find('tr').each(function(){
        var datahora = $(this).find('td').eq(0).text().trim();
            datahora = moment(datahora,'DD/MM/YYYY HH:mm').format('YYYY-MM-DD HH:mm:ss');
        var unidade = $(this).find('td').eq(1).text();
        var usuario = $(this).find('td').eq(2).text();
        var descricao = $(this).find('td').eq(3).text();
        var url_doc = $(this).find('td').eq(3).find('a.ancoraHistoricoProcesso');
        var nr_sei = (typeof url_doc !== 'undefined') ? url_doc.text() : false;
            nr_sei = (nr_sei != '') ? nr_sei : false;
        var id_documento = (typeof url_doc !== 'undefined') ? getParamsUrlPro(url_doc.attr('href')).id_documento : false;
            id_documento = (typeof id_documento !== 'undefined') ? id_documento : false;
        var descricao_alt = $(this).find('td').eq(3).find('a').attr('alt');
        if ( unidade != '' ) { andamento.push({datahora: datahora, unidade: unidade, usuario: usuario, descricao: descricao, descricao_alt: descricao_alt, nr_sei: nr_sei, id_documento: id_documento}) }
    });
    return andamento;
}
export function getDadosHistoricoPaginacao(html, listProc, index, max, fullHistory = false, callback = false, acompanhamentoEsp = '') {
    if (index > max) {
        var listAndamento = {historico_completo: false, processo: listProc.processo, id_procedimento: listProc.id_procedimento, andamento: andamentoPaginacaoTemp};
        if (!callback) {
            loopIDProcedimentos();
            getDataRecebimentoPro(listAndamento, false, acompanhamentoEsp);
        } else if (typeof callback === 'function') {
            callback(listAndamento);
        }
        //console.log('getDadosHistoricoPaginacao',listAndamento);
    } else {
        var form = html.find('#frmProcedimentoHistorico');
        var href = form.attr('action');
        var param = {};
            form.find("input[type=hidden]").map(function () {
                if ( $(this).attr('name') && $(this).attr('id').indexOf('hdn') !== -1) {
                    param[$(this).attr('name')] = $(this).val(); 
                }
            });
            param['hdnInfraPaginaAtual'] = index;
            param['hdnTipoHistorico'] = (fullHistory) ? 'P' : 'R';

        $.ajax({
            method: 'POST',
            data: param,
            url: href
        }).done(function (htmlHistorico) {
            var andamento = getArrayHistorico($(htmlHistorico));
                $.merge(andamentoPaginacaoTemp, andamento);
                getDadosHistoricoPaginacao($(htmlHistorico), listProc, index+1, max, fullHistory, callback, acompanhamentoEsp);
        });
    }
}
export function initTablePaginacaoHistorico() {
    if (typeof verifyConfigValue !== 'undefined' && verifyConfigValue('removepaginacao')) {
        getTablePaginacao($($ifrVisualizacao).contents(), '#frmProcedimentoHistorico', '#tblHistorico', 1);
    }
}
export function getTablePaginacao(ifrView, formID, tableID, index) {
    if (ifrView.find('.infraAreaPaginacao a').length > 0 && typeof window.tablepaginacao_cancel == 'undefined') {
        var form = ifrView.find(formID);
        var href = form.attr('action');
        var param = {};
            form.find("input[type=hidden]").map(function () { 
                if ( $(this).attr('name') && $(this).attr('id').indexOf('hdn') !== -1) { 
                    param[$(this).attr('name')] = $(this).val(); 
                }
            });
            param['hdnInfraPaginaAtual'] = index;
            console.log(index);

        $.ajax({ 
            method: 'POST',
            data: param,
            url: href
        }).done(function (html) {
            let $html = $(html);
            var tr = $html.find(tableID+' tbody').find('tr').not('.infraTrOrdenacao');
                if(tr.length > 0) {
                    tr.each(function(index){
                        if ($(this).find('th').length == 0 && !$(this).find('td').hasClass('infraTdSetaOrdenacao')) {
                            if ($(this).find('input.infraCheckbox').length > 0) {
                                $(this).find('input.infraCheckbox').attr('disabled', true).closest('td').attr('onmouseout','return infraTooltipOcultar()').attr('onmouseover','return infraTooltipMostrar(\'Desative a op\u00E7\u00E3o "Remover pagina\u00E7\u00E3o de processos" nas configura\u00E7\u00F0es do '+NAMESPACE_SPRO+' para utilizar esta sele\u00E7\u00E3o\')');
                            }
                            ifrView.find(tableID+' tbody').append($(this)[0].outerHTML);
                        }
                    });
                    getTablePaginacao(ifrView, formID, tableID, index+1);
                    var caption = ifrView.find(tableID).find('caption.infraCaption');
                    var nrRegistros = caption.text();
                        nrRegistros = (nrRegistros.indexOf('-') !== -1) ? nrRegistros.split('-')[0].trim()+'):' : nrRegistros;
                        caption.html('<span>'+nrRegistros+'</span>');
                } else {
                    param['hdnInfraPaginaAtual'] = 0;
                    $.ajax({  method: 'POST', data: param, url: href });
                    ifrView.find('.infraAreaPaginacao').css('visibility','hidden');
                    ifrView.find('.loadRemovePag').remove();
                    ifrView.find(tableID).trigger('update');
                }
        });
        if (ifrView.find('.loadRemovePag').length == 0) {
            ifrView.find('.infraAreaPaginacao').prepend('<label class="loadRemovePag" style="float: right;margin-right: 30px;"><i class="fas fa-sync fa-spin"></i> Removendo pagina\u00E7\u00E3o... <a href="javascript:void(0);" style="font-size: 1em;" onclick="parent.cancelTablePaginacao(this)"><i class="fas fa-times" style="text-decoration: underline;"></i> Cancelar</a></label>');
        }
    }
}
export function initBlocoProcessoHistorico() {
    var listHistoryProc = pullDadosProcessoSession();
        listHistoryProc = listHistoryProc && typeof listHistoryProc.listAndamento !== 'undefined' ? listHistoryProc.listAndamento : dadosProcessoPro.listAndamento;

        if (typeof listHistoryProc !== 'undefined' && typeof listHistoryProc.historico_completo !== 'undefined' && listHistoryProc.historico_completo) {
            return getBlocoProcessoHistorico();
        } else if (!delayCrash) {
            delayCrash = true;
            setTimeout(function(){ delayCrash = false }, 6000);
            mergeAllAndamentosProcesso(function() {
                getBlocoProcessoHistorico();
            });
            return false;
        }
}
export function getBlocoProcessoHistorico() {
    var listHistoryProc = pullDadosProcessoSession();
        listHistoryProc = listHistoryProc && typeof listHistoryProc.listAndamento !== 'undefined'  ? listHistoryProc.listAndamento : dadosProcessoPro.listAndamento;
    var retiradoBlocoProcesso = (typeof listHistoryProc !== 'undefined' && typeof listHistoryProc.andamento !== 'undefined' && listHistoryProc.andamento.length) ? jmespath.search(listHistoryProc.andamento, "[?unidade=='"+siglaUnidadeAtual+"'] | [?contains(descricao, 'Processo retirado do bloco')]") : null;
        retiradoBlocoProcesso = retiradoBlocoProcesso !== null && retiradoBlocoProcesso.length ? retiradoBlocoProcesso : false;
    var blocoProcesso = (typeof listHistoryProc !== 'undefined' && typeof listHistoryProc.andamento !== 'undefined' && listHistoryProc.andamento.length) ? jmespath.search(listHistoryProc.andamento, "[?unidade=='"+siglaUnidadeAtual+"'] | [?contains(descricao, 'Processo inserido no bloco')]") : null;
        blocoProcesso = blocoProcesso === null ? false : blocoProcesso;
        blocoProcesso = !retiradoBlocoProcesso
                    ? blocoProcesso 
                    : blocoProcesso && blocoProcesso.length > 0 && moment(blocoProcesso[0].datahora,'YYYY-MM-DD HH:mm') >= moment(retiradoBlocoProcesso[0].datahora,'YYYY-MM-DD HH:mm') ? blocoProcesso : false;

        // console.log('getBlocoProcessoHistorico',blocoProcesso, retiradoBlocoProcesso);

    if (typeof blocoProcesso !== 'undefined' && blocoProcesso !== null && blocoProcesso.length > 0) {
        setTimeout(function(){
            var ifrVisualizacao = $($ifrVisualizacao).contents();
                ifrVisualizacao.find('a[onclick*="incluirEmBloco"]').addClass('verdeColor').attr('onmouseover', 'return infraTooltipMostrar(\''+blocoProcesso[0].descricao+'\')');
                // (leitura de .panelDadosArvorePro[bloco_interno] removida na Etapa E — painel
                //  legado nunca criado; a feature nova em src/features/arvore-info não tem essa seção.)
        }, 1500);
    }
    return blocoProcesso;
}
export function initGanttHistoryProc() {
    alertaBoxPro('Sucess', 'sync fa-spin', 'Aguarde... Pesquisando hist\u00F3rico do processo');
    var listHistoryProc = pullDadosProcessoSession();
        listHistoryProc = listHistoryProc ? listHistoryProc.listAndamento : dadosProcessoPro.listAndamento;

    if (typeof listHistoryProc !== 'undefined' && typeof listHistoryProc.historico_completo !== 'undefined' && listHistoryProc.historico_completo) {
        getGanttHistoryProc(listHistoryProc);
    } else {
        mergeAllAndamentosProcesso(getGanttHistoryProc);
    }
}
export function getGanttHistoryProc(listHistoryProc = false) {
    if (!listHistoryProc) {
        // console.log('->seetSessionProcessosPro', dadosProcessoPro.listAndamento);
        setSessionProcessosPro(dadosProcessoPro);
    }
    var proc = listHistoryProc ? listHistoryProc.andamento : dadosProcessoPro.listAndamento.andamento;
    var recebido = jmespath.search(proc, "[?contains(descricao, 'Processo recebido na unidade')]");

    var init_recebido = jmespath.search(proc, "[?contains(descricao, 'Processo p\u00FAblico gerado')||contains(descricao, 'Processo restrito gerado')] | [0]");
        init_recebido = (typeof init_recebido !== 'undefined' && init_recebido !== null) ? init_recebido : false;

    var init_remetido = jmespath.search(proc, "[?descricao=='Processo remetido pela unidade "+init_recebido.unidade+"'] | [?datahora >= `"+init_recebido.datahora+"`]  | [-1]");
        init_remetido = (typeof init_remetido !== 'undefined' && init_remetido !== null) ? init_remetido : false;

    var init_documentos_gerados = (init_recebido && init_remetido) 
                                ? jmespath.search(proc, "[?contains(descricao, 'Gerado documento')] | [?unidade=='"+init_recebido.unidade+"'] | [?datahora >= `"+init_recebido.datahora+"`] | [?datahora <= `"+init_remetido.datahora+"`]") 
                                : [];
    var init_customClass = (init_remetido && init_remetido.descricao.indexOf('Processo aberto na unidade') !== -1 ) ? 'bar-complete' : 'bar-ongoing'; 
    var taskProcesso = [];
    var htmlBox =   '<div style="width: 100%;display: flex;margin-bottom: 10px;">'+
                    '   <div class="btn-group" role="group" style="float: right;margin-right: 10px;">'+
                    '         <button type="button" data-value="Day" class="btn btn-sm btn-light">Dia</button>'+
                    '         <button type="button" data-value="Week" class="btn btn-sm btn-light">Semana</button>'+
                    '         <button type="button" data-value="Month" class="btn btn-sm btn-light active">M\u00EAs</button>'+
                    '   </div>'+
                    '</div>'+
                    '<div id="ganttHistoryPainel" class="seipro-atividades-gantt-history" style="width: 100%;height: 100%"></div>';

    var init_start = init_recebido.datahora;
    var init_end = init_remetido ? init_remetido.datahora : moment().format('YYYY-MM-DD HH:mm:ss');
    var init_diff = moment(init_end,'YYYY-MM-DD HH:mm:ss').diff(moment(init_start,'YYYY-MM-DD HH:mm:ss'));
    var init_duration = moment.duration(init_diff, "milliseconds");

    var taskInit = {
            id: randomString(4),
            index: 0,
            name: init_recebido.descricao+ ' / '+(init_remetido ? init_remetido.descricao : ''),
            start: init_recebido.datahora,
            end: init_remetido ? init_remetido.datahora : moment().format('YYYY-MM-DD HH:mm:ss'),
            documentos_gerados: init_documentos_gerados,
            recebido: init_recebido.usuario+': '+init_recebido.descricao+' '+init_recebido.unidade,
            remetido: init_remetido ? init_remetido.usuario+': '+init_remetido.descricao+' > '+init_remetido.unidade : init_remetido.descricao,
            progress: init_remetido && init_remetido.descricao.indexOf('Processo aberto na unidade') !== -1 ? 50 : 100,
            unidade: init_recebido.unidade,
            duration: init_duration,
            custom_class: init_customClass
        };
        taskProcesso.push(taskInit);

        $.each(recebido, function(index, value){
            var recebido_i = value;
            var remetido_i = jmespath.search(proc, "[?descricao=='Processo remetido pela unidade "+recebido_i.unidade+"'] | [?datahora >= `"+recebido_i.datahora+"`] | [-1]");
                remetido_i = (remetido_i === null) ? jmespath.search(proc, "[?descricao=='Conclus\u00E3o do processo na unidade'] | [?unidade=='"+recebido_i.unidade+"'] | [?datahora > `"+recebido_i.datahora+"`] | [-1]") : remetido_i;
                remetido_i = (remetido_i === null) ? {datahora: moment().format('YYYY-MM-DD HH:mm:ss'), unidade: recebido_i.unidade, descricao: 'Processo aberto na unidade '+recebido_i.unidade, descricao_alt: ''} : remetido_i;
            var documentos_gerados = jmespath.search(proc, "[?contains(descricao, 'Gerado documento')] | [?unidade=='"+recebido_i.unidade+"'] | [?datahora >= `"+recebido_i.datahora+"`] | [?datahora <= `"+remetido_i.datahora+"`]")
            var customClass = ( remetido_i.descricao.indexOf('Processo aberto na unidade') !== -1 ) ? 'bar-complete' : 'bar-ongoing'; 


            var _start = recebido_i.datahora;
            var _end = remetido_i ? remetido_i.datahora : moment().format('YYYY-MM-DD HH:mm:ss');
            var _diff = moment(_end,'YYYY-MM-DD HH:mm:ss').diff(moment(_start,'YYYY-MM-DD HH:mm:ss'));
            var _duration = moment.duration(_diff, "milliseconds");

            var taskProc = {
                id: randomString(4),
                index: index+1,
                name: recebido_i.descricao+' '+recebido_i.unidade+' / '+remetido_i.descricao,
                start: _start,
                end: _end,
                documentos_gerados: documentos_gerados,
                recebido: recebido_i.usuario+': '+recebido_i.descricao+' '+recebido_i.unidade,
                remetido: (typeof remetido_i.usuario !== 'undefined') ? remetido_i.usuario+': '+remetido_i.descricao+' > '+remetido_i.unidade : remetido_i.descricao,
                progress: remetido_i.descricao.indexOf('Processo aberto na unidade') !== -1 ? 50 : 100,
                unidade: recebido_i.unidade,
                duration: _duration,
                custom_class: customClass
            };
            taskProcesso.push(taskProc);
        });

        console.log(taskProcesso);
        taskProcesso = taskProcesso.length ? jmespath.search(taskProcesso, "sort_by([*],&start)") : [];

        resetDialogBoxPro('alertBoxPro');
        resetDialogBoxPro('dialogBoxPro');
        dialogBoxPro = $('#dialogBoxPro')
            .html('<div class="dialogBoxDiv" style="overflow: scroll;height: calc(100% - 30px);"> '+htmlBox+'</div>')
            .dialog({
                title: "Hist\u00F3rico visual do processo",
                width: $('body').width()-100,
                height: $('body').height()-100,
                open: function(){
                    var gantt = new Gantt("#ganttHistoryPainel", taskProcesso,{
                        header_height: 50,
                        column_width: 10,
                        step: 24,
                        language: 'ptBr',
                        view_modes: ['Day', 'Week', 'Month'],
                        bar_height: 15,
                        bar_corner_radius: 3,
                        arrow_curve: 5,
                        padding: 18,
                        edit_task: false,
                        view_mode: 'Month',   
                        date_format: 'YYYY-MM-DD HH:mm:ss',
                        custom_popup_html: function(task) {
                            var diff_ = moment(task.end,'YYYY-MM-DD HH:mm:ss').diff(moment(task.start,'YYYY-MM-DD HH:mm:ss'));
                            // var duration_ = moment.duration(diff_, "milliseconds");
                            var duration_ = task.duration;
                            
                            var subtract = moment().subtract(duration_, "milliseconds");
                            var htmlDuration = getDatesPreview({date: subtract.format('YYYY-MM-DD HH:mm:ss')});
                                htmlDuration = (htmlDuration && htmlDuration.indexOf('atr\u00E1s') !== -1) ? htmlDuration.replace('atr\u00E1s','') : '';
                                htmlDuration = moment(task.end,'YYYY-MM-DD HH:mm:ss').diff(moment(task.start,'YYYY-MM-DD HH:mm:ss'), 'days') >= 1 ? htmlDuration : '<span class="dateboxDisplay tagTableText_date_vencido "><i class="fas fa-history" style="color: #777; padding-right: 3px; font-size: 12pt;"></i> '+(typeof duration_ !== 'undefined' ? moment.duration(duration_, "minutes").format("H[h]:m[m]") : '')+' </span>';
                            var htmlDocs = $.map(task.documentos_gerados, function(v){ 
                                                var nrSEI = v.descricao.indexOf('(') !== -1 ? v.descricao.split('(')[0] : false;
                                                    nrSEI = nrSEI ? onlyNumber(nrSEI) : nrSEI;
                                                var htmlQuickView = nrSEI ? '<a class="quickview" style="font-size: 12px; cursor:pointer;" onmouseover="return infraTooltipMostrar(\'Visualiza\u00E7\u00E3o r\u00E1pida\');" onmouseout="return infraTooltipOcultar();" onclick="openSEINrPro(this, \''+nrSEI+'\')"><i style="margin: 0 3px;" class="fas fa-eye azulColor"></i></a>' : '';
                                                return '<p>'+v.usuario+': '+htmlQuickView+v.descricao+' em '+moment(v.datahora, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY [\u00E0s] HH:mm')+'</p>' 
                                            });
                                htmlDocs = htmlDocs && htmlDocs.length ? htmlDocs.join('') : 'Nenhum documento gerado';


                            var html =  '<div class="details-container seiProForm">'+
                                        '   <table class="tableInfo">'+
                                        '      <tr><td colspan="3"><h5><i class="iconPopup fas fa-hand-holding cinzaColor"></i> <span class="boxInfo" style="font-size: 11pt; font-weight: bold;">'+task.recebido+'</span><a style="float: right; margin: -4px -4px 0 0; padding: 5px; cursor:pointer;" onclick="ganttHistory.hide_popup()"><i class="far fa-times-circle cinzaColor"></i></a></h5></td></tr>'+
                                        '      <tr><td colspan="3"><h5><i class="iconPopup fas fa-share cinzaColor"></i> <span class="boxInfo" style="font-size: 11pt; font-weight: bold;">'+task.remetido+'</span></h5></td></tr>'+
                                        '      <tr><td style="vertical-align: bottom;"><p><i class="iconPopup fas fa-clock cinzaColor"></i> In\u00EDcio:</td><td><span class="boxInfo">'+moment(task.start,'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY HH:mm')+'</span></p></td></tr>'+
                                        '      <tr><td style="vertical-align: bottom;"><p><i class="iconPopup far fa-clock cinzaColor"></i> Fim:</td><td><span class="boxInfo">'+moment(task.end,'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY HH:mm')+'</span></p></td></tr>'+
                                        '      <tr><td style="vertical-align: bottom;"><p><i class="iconPopup far fa-hourglass-half cinzaColor"></i> Dura\u00E7\u00E3o:</td><td><span class="boxInfo">'+htmlDuration+'</span></p></td></tr>'+
                                        '      <tr><td style="vertical-align: middle;width: 120px;"><p><i class="iconPopup far fa-file-alt cinzaColor"></i> Documentos Gerados:</td><td><span class="boxInfo">'+htmlDocs+'</span></p></td></tr>'+
                                        '   </table>'+
                                        '</div>';
                            return html;
                        }
                    });
                    ganttHistory = gantt;

                    /*
                        var duracao = jmespath.search(ganttHistory.tasks,"[?unidade=='GPF'] | [*].duration | [*]._milliseconds");
                        var total_duracao = duracao.reduce(function(a, b) { return a + b; }, 0);
                        var subtract = moment().subtract(total_duracao, "milliseconds");
                        var htmlDuration = subtract.format('DDD[ dias] H[h] m[m]');
                        console.log(total_duracao, htmlDuration);
                    */

                    $(".dialogBoxDiv .btn-group").on("click", "button", function() {
                        $btn = $(this);
                        var mode = $btn.data('value');
                        $btn.parent().find('button').removeClass('active'); 
                        $btn.addClass('active');
                        ganttHistory.change_view_mode(mode);
                    });
                },
                close: function() { 
                    $('#dialogBoxDiv').remove();
                    resetDialogBoxPro('dialogBoxPro');
                }
        });
}
export function closeAllPopups() {
    for (i = 0; i < ganttProject.length; i++) {
    	ganttProject[i].hide_popup();
    }
}
export function cancelTablePaginacao(this_) {
    var _this = $(this_);
    window.tablepaginacao_cancel = true;
    _this.closest('label').remove();
}
