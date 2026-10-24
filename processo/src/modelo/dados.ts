/** O que cada fatia da loja guarda. Tipos só; os valores vêm das leituras do núcleo (`pagina/leituras.ts`). */
import type { AcompanhamentoProcesso, AnotacaoProcesso, AtribuicaoDaPagina, MarcadorDoPainel } from "@nucleo/dominio/painelProcesso";
import type { MetadadosProcesso } from "@nucleo/dominio/processo";

/** O painel não tem como ler: a barra do processo não oferece a ação (processo fechado na unidade) ou as consultas extras estão desligadas. */
export type Leitura<T> = { disponivel: true; valor: T } | { disponivel: false; motivo: "acao" | "consultas" };

export type DadoProcesso = Leitura<MetadadosProcesso>;
export type DadoAnotacao = Leitura<AnotacaoProcesso | null>;
export type DadoAcompanhamento = Leitura<AcompanhamentoProcesso | null>;

export interface DadoMarcador {
  itens: MarcadorDoPainel[];
  /** Há como adicionar, alterar e remover (a barra oferece "Gerenciar Marcador"). */
  editavel: boolean;
}

export type DadoAtribuicao = AtribuicaoDaPagina & { editavel: boolean };

export interface DadoBlocoInterno {
  /** Descrição do andamento "Processo inserido no bloco interno ..."; null = nenhum bloco localizado. */
  descricao: string | null;
  /** Quando o histórico completo foi coletado (ms). Vale por 30 minutos. */
  coletadoEm: number;
}

/** O histórico completo vale por 30 minutos depois da coleta (spec 8.2). */
export const VALIDADE_HISTORICO_MS = 30 * 60 * 1000;

export const historicoVale = (coletadoEm: number, agora: number): boolean => coletadoEm > 0 && agora - coletadoEm < VALIDADE_HISTORICO_MS;
