/**
 * Quantos protocolos cabem numa pasta da árvore (a "página" do SEI; 20 no SEI de treinamento, mas o órgão pode configurar).
 * Sem DOM. Quem sabe o tamanho são as pastas que o usuário (ou a fila) já abriu: toda pasta carregada que NÃO é a última
 * está cheia, então a contagem dela é o tamanho. O valor aprendido fica no localStorage da origem do SEI e vale para
 * qualquer processo.
 *
 * Ordem de confiança: o que a árvore mostra agora (`medido`) > o que já foi aprendido (`aprendido`) > o do legado
 * (`optionsPro.sumDocsPasta`, que o contador de documentos da árvore grava só quando passa de 20) > 20, o padrão do SEI
 * (`padrao`, sempre mostrado como estimativa).
 */
import { chaveTamanhoPasta } from "./constantes";

export const TAMANHO_PADRAO = 20;
/** Limites de sanidade: uma pasta de 1 ou de 5000 protocolos não é uma página do SEI. */
const MINIMO = 2;
const MAXIMO = 1000;

export type OrigemTamanho = "medido" | "aprendido" | "legado" | "padrao";

export interface TamanhoDaPasta {
  valor: number;
  origem: OrigemTamanho;
}

/** O que a tela mostra de uma pasta, para aprender: carregada, quantos nós tem e se é a última (a parcial). */
export interface PastaParaAprender {
  carregada: boolean;
  nos: number;
  ultima: boolean;
}

type Leitura = Pick<Storage, "getItem">;
type Escrita = Pick<Storage, "setItem">;

const valido = (n: unknown): n is number => typeof n === "number" && Number.isInteger(n) && n >= MINIMO && n <= MAXIMO;

export function lerTamanhoAprendido(a: Leitura, host: string): number | null {
  try {
    const n = Number(a.getItem(chaveTamanhoPasta(host)));
    return valido(n) ? n : null;
  } catch {
    return null;
  }
}

/** `optionsPro.sumDocsPasta` do contador de documentos do legado (só leitura). */
export function lerTamanhoDoLegado(a: Leitura): number | null {
  try {
    const bruto = a.getItem("optionsPro");
    const o = bruto ? (JSON.parse(bruto) as Record<string, unknown>) : null;
    const n = Number(o?.sumDocsPasta);
    return valido(n) ? n : null;
  } catch {
    return null;
  }
}

/**
 * O tamanho que as pastas carregadas (que não são a última) mostram: o valor mais frequente; em empate, o maior. Uma
 * pasta carregada vazia ("Nenhum protocolo") não ensina nada. Sem nenhuma, null.
 */
export function tamanhoDasPastas(pastas: readonly PastaParaAprender[]): number | null {
  const freq = new Map<number, number>();
  for (const p of pastas) {
    if (!p.carregada || p.ultima || !valido(p.nos)) continue;
    freq.set(p.nos, (freq.get(p.nos) ?? 0) + 1);
  }
  let melhor: number | null = null;
  let vezes = 0;
  for (const [n, k] of freq) {
    if (k > vezes || (k === vezes && melhor !== null && n > melhor)) {
      melhor = n;
      vezes = k;
    }
  }
  return melhor;
}

export function gravarTamanho(a: Leitura & Partial<Escrita>, host: string, n: number): boolean {
  if (!valido(n) || typeof a.setItem !== "function") return false;
  try {
    if (String(a.getItem(chaveTamanhoPasta(host))) === String(n)) return false;
    a.setItem(chaveTamanhoPasta(host), String(n));
    return true;
  } catch {
    return false;
  }
}

/**
 * Decide o tamanho a usar e APRENDE: se as pastas carregadas mostram um tamanho, ele vale e substitui o guardado (a contagem
 * de agora corrige o que se aprendeu antes). Sem pastas que ensinem, vale o guardado, depois o do legado, depois 20.
 */
export function resolverTamanho(
  pastas: readonly PastaParaAprender[],
  armazenamento: Leitura & Partial<Escrita>,
  host: string,
): TamanhoDaPasta {
  const medido = tamanhoDasPastas(pastas);
  if (medido !== null) {
    gravarTamanho(armazenamento, host, medido);
    return { valor: medido, origem: "medido" };
  }
  const guardado = lerTamanhoAprendido(armazenamento, host);
  if (guardado !== null) return { valor: guardado, origem: "aprendido" };
  const legado = lerTamanhoDoLegado(armazenamento);
  if (legado !== null) return { valor: legado, origem: "legado" };
  return { valor: TAMANHO_PADRAO, origem: "padrao" };
}
