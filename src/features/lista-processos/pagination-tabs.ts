// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/**
 * Lista de processos — pagination, new tab, type change.
 * (ponte temporária: jQuery/DOM legado; fatia do antigo body.js)
 */
import {
    callAtividades
} from './atividades-bridge.js';

import {
    addAcompanhamentoEspIcon,
    initUpdateGroupTable,
    initViewEspecifacaoProcesso,
    removeDuplicateValue
} from './modules.js';

export function initDadosProcesso(TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    if (typeof getParamsUrlPro !== 'undefined' && typeof getDadosIframeProcessoPro === 'function') { 
        var id_procedimento = getParamsUrlPro(window.location.href).id_procedimento;
            id_procedimento = (typeof id_procedimento === 'undefined') ? getParamsUrlPro($('#ifrArvore').attr('src')).id_procedimento : id_procedimento;
            id_procedimento = (typeof id_procedimento === 'undefined') ? getParamsUrlPro(window.location.href).id_protocolo : id_procedimento;
        if (typeof id_procedimento !== 'undefined' && id_procedimento !== '') {
            getDadosIframeProcessoPro(id_procedimento, 'processo');
            return;
        } else {
            setTimeout(function(){ 
                initDadosProcesso(TimeOut - 100); 
                if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage'))console.log('Reload initDadosProcesso'); 
            }, 500);
        }
    }
}

// REMOVE PAGINACAO DA PAGINA
export function getProcessosPaginacao(this_, index, tipo) {
    var form = $('#frmProcedimentoControlar');
    var href = form.attr('action');
    var param = {};
        form.find("input[type=hidden]").map(function () { 
            if ( $(this).attr('name') && $(this).attr('id').indexOf('hdn') !== -1) { 
                param[$(this).attr('name')] = $(this).val(); 
            }
        });
        param['hdn'+tipo+'PaginaAtual'] = index;

    $.ajax({ 
        method: 'POST',
        data: param,
        url: href
    }).done(function (html) {
        let $html = $(html);
        var tr = $html.find('#tblProcessos'+tipo+' tbody').find('tr.infraTrClara');
            if(tr.length > 0) {
                tr.each(function(index){
                    $(this).find('input.infraCheckbox').attr('disabled', true).closest('td').attr('onmouseout','return infraTooltipOcultar()').attr('onmouseover','return infraTooltipMostrar(\'Desative a op\u00E7\u00E3o "Remover pagina\u00E7\u00E3o de processos" nas configura\u00E7\u00F0es do '+NAMESPACE_SPRO+' para utilizar esta sele\u00E7\u00E3o\')');
                    $('#tblProcessos'+tipo).append($(this)[0].outerHTML);
                });
                var NroItens = $html.find('#hdn'+tipo+'NroItens').val();
                var NroItens_ = $('#hdn'+tipo+'NroItens');
                var totalItens = $('#tblProcessos'+tipo).find('tbody tr.infraTrClara').filter(function(){
                    return $(this).find('a[href*="acao=procedimento_trabalhar"]').length > 0;
                }).length;
                    NroItens_.val(totalItens);
                    $('#tblProcessos'+tipo).find('caption.infraCaption').html('<span '+actionTest+'>'+totalItens+' registros:</span>');
                var Itens = $html.find('#hdn'+tipo+'Itens').val();
                var Itens_ = $('#hdn'+tipo+'Itens');
                    //Itens_.val(Itens_.val()+','+Itens);
                var ItensHash = $html.find('#hdn'+tipo+'ItensHash').val();
                var ItensHash_ = $('#hdn'+tipo+'ItensHash');
                    //ItensHash_.val(ItensHash);
                getProcessosPaginacao(this_, index+1, tipo);
                if (checkConfigValue('gerenciarmonitorados')) appendStarOnProcess();
                initControlePrazo(true);
                initViewEspecifacaoProcesso();
                addAcompanhamentoEspIcon();
            } else {
                param['hdn'+tipo+'PaginaAtual'] = 0;
                $.ajax({  method: 'POST', data: param, url: href });
                initUpdateGroupTable(this_);
            }
    });
}
export function checkProcessoPaginacao(this_, tipo) {
    var pgnAtual = $('#hdn'+tipo+'PaginaAtual');
    if ( parseInt(pgnAtual.val()) > 0) {
         pgnAtual.val(0);
         $('#frmProcedimentoControlar').submit();
    } else {
        getProcessosPaginacao(this_, 1, tipo);
        $('#div'+tipo+' .infraAreaPaginacao').find('a, select').hide();
    }
}
export function initProcessoPaginacao(this_) {
    if ($('.infraAreaPaginacao a').is(':visible')) {
        if ($('#divRecebidosAreaPaginacaoSuperior a').is(':visible')) {
            checkProcessoPaginacao(this_, 'Recebidos');
        }
        if ($('#divGeradosAreaPaginacaoSuperior a').is(':visible')) {
            checkProcessoPaginacao(this_, 'Gerados');
        } 
    } else {
        initUpdateGroupTable(this_);
    }
}
/*
export function observeHistoryBrowserPro() {
    (function(history){
        var pushState = history.pushState;
        history.pushState = function(state) {
            if (typeof history.onpushstate == "function") {
                history.onpushstate({state: state});
            }
            return pushState.apply(history, arguments);
        }
    })(window.history);
    
    window.onpopstate = history.onpushstate = function(e) {
        //iHistory++;
        var iframeArvore = $('#ifrArvore').contents();
        if (typeof e.state.id_procedimento !== 'undefined' && typeof e.state.id_documento !== 'undefined') {
            var id_procedimento = e.state.id_procedimento;
            var id_documento = e.state.id_documento;
            var linkDoc = '&id_procedimento='+id_procedimento+'&id_documento='+id_documento;
            var href = iframeArvore.find('a[href*="'+linkDoc+'"]');
            var hCurrent = jmespath.search(iHistoryArray, "[?link=='"+window.location.href+"'].id | [0]");
            if (!href.find('span').hasClass('infraArvoreNoSelecionado')) {
                href.trigger('click');
                $($ifrVisualizacao).attr('src', href.attr('href'));
                console.log(hCurrent, iHistoryCurrent, iHistoryArray, linkDoc, href.find('span').hasClass('infraArvoreNoSelecionado'), e.state);
                //history.forward();
                history.back(); 
                iHistoryCurrent = hCurrent;
            } else {
                console.log(hCurrent, iHistoryArray, linkDoc, href.find('span').hasClass('infraArvoreNoSelecionado'), e.state);
            }
        }
    };
}
*/
export function initNewTabProcesso(TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    if (typeof verifyConfigValue !== 'undefined') { 
        getNewTabProcesso();
    } else {
        setTimeout(function(){ 
            initNewTabProcesso(TimeOut - 100); 
            if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage'))console.log('Reload initNewTabProcesso'); 
        }, 500);
    }
}
export function getNewTabProcesso() {
    var iconLabel = localStorage.getItem('iconLabel');
    var iconBoxSlim = localStorage.getItem('seiSlim');
    var observerTableControle = new MutationObserver(function(mutations) {
        var _this = $(mutations[0].target);
        var _parent = _this.closest('table');
        if (_parent.find('tr.infraTrMarcada').length > 0) {
            $(`${divComandos}${infraBarraComandos}`).find('.iconPro_Observe').removeClass('botaoSEI_hide');
            removeDuplicateValue('#hdnRecebidosItensSelecionados');
            removeDuplicateValue('#hdnGeradosItensSelecionados');
        } else {
            $(`${divComandos}${infraBarraComandos}`).find('.iconPro_Observe').addClass('botaoSEI_hide');
        }
    });
    setTimeout(function(){ 
        $('#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado').find('tbody tr').each(function(){
            observerTableControle.observe(this, {
                    attributes: true
            });
        });
        htmlBtnAtiv = (parent.checkConfigValue('gerenciaratividades') && localStorage.getItem('configBasePro_atividades') !== null && callAtividades('checkCapacidade', 'save_atividade') && typeof __ !== 'undefined')
        ?   '<a tabindex="451" class="botaoSEI botaoSEI_hide '+(iconLabel ? 'iconLabel' : '')+' iconBoxAtividade seipro-atividades-icon-box '+(iconBoxSlim ? 'iconBoxSlim' : '')+' iconPro_Observe iconAtividade_save" '+(iconLabel ? '' : 'onmouseout="return infraTooltipOcultar();" onmouseover="return infraTooltipMostrar(\''+__.Nova_Demanda+'\')"')+' data-act="atividades-call" data-fn="saveAtividade" data-pass-el="0" style="position: relative; margin-left: -3px;">'+
            '    <img class="infraCorBarraSistema" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" title="'+__.Nova_Demanda+'">'+
            '    <span class="botaoSEI_iconBox">'+
            '       <i class="fad fa-user-check" style="font-size: 17pt; color: #fff;"></i>'+
            '    </span>'+
            (iconLabel ?
            '    <span class="newIconTitle">'+__.Nova_Demanda+'</span>'+
            '' : '')+
            '</a>'
            : '';

        var htmlBtnTypes =  (checkConfigValue('gerenciarprazos')) ? 
                            '<a class="botaoSEI botaoSEI_hide '+(iconLabel ? 'iconLabel' : '')+' '+(iconBoxSlim ? 'iconBoxSlim' : '')+' iconPro_Observe iconPrazo_new" '+(iconLabel ? '' : 'onmouseout="return infraTooltipOcultar();" onmouseover="return infraTooltipMostrar(\'Alterar informa\u00E7\u00F5es do processso\')"')+' onclick="dialogChangeTypeProc()" style="position: relative; margin-left: -3px;">'+
                            '    <img class="infraCorBarraSistema" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" title="Alterar informa\u00E7\u00F5es do processso">'+
                            '    <span class="botaoSEI_iconBox">'+
                            '       <i class="fad fa-info-circle" style="font-size: 17pt; color: #fff;"></i>'+
                            '    </span>'+
                            (iconLabel ?
                            '    <span class="newIconTitle">Alterar informa\u00E7\u00F5es do processso</span>'+
                            '' : '')+
                            '</a>'
                            : '';

        var htmlBtnUpload =  (checkConfigValue('uploaddocsexternos')) ? 
                            '<a class="botaoSEI botaoSEI_hide '+(iconLabel ? 'iconLabel' : '')+' '+(iconBoxSlim ? 'iconBoxSlim' : '')+' iconPro_Observe iconUpload_new" '+(iconLabel ? '' : 'onmouseout="return infraTooltipOcultar();" onmouseover="return infraTooltipMostrar(\'Enviar documentos em processos\')"')+' onclick="initUploadFilesInProcess()" style="position: relative; margin-left: -3px;">'+
                            '    <img class="infraCorBarraSistema" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" title="Enviar documentos em processos">'+
                            '    <span class="botaoSEI_iconBox">'+
                            '       <i class="fad fa-file-upload" style="font-size: 17pt; color: #fff;"></i>'+
                            '    </span>'+
                            (iconLabel ?
                            '    <span class="newIconTitle">Enviar documentos em processos</span>'+
                            '' : '')+
                            '</a>'
                            : '';

        var htmlBtnPrazo =  (checkConfigValue('gerenciarprazos')) ? 
                            '<a class="botaoSEI botaoSEI_hide '+(iconLabel ? 'iconLabel' : '')+' '+(iconBoxSlim ? 'iconBoxSlim' : '')+' iconPro_Observe iconPrazo_new" '+(iconLabel ? '' : 'onmouseout="return infraTooltipOcultar();" onmouseover="return infraTooltipMostrar(\'Adicionar prazo\')"')+' data-seipro-add-prazo-all="1" style="position: relative; margin-left: -3px; cursor: pointer;">'+
                            '    <img class="infraCorBarraSistema" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" title="Adicionar prazo">'+
                            '    <span class="botaoSEI_iconBox">'+
                            '       <i class="fad fa-clock" style="font-size: 17pt; color: #fff;"></i>'+
                            '    </span>'+
                            (iconLabel ?
                            '    <span class="newIconTitle">Adicionar prazo</span>'+
                            '' : '')+
                            '</a>'
                            : '';

        var htmlBtnNaoLido =  (checkConfigValue('marcar_naolido')) ? 
                            '<a class="botaoSEI botaoSEI_hide '+(iconLabel ? 'iconLabel' : '')+' '+(iconBoxSlim ? 'iconBoxSlim' : '')+' iconPro_Observe iconNaoLido" '+(iconLabel ? '' : 'onmouseout="return infraTooltipOcultar();" onmouseover="return infraTooltipMostrar(\'Marcar como n\u00E3o visualizado\')"')+' data-act="nao-lido-marcar" style="position: relative; margin-left: -3px; cursor: pointer;">'+
                            '    <img class="infraCorBarraSistema" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" title="Marcar como n\u00E3o visualizado">'+
                            '    <span class="botaoSEI_iconBox">'+
                            '       <i class="fad fa-eye-slash" style="font-size: 17pt; color: #fff;"></i>'+
                            '    </span>'+
                            (iconLabel ?
                            '    <span class="newIconTitle">Marcar como n\u00E3o visualizado</span>'+
                            '' : '')+
                            '</a>'
                            : '';

        htmlBtn =   '<a tabindex="451" class="botaoSEI botaoSEI_hide '+(iconLabel ? 'iconLabel' : '')+' '+(iconBoxSlim ? 'iconBoxSlim' : '')+' iconPro_Observe iconPro_newtab" '+(iconLabel ? '' : 'onmouseout="return infraTooltipOcultar();" onmouseover="return infraTooltipMostrar(\'Abrir Processos em Nova Aba\')"')+' onclick="openListNewTab(this)" style="position: relative; margin-left: -3px;">'+
                    '    <img class="infraCorBarraSistema" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" title="Abrir Processos em Nova Aba">'+
                    '    <span class="botaoSEI_iconBox">'+
                    '       <i class="fad fa-external-link-alt" style="font-size: 17pt; color: #fff;"></i>'+
                    '    </span>'+
                    (iconLabel ?
                    '    <span class="newIconTitle">Abrir Processos em Nova Aba</span>'+
                    '' : '')+

                    '</a>'+htmlBtnAtiv+htmlBtnPrazo+htmlBtnTypes+htmlBtnUpload+htmlBtnNaoLido;
                    
        $(`${divComandos}${infraBarraComandos}`).each(function(){
            var _this = $(this);
                _this.find('.iconPro_Observe').remove();
                _this.append(htmlBtn);            
        });
    }, 500);
}
export function openListNewTab(this_) {
    var listNewTag = $('#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado').find(elemCheckbox+':checked').map(function(){ return $(this).val() }).get();
    if (listNewTag.length > 0) {
        $.each(listNewTag, function(index, value){
            var url = url_host+'?acao=procedimento_trabalhar&id_procedimento='+value;
            var win = window.open(url, '_blank');
            if (win) {
                win.focus();
            } else {
                console.log('Por favor, permita popups para essa p\u00E1gina');
            }
        })
    }
}
export function dialogChangeTypeProc(this_) {
    initListTypesSEI(function (){
        var htmlOption = $.map(arrayListTypesSEI.selectTipoProc, function(v){
            return '<option value="'+v.value+'">'+v.name+'</option>';
        });
        $('#dialogBoxTipoProc').html(htmlOption);
        initChosenReplace('box_reload', $('#dialogBoxTipoProc')[0], true);
    });

    var htmlBox =   '<div class="dialogBoxDiv seiProForm">'+
                    '   <table style="font-size: 10pt;width: 100%;">'+
                    '      <tr style="height: 40px;">'+
                    '          <td class="label" style="vertical-align: bottom;">'+
                    '               <i class="iconPopup fas fa-inbox azulColor"></i> <span>Tipo de procedimento</span>'+
                    '          </td>'+
                    '          <td>'+
                    '               <select id="dialogBoxTipoProc" style="font-size: 10pt; width: 100%;">'+
                    '                   <option value="0">Carregando lista...</option>'+
                    '               </select>'+
                    '           </td>'+
                    '      </tr>'+
                    '   </table>'+
                    '</div>';

    resetDialogBoxPro('dialogBoxPro');
    dialogBoxPro = $('#dialogBoxPro')
        .html(htmlBox)
        .dialog({
            title: "Alterar informa\u00E7\u00F5es do processso",
        	width: 600,
        	buttons: [{
                text: "Alterar",
                class: 'confirm',
                click: function() {
                    changeTypeProc();
                }
            }]
    });
}
export function changeTypeProc(this_) {
    var idTypeProc = $('#dialogBoxTipoProc').val();
    var txtTypeProc = $('#dialogBoxTipoProc').find('option:selected').text();
        getChangeTypeProc(idTypeProc, txtTypeProc);
        loadingButtonConfirm(true);
}
export function getChangeTypeProc(idTypeProc, txtTypeProc) {
    var tableProc = $('#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado');
    var listProcs = tableProc.find(elemCheckbox+':checked').map(function(){ return $(this).val() }).get();
    if (listProcs.length > 0) {
        var id_protocolo = listProcs[0];
        var tr = tableProc.find('tr#P'+id_protocolo+'');
        var td = tr.find('td.tagintable').eq(1);
            td.find('.sucessEdit').remove();
            td.html(txtTypeProc+'<i class="fas fa-check azulColor sucessEdit" style="margin-left:10px;"></i>');
            updateDadosArvore('Consultar/Alterar Processo', 'selTipoProcedimento', idTypeProc, id_protocolo, function(){ 
                td.find('.sucessEdit').remove();
                td.append('<i class="fas fa-check-double azulColor sucessEdit" style="margin-left:10px;"></i>');
                setTimeout(function(){ td.find('.sucessEdit').remove(); }, 2000);
                setTimeout(function(){ 
                        tr.find(elemCheckbox+':checked').trigger('click');
                    var alink = tr.find('a[href*="controlador.php?acao=procedimento_trabalhar"]');
                    var txttooltip = alink.attr('onmouseover');
                    var tooltip = extractTooltipToArray(txttooltip);
                        alink.attr('onmouseover',txttooltip.replace(tooltip[1], txtTypeProc));
                        getChangeTypeProc(idTypeProc, txtTypeProc);
                }, 500);
            });
    } else {
        resetDialogBoxPro('dialogBoxPro');
        alertaBoxPro('Sucess', 'check-circle', 'Informa\u00E7\u00F5es editadas com sucesso!');
    }
}
// initPanelMonitorados migrado para ESM (src/features/monitorados/boot.js); exposto
// como global via monitorados/legacy-api.js. O call-site abaixo usa o alias.
