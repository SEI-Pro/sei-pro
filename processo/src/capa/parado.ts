/**
 * Processo parado: há quantos dias o processo está na unidade do usuário e se isso passa do limite.
 * Duas fontes, na ordem: o histórico completo (passagem em curso da unidade) e, sem ele, a data de recebimento que o
 * legado já guardou (`configDataRecebimentoPro`, só leitura). Datas no relógio do SEI (UTC escrito, ver `calcularPassagens`).
 */
import { dataISODe, type Passagem, relogioDe, relogioDoISO } from "@nucleo/dominio/passagens";
import { DIA_MS } from "../gantt/modelo";
import { LIMITE_PARADO_PADRAO } from "../modelo/constantes";
import { paraBusca } from "../modelo/texto";

/**
 * A passagem em curso da unidade (a mais recente), para o card "Na unidade atual". Vale também a que aguarda o
 * recebimento: o processo já está lá. Concluído na unidade (sem passagem em curso): `null`.
 */
export function passagemNaUnidade(passagens: readonly Passagem[], sigla: string): Passagem | null {
  const s = paraBusca(sigla);
  if (!s) return null;
  const emCurso = passagens.filter((p) => p.emCurso && paraBusca(p.unidade) === s);
  return emCurso.length ? (emCurso.reduce((a, b) => (b.recebido.getTime() >= a.recebido.getTime() ? b : a)) as Passagem) : null;
}

export type OrigemDoParado = "historico" | "recebimento";

export interface Parado {
  dias: number;
  desde: Date;
  origem: OrigemDoParado;
}

/** Dias inteiros desde `desde` (relógio do SEI) até `agora` (instante real). */
export function diasDesde(desde: Date, agora: Date): number {
  return Math.max(0, Math.floor((relogioDe(agora).getTime() - desde.getTime()) / DIA_MS));
}

/**
 * Há quanto tempo o processo está na unidade: do histórico, se foi coletado; senão da data de recebimento guardada pelo
 * legado; senão `null` (não se sabe).
 */
export function diasParado(
  fonte: { passagens: readonly Passagem[] | null; sigla: string; recebidoEm: Date | null },
  agora: Date,
): Parado | null {
  if (fonte.passagens) {
    const p = passagemNaUnidade(fonte.passagens, fonte.sigla);
    if (p) return { dias: diasDesde(p.recebido, agora), desde: p.recebido, origem: "historico" };
  }
  if (fonte.recebidoEm) return { dias: diasDesde(fonte.recebidoEm, agora), desde: fonte.recebidoEm, origem: "recebimento" };
  return null;
}

/** Passou do limite? (`limite` 0 desliga o alerta.) */
export const estaParado = (p: Parado | null, limite: number): boolean => limite > 0 && p !== null && p.dias > limite;

/** O limite configurado: ausente = padrão (15); 0 = desligado; inválido = padrão. */
export function limiteDeParado(valor: unknown): number {
  if (valor === undefined || valor === null || valor === "") return LIMITE_PARADO_PADRAO;
  const n = typeof valor === "number" ? valor : Number(String(valor).replace(",", "."));
  if (!Number.isFinite(n) || n < 0) return LIMITE_PARADO_PADRAO;
  return Math.floor(n);
}

/**
 * A data em que o processo chegou à unidade, guardada pelo legado em `localStorage.configDataRecebimentoPro` (lista de
 * `{id_procedimento, datahora: "aaaa-mm-dd hh:mm:ss", ...}`). Só leitura; qualquer defeito vira `null`.
 */
export function recebimentoDoLegado(armazenamento: Pick<Storage, "getItem">, idProcedimento: string): Date | null {
  try {
    const bruto = armazenamento.getItem("configDataRecebimentoPro");
    if (!bruto) return null;
    const lista: unknown = JSON.parse(bruto);
    if (!Array.isArray(lista)) return null;
    const item = lista.find(
      (x) => x && typeof x === "object" && String((x as { id_procedimento?: unknown }).id_procedimento) === idProcedimento,
    ) as { datahora?: unknown } | undefined;
    if (!item || typeof item.datahora !== "string") return null;
    // O legado grava `datahora` como "aaaa-mm-dd hh:mm:ss" (formato do moment, medido ao vivo); aceita também o "dd/mm/aaaa hh:mm" do SEI.
    const m = /^(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2})/.exec(item.datahora.trim());
    const iso = m ? `${m[1]}T${m[2]}:00` : dataISODe(item.datahora);
    return iso ? relogioDoISO(iso) : null;
  } catch {
    return null;
  }
}
