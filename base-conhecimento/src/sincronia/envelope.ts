/**
 * Envelope de sincronia da árvore e adaptador do motor do `sei-comum`.
 *
 * Um só texto por unidade: `[_SEIPRO_BC_UNIDADE]`. O envelope é
 * `{ formato, versao, host, unidade, entidades }`; a assinatura ignora quem
 * gravou e quando (mas não as lápides), para o motor não regravar à toa.
 */

import type { Area } from "@comum/armazenamento/area";
import { areaMemoria } from "@comum/armazenamento/area";
import { assinaturaEstavel } from "@comum/sincronia/assinatura";
import type { AdaptadorTexto } from "@comum/sincronia/motor";
import { nomeDeTextoInterno } from "@comum/sincronia/textoPadraoCodec";
import type { Envelope, IdentidadeArvore } from "../arvore/modelo";
import { AVISO_TEXTO, TETO_TEXTO, validarEnvelope } from "../arvore/modelo";
import { RepositorioArvore } from "../arvore/repositorio";

export const CHAVE_STATUS = "base-conhecimento/sync/tp/unidade";
export const chaveStatus = CHAVE_STATUS;
export const chaveSubstituido = "base-conhecimento/sync/tp/substituido";

export function nomeDoTexto(): string {
  return nomeDeTextoInterno("BC", "UNIDADE");
}

export function descricaoDoTexto(): string {
  return "Árvore de pastas da Base de Conhecimento da unidade (gerada pelo SEI Pro). Não edite.";
}

export function legivelEnvelope(sigla: string, nomeUsuario: string): string {
  return `Árvore de pastas da Base de Conhecimento da unidade ${sigla}, organizada por ${nomeUsuario}. Gerada pelo SEI Pro; não edite este texto.`;
}

function normalizado(env: Envelope) {
  const porId = (a: { id: string }, b: { id: string }): number => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
  return {
    p: [...env.entidades.p]
      .sort(porId)
      .map((p) => ({ id: p.id, nome: p.nome, pai: p.pai, ordem: p.ordem, removidoEm: p.removidoEm ?? null })),
    v: [...env.entidades.v]
      .sort(porId)
      .map((v) => ({ id: v.id, titulo: v.titulo, pasta: v.pasta, ordem: v.ordem, removidoEm: v.removidoEm ?? null })),
  };
}

/** Igual para o mesmo conteúdo em qualquer computador (ignora atualizadoEm/dispositivo; lápide conta). */
export function assinaturaEnvelope(env: Envelope): string {
  return assinaturaEstavel(normalizado(env));
}

/** O texto lido como este adaptador o gravaria (para o motor distinguir poda/recusa de alteração local). */
export async function textoComoGravado(lido: Envelope, ident: IdentidadeArvore, agora: number): Promise<Envelope> {
  const repo = new RepositorioArvore({
    area: areaMemoria(),
    ident,
    carimbo: () => ({ agora, dispositivo: "normalizar" }),
  });
  await repo.importar(lido.entidades);
  return repo.exportar();
}

export interface DepsAdaptadorBase {
  repo: RepositorioArvore;
  area: Area;
  ident: IdentidadeArvore;
  sigla: string;
  nomeUsuario: string;
}

export function adaptadorBaseConhecimento(d: DepsAdaptadorBase): AdaptadorTexto<Envelope> {
  return {
    modulo: "base-conhecimento",
    chaveStatus: CHAVE_STATUS,
    teto: TETO_TEXTO,
    aviso: AVISO_TEXTO,
    legivel: () => legivelEnvelope(d.sigla, d.nomeUsuario),
    validar: (bruto) => validarEnvelope(bruto, d.ident),
    async importar(env) {
      await d.repo.importar(env.entidades);
    },
    async exportar() {
      return d.repo.exportar();
    },
    assinatura: assinaturaEnvelope,
    vazio: (env) => env.entidades.p.length === 0 && env.entidades.v.length === 0,
    normalizar: (lido, agora) => textoComoGravado(lido, d.ident, agora),
    async antesDeRegravarInvalido(motivo, html) {
      const limite = 300 * 1024;
      const guardado = html.length > limite ? html.slice(0, limite) : html;
      await d.area.gravar({ [chaveSubstituido]: { motivo, html: guardado, quando: Date.now() } });
    },
  };
}
