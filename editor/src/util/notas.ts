import { escaparHtml } from "./html";

// biome-ignore lint/suspicious/noExplicitAny: o CKEditor 5 do SEI nao tem tipos; so os membros usados abaixo importam
type Qualquer = any;

/**
 * Notas de rodape (porte de `nota-rodape.js`). Marcas: a CHAMADA no texto (`<sup><a href="#footer_REF"><span
 * class="ntRodape_item" data-ntrodape-ref="REF">[N]</span></a></sup>`) e o paragrafo do RODAPE no fim do corpo
 * (`<p class="... ntRodape"><a href="#item_REF"><span class="ntRodape_footer" ...>[N]</span></a> texto</p>`), mais um
 * separador (`ntRodape_tr`). O CK5 descarta `<a name>` mas mantem os spans (classe, `data-*`, `contenteditable`), que
 * sao o que identifica as marcas nos dois editores.
 */
export const CLASSE_ITEM = "ntRodape_item";
export const CLASSE_RODAPE = "ntRodape_footer";
export const SELETOR_NOTAS = ".ntRodape_item, .ntRodape, .ntRodape_tr";
export const SEPARADOR_HTML = '<p class="Tabela_Texto_Alinhado_Esquerda ntRodape_tr">____________________________</p>';

export function htmlDoRodape(ref: string, textoHtml: string): string {
  const r = escaparHtml(ref);
  return `<p class="Tabela_Texto_Alinhado_Esquerda ntRodape"><a name="footer_${r}" href="#item_${r}" class="anchorRefInternaPro"><span class="ntRodape_footer ancoraSei" data-ntrodape-ref="${r}" data-ntrodape="?" contenteditable="false">[?]</span></a> ${textoHtml}</p>`;
}

export function htmlDaChamada(ref: string): string {
  const r = escaparHtml(ref);
  return `<sup><a href="#footer_${r}" name="item_${r}" class="anchorRefInternaPro"><span class="ntRodape_item ancoraSei" data-ntrodape="?" data-ntrodape-ref="${r}" contenteditable="false">[?]</span></a></sup> `;
}

/** Uma marca na ordem do documento: `item` (chamada) ou `footer` (paragrafo do rodape, com o numero que ja tem). */
export interface Entrada {
  tipo: "item" | "footer";
  ref: string;
  numero?: number;
}

export interface PlanoDeNotas {
  /** Numero novo de cada nota que tem chamada no corpo (1, 2, 3... na ordem das chamadas). */
  numeroDe: Map<string, number>;
  /** Refs dos rodapes que ficam, na ordem em que vao para o fim do corpo. */
  ordem: string[];
  /** Rodapes sem chamada (nem no corpo nem em outra secao): saem. */
  orfaos: string[];
}

/**
 * A regra de numeracao e ordem do `reorderNtRodape`: as chamadas numeram 1..N na ordem do documento; cada rodape
 * recebe o numero da sua chamada e os rodapes vao para o fim, em ordem. Rodape cuja chamada esta em OUTRA secao nao e
 * orfao: fica com o numero que ja tinha. Rodape sem chamada em lugar nenhum e orfao.
 */
export function planejarNotas(entradas: Entrada[], outrasRefs: ReadonlySet<string> = new Set()): PlanoDeNotas {
  const numeroDe = new Map<string, number>();
  let n = 0;
  for (const e of entradas) {
    if (e.tipo !== "item") continue;
    n += 1;
    numeroDe.set(e.ref, n);
  }
  const mantidos: Array<{ ref: string; chave: number }> = [];
  const orfaos: string[] = [];
  for (const e of entradas) {
    if (e.tipo !== "footer") continue;
    const nova = numeroDe.get(e.ref);
    if (nova !== undefined) mantidos.push({ ref: e.ref, chave: nova });
    else if (outrasRefs.has(e.ref))
      mantidos.push({ ref: e.ref, chave: Number.isFinite(e.numero) ? (e.numero as number) : Number.MAX_SAFE_INTEGER });
    else orfaos.push(e.ref);
  }
  mantidos.sort((a, b) => a.chave - b.chave);
  return { numeroDe, ordem: mantidos.map((m) => m.ref), orfaos };
}

const refDe = (el: Element) => el.getAttribute("data-ntrodape-ref") ?? "";

/** CK4 (DOM do iframe): renumera e reordena. Chame dentro de `withEdit`. */
export function renumerarNotasCk4(corpo: Element, outrasRefs: ReadonlySet<string> = new Set()): PlanoDeNotas {
  const itens = Array.from(corpo.querySelectorAll(`.${CLASSE_ITEM}[data-ntrodape-ref]`));
  const rodapes = Array.from(corpo.querySelectorAll("p.ntRodape")).filter((p) => p.querySelector(`.${CLASSE_RODAPE}[data-ntrodape-ref]`));
  const numeroAtual = (p: Element) => Number.parseInt(p.querySelector(`.${CLASSE_RODAPE}`)?.getAttribute("data-ntrodape") ?? "", 10);
  // as chamadas e os rodapes entram na ordem do documento (o plano so usa a ordem das chamadas e a dos rodapes)
  const plano = planejarNotas(
    [
      ...itens.map((el): Entrada => ({ tipo: "item", ref: refDe(el) })),
      ...rodapes.map(
        (p): Entrada => ({ tipo: "footer", ref: refDe(p.querySelector(`.${CLASSE_RODAPE}`) as Element), numero: numeroAtual(p) }),
      ),
    ],
    outrasRefs,
  );
  itens.forEach((el, i) => {
    el.setAttribute("data-ntrodape", String(i + 1));
    el.textContent = `[${i + 1}]`;
  });
  const porRef = new Map<string, Element>();
  for (const p of rodapes) {
    const ref = refDe(p.querySelector(`.${CLASSE_RODAPE}`) as Element);
    const nr = plano.numeroDe.get(ref);
    const marca = p.querySelector(`.${CLASSE_RODAPE}`) as Element;
    if (nr !== undefined) {
      marca.setAttribute("data-ntrodape", String(nr));
      marca.textContent = `[${nr}]`;
    }
    p.remove();
    porRef.set(ref, p);
  }
  for (const ref of plano.ordem) {
    const p = porRef.get(ref);
    if (p) corpo.append(p);
  }
  if (!plano.ordem.length) for (const s of corpo.querySelectorAll(".ntRodape_tr")) s.remove();
  return plano;
}

/** CK4: remove chamadas, rodapes e separador. Chame dentro de `withEdit`. */
export function removerNotasCk4(corpo: Element): void {
  for (const el of corpo.querySelectorAll(".ntRodape, .ntRodape_tr")) el.remove();
  for (const el of corpo.querySelectorAll(`.${CLASSE_ITEM}[data-ntrodape-ref]`)) (el.closest("sup") ?? el).remove();
  for (const a of corpo.querySelectorAll('a[href^="#footer_"], a[href^="#item_"]')) a.remove();
}

/* ----------------------------- CK5: pelo model ----------------------------- */

const classesTexto = (t: Qualquer): string[] => t.getAttribute?.("htmlSpan")?.classes ?? [];
const classesBloco = (b: Qualquer): string[] => b.getAttribute?.("htmlPAttributes")?.classes ?? [];

interface Marcas {
  itens: Qualquer[];
  /** Todos os textos numerados (chamadas e spans de numero dos rodapes), na ordem do documento. */
  textos: Array<{ no: Qualquer; tipo: "item" | "rodape" }>;
  /** Paragrafos do rodape (filhos diretos da raiz). */
  rodapes: Array<{ bloco: Qualquer; ref: string; numero: number }>;
  separadores: Qualquer[];
}

function coletarMarcas(w: Qualquer, raiz: Qualquer): Marcas {
  const m: Marcas = { itens: [], textos: [], rodapes: [], separadores: [] };
  for (const it of w.createRangeIn(raiz).getItems()) {
    if (it.is("$textProxy") || it.is("$text")) {
      const cls = classesTexto(it);
      if (cls.includes(CLASSE_ITEM)) {
        m.itens.push(it);
        m.textos.push({ no: it, tipo: "item" });
      } else if (cls.includes(CLASSE_RODAPE)) m.textos.push({ no: it, tipo: "rodape" });
    } else if (it.is("element") && it.parent === raiz) {
      const cls = classesBloco(it);
      if (cls.includes("ntRodape_tr")) m.separadores.push(it);
      else if (cls.includes("ntRodape")) {
        const span = Array.from(w.createRangeIn(it).getItems()).find(
          (x: Qualquer) => (x.is("$textProxy") || x.is("$text")) && classesTexto(x).includes(CLASSE_RODAPE),
        ) as Qualquer;
        const attrs = span?.getAttribute("htmlSpan")?.attributes ?? {};
        if (attrs["data-ntrodape-ref"])
          m.rodapes.push({ bloco: it, ref: attrs["data-ntrodape-ref"], numero: Number.parseInt(attrs["data-ntrodape"], 10) });
      }
    }
  }
  return m;
}

/** Troca o texto `[N]` de um span (de tras para a frente, chamado em ordem inversa) mantendo todos os atributos do model. */
function trocarNumero(w: Qualquer, no: Qualquer, numero: number): void {
  const atual = no.getAttribute("htmlSpan") ?? {};
  const texto = `[${numero}]`;
  if (no.data === texto && atual.attributes?.["data-ntrodape"] === String(numero)) return;
  const atributos = Object.fromEntries(no.getAttributes());
  atributos.htmlSpan = { ...atual, attributes: { ...atual.attributes, "data-ntrodape": String(numero) } };
  const intervalo = w.createRangeOn(no);
  const inicio = intervalo.start;
  w.remove(intervalo);
  w.insertText(texto, atributos, inicio);
}

/**
 * CK5: renumera as chamadas, renumera e reordena os rodapes (movidos para o fim da raiz), tira os orfaos.
 * Roda no model, dentro de um `model.change` do chamador, entao entra no MESMO passo de desfazer.
 */
export function renumerarNotasCk5(ed: Qualquer, raiz: Qualquer, outrasRefs: ReadonlySet<string> = new Set()): PlanoDeNotas {
  let plano: PlanoDeNotas = { numeroDe: new Map(), ordem: [], orfaos: [] };
  ed.model.change((w: Qualquer) => {
    const marcas = coletarMarcas(w, raiz);
    const refDeItem = (t: Qualquer) => t.getAttribute("htmlSpan")?.attributes?.["data-ntrodape-ref"] ?? "";
    plano = planejarNotas(
      [
        ...marcas.itens.map((t): Entrada => ({ tipo: "item", ref: refDeItem(t) })),
        ...marcas.rodapes.map((r): Entrada => ({ tipo: "footer", ref: r.ref, numero: r.numero })),
      ],
      outrasRefs,
    );
    // numeros novos, de tras para a frente: um texto trocado nao desloca os que vem antes
    const trocas: Array<{ no: Qualquer; n: number }> = [];
    let proximo = 0;
    for (const t of marcas.textos) {
      if (t.tipo === "item") {
        proximo += 1;
        trocas.push({ no: t.no, n: proximo });
      } else {
        const n = plano.numeroDe.get(refDeItem(t.no));
        if (n !== undefined) trocas.push({ no: t.no, n });
      }
    }
    for (const t of [...trocas].reverse()) trocarNumero(w, t.no, t.n);

    for (const o of plano.orfaos) {
      const r = marcas.rodapes.find((x) => x.ref === o);
      if (r) w.remove(w.createRangeOn(r.bloco));
    }
    for (const ref of plano.ordem) {
      const r = marcas.rodapes.find((x) => x.ref === ref);
      if (r) w.move(w.createRangeOn(r.bloco), w.createPositionAt(raiz, "end"));
    }
    if (!plano.ordem.length) for (const s of marcas.separadores) w.remove(w.createRangeOn(s));
  });
  return plano;
}

/** CK5: remove chamadas, rodapes e separador pelo model (um passo de desfazer, dentro do `model.change` do chamador). */
export function removerNotasCk5(ed: Qualquer, raiz: Qualquer): void {
  ed.model.change((w: Qualquer) => {
    const marcas = coletarMarcas(w, raiz);
    const alvos = [...marcas.itens, ...marcas.rodapes.map((r) => r.bloco), ...marcas.separadores];
    for (const a of [...alvos].reverse()) w.remove(w.createRangeOn(a));
  });
}

/** CK5: a raiz do model que e o "Corpo do Texto" (a que tem o mesmo elemento DOM que `getBodyContainer`), ou null. */
export function raizDoCorpoCk5(ed: Qualquer, corpo: Element | null): Qualquer {
  if (!ed?.model || !ed.editing || !corpo) return null;
  for (const r of Array.from(ed.model.document.roots ?? []) as Qualquer[]) {
    if (!r || r.rootName === "$graveyard") continue;
    try {
      const visao = ed.editing.view.document.getRoot(r.rootName);
      if (visao && ed.editing.view.domConverter.mapViewToDom(visao) === corpo) return r;
    } catch {
      /* proxima raiz */
    }
  }
  return null;
}

/** Refs das chamadas que estao em OUTRAS secoes do documento (CK5 multi-root): o rodape delas nao e orfao. */
export function refsDeOutrasSecoes(ed: Qualquer, raizCorpo: Qualquer, extrair: (html: string) => string[]): Set<string> {
  const refs = new Set<string>();
  for (const r of Array.from(ed.model.document.roots ?? []) as Qualquer[]) {
    if (!r || r === raizCorpo || r.rootName === "$graveyard") continue;
    for (const ref of extrair(ed.data.get({ rootName: r.rootName }))) refs.add(ref);
  }
  return refs;
}
