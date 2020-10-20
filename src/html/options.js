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
            //alert('Configura\u00e7\u00f5es carregadas com sucesso!');
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
            //alert('Configura\u00e7\u00f5es removidas com sucesso!');
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
			input[inputName] = value;
            if ( value == '' ) { $(this).addClass('inputError'); checkInput++; }
		});
		dataValues.push(input);
    });
    if ( checkInput == 0 ) {
        chrome.storage.sync.set({
            dataValues: JSON.stringify(dataValues)
        }, function() {
            // Update status to let user know options were saved.
            if ( reload == true ) { 
                //alert('Configura\u00e7\u00f5es salvas com sucesso!');
                alertaBoxPro('Sucess', 'check-circle', 'Configura\u00e7\u00f5es salvas com sucesso!');
                //location.reload(true); 
            } else { 
                downloadFile(); 
            }
        });
    } else {
        //alert('Preencha todos os campos obrigat\u00F3rios!');
        alertaBoxPro('Error', 'exclamation-triangle', 'Preencha todos os campos obrigat\u00F3rios!');
    }
}

// Restores input text state using the preferences
// stored in chrome.storage.
function restore_options() {
    chrome.storage.sync.get({
        dataValues: ''
    }, function(items) {

        var dataValues = ( items.dataValues != '' ) ? JSON.parse(items.dataValues) : [];        
        for (i = 0; i < dataValues.length; i++) {
            if ( i > 0 ) { addProfile(); } else { actionRemoveProfile(i); }
        }
        $.each(dataValues, function (indexA, value) {
            $('#options-table-'+indexA).each(function(indexB){
                var nProfile = $(this);
                $.each(value, function (i, v) {
                    nProfile.find('.input-config-pro[data-name-input="'+i+'"]').val(v);
                });
            });
        });
    });
}
function actionRemoveProfile(idTable) {
    $('#sca-removeProfile-'+idTable).show().click(function() { 
        $('#options-table-'+idTable).effect('highlight').delay(1).effect('highlight');
        if ( $('.removeProfile').length > 1 ) {
            $('#options-table-'+idTable).fadeOut('slow', function() {
                $(this).remove();
                 $('.save').removeClass('button-light');
            });
        } else {
            $('#options-table-'+idTable).find('.input-config-pro').val('');
            remove_options();
        }
    });
    $('.options-table').find('.input-config-pro').on('change', function() {
        $('.save').removeClass('button-light');
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
}

$('.save').click(function() { save_options(true) });
$('#new').click(function() { addProfile() });

$(function(){
    restore_options();
});