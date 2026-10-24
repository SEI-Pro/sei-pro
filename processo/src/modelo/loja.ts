import type { Area } from "@comum/armazenamento/area";
import { RepositorioProcesso } from "../repositorio";
import { ESPERA_TENTATIVA_MS, TENTATIVAS_PADRAO } from "./constantes";
import type { EntradaCache, Fatia, NomeFatia } from "./tipos";

export interface DepsLoja {
  agora?: () => number;
  /** Espera entre tentativas (os testes passam uma versão imediata). */
  esperar?: (ms: number) => Promise<void>;
  /** Processo sigiloso: nada vai para o cache persistente. */
  sigiloso?: boolean;
}

const mensagem = (e: unknown): string => (e instanceof Error ? e.message : typeof e === "string" ? e : "Falha ao carregar.");

/**
 * Loja de UM processo: cada fatia de dado tem estado próprio e carrega de forma independente. O cache em
 * `chrome.storage.local` só entra para pintar rápido (estado `desatualizado`) até o SEI confirmar.
 */
export class LojaProcesso {
  /** Quando verdadeiro, nada é gravado no cache (processo sigiloso, descoberto depois de criar a loja). */
  sigiloso: boolean;
  private readonly agora: () => number;
  private readonly esperar: (ms: number) => Promise<void>;
  private readonly repo: RepositorioProcesso;
  private readonly fatias = new Map<NomeFatia, Fatia<unknown>>();
  private readonly ouvintes = new Set<(n: NomeFatia) => void>();
  private readonly emAndamento = new Map<NomeFatia, Promise<void>>();
  private cache: Promise<EntradaCache | null> | null = null;
  private espelho: EntradaCache = { em: 0, fatias: {} };
  private fila: Promise<unknown> = Promise.resolve();
  /** Gravações do cache em curso, em ordem; `carregar` só termina depois delas. */
  private gravando: Promise<void> = Promise.resolve();

  constructor(area: Area, escopo: string, id: string, deps: DepsLoja = {}) {
    this.repo = new RepositorioProcesso(area, escopo, id);
    this.agora = deps.agora ?? Date.now;
    this.esperar = deps.esperar ?? ((ms) => new Promise((r) => setTimeout(r, ms)));
    this.sigiloso = deps.sigiloso ?? false;
  }

  ler<T>(n: NomeFatia): Fatia<T> {
    return (this.fatias.get(n) as Fatia<T> | undefined) ?? { estado: "carregando", em: 0 };
  }

  /** Troca a fatia, avisa os ouvintes e, se estiver pronta, guarda no cache. */
  definir<T>(n: NomeFatia, f: Fatia<T>): void {
    this.fatias.set(n, f);
    for (const cb of [...this.ouvintes]) {
      try {
        cb(n);
      } catch {
        // um painel com defeito não pode impedir os outros de redesenhar
      }
    }
    if (f.estado === "pronto" && f.dado !== undefined) {
      const dado = f.dado;
      this.gravando = this.gravando.then(() => this.guardar(n, dado, f.em)).catch(() => undefined);
    }
  }

  aoMudar(cb: (n: NomeFatia) => void): () => void {
    this.ouvintes.add(cb);
    return () => this.ouvintes.delete(cb);
  }

  /**
   * Carrega a fatia: pinta o cache como `desatualizado`, busca, tenta de novo até `tentativas` vezes no total e
   * termina `pronto` ou `erro` (com o dado anterior mantido). Nunca rejeita. Chamadas simultâneas na mesma
   * fatia dividem a mesma busca.
   */
  carregar<T>(n: NomeFatia, buscar: () => Promise<T>, o: { tentativas?: number } = {}): Promise<void> {
    const ativa = this.emAndamento.get(n);
    if (ativa) return ativa;
    const p = this.executar(n, buscar, Math.max(1, o.tentativas ?? TENTATIVAS_PADRAO))
      .then(() => this.gravando)
      .finally(() => this.emAndamento.delete(n));
    this.emAndamento.set(n, p);
    return p;
  }

  /** Serializa as gravações no SEI deste processo: duas ao mesmo tempo derrubariam os formulários uma da outra. */
  enfileirar<R>(fn: () => Promise<R>): Promise<R> {
    const p = this.fila.then(fn, fn);
    this.fila = p.catch(() => undefined);
    return p;
  }

  private async executar<T>(n: NomeFatia, buscar: () => Promise<T>, tentativas: number): Promise<void> {
    const atual = this.ler<T>(n);
    let anterior: { dado?: T; em: number } = { dado: atual.dado, em: atual.em };
    if (anterior.dado === undefined && !this.sigiloso) {
      const c = (await this.carregarCache())?.fatias[n];
      if (c) anterior = { dado: c.dado as T, em: c.em };
    }
    if (anterior.dado !== undefined) this.definir<T>(n, { estado: "desatualizado", dado: anterior.dado, em: anterior.em });
    else this.definir<T>(n, { estado: "carregando", em: this.agora() });

    let falha: unknown;
    for (let i = 0; i < tentativas; i++) {
      if (i > 0) await this.esperar(ESPERA_TENTATIVA_MS * i);
      try {
        const dado = await buscar();
        this.definir<T>(n, { estado: "pronto", dado, em: this.agora() });
        return;
      } catch (e) {
        falha = e;
      }
    }
    this.definir<T>(n, { estado: "erro", dado: anterior.dado, erro: mensagem(falha), em: this.agora() });
  }

  private carregarCache(): Promise<EntradaCache | null> {
    this.cache ??= this.repo.ler().then((e) => {
      if (e) this.espelho = e;
      return e;
    });
    return this.cache;
  }

  private async guardar(n: NomeFatia, dado: unknown, em: number): Promise<void> {
    if (this.sigiloso) return;
    await this.carregarCache();
    if (this.sigiloso) return;
    this.espelho = { em, fatias: { ...this.espelho.fatias, [n]: { dado, em } } };
    await this.repo.gravar(this.espelho);
  }
}
