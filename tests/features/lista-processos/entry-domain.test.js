import { describe, expect, it } from 'vitest';
import {
    composeListaFeatures,
    createListaDeps,
    installListaEntryDomain
} from '../../../src/entries/lista.ts';
import { readListaEntryInputs } from '../../../src/entries/lista/io.ts';
import { runListaProcessosView } from '../../../src/entries/lista/view.ts';

describe('entry da lista de processos', () => {
    it('compõe as features do contexto de processos e mantém a ordem do legado', () => {
        expect(composeListaFeatures({ hasProcessTables: true })).toEqual({
            context: 'lista',
            features: ['lista-processos', 'lista-agrupamento', 'controlar-prazos', 'nao-lido', 'monitorados']
        });
    });

    it('permite desabilitar uma feature sem alterar o plano base', () => {
        expect(composeListaFeatures({
            hasProcessTables: true,
            enabled: { 'controlar-prazos': false, monitorados: false }
        })).toEqual({
            context: 'lista',
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
        expect(typeof target.SeiPro.entries.lista.createListaDeps).toBe('function');
        expect(target.SeiPro.entries.lista.readListaEntryInputs).toBe(readListaEntryInputs);
        expect(target.SeiPro.entries.lista.runListaProcessosView).toBe(runListaProcessosView);
    });

    it('createListaDeps monta ports sem mutar global', () => {
        const messaging = { sendMessage: async () => ({ ok: true, data: {} }) };
        const deps = createListaDeps({
            messaging,
            logger: { error() {}, warn() {}, debug() {}, isDebugEnabled: () => false },
            storage: { getLocal: async () => ({}) }
        });
        expect(deps.messaging).toBe(messaging);
        expect(typeof deps.clock.now).toBe('function');
        expect(deps.logger).toBeTruthy();
        expect(deps.storage).toBeTruthy();
    });

    it('orquestra a view da lista com ordem, carregamento e sessão explícitos', () => {
        const calls = [];
        const loaded = [];
        const storage = { getItem: (key) => { calls.push(`storage:${key}`); return null; } };
        const deps = {
            urlSpro: '/ext/',
            hasSimpleTableCellEdition: false,
            hasMomentDuration: false,
            loadScript: (url) => loaded.push(url),
            schedule: (fn, delay) => { calls.push(`schedule:${delay}`); fn(); },
            sessionStorage: storage
        };
        [
            'bindProcessoPaginacaoSuperiorVisibility', 'initTableSorterHome', 'insertGroupTable',
            'replaceSelectAll', 'initPanelMonitorados', 'checkLoadConfigSheets', 'insertDivPanel',
            'initNewTabProcesso', 'syncHomeProcessCaption', 'forceOnLoadBody', 'observeAreaTela',
            'initAnotacaoControle', 'initReplaceNewIcons', 'initControlePrazo',
            'initViewEspecifacaoProcesso', 'initFullnameAtribuicao', 'initFaviconNrProcesso',
            'addAcompanhamentoEspIcon', 'initAllMarcadoresHome', 'initUrgentePro',
            'initNaoVisualizadoPro', 'initProcessNotificationsPro', 'storeLinkUsuarioSistema',
            'storeVersionSEI', 'getConfigHost'
        ].forEach((name) => { deps[name] = () => calls.push(name); });

        expect(runListaProcessosView(deps)).toBe(true);
        expect(loaded).toEqual([
            '/ext/js/lib/jquery-table-edit.min.js',
            '/ext/js/lib/moment-duration-format.min.js'
        ]);
        expect(calls).toEqual([
            'bindProcessoPaginacaoSuperiorVisibility', 'initTableSorterHome', 'insertGroupTable',
            'replaceSelectAll', 'initPanelMonitorados', 'checkLoadConfigSheets', 'insertDivPanel',
            'schedule:2000', 'initNewTabProcesso', 'syncHomeProcessCaption', 'forceOnLoadBody',
            'observeAreaTela', 'initAnotacaoControle', 'initReplaceNewIcons', 'initControlePrazo',
            'initViewEspecifacaoProcesso', 'initFullnameAtribuicao', 'initFaviconNrProcesso',
            'addAcompanhamentoEspIcon', 'initAllMarcadoresHome', 'initUrgentePro',
            'initNaoVisualizadoPro', 'initProcessNotificationsPro', 'storeLinkUsuarioSistema',
            'storeVersionSEI', 'storage:configHost_Pro', 'getConfigHost'
        ]);
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
