import { criarAdaptador } from "../../src/adaptador";
import { REGRA_TAGS, REGRAS_ATRIBUTOS_PROIBIDOS, recurso, URL_EXECUTAVEL } from "../../src/recursos/ghs-unlock";
import type { Contexto } from "../../src/recursos/tipos";
import { criarCk4, criarCk5, type FalsoCk5 } from "../falsos";
import { checar, igual, secao } from "../util";

type Chamada = [string, ...unknown[]];

/** Instala no editor CK5 falso os plugins que o ghs-unlock usa e devolve o registro do que foi chamado. */
function comGhs(f: FalsoCk5) {
  const ed = f.instancia() as unknown as Record<string, unknown>;
  const chamadas: Chamada[] = [];
  const registra =
    (nome: string) =>
    (...a: unknown[]) => {
      chamadas.push([nome, ...a]);
    };
  const plugins: Record<string, unknown> = {
    DataFilter: {
      allowElement: registra("allowElement"),
      allowAttributes: registra("allowAttributes"),
      disallowAttributes: registra("disallowAttributes"),
    },
    GeneralHtmlSupport: {
      addModelHtmlClass: registra("addModelHtmlClass"),
      removeModelHtmlClass: registra("removeModelHtmlClass"),
      setModelHtmlStyles: registra("setModelHtmlStyles"),
      setModelHtmlAttributes: registra("setModelHtmlAttributes"),
      getGhsAttributeNameForElement: (t: string) => `html${t.toUpperCase()}Attributes`,
    },
    Salvar: { isDirty: false, resetDirty: registra("resetDirty") },
  };
  ed.plugins = { has: (n: string) => n in plugins, get: (n: string) => plugins[n] };
  ed.conversion = { for: () => ({ add: registra("conversor") }) };
  ed.getFullData = () => ({ corpo: "<p>atual</p>" });
  const view = ed.editing as { mapper: Record<string, unknown> };
  view.mapper.toViewElement = () => ({ name: "p" });
  const dataSet = f.instancia().data.set.bind(f.instancia().data);
  f.instancia().data.set = (v: string | Record<string, string>) => {
    chamadas.push(["data.set", v]);
    dataSet(v);
  };
  (ed.model as { document: { history: unknown } }).document.history = { getOperations: () => [] };
  return { chamadas, ed };
}

function ctx(f: { win: Window; doc: Document }): Contexto {
  return { adaptador: criarAdaptador(f.win), doc: f.doc, win: f.win, base: "", checkOpcao: () => true, verifyOpcao: () => false };
}

const nomes = (ch: Chamada[]) => ch.map((c) => c[0]);

export async function verificarGhsUnlock(): Promise<void> {
  secao("recurso ghs-unlock");
  checar(
    "TAGS liberadas incluem p, span, table e img",
    ["p", "span", "table", "img"].every((t) => REGRA_TAGS.test(t)),
  );
  checar(
    "TAGS liberadas NAO incluem script, iframe, object nem form",
    ["script", "iframe", "object", "form"].every((t) => !REGRA_TAGS.test(t)),
  );

  for (const perigoso of [
    "javascript:alert(1)",
    "JaVaScRiPt:alert(1)",
    "  javascript:alert(1)",
    "\u0001\u0002javascript:alert(1)",
    "java\tscript:alert(1)",
    "java\nscr\r\nipt:alert(1)",
    "j\ta\tv\ta\ts\tc\tr\ti\tp\tt:alert(1)",
    "vbscript:msgbox(1)",
    "live\tscript:x",
    "data:text/html,<script>alert(1)</script>",
    "data : text/html;base64,AAA",
    "da\tta:text/ht\nml,x",
  ]) {
    checar(`URL executavel bloqueada: ${JSON.stringify(perigoso)}`, URL_EXECUTAVEL.test(perigoso));
  }
  for (const seguro of [
    "https://sei.antaq.gov.br/x",
    "http://javascript.com/a",
    "mailto:a@b.gov.br",
    "#ancora",
    "/rota/relativa",
    "./x.html",
    "data:image/png;base64,AAA",
    "",
  ]) {
    checar(`URL segura nao e bloqueada: ${JSON.stringify(seguro)}`, !URL_EXECUTAVEL.test(seguro));
  }
  checar("a regra de atributos proibidos usa essa mesma expressao", REGRAS_ATRIBUTOS_PROIBIDOS[1]?.attributes[0]?.value === URL_EXECUTAVEL);

  {
    const f = criarCk5({ secoes: [{ raiz: "corpo", label: "Corpo do Texto", html: "<p id='p1'>um</p>", principal: true }] });
    const { chamadas } = comGhs(f);
    const c = ctx(f);
    const ghs = recurso.globais(c).SeiProGhs as Record<string, (...a: unknown[]) => unknown>;
    const p1 = f.elemento("corpo").querySelector("#p1") as Element;

    checar("estaLiberado e false antes de liberar", ghs.estaLiberado() === false);
    checar("liberar devolve true", ghs.liberar() === true);
    ghs.liberar();
    igual("liberar e idempotente: allowElement so uma vez", nomes(chamadas).filter((n) => n === "allowElement").length, 1);
    igual(
      "liberar poe as 3 regras de atributos separadas (attributes, classes, styles)",
      nomes(chamadas).filter((n) => n === "allowAttributes").length,
      3,
    );
    igual("liberar poe as 2 regras proibidas (on* e URL executavel)", nomes(chamadas).filter((n) => n === "disallowAttributes").length, 2);
    checar("estaLiberado e true depois", ghs.estaLiberado() === true);
    checar("registra o conversor de downcast uma vez", nomes(chamadas).filter((n) => n === "conversor").length === 1);

    chamadas.length = 0;
    checar("addClasse devolve true", ghs.addClasse(p1, "x") === true);
    igual(
      "addClasse chama addModelHtmlClass('p', 'x', item) uma vez",
      [chamadas[0]?.[0], chamadas[0]?.[1], chamadas[0]?.[2]],
      ["addModelHtmlClass", "p", "x"],
    );
    ghs.removeClasse(p1, "x");
    ghs.setEstilos(p1, { color: "red" });
    ghs.setAtributos(p1, { "data-a": "1" });
    igual("removeClasse, setEstilos e setAtributos chamam o metodo certo do GHS", nomes(chamadas).slice(1), [
      "removeModelHtmlClass",
      "setModelHtmlStyles",
      "setModelHtmlAttributes",
    ]);

    chamadas.length = 0;
    let lancou = false;
    let r: unknown;
    try {
      r = ghs.addClasse(f.doc.createElement("div"), "x"); // fora do editor: sem mapeamento para o model
    } catch {
      lancou = true;
    }
    checar("alvo fora do editor devolve false sem lancar", r === false && !lancou && chamadas.length === 0);
  }

  {
    // ativacao automatica: reprocessa o conteudo sem deixar o documento "sujo"
    const f = criarCk5({ secoes: [{ raiz: "corpo", label: "Corpo do Texto", html: "<p>x</p>", principal: true }] });
    const { chamadas } = comGhs(f);
    recurso.iniciar?.(ctx(f));
    igual("iniciar no CK5: reprocessa o conteudo com data.set uma vez", nomes(chamadas).filter((n) => n === "data.set").length, 1);
    igual("iniciar no CK5: devolve o estado 'sem alteracoes' (resetDirty)", nomes(chamadas).includes("resetDirty"), true);
  }

  {
    const f = criarCk5({ secoes: [{ raiz: "corpo", label: "Corpo do Texto", html: "<p>x</p>", principal: true }] });
    const { chamadas } = comGhs(f);
    (f.win as unknown as Record<string, unknown>).SEIPRO_GHS_AUTO = false;
    recurso.iniciar?.(ctx(f));
    igual(
      "SEIPRO_GHS_AUTO=false: libera as regras mas NAO chama data.set",
      [nomes(chamadas).includes("allowElement"), nomes(chamadas).includes("data.set")],
      [true, false],
    );
  }

  {
    const f = criarCk4({ secoes: [{ nome: "txaEditor_1", titulo: "Corpo do Texto", html: "<p>x</p>" }] });
    const ghs = recurso.globais(ctx(f)).SeiProGhs as Record<string, (...a: unknown[]) => unknown>;
    igual(
      "CK4: liberar, addClasse, setEstilos e setAtributos devolvem false",
      [ghs.liberar(), ghs.addClasse(null, "x"), ghs.setEstilos(null, {}), ghs.setAtributos(null, {})],
      [false, false, false, false],
    );
    let lancou = false;
    try {
      recurso.iniciar?.(ctx(f));
    } catch {
      lancou = true;
    }
    checar("CK4: iniciar e no-op e nao lanca", !lancou);
  }
}
