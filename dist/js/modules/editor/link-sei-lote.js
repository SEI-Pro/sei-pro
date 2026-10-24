/**
 * SEI Pro - Editor / Feature: converter em lote os numeros SEI do documento em links
 *
 * Varre o corpo do documento, acha os numeros de documento e de processo do SEI
 * escritos como texto e converte cada um no link do SEI (a mesma coisa que a
 * ferramenta nativa "Inserir um Link para processo ou documento do SEI!" faz com
 * um numero de cada vez). Pedido de usuario: listas de despachos costumam citar
 * dezenas deles.
 *
 * COMO O PADRAO E DESCOBERTO
 * --------------------------
 * O numero de documento nao tem tamanho unico: sao 8 digitos no MJ, 7 em outros
 * orgaos. Em vez de uma tabela por orgao, os comprimentos saem dos documentos do
 * PROPRIO processo (dadosProcessoPro.listDocumentos[].nr_sei). Quando o processo
 * ainda nao tem documento nenhum, ficam valendo 7 e 8, e a conferencia da previa
 * resolve o resto.
 *
 * O numero de processo tambem muda de formato, e ate dentro da MESMA instancia: o
 * SEI SP atende varios orgaos e mistura 99906.713-630.000032/2025-82,
 * 018.00002137/2023-41 e 3533908.4438.00000132/2025-57. Valem dois moldes:
 *   - o do PROPRIO processo (cada bloco de digitos vira \d{n}, a pontuacao fica
 *     literal), que cobre formatos fora do comum, como os com letras;
 *   - digitos e pontuacao terminando em /ano-DV, o fim do NUP federal e da maioria
 *     dos formatos estaduais.
 * O endpoint do SEI (ProtocoloINT::pesquisarLinkEditor) tira a formatacao e
 * resolve processo e documento do mesmo jeito, entao a conversao e a mesma.
 *
 * POR QUE A PREVIA E OBRIGATORIA
 * ------------------------------
 * "8 digitos isolados" tambem casa CEP, numero de processo antigo e afins. A
 * janela mostra cada numero com o trecho de texto em volta, todos marcados, para
 * o usuario desmarcar o que nao for documento antes de disparar. A excecao e o
 * numero do proprio processo: quase todo despacho o repete no texto, e raramente
 * alguem quer link para o processo em que ja esta -- ele vem DESMARCADO.
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
    // Digitos e pontuacao terminando em /ano-DV: 50300.018905/2018-67, 018.00002137/2023-41,
    // 3533908.4438.00000132/2025-57.
    var PROCESSO_ANO_DV = '\\d[\\d.\\-]{3,}\\d\\/(?:19|20)\\d{2}-\\d{2}';
    // Exemplo para as mensagens quando o numero do processo atual nao esta a mao.
    var EXEMPLO_NUP = '00000.000000/0000-00';

    // ----------------------------------------------------------------
    // Deteccao do padrao
    // ----------------------------------------------------------------

    // Dados do processo em que o documento esta. Na janela do editor o dadosProcessoPro pode
    // ainda estar vazio (medido no SEI 5, na primeira abertura logo depois de criar o
    // documento); nesse caso vale a copia da sessao, achada pelo id_procedimento da URL.
    function dadosDoProcessoPro() {
        var local = (typeof dadosProcessoPro !== 'undefined' && dadosProcessoPro) ? dadosProcessoPro : {};
        if (local.propProcesso) return local;
        try {
            var id = new URLSearchParams(location.search).get('id_procedimento');
            var sessao = (typeof sessionStorageRestorePro === 'function') ? sessionStorageRestorePro('dadosSessionProcessoPro') : null;
            for (var i = 0; id && sessao && i < sessao.length; i++) {
                var p = sessao[i] && sessao[i].propProcesso;
                if (p && String(p.hdnIdProcedimento) === id) return sessao[i];
            }
        } catch (e) {}
        return local;
    }

    function comprimentosNumeroSeiPro() {
        var tamanhos = [];
        var lista = dadosDoProcessoPro().listDocumentos || [];
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

    function processoAtualPro() {
        var prop = dadosDoProcessoPro().propProcesso;
        return prop ? String(prop.txtProtocoloExibir || prop.hdnProtocoloFormatado || '').trim() : '';
    }

    // 50300.018905/2018-67 => \d{5}\.\d{6}/\d{4}-\d{2}
    function moldeProcessoPro(numero) {
        return String(numero).replace(/\d+|\D/g, function (t) {
            return /\d/.test(t) ? '\\d{' + t.length + '}' : t.replace(/[.*+?^${}()|[\]\\\/]/g, '\\$&');
        });
    }

    function regexProcessoSeiPro(moldes) {
        // Sem \b: o molde pode comecar ou terminar em letra ou pontuacao. As bordas impedem
        // casar o pedaco final de um numero maior (x108000.012345/2024-11 nao vira 012345/2024-11).
        return new RegExp('(?<![\\w./]|\\d-)(?:' + moldes.join('|') + ')(?![\\w]|[./-]\\d)', 'g');
    }

    function padroesLinkSeiPro() {
        var processoAtual = processoAtualPro();
        var moldes = [PROCESSO_ANO_DV];
        if (processoAtual.replace(/\D/g, '').length >= 8) moldes.unshift(moldeProcessoPro(processoAtual));
        var tamanhos = comprimentosNumeroSeiPro();
        return {
            tamanhos: tamanhos,
            processoAtual: processoAtual,
            exemploProcesso: processoAtual || EXEMPLO_NUP,
            documento: regexNumeroSeiPro(tamanhos),
            processo: regexProcessoSeiPro(moldes)
        };
    }

    // Numeros de documento e de processo de um trecho de texto, na ordem em que aparecem.
    // Numero de documento que cai DENTRO de um numero de processo fica de fora (formato de
    // processo com bloco de 7 ou 8 digitos).
    function acharNumerosPro(texto, padroes) {
        var achados = [];
        var m;
        padroes.processo.lastIndex = 0;
        while ((m = padroes.processo.exec(texto)) !== null) {
            achados.push({
                numero: m[0],
                tipo: 'processo',
                proprio: m[0] === padroes.processoAtual,
                inicio: m.index,
                fim: m.index + m[0].length
            });
        }
        var processos = achados.slice();
        padroes.documento.lastIndex = 0;
        while ((m = padroes.documento.exec(texto)) !== null) {
            var ini = m.index, fim = m.index + m[0].length;
            var dentro = processos.some(function (p) { return ini < p.fim && fim > p.inicio; });
            if (!dentro) achados.push({ numero: m[0], tipo: 'documento', proprio: false, inicio: ini, fim: fim });
        }
        return achados.sort(function (a, b) { return a.inicio - b.inicio; });
    }

    function contarPorNumero(lista) {
        var conta = {};
        lista.forEach(function (oc) { conta[oc.numero] = (conta[oc.numero] || 0) + 1; });
        return conta;
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

    function coletarCK5(editor, padroes) {
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
                acharNumerosPro(texto, padroes).forEach(function (a) {
                    achados.push({
                        numero: a.numero,
                        tipo: a.tipo,
                        proprio: a.proprio,
                        trecho: trechoEmVolta(texto, a.inicio, a.fim),
                        pai: pai,
                        inicio: base + a.inicio,
                        fim: base + a.fim
                    });
                });
            }
        });
        return achados;
    }

    // No CK4 cada secao do documento e uma instancia propria do editor. O despacho do SEI SP,
    // por exemplo, tem uma secao editavel "Processo n. / Interessado" antes da do texto, e
    // olhar so a instancia do clique deixava o texto inteiro de fora. Como no CK5, varre
    // todas as secoes editaveis.
    function instanciasEditaveisCK4(editor) {
        var lista = [];
        try {
            Object.keys(CKEDITOR.instances).forEach(function (nome) {
                var inst = CKEDITOR.instances[nome];
                if (inst && !inst.readOnly && inst.document) lista.push(inst);
            });
        } catch (e) {}
        return lista.length ? lista : (editor ? [editor] : []);
    }

    function coletarCK4(editor, padroes) {
        var achados = [];
        instanciasEditaveisCK4(editor).forEach(function (inst) {
            var corpo = SeiProEditorAdapter.getBodyContainer(inst);
            if (!corpo || !corpo.ownerDocument) return;
            var doc = corpo.ownerDocument;
            var caminhador = doc.createTreeWalker(corpo, doc.defaultView.NodeFilter.SHOW_TEXT, null, false);
            var no;
            while ((no = caminhador.nextNode())) {
                // Numero que ja e link (ancora do SEI ou qualquer <a>) fica de fora.
                if (no.parentElement && no.parentElement.closest('a')) continue;
                var texto = no.nodeValue || '';
                acharNumerosPro(texto, padroes).forEach(function (a) {
                    achados.push({
                        numero: a.numero,
                        tipo: a.tipo,
                        proprio: a.proprio,
                        trecho: trechoEmVolta(texto, a.inicio, a.fim),
                        inst: inst,
                        no: no,
                        inicio: a.inicio,
                        fim: a.fim
                    });
                });
            }
        });
        return achados;
    }

    function coletarPro(editor, padroes) {
        return (SeiProEditorAdapter.version === 5) ? coletarCK5(editor, padroes) : coletarCK4(editor, padroes);
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
        // A secao em que o numero esta: o dialogo insere o link na instancia que o abriu.
        var ed = oc.inst || editor;
        ed.focus();
        var range = new CKEDITOR.dom.range(ed.document);
        var no = new CKEDITOR.dom.text(oc.no);
        range.setStart(no, oc.inicio);
        range.setEnd(no, oc.fim);
        ed.getSelection().selectRanges([range]);
        // insertProtocoloOnBox (chamado no onShow do dialogo) le a selecao, preenche
        // o campo Protocolo e confirma sozinho.
        ed.execCommand('linkseiDialog');
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

    // ignoradas: quantas ocorrencias de cada numero ficaram de fora (desmarcadas na previa
    // ou alem do teto) -- continuam como texto e nao contam como falha.
    function executarLote(editor, escolhidas, ignoradas, aoTerminar) {
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
            setTimeout(function () { aoTerminar(montarResumo(editor, fila, falhas, saida.avisos, ignoradas)); }, 900);
        }).catch(function (e) {
            aoTerminar(montarResumo(editor, fila, falhas.concat([{ numero: '-', motivo: String(e).slice(0, 90) }]), [], ignoradas));
        });
    }

    // Quem ainda esta como TEXTO no documento nao virou link. Vale para os dois editores e
    // pega tambem o que falhou sem avisar.
    function montarResumo(editor, fila, falhas, avisos, ignoradas) {
        var sobra = contarPorNumero(coletarPro(editor, padroesLinkSeiPro()));
        Object.keys(ignoradas || {}).forEach(function (n) {
            if (sobra[n]) sobra[n] = Math.max(0, sobra[n] - ignoradas[n]);
        });

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

    // "3 de documento (8 digitos, ...) e 2 de processo"
    function descreverAchadosPro(achados, padroes) {
        var docs = 0, procs = 0;
        achados.forEach(function (oc) { if (oc.tipo === 'processo') procs++; else docs++; });
        var partes = [];
        if (docs) partes.push('<strong>' + docs + '</strong> de documento (' + padroes.tamanhos.join(' ou ') + ' d\u00EDgitos, como os documentos deste processo)');
        if (procs) partes.push('<strong>' + procs + '</strong> de processo');
        return partes.join(' e ');
    }

    function abrirPreviaLinkSeiLote(editor, achados, padroes, contagem) {
        var temProprio = achados.some(function (oc) { return oc.proprio; });
        var linhas = achados.map(function (oc, i) {
            var rotulo = oc.proprio
                ? '<span style="color:#d9822b;">este processo</span>'
                : oc.tipo;
            return '<tr>' +
                '  <td style="width:26px; vertical-align:top; padding:4px 2px;"><input type="checkbox" class="linkSeiLoteItem" data-i="' + i + '"' + (oc.proprio ? '' : ' checked') + '></td>' +
                '  <td style="padding:4px 2px; white-space:nowrap; vertical-align:top;"><strong>' + sanitizeHTML(oc.numero) + '</strong>' +
                '    <div style="font-size:8pt; color:#888;">' + rotulo + '</div></td>' +
                '  <td style="padding:4px 6px; font-size:9pt; color:#555;">' + sanitizeHTML(oc.trecho) + '</td>' +
                '</tr>';
        }).join('');

        var html =
            '<div id="linkSeiLoteBox">' +
            '  <p style="font-size:10pt; margin:0 0 8px 0;">' +
            '    <i class="fas fa-link azulColor" style="margin-right:6px;"></i>' +
            '    Encontrei <strong>' + achados.length + '</strong> ' + (achados.length === 1 ? 'n\u00FAmero' : 'n\u00FAmeros') +
            '    neste texto: ' + descreverAchadosPro(achados, padroes) + '.' +
            '  </p>' +
            '  <p style="font-size:9pt; color:#777; margin:0 0 8px 0;">Desmarque o que n\u00E3o for documento ou processo do SEI.' +
            (temProprio ? ' O n\u00FAmero deste pr\u00F3prio processo vem desmarcado.' : '') +
            ' Cada n\u00FAmero marcado \u00E9 uma consulta ao servidor.</p>' +
            '  <p style="font-size:9pt; margin:0 0 6px 0;"><a href="javascript:void(0)" id="linkSeiLoteTodos">marcar todos</a> &middot; <a href="javascript:void(0)" id="linkSeiLoteNenhum">desmarcar todos</a></p>' +
            '  <div style="max-height:280px; overflow:auto; border:1px solid #ddd; border-radius:4px;">' +
            '    <table style="width:100%; border-collapse:collapse;">' + linhas + '</table>' +
            '  </div>' +
            '</div>';

        resetDialogBoxPro('dialogBoxPro');
        dialogBoxPro = htmlPro($('#dialogBoxPro'), html)
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
                        var porEscolha = contarPorNumero(escolhidas);
                        var ignoradas = {};
                        Object.keys(contagem).forEach(function (n) { ignoradas[n] = contagem[n] - (porEscolha[n] || 0); });
                        alertaBoxPro('Sucess', 'spinner fa-spin', 'Convertendo ' + escolhidas.length + ' ' + (escolhidas.length === 1 ? 'n\u00FAmero' : 'n\u00FAmeros') + '...');
                        executarLote(editor, escolhidas, ignoradas, function (resumo) {
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

        var padroes = padroesLinkSeiPro();
        var achados = coletarPro(editor, padroes);

        if (!achados.length) {
            alertaBoxPro('Error', 'exclamation-triangle',
                'Nenhum n\u00FAmero de documento (' + padroes.tamanhos.join(' ou ') + ' d\u00EDgitos) ' +
                'ou de processo (como ' + sanitizeHTML(padroes.exemploProcesso) + ') foi encontrado no texto. ' +
                'Os que j\u00E1 s\u00E3o link n\u00E3o entram na conta.');
            return;
        }
        var contagem = contarPorNumero(achados);
        if (achados.length > LOTE_TETO) achados = achados.slice(0, LOTE_TETO);

        abrirPreviaLinkSeiLote(editor, achados, padroes, contagem);
    };

    if (window.SeiProEditorAdapter && SeiProEditorAdapter.registerFeature) {
        SeiProEditorAdapter.registerFeature({ id: 'link-sei-lote' });
    }
})();
