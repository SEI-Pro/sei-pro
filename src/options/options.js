$('#import').on("click", function () {
    $('#selectFiles[type=file]').trigger('click');
});

$('#export').on("click", function () { save_options(false) });

$('#selectFiles[type=file]').change(function(){
    loadFile();
});
function alertaBoxPro(status, icon, text) {
    $('#alertaBoxPro')
        .html('<strong class="alerta'+status+'Pro alertaBoxPro" style="font-size: 12pt; padding: 15px 5px 0; display: block;"><i class="fas fa-'+icon+'"></i> '+text+'</strong>')
        .dialog({
            height: "auto",
            width: "auto",
            modal: true,
            my: "center",
            at: "center",
            of: window,
            close: function() {
              location.reload(true);
            },
        	buttons: [{
                text: "OK",
                click: function() {
                    $(this).dialog('close');
                    location.reload(true);
                }
            }]
        });
}
function loadFile() {
    var files = document.getElementById('selectFiles').files;
    if (files.length <= 0) { return false; }
    
    var fr = new FileReader();
    fr.onload = function(e) { 
        var result = JSON.parse(e.target.result);        
        chrome.storage.sync.set({
            dataValues: JSON.stringify(result)
        }, function() {
            // Update status to let user know options were saved.
            alertaBoxPro('Sucess', 'check-circle', 'Configura\u00e7\u00f5es carregadas com sucesso!');
            //location.reload(true);
        });
    }
    fr.readAsText(files.item(0));
}

function downloadFile() {
    chrome.storage.sync.get({
        dataValues: ''
    }, function(items) {
        var filename = 'config.json';
        var jsonFile = items.dataValues
        var blob = new Blob([jsonFile], { type: 'application/json;charset=utf-8,%EF%BB%BF' });
        if (navigator.msSaveBlob) { // IE 10+
            navigator.msSaveBlob(blob, filename);
        } else {
            var link = document.createElement("a");
            if (link.download !== undefined) { // feature detection
                // Browsers that support HTML5 download attribute
                var url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", filename);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }
        location.reload(true);
    });
}
// Saves options to chrome.storage
function remove_options() {
        chrome.storage.sync.set({
            dataValues: ''
        }, function() {
            // Update status to let user know options were saved.
            alertaBoxPro('Sucess', 'check-circle', 'Configura\u00e7\u00f5es removidas com sucesso!');
            //location.reload(true); 
        });
}
function closeOptionsView(goHome = false) {
    try {
        if (window.parent && window.parent !== window) {
            window.parent.postMessage({
                source: 'SEI_PRO_OPTIONS',
                action: 'close-options',
                goHome: goHome === true
            }, '*');
            return true;
        }
    } catch (error) {
        console.warn('Não foi possível notificar o fechamento das configurações:', error);
    }

    try {
        window.close();
        return true;
    } catch (error) {
        console.warn('Não foi possível fechar a janela de configurações:', error);
    }

    return false;
}
function getRuntimeApi() {
    if (typeof browser !== 'undefined' && browser.runtime) {
        return browser;
    }
    if (typeof chrome !== 'undefined' && chrome.runtime) {
        return chrome;
    }
    return null;
}
function isDefaultEnabledConfigOption(name) {
    return ['filtrarpaginapelapesquisarapida'].indexOf(String(name || '')) !== -1;
}
function syncProcessNotificationOption() {
    var runtimeApi = getRuntimeApi();
    if (!runtimeApi || !runtimeApi.runtime || typeof runtimeApi.runtime.sendMessage !== 'function') {
        return;
    }

    try {
        runtimeApi.runtime.sendMessage({
            action: 'syncNotificacaoProcessosConfig',
            enabled: $('#itemConfigGeral_notificacaonovoprocesso').is(':checked')
        });
    } catch (error) {
        console.warn('Não foi possível sincronizar a configuração de notificações:', error);
    }
}
function save_options(reload) {
    
	var dataValues = [];
    var checkInput = 0;
    $('.options-table').each(function(indexT){
		var input = {};
		$(this).find('.input-config-pro').each(function(indexI){
            $(this).removeClass('inputError');
			var value = $(this).val();
			var inputName = $(this).attr('data-name-input');
            if ($(this).prop('required') && value == '' ) { 
                $(this).addClass('inputError'); 
                checkInput++; 
            } else {
                input[inputName] = value;
            }
		});
		if ( checkInput == 0  ) { dataValues.push(input); }
    });
    dataValues.push({configGeral: changeConfigGeral()});
        
    chrome.storage.sync.set({
        dataValues: JSON.stringify(dataValues)
    }, function() {
        syncProcessNotificationOption();
        // Update status to let user know options were saved.
        if ( reload == true ) { 
            if (!closeOptionsView(true)) {
                alertaBoxPro('Sucess', 'check-circle', 'Configura\u00e7\u00f5es salvas com sucesso!');
            }
        } else { 
            downloadFile(); 
        }
    });
}

// Restores input text state using the preferences
// stored in chrome.storage.
function restore_options() {
    chrome.storage.sync.get({
        dataValues: ''
    }, function(items) {

        var dataValues = ( items.dataValues != '' ) ? JSON.parse(items.dataValues) : [];    
            dataValues = jmespath.search(dataValues, "[?baseName]");
        
        for (i = 0; i < dataValues.length; i++) {
            if ( i > 0 ) { addProfile(); } else { actionRemoveProfile(i); }
        }
        $.each(dataValues, function (indexA, value) {
            $('#options-table-'+indexA).each(function(indexB){
                var nProfile = $(this);
                $.each(value, function (i, v) {
                    nProfile.find('.input-config-pro[data-name-input="'+i+'"]').val(v);
                });
                if (nProfile.find('.input-config-pro[data-name-input="spreadsheetId"]').val() != '') {
                    var conexaoTipo = nProfile.find('.sca-conexaoTipo')
                        conexaoTipo.val('sheets')
                        changeConexaoTipo(conexaoTipo);
                } else {
                    var typeApi = (nProfile.find('.input-config-pro[data-name-input="KEY_USER"]').val() == '') ? 'googleapi' : 'api';
                    var conexaoTipo = nProfile.find('.sca-conexaoTipo')
                        conexaoTipo.val(typeApi)
                        changeConexaoTipo(conexaoTipo);
                }
            });
        });
        if (dataValues == null || dataValues.length == 0) {
            setTimeout(function(){ 
                console.log('dataValues**',dataValues);
                $('.sca-conexaoTipo').trigger('change');
            }, 500);
        }
        
        var dataValuesConfig = ( items.dataValues != '' ) ? JSON.parse(items.dataValues) : [];
            dataValuesConfig = jmespath.search(dataValuesConfig, "[*].configGeral | [0]");
            $('input[name="onoffswitch"][data-name]').each(function() {
                var optionName = $(this).attr('data-name');
                if (isDefaultEnabledConfigOption(optionName)) {
                    $(this).prop('checked', true);
                    $(this).closest('tr').find('.iconPopup').addClass('azulColor').removeClass('cinzaColor');
                }
            });
            $.each(dataValuesConfig, function (indexB, value) {
                if (value.value === false) { 
                    $('#itemConfigGeral_'+value.name).prop('checked', false); 
                    $('#itemConfigGeral_'+value.name).closest('tr').find('.iconPopup').removeClass('azulColor').addClass('cinzaColor');
                } else if (value.value === true) {
                    $('#itemConfigGeral_'+value.name).prop('checked', true); 
                    $('#itemConfigGeral_'+value.name).closest('tr').find('.iconPopup').addClass('azulColor').removeClass('cinzaColor');
                }
            });
        if(jmespath.search(dataValuesConfig, "[?name=='newdocdefault'].value | [0]") || jmespath.search(dataValuesConfig, "[?name=='newdocdefault'].value | [0]") === null) {
            $('#newdocDefault_table').show();
        } else {
            $('#newdocDefault_table').hide();
        }
        if(jmespath.search(dataValuesConfig, "[?name=='gerenciarfavoritos'].value | [0]") || jmespath.search(dataValuesConfig, "[?name=='gerenciarfavoritos'].value | [0]") === null) {
            $('#favoritesPro_beforeControl').show();
        } else {
            $('#favoritesPro_beforeControl').hide();
            $('#itemConfigGeral_favoritosacimacontrole').prop('checked', false);
        }
        if(jmespath.search(dataValuesConfig, "[?name=='uploaddocsexternos'].value | [0]") || jmespath.search(dataValuesConfig, "[?name=='uploaddocsexternos'].value | [0]") === null) {
            $('#uploadDoc_sortBefore').show();
        } else {
            $('#uploadDoc_sortBefore').hide();
        }
        if(jmespath.search(dataValuesConfig, "[?name=='certidaosigilo'].value | [0]") || jmespath.search(dataValuesConfig, "[?name=='certidaosigilo'].value | [0]") === null) {
            $('#getDocCertidao_docName').show();
        } else {
            $('#getDocCertidao_docName').hide();
        }
        if (jmespath.search(dataValuesConfig, "[?name=='newdocname'].value | [0]") !== null) { 
            $('#itemConfigGeral_newdocname')
                .val(jmespath.search(dataValuesConfig, "[?name=='newdocname'].value | [0]"))
                .closest('tr').find('.iconPopup').addClass('azulColor').removeClass('cinzaColor');
        }
        if (jmespath.search(dataValuesConfig, "[?name=='certidaosigilo_nomedoc'].value | [0]") !== null) { 
            $('#itemConfigGeral_certidaosigilo_nomedoc')
                .val(jmespath.search(dataValuesConfig, "[?name=='certidaosigilo_nomedoc'].value | [0]"))
                .closest('tr').find('.iconPopup').addClass('azulColor').removeClass('cinzaColor');
        }
        if (jmespath.search(dataValuesConfig, "[?name=='newdocobs'].value | [0]") !== null) { 
            $('#itemConfigGeral_newdocobs')
                .val(jmespath.search(dataValuesConfig, "[?name=='newdocobs'].value | [0]"))
                .closest('tr').find('.iconPopup').addClass('azulColor').removeClass('cinzaColor');
        }
        if (jmespath.search(dataValuesConfig, "[?name=='newdocespec'].value | [0]") !== null) { 
            $('#itemConfigGeral_newdocespec')
                .val(jmespath.search(dataValuesConfig, "[?name=='newdocespec'].value | [0]"))
                .closest('tr').find('.iconPopup').addClass('azulColor').removeClass('cinzaColor');
        }
        if (jmespath.search(dataValuesConfig, "[?name=='newdocformat'].value | [0]") !== null) { 
            $('#itemConfigGeral_newdocformat')
                .val(jmespath.search(dataValuesConfig, "[?name=='newdocformat'].value | [0]"))
                .closest('tr').find('.iconPopup').addClass('azulColor').removeClass('cinzaColor');
        }
        if (jmespath.search(dataValuesConfig, "[?name=='citacaodoc'].value | [0]") !== null) { 
            $('#itemConfigGeral_citacaodoc').val(jmespath.search(dataValuesConfig, "[?name=='citacaodoc'].value | [0]"));
        }
        if (jmespath.search(dataValuesConfig, "[?name=='combinacaoteclas'].value | [0]") !== null) { 
            $('#itemConfigGeral_combinacaoteclas').val(jmespath.search(dataValuesConfig, "[?name=='combinacaoteclas'].value | [0]"));
        }
        if (jmespath.search(dataValuesConfig, "[?name=='salvamentoautomatico'].value | [0]") !== null) { 
            $('#itemConfigGeral_salvamentoautomatico').val(jmespath.search(dataValuesConfig, "[?name=='salvamentoautomatico'].value | [0]"));
        }
        if (jmespath.search(dataValuesConfig, "[?name=='qualidadeimagens'].value | [0]") !== null) { 
            $('#itemConfigGeral_qualidadeimagens').val(jmespath.search(dataValuesConfig, "[?name=='qualidadeimagens'].value | [0]"));
        }
        if (jmespath.search(dataValuesConfig, "[?name=='newdocsigilo'].value | [0]") !== null) {
            var valueNewDocSigilo = jmespath.search(dataValuesConfig, "[?name=='newdocsigilo'].value | [0]");
                valueNewDocSigilo = (valueNewDocSigilo != '' && valueNewDocSigilo.indexOf('|') !== -1) ? valueNewDocSigilo.split('|') : false;
                if (valueNewDocSigilo) {
                    $('#itemConfigGeral_newdocsigilo').append('<option value="'+valueNewDocSigilo[0]+'" selected>'+valueNewDocSigilo[2]+'</option>');
                    $('#itemConfigGeral_newdocsigilo').val(valueNewDocSigilo[0]);
                }
        }
        if(jmespath.search(dataValuesConfig, "[?name=='newdocnivel'].value | [0]") || jmespath.search(dataValuesConfig, "[?name=='newdocnivel'].value | [0]") === null) {
            $('#newDoc_sigilo').hide();
            $('#itemConfigGeral_newdocsigilo').html('<option value=""></option>').val(''); 
        } else {
            $('#newDoc_sigilo').show();
        }
        addActionsProfile();
        applyOptionsSearchFilter();
    });
}
function actionRemoveProfile(idTable) {
    $('#sca-upProfile-'+idTable).show().click(function() { 
        var up = $(this).closest('table').prev();
        if (typeof up !== 'undefined') $(this).closest('table').insertBefore(up).hide().fadeIn('slow').effect('highlight');
    });
    $('#sca-downProfile-'+idTable).show().click(function() { 
        var down = $(this).closest('table').next();
        if (typeof down !== 'undefined') $(this).closest('table').insertAfter(down).hide().fadeIn('slow').effect('highlight');
    });
    $('#sca-removeProfile-'+idTable).show().click(function() { 
        $('#options-table-'+idTable).effect('highlight').delay(1).effect('highlight');
        if ( $('.removeProfile').length > 1 ) {
            $('#options-table-'+idTable).fadeOut('slow', function() {
                $(this).remove();
                applyOptionsSearchFilter();
                //  $('.save').removeClass('button-light');
            });
        } else {
            $('#options-table-'+idTable).find('.input-config-pro').val('');
            remove_options();
            applyOptionsSearchFilter();
        }
    });
    $('.options-table').find('.input-config-pro').on('change', function() {
        // $('.save').removeClass('button-light');
    });
}
function addProfile() {
    var idTable = $('.options-table').length;
    $("#options-table-0").clone().attr('id', 'options-table-'+idTable).appendTo("#options-profile");
    $("#options-table-"+idTable).find('.input-config-pro').val('');
    $("#options-table-"+idTable).find('.option-ref').each(function(index){
        var idElement = $(this).attr('id').replace('-0', '-'+idTable);
        $(this).attr('id', idElement);
    });
    actionRemoveProfile(idTable);
    addActionsProfile();
    applyOptionsSearchFilter();
}
function addActionsProfile() {
    $('.sca-conexaoTipo').unbind().on("change", function () {
        changeConexaoTipo(this);
    });
    $('.passRevealBtn').unbind().on("click", function () {
        passReveal(this);
    })
    $('.passReveal').unbind().on("input", function () {
        passUpdate(this);
    });
}
function getOptionsGeneralPanels() {
    return $('#options-process-control, #options-editor-text, #options-tree-view, #options-functions');
}
function passUpdate(this_) {
    var _this = $(this_);
    var _parent = _this.closest('td');
    var show = _parent.find('input[type="text"].passReveal');
    var pass = _parent.find('input[type="password"].passReveal');
    var type = _this.attr('type');
    if (type == 'text') {
        pass.val(show.val());
    } else if (type == 'password') {
        show.val(pass.val());
    }
}
function changeConfigGeral() {
    var arrayShowItensMenu = [];
    getOptionsGeneralPanels().find('input[name="onoffswitch"]').each(function(){
        if ($(this).is(':checked')) {
            var value = true;
            $(this).closest('tr').find('.iconPopup').addClass('azulColor').removeClass('cinzaColor');
        } else {
            var value = false;
            $(this).closest('tr').find('.iconPopup').removeClass('azulColor').addClass('cinzaColor');
        }
        arrayShowItensMenu.push({name: $(this).attr('data-name'), value: value});
    });
    $('#options-complements').find('input[name="onoffswitch"]').each(function(){
        if ($(this).is(':checked')) {
            var value = true;
            $(this).closest('tr').find('.iconPopup').addClass('azulColor').removeClass('cinzaColor');
        } else {
            var value = false;
            $(this).closest('tr').find('.iconPopup').removeClass('azulColor').addClass('cinzaColor');
        }
        arrayShowItensMenu.push({name: $(this).attr('data-name'), value: value});
    });
    getOptionsGeneralPanels().find('input[type="text"]').each(function(){
        if ($(this).val() != '') {
            arrayShowItensMenu.push({name: $(this).attr('data-name'), value: $(this).val()});
        }
    });
    getOptionsGeneralPanels().find('input[type="number"]').each(function(){
        if ($(this).val() != '') {
            arrayShowItensMenu.push({name: $(this).attr('data-name'), value: parseInt($(this).val())});
        }
    });
    getOptionsGeneralPanels().find('select').each(function(){
        if ($(this).val() != '') {
            arrayShowItensMenu.push({name: $(this).attr('data-name'), value: $(this).val()});
        }
    });
    if ($('#itemConfigGeral_newdocdefault').is(':checked')) { $('#newdocDefault_table').show(); } else { $('#newdocDefault_table').hide(); } 
    if ($('#itemConfigGeral_gerenciarfavoritos').is(':checked')) {
        $('#favoritesPro_beforeControl').show();
    } else {
        $('#favoritesPro_beforeControl').hide();
        $('#itemConfigGeral_favoritosacimacontrole').prop('checked',false);
    }
    if ($('#itemConfigGeral_uploaddocsexternos').is(':checked')) { 
        $('#uploadDoc_sortBefore').show(); 
    } else { 
        $('#uploadDoc_sortBefore').hide(); 
        $('#itemConfigGeral_sortbeforeupload').prop('checked',false); 
    }
    if ($('#itemConfigGeral_certidaosigilo').is(':checked')) {
        $('#getDocCertidao_docName').show(); 
    } else { 
        $('#getDocCertidao_docName').hide(); 
    }
    if ($('#itemConfigGeral_newdocnivel').is(':checked')) { 
        $('#newDoc_sigilo').hide(); 
        $('#itemConfigGeral_newdocsigilo').html('<option value=""></option>').val(''); 
    } else { 
        $('#newDoc_sigilo').show(); 
    }
    return arrayShowItensMenu;
}
function changeConexaoTipo(this_) {
    var _this = $(this_);
    var _parent = _this.closest('table');
    var mode = _this.val();
    if (mode == 'sheets') {
        _parent.find('tr.sheets').show();
        _parent.find('tr.api').hide().find('input').val('');
    } else if (mode == 'api') {
        _parent.find('tr.sheets').hide().find('input').val('');
        _parent.find('tr.api').show();
    } else if (mode == 'googleapi') {
        _parent.find('tr.sheets').not('.clientid').hide().find('input').val('');
        _parent.find('tr.api').show();
        _parent.find('tr.clientid').show();
        _parent.find('tr.api.keyuser').hide();
    }
}
function passReveal(this_){
    var _this = $(this_);
    var _parent = _this.closest('td');
    var show = _parent.find('input[type="text"].passReveal'),
        pass = _parent.find('input[type="password"].passReveal'),
        showing = show.is(":visible"),
        from = showing ? show : pass,
        to = showing ? pass : show;
    from.hide();
    to.val(from.val()).show();
    _this.attr('class', showing ? 'option-ref passRevealBtn fas fa-eye' : 'option-ref passRevealBtn fas fa-eye-slash');
}
function getManifestExtension() {
    if (typeof browser === "undefined") {
        return chrome.runtime.getManifest();
    } else {
        return browser.runtime.getManifest();
    }
}
function setNamePage() {
    var manifest = getManifestExtension();
    var NAMESPACE_SPRO = manifest.short_name;
    var ICONSPACE_SPRO = manifest.icons['32'];
    var URLPages_SPRO = 'https://sei-pro.github.io/sei-pro';
    // var title = 'Configura\u00E7\u00F5es Gerais | '+NAMESPACE_SPRO;
    $('.title .name-space').text(NAMESPACE_SPRO);
    $('.icon-space').attr('src','../'+ICONSPACE_SPRO);
    $('a.manual').each(function(){
        $(this).attr('href', URLPages_SPRO+$(this).attr('href'));
    });
    if (NAMESPACE_SPRO == 'SEI Pro PRF Dev') {
        $('body').addClass('SEIPro_lab');
    } else if (NAMESPACE_SPRO == 'ANTAQ Pro') {
        $('body').addClass('ANTAQ_Pro');
    } else if (NAMESPACE_SPRO == 'ANTT Pro') {
        $('body').addClass('ANTAQ_Pro');
    }
    console.log(manifest);
}
var optionsSearchState = {
    rafId: 0,
    tabsActive: 0,
    tabsSearchMode: false
};
function normalizeOptionsSearchText(text) {
    return (text || '')
        .toString()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();
}
function clearOptionsSearchFilterClasses() {
    $('.options-search-hidden').removeClass('options-search-hidden');
    $('.options-search-match').removeClass('options-search-match');
}
function setOptionsTabsSearchMode(enable) {
    var $tabs = $('#options-tabs');
    if (!$tabs.length) {
        return;
    }

    if (enable) {
        if (!$tabs.hasClass('options-search-mode')) {
            if ($tabs.hasClass('ui-tabs')) {
                try {
                    optionsSearchState.tabsActive = $tabs.tabs('option', 'active');
                } catch (error) {
                    optionsSearchState.tabsActive = 0;
                }
                $tabs.tabs('destroy');
            }
            $tabs.addClass('options-search-mode');
            $tabs.children('ul').hide();
            $tabs.children('#options-process-control, #options-editor-text, #options-tree-view, #options-database, #options-complements').show();
        }
        optionsSearchState.tabsSearchMode = true;
    } else if ($tabs.hasClass('options-search-mode')) {
        $tabs.removeClass('options-search-mode');
        $tabs.children('ul').show();
        if (!$tabs.hasClass('ui-tabs')) {
            $tabs.tabs({
                active: (typeof optionsSearchState.tabsActive === 'number') ? optionsSearchState.tabsActive : 0
            });
        }
        optionsSearchState.tabsSearchMode = false;
    }
}
function rebuildOptionsFunctionTabs() {
    var $accordion = $('#accordion');
    if (!$accordion.length) {
        return;
    }

    var tabMap = [
        '#options-process-control',
        '#options-editor-text',
        '#options-tree-view'
    ];

    $accordion.children('h3').each(function(index) {
        var selector = tabMap[index];
        if (!selector) {
            return;
        }

        var $target = $(selector);
        if (!$target.length || $.trim($target.html()) !== '') {
            return;
        }

        var $pane = $(this).next('div');
        if ($pane.length) {
            $target.append($pane.children().detach());
        }
    });
}
function applyOptionsSearchFilter() {
    var query = normalizeOptionsSearchText($('#options-search-input').val());
    var hasQuery = query !== '';
    var $tabs = $('#options-tabs');
    var tabsWidgetReady = $tabs.hasClass('ui-tabs') || !!$tabs.data('ui-tabs');
    var activeTab = tabsWidgetReady
        ? $tabs.tabs('option', 'active')
        : optionsSearchState.tabsActive;
    var tabMatches = [false, false, false, false, false];
    var visibleMatches = 0;

    clearOptionsSearchFilterClasses();
    setOptionsTabsSearchMode(hasQuery);

    if (!hasQuery) {
        $('#options-search-empty').hide();
        return;
    }

    var tabDefinitions = [
        { selector: '#options-process-control table.tableZebra', index: 0 },
        { selector: '#options-editor-text table.tableZebra', index: 1 },
        { selector: '#options-tree-view table.tableZebra', index: 2 },
        { selector: '#options-profile .options-table', index: 3 },
        { selector: '#options-complements table.tableZebra', index: 4 }
    ];

    $.each(tabDefinitions, function(_, definition) {
        $(definition.selector).each(function() {
            var $table = $(this);
            var tableHasMatch = false;

            $table.find('tr').each(function() {
                var $row = $(this);

                if ($row.is('#footer') || !$row.is(':visible')) {
                    return;
                }

                var rowHasMatch = normalizeOptionsSearchText($row.text()).indexOf(query) !== -1;
                if (rowHasMatch) {
                    tableHasMatch = true;
                    visibleMatches++;
                    $row.removeClass('options-search-hidden');
                    $row.addClass('options-search-match');
                } else {
                    $row.addClass('options-search-hidden');
                }
            });

            if (tableHasMatch) {
                tabMatches[definition.index] = true;
                $table.removeClass('options-search-hidden');
            } else {
                $table.addClass('options-search-hidden');
            }
        });
    });

    var targetTab = -1;
    if (tabMatches[activeTab]) {
        targetTab = activeTab;
    } else {
        for (var i = 0; i < tabMatches.length; i++) {
            if (tabMatches[i]) {
                targetTab = i;
                break;
            }
        }
    }

    if (!optionsSearchState.tabsSearchMode && targetTab !== -1 && targetTab !== activeTab) {
        $('#options-tabs').tabs('option', 'active', targetTab);
    }

    $('#options-search-empty').toggle(visibleMatches === 0);
}
function scheduleOptionsSearchFilter() {
    if (optionsSearchState.rafId) {
        window.cancelAnimationFrame(optionsSearchState.rafId);
    }
    optionsSearchState.rafId = window.requestAnimationFrame(function() {
        optionsSearchState.rafId = 0;
        applyOptionsSearchFilter();
    });
}
$(document).on("keyup", "#options-process-control input[type='text'], #options-editor-text input[type='text'], #options-tree-view input[type='text'], #options-functions input[type='text']", function () {
    if ($(this).val() != '') {
        $(this).closest('tr').find('.iconPopup').addClass('azulColor').removeClass('cinzaColor');
    } else {
        $(this).closest('tr').find('.iconPopup').removeClass('azulColor').addClass('cinzaColor');
    }
});
$('input[name="onoffswitch"]').on("change", function () {
    changeConfigGeral();
});
$('.save').click(function() { save_options(true) });
$('#new').click(function() { addProfile() });
$(document).on('input', '#options-search-input', function() {
    scheduleOptionsSearchFilter();
});
$(document).on('search', '#options-search-input', function() {
    scheduleOptionsSearchFilter();
});
$(document).on('click', '#options-search-clear', function() {
    $('#options-search-input').val('');
    scheduleOptionsSearchFilter();
    $('#options-search-input').trigger('focus');
});

$(function(){
    restore_options();
    rebuildOptionsFunctionTabs();
    $('#options-tabs').tabs();
    setNamePage();
    applyOptionsSearchFilter();
});
