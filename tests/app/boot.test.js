import { describe, expect, it, beforeEach } from 'vitest';
import { resetFeatureRegistry, registerFeature, featuresForContext } from '../../src/app/feature-registry.js';
import { boot } from '../../src/app/boot.js';
import { getContext, listContextIds } from '../../src/app/contexts.js';
import { publishFeature } from '../../src/app/publish-feature.js';
import { getSeiPro } from '../../src/core/global.js';

describe('src/app registry + boot', () => {
  beforeEach(() => {
    resetFeatureRegistry();
    const root = getSeiPro();
    root.features = {};
    root.core = root.core || {};
    root.core.config = {
      verifyConfigValue() { return true; }
    };
  });

  it('lists pilot contexts', () => {
    expect(listContextIds()).toEqual(expect.arrayContaining(['login', 'db']));
    expect(getContext('login').features).toContain('login');
    expect(getContext('db').features).toContain('external-config');
  });

  it('boots registered features for a context', () => {
    const calls = [];
    registerFeature({
      id: 'login',
      contexts: ['login'],
      install: () => { calls.push('login'); }
    });
    const result = boot('login');
    expect(result.installed).toEqual(['login']);
    expect(calls).toEqual(['login']);
    expect(featuresForContext('login')).toHaveLength(1);
  });

  it('skips features when configKey is disabled', () => {
    getSeiPro().core.config.verifyConfigValue = (key) => key !== 'off';
    registerFeature({
      id: 'login',
      configKey: 'off',
      contexts: ['login'],
      install: () => { throw new Error('should not install'); }
    });
    expect(boot('login').installed).toEqual([]);
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
});
