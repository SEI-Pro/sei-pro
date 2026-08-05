// @vitest-environment jsdom
import { beforeAll, describe, expect, it, vi } from 'vitest';
import {
    extractProcessDocuments,
    installPageChromeShim,
    loadEditorProcessDocuments,
    syncDadosProcessoPro
} from '../../../src/features/editor/page-runtime.js';

beforeAll(() => {
    document.documentElement.dataset.seiproExtensionUrl = 'chrome-extension://seipro-test/';
    document.documentElement.dataset.seiproVersion = '9.9.9';
    document.documentElement.dataset.seiproShortName = 'SProTest';
});

describe('editor page-runtime chrome shim', () => {
    it('installs only URL/manifest helpers in the page world', () => {
        delete window.chrome;
        expect(installPageChromeShim()).toBe(true);
        expect(window.chrome.runtime.id).toBe('seipro-page-inject');
        expect(window.chrome.runtime.getURL('icons/icon-16.png'))
            .toBe('chrome-extension://seipro-test/icons/icon-16.png');
        expect(window.chrome.runtime.getManifest()).toMatchObject({
            version: '9.9.9',
            short_name: 'SProTest'
        });
        expect(window.chrome.runtime.connect).toBeUndefined();
    });

    it('rejects page-world extension messages instead of proxying them', async () => {
        delete window.chrome;
        installPageChromeShim();
        const response = await new Promise((resolve) => {
            window.chrome.runtime.sendMessage({ action: 'llmProfilesList' }, resolve);
        });
        expect(response).toEqual({
            ok: false,
            error: 'Runtime indisponível no mundo MAIN'
        });
    });

    it('does not replace a real extension runtime', () => {
        window.chrome = { runtime: { id: 'real-extension-id', getURL: () => '' } };
        expect(installPageChromeShim()).toBe(true);
        expect(window.chrome.runtime.id).toBe('real-extension-id');
        delete window.chrome;
    });

    it('restores process data from the shared session cache without legacy helpers', () => {
        const previousParams = window.getParamsUrlPro;
        const previousData = window.dadosProcessoPro;
        window.getParamsUrlPro = () => ({ id_procedimento: '123' });
        window.sessionStorage.setItem('dadosSessionProcessoPro', JSON.stringify([
            {
                propProcesso: { hdnIdProcedimento: '123' },
                listDocumentos: [{ id_protocolo: '10', documento: 'Despacho', nr_sei: '456' }]
            }
        ]));
        delete window.sessionStorageRestorePro;

        expect(syncDadosProcessoPro()).toBe(true);
        expect(window.dadosProcessoPro.listDocumentos).toHaveLength(1);

        window.sessionStorage.removeItem('dadosSessionProcessoPro');
        window.getParamsUrlPro = previousParams;
        window.dadosProcessoPro = previousData;
    });

    it('matches the process session by document when the editor URL has no process id', () => {
        const previousHref = window.location.href;
        const previousParams = window.getParamsUrlPro;
        const previousData = window.dadosProcessoPro;
        window.history.replaceState({}, '', '/sei/controlador.php?acao=editor_montar&id_documento=456');
        window.getParamsUrlPro = undefined;
        window.sessionStorage.setItem('dadosSessionProcessoPro', JSON.stringify([
            {
                propProcesso: { hdnIdProcedimento: '123' },
                listDocumentos: [{ id_documento: '456', documento: 'Despacho' }]
            }
        ]));
        window.dadosProcessoPro = {};

        expect(syncDadosProcessoPro()).toBe(true);
        expect(window.dadosProcessoPro.propProcesso.hdnIdProcedimento).toBe('123');

        window.history.replaceState({}, '', previousHref);
        window.getParamsUrlPro = previousParams;
        window.sessionStorage.removeItem('dadosSessionProcessoPro');
        window.dadosProcessoPro = previousData;
    });

    it('extracts document references from the SEI process tree', () => {
        expect(extractProcessDocuments(`
            <div id="divArvore">
                <a id="anchor74248257" href="?id_documento=74248257">Consulta CPF - Receita Federal (74248257)</a>
                <a id="anchorPASTA1" href="#">Pasta I</a>
                <a id="anchor74248257" href="?id_documento=74248257">Consulta CPF - Receita Federal (74248257)</a>
                <a id="anchor85022190" href="?id_documento=85022190">Despacho 599</a>
            </div>
        `)).toEqual([
            { id_protocolo: '74248257', documento: 'Consulta CPF - Receita Federal', nr_sei: '74248257' },
            { id_protocolo: '85022190', documento: 'Despacho 599', nr_sei: '' }
        ]);
    });

    it('loads the process tree with same-origin requests when the cache is empty', async () => {
        const previousHref = window.location.href;
        const previousBody = document.body.innerHTML;
        const previousFetch = window.fetch;
        const previousData = window.dadosProcessoPro;
        const previousFlag = window.__SEI_PRO_EDITOR_PROCESS_DATA_LOAD__;
        window.history.replaceState({}, '', '/sei/controlador.php?acao=editor_montar&id_documento=456');
        document.body.innerHTML = '<input id="hdnIdProcedimento" value="123">';
        window.dadosProcessoPro = {};
        delete window.__SEI_PRO_EDITOR_PROCESS_DATA_LOAD__;
        window.fetch = vi.fn()
            .mockResolvedValueOnce({
                ok: true,
                text: async () => '<iframe id="ifrArvore" src="controlador.php?acao=arvore_visualizar"></iframe>'
            })
            .mockResolvedValueOnce({
                ok: true,
                text: async () => '<a id="anchor10">Despacho (123)</a>'
            });

        await expect(loadEditorProcessDocuments()).resolves.toEqual([
            { id_protocolo: '10', documento: 'Despacho', nr_sei: '123' }
        ]);
        expect(window.fetch).toHaveBeenCalledTimes(2);
        expect(window.dadosProcessoPro.treeModel.documents).toHaveLength(1);

        window.history.replaceState({}, '', previousHref);
        document.body.innerHTML = previousBody;
        window.fetch = previousFetch;
        window.dadosProcessoPro = previousData;
        if (previousFlag === undefined) delete window.__SEI_PRO_EDITOR_PROCESS_DATA_LOAD__;
        else window.__SEI_PRO_EDITOR_PROCESS_DATA_LOAD__ = previousFlag;
    });
});
