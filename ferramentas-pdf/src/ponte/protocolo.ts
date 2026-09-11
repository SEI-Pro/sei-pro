/**
 * Protocolo entre a página Ferramentas de PDF e as abas do SEI.
 *
 * O CANAL É UMA PORTA `chrome.runtime`, aberta pelo SEI em direção à página.
 * Essa direção não é escolha estética: um content script alcança qualquer
 * página da extensão sem permissão nenhuma, enquanto o caminho inverso exigiria
 * a permissão `tabs` — a que o navegador descreve ao usuário como "ler seu
 * histórico de navegação".
 *
 * A porta também é mais segura do que conversar por `postMessage` entre
 * janelas. A página está em `web_accessible_resources`, então qualquer site nos
 * domínios em que a extensão roda consegue abri-la; só que ninguém de fora
 * consegue abrir uma porta de extensão. Some a necessidade de segredo na URL.
 *
 * BYTES VIAJAM EM BASE64, em blocos. A porta serializa em JSON, e um
 * `ArrayBuffer` posto nela chega do outro lado como `{}` — vazio, sem erro
 * nenhum. Medido: converter 10 MB custa cerca de 5 ms, e 30 MB cerca de 18 ms,
 * o que é imperceptível ao lado do tempo de baixar o documento do SEI.
 */

export const CANAL = "seipro-ferramentas-pdf";

export type Operacao =
  | "contexto"
  | "parametrosUpload"
  | "listarDocumentos"
  | "obterPdf"
  | "enviarAoProcesso"
  | "focarSei";

export interface Pedido {
  canal: typeof CANAL;
  id: string;
  op: Operacao;
  carga?: unknown;
}

export interface Resposta {
  canal: typeof CANAL;
  id: string;
  carga?: unknown;
  erro?: { codigo: string; detalhe?: string } | null;
  /** Progresso parcial: a resposta final vem depois. */
  progresso?: { feito: number; total: number };
}

/** Apresentação que cada aba do SEI manda ao conectar. */
export interface Apresentacao {
  canal: typeof CANAL;
  tipo: "ola";
  /** Identifica a aba, para a página distinguir quando há várias. */
  origem: string;
  host: string;
  protocolo?: string;
  idProcedimento?: string;
  unidade?: string;
  versaoSei?: string;
}

export function ehDoCanal(m: unknown): boolean {
  return Boolean(m && typeof m === "object" && (m as { canal?: string }).canal === CANAL);
}

export function novoId(): string {
  return crypto.randomUUID();
}

/** Tempo máximo de cada operação, em milissegundos. */
export const PRAZOS: Record<Operacao, number> = {
  contexto: 15_000,
  parametrosUpload: 25_000,
  listarDocumentos: 20_000,
  obterPdf: 180_000,
  // O mesmo prazo que o envio de documentos do SEI Pro já usa: upload grande em
  // rede de órgão público é lento, e cortar antes seria pior que esperar.
  enviarAoProcesso: 900_000,
  focarSei: 5_000,
};

/**
 * Tamanho do bloco de bytes.
 *
 * Mensagem muito grande numa porta é caminho de problema — a serialização em
 * JSON acontece de uma vez. Em blocos, a memória de pico fica previsível e dá
 * para mostrar progresso enquanto o documento atravessa.
 */
export const TAMANHO_BLOCO = 512 * 1024;

/** Chave de storage que avisa às abas do SEI que a página abriu. */
export const CHAVE_ABERTURA = "ferramentasPdfPro_aberta";

/** Converte bytes em base64, em blocos, sem estourar a pilha. */
export function paraBase64(bytes: Uint8Array): string {
  // `String.fromCharCode(...bytes)` de uma vez estoura a pilha com poucos MB.
  const PEDACO = 0x8000;
  let s = "";
  for (let i = 0; i < bytes.length; i += PEDACO) {
    s += String.fromCharCode(...bytes.subarray(i, i + PEDACO));
  }
  return btoa(s);
}

/** Caminho de volta. */
export function deBase64(texto: string): Uint8Array {
  const bruto = atob(texto);
  const bytes = new Uint8Array(bruto.length);
  for (let i = 0; i < bruto.length; i += 1) bytes[i] = bruto.charCodeAt(i);
  return bytes;
}
