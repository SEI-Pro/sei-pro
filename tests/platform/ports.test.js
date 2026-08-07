import { describe, expect, it, vi } from 'vitest';
import { createStorage } from '../../src/platform/storage.ts';
import { createLogger } from '../../src/platform/logger.ts';
import { createMessaging } from '../../src/platform/messaging.ts';
import { fakeStorage } from '../fakes/fakeStorage.js';
import { fakeLogger } from '../fakes/fakeLogger.js';

describe('platform ports as createX factories (ADR-0005)', () => {
    it('createMessaging.sendMessage uses injected runtime', async () => {
        const sendMessage = vi.fn((_msg, cb) => {
            cb({ ok: true, data: 1 });
        });
        const messaging = createMessaging({ runtime: { sendMessage } });
        const result = await messaging.sendMessage({ action: 'ping' });
        expect(result).toEqual({ ok: true, data: 1 });
        expect(sendMessage).toHaveBeenCalledOnce();
    });

    it('createMessaging rejects when runtime lacks sendMessage', async () => {
        const messaging = createMessaging({ runtime: {} });
        await expect(messaging.sendMessage({ action: 'x' })).rejects.toThrow(/indisponível/);
    });

    it('createStorage delegates through injected messaging', async () => {
        const sendMessage = vi.fn(async (msg) => {
            if (msg.action === 'storageGet') return { ok: true, data: { a: 1 } };
            if (msg.action === 'storageSet') return { ok: true, data: undefined };
            return { ok: false, error: 'unexpected' };
        });
        const storage = createStorage({ messaging: { sendMessage } });
        await expect(storage.getLocal(['a'])).resolves.toEqual({ a: 1 });
        await storage.setLocal({ a: 2 });
        expect(sendMessage).toHaveBeenCalledWith(
            expect.objectContaining({ action: 'storageGet', area: 'local' })
        );
        expect(sendMessage).toHaveBeenCalledWith(
            expect.objectContaining({ action: 'storageSet', area: 'local', items: { a: 2 } })
        );
    });

    it('createLogger scopes messages and respects isDebugEnabled', () => {
        const sink = { log: vi.fn(), warn: vi.fn(), error: vi.fn() };
        const logger = createLogger({
            scope: 'lista',
            isDebugEnabled: () => true,
            sink
        });
        logger.debug('hi');
        logger.warn('w');
        logger.error('e');
        expect(sink.log).toHaveBeenCalledWith('[lista]', 'hi');
        expect(sink.warn).toHaveBeenCalledWith('[lista]', 'w');
        expect(sink.error).toHaveBeenCalledWith('[lista]', 'e');
    });

    it('createLogger skips debug when disabled', () => {
        const sink = { log: vi.fn(), warn: vi.fn(), error: vi.fn() };
        const logger = createLogger({ isDebugEnabled: () => false, sink });
        logger.debug('nope');
        expect(sink.log).not.toHaveBeenCalled();
    });

    it('fakeStorage mirrors the storage port surface', async () => {
        const storage = fakeStorage({ local: { k: 'v' } });
        await expect(storage.getLocal({ k: null })).resolves.toEqual({ k: 'v' });
        await storage.setSync({ x: 1 });
        await expect(storage.getSync(['x'])).resolves.toEqual({ x: 1 });
        await storage.removeSync('x');
        await expect(storage.getSync(['x'])).resolves.toEqual({ x: undefined });
    });

    it('fakeLogger records levels for boot tests', () => {
        const logger = fakeLogger({ scope: 'test' });
        logger.warn('a');
        logger.error('b', new Error('x'));
        expect(logger.messagesOf('warn')).toEqual([['a']]);
        expect(logger.messagesOf('error')[0][0]).toBe('b');
    });
});
