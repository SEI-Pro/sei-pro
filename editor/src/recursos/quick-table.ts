import { esconder, mostrar } from "../util/dom";
import type { Contexto, Recurso } from "./tipos";

/**
 * Tabela rapida (porte de `quick-table.js`): uma grade 5x5 que cresce ate 50x50 conforme o mouse anda sobre
 * ela; o clique insere a tabela abaixo do paragrafo do cursor. Sem jQuery; os eventos das celulas vao por
 * delegacao na `<table>` (as celulas novas da grade sao clones e nao herdariam handlers proprios).
 */
const LINHAS_INICIAIS = 5;
const COLUNAS_INICIAIS = 5;
const LIMITE = 49; // a grade para de crescer em 50 linhas/colunas

const num = (el: Element | null | undefined, atributo: string): number => Number.parseInt(el?.getAttribute(atributo) ?? "", 10);

function acharGrade(botao: Element | null, doc: Document): HTMLElement | null {
  const noGrupo = botao?.closest(".cke_toolgroup")?.querySelector<HTMLElement>(".divQuickTable");
  if (noGrupo) return noGrupo;
  const naBarra = botao?.closest(".ck-toolbar__items")?.querySelector<HTMLElement>(".divQuickTable");
  if (naBarra) return naBarra;
  for (let ir = botao?.previousElementSibling ?? null; ir; ir = ir.previousElementSibling)
    if (ir.classList.contains("divQuickTable")) return ir as HTMLElement;
  return doc.querySelector<HTMLElement>(".divQuickTable");
}

export const recurso: Recurso = {
  id: "quick-table",
  globais(c: Contexto) {
    const ADAPTADOR = c.adaptador;

    function hideQuickTable(): void {
      for (const g of c.doc.querySelectorAll<HTMLElement>(".divQuickTable")) {
        g.replaceChildren();
        esconder(g);
      }
      for (const b of c.doc.querySelectorAll(".getQuickTableButtom")) {
        b.classList.add("cke_button_off");
        b.classList.remove("cke_button_on");
      }
    }

    /** Destaque do trecho (0..linha, 0..coluna), legenda e crescimento/encolhimento da grade. */
    function quickTableOver(celula: Element | null): void {
      if (!celula) return;
      const linha = num(celula, "data-row");
      const coluna = num(celula, "data-col");
      const tabela = celula.closest("table");
      if (!tabela) return;
      for (const td of tabela.querySelectorAll("td")) td.classList.remove("td_hover");

      const linhas = () => [...tabela.querySelectorAll("tr")];
      if (linha >= 3 && num(linhas().at(-1)?.querySelector("td"), "data-row") > linha + 1) {
        linhas().at(-1)?.remove();
        tabela.setAttribute("data-row", String(num(tabela, "data-row") - 1));
      }
      if (coluna >= 3 && num(linhas().at(-1)?.lastElementChild, "data-col") > coluna + 1) {
        for (const tr of linhas()) tr.lastElementChild?.remove();
        tabela.setAttribute("data-col", String(num(tabela, "data-col") - 1));
      }
      for (const td of tabela.querySelectorAll("td")) {
        if (num(td, "data-row") <= linha && num(td, "data-col") <= coluna) td.classList.add("td_hover");
      }
      const legenda = celula.closest(".divQuickTable")?.querySelector(".quickTableInfo");
      if (legenda) legenda.textContent = `Tabela ${linha + 1}x${coluna + 1}`;

      if (linha === num(tabela, "data-row") && linha < LIMITE) {
        const nova = linhas().at(-1)?.cloneNode(true) as HTMLElement | undefined;
        if (nova) {
          nova.querySelectorAll("td").forEach((td, i) => {
            td.setAttribute("data-row", String(linha + 1));
            td.setAttribute("data-col", String(i));
            td.classList.remove("td_hover");
          });
          (tabela.querySelector("tbody") ?? tabela).append(nova);
          tabela.setAttribute("data-row", String(linha + 1));
        }
      }
      if (coluna === num(tabela, "data-col") && coluna < LIMITE) {
        for (const tr of linhas()) {
          const nova = tr.lastElementChild?.cloneNode(true) as HTMLElement | undefined;
          if (!nova) continue;
          nova.setAttribute("data-col", String(coluna + 1));
          nova.classList.remove("td_hover");
          tr.append(nova);
        }
        tabela.setAttribute("data-col", String(coluna + 1));
      }
    }

    function montarGrade(): DocumentFragment {
      const doc = c.doc;
      const frag = doc.createDocumentFragment();
      const legenda = doc.createElement("div");
      legenda.className = "quickTableInfo";
      legenda.textContent = "Inserir Tabela";
      const tabela = doc.createElement("table");
      tabela.setAttribute("data-row", String(LINHAS_INICIAIS - 1));
      tabela.setAttribute("data-col", String(COLUNAS_INICIAIS - 1));
      for (let i = 0; i < LINHAS_INICIAIS; i += 1) {
        const tr = doc.createElement("tr");
        for (let j = 0; j < COLUNAS_INICIAIS; j += 1) {
          const td = doc.createElement("td");
          td.setAttribute("data-row", String(i));
          td.setAttribute("data-col", String(j));
          tr.append(td);
        }
        tabela.append(tr);
      }
      // delegacao: vale para as celulas clonadas ao crescer. O mouseout chama o mesmo handler, como no legado.
      const aoPassar = (ev: Event) => quickTableOver((ev.target as Element | null)?.closest("td") ?? null);
      tabela.addEventListener("mouseover", aoPassar);
      tabela.addEventListener("mouseout", aoPassar);
      tabela.addEventListener("click", (ev) => {
        const td = (ev.target as Element | null)?.closest("td");
        if (td) quickTableClick(td);
      });
      frag.append(legenda, tabela);
      return frag;
    }

    function getQuickTable(this_: Element | null): void {
      if (!this_) return;
      const grade = acharGrade(this_, c.doc);
      // aberta = "on". No CK5 o botao nasce SEM cke_button_off (so o CK4 o poe), e o legado, que testava "off", gastava o 1o clique fechando.
      if (!this_.classList.contains("cke_button_on")) {
        if (grade) {
          grade.replaceChildren(montarGrade());
          mostrar(grade);
        }
        this_.classList.remove("cke_button_off");
        this_.classList.add("cke_button_on");
      } else {
        hideQuickTable();
        this_.classList.add("cke_button_off");
        this_.classList.remove("cke_button_on");
      }
    }

    function habilitarBotaoDeEstilo(origem: Element | null): void {
      const escopo = origem?.closest(".ck-toolbar__items, .cke_toolbox, .cke");
      let alvos = escopo ? [...escopo.querySelectorAll(".getTablestylesButtom")] : [];
      if (!alvos.length) alvos = [...c.doc.querySelectorAll(".getTablestylesButtom")];
      for (const a of alvos) a.classList.remove("cke_button_disabled");
    }

    function htmlDaTabela(linha: number, coluna: number): string {
      let html =
        '<table border="1" cellspacing="1" cellpadding="1" style="border-collapse:collapse; border-color:#646464;margin-left:auto; margin-right:auto; width:80%;">';
      html += "  <tbody>";
      for (let i = 0; i <= linha; i += 1) {
        html += "      <tr>";
        for (let j = 0; j <= coluna; j += 1) {
          html += '          <td><p class="Tabela_Texto_Alinhado_Esquerda" ><br></p></td>';
        }
        html += "      </tr>";
      }
      return `${html}  </tbody></table>`;
    }

    /**
     * Cursor na primeira celula da tabela recem-inserida. A tabela e a irma seguinte do paragrafo do cursor (ou o
     * ultimo elemento do corpo, quando entrou no fim). Sem id temporario na celula: o legado o removia DEPOIS da
     * insercao, fora do passo de desfazer (no CK4 o Ctrl+Z so tirava o id e a tabela ficava).
     */
    function posicionarNaPrimeira(ed: object, p: Element | null): void {
      const candidata = p ? p.nextElementSibling : ADAPTADOR.getBodyContainer(ed)?.lastElementChild;
      const primeira = candidata?.tagName === "TABLE" ? candidata.querySelector("td p") : null;
      if (!primeira) return;
      const doc = primeira.ownerDocument;
      const sel = doc.defaultView?.getSelection?.();
      if (!sel) return;
      const faixa = doc.createRange();
      faixa.setStart(primeira.firstChild ?? primeira, 0);
      faixa.collapse(true);
      sel.removeAllRanges();
      sel.addRange(faixa);
    }

    function quickTableClick(celula: Element | null): void {
      const ed = ADAPTADOR.getInstance(celula);
      if (!ed) {
        hideQuickTable();
        return;
      }
      const html = htmlDaTabela(num(celula, "data-row"), num(celula, "data-col"));
      const p = ADAPTADOR.getSelectionParagraph(ed);
      ADAPTADOR.withEdit(ed, () => {
        if (!p) return ADAPTADOR.insertHtml(ed, html);
        const proximo = p.nextElementSibling;
        if (proximo) ADAPTADOR.insertHtmlBefore(ed, proximo, html);
        else ADAPTADOR.appendToBody(ed, html);
      });
      hideQuickTable();
      habilitarBotaoDeEstilo(celula);
      posicionarNaPrimeira(ed, p);
    }

    return { getQuickTable, quickTableOver, hideQuickTable, quickTableClick };
  },
};
