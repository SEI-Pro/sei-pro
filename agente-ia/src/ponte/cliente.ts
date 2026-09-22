/**
 * Lado do painel da ponte: recebe as portas das abas do SEI e faz RPC com elas.
 *
 * Várias abas do SEI podem estar abertas (até em órgãos diferentes). O painel
 * lateral pertence a uma janela; ele usa a aba do SEI DAQUELA janela que teve
 * foco por último e está visível, e mostra qual é. O usuário pode fixar outra.
 */

import { CANAL, CHAVE_ABERTURA, ehDoCanal, prazoDe, type Apresentacao, type MensagemAba, type Pedido } from "./protocolo";

export interface AbaSei {
  id: number;
  janela: number;
  host: string;
  titulo: string;
  visivel: boolean;
  foco: number;
  porta: chrome.runtime.Port;
}

export class ErroPonte extends Error {
  constructor(
    readonly codigo: string,
    mensagem: string,
    readonly detalhe?: string,
  ) {
    super(mensagem);
  }
}

export class PontePainel {
  private readonly abas = new Map<number, AbaSei>();
  private readonly pendentes = new Map<string, { ok: (v: unknown) => void; erro: (e: Error) => void; aba: AbaSei }>();
  private janela = -1;
  private fixada: number | null = null;
  private ouvintes: Array<() => void> = [];

  async iniciar(): Promise<void> {
    try {
      this.janela = (await chrome.windows.getCurrent()).id ?? -1;
    } catch {
      /* sem API de janelas (Firefox sidebar): aceita qualquer aba */
    }
    chrome.runtime.onConnect.addListener((porta) => {
      if (porta.name !== CANAL || !porta.sender?.tab?.id) return;
      const tab = porta.sender.tab;
      const aba: AbaSei = { id: tab.id!, janela: tab.windowId ?? -1, host: "", titulo: tab.title ?? "", visivel: true, foco: 0, porta };
      this.abas.set(aba.id, aba);
      porta.onMessage.addListener((m: unknown) => this.receber(aba, m));
      porta.onDisconnect.addListener(() => {
        if (this.abas.get(aba.id)?.porta === porta) this.abas.delete(aba.id);
        for (const [id, p] of this.pendentes) {
          if (p.aba.porta === porta) {
            p.erro(
              new ErroPonte(
                "SEI_ABA_FECHADA",
                "A aba do SEI foi fechada ou recarregada durante a opera\u00E7\u00E3o. Se era uma escrita, ela pode ter sido conclu\u00EDda no SEI: confira o estado (leitura ou pr\u00E9via) antes de repetir.",
              ),
            );
            this.pendentes.delete(id);
          }
        }
        this.avisar();
      });
      this.avisar();
    });
    // Avisa as abas que o painel abriu (e renova, para abas que carregarem depois).
    const anunciar = () => chrome.storage.local.set({ [CHAVE_ABERTURA]: Date.now() }).catch(() => undefined);
    await anunciar();
    setInterval(anunciar, 60_000);
    addEventListener("pagehide", () => void chrome.storage.local.remove(CHAVE_ABERTURA).catch(() => undefined));
  }

  aoMudar(f: () => void): void {
    this.ouvintes.push(f);
  }

  private avisar(): void {
    for (const f of this.ouvintes) f();
  }

  private receber(aba: AbaSei, m: unknown): void {
    if (!ehDoCanal(m)) return;
    const msg = m as MensagemAba;
    if (msg.tipo === "ola") {
      const o = msg as Apresentacao;
      Object.assign(aba, { host: o.host, visivel: o.visivel, foco: o.foco, titulo: o.titulo });
      this.avisar();
      return;
    }
    const p = this.pendentes.get(msg.id);
    if (!p) return;
    this.pendentes.delete(msg.id);
    if (msg.ok) p.ok(msg.dados);
    else p.erro(new ErroPonte(msg.erro?.codigo ?? "ERRO", msg.erro?.mensagem ?? "Falha na aba do SEI.", msg.erro?.detalhe));
  }

  lista(): AbaSei[] {
    return [...this.abas.values()].filter((a) => this.janela < 0 || a.janela === this.janela || this.fixada === a.id);
  }

  fixar(id: number | null): void {
    this.fixada = id;
    this.avisar();
  }

  atual(): AbaSei | null {
    const lista = this.lista();
    if (this.fixada !== null) return lista.find((a) => a.id === this.fixada) ?? null;
    return lista.sort((a, b) => Number(b.visivel) - Number(a.visivel) || b.foco - a.foco)[0] ?? null;
  }

  executar(op: string, args: Record<string, unknown>, sinal?: AbortSignal): Promise<unknown> {
    const aba = this.atual();
    if (!aba) {
      return Promise.reject(new ErroPonte("SEI_SEM_ABA", "Nenhuma aba do SEI conectada. Abra o SEI nesta janela (ou recarregue a p\u00E1gina do SEI)."));
    }
    const id = crypto.randomUUID();
    return new Promise((ok, erro) => {
      const prazo = setTimeout(() => {
        this.pendentes.delete(id);
        aba.porta.postMessage({ canal: CANAL, tipo: "cancelar", id });
        erro(new ErroPonte("SEI_TEMPO", "O SEI demorou demais para responder."));
      }, prazoDe(op));
      const fim = <T>(f: (v: T) => void) => (v: T) => (clearTimeout(prazo), f(v));
      this.pendentes.set(id, { ok: fim(ok), erro: fim(erro), aba });
      sinal?.addEventListener(
        "abort",
        () => {
          if (!this.pendentes.has(id)) return;
          this.pendentes.delete(id);
          clearTimeout(prazo);
          aba.porta.postMessage({ canal: CANAL, tipo: "cancelar", id });
          erro(new ErroPonte("CANCELADO", "Opera\u00E7\u00E3o cancelada."));
        },
        { once: true },
      );
      aba.porta.postMessage({ canal: CANAL, tipo: "pedido", id, op, args } satisfies Pedido);
    });
  }
}
