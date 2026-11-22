import { h } from "@comum/ui/dom";
import { abrirDialogo } from "../ui/abrir";
import { avisarEditor } from "../ui/avisar";
import { colunaDeFormulario, linhaDeCampo } from "../ui/formulario";
import { textoAleatorio } from "../util/aleatorio";
import { ancorarNoInicio, nomeDaAncora } from "../util/ancoras";
import { escaparHtml } from "../util/html";
import type { Contexto, Recurso } from "./tipos";

/**
 * Sumario do documento (porte de `sumario.js`): o dialogo escolhe ate 3 estilos de titulo entre os que existem no
 * documento; o sumario ("SUMÁRIO" + um link por titulo) entra no cursor e cada titulo ganha uma ancora
 * `bookmark-<16>` no inicio (CK4: `<a name class="seipro-bookmark">`; CK5: o `id` do titulo). Tudo num passo de
 * desfazer. O texto do titulo entra escapado. Reinserir reaproveita a ancora que o titulo ja tem (nao duplica).
 */
const CLASSE_ANCORA = "seipro-bookmark";
const PREFIXO = "bookmark-";
const semPonto = (s: string) => s.replace(/^\./, "");

export const recurso: Recurso = {
  id: "sumario",
  globais(c: Contexto) {
    const ADAPTADOR = c.adaptador;
    const avisar = (t: string) => avisarEditor(c.doc, t);

    /** Primeira classe de cada <p> do corpo, sem repeticao, na ordem em que aparecem. */
    function estilosDoDocumento(ed: object): string[] {
      const vistos = new Set<string>();
      for (const p of ADAPTADOR.findInBody(ed, "p")) {
        const primeira = (p.getAttribute("class") ?? "").trim().split(/\s+/)[0];
        if (primeira) vistos.add(primeira);
      }
      return [...vistos];
    }

    function opcoes(estilos: string[], vazia: boolean, padrao?: string): HTMLOptionElement[] {
      const itens = estilos.map((e) => h("option", { value: `.${e}`, ...(e === padrao ? { selected: "selected" } : {}) }, e));
      return vazia ? [h("option", { value: "" }, "(nenhum)"), ...itens] : itens;
    }

    /** Repovoa o `<select id>` com pares [rotulo, valor] (compatibilidade com o legado). */
    function updateSelectDialog(_this: Element | null, id: string, pares: Array<[string, string]>): void {
      const select = c.doc.querySelector<HTMLSelectElement>(`select#${id}`);
      if (!select) return;
      select.replaceChildren(...pares.map(([rotulo, valor]) => h("option", { value: valor }, rotulo)));
    }

    /** Monta e insere o sumario no cursor. Devolve false (e avisa) se nada foi inserido. */
    function insertSumarioDocumento(_this: Element | null, estilos: string[], editor?: object): boolean {
      const ed = editor ?? ADAPTADOR.getInstance();
      if (!ed) return false;
      const nomes = new Set(estilos.map(semPonto).filter(Boolean));
      if (!nomes.size) return false;
      if (ADAPTADOR.somenteLeitura(ed)) {
        ADAPTADOR.recusarEscrita();
        return false;
      }
      const titulos = ADAPTADOR.findInBody(ed, "p").filter(
        (p) => (p.textContent ?? "").trim() !== "" && [...p.classList].some((k) => nomes.has(k)),
      );
      if (!titulos.length) {
        avisar("Nenhum parágrafo do documento tem os estilos escolhidos.");
        return false;
      }
      let html = '<p class="Texto_Alinhado_Esquerda"><strong>SUMÁRIO</strong></p>';
      ADAPTADOR.withEdit(ed, () => {
        for (const titulo of titulos) {
          const nome = nomeDaAncora(titulo, PREFIXO) ?? `${PREFIXO}${textoAleatorio(16)}`;
          if (!ancorarNoInicio(c, ed, titulo, nome, CLASSE_ANCORA)) continue;
          html += `<p class="Texto_Alinhado_Esquerda"><a href="#${escaparHtml(nome)}">${escaparHtml((titulo.textContent ?? "").trim())}</a></p>`;
        }
        // CK5: insertContent no meio de um paragrafo funde o ultimo bloco com o texto dele; antes do paragrafo do cursor nao
        const alvo = ADAPTADOR.versao === 5 ? ADAPTADOR.getSelectionParagraph(ed) : null;
        if (alvo) ADAPTADOR.insertHtmlBefore(ed, alvo, html);
        else ADAPTADOR.insertHtml(ed, html);
      });
      return true;
    }

    function getDialogSumarioDocumento(_this: Element | null, editor?: object): void {
      const ed = editor ?? ADAPTADOR.getInstance();
      if (!ed) return;
      const estilos = estilosDoDocumento(ed);
      if (!estilos.length) {
        avisar("O documento não tem parágrafos com estilo para montar o sumário.");
        return;
      }
      const campo = (id: string, vazia: boolean, padrao: string | undefined) => {
        return h("select", { id }, ...opcoes(estilos, vazia, padrao));
      };
      // sugestao: Item_Nivel1/2/3, quando o documento os tem
      const s1 = campo("listStyle1", false, "Item_Nivel1");
      const s2 = campo("listStyle2", true, "Item_Nivel2");
      const s3 = campo("listStyle3", true, "Item_Nivel3");
      const dialogo = abrirDialogo(c.doc, {
        titulo: "Inserir sumário",
        conteudo: colunaDeFormulario(
          linhaDeCampo("Estilo do Título 1 (obrigatório):", s1),
          linhaDeCampo("Estilo do Título 2:", s2),
          linhaDeCampo("Estilo do Título 3:", s3),
          h(
            "div",
            { class: "spro-dialogo-rodape" },
            h(
              "button",
              {
                type: "button",
                class: "spro-botao primario",
                onclick: () => {
                  const escolhidos = [s1.value, s2.value, s3.value].filter((v) => v !== "");
                  if (!escolhidos.length) {
                    avisar("Escolha o estilo do Título 1.");
                    return;
                  }
                  if (insertSumarioDocumento(null, [...new Set(escolhidos)], ed)) dialogo.fechar();
                },
              },
              "Inserir",
            ),
          ),
        ),
      });
    }

    return {
      getSumarioDocumento(this_: Element | null): void {
        const ed = ADAPTADOR.getInstance(this_);
        if (ed) getDialogSumarioDocumento(null, ed);
      },
      /** As `<option value=".estilo">` dos estilos do documento (o legado devolvia a string de `<option>`). */
      getListStylesDocumento(_this: Element | null, editor?: object): HTMLOptionElement[] {
        const ed = editor ?? ADAPTADOR.getInstance();
        return ed ? opcoes(estilosDoDocumento(ed), false) : [];
      },
      updateSelectDialog: (elemento: string, pares: Array<[string, string]>) => updateSelectDialog(null, elemento, pares),
      getDialogSumarioDocumento: (editor?: object) => getDialogSumarioDocumento(null, editor),
      getDialogSumarioDocumento_: () => getDialogSumarioDocumento(null),
      insertSumarioDocumento: (estilos: string[], editor?: object) => insertSumarioDocumento(null, estilos, editor),
    };
  },
};
