import { h } from "@comum/ui/dom";
import { abrirDialogo } from "../ui/abrir";
import { avisarEditor } from "../ui/avisar";
import { CORES, estilosDaTabela } from "../util/estilos-tabela";
import { estilizarTabela } from "../util/tabelas";
import type { Contexto, Recurso } from "./tipos";

/**
 * Estilo de tabela (porte de `table-styles.js`): o botao da barra abre um dialogo com a variacao de cor, o estilo
 * (21 modelos), a largura em % e "primeira linha como cabecalho"; Aplicar reescreve `style` da tabela, das linhas e
 * das celulas da tabela sob o cursor (a mais proxima, se houver tabela dentro de tabela). Sem tabela sob o cursor,
 * so avisa. Os nomes dos globais mantem a grafia "Syle" do legado.
 */
const COR_PADRAO = "color1";
const AVISO_SEM_TABELA = "Clique na tabela que deseja aplicar o estilo!";
const ESCURO = "dark-mode-color-";

/** Cor `#rrggbb` -> brilho percebido (a mesma conta do `getBrightnessColor` do legado). */
function brilho(hex: string): number {
  const n = Number.parseInt(hex.slice(1, 7), 16);
  return Math.round((((n >> 16) & 255) * 299 + ((n >> 8) & 255) * 587 + (n & 255) * 114) / 1000);
}

/** Texto claro ou escuro por cima do fundo, para o modo escuro do SEI Pro (`setBgTableColor` do legado). */
function marcarContraste(tabela: Element): void {
  for (const el of tabela.querySelectorAll("tr, td")) {
    const fundo = /background-color:\s*(#[0-9a-fA-F]{6})\b/.exec(el.getAttribute("style") ?? "")?.[1];
    if (!fundo) continue;
    el.classList.remove(`${ESCURO}black`, `${ESCURO}white`);
    el.classList.add(`${ESCURO}${brilho(fundo) > 125 ? "black" : "white"}`);
  }
}

export const recurso: Recurso = {
  id: "table-styles",
  globais(c: Contexto) {
    const ADAPTADOR = c.adaptador;
    const tabelaSobCursor = (ed: object): HTMLTableElement | null => ADAPTADOR.getSelectionElement(ed)?.closest("table") ?? null;

    /** Troca a variacao de cor da previa (a classe `colorN` da grade de estilos). */
    function aplicarCorNaPrevia(raiz: ParentNode, id: string | null): void {
      const previa = raiz.querySelector("#addEstiloTabela");
      if (previa && id && /^color\d+$/.test(id)) previa.className = id;
    }

    /** Aplica o estilo a tabela sob o cursor. `valor` = [estilo, cor, largura%]; sem valor nao faz nada. */
    function setSyleTable(
      _this: Element | null,
      valor?: [string, string, string | number],
      editor?: object,
      cabecalho = true,
      alvo?: Element | null,
    ): void {
      const ed = editor ?? ADAPTADOR.getInstance();
      if (!ed || !valor) return;
      const [estiloId, corId, largura] = valor;
      const cor = CORES[corId];
      const larguraNum = Number(largura);
      const estilo = cor && Number.isFinite(larguraNum) ? estilosDaTabela(cor, larguraNum)[estiloId] : undefined;
      // `alvo` e a tabela capturada na abertura do dialogo: la a selecao nativa do CK5 ja saiu do editor
      const tabela = alvo?.isConnected ? alvo : alvo ? null : tabelaSobCursor(ed);
      if (!estilo) return;
      if (!tabela) {
        avisarEditor(c.doc, "A tabela não está mais no documento.");
        return;
      }
      estilizarTabela(c, ed, tabela, { ...estilo, cabecalho }, { aoFinalCk4: marcarContraste });
    }

    function buildHtmlSyleTable(): HTMLElement {
      const ids = Object.keys(CORES);
      const estilos = Object.keys(estilosDaTabela(CORES[COR_PADRAO] as never));
      const cores = h(
        "div",
        { id: "selectColorTabela", class: "listaCoresTabela" },
        ...ids.map((id, i) =>
          h(
            "span",
            {},
            h(
              "label",
              { for: `colorStyle${i + 1}` },
              h("a", { class: "iconSelectColorTable", style: `background-color: ${CORES[id]?.light}` }),
              h("a", { class: "iconSelectColorTable", style: `background-color: ${CORES[id]?.dark}` }),
            ),
            h("br"),
            h("input", {
              type: "radio",
              name: "colorStyle",
              "data-colorid": id,
              id: `colorStyle${i + 1}`,
              value: `colorStyle${i + 1}`,
              ...(i === 0 ? { checked: "checked" } : {}),
            }),
          ),
        ),
      );
      // sete modelos por fileira, como no legado
      const fileiras: HTMLElement[] = [];
      estilos.forEach((_, i) => {
        if (i % 7 === 0) fileiras.push(h("div", { class: "listaEstiloTabela" }));
        const id = i + 1;
        fileiras[fileiras.length - 1]?.append(
          h(
            "span",
            {},
            h(
              "label",
              { for: `tableStyle${id}` },
              h("a", { class: "iconSelectStyleTable", style: `background-position-y: -${id * 43}px` }),
            ),
            h("br"),
            h("input", {
              type: "radio",
              name: "tableStyle",
              id: `tableStyle${id}`,
              value: `tableStyle${id}`,
              ...(i === 0 ? { checked: "checked" } : {}),
            }),
          ),
        );
      });
      return h(
        "div",
        { class: "dialogBoxDiv", style: "font-size:11pt;line-height:14pt;color:#616161;" },
        h("div", { style: "padding-bottom: 10px;" }, "Selecione a variação de cores da tabela:"),
        cores,
        h("div", { style: "padding-bottom: 10px;" }, "Selecione o estilo da tabela:"),
        h("div", { id: "addEstiloTabela", class: COR_PADRAO }, ...fileiras),
        h(
          "div",
          { style: "padding: 10px 0;" },
          "Selecione a largura da tabela: ",
          h("input", {
            type: "number",
            id: "addEstiloTableWidth",
            style: "background: #f5f5f5; padding: 5px; border-radius: 5px; width: 50px; border: 1px solid #ccc;",
            max: "100",
            step: "5",
            min: "5",
          }),
          " %",
        ),
        h(
          "div",
          { style: "padding: 10px 0;" },
          h("input", { type: "checkbox", id: "addEstiloTableHeader", checked: "checked" }),
          " ",
          h("label", { for: "addEstiloTableHeader" }, "Determinar a primeira linha como cabeçalho da tabela"),
        ),
      );
    }

    /** A largura atual da tabela em % do pai (80 se nao der para medir), dentro de 5..100. */
    function larguraAtual(tabela: Element | null): number {
      try {
        const medida = (el: Element | null) => Number.parseFloat(el ? c.win.getComputedStyle(el).width : "");
        const pct = Math.round((100 * medida(tabela)) / medida(tabela?.parentElement ?? null));
        return Number.isFinite(pct) ? Math.min(100, Math.max(5, pct)) : 80;
      } catch {
        return 80;
      }
    }

    function openDialogSyleTable(_this: Element | null, editor?: object): void {
      const ed = editor ?? ADAPTADOR.getInstance();
      if (!ed) return;
      const tabelaAlvo = tabelaSobCursor(ed);
      const corpo = buildHtmlSyleTable();
      const largura = corpo.querySelector<HTMLInputElement>("#addEstiloTableWidth");
      if (largura) largura.value = String(larguraAtual(tabelaAlvo));
      // por addEventListener: HTML sanitizado perde `onchange` (regressao de 11/09/2026)
      for (const radio of corpo.querySelectorAll<HTMLInputElement>('input[name="colorStyle"]'))
        radio.addEventListener("change", () => aplicarCorNaPrevia(corpo, radio.getAttribute("data-colorid")));
      const dialogo = abrirDialogo(c.doc, {
        titulo: "Inserir estilo à tabela",
        conteudo: h(
          "div",
          {},
          corpo,
          h(
            "div",
            { class: "spro-dialogo-rodape" },
            h(
              "button",
              {
                type: "button",
                class: "spro-botao primario",
                onclick: () => {
                  const estilo = corpo.querySelector<HTMLInputElement>('input[name="tableStyle"]:checked')?.value;
                  const cor = corpo.querySelector<HTMLInputElement>('input[name="colorStyle"]:checked')?.getAttribute("data-colorid");
                  const larg = corpo.querySelector<HTMLInputElement>("#addEstiloTableWidth")?.value;
                  const cabecalho = corpo.querySelector("#addEstiloTableHeader:checked") !== null;
                  if (!estilo || !cor || !larg) return;
                  setSyleTable(null, [estilo, cor, larg], ed, cabecalho, tabelaAlvo);
                  dialogo.fechar();
                },
              },
              "Aplicar",
            ),
          ),
        ),
      });
    }

    return {
      getSyleSelectedTable(this_: Element | null): void {
        const ed = ADAPTADOR.getInstance(this_);
        if (!ed) return;
        if (tabelaSobCursor(ed)) openDialogSyleTable(null, ed);
        else avisarEditor(c.doc, AVISO_SEM_TABELA);
      },
      /** `this_` e o radio de variacao de cor (o legado o ligava por `data-spro-change`). */
      changeColorTable(this_: Element | null): void {
        aplicarCorNaPrevia(c.doc, this_?.getAttribute("data-colorid") ?? null);
      },
      /** So por compatibilidade com o `initFunctions` do legado: o dialogo agora abre sob demanda. */
      getDialogSyleTable(): void {},
      buildHtmlSyleTable,
      openDialogSyleTable: (editor?: object) => openDialogSyleTable(null, editor),
      /** Placeholder do fluxo antigo (sem valor nao aplica nada). */
      getSyleTable(this_: Element | null): void {
        const ed = ADAPTADOR.getInstance(this_);
        if (ed) ADAPTADOR.withEdit(ed, () => {});
      },
      setSyleTable: (valor?: [string, string, string | number], editor?: object) => setSyleTable(null, valor, editor),
    };
  },
};
