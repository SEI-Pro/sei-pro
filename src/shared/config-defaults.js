/**
 * Shared default-enabled config keys.
 *
 * Used by both the options page (UI initial checked state) and core/config.js
 * (`checkConfigValue` / `isDefaultEnabledConfigValue`). Keep this list as the
 * single source of truth — a mismatch makes the options UI look "on" while
 * content scripts treat the feature as off (or the reverse).
 */
export const DEFAULT_ENABLED_CONFIG_OPTIONS = [
    'filtrarpaginapelapesquisarapida',
    'gerenciarmonitorados',
    'marcar_naolido',
    'uploaddocsexternos',
    'infoarvore',
    'mostraranotacaocontrole',
    'autopreenchersenha'
];

export function isDefaultEnabledConfigOption(name) {
    return DEFAULT_ENABLED_CONFIG_OPTIONS.indexOf(String(name || '')) !== -1;
}
