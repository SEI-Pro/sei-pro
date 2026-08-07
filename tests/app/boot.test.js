/** @vitest-environment jsdom */
import { describe, expect, it, beforeEach } from 'vitest';
import { resetFeatureRegistry, registerFeature, featuresForContext } from '../../src/app/feature-registry.ts';
import { boot } from '../../src/app/boot.ts';
import { getContext, listContextIds } from '../../src/app/contexts.ts';
import { publishFeature } from '../../src/app/publish-feature.ts';
import { getSeiPro } from '../../src/core/global.ts';
import { fakeLogger } from '../fakes/fakeLogger.js';

describe('src/app registry + boot', () => {
  beforeEach(() => {
    resetFeatureRegistry();
    const root = getSeiPro();
    root.features = {};
    root.core = root.core || {};
    root.core.config = {
      verifyConfigValue() { return true; }
    };
    if (typeof document !== 'undefined' && document.documentElement) {
      document.documentElement.removeAttribute('data-seipro-failed-features');
      const marker = document.getElementById('seipro-failed-features');
      if (marker) marker.remove();
    }
  });

  it('lists known contexts and reflects the runtime registry', () => {
    expect(listContextIds()).toEqual(expect.arrayContaining(['login', 'db']));
    expect(getContext('login').features).toEqual([]);
    expect(getContext('db').features).toEqual([]);
    registerFeature({ id: 'login', contexts: ['login'], install: () => {} });
    expect(getContext('login').features).toContain('login');
  });

  it('boots registered features for a context', async () => {
    const calls = [];
    registerFeature({
      id: 'login',
      contexts: ['login'],
      install: () => { calls.push('login'); }
    });
    const result = await boot('login');
    expect(result.installed).toEqual(['login']);
    expect(result.failed).toEqual([]);
    expect(calls).toEqual(['login']);
    expect(featuresForContext('login')).toHaveLength(1);
  });

  it('skips features when configKey is disabled', async () => {
    getSeiPro().core.config.verifyConfigValue = (key) => key !== 'off';
    registerFeature({
      id: 'login',
      configKey: 'off',
      contexts: ['login'],
      install: () => { throw new Error('should not install'); }
    });
    expect((await boot('login')).installed).toEqual([]);
  });

  it('uses deps.config for configKey instead of only the global', async () => {
    getSeiPro().core.config.verifyConfigValue = () => true;
    registerFeature({
      id: 'login',
      configKey: 'flag',
      contexts: ['login'],
      install: () => {}
    });
    const result = await boot('login', {
      config: { verifyConfigValue: (key) => key !== 'flag' },
      logger: fakeLogger()
    });
    expect(result.installed).toEqual([]);
  });

  it('isolates install failures: later features still install (ADR-0006)', async () => {
    const order = [];
    const logger = fakeLogger();
    registerFeature({
      id: 'boom',
      contexts: ['login'],
      install: () => { order.push('boom'); throw new Error('explode'); }
    });
    registerFeature({
      id: 'login',
      contexts: ['login'],
      install: () => { order.push('login'); }
    });
    const result = await boot('login', { logger });
    expect(result.installed).toEqual(['login']);
    expect(result.failed).toEqual(['boom']);
    expect(order).toEqual(['boom', 'login']);
    expect(logger.messagesOf('error').length).toBe(1);
    expect(String(logger.messagesOf('error')[0][0])).toMatch(/boom/);
  });

  it('stores cleanup from install and runs it on result.cleanup()', async () => {
    const events = [];
    registerFeature({
      id: 'login',
      contexts: ['login'],
      install: () => {
        events.push('install');
        return () => events.push('cleanup');
      }
    });
    const result = await boot('login', { logger: fakeLogger() });
    expect(events).toEqual(['install']);
    result.cleanup();
    expect(events).toEqual(['install', 'cleanup']);
  });

  it('marks failed features on the document when available', async () => {
    // jsdom environment may be absent — skip marker assertion if no document
    if (typeof document === 'undefined') return;
    registerFeature({
      id: 'boom',
      contexts: ['login'],
      install: () => { throw new Error('x'); }
    });
    await boot('login', { logger: fakeLogger(), document });
    expect(document.documentElement.getAttribute('data-seipro-failed-features')).toBe('boom');
    const marker = document.getElementById('seipro-failed-features');
    expect(marker).toBeTruthy();
    expect(marker.textContent).toMatch(/boom/);
  });

  it('publishFeature freezes the public contract', () => {
    const published = publishFeature({
      id: 'demo',
      api: { ping: () => 1 },
      install: () => {}
    });
    expect(published.id).toBe('demo');
    expect(typeof published.api.ping).toBe('function');
    expect(typeof published.install).toBe('function');
    expect(Object.isFrozen(published)).toBe(true);
    expect(getSeiPro().features.demo).toBe(published);
  });

  it('isolates rejected asynchronous installs', async () => {
    const logger = fakeLogger();
    registerFeature({
      id: 'async-boom',
      contexts: ['login'],
      install: async () => { throw new Error('async explode'); }
    });
    registerFeature({ id: 'login', contexts: ['login'], install: () => {} });

    const result = await boot('login', { logger });
    expect(result.failed).toEqual(['async-boom']);
    expect(result.installed).toEqual(['login']);
  });

  it('fails closed when the config reader throws', async () => {
    registerFeature({ id: 'login', contexts: ['login'], configKey: 'flag', install: () => {} });
    const result = await boot('login', {
      config: { verifyConfigValue: () => { throw new Error('corrupt config'); } },
      logger: fakeLogger()
    });
    expect(result.installed).toEqual([]);
  });
});
