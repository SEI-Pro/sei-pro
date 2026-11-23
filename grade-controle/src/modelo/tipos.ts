/**
 * Modelo da grade: dados puros extraídos da tela nativa. Nada aqui toca o DOM.
 * A grade só LÊ este modelo; quem muda o SEI são as ações (`acoes/`).
 */
import type { DataISO } from '../../../sei-comum/src/datas/dias';
import type { PrazoProcesso } from '../../../prazos/src/modelo/tipos';

export type Grupo = 'recebidos' | 'gerados';

export interface MarcadorLinha {
  nome: string;
  /** Do nome do SVG do ícone (`marcador_azul_marinho.svg` -> `azul_marinho`). */
  cor: string;
  texto: string;
  /** Instante (ms) em que o marcador foi atribuído, quando informado no HTML/tooltip. */
  dataHora?: number;
}

export interface AnotacaoLinha {
  texto: string;
  autor: string;
  prioridade: boolean;
}

export type SituacaoRetorno = 'programado' | 'aguardando';

export interface RetornoLinha {
  tipo: SituacaoRetorno;
  /** Texto do SEI, como está no tooltip. */
  descricao: string;
  atrasado: boolean;
}

export interface Processo {
  /** `id_procedimento` do SEI. */
  id: string;
  protocolo: string;
  grupo: Grupo;
  tipo: string;
  especificacao: string;
  sigiloso: boolean;
  /** Ainda não visualizado nesta unidade (classe `processoNaoVisualizado`). */
  naoVisualizado: boolean;
  /** Sigla e nome de quem recebeu a atribuição. */
  atribuicao?: { sigla: string; nome: string };
  /** Endereço (relativo ao SEI, assinado) que abre o processo. */
  link?: string;
  marcadores: MarcadorLinha[];
  anotacao?: AnotacaoLinha;
  prazo?: PrazoProcesso;
  retornos: RetornoLinha[];
  acompanhamentoEspecial: boolean;
  /** Grupo do acompanhamento especial, quando o icone da linha o informa. */
  acompanhamentoGrupo?: string;
  /** O SEI marca no tooltip do link: "(URGENTE)" e "(TRANCADO)". */
  urgente?: boolean;
  trancado?: boolean;
  documentoNovo: boolean;
  /** Número da página do SEI (0 = a que o usuário está vendo). */
  pagina: number;
  /** A linha existe na tabela nativa da tela: só então há checkbox para espelhar. */
  naPaginaAtual: boolean;
  /** Instante (ms) em que o SEI Pro viu o processo pela primeira vez nesta unidade. */
  vistoEm?: number;
  /** Da coluna "Última Mov." da visão detalhada do SEI (só existe nela). */
  ultimaMov?: DataISO;
  prioridade?: string;
  interessados?: string;
  observacao?: string;
}

/** O par que o SEI valida em toda acao em lote: os ids da pagina e o hash que so o servidor sabe gerar. */
export interface SelecaoDaPagina {
  itens: string;
  hash: string;
}

export interface LeituraTabela {
  /** Pares `hdn<Grupo>Itens` / `hdn<Grupo>ItensHash` desta pagina, por grupo. */
  selecoes: Record<Grupo | 'detalhado', SelecaoDaPagina>;
  processos: Processo[];
  /** Total que o SEI informa no `caption` ("212 registros"), por grupo. */
  totais: Record<Grupo, number>;
  /** Linhas por página (do `caption` "1 a 100"), 0 se desconhecido. */
  porPagina: Record<Grupo, number>;
  visao: 'resumida' | 'detalhada';
}

export const COLUNAS = ['processo', 'especificacao', 'tipo', 'responsavel', 'marcadores', 'prazo', 'anotacao', 'caixa', 'parado', 'sinais'] as const;
export type Coluna = (typeof COLUNAS)[number];

export const ROTULO_COLUNA: Record<Coluna, string> = {
  processo: 'Processo',
  tipo: 'Tipo',
  especificacao: 'Especificação',
  responsavel: 'Responsável',
  marcadores: 'Marcadores',
  prazo: 'Prazo',
  anotacao: 'Anotação',
  caixa: 'Na caixa',
  parado: 'Parado há',
  sinais: 'Sinais',
};

export type CampoOrdem = 'protocolo' | 'tipo' | 'responsavel' | 'marcador' | 'prazo' | 'caixa' | 'parado' | 'novo';
export interface CriterioOrdem {
  campo: CampoOrdem;
  decrescente: boolean;
}

export type AgruparPor =
  | 'nenhum'
  | 'responsavel'
  | 'tipo'
  | 'marcador'
  | 'prazo'
  | 'situacao'
  | 'grupo'
  | 'anotacao'
  | 'acompanhamento'
  | 'retorno'
  | 'caixa'
  | 'autuacao'
  | 'recebimento'
  | 'envio'
  | 'unidadeEnvio';

export type ModoVisao = 'tabela' | 'quadro';
export type Densidade = 'compacta' | 'confortavel';
export type ColunasQuadro = 'marcador' | 'responsavel' | 'prazo' | 'tipo';

export interface ConfigQuadro {
  colunas: ColunasQuadro;
  /** Limite de cartões por coluna (0 = sem limite). */
  limite: number;
  raiasPorResponsavel: boolean;
  /** Ordem manual das colunas (chaves, ex.: ['m:Urgente', 'sem']), salva entre acessos. */
  ordemColunas?: string[];
  /** Colunas recolhidas (chaves), salvas entre acessos. */
  colunasRecolhidas?: string[];
  /** Largura das colunas/cartões em pixels (200 a 500; padrão 280). */
  larguraColuna?: number;
}

export interface Visao {
  /** Vazio na visão corrente ainda não salva. */
  id: string;
  /** Versao do conjunto de colunas (2 = com Especificacao). */
  colv?: number;
  nome: string;
  busca: string;
  ordem: CriterioOrdem[];
  agrupar: AgruparPor;
  modo: ModoVisao;
  colunas: Coluna[];
  densidade: Densidade;
  quadro: ConfigQuadro;
}
