/**
 * SEI Pro - Editor / Infra: libera classes, estilos e atributos no CKEditor 5
 *
 * PROBLEMA
 * --------
 * O CK5 do SEI 5 descarta, no upcast, tudo o que o schema nao conhece: style
 * inline, atributos data-*, title/contenteditable e classes que nao estejam na
 * lista de estilos do documento. Pior: o plugin Estilo do SEI
 * (infra_js/editor/ck5/estilo.js) tem um downcast que, ao converter o atributo
 * "estilo" do paragrafo, REMOVE todas as classes da view e deixa apenas a do
 * estilo:
 *
 *     t.on('attribute:estilo:paragraph', (evt, data, conv) => {
 *         for (const c of viewP.getClassNames()) conv.writer.removeClass(c, viewP);
 *         conv.writer.addClass(estilo, viewP);
 *     }, { priority: 'low' });
 *
 * Por isso <p class="Texto_Justificado imgBgAncora"> volta sempre como
 * <p class="Texto_Justificado"> -- e liberar o General HTML Support sozinho
 * nao resolve, porque o conversor do Estilo roda depois e limpa.
 *
 * O QUE ESTE MODULO FAZ
 * ---------------------
 * 1. Libera no DataFilter (GHS) as tags/classes/estilos/atributos que as
 *    features da extensao precisam preservar (ancora .imgBgAncora, marca
 *    d'agua, tabelas com estilo proprio, <style> de @page/@media print, etc).
 * 2. Registra um downcast de prioridade 'lowest' que roda DEPOIS do conversor
 *    do Estilo e devolve ao <p> as classes extras guardadas pelo GHS no model,
 *    removendo classes de estilo obsoletas (o usuario pode ter trocado o
 *    estilo do paragrafo pela toolbar).
 * 3. Expoe window.SeiProGhs para os demais modulos aplicarem classe/estilo/
 *    atributo pelo model (nunca por mutacao de DOM, que o CK5 ignora).
 *
 * TIMING
 * ------
 * Quando allowElement/allowAttributes sao chamados apos a carga dos dados, o
 * DataFilter so registra as regras no proximo editor.data.set() (ele agenda um
 * data.once('set')). aplicarRegras() faz esse ciclo com o proprio conteudo
 * atual e devolve o documento ao estado "sem alteracoes" via Salvar.resetDirty(),
 * para o botao Salvar do SEI nao comecar piscando sem o usuario ter tocado em
 * nada. Defina window.SEIPRO_GHS_AUTO = false para pular a ativacao automatica.
 *
 * Em CK4 o modulo e no-op: o allowedContent de la ja e permissivo.
 */
(function () {
    'use strict';

    // Lista fechada de proposito: script/iframe/object/form ficam de fora para
    // nao ampliar a superficie do que entra no documento do SEI.
    var TAGS = /^(p|span|a|div|section|font|strong|b|em|i|u|s|strike|sub|sup|br|hr|img|style|table|thead|tbody|tfoot|tr|td|th|caption|colgroup|col|ul|ol|li|dl|dt|dd|blockquote|pre|code|h1|h2|h3|h4|h5|h6)$/;

    // attributes/classes/styles: true e a forma documentada do GHS para
    // "permitir tudo" nos elementos casados por name.
    var REGRA = { name: TAGS, attributes: true, classes: true, styles: true };

    function log(msg, extra) {
        if (typeof console === 'undefined' || !console.log) return;
        console.log('%c[SEIPro/GHS]', 'color:#3f51b5;font-weight:bold;', msg, extra === undefined ? '' : extra);
    }

    function plugin(editor, nome) {
        try {
            return (editor && editor.plugins && editor.plugins.has(nome)) ? editor.plugins.get(nome) : null;
        } catch (e) { return null; }
    }

    function ck5(editor) {
        return !!(editor && editor.model && editor.editing && editor.conversion);
    }

    // Mapa de estilos do SEI (Texto_Justificado, Tabela_Texto_..., etc).
    function estilosDoSei(editor) {
        var ee = plugin(editor, 'EstiloEditing');
        return (ee && ee.estilos) ? ee.estilos : {};
    }

    function ehEstilo(estilos, classe) {
        return Object.prototype.hasOwnProperty.call(estilos, classe);
    }

    // Nome do atributo do GHS para uma tag ('p' -> 'htmlPAttributes').
    function attrGhs(editor, tag) {
        var ghs = plugin(editor, 'GeneralHtmlSupport');
        if (ghs && typeof ghs.getGhsAttributeNameForElement === 'function') {
            try { return ghs.getGhsAttributeNameForElement(tag); } catch (e) {}
        }
        return 'html' + tag.charAt(0).toUpperCase() + tag.slice(1) + 'Attributes';
    }

    function classesDoModel(item, attrName) {
        var valor = (item && item.getAttribute) ? item.getAttribute(attrName) : null;
        var classes = valor && valor.classes;
        if (!classes) return [];
        return Array.isArray(classes) ? classes.slice() : Object.keys(classes);
    }

    // ----------------------------------------------------------------
    // Downcast corretivo: roda em 'lowest', depois do conversor do Estilo.
    // ----------------------------------------------------------------
    function sincronizarClasses(editor, item, conversionApi) {
        if (!item || !item.is || !item.is('element')) return;
        var viewEl = conversionApi.mapper.toViewElement(item);
        if (!viewEl) return;

        var estilos = estilosDoSei(editor);
        var estiloAtual = item.getAttribute('estilo');
        var extras = classesDoModel(item, attrGhs(editor, 'p'));
        var writer = conversionApi.writer;

        var atuais = [];
        try { atuais = Array.from(viewEl.getClassNames()); } catch (e) {}

        // Classe de estilo antiga que sobrou de uma troca de estilo.
        atuais.forEach(function (classe) {
            if (classe !== estiloAtual && ehEstilo(estilos, classe)) writer.removeClass(classe, viewEl);
        });

        // Classes da extensao que o conversor do Estilo apagou.
        extras.forEach(function (classe) {
            if (!ehEstilo(estilos, classe)) writer.addClass(classe, viewEl);
        });

        if (estiloAtual) writer.addClass(estiloAtual, viewEl);
    }

    function registrarConversor(editor) {
        if (editor.__seiProGhsConversor) return;
        editor.__seiProGhsConversor = true;

        // Os dois eventos: a ordem em que o CK5 converte os atributos de um
        // mesmo item nao e garantida, entao corrigimos nos dois pontos (a
        // funcao e idempotente).
        var eventos = [
            'attribute:estilo:paragraph',
            'attribute:' + attrGhs(editor, 'p') + ':paragraph'
        ];

        editor.conversion.for('downcast').add(function (dispatcher) {
            eventos.forEach(function (evento) {
                dispatcher.on(evento, function (evt, data, conversionApi) {
                    try { sincronizarClasses(editor, data.item, conversionApi); } catch (e) {}
                }, { priority: 'lowest' });
            });
        });
    }

    // ----------------------------------------------------------------
    // Liberacao propriamente dita (idempotente por instancia).
    // ----------------------------------------------------------------
    function liberar(editor) {
        editor = editor || SeiProEditorAdapter.getInstance();
        if (!ck5(editor)) return false;
        if (editor.__seiProGhsLiberado) return true;

        var df = plugin(editor, 'DataFilter');
        if (!df) { log('DataFilter (GHS) ausente neste editor; nada a liberar'); return false; }

        try {
            df.allowElement(REGRA);
            df.allowAttributes(REGRA);
        } catch (e) {
            log('falha ao liberar o GHS', e);
            return false;
        }

        editor.__seiProGhsLiberado = true;
        registrarConversor(editor);
        return true;
    }

    // Documento com comentarios: o data.set completo reancora os comentarios
    // pelos ids data-c. Nesse caso nao reprocessamos sozinhos -- as regras
    // ficam pendentes e entram no primeiro data.set da propria extensao
    // (transformBodyHtml/setData do adapter).
    function temComentarios(editor) {
        try {
            var markers = Array.from(editor.model.markers);
            for (var i = 0; i < markers.length; i++) {
                if (/coment/i.test(markers[i].name)) return true;
            }
        } catch (e) {}
        return false;
    }

    /**
     * Executa fn e devolve o documento ao estado de "alterado" que ele tinha
     * antes. Correcoes automaticas feitas na abertura do documento passam por
     * aqui: sem isso o botao Salvar do SEI comeca piscando sozinho, como se o
     * usuario tivesse editado alguma coisa.
     */
    function semSujar(fn, editor) {
        editor = editor || SeiProEditorAdapter.getInstance();
        var salvar = plugin(editor, 'Salvar');
        var sujoAntes = salvar ? !!salvar.isDirty : false;
        try {
            fn();
        } finally {
            if (salvar && !sujoAntes) {
                try { salvar.resetDirty(); } catch (e) {}
            }
        }
    }

    function aplicarRegras(editor) {
        editor = editor || SeiProEditorAdapter.getInstance();
        if (!liberar(editor)) return false;
        if (typeof editor.getFullData !== 'function') return false;

        var ok = true;
        semSujar(function () {
            try {
                editor.data.set(editor.getFullData());
            } catch (e) {
                log('falha ao reprocessar o conteudo', e);
                ok = false;
            }
        }, editor);
        return ok;
    }

    // ----------------------------------------------------------------
    // API para os demais modulos: aplica classe/estilo/atributo pelo MODEL.
    // alvo aceita elemento do DOM (dentro do editable), objeto jQuery,
    // elemento do model, ou nada (usa o paragrafo da selecao).
    // ----------------------------------------------------------------
    function resolverModel(editor, alvo) {
        try {
            if (!alvo) alvo = SeiProEditorAdapter.getSelectionParagraph(editor);
            if (!alvo) return null;
            if (typeof alvo.is === 'function' && alvo.is('element')) return alvo;
            if (alvo.jquery) alvo = alvo.get(0);
            if (!alvo || alvo.nodeType !== 1) return null;
            var view = editor.editing.view.domConverter.mapDomToView(alvo);
            return view ? editor.editing.mapper.toModelElement(view) : null;
        } catch (e) { return null; }
    }

    function tagDoModel(editor, item) {
        try {
            var view = editor.editing.mapper.toViewElement(item);
            return view ? view.name : null;
        } catch (e) { return null; }
    }

    function comGhs(editor, alvo, fn) {
        editor = editor || SeiProEditorAdapter.getInstance();
        if (!liberar(editor)) return false;
        var ghs = plugin(editor, 'GeneralHtmlSupport');
        var item = resolverModel(editor, alvo);
        var tag = item ? tagDoModel(editor, item) : null;
        if (!ghs || !item || !tag) return false;
        try { fn(ghs, tag, item); return true; } catch (e) { log('falha ao aplicar no model', e); return false; }
    }

    window.SeiProGhs = {
        /** Libera o GHS na instancia (idempotente). */
        liberar: liberar,

        /** Forca a ativacao das regras reprocessando o conteudo atual. */
        aplicarRegras: aplicarRegras,

        /** Roda fn preservando o estado "sem alteracoes" do documento. */
        semSujar: semSujar,

        estaLiberado: function (editor) {
            editor = editor || SeiProEditorAdapter.getInstance();
            return !!(editor && editor.__seiProGhsLiberado);
        },

        addClasse: function (alvo, classes, editor) {
            return comGhs(editor, alvo, function (ghs, tag, item) {
                ghs.addModelHtmlClass(tag, classes, item);
            });
        },

        removeClasse: function (alvo, classes, editor) {
            return comGhs(editor, alvo, function (ghs, tag, item) {
                ghs.removeModelHtmlClass(tag, classes, item);
            });
        },

        setEstilos: function (alvo, estilos, editor) {
            return comGhs(editor, alvo, function (ghs, tag, item) {
                ghs.setModelHtmlStyles(tag, estilos, item);
            });
        },

        setAtributos: function (alvo, atributos, editor) {
            return comGhs(editor, alvo, function (ghs, tag, item) {
                ghs.setModelHtmlAttributes(tag, atributos, item);
            });
        }
    };

    if (window.SeiProEditorAdapter && SeiProEditorAdapter.registerFeature) {
        SeiProEditorAdapter.registerFeature({ id: 'ghs-unlock' });
    }

    // Boot: libera assim que o editor estiver pronto.
    if (window.SeiProEditorAdapter && SeiProEditorAdapter.waitReady) {
        SeiProEditorAdapter.waitReady(20000).then(function (editor) {
            if (SeiProEditorAdapter.version !== 5) return; // CK4 ja e permissivo
            editor = editor || SeiProEditorAdapter.getInstance();
            if (!liberar(editor)) return;

            if (window.SEIPRO_GHS_AUTO === false || temComentarios(editor)) {
                log('regras liberadas (ativacao no pr\u00F3ximo data.set)');
                return;
            }

            if (aplicarRegras(editor)) log('classes, estilos e atributos liberados no editor');
        })['catch'](function () {});
    }
})();
