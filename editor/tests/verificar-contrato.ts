import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { RECURSOS } from "../src/recursos/indice";
import type { Contexto } from "../src/recursos/tipos";
import { contratoDoModulo } from "./contrato";
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
  igual("page-break (real): o monolito chama getPageBreak", modulo("page-break").necessarios, ["getPageBreak"]);
  igual("align (real): setAlignText, openAlignText e closeAlignText", modulo("align").necessarios.sort(), [
    "closeAlignText",
    "openAlignText",
    "setAlignText",
  ]);
  checar(
    "table-styles (real): inclui o que o context-menu legado chama",
    ["getSyleSelectedTable", "openDialogSyleTable"].every((n) => modulo("table-styles").necessarios.includes(n)),
  );

  secao("contrato de nomes globais (recursos TS)");
  const { doc, win } = paginaFalsa();
  const ctx: Contexto = { adaptador: {} as Contexto["adaptador"], doc, win, base: "", checkOpcao: () => true, verifyOpcao: () => false };
  for (const r of RECURSOS) {
    const { necessarios } = contratoDoModulo(DIST_REAL, r.id);
    const globais = Object.keys(r.globais(ctx));
    igual(
      `recurso ${r.id}: exporta todo global que o legado ainda chama`,
      necessarios.filter((n) => !globais.includes(n)),
      [],
    );
  }
}
