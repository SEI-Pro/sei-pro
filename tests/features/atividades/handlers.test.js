import { afterEach, describe, expect, it } from 'vitest';
import * as compat from '../../../src/features/atividades/compat.ts';
import * as domain from '../../../src/features/atividades/domain.ts';
import * as activityForm from '../../../src/features/atividades/activity-form.ts';
import { callAtiv } from '../../../src/features/atividades/call.ts';
import {
    atividadesHandlers,
    buildAtividadesHandlers
} from '../../../src/features/atividades/handlers.ts';

afterEach(() => {
    delete globalThis.SeiPro;
    delete globalThis.checkOptionEntidade;
    delete globalThis.getOptionEntidade;
    delete globalThis.moment;
});

describe('atividades/handlers', () => {
    it('uses the runtime adapters for duplicated compatibility functions', () => {
        expect(atividadesHandlers.getAppsScriptUrlAtiv).toBe(compat.getAppsScriptUrlAtiv);
        expect(atividadesHandlers.getLabIdTables).toBe(compat.getLabIdTables);
        expect(atividadesHandlers.getNumMonthsBetween2Dates).toBe(compat.getNumMonthsBetween2Dates);
        expect(atividadesHandlers.checkHomologacaoPreviaPlanos).toBe(activityForm.checkHomologacaoPreviaPlanos);
        expect(atividadesHandlers.checkHomologacaoPreviaProgramas).toBe(activityForm.checkHomologacaoPreviaProgramas);
        expect(atividadesHandlers.checkHomologacaoPreviaPlanos).not.toBe(domain.checkHomologacaoPreviaPlanos);
        expect(atividadesHandlers.checkHomologacaoPreviaProgramas).not.toBe(domain.checkHomologacaoPreviaProgramas);
    });

    it('does not require globals when homologação dependencies are injected', () => {
        const moment = (input) => ({
            valueOf: () => Date.parse(String(input).replace(' ', 'T'))
        });

        expect(atividadesHandlers.checkHomologacaoPreviaPlanos(
            { data_inicio_vigencia: '2024-06-01 00:00:00' },
            {
                checkOptionEntidade: (key) => key === 'exigir_homologacao_previa_planos',
                getOptionEntidade: () => false,
                moment
            }
        )).toBe(true);
    });

    it('resolves the adapted gate through the real callAtiv path', () => {
        globalThis.SeiPro = { features: { atividades: { api: { handlers: atividadesHandlers } } } };
        globalThis.checkOptionEntidade = (key) => key === 'exigir_homologacao_previa_planos';
        globalThis.getOptionEntidade = () => false;
        globalThis.moment = (input) => ({
            valueOf: () => Date.parse(String(input).replace(' ', 'T'))
        });

        expect(callAtiv('checkHomologacaoPreviaPlanos', {
            data_inicio_vigencia: '2024-06-01 00:00:00'
        })).toBe(true);
    });

    it('fails fast when a new duplicate has no explicit owner', () => {
        expect(() => buildAtividadesHandlers([
            ['first', { duplicate: () => 'first' }],
            ['second', { duplicate: () => 'second' }]
        ], {})).toThrow(/Duplicate Atividades handler "duplicate"/);
    });
});
