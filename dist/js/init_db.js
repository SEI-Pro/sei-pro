function getParamsUrlPro(url) {
    var params = {};
    if (typeof url !== 'undefined' && url.indexOf('?') !== -1 && url.indexOf('&') !== -1) {
        var vars = url.split('?')[1].split('&');
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split('=');
            params[pair[0]] = decodeURIComponent(pair[1]);
        }
        return params;
    } else { return false; }
}
function getOptionsSEIPro(data) {
    if (data.type && (data.type == "NEW_BASE")) {
        var newItem = data.newItem;
        console.log(newItem);

        chrome.storage.sync.get({
            dataValues: ''
        }, function(items) {
            var dataValues = ( items.dataValues != '' ) ? JSON.parse(items.dataValues) : [];  
            if (data.mode == 'insert') {
                for (i = 0; i < dataValues.length; i++) {
                    if ( dataValues[i]['baseTipo'] == data.base) {
                        dataValues.splice(i,1);
                        i--;
                    }
                }
            }
            dataValues.push(newItem);
            console.log(dataValues);
            chrome.storage.sync.set({
                dataValues: JSON.stringify(dataValues)
            }, function() {
                if (data.alert) { alert('Configura\u00e7\u00f5es carregadas com sucesso!'); }
                if (typeof window.jQuery !== 'undefined') {
                    var urlHome = $('#main-menu').find('a[href*="controlador.php?acao=procedimento_controlar"]').attr('href');
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
            var baseName = 'SEI Pro Atividades';
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
    if (typeof param.acao_pro !== 'undefined' && param.acao_pro == 'set_database' && typeof param.token !== 'undefined' && typeof param.url !== 'undefined') {
        if (param.base == 'atividades') {
            var baseName = 'SEI Pro Atividades';
            var data = { 
                type: "NEW_BASE", 
                mode: param.mode, 
                base: param.base, 
                alert: true, 
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
observeAcaoPro();
changeBasePro();