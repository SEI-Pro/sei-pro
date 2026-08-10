// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/**
 * Sei Functions Pro — interessados, forms, compare docs.
 * (ponte temporária: jQuery/DOM legado; fatia do antigo body.js)
 */
import {
    alertaBoxPro,
    getContentDocSEI,
    getLinksProcessoAjax,
    getTreeLinkUrlByName,
    getUrlNewDocArvore,
    initChosenReplace,
    resetDialogBoxPro,
    setNewDoc,
    updateButtonConfirm,
    updateDadosProcesso
} from '../../shared/sei-runtime/deps.js';

export function getInteressadosProcesso(txtInteressado, callback) {
    if (typeof window.linkPesquisaInteressado !== 'undefined') {
        getInteressadosProcessoAjax(window.linkPesquisaInteressado, txtInteressado, callback);
    } else {
        var id_procedimento = getParamsUrlPro($('#frmCheckerProcessoPro').attr('src'));
            id_procedimento = typeof id_procedimento !== 'undefined' && id_procedimento !== null && id_procedimento && typeof id_procedimento.id_procedimento !== 'undefined' ? id_procedimento.id_procedimento : false;
        if (id_procedimento) {
            getLinksProcessoAjax(id_procedimento, function(arrayLinksArvore) {
                var urlAlterarProc = getTreeLinkUrlByName('Enviar Processo', {treeModel: {links: arrayLinksArvore}});
                if (urlAlterarProc !== null) {
                    $.ajax({ url: urlAlterarProc }).done(function (htmlDoc) {
                        var link = $.map(htmlDoc.split("\n"), function(v){
                                        if (v.indexOf('controlador_ajax.php?acao_ajax=unidade_auto_completar_envio_processo') !== -1) {
                                            return $.map(v.split("'"), function(substr, i) {
                                                return (i % 2 && substr.indexOf('controlador_ajax.php?acao_ajax=unidade_auto_completar_envio_processo') !== -1) ? substr : null;
                                            });
                                        }
                                    });
                            if (link.length) {
                                window.linkPesquisaInteressado = link[0];
                                getInteressadosProcessoAjax(linkPesquisaInteressado, txtInteressado, callback);
                            }
                    });
                }
            });
        }
    }
}
export function getInteressadosProcessoAjax(link, txtInteressado, callback) {
    $.ajax({
        type: "POST",
        url: link,
        dataType: 'text',
        data: {
            palavras_pesquisa: txtInteressado
        },
        success: function(result){
            var html_result = $(result.replace('<?xml version="1.0" encoding="iso-8859-1"?>','')).html();
            var id_result = $(html_result).map(function(){ return {id: $(this).attr('id'), descricao: $(this).attr('descricao')} }).get();
            // console.log(id_result);
            if (typeof callback === 'function') callback(id_result);
        }
    });
}
export function setInteressadosSend() {
    var ifrArvoreHtml = $($ifrVisualizacao).contents().find($ifrArvoreHtml);
    if (ifrArvoreHtml.length) {
        var interessados = ifrArvoreHtml.contents().find('.interessadoSeiPro').map(function(){
            return {id: $(this).data('id'), descricao: $(this).text()}
        }).get();
        if (interessados.length) {
            var arrayInter = [];
                interessados.filter(function(item){
                    var i = arrayInter.findIndex(x => (x.id == item.id && x.descricao == item.descricao));
                    if (i <= -1){
                        arrayInter.push(item);
                    }
                    return null;
                });
            interessadosSendPro = arrayInter;
            return arrayInter;
        }
    }
    return false;
}
export function extractDataFormulario(output = 'obj', allFields = false) {
    var ifrArvoreHtml = $($ifrVisualizacao).contents().find($ifrArvoreHtml).contents();
    var arrayData = ifrArvoreHtml.find('#conteudo').html().split('\n');
    var nr_sei = ifrArvoreHtml.find('#titulo label').text();
        nr_sei = (typeof nr_sei !== 'undefined' && nr_sei != '' && nr_sei.indexOf('-') !== -1) ? nr_sei.split('-')[nr_sei.split('-').length-1].trim() : false;
    var data_assinatura = ifrArvoreHtml.find('#assinaturas').text();
        data_assinatura = (typeof data_assinatura !== 'undefined' && data_assinatura != '') 
            ? data_assinatura.split('\n').map(function(txt) {
                    var reg = new RegExp('documento assinado eletronicamente', "i");
                    var p = false;
                    if (reg.test(txt)) { 
                        var date = txt.match(/(0[1-9]|[1-2][0-9]|3[0-1])\/(0[1-9]|1[0-2])\/[0-9]{4}/img);
                        var time = txt.match(/(\d{1,2}:\d{2})/img);
                        return (date !== null && time !== null) ? date[0]+' '+time[0] : false; 
                    }
                }).join('') 
            : false;
    var processo = $('#ifrArvore').contents().find(`a[target="${ifrVisualizacao_}"]`).eq(0).text().trim();
    var objOut = {};
    var arrayOut = [];
    var fieldsOut = [];
    var stringOut = '';
    var dataForm = arrayData.map(function(v, i){
        if (v.indexOf(':') !== -1 && v.indexOf('<b>') !== -1 ) {
            var name = removeAcentos($('<div>'+v+'</div>').text().trim()).toLowerCase();
                name = (name.indexOf(' (') !== -1) ? name.split('(')[0].trim() : name;
                name = extractOnlyAlphaNum(name).replace(/ /g, '_');
            var value = (typeof arrayData[i+1] !== 'undefined') ? $('<div>'+arrayData[i+1]+'</div>').text().trim() : null;
            objOut[name] = value;
            arrayOut.push({name: name, value: value});
            fieldsOut.push(name);
            stringOut += '#'+name+': '+value+'\n';
        }
    });
    if (allFields) {
        arrayOut.push({name: 'data_assinatura', value: data_assinatura});
        arrayOut.push({name: 'nr_sei', value: nr_sei});
        arrayOut.push({name: 'processo', value: processo});
        objOut[data_assinatura] = data_assinatura;
        objOut[nr_sei] = nr_sei;
        objOut[processo] = processo;
        stringOut += '#data_assinatura: '+data_assinatura+'\n';
        stringOut += '#nr_sei: '+nr_sei+'\n';
        stringOut += '#processo: '+processo+'\n';
    }
    return (output == 'obj') 
            ? objOut 
            : (output == 'array') 
                ? arrayOut
                : (output == 'fields') 
                    ? fieldsOut
                    : stringOut;
}
export function decodeHtml(html) {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}
export function initDialogCompareDocs(TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    if (typeof $().chosen !== 'undefined') {
        parent.openDialogCompareDocs();
    } else {
        if (TimeOut == 9000 && typeof $().chosen === 'undefined' && typeof URL_SPRO !== 'undefined') $.getScript(URL_SPRO+"js/lib/chosen.jquery.min.js");
        setTimeout(function(){ 
            parent.initDialogCompareDocs(TimeOut - 100); 
            if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage'))console.log('Reload initDialogCompareDocs => '+TimeOut); 
        }, 500);
    }
}
export function invertCompareDoc(this_) {
    $(this_).toggleClass('newLink_confirm');
    $('#docLoteSelect').trigger('change');
}
export function openDialogCompareDocs() {
    var elemRef1 = $('#ifrArvore').contents().find('#content .infraArvoreNoSelecionado');
    var docRef1 = elemRef1.text().trim();
        docRef1 = docRef1 == '' ? '<span style="color:#FF0000;"><i class="fas fa-exclamation-triangle vermelhoColor" style="margin-right: 5px;"></i> Nenhum documento selecionado na \u00E1rvore do processo</span>' : docRef1;
    var idRef = elemRef1.length ? parseInt(elemRef1.attr('id').replace('span','')) : false;
    const urlNewDoc = getUrlNewDocArvore();
    if (!urlNewDoc) {
        flagError = true;
        alertaBoxPro('Error', 'exclamation-triangle', 'Erro ao localizar o link de inserir documento. Verifique se o processo encontra-se aberto em sua unidade!');
    } else {
        var htmlBox =   '   <table style="font-size: 10pt;width: 100%;" class="seiProForm">'+
                        '      <tr>'+
                        '          <td style="vertical-align: top;text-align: left;height: 40px;" class="label">'+
                        '               <label for="docLoteSelect"><i class="iconPopup iconSwitch fas fa-file-alt cinzaColor"></i> <strong>A</strong>: '+docRef1+'</label>'+
                        '           </td>'+
                        '      </tr>'+
                        '      <tr>'+
                        '          <td style="vertical-align: top;text-align: left;height: 40px;" class="label">'+
                        '               <label for="docLoteSelect"><i class="iconPopup iconSwitch fas fa-file-alt cinzaColor"></i> <strong>B</strong>: Selecione abaixo o documento para compara\u00E7\u00E3o:</label>'+
                        '               <a class="newLink newLink_active invertCompareDoc" onclick="invertCompareDoc(this)" style="float: right;font-size: 10pt;"><i class="fas fa-exchange-alt"></i>Inverter (A/B \u2192 B/A)</a>'+
                        '           </td>'+
                        '      </tr>'+
                        '      <tr>'+
                        '           <td class="required">'+
                        '               <select id="docLoteSelect" onchange="getCompareDocs(this)"><option><i class="fas fa-sync fa-spin cinzaColor"></i> carregando dados... </option></select>'+
                        '           </td>'+
                        '      </tr>'+
                        '  </table>';
                        
        resetDialogBoxPro('dialogBoxPro');
        dialogBoxPro = $('#dialogBoxPro')
            .html('<div id="dialogBoxDocLote" class="dialogBoxDiv">'+htmlBox+'<div class="iframeBoxDiv" style="display:none;width: 100%; height: calc(100vh - 320px); margin: 0;"><iframe src="about:blank" frameborder="0" height="100%" width="100%"></iframe></div></div>')
            .dialog({
                title: 'Comparar Documentos',
                width: 950,
                // height: $(window).height()-80,
                open: function() { 
                    $("#btnSelecaoDoc").prop('disabled', true).addClass('ui-button-disabled ui-state-disabled');
                    $('#docLoteSelect').chosen({
                        placeholder_text_single: ' ', 
                        no_results_text: 'Nenhum resultado encontrado',
                        normalize_search_text: function(text) {
                            return removeAcentos(text.toLowerCase());
                        }
                    })
                    $('#docLoteSelect_chosen').addClass('chosenLoading');
                    docsLote_getDocsArvore(true, idRef);
                    $(":button:not(.ui-dialog-titlebar-close)").prop("disabled", true).addClass("ui-state-disabled");
                },
                buttons: [{
                    text: 'Baixar',
                    icon: 'ui-icon-disk',
                    click: function(event) {
                        var docRef2 = $('#docLoteSelect option:selected').text();
                        var nameFile = 'Comparativo '+docRef1+' - '+docRef2+' ('+NAMESPACE_SPRO+')';
                        var iframeBoxDiv = $('.iframeBoxDiv iframe').contents();
                        var contentDocument = '<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">';
                            contentDocument += iframeBoxDiv.find('html')[0].outerHTML;
                        var downloadLink = document.createElement("a");
                        var blob = new Blob(["\ufeff", contentDocument]);
                        var url = URL.createObjectURL(blob);
                        downloadLink.href = url;
                        downloadLink.download = nameFile+'.html';
                        document.body.appendChild(downloadLink);
                        downloadLink.click();
                        document.body.removeChild(downloadLink);
                    }
                },{
                    text: 'Criar Novo Documento',
                    icon: 'ui-icon-extlink',
                    click: function(event) {
                        var iframeBoxDiv = $('.iframeBoxDiv iframe').contents();
                        var contentDocument = '<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">';
                            contentDocument += iframeBoxDiv.find('html')[0].outerHTML;
                        getNewDocCompareDocs(contentDocument);
                    }
                }]
            });
    }
}
export function getNewDocCompareDocs(contentDocument) {
    var tiposDocumentos = typeof dadosProcessoPro !== 'undefined' && typeof dadosProcessoPro.tiposDocumentos !== 'undefined' && dadosProcessoPro.tiposDocumentos.length ? $.map(dadosProcessoPro.tiposDocumentos, function(v){ return '<option value="'+v.id+'">'+v.name+'</option>' }).join('') : false;
    var htmlBox =   '   <table style="font-size: 10pt;width: 100%;" class="seiProForm">'+
                    '      <tr>'+
                    '          <td style="vertical-align: top;text-align: left;height: 40px;" class="label">'+
                    '               <label for="docTipoSelect"><i class="iconPopup iconSwitch fas fa-file-alt cinzaColor"></i> Selecione o tipo de documento que deseja criar:</label>'+
                    '           </td>'+
                    '      </tr>'+
                    '      <tr>'+
                    '           <td class="required">'+
                    '               <select id="docTipoSelect"><option value="">&nbsp;</option>'+tiposDocumentos+'</select>'+
                    '           </td>'+
                    '      </tr>'+
                    '  </table>';

    resetDialogBoxPro('dialogBoxPro');
    dialogBoxPro = $('#dialogBoxPro')
        .html('<div class="dialogBoxDiv"> '+htmlBox+'</span>')
        .dialog({
            width: 450,
            title: 'Criar novo documento comparado',
        	open: function(){
                updateButtonConfirm(this, true);
                initChosenReplace('box_init', this, true);
            },
            buttons: [{
                text: 'Criar Novo Documento',
                icon: 'ui-icon-extlink',
                click: function(event) {
                    var id_tipo_documento = $('#docTipoSelect').val();
                    var id_procedimento = getParamsUrlPro(window.location.href).id_procedimento;
                        id_procedimento = (typeof id_procedimento === 'undefined') ? getParamsUrlPro($('#ifrArvore').attr('src')).id_procedimento : id_procedimento;
                        sessionStorageStorePro('dadosDocAutomatico',contentDocument);
                        sessionStorageStorePro('nomeDocAutomatico',$('#docTipoSelect option:selected').text());
                        setNewDoc(id_procedimento, id_tipo_documento, true);
                        resetDialogBoxPro('dialogBoxPro');
                        alertaBoxPro('Sucess', 'sync fa-spin', 'Aguarde... Gerando documento comparado');
                }
            }]
        });
}
export function getCompareDocs(this_) {
    var _this = $(this_);
    var id_procedimento = getParamsUrlPro(window.location.href).id_procedimento;
        id_procedimento = (typeof id_procedimento === 'undefined') ? getParamsUrlPro($('#ifrArvore').attr('src')).id_procedimento : id_procedimento;
    var id_documento = _this.find('option:selected').data('id_documento');
    var param = {
        id_documento: id_documento,
        id_procedimento: id_procedimento
    }
    if (!!id_procedimento && !!id_documento) {
        dialogBoxPro.dialog('option','height', $(window).height()-80);
        var htmlLoad = '<html><head><link rel="stylesheet" type="text/css" datastyle="seipro-fonticon" href="'+URL_SPRO+'css/fontawesome.pro.min.css"></head><div style="text-align: center;font-size: 5em;padding-top: calc(50% - 2em);color: #ccc;"><i class="fas fa-sync fa-spin" style=""></i></div></html>';
        $('.iframeBoxDiv').show().find('iframe').contents().find('html').html(htmlLoad);
        $(":button:not(.ui-dialog-titlebar-close)").prop("disabled", true).addClass("ui-state-disabled");

        getContentDocSEI(param, function(compareHTML) {
            var ifrArvoreHtml = $($ifrVisualizacao).contents().find($ifrArvoreHtml).contents();
            var originalHTML = ifrArvoreHtml.find('html').html();
                originalHTML = '<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">'+decodeHtml(originalHTML);
                compareHTML = decodeHtml(compareHTML);
            
            // Diff HTML strings
            var output = ($('.invertCompareDoc').hasClass('newLink_confirm')) ? htmldiff(compareHTML, originalHTML) : htmldiff(originalHTML, compareHTML);
                output = output.replace(/<del>/g, '<del style="background-color: #FFF0F5;color: #FF0000;">');
                output = output.replace(/<ins>/g, '<ins style="background-color: #F0F8FF;color: #0000FF;">');
                
            // Remove imagens duplicadas
            setTimeout(() => {
                var srcs = [],
                    temp;
                $('.iframeBoxDiv iframe').contents().find("img").filter(function(){
                    temp = $(this).attr("src");
                    if ($.inArray(temp, srcs) < 0){
                        srcs.push(temp);   
                        return false;
                    }
                    return true;
                }).remove();
                $('.iframeBoxDiv iframe').contents().find("[onclick]").each(function(){ $(this).removeAttr('onclick')});
            }, 200);
            
            $('.iframeBoxDiv iframe').contents().find('html').html(output);
            $(":button:not(.ui-dialog-titlebar-close)").prop("disabled", false).removeClass("ui-state-disabled");
            if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage'))console.log({originalHTML:originalHTML, compareHTML:compareHTML});
        });
    }
}
export function openCamposDinamicosForm() {
    var arrayNewDynamicField = extractDataFormulario('array');
    var htmlBox =   '<table class="tableInfo tableZebra" style="font-size: 10pt;width: 100%;">'+
                    '   <thead>'+
                    '        <tr>'+
                    '            <th style="padding: 8px; background: #f3f3f3; font-weight: bold; border-top: 1px solid #b9b9b9;">Nome do campo din\u00E2mico</th>'+
                    '            <th style="padding: 8px; background: #f3f3f3; font-weight: bold; border-top: 1px solid #b9b9b9;">Valor</th>'+
                    '        </tr>'+
                    '   </thead>'+
                    '   <tbody>';
    arrayNewDynamicField.map(function(v, i){
        htmlBox +=  '       <tr>'+
                    '          <td><span style="font-weight: bold;background: #e4e4e4; padding: 2px 5px; border-radius: 5px;">#'+v.name+'</span></td>'+
                    '          <td><span style="background: #e4e4e4; padding: 2px 5px; border-radius: 5px;">'+v.value+'</span></td>'+
                    '       </tr>';
                    '   </tbody>';
    });
    htmlBox += '</table>';
    resetDialogBoxPro('dialogBoxPro');
    dialogBoxPro = $('#dialogBoxPro')
        .html('<div class="dialogBoxDiv"> '+htmlBox+'</div>')
        .dialog({
            title: "Adicionar campos din\u00E2micos",
        	width: 600,
        	buttons: [{
                text: "Adicionar",
                click: function() { 
                    var stringNewDynamicField = extractDataFormulario('string');
                    var txaObservacoes = (typeof dadosProcessoPro.propProcesso.txaObservacoes !== 'undefined') ? jmespath.search(dadosProcessoPro.propProcesso.txaObservacoes, "[?unidade=='"+siglaUnidadeAtual+"'].observacao | [0]") : null;
                    var txtObsDynamicField = (txaObservacoes !== null) ? stringNewDynamicField+txaObservacoes : txtObsDynamicField;
                    console.log(txtObsDynamicField);
                    if (txtObsDynamicField && txtObsDynamicField != '') {
                        updateDadosProcesso('txaObservacoes', txtObsDynamicField, function(){
                            alertaBoxPro('Sucess', 'check-circle', 'Campos din\u00E2micos adicionados com sucesso!');
                        });
                    }
                    resetDialogBoxPro('dialogBoxPro');
                }
            }]
    });
}
// editDadosArvorePro / editDadosArvorePro_ / editDadosArvorePro_AcompEsp removidos na
// Etapa E (reconciliação infoarvore): diálogo de edição legado (jQuery UI + chosen) do
// painel da árvore, substituído pelos editores inline em src/features/arvore-info/.
