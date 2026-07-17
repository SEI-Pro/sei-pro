import { describe, expect, it } from 'vitest';
import { composeListaFeatures, installListaEntryDomain } from '../../../src/entries/lista.js';

describe('entry da lista de processos', () => {
    it('compõe as features do contexto de processos e mantém a ordem do legado', () => {
        expect(composeListaFeatures({ hasProcessTables: true })).toEqual({
            context: 'lista-processos',
            features: ['lista-processos', 'lista-agrupamento', 'controlar-prazos', 'nao-lido', 'monitorados']
        });
    });

    it('permite desabilitar uma feature sem alterar o plano base', () => {
        expect(composeListaFeatures({
            hasProcessTables: true,
            enabled: { 'controlar-prazos': false, monitorados: false }
        })).toEqual({
            context: 'lista-processos',
            features: ['lista-processos', 'lista-agrupamento', 'nao-lido']
        });
    });

    it('distingue árvore e contexto sem superfície reconhecida', () => {
        expect(composeListaFeatures({ hasTreeFrame: true })).toEqual({
            context: 'arvore',
            features: ['arvore']
        });
        expect(composeListaFeatures()).toEqual({ context: 'desconhecido', features: [] });
    });

    it('instala a composição no namespace da entry', () => {
        const target = {};
        installListaEntryDomain(target);
        expect(target.SeiPro.entries.lista.composeListaFeatures).toBe(composeListaFeatures);
    });
});
