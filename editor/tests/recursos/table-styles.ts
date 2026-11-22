import { readFileSync } from "node:fs";
import { criarAdaptador } from "../../src/adaptador";
import { htmlParaNos } from "../../src/adaptador/html";
import { recurso as tableStyles } from "../../src/recursos/table-styles";
import type { Contexto } from "../../src/recursos/tipos";
import { CORES, estilosDaTabela } from "../../src/util/estilos-tabela";
import { clicar, dialogoAberto, usarDocumento } from "../dialogo";
import { type CasoEditor, type FalsoCk4, type FalsoCk5, nosDoisEditores } from "../falsos";
import { checar, igual, secao } from "../util";

type Fn = (...a: unknown[]) => unknown;

const ctxDe = (c: { win: Window; doc: Document }): Contexto => ({
  adaptador: criarAdaptador(c.win),
  doc: c.doc,
  win: c.win,
  base: "",
  checkOpcao: () => true,
  verifyOpcao: () => false,
});

interface EstiloLegado {
  table: string;
  tr_head: string;
  tr: string | string[];
  td_head: string;
  td_head_p: string;
  td: string;
  td_first: string;
  td_p: string;
}
const LEGADO = JSON.parse(readFileSync(new URL("../legado-estilos-tabela.json", import.meta.url), "utf8")) as {
  cores: Record<string, { light: string; dark: string }>;
  estilos: Record<string, Record<string, EstiloLegado>>;
};

const TABELA = "<table><tbody><tr><td><p>a</p></td><td><p>b</p></td></tr><tr><td><p>c</p></td><td><p>d</p></td></tr></tbody></table>";
const evento = (el: Element, tipo: string) =>
  el.dispatchEvent(new (el.ownerDocument.defaultView as unknown as { Event: typeof Event }).Event(tipo, { bubbles: true }));

function marcar(el: Element | null): void {
  el?.setAttribute("checked", "checked");
  (el as HTMLInputElement).checked = true;
}

function desmarcar(el: Element | null): void {
  el?.removeAttribute("checked");
  (el as HTMLInputElement).checked = false;
}

const corpoDe = (c: CasoEditor): HTMLElement =>
  c.versao === 4 ? (c.ed as FalsoCk4).instancia("txaEditor_1").corpo : (c.ed as FalsoCk5).elemento("main");

function cursorEm(c: CasoEditor, el: Element | null): void {
  if (c.versao === 4) (c.ed as FalsoCk4).selecionar("txaEditor_1", { elemento: el });
  else (c.ed as FalsoCk5).selecionar({ raiz: "main", elemento: el });
}

export async function verificarTableStyles(): Promise<void> {
  secao("recurso table-styles: estilos identicos aos do legado");
  igual("as 10 cores sao as do legado", CORES, LEGADO.cores);
  let divergentes = 0;
  let total = 0;
  for (const [chave, estilos] of Object.entries(LEGADO.estilos)) {
    const [cor, largura] = chave.split("|") as [string, string];
    const meus = estilosDaTabela(CORES[cor] as never, Number(largura));
    for (const [id, l] of Object.entries(estilos)) {
      total += 1;
      const m = meus[id];
      const esperado = {
        table: l.table,
        trCabecalho: l.tr_head,
        tr: l.tr,
        tdCabecalho: l.td_head,
        td: l.td,
        tdPrimeira: l.td_first,
        pCabecalho: l.td_head_p,
        p: l.td_p,
      };
      const { cabecalho: _c, ...resto } = m ?? ({} as never);
      if (JSON.stringify(resto) !== JSON.stringify(esperado)) {
        divergentes += 1;
        checar(`estilo ${id} ${chave} igual ao legado`, false, JSON.stringify({ resto, esperado }));
      }
    }
  }
  checar(`${total} combinacoes (21 estilos x 10 cores x 3 larguras) iguais ao legado`, total === 630 && divergentes === 0);

  secao("recurso table-styles: dialogo e aplicacao");
  await nosDoisEditores("table-styles", async (c: CasoEditor) => {
    usarDocumento(c.doc);
    const v = `[CK${c.versao}]`;
    const g = tableStyles.globais(ctxDe(c)) as Record<string, Fn>;
    igual(`table-styles ${v}: globais do contrato (grafia "Syle")`, Object.keys(g).sort(), [
      "buildHtmlSyleTable",
      "changeColorTable",
      "getDialogSyleTable",
      "getSyleSelectedTable",
      "getSyleTable",
      "openDialogSyleTable",
      "setSyleTable",
    ]);
    const corpo = corpoDe(c);
    corpo.replaceChildren(...htmlParaNos(corpo.ownerDocument, `<p id="fora">fora</p>${TABELA}`));
    const chamadas: Array<[string, string, Record<string, string>]> = [];
    if (c.versao === 5) {
      const ed = (c.ed as FalsoCk5).instancia();
      const ghs = {
        setModelHtmlStyles: (n: string, e: Record<string, string>) => chamadas.push(["estilos", n, e]),
        setModelHtmlAttributes: () => {},
      };
      Object.assign(ed, { plugins: { has: (n: string) => n === "GeneralHtmlSupport", get: () => ghs } });
    }

    // sem tabela sob o cursor: avisa e nao abre
    cursorEm(c, corpo.querySelector("#fora"));
    g.getSyleSelectedTable(null);
    checar(
      `table-styles ${v}: sem tabela sob o cursor avisa e nao abre o dialogo`,
      !dialogoAberto(c.doc) && /Clique na tabela/.test(c.doc.body.textContent ?? ""),
    );
    c.doc.body.querySelector(".spro-aviso")?.remove();

    // com tabela: abre com 10 cores, 21 estilos, largura e cabecalho marcado
    const tabela = corpo.querySelector("table") as HTMLElement;
    cursorEm(c, tabela.querySelector("p"));
    g.getSyleSelectedTable(null);
    const d = dialogoAberto(c.doc) as HTMLElement;
    igual(
      `table-styles ${v}: o dialogo lista 10 cores e 21 estilos`,
      [d.querySelectorAll('input[name="colorStyle"]').length, d.querySelectorAll('input[name="tableStyle"]').length],
      [10, 21],
    );
    checar(`table-styles ${v}: sem botao Cancelar`, ![...d.querySelectorAll("button")].some((b) => /cancelar/i.test(b.textContent ?? "")));
    igual(
      `table-styles ${v}: cabecalho marcado e largura preenchida`,
      [d.querySelector("#addEstiloTableHeader:checked") !== null, (d.querySelector("#addEstiloTableWidth") as HTMLInputElement).value],
      [true, "80"],
    );

    // trocar a variacao de cor atualiza a previa ANTES do Aplicar (regressao de 11/09/2026: addEventListener, nao onchange)
    const previa = d.querySelector("#addEstiloTabela") as HTMLElement;
    igual(`table-styles ${v}: previa comeca na cor 1`, previa.className, "color1");
    const radio3 = d.querySelector("#colorStyle3") as HTMLInputElement;
    desmarcar(d.querySelector("#colorStyle1")); // o linkedom nao desmarca o grupo de radios
    marcar(radio3);
    evento(radio3, "change");
    igual(`table-styles ${v}: trocar o radio de cor muda a classe da previa`, previa.className, "color3");

    // aplicar: estilo 2, cor 3, 50%
    desmarcar(d.querySelector("#tableStyle1"));
    marcar(d.querySelector("#tableStyle2"));
    (d.querySelector("#addEstiloTableWidth") as HTMLInputElement).value = "50";
    clicar(d, "Aplicar");
    const esperado = estilosDaTabela(CORES.color3 as never, 50).tableStyle2 as { table: string; trCabecalho: string };
    if (c.versao === 4) {
      igual(
        `table-styles ${v}: Aplicar grava o estilo (tabela e cabecalho) e move a 1a linha para thead`,
        [tabela.getAttribute("style"), tabela.querySelector("thead tr")?.getAttribute("style")],
        [esperado.table, esperado.trCabecalho],
      );
      checar(
        `table-styles ${v}: celulas com fundo claro/escuro ganham a classe de contraste do modo escuro`,
        tabela.querySelector("tr")?.className.includes("dark-mode-color-black") === true,
      );
    } else {
      igual(
        `table-styles ${v}: Aplicar manda o estilo da tabela ao model pelo GHS`,
        chamadas.find((x) => x[1] === "table")?.[2]?.width,
        "50%",
      );
    }
    checar(`table-styles ${v}: o dialogo fecha depois de aplicar`, !dialogoAberto(c.doc));

    // o cursor sai do editor enquanto o dialogo esta aberto (CK5: a selecao nativa vai para o dialogo): a tabela vale a da abertura
    corpo.replaceChildren(...htmlParaNos(corpo.ownerDocument, `<p id="fora2">fora</p>${TABELA}`));
    chamadas.length = 0;
    const t0 = corpo.querySelector("table") as HTMLElement;
    cursorEm(c, t0.querySelector("p"));
    g.getSyleSelectedTable(null);
    const d0 = dialogoAberto(c.doc) as HTMLElement;
    cursorEm(c, corpo.querySelector("#fora2"));
    clicar(d0, "Aplicar");
    checar(
      `table-styles ${v}: Aplicar vale para a tabela da abertura mesmo com o cursor fora dela`,
      c.versao === 4 ? /width:80%/.test(t0.getAttribute("style") ?? "") : chamadas.some((x) => x[1] === "table"),
    );

    // sem "primeira linha como cabecalho": nao cria thead
    corpo.replaceChildren(...htmlParaNos(corpo.ownerDocument, TABELA));
    const t2 = corpo.querySelector("table") as HTMLElement;
    cursorEm(c, t2.querySelector("p"));
    g.getSyleSelectedTable(null);
    const d2 = dialogoAberto(c.doc) as HTMLElement;
    desmarcar(d2.querySelector("#addEstiloTableHeader"));
    clicar(d2, "Aplicar");
    if (c.versao === 4) checar(`table-styles ${v}: sem a opcao de cabecalho nao cria thead`, !t2.querySelector("thead"));

    // tabela dentro de tabela: a mais proxima do cursor
    corpo.replaceChildren(
      ...htmlParaNos(
        corpo.ownerDocument,
        '<table id="ext"><tbody><tr><td><table id="int"><tbody><tr><td><p>x</p></td></tr></tbody></table></td></tr></tbody></table>',
      ),
    );
    cursorEm(c, corpo.querySelector("#int p"));
    g.setSyleTable(["tableStyle1", "color1", "60"]);
    if (c.versao === 4)
      checar(
        `table-styles ${v}: tabela dentro de tabela: so a mais proxima do cursor recebe o estilo`,
        /width:60%/.test(corpo.querySelector("#int")?.getAttribute("style") ?? "") && !corpo.querySelector("#ext")?.getAttribute("style"),
      );

    // valores invalidos do setSyleTable nao fazem nada
    corpo.replaceChildren(...htmlParaNos(corpo.ownerDocument, TABELA));
    cursorEm(c, corpo.querySelector("p"));
    g.setSyleTable(undefined);
    g.setSyleTable(["tableStyle99", "color1", "80"]);
    g.setSyleTable(["tableStyle1", "color99", "80"]);
    g.setSyleTable(["tableStyle1", "color1", "abc"]);
    checar(`table-styles ${v}: estilo, cor ou largura invalidos nao mexem na tabela`, !corpo.querySelector("table")?.getAttribute("style"));
  });
}
