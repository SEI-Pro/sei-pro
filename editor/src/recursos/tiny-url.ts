import { h } from "@comum/ui/dom";
import { abrirDialogo } from "../ui/abrir";
import { avisarEditor } from "../ui/avisar";
import { colunaDeFormulario, linhaDeCampo } from "../ui/formulario";
import { escaparHtml } from "../util/html";
import { urlHttpValida } from "../util/url";
import type { Contexto, Recurso } from "./tipos";

/**
 * Link curto do TinyURL (porte de `tiny-url.js` e do `ajaxTinyUrl` do monolito). O texto selecionado, se for
 * uma URL, ja preenche o campo; o nome personalizado so aceita letras, numeros e travessoes (>= 5 caracteres
 * no TinyURL). A resposta so e inserida se for um link do proprio TinyURL: nunca HTML nem esquema executavel.
 */
const ALIAS_VALIDO = /^[0-9A-Za-z-]+$/;
const MSG_ALIAS_FORMATO = "O nome personalizado deve conter apenas letras, números e travessões!";
const RESPOSTA_VALIDA = /^https?:\/\/tinyurl\.com\/[0-9A-Za-z-]+$/;

export const recurso: Recurso = {
  id: "tiny-url",
  globais(c: Contexto) {
    const avisar = (t: string) => avisarEditor(c.doc, t);
    const rede = (url: string) => (c.fetch ?? c.win.fetch.bind(c.win))(url);

    /** Pede o link curto; `modo` "insert" poe no documento, "setinput" entrega ao campo do QR Code. */
    async function encurtar(urlLonga: string, alias: string, modo: "insert" | "setinput", editor?: object): Promise<boolean> {
      const params = new URLSearchParams({ url: urlLonga });
      if (alias !== "") params.set("alias", alias);
      let resposta: Response;
      try {
        resposta = await rede(`https://tinyurl.com/api-create.php?${params}`);
      } catch {
        avisar("Erro: não foi possível gerar o link curto");
        return false;
      }
      if (resposta.status === 400) return (avisar("Erro: Nenhuma link gerado"), false);
      if (resposta.status === 422) return (avisar("Erro: O nome personalizado já existe. Insira outro."), false);
      const curto = (await resposta.text()).trim();
      if (resposta.status !== 200 || !RESPOSTA_VALIDA.test(curto)) return (avisar("Erro: Nenhuma link gerado"), false);
      if (modo === "setinput") {
        (c.win as unknown as { setInputTinyUrl?(u: string): void }).setInputTinyUrl?.(curto);
        return true;
      }
      const ed = editor ?? c.adaptador.getInstance();
      if (!ed) return false;
      const html = `<a href="${escaparHtml(curto)}" class="ancoraSei" target="_blank">${escaparHtml(curto)}</a>`;
      c.adaptador.withEdit(ed, () => c.adaptador.insertHtml(ed, html));
      return true;
    }

    function getTinyUrl(this_: Element | null): void {
      const edAberto = c.adaptador.getInstance(this_);
      if (!edAberto) return;
      const campoUrl = h("input", {
        type: "text",
        id: "urlTiny",
        placeholder: "https://exemplo.gov.br/endereco-muito-longo",
        autocomplete: "off",
      });
      const campoAlias = h("input", { type: "text", id: "aliasTiny", placeholder: "ex.: relatorio-2026", autocomplete: "off" });
      const resultado = h("p", { id: "tinyResult", class: "spro-dica" });
      const selecionado = String(c.win.getSelection?.() ?? "").trim();
      if (selecionado !== "" && urlHttpValida(selecionado)) campoUrl.value = selecionado;

      campoAlias.addEventListener("input", () => {
        resultado.replaceChildren();
        const alias = campoAlias.value;
        if (alias === "") return;
        if (ALIAS_VALIDO.test(alias)) resultado.append(`Resultado: https://tinyurl.com/${alias}`);
        else resultado.append(h("span", { class: "spro-erro" }, "O nome personalizado deve conter apenas letras, números e travessões."));
      });

      const dialogo = abrirDialogo(c.doc, {
        titulo: "Gerar link curto do TinyURL",
        conteudo: colunaDeFormulario(
          linhaDeCampo("Link que deseja encurtar", campoUrl),
          linhaDeCampo("Nome personalizado", campoAlias, {
            opcional: true,
            dica: "Letras, números e travessões, com 5 caracteres ou mais.",
          }),
          resultado,
          h(
            "div",
            { class: "spro-dialogo-rodape" },
            h(
              "button",
              {
                type: "button",
                class: "spro-botao primario",
                onclick: async () => {
                  const url = campoUrl.value.trim();
                  const alias = campoAlias.value.trim();
                  if (url === "" || !urlHttpValida(url)) return avisar("Digite um link válido!");
                  if (alias !== "" && !ALIAS_VALIDO.test(alias)) return avisar(MSG_ALIAS_FORMATO);
                  if (alias !== "" && alias.length < 5) return avisar("O nome personalizado deve ter mais de 4 (quatro) caracteres");
                  if (await encurtar(url, alias, "insert", edAberto)) dialogo.fechar();
                },
              },
              "Inserir",
            ),
          ),
        ),
      });
    }

    /** O global do legado: sem instancia, usa a que tem o foco. */
    const ajaxTinyUrl = (urlLonga: string, alias: string, modo: "insert" | "setinput") => encurtar(urlLonga, alias, modo);

    return { getTinyUrl, ajaxTinyUrl };
  },
};
