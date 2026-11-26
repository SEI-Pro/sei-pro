/**
 * Modelo da árvore da Base de Conhecimento: pastas e vínculos pasta↔item.
 *
 * O envelope é o que vai ao Texto Padrão da unidade; `formato`/`versao` no topo
 * são o contrato do codec (`versaoMaisNova`). A referência a item é o
 * `id_base_conhecimento_agrupador` (estável entre versões).
 *
 * Integridade referencial do `pai` NÃO é exigida aqui: a mesclagem por entidade
 * pode deixar um filho apontando para uma pasta apagada em outro computador, e
 * recusar o envelope inteiro perderia dados. A exibição resolve pai ausente na
 * raiz (mesclar.ts).
 */

import { indiceValido } from "@comum/ordem/indice";
import type { Versionada } from "@comum/sincronia/entidade";
import { type ValidacaoTexto, versaoMaisNova } from "@comum/sincronia/textoPadraoCodec";

export const FORMATO = "seipro-base-conhecimento";
export const VERSAO = 1;
export const TETO_TEXTO = 100 * 1024;
export const AVISO_TEXTO = 80 * 1024;
export const LIMITE_NOME_PASTA = 80;

/** Erro de regra da árvore (nome inválido, ciclo de pastas etc.). */
export class ErroArvore extends Error {
  constructor(mensagem: string) {
    super(mensagem);
    this.name = "ErroArvore";
  }
}

export interface Pasta extends Versionada {
  id: string;
  nome: string;
  pai: string | null;
  ordem: string;
}

export interface Vinculo extends Versionada {
  /** = id_base_conhecimento_agrupador. */
  id: string;
  titulo: string;
  pasta: string | null;
  ordem: string;
}

export interface EntidadesArvore {
  p: Pasta[];
  v: Vinculo[];
}

export interface Envelope {
  formato: string;
  versao: number;
  host: string;
  unidade: string;
  entidades: EntidadesArvore;
}

/** Identidade do SEI/unidade a que o texto pertence. */
export interface IdentidadeArvore {
  host: string;
  unidade: string;
}

const texto = (x: unknown): x is string => typeof x === "string";
const numeroFinito = (x: unknown): x is number => typeof x === "number" && Number.isFinite(x);

function versionadaValida(x: unknown): x is Versionada {
  if (!x || typeof x !== "object") return false;
  const v = x as Partial<Versionada>;
  return (
    texto(v.id) &&
    v.id !== "" &&
    numeroFinito(v.atualizadoEm) &&
    texto(v.dispositivo) &&
    (v.removidoEm === undefined || numeroFinito(v.removidoEm))
  );
}

export function pastaValida(x: unknown): x is Pasta {
  if (!versionadaValida(x)) return false;
  const p = x as Pasta;
  if (!texto(p.nome)) return false;
  const nome = p.nome.trim();
  return (
    nome.length >= 1 &&
    nome.length <= LIMITE_NOME_PASTA &&
    (p.pai === null || (texto(p.pai) && p.pai !== "")) &&
    texto(p.ordem) &&
    indiceValido(p.ordem)
  );
}

export function vinculoValido(x: unknown): x is Vinculo {
  if (!versionadaValida(x)) return false;
  const v = x as Vinculo;
  return texto(v.titulo) && (v.pasta === null || (texto(v.pasta) && v.pasta !== "")) && texto(v.ordem) && indiceValido(v.ordem);
}

export function validarEnvelope(bruto: unknown, ident: IdentidadeArvore): ValidacaoTexto<Envelope> {
  if (versaoMaisNova(bruto, FORMATO, VERSAO)) return { maisNovo: true };
  const b = bruto as Partial<Envelope> | null;
  if (!b || typeof b !== "object" || b.formato !== FORMATO || b.versao !== VERSAO)
    return { invalido: "o texto nao esta no formato da Base de Conhecimento" };
  if (b.host !== ident.host || b.unidade !== ident.unidade) return { invalido: "o texto e de outro SEI ou de outra unidade" };
  const ent = b.entidades as Partial<EntidadesArvore> | undefined;
  if (!ent || typeof ent !== "object" || !Array.isArray(ent.p) || !Array.isArray(ent.v)) return { invalido: "o texto nao tem a arvore" };
  if (!ent.p.every(pastaValida) || !ent.v.every(vinculoValido)) return { invalido: "a arvore tem pastas ou vinculos invalidos" };
  return {
    ok: {
      formato: FORMATO,
      versao: VERSAO,
      host: ident.host,
      unidade: ident.unidade,
      entidades: { p: ent.p, v: ent.v },
    },
  };
}
