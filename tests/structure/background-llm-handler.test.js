import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  isAllowedLlmUrl,
  resolveLlmRequest
} from '../../src/background/llm-handler.js';

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
    const background = readFileSync(join(rootDir, 'src/background/background.js'), 'utf8');
    const handler = readFileSync(join(rootDir, 'src/background/llm-handler.js'), 'utf8');
    const build = readFileSync(join(rootDir, 'scripts/build.mjs'), 'utf8');
    const manifest = JSON.parse(readFileSync(join(rootDir, 'manifest.base.json'), 'utf8'));

    expect(background).toMatch(/importScripts\([^)]*'llm-handler\.js'/);
    expect(background).toMatch(/SeiProBackgroundLlm\.handleLlmConnect\(port, browser\)/);
    expect(handler).toMatch(/response\.body\.getReader\(\)/);
    expect(handler).toMatch(/new TextDecoder\(\)/);
    expect(build).toMatch(/src\/background\/llm-handler\.js/);
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
});
