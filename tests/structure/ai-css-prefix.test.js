import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '../..');

function read(relPath) {
  return readFileSync(join(rootDir, relPath), 'utf8');
}

describe('migration: AI CSS classes stay prefixed', () => {
  it('uses a seipro-prefixed hook for advanced configuration rows while preserving checkbox/config ids', () => {
    const ai = read('src/features/ai/sei-pro-ai.js');

    expect(ai).toContain('id="configAI_advancedconfigs"');
    expect(ai).toContain('for="configAI_advancedconfigs"');
    expect(ai).toContain('seipro-ai-advanced-config-row');
    expect(ai).toContain("$('.seipro-ai-advanced-config-row').show()");
    expect(ai).toContain("$('.seipro-ai-advanced-config-row').hide()");

    expect(ai).not.toMatch(/class="configAI_advancedconfigs/);
    expect(ai).not.toMatch(/\$\('\.configAI_advancedconfigs'\)/);
  });

  it('uses a seipro-prefixed hook for multi-document tags while preserving remove action', () => {
    const ai = read('src/features/ai/sei-pro-ai.js');

    expect(ai).toContain('seipro-ai-doc-tag');
    expect(ai).toContain('doc-ai-tag-remove');
    expect(ai).toContain("$('#docAIMultiList .seipro-ai-doc-tag')");
    expect(ai).toContain("$(this).closest('.seipro-ai-doc-tag').remove()");

    expect(ai).not.toMatch(/class="doc-ai-tag"/);
    expect(ai).not.toMatch(/#docAIMultiList \.doc-ai-tag/);
    expect(ai).not.toMatch(/closest\('\.doc-ai-tag'\)/);
  });
});
