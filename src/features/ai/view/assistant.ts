// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
import { globalRef } from '../../../core/global.js';
import { sanitizeSeiHtml } from '../domain/output.js';

const QUICK_ACTIONS = [
    {
        label: 'Analisar processo',
        prompt: 'Analise o processo atual e apresente uma síntese objetiva dos fatos, pedidos e documentos relevantes para decisão.'
    },
    {
        label: 'Redigir despacho',
        prompt: 'Analise o processo atual e redija uma minuta de despacho. Antes de concluir, informe quais elementos dos autos sustentam a proposta.'
    },
    {
        label: 'Deferir pedido',
        prompt: 'Analise o processo atual e redija uma minuta de despacho deferindo o pedido, usando somente fatos e fundamentos confirmados nos autos.'
    },
    {
        label: 'Indeferir pedido',
        prompt: 'Analise o processo atual e redija uma minuta de despacho indeferindo o pedido, usando somente fatos e fundamentos confirmados nos autos.'
    },
    {
        label: 'Revisar minuta',
        prompt: 'Revise a minuta aberta no editor. Aponte melhorias de clareza, coerência, fundamentação e linguagem administrativa e apresente a versão revisada.'
    }
];

/**
 * Persistent, non-modal conversation surface for the document editor.
 * It deliberately owns only the interaction state; process access and writing
 * remain in the controller so every insertion is still explicitly approved.
 */
export function createAiAssistant({
    profiles = [],
    activeProfileId = '',
    initialPrompt = '',
    onSubmit,
    onManageProfiles,
    onStop,
    onClose
} = {}) {
    const panel = element('aside', 'seipro-ai-assistant');
    panel.setAttribute('role', 'complementary');
    panel.setAttribute('aria-label', 'Assistente IA do SEI Pro');

    const header = element('header', 'seipro-ai-assistant-header');
    const heading = element('h2', 'seipro-ai-assistant-title', 'Assistente IA');
    const subtitle = element('p', 'seipro-ai-assistant-subtitle', 'Analise o processo e prepare minutas sem sair do editor.');
    const headingGroup = element('div', 'seipro-ai-assistant-heading');
    const close = button('Fechar assistente', 'seipro-ai-icon-button');
    close.setAttribute('aria-label', 'Fechar assistente');
    close.textContent = '×';
    headingGroup.append(heading, subtitle);
    header.append(headingGroup, close);

    const setup = element('div', 'seipro-ai-assistant-setup');
    const profileLabel = element('label', 'seipro-ai-assistant-profile-label', 'Perfil de IA');
    const profile = element('select', 'seipro-ai-assistant-profile');
    profileLabel.htmlFor = 'seipro-ai-assistant-profile';
    profile.id = 'seipro-ai-assistant-profile';
    const manage = button('Perfis', 'seipro-ai-text-button');
    const profileRow = element('div', 'seipro-ai-assistant-profile-row');
    profileRow.append(profile, manage);
    const context = element('label', 'seipro-ai-assistant-context');
    const contextInput = document.createElement('input');
    contextInput.type = 'checkbox';
    contextInput.checked = true;
    context.append(contextInput, text('Usar documentos públicos do processo'));
    setup.append(profileLabel, profileRow, context);

    const conversation = element('div', 'seipro-ai-conversation');
    conversation.setAttribute('aria-live', 'polite');
    const welcome = element('section', 'seipro-ai-welcome');
    const welcomeTitle = element('p', 'seipro-ai-welcome-title', 'Como posso ajudar neste processo?');
    const welcomeText = element('p', 'seipro-ai-welcome-text', 'Você pode pedir uma análise, uma minuta ou a revisão do texto aberto.');
    const quickActions = element('div', 'seipro-ai-quick-actions');
    QUICK_ACTIONS.forEach(function (action) {
        const actionButton = button(action.label, 'seipro-ai-quick-action');
        actionButton.addEventListener('click', function () {
            prompt.value = action.prompt;
            prompt.focus();
        });
        quickActions.appendChild(actionButton);
    });
    welcome.append(welcomeTitle, welcomeText, quickActions);
    conversation.appendChild(welcome);

    const activity = element('div', 'seipro-ai-activity');
    activity.hidden = true;
    const activityHeader = element('div', 'seipro-ai-activity-header');
    const activityStatus = element('p', 'seipro-ai-activity-status');
    activityStatus.setAttribute('aria-live', 'polite');
    const stop = button('Parar', 'seipro-ai-stop');
    stop.hidden = true;
    const activityList = element('ul', 'seipro-ai-activity-list');
    activityHeader.append(activityStatus, stop);
    activity.append(activityHeader, activityList);

    const composer = element('form', 'seipro-ai-composer');
    const prompt = element('textarea', 'seipro-ai-composer-input');
    prompt.rows = 4;
    prompt.value = initialPrompt;
    prompt.placeholder = 'Ex.: analise o processo e redija um despacho indeferindo o pedido.';
    prompt.setAttribute('aria-label', 'Instrução para o assistente IA');
    const composerFooter = element('div', 'seipro-ai-composer-footer');
    const privacy = element('span', 'seipro-ai-composer-note', 'Conteúdo restrito só é enviado após sua confirmação.');
    const submit = button('Enviar', 'seipro-ai-submit');
    submit.type = 'submit';
    composerFooter.append(privacy, submit);
    composer.append(prompt, composerFooter);

    panel.append(header, setup, conversation, activity, composer);

    let closed = false;
    let running = false;
    let currentDraft = null;
    let currentText = '';
    let progress = [];
    let history = [];

    function renderProfiles(nextProfiles, nextActiveProfileId) {
        profile.replaceChildren();
        (nextProfiles || []).forEach(function (item) {
            const option = document.createElement('option');
            option.value = item.id;
            option.textContent = item.label || `${item.providerId}: ${item.model}`;
            profile.appendChild(option);
        });
        profile.value = nextActiveProfileId || nextProfiles?.[0]?.id || '';
    }

    function appendMessage(role, content = '') {
        welcome.hidden = true;
        const message = element('article', `seipro-ai-message seipro-ai-message-${role}`);
        const roleLabel = element('span', 'seipro-ai-message-role', role === 'user' ? 'Você' : 'Assistente');
        const body = element('div', 'seipro-ai-message-body');
        body.textContent = content;
        message.append(roleLabel, body);
        conversation.appendChild(message);
        conversation.scrollTop = conversation.scrollHeight;
        return { message, body };
    }

    function setRunning(nextRunning) {
        running = nextRunning === true;
        submit.disabled = running;
        profile.disabled = running;
        contextInput.disabled = running;
        manage.disabled = running;
        prompt.disabled = running;
        stop.hidden = !running;
        stop.disabled = !running;
        panel.classList.toggle('seipro-ai-assistant-running', running);
    }

    function showActivity(status = '') {
        activity.hidden = false;
        activityStatus.textContent = status;
    }

    function renderDraftActions(target, value, onAccept, onRetry) {
        const actions = element('div', 'seipro-ai-message-actions');
        const insert = button('Inserir no documento', 'seipro-ai-insert');
        const retry = button('Tentar novamente', 'seipro-ai-message-button');
        const copy = button('Copiar', 'seipro-ai-message-button');
        insert.addEventListener('click', function () {
            if (typeof onAccept === 'function') void onAccept(value, insert);
        });
        retry.addEventListener('click', function () {
            if (typeof onRetry === 'function') onRetry();
        });
        copy.addEventListener('click', async function () {
            const copied = await copyText(value);
            copy.textContent = copied ? 'Copiado' : 'Não foi possível copiar';
        });
        actions.append(insert, retry, copy);
        target.message.appendChild(actions);
    }

    function submitPrompt() {
        const value = prompt.value.trim();
        if (!value || running) return;
        const previousHistory = history.slice(-6);
        appendMessage('user', value);
        history.push({ role: 'user', content: value });
        prompt.value = '';
        if (typeof onSubmit === 'function') {
            void onSubmit({
                profileId: profile.value,
                prompt: value,
                includeContext: contextInput.checked,
                history: previousHistory
            });
        }
    }

    composer.addEventListener('submit', function (event) {
        event.preventDefault();
        submitPrompt();
    });
    prompt.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
            event.preventDefault();
            submitPrompt();
        }
    });
    manage.addEventListener('click', function () {
        if (typeof onManageProfiles === 'function') onManageProfiles();
    });
    stop.addEventListener('click', function () {
        if (typeof onStop === 'function') onStop();
    });
    close.addEventListener('click', function () { api.close(); });

    const api = {
        el: panel,
        open() {
            closed = false;
            if (!panel.isConnected) document.body.appendChild(panel);
            return api;
        },
        close() {
            if (closed) return api;
            closed = true;
            panel.remove();
            if (typeof onClose === 'function') onClose();
            return api;
        },
        isOpen() {
            return panel.isConnected && !closed;
        },
        focus() {
            prompt.focus();
            return api;
        },
        setPrompt(value = '') {
            prompt.value = value;
            return api;
        },
        setProfiles(nextProfiles, nextActiveProfileId) {
            renderProfiles(nextProfiles, nextActiveProfileId);
            return api;
        },
        start() {
            progress = [];
            currentText = '';
            currentDraft = appendMessage('assistant');
            currentDraft.message.classList.add('seipro-ai-message-streaming');
            showActivity('Preparando o contexto do processo…');
            activityList.replaceChildren();
            setRunning(true);
            return api;
        },
        beginRound(iteration) {
            if (iteration > 1 && currentDraft) {
                currentText = '';
                currentDraft.body.textContent = '';
            }
            showActivity(iteration > 1
                ? `Preparando a resposta após as leituras, rodada ${iteration}…`
                : 'Redigindo a resposta…');
            return api;
        },
        appendDelta(delta) {
            currentText += String(delta == null ? '' : delta);
            if (currentDraft) currentDraft.body.textContent = currentText;
            conversation.scrollTop = conversation.scrollHeight;
            return api;
        },
        addProgress(message) {
            const value = String(message || 'Executando uma etapa…');
            progress.push(value);
            showActivity(value);
            activityList.replaceChildren(...progress.slice(-5).map(function (item) {
                return element('li', 'seipro-ai-activity-item', item);
            }));
            return api;
        },
        complete({ text: value = '', onAccept, onRetry } = {}) {
            const output = String(value || currentText).trim();
            currentText = output;
            if (currentDraft) {
                currentDraft.message.classList.remove('seipro-ai-message-streaming');
                const preview = toSafePreview(output);
                if (preview) currentDraft.body.innerHTML = preview;
                else currentDraft.body.textContent = output || 'A IA não retornou uma minuta.';
                if (preview) renderDraftActions(currentDraft, output, onAccept, onRetry);
            }
            history.push({ role: 'assistant', content: output });
            showActivity('Resposta pronta para revisão. A inserção só ocorre após sua confirmação.');
            setRunning(false);
            return api;
        },
        fail(error, onRetry) {
            if (currentDraft) {
                currentDraft.message.classList.remove('seipro-ai-message-streaming');
                currentDraft.body.textContent = friendlyError(error);
                if (typeof onRetry === 'function') {
                    const actions = element('div', 'seipro-ai-message-actions');
                    const retry = button('Tentar novamente', 'seipro-ai-message-button');
                    retry.addEventListener('click', onRetry);
                    actions.appendChild(retry);
                    currentDraft.message.appendChild(actions);
                }
            }
            showActivity('Não foi possível concluir a solicitação.');
            setRunning(false);
            return api;
        },
        stopped() {
            if (currentDraft) {
                currentDraft.message.classList.remove('seipro-ai-message-streaming');
                if (!currentText) currentDraft.body.textContent = 'Solicitação interrompida.';
            }
            showActivity('Solicitação interrompida.');
            setRunning(false);
            return api;
        },
        note(message) {
            showActivity(message);
            return api;
        },
        getHistory() {
            return history.slice();
        }
    };

    renderProfiles(profiles, activeProfileId);
    return api;
}

function toSafePreview(value) {
    try {
        return sanitizeSeiHtml(value, globalRef.DOMPurify);
    } catch (_) {
        return '';
    }
}

function friendlyError(error) {
    const message = String(error?.message || error || 'Erro desconhecido');
    if (/\b429\b/i.test(message)) {
        return 'O provedor de IA está temporariamente limitando as requisições. Aguarde alguns instantes e tente novamente.';
    }
    return `Não foi possível concluir: ${message}`;
}

async function copyText(value) {
    try {
        if (globalRef.navigator?.clipboard?.writeText) {
            await globalRef.navigator.clipboard.writeText(value);
            return true;
        }
        const fallback = document.createElement('textarea');
        fallback.value = value;
        fallback.style.position = 'fixed';
        fallback.style.opacity = '0';
        document.body.appendChild(fallback);
        fallback.select();
        const copied = document.execCommand?.('copy') === true;
        fallback.remove();
        return copied;
    } catch (_) {
        return false;
    }
}

function element(tag, className, value) {
    const node = document.createElement(tag);
    node.className = className;
    if (value != null) node.textContent = value;
    return node;
}

function button(label, className) {
    const node = element('button', className, label);
    node.type = 'button';
    return node;
}

function text(value) {
    return document.createTextNode(value);
}
