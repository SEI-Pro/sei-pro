/**
 * SEI Pro - Editor / Feature: converter em lote os numeros SEI do documento em links
 *
 * Varre o corpo do documento, acha os numeros de documento do SEI escritos como
 * texto e converte cada um no link do SEI (a mesma coisa que a ferramenta nativa
 * "Inserir um Link para processo ou documento do SEI!" faz com um numero de cada
 * vez). Pedido de usuario: listas de despachos costumam citar dezenas deles.
 *
 * COMO O PADRAO E DESCOBERTO
 * --------------------------
 * O numero de documento nao tem tamanho unico: sao 8 digitos no MJ, 7 em outros
 * orgaos. Em vez de uma tabela por orgao, os comprimentos saem dos documentos do
 * PROPRIO processo (dadosProcessoPro.listDocumentos[].nr_sei). Quando o processo
 * ainda nao tem documento nenhum, ficam valendo 7 e 8, e a conferencia da previa
 * resolve o resto.
 *
 * POR QUE A PREVIA E OBRIGATORIA
 * ------------------------------
 * "8 digitos isolados" tambem casa CEP, numero de processo antigo e afins. A
 * janela mostra cada numero com o trecho de texto em volta, todos marcados, para
 * o usuario desmarcar o que nao for documento antes de disparar.
 *
 * CK5 x CK4
 * ---------
 * - CK5: o link ja e um elemento do model chamado SEILink (atributos id =
 *   "lnkSei<IdProtocolo>" e text = numero), entao numero que ja virou link nao
 *   aparece na varredura -- so texto e percorrido. A conversao NAO passa pelo
 *   comando 'adicionarLinkProtocoloSei': medido no SEI 5.0.4, com a selecao posta
 *   pelo model (correta, editor focado, comando isEnabled) nem o execute nem o
 *   clique no botao nativo convertem -- o plugin do SEI so enxerga selecao feita
 *   pelo usuario com mouse/teclado. Em vez disso o modulo chama o MESMO endpoint
 *   que o botao usa (INFRA_EDITOR_CONFIG.sei.urlBuscarProtocoloSei) e monta o
 *   SEILink direto no model. Acionamento: botao na barra do SEI Pro.
 * - CK4: nao ha comando, so o dialogo 'linkseiDialog' -- que ja e teleguiado pelo
 *   SEI Pro (updateDialogDefinitionPro -> insertProtocoloOnBox preenche o campo e
 *   confirma). O lote seleciona cada numero e abre o dialogo, um por vez.
 *   Acionamento: link dentro do proprio dialogo nativo, que e onde o usuario ja
 *   esta quando pensa no assunto.
 *
 * DUAS ARMADILHAS RESOLVIDAS AQUI
 * -------------------------------
 * 1. A conversao muda o texto, entao os offsets seguintes saem do lugar: o lote
 *    roda de TRAS PARA A FRENTE, e as posicoes anteriores continuam validas.
 * 2. No CK4 o SEI avisa numero inexistente com um alert() nativo, que travaria a
 *    fila num lote de dezenas. Durante o lote o alert e desviado para uma lista
 *    (e devolvido no finally), e as mensagens viram o resumo do fim.
 */
(function () {
    'use strict';

    // Teto de seguranca: cada numero e uma ida ao servidor.
    var LOTE_TETO = 300;
    // Pausa entre conversoes, para nao enfileirar requisicoes no SEI.
    var LOTE_PAUSA = 500;

    // ----------------------------------------------------------------
    // Deteccao do padrao
    // ----------------------------------------------------------------

    function comprimentosNumeroSeiPro() {
        var tamanhos = [];
        var lista = (typeof dadosProcessoPro !== 'undefined' && dadosProcessoPro && dadosProcessoPro.listDocumentos)
            ? dadosProcessoPro.listDocumentos : [];
        for (var i = 0; i < lista.length; i++) {
            var n = String((lista[i] && lista[i].nr_sei) || '').replace(/\D/g, '');
            if (n.length >= 5 && n.length <= 12 && tamanhos.indexOf(n.length) === -1) tamanhos.push(n.length);
        }
        if (!tamanhos.length) tamanhos = [7, 8];
        return tamanhos.sort(function (a, b) { return a - b; });
    }

    function regexNumeroSeiPro(tamanhos) {
        // \b entre dois digitos nao existe, entao \d{8} nao casa dentro de 123456789.
        return new RegExp('\\b(' + tamanhos.map(function (t) { return '\\d{' + t + '}'; }).join('|') + ')\\b', 'g');
    }

    function trechoEmVolta(texto, inicio, fim) {
        var antes = texto.slice(Math.max(0, inicio - 40), inicio).replace(/\s+/g, ' ');
        var depois = texto.slice(fim, fim + 40).replace(/\s+/g, ' ');
        return (inicio > 40 ? '...' : '') + antes + '\u2039' + texto.slice(inicio, fim) + '\u203A' + depois + (fim + 40 < texto.length ? '...' : '');
    }

    // ----------------------------------------------------------------
    // Coleta - CK5 (percorre o model) e CK4 (percorre o DOM do corpo)
    // ----------------------------------------------------------------

    function rootsEditaveisCK5(editor) {
        var nomes = [];
        try { editor.model.document.getRootNames().forEach(function (n) { nomes.push(n); }); } catch (e) { return []; }
        return nomes.filter(function (n) {
            // O elemento de cada root vem por editor.ui.getEditableElement(nome) -- nao ha
            // atributo data-root no DOM do SEI 5; o id do elemento e o proprio nome da root.
            var el = null;
            try { el = editor.ui.getEditableElement(n); } catch (e) {}
            if (!el) el = document.getElementById(n);
            // Sem elemento no DOM: mantem (o CK5 recusa escrita em root somente leitura de
            // qualquer forma). Com elemento: fora as secoes somente leitura (cabecalho, titulo).
            return !el || !el.classList.contains('ck-read-only');
        });
    }

    function coletarCK5(editor, regex) {
        var achados = [];
        rootsEditaveisCK5(editor).forEach(function (nome) {
            var raiz = editor.model.document.getRoot(nome);
            if (!raiz) return;
            var itens = editor.model.createRangeIn(raiz).getItems();
            for (var it = itens.next(); !it.done; it = itens.next()) {
                var item = it.value;
                if (!item.is || !item.is('$textProxy')) continue;
                var pai = item.textNode.parent;
                var base = item.startOffset;
                var texto = item.data;
                var m;
                regex.lastIndex = 0;
                while ((m = regex.exec(texto)) !== null) {
                    achados.push({
                        numero: m[0],
                        trecho: trechoEmVolta(texto, m.index, m.index + m[0].length),
                        pai: pai,
                        inicio: base + m.index,
                        fim: base + m.index + m[0].length
                    });
                }
            }
        });
        return achados;
    }

    function coletarCK4(editor, regex) {
        var achados = [];
        var corpo = SeiProEditorAdapter.getBodyContainer(editor);
        if (!corpo || !corpo.ownerDocument) return achados;
        var doc = corpo.ownerDocument;
        var caminhador = doc.createTreeWalker(corpo, doc.defaultView.NodeFilter.SHOW_TEXT, null, false);
        var no;
        while ((no = caminhador.nextNode())) {
            // Numero que ja e link (ancora do SEI ou qualquer <a>) fica de fora.
            if (no.parentElement && no.parentElement.closest('a')) continue;
            var texto = no.nodeValue || '';
            var m;
            regex.lastIndex = 0;
            while ((m = regex.exec(texto)) !== null) {
                achados.push({
                    numero: m[0],
                    trecho: trechoEmVolta(texto, m.index, m.index + m[0].length),
                    no: no,
                    inicio: m.index,
                    fim: m.index + m[0].length
                });
            }
        }
        return achados;
    }

    // ----------------------------------------------------------------
    // Resolucao do numero no SEI (CK5)
    // ----------------------------------------------------------------

    // O mesmo POST que o botao nativo dispara. A resposta vem em XML iso-8859-1:
    //   <complementos><complemento nome="IdProtocolo">40051048</complemento>
    //                 <complemento nome="ProtocoloFormatado">35276038</complemento>
    //                 <complemento nome="Identificacao">Anexo</complemento></complementos>
    // ou <erros><erro descricao="Protocolo nao encontrado."></erro></erros>.
    function buscarProtocoloSeiPro(numero) {
        var cfg = window.INFRA_EDITOR_CONFIG;
        var url = cfg && cfg.sei && cfg.sei.urlBuscarProtocoloSei;
        if (!url) return Promise.resolve({ erro: 'O SEI n\u00E3o exp\u00F4s o endere\u00E7o de consulta de protocolo' });

        var q = new URLSearchParams(location.search);
        var corpo = 'idProtocoloDigitado=' + encodeURIComponent(numero) +
                    '&idProcedimento=' + encodeURIComponent(q.get('id_procedimento') || '') +
                    '&idDocumento=' + encodeURIComponent(q.get('id_documento') || '');

        return fetch(new URL(url, location.href).href, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
            body: corpo
        }).then(function (res) {
            // iso-8859-1: sem isto o acento da mensagem de erro do SEI vira lixo.
            return res.arrayBuffer().then(function (buf) {
                return new TextDecoder('iso-8859-1').decode(buf);
            });
        }).then(function (xml) {
            var doc = new DOMParser().parseFromString(xml, 'text/xml');
            var erro = doc.querySelector('erro');
            if (erro) return { erro: erro.getAttribute('descricao') || 'Protocolo n\u00E3o encontrado.' };
            var valores = {};
            Array.prototype.forEach.call(doc.querySelectorAll('complemento'), function (c) {
                valores[c.getAttribute('nome')] = c.textContent;
            });
            if (!valores.IdProtocolo) return { erro: 'Resposta do SEI sem o identificador do protocolo' };
            return { idProtocolo: valores.IdProtocolo, formatado: valores.ProtocoloFormatado || numero, identificacao: valores.Identificacao || '' };
        }).catch(function (e) {
            return { erro: 'Falha ao consultar o SEI: ' + String(e).slice(0, 80) };
        });
    }

    // ----------------------------------------------------------------
    // Conversao de uma ocorrencia
    // ----------------------------------------------------------------

    function converterCK5(editor, oc) {
        return buscarProtocoloSeiPro(oc.numero).then(function (dados) {
            if (dados.erro) return dados;
            editor.model.change(function (writer) {
                var faixa = writer.createRange(
                    writer.createPositionAt(oc.pai, oc.inicio),
                    writer.createPositionAt(oc.pai, oc.fim)
                );
                var elo = writer.createElement('SEILink', {
                    id: 'lnkSei' + dados.idProtocolo,
                    text: dados.formatado
                });
                writer.remove(faixa);
                writer.insert(elo, writer.createPositionAt(oc.pai, oc.inicio));
            });
            return dados;
        });
    }

    function converterCK4(editor, oc) {
        var range = new CKEDITOR.dom.range(editor.document);
        var no = new CKEDITOR.dom.text(oc.no);
        range.setStart(no, oc.inicio);
        range.setEnd(no, oc.fim);
        editor.getSelection().selectRanges([range]);
        // insertProtocoloOnBox (chamado no onShow do dialogo) le a selecao, preenche
        // o campo Protocolo e confirma sozinho.
        editor.execCommand('linkseiDialog');
    }

    // Espera o dialogo do CK4 fechar (o SEI consulta o protocolo no servidor).
    function esperarDialogoFechar(limiteMs) {
        var fim = Date.now() + (limiteMs || 8000);
        return new Promise(function (resolve) {
            (function espia() {
                var aberto = false;
                try { aberto = !!(CKEDITOR.dialog && CKEDITOR.dialog.getCurrent()); } catch (e) {}
                if (!aberto || Date.now() > fim) {
                    try { var d = CKEDITOR.dialog.getCurrent(); if (d) d.hide(); } catch (e2) {}
                    return resolve();
                }
                setTimeout(espia, 150);
            })();
        });
    }

    // O SEI avisa "Protocolo nao encontrado." com alert() nativo; num lote de
    // dezenas isso travaria a fila numa caixa por numero. Recolhe as mensagens.
    function comAlertaRecolhido(fn) {
        var original = window.alert;
        var recolhidas = [];
        window.alert = function (msg) { recolhidas.push(String(msg)); };
        return Promise.resolve()
            .then(fn)
            .then(function (r) { window.alert = original; return { resultado: r, avisos: recolhidas }; })
            .catch(function (e) { window.alert = original; throw e; });
    }

    // ----------------------------------------------------------------
    // Execucao do lote
    // ----------------------------------------------------------------

    function ordenarFilaPro(escolhidas) {
        // De tras para a frente DENTRO DE CADA no/paragrafo: converter muda o texto e
        // deslocaria os offsets das ocorrencias seguintes do mesmo no. Entre nos
        // diferentes a ordem nao importa.
        var fila = escolhidas.slice();
        var ordemDoNo = [];
        function chaveDoNo(oc) {
            var alvo = oc.pai || oc.no;
            var i = ordemDoNo.indexOf(alvo);
            if (i === -1) { ordemDoNo.push(alvo); i = ordemDoNo.length - 1; }
            return i;
        }
        fila.sort(function (a, b) {
            var ka = chaveDoNo(a), kb = chaveDoNo(b);
            if (ka !== kb) return ka - kb;
            return b.inicio - a.inicio;
        });
        return fila;
    }

    function executarLote(editor, escolhidas, aoTerminar) {
        var ck5 = SeiProEditorAdapter.version === 5;
        var fila = ordenarFilaPro(escolhidas);
        var falhas = [];
        var passo = 0;

        function proximo() {
            if (passo >= fila.length) return Promise.resolve();
            var oc = fila[passo++];
            var acao;
            if (ck5) {
                acao = converterCK5(editor, oc).then(function (r) {
                    if (r && r.erro) falhas.push({ numero: oc.numero, motivo: r.erro });
                });
            } else {
                // CK4: o dialogo nativo faz a consulta e a insercao; o motivo de cada falha
                // nao vem separado por numero, entao quem nao virou link e descoberto na
                // conferencia do fim.
                acao = Promise.resolve()
                    .then(function () { converterCK4(editor, oc); })
                    .then(function () { return esperarDialogoFechar(); })
                    .catch(function (e) { falhas.push({ numero: oc.numero, motivo: String(e).slice(0, 90) }); });
            }
            return acao
                .then(function () { return new Promise(function (r) { setTimeout(r, LOTE_PAUSA); }); })
                .then(proximo);
        }

        comAlertaRecolhido(proximo).then(function (saida) {
            // Folga para a ultima conversao assentar antes da conferencia.
            setTimeout(function () { aoTerminar(montarResumo(editor, fila, falhas, saida.avisos)); }, 900);
        }).catch(function (e) {
            aoTerminar(montarResumo(editor, fila, falhas.concat([{ numero: '-', motivo: String(e).slice(0, 90) }]), []));
        });
    }

    // Quem ainda esta como TEXTO no documento nao virou link. Vale para os dois editores e
    // pega tambem o que falhou sem avisar.
    function montarResumo(editor, fila, falhas, avisos) {
        var regex = regexNumeroSeiPro(comprimentosNumeroSeiPro());
        var achados = (SeiProEditorAdapter.version === 5) ? coletarCK5(editor, regex) : coletarCK4(editor, regex);
        var sobra = {};
        achados.forEach(function (a) { sobra[a.numero] = (sobra[a.numero] || 0) + 1; });

        var jaListado = {};
        falhas.forEach(function (f) { jaListado[f.numero] = true; });

        var motivoPadrao = (avisos && avisos.length)
            ? String(avisos[0]).replace(/\s+/g, ' ').trim()
            : 'O SEI n\u00E3o converteu este n\u00FAmero';

        fila.forEach(function (oc) {
            if (sobra[oc.numero] > 0) {
                sobra[oc.numero]--;
                if (!jaListado[oc.numero]) falhas.push({ numero: oc.numero, motivo: motivoPadrao });
            }
        });
        return { total: fila.length, falhas: falhas };
    }

    // ----------------------------------------------------------------
    // Previa
    // ----------------------------------------------------------------

    function abrirPreviaLinkSeiLote(editor, achados, tamanhos) {
        var linhas = achados.map(function (oc, i) {
            return '<tr>' +
                '  <td style="width:26px; vertical-align:top; padding:4px 2px;"><input type="checkbox" class="linkSeiLoteItem" data-i="' + i + '" checked></td>' +
                '  <td style="padding:4px 2px; white-space:nowrap; vertical-align:top;"><strong>' + oc.numero + '</strong></td>' +
                '  <td style="padding:4px 6px; font-size:9pt; color:#555;">' + sanitizeHTML(oc.trecho) + '</td>' +
                '</tr>';
        }).join('');

        var html =
            '<div id="linkSeiLoteBox">' +
            '  <p style="font-size:10pt; margin:0 0 8px 0;">' +
            '    <i class="fas fa-link azulColor" style="margin-right:6px;"></i>' +
            '    Encontrei <strong>' + achados.length + '</strong> ' + (achados.length === 1 ? 'n\u00FAmero' : 'n\u00FAmeros') +
            '    de documento neste texto (' + tamanhos.join(' ou ') + ' d\u00EDgitos, como os documentos deste processo).' +
            '  </p>' +
            '  <p style="font-size:9pt; color:#777; margin:0 0 8px 0;">Desmarque o que n\u00E3o for documento do SEI. Cada n\u00FAmero marcado \u00E9 uma consulta ao servidor.</p>' +
            '  <p style="font-size:9pt; margin:0 0 6px 0;"><a href="javascript:void(0)" id="linkSeiLoteTodos">marcar todos</a> &middot; <a href="javascript:void(0)" id="linkSeiLoteNenhum">desmarcar todos</a></p>' +
            '  <div style="max-height:280px; overflow:auto; border:1px solid #ddd; border-radius:4px;">' +
            '    <table style="width:100%; border-collapse:collapse;">' + linhas + '</table>' +
            '  </div>' +
            '</div>';

        resetDialogBoxPro('dialogBoxPro');
        dialogBoxPro = $('#dialogBoxPro')
            .html(html)
            .dialog({
                title: 'Converter n\u00FAmeros SEI em links',
                width: 620,
                open: function () {
                    $('#linkSeiLoteTodos').on('click', function () { $('.linkSeiLoteItem').prop('checked', true); });
                    $('#linkSeiLoteNenhum').on('click', function () { $('.linkSeiLoteItem').prop('checked', false); });
                },
                buttons: [{
                    text: 'Converter',
                    'class': 'confirm ui-state-active',
                    click: function () {
                        var escolhidas = [];
                        $('.linkSeiLoteItem:checked').each(function () {
                            escolhidas.push(achados[parseInt($(this).data('i'), 10)]);
                        });
                        resetDialogBoxPro('dialogBoxPro');
                        if (!escolhidas.length) return;
                        alertaBoxPro('Sucess', 'spinner fa-spin', 'Convertendo ' + escolhidas.length + ' ' + (escolhidas.length === 1 ? 'n\u00FAmero' : 'n\u00FAmeros') + '...');
                        executarLote(editor, escolhidas, function (resumo) {
                            resetDialogBoxPro('alertBoxPro');
                            mostrarResumo(resumo);
                        });
                    }
                }]
            });
    }

    function mostrarResumo(resumo) {
        var ok = resumo.total - resumo.falhas.length;
        if (!resumo.falhas.length) {
            alertaBoxPro('Sucess', 'check-circle', ok + ' ' + (ok === 1 ? 'n\u00FAmero convertido' : 'n\u00FAmeros convertidos') + ' em link.');
            return;
        }
        var lista = resumo.falhas.map(function (f) {
            return '<div style="font-size:9pt; background:#f7f7f7; border-radius:4px; padding:5px 7px; margin:4px 0;">' +
                   '<strong>' + f.numero + '</strong>' +
                   '<span style="background:#fff0f0; color:#f54040; border-radius:4px; padding:1px 6px; margin-left:6px;">' + sanitizeHTML(f.motivo) + '</span>' +
                   '</div>';
        }).join('');
        alertaBoxPro('Error', 'exclamation-triangle',
            ok + ' de ' + resumo.total + ' ' + (resumo.total === 1 ? 'n\u00FAmero convertido' : 'n\u00FAmeros convertidos') + '.' +
            '<div style="margin-top:8px; font-size:9pt;">Ficaram sem link:</div>' +
            '<div style="margin-top:4px; max-height:200px; overflow:auto;">' + lista + '</div>');
    }

    // ----------------------------------------------------------------
    // Ponto de entrada
    // ----------------------------------------------------------------

    window.converterNumerosSeiEmLotePro = function (this_) {
        var editor = SeiProEditorAdapter.getInstance(this_);
        if (!editor) return;

        var tamanhos = comprimentosNumeroSeiPro();
        var regex = regexNumeroSeiPro(tamanhos);
        var achados = (SeiProEditorAdapter.version === 5) ? coletarCK5(editor, regex) : coletarCK4(editor, regex);

        if (!achados.length) {
            alertaBoxPro('Error', 'exclamation-triangle',
                'Nenhum n\u00FAmero de documento (' + tamanhos.join(' ou ') + ' d\u00EDgitos) foi encontrado no texto. ' +
                'Os que j\u00E1 s\u00E3o link n\u00E3o entram na conta.');
            return;
        }
        if (achados.length > LOTE_TETO) achados = achados.slice(0, LOTE_TETO);

        abrirPreviaLinkSeiLote(editor, achados, tamanhos);
    };

    if (window.SeiProEditorAdapter && SeiProEditorAdapter.registerFeature) {
        SeiProEditorAdapter.registerFeature({ id: 'link-sei-lote' });
    }
})();
