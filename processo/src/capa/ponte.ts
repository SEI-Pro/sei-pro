/**
 * A ponte real entre a capa (quadro do visualizador) e o quadro da árvore: o que `controle.ts` espera de `PonteDaArvore`
 * e de `FonteDeCache`, ligado ao DOM do navegador. Os quadros são da mesma origem, então a capa lê e dispara eventos no
 * documento da árvore; o `detail` de um evento não atravessa mundos isolados, por isso o pedido é só o nome do evento e
 * o que volta (progresso da coleta) vai num atributo do <html> da árvore. O cache é o `chrome.storage.local`.
 */
import type { Area } from "@comum/armazenamento/area";
import {
  ATRIBUTO_COLETA,
  ATRIBUTO_CONTAGEM,
  chaveCache,
  chaveHistorico,
  EVENTO_ABRIR_GANTT,
  EVENTO_CAPA_CALCULAR,
  EVENTO_CAPA_CANCELAR,
  EVENTO_CAPA_CONTAR,
  EVENTO_CAPA_PARAR_CONTAGEM,
  EVENTO_CAPA_PEDIR,
} from "../modelo/constantes";
import type { DadoAtribuicao, DadoBlocoInterno, DadoMarcador, DadoProcesso } from "../modelo/dados";
import { RepositorioHistorico, RepositorioProcesso } from "../repositorio";
import type { EstadoContagem } from "./cards";
import type { FonteDeCache, PonteDaArvore } from "./controle";
import type { EstadoColeta, FatiasLidas } from "./vista";

/** "coletando:3/34", "erro:mensagem", "pronto" ou ausente. */
export function lerColeta(valor: string | null): EstadoColeta | "pronto" {
  if (!valor) return { fase: "parada" };
  if (valor === "pronto") return "pronto";
  if (valor.startsWith("coletando:")) {
    const [feito = 0, total = 0] = valor
      .slice("coletando:".length)
      .split("/")
      .map((n) => Number.parseInt(n, 10) || 0);
    return { fase: "coletando", feito, total };
  }
  if (valor.startsWith("erro:")) return { fase: "erro", mensagem: valor.slice("erro:".length) || "Não foi possível calcular." };
  return { fase: "parada" };
}

export function textoDaColeta(e: EstadoColeta | "pronto"): string | null {
  if (e === "pronto") return "pronto";
  if (e.fase === "coletando") return `coletando:${e.feito}/${e.total}`;
  if (e.fase === "erro") return `erro:${e.mensagem}`;
  return null;
}

/** "contando:2/5", "parou:3", "erro:mensagem", "pronto" ou ausente. */
export function lerContagem(valor: string | null): EstadoContagem {
  if (!valor || valor === "pronto") return { fase: "parada" };
  if (valor.startsWith("contando:")) {
    const [feito = 0, total = 0] = valor
      .slice("contando:".length)
      .split("/")
      .map((n) => Number.parseInt(n, 10) || 0);
    return { fase: "contando", feito, total };
  }
  if (valor.startsWith("parou:")) return { fase: "parou", restantes: Number.parseInt(valor.slice("parou:".length), 10) || 0 };
  if (valor.startsWith("erro:")) return { fase: "erro", mensagem: valor.slice("erro:".length) || "Não foi possível contar." };
  return { fase: "parada" };
}

export function textoDaContagem(e: EstadoContagem | "pronto"): string | null {
  if (e === "pronto") return "pronto";
  if (e.fase === "contando") return `contando:${e.feito}/${e.total}`;
  if (e.fase === "parou") return `parou:${e.restantes}`;
  if (e.fase === "erro") return `erro:${e.mensagem}`;
  return null;
}

/** Espera o menor intervalo antes de avisar: a árvore muda muito (ícones, filtro) e a capa só precisa do resultado. */
const ESPERA_ARVORE_MS = 250;

export function criarPonte(topo: Document): PonteDaArvore {
  const quadro = (): HTMLIFrameElement | null => topo.querySelector<HTMLIFrameElement>("#ifrArvore");
  const documento = (): Document | null => {
    try {
      return quadro()?.contentDocument ?? null;
    } catch {
      return null;
    }
  };
  const disparar = (nome: string): void => {
    const d = documento();
    const Ev = (d?.defaultView as unknown as { Event?: typeof Event } | null)?.Event;
    if (d && Ev) d.dispatchEvent(new Ev(nome));
  };
  return {
    documento,
    pedirFatias: () => disparar(EVENTO_CAPA_PEDIR),
    calcular: () => disparar(EVENTO_CAPA_CALCULAR),
    cancelar: () => disparar(EVENTO_CAPA_CANCELAR),
    abrirHistorico: () => disparar(EVENTO_ABRIR_GANTT),
    contar: () => disparar(EVENTO_CAPA_CONTAR),
    pararContagem: () => disparar(EVENTO_CAPA_PARAR_CONTAGEM),
    contagem: () => lerContagem(documento()?.documentElement?.getAttribute(ATRIBUTO_CONTAGEM) ?? null),
    aoMudarArvore(cb) {
      let obs: MutationObserver | null = null;
      let relogio: ReturnType<typeof setTimeout> | null = null;
      const avisar = () => {
        if (relogio) return;
        relogio = setTimeout(() => {
          relogio = null;
          cb();
        }, ESPERA_ARVORE_MS);
      };
      const olhar = () => {
        obs?.disconnect();
        obs = null;
        const d = documento();
        const Observador = (d?.defaultView as unknown as { MutationObserver?: typeof MutationObserver } | null)?.MutationObserver;
        if (d?.documentElement && Observador) {
          obs = new Observador(avisar);
          // Pastas que carregam mudam os filhos de #divArvore; o andamento do "Contar tudo" muda o atributo do <html>.
          obs.observe(d.documentElement, { childList: true, subtree: true });
          obs.observe(d.documentElement, { attributes: true, attributeFilter: [ATRIBUTO_CONTAGEM] });
        }
      };
      olhar();
      const q = quadro();
      q?.addEventListener("load", olhar);
      return () => {
        obs?.disconnect();
        if (relogio) clearTimeout(relogio);
        q?.removeEventListener("load", olhar);
      };
    },
    coleta: () => lerColeta(documento()?.documentElement?.getAttribute(ATRIBUTO_COLETA) ?? null),
    aoMudarColeta(cb) {
      let obs: MutationObserver | null = null;
      const olhar = () => {
        obs?.disconnect();
        obs = null;
        const d = documento();
        const Observador = (d?.defaultView as unknown as { MutationObserver?: typeof MutationObserver } | null)?.MutationObserver;
        if (d?.documentElement && Observador) {
          obs = new Observador(cb);
          obs.observe(d.documentElement, { attributes: true, attributeFilter: [ATRIBUTO_COLETA] });
        }
      };
      olhar();
      const q = quadro();
      q?.addEventListener("load", olhar);
      return () => {
        obs?.disconnect();
        q?.removeEventListener("load", olhar);
      };
    },
    aoRecarregarArvore(cb) {
      const q = quadro();
      q?.addEventListener("load", cb);
      return () => q?.removeEventListener("load", cb);
    },
  };
}

/** O cache do processo e o do histórico, lidos como o quadro da árvore os grava (a capa nunca escreve). */
export function criarFonteDeCache(area: Area, escopo: string, id: string): FonteDeCache {
  const proc = new RepositorioProcesso(area, escopo, id);
  const hist = new RepositorioHistorico(area, escopo, id);
  const chaves = new Set([chaveCache(escopo, id), chaveHistorico(escopo, id)]);
  return {
    async fatias(): Promise<FatiasLidas> {
      const e = await proc.ler();
      const dado = <T>(n: string): T | undefined =>
        (e?.fatias as Record<string, { dado: unknown } | undefined> | undefined)?.[n]?.dado as T | undefined;
      const saida: FatiasLidas = {};
      const dp = dado<DadoProcesso>("dadosProcesso");
      const mk = dado<DadoMarcador>("marcador");
      const bi = dado<DadoBlocoInterno>("blocoInterno");
      const at = dado<DadoAtribuicao>("atribuicao");
      if (dp) saida.dadosProcesso = dp;
      if (mk) saida.marcador = mk;
      if (bi) saida.blocoInterno = bi;
      if (at) saida.atribuicao = at;
      return saida;
    },
    historico: () => hist.ler(),
    aoMudar: (cb) => area.aoMudar((m) => (Object.keys(m).some((k) => chaves.has(k)) ? cb() : undefined)),
  };
}
