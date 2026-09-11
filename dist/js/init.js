const compareVersionNumbers_init = (v1, v2) => /^\d+(\.\d+)*$/.test(v1) && /^\d+(\.\d+)*$/.test(v2) ? ((a, b) => { for (let i = 0; i < Math.max(a.length, b.length); i++) { const n1 = +a[i] || 0, n2 = +b[i] || 0; if (n1 !== n2) return n1 > n2 ? 1 : -1; } return 0; })(v1.split('.'), v2.split('.')) : NaN;
var isNewSEI = $('#divInfraSidebarMenu ul#infraMenu').length ? true : false;
var isSEI_5 = isNewSEI && sessionStorage.getItem('versaoSei') && compareVersionNumbers_init(sessionStorage.getItem('versaoSei'),'5') >= 0 ? true : false;
// A p\u00E1gina do editor CK5 n\u00E3o tem o menu lateral, ent\u00E3o isNewSEI/isSEI_5 s\u00E3o false ali
// e o seletor cairia no do CK4. Detecta o container do CK5 primeiro, com fallback CK4.
var frmEditor = $('.infra-editor__editor-completo').length ? $('.infra-editor__editor-completo') : $('#frmEditor');
// Varre TODOS os scripts: no SEI 5.0.4 h\u00E1 6 script[charset=utf-8] e o INFRA_EDITOR_CONFIG
// fica no primeiro, ent\u00E3o o .last() dava false e o editor do SEI Pro n\u00E3o carregava.
var frmEditor5Exists = $('html script[charset="utf-8"]').toArray().some(function (s) {
    return !!(s.innerHTML && s.innerHTML.indexOf('INFRA_EDITOR_CONFIG') !== -1);
});

// A pagina do SEI ja vem com jQuery (3.7.0 no 4.1.5 e no 5.0.4) e com a jQuery UI 1.13.2
// ligada nele. Injetar a nossa 3.4.1 troca o window.$ da pagina e leva aquela UI junto: ate a
// nossa 1.12.1 chegar, todo $(...).resizable/.dialog na pagina lanca TypeError - inclusive o
// adicionarLinha do proprio SEI, que monta a divisoria arrastavel entre a arvore e o documento.
// Carregar a UI no callback fecha essa janela. O guard de loadFilesUI() nao resolve: ele roda no
// mundo isolado da extensao, onde a jQuery UI ja existe como content script, entao da sempre
// falso e nunca chega a carregar nada na pagina. Quem repunha a UI era o checkLoadJqueryUI(),
// dentro do sei-functions-pro.js, que roda no mundo certo mas so bem depois.
// A partir do SEI 4 a pagina ja vem com jQuery proprio (3.7.0 no 4.1.5 e no 5.0.4) e com a jQuery
// UI 1.13.2, o jquery.toolbar e o jquery.modalLink acoplados NELE. Injetar a nossa 3.4.1 por cima
// trocava o window.$ da pagina e levava os tres junto: ate a nossa jQuery UI 1.12.1 chegar, todo
// $(...).resizable / .dialog na pagina lancava TypeError - inclusive dentro do adicionarLinha do
// proprio SEI, que e o que monta a divisoria arrastavel entre a arvore e o documento. Medido ao
// vivo: 4 excecoes por carregamento no SEI 4.1.5 e no 5.0.4, zero depois desta mudanca.
// No SEI 3.x a injecao continua necessaria: la o InfraPagina::adicionarJQuery() e false por padrao,
// muitas paginas nao tem jQuery nenhum e as que tem trazem a 1.12.4.
// A checagem le o <script> do DOM em vez de testar typeof jQuery porque este arquivo roda no mundo
// ISOLADO da extensao, onde o jQuery dela sempre existe - qualquer teste direto daria a resposta
// errada. O run_at e document_idle, entao o DOM ja esta completo aqui.
var versaoJqueryPaginaPro = null;
Array.prototype.slice.call(document.querySelectorAll('script[src*="jquery"]')).some(function (s) {
    var m = (s.src || '').match(/jquery-(\d+(?:\.\d+)*)(?:\.min)?\.js/);
    if (m) { versaoJqueryPaginaPro = m[1]; return true; }
    return false;
});
if (!versaoJqueryPaginaPro || compareVersionNumbers_init(versaoJqueryPaginaPro, '3.4.1') < 0) {
    $.getScript(getUrlExtension("js/lib/jquery-3.4.1.min.js"), function () {
        $.getScript(getUrlExtension("js/lib/jquery-ui.min.js"));
    });
}
$.getScript(getUrlExtension("js/lib/jmespath.min.js"));
$.getScript(getUrlExtension("js/lib/purify.min.js"));
$.getScript(getUrlExtension("js/lib/moment.min.js"), function () {
    $.getScript(getUrlExtension("js/lib/moment-duration-format.min.js"));
});
$.getScript(getUrlExtension("js/lib/crypto-js.min.js"));
$.getScript(getUrlExtension("js/lib/diff2html.min.js"));
$.getScript(getUrlExtension("js/sei-pro-docs-lote.js"));
$.getScript(getUrlExtension("js/sei-pro-proc-lote.js"));
if (typeof loadFunctionsPro === 'undefined' || window.name != '') $.getScript(getUrlExtension("js/sei-functions-pro.js"));

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
function loadConfigPro() {
    if (typeof browser === "undefined") {
        chrome.storage.sync.get({
            dataValues: ''
        }, function(items) {  
            if (typeof items !== 'undefined') {
                localStorage.setItem('configBasePro', items.dataValues);
                loadDataBaseProStorage(items);
            }
        });
    } else {
        browser.storage.sync.get({
            dataValues: ''
        }, function(items) {  
            if (typeof items !== 'undefined') {
                localStorage.setItem('configBasePro', items.dataValues);
                loadDataBaseProStorage(items);
            }
        });
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
            datastyle: "seipro-fonticon",
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
        var URLPAGES_SPRO = manifest.homepage_url;
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
                // O adapter precisa estar em place antes do editor, pois o editor
                // passa a depender de SeiProEditorAdapter para operar em CK4 e CK5
                // de forma transparente.
                // O adapter (mundo da pagina) auto-carrega seus modulos de
                // js/modules/editor/ via SeiProEditorAdapter.MODULES. Aqui so
                // garantimos a ordem adapter -> editor. NAO chamar loadModules
                // daqui: init.js roda no mundo isolado e nao enxerga o
                // window.SeiProEditorAdapter (definido no mundo da pagina).
                $.getScript(getUrlExtension("js/sei-pro-editor-adapter.js"), function () {
                    $.getScript(getUrlExtension("js/sei-pro-editor.js"));
                });
                $.getScript(getUrlExtension("js/sei-legis.js"));
                console.log('loadScriptPro-Editor');
                loadFilesUI();
        	});
	    },500);
	} else {
        classBodyPro();
        loadFilesUI();
        loadFontIcons('head');
        $.getScript(getUrlExtension("js/sei-pro.js"));

        $(document).ready(function () {
            loadConfigPro();
            if (typeof moment !== 'undefined' && typeof moment().isoAddWeekdaysFromSet === 'undefined') $.getScript(getUrlExtension("js/lib/moment-weekday-calc.js"));
            // $.getScript(getUrlExtension("js/lib/moment-duration-format.min.js"));
            if (typeof loadFavoritosPro === 'undefined') $.getScript(getUrlExtension("js/sei-pro-favoritos.js"));
            if (typeof loadAtividadesPro === 'undefined') $.getScript(getUrlExtension("js/sei-pro-atividades.js"));
            if (typeof loadProjetosPro === 'undefined') $.getScript(getUrlExtension("js/sei-pro-projetos.js"));
            if (typeof loadPrescricoesPro === 'undefined') $.getScript(getUrlExtension("js/sei-pro-prescricoes.js"));
            // Ferramentas de PDF: so o lado que atende os pedidos da pagina.
            // A ferramenta em si (pdf.js, Tesseract, os motores) vive na pagina
            // da extensao e NAO entra na pagina do SEI -- se entrasse, um
            // segundo pdf.js sobrescreveria o window.pdfjsLib de que o
            // sei-pro-ai.js depende.
            //
            // O par deste arquivo e js/init_ferramentaspdf.js, que roda no mundo
            // ISOLADO (declarado no manifest) porque e o unico lado com acesso a
            // chrome.runtime. Os dois conversam por postMessage no documento.
            if (typeof window.loadFerramentasPdfPro === 'undefined') $.getScript(getUrlExtension("js/sei-pro-ferramentaspdf.js"));
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