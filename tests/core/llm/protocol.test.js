import { describe, expect, it } from 'vitest';
import {
    MESSAGE_ROLES,
    PROVIDER_IDS,
    createChatRequest,
    normalizeMessage
} from '../../../src/core/llm/protocol.js';

describe('LLM protocol', () => {
    it('normalizes messages for every supported role', () => {
        MESSAGE_ROLES.forEach(function (role) {
            expect(normalizeMessage(role, 'content')).toEqual({ role, content: 'content' });
        });
    });

    it('rejects unsupported roles', () => {
        expect(() => normalizeMessage('developer', 'content')).toThrow(/role/);
    });

    it('creates a normalized chat request', () => {
        const request = createChatRequest({
            providerId: 'openai',
            model: 'gpt-test',
            messages: [{ role: 'user', content: 'Hello' }],
            system: 'Be concise',
            tools: [{
                name: 'read_document',
                description: 'Read one document',
                parameters: { type: 'object', properties: {} }
            }],
            temperature: 0.2,
            maxTokens: 500,
            stream: true
        });

        expect(request).toMatchObject({
            providerId: 'openai',
            model: 'gpt-test',
            messages: [{ role: 'user', content: 'Hello' }],
            system: 'Be concise',
            temperature: 0.2,
            maxTokens: 500,
            stream: true
        });
        expect(PROVIDER_IDS).toContain('openai_compatible');
    });
});
