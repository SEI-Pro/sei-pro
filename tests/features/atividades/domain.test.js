import { describe, expect, it } from 'vitest';
import {
  getLabIdTables,
  getNumMonthsBetween2Dates,
  getAppsScriptUrlAtiv,
  isAtividadesServerModeAllowed,
  buildAtividadesRequestParams,
  isPerfilNivelAdm,
  findConfigItemById,
  checkHomologacaoPreviaPlanos,
  checkHomologacaoPreviaProgramas
} from '../../../src/features/atividades/domain.js';

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

  it('isAtividadesServerModeAllowed gates privileged modes', () => {
    expect(isAtividadesServerModeAllowed('panel')).toBe(true);
    expect(isAtividadesServerModeAllowed('config_resend_keys')).toBe(true);
    expect(isAtividadesServerModeAllowed('chart_demandas', {
      checkCapacidade: (m) => m === 'chart_demandas'
    })).toBe(true);
    expect(isAtividadesServerModeAllowed('chart_demandas', {
      checkCapacidade: () => false
    })).toBe(false);
    expect(isAtividadesServerModeAllowed('save_atividade', {
      checkCapacidade: () => true,
      delayServerAtiv: 0,
      checkLoadingButtonConfirm: () => false
    })).toBe(true);
    expect(isAtividadesServerModeAllowed('save_atividade', {
      checkCapacidade: () => true,
      delayServerAtiv: 1,
      checkLoadingButtonConfirm: () => false
    })).toBe(false);
  });

  it('buildAtividadesRequestParams mutates payload with session fields', () => {
    const param = { action: 'demandas' };
    const out = buildAtividadesRequestParams(param, 'panel', {
      userHashAtiv: 'hash-1',
      version: '2.0.0',
      lastUpdateAtividades: '2024-01-01',
      getOptionsPro: (key) => ({
        perfilAtividadesSelected: 'UNID',
        programaAtividadesSelected: 9,
        panelLocalStorePro: false,
        stateArquivadosGantt: false
      })[key],
      verifyConfigValue: (k) => k === 'gerenciarprojetos',
      checkConfigValue: (k) => k === 'gerenciarprescricoes'
    });

    expect(out).toBe(param);
    expect(param.hash).toBe('hash-1');
    expect(param.version).toBe('2.0.0');
    expect(param.perfil).toBe('UNID');
    expect(param.id_programa).toBe(9);
    expect(param.last_update).toBe('2024-01-01');
    expect(param.projetos).toBe(JSON.stringify({ vigentes: true }));
    expect(param.prescricoes).toBe(JSON.stringify({ vigentes: true }));
  });

  it('isPerfilNivelAdm is true only for nivel == 1', () => {
    expect(isPerfilNivelAdm({ nivel: 1 })).toBe(true);
    expect(isPerfilNivelAdm({ nivel: 2 })).toBe(false);
    expect(isPerfilNivelAdm({})).toBe(false);
    expect(isPerfilNivelAdm(undefined)).toBe(false);
    expect(isPerfilNivelAdm(null)).toBe(false);
  });

  it('findConfigItemById prefers first list then falls back', () => {
    const table = [{ id_plano: 1, nome: 'table' }];
    const config = [{ id_plano: 1, nome: 'config' }, { id_plano: 2, nome: 'cfg2' }];
    expect(findConfigItemById([table, config], 'id_plano', 1).nome).toBe('table');
    expect(findConfigItemById([undefined, config], 'id_plano', 2).nome).toBe('cfg2');
    expect(findConfigItemById([table, config], 'id_plano', 99)).toBe(false);
    expect(findConfigItemById([[]], 'id_plano', 1)).toBe(false);
  });

  it('checkHomologacaoPreviaPlanos gates by entidade flags and date', () => {
    const moment = (input) => ({
      _v: String(input),
      valueOf() { return Date.parse(String(input).replace(' ', 'T')); }
    });

    expect(checkHomologacaoPreviaPlanos(
      { data_inicio_vigencia: '2024-06-01 00:00:00' },
      {
        checkOptionEntidade: () => false,
        getOptionEntidade: () => false,
        moment
      }
    )).toBe(false);

    expect(checkHomologacaoPreviaPlanos(
      { data_inicio_vigencia: '2024-06-01 00:00:00' },
      {
        checkOptionEntidade: (k) => k === 'exigir_homologacao_previa_planos',
        getOptionEntidade: () => false,
        moment
      }
    )).toBe(true);

    expect(checkHomologacaoPreviaPlanos(
      { data_inicio_vigencia: '2024-06-01 00:00:00' },
      {
        checkOptionEntidade: () => true,
        getOptionEntidade: () => '2024-01-01',
        moment
      }
    )).toBe(true);

    expect(checkHomologacaoPreviaPlanos(
      { data_inicio_vigencia: '2024-01-01 00:00:00' },
      {
        checkOptionEntidade: () => true,
        getOptionEntidade: () => '2024-06-01',
        moment
      }
    )).toBe(false);
  });

  it('checkHomologacaoPreviaProgramas uses fim vigencia and exigir_homologacao_programas', () => {
    const moment = (input) => ({
      _v: String(input),
      valueOf() { return Date.parse(String(input).replace(' ', 'T')); }
    });

    expect(checkHomologacaoPreviaProgramas(
      { data_fim_vigencia: '2024-12-31 23:59:59' },
      {
        checkOptionEntidade: (k) => k === 'exigir_homologacao_programas',
        getOptionEntidade: () => false,
        moment
      }
    )).toBe(true);

    expect(checkHomologacaoPreviaProgramas(
      { data_fim_vigencia: '2024-12-31 23:59:59' },
      {
        checkOptionEntidade: () => true,
        getOptionEntidade: () => '2024-01-01',
        moment
      }
    )).toBe(true);

    expect(checkHomologacaoPreviaProgramas(
      { data_fim_vigencia: '2024-01-01 00:00:00' },
      {
        checkOptionEntidade: () => true,
        getOptionEntidade: () => '2024-06-01',
        moment
      }
    )).toBe(false);

    expect(checkHomologacaoPreviaProgramas(
      { data_fim_vigencia: '2024-12-31 23:59:59' },
      {
        checkOptionEntidade: () => false,
        getOptionEntidade: () => false,
        moment
      }
    )).toBe(false);
  });
});
