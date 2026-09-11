/**
 * Mensagens de erro da ponte com o SEI.
 *
 * Ficam separadas porque as ferramentas que NÃO usam a moldura comum (Tarjar,
 * OCR e Conferir PDF/A) precisam das mesmas palavras. Duplicá-las garantiria
 * que uma versão envelhecesse em silêncio.
 *
 * Toda mensagem diz o que fazer, e as que podem custar trabalho lembram do
 * caminho de saída: baixar o arquivo antes de perder o que já foi feito.
 */

export function mensagemDaPonte(e: unknown): string {
  const codigo = (e as { codigo?: string })?.codigo;
  switch (codigo) {
    case "SEI_INDISPONIVEL":
      return "A aba do SEI não está mais respondendo. Abra as Ferramentas de PDF a partir do SEI para usar esta opção.";
    case "SEI_SEM_PROCESSO":
      return "Abra um processo no SEI antes de usar esta opção.";
    case "SEI_SEM_PERMISSAO":
      return "Não foi possível incluir documento neste processo. O processo está aberto na sua unidade?";
    case "SEI_SESSAO_EXPIRADA":
      return "A sessão do SEI expirou. Entre de novo no SEI e repita. O arquivo continua aqui: use Baixar para não perder o trabalho.";
    case "SEI_ENVIO_RECUSADO":
      return "O SEI recusou o envio. Confira o tamanho e a extensão aceitos pelo seu órgão.";
    case "SEI_DOCUMENTO_AUSENTE":
      return "Este documento não está mais na árvore do processo. Recarregue a página do SEI e tente de novo.";
    case "SEI_DOCUMENTO_NATO":
      return "Este é um documento criado dentro do SEI, não um arquivo anexado — não há PDF para trazer. Para trabalhar o conteúdo dele, gere o PDF pelo próprio SEI e depois traga o arquivo.";
    case "SEI_SEM_LINK":
      return "O SEI não ofereceu link de download para este documento. Isso costuma acontecer com documento cancelado ou com acesso restrito ao seu perfil.";
    case "SEI_TEMPO_ESGOTADO":
      return "O SEI demorou demais para responder. Use Baixar para não perder o trabalho e tente de novo.";
    default:
      return "Não foi possível falar com o SEI. Use Baixar para não perder o trabalho.";
  }
}
