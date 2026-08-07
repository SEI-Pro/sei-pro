// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
import { getSeiPro } from '../../core/global.js';
import {
    loadBoxAIActions,
    loadPlataformAI,
    setKeywordInlineAI,
    startGeneration
} from './controller.js';
import {
    installIsolatedEditorAiBridge,
    publishAiEditorConfig
} from './io/editor-bridge.js';
import { getAiSettings } from './io/profiles.js';

const root = getSeiPro();
root.features.ai = {
    open: loadBoxAIActions,
    openFromEditor: loadPlataformAI,
    generate: startGeneration,
    setKeyword: setKeywordInlineAI
};

installIsolatedEditorAiBridge({
    onOpen: ({ editorId } = {}) => loadPlataformAI({ editorId }),
    onInline: ({ editorId, prompt, marker } = {}) => startGeneration({
        profile: null,
        prompt,
        includeContext: false,
        inlineTarget: { editorId, marker },
        resolveProfile: true
    })
});
getAiSettings().then(publishAiEditorConfig).catch(() => {
    // O botão de IA continua disponível mesmo sem configuração inline.
});
