import * as domain from './domain.js';
import * as io from './io.js';
import * as helpers from './page-helpers.js';
import * as boot from './boot.js';
import { installSeiFunctionsState, refreshSeiPageSelectors } from './state.js';
import { installLegacyCluster, installSeiRuntimeAliases } from './legacy-api.js';

/** Instala somente o runtime compartilhado, sem instalar nenhuma capability. */
export function installSeiRuntime() {
    installSeiFunctionsState();
    [domain, io, helpers].forEach(installLegacyCluster);
    installSeiRuntimeAliases();
}

/** Finaliza a composição depois dos clusters: plugins jQuery e lifecycle de página. */
export function startSeiRuntime() {
    installLegacyCluster(boot);
    boot.fnJqueryPro();
    boot.loadScriptPro();
}

export { installSeiFunctionsState, refreshSeiPageSelectors };
