/**
 * Allowlists for ADR-0007 capability coverage (schema ↔ descriptors).
 * Documented in docs/capabilities-map.md exceptions anchor — shrink only.
 */
export const SCHEMA_FEATURE_WITHOUT_DESCRIPTOR = new Set([
    'telemetry' // bugReportOptIn — privacy/telemetry feature not foldered yet
]);

/**
 * Descriptor ids that intentionally omit configKey (null) or share a parent key
 * during strangler / multi-context glue.
 */
export const NULL_CONFIGKEY_ALLOWED = new Set([
    'ai',
    'arvore',
    'atividades-afastamentos',
    'atividades-avaliacoes',
    'atividades-registro',
    'editor',
    'external-config',
    'legis',
    'lista-processos',
    'acoes-capa',
    'dialogs-host',
    'editor-captcha',
    'interessados-forms',
    'todas-paginas',
    'visualizacao'
]);

/**
 * Chaves ainda compartilhadas durante um strangler. Cada exceção precisa ter
 * dono atual e futuro explícitos; removê-la é parte da fatia de extração.
 */
export const CONFIG_KEY_FEATURE_OWNER_OVERRIDES = new Map([
    ['gerenciaratividades', new Set(['atividades', 'atividades-config'])],
    ['gerenciarprescricoes', new Set(['atividades', 'prescricoes'])],
    ['filtrarpaginapelapesquisarapida', new Set(['lista-processos', 'quick-filter', 'quick-highlight'])],
    ['notificacaonovoprocesso', new Set(['lista-processos', 'notificacoes-processo'])]
]);

/** FR-006 / coverage-gate C8 — gap ids that MUST appear in the map gaps anchor. */
export const FR006_REQUIRED_GAP_IDS = [
    'gap-atividades-pages',
    'gap-atividades-shared-key',
    'gap-prescricoes-schema-owner',
    'gap-telemetry-folder',
    'gap-transitional-ownership',
    'gap-strangler-shared-keys'
];
