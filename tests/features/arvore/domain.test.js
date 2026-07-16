import { describe, expect, it } from 'vitest';
import {
    resolveMenuCatalogs,
    resolveMenuSelection,
    hasUploadFiles,
    serializeUploadAttachment,
    extractUploadExtensions,
    sortUploadFiles
} from '@src/features/arvore/domain.js';
import { readArvoreMenuConfig, fetchUploadPage, postUploadForm, postSavedUpload } from '@src/features/arvore/io.js';

const fallback = [['Copiar número'], ['Ações em lote']];

describe('arvore/domain — resolveMenuSelection', () => {
    it('preserva a forma legada e descarta entradas inválidas', () => {
        expect(resolveMenuSelection([['Copiar número', 'extra'], null, [' Ações em lote ']], fallback))
            .toEqual([['Copiar número'], [' Ações em lote ']]);
    });

    it('usa o catálogo padrão para seleção ausente ou vazia', () => {
        expect(resolveMenuSelection(undefined, fallback)).toBe(fallback);
        expect(resolveMenuSelection([], fallback)).toBe(fallback);
        expect(resolveMenuSelection([null, ['']], fallback)).toBe(fallback);
    });
});

describe('arvore/domain — resolveMenuCatalogs', () => {
    it('resolve cada catálogo independentemente', () => {
        const defaults = { process: fallback, document: [['Copiar nome']] };
        expect(resolveMenuCatalogs({ process: [['Copiar número']], document: [] }, defaults))
            .toEqual({ process: [['Copiar número']], document: [['Copiar nome']] });
    });
});

describe('arvore/io — readArvoreMenuConfig', () => {
    it('lê os quatro catálogos e converte opções disabled em flags', () => {
        const restored = {
            configViewFlashMenuPro: [['Ações em lote']],
            configViewFlashDocMenuPro: [['Copiar link']],
            configViewFlashDocArvorePro: undefined,
            configViewFlashPanelArvorePro: [['Marcador']]
        };
        const seenStorage = [];
        const seenOptions = [];
        const config = readArvoreMenuConfig({
            restore: (key) => { seenStorage.push(key); return restored[key]; },
            getOption: (key) => { seenOptions.push(key); return key.endsWith('iconstree') ? 'disabled' : 'enabled'; }
        });

        expect(config.stored.process).toEqual([['Ações em lote']]);
        expect(config.stored.tree).toBeUndefined();
        expect(config.enabled).toEqual({ process: true, document: true, tree: false, panel: true });
        expect(seenStorage).toHaveLength(4);
        expect(seenOptions).toHaveLength(4);
    });
});

describe('arvore/io — upload transport', () => {
    function deferredRequest() {
        const calls = [];
        const ajax = (options) => {
            calls.push(options);
            return { done: (callback) => { callback('response', { responseURL: '/ok' }); return this; } };
        };
        return { ajax, calls };
    }

    it('encapsula GET e POST do fluxo de upload com dependências injetadas', () => {
        const { ajax, calls } = deferredRequest();
        const received = [];
        fetchUploadPage({ ajax, url: '/externo', onSuccess: (html) => received.push(html) });
        postUploadForm({ ajax, url: '/tipo', data: { hdn: '1' }, onSuccess: (html) => received.push(html) });
        expect(calls).toEqual([
            { url: '/externo' },
            { method: 'POST', data: { hdn: '1' }, url: '/tipo' }
        ]);
        expect(received).toEqual(['response', 'response']);
    });

    it('mantém xhr customizado e entrega a resposta do POST final', () => {
        const { ajax, calls } = deferredRequest();
        const xhr = { responseURL: '/arvore_visualizar&acao_origem=documento_receber' };
        const received = [];
        expect(postSavedUpload({ ajax, xhrFactory: () => xhr, url: '/salvar', data: 'a=1', onSuccess: (...args) => received.push(args) })).toBe(xhr);
        expect(calls[0].contentType).toContain('ISO-8859-1');
        expect(calls[0].xhr()).toBe(xhr);
        expect(received).toEqual([['response', xhr]]);
    });
});

describe('arvore/domain — upload', () => {
    it('detecta arquivos em payloads de drag-and-drop', () => {
        expect(hasUploadFiles({ files: [{}] })).toBe(true);
        expect(hasUploadFiles({ types: ['text/plain', 'Files'] })).toBe(true);
        expect(hasUploadFiles({ types: ['text/plain'] })).toBe(false);
    });

    it('serializa o anexo com o contrato legado', () => {
        expect(serializeUploadAttachment(['42', 'nome arquivo.pdf', 'ignored', '12', '10:00'], {
            userUnidade: { user: 'u', unidade: 'x' }
        }, (size) => `${size} B`)).toBe('42%B1nome+arquivo.pdf%B110%3A00%B112%B112+B%B1u%B1x');
    });

    it('extrai extensões e ordena sem mutar a fila', () => {
        const files = [{ position: 2 }, { position: 1 }];
        expect(extractUploadExtensions(['arrExt = "pdf";', 'arrExt = "docx";']))
            .toEqual(['.pdf', '.docx']);
        expect(sortUploadFiles(files, (file) => file.position))
            .toEqual([{ position: 1 }, { position: 2 }]);
        expect(files).toEqual([{ position: 2 }, { position: 1 }]);
    });
});
