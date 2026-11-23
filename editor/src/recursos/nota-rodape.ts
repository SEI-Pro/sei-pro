import { h } from "@comum/ui/dom";
import { htmlParaNos } from "../adaptador/html";
import { abrirDialogo } from "../ui/abrir";
import { avisarEditor } from "../ui/avisar";
import { criarAbas, dica, formulario, grade, grupo, previa as previaDeFormulario } from "../ui/formulario";
import { type CamposAbnt, montarAbnt } from "../util/abnt";
import { textoAleatorio } from "../util/aleatorio";
import { somenteLeituraDoModelo } from "../util/ck5";
import { escaparHtml } from "../util/html";
import {
  htmlDaChamada,
  htmlDoRodape,
  raizDoCorpoCk5,
  refsDeOutrasSecoes,
  removerNotasCk4,
  removerNotasCk5,
  renumerarNotasCk4,
  renumerarNotasCk5,
  SELETOR_NOTAS,
  SEPARADOR_HTML,
} from "../util/notas";
import { ligarRolagem } from "../util/rolagem";
import type { Contexto, Recurso } from "./tipos";

/**
 * Nota de rodape (porte de `nota-rodape.js`): o dialogo tem as abas Texto livre, Padrao ABNT, Atualizar notas e
 * Remover notas. Inserir poe a chamada `[N]` (sobrescrita) no cursor e o rodape no fim do corpo, e renumera tudo;
 * cada acao e um passo de desfazer (CK4: snapshots; CK5: um `model.change`, tambem a renumeracao e a ordem dos
 * rodapes, que o legado fazia por `setData`, sem desfazer). O texto livre entra ESCAPADO.
 */
const CAMPOS_ABNT: Array<[keyof CamposAbnt, string]> = [
  ["nome", "nr_Nome"],
  ["sobrenome", "nr_Sobrenome"],
  ["titulo", "nr_Titulo"],
  ["edicao", "nr_Edicao"],
  ["ano", "nr_Ano"],
  ["local", "nr_Local"],
  ["editora", "nr_Editora"],
  ["volume", "nr_Volume"],
  ["paginas", "nr_Paginas"],
  ["link", "nr_Link"],
  ["data", "nr_Data"],
];

export const recurso: Recurso = {
  id: "nota-rodape",
  globais(c: Contexto) {
    const A = c.adaptador;
    const avisar = (t: string) => avisarEditor(c.doc, t);
    const corpoDe = (ed: object) => A.getBodyContainer(ed);
    const temNotas = (ed: object) => A.findInBody(ed, SELETOR_NOTAS).length > 0;

    /** CK5: a raiz do corpo e somente leitura? CK4: a secao. Avisa a recusa e devolve true. */
    function recusado(ed: object, raiz: unknown): boolean {
      const ro = A.versao === 5 ? somenteLeituraDoModelo(c, raiz) : A.somenteLeitura(ed);
      if (ro) A.recusarEscrita();
      return ro;
    }

    function refsDasChamadas(html: string): string[] {
      const caixa = c.doc.createElement("div");
      caixa.append(...htmlParaNos(c.doc, html));
      return Array.from(caixa.querySelectorAll(".ntRodape_item[data-ntrodape-ref]")).map((e) => e.getAttribute("data-ntrodape-ref") ?? "");
    }

    /** Renumera e reordena (DENTRO de uma edicao ja aberta). */
    function renumerar(ed: object): void {
      if (A.versao === 5) {
        const raiz = raizDoCorpoCk5(ed, corpoDe(ed));
        if (raiz) renumerarNotasCk5(ed, raiz, refsDeOutrasSecoes(ed, raiz, refsDasChamadas));
      } else {
        const corpo = corpoDe(ed);
        if (corpo) renumerarNotasCk4(corpo);
      }
    }

    /** Devolve `false` quando a escrita foi recusada (secao somente leitura) ou nao ha editor. */
    function reorderNtRodape(editorOuIframe?: unknown): boolean {
      // aceita a instancia do CK5 (`model`) ou uma das secoes do CK4; qualquer outra coisa (o iframe da assinatura antiga) cai na atual
      const ehInstancia =
        typeof editorOuIframe === "object" &&
        editorOuIframe !== null &&
        ("model" in editorOuIframe || A.getAllInstances().includes(editorOuIframe as never));
      const ed = ehInstancia ? (editorOuIframe as object) : A.getInstance();
      if (!ed) return false;
      const raiz = A.versao === 5 ? raizDoCorpoCk5(ed, corpoDe(ed)) : null;
      if (A.versao === 5 && !raiz) {
        avisar("Não foi possível localizar o corpo do documento para atualizar as notas.");
        return false;
      }
      if (recusado(ed, raiz)) return false;
      A.withEdit(ed, () => renumerar(ed));
      return true;
    }

    function updateNtRodape(editor?: object): void {
      const ed = editor ?? A.getInstance();
      if (!ed) return;
      if (!temNotas(ed)) {
        avisar("O documento não tem notas de rodapé.");
        return;
      }
      // so anuncia sucesso se escreveu: a recusa (somente leitura) ou a falta do corpo ja avisaram por conta propria
      if (!reorderNtRodape(ed)) return;
      ligarRolagem(c);
      avisar("Notas de rodapé atualizadas com sucesso");
    }

    function removeNtRodape(_this: Element | null, editor?: object): void {
      const ed = editor ?? A.getInstance();
      if (!ed) return;
      if (!temNotas(ed)) {
        avisar("O documento não tem notas de rodapé.");
        return;
      }
      const raiz = A.versao === 5 ? raizDoCorpoCk5(ed, corpoDe(ed)) : null;
      if (A.versao === 5 && !raiz) {
        avisar("Não foi possível localizar o corpo do documento para remover as notas.");
        return;
      }
      if (recusado(ed, raiz)) return;
      A.withEdit(ed, () => {
        if (A.versao === 5) removerNotasCk5(ed, raiz);
        else {
          const corpo = corpoDe(ed);
          if (corpo) removerNotasCk4(corpo);
        }
      });
      avisar("Notas de rodapé removidas com sucesso");
    }

    /** `textoHtml` e HTML (o do dialogo ja vem escapado). A chamada vai no cursor, o rodape no fim do corpo. */
    function insertNtRodape(textoHtml: string, editor?: object): void {
      const ed = editor ?? A.getInstance();
      if (!ed || textoHtml.trim() === "") return;
      const raiz = A.versao === 5 ? raizDoCorpoCk5(ed, corpoDe(ed)) : null;
      if (A.versao === 5 && !raiz) {
        avisar("Não foi possível localizar o corpo do documento para inserir a nota.");
        return;
      }
      if (recusado(ed, raiz)) return;
      const ref = textoAleatorio(16);
      A.withEdit(ed, () => {
        // CK5: a chamada e o rodape precisam ficar na MESMA secao (o corpo); com o cursor fora dele, vai para o fim do corpo
        if (A.versao === 5) {
          const e = ed as {
            model: {
              document: { selection: { getFirstPosition(): { root: unknown } | null } };
              change(f: (w: { setSelection(r: unknown, onde: string): void }) => void): void;
            };
          };
          if (e.model.document.selection.getFirstPosition()?.root !== raiz) e.model.change((w) => w.setSelection(raiz, "end"));
        }
        if (!A.findInBody(ed, ".ntRodape_tr").length) A.appendToBody(ed, SEPARADOR_HTML);
        A.appendToBody(ed, htmlDoRodape(ref, textoHtml));
        A.insertHtml(ed, htmlDaChamada(ref));
        renumerar(ed);
      });
      ligarRolagem(c);
    }

    function lerCampos(raiz: ParentNode): CamposAbnt {
      const v = (id: string) => (raiz.querySelector<HTMLInputElement>(`#${id}`)?.value ?? "").toString();
      return Object.fromEntries(CAMPOS_ABNT.map(([chave, id]) => [chave, v(id)])) as unknown as CamposAbnt;
    }

    /** Atualiza a previa da referencia ABNT com os campos de `raiz` (o dialogo aberto, se omitido). */
    function updateNrABNT(raizOuElemento?: Element | null): void {
      const raiz = raizOuElemento ?? c.doc;
      const previa = raiz.querySelector("#nrABNTResult");
      if (!previa) return;
      previa.replaceChildren(...htmlParaNos(c.doc, montarAbnt(lerCampos(raiz))));
    }

    function openDialogNotaRodape(editor?: object): void {
      const ed = editor ?? A.getInstance();
      if (!ed) return;
      const abas = [
        ["livre", "Texto livre"],
        ["abnt", "Padrão ABNT"],
        ["atualizar", "Atualizar notas"],
        ["remover", "Remover notas"],
      ] as const;
      let botaoInserir: HTMLElement | null = null;
      const aoSelecionar = (id: string) => {
        if (!botaoInserir) return;
        if (id === "livre" || id === "abnt") botaoInserir.removeAttribute("hidden");
        else botaoInserir.setAttribute("hidden", "");
      };

      const texto = h("textarea", { id: "textNotaRodape", rows: "4", placeholder: "Digite o texto da nota de rodapé" });
      const campo = (rotulo: string, id: string, tipo = "text", opcoes: { largo?: boolean; placeholder?: string } = {}) =>
        grupo(
          rotulo,
          { para: id, largo: opcoes.largo },
          h("input", { type: tipo, id, autocomplete: "off", ...(opcoes.placeholder ? { placeholder: opcoes.placeholder } : {}) }),
        );
      const previa = previaDeFormulario({ id: "nrABNTResult" }, { vazio: "A nota formatada aparece aqui" });
      previa.classList.add("texto");
      const abnt = formulario(
        grade("duas", campo("Nome do autor", "nr_Nome"), campo("Sobrenome do autor", "nr_Sobrenome")),
        campo("Título da publicação", "nr_Titulo"),
        grade("tres", campo("Edição", "nr_Edicao", "number"), campo("Ano", "nr_Ano", "number"), campo("Volume", "nr_Volume", "number")),
        grade("duas", campo("Local (cidade)", "nr_Local"), campo("Editora", "nr_Editora")),
        grade("duas", campo("Páginas (inicial-final)", "nr_Paginas"), campo("Data do acesso", "nr_Data", "date")),
        campo("Link da publicação", "nr_Link", "text", { placeholder: "https://" }),
        grupo("Nota formatada", {}, previa),
      );
      abnt.classList.add("compacto");
      const conteudoPorAba: Record<string, HTMLElement> = {
        livre: grupo("Texto da nota de rodapé", { para: "textNotaRodape" }, texto),
        abnt,
        atualizar: h(
          "div",
          { class: "spro-form" },
          dica("Atualiza a numeração e a ordem das notas de rodapé que já existem no documento."),
          h(
            "div",
            {},
            h("button", { type: "button", id: "btnNrUpdate", class: "spro-botao", onclick: () => updateNtRodape(ed) }, "Atualizar notas"),
          ),
        ),
        remover: h(
          "div",
          { class: "spro-form" },
          dica("Remove todas as notas de rodapé do documento. Ctrl+Z desfaz."),
          h(
            "div",
            {},
            h(
              "button",
              {
                type: "button",
                id: "btnNrRemove",
                class: "spro-botao perigo",
                onclick: () => {
                  removeNtRodape(null, ed);
                  dialogo.fechar();
                },
              },
              "Remover todas",
            ),
          ),
        ),
      };
      const controleAbas = criarAbas("nt", abas, conteudoPorAba, aoSelecionar);

      botaoInserir = h(
        "button",
        {
          type: "button",
          class: "spro-botao primario",
          onclick: () => {
            const abntHtml = (previa.textContent ?? "").trim() ? montarAbnt(lerCampos(abnt)) : "";
            const livre = texto.value.trim();
            const html = abntHtml || escaparHtml(livre).replace(/\r?\n/g, "<br>");
            if (!html) {
              avisar("Digite o texto da nota de rodapé.");
              return;
            }
            insertNtRodape(html, ed);
            dialogo.fechar();
          },
        },
        "Inserir",
      );
      for (const entrada of abnt.querySelectorAll("input")) {
        entrada.addEventListener("input", () => updateNrABNT(abnt));
        entrada.addEventListener("change", () => updateNrABNT(abnt));
      }
      const dialogo = abrirDialogo(c.doc, {
        titulo: "Inserir nota de rodapé",
        largura: 640,
        conteudo: h(
          "div",
          { class: "spro-form" },
          controleAbas.barra,
          h("div", {}, ...controleAbas.paineis),
          h("div", { class: "spro-dialogo-rodape" }, botaoInserir),
        ),
      });
      controleAbas.selecionar("livre");
      texto.focus({ preventScroll: true });
    }

    return {
      getNotaRodape(this_: Element | null): void {
        const ed = A.getInstance(this_);
        if (ed) openDialogNotaRodape(ed);
      },
      /** Compat com o `initFunctions` do legado: o dialogo agora abre sob demanda. */
      getDialogNotaRodape: () => {},
      openDialogNotaRodape,
      removeNtRodape,
      updateNrABNT,
      insertNtRodape,
      updateNtRodape,
      reorderNtRodape,
    };
  },
  iniciar(c: Contexto) {
    ligarRolagem(c);
  },
};
