import { describe, expect, it } from 'vitest';
import {
    composeListaFeatures,
    installListaEntryDomain
} from '../../../src/entries/lista.js';
import { readListaEntryInputs } from '../../../src/entries/lista/io.js';

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
        expect(target.SeiPro.entries.lista.readListaEntryInputs).toBe(readListaEntryInputs);
    });

    it('lê a superfície DOM e as flags da lista por dependências explícitas', () => {
        const selectors = new Set(['#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado']);
        const calls = [];
        const root = { querySelector: (selector) => selectors.has(selector) ? {} : null };
        const inputs = readListaEntryInputs({
            root,
            checkConfigValue: (name) => {
                calls.push(name);
                return name !== 'gerenciarprazos';
            }
        });

        expect(inputs).toEqual({
            hasProcessTables: true,
            hasTreeFrame: false,
            enabled: {
                'controlar-prazos': false,
                'nao-lido': true,
                monitorados: true
            }
        });
        expect(calls).toEqual(['gerenciarprazos', 'gerenciarmonitorados']);
    });
});
