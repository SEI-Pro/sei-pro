import { describe, expect, it } from 'vitest';
import { loadCoreScripts } from '../helpers/load-core.js';

const sandbox = loadCoreScripts();
const { quickfilter } = sandbox.SeiPro.core;

describe('core/quickfilter — instalação e aliases', () => {
  it('expõe o módulo e os globais legados da página', () => {
    expect(typeof quickfilter.normalizeFilterText).toBe('function');
    expect(typeof sandbox.normalizeQuickPageFilterText).toBe('function');
    expect(typeof sandbox.getQuickPageFilterTokens).toBe('function');
    expect(typeof sandbox.getNormalizedIndexMap).toBe('function');
    expect(typeof sandbox.mergeQuickPageHighlightRanges).toBe('function');
    expect(typeof sandbox.buildQuickPageHighlightRanges).toBe('function');
  });
});

describe('normalizeFilterText', () => {
  it('minúsculas, sem acentos, espaços colapsados', () => {
    expect(quickfilter.normalizeFilterText('  Processo  AÇÃO   Útil ')).toBe('processo acao util');
  });

  it('entrada não-string → vazio', () => {
    expect(quickfilter.normalizeFilterText(undefined)).toBe('');
    expect(quickfilter.normalizeFilterText(null)).toBe('');
  });
});

describe('getFilterTokens', () => {
  it('tokeniza e remove duplicados (uniqPro ordena — ordem irrelevante p/ matching)', () => {
    expect(quickfilter.getFilterTokens('foo  bar foo')).toEqual(['bar', 'foo']);
  });

  it('termo vazio → []', () => {
    expect(quickfilter.getFilterTokens('   ')).toEqual([]);
  });
});

describe('getNormalizedIndexMap', () => {
  it('mapeia índices normalizados de volta para o texto original', () => {
    const { normalized, map } = quickfilter.getNormalizedIndexMap('Ação');
    expect(normalized).toBe('acao');
    expect(map.length).toBe(normalized.length);
    // cada índice do map aponta para um caractere válido do original
    expect(Math.max(...map)).toBeLessThan('Ação'.length);
  });
});

describe('mergeHighlightRanges', () => {
  it('funde faixas sobrepostas/adjacentes', () => {
    const r = quickfilter.mergeHighlightRanges([
      { start: 5, end: 8 },
      { start: 0, end: 3 },
      { start: 2, end: 6 }
    ]);
    expect(r).toEqual([{ start: 0, end: 8 }]);
  });

  it('lista vazia → []', () => {
    expect(quickfilter.mergeHighlightRanges([])).toEqual([]);
  });
});

describe('buildHighlightRanges', () => {
  it('localiza tokens no texto (coords do original)', () => {
    const ranges = quickfilter.buildHighlightRanges('Processo importante', ['processo']);
    expect(ranges).toEqual([{ start: 0, end: 8 }]);
  });

  it('casa ignorando acentos, devolvendo coords cruas', () => {
    const ranges = quickfilter.buildHighlightRanges('Ação rápida', ['acao']);
    expect(ranges).toEqual([{ start: 0, end: 4 }]);
    expect('Ação'.slice(0, 4)).toBe('Ação');
  });

  it('múltiplas ocorrências do mesmo token', () => {
    const ranges = quickfilter.buildHighlightRanges('ab ab', ['ab']);
    expect(ranges).toEqual([{ start: 0, end: 2 }, { start: 3, end: 5 }]);
  });

  it('sem tokens ou sem texto → []', () => {
    expect(quickfilter.buildHighlightRanges('algo', [])).toEqual([]);
    expect(quickfilter.buildHighlightRanges('', ['x'])).toEqual([]);
  });
});
