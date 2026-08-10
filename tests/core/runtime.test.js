import { describe, expect, it } from 'vitest';
import { loadCoreScripts } from '../helpers/load-core.js';

describe('core/runtime — getUrlExtension (isolated-only)', () => {
  it('resolve uma URL absoluta da extensão (nunca relativa)', () => {
    const sandbox = loadCoreScripts();
    const url = sandbox.SeiPro.core.runtime.getUrlExtension('js/legacy-context.bundle.js');
    expect(url).toContain('://');
    expect(url.startsWith('js/')).toBe(false);
    expect(url).toBe('chrome-extension://test-id/js/legacy-context.bundle.js');
  });

  // Pós big-bang não há mundo MAIN; getUrlExtension usa chrome.runtime.getURL
  // direto e falha explicitamente se a API sumir.
  it('lança erro explícito quando chrome.runtime está indisponível', () => {
    const sandbox = loadCoreScripts();
    const fn = sandbox.SeiPro.core.runtime.getUrlExtension;
    sandbox.chrome = undefined;
    sandbox.browser = undefined;
    expect(() => fn('js/x.js')).toThrow(/chrome\.runtime indisponível/);
  });
});
