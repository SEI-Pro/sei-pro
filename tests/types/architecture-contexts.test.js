import { describe, expect, it } from 'vitest';
import {
    CONTENT_SCOPE_IDS,
    EXECUTION_CONTEXT_IDS,
    FEATURE_CONTEXT_IDS,
    PAGE_CONTEXT_IDS,
    isCapabilityId,
    isExecutionContextId,
    isFeatureContextId,
    isPageContextId
} from '../../src/types/architecture-contexts.js';

describe('vocabulário arquitetural canônico', () => {
    it('separa contexto de execução, página e escopo amplo', () => {
        expect(EXECUTION_CONTEXT_IDS).toEqual([
            'service-worker', 'isolated-content', 'main-world', 'options'
        ]);
        expect(PAGE_CONTEXT_IDS).toContain('lista');
        expect(CONTENT_SCOPE_IDS).toEqual(['all']);
        expect(FEATURE_CONTEXT_IDS).toEqual([...PAGE_CONTEXT_IDS, ...CONTENT_SCOPE_IDS]);
    });

    it('não permite usar um nome de capability como contexto de página', () => {
        expect(isExecutionContextId('lista')).toBe(false);
        expect(isPageContextId('lista-processos')).toBe(false);
        expect(isFeatureContextId('all')).toBe(true);
    });

    it('aceita somente ids estáveis de capability', () => {
        expect(isCapabilityId('lista-processos')).toBe(true);
        expect(isCapabilityId('Atividades')).toBe(false);
        expect(isCapabilityId('')).toBe(false);
    });
});
