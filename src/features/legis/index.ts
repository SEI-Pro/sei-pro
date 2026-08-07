// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
import { getSeiPro } from '../../core/global.js';
import * as domain from './domain.js';
import { searchLegislation } from './io.js';
import { installLegisLegacyApi } from './legacy-api.js';
import { configureLegisView } from './view.js';

const root = getSeiPro();
root.features.legis = {
    ...domain,
    searchLegislation
};

configureLegisView({ search: searchLegislation });
installLegisLegacyApi();
