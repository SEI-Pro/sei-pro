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
        // Update status to let user know options were saved.
        if ( reload == true ) { 
            alertaBoxPro('Sucess', 'check-circle', 'Configura\u00e7\u00f5es salvas com sucesso!');
            //location.reload(true); 
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
        if(jmespath.search(dataValuesConfig, "[?name=='uploaddocsexternos'].value | [0]") || jmespath.search(dataValuesConfig, "[?name=='uploaddocsexternos'].value | [0]") === null) {
            $('#uploadDoc_sortBefore').show();
        } else {
            $('#uploadDoc_sortBefore').hide();
        }
        if (jmespath.search(dataValuesConfig, "[?name=='newdocname'].value | [0]") !== null) { 
            $('#itemConfigGeral_newdocname')
                .val(jmespath.search(dataValuesConfig, "[?name=='newdocname'].value | [0]"))
                .closest('tr').find('.iconPopup').addClass('azulColor').removeClass('cinzaColor');
        }
        if (jmespath.search(dataValuesConfig, "[?name=='newdocobs'].value | [0]") !== null) { 
            $('#itemConfigGeral_newdocobs')
                .val(jmespath.search(dataValuesConfig, "[?name=='newdocobs'].value | [0]"))
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
        addActionsProfile();
    });
}
function actionRemoveProfile(idTable) {
    $('#sca-removeProfile-'+idTable).show().click(function() { 
        $('#options-table-'+idTable).effect('highlight').delay(1).effect('highlight');
        if ( $('.removeProfile').length > 1 ) {
            $('#options-table-'+idTable).fadeOut('slow', function() {
                $(this).remove();
                //  $('.save').removeClass('button-light');
            });
        } else {
            $('#options-table-'+idTable).find('.input-config-pro').val('');
            remove_options();
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
    $('#options-functions').find('input[name="onoffswitch"]').each(function(){
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
    $('#options-functions').find('input[type="text"]').each(function(){
        if ($(this).val() != '') {
            arrayShowItensMenu.push({name: $(this).attr('data-name'), value: $(this).val()});
        }
    });
    $('#options-functions').find('select').each(function(){
        if ($(this).val() != '') {
            arrayShowItensMenu.push({name: $(this).attr('data-name'), value: $(this).val()});
        }
    });
    if ($('#itemConfigGeral_newdocdefault').is(':checked')) { $('#newdocDefault_table').show(); } else { $('#newdocDefault_table').hide(); }
    if ($('#itemConfigGeral_uploaddocsexternos').is(':checked')) { 
        $('#uploadDoc_sortBefore').show(); 
    } else { 
        $('#uploadDoc_sortBefore').hide(); 
        $('#itemConfigGeral_sortbeforeupload').prop('checked',false); 
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
$('#options-functions').find('input[type="text"]').on("keyup", function () {
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

$(function(){
    restore_options();
    $('#options-tabs').tabs();
});