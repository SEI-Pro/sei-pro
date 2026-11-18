/**
 * Definição e registro de tools, no espírito do Claude Agent SDK
 * (`tool(nome, descrição, esquema, handler)`), adaptado às regras do SEI:
 * toda tool declara o EFEITO, e toda tool que escreve declara também a PRÉVIA.
 */

import type { Esquema } from "./esquema";
import type { Efeito, ImagemPronta, InterfaceMotor, PreviaItem } from "./tipos";

/**
 * O que o painel oferece ao `ver_imagem`. Só o motor da conversa principal
 * recebe: o agente auxiliar e as rotinas não têm como pedir permissão ao
 * usuário, e figura nenhuma sai sem ela.
 */
export interface ServicoDeImagens {
  /** Execução sem ninguém olhando (rotina): imagem nenhuma sai, nem com "desta conversa". */
  semUsuario?(): boolean;
  /** O modelo que vai olhar aceita imagem? `null` quando o serviço não informa. */
  enxerga(): Promise<boolean | null>;
  preparar(conteudo: { tipo: string; base64: string }, figura: string, rotulo: string): Promise<ImagemPronta>;
  /** Chamada isolada, sem ferramentas; devolve o texto da descrição. */
  descrever(img: ImagemPronta, pedido: string, sinal: AbortSignal): Promise<string>;
}

/** O que uma tool recebe para trabalhar. Montado pelo motor a cada chamada. */
export interface ContextoTool {
  sinal: AbortSignal;
  /** Executa uma operação na aba do SEI (ver `ponte/operacoes.ts`). */
  sei<T = unknown>(op: string, args?: Record<string, unknown>): Promise<T>;
  /** Estado da conversa que as tools podem ler e marcar. */
  estado: EstadoConversa;
  /** Pede consentimento para conteúdo restrito (uma vez por conversa). */
  consentirRestrito(detalhe: string): Promise<boolean>;
  /**
   * Pede consentimento para enviar dados a um conector MCP.
   *
   * Separado do restrito de propósito: quem autorizou ler um documento
   * restrito não autorizou, com isso, mandar conteúdo a um serviço de
   * terceiro. Aqui não há memória por conversa — quem guarda o "já
   * consentido" é o próprio conector.
   */
  consentirConector(detalhe: string): Promise<boolean>;
  /** Mostra a miniatura e pergunta se a figura pode ir ao serviço de IA (ver `consentirImagemNaConversa`). */
  consentirImagem(img: ImagemPronta, o: { restrito: boolean }): Promise<boolean>;
  /** Recorte e chamada de visão (`ver_imagem`). Ausente no agente auxiliar e nas rotinas. */
  imagens?: ServicoDeImagens;
  /**
   * Mascara dados pessoais. O motor reidrata os argumentos antes de executar,
   * para a escrita no SEI levar o valor real: o que sair daqui para fora do
   * SEI precisa ser mascarado de novo.
   */
  anonimizar(texto: string): string;
  /**
   * Identificador do envelope desta conversa (ver `seguranca/envelope.ts`).
   *
   * Todo conteúdo de documento entra delimitado por ele. Como é sorteado a
   * cada conversa, documento escrito antes não tem como fechar o envelope e
   * continuar "do lado de fora", como instrução.
   */
  nonce: string;
  /** Anota o que a varredura achou num documento, para o relatório de integridade. */
  registrarAchados(documento: string, achados: Array<{ classe: string; trecho: string; motivo?: string }>): void;
  /** Registra nomes de pessoas vistos nos metadados, para o dicionário da anonimização. */
  pessoasVistas(nomes: string[]): void;
  /**
   * Pede uma última passada sobre o texto EXATO que vai ao modelo: o motor a aplica depois do JSON, da anonimização e
   * do corte. O que a tool tirou do resultado pode ser remontado por esses passos (o rótulo "[PESSOA_1]" traz dígito).
   * Se a passada falhar, nada do resultado vai ao modelo.
   */
  aoModelo?(passada: (texto: string) => string): void;
  /**
   * A prévia DESTE passo, como o usuário a viu no cartão que aprovou. Só existe
   * na execução de plano; passo com referência a outro (`$1...`) não tem prévia
   * e chega com a lista vazia. Serve à tool que só pode fazer exatamente o que
   * foi mostrado (ver `tools/baixar.ts`).
   */
  previa?: PreviaItem[];
  /** Interface do painel (tools internas: perguntar, tarefas). */
  ui: InterfaceMotor;
  /** Credenciais de assinatura aprovadas no plano (só em tools de assinatura). */
  assinatura?: { cargo: string; senha: string };
  /**
   * Delega uma tarefa de LEITURA a um agente auxiliar, com contexto próprio.
   * Devolve só o resultado — é isso que mantém a conversa principal curta.
   */
  delegar?(tarefa: string, sinal: AbortSignal): Promise<string>;
  /** Guarda um fato sobre a unidade para as próximas conversas (ver painel/memoria.ts). */
  lembrar?(fato: string): Promise<{ guardado: boolean; motivo?: string }>;
}

export interface EstadoConversa {
  consentimentoRestrito: boolean | null;
  /** Arquivos anexados pelo usuário nesta conversa (CSV, planilhas...). */
  anexos: Array<{ nome: string; tipo: string; texto?: string }>;
  /** O usuário escolheu "Enviar as imagens desta conversa" (não vale para documento restrito). */
  consentimentoImagens: boolean;
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
  const escreveNoSei = d.efeito === "escrita" || d.efeito === "irreversivel" || d.efeito === "assinatura";
  if (escreveNoSei && !d.previsualizar) {
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
