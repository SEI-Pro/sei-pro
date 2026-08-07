import { describe, expect, it } from 'vitest';
import { createAtividadesContext, resetAtividadesContext } from '../../../src/features/atividades/context.js';
import { createAtividadesStore } from '../../../src/features/atividades/store.js';
import { createAtividadesApplication } from '../../../src/features/atividades/application.js';
import { createAtividadesTransport } from '../../../src/features/atividades/io.js';
import { installAtividadesState } from '../../../src/features/atividades/state.js';

describe('atividades/context and application', () => {
  it('keeps canonical state in the store and projects assignments through the adapter', () => {
    const page = { setTimeout, clearTimeout };
    const store = createAtividadesStore({ urlServerAtiv: 'url' });
    const context = createAtividadesContext({ globalRef: page, store });
    expect(context.store.get().urlServerAtiv).toBe('url');
    store.patch({ delayServerAtiv: 1 });
    expect(store.get().delayServerAtiv).toBe(1);
    resetAtividadesContext(page);
  });

  it('turns the old state names into accessors over the canonical store', () => {
    const page = {};
    installAtividadesState(page);
    page.urlServerAtiv = 'https://new.test';
    expect(page.__SEI_PRO_ATIVIDADES_CONTEXT__.store.get().urlServerAtiv).toBe('https://new.test');
    page.__SEI_PRO_ATIVIDADES_CONTEXT__.store.patch({ userHashAtiv: 'hash' });
    expect(page.userHashAtiv).toBe('hash');
  });

  it('prepares and transports requests through injected ports', async () => {
    const calls = [];
    const page = { setTimeout, clearTimeout };
    const store = createAtividadesStore({ urlServerAtiv: 'url', userHashAtiv: 'hash' });
    const context = createAtividadesContext({
      globalRef: page,
      store,
      checkCapability: () => true,
      getOption: () => ''
    });
    const application = createAtividadesApplication({
      context,
      handlers: { checkCapacidade: () => true },
      transport: createAtividadesTransport({
        ajax: (options) => {
          calls.push(options.data);
          options.success({ status: 1, demandas: [] });
        }
      })
    });
    await application.request({ action: 'save_atividade' }, 'save_atividade');
    expect(calls[0]).toMatchObject({ action: 'save_atividade', hash: 'hash' });
  });

  it('does not authorize a request before the server hash exists', async () => {
    const calls = [];
    const page = { setTimeout, clearTimeout };
    const context = createAtividadesContext({
      globalRef: page,
      store: createAtividadesStore({ urlServerAtiv: 'url', userHashAtiv: false }),
      checkCapability: () => true
    });
    const application = createAtividadesApplication({
      context,
      handlers: { checkCapacidade: () => true },
      transport: { request: async () => { calls.push(true); } }
    });
    await application.request({ action: 'save_atividade' }, 'save_atividade');
    expect(calls).toHaveLength(0);
  });

  it('emits one normalized response event before routing', async () => {
    const events = [];
    const page = { setTimeout, clearTimeout };
    const context = createAtividadesContext({
      globalRef: page,
      store: createAtividadesStore({ urlServerAtiv: 'url', userHashAtiv: 'hash' }),
      checkCapability: () => true,
      emit: (name, detail) => events.push({ name, detail })
    });
    const application = createAtividadesApplication({
      context,
      handlers: { checkCapacidade: () => true },
      transport: { request: async () => ({ status: 1, demandas: [] }) }
    });
    await application.request({ action: 'panel' }, 'panel');
    expect(events).toHaveLength(1);
    expect(events[0].name).toBe('seipro:atividades-response');
    expect(events[0].detail.type).toBe('panel');
  });
});
