/**
 * O texto do cartão de sugestão.
 *
 * Fica separado da tela porque é uma promessa, não uma string: o cartão fala de
 * ESTRUTURA — que documento existe, qual não existe, em que ordem — e SEMPRE no
 * condicional.
 *
 * Duas coisas que ele não pode fazer, e que o teste guarda:
 *
 * 1. afirmar qualquer coisa sobre o CONTEÚDO dos documentos. A avaliação nem
 *    leu o conteúdo (é local, sobre os títulos da árvore). Se a etapa depende
 *    do que a Nota Técnica concluiu, isso só é conferido DEPOIS do clique, ao
 *    preparar a minuta — e o agente avisa quando o conteúdo não confirma;
 * 2. mandar o servidor público fazer algo. Quem decide o rito é a unidade; o
 *    SEI Pro mostra o que o mapa dela prevê.
 */

export interface DadosDoCartao {
  /** Nome do fluxo. */
  fluxo: string;
  /** Nome da etapa que falta. */
  etapa: string;
  etapaAnterior: string;
  anterior: { numero: string; titulo: string; assinado: boolean };
  cumpridas: Array<{ etapa: string; numero: string; titulo: string }>;
}

const comNumero = (d: { titulo: string; numero: string }): string => (d.numero ? `${d.titulo} (${d.numero})` : d.titulo);

export function textoDaSugestao(s: DadosDoCartao): string {
  const selo = s.anterior.assinado ? "assinado" : "ainda sem assinatura";
  return `Nestes autos, o último documento do rito é ${comNumero(s.anterior)}, ${selo}. O fluxo "${s.fluxo}" prevê ${s.etapa} depois dele, e não há ${s.etapa} na árvore — talvez seja a próxima providência.`;
}

/** "Ver detalhes": as etapas cumpridas, na ordem, e a que falta. */
export function detalhesDaSugestao(s: DadosDoCartao): string[] {
  return [
    ...s.cumpridas.map((c, i) => `${i + 1}. ${c.etapa}: ${comNumero(c)}`),
    `${s.cumpridas.length + 1}. ${s.etapa}: falta`,
  ];
}

/** O mesmo cartão, para a CAPA do processo (montado pelo content script). */
export interface CartaoDaCapa {
  titulo: string;
  texto: string;
  etapas: string[];
  acaoPrincipal: string;
  acaoIgnorar: string;
}

/**
 * Conteúdo do cartão da capa.
 *
 * O texto é LITERALMENTE o mesmo do cartão do painel: são duas telas, uma só
 * promessa. Duas redações divergiriam na primeira correção feita num lado só.
 *
 * O botão principal abre o Agente de IA em vez de prometer a minuta: escrever
 * documento é do agente, com o cartão de aprovação dele. A capa é a página do
 * SEI, e nada que nasce ali pode parecer uma ação do próprio SEI.
 */
export function cartaoDaCapa(s: DadosDoCartao): CartaoDaCapa {
  return {
    titulo: `Fluxo: ${s.fluxo}`,
    texto: textoDaSugestao(s),
    etapas: detalhesDaSugestao(s),
    acaoPrincipal: "Abrir o Agente de IA",
    acaoIgnorar: "Ignorar neste processo",
  };
}
