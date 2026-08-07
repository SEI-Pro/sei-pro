// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
import { openModal } from '../../../shared/ui/modal.js';
import { documentLabel } from '../domain/prompt.js';
import { providerDefaults } from '../domain/provider-defaults.js';

const PROVIDER_OPTIONS = [
    ['openai', 'OpenAI'],
    ['anthropic', 'Anthropic'],
    ['gemini', 'Google Gemini'],
    ['moonshot', 'Moonshot (Kimi K3)'],
    ['ollama', 'Ollama'],
    ['openai_compatible', 'Compatível com OpenAI']
];
const trustedSessionApprovals = new Set();

export function openPromptDialog({
    profiles = [],
    activeProfileId = '',
    initialPrompt = '',
    keyword = '+gpt',
    inlineEnabled = false,
    onManageProfiles,
    onSubmit
} = {}) {
    const form = element('form', 'seipro-ai-form');
    const profileSelect = selectInput('seipro-ai-profile', profiles.map(function (profile) {
        return [profile.id, profile.label || `${profile.providerId}: ${profile.model}`];
    }), activeProfileId || profiles[0]?.id);
    const prompt = element('textarea', 'seipro-ai-prompt');
    prompt.rows = 8;
    prompt.required = true;
    prompt.value = initialPrompt;
    prompt.placeholder = 'Descreva o documento ou a análise de que você precisa.';

    const includeContext = element('input', 'seipro-ai-context-toggle');
    includeContext.type = 'checkbox';
    includeContext.checked = true;

    const keywordInput = element('input', 'seipro-ai-keyword');
    keywordInput.type = 'text';
    keywordInput.value = keyword || '+gpt';
    keywordInput.maxLength = 20;
    const inlineToggle = element('input', 'seipro-ai-inline-toggle');
    inlineToggle.type = 'checkbox';
    inlineToggle.checked = inlineEnabled;

    const profileRow = field('Perfil de IA', profileSelect);
    const manage = element('button', 'seipro-ai-secondary');
    manage.type = 'button';
    manage.textContent = 'Gerenciar perfis';
    manage.addEventListener('click', function () {
        ref.close();
        if (typeof onManageProfiles === 'function') onManageProfiles();
    });
    profileRow.appendChild(manage);

    const contextLabel = element('label', 'seipro-ai-check-row');
    contextLabel.append(includeContext, textNode('Incluir documentos públicos do processo dentro do limite de contexto'));
    const inlineLabel = element('label', 'seipro-ai-check-row');
    inlineLabel.append(inlineToggle, textNode('Ativar modo de palavra-chave no editor'));

    const privacy = element('p', 'seipro-ai-privacy-note');
    privacy.textContent = 'Documentos restritos, sigilosos ou com nível de acesso desconhecido nunca são enviados sem confirmação.';

    form.append(
        profileRow,
        field('Instrução', prompt),
        contextLabel,
        field('Palavra-chave no editor', keywordInput),
        inlineLabel,
        privacy
    );

    const ref = openModal({
        title: 'SEI Pro AI',
        content: form,
        width: 720,
        className: 'seipro-ai-modal',
        buttons: [
            { text: 'Cancelar', onClick: function (modal) { modal.close(); } },
            {
                text: 'Gerar',
                class: 'seipro-ai-primary',
                onClick: function (modal) {
                    if (!profileSelect.value || !prompt.value.trim()) return;
                    if (typeof onSubmit === 'function') {
                        onSubmit({
                            profileId: profileSelect.value,
                            prompt: prompt.value.trim(),
                            includeContext: includeContext.checked,
                            keyword: keywordInput.value.trim() || '+gpt',
                            inlineEnabled: inlineToggle.checked
                        });
                    }
                    modal.close();
                }
            }
        ],
        onOpen: function () { prompt.focus(); }
    });
    return ref;
}

export function openProfileDialog({ profile, onSave, onSaved } = {}) {
    const current = profile || {};
    const form = element('form', 'seipro-ai-form seipro-ai-profile-form');
    const provider = selectInput('seipro-ai-provider', PROVIDER_OPTIONS, current.providerId || 'openai');
    const label = input('text', 'seipro-ai-profile-label', current.label || '');
    const baseUrl = input('url', 'seipro-ai-base-url', current.baseUrl || '');
    const key = input('password', 'seipro-ai-key', '');
    const model = input('text', 'seipro-ai-model', current.model || '');
    const trusted = input('checkbox', 'seipro-ai-trusted');
    trusted.checked = current.trusted === true;
    key.autocomplete = 'new-password';
    key.placeholder = current.hasKey ? 'Deixe em branco para manter a chave armazenada' : 'Chave de API';

    function applyDefaults() {
        const defaults = providerDefaults(provider.value);
        if (!baseUrl.value || baseUrl.dataset.defaulted === 'true') {
            baseUrl.value = defaults.baseUrl;
            baseUrl.dataset.defaulted = 'true';
        }
        if (!model.value || model.dataset.defaulted === 'true') {
            model.value = defaults.model;
            model.dataset.defaulted = 'true';
        }
    }
    provider.addEventListener('change', function () {
        baseUrl.dataset.defaulted = 'true';
        model.dataset.defaulted = 'true';
        applyDefaults();
    });
    if (!current.id) applyDefaults();

    const trustedLabel = element('label', 'seipro-ai-check-row');
    trustedLabel.append(trusted, textNode('Confiar neste endpoint local ou institucional'));
    const status = element('p', 'seipro-ai-form-status');
    status.setAttribute('aria-live', 'polite');

    form.append(
        field('Provedor', provider),
        field('Nome do perfil', label),
        field('Base URL', baseUrl),
        field('Modelo', model),
        field('Chave de API', key),
        trustedLabel,
        status
    );

    return openModal({
        title: current.id ? 'Editar perfil de IA' : 'Adicionar perfil de IA',
        content: form,
        width: 620,
        className: 'seipro-ai-modal',
        buttons: [
            { text: 'Cancelar', onClick: function (modal) { modal.close(); } },
            {
                text: 'Salvar',
                class: 'seipro-ai-primary',
                onClick: async function (modal) {
                    if (typeof onSave !== 'function') {
                        status.textContent = 'Persistência de perfil não configurada.';
                        return;
                    }
                    status.textContent = 'Salvando…';
                    try {
                        const saved = await onSave({
                            id: current.id,
                            providerId: provider.value,
                            label: label.value,
                            baseUrl: baseUrl.value,
                            key: key.value,
                            model: model.value,
                            trusted: trusted.checked
                        });
                        modal.close();
                        if (typeof onSaved === 'function') onSaved(saved);
                    } catch (error) {
                        status.textContent = error.message;
                    }
                }
            }
        ]
    });
}

export function showAiError(error) {
    const message = error && error.message ? error.message : String(error || 'Erro desconhecido da IA');
    const content = element('div', 'seipro-ai-error');
    const paragraph = element('p', 'seipro-ai-error-message');
    paragraph.textContent = message;
    content.appendChild(paragraph);
    return openModal({
        title: 'SEI Pro AI',
        content,
        width: 520,
        className: 'seipro-ai-modal',
        buttons: [
            { text: 'Fechar', onClick: function (modal) { modal.close(); } }
        ]
    });
}

const PROVIDER_LABELS = Object.fromEntries(PROVIDER_OPTIONS);
const externalSendApprovals = new Set();

/** Local / loopback profiles skip the external-send warning (ADR-0015 S.7). */
export function isLocalAiProfile(profile = {}) {
    if (String(profile.providerId || '').toLowerCase() === 'ollama') return true;
    try {
        const parsed = new URL(String(profile.baseUrl || ''));
        return parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1';
    } catch (_) {
        return false;
    }
}

export function providerDisplayName(profile = {}) {
    const id = String(profile.providerId || '');
    return profile.label || PROVIDER_LABELS[id] || id || 'provedor externo';
}

/**
 * Warn before sending process content to a non-local LLM (ADR-0015 S.7).
 * Once per profile per page session to keep the flow usable.
 */
export function confirmExternalProviderSend(profile) {
    if (isLocalAiProfile(profile)) return Promise.resolve(true);
    const key = String(profile?.id || `${profile?.providerId}|${profile?.baseUrl}`);
    if (key && externalSendApprovals.has(key)) return Promise.resolve(true);
    const name = providerDisplayName(profile);
    return new Promise(function (resolve) {
        const content = element('div', 'seipro-ai-access-gate');
        const warning = element('p', 'seipro-ai-access-warning');
        warning.textContent = `O conteúdo do processo será enviado para o provedor externo “${name}”. Confirme apenas se isso for permitido na sua unidade.`;
        const details = element('dl', 'seipro-ai-access-details');
        appendDetail(details, 'Provedor', name);
        if (profile?.model) appendDetail(details, 'Modelo', String(profile.model));
        if (profile?.baseUrl) appendDetail(details, 'Destino', String(profile.baseUrl));
        content.append(warning, details);

        let decided = false;
        openModal({
            title: 'Envio para IA externa',
            content,
            width: 560,
            className: 'seipro-ai-modal',
            onClose: function () {
                if (!decided) resolve(false);
            },
            buttons: [
                {
                    text: 'Cancelar',
                    onClick: function (modal) {
                        decided = true;
                        resolve(false);
                        modal.close();
                    }
                },
                {
                    text: `Enviar para ${name}`,
                    class: 'seipro-ai-danger',
                    onClick: function (modal) {
                        decided = true;
                        if (key) externalSendApprovals.add(key);
                        resolve(true);
                        modal.close();
                    }
                }
            ]
        });
    });
}

export function confirmRestrictedDocument(document, profile) {
    const approvalKey = trustedApprovalKey(profile);
    if (approvalKey && trustedSessionApprovals.has(approvalKey)) return Promise.resolve(true);
    return new Promise(function (resolve) {
        const content = element('div', 'seipro-ai-access-gate');
        const warning = element('p', 'seipro-ai-access-warning');
        warning.textContent = document.accessKnown === false
            ? 'O nível de acesso deste documento não pôde ser verificado. O conteúdo só será enviado se você confirmar.'
            : 'Este documento tem acesso restrito ou sigiloso. O conteúdo só será enviado se você confirmar.';
        const details = element('dl', 'seipro-ai-access-details');
        appendDetail(details, 'Documento', documentLabel(document));
        appendDetail(details, 'Hipótese legal', document.hipoteseLegal || 'Não informada');
        appendDetail(details, 'Destino', `${profile.label || profile.providerId} (${profile.model})`);
        if (approvalKey) {
            const sessionNote = element('p', 'seipro-ai-session-note');
            sessionNote.textContent = 'Como este endpoint foi marcado como confiável, esta confirmação valerá até fechar ou recarregar esta página.';
            content.append(warning, details, sessionNote);
        } else {
            content.append(warning, details);
        }

        let decided = false;
        openModal({
            title: 'Confirmar envio de documento protegido',
            content,
            width: 620,
            className: 'seipro-ai-modal',
            onClose: function () {
                if (!decided) resolve(false);
            },
            buttons: [
                {
                    text: 'Não enviar',
                    onClick: function (modal) {
                        decided = true;
                        resolve(false);
                        modal.close();
                    }
                },
                {
                    text: approvalKey ? 'Autorizar nesta sessão' : 'Enviar este documento',
                    class: 'seipro-ai-danger',
                    onClick: function (modal) {
                        decided = true;
                        if (approvalKey) trustedSessionApprovals.add(approvalKey);
                        resolve(true);
                        modal.close();
                    }
                }
            ]
        });
    });
}

function trustedApprovalKey(profile = {}) {
    if (profile.trusted !== true) return '';
    return String(profile.id || `${profile.providerId || ''}|${profile.baseUrl || ''}|${profile.model || ''}`);
}

export function clearTrustedSessionApprovals() {
    trustedSessionApprovals.clear();
}

function field(labelText, control) {
    const wrapper = element('label', 'seipro-ai-field');
    const label = element('span', 'seipro-ai-label');
    label.textContent = labelText;
    wrapper.append(label, control);
    return wrapper;
}

function appendDetail(list, term, value) {
    const dt = document.createElement('dt');
    const dd = document.createElement('dd');
    dt.textContent = term;
    dd.textContent = value;
    list.append(dt, dd);
}

function selectInput(className, options, selected) {
    const select = element('select', className);
    options.forEach(function ([value, label]) {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = label;
        option.selected = value === selected;
        select.appendChild(option);
    });
    return select;
}

function input(type, className, value = '') {
    const control = element('input', className);
    control.type = type;
    control.value = value;
    control.autocomplete = type === 'password' ? 'new-password' : 'off';
    return control;
}

function element(tag, className) {
    const node = document.createElement(tag);
    node.className = className;
    return node;
}

function textNode(text) {
    return document.createTextNode(text);
}
