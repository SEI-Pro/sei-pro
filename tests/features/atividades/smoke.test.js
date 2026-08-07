import { describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createAtividadesFeatureApi } from '../../../src/features/atividades/api.ts';
import { readSeiFunctionsSource } from '../../helpers/read-sei-functions.js';

const rootDir = process.cwd();
const read = (file) => readFileSync(join(rootDir, file), 'utf8');

describe('atividades architecture smoke', () => {
  it('keeps the request boundary small and the response adapter isolated', () => {
    const server = read('src/features/atividades/server.ts');
    const response = read('src/features/atividades/server-response.ts');
    expect(server.split('\n').length).toBeLessThan(150);
    expect(server).toContain("routeAtividadesResponse");
    expect(response).toContain('export function routeAtividadesResponse');
    expect(response).not.toContain("from './server.js'");
  });

  it('publishes one explicit API contract instead of spreading handlers at root', () => {
    const index = read('src/features/atividades/index.ts');
    expect(index).toContain('namespace.features.atividades = Object.freeze({');
    expect(index).toContain('api: featureApi');
    expect(index).toContain('useCases,');
    expect(index).toContain('ports');
    expect(index).not.toContain('...atividadesHandlers');
    expect(index).not.toContain('saveAtividade: atividadesHandlers');
  });

  it('keeps first-party consumers on the nested API contract', () => {
    const consumers = [
      'src/features/arvore/atividades-arvore.ts',
      'src/features/lista-processos/atividades-bridge.ts',
      'src/features/monitorados/server.ts',
      'src/features/monitorados/store.ts',
      'src/features/prescricoes/sei-pro-prescricoes.js',
      'src/features/projetos/io.ts',
      'src/features/projetos/commands.ts',
      'src/features/projetos/view/helpers.ts',
      'src/features/sei-functions/atividades-bridge.ts',
      'src/features/visualizacao/sei-pro-visualizacao.js'
    ];
    for (const file of consumers) {
      const source = read(file);
      expect(source, file).not.toContain('feature.api || feature');
      expect(source, file).not.toContain('api[name]');
    }
  });

  it('exposes state, commands, queries and request through the feature API', () => {
    const request = vi.fn();
    const dispatch = vi.fn();
    const handlers = {
      saveAtividade: vi.fn(),
      checkCapacidade: vi.fn()
    };
    const state = { ready: true };
    const context = {
      store: { get: () => state, subscribe: vi.fn() }
    };
    const api = createAtividadesFeatureApi({
      application: { request, dispatch },
      handlers,
      context,
      legacyRequest: vi.fn()
    });

    expect(api.version).toBe(2);
    expect(api.state.get()).toBe(state);
    expect(api.handlers.saveAtividade).toBe(handlers.saveAtividade);
    expect(api.commands.saveAtividade).toBeTypeOf('function');
    expect(api.queries.checkCapacidade).toBeTypeOf('function');
    expect(api.request).toBe(request);
    expect(api.legacyRequest).toBeTypeOf('function');
    expect(Object.keys(api)).toEqual([
      'version', 'handlers', 'state', 'commands', 'queries',
      'request', 'legacyRequest'
    ]);
  });
});
