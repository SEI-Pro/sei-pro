import { criarAdaptador } from "../../src/adaptador";
import { recurso as copyStyle, lerEstiloDoElemento } from "../../src/recursos/copy-style";
import type { Contexto } from "../../src/recursos/tipos";
import {
  type CasoEditor,
  type FalsoCk4,
  type FalsoCk5,
  nosDoisEditores,
  primeiroP,
  selecionarTexto,
  totalInseridos,
  ultimoInserido,
} from "../falsos";
import { checar, igual, secao } from "../util";

type Fn = (...a: unknown[]) => unknown;

function ctxDe(c: { win: Window; doc: Document }): Contexto {
  return { adaptador: criarAdaptador(c.win), doc: c.doc, win: c.win, base: "", checkOpcao: () => true, verifyOpcao: () => false };
}

/** sessionStorage em memoria na janela falsa. */
function armazem(win: Window): Map<string, string> {
  const m = new Map<string, string>();
  (win as unknown as Record<string, unknown>).sessionStorage = {
    getItem: (k: string) => m.get(k) ?? null,
    setItem: (k: string, v: string) => m.set(k, String(v)),
    removeItem: (k: string) => m.delete(k),
  };
  return m;
}

/** O linkedom nao tem getComputedStyle: o elemento passa a ter os valores combinados. */
function computado(el: Element, valores: { fontSize?: string; color?: string; backgroundColor?: string }): void {
  (el.ownerDocument.defaultView as unknown as { getComputedStyle: unknown }).getComputedStyle = () => ({
    fontSize: valores.fontSize ?? "16px",
    color: valores.color ?? "rgb(0, 0, 0)",
    backgroundColor: valores.backgroundColor ?? "rgba(0, 0, 0, 0)",
  });
}

const comandos = (c: CasoEditor): Array<[string, unknown]> =>
  c.versao === 4 ? (c.ed as FalsoCk4).instancia("txaEditor_1").comandos : (c.ed as FalsoCk5).instancia().executados;

const ESTILO = {
  fontSize: 18,
  color: "rgb(255, 0, 0)",
  backgroundColor: "rgb(255, 255, 0)",
  bold: true,
  underline: false,
  italic: true,
  strike: false,
  subscript: false,
  superscript: false,
};

export async function verificarCopyStyle(): Promise<void> {
  secao("recurso copy-style: leitura do estilo");
  const { paginaFalsa } = await import("../falsos");
  const { doc } = paginaFalsa(
    "<p id='p'><strong><em><span id='s'>x</span></em></strong></p><p><sub id='b'>y</sub></p><p><u id='u'>z</u><s id='t'>w</s><sup id='sp'>v</sup></p>",
  );
  const s = doc.querySelector("#s") as Element;
  computado(s, { fontSize: "18px", color: "rgb(255, 0, 0)", backgroundColor: "rgb(255, 255, 0)" });
  igual("negrito e italico pelo ancestral, fonte, cor e fundo pelo estilo computado", lerEstiloDoElemento(s), ESTILO);
  doc.documentElement.classList.add("dark-mode");
  computado(s, { color: "rgb(251, 251, 254)" });
  igual("modo escuro: a cor do tema (#fbfbfe) nao e capturada", lerEstiloDoElemento(s).color, false);
  computado(s, { color: "rgb(255, 0, 0)" });
  igual("modo escuro: cor escolhida pelo autor continua capturada", lerEstiloDoElemento(s).color, "rgb(255, 0, 0)");
  doc.documentElement.classList.remove("dark-mode");
  computado(s, { color: "rgb(251, 251, 254)" });
  igual("modo claro: #fbfbfe escolhido pelo autor e capturado", lerEstiloDoElemento(s).color, "rgb(251, 251, 254)");
  computado(s, {});
  igual("cor preta, fundo transparente e 16px => false (como o legado)", lerEstiloDoElemento(s), {
    ...ESTILO,
    fontSize: 16,
    color: false,
    backgroundColor: false,
  });
  const b = doc.querySelector("#b") as Element;
  computado(b, { fontSize: "16px" });
  igual(
    "16px dentro de <sub> => fontSize false e subscript true",
    [lerEstiloDoElemento(b).fontSize, lerEstiloDoElemento(b).subscript],
    [false, true],
  );
  // o CK5 renderiza negrito como <strong>/<b>, italico como <i>, tachado como <s>/<strike>/<del>
  const { doc: doc5 } = paginaFalsa("<p><b><i><span id='x'>x</span></i></b></p><p><del id='d'>d</del></p><p><strike id='k'>k</strike></p>");
  computado(doc5.querySelector("#x") as Element, {});
  igual(
    "CK5: <b> e <i> contam como negrito e italico",
    [lerEstiloDoElemento(doc5.querySelector("#x") as Element).bold, lerEstiloDoElemento(doc5.querySelector("#x") as Element).italic],
    [true, true],
  );
  igual(
    "CK5: <del> e <strike> contam como tachado",
    [lerEstiloDoElemento(doc5.querySelector("#d") as Element).strike, lerEstiloDoElemento(doc5.querySelector("#k") as Element).strike],
    [true, true],
  );
  computado(doc.querySelector("#u") as Element, {});
  igual(
    "sublinhado, tachado e sobrescrito",
    [
      lerEstiloDoElemento(doc.querySelector("#u") as Element).underline,
      lerEstiloDoElemento(doc.querySelector("#t") as Element).strike,
      lerEstiloDoElemento(doc.querySelector("#sp") as Element).superscript,
    ],
    [true, true, true],
  );

  secao("recurso copy-style: capturar, aplicar e desligar");
  await nosDoisEditores("copy-style", (c: CasoEditor) => {
    const v = `[CK${c.versao}]`;
    const mem = armazem(c.win);
    const g = copyStyle.globais(ctxDe(c)) as Record<string, Fn>;
    igual(`copy-style ${v}: globais do contrato`, Object.keys(g).sort(), [
      "actionCopyStyle",
      "applyCopyStyle",
      "getCopyStyle",
      "menuCopyStyle",
      "removeCopyStyle",
      "setCopyStyle",
    ]);
    const botao = c.doc.createElement("a");
    botao.className = "getCopyStyleButtom cke_button_off";
    c.doc.body.append(botao);
    const p = primeiroP(c);
    computado(p, { fontSize: "18px", color: "rgb(255, 0, 0)", backgroundColor: "rgb(255, 255, 0)" });

    // capturar: o estilo vem do elemento do cursor (sem selecao), como no legado
    selecionarTexto(c, p, "", "");
    g.setCopyStyle(null);
    const guardado = JSON.parse(mem.get("copyStylePro") ?? "null");
    igual(
      `copy-style ${v}: guarda o estilo capturado`,
      [guardado?.fontSize, guardado?.color, guardado?.backgroundColor],
      [18, "rgb(255, 0, 0)", "rgb(255, 255, 0)"],
    );
    const corpo = c.versao === 4 ? (c.ed as FalsoCk4).instancia("txaEditor_1").corpo : (c.ed as FalsoCk5).elemento("main");
    checar(
      `copy-style ${v}: marca o corpo como pincel ativo e o botao como on`,
      corpo.classList.contains("cke_copyformatting_active") && botao.classList.contains("cke_button_on"),
    );
    igual(`copy-style ${v}: getCopyStyle devolve o guardado`, (g.getCopyStyle() as { fontSize: number }).fontSize, 18);

    // segundo clique desliga
    g.setCopyStyle(null);
    checar(
      `copy-style ${v}: segundo clique desliga (sem estilo guardado, corpo e botao limpos)`,
      !mem.has("copyStylePro") && !corpo.classList.contains("cke_copyformatting_active") && botao.classList.contains("cke_button_off"),
    );
  });

  await nosDoisEditores("copy-style aplicar", (c: CasoEditor) => {
    const v = `[CK${c.versao}]`;
    const mem = armazem(c.win);
    const g = copyStyle.globais(ctxDe(c)) as Record<string, Fn>;
    const botao = c.doc.createElement("a");
    botao.className = "getCopyStyleButtom";
    c.doc.body.append(botao);
    const p = primeiroP(c);
    const corpo = c.versao === 4 ? (c.ed as FalsoCk4).instancia("txaEditor_1").corpo : (c.ed as FalsoCk5).elemento("main");

    // sem pincel ativo: so atualiza o botao
    selecionarTexto(c, p, "alvo", "alvo");
    g.applyCopyStyle();
    checar(
      `copy-style ${v}: sem pincel ativo nada e escrito e o botao fica habilitado pela selecao`,
      totalInseridos(c) === 0 && comandos(c).length === 0 && !botao.classList.contains("cke_button_disabled"),
    );
    selecionarTexto(c, p, "", "");
    g.applyCopyStyle();
    checar(`copy-style ${v}: sem selecao e sem pincel o botao fica desabilitado`, botao.classList.contains("cke_button_disabled"));

    // pincel ativo + selecao: aplica
    mem.set("copyStylePro", JSON.stringify(ESTILO));
    corpo.classList.add("cke_copyformatting_active");
    selecionarTexto(c, p, "alvo", "alvo");
    g.applyCopyStyle();
    igual(
      `copy-style ${v}: limpa a formatacao, aplica as marcas e DEPOIS embrulha a selecao no span`,
      comandos(c).map((x) => x[0]),
      ["removeFormat", "bold", "italic"],
    );
    igual(
      `copy-style ${v}: span com fundo, tamanho e cor sobre a selecao`,
      ultimoInserido(c),
      '<span style="background-color: rgb(255, 255, 0); font-size: 18px; color: rgb(255, 0, 0)">alvo</span>',
    );
    checar(
      `copy-style ${v}: desliga o pincel depois de aplicar (sem Alt)`,
      !mem.has("copyStylePro") && !corpo.classList.contains("cke_copyformatting_active"),
    );

    // Alt apertado mantem o pincel (aplicacao em sequencia)
    mem.set("copyStylePro", JSON.stringify(ESTILO));
    corpo.classList.add("cke_copyformatting_active");
    (c.win as unknown as Record<string, unknown>).event = { altKey: true };
    selecionarTexto(c, p, "outro", "outro");
    g.applyCopyStyle();
    checar(
      `copy-style ${v}: com Alt o pincel continua ativo`,
      mem.has("copyStylePro") && corpo.classList.contains("cke_copyformatting_active"),
    );
    (c.win as unknown as Record<string, unknown>).event = undefined;
    g.removeCopyStyle();

    // estilo guardado hostil (o sessionStorage e da pagina): nada de marcacao entra no style=""
    mem.set(
      "copyStylePro",
      JSON.stringify({
        ...ESTILO,
        bold: false,
        italic: false,
        color: 'red"><img src=x onerror=alert(1)>',
        backgroundColor: "url(javascript:1)",
        fontSize: 18,
      }),
    );
    corpo.classList.add("cke_copyformatting_active");
    selecionarTexto(c, p, "alvo", "alvo");
    g.applyCopyStyle();
    const html = ultimoInserido(c) ?? "";
    checar(
      `copy-style ${v}: cor e fundo hostis sao descartados; so o tamanho valido sobra`,
      !html.includes("onerror") && !html.includes("url(") && !html.includes("<img") && html.includes("font-size: 18px"),
      html,
    );
  });

  secao("recurso copy-style: menu de contexto");
  await nosDoisEditores("copy-style menu", (c: CasoEditor) => {
    const v = `[CK${c.versao}]`;
    armazem(c.win);
    const g = copyStyle.globais(ctxDe(c)) as Record<string, Fn>;
    const ed = criarAdaptador(c.win).getInstance();
    const p = primeiroP(c);
    selecionarTexto(c, p, "alvo", "alvo");
    g.menuCopyStyle(ed);
    if (c.versao === 4) {
      const e4 = (c.ed as FalsoCk4).instancia("txaEditor_1");
      igual(`copy-style ${v}: menu nativo oferece "Copiar formatacao" quando ha selecao num <p>`, e4.abrirMenu(p), [
        "seiPro_Copiar_formata__o",
      ]);
      selecionarTexto(c, p, "", "");
      igual(`copy-style ${v}: sem selecao o item some`, e4.abrirMenu(p), []);
    } else {
      const corpo = (c.ed as FalsoCk5).elemento("main") as HTMLElement & { __seiProCtxBuilders?: Array<(a: Element | null) => unknown[]> };
      igual(`copy-style ${v}: no SEI 5 o menu do navegador fica (nenhum item)`, corpo.__seiProCtxBuilders?.[0]?.(p), []);
    }
  });
}
