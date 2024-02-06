var isNewSEI = $('#divIdentificacaoSistema').length || $('#divInfraAreaTela').hasClass('divInfraAreaTelaSimples') ? true : false;

function verifyConfigValue(name) {
    var configBasePro = ( typeof localStorage.getItem('configBasePro') !== 'undefined' && localStorage.getItem('configBasePro') != '' ) ? JSON.parse(localStorage.getItem('configBasePro')) : [];
    var dataValuesConfig = (typeof jmespath !== 'undefined') ? jmespath.search(configBasePro, "[*].configGeral | [0]") : false;
        dataValuesConfig = (typeof jmespath !== 'undefined') ? jmespath.search(dataValuesConfig, "[?name=='"+name+"'].value | [0]") : false;
        dataValuesConfig = (dataValuesConfig !== null) ? dataValuesConfig : false;
    
    if (dataValuesConfig == true ) {
        return true;
    } else {
        return false;
    }
}
function loadRepairPwdNewSei() {
    if (verifyConfigValue('autopreenchersenha') && window.location.href.indexOf('sip/login.php') !== -1 && $('#divIdentificacaoSistema').length) {
        $('#pwdSenha').hide();
        $('input[type="password"]').show().attr('autocomplete','current-password').css({
            fontSize: '2em',
            height: 'calc(1em + .75rem)',
            borderTopLeftRadius: '0',
            borderBottomLeftRadius: '0'
        }).addClass('form-control masked').focus().on('change',function(){ $('#pwdSenha').val($(this).val()).trigger('change'); });
        console.log('loadRepairPwdNewSei');
    } else if (verifyConfigValue('autopreenchersenha') && window.location.href.indexOf('acao=documento_assinar') !== -1 && $('#frmAssinaturas').length) {
        $('#pwdSenha').hide();
        $('input[type="password"]').show().attr('autocomplete','current-password').css({
            fontSize: '2em',
            height: 'calc(.8em + .75rem)',
            width: '25%'
        }).addClass('infraText masked').focus().on('change',function(){ $('#pwdSenha').val($(this).val()).trigger('change'); });
    }
}
if (isNewSEI) {
    loadRepairPwdNewSei();
}
