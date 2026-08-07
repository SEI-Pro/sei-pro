import { describe, expect, it } from 'vitest';
import { validateToolCall } from '../../../../src/core/llm/tools.ts';
import {
    AI_TOOL_DEFINITIONS,
    getAiToolDefinition
} from '../../../../src/features/ai/tools/definitions.ts';

describe('AI read-tool definitions', () => {
    it('exposes only read-only process tools', () => {
        expect(AI_TOOL_DEFINITIONS.map((tool) => tool.name)).toEqual([
            'listar_documentos',
            'ler_documento',
            'dados_processo',
            'documento_atual',
            'historico_processo',
            'buscar_legislacao'
        ]);
        expect(AI_TOOL_DEFINITIONS.some((tool) =>
            /criar|assinar|tramitar|alterar/.test(tool.name)
        )).toBe(false);
    });

    it('validates legislation search terms strictly', () => {
        const definition = getAiToolDefinition('buscar_legislacao');
        expect(validateToolCall(definition, { termo: 'Lei 8.112' })).toBe(true);
        expect(validateToolCall(definition, { termo: 'x' })).toBe(false);
        expect(validateToolCall(definition, { termo: 'Lei', write: true })).toBe(false);
    });

    it('validates ler_documento arguments strictly', () => {
        const definition = getAiToolDefinition('ler_documento');
        expect(validateToolCall(definition, { numero_sei: '2843449' })).toBe(true);
        expect(validateToolCall(definition, {})).toBe(false);
        expect(validateToolCall(definition, {
            numero_sei: '2843449',
            write: true
        })).toBe(false);
    });

    it('uses closed empty schemas for metadata tools', () => {
        const definition = getAiToolDefinition('dados_processo');
        expect(validateToolCall(definition, {})).toBe(true);
        expect(validateToolCall(definition, { unexpected: true })).toBe(false);
    });
});
