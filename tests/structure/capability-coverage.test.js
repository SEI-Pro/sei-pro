/**
 * Phase 5.7 / ADR-0007 — schema ↔ feature descriptors close on each other.
 * Allowlists live in scripts/lib/capability-coverage-allowlists.mjs (map exceptions).
 */
import { describe, expect, it } from 'vitest';
import { CONFIG_SCHEMA } from '../../src/config/schema.ts';
import { scanFeatureDescriptors } from '../../scripts/lib/scan-feature-descriptors.mjs';
import {
    SCHEMA_FEATURE_WITHOUT_DESCRIPTOR,
    NULL_CONFIGKEY_ALLOWED,
    CONFIG_KEY_FEATURE_OWNER_OVERRIDES
} from '../../scripts/lib/capability-coverage-allowlists.mjs';
import { parseCapabilitiesMap } from '../../scripts/lib/parse-capabilities-map.mjs';

describe('capability coverage (ADR-0007 / phase 5.7)', () => {
    const descriptors = scanFeatureDescriptors();
    const schemaKeys = new Set(Object.keys(CONFIG_SCHEMA));
    const descriptorIds = new Set(descriptors.map((d) => d.id));
    const { inventory } = parseCapabilitiesMap();

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

    it('C3: every schema key is claimed by inventory ownership, exception, or typed gap', () => {
        const claimedKeys = new Set();
        for (const e of inventory.entries) {
            if (typeof e.configKey === 'string') claimedKeys.add(e.configKey);
        }
        const { exceptions, gaps } = parseCapabilitiesMap();
        for (const ex of exceptions.exceptions) {
            if (ex.kind === 'shared_config_key' || ex.kind === 'schema_feature_without_descriptor') {
                // schema_feature_without_descriptor is feature id; shared is key
                if (ex.kind === 'shared_config_key') claimedKeys.add(ex.keyOrFeatureId);
            }
        }
        // Keys whose schema.feature is telemetry (no folder) must appear in gap evidence or exceptions
        const orphan = [];
        for (const key of schemaKeys) {
            if (claimedKeys.has(key)) continue;
            const feature = CONFIG_SCHEMA[key]?.feature;
            if (feature && SCHEMA_FEATURE_WITHOUT_DESCRIPTOR.has(feature)) {
                const hasGap = gaps.gaps.some(
                    (g) =>
                        g.id === 'gap-telemetry-folder' ||
                        (Array.isArray(g.evidence) && g.evidence.includes(key))
                );
                if (hasGap) continue;
            }
            // Keys owned by a feature that has null configKey on descriptor but schema points to feature —
            // still "claimed" if some inventory entry lists that schema feature as descriptor and notes the key via shared mode
            // Fallback: if schema feature has an inventory entry, accept as claimed through ownership story
            if (feature && inventory.entries.some((e) => e.descriptorId === feature || e.id === feature)) {
                continue;
            }
            orphan.push(`${key} (feature=${feature || 'none'})`);
        }
        expect(orphan, `unclaimed schema keys:\n${orphan.join('\n')}`).toEqual([]);
    });
});
