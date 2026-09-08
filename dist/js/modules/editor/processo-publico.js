/**
 * SEI Pro - Editor / Feature: Adicionar Link de Documento Publico
 *
 * Abre um dialogo jQuery UI que pesquisa um processo na area de pesquisa
 * publica do SEI (md_pesq_processo_pesquisar.php), resolve o captcha
 * (opcionalmente via IA/Gemini), lista os documentos publicos do processo e
 * insere no editor uma ancora <a class="ancoraSei"> para o documento escolhido.
 *
 * Modulo da arquitetura modular (ver js/modules/editor/README.md):
 *  - Define os handlers globais com os MESMOS nomes usados pelo monolito em
 *    setClickButtons: $('.getProcessoPublicoButton').on('click', ...
 *    openDialogProcessoPublicoPro(this)). O HTML do captcha gerado em
 *    checkDadosIframeProcessoPublicoPro tambem referencia
 *    getDadosIframeProcessoPublicoPro via onclick inline -- por isso TODAS as
 *    funcoes precisam continuar sendo globais (window.*).
 *  - Carregado ANTES do monolito (adapter -> modulos -> editor), portanto NAO
 *    chama helpers do monolito em tempo de avaliacao. Os helpers usados
 *    (setParamEditor, resetDialogBoxPro, initChosenReplace, waitLoadPro,
 *    alertaBoxPro, sanitizeHTML, removeAcentos, getCitacaoDoc,
 *    getImageBase64FromImgElement, resolveCaptchaAI) e o estado compartilhado
 *    (dadosProcessoPro, delayCrash, perfilGemini, loadSEIProAI) vem de outros
 *    scripts da extensao e estao disponiveis no clique/boot.
 *  - A instancia do editor e a insercao do link sao roteadas pelo
 *    SeiProEditorAdapter (CK4 e CK5).
 *
 * Estado: EXTRACAO. A unica interacao com o editor (recuperar a instancia e
 * inserir o HTML) ja era feita pelo adapter no monolito. O iframe oculto
 * frmCheckerProcessoPublicoPro NAO e o iframe do editor: ele aponta para a
 * pagina de PESQUISA PUBLICA do SEI, uma pagina independente da versao do
 * CKEditor. Por isso o uso de .contents() sobre esse iframe e legitimo e nao
 * viola o contrato (que proibe acesso ao iframe/contents do EDITOR). Movido
 * verbatim, sem dependencia de CK4 cru.
 *
 * Observacao: getCitacaoDoc NAO foi movido -- pertence ao modulo citacao.js e
 * e compartilhado entre features.
 */
(function () {
    'use strict';

    // Cria o iframe oculto usado para raspar a pesquisa publica do SEI.
    window.getCheckerProcessoPublicoPro = function () {
        $('<iframe>', {
            id:  'frmCheckerProcessoPublicoPro',
            frameborder: 0,
            style: 'width: 1px; height: 1px; position: absolute; top: -100px; display: none;',
            tableindex: '-1',
            scrolling: 'no'
        }).appendTo('body');
    };

    // Entrada da feature: abre o dialogo de busca/insercao do link publico.
    window.openDialogProcessoPublicoPro = function (this_) {
        setParamEditor(this_);
        const htmlBox = sanitizeHTML(`
            <div class="dialogBoxDiv" style="font-size: 11pt;line-height: 12pt;color: #616161;">
                <table style="font-size: 10pt;width: 100%;" class="seiProForm">
                    <tr>
                        <td style="vertical-align: bottom; text-align: left;" class="label">
                            <label for="processoPub"><i class="iconPopup iconSwitch fas fa-folder-open cinzaColor"></i>Processo:</label>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <input type="text" id="processoPub">
                        </td>
                    </tr>
                    <tr>
                        <td style="vertical-align: bottom; text-align: left;" class="label">
                            <label for="captchaPub"><i class="iconPopup iconSwitch fas fa-hashtag cinzaColor"></i>Digite o c\u00F3digo:</label>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <input type="text" id="captchaPub" style="width: 70%;" autocomplete="off">
                            <a id="searchPub_search" class="newLink newLink_active" style="user-select: none;padding-right: 20px;margin: 0 5px;"">
                                <i class="fas fa-search cinzaColor"></i>
                                <span class="txt_cinza" style="font-size: 80%;vertical-align: text-top;">Pesquisar</span>
                            </a>
                            <i id="searchPub_load" class="fas fa-sync-alt fa-spin" style="margin-left: 10px; display:none"></i>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div id="searchPub_captcha" style="margin-bottom: 8px;"></div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div id="searchPub_result" style="display:none; margin-top: 10px;"></div>
                        </td>
                    </tr>
                    <tr class="trListDocPublico" style="display:none;">
                        <td style="vertical-align: bottom; text-align: left;" class="label">
                            <label for="selectDocPublico"><i class="iconPopup iconSwitch fas fa-file cinzaColor"></i>Documentos:</label>
                        </td>
                    </tr>
                    <tr class="trListDocPublico" style="display:none;">
                        <td class="label">
                            <select id="selectDocPublico" style="width: 100%;"></select>
                        </td>
                    </tr>
                </table>
            </div>
        `);

        resetDialogBoxPro('dialogBoxPro');
        dialogBoxPro = $('#dialogBoxPro')
            .html(htmlBox)
            .dialog({
                title : 'Adicionar Link de Documento P\u00FAblico',
                width : 600,
                height : 450,
                open: function () {
                    initChosenReplace('box_multiple', this, true);

                    $(document).off('click', '#searchPub_search').on('click', '#searchPub_search', function(event) {
                        event.preventDefault();
                        loadListaProcessoPublicoPro();
                    });

                    $(document).off('keypress', '#captchaPub').on('keypress', '#captchaPub', function(event) {
                        if (event.which == 13) {
                            event.preventDefault();
                            loadListaProcessoPublicoPro();
                        }
                    });

                    getDadosIframeProcessoPublicoPro();
                    $('#searchPub_result').html('').hide();
                    $('#searchPub_load').hide();
                    var processo = (typeof dadosProcessoPro.listAndamento !== 'undefined' && typeof dadosProcessoPro.listAndamento.processo !== 'undefined') ? dadosProcessoPro.listAndamento.processo : '';
                    $('#processoPub' ).val(processo);
                },
                buttons: [{
                    text: 'Inserir',
                    class: 'confirm ui-state-active',
                    click: function(event) {
                        var selectDocPublico = $('#selectDocPublico option:selected');
                        var url = selectDocPublico.attr('data-url');
                        var doc = selectDocPublico.attr('data-documento');
                        var htmlUrl = (url=='') ? doc : '<a class="ancoraSei" href="'+url+'" target="_blank">'+doc+'</a>';
                        if ( typeof selectDocPublico !== 'undefined' != '' && selectDocPublico.length ) {
                            var ed = SeiProEditorAdapter.getInstance();
                            if (ed) SeiProEditorAdapter.withEdit(ed, function () { SeiProEditorAdapter.insertHtml(ed, htmlUrl); });
                            resetDialogBoxPro('dialogBoxPro');
                        }
                    }
                }]
            });
    };

    // Resolve o captcha automaticamente via IA quando o perfil Gemini tem chave.
    window.resolveCapchaProcessoPublico = async function () {
        if (typeof perfilGemini !== 'undefined' && perfilGemini.KEY_USER && !$('.trListDocPublico').is(':visible')) {
            var imgCaptcha = $('#searchPub_captcha img');
            const base64ImgCaptcha = imgCaptcha.attr('src').startsWith('data:image/') ? imgCaptcha.attr('src') : await getImageBase64FromImgElement(imgCaptcha[0]);
            const captchaResolve = await resolveCaptchaAI("Quais os caracteres da imagem? Responsa apenas com os caracteres, sem espa\u00E7o entre eles", base64ImgCaptcha);
            $('#captchaPub').val(captchaResolve);
            setTimeout(() => {
                if ($('#captchaPub').val() != '' && $('#processoPub').val() != '' && captchaResolve) loadListaProcessoPublicoPro();
            }, 1000);
        }
    };

    // Carrega a pagina de pesquisa publica do SEI dentro do iframe oculto.
    window.getDadosIframeProcessoPublicoPro = function () {
        if ( $('#frmCheckerProcessoPublicoPro').length == 0 ) { getCheckerProcessoPublicoPro(); }
        var url = window.location.origin+'/sei/modulos/pesquisa/md_pesq_processo_pesquisar.php?acao_externa=protocolo_pesquisar&acao_origem_externa=protocolo_pesquisar&id_orgao_acesso_externo=0';
        $('#frmCheckerProcessoPublicoPro').attr('src', url).unbind().on('load', function(){
            checkDadosIframeProcessoPublicoPro();
        });
    };

    // Aguarda o formulario de pesquisa, extrai o captcha e dispara a resolucao.
    window.checkDadosIframeProcessoPublicoPro = function (TimeOut = 9000) {
        if (TimeOut <= 0) { return; }
        if (TimeOut === 9000) $.getScript(URL_SPRO + 'js/sei-pro-ai.js');
        var ifrPublico = $('#frmCheckerProcessoPublicoPro').contents();
        if ( ifrPublico.find('#seiSearch').length ) {
            var captcha = ifrPublico.find('#lblCaptcha').find('img').attr('src');
                captcha = typeof captcha === 'undefined' ? ifrPublico.find('#imgCaptcha').attr('src') : captcha;
            var htmlCaptcha =   '<img src="'+captcha+'"> <i onclick="getDadosIframeProcessoPublicoPro()" class="fas fa-redo" style="color: #969696; cursor: pointer; padding: 3px 8px;"></i>';
            $('#searchPub_captcha').html(htmlCaptcha);
            $('#searchPub_load').hide();
            $('#captchaPub').val('').focus();
            if (typeof loadSEIProAI !== 'undefined') resolveCapchaProcessoPublico();
            else setTimeout(function () {
                resolveCapchaProcessoPublico();
            }, 1500);
        } else {
            setTimeout(function () {
                checkDadosIframeProcessoPublicoPro(TimeOut - 100);
                console.log('**RELOAD checkDadosIframeProcessoPublicoPro');
            }, 500);
        }
    };

    // Preenche o formulario publico (processo + captcha) e dispara a pesquisa.
    window.loadListaProcessoPublicoPro = function () {
        delayCrash = true;
        var processo = $('#processoPub').val();
        var captcha = $('#captchaPub').val();
        if (processo != '' && captcha != '') {
            $('#searchPub_load').show();
            var ifrPublico = $('#frmCheckerProcessoPublicoPro').contents();
            var inputCaptcha = ifrPublico.find('#txtCaptcha');
                inputCaptcha = typeof inputCaptcha.length === 'undefined' ? ifrPublico.find('#txtInfraCaptcha') : inputCaptcha;
                ifrPublico.find('#txtProtocoloPesquisa').val(processo);
                inputCaptcha.val(captcha);
                ifrPublico.find('#sbmPesquisar').trigger('click');
                setTimeout(function () {
                    waitLoadPro($('#frmCheckerProcessoPublicoPro').contents(), '#conteudo', "a.protocoloNormal", getListaProcessoPublicoPro);
                }, 800);
        } else {
            alertaBoxPro('Error', 'exclamation-triangle', 'Digite os campos obrigat\u00F3rios!');
            delayCrash = false;
        }
    };

    // Le o resultado da pesquisa e dispara o carregamento dos documentos.
    window.getListaProcessoPublicoPro = function () {
        var ifrPublicoResult = $('#frmCheckerProcessoPublicoPro').contents();
        var htmlResult = ifrPublicoResult.find('#conteudo');
        var htmlValida = ifrPublicoResult.find('#txaInfraValidacao');
            $('#searchPub_load').hide();
            $('#frmCheckerProcessoPublicoPro').unbind();
            if (typeof htmlResult !== 'undefined' && htmlResult.html() != '') {
                var linkProcesso = htmlResult.find('a.protocoloNormal').eq(0).attr('href');
                var urlProcesso = window.location.origin+'/sei/modulos/pesquisa/'+linkProcesso;
                if (typeof linkProcesso !== 'undefined' && linkProcesso != '') {
                    getLinksProcessoPublicoPro(urlProcesso);
                } else {
                    getDadosIframeProcessoPublicoPro();
                    $('#searchPub_load').hide();
                }
            }
            delayCrash = false;
    };

    // Busca a pagina do processo publico, monta a lista de documentos e o select.
    window.getLinksProcessoPublicoPro = function (href) {
        $.ajax({ url: href }).done(function (html) {
            let $html = $(html);
            var listDocumentos = [];
                $html.find("#tblDocumentos").find('tr.infraTrClara').each(function(index){
                    var link = $(this).find('a.ancoraPadraoAzul').attr('onclick');
                        link = (typeof link !== 'undefined' && link != '') ? link.match(/'([^']+)'/)[1] : link;
                        link = (typeof link !== 'undefined' && link != '') ? window.location.origin+'/sei/modulos/pesquisa/'+link : link;
                    var data = $(this).find("td").map(function () { return $(this).text(); }).get();
                        listDocumentos.push({link: link, data: data});
                });
            var processoDoc = $html.find('#tblCabecalho').find('tr.infraTrClara').eq(0).find('td').eq(1).text();
            var optionSelectDocumentos = '';
            var citacaoDoc = getCitacaoDoc();
                $.each(listDocumentos, function (index, value) {
                    var urlDocumento = (typeof value.link !== 'undefined') ? value.link : '';
                    var descDocumento = (typeof value.link === 'undefined') ? ' [DOCUMENTO RESTRITO]' : '';
                    optionSelectDocumentos += '<option data-url="'+urlDocumento+'" data-documento="'+value.data[2]+'&nbsp;('+citacaoDoc+value.data[1]+')">'+value.data[2]+' ('+citacaoDoc+value.data[1]+') '+descDocumento+'</option>';
                });
                optionSelectDocumentos += '<option data-url="'+href+'" data-documento="'+processoDoc+'">'+processoDoc+'</option>';

            $('.trListDocPublico').show();
            $('#selectDocPublico').html(optionSelectDocumentos).chosen("destroy").chosen({
                placeholder_text_single: ' ',
                no_results_text: 'Nenhum resultado encontrado',
                normalize_search_text: function(text) {
                    return removeAcentos(text.toLowerCase());
                }
            }).trigger('chosen:updated').trigger('chosen:activate');

            setTimeout(() => {
                $('#selectDocPublico').focus().trigger('chosen:open');
            }, 2000);
        });
    };

    if (window.SeiProEditorAdapter && SeiProEditorAdapter.registerFeature) {
        SeiProEditorAdapter.registerFeature({ id: 'processo-publico' });
    }
})();
