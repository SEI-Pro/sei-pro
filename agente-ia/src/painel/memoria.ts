/**
 * Memória da unidade: o que o agente aprende e leva para as próximas conversas.
 *
 * É o que evita repetir a mesma explicação toda semana ("aqui o despacho vai
 * para a GAB", "o marcador de urgente é 'Prioritário'"). Duas travas, porque
 * memória errada de agente é pior que nenhuma: **tudo é visível** (cada
 * anotação aparece na conversa e na configuração, com data) e **tudo se
 * apaga** num clique.
 *
 * O que NÃO entra aqui: dado de processo específico, conteúdo de documento,
 * nome de pessoa. Memória é sobre como a unidade trabalha — o resto se lê no
 * SEI, que é a fonte da verdade e muda sem avisar.
 */

export interface Lembranca {
  id: string;
  texto: string;
  quando: number;
  /** `agente` (anotado sozinho) ou `usuario` (escrito nas configurações). */
  origem: "agente" | "usuario";
}

const CHAVE = "agenteIA_memoria";

/** Poucas e curtas: elas entram em TODO pedido, e prompt longo é caro e distrai. */
export const MAX_LEMBRANCAS = 30;
export const MAX_TEXTO = 240;

export async function listarMemoria(): Promise<Lembranca[]> {
  try {
    const v = await chrome.storage.local.get(CHAVE);
    const lista = (v?.[CHAVE] as Lembranca[]) ?? [];
    return Array.isArray(lista) ? lista : [];
  } catch {
    return [];
  }
}

export async function guardarMemoria(lista: Lembranca[]): Promise<void> {
  await chrome.storage.local.set({ [CHAVE]: lista.slice(-MAX_LEMBRANCAS) });
}

const normalizar = (t: string) =>
  t
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/** Rótulos da pseudonimização: se aparecem, o fato é sobre um caso, não sobre a unidade. */
const RE_PSEUDONIMO = /\[(PESSOA|CPF|CNPJ|EMAIL|TELEFONE|ENDERECO|CONTA|CID)_\d+\]/i;
/** Número de processo ou de documento do SEI. */
const RE_NUMERO = /\d{5,}[./-]|\b\d{6,}\b/;

export type Recusa = { ok: false; motivo: string };
export type Aceite = { ok: true; lembranca: Lembranca };

/**
 * Valida e acrescenta uma lembrança.
 *
 * Recusar é o comportamento normal aqui: a maior parte do que um modelo acha
 * digno de lembrar é detalhe do caso da vez.
 */
export function anotar(lista: Lembranca[], texto: string, origem: Lembranca["origem"], agora = Date.now()): Aceite | Recusa {
  const limpo = texto.trim().replace(/\s+/g, " ");
  if (limpo.length < 10) return { ok: false, motivo: "A lembrança está curta demais para ser útil." };
  if (limpo.length > MAX_TEXTO) return { ok: false, motivo: `A lembrança passa de ${MAX_TEXTO} caracteres. Escreva a regra, não o caso.` };
  if (origem === "agente" && RE_PSEUDONIMO.test(limpo)) {
    return { ok: false, motivo: "A memória é sobre como a unidade trabalha, não sobre pessoas: dado pessoal não entra." };
  }
  if (origem === "agente" && RE_NUMERO.test(limpo)) {
    return { ok: false, motivo: "Isso parece um caso específico (tem número de processo ou documento). A memória guarda o hábito da unidade, não o caso." };
  }
  if (lista.some((l) => normalizar(l.texto) === normalizar(limpo))) {
    return { ok: false, motivo: "Já está na memória." };
  }
  return { ok: true, lembranca: { id: crypto.randomUUID(), texto: limpo, quando: agora, origem } };
}

/** Trecho que vai ao prompt de sistema. */
export function blocoDeMemoria(lista: Lembranca[]): string {
  if (!lista.length) return "";
  const linhas = lista.slice(-MAX_LEMBRANCAS).map((l) => `  - ${l.texto}`);
  return `\n- Como esta unidade trabalha (aprendido em conversas anteriores; se algo contradisser o que o SEI mostra agora, vale o SEI):\n${linhas.join("\n")}`;
}
