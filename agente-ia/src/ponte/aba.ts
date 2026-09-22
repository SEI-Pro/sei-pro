/**
 * Lado do SEI da ponte — content script, MUNDO ISOLADO (`js/init_agente.js`).
 *
 * Diferente das Ferramentas de PDF, aqui não há um segundo arquivo no mundo da
 * página: o `sei-nucleo` só precisa de `fetch` e `DOMParser`, que o mundo
 * isolado tem, e o `fetch` do content script vai ao SEI com os cookies da
 * sessão. Resultado: a sessão, os dados e a conversa ficam invisíveis para os
 * scripts do SEI (e para qualquer script de terceiro que a página carregue).
 *
 * Só a janela de topo participa: frames internos (árvore, visualização) não
 * abrem porta.
 */

import { comoErroSei, ErroSei } from "@nucleo/sessao/erros";
import type { Pagina } from "@nucleo/sessao/http";
import { Sei } from "@nucleo/sei";
import { executarOperacao, lerTela } from "./operacoes";
import { CANAL, CHAVE_ABERTURA, ehDoCanal, type Apresentacao, type MensagemPainel, type Resposta } from "./protocolo";

declare global {
  interface Window {
    __seiProAgente?: boolean;
  }
}

function iniciar(): void {
  if (window.top !== window || window.__seiProAgente) return;
  // Só telas do SEI com sessão (tem o cabeçalho com a unidade).
  if (!document.querySelector("#lnkInfraUnidade, #frmProtocoloPesquisaRapida")) return;
  window.__seiProAgente = true;

  // A tela viva, com cache curto: `outerHTML` da caixa tem centenas de KB.
  let cache: { quando: number; pagina: Pagina } | null = null;
  const paginaViva = (): Pagina => {
    if (!cache || Date.now() - cache.quando > 3000) {
      cache = { quando: Date.now(), pagina: { url: location.href, status: 200, html: document.documentElement.outerHTML, doc: document } };
    }
    return cache.pagina;
  };
  const sei = new Sei(location.href, paginaViva);
  const emCurso = new Map<string, AbortController>();
  let porta: chrome.runtime.Port | null = null;
  let ultimoFoco = document.hasFocus() ? Date.now() : 0;

  const apresentar = () => {
    if (!porta) return;
    const ola: Apresentacao = {
      canal: CANAL,
      tipo: "ola",
      host: location.host,
      visivel: document.visibilityState === "visible",
      foco: ultimoFoco,
      titulo: document.title,
    };
    try {
      porta.postMessage(ola);
    } catch {
      porta = null;
    }
  };

  const responder = (r: Omit<Resposta, "canal" | "tipo">) => {
    try {
      porta?.postMessage({ canal: CANAL, tipo: "resposta", ...r } satisfies Resposta);
    } catch {
      porta = null;
    }
  };

  async function atender(m: MensagemPainel): Promise<void> {
    if (m.tipo === "cancelar") {
      emCurso.get(m.id)?.abort();
      return;
    }
    const ctl = new AbortController();
    emCurso.set(m.id, ctl);
    try {
      const dados = m.op === "tela" ? lerTela(document, location.href) : await executarOperacao(sei, m.op, m.args ?? {}, ctl.signal);
      responder({ id: m.id, ok: true, dados });
    } catch (e) {
      const erro = ctl.signal.aborted ? new ErroSei("CANCELADO", "Opera\u00E7\u00E3o cancelada.") : comoErroSei(e);
      responder({ id: m.id, ok: false, erro: { codigo: erro.codigo, mensagem: erro.message, detalhe: erro.detalhe } });
    } finally {
      emCurso.delete(m.id);
    }
  }

  function conectar(trocar = false): void {
    if (porta && !trocar) return;
    if (porta) {
      try {
        porta.disconnect();
      } catch {
        /* já morta */
      }
      porta = null;
    }
    try {
      const p = chrome.runtime.connect({ name: CANAL });
      porta = p;
      p.onDisconnect.addListener(() => {
        void chrome.runtime.lastError;
        porta = null;
        for (const c of emCurso.values()) c.abort();
      });
      p.onMessage.addListener((m: unknown) => {
        if (ehDoCanal(m)) void atender(m as MensagemPainel);
      });
      apresentar();
    } catch {
      porta = null;
    }
  }

  const painelAberto = async () => {
    try {
      const v = await chrome.storage.local.get(CHAVE_ABERTURA);
      return Boolean(v?.[CHAVE_ABERTURA]);
    } catch {
      return false;
    }
  };

  chrome.storage.onChanged.addListener((mud, area) => {
    if (area === "local" && mud[CHAVE_ABERTURA]?.newValue) conectar(true);
  });
  void painelAberto().then((sim) => sim && conectar());
  setInterval(() => (porta ? apresentar() : void painelAberto().then((sim) => sim && conectar())), 5000);

  const marcarFoco = () => {
    ultimoFoco = Date.now();
    apresentar();
  };
  window.addEventListener("focus", marcarFoco);
  document.addEventListener("visibilitychange", () => document.visibilityState === "visible" && marcarFoco());
  window.addEventListener("hashchange", apresentar);

  instalarEntradaNoMenu();
}

/** Item "Agente de IA" no menu do SEI; o clique pede ao service worker que abra o painel. */
function instalarEntradaNoMenu(): void {
  // Mesmo lugar em que o legado põe os itens do SEI Pro (`idMenu` em sei-functions-pro.js):
  // a lista de primeiro nível do menu lateral (SEI 4/5) ou da área esquerda (SEI 3).
  const menu = document.querySelector(
    "#divInfraSidebarMenu #infraMenu, #divInfraSidebarMenu #main-menu, #divInfraAreaTelaE #infraMenu, #divInfraAreaTelaE #main-menu, #infraMenu, #main-menu",
  );
  if (!menu || document.getElementById("seiProAgenteMenu")) return;
  const lista = menu.tagName === "UL" ? menu : (menu.querySelector(":scope > ul") ?? menu);
  const li = document.createElement("li");
  const a = document.createElement("a");
  const rotulo = document.createElement("span");
  a.id = "seiProAgenteMenu";
  a.href = "#";
  a.className = "newLinksMenuPro";
  a.title = "Abrir o Agente de IA do SEI Pro no painel lateral";
  rotulo.textContent = "Agente de IA";
  a.append(rotulo);
  a.addEventListener("click", (ev) => {
    ev.preventDefault();
    chrome.runtime.sendMessage({ tipo: "abrirAgente" }).catch(() => undefined);
  });
  li.append(a);
  lista.append(li);
}

iniciar();
