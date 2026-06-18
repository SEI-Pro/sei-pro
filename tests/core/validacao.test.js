import { describe, expect, it } from 'vitest';
import { loadCoreScripts } from '../helpers/load-core.js';

const sandbox = loadCoreScripts();
const { validacao } = sandbox.SeiPro.core;

describe('core/validacao — instalação e aliases', () => {
  it('expõe o módulo em SeiPro.core.validacao e nos globais legados', () => {
    expect(typeof validacao.validaCPF).toBe('function');
    expect(typeof sandbox.validaCPF).toBe('function');
    expect(typeof sandbox.maskCPF).toBe('function');
    expect(typeof sandbox.isValidHttpUrl).toBe('function');
  });
});

describe('validaCPF', () => {
  it('aceita CPF válido (com e sem máscara)', () => {
    expect(validacao.validaCPF('529.982.247-25')).toBe(true);
    expect(validacao.validaCPF('52998224725')).toBe(true);
  });

  it('rejeita dígito verificador errado e sequências repetidas', () => {
    expect(validacao.validaCPF('529.982.247-26')).toBe(false);
    expect(validacao.validaCPF('111.111.111-11')).toBe(false);
    expect(validacao.validaCPF('123')).toBe(false);
  });
});

describe('máscaras', () => {
  it('maskCPF formata 11 dígitos', () => {
    expect(validacao.maskCPF('52998224725')).toBe('529.982.247-25');
  });

  it('maskCNPJ formata 14 dígitos', () => {
    expect(validacao.maskCNPJ('11222333000181')).toBe('11.222.333/0001-81');
  });

  it('maskPEN formata número de protocolo', () => {
    expect(validacao.maskPEN('00000123456202401')).toBe('00000.123456/2024-01');
  });

  it('máscaras toleram entrada vazia', () => {
    expect(validacao.maskCPF('')).toBe('');
    expect(validacao.maskCNPJ('')).toBe('');
  });
});

describe('validateEmail', () => {
  it('aceita e-mail válido e rejeita inválido', () => {
    expect(validacao.validateEmail('user@example.com')).toBe(true);
    expect(validacao.validateEmail('user@@example')).toBe(false);
    expect(validacao.validateEmail('sem-arroba')).toBe(false);
  });
});

describe('escapeHtml', () => {
  it('escapa caracteres perigosos', () => {
    expect(validacao.escapeHtml('<a href="x">&\'`=/</a>'))
      .toBe('&lt;a href&#x3D;&quot;x&quot;&gt;&amp;&#39;&#x60;&#x3D;&#x2F;&lt;&#x2F;a&gt;');
  });
});

describe('isValidHttpUrl', () => {
  it('aceita http/https e rejeita outros esquemas', () => {
    expect(validacao.isValidHttpUrl('https://sei.prf.gov.br')).toBe(true);
    expect(validacao.isValidHttpUrl('http://x.com')).toBe(true);
    expect(validacao.isValidHttpUrl('ftp://x.com')).toBe(false);
    expect(validacao.isValidHttpUrl('não é url')).toBe(false);
  });
});

describe('extractCPFs', () => {
  it('extrai CPFs mascarados de um texto', () => {
    const cpfs = validacao.extractCPFs('Réus: 529.982.247-25 e 111.444.777-35.');
    expect(cpfs).toEqual(['529.982.247-25', '111.444.777-35']);
  });
});
