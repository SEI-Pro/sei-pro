/**
 * O `dist/background.js` com um navegador de mentira.
 *
 * O background é JavaScript legado, sem build e sem tipos, e ganhou o
 * tratamento dos alarmes das rotinas — a única parte da extensão que roda
 * sem painel. Carregá-lo aqui prova que ele registra os ouvintes e que, na
 * hora do alarme, faz a coisa certa: avisa o painel quando ele está aberto e
 * mostra notificação quando não está.
 */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { checar, secao } from "./util";

const AQUI = dirname(fileURLToPath(import.meta.url));
const FONTE = readFileSync(join(AQUI, "..", "..", "dist", "background.js"), "utf8");

interface Ouvintes {
  instalado: Array<(d: unknown) => void>;
  mensagem: Array<(m: unknown, s: unknown) => void>;
  conexao: Array<(p: unknown) => void>;
  alarme: Array<(a: { name: string }) => void>;
  clique: Array<(id: string) => void>;
}

interface Opcoes {
  /** Versão do manifest (a versão nova, numa atualização). */
  versao?: string;
  /** ID da extensão: diz de que loja ela veio. */
  id?: string;
  /** Chave antiga das opções; "hidemsgupdate" desliga a página de novidades. */
  checkTypes?: string;
}

/** Monta o `chrome` falso e roda o background dentro dele. */
function carregar(rotinas: unknown[], opcoes: Opcoes = {}) {
  const ouvintes: Ouvintes = { instalado: [], mensagem: [], conexao: [], alarme: [], clique: [] };
  const notificadas: Array<{ id: string; titulo: string; corpo: string }> = [];
  const abas: string[] = [];
  const janelas: Array<{ url: string; type: string }> = [];
  const paineisAbertos: number[] = [];
  const sessao: Array<{ painelAba?: { aba?: string; janela?: number | null } }> = [];
  const chrome = {
    runtime: {
      onInstalled: { addListener: (f: (d: unknown) => void) => ouvintes.instalado.push(f) },
      onMessage: { addListener: (f: (m: unknown, s: unknown) => void) => ouvintes.mensagem.push(f) },
      onConnect: { addListener: (f: (p: unknown) => void) => ouvintes.conexao.push(f) },
      getURL: (p: string) => `chrome-extension://teste/${p}`,
      getManifest: () => ({ version: opcoes.versao ?? "2.2.5" }),
      id: opcoes.id ?? "idqualquerdeumaextensaodescompac",
    },
    storage: {
      local: {
        // O background usa as duas formas: callback (instalação) e promessa (rotinas).
        get: (_chave: unknown, cb?: (v: unknown) => void) => {
          const valores = { agenteIA_rotinas: rotinas, CheckTypes: opcoes.checkTypes };
          if (typeof cb === "function") return void cb(valores);
          return Promise.resolve(valores);
        },
        set: async () => undefined,
      },
      session: { set: async (v: (typeof sessao)[number]) => void sessao.push(v) },
    },
    alarms: { onAlarm: { addListener: (f: (a: { name: string }) => void) => ouvintes.alarme.push(f) } },
    notifications: {
      create: (id: string, o: { title: string; message: string }, cb?: () => void) => {
        notificadas.push({ id, titulo: o.title, corpo: o.message });
        cb?.();
      },
      clear: () => undefined,
      onClicked: { addListener: (f: (id: string) => void) => ouvintes.clique.push(f) },
    },
    tabs: { create: (o: { url: string }) => void abas.push(o.url), query: async () => [{ id: 7 }] },
    windows: { create: (o: { url: string; type: string }) => void janelas.push(o) },
    sidePanel: { open: async (o: { tabId: number }) => void paineisAbertos.push(o.tabId) },
  };
  // O arquivo roda como script de service worker: `self`/`chrome` globais.
  const executar = new Function("chrome", "self", `${FONTE}\nreturn typeof portasDoAgente;`);
  const tipo = executar(chrome, chrome) as string;
  return { ouvintes, notificadas, abas, janelas, paineisAbertos, sessao, tipo };
}

export async function verificarBackground(): Promise<void> {
  secao("background: carrega e registra os ouvintes");
  const base = carregar([]);
  checar("o arquivo roda sem lancar", base.tipo === "object");
  checar("ouve a instalacao", base.ouvintes.instalado.length === 1);
  checar("ouve o pedido de abrir o agente", base.ouvintes.mensagem.length === 1);
  checar("ouve a porta do painel", base.ouvintes.conexao.length === 1);
  checar("ouve o alarme das rotinas", base.ouvintes.alarme.length === 1);
  checar("ouve o clique na notificacao", base.ouvintes.clique.length === 1);

  secao("background: alarme com o painel aberto");
  {
    const amb = carregar([{ id: "r1", nome: "Parados", ativa: true }]);
    const recebidas: unknown[] = [];
    const porta = {
      name: "agente-vivo",
      postMessage: (m: unknown) => void recebidas.push(m),
      onDisconnect: { addListener: () => undefined },
    };
    amb.ouvintes.conexao[0](porta);
    amb.ouvintes.alarme[0]({ name: "rotina:r1" });
    await new Promise((r) => setTimeout(r, 10));
    checar("manda o painel rodar", JSON.stringify(recebidas) === JSON.stringify([{ tipo: "rodarRotinas", rotina: "r1" }]), recebidas);
    checar("e nao notifica nada", amb.notificadas.length === 0, amb.notificadas);
  }

  secao("background: alarme com o painel fechado");
  {
    const amb = carregar([{ id: "r1", nome: "Parados", ativa: true }]);
    amb.ouvintes.alarme[0]({ name: "rotina:r1" });
    await new Promise((r) => setTimeout(r, 10));
    checar("notifica a pendencia com o nome da rotina", amb.notificadas[0]?.titulo === "Rotina pendente: Parados", amb.notificadas);
    checar("e diz o que fazer", /Abra o Agente/.test(amb.notificadas[0]?.corpo ?? ""), amb.notificadas[0]);
  }

  secao("background: porta de outro nome e rotina desligada");
  {
    const amb = carregar([{ id: "r1", nome: "Parados", ativa: false }]);
    const recebidas: unknown[] = [];
    amb.ouvintes.conexao[0]({ name: "outra-coisa", postMessage: (m: unknown) => void recebidas.push(m), onDisconnect: { addListener: () => undefined } });
    amb.ouvintes.alarme[0]({ name: "rotina:r1" });
    await new Promise((r) => setTimeout(r, 10));
    checar("porta de outro nome nao recebe nada", recebidas.length === 0);
    checar("rotina desligada nao notifica", amb.notificadas.length === 0, amb.notificadas);
  }

  secao("background: alarme que nao e de rotina");
  {
    const amb = carregar([{ id: "r1", nome: "Parados", ativa: true }]);
    amb.ouvintes.alarme[0]({ name: "outro-alarme" });
    await new Promise((r) => setTimeout(r, 10));
    checar("e ignorado", amb.notificadas.length === 0);
  }

  secao("background: clique na notificacao abre o agente");
  {
    const amb = carregar([]);
    amb.ouvintes.clique[0]("rotina-pendente:r1");
    await new Promise((r) => setTimeout(r, 10));
    checar("abre o painel lateral na aba ativa", amb.paineisAbertos.join() === "7", amb.paineisAbertos);
    checar("ja na aba do agente", amb.sessao.some((v) => v.painelAba?.aba === "agente" && v.painelAba?.janela === null), amb.sessao);
    amb.ouvintes.clique[0]("promocao-qualquer");
    await new Promise((r) => setTimeout(r, 10));
    checar("notificacao de outra origem e ignorada", amb.paineisAbertos.length === 1 && amb.abas.length === 0);
  }

  secao("background: janela para escolher o arquivo de sincronia (#186)");
  {
    const amb = carregar([]);
    amb.ouvintes.mensagem[0]({ tipo: "escolherArquivoEmJanela", id: "p1", modo: "novo", nome: "a b.json", descricao: "Demandas do SEI Pro" }, {});
    const j = amb.janelas[0];
    checar("abre a janela da extensao, de nivel superior (popup)", j?.type === "popup" && /html\/escolher-arquivo\.html\?/.test(j.url), amb.janelas);
    const q = new URLSearchParams(j?.url.split("?")[1] ?? "");
    checar("leva o pedido na URL", q.get("id") === "p1" && q.get("modo") === "novo" && q.get("nome") === "a b.json" && q.get("descricao") === "Demandas do SEI Pro");
    checar("nao abre painel por isso", amb.paineisAbertos.length === 0);
  }

  secao("background: pedidos para abrir o painel");
  {
    const amb = carregar([]);
    const tab = { tab: { id: 42, windowId: 9 } };
    amb.ouvintes.mensagem[0]({ tipo: "abrirPainel", aba: "favoritos" }, tab);
    await new Promise((r) => setTimeout(r, 10));
    checar("abrirPainel abre o painel na aba que pediu", amb.paineisAbertos.join() === "42", amb.paineisAbertos);
    checar("e grava a aba pedida", amb.sessao.at(-1)?.painelAba?.aba === "favoritos" && amb.sessao.at(-1)?.painelAba?.janela === 9, amb.sessao);
    amb.ouvintes.mensagem[0]({ tipo: "abrirAgente" }, tab);
    await new Promise((r) => setTimeout(r, 10));
    checar("abrirAgente (botoes antigos) abre na aba do agente", amb.sessao.at(-1)?.painelAba?.aba === "agente" && amb.paineisAbertos.length === 2);
    amb.ouvintes.mensagem[0]({ tipo: "abrirPainel", aba: "projetos" }, tab);
    await new Promise((r) => setTimeout(r, 10));
    checar("abrirPainel na aba Projetos (caixa, arvore)", amb.sessao.at(-1)?.painelAba?.aba === "projetos" && amb.paineisAbertos.length === 3);
    amb.ouvintes.mensagem[0]({ tipo: "abrirPainel", aba: "historico" }, tab);
    await new Promise((r) => setTimeout(r, 10));
    checar("e na aba Historico", amb.sessao.at(-1)?.painelAba?.aba === "historico");
    amb.ouvintes.mensagem[0]({ tipo: "abrirPainel", aba: "qualquer" }, tab);
    await new Promise((r) => setTimeout(r, 10));
    checar("aba desconhecida vira monitorados", amb.sessao.at(-1)?.painelAba?.aba === "favoritos");
    amb.ouvintes.mensagem[0]({ tipo: "abrirPainel", aba: "favoritos" }, {});
    await new Promise((r) => setTimeout(r, 10));
    checar("pedido sem aba de origem e ignorado", amb.paineisAbertos.length === 5);
  }

  secao("background: atualizacao abre o historico, com convite de avaliacao so em versao de novidades");
  {
    const CHROME = "pdbbapplhjopafpgidbgceccbbmehcjj";
    const EDGE = "gkhfbbbminanojfklpfmloaglckmlfne";
    const HISTORICO = "https://seipro.app/pages/HISTORICO.html";
    const abas = async (detalhes: Record<string, string>, opcoes: Opcoes) => {
      const amb = carregar([], opcoes);
      amb.ouvintes.instalado[0](detalhes);
      await new Promise((r) => setTimeout(r, 10));
      return amb.abas;
    };
    const atualizar = (de: string, para: string, id: string, checkTypes?: string) =>
      abas({ reason: "update", previousVersion: de }, { versao: para, id, checkTypes });

    let a = await atualizar("2.2.5", "2.3", CHROME);
    checar("2.2.5 -> 2.3 pela Chrome Web Store convida", a.join() === `${HISTORICO}#avaliar=chrome&versao=2.3`, a);
    a = await atualizar("2.2.3", "2.3.1", CHROME);
    checar("2.2.3 -> 2.3.1 (pulou a 2.3) tambem convida", a.join() === `${HISTORICO}#avaliar=chrome&versao=2.3.1`, a);
    a = await atualizar("1.7.7", "2.0", CHROME);
    checar("1.7.7 -> 2.0 (muda o primeiro numero) convida", a.join() === `${HISTORICO}#avaliar=chrome&versao=2.0`, a);
    a = await atualizar("2.9.3", "2.10", CHROME);
    checar("2.9.3 -> 2.10 compara numero, nao texto", a.join() === `${HISTORICO}#avaliar=chrome&versao=2.10`, a);
    a = await atualizar("2.2.5", "2.3", EDGE);
    checar("pela loja do Edge o convite aponta para o Edge", a.join() === `${HISTORICO}#avaliar=edge&versao=2.3`, a);
    a = await atualizar("2.3", "2.3.1", CHROME);
    checar("2.3 -> 2.3.1 abre o historico sem convite", a.join() === HISTORICO, a);
    a = await atualizar("2.2.3", "2.2.4", CHROME);
    checar("2.2.3 -> 2.2.4 abre o historico sem convite", a.join() === HISTORICO, a);
    a = await atualizar("2.2.5", "2.3", "idqualquerdeumaextensaodescompac");
    checar("extensao fora das lojas (Lab, descompactada) nao convida", a.join() === HISTORICO, a);
    a = await atualizar("2.2.5", "2.3", CHROME, "hidemsgupdate");
    checar("quem desligou a pagina de novidades nao ve nada", a.length === 0, a);
    a = await atualizar("2.3", "2.3", CHROME);
    checar("recarregar sem mudar a versao nao abre nada", a.length === 0, a);
    a = await abas({ reason: "install" }, { versao: "2.3", id: CHROME });
    checar("instalacao abre a pagina inicial, sem convite", a.join() === "https://seipro.app/", a);
  }
}
