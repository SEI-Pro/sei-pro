/**
 * Lado da PÁGINA: recebe as portas que as abas do SEI abrem.
 *
 * A página nunca procura o SEI — não teria como, sem a permissão de inspecionar
 * abas. Ela apenas avisa, por `chrome.storage`, que está aberta, e espera. Cada
 * aba do SEI que estiver rodando responde abrindo uma porta e se apresentando.
 *
 * VÁRIAS ABAS DO SEI é o caso comum, não a exceção: é normal ter a listagem num
 * lugar e o processo em outro. Todas se apresentam, e a página escolhe a mais
 * útil — a que tem um processo aberto. Isso resolve de graça um caso que o
 * desenho anterior não cobria: a ferramenta aberta a partir da tela de listagem
 * passa a enxergar o processo que está aberto na outra aba.
 */

import {
  CANAL,
  CHAVE_ABERTURA,
  deBase64,
  ehDoCanal,
  novoId,
  paraBase64,
  PRAZOS,
  type Apresentacao,
  type Operacao,
  type Pedido,
  type Resposta,
} from "@/ponte/protocolo";
import {
  ErroPonte,
  type ContextoSei,
  type DocumentoSei,
  type PonteSei,
  type SaidaParaSei,
} from "@/plataforma/ponteSei";
import type { LimitesProtocolo } from "@/lib/ferramentas/protocolo/tipos";
import { definirPonte } from "@/ui/contexto";

interface Pendente {
  resolver(valor: unknown): void;
  rejeitar(erro: unknown): void;
  temporizador: number;
  aoProgredir?: (fracao: number) => void;
}

interface AbaSei {
  porta: chrome.runtime.Port;
  info: Apresentacao;
}

type ApiRuntime = typeof chrome.runtime;

function runtime(): ApiRuntime | null {
  const g = globalThis as { chrome?: { runtime?: ApiRuntime }; browser?: { runtime?: ApiRuntime } };
  const api = g.chrome?.runtime ?? g.browser?.runtime;
  return api && typeof api.connect === "function" ? api : null;
}

export function conectarAoSei(): void {
  const api = runtime();
  if (!api || typeof api.onConnect?.addListener !== "function") return;

  const abas: AbaSei[] = [];
  const pendentes = new Map<string, Pendente>();
  const ouvintes = new Set<(disponivel: boolean) => void>();
  let escolhida: AbaSei | null = null;

  function avisar() {
    for (const o of ouvintes) o(escolhida !== null);
  }

  /**
   * Escolhe com qual aba conversar.
   *
   * Preferimos uma com processo aberto: é a única em que trazer documentos e
   * devolver o resultado fazem sentido. Sem nenhuma, ficamos com a primeira,
   * que ainda serve para ler os limites da instalação.
   */
  function escolher() {
    const anterior = escolhida;
    escolhida = abas.find((a) => a.info.idProcedimento) ?? abas[0] ?? null;
    if (escolhida !== anterior) avisar();
  }

  api.onConnect.addListener((porta) => {
    if (porta.name !== CANAL) return;

    let aba: AbaSei | null = null;

    porta.onMessage.addListener((m: unknown) => {
      if (!ehDoCanal(m)) return;

      // Apresentação: a aba diz quem é e o que tem em tela.
      if ((m as Apresentacao).tipo === "ola") {
        const info = m as Apresentacao;
        if (aba) {
          // A mesma aba pode se reapresentar quando o usuário abre um processo.
          aba.info = info;
        } else {
          aba = { porta, info };
          abas.push(aba);
        }
        escolher();
        return;
      }

      const r = m as Resposta;
      const pendente = pendentes.get(r.id);
      if (!pendente) return;

      // Progresso é parcial: a resposta final ainda vem.
      if (r.progresso) {
        pendente.aoProgredir?.(
          r.progresso.total > 0 ? r.progresso.feito / r.progresso.total : 0,
        );
        return;
      }

      pendentes.delete(r.id);
      clearTimeout(pendente.temporizador);
      if (r.erro) pendente.rejeitar(new ErroPonte(r.erro.codigo as never, r.erro.detalhe));
      else pendente.resolver(r.carga);
    });

    porta.onDisconnect.addListener(() => {
      const i = abas.findIndex((a) => a.porta === porta);
      if (i >= 0) abas.splice(i, 1);
      escolher();
    });
  });

  function pedir<T>(op: Operacao, carga?: unknown, aoProgredir?: (f: number) => void): Promise<T> {
    const alvo = escolhida;
    if (!alvo) return Promise.reject(new ErroPonte("SEI_INDISPONIVEL"));

    const id = novoId();
    const pedido: Pedido = { canal: CANAL, id, op, carga };

    return new Promise<T>((resolver, rejeitar) => {
      const temporizador = window.setTimeout(() => {
        pendentes.delete(id);
        rejeitar(new ErroPonte("SEI_TEMPO_ESGOTADO", op));
      }, PRAZOS[op]);
      pendentes.set(id, {
        resolver: resolver as (v: unknown) => void,
        rejeitar,
        temporizador,
        aoProgredir,
      });
      try {
        alvo.porta.postMessage(pedido);
      } catch {
        pendentes.delete(id);
        clearTimeout(temporizador);
        rejeitar(new ErroPonte("SEI_INDISPONIVEL"));
      }
    });
  }

  const ponte: PonteSei = {
    disponivel: () => escolhida !== null,
    aoMudar(ouvinte) {
      ouvintes.add(ouvinte);
      return () => ouvintes.delete(ouvinte);
    },
    contexto: async () => {
      const a = escolhida;
      if (!a) return null;
      return {
        protocolo: a.info.protocolo,
        idProcedimento: a.info.idProcedimento,
        unidade: a.info.unidade,
        host: a.info.host,
        versaoSei: a.info.versaoSei,
      } satisfies ContextoSei;
    },
    parametrosUpload: () => pedir<LimitesProtocolo | null>("parametrosUpload"),
    listarDocumentos: () => pedir<DocumentoSei[]>("listarDocumentos"),
    async obterPdf(id, aoProgredir) {
      const r = await pedir<{ nome: string; base64: string }>("obterPdf", { id }, aoProgredir);
      return { nome: r.nome, bytes: deBase64(r.base64) };
    },
    async enviarAoProcesso(saida: SaidaParaSei, aoProgredir) {
      return pedir<{ id: string }>(
        "enviarAoProcesso",
        {
          nome: saida.nome,
          base64: paraBase64(saida.bytes),
          tipoDocumentoId: saida.tipoDocumentoId,
        },
        aoProgredir,
      );
    },
  };

  definirPonte(ponte);

  // Avisa às abas do SEI que a página está aberta. É o que dispara a conexão:
  // elas escutam a mudança e abrem a porta.
  try {
    void chrome.storage.local.set({ [CHAVE_ABERTURA]: Date.now() });
  } catch {
    // Sem storage a conexão não começa sozinha, mas uma aba do SEI aberta
    // depois desta página ainda conecta.
  }

  // E retira o aviso ao sair. Sem isto, as abas do SEI continuariam tentando
  // abrir porta para uma página que não existe mais, a cada poucos segundos,
  // pelo resto da sessão.
  window.addEventListener("pagehide", () => {
    try {
      void chrome.storage.local.remove(CHAVE_ABERTURA);
    } catch {
      /* nada a fazer na saída */
    }
  });
}
