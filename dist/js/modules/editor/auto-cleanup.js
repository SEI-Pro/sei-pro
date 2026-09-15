/**
 * SEI Pro - Editor / Feature: Limpeza automatica de HTML (auto-cleanup)
 *
 * O SEI 5 recusa "Documento possui conteudo nao permitido" quando o HTML traz
 * residuos de editor (wrapper/atributos do CKEditor, marcadores {cke_protected})
 * ou de extensoes do navegador (Dark Reader, servicos de copia), alem de cores
 * em rgb()/rgba() -- o SEI 5 so aceita hexadecimal. Esta rotina remove o lixo e
 * converte as cores. Roda automaticamente na colagem e antes do salvamento, e
 * tambem pode ser chamada sob demanda via limparEditorPro().
 *
 * PORTADO de CK4 para CK5:
 *  - A versao antiga usava editor.on('paste') (mutando evt.data.dataValue) e
 *    editor.on('getData') (passada final no conteudo que o SEI serializa ao
 *    salvar). No CK5 NAO existe o evento 'getData' nem o 'paste' do CKEditor
 *    com evt.data.dataValue; o editor.getData()/setData() tambem mudaram para
 *    a API multi-root.
 *  - Estrategia agnostica de versao via SeiProEditorAdapter:
 *      (a) COLAGEM: SeiProEditorAdapter.on(ed, 'paste', fn). No CK4 o adapter
 *          encaminha para o evento nativo do editor (evt.data.dataValue ainda
 *          existe e e limpo in-place). No CK5 'paste' e um evento DOM no
 *          editable que dispara ANTES da insercao; nao da para reescrever o
 *          HTML colado in-place dali, entao agendamos uma limpeza pos-colagem
 *          via transformBodyHtml (corpo do texto) no proximo tick.
 *      (b) SALVAR, CK5: filtro na SAIDA de dados (evento 'get' do
 *          editor.data, que o getFullData do SEI usa ao salvar). O model e a
 *          vista nao sao tocados (ver registrarFiltroSaidaCK5Pro). A limpeza
 *          por data.set no 'change'/colagem/Salvar (abaixo) fica so para um
 *          editor sem esse evento.
 *      (b) SALVAR, CK4: filtro na SAIDA do editor (htmlFilter do CKEditor 4),
 *          que e o HTML que o SEI grava. O DOM vivo do editor nao e tocado:
 *          reescrever o body do iframe jogava o cursor para o inicio do
 *          documento, tirava o contenteditable dos links do SEI e as classes
 *          de contraste do modo escuro. contenteditable e conteudo legitimo no
 *          CK4 (ver ATRIBUTOS_PRESERVADOS_CK4_PRO).
 *      limparEditorPro() faz a limpeza sob demanda usando getData/setData do
 *      adapter.
 *
 * Funcoes/vars deste modulo (movidas do monolito):
 *  ATRIBUTOS_LIXO_PRO, PREFIXOS_ATRIBUTO_LIXO_PRO, PREFIXOS_CLASSE_LIXO_PRO,
 *  precisaLimparEditorPro, rgbParaHexPro, limparRaizEditorPro,
 *  limparHtmlEditorPro, limparEditorPro, registrarLimpezaAutomaticaPro.
 *
 * Helpers que PERMANECEM no monolito / outros arquivos (compartilhados):
 *  rgbToHex (sei-functions-pro.js), enableButtonSavePro (sei-functions-pro.js).
 *
 * Acentos escritos normalmente (a pipeline escapa para \uXXXX). Ver README.md.
 */
(function () {
    'use strict';

    // ----------------------------------------------------------------
    // Tabelas de "lixo" (residuos de editor / extensoes) -- globais, pois o
    // monolito as expunha como globais e a heuristica abaixo as referencia.
    // ----------------------------------------------------------------

    // Atributos que nunca devem ir no conteudo salvo (nome exato)
    window.ATRIBUTOS_LIXO_PRO = [
        'contenteditable', 'spellcheck', 'data-editor',
        'data-processed', 'data-complete', 'data-hveid'
    ];
    // ... e por prefixo (data-cke-saved-src/href, data-sfc-*, data-copy-service-*)
    window.PREFIXOS_ATRIBUTO_LIXO_PRO = ['data-cke-saved-', 'data-sfc-', 'data-copy-service'];
    // Classes a remover (residuos do CKEditor e do realce de contraste do dark mode)
    window.PREFIXOS_CLASSE_LIXO_PRO = ['cke_', 'dark-mode-'];
    // Atributos da lista acima que sao conteudo LEGITIMO e nao podem ser limpos.
    // contenteditable: o proprio SEI (3.x, 4.x e o CK4 do SEI 5) grava o link para protocolo como
    // <span contenteditable="false"><a class="ancora_sei">, e o SEI Pro usa o atributo no Bloquear
    // Edicao, na Legistica, no sigilo e na citacao. Vale tambem no CK5: o GHS do proprio SEI 5 libera
    // contenteditable="false" em p/table/li (htmlSupport.allow), e a limpeza tirava o bloqueio do
    // paragrafo 2 s depois de qualquer edicao. (O nome ..._CK4_PRO fica por compatibilidade.)
    window.ATRIBUTOS_PRESERVADOS_CK4_PRO = ['contenteditable'];

    // Atributos que a limpeza deve preservar nesta instancia (CK4 e CK5).
    function atributosPreservadosPro(editor) {
        return window.ATRIBUTOS_PRESERVADOS_CK4_PRO;
    }
    function preservaAtributoPro(preservar, nome) {
        return !!(preservar && preservar.indexOf(nome) !== -1);
    }

    // ----------------------------------------------------------------
    // Helper compartilhado em outro arquivo (sei-functions-pro.js). Em tempo de
    // clique/colagem ja existe; mantemos um fallback trivial para nao quebrar
    // caso seja chamado cedo demais.
    // ----------------------------------------------------------------
    function rgbToHexSafe(r, g, b) {
        if (typeof window.rgbToHex === 'function') return rgbToHex(r, g, b);
        var hex = function (n) { var s = (n & 255).toString(16); return s.length === 1 ? '0' + s : s; };
        return '#' + hex(r) + hex(g) + hex(b);
    }

    // ----------------------------------------------------------------
    // Limpeza pura (DOM/string) -- agnostica de versao do editor.
    // ----------------------------------------------------------------

    // Heuristica barata: so vale a pena parsear/limpar se houver indicio de lixo.
    // preservar (opcional): atributos que nao contam como lixo (ver atributosPreservadosPro).
    // Atributo de evento (on*) ou URL com esquema executavel dentro de uma tag: nunca vai para o HTML gravado.
    var ATRIBUTO_PERIGOSO_PRO = /<[^>]*\s(on[a-z]+\s*=|(href|src|srcset|action|formaction|background|poster|lowsrc|dynsrc|data|xlink:href)\s*=\s*["']?[\s\u0000-\u0020]*(javascript|vbscript|livescript|data\s*:\s*text\/html))/i;
    var URL_PERIGOSA_PRO = /^[\s\u0000-\u0020]*(javascript|vbscript|livescript|data\s*:\s*text\/html)/i;
    var ATRIBUTOS_URL_PRO = /^(href|src|srcset|action|formaction|background|poster|lowsrc|dynsrc|data|xlink:href)$/i;
    window.precisaLimparEditorPro = function (html, preservar) {
        if (/rgba?\(|cke_protected|data-cke-saved|data-sfc|data-copy-service|data-hveid|dark-mode-|\sspellcheck|\bcke_/i.test(html)) return true;
        if (ATRIBUTO_PERIGOSO_PRO.test(html)) return true;
        return !preservaAtributoPro(preservar, 'contenteditable') && /\scontenteditable/i.test(html);
    };

    // Converte todo rgb()/rgba() de uma string para #rrggbb (reusa rgbToHex global).
    // Aceita a sintaxe com virgulas, rgb(206, 206, 206), e a com espacos do CSS Color 4,
    // rgb(206 206 206) e rgb(206 206 206 / 50%) -- esta usada no modelo da certidao.
    // O rgb() nao pode ficar (o validador do SEI 5 so aceita cor em hexadecimal), mas o alfa nao pode sumir:
    // alfa 0 vira "transparent" (antes virava preto opaco) e alfa entre 0 e 1 vira a cor ja composta sobre o
    // branco do documento (rgba(0,0,0,.05) -> #f2f2f2, e nao #000000). Sem alfa, ou alfa >= 1: #rrggbb direto.
    window.rgbParaHexPro = function (texto) {
        if (!texto) return texto;
        return texto.replace(/rgba?\(\s*(\d+)(?:\s*,\s*|\s+)(\d+)(?:\s*,\s*|\s+)(\d+)\s*(?:[,\/]\s*([\d.]+)(%?)\s*)?\)/gi,
            function (m, r, g, b, alfa, pct) {
                r = parseInt(r, 10); g = parseInt(g, 10); b = parseInt(b, 10);
                var a = alfa ? parseFloat(alfa) / (pct ? 100 : 1) : 1;
                if (isNaN(a) || a >= 1) return rgbToHexSafe(r, g, b);
                if (a <= 0) return 'transparent';
                var sobreBranco = function (c) { return Math.round(a * c + (1 - a) * 255); };
                return rgbToHexSafe(sobreBranco(r), sobreBranco(g), sobreBranco(b));
            });
    };

    // Limpa, in-place, um no raiz (Element ou Document) e todos os descendentes.
    window.limparRaizEditorPro = function (raiz, preservar) {
        var docRef = raiz.ownerDocument || raiz;

        // 1) Comentarios residuais (marcadores {cke_protected} do CKEditor)
        var it = docRef.createNodeIterator(raiz, NodeFilter.SHOW_COMMENT, null);
        var comentarios = [], no;
        while ((no = it.nextNode())) {
            if (/cke_protected/.test(no.nodeValue)) comentarios.push(no);
        }
        comentarios.forEach(function (c) { if (c.parentNode) c.parentNode.removeChild(c); });

        // 2) Atributos, classes e cores de cada elemento
        var elementos = raiz.querySelectorAll('*');
        for (var i = 0; i < elementos.length; i++) {
            var el = elementos[i];

            // 2a) atributos-lixo por nome exato
            for (var a = 0; a < window.ATRIBUTOS_LIXO_PRO.length; a++) {
                if (preservaAtributoPro(preservar, window.ATRIBUTOS_LIXO_PRO[a])) continue;
                if (el.hasAttribute(window.ATRIBUTOS_LIXO_PRO[a])) el.removeAttribute(window.ATRIBUTOS_LIXO_PRO[a]);
            }
            // 2b) atributos-lixo por prefixo (itera copia: removeAttribute muda a colecao)
            var attrs = Array.prototype.slice.call(el.attributes);
            for (var t = 0; t < attrs.length; t++) {
                var nome = attrs[t].name;
                // Atributo de evento e URL com esquema executavel (defesa em profundidade: o GHS do CK5 ja os descarta)
                if (/^on/i.test(nome) || (ATRIBUTOS_URL_PRO.test(nome) && URL_PERIGOSA_PRO.test(attrs[t].value || ''))) { el.removeAttribute(nome); continue; }
                for (var p = 0; p < window.PREFIXOS_ATRIBUTO_LIXO_PRO.length; p++) {
                    if (nome.indexOf(window.PREFIXOS_ATRIBUTO_LIXO_PRO[p]) === 0) { el.removeAttribute(nome); break; }
                }
            }
            // 2c) classes-lixo; remove o atributo class se ficar vazio
            if (el.classList && el.classList.length) {
                var classes = Array.prototype.slice.call(el.classList);
                for (var k = 0; k < classes.length; k++) {
                    for (var pc = 0; pc < window.PREFIXOS_CLASSE_LIXO_PRO.length; pc++) {
                        if (classes[k].indexOf(window.PREFIXOS_CLASSE_LIXO_PRO[pc]) === 0) { el.classList.remove(classes[k]); break; }
                    }
                }
                if (!el.classList.length) el.removeAttribute('class');
            }
            // 2d) cores rgb()/rgba() -> hex no style inline
            var style = el.getAttribute('style');
            if (style && /rgba?\(/i.test(style)) el.setAttribute('style', window.rgbParaHexPro(style));
        }
        return raiz;
    };

    // Versao string: recebe HTML, devolve HTML limpo (desembrulhando o <body>).
    window.limparHtmlEditorPro = function (html, preservar) {
        if (typeof html !== 'string' || html === '' || !window.precisaLimparEditorPro(html, preservar)) return html;
        var doc = new DOMParser().parseFromString(html, 'text/html');
        window.limparRaizEditorPro(doc.body, preservar);
        return doc.body.innerHTML;
    };

    // ----------------------------------------------------------------
    // Limpeza sob demanda e automatica, roteadas pelo adapter.
    // ----------------------------------------------------------------

    // Aplica a limpeza a uma instancia (getData -> limpa -> setData via adapter).
    // Retorna true se algo mudou; reabilita o botao Salvar nesse caso.
    window.limparEditorPro = function (editor) {
        editor = editor || SeiProEditorAdapter.getInstance();
        if (!editor) return false;
        var original = SeiProEditorAdapter.getData(editor);
        var limpo = window.limparHtmlEditorPro(original, atributosPreservadosPro(editor));
        if (limpo === original) return false;
        SeiProEditorAdapter.setData(editor, limpo);
        if (typeof window.enableButtonSavePro === 'function') enableButtonSavePro();
        return true;
    };

    // Limpa o "Corpo do Texto" in-place via transformBodyHtml (passada final
    // antes do salvamento). Guarda de reentrancia evita laco com o 'change'.
    function limparCorpoPro(editor) {
        if (!editor || editor._limpezaProEmAndamento) return;
        editor._limpezaProEmAndamento = true;
        try {
            SeiProEditorAdapter.transformBodyHtml(editor, function (html) {
                return window.limparHtmlEditorPro(html, atributosPreservadosPro(editor));
            });
        } catch (e) { /* silencioso: limpeza e best-effort */ }
        // Libera o guard no proximo tick para nao reentrar no mesmo lote de
        // mutacoes que o transformBodyHtml acabou de gerar.
        setTimeout(function () { editor._limpezaProEmAndamento = false; }, 0);
    }

    // CK4: limpa so a SAIDA do editor (getData, o que o SEI grava), com o htmlFilter do proprio
    // CKEditor 4 -- a serializacao continua a do CK4 (entidades, quebras de linha). O DOM vivo fica
    // intacto. O CK4 ja tira sozinho as classes cke_* e converte os data-cke-saved-* da saida, entao
    // esses ficam por conta dele. Retorna false se a instancia nao tiver htmlFilter.
    function registrarFiltroSaidaCK4Pro(editor) {
        var dp = editor.dataProcessor;
        if (!dp || !dp.htmlFilter || typeof dp.htmlFilter.addRules !== 'function') return false;
        var preservar = atributosPreservadosPro(editor);
        dp.htmlFilter.addRules({
            elements: {
                $: function (el) {
                    var attrs = el.attributes, nome, p;
                    if (!attrs) return;
                    for (nome in attrs) {
                        if (!Object.prototype.hasOwnProperty.call(attrs, nome) || preservaAtributoPro(preservar, nome)) continue;
                        if (window.ATRIBUTOS_LIXO_PRO.indexOf(nome) !== -1) { delete attrs[nome]; continue; }
                        for (p = 0; p < window.PREFIXOS_ATRIBUTO_LIXO_PRO.length; p++) {
                            var prefixo = window.PREFIXOS_ATRIBUTO_LIXO_PRO[p];
                            if (prefixo !== 'data-cke-saved-' && nome.indexOf(prefixo) === 0) { delete attrs[nome]; break; }
                        }
                    }
                    if (typeof attrs['class'] === 'string') {
                        var classes = attrs['class'].split(/\s+/).filter(function (c) {
                            if (!c) return false;
                            for (var k = 0; k < window.PREFIXOS_CLASSE_LIXO_PRO.length; k++) {
                                if (c.indexOf(window.PREFIXOS_CLASSE_LIXO_PRO[k]) === 0) return false;
                            }
                            return true;
                        });
                        if (classes.length) attrs['class'] = classes.join(' '); else delete attrs['class'];
                    }
                    if (typeof attrs.style === 'string' && /rgba?\(/i.test(attrs.style)) attrs.style = window.rgbParaHexPro(attrs.style);
                }
            }
        }, { applyToAll: true });
        return true;
    }

    // CK5: mesmo principio do CK4 -- limpa so a SAIDA de dados (editor.data.get, que o getFullData do SEI
    // chama por secao ao salvar), sem tocar no model. A versao anterior reescrevia o Corpo do Texto com
    // data.set 400 ms depois de cada rajada de digitacao em que houvesse "lixo": o cursor ia para o inicio
    // do documento e o resto do que o usuario digitava se perdia. O data.get e decorado no CK5 (evento
    // 'get'); prioridade baixa = depois de o HTML ser montado. Os vai-e-voltas internos do SEI Pro
    // (transformBodyHtml, opcao seiProInterno) ficam de fora, como no filtro do sigilo.
    function registrarFiltroSaidaCK5Pro(editor) {
        if (!editor.data || typeof editor.data.on !== 'function') return false;
        var preservar = atributosPreservadosPro(editor);
        editor.data.on('get', function (evt, args) {
            var opcoes = args && args[0];
            if (opcoes && opcoes.seiProInterno) return;
            if (typeof evt.return === 'string') evt.return = window.limparHtmlEditorPro(evt.return, preservar);
        }, { priority: 'low' });
        return true;
    }

    // Tenta enganchar no botao Salvar do SEI para limpar antes de serializar.
    // Idempotente por instancia. Sem botao conhecido, a limpeza defensiva no
    // 'change' (registrarLimpezaAutomaticaPro) ja mantem o corpo limpo.
    function hookBotaoSalvarPro(editor) {
        if (!window.$ || editor._limpezaProSalvarHook) return;
        editor._limpezaProSalvarHook = true;
        // Seletores cobrem o botao de salvar do CK4 (.cke_button__save) e do
        // CK5/SEI 5 (data-cke-tooltip-text="Salvar" / aria-label Salvar).
        var sel = '.cke_button__save, button[data-cke-tooltip-text*="Salvar"], '
                + 'button[aria-label*="Salvar"], #divInfraBarraComandosSuperior button';
        $(document).on('mousedown.limpezaPro', sel, function () {
            // mousedown dispara antes do click/submit que serializa o conteudo.
            limparCorpoPro(editor);
        });
    }

    // Registra a limpeza AUTOMATICA na instancia: na colagem e como passada
    // final antes do salvamento. Idempotente.
    //
    // CK4: o adapter encaminha 'paste' para o evento nativo do CKEditor, cujo
    //      evt.data.dataValue e limpo in-place (igual ao original). 'change'
    //      mapeia para o model change:data quando ha CK5; em CK4 o adapter usa
    //      o body do iframe -- por isso a limpeza de salvamento usa o hook do
    //      botao + transformBodyHtml.
    // CK5: 'paste' e um evento DOM (pre-insercao); agendamos a limpeza do corpo
    //      no proximo tick; 'change' (model change:data) faz a limpeza
    //      defensiva continua.
    window.registrarLimpezaAutomaticaPro = function (editor) {
        if (!editor || editor._limpezaProRegistrada) return;
        editor._limpezaProRegistrada = true;

        // CK5: filtro na saida de dados, sem reescrever o model (ver registrarFiltroSaidaCK5Pro).
        if (editor.model && registrarFiltroSaidaCK5Pro(editor)) return;

        // CK4 (instancia sem editor.model): colagem + filtro de saida, sem reescrever o body.
        if (!editor.model && registrarFiltroSaidaCK4Pro(editor)) {
            SeiProEditorAdapter.on(editor, 'paste', function (evt) {
                if (evt && evt.data && typeof evt.data.dataValue === 'string') {
                    evt.data.dataValue = window.limparHtmlEditorPro(evt.data.dataValue, atributosPreservadosPro(editor));
                }
            });
            return;
        }

        // (a) Colagem: limpa o HTML que entra.
        SeiProEditorAdapter.on(editor, 'paste', function (evt) {
            // CK4 sem htmlFilter: o adapter entrega o evento nativo do CKEditor com
            // evt.data.dataValue -- limpa in-place antes de cair no editor.
            if (evt && evt.data && typeof evt.data.dataValue === 'string') {
                evt.data.dataValue = window.limparHtmlEditorPro(evt.data.dataValue, atributosPreservadosPro(editor));
                return;
            }
            // CK5: evento DOM (pre-insercao); limpa o corpo apos a colagem
            // assentar no modelo. Dois ticks para garantir que o conteudo ja
            // foi inserido.
            setTimeout(function () { limparCorpoPro(editor); }, 0);
        });

        // (b) Saida de dados / salvamento: como 'getData' nao existe no CK5,
        // usamos (1) hook no botao Salvar e (2) limpeza defensiva em 'change'.
        hookBotaoSalvarPro(editor);

        var limpezaAgendada = false;
        SeiProEditorAdapter.on(editor, 'change', function () {
            if (editor._limpezaProEmAndamento || limpezaAgendada) return;
            limpezaAgendada = true;
            // Coalesce: nao limpa a cada tecla; agenda uma passada apos a rajada.
            setTimeout(function () {
                limpezaAgendada = false;
                var corpo = SeiProEditorAdapter.getData(editor);
                if (typeof corpo === 'string' && window.precisaLimparEditorPro(corpo, atributosPreservadosPro(editor))) {
                    limparCorpoPro(editor);
                }
            }, 400);
        });
    };

    // ----------------------------------------------------------------
    // Bootstrap do wiring automatico.
    //
    // CK4: o monolito ja chama registrarLimpezaAutomaticaPro para cada
    //      instancia dentro de setCKEDITOR_instances -- NAO duplicamos aqui.
    // CK5: nao existe setCKEDITOR_instances; entao este modulo faz o wiring ao
    //      boot, aguardando o editor ficar pronto e registrando na instancia.
    //      registrarLimpezaAutomaticaPro e idempotente (flag
    //      editor._limpezaProRegistrada), entao reentrar e seguro.
    //
    // registerFeature apenas guarda a feature no registry (nao executa init),
    // por isso o bootstrap roda no proprio IIFE.
    // ----------------------------------------------------------------
    function bootstrapCK5Cleanup() {
        if (!window.SeiProEditorAdapter) return;
        try {
            // A versao so e conhecida depois que o editor aparece: checada ANTES do waitReady, dava 0 quando
            // o modulo carregava antes do editable (primeira abertura do documento) e a limpeza nao era
            // registrada. So auto-wire no CK5; no CK4 o monolito cuida disso.
            SeiProEditorAdapter.waitReady(20000).then(function (ed) {
                if (SeiProEditorAdapter.version !== 5) return;
                ed = ed || SeiProEditorAdapter.getInstance();
                if (ed) window.registrarLimpezaAutomaticaPro(ed);
            }, function () { /* editor nao detectado: nada a fazer */ });
        } catch (e) {}
    }

    if (window.SeiProEditorAdapter && SeiProEditorAdapter.registerFeature) {
        SeiProEditorAdapter.registerFeature({ id: 'auto-cleanup' });
    }
    bootstrapCK5Cleanup();
})();
