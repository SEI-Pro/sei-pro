import { describe, expect, it, vi } from 'vitest';
import {
  classifyAtividadesResponse,
  createAtividadesResponseRouter
} from '../../../src/features/atividades/response.ts';

describe('atividades/response', () => {
  it('classifies transport payloads without depending on DOM globals', () => {
    expect(classifyAtividadesResponse({ status: 0 }, {}, 'panel').type).toBe('error');
    expect(classifyAtividadesResponse({ status_acess: 0 }, {}, 'panel').type).toBe('access-denied');
    expect(classifyAtividadesResponse({ chart: [] }, {}, 'chart_produtividade').type).toBe('chart');
    expect(classifyAtividadesResponse({ ok: true }, {}, 'config_update_planos').type).toBe('config');
    expect(classifyAtividadesResponse({ ok: true }, {}, 'get_monitorados').type).toBe('monitorados');
    expect(classifyAtividadesResponse({ ok: true }, {}, 'update_prescricao').type).toBe('prescricao');
    expect(classifyAtividadesResponse({ ok: true }, {}, 'save_projeto').type).toBe('projeto');
    expect(classifyAtividadesResponse({ ok: true }, {}, 'report_demandas').type).toBe('report');
    expect(classifyAtividadesResponse({ ok: true }, {}, 'panel').type).toBe('panel');
    expect(classifyAtividadesResponse({ ok: true }, {}, 'save_atividade').type).toBe('operation');
    expect(classifyAtividadesResponse([], {}, 'save_atividade').type).toBe('error');
  });

  it('preserves mode and params in the normalized event', () => {
    const param = { action: 'chart_demandas', id: 3 };
    const event = classifyAtividadesResponse({ chart: [] }, param, 'chart_demandas');
    expect(event).toMatchObject({ type: 'chart', mode: 'chart_demandas', param, payload: { chart: [] } });
    expect(Object.isFrozen(event)).toBe(true);
  });

  it('routes by normalized event type and supports a mode-specific handler', () => {
    const resolve = vi.fn((name) => name === 'response:chart' ? (event) => event.payload : null);
    const router = createAtividadesResponseRouter({ resolve });
    const payload = { chart: [1] };
    expect(router(payload, { action: 'chart' }, 'chart_demandas')).toEqual(payload);
    expect(resolve).toHaveBeenCalledWith('response:chart');
  });

  it('falls back to a mode handler and reports unknown routes', () => {
    const unknown = vi.fn((event, context) => ({ event, context }));
    const router = createAtividadesResponseRouter({
      resolve: (name) => name === 'response:save_atividade' ? (event) => event.type : null,
      onUnknown: unknown
    });
    expect(router({ ok: true }, {}, 'save_atividade')).toBe('operation');
    expect(router({ ok: true }, {}, 'unmapped_mode', { source: 'test' })).toMatchObject({
      event: { type: 'operation', mode: 'unmapped_mode' },
      context: { source: 'test' }
    });
    expect(unknown).toHaveBeenCalledOnce();
  });
});
