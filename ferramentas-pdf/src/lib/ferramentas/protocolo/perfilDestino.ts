/**
 * Perfil do destino: o que ESTA instalacao do SEI aceita.
 *
 * A diferenca em relacao a um catalogo de manuais e o ponto inteiro deste
 * modulo. Rodando dentro do SEI, o limite nao precisa ser estimado: ele e lido
 * do proprio sistema em que o usuario vai protocolar, agora. Por isso aqui nao
 * existe lista de orgaos, nem data de vigencia a vencer, nem `confianca:
 * "derivado"` -- o perfil vindo da ponte e sempre `"apurado"`.
 *
 * O QUE CONTINUA VALENDO do aprendizado anterior: NAO existe um "limite do
 * SEI". Uma consulta ao servico de parametros de upload de uma instalacao
 * federal (SEI 5.0.4) devolveu cerca de 5 GB por arquivo, enquanto ha orgaos
 * com teto de 10 MB. O numero e por INSTALACAO. Publicar um valor unico seria
 * inventar precisao que nao existe, e a conta viria como documento recusado.
 *
 * E o achado mais util na pratica: a lista de extensoes e fechada e NAO inclui
 * `doc`, `docx`, `xls`, `xlsx`, `ppt` nem `pptx`. Quem tenta anexar um arquivo
 * do Word e barrado. E motivo de recusa concreto, frequente, e que quase
 * ninguem documenta.
 */

import type { LimitesProtocolo, PresetProtocolo } from "./tipos";

/**
 * Extensoes aceitas por uma instalacao SEI 5.0.4 federal, apuradas por consulta
 * direta ao servico de parametros de upload. Serve de PONTO DE PARTIDA quando a
 * ponte com o SEI nao esta disponivel -- por exemplo, com a pagina aberta
 * sozinha, fora do SEI. Com a ponte ativa, a lista real substitui esta.
 */
export const EXTENSOES_SEI_CONHECIDAS = [
  "csv", "flac", "geotiff", "gml", "gz", "html", "jpeg", "jpg", "json", "kml",
  "kmz", "mkv", "mp4", "mpeg", "mpg", "odp", "ods", "odt", "oga", "ogg", "ogv",
  "pdf", "png", "shp", "svg", "tar", "txt", "xml", "xsl", "xslt", "zip",
];

/** Data em que as extensoes acima foram apuradas. */
const APURADO_EM = "2026-09-06";

/**
 * Perfil usado quando NAO ha ponte com o SEI: sem limite de tamanho (porque
 * nao ha como saber) e com a lista de extensoes tipica.
 */
export const PERFIL_SEI_GENERICO: PresetProtocolo = {
  id: "sei-padrao",
  nome: "SEI (limites típicos)",
  familia: "SEI",
  apelidos: ["sei", "processo administrativo", "documento externo"],
  limites: {
    // Sem `bytesPorArquivo` DE PROPOSITO: ver o comentario no topo.
    extensoes: EXTENSOES_SEI_CONHECIDAS,
  },
  confianca: "derivado",
  fonte: {
    titulo: "Parâmetros de upload de uma instalação SEI 5.0.4 federal",
    url: "",
    verificadoEm: APURADO_EM,
  },
  observacao:
    "O tamanho máximo por arquivo é configurado por cada instalação do SEI, não pelo sistema: há órgãos com teto de 10 MB e instalações que aceitam vários gigabytes. Abra as Ferramentas de PDF a partir do SEI para ler o limite real do seu órgão. A lista de extensões costuma ser a mesma: repare que arquivos do Word e do Excel não estão nela.",
};

/** Perfil de preenchimento manual, quando o usuario informa os limites. */
export const PERFIL_MANUAL: PresetProtocolo = {
  id: "manual",
  nome: "Informar os limites manualmente",
  familia: "Manual",
  limites: {},
  confianca: "apurado",
  fonte: {
    titulo: "Informado por você, a partir da tela de envio do órgão",
    url: "",
    verificadoEm: new Date(0).toISOString().slice(0, 10),
  },
};

/** O que a ponte com o SEI consegue ler da instalacao. */
export interface ParametrosUploadSei {
  /** Teto por arquivo em bytes. Ausente quando nao foi possivel apurar. */
  bytesPorArquivo?: number;
  /** Extensoes aceitas, sem o ponto. Ausente quando nao foi possivel apurar. */
  extensoes?: string[];
  /** Host da instalacao, so para exibir a procedencia ao usuario. */
  host?: string;
}

/**
 * Monta o perfil a partir do que foi lido da instalacao.
 *
 * Regra de honestidade: so e `"apurado"` o que veio mesmo do sistema. Se a
 * leitura falhou em tudo, devolve o perfil generico -- nunca um numero
 * inventado com selo de apurado.
 */
export function perfilDoSei(parametros: ParametrosUploadSei): PresetProtocolo {
  const leuAlgo =
    parametros.bytesPorArquivo !== undefined ||
    (parametros.extensoes !== undefined && parametros.extensoes.length > 0);

  if (!leuAlgo) return PERFIL_SEI_GENERICO;

  const limites: LimitesProtocolo = {};
  if (parametros.bytesPorArquivo !== undefined) {
    limites.bytesPorArquivo = parametros.bytesPorArquivo;
  }
  if (parametros.extensoes !== undefined && parametros.extensoes.length > 0) {
    limites.extensoes = parametros.extensoes;
  }

  return {
    id: "sei-instalacao",
    nome: parametros.host ? `SEI de ${parametros.host}` : "SEI (esta instalação)",
    familia: "SEI",
    limites,
    confianca: "apurado",
    fonte: {
      titulo: "Parâmetros de upload lidos desta instalação do SEI",
      url: parametros.host ?? "",
      verificadoEm: new Date().toISOString().slice(0, 10),
    },
    observacao:
      parametros.bytesPorArquivo === undefined
        ? "Não foi possível ler o tamanho máximo por arquivo desta instalação; confira o valor na própria tela de envio."
        : undefined,
  };
}

/** Compatibilidade com o seletor: os perfis oferecidos sem ponte. */
export const PERFIS: PresetProtocolo[] = [PERFIL_SEI_GENERICO];

export function perfilPorId(id: string): PresetProtocolo | undefined {
  if (id === PERFIL_MANUAL.id) return PERFIL_MANUAL;
  return PERFIS.find((p) => p.id === id);
}
