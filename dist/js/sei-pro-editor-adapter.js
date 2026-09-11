/**
 * SEI Pro - Editor Adapter
 *
 * Camada de abstracao entre o sei-pro-editor.js e a versao do editor
 * presente na pagina (CKEditor 4 em SEI 3.1/4, CKEditor 5 em SEI 5).
 *
 * O adapter expoe um contrato unico; implementacoes CK4 e CK5 encapsulam
 * as diferencas (CKEDITOR global vs ckeditorInstance no DOM, iframe vs
 * inline, insertHtml direto vs model.change, etc.).
 *
 * Uso:
 *   var ed = SeiProEditorAdapter.getInstance(this_);
 *   SeiProEditorAdapter.withEdit(ed, function () {
 *       SeiProEditorAdapter.insertHtmlBeforeParagraph(ed, html);
 *   });
 *
 * Strings usam escapes \u para evitar mojibake em browsers que servem
 * scripts sem charset=utf-8 explicito.
 */

(function () {
    'use strict';

    // ----------------------------------------------------------------
    // Shims para funcoes globais do SEI 3.1/4 que nao existem mais no SEI 5
    // (ou existem com outro nome). Essas funcoes sao chamadas por helpers do
    // sei-functions-pro.js (ex: resetDialogBoxPro -> infraTooltipOcultar) e
    // quebram tudo se estiverem ausentes.
    //
    // Idempotente: so instala stubs onde a funcao nao existir.
    // ----------------------------------------------------------------
    (function ensureSeiLegacyGlobals() {
        var noop = function () {};
        var stubs = [
            'infraTooltipMostrar', 'infraTooltipOcultar',
            'infraAbrirJanela', 'infraArvoreAcao', 'infraArvoreNo',
            'infraClientHeight', 'infraClientWidth',
            'infraFormatarTamanhoBytes',
            'infraMenuSistemaEsquema', 'infraMenuSistemaEsquemaPro'
        ];
        stubs.forEach(function (name) {
            if (typeof window[name] === 'undefined') window[name] = noop;
        });
    })();

    // ----------------------------------------------------------------
    // Deteccao da versao do editor presente na pagina.
    //
    // Observacoes empiricas (SEI 5.0.4):
    //  - window.CKEDITOR pode coexistir com CK5 (nao eh garantia de CK4).
    //  - A presenca de .ck-editor__editable_inline com propriedade
    //    ckeditorInstance eh o sinal mais confiavel de CK5.
    // ----------------------------------------------------------------
    function detectVersion() {
        var hasCK5 = !!document.querySelector('.ck-editor__editable_inline');
        if (hasCK5) return 5;
        if (typeof window.CKEDITOR !== 'undefined') return 4;
        return 0; // indeterminado, aguardar
    }

    // ----------------------------------------------------------------
    // Estado compartilhado: registry de features, contador de markers
    // (saveSelection no CK5) e helpers de root/menu de contexto.
    // ----------------------------------------------------------------
    var _features = [];
    var markerSeq = 0;

    /**
     * Registry leve. Os modulos em js/modules/editor/ chamam registerFeature
     * para enumeracao/diagnostico. O rendering do botao e o bind de clique
     * permanecem no monolito (htmlButton/setClickButtons), que referencia as
     * funcoes globais por nome -- por isso registerFeature NAO carrega markup.
     * Idempotente por id.
     */
    function registerFeature(def) {
        if (!def || !def.id) return null;
        for (var i = 0; i < _features.length; i++) {
            if (_features[i].id === def.id) { _features[i] = def; return def; }
        }
        _features.push(def);
        return def;
    }
    function getFeatures() { return _features.slice(); }

    /**
     * CK5 multi-root: descobre o rootName cujo DOM corresponde ao "Corpo do
     * Texto" (mesma heuristica de appendToBody/transformBodyHtml).
     */
    function resolveBodyRootNameCK5(editor) {
        try {
            var bodyEl = BackendCK5.getBodyContainer(editor);
            if (!bodyEl) return null;
            var roots = Array.from(editor.model.document.roots || []);
            for (var i = 0; i < roots.length; i++) {
                var r = roots[i];
                if (!r || typeof r.isAttached !== 'function') continue;
                if (!r.isAttached() || r.rootName === '$graveyard') continue;
                var viewRoot = editor.editing.view.document.getRoot(r.rootName);
                if (!viewRoot) continue;
                var domRoot = editor.editing.view.domConverter.mapViewToDom(viewRoot);
                if (domRoot === bodyEl) return r.rootName;
            }
        } catch (e) {}
        return null;
    }

    /**
     * Menu de contexto via DOM (uniforme CK4/CK5). builder(targetEl) retorna
     * um array de itens { label, action } ou vazio para deixar o menu nativo.
     */
    function attachDomContextMenu(bodyEl, editor, builder) {
        if (!bodyEl || typeof builder !== 'function') return;
        if (bodyEl.__seiProCtxMenu) return; // idempotente
        bodyEl.__seiProCtxMenu = true;
        bodyEl.addEventListener('contextmenu', function (ev) {
            var items = builder(ev.target);
            if (!items || !items.length) return;
            ev.preventDefault();
            renderDomContextMenu(items, ev.clientX, ev.clientY);
        });
    }
    function renderDomContextMenu(items, x, y) {
        var prev = document.getElementById('seiProCtxMenu');
        if (prev && prev.parentNode) prev.parentNode.removeChild(prev);
        var menu = document.createElement('div');
        menu.id = 'seiProCtxMenu';
        menu.style.cssText = 'position:fixed;z-index:2147483647;background:#fff;border:1px solid #ccc;'
            + 'box-shadow:0 2px 8px rgba(0,0,0,.2);border-radius:4px;padding:4px 0;min-width:160px;font:13px sans-serif;';
        menu.style.left = x + 'px';
        menu.style.top = y + 'px';
        items.forEach(function (it) {
            var row = document.createElement('div');
            row.textContent = it.label;
            row.style.cssText = 'padding:6px 14px;cursor:pointer;white-space:nowrap;';
            row.addEventListener('mouseenter', function () { row.style.background = '#eef'; });
            row.addEventListener('mouseleave', function () { row.style.background = ''; });
            row.addEventListener('click', function () {
                if (menu.parentNode) menu.parentNode.removeChild(menu);
                if (typeof it.action === 'function') it.action();
            });
            menu.appendChild(row);
        });
        document.body.appendChild(menu);
        var close = function () {
            if (menu.parentNode) menu.parentNode.removeChild(menu);
            document.removeEventListener('mousedown', close);
        };
        setTimeout(function () { document.addEventListener('mousedown', close); }, 0);
    }

    /**
     * Abre um dialogo jQuery UI on-demand -- substitui CKEDITOR.dialog (ausente
     * no CK5) e funciona tambem no CK4. Generaliza o padrao ja usado em
     * openDialogNotaRodape/getTinyUrl do monolito. def:
     *   { id, title, html, width, height, modal, resizable, draggable, appendTo,
     *     buttons: [{ text, click(fn($box)), primary }] | objeto jQuery UI,
     *     onOpen($box), onClose() }
     * Retorna o elemento jQuery do dialogo (ou null se jQuery UI ausente).
     *
     * ACOES DENTRO DO HTML: use data-spro-click="nomeDaFuncao" (ou
     * data-spro-change, para inputs que reagem a selecao), NAO onclick=/
     * onchange=. No CK4 o HTML das abas ia direto para o DOM pelo type:'html'
     * do CKEDITOR e o handler inline funcionava; aqui o HTML costuma passar por
     * sanitizeHTML (DOMPurify), que REMOVE todo atributo de evento inline -- o
     * controle fica no lugar, com aparencia normal, e nao faz nada. data-*
     * sobrevive ao sanitize e e religado por delegacao abaixo (o que tambem
     * cobre linhas inseridas no dialogo depois de aberto).
     */
    function openDialog(def) {
        if (!window.$ || !$.fn || !$.fn.dialog) {
            if (typeof console !== 'undefined') console.warn('[SEIPro/Adapter] jQuery UI dialog ausente');
            return null;
        }
        def = def || {};
        var id = def.id || ('seiProDialog_' + (markerSeq++));
        var $existing = $('#' + id);
        if ($existing.length) { try { $existing.dialog('destroy'); } catch (e) {} $existing.remove(); }
        var $box = $('<div></div>').attr('id', id).html(def.html || '');
        $('body').append($box);

        // Religa as acoes declaradas em data-spro-click / data-spro-change (ver
        // nota acima). So aceita identificador simples resolvido em window --
        // nada de eval.
        var acionar = function (attr, preventDefault) {
            return function (ev) {
                var nome = $(this).attr(attr) || '';
                if (!/^[A-Za-z_$][\w$]*$/.test(nome)) return;
                var fn = window[nome];
                if (typeof fn !== 'function') {
                    if (typeof console !== 'undefined' && console.warn) {
                        console.warn('[SEIPro/Adapter] acao de dialogo inexistente:', nome);
                    }
                    return;
                }
                if (preventDefault) ev.preventDefault();
                fn.call(this, this);
            };
        };
        // change (nao click) nos controles de selecao: um radio tambem muda pelo
        // teclado, e ai nao ha clique nenhum.
        $box.on('click', '[data-spro-click]', acionar('data-spro-click', true));
        $box.on('change', '[data-spro-change]', acionar('data-spro-change', false));

        var buttons = def.buttons;
        if (Array.isArray(buttons)) {
            buttons = buttons.map(function (b) {
                return {
                    text: b.text,
                    'class': b.primary ? 'ui-button-primary' : '',
                    click: function () { if (typeof b.click === 'function') b.click.call(this, $box); }
                };
            });
        }

        $box.dialog({
            title: def.title || '',
            width: def.width || 'auto',
            height: def.height || 'auto',
            modal: def.modal !== false,
            resizable: def.resizable !== false,
            draggable: def.draggable !== false,
            appendTo: def.appendTo || 'body',
            buttons: buttons || undefined,
            open: function () { if (typeof def.onOpen === 'function') def.onOpen($box); },
            close: function () { if (typeof def.onClose === 'function') def.onClose(); }
        });
        return $box;
    }

    // ----------------------------------------------------------------
    // Lista canonica de modulos de feature (js/modules/editor/), carregados
    // ANTES do monolito sei-pro-editor.js. Ordem nao importa para o call-time
    // (handlers rodam no clique/boot); so importa que estejam definidos antes
    // de initFunctions/cliques do monolito.
    // ----------------------------------------------------------------
    var MODULES = [
        // Infra: libera classes/estilos/atributos no CK5. Primeiro da lista
        // porque as demais features dependem do GHS liberado.
        'ghs-unlock.js',
        'checkbox.js',
        'page-break.js',
        'session-break.js',
        'cap-letter.js',
        'qr-code.js',
        'nota-rodape.js',
        'tiny-url.js',
        'ref-interna.js',
        'citacao.js',
        'sumario.js',
        'sigilo.js',
        'dados-processo.js',
        'latex.js',
        'legis.js',
        'table-styles.js',
        'quick-table.js',
        'align.js',
        'font-size.js',
        'copy-style.js',
        'link-pro.js',
        'importar-doc.js',
        'minuta-watermark.js',
        'processo-publico.js',
        'image-base64.js',
        'image-quality.js',
        'image-background.js',
        'image-editor.js',
        'context-menu.js',
        'auto-cleanup.js',
        'style-editor.js',
        'review.js',
        'ditado.js'
    ];

    /**
     * Resolve a base (raiz) da extensao no MUNDO DA PAGINA. O adapter e os
     * modulos executam no mundo da pagina (o $.getScript do init.js injeta
     * script tags), portanto NAO da para usar getUrlExtension (que vive no
     * mundo isolado do content script). Usamos URL_SPRO -- a mesma base que o
     * editor usa para icones/sei-pro-ai.js -- e, em fallback, derivamos de
     * qualquer recurso chrome-extension/moz-extension presente no DOM.
     */
    function resolveExtBase() {
        if (typeof window.URL_SPRO === 'string' && window.URL_SPRO) return window.URL_SPRO;
        var sel = '[href^="chrome-extension://"],[src^="chrome-extension://"],'
                + '[href^="moz-extension://"],[src^="moz-extension://"]';
        var el = document.querySelector(sel);
        if (el) {
            var u = el.href || el.getAttribute('src') || '';
            var m = u.match(/^((?:chrome|moz)-extension:\/\/[^/]+\/)/);
            if (m) return m[1];
        }
        return null;
    }

    /**
     * Auto-carrega os modulos de js/modules/editor/ no mundo da pagina, usando
     * a jQuery da pagina (window.$/jQuery) -- mesmo mecanismo que o editor.js
     * usa para carregar sei-pro-ai.js (comprovadamente funciona aqui). Cada
     * modulo define seus handlers globais e chama registerFeature no adapter.
     * Idempotente. Retorna true se disparou o carregamento, false se ainda
     * faltam dependencias (base/jQuery) -- nesse caso o auto-start faz poll.
     */
    function loadModules() {
        var base = resolveExtBase();
        var jq = window.jQuery || window.$;
        if (!base || !jq || typeof jq.getScript !== 'function') return false;
        if (loadModules._done) return true;
        loadModules._done = true;
        MODULES.forEach(function (name) {
            try { jq.getScript(base + 'js/modules/editor/' + name); } catch (e) {}
        });
        return true;
    }

    // ================================================================
    // Backend CKEditor 4 (envolve APIs existentes, praticamente passthrough)
    // ================================================================
    var BackendCK4 = {
        version: 4,

        waitReady: function () { return Promise.resolve(); },

        /**
         * Dado o botao clicado (ou qualquer elemento dentro de um wrapper
         * .cke), retorna a instancia correspondente. Sem argumento, devolve
         * a primeira instancia disponivel.
         */
        getInstance: function (ref) {
            if (ref) {
                var wrapper = (ref.closest ? ref.closest('div.cke') : null)
                    || (window.$ ? $(ref).closest('div.cke')[0] : null);
                if (wrapper) {
                    var id = wrapper.id.replace('cke_', '');
                    if (window.CKEDITOR && window.CKEDITOR.instances[id]) {
                        return window.CKEDITOR.instances[id];
                    }
                }
            }
            if (window.CKEDITOR && window.CKEDITOR.instances) {
                for (var k in window.CKEDITOR.instances) {
                    return window.CKEDITOR.instances[k];
                }
            }
            return null;
        },

        getAllInstances: function () {
            var out = [];
            if (window.CKEDITOR && window.CKEDITOR.instances) {
                for (var k in window.CKEDITOR.instances) {
                    out.push(window.CKEDITOR.instances[k]);
                }
            }
            return out;
        },

        focus: function (editor) { editor && editor.focus(); },

        saveSnapshot: function (editor) { editor && editor.fire('saveSnapshot'); },

        /**
         * Envelope padrao: focus + saveSnapshot + fn + saveSnapshot.
         * Equivalente semantico do editor.model.change() do CK5.
         */
        withEdit: function (editor, fn) {
            if (!editor) return;
            editor.focus();
            editor.fire('saveSnapshot');
            try { fn(); } finally { editor.fire('saveSnapshot'); }
        },

        insertHtml: function (editor, html) {
            editor && editor.insertHtml(html);
        },

        /**
         * Retorna o elemento DOM (dentro do iframe do editor, se houver)
         * que contem o cursor atual.
         */
        getSelectionElement: function (editor) {
            if (!editor) return null;
            var sel = editor.getSelection && editor.getSelection();
            var start = sel && sel.getStartElement && sel.getStartElement();
            return start ? start.$ : null;
        },

        getSelectionParagraph: function (editor) {
            var el = this.getSelectionElement(editor);
            if (!el) return null;
            if (window.$) {
                var $p = $(el).closest('p');
                return $p.length ? $p[0] : null;
            }
            return el.closest ? el.closest('p') : null;
        },

        /**
         * Insere HTML imediatamente antes de um elemento de referencia
         * (tipicamente o <p> onde o cursor esta). No CK4 o elemento vive
         * dentro de um iframe; recuperamos o iframe a partir do id do editor.
         */
        insertHtmlBefore: function (editor, referenceEl, html) {
            if (!editor || !referenceEl) return;
            // Em CK4, a insercao DOM precisa ocorrer dentro do iframe do editor.
            var editorId = editor.name || (editor.element && editor.element.getId && editor.element.getId());
            if (window.$) {
                if (editorId) {
                    var ifr = $('iframe[title*="' + editorId + '"]').contents();
                    if (ifr.length) {
                        ifr.find(referenceEl).before(html);
                        return;
                    }
                }
                $(referenceEl).before(html);
            }
        },

        /**
         * Container onde botoes customizados sao adicionados na toolbar.
         * No CK4 eh o span.cke_toolbox do wrapper da instancia ativa.
         */
        getToolbarContainer: function (editor) {
            if (!editor || !window.$) return null;
            var wrapper = $('#cke_' + editor.name);
            if (!wrapper.length) return null;
            var tb = wrapper.find('span.cke_toolbox');
            return tb.length ? tb[0] : null;
        },

        /** Insere um texto simples (sem HTML) na posicao do cursor. */
        insertText: function (editor, text) {
            editor && editor.insertText(text);
        },

        /**
         * Retorna o elemento DOM do corpo do documento.
         * CK4: body do iframe onde o editor vive.
         */
        getBodyContainer: function (editor) {
            if (!editor || !window.$) return null;
            // Caminho oficial do CK4: cada instancia conhece o proprio document.
            // O seletor por title (abaixo) so vale quando o iframe wysiwyg leva o
            // nome da instancia no title; nos documentos com secoes do SEI 4.1 os
            // titles sao os nomes das secoes ("Corpo do Texto", "Cabecalho", ...),
            // e a busca nao casava nada -- deixando o corpo inacessivel.
            try {
                var doc = editor.document;
                var b = doc && doc.getBody && doc.getBody();
                if (b && b.$) return b.$;
            } catch (e) {}
            var ifm = $('iframe[title*="'+editor.name+'"]').contents();
            var body = ifm.find('body');
            return body.length ? body[0] : null;
        },

        /** Busca elementos dentro do corpo do documento. Retorna jQuery. */
        findInBody: function (editor, selector) {
            var body = this.getBodyContainer(editor);
            return body ? $(body).find(selector) : $();
        },

        /** Adiciona HTML ao final do corpo do documento. */
        appendToBody: function (editor, html) {
            var body = this.getBodyContainer(editor);
            if (body) $(body).append(html);
        },

        /**
         * Transforma o HTML do corpo do documento via funcao recebe(html)->html.
         * Em CK4 usa manipulacao DOM direta do iframe (simples, preserva selecao).
         */
        transformBodyHtml: function (editor, transformFn) {
            if (!editor || typeof transformFn !== 'function') return;
            var body = this.getBodyContainer(editor);
            if (!body) return;
            var html = $(body).html();
            var newHtml = transformFn(html);
            if (typeof newHtml === 'string' && newHtml !== html) $(body).html(newHtml);
        },

        // --- Primitivas adicionais (migracao CK5) ---

        execCommand: function (editor, command, value) {
            if (editor && editor.execCommand) editor.execCommand(command, value);
        },

        applyStyle: function (editor, styleDef) {
            if (!editor || !window.CKEDITOR || !styleDef) return;
            try {
                var style = (CKEDITOR.style && styleDef instanceof CKEDITOR.style)
                    ? styleDef : new CKEDITOR.style(styleDef);
                editor.applyStyle(style);
            } catch (e) {}
        },

        getData: function (editor) {
            return (editor && editor.getData) ? editor.getData() : '';
        },

        setData: function (editor, html) {
            if (editor && editor.setData) editor.setData(html);
        },

        insertElement: function (editor, html) {
            if (!editor) return;
            try {
                if (window.CKEDITOR && CKEDITOR.dom && CKEDITOR.dom.element && editor.insertElement) {
                    editor.insertElement(CKEDITOR.dom.element.createFromHtml(html, editor.document));
                    return;
                }
            } catch (e) {}
            if (editor.insertHtml) editor.insertHtml(html);
        },

        saveSelection: function (editor) {
            try {
                var sel = editor && editor.getSelection && editor.getSelection();
                return sel ? sel.createBookmarks(true) : null;
            } catch (e) { return null; }
        },

        restoreSelection: function (editor, token) {
            try {
                var sel = editor && editor.getSelection && editor.getSelection();
                if (sel && token) sel.selectBookmarks(token);
            } catch (e) {}
        },

        getSelectedText: function (editor) {
            try {
                var sel = editor && editor.getSelection && editor.getSelection();
                return sel && sel.getSelectedText ? (sel.getSelectedText() || '') : '';
            } catch (e) { return ''; }
        },

        getSelectedHtml: function (editor) {
            try {
                var sel = editor && editor.getSelection && editor.getSelection();
                if (!sel) return '';
                var frag = sel.getSelectedHtml ? sel.getSelectedHtml() : null;
                if (!frag) return '';
                if (frag.getHtml) return frag.getHtml();
                if (window.CKEDITOR && CKEDITOR.dom) {
                    var tmp = new CKEDITOR.dom.element('div');
                    tmp.append(frag);
                    return tmp.getHtml();
                }
                return '';
            } catch (e) { return ''; }
        },

        on: function (editor, evt, fn) { if (editor && editor.on) editor.on(evt, fn); },
        off: function (editor, evt, fn) { if (editor && editor.removeListener) editor.removeListener(evt, fn); },
        fire: function (editor, evt, data) { if (editor && editor.fire) editor.fire(evt, data); },

        addContextMenu: function (editor, builder) {
            attachDomContextMenu(this.getBodyContainer(editor), editor, builder);
        }
    };

    // ================================================================
    // Backend CKEditor 5
    // ================================================================
    var BackendCK5 = {
        version: 5,

        /**
         * Aguarda a instancia do CK5 ficar pronta (polling com timeout).
         */
        waitReady: function (timeoutMs) {
            timeoutMs = timeoutMs || 15000;
            return new Promise(function (resolve, reject) {
                var start = Date.now();
                (function poll() {
                    var el = document.querySelector('.ck-editor__editable_inline');
                    var ed = el && el.ckeditorInstance;
                    if (ed && ed.state === 'ready') return resolve(ed);
                    if (Date.now() - start > timeoutMs) {
                        return reject(new Error('Timeout aguardando CKEditor 5'));
                    }
                    setTimeout(poll, 200);
                })();
            });
        },

        /**
         * O CK5 do SEI eh multi-root (varios editables, 1 instancia).
         * Ignoramos o argumento ref porque so ha uma instancia; ficando
         * o cuidado de usar a selection global dela.
         */
        getInstance: function (_ref) {
            var el = document.querySelector('.ck-editor__editable_inline');
            var ed = el && el.ckeditorInstance;
            return (ed && ed.state === 'ready') ? ed : null;
        },

        getAllInstances: function () {
            var ed = this.getInstance();
            return ed ? [ed] : [];
        },

        focus: function (editor) { editor && editor.focus(); },

        /**
         * No CK5 o undo eh automatico para qualquer model.change(). Snapshot
         * manual eh no-op mas mantemos a primitiva para simetria de API.
         */
        saveSnapshot: function (_editor) { /* no-op em CK5 */ },

        withEdit: function (editor, fn) {
            if (!editor) return;
            editor.focus();
            editor.model.change(function () { fn(); });
        },

        /**
         * Insere HTML usando a pipeline view->model do CK5. Requer que o
         * schema aceite a tag (General HTML Support cobre a maioria).
         */
        insertHtml: function (editor, html) {
            if (!editor) return;
            editor.model.change(function () {
                var vf = editor.data.processor.toView(html);
                var mf = editor.data.toModel(vf);
                editor.model.insertContent(mf, editor.model.document.selection);
            });
        },

        /**
         * Devolve o elemento DOM (no .ck-editor__editable_inline) onde o
         * cursor esta. Usa a Selection API nativa apos garantir foco.
         */
        getSelectionElement: function (_editor) {
            var nativeSel = window.getSelection && window.getSelection();
            if (!nativeSel || nativeSel.rangeCount === 0) return null;
            var node = nativeSel.anchorNode;
            if (!node) return null;
            return node.nodeType === 1 ? node : node.parentElement;
        },

        getSelectionParagraph: function (editor) {
            var el = this.getSelectionElement(editor);
            if (!el) return null;
            return el.closest ? el.closest('p') : null;
        },

        /**
         * Insere HTML antes do elemento de referencia. Estrategia: localizar
         * o position model correspondente ao DOM e inserir la. Se nao der,
         * fallback para insertHtml na selecao atual (menos preciso mas
         * funcional quando o cursor ja esta no paragrafo).
         */
        insertHtmlBefore: function (editor, referenceEl, html) {
            if (!editor || !referenceEl) return;
            try {
                var viewRoot = editor.editing.view.domConverter.mapDomToView(referenceEl);
                if (viewRoot) {
                    var modelEl = editor.editing.mapper.toModelElement(viewRoot);
                    if (modelEl) {
                        editor.model.change(function (writer) {
                            var position = writer.createPositionBefore(modelEl);
                            var vf = editor.data.processor.toView(html);
                            var mf = editor.data.toModel(vf);
                            editor.model.insertContent(mf, position);
                        });
                        return;
                    }
                }
            } catch (e) { /* cai no fallback */ }
            this.insertHtml(editor, html);
        },

        /**
         * No CK5 o container dos botoes eh .ck-toolbar__items dentro de
         * editor.ui.view.toolbar.element. Sem o fallback para .ck-toolbar,
         * o append coloca o botao como irmao do container e quebra o layout.
         */
        getToolbarContainer: function (editor) {
            var tb = editor && editor.ui && editor.ui.view
                  && editor.ui.view.toolbar && editor.ui.view.toolbar.element;
            if (!tb) return null;
            return tb.querySelector('.ck-toolbar__items') || tb;
        },

        /** Insere texto simples na posicao do cursor via model. */
        insertText: function (editor, text) {
            if (!editor) return;
            editor.model.change(function (writer) {
                editor.model.insertContent(writer.createText(text));
            });
        },

        /**
         * Retorna o elemento DOM do "Corpo do Texto" (root principal) no
         * SEI 5 multi-root. Identifica pela aria-label fornecida pelo
         * template do SEI. Fallback: editable de maior childCount.
         */
        getBodyContainer: function (_editor) {
            var preferido = document.querySelector('.ck-editor__editable_inline[aria-label="Corpo do Texto"]');
            if (preferido) return preferido;
            var editables = Array.prototype.slice.call(document.querySelectorAll('.ck-editor__editable_inline'));
            if (editables.length === 0) return null;
            return editables.reduce(function (acc, el) {
                return (el.childElementCount > (acc ? acc.childElementCount : -1)) ? el : acc;
            }, null);
        },

        /** Busca elementos dentro do corpo do documento. Retorna jQuery. */
        findInBody: function (editor, selector) {
            var body = this.getBodyContainer(editor);
            return (body && window.$) ? $(body).find(selector) : (window.$ ? $() : null);
        },

        /**
         * Adiciona HTML ao final da root que corresponde ao "Corpo do Texto".
         * Usa o model para manter sincronizacao com o editing view (append
         * direto ao DOM seria reconciliado/apagado pelo CK5).
         *
         * Notas:
         *  - editor.model.document.roots eh uma Collection, nao array, entao
         *    usamos Array.from para iterar.
         *  - model.change aninhado eh aceito pelo CK5 e se agrupa em um batch.
         *  - Se nao localizarmos a root do "Corpo do Texto", caimos em
         *    insertHtml na posicao da selecao (fallback).
         */
        appendToBody: function (editor, html) {
            if (!editor) return;
            var bodyEl = this.getBodyContainer(editor);
            var roots = Array.from(editor.model.document.roots || []);
            var targetRoot = null;
            for (var i = 0; i < roots.length; i++) {
                var r = roots[i];
                if (!r || typeof r.isAttached !== 'function') continue;
                if (!r.isAttached() || r.rootName === '$graveyard') continue;
                try {
                    var viewRoot = editor.editing.view.document.getRoot(r.rootName);
                    if (!viewRoot) continue;
                    var domRoot = editor.editing.view.domConverter.mapViewToDom(viewRoot);
                    if (bodyEl && domRoot === bodyEl) { targetRoot = r; break; }
                } catch (e) { /* continua tentando */ }
            }
            if (!targetRoot) {
                // Fallback: insere na posicao da selecao em vez do final do corpo.
                this.insertHtml(editor, html);
                return;
            }
            editor.model.change(function (writer) {
                var position = writer.createPositionAt(targetRoot, 'end');
                var vf = editor.data.processor.toView(html);
                var mf = editor.data.toModel(vf);
                editor.model.insertContent(mf, position);
            });
        },

        /**
         * Transforma o HTML do corpo do documento via funcao recebe(html)->html.
         * Em CK5 multi-root usa editor.data.get/set na rootName do "Corpo do Texto".
         * Nao deve ser chamado dentro de model.change(); se for, adie com setTimeout.
         */
        transformBodyHtml: function (editor, transformFn) {
            if (!editor || typeof transformFn !== 'function') return;
            var bodyEl = this.getBodyContainer(editor);
            if (!bodyEl) return;
            var roots = Array.from(editor.model.document.roots || []);
            var targetRootName = null;
            for (var i = 0; i < roots.length; i++) {
                var r = roots[i];
                if (!r || typeof r.isAttached !== 'function') continue;
                if (!r.isAttached() || r.rootName === '$graveyard') continue;
                try {
                    var viewRoot = editor.editing.view.document.getRoot(r.rootName);
                    if (!viewRoot) continue;
                    var domRoot = editor.editing.view.domConverter.mapViewToDom(viewRoot);
                    if (domRoot === bodyEl) { targetRootName = r.rootName; break; }
                } catch (e) { /* continua */ }
            }
            if (!targetRootName) return;
            var html = editor.data.get({ rootName: targetRootName });
            var newHtml = transformFn(html);
            if (typeof newHtml === 'string' && newHtml !== html) {
                var payload = {};
                payload[targetRootName] = newHtml;
                editor.data.set(payload);
            }
        },

        // --- Primitivas adicionais (migracao CK5) ---

        execCommand: function (editor, command, value) {
            if (!editor || !editor.execute) return;
            var map = {
                bold: 'bold', italic: 'italic', underline: 'underline',
                strike: 'strikethrough', strikethrough: 'strikethrough',
                subscript: 'subscript', superscript: 'superscript',
                removeFormat: 'removeFormat'
            };
            var cmd = map[command] || command;
            try { editor.execute(cmd, value !== undefined ? { value: value } : undefined); } catch (e) {}
        },

        applyStyle: function (editor, styleDef) {
            // CK5: nao ha CKEDITOR.style; mapeia o elemento do estilo para o
            // comando de formatacao equivalente quando possivel.
            if (!editor || !editor.execute || !styleDef) return;
            var el = (styleDef.element || '').toLowerCase();
            var byElement = { strong: 'bold', b: 'bold', em: 'italic', i: 'italic', u: 'underline', s: 'strikethrough', strike: 'strikethrough' };
            if (byElement[el]) { try { editor.execute(byElement[el]); } catch (e) {} }
        },

        getData: function (editor) {
            try {
                var rootName = resolveBodyRootNameCK5(editor);
                return rootName ? editor.data.get({ rootName: rootName }) : editor.data.get();
            } catch (e) { return ''; }
        },

        setData: function (editor, html) {
            try {
                var rootName = resolveBodyRootNameCK5(editor);
                if (rootName) { var p = {}; p[rootName] = html; editor.data.set(p); }
                else editor.data.set(html);
            } catch (e) {}
        },

        // CK5 nao usa elementos DOM no model; delega para a pipeline insertHtml.
        insertElement: function (editor, html) { this.insertHtml(editor, html); },

        saveSelection: function (editor) {
            // Cria um marker no model na posicao da selecao atual e retorna o
            // nome como token. restoreSelection volta o cursor e remove o marker.
            try {
                var name = 'seiProSel_' + (markerSeq++);
                editor.model.change(function (writer) {
                    var range = editor.model.document.selection.getFirstRange();
                    writer.addMarker(name, { range: range, usingOperation: false });
                });
                return name;
            } catch (e) { return null; }
        },

        restoreSelection: function (editor, token) {
            try {
                if (!token) return;
                var marker = editor.model.markers.get(token);
                if (marker) {
                    editor.model.change(function (writer) { writer.setSelection(marker.getRange()); });
                }
                editor.model.change(function (writer) {
                    if (editor.model.markers.has(token)) writer.removeMarker(token);
                });
            } catch (e) {}
        },

        getSelectedText: function (_editor) {
            try { var s = window.getSelection && window.getSelection(); return s ? String(s) : ''; }
            catch (e) { return ''; }
        },

        getSelectedHtml: function (_editor) {
            try {
                var s = window.getSelection && window.getSelection();
                if (!s || s.rangeCount === 0) return '';
                var div = document.createElement('div');
                div.appendChild(s.getRangeAt(0).cloneContents());
                return div.innerHTML;
            } catch (e) { return ''; }
        },

        on: function (editor, evt, fn) {
            if (evt === 'change') { try { editor.model.document.on('change:data', fn); } catch (e) {} return; }
            var body = this.getBodyContainer(editor);
            if (body) body.addEventListener(evt, fn);
        },

        off: function (editor, evt, fn) {
            if (evt === 'change') { try { editor.model.document.off('change:data', fn); } catch (e) {} return; }
            var body = this.getBodyContainer(editor);
            if (body) body.removeEventListener(evt, fn);
        },

        fire: function (editor, evt, data) {
            // CK5 nao tem snapshot manual; expoe so eventos DOM no editable.
            var body = this.getBodyContainer(editor);
            if (body && typeof CustomEvent !== 'undefined') {
                try { body.dispatchEvent(new CustomEvent(evt, { detail: data })); } catch (e) {}
            }
        },

        addContextMenu: function (editor, builder) {
            attachDomContextMenu(this.getBodyContainer(editor), editor, builder);
        }
    };

    // ================================================================
    // Facade publica - delega para o backend ativo.
    // ================================================================
    var backend = null;

    function resolveBackend() {
        if (backend) return backend;
        var v = detectVersion();
        if (v === 5) backend = BackendCK5;
        else if (v === 4) backend = BackendCK4;
        return backend;
    }

    window.SeiProEditorAdapter = {
        /** Retorna 4, 5 ou 0 (indeterminado). */
        get version() {
            var b = resolveBackend();
            return b ? b.version : 0;
        },

        /** Aguarda o editor estar pronto (Promise). */
        waitReady: function (timeoutMs) {
            // Em alguns casos o backend nao foi resolvido ainda porque
            // a pagina esta entre CK4 e CK5 em carregamento. Poll ate que
            // algum sinal apareca.
            var self = this;
            var start = Date.now();
            var limit = timeoutMs || 15000;
            return new Promise(function (resolve, reject) {
                (function poll() {
                    var b = resolveBackend();
                    if (b) return b.waitReady(limit).then(resolve, reject);
                    if (Date.now() - start > limit) {
                        return reject(new Error('Editor nao detectado (nem CK4 nem CK5)'));
                    }
                    setTimeout(poll, 200);
                })();
            });
        },

        getInstance: function (ref) { var b = resolveBackend(); return b ? b.getInstance(ref) : null; },
        getAllInstances: function () { var b = resolveBackend(); return b ? b.getAllInstances() : []; },

        focus: function (editor) { var b = resolveBackend(); return b && b.focus(editor); },
        saveSnapshot: function (editor) { var b = resolveBackend(); return b && b.saveSnapshot(editor); },
        withEdit: function (editor, fn) { var b = resolveBackend(); return b && b.withEdit(editor, fn); },

        insertHtml: function (editor, html) { var b = resolveBackend(); return b && b.insertHtml(editor, html); },
        insertHtmlBefore: function (editor, referenceEl, html) {
            var b = resolveBackend();
            return b && b.insertHtmlBefore(editor, referenceEl, html);
        },

        getSelectionElement: function (editor) { var b = resolveBackend(); return b ? b.getSelectionElement(editor) : null; },
        getSelectionParagraph: function (editor) { var b = resolveBackend(); return b ? b.getSelectionParagraph(editor) : null; },

        getToolbarContainer: function (editor) { var b = resolveBackend(); return b ? b.getToolbarContainer(editor) : null; },

        insertText: function (editor, text) { var b = resolveBackend(); return b && b.insertText(editor, text); },
        getBodyContainer: function (editor) { var b = resolveBackend(); return b ? b.getBodyContainer(editor) : null; },
        findInBody: function (editor, selector) {
            var b = resolveBackend();
            return b ? b.findInBody(editor, selector) : (window.$ ? $() : null);
        },
        appendToBody: function (editor, html) { var b = resolveBackend(); return b && b.appendToBody(editor, html); },
        transformBodyHtml: function (editor, fn) { var b = resolveBackend(); return b && b.transformBodyHtml(editor, fn); },

        // --- Primitivas adicionais (migracao CK5) ---
        execCommand: function (editor, command, value) { var b = resolveBackend(); return b && b.execCommand(editor, command, value); },
        applyStyle: function (editor, styleDef) { var b = resolveBackend(); return b && b.applyStyle(editor, styleDef); },
        getData: function (editor) { var b = resolveBackend(); return b ? b.getData(editor) : ''; },
        setData: function (editor, html) { var b = resolveBackend(); return b && b.setData(editor, html); },
        insertElement: function (editor, html) { var b = resolveBackend(); return b && b.insertElement(editor, html); },
        saveSelection: function (editor) { var b = resolveBackend(); return b ? b.saveSelection(editor) : null; },
        restoreSelection: function (editor, token) { var b = resolveBackend(); return b && b.restoreSelection(editor, token); },
        getSelectedText: function (editor) { var b = resolveBackend(); return b ? b.getSelectedText(editor) : ''; },
        getSelectedHtml: function (editor) { var b = resolveBackend(); return b ? b.getSelectedHtml(editor) : ''; },
        on: function (editor, evt, fn) { var b = resolveBackend(); return b && b.on(editor, evt, fn); },
        off: function (editor, evt, fn) { var b = resolveBackend(); return b && b.off(editor, evt, fn); },
        fire: function (editor, evt, data) { var b = resolveBackend(); return b && b.fire(editor, evt, data); },
        addContextMenu: function (editor, builder) { var b = resolveBackend(); return b && b.addContextMenu(editor, builder); },

        /** Dialogo jQuery UI agnostico de versao (substitui CKEDITOR.dialog). */
        openDialog: openDialog,

        /** Registry de features dos modulos (js/modules/editor/). */
        registerFeature: registerFeature,
        getFeatures: getFeatures,

        /** Lista canonica e loader dos modulos de feature. */
        MODULES: MODULES,
        loadModules: loadModules,
        resolveExtBase: resolveExtBase,

        /** Uso interno / debug: forca re-deteccao. */
        _redetect: function () { backend = null; return resolveBackend(); }
    };

    // Log discreto para ajudar diagnostico quando carregado.
    if (typeof console !== 'undefined' && console.log) {
        console.log('%c[SEIPro/Adapter]', 'color:#3f51b5;font-weight:bold;', 'carregado (vers\u00E3o detectada:', window.SeiProEditorAdapter.version, ')');
    }

    // Auto-carrega os modulos de feature no mundo da pagina. Faz poll por
    // URL_SPRO/jQuery (que sao definidos por outros scripts da extensao logo
    // apos o adapter) por ate ~10s.
    (function startModuleLoad(tries) {
        if (loadModules()) return;
        if (tries <= 0) {
            if (typeof console !== 'undefined' && console.warn) {
                console.warn('[SEIPro/Adapter] base da extens\u00E3o n\u00E3o resolvida; m\u00F3dulos n\u00E3o carregados');
            }
            return;
        }
        setTimeout(function () { startModuleLoad(tries - 1); }, 200);
    })(50);
})();
