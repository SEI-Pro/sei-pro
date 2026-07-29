import { describe, expect, it } from 'vitest';
import { getLabIdTables, getNumMonthsBetween2Dates, getAppsScriptUrlAtiv } from '../../../src/features/atividades/domain.js';

describe('atividades/domain', () => {
  it('getLabIdTables maps known table types to primary-key fields', () => {
    expect(getLabIdTables('tipos_modalidades')).toBe('id_tipo_modalidade');
    expect(getLabIdTables('tipos_metadados')).toBe('id_tipo_metadado');
    expect(getLabIdTables('tipos_prescricoes')).toBe('id_tipo_prescricao');
    expect(getLabIdTables('cadeia_valor')).toBe('id_cadeia_valor');
    expect(getLabIdTables('acoes')).toBe('id_acao');
    expect(getLabIdTables('email')).toBe('id_email');
    expect(getLabIdTables('demandas')).toBe('id_demanda');
  });

  it('getNumMonthsBetween2Dates returns inclusive month span (min 1)', () => {
    const fakeMoment = (diffMonths) => () => {
      const api = {
        startOf() { return api; },
        endOf() { return api; },
        add() { return api; },
        diff() { return diffMonths; }
      };
      return api;
    };

    expect(getNumMonthsBetween2Dates(
      { data_inicio_vigencia: '2024-01-01 00:00:00', data_fim_vigencia: '2024-03-31 23:59:59' },
      { moment: fakeMoment(3) }
    )).toBe(3);

    expect(getNumMonthsBetween2Dates(
      { data_inicio_vigencia: '2024-01-01 00:00:00', data_fim_vigencia: '2024-01-15 00:00:00' },
      { moment: fakeMoment(0) }
    )).toBe(1);
  });

  it('getAppsScriptUrlAtiv prefers injected getter then fallback URL', () => {
    expect(getAppsScriptUrlAtiv({
      getSEIProAppsScriptUrl: () => 'https://example.test/script',
      fallbackUrl: 'https://fallback.test'
    })).toBe('https://example.test/script');

    expect(getAppsScriptUrlAtiv({
      getSEIProAppsScriptUrl: undefined,
      fallbackUrl: 'https://fallback.test'
    })).toBe('https://fallback.test');
  });
});
