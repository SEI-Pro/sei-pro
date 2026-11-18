/**
 * Caixa da unidade no SEI 4.0.x: sem `aria-label` no checkbox, tipo e
 * especificação só existem no tooltip da âncora do processo
 * (`infraTooltipMostrar('Especificação', 'Tipo')`). Caso reportado no PR #189
 * (SEI 4.0.12 do IFPR), que mostrava tudo em "Sem tipo".
 */

import { DOMParser } from "linkedom";
import { lerLinhaCaixa } from "../src/dominio/caixa";
import { checar, secao } from "./util";

function linha(extra: string, rotulo = ""): Element {
  const aria = rotulo ? ` aria-label="${rotulo}"` : "";
  const html = `<table><tr id="P1"><td><input type="checkbox" value="1" title="123.456/2026-01"${aria}></td><td></td>
    <td><a href="controlador.php?acao=procedimento_trabalhar&id_procedimento=1" ${extra}>123.456/2026-01</a></td><td></td></tr></table>`;
  return new DOMParser().parseFromString(html, "text/html").querySelector("tr") as unknown as Element;
}

export async function verificarCaixaSei40(): Promise<void> {
  secao("caixa da unidade: SEI 4.0 (tooltip)");
  const a = lerLinhaCaixa(linha(`onmouseover="return infraTooltipMostrar('Contrato 1/2026', 'Licitação: Pregão');"`), "recebidos");
  checar("tipo e especificação do tooltip", a?.tipo === "Licitação: Pregão" && a.especificacao === "Contrato 1/2026", a);
  const b = lerLinhaCaixa(linha(`onmouseover="return infraTooltipMostrar('D\\'Ávila e filhos', 'Pessoal: Diária');"`), "recebidos");
  checar("aspas escapadas viram o caractere", b?.especificacao === "D'Ávila e filhos", b);
  const c = lerLinhaCaixa(linha(`onmouseover="return infraTooltipMostrar('só um texto');"`), "recebidos");
  checar("tooltip de um argumento não vira tipo", c?.tipo === "" && c.especificacao === "", c);
  const d = lerLinhaCaixa(linha(`onmouseover="return infraTooltipMostrar('outra', 'Outro');"`, "Tipo Pregão / Especificação Objeto"), "recebidos");
  checar("aria-label do SEI 4.1 continua mandando", d?.tipo === "Pregão" && d.especificacao === "Objeto", d);
  const e = lerLinhaCaixa(linha(`onmouseover="return infraTooltipMostrar('Segredo', 'Tipo X');"`, "Sigiloso Tipo X"), "recebidos");
  checar("sigiloso não expõe a especificação", e?.sigiloso === true && e.especificacao === "", e);
}
