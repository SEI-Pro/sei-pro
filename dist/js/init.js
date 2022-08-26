$.getScript(getUrlExtension("js/lib/jquery-3.4.1.min.js"));
$.getScript(getUrlExtension("js/lib/jmespath.min.js"));
$.getScript(getUrlExtension("js/lib/moment.min.js"));
$.getScript(getUrlExtension("js/lib/moment-duration-format.min.js"));
$.getScript(getUrlExtension("js/lib/crypto-js.min.js"));
$.getScript(getUrlExtension("js/sei-functions-pro.js"));

function loadAPIGooglePro() {
    if ( $('head').find('script[data-config="config-apigoogle-seipro"]').length == 0 ) {
        var htmlScript = "<script data-config='config-apigoogle-seipro' async defer src=\"https://apis.google.com/js/api.js\" onload=\"this.onload=function(){};handleClientLoadPro()\" onreadystatechange=\"if (this.readyState === 'complete') this.onload()\"></script>";
        $(htmlScript).appendTo('head');
    }
}
/*
function loadAPIGooglePro(client_id) {
    $('[data-script-name="googleapi"]').remove();
    var tagScriptApi = '<script data-script-name="googleapi" src="https://apis.google.com/js/api.js" async defer></script>';
    var tagScriptLogin = '<script data-script-name="googleapi" src="https://accounts.google.com/gsi/client" async defer></script>';
    var metaLogin = '<div class="sheetsLoginPro" style="display: inline-block;vertical-align: middle;">'+
                    '   <div id="g_id_onload" '+
                    '       data-callback="handleClientLoadPro" '+
                    '       data-client_id="444596184286-2g4m3ktqc2neuntba0a3j9eh5rk5r4c8.apps.googleusercontent.com"'+
                    '       data-context="use"'+
                    '       data-ux_mode="popup"'+
                    '       data-auto_prompt="true"'+
                    '       data-auto_select="true"'+
                    '   ></div>'+
                    '   <div class="g_id_signin" '+
                    '       data-type="icon"'+
                    '       data-shape="circle"'+
                    '       data-theme="outline"'+
                    '       data-text="$ {button.text}"'+
                    '       data-size="large"'+
                    '   ></div>'+
                    '</div>';
    $('.sheetsLoginPro').remove();
    $(tagScriptApi+tagScriptLogin).appendTo('head');
    $('#divInfraBarraSistemaD').prepend(metaLogin);
}
*/
function divIconsLoginPro() {
    var html_initLogin = '<div class="infraAcaoBarraSistema sheetsLoginPro" style="display: inline-block;">'
                            +'  <a id="authorizeButtonPro" href="#" data-tippy-content="Conectar Base de Dados (SeiPro)" onmouseover="return infraTooltipMostrar(\'Conectar Base de Dados (SeiPro)\');" onmouseout="return infraTooltipOcultar();" style="display: none;"><i class="fas fa-toggle-off brancoColor"></i></a>'
                            +'  <a id="signoutButtonPro" href="#" data-tippy-content="Desconectar Base de Dados (SeiPro)" onmouseover="return infraTooltipMostrar(\'Conectado! Clique para desconectar Base de Dados (SeiPro)\');" onmouseout="return infraTooltipOcultar();" style="display: none;"><i class="fas fa-toggle-on brancoColor"></i></a>'
                            +'</div>';
    if ($('#divInfraBarraSistemaD').length > 0) {
        $('#divInfraBarraSistemaD').append(html_initLogin);
    } else if ($('#divInfraBarraSistemaPadraoD').length > 0) {
        $('#divInfraBarraSistemaPadraoD').append(html_initLogin);
    }
}
function classBodyPro() {
    var acao_pro = getParamsUrlPro(window.location.href).acao_pro;
    if (typeof acao_pro !== 'undefined') {
        $('body').addClass('SeiPro_'+acao_pro);
    }
}
function getUrlExtension(url) {
    if (typeof browser === "undefined") {
        return chrome.runtime.getURL(url);
    } else {
        return browser.runtime.getURL(url);
    }
}
function getManifestExtension() {
    if (typeof browser === "undefined") {
        return chrome.runtime.getManifest();
    } else {
        return browser.runtime.getManifest();
    }
}
function loadConfigPro() {
    if (typeof browser === "undefined") {
        chrome.storage.sync.get({
            dataValues: ''
        }, function(items) {  
            localStorage.setItem('configBasePro', items.dataValues);
            loadDataBaseProStorage(items);
        });
    } else {
        browser.storage.sync.get({
            dataValues: ''
        }, function(items) {  
            localStorage.setItem('configBasePro', items.dataValues);
            loadDataBaseProStorage(items);
        });
    }
}
function loadScriptDataBasePro(dataValues) { 
    var dataValues = localStorageRestorePro('configBasePro');
    var dataValues_ProjetosSheets = jmespath.search(dataValues, "[?baseTipo=='projetos'] | [?conexaoTipo=='sheets'] | [?API_KEY!='']");
    var dataValues_FormulariosSheets = jmespath.search(dataValues, "[?baseTipo=='formularios'] | [?conexaoTipo=='sheets'] | [?API_KEY!='']");
    var dataValues_ProcessosSheets = jmespath.search(dataValues, "[?baseTipo=='processos'] | [?conexaoTipo=='sheets'] | [?API_KEY!='']");
    var dataValues_AtividadesAPI = jmespath.search(dataValues, "[?baseTipo=='atividades'] | [?conexaoTipo=='api'||conexaoTipo=='googleapi']");
    // console.log(dataValues, dataValues_ProjetosSheets);
    if (dataValues_ProjetosSheets.length > 0 && checkConfigValue('gerenciarprojetos')) {
        loadDataBaseSheetsProjetosPro(dataValues_ProjetosSheets);
    } else {
        localStorageRemovePro('loadEtapasSheet');
    }
    if (dataValues_FormulariosSheets.length > 0 && checkConfigValue('gerenciarformularios')) {
        loadDataBaseSheetsFormulariosPro(dataValues_FormulariosSheets);
    } else {
        localStorageRemovePro('loadFormulariosSheet');
    }
    if (dataValues_ProcessosSheets.length > 0 && checkConfigValue('sincronizarprocessos')) {
        loadDataBaseSheetsProcessosPro(dataValues_ProcessosSheets);
    } else {
        localStorageRemovePro('loadSyncProcessosSheet');
    }
    if (dataValues_AtividadesAPI.length > 0 && checkConfigValue('gerenciaratividades')) {
        loadDataBaseApiAtividadesPro(dataValues_AtividadesAPI);
    } else {
        removeLocalStorageAtividades();
    }
}
function removeLocalStorageAtividades() { 
    localStorageRemovePro('configBasePro_atividades');
    localStorageRemovePro('configDataAtividadesPro');
    localStorageRemovePro('configDataAtividadesProcPro');
    removeOptionsPro('configBaseSelectedPro_atividades');
}
function loadDataBaseApiAtividadesPro(dataValues) { 
    var perfilSelected = (getOptionsPro('configBaseSelectedPro_atividades') && getOptionsPro('configBaseSelectedPro_atividades') <= dataValues.length) ? getOptionsPro('configBaseSelectedPro_atividades') : 0;
    var perfil = (dataValues && dataValues !== null && dataValues.length > 0 && typeof dataValues[perfilSelected] !== 'undefined' &&  typeof dataValues[perfilSelected].hasOwnProperty('KEY_USER')) 
                    ? dataValues[perfilSelected] 
                    : false;
    // console.log(perfil, perfilSelected, dataValues);
    if (perfil && checkConfigValue('gerenciaratividades')) {
        localStorage.setItem('configBasePro_atividades', JSON.stringify({URL_API: perfil.URL_API, KEY_USER: perfil.KEY_USER, CLIENT_ID: perfil.CLIENT_ID}));
    } else {
        removeLocalStorageAtividades();
    }
}
function loadDataBaseSheetsProjetosPro(dataValues) { 
            // dataValues = ( jmespath.search(dataValues, "[?baseTipo=='projetos'] | length(@)") > 0 ) ? jmespath.search(dataValues, "[?baseTipo=='projetos']") : dataValues;
        var dataPerfil = [];
        var perfilSelected = (getOptionsPro('configBaseSelectedPro')) ? getOptionsPro('configBaseSelectedPro') : 0;
        for (var i = 0; i < dataValues.length; i++) {
            if ( dataValues[i].baseName == perfilSelected || ( perfilSelected == 0 && i == 0 ) ) { dataPerfil = dataValues[i]; }
        }

        var spreadsheetIdProjetos_Pro = ( typeof dataPerfil.spreadsheetId !== 'undefined' ) ? "'"+dataPerfil.spreadsheetId+"'" : 'false';
        var CLIENT_ID_PRO = ( typeof dataPerfil.CLIENT_ID !== 'undefined' ) ? "'"+dataPerfil.CLIENT_ID+"'" : 'false';
        var API_KEY_PRO = ( typeof dataPerfil.API_KEY !== 'undefined' ) ? "'"+dataPerfil.API_KEY+"'" : 'false';

            var scriptText =    "<script data-config='base-projetos-seipro'>\n"+
                                "   var CLIENT_ID_PRO = "+CLIENT_ID_PRO+";\n"+
                                "   var API_KEY_PRO = "+API_KEY_PRO+";\n"+
                                "   var spreadsheetIdProjetos_Pro = "+spreadsheetIdProjetos_Pro+";\n"+
                                "</script>";
            $(scriptText).appendTo('head');

    if ( typeof dataPerfil.spreadsheetId !== 'undefined' ) {
            loadAPIGooglePro(CLIENT_ID_PRO);
            $.getScript(getUrlExtension("js/sei-gantt.js"));
        } else {
            console.log('loadDataBaseSheetsProjetosPro','ERROR!!!');
            localStorage.removeItem('loadEtapasSheet');
            removeOptionsPro('configBaseSelectedPro');
        }
}
function loadDataBaseSheetsFormulariosPro(dataValues) { 
        var dataPerfil = [];
        var perfilSelected = (getOptionsPro('configBaseSelectedFormPro')) ? getOptionsPro('configBaseSelectedFormPro') : 0;
        for (var i = 0; i < dataValues.length; i++) {
            if ( dataValues[i].baseName == perfilSelected || ( perfilSelected == 0 && i == 0 ) ) { dataPerfil = dataValues[i]; }
        }

        var spreadsheetIdFormularios_Pro = ( typeof dataPerfil.spreadsheetId !== 'undefined' ) ? "'"+dataPerfil.spreadsheetId+"'" : 'false';
        var CLIENT_ID_PRO = ( typeof dataPerfil.CLIENT_ID !== 'undefined' ) ? "'"+dataPerfil.CLIENT_ID+"'" : 'false';
        var API_KEY_PRO = ( typeof dataPerfil.API_KEY !== 'undefined' ) ? "'"+dataPerfil.API_KEY+"'" : 'false';

            var scriptText =    "<script data-config='base-formularios-seipro'>\n"+
                                "   var CLIENT_ID_PRO = "+CLIENT_ID_PRO+";\n"+
                                "   var API_KEY_PRO = "+API_KEY_PRO+";\n"+
                                "   var spreadsheetIdFormularios_Pro = "+spreadsheetIdFormularios_Pro+";\n"+
                                "</script>";
            $(scriptText).appendTo('head');

    if ( typeof dataPerfil.spreadsheetId !== 'undefined' ) {
            loadAPIGooglePro(CLIENT_ID_PRO);
            $.getScript(getUrlExtension("js/sei-forms.js"));
        } else {
            console.log('loadDataBaseSheetsFormulariosPro','ERROR!!!');
            localStorage.removeItem('loadFormulariosSheet');
            removeOptionsPro('configBaseSelectedFormPro');
        }
}
function loadDataBaseSheetsProcessosPro(dataValues) { 
        var dataPerfil = [];
        var perfilSelected = (getOptionsPro('configBaseSelectedProcessosPro')) ? getOptionsPro('configBaseSelectedProcessosPro') : 0;
        for (var i = 0; i < dataValues.length; i++) {
            if ( dataValues[i].baseName == perfilSelected || ( perfilSelected == 0 && i == 0 ) ) { dataPerfil = dataValues[i]; }
        }

        var spreadsheetIdSyncProcessos_Pro = ( typeof dataPerfil.spreadsheetId !== 'undefined' ) ? "'"+dataPerfil.spreadsheetId+"'" : 'false';
        var CLIENT_ID_PRO = ( typeof dataPerfil.CLIENT_ID !== 'undefined' ) ? "'"+dataPerfil.CLIENT_ID+"'" : 'false';
        var API_KEY_PRO = ( typeof dataPerfil.API_KEY !== 'undefined' ) ? "'"+dataPerfil.API_KEY+"'" : 'false';

            var scriptText =    "<script data-config='base-processos-seipro'>\n"+
                                "   var CLIENT_ID_PRO = "+CLIENT_ID_PRO+";\n"+
                                "   var API_KEY_PRO = "+API_KEY_PRO+";\n"+
                                "   var spreadsheetIdSyncProcessos_Pro = "+spreadsheetIdSyncProcessos_Pro+";\n"+
                                "</script>";
            $(scriptText).appendTo('head');

    if ( typeof dataPerfil.spreadsheetId !== 'undefined' ) {
            loadAPIGooglePro(CLIENT_ID_PRO);
            $.getScript(getUrlExtension("js/sei-sync-processos.js"));
        } else {
            console.log('loadDataBaseSheetsProcessosPro','ERROR!!!');
            localStorage.removeItem('loadSyncProcessosSheet');
            removeOptionsPro('configBaseSelectedFormPro');
        }
}
function loadDataBaseProStorage(items) { 
    if ( typeof items.dataValues !== 'undefined' && items.dataValues != '' && typeof getParamsUrlPro(window.location.href).acao_pro === 'undefined') {
        divIconsLoginPro();
        //localStorage.setItem('configBasePro', items.dataValues);

        var dataValues = JSON.parse(items.dataValues);
            loadScriptDataBasePro(dataValues);
    } else {
        localStorageRemovePro('loadEtapasSheet');
        removeLocalStorageAtividades();
    }
}
function loadFontIcons(elementTo, target = $('html')) {
    var iconBoxSlim = (localStorage.getItem('seiSlim')) ? true : false;
    var pathExtension = pathExtensionSEIPro();
    if (target.find('link[data-style="seipro-fonticon"]').length == 0 && target.find('style[data-style="seipro-fonticon"]').length == 0) {
        $("<link/>", {
            rel: "stylesheet",
            type: "text/css",
            datastyle: "seipro-fonticon",
            href: getUrlExtension(iconBoxSlim ? "css/fontawesome.pro.min.css" : "css/fontawesome.min.css") 
        }).appendTo(target.find(elementTo));
        
        var htmlStyleFont = '<style type="text/css" data-style="seipro-fonticon" data-index="5">'+
                            '    @font-face {\n'+
                            '       font-family: "Font Awesome 5 '+(iconBoxSlim ? 'Pro' : 'Free')+'";\n'+
                            '       font-style: normal;\n'+
                            '       font-weight: 900;\n'+
                            '       font-display: block;\n'+
                            '       src: url('+pathExtension+'webfonts'+(iconBoxSlim ? "/pro/" : "/")+'fa-solid-900.eot) !important;\n'+
                            '       src: url('+pathExtension+'webfonts'+(iconBoxSlim ? "/pro/" : "/")+'fa-solid-900.eot?#iefix) format("embedded-opentype"),url('+pathExtension+'webfonts'+(iconBoxSlim ? "/pro/" : "/")+'fa-solid-900.woff2) format("woff2"),url('+pathExtension+'webfonts'+(iconBoxSlim ? "/pro/" : "/")+'fa-solid-900.woff) format("woff"),url('+pathExtension+'webfonts'+(iconBoxSlim ? "/pro/" : "/")+'fa-solid-900.ttf) format("truetype"),url('+pathExtension+'webfonts'+(iconBoxSlim ? "/pro/" : "/")+'fa-solid-900.svg#fontawesome) format("svg") !important;\n'+
                            '   }\n'+
                            '   @font-face {\n'+
                            '       font-family: \"Font Awesome 5 '+(iconBoxSlim ? 'Pro' : 'Free')+'";\n'+
                            '       font-style: normal;\n'+
                            '       font-weight: 400;\n'+
                            '       font-display: block;\n'+
                            '       src: url('+pathExtension+'webfonts'+(iconBoxSlim ? "/pro/" : "/")+'fa-regular-400.eot) !important;\n'+
                            '       src: url('+pathExtension+'webfonts'+(iconBoxSlim ? "/pro/" : "/")+'fa-regular-400.eot?#iefix) format("embedded-opentype"),url('+pathExtension+'webfonts'+(iconBoxSlim ? "/pro/" : "/")+'fa-regular-400.woff2) format("woff2"),url('+pathExtension+'webfonts'+(iconBoxSlim ? "/pro/" : "/")+'fa-regular-400.woff) format("woff"),url('+pathExtension+'webfonts'+(iconBoxSlim ? "/pro/" : "/")+'fa-regular-400.ttf) format("truetype"),url('+pathExtension+'webfonts'+(iconBoxSlim ? "/pro/" : "/")+'fa-regular-400.svg#fontawesome) format("svg") !important;\n'+
                            '   }\n'+
                            (iconBoxSlim ?
                            '   @font-face { \n'+
                            '       font-family: "Font Awesome 5 Pro";\n'+
                            '       font-style: normal;\n'+
                            '       font-weight: 300;\n'+
                            '       font-display: block;\n'+
                            '       src: url('+pathExtension+'webfonts/pro/fa-light-300.eot) !important;\n'+
                            '       src: url('+pathExtension+'webfonts/pro/fa-light-300.eot?#iefix) format("embedded-opentype"), url('+pathExtension+'webfonts/pro/fa-light-300.woff2) format("woff2"), url('+pathExtension+'webfonts/pro/fa-light-300.woff) format("woff"), url('+pathExtension+'webfonts/pro/fa-light-300.ttf) format("truetype"), url('+pathExtension+'webfonts/pro/fa-light-300.svg#fontawesome) format("svg") !important; }\n'+
                            '   }\n'+
                            '   @font-face {\n'+
                            '       font-family: \"Font Awesome 5 Duotone\";\n'+
                            '       font-style: normal;\n'+
                            '       font-weight: 900;\n'+
                            '       font-display: block;\n'+
                            '       src: url('+pathExtension+'webfonts/pro/fa-duotone-900.eot) !important;\n'+
                            '       src: url('+pathExtension+'webfonts/pro/fa-duotone-900.eot?#iefix) format(\"embedded-opentype\"), url('+pathExtension+'webfonts/pro/fa-duotone-900.woff2) format("woff2"), url('+pathExtension+'webfonts/pro/fa-duotone-900.woff) format("woff"), url('+pathExtension+'webfonts/pro/fa-duotone-900.ttf) format("truetype"), url('+pathExtension+'webfonts/pro/fa-duotone-900.svg#fontawesome) format("svg") !important; }\n'+
                            '   }\n'
                            : '')
                            '</style>';
        target.find('head').append(htmlStyleFont);
    }
}
function loadStylePro(url, elementTo) {
    if ($('link[data-style="seipro-style"]').length == 0) {
        $("<link/>", {
            rel: "stylesheet",
            type: "text/css",
            href: url
        }).appendTo(elementTo);
    }
}
function loadFilesUI() {
    $.getScript(getUrlExtension('js/lib/jquery-ui.min.js'));
    loadStylePro(getUrlExtension('css/jquery-ui.css'), 'head');
}
function loadScriptArvorePro() {
    if ( $('#ifrArvore').length ) {
        $('#ifrArvore').on("load", function() {
            var iframeObjArvore = $('#ifrArvore').contents().find('head');
            var scriptArvore =  "<script data-config='config-seipro-arvore'>"+
                                "   $(document).ready(function () { \n"+
                                "       function initLoadSeiProArvore(TimeOut = 1000) { \n"+
                                "           if (TimeOut <= 0) { return; } \n"+
                                "           if (typeof initSeiProArvore !== 'undefined' ) {  \n"+
                                "               parent.execArvorePro(initSeiProArvore); \n"+
                                "           } else { \n"+
                                "               setTimeout(function(){  \n"+
                                "                   initLoadSeiProArvore(TimeOut - 100);  \n"+
                                "                   console.log('Reload initLoadSeiProArvore');  \n"+
                                "               }, 500); \n"+
                                "           } \n"+
                                "       } \n"+
                                "       initLoadSeiProArvore(); \n"+
                                "   });\n"+
                                // "   parent.execArvorePro(initSeiProArvore);\n"+
                                "</script>";
            $(scriptArvore).prependTo(iframeObjArvore);
        });
    }
}

function loadStyleDesign(body = $('body'), secondClass = false) {
    if (localStorage.getItem('seiSlim')) {
        body.addClass("seiSlim");
        if (secondClass) body.addClass("seiSlim_"+secondClass);
        if (localStorage.getItem('darkModePro')) {
            body.addClass("dark-mode");
        }
    }
}
loadStyleDesign();
function loadScriptVisualizacaoPro() {
    if ( $('#ifrVisualizacao').length ) {
        $('#ifrVisualizacao').on("load", function() {
            var iframeObjVisualizacao = $('#ifrVisualizacao').contents().find('head');
            var scriptVisualizacao =    "<script data-config='config-seipro-visualizacao'>"+
                                        "   parent.checkPageVisualizacao();\n"+
                                        "   parent.checkPageAtividadesVisualizacao();\n"+
                                        "   parent.checkPageFavoritosVisualizacao();\n"+
                                        "</script>";
            $(scriptVisualizacao).prependTo(iframeObjVisualizacao);
            loadStyleDesign($('#ifrVisualizacao').contents().find('body'), 'view');
            loadFontIcons('head', $('#ifrVisualizacao').contents());
        });
    }
}
function pathExtensionSEIPro() {
    var URL_SPRO = getUrlExtension("js/sei-pro.js");
        URL_SPRO = URL_SPRO.toString().replace('js/sei-pro.js', '');
    return URL_SPRO;
}
function getPathExtensionPro() {
    if ($('script[data-config="config-seipro"]').length == 0) {
        var URL_SPRO = pathExtensionSEIPro();
        var manifest = getManifestExtension();
        var VERSION_SPRO = manifest.version;
        var NAMESPACE_SPRO = manifest.short_name;
        var URLPAGES_SPRO = manifest.homepage_url;
        var scriptText =    "<script data-config='config-seipro'>\n"+
                            "   var URL_SPRO = '"+URL_SPRO+"';\n"+
                            "   var VERSION_SPRO = '"+VERSION_SPRO+"';\n"+
                            "   var NAMESPACE_SPRO = '"+NAMESPACE_SPRO+"';\n"+
                            "   var URLPAGES_SPRO = '"+URLPAGES_SPRO+"';\n"+
                            "</script>";
        $(scriptText).appendTo('head');
        setSessionNameSpace({URL_SPRO: URL_SPRO, NAMESPACE_SPRO: NAMESPACE_SPRO, URLPAGES_SPRO: URLPAGES_SPRO, VERSION_SPRO: VERSION_SPRO, ICON_SPRO: manifest.icons});
    }
}
function setSessionNameSpace(param) {
    sessionStorage.setItem((param.NAMESPACE_SPRO != 'SPro' ? 'new_extension' : 'old_extension'),  JSON.stringify(param));
}
function loadScriptPro() {
    getPathExtensionPro();
	if ( $('#frmEditor').length || $('#divEditores').length ) {
        setTimeout(function () {
        	$(document).ready(function () {
                loadConfigPro();
                $.getScript(getUrlExtension("js/lib/moment.min.js"));
                $.getScript(getUrlExtension("js/lib/jquery-qrcode-0.18.0.min.js"));
                $.getScript(getUrlExtension("js/sei-pro-editor.js"));
                $.getScript(getUrlExtension("js/sei-legis.js"));
                console.log('loadScriptPro-Editor');
        	});
	    },500);
	} else {
        classBodyPro();
        loadFilesUI();
        loadFontIcons('head');
        $.getScript(getUrlExtension("js/sei-pro.js"));
        $(document).ready(function () {
            loadConfigPro();
            loadScriptArvorePro();
            loadScriptVisualizacaoPro();
            $.getScript(getUrlExtension("js/lib/moment-weekday-calc.js"));
            // $.getScript(getUrlExtension("js/lib/moment-duration-format.min.js"));
            $.getScript(getUrlExtension("js/sei-pro-favoritos.js"));
            $.getScript(getUrlExtension("js/sei-pro-atividades.js"));
            $.getScript(getUrlExtension("js/lib/frappe-gantt.js"));
            $.getScript(getUrlExtension("js/lib/jkanban.min.js"));
            $.getScript(getUrlExtension("js/lib/jquery.toolbar.min.js"));
            $.getScript(getUrlExtension("js/lib/jquery.tagsinput-revisited.js"));
            $.getScript(getUrlExtension("js/lib/jquery.tablesorter.combined.min.js"));
            $.getScript(getUrlExtension("js/lib/chart.min.js"));
            console.log('loadScriptPro', getManifestExtension().short_name);
        });
    }
}
if (getManifestExtension().short_name == 'SPro') {
    setTimeout(function(){ 
        if (sessionStorage.getItem('new_extension') === null){
            loadScriptPro();
            console.log('@@@ LOADING SPRO');
        } else {
            console.log('&&&&&&& RECUSE SPRO');
            var URL_SPRO = pathExtensionSEIPro();
            var manifest = getManifestExtension();
            var VERSION_SPRO = manifest.version;
            var NAMESPACE_SPRO = manifest.short_name;
            setSessionNameSpace({URL_SPRO: URL_SPRO, NAMESPACE_SPRO: NAMESPACE_SPRO, VERSION_SPRO: VERSION_SPRO, ICON_SPRO: manifest.icons});
        }
    }, 1000);
} else {
    loadScriptPro();
}