/******************************************************************************
 SPro: Extensão para o Firefox e Chrome que adiciona ao Sistema Eletrônico de Informações (SEI) funções avançadas.
 Autor: Pedro Henrique Soares (pedrohsoares.adv@gmail.com)
*******************************************************************************/

function handleInstalled(details) {
  console.log(details.reason);

  // O onInstalled tambem dispara quando o NAVEGADOR e atualizado (chrome_update / browser_update) e
  // quando um modulo compartilhado muda: nesses casos nao ha novidade do SEI Pro para mostrar.
  if (details.reason != "install" && details.reason != "update") return;
  // Recarregar a extensao descompactada tambem gera "update", mas sem mudar a versao.
  if (details.reason == "update" && details.previousVersion == browser.runtime.getManifest().version) return;

  function onError(error) { console.log(`Error: ${error}`); }
  function AbrirUrlSeiPro(item) {
    // Ao instalar ou atualizar.
    item.InstallOrUpdate = true;
    browser.storage.local.set(item);

    // A instalacao era deduzida da ausencia de CheckTypes, chave da extensao antiga (SPro) que as
    // configuracoes atuais nao gravam mais (elas usam storage.sync/dataValues): sem o details.reason,
    // toda atualizacao abria a pagina inicial em vez do historico de versoes.
    if (details.reason == "install") {
      browser.tabs.create({ url: "https://seipro.app/" });
    } else if (item.CheckTypes == undefined || item.CheckTypes.indexOf("hidemsgupdate") == -1) {
      browser.tabs.create({ url: "https://seipro.app/pages/HISTORICO.html" + conviteDeAvaliacao(details.previousVersion) });
    }
  }

  if (isChrome) { /* Chrome: */
    browser.storage.local.get("CheckTypes", AbrirUrlSeiPro);
  } else {
    var gettingItem = browser.storage.local.get("CheckTypes");
    gettingItem.then(AbrirUrlSeiPro, onError);
  }
}

/******************************************************************************
 * Convite para avaliar o SEI Pro na loja: o historico de versoes mostra um
 * modal quando recebe #avaliar=<loja>&versao=<versao> (assets/js/avaliacao.js
 * no site). Vai no fragmento, e nao na query, para nao chegar ao servidor.
 *
 * So convida quando a atualizacao traz novidades (muda o 1o ou o 2o numero:
 * 2.2.5 -> 2.3 sim, 2.3 -> 2.3.1 nao) e quando a extensao veio de uma loja
 * conhecida, pelo ID: o Lab, os whitelabels e a descompactada ficam de fora.
 * Quantas vezes a mesma pessoa ve o convite, quem decide e o site.
 ******************************************************************************/
var LOJAS_DE_AVALIACAO = {
  pdbbapplhjopafpgidbgceccbbmehcjj: "chrome",
  gkhfbbbminanojfklpfmloaglckmlfne: "edge"
};

function atualizacaoComNovidades(anterior, atual) {
  var a = String(anterior || "").split(".").map(function (n) { return parseInt(n, 10) || 0; });
  var b = String(atual || "").split(".").map(function (n) { return parseInt(n, 10) || 0; });
  if (b[0] != a[0]) return b[0] > a[0];
  return (b[1] || 0) > (a[1] || 0);
}

function conviteDeAvaliacao(versaoAnterior) {
  var loja = LOJAS_DE_AVALIACAO[browser.runtime.id];
  var versao = browser.runtime.getManifest().version;
  if (!loja || !atualizacaoComNovidades(versaoAnterior, versao)) return "";
  return "#avaliar=" + loja + "&versao=" + versao;
}

/******************************************************************************
 * Inicio                                                                     *
 ******************************************************************************/
const isChrome = (typeof browser === "undefined"); /* Chrome: */
if (isChrome) { var browser = chrome; } /* Chrome: */

browser.runtime.onInstalled.addListener(handleInstalled);

// O Chrome recente tambem expoe um `browser` global no service worker (medido no Chrome 152), entao
// isChrome deixou de separar os dois navegadores. getBrowserInfo so existe no Firefox: chamado no Chrome,
// o erro no carregamento derruba o registro do service worker e o onInstalled nunca dispara.
if(!isChrome && typeof browser.runtime.getBrowserInfo === "function") {
  browser.runtime.getBrowserInfo().then(function (info) {
    browser.storage.local.set({version: info.version}).then(null, null);
  });
}

/******************************************************************************
 * Painel lateral (html/painel.html, abas Favoritos | Historico | Projetos | Agente): o botao
 * Favoritos da barra do SEI (js/init_favoritos.js) pede {tipo: "abrirPainel",
 * aba}, o icone dos projetos na arvore (js/init_projetos.js) pede a aba
 * "projetos" e o item "Agente de IA" do menu (js/init_agente.js) pede "abrirAgente".
 * O clique do usuario e o gesto que o Chrome exige para sidePanel.open; por
 * isso a chamada e feita direto no listener, ANTES de qualquer await. A aba
 * pedida vai para o storage.session como {aba, janela, t}: o painel le ao abrir
 * e, se ja estiver aberto, troca de aba pelo onChanged, mas so se a janela for
 * a dele (o storage.session e um so para todas as janelas).
 ******************************************************************************/
function gravarAbaDoPainel(aba, janela) {
  if (!browser.storage || !browser.storage.session) return;
  try {
    var p = browser.storage.session.set({ painelAba: { aba: aba, janela: typeof janela === "number" ? janela : null, t: Date.now() } });
    if (p && p.catch) p.catch(function () { /* sem sessao: o painel abre na aba padrao */ });
  } catch (e) { /* idem */ }
}

/******************************************************************************
 * Escolher arquivo de sincronia (issue #186): o Chrome nao deixa o seletor de arquivo abrir
 * em iframe de outra origem, e os apps do SEI Pro rodam em iframe na pagina do SEI. O app pede
 * {tipo: "escolherArquivoEmJanela", id, modo, nome, descricao}; aqui abrimos html/escolher-arquivo.html
 * numa janela de nivel superior, onde o seletor funciona. A janela grava o handle no IndexedDB da
 * extensao e avisa o app (sei-comum/src/sincronia/escolhaPorJanela.ts). No Firefox nao ha seletor.
 ******************************************************************************/
function abrirJanelaDeEscolha(msg) {
  if (typeof chrome === "undefined" || !chrome.windows || !chrome.windows.create) return;
  var q = new URLSearchParams({ id: String(msg.id || ""), modo: String(msg.modo || ""), nome: String(msg.nome || ""), descricao: String(msg.descricao || "") });
  chrome.windows.create({ url: chrome.runtime.getURL("html/escolher-arquivo.html?" + q.toString()), type: "popup", width: 520, height: 320, focused: true });
}

browser.runtime.onMessage.addListener(function (msg, sender) {
  if (msg && msg.tipo === "escolherArquivoEmJanela") { abrirJanelaDeEscolha(msg); return; }
  if (!msg || (msg.tipo !== "abrirAgente" && msg.tipo !== "abrirPainel") || !sender || !sender.tab) return;
  var aba = msg.tipo === "abrirAgente" || msg.aba === "agente" ? "agente" : msg.aba === "historico" ? "historico" : msg.aba === "projetos" ? "projetos" : msg.aba === "demandas" ? "demandas" : "favoritos";
  if (typeof chrome !== "undefined" && chrome.sidePanel && chrome.sidePanel.open) {
    chrome.sidePanel.open({ tabId: sender.tab.id }).catch(function (e) { console.log(e); });
  } else if (browser.sidebarAction && browser.sidebarAction.open) {
    browser.sidebarAction.open();
  }
  gravarAbaDoPainel(aba, sender.tab.windowId);
});

/******************************************************************************
 * Rotinas do Agente de IA: o alarme AVISA, o painel EXECUTA.
 *
 * A sessao do SEI e da aba do usuario, e a ponte liga o content script direto
 * ao painel: nao ha como consultar o SEI daqui. Entao, na hora marcada, se o
 * painel esta aberto (porta "agente-vivo"), pedimos que ele rode; se nao esta,
 * mostramos uma notificacao que ao ser clicada abre o agente.
 *
 * No Firefox nada disto roda: o manifest v2 do SEI Pro nao declara background.
 ******************************************************************************/
var portasDoAgente = [];

browser.runtime.onConnect.addListener(function (porta) {
  if (!porta || porta.name !== "agente-vivo") return;
  portasDoAgente.push(porta);
  porta.onDisconnect.addListener(function () {
    portasDoAgente = portasDoAgente.filter(function (p) { return p !== porta; });
  });
});

function avisarRotinaPendente(id, nome) {
  if (!browser.notifications || !browser.notifications.create) return;
  browser.notifications.create("rotina-pendente:" + id, {
    type: "basic",
    iconUrl: browser.runtime.getURL("icons/menu/botpro_icon.svg"),
    title: "Rotina pendente: " + nome,
    // "Abra o agente" e literal: a rotina so roda com o painel aberto.
    message: "Abra o Agente de IA para rodar esta rotina."
  }, function () { /* sem permissao de notificacao: nada a fazer */ });
}

if (browser.alarms && browser.alarms.onAlarm) {
  browser.alarms.onAlarm.addListener(function (alarme) {
    if (!alarme || alarme.name.indexOf("rotina:") !== 0) return;
    var id = alarme.name.slice("rotina:".length);
    if (portasDoAgente.length) {
      portasDoAgente.forEach(function (p) { p.postMessage({ tipo: "rodarRotinas", rotina: id }); });
      return;
    }
    browser.storage.local.get("agenteIA_rotinas").then(function (v) {
      var lista = (v && v.agenteIA_rotinas) || [];
      var achadas = lista.filter(function (x) { return x.id === id; });
      if (achadas.length && achadas[0].ativa) avisarRotinaPendente(id, achadas[0].nome);
    });
  });
}

if (browser.notifications && browser.notifications.onClicked) {
  browser.notifications.onClicked.addListener(function (id) {
    if (id.indexOf("rotina") !== 0) return;
    browser.notifications.clear(id);
    gravarAbaDoPainel("agente");
    function emAba() { browser.tabs.create({ url: browser.runtime.getURL("html/agente.html") }); }
    // O clique na notificacao e gesto do usuario: serve para abrir o painel.
    if (typeof chrome !== "undefined" && chrome.sidePanel && chrome.sidePanel.open) {
      browser.tabs.query({ active: true, currentWindow: true }).then(function (abas) {
        if (abas && abas.length) chrome.sidePanel.open({ tabId: abas[0].id }).catch(emAba);
        else emAba();
      });
    } else if (browser.sidebarAction && browser.sidebarAction.open) {
      browser.sidebarAction.open();
    } else {
      emAba();
    }
  });
}
