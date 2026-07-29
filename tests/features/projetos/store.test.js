import { describe, expect, it, beforeEach, afterEach } from 'vitest';

const fakeStorage = () => {
    const d = {};
    return {
        getItem: (k) => (k in d ? d[k] : null),
        setItem: (k, v) => { d[k] = String(v); },
        removeItem: (k) => { delete d[k]; }
    };
};

const KEY = 'configDataProjetosPro';

describe('projetos/store', () => {
    let storeMod;

    beforeEach(async () => {
        globalThis.localStorage = fakeStorage();
        // Fresh module instance so storeState cache resets
        storeMod = await import('../../../src/features/projetos/store.js?' + Date.now());
        storeMod.replaceProjetos([]);
        globalThis.localStorage.removeItem(KEY);
        storeMod = await import('../../../src/features/projetos/store.js?' + (Date.now() + 1));
    });

    afterEach(() => {
        try { globalThis.localStorage.removeItem(KEY); } catch (e) { /* noop */ }
    });

    it('seeds demo data once', () => {
        const store = storeMod.ensureDemoSeed(true);
        expect(store.projetos.length).toBeGreaterThanOrEqual(2);
        expect(store.seeded).toBe(true);
    });

    it('dispatches save/edit/delete projeto and etapa', () => {
        storeMod.ensureDemoSeed(true);
        const created = storeMod.dispatchProjetoAction({
            action: 'save_projeto',
            nome_projeto: 'Novo',
            id_tipo_projeto: 1,
            nome_tipo_projeto: 'Interno'
        });
        expect(created.status).toBe(1);
        const id = created.id_projeto;

        const etapa = storeMod.dispatchProjetoAction({
            action: 'save_etapa',
            id_projeto: id,
            nome_etapa: 'Etapa 1',
            data_inicio_programado: '2026-07-01 00:00:00',
            data_fim_programado: '2026-07-05 00:00:00'
        });
        expect(etapa.status).toBe(1);

        const archived = storeMod.dispatchProjetoAction({ action: 'archive_projeto', id_projeto: id });
        expect(archived.return_row[0].ativo).toBe(false);

        const del = storeMod.dispatchProjetoAction({ action: 'delete_projeto', id_projeto: id });
        expect(del.status).toBe(1);
        expect(storeMod.getStoreProjetos().projetos.find((p) => p.id_projeto === id)).toBeFalsy();
    });
});
