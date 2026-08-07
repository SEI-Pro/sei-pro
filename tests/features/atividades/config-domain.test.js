import { describe, expect, it } from 'vitest';
import { checkDatesBetweenArray } from '../../../src/features/atividades/config-domain.ts';

describe('atividades/config-domain', () => {
  it('detects overlapping ranges without DOM or jQuery', () => {
    const moment = (value) => {
      const date = new Date(String(value).replace(' ', 'T'));
      return {
        isBetween(start, end) { return date > start._date && date < end._date; },
        _date: date
      };
    };
    const result = checkDatesBetweenArray(
      [{ id_user: 1, id: 2, id_ref: 9, inicio: '2026-01-01 00:00:00', fim: '2026-01-10 00:00:00' }],
      '2026-01-05', 1, 3,
      { id: 'id_user', inicio: 'inicio', fim: 'fim', idreftype: 'id_ref' },
      { moment }
    );
    expect(result).toEqual([9]);
  });
});

