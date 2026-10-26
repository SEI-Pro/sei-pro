// Regera personalizar-legado.json a partir do legado (dist/js/sei-functions-pro.js): node tests/fixtures/extrair-personalizar.mjs
import { readFileSync, writeFileSync } from "node:fs";
import vm from "node:vm";
const fonte = readFileSync(new URL("../../../dist/js/sei-functions-pro.js", import.meta.url), "utf8");
const pega = (nome) => {
  const i = fonte.indexOf(`var ${nome} = [`);
  const f = fonte.indexOf("];", i) + 1;
  return vm.runInNewContext(fonte.slice(i + `var ${nome} = `.length, f));
};
const defaults = {};
const dm = (re) => { const m = re.exec(fonte); return m ? m[1] : null; };
const saida = {
  iconsFlashMenu: pega("iconsFlashMenu"),
  iconsFlashDocMenu: pega("iconsFlashDocMenu"),
  iconsFlashDocArvore: pega("iconsFlashDocArvore"),
  iconsFlashPanelArvore: pega("iconsFlashPanelArvore"),
};
writeFileSync(new URL("./personalizar-legado.json", import.meta.url), JSON.stringify(saida, null, 2) + "\n");
console.log(Object.fromEntries(Object.entries(saida).map(([k, v]) => [k, v.length])));
