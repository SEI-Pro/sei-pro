import { describe, it, expect } from 'vitest';
import {
    prefixNaoVisualizadoTooltip,
    buildErrosNaoLidoMessage,
    buildProcessoTrabalharUrl,
    buildMarcarAndamentoOverrides,
    buildEnviarProcessoOverrides
} from '../../../src/features/nao-lido/domain.js';

describe('nao-lido domain — prefixNaoVisualizadoTooltip', () => {
    it('prefixa "(Não Visualizado) " dentro do infraTooltipMostrar', () => {
        const inp = "return infraTooltipMostrar('Processo 123','x')";
        expect(prefixNaoVisualizadoTooltip(inp))
            .toBe("return infraTooltipMostrar('(Não Visualizado) Processo 123','x')");
    });

    it('retorna null quando já está prefixado (idempotente)', () => {
        const inp = "return infraTooltipMostrar('(Não Visualizado) Processo 123')";
        expect(prefixNaoVisualizadoTooltip(inp)).toBeNull();
    });

    it('retorna null para entrada não-string', () => {
        expect(prefixNaoVisualizadoTooltip(undefined)).toBeNull();
        expect(prefixNaoVisualizadoTooltip(null)).toBeNull();
    });

    it('retorna null quando não há o âncora infraTooltipMostrar', () => {
        expect(prefixNaoVisualizadoTooltip('return outraCoisa()')).toBeNull();
    });
});

describe('nao-lido domain — buildErrosNaoLidoMessage', () => {
    it('retorna null sem erros', () => {
        expect(buildErrosNaoLidoMessage([], 3)).toBeNull();
        expect(buildErrosNaoLidoMessage(undefined, 3)).toBeNull();
    });

    it('todos falharam → primeira mensagem crua', () => {
        expect(buildErrosNaoLidoMessage(['Falha A'], 1)).toBe('Falha A');
        expect(buildErrosNaoLidoMessage(['Falha A', 'Falha B'], 2)).toBe('Falha A');
    });

    it('falha parcial → resumo N de TOTAL + primeira mensagem', () => {
        expect(buildErrosNaoLidoMessage(['Falha A'], 3))
            .toBe('1 de 3 processo(s) não puderam ser marcados: Falha A');
    });
});

describe('nao-lido domain — requests da marcação', () => {
    it('monta a URL do processo sem alterar o host legado', () => {
        expect(buildProcessoTrabalharUrl('https://sei.test/controlador.php', 42))
            .toBe('https://sei.test/controlador.php?acao=procedimento_trabalhar&id_procedimento=42');
    });

    it('mantém o payload legado de atualizar andamento', () => {
        expect(buildMarcarAndamentoOverrides()).toEqual({
            txaDescricao: 'Processo marcado como não visualizado',
            sbmSalvar: 'Salvar'
        });
    });

    it('monta o payload legado de envio para a unidade atual', () => {
        expect(buildEnviarProcessoOverrides('7', 'DIPRO')).toEqual({
            selUnidades: '7',
            hdnUnidades: '7±DIPRO',
            sbmEnviar: 'Enviar'
        });
    });
});
