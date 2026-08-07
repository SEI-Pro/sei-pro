import { describe, expect, it, beforeEach } from 'vitest';
import { installBus, bus } from '../../src/platform/bus.js';
import { getSeiPro } from '../../src/core/global.js';

describe('platform/bus', () => {
  beforeEach(() => {
    const root = getSeiPro();
    root.platform = {};
    installBus();
  });

  it('delivers whitelisted events', () => {
    const seen = [];
    bus.on('monitorados:updated', (payload) => seen.push(payload));
    bus.emit('monitorados:updated', { items: [1] });
    expect(seen).toEqual([{ items: [1] }]);
  });

  it('ignores unknown events', () => {
    const seen = [];
    bus.on('not:allowed', (payload) => seen.push(payload));
    bus.emit('not:allowed', { x: 1 });
    expect(seen).toEqual([]);
  });
});
