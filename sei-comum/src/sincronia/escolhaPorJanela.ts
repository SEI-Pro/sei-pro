/**
 * Escolher o arquivo de sincronia quando o app roda em iframe (issue #186).
 *
 * Os apps do SEI Pro (Favoritos, Projetos, Demandas...) abrem em iframe dentro da página do SEI, e o Chrome
 * recusa `showOpenFilePicker`/`showSaveFilePicker` em iframe de outra origem ("Third party iframes are not
 * allowed to show a file picker"), mesmo com clique do usuário. A saída é abrir uma janela própria da extensão
 * (`html/escolher-arquivo.html`, de nível superior, onde o seletor funciona), deixar o handle no IndexedDB da
 * extensão e ler de volta aqui: o IndexedDB da origem da extensão é o mesmo no iframe e na janela (medido no
 * Chrome 158, com handle de verdade).
 *
 * O depósito é de passagem: a janela grava com o id do pedido, o app lê e apaga na hora.
 */

import { noDeposito } from "./banco";
import type { HandleArquivo } from "./arquivo";

export const BANCO_ESCOLHA = "seipro-escolha-arquivo";
export const MSG_ABRIR_ESCOLHA = "escolherArquivoEmJanela";
export const MSG_ESCOLHA_FEITA = "arquivoEscolhidoEmJanela";
/** Quanto o app espera a pessoa escolher na janela, antes de desistir. */
export const PRAZO_ESCOLHA_MS = 10 * 60 * 1000;

export interface PedidoEscolha {
  id: string;
  modo: "novo" | "existente";
  nome: string;
  descricao: string;
}

export interface ResultadoEscolha {
  tipo: typeof MSG_ESCOLHA_FEITA;
  id: string;
  ok: boolean;
}

/** O erro do Chrome para seletor em iframe de outra origem (a mensagem varia de versão, o nome é NotAllowedError). */
export function seletorBarradoNoIframe(e: unknown): boolean {
  const { name, message } = (e ?? {}) as { name?: string; message?: string };
  return (name === "NotAllowedError" || name === "SecurityError") && /iframe|sub ?frame/i.test(message ?? "");
}

export interface ArmazemEscolha {
  guardar(id: string, h: HandleArquivo): Promise<void>;
  ler(id: string): Promise<HandleArquivo | undefined>;
  esquecer(id: string): Promise<void>;
}

export function escolhaNoIndexedDB(fabrica?: IDBFactory): ArmazemEscolha {
  return {
    guardar: (id, h) => noDeposito(BANCO_ESCOLHA, "arquivos", "readwrite", (s) => s.put(h, id), fabrica).then(() => undefined),
    ler: (id) => noDeposito(BANCO_ESCOLHA, "arquivos", "readonly", (s) => s.get(id) as IDBRequest<HandleArquivo | undefined>, fabrica),
    esquecer: (id) => noDeposito(BANCO_ESCOLHA, "arquivos", "readwrite", (s) => s.delete(id), fabrica).then(() => undefined),
  };
}

export interface DepsEscolhaPorJanela {
  /** Pede ao background que abra a janela. */
  pedirJanela(p: PedidoEscolha): Promise<unknown>;
  /** Ouve o resultado vindo da janela; devolve a função que desliga a escuta. */
  ouvir(cb: (m: unknown) => void): () => void;
  armazem: ArmazemEscolha;
  novoId(): string;
  prazoMs: number;
}

function depsPadrao(): DepsEscolhaPorJanela {
  return {
    pedirJanela: (p) => chrome.runtime.sendMessage({ tipo: MSG_ABRIR_ESCOLHA, ...p }),
    ouvir: (cb) => {
      const f = (m: unknown) => cb(m);
      chrome.runtime.onMessage.addListener(f);
      return () => chrome.runtime.onMessage.removeListener(f);
    },
    armazem: escolhaNoIndexedDB(),
    novoId: () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`,
    prazoMs: PRAZO_ESCOLHA_MS,
  };
}

/** `null` quando a pessoa fecha a janela ou cancela, como o seletor do navegador. */
export async function escolherPelaJanelaDaExtensao(
  modo: "novo" | "existente",
  nome: string,
  descricao: string,
  deps: DepsEscolhaPorJanela = depsPadrao(),
): Promise<HandleArquivo | null> {
  const id = deps.novoId();
  let desligar = () => {};
  let temporizador: ReturnType<typeof setTimeout> | undefined;
  const resultado = new Promise<boolean>((ok) => {
    desligar = deps.ouvir((m) => {
      const r = m as Partial<ResultadoEscolha> | null;
      if (r && r.tipo === MSG_ESCOLHA_FEITA && r.id === id) ok(r.ok === true);
    });
    temporizador = setTimeout(() => ok(false), deps.prazoMs);
  });
  try {
    await deps.pedirJanela({ id, modo, nome, descricao });
    if (!(await resultado)) return null;
    const h = await deps.armazem.ler(id);
    return h ?? null;
  } finally {
    desligar();
    if (temporizador) clearTimeout(temporizador);
    await deps.armazem.esquecer(id).catch(() => undefined);
  }
}
