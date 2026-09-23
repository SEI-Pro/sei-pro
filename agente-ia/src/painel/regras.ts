/**
 * Regras da unidade: o que o agente nunca pode fazer, e o que exige atenção.
 *
 * É o "hook" de um harness de IA, adaptado ao que uma extensão pode fazer com
 * segurança: nada de script arbitrário (a política de segurança da extensão
 * não permite, e um script do repositório de terceiro rodando no SEI seria
 * uma porta dos fundos). Aqui a regra é DECLARATIVA — condição e efeito —,
 * avaliada no navegador antes de qualquer escrita.
 *
 * Por que não deixar isso para o prompt: instrução no prompt é pedido, e
 * modelo às vezes não atende. Política de órgão não pode depender disso.
 */

export type EfeitoRegra = "bloquear" | "avisar";

export interface Regra {
  id: string;
  nome: string;
  ativa: boolean;
  efeito: EfeitoRegra;
  /** Ferramentas alcançadas. Vazio = toda escrita. */
  ferramentas: string[];
  /** Texto que precisa aparecer nos argumentos da ação (tipo de documento, unidade, palavra). */
  contem?: string;
  /** Mensagem mostrada ao usuário e devolvida ao modelo. */
  mensagem: string;
}

const CHAVE = "agenteIA_regras";

export async function listarRegras(): Promise<Regra[]> {
  try {
    const v = await chrome.storage.local.get(CHAVE);
    const lista = (v?.[CHAVE] as Regra[]) ?? [];
    return Array.isArray(lista) ? lista : [];
  } catch {
    return [];
  }
}

export async function guardarRegras(lista: Regra[]): Promise<void> {
  await chrome.storage.local.set({ [CHAVE]: lista });
}

/** Modelos prontos, para a unidade não começar do zero. */
export const REGRAS_SUGERIDAS: Array<Omit<Regra, "id">> = [
  {
    nome: "Nunca enviar processo sem revisão",
    ativa: true,
    efeito: "bloquear",
    ferramentas: ["processo_enviar"],
    mensagem: "Nesta unidade, o envio de processo é feito por uma pessoa, não pelo agente.",
  },
  {
    nome: "Atenção ao assinar",
    ativa: true,
    efeito: "avisar",
    ferramentas: ["documento_assinar", "bloco_assinar"],
    mensagem: "Confira o conteúdo antes de assinar: o texto assinado é de responsabilidade de quem assina.",
  },
  {
    nome: "Portaria só com o chefe",
    ativa: false,
    efeito: "bloquear",
    ferramentas: ["documento_criar"],
    contem: "Portaria",
    mensagem: "Portaria não é criada pelo agente nesta unidade.",
  },
];

const normalizar = (t: string) =>
  t
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

/** Texto onde a condição `contem` é procurada: tudo o que a ação vai fazer. */
function textoDaAcao(tool: string, args: Record<string, unknown>, rotulo: string): string {
  return normalizar(`${tool} ${rotulo} ${JSON.stringify(args ?? {})}`);
}

export interface Veredito {
  bloqueios: Array<{ regra: Regra; passo: string }>;
  avisos: Array<{ regra: Regra; passo: string }>;
}

/** O que as regras dizem sobre os passos que estão prestes a ser executados. */
export function avaliarRegras(
  regras: Regra[],
  passos: Array<{ tool: string; rotulo: string; args: Record<string, unknown> }>,
): Veredito {
  const veredito: Veredito = { bloqueios: [], avisos: [] };
  for (const regra of regras) {
    if (!regra.ativa) continue;
    for (const passo of passos) {
      const alcanca = !regra.ferramentas.length || regra.ferramentas.includes(passo.tool);
      if (!alcanca) continue;
      if (regra.contem && !textoDaAcao(passo.tool, passo.args, passo.rotulo).includes(normalizar(regra.contem))) continue;
      (regra.efeito === "bloquear" ? veredito.bloqueios : veredito.avisos).push({ regra, passo: passo.rotulo });
    }
  }
  return veredito;
}

/** Resposta que o modelo recebe quando a regra barra a ação — precisa explicar, não só negar. */
export function recadoDoBloqueio(veredito: Veredito): string {
  const linhas = veredito.bloqueios.map((b) => `- ${b.passo}: ${b.regra.mensagem} (regra "${b.regra.nome}", definida pelo usuário nas configurações)`);
  return `Ação barrada por regra da unidade, nada foi feito no SEI:\n${linhas.join("\n")}\nExplique isso ao usuário e sugira o caminho permitido; não tente de novo pela mesma ferramenta.`;
}
