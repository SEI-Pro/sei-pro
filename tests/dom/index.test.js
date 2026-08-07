// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { qs, qsa, exists, el, on, remove, empty, closest, parseHTML, parseDocument, ready } from '@src/dom/index.ts';

describe('dom helper (substituto do jQuery)', () => {
    it('qs/qsa/exists selecionam no escopo dado', () => {
        document.body.innerHTML = '<div class="x"><span class="y">a</span><span class="y">b</span></div>';
        const root = qs('.x');
        expect(qs('.y', root).textContent).toBe('a');
        expect(qsa('.y', root)).toHaveLength(2);
        expect(Array.isArray(qsa('.y'))).toBe(true);
        expect(exists('.y')).toBe(true);
        expect(exists('.zzz')).toBe(false);
    });

    it('el cria com className, style, dataset, atributos, on e filhos', () => {
        const click = vi.fn();
        const node = el('button', {
            className: 'b', id: 'go', title: 'ir',
            style: { color: 'red' }, dataset: { mode: 'edit' },
            on: { click }
        }, ['Salvar', el('i', { className: 'icon' })]);
        expect(node.tagName).toBe('BUTTON');
        expect(node.className).toBe('b');
        expect(node.id).toBe('go');
        expect(node.getAttribute('title')).toBe('ir');
        expect(node.style.color).toBe('red');
        expect(node.dataset.mode).toBe('edit');
        expect(node.textContent).toBe('Salvar');
        expect(node.querySelector('i.icon')).toBeTruthy();
        node.click();
        expect(click).toHaveBeenCalledOnce();
    });

    it('on suporta delegação via closest e retorna off()', () => {
        document.body.innerHTML = '<ul><li><a class="del">x</a></li></ul>';
        const ul = qs('ul');
        const handler = vi.fn();
        const off = on(ul, 'click', '.del', handler);
        qs('.del').click();
        expect(handler).toHaveBeenCalledOnce();
        expect(handler.mock.calls[0][1].classList.contains('del')).toBe(true); // match passado
        off();
        qs('.del').click();
        expect(handler).toHaveBeenCalledOnce(); // não disparou de novo
    });

    it('remove e empty manipulam a árvore', () => {
        document.body.innerHTML = '<div id="p"><span>a</span><span>b</span></div>';
        empty(qs('#p'));
        expect(qs('#p').children).toHaveLength(0);
        remove(qs('#p'));
        expect(qs('#p')).toBeNull();
        expect(() => remove(null)).not.toThrow();
    });

    it('closest sobe a árvore', () => {
        document.body.innerHTML = '<section class="s"><b id="t">x</b></section>';
        expect(closest(qs('#t'), '.s').className).toBe('s');
    });

    it('parseHTML e parseDocument fazem parse sem executar', () => {
        const frag = parseHTML('<p class="z">oi</p>');
        expect(frag.querySelector('p.z').textContent).toBe('oi');
        const doc = parseDocument('<html><body><h1>T</h1></body></html>');
        expect(doc.querySelector('h1').textContent).toBe('T');
    });

    it('ready defers when the document is already interactive/complete', async () => {
        expect(document.readyState).not.toBe('loading');
        const fn = vi.fn();
        ready(fn);
        expect(fn).not.toHaveBeenCalled();
        await new Promise((resolve) => setTimeout(resolve, 0));
        expect(fn).toHaveBeenCalledOnce();
    });
});
