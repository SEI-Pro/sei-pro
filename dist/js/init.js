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
function divIconsLoginPro() {
    var html_initLogin = '<div class="infraAcaoBarraSistema sheetsLoginPro" style="display: inline-block;">'
                            +'  <a id="authorizeButtonPro" href="#" data-tippy-content="Conectar Base de Dados (SeiPro)" onmouseover="return infraTooltipMostrar(\'Conectar Base de Dados (SeiPro)\');" onmouseout="return infraTooltipOcultar();" style="display: none;"><i class="fas fa-toggle-off brancoColor"></i></a>'
                            +'  <a id="signoutButtonPro" href="#" data-tippy-content="Desconectar Base de Dados (SeiPro)" onmouseover="return infraTooltipMostrar(\'Conectado! Clique para desconectar Base de Dados (SeiPro)\');" onmouseout="return infraTooltipOcultar();" style="display: none;"><i class="fas fa-toggle-on brancoColor"></i></a>'
                            +'  <div id="alertaBoxPro" style="display: none;"></div>'
                            +'  <div id="dialogBoxPro" style="display: none;"></div>'
                            +'  <div id="configBoxPro" style="display: none;"></div>'
                            +'  <div id="iframeBoxPro" style="display: none;"></div>'
                            +'  <div id="editorBoxPro" style="display: none;"></div>'
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
function divDialogsPro() {
    var html_Dialog = '  <div id="alertaBoxPro" style="display: none;"></div>'
                        +'  <div id="dialogBoxPro" style="display: none;"></div>';
    $('#divInfraBarraSistemaD').append(html_Dialog);
}
function getUrlExtension(url) {
    if (typeof browser === "undefined") {
        return chrome.extension.getURL(url);
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
    var dataValues_AtividadesAPI = jmespath.search(dataValues, "[?baseTipo=='atividades'] | [?conexaoTipo=='api'||conexaoTipo=='googleapi']");
    if (dataValues_ProjetosSheets.length > 0 && checkConfigValue('gerenciarprojetos')) {
        loadDataBaseSheetsProjetosPro(dataValues_ProjetosSheets);
    } else {
        localStorageRemovePro('loadEtapasSheet');
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
            loadAPIGooglePro();
            $.getScript(getUrlExtension("js/sei-gantt.js"));
        } else {
            console.log('loadDataBaseSheetsProjetosPro','ERROR!!!');
            localStorage.removeItem('loadEtapasSheet');
            removeOptionsPro('configBaseSelectedPro');
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
function loadFontIcons(elementTo) {
    if ($('link[data-style="seipro-fonticon"]').length == 0 && $('style[data-style="seipro-fonticon"]').length == 0) {
        $("<link/>", {
        rel: "stylesheet",
        type: "text/css",
        datastyle: "seipro-fonticon",
        href: getUrlExtension("css/fontawesome.min.css")
            
        }).appendTo(elementTo);
        $('head').prepend("<style type='text/css' data-style='seipro-fonticon'>"
                        +"   @font-face {\n"
                        +"    font-family: \"Font Awesome 5 Free SEIPro\";\n"
                        +"    font-style: normal;\n"
                        +"    font-weight: 900;\n"
                        +"    font-display: block;\n"
                        +"    src: url("+pathExtensionSEIPro()+"webfonts/fa-solid-900.eot);\n"
                        +"    src: url("+pathExtensionSEIPro()+"webfonts/fa-solid-900.eot?#iefix) format(\"embedded-opentype\"),url("+pathExtensionSEIPro()+"webfonts/fa-solid-900.woff2) format(\"woff2\"),url("+pathExtensionSEIPro()+"webfonts/fa-solid-900.woff) format(\"woff\"),url("+pathExtensionSEIPro()+"webfonts/fa-solid-900.ttf) format(\"truetype\"),url("+pathExtensionSEIPro()+"webfonts/fa-solid-900.svg#fontawesome) format(\"svg\")\n"
                        +"}\n"
                        +"@font-face {\n"
                        +"    font-family: \"Font Awesome 5 Free SEIPro\";\n"
                        +"    font-style: normal;\n"
                        +"    font-weight: 400;\n"
                        +"    font-display: block;\n"
                        +"    src: url("+pathExtensionSEIPro()+"webfonts/fa-regular-400.eot);\n"
                        +"    src: url("+pathExtensionSEIPro()+"webfonts/fa-regular-400.eot?#iefix) format(\"embedded-opentype\"),url("+pathExtensionSEIPro()+"webfonts/fa-regular-400.woff2) format(\"woff2\"),url("+pathExtensionSEIPro()+"webfonts/fa-regular-400.woff) format(\"woff\"),url("+pathExtensionSEIPro()+"webfonts/fa-regular-400.ttf) format(\"truetype\"),url("+pathExtensionSEIPro()+"webfonts/fa-regular-400.svg#fontawesome) format(\"svg\")\n"
                        +"}\n"
                        +"</style>");
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
                                "   parent.execArvorePro(initSeiProArvore);\n"+
                                "</script>";
            $(scriptArvore).prependTo(iframeObjArvore);
        });
    }
}
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
        var scriptText =    "<script data-config='config-seipro'>\n"+
                            "   var URL_SPRO = '"+URL_SPRO+"';\n"+
                            "   var VERSION_SPRO = '"+VERSION_SPRO+"';\n"+
                            "   var NAMESPACE_SPRO = '"+NAMESPACE_SPRO+"';\n"+
                            "</script>";
        $(scriptText).appendTo('head');

        if (NAMESPACE_SPRO != 'SPro') {
            sessionStorage.setItem('other_extension', URL_SPRO);
            console.log(manifest);
        }
    }
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
                console.log('loadScriptPro-Editor');
        	});
	    },500);
	} else {
        divDialogsPro();
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
        if (sessionStorage.getItem('other_extension') === null){
            loadScriptPro();
            console.log('@@@ LOADING SPRO');
        } else {
            console.log('&&&&&&& RECUSE SPRO');
        }
    }, 1000);
} else {
    loadScriptPro();
}