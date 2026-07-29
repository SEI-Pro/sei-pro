import { describe, expect, it } from 'vitest';
import {
    resolveMenuCatalogs,
    resolveMenuSelection,
    hasUploadFiles,
    serializeUploadAttachment,
    extractUploadExtensions,
    sortUploadFiles,
    getLinksInText,
    resolveDropzoneIcon,
    formatAnotacaoToParagraphs,
    buildArvoreInitSignature
} from '@src/features/arvore/domain.js';
import { readArvoreMenuConfig, fetchUploadPage, postUploadForm, postSavedUpload, fetchText } from '@src/features/arvore/io.js';
import { bindArvoreToolbarProcess, bindUploadArvoreNativeDragEvents, bindUploadConfirmActions } from '@src/features/arvore/view.js';
import { installArvoreLegacyApi } from '@src/features/arvore/legacy-api.js';
import {
    parseInfraUploadMeta,
    resolveUploadSerie,
    buildUploadDocumentTitle
} from '@src/features/arvore/domain.js';

const fallback = [['Copiar número'], ['Ações em lote']];

describe('arvore/legacy-api — instalação', () => {
    it('expõe os helpers migrados como aliases sem alterar os módulos de origem', () => {
        const previous = globalThis.fetchUploadPage;
        delete globalThis.fetchUploadPage;
        installArvoreLegacyApi();
        expect(globalThis.fetchUploadPage).toBe(fetchUploadPage);
        expect(globalThis.postUploadForm).toBe(postUploadForm);
        expect(globalThis.postSavedUpload).toBe(postSavedUpload);
        if (previous === undefined) delete globalThis.fetchUploadPage;
        else globalThis.fetchUploadPage = previous;
    });
});

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

    it('posta o formulário final via XHR ISO-8859-1 e entrega responseURL', async () => {
        const received = [];
        const xhr = {
            responseURL: '/arvore_visualizar&acao_origem=documento_receber',
            responseText: 'ok',
            open() {},
            setRequestHeader() {},
            send() { this.onload(); }
        };
        await postSavedUpload({
            xhrFactory: () => xhr,
            url: '/salvar',
            data: 'a=1',
            onSuccess: (...args) => received.push(args)
        });
        expect(received).toEqual([['ok', xhr]]);
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

describe('arvore/view — toolbar de processo', () => {
    it('instala as opções e encaminha o evento para a ação legada', () => {
        const handlers = {};
        const chain = {
            on: (event, handler) => { handlers[event] = handler; return chain; }
        };
        const element = {
            toolbar: (options) => {
                expect(options).toEqual({
                    content: '#toolbar-options-proc',
                    position: 'bottom',
                    adjustment: 5,
                    style: 'menu'
                });
                return chain;
            }
        };
        const calls = [];
        const jqueryElement = { jquery: true, id: 'processo' };
        const $ = (element) => {
            expect(element).toEqual({ id: 'processo' });
            return jqueryElement;
        };
        expect(bindArvoreToolbarProcess({ element, $, onAction: (...args) => calls.push(args) })).toBe(chain);
        const trigger = { id: 'toolbar-action' };
        handlers.toolbarItemClick.call({ id: 'processo' }, {}, trigger);
        expect(calls).toEqual([[jqueryElement, trigger]]);
    });
});
describe('arvore/domain — links / icons / notes / signature', () => {
    it('extrai links controlador.php e deduplica', () => {
        const text = "foo 'controlador.php?acao=x' bar 'controlador.php?acao=x' baz 'controlador.php?acao=y'";
        expect(getLinksInText(text)).toEqual([
            'controlador.php?acao=x',
            'controlador.php?acao=y'
        ]);
    });

    it('resolve ícones Dropzone por MIME (GIF — SVG documento_* 404 na PRF)', () => {
        expect(resolveDropzoneIcon('image/png', true)).toBe('/infra_css/imagens/imagem.gif');
        expect(resolveDropzoneIcon('application/pdf', true)).toBe('/infra_css/imagens/pdf.gif');
        expect(resolveDropzoneIcon('application/zip', false)).toBe('/infra_css/imagens/zip.gif');
    });

    it('formata anotação em parágrafos com checklist', () => {
        expect(formatAnotacaoToParagraphs('[X] Feito\n[ ] Pendente', (t) => t))
            .toBe('<div class="stickNoteCheck stickNoteChecked">Feito</div><div class="stickNoteCheck">Pendente</div>');
    });

    it('monta assinatura de init a partir de âncoras', () => {
        expect(buildArvoreInitSignature([
            { id: 'a1', href: '/x' },
            { id: 'a2', href: '/y' }
        ])).toBe('a1|/x::a2|/y');
        expect(buildArvoreInitSignature([])).toBe('');
    });
});

describe('arvore/view — eventos nativos do upload', () => {
    it('previne navegação, abre a área e entrega arquivos à fila', () => {
        const listeners = {};
        const root = {
            __seiproUploadDragBound: false,
            addEventListener: (type, fn) => { listeners[type] = fn; },
            removeEventListener: () => {}
        };
        const dropzone = { handleFiles: (files) => { dropzone.files = files; } };
        const opened = [];
        const cancelled = [];
        bindUploadArvoreNativeDragEvents({
            root,
            hasUploadFiles: (transfer) => Boolean(transfer && transfer.files && transfer.files.length),
            openModalDropzone: () => opened.push(true),
            cancelUpload: () => cancelled.push(true),
            getDropzone: () => dropzone
        });
        const event = {
            dataTransfer: { files: [{ name: 'doc.pdf' }], dropEffect: 'none' },
            preventDefault: () => { event.prevented = true; }
        };
        listeners.dragover(event);
        listeners.drop(event);
        expect(event.prevented).toBe(true);
        expect(opened).toHaveLength(1);
        expect(cancelled).toHaveLength(1);
        expect(dropzone.files).toEqual([{ name: 'doc.pdf' }]);
    });

    it('cancela ao sair pela borda da janela', () => {
        const listeners = {};
        const root = {
            __seiproUploadDragBound: false,
            addEventListener: (type, fn) => { listeners[type] = fn; },
            removeEventListener: () => {}
        };
        let cancelled = 0;
        bindUploadArvoreNativeDragEvents({
            root,
            hasUploadFiles: () => false,
            openModalDropzone: () => {},
            cancelUpload: () => { cancelled += 1; },
            getDropzone: () => null
        });
        listeners.dragleave({ clientX: 0, clientY: 0 });
        expect(cancelled).toBe(1);
    });
});

describe('arvore/domain — upload SEI helpers', () => {
    it('extrai meta do infraUpload e resolve série/título', () => {
        const html = [
            "objUpload = new infraUpload('frmDocumentoCadastro','filArquivo','controlador.php?acao=infra_upload','z');",
            'arrExt = "pdf";',
            "objTabelaAnexos.adicionar([arr['nome_upload'],arr['nome'],arr['data_hora'],arr['tamanho'],infraFormatarTamanhoBytes(arr['tamanho']),'Alice' ,'Unidade']);"
        ].join('\n');
        const meta = parseInfraUploadMeta(html);
        expect(meta.urlUpload).toContain('infra_upload');
        expect(meta.extensions).toEqual(['.pdf']);
        expect(meta.userUnidade).toEqual({ user: 'Alice', unidade: 'Unidade' });
        const serie = resolveUploadSerie({
            fileName: 'Anexo contrato.pdf',
            seriesOptions: [{ name: 'anexo', value: '9' }, { name: 'oficio', value: '1' }],
            defaultDocName: '',
            removeAccents: (s) => s
        });
        expect(serie.selSerie).toBe('9');
        expect(buildUploadDocumentTitle('Anexo contrato.pdf', 'anexo')).toBe('contrato');
    });
});

describe('arvore/io — fetchText', () => {
    it('fetchText usa fetch injetável', async () => {
        const html = await fetchText('/page', {
            fetch: async (url) => {
                expect(url).toBe('/page');
                return '<html></html>';
            }
        });
        expect(html).toBe('<html></html>');
    });
});

describe('arvore/view — bindUploadConfirmActions', () => {
    it('delega cancelar e enviar sem onclick inline', () => {
        const cancelled = [];
        const sent = [];
        const statuses = [];
        const listeners = [];
        const root = {
            __seiproArvoreUploadActionsBound: false,
            addEventListener: (_type, listener) => { listeners.push(listener); },
            removeEventListener: () => {},
            contains: () => true
        };
        const cancelEl = {
            closest: (sel) => (sel.includes('dropzone-cancel') ? cancelEl : null)
        };
        const sendEl = {
            tagName: 'A',
            getAttribute: (name) => (name === 'data-seipro-arvore-action' ? 'send-upload' : null),
            closest: (sel) => (sel.includes('send-upload') ? sendEl : null)
        };
        bindUploadConfirmActions({
            root,
            onCancel: (e) => cancelled.push(e.type),
            onSend: (el) => sent.push(el.getAttribute('data-seipro-arvore-action')),
            onStatus: (el) => statuses.push(el.tagName)
        });
        expect(listeners.length).toBe(2);
        listeners.forEach((listener) => {
            listener({ type: 'click', target: cancelEl, preventDefault() {} });
            listener({ type: 'click', target: sendEl, preventDefault() {} });
        });
        expect(cancelled).toEqual(['click']);
        expect(sent).toEqual(['send-upload']);
        expect(statuses).toEqual(['A']);
    });
});
