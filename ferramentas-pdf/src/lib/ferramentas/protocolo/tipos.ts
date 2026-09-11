/**
 * Presets de protocolo: o que cada sistema aceita.
 *
 * O público desta ferramenta são advogados e consultores regulatórios. Um
 * limite errado aqui não gera um bug: gera perda de prazo. Por isso o tipo
 * FORÇA a procedência — não existe preset sem fonte e sem data de apuração,
 * porque um número solto é indistinguível de um chute depois de seis meses.
 */

export type NivelConfianca =
  /**
   * Apurado no próprio sistema, por consulta ao serviço de parâmetros de
   * upload da instalação. É o dado mais forte que existe.
   */
  | "apurado"
  /** Publicado em manual ou norma do próprio órgão. */
  | "oficial"
  /**
   * Vem de fonte secundária, de manual de fornecedor ou de instalação
   * diferente da do usuário. Serve de referência inicial, não de garantia.
   */
  | "derivado";

export interface FontePreset {
  /** Como a fonte se chama, para exibir ao usuário. */
  titulo: string;
  url: string;
  /** ISO 8601. Quando o dado foi conferido pela última vez. */
  verificadoEm: string;
}

export interface LimitesProtocolo {
  /** Teto por arquivo, em bytes. Ausente quando o sistema não fixa um. */
  bytesPorArquivo?: number;
  /** Teto da sessão de envio, em bytes. */
  bytesPorLote?: number;
  /** Teto médio por página, em bytes. Alguns tribunais cobram isso. */
  bytesPorPagina?: number;
  /** Extensões aceitas, sem o ponto. Ausente quando o sistema não restringe. */
  extensoes?: string[];
  /** O sistema exige texto pesquisável em documento digitalizado. */
  exigeOcr?: boolean;
  /**
   * Teto de caracteres do NOME do arquivo.
   *
   * Parece detalhe e não é: é causa de recusa tão frequente quanto o tamanho,
   * e muito pior de diagnosticar, porque o sistema costuma responder com erro
   * genérico em vez de dizer que o problema é o nome.
   */
  maxCaracteresNome?: number;
  /** Caracteres que o órgão recusa no nome do arquivo, como texto exibível. */
  caracteresProibidosNome?: string;
  /** O órgão exige PDF/A, e não apenas PDF. */
  exigePdfA?: boolean;
}

export interface PresetProtocolo {
  id: string;
  /** Nome exibido no seletor. */
  nome: string;
  /** Família, para agrupar no seletor (ex.: "SEI", "Judiciário"). */
  familia: string;
  /** Termos alternativos de busca (sigla, apelido). */
  apelidos?: string[];
  limites: LimitesProtocolo;
  confianca: NivelConfianca;
  fonte: FontePreset;
  /** Ressalva específica deste preset, exibida junto dos limites. */
  observacao?: string;
}

/** Um preset perde vigência aos 180 dias e passa a exibir aviso. */
export const DIAS_DE_VIGENCIA = 180;

/**
 * Margem de segurança aplicada ao teto.
 *
 * A assinatura digital acrescenta bytes ao arquivo DEPOIS desta etapa, e um
 * arquivo no limite exato costuma ser recusado no envio.
 */
export const MARGEM = 0.05;
export const MARGEM_MINIMA_BYTES = 256 * 1024;

export function limiteComMargem(bytes: number): number {
  const folga = Math.max(bytes * MARGEM, MARGEM_MINIMA_BYTES);
  return Math.max(1, Math.floor(bytes - folga));
}
