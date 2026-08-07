import { afterEach, describe, expect, it, vi } from 'vitest';
import { getSeiHtml, postSeiForm, serializeSeiForm } from '@src/features/nao-lido/io.ts';

const originalGlobals = {
    $: globalThis.$,
    parent: globalThis.parent,
    escapeComponent: globalThis.escapeComponent,
    XMLHttpRequest: globalThis.XMLHttpRequest
};

afterEach(() => Object.assign(globalThis, originalGlobals));

function fakeForm(fields) {
    return {
        find(selector) {
            return {
                each(callback) {
                    for (const field of fields[selector] || []) {
                        callback.call({
                            attr: (name) => field[name],
                            val: () => field.value
                        });
                    }
                }
            };
        }
    };
}

describe('nao-lido/io — serializeSeiForm', () => {
    it('coleta campos do SEI, aplica overrides e codifica descrição', () => {
        const jq = (value) => value;
        jq.extend = (target, values) => Object.assign(target, values);
        globalThis.$ = jq;
        globalThis.parent = { encodeURI_toHex: vi.fn((value) => `HEX(${value})`) };
        globalThis.escapeComponent = vi.fn((value) => `ESC(${value})`);

        const form = fakeForm({
            'input[type=hidden]': [
                { name: 'hdnToken', id: 'hdnToken', value: 'abc' },
                { name: 'ignored', id: 'other', value: 'no' }
            ],
            'input[type=text]': [
                { id: 'txtDescricao', value: 'ação' },
                { id: 'otherText', value: 'no' }
            ],
            select: [{ id: 'selUnidades', value: '7' }],
            'input[type=radio]': [{ name: 'rdoTipo', value: '1' }]
        });

        expect(serializeSeiForm(form, { sbmSalvar: 'Salvar' })).toBe(
            'hdnToken=ESC(abc)&txtDescricao=HEX(ação)&selUnidades=ESC(7)&rdoTipo=ESC(1)&sbmSalvar=ESC(Salvar)'
        );
        expect(globalThis.parent.encodeURI_toHex).toHaveBeenCalledWith('ação');
    });
});

describe('nao-lido/io — requests', () => {
    it('faz GET via jQuery e retorna o HTML', async () => {
        const ajax = vi.fn(() => Promise.resolve('<html>ok</html>'));
        globalThis.$ = { ajax };

        await expect(getSeiHtml('/controlador.php')).resolves.toBe('<html>ok</html>');
        expect(ajax).toHaveBeenCalledWith({ url: '/controlador.php' });
    });

    it('resolve POST com html e xhr, preservando content type e action', async () => {
        const xhr = { responseURL: '/controlador.php?acao=ok' };
        globalThis.XMLHttpRequest = function FakeXHR() { return xhr; };
        let request;
        const ajax = vi.fn((options) => {
            expect(options.xhr()).toBe(xhr);
            request = {
                done(callback) {
                    callback('<html>ok</html>');
                    return request;
                },
                fail: vi.fn()
            };
            return request;
        });
        globalThis.$ = { ajax };

        await expect(postSeiForm('/salvar', 'a=1')).resolves.toEqual({
            html: '<html>ok</html>',
            xhr
        });
        expect(ajax).toHaveBeenCalledWith(expect.objectContaining({
            method: 'POST',
            data: 'a=1',
            url: '/salvar',
            contentType: 'application/x-www-form-urlencoded; charset=ISO-8859-1'
        }));
    });
});
