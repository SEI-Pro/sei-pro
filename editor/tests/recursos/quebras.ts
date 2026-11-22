import { criarAdaptador } from "../../src/adaptador";
import { recurso as pageBreak } from "../../src/recursos/page-break";
import { recurso as sessionBreak } from "../../src/recursos/session-break";
import type { Contexto, Recurso } from "../../src/recursos/tipos";
import {
  type CasoEditor,
  criarCk4,
  criarCk5,
  cursorEm,
  type FalsoCk4,
  type FalsoCk5,
  inseridoAntes,
  nosDoisEditores,
  primeiroP,
} from "../falsos";
import { checar, igual, secao } from "../util";

const QUEBRA_PAGINA = '<div class="pageBreakPro" style="page-break-after: always"></div>';
// o espaco final do style e do legado (counter-reset termina com " "): manter
const QUEBRA_SECAO =
  '<p class="sessionBreakPro" style="counter-reset: paragrafo-n1 paragrafo-n2 paragrafo-n3 paragrafo-n4 romano_maiusculo letra_minuscula item-n1 item-n2 item-n3 item-n4 "></p>';

function ctx(c: { win: Window; doc: Document }): Contexto {
  return { adaptador: criarAdaptador(c.win), doc: c.doc, win: c.win, base: "", checkOpcao: () => true, verifyOpcao: () => false };
}

function aciona(r: Recurso, c: { win: Window; doc: Document }, nome: string): void {
  (r.globais(ctx(c))[nome] as (el: Element | null) => void)(null);
}

export async function verificarQuebras(): Promise<void> {
  secao("recursos page-break e session-break");
  const casos: Array<[string, Recurso, string, string]> = [
    ["getPageBreak", pageBreak, "getPageBreak", QUEBRA_PAGINA],
    ["getSessionBreak", sessionBreak, "getSessionBreak", QUEBRA_SECAO],
  ];
  for (const [rotulo, r, nome, html] of casos) {
    await nosDoisEditores(`${rotulo} insere antes do paragrafo do cursor`, (c: CasoEditor) => {
      checar(`${rotulo} e o unico global de ${r.id}`, JSON.stringify(Object.keys(r.globais(ctx(c)))) === JSON.stringify([nome]));
      const p = primeiroP(c);
      cursorEm(c, p);
      aciona(r, c, nome);
      igual(`${rotulo} [CK${c.versao}]: HTML exato do legado imediatamente antes do <p>`, inseridoAntes(c, p), html);
    });
    await nosDoisEditores(`${rotulo} sem cursor`, (c: CasoEditor) => {
      const p = primeiroP(c);
      cursorEm(c, null);
      aciona(r, c, nome);
      igual(`${rotulo} [CK${c.versao}]: sem cursor/paragrafo nada e inserido`, inseridoAntes(c, p), null);
    });
  }

  // CK5: o `counter-reset` nao sobrevive a importacao por HTML; vai pelo GHS no elemento inserido, no MESMO model.change
  {
    const f = criarCk5({ secoes: [{ raiz: "main", label: "Corpo do Texto", html: "<p>alvo</p>", principal: true }] });
    const ed = f.instancia();
    const chamadas: unknown[][] = [];
    Object.assign(ed, {
      plugins: {
        has: (n: string) => n === "GeneralHtmlSupport",
        get: () => ({ setModelHtmlStyles: (...a: unknown[]) => chamadas.push([...a, ed.profundidade]) }),
      },
    });
    const p = f.elemento("main").querySelector("p") as Element;
    f.selecionar({ raiz: "main", elemento: p });
    aciona(sessionBreak, f, "getSessionBreak");
    const novo = ed.modeloDe(p).previousSibling;
    igual(
      "session-break [CK5]: aplica counter-reset ao elemento inserido pelo GHS (view 'p')",
      [chamadas.length, chamadas[0]?.[0], chamadas[0]?.[2] === novo],
      [1, "p", true],
    );
    igual("session-break [CK5]: o valor e o do legado (com o espaco final)", chamadas[0]?.[1], {
      "counter-reset":
        "paragrafo-n1 paragrafo-n2 paragrafo-n3 paragrafo-n4 romano_maiusculo letra_minuscula item-n1 item-n2 item-n3 item-n4 ",
    });
    igual("session-break [CK5]: dentro de um model.change (um passo de desfazer)", (chamadas[0]?.at(-1) as number) >= 1, true);
  }

  // Review Focus 3: cursor numa secao somente leitura => nada e inserido
  const ck4 = criarCk4({
    secoes: [
      { nome: "txaEditor_1", titulo: "Cabeçalho", html: "<p id='c'>cab</p>", somenteLeitura: true },
      { nome: "txaEditor_2", titulo: "Corpo do Texto", html: "<p>corpo</p>" },
    ],
  });
  const pCab = ck4.instancia("txaEditor_1").corpo.querySelector("p") as Element;
  const pCorpo = ck4.instancia("txaEditor_2").corpo.querySelector("p") as Element;
  // o foco esta no Cabecalho (somente leitura) e o Corpo TEM um cursor antigo: nada pode ser escrito em lugar nenhum
  ck4.selecionar("txaEditor_2", { elemento: pCorpo });
  ck4.selecionar("txaEditor_1", { elemento: pCab });
  ck4.focar("txaEditor_1");
  aciona(pageBreak, ck4, "getPageBreak");
  aciona(sessionBreak, ck4, "getSessionBreak");
  checar(
    "CK4: foco no Cabecalho (somente leitura) nao insere a quebra nem la nem em outra secao",
    pCab.previousElementSibling === null &&
      pCorpo.previousElementSibling === null &&
      ck4.instancia("txaEditor_1").inseridos.length === 0 &&
      ck4.instancia("txaEditor_2").snapshots === 0,
  );

  const ck5: FalsoCk5 = criarCk5({
    secoes: [
      { raiz: "cab", label: "Cabeçalho", html: "<p>cab</p>", somenteLeitura: true },
      { raiz: "corpo", label: "Corpo do Texto", html: "<p>corpo</p>", principal: true },
    ],
  });
  const pCab5 = ck5.elemento("cab").querySelector("p") as Element;
  ck5.selecionar({ raiz: "cab", elemento: pCab5 });
  aciona(pageBreak, ck5, "getPageBreak");
  checar("CK5: cursor na raiz somente leitura nao insere a quebra", ck5.instancia().insercoes.length === 0);
  // CK5: a recusa tambem NAO deixa o callback aplicar `counter-reset` no paragrafo anterior (que ja existia na secao RO)
  {
    const f = criarCk5({
      secoes: [
        { raiz: "cab", label: "Cabeçalho", html: "<p>um</p><p>dois</p>", somenteLeitura: true },
        { raiz: "corpo", label: "Corpo do Texto", html: "<p>corpo</p>", principal: true },
      ],
    });
    const estilos: unknown[] = [];
    Object.assign(f.instancia(), {
      plugins: {
        has: (n: string) => n === "GeneralHtmlSupport",
        get: () => ({ setModelHtmlStyles: (...a: unknown[]) => estilos.push(a) }),
      },
    });
    f.selecionar({ raiz: "cab", elemento: f.elemento("cab").querySelectorAll("p")[1] as Element });
    let recusas = 0;
    const ctxF = ctx(f);
    ctxF.adaptador.aoRecusarEscrita(() => {
      recusas += 1;
    });
    (sessionBreak.globais(ctxF).getSessionBreak as (el: Element | null) => void)(null);
    igual(
      "session-break [CK5]: secao somente leitura: nada inserido, nenhum estilo no paragrafo anterior, uma recusa",
      [f.instancia().insercoes.length, estilos.length, recusas],
      [0, 0, 1],
    );
  }
  void (null as unknown as FalsoCk4);
}
