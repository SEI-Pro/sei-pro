// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/**
 * Sei Functions Pro — marcadores, atribuicao, arvore updates.
 * (ponte temporária: jQuery/DOM legado; fatia do antigo body.js)
 */
import {
    alertaBoxPro,
    checkProcessoSigiloso,
    getCheckerProcessoPro,
    getHipoteseLegal,
    getTreeLinkUrlByName,
    initCheckNaoAssinados,
    loadingButtonConfirm,
    pullDadosProcessoSession,
    resetDialogBoxPro,
    setSessionProcessosPro
} from './modules.js';

export function getRemoverMarcador(alert = true) {
    loadingButtonConfirm(true);
    var id_procedimento = getParamsUrlPro(window.location.href).id_procedimento;
        id_procedimento = (typeof id_procedimento === 'undefined') ? getParamsUrlPro(window.location.href).id_protocolo : id_procedimento;
        id_procedimento = (typeof id_procedimento === 'undefined') ? getParamsUrlPro($('#ifrArvore').attr('src')).id_procedimento : id_procedimento;
    var valuesIframe = [
        {element: 'txaTexto', value: ''},
        {element: 'hdnIdMarcador', value: ''}
    ];
    updateDadosArvoreMult('Gerenciar Marcador', valuesIframe, id_procedimento, function(){ 
        var listMarcadores = sessionStorageRestorePro('dadosMarcadoresProcessoPro');
        var objIndexDoc = (!listMarcadores) ? -1 : listMarcadores.findIndex((obj => obj.id_procedimento == String(id_procedimento)));
        if (objIndexDoc !== -1) {
            listMarcadores.splice(objIndexDoc,1);
            sessionStorageStorePro('dadosMarcadoresProcessoPro',listMarcadores);
            resetDialogBoxPro('dialogBoxPro');
            if (alert) alertaBoxPro('Sucess', 'check-circle', 'Marcador removido com sucesso!');
        }
    });
}
export function getAjaxListaAtribuicao() {
    if ( $('#frmCheckerProcessoPro').length == 0 ) { getCheckerProcessoPro(); }
    var url = $('a.processoVisualizado[href*="acao=procedimento_trabalhar"]').eq(0).attr('href');
    if (!!url) {
        $('#frmCheckerProcessoPro').attr('src', url).unbind().on('load', function(){
            var ifrArvore = $('#frmCheckerProcessoPro').contents().find('#ifrArvore');
            getSelectAtribuicaoProcesso(false, ifrArvore);
        });
    }
}
export function getAjaxListaMarcador() {
    var href = SeiPro.sei.adapter.isNewSEI()
            ? $(divComandos+' a[onclick*="andamento_marcador_cadastrar"]').attr('onclick') 
            : $(divComandos+' a[onclick*="andamento_marcador_gerenciar"]').attr('onclick');
        href = (typeof href !== 'undefined') ? href.match(RegExp(/(?<=(["']))(?:(?=(\\?))\2.)*?(?=\1)/, 'g')) : false;
        href = (href && href !== null && href.length > 0 && href[0] != '') ? href[0] : false;
    if (href) {
        var param = {};
            $('#frmProcedimentoControlar').find("input[type=hidden]").map(function () {
                if ( $(this).attr('name') && $(this).attr('id').indexOf('hdn') !== -1) {
                    param[$(this).attr('name')] = $(this).val(); 
                }
            });
            param.hdnRecebidosItensSelecionados = $('input[name*="chkRecebidosItem"]').eq(0).val();
            param[$('input[name*="chkRecebidosItem"]').eq(0).attr('name')] = $('input[name*="chkRecebidosItem"]').eq(0).val();
        $.ajax({ 
            method: 'POST',
            data: param,
            url: href
        }).done(function (html) {
            getListaMarcadores($(html));
        });
    }
}
export function editFieldProc(this_) {
    var _this = $(this_);
    var _content_desc = _this.closest('.tagintable');
    var _info = _content_desc.find('span.info');
    var data = _content_desc.data();
    var value = _info.text();

    if (_info.is("[contentEditable='true']")) {
        _content_desc.removeClass('info_noclick');
        _content_desc.find('.content_btnsave').toggleClass('newLink_active newLink_confirm').find('i').toggleClass('fa-thumbs-up fa-edit');
        _info.prop('contenteditable',false).unbind();
        if (data.old != value) {
            var id_protocolo = _this.closest('tr').attr('id');
                id_protocolo = (typeof id_protocolo !== 'undefined') ? parseInt(id_protocolo.replace('P','')) : false;
            if (id_protocolo) {
                _info.after('<i class="fas fa-check azulColor sucessEdit" style="margin-left:10px;"></i>');
                updateDadosArvore('Consultar/Alterar Processo', 'txtDescricao', value, id_protocolo, function(){ 
                    _content_desc.find('.sucessEdit').remove();
                    _info.after('<i class="fas fa-check-double azulColor sucessEdit" style="margin-left:10px;"></i>');
                    setTimeout(function(){ _content_desc.find('.sucessEdit').remove(); }, 2000);

                });
            }
        }
    } else {
        _content_desc.addClass('info_noclick').data('old', value);
        _info.prop('contenteditable',true).focus().on('keypress',function(e) {
            if(e.which == 13) {
                _content_desc.find('.content_btnsave').trigger('click');
                _info.text(_info.text());
            }
        });
        _content_desc.find('.content_btnsave').toggleClass('newLink_active newLink_confirm').find('i').toggleClass('fa-thumbs-up fa-edit');
    }

}
export function getSelectAtribuicaoProcesso(callback = false, iframe = false) {
    var href = getTreeLinkUrlByName('Atribuir Processo');
    if (href !== null) {
        $.ajax({ url: href }).done(function (html) {
            var $html = $(html);
            var selectAtribuicao = $html.find('#selAtribuicao option').map(function(){ if($(this).text().trim() != '') { return {name: $(this).text().trim(), value: $(this).val()} } }).get();
                setOptionsPro('arrayListUsersSEI',selectAtribuicao);
            if (selectAtribuicao.length && typeof callback === 'function') {
                callback(selectAtribuicao);
            }
        });
    }
}
export function getListaAtribuicaoProcesso(iframe, mode) {
    if (mode == 'processo' || mode == 'editor') {
        getSelectAtribuicaoProcesso(function(html_result){
            var select_result = $.map(html_result, function(v, i){
                var username = (v.name.indexOf('-') !== -1) ? v.name.split('-')[0].trim() : false;
                var name = (v.name.indexOf('-') !== -1) ? v.name.split('-')[1].trim() : false;
                return {value: v.name, username: username, name: name};
            });
            var dadosProcessoPro = pullDadosProcessoSession();
                dadosProcessoPro.listAtribuicaoProcesso = select_result;
                // console.log('->seetSessionProcessosPro', dadosProcessoPro.listAndamento);
                setSessionProcessosPro(dadosProcessoPro); 
        }, iframe);
    }
}
export function getLinhaNumerada() {
    var _ifrArvoreHtml = $($ifrVisualizacao).contents().find($ifrArvoreHtml);
    if (_ifrArvoreHtml.length && verifyConfigValue('linhanumerada')) {
        var ifrArvoreHtml = _ifrArvoreHtml.contents();
        ifrArvoreHtml.find('p').filter(function(){ return $(this).text().trim() != '' }).addClass('linhaNumerada');
    }
}
/*
export function getLinksArvorePasta(nomePasta) {
    var ifrArvore = $('#ifrArvore');
    var ifrArvoreForm = ifrArvore.contents();
    var arrayLinksArvoreAll = getTreeLinksAllSession();
    var href = (nomePasta) ? arrayLinksArvoreAll.filter(function(v){ return (v.indexOf('procedimento_paginar') !== -1 && v.indexOf('no_pai='+nomePasta) !== -1) }) : [];
    console.log(nomePasta, href, {
        hdnArvore: ifrArvoreForm.find('#hdnArvore').val(),
        hdnPastaAtual: ifrArvoreForm.find('#hdnPastaAtual').val(),
        hdnProtocolos: ifrArvoreForm.find('#hdnProtocolos').val(),
    });
    
    if (href.length > 0) {
        $.ajax({ 
            method: 'POST',
            url: href[0],
            data: {
                hdnArvore: ifrArvoreForm.find('#hdnArvore').val(),
                hdnPastaAtual: ifrArvoreForm.find('#hdnPastaAtual').val(),
                hdnProtocolos: ifrArvoreForm.find('#hdnProtocolos').val(),
            }
        }).done(function (html) {
            // var $html = $('<script>'+html+'</script>');
            // console.log(getLinksInText($html.text()));
            var newLinks = getLinksInText(html);
                $.merge(newLinks, arrayLinksArvoreAll);
                newLinks = uniqPro(newLinks);
                if (typeof syncTreeModelSession === 'function') {
                    syncTreeModelSession(pullDadosProcessoSession(), {linksAll: newLinks});
                }
                console.log(newLinks);
        });
    }
}
*/
export function getLinksInText(text) {
    var array = [];
    text.split("'").filter(function(el) { return el.indexOf('controlador.php') !== -1 }).map(function(v){
        if (v.indexOf('\"') !== -1) {
            v.split('"').filter(function(i){ return i.indexOf('controlador.php') !== -1}).map(function(j){
                var link = j.replace(/[\\"]/g, '');
                array.push(link);
            });
            return false;
        } else {
            var link = v.replace(/[\\"]/g, '');
            array.push(link);
            return false;
        }
    });
    array = (array.length > 0) 
        ?   array.sort().filter(function(item, pos, ary) {
                return !pos || item != ary[pos - 1];
            }) 
        : [];
    return array;
}
export function changeSelectHipoteseLegal(this_) {
    if ($(this_).val() == '1' || $(this_).val() == '2') {
        getSelectHipoteseLegal($('.select_hipoteses'), $(this_).val());
    } else {
        $('.select_hipoteses').html('').chosen('destroy').hide();
    }
}
export function getSelectHipoteseLegal(elementHipotese = $('#dialogBoxProcesso_hipoteses'), nivelAcesso = 1) {
    getHipoteseLegal(dadosProcessoPro.propProcesso.urlHipoteseLegal, nivelAcesso, function(html_result){
        elementHipotese.show().html(html_result);
        if (dadosProcessoPro.propProcesso.selHipoteseLegal) {
            elementHipotese.val(dadosProcessoPro.propProcesso.selHipoteseLegal);
        }
        elementHipotese.chosen('destroy').chosen({
            placeholder_text_single: ' ',
            no_results_text: 'Nenhum resultado encontrado',
            normalize_search_text: function(text) {
                return removeAcentos(text.toLowerCase());
            }
        }).trigger('chosen:updated');
    });
}
export function updateDadosArvore(nameLink, idElement, value, idProcedimento, callback = false) {
    if (typeof idProcedimento !== 'undefined' && idProcedimento != '' && idProcedimento !== null && idProcedimento != 0 && !checkProcessoSigiloso()) {
        if ($('#ifrArvore').length == 0) {
            if ( $('#frmCheckerProcessoPro').length == 0 ) { getCheckerProcessoPro(); }
            var url = 'controlador.php?acao=procedimento_trabalhar&id_procedimento='+idProcedimento;
            $('#frmCheckerProcessoPro').attr('src', url).unbind().on('load', function(){
                var ifrArvore = $('#frmCheckerProcessoPro').contents().find('#ifrArvore');
                updateDadosArvoreIframe(nameLink, idElement, value, ifrArvore, callback);
            });
        } else {
            var ifrArvore = $('#ifrArvore');
            updateDadosArvoreIframe(nameLink, idElement, value, ifrArvore, callback);
        }
    } else {
        return false;
    }
}
export function updateDadosArvoreIframe(nameLink, idElement, value, ifrArvore, callback) {
    if ( $('#frmCheckerProcessoPro').length == 0 ) { getCheckerProcessoPro(); }
    var url = getTreeLinkUrlByName(nameLink);
    if (typeof url !== 'undefined' && url != '') {
        $('#frmCheckerProcessoPro').attr('src', url).unbind().on('load', function(){
            var iframe = $(this).contents();
            var element = iframe.find('#'+idElement);
            if (element.is('select') && !hasNumber(value)) {
                element.find('option:contains("'+value+'")').prop('selected',true);
            } else {
                if (element.is(':radio') || element.is(':checkbox')) {
                    element.prop('checked',true).trigger('change');
                    if (idElement == 'optRestrito' || idElement == 'optSigiloso') {
                        iframe.find('#selHipoteseLegal').after('<input id="selHipoteseLegal" value="'+value+'" name="selHipoteseLegal"></input>').remove();
                    }
                } else {
                    element.val(value);
                    var nameElement = (idElement.indexOf('sel') !== -1) ? idElement.replace('sel','') : false;
                    if ( nameElement && iframe.find('#hdnId'+nameElement).length > 0 ) {
                        iframe.find('#hdnId'+nameElement).val(value);
                    }
                }
            }
            
            $(this).unbind();
            if (iframe.find('button[type="submit"]').length > 0) {
                iframe.find('button[type="submit"]').trigger('click');
            } else {
                iframe.find('button[name="btnSalvar"]').trigger('click');
            }

            // console.log(arrayLinksArvore, url,  nameLink, idElement, value);
            if (typeof callback === 'function') callback();
        });
    } else {
        return false;
    }
    
}
export function viewEspecifacaoProcesso() {
    setTimeout(() => {
        var tableProc = $('#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado');
            tableProc.find('.especifProc').remove();
            if (typeof storeGroupTablePro() === 'undefined' || !storeGroupTablePro()) {
                tableProc.find('a[href*="controlador.php?acao=procedimento_trabalhar"]').each(function(){
                    var especifProc = extractTooltipToArray($(this).attr('onmouseover'));
                        especifProc = (especifProc) ? especifProc[0] : false;
                        if (especifProc) $(this).before('<div class="especifProc">'+especifProc+'</div>');
                });
            }
        // console.log(storeGroupTablePro());
    }, 100);
}
export function addNewItemSelect(_this) {
    if ($(_this).val().toString() == '0') {
    var textBox =   'Digite o nome do novo item:'+
                    '<br><br><span class="seiProForm" style="text-align: center; display: block; font-size: 9pt;">'+
                    '   <input type="text" style="width: 90% !important;" class="required infraText txtsheetsSelect" value="" id="nomeNovoItem">'+
                    '</span>';

        resetDialogBoxPro('alertBoxPro');
        alertBoxPro = $('#alertaBoxPro')
            .html('<div class="dialogBoxDiv"> '+textBox+'</span>')
            .dialog({
                width: 400,
                title: 'Adicionar novo item',
                open: function() { 
                    setTimeout(() => { $('#nomeNovoItem').focus() }, 500);
                },
                buttons: [{
                    text: "Ok",
                    class: 'confirm',
                    click: function() {
                        saveNewItemSelect(_this);
                    }
                }]
        });
    }
}
export function saveNewItemSelect(_this) {
    var value = $('#nomeNovoItem').val();
    if ( value != '' ) {
        resetDialogBoxPro('alertBoxPro');
        $(_this).prepend('<option selected>'+value+'</option>').val(value).change().chosen("destroy").chosen({
            placeholder_text_single: ' ',
            no_results_text: 'Nenhum resultado encontrado',
            normalize_search_text: function(text) {
                return removeAcentos(text.toLowerCase());
            }
        });
    }
}
export function fullnameAtribuicao() {
    var tableProc = $('#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado');
        tableProc.find('a[href*="controlador.php?acao=procedimento_atribuicao_listar"]').each(function(){
            var nomeCompleto = getAtribuicaoDisplayLabel($(this).attr('title'), $(this).text(), true);
            if (nomeCompleto) $(this).text(nomeCompleto);
        });
}
export function getAtribuicaoDisplayLabel(rawText, fallbackText = '', preferFullName = false) {
    var text = String(rawText || fallbackText || '')
        .replace(/^Atribu[ií]do para\s*/i, '')
        .trim();

    if (!text) {
        return '';
    }

    var parts = text.split(/\s-\s/).map(function(part) {
        return String(part || '').trim();
    }).filter(function(part) {
        return part !== '';
    });

    if (parts.length > 1) {
        var aliasPart = parts.filter(function(part) {
            return part.indexOf('.') !== -1 && part.indexOf(' ') === -1;
        })[0] || '';
        var namePart = parts.filter(function(part) {
            return part.indexOf(' ') !== -1;
        })[0] || '';

        if (preferFullName && namePart) {
            return namePart;
        }
        if (!preferFullName && aliasPart) {
            return aliasPart;
        }
        return namePart || aliasPart || parts[0];
    }

    return text;
}
// Feature "Marcar como Não Visualizado" (config marcar_naolido) migrada para
// src/features/nao-lido/ (io.js: serializeSeiForm/getSeiHtml/postSeiForm; view.js:
// setProcessoNaoLidoLoading/getSelectedProcessoNaoLido/failProcessoNaoLido/
// marcarUmProcessoNaoLido/marcarProcessoNaoLido). Globais preservados via aliasGlobal
// no bundle (js/sei-pro-nao-lido.js). isAjaxRedirectAction vive em src/sei/urls.js — Fase 6.
export function updateDadosArvoreMult(nameLink, values, idProcedimento, callback = false) {
    if (typeof idProcedimento !== 'undefined' && idProcedimento != '' && idProcedimento !== null && idProcedimento != 0 && !checkProcessoSigiloso()) {
        if ($('#ifrArvore').length == 0) {
            if ( $('#frmCheckerProcessoPro').length == 0 ) { getCheckerProcessoPro(); }
            var url = 'controlador.php?acao=procedimento_trabalhar&id_procedimento='+idProcedimento;
            $('#frmCheckerProcessoPro').attr('src', url).unbind().on('load', function(){
                var ifrArvore = $('#frmCheckerProcessoPro').contents().find('#ifrArvore');
                updateDadosArvoreMultIframe(nameLink, values, ifrArvore, callback);
            });
        } else {
            var ifrArvore = $('#ifrArvore');
            updateDadosArvoreMultIframe(nameLink, values, ifrArvore, callback);
        }
    } else {
        return false;
    }
}
export function updateDadosArvoreMultIframe(nameLink, values, ifrArvore, callback) {
    if ( $('#frmCheckerProcessoPro').length == 0 ) { getCheckerProcessoPro(); }
    var url = getTreeLinkUrlByName(nameLink);
    if (typeof url !== 'undefined' && url != '') {
        $('#frmCheckerProcessoPro').attr('src', url).unbind().on('load', function(){
            var iframe = $(this).contents();

            function setValuesFrame(idElement, value) {
                var element = iframe.find('#'+idElement);
                if (element.is('select') && !hasNumber(value)) {
                    element.find('option:contains("'+value+'")').prop('selected',true);
                } else {
                    if (element.is(':radio') || element.is(':checkbox')) {
                        element.prop('checked',true).trigger('change');
                        if (idElement == 'optRestrito' || idElement == 'optSigiloso') {
                            iframe.find('#selHipoteseLegal').after('<input id="selHipoteseLegal" value="'+value+'" name="selHipoteseLegal"></input>').remove();
                        }
                    } else {
                        element.val(value);
                        var nameElement = (idElement.indexOf('sel') !== -1) ? idElement.replace('sel','') : false;
                        if ( nameElement && iframe.find('#hdnId'+nameElement).length > 0 ) {
                            iframe.find('#hdnId'+nameElement).val(value);
                        }
                    }
                }
            }

            $.each(values, function(i, v){
                setValuesFrame(v.element, v.value);
            });
            
            $(this).unbind();
            if (iframe.find('button[type="submit"]').length > 0) {
                iframe.find('button[type="submit"]').trigger('click');
            } else {
                iframe.find('button[name="btnSalvar"]').trigger('click');
            }
            if (typeof callback === 'function') callback();
        });
    } else {
        return false;
    }
}
export function automaticActions(type, mode, value = false, callback = false) {
    var id_procedimento = getParamsUrlPro(window.location.href).id_procedimento;
        id_procedimento = (typeof id_procedimento === 'undefined') ? getParamsUrlPro(window.location.href).id_protocolo : id_procedimento;
        id_procedimento = (typeof id_procedimento === 'undefined') ? getParamsUrlPro($('#ifrArvore').attr('src')).id_procedimento : id_procedimento;
    if (type == 'anotacao' && mode == 'remove') {
        updateDadosArvore('Anota\u00E7\u00F5es', 'txaDescricao', '', id_procedimento, callback);
    } else if (type == 'atribuicao' && mode == 'remove') {
        updateDadosArvoreMult('Atribuir Processo', [{element: 'selAtribuicao', value: 'null'}], id_procedimento, callback);
        console.log('Atribuir Processo', 'selAtribuicao', 'null', id_procedimento, callback);
    } else if (type == 'urgencia_processo') {
        updateDadosArvore('Atualizar Andamento', 'txaDescricao', (mode == 'remove' ? 'Removida' : 'Adicionada')+' marca de urg\u00EAncia no processo', id_procedimento, callback);
    } else if (type == 'urgencia_documento') {
        console.log(type, mode, value);
        updateDadosArvore('Atualizar Andamento', 'txaDescricao', (mode == 'remove' ? 'Removida' : 'Adicionada')+' marca de urg\u00EAncia no documento '+value, id_procedimento, callback);
    } else if (type == 'marcador' && mode == 'remove') {
        getRemoverMarcador(false);
    }
}
export function getActionsOnSendProcess() {
    var ifrVisualizacao = $($ifrVisualizacao).contents();
    ifrVisualizacao.find('#frmAtividadeListar').on('submit', function() {
        var _this = $(this);
        var _parent = _this.closest('body');
        var checkMarcador = _parent.find('#chkSinRemoverMarcadores').is(':checked');
        var checkAtribuicao = _parent.find('#chkSinRemoverAtribuicao').is(':checked');

        var sendAutomaticActions = [];
            sendAutomaticActions[0] = {name: 'marcador', method: 'remove', send: checkMarcador, value: false, run: false, index: 0};
            sendAutomaticActions[1] = {name: 'atribuicao', method: 'remove', send: checkAtribuicao, value: false, run: false, index: 1};
            parent.window.sendAutomaticActions = sendAutomaticActions;
            getAutomaticActions();
    });
    htmlBoxActions =    '<span id="divSinRemoveAttributes" style="margin: 0 10px;display: inline-block;">'+
                        '   <span style="margin: 0 10px;display: inline-block;">'+
                        (SeiPro.sei.adapter.isNewSEI() ? 
                        '      <div class="infraCheckboxDiv "><input type="checkbox" id="chkSinRemoverMarcadores" name="chkSinRemoverMarcadores" class="infraCheckboxInput" tabindex="509"><label class="infraCheckboxLabel " for="chkSinRemoverMarcadores"></label></div>' : 
                        '      <input type="checkbox" id="chkSinRemoverMarcadores" name="chkSinRemoverMarcadores" class="infraCheckbox" tabindex="0">'
                        )+
                        '     <label id="lblSinRemoverMarcadores" for="chkSinRemoverMarcadores" accesskey="" class="infraLabelCheckbox">Remover marcadores</label>'+
                        '   </span>'+
                        '   <span style="margin: 0 10px;display: inline-block;">'+
                        (SeiPro.sei.adapter.isNewSEI() ? 
                        '      <div class="infraCheckboxDiv "><input type="checkbox" id="chkSinRemoverAtribuicao" name="chkSinRemoverAtribuicao" class="infraCheckboxInput" tabindex="509"><label class="infraCheckboxLabel " for="chkSinRemoverAtribuicao"></label></div>' : 
                        '      <input type="checkbox" id="chkSinRemoverAtribuicao" name="chkSinRemoverAtribuicao" class="infraCheckbox" tabindex="0">'
                        )+
                        '     <label id="lblSinRemoverAtribuicao" for="chkSinRemoverAtribuicao" accesskey="" class="infraLabelCheckbox">Remover atribui\u00E7\u00E3o</label>'+
                        '   </span>'+
                        '</span>';
    ifrVisualizacao.find('#divSinRemoveAttributes').remove();
    ifrVisualizacao.find('#divSinRemoverAnotacoes').append(htmlBoxActions);

    if (checkConfigValue('naoassinados') && $('div.ui-dialog[aria-describedby="dialogBoxPro"]').length == 0) {
        initCheckNaoAssinados();
    }
    ifrVisualizacao.find('#txtUnidade').on('blur', function(){
        ifrVisualizacao.find('#selUnidades').attr('size', ifrVisualizacao.find('#selUnidades option').length);
    }).on('keypress', function(){
        ifrVisualizacao.find('#selUnidades').attr('size', ifrVisualizacao.find('#selUnidades option').length);
    });

    var hdnUnidades = ifrVisualizacao.find('#hdnUnidades');
    if (interessadosSendPro && interessadosSendPro.length && hdnUnidades.val() == '') {
        $.each(interessadosSendPro, function(i,v){
            var hdnInteressadosProcedimento = v.id+'\u00B1'+v.descricao;
                hdnInteressadosProcedimento = hdnUnidades.val() != '' ? hdnUnidades.val()+'\u00A5'+hdnInteressadosProcedimento : hdnInteressadosProcedimento;
            ifrVisualizacao.find('#hdnUnidades').val(hdnInteressadosProcedimento);
            ifrVisualizacao.find('#selUnidades').append('<option value="'+v.id+'">'+v.descricao+'</option>');
        });
        ifrVisualizacao.find('#selUnidades option').prop('selected',true);
    }
}
export function getFaviconNrProcesso() {
    setTimeout(() => {
        var nrProcNVisualizados = $('a.processoNaoVisualizado').length;
        if (nrProcNVisualizados > 0) {
            window.favicon = new Favico({
                animation : 'none'
            });
            favicon.badge(nrProcNVisualizados);
            
            if (SeiPro.sei.adapter.isNewSEI()) {
                setTimeout(() => {
                    var icon = $('link[rel="shortcut icon"]').attr('href');
                    $('link[rel="icon"]').attr('href',icon);
                }, 500);
            }
        }
    }, 1000);
}
export function getAutomaticActions() {
    var arrayAutomatic = parent.window.sendAutomaticActions;
    if (typeof arrayAutomatic !== 'undefined' && arrayAutomatic !== null && arrayAutomatic.length > 0) {
        var nextRun = jmespath.search(arrayAutomatic, "[?run==`false`] | [0]");
            nextRun = (nextRun !== null) ? nextRun : false;
            if (nextRun) {
                if (nextRun.send) {
                    automaticActions(nextRun.name, nextRun.method, nextRun.value, function(){
                        parent.window.sendAutomaticActions[nextRun.index].run = true;
                        setTimeout(function(){ 
                            // console.log(nextRun);
                            getAutomaticActions();
                        }, 1000);
                    });
                }
            } else {
                parent.window.sendAutomaticActions === undefined;
            }
    }
}
export function getListaGruposAcompEsp(html) {
    var indexSelected = 0;
    var selectGroup = html.find('#selGrupoAcompanhamento').find('option').map(function(i, v){ 
                        if ($(this).is(':selected')) indexSelected = i-1;
                        if ($(this).text().trim() != '') { 
                            return {name: $(this).text().trim(), value: $(this).val() } 
                        } 
                    }).get();
        if (selectGroup.length > 0) {
            setOptionsPro('listaGruposAcompEsp',selectGroup);
            setOptionsPro('listaGruposAcompEsp_unidade',idUnidade);
        }
    return {array: selectGroup, indexSelected: indexSelected};
}
// INICIA O REDIMENSIONAMENTO AUTOMATICO DE IMAGENS NO VISUALIZADOR DE DOCUMENTOS
