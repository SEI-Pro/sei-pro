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
});
