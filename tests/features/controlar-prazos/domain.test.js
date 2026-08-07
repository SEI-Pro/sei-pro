import { afterEach, describe, expect, it } from 'vitest';
import { buildControlePrazoNativeTooltip } from '../../../src/features/controlar-prazos/domain.ts';

function installMomentMock(validDates = {}) {
    globalThis.moment = (value) => ({
        isValid: () => Object.prototype.hasOwnProperty.call(validDates, value),
        format: () => validDates[value] || ''
    });
}

afterEach(() => {
    delete globalThis.moment;
    delete globalThis.getCurrentUserNamePro;
});

describe('controlar-prazos/domain — buildControlePrazoNativeTooltip', () => {
    it('formata a data de conclusão', () => {
        installMomentMock({ '2026-07-14 09:30:00': '14/07/2026' });

        expect(buildControlePrazoNativeTooltip(
            { concluido: true },
            '2026-07-14 09:30:00'
        )).toBe('Concluído em 14/07/2026');
    });

    it('prioriza o conteúdo textual já calculado', () => {
        installMomentMock();

        expect(buildControlePrazoNativeTooltip(
            { content: 'Prazo definido pelo SEI' },
            ''
        )).toBe('Prazo definido pelo SEI');
    });

    it('monta tooltip com usuário, data e pluralização dos dias', () => {
        installMomentMock({ '2026-07-14 09:30:00': '14/07/2026' });
        globalThis.getCurrentUserNamePro = () => 'Ana';

        expect(buildControlePrazoNativeTooltip(
            { diasRestantes: 2 },
            '2026-07-14 09:30:00'
        )).toBe('Ana 14/07/2026 (2 dias)');
        expect(buildControlePrazoNativeTooltip(
            { diasRestantes: -1 },
            '2026-07-14 09:30:00'
        )).toBe('Ana 14/07/2026 (-1 dia)');
    });

    it('usa somente usuário/data quando os dias não estão disponíveis', () => {
        installMomentMock({ '2026-07-14 09:30:00': '14/07/2026' });
        globalThis.getCurrentUserNamePro = () => 'Ana';

        expect(buildControlePrazoNativeTooltip({}, '2026-07-14 09:30:00'))
            .toBe('Ana 14/07/2026');
    });

    it('faz fallback para data, conteúdo ou string vazia', () => {
        installMomentMock({ '2026-07-14 09:30:00': '14/07/2026' });

        expect(buildControlePrazoNativeTooltip({}, '2026-07-14 09:30:00'))
            .toBe('14/07/2026');
        expect(buildControlePrazoNativeTooltip({ content: 'fallback' }, 'invalid'))
            .toBe('fallback');
        expect(buildControlePrazoNativeTooltip({}, 'invalid')).toBe('');
    });
});
