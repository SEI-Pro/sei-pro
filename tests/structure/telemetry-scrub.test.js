/**
 * ADR-0015 / Phase S.5: bug-report telemetry redacts PII and is opt-in.
 */
// @vitest-environment jsdom
import { describe, expect, it, beforeEach, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createNamespace } from '../../src/core/namespace.ts';
import { installReport, redactTelemetryText } from '../../src/platform/report.ts';
import { getSeiPro, globalRef } from '../../src/core/global.ts';

const root = process.cwd();
const reportSource = readFileSync(join(root, 'src/platform/report.ts'), 'utf8');

function setup(sendImpl) {
    delete globalRef.SeiPro;
    delete window.__SEI_PRO_LOG_CAPTURE_INSTALLED__;
    delete window.__SEI_PRO_LOG_BUFFER__;
    delete window.__SEI_PRO_AUTO_REPORT_SENDING__;
    delete window.__SEI_PRO_BUG_REPORT_OPT_IN__;
    window.sessionStorage.clear();
    createNamespace();
    getSeiPro().core.messaging = { sendMessage: sendImpl || (() => Promise.resolve({ ok: true })) };
    return installReport();
}

describe('telemetry scrub (ADR-0015)', () => {
    beforeEach(() => {
        window.VERSION_SPRO = '9.9.9';
        Object.defineProperty(window, 'location', {
            configurable: true,
            value: {
                hostname: 'sei.prf.gov.br',
                href: 'https://sei.prf.gov.br/sei/controlador.php?acao=procedimento_controlar',
                pathname: '/sei/controlador.php'
            }
        });
    });

    it('redacts CPF, email, NUP/process numbers from text', () => {
        const raw = [
            'CPF 123.456.789-09 do interessado',
            'email user@example.gov.br',
            'NUP 00000.000000/2024-00',
            'processo 1234567-89.2024.4.01.3400'
        ].join(' | ');
        const scrubbed = redactTelemetryText(raw);
        expect(scrubbed).not.toMatch(/123\.456\.789-09/);
        expect(scrubbed).not.toMatch(/user@example\.gov\.br/);
        expect(scrubbed).not.toMatch(/00000\.000000\/2024-00/);
        expect(scrubbed).not.toMatch(/1234567-89\.2024\.4\.01\.3400/);
        expect(scrubbed).toMatch(/\[REDACTED_CPF\]|\[REDACTED_EMAIL\]|\[REDACTED_NUP\]|\[REDACTED_PROCESSO\]/);
    });

    it('buildBugPayload applies redaction and never embeds document HTML', () => {
        const r = setup();
        r.pushLog('error', ['falha CPF 529.982.247-25 e mail a@b.gov.br']);
        const p = r.buildBugPayload({
            tipo: 'bug',
            descricao: 'NUP 12345.678901/2023-12',
            origem: 'teste'
        });
        expect(p.descricao).not.toMatch(/12345\.678901\/2023-12/);
        expect(p.logs).not.toMatch(/529\.982\.247-25/);
        expect(p.logs).not.toMatch(/a@b\.gov\.br/);
        expect(p).not.toHaveProperty('html');
        expect(p).not.toHaveProperty('document');
        expect(JSON.stringify(p)).not.toMatch(/<html/i);
    });

    it('source gates automatic send on opt-in and requests Apps Script permission', () => {
        expect(reportSource).toMatch(/bugReportOptIn|isBugReportOptIn|__SEI_PRO_BUG_REPORT_OPT_IN__/);
        expect(reportSource).toMatch(/requestBugReportHostPermission|permissions\.request/);
        expect(reportSource).toMatch(/redactTelemetryText/);
    });

    it('does not auto-send when opt-in is false', async () => {
        vi.useFakeTimers();
        const send = vi.fn(() => Promise.resolve({ ok: true }));
        const r = setup(send);
        window.__SEI_PRO_BUG_REPORT_OPT_IN__ = false;
        r.scheduleAutomaticErrorReport('Erro Y', 'console.error');
        vi.advanceTimersByTime(2000);
        expect(send).not.toHaveBeenCalled();
        vi.useRealTimers();
    });
});
