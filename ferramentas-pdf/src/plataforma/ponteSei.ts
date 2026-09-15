/**
 * Ponte com o SEI.
 *
 * A pagina das Ferramentas de PDF e uma pagina da extensao: nao tem os cookies
 * do SEI nem permissao de host, entao NAO consegue buscar documento nenhum
 * sozinha. Quem consegue e o codigo que roda dentro da pagina do SEI. Esta
 * interface e o contrato entre os dois lados.
 *
 * POR QUE ELA E ABSTRATA, e nao uma chamada direta: a pagina precisa funcionar
 * inteira quando aberta sozinha -- pelo icone da extensao, sem SEI aberto em
 * lugar nenhum. Com `PONTE_AUSENTE`, as nove ferramentas continuam operando
 * sobre arquivos da maquina do usuario, e so as integracoes somem.
 *
 * REGRA DE DEGRADACAO: ausencia ESCONDE o controle, nao o desabilita. Botao
 * cinza sem explicacao e pior que botao inexistente -- o usuario fica tentando
 * clicar e nao descobre por que nada acontece.
 */

import type { LimitesProtocolo } from "@/lib/ferramentas/protocolo/tipos";

/** Onde o usuario esta, do lado do SEI. */
export interface ContextoSei {
  /** Numero do processo aberto, ja formatado. Ausente na tela de listagem. */
  protocolo?: string;
  /** Id interno do procedimento, quando ha um processo em foco. */
  idProcedimento?: string;
  /** Sigla da unidade em que o usuario esta. */
  unidade?: string;
  /** Host da instalacao, para exibir a procedencia dos limites. */
  host: string;
  /** Versao do SEI detectada, quando conhecida. */
  versaoSei?: string;
}

/** Um documento da arvore do processo. */
export interface DocumentoSei {
  /** Id do protocolo dentro do SEI. */
  id: string;
  /** Nome como aparece na arvore. */
  nome: string;
  /** Numero SEI do documento, quando houver. */
  numero?: string;
  /** Falso para documento externo (anexado); verdadeiro para nato do SEI. */
  nativo: boolean;
  /** Se da para trazer o arquivo para ca. Documento nato nao e PDF. */
  baixavel: boolean;
}

/** Um tipo de documento externo, como o SEI o oferece no `selSerie`. */
export interface TipoDocumentoSei {
  nome: string;
  valor: string;
}

/** O que sai daqui de volta para o processo. */
export interface SaidaParaSei {
  nome: string;
  bytes: Uint8Array;
  /**
   * Id do tipo de documento no SEI. Ausente: a ponte deduz pelo nome do
   * arquivo, pelo tipo padrão configurado ou por "Anexo" -- e, se nada disso
   * servir, recusa com `SEI_TIPO_INDEFINIDO` em vez de escolher às cegas.
   */
  tipoDocumentoId?: string;
}

export type AoProgredir = (fracao: number) => void;

export interface PonteSei {
  /** Ha uma aba do SEI conversando com esta pagina agora? */
  disponivel(): boolean;
  /** Avisa quando a disponibilidade muda, para a interface se ajustar. */
  aoMudar(ouvinte: (disponivel: boolean) => void): () => void;

  contexto(): Promise<ContextoSei | null>;
  /** Limites REAIS desta instalacao. Nulo quando nao foi possivel apurar. */
  parametrosUpload(): Promise<LimitesProtocolo | null>;
  listarDocumentos(): Promise<DocumentoSei[]>;
  obterPdf(id: string, aoProgredir?: AoProgredir): Promise<{ nome: string; bytes: Uint8Array }>;
  enviarAoProcesso(saida: SaidaParaSei, aoProgredir?: AoProgredir): Promise<{ id: string }>;
}

/** Erro das operacoes de ponte, com codigo que a interface sabe traduzir. */
export class ErroPonte extends Error {
  constructor(
    readonly codigo:
      | "SEI_INDISPONIVEL"
      | "SEI_SEM_PROCESSO"
      | "SEI_SEM_PERMISSAO"
      | "SEI_SESSAO_EXPIRADA"
      | "SEI_ENVIO_RECUSADO"
      | "SEI_TEMPO_ESGOTADO"
      // Falhas ao TRAZER um documento. Antes reusavam SEI_SEM_PERMISSAO, cuja
      // mensagem fala em INCLUIR documento -- e mandava o usuário conferir se o
      // processo estava aberto na unidade dele, o que nada tinha a ver com o
      // problema.
      | "SEI_DOCUMENTO_AUSENTE"
      | "SEI_DOCUMENTO_NATO"
      | "SEI_SEM_LINK"
      // O nome do arquivo não diz o tipo e não há tipo padrão nem "Anexo".
      // Vem com `tipos`, para a interface perguntar. Nada foi enviado.
      | "SEI_TIPO_INDEFINIDO"
      // O usuário desistiu na escolha do tipo. Nada foi enviado.
      | "SEI_ENVIO_CANCELADO",
    readonly detalhe?: string,
    /** Com `SEI_TIPO_INDEFINIDO`: os tipos que a tela do SEI ofereceu. */
    readonly tipos?: TipoDocumentoSei[],
  ) {
    super(codigo);
    this.name = "ErroPonte";
  }
}

/**
 * A ponte que nao faz nada. E o padrao: a pagina comeca com ela e so troca se
 * uma aba do SEI se apresentar.
 */
export const PONTE_AUSENTE: PonteSei = {
  disponivel: () => false,
  aoMudar: () => () => {},
  contexto: async () => null,
  parametrosUpload: async () => null,
  listarDocumentos: async () => [],
  obterPdf: async () => {
    throw new ErroPonte("SEI_INDISPONIVEL");
  },
  enviarAoProcesso: async () => {
    throw new ErroPonte("SEI_INDISPONIVEL");
  },
};
