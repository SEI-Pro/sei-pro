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
import { alvoParaMostrar, executarOperacao, lerTela, type RespostaFluxo } from "./operacoes";
import { abrirNoVisualizador, marcarAvisoDeFluxo, mostrarCartaoNaCapa, recarregarArvore } from "./capa";
import { cartaoDaCapa } from "../fluxos/cartao";
import { CHAVE_FLUXOS, CHAVE_IGNORADOS, comIgnorada, type Fluxo, type Ignorados } from "../fluxos/modelo";
import { abridorDe, CANAL, CHAVE_ABERTURA, ehDoCanal, precisaConectar, type Apresentacao, type MensagemPainel, type Resposta } from "./protocolo";

declare global {
  interface Window {
    __seiProAgente?: boolean;
  }
}

/**
 * Assinatura do que está na tela, só com leituras baratas de DOM: a tela
 * inteira (`lerTela`) custa caro para ficar mandando a cada apresentação.
 */
function contextoDaTela(): string {
  try {
    const p = new URL(location.href).searchParams;
    const vis = document.querySelector<HTMLIFrameElement>("#ifrConteudoVisualizacao, #ifrVisualizacao")?.contentWindow?.location.href ?? "";
    const documento = /[?&]id_documento=(\d+)/.exec(vis)?.[1] ?? "";
    const marcados = document.querySelectorAll("#tblProcessosRecebidos input:checked, #tblProcessosGerados input:checked, #tblProcessosDetalhado input:checked").length;
    return [p.get("acao") ?? "", p.get("id_procedimento") ?? "", documento, marcados].join("|");
  } catch {
    return "";
  }
}

/** Canal com o painel: porta, apresentação, reconexão e foco. Comum às telas do SEI e à janela do editor. */
function abrirCanal(
  papel: "sei" | "editor",
  documento: string | undefined,
  executar: (op: string, args: Record<string, unknown>, sinal: AbortSignal) => Promise<unknown>,
  aoCairAPorta?: () => void,
): void {
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
      papel,
      documento,
      contexto: contextoDaTela(),
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
      responder({ id: m.id, ok: true, dados: await executar(m.op, m.args ?? {}, ctl.signal) });
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
        aoCairAPorta?.();
      });
      p.onMessage.addListener((m: unknown) => {
        if (ehDoCanal(m)) void atender(m as MensagemPainel);
      });
      apresentar();
    } catch {
      porta = null;
    }
  }

  /** Páginas da extensão já servidas por uma conexão desta aba. */
  const servidos = new Set<string>();
  const marcarServido = (valor: unknown) => {
    const quem = abridorDe(valor);
    if (quem) servidos.add(quem);
  };
  const avisoAberto = async () => {
    try {
      return (await chrome.storage.local.get(CHAVE_ABERTURA))?.[CHAVE_ABERTURA];
    } catch {
      return undefined;
    }
  };
  const atenderAviso = (valor: unknown) => {
    if (!precisaConectar(valor, Boolean(porta), servidos)) return;
    // Trocar a porta no meio de uma operação a mataria com "a aba foi
    // recarregada": quem chegou agora espera o fim do que está em curso.
    if (porta && emCurso.size) return;
    conectar(Boolean(porta));
    marcarServido(valor);
  };

  // O painel e o Estúdio reescrevem a chave de tempos em tempos, para alcançar
  // abas que carregaram depois deles.
  chrome.storage.onChanged.addListener((mud, area) => {
    if (area === "local" && mud[CHAVE_ABERTURA]) atenderAviso(mud[CHAVE_ABERTURA].newValue);
  });
  void avisoAberto().then(atenderAviso);
  setInterval(() => {
    if (porta) apresentar();
    void avisoAberto().then(atenderAviso);
  }, 5000);

  const marcarFoco = () => {
    ultimoFoco = Date.now();
    apresentar();
  };
  window.addEventListener("focus", marcarFoco);
  document.addEventListener("visibilitychange", () => document.visibilityState === "visible" && marcarFoco());
  window.addEventListener("hashchange", apresentar);
}

/**
 * Abre o painel. Chrome: o service worker chama sidePanel.open (o clique do
 * usuário é o gesto exigido). Firefox (sem service worker): abre a página do
 * painel numa aba.
 */
function abrirPainel(): void {
  chrome.runtime.sendMessage({ tipo: "abrirAgente" }).catch(() => window.open(chrome.runtime.getURL("html/agente.html"), "seiProAgente"));
}

/** O legado (ícone da barra do processo, botão do editor) pede o painel por postMessage. */
function escutarPedidoDeAbertura(): void {
  window.addEventListener("message", (ev: MessageEvent) => {
    const m = ev.data as { __seiProAgente?: string } | null;
    if (m?.__seiProAgente === "abrir" && ev.origin === location.origin) abrirPainel();
  });
}

function iniciar(): void {
  if (window.top !== window || window.__seiProAgente) return;
  if (/[?&]acao=editor_montar\b/.test(location.search)) {
    window.__seiProAgente = true;
    escutarPedidoDeAbertura();
    iniciarEditor();
    return;
  }
  // Só telas do SEI com sessão (tem o cabeçalho com a unidade).
  if (!document.querySelector("#lnkInfraUnidade, #frmProtocoloPesquisaRapida")) return;
  window.__seiProAgente = true;
  escutarPedidoDeAbertura();

  // A tela viva, com cache curto: `outerHTML` da caixa tem centenas de KB.
  let cache: { quando: number; pagina: Pagina } | null = null;
  const paginaViva = (): Pagina => {
    if (!cache || Date.now() - cache.quando > 3000) {
      cache = { quando: Date.now(), pagina: { url: location.href, status: 200, html: document.documentElement.outerHTML, doc: document } };
    }
    return cache.pagina;
  };
  const sei = new Sei(location.href, paginaViva);
  // `tela` só mexe no DOM vivo, e por isso fica fora do despacho de operações do
  // núcleo. `fluxo.avaliar` NÃO: ele busca a árvore completa, então é uma
  // operação do núcleo como as outras.
  abrirCanal("sei", undefined, async (op, args, sinal) => {
    if (op === "tela") return lerTela(document, location.href);
    const r = await executarOperacao(sei, op, args, sinal);
    // A tela acompanha a escrita, mas DEPOIS de responder: o painel não espera
    // o recarregamento da árvore para mostrar que o documento foi criado.
    void acompanharNaTela(op, args, r);
    return r;
  });
  instalarEntradaNoMenu();
  vigiarFluxo(sei);
}

/**
 * Janela do editor: injeta o script do mundo da página (o CKEditor só existe
 * lá) e repassa `editor.ler` / `editor.escrever` a ele, com um token que só
 * este content script e aquele script conhecem.
 */
function iniciarEditor(): void {
  const MARCA = "seipro-agente-editor";
  const token = crypto.randomUUID();
  const s = document.createElement("script");
  s.src = chrome.runtime.getURL("js/sei-pro-agente-editor.js");
  s.dataset.token = token;
  (document.head ?? document.documentElement).append(s);

  const pendentes = new Map<string, (r: { ok: boolean; dados?: unknown; erro?: string }) => void>();
  window.addEventListener("message", (ev: MessageEvent) => {
    const m = ev.data as { __marca?: string; token?: string; id?: string; resposta?: { ok: boolean; dados?: unknown; erro?: string } };
    if (ev.source !== window || m?.__marca !== MARCA || m.token !== token || !m.resposta || !m.id) return;
    pendentes.get(m.id)?.(m.resposta);
    pendentes.delete(m.id);
  });
  const naPagina = (op: string, args: Record<string, unknown>) =>
    new Promise<unknown>((ok, erro) => {
      const id = crypto.randomUUID();
      pendentes.set(id, (r) => (r.ok ? ok(r.dados) : erro(new ErroSei("SEI_VALIDACAO", r.erro ?? "Falha no editor."))));
      window.postMessage({ __marca: MARCA, token, id, op, args }, "*");
    });

  // Título do editor: "SEI/ORGAO - 0104018 - Despacho".
  const documento = /\s-\s(\d{6,})\s-\s/.exec(document.title)?.[1];
  abrirCanal("editor", documento, (op, args) => {
    if (op === "editor.ler") return naPagina("ler", args);
    if (op === "editor.escrever") return naPagina("escrever", args);
    return Promise.reject(new ErroSei("ARGUMENTO_INVALIDO", "A janela do editor s\u00F3 atende opera\u00E7\u00F5es do editor."));
  });
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
  // Firefox (manifest v2, sem service worker): o item é um link comum para a
  // página do painel (web_accessible_resource) — o Firefox recusa window.open
  // de endereço da extensão feito pelo content script. Chrome: o service
  // worker abre o painel lateral, e o clique precisa ser o gesto do usuário.
  const painel = chrome.runtime.getURL("html/agente.html");
  if (painel.startsWith("moz-extension://")) {
    a.href = painel;
    a.target = "seiProAgente";
    a.rel = "noopener";
  } else {
    a.addEventListener("click", (ev) => {
      ev.preventDefault();
      abrirPainel();
    });
  }
  li.append(a);
  lista.append(li);
}

/**
 * Depois de o agente escrever: a tela do SEI mostra o que aconteceu.
 *
 * Criar documento pela ponte deixava a árvore velha — o documento existia no
 * SEI e não aparecia até alguém recarregar à mão. Aqui a árvore é relida e o
 * documento novo abre no visualizador, como se a pessoa tivesse clicado nele.
 *
 * Nunca estoura: se a árvore não voltar ou o nó não aparecer, o SEI fica como
 * estava. Uma cortesia de tela não pode virar erro em cima de uma escrita que
 * DEU CERTO.
 */
async function acompanharNaTela(op: string, args: Record<string, unknown>, resultado: unknown): Promise<void> {
  try {
    const alvo = alvoParaMostrar(op, args, resultado);
    if (!alvo) return;
    if (alvo.recarregarArvore) await recarregarArvore(document);
    await abrirNoVisualizador(document, alvo);
  } catch {
    /* a escrita no SEI já deu certo; o resto é enfeite */
  }
}

/**
 * O Estúdio de Fluxo dentro da página do SEI: cartão na capa do processo e
 * bolinha no ícone do Agente de IA.
 *
 * Roda AQUI, e não no painel, porque o cartão da capa precisa aparecer para
 * quem está lendo o processo — exigir o painel aberto para ver um aviso que
 * mora na página do SEI não faria sentido.
 *
 * Quem não usa o Estúdio não paga nada: sem fluxo LIGADO no `chrome.storage`,
 * a função sai antes de tocar no SEI.
 */
function vigiarFluxo(sei: Sei): void {
  let ultimo = "";
  let emCurso = false;
  let cartao: ReturnType<typeof cartaoDaCapa> | null = null;
  let protocoloAtual = "";
  let etapaAtual = "";

  const ler = async <T,>(chave: string, vazio: T): Promise<T> => {
    try {
      return ((await chrome.storage.local.get(chave))?.[chave] as T) ?? vazio;
    } catch {
      return vazio;
    }
  };

  /** Repõe o que o legado apaga ao redesenhar a capa e a barra (a cada 1,5 s). */
  const pintar = () => {
    marcarAvisoDeFluxo(document, cartao !== null);
    mostrarCartaoNaCapa(document, cartao, {
      abrirAgente: abrirPainel,
      ignorar: () => {
        void (async () => {
          const mapa = await ler<Ignorados>(CHAVE_IGNORADOS, {});
          await chrome.storage.local.set({ [CHAVE_IGNORADOS]: comIgnorada(mapa, protocoloAtual, etapaAtual) }).catch(() => undefined);
          cartao = null;
          ultimo = "";
          pintar();
        })();
      },
    });
  };
  setInterval(pintar, 2000);

  const conferir = async () => {
    if (emCurso) return;
    const tela = lerTela(document, location.href);
    const protocolo = tela.processo?.protocolo ?? "";
    const fluxos = await ler<Fluxo[]>(CHAVE_FLUXOS, []);
    const ligados = Array.isArray(fluxos) ? fluxos.filter((f) => f.ativo) : [];
    // A assinatura inclui os fluxos: mexer no Estúdio precisa refazer a conta.
    const chave = `${protocolo}|${tela.sigiloso ? "s" : ""}|${ligados.map((f) => `${f.id}:${f.atualizadoEm}`).join(",")}`;
    if (chave === ultimo) return;
    ultimo = chave;
    if (!protocolo || tela.sigiloso || !ligados.length) {
      cartao = null;
      pintar();
      return;
    }
    emCurso = true;
    try {
      const r = (await executarOperacao(
        sei,
        "fluxo.avaliar",
        { processo: protocolo, tipo: tela.processo?.tipo, fluxos: ligados, ignorados: await ler<Ignorados>(CHAVE_IGNORADOS, {}), unidade: tela.unidade },
        new AbortController().signal,
      )) as RespostaFluxo;
      const s = r.sugestao;
      const fluxo = s ? ligados.find((f) => f.id === s.fluxoId) : undefined;
      const nome = (id: string) => fluxo?.etapas.find((e) => e.id === id)?.nome ?? id;
      cartao =
        s && fluxo
          ? cartaoDaCapa({
              fluxo: fluxo.nome,
              etapa: nome(s.etapaId),
              etapaAnterior: nome(s.etapaAnteriorId),
              anterior: s.anterior,
              cumpridas: s.cumpridas.map((c) => ({ etapa: nome(c.etapaId), numero: c.numero, titulo: c.titulo })),
            })
          : null;
      protocoloAtual = protocolo;
      etapaAtual = s?.etapaId ?? "";
    } catch {
      // Processo sem permissão, sessão caída, rede do órgão: o cartão some, e o
      // SEI segue igual. Nada disto pode estourar na tela de quem só quer ler.
      cartao = null;
    } finally {
      emCurso = false;
      pintar();
    }
  };

  void conferir();
  setInterval(() => void conferir(), 5000);
  chrome.storage.onChanged.addListener((mud, area) => {
    if (area === "local" && (mud[CHAVE_FLUXOS] || mud[CHAVE_IGNORADOS])) {
      ultimo = "";
      void conferir();
    }
  });
}

iniciar();
