/**
 * Definição e registro de tools, no espírito do Claude Agent SDK
 * (`tool(nome, descrição, esquema, handler)`), adaptado às regras do SEI:
 * toda tool declara o EFEITO, e toda tool que escreve declara também a PRÉVIA.
 */

import type { Esquema } from "./esquema";
import type { Efeito, InterfaceMotor, PreviaItem } from "./tipos";

/** O que uma tool recebe para trabalhar. Montado pelo motor a cada chamada. */
export interface ContextoTool {
  sinal: AbortSignal;
  /** Executa uma operação na aba do SEI (ver `ponte/operacoes.ts`). */
  sei<T = unknown>(op: string, args?: Record<string, unknown>): Promise<T>;
  /** Estado da conversa que as tools podem ler e marcar. */
  estado: EstadoConversa;
  /** Pede consentimento para conteúdo restrito (uma vez por conversa). */
  consentirRestrito(detalhe: string): Promise<boolean>;
  /** Registra nomes de pessoas vistos nos metadados, para o dicionário da anonimização. */
  pessoasVistas(nomes: string[]): void;
  /** Interface do painel (tools internas: perguntar, tarefas). */
  ui: InterfaceMotor;
  /** Credenciais de assinatura aprovadas no plano (só em tools de assinatura). */
  assinatura?: { cargo: string; senha: string };
  /**
   * Delega uma tarefa de LEITURA a um agente auxiliar, com contexto próprio.
   * Devolve só o resultado — é isso que mantém a conversa principal curta.
   */
  delegar?(tarefa: string, sinal: AbortSignal): Promise<string>;
}

export interface EstadoConversa {
  consentimentoRestrito: boolean | null;
  /** Arquivos anexados pelo usuário nesta conversa (CSV, planilhas...). */
  anexos: Array<{ nome: string; tipo: string; texto?: string }>;
}

export interface DefTool<A extends Record<string, unknown> = Record<string, unknown>> {
  nome: string;
  /** Escrita PARA O MODELO: o que faz, quando usar, quando NÃO usar. */
  descricao: string;
  parametros: Esquema;
  efeito: Efeito;
  /** Nome curto para humanos no painel ("Alterar sigilo de 12 documentos"). */
  rotulo(args: A): string;
  executar(args: A, ctx: ContextoTool): Promise<unknown>;
  /** Obrigatória para escrita/irreversível/assinatura: calcula o antes → depois sem gravar. */
  previsualizar?(args: A, ctx: ContextoTool): Promise<PreviaItem[]>;
}

export function definirTool<A extends Record<string, unknown>>(d: DefTool<A>): DefTool<Record<string, unknown>> {
  if (d.efeito !== "leitura" && d.efeito !== "interna" && !d.previsualizar) {
    throw new Error(`A tool ${d.nome} escreve no SEI e precisa de previsualizar().`);
  }
  if (!/^[a-z][a-z0-9_]{2,63}$/.test(d.nome)) throw new Error(`Nome de tool inv\u00E1lido: ${d.nome}`);
  return d as unknown as DefTool<Record<string, unknown>>;
}

export class RegistroTools {
  private readonly mapa = new Map<string, DefTool>();

  constructor(tools: DefTool[]) {
    for (const t of tools) {
      if (this.mapa.has(t.nome)) throw new Error(`Tool duplicada: ${t.nome}`);
      this.mapa.set(t.nome, t);
    }
  }

  obter(nome: string): DefTool | undefined {
    return this.mapa.get(nome);
  }

  todas(): DefTool[] {
    return [...this.mapa.values()];
  }

  /** Formato `tools` do chat completions. */
  paraProvedor(): Array<{ type: "function"; function: { name: string; description: string; parameters: Esquema } }> {
    return this.todas().map((t) => ({ type: "function", function: { name: t.nome, description: t.descricao, parameters: t.parametros } }));
  }
}
