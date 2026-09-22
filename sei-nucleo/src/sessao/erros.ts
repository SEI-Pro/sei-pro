/**
 * Erros tipados do núcleo.
 *
 * Quem chama decide o que fazer pelo `codigo`, nunca pelo texto da mensagem.
 * O texto é para gente (e para o modelo de IA): diz o que houve e o que fazer.
 */

export type CodigoErro =
  /** A sessão do SEI acabou (login, "Link sem assinatura", "Hash inválido"). */
  | "SEI_SESSAO_EXPIRADA"
  /** O SEI recusou os dados (`#txaInfraValidacao`). `detalhe` traz a mensagem dele. */
  | "SEI_VALIDACAO"
  /** Página de exceção do SEI (`#divInfraExcecao`). */
  | "SEI_EXCECAO"
  /** O usuário não tem a ação disponível (ícone ausente na barra, processo em outra unidade). */
  | "SEI_ACAO_INDISPONIVEL"
  | "SEI_NAO_ENCONTRADO"
  /** Processo ou documento sigiloso: o núcleo se recusa a operar. */
  | "SEI_SIGILOSO"
  /** Conteúdo restrito sem consentimento do usuário para envio ao modelo. */
  | "CONTEUDO_RESTRITO_NAO_AUTORIZADO"
  /** A resposta não trouxe a prova de sucesso esperada. */
  | "SEI_RESPOSTA_INESPERADA"
  /** A tela não tem a forma esperada nesta versão do SEI. */
  | "SEI_VERSAO_NAO_SUPORTADA"
  | "SEI_REDE"
  | "ARGUMENTO_INVALIDO"
  | "CANCELADO";

export class ErroSei extends Error {
  readonly codigo: CodigoErro;
  readonly detalhe?: string;

  constructor(codigo: CodigoErro, mensagem: string, detalhe?: string) {
    super(mensagem);
    this.name = "ErroSei";
    this.codigo = codigo;
    this.detalhe = detalhe;
  }

  /** Forma serializável, para atravessar a ponte. */
  paraJSON(): { codigo: CodigoErro; mensagem: string; detalhe?: string } {
    return { codigo: this.codigo, mensagem: this.message, detalhe: this.detalhe };
  }
}

export function ehErroSei(e: unknown): e is ErroSei {
  return e instanceof ErroSei;
}

/** Converte qualquer falha em `ErroSei`, preservando o que já era. */
export function comoErroSei(e: unknown): ErroSei {
  if (e instanceof ErroSei) return e;
  if (e instanceof DOMException && e.name === "AbortError") {
    return new ErroSei("CANCELADO", "Opera\u00E7\u00E3o cancelada.");
  }
  const msg = e instanceof Error ? e.message : String(e);
  return new ErroSei("SEI_REDE", `Falha ao falar com o SEI: ${msg}`);
}
