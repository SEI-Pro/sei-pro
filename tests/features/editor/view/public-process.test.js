// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from 'vitest';
import {
    checkDadosIframeProcessoPublicoPro,
    getCheckerProcessoPublicoPro
} from '../../../../src/features/editor/view/dialogs/public-process.ts';
import { api } from '../../../../src/features/editor/api.ts';

describe('public process dialog', () => {
    afterEach(() => {
        document.body.replaceChildren();
        api.checkDadosIframeProcessoPublicoPro = checkDadosIframeProcessoPublicoPro;
        vi.useRealTimers();
    });

    it('creates the hidden checker iframe without jQuery appendTo()', () => {
        getCheckerProcessoPublicoPro();
        getCheckerProcessoPublicoPro();

        const frame = document.querySelector('#frmCheckerProcessoPublicoPro');
        expect(frame?.tagName).toBe('IFRAME');
        expect(frame?.getAttribute('tabindex')).toBe('-1');
        expect(document.querySelectorAll('#frmCheckerProcessoPublicoPro')).toHaveLength(1);
    });

    it('waits for a CAPTCHA image instead of requesting /undefined', () => {
        vi.useFakeTimers();
        getCheckerProcessoPublicoPro();
        const frame = document.querySelector('#frmCheckerProcessoPublicoPro');
        frame.contentDocument.body.innerHTML = '<div id="seiSearch"></div><div id="lblCaptcha"></div>';
        document.body.insertAdjacentHTML('beforeend', '<div id="searchPub_captcha"></div>');
        const retry = vi.fn();
        api.checkDadosIframeProcessoPublicoPro = retry;

        checkDadosIframeProcessoPublicoPro(100);
        vi.advanceTimersByTime(500);

        expect(document.querySelector('#searchPub_captcha img')).toBeNull();
        expect(retry).toHaveBeenCalledWith(0);
    });
});
