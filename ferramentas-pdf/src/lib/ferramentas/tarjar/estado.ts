/**
 * Estado da ferramenta de tarjamento.
 *
 * É um reducer PURO, sem React e sem DOM, pelo mesmo motivo que a camada
 * `lib/ferramentas` é: pode ser exercitado por script Node. E porque as
 * transições aqui são acopladas de um jeito que `useState` espalhado não
 * sustenta — aplicar invalida o resultado anterior, trocar de arquivo zera
 * marcações e histórico, desligar um tipo mexe em N marcações de uma vez. Com
 * seis estados independentes isso vira uma cascata de efeitos disparando uns
 * aos outros.
 *
 * AS COORDENADAS FICAM EM PONTOS DE PDF, nunca em pixels de tela. Zoom,
 * `devicePixelRatio`, redimensionar a janela e girar o tablet passam a não
 * tocar no estado: a conversão para porcentagem acontece só na hora de
 * desenhar. É o que elimina, por construção, a classe inteira de bugs de
 * "a tarja saiu quatro pontos à esquerda porque o usuário deu zoom antes de
 * clicar em aplicar".
 */

import type { Caixa, ViewBox } from "@/lib/ferramentas/tarjar/geometria";
import type { Confianca, Deteccao, TipoDado } from "@/lib/ferramentas/tarjar/deteccao";
import { TIPOS, TIPOS_PADRAO } from "@/lib/ferramentas/tarjar/deteccao";

export type Fase =
  | "vazio"
  | "abrindo"
  | "analisando"
  | "revisando"
  | "aplicando"
  | "erro";

export type OrigemMarcacao = "deteccao" | "selecao" | "retangulo";

export interface Marcacao {
  /** Chave estável de lista. Nunca o índice: a lista é filtrada e reordenada. */
  id: string;
  /** Página, 1-based. */
  pagina: number;
  /** Uma caixa por linha visual. Em PONTOS do espaço do usuário. */
  caixas: Caixa[];
  tipo: TipoDado | "manual";
  origem: OrigemMarcacao;
  /** Desligada continua existindo e continua visível, em traço vazado. */
  ativa: boolean;
  confianca: Confianca;
  /** SEMPRE mascarada. O valor íntegro nunca é exibido na interface. */
  amostra: string;
  /** Texto sob a tarja, quando conhecido. Alimenta os blocos █ e a conferência. */
  textoSuprimido?: string;
}

export interface DimensaoPagina {
  /** CropBox ∩ MediaBox em pontos, com a origem que a página realmente tem. */
  view: ViewBox;
  /** Múltiplo de 90. */
  giro: number;
  /** Dimensões da página COMO EXIBIDA, já com o giro aplicado. */
  larguraExibida: number;
  alturaExibida: number;
}

export interface ResumoResultado {
  nome: string;
  bytes: Uint8Array;
  paginasRasterizadas: number;
  paginasIntactas: number;
  bytesOriginais: number;
  bytesFinais: number;
  itensDescartados: number;
  /** Ocorrências que a conferência ainda achou no arquivo gerado. */
  restantes: number;
}

export interface EstadoTarjar {
  fase: Fase;
  nome: string | null;
  totalPaginas: number;
  dimensoes: DimensaoPagina[];
  marcacoes: Marcacao[];
  tiposLigados: TipoDado[];
  temAssinatura: boolean;
  /** Páginas em que `getTextContent` não devolveu nada: digitalização sem OCR. */
  paginasSemTexto: number[];
  progresso: { feito: number; total: number };
  erro: string | null;
  anuncio: string;
  resultado: ResumoResultado | null;
  /** Pilha de desfazer. Só as marcações — snapshot do estado inteiro vazaria memória. */
  historico: Marcacao[][];
}

export const ESTADO_INICIAL: EstadoTarjar = {
  fase: "vazio",
  nome: null,
  totalPaginas: 0,
  dimensoes: [],
  marcacoes: [],
  tiposLigados: TIPOS_PADRAO,
  temAssinatura: false,
  paginasSemTexto: [],
  progresso: { feito: 0, total: 0 },
  erro: null,
  anuncio: "",
  resultado: null,
  historico: [],
};

export type AcaoTarjar =
  | { tipo: "abrindo"; nome: string }
  | {
      tipo: "abriu";
      totalPaginas: number;
      dimensoes: DimensaoPagina[];
      temAssinatura: boolean;
    }
  | { tipo: "analisando"; feito: number; total: number }
  | { tipo: "analisou"; marcacoes: Marcacao[]; paginasSemTexto: number[] }
  | { tipo: "acrescentar"; marcacoes: Marcacao[] }
  | { tipo: "alternar"; id: string }
  | { tipo: "remover"; id: string }
  | { tipo: "alternarTipo"; alvo: TipoDado; ativa: boolean }
  | { tipo: "todas"; ativa: boolean }
  | { tipo: "desfazer" }
  | { tipo: "aplicando"; feito: number; total: number }
  | { tipo: "aplicou"; resultado: ResumoResultado }
  | { tipo: "erro"; mensagem: string }
  | { tipo: "limparResultado" }
  | { tipo: "recomecar" }
  | { tipo: "anunciar"; texto: string };

/** Tamanho da pilha de desfazer. */
const MAX_HISTORICO = 50;

function comHistorico(estado: EstadoTarjar, marcacoes: Marcacao[]): EstadoTarjar {
  return {
    ...estado,
    marcacoes,
    historico: [...estado.historico, estado.marcacoes].slice(-MAX_HISTORICO),
    // Qualquer mexida nas marcações invalida o arquivo já gerado. Deixá-lo
    // disponível faria o usuário baixar uma versão que não corresponde ao que
    // está vendo na tela.
    resultado: null,
  };
}

export function contarAtivas(marcacoes: Marcacao[]): number {
  return marcacoes.filter((m) => m.ativa).length;
}

export function rotuloDoTipo(tipo: TipoDado | "manual", plural = false): string {
  if (tipo === "manual") return plural ? "Áreas marcadas por você" : "Área marcada por você";
  const def = TIPOS[tipo];
  return plural ? def.rotuloPlural : def.rotulo;
}

export function reduzir(estado: EstadoTarjar, acao: AcaoTarjar): EstadoTarjar {
  switch (acao.tipo) {
    case "abrindo":
      return { ...ESTADO_INICIAL, fase: "abrindo", nome: acao.nome, tiposLigados: estado.tiposLigados };

    case "abriu":
      return {
        ...estado,
        fase: "analisando",
        totalPaginas: acao.totalPaginas,
        dimensoes: acao.dimensoes,
        temAssinatura: acao.temAssinatura,
        progresso: { feito: 0, total: acao.totalPaginas },
      };

    case "analisando":
      return { ...estado, progresso: { feito: acao.feito, total: acao.total } };

    case "analisou": {
      const quantos = acao.marcacoes.length;
      return {
        ...estado,
        fase: "revisando",
        marcacoes: acao.marcacoes,
        paginasSemTexto: acao.paginasSemTexto,
        historico: [],
        anuncio:
          quantos === 0
            ? "Análise concluída. Nenhum dado sensível foi reconhecido automaticamente. Selecione o texto ou desenhe sobre a área para marcar."
            : `Análise concluída. ${quantos} ${quantos === 1 ? "ocorrência encontrada" : "ocorrências encontradas"}.`,
      };
    }

    case "acrescentar": {
      if (acao.marcacoes.length === 0) return estado;
      const novo = comHistorico(estado, [...estado.marcacoes, ...acao.marcacoes]);
      return {
        ...novo,
        anuncio: `${acao.marcacoes.length} ${acao.marcacoes.length === 1 ? "área marcada" : "áreas marcadas"}. ${contarAtivas(novo.marcacoes)} no total.`,
      };
    }

    case "alternar": {
      const alvo = estado.marcacoes.find((m) => m.id === acao.id);
      if (!alvo) return estado;
      const marcacoes = estado.marcacoes.map((m) =>
        m.id === acao.id ? { ...m, ativa: !m.ativa } : m,
      );
      const novo = comHistorico(estado, marcacoes);
      return {
        ...novo,
        anuncio: `${rotuloDoTipo(alvo.tipo)} na página ${alvo.pagina} ${alvo.ativa ? "desmarcado" : "marcado"}. ${contarAtivas(marcacoes)} no total.`,
      };
    }

    case "remover": {
      const alvo = estado.marcacoes.find((m) => m.id === acao.id);
      if (!alvo) return estado;
      const marcacoes = estado.marcacoes.filter((m) => m.id !== acao.id);
      const novo = comHistorico(estado, marcacoes);
      return { ...novo, anuncio: `Marcação removida. ${contarAtivas(marcacoes)} no total.` };
    }

    case "alternarTipo": {
      const tiposLigados = acao.ativa
        ? [...new Set([...estado.tiposLigados, acao.alvo])]
        : estado.tiposLigados.filter((t) => t !== acao.alvo);
      const marcacoes = estado.marcacoes.map((m) =>
        m.tipo === acao.alvo ? { ...m, ativa: acao.ativa } : m,
      );
      const novo = comHistorico(estado, marcacoes);
      return {
        ...novo,
        tiposLigados,
        anuncio: `${rotuloDoTipo(acao.alvo, true)} ${acao.ativa ? "marcados" : "desmarcados"}. ${contarAtivas(marcacoes)} no total.`,
      };
    }

    case "todas": {
      const marcacoes = estado.marcacoes.map((m) => ({ ...m, ativa: acao.ativa }));
      const novo = comHistorico(estado, marcacoes);
      return {
        ...novo,
        anuncio: acao.ativa
          ? `Todas as ${marcacoes.length} áreas marcadas.`
          : "Todas as áreas desmarcadas.",
      };
    }

    case "desfazer": {
      if (estado.historico.length === 0) return estado;
      const anterior = estado.historico[estado.historico.length - 1];
      return {
        ...estado,
        marcacoes: anterior,
        historico: estado.historico.slice(0, -1),
        resultado: null,
        anuncio: `Desfeito. ${contarAtivas(anterior)} áreas marcadas.`,
      };
    }

    case "aplicando":
      return {
        ...estado,
        fase: "aplicando",
        erro: null,
        progresso: { feito: acao.feito, total: acao.total },
      };

    case "aplicou":
      return {
        ...estado,
        fase: "revisando",
        resultado: acao.resultado,
        anuncio:
          acao.resultado.restantes === 0
            ? "Documento tarjado e conferido. Nenhum dos padrões detectados permanece no arquivo gerado."
            : `Documento gerado, porém a conferência ainda encontrou ${acao.resultado.restantes} ocorrência(s). Revise antes de protocolar.`,
      };

    case "erro":
      return { ...estado, fase: estado.totalPaginas > 0 ? "revisando" : "erro", erro: acao.mensagem };

    case "limparResultado":
      return { ...estado, resultado: null, erro: null };

    case "recomecar":
      return { ...ESTADO_INICIAL, tiposLigados: estado.tiposLigados };

    case "anunciar":
      return { ...estado, anuncio: acao.texto };

    default: {
      const nunca: never = acao;
      throw new Error(`ação desconhecida: ${JSON.stringify(nunca)}`);
    }
  }
}

/** Converte uma detecção da camada pura em marcação da interface. */
export function marcacaoDeDeteccao(d: Deteccao, id: string): Marcacao {
  return {
    id,
    pagina: d.pagina,
    caixas: d.caixas,
    tipo: d.tipo,
    origem: "deteccao",
    ativa: true,
    confianca: d.confianca,
    amostra: d.amostra,
    textoSuprimido: d.bruto,
  };
}
