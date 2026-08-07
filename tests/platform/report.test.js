// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createNamespace } from '@src/core/namespace.ts';
import { installReport } from '@src/platform/report.ts';
import { getSeiPro, globalRef } from '@src/core/global.ts';

function setup(sendImpl) {
    delete globalRef.SeiPro;
    // reset flags de captura/idempotência entre testes
    delete window.__SEI_PRO_LOG_CAPTURE_INSTALLED__;
    delete window.__SEI_PRO_LOG_BUFFER__;
    delete window.__SEI_PRO_AUTO_REPORT_SENDING__;
    delete window.__SEI_PRO_BUG_REPORT_OPT_IN__;
    window.sessionStorage.clear();
    createNamespace();
    getSeiPro().core.messaging = { sendMessage: sendImpl || (() => Promise.resolve({ ok: true })) };
    return installReport();
}

describe('platform/report', () => {
    beforeEach(() => { window.VERSION_SPRO = '9.9.9'; });

    it('pushLog acumula entradas; getCollectedLogs deduplica entradas idênticas (mesmo ts)', () => {
        // Congela o tempo p/ que duas entradas idênticas colapsem (o dedup é por
        // string exata — cobre a sobreposição buffer local × sessionStorage).
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2026-06-24T12:00:00.000Z'));
        const r = setup();
        r.pushLog('log', ['abc']);
        r.pushLog('log', ['abc']);   // idêntica (mesmo timestamp)
        r.pushLog('warn', ['xyz']);
        const logs = r.getCollectedLogs();
        expect(logs.filter((l) => l.includes('abc'))).toHaveLength(1);
        expect(logs.some((l) => l.includes('[WARN]') && l.includes('xyz'))).toBe(true);
        vi.useRealTimers();
    });

    it('buildBugPayload inclui versão, página e logs serializados', () => {
        const r = setup();
        r.pushLog('error', ['boom']);
        const p = r.buildBugPayload({ tipo: 'bug', descricao: 'oi', origem: 'teste' });
        expect(p.versao).toBe('9.9.9');
        expect(p.descricao).toContain('oi');
        expect(p.descricao).toContain('Origem: teste');
        expect(p.logs).toContain('boom');
    });

    it('scheduleAutomaticErrorReport debounce + dedup por assinatura: envia uma vez', async () => {
        vi.useFakeTimers();
        const send = vi.fn(() => Promise.resolve({ ok: true }));
        const r = setup(send);
        window.__SEI_PRO_BUG_REPORT_OPT_IN__ = true;
        r.scheduleAutomaticErrorReport('Erro X', 'console.error');
        r.scheduleAutomaticErrorReport('Erro X', 'console.error'); // mesma assinatura
        await vi.advanceTimersByTimeAsync(2000);
        expect(send).toHaveBeenCalledTimes(1);
        expect(send.mock.calls[0][0].action).toBe('enviarRelatorioBug');
        // nova tentativa com a mesma assinatura não reenvia
        r.scheduleAutomaticErrorReport('Erro X', 'console.error');
        await vi.advanceTimersByTimeAsync(2000);
        expect(send).toHaveBeenCalledTimes(1);
        vi.useRealTimers();
    });

    it('não reporta mensagens que são o próprio resultado de envio', () => {
        vi.useFakeTimers();
        const send = vi.fn(() => Promise.resolve({ ok: true }));
        const r = setup(send);
        r.scheduleAutomaticErrorReport('Relatório enviado com sucesso', 'x');
        vi.advanceTimersByTime(2000);
        expect(send).not.toHaveBeenCalled();
        vi.useRealTimers();
    });

    it('não reporta "Extension context invalidated" (extensão recarregada com aba antiga)', () => {
        vi.useFakeTimers();
        const send = vi.fn(() => Promise.resolve({ ok: true }));
        const r = setup(send);
        r.scheduleAutomaticErrorReport('Uncaught Error: Extension context invalidated.', 'window.error');
        r.scheduleAutomaticErrorReport('Error: Extension context was invalidated.', 'window.error');
        vi.advanceTimersByTime(2000);
        expect(send).not.toHaveBeenCalled();
        vi.useRealTimers();
    });
});
