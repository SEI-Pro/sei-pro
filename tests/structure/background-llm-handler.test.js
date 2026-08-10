import { describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  createFetchTransport,
  isAllowedLlmUrl,
  resolveLlmRequest
} from '../../src/background/llm-handler.ts';

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '../..');

function browserWithProfiles(profiles) {
  return {
    runtime: { id: 'extension-id' },
    storage: {
      local: {
        get(_key, callback) {
          callback({ llmProfiles: profiles });
        }
      }
    }
  };
}

describe('background LLM handler', () => {
  it('is wired as a bundled service-worker dependency', () => {
    const background = readFileSync(join(rootDir, 'src/entries/background.js'), 'utf8');
    const handler = readFileSync(join(rootDir, 'src/background/llm-handler.ts'), 'utf8');
    const build = readFileSync(join(rootDir, 'scripts/build.mjs'), 'utf8') + '\n' + readFileSync(join(rootDir, 'scripts/dist-pipeline.mjs'), 'utf8');
    const manifest = JSON.parse(readFileSync(join(rootDir, 'manifest.base.json'), 'utf8'));

    expect(background).toContain("'llm-handler.js'");
    expect(background).toMatch(/SeiProBackgroundLlm\.handleLlmConnect\(port, browserApi\)/);
    expect(handler).toMatch(/response\.body\.getReader\(\)/);
    expect(handler).toMatch(/new TextDecoder\(\)/);
    expect(build).toMatch(/src\/background\/llm-handler\.(js|ts)/);
    expect(manifest.optional_host_permissions).toContain('https://api.openai.com/*');
    expect(manifest.optional_host_permissions).toContain('http://localhost/*');
  });

  it('allows known providers and the configured profile origin only', () => {
    expect(isAllowedLlmUrl('https://api.openai.com/v1/chat/completions')).toBe(true);
    expect(isAllowedLlmUrl(
      'https://llm.example.test/api/chat',
      { baseUrl: 'https://llm.example.test/api' }
    )).toBe(true);
    expect(isAllowedLlmUrl(
      'https://other.example.test/api/chat',
      { baseUrl: 'https://llm.example.test/api' }
    )).toBe(false);
    expect(isAllowedLlmUrl('http://api.openai.com/v1/chat/completions')).toBe(false);
  });

  it('loads credentials from local storage and ignores request credentials', async () => {
    const browserApi = browserWithProfiles([{
      id: 'work',
      providerId: 'openai',
      baseUrl: 'https://api.openai.com',
      key: 'stored-secret',
      model: 'gpt-model'
    }]);

    const resolved = await resolveLlmRequest({
      profile: { id: 'work', baseUrl: 'https://api.openai.com' },
      apiKey: 'injected-secret',
      key: 'injected-secret',
      messages: [{ role: 'user', content: 'Hello' }]
    }, browserApi);

    expect(resolved.apiKey).toBe('stored-secret');
    expect(resolved).not.toHaveProperty('key');
    expect(resolved.providerId).toBe('openai');
    expect(resolved.model).toBe('gpt-model');
  });

  it('requires explicit trust for a custom stored host', async () => {
    const browserApi = browserWithProfiles([{
      id: 'custom',
      providerId: 'openai_compatible',
      baseUrl: 'https://llm.example.test',
      key: 'secret',
      model: 'model',
      trusted: false
    }]);

    await expect(resolveLlmRequest({
      profile: { id: 'custom', baseUrl: 'https://llm.example.test' }
    }, browserApi)).rejects.toThrow('not trusted');
  });

  it('blocks external providers when llmProvedoresExternos is false', async () => {
    const browserApi = {
      runtime: { id: 'extension-id' },
      storage: {
        local: {
          get(_key, callback) {
            callback({
              llmProfiles: [{
                id: 'cloud',
                providerId: 'openai',
                baseUrl: 'https://api.openai.com',
                key: 'secret',
                model: 'gpt'
              }]
            });
          }
        },
        sync: {
          get(_key, callback) {
            callback({
              dataValues: JSON.stringify([{
                configGeral: [{ name: 'llmProvedoresExternos', value: false }]
              }])
            });
          }
        }
      }
    };

    await expect(resolveLlmRequest({
      profile: { id: 'cloud', baseUrl: 'https://api.openai.com' }
    }, browserApi)).rejects.toThrow('llmProvedoresExternos');
  });

  it('still allows localhost when external providers are disabled', async () => {
    const browserApi = {
      runtime: { id: 'extension-id' },
      storage: {
        local: {
          get(_key, callback) {
            callback({
              llmProfiles: [{
                id: 'local',
                providerId: 'ollama',
                baseUrl: 'http://localhost:11434',
                key: '',
                model: 'llama3.2'
              }]
            });
          }
        },
        sync: {
          get(_key, callback) {
            callback({
              dataValues: JSON.stringify([{
                configGeral: [{ name: 'llmProvedoresExternos', value: false }]
              }])
            });
          }
        }
      }
    };

    const resolved = await resolveLlmRequest({
      profile: { id: 'local', baseUrl: 'http://localhost:11434' }
    }, browserApi);
    expect(resolved.providerId).toBe('ollama');
  });

  it('explains provider rate limits and retry timing', async () => {
    const previousFetch = globalThis.fetch;
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 429,
      headers: { get: () => '20' }
    });

    try {
      await expect(createFetchTransport({ baseUrl: 'https://api.openai.com' }).postStream({
        url: 'https://api.openai.com/v1/chat/completions',
        body: {}
      })).rejects.toThrow('Aguarde 20 segundos');
    } finally {
      globalThis.fetch = previousFetch;
    }
  });
});
