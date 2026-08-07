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

/** Contrato público de feature (ADR-0004). Consumidores cross-feature usam só `api`. */
export interface SeiProFeature {
    id: string;
    api: Record<string, unknown>;
    install: (deps?: unknown) => void | (() => void);
    [extra: string]: unknown;
}

/** Leitura de configuração (ADR-0009 substitui isto por schema tipado). */
export interface SeiProConfig {
    verifyConfigValue: (name: string) => boolean;
    checkConfigValue: (name: string) => boolean;
    getConfigValue: (name: string) => unknown;
    [extra: string]: unknown;
}

/** Adapter de versão do SEI (ADR-0003 expande isto no ACL). */
export interface SeiProSeiAdapter {
    isNewSEI: () => boolean;
    isSEI5: () => boolean;
    atLeast: (target: string) => boolean;
    pick: <T>(novo: T, legado: T) => T;
    selectors: (isNewSEI: boolean, version?: string) => Record<string, string>;
    flags: () => { isNewSEI?: boolean; version?: string };
    [extra: string]: unknown;
}

export interface SeiProNamespace {
    core: { config?: SeiProConfig; [key: string]: unknown };
    sei: { adapter?: SeiProSeiAdapter; [key: string]: unknown };
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
