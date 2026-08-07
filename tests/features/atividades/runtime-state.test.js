import { describe, expect, it } from 'vitest';
import { createAtividadesContext } from '../../../src/features/atividades/context.ts';
import { createAtividadesStore } from '../../../src/features/atividades/store.ts';
import { createAtividadesRuntimeState } from '../../../src/features/atividades/runtime-state.ts';

describe('atividades/runtime-state', () => {
  it('builds the initial patch without writing page globals', () => {
    const page = {
      setTimeout,
      clearTimeout,
      getOptionsPro: (key) => key === 'perfilAtividadesSelected' ? 'perfil' : false,
      hybridStorageRestorePro: (key) => ({
        configDataAtividadesPadraoPro: [{ id: 1 }],
        configDataAtivUnidadePro: [{ id: 2 }],
        configDataAtividadesPro: [{ id: 3 }],
        configDataAtividadesProcPro: [{ id: 4 }],
        configDataPrescricoesProcPro: [{ id: 5 }]
      }[key] || null),
      localStorageRestorePro: () => null,
      restoreLocalDataConfigArray: () => [{ id: 10 }],
      getProcessoUnidadePro: () => ['processo']
    };
    const context = createAtividadesContext({
      globalRef: page,
      store: createAtividadesStore(),
      getOption: page.getOptionsPro
    });
    const state = createAtividadesRuntimeState(context);

    expect(state.arrayConfigAtividades).toEqual([{ id: 10 }]);
    expect(state.arrayAtividadesPro).toEqual([{ id: 3 }]);
    expect(state.arrayAtividadesProcPro).toEqual([{ id: 4 }]);
    expect(state.arrayProcessosUnidade).toEqual(['processo']);
    expect(state.chartColors.dark_grey).toBe('rgb(102 102 102)');
    expect(page.arrayConfigAtividades).toBeUndefined();
  });
});
