/**
 * Feature "autopreencher senha no login" (config `autopreenchersenha`).
 *
 * Torna o campo de senha do SEI autofill-friendly: o SEI usa um #pwdSenha cru
 * que os gerenciadores de senha não reconhecem; expomos um campo visível com
 * autocomplete="current-password" e mantemos o #pwdSenha real sincronizado.
 *
 * Porte isolated-first, SEM jQuery (usa src/dom). Origem: dist/js/init_pwd.js.
 */
import { getSeiPro } from '../../core/global.js';
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
        var hidden = qs('#pwdSenha');
        if (!hidden) return false;
        var scope = closest(hidden, 'form') || document;
        var visible = qsa('input[type="password"]', scope).filter(function (i) { return i.id !== 'pwdSenha'; })[0];
        if (!visible) return false;
        repairPwdField(hidden, visible, {
            fontSize: '2em', height: 'calc(1em + .75rem)',
            borderTopLeftRadius: '0', borderBottomLeftRadius: '0'
        }, 'form-control masked', false);
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
