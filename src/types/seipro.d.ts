/**
 * Fachada global `SeiPro` — fronteira de compatibilidade com o código legado.
 *
 * ADR-0005: `SeiPro` é service locator e está em remoção; código novo recebe suas
 * dependências por injeção na raiz de composição do contexto. Este arquivo existe para
 * que os acessos legados remanescentes não virem `any` silencioso (ADR-0014, condição 4).
 *
 * A precisão aqui cresce conforme os ports são tipados. Membro que ainda não tem contrato
 * conhecido é `unknown` de propósito: obriga o call-site a estreitar, em vez de mentir com
 * `any`. Não relaxe para `any` para "resolver" um erro — tipe o port.
 */

import type { CapabilityId, FeatureContextId } from './architecture.js';

/** @deprecated Use FeatureContextId from architecture.js in code novo. */
export type SeiFeatureContextId = FeatureContextId;

/** Grau de integração real da capability na arquitetura nova. */
export type FeatureMaturity = 'declared' | 'wired' | 'exclusive';

/** Descritor em src/features/<id>/feature.ts (ADR-0004). */
export interface SeiFeatureDescriptor {
    id: CapabilityId;
    maturity: FeatureMaturity;
    contexts: readonly FeatureContextId[];
    configKey?: string | null;
    /** ADR-0007: true when there is no pages/ doc yet (must be explicit, not silent). */
    undocumented?: boolean;
    css?: readonly string[];
    permissions?: readonly string[];
    install: (deps?: unknown) => void | (() => void) | Promise<void | (() => void)>;
    api: Record<string, unknown> | object;
}

/** Contrato público de feature (ADR-0004). Consumidores cross-feature usam só `api`. */
export interface SeiProFeature {
    id: CapabilityId;
    api: Record<string, unknown>;
    install: (deps?: unknown) => void | (() => void) | Promise<void | (() => void)>;
    [extra: string]: unknown;
}

/** Leitura de configuração (ADR-0009: schema tipado em `src/config/`). */
export interface SeiProConfig {
    verifyConfigValue: (name: string) => boolean;
    checkConfigValue: (name: string) => boolean;
    getConfigValue: (name: string) => unknown;
    /** Typed schema reader — unknown key throws in DEV, safe default in prod. */
    getConfig: (name: string) => boolean | string | number;
    readConfigBasePro?: () => unknown;
    isDefaultEnabledConfigValue?: (name: string) => boolean;
    [extra: string]: unknown;
}

/** Adapter de versão do SEI (ADR-0003). */
export interface SeiProSeiAdapter {
    isNewSEI: () => boolean;
    isSEI5: () => boolean;
    atLeast: (target: string) => boolean;
    pick: <T>(novo: T, legado: T) => T;
    selectors: (isNewSEI: boolean, version?: string) => Record<string, string>;
    flags: () => { isNewSEI?: boolean; version?: string };
    [extra: string]: unknown;
}

/** Seletores nomeados por intenção (ADR-0003). */
export interface SeiProSeiSelectors {
    resolve: (isNewSEI: boolean, version?: string | false | null) => Record<string, string>;
    current: () => Record<string, string>;
    [extra: string]: unknown;
}

/** Capabilities em vez de ramificação de versão (ADR-0003). */
export interface SeiProSeiSupports {
    sidebarLayout: () => boolean;
    sei5Editor: () => boolean;
    processCommandsV410: () => boolean;
    visualizationIframeV410: () => boolean;
    modernCheckbox: () => boolean;
    modernArvoreAssets: () => boolean;
    [extra: string]: unknown;
}

export interface SeiProSeiVersion {
    isAtLeast: (version: string | false | null | undefined, target: string) => boolean;
    isSEI5: (isNewSEI: unknown, version: unknown) => boolean;
    resolveVersionFlags: () => {
        isNewSEI?: boolean;
        isSEI_5?: boolean;
        version?: string | false | null;
    };
    [extra: string]: unknown;
}

export interface SeiProNamespace {
    core: { config?: SeiProConfig; [key: string]: unknown };
    sei: {
        adapter?: SeiProSeiAdapter;
        selectors?: SeiProSeiSelectors;
        supports?: SeiProSeiSupports;
        version?: SeiProSeiVersion;
        pages?: { identifyPage: (url: string) => unknown; [key: string]: unknown };
        parse?: {
            lista: (root: Document | Element) => unknown;
            arvore: (root: Document | Element) => unknown;
            documento: (root: Document | Element) => unknown;
            [key: string]: unknown;
        };
        urls?: Record<string, unknown>;
        tooltip?: Record<string, unknown>;
        [key: string]: unknown;
    };
    platform: Record<string, unknown>;
    features: Record<string, SeiProFeature | undefined>;
    state: Record<string, unknown>;
    [key: string]: unknown;
}

declare global {
    interface Window {
        SeiPro?: SeiProNamespace;
    }
    // eslint-disable-next-line no-var
    var SeiPro: SeiProNamespace | undefined;
}

export {};
