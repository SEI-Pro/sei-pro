import type {
    EXECUTION_CONTEXT_IDS,
    PAGE_CONTEXT_IDS,
    CONTENT_SCOPE_IDS,
    FEATURE_CONTEXT_IDS
} from './architecture-contexts.js';

/** Fronteira dura do MV3: determina ciclo de vida e APIs disponíveis. */
export type ExecutionContextId = (typeof EXECUTION_CONTEXT_IDS)[number];

/** Página ou superfície funcional do SEI. */
export type PageContextId = (typeof PAGE_CONTEXT_IDS)[number];

/** Escopo de injeção amplo, transitório, que não é uma página primária. */
export type ContentScopeId = (typeof CONTENT_SCOPE_IDS)[number];

/** Valor permitido no campo `contexts` de um descritor de feature. */
export type FeatureContextId = (typeof FEATURE_CONTEXT_IDS)[number];

/** Identificador estável de uma capacidade de produto. */
export type CapabilityId = string;

/** `unknown` é usado somente pela identificação de URL sem correspondência. */
export type IdentifiedPageContext = PageContextId | ContentScopeId | 'unknown';
