// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from 'vitest';
import {
    createQrCodePlaceholder,
    hydrateQrCodePlaceholders,
    renderQrCode
} from '../../src/shared/qr-code.ts';

afterEach(() => {
    delete globalThis.QRCode;
    document.body.replaceChildren();
});

describe('shared QR code adapter', () => {
    it('renders through the single QRCode constructor and maps common options', async () => {
        const captured = [];
        globalThis.QRCode = class QRCode {
            static CorrectLevel = { L: 'low', M: 'medium', Q: 'quartile', H: 'high' };

            constructor(target, options) {
                captured.push(options);
                const image = target.ownerDocument.createElement('img');
                image.src = 'data:image/png;base64,qr';
                target.appendChild(image);
            }
        };

        const target = document.createElement('div');
        document.body.appendChild(target);
        await renderQrCode(target, {
            text: 'https://sei.example/processo',
            size: 150,
            fill: '#333333',
            background: '#ffffff',
            ecLevel: 'L',
            minVersion: 6
        });

        expect(captured[0]).toMatchObject({
            text: 'https://sei.example/processo',
            width: 150,
            height: 150,
            typeNumber: 6,
            colorDark: '#333333',
            colorLight: '#ffffff',
            correctLevel: 'low'
        });
        expect(target.querySelector('img')?.src).toBe('data:image/png;base64,qr');
    });

    it('hydrates encoded placeholders after the lazy library is available', async () => {
        globalThis.QRCode = class QRCode {
            static CorrectLevel = { M: 'medium' };

            constructor(target) {
                const image = target.ownerDocument.createElement('img');
                image.src = 'data:image/png;base64,qr';
                target.appendChild(image);
            }
        };

        const root = document.createElement('div');
        root.innerHTML = createQrCodePlaceholder('texto & acentuação');
        document.body.appendChild(root);
        await hydrateQrCodePlaceholders(root);

        expect(root.querySelector('[data-seipro-qr-code]')).toBeNull();
        expect(root.querySelector('img')).not.toBeNull();
    });

    it('reports rendering failures to the caller', async () => {
        globalThis.QRCode = vi.fn(() => { throw new Error('bad QR'); });
        const target = document.createElement('div');
        await expect(renderQrCode(target, { text: 'x' })).rejects.toThrow('bad QR');
    });
});

