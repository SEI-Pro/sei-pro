// @ts-nocheck — fatia legada isolada; a tipagem entra após a caracterização.
import * as options from './config-options.js';
import * as panel from './config-panel.js';
import * as table from './config-table.js';
import * as domain from './config-domain.js';
import * as queries from './config-queries.js';
import * as useCases from './config-use-cases.js';
import { defineLegacyFeature } from '../../shared/sei-runtime/legacy-api.js';

export const atividadesConfig = defineLegacyFeature({
    id: 'atividades-config',
    nsKey: 'atividadesConfig',
    modules: [options, panel, table, domain, queries, useCases]
});
export const installAtividadesConfigFeature = atividadesConfig.install;
export const {
    openModalConfigPanel,
    getTabsConfigPanel,
    getTabConfig,
    addConfigItem,
    updateConfigServer,
    editConfigOptions,
    changeConfigOptions,
    checkDatesLoopArray,
    checkDatesBetweenArray,
    configPessoal,
    saveConfigPersonalUser,
    saveOptionConfigItem,
    createConfigUseCases
} = atividadesConfig.api;
