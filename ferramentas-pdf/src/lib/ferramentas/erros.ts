/**
 * Erros das ferramentas de PDF: código estável + texto ao usuário.
 *
 * REGRA DE TELEMETRIA: só o `codigo` pode ser enviado ao GA4 ou ao Sentry.
 * Nome de arquivo, conteúdo, número de processo e tamanho exato ficam nesta
 * aba. A página promete que o documento não sai do computador, e um beacon
 * com o nome do arquivo torna essa promessa falsa e auditável em segundos.
 */

import type { CodigoErroFerramenta } from "@/types/ferramentas";

export interface ContextoErro {
  /** Nome do arquivo, usado só na mensagem exibida na tela. */
  nome?: string;
  /** Limite de tamanho, já formatado (ex.: "10 MB"). */
  limite?: string;
  /** Menor tamanho alcançável, já formatado. */
  minimo?: string;
  /** Quantidade sugerida de partes. */
  partes?: number;
  /** Página onde o problema apareceu, 1-based. Só para a mensagem na tela. */
  pagina?: number;
}

const MENSAGENS: Record<CodigoErroFerramenta, (c: ContextoErro) => string> = {
  PDF_PROTEGIDO: (c) =>
    `O arquivo "${c.nome ?? "selecionado"}" está protegido por senha. Informe a senha para continuar. A senha é utilizada apenas neste navegador e não é enviada a lugar algum.`,
  SENHA_INCORRETA: () =>
    "A senha informada não confere. Verifique e tente novamente.",
  ARQUIVO_CORROMPIDO: (c) =>
    `Não foi possível ler "${c.nome ?? "o arquivo"}". O arquivo pode estar corrompido ou incompleto. Recomendamos abri-lo em um leitor de PDF e salvá-lo novamente.`,
  TIPO_NAO_SUPORTADO: (c) =>
    `Não foi possível abrir "${c.nome ?? "o arquivo"}". Esta ferramenta aceita PDF. Documentos do Word e planilhas precisam ser exportados como PDF antes.`,
  FORMULARIO_XFA: () =>
    "Este documento utiliza formulários XFA, formato que apenas o Adobe Acrobat lê integralmente. É possível juntar e reordenar as páginas, porém os campos do formulário não serão preservados. Recomendamos imprimir o documento em PDF pelo Acrobat antes de prosseguir.",
  RESTRICOES_DE_EDICAO: () =>
    "Este documento possui restrições de edição definidas pelo autor. Prosseguir remove essas restrições no arquivo gerado. Confirme que possui autorização para alterá-lo.",
  MEMORIA_INSUFICIENTE: () =>
    "Não foi possível concluir: os arquivos selecionados são grandes demais para a memória disponível nesta aba. Junte-os em duas etapas, ou feche outras abas e tente de novo. Como todo o trabalho acontece no seu computador, o limite aqui é a memória da máquina, não uma regra nossa.",
  ARQUIVO_GRANDE_IOS: () =>
    "Arquivos deste tamanho costumam interromper o navegador em iPhone e iPad. Recomendamos utilizar um computador para este documento.",
  SEM_GANHO: () =>
    "Este documento já está otimizado: não foi possível reduzir seu tamanho sem perda de qualidade. O arquivo original foi mantido.",
  PDF_ASSINADO: () =>
    "Este documento possui assinatura digital. Comprimir ou dividir invalida a assinatura. Recomendamos preparar o arquivo antes de assiná-lo.",
  NAVEGADOR_SEM_SUPORTE: () =>
    "Seu navegador não oferece os recursos necessários para esta ferramenta. Atualize para uma versão recente do Chrome, Firefox, Safari ou Edge.",
  REAMOSTRAGEM_INDISPONIVEL: () =>
    "A reamostragem de imagens não é suportada neste navegador. A compressão estrutural continua disponível.",
  NENHUM_ARQUIVO: () => "Selecione ao menos dois arquivos para juntar.",
  UM_ARQUIVO_SO: () =>
    "Com um único arquivo não há o que juntar. Adicione ao menos mais um, ou use a ferramenta de organizar páginas se o que você precisa é reordenar as páginas deste PDF.",
  TARJA_SEM_SELECAO: () =>
    "Marque ao menos uma área antes de gerar o documento tarjado.",
  TARJA_NAO_VERIFICADA: () =>
    "A conferência automática não confirmou que o conteúdo marcado saiu do arquivo, então o documento NÃO foi gerado. Isto é proposital: entregar um arquivo que talvez ainda contenha o dado seria pior do que não entregar nada. Tente reduzir a seleção, ou marque a página inteira.",
  TARJA_GEOMETRIA_INCONSISTENTE: () =>
    "A conferência interna encontrou divergência entre a área marcada e a área efetivamente coberta, e a operação foi interrompida antes de gerar o arquivo. Recarregue a página e tente novamente.",
  RASTERIZACAO_INDISPONIVEL: () =>
    "Seu navegador não oferece os recursos de imagem que o tarjamento exige. Atualize para uma versão recente do Chrome, Firefox, Safari ou Edge. No Safari, é preciso a versão 16.4 ou superior.",
  PAGINA_GRANDE_DEMAIS: () =>
    "Uma das páginas marcadas é grande demais para ser processada nesta aba. Tente em um computador, ou reduza a resolução na opção de qualidade.",
  FALHA_INESPERADA: () =>
    "Não foi possível concluir a operação. Recarregue a página e tente novamente. Nenhum arquivo seu foi enviado a lugar algum.",
};

/** Traduz um código de erro para o texto exibido ao usuário. */
export function mensagemDeErro(
  codigo: CodigoErroFerramenta,
  contexto: ContextoErro = {},
): string {
  return MENSAGENS[codigo](contexto);
}

/**
 * Erro de domínio das ferramentas. Carrega um código estável, que é a única
 * parte que pode ser reportada a serviços externos.
 */
export class ErroFerramenta extends Error {
  readonly codigo: CodigoErroFerramenta;
  readonly contexto: ContextoErro;

  constructor(codigo: CodigoErroFerramenta, contexto: ContextoErro = {}) {
    super(mensagemDeErro(codigo, contexto));
    this.name = "ErroFerramenta";
    this.codigo = codigo;
    this.contexto = contexto;
  }
}

/** Converte qualquer exceção em um `ErroFerramenta` com código conhecido. */
export function comoErroFerramenta(
  e: unknown,
  padrao: CodigoErroFerramenta = "FALHA_INESPERADA",
  contexto: ContextoErro = {},
): ErroFerramenta {
  if (e instanceof ErroFerramenta) return e;
  // RangeError de alocação é o sintoma típico de estouro de memória da aba.
  if (e instanceof RangeError) {
    return new ErroFerramenta("MEMORIA_INSUFICIENTE", contexto);
  }
  return new ErroFerramenta(padrao, contexto);
}
