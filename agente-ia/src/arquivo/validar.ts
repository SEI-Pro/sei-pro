/**
 * O que um registro precisa ter para entrar no Agente, por tipo.
 *
 * Vale nos dois sentidos da sincronia por arquivo:
 * - o que VEM do arquivo (que é de fora e pode estar adulterado) só é gravado
 *   aqui depois de passar por aqui;
 * - o que está no armazenamento local e não passa fica fora do retrato, mas
 *   não vira lápide (ver `lerListas` em `retrato.ts`).
 *
 * Rotinas e conectores usam os normalizadores que o painel já usa ao ler. Os
 * outros tipos não tinham validação: aqui se exige o mínimo de que o código
 * depende (objeto, `id` em texto e os campos que o painel e o motor leem sem
 * conferir).
 */

import { normalizarConector } from "../mcp/conectores";
import { normalizarRotina } from "../painel/rotinas";
import { modelosDaConversa } from "../painel/uso";
import type { TipoLista } from "./envelope";

type Objeto = Record<string, unknown>;

const ehObjeto = (x: unknown): x is Objeto => typeof x === "object" && x !== null && !Array.isArray(x);
const texto = (o: Objeto, ...campos: string[]): boolean => campos.every((c) => typeof o[c] === "string");
const comId = (x: unknown): x is Objeto & { id: string } => ehObjeto(x) && typeof x.id === "string" && x.id !== "";
const listaDeTextos = (x: unknown): x is string[] => Array.isArray(x) && x.every((s) => typeof s === "string");

function skill(x: unknown): unknown {
  if (!comId(x) || !texto(x, "nome", "slug")) return null;
  return { ...x, descricao: typeof x.descricao === "string" ? x.descricao : "", texto: typeof x.texto === "string" ? x.texto : "" };
}

function colecao(x: unknown): unknown {
  return comId(x) && texto(x, "nome", "url") ? x : null;
}

function regra(x: unknown): unknown {
  if (!comId(x) || !texto(x, "nome", "mensagem")) return null;
  if (x.efeito !== "bloquear" && x.efeito !== "avisar") return null;
  if (!listaDeTextos(x.ferramentas)) return null;
  if (x.contem !== undefined && typeof x.contem !== "string") return null;
  return { ...x, ativa: x.ativa === true };
}

function lembranca(x: unknown): unknown {
  if (!comId(x) || !texto(x, "texto")) return null;
  return { ...x, quando: typeof x.quando === "number" ? x.quando : 0, origem: x.origem === "agente" ? "agente" : "usuario" };
}

function etapa(x: unknown): boolean {
  return comId(x) && texto(x, "nome") && ehObjeto(x.documento) && listaDeTextos(x.documento.tituloContem);
}

function fluxo(x: unknown): unknown {
  if (!comId(x) || !texto(x, "nome") || !ehObjeto(x.aplicaSe)) return null;
  if (!Array.isArray(x.etapas) || !x.etapas.every(etapa)) return null;
  return { ...x, ativo: x.ativo === true };
}

function conversa(x: unknown): unknown {
  if (!comId(x) || !texto(x, "titulo") || typeof x.quando !== "number" || !Array.isArray(x.itens)) return null;
  const uso = ehObjeto(x.uso) ? x.uso : {};
  const n = (v: unknown) => (typeof v === "number" ? v : 0);
  const { modelos, cotacao, ...resto } = x;
  return {
    ...resto,
    mensagens: n(x.mensagens),
    uso: { ...uso, entrada: n(uso.entrada), saida: n(uso.saida), custo: n(uso.custo) },
    ...(Array.isArray(modelos) ? { modelos: modelosDaConversa(modelos) } : {}),
    ...(typeof cotacao === "number" && cotacao > 0 ? { cotacao } : {}),
  };
}

const VALIDADORES: Record<TipoLista, (x: unknown) => unknown> = {
  skills: skill,
  colecoes: colecao,
  regras: regra,
  memoria: lembranca,
  rotinas: (x) => (comId(x) ? normalizarRotina(x) : null),
  conectores: (x) => (comId(x) ? normalizarConector(x) : null),
  fluxos: fluxo,
  colecoesFluxos: colecao,
  conversas: conversa,
};

/** O item já normalizado, ou `null` se não serve (não entra, e não apaga nada). */
export function validarItem(tipo: TipoLista, dado: unknown): unknown | null {
  try {
    return VALIDADORES[tipo](dado) ?? null;
  } catch {
    return null;
  }
}
