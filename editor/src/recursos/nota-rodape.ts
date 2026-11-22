import { h } from "@comum/ui/dom";
import { htmlParaNos } from "../adaptador/html";
import { abrirDialogo } from "../ui/abrir";
import { avisarEditor } from "../ui/avisar";
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

    function reorderNtRodape(editorOuIframe?: unknown): void {
      // aceita a instancia do CK5 (`model`) ou uma das secoes do CK4; qualquer outra coisa (o iframe da assinatura antiga) cai na atual
      const ehInstancia =
        typeof editorOuIframe === "object" &&
        editorOuIframe !== null &&
        ("model" in editorOuIframe || A.getAllInstances().includes(editorOuIframe as never));
      const ed = ehInstancia ? (editorOuIframe as object) : A.getInstance();
      if (!ed) return;
      const raiz = A.versao === 5 ? raizDoCorpoCk5(ed, corpoDe(ed)) : null;
      if (recusado(ed, raiz)) return;
      A.withEdit(ed, () => renumerar(ed));
    }

    function updateNtRodape(editor?: object): void {
      const ed = editor ?? A.getInstance();
      if (!ed) return;
      if (!temNotas(ed)) {
        avisar("O documento não tem notas de rodapé.");
        return;
      }
      reorderNtRodape(ed);
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
      if (A.versao === 5 && !raiz) return;
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
      const paineis = new Map<string, HTMLElement>();
      const botoes = new Map<string, HTMLElement>();
      let botaoInserir: HTMLElement | null = null;
      const selecionar = (id: string) => {
        for (const [aba] of abas) {
          const ativa = aba === id;
          botoes.get(aba)?.setAttribute("aria-selected", String(ativa));
          botoes.get(aba)?.setAttribute("tabindex", ativa ? "0" : "-1");
          if (ativa) paineis.get(aba)?.removeAttribute("hidden");
          else paineis.get(aba)?.setAttribute("hidden", "");
        }
        if (botaoInserir) {
          if (id === "livre" || id === "abnt") botaoInserir.removeAttribute("hidden");
          else botaoInserir.setAttribute("hidden", "");
        }
      };

      const texto = h("textarea", { id: "textNotaRodape", rows: "3", style: "width:100%;" });
      const campo = (rotulo: string, id: string, tipo = "text") =>
        h(
          "label",
          { style: "display:grid;gap:2px;font-size:12px;color:#555;" },
          h("span", {}, rotulo),
          h("input", { type: tipo, id, style: "width:100%" }),
        );
      const previa = h("div", {
        id: "nrABNTResult",
        style:
          "margin-top:8px;padding:6px 8px;background:#f9f9dc;border-radius:4px;white-space:break-spaces;min-height:24px;font-size:12px;",
      });
      const abnt = h(
        "div",
        { style: "display:grid;grid-template-columns:1fr 1fr;gap:6px 10px;" },
        campo("Nome do autor", "nr_Nome"),
        campo("Sobrenome do autor", "nr_Sobrenome"),
        h("div", { style: "grid-column:1 / span 2;" }, campo("Título da publicação", "nr_Titulo")),
        campo("Número da edição", "nr_Edicao", "number"),
        campo("Ano da publicação", "nr_Ano", "number"),
        campo("Local (cidade)", "nr_Local"),
        campo("Nome da editora", "nr_Editora"),
        campo("Número do volume", "nr_Volume", "number"),
        campo("Páginas inicial-final", "nr_Paginas"),
        campo("Link da publicação", "nr_Link"),
        campo("Data do acesso", "nr_Data", "date"),
        h("div", { style: "grid-column:1 / span 2;" }, previa),
      );
      const conteudoPorAba: Record<string, HTMLElement> = {
        livre: h("div", {}, h("label", { for: "textNotaRodape", style: "font-size:12px;color:#555;" }, "Texto da nota de rodapé:"), texto),
        abnt,
        atualizar: h(
          "div",
          { style: "padding:10px 0;display:grid;gap:10px;" },
          h("p", {}, "Atualiza numerações e ordem das notas de rodapé já existentes no documento."),
          h("button", { type: "button", id: "btnNrUpdate", class: "spro-botao", onclick: () => updateNtRodape(ed) }, "Atualizar"),
        ),
        remover: h(
          "div",
          { style: "padding:10px 0;display:grid;gap:10px;" },
          h("p", {}, "Remove todas as notas de rodapé do documento (Ctrl+Z desfaz)."),
          h(
            "button",
            {
              type: "button",
              id: "btnNrRemove",
              class: "spro-botao",
              onclick: () => {
                removeNtRodape(null, ed);
                dialogo.fechar();
              },
            },
            "Remover todas",
          ),
        ),
      };
      const lista = h("div", { role: "tablist", style: "display:flex;gap:4px;border-bottom:1px solid #ccc;margin-bottom:10px;" });
      abas.forEach(([id, rotulo], i) => {
        const botao = h(
          "button",
          {
            type: "button",
            role: "tab",
            id: `ntTab_${id}`,
            "aria-controls": `ntPainel_${id}`,
            "aria-selected": "false",
            class: "spro-botao",
            onclick: () => selecionar(id),
            onkeydown: (evento: Event) => {
              const ev = evento as KeyboardEvent;
              const passo = ev.key === "ArrowRight" ? 1 : ev.key === "ArrowLeft" ? -1 : 0;
              const destino = abas[(i + passo + abas.length) % abas.length]?.[0];
              if (!passo || !destino) return;
              selecionar(destino);
              botoes.get(destino)?.focus();
            },
          },
          rotulo,
        );
        botoes.set(id, botao);
        lista.append(botao);
        const painel = h(
          "div",
          { role: "tabpanel", id: `ntPainel_${id}`, "aria-labelledby": `ntTab_${id}`, hidden: "" },
          conteudoPorAba[id] as HTMLElement,
        );
        paineis.set(id, painel);
      });

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
        conteudo: h(
          "div",
          { style: "min-width:480px;font-size:13px;" },
          lista,
          ...paineis.values(),
          h("div", { class: "spro-dialogo-rodape" }, botaoInserir),
        ),
      });
      selecionar("livre");
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
