import { describe, expect, it } from 'vitest';
import { buildRowHaystack, rowMatchesTokens } from '../../../src/features/quick-filter/domain.js';
import { getFilterTokens } from '../../../src/core/quickfilter.js';

describe('quick-filter/domain — buildRowHaystack', () => {
  it('normaliza, deduplica e junta os segmentos', () => {
    const hay = buildRowHaystack(['Processo AÇÃO', 'processo acao', '  Útil  ', '', null]);
    expect(hay).toBe('processo acao util');
  });

  it('troca NBSP por espaço e colapsa', () => {
    expect(buildRowHaystack(['A B'])).toBe('a b');
  });
});

describe('quick-filter/domain — rowMatchesTokens', () => {
  const hay = buildRowHaystack(['Relatorio de acao penal urgente']);

  it('sem tokens, casa tudo', () => {
    expect(rowMatchesTokens(hay, getFilterTokens(''))).toBe(true);
  });

  it('AND: todos os tokens precisam aparecer', () => {
    expect(rowMatchesTokens(hay, getFilterTokens('acao penal'))).toBe(true);
    expect(rowMatchesTokens(hay, getFilterTokens('acao inexistente'))).toBe(false);
  });

  it('ignora acentos via tokenização do core', () => {
    expect(rowMatchesTokens(hay, getFilterTokens('AÇÃO'))).toBe(true);
  });
});
