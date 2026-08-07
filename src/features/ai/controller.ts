// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
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
    saveAiSettings,
    saveProfile
} from './io/profiles.js';
import { AI_TOOL_DEFINITIONS } from './tools/definitions.js';
import { createAiToolExecutor } from './tools/executors.js';
import {
    confirmExternalProviderSend,
    confirmRestrictedDocument,
    openProfileDialog,
    showAiError
} from './view/dialogs.js';
import { createAiAssistant } from './view/assistant.js';
import { createAiPanel } from './view/panel.js';

let currentGeneration = null;
let lastGeneration = null;
let activeAssistant = null;

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
            onSave: saveProfile,
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
    const initialPrompt = selectedText.trim()
        ? `Revise o trecho selecionado do documento, preservando o sentido e a linguagem administrativa.\n\n${selectedText.trim()}`
        : '';
    if (activeAssistant?.isOpen()) {
        activeAssistant
            .setProfiles(profiles, settings.activeProfileId)
            .setPrompt(initialPrompt)
            .focus();
        return activeAssistant;
    }

    const assistant = createAiAssistant({
        profiles,
        activeProfileId: settings.activeProfileId,
        initialPrompt,
        onClose: function () {
            if (activeAssistant === assistant) activeAssistant = null;
            cancelActiveGeneration();
        },
        onStop: function () {
            cancelActiveGeneration();
            assistant.stopped();
        },
        onManageProfiles: function () {
            const active = profiles.find(function (profile) {
                return profile.id === settings.activeProfileId;
            }) || profiles[0];
            openProfileDialog({
                profile: active,
                onSave: saveProfile,
                onSaved: async function (saved) {
                    try {
                        settings = await saveAiSettings({ activeProfileId: saved.id });
                        profiles = await listProfiles();
                        publishAiEditorConfig(settings);
                        assistant.setProfiles(profiles, saved.id);
                    } catch (error) {
                        showAiError(error);
                    }
                }
            });
        },
        onSubmit: async function (submission) {
            const profile = profiles.find(function (candidate) {
                return candidate.id === submission.profileId;
            });
            if (!profile) {
                assistant.fail(new Error('Selecione um perfil de IA válido.'));
                return;
            }
            try {
                settings = await saveAiSettings({ activeProfileId: profile.id });
                publishAiEditorConfig(settings);
                await startGeneration({
                    ...submission,
                    profile,
                    editorId,
                    panel: assistant
                });
            } catch (error) {
                assistant.fail(error);
            }
        }
    });
    activeAssistant = assistant;
    return assistant.open().focus();
}

export async function startGeneration({
    profile,
    prompt,
    includeContext = true,
    inlineTarget = null,
    editorId = '',
    resolveProfile = false,
    panel: providedPanel = null,
    history = []
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
    try {
        const allowedExternal = await confirmExternalProviderSend(profile);
        if (!allowedExternal) {
            const cancelled = new Error('Envio para o provedor externo cancelado.');
            if (providedPanel && typeof providedPanel.fail === 'function') providedPanel.fail(cancelled);
            else showAiError(cancelled);
            return { error: cancelled };
        }
    } catch (error) {
        showAiError(error);
        return { error };
    }
    const request = {
        profile,
        prompt,
        includeContext,
        inlineTarget,
        editorId,
        resolveProfile,
        history
    };
    lastGeneration = request;
    cancelActiveGeneration();
    const generation = createGeneration();
    currentGeneration = generation;
    const isConversation = providedPanel && typeof providedPanel.getHistory === 'function';
    const panel = providedPanel || createAiPanel({
        onStop: function () {
            cancelActiveGeneration();
            panel.stopped();
        },
        onRetry: function () {
            panel.close();
            if (lastGeneration) void startGeneration(lastGeneration);
        },
        onDiscard: function () {
            cancelActiveGeneration();
        },
        onAccept: async function (value) {
            try {
                await insertAiHtml(value, inlineTarget, editorId);
                panel.close();
            } catch (error) {
                panel.fail(error);
            }
        }
    });
    panel.start();

    try {
        const fetchState = createDocumentFetchState(settings.maxDocs);
        const editorSnapshot = await readEditorSnapshot({
            editorId: inlineTarget?.editorId || editorId
        });
        throwIfCancelled(generation);
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
                processSnapshot: editorSnapshot,
                signal: generation.signal
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
            processSnapshot: editorSnapshot,
            signal: generation.signal
        });
        throwIfCancelled(generation);
        generation.controller = await runToolLoop({
            profile,
            system: [
                DEFAULT_SYSTEM_INSTRUCTION,
                settings.systemInstruction?.trim()
            ].filter(Boolean).join('\n\nINSTRUÇÃO INSTITUCIONAL ADICIONAL\n'),
            prompt: assembled,
            tools: AI_TOOL_DEFINITIONS,
            executor,
            messages: history,
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
        if (generation.cancelled) generation.controller.cancel();
        const result = await generation.controller.task;
        if (result.cancelled || generation.cancelled) {
            panel.stopped();
        } else if (isConversation) {
            panel.complete({
                text: result.text,
                onAccept: async function (value, button) {
                    try {
                        button.disabled = true;
                        await insertAiHtml(value, inlineTarget, editorId);
                        panel.note('Minuta inserida no documento. Revise o texto antes de salvar ou assinar.');
                    } catch (error) {
                        panel.fail(error);
                    } finally {
                        button.disabled = false;
                    }
                },
                onRetry: function () {
                    void startGeneration({ ...request, panel });
                }
            });
        } else {
            panel.complete();
        }
        return result;
    } catch (error) {
        if (generation.cancelled || isAbortError(error)) {
            panel.stopped();
            return { cancelled: true };
        }
        if (isConversation) {
            panel.fail(error, function () {
                void startGeneration({ ...request, panel });
            });
        } else {
            panel.fail(error);
        }
        return { error };
    } finally {
        if (currentGeneration === generation) currentGeneration = null;
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

function createGeneration() {
    const abort = typeof AbortController === 'function' ? new AbortController() : null;
    return {
        cancelled: false,
        signal: abort?.signal,
        controller: null,
        cancel() {
            if (this.cancelled) return false;
            this.cancelled = true;
            abort?.abort();
            return this.controller ? this.controller.cancel() : true;
        }
    };
}

function cancelActiveGeneration() {
    if (!currentGeneration) return false;
    return currentGeneration.cancel();
}

function throwIfCancelled(generation) {
    if (generation.cancelled || generation.signal?.aborted) {
        const error = new Error('Solicitação interrompida');
        error.name = 'AbortError';
        throw error;
    }
}

function isAbortError(error) {
    return error?.name === 'AbortError' || error?.message === 'Solicitação interrompida';
}
