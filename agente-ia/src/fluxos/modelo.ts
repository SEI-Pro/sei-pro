/**
 * Estúdio de Fluxo: o mapa do rito da unidade.
 *
 * Um `Fluxo` é a sequência de documentos que a unidade espera num tipo de
 * processo ("Nota Técnica assinada, depois Despacho de aprovação, depois
 * Ofício"). O SEI Pro usa esse mapa para dizer em que etapa o processo está e o
 * que costuma vir depois.
 *
 * Rito NÃO se adivinha por semelhança de texto: ele se escreve, ou se extrai de
 * um processo real que um humano apontou como exemplar (ver `inferir.ts`). Por
 * isso todo fluxo guarda de onde veio (`origem`, `modelos`) e nasce DESLIGADO —
 * precedente não é norma, e nada sugere nada antes de alguém revisar.
 *
 * O casamento é por TÍTULO da árvore, sem acento e sem caixa, com lista de
 * variações por etapa ("Nota Técnica", "NT"): os títulos mudam de órgão para
 * órgão, e um casamento exato só funcionaria no órgão de quem escreveu.
 */

export interface Fluxo {
  id: string;
  nome: string;
  descricao?: string;
  ativo: boolean;
  /** Quando este fluxo se aplica a um processo. */
  aplicaSe: {
    /** Casa o tipo da árvore, sem acento e sem caixa. */
    tipoProcessoContem?: string[];
    marcador?: string[];
    /** Só nestas unidades. */
    unidade?: string[];
  };
  etapas: Etapa[];
  /** Processos usados como modelo, para auditoria do que foi inferido. */
  modelos?: Array<{ protocolo: string; quando: number }>;
  origem: "manual" | "inferido" | "colecao";
  atualizadoEm: number;
}

export interface Etapa {
  id: string;
  nome: string;
  /** Documento que caracteriza a etapa, como aparece na ÁRVORE. */
  documento: { tituloContem: string[]; assinado?: boolean; daMinhaUnidade?: boolean };
  /** Etapa opcional não gera sugestão de falta. */
  obrigatoria: boolean;
  /** Dias após a etapa anterior para considerar atrasada (0 = sem prazo). */
  prazoDias?: number;
  /** O que o agente faz quando o usuário aceita a sugestão. */
  acao?: {
    titulo: string;
    /** Texto enviado ao agente, pode citar /skill. */
    pedido: string;
  };
  /** Desvio simples: se a etapa anterior casar isto, pula para outra etapa. */
  condicao?: { seDocumentoContem: string; entaoIrPara: string };
}

/** O que o usuário já mandou não sugerir, por processo. */
export type Ignorados = Record<string, Array<{ etapaId: string; quando: number }>>;

export const CHAVE_FLUXOS = "agenteIA_fluxos";
export const CHAVE_IGNORADOS = "agenteIA_fluxosIgnorados";

/**
 * Comparação de título: sem acento, sem caixa e com os espaços colapsados.
 * "NOTA  TÉCNICA" e "nota tecnica" são a mesma coisa para quem lê a árvore.
 */
export function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

/** `alvo` contém `agulha`, já normalizados os dois. */
export function contem(alvo: string, agulha: string): boolean {
  const a = normalizar(agulha);
  return a.length > 0 && normalizar(alvo).includes(a);
}

/**
 * Id novo. `crypto.randomUUID` existe no painel e no estúdio, mas não no
 * ambiente dos testes de nó sem HTTPS: o alternativo não precisa ser único no
 * mundo, só dentro da lista de fluxos deste navegador.
 */
const id = (): string => {
  try {
    return crypto.randomUUID();
  } catch {
    return `f${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
  }
};

/** Etapa em branco, com o nome já servindo de título procurado. */
export function etapaNova(nome: string): Etapa {
  return { id: id(), nome, documento: { tituloContem: [nome] }, obrigatoria: true };
}

/** Fluxo em branco. Nasce DESLIGADO: nada sugere antes de o usuário revisar. */
export function fluxoNovo(nome: string): Fluxo {
  return { id: id(), nome, ativo: false, aplicaSe: {}, etapas: [], origem: "manual", atualizadoEm: Date.now() };
}

/**
 * Pendências que impedem o fluxo de funcionar, em português, para a tela.
 *
 * Nenhuma delas é erro de digitação: são armadilhas que o fluxo salvo esconde —
 * etapa que nunca casa, id repetido (a avaliação andaria em círculo) e desvio
 * apontando para etapa que não existe (o percurso trava ali).
 */
export function validarFluxo(fluxo: Fluxo): string[] {
  const problemas: string[] = [];
  if (!fluxo.nome.trim()) problemas.push("O fluxo precisa de um nome.");
  if (!fluxo.etapas.length) problemas.push("O fluxo precisa de ao menos uma etapa.");

  const vistos = new Set<string>();
  const ids = new Set(fluxo.etapas.map((e) => e.id));
  for (const [i, etapa] of fluxo.etapas.entries()) {
    const onde = etapa.nome.trim() || `etapa ${i + 1}`;
    if (!etapa.nome.trim()) problemas.push(`A ${i + 1}ª etapa precisa de um nome.`);
    if (!etapa.documento.tituloContem.some((t) => t.trim())) {
      problemas.push(`A etapa "${onde}" não diz que documento a caracteriza: sem isso ela nunca casa com a árvore.`);
    }
    if (vistos.has(etapa.id)) problemas.push(`Duas etapas com o mesmo id ("${etapa.id}"): a etapa "${onde}" precisa de um id próprio.`);
    vistos.add(etapa.id);
    if (etapa.condicao) {
      if (!etapa.condicao.seDocumentoContem.trim()) problemas.push(`O desvio da etapa "${onde}" não diz o que procurar no documento anterior.`);
      // Desvio para a PRÓPRIA etapa bate na guarda de laço da avaliação e
      // encerra o percurso ali: as etapas seguintes nunca seriam avaliadas.
      if (etapa.condicao.entaoIrPara === etapa.id) problemas.push(`O desvio da etapa "${onde}" aponta para ela mesma, e isso interromperia o fluxo nesse ponto.`);
      else if (!ids.has(etapa.condicao.entaoIrPara)) problemas.push(`O desvio da etapa "${onde}" aponta para uma etapa que não existe mais.`);
    }
  }
  return problemas;
}

// --------------------------------------------------------------- persistência

/** Lista guardada no navegador. Nunca sincronizada: fluxo é do órgão de quem o escreveu. */
export async function listarFluxos(): Promise<Fluxo[]> {
  try {
    const v = await chrome.storage.local.get(CHAVE_FLUXOS);
    const lista = v?.[CHAVE_FLUXOS] as Fluxo[] | undefined;
    return Array.isArray(lista) ? lista : [];
  } catch {
    return [];
  }
}

export async function guardarFluxos(lista: Fluxo[]): Promise<void> {
  await chrome.storage.local.set({ [CHAVE_FLUXOS]: lista });
}

export async function listarIgnorados(): Promise<Ignorados> {
  try {
    const v = await chrome.storage.local.get(CHAVE_IGNORADOS);
    const mapa = v?.[CHAVE_IGNORADOS] as Ignorados | undefined;
    return mapa && typeof mapa === "object" ? mapa : {};
  } catch {
    return {};
  }
}

export async function guardarIgnorados(mapa: Ignorados): Promise<void> {
  await chrome.storage.local.set({ [CHAVE_IGNORADOS]: mapa });
}

/** Marca "não sugerir esta etapa neste processo". */
export function comIgnorada(mapa: Ignorados, protocolo: string, etapaId: string, quando = Date.now()): Ignorados {
  const atuais = mapa[protocolo] ?? [];
  if (atuais.some((i) => i.etapaId === etapaId)) return mapa;
  return { ...mapa, [protocolo]: [...atuais, { etapaId, quando }] };
}

export function foiIgnorada(mapa: Ignorados, protocolo: string, etapaId: string): boolean {
  return (mapa[protocolo] ?? []).some((i) => i.etapaId === etapaId);
}
