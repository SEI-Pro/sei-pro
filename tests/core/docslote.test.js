import { describe, expect, it } from 'vitest';
import { loadCoreScripts } from '../helpers/load-core.js';

const sandbox = loadCoreScripts();
const { docslote } = sandbox.SeiPro.core;

describe('core/docslote — instalação e aliases', () => {
  it('expõe o módulo e os mapas legados globais', () => {
    expect(typeof docslote.getDocsLoteNormalChars).toBe('function');
    expect(typeof docslote.hasDocsLoteSpecialChars).toBe('function');
    expect(typeof docslote.encodeDocsLoteSpecialChars).toBe('function');
    expect(typeof docslote.parseDocsLoteDocTitle).toBe('function');
    expect(typeof sandbox.docsLote_specialChars).toBe('object');
    expect(typeof sandbox.docsLote_normalChars_utf8).toBe('object');
    expect(typeof sandbox.docsLote_normalChars_iso).toBe('object');
  });

  it('o global legado é o mesmo objeto exportado pelo core', () => {
    expect(sandbox.docsLote_specialChars).toBe(docslote.docsLoteSpecialChars);
    expect(sandbox.docsLote_normalChars_utf8).toBe(docslote.docsLoteNormalCharsUtf8);
  });
});

describe('getDocsLoteNormalChars', () => {
  it('utf-8 → mapa utf8; outro → mapa iso', () => {
    expect(docslote.getDocsLoteNormalChars('utf-8')).toBe(docslote.docsLoteNormalCharsUtf8);
    expect(docslote.getDocsLoteNormalChars('windows-1252')).toBe(docslote.docsLoteNormalCharsIso);
  });
});

describe('hasDocsLoteSpecialChars', () => {
  it('detecta acento/caractere especial', () => {
    expect(docslote.hasDocsLoteSpecialChars('Relatório', 'utf-8')).toBe(true);
    expect(docslote.hasDocsLoteSpecialChars('Inspeção', 'utf-8')).toBe(true);
  });

  it('texto ASCII puro → false', () => {
    expect(docslote.hasDocsLoteSpecialChars('Relatorio 2026', 'utf-8')).toBe(false);
  });

  it('vazio ou não-string → false', () => {
    expect(docslote.hasDocsLoteSpecialChars('', 'utf-8')).toBe(false);
    expect(docslote.hasDocsLoteSpecialChars(undefined, 'utf-8')).toBe(false);
  });
});

describe('encodeDocsLoteSpecialChars', () => {
  it('substitui acentos pelas entidades HTML', () => {
    expect(docslote.encodeDocsLoteSpecialChars('Inspeção')).toBe('Inspe&ccedil;&atilde;o');
    expect(docslote.encodeDocsLoteSpecialChars('Relatório')).toBe('Relat&oacute;rio');
  });

  it('texto sem caractere especial é preservado', () => {
    expect(docslote.encodeDocsLoteSpecialChars('Relatorio 2026')).toBe('Relatorio 2026');
  });

  it('não-string é devolvido como veio', () => {
    expect(docslote.encodeDocsLoteSpecialChars(undefined)).toBe(undefined);
  });
});

describe('parseDocsLoteDocTitle', () => {
  it('extrai nrSEI e nomeDocumento do título', () => {
    expect(docslote.parseDocsLoteDocTitle('SEI - 12345678 - Ofício Externo'))
      .toEqual({ nrSEI: '12345678', nomeDocumento: 'Ofício Externo' });
  });

  it('campos ausentes viram false', () => {
    expect(docslote.parseDocsLoteDocTitle('SemSeparador'))
      .toEqual({ nrSEI: false, nomeDocumento: false });
  });

  it('título false/não-string → ambos false', () => {
    expect(docslote.parseDocsLoteDocTitle(false))
      .toEqual({ nrSEI: false, nomeDocumento: false });
  });
});
