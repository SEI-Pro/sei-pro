// [migrado para core/sei] verifyConfigValue
function isLoginPageNewSei() {
    return window.location.href.indexOf('sip/login.php') !== -1;
}
function loadRepairPwdNewSei(attempt) {
    attempt = typeof attempt === 'number' ? attempt : 0;

    if (verifyConfigValue('autopreenchersenha') && isLoginPageNewSei()) {
        var pwdHidden = $('#pwdSenha');
        var pwdVisible = $('input[type="password"]').not('#pwdSenha');

        if (!pwdHidden.length || !pwdVisible.length) {
            if (attempt < 20) {
                setTimeout(function() { loadRepairPwdNewSei(attempt + 1); }, 250);
            }
            return;
        }

        pwdHidden.hide();
        pwdVisible.show().attr('autocomplete','current-password').css({
            fontSize: '2em',
            height: 'calc(1em + .75rem)',
            borderTopLeftRadius: '0',
            borderBottomLeftRadius: '0'
        }).addClass('form-control masked').off('change.seiProPwd').on('change.seiProPwd',function(){
            pwdHidden.val($(this).val()).trigger('change');
        });
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
$(function() {
    loadRepairPwdNewSei();
});
