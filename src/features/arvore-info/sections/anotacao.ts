/**
 * Seção "Anotação" (sticknote) do painel infoarvore — Etapa D (split por seção).
 * É o editor mais rico: edit/save/cancel/remove/prioridade/data/checklist, com
 * round-trip texto-plano ↔ contenteditable e cursor (caret) estável no auto-save.
 * View pura de DOM; recebe deps via ctx. Lógica de checklist vem de parse/anotacao.
 */
import { createCaret } from '../dom/caret.js';
import { stripChecklistMarker, parseAnotLinePrefix } from '../parse/anotacao.js';
import {
    clearChildren,
    createFaIcon,
    setFailedStatus,
    setMutedStatus
} from '../dom/status.js';

export type AnotacaoSectionCtx = {
    doc: Document;
    win: Window & typeof globalThis;
    fetchPage: (url: string) => Promise<Document>;
    invalidatePage: (url: string) => void;
    submitForm: (docA: Document, values: Record<string, string | boolean>) => Promise<unknown>;
    refreshers: Record<string, () => void>;
    sectionEnabled: (sectionId: string) => boolean;
    anotPanel: HTMLElement;
    findToolbarLink: (hrefFragment: string) => string | null;
    log: (...args: unknown[]) => void;
    warn: (...args: unknown[]) => void;
    err: (...args: unknown[]) => void;
    report: (reason: string, detail?: unknown) => void;
    normalizeMojibakeUtf8: (value: string) => string;
};

type AnotStamp = { user: string; at: number } | null;

type BuildAnotOpts = {
    justSaved?: boolean;
    keepEditing?: boolean;
    caretOffset?: number | null;
};

export function installAnotacaoSection(ctx: AnotacaoSectionCtx): void {
    const doc = ctx.doc;
    const win = ctx.win;
    const fetchPage = ctx.fetchPage;
    const invalidatePage = ctx.invalidatePage;
    const submitForm = ctx.submitForm;
    const refreshers = ctx.refreshers;
    const sectionEnabled = ctx.sectionEnabled;
    const anotPanel = ctx.anotPanel;
    const findToolbarLink = ctx.findToolbarLink;
    const log = ctx.log;
    const warn = ctx.warn;
    const report = ctx.report;
    const normalizeMojibakeUtf8 = ctx.normalizeMojibakeUtf8;

    // Anotação format helpers — lossless round-trip between contenteditable DOM and SEI's plain-text column.
    function anotLineFromDom(container: HTMLElement): string {
        const lines: string[] = [];
        const children = container.children.length ? container.children : [container];
        Array.prototype.forEach.call(children, function (el: HTMLElement) {
            if (el.tagName === 'BR') { lines.push(''); return; }
            const text = (el.textContent || '').replace(/\s+$/, '');
            if (!text) { lines.push(''); return; }
            const prefix = el.classList.contains('stickNoteChecked') ? '[X] '
                : el.classList.contains('stickNoteCheck') ? '[ ] ' : '';
            lines.push(prefix + stripChecklistMarker(text));
        });
        while (lines.length && lines[lines.length - 1] === '') lines.pop();
        return lines.join('\n');
    }

    function anotDomFromLine(container: HTMLElement, line: string) {
        clearChildren(container);
        if (!line) {
            const emptyDiv = doc.createElement('div');
            emptyDiv.appendChild(doc.createElement('br'));
            container.appendChild(emptyDiv);
            return;
        }
        line.split('\n').forEach(function (raw) {
            const div = doc.createElement('div');
            if (!raw) {
                div.appendChild(doc.createElement('br'));
                container.appendChild(div);
                return;
            }
            const parsed = parseAnotLinePrefix(raw);
            if (parsed.check && parsed.checked) div.classList.add('stickNoteCheck', 'stickNoteChecked');
            else if (parsed.check) div.classList.add('stickNoteCheck');
            div.textContent = parsed.rest;
            container.appendChild(div);
        });
    }

    const anotBodyEl = anotPanel.querySelector('.seipro-anot-body') as HTMLElement | null;
    if (!anotBodyEl) return;
    const anotBody: HTMLElement = anotBodyEl;

    const anotUrl = findToolbarLink('anotacao_registrar') || findToolbarLink('acao=anotacao_');
    if (!anotUrl) {
        warn('infoarvore_anotacoes: toolbar link not found');
        setMutedStatus(anotBody, '(indisponível)');
    } else {
        refreshers.anotacoes = function () { invalidatePage(anotUrl); renderAnotacao(anotUrl); };
        if (sectionEnabled('anotacoes')) renderAnotacao(anotUrl);
        else log('infoarvore_anotacoes: skipped (section disabled by user)');
    }

    function readAnotacaoData(docA: Document) {
        const ta = docA.getElementById('txaDescricao') as HTMLTextAreaElement | null;
        const pri = docA.getElementById('chkSinPrioridade') as HTMLInputElement | null;
        return {
            text: normalizeMojibakeUtf8(ta ? (ta.value || ta.textContent || '') : ''),
            priority: !!(pri && (pri.checked || pri.getAttribute('checked') !== null))
        };
    }

    function renderAnotacao(url: string) {
        fetchPage(url).then(function (docA) {
            const data = readAnotacaoData(docA);
            buildAnotUI(url, data.text, data.priority);
            log('infoarvore_anotacoes: loaded (priority=' + data.priority + ', len=' + data.text.length + ')');
        }).catch(function (e: Error) {
            setFailedStatus(anotBody, '(falha ao carregar anotação)');
            report('infoarvore_anotacoes: fetch failed', { error: e.message, url: anotUrl });
        });
    }

    function saveAnotacaoToServer(
        url: string,
        line: string,
        priority: boolean,
        onDone?: () => void,
        onFail?: (e: Error) => void
    ) {
        invalidatePage(url);
        fetchPage(url).then(function (docA) {
            return submitForm(docA, { txaDescricao: line, chkSinPrioridade: priority ? 'on' : false });
        }).then(function () {
            invalidatePage(url);
            if (typeof onDone === 'function') onDone();
        }).catch(function (e: Error) {
            if (typeof onFail === 'function') onFail(e);
        });
    }

    function appendSvgRect(svg: SVGElement, x: string, y: string, width: string, height: string, rx: string) {
        const rect = doc.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', x);
        rect.setAttribute('y', y);
        rect.setAttribute('width', width);
        rect.setAttribute('height', height);
        rect.setAttribute('rx', rx);
        rect.setAttribute('fill', 'currentColor');
        svg.appendChild(rect);
    }

    function createPresetRankIcon(barCount: number, act: string, label: string): HTMLButtonElement {
        const btn = doc.createElement('button');
        btn.type = 'button';
        btn.className = 'seipro-anot-btn seipro-anot-preset';
        btn.dataset.act = act;
        btn.title = label;
        btn.setAttribute('aria-label', label);

        const svg = doc.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 20 20');
        svg.setAttribute('aria-hidden', 'true');
        svg.setAttribute('focusable', 'false');

        const circle = doc.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', '10');
        circle.setAttribute('cy', '10');
        circle.setAttribute('r', '8.2');
        circle.setAttribute('fill', 'none');
        circle.setAttribute('stroke', 'currentColor');
        circle.setAttribute('stroke-width', '1.25');
        svg.appendChild(circle);

        if (barCount === 2) {
            appendSvgRect(svg, '5.2', '6.4', '9.6', '1.6', '0.8');
            appendSvgRect(svg, '5.2', '11.9', '9.6', '1.6', '0.8');
        } else {
            appendSvgRect(svg, '5.2', '4.9', '9.6', '1.6', '0.8');
            appendSvgRect(svg, '5.2', '9.2', '9.6', '1.6', '0.8');
            appendSvgRect(svg, '5.2', '13.5', '9.6', '1.6', '0.8');
        }
        btn.appendChild(svg);
        return btn;
    }

    function createActionBtn(className: string, act: string, title: string, hidden?: boolean): HTMLButtonElement {
        const btn = doc.createElement('button');
        btn.type = 'button';
        btn.className = 'seipro-anot-btn';
        btn.dataset.act = act;
        btn.title = title;
        btn.setAttribute('aria-label', title);
        if (hidden) btn.classList.add('seipro-infoarvore-hidden');
        btn.appendChild(createFaIcon(doc, className));
        return btn;
    }

    function createAnotacaoStaticUI(initialText: string, initialPriority: boolean, stamp: AnotStamp) {
        const editor = doc.createElement('div');
        editor.className = 'seipro-anot-editor';
        editor.setAttribute('contenteditable', 'false');
        editor.dataset.original = initialText;
        editor.dataset.priority = initialPriority ? '1' : '0';
        anotDomFromLine(editor, initialText);
        if (!initialText) {
            clearChildren(editor);
            const ph = doc.createElement('div');
            ph.className = 'seipro-anot-placeholder';
            ph.textContent = '(sem anotação — clique em ✏️ para adicionar)';
            editor.appendChild(ph);
        }
        if (initialPriority) editor.classList.add('is-priority');
        decorateReadonly(editor);

        const actions = doc.createElement('div');
        actions.className = 'seipro-anot-actions';
        actions.appendChild(createActionBtn('fas fa-edit azulColor', 'edit', 'Editar'));
        actions.appendChild(createActionBtn('fas fa-save azulColor', 'save', 'Salvar', true));
        actions.appendChild(createActionBtn('fas fa-times-circle is-muted', 'cancel', 'Cancelar', true));
        actions.appendChild(createActionBtn('fas fa-check-square azulColor', 'check', 'Alternar checklist na linha', true));
        actions.appendChild(createActionBtn('fas fa-calendar-plus azulColor', 'date', 'Inserir data'));

        const dateInput = doc.createElement('input');
        dateInput.type = 'date';
        dateInput.className = 'seipro-anot-date-input seipro-infoarvore-hidden';
        actions.appendChild(dateInput);

        const prioBtn = createActionBtn(
            'fas fa-exclamation-circle ' + (initialPriority ? 'is-prio-on' : 'is-prio-off'),
            'prio',
            'Prioridade'
        );
        actions.appendChild(prioBtn);

        const presets = doc.createElement('span');
        presets.className = 'seipro-anot-presets';
        presets.appendChild(createPresetRankIcon(2, 'preset-chefia', 'Adicionar: Aguardando a assinatura da chefia imediata'));
        presets.appendChild(createPresetRankIcon(3, 'preset-superintendente', 'Adicionar: Aguardando a assinatura do superintendente'));
        actions.appendChild(presets);

        const count = doc.createElement('span');
        count.className = 'seipro-anot-count';
        actions.appendChild(count);

        actions.appendChild(createActionBtn('fas fa-trash-alt is-danger', 'remove', 'Remover'));
        actions.appendChild(createActionBtn('fas fa-thumbs-up is-confirm', 'remove-confirm', 'Confirmar remoção', true));
        actions.appendChild(createActionBtn('fas fa-thumbs-down is-muted', 'remove-cancel', 'Cancelar', true));

        const stampEl = doc.createElement('div');
        stampEl.className = 'seipro-anot-stamp';
        if (stamp && stamp.user) {
            const when = new Date(stamp.at);
            stampEl.appendChild(createFaIcon(doc, 'far fa-user seipro-anot-stamp-icon'));
            stampEl.appendChild(doc.createTextNode('por '));
            const strong = doc.createElement('strong');
            strong.textContent = stamp.user;
            stampEl.appendChild(strong);
            stampEl.appendChild(doc.createTextNode(' em ' + when.toLocaleString('pt-BR')));
        }

        return { editor: editor, actions: actions, stampEl: stampEl };
    }

    function buildAnotUI(url: string, initialText: string, initialPriority: boolean, opts?: BuildAnotOpts) {
        opts = opts || {};
        clearChildren(anotBody);
        anotBody.classList.toggle('seipro-anot-priority', initialPriority);

        const idProc = (win.location.href.match(/id_procedimento=(\d+)/) || [])[1];
        const stampKey = 'seiProAnotStamp_' + idProc;
        let userSEI = '';
        try {
            userSEI = (win.parent && (win.parent as Window & { userSEI?: string }).userSEI) || '';
        } catch {
            userSEI = '';
        }
        if (opts.justSaved) {
            try { win.localStorage.setItem(stampKey, JSON.stringify({ user: userSEI, at: Date.now() })); } catch { /* ignore */ }
        }
        let stamp: AnotStamp = null;
        try { stamp = JSON.parse(win.localStorage.getItem(stampKey) || 'null'); } catch { stamp = null; }
        const ui = createAnotacaoStaticUI(initialText, initialPriority, stamp);
        const editor = ui.editor;
        const actions = ui.actions;
        const stampEl = ui.stampEl;

        anotBody.appendChild(editor);
        anotBody.appendChild(actions);
        if (stamp) anotBody.appendChild(stampEl);

        let savedSelectionRange: Range | null = null;
        function saveEditorSelection() {
            try {
                const sel = win.getSelection();
                if (!sel || !sel.rangeCount) return;
                const range = sel.getRangeAt(0);
                if (!range || !range.commonAncestorContainer || !editor.contains(range.commonAncestorContainer)) return;
                savedSelectionRange = range.cloneRange();
            } catch { /* ignore */ }
        }
        function restoreEditorSelection() {
            try {
                if (!savedSelectionRange) return false;
                const sel = win.getSelection();
                if (!sel) return false;
                sel.removeAllRanges();
                sel.addRange(savedSelectionRange);
                editor.focus();
                return true;
            } catch {
                return false;
            }
        }

        function setBtnHidden(act: string, hidden: boolean) {
            const btn = actions.querySelector('[data-act="' + act + '"]');
            if (!btn) return;
            btn.classList.toggle('seipro-infoarvore-hidden', hidden);
        }

        function setMode(editing: boolean) {
            editor.setAttribute('contenteditable', editing ? 'true' : 'false');
            editor.classList.toggle('is-editing', editing);
            setBtnHidden('edit', editing);
            setBtnHidden('save', !editing);
            setBtnHidden('cancel', !editing);
            setBtnHidden('check', !editing);
            if (editing) {
                if (!editor.dataset.original) {
                    clearChildren(editor);
                    const d = doc.createElement('div');
                    d.appendChild(doc.createElement('br'));
                    editor.appendChild(d);
                } else {
                    anotDomFromLine(editor, editor.dataset.original);
                }
                editor.focus();
            } else {
                anotDomFromLine(editor, editor.dataset.original || '');
                decorateReadonly(editor);
            }
            updateDirtyIndicator();
        }

        function isDirty() {
            const cur = anotLineFromDom(editor);
            return cur !== editor.dataset.original;
        }
        function updateDirtyIndicator() {
            const saveBtn = actions.querySelector('[data-act="save"]');
            if (!saveBtn) return;
            let dot = saveBtn.querySelector('.seipro-anot-dirty');
            if (editor.getAttribute('contenteditable') === 'true' && isDirty()) {
                if (!dot) {
                    dot = doc.createElement('span');
                    dot.className = 'seipro-anot-dirty';
                    saveBtn.appendChild(dot);
                }
            } else if (dot) {
                dot.remove();
            }
        }
        function updateCount() {
            const cur = (editor.textContent || '').length;
            const max = 500;
            const c = actions.querySelector('.seipro-anot-count');
            if (!c) return;
            c.textContent = cur >= max ? 'limite atingido' : (max - cur) + ' restantes';
            c.classList.toggle('is-limit', cur >= max);
        }
        let autoSaveTimer: ReturnType<typeof setTimeout> | null = null;
        editor.addEventListener('input', function () {
            updateCount();
            updateDirtyIndicator();
            if (autoSaveTimer) clearTimeout(autoSaveTimer);
            if (editor.getAttribute('contenteditable') === 'true') {
                autoSaveTimer = setTimeout(function () {
                    if (isDirty()) {
                        log('anotacao: auto-save');
                        doSave({ keepEditing: true, caretOffset: getCaretCharOffset(editor) });
                    }
                }, 5000);
            }
        });
        editor.addEventListener('mouseup', saveEditorSelection);
        editor.addEventListener('keyup', saveEditorSelection);
        editor.addEventListener('keydown', function (ev) {
            if ((ev.ctrlKey || ev.metaKey) && ev.key === 'Enter') { ev.preventDefault(); doSave(); }
            else if ((ev.ctrlKey || ev.metaKey) && (ev.key === 's' || ev.key === 'S')) { ev.preventDefault(); doSave({ keepEditing: true }); }
            else if (ev.key === 'Escape') { ev.preventDefault(); anotDomFromLine(editor, editor.dataset.original || ''); setMode(false); }
        });
        editor.addEventListener('paste', function (ev) {
            ev.preventDefault();
            const clip = (ev as ClipboardEvent).clipboardData || (win as Window & { clipboardData?: DataTransfer }).clipboardData;
            const text = clip ? clip.getData('text/plain') : '';
            doc.execCommand('insertText', false, text);
        });

        actions.addEventListener('mousedown', function () {
            saveEditorSelection();
        });
        actions.addEventListener('click', function (ev) {
            const btn = (ev.target as Element | null)?.closest?.('[data-act]');
            if (!btn) return;
            const act = (btn as HTMLElement).dataset.act;
            log('anotacao action:', act);
            if (act === 'edit') { setMode(true); updateCount(); return; }
            if (act === 'cancel') { anotDomFromLine(editor, editor.dataset.original || ''); setMode(false); return; }
            if (act === 'save') { doSave(); return; }
            if (act === 'remove') { toggleRemoveConfirm(true); return; }
            if (act === 'remove-cancel') { toggleRemoveConfirm(false); return; }
            if (act === 'remove-confirm') { doRemove(); return; }
            if (act === 'prio') { togglePriority(); return; }
            if (act === 'preset-chefia') { applyPresetText('Aguardando a assinatura da chefia imediata'); return; }
            if (act === 'preset-superintendente') { applyPresetText('Aguardando a assinatura do superintendente'); return; }
            if (act === 'check') { toggleChecklistOnSelection(); return; }
            if (act === 'date') { toggleDateInput(); return; }
        });
        editor.addEventListener('click', function (ev) {
            if (editor.getAttribute('contenteditable') === 'true') return;
            const line = (ev.target as Element | null)?.closest?.('div');
            if (!line || line === editor) return;
            if (!line.classList.contains('stickNoteCheck')) return;
            line.classList.toggle('stickNoteChecked');
            const newLine = anotLineFromDom(editor);
            persist(newLine, editor.dataset.priority === '1', 'check');
        });
        editor.addEventListener('dblclick', function (ev) {
            if (editor.getAttribute('contenteditable') === 'true') return;
            setMode(true); updateCount();
            try {
                const caretDoc = doc as Document & {
                    caretRangeFromPoint?: (x: number, y: number) => Range | null;
                };
                const range = caretDoc.caretRangeFromPoint
                    ? caretDoc.caretRangeFromPoint(ev.clientX, ev.clientY)
                    : null;
                if (range) {
                    const sel = doc.getSelection();
                    if (sel) {
                        sel.removeAllRanges();
                        sel.addRange(range);
                    }
                } else {
                    placeCaretAtEnd(editor);
                }
            } catch {
                placeCaretAtEnd(editor);
            }
        });

        function toggleRemoveConfirm(show: boolean) {
            setBtnHidden('remove', show);
            setBtnHidden('remove-confirm', !show);
            setBtnHidden('remove-cancel', !show);
        }
        function togglePriority() {
            const newPri = editor.dataset.priority !== '1';
            const prioEl = actions.querySelector('[data-act="prio"]') as HTMLElement | null;
            if (editor.getAttribute('contenteditable') === 'true') {
                editor.dataset.priority = newPri ? '1' : '0';
                if (prioEl) {
                    prioEl.classList.toggle('is-prio-on', newPri);
                    prioEl.classList.toggle('is-prio-off', !newPri);
                }
                editor.classList.toggle('is-priority', newPri);
            } else {
                persist(editor.dataset.original || '', newPri, 'priority');
            }
        }
        function applyPresetText(text: string) {
            let base = (editor.getAttribute('contenteditable') === 'true') ? anotLineFromDom(editor) : (editor.dataset.original || '');
            base = base ? base.replace(/\s+$/, '') : '';
            const next = base ? (base + '\n' + text) : text;
            persist(next.slice(0, 500), editor.dataset.priority === '1', 'preset', false);
        }
        function toggleChecklistOnSelection() {
            if (!restoreEditorSelection()) saveEditorSelection();
            const sel = doc.getSelection();
            let line: Node | null = null;
            if (sel && sel.anchorNode) {
                line = sel.anchorNode.nodeType === 1 ? sel.anchorNode : sel.anchorNode.parentNode;
            }
            if (!line || line === editor || !editor.contains(line)) {
                line = editor.querySelector('div');
            }
            while (line && line.parentNode !== editor) line = line.parentNode;
            if (!line || !(line instanceof HTMLElement)) return;
            if (line.classList.contains('stickNoteChecked')) {
                line.classList.remove('stickNoteChecked', 'stickNoteCheck');
            } else if (line.classList.contains('stickNoteCheck')) {
                line.classList.add('stickNoteChecked');
            } else {
                line.classList.add('stickNoteCheck');
            }
        }
        function toggleDateInput() {
            const input = actions.querySelector('.seipro-anot-date-input') as HTMLInputElement | null;
            if (!input) return;
            if (input.classList.contains('seipro-infoarvore-hidden')) {
                input.classList.remove('seipro-infoarvore-hidden');
                input.value = new Date().toISOString().slice(0, 10);
                input.focus();
            } else {
                input.classList.add('seipro-infoarvore-hidden');
                const v = input.value;
                if (!v) return;
                const parts = v.split('-');
                const formatted = parts[2] + '/' + parts[1] + '/' + parts[0];
                if (editor.getAttribute('contenteditable') !== 'true') setMode(true);
                const sel = doc.getSelection();
                if (sel && sel.anchorNode && editor.contains(sel.anchorNode)) {
                    doc.execCommand('insertText', false, ' ' + formatted);
                } else {
                    editor.appendChild(doc.createTextNode(' ' + formatted));
                }
                editor.focus();
            }
        }

        function doSave(saveOpts?: BuildAnotOpts) {
            saveOpts = saveOpts || {};
            const line = anotLineFromDom(editor).slice(0, 500);
            persist(line, editor.dataset.priority === '1', 'save', saveOpts.keepEditing, saveOpts.caretOffset);
        }
        function doRemove() {
            persist('', false, 'remove', false);
        }

        function persist(
            line: string,
            priority: boolean,
            kind: string,
            keepEditing?: boolean,
            caretOffset?: number | null
        ) {
            actions.querySelectorAll('.seipro-anot-btn').forEach(function (btnEl) {
                btnEl.classList.add('is-busy');
            });
            saveAnotacaoToServer(url, line, priority, function () {
                log('infoarvore_anotacoes: ' + kind + ' ok (priority=' + priority + ', len=' + line.length + ')');
                buildAnotUI(url, line, priority, { justSaved: true, keepEditing: keepEditing, caretOffset: caretOffset });
            }, function (e) {
                actions.querySelectorAll('.seipro-anot-btn').forEach(function (btnEl) {
                    btnEl.classList.remove('is-busy');
                });
                report('infoarvore_anotacoes: ' + kind + ' failed', { error: e.message, kind: kind });
                alert('Falha ao salvar anotação: ' + e.message);
            });
        }

        updateCount();

        if (opts.keepEditing) {
            setMode(true);
            if (typeof opts.caretOffset === 'number' && opts.caretOffset >= 0) setCaretCharOffset(editor, opts.caretOffset);
            else placeCaretAtEnd(editor);
        }
    }

    const _caret = createCaret({ doc: doc, win: win });
    function placeCaretAtEnd(el: HTMLElement) { return _caret.placeCaretAtEnd(el); }
    function getCaretCharOffset(el: HTMLElement) { return _caret.getCaretCharOffset(el); }
    function setCaretCharOffset(el: HTMLElement, target: number) { return _caret.setCaretCharOffset(el, target); }

    function decorateReadonly(editor: HTMLElement) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        Array.prototype.forEach.call(editor.children, function (div: HTMLElement) {
            if (!div.textContent) return;
            const txt = div.textContent;
            const dm = txt.match(/\b(\d{1,2})\/(\d{1,2})\/(\d{4})\b/);
            if (dm && dm[1] && dm[2] && dm[3]) {
                const d = new Date(+dm[3], +dm[2] - 1, +dm[1]);
                if (!isNaN(d.getTime()) && d < today) {
                    div.classList.add('seipro-anot-expired');
                    div.title = 'Data vencida';
                }
            }
            const pnRe = /(\d{5}\.?\d{6}\/?\d{4}-?\d{2})/g;
            if (pnRe.test(txt)) {
                const walker = doc.createTreeWalker(div, NodeFilter.SHOW_TEXT, null);
                const targets: Text[] = [];
                while (walker.nextNode()) targets.push(walker.currentNode as Text);
                targets.forEach(function (node) {
                    const parts = node.nodeValue ? node.nodeValue.split(/(\d{5}\.?\d{6}\/?\d{4}-?\d{2})/g) : [];
                    if (parts.length < 2) return;
                    const frag = doc.createDocumentFragment();
                    parts.forEach(function (part) {
                        if (/^\d{5}\.?\d{6}\/?\d{4}-?\d{2}$/.test(part)) {
                            const a = doc.createElement('a');
                            a.href = win.location.origin + win.location.pathname.replace(/\/sei\/.*$/, '/sei/') + '#' + part;
                            a.target = '_blank';
                            a.textContent = part;
                            a.className = 'seipro-anot-proc-link';
                            frag.appendChild(a);
                        } else {
                            frag.appendChild(doc.createTextNode(part));
                        }
                    });
                    if (node.parentNode) node.parentNode.replaceChild(frag, node);
                });
            }
        });
    }
}
