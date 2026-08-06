import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import { callAtiv, hasAtiv } from '../../../src/features/atividades/call.js';

describe('atividades/call', () => {
  beforeEach(() => {
    globalThis.SeiPro = {
      features: {
        atividades: {
          handlers: {
            ping: (x) => `h:${x}`,
            onlyHandler: () => 'handler'
          },
          ping: (x) => `ns:${x}`,
          onlyNs: () => 'ns'
        }
      }
    };
    globalThis.onlyGlobal = () => 'global';
  });

  afterEach(() => {
    delete globalThis.SeiPro;
    delete globalThis.onlyGlobal;
  });

  it('prefers handlers over namespace over global', () => {
    expect(callAtiv('ping', 1)).toBe('h:1');
    expect(callAtiv('onlyNs')).toBe('ns');
    expect(callAtiv('onlyGlobal')).toBe('global');
    expect(callAtiv('missing')).toBeUndefined();
  });

  it('hasAtiv detects handlers/namespace/global', () => {
    expect(hasAtiv('onlyHandler')).toBe(true);
    expect(hasAtiv('onlyNs')).toBe(true);
    expect(hasAtiv('onlyGlobal')).toBe(true);
    expect(hasAtiv('missing')).toBe(false);
  });
});
