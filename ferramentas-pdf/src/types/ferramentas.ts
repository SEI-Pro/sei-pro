/**
 * Tipos compartilhados das ferramentas gratuitas de PDF.
 *
 * Esta camada é deliberadamente livre de React: os módulos de
 * `src/lib/ferramentas/**` importam daqui e podem ser exercitados por um
 * script Node em `/tests/`, que é a única forma de verificar automaticamente
 * a parte capaz de corromper o documento de um usuário.
 */

/** Códigos estáveis de erro. O texto ao usuário vive em `lib/ferramentas/erros.ts`. */
export type CodigoErroFerramenta =
  | "PDF_PROTEGIDO"
  | "SENHA_INCORRETA"
  | "ARQUIVO_CORROMPIDO"
  | "TIPO_NAO_SUPORTADO"
  | "FORMULARIO_XFA"
  | "RESTRICOES_DE_EDICAO"
  | "MEMORIA_INSUFICIENTE"
  | "ARQUIVO_GRANDE_IOS"
  | "SEM_GANHO"
  | "PDF_ASSINADO"
  | "NAVEGADOR_SEM_SUPORTE"
  | "REAMOSTRAGEM_INDISPONIVEL"
  | "NENHUM_ARQUIVO"
  | "UM_ARQUIVO_SO"
  | "TARJA_SEM_SELECAO"
  | "TARJA_NAO_VERIFICADA"
  | "TARJA_GEOMETRIA_INCONSISTENTE"
  | "RASTERIZACAO_INDISPONIVEL"
  | "PAGINA_GRANDE_DEMAIS"
  | "FALHA_INESPERADA";

/** Resultado da inspeção de um PDF, antes de qualquer operação sobre ele. */
export interface DiagnosticoPdf {
  /** Quantidade de páginas. Zero quando o documento não pôde ser aberto. */
  paginas: number;
  /** O documento exige senha de usuário para ser aberto. */
  precisaSenha: boolean;
  /** Traz formulário XFA (só o Adobe Acrobat lê integralmente). */
  temXfa: boolean;
  /** Traz assinatura digital, que qualquer reescrita invalida. */
  temAssinatura: boolean;
  /** Traz restrições de edição definidas pelo autor (senha de proprietário). */
  temRestricoes: boolean;
}

/** Item da lista de arquivos escolhidos pelo usuário. */
export interface ArquivoEntrada {
  /** Chave estável de lista. Nunca usar o índice: a lista é reordenável. */
  id: string;
  nome: string;
  tamanho: number;
  bytes: Uint8Array;
  diagnostico?: DiagnosticoPdf;
  /** Preenchido quando o arquivo foi recusado na leitura. */
  erro?: CodigoErroFerramenta;
  /** Senha informada pelo usuário. Vive só nesta aba e não é transmitida. */
  senha?: string;
}

/** Progresso de uma operação longa. `total` pode crescer durante a execução. */
export type ProgressoCallback = (feito: number, total: number) => void;

/** Saída de uma operação: os bytes e o nome sugerido do arquivo. */
export interface ResultadoOperacao {
  bytes: Uint8Array;
  nomeArquivo: string;
  /** Preenchido quando a operação produz mais de um arquivo (empacotado em ZIP). */
  quantidadeArquivos?: number;
}
