import { describe, expect, it, vi } from 'vitest';
import { bootBackgroundContext } from '../../src/entries/background.js';

describe('background composition root', () => {
    it('loads classic handlers before registering MV3 listeners', () => {
        const scripts = [];
        const listeners = {};
        const router = vi.fn(() => true);
        const llm = vi.fn(() => true);
        const browserApi = {
            runtime: {
                onInstalled: { addListener: (fn) => { listeners.installed = fn; } },
                onMessage: { addListener: (fn) => { listeners.message = fn; } },
                onConnect: { addListener: (fn) => { listeners.connect = fn; } }
            }
        };
        const globalApi = {
            chrome: browserApi,
            importScripts: (...names) => {
                scripts.push(...names);
                globalApi.SeiProBackgroundRouter = { handleMessage: router };
                globalApi.SeiProBackgroundLlm = { handleLlmConnect: llm };
                globalApi.SeiProBackgroundInstall = { handleInstalled: vi.fn() };
            }
        };

        expect(bootBackgroundContext({ globalApi })).toBe(true);
        expect(scripts).toEqual([
            'storage-handler.js',
            'fetch-handler.js',
            'llm-handler.js',
            'bug-report-handler.js',
            'process-notification-handler.js',
            'install-handler.js',
            'router.js'
        ]);

        const sendResponse = vi.fn();
        expect(listeners.message({ action: 'test' }, { id: 'id' }, sendResponse)).toBe(true);
        expect(router).toHaveBeenCalledWith(
            { action: 'test' },
            { id: 'id' },
            sendResponse,
            browserApi
        );
        expect(listeners.connect({ name: 'test' })).toBe(true);
        expect(llm).toHaveBeenCalledWith({ name: 'test' }, browserApi);
    });

    it('does not boot when the browser API is unavailable', () => {
        expect(bootBackgroundContext({ globalApi: {} })).toBe(false);
    });
});
