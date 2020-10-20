$.getScript(getUrlExtension("js/lib/jquery-3.4.1.min.js"));
$.getScript(getUrlExtension("js/lib/jmespath.min.js"));
$.getScript(getUrlExtension("js/lib/moment.min.js"));
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
                            +'</div>';
    $('#divInfraBarraSistemaD').append(html_initLogin);
}
function getUrlExtension(url) {
    if (typeof browser === "undefined") {
        return chrome.extension.getURL(url);
    } else {
        return browser.runtime.getURL(url);
    }
}
function loadSheetsPro() {
    if (typeof browser === "undefined") {
        chrome.storage.sync.get({
            dataValues: ''
        }, function(items) {  
            loadSheetsProStorage(items)
        });
    } else {
        browser.storage.sync.get({
            dataValues: ''
        }, function(items) {  
            loadSheetsProStorage(items)
        });
    }
}
function loadScriptDataBaseAtividadesPro(dataValues) { 
            dataValues = ( jmespath.search(dataValues, "[?baseTipo=='atividades'] | length(@)") > 0 ) ? jmespath.search(dataValues, "[?baseTipo=='atividades']") : dataValues;
        var dataPerfil = [];
        var perfilSelected = ( JSON.parse(localStorage.getItem('configBaseSelectedAtividadesPro')) !== null ) ? JSON.parse(localStorage.getItem('configBaseSelectedAtividadesPro')) : 0;
        for (var i = 0; i < dataValues.length; i++) {
            if ( dataValues[i].baseName == perfilSelected || ( perfilSelected == 0 && i == 0 ) ) { dataPerfil = dataValues[i]; }
        }
        console.log('dataValuesAtividades',dataValues);

        var CLIENT_ID_PRO = dataPerfil.CLIENT_ID;
        var API_KEY_PRO = dataPerfil.API_KEY;
        var spreadsheetIdAtividades_Pro = dataPerfil.spreadsheetId;

        if ( typeof spreadsheetIdAtividades_Pro !== 'undefined' ) {
            var scriptText =    "<script data-config='base-atividades-seipro'>\n"+
                                "   var CLIENT_ID_PRO = '"+CLIENT_ID_PRO+"';\n"+
                                "   var API_KEY_PRO = '"+API_KEY_PRO+"';\n"+
                                "   var spreadsheetIdAtividades_Pro = '"+spreadsheetIdAtividades_Pro+"';\n"+
                                "</script>";
            $(scriptText).appendTo('head');
            loadAPIGooglePro();
            $.getScript(getUrlExtension("js/sei-atividades.js"));
        } else {
            console.log('loadScriptDataBaseAtividadesPro','ERROR!!!');
            localStorage.removeItem('loadAtividadesSheet');
            //localStorage.removeItem('configBasePro');
            localStorage.removeItem('configBaseSelectedAtividadesPro');
            $('#signoutButtonPro').show().attr('onmouseover', 'return infraTooltipMostrar(\'Base n\u00E3o cadastrada\')').find('i').attr('class','fas fa-database brancoColor');
        }
}
function loadScriptDataBaseProjetosPro(dataValues) { 
            dataValues = ( jmespath.search(dataValues, "[?baseTipo=='projetos'] | length(@)") > 0 ) ? jmespath.search(dataValues, "[?baseTipo=='projetos']") : dataValues;
        var dataPerfil = [];
        var perfilSelected = ( JSON.parse(localStorage.getItem('configBaseSelectedPro')) !== null ) ? JSON.parse(localStorage.getItem('configBaseSelectedPro')) : 0;
        for (var i = 0; i < dataValues.length; i++) {
            if ( dataValues[i].baseName == perfilSelected || ( perfilSelected == 0 && i == 0 ) ) { dataPerfil = dataValues[i]; }
        }
        //console.log('dataValuesProjetos',dataValues);

        var CLIENT_ID_PRO = dataPerfil.CLIENT_ID;
        var API_KEY_PRO = dataPerfil.API_KEY;
        var spreadsheetIdProjetos_Pro = dataPerfil.spreadsheetId;

        if ( typeof spreadsheetIdProjetos_Pro !== 'undefined' ) {
            var scriptText =    "<script data-config='base-projetos-seipro'>\n"+
                                "   var CLIENT_ID_PRO = '"+CLIENT_ID_PRO+"';\n"+
                                "   var API_KEY_PRO = '"+API_KEY_PRO+"';\n"+
                                "   var spreadsheetIdProjetos_Pro = '"+spreadsheetIdProjetos_Pro+"';\n"+
                                "</script>";
            $(scriptText).appendTo('head');
            loadAPIGooglePro();
            $.getScript(getUrlExtension("js/sei-gantt.js"));
        } else {
            console.log('loadScriptDataBaseProjetosPro','ERROR!!!');
            localStorage.removeItem('loadEtapasSheet');
            //localStorage.removeItem('configBasePro');
            localStorage.removeItem('configBaseSelectedPro');
            $('#signoutButtonPro').show().attr('onmouseover', 'return infraTooltipMostrar(\'Base n\u00E3o cadastrada\')').find('i').attr('class','fas fa-database brancoColor');
        }
}
function loadSheetsProStorage(items) { 
    if ( typeof items.dataValues !== 'undefined' && items.dataValues != '' ) {
        divIconsLoginPro();
        localStorage.setItem('configBasePro', items.dataValues);

        var dataValues = JSON.parse(items.dataValues);
            loadScriptDataBaseProjetosPro(dataValues);
            loadScriptDataBaseAtividadesPro(dataValues);
    }
}
function loadFontIcons(elementTo) {
	$("<link/>", {
	   rel: "stylesheet",
	   type: "text/css",
	   href: getUrlExtension("css/fontawesome.min.css")
        
	}).appendTo(elementTo);
}
function loadStylePro(url, elementTo) {
	$("<link/>", {
		rel: "stylesheet",
		type: "text/css",
		href: url
	}).appendTo(elementTo);
}
function loadFilesUI() {
    $.getScript(getUrlExtension('js/lib/jquery-ui.min.js'));
    loadStylePro(getUrlExtension('css/jquery-ui.css'), 'head');
}
function loadScriptArvorePro() {
    if ( $('#ifrArvore').length ) {
        $('#ifrArvore').on("load", function() {
            var iframeObjArvore = $('#ifrArvore').contents().find('head');
            var scriptArvore =  "<script>"+
                                "   parent.execArvorePro(getToolbarPro);\n"+
                                "</script>";
            $(scriptArvore).appendTo(iframeObjArvore);
        });
    }
}
function getPathExtensionPro() {
    var URL_SEIPRO = getUrlExtension("js/sei-pro.js");
        URL_SEIPRO = URL_SEIPRO.toString().replace('js/sei-pro.js', '');
    var scriptText =    "<script data-config='config-seipro'>\n"+
                        "   var URL_SEIPRO = '"+URL_SEIPRO+"';\n"+
                        "</script>";
    $(scriptText).appendTo('head');
}
function loadScriptPro() {
    getPathExtensionPro();
	if ( $('#frmEditor').length ) {
        setTimeout(function () {
        	$(document).ready(function () {
                $.getScript(getUrlExtension("js/lib/moment.min.js"));
                $.getScript(getUrlExtension("js/lib/jquery-qrcode-0.18.0.min.js"));
                $.getScript(getUrlExtension("js/sei-pro-editor.js"));
                console.log('loadScriptPro-Editor');
        	});
	    },500);
	} else {
        loadSheetsPro();
        loadFilesUI();
        loadFontIcons('head');
        $.getScript(getUrlExtension("js/sei-pro.js"));
        $(document).ready(function () {
            loadScriptArvorePro();
            $.getScript(getUrlExtension("js/lib/moment-weekday-calc.js"));
            $.getScript(getUrlExtension("js/lib/frappe-gantt.js"));
            console.log('loadScriptPro');
        });
    }
}
loadScriptPro();