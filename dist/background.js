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

/******************************************************************************
 * FIX CSP: Proxy de requisições externas bloqueadas pela CSP da página SEI
 *
 * O content script não pode fazer fetch() para seipro.app/servers/ porque a
 * CSP do SEI bloqueia conexões externas ("default-src 'self'").
 * O background service worker tem origem própria e não está sujeito à CSP
 * da página, então ele faz a requisição e devolve ao content script via
 * chrome.runtime.sendMessage / onMessage.
 ******************************************************************************/
browser.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message && message.type === 'FETCH_EXTERNAL') {
    var url = message.url;
    // Whitelist de domínios permitidos (segurança)
    var allowed = ['seipro.app', 'sei-pro.github.io'];
    var isAllowed = allowed.some(function(d) { return url.indexOf(d) !== -1; });

    if (!isAllowed) {
      sendResponse({ error: 'URL não permitida' });
      return false;
    }

    fetch(url, { method: 'GET', headers: { 'Accept': 'application/json' } })
      .then(function(r) { return r.json(); })
      .then(function(data) { sendResponse({ data: data }); })
      .catch(function(e)  { sendResponse({ error: e.message || 'Erro de rede' }); });

    return true; // mantém o canal aberto para resposta assíncrona
  }
  return false;
});
