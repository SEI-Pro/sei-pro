// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/**
 * Sei Functions Pro — image / zip / video viewers.
 * (ponte temporária: jQuery/DOM legado; fatia do antigo body.js)
 */
import {
    getAutomaticActions,
    getCitacaoDoc,
    getListDocumentosArvore,
    getTreeDocumentsSession,
    getTreeLinkUrlByName,
    getTreeLinksAllSession,
    mergeAllAndamentosProcesso,
    pullDadosProcessoSession,
    resetDialogBoxPro,
    scrollToElement,
    setSessionProcessosPro
} from '../../shared/sei-runtime/deps.js';

export function initDocImagemPro() {
    var ifrVisualizacao = $($ifrVisualizacao).contents(); // seleciona o conteudo do iframe de visualizacao de documentos
    var ifrArvore = $('#ifrArvore').contents(); // seleciona o conteudo do iframe de arvore do processo

    var docSelected = ifrArvore.find('.infraArvoreNoSelecionado'); // seleciona o documento ativo na arvore
    var protocoloSelected = getParamsUrlPro(docSelected.closest('a').attr('href')).id_documento; // seleciona o protocolo do documento ativo na arvore e extrai o seu id de documento
    if (typeof protocoloSelected !== 'undefined') { // checa se o documento ativo possui um id de documento valido
        var iconSelected = ifrArvore.find('#anchorImg'+protocoloSelected).find('img').attr('src'); // encontra o icone do documento ativo na arvore correspondente ao id de documento
        if (iconSelected.indexOf('imagem') !== -1) { // checa se o icone do documento ativo na arvore é do tipo imagem
            checkDocImagemPro(ifrVisualizacao); // aciona a funcao de redimensionar a imagem no visualizador de documentos
        }
    }
}
export function initCheckNaoAssinados() {
    var _ifrArvore = $('#ifrArvore');
    var ifrArvore = _ifrArvore.contents();
    var urlAllPasta = ifrArvore.find('#topmenu a[id*="anchorAP"]').attr('href');
    var ifrVisualizacao = $($ifrVisualizacao).contents();
        ifrVisualizacao.find('#checkNaoAssinados').remove();
    var htmlLoading =   '<div id="checkNaoAssinados">'+
                        '   <i class="fas fa-sync fa-spin" style="color:#444;margin-right: 5px;"></i> Verificando documentos n\u00E3o assinados na unidade <strong style="text-decoration: underline;">'+siglaUnidadeAtual+'</strong>'+
                        '   </div>';
    var htmlSucess =    '<div id="checkNaoAssinados" style="background: #fff1f0">'+
                        '   <i class="fas fa-times-circle vermelhoColor" style="margin-right: 5px;"></i> Existem documentos n\u00E3o assinados na unidade <strong style="text-decoration: underline;">'+siglaUnidadeAtual+'</strong>'+
                        '   <a class="newLink" onclick="parent.openCheckNaoAssinados()" style="margin: 0 10px;font-size: 1em;">Detalhes</a>'+
                        '</div>';
    var htmlEmpty =     '<div id="checkNaoAssinados">'+
                        '   <i class="fas fa-check-circle verdeColor" style="margin-right: 5px;"></i> Todos os documentos foram assinados na unidade <strong style="text-decoration: underline;">'+siglaUnidadeAtual+'</strong>'+
                        '</div>';
    var htmlNull =      '<div id="checkNaoAssinados">'+
                        '   <i class="fas fa-exclamation-triangle laranjaColor" style="margin-right: 5px;"></i> N\u00E3o foi poss\u00EDvel verificar a exist\u00EAncia de documentos n\u00E3o assinados na unidade <strong style="text-decoration: underline;">'+siglaUnidadeAtual+'</strong>'+
                        '   <a class="newLink" onclick="parent.initCheckNaoAssinados()" style="margin: 0 10px;font-size: 1em;">Tentar novamente</a>'+
                        '</div>';    

    var htmlCheckNaoAssinados = htmlLoading;

        ifrVisualizacao.find('#divInfraBarraLocalizacao').append(htmlCheckNaoAssinados);
        mergeAllAndamentosProcesso(function(){
            var dadosProcesso = pullDadosProcessoSession();
            var listDocumentos = getTreeDocumentsSession(dadosProcesso);
            if (typeof listDocumentos !== 'undefined' && listDocumentos.length > 0 && checkObjHasProperty(listDocumentos, 'unidade')) {
                var listNaoAssinado = jmespath.search(listDocumentos, "[?assinado==`false`] | [?unidade=='"+siglaUnidadeAtual+"'] | [?nativo]");
                if (listNaoAssinado.length == 0) {
                    htmlCheckNaoAssinados = htmlEmpty;
                } else if (listNaoAssinado.length > 0) {
                    htmlCheckNaoAssinados = htmlSucess;
                    openCheckNaoAssinados();
                } else if (listNaoAssinado == null) {
                    htmlCheckNaoAssinados = htmlNull;    
                }
                ifrVisualizacao.find('#checkNaoAssinados').remove();
                ifrVisualizacao.find('#divInfraBarraLocalizacao').append(htmlCheckNaoAssinados);

                if (listNaoAssinado.length == 0) {
                    ifrVisualizacao.find('#txtUnidade').focus();
                }
                // console.log(listNaoAssinado, listDocumentos);
            } else if (typeof listDocumentos !== 'undefined' && typeof urlAllPasta !== 'undefined' && urlAllPasta !== '') {
                /* _ifrArvore.attr('src', urlAllPasta).unbind().on('load', function(){
                    $(this).unbind();
                    getListDocumentosArvore(ifrArvore);
                    initCheckNaoAssinados();
                }); */
                getListDocumentosArvore(ifrArvore);
                initCheckNaoAssinados();
            }
            console.log('listNaoAssinado',listNaoAssinado, listDocumentos);
        });
        setTimeout(function(){
            if (ifrVisualizacao.find('#checkNaoAssinados').hasClass('loadingNaoAssinados')) {
                htmlCheckNaoAssinados = htmlNull;
                ifrVisualizacao.find('#checkNaoAssinados').remove();
                ifrVisualizacao.find('#divInfraBarraLocalizacao').append(htmlCheckNaoAssinados);   
                if (pullDadosProcessoSession()) {
                    dadosProcessoPro = pullDadosProcessoSession();
                }
            }
        }, 12000);
}
export function openCheckNaoAssinados() {
    var _ifrArvore = $('#ifrArvore');
    var ifrArvore = _ifrArvore.contents();
    // var urlAllPasta = ifrArvore.find('#topmenu a[id*="anchorAP"]').attr('href');
    var urlAllPasta = '';
    if (typeof urlAllPasta !== 'undefined' && urlAllPasta !== '') {
        _ifrArvore.attr('src', urlAllPasta).unbind().on('load', function(){
            $(this).unbind();
            boxCheckNaoAssinados();
        });
    } else {
        boxCheckNaoAssinados();
    }
}
export function boxCheckNaoAssinados() {
    var dadosProcesso = pullDadosProcessoSession();
    var listDocumentos = getTreeDocumentsSession(dadosProcesso);
    var listNaoAssinado = jmespath.search(listDocumentos, "[?assinado==`false`] | [?unidade=='"+siglaUnidadeAtual+"'] | [?nativo]");
    var htmlBox =   '<div style="font-size: 10pt;display: block;color: #444;margin: 10px 0;padding: 5px;background: #fff1f0;border-radius: 5px;">'+
                    '   <i class="fas fa-times-circle vermelhoColor" style="margin-right: 5px;"></i> Existem documentos n\u00E3o assinados na unidade <strong style="text-decoration: underline;">'+siglaUnidadeAtual+'</strong>'+
                    '</div>'+
                    '<div style="max-height: 280px;overflow-y: scroll;padding: 10px 0;">';
        $.each(listNaoAssinado, function(index, value) {
            htmlBox +=    '<div style="margin: 15px 0">'+
                            '   <a class="newLink" onclick="getDocOnArvore('+value.id_protocolo+')" style="display: initial;font-size: 10pt;"><i class="far fa-file azulColor" style="margin-right: 5px;"></i>'+value.documento+' ('+value.nr_sei+')</a>'+
                            '   <span style="float: right;font-size: 10pt;">'+(value.data_documento && value.data_documento !== '' ? getDatesPreview({date: value.data_documento}) : '')+'</span>'+
                            '</div>';
        });
        htmlBox += '</div>';

    resetDialogBoxPro('dialogBoxPro');
    dialogBoxPro = $('#dialogBoxPro')
        .html('<div class="dialogBoxDiv">'+htmlBox+'</div>')
        .dialog({
            title: 'Documentos pendentes de assinatura',
            width: 700,
            open: function() { 
                var ifrArvore = $('#ifrArvore');
                var href = getTreeLinkUrlByName('Enviar Processo');
                if (href !== null) {
                    setTimeout(function(){ 
                        document.getElementById(ifrVisualizacao_).setAttribute("src",href[0]);
                    }, 500);
                }
            },
            close: function() { 
                $('#dialogBoxDiv').remove();
                resetDialogBoxPro('dialogBoxPro');
            }
    });
}
export function getDocOnArvore(id_documento) {
    var _ifrArvore = $('#ifrArvore');
    var _ifrVisualizacao = $($ifrVisualizacao);
    var ifrArvore = _ifrArvore.contents();
    
    var linkDoc = ifrArvore.find('#anchor'+id_documento);
    var urlDoc = linkDoc.attr('href');
    if (typeof urlDoc !== 'undefined') {
        _ifrVisualizacao.attr('src', urlDoc);
        linkDoc.unbind('click').trigger('click');
        scrollToElement(ifrArvore.find('#container'), linkDoc, 10);
    }
}
// VERIFICA SE A IMAGEM A SER REDIMENSIONADA FOI CARREGADA
export function checkDocImagemPro(ifrVisualizacao, TimeOut = 9000) {
    var imgDoc = ifrVisualizacao.find($ifrArvoreHtml).contents().find('img'); // localiza a imagem dentro do iframe do conteudo do documento
    if (TimeOut <= 0) { return; } // retorna se o tempo de checagem for expirado
    if (imgDoc.length > 0) {  // verifica se a imagem existe
        setTimeout(function(){ // delay para carregamento da imagem
            ifrVisualizacao.find($ifrArvoreHtml).contents().find('img')
                .eq(0) // encontra a primeira imagem do documento
                .addClass('zoomInPro') // aplica a classe de zoom
                .css({'width': '100%', 'cursor': 'zoom-in'}) // aplica o estilo de redimensionamento total da tela e o cursor de Lupa(+)
                .attr('onclick','parent.parent.zoomImagemPro(this)'); //adiciona acao de ativar ou desativar o zoom
            console.log('initDocImagemPro');
        }, 500);
    } else { // caso nao encontrada a imagem, reinicia a funcao com o timeout decrescido
        setTimeout(function(){ 
            checkDocImagemPro(ifrVisualizacao, TimeOut - 100); 
            if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage'))console.log('Reload checkDocImagemPro'); 
        }, 500);
    }
}
// ATIVA OU DESATIVA O REDIMENSIONAMENTO DA IMAGEM
export function zoomImagemPro(this_) {
    var _this = $(this_); // converte a referencia em objeto jquery
    if (_this.hasClass('zoomInPro')) { // verifica se o elemento possui a classe de zoom
        _this.removeClass('zoomInPro').css({'width': '', 'cursor': 'zoom-out'}); // remove o estilo redimensionado e altera o cursor do mouse para Lupa(-)
    } else {
        _this.addClass('zoomInPro').css({'width': '100%', 'cursor': 'zoom-in'}); // adicionar o estilo redimensionado e altera o cursor do mouse para Lupa(+)
    }
}
export function initDocZipPro() {
    var ifrVisualizacao = $($ifrVisualizacao).contents();
    var ifrArvore = $('#ifrArvore').contents();

    var docSelected = ifrArvore.find('.infraArvoreNoSelecionado');
    var protocoloSelected = getParamsUrlPro(docSelected.closest('a').attr('href')).id_documento;
    if (typeof protocoloSelected !== 'undefined') {
        var iconSelected = ifrArvore.find('#anchorImg'+protocoloSelected).find('img').attr('src');
        var linkFile = ifrVisualizacao.find(divInformacao+' '+ancoraArvoreDownload).attr('href');
        if (iconSelected.indexOf('zip') !== -1) {
            checkDocZipPro(ifrVisualizacao);
        }
    }
}
export function checkDocZipPro(ifrVisualizacao, TimeOut = 9000) {
    var linkFile = ifrVisualizacao.find(divInformacao+' '+ancoraArvoreDownload).attr('href');
    if (TimeOut <= 0) { return; }
    if (typeof linkFile !== 'undefined') { 
            loadDocZipPro(linkFile, ifrVisualizacao);
    } else {
        setTimeout(function(){ 
            checkDocZipPro(ifrVisualizacao, TimeOut - 100); 
            if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage'))console.log('Reload checkDocZipPro'); 
        }, 500);
    }
}
export function loadDocZipPro(linkFile, ifrVisualizacao) {
    var divVideo =  '<div id="divZip">'+
                    '   <div class="explorer">'+
                    '      <div class="directories">'+
                    '          <div id="tree" class="tree"></div>'+
                    '      </div>'+
                    '      <div id="separator" draggable="false"></div>'+
                    '      <div class="files">'+
                    '          <ul id="listing" class="listing"><div class="loading"><i class="fas fa-spin fa-spinner"></i></div></ul>'+
                    '      </div>'+
                    '   </div>'+
                    '</div>';
    ifrVisualizacao.find('#divZip').remove();
    ifrVisualizacao.find(divInformacao).after(divVideo);

    if (typeof JSZipUtils !== 'undefined') {
        openDocZipPro(ifrVisualizacao);
    } else {
        $.getScript(URL_SPRO+'js/lib/jszip.min.js', function(){
            $.getScript(URL_SPRO+'js/lib/jszip-utils.min.js', function(){
                openDocZipPro(ifrVisualizacao);
            });
        }); 
    }
}
export function openDocZipPro(ifrVisualizacao) {
    var urlZip = ifrVisualizacao.find(ancoraArvoreDownload).attr('href');
        JSZipUtils.getBinaryContent(urlZip, function(err, data) {
            if(err) {
                throw err; // or handle err
            }
            JSZip.loadAsync(data).then(function (zip) {
                let i = 0;
                window.zip = [];
                ifrVisualizacao.find('#divZip .files #listing .loading').remove();
                zip.forEach(function (relativePath, zipEntry) {  // 2) print entries
                    var name = zipEntry.name;
                    var path = !zipEntry.dir && name.indexOf('/') !== -1 ? name.split('/') : false;
                        name = path ? '<span class="tab"></span>'.repeat(path.length)+path[path.length-1] : name;
                    var date = moment(zipEntry.date).format('DD/MM/YYYY HH:mm:ss');
                    var size = infraFormatarTamanhoBytes(zipEntry._data.uncompressedSize);
                        size = !zipEntry.dir ? size : '';
                    var click = zipEntry.dir ? '' : `onclick="parent.openFileZip(${i})"`;
                    ifrVisualizacao.find('#divZip .files #listing').append(`<li ${click}><a>${name}</a><span class="date">${date}</span><span class="size">${size}</span></li>`);
                    // console.log(relativePath, name, zipEntry);
                    window.zip[i] = zipEntry;
                    i++;
                });
            });
        });
}
export function openFileZip(i) {
    if (typeof window.zip !== 'undefined') {
        window.zip[i].async('blob').then(function(blob){ 
            var nameFile = window.zip[i].name;
            var downloadLink = document.createElement("a");
            var url = URL.createObjectURL(blob);
                downloadLink.href = url;
                downloadLink.download = nameFile;
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
        });
    }
}
export function getScriptIframe(iframe, src, callback = false) {
    var script = iframe.contentWindow.document.createElement('script');
        script.type = 'text/javascript';
        script.addEventListener("load", function(event) {
            if (callback) callback();
        });
        script.src = src;    
        iframe.contentWindow.document.head.appendChild(script);
}
export function initDocVideoPro() {
    var ifrVisualizacao = $($ifrVisualizacao).contents();
    var ifrArvore = $('#ifrArvore').contents();

    var docSelected = ifrArvore.find('.infraArvoreNoSelecionado');
    var protocoloSelected = getParamsUrlPro(docSelected.closest('a').attr('href')).id_documento;
    if (typeof protocoloSelected !== 'undefined') {
        var iconSelected = ifrArvore.find('#anchorImg'+protocoloSelected).find('img').attr('src');
        var linkFile = ifrVisualizacao.find(divInformacao+' '+ancoraArvoreDownload).attr('href');
        if (iconSelected.indexOf('video') !== -1) {
            checkDocVideoPro(ifrVisualizacao);
        }
    }
}
export function insertActionInteressadosSend(loop = true) {
    var ifrVisualizacao = $($ifrVisualizacao).contents();
    var iconEnviar = ifrVisualizacao.find('a[href*="acao=procedimento_enviar"]');
    if (iconEnviar.length) {
        iconEnviar.attr('onclick', 'parent.setInteressadosSend()');
    } else {
        if (loop) {
            setTimeout(function () {
                insertActionInteressadosSend(false);
            },1500);
        }
    }
}
export function insertIconNewTab() {
    var ifrVisualizacao = $($ifrVisualizacao).contents();
    var ifrArvore = $('#ifrArvore');
    var arrayLinksArvoreAll = getTreeLinksAllSession();
    var docSelected = ifrArvore.contents().find('.infraArvoreNoSelecionado');
    var id_documento = getParamsUrlPro(docSelected.closest('a').attr('href')).id_documento;
    
    if (typeof id_documento !== 'undefined') {
        var listLinks = getTreeLinksAllSession().filter(function(v){ return (v.indexOf('id_documento='+id_documento) !== -1 && v.indexOf('documento_visualizar') !== -1) });
        if (listLinks.length > 0 && listLinks[0] != '') {
            var html =  '<a class="openNewTab" style="margin: 10px 5px;padding: 5px;border-radius: 5px 0 0 5px;background-color: #eaeaea;color: #666;text-decoration: none;right: 60px;position: absolute;user-select: none;" href="'+url_host.replace('controlador.php','')+listLinks[0]+'" target="_blank">'+
                        '   <i class="fas fa-external-link-square-alt" style="color:#4285f4"></i> Abrir documento em nova aba'+
                        '</a>'+
                        '<a class="openNewTab" data-id_protocolo="'+id_documento+'" onmouseout="return infraTooltipOcultar();" onmouseover="return infraTooltipMostrar(\'Baixar documento (HTML)\')" style="margin: 10px 5px;padding: 5px;border-radius: 0 5px 5px 0;background-color: #eaeaea;color: #666;text-decoration: none;right: 40px;position: absolute;user-select: none;" onclick="parent.downloadDocumentVisualizacao(this)" target="_blank">'+
                        '   <i class="fas fa-download" style="color:#4285f4"></i>'+
                        '</a>';

                ifrVisualizacao.find('.openNewTab').remove()
                ifrVisualizacao.find('#divArvoreAcoes').after(html);
        }
    }
}
export function getNomeSei(nameDoc) {
    var documento = nameDoc.split(' ');
    var nr_sei = (nameDoc.indexOf(' ') !== -1) ? documento[documento.length-1] : '';
        documento = (documento.indexOf(nr_sei) !== -1) ? nameDoc.replace(nr_sei,'').trim() : nameDoc;
    return documento;
}
export function downloadDocumentVisualizacao(this_) {
    var this_ = $(this_);
    var data = this_.data();
    var ifrVisualizacao = $($ifrVisualizacao).contents();
    var ifrArvore = $('#ifrArvore').contents();
    var ifrArvoreHtml = ifrVisualizacao.find($ifrArvoreHtml).contents();

    var doc = ifrArvore.find('#anchor'+data.id_protocolo);
    var nameDoc = doc.text().trim();
    var nr_sei = getNrSei(nameDoc);
    var citacaoDoc = getCitacaoDoc();
    var documento = getNomeSei(nameDoc);
    var nameFile = documento+' ('+citacaoDoc+nr_sei+')';

    this_.find('i').attr('class','fas fa-thumbs-up');
    setTimeout(function() {
        this_.find('i').attr('class','fas fa-download');
    }, 1000);

    var contentDocument = '<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">';
        contentDocument += ifrArvoreHtml.find('html')[0].outerHTML;
    var downloadLink = document.createElement("a");
    var blob = new Blob(["\ufeff", contentDocument]);
    var url = URL.createObjectURL(blob);
    downloadLink.href = url;
    downloadLink.download = nameFile+'.html';

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}
export function setHtmlProtocoloAlterar() {
    var ifrVisualizacao = $($ifrVisualizacao).contents();
    var ifrArvore = $('#ifrArvore').contents();
    var form = ifrVisualizacao.find('#frmProcedimentoCadastro');
    var formVisualizacao = form.attr('action');
    var divProtocolo = ifrVisualizacao.find('#divProtocoloExibir');
    if (
        formVisualizacao.indexOf('controlador.php?acao=procedimento_alterar&acao_origem=procedimento_alterar&arvore=1&id_procedimento=') !== -1 &&
        form.length == 1 &&
        divProtocolo.length == 0
        ) {
        var html =      '<div id="divProtocoloExibir" class="infraAreaDados" style="height:4.5em;position:relative;width: 90%;">'+
                        '    <div style="float:left">'+
                        '    <label id="lblProtocoloExibir" for="txtProtocoloExibir" accesskey="" class="infraLabelObrigatorio">Protocolo:</label>'+
                        '    <input type="text" id="txtProtocoloExibir" name="_txtProtocoloExibir" class="infraText infraReadOnly" readonly="readonly" value="'+ifrVisualizacao.find('#hdnProtocoloProcedimentoFormatado').val()+'">'+
                        '    </div>'+
                        '    <div style="float:right">'+
                        '       <label id="lblDtaGeracaoExibir" for="txtDtaGeracaoExibir" accesskey="" class="infraLabelObrigatorio">Data de Autua\u00E7\u00E3o:</label>'+
                        '       <input type="text" id="txtDtaGeracaoExibir" name="txtDtaGeracaoExibir" class="infraText infraReadOnly" readonly="readonly" value="'+ifrVisualizacao.find('#hdnDtaGeracao').val()+'">'+
                        '    </div>'+
                        '</div>';
            ifrVisualizacao.find('#divInfraBarraComandosSuperior').after(html);
    }

    if (form.length > 0 && ifrVisualizacao.find('#txtDescricao').length ) {
        ifrVisualizacao.find('div.urgentePro').remove();
        ifrVisualizacao.find('#txtDescricao').css('width','86%').attr('data-oldtext',ifrVisualizacao.find('#txtDescricao').val()).after('<div class="urgentePro" style="right: 11%;top: 10px;" onclick="parent.addUrgentPro(this)" onmouseover="return infraTooltipMostrar(\'Adicionar/remover marca de Urg\u00EAncia\');" onmouseout="return infraTooltipOcultar();"></div>');
        formControlerAlterarProcesso(ifrVisualizacao);
    }
}
export function formControlerAlterarProcesso(ifrVisualizacao) {
    ifrVisualizacao.find('button[name="btnSalvar"]').on('click', function() {
        var _this = $(this);
        var _parent = _this.closest('body');
        var oldText = _parent.find('#txtDescricao').attr('data-oldtext');
        var newTipoProc = _parent.find('#selTipoProcedimento').val();
        var newNameTipoProc = _parent.find('#selTipoProcedimento option:selected').text();
        var newText = _parent.find('#txtDescricao').val();
        var checkAddUrgencia = (typeof oldText !== 'undefined' && oldText.toLowerCase().indexOf('(urgente)') === -1 && typeof newText !== 'undefined' && newText.toLowerCase().indexOf('(urgente)') !== -1 ) ? true : false;
        var checkRemoveUrgencia = (typeof oldText !== 'undefined' && oldText.toLowerCase().indexOf('(urgente)') !== -1 && typeof newText !== 'undefined' && newText.toLowerCase().indexOf('(urgente)') === -1 ) ? true : false;
        var methodSend = checkAddUrgencia ? 'add' : false;
            methodSend = checkRemoveUrgencia ? 'remove' : methodSend;
        var checkSend = (checkAddUrgencia || checkRemoveUrgencia) ? true : false;
        if (typeof $($ifrVisualizacao)[0].contentWindow.OnSubmitForm !== 'undefined' && $($ifrVisualizacao)[0].contentWindow.OnSubmitForm()) {
            if (typeof dadosProcessoPro !== 'undefined' && typeof dadosProcessoPro.propProcesso === 'undefined' && typeof pullDadosProcessoSession() !== 'undefined' && pullDadosProcessoSession().propProcesso !== 'undefined' ) {
                dadosProcessoPro.propProcesso = pullDadosProcessoSession().propProcesso;
            }

            if (typeof dadosProcessoPro !== 'undefined' && typeof dadosProcessoPro.propProcesso !== 'undefined' && typeof dadosProcessoPro.propProcesso.txtDescricao !== 'undefined') {
                dadosProcessoPro.propProcesso.txtDescricao = newText;
                dadosProcessoPro.propProcesso.selTipoProcedimento = newTipoProc;
                dadosProcessoPro.propProcesso.hdnIdTipoProcedimento = newTipoProc;
                dadosProcessoPro.propProcesso.hdnNomeTipoProcedimento = newNameTipoProc;
                // console.log('->seetSessionProcessosPro', dadosProcessoPro.listAndamento);
                setSessionProcessosPro(dadosProcessoPro);
            }
            
            var sendAutomaticActions = [];
            sendAutomaticActions[0] = {name: 'urgencia_processo', method: methodSend, send: checkSend, value: false, run: false, index: 0};
            parent.window.sendAutomaticActions = sendAutomaticActions;
            getAutomaticActions();
        }
    });
}
export function checkDocVideoPro(ifrVisualizacao, TimeOut = 9000) {
    var linkFile = ifrVisualizacao.find(divInformacao+' '+ancoraArvoreDownload).attr('href');
    if (TimeOut <= 0) { return; }
    if (typeof linkFile !== 'undefined') { 
            loadDocVideoPro(linkFile, ifrVisualizacao);
            console.log('loadDocVideoPro');
    } else {
        setTimeout(function(){ 
            checkDocVideoPro(ifrVisualizacao, TimeOut - 100); 
            if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage'))console.log('Reload checkDocVideoPro'); 
        }, 500);
    }
}
export function loadDocVideoPro(linkFile, ifrVisualizacao) {
    var divVideo =  '<div style="width:100%;margin-top: 10px;display: inline-block;clear: both;background: #505050;height: inherit;" id="divVideo">'+
                    '    <video width="100%" height="100%" autoplay muted controls loop>'+
                    '        <source src="'+linkFile+'">'+
                    '        Seu navegador n\u00E3o suporta reproduzir v\u00EDdeos. Baixe o arquivo para visualiz\u00E1-lo.'+
                    '    </video>'+
                    '</div>';
    ifrVisualizacao.find('#divVideo').remove();
    ifrVisualizacao.find(divInformacao).after(divVideo);
    ifrVisualizacao.find('#divVideo video').on('loadedmetadata', function(event) {
          this.currentTime = 0;
    });
}
export function updateButtonConfirm(this_, check) {
    var _this = $(this_);
    var btnConfirm = _this.closest('.ui-dialog').find('.ui-dialog-buttonset .confirm');
    if (check) { btnConfirm.addClass('ui-state-active') } else { btnConfirm.removeClass('ui-state-active') }
}
export function checkLoadingButtonConfirm() {
    var btnConfirm = $('.ui-dialog:visible').find('.ui-dialog-buttonset .confirm');
    if (btnConfirm.is(':visible') && btnConfirm.hasClass('loading')) {
        return true;
    } else {
        return false;
    }
}
export function loadingButtonConfirm(check) {
    var i = 0;
    // verifica qual caixa de dialogo esta na frente, caso exista mais de uma
    if ($('.ui-dialog:visible').length > 0) {
        var i_highest = 0;
        $('.ui-dialog:visible').each(function(index) { 
            var i_current = parseInt($(this).css("zIndex"), 10);
            if(i_current > i_highest) {
                i_highest = i_current;
                i = index;
            }
        });
    }
    var btnConfirm = $('.ui-dialog:visible').eq(i).find('.ui-dialog-buttonset .confirm');
    if (btnConfirm.is(':visible')) {
        var oldText = (typeof btnConfirm.data('text') == 'undefined') ? btnConfirm.data('text', btnConfirm.text()) : btnConfirm.data('text');
            oldText = btnConfirm.data('text');
        var html = (check) ? '<i class="fas fa-sync fa-spin cinzaColor"></i>' : oldText;
        btnConfirm.removeClass('ui-state-active').html(html);
        if (check) { btnConfirm.addClass('loading') } else { btnConfirm.removeClass('loading') }
    } 
}
export function checkLimitText(this_) {
    var _this = $(this_);
    var maxlength = _this.attr('maxlength');
    var currentLength = (_this.is('textarea')) ? _this.val().length : _this.text().trim().length;
    var textCount = (currentLength >= maxlength) ? 'Voc\u00EA atingiu o n\u00FAmero m\u00E1ximo de caracteres.' : (maxlength - currentLength)+' caracteres restantes';
    _this.closest('div').find('.countLimit').html(textCount);
    // console.log(this_, maxlength, textCount, _this.closest('div').find('.countLimit'));
}
export function followSelecionarItens(this_) {
    var _this = $(this_);
    if (_this.is(':checked')) {
        _this.closest('tr').addClass('infraTrMarcada');
    } else {
        _this.closest('tr').removeClass('infraTrMarcada');
    }
}
