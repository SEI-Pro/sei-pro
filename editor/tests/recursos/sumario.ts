import { criarAdaptador } from "../../src/adaptador";
import { htmlParaNos } from "../../src/adaptador/html";
import { recurso as sumario } from "../../src/recursos/sumario";
import type { Contexto } from "../../src/recursos/tipos";
import { clicar, dialogoAberto, usarDocumento } from "../dialogo";
import {
  type CasoEditor,
  criarCk5,
  cursorEm,
  type FalsoCk4,
  type FalsoCk5,
  inseridoAntes,
  nosDoisEditores,
  ultimoInserido,
} from "../falsos";
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

const DOC =
  '<p class="Item_Nivel1">Introdução</p><p class="Texto_Justificado">texto</p><p class="Item_Nivel2">Contexto &amp; escopo</p><p class="Item_Nivel1">A &lt; B</p>';

/** O linkedom nao tem `select.value`: a opcao com `selected` (ou a 1a) responde por ele, como no navegador. */
function simularSelects(raiz: ParentNode): void {
  for (const sel of raiz.querySelectorAll("select")) {
    Object.defineProperty(sel, "value", {
      configurable: true,
      get: () => (sel.querySelector("option[selected]") ?? sel.querySelector("option"))?.getAttribute("value") ?? "",
    });
  }
}

const corpoDe = (c: CasoEditor): HTMLElement =>
  c.versao === 4 ? (c.ed as FalsoCk4).instancia("txaEditor_1").corpo : (c.ed as FalsoCk5).elemento("main");

export async function verificarSumario(): Promise<void> {
  secao("recurso sumario");
  await nosDoisEditores("sumario", (c: CasoEditor) => {
    usarDocumento(c.doc);
    const v = `[CK${c.versao}]`;
    const g = sumario.globais(ctxDe(c)) as Record<string, Fn>;
    igual(`sumario ${v}: globais do contrato`, Object.keys(g).sort(), [
      "getDialogSumarioDocumento",
      "getDialogSumarioDocumento_",
      "getListStylesDocumento",
      "getSumarioDocumento",
      "insertSumarioDocumento",
      "updateSelectDialog",
    ]);
    const corpo = corpoDe(c);
    corpo.replaceChildren(...htmlParaNos(corpo.ownerDocument, DOC));
    const ancoras: Array<[string, number]> = [];
    if (c.versao === 5) {
      const ed = (c.ed as FalsoCk5).instancia();
      (c.win as unknown as Record<string, unknown>).SeiProGhs = {
        setAtributos: (el: Element, v2: Record<string, string>) => {
          ancoras.push([v2.id ?? "", ed.profundidade]);
          el.setAttribute("id", v2.id ?? "");
          return true;
        },
      };
    }

    const ultimo = corpo.querySelector("p.Texto_Justificado") as Element;
    cursorEm(c, ultimo);

    // dialogo: so os estilos que existem no documento; o 1o e o 2o ja vem com Item_Nivel1/2
    g.getSumarioDocumento(null);
    const d = dialogoAberto(c.doc) as HTMLElement;
    simularSelects(d);
    const s1 = d.querySelector("#listStyle1") as HTMLSelectElement;
    igual(
      `sumario ${v}: o seletor oferece so os estilos do documento`,
      [...s1.querySelectorAll("option")].map((o) => o.textContent),
      ["Item_Nivel1", "Texto_Justificado", "Item_Nivel2"],
    );
    checar(
      `sumario ${v}: sugere Item_Nivel1 e Item_Nivel2; Título 3 opcional; sem Cancelar`,
      s1.value === ".Item_Nivel1" &&
        (d.querySelector("#listStyle2") as HTMLSelectElement).value === ".Item_Nivel2" &&
        (d.querySelector("#listStyle3") as HTMLSelectElement).value === "" &&
        ![...d.querySelectorAll("button")].some((b) => /cancelar/i.test(b.textContent ?? "")),
    );

    // inserir
    clicar(d, "Inserir");
    const html = ultimoInserido(c) ?? "";
    checar(`sumario ${v}: o dialogo fecha`, !dialogoAberto(c.doc));
    checar(
      `sumario ${v}: SUMÁRIO em negrito e uma linha por titulo, na ordem do documento`,
      html.startsWith('<p class="Texto_Alinhado_Esquerda"><strong>SUMÁRIO</strong></p>') &&
        (html.match(/<p class="Texto_Alinhado_Esquerda"><a href="#bookmark-[0-9a-zA-Z]{16}">/g) ?? []).length === 3,
      html,
    );
    checar(
      `sumario ${v}: titulo com & e < entra como texto escapado no link`,
      html.includes(">Contexto &amp; escopo</a>") && html.includes(">A &lt; B</a>") && !html.includes("<A"),
      html,
    );
    const titulos = [...corpo.querySelectorAll("p.Item_Nivel1, p.Item_Nivel2")];
    const hrefs = [...html.matchAll(/href="#(bookmark-[0-9a-zA-Z]{16})"/g)].map((m) => m[1]);
    if (c.versao === 4) {
      igual(
        `sumario ${v}: cada titulo ganha uma <a name class> vazia no inicio, com o nome do link`,
        titulos.map((t) => [
          t.firstElementChild?.tagName,
          t.firstElementChild?.getAttribute("name"),
          t.firstElementChild?.getAttribute("class"),
        ]),
        hrefs.map((n) => ["A", n, "seipro-bookmark"]),
      );
      igual(`sumario ${v}: tudo num passo de desfazer (2 snapshots)`, (c.ed as FalsoCk4).instancia("txaEditor_1").snapshots, 2);
    } else {
      igual(
        `sumario ${v}: as ancoras do CK5 sao o id de cada titulo, com o nome do link`,
        titulos.map((t) => t.id),
        hrefs,
      );
      checar(
        `sumario ${v}: ancoras e insercao no mesmo model.change (um passo de desfazer)`,
        ancoras.length === 3 && ancoras.every((a) => a[1] > 0),
      );
    }

    if (c.versao === 5)
      checar(
        `sumario ${v}: no CK5 o sumario entra ANTES do paragrafo do cursor (nao se funde com o texto dele)`,
        inseridoAntes(c, ultimo) === html,
      );

    // reinserir: reaproveita as ancoras (nao duplica)
    g.insertSumarioDocumento([".Item_Nivel1", ".Item_Nivel2"]);
    const html2 = ultimoInserido(c) ?? "";
    igual(
      `sumario ${v}: reinserir reaproveita as ancoras (mesmos nomes nos links)`,
      [...html2.matchAll(/href="#(bookmark-[0-9a-zA-Z]{16})"/g)].map((m) => m[1]),
      hrefs,
    );
    if (c.versao === 4)
      igual(
        `sumario ${v}: uma unica ancora por titulo`,
        titulos.map((t) => t.querySelectorAll("a.seipro-bookmark").length),
        [1, 1, 1],
      );

    // sem titulos com o estilo escolhido: avisa e nao insere
    const antes =
      c.versao === 4 ? (c.ed as FalsoCk4).instancia("txaEditor_1").inseridos.length : (c.ed as FalsoCk5).instancia().insercoes.length;
    g.insertSumarioDocumento([".EstiloQueNaoExiste"]);
    const depois =
      c.versao === 4 ? (c.ed as FalsoCk4).instancia("txaEditor_1").inseridos.length : (c.ed as FalsoCk5).instancia().insercoes.length;
    checar(
      `sumario ${v}: sem titulos com o estilo, avisa e nao insere`,
      depois === antes && /Nenhum parágrafo/.test(c.doc.body.textContent ?? ""),
    );
    c.doc.body.querySelector(".spro-aviso")?.remove();

    // documento sem nenhum paragrafo estilizado
    corpo.replaceChildren(...htmlParaNos(corpo.ownerDocument, "<p>solto</p>"));
    g.getSumarioDocumento(null);
    checar(
      `sumario ${v}: sem estilos no documento avisa e nao abre o dialogo`,
      !dialogoAberto(c.doc) && /não tem parágrafos com estilo/.test(c.doc.body.textContent ?? ""),
    );
  });

  // CK5: cursor numa secao somente leitura nao escreve nada e avisa
  {
    const f = criarCk5({
      secoes: [
        { raiz: "cab", label: "Cabeçalho", html: '<p class="Item_Nivel1">cab</p>', somenteLeitura: true },
        { raiz: "main", label: "Corpo do Texto", html: '<p class="Item_Nivel1">corpo</p>', principal: true },
      ],
    });
    usarDocumento(f.doc);
    const ctx = ctxDe(f);
    let recusas = 0;
    ctx.adaptador.aoRecusarEscrita(() => {
      recusas += 1;
    });
    const g = sumario.globais(ctx) as Record<string, Fn>;
    f.selecionar({ raiz: "cab", elemento: f.elemento("cab").querySelector("p") });
    g.insertSumarioDocumento([".Item_Nivel1"]);
    checar(
      "sumario [CK5]: cursor em secao somente leitura nao insere, nao ancora e avisa a recusa",
      f.instancia().insercoes.length === 0 && recusas === 1,
    );
  }
}
