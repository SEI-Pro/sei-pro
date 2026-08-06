// @vitest-environment jsdom

import { afterEach, describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const rootDir = process.cwd();
const bridgeSource = readFileSync(join(rootDir, 'src/shared/qr-code-main.js'), 'utf8');

afterEach(() => {
    delete window.__SEI_PRO_QR_BRIDGE__;
    delete window.QRCode;
    document.body.replaceChildren();
    document.head.querySelectorAll('script').forEach((script) => script.remove());
});

describe('QR main-world bridge', () => {
    it('renders a request received through the DOM event boundary', async () => {
        window.QRCode = class QRCode {
            static CorrectLevel = { M: 'medium' };

            constructor(target) {
                const image = target.ownerDocument.createElement('img');
                image.src = 'data:image/png;base64,bridge';
                target.appendChild(image);
            }
        };
        // The bridge is intentionally a classic script in the packaged WAR.
        // Evaluate it in jsdom's window to exercise the same event contract.
        window.eval(bridgeSource);

        const target = document.createElement('div');
        target.setAttribute('data-seipro-qr-options', JSON.stringify({ text: 'abc', size: 100 }));
        target.setAttribute('data-seipro-qr-script', 'chrome-extension://test/js/lib/qrcode.min.js');
        document.body.appendChild(target);
        target.dispatchEvent(new Event('seipro-qr-render', { bubbles: false }));
        await new Promise((resolve) => setTimeout(resolve, 0));

        expect(target.querySelector('img')?.src).toBe('data:image/png;base64,bridge');
        expect(target.hasAttribute('data-seipro-qr-options')).toBe(false);
    });
});
