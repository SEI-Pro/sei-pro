import { criarComparador, type TrabalhadorLike } from "@cd/app/trabalhador";
import type { Bloco } from "@cd/modelo/blocos";
import { compararBlocos } from "@cd/modelo/diff";
import { type Pedido, type Resposta, tratar } from "@cd/worker/protocolo";
import { checar, igual, lanca, secao, tique } from "./util";

const b = (t: string): Bloco => ({ html: t, texto: t, tag: "p" });
const A = [b("um"), b("dois velho texto aqui"), b("tres")];
const D = [b("um"), b("dois novo texto aqui"), b("tres")];

/** Worker falso que roda o tratador de verdade, de forma assincrona (como o real). */
function falso(opcoes: { falhar?: "criar" | "erro" | "resposta"; mudo?: boolean } = {}) {
  const w = {
    pedidos: [] as Pedido[],
    encerrado: false,
    onmessage: null as ((e: { data: unknown }) => void) | null,
    onerror: null as ((e: unknown) => void) | null,
    postMessage(m: unknown) {
      this.pedidos.push(m as Pedido);
      if (opcoes.mudo) return;
      setTimeout(() => {
        if (opcoes.falhar === "erro") this.onerror?.(new Error("worker quebrou"));
        else if (opcoes.falhar === "resposta")
          this.onmessage?.({ data: { id: (m as Pedido).id, ok: false, erro: "falhou la dentro" } satisfies Resposta });
        else this.onmessage?.({ data: tratar(m as Pedido) });
      }, 0);
    },
    terminate() {
      this.encerrado = true;
    },
  };
  return w satisfies TrabalhadorLike;
}

export async function verificarTrabalhador(): Promise<void> {
  secao("trabalhador");

  igual("tratar: pedido valido devolve a edicao do diff", tratar({ id: 7, antes: A, depois: D }), {
    id: 7,
    ok: true,
    edicao: compararBlocos(A, D),
  });
  const ruim = tratar({ id: 8, antes: null as unknown as Bloco[], depois: D });
  checar("tratar: excecao vira ok:false com texto", ruim.ok === false && typeof ruim.erro === "string" && ruim.erro.length > 0, ruim);

  const w1 = falso();
  const c1 = criarComparador("x.js", () => w1);
  igual("resposta ok devolve a Edicao", await c1.comparar(A, D), compararBlocos(A, D));
  igual("modo worker quando funciona", c1.modo, "worker");

  const w2 = falso({ falhar: "resposta" });
  const c2 = criarComparador("x.js", () => w2);
  const e2 = await lanca(() => c2.comparar(A, D));
  checar("ok:false rejeita com o texto", /falhou la dentro/.test(e2?.message ?? ""), e2);

  const c3 = criarComparador("x.js", () => {
    throw new Error("sem Worker");
  });
  igual("criar lancando: plano B devolve o mesmo resultado", await c3.comparar(A, D), compararBlocos(A, D));
  igual("criar lancando: modo fatias", c3.modo, "fatias");

  const w4 = falso({ falhar: "erro" });
  const c4 = criarComparador("x.js", () => w4);
  igual("onerror antes de responder: plano B", await c4.comparar(A, D), compararBlocos(A, D));
  igual("onerror: modo fatias", c4.modo, "fatias");
  checar("onerror: worker encerrado", w4.encerrado, "");

  const w5 = falso({ mudo: true });
  const c5 = criarComparador("x.js", () => w5);
  const ctl = new AbortController();
  const pendente = lanca(() => c5.comparar(A, D, ctl.signal));
  await tique();
  ctl.abort();
  const e5 = await pendente;
  checar("abortar rejeita com AbortError", (e5 as { name?: string } | null)?.name === "AbortError", e5);
  checar("abortar encerra o worker", w5.encerrado, "");
  const jaAbortado = new AbortController();
  jaAbortado.abort();
  const e5b = await lanca(() => c5.comparar(A, D, jaAbortado.signal));
  checar("sinal ja abortado rejeita sem enviar", (e5b as { name?: string } | null)?.name === "AbortError", e5b);

  const w6 = falso();
  const c6 = criarComparador("x.js", () => w6);
  const [r1, r2] = await Promise.all([c6.comparar(A, D), c6.comparar(D, A)]);
  igual("duas comparacoes em paralelo nao se misturam (1)", r1, compararBlocos(A, D));
  igual("duas comparacoes em paralelo nao se misturam (2)", r2, compararBlocos(D, A));
  checar(
    "ids diferentes",
    w6.pedidos.length === 2 && w6.pedidos[0]!.id !== w6.pedidos[1]!.id,
    w6.pedidos.map((p) => p.id),
  );

  // Abortar um pedido encerra o Worker; os outros pendentes precisam ser refeitos em outro, nenhum fica pendurado.
  const fila = [falso({ mudo: true }), falso()];
  let n = 0;
  const c7 = criarComparador("x.js", () => fila[n++]!);
  const ctl7 = new AbortController();
  const p1 = lanca(() => c7.comparar(A, D, ctl7.signal));
  const p2 = c7.comparar(D, A);
  const p3 = c7.comparar(A, A);
  await tique();
  ctl7.abort();
  const limite = <T>(p: Promise<T>): Promise<T | "pendurado"> => Promise.race([p, tique(200).then(() => "pendurado" as const)]);
  checar("abortar um pedido: o abortado rejeita", ((await p1) as { name?: string } | null)?.name === "AbortError", "");
  igual("abortar um pedido: o segundo ainda resolve", await limite(p2), compararBlocos(D, A));
  igual("abortar um pedido: o terceiro ainda resolve", await limite(p3), compararBlocos(A, A));

  c6.encerrar();
  checar("encerrar termina o worker", w6.encerrado, "");
}
