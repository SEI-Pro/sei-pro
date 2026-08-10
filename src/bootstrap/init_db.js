
// [migrado para core/sei] getUrlExtension
function getConfigHost(callback = false, callback_else = false) {
    var hosts = getUrlExtension("config_hosts.json");
        fetch(hosts)
        .then((response) => response.json()) //assuming file contains json
        .then((json) => setConfigHost(json, callback, callback_else));
}
function setConfigHost(host, callback, callback_else){
    var set_host = false;
    if (typeof host !== 'undefined' && host !== null &&typeof host.matches !== 'undefined' && host.matches !== null && host.matches.length > 0) {
        for (i = 0; i < host.matches.length; i++) {
            if (window.location.host.indexOf(host.matches[i]) !== -1) set_host = true;
        }
    }
    if (set_host && typeof callback === 'function') {
        sessionStorage.setItem('configHost_Pro', JSON.stringify(host));
        callback();
    } else if (!set_host && typeof callback_else === 'function') {
        callback_else();
    }
}
/* function appendIconEntidadeLogin() {
    if ($('#divAreaRestrita').length > 0 && $('#iconEntidade').length == 0) {
        $.getScript(getUrlExtension("js/lib/jquery-3.7.1.min.js"));
        if (typeof loadFunctionsPro === 'undefined') $.getScript(getUrlExtension("js/legacy-context.bundle.js"));
        $.getScript(getUrlExtension("js/sei-pro-icons.js"));

    }
} */
// [migrado para core/sei] getParamsUrlPro
function setOptionsSEIPro(option_key, option_value) {
    chrome.storage.sync.get({
        dataValues: ''
    }, function(items) {
        var dataValues = ( items.dataValues != '' ) ? JSON.parse(items.dataValues) : []; 
        for (i = 0; i < dataValues.length; i++) {
            if (typeof dataValues[i]['configGeral'] !== 'undefined') {
                var configGeral = dataValues[i]['configGeral'];
                var checkChangeConfig = false;
                for (j = 0; j < configGeral.length; j++) {
                    if (configGeral[j]['name'] == option_key) {
                        option_value = (option_value == 'true') ? true : option_value;
                        option_value = (option_value == 'false') ? false : option_value;
                        dataValues[i]['configGeral'][j]['value'] = option_value;
                        checkChangeConfig = true;
                    }
                }
                if (!checkChangeConfig) {
                    dataValues[i]['configGeral'].push({name: option_key, value: option_value});
                }
            }
        }
        if (dataValues.length > 0) {
            chrome.storage.sync.set({
                dataValues: JSON.stringify(dataValues)
            }, function() {
                console.log('dataValues', dataValues);
                localStorage.setItem('configBasePro', JSON.stringify(dataValues)); 
            });
        }
    });
}
function getOptionsSEIPro(data) {
    if (data.type && (data.type == "NEW_BASE")) {
        var newItem = data.newItem;
        // console.log(newItem, data);

        chrome.storage.sync.get({
            dataValues: ''
        }, function(items) {
            var dataValues = ( items.dataValues != '' ) ? JSON.parse(items.dataValues) : [];  
            if (data.mode == 'insert' || data.mode == 'remove') {
                for (i = 0; i < dataValues.length; i++) {
                    if ( dataValues[i]['baseTipo'] == data.base) {
                        dataValues.splice(i,1);
                        i--;
                    }
                }
            }
            if (data.mode != 'remove') dataValues.push(newItem);
            // console.log(dataValues);
            chrome.storage.sync.set({
                dataValues: JSON.stringify(dataValues)
            }, function() {
                if (data.alert) { 
                    if (data.mode == 'insert') {
                        alert('Configura\u00e7\u00f5es carregadas com sucesso!'); 
                    } else {
                        alert('Configura\u00e7\u00f5es removidas com sucesso!\n\n Recarregue a p\u00E1gina.'); 
                    }
                }
                if (typeof window.jQuery !== 'undefined') {
                    var urlHome = $(SeiPro.sei.adapter.isNewSEI() ? '#infraMenu' : '#main-menu').find('a[href*="controlador.php?acao=procedimento_controlar"]').attr('href');
                    if (typeof urlHome !== 'undefined') {
                        // localStorage.setItem('configBasePro_atividades', JSON.stringify({URL_API: newItem.url, KEY_USER: newItem.token}));
                        console.log({URL_API: newItem.url, KEY_USER: newItem.token});
                        setTimeout(function(){ 
                            console.log('saved OptionsSEIPro'); 
                            window.location.href = urlHome;
                        }, 1500);
                    }
                }
            });
        });
    }
}
function changeBasePro() {
    var url_param = getParamsUrlPro(window.location.href);
    if (typeof url_param.acao_pro !== 'undefined' && url_param.acao_pro == 'change_database' && typeof url_param.url !== 'undefined') {
        if (url_param.base == 'atividades') {
            var perfilLoginAtiv = JSON.parse(localStorage.getItem('configBasePro_atividades'));
            var param = {
                base: 'atividades',
                mode: 'insert',
                url: url_param.url,
                token: perfilLoginAtiv.KEY_USER
            };
            var baseName = 'Atividades';
            var data = { 
                type: "NEW_BASE", 
                mode: param.mode, 
                base: param.base, 
                alert: false, 
                newItem: {
                    "baseName": baseName,
                    "baseTipo": param.base,
                    "conexaoTipo": "api",
                    "CLIENT_ID": "",
                    "API_KEY": "",
                    "spreadsheetId": "",
                    "URL_API": param.url,
                    "KEY_USER": param.token
                }
            };
            // console.log(data);
            getOptionsSEIPro(data);
        }
    }
}
function observeAcaoPro() {
    var param = getParamsUrlPro(window.location.href);
    var manifest = getManifestExtension();
    if (typeof param.acao_pro !== 'undefined' && param.acao_pro == 'set_database' && typeof param.token !== 'undefined' && typeof param.url !== 'undefined') {
        if (param.base == 'atividades') {
            var baseName = manifest.short_name;
            var typeconnect = (param.token == '') ? 'googleapi' : 'api';
            var client_id = (param.token == '') ? param.client_id : '';
            var alert = (param.token == '') ? false : true;
            var data = { 
                type: "NEW_BASE", 
                mode: param.mode, 
                base: param.base, 
                alert: alert, 
                newItem: {
                    "baseName": baseName,
                    "baseTipo": param.base,
                    "conexaoTipo": typeconnect,
                    "CLIENT_ID": client_id,
                    "API_KEY": "",
                    "spreadsheetId": "",
                    "URL_API": param.url,
                    "KEY_USER": param.token
                }
            };
            // console.log(data);
            getOptionsSEIPro(data);
        } else if (param.base == 'openai') {
            var data = { 
                type: "NEW_BASE", 
                mode: param.mode, 
                base: param.base, 
                alert: true, 
                newItem: {
                    "baseName": "Open AI (Chat GPT)",
                    "baseTipo": "openai",
                    "conexaoTipo": "api",
                    "CLIENT_ID": "",
                    "API_KEY": "",
                    "spreadsheetId": "",
                    "URL_API": param.url,
                    "KEY_USER": param.token
                }
            };
            // console.log(data);
            getOptionsSEIPro(data);
        } else if (param.base == 'gemini') {
            var data = { 
                type: "NEW_BASE", 
                mode: param.mode, 
                base: param.base, 
                alert: true, 
                newItem: {
                    "baseName": "Gemini (Google)",
                    "baseTipo": "gemini",
                    "conexaoTipo": "api",
                    "CLIENT_ID": "",
                    "API_KEY": "",
                    "spreadsheetId": "",
                    "URL_API": param.url,
                    "KEY_USER": param.token
                }
            };
            // console.log(data);
            getOptionsSEIPro(data);
        }
    } else if (typeof param.acao_pro !== 'undefined' && param.acao_pro == 'set_database' && typeof param.client_id !== 'undefined') {
        if (param.base == 'projetos') {
            var baseName = manifest.short_name;
            var data = { 
                type: "NEW_BASE", 
                mode: param.mode, 
                base: param.base, 
                alert: true, 
                newItem: {
                    "baseName": param.base_name,
                    "baseTipo": param.base,
                    "conexaoTipo": 'sheets',
                    "CLIENT_ID": param.client_id,
                    "API_KEY": param.api_key,
                    "spreadsheetId": param.sheet_id,
                    "URL_API": "",
                    "KEY_USER": ""
                }
            };
            getOptionsSEIPro(data);
        }
    } else if (typeof param.acao_pro !== 'undefined' && param.acao_pro == 'set_option' && typeof param.option_key !== 'undefined' && typeof param.option_value !== 'undefined') {
        setOptionsSEIPro(param.option_key, param.option_value);
    }
}
// [migrado para core/sei] pathExtensionSEIPro
// [migrado para core/sei] getPathExtensionPro
// [migrado para core/sei] setSessionNameSpace
// [migrado para core/sei] getManifestExtension
// [migrado para core/sei] verifyConfigValue
// loadRepairPwdNewSei removida — código morto. A feature "autopreencher senha no
// login" foi migrada para src/features/login/index.js (bundle isolado login.bundle.js,
// sem jQuery); o init_pwd.js legado foi removido.
function loadScriptProDB() {
    observeAcaoPro();
    changeBasePro();
    // getConfigHost(appendIconEntidadeLogin);
    getPathExtensionPro();
}
if (getManifestExtension().short_name == 'SPro') {
    setTimeout(function(){ 
        if (sessionStorage.getItem('new_extension') === null){
            loadScriptProDB();
        } else {
            chrome.storage.sync.get({
                dataValues: ''
            }, function(items) {
                var dataValues = ( items.dataValues != '' ) ? JSON.parse(items.dataValues) : [];  
                console.log(dataValues); 
                sessionStorage.setItem('config_transition',  JSON.stringify(dataValues));
            });
        }
    }, 1000);
} else {
    loadScriptProDB();
}
