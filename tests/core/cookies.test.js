// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { createNamespace } from '@src/core/namespace.js';
import { installCookies } from '@src/core/cookies.js';
import { getSeiPro, globalRef } from '@src/core/global.js';

function setup() {
    delete globalRef.SeiPro;
    // limpa cookies existentes do jsdom
    document.cookie.split(';').forEach((c) => {
        const name = c.split('=')[0].trim();
        if (name) document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    });
    createNamespace();
    return installCookies();
}

describe('core/cookies', () => {
    let c;
    beforeEach(() => { c = setup(); });

    it('createCookiePro grava e readCookiePro lê', () => {
        c.createCookiePro('foo', 'bar', 1);
        expect(c.readCookiePro('foo')).toBe('bar');
    });

    it('readCookiePro retorna null p/ ausente', () => {
        expect(c.readCookiePro('naoexiste')).toBe(null);
    });

    it('eraseCookiePro remove', () => {
        c.createCookiePro('x', '1', 1);
        c.eraseCookiePro('x');
        expect(c.readCookiePro('x')).toBe(null);
    });
});
