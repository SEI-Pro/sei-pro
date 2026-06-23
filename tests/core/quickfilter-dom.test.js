import { describe, expect, it } from 'vitest';
import { loadCoreScripts } from '../helpers/load-core.js';

const sandbox = loadCoreScripts();
const { quickfilterDom } = sandbox.SeiPro.core;

// O ambiente de teste é 'node' (sem DOM). Aqui cobrimos a instalação do módulo
// e os caminhos de guarda (no-op seguro sem document/elemento). O comportamento
// com DOM real (TreeWalker + spans) é validado ao vivo no navegador.
describe('core/quickfilter-dom — instalação', () => {
  it('expõe o motor de highlight em SeiPro.core.quickfilterDom', () => {
    expect(typeof quickfilterDom).toBe('object');
    expect(typeof quickfilterDom.clearHighlights).toBe('function');
    expect(typeof quickfilterDom.highlightTextNode).toBe('function');
    expect(typeof quickfilterDom.applyHighlight).toBe('function');
    expect(quickfilterDom.HIGHLIGHT_CLASS).toBe('seiProQuickPageHighlight');
  });
});

describe('quickfilterDom — guardas sem DOM', () => {
  it('clearHighlights não lança com escopo inválido', () => {
    expect(() => quickfilterDom.clearHighlights(null)).not.toThrow();
    expect(() => quickfilterDom.clearHighlights(undefined)).not.toThrow();
  });

  it('applyHighlight não lança sem container ou sem tokens', () => {
    expect(() => quickfilterDom.applyHighlight(null, ['x'])).not.toThrow();
    expect(() => quickfilterDom.applyHighlight(undefined, [])).not.toThrow();
  });
});
