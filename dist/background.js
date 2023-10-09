/******************************************************************************
 SPro: Extensão para o Firefox e Chrome que adiciona ao Sistema Eletrônico de Informações (SEI) funções avançadas.
 Autor: Pedro Henrique Soares (pedrohsoares.adv@gmail.com)
*******************************************************************************/

function handleInstalled(details) {
  console.log(details.reason);

  function onError(error) { console.log(`Error: ${error}`); }
  function AbrirUrlSeiPro(item) {
    // Ao instalar ou atualizar.
    item.InstallOrUpdate = true;
    browser.storage.local.set(item);

    if (item.CheckTypes == undefined) {
      browser.tabs.create({ url: "https://sei-pro.github.io/sei-pro/" });
    } else if (item.CheckTypes.indexOf("hidemsgupdate") == -1) {
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

if(!isChrome) {
  browser.runtime.getBrowserInfo().then(function (info) {
    browser.storage.local.set({version: info.version}).then(null, null);
  });
}
