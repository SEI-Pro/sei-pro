import { criarAdaptador } from "../../src/adaptador";
import { recurso as quickTable } from "../../src/recursos/quick-table";
import type { Contexto } from "../../src/recursos/tipos";
import { criarCk4, criarCk5, paginaFalsa } from "../falsos";
import { checar, igual, secao } from "../util";

type Fn = (...a: unknown[]) => void;
const ctxDe = (f: { win: Window; doc: Document }): Contexto => ({
  adaptador: criarAdaptador(f.win),
  doc: f.doc,
  win: f.win,
  base: "",
  checkOpcao: () => true,
  verifyOpcao: () => false,
});
const globais = (f: { win: Window; doc: Document }) => quickTable.globais(ctxDe(f)) as Record<string, Fn>;

/** Barra de ferramentas minima do SEI: o botao, a grade (`.divQuickTable`) e o botao de estilo de tabela desabilitado. */
const BARRA =
  '<div class="cke_toolgroup"><a class="getQuickTableButtom cke_button_off"></a><div class="divQuickTable" style="display:none;"></div><a class="getTablestylesButtom cke_button_disabled"></a></div>';

const tds = (grade: Element) => [...grade.querySelectorAll("td")];
const celula = (grade: Element, linha: number, coluna: number) =>
  tds(grade).find((td) => td.getAttribute("data-row") === String(linha) && td.getAttribute("data-col") === String(coluna)) as HTMLElement;
const evento = (el: Element, tipo: string) =>
  el.dispatchEvent(new (el.ownerDocument.defaultView as unknown as { Event: typeof Event }).Event(tipo, { bubbles: true }));

export function verificarQuickTable(): void {
  secao("recurso quick-table");
  const base = paginaFalsa(BARRA);
  igual("quick-table: globais do contrato", Object.keys(globais(base)).sort(), [
    "getQuickTable",
    "hideQuickTable",
    "quickTableClick",
    "quickTableOver",
  ]);

  // abrir e fechar a grade
  const { doc, win } = paginaFalsa(BARRA);
  const g = globais({ doc, win });
  const botao = doc.querySelector(".getQuickTableButtom") as HTMLElement;
  const area = doc.querySelector(".divQuickTable") as HTMLElement;
  g.getQuickTable(botao);
  const tabela = area.querySelector("table") as HTMLElement;
  igual(
    "abre: grade 5x5 (data-row=4, data-col=4, 25 celulas)",
    [tabela.getAttribute("data-row"), tabela.getAttribute("data-col"), tds(area).length],
    ["4", "4", 25],
  );
  igual(
    "abre: legenda 'Inserir Tabela', botao on e grade visivel",
    [area.querySelector(".quickTableInfo")?.textContent, botao.className, area.style.display === "none"],
    ["Inserir Tabela", "getQuickTableButtom cke_button_on", false],
  );
  g.getQuickTable(botao);
  igual(
    "segundo clique fecha: grade vazia e escondida, botao off",
    [area.children.length, area.style.display, botao.className],
    [0, "none", "getQuickTableButtom cke_button_off"],
  );

  // CK5: o botao nasce sem cke_button_off (nem on): o primeiro clique ja abre a grade
  const ck5Barra = paginaFalsa(
    '<div class="ck-toolbar__items"><a class="getQuickTableButtom"></a><div class="divQuickTable" style="display:none;"></div></div>',
  );
  const g5 = globais(ck5Barra);
  const b5 = ck5Barra.doc.querySelector(".getQuickTableButtom") as HTMLElement;
  g5.getQuickTable(b5);
  igual(
    "botao sem classe de estado (CK5): o 1o clique abre a grade",
    [ck5Barra.doc.querySelectorAll(".divQuickTable td").length, b5.className],
    [25, "getQuickTableButtom cke_button_on"],
  );

  // hover: destaque, legenda e crescimento/encolhimento da grade
  g.getQuickTable(botao);
  const grade = () => area.querySelector("table") as HTMLElement;
  g.quickTableOver(celula(area, 1, 2));
  igual("hover na celula (1,2): 2x3 = 6 celulas destacadas", tds(area).filter((td) => td.classList.contains("td_hover")).length, 6);
  igual("hover (1,2): legenda 'Tabela 2x3'", area.querySelector(".quickTableInfo")?.textContent, "Tabela 2x3");
  g.quickTableOver(celula(area, 4, 4));
  igual(
    "hover na ultima celula (4,4) cresce a grade para 6x6",
    [
      grade().getAttribute("data-row"),
      grade().getAttribute("data-col"),
      grade().querySelectorAll("tr").length,
      grade().querySelector("tr")?.children.length,
    ],
    ["5", "5", 6, 6],
  );
  g.quickTableOver(celula(area, 3, 3));
  igual("voltar para (3,3) encolhe a grade de novo", [grade().getAttribute("data-row"), grade().getAttribute("data-col")], ["4", "4"]);
  // limite de 49
  g.getQuickTable(botao);
  g.getQuickTable(botao);
  const alto = grade();
  alto.setAttribute("data-row", "49");
  const ultima = [...alto.querySelectorAll("tr")].at(-1) as Element;
  for (const td of ultima.querySelectorAll("td")) td.setAttribute("data-row", "49");
  g.quickTableOver(celula(area, 49, 1));
  igual("nao cresce alem da linha 49", grade().getAttribute("data-row"), "49");

  // delegacao: o handler continua valendo nas celulas CLONADAS
  const d2 = paginaFalsa(BARRA);
  const g2 = globais(d2);
  const b2 = d2.doc.querySelector(".getQuickTableButtom") as HTMLElement;
  const a2 = d2.doc.querySelector(".divQuickTable") as HTMLElement;
  g2.getQuickTable(b2);
  g2.quickTableOver(celula(a2, 4, 4)); // cresce: celula nova (5,5) e clone
  evento(celula(a2, 5, 5), "mouseover");
  checar(
    "mouseover numa celula clonada destaca (delegacao no table)",
    tds(a2).filter((td) => td.classList.contains("td_hover")).length === 36,
  );

  // clique: insere a tabela depois do paragrafo do cursor
  for (const versao of [4, 5] as const) {
    const html = '<p id="a">um</p><p id="b">dois</p>';
    const f =
      versao === 4
        ? criarCk4({ secoes: [{ nome: "txaEditor_1", titulo: "Corpo do Texto", html }] })
        : criarCk5({ secoes: [{ raiz: "main", label: "Corpo do Texto", html, principal: true }] });
    f.doc.body.insertAdjacentHTML?.("beforeend", BARRA);
    const corpo =
      versao === 4
        ? (f as ReturnType<typeof criarCk4>).instancia("txaEditor_1").corpo
        : (f as ReturnType<typeof criarCk5>).elemento("main");
    const [pa, pb] = [corpo.querySelector("#a"), corpo.querySelector("#b")] as Element[];
    const sel = (p: Element) =>
      versao === 4
        ? (f as ReturnType<typeof criarCk4>).selecionar("txaEditor_1", { elemento: p })
        : (f as ReturnType<typeof criarCk5>).selecionar({ raiz: "main", elemento: p });
    const gv = globais(f);
    const bt = f.doc.querySelector(".getQuickTableButtom") as HTMLElement;
    const ar = f.doc.querySelector(".divQuickTable") as HTMLElement;
    const estilos = f.doc.querySelector(".getTablestylesButtom") as HTMLElement;

    sel(pa as Element);
    gv.getQuickTable(bt);
    gv.quickTableClick(celula(ar, 1, 2)); // 2 linhas x 3 colunas
    const inserido =
      versao === 4
        ? (pb as Element).previousElementSibling?.outerHTML
        : ((f as ReturnType<typeof criarCk5>).instancia().insercoes.at(-1)?.html as string);
    const conta = (re: RegExp) => (inserido?.match(re) ?? []).length;
    igual(
      `CK${versao}: tabela 2x3 com <p class=Tabela_Texto_Alinhado_Esquerda> em cada celula`,
      [conta(/<tr>/g), conta(/<td>/g), conta(/<p class="Tabela_Texto_Alinhado_Esquerda"/g)],
      [2, 6, 6],
    );
    checar(
      `CK${versao}: estilo e atributos de tabela do legado`,
      /^<table border="1" cellspacing="1" cellpadding="1" style="border-collapse:collapse; border-color:#646464;margin-left:auto; margin-right:auto; width:80%;">/.test(
        inserido ?? "",
      ),
    );
    if (versao === 5) {
      const pos = (f as ReturnType<typeof criarCk5>).instancia().insercoes.at(-1)?.posicao as { antes?: { elemento?: Element } };
      checar("CK5: a tabela entra antes do proximo paragrafo (depois do paragrafo do cursor)", pos.antes?.elemento === pb);
    }
    igual(
      `CK${versao}: fecha a grade, botao off, habilita o botao de estilo de tabela`,
      [ar.children.length, bt.className, estilos.classList.contains("cke_button_disabled")],
      [0, "getQuickTableButtom cke_button_off", false],
    );
    if (versao === 4)
      checar(
        "CK4: o id temporario da primeira celula foi removido",
        !(pb as Element).previousElementSibling?.outerHTML.includes("quickTablePos_"),
      );

    // paragrafo do cursor e o ultimo: a tabela vai para o fim do corpo
    sel(pb as Element);
    gv.getQuickTable(bt);
    gv.quickTableClick(celula(ar, 0, 0));
    if (versao === 4) checar("CK4: sem proximo paragrafo, a tabela vai para o fim do corpo", corpo.lastElementChild?.tagName === "TABLE");
    else
      igual(
        "CK5: sem proximo paragrafo, a tabela vai para o fim da raiz do corpo",
        (f as ReturnType<typeof criarCk5>).instancia().insercoes.at(-1)?.posicao,
        { em: "main", onde: "end" },
      );
  }
}
