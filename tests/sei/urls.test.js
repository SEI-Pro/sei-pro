import { describe, expect, it } from 'vitest';
import { loadSeiUrls } from '../helpers/load-seipro.js';

describe('SEI URL helpers', () => {
    it('builds query strings', () => {
        const SeiPro = loadSeiUrls();
        expect(SeiPro.sei.urls.buildQuery({ acao: 'procedimento_controlar', id: 10 })).toBe(
            'acao=procedimento_controlar&id=10'
        );
    });

    it('appends query parameters to base URLs', () => {
        const SeiPro = loadSeiUrls();
        const url = SeiPro.sei.urls.appendQuery('https://sei/controlador.php', { acao: 'arvore_visualizar' });
        expect(url).toBe('https://sei/controlador.php?acao=arvore_visualizar');
    });
});

describe('isAjaxRedirectAction', () => {
    const make = (responseURL) => ({ responseURL });

    it('xhr ausente ou sem responseURL → false', () => {
        const SeiPro = loadSeiUrls();
        const fn = SeiPro.sei.urls.isAjaxRedirectAction;
        expect(fn(null, 'arvore_visualizar')).toBe(false);
        expect(fn(make(''), 'arvore_visualizar')).toBe(false);
        expect(fn({}, 'arvore_visualizar')).toBe(false);
    });

    it('redirect para a ação esperada → true (sem origin)', () => {
        const SeiPro = loadSeiUrls();
        const fn = SeiPro.sei.urls.isAjaxRedirectAction;
        expect(fn(make('https://sei/controlador.php?acao=arvore_visualizar&id=1'), 'arvore_visualizar')).toBe(true);
    });

    it('ação diferente → false', () => {
        const SeiPro = loadSeiUrls();
        const fn = SeiPro.sei.urls.isAjaxRedirectAction;
        expect(fn(make('https://sei/controlador.php?acao=procedimento_trabalhar&id=1'), 'arvore_visualizar')).toBe(false);
    });

    it('com origin: confere acao_origem', () => {
        const SeiPro = loadSeiUrls();
        const fn = SeiPro.sei.urls.isAjaxRedirectAction;
        const url = 'https://sei/controlador.php?acao=arvore_visualizar&acao_origem=procedimento_enviar';
        expect(fn(make(url), 'arvore_visualizar', 'procedimento_enviar')).toBe(true);
        expect(fn(make(url), 'arvore_visualizar', 'outra_origem')).toBe(false);
    });

    it('com origin esperado mas acao_origem ausente → true (verbatim)', () => {
        const SeiPro = loadSeiUrls();
        const fn = SeiPro.sei.urls.isAjaxRedirectAction;
        // URL realista do SEI: sempre tem múltiplos params (getParamsUrlPro exige '&').
        const url = 'https://sei/controlador.php?acao=arvore_visualizar&id=1';
        expect(fn(make(url), 'arvore_visualizar', 'procedimento_enviar')).toBe(true);
    });
});

describe('predicados de página (autopreenchersenha)', () => {
    it('isLoginPageNewSei: detecta sip/login.php', () => {
        const SeiPro = loadSeiUrls();
        const fn = SeiPro.sei.urls.isLoginPageNewSei;
        expect(fn('https://sei.gov.br/sip/login.php?x=1')).toBe(true);
        expect(fn('https://sei.gov.br/controlador.php?acao=procedimento_controlar')).toBe(false);
    });

    it('isDocumentoAssinarPage: detecta acao=documento_assinar', () => {
        const SeiPro = loadSeiUrls();
        const fn = SeiPro.sei.urls.isDocumentoAssinarPage;
        expect(fn('https://sei.gov.br/controlador.php?acao=documento_assinar&id=9')).toBe(true);
        expect(fn('https://sei.gov.br/sip/login.php')).toBe(false);
    });
});

describe('sei/urls — getUrlHipoteseLegal (parse puro)', () => {
  it('retorna false sem o marcador', () => {
    const u = loadSeiUrls().sei.urls;
    expect(u.getUrlHipoteseLegal('nada aqui')).toBe(false);
  });
});
