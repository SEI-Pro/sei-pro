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

  it('cacheia a base em sessionStorage para o mundo MAIN ler', () => {
    const sandbox = loadCoreScripts();
    expect(sandbox.sessionStorage.getItem('seiProExtBaseUrl'))
      .toBe('chrome-extension://test-id/');
  });

  it('lança erro explícito quando não há base resolvível (sem chrome, sem cache, sem URL_SPRO)', () => {
    const sandbox = loadCoreScripts();
    const fn = sandbox.SeiPro.core.runtime.getUrlExtension;
    // Simula o mundo MAIN: derruba chrome/browser, base cacheada e URL_SPRO.
    sandbox.chrome = undefined;
    sandbox.browser = undefined;
    sandbox.window.__seiProExtBase = undefined;
    sandbox.sessionStorage.removeItem('seiProExtBaseUrl');
    expect(() => fn('js/x.js')).toThrow(/base da extensão indisponível/);
  });
});
