/**
 * 003-capability-inventory-gaps — map anchors ↔ sources (C0–C10).
 * @see specs/003-capability-inventory-gaps/contracts/coverage-gate.md
 */
import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { parseCapabilitiesMap, REPO_ROOT } from '../../scripts/lib/parse-capabilities-map.mjs';
import { scanFeatureDescriptors } from '../../scripts/lib/scan-feature-descriptors.mjs';
import {
    SCHEMA_FEATURE_WITHOUT_DESCRIPTOR,
    NULL_CONFIGKEY_ALLOWED,
    CONFIG_KEY_FEATURE_OWNER_OVERRIDES,
    FR006_REQUIRED_GAP_IDS
} from '../../scripts/lib/capability-coverage-allowlists.mjs';

function sortedUnique(ids) {
    return [...new Set(ids)].sort();
}

function setDiff(a, b) {
    const bs = new Set(b);
    return a.filter((x) => !bs.has(x));
}

describe('capabilities-map inventory (003)', () => {
    const parsed = parseCapabilitiesMap();
    const { inventory, gaps, exceptions, prose } = parsed;
    const descriptors = scanFeatureDescriptors();
    const descriptorIds = new Set(descriptors.map((d) => d.id).filter(Boolean));
    const inventoryById = new Map(inventory.entries.map((e) => [e.id, e]));

    it('C0: anchors parse with required shapes', () => {
        expect(Array.isArray(inventory.entries)).toBe(true);
        expect(Array.isArray(gaps.gaps)).toBe(true);
        expect(Array.isArray(exceptions.exceptions)).toBe(true);
        expect(inventory.entries.length).toBeGreaterThan(0);
    });

    it('C1: every descriptor id appears in inventory', () => {
        const missing = [...descriptorIds].filter((id) => !inventoryById.has(id));
        expect(missing, `descriptors missing from map:\n${missing.join('\n')}`).toEqual([]);
    });

    it('C2: no phantom descriptorId in inventory', () => {
        const phantoms = inventory.entries.filter(
            (e) => e.descriptorId != null && !descriptorIds.has(e.descriptorId)
        );
        expect(
            phantoms.map((e) => `${e.id}→${e.descriptorId}`),
            'phantom descriptorIds'
        ).toEqual([]);
    });

    it('C5: every pages/*.md is referenced or listed on an orphan-doc gap', () => {
        const pagesDir = path.join(REPO_ROOT, 'pages');
        const allPages = fs
            .readdirSync(pagesDir)
            .filter((f) => f.endsWith('.md'))
            .map((f) => `pages/${f}`);
        const referenced = new Set();
        for (const e of inventory.entries) {
            for (const p of e.pages || []) referenced.add(p);
        }
        const orphanGap = gaps.gaps.find((g) => g.id === 'gap-orphan-pages' || g.type === 'documentation');
        const orphanEvidence = new Set(
            gaps.gaps
                .filter((g) => g.type === 'documentation' && g.status === 'open')
                .flatMap((g) => (Array.isArray(g.evidence) ? g.evidence : []))
                .filter((x) => typeof x === 'string' && x.startsWith('pages/'))
        );
        const missing = allPages.filter((p) => !referenced.has(p) && !orphanEvidence.has(p));
        expect(missing, `orphan pages:\n${missing.join('\n')}`).toEqual([]);
        void orphanGap;
    });

    it('C6: capability entries have pages[] or undocumented=true', () => {
        const bad = inventory.entries.filter((e) => {
            if (e.kind !== 'capability') return false;
            const pages = e.pages || [];
            return pages.length === 0 && e.undocumented !== true;
        });
        expect(
            bad.map((e) => e.id),
            'capabilities without pages or undocumented'
        ).toEqual([]);
    });

    it('C7: code allowlists appear in exceptions anchor linked to gap or justification', () => {
        const byKey = new Map(exceptions.exceptions.map((ex) => [`${ex.kind}:${ex.keyOrFeatureId}`, ex]));
        const missing = [];
        for (const id of SCHEMA_FEATURE_WITHOUT_DESCRIPTOR) {
            const ex = byKey.get(`schema_feature_without_descriptor:${id}`);
            if (!ex || (!ex.gapId && !ex.justification)) missing.push(`schema_feature:${id}`);
        }
        for (const id of NULL_CONFIGKEY_ALLOWED) {
            const ex = byKey.get(`null_config_key:${id}`);
            if (!ex || (!ex.gapId && !ex.justification)) missing.push(`null_config:${id}`);
        }
        for (const key of CONFIG_KEY_FEATURE_OWNER_OVERRIDES.keys()) {
            const ex = byKey.get(`shared_config_key:${key}`);
            if (!ex || (!ex.gapId && !ex.justification)) missing.push(`shared:${key}`);
        }
        expect(missing, `allowlist without exception:\n${missing.join('\n')}`).toEqual([]);
    });

    it('C8: FR-006 required gap ids are present', () => {
        const ids = new Set(gaps.gaps.map((g) => g.id));
        const missing = FR006_REQUIRED_GAP_IDS.filter((id) => !ids.has(id));
        expect(missing, `missing FR-006 gaps:\n${missing.join('\n')}`).toEqual([]);
    });

    it('C9: maturity gaps satisfy FR-013', () => {
        const bad = [];
        for (const g of gaps.gaps) {
            if (g.type !== 'maturity') continue;
            const related = g.relatedCapabilityIds || [];
            if (related.length === 0) {
                bad.push(`${g.id}: no relatedCapabilityIds`);
                continue;
            }
            for (const id of related) {
                const entry = inventoryById.get(id);
                if (!entry) {
                    bad.push(`${g.id}: unknown capability ${id}`);
                    continue;
                }
                if (entry.maturity === 'exclusive') {
                    bad.push(`${g.id}: ${id} is exclusive`);
                    continue;
                }
                const evidence = (g.evidence || []).join(' ').toLowerCase();
                const hasLegacy =
                    /legacy|paralelo|residual|shared|null|strangler|wrapper/.test(evidence) ||
                    entry.configKeyMode === 'shared' ||
                    entry.configKeyMode === 'null_justified' ||
                    entry.kind === 'residual' ||
                    (g.relatedCapabilityIds || []).includes('atividades');
                if (!hasLegacy) {
                    bad.push(`${g.id}: ${id} lacks FR-013 evidence`);
                }
            }
        }
        expect(bad, `illegal maturity gaps:\n${bad.join('\n')}`).toEqual([]);
    });

    it('inventory ids are unique', () => {
        const ids = inventory.entries.map((e) => e.id);
        expect(new Set(ids).size).toBe(ids.length);
    });

    it('open gaps use P1–P4 priorities', () => {
        const bad = gaps.gaps.filter((g) => !['P1', 'P2', 'P3', 'P4'].includes(g.priority));
        expect(bad.map((g) => g.id)).toEqual([]);
    });

    it('C10: prose tables match YAML anchors 1:1 (Inventory / Residuals / Gap register)', () => {
        const yamlCapabilities = sortedUnique(
            inventory.entries.filter((e) => e.kind === 'capability').map((e) => e.id)
        );
        const yamlResiduals = sortedUnique(
            inventory.entries
                .filter((e) => e.kind === 'residual' || e.kind === 'non-capability')
                .map((e) => e.id)
        );
        const yamlGaps = sortedUnique(gaps.gaps.map((g) => g.id));
        const proseCapabilities = sortedUnique(prose.capabilityIds);
        const proseResiduals = sortedUnique(prose.residualIds);
        const proseGaps = sortedUnique(prose.gapIds);

        expect(
            {
                proseOnlyCapabilities: setDiff(proseCapabilities, yamlCapabilities),
                yamlOnlyCapabilities: setDiff(yamlCapabilities, proseCapabilities),
                proseOnlyResiduals: setDiff(proseResiduals, yamlResiduals),
                yamlOnlyResiduals: setDiff(yamlResiduals, proseResiduals),
                proseOnlyGaps: setDiff(proseGaps, yamlGaps),
                yamlOnlyGaps: setDiff(yamlGaps, proseGaps)
            },
            'C10 prose↔YAML mismatch'
        ).toEqual({
            proseOnlyCapabilities: [],
            yamlOnlyCapabilities: [],
            proseOnlyResiduals: [],
            yamlOnlyResiduals: [],
            proseOnlyGaps: [],
            yamlOnlyGaps: []
        });
    });
});
