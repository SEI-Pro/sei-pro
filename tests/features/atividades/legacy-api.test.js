import { describe, expect, it } from 'vitest';
import { installAtividadesLegacyApi } from '../../../src/features/atividades/legacy-api.ts';

describe('atividades/legacy-api', () => {
  it('does not install aliases unless the host opts in', () => {
    const target = {};
    installAtividadesLegacyApi({ target });
    expect(target.getServerAtividades).toBeUndefined();
  });

  it('supports an explicit opt-in adapter for third-party hosts', () => {
    const target = {};
    installAtividadesLegacyApi({ target, enabled: true });
    expect(typeof target.getServerAtividades).toBe('function');
  });
});

