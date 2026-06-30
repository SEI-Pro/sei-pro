// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { createNamespace } from '@src/core/namespace.js';
import { installSerial } from '@src/core/serial.js';
import { installWebstore } from '@src/platform/webstore.js';
import { getSeiPro, globalRef } from '@src/core/global.js';

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

    it('sessionStorageStorePro: ao estourar a cota, poda entradas antigas e mantém as recentes', () => {
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
        const warns = [];
        const origWarn = console.warn;
        console.warn = (...a) => warns.push(a.join(' '));
        try {
            // 100 entradas: a entrada i carrega seu índice; as recentes ficam no fim.
            const arr = Array.from({ length: 100 }, (_, i) => ({ id: i, pad: 'x'.repeat(10) }));
            w.sessionStorageStorePro('dadosSessionProcessoPro', arr);
        } finally {
            console.warn = origWarn;
            globalRef.sessionStorage = realSession;
        }
        const saved = JSON.parse(backing.get('dadosSessionProcessoPro'));
        expect(Array.isArray(saved)).toBe(true);
        expect(saved.length).toBeGreaterThan(0);
        expect(saved.length).toBeLessThan(100);          // podou
        expect(saved[saved.length - 1].id).toBe(99);     // manteve a MAIS recente
        expect(saved[0].id).toBeGreaterThan(0);          // descartou as mais antigas (frente)
        expect(warns.some((m) => m.includes('podadas'))).toBe(true);
    });

    it('sessionStorageStorePro: valor não-array que não cabe é descartado com aviso (sem lançar)', () => {
        const realSession = globalRef.sessionStorage;
        globalRef.sessionStorage = {
            setItem() { const e = new Error('quota'); e.name = 'QuotaExceededError'; throw e; },
            getItem() { return null; },
            removeItem() {}
        };
        const warns = [];
        const origWarn = console.warn;
        console.warn = (...a) => warns.push(a.join(' '));
        try {
            expect(() => w.sessionStorageStorePro('grande', { blob: 'z' })).not.toThrow();
        } finally {
            console.warn = origWarn;
            globalRef.sessionStorage = realSession;
        }
        expect(warns.some((m) => m.includes('descartada'))).toBe(true);
    });
});
