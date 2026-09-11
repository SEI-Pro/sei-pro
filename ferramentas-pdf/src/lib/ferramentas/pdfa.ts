/**
 * Diagnóstico de conformidade PDF/A.
 *
 * O QUE ESTA FERRAMENTA É, E O QUE ELA NÃO É. Ela CONFERE e EXPLICA; ela não
 * converte, e não emite parecer de conformidade. A referência de validação é o
 * veraPDF, que implementa a norma inteira; aqui estão as verificações que
 * respondem à pergunta prática de quem teve uma petição recusada — "por que
 * este PDF não é aceito como PDF/A, e o que eu faço?".
 *
 * POR QUE NÃO CONVERTEMOS. Converter de verdade exige reescrever o documento:
 * embutir fontes que não estão lá, anexar perfil de cor, normalizar
 * transparência. As implementações maduras disso em WebAssembly derivam do
 * Ghostscript e do mupdf, ambos AGPL. O projeto já vetou o mupdf por prudência
 * jurídica ao montar a suíte (ver `docs/FERRAMENTAS_PDF.md`), e a mesma razão
 * vale aqui. Prometer conversão e entregar um arquivo que continua reprovando
 * seria pior do que não oferecer.
 *
 * DECISÃO DE PRODUTO QUE VALE REGISTRAR: as verificações abaixo são
 * NECESSÁRIAS, e não suficientes. Um arquivo que passa em todas ainda pode ser
 * reprovado pelo veraPDF. Por isso o resultado nunca diz "é PDF/A": diz o que
 * foi conferido e o que falhou. Dizer ao advogado que o arquivo está conforme,
 * e ele ser recusado no protocolo, é o pior desfecho possível.
 */

import { PDFDict, PDFDocument, PDFName, PDFRawStream, PDFStream } from "@cantoo/pdf-lib";

import type { ArquivoEntrada } from "@/types/ferramentas";
import { comoErroFerramenta, ErroFerramenta } from "./erros";

export type SituacaoVerificacao = "ok" | "falha" | "atencao" | "indeterminado";

export interface Verificacao {
  id: string;
  titulo: string;
  situacao: SituacaoVerificacao;
  /** O que foi encontrado, em uma frase. */
  detalhe: string;
  /** O que fazer, quando há o que fazer. */
  comoResolver?: string;
}

export interface DiagnosticoPdfA {
  nomeArquivo: string;
  /** Parte e nível declarados no XMP, quando existem (ex.: "2B"). */
  perfilDeclarado: string | null;
  verificacoes: Verificacao[];
  /** Quantidade de verificações reprovadas. */
  falhas: number;
}

/** Lê o fluxo XMP do catálogo como texto, quando existir. */
function lerXmp(doc: PDFDocument): string | null {
  const ref = doc.catalog.get(PDFName.of("Metadata"));
  if (!ref) return null;
  const objeto = doc.context.lookup(ref);
  if (!(objeto instanceof PDFStream)) return null;
  try {
    // O XMP é gravado sem compressão na esmagadora maioria dos arquivos, que é
    // o que a própria norma recomenda para permitir leitura por ferramenta
    // externa. Quando vier comprimido, preferimos devolver nada a entregar
    // lixo: o diagnóstico marca "indeterminado" em vez de acusar falha.
    if (!(objeto instanceof PDFRawStream)) return null;
    return new TextDecoder().decode(objeto.contents);
  } catch {
    return null;
  }
}

/** Extrai "parte + conformidade" do XMP, ex.: "2B". */
function perfilDoXmp(xmp: string | null): string | null {
  if (!xmp) return null;
  const parte = /pdfaid[:\s]*part\s*[>="']+\s*(\d)/i.exec(xmp);
  const nivel = /pdfaid[:\s]*conformance\s*[>="']+\s*([ABU])/i.exec(xmp);
  if (!parte) return null;
  return `${parte[1]}${nivel ? nivel[1].toUpperCase() : ""}`;
}

/** Percorre os objetos e classifica as fontes quanto ao arquivo embutido. */
function conferirFontes(doc: PDFDocument): {
  total: number;
  semArquivo: string[];
} {
  const semArquivo: string[] = [];
  let total = 0;

  for (const [, objeto] of doc.context.enumerateIndirectObjects()) {
    if (!(objeto instanceof PDFDict)) continue;
    if (String(objeto.get(PDFName.of("Type"))) !== "/Font") continue;

    const subtipo = String(objeto.get(PDFName.of("Subtype")) ?? "");
    // Type0 é fonte composta: o arquivo vive no descendente, e conferir o
    // dicionário de topo acusaria falso positivo em todo PDF com fonte CID.
    if (subtipo === "/Type0") continue;

    total += 1;
    const nome = String(objeto.get(PDFName.of("BaseFont")) ?? "(sem nome)").replace(/^\//, "");
    const descritorRef = objeto.get(PDFName.of("FontDescriptor"));
    const descritor = descritorRef ? doc.context.lookup(descritorRef) : null;

    if (!(descritor instanceof PDFDict)) {
      semArquivo.push(nome);
      continue;
    }
    const temArquivo =
      descritor.get(PDFName.of("FontFile")) ??
      descritor.get(PDFName.of("FontFile2")) ??
      descritor.get(PDFName.of("FontFile3"));
    if (!temArquivo) semArquivo.push(nome);
  }

  return { total, semArquivo };
}

function temChaveNoCatalogo(doc: PDFDocument, caminho: string[]): boolean {
  let atual: unknown = doc.catalog;
  for (const chave of caminho) {
    if (!(atual instanceof PDFDict)) return false;
    const proximo = atual.get(PDFName.of(chave));
    if (!proximo) return false;
    atual = doc.context.lookup(proximo);
  }
  return Boolean(atual);
}

export async function diagnosticarPdfA(arquivo: ArquivoEntrada): Promise<DiagnosticoPdfA> {
  try {
    const doc = await PDFDocument.load(new Uint8Array(arquivo.bytes), {
      ignoreEncryption: true,
      updateMetadata: false,
    });

    const xmp = lerXmp(doc);
    const perfil = perfilDoXmp(xmp);
    const fontes = conferirFontes(doc);
    const temOutputIntent = Boolean(doc.catalog.get(PDFName.of("OutputIntents")));
    const temJavaScript =
      temChaveNoCatalogo(doc, ["Names", "JavaScript"]) ||
      temChaveNoCatalogo(doc, ["OpenAction", "JS"]);
    const temAnexos = temChaveNoCatalogo(doc, ["Names", "EmbeddedFiles"]);

    const verificacoes: Verificacao[] = [
      {
        id: "declaracao",
        titulo: "Declaração de PDF/A nos metadados",
        situacao: perfil ? "ok" : xmp ? "falha" : "falha",
        detalhe: perfil
          ? `O arquivo se declara PDF/A-${perfil}.`
          : xmp
            ? "O arquivo tem metadados XMP, mas nenhuma declaração de PDF/A."
            : "O arquivo não traz metadados XMP, e portanto não se declara PDF/A.",
        comoResolver: perfil
          ? undefined
          : "A declaração é gravada por quem gera o arquivo. No LibreOffice, exporte como PDF marcando PDF/A; no Word, use Salvar como PDF e selecione o padrão PDF/A; num digitalizador, procure a opção de saída PDF/A.",
      },
      {
        id: "criptografia",
        titulo: "Ausência de criptografia",
        situacao: doc.isEncrypted ? "falha" : "ok",
        detalhe: doc.isEncrypted
          ? "O documento está cifrado, e PDF/A não admite criptografia."
          : "O documento não está cifrado.",
        comoResolver: doc.isEncrypted
          ? "Remova a senha e as restrições no programa que gerou o arquivo e exporte de novo."
          : undefined,
      },
      {
        id: "fontes",
        titulo: "Fontes embutidas",
        situacao: fontes.total === 0 ? "atencao" : fontes.semArquivo.length > 0 ? "falha" : "ok",
        detalhe:
          fontes.total === 0
            ? "Nenhuma fonte simples foi encontrada. Isso é o esperado num documento só de imagem, e nesse caso não há o que embutir."
            : fontes.semArquivo.length > 0
              ? `${fontes.semArquivo.length} de ${fontes.total} fontes não trazem o arquivo embutido: ${fontes.semArquivo.slice(0, 4).join(", ")}${fontes.semArquivo.length > 4 ? "…" : ""}.`
              : `As ${fontes.total} fontes do documento têm o arquivo embutido.`,
        comoResolver:
          fontes.semArquivo.length > 0
            ? "Fontes padrão como Helvetica, Arial e Times costumam entrar sem ser embutidas. Exportar como PDF/A pelo programa de origem resolve, porque o modo PDF/A força a inclusão."
            : undefined,
      },
      {
        id: "perfil-de-cor",
        titulo: "Perfil de cor de saída",
        situacao: temOutputIntent ? "ok" : "falha",
        detalhe: temOutputIntent
          ? "O documento declara um perfil de cor de saída."
          : "O documento não declara perfil de cor de saída, exigido pelo PDF/A para que as cores sejam reproduzíveis no futuro.",
        comoResolver: temOutputIntent
          ? undefined
          : "É acrescentado automaticamente ao exportar no modo PDF/A.",
      },
      {
        id: "javascript",
        titulo: "Ausência de JavaScript",
        situacao: temJavaScript ? "falha" : "ok",
        detalhe: temJavaScript
          ? "O documento contém JavaScript, que PDF/A não admite."
          : "Nenhum JavaScript foi encontrado.",
        comoResolver: temJavaScript
          ? "Costuma vir de formulário interativo. Achatar o formulário antes de exportar resolve."
          : undefined,
      },
      {
        id: "anexos",
        titulo: "Arquivos anexados",
        situacao: temAnexos ? "atencao" : "ok",
        detalhe: temAnexos
          ? "O documento tem arquivos anexados. PDF/A-1 e PDF/A-2 não admitem; PDF/A-3 admite."
          : "Nenhum arquivo anexado.",
        comoResolver: temAnexos
          ? "Se o órgão exigir PDF/A-1 ou PDF/A-2, remova os anexos e envie-os como peças próprias."
          : undefined,
      },
    ];

    return {
      nomeArquivo: arquivo.nome,
      perfilDeclarado: perfil,
      verificacoes,
      falhas: verificacoes.filter((v) => v.situacao === "falha").length,
    };
  } catch (e) {
    if (e instanceof ErroFerramenta) throw e;
    throw comoErroFerramenta(e, "FALHA_INESPERADA", { nome: arquivo.nome });
  }
}
