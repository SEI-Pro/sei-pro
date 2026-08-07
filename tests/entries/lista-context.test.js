/** @vitest-environment jsdom */
import { beforeEach, describe, expect, it } from 'vitest';
import { bootListaContext } from '../../src/entries/lista-context.ts';
import { fakeLogger } from '../fakes/fakeLogger.js';

const enabledConfig = { verifyConfigValue: () => true };

describe('lista context composition root', () => {
    beforeEach(() => {
        document.body.innerHTML = '<table id="tblProcessosRecebidos"></table>';
        delete document.__seiproNaoLidoBound;
    });

    it('installs the exclusive nao-lido capability through the generated registry', async () => {
        const result = await bootListaContext({
            root: document,
            config: enabledConfig,
            logger: fakeLogger(),
            messaging: { sendMessage: async () => ({ ok: true }) },
            storage: {}
        });

        expect(result.context).toBe('lista');
        expect(result.installed).toEqual(['nao-lido']);
        expect(result.failed).toEqual([]);
        expect(document.__seiproNaoLidoBound).toBe(true);
    });

    it('does not install a feature outside a process-list page', async () => {
        document.body.innerHTML = '<main></main>';
        const result = await bootListaContext({ root: document, config: enabledConfig, logger: fakeLogger() });
        expect(result.installed).toEqual([]);
    });
});
