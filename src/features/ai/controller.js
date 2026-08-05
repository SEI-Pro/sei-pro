import { globalRef } from '../../core/global.js';
import { DEFAULT_SYSTEM_INSTRUCTION, assemblePrompt } from './domain/prompt.js';
import { sanitizeSeiHtml } from './domain/output.js';
import {
    createDocumentFetchState,
    gatherProcessContext
} from './io/context.js';
import {
    insertEditorHtml,
    publishAiEditorConfig,
    readEditorSnapshot
} from './io/editor-bridge.js';
import { runToolLoop } from './io/generate.js';
import {
    getAiSettings,
    listProfiles,
    saveAiSettings
} from './io/profiles.js';
import { AI_TOOL_DEFINITIONS } from './tools/definitions.js';
import { createAiToolExecutor } from './tools/executors.js';
import {
    confirmRestrictedDocument,
    openProfileDialog,
    openPromptDialog,
    showAiError
} from './view/dialogs.js';
import { createAiPanel } from './view/panel.js';

let currentController = null;
let lastGeneration = null;

export async function loadPlataformAI(trigger = {}) {
    return loadBoxAIActions({
        editorId: typeof trigger === 'object' ? trigger.editorId || '' : ''
    });
}

export async function loadBoxAIActions({ editorId = '' } = {}) {
    let profiles;
    let settings;
    try {
        [profiles, settings] = await Promise.all([listProfiles(), getAiSettings()]);
        publishAiEditorConfig(settings);
    } catch (error) {
        showAiError(error);
        return { error };
    }
    if (!profiles.length) {
        return openProfileDialog({
            onSaved: async function (profile) {
                await saveAiSettings({ activeProfileId: profile.id });
                loadBoxAIActions({ editorId });
            }
        });
    }
    let selectedText = '';
    try {
        selectedText = (await readEditorSnapshot({ editorId })).selectedText || '';
    } catch { /* the dialog can still open without a selection */ }
    return openPromptDialog({
        profiles,
        activeProfileId: settings.activeProfileId,
        initialPrompt: selectedText,
        keyword: settings.keyword || '+gpt',
        inlineEnabled: settings.inlineEnabled === true,
        onManageProfiles: function () {
            const active = profiles.find(function (profile) {
                return profile.id === settings.activeProfileId;
            }) || profiles[0];
            openProfileDialog({
                profile: active,
                onSaved: async function (saved) {
                    await saveAiSettings({ activeProfileId: saved.id });
                    loadBoxAIActions({ editorId });
                }
            });
        },
        onSubmit: async function (submission) {
            const profile = profiles.find(function (candidate) {
                return candidate.id === submission.profileId;
            });
            const nextSettings = await saveAiSettings({
                activeProfileId: profile.id,
                keyword: submission.keyword,
                inlineEnabled: submission.inlineEnabled
            });
            publishAiEditorConfig(nextSettings);
            startGeneration({ ...submission, profile, editorId });
        }
    });
}

export async function startGeneration({
    profile,
    prompt,
    includeContext = true,
    inlineTarget = null,
    editorId = '',
    resolveProfile = false
} = {}) {
    let settings;
    try {
        const values = await Promise.all([
            getAiSettings(),
            (!profile && resolveProfile) ? listProfiles() : Promise.resolve([])
        ]);
        settings = values[0];
        if (!profile && resolveProfile) {
            profile = values[1].find((candidate) =>
                candidate.id === settings.activeProfileId
            ) || values[1][0] || null;
        }
    } catch (error) {
        showAiError(error);
        return { error };
    }
    if (!profile) {
        const error = new Error('Configure um perfil de IA antes de gerar o texto');
        showAiError(error);
        return { error };
    }
    const request = {
        profile,
        prompt,
        includeContext,
        inlineTarget,
        editorId,
        resolveProfile
    };
    lastGeneration = request;
    const panel = createAiPanel({
        onStop: function () {
            if (currentController) currentController.cancel();
            panel.stopped();
        },
        onRetry: function () {
            panel.close();
            if (lastGeneration) startGeneration(lastGeneration);
        },
        onDiscard: function () {
            if (currentController) currentController.cancel();
        },
        onAccept: async function (value) {
            try {
                await insertAiHtml(value, inlineTarget, editorId);
                panel.close();
            } catch (error) {
                panel.fail(error);
            }
        }
    }).start();

    try {
        const fetchState = createDocumentFetchState(settings.maxDocs);
        const editorSnapshot = await readEditorSnapshot({
            editorId: inlineTarget?.editorId || editorId
        });
        const currentDocumentProvider = () => Promise.resolve(editorSnapshot);
        const context = includeContext
            ? await gatherProcessContext({
                instruction: prompt,
                profile,
                maxDocs: settings.maxDocs,
                maxTokens: settings.maxContextTokens,
                includeBodies: true,
                onProgress: function (message) { panel.addProgress(message); },
                confirmRestricted: confirmRestrictedDocument,
                currentDocumentProvider,
                fetchState,
                processSnapshot: editorSnapshot
            })
            : {
                process: {},
                documents: [],
                chunks: [],
                omitted: [],
                restrictedDocuments: [],
                currentDocument: ''
            };
        const assembled = assemblePrompt({ instruction: prompt, ...context });
        const executor = createAiToolExecutor({
            profile,
            maxDocs: settings.maxDocs,
            confirmRestricted: confirmRestrictedDocument,
            onProgress: function (message) { panel.addProgress(message); },
            fetchState,
            currentDocumentProvider,
            processSnapshot: editorSnapshot
        });
        currentController = await runToolLoop({
            profile,
            system: [
                DEFAULT_SYSTEM_INSTRUCTION,
                settings.systemInstruction?.trim()
            ].filter(Boolean).join('\n\nINSTRUÇÃO INSTITUCIONAL ADICIONAL\n'),
            prompt: assembled,
            tools: AI_TOOL_DEFINITIONS,
            executor,
            maxIterations: settings.maxIterations,
            maxDocs: settings.maxDocs,
            onRoundStart: function (iteration) { panel.beginRound(iteration); },
            onDelta: function (delta) { panel.appendDelta(delta); },
            onToolStart: function (tool) {
                panel.addProgress(`O modelo solicitou ${tool.name || 'uma ferramenta de leitura'}…`);
            },
            onToolResult: function (call) {
                panel.addProgress(`Concluído: ${call.name}`);
            }
        });
        const result = await currentController.task;
        if (result.cancelled) panel.stopped();
        else panel.complete();
        return result;
    } catch (error) {
        panel.fail(error);
        return { error };
    } finally {
        currentController = null;
    }
}

export function setKeywordInlineAI(keyword = '+gpt') {
    const normalized = String(keyword || '+gpt').trim() || '+gpt';
    void saveAiSettings({ keyword: normalized });
    return normalized;
}

async function insertAiHtml(value, inlineTarget, editorId) {
    const purifier = globalRef.DOMPurify;
    const html = sanitizeSeiHtml(value, purifier);
    await insertEditorHtml({
        html,
        editorId: inlineTarget?.editorId || editorId || '',
        inlineMarker: inlineTarget?.marker || ''
    });
}
