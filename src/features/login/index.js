/**
 * Feature "autopreencher senha no login" (config `autopreenchersenha`).
 * Tier S — contrato { id, api, install }. Porte isolated-first, SEM jQuery.
 */
import { getSeiPro } from '../../core/global.js';
import { publishFeature } from '../../app/publish-feature.js';
import { qs, qsa, closest, show, hide } from '../../dom/index.js';

function sei() { return getSeiPro(); }
function verifyConfigValue(name) { return sei().core.config.verifyConfigValue(name); }
function isLoginPageNewSei() { return sei().sei.urls.isLoginPageNewSei(); }
function isDocumentoAssinarPage() { return sei().sei.urls.isDocumentoAssinarPage(); }

// Sincroniza o campo real a partir do visível e dispara 'change' (bubbling),
// para que o submit por Enter após autofill não envie o #pwdSenha vazio.
function syncHidden(hidden, visible) {
    hidden.value = visible.value;
    hidden.dispatchEvent(new Event('change', { bubbles: true }));
}

function repairPwdField(hidden, visible, css, extraClasses, doFocus) {
    hide(hidden);
    show(visible);
    visible.setAttribute('autocomplete', 'current-password');
    Object.assign(visible.style, css);
    extraClasses.split(/\s+/).filter(Boolean).forEach(function (c) { visible.classList.add(c); });

    // Idempotência: rebind só uma vez por campo (substitui o .off('.seiProPwd')).
    if (!visible.dataset.seiProPwd) {
        visible.dataset.seiProPwd = '1';
        var handler = function () { syncHidden(hidden, visible); };
        visible.addEventListener('input', handler);
        visible.addEventListener('change', handler);
    }

    // Sync inicial: cobre autofill ocorrido ANTES do bind.
    if (visible.value) syncHidden(hidden, visible);
    if (doFocus) visible.focus();
}

// Retorna true se os campos existiam e o reparo foi aplicado.
function applyRepairPwd() {
    if (!verifyConfigValue('autopreenchersenha')) return false;

    if (isLoginPageNewSei()) {
        // DOM real do login SEI (classe MaskedPassword): o SEI converte o campo de
        // senha original num DECOY visível type=text (#pwdSenha) que mascara a
        // digitação em ● e, a cada evento `input`, reescreve a senha em TEXTO PURO
        // no campo type=password escondido (name=pwdSenha, sem id) — que é o que o
        // form submete. Esse pipeline foi feito p/ digitação tecla-a-tecla e
        // CORROMPE o valor quando um gerenciador faz autofill em bloco no decoy.
        //
        // Correção: expor o próprio campo real como um password normal e NEUTRALIZAR
        // o decoy. O gerenciador preenche o campo real diretamente; texto puro em
        // name=pwdSenha é exatamente o que o servidor espera (verificado no DOM real:
        // valor setado direto sobrevive ao submit, sem clobber da máscara).
        var real = qsa('input[type="password"]').filter(function (i) { return i.name === 'pwdSenha'; })[0];
        if (!real) return false;
        var decoy = qs('#pwdSenha'); // o decoy type=text carrega o id

        // Neutraliza o decoy: remove p/ matar os listeners de máscara do SEI e liberar o id.
        if (decoy && decoy !== real) { decoy.removeAttribute('id'); decoy.remove(); }

        // Expõe o campo real como password normal e autofill-friendly.
        show(real);
        real.id = 'pwdSenha';
        real.setAttribute('autocomplete', 'current-password');
        real.className = (decoy && decoy.className ? decoy.className : 'form-control').replace(/\bmasked\b/g, '').trim() || 'form-control';
        Object.assign(real.style, { fontSize: '2em', height: 'calc(1em + .75rem)' });
        real.dataset.seiProPwd = '1';

        // Pareamento usuário+senha: o gerenciador só oferece autofill de forma
        // confiável quando o campo de usuário também está marcado.
        var user = qs('#txtUsuario');
        if (user) user.setAttribute('autocomplete', 'username');
        return true;
    }

    if (isDocumentoAssinarPage() && qs('#frmAssinaturas')) {
        var signHidden = qs('#pwdSenha');
        if (!signHidden) return false;
        var signVisible = qsa('#frmAssinaturas input[type="password"]').filter(function (i) { return i.id !== 'pwdSenha'; })[0]
            || signHidden; // tela com campo único: o próprio #pwdSenha (sync vira no-op)
        repairPwdField(signHidden, signVisible, {
            fontSize: '2em', height: 'calc(.8em + .75rem)', width: '25%'
        }, 'infraText masked', true);
        return true;
    }

    return false;
}

export function installLoginAutofill() {
    if (!verifyConfigValue('autopreenchersenha')) return;
    if (!isLoginPageNewSei() && !isDocumentoAssinarPage()) return;
    if (applyRepairPwd()) return;
    if (typeof MutationObserver === 'undefined') return;

    // Aguarda os campos surgirem (substitui o polling 20×250ms), com teto.
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

publishFeature({
    id: 'login',
    api: Object.freeze({ repair: applyRepairPwd }),
    install: installLoginAutofill
});
