import { describe, expect, it, beforeEach } from 'vitest';
import {
    defaultMonitoradoStore,
    findMonitoradoIndex,
    buildMonitoradoItem,
    addMonitoradoToStore,
    removeMonitoradoFromStore,
    monitoradoProcessDataReady,
    monitoradoProcessPayloadReady
} from '@src/features/monitorados/domain.js';

// store.js lê globalRef.moment e localStorage lazy — stub mínimo antes de usar.
const fakeStorage = () => {
    const d = {};
    return {
        getItem: (k) => (k in d ? d[k] : null),
        setItem: (k, v) => { d[k] = String(v); },
        removeItem: (k) => { delete d[k]; }
    };
};

describe('monitorados/domain (puro)', () => {
    it('defaultMonitoradoStore tem forma vazia canônica', () => {
        expect(defaultMonitoradoStore()).toEqual({ monitorados: [], config: { colortags: [] } });
    });

    it('findMonitoradoIndex acha por id (string|number) e retorna -1 se ausente', () => {
        const store = { monitorados: [{ id_procedimento: 10 }, { id_procedimento: '20' }] };
        expect(findMonitoradoIndex(store, '10')).toBe(0);
        expect(findMonitoradoIndex(store, 20)).toBe(1);
        expect(findMonitoradoIndex(store, 99)).toBe(-1);
        expect(findMonitoradoIndex(null, 1)).toBe(-1);
        expect(findMonitoradoIndex({}, 1)).toBe(-1);
    });

    it('transições puras do toggle constroem, substituem e removem por id', () => {
        const original = {
            monitorados: [{ id_procedimento: '10', processo: 'antigo' }],
            config: { colortags: [] }
        };
        const dados = {
            listAndamento: { id_procedimento: 10, processo: 'Processo 10', andamento: ['a'] },
            listDocumentosAssinados: [{ id: 1 }],
            propProcesso: {
                hdnNomeTipoProcedimento: 'Ofício',
                selAssuntos_select: ['assunto'],
                selInteressadosProcedimento: ['interessado'],
                txtDescricao: 'descrição'
            }
        };
        expect(buildMonitoradoItem(10, dados)).toMatchObject({
            id_procedimento: 10, processo: 'Processo 10', tipo_procedimento: 'Ofício', order: -1, categoria: ''
        });
        const added = addMonitoradoToStore(original, 10, dados);
        expect(added.monitorados).toHaveLength(1);
        expect(added.monitorados[0].processo).toBe('Processo 10');
        expect(original.monitorados[0].processo).toBe('antigo');
        const removed = removeMonitoradoFromStore(added, '10');
        expect(removed.monitorados).toEqual([]);
        expect(added.monitorados).toHaveLength(1);
    });
    it('monitoradoProcessDataReady exige listAndamento.id_procedimento casando + propProcesso', () => {
        const ok = { listAndamento: { id_procedimento: 5, andamento: [] }, propProcesso: {} };
        expect(monitoradoProcessDataReady(5, ok)).toBe(true);
        expect(monitoradoProcessDataReady('5', ok)).toBe(true);
        expect(monitoradoProcessDataReady(6, ok)).toBe(false);
        expect(monitoradoProcessDataReady(5, {})).toBeFalsy();
        expect(monitoradoProcessDataReady(5, undefined)).toBeFalsy();
        expect(monitoradoProcessDataReady(5, { listAndamento: { id_procedimento: 5 } })).toBeFalsy();
    });

    it('monitoradoProcessPayloadReady além de data exige listDocumentosAssinados array', () => {
        const base = { listAndamento: { id_procedimento: 7 }, propProcesso: {} };
        expect(monitoradoProcessPayloadReady(7, { ...base, listDocumentosAssinados: [] })).toBe(true);
        expect(monitoradoProcessPayloadReady(7, base)).toBeFalsy();
        expect(monitoradoProcessPayloadReady(7, { ...base, listDocumentosAssinados: {} })).toBe(false);
    });
});

describe('monitorados/store (IO localStorage, sem remoto)', () => {
    let store;
    beforeEach(async () => {
        globalThis.localStorage = fakeStorage();
        globalThis.moment = () => ({ format: () => '2026-01-01 00:00:00', add: () => ({ format: () => '2026-01-06' }) });
        // import dinâmico após os stubs (store lê globalRef no momento da chamada de qualquer forma)
        store = await import('@src/features/monitorados/store.js');
    });

    it('getStoreMonitoradoPro devolve default quando vazio e faz parse quando há dados', () => {
        expect(store.getStoreMonitoradoPro()).toEqual({ monitorados: [], config: { colortags: [] } });
        globalThis.localStorage.setItem('configDataMonitoradosPro', JSON.stringify({ monitorados: [{ id_procedimento: 1 }], config: { colortags: ['x'] } }));
        const s = store.getStoreMonitoradoPro();
        expect(s.monitorados).toHaveLength(1);
        expect(s.config.colortags).toEqual(['x']);
    });

    it('persistMonitoradoStore (remote:false) grava no localStorage com datetime e relê do cache', () => {
        const s = { monitorados: [{ id_procedimento: 42 }], config: { colortags: [] } };
        store.persistMonitoradoStore(s, { remote: false });
        const raw = JSON.parse(globalThis.localStorage.getItem('configDataMonitoradosPro'));
        expect(raw.monitorados[0].id_procedimento).toBe(42);
        expect(raw.config.datetime).toBe('2026-01-01 00:00:00');
        // releitura sem mudar a string crua usa o cache em memória (mesma referência)
        expect(store.getStoreMonitoradoPro().monitorados[0].id_procedimento).toBe(42);
    });

    it('getOptionsConfigDate cai no default quando o índice não tem configdate', () => {
        globalThis.localStorage.setItem('configDataMonitoradosPro', JSON.stringify({ monitorados: [{ id_procedimento: 1 }], config: { colortags: [] } }));
        store.getStoreMonitoradoPro();
        const cfg = store.getOptionsConfigDate(-1);
        expect(cfg).toHaveProperty('countdown', true);
        expect(cfg).toHaveProperty('duecounter', 'corrido');
    });
});
