import { readFileSync } from "node:fs";
import * as acorn from "acorn";
import { parseHTML } from "linkedom";
import { ATRIBUTO_CEDENCIA } from "../src/contrato";
import { executarInit } from "../src/ponte/executar";
import { IDS_RECURSOS } from "../src/recursos/ids";
import { checar, igual, secao } from "./util";

const ADAPTER = new URL("../../dist/js/sei-pro-editor-adapter.js", import.meta.url);

interface No {
  type: string;
  start: number;
  end: number;
  id?: { name: string };
  declarations?: Array<{ id: { name: string }; init: No }>;
  [k: string]: unknown;
}

/** Acha, no codigo do adapter legado, a funcao `loadModules` e a lista `MODULES` (sem executar o adapter). */
function extrairDoAdapter(): { fonteLoad: string; modulos: string[] } {
  const fonte = readFileSync(ADAPTER, "utf8");
  const ast = acorn.parse(fonte, { ecmaVersion: "latest" }) as unknown as No;
  let fonteLoad = "";
  let fonteModulos = "";
  const visita = (n: unknown): void => {
    if (!n || typeof n !== "object") return;
    if (Array.isArray(n)) {
      n.forEach(visita);
      return;
    }
    const no = n as No;
    if (no.type === "FunctionDeclaration" && no.id?.name === "loadModules") fonteLoad = fonte.slice(no.start, no.end);
    if (no.type === "VariableDeclaration") {
      for (const d of no.declarations ?? []) if (d.id.name === "MODULES") fonteModulos = fonte.slice(d.init.start, d.init.end);
    }
    for (const k of Object.keys(no)) if (k !== "type") visita(no[k]);
  };
  visita(ast);
  return { fonteLoad, modulos: new Function(`return ${fonteModulos}`)() as string[] };
}

/** Executa o `loadModules` do legado com o `<html>` marcado como `atributo` (null = sem atributo); devolve o que ele pediu. */
function rodar(fonteLoad: string, modulos: string[], atributo: string | null): string[] {
  const { document } = parseHTML("<html><body></body></html>");
  if (atributo !== null) document.documentElement.setAttribute(ATRIBUTO_CEDENCIA, atributo);
  const pedidos: string[] = [];
  const jq = { getScript: (url: string) => pedidos.push(url.replace("BASE/js/modules/editor/", "")) };
  const janela = { jQuery: jq };
  const fn = new Function("MODULES", "resolveExtBase", "window", "document", `${fonteLoad}; return loadModules;`);
  fn(modulos, () => "BASE/", janela, document)();
  return pedidos;
}

export function verificarCedencia(): void {
  secao("cedencia: loadModules do adapter legado");
  const { fonteLoad, modulos } = extrairDoAdapter();
  checar("achou loadModules e MODULES no adapter legado", fonteLoad.length > 0 && modulos.length > 20);

  igual("sem atributo: pede todos os modulos", rodar(fonteLoad, modulos, null), modulos);
  const sem = rodar(fonteLoad, modulos, "page-break,checkbox");
  checar("com 'page-break,checkbox': nao pede esses dois", !sem.includes("page-break.js") && !sem.includes("checkbox.js"));
  igual("com 'page-break,checkbox': pede os demais", sem.length, modulos.length - 2);
  igual("atributo vazio: pede todos", rodar(fonteLoad, modulos, ""), modulos);
  igual("id desconhecido: pede todos", rodar(fonteLoad, modulos, "inexistente"), modulos);
  checar(
    "todo id de IDS_RECURSOS e um modulo legado de MODULES",
    IDS_RECURSOS.every((id) => modulos.includes(`${id}.js`)),
  );

  secao("cedencia: init_editor.js");
  const novo = () => parseHTML("<!doctype html><html><head></head><body></body></html>").document as unknown as Document;
  const runtime = { getURL: (c: string) => `chrome-extension://abc/${c}` };

  const d1 = novo();
  const ordem: string[] = [];
  const anexar = d1.head.append.bind(d1.head);
  d1.head.append = ((...nos: Node[]) => {
    ordem.push(`anexou:${d1.documentElement.getAttribute(ATRIBUTO_CEDENCIA)}`);
    return anexar(...nos);
  }) as typeof d1.head.append;
  executarInit(d1, ["page-break", "checkbox"], runtime);
  igual("o atributo e gravado ANTES de o script ser anexado", ordem, ["anexou:page-break,checkbox"]);
  const s = d1.querySelector("script");
  igual("o script aponta para o bundle da pagina", s?.getAttribute("src"), "chrome-extension://abc/js/editor/pagina.js");
  igual("o script leva a base da extensao em data-base", s?.getAttribute("data-base"), "chrome-extension://abc/");

  executarInit(d1, ["page-break", "checkbox"], runtime);
  igual("segunda execucao nao injeta o script de novo", d1.querySelectorAll("script").length, 1);

  const d2 = novo();
  executarInit(d2, [], runtime);
  checar(
    "sem ids: nao grava atributo e nao injeta",
    d2.documentElement.getAttribute(ATRIBUTO_CEDENCIA) === null && !d2.querySelector("script"),
  );
}
