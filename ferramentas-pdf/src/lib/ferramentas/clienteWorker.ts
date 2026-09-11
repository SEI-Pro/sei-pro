/**
 * Cliente do worker de PDF, do lado da aba.
 *
 * POR QUE EXISTE O RECUO PARA A THREAD PRINCIPAL. Um worker pode simplesmente
 * não nascer: política de segurança de conteúdo mais restritiva, navegador
 * antigo, extensão que interfere. Uma ferramenta gratuita que mostra tela
 * branca nesses casos é pior do que uma que trava a aba por alguns segundos.
 * Então, se a construção do worker falhar, a mesma operação roda localmente e
 * o usuário não fica sabendo da diferença, exceto pela aba menos responsiva.
 */

import { recursoDaExtensao } from "@/plataforma/recursos";
import type { CodigoErroFerramenta } from "@/types/ferramentas";
import { ErroFerramenta } from "./erros";
import { OperacaoCancelada } from "./juntar";
import type {
  EntradaWorker,
  OperacaoPdf,
  RespostaWorker,
  SaidaWorker,
} from "./protocoloWorker";

export interface ExecucaoOpcoes {
  operacao: OperacaoPdf;
  entradas: EntradaWorker[];
  opcoes?: Record<string, unknown>;
  aoProgredir?: (feito: number, total: number) => void;
}

export interface Execucao {
  resultado: Promise<SaidaWorker[]>;
  cancelar: () => void;
}

let worker: Worker | null = null;
let workerIndisponivel = false;
let proximoId = 1;

function obterWorker(): Worker | null {
  if (workerIndisponivel) return null;
  if (worker) return worker;
  try {
    // O worker é um arquivo PRÓPRIO, emitido pelo build como segunda entrada, e
    // referenciado pela URL do pacote da extensão.
    //
    // NÃO usar `new URL("./pdf.worker.ts", import.meta.url)` aqui: essa forma é
    // reconhecida por empacotadores que emitem o worker sozinhos, e o esbuild
    // NÃO faz isso. O resultado seria uma URL para um arquivo inexistente, o
    // `catch` abaixo marcaria `workerIndisponivel` e TUDO passaria a rodar na
    // thread principal — em silêncio, travando a aba em documentos grandes.
    //
    // Worker CLÁSSICO, sem `type: "module"`, de propósito: o build emite este
    // arquivo em IIFE, e o Firefox só aceita module worker a partir da 114,
    // enquanto a extensão ainda publica MV2 para o Gecko.
    worker = new Worker(recursoDaExtensao("js/ferramentas-pdf/pdf.worker.js"));
    return worker;
  } catch {
    workerIndisponivel = true;
    return null;
  }
}

/** Executa a operação localmente, quando não há worker. */
async function executarLocalmente(
  opcoes: ExecucaoOpcoes,
  cancelado: () => boolean,
): Promise<SaidaWorker[]> {
  const { despacharOperacao } = await import("./despacho");
  return despacharOperacao(opcoes.operacao, opcoes.entradas, opcoes.opcoes ?? {}, {
    aoProgredir: opcoes.aoProgredir,
    cancelado,
  });
}

/**
 * Dispara a operação e devolve a promessa junto do cancelador.
 *
 * O cancelamento é cooperativo dos dois lados: no worker, uma mensagem marca o
 * pedido e o laço para na próxima checagem; localmente, o mesmo predicado é
 * consultado. Nenhum dos dois interrompe no meio de uma escrita de arquivo, o
 * que é proposital: metade de um PDF não serve para ninguém.
 */
export function executar(opcoes: ExecucaoOpcoes): Execucao {
  const id = proximoId;
  proximoId += 1;

  let cancelou = false;
  const cancelado = () => cancelou;

  const w = obterWorker();

  if (!w) {
    const resultado = executarLocalmente(opcoes, cancelado);
    return { resultado, cancelar: () => { cancelou = true; } };
  }

  const resultado = new Promise<SaidaWorker[]>((resolver, rejeitar) => {
    const aoReceber = (evento: MessageEvent<RespostaWorker>) => {
      const msg = evento.data;
      if (msg.id !== id) return;

      if (msg.tipo === "progresso") {
        opcoes.aoProgredir?.(msg.feito, msg.total);
        return;
      }

      w.removeEventListener("message", aoReceber);
      w.removeEventListener("error", aoFalhar);

      if (msg.tipo === "ok") {
        resolver(msg.saidas);
      } else {
        rejeitar(
          new ErroFerramenta(msg.codigo as CodigoErroFerramenta, {
            nome: msg.nomeArquivo,
          }),
        );
      }
    };

    const aoFalhar = () => {
      w.removeEventListener("message", aoReceber);
      w.removeEventListener("error", aoFalhar);
      // O worker morreu no meio (estouro de memória é a causa mais comum com
      // documentos grandes). Marcamos como indisponível para que a próxima
      // tentativa já vá direto para a thread principal.
      workerIndisponivel = true;
      worker = null;
      executarLocalmente(opcoes, cancelado).then(resolver, rejeitar);
    };

    w.addEventListener("message", aoReceber);
    w.addEventListener("error", aoFalhar);

    // Os buffers são transferidos, e não copiados: um lote de 200 MB copiado
    // para o worker dobraria o pico de memória da aba. A consequência é que os
    // Uint8Array de entrada ficam destacados aqui — por isso quem chama passa
    // cópias quando ainda precisa dos bytes originais.
    w.postMessage(
      { id, operacao: opcoes.operacao, entradas: opcoes.entradas, opcoes: opcoes.opcoes },
      opcoes.entradas.map((e) => e.bytes.buffer as ArrayBuffer),
    );
  });

  return {
    resultado,
    cancelar: () => {
      cancelou = true;
      w.postMessage({ id, cancelar: true });
    },
  };
}

export { OperacaoCancelada };
