/**
 * ADR-0004: every folder under src/features/ has a valid feature.ts descriptor.
 */
import { describe, expect, it } from 'vitest';
import {
    scanFeatureDescriptors,
    descriptorContractOk,
    KNOWN_CONTEXT_IDS,
    listFeatureDirs
} from '../../scripts/lib/scan-feature-descriptors.mjs';

describe('feature descriptors (ADR-0004)', () => {
    const descriptors = scanFeatureDescriptors();
    const dirs = listFeatureDirs();

    it('counts 37 feature folders', () => {
        expect(dirs).toHaveLength(37);
        expect(descriptors).toHaveLength(37);
    });

    it('every feature folder has feature.ts', () => {
        const missing = descriptors.filter((d) => d.missing).map((d) => d.dir);
        expect(missing, `missing feature.ts:\n${missing.join('\n')}`).toEqual([]);
    });

    it('every descriptor satisfies the contract', () => {
        const bad = descriptors.filter((d) => !descriptorContractOk(d));
        expect(
            bad.map((d) => `${d.dir}: id=${d.id} contexts=${JSON.stringify(d.contexts)}`),
            'invalid descriptors'
        ).toEqual([]);
    });

    it('ids are unique and match folder names', () => {
        const ids = descriptors.map((d) => d.id);
        expect(new Set(ids).size).toBe(ids.length);
        for (const d of descriptors) {
            expect(d.id).toBe(d.dir);
        }
    });

    it('declares architectural maturity explicitly', () => {
        const allowed = new Set(['declared', 'wired', 'exclusive']);
        for (const d of descriptors) {
            expect(allowed.has(d.maturity), `${d.dir} missing maturity`).toBe(true);
        }
    });

    it('contexts are drawn from the known set', () => {
        const known = new Set(KNOWN_CONTEXT_IDS);
        for (const d of descriptors) {
            for (const ctx of d.contexts) {
                expect(known.has(ctx), `${d.dir} unknown context ${ctx}`).toBe(true);
            }
        }
    });
});
