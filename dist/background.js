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
      browser.tabs.create({ url: "https://sei-pro.github.io/sei-pro/" });
    } else if (item.CheckTypes == undefined || item.CheckTypes.indexOf("hidemsgupdate") == -1) {
      browser.tabs.create({ url: "https://sei-pro.github.io/sei-pro/pages/HISTORICO.html" });
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
