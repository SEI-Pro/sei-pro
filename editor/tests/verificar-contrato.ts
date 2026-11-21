import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { RECURSOS } from "../src/recursos/indice";
import type { Contexto } from "../src/recursos/tipos";
import { contratoDoModulo, nomesReferenciados } from "./contrato";
import { paginaFalsa } from "./falsos";
import { checar, igual, secao } from "./util";

const DIST_REAL = fileURLToPath(new URL("../../dist", import.meta.url));

function distFalso(arquivos: Record<string, string>): string {
  const raiz = mkdtempSync(join(tmpdir(), "spro-contrato-"));
  mkdirSync(join(raiz, "js", "modules", "editor"), { recursive: true });
  for (const [nome, conteudo] of Object.entries(arquivos)) writeFileSync(join(raiz, nome), conteudo);
  return raiz;
}

export function verificarContrato(): void {
  secao("contrato de nomes globais (detector)");

  const fix = distFalso({
    "js/modules/editor/foo.js":
      "(function(){ window.foo = function(){}; window.soNoModulo = function(){}; window.viaWindow = function(){}; window.emComentario = function(){}; window.chave = function(){}; window.prop = function(){}; })();",
    "js/sei-pro-editor.js":
      "function x(){ foo(this); window.viaWindow(); var o = { chave: 1 }; o.prop(); } // emComentario()\n/* emComentario() */",
  });
  const c = contratoDoModulo(fix, "foo");
  igual("exportados: todo window.X = ...", c.exportados.sort(), ["chave", "emComentario", "foo", "prop", "soNoModulo", "viaWindow"]);
  igual(
    "necessarios: so os chamados por codigo vivo de outro arquivo (comentario, chave de objeto e .prop nao contam)",
    c.necessarios.sort(),
    ["foo", "viaWindow"],
  );

  const modulo = (id: string) => contratoDoModulo(DIST_REAL, id);
  igual("ref-interna (real): o monolito chama getRefInterna", modulo("ref-interna").necessarios, ["getRefInterna"]);
  igual("link-pro (real): getDialogLinkPro, hideLinkTips e showLinkTips", modulo("link-pro").necessarios.sort(), [
    "getDialogLinkPro",
    "hideLinkTips",
    "showLinkTips",
  ]);
  checar(
    "table-styles (real): inclui o que o context-menu legado chama",
    ["getSyleSelectedTable", "openDialogSyleTable"].every((n) => modulo("table-styles").necessarios.includes(n)),
  );

  secao("monolito: nenhuma chamada direta a global do TS em caminho de boot, clique ou blur do editor");
  // Sem o bundle (falha de carga, manifest de marca sem o bloco), uma chamada DIRETA lancaria ReferenceError e
  // abortaria o handler/initFunctions inteiro do editor legado. Por isso o monolito chama por window[nome] com guarda.
  const chamadasDiretas = nomesReferenciados(
    `${DIST_REAL}/js/sei-pro-editor.js`,
    new Set(["hideQuickTable", "closeAlignText", "initFolhaEditorPro"]),
  );
  igual("hideQuickTable, closeAlignText e initFolhaEditorPro so via chamarRecursoTsPro", [...chamadasDiretas], []);

  secao("contrato de nomes globais (recursos TS)");
  const { doc, win } = paginaFalsa();
  const ctx: Contexto = { adaptador: {} as Contexto["adaptador"], doc, win, base: "", checkOpcao: () => true, verifyOpcao: () => false };
  // Os modulos legados portados foram APAGADOS (Task 28): o contrato deles fica congelado em
  // tests/contrato-legado.json (gerado antes da remocao, com o detector acima). Modulo que ainda existe e usa o detector ao vivo.
  const congelado = JSON.parse(readFileSync(fileURLToPath(new URL("./contrato-legado.json", import.meta.url)), "utf8")) as Record<
    string,
    { necessarios: string[] }
  >;
  igual("o contrato congelado cobre exatamente os recursos portados", Object.keys(congelado).sort(), RECURSOS.map((r) => r.id).sort());
  for (const r of RECURSOS) {
    const { necessarios } = congelado[r.id] ?? contratoDoModulo(DIST_REAL, r.id);
    const globais = Object.keys(r.globais(ctx));
    igual(
      `recurso ${r.id}: exporta todo global que o legado ainda chama`,
      necessarios.filter((n) => !globais.includes(n)),
      [],
    );
  }
}
