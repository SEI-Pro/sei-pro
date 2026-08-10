import { describe, expect, it, vi } from 'vitest';
import { runInstallersSafely } from '../../src/app/installers.ts';

describe('isolated composition installers', () => {
    it('continues after a failure and reports the installer id', () => {
        const order = [];
        const logger = { error: vi.fn() };

        const report = runInstallersSafely([
            ['first', () => order.push('first')],
            ['broken', () => {
                order.push('broken');
                throw new Error('boom');
            }],
            ['last', () => order.push('last')]
        ], { logger });

        expect(order).toEqual(['first', 'broken', 'last']);
        expect(report.failed).toEqual(['broken']);
        expect(logger.error).toHaveBeenCalledWith(
            'installer "broken" falhou',
            expect.any(Error)
        );
    });
});
