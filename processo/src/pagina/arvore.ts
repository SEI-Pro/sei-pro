/**
 * Espera a árvore do quadro e monta os painéis nela. Cada painel é independente: tem a sua casca, observa só as
 * suas fatias da loja e redesenha só o seu corpo. Nada de “apagar tudo e recriar”. Se algo tirar os painéis da
 * página (a árvore se refaz), a montagem se refaz sozinha, sem duplicar.
 */

import { h } from "@comum/ui/dom";
import { FATIAS_DO_PAINEL, OCULTOS_NO_SIGILOSO, ORDEM_FINAL, type TipoPainel } from "../modelo/paineis";
import type { NomeFatia } from "../modelo/tipos";
import { type Casca, criarCasca } from "../ui/painel";
import type { ContextoProcesso } from "./contexto";
import { aoMudarTema, garantirEstilo, temaEscuro } from "./estilo";
import { gravarAberto, painelAberto } from "./opcoes";
import { type DefPainel, PAINEIS } from "./paineis/indice";

export { aguardarArvore, PRAZO_ARVORE_MS, tentarLerArvore } from "./leituraArvore";

export interface Montagem {
  /** Raiz dos painéis do fim da árvore. */
  raiz: HTMLElement;
  /** Redesenha um painel (ou todos). */
  redesenhar(tipo?: TipoPainel): void;
  desmontar(): void;
}

const ATR_RAIZ = "data-spro-processo-raiz";

function limparAnteriores(doc: Document): void {
  for (const el of doc.querySelectorAll(`[${ATR_RAIZ}], [data-spro-slot="atividades"]`)) el.remove();
}

function visiveis(ctx: ContextoProcesso): DefPainel[] {
  return PAINEIS.filter((p) => ctx.habilitados.has(p.tipo) && !(ctx.sigiloso && OCULTOS_NO_SIGILOSO.has(p.tipo)));
}

/** Fatias que valem a pena carregar: as dos painéis que aparecem (o sigiloso não consulta especificação nem interessados). */
export function fatiasNecessarias(ctx: ContextoProcesso): NomeFatia[] {
  const nomes = new Set<NomeFatia>();
  for (const p of visiveis(ctx)) for (const n of FATIAS_DO_PAINEL[p.tipo]) nomes.add(n);
  if (ctx.sigiloso) nomes.delete("dadosProcesso");
  return [...nomes];
}

export function montarPaineis(ctx: ContextoProcesso): Montagem {
  const doc = ctx.doc;
  garantirEstilo(doc);
  limparAnteriores(doc);
  const frm = doc.getElementById("frmArvore") ?? doc.body;
  const escuro = temaEscuro(doc);
  const nova = (extra = "") =>
    h("div", { class: `spro-p-raiz ${extra}`.trim(), [ATR_RAIZ]: "1", ...(escuro ? { "data-tema": "escuro" } : {}) });
  const raiz = nova();
  const raizAnotacoes = nova("anotacoes");
  const slot = h("div", { "data-spro-slot": "atividades", class: "spro-p-slot" });

  // Posições do legado: Anotações logo depois do “Consultar Andamento”; o espaço das Atividades antes dos
  // Processos Relacionados; os demais no fim do formulário da árvore.
  const andamento = doc.getElementById("divConsultarAndamento");
  if (andamento) andamento.after(raizAnotacoes);
  else frm.prepend(raizAnotacoes);
  const relacionados = doc.getElementById("divRelacionados");
  if (relacionados) relacionados.before(slot);
  else raizAnotacoes.after(slot);
  frm.append(raiz);

  const cascas = new Map<TipoPainel, { def: DefPainel; casca: Casca }>();
  const lista = visiveis(ctx);
  const ordem = (t: TipoPainel) => ORDEM_FINAL.indexOf(t);
  for (const def of lista) {
    const casca = criarCasca({
      tipo: def.tipo,
      titulo: def.titulo,
      icone: def.icone,
      aberto: painelAberto(ctx.armazenamento, def.tipo),
      aoAlternar: (aberto) => gravarAberto(ctx.armazenamento, def.tipo, aberto),
    });
    cascas.set(def.tipo, { def, casca });
  }
  for (const t of [...ORDEM_FINAL].sort((a, b) => ordem(a) - ordem(b))) {
    const c = cascas.get(t);
    if (c) raiz.append(c.casca.el);
  }
  const anot = cascas.get("anotacoes");
  if (anot) raizAnotacoes.append(anot.casca.el);

  const desenhar = (tipo: TipoPainel) => {
    const c = cascas.get(tipo);
    if (!c) return;
    let r: ReturnType<DefPainel["desenhar"]>;
    try {
      r = c.def.desenhar(ctx);
    } catch (e) {
      console.warn(`[SEI Pro] painel ${tipo}:`, e);
      r = null;
    }
    c.casca.el.hidden = r === null;
    if (r) c.casca.atualizar(r.estado, r.desenho);
  };
  const redesenhar = (tipo?: TipoPainel) => {
    if (tipo) desenhar(tipo);
    else for (const t of cascas.keys()) desenhar(t);
  };

  // Só o painel afetado muda: a fatia avisa, e cada painel olha as suas.
  const parar = ctx.loja.aoMudar((n) => {
    for (const [tipo, c] of cascas) if (FATIAS_DO_PAINEL[c.def.tipo].includes(n)) desenhar(tipo);
  });
  redesenhar();

  const sairTema = aoMudarTema(doc, () => {
    const e = temaEscuro(doc);
    for (const el of [raiz, raizAnotacoes]) {
      if (e) el.setAttribute("data-tema", "escuro");
      else el.removeAttribute("data-tema");
    }
  });

  return {
    raiz,
    redesenhar,
    desmontar() {
      parar();
      sairTema();
      raiz.remove();
      raizAnotacoes.remove();
      slot.remove();
    },
  };
}

/**
 * Mantém os painéis na página: se a árvore se refizer e levar a montagem embora, monta de novo (uma vez só,
 * mesmo que várias mudanças cheguem juntas). Devolve o desligador.
 */
export function manterMontagem(
  ctx: ContextoProcesso,
  aoRemontar?: (m: Montagem) => void,
  deps: { Observador?: typeof MutationObserver } = {},
): { atual(): Montagem; parar(): void } {
  let m = montarPaineis(ctx);
  let agendado = false;
  const janela = ctx.doc.defaultView;
  const Observador =
    deps.Observador ??
    (janela as unknown as { MutationObserver?: typeof MutationObserver } | null)?.MutationObserver ??
    globalThis.MutationObserver;
  const verificar = () => {
    agendado = false;
    if (m.raiz.isConnected) return;
    m.desmontar();
    m = montarPaineis(ctx);
    aoRemontar?.(m);
  };
  const obs =
    typeof Observador === "function" && ctx.doc.body
      ? new Observador(() => {
          if (agendado || m.raiz.isConnected) return;
          agendado = true;
          setTimeout(verificar, 30);
        })
      : null;
  obs?.observe(ctx.doc.body, { childList: true, subtree: true });
  return {
    atual: () => m,
    parar() {
      obs?.disconnect();
      m.desmontar();
    },
  };
}
