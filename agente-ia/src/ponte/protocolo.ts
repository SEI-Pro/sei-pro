/**
 * Protocolo entre o painel do agente e as abas do SEI.
 *
 * Mesma técnica das Ferramentas de PDF (ver `ferramentas-pdf/src/ponte/protocolo.ts`):
 * a PORTA é aberta pela aba do SEI em direção à extensão. Um content script
 * alcança páginas da extensão sem permissão alguma; o caminho inverso exigiria
 * a permissão `tabs` ("ler seu histórico de navegação"). E ninguém de fora da
 * extensão consegue abrir uma porta dela.
 *
 * O painel avisa que abriu gravando `CHAVE_ABERTURA` no `chrome.storage.local`;
 * as abas do SEI escutam e conectam.
 */

export const CANAL = "seipro-agente";
export const CHAVE_ABERTURA = "agenteIA_aberto";

/**
 * O que cada página da extensão grava em `CHAVE_ABERTURA` ao abrir, e renova de
 * tempos em tempos. O `id` é da INSTÂNCIA da página, não do tipo: é ele que
 * deixa a aba do SEI distinguir "outra página abriu" de "a mesma página está
 * renovando o aviso".
 */
export interface Abertura {
  id: string;
  quando: number;
}

/**
 * Quem gravou o aviso. Versões anteriores gravavam só o `Date.now()`; durante
 * uma atualização, uma aba com o content script novo pode ver o formato velho.
 */
export function abridorDe(valor: unknown): string | null {
  if (typeof valor === "number" && valor) return String(valor);
  const id = (valor as Abertura | undefined)?.id;
  return typeof id === "string" && id ? id : null;
}

/**
 * A aba do SEI precisa (re)conectar?
 *
 * `chrome.runtime.onConnect` só dispara no MOMENTO do `connect`: uma página da
 * extensão aberta DEPOIS de a aba já ter conectado não recebe porta nenhuma.
 * Por isso a aba refaz a conexão quando vê um abridor que ainda não serviu —
 * e SÓ nesse caso. O painel reescreve o aviso a cada 60 s, e reconectar nessa
 * cadência mataria operação em curso e encheria o SEI de churn.
 */
export function precisaConectar(valor: unknown, temPorta: boolean, servidos: Set<string>): boolean {
  const quem = abridorDe(valor);
  if (!quem) return false;
  return !temPorta || !servidos.has(quem);
}

export interface Pedido {
  canal: typeof CANAL;
  tipo: "pedido";
  id: string;
  op: string;
  args: Record<string, unknown>;
}

export interface Cancelamento {
  canal: typeof CANAL;
  tipo: "cancelar";
  id: string;
}

export interface Resposta {
  canal: typeof CANAL;
  tipo: "resposta";
  id: string;
  ok: boolean;
  dados?: unknown;
  erro?: { codigo: string; mensagem: string; detalhe?: string };
}

/** Apresentação da aba: enviada ao conectar e sempre que ganha foco ou muda de tela. */
export interface Apresentacao {
  canal: typeof CANAL;
  tipo: "ola";
  host: string;
  visivel: boolean;
  /** `Date.now()` do último foco: o painel usa a aba mais recente. */
  foco: number;
  titulo: string;
  /** `sei`: tela comum do SEI (opera pelo núcleo). `editor`: janela do editor de um documento. */
  papel: "sei" | "editor";
  /** Na janela do editor: nº SEI do documento aberto. */
  documento?: string;
  /**
   * Assinatura barata do que está na tela (ação, processo, documento aberto,
   * quantos marcados). O painel relê a tela quando ela muda — e o título da
   * aba NÃO muda ao abrir outro documento da mesma árvore.
   */
  contexto?: string;
}

export type MensagemAba = Resposta | Apresentacao;
export type MensagemPainel = Pedido | Cancelamento;

export function ehDoCanal(m: unknown): m is { canal: typeof CANAL; tipo: string } {
  return Boolean(m && typeof m === "object" && (m as { canal?: string }).canal === CANAL);
}

/** Prazo por operação (ms). Escrita e leitura de muitos itens demoram em rede de órgão público. */
export function prazoDe(op: string): number {
  if (op.startsWith("editor.")) return 20_000;
  if (/^caixa\.|historico|documento\.ler/.test(op)) return 180_000;
  if (/criar|editar|alterar|marcador|anotacao|andamento|atribuir|acompanhamento/.test(op)) return 120_000;
  return 60_000;
}
