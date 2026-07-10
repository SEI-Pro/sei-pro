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
    expect(ai).toContain('seipro-ai-doc-tag-remove');
    expect(ai).toContain("$('#docAIMultiList .seipro-ai-doc-tag')");
    expect(ai).toContain("$(this).closest('.seipro-ai-doc-tag').remove()");

    expect(ai).not.toMatch(/class="doc-ai-tag"/);
    expect(ai).not.toMatch(/class="[^\"]*doc-ai-tag-remove/);
    expect(ai).not.toMatch(/#docAIMultiList \.doc-ai-tag/);
    expect(ai).not.toMatch(/closest\('\.doc-ai-tag'\)/);
    expect(ai).not.toMatch(/\.on\('click', '\.doc-ai-tag-remove'/);
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

  it('uses a seipro-prefixed hook for creating SEI documents from AI responses while preserving the data-response action', () => {
    const ai = read('src/features/ai/sei-pro-ai.js');

    expect(ai).toContain('class="seipro-ai-create-doc-response"');
    expect(ai).toContain(".on('click', '.seipro-ai-create-doc-response'");
    expect(ai).toContain('data-response="${respost_id}"');
    expect(ai).toContain('createDocResponseAI(this)');

    expect(ai).not.toMatch(/class="create_doc_response_ai"/);
    expect(ai).not.toMatch(/\.create_doc_response_ai/);
  });

  it('uses a seipro-prefixed hook for copying plain-text AI responses while preserving legacy styling', () => {
    const ai = read('src/features/ai/sei-pro-ai.js');

    expect(ai).toContain('class="copy_response_ai seipro-ai-copy-response"');
    expect(ai).toContain(".on('click', '.seipro-ai-copy-response'");
    expect(ai).toContain(".on('dblclick', '.seipro-ai-copy-response'");
    expect(ai).toContain('copyResponseAI(this)');
    expect(ai).toContain('data-response="${respost_id}"');

    expect(ai).not.toMatch(/\.on\('click', '\.copy_response_ai'/);
    expect(ai).not.toMatch(/\.on\('dblclick', '\.copy_response_ai'/);
  });

  it('uses a seipro-prefixed hook for copying formatted AI responses while preserving the data-response action', () => {
    const ai = read('src/features/ai/sei-pro-ai.js');

    expect(ai).toContain('class="seipro-ai-copy-html-response"');
    expect(ai).toContain(".on('click', '.seipro-ai-copy-html-response'");
    expect(ai).toContain('copyHtmlResponseAI(this)');
    expect(ai).toContain('data-response="${respost_id}"');

    expect(ai).not.toMatch(/class="copy_html_response_ai"/);
    expect(ai).not.toMatch(/\.copy_html_response_ai/);
  });

  it('adds a seipro-prefixed hook for speech playback while preserving legacy styling and data-response', () => {
    const ai = read('src/features/ai/sei-pro-ai.js');

    expect(ai).toContain('class="speech_response_ai seipro-ai-speech-response"');
    expect(ai).toContain(".on('click', '.seipro-ai-speech-response'");
    expect(ai).toContain("_this.closest('.seipro-ai-bot-response').text().trim()");
    expect(ai).toContain('data-response="${respost_id}"');

    expect(ai).not.toMatch(/\.on\('click', '\.speech_response_ai'/);
  });

  it('adds seipro-prefixed hooks for AI suggestion cards while preserving legacy styling classes and data contracts', () => {
    const ai = read('src/features/ai/sei-pro-ai.js');

    expect(ai).toContain('class="suggestions seipro-ai-suggestions"');
    expect(ai).toContain('class="suggestion_actions seipro-ai-suggestion-action"');
    expect(ai).toContain(".on('click', '.seipro-ai-suggestion-action'");
    expect(ai).toContain("$('.seipro-ai-suggestions').find('.seipro-ai-suggestion-action[data-type=\"personalizado\"]').remove()");
    expect(ai).toContain("$('.seipro-ai-suggestions').append(normalizeHTML(htmlFav))");
    expect(ai).toContain('data-send="true"');
    expect(ai).toContain('data-type="resume"');

    expect(ai).not.toMatch(/\.on\('click', '\.suggestion_actions'/);
    expect(ai).not.toMatch(/\$\('\.suggestions'\)/);
    expect(ai).not.toMatch(/\$\('\.suggestions'\)\.append/);
  });

  it('uses a seipro-prefixed hook for removing favorite AI suggestions while preserving the favorite prompt data contract', () => {
    const ai = read('src/features/ai/sei-pro-ai.js');

    expect(ai).toContain('class="seipro-ai-remove-suggestion far fa-trash cinzaColor"');
    expect(ai).toContain(".on('click', '.seipro-ai-remove-suggestion'");
    expect(ai).toContain('data-index="${i}"');
    expect(ai).toContain('removeFavoritePromptByIndex($(this).data(\'index\'))');

    expect(ai).not.toMatch(/class="suggestion_actions_remove/);
    expect(ai).not.toMatch(/\.on\('click', '\.suggestion_actions_remove'/);
  });

  it('adds a seipro-prefixed hook for prompt document references while preserving legacy styling', () => {
    const ai = read('src/features/ai/sei-pro-ai.js');

    expect(ai).toContain('prompt_ref_doc seipro-ai-prompt-ref-doc doc_${hash_doc}');
    expect(ai).toContain("input_prompt.find('.seipro-ai-prompt-ref-doc')");
    expect(ai).toContain('data-id_documento="all"');
    expect(ai).toContain('contenteditable="false"');

    expect(ai).not.toMatch(/input_prompt\.find\('\.prompt_ref_doc'\)/);
    expect(ai).not.toMatch(/class="prompt_ref_doc doc_\$\{hash_doc\}"/);
  });

  it('adds a seipro-prefixed hook for AI response content while preserving legacy content styling', () => {
    const ai = read('src/features/ai/sei-pro-ai.js');

    expect(ai).toContain("response_bot_content seipro-ai-response-content");
    expect(ai).toContain("$(`#responseBot_${id_response} .seipro-ai-response-content`).html()");
    expect(ai).toContain("copyTextWithBR($(`#responseBot_${id_response} .seipro-ai-response-content`))");

    expect(ai).not.toMatch(/`#responseBot_\$\{id_response\} \.response_bot_content`/);
  });

  it('adds a seipro-prefixed hook for the BotPro animation target while preserving legacy icon styling', () => {
    const ai = read('src/features/ai/sei-pro-ai.js');

    expect(ai).toContain('class="icon_ia seipro-ai-icon"');
    expect(ai).toContain("alvo: '.seipro-ai-icon'");
    expect(ai).toContain("adicionarVideoWebM({webmSrc: URL_SPRO+'icons/menu/botpro_idea.webm'");

    expect(ai).not.toContain("alvo: '.icon_ia'");
    expect(ai).not.toMatch(/class="icon_ia"/);
  });

  it('adds a seipro-prefixed hook for the AI dialog wrapper while preserving legacy dialog styling', () => {
    const ai = read('src/features/ai/sei-pro-ai.js');

    expect(ai).toContain('class="dialogBoxAI seipro-ai-dialog"');

    expect(ai).not.toMatch(/class="dialogBoxAI"/);
  });

  it('adds a seipro-prefixed hook for the AI welcome block while preserving legacy welcome styling', () => {
    const ai = read('src/features/ai/sei-pro-ai.js');

    expect(ai).toContain('class="welcome seipro-ai-welcome"');
    expect(ai).toContain('class="icon_ia seipro-ai-icon"');

    expect(ai).not.toMatch(/class="welcome"/);
  });

  it('uses a seipro-prefixed hook for the AI prompt bar while preserving prompt/document field ids', () => {
    const ai = read('src/features/ai/sei-pro-ai.js');

    expect(ai).toContain('class="seipro-ai-prompt-bar"');
    expect(ai).toContain('id="promptAISelect"');
    expect(ai).toContain('id="docAISelect"');
    expect(ai).toContain('id="promptAIPersonal"');

    expect(ai).not.toMatch(/class="input_prompt"/);
  });

  it('uses a seipro-prefixed hook for the AI prompt selector while preserving the prompt select id', () => {
    const ai = read('src/features/ai/sei-pro-ai.js');

    expect(ai).toContain('id="promptAISelect" class="seipro-ai-prompt-select"');
    expect(ai).toContain('buildPromptOptions()');

    expect(ai).not.toMatch(/class="prompt_type"/);
  });

  it('uses a seipro-prefixed hook for the AI document selector while preserving the document select id', () => {
    const ai = read('src/features/ai/sei-pro-ai.js');

    expect(ai).toContain('id="docAISelect" class="seipro-ai-doc-select"');
    expect(ai).toContain("$('#docAISelect_chosen')");
    expect(ai).toContain("$(document).off('change', '#docAISelect')");

    expect(ai).not.toMatch(/class="prompt_doc"/);
  });

  it('adds a seipro-prefixed hook for the custom-prompt document selector mode while preserving legacy CSS state', () => {
    const ai = read('src/features/ai/sei-pro-ai.js');

    expect(ai).toContain("addClass('prompt_personal seipro-ai-personal-prompt-mode')");
    expect(ai).toContain("removeClass('prompt_personal seipro-ai-personal-prompt-mode')");
    expect(ai).toContain('id="promptAIPersonal"');
    expect(ai).toContain('id="docAISelect" class="seipro-ai-doc-select"');
  });

  it('adds a seipro-prefixed hook for editor document-selector mode while preserving legacy CSS state', () => {
    const ai = read('src/features/ai/sei-pro-ai.js');

    expect(ai).toContain("addClass('prompt_editor_sei seipro-ai-editor-doc-mode')");
    expect(ai).toContain('id="docAISelect" class="seipro-ai-doc-select"');
  });

  it('uses a seipro-prefixed hook for the Gemini token save button while preserving platform detection', () => {
    const ai = read('src/features/ai/sei-pro-ai.js');

    expect(ai).toContain('class="cke_dialog_ui_button cke_dialog_ui_button_cancel seipro-ai-gemini-token"');
    expect(ai).toContain("hasClass('seipro-ai-gemini-token') ? 'gemini'");
    expect(ai).toContain('id="plataformAI_uiElement"');
    expect(ai).toContain('id="cke_inputSecretKey_textInput"');

    expect(ai).not.toMatch(/class="[^\"]*gemini_token/);
    expect(ai).not.toMatch(/hasClass\('gemini_token'\)/);
  });

  it('uses a seipro-prefixed hook for the OpenAI token save button while preserving platform detection', () => {
    const ai = read('src/features/ai/sei-pro-ai.js');

    expect(ai).toContain('class="cke_dialog_ui_button cke_dialog_ui_button_cancel seipro-ai-openai-token"');
    expect(ai).toContain("hasClass('seipro-ai-openai-token') ? 'openai'");
    expect(ai).toContain('id="plataformAI_uiElement"');
    expect(ai).toContain('id="cke_inputSecretKey_textInput"');

    expect(ai).not.toMatch(/class="[^\"]*openai_token/);
    expect(ai).not.toMatch(/hasClass\('openai_token'\)/);
  });

  it('uses a seipro-prefixed hook for the Ollama token save button while preserving platform detection', () => {
    const ai = read('src/features/ai/sei-pro-ai.js');

    expect(ai).toContain('class="cke_dialog_ui_button cke_dialog_ui_button_cancel seipro-ai-ollama-token"');
    expect(ai).toContain("hasClass('seipro-ai-ollama-token') ? 'ollama'");
    expect(ai).toContain('id="plataformAI_uiElement"');
    expect(ai).toContain('id="cke_inputOllamaUrl_textInput"');
    expect(ai).toContain('id="cke_inputOllamaKey_textInput"');
    expect(ai).toContain('id="cke_inputOllamaModel_textInput"');

    expect(ai).not.toMatch(/class="[^\"]*ollama_token/);
    expect(ai).not.toMatch(/hasClass\('ollama_token'\)/);
  });

  it('uses a seipro-prefixed hook for the typing animation checkbox while preserving config ids and legacy switch styling', () => {
    const ai = read('src/features/ai/sei-pro-ai.js');

    expect(ai).toContain('id="configAI_typing_box"');
    expect(ai).toContain('for="configAI_typing_box"');
    expect(ai).toContain('class="seipro-ai-typing-toggle infraLinkOrgao"');
    expect(ai).toContain("setOptionsPro('setTypingAI', $('#configAI_typing_box').is(':checked') ? 'checked' : '')");

    expect(ai).not.toMatch(/class="[^\"]*resume_doc/);
  });

  it('adds a seipro-prefixed hook for the beta-models checkbox while preserving config ids and legacy switch styling', () => {
    const ai = read('src/features/ai/sei-pro-ai.js');

    expect(ai).toContain('id="configAI_betamodels"');
    expect(ai).toContain('for="configAI_betamodels"');
    expect(ai).toContain('class="seipro-ai-beta-models-toggle infraLinkOrgao"');
    expect(ai).toContain("setOptionsPro('setBetaModelsAI', $('#configAI_betamodels').is(':checked') ? 'checked' : '')");
  });

  it('adds a seipro-prefixed hook for the advanced-config checkbox while preserving config ids and legacy switch styling', () => {
    const ai = read('src/features/ai/sei-pro-ai.js');

    expect(ai).toContain('id="configAI_advancedconfigs"');
    expect(ai).toContain('for="configAI_advancedconfigs"');
    expect(ai).toContain('class="seipro-ai-advanced-config-toggle infraLinkOrgao"');
    expect(ai).toContain("setOptionsPro('setAdvancedConfigs', $('#configAI_advancedconfigs').is(':checked') ? 'checked' : '')");
  });

  it('adds a seipro-prefixed hook for the Ollama manual-model row while preserving config ids and persistence', () => {
    const ai = read('src/features/ai/sei-pro-ai.js');

    expect(ai).toContain('id="configAI_ollama_model_row" class="seipro-ai-manual-model-row"');
    expect(ai).toContain('for="configAI_manual_model"');
    expect(ai).toContain('id="configAI_manual_model"');
    expect(ai).toContain("setOptionsPro('setModelOllama', modelToSave)");
  });

  it('adds a seipro-prefixed hook for the AI model select while preserving config id and persistence flow', () => {
    const ai = read('src/features/ai/sei-pro-ai.js');

    expect(ai).toContain('id="configAI_model" class="seipro-ai-model-select"');
    expect(ai).toContain('for="configAI_model"');
    expect(ai).toContain('optionsModels()');
    expect(ai).toContain("setOptionsPro('setModelOpenAI', $('#configAI_model').val())");
    expect(ai).toContain("setOptionsPro('setModelGemini', $('#configAI_model').val())");
  });

  it('adds a seipro-prefixed hook for the AI history restore link while preserving the legacy id', () => {
    const ai = read('src/features/ai/sei-pro-ai.js');

    expect(ai).toContain('id="historyDialogAI" class="seipro-ai-history-link"');
    expect(ai).toContain("$('.seipro-ai-history-link').after(sanitizeHTML(historyDialogArray.join(''))).remove()");
    expect(ai).toContain(".on('click', '.seipro-ai-history-link'");
    expect(ai).toContain("sessionStorage.getItem('historyDialogAI')");

    expect(ai).not.toMatch(/\.on\('click', '#historyDialogAI'/);
    expect(ai).not.toMatch(/\$\('#historyDialogAI'\)\.after/);
  });

  it('adds a seipro-prefixed hook for the AI consent disclaimer while preserving legacy disclaimer styling', () => {
    const ai = read('src/features/ai/sei-pro-ai.js');

    expect(ai).toContain('id="cke_382_uiElement" class="cke_dialog_ui_text editorTextDisclaimer seipro-ai-consent-disclaimer"');
    expect(ai).toContain('id="ciente_disclaimer"');
    expect(ai).toContain('for="ciente_disclaimer"');
  });

  it('adds a seipro-prefixed hook for the AI system instruction field while preserving config id and persistence', () => {
    const ai = read('src/features/ai/sei-pro-ai.js');

    expect(ai).toContain('id="configAI_system_instruction" class="seipro-ai-system-instruction"');
    expect(ai).toContain('for="configAI_system_instruction"');
    expect(ai).toContain("setOptionsPro('setSystemInstructionAI', $('#configAI_system_instruction').val())");
  });

  it('adds a seipro-prefixed hook for the AI temperature field while preserving config id and persistence', () => {
    const ai = read('src/features/ai/sei-pro-ai.js');

    expect(ai).toContain('id="configAI_temperature" class="seipro-ai-temperature-input"');
    expect(ai).toContain('for="configAI_temperature"');
    expect(ai).toContain("setOptionsPro('setTemperatureAI', $('#configAI_temperature').val())");
  });

  it('adds a seipro-prefixed hook for the AI max tokens field while preserving config id and persistence', () => {
    const ai = read('src/features/ai/sei-pro-ai.js');

    expect(ai).toContain('id="configAI_max_tokens" class="seipro-ai-max-tokens-input"');
    expect(ai).toContain('for="configAI_max_tokens"');
    expect(ai).toContain("setOptionsPro('setMaxTokenAI', $('#configAI_max_tokens').val())");
  });

  it('adds a seipro-prefixed hook for the AI top-p field while preserving config id and persistence', () => {
    const ai = read('src/features/ai/sei-pro-ai.js');

    expect(ai).toContain('id="configAI_top_p" class="seipro-ai-top-p-input"');
    expect(ai).toContain('for="configAI_top_p"');
    expect(ai).toContain("setOptionsPro('setTopPAI', $('#configAI_top_p').val())");
  });
});
