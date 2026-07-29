// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest';
import {
    createFileQueue,
    extensionAllowed,
    formatFileSize,
    uploadFormFile
} from '@src/shared/ui/file-queue.js';

describe('shared/ui/file-queue — pure helpers', () => {
    it('extensionAllowed respeita a lista csv', () => {
        expect(extensionAllowed('a.PDF', '.pdf,.docx')).toBe(true);
        expect(extensionAllowed('a.txt', '.pdf')).toBe(false);
        expect(extensionAllowed('a.pdf', null)).toBe(true);
    });

    it('formatFileSize formata bytes', () => {
        expect(formatFileSize(500)).toBe('500 b');
        expect(formatFileSize(2048)).toMatch(/KiB/);
        expect(formatFileSize(2 * 1024 * 1024)).toMatch(/MiB/);
    });
});

describe('shared/ui/file-queue — queue', () => {
    it('chama onAddedFiles (camelCase multi-palavra) ao enfileirar', () => {
        const onAddedFiles = vi.fn();
        const onAddedFile = vi.fn();
        const queue = createFileQueue({
            onAddedFiles,
            onAddedFile,
            createPreview: () => {
                const el = document.createElement('div');
                el.className = 'dz-preview';
                return el;
            }
        });
        const pdf = new File(['x'], 'doc.pdf', { type: 'application/pdf' });
        queue.handleFiles([pdf]);
        expect(onAddedFile).toHaveBeenCalledTimes(1);
        expect(onAddedFiles).toHaveBeenCalledTimes(1);
        expect(onAddedFiles.mock.calls[0][0]).toHaveLength(1);
        queue.destroy();
    });

    it('enfileira, rejeita extensão e remove', () => {
        const root = document.createElement('div');
        document.body.appendChild(root);
        const queue = createFileQueue({
            previewsContainer: root,
            accept: '.pdf',
            createPreview: (item) => {
                const el = document.createElement('div');
                el.className = 'dz-preview';
                el.innerHTML = '<span class="dz-error-message"><span></span></span><button data-dz-remove type="button">x</button>';
                el.querySelector('span span').textContent = item.errorMessage || item.file.name;
                return el;
            }
        });
        const pdf = new File(['x'], 'doc.pdf', { type: 'application/pdf' });
        const txt = new File(['y'], 'notes.txt', { type: 'text/plain' });
        queue.handleFiles([pdf, txt]);
        expect(queue.getQueuedFiles()).toHaveLength(1);
        expect(queue.getRejectedFiles()).toHaveLength(1);
        expect(root.querySelectorAll('.dz-preview')).toHaveLength(2);
        queue.getQueuedFiles()[0].previewElement.querySelector('[data-dz-remove]').click();
        expect(queue.getQueuedFiles()).toHaveLength(0);
        queue.destroy();
    });

    it('processQueue envia FormData e marca sucesso', async () => {
        const successes = [];
        const Xhr = vi.fn(function MockXhr() {
            this.upload = {};
            this.open = vi.fn();
            this.send = vi.fn(function () {
                this.status = 200;
                this.response = '1#file.pdf#x#10#now';
                this.responseURL = '/upload';
                if (this.upload.onprogress) {
                    this.upload.onprogress({ lengthComputable: true, loaded: 10, total: 10 });
                }
                this.onload();
            });
        });
        const queue = createFileQueue({
            createPreview: () => {
                const el = document.createElement('div');
                el.innerHTML = '<span class="dz-upload"></span>';
                return el;
            },
            xhrFactory: () => new Xhr(),
            onSuccess: (file) => successes.push(file.name)
        });
        queue.options.url = '/infra_js/upload';
        queue.addFile(new File(['data'], 'a.pdf', { type: 'application/pdf' }));
        await queue.processQueue();
        expect(successes).toEqual(['a.pdf']);
        expect(queue.getAcceptedFiles()).toHaveLength(1);
        expect(queue.getQueuedFiles()).toHaveLength(0);

        const xhr = await uploadFormFile({
            url: '/u',
            file: new File(['a'], 'b.pdf'),
            xhrFactory: () => new Xhr()
        });
        expect(xhr.response).toContain('file.pdf');
        queue.destroy();
    });
});
