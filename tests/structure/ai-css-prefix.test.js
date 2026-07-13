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
    expect(ai).toContain("$(document).off('change', '.seipro-ai-doc-select')");

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

    expect(ai).toContain('class="cke_dialog_ui_button cke_dialog_ui_button_cancel seipro-ai-token-save-button seipro-ai-gemini-token"');
    expect(ai).toContain("hasClass('seipro-ai-gemini-token') ? 'gemini'");
    expect(ai).toContain('id="plataformAI_uiElement"');
    expect(ai).toContain('id="cke_inputSecretKey_textInput"');

    expect(ai).not.toMatch(/class="[^\"]*gemini_token/);
    expect(ai).not.toMatch(/hasClass\('gemini_token'\)/);
  });

  it('uses a seipro-prefixed hook for the OpenAI token save button while preserving platform detection', () => {
    const ai = read('src/features/ai/sei-pro-ai.js');

    expect(ai).toContain('class="cke_dialog_ui_button cke_dialog_ui_button_cancel seipro-ai-token-save-button seipro-ai-openai-token"');
    expect(ai).toContain("hasClass('seipro-ai-openai-token') ? 'openai'");
    expect(ai).toContain('id="plataformAI_uiElement"');
    expect(ai).toContain('id="cke_inputSecretKey_textInput"');

    expect(ai).not.toMatch(/class="[^\"]*openai_token/);
    expect(ai).not.toMatch(/hasClass\('openai_token'\)/);
  });

  it('uses a seipro-prefixed hook for the Ollama token save button while preserving platform detection', () => {
    const ai = read('src/features/ai/sei-pro-ai.js');

    expect(ai).toContain('class="cke_dialog_ui_button cke_dialog_ui_button_cancel seipro-ai-token-save-button seipro-ai-ollama-token"');
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
    expect(ai).toContain('class="infraAncoraSigla seipro-ai-typing-toggle-wrapper"');
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

  it('adds a seipro-prefixed hook for the beta-models toggle wrapper while preserving its legacy switch contract', () => {
    const ai = read('src/features/ai/sei-pro-ai.js');

    expect(ai).toContain('class="infraAncoraSigla seipro-ai-beta-models-toggle-wrapper"');
    expect(ai).toContain('id="configAI_betamodels"');
    expect(ai).toContain('for="configAI_betamodels"');
    expect(ai).toContain('class="seipro-ai-beta-models-toggle infraLinkOrgao"');
    expect(ai).toContain("setOptionsPro('setBetaModelsAI', $('#configAI_betamodels').is(':checked') ? 'checked' : '')");
  });

  it('adds a seipro-prefixed hook for the advanced-config checkbox while preserving config ids and legacy switch styling', () => {
    const ai = read('src/features/ai/sei-pro-ai.js');

    expect(ai).toContain('class="infraAncoraSigla seipro-ai-advanced-config-toggle-wrapper"');
    expect(ai).toContain('id="configAI_advancedconfigs"');
    expect(ai).toContain('for="configAI_advancedconfigs"');
    expect(ai).toContain('class="seipro-ai-advanced-config-toggle infraLinkOrgao"');
    expect(ai).toContain(".on('change', '.seipro-ai-advanced-config-toggle'");
    expect(ai).toContain("setOptionsPro('setAdvancedConfigs', $('#configAI_advancedconfigs').is(':checked') ? 'checked' : '')");

    expect(ai).not.toMatch(/\.on\('change', '#configAI_advancedconfigs'/);
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

  it('adds a seipro-prefixed hook for the AI consent toggle while preserving its acceptance flow', () => {
    const ai = read('src/features/ai/sei-pro-ai.js');

    expect(ai).toContain('class="cke_dialog_ui_checkbox_input seipro-ai-consent-toggle"');
    expect(ai).toContain('id="ciente_disclaimer"');
    expect(ai).toContain('for="ciente_disclaimer"');
    expect(ai).toContain("if ($('#ciente_disclaimer').is(':checked'))");
    expect(ai).toContain("setOptionsPro('consentimentoIA', true)");
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

  it('adds a seipro-prefixed hook for the AI frequency penalty field while preserving config id and persistence', () => {
    const ai = read('src/features/ai/sei-pro-ai.js');

    expect(ai).toContain('id="configAI_frequency_penalty" class="seipro-ai-frequency-penalty-input"');
    expect(ai).toContain('for="configAI_frequency_penalty"');
    expect(ai).toContain("setOptionsPro('setFrequencyPenaltyAI', $('#configAI_frequency_penalty').val())");
  });

  it('adds a seipro-prefixed hook for the AI presence penalty field while preserving config id and persistence', () => {
    const ai = read('src/features/ai/sei-pro-ai.js');

    expect(ai).toContain('id="configAI_presence_penalty" class="seipro-ai-presence-penalty-input"');
    expect(ai).toContain('for="configAI_presence_penalty"');
    expect(ai).toContain("setOptionsPro('setPresencePenaltyAI', $('#configAI_presence_penalty').val())");
  });

  it('adds a seipro-prefixed hook for the Ollama manual-model input while preserving id and persistence', () => {
    const ai = read('src/features/ai/sei-pro-ai.js');

    expect(ai).toContain('id="configAI_manual_model" class="seipro-ai-manual-model-input"');
    expect(ai).toContain('for="configAI_manual_model"');
    expect(ai).toContain("setOptionsPro('setModelOllama', modelToSave)");
  });

  it('delegates custom-prompt editor events through the feature hook while preserving persistence and send behavior', () => {
    const ai = read('src/features/ai/sei-pro-ai.js');

    expect(ai).toContain('id="promptAIPersonal" class="seipro-ai-personal-prompt-editor"');
    expect(ai).toContain(".on('keyup change mouseup keydown', '.seipro-ai-personal-prompt-editor'");
    expect(ai).toContain("localStorageStorePro('promptAIPersonal', $(this).html())");
    expect(ai).toContain('saveCursorPosition()');
    expect(ai).toContain('initAI(this)');

    expect(ai).not.toMatch(/\.on\('keyup change mouseup keydown', '#promptAIPersonal'/);
  });

  it('adds a seipro-prefixed hook for the AI typing cursor while preserving legacy styling', () => {
    const ai = read('src/features/ai/sei-pro-ai.js');

    expect(ai).toContain('class="blinker seipro-ai-typing-cursor"');
  });

  it('adds a seipro-prefixed hook for adding documents while preserving the legacy id', () => {
    const ai = read('src/features/ai/sei-pro-ai.js');

    expect(ai).toContain('class="newLink seipro-ai-add-document" id="btnAddDocAI"');
    expect(ai).toContain(".on('click', '.seipro-ai-add-document'");
    expect(ai).toContain('addDocToMultiList()');

    expect(ai).not.toMatch(/\.on\('click', '#btnAddDocAI'/);
  });

  it('adds a seipro-prefixed hook for the AI configuration button while preserving the legacy id', () => {
    const ai = read('src/features/ai/sei-pro-ai.js');

    expect(ai).toContain('class="newLink seipro-ai-config-button" id="btnConfigAI"');
    expect(ai).toContain(".on('click', '.seipro-ai-config-button'");
    expect(ai).toContain('configAI(this)');

    expect(ai).not.toMatch(/\.on\('click', '#btnConfigAI'/);
  });

  it('adds a seipro-prefixed hook for sending AI prompts while preserving the legacy id', () => {
    const ai = read('src/features/ai/sei-pro-ai.js');

    expect(ai).toContain('class="newLink seipro-ai-send-button" id="btnSendAI"');
    expect(ai).toContain(".on('click', '.seipro-ai-send-button'");
    expect(ai).toContain('initAI(this)');

    expect(ai).not.toMatch(/\.on\('click', '#btnSendAI'/);
  });

  it('adds a seipro-prefixed hook for switching AI platforms while preserving the legacy id', () => {
    const ai = read('src/features/ai/sei-pro-ai.js');

    expect(ai).toContain('class="newLink seipro-ai-switch-platform" id="btnChangeSelectedAI"');
    expect(ai).toContain(".on('click', '.seipro-ai-switch-platform'");
    expect(ai).toContain("setOptionsPro('plataformAI_current', nextPlataform)");

    expect(ai).not.toMatch(/\.on\('click', '#btnChangeSelectedAI'/);
  });

  it('adds a seipro-prefixed hook to the Ollama key input while preserving legacy password behavior', () => {
    const ai = read('src/features/ai/sei-pro-ai.js');

    expect(ai).toContain('id="cke_inputOllamaKey_textInput"');
    expect(ai).toContain('class="cke_dialog_ui_input_text passReveal seipro-ai-ollama-key-input"');
    expect(ai).toContain('type="password"');
  });

  it('adds a seipro-prefixed hook to the Ollama URL input while preserving its id and default endpoint', () => {
    const ai = read('src/features/ai/sei-pro-ai.js');

    expect(ai).toContain('id="cke_inputOllamaUrl_textInput"');
    expect(ai).toContain('class="cke_dialog_ui_input_text seipro-ai-ollama-url-input"');
    expect(ai).toContain('value="http://localhost:11434/"');
    expect(ai).toContain("_parent.find('#cke_inputOllamaUrl_textInput')");
  });

  it('adds a seipro-prefixed hook to the Ollama model input while preserving its id and model flow', () => {
    const ai = read('src/features/ai/sei-pro-ai.js');

    expect(ai).toContain('id="cke_inputOllamaModel_textInput"');
    expect(ai).toContain('class="cke_dialog_ui_input_text seipro-ai-ollama-model-input"');
    expect(ai).toContain("getOptionsPro('setModelOllama')");
    expect(ai).toContain("_parent.find('#cke_inputOllamaModel_textInput')");
  });

  it('adds a seipro-prefixed hook to OpenAI and Gemini secret-key inputs while preserving their password contract', () => {
    const ai = read('src/features/ai/sei-pro-ai.js');

    expect(ai.match(/seipro-ai-secret-key-input/g)).toHaveLength(2);
    expect(ai.match(/id=\"cke_inputSecretKey_textInput\"/g)).toHaveLength(2);
    expect(ai.match(/type=\"password\" aria-labelledby=\"cke_inputSecretKey_label\"/g)).toHaveLength(2);
  });

  it('adds a seipro-prefixed hook for returning from a custom prompt while preserving the legacy id', () => {
    const ai = read('src/features/ai/sei-pro-ai.js');

    expect(ai).toContain('class="newLink seipro-ai-return-prompt-select" id="btnReturnSelectPromptAI"');
    expect(ai).toContain(".on('click', '.seipro-ai-return-prompt-select'");
    expect(ai).toContain("$('#btnReturnSelectPromptAI').hide()");
    expect(ai).toContain("$('#promptAISelect').val('resume')");

    expect(ai).not.toMatch(/\.on\('click', '#btnReturnSelectPromptAI'/);
  });

  it('adds a seipro-prefixed hook for the active AI platform status while preserving legacy animation styling', () => {
    const ai = read('src/features/ai/sei-pro-ai.js');

    expect(ai).toContain('class="fas fa-circle animate-flicker fa-xs verdeColor seipro-ai-platform-status"');
  });

  it('adds a seipro-prefixed hook for the secondary AI platform button while preserving rotation behavior', () => {
    const ai = read('src/features/ai/sei-pro-ai.js');

    expect(ai).toContain('class="newLink seipro-ai-secondary-platform-button" id="btnSecondPlataform"');
    expect(ai).toContain(".on('click', '.seipro-ai-secondary-platform-button'");
    expect(ai).toContain("$('#btnSecondPlataform').attr('data-plataform', nextNextPlataform)");
    expect(ai).toContain("data-plataform=\"${_nextPlatform}\"");

    expect(ai).not.toMatch(/\.on\('click', '#btnSecondPlataform'/);
  });

  it('adds a seipro-prefixed hook for the primary AI platform button while preserving the active platform display', () => {
    const ai = read('src/features/ai/sei-pro-ai.js');

    expect(ai).toContain('class="newLink seipro-ai-primary-platform-button" id="btnMainPlataform"');
    expect(ai).toContain("$('#btnMainPlataform').find('img').attr('src', _getIconFor(nextPlataform))");
    expect(ai).toContain('seipro-ai-platform-status');
  });

  it('adds a seipro-prefixed hook to platform choices while preserving platform ids and token flows', () => {
    const ai = read('src/features/ai/sei-pro-ai.js');

    expect(ai.match(/seipro-ai-platform-selector/g)).toHaveLength(9);
    expect(ai).toContain('id="selectPlataformAI_openai" data-platform="openai"');
    expect(ai).toContain('id="selectPlataformAI_gemini" data-platform="gemini"');
    expect(ai).toContain('id="selectPlataformAI_ollama" data-platform="ollama"');
    expect(ai).toContain(".on('click', '.seipro-ai-platform-selector[data-platform=\"openai\"]'");
    expect(ai).toContain(".on('click', '.seipro-ai-platform-selector[data-platform=\"gemini\"]'");
    expect(ai).toContain(".on('click', '.seipro-ai-platform-selector[data-platform=\"ollama\"]'");
    expect(ai).toContain("boxAIStoreToken('openai')");
    expect(ai).toContain("boxAIStoreToken('gemini')");
    expect(ai).toContain("boxAIStoreToken('ollama')");

    expect(ai).not.toMatch(/\.on\('click', '#selectPlataformAI_(openai|gemini|ollama)'/);
  });

  it('adds a seipro-prefixed hook for the response loading indicator while preserving legacy spinner styling', () => {
    const ai = read('src/features/ai/sei-pro-ai.js');

    expect(ai).toContain('class="loadingio-spinner-pulse seipro-ai-response-loading"');
    expect(ai).toContain('class="ldio"');
  });

  it('adds a seipro-prefixed hook for the AI response list while preserving id-based layout updates', () => {
    const ai = read('src/features/ai/sei-pro-ai.js');

    expect(ai).toContain('id="response_ai" class="seipro-ai-response-list"');
    expect(ai).toContain("$('#response_ai').css('height'");
  });

  it('adds a seipro-prefixed hook for the AI configuration dialog while preserving legacy dialog styling', () => {
    const ai = read('src/features/ai/sei-pro-ai.js');

    expect(ai).toContain('class="alertBoxDiv seipro-ai-config-dialog"');
    expect(ai).toContain("title: 'Intelig\\u00EAncia artificial: Configura\\u00E7\\u00F5es Gerais '");
  });

  it('adds a seipro-prefixed hook for saving custom favorite prompts while preserving the legacy id and storage flow', () => {
    const ai = read('src/features/ai/sei-pro-ai.js');

    expect(ai).toContain('id="favoritePromptAI" class="seipro-ai-favorite-prompt"');
    expect(ai).toContain(".on('click', '.seipro-ai-favorite-prompt'");
    expect(ai).toContain("$('#favoritePromptAI').show()");
    expect(ai).toContain("localStorageStorePro('favoritePromptAI'");

    expect(ai).not.toMatch(/\.on\('click', '#favoritePromptAI'/);
  });

  it('adds a seipro-prefixed hook for the AI actions container while preserving id-based layout updates', () => {
    const ai = read('src/features/ai/sei-pro-ai.js');

    expect(ai).toContain('id="boxAIActions" class="seipro-ai-actions-container"');
    expect(ai).toContain("$('#boxAIActions').removeAttr('style')");
    expect(ai).toContain("$('#boxAIActions').css('height', heightPromptBox + 70)");
  });

  it('adds a seipro-prefixed hook to AI platform information links while preserving legacy link styling', () => {
    const ai = read('src/features/ai/sei-pro-ai.js');

    expect(ai.match(/linkDialog seipro-ai-platform-info-link/g)).toHaveLength(5);
    expect(ai).toContain('https://chat.openai.com/chat');
    expect(ai).toContain('https://gemini.google.com/app');
  });

  it('adds a seipro-prefixed hook for the custom prompt editor while preserving its id and persistence flow', () => {
    const ai = read('src/features/ai/sei-pro-ai.js');

    expect(ai).toContain('id="promptAIPersonal" class="seipro-ai-personal-prompt-editor"');
    expect(ai).toContain("$('#promptAIPersonal').prop('contenteditable',true).show().focus()");
    expect(ai).toContain("localStorageStorePro('promptAIPersonal', $(this).html())");
    expect(ai).toContain("$('#promptAIPersonal').html(localStorageRestorePro('promptAIPersonal') || '')");
  });

  it('adds a seipro-prefixed hook for pending AI responses while preserving legacy loading styling', () => {
    const ai = read('src/features/ai/sei-pro-ai.js');

    expect(ai.match(/loading seipro-ai-response-pending/g)).toHaveLength(2);
    expect(ai).toContain('class="response_bot seipro-ai-bot-response response_${currentPlataform} loading seipro-ai-response-pending"');
    expect(ai).toContain("responseBox.removeClass('loading')");
  });

  it('adds a seipro-prefixed hook for the AI platform picker while preserving legacy dialog styling', () => {
    const ai = read('src/features/ai/sei-pro-ai.js');

    expect(ai).toContain('class="dialogBoxDiv seipro-ai-platform-picker-dialog"');
    expect(ai).toContain('Selecione a <b>Plataforma de Intelig\\u00EAncia Artificial</b>');
    expect(ai).toContain('class="cke_dialog_ui_button cke_dialog_ui_button_ok newLink newLink_confirm seipro-ai-platform-selector"');
  });

  it('adds a feature hook for the AI platform picker table while preserving CKEditor layout and platform choices', () => {
    const ai = read('src/features/ai/sei-pro-ai.js');

    expect(ai).toContain('class="cke_dialog_ui_hbox seipro-ai-platform-picker-table"');
    expect(ai).toContain('id="selectPlataformAI_openai" data-platform="openai"');
    expect(ai).toContain('id="selectPlataformAI_gemini" data-platform="gemini"');
    expect(ai).toContain('id="selectPlataformAI_ollama" data-platform="ollama"');
  });

  it('adds a feature hook to the platform picker options row while preserving CKEditor layout and choices', () => {
    const ai = read('src/features/ai/sei-pro-ai.js');

    expect(ai).toContain('class="cke_dialog_ui_hbox seipro-ai-platform-picker-options"');
    expect(ai).toContain('class="cke_dialog_ui_hbox seipro-ai-platform-picker-table"');
    expect(ai).toContain('id="selectPlataformAI_openai" data-platform="openai"');
    expect(ai).toContain('id="selectPlataformAI_gemini" data-platform="gemini"');
    expect(ai).toContain('id="selectPlataformAI_ollama" data-platform="ollama"');
  });

  it('adds a seipro-prefixed hook for the token success dialog while preserving legacy confirmation contracts', () => {
    const ai = read('src/features/ai/sei-pro-ai.js');

    expect(ai).toContain('class="alertaAttencionPro dialogBoxDiv seipro-ai-token-success-dialog"');
    expect(ai).toContain('Credenciais carregadas com sucesso!');
    expect(ai).toContain('onclick="window.location.reload()"');
    expect(ai).toContain('id="plataformAI_uiElement"');
  });

  it('adds a seipro-prefixed hook for the token reload action while preserving its legacy button contract', () => {
    const ai = read('src/features/ai/sei-pro-ai.js');

    expect(ai).toContain('class="cke_dialog_ui_button cke_dialog_ui_button_cancel seipro-ai-token-reload-button"');
    expect(ai).toContain('onclick="window.location.reload()"');
    expect(ai).toContain('id="plataformAI_uiElement"');
    expect(ai).toContain("$('#plataformAI_uiElement').addClass('newLink newLink_confirm')");
  });

  it('adds a seipro-prefixed hook for the create-document dialog while preserving legacy dialog styling and document selector', () => {
    const ai = read('src/features/ai/sei-pro-ai.js');

    expect(ai).toContain('class="dialogBoxDiv seiProForm seipro-ai-create-document-dialog"');
    expect(ai).toContain('class="alertBoxDiv seipro-ai-create-document-alert"');
    expect(ai).toContain('id="docTipoSelect"');
    expect(ai).toContain("initChosenReplace('box_init', this, true)");
    expect(ai).toContain("title: 'Criar documento SEI'");
  });

  it('adds a seipro-prefixed hook for platform credential notices while preserving legacy dialogs', () => {
    const ai = read('src/features/ai/sei-pro-ai.js');

    expect(ai.match(/alertaAttencionPro dialogBoxDiv seipro-ai-platform-credential-notice/g)).toHaveLength(8);
    expect(ai.match(/id="plataformAI_alert"/g)).toHaveLength(3);
    expect(ai).toContain('produtos da OpenAI');
    expect(ai).toContain('produtos da Google');
    expect(ai).toContain('Compatível com Ollama, LiteLLM');
  });

  it('adds a seipro-prefixed hook for the process search dialog while preserving legacy form contracts', () => {
    const ai = read('src/features/ai/sei-pro-ai.js');

    expect(ai).toContain('class="dialogBoxDiv seiProForm seipro-ai-process-search-dialog"');
    expect(ai).toContain('id="dialogBoxProcessoAI" class="seipro-ai-process-search-input"');
    expect(ai).toContain("title: 'Pesquisar documentos em processo'");
    expect(ai).toContain("appendAutocompleteProc(this, $('#dialogBoxProcessoAI'))");
    expect(ai).toContain("appendDocAISelect(false, $('#dialogBoxProcessoAI').val())");
    expect(ai).toContain(".on('keypress', '.seipro-ai-process-search-input'");

    expect(ai).not.toMatch(/\.on\('keypress', '#dialogBoxProcessoAI'/);
  });

  it('adds a seipro-prefixed hook for the process search alert wrapper while preserving legacy dialog styling', () => {
    const ai = read('src/features/ai/sei-pro-ai.js');

    expect(ai).toContain('class="alertBoxDiv seipro-ai-process-search-alert"');
    expect(ai).toContain('class="dialogBoxDiv seiProForm seipro-ai-process-search-dialog"');
    expect(ai).toContain('id="dialogBoxProcessoAI"');
    expect(ai).toContain("title: 'Pesquisar documentos em processo'");
  });

  it('adds a seipro-prefixed hook for the create-document type selector while preserving legacy form styling', () => {
    const ai = read('src/features/ai/sei-pro-ai.js');

    expect(ai).toContain('class="dialogBoxDiv seiProForm seipro-ai-create-document-type-selector"');
    expect(ai).toContain('id="docTipoSelect"');
    expect(ai).toContain("initChosenReplace('box_init', this, true)");
  });

  it('adds a seipro-prefixed hook for the create-document type label while preserving the selector flow', () => {
    const ai = read('src/features/ai/sei-pro-ai.js');

    expect(ai).toContain('class="seipro-ai-create-document-type-label"');
    expect(ai).toContain('Selecione o tipo de documento');
    expect(ai).toContain('id="docTipoSelect"');
    expect(ai).toContain("title: 'Criar documento SEI'");
  });

  it('adds a feature hook to the create-document type select while preserving its Chosen flow', () => {
    const ai = read('src/features/ai/sei-pro-ai.js');

    expect(ai).toContain('id="docTipoSelect" class="seipro-ai-create-document-type-select"');
    expect(ai).toContain('<option value="">&nbsp;</option>${tiposDocumentos}');
    expect(ai).toContain("initChosenReplace('box_init', this, true)");
    expect(ai).toContain("title: 'Criar documento SEI'");
  });

  it('delegates the create-document Chosen selector through a feature hook while preserving its id and submit flow', () => {
    const ai = read('src/features/ai/sei-pro-ai.js');

    expect(ai).toContain("$('#docTipoSelect_chosen').addClass('seipro-ai-create-document-type-chosen')");
    expect(ai).toContain(".on('keypress', '.seipro-ai-create-document-type-chosen'");
    expect(ai).toContain("$('#docTipoSelect').val()");
    expect(ai).toContain("$(this).closest('.ui-dialog').find('.confirm.ui-button').trigger('click')");

    expect(ai).not.toMatch(/\.on\('keypress', '#docTipoSelect_chosen'/);
  });

  it('adds a shared feature hook to token save buttons while preserving platform contracts', () => {
    const ai = read('src/features/ai/sei-pro-ai.js');

    expect(ai.match(/seipro-ai-token-save-button/g)).toHaveLength(5);
    expect(ai).toContain('seipro-ai-token-save-button seipro-ai-openai-token');
    expect(ai).toContain('seipro-ai-token-save-button seipro-ai-gemini-token');
    expect(ai).toContain('seipro-ai-token-save-button seipro-ai-ollama-token');
    expect(ai).toContain(".on('click', '.seipro-ai-token-save-button'");
    expect(ai).toContain('id="plataformAI_uiElement"');
    expect(ai).toContain("hasClass('seipro-ai-openai-token') ? 'openai'");
    expect(ai).toContain("hasClass('seipro-ai-gemini-token') ? 'gemini'");
    expect(ai).toContain("hasClass('seipro-ai-ollama-token') ? 'ollama'");

    expect(ai).not.toMatch(/\.on\('click', '#plataformAI_uiElement'/);
  });

  it('adds a seipro-prefixed hook for the AI configuration form while preserving shared legacy form styling', () => {
    const ai = read('src/features/ai/sei-pro-ai.js');

    expect(ai).toContain('class="seiProForm seipro-ai-config-form"');
    expect(ai).toContain('id="configAI_model" class="seipro-ai-model-select"');
    expect(ai).toContain('id="configAI_advancedconfigs"');
  });

  it('adds a feature hook to the AI configuration reset action while preserving reset defaults', () => {
    const ai = read('src/features/ai/sei-pro-ai.js');

    expect(ai).toContain("text: 'Resetar configura\\u00E7\\u00F5es'");
    expect(ai).toContain("class: 'seipro-ai-config-reset-button'");
    expect(ai).toContain("setOptionsPro('setModelOpenAI', 'gpt-4')");
    expect(ai).toContain("setOptionsPro('setAdvancedConfigs', '')");
  });

  it('adds a feature hook to AI configuration info icons while preserving shared tooltip styling', () => {
    const ai = read('src/features/ai/sei-pro-ai.js');

    expect(ai.match(/seipro-ai-config-info-icon/g)).toHaveLength(7);
    expect(ai).toContain('class="iconPopup iconSwitch fas fa-info-circle cinzaColor seipro-ai-config-info-icon"');
    expect(ai).toContain('for="configAI_model"');
    expect(ai).toContain('for="configAI_presence_penalty"');
    expect(ai).toContain('data-tooltip=');
  });

  it('adds a feature hook to AI information icons while preserving legacy icon styling and platform templates', () => {
    const ai = read('src/features/ai/sei-pro-ai.js');

    expect(ai.match(/fas fa-info-circle azulColor seipro-ai-info-icon/g)).toHaveLength(4);
    expect(ai).toContain('const disclaimerOpenAI');
    expect(ai).toContain('const disclaimerGemini');
    expect(ai).toContain('const disclaimerOllama');
    expect(ai).toContain('Selecione a <b>Plataforma de Intelig\\u00EAncia Artificial</b>');
  });

  it('adds a feature hook to the AI consent checkbox wrapper while preserving the checkbox contract', () => {
    const ai = read('src/features/ai/sei-pro-ai.js');

    expect(ai).toContain('id="cke_383_uiElement" class="cke_dialog_ui_checkbox seipro-ai-consent-checkbox-wrapper"');
    expect(ai).toContain('class="cke_dialog_ui_checkbox_input seipro-ai-consent-toggle"');
    expect(ai).toContain('id="ciente_disclaimer"');
    expect(ai).toContain('for="ciente_disclaimer"');
    expect(ai).toContain("setOptionsPro('consentimentoIA', true)");
  });

  it('adds a feature hook to credential loading indicators while preserving legacy spinner and id contracts', () => {
    const ai = read('src/features/ai/sei-pro-ai.js');

    expect(ai.match(/seipro-ai-token-loading/g)).toHaveLength(3);
    expect(ai.match(/id="plataformAI_load"/g)).toHaveLength(3);
    expect(ai).toContain('class="fas fa-sync-alt fa-spin seipro-ai-token-loading"');
    expect(ai).toContain("$('#plataformAI_load').show()");
  });

  it('adds a shared feature hook to credential forms while preserving their legacy id and token flow', () => {
    const ai = read('src/features/ai/sei-pro-ai.js');

    expect(ai.match(/id="plataformAI_info" class="seipro-ai-token-form"/g)).toHaveLength(3);
    expect(ai).toContain('const disclaimerOpenAI');
    expect(ai).toContain('const disclaimerGemini');
    expect(ai).toContain('const disclaimerOllama');
    expect(ai).toContain("_this.closest('#plataformAI_info')");
    expect(ai).toContain("$('#plataformAI_info').css('white-space','initial')");
  });

  it('adds a shared feature hook to credential field tables while preserving CKEditor layout and token actions', () => {
    const ai = read('src/features/ai/sei-pro-ai.js');

    expect(ai.match(/cke_dialog_ui_hbox seipro-ai-token-fields/g)).toHaveLength(3);
    expect(ai).toContain('class="cke_dialog_ui_hbox seipro-ai-token-fields"');
    expect(ai).toContain('class="cke_dialog_ui_hbox seipro-ai-token-fields" style="width:100%;"');
    expect(ai).toContain('seipro-ai-token-save-button seipro-ai-openai-token');
    expect(ai).toContain('seipro-ai-token-save-button seipro-ai-gemini-token');
    expect(ai).toContain('seipro-ai-token-save-button seipro-ai-ollama-token');
  });

  it('delegates prompt changes through the feature hook while preserving the prompt select id', () => {
    const ai = read('src/features/ai/sei-pro-ai.js');

    expect(ai).toContain('id="promptAISelect" class="seipro-ai-prompt-select"');
    expect(ai).toContain(".on('change', '.seipro-ai-prompt-select'");
    expect(ai).toContain("$('#promptAISelect').val('resume')");

    expect(ai).not.toMatch(/\.on\('change', '#promptAISelect'/);
  });

  it('delegates custom-prompt document changes through the feature hook while preserving the document select id', () => {
    const ai = read('src/features/ai/sei-pro-ai.js');

    expect(ai).toContain('id="docAISelect" class="seipro-ai-doc-select"');
    expect(ai).toContain(".on('change', '.seipro-ai-doc-select'");
    expect(ai).toContain("boxAISearchProcesso()");
    expect(ai).toContain("$(this).val('add_documento').trigger('chosen:updated')");

    expect(ai).not.toMatch(/\.on\('change', '#docAISelect'/);
  });

  it('delegates document-selector cursor preservation through the feature hook', () => {
    const ai = read('src/features/ai/sei-pro-ai.js');

    expect(ai).toContain('id="docAISelect" class="seipro-ai-doc-select"');
    expect(ai).toContain(".on('mousedown', '.seipro-ai-doc-select'");
    expect(ai).toContain('saveCursorPosition()');

    expect(ai).not.toMatch(/\.on\('mousedown', '#docAISelect'/);
  });

  it('adds a feature hook to the multi-document list while preserving its legacy id and tag flow', () => {
    const ai = read('src/features/ai/sei-pro-ai.js');

    expect(ai).toContain('id="docAIMultiList" class="seipro-ai-document-list"');
    expect(ai).toContain("$('#docAIMultiList .seipro-ai-doc-tag')");
    expect(ai).toContain("$('#docAIMultiList').hide()");
  });

  it('adds a feature hook to standard AI suggestion icons while preserving their legacy icon styling and suggestion contracts', () => {
    const ai = read('src/features/ai/sei-pro-ai.js');

    expect(ai.match(/fas fa-magic azulColor seipro-ai-suggestion-icon/g)).toHaveLength(4);
    expect(ai).toContain('data-type="resume" data-send="true"');
    expect(ai).toContain('data-type="sugira_encaminhamento"');
    expect(ai).toContain('data-type="erros_gramaticais"');
    expect(ai).toContain('data-type="dados_sensiveis"');
  });
});
