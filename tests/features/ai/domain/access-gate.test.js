import { describe, expect, it } from 'vitest';
import {
    createAccessAuditRecord,
    normalizeAccessLevel,
    partitionDocumentsByAccess,
    requiresDocumentConsent,
    restrictedContentNotice
} from '../../../../src/features/ai/domain/access-gate.js';

describe('AI document access gate', () => {
    it('requires consent for access levels 1 and 2', () => {
        expect(requiresDocumentConsent({ nivelAcesso: 0 })).toBe(false);
        expect(requiresDocumentConsent({ nivelAcesso: 1 })).toBe(true);
        expect(requiresDocumentConsent({ nivelAcesso: '2' })).toBe(true);
        expect(requiresDocumentConsent({ nivelAcesso: null, accessKnown: false })).toBe(true);
        expect(normalizeAccessLevel('Documento Restrito')).toBe(1);
        expect(normalizeAccessLevel('Documento Sigiloso')).toBe(2);
    });

    it('keeps restricted documents out of the public context partition', () => {
        const result = partitionDocumentsByAccess([
            { id: 'public', nivelAcesso: 0 },
            { id: 'restricted', nivelAcesso: 1 }
        ]);
        expect(result.public.map((doc) => doc.id)).toEqual(['public']);
        expect(result.restricted.map((doc) => doc.id)).toEqual(['restricted']);
    });

    it('labels authorized content and creates a local audit record', () => {
        const document = { numeroSEI: '123', nivelAcesso: 2, hipoteseLegal: 'Legal basis' };
        const profile = { id: 'p1', providerId: 'anthropic', model: 'claude' };
        expect(restrictedContentNotice(document)).toContain('EXPLICITLY AUTHORIZED');
        expect(createAccessAuditRecord(
            document,
            profile,
            new Date('2026-07-29T12:00:00Z')
        )).toEqual(expect.objectContaining({
            profileId: 'p1',
            documentNumber: '123',
            accessLevel: 2
        }));
    });
});
