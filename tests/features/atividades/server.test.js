import { describe, expect, it, vi } from 'vitest';
import { createAtividadesContext } from '../../../src/features/atividades/context.js';
import { createAtividadesStore } from '../../../src/features/atividades/store.js';
import { getServerAtividades } from '../../../src/features/atividades/server.js';
import { createAtividadesServerPorts } from '../../../src/features/atividades/server-ports.js';

describe('atividades/server boundary', () => {
  it('exposes page effects as injectable server ports', () => {
    const effects = { loading: vi.fn(), alert: vi.fn(), confirm: vi.fn() };
    const context = createAtividadesContext({
      globalRef: { setTimeout, clearTimeout },
      store: createAtividadesStore(),
      loading: effects.loading,
      alert: effects.alert,
      confirm: effects.confirm
    });
    const ports = createAtividadesServerPorts(context);
    ports.loadingButtonConfirm(true);
    ports.alertaBoxPro('Error');
    expect(effects.loading).toHaveBeenCalledWith(true);
    expect(effects.alert).toHaveBeenCalledWith('Error');
  });

  it('accepts injected context/transport and routes the normalized response', async () => {
    const page = { setTimeout, clearTimeout };
    const context = createAtividadesContext({
      globalRef: page,
      store: createAtividadesStore({ urlServerAtiv: 'https://ativ.test', userHashAtiv: 'hash' }),
      checkCapability: () => true,
      getOption: () => false
    });
    const response = vi.fn((data, param, mode) => ({ data, param, mode }));
    const result = getServerAtividades(
      { action: 'save_atividade' },
      'save_atividade',
      {
        context,
        checkCapability: () => true,
        transport: { request: async (url, data) => ({ status: 1, url, data }) },
        onResponse: response
      }
    );
    await result;
    expect(response).toHaveBeenCalledOnce();
    expect(response.mock.calls[0][2]).toBe('save_atividade');
  });
});
