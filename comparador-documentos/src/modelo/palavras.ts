/**
 * Fase 2: diff de palavras dentro de um bloco que mudou. Tags e espaços do "depois" ficam como estão; palavra só do
 * "antes" entra como <del>, palavra só do "depois" como <ins> (corridas seguidas viram um só elemento).
 */

import { lcsIndices } from "./alinhar";
import { COR_ACRESCENTADO, COR_REMOVIDO } from "./constantes";

const TOKEN = /<[^>]*>|\s+|[^<\s]+/g;
const ehTag = (t: string): boolean => t.startsWith("<");
const ehEspaco = (t: string): boolean => /^\s/.test(t);

const del = (t: string): string => `<del style="${COR_REMOVIDO}">${t}</del>`;
const ins = (t: string): string => `<ins style="${COR_ACRESCENTADO}">${t}</ins>`;

type Seg = { tipo: "igual" | "ins" | "del"; texto: string };

export function diffPalavras(antesHtml: string, depoisHtml: string): string {
  if (antesHtml === depoisHtml) return depoisHtml;
  const tokA = antesHtml.match(TOKEN) ?? [];
  const tokB = depoisHtml.match(TOKEN) ?? [];
  const palA = tokA.filter((t) => !ehTag(t) && !ehEspaco(t));
  const idx = new Map<string, number>();
  const id = (t: string): number => {
    let v = idx.get(t);
    if (v === undefined) {
      v = idx.size;
      idx.set(t, v);
    }
    return v;
  };
  const idsA = palA.map(id);
  const idsB = tokB.filter((t) => !ehTag(t) && !ehEspaco(t)).map(id);
  const casadoCom = new Array<number>(idsB.length).fill(-1);
  for (const p of lcsIndices(idsA, idsB)) casadoCom[p.depois] = p.antes;
  // Para cada palavra do depois: indice, no antes, da proxima palavra casada (ou o fim).
  const proximo = new Array<number>(idsB.length + 1).fill(palA.length);
  for (let j = idsB.length - 1; j >= 0; j--) proximo[j] = casadoCom[j]! >= 0 ? casadoCom[j]! : proximo[j + 1]!;

  const segs: Seg[] = [];
  let ia = 0;
  let j = 0;
  for (const t of tokB) {
    if (ehTag(t) || ehEspaco(t)) {
      segs.push({ tipo: "igual", texto: t });
      continue;
    }
    if (ia < proximo[j]!) {
      segs.push({ tipo: "del", texto: palA.slice(ia, proximo[j]!).join(" ") });
      ia = proximo[j]!;
    }
    if (casadoCom[j]! >= 0) {
      segs.push({ tipo: "igual", texto: t });
      ia = casadoCom[j]! + 1;
    } else segs.push({ tipo: "ins", texto: t });
    j++;
  }
  if (ia < palA.length) segs.push({ tipo: "del", texto: palA.slice(ia).join(" ") });

  // Junta ins/ins e del/del separados so por espaco; o espaco entre eles entra no elemento.
  const saida: string[] = [];
  let atual: { tipo: "ins" | "del"; texto: string } | null = null;
  let espera = "";
  const fechar = (): void => {
    if (!atual) return;
    saida.push(atual.tipo === "ins" ? ins(atual.texto) : del(atual.texto), espera);
    atual = null;
    espera = "";
  };
  for (const s of segs) {
    if (s.tipo === "igual") {
      if (atual && ehEspaco(s.texto) && !espera) {
        espera = s.texto;
        continue;
      }
      fechar();
      saida.push(s.texto);
    } else if (atual && atual.tipo === s.tipo) {
      atual.texto += espera + s.texto;
      espera = "";
    } else {
      fechar();
      atual = { tipo: s.tipo, texto: s.texto };
    }
  }
  fechar();
  return saida.join("");
}
