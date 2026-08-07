import { describe, expect, it, beforeEach } from 'vitest';
import { createNamespace } from '../../src/core/namespace.ts';
import { installNet } from '../../src/platform/net.ts';
import { getSeiPro, globalRef } from '../../src/core/global.ts';

// Install the net facade on top of a stub messaging transport whose response we
// control per test.
function installWithMessaging(responder) {
    delete globalRef.SeiPro;
    createNamespace();
    getSeiPro().core.messaging = {
        sendMessage: (message) => Promise.resolve(responder(message))
    };
    return { net: installNet() };
}

describe('SeiPro.core.net.fetch', () => {
    let sent;
    beforeEach(() => {
        sent = null;
    });

    it('delegates to the service worker via the fetch action', async () => {
        const { net } = installWithMessaging((message) => {
            sent = message;
            return { ok: true, status: 200, body: 'hello' };
        });
        const res = await net.fetch('https://example.test/x', { method: 'POST', body: 'b' });
        expect(sent.action).toBe('fetch');
        expect(sent.url).toBe('https://example.test/x');
        expect(sent.options).toEqual({ method: 'POST', body: 'b' });
        expect(res.body).toBe('hello');
    });

    it('resolves (does not reject) on an HTTP error status, preserving body', async () => {
        const { net } = installWithMessaging(() => ({
            ok: false,
            status: 400,
            body: '{"error":{"message":"bad"}}'
        }));
        const res = await net.fetch('https://example.test/x');
        expect(res.status).toBe(400);
        expect(JSON.parse(res.body).error.message).toBe('bad');
    });

    it('rejects on a transport-level failure (no HTTP response)', async () => {
        const { net } = installWithMessaging(() => ({ ok: false, error: 'URL não permitida' }));
        await expect(net.fetch('https://blocked.test/x')).rejects.toThrow('URL não permitida');
    });
});
