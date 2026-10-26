/**
 * O que a árvore tem na tela, pasta por pasta, para a capa contar documentos.
 *
 * O `lerArvore` do núcleo lê os `Nos[n]` do HTML da página, que só trazem os documentos da pasta aberta de fábrica (a
 * última). Os das pastas que o usuário (ou a fila) abre depois vêm do `#ifrPasta` e só existem no DOM. Por isso a capa lê
 * os dois: os documentos do núcleo e os nós que o DOM mostra, e junta por id. Sem requisição.
 *
 * Em teste (e em páginas estáticas) o DOM não tem as âncoras `anchorPASTAn`: aí vale só o HTML (`Nos[n]`).
 */
import type { Arvore, DocumentoArvore } from "@nucleo/dominio/arvore";
import { lerDocumentoDoDom } from "../pagina/filtro/dom";
import { estadoDaPasta } from "../pagina/pastas/fila";

export interface PastaTela {
  id: string;
  /** Carregada: o SEI já trouxe os documentos (ou disse que está vazia). Aberta ou fechada na tela, tanto faz. */
  carregada: boolean;
  /** Protocolos que ela mostra agora (documentos, movidos, processos anexados...). Zero enquanto não carregou. */
  nos: number;
  /** Fora de qualquer outra pasta (as numeradas I, II... são páginas do processo; só as de cima valem como "última"). */
  topo: boolean;
}

export interface LeituraDaTela {
  documentos: DocumentoArvore[];
  pastas: PastaTela[];
  /** De onde saiu: o DOM (a árvore viva) ou só o HTML dos nós (página estática). */
  fonte: "dom" | "html";
}

const NO_PROTOCOLO = /^anchor(\d+(?:-\d+)?)$/;

function nivelDoDom(doc: Document, id: string): DocumentoArvore["nivel"] {
  const src = doc.getElementById(`iconNA${id}`)?.getAttribute("src") ?? "";
  if (/sigiloso/.test(src)) return "sigiloso";
  if (/restrito/.test(src)) return "restrito";
  return "publico";
}

function pastaDe(no: Element): string | null {
  const div = no.closest('div[id^="divPASTA"]');
  return div ? div.id.slice(3) : null;
}

function lerDoHtml(arv: Arvore): LeituraDaTela {
  let html = "";
  try {
    html = arv.pagina.html;
  } catch {
    html = "";
  }
  const nos = [...html.matchAll(/infraArvoreNo\("PASTA","(PASTA\d+)","([^"]*)"/g)].map((m) => ({
    id: m[1] as string,
    pai: m[2] as string,
  }));
  const comDocumento = new Map<string, number>();
  for (const d of arv.documentos) if (d.pasta) comDocumento.set(d.pasta, (comDocumento.get(d.pasta) ?? 0) + 1);
  return {
    documentos: [...arv.documentos],
    fonte: "html",
    pastas: nos.map((p) => ({
      id: p.id,
      carregada: comDocumento.has(p.id),
      nos: comDocumento.get(p.id) ?? 0,
      topo: !p.pai.startsWith("PASTA"),
    })),
  };
}

/** Lê a árvore da tela: os documentos de todas as pastas carregadas e o estado de cada pasta. */
export function lerDaTela(doc: Document | null, arv: Arvore): LeituraDaTela {
  const ancoras = doc ? [...doc.querySelectorAll<HTMLElement>('a[id^="anchorPASTA"]')].filter((a) => /^anchorPASTA\d+$/.test(a.id)) : [];
  if (!doc || !ancoras.length) return lerDoHtml(arv);

  const protocolos = [...doc.querySelectorAll<HTMLElement>("#divArvore a.infraArvoreNo")].filter((a) => {
    const m = NO_PROTOCOLO.exec(a.id);
    return !!m && m[1] !== arv.idProcedimento;
  });
  const porPasta = new Map<string, number>();
  for (const a of protocolos) {
    const p = pastaDe(a);
    if (p) porPasta.set(p, (porPasta.get(p) ?? 0) + 1);
  }

  const conhecidos = new Map(arv.documentos.map((d) => [d.id, d]));
  const documentos = new Map<string, DocumentoArvore>();
  for (const a of protocolos) {
    const id = (NO_PROTOCOLO.exec(a.id) as RegExpExecArray)[1] as string;
    const pasta = pastaDe(a);
    const base = conhecidos.get(id);
    if (base) {
      documentos.set(id, base.pasta === pasta ? base : { ...base, pasta });
      continue;
    }
    const lido = lerDocumentoDoDom(doc, id);
    if (lido) documentos.set(id, { ...lido, pasta, nivel: nivelDoDom(doc, id) });
  }
  // Documentos que os nós conhecem e o DOM ainda não desenhou (a árvore está sendo montada): entram como estão.
  for (const d of arv.documentos) if (!documentos.has(d.id)) documentos.set(d.id, d);

  const pastas: PastaTela[] = ancoras.map((a) => {
    const id = a.id.slice("anchor".length);
    const carregada = estadoDaPasta(doc, id) === "carregada";
    return { id, carregada, nos: carregada ? (porPasta.get(id) ?? 0) : 0, topo: !a.closest('div[id^="divPASTA"]') };
  });
  return { documentos: [...documentos.values()], pastas, fonte: "dom" };
}
