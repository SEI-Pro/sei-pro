import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { checar, secao } from "./util";

export function verificarBaseCss(): void {
  secao("folha base");
  const css = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "..", "estatico", "base.css"), "utf8");
  const semComentario = css.replace(/\/\*[\s\S]*?\*\//g, "");
  checar(
    "nenhuma cor literal (#hex, rgb(), hsl())",
    !/#[0-9a-f]{3,8}\b|rgba?\(|hsla?\(/i.test(semComentario.replace(/\[[a-z-]+[*^$|~]?="[^"]*"(?:\s+[is])?\]/gi, "")),
  );
  checar("sem recurso externo", !/@import|url\((?!\s*["']?data:)/i.test(semComentario));
  const seletores = semComentario
    .split("{")
    .slice(0, -1)
    .map((b) => b.split("}").pop() ?? "")
    // as vírgulas de dentro de :is()/:has()/:not() não separam seletores
    .map((b) => b.replace(/\((?:[^()]|\([^()]*\))*\)/g, "()"))
    .join(",")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const fora = seletores.filter((s) => !s.startsWith(":root[data-spro-tema-ativo]") && !s.startsWith(':root[data-spro-tema="escuro"]'));
  checar(
    "todo seletor fica sob o tema ativo (:root[data-spro-tema-ativo] ou o atributo de esquema, que so existe com ele ligado)",
    fora.length === 0,
    fora.slice(0, 3),
  );
  // !important so nas regras que vencem os esquemas de cor do SEI (que o usam).
  const comImportante = semComentario
    .split("}")
    .filter((bloco) => /!important/.test(bloco))
    .map((bloco) => bloco.split("{")[0]?.trim() ?? "");
  const proibidas = comImportante.filter(
    (sel) =>
      !/\.infraCor|sparkling-modal-title|pesquisaPaginaSelecionada|infraAcaoBarraConjugada|body\.cke_editable|openNewTab|checkNaoAssinados|infraTrAtrasada|infraTdAtrasada|infraTrVermelha|infraTrAlerta|f5f6f7|infraMenu|data-ref|tool-item|tool-container|tool-items|infraTrSelecionada|infraTdSelecionada|table\.tablesorter|table\.infraTable|infraTrMarcada|infraTdMarcada|ed1c24|d8f5b9|tabelaOpcoes|tdOpcaoSigiloso|input-label-first|input-label-second|divComandos|divBotoesControleProcessos|divConsultarAndamento|panelDadosArvore|stickDadosArvore|divRelacionados/.test(
        sel,
      ),
  );
  checar("!important so nas classes de tema do SEI (.infraCor*, modal, paginacao)", proibidas.length === 0, proibidas.slice(0, 3));
}

export function verificarCascaCss(): void {
  for (const arquivo of ["casca", "controles"]) verificarFolhaSemExcecoes(arquivo);
  const casca = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "..", "estatico", "casca.css"), "utf8");
  checar(
    "casca: menu recolhido (.infraAreaTelaEEscondeGrande) zera border-right para offsetWidth ser 0 no infraClicarMenuBootstrap",
    /#divInfraAreaTelaE\.infraAreaTelaEEscondeGrande\s*\{\s*border-right:\s*0/.test(casca),
  );
}

function verificarFolhaSemExcecoes(arquivo: string): void {
  secao(`folha ${arquivo}`);
  const css = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "..", "estatico", `${arquivo}.css`), "utf8");
  const semComentario = css.replace(/\/\*[\s\S]*?\*\//g, "");
  checar(`${arquivo}: nenhuma cor literal`, !/#[0-9a-f]{3,8}\b|rgba?\(|hsla?\(/i.test(semComentario));
  checar(`${arquivo}: sem recurso externo`, !/@import|url\((?!\s*["']?data:)/i.test(semComentario));
  checar(`${arquivo}: sem !important`, !/!important/.test(semComentario));
  const seletores = semComentario
    .split("{")
    .slice(0, -1)
    .map((b) => b.split("}").pop() ?? "")
    // as vírgulas de dentro de :is()/:has()/:not() não separam seletores
    .map((b) => b.replace(/\((?:[^()]|\([^()]*\))*\)/g, "()"))
    .join(",")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const fora = seletores.filter((s) => !s.startsWith(":root[data-spro-tema-ativo]") && !/^(@keyframes|from|to|\d+%)/.test(s));
  checar(`${arquivo}: todo seletor fica sob o tema ativo`, fora.length === 0, fora.slice(0, 3));
}
