/**
 * O app (iframe abaixo da lista) aceita a porta do content script da PRÓPRIA
 * aba, do frame de topo. O `onConnect` chega a todas as páginas da extensão
 * (os iframes do painel em outras abas e o painel lateral também), e cada
 * uma recusa o que não é seu. Uma porta `chrome.runtime` não pode ser forjada
 * pela página do SEI, ao contrário de um `postMessage` com token na URL do iframe.
 *
 * Se `chrome.tabs.getCurrent` não responder dentro do iframe (prova P2), vale
 * a origem do pai (`document.referrer`), aceitando a primeira porta dessa origem.
 */

import { criarRpc, type PortaRpc, type Rpc, type Tratador } from "./rpc";

/** Página da extensão no Firefox (`moz-extension:`). */
export function ehFirefox(): boolean {
  try {
    return chrome.runtime.getURL("").startsWith("moz-extension:");
  } catch {
    return false;
  }
}

/** `tratadores`: o que a aba pode pedir ao app (o objeto é lido a cada pedido: dá para preencher depois). */
export function esperarConexaoDaAba(canal: string, tratadores: Record<string, Tratador> = {}): Promise<Rpc> {
  // Firefox: a porta do content script não chega a um iframe da extensão na mesma aba. O relé do background
  // (`ponte/rele.ts`, só no pacote do Firefox) liga as duas pontas pela aba e pelo canal, e já confere o que
  // aqui se confere (mesma aba, frame de topo): o app só abre a porta com ele.
  if (ehFirefox()) {
    console.info(`[SEI Pro] ${canal} conectado pelo relé`);
    return Promise.resolve(criarRpc(chrome.runtime.connect({ name: canal }) as unknown as PortaRpc, tratadores));
  }
  const minhaAba = (async () => {
    try {
      return (await chrome.tabs?.getCurrent?.())?.id;
    } catch {
      return undefined;
    }
  })();
  const origemPai = (() => {
    try {
      return new URL(document.referrer).origin;
    } catch {
      return "";
    }
  })();
  return new Promise((ok) => {
    let aceita = false;
    chrome.runtime.onConnect.addListener((porta) => {
      if (porta.name !== canal || aceita) return;
      void minhaAba.then((aba) => {
        const s = porta.sender;
        const daAba = aba !== undefined ? s?.tab?.id === aba : !!origemPai && !!s?.url && new URL(s.url).origin === origemPai;
        if (aceita || !daAba || s?.frameId !== 0) {
          porta.disconnect();
          return;
        }
        aceita = true;
        console.info(`[SEI Pro] ${canal} conectado`, aba !== undefined ? "pela aba" : "pela origem");
        ok(criarRpc(porta, tratadores));
      });
    });
  });
}
