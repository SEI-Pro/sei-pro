/**
 * SEI Pro - Editor / Feature: Escrita interativa (# campos do processo, @ unidades)
 *
 * Ao digitar "#" o usuario escolhe um dado do processo ou um documento da arvore
 * (citacao com link); ao digitar "@" escolhe uma unidade, que entra como ancora
 * span.interessadoSeiPro[data-id] -- a mesma que o Enviar Processo usa para
 * pre-preencher os destinatarios (setInteressadosSend).
 *
 * Estrutura:
 *   1) NUCLEO (independe do editor)
 *      - detectarGatilho(textoAntesDoCursor): so e gatilho o marcador que abre
 *        palavra (inicio do paragrafo, espaco ou abre-parenteses/aspas antes) e
 *        cuja consulta nao comeca com espaco nem quebra linha. Assim o "@" de um
 *        e-mail e um "#" perdido em outro ponto do paragrafo nao abrem a lista.
 *        O texto analisado e SO o que esta antes do cursor.
 *      - PROVEDORES: '#' (dados do processo + documentos, filtro local) e '@'
 *        (unidades, AJAX do autocompletar do Enviar Processo, com cache e
 *        ordenacao por relevancia da sigla).
 *   2) CK5 (SEI 5): nada de lista propria. O SEI 5 ja traz o plugin Mention com
 *      o marcador '@' (variaveis @ano@ etc.). O modulo:
 *        - soma as unidades ao feed '@' nativo (as variaveis do SEI vem antes);
 *        - registra o marcador '#' no MentionUI e um TextWatcher com os dois
 *          marcadores. Esse watcher e registrado depois do nativo e, quando os
 *          dois casam, a ultima palavra ('#' ou '@') decide (o MentionUI faz
 *          debounce da consulta, e a ultima chamada vence);
 *        - trata a escolha dos itens do SEI Pro com prioridade 'highest', antes
 *          do _buscaInsereConteudoTag do SEI (prioridade 'high'), que para o
 *          evento de QUALQUER item e tentaria buscar o item como variavel.
 *   3) CK4 (SEI 3.1/4): lista propria no documento da pagina (position: fixed,
 *      fora do iframe), para que ela nunca entre no conteudo salvo. O monolito
 *      (onKeyEditorPro) repassa as teclas para ck4Tecla/ck4AoDigitar.
 *
 * Opcao: "escrivainterativa" (verifyConfigValue), lida a cada consulta.
 * Acentos em \uXXXX (ver README).
 */
(function () {
    'use strict';

    var MAX_CONSULTA = 40;
    var MIN_CONSULTA_UNIDADE = 2;
    var LIMITE_CAMPOS = 60;
    var LIMITE_UNIDADES = 30;

    // ================================================================
    // 1) NUCLEO
    // ================================================================
    function ativo() {
        try { return typeof verifyConfigValue === 'function' && !!verifyConfigValue('escrivainterativa'); }
        catch (e) { return false; }
    }

    function normalizar(s) {
        s = String(s || '');
        try { s = s.normalize('NFD').replace(/[\u0300-\u036F]/g, ''); } catch (e) {}
        return s.toLowerCase();
    }

    function htmlParaTexto(html) {
        // DOMParser: documento inerte (nao carrega imagem nem roda handler).
        var d = new DOMParser().parseFromString('<body>' + String(html || '') + '</body>', 'text/html');
        return (d.body.textContent || '').replace(/\s+/g, ' ').trim();
    }

    function escaparHtml(s) {
        return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    // Antes do marcador: inicio, espaco (inclui nbsp) ou abertura de parenteses/colchetes/aspas.
    var ANTES_VALIDO = /[\s\u00A0(\[{"'\u201C\u2018\u00AB]/;

    /**
     * Retorna {marcador, consulta, inicio} para o gatilho que termina no cursor,
     * ou null. texto = conteudo do paragrafo do inicio ate o cursor.
     */
    function detectarGatilho(texto, marcadores) {
        marcadores = marcadores || ['#', '@'];
        texto = String(texto || '');
        var melhor = null;
        marcadores.forEach(function (m) {
            var i = texto.lastIndexOf(m);
            if (i < 0) return;
            if (i > 0 && !ANTES_VALIDO.test(texto.charAt(i - 1))) return;
            var consulta = texto.slice(i + 1);
            if (/[\r\n]/.test(consulta) || /^[\s\u00A0]/.test(consulta) || consulta.length > MAX_CONSULTA) return;
            if (!melhor || i > melhor.inicio) melhor = {marcador: m, consulta: consulta.replace(/\u00A0/g, ' '), inicio: i};
        });
        return melhor;
    }

    // Consulta que nao deve ir para o provedor (CK5: o watcher nativo aceita espaco logo depois do marcador).
    function consultaValida(consulta) {
        return typeof consulta === 'string' && !/^[\s\u00A0]/.test(consulta) && !/[\r\n]/.test(consulta) && consulta.length <= MAX_CONSULTA;
    }

    // ---- Provedor '#': dados do processo e documentos da arvore ----
    function listarCampos() {
        var itens = [];
        var add = function (rotuloHtml, valorHtml, tipo) {
            if (!rotuloHtml || !valorHtml) return;
            var rotulo = htmlParaTexto(rotuloHtml);
            if (!rotulo) return;
            itens.push({rotulo: rotulo, html: String(valorHtml), tipo: tipo, chave: normalizar(rotulo)});
        };
        try {
            if (typeof arrayDadosEditor === 'function') {
                $.each(arrayDadosEditor() || [], function (i, v) { if (v) add(v[0], v[1], 'dado'); });
            }
        } catch (e) { console.warn('[SEIPro] escrita interativa: dados do processo', e && e.message); }
        try {
            var docs = (typeof dadosProcessoPro !== 'undefined' && dadosProcessoPro) ? dadosProcessoPro.listDocumentos : null;
            var citacaoDoc = (typeof getCitacaoDoc === 'function') ? getCitacaoDoc() : '';
            var cita4 = (typeof getConfigValue === 'function' && getConfigValue('citacaodoc') == 'citacaodoc_4');
            var h = (typeof textoParaHtmlPro === 'function') ? textoParaHtmlPro : escaparHtml;
            $.each(docs || [], function (i, v) {
                if (!v || !v.documento) return;
                var nrSei = (v.nr_sei != '') ? v.nr_sei : v.documento;
                var rotulo = (v.nr_sei != '') ? v.documento + ' (' + v.nr_sei + ')' : v.documento;
                var link = '<span contenteditable="false" style="text-indent:0;"><a class="ancoraSei" id="lnkSei' + h(v.id_protocolo) + '" style="text-indent:0;">' + h(nrSei) + '</a></span>';
                var valor = (v.nr_sei != '' || cita4) ? h(String(v.documento).trim()) + '&nbsp;(' + citacaoDoc + link + ')' : link;
                add(h(rotulo), valor, 'documento');
            });
        } catch (e) { console.warn('[SEIPro] escrita interativa: documentos', e && e.message); }
        return itens;
    }

    var provedorCampos = {
        marcador: '#',
        buscar: function (consulta) {
            var q = normalizar(consulta);
            var todos = listarCampos();
            var filtrados = q ? todos.filter(function (it) { return it.chave.indexOf(q) !== -1; }) : todos;
            if (q) {
                filtrados.sort(function (a, b) {
                    var pa = a.chave.indexOf(q) === 0 ? 0 : 1, pb = b.chave.indexOf(q) === 0 ? 0 : 1;
                    return pa - pb;
                });
            }
            return filtrados.slice(0, LIMITE_CAMPOS).map(function (it, i) {
                return {id: '#seipro' + i, text: it.rotulo, seiPro: 'campo', tipo: it.tipo, rotulo: it.rotulo, html: it.html};
            });
        }
    };

    // ---- Provedor '@': unidades (autocompletar do Enviar Processo, exclui a unidade atual) ----
    var cacheUnidades = {};
    function pesquisarUnidades(consulta) {
        var chave = normalizar(consulta);
        if (cacheUnidades[chave]) return Promise.resolve(cacheUnidades[chave]);
        return new Promise(function (resolve) {
            if (typeof getInteressadosProcesso !== 'function') return resolve([]);
            var feito = false;
            var fim = function (r) { if (feito) return; feito = true; resolve(Array.isArray(r) ? r : []); };
            setTimeout(function () { fim([]); }, 10000);
            try { getInteressadosProcesso(consulta, fim); } catch (e) { fim([]); }
        }).then(function (lista) {
            if (lista.length) cacheUnidades[chave] = lista;
            return lista;
        });
    }

    var provedorUnidades = {
        marcador: '@',
        buscar: function (consulta) {
            // Na 1a vez getInteressadosProcesso ainda descobre o link do autocompletar (arvore -> Enviar Processo),
            // o que leva segundos: comeca ja no "@", antes de haver consulta.
            if (consulta === '' && typeof window.linkPesquisaInteressado === 'undefined' && !provedorUnidades._aquecido && typeof getInteressadosProcesso === 'function') {
                provedorUnidades._aquecido = true;
                try { getInteressadosProcesso('', function () {}); } catch (e) {}
            }
            if (!consultaValida(consulta) || consulta.length < MIN_CONSULTA_UNIDADE || consulta.indexOf('@') !== -1) return Promise.resolve([]);
            var q = normalizar(consulta);
            return pesquisarUnidades(consulta).then(function (lista) {
                var itens = lista.filter(function (u) { return u && u.id && u.descricao; }).map(function (u) {
                    var desc = String(u.descricao);
                    var p = desc.indexOf(' - ');
                    var sigla = p > 0 ? desc.slice(0, p) : desc;
                    var nome = p > 0 ? desc.slice(p + 3) : '';
                    var s = normalizar(sigla);
                    var rank = (s === q) ? 0 : (s.indexOf(q) === 0 ? 1 : (s.indexOf(q) !== -1 ? 2 : 3));
                    return {
                        id: '@seipro' + u.id, text: desc, seiPro: 'unidade', rank: rank,
                        idUnidade: String(u.id), sigla: sigla, nome: nome, rotulo: desc,
                        html: '<span class="ancoraSei interessadoSeiPro" data-id="' + escaparHtml(u.id) + '" style="text-indent:0px;">' + escaparHtml(desc) + '</span>'
                    };
                });
                itens.sort(function (a, b) { return a.rank - b.rank || a.sigla.length - b.sigla.length; });
                return itens.slice(0, LIMITE_UNIDADES);
            });
        }
    };

    var PROVEDORES = {'#': provedorCampos, '@': provedorUnidades};

    function buscar(marcador, consulta) {
        var p = PROVEDORES[marcador];
        if (!p || !ativo() || !consultaValida(consulta)) return Promise.resolve([]);
        try { return Promise.resolve(p.buscar(consulta)); } catch (e) { return Promise.resolve([]); }
    }

    // ---- Apresentacao do item (comum a CK4 e CK5) ----
    function elementoItem(item) {
        var el = document.createElement('span');
        el.className = 'seipro-escrita-item seipro-escrita-' + item.seiPro;
        var ic = document.createElement('i');
        ic.className = 'fas ' + (item.seiPro === 'unidade' ? 'fa-building' : (item.tipo === 'documento' ? 'fa-file-alt' : 'fa-hashtag'));
        el.appendChild(ic);
        var tx = document.createElement('span');
        tx.className = 'seipro-escrita-texto';
        if (item.seiPro === 'unidade') {
            var b = document.createElement('b');
            b.textContent = item.sigla;
            tx.appendChild(b);
            if (item.nome) tx.appendChild(document.createTextNode(' \u2014 ' + item.nome));
        } else {
            tx.textContent = item.rotulo;
        }
        tx.title = item.rotulo;
        el.appendChild(tx);
        return el;
    }

    function injetarCss(doc) {
        doc = doc || document;
        if (doc.getElementById('seipro-escrita-css')) return;
        var st = doc.createElement('style');
        st.id = 'seipro-escrita-css';
        st.textContent = ''
            + '.seipro-escrita-item { display: flex !important; align-items: baseline; gap: 7px; max-width: 520px; width: 100%; text-align: left; cursor: pointer; }\n'
            + '.seipro-escrita-item i { width: 14px; flex: none; text-align: center; opacity: .6; font-size: 11px; }\n'
            // O reset do CK5 (.ck-reset_all *) troca a fonte de tudo que esta no balao, inclusive o icone.
            + '.seipro-escrita-item i.fas { font-family: "Font Awesome 5 Pro" !important; font-weight: 900 !important; font-style: normal !important; }\n'
            + '.seipro-escrita-texto { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; min-width: 0; }\n'
            + '.ck.ck-mentions .seipro-escrita-item { padding: 6px 10px; box-sizing: border-box; }\n'
            + '.seipro-escrita-lista { position: fixed; z-index: 99999; min-width: 260px; max-width: 540px; max-height: 300px; overflow-y: auto; margin: 0; padding: 4px 0; list-style: none;'
            + ' background: #fff; border: 1px solid #c4c4c4; border-radius: 3px; box-shadow: 0 2px 8px rgba(0,0,0,.18); font: 13px/1.4 Arial, sans-serif; color: #333; }\n'
            + '.seipro-escrita-lista li { padding: 5px 10px; }\n'
            + '.seipro-escrita-lista li.ativo { background: #3875d7; color: #fff; }\n'
            + '.seipro-escrita-lista li.vazio { color: #888; font-style: italic; cursor: default; }\n'
            + 'html.dark-mode .seipro-escrita-lista { background: #3d3d3d; border-color: #555; color: #fbfbfe; }\n';
        (doc.head || doc.documentElement).appendChild(st);
    }

    // ================================================================
    // 2) CK5 -- integra ao plugin Mention nativo do SEI 5
    // ================================================================
    function instalarCK5(editor) {
        if (!editor || !editor.plugins || !editor.plugins.has('MentionUI')) return false;
        var mui = editor.plugins.get('MentionUI');
        if (mui._seiProEscrita) return true;
        if (!mui._mentionsConfigurations || typeof mui._setupTextWatcher !== 'function' || !mui._mentionsView) {
            console.warn('[SEIPro] escrita interativa: MentionUI sem a API esperada');
            return false;
        }
        injetarCss(document);

        var renderizador = function (anterior) {
            return function (item) {
                if (item && item.seiPro) return elementoItem(item);
                if (typeof anterior === 'function') return anterior(item);
                return item.id;
            };
        };

        // '@': variaveis do SEI (feed nativo) + unidades.
        var cfgArroba = mui._mentionsConfigurations.get('@');
        if (cfgArroba) {
            var feedNativo = cfgArroba.feedCallback;
            cfgArroba.feedCallback = function (consulta) {
                var nativos;
                try { nativos = feedNativo ? feedNativo(consulta) : []; } catch (e) { nativos = []; }
                return Promise.resolve(nativos).then(function (nat) {
                    nat = Array.isArray(nat) ? nat : [];
                    return buscar('@', consulta).then(function (uns) { return nat.concat(uns); });
                });
            };
            cfgArroba.itemRenderer = renderizador(cfgArroba.itemRenderer);
            cfgArroba.dropdownLimit = Math.max(cfgArroba.dropdownLimit || editor.config.get('mention.dropdownLimit') || 10, LIMITE_UNIDADES + 10);
        } else {
            mui._mentionsConfigurations.set('@', {
                marker: '@', feedCallback: function (c) { return buscar('@', c); },
                itemRenderer: renderizador(null), dropdownLimit: LIMITE_UNIDADES
            });
        }

        // '#': campos do processo.
        mui._mentionsConfigurations.set('#', {
            marker: '#', feedCallback: function (c) { return buscar('#', c); },
            itemRenderer: renderizador(null), dropdownLimit: LIMITE_CAMPOS
        });
        mui._setupTextWatcher([{marker: '@', minimumCharacters: 0}, {marker: '#', minimumCharacters: 0}]);

        // Escolha de um item do SEI Pro: troca "#consulta"/"@consulta" pelo HTML do item.
        mui._mentionsView.on('execute', function (evt, data) {
            var item = data && data.item;
            if (!item || !item.seiPro) return;
            evt.stop();
            var model = editor.model;
            var marcador = model.markers.get('mention');
            if (!marcador) return;
            var faixa = model.createRange(model.createPositionAt(marcador.getStart()), model.createPositionAt(model.document.selection.focus));
            mui._hideUIAndRemoveMarker();
            var html = (typeof htmlLinksProtocoloEditorPro === 'function') ? htmlLinksProtocoloEditorPro(item.html, editor) : item.html;
            try {
                model.change(function (writer) {
                    var frag = editor.data.toModel(editor.data.processor.toView(html), '$block');
                    var inserido = model.insertContent(frag, faixa);
                    var espaco = model.insertContent(writer.createText(' '), inserido.end);
                    writer.setSelection(espaco.end);
                });
            } catch (e) {
                console.warn('[SEIPro] escrita interativa: falha ao inserir', e && e.message);
            }
            editor.editing.view.focus();
        }, {priority: 'highest'});

        mui._seiProEscrita = true;
        return true;
    }

    // ================================================================
    // 3) CK4 -- lista propria fora do iframe
    // ================================================================
    var ck4 = {lista: null, itens: [], indice: 0, gatilho: null, editor: null, seq: 0};

    function ck4TextoAntesDoCursor(editor) {
        var sel = editor.getSelection();
        var r = sel && sel.getRanges()[0];
        if (!r || !r.collapsed) return null;
        r = r.clone();
        var path = r.startPath();
        var bloco = path.block || path.blockLimit;
        if (!bloco) return null;
        r.setStartAt(bloco, CKEDITOR.POSITION_AFTER_START);
        return r.cloneContents().$.textContent;
    }

    function ck4Fechar() {
        if (ck4.lista) { ck4.lista.remove(); ck4.lista = null; }
        ck4.itens = []; ck4.indice = 0; ck4.gatilho = null; ck4.seq++;
    }

    function ck4Retangulo(editor) {
        try {
            var win = editor.window.$;
            var s = win.getSelection();
            if (!s || !s.rangeCount) return null;
            var r = s.getRangeAt(0).cloneRange();
            var rects = r.getClientRects();
            var rc = rects.length ? rects[rects.length - 1] : null;
            if ((!rc || (!rc.width && !rc.height)) && r.startContainer.nodeType === 3 && r.startOffset > 0) {
                r.setStart(r.startContainer, r.startOffset - 1);
                rects = r.getClientRects();
                rc = rects.length ? rects[rects.length - 1] : null;
            }
            if (!rc) rc = r.startContainer.nodeType === 1 ? r.startContainer.getBoundingClientRect() : r.startContainer.parentNode.getBoundingClientRect();
            var fr = win.frameElement ? win.frameElement.getBoundingClientRect() : {left: 0, top: 0};
            return {left: fr.left + rc.right, top: fr.top + rc.top, bottom: fr.top + rc.bottom};
        } catch (e) { return null; }
    }

    function ck4Destacar(i) {
        if (!ck4.lista || !ck4.itens.length) return;
        var n = ck4.itens.length;
        ck4.indice = (i + n) % n;
        var lis = ck4.lista.querySelectorAll('li[data-i]');
        Array.prototype.forEach.call(lis, function (li) { li.classList.toggle('ativo', +li.getAttribute('data-i') === ck4.indice); });
        var at = lis[ck4.indice];
        if (at && at.scrollIntoView) at.scrollIntoView({block: 'nearest'});
    }

    function ck4Renderizar(editor, itens) {
        injetarCss(document);
        if (!ck4.lista) {
            ck4.lista = document.createElement('ul');
            ck4.lista.className = 'seipro-escrita-lista';
            // mousedown com preventDefault: o editor nao perde o foco nem a selecao ao clicar na lista.
            ck4.lista.addEventListener('mousedown', function (e) {
                e.preventDefault();
                var li = e.target.closest && e.target.closest('li[data-i]');
                if (li) ck4Escolher(+li.getAttribute('data-i'));
            });
            ck4.lista.addEventListener('mouseover', function (e) {
                var li = e.target.closest && e.target.closest('li[data-i]');
                if (li) ck4Destacar(+li.getAttribute('data-i'));
            });
            document.body.appendChild(ck4.lista);
        }
        while (ck4.lista.firstChild) ck4.lista.removeChild(ck4.lista.firstChild);
        ck4.itens = itens;
        ck4.indice = 0;
        if (!itens.length) {
            var vazio = document.createElement('li');
            vazio.className = 'vazio';
            vazio.textContent = 'Nenhum resultado encontrado';
            ck4.lista.appendChild(vazio);
        }
        itens.forEach(function (it, i) {
            var li = document.createElement('li');
            li.setAttribute('data-i', i);
            li.appendChild(elementoItem(it));
            ck4.lista.appendChild(li);
        });
        ck4Destacar(0);
        var pos = ck4Retangulo(editor);
        if (!pos) { ck4Fechar(); return; }
        var alt = ck4.lista.offsetHeight, larg = ck4.lista.offsetWidth;
        var top = (pos.bottom + 4 + alt > window.innerHeight && pos.top - 4 - alt > 0) ? pos.top - 4 - alt : pos.bottom + 4;
        var left = Math.max(4, Math.min(pos.left, window.innerWidth - larg - 8));
        ck4.lista.style.top = top + 'px';
        ck4.lista.style.left = left + 'px';
    }

    // Seleciona (no DOM nativo) os n caracteres antes do cursor, atravessando nos de texto do bloco.
    function ck4SelecionarAntes(editor, n) {
        var win = editor.window.$;
        var s = win.getSelection();
        if (!s || !s.rangeCount) return false;
        var fim = s.getRangeAt(0);
        var no = fim.startContainer, off = fim.startOffset;
        if (no.nodeType !== 3) {
            var ant = off > 0 ? no.childNodes[off - 1] : null;
            while (ant && ant.nodeType !== 3 && ant.lastChild) ant = ant.lastChild;
            if (!ant || ant.nodeType !== 3) return false;
            no = ant; off = ant.data.length;
        }
        var bloco = no.parentNode;
        while (bloco && bloco.nodeType === 1 && !/^(P|DIV|LI|TD|TH|H[1-6]|BODY|BLOCKQUOTE)$/.test(bloco.nodeName)) bloco = bloco.parentNode;
        var walker = win.document.createTreeWalker(bloco || win.document.body, 4, null);
        walker.currentNode = no;
        var resta = n;
        while (resta > off) {
            resta -= off;
            var prev = walker.previousNode();
            if (!prev) return false;
            no = prev; off = prev.data.length;
        }
        var r = win.document.createRange();
        r.setStart(no, off - resta);
        r.setEnd(fim.endContainer, fim.endOffset);
        var cr = editor.createRange();
        cr.setStart(new CKEDITOR.dom.node(r.startContainer), r.startOffset);
        cr.setEnd(new CKEDITOR.dom.node(r.endContainer), r.endOffset);
        cr.select();
        return true;
    }

    function ck4Escolher(i) {
        var item = ck4.itens[i], g = ck4.gatilho, editor = ck4.editor;
        ck4Fechar();
        if (!item || !g || !editor) return;
        editor.focus();
        editor.fire('saveSnapshot');
        if (ck4SelecionarAntes(editor, 1 + g.consulta.length)) {
            editor.insertHtml(item.html + '&nbsp;');
        }
        editor.fire('saveSnapshot');
    }

    function ck4Ligar(editor) {
        if (!editor || editor._seiProEscrita) return;
        editor._seiProEscrita = true;
        editor.on('blur', function () { ck4Fechar(); });
        editor.on('destroy', function () { ck4Fechar(); });
        try { editor.window.$.addEventListener('scroll', ck4Fechar, true); } catch (e) {}
        window.addEventListener('scroll', function () { if (ck4.lista) ck4Fechar(); }, true);
    }

    /** Tecla (keydown) no CK4. Retorna true quando a lista consumiu a tecla. */
    function ck4Tecla(editor, keyCode) {
        if (!ck4.lista || ck4.editor !== editor) return false;
        if (keyCode === 40) { ck4Destacar(ck4.indice + 1); return true; }
        if (keyCode === 38) { ck4Destacar(ck4.indice - 1); return true; }
        if (keyCode === 27) { ck4Fechar(); return true; }
        if (keyCode === 13 || keyCode === 9) {
            if (!ck4.itens.length) { ck4Fechar(); return false; }
            ck4Escolher(ck4.indice);
            return true;
        }
        return false;
    }

    /** Depois de cada tecla no CK4: abre, atualiza ou fecha a lista conforme o texto antes do cursor. */
    function ck4AoDigitar(editor) {
        if (!editor || !ativo()) { ck4Fechar(); return; }
        ck4Ligar(editor);
        var texto;
        try { texto = ck4TextoAntesDoCursor(editor); } catch (e) { texto = null; }
        var g = texto ? detectarGatilho(texto) : null;
        if (!g) { ck4Fechar(); return; }
        if (ck4.gatilho && ck4.editor === editor && ck4.gatilho.marcador === g.marcador && ck4.gatilho.consulta === g.consulta && ck4.gatilho.inicio === g.inicio) return;
        var seq = ++ck4.seq;
        buscar(g.marcador, g.consulta).then(function (itens) {
            if (seq !== ck4.seq) return;
            // '@' curto ou sem unidade: nao abre lista vazia (o usuario pode estar so escrevendo).
            if (!itens.length && (g.marcador === '@' || !g.consulta)) { ck4Fechar(); return; }
            ck4.gatilho = g; ck4.editor = editor;
            ck4Renderizar(editor, itens);
            ck4.seq = seq;
        });
    }

    // ================================================================
    // Boot e exportacao
    // ================================================================
    window.SeiProEscritaInterativa = {
        detectarGatilho: detectarGatilho,
        buscar: buscar,
        provedores: PROVEDORES,
        instalarCK5: instalarCK5,
        ck4Tecla: ck4Tecla,
        ck4AoDigitar: ck4AoDigitar,
        ck4Fechar: ck4Fechar
    };

    if (typeof SeiProEditorAdapter !== 'undefined') {
        SeiProEditorAdapter.registerFeature({id: 'escrita-interativa'});
        if (typeof SeiProEditorAdapter.waitReady === 'function') {
            SeiProEditorAdapter.waitReady(30000).then(function () {
                if (SeiProEditorAdapter.version !== 5) return;
                var ed = SeiProEditorAdapter.getInstance();
                if (!instalarCK5(ed)) console.warn('[SEIPro] escrita interativa: CK5 sem plugin Mention');
            }).catch(function () {});
        }
    }
})();
