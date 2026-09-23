/**
 * Tipos do motor. As mensagens seguem o formato de chat da OpenAI, que é o
 * que o OpenRouter aceita para qualquer modelo (ele traduz para Anthropic,
 * Gemini etc.). Manter o formato do provedor evita uma camada de conversão
 * que só existiria para ser mantida.
 */

import type { Esquema } from "./esquema";

export interface ChamadaTool {
  id: string;
  type: "function";
  function: { name: string; arguments: string };
}

export type Mensagem =
  | { role: "system"; content: string }
  | { role: "user"; content: string }
  | { role: "assistant"; content: string | null; tool_calls?: ChamadaTool[] }
  | { role: "tool"; tool_call_id: string; content: string };

export interface Uso {
  entrada: number;
  saida: number;
  /** Custo em dólares informado pelo OpenRouter (`usage.cost`). */
  custo: number;
  /** Tokens de entrada que vieram do cache do provedor (não foram reprocessados). */
  cache?: number;
}

export interface RespostaLLM {
  texto: string;
  chamadas: ChamadaTool[];
  fim: "stop" | "tool_calls" | "length" | "error" | string;
  uso?: Uso;
}

export interface PedidoLLM {
  mensagens: Mensagem[];
  tools: Array<{ type: "function"; function: { name: string; description: string; parameters: Esquema } }>;
}

export interface Provedor {
  readonly modelo: string;
  conversar(pedido: PedidoLLM, sinal: AbortSignal, aoTexto: (delta: string) => void): Promise<RespostaLLM>;
}

/**
 * O que a tool faz ao mundo. Decide a política de aprovação (ver `motor.ts`):
 * - `leitura`: executa direto;
 * - `escrita`: só dentro de plano aprovado;
 * - `irreversivel`: plano + confirmação explícita ("entendo que não dá para desfazer");
 * - `assinatura`: plano + cargo e senha digitados pelo usuário, fora do modelo;
 * - `interna`: do próprio motor (tarefas, perguntar, plano), sem tocar no SEI.
 */
export type Efeito = "leitura" | "escrita" | "irreversivel" | "assinatura" | "interna";

/** Prévia de uma escrita, do jeito que o painel mostra ao usuário. */
export interface PreviaItem {
  alvo: string;
  mudancas: Array<{ campo: string; antes: string; depois: string }>;
  resumo: string;
  /** Erro ao calcular a prévia deste item (ex.: processo fechado). */
  erro?: string;
  /** Assinatura: cargos/funções que o SEI oferece ao usuário para este documento. */
  cargos?: string[];
}

export interface PassoPlano {
  tool: string;
  rotulo: string;
  efeito: Efeito;
  args: Record<string, unknown>;
  previa: PreviaItem[];
  /** Tem referência a passo anterior: a prévia só é exata na execução. */
  dependente: boolean;
}

export interface PlanoPrevisto {
  objetivo: string;
  passos: PassoPlano[];
  /** Avisos das regras da unidade, mostrados no cartão de aprovação. */
  avisos?: string[];
}

export interface DecisaoPlano {
  aprovado: boolean;
  /** Aprovar só até o passo N (1-based). */
  ate?: number;
  motivo?: string;
  /** Para passos de assinatura: credenciais digitadas no painel. Nunca vão ao modelo. */
  assinatura?: { cargo: string; senha: string };
}

export interface Tarefa {
  titulo: string;
  estado: "pendente" | "fazendo" | "feita";
}

/** O que o motor pede à interface. O painel implementa; os testes simulam. */
export interface InterfaceMotor {
  texto(delta: string): void;
  fimDaResposta(): void;
  toolIniciada(id: string, nome: string, rotulo: string): void;
  toolTerminada(id: string, ok: boolean, resumo: string): void;
  /** Uma escrita entrou no SEI: o painel guarda para poder desfazer. */
  escritaFeita?(id: string, tool: string, args: Record<string, unknown>, resultado: unknown): void;
  aprovarPlano(p: PlanoPrevisto): Promise<DecisaoPlano>;
  progressoPlano(passo: number, total: number, rotulo: string): void;
  consentir(tipo: "restrito", detalhe: string): Promise<boolean>;
  perguntar(pergunta: string, opcoes: string[]): Promise<string>;
  tarefas(lista: Tarefa[]): void;
  uso(total: Uso): void;
  aviso(texto: string): void;
}
