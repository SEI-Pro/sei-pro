import { describe, expect, it } from 'vitest';
import { loadCoreScripts } from '../helpers/load-core.js';

const sandbox = loadCoreScripts();
const { texto } = sandbox.SeiPro.core;

describe('core/texto — instalação e aliases', () => {
  it('expõe o módulo em SeiPro.core.texto e nos globais legados', () => {
    expect(typeof texto.escapeRegExp).toBe('function');
    expect(typeof sandbox.escapeRegExp).toBe('function');
    expect(typeof sandbox.pad).toBe('function');
    expect(typeof sandbox.replaceTextToUrl).toBe('function');
  });
});

describe('escapeRegExp', () => {
  it('escapa metacaracteres de regex', () => {
    expect(texto.escapeRegExp('a.b*c(d)')).toBe('a\\.b\\*c\\(d\\)');
  });
});

describe('escapeComponent', () => {
  it('codifica como escape() mas preserva "+" como %2B', () => {
    expect(texto.escapeComponent('a+b c')).toBe('a%2Bb%20c');
  });
});

describe('pad', () => {
  it('preenche à esquerda com zeros', () => {
    expect(texto.pad(7, 3)).toBe('007');
    expect(texto.pad(123, 2)).toBe('123');
  });
});

describe('extractHexColor', () => {
  it('extrai cores hex de um texto', () => {
    expect(texto.extractHexColor('cor #FFF e #1a2b3c aqui'))
      .toEqual(['#FFF', '#1a2b3c']);
  });
});

describe('replaceTextToUrl', () => {
  it('transforma URL em link <a>', () => {
    const out = texto.replaceTextToUrl('veja https://sei.prf.gov.br aqui');
    expect(out).toContain("<a href='https://sei.prf.gov.br'");
    expect(out).toContain("target='_blank'");
  });
});

describe('normalizeMojibakeUtf8', () => {
  it('corrige UTF-8 lido como Latin-1', () => {
    // "ção" mal-decodificado vira "Ã§Ã£o"; deve voltar a "ção".
    const mojibake = 'Ã§Ã£o';
    expect(texto.normalizeMojibakeUtf8(mojibake)).toBe('ção');
  });

  it('devolve texto limpo intacto', () => {
    expect(texto.normalizeMojibakeUtf8('processo normal')).toBe('processo normal');
    expect(texto.normalizeMojibakeUtf8('')).toBe('');
  });
});
