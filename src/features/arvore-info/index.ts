// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
// Feature "Informações adicionais na árvore do processo" (config `infoarvore`).
// Fase 6 / Etapa A — porte VERBATIM do legado dist/js/sei-pro-arvore-boot.js para
// src/features/ (1ª feature bundlada a partir de src/features/). Sem mudança de
// comportamento nesta etapa; as etapas B+ extraem parse/io/render/editores.
//
import { extractNosAcoesHtml, extractNosHtml } from './parse/inline-payload.js';
import { isAtribuicaoUnassigned } from './parse/atribuicao.js';
import { parseAcaoRemoverId } from './parse/marcador.js';
import { createIo } from './io.js';
import { forceTrueConfirm } from './dom/confirm.js';
import { installConsultaSection } from './sections/consulta.js';
import { installAcompanhamentoSection } from './sections/acompanhamento.js';
import { installMarcadorSection } from './sections/marcador.js';
import { createAtribuicaoSection } from './sections/atribuicao.js';
import { installAnotacaoSection } from './sections/anotacao.js';

// Árvore bootstrap + enrichment pipeline.
// Runs inside ifrArvore on procedimento_visualizar (SEI 4.1 / 5.x).
//
// Design:
//   - Single lifecycle via Promise.all([treeReady, parentReady]); never aborts (degrades to stub parent).
//   - Pipeline of idempotent enrichers keyed per anchor (data-seipro-done); re-run only on new nodes.
//   - One debounced MutationObserver (rAF) — no concurrent polling loops.
//   - Delegated event handlers, no inline onclick.
//   - Loud console logs whenever an expected precondition fails (so "loads incompletely" is diagnosable).

export function installArvoreInfo(deps: any = {}) {
    const win = deps.window || (typeof window !== 'undefined' ? window : globalThis);
    const doc = deps.document || (win && win.document);
    if (!win || !doc) return;
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
    var PARENT_READY_TIMEOUT = 6000;
    var TREE_READY_TIMEOUT = 20000;

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

    // forceTrueConfirm extraído para dom/confirm.js (Etapa D); importado no topo.

    function normalizeMojibakeUtf8(value) {
        // Delega ao core (SeiPro.core.texto) quando o core-stack est\u00E1 carregado
        // no MESMO mundo isolado deste iframe (bloco init_arvore do manifest carrega
        // o bundle no mesmo frame/mundo). Mant\u00E9m a c\u00F3pia local como rede de seguran\u00E7a
        // (estilo defensivo deste boot + corrida de ordem de carga). Fase 6 \u2014 dedup.
        var core = win.SeiPro && win.SeiPro.core && win.SeiPro.core.texto;
        if (core && typeof core.normalizeMojibakeUtf8 === 'function') {
            return core.normalizeMojibakeUtf8(value);
        }
        value = (typeof value === 'string') ? value : '';
        if (!value) return value;
        if (!/(?:[\u00C2\u00C3][\u0080-\u00BF]|\u00E2[\u0080-\u00BF]{2})/.test(value)) {
            return value;
        }
        try {
            return decodeURIComponent(escape(value));
        } catch (err) {
            if (typeof TextDecoder !== 'undefined' && typeof Uint8Array !== 'undefined') {
                try {
                    return new TextDecoder('utf-8').decode(Uint8Array.from(value, function (ch) {
                        return ch.charCodeAt(0);
                    }));
                } catch (err2) {}
            }
        }
        return value;
    }

    // createMarcadorRemoveConfirmBox removido na Etapa D — era código morto (0 usos).

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

        // Fast path: checkConfigValue costuma já existir no pai mesmo quando a Promise
        // SeiProReady não foi criada (caminhos de inicialização diferentes). Checar
        // SÍNCRONO antes de avisar evita o falso-positivo: em produção o "fallback probe"
        // sempre resolvia em 0-1ms (ver logs), ou seja, checkConfigValue já estava
        // disponível — o warn() disparava por não ter checado antes de poll. Esse warn
        // aparecia como "Erro" na página chrome://extensions sem nunca refletir um
        // problema real (nunca chegava a precisar do polling).
        try {
            if (win.parent && typeof win.parent.checkConfigValue === 'function') {
                log('parentReady via checkConfigValue síncrono (sem SeiProReady, sem polling)');
                return Promise.resolve(win.parent);
            }
        } catch (e) {
            warn('parentReady cross-origin error, using stub:', e.message);
            return Promise.resolve(stubParent());
        }

        warn('parent.SeiProReady missing — polling for checkConfigValue (250ms intervals, timeout=' + PARENT_READY_TIMEOUT + 'ms)');
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

    var PROCESSED_KEYS = win.__SEI_PRO_TREE_PROCESSED_KEYS__ || (win.__SEI_PRO_TREE_PROCESSED_KEYS__ = Object.create(null));
    function hasDone(el, id) { return (el.getAttribute(DONE_ATTR) || '').split(' ').indexOf(id) !== -1; }
    function markDone(el, id) {
        var cur = el.getAttribute(DONE_ATTR) || '';
        el.setAttribute(DONE_ATTR, cur ? cur + ' ' + id : id);
    }
    function anchorKey(el) {
        if (!el) return '';
        return [
            el.getAttribute('id') || '',
            el.getAttribute('href') || '',
            el.getAttribute('target') || ''
        ].join('|');
    }
    function isProcessed(el) {
        var key = anchorKey(el);
        return !!(key && PROCESSED_KEYS[key]);
    }
    function markProcessed(el) {
        var key = anchorKey(el);
        if (key) PROCESSED_KEYS[key] = true;
    }

    function runPipeline(ctx, anchors, label) {
        var applied = {};
        for (var i = 0; i < features.length; i++) {
            var f = features[i];
            if (!ctx.enabled[f.id]) continue;
            applied[f.id] = 0;
        }
        for (var j = 0; j < anchors.length; j++) {
            var a = anchors[j];
            if (isProcessed(a)) continue;
            for (var i2 = 0; i2 < features.length; i2++) {
                var f2 = features[i2];
                if (!ctx.enabled[f2.id]) continue;
                if (hasDone(a, f2.id)) continue;
                try {
                    f2.enrich(a, ctx);
                    markDone(a, f2.id);
                    applied[f2.id] = (applied[f2.id] || 0) + 1;
                } catch (e) {
                    err('feature', f2.id, 'threw on', a.id, e);
                }
            }
            markProcessed(a);
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
                batch = batch.filter(function (a) { return !isProcessed(a); });
                if (batch.length === 0) return;
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
    // Fronteira de rede extraída para io.js (Etapa C). Fábrica injeta win + logger;
    // os call-sites (fetchPage/invalidatePage/submitForm) seguem idênticos.
    var io = createIo({ win: win, log: log, warn: warn, err: err });
    var fetchPage = io.fetchPage;
    var invalidatePage = io.invalidatePage;
    var submitForm = io.submitForm;
    win.SeiProTree.fetchPage = fetchPage;

    // anotLineFromDom / anotDomFromLine movidos p/ sections/anotacao.js (Etapa D).

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
            var html = extractNosAcoesHtml(t);
            if (html === null) continue;
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
        // Fallback: try window.Nos array directly (some SEI versions expose it as a global)
        if (!links.length && win.Nos && win.Nos[0] && win.Nos[0].acoes) {
            var tmp2 = doc.createElement('div');
            tmp2.innerHTML = win.Nos[0].acoes;
            var anchors2 = tmp2.querySelectorAll('a[href*="controlador.php?acao="]');
            for (var k = 0; k < anchors2.length; k++) {
                var href2 = anchors2[k].getAttribute('href');
                if (!href2 || href2 === '#') continue;
                var img2 = anchors2[k].querySelector('img');
                links.push({ name: img2 ? img2.getAttribute('title') : '', url: href2 });
            }
            if (links.length) log('toolbar links from window.Nos fallback:', links.length);
        }
        if (!links.length) {
            report('getToolbarLinks: no action links found — Nos[0].acoes missing or unparseable. Panel sections depending on toolbar links will show "(indisponível)".');
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
                var raw = extractNosHtml(txt);
                if (raw === null) continue;
                raw.split('<br />').forEach(function (frag) {
                    var tmp = doc.createElement('div');
                    tmp.innerHTML = frag;
                    var text = tmp.textContent.trim();
                    if (text) responsaveis.push({ text: text, unassigned: isAtribuicaoUnassigned(text, tmp.querySelector('a.ancoraSigla')) });
                });
                break;
            }
            log('infoarvore: parsed', responsaveis.length, 'responsável(is) from inline scripts');

            // Atribuição — seção extraída p/ sections/atribuicao.js (Etapa D). Fábrica injeta deps;
            // expõe renderRows (render inicial + pós-save) e editInline (editor do lápis).
            var atribSection = createAtribuicaoSection({
                doc: doc, win: win, findToolbarLink: findToolbarLink,
                fetchPage: fetchPage, invalidatePage: invalidatePage, submitViaIframe: submitViaIframe,
                log: log, err: err, report: report
            });

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
            atribSection.renderRows(body, responsaveis);

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
            var sectionRefreshMap = {
                responsaveis: 'responsaveis',
                marcador: 'marcador',
                tipo_procedimento: 'consulta',
                nivel_acesso: 'consulta',
                interessados: 'consulta',
                assuntos: 'consulta',
                observacoes: 'consulta',
                acompanhamento_especial: 'acomp',
                anotacoes: 'anotacoes',
                consulta: 'consulta',
                acomp: 'acomp'
            };
            function resolveRefreshKey(name) {
                return sectionRefreshMap[name] || name;
            }
            function refreshAll(reason) {
                var names = Object.keys(refreshers);
                log('infoarvore: refreshing (' + (reason || 'manual') + ') — ' + names.length + ' section(s)');
                names.forEach(function (n) { try { refreshers[n](); } catch (e) { err('refresh ' + n + ':', e.message); } });
            }
            function refreshSection(name, reason) {
                var key = resolveRefreshKey(name);
                if (!refreshers[key]) { report('refreshSection: no refresher named ' + name + ' (resolved=' + key + ')'); return; }
                log('infoarvore: refreshing ' + name + ' -> ' + key + ' (' + (reason || 'manual') + ')');
                try { refreshers[key](); } catch (e) { err('refresh ' + key + ':', e.message); }
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
                        atribSection.editInline(panel);
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
                    // Etapa E (reconciliação): todos os modos editáveis (responsaveis, marcador,
                    // tipo_procedimento, acompanhamento_especial) são tratados pelos editores
                    // inline da própria feature acima. Não há mais handoff para o diálogo legado
                    // `parent.editDadosArvorePro` (caminho old removido). Modo desconhecido = no-op.
                    err('edit: unhandled mode "' + mode + '" — no inline editor');
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

            // (watchDialogClose removido na Etapa E — era usado só pelo handoff legado ao
            //  diálogo jQuery UI de parent.editDadosArvorePro, agora aposentado.)

            // parseAtribuicaoItemsFromDoc / renderAtribuicaoRows / editAtribuicaoInline
            // extraídos p/ sections/atribuicao.js (Etapa D) — ver atribSection acima.

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
                    // forms (submit the form), scripts (form has onsubmit="return OnSubmitForm()"),
                    // and modals because acaoRemover() uses confirm() before submitting.
                    ifr.setAttribute('sandbox', 'allow-same-origin allow-forms allow-scripts allow-modals');
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
                                            if (hdn) { hdn.value = values[id]; }
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

            // editMarcadorInline removido (código morto — fluxo add-only vive no click handler).

            // Tipo de Processo — uses the big procedimento_alterar form. Just override
            // selTipoProcedimento (and its mirror hdnIdTipoProcedimento). Other fields keep
            // whatever the form was prefilled with.
            function editTipoInline(panel) {
                var url = findToolbarLink('procedimento_alterar');
                if (!url) { report('inline tipo: toolbar link missing — edit Tipo de Processo disabled', { sought: 'procedimento_alterar' }); return; }
                openInlineEditor(panel, url, [
                    { kind: 'select', label: 'Tipo de Processo', srcSelector: '#selTipoProcedimento', name: 'selTipoProcedimento' },
                ], function () { refreshSection('tipo_procedimento', 'post-edit tipo'); });
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

            // --- 4) Marcador — Etapa D: render/remoção extraídos p/ sections/marcador.js.
            //     A adição (openInlineEditor no clique do lápis) fica abaixo e re-renderiza via refreshers.
            installMarcadorSection({
                doc: doc, marcPanel: marcPanel,
                findToolbarLink: findToolbarLink, fetchPage: fetchPage, invalidatePage: invalidatePage,
                submitViaIframe: submitViaIframe, refreshSection: refreshSection, refreshers: refreshers,
                sectionEnabled: sectionEnabled, log: log, warn: warn, err: err, report: report
            });

            // --- 5) Consulta (Tipo/Nível/Assuntos/Observações/Interessados) — Etapa D: seção
            //     extraída para sections/consulta.js; recebe painéis + deps via ctx.
            installConsultaSection({
                doc: doc,
                intPanel: intPanel, tipoPanel: tipoPanel, acessoPanel: acessoPanel,
                assuntosPanel: assuntosPanel, obsPanel: obsPanel,
                findToolbarLink: findToolbarLink, fetchPage: fetchPage, invalidatePage: invalidatePage,
                refreshers: refreshers, sectionEnabled: sectionEnabled,
                log: log, warn: warn, report: report
            });

            // --- 5b) Acompanhamento Especial — Etapa D: render/remoção extraídos p/ sections/acompanhamento.js.
            //     A edição (editAcompInline) fica abaixo (scaffolding compartilhado) e re-renderiza via refreshers.
            installAcompanhamentoSection({
                doc: doc, acompPanel: acompPanel,
                findToolbarLink: findToolbarLink, getToolbarLinks: getToolbarLinks,
                fetchPage: fetchPage, invalidatePage: invalidatePage, submitViaIframe: submitViaIframe,
                refreshSection: refreshSection, refreshers: refreshers, sectionEnabled: sectionEnabled,
                log: log, warn: warn, err: err, report: report
            });

            // --- 6) Anotação (sticknote) — full edit flow: edit/save/cancel/remove/priority/date/checklist.
            // --- 6) Anotação (sticknote) — Etapa D: seção extraída p/ sections/anotacao.js.
            installAnotacaoSection({
                doc: doc, win: win, fetchPage: fetchPage, invalidatePage: invalidatePage, submitForm: submitForm,
                refreshers: refreshers, sectionEnabled: sectionEnabled, anotPanel: anotPanel,
                findToolbarLink: findToolbarLink, log: log, warn: warn, err: err, report: report,
                normalizeMojibakeUtf8: normalizeMojibakeUtf8
            });
        },
        enrich: function () { /* panel is process-level — no per-anchor work */ }
    });
}
