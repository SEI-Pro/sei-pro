// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/**
 * Sei Functions Pro — visualizacao defaults + toolbar icons.
 * (ponte temporária: jQuery/DOM legado; fatia do antigo body.js)
 */
import {
    atividadesState,
    checkCapacidade
} from './atividades-bridge.js';

import {
    alertaBoxPro,
    chosenReparePosition,
    getActionsOnSendProcess,
    getAutomaticActions,
    getCheckerProcessoPro,
    getDadosProcessoSession,
    getScriptIframe,
    getTreeLinkUrlByName,
    initTablePaginacaoHistorico,
    setHtmlProtocoloAlterar,
    setInfraImg,
    waitLoadPro
} from './modules.js';

export function checkPageVisualizacao() {
    const ifrV = SeiPro.sei.adapter.isSEI5() 
    ? $($ifrVisualizacao).contents().find('#ifrVisualizacao').contents()
    : $($ifrVisualizacao).contents();

    waitLoadPro(ifrV, '#frmDocumentoCadastro', "label#lblPublico", setNewDocDefault);
    waitLoadPro(ifrV, '#frmProcedimentoCadastro', "#divInfraBarraComandosSuperior", setHtmlProtocoloAlterar);
    waitLoadPro(ifrV, '#frmAtividadeListar[action*="acao=procedimento_enviar"]', infraBarraComandos, getActionsOnSendProcess);
    waitLoadPro(ifrV, '#frmProcedimentoHistorico[action*="acao=procedimento_consultar_historico"]', ".infraAreaTabela", initTablePaginacaoHistorico);
    waitLoadPro(ifrV, 'form', "select", replaceSelectAllVisualizacao);
    waitLoadPro(ifrV, 'form', "#optRestrito", insertActionHipoteseLegal);
    waitLoadPro(ifrV, 'form', ".infraImg, .InfraImg", function() { setInfraImg($($ifrVisualizacao).contents()) });
}
export function addUrgentPro(this_) {
    var _this = $(this_);
    var text = _this.closest('.infraAreaDados').find('input[type="text"]').last();
    if (text.length && text.val().toLowerCase().indexOf('(urgente)') !== -1) {
        text.val(text.val().replace(/\(urgente\)/ig,'').trim() );
    } else if (text.length && typeof text.val() !== 'undefined') {
        text.val(text.val().trim()+' (URGENTE)');
    }
}
export function setNewDocDefault() {
    var ifrVisualizacao = SeiPro.sei.adapter.isSEI5() 
        ? $($ifrVisualizacao).contents().find('#ifrVisualizacao').contents()
        : $($ifrVisualizacao).contents();
        ifrVisualizacao.find('#txtProtocoloDocumentoTextoBase').removeAttr('maxlength'); // remove atributo de largura do campo de modelo de documento

    var form = ifrVisualizacao.find('#frmDocumentoCadastro');
    var now = moment().format('DD/MM/YYYY');
    if (form.length > 0 && ifrVisualizacao.find('#txtNumero').length ) {
        ifrVisualizacao.find('div.urgentePro').remove();
        ifrVisualizacao.find('#txtNumero').css('width','46%').attr('data-oldtext',ifrVisualizacao.find('#txtNumero').val()).after('<div class="urgentePro" style="right: 48%;top: 10px;" onclick="parent.addUrgentPro(this)" onmouseover="return infraTooltipMostrar(\'Adicionar/remover marca de Urg\u00EAncia\');" onmouseout="return infraTooltipOcultar();"></div>');
        formControlerAlterarDocumento(ifrVisualizacao);
    }
    if (form.length > 0 && typeof checkConfigValue !== 'undefined' && checkConfigValue('newdocdefault') ) {
        if (form.attr('action').indexOf('controlador.php?acao=documento_gerar&acao_origem=documento_gerar&arvore=1') !== -1) {
            if (checkConfigValue('newdocnivel')) { ifrVisualizacao.find('#optPublico').trigger('click') }
            if (getConfigValue('newdocname') && ifrVisualizacao.find('#txtNumero').is(':visible')) { ifrVisualizacao.find('#txtNumero').val(getConfigValue('newdocname')) }
            if (getConfigValue('newdocobs')) { ifrVisualizacao.find('#txaObservacoes').val(getConfigValue('newdocobs')) }
            if (getConfigValue('newdocespec')) { ifrVisualizacao.find('#txtDescricao').val(getConfigValue('newdocespec')) }
            if (checkConfigValue('newdocsigilo')) { 
                var valueNewDocSigilo = getConfigValue('newdocsigilo');
                    valueNewDocSigilo = (valueNewDocSigilo != '' && valueNewDocSigilo.indexOf('|') !== -1) ? valueNewDocSigilo.split('|') : false;
                    if (valueNewDocSigilo) {
                        ifrVisualizacao.find('input[name="rdoNivelAcesso"][value="'+valueNewDocSigilo[1]+'"]').trigger('click');
                        waitLoadPro(ifrVisualizacao, '#selHipoteseLegal', 'option[value="'+valueNewDocSigilo[0]+'"]', function(){
                            ifrVisualizacao.find('#selHipoteseLegal').val(valueNewDocSigilo[0]).trigger('chosen:updated');
                        });
                    }
            }
        } else if (form.attr('action').indexOf('controlador.php?acao=documento_receber&acao_origem=documento_receber&arvore=1') !== -1) {
            // ifrVisualizacao.find('#optNato').trigger('click'); 
            if (typeof checkConfigValue !== 'undefined' && checkConfigValue('newdocformat') && getConfigValue('newdocformat').indexOf('digitalizado') !== -1) { 
                ifrVisualizacao.find('#optDigitalizado').trigger('click');
                var tipoConferencia = parseInt(getConfigValue('newdocformat').split('_')[1]);
                ifrVisualizacao.find('#selTipoConferencia').val(tipoConferencia);
            } else { 
                ifrVisualizacao.find('#optNato').trigger('click');
            }
            if (typeof checkConfigValue !== 'undefined' && checkConfigValue('newdocnivel')) { ifrVisualizacao.find('#optPublico').trigger('click') }
            if (typeof checkConfigValue !== 'undefined' && checkConfigValue('newdoctoday')) { ifrVisualizacao.find('#txtDataElaboracao').val(now) }
            if (typeof getConfigValue !== 'undefined' && getConfigValue('newdocname') && ifrVisualizacao.find('#txtNumero').is(':visible')) { ifrVisualizacao.find('#txtNumero').val(getConfigValue('newdocname')) }
            if (typeof getConfigValue !== 'undefined' && getConfigValue('newdocobs')) { ifrVisualizacao.find('#txaObservacoes').val(getConfigValue('newdocobs')) }
            if (typeof getConfigValue !== 'undefined' && getConfigValue('newdocespec')) { ifrVisualizacao.find('#txtDescricao').val(getConfigValue('newdocespec')) }
            if (typeof checkConfigValue !== 'undefined' && checkConfigValue('newdocsigilo')) { 
                var valueNewDocSigilo = getConfigValue('newdocsigilo');
                    valueNewDocSigilo = (valueNewDocSigilo != '' && valueNewDocSigilo.indexOf('|') !== -1) ? valueNewDocSigilo.split('|') : false;
                    if (valueNewDocSigilo) {
                        ifrVisualizacao.find('input[name="rdoNivelAcesso"][value="'+valueNewDocSigilo[1]+'"]').trigger('click');
                        waitLoadPro(ifrVisualizacao, '#selHipoteseLegal', 'option[value="'+valueNewDocSigilo[0]+'"]', function(){
                            ifrVisualizacao.find('#selHipoteseLegal').val(valueNewDocSigilo[0]).trigger('chosen:updated');
                        });
                    }
            }
        }
    }
}
export function setNewProcDefault() {
    var form = $('#frmProcedimentoCadastro');
    var now = moment().format('DD/MM/YYYY');
    if (form.length > 0 && $('#txtNumero').length ) {
        $('div.urgentePro').remove();
        $('#txtDescricao').css('width','46%').attr('data-oldtext',$('#txtDescricao').val()).after('<div class="urgentePro" onclick="parent.addUrgentPro(this)" onmouseover="return infraTooltipMostrar(\'Adicionar/remover marca de Urg\u00EAncia\');" onmouseout="return infraTooltipOcultar();"></div>');
        formControlerAlterarDocumento(ifrVisualizacao);
    }
    if (form.length > 0 && typeof checkConfigValue !== 'undefined' && checkConfigValue('newdocdefault') ) {
        if (form.attr('action').indexOf('controlador.php?acao=procedimento_gerar&acao_origem=procedimento_gerar') !== -1) { 
            if (checkConfigValue('newdocnivel')) { $('#optPublico').trigger('click') }
            if (getConfigValue('newdocobs')) { $('#txaObservacoes').val(getConfigValue('newdocobs')) }
            if (getConfigValue('newdocespec')) { $('#txtDescricao').val(getConfigValue('newdocespec')) }
            if (checkConfigValue('newdocsigilo')) { 
                var valueNewDocSigilo = getConfigValue('newdocsigilo');
                    valueNewDocSigilo = (valueNewDocSigilo != '' && valueNewDocSigilo.indexOf('|') !== -1) ? valueNewDocSigilo.split('|') : false;
                    if (valueNewDocSigilo) {
                        $('input[name="rdoNivelAcesso"][value="'+valueNewDocSigilo[1]+'"]').trigger('click');
                        waitLoadPro(ifrVisualizacao, '#selHipoteseLegal', 'option[value="'+valueNewDocSigilo[0]+'"]', function(){
                            $('#selHipoteseLegal').val(valueNewDocSigilo[0]).trigger('chosen:updated');
                        });
                    }
            }
            if (checkConfigValue('newproc_selfunidade')) {
                var siglaUnidadePesquisa = siglaUnidadeAtual;
                $('head script').each(function(){
                    if (typeof $(this).attr('src') === 'undefined' && $(this).html().indexOf('acao_ajax') !== -1) { 
                        var text = $(this).html();
                        var link = $.map(text.split("'"), function(substr, i) {
                        return (i % 2 && substr.indexOf('controlador_ajax.php?acao_ajax=contato_auto_completar') !== -1) ? substr : null;
                        });
                        if (link.length) {
                            $.ajax({
                                type: "POST",
                                url: link[0],
                                dataType: 'text',
                                data: {
                                    palavras_pesquisa: siglaUnidadePesquisa
                                },
                                success: function(result){
                                    var html_result = $(result.replace('<?xml version="1.0" encoding="iso-8859-1"?>','')).html();
                                    var id_result = $(html_result).map(function(){ if ($(this).attr('descricao').indexOf('('+siglaUnidadePesquisa+')') !== -1) return {id: $(this).attr('id'), descricao: $(this).attr('descricao')} }).get();
                                    if (typeof id_result[0] !== 'undefined') {
                                        var hdnInteressadosProcedimento = id_result[0].id+'\u00B1'+id_result[0].descricao;
                                        $('#hdnInteressadosProcedimento').val(hdnInteressadosProcedimento);
                                        $('#selInteressadosProcedimento').append('<option value="'+id_result[0].id+'">'+id_result[0].descricao+'</option>');
                                    }
                                }
                            });
                        }
                    }
                });
            }
        }
    }
}
export function formControlerAlterarDocumento(ifrVisualizacao) {
    ifrVisualizacao.find('#frmDocumentoCadastro').attr('onsubmit', 'return OnSubmitForm();parent.confirmaDadosUrgencia(this);');
}
export function confirmaDadosUrgencia(_this) {
    if (delayCrash) return false;
        delayCrash = true;
        setTimeout(function(){ delayCrash = false }, 300);

        var _this = $(_this);
        var contentW = $($ifrVisualizacao)[0].contentWindow;
        var _parent = _this.closest('body');
        var oldText = _parent.find('#txtNumero').attr('data-oldtext');
        var newText = _parent.find('#txtNumero').val();
        var checkAddUrgencia = (typeof oldText !== 'undefined' && oldText.toLowerCase().indexOf('(urgente)') === -1 && typeof newText !== 'undefined' && newText.toLowerCase().indexOf('(urgente)') !== -1 ) ? true : false;
        var checkRemoveUrgencia = (typeof oldText !== 'undefined' && oldText.toLowerCase().indexOf('(urgente)') !== -1 && typeof newText !== 'undefined' && newText.toLowerCase().indexOf('(urgente)') === -1 ) ? true : false;
        var methodSend = checkAddUrgencia ? 'add' : false;
            methodSend = checkRemoveUrgencia ? 'remove' : methodSend;
        var checkSend = (checkAddUrgencia || checkRemoveUrgencia) ? true : false;
        var nrSEI = $('#ifrArvore').contents().find('.infraArvoreNoSelecionado').eq(0);
            nrSEI = (typeof nrSEI !== 'undefined' && nrSEI !== null) ? getNrSei(nrSEI.text().trim()) : '';

        if (typeof contentW !== 'undefined' && typeof contentW.OnSubmitForm === 'function' && contentW.OnSubmitForm()) { 
            // contentW.submeter();
            var sendAutomaticActions = [];
            sendAutomaticActions[0] = {name: 'urgencia_documento', method: methodSend, send: checkSend, value: nrSEI, run: false, index: 0};
            parent.window.sendAutomaticActions = sendAutomaticActions;
            getAutomaticActions();
            if (typeof dadosProcessoPro !== 'undefined' && typeof dadosProcessoPro.propProcesso === 'undefined' && typeof getDadosProcessoSession() !== 'undefined' && getDadosProcessoSession().propProcesso !== 'undefined' ) {
                dadosProcessoPro.propProcesso = getDadosProcessoSession().propProcesso;
            }
            /*
            var txtDescricaoProcesso = dadosProcessoPro.propProcesso.txtDescricao;
            if (typeof txtDescricaoProcesso !== 'undefined' && txtDescricaoProcesso.toLowerCase().indexOf('(urgente)') === -1) {
                updateDadosArvore('Consultar/Alterar Processo', 'txtDescricao', dadosProcessoPro.propProcesso.txtDescricao+' (URGENTE)', dadosProcessoPro.propProcesso.hdnIdProcedimento, function(){
                    $('#ifrArvore')[0].contentWindow.location.reload(true);
                });
            }
            */
        }

}
export function insertIconBatchActions() {
    waitLoadPro($($ifrVisualizacao).contents(), '#divArvoreAcoes', 'a[href*="controlador.php?acao="]', appendIconBatchActions);
}
export function appendIconBatchActions(loop = true) {
    var ifrVisualizacao = $($ifrVisualizacao).contents();
    var htmlIconbatchActions =  '<a href="#" id="iconBatchActions" onclick="parent.getDocumentosActions();" onmouseout="return infraTooltipOcultar();" onmouseover="return infraTooltipMostrar(\'Iniciar a\u00E7\u00F5es em lote\')"  tabindex="452" class="botaoSEI">'+
                                '<img class="infraCorBarraSistema" tabindex="452" src="'+URL_SPRO+'icons/menu/acao_lote.svg" alt="Iniciar a\u00E7\u00F5es em lote" title="Iniciar a\u00E7\u00F5es em lote">'+
                                '</a>';
    if (!ifrVisualizacao.find('#iconBatchActions').length) {
        ifrVisualizacao.find('#divArvoreAcoes').append(htmlIconbatchActions);
    }
    if (loop) {
        setTimeout(function () {
            appendIconBatchActions();
        },1500);
    }
}
export function insertIconAIActions() {
    waitLoadPro($($ifrVisualizacao).contents(), '#divArvoreAcoes', 'a[href*="controlador.php?acao="]', appendIconAIActions);
}
export function appendIconAIActions(loop = true) {
    var ifrVisualizacao = $($ifrVisualizacao).contents();
    var htmlIconAIActions =  '<a href="#" id="iconAIActions" onclick="parent.initBoxAIActions();" onmouseout="return infraTooltipOcultar();" onmouseover="return infraTooltipMostrar(\'Ferramentas de IA\')"  tabindex="452" class="botaoSEI">'+
                                '<img class="infraCorBarraSistema" tabindex="452" src="'+URL_SPRO+'icons/menu/botpro_icon.svg" alt="Ferramentas de IA" title="Ferramentas de IA">'+
                                '</a>';
    if (!ifrVisualizacao.find('#iconAIActions').length) {
        ifrVisualizacao.find('#divArvoreAcoes').append(htmlIconAIActions);
    }
    if (loop) {
        setTimeout(function () {
            appendIconAIActions();
        },1500);
    }
}
export function initBoxAIActions(TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    if (typeof loadSEIProAI !== 'undefined') { 
        loadBoxAIActions();
    } else {
        if (TimeOut == 9000) $.getScript(URL_SPRO+"js/sei-pro-ai.js");
        setTimeout(function(){ 
            initBoxAIActions(TimeOut - 100); 
            if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage'))console.log('Reload initBoxAIActions'); 
        }, 500);
    }
}
export function insertIconCompareDocs() {
    waitLoadPro($($ifrVisualizacao).contents(), '#divArvoreAcoes', 'a[href*="controlador.php?acao="]', appendIconCompareDocs);
}
export function appendIconCompareDocs(loop = true) {
    var ifrVisualizacao = $($ifrVisualizacao).contents();
    var htmlIconCompareDocs =  '<a href="#" id="iconCompareDocs" onclick="parent.initDialogCompareDocs();" onmouseout="return infraTooltipOcultar();" onmouseover="return infraTooltipMostrar(\'Iniciar Comparador de Documentos\')"  tabindex="452" class="botaoSEI">'+
                                '<img class="infraCorBarraSistema" tabindex="452" src="'+URL_SPRO+'icons/menu/compare_doc.svg" alt="Iniciar Comparador de Documentos" title="Iniciar Comparador de Documentos">'+
                                '</a>';
    if (ifrVisualizacao.find('#iconCompareDocs').length == 0) {
        ifrVisualizacao.find('#divArvoreAcoes').append(htmlIconCompareDocs);
    }
    if (loop) {
        setTimeout(function () {
            appendIconCompareDocs();
        },1500);
    }
}
export function insertIconBatchDocs() {
    waitLoadPro($($ifrVisualizacao).contents(), '#divArvoreAcoes', 'a[href*="controlador.php?acao="]', appendIconBatchDocs);
}
export function appendIconBatchDocs(loop = true) {
    var ifrVisualizacao = $($ifrVisualizacao).contents();
    var htmlIconBatchDocs =  '<a href="#" id="iconBatchDocs" onclick="parent.initDocLoteModalSelecaoDoc();" onmouseout="return infraTooltipOcultar();" onmouseover="return infraTooltipMostrar(\'Iniciar Documentos em Lote\')"  tabindex="452" class="botaoSEI">'+
                                '<img class="infraCorBarraSistema" tabindex="452" src="'+URL_SPRO+'icons/menu/doc_lote.svg" alt="Iniciar Documentos em Lote" title="Iniciar Documentos em Lote">'+
                                '</a>';
    if (ifrVisualizacao.find('#iconBatchDocs').length == 0) {
        ifrVisualizacao.find('#divArvoreAcoes').append(htmlIconBatchDocs);
    }
    if (loop) {
        setTimeout(function () {
            appendIconBatchDocs();
        },1500);
    }
}
export function initDocLoteModalSelecaoDoc(TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    if (typeof $().chosen !== 'undefined' && typeof URL_SPRO !== 'undefined') { 
        docLoteModalSelecaoDoc();
    } else {
        if (TimeOut == 9000) $.getScript(URL_SPRO+"js/lib/chosen.jquery.min.js");
        setTimeout(function(){ 
            initDocLoteModalSelecaoDoc(TimeOut - 100); 
            if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage'))console.log('Reload initDocLoteModalSelecaoDoc'); 
        }, 500);
    }
}
export function setProgressBarOnProcesso() {
    var ativState = atividadesState();
    if (ativState.arrayConfigAtividades && typeof ativState.arrayConfigAtividades.prescricoes !== 'undefined' && checkConfigValue('gerenciarprescricoes')) {
        var tableProcesso = $('#tblProcessosGerados, #tblProcessosRecebidos, #tblProcessosDetalhado');
        $.each(ativState.arrayConfigAtividades.prescricoes, function(i, v){
            var value_prescricao = typeof ativState.arrayConfigAtividades.tipos_prescricoes !== 'undefined' ? jmespath.search(ativState.arrayConfigAtividades.tipos_prescricoes, "[?id_tipo_prescricao==`"+v.id_tipo_prescricao+"`] | [0]") : null;
                value_prescricao = value_prescricao !== null ? value_prescricao : false;
            var config = value_prescricao ? value_prescricao.config : false;
            var nivel_critico = config && typeof config.nivel_critico !== 'undefined' ? config.nivel_critico : 75;
            var porcentagem = parseFloat(((v.tempo_decorrido/v.prazo)*100).toFixed(2));
            var classProgress = porcentagem >= nivel_critico ? 'urgente' : '';
                classProgress = v.suspensao ? 'suspenso' : classProgress;
            var id_progress = v.id_procedimento ? v.id_procedimento : v.key_prescricao;
            var elemProcesso = v.id_procedimento ? $('#P'+v.id_procedimento).find('a[href*="controlador.php?acao=procedimento_trabalhar"]') : tableProcesso.find("a[href*='controlador.php?acao=procedimento_trabalhar']:contains('"+v.processo_sei+"')");
            var txtTip =    'Prazo: '+v.prazo+' dias<br>'+
                            'Decorrido: '+v.tempo_decorrido+' dias ('+porcentagem+'%) <br>'+
                            'Documento: '+v.documento_relacionado+' ('+moment(v.data_inicio).format('DD/MM/YYYY HH:mm')+')'+
                            '\',\''+
                            (v.suspensao ? '(SUSPENSO) ' : '')+v.nome_prescricao;
            var progress =  '<div id="progressPrescricao_'+id_progress+'" style="margin: 5px 0 0 0;max-width: 300px;position:relative;" onmouseover="return infraTooltipMostrar(\''+txtTip+'\');" onmouseout="return infraTooltipOcultar();" class="progressPrescricao ui-progressbar ui-widget ui-widget-content ui-corner-all '+classProgress+'" role="progressbar" aria-valuemin="0" aria-valuemax="'+v.prazo+'" aria-percent="'+porcentagem+'" data-percent="'+porcentagem.toLocaleString('pt-BR')+'%" aria-valuenow="'+v.tempo_decorrido+'">'+
                            '   <div class="ui-progressbar-value ui-widget-header ui-corner-left" style="width: '+porcentagem+'%;"></div>'+
                            '</div>';
            $('#progressPrescricao_'+id_progress).remove();
            elemProcesso.after(progress);
        });
        tableProcesso.trigger('updateAll');
    }
}
export function appendIconCtrPrescricao(loop = true) {
    var ativState = atividadesState();
    if (
            checkCapacidade('view_prescricoes')
            && ativState.arrayConfigAtividades
            && typeof ativState.arrayConfigAtividades.tipos_prescricoes !== 'undefined'
            && $.map(ativState.arrayConfigAtividades.tipos_prescricoes, function(v){ if (checkListTipoPrescricaoInProcesso(v)) { return v }}).length
            && checkConfigValue('gerenciarprescricoes')
        ) {
        var ifrVisualizacao = $($ifrVisualizacao).contents();
        var iconLabel = localStorage.getItem('iconLabel');
        var iconBoxSlim = localStorage.getItem('seiSlim');
        var base64IconCtrPrescricao = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAABFJJREFUeJztmG9MG2UYwFeyaTZwcSwx2WzLBjNxGx/mvuAHiYl+WGCML/uDMZWVAHPqNJsxS8acY1sy/DMzQRNzxj8fNNEYPxmTJc4P6jelQLtCS0t71/ZKodcrEOjd296fPr7vXTsKQgbxrsbIk/zy3uV67/3yXNvned9NmzZiI/4D0dba99Khvec+r7e/QhnBQdtZqssx0GiYYHPjFcpe1QH2KqchWCtPwwvH3jtjmGBT41WKTGrTwA+pxLLauH7IHNbKdmg79q5xgq3P91K1O7uhrrpIJ9Tt6FoXtYRqMpJ7O6H9xAfGCc7xcoUkJzfTKamfTskQSKgwEsmvC3eB0ajyBp9UKgiGCRYjzClUmJPBP7l+wSL3oso5w8WMFVT/x4KJKf+nbMILEdYFweDPmLsQmFgb5LPkHob985IpcjmVrxATH1/N0j2Agp0guqyAXLvxuFZ2gTCIR/adblMEScjpO/sRcwVQ+CIII4dAcNnwQ9dGZtAKmeH6lMx/v800QZTntiD2w7sofBlE3wksuEd78IPkRCLoqoGM78ht0+SKIfLf7kbx/l9E+nIeYUlxsOaBmcwM1Sli4PgXIv/VTtMFSSD+xxox9v5PiHk7I461gDD0ZEHGvixzOLsjB+YFf/OXmYU79rLIFUPKTmzPcV8/i2I3f0fhN0EcbcKiTywKDu0T0L2G78TIxcNZObRdgbSlrIJ54C0oz2zJpr55DE0OdKPo9UkxeAZEz9MgeBsjC4GTbRL9+iN5NWUhlFWuNOK8spXm5CN0Ev3GTo3JsekIMHxuMMLnGhJz0kP/mhi/IFtiXG4Pw0mf4AozTypMkRAGS3Ohabk3GFceL7sck5KraE7qwzJsqVgpPtzxeGIquKMq62Wla/RktjzZjKZQJZa7iSXkleUUGE8oWmul119St9WsN5a7wKSkh00XZLhcP40lVsvcOM6ce8VGQYVRVnrLVLnErLqVTkppehU5AnmtK3cyCngiii+eVjebJsgklaMri0mYHCTYX2F84g9wMwoMR+S/ZZDgjalPmSfIKTdCqwjGp8ZgIfAazLibYCzkwTLLBXW8MdlhmmCIk6hSMfKqQykJ2KlxEOnrIPhPauVubrgBfGG/9lr1zJU2rLKZHbVMLc9cdDoG85EByIZ7cIfThusvqcdW4DwvgjccLkiWSRD/eil6SQZnIMPcBkSaWIzgP6W1VsV6nHa3gIeZXZJFjxmLptm0rNVShpNv4f9AIDBJAWbYHwAxlzA9+ohfMelgRJfeA5Ix7ruBJTOapFv/Dp6fS4OFYJhg63PXKG3BvqNbX4iTBXh1Bz4+jXHCvkd19PN2vDh3LKGu2gl78WK9trCAJ3M4jt8ybuHe/EwvZStsfVgL6OftYLt/jNnWUbjuvM/iNYJT2/YwfG/mKBbU9lYM2jyyGS14qqXPUW9/9bOD9rPUP8ZGeJnqcnxk3PZbRkhbCIZNuBEbsRh/AXsKOj5cMZb5AAAAAElFTkSuQmCC';    
        var htmlIconCtrPrescricao =  '<a href="#" id="iconCtrPrescicao" onclick="parent.getCtrPrescricao();" onmouseout="return infraTooltipOcultar();" onmouseover="return infraTooltipMostrar(\'Gerenciar Prescri\u00E7\u00F5es\')"  tabindex="452" class="botaoSEI '+(iconLabel ? 'iconLabel' : '')+' '+(iconBoxSlim ? 'iconBoxSlim' : '')+'">'+
                                    '<img class="infraCorBarraSistema" tabindex="452" src="'+base64IconCtrPrescricao+'" alt="Gerenciar Prescri\u00E7\u00F5es" title="Gerenciar Prescri\u00E7\u00F5es">'+
                                    '</a>';
        if (ifrVisualizacao.find('#iconCtrPrescicao').length == 0) {
            ifrVisualizacao.find('#divArvoreAcoes').append(htmlIconCtrPrescricao);
        }
        if (loop) {
            setTimeout(function () {
                appendIconCtrPrescricao();
            },1500);
        }
    }
}
export function checkTipoPrescricaoProcesso() {
    var ativState = atividadesState();
    if (ativState.arrayConfigAtividades && typeof ativState.arrayConfigAtividades.tipos_prescricoes !== 'undefined') {
        var arrayTipoPrescicaoProcesso = [];
        var id_tipo_procedimento = typeof dadosProcessoPro.propProcesso !== 'undefined' ?  dadosProcessoPro.propProcesso.hdnIdTipoProcedimento : false;
        if (id_tipo_procedimento) {
            $.each(ativState.arrayConfigAtividades.tipos_prescricoes,function(i, v){
                if (typeof v.config !== 'undefined' && typeof v.config.tipo_processo !== 'undefined') {
                    if (jmespath.search(v.config.tipo_processo,"[?value=='"+id_tipo_procedimento+"']") !== null) arrayTipoPrescicaoProcesso.push(v);
                } 
            });
            return arrayTipoPrescicaoProcesso;
        } else {
            return false;
        }
    } else {
        return false;
    }
}
export function insertIconDocCertidao() {
    waitLoadPro($($ifrVisualizacao).contents(), '#divArvoreAcoes', 'a[href*="controlador.php?acao="]', appendIconDocCertidao);
}
export function insertIconPublicacaoEletronica() {
    waitLoadPro($($ifrVisualizacao).contents(), '#divArvoreAcoes', 'a[href*="controlador.php?acao="], a[onclick*="acao=publicacao_agendar"]', appendIconPublicacaoEletronica);
}
export function appendIconPublicacaoEletronica(loop = true) {
    if (checkConfigValue('atalhopublicacoeseletronicas')) {
        var ifrVisualizacao = $($ifrVisualizacao).contents();
        var iconId = '#iconPublicacaoEletronica';
        var actionSelector = [
            `${infraBarraComandos} a[href*="acao=publicacao_agendar"]`,
            `${infraBarraComandos} a[onclick*="acao=publicacao_agendar"]`,
            'a[href*="acao=publicacao_agendar"]',
            'a[onclick*="acao=publicacao_agendar"]'
        ].join(', ');
        var sourceLink = ifrVisualizacao.find(actionSelector).not(iconId).first();

        if (sourceLink.length > 0 && ifrVisualizacao.find(iconId).length === 0) {
            var shortcut = sourceLink.clone(false);
            var image = shortcut.find('img').first();
            var title = image.attr('title') || shortcut.attr('title') || 'Publica\u00E7\u00F5es Eletr\u00F4nicas';

            shortcut
                .attr('id', 'iconPublicacaoEletronica')
                .addClass('botaoSEI')
                .removeClass('newLink')
                .removeAttr('style');

            if (image.length > 0) {
                image.attr('alt', title).attr('title', title);
            } else {
                shortcut.text('Publica\u00E7\u00F5es Eletr\u00F4nicas').attr('title', title);
            }

            ifrVisualizacao.find('#divArvoreAcoes').append(shortcut);
        }

        if (loop) {
            setTimeout(function () {
                appendIconPublicacaoEletronica(false);
            },1500);
        }
    }
}
export function appendIconDocCertidao(loop = true) {
    if (checkConfigValue('certidaosigilo')) {
        var _ifrVisualizacao = $($ifrVisualizacao);
        var ifrVisualizacao = _ifrVisualizacao.contents();
        var ifrArvore = $('#ifrArvore').contents();
        var id_documento = getParamsUrlPro(ifrArvore.find('.infraArvoreNoSelecionado').eq(0).closest('a').attr('href')).id_documento;
            id_documento = (typeof id_documento !== 'undefined') ? id_documento : getParamsUrlPro(_ifrVisualizacao.attr('src')).id_documento;
            id_documento = (typeof id_documento !== 'undefined') ? id_documento : false;
        var newDocLink = getTreeLinkUrlByName('Incluir Documento');
        var base64IconDocCertidao = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAxNpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ4IDc5LjE2NDAzNiwgMjAxOS8wOC8xMy0wMTowNjo1NyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RUQ3ODhDOEI5OUQyMTFFQzhDNkZBNEM3ODE5MUQ3RkQiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RUQ3ODhDOEE5OUQyMTFFQzhDNkZBNEM3ODE5MUQ3RkQiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIwMjAgTWFjaW50b3NoIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9IjVEODg1QzYyOTVGOENCN0Y5QzcxMzg0RUE0NzVCNTVEIiBzdFJlZjpkb2N1bWVudElEPSI1RDg4NUM2Mjk1RjhDQjdGOUM3MTM4NEVBNDc1QjU1RCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pr+rRM0AAAs8SURBVHjatFh7cFTVHf7OvXd37z6S7CaY94uH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';
        var htmlIconNewDoc =    '<a href="#" onclick="parent.getDocCertidao();" id="iconDocCertidao" class="botaoSEI">'+
                                '   <img class="infraCorBarraSistema" src="'+base64IconDocCertidao+'" alt="Gerar Certid\u00E3o de Documento Oficial com Sigilo" title="Gerar Certid\u00E3o de Documento Oficial com Sigilo">'+
                                '</a>';
        var nativo = (id_documento && ifrArvore.find('#anchorImg'+id_documento+' img[src*="'+nameDocInterno+'"]').length) ? true : false;
        var assinado = (id_documento && ifrArvore.find('#iconA'+id_documento).length) ? true : false;
        if (newDocLink !== null && newDocLink != '' && ifrVisualizacao.find('#iconDocCertidao').length == 0 && nativo && assinado) {
            ifrVisualizacao.find('#divArvoreAcoes').append(htmlIconNewDoc);
        }

        if (loop) {
            setTimeout(function () {
                appendIconDocCertidao(false);
            },1500);
        }
    }
}
export function insertTooltipOnButtons() {
    waitLoadPro($($ifrVisualizacao).contents(), '#divArvoreAcoes', 'a[href*="controlador.php?acao="]', appendTooltipOnButtons);
}
export function appendTooltipOnButtons() {
    var ifrVisualizacao = $($ifrVisualizacao).contents();
    ifrVisualizacao.find('#divArvoreAcoes a img[title]').each(function(){
        var _this = $(this);
        var title = _this.attr('title');
        var link = _this.closest('a');
        if (typeof title !== 'undefined' && typeof link !== 'undefined') {
            _this.removeAttr('title');
            link.attr('onmouseover','return infraTooltipMostrar(\''+title+'\')').attr('onmouseout', 'return infraTooltipOcultar()');
            
        }
    });
}
export function insertIconNewDoc() {
    if (!SeiPro.sei.adapter.isNewSEI()) waitLoadPro($($ifrVisualizacao).contents(), '#divArvoreAcoes', "a.botaoSEI", appendIconNewDoc);
}
export function appendIconNewDoc(loop = true) {
    var ifrVisualizacao = $($ifrVisualizacao).contents();
    var newDocLink = jmespath.search(linksArvore, "[?name=='Incluir Documento'] | [0].url");
    var htmlIconNewDoc =    '<a href="'+newDocLink+'" tabindex="451" class="botaoSEI">'+
                            '   <img class="infraCorBarraSistema" src="imagens/sei_incluir_documento.gif" alt="Incluir Documento" title="Incluir Documento">'+
                            '</a>';
    if (newDocLink !== null && newDocLink != '' && ifrVisualizacao.find('a.botaoSEI[href*="acao=documento_escolher_tipo"]').length == 0) {
        ifrVisualizacao.find('#divArvoreAcoes').prepend(htmlIconNewDoc);
    }
    if (loop) {
        setTimeout(function () {
            appendIconNewDoc();
        },1500);
    }
}
export function initMoveIconDeleteToEnd() {
    if (!SeiPro.sei.adapter.isNewSEI()) waitLoadPro($($ifrVisualizacao).contents(), '#divArvoreAcoes', "a.botaoSEI", moveIconDeleteToEnd);
}
export function moveIconDeleteToEnd(loop = true) {
    var ifrVisualizacao = $($ifrVisualizacao).contents();
    ifrVisualizacao.find('a[onclick*="excluirDocumento("]').appendTo(ifrVisualizacao.find('#divArvoreAcoes'));
    if (loop) {
        setTimeout(function () {
            moveIconDeleteToEnd(false);
        },1500);
    }
}
export function insertIconDynamicField() {
    // waitLoadPro($($ifrVisualizacao).contents(), '#divArvoreAcoes', 'a[onclick*="alterarFormulario"]', appendIconDynamicField);
    waitLoadPro($('#ifrArvore').contents(), '#divArvore', 'img[src*="formulario1.gif"]', appendIconDynamicField);
}
export function appendIconDynamicField(loop = true) {
    var ifrArvore = $('#ifrArvore').contents();
    var ifrVisualizacao = $($ifrVisualizacao).contents();
    if (ifrVisualizacao.find('#iconDynamicField').length == 0 && ifrArvore.find('span.infraArvoreNoSelecionado').closest('a').prev().find('img[src*="formulario1.gif"]').length > 0 ) {
        var base64IconDynamicField = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyVpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ4IDc5LjE2NDAzNiwgMjAxOS8wOC8xMy0wMTowNjo1NyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OTcwNzVBRjk4MkE3MTFFQ0EwQzJFQkVGNzNCNzNCQzciIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OTcwNzVBRkE4MkE3MTFFQ0EwQzJFQkVGNzNCNzNCQzciPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo1ODVFRkVBMjgyOTExMUVDQTBDMkVCRUY3M0I3M0JDNyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo5NzA3NUFGODgyQTcxMUVDQTBDMkVCRUY3M0I3M0JDNyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PjLf6nQAAAXeSURBVHja7Fhb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';
        var htmlIconDynamicField =  '<a href="#" id="iconDynamicField" onclick="parent.openCamposDinamicosForm();" tabindex="452" class="botaoSEI">'+
                                 '<img class="infraCorBarraSistema" tabindex="452" src="'+base64IconDynamicField+'" alt="Adicionar campos din\u00E2micos do formul\u00E1rio" title="Adicionar campos din\u00E2micos do formul\u00E1rio">'+
                                 '</a>';
            ifrVisualizacao.find('#divArvoreAcoes').append(htmlIconDynamicField);
    }
    if (loop) {
        setTimeout(function () {
            appendIconDynamicField();
        },1500);
    }
}
export function insertIconFormSheet() {
    waitLoadPro($('#ifrArvore').contents(), '#divArvore', 'img[src*="formulario1.gif"]', appendIconFormSheet);
}
export function appendIconFormSheet(loop = true) {
    var ifrArvore = $('#ifrArvore').contents();
    var ifrVisualizacao = $($ifrVisualizacao).contents();
    if (ifrVisualizacao.find('#iconFormSheet').length == 0 && ifrArvore.find('span.infraArvoreNoSelecionado').closest('a').prev().find('img[src*="formulario1.gif"]').length > 0 ) {
        var base64IconFormSheet = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA4NpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ4IDc5LjE2NDAzNiwgMjAxOS8wOC8xMy0wMTowNjo1NyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpkNDkxZTA3Ni04ZjNkLTQ0MzctOTAxMS02MDAwOTNlYTQ0OGEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QUY1NEE2MzM4N0QwMTFFQzkxMzY4RjBERUI1MTJBOEYiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QUY1NEE2MzI4N0QwMTFFQzkxMzY4RjBERUI1MTJBOEYiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpiMjRmYmE0Mi1iN2UyLTQ0NmEtYWMzMS04MjAzNjhiNTg3YzkiIHN0UmVmOmRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDpiNDkyMWRjZi1kZDNhLTI4NGYtOWEyMC1h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';
        var htmlIconFormSheet =  '<a href="#" id="iconFormSheet" onclick="parent.openFormSheet();" tabindex="452" class="botaoSEI">'+
                                 '<img class="infraCorBarraSistema" tabindex="452" src="'+base64IconFormSheet+'" alt="Salvar dados na planilha" title="Salvar dados na planilha">'+
                                 '</a>';
            ifrVisualizacao.find('#divArvoreAcoes').append(htmlIconFormSheet);
    }
    if (loop) {
        setTimeout(function () {
            appendIconFormSheet();
        },1500);
    }
}
export function insertIconIntegrity() {
    waitLoadPro($($ifrVisualizacao).contents(), divInformacao, ancoraArvoreDownload, appendIconIntegrity);
}
export function appendIconIntegrity(loop = true) {
    var ifrVisualizacao = $($ifrVisualizacao).contents();
    if (ifrVisualizacao.find('#iconIntegrityPro').length == 0 ) {
        var base64IconIntegrity = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyVpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ4IDc5LjE2NDAzNiwgMjAxOS8wOC8xMy0wMTowNjo1NyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MDgxQ0NGRjUyNkNEMTFFQkFCOUJEQUI3RTE0QTRDODQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MDgxQ0NGRjYyNkNEMTFFQkFCOUJEQUI3RTE0QTRDODQiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDowODFDQ0ZGMzI2Q0QxMUVCQUI5QkRBQjdFMTRBNEM4NCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDowODFDQ0ZGNDI2Q0QxMUVCQUI5QkRBQjdFMTRBNEM4NCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pm2LucYAAAbsSURBVHja7FhZjBRVFL2vqndmkxnEZomQIQIKyC9qXACXD/1xASLqYOTTL2NCjB9+8aEJLvjhhl9C3KIk6J8GNSrEJSGETUeRgYHpYVZmpreq99593rdU9YwBHLrHhBhq5nVVv35dfeqce8+9VUwpBVfz5sFVvl0D+L8HmLgseuZ5r3x88ni+PbOQUTIh6IRioBNL/5n/yUmG+livo1U0z+ng7O+neud28A3PbnngyK49X5nFyZQHjLEpv/XUo2vdKXD6APW5cmlo2rwun6tNWUCIFi5IBYJOqrEhvWjAAu2FVMoh7Oo7v1TM7fj81Xf2bti6+d5DEciZkthTQqogxJggVAwkMgLlEzYfOF2jhBQgS4H00jQyAH4WkPaSZaA5x2BWZ2dnt+r88rW3P7uNQLIZjUFUlhVl5ARixw49L9GyhYY1y6CcPIjZalHASBGgd86K/K+47JM33t17Z9dj69jMJYmU+t/IqcNDOSotm0ZhM4y8hlnNsP4aMwvGywh/jgCUKCAPqXnz9p1fuPv197+4m2KO+b4H0agrSUzE6VhzDAoNT/+4AWkBKlXbS42Ugl+698pPAB+7AP6Bb2A553ATSqgGsKCPB7s3bHx+afexwWJDWWxTQlnpoh+NB7OswVSQ0ZykV0YAu7rug8qYhNKED8UxD6oVBkdP7L/+7Jme9IIbVzcOUHuFllg6xtC5gNC2o5gDp8y8ZdmuY2iPs21JSDcnIVcFaA0BKsMMfusGHvKqx9gMxKBShgsnoY03nRA0bUBF4NCqHzMZ6ljUFiRo0F4lFWRaFSTIsFDakNnx8hNM2xUi1s+gBaBM3OEkOTV7JpONxsxIGiWNiU/EWmw6dnmsgDsJbcVSYD+sOwaJKsOQY8n8OGhzhlrCgJVbuNTWn0mHQ5oLiZi1QLjQzhDgB3u+Vql0EhKJBLz3Vr0MSnSeBzFQSZGhHKsGp3S+GMUiWFZ1KEjKXq6tSpkpCr4kHQhYs2Zl+snN69ngUEFlMpkGksSBUi6+jNRoYwjBeaBjR2EtBPT8UO8pCMYL4NvqHJ9yze0t2YT/0HcbNz3y8JyO/NGBwQFVP0AjsYoTJAIhYvnQ2UsNmPI8GC2cg/LQX7B8WSe0tbWaL+kGwchM+3Pn+pf09Jz58McfDjxIRt1Tf5KYLFNTAMioLkcVJTJttJ/7PsBAoQD5phxwLuDnX47ARLFMYSIhSfE2u60FFi/OUwiwW4ZHL6xun91xOu5CrpxBjKU19gLM1FmlauUuAh4dMxpBKCFIBNDfX4DCOMKilfeAYB6IoSr8cexbaG/P0poQSmMl39mdrDMG0fhWDMbZh7UXazciKoUONEMbn0JwM/zUdZCalQEVCsjkWihqkhAEVUCdzQobqyRWYuth0gGRUQXBWubiJEY503QQIBaYcwQqbeZ0a0bhSd9Jm5ZMQRpCXgkaB2hYqVlIlMUyNmEVH2sLSpTOQ3NlP6SwYjyzpdIEfv8w+BSPfiUNLfgT4EgLZKrD0Dwrc8dHu178ftPW7WN1AWQmg10XE7VdrtxJ1/YLVfNH5BVo6dsOa1fdQAxmTRx4jKQUB0FlK8Baq7BiviBv7IUl8wHKYye3jQ43LaKFj7tidaUM2kqivyrijgUmlTmYmix8ArJsHGbfvJMm+mgIWk8qCmpcZIkucoKSqEznqdLF0yVhEgondq4nKjSWsI5+ULmuGlzToGJwkcUol+VWdo8aIJ2YF4AXj9EE9TS8RMlSogJCwESFzkmdJYFmtA8mBojNVIUW+Q3VYisxxiYdg8OoP6S7ONc7KtNNUwCIkI45HVOvJQNaS++1sdNKpoxx0V4Q+Eb6QalqNRinShqBrXmibfeFMczQyMoIoCTmpCBJFYFVxBxZj6LPtcRIQDnV6wa6GWszGHcnNbCKOWmRubUusyWBw6IBxkhiLasGp2UFGRpwYNgk6pCbnnFyra7jnsTVWF1FjNpkzgwntf3MdTa6Nnu0lgDIcfrtkutsLTgtMdMAkTuQkt5rBhuRGFiWVzh4g2XDoGeeGjBIqMgTmH3a4Bp0Uab2ilcJQJGYIzmZslmsY1E5cJo9FIZVSSzKRgCOjo0c/HTvvrzSCeJqsLmVMsaNUTW03QrNVcPAe/r+8FbmBZ5hjy7DM7cN0tV17t5zp4X11HoByjd3PLOF9ulLBslFztl116oeUeqh5C1Ed15kh9xkrGVPWol1mGBJW2XuUuf/N4DaACZolKb7JKAt5WWPHz78Qmlk20vatG3PK+MaETW07jmUljfsPg3PXayKgH0IpS73dKueJ2bU00MzDc2KP431whFQNGr/o7v5LwAyp0ximmGBDqR1rCt8/FbPpkzQ2dHwxq495W9w+1uAAQAiHKY4X2XbYgAAAABJRU5ErkJggg==';
        var htmlIconIntegrity =  '<a href="#" id="iconIntegrityPro" onclick="parent.getChecksumPro();" tabindex="452" class="botaoSEI">'+
                                 '<img class="infraCorBarraSistema" tabindex="452" src="'+base64IconIntegrity+'" alt="Visualizar C\u00F3digo de Integridade (Hashcode)" title="Visualizar C\u00F3digo de Integridade (Hashcode)">'+
                                 '</a>';
            ifrVisualizacao.find('#divArvoreAcoes').append(htmlIconIntegrity);
    }
    if (loop) {
        setTimeout(function () {
            appendIconIntegrity();
        },1500);
    }
}
export function setReplaceSelectAllVisualizacao() {
    if (verifyConfigValue('substituiselecao')) {
        var target = $($ifrVisualizacao).contents();
        if (typeof $().chosen !== 'undefined') {
            target.find('select').chosen('destroy');
            target.find('select').not('[multiple]').not('#selSerie').not('[size]').filter(function() { 
                    return !($(this).css('visibility') == 'hidden' || $(this).css('display') == 'none') 
                }).chosen({
                    placeholder_text_single: ' ',
                    no_results_text: 'Nenhum resultado encontrado',
                    normalize_search_text: function(text) {
                        return removeAcentos(text.toLowerCase());
                    }
                })
            chosenReparePosition(target);
            target.find('.infraAreaDados').css('overflow','initial');
            target.find('select').not('[multiple]').eq(0).trigger('chosen:activate');
        }
    }
}
export function replaceSelectAllVisualizacao(TimeOut = 9000) {
    if (TimeOut <= 0) return;
    var ifrVisualizacao = $($ifrVisualizacao)[0];
    if (!ifrVisualizacao) return;
    var ifrVisualizacaoWindow = ifrVisualizacao.contentWindow;
    if (!ifrVisualizacaoWindow || typeof ifrVisualizacaoWindow.$ !== 'function') {
        setTimeout(function() { replaceSelectAllVisualizacao(TimeOut - 300); }, 300);
        return;
    }
    if (typeof ifrVisualizacaoWindow.$().chosen === 'undefined' ) {
        getScriptIframe(ifrVisualizacao, URL_SPRO+"js/lib/chosen.jquery.min.js", function(){
            getScriptIframe(ifrVisualizacao, URL_SPRO+"js/sei-pro-visualizacao-chosen.js", function(){
                if (typeof ifrVisualizacaoWindow.replaceSelectOnVisualizacao !== 'undefined') ifrVisualizacaoWindow.replaceSelectOnVisualizacao();
            });
        });
    }
}
export function insertActionHipoteseLegal() {
    var target = $($ifrVisualizacao).contents();
        target.find('input[name="rdoFormato"]').on('change',function(){
            parent.replaceSelectAllVisualizacao();
            if ($(this).attr('id') == 'optNato') {
                setTimeout(() => {   
                    target.find('#selTipoConferencia').hide();
                    target.find('#selTipoConferencia_chosen').remove();
                });
            } else {
                setTimeout(function(){ 
                    if (typeof $($ifrVisualizacao)[0].contentWindow.setReplaceSelectOnVisualizacao === 'function') $($ifrVisualizacao)[0].contentWindow.setReplaceSelectOnVisualizacao(true);
                }, 500);
            }
        });
        target.find('input[name="rdoNivelAcesso"], input[name="rdoTextoInicial"]').on('change',function(){
            parent.replaceSelectAllVisualizacao();
            if ($(this).attr('id') == 'optPublico') {
                target.find('#selHipoteseLegal').hide();
                target.find('#selHipoteseLegal_chosen').remove();
            } else {
                setTimeout(function(){ 
                    if (typeof $($ifrVisualizacao)[0].contentWindow.setReplaceSelectOnVisualizacao === 'function') $($ifrVisualizacao)[0].contentWindow.setReplaceSelectOnVisualizacao(true);
                }, 500);
            }
        });
        target.find('#newdocsigilo').remove();
        target.find('#lblHipoteseLegal').append('<span id="newdocsigilo" style="float: right;font-size: 0.8em;"><a onclick="parent.setNewDocSigilo(this)">Definir como padr\u00E3o para novos documentos</a></span>');
        target.find('#fldNivelAcesso').css('height','110%');
        target.find('#divInfraBarraComandosInferior').css('margin-top','20px');
}
export function enableConsultasExtras() {
    var urlConfig = url_host.replace('controlador.php','')+'?#&acao_pro=set_option&option_key=disablequery&option_value=false';
    if ( $('#frmCheckerProcessoPro').length == 0 ) { getCheckerProcessoPro(); }
    $('#frmCheckerProcessoPro').attr('src', urlConfig).unbind().on('load', function(){
        setTimeout(function(){ 
            parent.alertaBoxPro('Sucess', 'check-circle', 'Consultas adicionais ativadas com sucesso!', function(){
                window.location.reload();
            });
            $('#frmCheckerProcessoPro').remove();
        }, 500);
    });
}
export function setNewDocSigilo(this_) {
    var _this = $(this_);
    var _parent = _this.closest('form');
    var selectHipoteseLegal = _parent.find('#selHipoteseLegal');
    var valueNivelAcesso = _parent.find('input[name="rdoNivelAcesso"]:checked');
    var valueNewDocSigilo = (selectHipoteseLegal.length) ? selectHipoteseLegal.val()+'|'+valueNivelAcesso.val()+'|'+selectHipoteseLegal.find('option:selected').text() : '';

    var urlConfigSigilo = url_host.replace('controlador.php','')+'?#&acao_pro=set_option&option_key=newdocsigilo&option_value='+encodeURIComponent(valueNewDocSigilo);
    var urlConfigPublico = url_host.replace('controlador.php','')+'?#&acao_pro=set_option&option_key=newdocnivel&option_value=false';
    if ( $('#frmCheckerProcessoPro').length == 0 ) { getCheckerProcessoPro(); }
    $('#frmCheckerProcessoPro').attr('src', urlConfigSigilo).unbind().on('load', function(){
        setTimeout(function(){ 
            $('#frmCheckerProcessoPro').remove();
            if ( $('#frmCheckerProcessoPro').length == 0 ) { getCheckerProcessoPro(); }
            $('#frmCheckerProcessoPro').attr('src', urlConfigPublico).unbind().on('load', function(){
                alertaBoxPro('Sucess', 'check-circle', 'Padr\u00E3o de sigilo definido com sucesso!');
                $('#frmCheckerProcessoPro').remove();
            });
        }, 500);
    });
}
