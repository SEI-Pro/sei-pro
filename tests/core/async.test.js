import { beforeEach, describe, expect, it, vi } from 'vitest';
import { loadCoreScripts } from '../helpers/load-core.js';

// O bundle roda dentro de um contexto vm sem timers/Date reais; injetamos
// implementações controláveis no sandbox para exercitar o agendamento.
function setupSandbox() {
  const sandbox = loadCoreScripts();
  let now = 10000;
  let seq = 0;
  let timers = [];
  sandbox.Date = { now: () => now };
  sandbox.setTimeout = (fn, ms) => { const id = ++seq; timers.push({ id, fn, ms }); return id; };
  sandbox.clearTimeout = (id) => { timers = timers.filter((t) => t.id !== id); };
  return {
    sandbox,
    api: sandbox.SeiPro.core.async,
    timers: () => timers,
    advance: (ms) => { now += ms; },
    setNow: (v) => { now = v; }
  };
}

describe('core/async — instalação e aliases', () => {
  const { sandbox, api } = setupSandbox();
  it('expõe SeiPro.core.async e globais legados', () => {
    expect(typeof api.retryWithProgress).toBe('function');
    expect(typeof api.clearRetry).toBe('function');
    expect(typeof api.nudgeOnce).toBe('function');
    expect(typeof sandbox.retryWithProgress).toBe('function');
    expect(typeof sandbox.clearRetry).toBe('function');
    expect(typeof sandbox.nudgeOnce).toBe('function');
  });
});

describe('retryWithProgress — backoff exponencial', () => {
  it('agenda com backoff 300→600→1200→2000 (teto) sem progresso', () => {
    const { api, timers } = setupSandbox();
    const bag = {};
    const opts = { bag, key: 'k', progress: 0, run: () => {} };
    const delays = [];
    for (let i = 0; i < 5; i++) {
      expect(api.retryWithProgress(opts)).toBe(true);
      delays.push(timers()[timers().length - 1].ms);
    }
    expect(delays).toEqual([300, 600, 1200, 2000, 2000]);
  });

  it('cada chamada cancela o timer anterior (mantém 1 pendente)', () => {
    const { api, timers } = setupSandbox();
    const bag = {};
    api.retryWithProgress({ bag, key: 'k', progress: 0, run: () => {} });
    api.retryWithProgress({ bag, key: 'k', progress: 0, run: () => {} });
    expect(timers().length).toBe(1);
  });
});

describe('retryWithProgress — reset por progresso', () => {
  it('progresso maior zera o contador e volta o backoff a 300', () => {
    const { api, timers } = setupSandbox();
    const bag = {};
    api.retryWithProgress({ bag, key: 'k', progress: 0, run: () => {} }); // 300, count→1
    api.retryWithProgress({ bag, key: 'k', progress: 0, run: () => {} }); // 600, count→2
    expect(timers()[timers().length - 1].ms).toBe(600);
    // avanço de progresso: reset
    api.retryWithProgress({ bag, key: 'k', progress: 1, run: () => {} });
    expect(timers()[timers().length - 1].ms).toBe(300);
  });
});

describe('retryWithProgress — desistência', () => {
  it('desiste após noProgressLimit e chama onGiveUp uma única vez', () => {
    const { api } = setupSandbox();
    const bag = {};
    const onGiveUp = vi.fn();
    const opts = { bag, key: 'k', progress: 0, noProgressLimit: 3, run: () => {}, reason: 'x', onGiveUp };
    expect(api.retryWithProgress(opts)).toBe(true);  // count 0→1
    expect(api.retryWithProgress(opts)).toBe(true);  // count 1→2
    expect(api.retryWithProgress(opts)).toBe(true);  // count 2→3
    expect(api.retryWithProgress(opts)).toBe(false); // count>=3 → desiste
    expect(api.retryWithProgress(opts)).toBe(false); // continua desistido
    expect(onGiveUp).toHaveBeenCalledTimes(1);
    expect(onGiveUp.mock.calls[0][0]).toMatchObject({ key: 'k', reason: 'x' });
  });

  it('desiste ao estourar o teto wall-clock', () => {
    const { api, advance } = setupSandbox();
    const bag = {};
    const onGiveUp = vi.fn();
    const opts = { bag, key: 'k', progress: 0, wallClockMs: 5000, run: () => {}, onGiveUp };
    expect(api.retryWithProgress(opts)).toBe(true);
    advance(6000);
    expect(api.retryWithProgress(opts)).toBe(false);
    expect(onGiveUp).toHaveBeenCalledTimes(1);
  });

  it('progresso após desistir retoma o agendamento', () => {
    const { api } = setupSandbox();
    const bag = {};
    const opts = { bag, key: 'k', progress: 0, noProgressLimit: 2, run: () => {}, onGiveUp: () => {} };
    api.retryWithProgress(opts);
    api.retryWithProgress(opts);
    expect(api.retryWithProgress(opts)).toBe(false); // desistiu
    // novo progresso reabre
    expect(api.retryWithProgress({ ...opts, progress: 1 })).toBe(true);
  });
});

describe('clearRetry', () => {
  it('remove o estado e cancela o timer pendente', () => {
    const { api, timers } = setupSandbox();
    const bag = {};
    api.retryWithProgress({ bag, key: 'k', progress: 0, run: () => {} });
    expect(timers().length).toBe(1);
    api.clearRetry('k', bag);
    expect(timers().length).toBe(0);
    expect(bag.k).toBeUndefined();
  });
});

describe('nudgeOnce', () => {
  it('registra listeners uma única vez por flag', () => {
    const { sandbox, api } = setupSandbox();
    const added = [];
    sandbox.addEventListener = (name) => added.push(name);
    const handler = () => {};
    api.nudgeOnce('__flag_test__', ['evt-a', 'evt-b'], handler);
    api.nudgeOnce('__flag_test__', ['evt-a', 'evt-b'], handler); // ignorado
    expect(added).toEqual(['evt-a', 'evt-b']);
    expect(sandbox.__flag_test__).toBe(true);
  });

  it('é seguro quando não há addEventListener disponível', () => {
    const { api } = setupSandbox();
    expect(() => api.nudgeOnce('__flag_none__', ['x'], () => {})).not.toThrow();
  });
});
