// @vitest-environment jsdom

import { describe, expect, it, vi } from 'vitest';
import {
    createDocumentFetchState,
    gatherProcessContext,
    rankDocumentsForContext,
    readCurrentDocument,
    readProcessDocument
} from '../../../../src/features/ai/io/context.ts';
import { assemblePrompt } from '../../../../src/features/ai/domain/prompt.ts';

describe('AI document context IO', () => {
    const restricted = {
        id: '10',
        numeroSEI: '2843449',
        tipo: 'Request',
        nivelAcesso: 1,
        src: 'https://sei.example/controlador.php?acao=documento_visualizar&id_documento=10'
    };

    it('does not fetch a restricted document without an explicit confirmation callback', async () => {
        const fetchImpl = vi.fn();
        await expect(readProcessDocument(restricted, { fetchImpl })).rejects.toThrow('necessária confirmação');
        expect(fetchImpl).not.toHaveBeenCalled();
    });

    it('does not fetch when the user declines access', async () => {
        const fetchImpl = vi.fn();
        await expect(readProcessDocument(restricted, {
            fetchImpl,
            confirmRestricted: vi.fn().mockResolvedValue(false)
        })).rejects.toThrow('não foi autorizado');
        expect(fetchImpl).not.toHaveBeenCalled();
    });

    it('fetches and labels the body after confirmation', async () => {
        const fetchImpl = vi.fn().mockResolvedValue({
            ok: true,
            text: async () => '<main><p>Authorized content</p></main>'
        });
        const result = await readProcessDocument(restricted, {
            profile: { id: 'p1', providerId: 'ollama', model: 'local' },
            fetchImpl,
            confirmRestricted: vi.fn().mockResolvedValue(true)
        });
        expect(fetchImpl).toHaveBeenCalledOnce();
        expect(result.text).toContain('EXPLICITLY AUTHORIZED');
        expect(result.text).toContain('Authorized content');
    });

    it('gates the current editor document when access is restricted or unknown', async () => {
        const confirmRestricted = vi.fn().mockResolvedValue(false);
        const result = await readCurrentDocument({
            profile: { id: 'p1', providerId: 'openai', model: 'm' },
            confirmRestricted,
            currentDocumentProvider: async () => ({
                html: '<p>Minuta sigilosa</p>',
                documentId: '99',
                accessKnown: false
            })
        });
        expect(result).toBeNull();
        expect(confirmRestricted).toHaveBeenCalledOnce();
    });

    it('shares one hard document-fetch budget and caches repeated reads', async () => {
        const fetchState = createDocumentFetchState(1);
        const fetchImpl = vi.fn().mockResolvedValue({
            ok: true,
            text: async () => '<main><p>Conteúdo</p></main>'
        });
        const publicDocument = {
            id: '20',
            numeroSEI: '200',
            nivelAcesso: 0,
            accessKnown: true,
            src: 'https://sei.example/doc/20'
        };
        await readProcessDocument(publicDocument, { fetchImpl, fetchState });
        await readProcessDocument(publicDocument, { fetchImpl, fetchState });
        expect(fetchImpl).toHaveBeenCalledOnce();
        await expect(readProcessDocument({
            ...publicDocument,
            id: '21',
            src: 'https://sei.example/doc/21'
        }, { fetchImpl, fetchState })).rejects.toThrow('Limite');
    });

    it('ranks explicitly named SEI documents before recency and list order', () => {
        const ranked = rankDocumentsForContext([
            { id: '1', numeroSEI: '111', data: '30/07/2026' },
            { id: '2', numeroSEI: '222', data: '01/01/2020' },
            { id: '3', numeroSEI: '333', data: '29/07/2026' }
        ], 'Considere especialmente o documento 222');
        expect(ranked.map((item) => item.id)).toEqual(['2', '1', '3']);
    });

    it('never places a declined current document in the provider prompt', async () => {
        const context = await gatherProcessContext({
            instruction: 'Redija um despacho',
            profile: { id: 'p1', providerId: 'openai', model: 'm' },
            maxDocs: 0,
            includeBodies: false,
            processSnapshot: { process: {}, documents: [], history: [] },
            currentDocumentProvider: async () => ({
                html: '<p>SEGREDO QUE NÃO PODE SAIR</p>',
                accessKnown: false,
                documentId: '99'
            }),
            confirmRestricted: vi.fn().mockResolvedValue(false)
        });
        const prompt = assemblePrompt({ instruction: 'Redija um despacho', ...context });
        expect(prompt).not.toContain('SEGREDO QUE NÃO PODE SAIR');
    });

    it('stops before reading process documents when the request is cancelled', async () => {
        const controller = new AbortController();
        controller.abort();
        const fetchImpl = vi.fn();

        await expect(gatherProcessContext({
            instruction: 'Redija um despacho',
            profile: { id: 'p1', providerId: 'openai', model: 'm' },
            processSnapshot: { process: {}, documents: [], history: [] },
            fetchImpl,
            signal: controller.signal
        })).rejects.toMatchObject({ name: 'AbortError' });
        expect(fetchImpl).not.toHaveBeenCalled();
    });
});
