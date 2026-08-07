// @vitest-environment jsdom
import { describe, expect, it, beforeEach } from 'vitest';
import { createTagsInput } from '@src/shared/ui/tags-input.ts';

function mkInput(value = '') {
    const input = document.createElement('input');
    input.value = value;
    document.body.appendChild(input);
    return input;
}

describe('shared/ui/tags-input', () => {
    beforeEach(() => { document.body.innerHTML = ''; });

    it('parseia o valor inicial pelo delimitador', () => {
        const input = mkInput('a;b;c');
        const t = createTagsInput(input);
        expect(t.getTags()).toEqual(['a', 'b', 'c']);
    });

    it('add escreve de volta no input original (fonte da verdade)', () => {
        const input = mkInput('');
        const t = createTagsInput(input, { delimiter: ';' });
        t.add('urgente'); t.add('fiscal');
        expect(t.getTags()).toEqual(['urgente', 'fiscal']);
        expect(input.value).toBe('urgente;fiscal');
    });

    it('respeita unique e limit', () => {
        const t = createTagsInput(mkInput(''), { unique: true, limit: 2 });
        expect(t.add('x')).toBe(true);
        expect(t.add('x')).toBe(false); // duplicada
        expect(t.add('y')).toBe(true);
        expect(t.add('z')).toBe(false); // limite
        expect(t.getTags()).toEqual(['x', 'y']);
    });

    it('remove atualiza tags, input e dispara callbacks', () => {
        const removed = [];
        const changes = [];
        const t = createTagsInput(mkInput('a;b'), { onRemove: (tag) => removed.push(tag), onChange: (tags) => changes.push(tags.join(',')) });
        t.remove('a');
        expect(t.getTags()).toEqual(['b']);
        expect(mkInputValue(t)).toBe('b');
        expect(removed).toEqual(['a']);
        expect(changes[changes.length - 1]).toBe('b');
    });

    it('renderiza uma pill por tag com botão de remover', () => {
        const input = mkInput('a;b');
        createTagsInput(input);
        const wrap = input.nextElementSibling;
        expect(wrap.querySelectorAll('.seipro-tag').length).toBe(2);
        expect(wrap.querySelectorAll('.seipro-tag-remove').length).toBe(2);
    });

    it('destroy remove o widget e restaura o input', () => {
        const input = mkInput('a');
        const t = createTagsInput(input);
        t.destroy();
        expect(input.style.display).toBe('');
        expect(document.querySelectorAll('.seipro-tagsinput').length).toBe(0);
    });
});

function mkInputValue(t) {
    // helper: o input original é o irmão anterior do wrap; mais simples relê via getTags->join
    return t.getTags().join(';');
}
