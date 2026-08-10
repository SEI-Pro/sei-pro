/**
 * Phase 5.7 / ADR-0007 — schema ↔ feature descriptors close on each other.
 *
 * - Every descriptor configKey (string) exists in CONFIG_SCHEMA.
 * - Every schema entry with a `feature` field names a folder that has a descriptor
 *   (allowlisted gaps documented below).
 */
import { describe, expect, it } from 'vitest';
import { CONFIG_SCHEMA } from '../../src/config/schema.ts';
import { scanFeatureDescriptors } from '../../scripts/lib/scan-feature-descriptors.mjs';

/**
 * Schema `feature` values without a src/features/<id>/ folder yet.
 * Shrink this list as dedicated features appear — never grow without ADR note.
 */
const SCHEMA_FEATURE_WITHOUT_DESCRIPTOR = new Set([
    'telemetry' // bugReportOptIn — privacy/telemetry feature not foldered yet
]);

/**
 * Descriptor ids that intentionally omit configKey (null) or share a parent key
 * during strangler / multi-context glue. Documented in docs/capabilities-map.md.
 */
const NULL_CONFIGKEY_ALLOWED = new Set([
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
const CONFIG_KEY_FEATURE_OWNER_OVERRIDES = new Map([
    ['gerenciaratividades', new Set(['atividades', 'atividades-config'])],
    ['gerenciarprescricoes', new Set(['atividades', 'prescricoes'])],
    ['filtrarpaginapelapesquisarapida', new Set(['lista-processos', 'quick-filter', 'quick-highlight'])],
    ['notificacaonovoprocesso', new Set(['lista-processos', 'notificacoes-processo'])]
]);

describe('capability coverage (ADR-0007 / phase 5.7)', () => {
    const descriptors = scanFeatureDescriptors();
    const schemaKeys = new Set(Object.keys(CONFIG_SCHEMA));
    const descriptorIds = new Set(descriptors.map((d) => d.id));

    it('every descriptor configKey exists in CONFIG_SCHEMA', () => {
        const missing = [];
        for (const d of descriptors) {
            if (d.configKey === null || d.configKey === undefined) {
                expect(
                    NULL_CONFIGKEY_ALLOWED.has(d.id),
                    `${d.id} has null configKey but is not in NULL_CONFIGKEY_ALLOWED`
                ).toBe(true);
                continue;
            }
            if (!schemaKeys.has(d.configKey)) {
                missing.push(`${d.id} → ${d.configKey}`);
            }
        }
        expect(missing, `unknown configKeys:\n${missing.join('\n')}`).toEqual([]);
    });

    it('every schema feature field maps to a feature descriptor (allowlist gaps)', () => {
        const missing = [];
        for (const [key, entry] of Object.entries(CONFIG_SCHEMA)) {
            const featureId = entry.feature;
            if (!featureId) continue;
            if (SCHEMA_FEATURE_WITHOUT_DESCRIPTOR.has(featureId)) continue;
            if (!descriptorIds.has(featureId)) {
                missing.push(`${key} → feature:${featureId}`);
            }
        }
        expect(
            missing,
            `schema feature without descriptor:\n${missing.join('\n')}`
        ).toEqual([]);
    });

    it('descriptor configKey ownership agrees with the schema or an explicit strangler override', () => {
        const disagreements = [];
        for (const d of descriptors) {
            if (typeof d.configKey !== 'string') continue;
            const owner = CONFIG_SCHEMA[d.configKey]?.feature;
            if (!owner || owner === d.id) continue;
            const allowedOwners = CONFIG_KEY_FEATURE_OWNER_OVERRIDES.get(d.configKey);
            if (!allowedOwners || !allowedOwners.has(owner) || !allowedOwners.has(d.id)) {
                disagreements.push(`${d.configKey}: schema=${owner}, descriptor=${d.id}`);
            }
        }
        expect(disagreements, `unexplained config ownership:\n${disagreements.join('\n')}`).toEqual([]);
    });

    it('allowlisted schema gaps stay documented and small', () => {
        expect([...SCHEMA_FEATURE_WITHOUT_DESCRIPTOR].sort()).toEqual(['telemetry']);
    });

    it('strangler ownership overrides stay documented and small', () => {
        expect([...CONFIG_KEY_FEATURE_OWNER_OVERRIDES.keys()]).toEqual([
            'gerenciaratividades',
            'gerenciarprescricoes',
        'filtrarpaginapelapesquisarapida',
        'notificacaonovoprocesso'
        ]);
    });
});
