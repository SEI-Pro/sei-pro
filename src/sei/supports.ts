/**
 * Capability helpers over SEI version checks (ADR-0003 fatia 1.8).
 *
 * Callers ask "does this SEI support X?" instead of branching on isNewSEI / isSEI_5.
 */
import { seiNamespace, seiVersion } from './namespace.js';

export type SeiSupports = {
    /** New SEI chrome: sidebar menu, renamed bars, SVG icons. */
    sidebarLayout: () => boolean;
    /** SEI 5.x editor surface (`.infra-editor__…`). */
    sei5Editor: () => boolean;
    /** Process command container `#divBotoesControleProcessos` (≥ 4.1.0). */
    processCommandsV410: () => boolean;
    /** Visualization iframe renamed to `ifrConteudoVisualizacao` (≥ 4.1.0). */
    visualizationIframeV410: () => boolean;
    /** Checkbox markup uses `.infraCheckboxInput` instead of `.infraCheckbox`. */
    modernCheckbox: () => boolean;
    /** Tree JS assets under `/infra_js/arvore/24/`. */
    modernArvoreAssets: () => boolean;
};

function flags() {
    return seiVersion().resolveVersionFlags();
}

function isNewLayout(): boolean {
    return !!flags().isNewSEI;
}

function isV410Layout(): boolean {
    const f = flags();
    return !!(f.isNewSEI && seiVersion().isAtLeast(f.version, '4.1.0'));
}

export function createSupports(): SeiSupports {
    return {
        sidebarLayout: isNewLayout,
        sei5Editor() {
            const f = flags();
            return !!seiVersion().isSEI5(f.isNewSEI, f.version);
        },
        processCommandsV410: isV410Layout,
        visualizationIframeV410: isV410Layout,
        modernCheckbox: isNewLayout,
        modernArvoreAssets: isNewLayout
    };
}

export function installSupports() {
    const api = createSupports();
    seiNamespace().supports = api;
    return api;
}
