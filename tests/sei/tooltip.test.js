// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { createNamespace } from '@src/core/namespace.ts';
import { installTooltip } from '@src/sei/tooltip.ts';
import { globalRef } from '@src/core/global.ts';

// tooltip.js importa removeAcentos/extractOnlyAlphaNum/isJson como módulos ES,
// então não precisa instalar a stack inteira — só o namespace + jsdom (document).
describe('sei/tooltip — parsing de infraTooltipMostrar', () => {
    let tip;
    beforeEach(() => { delete globalRef.SeiPro; createNamespace(); tip = installTooltip(); });

    it('extractTooltipToArray parseia args JSON em array', () => {
        const raw = "return infraTooltipMostrar('Especificacao','Processo 123');";
        const out = tip.extractTooltipToArray(raw);
        expect(Array.isArray(out)).toBe(true);
        expect(out[0]).toBe('Especificacao');
        expect(out[1]).toBe('Processo 123');
    });

    it('extractTooltipToArray retorna false p/ entrada vazia', () => {
        expect(tip.extractTooltipToArray('')).toBe(false);
    });

    it('extractTooltip extrai texto alfanumérico sem acento', () => {
        const raw = "return infraTooltipMostrar('Inspecao');";
        expect(typeof tip.extractTooltip(raw)).toBe('string');
    });
});
