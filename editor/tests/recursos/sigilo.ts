import { criarAdaptador } from "../../src/adaptador";
import {
  extrairCpfs,
  extrairEmails,
  registrarSaidaSigiloCK4Pro,
  registrarSaidaSigiloCK5Pro,
  recurso as sigilo,
  unicos,
} from "../../src/recursos/sigilo";
import type { Contexto } from "../../src/recursos/tipos";
import { dialogoAberto, tique, usarDocumento } from "../dialogo";
import {
  type CasoEditor,
  criarCk4,
  criarCk5,
  type FalsoCk4,
  type FalsoCk5,
  nosDoisEditores,
  selecionarTexto,
  ultimoInserido,
} from "../falsos";
import { checar, igual, secao } from "../util";

type Fn = (...a: unknown[]) => unknown;
// biome-ignore lint/suspicious/noExplicitAny: os falsos do CKEditor nao tem tipos para o model/filtros
type Qualquer = any;

const ctxDe = (win: Window, doc: Document, adaptador = criarAdaptador(win)): Contexto => ({
  adaptador,
  doc,
  win,
  base: "",
  checkOpcao: () => true,
  verifyOpcao: () => false,
});

const txt = (el: Element | null | undefined): string => (el?.textContent ?? "").replace(/\s+/g, " ").trim();
const aviso = (doc: Document): string => txt(doc.body.querySelector(".spro-aviso"));
const limparAvisos = (doc: Document): void => {
  for (const a of doc.body.querySelectorAll(".spro-aviso")) a.remove();
};
/** Ordena os atributos de cada tag (o linkedom serializa em ordem diferente do navegador). */
const ordenar = (html: string): string =>
  html.replace(/<([a-z0-9]+)((?:\s+[\w-]+(?:="[^"]*")?)+)\s*>/gi, (_t, tag: string, attrs: string) => {
    const lista = attrs.match(/[\w-]+(?:="[^"]*")?/g) ?? [];
    return `<${tag} ${lista.sort().join(" ")}>`;
  });
const igualHtml = (nome: string, obtido: string, esperado: string): void => igual(nome, ordenar(obtido), ordenar(esperado));
const contar = (html: string, trecho: string): number => html.split(trecho).length - 1;

/** Corpo do caso (CK4: do iframe da secao; CK5: dados da raiz e DOM da editavel, como a vista do CK5 depois de um `data.set`). */
function definirCorpo(c: CasoEditor, html: string): void {
  if (c.versao === 4) {
    (c.ed as FalsoCk4).instancia("txaEditor_1").corpo.innerHTML = html;
    return;
  }
  const f = c.ed as FalsoCk5;
  f.instancia().dadosPorRaiz.main = html;
  f.elemento("main").innerHTML = html;
}
const corpoHtml = (c: CasoEditor): string =>
  c.versao === 4 ? (c.ed as FalsoCk4).instancia("txaEditor_1").corpo.innerHTML : (c.ed as FalsoCk5).instancia().dadosPorRaiz.main;

/** No CK5 de verdade o `data.set` refaz a vista: o falso passa a refazer o DOM da editavel tambem. */
function vistaSegueOsDados(c: CasoEditor): void {
  if (c.versao !== 5) return;
  const f = c.ed as FalsoCk5;
  const inst = f.instancia();
  const original = inst.data.set;
  inst.data.set = (v) => {
    original(v);
    f.elemento("main").innerHTML = inst.dadosPorRaiz.main ?? "";
  };
}

function clicarId(raiz: ParentNode, id: string): void {
  const b = raiz.querySelector(`#${id}`) as HTMLElement | null;
  if (!b) throw new Error(`#${id} nao encontrado`);
  const Ev = (b.ownerDocument.defaultView as unknown as { Event: typeof Event }).Event;
  b.dispatchEvent(new Ev("click", { bubbles: true }));
}

// ---- model falso do CK5 para a marca (GHS `htmlSpan`) ----
class NoTexto {
  previousSibling: NoTexto | null = null;
  nextSibling: NoTexto | null = null;
  constructor(
    readonly nome: string,
    private readonly atributos: Record<string, unknown>,
  ) {}
  is(t: string): boolean {
    return t === "$text";
  }
  getAttribute(n: string): unknown {
    return this.atributos[n];
  }
}
function encadear(...nos: NoTexto[]): NoTexto[] {
  nos.forEach((n, i) => {
    n.previousSibling = nos[i - 1] ?? null;
    n.nextSibling = nos[i + 1] ?? null;
  });
  return nos;
}

interface ModeloGhs {
  atribuicoes: Array<{ nome: string; valor: unknown; alvo: unknown }>;
  remocoes: Array<{ nome: string; alvo: unknown }>;
}
/** Poe um model com texto no CK5 falso: `pos` e a posicao do cursor; `colapsada` diz se a selecao e so o cursor. */
function instalarModelo(
  f: FalsoCk5,
  pos: { textNode?: NoTexto | null; nodeAfter?: NoTexto | null; nodeBefore?: NoTexto | null },
  colapsada: boolean,
): ModeloGhs {
  const inst = f.instancia() as Qualquer;
  const registro: ModeloGhs = { atribuicoes: [], remocoes: [] };
  inst.model.document.selection.getFirstPosition = () => ({
    root: { rootName: "main" },
    textNode: null,
    nodeAfter: null,
    nodeBefore: null,
    ...pos,
  });
  inst.model.document.selection.isCollapsed = colapsada;
  inst.model.createPositionBefore = (n: NoTexto) => ({ antes: n.nome });
  inst.model.createPositionAfter = (n: NoTexto) => ({ depois: n.nome });
  inst.model.createRange = (a: unknown, b: unknown) => ({ de: a, ate: b });
  inst.writer.setAttribute = (nome: string, valor: unknown, alvo: unknown) => registro.atribuicoes.push({ nome, valor, alvo });
  inst.writer.removeAttribute = (nome: string, alvo: unknown) => registro.remocoes.push({ nome, alvo });
  return registro;
}

export async function verificarSigilo(): Promise<void> {
  secao("recurso sigilo: utilitarios");
  igual("extrairEmails", extrairEmails("a joao.silva+x@org.gov.br e MARIA@x.com; fim"), ["joao.silva+x@org.gov.br", "MARIA@x.com"]);
  igual("extrairEmails: sem e-mail devolve lista vazia (e nao null)", extrairEmails("nada aqui"), []);
  igual("extrairCpfs", extrairCpfs("CPF 123.456.789-09 e 111.222.333-44."), ["123.456.789-09", "111.222.333-44"]);
  igual("extrairCpfs: sem CPF devolve lista vazia", extrairCpfs("12345"), []);
  igual("unicos: ordena e tira repetidos sem alterar a entrada", unicos(["b", "a", "b", "c", "a"]), ["a", "b", "c"]);
  const entrada = ["z", "a"];
  unicos(entrada);
  igual("unicos: a lista original nao e reordenada", entrada, ["z", "a"]);

  secao("recurso sigilo: filtros de saida");
  {
    const regras: Array<{ regras: Qualquer; opcoes: unknown }> = [];
    const ck4: Qualquer = {
      dataProcessor: { htmlFilter: { addRules: (r: unknown, o: unknown) => regras.push({ regras: r, opcoes: o }) } },
    };
    registrarSaidaSigiloCK4Pro(ck4);
    registrarSaidaSigiloCK4Pro(ck4);
    igual("CK4: o filtro e registrado uma so vez (idempotente)", regras.length, 1);
    igual("CK4: vale para todos os elementos (applyToAll)", regras[0]?.opcoes, { applyToAll: true });
    const span = regras[0]?.regras.elements.span as (el: unknown) => void;
    const tarja: { attributes: Record<string, string> } = { attributes: { class: "x sigiloSEI_tarja", "data-text": "segredo" } };
    span(tarja);
    checar(
      "CK4: a tarja perde o data-text na saida",
      tarja.attributes["data-text"] === undefined && tarja.attributes.class === "x sigiloSEI_tarja",
    );
    const marca = { attributes: { class: "sigiloSEI", "data-text": "ok" } };
    span(marca);
    checar("CK4: marca simples e span qualquer mantem o data-text", marca.attributes["data-text"] === "ok");
    span({ attributes: undefined });
    span({ attributes: { class: "sigiloSEI_tarjaX", "data-text": "t" } });
    checar("CK4: elemento sem atributos nao quebra; classe parecida nao conta", true);
    registrarSaidaSigiloCK4Pro({ model: {}, dataProcessor: ck4.dataProcessor });
    registrarSaidaSigiloCK4Pro(null);
    registrarSaidaSigiloCK4Pro({});
    igual("CK4: editor do CK5, nulo ou sem dataProcessor e ignorado", regras.length, 1);

    const escutas: Array<{ evento: string; fn: Qualquer; opcoes: unknown }> = [];
    const ck5: Qualquer = {
      model: {},
      data: { downcastDispatcher: { on: (evento: string, fn: unknown, opcoes: unknown) => escutas.push({ evento, fn, opcoes }) } },
    };
    registrarSaidaSigiloCK5Pro(ck5);
    registrarSaidaSigiloCK5Pro(ck5);
    igual(
      "CK5: o conversor e registrado uma so vez, no evento attribute e em prioridade alta",
      escutas.map((e) => [e.evento, e.opcoes]),
      [["attribute", { priority: "high" }]],
    );
    const fn = escutas[0]?.fn as (e: unknown, d: Qualquer, api?: unknown) => void;
    const original = { classes: ["sigiloSEI_tarja"], attributes: { "data-text": "segredo", title: "t" }, styles: { color: "red" } };
    const dados = { attributeNewValue: original };
    fn(null, dados, { options: {} });
    igual("CK5: troca o valor por uma copia sem data-text (mantem classes, atributos e estilos)", dados.attributeNewValue, {
      classes: ["sigiloSEI_tarja"],
      attributes: { title: "t" },
      styles: { color: "red" },
    });
    checar("CK5: o valor do model nao e alterado", "data-text" in original.attributes);
    const interno = { attributeNewValue: { classes: ["sigiloSEI_tarja"], attributes: { "data-text": "x" } } };
    fn(null, interno, { options: { seiProInterno: true } });
    checar("CK5: o vai-e-volta interno (seiProInterno) preserva o atributo", "data-text" in interno.attributeNewValue.attributes);
    for (const classes of ["a sigiloSEI_tarja", new Set(["sigiloSEI_tarja"]), { sigiloSEI_tarja: true }]) {
      const d = { attributeNewValue: { classes, attributes: { "data-text": "x" } } };
      fn(null, d, {});
      checar(
        `CK5: reconhece a classe da tarja em ${typeof classes === "string" ? "texto" : classes instanceof Set ? "Set" : "objeto"}`,
        !("data-text" in d.attributeNewValue.attributes),
      );
    }
    const semTarja = { attributeNewValue: { classes: ["sigiloSEI"], attributes: { "data-text": "x" } } };
    fn(null, semTarja, {});
    const semAtributo = { attributeNewValue: { classes: ["sigiloSEI_tarja"], attributes: { title: "x" } } };
    const antes = semAtributo.attributeNewValue;
    fn(null, semAtributo, {});
    fn(null, { attributeNewValue: null }, {});
    fn(null, { attributeNewValue: "texto" }, {});
    fn(null, undefined as unknown as object, undefined);
    checar(
      "CK5: marca simples, tarja sem data-text e valores estranhos ficam como estao",
      "data-text" in semTarja.attributeNewValue.attributes && semAtributo.attributeNewValue === antes,
    );
    registrarSaidaSigiloCK5Pro({ data: ck5.data });
    registrarSaidaSigiloCK5Pro({ model: {} });
    registrarSaidaSigiloCK5Pro(undefined);
    igual("CK5: editor do CK4, sem despachante ou nulo e ignorado", escutas.length, 1);
  }

  await nosDoisEditores("sigilo", async (c: CasoEditor) => {
    usarDocumento(c.doc);
    const v = `[CK${c.versao}]`;
    const w = c.win as unknown as Record<string, unknown>;
    const adaptador = criarAdaptador(c.win);
    const estado = { sel: true, recusas: 0 };
    adaptador.aoRecusarEscrita(() => {
      estado.recusas += 1;
    });
    w.hasSelection = () => estado.sel;
    w.randomNumber = () => 9;
    vistaSegueOsDados(c);
    const g = sigilo.globais(ctxDe(c.win, c.doc, adaptador)) as Record<string, Fn>;
    const BLOCOS = "█".repeat(9);

    igual(`sigilo ${v}: globais do contrato`, Object.keys(g), [
      "getMarkSigilo",
      "getTarjaSigilo",
      "getBoxSigilo",
      "getDialogSigilo",
      "openDialogSigilo",
      "actionsMarkSigilo",
      "registrarSaidaSigiloCK4Pro",
      "registrarSaidaSigiloCK5Pro",
      "rodapeSigiloMark",
      "htmlTabSigiloResult",
    ]);
    igual(`sigilo ${v}: id do recurso`, sigilo.id, "sigilo");
    igual(
      `sigilo ${v}: getDialogSigilo e no-op (o dialogo abre sob demanda)`,
      [g.getDialogSigilo(), dialogoAberto(c.doc)],
      [undefined, null],
    );

    // ======== marcar a selecao ========
    const p = c.doc.createElement("p");
    p.textContent = "texto";
    // sem texto selecionado: avisa e nao insere
    estado.sel = false;
    g.getMarkSigilo(null);
    checar(
      `sigilo ${v}: marcar sem selecao avisa e nao insere`,
      aviso(c.doc) === "Selecione um texto para adicionar a marca de sigilo." && ultimoInserido(c) === null,
    );
    limparAvisos(c.doc);
    estado.sel = true;
    selecionarTexto(c, c.versao === 4 ? ((c.ed as FalsoCk4).instancia("txaEditor_1").corpo.querySelector("p") as Element) : p, "", "");
    g.getMarkSigilo(null);
    checar(
      `sigilo ${v}: selecao de HTML vazio tambem avisa`,
      aviso(c.doc) === "Selecione um texto para adicionar a marca de sigilo." && ultimoInserido(c) === null,
    );
    limparAvisos(c.doc);

    const alvoP = (
      c.versao === 4
        ? (c.ed as FalsoCk4).instancia("txaEditor_1").corpo.querySelector("p")
        : (c.ed as FalsoCk5).elemento("main").querySelector("p")
    ) as Element;
    selecionarTexto(c, alvoP, "Fulano <b>de</b> Tal", "Fulano <b>de</b> Tal");
    g.getMarkSigilo(null);
    igual(
      `sigilo ${v}: marcar envolve o HTML selecionado num span.sigiloSEI`,
      ultimoInserido(c),
      '<span class="sigiloSEI">Fulano <b>de</b> Tal</span>',
    );

    // tarja: marca a selecao e tarja tudo
    selecionarTexto(c, alvoP, "Beltrano", "Beltrano");
    estado.sel = false;
    g.getTarjaSigilo(null);
    checar(`sigilo ${v}: tarjar sem selecao avisa`, aviso(c.doc) === "Selecione um texto para tarjar.");
    limparAvisos(c.doc);
    estado.sel = true;
    selecionarTexto(c, alvoP, "", "");
    g.getTarjaSigilo(null);
    checar(`sigilo ${v}: tarjar com selecao vazia avisa`, aviso(c.doc) === "Selecione um texto para tarjar.");
    limparAvisos(c.doc);
    selecionarTexto(c, alvoP, "Beltrano", "Beltrano");
    definirCorpo(c, '<p>x <span class="sigiloSEI">Beltrano</span></p>'); // o que a insercao do editor deixa no corpo
    g.getTarjaSigilo(null);
    igual(`sigilo ${v}: tarjar insere a marca na selecao`, ultimoInserido(c), '<span class="sigiloSEI">Beltrano</span>');
    checar(`sigilo ${v}: a tarja so e aplicada depois (setTimeout)`, !corpoHtml(c).includes("sigiloSEI_tarja"));
    await tique(20);
    igualHtml(
      `sigilo ${v}: depois da insercao o documento fica tarjado, com o texto original em data-text e o rodape de contagem`,
      corpoHtml(c),
      `<p>x <span class="sigiloSEI_tarja" data-text="Beltrano">${BLOCOS}</span></p><p class="sigiloSEI_sigilo_mark" contenteditable="false" style="font-size: 6pt;color: #ccc;font-family: monospace;">#_contem_1_marcas_sigilo</p>`,
    );

    // ======== desmarcar (CK4: span do corpo) ========
    if (c.versao === 4) {
      definirCorpo(c, '<p>um <span class="sigiloSEI">segredo <b>grande</b></span> fim</p>');
      const corpo = (c.ed as FalsoCk4).instancia("txaEditor_1").corpo;
      const interno = corpo.querySelector("b") as Element;
      (c.ed as FalsoCk4).selecionar("txaEditor_1", { elemento: interno, texto: "grande", html: "grande" });
      g.getMarkSigilo(null);
      igual(
        `sigilo ${v}: com o cursor dentro de uma marca, marcar desfaz (o span some, o conteudo fica)`,
        corpo.innerHTML,
        "<p>um segredo <b>grande</b> fim</p>",
      );
      checar(`sigilo ${v}: e nenhum atributo temporario sobra`, !corpo.innerHTML.includes("unmark"));
      definirCorpo(c, '<p>um <span class="sigiloSEI">a</span> e <span class="sigiloSEI">b</span></p>');
      const segunda = corpo.querySelectorAll("span")[1] as Element;
      (c.ed as FalsoCk4).selecionar("txaEditor_1", { elemento: segunda, texto: "b", html: "b" });
      g.getMarkSigilo(null);
      igual(`sigilo ${v}: so a marca sob o cursor e desfeita`, corpo.innerHTML, '<p>um <span class="sigiloSEI">a</span> e b</p>');
    }

    // ======== somente leitura ========
    {
      const ro =
        c.versao === 4
          ? criarCk4({
              secoes: [{ nome: "txaEditor_1", titulo: "Corpo", html: '<p>x <span class="sigiloSEI">y</span></p>', somenteLeitura: true }],
            })
          : criarCk5({ secoes: [{ raiz: "main", label: "Corpo do Texto", html: "<p>x</p>", principal: true, somenteLeitura: true }] });
      usarDocumento(ro.doc);
      const roAdapt = criarAdaptador(ro.win);
      let recusas = 0;
      roAdapt.aoRecusarEscrita(() => {
        recusas += 1;
      });
      (ro.win as Qualquer).hasSelection = () => true;
      const gro = sigilo.globais(ctxDe(ro.win, ro.doc, roAdapt)) as Record<string, Fn>;
      const corpoRo = c.versao === 4 ? (ro as FalsoCk4).instancia("txaEditor_1").corpo : (ro as FalsoCk5).elemento("main");
      const quase =
        c.versao === 4
          ? ((ro as FalsoCk4).instancia("txaEditor_1").corpo.querySelector("span") as Element)
          : (corpoRo.querySelector("p") as Element);
      if (c.versao === 4) (ro as FalsoCk4).selecionar("txaEditor_1", { elemento: quase, texto: "y", html: "y" });
      else (ro as FalsoCk5).selecionar({ elemento: quase, texto: "x", html: "x" });
      const antes = corpoRo.innerHTML;
      gro.getMarkSigilo(null);
      gro.getTarjaSigilo(null);
      await tique(20);
      checar(
        `sigilo ${v}: em secao somente leitura marcar e tarjar so avisam a recusa (uma por clique) e nada muda`,
        recusas === 2 && corpoRo.innerHTML === antes,
      );
      gro.actionsMarkSigilo(null, "apply", false, false, roAdapt.getInstance() ?? undefined);
      if (c.versao === 4)
        igual(
          `sigilo ${v}: em CK4 somente leitura a tarja em massa tambem e recusada`,
          [corpoRo.innerHTML === antes, recusas >= 3],
          [true, true],
        );
      usarDocumento(c.doc);
    }

    // ======== dialogo ========
    definirCorpo(c, "<p>Maria mora na Rua A. Mariana nao. maria e MARIA.</p>");
    selecionarTexto(c, alvoP, "Maria", "Maria");
    g.getBoxSigilo(null);
    const d = dialogoAberto(c.doc) as HTMLElement;
    checar(`sigilo ${v}: getBoxSigilo abre o dialogo`, !!d);
    igual(`sigilo ${v}: titulo`, d.querySelector("h2")?.textContent, "Gerenciar marcas de sigilo do documento");
    igual(
      `sigilo ${v}: quatro abas`,
      [...d.querySelectorAll('[role="tab"]')].map((t) => txt(t)),
      ["1. Localizar texto e dados pessoais", "2. Tarjar marcas de sigilo", "Remover marcas", "Guia rápido"],
    );
    checar(`sigilo ${v}: sem botao Cancelar`, ![...d.querySelectorAll("button")].some((b) => /cancelar/i.test(b.textContent ?? "")));
    checar(
      `sigilo ${v}: ids preservados`,
      [
        "dialogSigiloPro",
        "sigiloTabs",
        "inputSigiloTexto",
        "btnSigiloReplace",
        "btnSigiloEmailCpf",
        "btnSigiloApply",
        "btnSigiloRemove",
        "tabSigilo1_result",
        "tabSigilo2_result",
        "tabSigilo3_result",
        "tabSigilo3_info",
      ].every((id) => !!d.querySelector(`#${id}`)),
    );
    igual(
      `sigilo ${v}: o texto selecionado ja vem no campo`,
      (d.querySelector("#inputSigiloTexto") as HTMLInputElement).getAttribute("value"),
      "Maria",
    );
    const guia = d.querySelector('a[href="https://seipro.app/pages/SIGILODOC.html"]') as HTMLElement | null;
    checar(
      `sigilo ${v}: o guia abre em nova aba, sem opener`,
      guia?.getAttribute("target") === "_blank" && /noopener/.test(guia?.getAttribute("rel") ?? ""),
    );
    const r1 = () => txt(d.querySelector("#tabSigilo1_result"));
    const r2 = () => d.querySelector("#tabSigilo2_result") as HTMLElement;
    const r3 = () => d.querySelector("#tabSigilo3_result") as HTMLElement;
    checar(
      `sigilo ${v}: ao abrir, a aba Tarjar ja mostra que nao ha marcas`,
      r1().startsWith("Nenhuma marca de sigilo no documento! Adicione marcas de sigilo na aba"),
    );
    checar(`sigilo ${v}: resultados das abas 1 e 3 comecam ocultos`, r2().hasAttribute("hidden") && r3().hasAttribute("hidden"));

    // ---- Localizar texto ----
    const campo = d.querySelector("#inputSigiloTexto") as HTMLInputElement;
    campo.value = "   ";
    clicarId(d, "btnSigiloReplace");
    igual(`sigilo ${v}: campo vazio pede o texto`, txt(r2()), "Digite um texto para adicionar a marca de sigilo");
    checar(`sigilo ${v}: e o resultado fica visivel`, !r2().hasAttribute("hidden"));

    campo.value = "zzz";
    clicarId(d, "btnSigiloReplace");
    igual(`sigilo ${v}: texto inexistente`, txt(r2()), "Nenhum texto encontrado!");

    campo.value = " maria ";
    clicarId(d, "btnSigiloReplace");
    igual(
      `sigilo ${v}: marca sem diferenciar maiusculas, so palavra inteira (nao pega Mariana)`,
      txt(r2()),
      "3 marcas adicionadas com sucesso!",
    );
    igual(
      `sigilo ${v}: o corpo ficou com as tres marcas, mantendo a grafia original`,
      corpoHtml(c),
      '<p><span class="sigiloSEI">Maria</span> mora na Rua A. Mariana nao. <span class="sigiloSEI">maria</span> e <span class="sigiloSEI">MARIA</span>.</p>',
    );
    igual(`sigilo ${v}: a aba Tarjar conta as marcas do documento`, r1(), "3 marcas de sigilo encontradas no documento!");
    checar(`sigilo ${v}: o resultado da aba Remover fica oculto`, r3().hasAttribute("hidden"));

    clicarId(d, "btnSigiloReplace");
    igual(
      `sigilo ${v}: repetir nao aninha marcas nem muda a contagem`,
      [txt(r2()), contar(corpoHtml(c), '<span class="sigiloSEI"><span')],
      ["3 marcas adicionadas com sucesso!", 0],
    );

    definirCorpo(c, "<p>Um so Pedro aqui</p>");
    campo.value = "Pedro";
    clicarId(d, "btnSigiloReplace");
    igual(`sigilo ${v}: singular`, txt(r2()), "1 marca adicionada com sucesso!");
    igual(`sigilo ${v}: contagem singular na aba Tarjar`, r1(), "1 marca de sigilo encontrada no documento!");

    // entradas hostis: caracteres de regex e de HTML sao texto
    definirCorpo(c, "<p>valor a.b e axb (x) [y]</p>");
    campo.value = "a.b";
    clicarId(d, "btnSigiloReplace");
    igual(
      `sigilo ${v}: o ponto do texto e literal (nao casa axb)`,
      [txt(r2()), contar(corpoHtml(c), 'class="sigiloSEI"')],
      ["1 marca adicionada com sucesso!", 1],
    );
    for (const hostil of ["(x", ".*", "[y]", "\\", "a|b", "$^"]) {
      definirCorpo(c, "<p>valor a.b e axb (x) [y]</p>");
      campo.value = hostil;
      try {
        clicarId(d, "btnSigiloReplace");
        checar(
          `sigilo ${v}: entrada ${JSON.stringify(hostil)} nao quebra a busca`,
          /Nenhum texto encontrado|marca adicionada|marcas adicionadas/.test(txt(r2())),
        );
      } catch (e) {
        checar(`sigilo ${v}: entrada ${JSON.stringify(hostil)} nao quebra a busca`, false, String(e));
      }
    }
    definirCorpo(c, "<p>Sr. &lt;NOME&gt; e &lt;img src=x onerror=alert(1)&gt; fim</p>");
    campo.value = "NOME";
    clicarId(d, "btnSigiloReplace");
    igual(
      `sigilo ${v}: texto com < e > continua texto (nao vira elemento)`,
      corpoHtml(c),
      '<p>Sr. &lt;<span class="sigiloSEI">NOME</span>&gt; e &lt;img src=x onerror=alert(1)&gt; fim</p>',
    );
    campo.value = "<img src=x onerror=alert(1)>";
    clicarId(d, "btnSigiloReplace");
    checar(
      `sigilo ${v}: HTML digitado no campo nunca e interpretado`,
      !c.doc.body.querySelector("img") && txt(r2()) === "Nenhum texto encontrado!",
    );

    // marca existente do mesmo texto e refeita sem aninhar
    definirCorpo(c, '<p><span class="sigiloSEI">Ana</span> e Ana, <b>Ana</b></p>');
    campo.value = "Ana";
    clicarId(d, "btnSigiloReplace");
    igual(
      `sigilo ${v}: marca antiga do mesmo texto e refeita (nao aninha), inclusive dentro de negrito`,
      corpoHtml(c),
      '<p><span class="sigiloSEI">Ana</span> e <span class="sigiloSEI">Ana</span>, <b><span class="sigiloSEI">Ana</span></b></p>',
    );
    igual(`sigilo ${v}: e a contagem soma as tres`, txt(r2()), "3 marcas adicionadas com sucesso!");

    // ---- Dados pessoais ----
    definirCorpo(c, "<p>Contato joao@x.com.br, CPF 123.456.789-09. Repetido 123.456.789-09.</p>");
    clicarId(d, "btnSigiloEmailCpf");
    igual(
      `sigilo ${v}: dados pessoais: CPFs e e-mails sao marcados (a contagem acumula entre os dados)`,
      [txt(r2()), contar(corpoHtml(c), 'class="sigiloSEI"')],
      ["3 marcas adicionadas com sucesso!", 3],
    );
    igual(
      `sigilo ${v}: o e-mail inteiro fica dentro de uma marca`,
      contar(corpoHtml(c), '<span class="sigiloSEI">joao@x.com.br</span>'),
      1,
    );
    definirCorpo(c, "<p>Nada pessoal aqui</p>");
    clicarId(d, "btnSigiloEmailCpf");
    igual(`sigilo ${v}: sem dados pessoais informa`, txt(r2()), "Nenhum dado pessoal (e-mail ou CPF) encontrado!");
    definirCorpo(c, "<p>Mail a@b.co</p>");
    clicarId(d, "btnSigiloEmailCpf");
    igual(`sigilo ${v}: um dado so`, txt(r2()), "1 marca adicionada com sucesso!");

    // ---- Tarjar ----
    definirCorpo(c, '<p>Ana <span class="sigiloSEI">Fulano <b>Silva</b></span> e <span class="sigiloSEI">Beltrano</span></p>');
    clicarId(d, "btnSigiloApply");
    igualHtml(
      `sigilo ${v}: tarjar troca cada marca por blocos e guarda o original em data-text (e poe o rodape)`,
      corpoHtml(c),
      `<p>Ana <span class="sigiloSEI_tarja" data-text="Fulano <b>Silva</b>">${BLOCOS}</span> e <span class="sigiloSEI_tarja" data-text="Beltrano">${BLOCOS}</span></p><p class="sigiloSEI_sigilo_mark" contenteditable="false" style="font-size: 6pt;color: #ccc;font-family: monospace;">#_contem_2_marcas_sigilo</p>`,
    );
    igual(
      `sigilo ${v}: mensagem de tarja (plural)`,
      r1(),
      '2 marcas tarjadas com sucesso!Estas marcas tarjadas poderão ser revertidas na aba "Remover marcas" somente enquanto aberto este editor de documentos.',
    );
    checar(`sigilo ${v}: os resultados das outras abas ficam ocultos`, r2().hasAttribute("hidden") && r3().hasAttribute("hidden"));

    definirCorpo(c, '<p><span class="sigiloSEI">Unico</span></p>');
    clicarId(d, "btnSigiloApply");
    igual(
      `sigilo ${v}: mensagem de tarja (singular)`,
      r1(),
      '1 marca tarjada com sucesso!Esta marca tarjada poderá ser revertida na aba "Remover marcas" somente enquanto aberto este editor de documentos.',
    );
    igual(`sigilo ${v}: rodape no singular de tarja`, contar(corpoHtml(c), "#_contem_1_marcas_sigilo"), 1);

    // marcas aninhadas: conta so a de fora
    definirCorpo(c, '<p><span class="sigiloSEI">a <span class="sigiloSEI">b</span></span></p>');
    clicarId(d, "btnSigiloApply");
    igual(
      `sigilo ${v}: marca aninhada conta uma so tarja`,
      [r1().startsWith("1 marca tarjada"), contar(corpoHtml(c), 'class="sigiloSEI_tarja"')],
      [true, 1],
    );

    definirCorpo(c, "<p>sem marcas</p>");
    clicarId(d, "btnSigiloApply");
    checar(
      `sigilo ${v}: sem marcas nada muda, o rodape nao aparece e a aba mostra a orientacao`,
      corpoHtml(c) === "<p>sem marcas</p>" && r1().startsWith("Nenhuma marca de sigilo no documento!"),
    );

    // ---- Remover ----
    definirCorpo(
      c,
      `<p>x <span class="sigiloSEI">simples</span> <span class="sigiloSEI_tarja" data-text="Fulano &lt;b&gt;Silva&lt;/b&gt;">${BLOCOS}</span> <span class="sigiloSEI_tarja">${BLOCOS}</span></p><p class="sigiloSEI_sigilo_mark" contenteditable="false">#_contem_2_marcas_sigilo</p>`,
    );
    clicarId(d, "btnSigiloRemove");
    igualHtml(
      `sigilo ${v}: remover desfaz marcas simples e restaura o texto original das tarjas (a sem data-text fica), sem rodape se nao ha tarja`,
      corpoHtml(c),
      `<p>x simples Fulano <b>Silva</b> <span class="sigiloSEI_tarja">${BLOCOS}</span></p><p class="sigiloSEI_sigilo_mark" contenteditable="false" style="font-size: 6pt;color: #ccc;font-family: monospace;">#_contem_1_marcas_sigilo</p>`,
    );
    igual(`sigilo ${v}: mensagem de remocao (plural)`, txt(r3()), "2 marcas removidas com sucesso!");
    checar(
      `sigilo ${v}: o resultado das outras abas fica oculto e o da aba Tarjar e atualizado`,
      r2().hasAttribute("hidden") && r1().startsWith("Nenhuma marca de sigilo no documento!"),
    );

    definirCorpo(c, `<p><span class="sigiloSEI_tarja" data-text="a">${BLOCOS}</span></p>`);
    clicarId(d, "btnSigiloRemove");
    igual(`sigilo ${v}: remocao no singular e rodape ausente`, [txt(r3()), corpoHtml(c)], ["1 marca removida com sucesso!", "<p>a</p>"]);
    clicarId(d, "btnSigiloRemove");
    igual(`sigilo ${v}: sem marcas`, txt(r3()), "Nenhuma marca encontrada!");
    // data-text hostil e restaurado como conteudo inerte (nao executa; script nem entra)
    definirCorpo(c, `<p><span class="sigiloSEI_tarja" data-text="&lt;script&gt;alert(1)&lt;/script&gt;ok">${BLOCOS}</span></p>`);
    clicarId(d, "btnSigiloRemove");
    checar(
      `sigilo ${v}: data-text com marcacao volta como conteudo`,
      corpoHtml(c).includes("ok") && txt(r3()) === "1 marca removida com sucesso!",
    );
    checar(
      `sigilo ${v}: o aviso de irreversibilidade fica na aba Remover`,
      /não poderão ser revertidas após salvar/.test(txt(d.querySelector("#tabSigilo3_info"))),
    );

    // ---- acoes sem dialogo (monolito: certidao de sigilo, Documento Modelo) ----
    definirCorpo(c, '<p><span class="sigiloSEI">Sigiloso</span> publico</p>');
    const ed = adaptador.getInstance() as object;
    g.actionsMarkSigilo(null, "apply", false, false, ed);
    igualHtml(
      `sigilo ${v}: apply sem dialogo (this_ nulo, editor passado)`,
      corpoHtml(c),
      `<p><span class="sigiloSEI_tarja" data-text="Sigiloso">${BLOCOS}</span> publico</p><p class="sigiloSEI_sigilo_mark" contenteditable="false" style="font-size: 6pt;color: #ccc;font-family: monospace;">#_contem_1_marcas_sigilo</p>`,
    );
    definirCorpo(c, '<p><span class="sigiloSEI">Outro</span></p>');
    g.actionsMarkSigilo(undefined, "apply");
    checar(`sigilo ${v}: apply sem editor usa o da pagina`, corpoHtml(c).includes("sigiloSEI_tarja"));
    g.actionsMarkSigilo(null, "replace", "Outro", false, ed);
    g.actionsMarkSigilo(null, "email_cpf", false, false, ed);
    g.actionsMarkSigilo(null, "remove", false, false, ed);
    g.actionsMarkSigilo(null, "inexistente", false, false, ed);
    g.rodapeSigiloMark(ed);
    g.rodapeSigiloMark();
    g.htmlTabSigiloResult(null, ed);
    checar(`sigilo ${v}: modos sem dialogo e modo desconhecido nao quebram`, true);
    g.actionsMarkSigilo(null, "remove", false, false, ed);
    igual(`sigilo ${v}: remove sem dialogo restaura o texto e tira o rodape`, corpoHtml(c), "<p>Outro</p>");

    // rodape: contagem atual
    definirCorpo(
      c,
      `<p class="sigiloSEI_sigilo_mark">velho</p><p><span class="sigiloSEI_tarja">${BLOCOS}</span><span class="sigiloSEI_tarja">${BLOCOS}</span></p>`,
    );
    g.rodapeSigiloMark(ed);
    checar(
      `sigilo ${v}: rodape substitui o antigo pela contagem atual`,
      contar(corpoHtml(c), "sigiloSEI_sigilo_mark") === 1 &&
        corpoHtml(c).includes("#_contem_2_marcas_sigilo") &&
        !corpoHtml(c).includes("velho"),
    );

    d.closest("dialog")?.remove();
    c.doc.querySelector("dialog")?.remove();

    // ---- CK5: o editor descarta a marca ao reler o HTML ----
    if (c.versao === 5) {
      const f = c.ed as FalsoCk5;
      usarDocumento(c.doc);
      definirCorpo(c, "<p>Maria e Joao</p>");
      selecionarTexto(c, alvoP, "", "");
      g.getBoxSigilo(null);
      const e = dialogoAberto(c.doc) as HTMLElement;
      const inst = f.instancia();
      const setOriginal = inst.data.set;
      inst.data.set = (valor) => {
        setOriginal(valor); // o upcast nao reconhece o span: ele some ao reler
        for (const k of Object.keys(inst.dadosPorRaiz))
          inst.dadosPorRaiz[k] = (inst.dadosPorRaiz[k] ?? "").replace(/<span class="sigiloSEI">(.*?)<\/span>/g, "$1");
      };
      (e.querySelector("#inputSigiloTexto") as HTMLInputElement).value = "Maria";
      clicarId(e, "btnSigiloReplace");
      igual(
        `sigilo ${v}: se o editor nao mantem a marca, o dialogo nao anuncia sucesso`,
        txt(e.querySelector("#tabSigilo2_result")),
        "Texto encontrado, mas o editor não manteve a marca de sigilo.",
      );
      inst.data.set = setOriginal;
      // tarja: so conta o que virou span de tarja no model
      definirCorpo(c, '<p><span class="sigiloSEI">A</span> <span class="sigiloSEI">B</span></p>');
      const setPerdendo = inst.data.set;
      inst.data.set = (valor) => {
        setPerdendo(valor);
        // o model so mantem a primeira tarja: a segunda volta a ser texto
        let n = 0;
        for (const k of Object.keys(inst.dadosPorRaiz))
          inst.dadosPorRaiz[k] = (inst.dadosPorRaiz[k] ?? "").replace(/<span [^>]*sigiloSEI_tarja[^>]*>[^<]*<\/span>/g, (t) =>
            ++n === 2 ? "B" : t,
          );
      };
      clicarId(e, "btnSigiloApply");
      igual(
        `sigilo ${v}: a tarja so e anunciada para as marcas que o model manteve`,
        txt(e.querySelector("#tabSigilo1_result")).startsWith("1 marca tarjada com sucesso!"),
        true,
      );
      inst.data.set = setPerdendo;
      e.closest("dialog")?.remove();
    }
  });

  // ======== CK5: marca no model (GHS) ========
  secao("recurso sigilo: marca no model do CK5");
  {
    const caso = (): { f: FalsoCk5; g: Record<string, Fn>; el: Element } => {
      const f = criarCk5({ secoes: [{ raiz: "main", label: "Corpo do Texto", html: "<p>texto</p>", principal: true }] });
      usarDocumento(f.doc);
      (f.win as Qualquer).hasSelection = () => true;
      const g = sigilo.globais(ctxDe(f.win, f.doc)) as Record<string, Fn>;
      return { f, g, el: f.elemento("main").querySelector("p") as Element };
    };

    // cursor dentro de uma faixa marcada: remove a marca da faixa inteira (nos vizinhos com o mesmo valor)
    {
      const { f, g, el } = caso();
      const [a, b, x] = encadear(
        new NoTexto("A", { htmlSpan: { classes: ["sigiloSEI"] } }),
        new NoTexto("B", { htmlSpan: { classes: ["sigiloSEI"] } }),
        new NoTexto("C", {}),
      ) as [NoTexto, NoTexto, NoTexto];
      const reg = instalarModelo(f, { textNode: b }, true);
      f.selecionar({ elemento: el, texto: "", html: "" });
      g.getMarkSigilo(null);
      igual(
        "CK5: cursor numa marca remove o atributo da faixa inteira",
        [reg.remocoes, reg.atribuicoes],
        [[{ nome: "htmlSpan", alvo: { de: { antes: "A" }, ate: { depois: "B" } } }], []],
      );
      igual("CK5: desmarcar nao insere HTML", f.instancia().insercoes.length, 0);
      void a;
      void x;
    }
    // outras classes/atributos do span sao mantidos
    {
      const { f, g, el } = caso();
      const [a] = encadear(new NoTexto("A", { htmlSpan: { classes: ["sigiloSEI", "destaque"], attributes: { title: "t" } } })) as [NoTexto];
      const reg = instalarModelo(f, { textNode: a }, true);
      f.selecionar({ elemento: el, texto: "", html: "" });
      g.getMarkSigilo(null);
      igual("CK5: o span com outra classe so perde a do sigilo", reg.atribuicoes, [
        {
          nome: "htmlSpan",
          valor: { classes: ["destaque"], attributes: { title: "t" } },
          alvo: { de: { antes: "A" }, ate: { depois: "A" } },
        },
      ]);
    }
    // classes em Set e em texto; atributos sem classes restantes
    for (const [rotulo, classes] of [
      ["Set", new Set(["sigiloSEI"])],
      ["texto", "sigiloSEI"],
      ["objeto", { sigiloSEI: true }],
    ] as const) {
      const { f, g, el } = caso();
      const [a] = encadear(new NoTexto("A", { htmlSpan: { classes } })) as [NoTexto];
      const reg = instalarModelo(f, { textNode: a }, true);
      f.selecionar({ elemento: el, texto: "", html: "" });
      g.getMarkSigilo(null);
      igual(`CK5: classes do GHS em ${rotulo} tambem sao reconhecidas`, [reg.remocoes.length, reg.atribuicoes.length], [1, 0]);
    }
    // cursor encostado antes/depois da marca
    {
      const { f, g, el } = caso();
      const [a] = encadear(new NoTexto("A", { htmlSpan: { classes: ["sigiloSEI"] } })) as [NoTexto];
      const reg = instalarModelo(f, { nodeBefore: a }, true);
      f.selecionar({ elemento: el, texto: "", html: "" });
      g.getMarkSigilo(null);
      igual("CK5: cursor colado ao fim da marca (colapsado) desfaz", reg.remocoes.length, 1);
    }
    // trecho selecionado logo depois da marca nao e a marca: marca de novo
    {
      const { f, g, el } = caso();
      const [a] = encadear(new NoTexto("A", { htmlSpan: { classes: ["sigiloSEI"] } })) as [NoTexto];
      const reg = instalarModelo(f, { nodeBefore: a }, false);
      f.selecionar({ elemento: el, texto: "novo", html: "novo" });
      g.getMarkSigilo(null);
      igual(
        "CK5: selecao nao colapsada depois de uma marca marca o trecho novo",
        [reg.remocoes.length, ultimoInserido({ versao: 5, ed: f, doc: f.doc, win: f.win })],
        [0, '<span class="sigiloSEI">novo</span>'],
      );
    }
    // texto com htmlSpan sem a classe do sigilo nao e marca
    {
      const { f, g, el } = caso();
      const [a] = encadear(new NoTexto("A", { htmlSpan: { classes: ["outra"] } })) as [NoTexto];
      const reg = instalarModelo(f, { textNode: a }, true);
      f.selecionar({ elemento: el, texto: "x", html: "x" });
      g.getMarkSigilo(null);
      igual(
        "CK5: span de outra classe nao e tratado como marca",
        [reg.remocoes.length, reg.atribuicoes.length, f.instancia().insercoes.length],
        [0, 0, 1],
      );
    }
    // erro lendo o model: segue como se nao houvesse marca
    {
      const { f, g, el } = caso();
      let chamadas = 0;
      (f.instancia() as Qualquer).model.document.selection.getFirstPosition = () => {
        chamadas += 1;
        if (chamadas === 2) throw new Error("model indisponivel"); // a 1a leitura e a do adaptador (secao somente leitura)
        return { root: { rootName: "main" } };
      };
      f.selecionar({ elemento: el, texto: "x", html: "x" });
      g.getMarkSigilo(null);
      igual("CK5: falha ao ler o model cai no caminho de marcar", f.instancia().insercoes.length, 1);
    }
  }

  // ======== boot (iniciar) ========
  secao("recurso sigilo: iniciar");
  {
    const f4 = criarCk4({ secoes: [{ nome: "txaEditor_1", titulo: "Corpo", html: "<p>x</p>" }] });
    const regras: unknown[] = [];
    (f4.instancia("txaEditor_1") as Qualquer).dataProcessor = { htmlFilter: { addRules: (r: unknown) => regras.push(r) } };
    sigilo.iniciar?.(ctxDe(f4.win, f4.doc));
    sigilo.iniciar?.(ctxDe(f4.win, f4.doc));
    igual("iniciar CK4: registra o filtro de saida em cada secao (uma vez)", regras.length, 1);

    const f5 = criarCk5({ secoes: [{ raiz: "main", label: "Corpo do Texto", html: "<p>x</p>", principal: true }] });
    const escutas: unknown[] = [];
    (f5.instancia() as Qualquer).data.downcastDispatcher = { on: (e: string) => escutas.push(e) };
    sigilo.iniciar?.(ctxDe(f5.win, f5.doc));
    sigilo.iniciar?.(ctxDe(f5.win, f5.doc));
    igual("iniciar CK5: registra o conversor de saida (uma vez)", escutas, ["attribute"]);
  }

  // ======== sem editor ========
  secao("recurso sigilo: sem editor na pagina");
  {
    const { doc, win } = (await import("../falsos")).paginaFalsa();
    usarDocumento(doc);
    const g = sigilo.globais(ctxDe(win, doc)) as Record<string, Fn>;
    g.getMarkSigilo(null);
    g.getTarjaSigilo(null);
    g.getBoxSigilo(null);
    g.openDialogSigilo();
    g.actionsMarkSigilo(null, "apply");
    g.rodapeSigiloMark();
    g.htmlTabSigiloResult(doc.body);
    checar("sem editor nada abre nem quebra", !dialogoAberto(doc));
  }
}
