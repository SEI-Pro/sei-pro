import { criarAdaptador } from "../src/adaptador";
import { htmlParaNos } from "../src/adaptador/html";
import type { Contexto } from "../src/recursos/tipos";
import { ancorarNoInicio, nomeDaAncora } from "../src/util/ancoras";
import { type EstiloDeTabela, estilizarTabela, estiloParaObjeto, planoDaTabela } from "../src/util/tabelas";
import { type CasoEditor, criarCk4, criarCk5, type FalsoCk4, type FalsoCk5, nosDoisEditores } from "./falsos";
import { checar, igual, secao } from "./util";

const ctxDe = (c: { win: Window; doc: Document }): Contexto => ({
  adaptador: criarAdaptador(c.win),
  doc: c.doc,
  win: c.win,
  base: "",
  checkOpcao: () => true,
  verifyOpcao: () => false,
});

const ESTILO: EstiloDeTabela = {
  table: "border-collapse:collapse;width:80%;",
  trCabecalho: "background:#0f0;",
  tr: ["background:#fff;", "background:#eee;"],
  tdCabecalho: "color:#fff;",
  td: "border:1px solid #000;",
  tdPrimeira: "font-weight:bold;",
  pCabecalho: "Tabela_Texto_Centralizado",
  p: "Tabela_Texto_Alinhado_Esquerda",
  cabecalho: false,
};

function corpoDe(c: CasoEditor): HTMLElement {
  return c.versao === 4 ? (c.ed as FalsoCk4).instancia("txaEditor_1").corpo : (c.ed as FalsoCk5).elemento("main");
}

export async function verificarUtilAncorasETabelas(): Promise<void> {
  secao("util tabelas: estilo e plano");
  igual(
    "estiloParaObjeto separa propriedades e valores (com ':' dentro do valor)",
    estiloParaObjeto("border:1px solid red; background: url(http://x/y.png);width:50%;"),
    {
      border: "1px solid red",
      background: "url(http://x/y.png)",
      width: "50%",
    },
  );
  igual("estiloParaObjeto de vazio", estiloParaObjeto(""), {});
  const plano = planoDaTabela(ESTILO, 4, 2);
  igual(
    "plano: linha 0 e cabecalho (tr, td e p de cabecalho)",
    [plano.linhas[0]?.tr, plano.linhas[0]?.celulas.map((x) => x.td), plano.linhas[0]?.celulas.map((x) => x.p)],
    ["background:#0f0;", ["color:#fff;", "color:#fff;"], ["Tabela_Texto_Centralizado", "Tabela_Texto_Centralizado"]],
  );
  igual(
    "plano: linhas alternam tr[0] (impar) e tr[1] (par)",
    [plano.linhas[1]?.tr, plano.linhas[2]?.tr, plano.linhas[3]?.tr],
    ["background:#fff;", "background:#eee;", "background:#fff;"],
  );
  igual(
    "plano: 1a coluna das linhas de dados usa tdPrimeira; as demais, td",
    [plano.linhas[1]?.celulas.map((x) => x.td), plano.linhas[2]?.celulas[0]?.td],
    [["font-weight:bold;", "border:1px solid #000;"], "font-weight:bold;"],
  );
  const unico = planoDaTabela({ ...ESTILO, tr: "background:#abc;" }, 3, 1);
  igual(
    "plano: tr string (sem alternancia) vale para todas as linhas de dados",
    [unico.linhas[1]?.tr, unico.linhas[2]?.tr],
    ["background:#abc;", "background:#abc;"],
  );

  secao("util ancoras e estilizarTabela (CK4 e CK5)");
  await nosDoisEditores("ancoras", (c: CasoEditor) => {
    const v = `[CK${c.versao}]`;
    const ctx = ctxDe(c);
    const corpo = corpoDe(c);
    corpo.replaceChildren(...htmlParaNos(corpo.ownerDocument, '<p id="t">titulo</p><p>texto</p>'));
    const p = corpo.querySelector("#t") as HTMLElement;
    const ed = ctx.adaptador.getInstance() as object;
    const chamadas: unknown[][] = [];
    (c.win as unknown as Record<string, unknown>).SeiProGhs = { setAtributos: (...a: unknown[]) => (chamadas.push(a), true) };
    if (c.versao === 4) (c.ed as FalsoCk4).selecionar("txaEditor_1", { elemento: p });
    else (c.ed as FalsoCk5).selecionar({ raiz: "main", elemento: p, blocos: [p] });

    checar(`ancoras ${v}: ancorarNoInicio devolve true`, ancorarNoInicio(ctx, ed, p, "bookmark-abc", "seipro-bookmark") === true);
    if (c.versao === 4) {
      igual(
        `ancoras ${v}: CK4 poe <a name class> VAZIA no INICIO do elemento`,
        [
          p.firstElementChild?.tagName,
          p.firstElementChild?.getAttribute("name"),
          p.firstElementChild?.getAttribute("class"),
          p.firstElementChild?.childNodes.length,
        ],
        ["A", "bookmark-abc", "seipro-bookmark", 0],
      );
      ancorarNoInicio(ctx, ed, p, "bookmark-xyz", "seipro-bookmark");
      igual(
        `ancoras ${v}: de novo troca a ancora da mesma classe (nao duplica)`,
        [p.querySelectorAll("a.seipro-bookmark").length, p.querySelector("a.seipro-bookmark")?.getAttribute("name")],
        [1, "bookmark-xyz"],
      );
      igual(`ancoras ${v}: nomeDaAncora le o name da ancora`, nomeDaAncora(p, "bookmark-"), "bookmark-xyz");
    } else {
      igual(
        `ancoras ${v}: CK5 poe o id no proprio elemento (a <a name> nao sobrevive no CK5)`,
        [chamadas.length, chamadas[0]?.[0] === p, chamadas[0]?.[1]],
        [1, true, { id: "bookmark-abc" }],
      );
      p.id = "bookmark-abc";
      igual(`ancoras ${v}: nomeDaAncora le o id`, nomeDaAncora(p, "bookmark-"), "bookmark-abc");
    }
    igual(`ancoras ${v}: nomeDaAncora sem o prefixo devolve null`, nomeDaAncora(p, "RefPro_"), null);
  });

  {
    const ck4 = criarCk4({
      secoes: [
        { nome: "txaEditor_1", titulo: "Cabeçalho", html: '<p id="c">cab</p>', somenteLeitura: true },
        { nome: "txaEditor_2", titulo: "Corpo do Texto", html: "<p>corpo</p>" },
      ],
    });
    const ctx = ctxDe(ck4);
    let recusas = 0;
    ctx.adaptador.aoRecusarEscrita(() => {
      recusas += 1;
    });
    const cab = ck4.instancia("txaEditor_1");
    const pc = cab.corpo.querySelector("#c") as HTMLElement;
    igual(
      "ancoras [CK4]: em secao somente leitura devolve false, recusa e nao escreve",
      [ancorarNoInicio(ctx, cab, pc, "bookmark-1", "seipro-bookmark"), recusas, pc.querySelector("a")],
      [false, 1, null],
    );

    const ck5 = criarCk5({
      secoes: [
        { raiz: "cab", label: "Cabeçalho", html: '<p id="c">cab</p>', somenteLeitura: true },
        { raiz: "main", label: "Corpo do Texto", html: "<p>corpo</p>", principal: true },
      ],
    });
    const ctx5 = ctxDe(ck5);
    let recusas5 = 0;
    ctx5.adaptador.aoRecusarEscrita(() => {
      recusas5 += 1;
    });
    const spy: unknown[][] = [];
    (ck5.win as unknown as Record<string, unknown>).SeiProGhs = { setAtributos: (...a: unknown[]) => (spy.push(a), true) };
    const pc5 = ck5.elemento("cab").querySelector("#c") as HTMLElement;
    igual(
      "ancoras [CK5]: em raiz somente leitura devolve false, recusa e nao chama o GHS",
      [ancorarNoInicio(ctx5, ck5.instancia(), pc5, "bookmark-1"), recusas5, spy.length],
      [false, 1, 0],
    );
  }

  const TABELA =
    "<table><tbody><tr><td><p>a</p></td><td>b</td></tr><tr><td><p>c</p></td><td><p>d</p></td></tr><tr><td>e</td><td>f</td></tr></tbody></table>";
  {
    const ck4 = criarCk4({ secoes: [{ nome: "txaEditor_1", titulo: "Corpo do Texto", html: "<p>x</p>" }] });
    const ctx = ctxDe(ck4);
    const ed4 = ck4.instancia("txaEditor_1");
    ed4.corpo.replaceChildren(...htmlParaNos(ed4.corpo.ownerDocument, TABELA));
    const tabela = ed4.corpo.querySelector("table") as HTMLElement;
    estilizarTabela(ctx, ed4, tabela, { ...ESTILO, cabecalho: true });
    const trs = [...tabela.querySelectorAll("tr")];
    igual(
      "tabela [CK4]: estilo da tabela e dos tr (cabecalho, impar, par)",
      [tabela.getAttribute("style"), trs.map((t) => t.getAttribute("style"))],
      ["border-collapse:collapse;width:80%;", ["background:#0f0;", "background:#fff;", "background:#eee;"]],
    );
    igual(
      "tabela [CK4]: td do cabecalho, 1a coluna e demais",
      [
        trs[0]?.querySelectorAll("td")[0]?.getAttribute("style"),
        trs[1]?.querySelectorAll("td")[0]?.getAttribute("style"),
        trs[1]?.querySelectorAll("td")[1]?.getAttribute("style"),
      ],
      ["color:#fff;", "font-weight:bold;", "border:1px solid #000;"],
    );
    igual(
      "tabela [CK4]: p de cada celula tem a classe (e a celula sem <p> ganha um com o conteudo)",
      [
        trs[0]?.querySelectorAll("p")[0]?.getAttribute("class"),
        trs[0]?.querySelectorAll("p")[1]?.textContent,
        trs[1]?.querySelectorAll("p")[1]?.getAttribute("class"),
      ],
      ["Tabela_Texto_Centralizado", "b", "Tabela_Texto_Alinhado_Esquerda"],
    );
    igual(
      "tabela [CK4]: cabecalho move a 1a linha para <thead>",
      [tabela.querySelector("thead tr td")?.textContent, tabela.querySelectorAll("thead tr").length],
      ["a", 1],
    );
    igual("tabela [CK4]: um passo de desfazer (2 snapshots)", ed4.snapshots, 2);
  }
  {
    const ck5 = criarCk5({ secoes: [{ raiz: "main", label: "Corpo do Texto", html: "<p>x</p>", principal: true }] });
    const ctx = ctxDe(ck5);
    const ed = ck5.instancia();
    const corpo = ck5.elemento("main");
    corpo.replaceChildren(...htmlParaNos(corpo.ownerDocument, `<figure class="table">${TABELA}</figure>`));
    const chamadas: unknown[][] = [];
    const ghs = {
      setModelHtmlStyles: (...a: unknown[]) => chamadas.push(["estilos", ...a, ed.profundidade]),
      setModelHtmlAttributes: (...a: unknown[]) => chamadas.push(["atributos", ...a, ed.profundidade]),
    };
    Object.assign(ed, { plugins: { has: (n: string) => n === "GeneralHtmlSupport", get: () => ghs } });
    const tabela = corpo.querySelector("table") as HTMLElement;
    ck5.selecionar({ raiz: "main", elemento: tabela.querySelector("p") });
    estilizarTabela(ctx, ed, tabela, { ...ESTILO, cabecalho: true });
    const nomes = chamadas.map((x) => `${x[0]}:${x[1]}`);
    checar(
      "tabela [CK5]: GHS no model 'table' (o elemento que tem a tabela, nao o <table> do DOM)",
      nomes[0] === "estilos:table" && (chamadas[0]?.[3] as { elemento: Element } | undefined)?.elemento === corpo.querySelector("figure"),
    );
    igual("tabela [CK5]: estilo da tabela convertido em objeto", chamadas[0]?.[2], { "border-collapse": "collapse", width: "80%" });
    igual(
      "tabela [CK5]: 3 tr e 6 td recebem estilo pelo GHS",
      [nomes.filter((n) => n === "estilos:tr").length, nomes.filter((n) => n === "estilos:td").length],
      [3, 6],
    );
    const figura = corpo.querySelector("figure") as Element;
    igual("tabela [CK5]: cabecalho = headingRows 1 no model da tabela", ed.atributos.get(figura)?.headingRows, 1);
    const ps = [...corpo.querySelectorAll("p")];
    igual(
      "tabela [CK5]: o estilo SEI dos paragrafos das celulas vai no atributo estilo do model",
      [ed.atributos.get(ps[0] as Element)?.estilo, ed.atributos.get(ps[1] as Element)?.estilo],
      ["Tabela_Texto_Centralizado", "Tabela_Texto_Alinhado_Esquerda"],
    );
    checar(
      "tabela [CK5]: todas as chamadas do GHS rodam DENTRO de um model.change (um passo de desfazer)",
      chamadas.length > 0 && chamadas.every((x) => (x.at(-1) as number) >= 1),
    );
  }
}
