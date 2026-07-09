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

  it('uses a seipro-prefixed hook for user chat responses while preserving history restore', () => {
    const ai = read('src/features/ai/sei-pro-ai.js');

    expect(ai).toContain('class="seipro-ai-user-response"');
    expect(ai).toContain("$('#response_ai .seipro-ai-user-response, #response_ai .seipro-ai-bot-response').remove()");

    expect(ai).not.toMatch(/class="response_user"/);
    expect(ai).not.toMatch(/#response_ai \.response_user/);
  });

  it('adds a seipro-prefixed hook for bot chat responses while preserving legacy response styling', () => {
    const ai = read('src/features/ai/sei-pro-ai.js');

    expect(ai).toContain('response_bot seipro-ai-bot-response response_${currentPlataform} loading');
    expect(ai).toContain("$('#response_ai .seipro-ai-user-response, #response_ai .seipro-ai-bot-response').remove()");
    expect(ai).toContain("_this.closest('.seipro-ai-bot-response').text().trim()");
    expect(ai).toContain('response_bot_content');

    expect(ai).not.toMatch(/#response_ai \.response_bot/);
    expect(ai).not.toMatch(/closest\('\.response_bot'\)/);
  });

  it('uses a seipro-prefixed hook for adding AI responses to the editor while preserving the data-response action', () => {
    const ai = read('src/features/ai/sei-pro-ai.js');

    expect(ai).toContain('class="seipro-ai-add-doc-response"');
    expect(ai).toContain(".on('click', '.seipro-ai-add-doc-response'");
    expect(ai).toContain('data-response="${respost_id}"');
    expect(ai).toContain('addDocResponseAI(this)');

    expect(ai).not.toMatch(/class="add_doc_response_ai"/);
    expect(ai).not.toMatch(/\.add_doc_response_ai/);
  });
});
