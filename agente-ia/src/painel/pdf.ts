/**
 * Texto de PDF, no painel (página da extensão).
 *
 * Reaproveita o carregador do pdf.js das Ferramentas de PDF — mesmo worker
 * empacotado em `vendor/ferramentas-pdf/pdfjs/`, mesmas travas de segurança
 * (sem scripting e sem `eval` do documento). O pdf.js entra em chunk separado,
 * carregado só quando o agente lê o primeiro PDF.
 *
 * PDF digitalizado passa pelo OCR das Ferramentas de PDF (ver `extrairTextoPdf`).
 */

const LIMITE_PAGINAS = 200;
/**
 * Páginas que o agente manda ao OCR. Cada uma custa segundos de CPU no painel,
 * que trava enquanto reconhece; o usuário não pediu o OCR, ele só pediu para
 * ler o documento. Precisando do resto, existem as Ferramentas de PDF.
 */
const PAGINAS_OCR = 5;
const SEM_TEXTO = "[PDF sem camada de texto (digitalizado).]";

/** Texto das páginas pela camada de texto do PDF (sem OCR). */
async function textoDoPdf(bytes: Uint8Array): Promise<string> {
  const { carregarPdfJs, opcoesDocumento } = await import("@/lib/ferramentas/pdfjs");
  const pdfjs = await carregarPdfJs();
  // Cópia: o pdf.js TRANSFERE o buffer para o worker, e o original ficaria
  // "destacado" (inutilizável) para o OCR que pode vir depois.
  const tarefa = pdfjs.getDocument(opcoesDocumento(bytes.slice()));
  const doc = await tarefa.promise;
  try {
    const partes: string[] = [];
    const total = Math.min(doc.numPages, LIMITE_PAGINAS);
    for (let n = 1; n <= total; n += 1) {
      const pagina = await doc.getPage(n);
      const conteudo = await pagina.getTextContent();
      let linha = "";
      const linhas: string[] = [];
      for (const item of conteudo.items as Array<{ str?: string; hasEOL?: boolean }>) {
        linha += item.str ?? "";
        if (item.hasEOL) {
          linhas.push(linha);
          linha = "";
        }
      }
      if (linha) linhas.push(linha);
      partes.push(`[p\u00E1gina ${n}]\n${linhas.join("\n").replace(/[ \t]+/g, " ").trim()}`);
    }
    if (doc.numPages > total) partes.push(`[... ${doc.numPages - total} p\u00E1ginas n\u00E3o lidas]`);
    const texto = partes.join("\n\n");
    return texto.replace(/\[p\u00E1gina \d+\]\n?/g, "").trim() ? texto : SEM_TEXTO;
  } finally {
    await tarefa.destroy();
  }
}

/**
 * Texto de um PDF. Sem camada de texto (digitalizado), roda o OCR das
 * Ferramentas de PDF — que devolve um PDF pesquisável — e lê o texto dele.
 * Reaproveita o Tesseract já empacotado (`vendor/ferramentas-pdf/tesseract/`),
 * com o modelo de português, sem nada novo no pacote.
 */
export async function extrairTextoPdf(base64: string, o: { ocr?: boolean } = {}): Promise<string> {
  const bruto = atob(base64);
  const bytes = new Uint8Array(bruto.length);
  for (let i = 0; i < bruto.length; i += 1) bytes[i] = bruto.charCodeAt(i);
  const texto = await textoDoPdf(bytes);
  if (texto !== SEM_TEXTO || o.ocr === false) return texto;
  const { ocrPdf, ocrDisponivel } = await import("@/lib/ferramentas/ocr");
  if (!ocrDisponivel()) return `${SEM_TEXTO} Este navegador n\u00E3o suporta o OCR local.`;
  const r = await ocrPdf({ id: "agente", nome: "documento.pdf", tamanho: bytes.length, bytes }, { paginas: PAGINAS_OCR });
  if (r.semTexto) return `${SEM_TEXTO} O OCR n\u00E3o reconheceu texto.`;
  const resto = r.totalPaginas > r.paginasProcessadas ? ` de ${r.totalPaginas}; as demais n\u00E3o foram lidas` : "";
  return `[texto obtido por OCR de ${r.paginasProcessadas} p\u00E1gina(s)${resto}; pode conter erros de reconhecimento]\n\n${await textoDoPdf(r.bytes)}`;
}
