import { describe, expect, it, vi } from 'vitest';
import { createAiToolExecutor } from '../../../../src/features/ai/tools/executors.ts';

describe('AI read-tool executor', () => {
    const processSnapshot = {
        process: { processNumber: '00001.000001/2026-00' },
        documents: [{
            id: '10',
            numeroSEI: '2843449',
            tipo: 'Despacho',
            nivelAcesso: 0,
            accessKnown: true,
            src: 'https://sei.example/doc/10'
        }],
        history: [{ descricao: 'Autuação' }]
    };

    it('uses the serializable process snapshot received from MAIN', async () => {
        const executor = createAiToolExecutor({ processSnapshot });
        await expect(executor.execute({ name: 'dados_processo', arguments: {} }))
            .resolves.toEqual(processSnapshot.process);
        await expect(executor.execute({ name: 'listar_documentos', arguments: {} }))
            .resolves.toEqual([expect.objectContaining({
                numero_sei: '2843449',
                tipo: 'Despacho'
            })]);
        await expect(executor.execute({ name: 'historico_processo', arguments: {} }))
            .resolves.toEqual(processSnapshot.history);
    });

    it('executes legislation search as a read-only request', async () => {
        const fetchImpl = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => [{ norma: 'Lei nº 8.112/1990' }]
        });
        const executor = createAiToolExecutor({ processSnapshot, fetchImpl });
        await expect(executor.execute({
            name: 'buscar_legislacao',
            arguments: { termo: 'Lei 8.112' }
        })).resolves.toEqual([{ norma: 'Lei nº 8.112/1990' }]);
        expect(fetchImpl).toHaveBeenCalledOnce();
    });
});
