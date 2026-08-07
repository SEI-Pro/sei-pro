import { describe, expect, it } from 'vitest';
import {
  normalizeHomeFilterText,
  normalizeHomeFilterKey,
  rewriteHomeFilterCaption,
  quoteInlineJsText,
  rowMatchesHomeFilterFacts
} from '../../../src/features/lista-processos/domain.ts';

describe('lista-processos domain', () => {
  it('normalizes filter text and keys', () => {
    expect(normalizeHomeFilterText('  Café  ')).toBe('cafe');
    expect(normalizeHomeFilterKey('Marcador-Á')).toBe('marcadora');
  });

  it('rewrites caption row counts', () => {
    expect(rewriteHomeFilterCaption('(10 registros)', 1)).toBe('(1 registro)');
    expect(rewriteHomeFilterCaption('(1 registro)', 3)).toBe('(3 registros)');
  });

  it('quotes inline JS text safely', () => {
    expect(quoteInlineJsText("a'b")).toBe("'a\\'b'");
  });

  it('matches home filter facts by type', () => {
    expect(rowMatchesHomeFilterFacts({ assignmentText: 'Ana' }, 'Ana', 'user')).toBe(true);
    expect(rowMatchesHomeFilterFacts({ tagName: 'SemGrupo' }, 'null', 'tag')).toBe(true);
    expect(rowMatchesHomeFilterFacts({ hasUnread: true }, 'nao visualizado', 'proc')).toBe(true);
    expect(rowMatchesHomeFilterFacts({ processText: 'Licença' }, 'licenca', 'proc')).toBe(true);
  });
});
