import { criarAdaptador } from "../src/adaptador";
import { criarBackendCk5 } from "../src/adaptador/ck5";
import { criarCk5 } from "./falsos";
import { checar, igual, secao } from "./util";

const SECOES = [
  { raiz: "cabecalho", label: "Cabeçalho", html: "<p>cab</p>", somenteLeitura: true },
  { raiz: "corpo", label: "Corpo do Texto", html: "<p id='p1'>um</p><p id='p2'>dois</p>", principal: true },
];

function novo() {
  const f = criarCk5({ secoes: SECOES });
  return { f, a: criarBackendCk5(f.win), ed: f.instancia() };
}

export async function verificarAdaptadorCk5(): Promise<void> {
  secao("adaptador CK5");

  {
    const { f, a, ed } = novo();
    checar("getInstance devolve a instancia pronta", a.getInstance() === ed);
    ed.state = "initializing";
    checar("getInstance ignora instancia que nao esta pronta", a.getInstance() === null);
    ed.state = "ready";
    checar("getBodyContainer devolve a editavel da raiz principal", a.getBodyContainer(ed) === f.elemento("corpo"));
    igual(
      "findInBody acha os paragrafos do corpo",
      a.findInBody(ed, "p").map((p) => p.id),
      ["p1", "p2"],
    );
    f.selecionar({ raiz: "corpo" });
    checar("somenteLeitura(false) com a selecao no corpo", a.somenteLeitura(ed) === false);
    f.selecionar({ raiz: "cabecalho" });
    checar("somenteLeitura(true) com a selecao numa raiz somente leitura", a.somenteLeitura(ed) === true);
  }

  {
    const { f, a, ed } = novo();
    f.selecionar({ raiz: "corpo", elemento: f.elemento("corpo").querySelector("#p2") });
    const p2 = f.elemento("corpo").querySelector("#p2") as Element;
    a.insertHtml(ed, "<b>x</b>");
    igual("insertHtml: uma unica chamada a model.change", ed.mudancas, 1);
    igual("insertHtml: insere o HTML na selecao", ed.insercoes[0]?.html, "<b>x</b>");
    a.insertHtmlBefore(ed, p2, '<div class="pageBreakPro"></div>');
    igual("insertHtmlBefore: mais uma unica chamada a model.change", ed.mudancas, 2);
    const pos = ed.insercoes[1]?.posicao as { antes: { elemento: Element } } | undefined;
    igual("insertHtmlBefore: insere antes do elemento do model", pos?.antes.elemento === p2, true);
    a.withEdit(ed, () => {
      a.insertHtml(ed, "<i>y</i>");
    });
    igual("withEdit: um unico passo (1 model.change externo + o aninhado)", ed.mudancas, 4);
    checar("withEdit foca a instancia", ed.focos === 1);
    a.appendToBody(ed, "<p>fim</p>");
    igual("appendToBody: insere no fim da raiz do corpo", ed.insercoes.at(-1)?.posicao, { em: "corpo", onde: "end" });
    a.insertText(ed, "t");
    igual("insertText insere o texto", ed.insercoes.at(-1)?.html, "texto:t");
  }

  {
    const { f, a, ed } = novo();
    f.selecionar({ raiz: "cabecalho", elemento: f.elemento("cabecalho").querySelector("p") });
    a.insertHtml(ed, "<b>x</b>");
    a.insertText(ed, "t");
    a.insertHtmlBefore(ed, f.elemento("cabecalho").querySelector("p") as Element, "<hr>");
    checar("raiz somente leitura: insercoes nao acontecem", ed.insercoes.length === 0 && ed.mudancas === 0);
  }

  {
    const { f, a, ed } = novo();
    const p1 = f.elemento("corpo").querySelector("#p1") as Element;
    f.selecionar({ raiz: "corpo", elemento: p1, texto: "um", html: "<b>um</b>" });
    checar("getSelectionElement", a.getSelectionElement(ed) === p1);
    checar("getSelectionParagraph", a.getSelectionParagraph(ed) === p1);
    igual("getSelectedText", a.getSelectedText(ed), "um");
    igual("getSelectedHtml", a.getSelectedHtml(ed), "<b>um</b>");
    f.selecionar({ raiz: "corpo", elemento: null, texto: "" });
    igual("sem selecao: getSelectedText vazio", a.getSelectedText(ed), "");
    checar("sem selecao: getSelectionParagraph null", a.getSelectionParagraph(ed) === null);
  }

  {
    const { a, ed } = novo();
    const m1 = a.saveSelection(ed);
    const m2 = a.saveSelection(ed);
    checar("saveSelection: marcadores com prefixo proprio spro-ed:", String(m1).startsWith("spro-ed:") && m1 !== m2);
    a.restoreSelection(ed, m1);
    checar("restoreSelection remove o marcador usado e deixa o outro", !ed.marcadores.has(String(m1)) && ed.marcadores.has(String(m2)));
    igual("restoreSelection volta o cursor ao marcador", ed.selecoesDefinidas.length, 1);
    a.execCommand(ed, "strike");
    a.execCommand(ed, "fontSize", 18);
    igual("execCommand traduz strike e passa o valor", ed.executados, [
      ["strikethrough", undefined],
      ["fontSize", { value: 18 }],
    ]);
    a.applyStyle(ed, { element: "strong" });
    a.applyStyle(ed, { element: "span", attributes: { style: "x" } });
    igual("applyStyle so mapeia elementos de formatacao conhecidos", ed.executados.slice(2), [["bold", undefined]]);
    igual("getData le a raiz do corpo", a.getData(ed), "<p id='p1'>um</p><p id='p2'>dois</p>");
    a.setData(ed, "<p>novo</p>");
    igual("setData grava so na raiz do corpo", [ed.dadosPorRaiz.corpo, ed.dadosPorRaiz.cabecalho], ["<p>novo</p>", "<p>cab</p>"]);
    a.transformBodyHtml(ed, (h) => h.replace("novo", "NOVO"));
    igual("transformBodyHtml reescreve a raiz do corpo", ed.dadosPorRaiz.corpo, "<p>NOVO</p>");
  }

  {
    const { f, a, ed } = novo();
    const corpo = f.elemento("corpo");
    const c1 = () => [{ label: "A", action: () => {} }];
    const c2 = () => [{ label: "B", action: () => {} }];
    a.addContextMenu(ed, c1);
    a.addContextMenu(ed, c2);
    a.addContextMenu(ed, c1);
    const reg = (corpo as unknown as { __seiProCtxBuilders: unknown[] }).__seiProCtxBuilders;
    igual("menu de contexto: os dois construtores no registro compartilhado, sem duplicar", reg, [c1, c2]);
  }

  {
    const f = criarCk5({ secoes: SECOES, montarLogo: false });
    const a = criarAdaptador(f.win);
    igual("antes de montar o CK5 a versao e indeterminada", a.versao, 0);
    f.win.CKEDITOR = { version: "45.1.0-infra" };
    igual("com CKEDITOR global mas sem DOM do CK5 continua 0", a.versao, 0);
    checar("getInstance sem editor devolve null", a.getInstance() === null);
    const mont = f.montar();
    igual("depois de montar, o mesmo adaptador responde 5", a.versao, 5);
    checar("e o getInstance acha a instancia", a.getInstance() === mont);
    checar("waitReady resolve com a instancia", (await a.waitReady(50)) === mont);

    const vazia = criarCk5({ secoes: SECOES, montarLogo: false });
    let rejeitou = false;
    await criarAdaptador(vazia.win)
      .waitReady(40)
      .catch(() => {
        rejeitou = true;
      });
    checar("waitReady rejeita na pagina sem editor", rejeitou);
  }
}
