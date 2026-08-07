import { describe, expect, it } from 'vitest';
import {
  selectEntityConfig,
  selectEntityOption,
  hasEntityOption,
  selectUnitConfig,
  selectConfigItem
} from '../../../src/features/atividades/config-queries.ts';

describe('atividades/config-queries', () => {
  const config = {
    perfil: { id_entidade: 7 },
    entidades: [
      { id_entidade: 7, config: { habilitado: true, limite: 0, vazio: '' } },
      { id_entidade: 8, config: { habilitado: false } }
    ]
  };

  it('selects an entity configuration using numeric or string ids', () => {
    expect(selectEntityConfig(config, 7)).toEqual(config.entidades[0].config);
    expect(selectEntityConfig(config, '7')).toEqual(config.entidades[0].config);
    expect(selectEntityConfig(config, 99)).toBeNull();
    expect(selectEntityConfig(null, 7)).toBeNull();
  });

  it('reads entity options and distinguishes a present falsy value from a missing option', () => {
    expect(selectEntityOption(config, 7, 'habilitado')).toBe(true);
    expect(selectEntityOption(config, 7, 'limite')).toBe(0);
    expect(selectEntityOption(config, 7, 'vazio')).toBe('');
    expect(selectEntityOption(config, 7, 'ausente')).toBe(false);
    expect(hasEntityOption(config, 7, 'habilitado')).toBe(true);
    expect(hasEntityOption(config, 7, 'limite')).toBe(false);
  });

  it('selects unit options, including nested options', () => {
    const unit = { config: { distribuicao: { count_horas: 8 }, ativo: false } };
    expect(selectUnitConfig(unit, 'distribuicao', 'count_horas')).toBe(8);
    expect(selectUnitConfig(unit, 'ativo')).toBe(false);
    expect(selectUnitConfig(unit, 'ausente')).toBe(false);
    expect(selectUnitConfig(undefined, 'ativo')).toBe(false);
  });

  it('finds the first matching item across configuration lists', () => {
    const first = [{ id: 1, name: 'first' }];
    const second = [{ id: 2, name: 'second' }];
    expect(selectConfigItem([first, second], 'id', '2')).toEqual(second[0]);
    expect(selectConfigItem([undefined, second], 'id', 9)).toBe(false);
    expect(selectConfigItem(undefined, 'id', 1)).toBe(false);
  });
});
