import { describe, expect, it } from 'vitest';
import { loadCoreScripts } from '../helpers/load-core.js';

describe('core/runtime — getUrlExtension', () => {
  it('resolve uma URL absoluta da extensão (nunca relativa)', () => {
    const sandbox = loadCoreScripts();
    const url = sandbox.SeiPro.core.runtime.getUrlExtension('js/sei-functions-pro.js');
    expect(url).toContain('://');
    expect(url.startsWith('js/')).toBe(false);
    expect(url).toBe('chrome-extension://test-id/js/sei-functions-pro.js');
  });

  // Durante a transição o bundle roda também no mundo MAIN (sem chrome.*); o
  // mundo isolado publica a base em sessionStorage para o MAIN ler.
  it('cacheia a base em sessionStorage (ponte p/ o mundo MAIN)', () => {
    const sandbox = loadCoreScripts();
    expect(sandbox.sessionStorage.getItem('seiProExtBaseUrl')).toBe('chrome-extension://test-id/');
  });

  it('lança erro explícito quando não há base resolvível (sem chrome, sem cache, sem URL_SPRO)', () => {
    const sandbox = loadCoreScripts();
    const fn = sandbox.SeiPro.core.runtime.getUrlExtension;
    sandbox.chrome = undefined;
    sandbox.browser = undefined;
    sandbox.window.__seiProExtBase = undefined;
    sandbox.sessionStorage.removeItem('seiProExtBaseUrl');
    expect(() => fn('js/x.js')).toThrow(/base da extensão indisponível/);
  });
});
