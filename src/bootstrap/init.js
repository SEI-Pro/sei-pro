const compareVersionNumbers_init = (v1, v2) => /^\d+(\.\d+)*$/.test(v1) && /^\d+(\.\d+)*$/.test(v2) ? ((a, b) => { for (let i = 0; i < Math.max(a.length, b.length); i++) { const n1 = +a[i] || 0, n2 = +b[i] || 0; if (n1 !== n2) return n1 > n2 ? 1 : -1; } return 0; })(v1.split('.'), v2.split('.')) : NaN;
var isNewSEI = $('#divInfraSidebarMenu ul#infraMenu').length ? true : false;
var isSEI_5 = isNewSEI && sessionStorage.getItem('versaoSei') && compareVersionNumbers_init(sessionStorage.getItem('versaoSei'),'5') >= 0 ? true : false;
var frmEditor = SeiPro.sei.adapter.isSEI5() ? $('.infra-editor__editor-completo') : $('#frmEditor');
var frmEditor5Script = $('html script[charset="utf-8"]').last().html() || '';
var frmEditor5Exists = frmEditor5Script.includes('INFRA_EDITOR_CONFIG');
window.__SEI_PRO_CONFIG_READY__ = false;

$.getScript(getUrlExtension("js/lib/jmespath.min.js")).done(function () {
    window.__SEI_PRO_JMESPATH_READY__ = true;
});
$.getScript(getUrlExtension("js/lib/purify.min.js"));
$.getScript(getUrlExtension("js/lib/moment.min.js")).done(function() {
    $.getScript(getUrlExtension("js/lib/moment-duration-format.min.js"));
});
$.getScript(getUrlExtension("js/lib/crypto-js.min.js"));
$.getScript(getUrlExtension("js/lib/diff2html.min.js"));
$.getScript(getUrlExtension("js/docs-lote.bundle.js"));
var seiProFunctionsLoaded_init = $.Deferred().resolve();
if (typeof checkHostLimit === 'undefined' || typeof loadFunctionsPro === 'undefined') seiProFunctionsLoaded_init = $.getScript(getUrlExtension("js/legacy-context.bundle.js"));

function divIconsLoginPro() {
    var html_initLogin = '<div class="infraAcaoBarraSistema sheetsLoginPro" style="display: inline-block;">'
                            +'  <a id="authorizeButtonPro" href="#" data-tippy-content="Conectar Base de Dados (SeiPro)" onmouseover="return infraTooltipMostrar(\'Conectar Base de Dados (SeiPro)\');" onmouseout="return infraTooltipOcultar();" style="display: none;"><i class="fas fa-toggle-off brancoColor"></i></a>'
                            +'  <a id="signoutButtonPro" href="#" data-tippy-content="Desconectar Base de Dados (SeiPro)" onmouseover="return infraTooltipMostrar(\'Conectado! Clique para desconectar Base de Dados (SeiPro)\');" onmouseout="return infraTooltipOcultar();" style="display: none;"><i class="fas fa-toggle-on brancoColor"></i></a>'
                            +'</div>';
    if ($(SeiPro.sei.adapter.isNewSEI() ? '#divInfraBarraSistemaPadraoD' : '#divInfraBarraSistemaD').length > 0) {
        $(SeiPro.sei.adapter.isNewSEI() ? '#divInfraBarraSistemaPadraoD' : '#divInfraBarraSistemaD').append(html_initLogin);
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
// [migrado para core/sei] getUrlExtension
// [migrado para core/sei] getManifestExtension
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
            // Stub sem override (comentários apenas) é válido — segue com o fallback.
            if (!match || !match[1]) return;

            window.SEI_PRO_APPS_SCRIPT_URL = match[1];
        })
        .catch(function(error) {
            console.warn('Não foi possível carregar sei-pro-config-local.js:', error && error.message ? error.message : error);
        });
}
var DATAVALUES_SECRET_FIELDS_INIT = ['API_KEY', 'KEY_USER', 'CLIENT_ID', 'spreadsheetId'];

function profileSecretKeyInit(profile) {
    if (!profile || typeof profile !== 'object') return '';
    return [String(profile.baseTipo || ''), String(profile.baseName || ''), String(profile.conexaoTipo || '')].join('|');
}

function mergeDataValuesWithLocalSecrets(rawDataValues, secretsMap) {
    if (!rawDataValues) return rawDataValues || '';
    try {
        var dataValues = typeof rawDataValues === 'string' ? JSON.parse(rawDataValues) : rawDataValues;
        if (!Array.isArray(dataValues)) return rawDataValues;
        var secrets = secretsMap && typeof secretsMap === 'object' ? secretsMap : {};
        var merged = dataValues.map(function (entry) {
            if (!entry || typeof entry.baseName === 'undefined') return entry;
            var bag = secrets[profileSecretKeyInit(entry)];
            if (!bag || typeof bag !== 'object') return entry;
            return Object.assign({}, entry, bag);
        });
        return JSON.stringify(merged);
    } catch (_) {
        return rawDataValues;
    }
}

function extractAndStripSyncSecrets(rawDataValues) {
    var empty = { syncSafe: rawDataValues || '', secrets: {}, changed: false };
    if (!rawDataValues) return empty;
    try {
        var dataValues = typeof rawDataValues === 'string' ? JSON.parse(rawDataValues) : rawDataValues;
        if (!Array.isArray(dataValues)) return empty;
        var secrets = {};
        var changed = false;
        var syncSafe = dataValues.map(function (entry) {
            if (!entry || typeof entry.baseName === 'undefined') return entry;
            var safeEntry = Object.assign({}, entry);
            var bag = {};
            var hasSecret = false;
            DATAVALUES_SECRET_FIELDS_INIT.forEach(function (field) {
                if (Object.prototype.hasOwnProperty.call(safeEntry, field)
                    && safeEntry[field] !== null
                    && typeof safeEntry[field] !== 'undefined'
                    && String(safeEntry[field]).trim() !== '') {
                    bag[field] = safeEntry[field];
                    hasSecret = true;
                    changed = true;
                }
                delete safeEntry[field];
            });
            if (hasSecret) secrets[profileSecretKeyInit(entry)] = bag;
            return safeEntry;
        });
        return { syncSafe: JSON.stringify(syncSafe), secrets: secrets, changed: changed };
    } catch (_) {
        return empty;
    }
}

function loadConfigPro() {
    function applyConfig(syncItems, localItems) {
        if (typeof syncItems === 'undefined') return;
        var localSecrets = (localItems && localItems.dataValuesSecrets) || {};
        window.__SEI_PRO_BUG_REPORT_OPT_IN__ = !!(localItems && localItems.bugReportOptIn === true);

        var migration = extractAndStripSyncSecrets(syncItems.dataValues);
        var secrets = Object.assign({}, localSecrets, migration.secrets);
        if (migration.changed) {
            try {
                if (typeof browser === 'undefined') {
                    chrome.storage.local.set({ dataValuesSecrets: secrets });
                    chrome.storage.sync.set({ dataValues: migration.syncSafe });
                } else {
                    browser.storage.local.set({ dataValuesSecrets: secrets });
                    browser.storage.sync.set({ dataValues: migration.syncSafe });
                }
            } catch (_) { /* page still gets merged credentials below */ }
        }

        var mergedForRuntime = mergeDataValuesWithLocalSecrets(migration.syncSafe, secrets);
        var safeDataValues = redactLegacyAISecrets(mergedForRuntime);
        if (safeDataValues !== mergedForRuntime) {
            try {
                // AI keys must not linger in sync; runtime copy is already redacted.
                var aiStripped = redactLegacyAISecrets(migration.syncSafe);
                if (typeof browser === 'undefined') {
                    chrome.storage.sync.set({ dataValues: aiStripped });
                } else {
                    browser.storage.sync.set({ dataValues: aiStripped });
                }
            } catch (_) { /* ignore */ }
        }
        clearLegacyAIPageProfiles();
        localStorage.setItem('configBasePro', safeDataValues);
        loadDataBaseProStorage({ dataValues: safeDataValues });
        window.__SEI_PRO_CONFIG_READY__ = true;
        window.dispatchEvent(new CustomEvent('sei-pro-config-ready'));
    }

    function readLocalThenApply(syncItems) {
        if (typeof browser === 'undefined') {
            chrome.storage.local.get({ dataValuesSecrets: {}, bugReportOptIn: false }, function (localItems) {
                applyConfig(syncItems, localItems);
            });
        } else {
            browser.storage.local.get({ dataValuesSecrets: {}, bugReportOptIn: false }, function (localItems) {
                applyConfig(syncItems, localItems);
            });
        }
    }

    if (typeof browser === 'undefined') {
        chrome.storage.sync.get({ dataValues: '' }, readLocalThenApply);
    } else {
        browser.storage.sync.get({ dataValues: '' }, readLocalThenApply);
    }
}

function redactLegacyAISecrets(rawDataValues) {
    if (!rawDataValues) return rawDataValues || '';
    try {
        var dataValues = typeof rawDataValues === 'string' ? JSON.parse(rawDataValues) : rawDataValues;
        if (!Array.isArray(dataValues)) return rawDataValues;
        var aiProviders = ['openai', 'anthropic', 'gemini', 'moonshot', 'ollama', 'openai_compatible'];
        var secretFields = ['KEY_USER', 'API_KEY', 'key', 'apiKey', 'accessToken', 'refreshToken'];
        var changed = false;
        var safeValues = dataValues.map(function (entry) {
            var provider = String(entry && (entry.baseTipo || entry.providerId) || '').toLowerCase();
            if (!entry || typeof entry !== 'object' || aiProviders.indexOf(provider) === -1) return entry;
            var safeEntry = Object.assign({}, entry);
            secretFields.forEach(function (field) {
                if (Object.prototype.hasOwnProperty.call(safeEntry, field)) {
                    delete safeEntry[field];
                    changed = true;
                }
            });
            return safeEntry;
        });
        return changed ? JSON.stringify(safeValues) : (typeof rawDataValues === 'string' ? rawDataValues : JSON.stringify(rawDataValues));
    } catch (_) {
        return rawDataValues;
    }
}

function clearLegacyAIPageProfiles() {
    [
        'configBasePro_openai',
        'configBasePro_gemini',
        'configBasePro_anthropic',
        'configBasePro_moonshot',
        'configBasePro_ollama',
        'configBasePro_openai_compatible'
    ].forEach(function (key) {
        localStorage.removeItem(key);
    });
}
function showAutoReportNoticePro() {
    function onGet(items) {
        if (!items || !items.InstallOrUpdate) return;
        if (typeof alertaBoxPro !== 'function') return;
        if (!isSEIProPRFHost()) return;

        var text = 'Aviso sobre relatórios automáticos:<br><br>'
            + 'Os erros não tratados podem ser enviados automaticamente para o suporte após a instalação inicial e após atualizações.<br><br>'
            + 'Esse envio contém a URL da página, a mensagem do erro e os logs técnicos relacionados ao problema.<br><br>'
            + 'A extensão não faz coleta intencional de dados pessoais para esse relatório automático, mas os logs podem refletir o contexto técnico da página no momento do erro.<br><br>'
            + 'O botão manual de bug continua disponível para quando você quiser descrever um problema ou sugestão.';

        alertaBoxPro('Aviso', 'exclamation-triangle', text, false, 'Estou ciente e aceito o envio anônimo dos erros', true);

        // Opt-in explícito para telemetria / relatório automático (ADR-0015).
        window.__SEI_PRO_BUG_REPORT_OPT_IN__ = true;
        if (typeof browser === "undefined") {
            chrome.storage.local.set({ InstallOrUpdate: false, bugReportOptIn: true });
        } else {
            browser.storage.local.set({ InstallOrUpdate: false, bugReportOptIn: true });
        }
    }

    if (typeof browser === "undefined") {
        chrome.storage.local.get({ InstallOrUpdate: false }, onGet);
    } else {
        browser.storage.local.get({ InstallOrUpdate: false }, onGet);
    }
}
function loadScriptDataBasePro(dataValues) { 
    if (typeof jmespath === 'undefined' || typeof jmespath.search !== 'function') {
        setTimeout(function () { loadScriptDataBasePro(dataValues); }, 100);
        return;
    }
    var dataValues = localStorageRestorePro('configBasePro');
    var dataValues_FormulariosSheets = jmespath.search(dataValues, "[?baseTipo=='formularios'] | [?conexaoTipo=='sheets'] | [?API_KEY!='']");
    var dataValues_ProcessosSheets = jmespath.search(dataValues, "[?baseTipo=='processos'] | [?conexaoTipo=='sheets'] | [?API_KEY!='']");
    var dataValues_OpenAI = jmespath.search(dataValues, "[?baseTipo=='openai'] | [?conexaoTipo=='api'] | [?KEY_USER!='']");
    var dataValues_Gemini = jmespath.search(dataValues, "[?baseTipo=='gemini'] | [?conexaoTipo=='api'] | [?KEY_USER!='']");
    var dataValues_AtividadesAPI = jmespath.search(dataValues, "[?baseTipo=='atividades'] | [?conexaoTipo=='api'||conexaoTipo=='googleapi']");
    // Projetos Sheets path removed — feature is local-first (see src/features/projetos/).
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
/* Sheets loaders for formularios/processos (projetos Sheets path removed).
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
            removeLocalStorageAtividades();
        }
    }
}
// [migrado para core/sei] loadFontIcons
// [migrado para core/sei] loadStylePro
// [migrado para core/sei] loadFilesUI
// [migrado para core/sei] loadStyleDesign
loadStyleDesign();
// [migrado para core/sei] pathExtensionSEIPro
// [migrado para core/sei] getPathExtensionPro
// [migrado para core/sei] setSessionNameSpace

function loadScriptPro() {
    getPathExtensionPro();
	if ( frmEditor.length || $('#divEditores').length || frmEditor5Exists ) {
        setTimeout(function () {
        	$(document).ready(function () {
                loadConfigPro();
                // Editor + legis ship in sei-pro-editor.js (src/entries/editor.js).
                // Moment and the old QR plugin are no longer loaded on the editor path.
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
            // Monitorados migrado para ESM (js/monitorados.bundle.js, carregado pelo manifest).
            // O $.getScript de sei-pro-monitorados.js foi removido — o arquivo não existe mais.
            loadLocalConfigScriptPro().finally(function() {
                if (typeof loadAtividadesPro === 'undefined') $.getScript(getUrlExtension("js/sei-pro-atividades.js"));
            });
            // Projetos is a content_script bundle (js/sei-pro-projetos.js) — no getScript.
            if (typeof loadPrescricoesPro === 'undefined') $.getScript(getUrlExtension("js/sei-pro-prescricoes.js"));
            if (typeof $().toolbar === 'undefined') $.getScript(getUrlExtension("js/lib/jquery.toolbar.min.js"));
            if (typeof $().tagsInput === 'undefined') $.getScript(getUrlExtension("js/lib/jquery.tagsinput-revisited.js"));
            if (typeof $.tablesorter === 'undefined') $.getScript(getUrlExtension("js/lib/jquery.tablesorter.combined.min.js"));
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
