import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import { callAtiv, hasAtiv, installAtividadesDispatcher } from '../../../src/features/atividades/call.ts';

describe('atividades/call', () => {
  beforeEach(() => {
    globalThis.__SEI_PRO_ENABLE_LEGACY_ATIVIDADES__ = true;
    globalThis.SeiPro = {
      features: {
        atividades: {
          api: {
            handlers: {
              ping: (x) => `h:${x}`,
              onlyHandler: () => 'handler'
            },
            commands: { onlyCommand: () => 'command' },
            queries: { onlyQuery: () => 'query' }
          }
        }
      }
    };
    globalThis.onlyGlobal = () => 'global';
  });

  afterEach(() => {
    installAtividadesDispatcher(null);
    delete globalThis.SeiPro;
    delete globalThis.onlyGlobal;
    delete globalThis.__SEI_PRO_ENABLE_LEGACY_ATIVIDADES__;
  });

  it('resolves handlers, commands and queries through the explicit API', () => {
    expect(callAtiv('ping', 1)).toBe('h:1');
    expect(callAtiv('onlyCommand')).toBe('command');
    expect(callAtiv('onlyQuery')).toBe('query');
    expect(callAtiv('onlyGlobal')).toBe('global');
    expect(callAtiv('missing')).toBeUndefined();
  });

  it('hasAtiv detects handlers/namespace/global', () => {
    expect(hasAtiv('onlyHandler')).toBe(true);
    expect(hasAtiv('onlyCommand')).toBe(true);
    expect(hasAtiv('onlyQuery')).toBe(true);
    expect(hasAtiv('onlyGlobal')).toBe(true);
    expect(hasAtiv('missing')).toBe(false);
  });

  it('ignores a bare global unless the compatibility flag is enabled', () => {
    delete globalThis.__SEI_PRO_ENABLE_LEGACY_ATIVIDADES__;
    expect(callAtiv('onlyGlobal')).toBeUndefined();
    expect(hasAtiv('onlyGlobal')).toBe(false);
  });

  it('does not invoke an undefined-returning handler twice', () => {
    const handler = vi.fn();
    const dispatcher = {
      has: () => true,
      call: (...args) => handler(...args)
    };
    installAtividadesDispatcher(dispatcher);
    expect(callAtiv('saveAtividade', 7)).toBeUndefined();
    expect(handler).toHaveBeenCalledOnce();
  });
});
