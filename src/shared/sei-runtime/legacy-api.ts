import { aliasGlobal } from '../../core/global.js';
import { publishFeature } from '../../app/publish-feature.js';
import { refreshSeiPageSelectors } from './state.js';

type LegacyCluster = object;

/** Instala os exports funcionais de uma capacidade sem importar outros clusters. */
export function installLegacyCluster(module: LegacyCluster | null | undefined): void {
    for (const [name, value] of Object.entries(module || {})) {
        if (typeof value === 'function') aliasGlobal(name, value);
    }
}

/** Publica uma capability fatiada e deixa a decisão para a raiz de composição. */
export function defineLegacyFeature({
    id,
    nsKey,
    modules = []
}: {
    id: string;
    nsKey?: string;
    modules?: LegacyCluster | readonly LegacyCluster[];
}) {
    const clusters = Array.isArray(modules) ? modules : [modules];
    const api = Object.freeze(Object.assign({}, ...clusters));
    const install = function installLegacyFeature() {
        clusters.forEach(installLegacyCluster);
    };
    return publishFeature({ id, nsKey, api, install });
}

export function installSeiRuntimeAliases() {
    aliasGlobal('refreshSeiPageSelectors', refreshSeiPageSelectors);
}
