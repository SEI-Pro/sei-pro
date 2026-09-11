/**
 * Lado do SEI, MUNDO ISOLADO.
 *
 * Este arquivo entra como content script e existe por uma razão só: `chrome.*`
 * não existe no mundo da página. Ele é o carteiro entre a porta da extensão e o
 * código que realmente sabe conversar com o SEI — aquele roda no mundo da
 * página, onde estão a sessão, o DOM da árvore e as funções do SEI Pro.
 *
 *   página da extensão  <--porta chrome.runtime-->  ESTE ARQUIVO
 *                                                        |
 *                                              window.postMessage
 *                                                        |
 *                                         js/sei-pro-ferramentaspdf.js
 *                                            (mundo da página, faz o trabalho)
 *
 * Os dois mundos compartilham o mesmo documento, então `window.postMessage`
 * atravessa entre eles — é o único caminho, já que não compartilham variáveis.
 */

import { CANAL, CHAVE_ABERTURA, ehDoCanal } from "@/ponte/protocolo";

const MARCA_INTERNA = "seipro-fpdf-interno";

let porta: chrome.runtime.Port | null = null;

/**
 * Abre a porta para a página da ferramenta.
 *
 * `trocar` descarta a porta atual antes de abrir outra. É o que acontece quando
 * uma página NOVA avisa que abriu: a porta que temos aponta para a página
 * anterior, que pode já estar fechada. Sem isso, quem fechasse e reabrisse a
 * ferramenta ficava sem conexão para sempre -- e a tela dizia que o SEI não
 * estava respondendo, quando o SEI estava ali o tempo todo.
 */
function conectar(trocar = false): void {
  if (porta && !trocar) return;
  if (porta && trocar) {
    try {
      porta.disconnect();
    } catch {
      /* já estava morta */
    }
    porta = null;
  }
  try {
    const p = chrome.runtime.connect({ name: CANAL });
    porta = p;

    p.onDisconnect.addListener(() => {
      // Ler `lastError` evita o aviso de erro não tratado quando não há
      // nenhuma página da ferramenta aberta — que é o caso normal.
      void chrome.runtime.lastError;
      porta = null;
    });

    // Pedido vindo da página: repassa ao mundo da página e devolve a resposta.
    p.onMessage.addListener((m: unknown) => {
      if (!ehDoCanal(m)) return;
      window.postMessage({ __marca: MARCA_INTERNA, direcao: "pedido", dados: m }, "*");
    });

    apresentar();
  } catch {
    // Nenhuma página da ferramenta aberta ainda. Tentaremos quando ela avisar.
    porta = null;
  }
}

/** Pede ao mundo da página o contexto atual e o envia pela porta. */
function apresentar(): void {
  window.postMessage({ __marca: MARCA_INTERNA, direcao: "apresentar" }, "*");
}

// Respostas e apresentações vindas do mundo da página.
window.addEventListener("message", (ev: MessageEvent) => {
  // Só mensagens deste próprio documento: `postMessage` entre mundos tem a
  // mesma origem, então qualquer outra origem aqui é de terceiro.
  if (ev.source !== window) return;
  const m = ev.data as { __marca?: string; direcao?: string; dados?: unknown };
  if (m?.__marca !== MARCA_INTERNA) return;

  if (m.direcao === "resposta" && porta) {
    try {
      porta.postMessage(m.dados);
    } catch {
      porta = null;
    }
    return;
  }

  if (m.direcao === "ola" && porta) {
    try {
      porta.postMessage(m.dados);
    } catch {
      porta = null;
    }
  }
});

// A página avisa que abriu gravando no storage; é o gatilho para conectar.
try {
  chrome.storage.onChanged.addListener((mudancas, area) => {
    // Uma página NOVA abriu: trocar a porta, não manter a antiga.
    if (area === "local" && mudancas[CHAVE_ABERTURA]) conectar(true);
  });
} catch {
  // Sem storage, resta a tentativa inicial abaixo.
}

// Se a ferramenta já estava aberta quando esta aba do SEI carregou, conecta
// agora: o aviso de abertura veio antes de existir quem o escutasse.
try {
  void chrome.storage.local.get(CHAVE_ABERTURA).then((v) => {
    if (v && v[CHAVE_ABERTURA]) conectar();
  });
} catch {
  /* sem storage */
}

// O contexto muda quando o usuário abre um processo sem trocar de aba.
window.addEventListener("hashchange", apresentar);

/**
 * Batida de manutenção.
 *
 * Com porta aberta, reapresenta o contexto -- o usuário pode ter aberto um
 * processo desde a última vez. SEM porta, tenta abrir uma: o aviso de abertura
 * pode ter chegado antes desta aba do SEI terminar de carregar, e sem esta
 * tentativa a conexão nunca aconteceria.
 */
setInterval(() => {
  if (porta) apresentar();
  else void tentarConectarSeHaPagina();
}, 5_000);

/** Só tenta conectar se alguma página da ferramenta tiver se anunciado. */
async function tentarConectarSeHaPagina(): Promise<void> {
  try {
    const v = await chrome.storage.local.get(CHAVE_ABERTURA);
    if (v && v[CHAVE_ABERTURA]) conectar();
  } catch {
    /* sem storage */
  }
}
