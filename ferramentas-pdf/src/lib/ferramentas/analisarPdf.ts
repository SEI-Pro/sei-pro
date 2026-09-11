/**
 * Inspeção de um PDF antes de qualquer operação sobre ele.
 *
 * A ORDEM IMPORTA. O primeiro portão é a criptografia, e ele existe por um
 * motivo concreto: o `pdf-lib` original, carregado com `ignoreEncryption: true`,
 * abre um documento protegido e devolve PÁGINAS EM BRANCO, sem lançar erro
 * nenhum. Quem juntasse peças assim protocolaria um arquivo vazio sem perceber.
 * PDFs de tribunal e de assinadores ICP-Brasil costumam trazer senha de
 * proprietário, então esse caso não é raro. Por isso usamos o `@cantoo/pdf-lib`,
 * que descriptografa de verdade, e por isso `ignoreEncryption` NUNCA é usado
 * aqui.
 */

import { PDFDocument, PDFDict, PDFName, PDFNumber } from "@cantoo/pdf-lib";

import type { DiagnosticoPdf } from "@/types/ferramentas";
import { ErroFerramenta } from "./erros";

/** Assinatura de arquivo PDF: os bytes "%PDF". */
const MAGIC = [0x25, 0x50, 0x44, 0x46];

/**
 * Confere os bytes iniciais do arquivo.
 *
 * A extensão do nome não prova nada: um .docx renomeado para .pdf chega aqui
 * como PDF. Alguns geradores colocam lixo antes do cabeçalho, então aceitamos
 * a assinatura em qualquer ponto dos primeiros 1024 bytes, como fazem os
 * leitores tolerantes.
 */
export function pareceSerPdf(bytes: Uint8Array): boolean {
  const limite = Math.min(bytes.length - MAGIC.length, 1024);
  for (let i = 0; i <= limite; i += 1) {
    if (
      bytes[i] === MAGIC[0] &&
      bytes[i + 1] === MAGIC[1] &&
      bytes[i + 2] === MAGIC[2] &&
      bytes[i + 3] === MAGIC[3]
    ) {
      return true;
    }
  }
  return false;
}

/** Marcador de fim de arquivo PDF: os bytes "%%EOF". */
const EOF = [0x25, 0x25, 0x45, 0x4f, 0x46];

/** Quanto do fim do arquivo é varrido em busca do marcador. */
const JANELA_EOF = 2048;

/**
 * Confere se o arquivo chegou inteiro.
 *
 * VERIFICADO EM TESTE, e é o motivo desta função existir: um PDF de 2 páginas
 * cortado ao meio CARREGA SEM ERRO NENHUM e devolve 1 página. A união então
 * descartaria a página que falta em silêncio, e quem protocola só descobriria
 * depois. Todo PDF íntegro termina com "%%EOF"; um download interrompido, não.
 *
 * A varredura cobre os últimos 2 KB porque alguns geradores deixam bytes
 * sobrando depois do marcador.
 */
export function pareceCompleto(bytes: Uint8Array): boolean {
  const inicio = Math.max(0, bytes.length - JANELA_EOF);
  for (let i = bytes.length - EOF.length; i >= inicio; i -= 1) {
    let bate = true;
    for (let j = 0; j < EOF.length; j += 1) {
      if (bytes[i + j] !== EOF[j]) {
        bate = false;
        break;
      }
    }
    if (bate) return true;
  }
  return false;
}

/** Distingue "documento cifrado" de "arquivo quebrado" pelo erro recebido. */
function ehErroDeCriptografia(e: unknown): boolean {
  const nome = e instanceof Error ? e.name : "";
  const texto = e instanceof Error ? e.message : String(e);
  return nome === "EncryptedPDFError" || /encrypt|password|senha/i.test(texto);
}

/**
 * Abre o documento, aplicando a senha quando houver.
 *
 * Distingue os três casos que importam ao usuário:
 *   - documento aberto normalmente;
 *   - documento que exige senha de usuário (lança PDF_PROTEGIDO);
 *   - senha informada que não confere (lança SENHA_INCORRETA).
 *
 * A TENTATIVA COM SENHA VAZIA NÃO É REDUNDANTE. Verificado em teste: um PDF
 * cifrado apenas com senha de PROPRIETÁRIO (restrição de edição, sem senha de
 * abertura) faz `load()` sem senha lançar EncryptedPDFError. Pedir a senha ao
 * usuário nesse caso seria pedir algo que não existe, e documento assim é
 * comum: peça de tribunal e exportação protegida do Word. Repetindo a carga
 * com senha vazia, o documento abre e fica marcado como restrito.
 *
 * O documento aberto com zero páginas também é recusado. Verificado em teste:
 * um PDF truncado carrega sem erro nenhum e produz um documento vazio, o que
 * faria a união descartar aquela peça em silêncio.
 */
export async function abrirPdf(
  bytes: Uint8Array,
  opcoes: { nome?: string; senha?: string } = {},
): Promise<PDFDocument> {
  const { nome, senha } = opcoes;

  if (!pareceSerPdf(bytes)) {
    throw new ErroFerramenta("TIPO_NAO_SUPORTADO", { nome });
  }
  if (!pareceCompleto(bytes)) {
    throw new ErroFerramenta("ARQUIVO_CORROMPIDO", { nome });
  }

  const tentativas = senha !== undefined ? [senha] : [undefined, ""];

  for (const tentativa of tentativas) {
    try {
      const doc = await PDFDocument.load(bytes, {
        // Nunca ligar ignoreEncryption: ver o comentário no topo do arquivo.
        password: tentativa,
        // Preserva o XFA para que a análise possa detectá-lo e avisar. Sem
        // isso, qualquer leitura do formulário já o descartaria em silêncio.
        preserveXFA: true,
        updateMetadata: false,
      });

      if (doc.getPageCount() === 0) {
        throw new ErroFerramenta("ARQUIVO_CORROMPIDO", { nome });
      }
      return doc;
    } catch (e) {
      if (e instanceof ErroFerramenta) throw e;
      if (!ehErroDeCriptografia(e)) {
        throw new ErroFerramenta("ARQUIVO_CORROMPIDO", { nome });
      }
      // Cifrado: tenta a próxima chave da lista, se houver.
    }
  }

  throw new ErroFerramenta(senha !== undefined ? "SENHA_INCORRETA" : "PDF_PROTEGIDO", {
    nome,
  });
}

/** Bit 1 de /SigFlags no AcroForm: o documento contém campos de assinatura. */
const SIG_FLAG_ASSINATURAS_EXISTEM = 1;

/**
 * Lê o dicionário AcroForm sem passar por `getForm()`.
 *
 * `getForm()` REMOVE os dados XFA quando o documento não foi carregado com
 * `preserveXFA: true` — o próprio pdf-lib documenta isso. Como aqui só queremos
 * olhar, inspecionamos o catálogo diretamente e não tocamos no formulário.
 */
function lerAcroForm(doc: PDFDocument): PDFDict | undefined {
  try {
    return doc.catalog.lookupMaybe(PDFName.of("AcroForm"), PDFDict);
  } catch {
    return undefined;
  }
}

/**
 * Diagnostica um documento já aberto.
 *
 * Nenhuma destas checagens impede a operação por si só: elas alimentam os
 * avisos exibidos ao usuário. Quem decide se prossegue é ele.
 */
export function diagnosticar(doc: PDFDocument): DiagnosticoPdf {
  const acro = lerAcroForm(doc);

  let temXfa = false;
  let temAssinatura = false;
  try {
    temXfa = Boolean(acro?.get(PDFName.of("XFA")));
    const flags = acro?.lookupMaybe(PDFName.of("SigFlags"), PDFNumber);
    const valor = flags?.asNumber() ?? 0;
    temAssinatura = (valor & SIG_FLAG_ASSINATURAS_EXISTEM) !== 0;
  } catch {
    // Documento com estrutura fora do padrão: seguimos sem os avisos.
  }

  return {
    paginas: doc.getPageCount(),
    precisaSenha: false, // quem chega aqui já abriu o documento
    temXfa,
    temAssinatura,
    // `isDecrypted` só fica verdadeiro quando havia criptografia e nós a
    // desfizemos. Como a abertura ocorreu sem senha do usuário, isso significa
    // senha de proprietário, ou seja, restrição de edição.
    temRestricoes: Boolean(doc.context.isDecrypted),
  };
}

/** Abre e diagnostica em um passo só. */
export async function analisarPdf(
  bytes: Uint8Array,
  opcoes: { nome?: string; senha?: string } = {},
): Promise<{ doc: PDFDocument; diagnostico: DiagnosticoPdf }> {
  const doc = await abrirPdf(bytes, opcoes);
  return { doc, diagnostico: diagnosticar(doc) };
}
