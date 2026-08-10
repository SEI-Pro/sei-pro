// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/**
 * Sei Functions Pro — slim UI, unidade, dark mode, icons.
 * (ponte temporária: jQuery/DOM legado; fatia do antigo body.js)
 */
import {
    alertaBoxPro,
    checkLoadJqueryUI,
    checkLoadingButtonConfirm,
    getIDProtocoloSEI,
    getProcessoUnidadePro,
    loadingButtonConfirm,
    resetDialogBoxPro,
    waitLoadPro
} from '../../shared/sei-runtime/deps.js';

export function openStyleBoxSlimPro() {
    checkLoadJqueryUI(openStyleBoxSlimPro_);
}
export function openStyleBoxSlimPro_() {
try {
    if (localStorage.getItem('seiSlim')) {
        sessionStorageRemovePro('seiSlim_openBox');
        var oldColorPage = getOptionsPro('oldColorPage');
        var colorSlim = (getOptionsPro('colorSlimPro')) 
                        ? getOptionsPro('colorSlimPro') 
                        : (oldColorPage) ? oldColorPage : '#0494c7';

            if (!getOptionsPro('colorSlimPro') && oldColorPage) {
                setColorSlimPro(oldColorPage);
            }

        var htmlBox =   '<table style="font-size: 10pt;width: 100%;" class="seiProForm tableInfo">'+
                        '      <tr>'+
                        '          <td style="vertical-align: bottom; text-align: left;" class="label">'+
                        '               <label for="colorPalette"><i class="iconPopup iconSwitch fas fa-palette azulColor"></i>Cor personalizada:</label>'+
                        '           </td>'+
                        '           <td style="text-align: right;">'+
                        '               <input type="color" id="colorPalette" value="'+colorSlim+'" onchange="_setColorSlimPro(this)">'+
                        '           </td>'+
                        '      </tr>'+
                        '      <tr>'+
                        '          <td style="vertical-align: bottom; text-align: left;" class="label">'+
                        '               <label for="iconLabel"><i class="iconPopup iconSwitch fas fa-text-width azulColor"></i>\u00CDcones com legenda:</label>'+
                        '           </td>'+
                        '           <td style="text-align: right;">'+
                        '              <div class="onoffswitch" style="float: right;">'+
                        '                  <input type="checkbox" onchange="setIconLabel(this)" name="onoffswitch" class="onoffswitch-checkbox" id="iconLabel" '+(localStorage.getItem('iconLabel') ? 'checked' : '')+'>'+
                        '                  <label class="onoff-switch-label" for="iconLabel"></label>'+
                        '              </div>'+
                        '           </td>'+
                        '      </tr>'+
                        '      <tr>'+
                        '          <td style="vertical-align: bottom; text-align: left;" class="label">'+
                        '               <label for="darkModePro"><i class="iconPopup iconSwitch fas fa-moon azulColor"></i>Modo noturno:</label>'+
                        '           </td>'+
                        '           <td style="text-align: right;">'+
                        '              <div class="onoffswitch" style="float: right;">'+
                        '                  <input type="checkbox" onchange="setDarkModePro(this)" name="onoffswitch" class="onoffswitch-checkbox" id="darkModePro" '+(localStorage.getItem('darkModePro') ? 'checked' : '')+'>'+
                        '                  <label class="onoff-switch-label" for="darkModePro"></label>'+
                        '              </div>'+
                        '           </td>'+
                        '      </tr>'+
                        '      <tr>'+
                        '          <td style="vertical-align: bottom; text-align: left;" class="label">'+
                        '               <label for="seiBtnRight"><i class="iconPopup iconSwitch fas fa-grip-vertical azulColor"></i>Barra de Bot\u00F5es na Vertical:</label>'+
                        '           </td>'+
                        '           <td style="text-align: right;">'+
                        '              <div class="onoffswitch" style="float: right;">'+
                        '                  <input type="checkbox" onchange="setBtnRight(this)" name="onoffswitch" class="onoffswitch-checkbox" id="seiBtnRight" '+(localStorage.getItem('seiBtnRight') ? 'checked' : '')+'>'+
                        '                  <label class="onoff-switch-label" for="seiBtnRight"></label>'+
                        '              </div>'+
                        '           </td>'+
                        '      </tr>'+
                        '</table>'+ 
                        '</div>';

        dialogBoxPro = $('#dialogBoxPro')
            .html('<div class="dialogBoxDiv">'+htmlBox+'</div>')
            .dialog({
                title: "Cor Principal do Layout",
                width: 300
            });
    } else {
        $('#changeSlimPro').trigger('click');
    }
} catch (e) { /* seiSlim resize bind deferred */ }
}
export function changeSlimPro(this_) {
    if ($(this_).is(':checked')) {
        localStorageStorePro('seiSlim', true);
        sessionStorageStorePro('seiSlim_openBox', true);
        setOptionsPro('oldColorPage',rgbToHexString($('.infraAreaGlobal').css('border-left-color')));
    } else {
        localStorageRemovePro('seiSlim');
        sessionStorageRemovePro('seiSlim_openBox');
        removeOptionsPro('oldColorPage');
        removeOptionsPro('colorSlimPro');
        removeOptionsPro('iframeSizeSlimPro');
        localStorage.removeItem('iconLabel');
        localStorage.removeItem('darkModePro');
        localStorage.removeItem('seiBtnRight');
    }
    window.location.reload();
}
export function _setColorSlimPro(this_) {
    var _this = $(this_)
    var backgroundColor = _this.val();
    setColorSlimPro(backgroundColor);
}
export function setColorSlimPro(backgroundColor) {
    var color = (getBrightnessColor(backgroundColor) > 125) ? '#515151' : '#ffffff';
    $('head').find('style[data-style="seipro-colorpage"]').remove();
    $('head').prepend(  "<style type='text/css' data-style='seipro-colorpage'> "
                        +"  .seiSlim .infraAcaoBarraSistema a.iconBoxSlim i.fas {\n"
                        +"      background: -webkit-gradient(linear, left top, left bottom, from("+color+"), to("+color+"));\n"
                        +"      -webkit-background-clip: text;\n"
                        +"  }\n"
                        +"  .seiSlim.dark-mode .panelHome .iconBoxSlim:hover .newIconTitle, \n"
                        +"  .seiSlim #divInfraAreaTelaE "+(SeiPro.sei.adapter.isNewSEI() ? '#infraMenu' : '#main-menu')+" li a:hover:before { \n"
                        +"      color: "+color+" !important;\n"
                        +"  }\n"
                        +"  .seiSlim #divInfraAreaTelaE "+(SeiPro.sei.adapter.isNewSEI() ? '#infraMenu' : '#main-menu')+" li a:before { \n"
                        +"      color: "+backgroundColor+" !important;\n"
                        +"  }\n"
                        +"  .seiSlim.seiSlim_parent div#divInfraBarraSistemaPadrao, \n"
                        +"  .seiSlim.seiSlim_parent div#divInfraBarraSistema { \n"
                        +"      box-shadow: "+addAlpha(color,0.5)+" 0px -5px 6px -3px inset;\n"
                        +"  }\n"
                        +"  .seiSlim.seiSlim_parent div#divInfraBarraSistemaPadrao, \n"
                        +"  .seiSlim.seiSlim_parent div#divInfraBarraSistema, \n"
                        +"  .seiSlim.seiSlim_parent div#divInfraBarraSuperior,\n"
                        +"  .seiSlim .infraAreaDados a.ancoraPadraoPreta:hover, \n"
                        +"  .seiSlim.dark-mode .infraAreaDados a.ancoraPadraoPreta:hover, \n"
                        +"  .seiSlim.dark-mode a.newLink:hover, \n"
                        +"  .seiSlim.dark-mode .panelHome .iconBoxSlim:hover, \n"
                        +"  .seiSlim.dark-mode .iconBoxSlim.botaoSEI:hover, \n"
                        +"  .seiSlim .iconBoxSlim.botaoSEI:hover {\n"
                        +"      background: "+backgroundColor+" !important;\n"
                        +"  }\n"
                        +"  .seiSlim.dark-mode #divInfraAreaTelaE "+(SeiPro.sei.adapter.isNewSEI() ? '#infraMenu' : '#main-menu')+" li a:hover,\n"
                        +"  .seiSlim "+divComandos+" a.botaoSEI:hover,\n"
                        +"  .seiSlim #divInfraAreaTelaE "+(SeiPro.sei.adapter.isNewSEI() ? '#infraMenu' : '#main-menu')+" li a:hover {\n"
                        +"      background: "+backgroundColor+" !important;\n"
                        +"      color: "+color+" !important;\n"
                        +"  }\n"
                        +"  .seiSlim .infraAcaoBarraSistema a::before,\n"
                        +"  .seiSlim #divComandos a.botaoSEI:hover:before,\n"
                        +"  .seiSlim .infraAreaDados a.ancoraPadraoPreta:hover,\n"
                        +"  .seiSlim .infraAreaDados a.ancoraPadraoPreta:hover:before,\n"
                        +"  div"+infraBarraS+".barSuspenso::before {\n"
                        +"      color: "+color+" !important;\n"
                        +"      border-color: "+backgroundColor+" !important;\n"
                        +"  }\n"
                        +"  .seiSlim .iconBoxSlim:not(.newLink) .fas {\n"
                        +"      color: "+backgroundColor+" !important;\n"
                        +"      -webkit-background-clip: text;\n"
                        +"  }\n"
                        +"  .seiSlim .iconBoxSlim.botaoSEI:hover i.fas, \n"
                        +"  .seiSlim #divInfraAreaTelaE "+(SeiPro.sei.adapter.isNewSEI() ? '#infraMenu' : '#main-menu')+" li a:hover i.fas, \n"
                        +"  .seiSlim.dark-mode #divInfraAreaTelaE "+(SeiPro.sei.adapter.isNewSEI() ? '#infraMenu' : '#main-menu')+" li a:hover i.fas, \n"
                        +"  .seiSlim.dark-mode .iconBoxSlim.botaoSEI:hover .newIconTitle, \n"
                        +"  .seiSlim .iconBoxSlim.botaoSEI:hover .newIconTitle {\n"
                        +"      color: "+color+" !important;\n"
                        +"      background: -webkit-gradient(linear, left top, left bottom, from("+color+"), to("+color+"));\n"
                        +"      -webkit-background-clip: text;\n"
                        +"  }\n"
                        +"  .seiSlim #divInfraAreaTelaE "+(SeiPro.sei.adapter.isNewSEI() ? '#infraMenu' : '#main-menu')+" li a i.fas {\n"
                        +"      background: -webkit-gradient(linear, left top, left bottom, from("+backgroundColor+"), to("+backgroundColor+"));\n"
                        +"      -webkit-background-clip: text;\n"
                        +"  }\n"
                        +"</style>");
    if (getBrightnessColor(backgroundColor) > 125) {
        $(infraBarraS).addClass('dark');
    } else {
        $(infraBarraS).removeClass('dark');
    }
    setOptionsPro('colorSlimPro',backgroundColor);
}
export function setIconLabel(this_) {
    if ($(this_).is(':checked')) {
        localStorage.setItem('iconLabel',true);
    } else {
        localStorage.removeItem('iconLabel');
    }
    window.location.reload();
}
export function setBtnRight(this_) {
    if ($(this_).is(':checked')) {
        localStorage.setItem('seiBtnRight',true);
    } else {
        localStorage.removeItem('seiBtnRight');
    }
    window.location.reload();
}
export function initToolbarOnTop() {
    var toolbar = $(divComandos);
    if (toolbar.length) {
        var topWindow = SeiPro.sei.adapter.isNewSEI() ? 80 : 200;
        var topElement = toolbar.offset().top;
            topElement = topElement-topWindow;
        var toolbarFixedSelector = divComandos + '.fixed';
        var updateToolbarFixedPosition = function() {
            if (!SeiPro.sei.adapter.isNewSEI() || divComandos !== '#divBotoesControleProcessos') return;
            var fixedToolbar = $(toolbarFixedSelector);
            var menuButton = $('#divInfraBarraSistemaPadraoD #lnkInfraMenuSistema:visible').first();
            if (!menuButton.length) {
                menuButton = $('#lnkInfraMenuSistema:visible').first();
            }
            if (!fixedToolbar.length || !menuButton.length) return;

            var menuOffset = menuButton.offset();
            if (!menuOffset) return;
            var toolbarWidth = fixedToolbar.outerWidth(true) || fixedToolbar.outerWidth() || 0;

            fixedToolbar.css({
                display: 'inline-flex',
                right: 'auto',
                left: Math.max(12, Math.round(menuOffset.left - toolbarWidth - 12)) + 'px',
                width: 'max-content',
                whiteSpace: 'nowrap',
                transform: 'none'
            });
        };
        $(SeiPro.sei.adapter.isNewSEI() ? '#divInfraAreaTelaD' : window).scroll(function(){
            if ($(this).scrollTop() > topWindow) {
                delayCrash = true;
                setTimeout(function(){ delayCrash = false }, 300);
                if ($(toolbarFixedSelector).length == 0) {
                    $(divComandos).before($(divComandos).clone()).addClass('fixed');
                }
                updateToolbarFixedPosition();
            } else {
                if (!delayCrash || $(this).scrollTop() <= topWindow) {
                    $(toolbarFixedSelector).remove();
                }
            }
        });
        $(window).on('resize.seiProToolbarTop', function() {
            updateToolbarFixedPosition();
        });
    }
}
export function getUnidadesPermissaoSEI() {
    if (SeiPro.sei.adapter.isNewSEI()) {
        if (sessionStorageRestorePro('unidadesPermissaoSEIPro') !== null) {
            setSelectUnidadePro();
        } else {
            let url = $('a#lnkInfraUnidade').attr('onclick');
                url = typeof url !== 'undefined' ? url.split("'")[1] : false;
            if (url) {
                $.ajax({ 
                    url: url
                }).done(function (html) {
                    var $html = $(html);
                    var param = [];
                        $html.find('form#frmInfraSelecaoUnidade div#divInfraAreaTabela table tbody tr').each(function() {
                            let _this = $(this);
                            let id = _this.find('td').eq(0).find('a').attr('name');
                                id = typeof id !== 'undefined' ? parseInt(id.replace('ID-','')) : false;
                            let sigla = _this.find('td').eq(1).text();
                            let descricao = _this.find('td').eq(2).text();
                            let orgao = _this.find('td').eq(3).text();
                            if (id) {
                                param.push({
                                    id: id,
                                    sigla: sigla,
                                    descricao: descricao,
                                    orgao: orgao
                                });
                            }
                        });
                        sessionStorageStorePro('unidadesPermissaoSEIPro', param);
                        setSelectUnidadePro();
                });
            }
        }
    }
}
export function _changeUnidadeSEI(this_) {
    changeUnidadeSEI($(this_).data('url'), $(this_).val());
}
export function changeUnidadeSEI(url, idUnidade) {
    if (typeof url !== 'undefined') {
        $.ajax({ 
            url: url
        }).done(function (html) {
            let $html = $(html);
            let param = {};
            let form = $html.find('form#frmProcedimentoControlar');
                form.find("input[type=hidden]").map(function () {
                    if ( $(this).attr('name') && $(this).attr('id').indexOf('hdn') !== -1) {
                        param[$(this).attr('name')] = $(this).val(); 
                    }
                });
                param.selInfraUnidades = idUnidade;
                $.ajax({ 
                    method: 'POST',
                    data: param,
                    url: form.attr('action')
                }).done(function (html) {
                    window.location.reload();
                });
        });
    }
}
export function setSelectUnidadePro() {
    if (SeiPro.sei.adapter.isNewSEI()) {
        let url = $('a#lnkInfraUnidade').attr('onclick');
            url = typeof url !== 'undefined' ? url.split("'")[1] : false;
        let listUnidades = sessionStorageRestorePro('unidadesPermissaoSEIPro');
        let htmlOptionsUnidades = $.map(listUnidades,function(v){
                                let selected = $('#lnkInfraUnidade').text() == v.sigla ? 'selected' : '';
                                return `<option value="${v.id}" ${selected}>${v.sigla} (${v.orgao})</option>`  
                                }).join('');
        let htmlSelect = `<select data-url="${url}" style="width: 200px;" onchange="_changeUnidadeSEI(this)" id="changeUnidadeSEIPro">${htmlOptionsUnidades}</select>`;
        $('#changeUnidadeSEIPro').remove();
        $('#divInfraBarraSistemaPadraoD .input-group.align-self-center').html(htmlSelect);
        if (verifyConfigValue('substituiselecao') && typeof $().chosen === 'function') {
            $('#changeUnidadeSEIPro').chosen({
                placeholder_text_single: ' ', 
                no_results_text: 'Nenhum resultado encontrado',
                normalize_search_text: function(text) {
                    return removeAcentos(text.toLowerCase());
                }
            });
        }
    }
}
export function setDarkModePro(this_) {
    var _ifrVisualizacao = $($ifrVisualizacao);
    var _ifrArvore = $('#ifrArvore');
    var _ifrArvoreHtml = _ifrVisualizacao.contents().find($ifrArvoreHtml);

    if ($(this_).is(':checked') || $(this_).hasClass('fa-house-night')) {
        $('body').addClass('dark-mode');
        localStorage.setItem('darkModePro',true);
        if (_ifrVisualizacao.length > 0) _ifrVisualizacao.contents().find('body').addClass('dark-mode');
        if (_ifrArvore.length > 0) _ifrArvore.contents().find('body').addClass('dark-mode');
        if (_ifrArvoreHtml.length > 0) _ifrArvoreHtml.contents().find('body').addClass('dark-mode');
        $('#iconDarkMode').attr('class','fas fa-house-day brancoColor').attr('onmouseover','return infraTooltipMostrar(\'Desativar modo noturno\')');
    } else {
        $('body').removeClass('dark-mode');
        localStorage.removeItem('darkModePro');
        
        if (_ifrVisualizacao.length > 0) _ifrVisualizacao.contents().find('body').removeClass('dark-mode');
        if (_ifrArvore.length > 0) _ifrArvore.contents().find('body').removeClass('dark-mode');
        if (_ifrArvoreHtml.length > 0) _ifrArvoreHtml.contents().find('body').removeClass('dark-mode');
        $('#iconDarkMode').attr('class','fas fa-house-night brancoColor').attr('onmouseover','return infraTooltipMostrar(\'Ativar modo noturno\')');
    }
}
export function insertNewIcons() {
try {
    if (localStorage.getItem('seiSlim')) {
        waitLoadPro($($ifrVisualizacao).contents(), '#divArvoreAcoes', 'a[href*="controlador.php?acao="]', appendNewIcons);
    }
} catch (e) { /* seiSlim resize bind deferred */ }
}
export function appendStyleNewIcons(ifrVisualizacao, backgroundColor) {
    ifrVisualizacao.find('#divArvoreAcoes a').addClass('botaoSEI');

    if (ifrVisualizacao.find('style[data-style="seipro-styleicon"]').length == 0) {
        var color = (backgroundColor && getBrightnessColor(backgroundColor) > 125) ? '#515151' : '#ffffff';
        ifrVisualizacao.find('head').prepend("<style type='text/css' data-style='seipro-styleicon'>"
                        +"   body.seiSlim .iconBoxSlim.botaoSEI:hover {\n"
                        +"      background: "+backgroundColor+" !important;\n"
                        +"   }\n"
                        +"   .seiSlim .iconBoxSlim.botaoSEI:hover .newIconTitle, \n"
                        +"   .seiSlim .iconBoxSlim.botaoSEI:hover::before {\n"
                        +"      color: "+color+" !important;\n"
                        +"   }\n"
                        +"</style>");
        ifrVisualizacao.find('body').addClass('seiSlim').addClass('seiSlim_view');
        if (localStorage.getItem('darkModePro')) {
            ifrVisualizacao.find('body').addClass('dark-mode');
        }
        if (localStorage.getItem('seiBtnRight')) {
            ifrVisualizacao.find('body').addClass('seiBtnRight');
        }
        if (localStorage.getItem('iconLabel')) {
            ifrVisualizacao.find('body').addClass('seiIconLabel');
        }
    }
}
export function appendNewIcons(loop = true) {
    var ifrVisualizacao = $($ifrVisualizacao).contents();
    var colorSlim = (getOptionsPro('colorSlimPro')) ? getOptionsPro('colorSlimPro') : rgbToHexString(ifrVisualizacao.find('.infraCorBarraSistema').css('background-color'));
    
    appendStyleNewIcons(ifrVisualizacao, colorSlim);
    replaceNewIcons(ifrVisualizacao.find(`${infraBarraComandos} a.botaoSEI`));
    if (loop) {
        setTimeout(function () {
            appendNewIcons(false);
        },1500);
    }
}
export function replaceNewIcons(element) {
        element.find('.newIconTitle').remove();
        element.each(function(){
            var title = $(this).find('img').attr('title');
            $(this).addClass('iconBoxSlim');
            if (localStorage.getItem('iconLabel') && typeof title !== 'undefined' && title != '') { 
                $(this).addClass('iconLabel').append('<span class="newIconTitle">'+title+'</span>'); 
            } else {
                $(this).attr('onmouseover', 'return infraTooltipMostrar(\''+title+'\')').attr('onmouseout', 'return infraTooltipOcultar()');
            }
        });
}
export function replaceColorsIcons(element) {
    element.each(function(){
        var img = $(this).find('img').attr('src');
        if(typeof img !== 'undefined' && img != '') {
            var arrayTip = (typeof $(this).attr('onmouseover') !== 'undefined') ? extractTooltipToArray($(this).attr('onmouseover')) : ['',$(this).find('img').attr('title')];
            var colorTag = (typeof arrayTip !== 'undefined' && typeof arrayTip[1] !== 'undefined' && extractHexColor(arrayTip[1]) !== null) ? extractHexColor(arrayTip[1])[0] : false;
                colorTag = ($('#frmMarcadorLista').length) 
                            ? (extractHexColor($(this).closest('td').next().text())) ? extractHexColor($(this).closest('td').next().text())[0] : false
                            : colorTag;
                colorTag = ($(this).hasClass('dd-option')) 
                            ? (extractHexColor($(this).find('.dd-option-text').text())) ? extractHexColor($(this).find('.dd-option-text').text())[0] : false
                            : colorTag;
                colorTag = ($(this).hasClass('dd-selected')) 
                            ? (extractHexColor($(this).find('.dd-selected-text').text())) ? extractHexColor($(this).find('.dd-selected-text').text())[0] : false
                            : colorTag;
            var color = false;
                color = (img.indexOf('preto') !== -1) ? '#000000' : color;
                color = (img.indexOf('branco') !== -1) ? '#fbfbfe' : color;
                color = (img.indexOf('cinza') !== -1) ? '#c0c0c0' : color;
                color = (img.indexOf('vermelho') !== -1) ? '#ed1c24' : color;
                color = (img.indexOf('amarelo') !== -1) ? '#fff201' : color;
                color = (img.indexOf('verde') !== -1) ? '#0aff00' : color;
                color = (img.indexOf('azul') !== -1) ? '#4285f4' : color;
                color = (img.indexOf('rosa') !== -1) ? '#ff1cae' : color;
                color = (img.indexOf('roxo') !== -1) ? '#68329b' : color;
                color = (img.indexOf('ciano') !== -1) ? '#09ffff' : color;
                color = (colorTag) ? colorTag : color;
            var shadow = false;
                shadow = (img.indexOf('branco') !== -1) ? true : shadow;
                shadow = (img.indexOf('amarelo') !== -1) ? true : shadow;
            if (color) $(this).attr('data-color', true).css('color', color);
            if (shadow) $(this).attr('data-shadow', shadow);
        }
    })
}

// PESQUISA PROCESSOS POR LISTA
export var arrayProtocoloSEI = [];
export function loopIDProtocoloSEI(protocoloSEI, index, TimeOut = 200) {
    if (TimeOut <= 0) { 
        var next = index+1;
        var htmlTr =    '<tr>'+
                        '    <td style="font-size: 9pt; text-align: center;">'+arrayProtocoloSEI[index]+'</td>'+
                        '    <td style="font-size: 9pt; text-align: center;">ERROR</td>'+
                        '    <td style="font-size: 9pt; word-break: break-all;">-</td>'+
                        '</tr>';
        $('.tableResultProtocoloSEI').find('tbody').append(htmlTr);
        loopIDProtocoloSEI(arrayProtocoloSEI[next], next);
        return;
    }
    if (index < arrayProtocoloSEI.length) { 
        getIDProtocoloSEI(protocoloSEI,  
            function(html){
                let $html = $(html);
                var params = getParamsUrlPro($html.find('#ifrArvore').attr('src'));
                var next = index+1;
                loopIDProtocoloSEI(arrayProtocoloSEI[next], next);
                appendSearchProtocoloSEI(params, index);
            }, 
            function(){
                setTimeout(function(){ 
                    loopIDProtocoloSEI(arrayProtocoloSEI[index], index, TimeOut - 100); 
                    console.log('ERROR', 'Reload loopIDProtocoloSEI => '+TimeOut); 
                }, 500);
            });
    } else {
        setTimeout(function(){ 
            alertaBoxPro('Sucess', 'check-circle', 'Protocolos pesquisados com sucesso!', function(){ loadingButtonConfirm(false) });
            loadingButtonConfirm(false);
            $('.ui-dialog .ui-dialog-buttonset .confirm.ui-button').addClass('ui-state-active');
        }, 500);
    }

}
export function initBoxSearchProtocoloSEI() {
    resetDialogBoxPro();
    var htmlBox =   '<div class="searchProtocoloSEI" style="width: 100%; float: left;"><textarea placeholder="Insira os n\u00FAmeros de processo ou n\u00FAmeros SEI, um em cada linha..." id="searchProtocoloSEI" style="width: 90%; border: 2px solid #c5c5c5; height: 330px; border-radius: 5px;"></textarea></div>'+
                    '<div id="resultProtocoloSEI" class="resultProtocoloSEI" style="float: right; display: none;">'+
                    '    <div id="divResulProtocoloSEI" style="overflow-y: scroll; height: 300px;">'+
                    '       <table style="font-size: 9pt !important; width: 100%;" class="tableInfo tableZebra tableFollow seiProForm tableResultProtocoloSEI resultProtocoloSEI">'+
                    '           <thead>'+
                    '               <tr>'+
                    '                   <th class="tituloControle" style="width: 140px; padding: 5px 0px;">Protocolo</th>'+
                    '                   <th class="tituloControle" style="width: 90px; padding: 5px 0px;">Tipo</th>'+
                    '                   <th class="tituloControle" style="padding: 5px 0px;">Link Permanente</th>'+
                    '               </tr>'+
                    '           </thead>'+
                    '           <tbody>'+
                    '           </thead>'+
                    '       </table>'+
                    '    </div>'+
                    '    <div class="ui-dialog-buttonpane actionsResultProtocoloSEI">'+
                    '        <button type="button" class="ui-button ui-corner-all ui-widget" onclick="copyTableResultProtocoloSEI()">Copiar Tabela</button>'+
                    '        <button type="button" class="ui-button ui-corner-all ui-widget" onclick="downloadTableResultProtocoloSEI()">Baixar CSV</button>'+
                    '    </div>'+
                    '</div>';
    dialogBoxPro = $('#dialogBoxPro')
        .html('<div class="dialogBoxDiv">'+htmlBox+'</div>')
        .dialog({
            title: "Pesquisar Link Permanente",
            width: 300,
            open: function( event, ui ) {
                var processosTela = getProcessoUnidadePro();
                    processosTela = (processosTela.length > 0) ? processosTela.join('\n') : '';
                if (processosTela != '') { 
                    $('#searchProtocoloSEI').val(processosTela);
                }
            },
            close: function() { $('#configDatesBox').remove() },
            buttons: [{
                text: 'Limpar',
                click: function() {
                        cleanSearchProtocoloSEI();
                    }
                },{
                text: 'Pesquisar',
                class: 'confirm ui-state-active',
                click: function() {
                        initSearchProtocoloSEI();
                    }
                }]
        });
}
export function initSearchProtocoloSEI() {
    var lines = $('#searchProtocoloSEI').val().split(/\n/);
        arrayProtocoloSEI = [];
    for (var i=0; i < lines.length; i++) {
      if (/\S/.test(lines[i])) {
        arrayProtocoloSEI.push($.trim(lines[i]));
      }
    }
    if(arrayProtocoloSEI !== null && arrayProtocoloSEI.length > 0 && !checkLoadingButtonConfirm()) {
        loopIDProtocoloSEI(arrayProtocoloSEI[0], 0);
        $('.resultProtocoloSEI').show();
        $('.searchProtocoloSEI').css('width', '30%');
        $('#resultProtocoloSEI').css('width', '70%');
        dialogBoxPro.dialog( "option", "width", 900 );
        loadingButtonConfirm(true);
    }
}
export function cleanSearchProtocoloSEI() {
    $('.tableResultProtocoloSEI').find('tbody').html('');
    $('.resultProtocoloSEI').hide();
    $('.searchProtocoloSEI').css('width', '100%');
    $('#resultProtocoloSEI').css('width', '');
    dialogBoxPro.dialog( "option", "width", 300 );
    $('#searchProtocoloSEI').val('');
    loadingButtonConfirm(false);
    $('.ui-dialog .ui-dialog-buttonset .confirm.ui-button').addClass('ui-state-active');
}
export function appendSearchProtocoloSEI(params, index) {
    // var url_host = window.location.href.split('?')[0];
    var documento = (params.id_documento != '') ? '&id_documento='+String(params.id_documento) : '';
    var tipo = (params.id_documento != '') ? '<i class="far fa-file"></i> Documento' : '<i class="far fa-folder-open"></i> Protocolo';
    var href = url_host+'?acao=procedimento_trabalhar&id_procedimento='+String(params.id_procedimento)+documento;
    var htmlTr =    '<tr>'+
                    '    <td style="font-size: 9pt; text-align: center;">'+arrayProtocoloSEI[index]+'</td>'+
                    '    <td style="font-size: 9pt; text-align: center;">'+tipo+'</td>'+
                    '    <td style="font-size: 9pt; word-break: break-all;"><a style="text-decoration: underline; font-size: 9pt;" class="bLink" target="_blank" href="'+href+'">'+href+'</a></td>'+
                    '</tr>';
    $('.tableResultProtocoloSEI').find('tbody').append(htmlTr);
    var d = $('#divResulProtocoloSEI');
        d.scrollTop(d.prop("scrollHeight"));
}
