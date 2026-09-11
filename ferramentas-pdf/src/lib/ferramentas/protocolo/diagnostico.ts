/**
 * Diagnóstico dos arquivos contra o destino escolhido.
 *
 * Produz vereditos, não decisões: quem escolhe o que fazer é o usuário. A
 * ferramenta prepara os arquivos, mas não substitui a conferência de quem
 * protocola.
 */

import type { ArquivoEntrada } from "@/types/ferramentas";
import type { LimitesProtocolo, PresetProtocolo } from "./tipos";
import { DIAS_DE_VIGENCIA, limiteComMargem } from "./tipos";

export type TipoProblema =
  | "extensaoNaoAceita"
  | "acimaDoLimitePorArquivo"
  | "acimaDoLimitePorPagina"
  | "semTextoPesquisavel"
  | "assinado"
  | "protegido"
  | "corrompido";

export interface Problema {
  tipo: TipoProblema;
  arquivoId: string;
  arquivoNome: string;
  detalhe: string;
  /** A ferramenta consegue resolver sozinha, no navegador. */
  temSolucao: boolean;
}

export interface Veredito {
  problemas: Problema[];
  /** Soma de todos os arquivos, para checar o teto de lote. */
  bytesTotais: number;
  loteAcimaDoLimite: boolean;
  /** O preset não é reconferido há mais de 180 dias. */
  presetVencido: boolean;
}

function extensaoDe(nome: string): string {
  const m = nome.match(/\.([A-Za-z0-9]+)$/);
  return m ? m[1].toLowerCase() : "";
}

function diasDesde(iso: string, hoje: Date): number {
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return Number.POSITIVE_INFINITY;
  return Math.floor((hoje.getTime() - t) / 86_400_000);
}

/**
 * Avalia os arquivos contra os limites.
 *
 * `hoje` entra por parâmetro em vez de vir de `new Date()` interno para que o
 * resultado seja determinístico e testável.
 */
export function diagnosticar(
  arquivos: ArquivoEntrada[],
  preset: PresetProtocolo,
  limites: LimitesProtocolo,
  hoje: Date,
): Veredito {
  const problemas: Problema[] = [];
  let bytesTotais = 0;

  for (const a of arquivos) {
    bytesTotais += a.tamanho;
    const ext = extensaoDe(a.nome);

    if (a.erro === "PDF_PROTEGIDO" || a.erro === "SENHA_INCORRETA") {
      problemas.push({
        tipo: "protegido",
        arquivoId: a.id,
        arquivoNome: a.nome,
        detalhe: "Exige senha para ser aberto. Informe a senha na lista acima.",
        temSolucao: false,
      });
      continue;
    }

    if (a.erro) {
      problemas.push({
        tipo: "corrompido",
        arquivoId: a.id,
        arquivoNome: a.nome,
        detalhe: "O arquivo não pôde ser lido por inteiro.",
        temSolucao: false,
      });
      continue;
    }

    if (limites.extensoes && ext && !limites.extensoes.includes(ext)) {
      const ehOffice = ["doc", "docx", "xls", "xlsx", "ppt", "pptx", "rtf"].includes(ext);
      problemas.push({
        tipo: "extensaoNaoAceita",
        arquivoId: a.id,
        arquivoNome: a.nome,
        detalhe: ehOffice
          ? `Este órgão não aceita arquivos .${ext}. Exporte o documento como PDF antes de anexar. Nós não convertemos documentos do Office, porque isso exigiria enviar o seu arquivo para um servidor.`
          : `Este órgão não aceita arquivos .${ext}.`,
        temSolucao: false,
      });
      continue;
    }

    if (limites.bytesPorArquivo && a.tamanho > limiteComMargem(limites.bytesPorArquivo)) {
      problemas.push({
        tipo: "acimaDoLimitePorArquivo",
        arquivoId: a.id,
        arquivoNome: a.nome,
        detalhe: "Acima do tamanho aceito. Pode ser comprimido, dividido, ou os dois.",
        temSolucao: true,
      });
    }

    const paginas = a.diagnostico?.paginas ?? 0;
    if (limites.bytesPorPagina && paginas > 0) {
      const media = a.tamanho / paginas;
      if (media > limites.bytesPorPagina) {
        problemas.push({
          tipo: "acimaDoLimitePorPagina",
          arquivoId: a.id,
          arquivoNome: a.nome,
          detalhe: "A média por página passa do que o órgão aceita. A compressão resolve.",
          temSolucao: true,
        });
      }
    }

    if (a.diagnostico?.temAssinatura) {
      problemas.push({
        tipo: "assinado",
        arquivoId: a.id,
        arquivoNome: a.nome,
        detalhe:
          "Traz assinatura digital. Comprimir ou dividir invalida a assinatura: prepare o arquivo antes de assiná-lo.",
        temSolucao: false,
      });
    }

    if (limites.exigeOcr) {
      problemas.push({
        tipo: "semTextoPesquisavel",
        arquivoId: a.id,
        arquivoNome: a.nome,
        detalhe:
          "Este destino exige texto pesquisável em documento digitalizado. Não fazemos reconhecimento de texto: confira no seu leitor de PDF se o documento permite selecionar o texto e, se não permitir, passe o OCR antes.",
        temSolucao: false,
      });
    }
  }

  return {
    problemas,
    bytesTotais,
    loteAcimaDoLimite: Boolean(
      limites.bytesPorLote && bytesTotais > limiteComMargem(limites.bytesPorLote),
    ),
    presetVencido: diasDesde(preset.fonte.verificadoEm, hoje) > DIAS_DE_VIGENCIA,
  };
}
