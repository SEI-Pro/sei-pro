/**
 * Histórico de conversas, no IndexedDB da própria página do painel.
 *
 * Guarda SÓ A TRANSCRIÇÃO — o que apareceu na tela. Ficam de fora, de
 * propósito, o histórico que vai ao modelo e o mapa de pseudônimos (a tabela
 * que liga `[PESSOA_1]` ao nome real): em disco, seriam a parte mais sensível
 * da conversa, legível por quem tiver acesso ao perfil do navegador — e um
 * computador de unidade costuma ser compartilhado. Por isso uma conversa
 * antiga abre para LER e EXPORTAR, nunca para continuar.
 *
 * Duas lojas: `conversas` guarda o resumo (título, data, gasto) e `itens`
 * guarda a transcrição. Assim a lista da tela não carrega megabytes de texto
 * para mostrar cinco linhas.
 *
 * Nada aqui é essencial: sem IndexedDB (janela anônima, perfil restrito), toda
 * função falha em silêncio e o agente segue funcionando sem histórico.
 */

export interface ResumoConversa {
  id: string;
  titulo: string;
  /** Última atualização, em ms. */
  quando: number;
  /** Host do SEI em que a conversa aconteceu. */
  host?: string;
  uso: { entrada: number; saida: number; custo: number; cache?: number };
  mensagens: number;
}

export interface ConversaSalva extends ResumoConversa {
  itens: unknown[];
}

const BANCO = "agenteIA";
const RESUMOS = "conversas";
const ITENS = "itens";

function abrir(): Promise<IDBDatabase> {
  return new Promise((ok, erro) => {
    const pedido = indexedDB.open(BANCO, 1);
    pedido.onupgradeneeded = () => {
      const bd = pedido.result;
      if (!bd.objectStoreNames.contains(RESUMOS)) bd.createObjectStore(RESUMOS, { keyPath: "id" }).createIndex("quando", "quando");
      if (!bd.objectStoreNames.contains(ITENS)) bd.createObjectStore(ITENS, { keyPath: "id" });
    };
    pedido.onsuccess = () => ok(pedido.result);
    pedido.onerror = () => erro(pedido.error ?? new Error("IndexedDB indisponível."));
  });
}

/** Roda uma transação e devolve o resultado, fechando o banco no fim. */
async function transacao<T>(lojas: string[], modo: IDBTransactionMode, corpo: (t: IDBTransaction) => Promise<T> | T): Promise<T> {
  const bd = await abrir();
  try {
    const t = bd.transaction(lojas, modo);
    const valor = await corpo(t);
    await new Promise<void>((ok, erro) => {
      t.oncomplete = () => ok();
      t.onerror = t.onabort = () => erro(t.error ?? new Error("Transação recusada."));
    });
    return valor;
  } finally {
    bd.close();
  }
}

const comoPromessa = <T>(p: IDBRequest<T>): Promise<T> =>
  new Promise((ok, erro) => {
    p.onsuccess = () => ok(p.result);
    p.onerror = () => erro(p.error ?? new Error("Falha no IndexedDB."));
  });

export async function salvar(c: ConversaSalva): Promise<void> {
  const { itens, ...resumo } = c;
  await transacao([RESUMOS, ITENS], "readwrite", (t) => {
    t.objectStore(RESUMOS).put(resumo);
    t.objectStore(ITENS).put({ id: c.id, itens });
  });
}

/** Resumos, do mais recente para o mais antigo. */
export async function listar(limite = 100): Promise<ResumoConversa[]> {
  return transacao([RESUMOS], "readonly", async (t) => {
    const todos = (await comoPromessa(t.objectStore(RESUMOS).getAll())) as ResumoConversa[];
    return todos.sort((a, b) => b.quando - a.quando).slice(0, limite);
  });
}

export async function obter(id: string): Promise<ConversaSalva | null> {
  return transacao([RESUMOS, ITENS], "readonly", async (t) => {
    const resumo = (await comoPromessa(t.objectStore(RESUMOS).get(id))) as ResumoConversa | undefined;
    if (!resumo) return null;
    const corpo = (await comoPromessa(t.objectStore(ITENS).get(id))) as { itens: unknown[] } | undefined;
    return { ...resumo, itens: corpo?.itens ?? [] };
  });
}

export async function remover(id: string): Promise<void> {
  await transacao([RESUMOS, ITENS], "readwrite", (t) => {
    t.objectStore(RESUMOS).delete(id);
    t.objectStore(ITENS).delete(id);
  });
}

export async function limpar(): Promise<void> {
  await transacao([RESUMOS, ITENS], "readwrite", (t) => {
    t.objectStore(RESUMOS).clear();
    t.objectStore(ITENS).clear();
  });
}

/** Apaga o que passou de `dias` (0 = guardar para sempre). Devolve quantas saíram. */
export async function podar(dias: number): Promise<number> {
  if (!dias) return 0;
  const limite = Date.now() - dias * 86_400_000;
  const velhas = (await listar(1000)).filter((c) => c.quando < limite);
  for (const c of velhas) await remover(c.id);
  return velhas.length;
}
