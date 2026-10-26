/**
 * O filtro da árvore no DOM: esconde as linhas dos documentos (e das pastas sem nenhum documento à vista) e mais nada.
 *
 * A árvore do SEI é plana: cada nó é uma sequência de irmãos (ligações, ícone, nome, informações que outros módulos
 * põem, e por fim um `<span><br></span>`), e os filhos de uma pasta ficam num `<div>` à parte. Esconder um nó é pôr um
 * atributo próprio em cada irmão da linha; o CSS do módulo faz o resto. Nenhum nó sai do lugar, nenhuma classe, id,
 * `href` ou ouvinte do SEI (ou dos outros módulos) é tocado, e tirar o atributo devolve a árvore como estava.
 */
import type { DocumentoArvore } from "@nucleo/dominio/arvore";
import { idDoNo } from "../menuDoc/documentos";
import { estadoDaPasta } from "../pastas/fila";
import { aplicarFiltro, type FiltroArvore, filtroAtivo, type OpcoesFiltro } from "./filtro";

export const ATR_OCULTO = "data-spro-f-oculto";

/** O `<span><br></span>` que o SEI põe no fim de cada linha. */
function fimDeLinha(el: Element): boolean {
  return el.tagName === "SPAN" && !el.className && el.childElementCount === 1 && el.firstElementChild?.tagName === "BR";
}

/** Os irmãos que formam a linha de um nó: do fim da linha anterior até o seu próprio `<br>` (sem o `<div>` dos filhos). */
export function linhaDe(ancora: Element): Element[] {
  const linha: Element[] = [ancora];
  for (let p = ancora.previousElementSibling; p && p.tagName !== "DIV" && !fimDeLinha(p); p = p.previousElementSibling) linha.unshift(p);
  for (let n = ancora.nextElementSibling; n && n.tagName !== "DIV"; n = n.nextElementSibling) {
    linha.push(n);
    if (fimDeLinha(n)) break;
  }
  return linha;
}

function numeroDoRotulo(rotulo: string): { titulo: string; numero: string } {
  const m = /^(.*?)\s*\((\d{5,})\)\s*$/.exec(rotulo);
  return m ? { titulo: m[1] as string, numero: m[2] as string } : { titulo: rotulo, numero: "" };
}

/**
 * Um documento que a árvore tem na tela mas o modelo não conhece (a leitura do `#ifrPasta` falhou ou ainda não
 * aconteceu): classifica pelo que o DOM mostra, igual ao núcleo (ícone, assinatura, unidade geradora). Só para o que é
 * claramente documento; qualquer outro nó (processo anexado, por exemplo) devolve null e fica como está.
 */
export function lerDocumentoDoDom(doc: Document, id: string): DocumentoArvore | null {
  const nome = doc.getElementById(`anchor${id}`);
  if (!nome) return null;
  const icone =
    doc.getElementById(`icon${id}`)?.getAttribute("src") ??
    doc.getElementById(`anchorImg${id}`)?.querySelector("img")?.getAttribute("src") ??
    "";
  if (!/documento_|formulario|download_anexo/.test(icone)) return null;
  const { titulo, numero } = numeroDoRotulo(
    (doc.getElementById(`span${id}`)?.textContent ?? nome.textContent ?? "").replace(/\s+/g, " ").trim(),
  );
  const formato = (/documento_([a-z0-9]+)\.svg/.exec(icone)?.[1] ?? "interno").replace("cancelado", "interno");
  const geradora = doc.getElementById(`anchorUG${id}`)?.textContent?.trim();
  return {
    id,
    numero,
    titulo,
    pasta: pastaDoNo(nome),
    externo: !/documento_interno|documento_cancelado|formulario|email/.test(icone),
    formato,
    nivel: "publico",
    assinado: !!doc.getElementById(`anchorA${id}`),
    assinaturas: [],
    cancelado: /documento_cancelado/.test(icone),
    unidadeGeradora: geradora || undefined,
    link: "",
    src: "",
    acoes: [],
    botoes: [],
  };
}

/** A pasta em cujo `<div>` o nó está (`PASTA1`), ou null quando fica direto sob o processo. */
function pastaDoNo(no: Element): string | null {
  const div = no.closest('div[id^="divPASTA"]');
  return div ? div.id.slice(3) : null;
}

export interface ResumoDoFiltro {
  /** Documentos à vista / documentos conhecidos na tela. */
  visiveis: number;
  total: number;
  /** Pastas cujos documentos ainda não vieram (o SEI só os traz quando a pasta é aberta; a fila de pastas as abre). */
  pastasFechadas: number;
  pastas: number;
}

interface Entrada {
  id: string;
  ancora: HTMLElement;
  doc: DocumentoArvore;
}

/**
 * Aplica o filtro na árvore da tela. Idempotente e barato de repetir (só mexe nos atributos que mudaram).
 * `conhecidos` são os documentos que o quadro já leu (árvore e pastas abertas).
 */
export function aplicarNoDom(
  doc: Document,
  conhecidos: readonly DocumentoArvore[],
  idProcedimento: string,
  filtro: FiltroArvore,
  opcoes?: OpcoesFiltro,
): ResumoDoFiltro {
  const raiz = doc.getElementById("divArvore");
  const resumo: ResumoDoFiltro = { visiveis: 0, total: 0, pastasFechadas: 0, pastas: 0 };
  if (!raiz) return resumo;

  const porId = new Map(conhecidos.map((d) => [d.id, d]));
  const entradas: Entrada[] = [];
  const pastasComDados = new Set<string>();
  for (const a of raiz.querySelectorAll<HTMLElement>('a[id^="anchor"]')) {
    const id = idDoNo(a.id, "anchor");
    if (!id || id === idProcedimento) continue;
    const d = porId.get(id) ?? lerDocumentoDoDom(doc, id);
    if (!d) continue;
    // A pasta que vale é a da TELA: o modelo e o DOM concordam, e para o que só o DOM conhece não há outra.
    const pasta = pastaDoNo(a);
    entradas.push({ id, ancora: a, doc: pasta === d.pasta ? d : { ...d, pasta } });
    if (pasta) pastasComDados.add(pasta);
  }

  const documentos = entradas.map((e) => e.doc);
  const ativo = filtroAtivo(filtro);
  const visiveis = aplicarFiltro({ documentos }, filtro, opcoes);

  const esconder = new Set<Element>();
  if (ativo) {
    for (const e of entradas) if (!visiveis.has(e.id)) for (const el of linhaDe(e.ancora)) esconder.add(el);
  }
  for (const a of raiz.querySelectorAll<HTMLElement>('a[id^="anchorPASTA"]')) {
    if (!/^anchorPASTA\d+$/.test(a.id)) continue;
    const pasta = a.id.slice("anchor".length);
    resumo.pastas += 1;
    // Carregada e vazia ("Nenhum protocolo encontrado") não tem nada que case: conta como com dados e some com o filtro.
    if (!pastasComDados.has(pasta) && estadoDaPasta(doc, pasta) !== "carregada") {
      resumo.pastasFechadas += 1; // sem documentos conhecidos: fica à vista (não dá para dizer que não tem nada que case)
      continue;
    }
    if (ativo && !visiveis.has(pasta)) {
      for (const el of linhaDe(a)) esconder.add(el);
      const filhos = doc.getElementById(`div${pasta}`);
      if (filhos) esconder.add(filhos);
    }
  }

  for (const el of Array.from(raiz.querySelectorAll(`[${ATR_OCULTO}]`))) if (!esconder.has(el)) el.removeAttribute(ATR_OCULTO);
  for (const el of esconder) if (!el.hasAttribute(ATR_OCULTO)) el.setAttribute(ATR_OCULTO, "1");

  resumo.total = documentos.length;
  resumo.visiveis = documentos.filter((d) => visiveis.has(d.id)).length;
  return resumo;
}

/** Tira o filtro: nenhum nó escondido. */
export function limparDoDom(doc: Document): void {
  for (const el of Array.from(doc.querySelectorAll(`[${ATR_OCULTO}]`))) el.removeAttribute(ATR_OCULTO);
}
