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
}

export type MensagemAba = Resposta | Apresentacao;
export type MensagemPainel = Pedido | Cancelamento;

export function ehDoCanal(m: unknown): m is { canal: typeof CANAL; tipo: string } {
  return Boolean(m && typeof m === "object" && (m as { canal?: string }).canal === CANAL);
}

/** Prazo por operação (ms). Escrita e leitura de muitos itens demoram em rede de órgão público. */
export function prazoDe(op: string): number {
  if (/^caixa\.|historico|documento\.ler/.test(op)) return 180_000;
  if (/criar|editar|alterar|marcador|anotacao|andamento|atribuir|acompanhamento/.test(op)) return 120_000;
  return 60_000;
}
