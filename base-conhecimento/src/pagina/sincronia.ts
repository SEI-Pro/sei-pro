/**
 * Sincronia da árvore por Texto Padrão do lado da aba do SEI (o content script
 * tem a sessão). UM controle (um texto por unidade) sobre o motor genérico do
 * `sei-comum`: lê sempre (o texto é de todos), grava só depois do "Entendi".
 *
 * `agora()` nunca rejeita: o que falha vira status de erro com o motivo.
 */

import type { Area } from "@comum/armazenamento/area";
import type { PortaConsentimento } from "@comum/sincronia/consentimento";
import { type ArmazemTexto, ControleTextoPadrao } from "@comum/sincronia/controlePagina";
import { type StatusSync, textoDoErro } from "@comum/sincronia/motor";
import { type Travar, type TravarEsperando, travarComLocks, travarEsperando } from "@comum/sincronia/trava";
import type { Envelope } from "../arvore/modelo";
import type { RepositorioArvore } from "../arvore/repositorio";
import { adaptadorBaseConhecimento } from "../sincronia/envelope";
import { consentimentoBase } from "./consentir";

export const INTERVALO_PUXAR = 2 * 60_000;

export interface DepsSincronia {
  ctx: { host: string; login: string; nome?: string };
  unidade: { id: string; sigla: string };
  /** chrome.storage.local: status e cópia do texto inválido. */
  area: Area;
  /** chrome.storage.sync: o consentimento. */
  sync: Area;
  repo: RepositorioArvore;
  /** O armazém do núcleo (criado só na primeira rodada). */
  armazem(): ArmazemTexto;
  travar: Travar;
  travarEsperando: TravarEsperando;
  atrasoEnvio?: number;
}

function statusDaFalha(e: unknown): StatusSync {
  const t = textoDoErro(e);
  return { estado: t.estado, mensagem: t.mensagem, quando: Date.now(), pendente: false };
}

export class SincroniaBase {
  private readonly controle: ControleTextoPadrao<Envelope>;

  constructor(private readonly d: DepsSincronia) {
    const ident = { host: d.ctx.host, unidade: d.unidade.id };
    this.controle = new ControleTextoPadrao<Envelope>({
      area: d.area,
      adaptador: adaptadorBaseConhecimento({
        repo: d.repo,
        area: d.area,
        ident,
        sigla: d.unidade.sigla,
        nomeUsuario: d.ctx.nome || d.ctx.login,
      }),
      armazem: () => d.armazem(),
      consentimento: this.consentimento(),
      aoMudarLocal: (cb) => d.repo.aoMudar(cb),
      travar: d.travar,
      travarEsperando: d.travarEsperando,
      atrasoEnvio: d.atrasoEnvio,
      intervaloPuxar: INTERVALO_PUXAR,
      // O texto da unidade é de todos: conferência na gravação e até 3 tentativas por rodada.
      releituras: 3,
      lerSemConsentimento: true,
      lerNoRecuo: true,
    });
  }

  consentimento(): PortaConsentimento {
    return consentimentoBase(this.d.sync, this.d.ctx.host, this.d.ctx.login, this.d.unidade.id);
  }

  async iniciar(o: { puxar: boolean }): Promise<void> {
    await this.controle.iniciar(o);
  }

  async puxar(): Promise<void> {
    await this.controle.puxar();
  }

  /** "Sincronizar agora": nunca rejeita. */
  async agora(): Promise<StatusSync> {
    try {
      return await this.controle.agora();
    } catch (e) {
      return statusDaFalha(e);
    }
  }

  parar(): void {
    this.controle.parar();
  }
}

export interface DepsLigarSincronia extends DepsSincronia {
  janela: Pick<EventTarget, "addEventListener">;
  doc: Pick<EventTarget, "addEventListener"> & { readonly visibilityState: DocumentVisibilityState };
  /** A tela tem o item "Textos Padrão" no menu? Sem ele, a sincronia não liga. */
  temArmazem: () => boolean;
}

/** null quando a tela não tem o menu de Textos Padrão ou a sincronia não pôde ser montada. */
export function ligarSincronia(d: DepsLigarSincronia): SincroniaBase | null {
  if (!d.temArmazem()) return null;
  let s: SincroniaBase;
  try {
    s = new SincroniaBase(d);
  } catch (e) {
    console.warn("[SEI Pro] base-conhecimento: a sincronia nao foi ligada:", e);
    return null;
  }
  void s.iniciar({ puxar: true }).catch((e) => console.warn("[SEI Pro] base-conhecimento: sincronia", e));
  const puxar = () => void s.puxar().catch(() => undefined);
  d.janela.addEventListener("focus", puxar);
  d.doc.addEventListener("visibilitychange", () => {
    if (d.doc.visibilityState === "visible") puxar();
  });
  return s;
}

export { travarComLocks, travarEsperando };
