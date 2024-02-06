function dialogDBTransition() {
    var new_extension = sessionStorage.getItem('new_extension');
        new_extension = (new_extension !== null) ? JSON.parse(new_extension) : false;
    var old_extension = sessionStorage.getItem('old_extension');
        old_extension = (old_extension !== null) ? JSON.parse(old_extension) : false;
    var config_transition = sessionStorage.getItem('config_transition');
        config_transition = (config_transition !== null) ? JSON.parse(config_transition) : false;
    if (new_extension && old_extension && config_transition) {
        var htmlBox =   'Deseja migrar as configura\u00E7\u00F5es da extens\u00E3o <b style="font-weight: bold;">'+old_extension.NAMESPACE_SPRO+'</b> para a extens\u00E3o <b style="font-weight: bold;">'+new_extension.NAMESPACE_SPRO+'</b>?'+
                        '<div style="text-align: center;padding: 10px;">'+
                        '   <img style="vertical-align: middle;" src="'+old_extension.URL_SPRO+old_extension.ICON_SPRO['48']+'">'+
                        '   <i style="font-size:20pt;margin: 0px 10px;" class="fas fa-random azulColor"></i>'+
                        '   <img style="vertical-align: middle;" src="'+old_extension.URL_SPRO+new_extension.ICON_SPRO['48']+'">'+
                        '</div>';
        // resetDialogBoxPro('dialogBoxPro');
        dialogBoxPro = $('#dialogBoxPro')
            .html('<div class="dialogBoxDiv"><strong class="alertaAttencionPro"><i class="fas fa-exclamation-triangle" style="margin-right: 5px;"></i> '+htmlBox+'</strong></div>')
            .dialog({
                title: 'Migrar Configura\u00E7\u00F5es',
                width: 480,
                open: function() { 
                    updateButtonConfirm(this, true);
                },
                close: function() { 
                    resetDialogBoxPro('dialogBoxPro');
                },
                buttons: [{
                    text: 'Migrar',
                    class: 'confirm',
                    click: function(event) { 
                        console.log(config_transition);
                    }
                }]
        });
    }
}
function initDialogDBTransition(TimeOut = 9000) {
    if (TimeOut <= 0 || parent.window.name != '') { return; }
    if (typeof resetDialogBoxPro === 'function') {
        dialogDBTransition();
    } else {
        setTimeout(function(){ 
            initDialogDBTransition(TimeOut - 100); 
            if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage'))console.log('Reload initDialogDBTransition => '+TimeOut); 
        }, 500);
    }
}
dialogDBTransition();