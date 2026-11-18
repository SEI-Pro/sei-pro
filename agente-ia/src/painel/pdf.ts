/**
 * Texto de PDF, no painel (página da extensão).
 *
 * Reaproveita o carregador do pdf.js das Ferramentas de PDF — mesmo worker
 * empacotado em `vendor/ferramentas-pdf/pdfjs/`, mesmas travas de segurança
 * (sem scripting e sem `eval` do documento). O pdf.js entra em chunk separado,
 * carregado só quando o agente lê o primeiro PDF.
 *
 * PDF digitalizado passa pelo OCR das Ferramentas de PDF (ver `extrairTextoPdf`
 * e, para o anexo do chat, `lerPdfParaAnexo`).
 */

import { MAX_PAGINAS_OCR, montarTexto, planejarLeitura, temCamadaDeTexto, type PaginaLida, type PlanoLeitura } from "./anexo";
import { caixasDasImagens, textoDoDocumentoComFiguras, type LinhaLida, type PaginaComFiguras } from "./figuras";

const LIMITE_PAGINAS = 200;
/**
 * Páginas que o agente manda ao OCR. Cada uma custa segundos de CPU no painel,
 * que trava enquanto reconhece; o usuário não pediu o OCR, ele só pediu para
 * ler o documento. Precisando do resto, existem as Ferramentas de PDF.
 */
const PAGINAS_OCR = 5;
const SEM_TEXTO = "[PDF sem camada de texto (digitalizado).]";

/**
 * Até onde a leitura procura figuras. A lista de operações processa a página
 * inteira (e o worker carrega as imagens): num documento de 200 páginas, num
 * pedido de 20 documentos, sem teto a leitura ficaria lenta.
 */
export const ORCAMENTO_FIGURAS = { maxPaginas: 60, maxMs: 5000 };

/** Devolve, página a página, se ainda cabe procurar figuras. O relógio começa na primeira pergunta. */
export function orcamentoDeFiguras(o: { maxPaginas: number; maxMs: number }, agora: () => number = Date.now): (n: number) => boolean {
  let inicio: number | null = null;
  return (n) => {
    inicio ??= agora();
    return n <= o.maxPaginas && agora() - inicio <= o.maxMs;
  };
}

/** O que o agente usa de uma página do pdf.js. */
export interface PaginaPdf {
  view?: number[];
  getTextContent(): Promise<{ items: unknown[] }>;
  getOperatorList?(): Promise<{ fnArray: number[]; argsArray: unknown[][] }>;
}

interface DocPdf {
  numPages: number;
  getPage(n: number): Promise<PaginaPdf>;
}

/** Abre o PDF no pdf.js e entrega o documento (e os códigos de operação) a `corpo`, destruindo a tarefa no fim. */
export async function comPdf<T>(bytes: Uint8Array, corpo: (doc: DocPdf, OPS: Record<string, number>) => Promise<T>): Promise<T> {
  const { carregarPdfJs, opcoesDocumento } = await import("@/lib/ferramentas/pdfjs");
  const pdfjs = await carregarPdfJs();
  // Cópia: o pdf.js TRANSFERE o buffer para o worker, e o original ficaria
  // "destacado" (inutilizável) para o OCR que pode vir depois.
  const tarefa = pdfjs.getDocument(opcoesDocumento(bytes.slice()));
  const doc = (await tarefa.promise) as unknown as DocPdf;
  try {
    return await corpo(doc, pdfjs.OPS as unknown as Record<string, number>);
  } finally {
    await tarefa.destroy();
  }
}

/** Mesmo `name` da `OperacaoCancelada` das Ferramentas de PDF: `mensagemDeErroPdf` reconhece as duas. */
class LeituraCancelada extends Error {
  constructor() {
    super("Operação cancelada");
    this.name = "OperacaoCancelada";
  }
}

/**
 * Uma página: a camada de texto, linha a linha com a altura de cada uma, e —
 * com `OPS` — as caixas das imagens. Se a lista de operações falhar (fonte
 * faltando, PDF torto), o texto vale igual e a página fica sem caixas.
 */
export async function lerPagina(pagina: PaginaPdf, n: number, OPS: Record<string, number> | null): Promise<PaginaComFiguras> {
  const conteudo = await pagina.getTextContent();
  const linhas: LinhaLida[] = [];
  let linha = "";
  let y: number | null = null;
  const fechar = () => {
    const texto = linha.replace(/[ \t]+/g, " ").trim();
    if (texto) linhas.push({ texto, y: y ?? 0 });
    linha = "";
    y = null;
  };
  for (const item of conteudo.items as Array<{ str?: string; hasEOL?: boolean; transform?: number[] }>) {
    if (y === null && item.str?.trim() && Array.isArray(item.transform)) y = item.transform[5];
    linha += item.str ?? "";
    if (item.hasEOL) fechar();
  }
  fechar();
  const [x0 = 0, y0 = 0, x1 = 0, y1 = 0] = pagina.view ?? [];
  let caixas: PaginaComFiguras["caixas"];
  if (OPS && pagina.getOperatorList) {
    try {
      const ops = await pagina.getOperatorList();
      caixas = caixasDasImagens(ops.fnArray, ops.argsArray, OPS).map((c) => ({ ...c, x: c.x - x0, y: c.y - y0 }));
    } catch {
      caixas = undefined;
    }
  }
  return {
    n,
    texto: linhas.map((l) => l.texto).join("\n"),
    linhas: linhas.map((l) => ({ ...l, y: l.y - y0 })),
    camada: temCamadaDeTexto(conteudo.items as Array<{ str?: unknown }>),
    largura: x1 - x0,
    altura: y1 - y0,
    ...(caixas ? { caixas } : {}),
  };
}

/** Camada de texto das páginas `1..ate` (sem OCR); página digitalizada vem com texto vazio. */
async function paginasDeTexto(doc: DocPdf, ate: number, aoLer?: (n: number) => void, cancelado?: () => boolean): Promise<Array<PaginaLida & { camada: boolean }>> {
  const paginas: Array<PaginaLida & { camada: boolean }> = [];
  for (let n = 1; n <= ate; n += 1) {
    if (cancelado?.()) throw new LeituraCancelada();
    const { texto, camada } = await lerPagina(await doc.getPage(n), n, null);
    paginas.push({ n, texto, camada });
    aoLer?.(n);
  }
  return paginas;
}

/**
 * As páginas do PDF para o agente: texto e, dentro do orçamento, as caixas das
 * imagens. `orcamento: null` procura em todas — é o que o recorte usa, para
 * achar a figura que a leitura marcou.
 */
export async function paginasVistasDoPdf(bytes: Uint8Array, orcamento: { maxPaginas: number; maxMs: number } | null = ORCAMENTO_FIGURAS): Promise<{ paginas: PaginaComFiguras[]; total: number; naoProcuradasDe?: number }> {
  return comPdf(bytes, async (doc, OPS) => {
    const ate = Math.min(doc.numPages, LIMITE_PAGINAS);
    const procura = orcamento ? orcamentoDeFiguras(orcamento) : () => true;
    const paginas: PaginaComFiguras[] = [];
    let naoProcuradasDe: number | undefined;
    for (let n = 1; n <= ate; n += 1) {
      const sim = procura(n);
      if (!sim) naoProcuradasDe ??= n;
      paginas.push(await lerPagina(await doc.getPage(n), n, sim ? OPS : null));
    }
    return { paginas, total: doc.numPages, ...(naoProcuradasDe ? { naoProcuradasDe } : {}) };
  });
}

/**
 * Texto de um PDF, com as figuras marcadas (ver `figuras.ts`). Sem camada de
 * texto (digitalizado), roda o OCR das Ferramentas de PDF — que devolve um PDF
 * pesquisável — e lê o texto dele. Reaproveita o Tesseract já empacotado
 * (`vendor/ferramentas-pdf/tesseract/`), com o modelo de português, sem nada
 * novo no pacote.
 */
export async function extrairTextoPdf(base64: string, o: { ocr?: boolean } = {}): Promise<string> {
  const bruto = atob(base64);
  const bytes = new Uint8Array(bruto.length);
  for (let i = 0; i < bruto.length; i += 1) bytes[i] = bruto.charCodeAt(i);
  const { paginas, total, naoProcuradasDe } = await paginasVistasDoPdf(bytes);
  if (paginas.some((p) => p.texto)) return textoDoDocumentoComFiguras(paginas, { total, naoProcuradasDe });
  if (o.ocr === false) return SEM_TEXTO;
  const { ocrPdf, ocrDisponivel } = await import("@/lib/ferramentas/ocr");
  if (!ocrDisponivel()) return `${SEM_TEXTO} Este navegador não suporta o OCR local.`;
  const r = await ocrPdf({ id: "agente", nome: "documento.pdf", tamanho: bytes.length, bytes }, { paginas: PAGINAS_OCR });
  if (r.semTexto) return `${SEM_TEXTO} O OCR não reconheceu texto.`;
  const resto = r.totalPaginas > r.paginasProcessadas ? ` de ${r.totalPaginas}; as demais não foram lidas` : "";
  // O texto vem do PDF pesquisável que o OCR devolve; as caixas, do original.
  const lidas = await comPdf(r.bytes, async (doc) => {
    const saida: PaginaComFiguras[] = [];
    for (let n = 1; n <= Math.min(doc.numPages, paginas.length); n += 1) saida.push(await lerPagina(await doc.getPage(n), n, null));
    return saida;
  });
  const combinadas = paginas.map((p) => {
    const l = lidas[p.n - 1];
    return l?.texto ? { ...p, texto: l.texto, linhas: l.linhas, ocrLeu: true } : p;
  });
  return `[texto obtido por OCR de ${r.paginasProcessadas} página(s)${resto}; pode conter erros de reconhecimento]\n\n${textoDoDocumentoComFiguras(combinadas, { total, naoProcuradasDe })}`;
}

// ------------------------------------------------------------ anexo do chat

export interface EtapaLeitura {
  fase: "abrindo" | "texto" | "ocr";
  feitas: number;
  total: number;
}

export interface OpcoesAnexoPdf {
  aoProgredir?: (e: EtapaLeitura) => void;
  cancelado?: () => boolean;
  /** Chamado com o plano antes do OCR quando ele vai pesar; devolver false cancela. */
  confirmarOcr?: (p: PlanoLeitura) => Promise<boolean>;
}

export interface PdfLido {
  texto: string;
  paginas: number;
  /** Páginas que ficaram sem leitura, e por quê (para o chip). */
  naoLidas: number[];
  motivoNaoLidas?: string;
}

/**
 * Texto de um PDF anexado ao chat. Diferente da leitura de documento do SEI
 * (`extrairTextoPdf`), aqui a pessoa escolheu o arquivo: o OCR roda em todas
 * as páginas digitalizadas (até o teto da biblioteca), com aviso antes quando
 * forem mais de 20, e só nelas — num PDF misto, as páginas com texto não
 * passam pelo OCR. Cancelar descarta tudo.
 */
export async function lerPdfParaAnexo(bytes: Uint8Array, o: OpcoesAnexoPdf = {}): Promise<PdfLido> {
  o.aoProgredir?.({ fase: "abrindo", feitas: 0, total: 0 });
  const { total, lidas } = await comPdf(bytes, async (doc) => {
    const ate = Math.min(doc.numPages, LIMITE_PAGINAS);
    const lidas = await paginasDeTexto(doc, ate, (n) => o.aoProgredir?.({ fase: "texto", feitas: n, total: ate }), o.cancelado);
    return { total: doc.numPages, lidas };
  });
  const alemDoLimite = Array.from({ length: Math.max(0, total - LIMITE_PAGINAS) }, (_, i) => LIMITE_PAGINAS + 1 + i);
  const plano = planejarLeitura(lidas.length, (n) => Boolean(lidas[n - 1]?.camada));
  const pronto = (paginas: PaginaLida[], naoLidas: number[], motivo?: string): PdfLido => ({
    texto: montarTexto(paginas, { total, naoLidas, motivo }),
    paginas: total,
    naoLidas,
    ...(motivo ? { motivoNaoLidas: motivo } : {}),
  });
  const alemDosTetos = plano.foraDoOcr.length || alemDoLimite.length ? "acima do limite de leitura" : undefined;
  if (!plano.paraOcr.length && !plano.foraDoOcr.length) return pronto(lidas, alemDoLimite, alemDosTetos);

  const comTexto = lidas.filter((p) => p.camada);
  const { ocrPdf, ocrDisponivel } = await import("@/lib/ferramentas/ocr");
  if (!ocrDisponivel()) return pronto(comTexto, [...plano.paraOcr, ...plano.foraDoOcr, ...alemDoLimite], "este navegador não faz OCR");
  if (plano.avisar && o.confirmarOcr && !(await o.confirmarOcr(plano))) throw new LeituraCancelada();
  if (o.cancelado?.()) throw new LeituraCancelada();
  let r: Awaited<ReturnType<typeof ocrPdf>>;
  try {
    r = await ocrPdf(
      { id: "anexo", nome: "anexo.pdf", tamanho: bytes.length, bytes },
      {
        paginas: MAX_PAGINAS_OCR,
        // O `ocrPdf` conta todas as páginas (inclusive as que pula); o andamento mostra só as digitalizadas.
        aoProgredir: (feitas) => o.aoProgredir?.({ fase: "ocr", feitas: plano.paraOcr.filter((n) => n <= feitas).length, total: plano.paraOcr.length }),
        cancelado: o.cancelado,
      },
    );
  } catch (e) {
    if ((e as { name?: string } | null)?.name === "OperacaoCancelada" || o.cancelado?.()) throw e;
    // O OCR falhou (worker que não carrega, navegador sem suporte): as páginas
    // com texto continuam valendo, e o chip diz quais ficaram de fora.
    return pronto(comTexto, [...plano.paraOcr, ...plano.foraDoOcr, ...alemDoLimite], "o OCR falhou neste navegador");
  }
  const reconhecidas = await comPdf(r.bytes, (doc) => paginasDeTexto(doc, Math.min(doc.numPages, MAX_PAGINAS_OCR)));
  const paginas: PaginaLida[] = [...comTexto];
  const semLeitura: number[] = [];
  for (const n of plano.paraOcr) {
    const texto = reconhecidas[n - 1]?.texto ?? "";
    if (texto) paginas.push({ n, texto, ocr: true });
    else semLeitura.push(n);
  }
  const naoLidas = [...semLeitura, ...plano.foraDoOcr, ...alemDoLimite];
  return pronto(paginas, naoLidas, semLeitura.length ? "o OCR não reconheceu texto em parte delas" : alemDosTetos);
}
