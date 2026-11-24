import { criarAdaptador } from "../../src/adaptador";
import { htmlParaNos } from "../../src/adaptador/html";
import type { ItemMenu } from "../../src/adaptador/tipos";
import { compararLinhas, recurso as contextMenu, maisProximo } from "../../src/recursos/context-menu";
import type { Contexto } from "../../src/recursos/tipos";
import {
  type CasoEditor,
  criarCk4,
  criarCk5,
  type FalsoCk4,
  type FalsoCk5,
  inseridoAntes,
  nosDoisEditores,
  primeiroP,
  selecionarTexto,
} from "../falsos";
import { checar, igual, secao } from "../util";

type Fn = (...a: unknown[]) => unknown;
type Opcoes = Record<string, boolean>;
type Janela = Record<string, unknown>;

const ctxDe = (c: { win: Window; doc: Document }, opcoes: Opcoes = {}): Contexto => ({
  adaptador: criarAdaptador(c.win),
  doc: c.doc,
  win: c.win,
  base: "chrome-extension://abc/",
  checkOpcao: (n) => opcoes[n] ?? true,
  verifyOpcao: () => false,
});

const TABELA =
  "<table><tbody>" +
  "<tr><td>b</td><td>2</td></tr>" +
  "<tr><td>a</td><td>10</td></tr>" +
  "<tr><td></td><td>1</td></tr>" +
  "</tbody></table><p id='depois'>fim</p>";

const corpoDe = (c: CasoEditor): HTMLElement =>
  c.versao === 4 ? (c.ed as FalsoCk4).instancia("txaEditor_1").corpo : (c.ed as FalsoCk5).elemento("main");

/** Acrescenta ao corpo do editor o HTML dado e devolve o corpo. */
function acrescentar(c: CasoEditor, html: string): HTMLElement {
  const corpo = corpoDe(c);
  corpo.append(...htmlParaNos(corpo.ownerDocument, html));
  return corpo;
}

/** O que o botao direito sobre `alvo` oferece: no CK4 pelo menu nativo, no CK5 pelos construtores do adaptador. */
function abrir(c: CasoEditor, alvo: Element | Node | null): ItemMenu[] {
  if (c.versao === 4) {
    const e4 = (c.ed as FalsoCk4).instancia("txaEditor_1");
    return e4.abrirMenu(alvo as Element | null).map((nome) => ({
      label: e4.itensMenu.get(nome)?.label ?? "",
      action: () => {
        e4.comandosMenu.get(nome)?.exec();
      },
    }));
  }
  const corpo = corpoDe(c) as HTMLElement & { __seiProCtxBuilders?: Array<(a: Node | null) => ItemMenu[]> };
  return (corpo.__seiProCtxBuilders ?? []).flatMap((b) => b(alvo));
}

const rotulos = (itens: ItemMenu[]): string[] => itens.map((i) => i.label);
const clicar = (itens: ItemMenu[], rotulo: string): void => itens.find((i) => i.label === rotulo)?.action();
const colunas = (corpo: HTMLElement, n: number): string[] =>
  Array.from(corpo.querySelectorAll("tr")).map((tr) => tr.querySelectorAll("td")[n]?.textContent ?? "");

/** Quantos passos de desfazer a edicao abriu: snapshots (CK4) ou `model.change` (CK5). */
const passos = (c: CasoEditor): number =>
  c.versao === 4 ? (c.ed as FalsoCk4).instancia("txaEditor_1").snapshots : (c.ed as FalsoCk5).instancia().mudancas;

export async function verificarContextMenu(): Promise<void> {
  secao("recurso context-menu: contrato e logica pura");
  // contrato congelado do legado (o .js foi aposentado): tudo que ele poe em window
  const contrato = { exportados: ["menuBlockEdition", "tableSorterPro", "initContextMenuPro"], necessarios: ["initContextMenuPro"] };
  {
    const { win, doc } = criarCk4({ secoes: [{ nome: "txaEditor_1", titulo: "Corpo", html: "<p>x</p>" }] });
    const g = contextMenu.globais(ctxDe({ win, doc }));
    checar("context-menu: id do recurso", contextMenu.id === "context-menu");
    igual("context-menu: globais exportam o contrato do legado", Object.keys(g).sort(), [...contrato.exportados].sort());
    checar(
      "context-menu: todos os necessarios estao nos globais",
      contrato.necessarios.every((n: string) => n in g),
    );
    checar("context-menu: sem iniciar (o monolito chama initContextMenuPro no boot)", contextMenu.iniciar === undefined);
  }
  const { doc: d } = (await import("../falsos")).paginaFalsa(
    "<div id='t'><table><tr id='r'><td>x</td></tr></table><p id='p'>texto</p></div>",
  );
  const texto = (d.querySelector("#p") as Element).firstChild;
  checar("maisProximo: no de texto sobe ate o <p>", maisProximo(texto, "p") === d.querySelector("#p"));
  checar("maisProximo: elemento dentro do <tr>", maisProximo(d.querySelector("td"), "tr") === d.querySelector("#r"));
  checar(
    "maisProximo: nulo e fora do seletor devolvem null",
    maisProximo(null, "p") === null && maisProximo(d.querySelector("#t"), "tr") === null,
  );
  {
    const { doc } = (await import("../falsos")).paginaFalsa(
      "<table><tr id='a'><td>a</td></tr><tr id='b'><td>B</td></tr><tr id='c'><td> </td></tr><tr id='n'><td>10</td></tr><tr id='m'><td>9</td></tr><tr id='s'></tr></table>",
    );
    const el = (id: string) => doc.querySelector(`#${id}`) as Element;
    checar(
      "compararLinhas: vazia vai depois (asc e desc)",
      compararLinhas(el("c"), el("a"), 0, "asc") > 0 && compararLinhas(el("c"), el("a"), 0, "desc") > 0,
    );
    checar("compararLinhas: duas vazias empatam", compararLinhas(el("c"), el("c"), 0, "asc") === 0);
    checar("compararLinhas: numeros em ordem natural (9 antes de 10)", compararLinhas(el("m"), el("n"), 0, "asc") < 0);
    checar("compararLinhas: desc inverte", compararLinhas(el("m"), el("n"), 0, "desc") > 0);
    checar("compararLinhas: linha sem celulas nao quebra", Number.isFinite(compararLinhas(el("s"), el("a"), 3, "asc")));
  }

  secao("recurso context-menu: itens e quando aparecem");
  await nosDoisEditores("context-menu itens", (c: CasoEditor) => {
    const v = `[CK${c.versao}]`;
    const g = contextMenu.globais(ctxDe(c)) as Record<string, Fn>;
    const ed = criarAdaptador(c.win).getInstance();
    const corpo = acrescentar(c, TABELA);
    g.menuBlockEdition(ed);
    g.tableSorterPro(ed);
    const p = primeiroP(c);
    const td = corpo.querySelector("td") as Element;
    const fim = corpo.querySelector("#depois") as Element;

    selecionarTexto(c, p, "alvo", "alvo");
    igual(
      `context-menu ${v}: alvo em <p> com selecao`,
      rotulos(abrir(c, p)),
      c.versao === 4 ? ["Bloquear Edição"] : [], // SEI 5: nao oferece um item que so avisaria
    );
    selecionarTexto(c, p, "", "");
    igual(`context-menu ${v}: <p> sem selecao: sem itens`, rotulos(abrir(c, p)), []);
    selecionarTexto(c, p, "alvo", "alvo");
    igual(
      `context-menu ${v}: no de texto dentro do <p> tambem conta`,
      rotulos(abrir(c, p.firstChild)),
      c.versao === 4 ? ["Bloquear Edição"] : [],
    );

    igual(
      `context-menu ${v}: alvo em <td>/<tr>: os 4 itens da tabela`,
      rotulos(abrir(c, td).filter((i) => i.label !== "Bloquear Edição")),
      ["Adicionar Estilo", "Duplicar Tabela", "Classificar A → Z", "Classificar Z → A"],
    );
    checar(`context-menu ${v}: fora da tabela nao ha itens de tabela`, !rotulos(abrir(c, fim)).includes("Duplicar Tabela"));
    igual(`context-menu ${v}: alvo nulo: sem itens`, rotulos(abrir(c, null)), []);
    checar(
      `context-menu ${v}: nenhum item "Ditado" (e do recurso ditado)`,
      !rotulos(abrir(c, td)).includes("Ditado") && !rotulos(abrir(c, p)).includes("Ditado"),
    );
  });

  secao("recurso context-menu: acoes da tabela");
  await nosDoisEditores("context-menu tabela", (c: CasoEditor) => {
    const v = `[CK${c.versao}]`;
    const g = contextMenu.globais(ctxDe(c)) as Record<string, Fn>;
    const ed = criarAdaptador(c.win).getInstance();
    const corpo = acrescentar(c, TABELA);
    g.tableSorterPro(ed);
    const celula = (n: number) => corpo.querySelectorAll("tr")[0]?.querySelectorAll("td")[n] as Element;

    // ordenar pela coluna 0 (texto): vazias no fim
    let antes = passos(c);
    clicar(abrir(c, celula(0)), "Classificar A → Z");
    igual(`context-menu ${v}: A -> Z pela coluna do clique (vazia por ultimo)`, colunas(corpo, 0), ["a", "b", ""]);
    checar(
      `context-menu ${v}: a ordenacao e um unico passo de desfazer`,
      c.versao === 4 ? passos(c) - antes === 2 : passos(c) - antes === 1,
    );
    clicar(abrir(c, celula(0)), "Classificar Z → A");
    igual(`context-menu ${v}: Z -> A`, colunas(corpo, 0), ["b", "a", ""]);

    // coluna 1 (numerica): ordem natural
    clicar(abrir(c, celula(1)), "Classificar A → Z");
    igual(`context-menu ${v}: coluna 1 numerica em ordem natural`, colunas(corpo, 1), ["1", "2", "10"]);
    clicar(abrir(c, celula(1)), "Classificar Z → A");
    igual(`context-menu ${v}: coluna 1 numerica, decrescente`, colunas(corpo, 1), ["10", "2", "1"]);
    checar(`context-menu ${v}: as linhas sao as mesmas (so reordenadas)`, corpo.querySelectorAll("tr").length === 3);

    // duplicar
    antes = passos(c);
    const tabela = corpo.querySelector("table") as Element;
    const depois = corpo.querySelector("#depois") as Element;
    clicar(abrir(c, celula(0)), "Duplicar Tabela");
    if (c.versao === 4) {
      igual(`context-menu ${v}: duas tabelas apos duplicar`, corpo.querySelectorAll("table").length, 2);
      const linha = tabela.nextElementSibling as Element;
      checar(
        `context-menu ${v}: paragrafo vazio entre a tabela e a copia`,
        linha?.localName === "p" && linha.className === "Texto_Justificado_Recuo_Primeira_Linha" && linha.querySelector("br") !== null,
      );
      checar(
        `context-menu ${v}: a copia tem o mesmo conteudo e vem depois do paragrafo`,
        linha.nextElementSibling?.localName === "table" && linha.nextElementSibling.textContent === tabela.textContent,
      );
      checar(`context-menu ${v}: a original fica no lugar (seguida da copia e do resto)`, corpo.querySelector("#depois") === depois);
    } else {
      const html = inseridoAntes(c, depois) ?? "";
      checar(
        `context-menu ${v}: insere pelo model, antes do irmao seguinte: paragrafo vazio e a tabela`,
        html.startsWith('<p class="Texto_Justificado_Recuo_Primeira_Linha"><br></p><table') && html.includes("<td>10</td>"),
        html,
      );
    }
    checar(`context-menu ${v}: duplicar abre passo de desfazer`, passos(c) > antes);

    // adicionar estilo: dialogo do table-styles.ts, com o editor
    const chamados: unknown[] = [];
    (c.win as unknown as Janela).openDialogSyleTable = (e: unknown) => chamados.push(e);
    clicar(abrir(c, celula(0)), "Adicionar Estilo");
    checar(`context-menu ${v}: Adicionar Estilo chama openDialogSyleTable(editor)`, chamados.length === 1 && chamados[0] === ed);
    (c.win as unknown as Janela).openDialogSyleTable = undefined;
    let botao = 0;
    (c.win as unknown as Janela).getSyleSelectedTable = () => {
      botao += 1;
    };
    clicar(abrir(c, celula(0)), "Adicionar Estilo");
    checar(`context-menu ${v}: sem o dialogo, cai no fluxo do botao da barra`, botao === 1);
    (c.win as unknown as Janela).getSyleSelectedTable = undefined;
    clicar(abrir(c, celula(0)), "Adicionar Estilo");
    checar(`context-menu ${v}: sem nenhum dos dois, nada acontece (sem erro)`, true);
  });

  await nosDoisEditores("context-menu tabela sem irmao", (c: CasoEditor) => {
    const v = `[CK${c.versao}]`;
    const g = contextMenu.globais(ctxDe(c)) as Record<string, Fn>;
    const ed = criarAdaptador(c.win).getInstance();
    const corpo = acrescentar(c, "<table><tbody><tr><td>u</td></tr></tbody></table>");
    g.tableSorterPro(ed);
    const tabela = corpo.querySelector("table") as Element;
    clicar(abrir(c, tabela.querySelector("td")), "Duplicar Tabela");
    if (c.versao === 4) igual(`context-menu ${v}: tabela sem irmao seguinte: copia no fim`, corpo.querySelectorAll("table").length, 2);
    else
      checar(
        `context-menu ${v}: tabela sem irmao seguinte: insere antes da propria tabela (como o legado)`,
        (inseridoAntes(c, tabela) ?? "").includes("<table"),
      );
  });

  await nosDoisEditores("context-menu tabela hostil", (c: CasoEditor) => {
    const v = `[CK${c.versao}]`;
    const g = contextMenu.globais(ctxDe(c)) as Record<string, Fn>;
    const ed = criarAdaptador(c.win).getInstance();
    // celulas com marcacao como TEXTO, linha sem a coluna clicada, linha de cabecalho (th) e tabela sem <tbody>
    const corpo = acrescentar(
      c,
      "<table><tr><td>&lt;img src=x onerror=alert(1)&gt;</td><td>z</td></tr><tr><td>&lt;b&gt;</td></tr><tr><td>a</td><td>y</td></tr></table>",
    );
    g.tableSorterPro(ed);
    const alvo = corpo.querySelectorAll("tr")[0]?.querySelectorAll("td")[1] as Element;
    let erro = "";
    try {
      clicar(abrir(c, alvo), "Classificar A → Z");
    } catch (e) {
      erro = String(e);
    }
    checar(`context-menu ${v}: celulas hostis e linha curta nao quebram a ordenacao`, erro === "", erro);
    checar(`context-menu ${v}: nada vira marcacao`, corpo.querySelector("img") === null && corpo.querySelector("b") === null);
    checar(`context-menu ${v}: nenhuma linha se perdeu`, corpo.querySelectorAll("tr").length === 3);
    // acao com o editor sem tabela sob o alvo/selecao: nada acontece
    const sem = abrir(c, alvo).find((i) => i.label === "Duplicar Tabela");
    corpo.querySelector("table")?.remove();
    selecionarTexto(c, primeiroP(c), "", "");
    let erro2 = "";
    try {
      sem?.action();
      clicar(abrir(c, primeiroP(c)), "Classificar A → Z");
    } catch (e) {
      erro2 = String(e);
    }
    checar(
      `context-menu ${v}: sem tabela no alvo nem na selecao a acao nao faz nada`,
      erro2 === "" && corpo.querySelectorAll("table").length === 0,
      erro2,
    );
  });

  secao("recurso context-menu: bloquear edicao (CK4) e CK5");
  {
    const c4: CasoEditor = ((f) => ({ versao: 4, doc: f.doc, win: f.win, ed: f }))(
      criarCk4({
        secoes: [
          { nome: "txaEditor_1", titulo: "Corpo", html: "<p id='a'>um</p><p id='b'>dois</p><p id='c'>tres</p><p id='d'>quatro</p>" },
        ],
      }),
    );
    const g = contextMenu.globais(ctxDe(c4)) as Record<string, Fn>;
    const ed = criarAdaptador(c4.win).getInstance();
    g.menuBlockEdition(ed);
    const corpo = corpoDe(c4);
    const q = (id: string) => corpo.querySelector(`#${id}`) as Element;
    const estado = () => ["a", "b", "c", "d"].map((id) => q(id).getAttribute("contenteditable"));
    // selecao de #a ate o texto de #c (o foco e um no de texto)
    (c4.ed as FalsoCk4).selecionar("txaEditor_1", { elemento: q("a"), texto: "um dois tres", html: "x", foco: q("c").firstChild });
    const antes = passos(c4);
    clicar(abrir(c4, q("a")), "Bloquear Edição");
    igual("context-menu [CK4]: bloqueia do <p> inicial ate o <p> do fim da selecao", estado(), ["false", "false", "false", null]);
    checar("context-menu [CK4]: um passo de desfazer (snapshot antes e depois)", passos(c4) - antes === 2);
    clicar(abrir(c4, q("a")), "Bloquear Edição");
    igual("context-menu [CK4]: segundo clique desbloqueia (alterna)", estado(), ["true", "true", "true", null]);
    // selecao dentro de um unico <p>
    (c4.ed as FalsoCk4).selecionar("txaEditor_1", { elemento: q("d"), texto: "q", html: "q" });
    clicar(abrir(c4, q("d")), "Bloquear Edição");
    igual("context-menu [CK4]: selecao num so <p> bloqueia so ele", estado(), ["true", "true", "true", "false"]);
    // foco antes do inicio (selecao invertida): nao entra em laco e bloqueia ate o fim das irmas
    (c4.ed as FalsoCk4).selecionar("txaEditor_1", { elemento: q("b"), texto: "q", html: "q", foco: q("a") });
    let erro = "";
    try {
      clicar(abrir(c4, q("b")), "Bloquear Edição");
    } catch (e) {
      erro = String(e);
    }
    checar("context-menu [CK4]: foco antes do inicio termina (sem laco infinito)", erro === "", erro);
  }
  await nosDoisEditores("context-menu sem janela de aviso", (c: CasoEditor) => {
    if (c.versao !== 5) return;
    const g = contextMenu.globais(ctxDe(c)) as Record<string, Fn>;
    const ed = criarAdaptador(c.win).getInstance();
    g.menuBlockEdition(ed);
    const p = primeiroP(c);
    selecionarTexto(c, p, "alvo", "alvo");
    igual("context-menu [CK5]: Bloquear Edicao nao aparece no SEI 5", rotulos(abrir(c, p)), []);
    checar("context-menu [CK5]: o DOM do paragrafo nao e tocado", p.getAttribute("contenteditable") === null);
  });

  secao("recurso context-menu: somente leitura");
  {
    const casos: Array<[string, CasoEditor]> = [];
    const f4 = criarCk4({ secoes: [{ nome: "txaEditor_1", titulo: "Corpo", html: "<p>x</p>", somenteLeitura: true }] });
    casos.push(["CK4", { versao: 4, doc: f4.doc, win: f4.win, ed: f4 }]);
    const f5 = criarCk5({ secoes: [{ raiz: "main", label: "Corpo", html: "<p>x</p>", principal: true, somenteLeitura: true }] });
    casos.push(["CK5", { versao: 5, doc: f5.doc, win: f5.win, ed: f5 }]);
    for (const [nome, c] of casos) {
      const a = criarAdaptador(c.win);
      const g = contextMenu.globais({ ...ctxDe(c), adaptador: a }) as Record<string, Fn>;
      let recusas = 0;
      a.aoRecusarEscrita(() => {
        recusas += 1;
      });
      const ed = a.getAllInstances()[0] ?? a.getInstance();
      const corpo = acrescentar(c, TABELA);
      if (c.versao === 5) (c.ed as FalsoCk5).selecionar({ raiz: "main", elemento: corpo.querySelector("td") });
      else (c.ed as FalsoCk4).selecionar("txaEditor_1", { elemento: corpo.querySelector("td") });
      g.tableSorterPro(ed);
      const td = corpo.querySelector("td") as Element;
      const antes = colunas(corpo, 0);
      clicar(abrir(c, td), "Classificar A → Z");
      clicar(abrir(c, td), "Classificar Z → A");
      clicar(abrir(c, td), "Duplicar Tabela");
      igual(`context-menu [${nome}] somente leitura: a tabela nao e reordenada`, colunas(corpo, 0), antes);
      checar(`context-menu [${nome}] somente leitura: nao duplica`, corpo.querySelectorAll("table").length === 1);
      igual(`context-menu [${nome}] somente leitura: cada tentativa avisa a recusa`, recusas, 3);
    }
  }

  secao("recurso context-menu: initContextMenuPro");
  {
    const f = criarCk4({
      secoes: [
        { nome: "txaEditor_1", titulo: "Corpo", html: "<p>a</p>" },
        { nome: "txaEditor_2", titulo: "Cabecalho", html: "<p>b</p>" },
        { nome: "txaEditor_3", titulo: "Fixo", html: "<p>c</p>", somenteLeitura: true },
      ],
    });
    const c = { win: f.win, doc: f.doc };
    const j = f.win as unknown as Janela;
    const chamadas: Record<string, unknown[]> = { copy: [], ia: [], img: [] };
    j.menuCopyStyle = (e: unknown) => chamadas.copy?.push(e);
    j.menuPlataformAI = (e: unknown) => chamadas.ia?.push(e);
    j.editImgPro = (e: unknown) => chamadas.img?.push(e);
    j.restrictConfigValue = (n: string) => n === "ferramentasia";
    const g = contextMenu.globais(ctxDe(c, { editarimagens: true })) as Record<string, Fn>;
    g.initContextMenuPro();
    igual("context-menu init: registra copiar formatacao nas secoes editaveis (nao na somente leitura)", chamadas.copy?.length, 2);
    igual(
      "context-menu init: IA (restrictConfigValue) e imagem (checkOpcao) nas mesmas secoes",
      [chamadas.ia?.length, chamadas.img?.length],
      [2, 2],
    );
    checar(
      "context-menu init: cada secao editavel recebeu o menu de tabela e o de bloqueio",
      f.instancia("txaEditor_1").ouvintesMenu.length === 1 && f.instancia("txaEditor_2").ouvintesMenu.length === 1,
    );
    checar("context-menu init: a secao somente leitura fica de fora", f.instancia("txaEditor_3").ouvintesMenu.length === 0);
    g.initContextMenuPro();
    igual(
      "context-menu init: repetir nao duplica (marca por editor)",
      [chamadas.copy?.length, chamadas.ia?.length, chamadas.img?.length],
      [2, 2, 2],
    );
    igual(
      "context-menu init: nem os itens do menu nativo",
      f.instancia("txaEditor_1").abrirMenu(f.instancia("txaEditor_1").corpo.querySelector("p")).length,
      0,
    );
  }
  {
    const f = criarCk4({ secoes: [{ nome: "txaEditor_1", titulo: "Corpo", html: "<p>a</p>" }] });
    const c = { win: f.win, doc: f.doc };
    const j = f.win as unknown as Janela;
    let ia = 0;
    let img = 0;
    j.menuPlataformAI = () => {
      ia += 1;
    };
    j.editImgPro = () => {
      img += 1;
    };
    j.restrictConfigValue = () => false;
    (contextMenu.globais(ctxDe(c, { editarimagens: false })) as Record<string, Fn>).initContextMenuPro();
    igual("context-menu init: opcoes desligadas: sem IA e sem edicao de imagem", [ia, img], [0, 0]);
    // sem nenhum global do monolito: nada quebra
    const f2 = criarCk4({ secoes: [{ nome: "txaEditor_1", titulo: "Corpo", html: "<p>a</p>" }] });
    let erro = "";
    try {
      (contextMenu.globais(ctxDe({ win: f2.win, doc: f2.doc })) as Record<string, Fn>).initContextMenuPro();
    } catch (e) {
      erro = String(e);
    }
    checar("context-menu init: sem menuCopyStyle/IA/editImgPro no monolito nada quebra", erro === "", erro);
  }
  await nosDoisEditores("context-menu init CK5", (c: CasoEditor) => {
    if (c.versao !== 5) return;
    const j = c.win as unknown as Janela;
    let copia = 0;
    j.menuCopyStyle = () => {
      copia += 1;
    };
    const g = contextMenu.globais(ctxDe(c)) as Record<string, Fn>;
    g.initContextMenuPro();
    g.initContextMenuPro();
    igual("context-menu init [CK5]: uma instancia, registrada uma vez", copia, 1);
    const corpo = corpoDe(c) as HTMLElement & { __seiProCtxBuilders?: unknown[] };
    igual("context-menu init [CK5]: dois construtores no corpo (tabela e bloqueio)", corpo.__seiProCtxBuilders?.length, 2);
  });
}
