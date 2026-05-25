const compareVersionNumbers_init = (v1, v2) => /^\d+(\.\d+)*$/.test(v1) && /^\d+(\.\d+)*$/.test(v2) ? ((a, b) => { for (let i = 0; i < Math.max(a.length, b.length); i++) { const n1 = +a[i] || 0, n2 = +b[i] || 0; if (n1 !== n2) return n1 > n2 ? 1 : -1; } return 0; })(v1.split('.'), v2.split('.')) : NaN;
var isNewSEI = $('#divInfraSidebarMenu ul#infraMenu').length ? true : false;
var isSEI_5 = isNewSEI && sessionStorage.getItem('versaoSei') && compareVersionNumbers_init(sessionStorage.getItem('versaoSei'),'5') >= 0 ? true : false;
var frmEditor = isSEI_5 ? $('.infra-editor__editor-completo') : $('#frmEditor');
var frmEditor5Script = $('html script[charset="utf-8"]').last().html() || '';
var frmEditor5Exists = frmEditor5Script.includes('INFRA_EDITOR_CONFIG');
window.__SEI_PRO_CONFIG_READY__ = false;

$.getScript(getUrlExtension("js/lib/jmespath.min.js"));
$.getScript(getUrlExtension("js/lib/purify.min.js"));
$.getScript(getUrlExtension("js/lib/moment.min.js")).done(function() {
    $.getScript(getUrlExtension("js/lib/moment-duration-format.min.js"));
});
$.getScript(getUrlExtension("js/lib/crypto-js.min.js"));
$.getScript(getUrlExtension("js/lib/diff2html.min.js"));
$.getScript(getUrlExtension("js/sei-pro-docs-lote.js"));
var seiProFunctionsLoaded_init = $.Deferred().resolve();
if (typeof checkHostLimit === 'undefined' || typeof loadFunctionsPro === 'undefined') seiProFunctionsLoaded_init = $.getScript(getUrlExtension("js/sei-functions-pro.js"));

function divIconsLoginPro() {
    var html_initLogin = '<div class="infraAcaoBarraSistema sheetsLoginPro" style="display: inline-block;">'
                            +'  <a id="authorizeButtonPro" href="#" data-tippy-content="Conectar Base de Dados (SeiPro)" onmouseover="return infraTooltipMostrar(\'Conectar Base de Dados (SeiPro)\');" onmouseout="return infraTooltipOcultar();" style="display: none;"><i class="fas fa-toggle-off brancoColor"></i></a>'
                            +'  <a id="signoutButtonPro" href="#" data-tippy-content="Desconectar Base de Dados (SeiPro)" onmouseover="return infraTooltipMostrar(\'Conectado! Clique para desconectar Base de Dados (SeiPro)\');" onmouseout="return infraTooltipOcultar();" style="display: none;"><i class="fas fa-toggle-on brancoColor"></i></a>'
                            +'</div>';
    if ($(isNewSEI ? '#divInfraBarraSistemaPadraoD' : '#divInfraBarraSistemaD').length > 0) {
        $(isNewSEI ? '#divInfraBarraSistemaPadraoD' : '#divInfraBarraSistemaD').append(html_initLogin);
    } else if ($('#divInfraBarraSistemaPadraoD').length > 0) {
        $('#divInfraBarraSistemaPadraoD').append(html_initLogin);
    }
}
function classBodyPro() {
    if (typeof getParamsUrlPro === 'function') {
        var acao_pro = getParamsUrlPro(window.location.href).acao_pro;
        if (typeof acao_pro !== 'undefined') {
            $('body').addClass('SeiPro_'+acao_pro);
        }
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
function loadLocalConfigScriptPro() {
    if (typeof window.SEI_PRO_APPS_SCRIPT_URL !== 'undefined' && window.SEI_PRO_APPS_SCRIPT_URL) {
        return $.Deferred().resolve().promise();
    }

    var configUrl = getUrlExtension("js/sei-pro-config-local.js");
    return fetch(configUrl)
        .then(function(response) {
            if (!response.ok) throw new Error('Falha ao carregar configuração local');
            return response.text();
        })
        .then(function(scriptText) {
            if (!scriptText || scriptText.trim() === '') return;

            var match = scriptText.match(/SEI_PRO_APPS_SCRIPT_URL\s*=\s*['"]([^'"]+)['"]/);
            if (!match || !match[1]) {
                throw new Error('URL do Apps Script não encontrada no arquivo local');
            }

            window.SEI_PRO_APPS_SCRIPT_URL = match[1];
        })
        .catch(function(error) {
            console.warn('Não foi possível carregar sei-pro-config-local.js:', error && error.message ? error.message : error);
        });
}
function loadConfigPro() {
    if (typeof browser === "undefined") {
        chrome.storage.sync.get({
            dataValues: ''
        }, function(items) {  
            if (typeof items !== 'undefined') {
                localStorage.setItem('configBasePro', items.dataValues);
                loadDataBaseProStorage(items);
                window.__SEI_PRO_CONFIG_READY__ = true;
                window.dispatchEvent(new CustomEvent('sei-pro-config-ready'));
            }
        });
    } else {
        browser.storage.sync.get({
            dataValues: ''
        }, function(items) {  
            if (typeof items !== 'undefined') {
                localStorage.setItem('configBasePro', items.dataValues);
                loadDataBaseProStorage(items);
                window.__SEI_PRO_CONFIG_READY__ = true;
                window.dispatchEvent(new CustomEvent('sei-pro-config-ready'));
            }
        });
    }
}
function showAutoReportNoticePro() {
    function onGet(items) {
        if (!items || !items.InstallOrUpdate) return;
        if (typeof alertaBoxPro !== 'function') return;
        if (!isSEIProPRFHost()) return;

        var text = 'Aviso sobre relatórios automáticos:<br><br>'
            + 'Erros de console não tratados podem ser enviados automaticamente para suporte após a instalação inicial e após atualizações.<br><br>'
            + 'Esse envio contém a URL da página, a mensagem do erro e os logs técnicos relacionados ao problema.<br><br>'
            + 'A extensão não faz coleta intencional de dados pessoais para esse relatório automático, mas os logs podem refletir o contexto técnico da página no momento do erro.<br><br>'
            + 'O botão manual de bug continua disponível para quando você quiser descrever um problema ou sugestão.';

        alertaBoxPro('Aviso', 'exclamation-triangle', text, false, 'Estou ciente e aceito o envio anônimo dos erros', true);

        if (typeof browser === "undefined") {
            chrome.storage.local.set({ InstallOrUpdate: false });
        } else {
            browser.storage.local.set({ InstallOrUpdate: false });
        }
    }

    if (typeof browser === "undefined") {
        chrome.storage.local.get({ InstallOrUpdate: false }, onGet);
    } else {
        browser.storage.local.get({ InstallOrUpdate: false }, onGet);
    }
}
function loadScriptDataBasePro(dataValues) { 
    var dataValues = localStorageRestorePro('configBasePro');
    var dataValues_ProjetosSheets = jmespath.search(dataValues, "[?baseTipo=='projetos'] | [?conexaoTipo=='sheets'] | [?API_KEY!='']");
    var dataValues_FormulariosSheets = jmespath.search(dataValues, "[?baseTipo=='formularios'] | [?conexaoTipo=='sheets'] | [?API_KEY!='']");
    var dataValues_ProcessosSheets = jmespath.search(dataValues, "[?baseTipo=='processos'] | [?conexaoTipo=='sheets'] | [?API_KEY!='']");
    var dataValues_OpenAI = jmespath.search(dataValues, "[?baseTipo=='openai'] | [?conexaoTipo=='api'] | [?KEY_USER!='']");
    var dataValues_Gemini = jmespath.search(dataValues, "[?baseTipo=='gemini'] | [?conexaoTipo=='api'] | [?KEY_USER!='']");
    var dataValues_AtividadesAPI = jmespath.search(dataValues, "[?baseTipo=='atividades'] | [?conexaoTipo=='api'||conexaoTipo=='googleapi']");
    // console.log(dataValues, dataValues_ProjetosSheets);
    if (dataValues_ProjetosSheets.length > 0 && checkConfigValue('gerenciarprojetos')) {
        // loadDataBaseSheetsProjetosPro(dataValues_ProjetosSheets);
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
    if (dataValues_OpenAI.length > 0 && checkConfigValue('ferramentasia')) {
        loadDataBaseApiPlataformAIPro(dataValues_OpenAI, 'openai');
    } else {
        removeLocalStoragePlataformAI('openai');
    }
    if (dataValues_Gemini.length > 0 && checkConfigValue('ferramentasia')) {
        loadDataBaseApiPlataformAIPro(dataValues_Gemini, 'gemini');
    } else {
        removeLocalStoragePlataformAI('gemini');
    }
}
function removeLocalStoragePlataformAI(plataform) { 
    localStorageRemovePro('configBasePro_'+plataform);
}
function loadDataBaseApiPlataformAIPro(dataValues, plataform = 'openai' ) { 
    var perfilSelected = (getOptionsPro('configBaseSelectedPro_'+plataform) && getOptionsPro('configBaseSelectedPro_'+plataform) <= dataValues.length) ? getOptionsPro('configBaseSelectedPro_'+plataform) : 0;
    var perfil = (dataValues && dataValues !== null && dataValues.length > 0 && typeof dataValues[perfilSelected] !== 'undefined' &&  typeof dataValues[perfilSelected].hasOwnProperty('KEY_USER')) 
                    ? dataValues[perfilSelected] 
                    : false;
    if (perfil && checkConfigValue('ferramentasia')) {
        localStorage.setItem('configBasePro_'+plataform, JSON.stringify({URL_API: perfil.URL_API, KEY_USER: perfil.KEY_USER}));
    } else {
        removeLocalStoragePlataformAI(plataform);
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
/* function loadDataBaseSheetsProjetosPro(dataValues) { 
            // dataValues = ( jmespath.search(dataValues, "[?baseTipo=='projetos'] | length(@)") > 0 ) ? jmespath.search(dataValues, "[?baseTipo=='projetos']") : dataValues;
    var dataPerfil = [];
    var perfilSelected = (getOptionsPro('configBaseSelectedPro')) ? getOptionsPro('configBaseSelectedPro') : 0;
    for (var i = 0; i < dataValues.length; i++) {
        if ( dataValues[i].baseName == perfilSelected || ( perfilSelected == 0 && i == 0 ) ) { dataPerfil = dataValues[i]; }
    }

    if (    typeof dataPerfil.spreadsheetId !== 'undefined' &&
            typeof dataPerfil.CLIENT_ID !== 'undefined' &&
            typeof dataPerfil.API_KEY !== 'undefined' ) {
            setSessionGoogle(dataPerfil.baseTipo, {CLIENT_ID_PRO: dataPerfil.CLIENT_ID, API_KEY_PRO: dataPerfil.API_KEY, spreadsheetIdProjetos_Pro: dataPerfil.spreadsheetId});
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

    if (    typeof dataPerfil.spreadsheetId !== 'undefined' &&
            typeof dataPerfil.CLIENT_ID !== 'undefined' &&
            typeof dataPerfil.API_KEY !== 'undefined' ) {
            setSessionGoogle(dataPerfil.baseTipo, {CLIENT_ID_PRO: dataPerfil.CLIENT_ID, API_KEY_PRO: dataPerfil.API_KEY, spreadsheetIdFormularios_Pro: dataPerfil.spreadsheetId});
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

    if (    typeof dataPerfil.spreadsheetId !== 'undefined' &&
            typeof dataPerfil.CLIENT_ID !== 'undefined' &&
            typeof dataPerfil.API_KEY !== 'undefined' ) {
            setSessionGoogle(dataPerfil.baseTipo, {CLIENT_ID_PRO: dataPerfil.CLIENT_ID, API_KEY_PRO: dataPerfil.API_KEY, spreadsheetIdSyncProcessos_Pro: dataPerfil.spreadsheetId});
            $.getScript(getUrlExtension("js/sei-sync-processos.js"));
    } else {
        console.log('loadDataBaseSheetsProcessosPro','ERROR!!!');
        localStorage.removeItem('loadSyncProcessosSheet');
        removeOptionsPro('configBaseSelectedFormPro');
    }
}
function setSessionGoogle(type, param) {
    localStorage.setItem('SEIPro_google_'+type,  JSON.stringify(param));
} */
function loadDataBaseProStorage(items) { 
    if (typeof getParamsUrlPro === 'function') {
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
}
function loadFontIcons(elementTo, target = $('html')) {
    var iconBoxSlim = (localStorage.getItem('seiSlim') || localStorage.getItem('seiSlim_editor')) ? true : false;
    var pathExtension = pathExtensionSEIPro();
    if (target.find('link[data-style="seipro-fonticon"]').length == 0 && target.find('style[data-style="seipro-fonticon"]').length == 0) {
        $("<link/>", {
            rel: "stylesheet",
            type: "text/css",
            "data-style": "seipro-fonticon",
            href: getUrlExtension("css/fontawesome.pro.min.css") 
        }).appendTo(target.find(elementTo));
        
        var htmlStyleFont = '<style type="text/css" data-style="seipro-fonticon" data-index="5">'+
                            '    @font-face {\n'+
                            '       font-family: "Font Awesome 5 Pro";\n'+
                            '       font-style: normal;\n'+
                            '       font-weight: 900;\n'+
                            '       font-display: block;\n'+
                            '       src: url('+pathExtension+'webfonts/pro/fa-solid-900.eot) !important;\n'+
                            '       src: url('+pathExtension+'webfonts/pro/fa-solid-900.eot?#iefix) format("embedded-opentype"),url('+pathExtension+'webfonts/pro/fa-solid-900.woff2) format("woff2"),url('+pathExtension+'webfonts/pro/fa-solid-900.woff) format("woff"),url('+pathExtension+'webfonts/pro/fa-solid-900.ttf) format("truetype"),url('+pathExtension+'webfonts/pro/fa-solid-900.svg#fontawesome) format("svg") !important;\n'+
                            '   }\n'+
                            '   @font-face {\n'+
                            '       font-family: \"Font Awesome 5 Pro";\n'+
                            '       font-style: normal;\n'+
                            '       font-weight: 400;\n'+
                            '       font-display: block;\n'+
                            '       src: url('+pathExtension+'webfonts/pro/fa-regular-400.eot) !important;\n'+
                            '       src: url('+pathExtension+'webfonts/pro/fa-regular-400.eot?#iefix) format("embedded-opentype"),url('+pathExtension+'webfonts/pro/fa-regular-400.woff2) format("woff2"),url('+pathExtension+'webfonts/pro/fa-regular-400.woff) format("woff"),url('+pathExtension+'webfonts/pro/fa-regular-400.ttf) format("truetype"),url('+pathExtension+'webfonts/pro/fa-regular-400.svg#fontawesome) format("svg") !important;\n'+
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
            "data-style": "seipro-style",
            href: url
        }).appendTo(elementTo);
    }
}
function loadFilesUI() {
    if (typeof jQuery.ui === 'undefined') $.getScript(getUrlExtension('js/lib/jquery-ui.min.js'));
    loadStylePro(getUrlExtension('css/jquery-ui.css'), 'head');
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
        var URLPAGES_SPRO = 'https://sei-pro.github.io/sei-pro';
        setSessionNameSpace({URL_SPRO: URL_SPRO, NAMESPACE_SPRO: NAMESPACE_SPRO, URLPAGES_SPRO: URLPAGES_SPRO, VERSION_SPRO: VERSION_SPRO, ICON_SPRO: manifest.icons});
    }
}
function setSessionNameSpace(param) {
    sessionStorage.setItem((param.NAMESPACE_SPRO != 'SPro' ? 'new_extension' : 'old_extension'),  JSON.stringify(param));
}

function loadScriptPro() {
    getPathExtensionPro();
	if ( frmEditor.length || $('#divEditores').length || frmEditor5Exists ) {
        setTimeout(function () {
        	$(document).ready(function () {
                loadConfigPro();
                $.getScript(getUrlExtension("js/lib/moment.min.js"));
                $.getScript(getUrlExtension("js/lib/jquery-qrcode-0.18.0.min.js"));
                $.getScript(getUrlExtension("js/sei-pro-editor.js"));
                $.getScript(getUrlExtension("js/sei-legis.js"));
                console.log('loadScriptPro-Editor');
                loadFilesUI();
        	});
	    },500);
	} else {
        classBodyPro();
        loadFilesUI();
        loadFontIcons('head');
        seiProFunctionsLoaded_init.done(function() { $.getScript(getUrlExtension("js/sei-pro.js")); });

        $(document).ready(function () {
            loadConfigPro();
            showAutoReportNoticePro();
            if (typeof moment !== 'undefined' && typeof moment().isoAddWeekdaysFromSet === 'undefined') $.getScript(getUrlExtension("js/lib/moment-weekday-calc.js"));
            // $.getScript(getUrlExtension("js/lib/moment-duration-format.min.js"));
            if (typeof loadFavoritosPro === 'undefined') $.getScript(getUrlExtension("js/sei-pro-favoritos.js"));
            loadLocalConfigScriptPro().finally(function() {
                if (typeof loadAtividadesPro === 'undefined') $.getScript(getUrlExtension("js/sei-pro-atividades.js"));
            });
            if (typeof loadProjetosPro === 'undefined') $.getScript(getUrlExtension("js/sei-pro-projetos.js"));
            if (typeof loadPrescricoesPro === 'undefined') $.getScript(getUrlExtension("js/sei-pro-prescricoes.js"));
            if (typeof Gantt === 'undefined') $.getScript(getUrlExtension("js/lib/frappe-gantt.js"));
            if (typeof jKanban === 'undefined') $.getScript(getUrlExtension("js/lib/jkanban.min.js"));
            if (typeof $().toolbar === 'undefined') $.getScript(getUrlExtension("js/lib/jquery.toolbar.min.js"));
            if (typeof $().tagsInput === 'undefined') $.getScript(getUrlExtension("js/lib/jquery.tagsinput-revisited.js"));
            if (typeof $.tablesorter === 'undefined') $.getScript(getUrlExtension("js/lib/jquery.tablesorter.combined.min.js"));
            if (typeof Chart === 'undefined') $.getScript(getUrlExtension("js/lib/chart.min.js"));
            if (typeof $().visible === 'undefined') $.getScript(getUrlExtension("js/lib/jquery-visible.min.js"));
        });
    }
}
if (getManifestExtension().short_name == 'SPro') {
    setTimeout(function(){ 
        if (sessionStorage.getItem('new_extension') === null){
            loadScriptPro();
            // console.log('@@@ LOADING SPRO');
        } else {
            // console.log('&&&&&&& RECUSE SPRO');
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
