// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { installLoginAutofill } from '@src/features/login/index.ts';

// Stub do namespace SeiPro que a feature consome (config + sei.urls).
function stubSeiPro({ enabled = true, login = false, assinar = false } = {}) {
    window.SeiPro = {
        core: { config: { verifyConfigValue: (n) => (n === 'autopreenchersenha' ? enabled : false) } },
        sei: { urls: { isLoginPageNewSei: () => login, isDocumentoAssinarPage: () => assinar } }
    };
}

// DOM real do login SEI (classe MaskedPassword): um DECOY visível type=text com
// id=pwdSenha (onde o usuário digita, mascarado em ●) + o campo real type=password
// com name=pwdSenha, escondido, SEM id (é o que o form submete em texto puro).
function seiLoginDom() {
    return ''
        + '<form>'
        + '  <input id="txtUsuario" type="text">'
        + '  <input type="password" name="pwdSenha" style="display:none">'
        + '  <input id="pwdSenha" type="text" class="form-control masked" autocomplete="off">'
        + '</form>';
}

describe('feature login — autopreencher senha', () => {
    beforeEach(() => { document.body.innerHTML = ''; delete window.SeiPro; });

    it('não faz nada se a config estiver desligada', () => {
        stubSeiPro({ enabled: false, login: true });
        document.body.innerHTML = seiLoginDom();
        installLoginAutofill();
        const real = document.querySelector('input[name="pwdSenha"]');
        expect(real.dataset.seiProPwd).toBeUndefined();
        // decoy intacto
        expect(document.querySelectorAll('#pwdSenha').length).toBe(1);
    });

    it('expõe o campo real (name=pwdSenha) e neutraliza o decoy', () => {
        stubSeiPro({ login: true });
        document.body.innerHTML = seiLoginDom();
        installLoginAutofill();

        const real = document.querySelector('input[name="pwdSenha"]');
        // o decoy type=text foi removido; só sobra o campo real, agora com id=pwdSenha
        const byId = document.querySelectorAll('#pwdSenha');
        expect(byId.length).toBe(1);
        expect(byId[0]).toBe(real);

        expect(real.type).toBe('password');
        expect(real.style.display).not.toBe('none');
        expect(real.getAttribute('autocomplete')).toBe('current-password');
        expect(real.classList.contains('masked')).toBe(false);
        expect(real.dataset.seiProPwd).toBe('1');
    });

    it('marca o campo de usuário com autocomplete=username (pareamento)', () => {
        stubSeiPro({ login: true });
        document.body.innerHTML = seiLoginDom();
        installLoginAutofill();
        expect(document.getElementById('txtUsuario').getAttribute('autocomplete')).toBe('username');
    });

    it('valor preenchido no campo real é o que o form submete (texto puro)', () => {
        stubSeiPro({ login: true });
        document.body.innerHTML = seiLoginDom();
        installLoginAutofill();
        const real = document.querySelector('input[name="pwdSenha"]');
        real.value = 'segredo'; // simula autofill direto no campo real exposto
        expect(real.name).toBe('pwdSenha');
        expect(real.value).toBe('segredo');
    });

    it('é idempotente: rodar duas vezes não quebra (decoy já removido)', () => {
        stubSeiPro({ login: true });
        document.body.innerHTML = seiLoginDom();
        installLoginAutofill();
        installLoginAutofill();
        const real = document.querySelector('input[name="pwdSenha"]');
        expect(real.dataset.seiProPwd).toBe('1');
        expect(document.querySelectorAll('#pwdSenha').length).toBe(1);
    });
});
