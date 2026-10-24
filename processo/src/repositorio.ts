import type { Area } from "@comum/armazenamento/area";
import { obterPorPrefixo } from "@comum/armazenamento/colecao";
import { chaveCache, escopoValido, MAX_BYTES_CACHE, MAX_BYTES_ENTRADA, MAX_PROCESSOS_CACHE, PODA_A_CADA, prefixoCache } from "./modelo/constantes";
import type { EntradaCache } from "./modelo/tipos";

let gravacoes = 0;

const entradaValida = (v: unknown): v is EntradaCache =>
  !!v && typeof v === "object" && typeof (v as EntradaCache).em === "number" && !!(v as EntradaCache).fatias && typeof (v as EntradaCache).fatias === "object";

/**
 * Cache dos processos em `chrome.storage.local`, uma chave por processo. Tolerante: qualquer falha do storage
 * (cota cheia, contexto invalidado) vira "sem cache", nunca exceção.
 */
export class RepositorioProcesso {
  constructor(
    private readonly area: Area,
    readonly escopo: string,
    readonly id: string,
  ) {}

  get chave(): string {
    return chaveCache(this.escopo, this.id);
  }

  async ler(): Promise<EntradaCache | null> {
    try {
      const v = (await this.area.obter(this.chave))[this.chave];
      return entradaValida(v) ? v : null;
    } catch {
      return null;
    }
  }

  /** Grava a entrada; devolve falso quando não gravou (escopo sem login, entrada grande, cota cheia). */
  async gravar(e: EntradaCache): Promise<boolean> {
    if (!escopoValido(this.escopo)) return false;
    try {
      if (JSON.stringify(e).length > MAX_BYTES_ENTRADA) return false;
      await this.area.gravar({ [this.chave]: e });
    } catch {
      return false;
    }
    gravacoes += 1;
    await podarCache(this.area, gravacoes % PODA_A_CADA === 0);
    return true;
  }
}

/** Mantém no máximo `MAX_PROCESSOS_CACHE` processos (e `MAX_BYTES_CACHE` bytes, se `conferirBytes`), apagando os mais antigos. */
export async function podarCache(area: Area, conferirBytes = false): Promise<number> {
  try {
    if (area.chaves && !conferirBytes) {
      const n = (await area.chaves()).filter((k) => k.startsWith(prefixoCache)).length;
      if (n <= MAX_PROCESSOS_CACHE) return 0;
    }
    const todas = await obterPorPrefixo(area, prefixoCache);
    const lista = Object.entries(todas)
      .filter(([, v]) => entradaValida(v))
      .map(([k, v]) => ({ k, em: (v as EntradaCache).em, bytes: JSON.stringify(v).length }))
      .sort((a, b) => b.em - a.em);
    const apagar: string[] = [];
    let bytes = 0;
    lista.forEach((x, i) => {
      bytes += x.bytes;
      if (i >= MAX_PROCESSOS_CACHE || bytes > MAX_BYTES_CACHE) apagar.push(x.k);
    });
    // Entradas inválidas (de uma versão antiga) também saem.
    for (const k of Object.keys(todas)) if (!lista.some((x) => x.k === k)) apagar.push(k);
    if (apagar.length) await area.remover(apagar);
    return apagar.length;
  } catch {
    return 0;
  }
}
