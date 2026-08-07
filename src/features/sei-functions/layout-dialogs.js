/**
 * Sei Functions Pro — layout, chosen, dialogs, early ajax.
 * (ponte temporária: jQuery/DOM legado; fatia do antigo body.js)
 */
import {
    ajaxDadosDocumentosPro,
    ajaxDadosProcessoPro,
    alertaBoxPro,
    getCheckerProcessoPro,
    getDadosAndamentoPro,
    getIDProtocoloSEI,
    getLinksArvoreAjax,
    setSessionProcessosPro,
    setSizeIframePro,
    waitLoadPro
} from './modules.js';

export function resizeWinArvore(widthArvore) {
    var indent = 10; // reduz 10 pixel a largura do visualizador para compensar a barra divisoria existente entre a arvore e o visualizador
    var widthConteudo = $('#divConteudo').width(); // capta o tamanho total da janela do SEI (janela interna)
    var widthVisualizacao = widthConteudo-widthArvore-indent; // calcula o novo tamanho total da janela de visualizacao, sendo o tamanho util da janela (menos) o tamanho da arvore (menos) a folga de 10pixels
    
    // $('#ifrArvore').css('width', widthArvore); // redimensiona a janela da arvore
    // $($ifrVisualizacao).css('width', widthVisualizacao); // redimensiona a janela do visualizador de documentos
}
export function resizeArvoreMaxWidth(force = false) {
    if ($('#ifrArvore').length > 0 && (force || verifyConfigValue('resizearvore'))) { // verifica se a arvore existe e se a opcao da extensao esta ativa
        var indent = 60; // adiciona 40 pixel a largura da arvore para compensar as margens internas e externas
        // resizeWinArvore(widthArvore+indent); // chama a funcao de redimensar as janelas da arvore e do visualizador de documentos, já com o valor da arvore menos o folga de 20pixels
        waitLoadPro($('#ifrArvore').contents(), 'form', "#divArvore", function(){
            setResizeArvoreMaxWidth(indent);
        });
    }
}
export function setResizeArvoreMaxWidth(indent, saveSize = false) {
    var widthArvore = $('#ifrArvore').contents().find('#divArvore')[0].scrollWidth; // captura a largura da arvore de processo dentro do iframe
        widthArvore = (typeof widthArvore !== 'undefined') ? widthArvore : false;
        if (widthArvore > $('#ifrArvore').width()) {
            if (!saveSize) removeOptionsPro('iframeSizeSlimPro');
            setSizeIframePro(widthArvore+indent, saveSize);
        } else if (widthArvore) {
            setSizeIframePro(200, saveSize);
        }
    console.log('setResizeArvoreMaxWidth');
}
export function addTextToTextarea(source, target, text) {
    target.insertAtCaret(text);
    source.fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
}
// reverseArray migrada para SeiPro.core.numeros (src/core/numeros.js) — Fase 6
// [migrado para core/helpers.js] checkObjHasProperty
// isNumeric migrada para SeiPro.core.numeros (src/core/numeros.js) — Fase 6
// [migrado para core/helpers.js] fixedEncodeURIComponent
// is_html migrada para SeiPro.core.texto (src/core/texto.js) — Fase 6
// validateEmail migrada para SeiPro.core.validacao (src/core/validacao.js) — Fase 6
// encodeURIComponent para ISO-8859-1
// escapeComponent e escapeRegExp migradas para SeiPro.core.texto (src/core/texto.js) — Fase 6
// escapeHtml migrada para SeiPro.core.validacao (src/core/validacao.js) — Fase 6
export function forceOnLoadBodyPage() {
    var onloadAttr = $('body').attr('onload');
    if (!onloadAttr || typeof $().resizable === 'undefined' || $('.sparkling-modal-frame').length) return;
    if (window.__seiProForceOnLoadBodyPageLock) return;
    window.__seiProForceOnLoadBodyPageLock = true;
    // new Function(onloadAttr)() REMOVIDO: a CSP da extensão bloqueia eval no mundo
    // isolado (aviso "unsafe-eval") e o onload nativo referencia globais do mundo
    // MAIN, inacessíveis aqui — sempre degradava para no-op. O navegador já executa
    // o onload do <body> no load da página. (Esta função hoje não tem call-site.)
    setTimeout(function(){
        window.__seiProForceOnLoadBodyPageLock = false;
    }, 1000);
}
export function downloadTableCSV(element, nameFile) {
  var titles = [];
  var data = [];
  element.find('th').each(function() { titles.push($(this).text().trim()) });
  element.find('td').each(function() { if (!$(this).closest('tr').hasClass('notCopy')) { data.push($(this).text().trim()) } });
  var CSVString = prepCSVRow(titles, titles.length, '');
  CSVString = prepCSVRow(data, titles.length, CSVString);

  var downloadLink = document.createElement("a");
  var blob = new Blob(["\ufeff", CSVString]);
  var url = URL.createObjectURL(blob);
  downloadLink.href = url;
  downloadLink.download = nameFile+'_'+moment().format('YYYYMMDD_HH:mm:ss')+'.csv';

  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}
// [migrado para core/helpers.js] prepCSVRow
// componentToHex migrada para SeiPro.core.cor (src/core/cor.js) — Fase 6
// toNumBr migrada para SeiPro.core.numeros (src/core/numeros.js) — Fase 6
// pad migrada para SeiPro.core.texto (src/core/texto.js) — Fase 6
// rgbToHexString migrada para SeiPro.core.cor (src/core/cor.js) — Fase 6
// rgbToHex migrada para SeiPro.core.cor (src/core/cor.js) — Fase 6
// hexToRgb migrada para SeiPro.core.cor (src/core/cor.js) — Fase 6
// addAlpha migrada para SeiPro.core.cor (src/core/cor.js) — Fase 6
// arrayMin migrada para SeiPro.core.numeros (src/core/numeros.js) — Fase 6

// [removida redeclaração duplicada de arrayMax — definida acima na linha ~958]
// getHashTagsPro migrada para SeiPro.core.texto (src/core/texto.js) — Fase 6
// hasNumber e onlyNumber migradas para SeiPro.core.numeros (src/core/numeros.js) — Fase 6
// joinAnd migrada para SeiPro.core.texto (src/core/texto.js) — Fase 6
// getBrightnessColor migrada para SeiPro.core.cor (src/core/cor.js) — Fase 6
export function setIconLoadinBtnSEI(elem, display = true) {
    if (display) {
        elem.find('img').css('opacity','0').end().append('<span class="botaoSEI_iconBox botaoSEI_loading infraCorBarraSistema" style="'+(SeiPro.sei.adapter.isNewSEI() ? 'margin: 0;border: 0;width: 100%;height: 46px;background: #fff !important;' : 'margin: 0px 0 0 5px; border: 0.1em solid white;')+'"><i class="fas fa-spin fa-spinner" style="font-size: 17pt; color: #fff;"></i></span>'); 
    } else {
        elem.find('img').css('opacity','1').end().find('.botaoSEI_loading').remove();
    }
}
// [migrado para core/helpers.js] removeDuplicatesArray
// extractOnlyAlphaNum migrada para SeiPro.core.texto (src/core/texto.js) — Fase 6
// [migrado para sei/tooltip.js] extractTooltip
export function changeInputProtocoloSEI(this_, callback = false, callback_error = false) {
    var _this = $(this_);
    var protocoloSEI = _this.val();
    getIDProtocoloSEI(protocoloSEI,  
        function(html){
            if (callback) callback(html);
            _this.removeClass('requiredNull');
        }, 
        function(){
            if (callback_error) callback_error();
            alertaBoxPro('Error', 'exclamation-triangle', 'Protocolo n\u00E3o encontrado!');
            _this.addClass('requiredNull');
        }
    );
}
// [migrado para sei/tooltip.js] extractTooltipToArray
export function ganttAutoProgressPercent(dtStar, dtEnd) {
    var dtNow = moment();
    var progressDat = dtEnd.diff(dtStar, 'days');
    var progressDatNow = dtNow.diff(dtStar, 'days');
    var percentProgress = Math.round((progressDatNow/progressDat)*100);
        percentProgress = ( percentProgress < 0 ) ? 0 : percentProgress;
    return percentProgress;
}
export function changePanelSortPro(this_) {
    var _this = $(this_);
    if (_this.is(':checked')) {
        setOptionsPro('panelSortPro', true);
        if ($('#panelHomePro').hasClass('ui-sortable')) {
            $('#panelHomePro').sortable('enable');
        } else {
            setSortDivPanel();
        }
    } else {
        removeOptionsPro('panelSortPro');
        $('#panelHomePro').sortable('disable');
        $('#panelHomePro .titlePanelHome').unbind();
    }
}
export function changePanelSortColumnsPro(this_) {
    var _this = $(this_);
    if (_this.is(':checked')) {
        setOptionsPro('panelSortColumnsPro', true);
    } else {
        removeOptionsPro('panelSortColumnsPro');
    }
}
export function changePanelLocalStorePro(this_) {
    var _this = $(this_);
    if (_this.is(':checked')) {
        setOptionsPro('panelLocalStorePro', true);
    } else {
        removeOptionsPro('panelLocalStorePro');
    }
}
export function changePanelLabPro(this_) {
    var _this = $(this_);
    if (_this.is(':checked')) {
        setOptionsPro('panelLabPro', true);
    } else {
        removeOptionsPro('panelLabPro');
    }
}
export function setSortDivPanel() {
    if (getOptionsPro('panelSortPro')) {
        if ($('#panelHomePro').hasClass('ui-sortable')) {
            // console.log('### refresh #panelHomePro');
            setTimeout(function(){ 
                $('#panelHomePro').sortable().sortable('refresh');
                controleSortDivPanel();
            }, 1000);
        } else {
            // console.log('### init #panelHomePro');
            $('#panelHomePro').sortable({
                items: '.panelHomePro',
                cursor: 'grabbing',
                handle: '.titlePanelHome',
                forceHelperSize: true,
                opacity: 0.5,
                update: function(event, ui) {
                    var orderPanelHome = [];
                    $('.panelHomePro').each(function(index){
                        //$(this).find('.infraBarraLocalizacao').append('<span>'+index+'</span>');
                        orderPanelHome.push({name: $(this).attr('id'), index: index});
                        $(this).data('order', index).attr('data-order', index);
                    });
                    console.log(orderPanelHome);
                    setOptionsPro('orderPanelHome',orderPanelHome);
                }
            });
            controleSortDivPanel();
        }
    }
}
export function controleSortDivPanel() {
    $('#panelHomePro .titlePanelHome').unbind().mouseenter(function() {
        // console.log('enable');
        $('#panelHomePro').sortable('enable');
    }).mouseleave(function() {
        // console.log('disable');
        $('#panelHomePro').sortable('disable');
    });
}
export function forcePlaceHoldChosen() {
    $('select').each(function(){
        var _this = $(this);
        var placeholder = _this.data('placeholder');
            placeholder = (typeof placeholder !== 'undefined') ? placeholder : false;
        if (placeholder) {
            setPlaceHoldChosen(this);
            _this.unbind().on('change', function() {
                setPlaceHoldChosen(this);
            })
        }
    });
}
export function setPlaceHoldChosen(this_) {
    var emptyvalue = ($(this_).val() !== null) ? $(this_).val().trim() : '';
        emptyvalue = (emptyvalue == '0' || emptyvalue == '') ? true : false;
    var placeholder = $(this_).data('placeholder');
        placeholder = (typeof placeholder !== 'undefined') ? placeholder : false;
    var chosenMin = $(this_).hasClass('chosen-min');
    var id = $(this_).attr('id');
        id = (typeof id !== 'undefined') ? id+'_chosen' : false;
    if (id && $('#'+id).length > 0 && emptyvalue && placeholder) {
        $('#'+id).find('.chosen-single span').text(placeholder);
        if (chosenMin) $('#'+id).addClass('chosen-min');
    }
}
export function initChosenReplace(mode, this_ = false, force = false, TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    if (typeof $().chosen !== 'undefined') {
        var _this = $(this_);
        var _parent = (_this.closest('.popup-wrapper').length > 0) ? _this.closest('.popup-wrapper') : _this.closest('.ui-dialog');
            _parent = (typeof _parent !== 'undefined' && _parent.length) ? _parent : _this.closest('.cke_dialog');
        if  (mode == 'panel') {
            $('.panelHome select')
                .not('[multiple]')
                .filter(function() { 
                    return !($(this).css('visibility') == 'hidden' || $(this).css('display') == 'none') || force
                })
                .chosen({
                placeholder_text_single: ' ',
                no_results_text: 'Nenhum resultado encontrado',
                normalize_search_text: function(text) {
                    return removeAcentos(text.toLowerCase());
                }
            });
        } else if (mode == 'box_init') {
            _parent.find('select')
                .not('[multiple]')
                .filter(function() { 
                    return !($(this).css('visibility') == 'hidden' || $(this).css('display') == 'none') || force
                })
                .chosen({
                    placeholder_text_single: ' ',
                    no_results_text: 'Nenhum resultado encontrado',
                    normalize_search_text: function(text) {
                        return removeAcentos(text.toLowerCase());
                    }
            });
        } else if (mode == 'box_multiple') {
            _parent.find('select')
                .filter(function() { 
                    return !($(this).css('visibility') == 'hidden' || $(this).css('display') == 'none') || force
                })
                .chosen({
                    placeholder_text_single: ' ',
                    no_results_text: 'Nenhum resultado encontrado',
                    normalize_search_text: function(text) {
                        return removeAcentos(text.toLowerCase());
                    }
            });
        } else if (mode == 'box_refresh') {
            _parent.find('select')
                .not('[multiple]')
                .filter(function() { 
                    return !($(this).css('visibility') == 'hidden' || $(this).css('display') == 'none') || force
                })
                .trigger('chosen:updated');
        } else if (mode == 'box_reload') {
            _parent.find('select')
                .not('[multiple]')
                .filter(function() { 
                    return !($(this).css('visibility') == 'hidden' || $(this).css('display') == 'none') || force
                })
                .chosen("destroy")
                .chosen({
                    placeholder_text_single: ' ',
                    no_results_text: 'Nenhum resultado encontrado',
                    normalize_search_text: function(text) {
                        return removeAcentos(text.toLowerCase());
                    }
            });
        }
        chosenReparePosition();
    } else {
        if (typeof $().chosen === 'undefined' && typeof URL_SPRO !== 'undefined') { 
            $.getScript(URL_SPRO+"js/lib/chosen.jquery.min.js");
        }
        setTimeout(function(){ 
            initChosenReplace(mode, this_, force, TimeOut - 100); 
            if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage'))console.log('Reload initChosenReplace'); 
        }, 500);
    }
}
export function chosenReparePosition(target = $('body')) {
    target.find('.chosen-container').each(function(){
            var id = $(this).attr('id');
                id = (typeof id !== 'undefined') ? id.replace('_chosen', '') : false;
            if (id && target.find('#'+id).css('position') == 'absolute') {
                var cssElem = {
                    'position': 'absolute',
                    'left': target.find('#'+id).css('left'),
                    'top': target.find('#'+id).css('top')
                }
                $(this).css(cssElem);
            }
        });
}
export function setMenuSistemaView(force = false) {
    /*
    var checkMenu = $('#divInfraAreaTelaE').is(':visible');
    $('#divInfraAreaTelaD').css('width',(checkMenu ? '79%' : '99%'));
    if (checkMenu || force) {
        // removeOptionsPro('panelMenuSistemaView');
        $('#divInfraAreaTelaE').removeClass('menuSuspenso');
        $('#divInfraBarraSistemaE').removeClass('barSuspenso').removeClass('barSuspenso_show');
    } else {
        // setOptionsPro('panelMenuSistemaView', 'active');
        $('#divInfraAreaTelaE').addClass('menuSuspenso');
        $('#divInfraBarraSistemaE').addClass('barSuspenso');
    }
    */
}
export function hideMenuSistemaView() {
    /*
    if ($('#divInfraAreaTelaE').length > 0) {
        $('#lnkInfraMenuSistema').unbind().on("click", function () {
            setMenuSistemaView();
        });
        if (getOptionsPro('panelMenuSistemaView') == 'active' && !$('#divInfraAreaTelaE').is(':visible')) {
            $('#divInfraAreaTelaE').addClass('menuSuspenso');
            $('#divInfraBarraSistemaE').addClass('barSuspenso').removeClass('barSuspenso_show');
        }
        $('#divInfraBarraSistemaE').unbind().on('click', function(event){
            event.stopPropagation();
            event.preventDefault();
            if (!delayCrash) {
                var menu = $('#divInfraAreaTelaE');
                if (!$(this).hasClass('barSuspenso')) {
                    $(this).addClass('barSuspenso');
                    menu.addClass('menuSuspenso');
                    setOptionsPro('panelMenuSistemaView', 'active');
                    $('#divInfraAreaTelaD').css('width','99%');
                }
                $('body').addClass('seiSlim_hidemenu');
                if (menu.is(':visible')) {
                    menu.hide("slide", { direction: "left" }, 300);
                    $(this).removeClass('barSuspenso_show');
                } else {
                    menu.show("slide", { direction: "left" }, 300);
                    $(this).addClass('barSuspenso_show');
                }
                delayCrash = true;
                setTimeout(function(){ delayCrash = false }, 300);
            }
        });
    }
    */
}
export function checkMenuSistemaView() {
    if ($('#divInfraAreaTelaE').is(':visible')) {
        $('body').removeClass('seiSlim_hidemenu');
    } else {
        $('body').addClass('seiSlim_hidemenu');
    }
}
export function checkboxRangerSelectShift(elemSelect = false) {
    var elem = (elemSelect) ? $(elemSelect) : $('body');
    var $chkboxes = $('input[type="checkbox"]'); 
    var lastChecked = null;
    $chkboxes.unbind().on('click',function(e) {
        if (!lastChecked) {
            lastChecked = this;
            return;
        }
        if (e.shiftKey) {
            var start = $chkboxes.index(this);
            var end = $chkboxes.index(lastChecked);
            $chkboxes.slice(Math.min(start,end), Math.max(start,end)+ 1).trigger('click');
            this.click();
            $chkboxes.eq(end).trigger('click');
        }
        lastChecked = this;
    });
}
export function corrigeTableSEI(elementSelect) {
    $(elementSelect).each(function() {
        var thead = $(this).find('thead');
        if (thead.length == 0) {
            if (typeof $(this).attr('id') === 'undefined') {
                $(this).attr('id','infraTable_'+randomString(4));
            }
            $("<thead></thead>").insertBefore($(this).find('tbody')).append($(this).find('tbody>tr:first-child'));
        } else if (thead.find('tr').length == 0) {
            // thead existe mas está vazia (caso SEI 4.x) — move a primeira linha do tbody
            thead.append($(this).find('tbody>tr:first-child'));
        }
    });
}
export function rememberScroll(elementScroll, nameScroll, animated = true) {
    var scrollPos = getOptionsPro('rememberScroll_'+nameScroll);
    if (getOptionsPro('rememberScroll_'+nameScroll)) {
        if (animated) {
            $(elementScroll).animate({
                scrollTop: scrollPos
            }, 500);
        } else {
            $(elementScroll).scrollTop(scrollPos);
        }
    }
}
export function scrollToElement(container, scrollToElem, stick = 0) {
    // console.log(scrollToElem[0], scrollToElem.offset().top, container.offset(), container.scrollTop());
    if (typeof scrollToElem.offset() !== 'undefined') {
        container.animate({
            scrollTop: scrollToElem.offset().top - container.offset().top + container.scrollTop() - stick
        });
    }
}
export function scrollToElementArvore(id_documento) {
    var ifrArvore = $('#ifrArvore').contents();
    if (ifrArvore.length && ifrArvore.find('#anchor'+id_documento).length) {
        ifrArvore.find('html').animate({
            scrollTop: ifrArvore.find('#anchor'+id_documento).offset().top
        });
    }
}
export function resetDialogBoxPro(elementBox) {
    if (elementBox == 'alertBoxPro' && alertBoxPro) { 
        alertBoxPro.dialog('destroy');
        alertBoxPro = false;
        $('.alertaBoxDiv').remove();
    } else if (elementBox == 'dialogBoxPro' && dialogBoxPro) { 
        dialogBoxPro.dialog('destroy');
        dialogBoxPro = false;
        $('.dialogBoxDiv').remove();
    } else if (elementBox == 'configBoxPro' && configBoxPro) { 
        configBoxPro.dialog('destroy');
        configBoxPro = false;
        $('.configBoxProDiv').remove();
    } else if (elementBox == 'iframeBoxPro' && iframeBoxPro) { 
        iframeBoxPro.dialog('destroy');
        iframeBoxPro = false;
        $('.iframeBoxDiv').remove();
    } else if (elementBox == 'editorBoxPro' && editorBoxPro) { 
        editorBoxPro.dialog('destroy');
        editorBoxPro = false;
        $('.editorBoxProDiv').remove();
    }
    if (typeof infraTooltipOcultar === 'function') infraTooltipOcultar();
    dialogIsDraggable = false;
}
export function isDialogDraggable() {
    $('.ui-dialog:visible').draggable({
        stop: function() {
            dialogIsDraggable = true;
        }
    });
}
export function updateDadosProcesso(idElement, value, callback = false) {
    if ( $('#frmCheckerProcessoPro').length == 0 ) { getCheckerProcessoPro(); }
    var url = dadosProcessoPro.propProcesso.action;
    if (typeof url !== 'undefined' && url != '') {
        $('#frmCheckerProcessoPro').attr('src', url).unbind().on('load', function(){
            var iframe = $(this).contents();
                iframe.find('#'+idElement).val(value);
                $(this).unbind();
                iframe.find('#btnSalvar, #sbmSalvar').trigger('click');
                if (typeof callback === 'function') callback();
        });
    } else {
        return false;
    }
}
export function getLinksProcessoAjax(id_procedimento, callback) {
    var href = url_host.replace('controlador.php','')+'controlador.php?acao=procedimento_trabalhar&id_procedimento='+String(id_procedimento);
    if (href !== null) {
        $.ajax({ url: href }).done(function (html) {
            var $html = $(html);
            var urlArvore = $html.find("#ifrArvore").attr('src');
            $.ajax({ url: urlArvore }).done(function (htmlArvore) {
                if (typeof callback === 'function') callback(getLinksArvoreAjax(htmlArvore));
            });
        });
    }
}
export function getHistoricoProcessoUrlAjax(htmlArvore) {
    var $htmlArvore = $(htmlArvore);
    if (SeiPro.sei.adapter.isNewSEI() && getSeiVersionPro() && compareVersionNumbers(getSeiVersionPro(),'4.1.0') >= 0) {
        var onclick = $htmlArvore.find('#divConsultarAndamento a').attr('onclick');
        if (typeof onclick !== 'undefined' && onclick !== '') {
            return onclick.split("'")[1];
        }
    }
    var urlHistorico = false;
    $htmlArvore.filter('script').add($htmlArvore.find('script')).each(function(){
        if (urlHistorico || typeof $(this).attr('src') !== 'undefined' || $(this).html().indexOf('consultarAndamento') === -1) return;
        var links = $.map($(this).html().split("'"), function(substr, i) {
            return (i % 2 && substr.indexOf('controlador.php?acao=') !== -1) ? substr : null;
        });
        $.each(links, function(index, value){
            if (value.indexOf('?acao=procedimento_consultar_historico') !== -1) {
                urlHistorico = value;
                return false;
            }
        });
    });
    return urlHistorico;
}
export function getAcompanhamentoEspecialAjax(htmlArvore) {
    var $htmlArvore = $(htmlArvore);
    var acompEsp = $htmlArvore.find('a[href*="controlador.php?acao=acompanhamento_cadastrar"]').eq(0);
    if (!acompEsp.length) return '';
    var title = '';
    var imgTitle = acompEsp.find('img').attr('title');
    if (typeof imgTitle !== 'undefined' && imgTitle !== '') {
        title = imgTitle.split(/\r?\n|\r|\n/g)[1] || imgTitle;
    }
    return {url: acompEsp.attr('href'), title: title};
}
export function getTiposDocumentosAjax(hrefPesquisa, callback = false) {
    if (typeof hrefPesquisa === 'undefined' || hrefPesquisa === null || hrefPesquisa === '') {
        if (typeof callback === 'function') callback([]);
        return;
    }
    $.ajax({ url: hrefPesquisa }).done(function (html) {
        var tiposDocumentos = [];
        $(html).find('#selSeriePesquisa option').each(function(){
            var id = $(this).attr('value');
            var name = $(this).text().trim();
            if (name !== '') {
                tiposDocumentos.push({id: id, name: name});
            }
        });
        dadosProcessoPro.tiposDocumentos = tiposDocumentos;
        setSessionProcessosPro(dadosProcessoPro);
        if (typeof callback === 'function') callback(tiposDocumentos);
    });
}
export function getDadosAjaxMonitoradoPro(idProcedimento) {
    if (typeof idProcedimento === 'undefined' || idProcedimento === null || idProcedimento === '') return;
    var href = url_host.replace('controlador.php','')+'controlador.php?acao=procedimento_trabalhar&id_procedimento='+String(idProcedimento);
    dadosProcessoPro.listAndamento = {
        historico_completo: false,
        processo: '',
        id_procedimento: String(idProcedimento),
        andamento: []
    };
    dadosProcessoPro.tiposDocumentos = [];
    dadosProcessoPro.listDocumentosAssinados = [];
    setSessionProcessosPro(dadosProcessoPro);
    $.ajax({ url: href }).done(function (html) {
        var $html = $(html);
        var urlArvore = $html.find('#ifrArvore').attr('src');
        var hrefPesquisa = $html.find('a[href*="acao=protocolo_pesquisar"], a[href*="acao=protocolo_pesquisa"]').eq(0).attr('href');
        if (typeof hrefPesquisa !== 'undefined' && hrefPesquisa !== '') {
            getTiposDocumentosAjax(hrefPesquisa);
        }
        if (typeof urlArvore === 'undefined' || urlArvore === '') {
            setSessionProcessosPro(dadosProcessoPro);
            return;
        }
        $.ajax({ url: urlArvore }).done(function (htmlArvore) {
            var arrayLinksArvore = getLinksArvoreAjax(htmlArvore);
            var hrefProcesso = null;
            var hrefDocumentos = null;
            $.each(arrayLinksArvore, function(index, value){
                if (hrefProcesso === null && value.url && (value.url.indexOf('acao=procedimento_alterar') !== -1 || value.url.indexOf('acao=procedimento_consultar') !== -1)) {
                    hrefProcesso = value.url;
                }
                if (hrefDocumentos === null && value.url && value.url.indexOf('acao=procedimento_gerar_pdf') !== -1) {
                    hrefDocumentos = value.url;
                }
            });
            var arrayAcompEsp = getAcompanhamentoEspecialAjax(htmlArvore);
            var hrefHistorico = getHistoricoProcessoUrlAjax(htmlArvore);

            dadosProcessoPro.listLinks = arrayLinksArvore;
            setSessionProcessosPro(dadosProcessoPro);

            if (hrefProcesso) {
                ajaxDadosProcessoPro(hrefProcesso, 'monitorados', arrayAcompEsp, function(processo) {
                    if (typeof dadosProcessoPro.listAndamento === 'undefined') {
                        dadosProcessoPro.listAndamento = {
                            historico_completo: false,
                            processo: (typeof processo.txtProtocoloExibir !== 'undefined' && processo.txtProtocoloExibir !== '') ? processo.txtProtocoloExibir : processo.hdnProtocoloFormatado,
                            id_procedimento: (typeof processo.hdnIdProcedimento !== 'undefined' && processo.hdnIdProcedimento !== '') ? processo.hdnIdProcedimento : String(idProcedimento),
                            andamento: []
                        };
                    }
                    setSessionProcessosPro(dadosProcessoPro);
                });
            }
            if (hrefDocumentos) {
                ajaxDadosDocumentosPro(hrefDocumentos, 'monitorados');
            } else {
                dadosProcessoPro.listDocumentosAssinados = [];
                setSessionProcessosPro(dadosProcessoPro);
            }
            if (hrefHistorico) {
                getDadosAndamentoPro(hrefHistorico);
            }
        });
    });
}
