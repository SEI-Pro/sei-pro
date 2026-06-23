// [migrado para core/sei] verifyConfigValue
// isLoginPageNewSei / isDocumentoAssinarPage migrados para SeiPro.sei.urls
// (src/sei/urls.js) — Fase 6. Globais via aliasGlobal.

// Torna um campo de senha "autofill-friendly": esconde o campo real (#pwdSenha),
// expõe o campo visível com autocomplete="current-password" e mantém o real
// sincronizado. Sincroniza em 'input' E 'change' (não só no blur), evitando que
// um autofill seguido de submit por Enter envie o #pwdSenha vazio. Idempotente
// (rebinda via namespace .seiProPwd).
function repairPwdField(pwdHidden, pwdVisible, css, extraClass, doFocus) {
    pwdHidden.hide();
    pwdVisible
        .show()
        .attr('autocomplete', 'current-password')
        .css(css)
        .addClass(extraClass)
        .off('.seiProPwd')
        .on('input.seiProPwd change.seiProPwd', function () {
            pwdHidden.val($(this).val()).trigger('change');
        });

    // Sync inicial: cobre o caso de o gerenciador já ter preenchido o campo
    // visível ANTES do bind (autofill no carregamento da página).
    var current = pwdVisible.val();
    if (current) {
        pwdHidden.val(current).trigger('change');
    }

    if (doFocus) pwdVisible.trigger('focus');
}

// Aplica o reparo na página atual (login ou assinatura). Retorna true se os
// campos existiam e o reparo foi aplicado; false se ainda não há o que reparar.
function applyRepairPwd() {
    if (!verifyConfigValue('autopreenchersenha')) return false;

    if (isLoginPageNewSei()) {
        var loginHidden = $('#pwdSenha');
        // Escopa ao form que contém o #pwdSenha (fallback: documento inteiro).
        var loginForm = loginHidden.closest('form');
        var loginScope = loginForm.length ? loginForm : $(document);
        var loginVisible = loginScope.find('input[type="password"]').not('#pwdSenha');
        if (!loginHidden.length || !loginVisible.length) return false;

        repairPwdField(loginHidden, loginVisible, {
            fontSize: '2em',
            height: 'calc(1em + .75rem)',
            borderTopLeftRadius: '0',
            borderBottomLeftRadius: '0'
        }, 'form-control masked', false);
        return true;
    }

    if (isDocumentoAssinarPage() && $('#frmAssinaturas').length) {
        var signHidden = $('#pwdSenha');
        var signVisible = $('#frmAssinaturas').find('input[type="password"]').not('#pwdSenha');
        // Em telas de assinatura com um único campo (#pwdSenha), torna o próprio
        // campo autofill-friendly (o sync vira um no-op inofensivo).
        if (!signVisible.length) signVisible = signHidden;
        if (!signHidden.length || !signVisible.length) return false;

        repairPwdField(signHidden, signVisible, {
            fontSize: '2em',
            height: 'calc(.8em + .75rem)',
            width: '25%'
        }, 'infraText masked', true);
        return true;
    }

    return false;
}

// Aguarda os campos surgirem via MutationObserver (substitui o polling de
// 20×250ms), com teto de segurança para não observar indefinidamente.
function loadRepairPwdNewSei() {
    if (!verifyConfigValue('autopreenchersenha')) return;
    if (!isLoginPageNewSei() && !isDocumentoAssinarPage()) return;

    if (applyRepairPwd()) return;
    if (typeof MutationObserver === 'undefined') return;

    var safety = null;
    var observer = new MutationObserver(function () {
        if (applyRepairPwd()) {
            observer.disconnect();
            if (safety) clearTimeout(safety);
        }
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
    safety = setTimeout(function () { observer.disconnect(); }, 10000);
}

$(function () {
    loadRepairPwdNewSei();
});
