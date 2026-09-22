/**
 * Texto de PDF, no painel (página da extensão).
 *
 * Reaproveita o carregador do pdf.js das Ferramentas de PDF — mesmo worker
 * empacotado em `vendor/ferramentas-pdf/pdfjs/`, mesmas travas de segurança
 * (sem scripting e sem `eval` do documento). O pdf.js entra em chunk separado,
 * carregado só quando o agente lê o primeiro PDF.
 *
 * OCR de PDF digitalizado fica para a fase 2 (o Tesseract das Ferramentas de
 * PDF pode ser reaproveitado do mesmo jeito).
 */

const LIMITE_PAGINAS = 200;

export async function extrairTextoPdf(base64: string): Promise<string> {
  const { carregarPdfJs, opcoesDocumento } = await import("@/lib/ferramentas/pdfjs");
  const pdfjs = await carregarPdfJs();
  const bruto = atob(base64);
  const bytes = new Uint8Array(bruto.length);
  for (let i = 0; i < bruto.length; i += 1) bytes[i] = bruto.charCodeAt(i);
  const tarefa = pdfjs.getDocument(opcoesDocumento(bytes));
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
    return texto.replace(/\[p\u00E1gina \d+\]\n?/g, "").trim() ? texto : "[PDF sem camada de texto (digitalizado). OCR ainda n\u00E3o dispon\u00EDvel no agente.]";
  } finally {
    await tarefa.destroy();
  }
}
