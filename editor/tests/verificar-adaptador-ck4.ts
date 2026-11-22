import { criarBackendCk4 } from "../src/adaptador/ck4";
import { criarCk4, type FalsoCk4 } from "./falsos";
import { checar, igual, secao } from "./util";

const SECOES = [
  { nome: "txaEditor_1", titulo: "Cabeçalho", html: "<p>cab</p>", somenteLeitura: true },
  { nome: "txaEditor_2", titulo: "Título do Documento", html: "<p>tit</p>" },
  { nome: "txaEditor_3", titulo: "Processo e Interessado", html: "<p>proc</p>" },
  { nome: "txaEditor_4", titulo: "Corpo do Texto", html: "<p id='p1'>um</p><p id='p2'>dois</p>" },
];

function novo(): { f: FalsoCk4; a: ReturnType<typeof criarBackendCk4> } {
  const f = criarCk4({ secoes: SECOES });
  return { f, a: criarBackendCk4(f.win) };
}

export async function verificarAdaptadorCk4(): Promise<void> {
  secao("adaptador CK4");

  {
    const { f, a } = novo();
    const corpo = f.instancia("txaEditor_4");
    const dentro = f.doc.querySelector("#cke_txaEditor_4 .cke_toolbox") as Element;
    checar("getInstance(ref) acha a instancia pelo wrapper div.cke, nao pelo title", a.getInstance(dentro) === corpo);
    // barra compartilhada: o botao esta no wrapper do Cabecalho (somente leitura) e o cursor no Corpo
    const barraDoCabecalho = f.doc.querySelector("#cke_txaEditor_1 .cke_toolbox") as Element;
    f.focar("txaEditor_4");
    checar(
      "barra compartilhada: ref dentro do Cabecalho (RO) com o foco no Corpo devolve o Corpo",
      a.getInstance(barraDoCabecalho) === corpo,
    );
    f.focar(null);
    checar(
      "sem foco, ref dentro do Cabecalho (RO) cai na primeira editavel",
      a.getInstance(barraDoCabecalho) === f.instancia("txaEditor_2"),
    );
    checar("getInstance() sem foco devolve a primeira EDITAVEL, nao o Cabecalho", a.getInstance() === f.instancia("txaEditor_2"));
    f.focar("txaEditor_4");
    checar("getInstance() com foco devolve a instancia com foco", a.getInstance() === corpo);
    f.focar("txaEditor_1");
    checar(
      "foco numa secao somente leitura: devolve ELA (as escritas viram no-op), nunca outra secao",
      a.getInstance() === f.instancia("txaEditor_1"),
    );
    igual("getAllInstances lista as 4 secoes", a.getAllInstances().length, 4);
    checar("somenteLeitura(Cabecalho) e true", a.somenteLeitura(f.instancia("txaEditor_1")) === true);
    checar("somenteLeitura(Corpo) e false", a.somenteLeitura(corpo) === false);
    checar("getBodyContainer devolve o body da secao (nao null)", a.getBodyContainer(corpo) === corpo.corpo);
    igual(
      "findInBody acha os paragrafos do corpo",
      a.findInBody(corpo, "p").map((p) => p.id),
      ["p1", "p2"],
    );
    checar("getToolbarContainer acha span.cke_toolbox do wrapper", a.getToolbarContainer(corpo)?.className === "cke_toolbox");
  }

  {
    const { f, a } = novo();
    const corpo = f.instancia("txaEditor_4");
    let rodou = 0;
    a.withEdit(corpo, () => {
      rodou += 1;
      checar("withEdit: um snapshot antes de fn", corpo.snapshots === 1);
    });
    igual("withEdit chama fn uma vez", rodou, 1);
    igual(
      "withEdit trava os snapshots durante a acao (cada execCommand do CK4 faria o proprio: o Ctrl+Z desfaria so o ultimo)",
      corpo.eventosDisparados.filter((e) => /Snapshot/.test(e)),
      ["saveSnapshot", "lockSnapshot", "unlockSnapshot", "saveSnapshot"],
    );
    igual("withEdit: exatamente 2 snapshots ao redor de fn", corpo.snapshots, 2);
    checar("withEdit foca a instancia", corpo.focos === 1);
    let lancou = false;
    try {
      a.withEdit(corpo, () => {
        throw new Error("x");
      });
    } catch {
      lancou = true;
    }
    checar("withEdit: erro de fn sobe, mas o snapshot final sai", lancou && corpo.snapshots === 4);
  }

  {
    const { f, a } = novo();
    const corpo = f.instancia("txaEditor_4");
    const p2 = corpo.corpo.querySelector("#p2") as Element;
    a.insertHtmlBefore(corpo, p2, '<div class="pageBreakPro"></div>');
    checar("insertHtmlBefore poe o no imediatamente antes da referencia", p2.previousElementSibling?.className === "pageBreakPro");
    igual("insertHtmlBefore nao mexeu no resto", corpo.corpo.children.length, 3);
    a.appendToBody(corpo, "<p id='p3'>tres</p>");
    checar("appendToBody poe no fim do corpo", corpo.corpo.lastElementChild?.id === "p3");
    a.transformBodyHtml(corpo, (h) => h.replace("um", "UM"));
    checar("transformBodyHtml reescreve o corpo", (corpo.corpo.querySelector("#p1") as Element).textContent === "UM");
    a.transformBodyHtml(corpo, (h) => h);
    checar("transformBodyHtml sem mudanca nao reescreve", (corpo.corpo.querySelector("#p1") as Element).textContent === "UM");
    a.insertHtml(corpo, "<b>x</b>");
    igual("insertHtml delega ao editor", corpo.inseridos, ["<b>x</b>"]);
  }

  {
    const { f, a } = novo();
    const cab = f.instancia("txaEditor_1");
    const p = cab.corpo.querySelector("p") as Element;
    let lancou = false;
    try {
      a.insertHtml(cab, "<b>x</b>");
      a.insertText(cab, "t");
      a.insertHtmlBefore(cab, p, "<hr>");
      a.appendToBody(cab, "<hr>");
      a.transformBodyHtml(cab, () => "<p>outra</p>");
      a.setData(cab, "<p>outra</p>");
    } catch {
      lancou = true;
    }
    checar("secao somente leitura: operacoes de escrita nao lancam", !lancou);
    checar(
      "secao somente leitura: nada foi escrito",
      cab.inseridos.length === 0 && cab.textos.length === 0 && cab.getData() === "<p>cab</p>",
    );
  }

  {
    // escrita recusada em secao somente leitura avisa quem registrou (uma vez por tentativa); em secao editavel nao
    const { f, a } = novo();
    let recusas = 0;
    a.aoRecusarEscrita(() => {
      recusas += 1;
    });
    const cab = f.instancia("txaEditor_1");
    const corpo = f.instancia("txaEditor_4");
    a.insertHtml(cab, "<b>x</b>");
    a.insertText(cab, "t");
    a.appendToBody(cab, "<p>x</p>");
    a.insertHtmlBefore(cab, cab.corpo.querySelector("p") as Element, "<hr>");
    igual("CK4: cada escrita recusada em secao somente leitura chama aoRecusarEscrita", recusas, 4);
    a.insertHtml(corpo, "<b>y</b>");
    a.appendToBody(corpo, "<p>y</p>");
    igual("CK4: escrita em secao editavel nao chama o callback", recusas, 4);
  }

  {
    const { f, a } = novo();
    const corpo = f.instancia("txaEditor_4");
    const p1 = corpo.corpo.querySelector("#p1") as Element;
    f.selecionar("txaEditor_4", { elemento: p1, texto: "um", html: "<b>um</b>" });
    checar("getSelectionElement", a.getSelectionElement(corpo) === p1);
    checar("getSelectionParagraph acha o <p> do cursor", a.getSelectionParagraph(corpo) === p1);
    igual("getSelectedText", a.getSelectedText(corpo), "um");
    igual("getSelectedHtml", a.getSelectedHtml(corpo), "<b>um</b>");
    f.selecionar("txaEditor_4", {});
    igual("sem selecao: getSelectedText vazio", a.getSelectedText(corpo), "");
    igual("sem selecao: getSelectedHtml vazio", a.getSelectedHtml(corpo), "");
    checar("sem selecao: getSelectionParagraph e null", a.getSelectionParagraph(corpo) === null);
    const marcas = a.saveSelection(corpo);
    a.restoreSelection(corpo, marcas);
    igual("saveSelection/restoreSelection usam bookmarks", corpo.comandos, [["selectBookmarks", ["marca"]]]);
    a.applyStyle(corpo, { element: "span", attributes: { style: "font-size: 18px" } });
    igual("applyStyle monta um CKEDITOR.style com a definicao", (corpo.estilos[0] as { def: unknown }).def, {
      element: "span",
      attributes: { style: "font-size: 18px" },
    });
    a.insertElement(corpo, "<hr>");
    igual("insertElement cria o elemento do CKEDITOR e o insere", corpo.inseridos, ['el:{"html":"<hr>"}']);
  }

  {
    const { f, a } = novo();
    const corpo = f.instancia("txaEditor_4");
    const alvo = corpo.corpo.querySelector("#p1") as Element;
    const construtorA = () => [{ label: "Item A", action: () => {} }];
    const construtorB = () => [{ label: "Item B", action: () => {} }];
    a.addContextMenu(corpo, construtorA);
    a.addContextMenu(corpo, construtorB);
    a.addContextMenu(corpo, construtorA);
    igual("menu nativo: so um listener, dois construtores somados", corpo.ouvintesMenu.length, 1);
    igual("menu nativo: itens dos dois construtores", corpo.abrirMenu(alvo), ["seiPro_Item_A", "seiPro_Item_B"]);
    let acionou = 0;
    a.addContextMenu(corpo, () => [{ label: "Item C", action: () => (acionou += 1) }]);
    corpo.abrirMenu(alvo);
    corpo.comandosMenu.get("seiPro_Item_C")?.exec();
    igual("menu nativo: o comando chama a acao do item", acionou, 1);
  }

  {
    const { f, a } = novo();
    const pronto = await a.waitReady(50);
    checar("waitReady resolve com uma instancia pronta", !!pronto);
    f.win.CKEDITOR = { instances: {} };
    let rejeitou = false;
    await a.waitReady(30).catch(() => {
      rejeitou = true;
    });
    checar("waitReady rejeita no tempo limite", rejeitou);
  }
}
