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
