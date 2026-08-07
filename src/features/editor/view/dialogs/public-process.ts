// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/**
 * Editor module — migrated from body.js (CKEditor 4 / SEI 4.1).
 * Uses lib/domq.js (`q`) instead of the jQuery library.
 */
import { q } from '../../lib/domq.js';
import { state } from '../../state.js';
import { api } from '../../api.js';

export function getCheckerProcessoPublicoPro() {
    if (document.getElementById('frmCheckerProcessoPublicoPro')) return;
    const iframe = document.createElement('iframe');
    iframe.id = 'frmCheckerProcessoPublicoPro';
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('style', 'width: 1px; height: 1px; position: absolute; top: -100px; display: none;');
    iframe.setAttribute('tabindex', '-1');
    iframe.setAttribute('scrolling', 'no');
    document.body.appendChild(iframe);
}
export function openDialogProcessoPublicoPro(this_) {
    api.setParamEditor(this_);
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
    dialogBoxPro = q('#dialogBoxPro')
        .html(htmlBox)
        .dialog({
            title : 'Adicionar Link de Documento P\u00FAblico',
            width : 600,
            height : 450,
            open: function () {
                initChosenReplace('box_multiple', this, true);

                q(document).off('click', '#searchPub_search').on('click', '#searchPub_search', function(event) {
                    event.preventDefault();
                    api.loadListaProcessoPublicoPro();
                });

                q(document).off('keypress', '#captchaPub').on('keypress', '#captchaPub', function(event) {
                    event.preventDefault();
                    if (event.which == 13) {
                        api.loadListaProcessoPublicoPro();
                    }
                });

                api.getDadosIframeProcessoPublicoPro();
                q('#searchPub_result').html('').hide();
                q('#searchPub_load').hide();
                var processo = (typeof dadosProcessoPro.listAndamento !== 'undefined' && typeof dadosProcessoPro.listAndamento.processo !== 'undefined') ? dadosProcessoPro.listAndamento.processo : '';
                q('#processoPub' ).val(processo);
            },
            buttons: [{
                text: 'Inserir',
                class: 'confirm ui-state-active',
                click: function(event) {
                    var selectDocPublico = q('#selectDocPublico option:selected');
                    var url = selectDocPublico.attr('data-url');
                    var doc = selectDocPublico.attr('data-documento');
                    var htmlUrl = (url=='') ? doc : '<a class="ancoraSei" href="'+url+'" target="_blank">'+doc+'</a>';
                    if ( typeof selectDocPublico !== 'undefined' != '' && selectDocPublico.length ) {
                        state.oEditor.focus();
                        state.oEditor.fire('saveSnapshot');
                        state.oEditor.insertHtml(htmlUrl);
                        state.oEditor.fire('saveSnapshot');
                        resetDialogBoxPro('dialogBoxPro');
                    }
                }
            }]
        });
}
async function resolveCapchaProcessoPublico() {
    if (typeof perfilGemini !== 'undefined' && perfilGemini.KEY_USER && !q('.trListDocPublico').is(':visible') && !delayCrash) {
        const base64ImgCaptcha = await getImageBase64FromImgElement(q('#searchPub_captcha img')[0]);
        const captchaResolve = await resolveCaptchaAI("Quais os caracteres da imagem? Responsa apenas com os caracteres, sem espaço entre eles", base64ImgCaptcha);
        q('#captchaPub').val(captchaResolve);
        if (q('#processoPub').val() != '') api.loadListaProcessoPublicoPro();
    }
}
export function getDadosIframeProcessoPublicoPro() {
    if ( q('#frmCheckerProcessoPublicoPro').length == 0 ) { api.getCheckerProcessoPublicoPro(); }
    var url = window.location.origin+'/sei/modulos/pesquisa/md_pesq_processo_pesquisar.php?acao_externa=protocolo_pesquisar&acao_origem_externa=protocolo_pesquisar&id_orgao_acesso_externo=0';
    q('#frmCheckerProcessoPublicoPro').attr('src', url).unbind().on('load', function(){
        api.checkDadosIframeProcessoPublicoPro();
    });
}
export function checkDadosIframeProcessoPublicoPro(TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    var ifrPublico = q('#frmCheckerProcessoPublicoPro').contents();
    if ( ifrPublico.find('#seiSearch').length ) {
        var captchaImg = ifrPublico.find('#lblCaptcha img, #imgCaptcha, img[src*="captcha" i]').eq(0);
        var captcha = captchaImg.attr('src') || captchaImg.attr('data-src');
        // The public-search page can render its form before the CAPTCHA image.
        // Never write `src="undefined"`, which turns into /sei/undefined.
        if (!captcha || captcha === 'undefined') {
            setTimeout(function () {
                api.checkDadosIframeProcessoPublicoPro(TimeOut - 100);
            }, 500);
            return;
        }
        var htmlCaptcha =   '<img src="'+captcha+'"> <button type="button" data-seipro-action="getDadosIframeProcessoPublicoPro" aria-label="Atualizar captcha" class="seipro-icon-button"><i class="fas fa-redo" aria-hidden="true"></i></button>';
        q('#searchPub_captcha').html(htmlCaptcha);
        q('#searchPub_load').hide();
        q('#captchaPub').val('').focus();
        resolveCapchaProcessoPublico();
    } else {
        setTimeout(function () {
            api.checkDadosIframeProcessoPublicoPro(TimeOut - 100);
            console.log('**RELOAD checkDadosIframeProcessoPublicoPro');
        }, 500);
    }
}
export function loadListaProcessoPublicoPro() {
    delayCrash = true;
    var processo = q('#processoPub').val();
    var captcha = q('#captchaPub').val();
    if (processo != '' && captcha != '') {
        q('#searchPub_load').show();
        var ifrPublico = q('#frmCheckerProcessoPublicoPro').contents();
            ifrPublico.find('#txtProtocoloPesquisa').val(processo);
            ifrPublico.find('#txtCaptcha').val(captcha);
            ifrPublico.find('#sbmPesquisar').trigger('click');
            setTimeout(function () {
                waitLoadPro(q('#frmCheckerProcessoPublicoPro').contents(), '#conteudo', "a.protocoloNormal", api.getListaProcessoPublicoPro);
            }, 800);
    } else {
        alertaBoxPro('Error', 'exclamation-triangle', 'Digite os campos obrigat\u00F3rios!');
        delayCrash = false;
    }
}
export function getListaProcessoPublicoPro(){
    var ifrPublicoResult = q('#frmCheckerProcessoPublicoPro').contents();
    var htmlResult = ifrPublicoResult.find('#conteudo');
    var htmlValida = ifrPublicoResult.find('#txaInfraValidacao');
        q('#searchPub_load').hide();
        q('#frmCheckerProcessoPublicoPro').unbind();
        if (typeof htmlResult !== 'undefined' && htmlResult.html() != '') {
            var linkProcesso = htmlResult.find('a.protocoloNormal').eq(0).attr('href');
            var urlProcesso = window.location.origin+'/sei/modulos/pesquisa/'+linkProcesso;
            if (typeof linkProcesso !== 'undefined' && linkProcesso != '') {
                api.getLinksProcessoPublicoPro(urlProcesso);
            } else {
                api.getDadosIframeProcessoPublicoPro();
                q('#searchPub_load').hide();
            }
        }
        delayCrash = false;
}
export function getLinksProcessoPublicoPro(href) {
    q.ajax({ url: href }).done(function (html) {
        let $html = q(html);
        var listDocumentos = [];
            $html.find("#tblDocumentos").find('tr.infraTrClara').each(function(index){
                var link = q(this).find('a.ancoraPadraoAzul').attr('onclick');
                    link = (typeof link !== 'undefined' && link != '') ? link.match(/'([^']+)'/)[1] : link;
                    link = (typeof link !== 'undefined' && link != '') ? window.location.origin+'/sei/modulos/pesquisa/'+link : link;
                var data = q(this).find("td").map(function () { return q(this).text(); }).get();
                    listDocumentos.push({link: link, data: data});
            });
        var processoDoc = $html.find('#tblCabecalho').find('tr.infraTrClara').eq(0).find('td').eq(1).text();
        var optionSelectDocumentos = '';
        var citacaoDoc = getCitacaoDoc();
            q.each(listDocumentos, function (index, value) {
                var urlDocumento = (typeof value.link !== 'undefined') ? value.link : '';
                var descDocumento = (typeof value.link === 'undefined') ? ' [DOCUMENTO RESTRITO]' : '';
                optionSelectDocumentos += '<option data-url="'+urlDocumento+'" data-documento="'+value.data[2]+'&nbsp;('+citacaoDoc+value.data[1]+')">'+value.data[2]+' ('+citacaoDoc+value.data[1]+') '+descDocumento+'</option>';
            });
            optionSelectDocumentos += '<option data-url="'+href+'" data-documento="'+processoDoc+'">'+processoDoc+'</option>';

        q('.trListDocPublico').show();
        q('#selectDocPublico').html(optionSelectDocumentos).chosen("destroy").chosen({
            placeholder_text_single: ' ',
            no_results_text: 'Nenhum resultado encontrado',
            normalize_search_text: function(text) {
                return removeAcentos(text.toLowerCase());
            }
        }).trigger('chosen:updated').trigger('chosen:activate');

        setTimeout(() => {
            q('#selectDocPublico').focus().trigger('chosen:open');
        }, 2000);
    });
}
export function insertAutomaticMinutaWatermark() {
    var nomeDocumento = jmespath.search(dadosProcessoPro.listDocumentos, "[?id_protocolo=='"+getParamsUrlPro(window.location.href).id_documento+"'].documento | [0]");
    if (nomeDocumento !== null && nomeDocumento.toLowerCase().indexOf('minuta')  !== -1) {
        var maxIframeHeight = {value: 0, index: -1}
        q('iframe.cke_wysiwyg_frame').each(function(index){
            if ( q(this).contents().find('body').attr('contenteditable') == 'true' ) {
                var height = q(this).height();
                if (height > maxIframeHeight.value) {
                    maxIframeHeight = {value: height, index: index};
                }
            }
        });
        if (maxIframeHeight.index != -1) {
            var elemIframe = q('iframe').eq(maxIframeHeight.index);
            var iframe = elemIframe.contents();
            if (iframe.find('.minutaAncora').length == 0) {
                if (elemIframe.attr('title').indexOf(',') !== -1) {
                    q('#idEditor').val(elemIframe.attr('title').split(',')[1].trim());
                    api.insertMinutaWatermark(iframe, 'auto');
                    console.log(q('#idEditor').val());
                }
            }
        }
    } else {
        q('iframe.cke_wysiwyg_frame').each(function(index){
            var iframe = q(this).contents();
            if ( iframe.find('body').attr('contenteditable') == 'true' ) {
                iframe.find('.minutaAncora[data-type="auto"]').remove();
            }
        });
    }
}
export function insertMinutaWatermark(iframe, type, mode = 'minuta') {
    if (typeof oEditor !== 'undefined') {
        var nomeDocumento = jmespath.search(dadosProcessoPro.listDocumentos, "[?id_protocolo=='"+getParamsUrlPro(window.location.href).id_documento+"'].documento | [0]");
        var textMinuta = ((nomeDocumento !== null && nomeDocumento.toLowerCase().indexOf('modelo')  !== -1) || mode == 'modelo') ? 'MODELO' : 'MINUTA';

        var htmlMinuta =    '<p class="Texto_Alinhado_Esquerda">\n'+
                            '   <span contenteditable="false" class="minutaAncora" data-type="'+type+'">\n'+
                            '      <a class="ancoraSei" contenteditable="false" style="text-indent:0;">\n'+
                            '          <style type="text/css" data-style="seipro-watermark">\n'+
                            '              body:after { content: "'+textMinuta+'"; font-size: 9em; color: rgb(167 167 167 / 20%); z-index: 999; display: flex; align-items: center; justify-content: center; position: fixed; transform: rotate(-45deg); top: 0; right: 0; left: 0; bottom: 0; pointer-events: none; user-select: none; font-family: Arial; }\n'+
                            '              html.dark-mode .minutaAncora, html.dark-mode .minutaAncora:after { background: #6f7071 !important; color: #f9f9f9 !important; }\n'+
                            '              .minutaAncora { text-indent: 0; font-size: .8em; padding: 2px 5px; background: #e4e4e4; border-radius: 5px; font-weight: bold; color:#d45656; margin: 0 5px; }\n'+
                            '              body.cke_editable .minutaAncora:after { content: " [delete isto para remover a marca d\'agua]"; color:#888; font-weight: normal; font-size: .85em; margin: 0 5px; }\n'+
                            '              body.cke_editable:after { width: fit-content; margin: 0 33%; overflow: hidden; }\n'+
                            '          </style>\n'+
                            '          * '+textMinuta+' DE DOCUMENTO'+
                            '      </a>'+
                            '   </span>&nbsp;&nbsp;\n'+
                            '</p>\n';
        state.oEditor.focus();
        state.oEditor.fire('saveSnapshot');
        iframe.find('body').prepend(htmlMinuta);
        state.oEditor.fire('saveSnapshot');
        enableButtonSavePro();
    }
}
export function getMinutaWatermark(this_) {
    api.setParamEditor(this_);
    var minutaAncora = state.iframeEditor.find('.minutaAncora');
    if (minutaAncora.length == 0) {
        api.insertMinutaWatermark(state.iframeEditor, 'manual');
    } else {
        if (minutaAncora.text().indexOf('MINUTA') !== -1) {
            minutaAncora.closest('p').remove();
            api.insertMinutaWatermark(state.iframeEditor, 'manual', 'modelo');
        } else {
            minutaAncora.closest('p').remove();
            api.insertMinutaWatermark(state.iframeEditor, 'manual');
        }
        var minutaAncora_new = state.iframeEditor.find('.minutaAncora');
            minutaAncora_new.fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
            minutaAncora_new.get(0).scrollIntoView();
    }
}
api.getCheckerProcessoPublicoPro = getCheckerProcessoPublicoPro;
api.openDialogProcessoPublicoPro = openDialogProcessoPublicoPro;
api.getDadosIframeProcessoPublicoPro = getDadosIframeProcessoPublicoPro;
api.checkDadosIframeProcessoPublicoPro = checkDadosIframeProcessoPublicoPro;
api.loadListaProcessoPublicoPro = loadListaProcessoPublicoPro;
api.getListaProcessoPublicoPro = getListaProcessoPublicoPro;
api.getLinksProcessoPublicoPro = getLinksProcessoPublicoPro;
api.insertAutomaticMinutaWatermark = insertAutomaticMinutaWatermark;
api.insertMinutaWatermark = insertMinutaWatermark;
api.getMinutaWatermark = getMinutaWatermark;
