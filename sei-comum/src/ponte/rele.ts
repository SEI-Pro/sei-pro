/**
 * Relé do Firefox entre a aba do SEI (content script) e o app da extensão num iframe DA MESMA ABA.
 *
 * No Firefox, o `chrome.runtime.connect` do content script não chega à página da extensão carregada num
 * iframe da própria aba ("Receiving end does not exist", medido em 23/10/2026 com o app já ouvindo), e a
 * página em iframe de site nem tem `chrome.tabs` para abrir a porta no sentido inverso. As duas pontas
 * alcançam o background, então ele liga uma à outra: pela aba (`sender.tab.id`) e pelo nome do canal.
 *
 * Segurança igual à do Chrome (`conexaoDaAba`): a ponta "aba" tem de ser o frame de topo; a ponta "app"
 * tem de vir de uma página da extensão; e só aba e app da MESMA aba se ligam. Os canais do painel lateral
 * (a sidebar não é iframe de aba) ficam de fora: o relé nem toca nessas portas.
 */

import type { PortaRpc } from "./rpc";

/**
 * Canais de app em iframe da aba (o lado app usa `esperarConexaoDaAba`). Um módulo novo com iframe entra
 * aqui -- o teste `verificarCanaisDoRele` acusa o que faltar. Os `*-lateral` (sidebar) não entram.
 */
export const CANAIS_IFRAME: readonly string[] = [
  "seipro-historico",
  "seipro-favoritos",
  "seipro-projetos",
  "seipro-demandas",
  "spro-acoes-lote",
  "seipro-documentos-lote",
  "seipro-processos-lote",
  "seipro-link-permanente",
  "seipro-comparador",
];

export interface PortaRele extends PortaRpc {
  name: string;
  sender?: { tab?: { id?: number }; frameId?: number; url?: string };
}

export interface DepsRele {
  ouvirConexoes(cb: (porta: PortaRele) => void): void;
  /** A URL é de uma página desta extensão? */
  ehDaExtensao(url: string): boolean;
  /** Canais de app em iframe da aba; os demais passam direto. */
  canais: Set<string>;
}

interface Ponta {
  porta: PortaRele;
  /** Mensagens que chegaram antes de a outra ponta conectar. */
  guardadas: unknown[];
  par: Ponta | null;
  viva: boolean;
}

export function ligarRele(d: DepsRele): void {
  // chave = aba|canal|lado
  const esperando = new Map<string, Ponta>();

  d.ouvirConexoes((porta) => {
    if (!d.canais.has(porta.name)) return;
    const s = porta.sender ?? {};
    const aba = s.tab?.id;
    const lado = s.url && d.ehDaExtensao(s.url) ? "app" : "aba";
    if (aba === undefined || (lado === "aba" && s.frameId !== 0)) {
      porta.disconnect();
      return;
    }
    const base = `${aba}|${porta.name}|`;
    const eu: Ponta = { porta, guardadas: [], par: null, viva: true };
    porta.onMessage.addListener((m) => {
      if (eu.par) eu.par.porta.postMessage(m);
      else eu.guardadas.push(m);
    });
    porta.onDisconnect.addListener(() => {
      eu.viva = false;
      if (esperando.get(base + lado) === eu) esperando.delete(base + lado);
      if (eu.par?.viva) {
        eu.par.viva = false;
        eu.par.porta.disconnect();
      }
    });
    // Do mesmo lado, a porta nova substitui a que ainda esperava (o iframe recarregou, a aba reconectou).
    const velha = esperando.get(base + lado);
    if (velha) {
      esperando.delete(base + lado);
      velha.viva = false;
      velha.porta.disconnect();
    }
    const outro = esperando.get(base + (lado === "aba" ? "app" : "aba"));
    if (!outro) {
      esperando.set(base + lado, eu);
      return;
    }
    esperando.delete(base + (lado === "aba" ? "app" : "aba"));
    eu.par = outro;
    outro.par = eu;
    for (const m of outro.guardadas.splice(0)) porta.postMessage(m);
    for (const m of eu.guardadas.splice(0)) outro.porta.postMessage(m);
  });
}
