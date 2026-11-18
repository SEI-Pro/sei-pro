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
  /**
   * O que o provedor devolveu junto da chamada e exige de volta no histórico.
   *
   * O Gemini 3 assina cada chamada de ferramenta (`thought_signature`) e
   * RECUSA a rodada seguinte se a assinatura não voltar — com HTTP 400
   * "Function call is missing a thought_signature". Guardamos como veio, sem
   * interpretar: é opaco e de uso exclusivo do provedor que o emitiu.
   */
  extra_content?: unknown;
}

/**
 * Parte de uma mensagem com imagem. Só a chamada de visão isolada (`ver_imagem`)
 * usa partes: o histórico do motor continua em texto puro.
 */
/** Figura recortada e reduzida no painel, pronta para o cartão e para a chamada de visão. */
export interface ImagemPronta {
  dataUrl: string;
  largura: number;
  altura: number;
  /** Texto curto para o cartão de permissão ("figura p3-1 do documento 1234567"). */
  descricao: string;
}

export type ParteConteudo = { type: "text"; text: string } | { type: "image_url"; image_url: { url: string } };

export type Mensagem =
  | { role: "system"; content: string }
  | { role: "user"; content: string | ParteConteudo[] }
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
  fim: "stop" | "tool_calls" | "length" | "error" | "parado" | string;
  uso?: Uso;
  /** O provedor parou no meio: o texto é parcial e não há ferramenta a executar. */
  interrompida?: boolean;
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
 * - `interna`: do próprio motor (tarefas, perguntar, plano), sem tocar no SEI;
 * - `externo`: sai do navegador para um conector MCP do usuário, mas NÃO toca
 *   o SEI — não tem prévia nem plano, e a autorização é a permissão que o
 *   usuário deu àquela ferramenta do conector.
 */
export type Efeito = "leitura" | "escrita" | "irreversivel" | "assinatura" | "interna" | "externo";

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

/** Uma chamada a um conector MCP esperando autorização do usuário. */
export interface PedidoExterno {
  conector: string;
  tool: string;
  descricao: string;
  argumentos: Record<string, unknown>;
}

/**
 * Envio de um documento do SEI, com os bytes, a um conector (ver `mcp/tools.ts`).
 * O cartão mostra o que vai e para onde; os bytes nunca entram aqui.
 */
export interface PedidoTransferencia {
  conector: string;
  /** Endereço do servidor que recebe o arquivo. */
  endereco: string;
  tool: string;
  documento: string;
  processo: string;
  nome: string;
  tamanho: number;
  sha256: string;
  /** Os demais argumentos da chamada (sem o conteúdo). */
  argumentos: Record<string, unknown>;
}

export interface DecisaoExterna {
  permitido: boolean;
  /** Gravar "sempre permitir" para esta ferramenta. */
  sempre?: boolean;
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
  /**
   * `restrito`: documento de acesso restrito, uma vez por conversa.
   * `conector`: primeira saída de dados para um conector MCP — pergunta por
   * conector, sem memorizar junto do restrito (são autorizações diferentes).
   */
  consentir(tipo: "restrito" | "conector", detalhe: string): Promise<boolean>;
  /**
   * Cartão com a miniatura da figura antes de ela ir ao serviço de IA
   * (`ver_imagem`). "todas" vale para as próximas da conversa — menos as de
   * documento restrito, que perguntam sempre (e o cartão nem oferece "todas").
   * Sem cartão no painel, nada é enviado.
   */
  consentirImagem?(img: ImagemPronta, o: { restrito: boolean }): Promise<"esta" | "todas" | "nao">;
  /** Autoriza uma chamada a conector MCP (só quando a permissão é "aprovar"). */
  aprovarExterno?(p: PedidoExterno): Promise<DecisaoExterna>;
  /**
   * Autoriza enviar um documento inteiro, com os dados reais, a um conector.
   * Sempre perguntado: não existe "permitir sempre" para isto.
   */
  aprovarTransferencia?(p: PedidoTransferencia): Promise<boolean>;
  /**
   * Um documento lido trazia conteúdo suspeito (instrução dirigida a IA, texto
   * escondido da tela, caractere invisível). O painel acumula para o relatório
   * de integridade e avisa antes de o usuário aprovar qualquer alteração.
   */
  integridade?(documento: string, achados: Array<{ classe: string; trecho: string; motivo?: string }>): void;
  perguntar(pergunta: string, opcoes: string[]): Promise<string>;
  tarefas(lista: Tarefa[]): void;
  /** O ACUMULADO deste motor desde que foi criado (não o gasto da última chamada). */
  uso(total: Uso): void;
  aviso(texto: string): void;
}
