import { createCommandPalette } from '../../../shared/ui/command-palette.js';
import { openModal } from '../../../shared/ui/modal.js';
import { scanChecklist } from '../domain/checklist.js';
import { renderSnippet, snippetToHtml } from '../domain/snippets.js';
import { semanticDiff } from '../domain/diff.js';

const AUTOSAVE_INTERVAL_MS = 30_000;
let configuredDraftRepository;
let configuredSnippetRepository;

function resolveRepository(repository) {
    const resolved = repository || configuredDraftRepository;
    if (!resolved) throw new TypeError('O repositório de rascunhos deve ser injetado pelo editor');
    return resolved;
}

function resolveSnippetRepository(repository) {
    const resolved = repository || configuredSnippetRepository;
    if (!resolved) throw new TypeError('O repositório de trechos deve ser injetado pelo editor');
    return resolved;
}

function queryValue(root, selectors) {
    for (const selector of selectors) {
        const value = root?.querySelector?.(selector)?.value;
        if (value) return value;
    }
    return '';
}

export function resolveDraftContext(location = globalThis.location, root = globalThis.document) {
    const url = new URL(location?.href || String(location), 'https://invalid.local/');
    const processId = url.searchParams.get('id_procedimento')
        || queryValue(root, ['#hdnIdProcedimento', '[name="id_procedimento"]']);
    const documentId = url.searchParams.get('id_documento')
        || queryValue(root, ['#hdnIdDocumento', '[name="id_documento"]']);
    const action = url.searchParams.get('acao') || 'editor';

    return {
        processId: processId || `standalone:${url.pathname}`,
        documentId: documentId || `${action}:${url.searchParams.get('id_texto_padrao') || 'current'}`
    };
}

export function readEditorSnapshot(instances = {}) {
    return Object.fromEntries(
        Object.entries(instances)
            .filter(([, instance]) => instance && typeof instance.getData === 'function')
            .map(([id, instance]) => [id, instance.getData()])
    );
}

function hasDirtyEditor(instances, serialized, previousSerialized) {
    const editors = Object.values(instances);
    const supportsDirtyCheck = editors.some((editor) => typeof editor?.checkDirty === 'function');
    if (supportsDirtyCheck) {
        return editors.some((editor) => typeof editor?.checkDirty === 'function' && editor.checkDirty());
    }
    return previousSerialized !== null && serialized !== previousSerialized;
}

export function installDraftAutosave({
    getInstances = () => globalThis.CKEDITOR?.instances || {},
    context = resolveDraftContext(),
    repository,
    intervalMs = AUTOSAVE_INTERVAL_MS,
    setIntervalFn = globalThis.setInterval,
    clearIntervalFn = globalThis.clearInterval,
    title = globalThis.document?.title || '',
    sourceUrl = globalThis.location?.href || '',
    onError = (error) => console.error('SEI Pro draft autosave failed', error)
} = {}) {
    repository = resolveRepository(repository);
    let previousSerialized = null;
    let saveInProgress = false;

    async function snapshot({ force = false } = {}) {
        if (saveInProgress) return null;
        const instances = getInstances();
        const editors = readEditorSnapshot(instances);
        if (!Object.keys(editors).length) return null;
        const serialized = JSON.stringify(editors);
        const shouldSave = force || (
            serialized !== previousSerialized
            && hasDirtyEditor(instances, serialized, previousSerialized)
        );
        previousSerialized = serialized;
        if (!shouldSave) return null;

        saveInProgress = true;
        try {
            return await repository.saveDraft({
                ...context,
                editors,
                title,
                sourceUrl
            });
        } catch (error) {
            onError(error);
            return null;
        } finally {
            saveInProgress = false;
        }
    }

    const timer = setIntervalFn(() => { void snapshot(); }, intervalMs);
    return {
        snapshot,
        stop() {
            clearIntervalFn(timer);
        }
    };
}

function formatDraftDate(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value || '');
    return new Intl.DateTimeFormat('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'medium'
    }).format(date);
}

function restoreEditors(instances, draft, selectedIds) {
    const selected = selectedIds ? new Set(selectedIds) : null;
    const savedEntries = Object.entries(draft.editors || {}).filter(([id]) =>
        !selected || selected.has(id)
    );
    const currentEntries = Object.entries(instances || {});
    if (!savedEntries.length || !currentEntries.length) return false;

    savedEntries.forEach(([id, html], index) => {
        const editor = instances[id] || currentEntries[index]?.[1];
        if (!editor || typeof editor.setData !== 'function') return;
        editor.fire?.('saveSnapshot');
        editor.setData(html, function () {
            editor.fire?.('saveSnapshot');
            editor.focus?.();
        });
    });
    return true;
}

function plainText(html) {
    return new DOMParser().parseFromString(String(html || ''), 'text/html').body?.textContent || '';
}

function renderDraftDiff(container, instances, draft) {
    const before = Object.values(draft.editors || {}).map(plainText).join('\n');
    const after = Object.values(readEditorSnapshot(instances)).map(plainText).join('\n');
    const diff = semanticDiff(before, after);
    container.replaceChildren();
    const summary = document.createElement('p');
    summary.textContent = `${diff.added} termo(s) novo(s) e ${diff.removed} removido(s) desde este instantâneo.`;
    const text = document.createElement('div');
    text.className = 'seipro-draft-diff';
    diff.parts.forEach((part) => {
        const node = document.createElement(part.type === 'add'
            ? 'ins'
            : (part.type === 'remove' ? 'del' : 'span'));
        node.textContent = `${part.text} `;
        text.appendChild(node);
    });
    container.append(summary, text);
}

function currentEditor(instances = {}) {
    return Object.values(instances).find((editor) => editor?.focusManager?.hasFocus)
        || Object.values(instances)[0]
        || null;
}

function snippetContext(source = globalThis) {
    const props = source.dadosProcessoPro?.propProcesso || {};
    const interested = props.selInteressadosProcedimento || props.selInteressados_select || [];
    return {
        processo: props.hdnProtocoloFormatado || props.txtProtocoloExibir || '',
        tipo: props.hdnNomeTipoProcedimento || '',
        especificacao: props.txtDescricao || '',
        interessado: Array.isArray(interested) ? interested[0] || '' : interested,
        interessados: Array.isArray(interested) ? interested.join(', ') : interested,
        unidade: source.siglaUnidadeAtual || props.siglaUnidade || '',
        hoje: new Intl.DateTimeFormat('pt-BR').format(new Date())
    };
}

export function openSnippetPanel({
    repository,
    getInstances = () => globalThis.CKEDITOR?.instances || {},
    unit = globalThis.siglaUnidadeAtual || 'geral',
    contextValues = snippetContext(globalThis)
} = {}) {
    repository = resolveSnippetRepository(repository);
    const content = document.createElement('div');
    content.className = 'seipro-snippet-panel';
    const form = document.createElement('form');
    form.className = 'seipro-snippet-form';
    const name = document.createElement('input');
    name.type = 'text';
    name.placeholder = 'Nome do trecho';
    name.setAttribute('aria-label', 'Nome do trecho');
    const body = document.createElement('textarea');
    body.rows = 5;
    body.placeholder = 'Texto. Use {{processo}}, {{interessado}}, {{unidade}}, {{hoje}}…';
    body.setAttribute('aria-label', 'Conteúdo do trecho');
    const save = document.createElement('button');
    save.type = 'submit';
    save.textContent = 'Salvar trecho';
    form.append(name, body, save);
    const status = document.createElement('p');
    status.className = 'seipro-snippet-status';
    status.setAttribute('aria-live', 'polite');
    const list = document.createElement('ul');
    list.className = 'seipro-snippet-list';
    content.append(form, status, list);

    const modal = openModal({
        title: `Trechos da unidade ${unit || 'geral'}`,
        content,
        width: 760,
        className: 'seipro-editor-modal'
    });

    async function render() {
        const snippets = await repository.list(unit);
        list.replaceChildren();
        snippets.forEach((snippet) => {
            const row = document.createElement('li');
            row.className = 'seipro-snippet-item';
            const info = document.createElement('div');
            const title = document.createElement('strong');
            title.textContent = snippet.name;
            const preview = document.createElement('span');
            preview.textContent = renderSnippet(snippet.body, contextValues).slice(0, 180);
            info.append(title, preview);
            const actions = document.createElement('div');
            const insert = document.createElement('button');
            insert.type = 'button';
            insert.textContent = 'Inserir';
            insert.addEventListener('click', () => {
                const editor = currentEditor(getInstances());
                if (!editor?.insertHtml) return;
                editor.fire?.('saveSnapshot');
                editor.insertHtml(snippetToHtml(renderSnippet(snippet.body, contextValues)));
                editor.fire?.('saveSnapshot');
                modal.close();
            });
            const remove = document.createElement('button');
            remove.type = 'button';
            remove.textContent = 'Excluir';
            remove.addEventListener('click', async () => {
                await repository.remove(snippet.id);
                await render();
            });
            actions.append(insert, remove);
            row.append(info, actions);
            list.appendChild(row);
        });
        if (!snippets.length) status.textContent = 'Nenhum trecho salvo para esta unidade.';
        else status.textContent = `${snippets.length} trecho(s) disponível(is).`;
    }

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        try {
            await repository.save({ unit, name: name.value, body: body.value });
            name.value = '';
            body.value = '';
            await render();
            name.focus();
        } catch (error) {
            status.textContent = error.message;
        }
    });
    void render();
    return modal;
}

export function openDraftRestorePanel({
    context = resolveDraftContext(),
    repository,
    getInstances = () => globalThis.CKEDITOR?.instances || {},
    confirmRestore = (message) => globalThis.confirm(message)
} = {}) {
    repository = resolveRepository(repository);
    const content = document.createElement('div');
    content.className = 'seipro-draft-panel';
    content.setAttribute('aria-live', 'polite');

    const status = document.createElement('p');
    status.className = 'seipro-draft-status';
    status.textContent = 'Carregando rascunhos locais…';
    content.appendChild(status);

    const modal = openModal({
        title: 'Restaurar rascunho local',
        content,
        width: 720,
        className: 'seipro-editor-modal'
    });

    async function render() {
        try {
            const drafts = await repository.listDrafts(context);
            content.replaceChildren();
            if (!drafts.length) {
                const empty = document.createElement('p');
                empty.className = 'seipro-draft-empty';
                empty.textContent = 'Nenhum rascunho local foi encontrado para este documento.';
                content.appendChild(empty);
                return;
            }

            const intro = document.createElement('p');
            intro.className = 'seipro-draft-intro';
            intro.textContent = 'Escolha um instantâneo. A restauração substitui o conteúdo atual do editor.';
            const list = document.createElement('ul');
            list.className = 'seipro-draft-list';
            drafts.forEach((draft) => {
                const item = document.createElement('li');
                item.className = 'seipro-draft-item';

                const info = document.createElement('div');
                info.className = 'seipro-draft-info';
                const date = document.createElement('strong');
                date.className = 'seipro-draft-date';
                date.textContent = formatDraftDate(draft.savedAt);
                const details = document.createElement('span');
                details.className = 'seipro-draft-details';
                const characters = Object.values(draft.editors || {})
                    .reduce((total, html) => total + String(html).length, 0);
                details.textContent = `${Object.keys(draft.editors || {}).length} seção(ões), ${characters.toLocaleString('pt-BR')} caracteres`;
                info.append(date, details);

                const actions = document.createElement('div');
                actions.className = 'seipro-draft-actions';
                const sections = document.createElement('details');
                sections.className = 'seipro-draft-sections';
                const sectionsTitle = document.createElement('summary');
                sectionsTitle.textContent = 'Escolher seções';
                sections.appendChild(sectionsTitle);
                Object.keys(draft.editors || {}).forEach((editorId) => {
                    const label = document.createElement('label');
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.value = editorId;
                    checkbox.checked = true;
                    label.append(checkbox, document.createTextNode(editorId));
                    sections.appendChild(label);
                });
                const restore = document.createElement('button');
                restore.type = 'button';
                restore.className = 'newLink seipro-draft-restore';
                restore.textContent = 'Restaurar';
                restore.addEventListener('click', () => {
                    if (!confirmRestore('Restaurar este rascunho e substituir o conteúdo atual?')) return;
                    const selectedIds = Array.from(sections.querySelectorAll('input:checked'), (input) => input.value);
                    if (restoreEditors(getInstances(), draft, selectedIds)) modal.close();
                });
                const compare = document.createElement('button');
                compare.type = 'button';
                compare.className = 'newLink seipro-draft-compare';
                compare.textContent = 'Comparar';
                const comparison = document.createElement('div');
                comparison.className = 'seipro-draft-comparison';
                comparison.hidden = true;
                compare.addEventListener('click', () => {
                    comparison.hidden = !comparison.hidden;
                    if (!comparison.hidden) renderDraftDiff(comparison, getInstances(), draft);
                });
                const remove = document.createElement('button');
                remove.type = 'button';
                remove.className = 'newLink seipro-draft-delete';
                remove.textContent = 'Excluir';
                remove.addEventListener('click', async () => {
                    remove.disabled = true;
                    await repository.deleteDraft({ ...context, draftId: draft.id });
                    await render();
                });
                actions.append(compare, restore, remove);
                item.append(info, sections, actions, comparison);
                list.appendChild(item);
            });
            content.append(intro, list);
        } catch (error) {
            content.replaceChildren();
            const failure = document.createElement('p');
            failure.className = 'seipro-draft-error';
            failure.textContent = 'Não foi possível acessar os rascunhos locais.';
            content.appendChild(failure);
            console.error('SEI Pro draft panel failed', error);
        }
    }

    void render();
    return modal;
}

export function installConcurrentEditMonitor({
    context = resolveDraftContext(),
    BroadcastChannelImpl = globalThis.BroadcastChannel,
    onConcurrentEdit = showConcurrentEditWarning
} = {}) {
    if (typeof BroadcastChannelImpl !== 'function') return { close() {} };
    const channelName = `seipro-editor-${context.processId}-${context.documentId}`;
    const channel = new BroadcastChannelImpl(channelName);
    const instanceId = Math.random().toString(36).slice(2);
    channel.onmessage = (event) => {
        const message = event.data || {};
        if (message.instanceId === instanceId) return;
        if (message.type === 'hello') {
            channel.postMessage({ type: 'active', instanceId });
        } else if (message.type === 'active') {
            onConcurrentEdit(context);
        }
    };
    channel.postMessage({ type: 'hello', instanceId });
    return channel;
}

function showConcurrentEditWarning() {
    if (document.querySelector('.seipro-concurrent-warning')) return;
    const warning = document.createElement('div');
    warning.className = 'seipro-concurrent-warning';
    warning.setAttribute('role', 'alert');
    warning.textContent = 'Este documento também está aberto em outra aba. Evite edições simultâneas para não sobrescrever alterações.';
    const close = document.createElement('button');
    close.type = 'button';
    close.setAttribute('aria-label', 'Fechar aviso');
    close.textContent = '×';
    close.addEventListener('click', () => warning.remove());
    warning.appendChild(close);
    document.body.appendChild(warning);
}

export function openChecklistPanel({
    getInstances = () => globalThis.CKEDITOR?.instances || {},
    parseHtml = (html) => new DOMParser().parseFromString(html, 'text/html'),
    documents = globalThis.dadosProcessoPro?.listDocumentos || []
} = {}) {
    const instances = getInstances();
    const editors = readEditorSnapshot(instances);
    const html = Object.values(editors).join('\n');
    const result = scanChecklist(html, { parseHtml, documents });
    const content = document.createElement('div');
    content.className = `seipro-checklist ${result.ok ? 'seipro-checklist-ok' : 'seipro-checklist-warning'}`;

    const summary = document.createElement('p');
    summary.className = 'seipro-checklist-summary';
    summary.textContent = result.ok
        ? 'Nenhuma pendência detectável foi encontrada.'
        : `${result.issues.length} pendência(s) encontrada(s). Revise antes de assinar.`;
    content.appendChild(summary);

    if (!result.ok) {
        const list = document.createElement('ul');
        list.className = 'seipro-checklist-list';
        result.issues.forEach((item) => {
            const row = document.createElement('li');
            row.className = `seipro-checklist-item seipro-checklist-${item.severity}`;
            const message = document.createElement('strong');
            message.textContent = item.message;
            row.appendChild(message);
            if (item.context) {
                const context = document.createElement('span');
                context.className = 'seipro-checklist-context';
                context.textContent = item.context;
                row.appendChild(context);
            }
            if (item.location) {
                const go = document.createElement('button');
                go.type = 'button';
                go.className = 'seipro-checklist-go';
                go.textContent = 'Ir ao ponto';
                go.addEventListener('click', () => {
                    if (focusChecklistIssue(instances, item.location)) modal.close();
                });
                row.appendChild(go);
            }
            list.appendChild(row);
        });
        content.appendChild(list);
    }

    const modal = openModal({
        title: 'Checklist antes da assinatura',
        content,
        width: 720,
        className: 'seipro-editor-modal'
    });
    return modal;
}

function focusChecklistIssue(instances, location) {
    for (const editor of Object.values(instances || {})) {
        const root = editor?.document?.$;
        if (!root) continue;
        let target = null;
        if (location.kind === 'selector') {
            try {
                target = root.querySelector(location.value);
            } catch (_) {
                target = null;
            }
        } else if (location.kind === 'paragraph') {
            target = root.querySelectorAll('p')[location.index] || null;
        } else if (location.kind === 'text') {
            target = Array.from(root.querySelectorAll('p, a, span')).find((node) =>
                String(node.textContent || '').includes(location.value)
            ) || null;
        }
        if (!target) continue;
        target.scrollIntoView?.({ block: 'center', behavior: 'smooth' });
        target.setAttribute('data-seipro-checklist-target', 'true');
        const previousOutline = target.style.outline;
        const previousOffset = target.style.outlineOffset;
        target.style.outline = '3px solid #f9ab00';
        target.style.outlineOffset = '3px';
        globalThis.setTimeout(() => {
            target.removeAttribute('data-seipro-checklist-target');
            target.style.outline = previousOutline;
            target.style.outlineOffset = previousOffset;
        }, 2500);
        editor.focus?.();
        return true;
    }
    return false;
}

function runToolbarCommand(selector) {
    const button = Array.from(document.querySelectorAll(selector))
        .find((candidate) => !candidate.closest('.cke_button_disabled'));
    if (!button) {
        console.warn(`SEI Pro editor command unavailable: ${selector}`);
        return false;
    }
    button.click();
    return true;
}

export function createEditorCommands(options = {}) {
    const command = (id, label, selector, keywords = [], category = 'Inserção') => ({
        id,
        label,
        keywords,
        category,
        selector,
        run: () => runToolbarCommand(selector)
    });
    return [
        command('ai', 'Abrir Assistente IA', '.getPlataformAIButtom', ['inteligência artificial', 'redigir', 'despacho'], 'IA e análise'),
        command(
            'import',
            'Inserir texto de conteúdo externo (Word, HTML ou Google)',
            '.importDocButtom',
            ['importar', 'word', 'docx', 'html', 'google docs']
        ),
        command('process-data', 'Inserir dados do processo', '.getDadosProcessoButtom', ['campos', 'tags', 'interessado']),
        {
            id: 'checklist',
            label: 'Verificar antes de assinar',
            keywords: ['checklist', 'revisão', 'pendências'],
            category: 'IA e análise',
            run: () => openChecklistPanel(options)
        },
        {
            id: 'snippets',
            label: 'Inserir ou gerenciar trechos da unidade',
            keywords: ['modelo', 'bloco', 'texto', 'placeholder'],
            category: 'Inserção',
            run: () => openSnippetPanel({
                ...options,
                repository: options.snippetRepository
            })
        },
        {
            id: 'semantic-diff',
            label: 'Comparar com documento anterior',
            keywords: ['diferenças', 'versão', 'alterações'],
            category: 'IA e análise',
            run: () => options.openDiff?.()
        },
        {
            id: 'restore-draft',
            label: 'Restaurar rascunho local',
            keywords: ['autosave', 'instantâneo', 'recuperar'],
            category: 'Segurança',
            run: () => openDraftRestorePanel(options)
        },
        command('document-reference', 'Inserir referência de documento', '.getCitacaoDocumentoButtom', ['citação', 'sei']),
        command('legislation-link', 'Adicionar link de legislação', '.getLinkLegisButtom', ['lei', 'norma']),
        command('footnote', 'Inserir nota de rodapé', '.getNotaRodapeButtom', ['nota']),
        command('internal-reference', 'Inserir referência interna', '.getRefInternaButtom', ['âncora', 'parágrafo']),
        command('summary', 'Inserir sumário', '.getSumarioButtom', ['índice']),
        command('qr-code', 'Gerar código QR', '.getQrCodeButtom', ['link', 'processo']),
        command('page-break', 'Inserir quebra de página', '.getPageBreakButtom', ['página']),
        command('section-break', 'Inserir quebra de seção', '.getSessionBreakButtom', ['seção']),
        command('public-link', 'Adicionar link público de documento', '.getProcessoPublicoButton', ['processo público']),
        command('checkbox', 'Inserir caixa de seleção', '.getInsertCheckboxButtom', ['check', 'marcação']),
        command('quick-table', 'Inserir tabela rápida', '.getQuickTableButtom', ['linhas', 'colunas'], 'Tabelas e imagens'),
        command('table-style', 'Aplicar estilo à tabela', '.getTablestylesButtom', ['cores'], 'Tabelas e imagens'),
        command('image-quality', 'Reduzir qualidade das imagens', '.getBatchImgQualityButtom', ['compactar'], 'Tabelas e imagens'),
        command('page-background', 'Configurar imagem de fundo e página', '.pageImageBackgroundButtom', ['impressão'], 'Tabelas e imagens'),
        command('capitalize', 'Aplicar maiúsculas iniciais', '.getCapLetterButtom', ['capitalizar'], 'Formatação'),
        command('font-up', 'Aumentar tamanho da fonte', '.getFontSizeUpButtom', ['fonte'], 'Formatação'),
        command('font-down', 'Diminuir tamanho da fonte', '.getFontSizeDownButtom', ['fonte'], 'Formatação'),
        command('copy-style', 'Copiar formatação', '.getCopyStyleButtom', ['estilo'], 'Formatação'),
        command('align-left', 'Alinhar à esquerda', '.getAlignLeftButtom', ['alinhamento'], 'Formatação'),
        command('align-center', 'Centralizar texto', '.getAlignCenterButtom', ['alinhamento'], 'Formatação'),
        command('align-right', 'Alinhar à direita', '.getAlignRightButtom', ['alinhamento'], 'Formatação'),
        command('align-justify', 'Justificar texto', '.getAlignJustifyButtom', ['alinhamento'], 'Formatação'),
        command('watermark', 'Adicionar marca d’água', '.getMinutaWatermarkButton', ['minuta', 'modelo'], 'Segurança'),
        command('mark-sensitive', 'Marcar dados protegidos', '.getMarkSigiloButton', ['sigilo', 'cpf', 'email'], 'Segurança'),
        command('redact-box', 'Inserir caixa de sigilo', '.getBoxSigiloButton', ['tarja', 'sigilo'], 'Segurança'),
        command('review-enable', 'Ativar revisão de texto', '.getReviewButton', ['alterações'], 'Revisão'),
        command('review-manage', 'Gerenciar revisões', '.getCtrReviewButton', ['aceitar', 'rejeitar'], 'Revisão'),
        command('dictation-enable', 'Ativar ditado (reconhecimento de fala do Chrome)', '.getDitadoButton', ['voz', 'fala', 'chrome', 'microfone'], 'Acessibilidade'),
        command('dictation-settings', 'Configurar ditado', '.getCtrDitadoButton', ['voz', 'microfone'], 'Acessibilidade'),
        command('style-editor', 'Criar estilo de texto', '.getNewStyleButton', ['formatação'], 'Formatação'),
        command('legislation-format', 'Formatar e numerar texto normativo', '.getLegisButtom', ['lei', 'artigo', 'norma'], 'Revisão')
    ];
}

function installIframePaletteShortcut(palette, getInstances) {
    const attachedDocuments = new WeakSet();
    const attach = () => {
        Object.values(getInstances()).forEach((editor) => {
            const editorDocument = editor?.document?.$;
            if (!editorDocument || attachedDocuments.has(editorDocument)) return;
            editorDocument.addEventListener('keydown', (event) => {
                if ((event.ctrlKey || event.metaKey) && event.key.toLocaleLowerCase() === 'k') {
                    event.preventDefault();
                    palette.open();
                }
            }, true);
            attachedDocuments.add(editorDocument);
        });
    };
    attach();
    return globalThis.setInterval(attach, 1_000);
}

let installedFeatures;
export function installEditorTools(options = {}) {
    if (installedFeatures) return installedFeatures;
    const getInstances = options.getInstances || (() => globalThis.CKEDITOR?.instances || {});
    const context = options.context || resolveDraftContext();
    const repository = resolveRepository(options.repository);
    const snippetRepository = resolveSnippetRepository(options.snippetRepository);
    configuredDraftRepository = repository;
    configuredSnippetRepository = snippetRepository;
    const sharedOptions = { ...options, getInstances, context, repository, snippetRepository };
    const palette = createCommandPalette({ commands: createEditorCommands(sharedOptions) });
    const shortcutTimer = installIframePaletteShortcut(palette, getInstances);
    const autosave = installDraftAutosave(sharedOptions);
    const concurrentMonitor = installConcurrentEditMonitor({ context });

    installedFeatures = {
        palette,
        autosave,
        destroy() {
            globalThis.clearInterval(shortcutTimer);
            autosave.stop();
            concurrentMonitor.close();
            palette.destroy();
            installedFeatures = null;
        }
    };
    return installedFeatures;
}
