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
  void (null as unknown as FalsoCk4);
}
