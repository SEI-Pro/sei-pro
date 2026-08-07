import { describe, expect, it, vi } from 'vitest';
import { createActivityUseCases } from '../../../src/features/atividades/activity-use-cases.ts';
import { createConfigUseCases } from '../../../src/features/atividades/config-use-cases.ts';

function contextWithPermissions(check = () => true) {
  return { permissions: { check: vi.fn(check) } };
}

describe('atividades/use-cases', () => {
  it('creates activity commands with centralized capability checks', () => {
    const context = contextWithPermissions((name) => name !== 'delete_atividade');
    const handlers = {
      saveAtividade: vi.fn(() => 'saved'),
      saveAtividadeQuick: vi.fn(() => 'quick'),
      saveAtividadeFull: vi.fn(() => 'full'),
      startAtividade: vi.fn(() => 'started'),
      completeAtividade: vi.fn(() => 'completed'),
      pauseAtividade: vi.fn(() => 'paused'),
      archiveAtividade: vi.fn(() => 'archived'),
      deleteAtividade: vi.fn(() => 'deleted'),
      rateAtividade: vi.fn(() => 'rated')
    };
    const useCases = createActivityUseCases({ context, handlers });

    expect(useCases.create(4)).toBe('saved');
    expect(useCases.save(4, 'quick')).toBe('quick');
    expect(useCases.save(4, 'full')).toBe('full');
    expect(useCases.start(4)).toBe('started');
    expect(useCases.complete(4)).toBe('completed');
    expect(useCases.pause(4)).toBe('paused');
    expect(useCases.archive(4)).toBe('archived');
    expect(useCases.rate(4)).toBe('rated');
    expect(useCases.remove(4)).toBe(false);
    expect(handlers.deleteAtividade).not.toHaveBeenCalled();
    expect(context.permissions.check).toHaveBeenCalledWith('delete_atividade');
    expect(handlers.saveAtividade).toHaveBeenCalledWith(4);
  });

  it('normalizes missing ids to zero and fails clearly for an unknown command', () => {
    const context = contextWithPermissions();
    const save = vi.fn(() => true);
    const useCases = createActivityUseCases({ context, handlers: { saveAtividade: save } });
    expect(useCases.create()).toBe(true);
    expect(save).toHaveBeenCalledWith(0);
    expect(() => useCases.start(1)).toThrow('Unknown Atividades command: startAtividade');
  });

  it('creates configuration commands and applies capability rules only to protected writes', () => {
    const context = contextWithPermissions((name) => name === 'config_update_planos' || name === 'config_planos');
    const handlers = {
      openModalConfigPanel: vi.fn(() => 'opened'),
      getTabConfig: vi.fn(() => 'loaded'),
      saveOptionConfigItem: vi.fn(() => 'saved'),
      getConfigServer: vi.fn(() => 'got')
    };
    const useCases = createConfigUseCases({ context, handlers });

    expect(useCases.open()).toBe('opened');
    expect(useCases.load('planos')).toBe('loaded');
    expect(useCases.load('planos', 'update', { id: 1 })).toBe('loaded');
    expect(useCases.save({ value: 1 }, 'planos', 2)).toBe('saved');
    expect(useCases.get('planos', 2)).toBe('got');
    expect(handlers.getTabConfig).toHaveBeenNthCalledWith(1, 'planos', 'get', false);
    expect(handlers.getTabConfig).toHaveBeenNthCalledWith(2, 'planos', 'update', { id: 1 });
    expect(handlers.saveOptionConfigItem).toHaveBeenCalledWith({ value: 1 }, 'planos', 2);
  });

  it('denies protected configuration operations without invoking handlers', () => {
    const context = contextWithPermissions(() => false);
    const handlers = {
      getTabConfig: vi.fn(),
      saveOptionConfigItem: vi.fn()
    };
    const useCases = createConfigUseCases({ context, handlers });
    expect(useCases.load('planos')).toBe(false);
    expect(useCases.save({}, 'planos', 1)).toBe(false);
    expect(handlers.getTabConfig).not.toHaveBeenCalled();
    expect(handlers.saveOptionConfigItem).not.toHaveBeenCalled();
  });
});
