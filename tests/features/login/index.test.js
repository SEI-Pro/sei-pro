// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { installLoginAutofill } from '@src/features/login/index.js';

// Stub do namespace SeiPro que a feature consome (config + sei.urls).
function stubSeiPro({ enabled = true, login = false, assinar = false } = {}) {
    window.SeiPro = {
        core: { config: { verifyConfigValue: (n) => (n === 'autopreenchersenha' ? enabled : false) } },
        sei: { urls: { isLoginPageNewSei: () => login, isDocumentoAssinarPage: () => assinar } }
    };
}

describe('feature login — autopreencher senha', () => {
    beforeEach(() => { document.body.innerHTML = ''; delete window.SeiPro; });

    it('não faz nada se a config estiver desligada', () => {
        stubSeiPro({ enabled: false, login: true });
        document.body.innerHTML = '<form><input id="pwdSenha" type="password"><input type="password" id="vis"></form>';
        installLoginAutofill();
        expect(document.getElementById('pwdSenha').style.display).not.toBe('none');
    });

    it('na tela de login: esconde #pwdSenha, prepara o visível e sincroniza', () => {
        stubSeiPro({ login: true });
        document.body.innerHTML = '<form><input id="pwdSenha" type="password"><input type="password" id="vis"></form>';
        installLoginAutofill();
        const hidden = document.getElementById('pwdSenha');
        const vis = document.getElementById('vis');
        expect(hidden.style.display).toBe('none');
        expect(vis.getAttribute('autocomplete')).toBe('current-password');
        expect(vis.classList.contains('form-control')).toBe(true);

        // digitar no visível propaga para o real
        vis.value = 'segredo';
        vis.dispatchEvent(new Event('input', { bubbles: true }));
        expect(hidden.value).toBe('segredo');
    });

    it('sincroniza autofill que já estava no campo visível antes do bind', () => {
        stubSeiPro({ login: true });
        document.body.innerHTML = '<form><input id="pwdSenha" type="password"><input type="password" id="vis" value="preenchido"></form>';
        installLoginAutofill();
        expect(document.getElementById('pwdSenha').value).toBe('preenchido');
    });

    it('é idempotente: não rebinda o handler em chamadas repetidas', () => {
        stubSeiPro({ login: true });
        document.body.innerHTML = '<form><input id="pwdSenha" type="password"><input type="password" id="vis"></form>';
        installLoginAutofill();
        installLoginAutofill();
        expect(document.getElementById('vis').dataset.seiProPwd).toBe('1');
    });
});
