/**
 * Consentimento da árvore no Texto Padrão da unidade, por pessoa e unidade
 * (`host|login|idUnidade|base`), no storage.sync (segue o perfil do navegador,
 * como nos Favoritos). A pergunta única ("Entendi") aparece antes da primeira
 * gravação; ler não espera consentimento (o texto da unidade é de todos).
 */

import type { Area } from "@comum/armazenamento/area";
import { chaveConsentimento, consentimentoNaArea, type PortaConsentimento } from "@comum/sincronia/consentimento";

export const CHAVE_CONSENTIMENTO = "base-conhecimento/consentimento";
const CAMPO = "consentimento";

/** Pergunta sim/não apresentada ao usuário (o main injeta o diálogo). */
export type Perguntar = (texto: string, rotuloOk: string, rotuloNao: string) => Promise<boolean>;

export function textoEntendi(sigla: string): string {
  return (
    `A organização da Base de Conhecimento em pastas fica guardada num Texto Padrão da unidade ${sigla}, ` +
    "visível a quem tem acesso a esse texto no SEI. Aceita guardar?"
  );
}

export function consentimentoBase(sync: Area, host: string, login: string, idUnidade: string): PortaConsentimento {
  return consentimentoNaArea({
    area: sync,
    chavePreferencias: CHAVE_CONSENTIMENTO,
    campo: CAMPO,
    chave: chaveConsentimento(host, login, idUnidade, "base"),
  });
}

export function perguntarEntendi(perguntar: Perguntar, sigla: string): Promise<boolean> {
  return perguntar(textoEntendi(sigla), "Entendi", "Agora não");
}
