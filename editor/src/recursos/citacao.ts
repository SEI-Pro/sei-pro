import { h } from "@comum/ui/dom";
import { abrirDialogo } from "../ui/abrir";
import { avisarEditor } from "../ui/avisar";
import { atualizarValor, caixa, dica, formulario, grupo } from "../ui/formulario";
import { escaparHtml } from "../util/html";
import type { Contexto, Recurso } from "./tipos";

/**
 * Referencia de documento do processo (porte de `citacao.js`): o dialogo lista os documentos do processo, com filtro e
 * caixas de marcacao; Inserir poe no cursor a referencia (ancora SEI) de cada um, separadas por virgula e "e". A lista
 * (`dadosProcessoPro.listDocumentos`) e o prefixo ("SEI no ") vem do monolito.
 */

interface DocumentoDoProcesso {
  id_protocolo: string;
  documento: string;
  nr_sei: string;
}

/** O que o monolito deixa em `window` e este recurso usa (todos opcionais). */
interface Monolito {
  dadosProcessoPro?: { listDocumentos?: DocumentoDoProcesso[] };
  checkProcessoSigiloso?(): boolean;
  getCitacaoDoc?(): string;
  getConfigValue?(chave: string): string | undefined;
  textoParaHtmlPro?(texto: string): string;
  htmlLinksProtocoloEditorPro?(html: string, ed: object): string;
}

/** Rotulo de um documento na lista: `Tipo (nº SEI)`; sem numero, so o tipo. */
export function rotuloDoDocumento(d: DocumentoDoProcesso): string {
  return d.nr_sei !== "" ? `${d.documento} (${d.nr_sei})` : d.documento;
}

const semAcento = (t: string): string =>
  t
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

export const recurso: Recurso = {
  id: "citacao",
  globais(c: Contexto) {
    const A = c.adaptador;
    const w = c.win as unknown as Monolito;
    const avisar = (t: string) => avisarEditor(c.doc, t);
    const documentos = (): DocumentoDoProcesso[] => w.dadosProcessoPro?.listDocumentos ?? [];

    /** Clique do botao: espera a lista de documentos do processo carregar (consulta de 500 ms) e abre o dialogo. */
    function getCitacaoDocumento(this_: Element | null, TimeOut = 9000): void {
      if (w.checkProcessoSigiloso?.()) {
        avisar("Não disponível para processos sigilosos");
        A.getInstance(this_);
        return;
      }
      if (TimeOut <= 0) return;
      if (w.dadosProcessoPro?.listDocumentos !== undefined) {
        A.getInstance(this_);
        getDialogCitacaoDocumento(this_);
        return;
      }
      setTimeout(() => getCitacaoDocumento(this_, TimeOut - 100), 500);
    }

    function getDialogCitacaoDocumento(this_: Element | null): void {
      if (w.checkProcessoSigiloso?.()) return;
      const ed = A.getInstance(this_);
      if (!ed) return;

      const lista = documentos().filter((d) => d.documento !== "");
      const filtro = h("input", {
        type: "search",
        id: "filtroCitacao",
        placeholder: "Filtrar por tipo ou número SEI…",
        autocomplete: "off",
      });
      const area = h("div", { id: "listaCitacao", class: "spro-checklist", role: "group", "aria-label": "Documentos do processo" });
      const linhas = lista.map((d) => {
        const caixaDoc = caixa({ value: d.id_protocolo, name: "citacaoDocumento" }, rotuloDoDocumento(d));
        caixaDoc.setAttribute("data-busca", semAcento(rotuloDoDocumento(d)));
        return caixaDoc;
      });
      area.append(...linhas);
      const resumo = h("p", { class: "spro-dica", id: "resumoCitacao" });
      const marcados = (): string[] =>
        linhas
          .map((l) => l.querySelector("input") as HTMLInputElement)
          .filter((i) => (typeof i.checked === "boolean" ? i.checked : i.hasAttribute("checked")))
          .map((i) => i.getAttribute("value") ?? "");

      const atualizar = () => {
        const n = marcados().length;
        atualizarValor(raiz, "filtroCitacao", `${n} ${n === 1 ? "selecionado" : "selecionados"}`);
        const termo = semAcento(filtro.value.trim());
        let visiveis = 0;
        for (const l of linhas) {
          const mostra = termo === "" || (l.getAttribute("data-busca") ?? "").includes(termo);
          if (mostra) {
            l.removeAttribute("hidden");
            visiveis += 1;
          } else l.setAttribute("hidden", "");
        }
        resumo.textContent =
          lista.length === 0
            ? "O processo ainda não tem documentos para referenciar."
            : visiveis === 0
              ? "Nenhum documento corresponde ao filtro."
              : "";
      };
      filtro.addEventListener("input", atualizar);
      area.addEventListener("change", atualizar);

      const inserir = h(
        "button",
        {
          type: "button",
          class: "spro-botao primario",
          onclick: () => {
            const ids = marcados();
            if (!ids.length) {
              avisar("Selecione ao menos um documento.");
              return;
            }
            ids.forEach((id, i) => {
              const inseriu = insertCitacaoDocumento(id, ed);
              if (inseriu && i < ids.length - 2) A.insertText(ed, ", ");
              if (inseriu && i === ids.length - 2) A.insertText(ed, " e ");
            });
            dialogo.fechar();
          },
        },
        "Inserir",
      );
      const raiz = formulario(
        grupo("Documentos do processo", { para: "filtroCitacao", valor: "0 selecionados" }, filtro),
        area,
        resumo,
        dica("Cada documento marcado entra no texto como referência, na ordem da lista, separados por vírgula e “e”."),
        h("div", { class: "spro-dialogo-rodape" }, inserir),
      );
      const dialogo = abrirDialogo(c.doc, { titulo: "Inserir referência de documento do processo", largura: 600, conteudo: raiz });
      atualizar();
      filtro.focus({ preventScroll: true });
    }

    /** Insere a referencia de um documento no cursor. Devolve se havia o documento. */
    function insertCitacaoDocumento(id_protocolo: string, editor?: object): boolean {
      const ed = editor ?? A.getInstance();
      if (!ed) return false;
      const d = documentos().find((x) => x.id_protocolo === id_protocolo);
      if (!d?.documento) return false;
      const esc = w.textoParaHtmlPro ?? escaparHtml;
      const nrSei = d.nr_sei !== "" ? d.nr_sei : d.documento;
      const prefixo = w.getCitacaoDoc?.() ?? "SEI nº ";
      const ancora = `<span contenteditable="false" style="text-indent:0;"><a class="ancoraSei" id="lnkSei${esc(d.id_protocolo)}" style="text-indent:0;">${esc(nrSei)}</a></span>`;
      let html =
        d.nr_sei !== "" || w.getConfigValue?.("citacaodoc") === "citacaodoc_4"
          ? `${esc(d.documento.trim())}&nbsp;(${prefixo}${ancora})`
          : ancora;
      // CK5: o link vai no formato do plugin de links do SEI (no CK4 nada muda)
      if (w.htmlLinksProtocoloEditorPro) html = w.htmlLinksProtocoloEditorPro(html, ed);
      A.withEdit(ed, () => A.insertHtml(ed, html));
      return true;
    }

    return { getCitacaoDocumento, getDialogCitacaoDocumento, insertCitacaoDocumento };
  },
};
