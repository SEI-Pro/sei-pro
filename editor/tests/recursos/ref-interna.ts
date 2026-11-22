import { readFileSync } from "node:fs";
import { criarAdaptador } from "../../src/adaptador";
import { htmlParaNos } from "../../src/adaptador/html";
import { recurso as refInterna } from "../../src/recursos/ref-interna";
import type { Contexto } from "../../src/recursos/tipos";
import { numerar } from "../../src/util/numeracao";
import { clicar, dialogoAberto, digitar, usarDocumento } from "../dialogo";
import { type CasoEditor, criarCk5, cursorEm, type FalsoCk4, type FalsoCk5, nosDoisEditores, ultimoInserido } from "../falsos";
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

const LEGADO = JSON.parse(readFileSync(new URL("../legado-numeracao.json", import.meta.url), "utf8")) as Array<{
  classes: Array<string | null>;
  itens: string[] | false;
}>;

const LONGO = "Primeiro paragrafo com um texto bastante longo para ser cortado no rotulo da lista de referencias";
const DOC = `<p class="Paragrafo_Numerado_Nivel1">${LONGO}</p><p class="Paragrafo_Numerado_Nivel2">Segundo</p><p class="Texto_Justificado">livre</p><p class="Paragrafo_Numerado_Nivel2">Terceiro</p>`;

const corpoDe = (c: CasoEditor): HTMLElement =>
  c.versao === 4 ? (c.ed as FalsoCk4).instancia("txaEditor_1").corpo : (c.ed as FalsoCk5).elemento("main");
const evento = (el: Element, tipo: string) =>
  el.dispatchEvent(new (el.ownerDocument.defaultView as unknown as { Event: typeof Event }).Event(tipo, { bubbles: true }));
/** O linkedom trata o <select multiple> como simples (marcar uma opcao desmarca as outras): `selected` passa a refletir o atributo. */
const marcar = (o: Element | null) => {
  o?.setAttribute("selected", "selected");
  Object.defineProperty(o, "selected", { configurable: true, get: () => o?.hasAttribute("selected") ?? false });
};

export async function verificarRefInterna(): Promise<void> {
  secao("util numeracao: igual ao getNiveisParagrafos do legado");
  for (const caso of LEGADO) {
    const obtido = numerar(caso.classes.map((classe) => ({ classe: classe ?? "" })))
      .map((x) => x.item)
      .filter((x) => x !== "");
    igual(`numerar ${JSON.stringify(caso.classes)}`, obtido, caso.itens === false ? [] : caso.itens);
  }

  secao("recurso ref-interna");
  await nosDoisEditores("ref-interna", async (c: CasoEditor) => {
    usarDocumento(c.doc);
    const v = `[CK${c.versao}]`;
    const g = refInterna.globais(ctxDe(c)) as Record<string, Fn>;
    igual(`ref-interna ${v}: globais do contrato`, Object.keys(g).sort(), [
      "clickScroolToRef",
      "getNiveisParagrafos",
      "getRefInterna",
      "updateRefsInternas",
    ]);
    const corpo = corpoDe(c);
    const ed4 = c.versao === 4 ? (c.ed as FalsoCk4).instancia("txaEditor_1") : null;
    const ed5 = c.versao === 5 ? (c.ed as FalsoCk5).instancia() : null;
    const ancoras: Array<[string, number]> = [];
    if (ed5) {
      (c.win as unknown as Record<string, unknown>).SeiProGhs = {
        setAtributos: (el: Element, v2: Record<string, string>) => {
          ancoras.push([v2.id ?? "", ed5.profundidade]);
          el.setAttribute("id", v2.id ?? "");
          return true;
        },
      };
    }

    // sem paragrafos numerados: avisa e nao abre
    corpo.replaceChildren(...htmlParaNos(corpo.ownerDocument, '<p class="Texto_Justificado">so texto</p>'));
    cursorEm(c, corpo.querySelector("p"));
    g.getRefInterna(null);
    checar(
      `ref-interna ${v}: sem paragrafos numerados avisa e nao abre`,
      !dialogoAberto(c.doc) && /não tem parágrafos numerados/.test(c.doc.body.textContent ?? ""),
    );
    c.doc.body.querySelector(".spro-aviso")?.remove();

    // listar nao escreve no documento (o legado gravava uma ancora em todo paragrafo numerado)
    corpo.replaceChildren(...htmlParaNos(corpo.ownerDocument, DOC));
    const lista = g.getNiveisParagrafos() as Array<{ item: string; ancorado: boolean }>;
    igual(
      `ref-interna ${v}: getNiveisParagrafos numera 1, 1.1, 1.2`,
      lista.map((p) => p.item),
      ["1", "1.1", "1.2"],
    );
    checar(
      `ref-interna ${v}: listar nao escreve ancora nenhuma no documento`,
      !corpo.querySelector("a[name], [id]") && ancoras.length === 0,
    );

    // dialogo
    cursorEm(c, corpo.querySelector("p.Texto_Justificado"));
    g.getRefInterna(null);
    const d = dialogoAberto(c.doc) as HTMLElement;
    const opcoes = [...d.querySelectorAll("#selectRef option")];
    igual(
      `ref-interna ${v}: rotulos "N. texto" (corta no meio do texto longo e so entao poe reticencias)`,
      opcoes.map((o) => o.textContent),
      [`1. ${LONGO.slice(0, 50)}${LONGO.slice(50).split(" ")[0]}...`, "1.1. Segundo", "1.2. Terceiro"],
    );
    checar(
      `ref-interna ${v}: botoes Atualizar referencias e Inserir; sem Cancelar`,
      JSON.stringify([...d.querySelectorAll("button")].map((b) => (b.textContent ?? "").trim()).filter((t) => t && t.length > 1)) ===
        JSON.stringify(["Atualizar referências", "Inserir"]) &&
        ![...d.querySelectorAll("button")].some((b) => /cancelar/i.test(b.textContent ?? "")),
    );
    clicar(d, "Inserir");
    checar(
      `ref-interna ${v}: Inserir sem escolher nada avisa e mantem o dialogo`,
      !!dialogoAberto(c.doc) && /Selecione ao menos um/.test(c.doc.body.textContent ?? ""),
    );
    c.doc.body.querySelector(".spro-aviso")?.remove();

    // inserir 2 referencias com prefixo
    digitar(d.querySelector("#prefixo") as HTMLInputElement, "item");
    marcar(opcoes[1] ?? null);
    marcar(opcoes[2] ?? null);
    clicar(d, "Inserir");
    const html = ultimoInserido(c) ?? "";
    const refs = [
      ...html.matchAll(
        /href="#RefPro_([0-9a-zA-Z]{16})" class="ancoraSei refInternaPro anchorRefInternaPro" contenteditable="false">\[item (1\.\d)\]<\/a>/g,
      ),
    ];
    igual(
      `ref-interna ${v}: 2 referencias "[item 1.1] e [item 1.2]"`,
      refs.map((m) => m[2]),
      ["1.1", "1.2"],
    );
    checar(`ref-interna ${v}: separador " e " antes da ultima`, /<\/a> e <a /.test(html) && !html.includes(", "), html);
    checar(`ref-interna ${v}: o dialogo fecha`, !dialogoAberto(c.doc));
    const ps = [...corpo.querySelectorAll("p")];
    const nomes = refs.map((m) => `RefPro_${m[1]}`);
    if (c.versao === 4) {
      igual(
        `ref-interna ${v}: so os paragrafos REFERENCIADOS ganham <a name class=refpro> (o 1o nao)`,
        ps.map((p) => p.querySelector("a.refpro")?.getAttribute("name") ?? null),
        [null, nomes[0] ?? null, null, nomes[1] ?? null],
      );
      igual(`ref-interna ${v}: tudo num passo de desfazer (2 snapshots)`, ed4?.snapshots, 2);
    } else {
      igual(
        `ref-interna ${v}: no CK5 a ancora e o id do paragrafo, so dos referenciados`,
        ps.map((p) => p.id || null),
        [null, nomes[0] ?? null, null, nomes[1] ?? null],
      );
      checar(`ref-interna ${v}: ancoras no mesmo model.change da insercao`, ancoras.length === 2 && ancoras.every((a) => a[1] > 0));
    }

    // prefixo vazio => "[1.1]"
    corpo.replaceChildren(...htmlParaNos(corpo.ownerDocument, DOC));
    cursorEm(c, corpo.querySelector("p.Texto_Justificado"));
    g.getRefInterna(null);
    const d2 = dialogoAberto(c.doc) as HTMLElement;
    marcar(d2.querySelectorAll("#selectRef option")[1] ?? null);
    clicar(d2, "Inserir");
    checar(
      `ref-interna ${v}: prefixo vazio equivale a sem prefixo ("[1.1]")`,
      />\[1\.1\]<\/a>/.test(ultimoInserido(c) ?? ""),
      ultimoInserido(c) ?? "",
    );

    // atualizar: um paragrafo numerado novo antes do alvo renumera o rotulo existente
    const alvo =
      c.versao === 4
        ? '<p class="Paragrafo_Numerado_Nivel2"><a name="RefPro_AAAAAAAAAAAAAAAA" class="refpro"></a>alvo</p>'
        : '<p class="Paragrafo_Numerado_Nivel2" id="RefPro_AAAAAAAAAAAAAAAA">alvo</p>';
    corpo.replaceChildren(
      ...htmlParaNos(
        corpo.ownerDocument,
        `<p class="Paragrafo_Numerado_Nivel1">um</p>${alvo}<p class="Texto_Justificado">veja <a href="#RefPro_AAAAAAAAAAAAAAAA" class="ancoraSei refInternaPro" contenteditable="false">[item 1.1]</a> e <a href="#RefPro_ZZZZZZZZZZZZZZZZ">[item 9]</a></p>`,
      ),
    );
    const antesSnap = ed4?.snapshots ?? 0;
    g.updateRefsInternas(ed4 ?? ed5, "item", false);
    const link = corpo.querySelector('a[href="#RefPro_AAAAAAAAAAAAAAAA"]') as Element;
    if (c.versao === 4) checar(`ref-interna ${v}: sem mudanca nao abre passo de desfazer`, ed4?.snapshots === antesSnap);
    else checar(`ref-interna ${v}: sem mudanca nao escreve no model`, ed5?.textosInseridos.length === 0);

    corpo.querySelector("p")?.after(...htmlParaNos(corpo.ownerDocument, '<p class="Paragrafo_Numerado_Nivel2">novo</p>'));
    g.updateRefsInternas(ed4 ?? ed5, "item", false);
    if (c.versao === 4) {
      igual(
        `ref-interna ${v}: atualizar renumera o rotulo (1.1 -> 1.2) e deixa a referencia perdida como esta`,
        [link.textContent, corpo.querySelector('a[href="#RefPro_ZZZZZZZZZZZZZZZZ"]')?.textContent],
        ["[item 1.2]", "[item 9]"],
      );
      igual(`ref-interna ${v}: atualizar e um passo de desfazer`, (ed4?.snapshots ?? 0) - antesSnap, 2);
    } else {
      igual(
        `ref-interna ${v}: atualizar troca o texto do link pelo model (remove + insertText com linkHref), sem tocar a selecao`,
        [ed5?.removidos.length, ed5?.textosInseridos.map((t) => [t.texto, t.atributos.linkHref, t.profundidade > 0])],
        [1, [["[item 1.2]", "#RefPro_AAAAAAAAAAAAAAAA", true]]],
      );
      igual(`ref-interna ${v}: atualizar nao muda a selecao`, ed5?.selecoesDefinidas.length, 0);
    }
    // assinatura antiga updateRefsInternas(prefixo, ocultar)
    corpo.querySelector("p")?.after(...htmlParaNos(corpo.ownerDocument, '<p class="Paragrafo_Numerado_Nivel2">outro</p>'));
    g.updateRefsInternas("item", true);
    if (c.versao === 4) igual(`ref-interna ${v}: assinatura antiga (prefixo, ocultar) sem prefixo`, link.textContent, "[1.3]");
    else igual(`ref-interna ${v}: assinatura antiga (prefixo, ocultar) sem prefixo`, ed5?.textosInseridos.at(-1)?.texto, "[1.3]");

    // dialogo: Atualizar avisa quantas referencias ficaram sem destino
    cursorEm(c, corpo.querySelector("p.Texto_Justificado"));
    g.getRefInterna(null);
    const d3 = dialogoAberto(c.doc) as HTMLElement;
    clicar(d3, "Atualizar referências");
    checar(
      `ref-interna ${v}: Atualizar avisa as referencias sem destino`,
      /1 apontam para parágrafos que não existem mais/.test(c.doc.body.textContent ?? ""),
    );
    clicar(d3, "Fechar");
    c.doc.body.querySelector(".spro-aviso")?.remove();

    // clique na referencia rola ate o paragrafo-alvo
    let rolou = 0;
    const paragrafoAlvo = corpo.querySelector("#RefPro_AAAAAAAAAAAAAAAA, a[name='RefPro_AAAAAAAAAAAAAAAA']")?.closest("p") as HTMLElement;
    paragrafoAlvo.scrollIntoView = () => {
      rolou += 1;
    };
    g.clickScroolToRef();
    evento(link, "click");
    igual(`ref-interna ${v}: clicar na referencia rola ate o paragrafo da ancora`, rolou, 1);
    g.clickScroolToRef();
    evento(link, "click");
    igual(`ref-interna ${v}: clickScroolToRef repetido nao duplica o ouvinte`, rolou, 2);
  });

  // CK5: cursor em secao somente leitura nao escreve
  {
    const f = criarCk5({
      secoes: [
        { raiz: "cab", label: "Cabeçalho", html: '<p class="Paragrafo_Numerado_Nivel1">cab</p>', somenteLeitura: true },
        { raiz: "main", label: "Corpo do Texto", html: '<p class="Paragrafo_Numerado_Nivel1">corpo</p>', principal: true },
      ],
    });
    usarDocumento(f.doc);
    const ctx = ctxDe(f);
    let recusas = 0;
    ctx.adaptador.aoRecusarEscrita(() => {
      recusas += 1;
    });
    const g = refInterna.globais(ctx) as Record<string, Fn>;
    const principal = f.elemento("main").querySelector("p") as Element;
    f.selecionar({ raiz: "main", elemento: principal });
    g.getRefInterna(null);
    const d = dialogoAberto(f.doc) as HTMLElement;
    f.selecionar({ raiz: "cab", elemento: f.elemento("cab").querySelector("p") });
    marcar(d.querySelector("#selectRef option"));
    clicar(d, "Inserir");
    checar(
      "ref-interna [CK5]: cursor em secao somente leitura nao insere e avisa a recusa",
      f.instancia().insercoes.length === 0 && recusas === 1,
    );
  }
}
