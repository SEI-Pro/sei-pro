import { pedirTrava } from "../src/sincronia/locksFirefox";
import { checar, secao } from "./util";

/**
 * O Firefox, no content script: o `navigator.locks` e o da PAGINA (Xray). O gerente da pagina chama o callback
 * e espera a promessa que ele devolve -- mas uma promessa do content script e de outro compartimento, e ler
 * o `.then` dela da "Permission denied to access property \"then\"" (medido ao vivo em 24/10/2026, Acoes em
 * lote). Aqui, um gerente "da pagina" que so aceita promessa criada pelo Promise da pagina.
 */
class PromessaDaPagina<T> extends Promise<T> {}
const pagina = { Promise: PromessaDaPagina };
const exportadas = new Set<unknown>();
const exportFunction = <F>(f: F): F => {
  exportadas.add(f);
  return f;
};

function gerenteDaPagina() {
  return {
    request(_nome: string, a: unknown, b?: unknown): Promise<unknown> {
      const cb = (typeof a === "function" ? a : b) as (lock: unknown) => unknown;
      if (!exportadas.has(cb)) return Promise.reject(new Error("callback do content script sem exportFunction"));
      const r = cb({ name: _nome });
      if (!(r instanceof PromessaDaPagina)) return Promise.reject(new Error('Permission denied to access property "then"'));
      return r;
    },
  };
}

export async function verificarLocksFirefox(): Promise<void> {
  secao("travas no content script do Firefox (locks da pagina)");
  const ambiente = { pagina, exportFunction };
  const v = await pedirTrava(gerenteDaPagina(), "t", {}, async () => 42, ambiente);
  checar("devolve o valor de fn", v === 42);
  let erro: unknown = null;
  try {
    await pedirTrava(
      gerenteDaPagina(),
      "t",
      {},
      async () => {
        throw new Error("fn falhou");
      },
      ambiente,
    );
  } catch (e) {
    erro = e;
  }
  checar("o erro de fn chega a quem chamou, intacto", erro instanceof Error && (erro as Error).message === "fn falhou");
  const recebeu: unknown[] = [];
  await pedirTrava(gerenteDaPagina(), "t", {}, async (lock) => recebeu.push(lock), ambiente);
  checar("fn recebe o lock", (recebeu[0] as { name?: string } | undefined)?.name === "t");

  secao("travas: sem opcoes, a forma de dois argumentos (esperar a vez)");
  {
    const formas: number[] = [];
    const g = {
      request: async (...a: unknown[]) => {
        formas.push(a.length);
        return (a[a.length - 1] as (l: unknown) => unknown)({});
      },
    };
    await pedirTrava(g, "t", null, async () => 1, null);
    await pedirTrava(g, "t", null, async () => 1, ambiente);
    checar("opcoes null: request(nome, cb), com e sem o ambiente do Firefox", formas.join() === "2,2", formas);
  }

  secao("travas fora do Firefox: o pedido de sempre");
  let direto = 0;
  const comum = {
    request: async (_n: string, _o: unknown, cb: (l: unknown) => Promise<unknown>) => {
      direto++;
      return cb({});
    },
  };
  checar(
    "sem o ambiente do Firefox, chama o gerente com fn",
    (await pedirTrava(comum, "t", {}, async () => 5, null)) === 5 && direto === 1,
  );
}
