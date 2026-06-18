import { describe, expect, it, beforeAll } from 'vitest';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '../..');

// feriados.js depende de `moment` (real) e, em getHolidayBetweenDates, de
// `$.merge`/`$.map`. jQuery completo exige DOM; como só usamos dois utilitários
// estáticos, injetamos um `$` mínimo com a MESMA semântica ($.map descarta
// retornos null/undefined — é disso que getHolidayBetweenDates depende).
const jqStub = {
  merge(first, second) { Array.prototype.push.apply(first, second || []); return first; },
  map(arr, cb) {
    const out = [];
    (arr || []).forEach((v, i) => { const r = cb(v, i); if (r !== null && r !== undefined) out.push(r); });
    return out;
  }
};

function loadWithMoment() {
  const SeiPro = { core: {}, sei: {}, features: {}, state: {} };
  const sandbox = {
    window: {}, SeiPro,
    chrome: { runtime: { getURL: (u) => `chrome-extension://test-id/${u}`, getManifest: () => ({ version: '1.0', short_name: 'x', icons: {} }) } },
    browser: undefined,
    sessionStorage: { _d:{}, getItem(k){return this._d[k]??null;}, setItem(k,v){this._d[k]=String(v);}, removeItem(k){delete this._d[k];} },
    localStorage: { _d:{}, getItem(k){return this._d[k]??null;}, setItem(k,v){this._d[k]=String(v);}, removeItem(k){delete this._d[k];} },
    console, URL, $: jqStub, jQuery: undefined
  };
  sandbox.window = sandbox;
  const ctx = vm.createContext(sandbox);
  vm.runInContext(readFileSync(join(rootDir, 'dist/js/lib/moment.min.js'), 'utf8'), ctx, { filename: 'moment.min.js' });
  vm.runInContext(readFileSync(join(rootDir, 'dist/js/core-stack.bundle.js'), 'utf8'), ctx, { filename: 'bundle' });
  return sandbox;
}

let sandbox, feriados;
beforeAll(() => { sandbox = loadWithMoment(); feriados = sandbox.SeiPro.core.feriados; });

describe('core/feriados — instalação', () => {
  it('expõe SeiPro.core.feriados e globais legados', () => {
    expect(typeof feriados.easterDay).toBe('function');
    expect(typeof sandbox.getHolidaysBr).toBe('function');
    expect(typeof sandbox.getHolidayBetweenDates).toBe('function');
  });
});

describe('easterDay', () => {
  it('calcula a Páscoa (2024 = 31/03)', () => {
    expect(feriados.easterDay(2024).format('YYYY-MM-DD')).toBe('2024-03-31');
  });
  it('calcula a Páscoa (2025 = 20/04)', () => {
    expect(feriados.easterDay(2025).format('YYYY-MM-DD')).toBe('2025-04-20');
  });
});

describe('getHolidaysBr', () => {
  it('retorna os 14 feriados nacionais do ano', () => {
    const fer = feriados.getHolidaysBr(2024);
    expect(fer).toHaveLength(14);
    const nomes = fer.map(f => f.dia);
    expect(nomes).toContain('Ano Novo');
    expect(nomes).toContain('Natal');
    expect(fer.find(f => f.dia === 'Natal').d).toBe('25/12/2024');
    expect(fer.find(f => f.dia === 'Páscoa').d_).toBe('2024-03-31');
  });
});

describe('getHolidayBetweenDates', () => {
  it('cobre um ano → 14 feriados', () => {
    expect(feriados.getHolidayBetweenDates('2024-01-01', '2024-12-31')).toHaveLength(14);
  });
  it('inclui feriado customizado recorrente via addHolidays', () => {
    const custom = [{ recorrente: true, feriado_data: '10/06', nome_feriado: 'Aniversário Órgão', meio_periodo: false }];
    const out = feriados.getHolidayBetweenDates('2024-01-01', '2024-12-31', custom);
    expect(out).toHaveLength(15);
    const c = out.find(f => f.dia === 'Aniversário Órgão');
    expect(c.d_).toBe('2024-06-10');
  });
});
