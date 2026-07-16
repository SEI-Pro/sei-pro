import { beforeEach, describe, expect, it } from 'vitest';
import { recordDataRecebimento } from '../../src/shared/legacy/datas-view.js';

const andamento = {
  id_procedimento: '42',
  processo: '123.456',
  andamento: [{ unidade: 'ABC', datahora: '2024-01-05 12:00:00', descricao: 'Processo recebido na unidade', descricao_alt: '' }]
};

describe('shared/legacy/datas-view', () => {
  let stored;
  beforeEach(() => { stored = undefined; });

  it('compõe o contexto legado e delega seleção/persistência ao core', () => {
    const calls = [];
    const previous = globalThis.SeiPro;
    globalThis.SeiPro = { core: { datas: {
      buildDataRecebimentoRecord: (list, unidade, options) => {
        calls.push(['build', list, unidade, options]);
        return { id_procedimento: list.id_procedimento, datetime: options.datetime };
      },
      persistDataRecebimentoRecord: (record, deps) => {
        stored = record;
        deps.store('configDataRecebimentoPro', [record]);
      }
    } } };

    const result = recordDataRecebimento(andamento, {
      unidadeAtual: 'ABC', datetime: '2024-01-06 00:00:00', observacoes: 'obs',
      acompanhamentoesp: 'sim', restore: () => [], store: (...args) => calls.push(['store', ...args])
    });

    expect(result).toBe(true);
    expect(calls[0]).toEqual(['build', andamento, 'ABC', {
      datetime: '2024-01-06 00:00:00', observacoes: 'obs', acompanhamentoesp: 'sim'
    }]);
    expect(stored).toEqual({ id_procedimento: '42', datetime: '2024-01-06 00:00:00' });
    expect(calls[1][0]).toBe('store');
    globalThis.SeiPro = previous;
  });

  it('não persiste quando o core não encontra recebimento', () => {
    const previous = globalThis.SeiPro;
    globalThis.SeiPro = { core: { datas: {
      buildDataRecebimentoRecord: () => null,
      persistDataRecebimentoRecord: () => { throw new Error('não deveria persistir'); }
    } } };
    expect(recordDataRecebimento(andamento, { unidadeAtual: 'ABC' })).toBe(false);
    globalThis.SeiPro = previous;
  });
});