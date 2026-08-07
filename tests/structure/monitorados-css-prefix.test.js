import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = join(fileURLToPath(new URL('../..', import.meta.url)));
const featureDir = join(rootDir, 'src/features/monitorados');

const read = (name) => readFileSync(join(featureDir, name), 'utf8');

const legacyFeatureClasses = [
  'tableMonitorados',
  'iconMonitorados_remove',
  'iconMonitorados_update',
  'iconMonitorados_config',
  'monitoradoConfigDates',
  'tdmonitorado_native',
  'tdmonitorado_tipo',
  'td_monitorado_category',
  'info_dates_monitorado_txt',
  'info_dates_follow_empty',
  'monitoradosLabelOptions',
  'configDates_selectdoc',
  'configDates_setdate',
  'configDates_countdays',
  'configDates_newdoc',
  'configDates_duedate',
  'configDates_duesetdate'
];

describe('migration: Monitorados CSS closes as a batch', () => {
  it('emits feature-owned DOM classes only through seipro-prefixed hooks', () => {
    const producers = ['panel.ts', 'commands.ts', 'categorias.ts', 'datas.ts', 'visualizacao.ts', 'extras.ts']
      .map(read)
      .join('\n');

    expect(producers).toMatch(/seipro-table-monitorados/);
    expect(producers).toMatch(/seipro-monitorado-native-cell/);
    expect(producers).toMatch(/seipro-monitorado-type-cell/);
    expect(producers).toMatch(/seipro-monitorado-category-cell/);
    expect(producers).toMatch(/seipro-monitorado-dates-(selectdoc|setdate|countdays|newdoc|duedate|duesetdate)/);
    expect(producers).toMatch(/seipro-monitorados-(remove-selected|update|config|scroll)/);
    expect(producers).toMatch(/seipro-monitorado-success-message/);

    const emittedClasses = [...producers.matchAll(/class(?:Name)?=["']([^"']+)["']/g)]
      .flatMap((match) => match[1].split(/\s+/));
    for (const legacyClass of legacyFeatureClasses) {
      expect(emittedClasses, `legacy class ${legacyClass} is still emitted`).not.toContain(legacyClass);
    }
  });

  it('keeps Monitorados CSS scoped while preserving shared SEI contracts', () => {
    const css = read('monitorados.css');
    expect(css).toMatch(/\.seipro-table-monitorados/);
    expect(css).toMatch(/\.seipro-monitorados-scroll/);
    expect(css).toMatch(/\.seipro-monitorado-dates-empty/);
    expect(css).toMatch(/\.seipro-monitorado-tags-cell/);
    expect(css).not.toMatch(/(^|[^-])\.tableMonitorados\b/);
    expect(css).not.toMatch(/(^|[^-])\.monitoradosLabelOptions\b/);
    expect(css).toMatch(/\.info_dates_monitorado/);
    expect(css).toMatch(/\.info_tags_follow/);
    expect(read('panel.ts')).toMatch(/tableInfo tableZebra infraTable tableFollow/);
    expect(read('visualizacao.ts')).toMatch(/class=\\?['\"]seiProForm/);
  });
});
