import { describe, expect, it, vi } from 'vitest';
import {
  getAtividadesServerUrl,
  postAtividadesServer,
  restoreAtividadesHybrid
} from '../../../src/features/atividades/io.js';

describe('atividades/io', () => {
  it('getAtividadesServerUrl reads runtime url', () => {
    expect(getAtividadesServerUrl({ urlServerAtiv: 'https://ativ.test/exec' }))
      .toBe('https://ativ.test/exec');
    expect(getAtividadesServerUrl({})).toBe(false);
  });

  it('postAtividadesServer posts via injected ajax transport', async () => {
    const ajax = vi.fn((opts) => {
      opts.success({ status: 1, demandas: [] });
    });
    const result = await postAtividadesServer('https://ativ.test/exec', { action: 'demandas' }, { ajax });
    expect(ajax).toHaveBeenCalledOnce();
    expect(ajax.mock.calls[0][0]).toMatchObject({
      type: 'POST',
      url: 'https://ativ.test/exec',
      dataType: 'json',
      data: { action: 'demandas' }
    });
    expect(result).toEqual({ status: 1, demandas: [] });
  });

  it('postAtividadesServer rejects when transport missing or url empty', async () => {
    await expect(postAtividadesServer('', {}, { ajax: vi.fn() }))
      .rejects.toThrow(/missing url/);
    await expect(postAtividadesServer('https://ativ.test', {}, { ajax: null }))
      .rejects.toThrow(/unavailable/);
  });

  it('restoreAtividadesHybrid respects panelLocalStorePro', () => {
    expect(restoreAtividadesHybrid('configDataAtividadesPro', {
      hybridStorageRestorePro: () => ({ ok: 1 }),
      getOptionsPro: () => false
    })).toEqual({ ok: 1 });

    expect(restoreAtividadesHybrid('configDataAtividadesPro', {
      hybridStorageRestorePro: () => ({ ok: 1 }),
      getOptionsPro: (k) => k === 'panelLocalStorePro'
    })).toBe(null);
  });
});
