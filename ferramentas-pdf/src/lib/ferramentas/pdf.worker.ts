/// <reference lib="webworker" />

/**
 * Worker de PDF.
 *
 * UM WORKER PARA TODAS AS FERRAMENTAS, não um por operação. O motivo é
 * concreto: o `@cantoo/pdf-lib` pesa algumas centenas de KB e seria duplicado
 * em cada bundle de worker; e o wizard "Preparar para protocolo" encadeia
 * operações de três ferramentas na mesma sessão, o que ficaria absurdo com
 * três workers conversando entre si.
 *
 * Este arquivo é só o transporte. A escolha da operação vive em `despacho.ts`,
 * compartilhado com o recuo na thread principal — se cada lado tivesse o seu
 * `switch`, o caminho de recuo seria o menos testado e divergiria em silêncio.
 */

import type { MensagemParaWorker, RespostaWorker } from "./protocoloWorker";
import { ehCancelamento } from "./protocoloWorker";
import { despacharOperacao } from "./despacho";
import type { CodigoErroFerramenta } from "@/types/ferramentas";

const escopo = self as unknown as DedicatedWorkerGlobalScope;

/** Pedidos cancelados pela aba, para que o laço pare na próxima checagem. */
const cancelados = new Set<number>();

escopo.addEventListener("message", async (evento: MessageEvent<MensagemParaWorker>) => {
  const msg = evento.data;

  if (ehCancelamento(msg)) {
    cancelados.add(msg.id);
    return;
  }

  const responder = (resposta: RespostaWorker, transferiveis: Transferable[] = []) => {
    escopo.postMessage(resposta, transferiveis);
  };

  try {
    const saidas = await despacharOperacao(msg.operacao, msg.entradas, msg.opcoes ?? {}, {
      aoProgredir: (feito, total) => {
        if (cancelados.has(msg.id)) return;
        responder({ id: msg.id, tipo: "progresso", feito, total });
      },
      cancelado: () => cancelados.has(msg.id),
    });

    if (cancelados.has(msg.id)) return;

    // Transfere os buffers em vez de copiá-los: um documento de 200 MB copiado
    // de volta para a aba dobraria o pico de memória sem necessidade.
    responder(
      { id: msg.id, tipo: "ok", saidas },
      saidas.map((s) => s.bytes.buffer as ArrayBuffer),
    );
  } catch (e) {
    if (cancelados.has(msg.id)) return;
    const comCodigo = e as { codigo?: CodigoErroFerramenta; contexto?: { nome?: string } };
    responder({
      id: msg.id,
      tipo: "erro",
      codigo: comCodigo?.codigo ?? "FALHA_INESPERADA",
      nomeArquivo: comCodigo?.contexto?.nome,
    });
  } finally {
    cancelados.delete(msg.id);
  }
});
