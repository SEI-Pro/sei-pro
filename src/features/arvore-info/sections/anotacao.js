import { createCaret } from '../dom/caret.js';
import { stripChecklistMarker, parseAnotLinePrefix } from '../parse/anotacao.js';

/**
 * Seção "Anotação" (sticknote) do painel infoarvore — Etapa D (split por seção).
 * É o editor mais rico: edit/save/cancel/remove/prioridade/data/checklist, com
 * round-trip texto-plano ↔ contenteditable e cursor (caret) estável no auto-save.
 * View pura de DOM; recebe deps via ctx. Lógica de checklist vem de parse/anotacao.
 *
 * ctx = { doc, win, fetchPage, invalidatePage, refreshers, sectionEnabled, anotPanel,
 *         findToolbarLink, log, warn, err, report, normalizeMojibakeUtf8 }
 */
export function installAnotacaoSection(ctx) {
    var doc = ctx.doc, win = ctx.win;
    var fetchPage = ctx.fetchPage, invalidatePage = ctx.invalidatePage, submitForm = ctx.submitForm;
    var refreshers = ctx.refreshers, sectionEnabled = ctx.sectionEnabled;
    var anotPanel = ctx.anotPanel, findToolbarLink = ctx.findToolbarLink;
    var log = ctx.log, warn = ctx.warn, err = ctx.err, report = ctx.report;
    var normalizeMojibakeUtf8 = ctx.normalizeMojibakeUtf8;

    // Anotação format helpers — lossless round-trip between contenteditable DOM and SEI's plain-text column.
    // Plain-text columns: each line is a paragraph; "[ ] " / "[X] " prefixes mark checklist items.
    function anotLineFromDom(container) {
        var lines = [];
        var children = container.children.length ? container.children : [container];
        Array.prototype.forEach.call(children, function (el) {
            if (el.tagName === 'BR') { lines.push(''); return; }
            var text = (el.textContent || '').replace(/\s+$/, '');
            if (!text) { lines.push(''); return; }
            var prefix = el.classList.contains('stickNoteChecked') ? '[X] '
                       : el.classList.contains('stickNoteCheck')   ? '[ ] ' : '';
            lines.push(prefix + stripChecklistMarker(text));
        });
        while (lines.length && lines[lines.length - 1] === '') lines.pop();
        return lines.join('\n');
    }
    function anotDomFromLine(container, line) {
        container.innerHTML = '';
        if (!line) { var emptyDiv = doc.createElement('div'); emptyDiv.appendChild(doc.createElement('br')); container.appendChild(emptyDiv); return; }
        line.split('\n').forEach(function (raw) {
            var div = doc.createElement('div');
            if (!raw) { div.appendChild(doc.createElement('br')); container.appendChild(div); return; }
            var parsed = parseAnotLinePrefix(raw);
            if (parsed.check && parsed.checked) div.classList.add('stickNoteCheck', 'stickNoteChecked');
            else if (parsed.check) div.classList.add('stickNoteCheck');
            div.textContent = parsed.rest;
            container.appendChild(div);
        });
    }

            var anotBody = anotPanel.querySelector('.seipro-anot-body');
            var anotUrl = findToolbarLink('anotacao_registrar') || findToolbarLink('acao=anotacao_');
            if (!anotUrl) { warn('infoarvore_anotacoes: toolbar link not found'); anotBody.innerHTML = '<span style="opacity:0.6">(indisponível)</span>'; }
            else {
                refreshers.anotacoes = function () { invalidatePage(anotUrl); renderAnotacao(anotUrl); };
                if (sectionEnabled('anotacoes')) renderAnotacao(anotUrl);
                else log('infoarvore_anotacoes: skipped (section disabled by user)');
            }

            function readAnotacaoData(docA) {
                var ta  = docA.getElementById('txaDescricao');
                var pri = docA.getElementById('chkSinPrioridade');
                return {
                    text: normalizeMojibakeUtf8(ta ? (ta.value || ta.textContent || '') : ''),
                    priority: !!(pri && (pri.checked || pri.getAttribute('checked') !== null))
                };
            }

            function renderAnotacao(url) {
                fetchPage(url).then(function (docA) {
                    var data = readAnotacaoData(docA);
                    buildAnotUI(url, data.text, data.priority);
                    log('infoarvore_anotacoes: loaded (priority=' + data.priority + ', len=' + data.text.length + ')');
                }).catch(function (e) {
                    anotBody.innerHTML = '<span class="infoAlerta">(falha ao carregar anotação)</span>';
                    report('infoarvore_anotacoes: fetch failed', { error: e.message, url: anotUrl });
                });
            }

            function saveAnotacaoToServer(url, line, priority, onDone, onFail) {
                invalidatePage(url);
                fetchPage(url).then(function (docA) {
                    return submitForm(docA, { txaDescricao: line, chkSinPrioridade: priority ? 'on' : false });
                }).then(function () {
                    invalidatePage(url);
                    if (typeof onDone === 'function') onDone();
                }).catch(function (e) {
                    if (typeof onFail === 'function') onFail(e);
                });
            }

            function createPresetRankIconHtml(barCount, act, label) {
                var bars = barCount === 2
                    ? [
                        '<rect x="5.2" y="6.4" width="9.6" height="1.6" rx="0.8" fill="currentColor"></rect>',
                        '<rect x="5.2" y="11.9" width="9.6" height="1.6" rx="0.8" fill="currentColor"></rect>'
                    ].join('')
                    : [
                        '<rect x="5.2" y="4.9" width="9.6" height="1.6" rx="0.8" fill="currentColor"></rect>',
                        '<rect x="5.2" y="9.2" width="9.6" height="1.6" rx="0.8" fill="currentColor"></rect>',
                        '<rect x="5.2" y="13.5" width="9.6" height="1.6" rx="0.8" fill="currentColor"></rect>'
                    ].join('');
                return (
                    '<i class="seipro-anot-btn seipro-anot-preset" data-act="' + act + '" title="' + label + '" aria-label="' + label + '" role="button" style="cursor:pointer;color:#666;display:inline-flex;align-items:center;justify-content:center;width:30px;height:30px;line-height:1;font-size:0;">' +
                        '<svg viewBox="0 0 20 20" aria-hidden="true" focusable="false" style="width:30px;height:30px;display:block;pointer-events:none;">' +
                            '<circle cx="10" cy="10" r="8.2" fill="none" stroke="currentColor" stroke-width="1.25"></circle>' +
                            bars +
                        '</svg>' +
                    '</i>'
                );
            }

            function createAnotacaoStaticUI(initialText, initialPriority, stamp) {
                var editor = doc.createElement('div');
                editor.className = 'seipro-anot-editor';
                editor.setAttribute('contenteditable', 'false');
                editor.style.cssText = 'min-height:24px;padding:6px;border:1px solid transparent;border-radius:4px;white-space:pre-wrap;max-width:100%;outline:none;';
                editor.dataset.original = initialText;
                editor.dataset.priority = initialPriority ? '1' : '0';
                anotDomFromLine(editor, initialText);
                if (!initialText) editor.innerHTML = '<div style="opacity:0.5;font-style:italic;">(sem anotação — clique em ✏️ para adicionar)</div>';
                if (initialPriority) editor.style.borderLeft = '3px solid #d33';
                decorateReadonly(editor);

                var actions = doc.createElement('div');
                actions.className = 'seipro-anot-actions';
                actions.style.cssText = 'margin-top:6px;display:flex;gap:10px;align-items:center;font-size:90%;';
                actions.innerHTML =
                    '<i class="fas fa-edit azulColor seipro-anot-btn" data-act="edit"  title="Editar" style="cursor:pointer;"></i>' +
                    '<i class="fas fa-save azulColor seipro-anot-btn" data-act="save"  title="Salvar" style="cursor:pointer;display:none;"></i>' +
                    '<i class="fas fa-times-circle seipro-anot-btn" data-act="cancel"  title="Cancelar" style="cursor:pointer;color:#888;display:none;"></i>' +
                    '<i class="fas fa-check-square azulColor seipro-anot-btn" data-act="check"  title="Alternar checklist na linha" style="cursor:pointer;display:none;"></i>' +
                    '<i class="fas fa-calendar-plus azulColor seipro-anot-btn" data-act="date"  title="Inserir data" style="cursor:pointer;"></i>' +
                    '<input type="date" class="seipro-anot-date-input" style="display:none;">' +
                    '<i class="fas fa-exclamation-circle seipro-anot-btn" data-act="prio"  title="Prioridade" style="cursor:pointer;color:' + (initialPriority ? '#d33' : '#888') + ';"></i>' +
                    '<span class="seipro-anot-presets" style="display:inline-flex;gap:6px;align-items:center;margin-left:6px;">' +
                        createPresetRankIconHtml(2, 'preset-chefia', 'Adicionar: Aguardando a assinatura da chefia imediata') +
                        createPresetRankIconHtml(3, 'preset-superintendente', 'Adicionar: Aguardando a assinatura do superintendente') +
                    '</span>' +
                    '<span class="seipro-anot-count" style="margin-left:auto;font-size:85%;color:#888;"></span>' +
                    '<i class="fas fa-trash-alt seipro-anot-btn" data-act="remove"  title="Remover" style="cursor:pointer;color:#a33;"></i>' +
                    '<i class="fas fa-thumbs-up seipro-anot-btn" data-act="remove-confirm"  title="Confirmar remoção" style="cursor:pointer;color:#393;display:none;"></i>' +
                    '<i class="fas fa-thumbs-down seipro-anot-btn" data-act="remove-cancel"  title="Cancelar" style="cursor:pointer;color:#888;display:none;"></i>';

                var stampEl = doc.createElement('div');
                stampEl.style.cssText = 'font-size:80%;color:#666;margin-top:4px;';
                if (stamp && stamp.user) {
                    var when = new Date(stamp.at);
                    stampEl.innerHTML = '<i class="far fa-user" style="margin-right:4px;"></i>por <strong>' + stamp.user + '</strong> em ' + when.toLocaleString('pt-BR');
                }

                return { editor: editor, actions: actions, stampEl: stampEl };
            }

            function buildAnotUI(url, initialText, initialPriority, opts) {
                opts = opts || {};
                anotBody.innerHTML = '';
                anotBody.classList.toggle('seipro-anot-priority', initialPriority);

                // Persist author + timestamp locally keyed by id_procedimento+user (the server doesn't expose a read API).
                var idProc = (win.location.href.match(/id_procedimento=(\d+)/) || [])[1];
                var stampKey = 'seiProAnotStamp_' + idProc;
                var userSEI = (function () { try { return win.parent && win.parent.userSEI; } catch (e) { return ''; } })() || '';
                if (opts.justSaved) {
                    try { win.localStorage.setItem(stampKey, JSON.stringify({ user: userSEI, at: Date.now() })); } catch (e) {}
                }
                var stamp = null;
                try { stamp = JSON.parse(win.localStorage.getItem(stampKey) || 'null'); } catch (e) {}
                var ui = createAnotacaoStaticUI(initialText, initialPriority, stamp);
                var editor = ui.editor;
                var actions = ui.actions;
                var stampEl = ui.stampEl;

                // Dentro do processo a anotação mostra TUDO — sem "ver mais"/colapso.
                // (O clamp de 2 linhas existe só na tela de controle de processos.)

                anotBody.appendChild(editor);
                anotBody.appendChild(actions);
                if (stamp) anotBody.appendChild(stampEl);

                var savedSelectionRange = null;
                function saveEditorSelection() {
                    try {
                        var sel = win.getSelection();
                        if (!sel || !sel.rangeCount) return;
                        var range = sel.getRangeAt(0);
                        if (!range || !range.commonAncestorContainer || !editor.contains(range.commonAncestorContainer)) return;
                        savedSelectionRange = range.cloneRange();
                    } catch (e) {}
                }
                function restoreEditorSelection() {
                    try {
                        if (!savedSelectionRange) return false;
                        var sel = win.getSelection();
                        if (!sel) return false;
                        sel.removeAllRanges();
                        sel.addRange(savedSelectionRange);
                        editor.focus();
                        return true;
                    } catch (e) {
                        return false;
                    }
                }

                function setMode(editing) {
                    editor.setAttribute('contenteditable', editing ? 'true' : 'false');
                    editor.style.border = editing ? '1px dashed #bfa500' : '1px solid transparent';
                    actions.querySelector('[data-act=edit]').style.display   = editing ? 'none' : '';
                    actions.querySelector('[data-act=save]').style.display   = editing ? '' : 'none';
                    actions.querySelector('[data-act=cancel]').style.display = editing ? '' : 'none';
                    actions.querySelector('[data-act=check]').style.display  = editing ? '' : 'none';
                    if (editing) {
                        // Clean up placeholder/linkify/date highlights for editing.
                        if (!editor.dataset.original) { editor.innerHTML = ''; var d = doc.createElement('div'); d.appendChild(doc.createElement('br')); editor.appendChild(d); }
                        else { anotDomFromLine(editor, editor.dataset.original); }
                        editor.focus();
                    } else {
                        anotDomFromLine(editor, editor.dataset.original);
                        decorateReadonly(editor);
                    }
                    updateDirtyIndicator();
                }

                function isDirty() {
                    var cur = anotLineFromDom(editor);
                    return cur !== editor.dataset.original;
                }
                function updateDirtyIndicator() {
                    var saveBtn = actions.querySelector('[data-act=save]');
                    var dot = saveBtn.querySelector('.seipro-anot-dirty');
                    if (editor.getAttribute('contenteditable') === 'true' && isDirty()) {
                        if (!dot) {
                            dot = doc.createElement('span');
                            dot.className = 'seipro-anot-dirty';
                            dot.style.cssText = 'display:inline-block;width:6px;height:6px;border-radius:50%;background:#e69a00;margin-left:2px;vertical-align:top;';
                            saveBtn.appendChild(dot);
                        }
                    } else if (dot) { dot.remove(); }
                }
                function updateCount() {
                    var cur = (editor.textContent || '').length;
                    var max = 500;
                    var c = actions.querySelector('.seipro-anot-count');
                    c.textContent = cur >= max ? 'limite atingido' : (max - cur) + ' restantes';
                    c.style.color = cur >= max ? '#d33' : '#888';
                }
                var autoSaveTimer = null;
                editor.addEventListener('input', function () {
                    updateCount();
                    updateDirtyIndicator();
                    // Auto-save debounced 10s.
                    if (autoSaveTimer) clearTimeout(autoSaveTimer);
                    if (editor.getAttribute('contenteditable') === 'true') {
                        autoSaveTimer = setTimeout(function () {
                            if (isDirty()) {
                                log('anotacao: auto-save');
                                // Preserva a posição do cursor através da reconstrução do editor.
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
                    else if (ev.key === 'Escape') { ev.preventDefault(); anotDomFromLine(editor, editor.dataset.original); setMode(false); }
                });
                editor.addEventListener('paste', function (ev) {
                    ev.preventDefault();
                    var text = (ev.clipboardData || win.clipboardData).getData('text/plain');
                    doc.execCommand('insertText', false, text);
                });

                actions.addEventListener('mousedown', function () {
                    saveEditorSelection();
                });
                actions.addEventListener('click', function (ev) {
                    var btn = ev.target.closest('[data-act]'); if (!btn) return;
                    var act = btn.dataset.act;
                    log('anotacao action:', act);
                    if (act === 'edit')   { setMode(true); updateCount(); return; }
                    if (act === 'cancel') { anotDomFromLine(editor, editor.dataset.original); setMode(false); return; }
                    if (act === 'save')   { doSave(); return; }
                    if (act === 'remove') { toggleRemoveConfirm(true); return; }
                    if (act === 'remove-cancel')  { toggleRemoveConfirm(false); return; }
                    if (act === 'remove-confirm') { doRemove(); return; }
                    if (act === 'prio')   { togglePriority(); return; }
                    if (act === 'preset-chefia') { applyPresetText('Aguardando a assinatura da chefia imediata'); return; }
                    if (act === 'preset-superintendente') { applyPresetText('Aguardando a assinatura do superintendente'); return; }
                    if (act === 'check')  { toggleChecklistOnSelection(); return; }
                    if (act === 'date')   { toggleDateInput(); return; }
                });
                // Click in readonly mode on a checklist div toggles its state (and saves).
                editor.addEventListener('click', function (ev) {
                    if (editor.getAttribute('contenteditable') === 'true') return;
                    var line = ev.target.closest('div'); if (!line || line === editor) return;
                    if (!line.classList.contains('stickNoteCheck')) return;
                    line.classList.toggle('stickNoteChecked');
                    var newLine = anotLineFromDom(editor);
                    persist(newLine, editor.dataset.priority === '1', 'check');
                });
                // Double-click in readonly mode enters edit mode and places caret where clicked.
                editor.addEventListener('dblclick', function (ev) {
                    if (editor.getAttribute('contenteditable') === 'true') return;
                    setMode(true); updateCount();
                    try {
                        var range = doc.caretRangeFromPoint ? doc.caretRangeFromPoint(ev.clientX, ev.clientY) : null;
                        if (range) {
                            var sel = doc.getSelection();
                            sel.removeAllRanges(); sel.addRange(range);
                        } else {
                            placeCaretAtEnd(editor);
                        }
                    } catch (e) { placeCaretAtEnd(editor); }
                });

                function toggleRemoveConfirm(show) {
                    actions.querySelector('[data-act=remove]').style.display         = show ? 'none' : '';
                    actions.querySelector('[data-act=remove-confirm]').style.display = show ? '' : 'none';
                    actions.querySelector('[data-act=remove-cancel]').style.display  = show ? '' : 'none';
                }
                function togglePriority() {
                    var newPri = editor.dataset.priority !== '1';
                    if (editor.getAttribute('contenteditable') === 'true') {
                        // In edit mode, just toggle visually; will persist on save.
                        editor.dataset.priority = newPri ? '1' : '0';
                        actions.querySelector('[data-act=prio]').style.color = newPri ? '#d33' : '#888';
                        editor.style.borderLeft = newPri ? '3px solid #d33' : '';
                    } else {
                        persist(editor.dataset.original, newPri, 'priority');
                    }
                }
                function applyPresetText(text) {
                    var base = (editor.getAttribute('contenteditable') === 'true') ? anotLineFromDom(editor) : (editor.dataset.original || '');
                    base = base ? base.replace(/\s+$/, '') : '';
                    var next = base ? (base + '\n' + text) : text;
                    persist(next.slice(0, 500), editor.dataset.priority === '1', 'preset', false);
                }
                function toggleChecklistOnSelection() {
                    if (!restoreEditorSelection()) saveEditorSelection();
                    var sel = doc.getSelection();
                    var line = null;
                    if (sel && sel.anchorNode) {
                        line = sel.anchorNode.nodeType === 1 ? sel.anchorNode : sel.anchorNode.parentNode;
                    }
                    if (!line || line === editor || !editor.contains(line)) {
                        line = editor.querySelector('div');
                    }
                    while (line && line.parentNode !== editor) line = line.parentNode;
                    if (!line) return;
                    if (line.classList.contains('stickNoteChecked')) { line.classList.remove('stickNoteChecked', 'stickNoteCheck'); }
                    else if (line.classList.contains('stickNoteCheck')) { line.classList.add('stickNoteChecked'); }
                    else { line.classList.add('stickNoteCheck'); }
                }
                function toggleDateInput() {
                    var input = actions.querySelector('.seipro-anot-date-input');
                    if (input.style.display === 'none') {
                        input.style.display = ''; input.value = new Date().toISOString().slice(0,10); input.focus();
                    } else {
                        input.style.display = 'none';
                        var v = input.value; if (!v) return;
                        var parts = v.split('-'); var formatted = parts[2] + '/' + parts[1] + '/' + parts[0];
                        if (editor.getAttribute('contenteditable') !== 'true') setMode(true);
                        var sel = doc.getSelection();
                        if (sel && editor.contains(sel.anchorNode)) doc.execCommand('insertText', false, ' ' + formatted);
                        else { editor.appendChild(doc.createTextNode(' ' + formatted)); }
                        editor.focus();
                    }
                }

                function doSave(opts) {
                    opts = opts || {};
                    var line = anotLineFromDom(editor).slice(0, 500);
                    persist(line, editor.dataset.priority === '1', 'save', opts.keepEditing, opts.caretOffset);
                }
                function doRemove() {
                    persist('', false, 'remove', false);
                }

                function persist(line, priority, kind, keepEditing, caretOffset) {
                    actions.querySelectorAll('i').forEach(function (i) { i.style.pointerEvents = 'none'; i.style.opacity = '0.5'; });
                    saveAnotacaoToServer(url, line, priority, function () {
                        log('infoarvore_anotacoes: ' + kind + ' ok (priority=' + priority + ', len=' + line.length + ')');
                        buildAnotUI(url, line, priority, { justSaved: true, keepEditing: keepEditing, caretOffset: caretOffset });
                    }, function (e) {
                        actions.querySelectorAll('i').forEach(function (i) { i.style.pointerEvents = ''; i.style.opacity = ''; });
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

            // Caret utils extraídos para dom/caret.js (Etapa D). Wrappers preservam
            // hoisting e os call-sites; a fábrica injeta { doc, win }.
            var _caret = createCaret({ doc: doc, win: win });
            function placeCaretAtEnd(el) { return _caret.placeCaretAtEnd(el); }
            function getCaretCharOffset(el) { return _caret.getCaretCharOffset(el); }
            function setCaretCharOffset(el, target) { return _caret.setCaretCharOffset(el, target); }

            // Readonly decorations: highlight expired dates + linkify process numbers.
            function decorateReadonly(editor) {
                var today = new Date(); today.setHours(0,0,0,0);
                Array.prototype.forEach.call(editor.children, function (div) {
                    if (!div.textContent) return;
                    var txt = div.textContent;
                    // Expired date highlight (any DD/MM/YYYY in the past).
                    var dm = txt.match(/\b(\d{1,2})\/(\d{1,2})\/(\d{4})\b/);
                    if (dm) {
                        var d = new Date(+dm[3], +dm[2] - 1, +dm[1]);
                        if (!isNaN(d) && d < today) {
                            div.style.background = '#fac3c4';
                            div.title = 'Data vencida';
                        }
                    }
                    // Linkify SEI process numbers.
                    var pnRe = /(\d{5}\.?\d{6}\/?\d{4}-?\d{2})/g;
                    if (pnRe.test(txt)) {
                        // Rewrite textContent nodes, preserving checklist classes.
                        var walker = doc.createTreeWalker(div, NodeFilter.SHOW_TEXT, null, false);
                        var targets = []; while (walker.nextNode()) targets.push(walker.currentNode);
                        targets.forEach(function (node) {
                            var parts = node.nodeValue.split(/(\d{5}\.?\d{6}\/?\d{4}-?\d{2})/g);
                            if (parts.length < 2) return;
                            var frag = doc.createDocumentFragment();
                            parts.forEach(function (part) {
                                if (/^\d{5}\.?\d{6}\/?\d{4}-?\d{2}$/.test(part)) {
                                    var a = doc.createElement('a');
                                    a.href = win.location.origin + win.location.pathname.replace(/\/sei\/.*$/, '/sei/') + '#' + part;
                                    a.target = '_blank';
                                    a.textContent = part;
                                    a.style.color = '#0066cc';
                                    frag.appendChild(a);
                                } else {
                                    frag.appendChild(doc.createTextNode(part));
                                }
                            });
                            node.parentNode.replaceChild(frag, node);
                        });
                    }
                });
            }
}
