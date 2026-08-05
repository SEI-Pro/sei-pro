/**
 * Isolated-world loader for the document editor.
 *
 * SEI's CKEditor 4 lives on the page MAIN window. Isolated content scripts cannot
 * call CKEDITOR.dialog / instances, so the editor bundle is injected as a page
 * <script src="chrome-extension://…"> once the editor DOM (or CKEDITOR) is present.
 *
 * Process data is loaded by the MAIN-world page runtime with same-origin reads;
 * this loader only crosses the world boundary for CKEditor itself.
 *
 * The AI feature remains an isolated content script. This loader never proxies
 * extension storage, runtime messages or LLM ports into the page world.
 */
(function () {
    if (typeof chrome === 'undefined' || !chrome.runtime || !chrome.runtime.getURL) return;

    var root = document.documentElement;
    if (!root || root.getAttribute('data-seipro-editor-injected') === '1') return;

    var base = chrome.runtime.getURL('');
    root.dataset.seiproExtensionUrl = base;
    try {
        var manifest = chrome.runtime.getManifest();
        root.dataset.seiproVersion = (manifest && manifest.version) || '';
        root.dataset.seiproShortName = (manifest && manifest.short_name) || 'SPro';
    } catch (e) { /* noop */ }

    function getDocumentoIdFromSearch() {
        try {
            return String(new URLSearchParams(location.search || '').get('id_documento') || '').trim();
        } catch (err) {
            return '';
        }
    }

    function missingDocumentoId() {
        try {
            var params = new URLSearchParams(location.search || '');
            if ((params.get('acao') || '') !== 'editor_montar') return false;
            return !/^\d+$/.test(getDocumentoIdFromSearch());
        } catch (err) {
            return false;
        }
    }

    function isValidEditorMontarUrl(url) {
        var s = String(url || '');
        if (s.indexOf('acao=editor_montar') === -1) return false;
        var m = s.match(/[?&]id_documento=([^&]*)/i);
        return !!(m && /^\d+$/.test(String(m[1] || '').trim()));
    }

    function toAbsolute(url, baseWin) {
        try {
            var doc = (baseWin && baseWin.document) || document;
            var a = doc.createElement('a');
            a.href = url;
            return a.href;
        } catch (e) {
            return url;
        }
    }

    /**
     * When a named editor window was opened with empty id_documento, recover the
     * correct SEI URL from the opener (visualização) and replace location.
     */
    function tryRecoverEditorUrlFromOpener() {
        try {
            var op = window.opener;
            if (!op || op.closed) return null;
            var candidates = [];
            try {
                if (typeof op.linkEditarConteudo === 'string') candidates.push(op.linkEditarConteudo);
            } catch (e1) { /* noop */ }
            try {
                var viz = op.document && (
                    op.document.getElementById('ifrConteudoVisualizacao')
                    || op.document.getElementById('ifrVisualizacao')
                );
                var vw = viz && viz.contentWindow;
                if (vw && typeof vw.linkEditarConteudo === 'string') {
                    candidates.push(vw.linkEditarConteudo);
                }
            } catch (e2) { /* noop */ }
            for (var i = 0; i < candidates.length; i++) {
                if (isValidEditorMontarUrl(candidates[i])) {
                    return toAbsolute(candidates[i], op);
                }
            }
            // Do not synthesize an editor URL from a document-view URL: SEI's
            // infra_hash covers every parameter, including id_documento.
            // Reusing it after changing the id redirects the user to login
            // with "Hash inválido".
        } catch (e) { /* cross-origin or missing opener */ }
        return null;
    }

    function pageLooksLikeEditorError() {
        try {
            var text = (document.body && (document.body.innerText || document.body.textContent)) || '';
            return /documento\s+n[aã]o\s+encontrado/i.test(text)
                || /erro\s+ao\s+.*(abrir|carregar|carregar\s+o)?\s*documento/i.test(text)
                || /erro\s+documento/i.test(text);
        } catch (err) {
            return false;
        }
    }

    function hasEditorDom() {
        // Isolated world cannot see page CKEDITOR — detect via DOM only.
        return !!(
            document.querySelector('#frmEditor')
            || document.querySelector('#divEditores')
            || document.querySelector('#cke_txaConteudo')
            || document.querySelector('[id^="cke_txaEditor"]')
            || document.querySelector('.cke_toolbox')
            || document.querySelector('iframe.cke_wysiwyg_frame')
        );
    }

    function inject(src, onload) {
        var s = document.createElement('script');
        s.src = src;
        s.async = false;
        if (typeof onload === 'function') s.onload = onload;
        s.onerror = function () {
            console.error('SEI Pro editor: failed to inject', src);
        };
        (document.head || root).appendChild(s);
    }

    function injectEditorBundle() {
        if (root.getAttribute('data-seipro-editor-injected') === '1') return;
        root.setAttribute('data-seipro-editor-injected', '1');
        // jmespath for MAIN-world editor dialogs (isolated also loads it via content_scripts).
        inject(base + 'js/lib/jmespath.min.js', function () {
            inject(base + 'js/sei-pro-editor.js');
        });
    }

    var tries = 0;
    var maxTries = 150; // ~15s

    function tick() {
        if (missingDocumentoId()) {
            if (root.getAttribute('data-seipro-editor-recover') === '1') {
                console.info(
                    'SEI Pro editor: this tab opened editor_montar with empty id_documento; not injecting into SEI error page.',
                    location.href
                );
                root.setAttribute('data-seipro-editor-injected', 'skip-empty-id');
                return;
            }
            var recovered = tryRecoverEditorUrlFromOpener();
            if (recovered) {
                console.info('SEI Pro editor: empty id_documento in URL — redirecting to opener linkEditarConteudo');
                root.setAttribute('data-seipro-editor-recover', '1');
                location.replace(recovered);
                return;
            }
            console.info(
                'SEI Pro editor: this tab opened editor_montar with empty id_documento; not injecting into SEI error page.',
                location.href
            );
            root.setAttribute('data-seipro-editor-injected', 'skip-empty-id');
            return;
        }
        if (pageLooksLikeEditorError()) {
            console.info('SEI Pro editor: SEI document error page — not injecting editor features.');
            root.setAttribute('data-seipro-editor-injected', 'skip-error');
            return;
        }
        if (hasEditorDom()) {
            injectEditorBundle();
            return;
        }
        if (++tries >= maxTries) {
            // Slow pages: inject once as last resort if URL still looks like the editor.
            if (/acao=editor_montar|texto_padrao_interno_|secao_modelo_alterar/i.test(location.search || '')) {
                injectEditorBundle();
            }
            return;
        }
        setTimeout(tick, 100);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () { setTimeout(tick, 0); });
    } else {
        setTimeout(tick, 0);
    }
})();
