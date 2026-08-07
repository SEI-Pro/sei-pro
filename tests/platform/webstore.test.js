// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { createNamespace } from '@src/core/namespace.ts';
import { installSerial } from '@src/core/serial.ts';
import { installWebstore } from '@src/platform/webstore.ts';
import { getSeiPro, globalRef } from '@src/core/global.ts';

function setup() {
    delete globalRef.SeiPro;
    window.localStorage.clear();
    window.sessionStorage.clear();
    createNamespace();
    installSerial(); // isJson
    return installWebstore();
}

describe('platform/webstore', () => {
    let w;
    beforeEach(() => { w = setup(); });

    it('localStorageStorePro/RestorePro fazem round-trip JSON', () => {
        w.localStorageStorePro('k', { a: 1, b: [2, 3] });
        expect(w.localStorageRestorePro('k')).toEqual({ a: 1, b: [2, 3] });
    });

    it('localStorageRestorePro: null p/ ausente (quirk), false p/ não-JSON', () => {
        expect(w.localStorageRestorePro('inexistente')).toBe(null); // isJson(null)=true
        window.localStorage.setItem('cru', 'texto solto');
        expect(w.localStorageRestorePro('cru')).toBe(false);
    });

    it('localStorageRemovePro apaga (volta a null)', () => {
        w.localStorageStorePro('k', 1);
        w.localStorageRemovePro('k');
        expect(w.localStorageRestorePro('k')).toBe(null);
    });

    it('sessionStorageStorePro/RestorePro round-trip', () => {
        w.sessionStorageStorePro('s', { x: true });
        expect(w.sessionStorageRestorePro('s')).toEqual({ x: true });
    });

    it('hybridStorageStorePro grava no local e RestorePro lê de lá', () => {
        w.hybridStorageStorePro('h', { v: 42 });
        expect(JSON.parse(window.localStorage.getItem('h'))).toEqual({ v: 42 });
        expect(w.hybridStorageRestorePro('h')).toEqual({ v: 42 });
    });

    it('sessionStorageStorePro: ao estourar a cota, poda entradas antigas e mantém as recentes (rede de segurança)', () => {
        // sessionStorage falso com cota: setItem lança se o valor exceder maxLen.
        const backing = new Map();
        const maxLen = 200; // caracteres
        const realSession = globalRef.sessionStorage;
        globalRef.sessionStorage = {
            setItem(k, v) {
                if (v.length > maxLen) { const e = new Error('quota'); e.name = 'QuotaExceededError'; throw e; }
                backing.set(k, v);
            },
            getItem(k) { return backing.has(k) ? backing.get(k) : null; },
            removeItem(k) { backing.delete(k); }
        };
        try {
            // 100 entradas: a entrada i carrega seu índice; as recentes ficam no fim.
            const arr = Array.from({ length: 100 }, (_, i) => ({ id: i, pad: 'x'.repeat(10) }));
            w.sessionStorageStorePro('dadosSessionProcessoPro', arr);
        } finally {
            globalRef.sessionStorage = realSession;
        }
        const saved = JSON.parse(backing.get('dadosSessionProcessoPro'));
        expect(Array.isArray(saved)).toBe(true);
        expect(saved.length).toBeGreaterThan(0);
        expect(saved.length).toBeLessThan(100);          // podou
        expect(saved[saved.length - 1].id).toBe(99);     // manteve a MAIS recente
        expect(saved[0].id).toBeGreaterThan(0);          // descartou as mais antigas (frente)
    });

    it('sessionStorageStorePro: valor não-array que não cabe é descartado sem lançar', () => {
        const realSession = globalRef.sessionStorage;
        globalRef.sessionStorage = {
            setItem() { const e = new Error('quota'); e.name = 'QuotaExceededError'; throw e; },
            getItem() { return null; },
            removeItem() {}
        };
        try {
            expect(() => w.sessionStorageStorePro('grande', { blob: 'z' })).not.toThrow();
        } finally {
            globalRef.sessionStorage = realSession;
        }
    });

    it('boundArrayForStorage: limita por QUANTIDADE mantendo as mais recentes', () => {
        const arr = Array.from({ length: 40 }, (_, i) => ({ id: i }));
        const out = w.boundArrayForStorage(arr, 10, Infinity);
        expect(out.length).toBe(10);
        expect(out[0].id).toBe(30);            // descartou as 30 mais antigas
        expect(out[out.length - 1].id).toBe(39); // manteve a mais recente
    });

    it('boundArrayForStorage: limita por TAMANHO serializado (descarta as antigas)', () => {
        // Cada entrada ~1000 chars; teto pequeno força poucas entradas.
        const arr = Array.from({ length: 20 }, (_, i) => ({ id: i, pad: 'x'.repeat(1000) }));
        const out = w.boundArrayForStorage(arr, 1000, 3500);
        expect(out.length).toBeGreaterThan(0);
        expect(out.length).toBeLessThan(20);
        expect(out[out.length - 1].id).toBe(19); // manteve a mais recente
    });

    it('boundArrayForStorage: nunca esvazia (mantém ao menos 1 mesmo acima do teto)', () => {
        const arr = [{ id: 0, pad: 'x'.repeat(10000) }, { id: 1, pad: 'y'.repeat(10000) }];
        const out = w.boundArrayForStorage(arr, 1000, 100);
        expect(out.length).toBe(1);
        expect(out[0].id).toBe(1);
    });

    it('sessionStorageStoreBoundedPro: grava proativamente limitado (sem depender de exceção de cota)', () => {
        const arr = Array.from({ length: 50 }, (_, i) => ({ id: i }));
        w.sessionStorageStoreBoundedPro('dadosSessionProcessoPro', arr, { maxEntries: 25 });
        const saved = w.sessionStorageRestorePro('dadosSessionProcessoPro');
        expect(saved.length).toBe(25);
        expect(saved[saved.length - 1].id).toBe(49);
        expect(saved[0].id).toBe(25);
    });

    it('sessionStorageStoreBoundedPro: valor não-array delega ao store comum', () => {
        w.sessionStorageStoreBoundedPro('obj', { a: 1 });
        expect(w.sessionStorageRestorePro('obj')).toEqual({ a: 1 });
    });
});
