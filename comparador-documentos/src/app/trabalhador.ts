/**
 * Cliente do Worker da comparação. A página manda os blocos, o Worker calcula fora da thread principal.
 * Se o Worker não puder ser criado ou quebrar antes de responder, o mesmo cálculo roda na própria thread (plano B,
 * `modo === "fatias"`), cedendo a vez antes de começar para a tela mostrar o "carregando".
 */
import type { Bloco } from "@cd/modelo/blocos";
import { compararBlocos, type Edicao } from "@cd/modelo/diff";
import type { Pedido, Resposta } from "@cd/worker/protocolo";

export interface TrabalhadorLike {
  postMessage(m: unknown): void;
  terminate(): void;
  onmessage: ((e: { data: unknown }) => void) | null;
  onerror: ((e: unknown) => void) | null;
}

export interface Comparador {
  comparar(antes: Bloco[], depois: Bloco[], sinal?: AbortSignal): Promise<Edicao>;
  encerrar(): void;
  readonly modo: "worker" | "fatias";
}

interface Pendente {
  pedido: Pedido;
  ok(e: Edicao): void;
  erro(e: unknown): void;
}

const abortado = (): Error => Object.assign(new Error("Comparação cancelada."), { name: "AbortError" });
const ceder = (): Promise<void> => new Promise((r) => setTimeout(r, 0));

export function criarComparador(
  url: string,
  criar: (url: string) => TrabalhadorLike = (u) => new Worker(u) as unknown as TrabalhadorLike,
): Comparador {
  let worker: TrabalhadorLike | null = null;
  let modo: "worker" | "fatias" = "worker";
  let proximoId = 1;
  const pendentes = new Map<number, Pendente>();

  const emFatias = async (p: Pedido): Promise<Edicao> => {
    await ceder();
    return compararBlocos(p.antes, p.depois);
  };

  const cair = (): void => {
    modo = "fatias";
    worker?.terminate();
    worker = null;
    const todos = [...pendentes.values()];
    pendentes.clear();
    for (const p of todos) emFatias(p.pedido).then(p.ok, p.erro);
  };

  /** O cálculo em andamento não dá para interromper por dentro: encerra o Worker e refaz os pendentes em outro. */
  const reiniciar = (): void => {
    worker?.terminate();
    worker = null;
    const restantes = [...pendentes.values()];
    if (!restantes.length) return;
    const novo = garantir();
    for (const p of restantes) {
      if (novo) novo.postMessage(p.pedido);
      else {
        pendentes.delete(p.pedido.id);
        emFatias(p.pedido).then(p.ok, p.erro);
      }
    }
  };

  const garantir = (): TrabalhadorLike | null => {
    if (modo === "fatias") return null;
    if (worker) return worker;
    try {
      const w = criar(url);
      w.onmessage = (e) => {
        const r = e.data as Resposta;
        const p = pendentes.get(r.id);
        if (!p) return;
        pendentes.delete(r.id);
        if (r.ok) p.ok(r.edicao);
        else p.erro(new Error(r.erro));
      };
      w.onerror = () => cair();
      worker = w;
      return w;
    } catch {
      modo = "fatias";
      return null;
    }
  };

  return {
    get modo() {
      return modo;
    },
    comparar(antes, depois, sinal) {
      if (sinal?.aborted) return Promise.reject(abortado());
      const pedido: Pedido = { id: proximoId++, antes, depois };
      const w = garantir();
      if (!w) return emFatias(pedido);
      return new Promise<Edicao>((ok, erro) => {
        pendentes.set(pedido.id, { pedido, ok, erro });
        sinal?.addEventListener(
          "abort",
          () => {
            if (!pendentes.delete(pedido.id)) return;
            reiniciar();
            erro(abortado());
          },
          { once: true },
        );
        w.postMessage(pedido);
      });
    },
    encerrar() {
      worker?.terminate();
      worker = null;
      pendentes.clear();
    },
  };
}
