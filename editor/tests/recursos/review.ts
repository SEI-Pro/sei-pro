import { criarAdaptador } from "../../src/adaptador";
import { htmlParaNos } from "../../src/adaptador/html";
import { aplicarRevisao, recurso as review } from "../../src/recursos/review";
import type { Contexto } from "../../src/recursos/tipos";
import { clicar, dialogoAberto, tique, usarDocumento } from "../dialogo";
import {
  type CasoEditor,
  criarCk4,
  criarCk5,
  type FalsoCk4,
  type FalsoCk5,
  nosDoisEditores,
  selecionarTexto,
  totalInseridos,
  ultimoInserido,
} from "../falsos";
import { checar, igual, secao } from "../util";

type Fn = (...a: unknown[]) => unknown;

const MARCA = (tipo: string, id: string, usuario: string, texto: string, extra = "") =>
  `<span data-review="${tipo}" class="reviewSeiPro" data-id-review="${id}" data-date-review="01/02/2025 10:00" data-user-review="${usuario}"${extra} style="background-color:#F0F8FF;"><${
    tipo === "add" ? "u" : "s"
  } style="color:#0000FF;">${texto}</${tipo === "add" ? "u" : "s"}></span>`;

const DOC =
  `<p id="p1">antes ${MARCA("add", "A1", "ana", "novo")} e ${MARCA("delete", "D1", "bia", "velho", ' data-comment="porque sim"')} fim</p>` +
  `<p id="p2">outro <span class="reviewSP">&nbsp;</span>${MARCA("add", "A2", "ana", "x")}</p>`;

const ctxDe = (c: { win: Window; doc: Document }, extra: Partial<Contexto> = {}): Contexto => ({
  adaptador: criarAdaptador(c.win),
  doc: c.doc,
  win: c.win,
  base: "",
  checkOpcao: () => true,
  verifyOpcao: () => false,
  ...extra,
});

const evento = (el: Element, tipo: string, extra: object = {}): Event => {
  const Ev = (el.ownerDocument.defaultView as unknown as { Event: typeof Event }).Event;
  const e = new Ev(tipo, { bubbles: true });
  Object.assign(e, extra);
  el.dispatchEvent(e);
  return e;
};
const clique = (el: Element) => evento(el, "click");

const corpoDe = (c: CasoEditor): HTMLElement =>
  c.versao === 4 ? (c.ed as FalsoCk4).instancia("txaEditor_1").corpo : (c.ed as FalsoCk5).elemento("main");

/** Poe o HTML no corpo (e, no CK5, nos dados do model, de onde o adaptador transforma). */
function montar(c: CasoEditor, html = DOC): HTMLElement {
  const corpo = corpoDe(c);
  corpo.replaceChildren(...htmlParaNos(corpo.ownerDocument, html));
  if (c.versao === 5) (c.ed as FalsoCk5).instancia().dadosPorRaiz.main = html;
  return corpo;
}
/** O documento depois das acoes: o DOM no CK4, os dados gravados no CK5 (o falso nao reflete `data.set` no DOM). */
const htmlAtual = (c: CasoEditor): string =>
  c.versao === 4 ? corpoDe(c).innerHTML : ((c.ed as FalsoCk5).instancia().dadosPorRaiz.main ?? "");

const baloes = (c: { doc: Document }) => [...c.doc.querySelectorAll("body > .reviewDisplayPro")];
const marca = (c: CasoEditor, id: string) =>
  [...corpoDe(c).querySelectorAll("span.reviewSeiPro")].find((m) => m.getAttribute("data-id-review") === id) as HTMLElement;
const acaoDo = (balao: Element, modo: string) => balao.querySelector(`.action[data-mode="${modo}"]`) as HTMLElement;

/** Interpreta o HTML inserido (o linkedom serializa os atributos em outra ordem, entao confere-se por DOM). */
function lerMarca(c: { doc: Document }, html: string | null) {
  const raiz = c.doc.createElement("div");
  raiz.append(...htmlParaNos(c.doc, html ?? ""));
  const m = raiz.querySelector(".reviewSeiPro") as HTMLElement | null;
  return { raiz, m, interno: m?.firstElementChild ?? null, attr: (n: string) => m?.getAttribute(n) ?? null };
}
const idsDoDocumento = (c: CasoEditor): string[] => {
  const raiz = c.doc.createElement("div");
  raiz.append(...htmlParaNos(c.doc, htmlAtual(c)));
  return [...raiz.querySelectorAll("span[data-id-review]")].map((m) => m.getAttribute("data-id-review") ?? "");
};

function usuario(c: { win: Window }, nome: string | false): void {
  (c.win as unknown as Record<string, unknown>).getOptionsPro = (k: string) => (k === "usuarioSistema" ? nome : false);
}

export async function verificarReview(): Promise<void> {
  secao("recurso review");

  // ---------- funcoes puras ----------
  {
    const p = (html: string) => {
      const d = new (
        criarCk5({ secoes: [{ raiz: "main", label: "x", html: "", principal: true }] }).win as unknown as { DOMParser: typeof DOMParser }
      ).DOMParser();
      return d.parseFromString(`<!doctype html><html><body>${html}</body></html>`, "text/html").body;
    };
    const roda = (modo: string, id?: string, tipo?: string) => {
      const corpo = p(DOC);
      aplicarRevisao(corpo, { mode: modo, idReview: id, type: tipo });
      return corpo.innerHTML;
    };
    const aceitarAdd = roda("accept", "A1", "add");
    checar(
      "review: aceitar insercao mantem o texto e tira a marca",
      aceitarAdd.includes("antes novo e") && !aceitarAdd.includes('data-id-review="A1"') && aceitarAdd.includes('data-id-review="D1"'),
      aceitarAdd,
    );
    const rejeitarAdd = roda("reject", "A1", "add");
    checar("review: rejeitar insercao apaga texto e marca", !rejeitarAdd.includes("novo") && rejeitarAdd.includes("antes  e"), rejeitarAdd);
    const aceitarDel = roda("accept", "D1", "delete");
    checar("review: aceitar exclusao apaga o texto", !aceitarDel.includes("velho") && aceitarDel.includes("e  fim"), aceitarDel);
    const rejeitarDel = roda("reject", "D1", "delete");
    checar(
      "review: rejeitar exclusao devolve o texto, sem marca",
      rejeitarDel.includes("e velho fim") && !rejeitarDel.includes('data-id-review="D1"'),
      rejeitarDel,
    );
    checar(
      "review: o espaco-marcador sai junto com a insercao (aceitar ou rejeitar)",
      !roda("accept", "A2", "add").includes("reviewSP") && !roda("reject", "A2", "add").includes("reviewSP"),
    );
    checar("review: o espaco-marcador de uma exclusao fica (como no legado)", roda("accept", "D1", "delete").includes("reviewSP"));
    const todas = roda("acceptAll");
    checar(
      "review: aceitar todas",
      !todas.includes("reviewSeiPro") && !todas.includes("reviewSP") && todas.includes("antes novo e") && !todas.includes("velho"),
      todas,
    );
    const rej = roda("rejectAll");
    checar(
      "review: rejeitar todas",
      !rej.includes("reviewSeiPro") && !rej.includes("reviewSP") && !rej.includes("novo") && rej.includes("e velho fim"),
      rej,
    );
    igual(
      "review: id inexistente e modo desconhecido nao mexem em nada",
      [roda("accept", "ZZ", "add"), roda("bla", "A1", "add")],
      [p(DOC).innerHTML, p(DOC).innerHTML],
    );
    igual(
      "review: id hostil (aspas/colchetes) nao quebra nem acerta marca nenhuma",
      roda("accept", 'A1"] , span[x', "add"),
      p(DOC).innerHTML,
    );
    const comBalao = p(`<p>a <span class="reviewDisplayPro">balao</span>b</p>`);
    aplicarRevisao(comBalao, { mode: "acceptAll" });
    checar("review: a acao limpa baloes que ficaram dentro do documento (legado)", !comBalao.innerHTML.includes("reviewDisplayPro"));
    const tipoDaMarca = p(MARCA("delete", "T1", "bia", "z"));
    aplicarRevisao(tipoDaMarca, { mode: "accept", idReview: "T1", type: "add" });
    checar("review: vale o data-review da marca, nao o tipo informado", tipoDaMarca.innerHTML === "", tipoDaMarca.innerHTML);
  }

  // ---------- contrato e insercao de marcas ----------
  await nosDoisEditores("review", async (c: CasoEditor) => {
    usarDocumento(c.doc);
    const v = `[CK${c.versao}]`;
    usuario(c, "ana");
    const g = review.globais(ctxDe(c)) as Record<string, Fn>;
    igual(`review ${v}: id do recurso`, review.id, "review");
    igual(`review ${v}: globais do contrato`, Object.keys(g).sort(), [
      "addCommentReviewPro",
      "contentDialogReview",
      "getBoxCtrReview",
      "getBoxReview",
      "getDialogReview",
      "getHtmlReviewDisplayPro",
      "getStyleReview",
      "hideReviewTips",
      "initStyleReview",
      "removeReviewPro",
      "scroolToReview",
      "setRemoveReviewPro",
      "setStyleReview",
      "showReviewTips",
    ]);
    montar(c);

    // marca de insercao
    g.setStyleReview("add", "insert", "texto");
    const add = ultimoInserido(c) ?? "";
    const ma = lerMarca(c, add);
    checar(
      `review ${v}: setStyleReview add monta a marca com u azul e os atributos`,
      ma.raiz.childNodes.length === 1 &&
        ma.attr("data-review") === "add" &&
        ma.attr("class") === "reviewSeiPro" &&
        /^[0-9a-zA-Z]{8}$/.test(ma.attr("data-id-review") ?? "") &&
        /^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}$/.test(ma.attr("data-date-review") ?? "") &&
        ma.attr("data-user-review") === "ana" &&
        ma.attr("style") === "background-color:#F0F8FF;" &&
        ma.interno?.tagName === "U" &&
        ma.interno.getAttribute("style") === "color:#0000FF;" &&
        ma.interno.textContent === "texto",
      add,
    );
    g.setStyleReview("delete", "insert", "velho", true);
    const del = ultimoInserido(c) ?? "";
    const md = lerMarca(c, del);
    checar(
      `review ${v}: delete usa s vermelho e, com addSp, o espaco-marcador e um espaco comum depois`,
      md.attr("data-review") === "delete" &&
        md.attr("style") === "background-color:#FFF0F5;" &&
        md.interno?.tagName === "S" &&
        md.interno.getAttribute("style") === "color:#FF0000;" &&
        /<\/span><span class="reviewSP">(&nbsp;|&#160;|\u00a0)<\/span> $/.test(del),
      del,
    );
    g.setStyleReview("add", "insert", "t", true, "Texto_Justificado");
    const comP = ultimoInserido(c) ?? "";
    checar(
      `review ${v}: com pClass envolve no paragrafo e nao poe espaco-marcador (legado)`,
      comP.startsWith('<p class="Texto_Justificado"><span ') &&
        comP.endsWith("</span></p> ") &&
        !comP.includes("reviewSP") &&
        lerMarca(c, comP).attr("data-review") === "add",
      comP,
    );
    g.setStyleReview();
    checar(
      `review ${v}: sem argumentos e uma insercao add vazia`,
      /<u style="color:#0000FF;"><\/u>/.test(ultimoInserido(c) ?? ""),
      ultimoInserido(c),
    );
    g.setStyleReview("add", "insert", " ");
    checar(
      `review ${v}: texto de um espaco entra como esta (como no legado)`,
      lerMarca(c, ultimoInserido(c)).interno?.textContent === " ",
      ultimoInserido(c),
    );

    // texto, usuario e classe hostis nunca viram marcacao
    usuario(c, `"><img src=x onerror=alert(1)>`);
    g.setStyleReview("add", "insert", "<img src=x onerror=alert(2)><script>1</script>", false, `x"><img src=y>`);
    const hostil = c.doc.createElement("div");
    hostil.append(...htmlParaNos(c.doc, ultimoInserido(c) ?? ""));
    checar(
      `review ${v}: entradas hostis ficam como texto/atributo`,
      hostil.querySelectorAll("img, script").length === 0 &&
        hostil.querySelector(".reviewSeiPro")?.getAttribute("data-user-review") === `"><img src=x onerror=alert(1)>` &&
        (hostil.querySelector("u")?.textContent ?? "").includes("<script>"),
      ultimoInserido(c),
    );
    usuario(c, false);
    g.setStyleReview("add", "insert", "q");
    checar(
      `review ${v}: sem usuario do sistema o atributo fica vazio`,
      (ultimoInserido(c) ?? "").includes('data-user-review=""'),
      ultimoInserido(c),
    );
    usuario(c, "ana");

    // uma acao = um passo de desfazer
    if (c.versao === 4) {
      const ed = (c.ed as FalsoCk4).instancia("txaEditor_1");
      const antes = ed.snapshots;
      g.setStyleReview("add", "insert", "u");
      igual(`review ${v}: a insercao e um unico passo (2 snapshots)`, ed.snapshots - antes, 2);
    } else {
      const ed = (c.ed as FalsoCk5).instancia();
      const antes = ed.mudancas;
      g.setStyleReview("add", "insert", "u");
      checar(`review ${v}: a insercao roda dentro de um model.change`, ed.mudancas - antes >= 1);
    }

    // modo change
    const antesIns = totalInseridos(c);
    if (c.versao === 4) {
      const ed = (c.ed as FalsoCk4).instancia("txaEditor_1");
      g.setStyleReview("add", "change");
      const defs = ed.estilos.map((e) => (e as { def: { element: string; attributes: Record<string, string> } }).def);
      igual(
        `review ${v}: change aplica dois estilos (span de fundo e u de cor)`,
        defs.map((d) => d.element),
        ["span", "u"],
      );
      checar(
        `review ${v}: os dois estilos levam os mesmos atributos de revisao`,
        defs[0]?.attributes["data-id-review"] === defs[1]?.attributes["data-id-review"] &&
          defs[0]?.attributes.class === "reviewSeiPro" &&
          defs[0]?.attributes["data-user-review"] === "ana" &&
          defs[0]?.attributes.style === "background-color: #F0F8FF" &&
          defs[1]?.attributes.style === "color:#0000FF",
        defs,
      );
      g.setStyleReview("delete", "change");
      const defsDel = ed.estilos.slice(2).map((e) => (e as { def: { element: string } }).def.element);
      igual(`review ${v}: change de exclusao usa span e s`, defsDel, ["span", "s"]);
      igual(`review ${v}: change nao insere HTML`, totalInseridos(c), antesIns);
    } else {
      g.setStyleReview("add", "change");
      const sem = lerMarca(c, ultimoInserido(c));
      checar(
        `review ${v}: change sem selecao insere a marca com um u vazio`,
        sem.attr("data-review") === "add" && sem.interno?.tagName === "U" && sem.interno.textContent === "",
        ultimoInserido(c),
      );
      selecionarTexto(c, corpoDe(c).querySelector("p") as Element, "abc", "<b>abc</b> d");
      g.setStyleReview("delete", "change");
      const com = lerMarca(c, ultimoInserido(c));
      checar(
        `review ${v}: change com selecao envolve o trecho selecionado`,
        com.attr("data-review") === "delete" && com.attr("style") === "background-color:#FFF0F5;" && com.m?.innerHTML === "<b>abc</b> d",
        ultimoInserido(c),
      );
    }
  });

  // ---------- balao, aceitar/rejeitar por ele e comentario ----------
  await nosDoisEditores("review balao", async (c: CasoEditor) => {
    usarDocumento(c.doc);
    const v = `[CK${c.versao}]`;
    usuario(c, "ana");
    const g = review.globais(ctxDe(c)) as Record<string, Fn>;
    const corpo = montar(c);

    g.showReviewTips(marca(c, "A1"));
    const b = baloes(c)[0] as HTMLElement;
    checar(
      `review ${v}: o balao fica na pagina do editor, nunca dentro do documento`,
      baloes(c).length === 1 && !corpo.querySelector(".reviewDisplayPro"),
    );
    checar(`review ${v}: o documento nao recebe nada ao abrir o balao`, !corpo.innerHTML.includes("reviewDisplayPro"));
    igual(
      `review ${v}: o balao mostra autor, data, Aceitar e Rejeitar`,
      [
        b.querySelector(".title-reviewtip")?.textContent,
        (b.textContent ?? "").includes("01/02/2025 10:00"),
        b.querySelectorAll(".action").length,
        acaoDo(b, "accept")?.getAttribute("data-id-review"),
        acaoDo(b, "reject")?.getAttribute("data-type"),
      ],
      ["ana", true, 2, "A1", "add"],
    );
    checar(
      `review ${v}: o autor da marca ve o comentario editavel ("Adicionar comentario")`,
      b.querySelector("[data-info='new'] .commentReview")?.textContent === "Adicionar comentário",
    );
    checar(`review ${v}: o balao nao usa data-spro-click (os botoes tem ouvintes)`, !b.querySelector("[data-spro-click]"));

    // clicar dentro da marca (no u) tambem abre; clicar fora nao
    g.showReviewTips(marca(c, "A1").querySelector("u"));
    igual(`review ${v}: o alvo pode ser um filho da marca e o balao nao se repete`, baloes(c).length, 1);
    g.showReviewTips(corpo.querySelector("#p1"));
    igual(`review ${v}: alvo que nao e marca fecha o balao e nao abre outro`, baloes(c).length, 0);
    g.showReviewTips(null);
    igual(`review ${v}: alvo nulo nao quebra`, baloes(c).length, 0);

    // marca de outro autor, com comentario: so le
    g.showReviewTips(marca(c, "D1"));
    const bd = baloes(c)[0] as HTMLElement;
    checar(
      `review ${v}: marca de outro autor mostra o comentario sem editar`,
      !bd.querySelector("[data-info]") && (bd.querySelector(".commentReview")?.textContent ?? "") === "porque sim",
    );
    g.hideReviewTips();
    igual(`review ${v}: hideReviewTips remove o balao`, baloes(c).length, 0);
    g.hideReviewTips();

    // outro autor, sem comentario: nada de bloco de comentario
    montar(c, DOC.replace('data-comment="porque sim"', ""));
    g.showReviewTips(marca(c, "D1"));
    checar(
      `review ${v}: outro autor sem comentario nao mostra bloco de comentario`,
      !(baloes(c)[0] as HTMLElement).querySelector(".commentReview"),
    );
    g.hideReviewTips();
    montar(c);

    // dados hostis nas marcas ficam como texto
    montar(c, `<p>${MARCA("add", "H1", `<img src=x onerror=alert(1)>`, "t", ` data-comment="&lt;script&gt;alert(2)&lt;/script&gt;"`)}</p>`);
    g.showReviewTips(marca(c, "H1"));
    const bh = baloes(c)[0] as HTMLElement;
    checar(
      `review ${v}: usuario e comentario hostis nao viram marcacao`,
      bh.querySelectorAll("img, script").length === 0 &&
        (bh.textContent ?? "").includes("<img src=x onerror=alert(1)>") &&
        (bh.textContent ?? "").includes("<script>"),
      bh.textContent,
    );
    g.hideReviewTips();
    montar(c);

    // aceitar pelo botao do balao
    g.showReviewTips(marca(c, "A1"));
    clique(acaoDo(baloes(c)[0] as Element, "accept"));
    checar(
      `review ${v}: Aceitar uma insercao mantem o texto e fecha o balao`,
      htmlAtual(c).includes("antes novo e") && !htmlAtual(c).includes('data-id-review="A1"') && baloes(c).length === 0,
      htmlAtual(c),
    );
    if (c.versao === 4) {
      const ed = (c.ed as FalsoCk4).instancia("txaEditor_1");
      checar(`review ${v}: e e um passo de desfazer (snapshots)`, ed.snapshots >= 2);
    }
    montar(c);
    g.showReviewTips(marca(c, "A1"));
    clique(acaoDo(baloes(c)[0] as Element, "reject"));
    checar(
      `review ${v}: Rejeitar uma insercao apaga o texto`,
      !htmlAtual(c).includes("novo") && htmlAtual(c).includes('data-id-review="D1"'),
      htmlAtual(c),
    );
    montar(c);
    g.showReviewTips(marca(c, "D1"));
    clique(acaoDo(baloes(c)[0] as Element, "accept"));
    checar(`review ${v}: Aceitar uma exclusao apaga o texto`, !htmlAtual(c).includes("velho"), htmlAtual(c));
    montar(c);
    g.showReviewTips(marca(c, "D1"));
    clique(acaoDo(baloes(c)[0] as Element, "reject"));
    checar(`review ${v}: Rejeitar uma exclusao devolve o texto`, htmlAtual(c).includes("e velho fim"), htmlAtual(c));

    // teclado (role=button): Enter no botao do balao
    montar(c);
    g.showReviewTips(marca(c, "A1"));
    evento(acaoDo(baloes(c)[0] as Element, "accept"), "keydown", { key: "Enter" });
    checar(`review ${v}: Enter no botao do balao aceita`, !htmlAtual(c).includes('data-id-review="A1"'));

    // balao ao clicar (o despachante global): getHtmlReviewDisplayPro + removeReviewPro
    montar(c);
    const html = g.getHtmlReviewDisplayPro({ date: "d", id_review: "A1", type: "add", user: "ana", comment: "" }) as string;
    const raiz = c.doc.createElement("div");
    raiz.append(...htmlParaNos(c.doc, html));
    const aceitar = raiz.querySelector('[data-mode="accept"]') as HTMLElement;
    igual(
      `review ${v}: o HTML do cartao leva as acoes do despachante (parent.removeReviewPro/addCommentReviewPro)`,
      [aceitar.getAttribute("data-spro-click"), raiz.querySelector("[data-info]")?.getAttribute("data-spro-click")],
      ["parent.removeReviewPro", "parent.addCommentReviewPro"],
    );
    g.removeReviewPro(aceitar);
    checar(
      `review ${v}: removeReviewPro(elemento) aceita pelo data-* do botao`,
      !htmlAtual(c).includes('data-id-review="A1"') && htmlAtual(c).includes("antes novo e"),
      htmlAtual(c),
    );
    montar(c);
    const rej = raiz.querySelector('[data-mode="reject"]') as HTMLElement;
    g.removeReviewPro(rej);
    checar(`review ${v}: removeReviewPro(elemento) rejeita`, !htmlAtual(c).includes("novo"), htmlAtual(c));

    // o cartao com texto no cabecalho e o texto rolavel
    const cab = g.getHtmlReviewDisplayPro(
      { date: "d", id_review: "9", type: "delete", user: "u", comment: "", text: "riscado", html: "<b>trecho</b><img src=x onerror=1>" },
      true,
    ) as string;
    const rc = c.doc.createElement("div");
    rc.append(...htmlParaNos(c.doc, cab));
    checar(
      `review ${v}: cartao readonly traz o texto da marca, o trecho rolavel e "Nenhum comentario"`,
      rc.querySelector("s")?.textContent === "riscado" &&
        rc.querySelector(".textReview")?.getAttribute("data-spro-click") === "scroolToReview" &&
        rc.querySelector(".textReview")?.getAttribute("data-spro-args") === '["9"]' &&
        (rc.querySelector(".commentReview")?.textContent ?? "") === "Nenhum comentário" &&
        !rc.querySelector("[data-info]"),
      cab,
    );

    // comentario
    montar(c);
    g.showReviewTips(marca(c, "A1"));
    const bc = baloes(c)[0] as HTMLElement;
    const alvo = bc.querySelector("[data-info]") as HTMLElement;
    const info = alvo.querySelector(".commentReview") as HTMLElement;
    clique(alvo);
    igual(
      `review ${v}: clicar no comentario o torna editavel e limpa o texto de convite`,
      [info.getAttribute("contenteditable"), info.textContent],
      ["true", ""],
    );
    info.textContent = "  corrigir\nisto  ";
    evento(info, "keydown", { key: "x" });
    await tique(130);
    igual(
      `review ${v}: digitar grava o comentario na marca (uma linha) e atualiza a data`,
      [
        marca(c, "A1").getAttribute("data-comment"),
        alvo.getAttribute("data-info"),
        marca(c, "A1").getAttribute("data-date-review") !== "01/02/2025 10:00",
      ],
      ["corrigir isto", "update", true],
    );
    checar(
      `review ${v}: a data nova segue DD/MM/AAAA HH:mm`,
      /^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}$/.test(marca(c, "A1").getAttribute("data-date-review") ?? ""),
    );
    clique(alvo);
    info.textContent = "";
    evento(info, "keydown", { key: "Backspace" });
    await tique(130);
    igual(
      `review ${v}: esvaziar apaga o data-comment e volta a "new"`,
      [marca(c, "A1").hasAttribute("data-comment"), alvo.getAttribute("data-info")],
      [false, "new"],
    );
    info.textContent = "final";
    evento(info, "keydown", { key: "f" });
    await tique(130);
    evento(info, "blur");
    if (c.versao === 5) {
      checar(
        `review ${v}: no CK5 o comentario e gravado no model ao sair do campo`,
        /data-id-review="A1"[^>]*data-comment="final"|data-comment="final"[^>]*data-id-review="A1"/.test(htmlAtual(c)),
        htmlAtual(c),
      );
    } else {
      checar(`review ${v}: no CK4 o comentario fica no DOM do documento`, marca(c, "A1").getAttribute("data-comment") === "final");
    }
    g.addCommentReviewPro(alvo);
    igual(`review ${v}: o ouvinte do campo nao se duplica`, info.getAttribute("data-spro-edicao"), "sim");

    // somente leitura: nem editar o comentario
    if (c.versao === 4) {
      const ed = (c.ed as FalsoCk4).instancia("txaEditor_1");
      ed.readOnly = true;
      let recusas = 0;
      const ctx = ctxDe(c);
      ctx.adaptador.aoRecusarEscrita(() => {
        recusas += 1;
      });
      const g2 = review.globais(ctx) as Record<string, Fn>;
      g2.showReviewTips(marca(c, "A1"));
      const al = (baloes(c).at(-1) as HTMLElement).querySelector("[data-info]") as HTMLElement;
      clique(al);
      checar(
        `review ${v}: secao somente leitura nao deixa editar o comentario`,
        al.querySelector(".commentReview")?.getAttribute("contenteditable") !== "true" && recusas === 1,
      );
      ed.readOnly = false;
    }
  });

  // ---------- aceitar/rejeitar em lote, somente leitura e rolagem ----------
  await nosDoisEditores("review lote", async (c: CasoEditor) => {
    usarDocumento(c.doc);
    const v = `[CK${c.versao}]`;
    usuario(c, "ana");
    const g = review.globais(ctxDe(c)) as Record<string, Fn>;
    montar(c);
    const botaoLote = (modo: string) => {
      const b = c.doc.createElement("span");
      b.setAttribute("data-mode", modo);
      return b;
    };
    g.removeReviewPro(botaoLote("acceptAll"));
    checar(
      `review ${v}: removeReviewPro acceptAll aplica em todas as marcas`,
      !htmlAtual(c).includes("reviewSeiPro") && htmlAtual(c).includes("antes novo e") && !htmlAtual(c).includes("velho"),
      htmlAtual(c),
    );
    montar(c);
    g.setRemoveReviewPro(null, undefined, { mode: "rejectAll" });
    checar(
      `review ${v}: setRemoveReviewPro rejectAll`,
      !htmlAtual(c).includes("reviewSeiPro") && !htmlAtual(c).includes("novo") && htmlAtual(c).includes("e velho fim"),
      htmlAtual(c),
    );
    montar(c);
    const antes = idsDoDocumento(c);
    g.setRemoveReviewPro(null, undefined, { mode: "accept", idReview: "ZZ", type: "add" });
    igual(`review ${v}: id inexistente nao altera o documento`, idsDoDocumento(c), antes);

    // rolagem
    const corpo = montar(c);
    const rolagens: unknown[] = [];
    const p1 = corpo.querySelector("#p1") as HTMLElement;
    if (c.versao === 4) {
      const cont = c.doc.createElement("div");
      cont.id = "divEditores";
      (cont as unknown as { scrollTo: (o: unknown) => void }).scrollTo = (o) => rolagens.push(o);
      c.doc.body.append(cont);
      (p1 as unknown as { getBoundingClientRect: () => { top: number } }).getBoundingClientRect = () => ({ top: 50 });
      g.scroolToReview("A1");
      igual(`review ${v}: rola o #divEditores ate o paragrafo da marca (+200)`, rolagens, [{ top: 250, behavior: "smooth" }]);
      cont.remove();
      (marca(c, "A1") as unknown as { scrollIntoView: (o: unknown) => void }).scrollIntoView = (o) => rolagens.push(["sem container", o]);
      g.scroolToReview("A1");
      checar(`review ${v}: sem #divEditores usa scrollIntoView`, rolagens.length === 2);
    } else {
      (marca(c, "A2") as unknown as { scrollIntoView: (o: unknown) => void }).scrollIntoView = (o) => rolagens.push(o);
      g.scroolToReview("A2");
      igual(`review ${v}: rola ate a marca (scrollIntoView suave, centralizado)`, rolagens, [{ behavior: "smooth", block: "center" }]);
    }
    g.scroolToReview("ZZ");
    g.scroolToReview(undefined);
    checar(`review ${v}: id inexistente nao quebra`, true);
  });

  // ---------- somente leitura ----------
  {
    const lerHtml = (f: FalsoCk4 | FalsoCk5) =>
      f.versao === 4 ? f.instancia("txaEditor_1").corpo.innerHTML : f.instancia().dadosPorRaiz.main;
    const f4 = criarCk4({ secoes: [{ nome: "txaEditor_1", titulo: "Corpo do Texto", html: DOC, somenteLeitura: true }] });
    const f5 = criarCk5({ secoes: [{ raiz: "main", label: "Corpo do Texto", html: DOC, somenteLeitura: true, principal: true }] });
    for (const f of [f4, f5]) {
      usarDocumento(f.doc);
      const v = `[CK${f.versao}]`;
      if (f.versao === 5) f.instancia().dadosPorRaiz.main = DOC;
      let recusas = 0;
      const ctx = ctxDe(f);
      ctx.adaptador.aoRecusarEscrita(() => {
        recusas += 1;
      });
      usuario(f, "ana");
      const g = review.globais(ctx) as Record<string, Fn>;
      const antes = lerHtml(f);
      g.setRemoveReviewPro(null, undefined, { mode: "acceptAll" });
      g.setStyleReview("add", "insert", "x");
      checar(
        `review ${v}: secao somente leitura recusa aceitar e inserir marca (avisa a recusa)`,
        lerHtml(f) === antes &&
          recusas === 2 &&
          (f.versao === 4 ? f.instancia("txaEditor_1").inseridos.length === 0 : f.instancia().insercoes.length === 0),
        { recusas },
      );
    }
  }

  // ---------- liga/desliga e rastreio ao digitar ----------
  await nosDoisEditores("review rastreio", async (c: CasoEditor) => {
    usarDocumento(c.doc);
    const v = `[CK${c.versao}]`;
    usuario(c, "ana");
    const g = review.globais(ctxDe(c)) as Record<string, Fn>;
    const corpo = montar(c, `<p id="p">um dois tres</p>`);
    const botao = c.doc.createElement("a");
    botao.setAttribute("class", "getReviewButton cke_iconPro cke_button cke_button_off");
    c.doc.body.append(botao);
    const p = corpo.querySelector("#p") as Element;
    const ligado = () => botao.classList.contains("cke_button_on");

    g.getBoxReview(botao);
    igual(
      `review ${v}: 1o clique liga o modo (on, sem off)`,
      [ligado(), botao.classList.contains("cke_button_off"), botao.getAttribute("aria-pressed")],
      [true, false, "true"],
    );
    g.getBoxReview(botao);
    igual(
      `review ${v}: 2o clique desliga`,
      [ligado(), botao.classList.contains("cke_button_off"), botao.getAttribute("aria-pressed")],
      [false, true, "false"],
    );
    // o botao do CK5 nasce sem cke_button_on/off: o 1o clique tambem liga
    botao.setAttribute("class", "getReviewButton");
    g.getBoxReview(botao);
    checar(`review ${v}: botao sem classes de estado liga no 1o clique`, ligado());
    g.getBoxReview(botao);

    // idempotencia do ouvinte
    igual(`review ${v}: initStyleReview liga uma vez por editor`, [g.initStyleReview(botao), g.initStyleReview(botao)], [false, false]);

    const disparar = (key: string, keyCode: number, extra: object = {}) => {
      if (c.versao === 4) {
        (c.ed as FalsoCk4).instancia("txaEditor_1").fire("key", { data: { keyCode, domEvent: { $: { key, ...extra } } } });
      } else {
        evento(corpoDe(c), "keydown", { key, keyCode, ...extra });
      }
    };

    // modo desligado: nada
    selecionarTexto(c, p, "dois");
    disparar("a", 65);
    igual(`review ${v}: com o modo desligado digitar nao marca`, totalInseridos(c), 0);

    // ligado, texto selecionado: exclusao + insercao do caractere
    g.getBoxReview(botao);
    disparar("a", 65);
    const total = totalInseridos(c);
    const marcas =
      c.versao === 4 ? (c.ed as FalsoCk4).instancia("txaEditor_1").inseridos : (c.ed as FalsoCk5).instancia().insercoes.map((i) => i.html);
    igual(`review ${v}: selecao + tecla = marca de exclusao do trecho e de insercao do caractere`, total, 2);
    checar(
      `review ${v}: a exclusao leva o texto selecionado e o espaco-marcador; a insercao leva a tecla`,
      /data-review="delete"[^>]*><s[^>]*>dois<\/s><\/span><span class="reviewSP">/.test(marcas[0] ?? "") &&
        /data-review="add"[^>]*><u[^>]*>a<\/u>/.test(marcas[1] ?? ""),
      marcas,
    );
    disparar("Backspace", 8);
    const todos = () =>
      c.versao === 4 ? (c.ed as FalsoCk4).instancia("txaEditor_1").inseridos : (c.ed as FalsoCk5).instancia().insercoes.map((i) => i.html);
    checar(
      `review ${v}: Backspace com selecao exclui e insere um espaco comum (como no legado)`,
      totalInseridos(c) === 4 && lerMarca(c, todos().at(-1) ?? "").interno?.textContent === " ",
      todos().at(-1),
    );
    disparar("Delete", 46);
    igual(`review ${v}: Delete com selecao so exclui`, totalInseridos(c), 5);
    disparar("Enter", 13);
    igual(`review ${v}: Enter sobre a selecao so exclui (nao insere o nome da tecla)`, totalInseridos(c), 6);
    disparar(" ", 32);
    igual(`review ${v}: espaco sobre a selecao so exclui`, totalInseridos(c), 7);

    // teclas que nao digitam nada
    const n = totalInseridos(c);
    for (const [k, cod] of [
      ["Shift", 16],
      ["Control", 17],
      ["Meta", 91],
      ["Alt", 18],
      ["ArrowLeft", 37],
      ["CapsLock", 20],
      ["F5", 116],
    ] as const) {
      if (k === "F5") continue;
      disparar(k, cod);
    }
    disparar("c", 67, { ctrlKey: true });
    disparar("v", 86, { metaKey: true });
    igual(`review ${v}: modificadoras, setas e atalhos (Ctrl/Cmd+tecla) nao marcam`, totalInseridos(c), n);

    if (c.versao === 5) {
      // sem selecao o CK5 nao rastreia caractere a caractere: avisa uma unica vez
      selecionarTexto(c, p, "");
      disparar("b", 66);
      disparar("c", 67);
      const avisos = [...c.doc.querySelectorAll(".spro-aviso")].filter((a) => /rastreio autom/.test(a.textContent ?? ""));
      igual(`review ${v}: sem selecao avisa uma vez que o rastreio fino nao existe`, avisos.length, 1);
      igual(`review ${v}: e nao insere nada`, totalInseridos(c), n);
    } else {
      // o falso do CK4 nao tem a API crua de intervalos: cai no caminho do CK5 (sem selecao, avisa)
      selecionarTexto(c, p, "");
      disparar("b", 66);
      checar(
        `review ${v}: sem a API crua de intervalos cai no caminho simples e avisa`,
        [...c.doc.querySelectorAll(".spro-aviso")].some((a) => /rastreio autom/.test(a.textContent ?? "")),
      );
    }

    // getStyleReview global
    const t0 = totalInseridos(c);
    selecionarTexto(c, p, "tres");
    g.getStyleReview({ data: { keyCode: 90, domEvent: { $: { key: "z" } } } });
    igual(`review ${v}: getStyleReview(evt) aplica a regra`, totalInseridos(c), t0 + 2);
    g.getStyleReview();
    igual(`review ${v}: getStyleReview sem evento nao quebra nem insere`, totalInseridos(c), t0 + 2);
  });

  // ---------- rastreio com a API crua do CK4 ----------
  {
    const f = criarCk4({ secoes: [{ nome: "txaEditor_1", titulo: "Corpo do Texto", html: "<p id='p'>abc</p>" }] });
    usarDocumento(f.doc);
    usuario(f, "ana");
    const ed = f.instancia("txaEditor_1");
    const corpo = ed.corpo;
    const p = corpo.querySelector("#p") as HTMLElement;
    const noTexto = { type: 3, getText: () => "abcdef" };
    const novoIntervalo = () => ({
      startContainer: noTexto,
      startOffset: 0,
      endContainer: noTexto,
      endOffset: 0,
      setStart(no: typeof noTexto, o: number) {
        this.startContainer = no;
        this.startOffset = o;
      },
      setEnd(no: typeof noTexto, o: number) {
        this.endContainer = no;
        this.endOffset = o;
      },
      collapse() {},
      setStartAt() {},
    });
    const aposicionar = (offset: number) => {
      const r = novoIntervalo();
      r.startOffset = offset;
      r.endOffset = offset;
      return r;
    };
    let selecionados: unknown[][] = [];
    const cru = ed as unknown as Record<string, unknown>;
    let intervaloAtual = aposicionar(3);
    let inicioEl: Element = p;
    let textoSel = "";
    let nativa: unknown = null;
    cru.createRange = novoIntervalo;
    cru.editable = () => ({});
    cru.getSelection = () => ({
      getRanges: () => [intervaloAtual],
      getStartElement: () => ({ $: inicioEl }),
      getSelectedText: () => textoSel,
      selectRanges: (r: unknown[]) => selecionados.push(r),
      getNative: () => nativa,
    });
    const botao = f.doc.createElement("a");
    botao.setAttribute("class", "getReviewButton cke_button_on");
    f.doc.body.append(botao);
    const g = review.globais(ctxDe(f)) as Record<string, Fn>;
    g.initStyleReview(botao);
    const tecla = (key: string, keyCode: number) => ed.fire("key", { data: { keyCode, domEvent: { $: { key } } } });

    tecla("Backspace", 8);
    checar(
      "review [CK4 cru]: Backspace sem selecao marca como excluido o caractere antes do cursor e devolve o cursor",
      ed.inseridos.length === 1 &&
        />c<\/s>/.test(ed.inseridos[0] ?? "") &&
        /data-review="delete"/.test(ed.inseridos[0] ?? "") &&
        selecionados.length === 1,
      ed.inseridos,
    );
    checar("review [CK4 cru]: e cerca a acao com snapshots", ed.snapshots >= 4, ed.snapshots);
    tecla("Delete", 46);
    checar("review [CK4 cru]: Delete marca o caractere seguinte", />d<\/s>/.test(ed.inseridos[1] ?? ""), ed.inseridos);

    intervaloAtual = aposicionar(0);
    tecla("Backspace", 8);
    igual("review [CK4 cru]: sem caractere para apagar (inicio, sem caminhante) nao insere 'null'", ed.inseridos.length, 2);
    intervaloAtual = aposicionar(3);

    // digitar sem selecao fora de marca de insercao: estilo no cursor
    tecla("x", 88);
    igual("review [CK4 cru]: digitar sem selecao aplica os dois estilos de insercao", ed.estilos.length, 2);
    // dentro de uma marca de insercao: nada
    const dentro = corpo.ownerDocument.createElement("span");
    dentro.setAttribute("data-review", "add");
    dentro.setAttribute("class", "reviewSeiPro");
    p.append(dentro);
    inicioEl = dentro;
    tecla("y", 89);
    igual("review [CK4 cru]: dentro de marca de insercao digitar nao reaplica estilo", ed.estilos.length, 2);
    tecla("Backspace", 8);
    igual("review [CK4 cru]: Backspace dentro de marca de insercao nao marca exclusao", ed.inseridos.length, 2);
    // dentro do comentario: ignora tudo
    const com = corpo.ownerDocument.createElement("span");
    com.setAttribute("class", "commentReview");
    p.append(com);
    inicioEl = com;
    tecla("z", 90);
    tecla("Backspace", 8);
    igual("review [CK4 cru]: no campo de comentario nada e marcado", [ed.inseridos.length, ed.estilos.length], [2, 2]);
    inicioEl = p;

    // selecao: exclusao + insercao
    textoSel = "bcd";
    tecla("k", 75);
    checar(
      "review [CK4 cru]: selecao + tecla = exclusao (com espaco-marcador) + insercao",
      ed.inseridos.length === 4 && />bcd<\/s>/.test(ed.inseridos[2] ?? "") && /<u[^>]*>k<\/u>/.test(ed.inseridos[3] ?? ""),
      ed.inseridos.slice(2),
    );
    tecla("Shift", 16);
    tecla("ArrowRight", 39);
    tecla("Control", 17);
    igual("review [CK4 cru]: Shift/seta/Control com selecao nao marcam", ed.inseridos.length, 4);

    // varios paragrafos selecionados: uma exclusao por paragrafo, no paragrafo de mesma classe
    corpo.replaceChildren(
      ...htmlParaNos(
        corpo.ownerDocument,
        `<p id="a" class="Texto_Justificado">um</p><p id="b" class="Texto_Centralizado">dois</p><p id="c">tres</p>`,
      ),
    );
    const a = corpo.querySelector("#a") as Element;
    const b = corpo.querySelector("#b") as Element;
    nativa = { focusNode: { parentElement: a }, anchorNode: { parentElement: b } };
    textoSel = "um\n\ndois";
    const antes = ed.inseridos.length;
    tecla("q", 81);
    const novos = ed.inseridos.slice(antes);
    checar(
      "review [CK4 cru]: selecao de varios paragrafos marca cada um (mantendo a classe do paragrafo)",
      novos.length === 2 &&
        novos[0]?.startsWith('<p class="Texto_Justificado">') === true &&
        novos[1]?.startsWith('<p class="Texto_Centralizado">') === true &&
        />dois<\/s>/.test(novos[1] ?? ""),
      novos,
    );
    selecionados = [];
    nativa = { focusNode: { parentElement: b }, anchorNode: { parentElement: a } };
    tecla("q", 81);
    checar("review [CK4 cru]: selecao invertida (ancora antes do foco) nao entra em laco infinito", true);

    // o caractere apagado e um espaco: entra como espaco duro (senao a marca de exclusao ficaria invisivel)
    nativa = null;
    textoSel = "";
    (noTexto as { getText: () => string }).getText = () => "ab cd";
    intervaloAtual = aposicionar(3);
    const antesEspaco = ed.inseridos.length;
    tecla("Backspace", 8);
    checar(
      "review [CK4 cru]: apagar um espaco marca um espaco duro",
      /<s[^>]*>(&nbsp;|&#160;|\u00a0)<\/s>/.test(ed.inseridos[antesEspaco] ?? ""),
      ed.inseridos[antesEspaco],
    );
  }

  // ---------- gerenciador de revisoes ----------
  await nosDoisEditores("review gerenciador", async (c: CasoEditor) => {
    usarDocumento(c.doc);
    const v = `[CK${c.versao}]`;
    usuario(c, "ana");
    const g = review.globais(ctxDe(c)) as Record<string, Fn>;
    // o CK4 deixa a marca em dois elementos de mesmo id (span + u); um paragrafo traz conteudo hostil
    const dup = DOC.replace(
      '<u style="color:#0000FF;">novo</u>',
      '<u class="reviewSeiPro" data-id-review="A1" data-review="add" style="color:#0000FF;">novo</u><img src=x onerror="alert(1)"><script>alert(2)</script>',
    );
    montar(c, dup);

    g.getDialogReview();
    checar(`review ${v}: getDialogReview e um no-op (nao abre nada)`, !dialogoAberto(c.doc));

    g.getBoxCtrReview(null);
    const d = dialogoAberto(c.doc) as HTMLElement;
    checar(
      `review ${v}: abre o dialogo Gerenciar Revisoes, sem Cancelar`,
      !!d &&
        d.querySelector("h2")?.textContent === "Gerenciar Revisões" &&
        ![...d.querySelectorAll("button")].some((b) => /cancelar/i.test(b.textContent ?? "")),
    );
    checar(`review ${v}: mantem os ids dialogReviewPro e boxReviews`, !!d.querySelector("#dialogReviewPro #boxReviews"));
    const cartoes = () => [...d.querySelectorAll("#boxReviews .reviewDisplayPro")];
    igual(`review ${v}: um cartao por revisao (o id repetido do CK4 nao duplica)`, cartoes().length, 3);
    igual(`review ${v}: contagem`, d.querySelector("#reviewContagem")?.textContent, "3 revisões no documento");
    const c1 = cartoes()[0] as HTMLElement;
    checar(
      `review ${v}: cartao do gerenciador mostra o trecho com a marca destacada, so leitura`,
      !!c1.querySelector(".textReview .reviewHighlights") &&
        c1.querySelectorAll(".reviewHighlights").length >= 1 &&
        !c1.querySelector("[data-info]") &&
        c1.querySelector(".commentReview")?.textContent === "Nenhum comentário" &&
        acaoDo(c1, "accept")?.getAttribute("data-readonly") === "true",
    );
    checar(
      `review ${v}: o trecho vindo do documento e limpo (sem script, img com onerror ou classe de balao)`,
      !c1.querySelector("script") && ![...c1.querySelectorAll("*")].some((e) => e.hasAttribute("onerror")),
      c1.querySelector(".textReview")?.textContent,
    );
    checar(
      `review ${v}: comentario de outra pessoa aparece`,
      (cartoes()[1] as HTMLElement).querySelector(".commentReview")?.textContent === "porque sim",
    );
    igual(
      `review ${v}: botoes em lote`,
      [...d.querySelectorAll("#reviewBarra button")].map((b) => b.textContent),
      ["Rejeitar todas", "Aceitar todas"],
    );
    checar(`review ${v}: o cartao do gerenciador nao tem data-spro-click (ouvintes diretos)`, !d.querySelector("[data-spro-click]"));

    // clicar no trecho rola ate a marca
    const rolagens: unknown[] = [];
    (marca(c, "A1") as unknown as { scrollIntoView: (o: unknown) => void }).scrollIntoView = (o) => rolagens.push(o);
    const cont = c.doc.createElement("div");
    cont.id = "divEditores";
    (cont as unknown as { scrollTo: (o: unknown) => void }).scrollTo = (o) => rolagens.push(o);
    c.doc.body.append(cont);
    const p1 = corpoDe(c).querySelector("#p1") as unknown as { getBoundingClientRect: () => { top: number } };
    p1.getBoundingClientRect = () => ({ top: 10 });
    clique(c1.querySelector(".textReview") as Element);
    checar(`review ${v}: clicar no trecho rola ate a marca`, rolagens.length === 1, rolagens);
    cont.remove();

    // aceitar uma revisao pelo cartao
    clique(acaoDo(c1, "accept"));
    checar(
      `review ${v}: Aceitar no cartao aplica no documento`,
      !htmlAtual(c).includes('data-id-review="A1"') || c.versao === 5,
      htmlAtual(c),
    );
    if (c.versao === 4) igual(`review ${v}: e a lista e refeita (2 cartoes)`, cartoes().length, 2);
    else
      checar(
        `review ${v}: (CK5) a transformacao foi gravada nos dados do model`,
        !htmlAtual(c).includes('data-id-review="A1"'),
        htmlAtual(c),
      );

    // aceitar todas
    clique(d.querySelector("#reviewAcceptAll") as Element);
    checar(
      `review ${v}: Aceitar todas mostra a confirmacao e esconde a barra`,
      /Revisões realizadas com sucesso/.test(d.querySelector("#boxReviews")?.textContent ?? "") &&
        d.querySelector("#reviewBarra")?.hasAttribute("hidden") === true,
    );
    checar(`review ${v}: Aceitar todas limpa o documento`, !htmlAtual(c).includes("reviewSeiPro"), htmlAtual(c));

    // reabrir: um so dialogo, e sem revisoes a mensagem
    montar(c, "<p>sem marcas</p>");
    g.getBoxCtrReview(null);
    igual(`review ${v}: reabrir nao empilha dialogos`, c.doc.querySelectorAll("dialog.spro-dialogo[open]").length, 1);
    const d2 = dialogoAberto(c.doc) as HTMLElement;
    igual(
      `review ${v}: sem revisoes mostra a mensagem e esconde a barra`,
      [d2.querySelector("#boxReviews")?.textContent, d2.querySelector("#reviewBarra")?.hasAttribute("hidden")],
      ["Nenhuma revisão identificada neste documento.", true],
    );
    g.contentDialogReview("Outro aviso");
    igual(`review ${v}: contentDialogReview aceita o texto do aviso`, d2.querySelector("#boxReviews")?.textContent, "Outro aviso");

    // rejeitar todas pelo botao
    montar(c);
    g.contentDialogReview();
    clique(d2.querySelector("#reviewRejectAll") as Element);
    checar(
      `review ${v}: Rejeitar todas desfaz as revisoes`,
      !htmlAtual(c).includes("reviewSeiPro") && !htmlAtual(c).includes("novo"),
      htmlAtual(c),
    );

    // X fecha; sem o dialogo contentDialogReview e inofensivo
    clicar(d2, "Fechar");
    checar(`review ${v}: o X fecha o dialogo`, !dialogoAberto(c.doc));
    g.contentDialogReview();
    checar(`review ${v}: contentDialogReview sem dialogo nao quebra`, true);
  });

  // ---------- sem editor ----------
  {
    const f = criarCk4({ secoes: [] });
    usarDocumento(f.doc);
    const g = review.globais(ctxDe(f)) as Record<string, Fn>;
    g.getBoxCtrReview(null);
    g.setStyleReview("add", "insert", "x");
    g.removeReviewPro(null);
    g.showReviewTips(null);
    g.getStyleReview();
    checar("review: sem editor nenhuma funcao quebra e nenhum dialogo abre", !dialogoAberto(f.doc) && g.initStyleReview(null) === false);
  }

  // ---------- CK5: o balao abre pelo mousedown no documento ----------
  await nosDoisEditores("review boot", async (c: CasoEditor) => {
    usarDocumento(c.doc);
    const v = `[CK${c.versao}]`;
    usuario(c, "ana");
    let opcao = true;
    const ctx = ctxDe(c, { checkOpcao: (n) => n === "revisaotexto" && opcao });
    review.iniciar?.(ctx);
    review.iniciar?.(ctx);
    const corpo = montar(c);
    evento(marca(c, "A1"), "mousedown");
    const abriu = baloes(c).length;
    evento(corpo.querySelector("#p1") as Element, "mousedown");
    const depois = baloes(c).length;
    igual(
      `review ${v}: mousedown na marca ${c.versao === 5 ? "abre" : "NAO abre (o monolito liga no iframe)"} o balao; fora dele fecha`,
      [abriu, depois],
      [c.versao === 5 ? 1 : 0, 0],
    );
    if (c.versao === 5) {
      opcao = false;
      evento(marca(c, "A1"), "mousedown");
      igual(`review ${v}: com a opcao revisaotexto desligada nao abre`, baloes(c).length, 0);
      opcao = true;
      evento(marca(c, "A1"), "mousedown");
      const bal = baloes(c)[0] as Element;
      evento(bal.querySelector(".title-reviewtip") as Element, "mousedown");
      igual(`review ${v}: mousedown dentro do proprio balao nao o fecha`, baloes(c).length, 1);
    }
  });
}
