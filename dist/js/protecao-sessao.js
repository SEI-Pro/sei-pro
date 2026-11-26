/**
 * Protecao contra abas de sessoes anteriores ("Hash invalido")
 *
 * PROBLEMA
 * --------
 * Todo link do SEI leva um infra_hash assinado com a sessao em que foi gerado.
 * Se uma aba ou janela aberta ANTES de um novo login (aba do dia anterior,
 * segunda aba do SEI, janela do editor) manda qualquer requisicao com o hash
 * antigo, o SEI responde 302 para o login do SIP com msg="Hash invalido" e a
 * sessao NOVA cai junto. Depois da primeira queda vira efeito domino: cada
 * janela antiga ainda aberta derruba o login seguinte.
 *
 * O QUE ESTE MODULO FAZ
 * ---------------------
 * 1. Marca o inicio de cada sessao. A primeira pagina do SEI carregada logo
 *    apos o login (referrer vindo do SIP) grava o horario em localStorage
 *    (chave CHAVE_INICIO). O localStorage e compartilhado por todas as abas
 *    da mesma origem, entao todas ficam sabendo.
 * 2. Cada pagina (janela de topo) guarda o horario em que foi aberta
 *    (performance.timeOrigin). Se ela foi aberta ANTES do ultimo login, e de
 *    uma sessao anterior: os links dela carregam hash velho.
 * 3. Essas abas recebem um aviso em tela cheia que bloqueia cliques, e os
 *    quadros (iframes) dela param de navegar. O aviso oferece:
 *      - "Abrir SEI atualizado": vai para a raiz do SEI, sem hash, na sessao nova;
 *      - "Fechar janela" (quando a janela foi aberta por script, ex.: editor);
 *      - "Ver conteudo mesmo assim": esconde o aviso para copiar um texto nao
 *        salvo, com o alerta de que qualquer acao ali pode derrubar a sessao.
 * 4. O evento "storage" avisa as abas ja abertas no momento em que alguem faz
 *    login em outra aba, sem precisar recarregar nada.
 *
 * Liga/desliga: opcao "protegersessao" nas Configuracoes do SEI Pro (padrao:
 * ligada). O modulo le a configuracao direto de localStorage.configBasePro,
 * no mesmo formato de verifyConfigValue (sei-functions-pro.js), mas trata
 * "sem valor salvo" como ligado, ja que o padrao da opcao e ligado.
 *
 * LIMITES
 * -------
 * - A extensao nao le o cookie da sessao (HttpOnly). A "sessao" e identificada
 *   pelo momento do login neste navegador. Login feito em outro navegador nao
 *   e percebido (e nem precisa: la o cookie e outro).
 * - Requisicoes AJAX disparadas por scripts da aba antiga nao sao bloqueadas,
 *   so a navegacao dos quadros e os cliques. Na pratica as quedas observadas
 *   vieram de navegacao de quadro (Iniciador "Outros" no DevTools).
 */
(function () {
    'use strict';

    // So a janela de topo decide e mostra o aviso. Os quadros da mesma aba
    // herdam a situacao da janela de topo.
    if (window.top !== window) return;

    var CHAVE_INICIO = 'seipro_sessaoInicio';
    var NOME_OPCAO = 'protegersessao';
    var ID_AVISO = 'seiproAvisoSessao';

    // Horario em que ESTE documento comecou a carregar.
    var abertaEm = Math.floor(performance.timeOrigin || Date.now());

    function opcaoLigada() {
        try {
            var base = JSON.parse(localStorage.getItem('configBasePro') || '[]');
            var geral = null;
            for (var i = 0; i < base.length; i++) {
                if (base[i] && base[i].configGeral) { geral = base[i].configGeral; break; }
            }
            if (!geral) return true;
            for (var j = 0; j < geral.length; j++) {
                if (geral[j] && geral[j].name === NOME_OPCAO) return geral[j].value !== false;
            }
            return true;
        } catch (e) {
            return true;
        }
    }

    // A pagina chegou direto do login? Com a Referrer-Policy padrao
    // (strict-origin-when-cross-origin) o referrer vem so com a origem, ex.:
    // "https://sip.portoalegre.rs.gov.br/". Aceita host comecando com "sip" ou
    // caminho com /sip/ (instalacoes em que o SIP fica no mesmo host).
    function vemDoLogin() {
        var ref = document.referrer || '';
        if (!ref) return false;
        try {
            var u = new URL(ref);
            if (u.origin === location.origin) return /\/sip\//i.test(u.pathname) || /login\.php/i.test(u.pathname);
            return /^sip[.-]/i.test(u.hostname) || /\/sip\//i.test(u.pathname);
        } catch (e) {
            return false;
        }
    }

    function inicioDaSessao() {
        var v = parseInt(localStorage.getItem(CHAVE_INICIO) || '0', 10);
        return isNaN(v) ? 0 : v;
    }

    function raizDoSei() {
        // ".../sei/controlador.php?..." -> ".../sei/"
        var m = location.pathname.match(/^(.*?\/sei\/)/i);
        return location.origin + (m ? m[1] : '/');
    }

    function pararQuadros() {
        var quadros = document.querySelectorAll('iframe');
        for (var i = 0; i < quadros.length; i++) {
            try { quadros[i].contentWindow.stop(); } catch (e) { /* cross-origin */ }
            try { quadros[i].removeAttribute('src'); } catch (e) {}
        }
    }

    function mostrarAviso() {
        if (document.getElementById(ID_AVISO)) return;
        if (!document.body) {
            document.addEventListener('DOMContentLoaded', mostrarAviso, { once: true });
            return;
        }
        pararQuadros();

        var aviso = document.createElement('div');
        aviso.id = ID_AVISO;
        aviso.setAttribute('role', 'alertdialog');
        aviso.setAttribute('aria-modal', 'true');
        aviso.style.cssText = [
            'position:fixed', 'inset:0', 'z-index:2147483647',
            'background:rgba(20,24,28,.82)', 'display:flex',
            'align-items:center', 'justify-content:center',
            'font-family:Arial,Helvetica,sans-serif'
        ].join(';');

        var caixa = document.createElement('div');
        caixa.style.cssText = [
            'background:#fff', 'color:#222', 'max-width:460px', 'width:90%',
            'border-radius:10px', 'padding:22px 24px', 'box-shadow:0 10px 40px rgba(0,0,0,.4)',
            'font-size:14px', 'line-height:1.45'
        ].join(';');

        var podeFechar = !!window.opener;
        caixa.innerHTML =
            '<div style="font-size:16px;font-weight:bold;margin-bottom:8px">Esta aba é de uma sessão anterior do SEI</div>' +
            '<div style="margin-bottom:16px">Você entrou no SEI de novo depois que esta aba foi aberta. ' +
            'Os links daqui são da sessão antiga, e usar esta aba faria o SEI derrubar o seu login atual ' +
            '(<i>Hash inválido</i>).</div>' +
            '<div style="display:flex;gap:8px;flex-wrap:wrap">' +
            '<button type="button" data-acao="abrir" style="background:#155f7a;color:#fff;border:0;border-radius:6px;padding:8px 14px;cursor:pointer;font-size:14px">Abrir SEI atualizado</button>' +
            (podeFechar ? '<button type="button" data-acao="fechar" style="background:#e9ecef;color:#222;border:0;border-radius:6px;padding:8px 14px;cursor:pointer;font-size:14px">Fechar janela</button>' : '') +
            '<button type="button" data-acao="ver" style="background:none;color:#555;border:0;padding:8px 4px;cursor:pointer;font-size:13px;text-decoration:underline">Ver conteúdo mesmo assim</button>' +
            '</div>' +
            '<div style="margin-top:12px;font-size:12px;color:#777">SEI Pro: proteção de sessão. Pode ser desligada nas Configurações.</div>';

        caixa.addEventListener('click', function (ev) {
            var alvo = ev.target.closest('button[data-acao]');
            if (!alvo) return;
            var acao = alvo.getAttribute('data-acao');
            if (acao === 'abrir') {
                location.replace(raizDoSei());
            } else if (acao === 'fechar') {
                window.close();
            } else if (acao === 'ver') {
                if (confirm('Só use esta aba para copiar algum texto que não foi salvo. Clicar em links, salvar ou navegar aqui pode derrubar o seu login atual. Mostrar o conteúdo?')) {
                    aviso.remove();
                    document.documentElement.setAttribute('data-seipro-sessao-antiga', '1');
                }
            }
        });

        aviso.appendChild(caixa);
        document.body.appendChild(aviso);
        try { aviso.querySelector('button').focus(); } catch (e) {}
    }

    function verificar() {
        if (!opcaoLigada()) return;
        var inicio = inicioDaSessao();
        if (inicio && abertaEm < inicio) mostrarAviso();
    }

    // O SEI abre em branco quando se chega na raiz (/sei/), em index.php,
    // inicializar.php ou em acao=principal -- a area de conteudo vem vazia do proprio servidor.
    // Acontece, por exemplo, depois do botao "Abrir SEI atualizado" deste modulo ou de entrar de novo
    // no SEI apos uma queda de sessao. Nesses casos a pagina vai sozinha para o Controle de Processos,
    // pelo link do proprio menu (que ja traz o hash da sessao atual).
    function paginaInicialVazia() {
        var p = location.pathname;
        var acao = new URLSearchParams(location.search).get('acao');
        var ehInicio = /\/sei\/?$/i.test(p) || /\/sei\/(index|inicializar)\.php$/i.test(p) || acao === 'principal';
        if (!ehInicio) return false;
        var dados = document.getElementById('divInfraAreaDados');
        return !!dados && dados.children.length === 0 && !dados.textContent.trim();
    }

    function irParaControleSeVazio() {
        if (!opcaoLigada() || !paginaInicialVazia()) return;
        // Aba de sessao anterior: os links dela tem hash velho, entao fica o aviso.
        var inicio = inicioDaSessao();
        if (inicio && abertaEm < inicio) return;
        try {
            var ultima = parseInt(sessionStorage.getItem('seipro_irControle') || '0', 10) || 0;
            if (Date.now() - ultima < 15000) return; // nunca entra em laco
            sessionStorage.setItem('seipro_irControle', String(Date.now()));
        } catch (e) {}
        var link = document.querySelector('#infraMenu a[href*="acao=procedimento_controlar"]') ||
                   document.querySelector('a[href*="acao=procedimento_controlar"]');
        if (link && link.href) location.replace(link.href);
    }

    // 1. Esta pagina e a primeira depois do login? Marca o inicio da sessao.
    if (opcaoLigada() && vemDoLogin()) {
        // Grava o horario de abertura DESTA pagina (nao Date.now()), para ela mesma
        // nunca se considerar anterior ao login, por mais que demore para carregar.
        try { localStorage.setItem(CHAVE_INICIO, String(abertaEm)); } catch (e) {}
    }

    // 2. Esta pagina ja nasceu velha (ex.: aba restaurada do dia anterior)?
    verificar();

    // 3. Login feito em OUTRA aba depois desta abrir.
    window.addEventListener('storage', function (ev) {
        if (ev.key === CHAVE_INICIO) verificar();
    });

    // 5. Pagina inicial em branco: vai para o Controle de Processos.
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', irParaControleSeVazio, { once: true });
    else irParaControleSeVazio();

    // 4. Aba que ficou em segundo plano: confere de novo ao voltar a ela.
    document.addEventListener('visibilitychange', function () {
        if (document.visibilityState === 'visible') verificar();
    });
})();
