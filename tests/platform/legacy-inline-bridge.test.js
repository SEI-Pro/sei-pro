// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { parseStrictCall, installLegacyInlineBridge } from '@src/platform/legacy-inline-bridge.js';

describe('legacy-inline-bridge — parseStrictCall (gramática estrita)', () => {
    const el = document.createElement('a');

    it('casa chamada simples sem args', () => {
        expect(parseStrictCall('minhaFuncao()', el)).toEqual({ fnName: 'minhaFuncao', args: [] });
    });

    it('resolve "this" para o elemento', () => {
        expect(parseStrictCall('setSelectAllTr(this)', el)).toEqual({ fnName: 'setSelectAllTr', args: [el] });
    });

    it('aceita ; opcional no fim', () => {
        expect(parseStrictCall('setSelectAllTr(this);', el)).toEqual({ fnName: 'setSelectAllTr', args: [el] });
    });

    it('mistura this + string literal (aspas simples e duplas)', () => {
        expect(parseStrictCall("getSelectAllTr(this, 'SemGrupo')", el))
            .toEqual({ fnName: 'getSelectAllTr', args: [el, 'SemGrupo'] });
        expect(parseStrictCall('getSelectAllTr(this, "SemGrupo")', el))
            .toEqual({ fnName: 'getSelectAllTr', args: [el, 'SemGrupo'] });
    });

    it('aceita número, null, true, false', () => {
        expect(parseStrictCall('editConfigOptions(this, 42)', el)).toEqual({ fnName: 'editConfigOptions', args: [el, 42] });
        expect(parseStrictCall('fn(null)', el)).toEqual({ fnName: 'fn', args: [null] });
        expect(parseStrictCall('fn(true, false)', el)).toEqual({ fnName: 'fn', args: [true, false] });
    });

    it('rejeita múltiplas instruções (não adivinha)', () => {
        expect(parseStrictCall('changeViewStatesAtiv(this);saveConfigPersonalUser(this);', el)).toBeNull();
    });

    it('rejeita expressão jQuery encadeada (não é fnName(args))', () => {
        expect(parseStrictCall("$(this).closest('table').trigger('updateAll');$(this).remove();", el)).toBeNull();
    });

    it('rejeita arg que não é this/literal simples (ex.: propriedade)', () => {
        expect(parseStrictCall('editConfigOptions(this, options.value)', el)).toBeNull();
    });

    it('rejeita parênteses aninhados', () => {
        expect(parseStrictCall('fn(a(this))', el)).toBeNull();
    });

    it('retorna null para string vazia/ausente', () => {
        expect(parseStrictCall('', el)).toBeNull();
        expect(parseStrictCall(null, el)).toBeNull();
    });
});

describe('legacy-inline-bridge — installLegacyInlineBridge (comportamento DOM real)', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
        delete window.__SEI_PRO_LEGACY_INLINE_BRIDGE__;
        delete window.minhaFuncaoLegada;
    });

    it('intercepta onclick="nossaFuncao(this)" e chama a função real (a função NÃO existe nativamente, então sem a ponte lançaria ReferenceError)', () => {
        installLegacyInlineBridge(window);
        const calls = [];
        window.minhaFuncaoLegada = function (el) { calls.push(el); };
        document.body.innerHTML = '<a id="x" onclick="minhaFuncaoLegada(this)">clica</a>';
        document.getElementById('x').click();
        expect(calls).toHaveLength(1);
        expect(calls[0].id).toBe('x');
    });

    it('restaura o atributo depois (microtask) — clique repetido continua funcionando', async () => {
        installLegacyInlineBridge(window);
        let count = 0;
        window.minhaFuncaoLegada = function () { count++; };
        document.body.innerHTML = '<a id="x" onclick="minhaFuncaoLegada(this)">clica</a>';
        const a = document.getElementById('x');

        a.click();
        expect(count).toBe(1);
        // attribute removido durante o dispatch, mas síncrono — já deve ter sumido aqui
        expect(a.getAttribute('onclick')).toBe(null);

        await Promise.resolve(); // deixa a microtask de restauração rodar
        expect(a.getAttribute('onclick')).toBe('minhaFuncaoLegada(this)');

        a.click(); // segundo clique deve funcionar de novo
        expect(count).toBe(2);
    });

    // jsdom AVALIA de verdade o atributo inline (reproduz o ambiente real) — quando a
    // função referenciada não existe, ele reporta um ReferenceError como evento
    // 'error' na window (mesmo mecanismo de um <script> da página, por spec). Isso é
    // EXATAMENTE o bug em produção para os casos que a ponte deliberadamente não
    // cobre; suprimimos só o reporte (preventDefault) para manter o output limpo —
    // a função seguir indefinida (não interceptada) é o ponto do teste.
    function withSuppressedWindowErrors(fn) {
        const onError = function (e) { e.preventDefault(); };
        window.addEventListener('error', onError);
        try { fn(); } finally { window.removeEventListener('error', onError); }
    }

    it('não intercepta quando a função não existe no mundo isolado (deixa pra página/SEI nativo)', () => {
        installLegacyInlineBridge(window);
        document.body.innerHTML = '<a id="x" onclick="infraTooltipMostrar(\'oi\')">x</a>';
        const a = document.getElementById('x');
        withSuppressedWindowErrors(function () { a.click(); });
        expect(a.getAttribute('onclick')).toBe("infraTooltipMostrar('oi')"); // atributo intacto — ponte não interceptou
    });

    it('não intercepta gramática fora do suporte (multi-instrução) — atributo permanece intacto', () => {
        installLegacyInlineBridge(window);
        document.body.innerHTML = '<a id="x" onchange="changeViewStatesAtiv(this);saveConfigPersonalUser(this);">x</a>';
        const a = document.getElementById('x');
        withSuppressedWindowErrors(function () { a.dispatchEvent(new Event('change', { bubbles: true })); });
        expect(a.getAttribute('onchange')).toBe('changeViewStatesAtiv(this);saveConfigPersonalUser(this);'); // ponte não removeu/restaurou — não interceptou
    });

    it('respeita onclick e onmouseover distintos no mesmo elemento (não confunde o tipo)', () => {
        installLegacyInlineBridge(window);
        const clickCalls = [];
        const hoverCalls = [];
        window.setSelectAllTr = function (el) { clickCalls.push(el); };
        window.updateTipSelectAll = function (el) { hoverCalls.push(el); };
        document.body.innerHTML = '<a id="x" onclick="setSelectAllTr(this);" onmouseover="updateTipSelectAll(this)">x</a>';
        const a = document.getElementById('x');

        a.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
        expect(hoverCalls).toHaveLength(1);
        expect(clickCalls).toHaveLength(0);

        a.click();
        expect(clickCalls).toHaveLength(1);
    });

    it('é idempotente (instalar 2x não duplica listeners)', () => {
        installLegacyInlineBridge(window);
        installLegacyInlineBridge(window);
        let count = 0;
        window.minhaFuncaoLegada = function () { count++; };
        document.body.innerHTML = '<a id="x" onclick="minhaFuncaoLegada(this)">clica</a>';
        document.getElementById('x').click();
        expect(count).toBe(1); // se tivesse duplicado, seria 2
    });
});
