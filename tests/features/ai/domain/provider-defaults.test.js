import { describe, expect, it } from 'vitest';
import { providerDefaults } from '../../../../src/features/ai/domain/provider-defaults.ts';

describe('providerDefaults', () => {
    it('returns a copy of known provider defaults', () => {
        const openai = providerDefaults('openai');
        expect(openai).toEqual({
            baseUrl: 'https://api.openai.com',
            model: 'gpt-4.1-mini'
        });
        openai.model = 'mutated';
        expect(providerDefaults('openai').model).toBe('gpt-4.1-mini');
    });

    it('falls back to openai defaults for unknown providers', () => {
        expect(providerDefaults('unknown-provider')).toEqual(providerDefaults('openai'));
    });
});
