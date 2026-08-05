import { describe, expect, it } from 'vitest';
import {
    assemblePrompt,
    documentLabel,
    preferredDocumentIds
} from '../../../../src/features/ai/domain/prompt.js';

describe('AI prompt assembly', () => {
    const documents = [
        {
            id: '10',
            numeroSEI: '2843449',
            tipo: 'Request',
            data: '2026-07-01',
            unidade: 'UNIT-A',
            nivelAcesso: 0
        },
        {
            id: '11',
            numeroSEI: '2843550',
            tipo: 'Order',
            nivelAcesso: 1
        }
    ];

    it('labels every document chunk with stable SEI metadata', () => {
        expect(documentLabel(documents[0])).toContain('SEI: 2843449');
        expect(documentLabel(documents[0])).toContain('Type: Request');
        expect(documentLabel(documents[0])).toContain('Unit: UNIT-A');
    });

    it('separates authorized content from restricted metadata', () => {
        const prompt = assemblePrompt({
            instruction: 'Draft an order.',
            process: { processNumber: '08650.000001/2026-00' },
            documents,
            chunks: [{ id: '10', text: '[SEI: 2843449]\nAuthorized body' }],
            restrictedDocuments: [documents[1]]
        });

        expect(prompt).toContain('AUTHORIZED DOCUMENT CONTENT');
        expect(prompt).toContain('Authorized body');
        expect(prompt).toContain('RESTRICTED CONTENT NOTICE');
        expect(prompt).toContain('Call ler_documento');
    });

    it('prioritizes SEI numbers named in the instruction', () => {
        expect(preferredDocumentIds('Use document 2843550.', documents)).toEqual(['11']);
    });
});
