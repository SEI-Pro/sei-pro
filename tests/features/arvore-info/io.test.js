import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createIo, PAGE_CACHE_TTL_MS } from '@src/features/arvore-info/io.js';

// io.js usa globais de browser. Stubamos fetch/DOMParser/TextDecoder no escopo
// global para exercitar a lógica de cache/retry sem DOM real.
const origFetch = globalThis.fetch;
const origDOMParser = globalThis.DOMParser;

function okResponse() {
  return { ok: true, arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)) };
}

beforeEach(() => {
  // DOMParser passthrough: devolve um sentinel para identificar o "doc".
  globalThis.DOMParser = class { parseFromString() { return { __doc: true }; } };
});
afterEach(() => {
  globalThis.fetch = origFetch;
  globalThis.DOMParser = origDOMParser;
  vi.restoreAllMocks();
});

describe('io.fetchPage — cache', () => {
  it('faz UMA requisição e compartilha a promise entre chamadas concorrentes', async () => {
    const fetchMock = vi.fn().mockResolvedValue(okResponse());
    globalThis.fetch = fetchMock;
    const io = createIo({ win: { location: { href: 'https://x/' } } });

    const p1 = io.fetchPage('https://sei/x?a=1');
    const p2 = io.fetchPage('https://sei/x?a=1');
    expect(p1).toBe(p2); // mesma promise cacheada
    await Promise.all([p1, p2]);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('invalidatePage força nova requisição', async () => {
    const fetchMock = vi.fn().mockResolvedValue(okResponse());
    globalThis.fetch = fetchMock;
    const io = createIo({ win: {} });
    await io.fetchPage('u');
    io.invalidatePage('u');
    await io.fetchPage('u');
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('repete UMA vez em erro transiente "Failed to fetch"', async () => {
    const fetchMock = vi.fn()
      .mockRejectedValueOnce(new Error('Failed to fetch'))
      .mockResolvedValueOnce(okResponse());
    globalThis.fetch = fetchMock;
    vi.spyOn(globalThis, 'setTimeout').mockImplementation((fn) => { fn(); return 0; });
    const io = createIo({ win: {} });
    const doc = await io.fetchPage('u');
    expect(doc).toEqual({ __doc: true });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('não repete (e remove do cache) em erro não-transiente', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: false, status: 500, arrayBuffer: () => Promise.resolve() });
    globalThis.fetch = fetchMock;
    const io = createIo({ win: {} });
    await expect(io.fetchPage('u')).rejects.toThrow('HTTP 500');
    // cache foi limpo no erro → nova chamada tenta de novo
    await expect(io.fetchPage('u')).rejects.toThrow('HTTP 500');
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('expõe a constante de TTL', () => {
    expect(PAGE_CACHE_TTL_MS).toBe(60 * 1000);
  });
});

describe('io.submitForm — encoding ISO-8859-1', () => {
  function fakeDoc(fields, action) {
    var els = fields.map(function (f) {
      return {
        tagName: f.tagName || 'INPUT',
        value: f.value,
        checked: !!f.checked,
        getAttribute: function (a) {
          if (a === 'name') return f.name;
          if (a === 'type') return f.type || 'text';
          if (a === 'checked') return f.checked ? '' : null;
          return null;
        }
      };
    });
    var form = {
      getAttribute: function (a) { return a === 'action' ? (action || 'controlador.php') : null; },
      querySelectorAll: function () { return { forEach: function (cb) { els.forEach(cb); } }; }
    };
    return {
      baseURI: 'https://sei/base',
      querySelector: function (sel) { return sel === 'form' ? form : null; }
    };
  }

  it('envia x-www-form-urlencoded; charset=ISO-8859-1 (nunca FormData/multipart)', async () => {
    let captured = null;
    globalThis.fetch = vi.fn().mockImplementation((url, opts) => { captured = opts; return Promise.resolve(okResponse()); });
    const io = createIo({ win: { location: { href: 'https://sei/' } } });
    const doc = fakeDoc([{ name: 'btnSalvar', type: 'submit', value: 'Salvar' }]);

    await io.submitForm(doc, { txaDescricao: 'OPERAÇÃO', chkSinPrioridade: 'on' });

    expect(captured.method).toBe('POST');
    expect(captured.headers['Content-Type']).toBe('application/x-www-form-urlencoded; charset=ISO-8859-1');
    expect(typeof captured.body).toBe('string');
    expect(captured.body instanceof FormData).toBe(false);
  });

  it('codifica Ç/Ê maiúsculos como %XX Latin-1 (regressão OPERAÇÃO→OPERAÃÃO)', async () => {
    let captured = null;
    globalThis.fetch = vi.fn().mockImplementation((url, opts) => { captured = opts; return Promise.resolve(okResponse()); });
    const io = createIo({ win: { location: { href: 'https://sei/' } } });

    await io.submitForm(fakeDoc([]), { txaDescricao: 'OPERAÇÃO CIÊNCIA' });

    // Ç=U+00C7→%C7, Ã=U+00C3→%C3, Ê=U+00CA→%CA (Latin-1), espaço→%20
    expect(captured.body).toContain('txaDescricao=OPERA%C7%C3O%20CI%CANCIA');
  });
});
