// Árvore bootstrap + enrichment pipeline.
// Runs inside ifrArvore on procedimento_visualizar (SEI 4.1 / 5.x).
//
// Design:
//   - Single lifecycle via Promise.all([treeReady, parentReady]); never aborts (degrades to stub parent).
//   - Pipeline of idempotent enrichers keyed per anchor (data-seipro-done); re-run only on new nodes.
//   - One debounced MutationObserver (rAF) — no concurrent polling loops.
//   - Delegated event handlers, no inline onclick.
//   - Loud console logs whenever an expected precondition fails (so "loads incompletely" is diagnosable).

(function (win, doc) {
    'use strict';
    if (win.__SEI_PRO_TREE_BOOT__) { console.warn('[SeiProTree] already booted — skipping'); return; }
    win.__SEI_PRO_TREE_BOOT__ = true;

    var TAG = '[SeiProTree]';
    var DONE_ATTR = 'data-seipro-done';
    // Tree root must contain BOTH #topmenu (process root anchor) and #divArvore (document anchors).
    // body.infraArvore is the iframe body and covers both. Readiness is gated on #divArvore having
    // populated children (see treeReady).
    var TREE_ROOT_SEL = 'body.infraArvore';
    var TREE_READY_GATE_SEL = '#divArvore';
    // Anchor selector: literal source of truth here. seiProArvore helpers in sei-functions-pro.js
    // expose the same selectors via SEL_PROCESS/SEL_DOCUMENT — kept in sync by manual review.
    // (Resolving via win.seiProArvore at script-eval time race-conditions against $.getScript order.)
    var ANCHOR_SEL = 'a.infraArvoreNo[target="ifrConteudoVisualizacao"], a.infraArvoreNo[target="ifrVisualizacao"]';
    // Short timeout: if parent helpers aren't ready in 2.5s, proceed with a stub so panels still mount
    // (this is the user's reported "às vezes não carrega" — never let the boot abort silently).
    var PARENT_READY_TIMEOUT = 2500;
    var TREE_READY_TIMEOUT = 15000;

    function log()  { console.log.apply(console, [TAG].concat([].slice.call(arguments))); }
    function warn() { console.warn.apply(console, [TAG].concat([].slice.call(arguments))); }
    function err()  { console.error.apply(console, [TAG].concat([].slice.call(arguments))); }

    // report(): "the extension didn't do what it planned to do." Always logs as console.error so the
    // existing auto-reporter (sei-functions-pro.ensureSEIProLogCapture → scheduleSEIProAutomaticErrorReport)
    // ships it to the Apps Script endpoint. Includes structured context so we can debug remotely
    // without needing the user to reproduce.
    function reportContext() {
        var ctx = { url: '', frame: '', idProc: '', host: '' };
        try {
            ctx.url = (win.location && win.location.href || '').split('?')[0];
            ctx.frame = (win.name || '') || (win === win.top ? 'top' : 'iframe');
            ctx.host = win.location && win.location.hostname || '';
            // Try to extract idProc from current URL
            var m = (win.location && win.location.href || '').match(/[?&]id_procedimento=(\d+)/);
            if (m) ctx.idProc = m[1];
        } catch (e) {}
        return ctx;
    }
    function report(reason, detail) {
        var ctx = reportContext();
        console.error.call(console, TAG, '[REPORT]', reason, '| ctx=' + JSON.stringify(ctx) + (detail !== undefined ? ' | detail=' + (typeof detail === 'string' ? detail : JSON.stringify(detail)) : ''));
    }

    // ---------- Readiness (Promise-based, no polling) ----------

    function waitFor(name, predicate, root, timeoutMs) {
        return new Promise(function (resolve, reject) {
            var v = predicate();
            if (v) { log(name, 'ready (sync)'); return resolve(v); }
            var timer = setTimeout(function () {
                mo.disconnect();
                err(name, 'timeout after', timeoutMs, 'ms');
                reject(new Error(name + ' timeout'));
            }, timeoutMs);
            var mo = new MutationObserver(function () {
                var r = predicate();
                if (r) { clearTimeout(timer); mo.disconnect(); log(name, 'ready (observed)'); resolve(r); }
            });
            mo.observe(root || doc.documentElement, { childList: true, subtree: true });
        });
    }

    function treeReady() {
        return waitFor('treeReady', function () {
            var root = doc.querySelector(TREE_ROOT_SEL);
            if (!root) return null;
            // Gate: documents container must exist AND contain at least one anchor.
            // Process-root-only pages (rare) still resolve via the ANCHOR_SEL fallback below.
            var gate = doc.querySelector(TREE_READY_GATE_SEL);
            if (gate && !gate.querySelector(ANCHOR_SEL)) return null;
            if (!root.querySelector(ANCHOR_SEL)) return null;
            return root;
        }, null, TREE_READY_TIMEOUT);
    }

    // Stub parent: returned when the real parent never finishes booting. Defaults to "feature enabled"
    // for checkConfigValue/verifyConfigValue so panels still mount; user prefs are lost in degraded mode,
    // but visible UI degradation is far worse than losing prefs.
    function stubParent() {
        return {
            __stub: true,
            checkConfigValue: function () { return true; },
            verifyConfigValue: function () { return false; }
        };
    }

    function parentReady() {
        // Event-driven: parent exposes window.SeiProReady (a Promise) resolved when sei-functions-pro.js finishes booting.
        // Falls back to a short rAF probe; never aborts boot — degrades to a stub parent on timeout/error.
        var start = Date.now();
        try {
            if (win.parent && win.parent.SeiProReady && typeof win.parent.SeiProReady.then === 'function') {
                return win.parent.SeiProReady.then(function () {
                    log('parentReady via SeiProReady promise after', Date.now() - start, 'ms');
                    return win.parent;
                });
            }
        } catch (e) {
            warn('parentReady cross-origin error, using stub:', e.message);
            return Promise.resolve(stubParent());
        }

        // Early bail: if parent isn't the trabalhar layout (no #ifrArvore), checkConfigValue will
        // never appear there. Don't poll — degrade silently. This avoids 2.5s of warnings every time
        // the proto runs in a popup/nested document frame that happened to match the URL pattern.
        try {
            if (win.parent && win.parent.document && !win.parent.document.getElementById('ifrArvore')) {
                log('parentReady: parent is not trabalhar context — using stub (silent degrade)');
                return Promise.resolve(stubParent());
            }
        } catch (e) {
            log('parentReady: parent inaccessible (cross-origin) — using stub');
            return Promise.resolve(stubParent());
        }

        warn('parent.SeiProReady missing — polling for checkConfigValue (250ms intervals)');
        return new Promise(function (resolve) {
            (function probe() {
                try {
                    if (win.parent && typeof win.parent.checkConfigValue === 'function') {
                        log('parentReady via fallback probe after', Date.now() - start, 'ms');
                        return resolve(win.parent);
                    }
                } catch (e) { warn('parentReady cross-origin in probe, using stub:', e.message); return resolve(stubParent()); }
                if (Date.now() - start > PARENT_READY_TIMEOUT) {
                    warn('parentReady timeout after', PARENT_READY_TIMEOUT, 'ms — degrading to stub parent (panels still mount, user prefs ignored)');
                    return resolve(stubParent());
                }
                setTimeout(probe, 250);
            })();
        });
    }

    // ---------- Pipeline ----------

    var features = [];
    function register(feature) {
        if (!feature || !feature.id || typeof feature.enrich !== 'function') {
            err('register: invalid feature', feature);
            return;
        }
        features.push(feature);
    }
    win.SeiProTree = { register: register, features: features };

    function hasDone(el, id) { return (el.getAttribute(DONE_ATTR) || '').split(' ').indexOf(id) !== -1; }
    function markDone(el, id) {
        var cur = el.getAttribute(DONE_ATTR) || '';
        el.setAttribute(DONE_ATTR, cur ? cur + ' ' + id : id);
    }

    function runPipeline(ctx, anchors, label) {
        var applied = {};
        for (var i = 0; i < features.length; i++) {
            var f = features[i];
            if (!ctx.enabled[f.id]) continue;
            applied[f.id] = 0;
            for (var j = 0; j < anchors.length; j++) {
                var a = anchors[j];
                if (hasDone(a, f.id)) continue;
                try {
                    f.enrich(a, ctx);
                    markDone(a, f.id);
                    applied[f.id]++;
                } catch (e) {
                    err('feature', f.id, 'threw on', a.id, e);
                }
            }
        }
        log('pipeline', label || '', '— anchors:', anchors.length, 'applied:', applied);
    }

    // ---------- Observer (single, rAF-debounced) ----------

    function observeTree(root, onBatch) {
        var pending = false;
        var queued = new Set();
        var mo = new MutationObserver(function (records) {
            for (var i = 0; i < records.length; i++) {
                var r = records[i];
                for (var j = 0; j < r.addedNodes.length; j++) {
                    var n = r.addedNodes[j];
                    if (n.nodeType !== 1) continue;
                    if (n.matches && n.matches(ANCHOR_SEL)) queued.add(n);
                    if (n.querySelectorAll) n.querySelectorAll(ANCHOR_SEL).forEach(function (a) { queued.add(a); });
                }
            }
            if (pending || queued.size === 0) return;
            pending = true;
            requestAnimationFrame(function () {
                pending = false;
                var batch = Array.from(queued); queued.clear();
                log('observer batch —', batch.length, 'new anchor(s)');
                onBatch(batch);
            });
        });
        mo.observe(root, { childList: true, subtree: true });
        return mo;
    }

    // ---------- Boot ----------

    Promise.all([treeReady(), parentReady()]).then(function (r) {
        var root = r[0], parent = r[1];
        var enabled = features.reduce(function (acc, f) {
            try { acc[f.id] = f.enabled ? !!f.enabled(parent) : true; }
            catch (e) { err('feature.enabled threw for', f.id, e); acc[f.id] = false; }
            if (!acc[f.id]) log('feature disabled:', f.id);
            return acc;
        }, {});
        var ctx = { parent: parent, enabled: enabled };

        features.forEach(function (f) {
            if (ctx.enabled[f.id] && typeof f.initOnce === 'function') {
                try { f.initOnce(ctx); } catch (e) { err('initOnce threw for', f.id, e); }
            }
        });

        runPipeline(ctx, Array.from(root.querySelectorAll(ANCHOR_SEL)), 'initial');
        observeTree(root, function (batch) { runPipeline(ctx, batch, 'incremental'); });

        try {
            // detail.href/loop kept for backwards compatibility with parent-side listeners.
            win.parent.dispatchEvent(new win.parent.CustomEvent('sei-pro-arvore-ready', {
                detail: { href: win.location.href, loop: false, anchors: root.querySelectorAll(ANCHOR_SEL).length, features: Object.keys(enabled).filter(function (k) { return enabled[k]; }) }
            }));
        } catch (e) { warn('could not dispatch sei-pro-arvore-ready:', e.message); }
    }).catch(function (e) { err('boot aborted:', e.message); });

    // ================================================================
    // Feature definitions
    // ================================================================

    // --- DUASLINHAS — break long doc labels: last whitespace-separated token goes on a new line.
    register({
        id: 'duaslinhas',
        enabled: function (p) { return typeof p.verifyConfigValue === 'function' && p.verifyConfigValue('duaslinhas'); },
        enrich: function (a) {
            if (a.nextElementSibling && a.nextElementSibling.classList.contains('breackline_doc')) return;
            var text = a.textContent.trim();
            var idx = text.lastIndexOf(' ');
            if (idx === -1) return;
            var tail = text.slice(idx + 1);
            if (!tail) return;
            var span = doc.createElement('span');
            span.className = 'breackline_doc';
            span.innerHTML = '<br><span style="font-size:9pt;opacity:0.75">' + tail.replace(/[<>&]/g, function (c) { return { '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]; }) + '</span>';
            a.textContent = text.slice(0, idx);
            a.parentNode.insertBefore(span, a.nextSibling);
        }
    });

    // --- NUMERARDOCSARVORE — sequential number badge before each doc anchor (DOM order).
    register({
        id: 'numerar_documentos',
        enabled: function (p) { return typeof p.verifyConfigValue === 'function' && p.verifyConfigValue('numerar_documentos'); },
        initOnce: function () { this._counter = 0; },
        enrich: function (a) {
            if (a.previousElementSibling && a.previousElementSibling.classList.contains('numericDocsPro')) return;
            this._counter = (this._counter || 0) + 1;
            var span = doc.createElement('span');
            span.className = 'numericDocsPro';
            span.setAttribute('data-count', String(this._counter));
            span.textContent = this._counter + '. ';
            span.style.opacity = '0.6';
            span.style.fontSize = '0.85em';
            a.parentNode.insertBefore(span, a);
        }
    });

    // --- URGENTE — red badge on docs whose label contains "(URGENTE)".
    register({
        id: 'urgente',
        enabled: function () { return true; },
        enrich: function (a) {
            if (a.textContent.indexOf('(URGENTE)') === -1) return;
            a.classList.add('urgentePro');
            if (a.querySelector('div.urgentePro')) return;
            var d = doc.createElement('div');
            d.className = 'urgentePro';
            a.insertBefore(d, a.firstChild);
        }
    });

    // --- tag (debug marker) — always on; useful to confirm pipeline reach.
    register({
        id: 'tag',
        enrich: function (a) { a.classList.add('seipro-tagged'); }
    });

    // ================================================================
    // Shared HTML page fetcher (replaces #frmCheckerProcessoPro hidden iframe).
    // Caches per-URL Promise so concurrent consumers share one network round-trip.
    // ================================================================
    // Cache entry: { promise, expiresAt }. TTL bounded so long sessions don't serve stale SEI pages
    // (hash tokens in URLs go stale; data behind a URL can change after a save in another tab).
    // Active edits still use invalidatePage(url) for immediate refresh.
    var PAGE_CACHE_TTL_MS = 60 * 1000;
    var pageCache = Object.create(null);
    function invalidatePage(url) { delete pageCache[url]; }
    function fetchPage(url) {
        var entry = pageCache[url];
        if (entry && entry.expiresAt > Date.now()) return entry.promise;
        if (entry) log('fetchPage cache expired →', url.split('?')[0]);
        else log('fetchPage →', url.split('?')[0]);
        // One automatic retry on transient network errors ("Failed to fetch"), which we see
        // right after iframe-based saves while the SEI session is still settling.
        function tryOnce() {
            return fetch(url, { credentials: 'include' })
                .then(function (r) {
                    if (!r.ok) throw new Error('HTTP ' + r.status);
                    return r.arrayBuffer();
                });
        }
        var promise = tryOnce()
            .catch(function (e) {
                if (!/Failed to fetch|NetworkError/i.test(e.message)) throw e;
                return new Promise(function (res) { setTimeout(res, 500); }).then(tryOnce);
            })
            .then(function (buf) {
                // SEI pages are served as ISO-8859-1 (Latin-1). Decode explicitly to avoid mojibake.
                var html = new TextDecoder('iso-8859-1').decode(buf);
                return new DOMParser().parseFromString(html, 'text/html');
            })
            .catch(function (e) { err('fetchPage failed for', url, e.message); delete pageCache[url]; throw e; });
        pageCache[url] = { promise: promise, expiresAt: Date.now() + PAGE_CACHE_TTL_MS };
        return promise;
    }
    win.SeiProTree.fetchPage = fetchPage;

    // Submit a native SEI form parsed from a fetched page, with overrides for specific fields.
    // Returns a Promise that resolves to the response's parsed HTML (Latin-1 decoded).
    function submitForm(docA, overrides) {
        var form = docA.querySelector('form');
        if (!form) return Promise.reject(new Error('form not found in fetched page'));
        var action = form.getAttribute('action') || '';
        var absAction = new URL(action, docA.baseURI || win.location.href).href;
        var fd = new FormData();
        var inputs = form.querySelectorAll('input, textarea, select, button');
        var submitEl = null;
        inputs.forEach(function (el) {
            var name = el.getAttribute('name');
            var type = (el.getAttribute('type') || el.type || '').toLowerCase();
            if ((el.tagName === 'BUTTON' && (type === 'submit' || type === '')) || (el.tagName === 'INPUT' && type === 'submit')) {
                if (!submitEl && name) submitEl = el;
                return;
            }
            if (!name) return;
            if (overrides.hasOwnProperty(name)) return;
            if (type === 'checkbox' || type === 'radio') {
                if (el.checked || el.getAttribute('checked') !== null) fd.append(name, el.value || 'on');
            } else if (el.tagName === 'SELECT') {
                var sel = el.querySelector('option[selected]') || el.options[el.selectedIndex];
                if (sel) fd.append(name, sel.value);
            } else {
                fd.append(name, el.value != null ? el.value : '');
            }
        });
        if (submitEl) {
            fd.append(submitEl.getAttribute('name'), submitEl.value || submitEl.textContent.trim() || 'Salvar');
            log('submitForm: including submit button', submitEl.getAttribute('name'));
        } else {
            warn('submitForm: no named submit button found — server may reject');
        }
        Object.keys(overrides).forEach(function (k) {
            var v = overrides[k];
            if (v === false || v == null) return; // omit (unchecked checkboxes)
            fd.append(k, v === true ? 'on' : v);
        });
        log('submitForm →', absAction.split('?')[0]);
        return fetch(absAction, { method: 'POST', credentials: 'include', body: fd })
            .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.arrayBuffer(); })
            .then(function (buf) { return new DOMParser().parseFromString(new TextDecoder('iso-8859-1').decode(buf), 'text/html'); });
    }

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
            lines.push(prefix + text.replace(/^\[[ X]\]\s*/, ''));
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
            if (raw.indexOf('[X]') === 0) { div.classList.add('stickNoteCheck', 'stickNoteChecked'); raw = raw.slice(3).trim(); }
            else if (raw.indexOf('[ ]') === 0) { div.classList.add('stickNoteCheck'); raw = raw.slice(3).trim(); }
            div.textContent = raw;
            container.appendChild(div);
        });
    }

    // Helper: find a toolbar anchor by its href pattern.
    // SEI stores process-level action links inline in `Nos[0].acoes = '<html>...'`, not in the DOM.
    // We parse that string (cached) and also fall back to a direct DOM lookup.
    var _toolbarLinksCache = null;
    function getToolbarLinks() {
        if (_toolbarLinksCache) return _toolbarLinksCache;
        var links = [];
        var scripts = doc.querySelectorAll('script:not([src])');
        for (var i = 0; i < scripts.length; i++) {
            var t = scripts[i].textContent || '';
            var m = t.match(/Nos\[0\]\.acoes\s*=\s*'([\s\S]*?)';/);
            if (!m) continue;
            var html = m[1].replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\\\//g, '/');
            var tmp = doc.createElement('div');
            tmp.innerHTML = html;
            var anchors = tmp.querySelectorAll('a[href*="controlador.php?acao="]');
            for (var j = 0; j < anchors.length; j++) {
                var href = anchors[j].getAttribute('href');
                if (!href || href === '#') continue;
                var img = anchors[j].querySelector('img');
                links.push({ name: img ? img.getAttribute('title') : '', url: href });
            }
            break;
        }
        _toolbarLinksCache = links;
        log('toolbar links parsed:', links.length);
        return links;
    }
    function findToolbarLink(hrefFragment) {
        var links = getToolbarLinks();
        for (var i = 0; i < links.length; i++) {
            if (links[i].url && links[i].url.indexOf(hrefFragment) !== -1) return links[i].url;
        }
        var a = doc.querySelector('a[href*="' + hrefFragment + '"]');
        return a ? a.href : null;
    }

    // ================================================================
    // INFOARVORE — lateral panel ("Informações adicionais na árvore").
    // Stage 2: panel scaffold + Atribuição (read from inline <script> Nos[0].html).
    // Stage 3a: Marcador section populated via fetchPage.
    // Parent-side helpers (togglePanelDadosArvore, copyTextThis, editDadosArvorePro)
    // are still called via parent.*, but wired with addEventListener (no inline onclick).
    // ================================================================
    register({
        id: 'infoarvore',
        enabled: function (p) { return typeof p.checkConfigValue === 'function' && p.checkConfigValue('infoarvore'); },
        initOnce: function (ctx) {
            var p = ctx.parent;
            // Mount target preference: #frmArvore (canonical), then #divConsultarAndamento's parent,
            // then body. Resilient to SEI variants where #frmArvore is renamed/removed.
            var frmArvore = doc.getElementById('frmArvore')
                || (doc.getElementById('divConsultarAndamento') && doc.getElementById('divConsultarAndamento').parentNode)
                || doc.body;
            if (!frmArvore) { report('infoarvore: no mount target found — panel cannot mount'); return; }
            log('infoarvore: mount target =', frmArvore.id || frmArvore.tagName);
            if (frmArvore.querySelector('.panelDadosArvore')) { log('infoarvore: panel already mounted — skip'); return; }

            // Honor the user's "Personalizar Menu" selection (configViewFlashPanelArvorePro in localStorage).
            // Each entry is [name]; if storage missing/empty, default = all 9 sections enabled.
            // Maps data-type → user-visible name in the selection.
            var sectionLabels = {
                'responsaveis': 'Atribuição', 'marcador': 'Marcador', 'interessados': 'Interessados',
                'anotacoes': 'Anotações', 'acompanhamento_especial': 'Acompanhamento Especial',
                'tipo_procedimento': 'Tipo de Procedimento', 'nivel_acesso': 'Nível de Acesso',
                'assuntos': 'Assuntos', 'observacoes': 'Observações'
            };
            var enabledSet = (function () {
                var raw = null;
                try { raw = (typeof win.localStorageRestorePro === 'function') ? win.localStorageRestorePro('configViewFlashPanelArvorePro') : null; } catch (e) {}
                if (!raw || (Array.isArray(raw) && raw.length === 0)) return null; // null = all enabled (default)
                var s = {};
                raw.forEach(function (entry) { var n = Array.isArray(entry) ? entry[0] : entry; if (n) s[n] = true; });
                return s;
            })();
            function sectionEnabled(type) {
                if (!enabledSet) return true;
                var label = sectionLabels[type];
                return label ? !!enabledSet[label] : true;
            }
            log('infoarvore: section filter =', enabledSet ? Object.keys(enabledSet).join(',') : 'all (default)');

            // --- 1) Atribuição: scrape responsáveis from SEI inline script (same source the legacy code used).
            var responsaveis = [];
            var scripts = doc.querySelectorAll('script:not([src])');
            for (var i = 0; i < scripts.length; i++) {
                var txt = scripts[i].textContent || '';
                if (txt.indexOf('Nos[0].html = ') === -1) continue;
                var m = txt.match(/Nos\[0\]\.html\s*=\s*'([^']+)'/);
                if (!m) continue;
                var raw = m[1];
                raw.split('<br />').forEach(function (frag) {
                    var tmp = doc.createElement('div');
                    tmp.innerHTML = frag;
                    var text = tmp.textContent.trim();
                    if (text) responsaveis.push({ text: text, unassigned: !/atribuído para/i.test(text) && !!tmp.querySelector('a.ancoraSigla') });
                });
                break;
            }
            log('infoarvore: parsed', responsaveis.length, 'responsável(is) from inline scripts');

            // --- 2) Build panel (Atribuição + Marcador placeholder). No inline onclick.
            var panel = doc.createElement('div');
            panel.className = 'panelDadosArvore';
            panel.dataset.type = 'responsaveis';
            panel.innerHTML =
                '<label class="newLink panelArvoreHead" style="margin-bottom:10px;display:block;">' +
                '  <i class="fas fa-user-tie azulColor iconDadosProcesso"></i> Atribuição:' +
                '  <i class="fas fa-chevron-down azulColor seipro-toggle" style="float:right;cursor:pointer;margin-right:20px;"></i>' +
                '</label>' +
                '<div class="infoDadosArvore"></div>';
            var body = panel.querySelector('.infoDadosArvore');
            if (!responsaveis.length) {
                body.innerHTML = '<span class="infoAlerta">(sem responsáveis)</span>';
            } else {
                responsaveis.forEach(function (r) {
                    var row = doc.createElement('div');
                    var a = doc.createElement('a');
                    a.className = 'newLink seipro-copy';
                    a.style.cursor = 'pointer';
                    a.style.maxWidth = 'calc(100% - 70px)';
                    a.textContent = r.text + (r.unassigned ? ' ' : '');
                    if (r.unassigned) {
                        var alert = doc.createElement('span');
                        alert.className = 'infoAlerta';
                        alert.textContent = '(não atribuído)';
                        a.appendChild(alert);
                    }
                    row.appendChild(a);
                    body.appendChild(row);
                });
            }

            // Marcador section (placeholder — filled by fetch below).
            var marcPanel = doc.createElement('div');
            marcPanel.className = 'panelDadosArvore';
            marcPanel.dataset.type = 'marcador';
            marcPanel.innerHTML =
                '<label class="newLink panelArvoreHead" style="margin-bottom:10px;display:block;">' +
                '  <i class="fas fa-bookmark azulColor iconDadosProcesso"></i> Marcador:' +
                '  <i class="fas fa-chevron-down azulColor seipro-toggle" style="float:right;cursor:pointer;margin-right:20px;"></i>' +
                '</label>' +
                '<div class="infoDadosArvore seipro-marcador-body"><span style="opacity:0.6">carregando…</span></div>';

            // Interessados section (placeholder — filled by fetch below).
            var intPanel = doc.createElement('div');
            intPanel.className = 'panelDadosArvore';
            intPanel.dataset.type = 'interessados';
            intPanel.innerHTML =
                '<label class="newLink panelArvoreHead" style="margin-bottom:10px;display:block;">' +
                '  <i class="fas fa-users azulColor iconDadosProcesso"></i> Interessados:' +
                '  <i class="fas fa-chevron-down azulColor seipro-toggle" style="float:right;cursor:pointer;margin-right:20px;"></i>' +
                '</label>' +
                '<div class="infoDadosArvore seipro-interessados-body"><span style="opacity:0.6">carregando…</span></div>';

            // Generic consulta-derived sections (filled by the same fetch that populates interessados).
            function mkSection(type, icon, title, bodyClass) {
                var el = doc.createElement('div');
                el.className = 'panelDadosArvore';
                el.dataset.type = type;
                el.innerHTML =
                    '<label class="newLink panelArvoreHead" style="margin-bottom:10px;display:block;">' +
                    '  <i class="fas ' + icon + ' azulColor iconDadosProcesso"></i> ' + title +
                    '  <i class="fas fa-chevron-down azulColor seipro-toggle" style="float:right;cursor:pointer;margin-right:20px;"></i>' +
                    '</label>' +
                    '<div class="infoDadosArvore ' + bodyClass + '"><span style="opacity:0.6">carregando…</span></div>';
                return el;
            }
            var anotPanel  = mkSection('anotacoes',         'fa-sticky-note', 'Anotação:',         'seipro-anot-body');
            var acompPanel = mkSection('acompanhamento_especial', 'fa-eye',   'Acompanhamento Especial:', 'seipro-acomp-body');
            var tipoPanel  = mkSection('tipo_procedimento', 'fa-inbox',       'Tipo de Processo:', 'seipro-tipo-body');
            var acessoPanel= mkSection('nivel_acesso',      'fa-lock',        'Nível de Acesso:',  'seipro-acesso-body');
            var assuntosPanel = mkSection('assuntos',       'fa-bookmark',    'Assuntos:',         'seipro-assuntos-body');
            var obsPanel    = mkSection('observacoes',      'fa-comment-alt', 'Observações desta unidade:', 'seipro-obs-body');

            // Mount only sections enabled by user pref. Order: Anotação → Atribuição → Marcador →
            // Acompanhamento → Tipo → Interessados → Nível Acesso → Assuntos → Observações.
            [anotPanel, panel, marcPanel, acompPanel, tipoPanel, intPanel, acessoPanel, assuntosPanel, obsPanel]
                .forEach(function (p) { if (sectionEnabled(p.dataset.type)) frmArvore.appendChild(p); });
            log('infoarvore: panel mounted (' + frmArvore.querySelectorAll('.panelDadosArvore').length + ' sections)');

            // Refresh registry: each section registers a render fn under a name; refreshAll re-runs all.
            // Use refreshSection('name') to refresh just one — important after a server-side save,
            // since SEI hash tokens for other endpoints may go stale and cause spurious fetch errors.
            var refreshers = {};
            function refreshAll(reason) {
                var names = Object.keys(refreshers);
                log('infoarvore: refreshing (' + (reason || 'manual') + ') — ' + names.length + ' section(s)');
                names.forEach(function (n) { try { refreshers[n](); } catch (e) { err('refresh ' + n + ':', e.message); } });
            }
            function refreshSection(name, reason) {
                if (!refreshers[name]) { report('refreshSection: no refresher named ' + name); return; }
                log('infoarvore: refreshing ' + name + ' (' + (reason || 'manual') + ')');
                try { refreshers[name](); } catch (e) { err('refresh ' + name + ':', e.message); }
            }
            // Add pencil icon (or trash) to a section header. Hands off to legacy `parent.editDadosArvorePro`.
            function addHeadBtn(panel, mode, icon, title, extraData) {
                var head = panel.querySelector('.panelArvoreHead');
                var a = doc.createElement('a');
                a.className = 'newLink seipro-edit';
                a.style.cssText = 'cursor:pointer;float:right;margin-right:8px;';
                a.dataset.mode = mode;
                a.title = title || 'Editar';
                a.innerHTML = '<i class="fas ' + icon + '"></i>';
                if (extraData) Object.keys(extraData).forEach(function (k) { a.dataset[k] = extraData[k]; });
                head.appendChild(a);
                return a;
            }

            // --- 3) Wire handlers (best-practice: addEventListener, namespaced data attrs).
            frmArvore.addEventListener('click', function (ev) {
                var t = ev.target;
                var toggle = t.closest && t.closest('.seipro-toggle');
                if (toggle) {
                    var pn = toggle.closest('.panelDadosArvore');
                    var bd = pn && pn.querySelector('.infoDadosArvore');
                    if (!bd) return;
                    var hidden = bd.style.display === 'none';
                    bd.style.display = hidden ? '' : 'none';
                    toggle.classList.toggle('fa-chevron-down', hidden);
                    toggle.classList.toggle('fa-chevron-right', !hidden);
                    return;
                }
                var editA = t.closest && t.closest('.seipro-edit');
                if (editA) {
                    ev.preventDefault(); ev.stopPropagation();
                    var mode = editA.dataset.mode;
                    log('edit click: mode=' + mode);
                    if (mode === 'responsaveis') {
                        editAtribuicaoInline(panel);
                        return;
                    }
                    if (mode === 'marcador') {
                        // SEI 4.1 supports multiple marcadores per process. Adding always works;
                        // removal is done via SEI's own toolbar (Gerenciar Marcador). When the
                        // process is empty the gerenciar URL itself loads the cadastrar form.
                        // When it already has marcadores, the gerenciar page shows a list and we
                        // need to follow #btnAdicionar's onclick to get a hash-valid cadastrar URL
                        // (just rewriting acao= keeps the gerenciar hash, which the server rejects).
                        var marcGerUrl = findToolbarLink('andamento_marcador_gerenciar');
                        if (!marcGerUrl) { err('inline marcador: toolbar link missing'); return; }
                        var fields = [
                            { kind: 'select',   label: 'Marcador',  srcSelector: '#selMarcador', name: 'selMarcador' },
                            { kind: 'textarea', label: 'Observação (opcional)', srcSelector: '#txaTexto', name: 'txaTexto' },
                        ];
                        invalidatePage(marcGerUrl);
                        fetchPage(marcGerUrl).then(function (docM) {
                            var addUrl = marcGerUrl;
                            if (!docM.querySelector('#selMarcador')) {
                                // Listing layout — extract real cadastrar URL from btnAdicionar.onclick
                                var btnAdd = docM.querySelector('#btnAdicionar');
                                var oc = btnAdd && btnAdd.getAttribute('onclick') || '';
                                var m = oc.match(/['"]([^'"]*controlador\.php[^'"]*acao=andamento_marcador_cadastrar[^'"]*)['"]/);
                                if (m) {
                                    // Resolve relative to the parent doc base (where the SEI controller lives).
                                    try { addUrl = new URL(m[1], p.location.href).href; } catch (e) { addUrl = m[1]; }
                                    log('marcador: using add URL from btnAdicionar');
                                } else {
                                    err('marcador: could not extract add URL from listing');
                                    return;
                                }
                            }
                            openInlineEditor(marcPanel, addUrl, fields, function () { refreshSection('marcador', 'post-add'); });
                        }).catch(function (e) { err('marcador prefetch:', e.message); });
                        return;
                    }
                    if (mode === 'tipo_procedimento') {
                        editTipoInline(tipoPanel);
                        return;
                    }
                    if (mode === 'acompanhamento_especial') {
                        editAcompInline(acompPanel);
                        return;
                    }
                    // Note: nivel_acesso falls through to the legacy dialog below — inline editing
                    // would need to handle dependent fields (selHipoteseLegal, selGrauSigilo) and
                    // the procedimento_alterar redirect that reloads the árvore.
                    if (typeof p.editDadosArvorePro !== 'function') { err('editDadosArvorePro missing on parent'); return; }
                    try { p.editDadosArvorePro(editA); } catch (e) { err('editDadosArvorePro threw:', e.message); return; }
                    // Map legacy edit modes → which section the change affects.
                    var modeToSection = {
                        // tipo_procedimento is handled inline above; legacy fallback for the rest
                        'acompanhamento_especial': 'acomp'
                    };
                    watchDialogClose(function () {
                        var sec = modeToSection[mode];
                        if (sec) refreshSection(sec, 'post-edit ' + mode);
                        else refreshAll('post-edit ' + mode); // fallback if mode unmapped
                    });
                    return;
                }
                var copyA = t.closest && t.closest('.seipro-copy');
                if (copyA) {
                    var text = copyA.textContent.trim();
                    if (navigator.clipboard) navigator.clipboard.writeText(text).catch(function (e) { err('clipboard:', e.message); });
                    else if (typeof p.copyTextThis === 'function') p.copyTextThis(copyA); // fallback to legacy parent helper
                }
            });

            // Attach pencil icons now that the click handler is wired.
            var atribText = (responsaveis[0] && responsaveis[0].text) || '';
            addHeadBtn(panel,       'responsaveis',           'fa-edit', 'Editar atribuição', { text: atribText });
            addHeadBtn(marcPanel,   'marcador',               'fa-edit', 'Editar marcador');
            addHeadBtn(acompPanel,  'acompanhamento_especial','fa-edit', 'Editar acompanhamento especial');
            addHeadBtn(tipoPanel,   'tipo_procedimento',      'fa-edit', 'Editar tipo de processo');
            // No pencil for nível de acesso — legacy dialog throws on this SEI variant; users edit
            // via the SEI native toolbar ("Consultar/Alterar Processo").

            // Watches for the legacy jQuery UI dialog to close, then fires cb once.
            // MutationObserver on body: zero-cost when idle, fires only on actual DOM changes.
            // The 400ms after-close delay is intentional — gives SEI time to persist before refresh.
            function watchDialogClose(cb) {
                var pdoc = null;
                try { pdoc = win.parent.document; } catch (e) { warn('watchDialogClose: parent doc inaccessible'); return setTimeout(cb, 3000); }
                var visibleDialog = function () { return pdoc.querySelector('.ui-dialog:not([style*="display: none"])'); };
                var seen = !!visibleDialog();
                var done = false;
                var fire = function () { if (done) return; done = true; mo.disconnect(); clearTimeout(failsafe); setTimeout(cb, 400); };
                var mo = new MutationObserver(function () {
                    if (visibleDialog()) seen = true;
                    else if (seen) fire();
                });
                mo.observe(pdoc.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class'] });
                // Failsafe: if no dialog ever appears (edit handler errored before opening one), don't hang refreshAll.
                var failsafe = setTimeout(function () { if (!done) { done = true; mo.disconnect(); report('watchDialogClose: no dialog detected within 15s — refresh after edit may be premature'); cb(); } }, 15000);
            }

            // Inline editor for "Atribuição": fetches procedimento_atribuicao_cadastrar, swaps
            // the panel body for a native <select> + Salvar/Cancelar, submits via submitForm.
            // Replaces the broken legacy chosen.js dialog (which expects elements but receives
            // {name,value} objects from getSelectAtribuicaoProcesso).
            function editAtribuicaoInline(panel) {
                var atribUrl = findToolbarLink('procedimento_atribuicao_cadastrar');
                if (!atribUrl) { report('inline atrib: toolbar link not found — edit Atribuição disabled', { sought: 'procedimento_atribuicao_cadastrar' }); return; }
                var body = panel.querySelector('.infoDadosArvore');
                var savedHTML = body.innerHTML;
                body.innerHTML = '<span style="opacity:0.6">carregando formulário…</span>';
                invalidatePage(atribUrl);
                fetchPage(atribUrl).then(function (docA) {
                    var srcSel = docA.querySelector('#selAtribuicao');
                    if (!srcSel) { err('inline atrib: #selAtribuicao not found'); body.innerHTML = savedHTML; return; }
                    // Build editor UI
                    var wrap = doc.createElement('div');
                    wrap.style.cssText = 'display:flex;flex-direction:column;gap:6px;';
                    var sel = doc.createElement('select');
                    sel.style.cssText = 'width:100%;padding:4px;';
                    Array.prototype.forEach.call(srcSel.options, function (o) {
                        var opt = doc.createElement('option');
                        opt.value = o.value;
                        opt.textContent = o.text;
                        if (o.selected) opt.selected = true;
                        sel.appendChild(opt);
                    });
                    var btnRow = doc.createElement('div');
                    btnRow.style.cssText = 'display:flex;gap:6px;justify-content:flex-end;';
                    var btnSave = doc.createElement('button');
                    btnSave.type = 'button'; btnSave.className = 'newLink'; btnSave.textContent = 'Salvar';
                    btnSave.style.cssText = 'cursor:pointer;padding:2px 10px;';
                    var btnCancel = doc.createElement('button');
                    btnCancel.type = 'button'; btnCancel.className = 'newLink'; btnCancel.textContent = 'Cancelar';
                    btnCancel.style.cssText = 'cursor:pointer;padding:2px 10px;';
                    btnRow.appendChild(btnCancel); btnRow.appendChild(btnSave);
                    wrap.appendChild(sel); wrap.appendChild(btnRow);
                    body.innerHTML = ''; body.appendChild(wrap);

                    btnCancel.addEventListener('click', function () { body.innerHTML = savedHTML; });
                    btnSave.addEventListener('click', function () {
                        btnSave.disabled = true; btnCancel.disabled = true;
                        btnSave.textContent = 'salvando…';
                        submitViaIframe(atribUrl, { selAtribuicao: sel.value }).then(function () {
                            log('inline atrib: saved, re-rendering responsáveis');
                            // Re-fetch the árvore page and re-parse Nos[0].html to update responsáveis in place
                            // — avoids reloading the iframe (which would reset the visualization pane).
                            invalidatePage(win.location.href);
                            return fetchPage(win.location.href).then(function (docR) {
                                var newResp = [];
                                var scrs = docR.querySelectorAll('script:not([src])');
                                for (var i = 0; i < scrs.length; i++) {
                                    var txt = scrs[i].textContent || '';
                                    if (txt.indexOf('Nos[0].html = ') === -1) continue;
                                    var m = txt.match(/Nos\[0\]\.html\s*=\s*'([^']+)'/);
                                    if (!m) continue;
                                    m[1].split('<br />').forEach(function (frag) {
                                        var tmp = doc.createElement('div'); tmp.innerHTML = frag;
                                        var text = tmp.textContent.trim();
                                        if (text) newResp.push({ text: text, unassigned: !/atribuído para/i.test(text) && !!tmp.querySelector('a.ancoraSigla') });
                                    });
                                    break;
                                }
                                // Re-render body
                                body.innerHTML = '';
                                if (!newResp.length) {
                                    body.innerHTML = '<span class="infoAlerta">(sem responsáveis)</span>';
                                } else {
                                    newResp.forEach(function (r) {
                                        var row = doc.createElement('div');
                                        var a = doc.createElement('a');
                                        a.className = 'newLink seipro-copy';
                                        a.style.cursor = 'pointer';
                                        a.style.maxWidth = 'calc(100% - 70px)';
                                        a.textContent = r.text + (r.unassigned ? ' ' : '');
                                        if (r.unassigned) {
                                            var alert = doc.createElement('span');
                                            alert.className = 'infoAlerta';
                                            alert.textContent = '(não atribuído)';
                                            a.appendChild(alert);
                                        }
                                        row.appendChild(a);
                                        body.appendChild(row);
                                    });
                                }
                                // Update pencil's data-text so the legacy edit dialog (if ever invoked) sees current user
                                var pencilA = panel.querySelector('.seipro-edit[data-mode="responsaveis"]');
                                if (pencilA) pencilA.dataset.text = (newResp[0] && newResp[0].text) || '';
                                // No refreshAll: the responsáveis list was just re-rendered in place from the
                                // árvore page re-fetch above. Other sections aren't affected by this edit, and
                                // refetching them would trigger stale-hash errors after the SEI save.
                            });
                        }).catch(function (e) {
                            err('inline atrib submit:', e.message);
                            body.innerHTML = savedHTML;
                            report('inline atrib: submit failed — reverted to previous value');
                        });
                    });
                }).catch(function (e) {
                    err('inline atrib fetch:', e.message);
                    body.innerHTML = savedHTML;
                });
            }

            // Submit a SEI form via a hidden iframe — emulates how the legacy code worked.
            // Some SEI endpoints reject programmatic fetch+POST even with correct payload/headers;
            // submitting via an iframe makes the browser handle it like a real form submission,
            // which the server accepts.
            // Two call shapes:
            //   submitViaIframe(url, values) — sets fields by id (mirrors sel* → hdnId*) and clicks submit.
            //   submitViaIframe(url, prepareFn) — prepareFn(win, doc) is invoked after the form loads;
            //     it must trigger submission itself (e.g. by calling a SEI helper like acaoRemover).
            // Resolves after the second iframe load (post-save).
            function submitViaIframe(url, valuesOrFn) {
                return new Promise(function (resolve, reject) {
                    // Use the parent document so we can host the iframe outside the árvore frame
                    // (the árvore reloads on save, which would kill the iframe).
                    var hostDoc = p.document;
                    var ifr = hostDoc.createElement('iframe');
                    ifr.style.cssText = 'display:none;position:absolute;width:0;height:0;border:0;';
                    ifr.id = 'seipro-submit-frame-' + Date.now();
                    // Sandbox prevents the SEI response from running top.location.reload()/redirects
                    // that would clobber the visualization pane. We still need same-origin (DOM access),
                    // forms (submit the form), and scripts (form has onsubmit="return OnSubmitForm()").
                    ifr.setAttribute('sandbox', 'allow-same-origin allow-forms allow-scripts');
                    var loads = 0;
                    var timeout = setTimeout(function () {
                        try { ifr.remove(); } catch (e) {}
                        reject(new Error('submitViaIframe: timeout'));
                    }, 15000);
                    ifr.addEventListener('load', function () {
                        loads++;
                        if (loads === 1) {
                            try {
                                var ifrDoc = ifr.contentDocument;
                                var ifrWin2 = ifr.contentWindow;
                                if (typeof valuesOrFn === 'function') {
                                    // Caller-provided preparation. Auto-confirm any confirm() prompts
                                    // so SEI's "Confirma remoção?" dialogs don't block us.
                                    try { ifrWin2.confirm = function () { return true; }; } catch (_) {}
                                    valuesOrFn(ifrWin2, ifrDoc);
                                } else {
                                    var values = valuesOrFn;
                                    Object.keys(values).forEach(function (id) {
                                        // Best-effort hidden mirror: in some SEI forms the visible <select>
                                        // is replaced by a custom dropdown widget and the real value flows
                                        // through a sibling hidden #hdnId<Name> (legacy "sel*" → "hdnId*"
                                        // pattern). Other forms submit the <select> directly and have no
                                        // such hidden — that's fine, just skip silently.
                                        if (id.indexOf('sel') === 0) {
                                            var hdnId = 'hdnId' + id.replace('sel', '');
                                            var hdn = ifrDoc.getElementById(hdnId);
                                            if (hdn) { hdn.value = values[id]; log('submitViaIframe: set #' + hdnId + ' = ' + values[id]); }
                                        }
                                        var el = ifrDoc.getElementById(id);
                                        if (!el) { return; }
                                        if (el.tagName === 'SELECT') { el.value = values[id]; }
                                        else if (el.type === 'checkbox' || el.type === 'radio') { el.checked = !!values[id]; }
                                        else { el.value = values[id]; }
                                    });
                                    // Some SEI forms (e.g. procedimento_alterar) have no type=submit;
                                    // they rely on a named "Salvar" button with onclick handlers.
                                    var submitBtn = ifrDoc.querySelector('button[type=submit], input[type=submit]')
                                        || ifrDoc.querySelector('#sbmSalvar')
                                        || ifrDoc.querySelector('button[name=btnSalvar], input[name=btnSalvar]')
                                        || ifrDoc.querySelector('button[name=sbmSalvar], input[name=sbmSalvar]');
                                    if (!submitBtn) throw new Error('no submit button in form');
                                    submitBtn.click();
                                }
                            } catch (e) {
                                clearTimeout(timeout); try { ifr.remove(); } catch (_) {}
                                reject(e);
                            }
                        } else {
                            clearTimeout(timeout);
                            try { ifr.remove(); } catch (e) {}
                            resolve();
                        }
                    });
                    ifr.src = url;
                    hostDoc.body.appendChild(ifr);
                });
            }

            // Generic inline editor: fetches a form URL, swaps panel body for native inputs,
            // submits via a hidden iframe (legacy-compatible), then calls onSaved (which re-renders).
            // `fields`: array of { kind: 'select'|'textarea', label, srcSelector, name }
            // The `name` is used both as form field id and as override key.
            function openInlineEditor(panel, formUrl, fields, onSaved) {
                var body = panel.querySelector('.infoDadosArvore');
                var savedHTML = body.innerHTML;
                body.innerHTML = '<span style="opacity:0.6">carregando formulário…</span>';
                invalidatePage(formUrl);
                fetchPage(formUrl).then(function (docA) {
                    var wrap = doc.createElement('div');
                    wrap.style.cssText = 'display:flex;flex-direction:column;gap:6px;';
                    var inputs = {};
                    fields.forEach(function (f) {
                        var src = docA.querySelector(f.srcSelector);
                        if (!src) { report('inline editor: missing source field in fetched form', { selector: f.srcSelector, formUrl: formUrl }); return; }
                        var label = doc.createElement('label');
                        label.textContent = f.label; label.style.cssText = 'font-size:11px;opacity:0.7;';
                        wrap.appendChild(label);
                        var el;
                        if (f.kind === 'select') {
                            el = doc.createElement('select');
                            el.style.cssText = 'width:100%;padding:4px;';
                            Array.prototype.forEach.call(src.options, function (o) {
                                var opt = doc.createElement('option');
                                opt.value = o.value; opt.textContent = o.text;
                                if (o.selected) opt.selected = true;
                                el.appendChild(opt);
                            });
                        } else { // textarea
                            el = doc.createElement('textarea');
                            el.style.cssText = 'width:100%;padding:4px;min-height:50px;';
                            el.value = src.value || src.textContent || '';
                        }
                        wrap.appendChild(el);
                        inputs[f.name] = el;
                    });
                    var btnRow = doc.createElement('div');
                    btnRow.style.cssText = 'display:flex;gap:6px;justify-content:flex-end;margin-top:4px;';
                    var btnCancel = doc.createElement('button');
                    btnCancel.type = 'button'; btnCancel.className = 'newLink'; btnCancel.textContent = 'Cancelar';
                    btnCancel.style.cssText = 'cursor:pointer;padding:2px 10px;';
                    var btnSave = doc.createElement('button');
                    btnSave.type = 'button'; btnSave.className = 'newLink'; btnSave.textContent = 'Salvar';
                    btnSave.style.cssText = 'cursor:pointer;padding:2px 10px;';
                    btnRow.appendChild(btnCancel); btnRow.appendChild(btnSave);
                    wrap.appendChild(btnRow);
                    body.innerHTML = ''; body.appendChild(wrap);

                    btnCancel.addEventListener('click', function () { body.innerHTML = savedHTML; });
                    btnSave.addEventListener('click', function () {
                        btnSave.disabled = true; btnCancel.disabled = true;
                        btnSave.textContent = 'salvando…';
                        var values = {};
                        Object.keys(inputs).forEach(function (k) { values[k] = inputs[k].value; });
                        submitViaIframe(formUrl, values).then(function () {
                            log('inline editor saved:', Object.keys(values).join(','));
                            // Brief delay before re-fetch — gives the SEI session time to settle after
                            // the iframe submit so the next fetch isn't a "Failed to fetch" race.
                            setTimeout(function () { try { onSaved && onSaved(); } catch (e) { err('onSaved:', e.message); } }, 400);
                        }).catch(function (e) {
                            err('inline submit:', e.message);
                            body.innerHTML = savedHTML;
                            report('inline editor: submit failed — reverted to previous value');
                        });
                    });
                }).catch(function (e) {
                    err('inline fetch:', e.message);
                    body.innerHTML = savedHTML;
                });
            }

            // (Marcador list/remove editor removed — caused session logoff with multi-fetch loops.
            // Add-only flow lives inline in the click handler.)
            // eslint-disable-next-line
            function editMarcadorInline_unused(panel) {
                var marcUrl = findToolbarLink('andamento_marcador_gerenciar');
                if (!marcUrl) { err('inline marcador: toolbar link missing'); return; }
                var body = panel.querySelector('.infoDadosArvore');
                var savedHTML = body.innerHTML;
                body.innerHTML = '<span style="opacity:0.6">carregando…</span>';
                invalidatePage(marcUrl);
                fetchPage(marcUrl).then(function (docM) {
                    // If the cadastrar form is present (no marcadores yet), use the generic editor.
                    if (docM.querySelector('#selMarcador')) {
                        body.innerHTML = savedHTML; // restore so openInlineEditor swaps it out itself
                        openInlineEditor(panel, marcUrl, [
                            { kind: 'select',   label: 'Marcador',  srcSelector: '#selMarcador', name: 'selMarcador' },
                            { kind: 'textarea', label: 'Observação (opcional)', srcSelector: '#txaTexto', name: 'txaTexto' },
                        ], function () {
                            refreshSection('marcador', 'post-add marcador');
                            if (typeof p.setCapaProcesso === 'function') p.setCapaProcesso(false);
                        });
                        return;
                    }
                    // Listing layout — parse rows and render a remove/add UI.
                    var items = [];
                    var rows = docM.querySelectorAll('table.infraTable tr');
                    for (var r = 1; r < rows.length; r++) {
                        var tds = rows[r].querySelectorAll('td');
                        if (tds.length < 4) continue;
                        // Find the remove link to extract the marcador id from acaoRemover('id', '...').
                        var removeA = rows[r].querySelector('a[onclick*="acaoRemover"]');
                        var idMatch = removeA && removeA.getAttribute('onclick').match(/acaoRemover\('([^']+)'/);
                        var tagA = tds[1].querySelector('a[title]');
                        items.push({
                            id:  idMatch ? idMatch[1] : null,
                            tag: (tagA && tagA.getAttribute('title')) || tds[1].textContent.trim(),
                            note: (tds[2].textContent || '').trim(),
                            user: (tds[3].textContent || '').trim()
                        });
                    }
                    // Build UI
                    var wrap = doc.createElement('div');
                    wrap.style.cssText = 'display:flex;flex-direction:column;gap:4px;';
                    items.forEach(function (it) {
                        var row = doc.createElement('div');
                        row.style.cssText = 'display:flex;align-items:center;gap:6px;';
                        var lbl = doc.createElement('span');
                        lbl.style.cssText = 'flex:1;';
                        lbl.innerHTML = '<strong>' + (it.tag || '?') + '</strong>' +
                            (it.note ? ' — <span style="opacity:0.8">' + it.note.replace(/</g,'&lt;') + '</span>' : '');
                        var btn = doc.createElement('a');
                        btn.className = 'newLink';
                        btn.title = 'Remover marcador';
                        btn.style.cssText = 'cursor:pointer;color:#c00;';
                        btn.innerHTML = '<i class="fas fa-times"></i>';
                        btn.addEventListener('click', function () {
                            if (!it.id) { err('marcador remove: no id'); return; }
                            btn.style.opacity = '0.4'; btn.style.pointerEvents = 'none';
                            log('marcador remove: id=' + it.id);
                            submitViaIframe(marcUrl, function (w, d2) {
                                if (typeof w.acaoRemover === 'function') {
                                    w.acaoRemover(it.id, it.tag || '');
                                } else {
                                    // Fallback: set #hdnInfraItemId and submit the form manually.
                                    var hdn = d2.getElementById('hdnInfraItemId'); if (hdn) hdn.value = it.id;
                                    var f = d2.getElementById('frmGerenciarMarcador') || d2.querySelector('form');
                                    if (f) f.submit();
                                }
                            }).then(function () {
                                refreshSection('marcador', 'post-remove marcador');
                                if (typeof p.setCapaProcesso === 'function') p.setCapaProcesso(false);
                                editMarcadorInline(panel);
                            })
                              .catch(function (e) { err('marcador remove:', e.message); body.innerHTML = savedHTML; });
                        });
                        row.appendChild(lbl); row.appendChild(btn);
                        wrap.appendChild(row);
                    });
                    var sep = doc.createElement('div'); sep.style.cssText = 'border-top:1px solid #ddd;margin:4px 0;'; wrap.appendChild(sep);
                    var btnRow = doc.createElement('div');
                    btnRow.style.cssText = 'display:flex;gap:6px;justify-content:space-between;';
                    var btnAdd = doc.createElement('button');
                    btnAdd.type = 'button'; btnAdd.className = 'newLink'; btnAdd.textContent = '+ Adicionar marcador';
                    btnAdd.style.cssText = 'cursor:pointer;padding:2px 10px;';
                    var btnClose = doc.createElement('button');
                    btnClose.type = 'button'; btnClose.className = 'newLink'; btnClose.textContent = 'Fechar';
                    btnClose.style.cssText = 'cursor:pointer;padding:2px 10px;';
                    btnRow.appendChild(btnAdd); btnRow.appendChild(btnClose);
                    wrap.appendChild(btnRow);
                    body.innerHTML = ''; body.appendChild(wrap);

                    btnClose.addEventListener('click', function () { body.innerHTML = savedHTML; });
                    btnAdd.addEventListener('click', function () {
                        // Use the cadastrar URL derived from the gerenciar URL.
                        var addUrl = marcUrl.replace('acao=andamento_marcador_gerenciar', 'acao=andamento_marcador_cadastrar');
                        invalidatePage(addUrl);
                        fetchPage(addUrl).then(function () {
                            body.innerHTML = savedHTML;
                            openInlineEditor(panel, addUrl, [
                                { kind: 'select',   label: 'Marcador',  srcSelector: '#selMarcador', name: 'selMarcador' },
                                { kind: 'textarea', label: 'Observação (opcional)', srcSelector: '#txaTexto', name: 'txaTexto' },
                            ], function () {
                                refreshSection('marcador', 'post-add marcador');
                                if (typeof p.setCapaProcesso === 'function') p.setCapaProcesso(false);
                                editMarcadorInline(panel);
                            });
                        }).catch(function (e) { err('marcador add fetch:', e.message); });
                    });
                }).catch(function (e) {
                    err('marcador editor:', e.message);
                    body.innerHTML = savedHTML;
                });
            }

            // Tipo de Processo — uses the big procedimento_alterar form. Just override
            // selTipoProcedimento (and its mirror hdnIdTipoProcedimento). Other fields keep
            // whatever the form was prefilled with.
            function editTipoInline(panel) {
                var url = findToolbarLink('procedimento_alterar');
                if (!url) { report('inline tipo: toolbar link missing — edit Tipo de Processo disabled', { sought: 'procedimento_alterar' }); return; }
                openInlineEditor(panel, url, [
                    { kind: 'select', label: 'Tipo de Processo', srcSelector: '#selTipoProcedimento', name: 'selTipoProcedimento' },
                ], function () { refreshSection('consulta', 'post-edit tipo'); });
            }

            // Acompanhamento Especial — same shape as Marcador. acompanhamento_gerenciar serves
            // the cadastrar form when empty; with existing entries it shows a list, and we extract
            // the real cadastrar URL from #btnAdicionar's onclick.
            function editAcompInline(panel) {
                var gerUrl = findToolbarLink('acompanhamento_gerenciar');
                if (!gerUrl) { report('inline acomp: toolbar link missing — edit Acompanhamento Especial disabled', { sought: 'acompanhamento_gerenciar' }); return; }
                var fields = [
                    { kind: 'select',   label: 'Grupo',     srcSelector: '#selGrupoAcompanhamento', name: 'selGrupoAcompanhamento' },
                    { kind: 'textarea', label: 'Observação', srcSelector: '#txaObservacao', name: 'txaObservacao' },
                ];
                invalidatePage(gerUrl);
                fetchPage(gerUrl).then(function (docA) {
                    var addUrl = gerUrl;
                    if (!docA.querySelector('#selGrupoAcompanhamento')) {
                        var btnAdd = docA.querySelector('#btnAdicionar');
                        var oc = btnAdd && btnAdd.getAttribute('onclick') || '';
                        var m = oc.match(/['"]([^'"]*controlador\.php[^'"]*acao=acompanhamento_cadastrar[^'"]*)['"]/);
                        if (m) {
                            try { addUrl = new URL(m[1], p.location.href).href; } catch (e) { addUrl = m[1]; }
                            log('acomp: using add URL from btnAdicionar');
                        } else {
                            err('acomp: could not extract add URL from listing');
                            return;
                        }
                    }
                    openInlineEditor(panel, addUrl, fields, function () { refreshSection('acomp', 'post-add'); });
                }).catch(function (e) { err('acomp prefetch:', e.message); });
            }

            // (Nível de Acesso inline editor removed — falls back to legacy dialog. Implementing
            // it inline would require handling dependent fields and a server-side redirect that
            // reloads the árvore frame.)
            // eslint-disable-next-line
            function editNivelInline_unused(panel) {
                var url = findToolbarLink('procedimento_alterar');
                if (!url) { err('inline nivel: toolbar link missing'); return; }
                var body = panel.querySelector('.infoDadosArvore');
                var savedHTML = body.innerHTML;
                body.innerHTML = '<span style="opacity:0.6">carregando…</span>';
                invalidatePage(url);
                fetchPage(url).then(function (docF) {
                    // Determine current value from the radios.
                    var current = '1';
                    ['optPublico', 'optRestrito', 'optSigiloso'].forEach(function (id) {
                        var r = docF.getElementById(id);
                        if (r && r.checked) current = r.value;
                    });
                    var wrap = doc.createElement('div');
                    wrap.style.cssText = 'display:flex;flex-direction:column;gap:6px;';
                    var sel = doc.createElement('select');
                    sel.style.cssText = 'width:100%;padding:4px;';
                    [['0','Público'],['1','Restrito']].forEach(function (it) {
                        var opt = doc.createElement('option');
                        opt.value = it[0]; opt.textContent = it[1];
                        if (it[0] === current) opt.selected = true;
                        sel.appendChild(opt);
                    });
                    var btnRow = doc.createElement('div');
                    btnRow.style.cssText = 'display:flex;gap:6px;justify-content:flex-end;margin-top:4px;';
                    var btnCancel = doc.createElement('button');
                    btnCancel.type = 'button'; btnCancel.className = 'newLink'; btnCancel.textContent = 'Cancelar';
                    btnCancel.style.cssText = 'cursor:pointer;padding:2px 10px;';
                    var btnSave = doc.createElement('button');
                    btnSave.type = 'button'; btnSave.className = 'newLink'; btnSave.textContent = 'Salvar';
                    btnSave.style.cssText = 'cursor:pointer;padding:2px 10px;';
                    btnRow.appendChild(btnCancel); btnRow.appendChild(btnSave);
                    wrap.appendChild(sel); wrap.appendChild(btnRow);
                    body.innerHTML = ''; body.appendChild(wrap);

                    btnCancel.addEventListener('click', function () { body.innerHTML = savedHTML; });
                    btnSave.addEventListener('click', function () {
                        btnSave.disabled = true; btnCancel.disabled = true;
                        btnSave.textContent = 'salvando…';
                        var newVal = sel.value;
                        submitViaIframe(url, function (w, d2) {
                            // Pick the right radio + dispatch change so the form's own JS shows/hides
                            // dependent fields (selHipoteseLegal etc.) correctly.
                            var idMap = { '0': 'optPublico', '1': 'optRestrito', '2': 'optSigiloso' };
                            var radio = d2.getElementById(idMap[newVal]);
                            if (radio) {
                                radio.checked = true;
                                try { radio.dispatchEvent(new w.Event('change', { bubbles: true })); } catch (_) {}
                            } else { warn('nivel: radio not found for value ' + newVal); }
                            // Submit
                            var btn = d2.querySelector('button[type=submit], input[type=submit]')
                                || d2.querySelector('#sbmSalvar')
                                || d2.querySelector('button[name=btnSalvar], input[name=btnSalvar]')
                                || d2.querySelector('button[name=sbmSalvar], input[name=sbmSalvar]');
                            if (btn) btn.click(); else err('nivel: submit button not found');
                        }).then(function () {
                            log('inline nivel: saved');
                            refreshSection('consulta', 'post-edit nivel');
                        }).catch(function (e) {
                            err('inline nivel submit:', e.message);
                            body.innerHTML = savedHTML;
                        });
                    });
                }).catch(function (e) {
                    err('inline nivel fetch:', e.message);
                    body.innerHTML = savedHTML;
                });
            }

            // --- 4) Marcador fetch (stage 3a) — shared fetcher, populates the placeholder.
            var marcadorUrl = findToolbarLink('andamento_marcador_gerenciar');
            if (!marcadorUrl) { warn('infoarvore_marcador: toolbar link not found — section will stay as "carregando"'); marcPanel.querySelector('.seipro-marcador-body').innerHTML = '<span style="opacity:0.6">(sem marcador)</span>'; return; }
            function renderMarcador() {
              invalidatePage(marcadorUrl);
              marcPanel.querySelector('.seipro-marcador-body').innerHTML = '<span style="opacity:0.6">carregando…</span>';
              fetchPage(marcadorUrl).then(function (docM) {
                var items = [];
                // SEI 4.1+: table-of-marcadores layout (one row per marcador).
                var rows = docM.querySelectorAll('table.infraTable tr');
                for (var r = 1; r < rows.length; r++) { // skip header
                    var tds = rows[r].querySelectorAll('td');
                    if (tds.length < 4) continue;
                    var img = tds[1].querySelector('img');
                    items.push({
                        iconSrc: img ? img.getAttribute('src') : null,
                        tag:  (tds[1].textContent || '').trim(),
                        note: (tds[2].textContent || '').trim(),
                        user: (tds[3].textContent || '').trim()
                    });
                }
                // Legacy fallback: single-marcador form layout.
                if (!items.length) {
                    var sel = docM.getElementById('selMarcador');
                    var ta  = docM.getElementById('txaTexto');
                    var opt = sel && (sel.querySelector('option[selected]') || (sel.options && sel.options[sel.selectedIndex]));
                    var tag = opt ? opt.textContent.trim() : '';
                    var note = ta ? ta.value || ta.textContent || '' : '';
                    if (tag || note) items.push({ iconSrc: opt && (opt.getAttribute('data-imagesrc') || opt.dataset.imagesrc), tag: tag, note: note, user: '' });
                }
                var bd = marcPanel.querySelector('.seipro-marcador-body');
                bd.innerHTML = '';
                if (!items.length) { bd.innerHTML = '<span style="opacity:0.6">(sem marcador)</span>'; log('infoarvore_marcador: empty'); return; }
                for (var k = 0; k < items.length; k++) {
                    var it = items[k];
                    var row = doc.createElement('div'); row.style.marginBottom = '4px';
                    if (it.iconSrc) { var im = doc.createElement('img'); im.src = it.iconSrc; im.style.width = '14px'; im.style.verticalAlign = 'middle'; im.style.marginRight = '6px'; row.appendChild(im); }
                    var s = doc.createElement('strong'); s.textContent = it.tag; row.appendChild(s);
                    if (it.note) { var n = doc.createElement('div'); n.style.opacity = '0.8'; n.style.marginLeft = '20px'; n.textContent = it.note; row.appendChild(n); }
                    bd.appendChild(row);
                }
                log('infoarvore_marcador: populated', items.length, 'marcador(es)');
              }).catch(function (e) {
                marcPanel.querySelector('.seipro-marcador-body').innerHTML = '<span class="infoAlerta">(falha ao carregar marcador)</span>';
                report('infoarvore_marcador: fetch failed', { error: e.message, url: marcadorUrl });
              });
            }
            refreshers.marcador = renderMarcador;
            if (sectionEnabled('marcador')) renderMarcador();
            else log('infoarvore_marcador: skipped (section disabled by user)');

            // --- 5) Interessados fetch (stage 3b) — consulta page, read #selInteressados options.
            var intBody = intPanel.querySelector('.seipro-interessados-body');
            // Prefer "procedimento_alterar" — form layout includes #txaObservacoes. Fall back to consultar (read-only).
            var consultaUrl = findToolbarLink('procedimento_alterar') || findToolbarLink('procedimento_consultar');
            if (!consultaUrl) { warn('infoarvore_interessados: consulta link not found'); intBody.innerHTML = '<span style="opacity:0.6">(indisponível)</span>'; return; }
            function renderConsulta() {
              invalidatePage(consultaUrl);
              fetchPage(consultaUrl).then(function (docC) {
                // --- Tipo de Processo
                var tipoBody = tipoPanel.querySelector('.seipro-tipo-body');
                var selTipo = docC.getElementById('selTipoProcedimento');
                var tipoOpt = selTipo && (selTipo.querySelector('option[selected]') || (selTipo.options && selTipo.options[selTipo.selectedIndex]));
                var tipoName = tipoOpt ? tipoOpt.textContent.trim() : '';
                tipoBody.innerHTML = '';
                if (tipoName) {
                    var aT = doc.createElement('a'); aT.className = 'newLink seipro-copy'; aT.style.cursor = 'pointer'; aT.style.maxWidth = 'calc(100% - 70px)'; aT.textContent = tipoName;
                    tipoBody.appendChild(aT);
                } else {
                    tipoBody.innerHTML = '<span style="opacity:0.6">(indisponível)</span>';
                    report('infoarvore_consulta: Tipo de Processo unavailable in fetched form', { hasSelTipo: !!selTipo });
                }

                // --- Nível de Acesso
                var acessoBody = acessoPanel.querySelector('.seipro-acesso-body');
                var rdo = docC.querySelector('input[name="rdoNivelAcesso"]:checked');
                var acessoMap = { '0': 'Público', '1': 'Restrito', '2': 'Sigiloso' };
                var acessoTxt = rdo ? acessoMap[rdo.value] || rdo.value : '';
                if (rdo && rdo.value === '1') {
                    var hipSel = docC.getElementById('selHipoteseLegal');
                    var hipOpt = hipSel && (hipSel.querySelector('option[selected]') || (hipSel.options && hipSel.options[hipSel.selectedIndex]));
                    if (hipOpt && hipOpt.textContent.trim()) acessoTxt += ': ' + hipOpt.textContent.trim();
                }
                acessoBody.innerHTML = '';
                if (acessoTxt) {
                    var aA = doc.createElement('a'); aA.className = 'newLink seipro-copy'; aA.style.cursor = 'pointer'; aA.style.maxWidth = 'calc(100% - 70px)'; aA.textContent = acessoTxt;
                    acessoBody.appendChild(aA);
                } else {
                    acessoBody.innerHTML = '<span style="opacity:0.6">(indisponível)</span>';
                    report('infoarvore_consulta: Nível de Acesso unavailable', { hasRdo: !!rdo });
                }

                // --- Assuntos
                var assBody = assuntosPanel.querySelector('.seipro-assuntos-body');
                var assOpts = docC.querySelectorAll('#selAssuntos option');
                assBody.innerHTML = '';
                if (!assOpts.length) { assBody.innerHTML = '<span style="opacity:0.6">(sem assuntos)</span>'; }
                else {
                    assOpts.forEach(function (o) {
                        var txt = (o.textContent || '').trim(); if (!txt) return;
                        var row = doc.createElement('div');
                        var a = doc.createElement('a'); a.className = 'newLink seipro-copy'; a.style.cursor = 'pointer'; a.style.maxWidth = 'calc(100% - 70px)'; a.textContent = txt;
                        row.appendChild(a); assBody.appendChild(row);
                    });
                }

                // --- Observações
                var obsBody = obsPanel.querySelector('.seipro-obs-body');
                var obsTA = docC.getElementById('txaObservacoes');
                var obsVal = obsTA ? (obsTA.value || obsTA.textContent || '').trim() : '';
                obsBody.innerHTML = '';
                if (obsVal) {
                    var aO = doc.createElement('a'); aO.className = 'newLink seipro-copy'; aO.style.cursor = 'pointer'; aO.style.maxWidth = 'calc(100% - 70px)'; aO.style.whiteSpace = 'pre-wrap'; aO.textContent = obsVal;
                    obsBody.appendChild(aO);
                } else { obsBody.innerHTML = '<span style="opacity:0.6">(sem observações)</span>'; }

                log('infoarvore_consulta: tipo="' + tipoName + '" acesso="' + acessoTxt + '" assuntos=' + assOpts.length + ' obs.len=' + obsVal.length);

                // --- Interessados (existing)
                // SEI 4.1 renamed #selInteressados → #selInteressadosProcedimento. Try new first, fall back to legacy.
                var opts = docC.querySelectorAll('#selInteressadosProcedimento option, #selInteressados option');
                intBody.innerHTML = '';
                if (!opts.length) { intBody.innerHTML = '<span style="opacity:0.6">(sem interessados)</span>'; log('infoarvore_interessados: empty'); return; }
                for (var i = 0; i < opts.length; i++) {
                    var name = (opts[i].textContent || '').trim();
                    if (!name) continue;
                    var parts = name.indexOf('(') !== -1
                        ? name.split('(').map(function (s) { return s.trim().replace(')', ''); })
                        : [name];
                    var row = doc.createElement('div');
                    parts.forEach(function (part) {
                        if (!part) return;
                        var a = doc.createElement('a');
                        a.className = 'newLink seipro-copy';
                        a.style.cursor = 'pointer';
                        a.style.display = 'block';
                        a.style.maxWidth = 'calc(100% - 70px)';
                        a.textContent = part;
                        row.appendChild(a);
                    });
                    intBody.appendChild(row);
                }
                log('infoarvore_interessados: populated', opts.length, 'interessado(s)');
              }).catch(function (e) {
                var msg = '<span class="infoAlerta">(falha ao carregar)</span>';
                intBody.innerHTML = msg;
                tipoPanel.querySelector('.seipro-tipo-body').innerHTML = msg;
                acessoPanel.querySelector('.seipro-acesso-body').innerHTML = msg;
                assuntosPanel.querySelector('.seipro-assuntos-body').innerHTML = msg;
                obsPanel.querySelector('.seipro-obs-body').innerHTML = msg;
                report('infoarvore_consulta: fetch failed — 5 sections (Tipo/Acesso/Assuntos/Obs/Interessados) shown as "(falha ao carregar)"', { error: e.message, url: consultaUrl });
              });
            }
            refreshers.consulta = renderConsulta;
            // Consulta fetch feeds 5 sections; skip only if all 5 are disabled.
            var consultaSections = ['interessados', 'tipo_procedimento', 'nivel_acesso', 'assuntos', 'observacoes'];
            if (consultaSections.some(sectionEnabled)) renderConsulta();
            else log('infoarvore_consulta: skipped (all 5 dependent sections disabled by user)');

            // --- 5b) Acompanhamento Especial — fetch form page; if fields are prefilled, process is registered.
            (function () {
                var body = acompPanel.querySelector('.seipro-acomp-body');
                var acompUrl = findToolbarLink('acompanhamento_gerenciar')
                            || findToolbarLink('acompanhamento_listar')
                            || findToolbarLink('acompanhamento_cadastrar')
                            || findToolbarLink('acompanhamento_alterar');
                if (!acompUrl) {
                    body.innerHTML = '<span style="opacity:0.6">(indisponível)</span>';
                    var names = getToolbarLinks().map(function (l) { return (l.url.match(/acao=([^&]+)/) || [])[1]; }).filter(Boolean);
                    warn('infoarvore_acomp: no acompanhamento_* toolbar link. Toolbar actions:', names.join(', '));
                    return;
                }
                function renderAcomp() {
                  invalidatePage(acompUrl);
                  body.innerHTML = '<span style="opacity:0.6">carregando…</span>';
                  log('infoarvore_acomp: fetching', acompUrl.match(/acao=([^&]+)/)[1]);
                  fetchPage(acompUrl).then(function (docA) {
                    // Listing page: table row per acompanhamento
                    var rows = docA.querySelectorAll('table.infraTable tr');
                    var items = [];
                    for (var r = 1; r < rows.length; r++) {
                        var tds = rows[r].querySelectorAll('td');
                        if (tds.length < 3) continue;
                        // Columns: checkbox, Grupo, Observação, Usuário, Data, Ações
                        items.push({
                            grupo: (tds[1].textContent || '').trim(),
                            obs:   (tds[2].textContent || '').trim(),
                            user:  tds[3] ? (tds[3].textContent || '').trim() : '',
                            date:  tds[4] ? (tds[4].textContent || '').trim() : ''
                        });
                    }
                    body.innerHTML = '';
                    if (!items.length) {
                        body.innerHTML = '<span style="opacity:0.6">(não está em acompanhamento especial)</span>';
                        log('infoarvore_acomp: empty listing');
                        return;
                    }
                    items.forEach(function (it) {
                        var row = doc.createElement('div'); row.style.marginBottom = '4px';
                        var txt = it.obs + (it.grupo ? (it.obs ? ' ' : '') + '(' + it.grupo + ')' : '');
                        var a = doc.createElement('a');
                        a.className = 'newLink seipro-copy';
                        a.style.cursor = 'pointer'; a.style.maxWidth = 'calc(100% - 70px)'; a.style.whiteSpace = 'pre-wrap';
                        a.textContent = txt || '(em acompanhamento)';
                        row.appendChild(a);
                        body.appendChild(row);
                    });
                    log('infoarvore_acomp: populated', items.length, 'registro(s)');
                  }).catch(function (e) {
                    body.innerHTML = '<span class="infoAlerta">(falha ao carregar)</span>';
                    report('infoarvore_acomp: fetch failed', { error: e.message, url: acompUrl });
                  });
                }
                refreshers.acomp = renderAcomp;
                if (sectionEnabled('acompanhamento_especial')) renderAcomp();
                else log('infoarvore_acomp: skipped (section disabled by user)');
            })();

            // --- 6) Anotação (sticknote) — full edit flow: edit/save/cancel/remove/priority/date/checklist.
            var anotBody = anotPanel.querySelector('.seipro-anot-body');
            var anotUrl = findToolbarLink('anotacao_registrar') || findToolbarLink('acao=anotacao_');
            if (!anotUrl) { warn('infoarvore_anotacoes: toolbar link not found'); anotBody.innerHTML = '<span style="opacity:0.6">(indisponível)</span>'; }
            else {
                refreshers.anotacoes = function () { invalidatePage(anotUrl); renderAnotacao(anotUrl); };
                if (sectionEnabled('anotacoes')) renderAnotacao(anotUrl);
                else log('infoarvore_anotacoes: skipped (section disabled by user)');
            }

            function renderAnotacao(url) {
                fetchPage(url).then(function (docA) {
                    var ta  = docA.getElementById('txaDescricao');
                    var pri = docA.getElementById('chkSinPrioridade');
                    var txt = ta ? (ta.value || ta.textContent || '') : '';
                    var priority = !!(pri && (pri.checked || pri.getAttribute('checked') !== null));
                    buildAnotUI(url, txt, priority);
                    log('infoarvore_anotacoes: loaded (priority=' + priority + ', len=' + txt.length + ')');
                }).catch(function (e) {
                    anotBody.innerHTML = '<span class="infoAlerta">(falha ao carregar anotação)</span>';
                    report('infoarvore_anotacoes: fetch failed', { error: e.message, url: anotUrl });
                });
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

                var editor = doc.createElement('div');
                editor.className = 'seipro-anot-editor';
                editor.setAttribute('contenteditable', 'false');
                editor.style.cssText = 'min-height:24px;padding:6px;border:1px solid transparent;border-radius:4px;white-space:pre-wrap;max-width:100%;outline:none;';
                editor.dataset.original = initialText;
                editor.dataset.priority = initialPriority ? '1' : '0';
                anotDomFromLine(editor, initialText);
                if (!initialText) editor.innerHTML = '<div style="opacity:0.5;font-style:italic;">(sem anotação — clique em ✏️ para adicionar)</div>';
                if (initialPriority) editor.style.borderLeft = '3px solid #d33';

                // Highlight expired dates (DD/MM/YYYY in past) + linkify process numbers (read-only view).
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
                    '<span class="seipro-anot-count" style="margin-left:auto;font-size:85%;color:#888;"></span>' +
                    '<i class="fas fa-trash-alt seipro-anot-btn" data-act="remove"  title="Remover" style="cursor:pointer;color:#a33;"></i>' +
                    '<i class="fas fa-thumbs-up seipro-anot-btn" data-act="remove-confirm"  title="Confirmar remoção" style="cursor:pointer;color:#393;display:none;"></i>' +
                    '<i class="fas fa-thumbs-down seipro-anot-btn" data-act="remove-cancel"  title="Cancelar" style="cursor:pointer;color:#888;display:none;"></i>';

                // Collapsible if content > 3 lines.
                var collapseBtn = doc.createElement('a');
                collapseBtn.className = 'newLink'; collapseBtn.style.cssText = 'cursor:pointer;font-size:85%;display:none;';
                collapseBtn.textContent = 'ver mais';
                var collapsed = true;
                function applyCollapse() {
                    var nLines = editor.children.length;
                    if (nLines > 3) {
                        collapseBtn.style.display = '';
                        if (collapsed) { editor.style.maxHeight = '4.5em'; editor.style.overflow = 'hidden'; collapseBtn.textContent = 'ver mais (' + nLines + ' linhas)'; }
                        else { editor.style.maxHeight = ''; editor.style.overflow = ''; collapseBtn.textContent = 'ver menos'; }
                    } else { collapseBtn.style.display = 'none'; editor.style.maxHeight = ''; editor.style.overflow = ''; }
                }
                collapseBtn.addEventListener('click', function () { collapsed = !collapsed; applyCollapse(); });

                // Stamp display (author + time).
                var stampEl = doc.createElement('div');
                stampEl.style.cssText = 'font-size:80%;color:#666;margin-top:4px;';
                if (stamp && stamp.user) {
                    var when = new Date(stamp.at);
                    stampEl.innerHTML = '<i class="far fa-user" style="margin-right:4px;"></i>por <strong>' + stamp.user + '</strong> em ' + when.toLocaleString('pt-BR');
                }

                anotBody.appendChild(editor);
                anotBody.appendChild(collapseBtn);
                anotBody.appendChild(actions);
                if (stamp) anotBody.appendChild(stampEl);
                applyCollapse();

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
                        collapsed = false; applyCollapse();
                    } else {
                        anotDomFromLine(editor, editor.dataset.original);
                        decorateReadonly(editor);
                        applyCollapse();
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
                    // Auto-save debounced 2s.
                    if (autoSaveTimer) clearTimeout(autoSaveTimer);
                    if (editor.getAttribute('contenteditable') === 'true') {
                        autoSaveTimer = setTimeout(function () {
                            if (isDirty()) { log('anotacao: auto-save'); doSave({ keepEditing: true }); }
                        }, 2000);
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
                    persist(line, editor.dataset.priority === '1', 'save', opts.keepEditing);
                }
                function doRemove() {
                    persist('', false, 'remove', false);
                }

                function persist(line, priority, kind, keepEditing) {
                    actions.querySelectorAll('i').forEach(function (i) { i.style.pointerEvents = 'none'; i.style.opacity = '0.5'; });
                    invalidatePage(url);
                    fetchPage(url).then(function (docA) {
                        return submitForm(docA, { txaDescricao: line, chkSinPrioridade: priority ? 'on' : false });
                    }).then(function () {
                        invalidatePage(url);
                        log('infoarvore_anotacoes: ' + kind + ' ok (priority=' + priority + ', len=' + line.length + ')');
                        buildAnotUI(url, line, priority, { justSaved: true, keepEditing: keepEditing });
                    }).catch(function (e) {
                        actions.querySelectorAll('i').forEach(function (i) { i.style.pointerEvents = ''; i.style.opacity = ''; });
                        report('infoarvore_anotacoes: ' + kind + ' failed', { error: e.message, kind: kind });
                        alert('Falha ao salvar anotação: ' + e.message);
                    });
                }

                updateCount();

                if (opts.keepEditing) { setMode(true); placeCaretAtEnd(editor); }
            }

            function placeCaretAtEnd(el) {
                el.focus();
                var range = doc.createRange(); range.selectNodeContents(el); range.collapse(false);
                var sel = win.getSelection(); sel.removeAllRanges(); sel.addRange(range);
            }

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
        },
        enrich: function () { /* panel is process-level — no per-anchor work */ }
    });
})(window, document);
