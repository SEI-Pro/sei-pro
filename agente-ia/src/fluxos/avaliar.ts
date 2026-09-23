/**
 * Fluxo × árvore do processo: em que etapa o processo está e o que falta.
 *
 * FUNÇÃO PURA, sem rede. Recebe o fluxo e a árvore JÁ LIDA e devolve a
 * posição. Roda no content script, sobre a árvore que já está na tela — não
 * existe requisição ao SEI por causa desta avaliação.
 *
 * A ordem da árvore é CRONOLÓGICA. É por isso que "veio depois" aqui é
 * POSIÇÃO, e não data: o percurso caminha por um ponteiro que só anda para a
 * frente, e um Despacho que já estava nos autos antes da Nota Técnica não
 * cumpre a etapa que o fluxo espera depois dela.
 *
 * O que esta camada NÃO faz: ler conteúdo de documento. A sugestão fala só de
 * estrutura ("a NT está assinada e não há Despacho posterior"). Se a etapa
 * depende do que o documento diz, isso é conferido depois do clique, ao
 * preparar a minuta.
 */

import { contem, foiIgnorada, normalizar, type Etapa, type Fluxo, type Ignorados } from "./modelo";

export interface DocumentoNaArvore {
  numero: string;
  titulo: string;
  assinado: boolean;
  /** Unidade geradora, como a árvore a mostra. */
  unidade?: string;
  cancelado?: boolean;
  externo?: boolean;
  nivel?: string;
}

export interface ProcessoNaTela {
  protocolo: string;
  tipo?: string;
  marcadores?: string[];
  /** Unidade em que o usuário está: é o que `daMinhaUnidade` compara. */
  unidade?: string;
  sigiloso?: boolean;
  /** Na ordem da árvore. */
  documentos: DocumentoNaArvore[];
}

export interface Cumprida {
  etapa: Etapa;
  documento: DocumentoNaArvore;
}

export interface Lacuna {
  etapa: Etapa;
  /** Documento que cumpriu a etapa anterior: é o "o que foi encontrado" do cartão. */
  anterior: DocumentoNaArvore;
  etapaAnterior: Etapa;
}

export interface Avaliacao {
  aplica: boolean;
  cumpridas: Cumprida[];
  /** Última etapa cumprida. */
  etapaAtual: Etapa | null;
  lacuna: Lacuna | null;
}

const VAZIA: Avaliacao = { aplica: false, cumpridas: [], etapaAtual: null, lacuna: null };

/** Algum item da lista aparece no texto (sem acento, sem caixa). Lista vazia = sem exigência. */
const algumContem = (lista: string[] | undefined, texto: string): boolean => !lista?.length || lista.some((t) => contem(texto, t));

export function aplicaAoProcesso(fluxo: Fluxo, processo: ProcessoNaTela): boolean {
  const { tipoProcessoContem, marcador, unidade } = fluxo.aplicaSe;
  if (!algumContem(tipoProcessoContem, processo.tipo ?? "")) return false;
  if (marcador?.length && !marcador.some((m) => (processo.marcadores ?? []).some((x) => contem(x, m)))) return false;
  // Unidade é sigla: compara inteira, não por pedaço. "GESP" não é "GESP-TESTE".
  if (unidade?.length && !unidade.some((u) => normalizar(u) === normalizar(processo.unidade ?? ""))) return false;
  return true;
}

/** O documento casa o que a etapa descreve. */
function casa(etapa: Etapa, d: DocumentoNaArvore, processo: ProcessoNaTela): boolean {
  // Documento cancelado foi riscado dos autos pelo SEI: não cumpre etapa nenhuma.
  if (d.cancelado) return false;
  if (!etapa.documento.tituloContem.some((t) => contem(d.titulo, t))) return false;
  if (etapa.documento.assinado !== undefined && d.assinado !== etapa.documento.assinado) return false;
  if (etapa.documento.daMinhaUnidade && normalizar(d.unidade ?? "") !== normalizar(processo.unidade ?? "")) return false;
  return true;
}

/** Índice do próximo documento que cumpre a etapa, a partir de `desde`. */
function procurar(etapa: Etapa, processo: ProcessoNaTela, desde: number): number {
  for (let i = desde; i < processo.documentos.length; i += 1) {
    if (casa(etapa, processo.documentos[i], processo)) return i;
  }
  return -1;
}

/**
 * Onde o processo está no fluxo.
 *
 * A lacuna é a primeira etapa OBRIGATÓRIA não cumprida cuja anterior está
 * cumprida. Sem etapa anterior cumprida não há lacuna: o cartão mostra "o que
 * foi encontrado" antes de dizer o que falta, e um processo que nem começou o
 * rito não rende sugestão nenhuma — só ruído.
 */
export function avaliarFluxo(fluxo: Fluxo, processo: ProcessoNaTela): Avaliacao {
  if (!aplicaAoProcesso(fluxo, processo)) return VAZIA;

  const cumpridas: Cumprida[] = [];
  const percorridas = new Set<string>();
  let desde = 0;
  let anterior: Cumprida | null = null;
  let lacuna: Lacuna | null = null;
  let atual: Etapa | undefined = fluxo.etapas[0];

  while (atual) {
    // Um desvio que volta para uma etapa já percorrida seria um laço infinito.
    if (percorridas.has(atual.id)) break;
    percorridas.add(atual.id);

    // Desvio: quem decide é o documento que cumpriu a etapa ANTERIOR.
    if (atual.condicao && anterior && contem(anterior.documento.titulo, atual.condicao.seDocumentoContem)) {
      atual = fluxo.etapas.find((e) => e.id === atual!.condicao!.entaoIrPara);
      continue;
    }

    const i = procurar(atual, processo, desde);
    if (i >= 0) {
      anterior = { etapa: atual, documento: processo.documentos[i] };
      cumpridas.push(anterior);
      desde = i + 1;
    } else if (atual.obrigatoria) {
      if (anterior) lacuna = { etapa: atual, anterior: anterior.documento, etapaAnterior: anterior.etapa };
      break;
    }
    atual = fluxo.etapas[fluxo.etapas.indexOf(atual) + 1];
  }

  return { aplica: true, cumpridas, etapaAtual: cumpridas.at(-1)?.etapa ?? null, lacuna };
}

export interface Sugestao {
  fluxo: Fluxo;
  avaliacao: Avaliacao;
  lacuna: Lacuna;
}

/**
 * A sugestão do processo aberto, ou nada.
 *
 * Uma por processo: o primeiro fluxo ativo que se aplica é o que vale, mesmo
 * que ele não tenha lacuna. Ficar procurando no segundo fluxo uma sugestão que
 * o primeiro não deu é o caminho curto para o ruído.
 */
export function escolherSugestao(fluxos: Fluxo[], processo: ProcessoNaTela, ignorados: Ignorados): Sugestao | null {
  // Processo sigiloso está fora de todo o agente, e daqui também.
  if (processo.sigiloso) return null;
  const fluxo = fluxos.find((f) => f.ativo && aplicaAoProcesso(f, processo));
  if (!fluxo) return null;
  const avaliacao = avaliarFluxo(fluxo, processo);
  if (!avaliacao.lacuna) return null;
  if (foiIgnorada(ignorados, processo.protocolo, avaliacao.lacuna.etapa.id)) return null;
  return { fluxo, avaliacao, lacuna: avaliacao.lacuna };
}
