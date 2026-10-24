/**
 * `navigator.locks.request` que funciona também no content script do Firefox.
 *
 * Lá, o `navigator` do content script é o da página (Xray): o gerente de travas da página chama o callback e
 * espera a promessa que ele devolve, mas uma promessa do content script é de outro compartimento e ler o `.then`
 * dela dá "Permission denied to access property \"then\"" (medido ao vivo em 24/10/2026, Ações em lote). Aqui, no
 * Firefox, o callback é exportado para a página e devolve uma promessa DA PÁGINA; o resultado (ou o erro) de `fn`
 * fica guardado do lado do content script e nunca atravessa a fronteira. Fora do Firefox, o pedido de sempre.
 *
 * Cópia de `sei-comum/src/sincronia/locksFirefox.ts`: o `sei-nucleo` não depende do `sei-comum`.
 */

export interface AmbienteFirefox {
  /** `window.wrappedJSObject`: o mundo da página. */
  pagina: { Promise: PromiseConstructor; Object?: ObjectConstructor };
  exportFunction<F>(f: F): F;
}

type Gerente = { request(nome: string, ...resto: unknown[]): Promise<unknown> };

/** O ambiente do content script do Firefox, ou null (Chrome, página da extensão, testes). */
export function ambienteDoFirefox(): AmbienteFirefox | null {
  const g = globalThis as unknown as {
    wrappedJSObject?: AmbienteFirefox["pagina"];
    window?: { wrappedJSObject?: AmbienteFirefox["pagina"] };
    exportFunction?: <F>(f: F, alvo: unknown) => F;
  };
  const pagina = g.wrappedJSObject ?? g.window?.wrappedJSObject;
  const exportar = g.exportFunction;
  if (!pagina || typeof exportar !== "function") return null;
  return { pagina, exportFunction: (f) => exportar(f, pagina) };
}

/** As opções viram objeto da página (um objeto do content script chegaria opaco ao gerente da página). */
function opcoesDaPagina(opcoes: Record<string, unknown>, a: AmbienteFirefox): unknown {
  if (!a.pagina.Object) return opcoes;
  const o = new a.pagina.Object() as Record<string, unknown>;
  for (const [k, v] of Object.entries(opcoes)) if (v !== undefined) o[k] = v;
  return o;
}

export function pedirTrava<T>(
  locks: Gerente,
  nome: string,
  /** null = sem opções: `request(nome, cb)` (esperar a vez), a forma que o resto do código usa. */
  opcoes: Record<string, unknown> | null,
  fn: (lock: unknown) => Promise<T>,
  ambiente: AmbienteFirefox | null = ambienteDoFirefox(),
): Promise<T> {
  if (!ambiente) return (opcoes ? locks.request(nome, opcoes, fn) : locks.request(nome, fn)) as Promise<T>;
  let saida: { ok: true; valor: T } | { ok: false; erro: unknown } | null = null;
  const { pagina, exportFunction } = ambiente;
  const cb = exportFunction(
    (lock: unknown) =>
      new pagina.Promise<void>(
        exportFunction((resolver: () => void) => {
          fn(lock).then(
            (valor) => {
              saida = { ok: true, valor };
              resolver();
            },
            (erro: unknown) => {
              saida = { ok: false, erro };
              resolver();
            },
          );
        }),
      ),
  );
  const pedido = opcoes ? locks.request(nome, opcoesDaPagina(opcoes, ambiente), cb) : locks.request(nome, cb);
  return Promise.resolve(pedido).then(() => {
    const s = saida as { ok: true; valor: T } | { ok: false; erro: unknown } | null;
    if (!s) throw new Error("trava: o gerente de travas soltou sem rodar a função");
    if (s.ok) return s.valor;
    throw s.erro;
  });
}
