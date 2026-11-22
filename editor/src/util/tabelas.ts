import type { Contexto } from "../recursos/tipos";
import { modeloDe, somenteLeituraDoModelo } from "./ck5";

// biome-ignore lint/suspicious/noExplicitAny: o CKEditor 5 do SEI nao tem tipos; so os membros usados abaixo importam
type Qualquer = any;

/** Um estilo de tabela do SEI Pro (cada valor e um atributo `style` pronto, exceto `p`/`pCabecalho`, que sao classes). */
export interface EstiloDeTabela {
  table: string;
  trCabecalho: string;
  /** Uma string (todas as linhas de dados) ou um par [impar, par] que alterna. */
  tr: string | [string, string];
  tdCabecalho: string;
  td: string;
  tdPrimeira: string;
  pCabecalho: string;
  p: string;
  /** A primeira linha vira cabecalho (`<thead>`). */
  cabecalho: boolean;
}

/** `"a:b; c: d"` -> `{a: "b", c: "d"}` (o valor pode ter `:`, p.ex. `url(http://...)`). */
export function estiloParaObjeto(css: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const decl of css.split(";")) {
    const i = decl.indexOf(":");
    if (i <= 0) continue;
    const nome = decl.slice(0, i).trim();
    const valor = decl.slice(i + 1).trim();
    if (nome && valor) out[nome] = valor;
  }
  return out;
}

export interface PlanoDaTabela {
  linhas: Array<{ tr: string; celulas: Array<{ td: string; p: string }> }>;
}

/** O que cada linha/celula recebe (a regra do `setSyleTable` do legado): linha 0 = cabecalho; as de dados alternam; a 1a coluna difere. */
export function planoDaTabela(e: EstiloDeTabela, nLinhas: number, nColunas: number): PlanoDaTabela {
  const linhas: PlanoDaTabela["linhas"] = [];
  for (let i = 0; i < nLinhas; i += 1) {
    const cab = i === 0;
    const tr = cab ? e.trCabecalho : Array.isArray(e.tr) ? (i % 2 === 0 ? e.tr[1] : e.tr[0]) : e.tr;
    const celulas = Array.from({ length: nColunas }, (_, j) => ({
      td: cab ? e.tdCabecalho : j === 0 ? e.tdPrimeira : e.td,
      p: cab ? e.pCabecalho : e.p,
    }));
    linhas.push({ tr, celulas });
  }
  return { linhas };
}

const celulasDe = (tr: Element): Element[] => Array.from(tr.querySelectorAll("td, th"));

/**
 * Aplica o estilo a uma tabela, num unico passo de desfazer. CK4: `style`/`class` no DOM do iframe (como o legado).
 * CK5: pelo model, via GHS direto (`table`, `tr`, `td`) e o atributo `estilo` dos paragrafos das celulas; o
 * cabecalho e `headingRows`. O elemento de model da tabela e o do `figure.table` (o `<table>` interno do DOM nao tem).
 */
export function estilizarTabela(c: Contexto, ed: object, tabela: Element, estilos: EstiloDeTabela): boolean {
  const a = c.adaptador;
  const linhas = Array.from(tabela.querySelectorAll("tr"));
  const plano = planoDaTabela(estilos, linhas.length, Math.max(0, ...linhas.map((tr) => celulasDe(tr).length)));

  if (a.versao === 5) {
    const e = ed as Qualquer;
    const ghs = e.plugins?.has("GeneralHtmlSupport") ? e.plugins.get("GeneralHtmlSupport") : null;
    const mTabela = modeloDe(e, tabela.closest("figure") ?? tabela);
    if (!ghs || !mTabela) return false;
    if (somenteLeituraDoModelo(c, mTabela)) {
      a.recusarEscrita();
      return false;
    }
    a.withEdit(ed, () => {
      ghs.setModelHtmlStyles("table", estiloParaObjeto(estilos.table), mTabela);
      linhas.forEach((tr, i) => {
        const l = plano.linhas[i];
        if (!l) return;
        const mTr = modeloDe(e, tr);
        if (mTr) ghs.setModelHtmlStyles("tr", estiloParaObjeto(l.tr), mTr);
        celulasDe(tr).forEach((td, j) => {
          const mTd = modeloDe(e, td);
          if (!mTd) return;
          ghs.setModelHtmlStyles("td", estiloParaObjeto(l.celulas[j]?.td ?? ""), mTd);
          for (const filho of mTd.getChildren())
            if (filho.name === "paragraph") e.model.change((w: Qualquer) => w.setAttribute("estilo", l.celulas[j]?.p, filho));
        });
      });
      if (estilos.cabecalho) e.model.change((w: Qualquer) => w.setAttribute("headingRows", 1, mTabela));
    });
    return true;
  }

  if (a.somenteLeitura(ed)) {
    a.recusarEscrita();
    return false;
  }
  a.withEdit(ed, () => {
    const doc = tabela.ownerDocument;
    tabela.setAttribute("style", estilos.table);
    linhas.forEach((tr, i) => {
      const l = plano.linhas[i];
      if (!l) return;
      tr.setAttribute("style", l.tr);
      celulasDe(tr).forEach((td, j) => {
        td.setAttribute("style", l.celulas[j]?.td ?? "");
        const classe = l.celulas[j]?.p ?? "";
        const ps = td.querySelectorAll("p");
        if (ps.length) for (const p of ps) p.setAttribute("class", classe);
        else {
          const p = doc.createElement("p");
          p.setAttribute("class", classe);
          p.append(...Array.from(td.childNodes));
          td.append(p);
        }
      });
    });
    if (estilos.cabecalho && linhas[0] && !tabela.querySelector("thead")) {
      const thead = doc.createElement("thead");
      thead.append(linhas[0]);
      tabela.prepend(thead);
    }
  });
  return true;
}
