// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { createNamespace } from '@src/core/namespace.js';
import { installSerial } from '@src/core/serial.js';
import { installWebstore } from '@src/platform/webstore.js';
import { installOptions } from '@src/core/options.js';
import { getSeiPro, globalRef } from '@src/core/global.js';

function setup() {
    delete globalRef.SeiPro;
    window.localStorage.clear();
    createNamespace();
    installSerial();
    installWebstore();
    return installOptions();
}

describe('core/options — optionsPro store', () => {
    let o;
    beforeEach(() => { o = setup(); });

    it('setOptionsPro cria o objeto e getOptionsPro lê', () => {
        expect(o.setOptionsPro('tema', 'escuro')).toBe(true);
        expect(o.getOptionsPro('tema')).toBe('escuro');
        expect(JSON.parse(window.localStorage.getItem('optionsPro'))).toEqual({ tema: 'escuro' });
    });

    it('verifyOptionsPro reflete presença/ausência', () => {
        expect(o.verifyOptionsPro('x')).toBe(false);
        o.setOptionsPro('x', 1);
        expect(o.verifyOptionsPro('x')).toBe(true);
    });

    it('getOptionsPro retorna false p/ item ausente', () => {
        o.setOptionsPro('a', 1);
        expect(o.getOptionsPro('b')).toBe(false);
    });

    it('removeOptionsPro apaga a chave', () => {
        o.setOptionsPro('a', 1); o.setOptionsPro('b', 2);
        o.removeOptionsPro('a');
        expect(o.getOptionsPro('a')).toBe(false);
        expect(o.getOptionsPro('b')).toBe(2);
    });

    it('updateOptionsPro migra chave antiga de top-level p/ optionsPro', () => {
        window.localStorage.setItem('legado', JSON.stringify({ k: 9 }));
        // getOptionsPro chama updateOptionsPro internamente
        expect(o.getOptionsPro('legado')).toEqual({ k: 9 });
        expect(window.localStorage.getItem('legado')).toBe(null); // removida do top-level
    });
});
