/**
 * O que o app do Comparador pede à aba do SEI: o documento A marcado na árvore, a lista dos candidatos a B, o HTML de
 * cada documento, os tipos de documento e a criação do documento comparado. Roda aqui porque usa a sessão da aba.
 *
 * Tudo atravessa a ponte como JSON simples: `{ ok: true, ... }` ou `{ ok: false, erro, sessao? }` (`sessao`: a sessão
 * do SEI caiu). O app nunca vê o endereço assinado dos documentos nem `infra_hash`: a aba guarda cada `src` por id e
 * só lê o que está na lista que ela mesma montou.
 */
import type { Tratador } from "@comum/ponte/rpc";
import { type Arvore, abrirArvore } from "@nucleo/dominio/arvore";
import type { Sei } from "@nucleo/sei";
import { ehErroSei } from "@nucleo/sessao/erros";
import { criarComparativo, nivelDoComparativo, tiposParaCriar } from "../sei/criar";
import { type Candidato, lerHtml, listarCandidatos } from "../sei/documentos";
import type { ContextoComparador } from "./contexto";

/** As chamadas ao SEI, trocáveis nas provas para forçar cada desfecho sem rede. */
export interface Chamadas {
  abrirArvore(sei: Sei, link: string): Promise<Arvore>;
  lerHtml: typeof lerHtml;
  tiposParaCriar: typeof tiposParaCriar;
  criarComparativo: typeof criarComparativo;
}

const chamadasPadrao: Chamadas = {
  abrirArvore: (sei, link) => abrirArvore(sei.http, link),
  lerHtml,
  tiposParaCriar,
  criarComparativo,
};

export interface DepsExecutor {
  sei: Sei;
  ctx: ContextoComparador;
  /** Documento marcado na árvore agora (lido a cada abertura do comparador). */
  selecionado(): { id: string; titulo: string } | null;
  /** Tira o iframe do modal da tela. */
  fechar(): void;
  minimizar(minimizado: boolean): void;
  /** Recarrega a árvore visível do processo; lança se não conseguir. Trocável nas provas. */
  recarregarArvore?: () => void;
  chamadas?: Partial<Chamadas>;
}

/**
 * Recarrega a árvore do processo na tela (`#ifrArvore` da página de topo) pelo endereço que ela já tem: nunca se monta
 * URL. Se o `reload` for barrado, regrava o próprio `src`. Lança quando não há árvore na tela.
 */
export function recarregarArvoreDe(doc: Document): void {
  const ifr = doc.querySelector<HTMLIFrameElement>("#ifrArvore");
  if (!ifr) throw new Error("A árvore do processo não está nesta tela.");
  try {
    if (!ifr.contentWindow) throw new Error("árvore sem janela");
    ifr.contentWindow.location.reload();
  } catch (e) {
    const src = ifr.getAttribute("src");
    if (!src) throw e;
    ifr.setAttribute("src", src);
  }
}

const mensagem = (e: unknown): string => (e instanceof Error ? e.message : String(e));
const texto = (v: unknown): string => (typeof v === "string" ? v.trim() : "");
const falha = (e: unknown) =>
  ehErroSei(e) && e.codigo === "SEI_SESSAO_EXPIRADA"
    ? { ok: false as const, erro: mensagem(e), sessao: true as const }
    : { ok: false as const, erro: mensagem(e) };
const recusa = (erro: string) => ({ ok: false as const, erro });

const ERRO_SEM_LISTA = "Esse documento não está na lista de documentos deste processo. Feche o comparador e abra de novo.";

export function tratadoresComparador(d: DepsExecutor): Record<string, Tratador> {
  const c: Chamadas = { ...chamadasPadrao, ...d.chamadas };
  const recarregar = d.recarregarArvore ?? (() => recarregarArvoreDe(document));

  let fixoA: { id: string; titulo: string } | null = null;
  let arvore: Arvore | null = null;
  /** Todos os documentos que podem ser lidos, por id (o A incluído); guarda o `src`, que nunca sai da aba. */
  let lista = new Map<string, Candidato>();

  const garantirArvore = async (): Promise<Arvore> => {
    arvore ??= await c.abrirArvore(d.sei, d.ctx.linkArvore);
    return arvore;
  };

  return {
    contexto: () => {
      fixoA = d.selecionado();
      return { ok: true, idA: fixoA?.id ?? null, tituloA: fixoA?.titulo ?? "", host: d.ctx.host };
    },

    tema: () => ({ ok: true, temaEscuro: d.ctx.temaEscuro, ...(d.ctx.corTema ? { corTema: d.ctx.corTema } : {}) }),

    candidatos: async () => {
      try {
        arvore = await c.abrirArvore(d.sei, d.ctx.linkArvore);
        const todos = listarCandidatos(arvore, null);
        lista = new Map(todos.map((x) => [x.id, x]));
        return {
          ok: true,
          candidatos: todos.filter((x) => x.id !== fixoA?.id).map(({ id, numero, titulo }) => ({ id, numero, titulo })),
          aLegivel: fixoA ? lista.has(fixoA.id) : false,
        };
      } catch (e) {
        return falha(e);
      }
    },

    conteudo: async (args) => {
      const id = texto((args as { id?: unknown } | null)?.id);
      const cand = lista.get(id);
      if (!cand) return recusa(ERRO_SEM_LISTA);
      try {
        return { ok: true, html: await c.lerHtml(d.sei, cand) };
      } catch (e) {
        return falha(e);
      }
    },

    tipos: async () => {
      try {
        const a = await garantirArvore();
        const tipos = await c.tiposParaCriar(d.sei, a.protocolo);
        return { ok: true, tipos: tipos.filter((t) => t.id !== "-1").map((t) => ({ id: t.id, nome: t.nome })) };
      } catch (e) {
        return falha(e);
      }
    },

    criar: async (args) => {
      const a = (args ?? {}) as Record<string, unknown>;
      const tipoId = texto(a.tipoId);
      const idB = texto(a.idB);
      const html = typeof a.html === "string" ? a.html : "";
      if (!tipoId) return recusa("Escolha o tipo do documento.");
      if (!html.trim()) return recusa("Não há comparação para gravar.");
      if (!lista.has(idB)) return recusa(ERRO_SEM_LISTA);
      try {
        const ar = await garantirArvore();
        const docs = [fixoA?.id, idB].flatMap((id) => ar.documentos.filter((x) => x.id === id));
        const r = await c.criarComparativo(d.sei, {
          processo: ar.protocolo,
          tipoId,
          ...(texto(a.tipoNome) ? { tipoNome: texto(a.tipoNome) } : {}),
          html,
          ...nivelDoComparativo(ar, docs),
        });
        try {
          recarregar();
        } catch (e) {
          console.warn("[SEI Pro] comparador: não recarregou a árvore", e);
        }
        return { ok: true, numero: r.numero };
      } catch (e) {
        return falha(e);
      }
    },

    fechar: () => {
      d.fechar();
      return true;
    },

    minimizar: (args) => {
      d.minimizar(!!(args as { minimizado?: unknown } | null)?.minimizado);
      return true;
    },
  };
}
