/**
 * Contexto da página: a ponte com o SEI e o perfil do destino.
 *
 * A ponte comeca AUSENTE e pode ser trocada quando uma aba do SEI se apresenta.
 * Todo componente le por `ponte()`, nunca guardando a referencia -- se
 * guardasse, continuaria falando com a ponte morta depois que o usuario
 * fechasse a aba do SEI.
 */

import { PONTE_AUSENTE, type PonteSei } from "@/plataforma/ponteSei";
import {
  PERFIL_SEI_GENERICO,
  perfilDoSei,
} from "@/lib/ferramentas/protocolo/perfilDestino";
import type { PresetProtocolo } from "@/lib/ferramentas/protocolo/tipos";

let atual: PonteSei = PONTE_AUSENTE;
let perfil: PresetProtocolo = PERFIL_SEI_GENERICO;
const ouvintesPerfil = new Set<(p: PresetProtocolo) => void>();

export function ponte(): PonteSei {
  return atual;
}

export function definirPonte(nova: PonteSei): void {
  atual = nova;
  void atualizarPerfil();
}

/** Perfil de limites em vigor. Sem SEI, e o generico. */
export function perfilDestino(): PresetProtocolo {
  return perfil;
}

export function aoMudarPerfil(ouvinte: (p: PresetProtocolo) => void): () => void {
  ouvintesPerfil.add(ouvinte);
  ouvinte(perfil);
  return () => ouvintesPerfil.delete(ouvinte);
}

/**
 * Le os limites da instalacao e promove o perfil a "apurado".
 *
 * Falha aqui NAO e erro: significa apenas que continuamos com os limites
 * tipicos, e o usuario ve a procedencia disso na tela. Um numero inventado com
 * selo de apurado seria muito pior -- gera documento recusado no protocolo.
 */
async function atualizarPerfil(): Promise<void> {
  try {
    if (!atual.disponivel()) {
      perfil = PERFIL_SEI_GENERICO;
    } else {
      const [limites, contexto] = await Promise.all([
        atual.parametrosUpload(),
        atual.contexto(),
      ]);
      perfil = limites
        ? perfilDoSei({
            bytesPorArquivo: limites.bytesPorArquivo,
            extensoes: limites.extensoes,
            host: contexto?.host,
          })
        : PERFIL_SEI_GENERICO;
    }
  } catch {
    perfil = PERFIL_SEI_GENERICO;
  }
  for (const o of ouvintesPerfil) o(perfil);
}
