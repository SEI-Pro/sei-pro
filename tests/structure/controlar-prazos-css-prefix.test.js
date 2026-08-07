import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readSeiFunctionsSource } from '../helpers/read-sei-functions.js';

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '../..');

function read(relPath) {
  return readFileSync(join(rootDir, relPath), 'utf8');
}

describe('migration: controlar-prazos CSS classes stay prefixed', () => {
  it('uses seipro-prefixed classes for the prazo column and add action', () => {
    const view = read('src/features/controlar-prazos/view.js');
    const css = read('src/features/controlar-prazos/style.css');
    const listaProcessos = read('src/features/lista-processos/grouping-select.js') +
      read('src/features/lista-processos/kanban-home.js');
    const monitoradosPanel = read('src/features/monitorados/panel.js');

    expect(view).toContain('seipro-prazo-box-display');
    expect(view).toContain('seipro-add-controle-prazo');
    expect(css).toContain('.seipro-prazo-box-display');
    expect(css).toContain('.seipro-add-controle-prazo');
    expect(listaProcessos).toContain('seipro-prazo-box-display');
    expect(monitoradosPanel).toContain('seipro-prazo-box-display');

    expect(view).not.toMatch(/prazoBoxDisplay|prazosBoxDisplay/);
    expect(css).not.toMatch(/prazoBoxDisplay|prazosBoxDisplay|\.addControlePrazo\b/);
    expect(listaProcessos).not.toMatch(/prazoBoxDisplay|prazosBoxDisplay/);
    expect(monitoradosPanel).not.toMatch(/prazoBoxDisplay|prazosBoxDisplay/);
  });

  it('closes the feature-owned CSS batch without unprefixed residual classes', () => {
    const css = read('src/features/controlar-prazos/style.css');
    const view = read('src/features/controlar-prazos/view.js');

    const featureClasses = [...css.matchAll(/\.([a-z][a-z0-9-]*prazo[a-z0-9-]*)/gi)].map((match) => match[1]);
    expect(featureClasses.length).toBeGreaterThan(0);
    expect(featureClasses).toEqual(expect.arrayContaining([
      'seipro-prazo-box-display',
      'seipro-add-controle-prazo'
    ]));
    expect(featureClasses.every((className) => className.startsWith('seipro-'))).toBe(true);
    expect(view).not.toMatch(/class=\"[^\"]*\b(?:prazoBoxDisplay|prazosBoxDisplay|addControlePrazo)\b/);
  });
});

describe('migration: monitorados CSS classes stay prefixed', () => {
  it('uses a seipro-prefixed class for the monitorados table facade', () => {
    const css = read('src/features/monitorados/monitorados.css');
    const panel = read('src/features/monitorados/panel.js');
    const legacyShared = readSeiFunctionsSource();

    expect(css).toContain('.seipro-table-monitorados');
    expect(panel).toContain('seipro-table-monitorados');
    expect(legacyShared).toContain('.seipro-table-monitorados tbody');

    expect(css).not.toMatch(/\.tableMonitorados\b/);
    expect(panel).not.toMatch(/tableMonitorados/);
    expect(legacyShared).not.toMatch(/\.tableMonitorados\b/);
  });

  it('uses a seipro-prefixed class for the bulk remove action hook', () => {
    const panel = read('src/features/monitorados/panel.js');
    const lifecycle = read('src/features/monitorados/panel-lifecycle.js');

    expect(panel).toContain('seipro-monitorados-remove-selected');
    expect(lifecycle).toContain('.seipro-monitorados-remove-selected');

    expect(panel).not.toMatch(/iconMonitorados_remove/);
    expect(lifecycle).not.toMatch(/iconMonitorados_remove/);
  });

  it('uses a seipro-prefixed class for the refresh action hook', () => {
    const panel = read('src/features/monitorados/panel.js');

    expect(panel).toContain('seipro-monitorados-update');
    expect(panel).toContain('data-act="update"');

    expect(panel).not.toMatch(/iconMonitorados_update/);
  });

  it('uses a seipro-prefixed class for the config action hook', () => {
    const panel = read('src/features/monitorados/panel.js');

    expect(panel).toContain('seipro-monitorados-config');
    expect(panel).toContain('data-act="config"');

    expect(panel).not.toMatch(/iconMonitorados_config/);
  });

  it('uses seipro-prefixed classes for native mirror cells, copied native icons and the process link', () => {
    const panel = read('src/features/monitorados/panel.js');

    expect(panel).toContain('seipro-monitorado-native-cell');
    expect(panel).toContain('seipro-monitorado-native-icons');
    expect(panel).toContain('seipro-monitorado-process-link');
    expect(panel).toContain('data-native="prazo"');
    expect(panel).toContain('data-native="marcador"');
    expect(panel).toContain('data-native="anotacao"');

    expect(panel).not.toMatch(/tdmonitorado_native/);
    expect(panel).not.toMatch(/info_icons_monitorado/);
    expect(panel).not.toMatch(/followLinkProcesso/);
  });

  it('uses a seipro-prefixed class for the monitorado type cell', () => {
    const panel = read('src/features/monitorados/panel.js');

    expect(panel).toContain('seipro-monitorado-type-cell');
    expect(panel).toContain('seipro-monitorado-remove-row');
    expect(panel).toContain('data-act="remove-row"');
    expect(panel).toContain('data-native="tipo"');

    expect(panel).not.toMatch(/tdmonitorado_tipo/);
    expect(panel).not.toMatch(/followLinkMonitoradoRemove/);
  });

  it('uses a seipro-prefixed class for the monitorado category cell', () => {
    const panel = read('src/features/monitorados/panel.js');

    expect(panel).toContain('seipro-monitorado-category-cell');
    const categorias = read('src/features/monitorados/categorias.js');

    expect(panel).toContain('seipro-monitorado-category-text');
    expect(panel).toContain('seipro-monitorado-category-editor');
    expect(panel).toContain('seipro-monitorado-category-edit');
    expect(panel).toContain('data-act="category-edit"');
    expect(categorias).toContain('.seipro-monitorado-category-text');
    expect(categorias).toContain('.seipro-monitorado-category-editor');

    expect(panel).not.toMatch(/td_monitorado_category/);
    expect(panel).not.toMatch(/info_category(_txt)?/);
    expect(panel).not.toMatch(/followLinkMonitoradoCategory/);
    expect(categorias).not.toMatch(/info_category(_txt)?/);
  });

  it('uses a seipro-prefixed class for the prazo config action hook', () => {
    const visualizacao = read('src/features/monitorados/visualizacao.js');
    const prazoRow = read('src/features/monitorados/prazo-row.js');

    expect(visualizacao).toContain('seipro-monitorado-config-dates');
    expect(visualizacao).toContain('data-act="dates-config"');
    expect(prazoRow).toContain('.seipro-monitorado-config-dates');

    expect(visualizacao).not.toMatch(/monitoradoConfigDates/);
    expect(prazoRow).not.toMatch(/monitoradoConfigDates/);
  });

  it('uses a seipro-prefixed class for the monitorado tags cell', () => {
    const visualizacao = read('src/features/monitorados/visualizacao.js');
    const css = read('src/features/monitorados/monitorados.css');

    expect(visualizacao).toContain('seipro-monitorado-tags-cell');
    expect(visualizacao).toContain('data-etiqueta-mode="monitorado"');
    expect(css).toContain('.seipro-monitorado-tags-cell');

    expect(visualizacao).not.toMatch(/tdmonitorado_tags/);
    expect(css).not.toMatch(/tdmonitorado_tags/);
  });

  it('uses a seipro-prefixed class for the monitorado label options box', () => {
    const visualizacao = read('src/features/monitorados/visualizacao.js');
    const datas = read('src/features/monitorados/datas.js');
    const seiFunctions = readSeiFunctionsSource();

    expect(visualizacao).toContain('seipro-monitorados-label-options');
    expect(datas).toContain('.seipro-monitorados-label-options');
    expect(seiFunctions).toContain('.seipro-monitorados-label-options');

    expect(visualizacao).not.toMatch(/monitoradosLabelOptions seiProForm/);
    expect(datas).not.toMatch(/\.monitoradosLabelOptions/);
    expect(seiFunctions).not.toMatch(/\.monitoradosLabelOptions/);
  });

  it('uses seipro-prefixed classes for monitorado tags input and add hook', () => {
    const visualizacao = read('src/features/monitorados/visualizacao.js');
    const datas = read('src/features/monitorados/datas.js');

    expect(visualizacao).toContain('seipro-monitorado-tags-input');
    expect(visualizacao).toContain('seipro-monitorado-tags-add');
    expect(visualizacao).toContain('data-act="tags-show"');
    expect(datas).toContain('.seipro-monitorado-tags-input');
    expect(visualizacao).toContain('name="monitoradoTagsPro"');

    expect(visualizacao).not.toMatch(/class="monitoradoTagsPro"/);
    expect(visualizacao).not.toMatch(/querySelector\('\.monitoradoTagsPro'\)/);
    expect(visualizacao).not.toMatch(/followLinkTagsAdd_send/);
    expect(datas).not.toMatch(/\.monitoradoTagsPro/);
  });

  it('uses a seipro-prefixed class for the monitorado tags empty-state hook', () => {
    const css = read('src/features/monitorados/monitorados.css');
    const legacyShared = readSeiFunctionsSource();

    expect(css).toContain('seipro-monitorado-tags-empty');
    expect(legacyShared).toContain('seipro-monitorado-tags-empty');
    expect(legacyShared).toContain("info_tags_follow_empty");

    expect(css).not.toMatch(/info_tags_follow_empty/);
  });

  it('uses seipro-prefixed classes for monitorado date modal rows', () => {
    const datas = read('src/features/monitorados/datas.js');

    expect(datas).toContain('seipro-monitorado-dates-selectdoc');
    expect(datas).toContain('seipro-monitorado-dates-setdate');
    expect(datas).toContain('seipro-monitorado-dates-countdays');
    expect(datas).toContain('seipro-monitorado-dates-newdoc');
    expect(datas).toContain('seipro-monitorado-dates-duedate');
    expect(datas).toContain('seipro-monitorado-dates-duesetdate');
    expect(datas).toContain('seipro-monitorado-dates-advanced');
    expect(datas).toContain("selectdoc: 'seipro-monitorado-dates-selectdoc'");
    expect(datas).toContain("setdate: 'seipro-monitorado-dates-setdate'");
    expect(datas).toContain("countdays: 'seipro-monitorado-dates-countdays'");
    expect(datas).toContain("newdoc: 'seipro-monitorado-dates-newdoc'");
    expect(datas).toContain("duedate: 'seipro-monitorado-dates-duedate'");
    expect(datas).toContain("duesetdate: 'seipro-monitorado-dates-duesetdate'");
    expect(datas).toContain("qsa('.' + configDateClass(opt))");

    expect(datas).not.toMatch(/class=\"configDates_selectdoc\"/);
    expect(datas).not.toMatch(/class=\"configDates_setdate\"/);
    expect(datas).not.toMatch(/class=\"configDates_countdays\"/);
    expect(datas).not.toMatch(/class=\"configDates_newdoc\"/);
    expect(datas).not.toMatch(/class=\"configDates_duedate\"/);
    expect(datas).not.toMatch(/class=\"configDates_duesetdate\"/);
    expect(datas).not.toMatch(/configDates_advanced/);
    expect(datas).not.toMatch(/\.configDates_\s*\+\s*opt/);
  });

  it('uses a seipro-prefixed class for the monitorado date editor hook', () => {
    const visualizacao = read('src/features/monitorados/visualizacao.js');
    const datas = read('src/features/monitorados/datas.js');
    const prazoRow = read('src/features/monitorados/prazo-row.js');

    expect(visualizacao).toContain('seipro-monitorado-dates-editor');
    expect(visualizacao).toContain('seipro-monitorado-dates');
    expect(visualizacao).toContain('name="monitoradoPrazoSend"');
    expect(datas).toContain('.seipro-monitorado-dates-editor');
    expect(prazoRow).toContain('.seipro-monitorado-dates-editor');

    expect(visualizacao).not.toMatch(/info_dates_monitorado_txt/);
    expect(datas).not.toMatch(/info_dates_monitorado_txt/);
    expect(prazoRow).not.toMatch(/info_dates_monitorado_txt/);
  });

  it('uses a seipro-prefixed class for the monitorado date empty-state hook', () => {
    const css = read('src/features/monitorados/monitorados.css');
    const prazoRow = read('src/features/monitorados/prazo-row.js');

    expect(css).toContain('.seipro-monitorado-dates-empty');
    expect(prazoRow).toContain('seipro-monitorado-dates-empty');
    expect(css).toContain('.info_dates_monitorado');
    expect(prazoRow).toContain('.info_dates_monitorado');

    expect(css).not.toMatch(/tdmonitorado_dates|info_dates_follow_empty/);
    expect(prazoRow).not.toMatch(/info_dates_follow_empty/);
  });

  it('uses a seipro-prefixed class for the monitorado success message hook', () => {
    const commands = read('src/features/monitorados/commands.js');

    expect(commands).toContain('seipro-monitorado-success-message');
    expect(commands).not.toMatch(/iframeSucessPro/);
  });

  it('uses a seipro-prefixed class for the monitorados scroll wrapper', () => {
    const panel = read('src/features/monitorados/panel.js');
    const css = read('src/features/monitorados/monitorados.css');

    expect(panel).toContain('seipro-monitorados-scroll');
    expect(css).toContain('.seipro-monitorados-scroll');

    expect(panel).not.toMatch(/tabelaPanelScroll/);
    expect(css).not.toMatch(/tabelaPanelScroll/);
  });
});
