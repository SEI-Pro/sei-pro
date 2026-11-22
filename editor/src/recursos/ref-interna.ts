import { h } from "@comum/ui/dom";
import { abrirDialogo } from "../ui/abrir";
import { avisarEditor } from "../ui/avisar";
import { textoAleatorio } from "../util/aleatorio";
import { ancorarNoInicio, nomeDaAncora } from "../util/ancoras";
import { escaparHtml } from "../util/html";
import { rotularLinks } from "../util/links";
import { numerar } from "../util/numeracao";
import { ligarRolagem } from "../util/rolagem";
import type { Contexto, Recurso } from "./tipos";

/**
 * Referencia interna (porte de `ref-interna.js`): o dialogo lista os paragrafos numerados (`Paragrafo_Numerado_Nivel*`,
 * `Item_Nivel*`); "Inserir" poe no cursor `[prefixo 1.1], [prefixo 2] e [prefixo 3]` como links para ancoras
 * `RefPro_<16>` e "Atualizar referencias" renumera os rotulos ja inseridos. A ancora so e criada para os paragrafos
 * REFERENCIADOS (o legado gravava uma em todo paragrafo numerado ao abrir o dialogo). CK4: `<a name class="refpro">`;
 * CK5: o `id` do paragrafo. Os links sao reconhecidos por `a[href^="#RefPro_"]` (no CK5 a classe do link cai).
 */
const PREFIXO_ANCORA = "RefPro_";
const CLASSE_ANCORA = "refpro";
const LINKS = `a[href^="#${PREFIXO_ANCORA}"]`;

export interface ParagrafoNumerado {
  ref: string;
  item: string;
  text: string;
  /** O paragrafo ja tem a ancora no documento (senao `ref` e um nome sorteado, gravado so se for referenciado). */
  ancorado: boolean;
  el: HTMLElement;
}

const rotulo = (prefixo: string, ocultar: boolean, item: string): string =>
  `[${ocultar || prefixo.trim() === "" ? "" : `${prefixo.trim()} `}${item}]`;

export const recurso: Recurso = {
  id: "ref-interna",
  globais(c: Contexto) {
    const ADAPTADOR = c.adaptador;
    const avisar = (t: string) => avisarEditor(c.doc, t);

    /** Os paragrafos numerados do corpo, na ordem; `false` se nao ha editor ou nenhum paragrafo. So le: nao escreve no documento. */
    function getNiveisParagrafos(editor?: object): ParagrafoNumerado[] | false {
      const ed = editor ?? ADAPTADOR.getInstance();
      if (!ed) return false;
      const ps = ADAPTADOR.findInBody(ed, "p");
      if (!ps.length) return false;
      const itens = numerar(ps.map((p) => ({ classe: (p.getAttribute("class") ?? "").trim() })));
      const lista: ParagrafoNumerado[] = [];
      ps.forEach((p, i) => {
        const item = itens[i]?.item;
        if (!item) return;
        const nome = nomeDaAncora(p, PREFIXO_ANCORA);
        lista.push({
          ref: nome ? nome.slice(PREFIXO_ANCORA.length) : textoAleatorio(16),
          item,
          text: p.textContent ?? "",
          ancorado: !!nome,
          el: p,
        });
      });
      return lista;
    }

    /** Quais rotulos mudam (e quantas referencias apontam para um paragrafo que nao existe mais). So le. */
    function planejar(ed: object, prefixo: string, ocultar: boolean): { mudar: Array<{ a: Element; texto: string }>; perdidas: number } {
      const lista = getNiveisParagrafos(ed);
      const refs = ADAPTADOR.findInBody(ed, LINKS);
      const mudar: Array<{ a: Element; texto: string }> = [];
      if (!lista || !refs.length) return { mudar, perdidas: 0 };
      const itemDe = new Map(lista.filter((p) => p.ancorado).map((p) => [p.ref, p.item]));
      let perdidas = 0;
      for (const a of refs) {
        const item = itemDe.get((a.getAttribute("href") ?? "").slice(1 + PREFIXO_ANCORA.length));
        if (item === undefined) {
          perdidas += 1;
          continue;
        }
        const texto = rotulo(prefixo, ocultar, item);
        if ((a.textContent ?? "") !== texto) mudar.push({ a, texto });
      }
      return { mudar, perdidas };
    }

    /** Renumera os rotulos das referencias ja inseridas (um passo de desfazer, so se algo mudou). Uma referencia a paragrafo removido fica como esta. */
    function atualizar(ed: object, prefixo: string, ocultar: boolean): { atualizadas: number; perdidas: number } {
      const { mudar, perdidas } = planejar(ed, prefixo, ocultar);
      let atualizadas = 0;
      if (mudar.length) ADAPTADOR.withEdit(ed, () => (atualizadas = rotularLinks(c, mudar)));
      return { atualizadas, perdidas };
    }

    /** `updateRefsInternas(editor, prefixo, ocultar)` ou, na assinatura antiga, `updateRefsInternas(prefixo, ocultar)`. */
    function updateRefsInternas(editor?: object | string, prefixo?: string | boolean, ocultar?: boolean): void {
      let ed: object | null | undefined;
      let pref: string;
      let oculto: boolean;
      if (typeof editor === "string" || editor === undefined) {
        ed = ADAPTADOR.getInstance();
        pref = editor ?? "";
        oculto = prefixo === true;
      } else {
        ed = editor;
        pref = typeof prefixo === "string" ? prefixo : "";
        oculto = ocultar === true;
      }
      if (ed) atualizar(ed, pref, oculto);
    }

    function getRefInterna(this_: Element | null): void {
      const ed = ADAPTADOR.getInstance(this_);
      if (!ed) return;
      const lista = getNiveisParagrafos(ed);
      if (!lista || !lista.length) return avisar("O documento não tem parágrafos numerados para referenciar.");

      const prefixo = h("input", { type: "text", id: "prefixo", style: "width:70%" });
      const ocultar = h("input", { type: "checkbox", id: "hidePrefix" });
      const select = h(
        "select",
        { id: "selectRef", multiple: "multiple", size: String(Math.min(10, lista.length)), style: "width:100%" },
        ...lista.map((p) => {
          const texto = p.text.trim();
          const curto = texto.replace(/^(.{50}[^\s]*)[\s\S]*/, "$1");
          return h("option", { value: `${p.ref}-${p.item}` }, `${p.item}. ${curto}${curto.length < texto.length ? "..." : ""}`);
        }),
      );
      const ocultarPrefixo = () => ocultar.matches(":checked") || prefixo.value.trim() === "";
      const dialogo = abrirDialogo(c.doc, {
        titulo: "Inserir referência interna",
        conteudo: h(
          "div",
          { style: "display:grid;gap:12px;min-width:420px;font-size:13px;" },
          h("label", { style: "display:grid;gap:4px;" }, h("span", {}, "Prefixo:"), prefixo),
          h("label", {}, ocultar, " Não utilizar prefixo"),
          h("label", { style: "display:grid;gap:4px;" }, h("span", {}, "Parágrafo numerado:"), select),
          h(
            "div",
            { class: "spro-dialogo-rodape" },
            h(
              "button",
              {
                type: "button",
                class: "spro-botao",
                onclick: () => {
                  const { perdidas } = atualizar(ed, prefixo.value, ocultarPrefixo());
                  ligarRolagem(c);
                  avisar(
                    perdidas
                      ? `Referências atualizadas. ${perdidas} apontam para parágrafos que não existem mais.`
                      : "Referências atualizadas com sucesso",
                  );
                },
              },
              "Atualizar referências",
            ),
            h(
              "button",
              {
                type: "button",
                class: "spro-botao primario",
                onclick: () => {
                  const escolhidos = lista.filter((p) =>
                    [...select.querySelectorAll("option")].some((o) => o.value === `${p.ref}-${p.item}` && o.selected),
                  );
                  if (!escolhidos.length) return avisar("Selecione ao menos um parágrafo numerado.");
                  if (inserir(ed, escolhidos, prefixo.value, ocultarPrefixo())) dialogo.fechar();
                },
              },
              "Inserir",
            ),
          ),
        ),
      });
    }

    /** Ancora os paragrafos escolhidos, renumera as referencias existentes e insere as novas, num passo de desfazer. */
    function inserir(ed: object, escolhidos: ParagrafoNumerado[], prefixo: string, ocultar: boolean): boolean {
      if (ADAPTADOR.somenteLeitura(ed)) {
        ADAPTADOR.recusarEscrita();
        return false;
      }
      const prontos = escolhidos.filter((p) => p.el.isConnected);
      if (!prontos.length) return (avisar("Os parágrafos escolhidos não existem mais no documento."), false);
      const partes = prontos.map(
        (p) =>
          `<a href="#${PREFIXO_ANCORA}${escaparHtml(p.ref)}" class="ancoraSei refInternaPro anchorRefInternaPro" contenteditable="false">${escaparHtml(rotulo(prefixo, ocultar, p.item))}</a>`,
      );
      const texto = partes.length > 1 ? `${partes.slice(0, -1).join(", ")} e ${partes.at(-1)}` : (partes[0] ?? "");
      let inserido = false;
      ADAPTADOR.withEdit(ed, () => {
        const { mudar } = planejar(ed, prefixo, ocultar);
        if (mudar.length) rotularLinks(c, mudar);
        for (const p of prontos) if (!p.ancorado && !ancorarNoInicio(c, ed, p.el, `${PREFIXO_ANCORA}${p.ref}`, CLASSE_ANCORA)) return;
        ADAPTADOR.insertHtml(ed, ` ${texto} `);
        inserido = true;
      });
      ligarRolagem(c);
      return inserido;
    }

    return {
      getRefInterna,
      updateRefsInternas,
      getNiveisParagrafos,
      clickScroolToRef: () => ligarRolagem(c),
    };
  },
  iniciar(c: Contexto) {
    ligarRolagem(c);
  },
};
