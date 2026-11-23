import { h } from "@comum/ui/dom";
import { abrirDialogo } from "../ui/abrir";
import { avisarEditor } from "../ui/avisar";
import {
  atualizarValor,
  botaoTexto,
  caixa,
  corCampo,
  formulario,
  grade,
  grupo,
  intervalo,
  painel,
  previa,
  sincronizarControles,
} from "../ui/formulario";
import { escaparHtml } from "../util/html";
import { gerarQr, type OpcoesQr } from "../util/qr";
import { urlHttpValida } from "../util/url";
import type { Contexto, Recurso } from "./tipos";

/**
 * Codigo QR (porte de `qr-code.js`): o dialogo tem o texto, um painel de opcoes avancadas e a previa ao vivo; Inserir
 * poe a imagem (data URI) no documento com o texto no `alt`. A biblioteca do QR fica atras de `util/qr.ts`. O link
 * curto do TinyURL (dica para textos longos) entra pelo global `ajaxTinyUrl`; se a rede falhar o erro e avisado e o
 * texto fica como esta. "Opcoes avancadas" e "Resetar" sao links que clicam de verdade (nada de `data-spro-click`).
 */
const PADROES: Record<string, string> = {
  "QrPro-size": "140",
  "QrPro-fill": "#333333",
  "QrPro-background": "#ffffff",
  "QrPro-minversion": "6",
  "QrPro-eclevel": "L",
  "QrPro-quiet": "1",
  "QrPro-radius": "50",
  "QrPro-mode": "0",
  "QrPro-msize": "20",
  "QrPro-mposx": "50",
  "QrPro-mposy": "50",
  "QrPro-font": "Arial",
  "QrPro-fontcolor": "#ff9818",
};
/** Campos cujo rotulo mostra o valor atual (`Tamanho do QR: 140px`). */
const ROTULOS: Array<[string, string]> = [
  ["QrPro-size", " px"],
  ["QrPro-minversion", ""],
  ["QrPro-quiet", "módulo"],
  ["QrPro-radius", "%"],
  ["QrPro-msize", "%"],
  ["QrPro-mposx", "%"],
  ["QrPro-mposy", "%"],
];
const FONTES = ["Arial", "Helvetica", "Times", "Times New Roman", "Courier", "Courier New", "Verdana", "Tahoma", "Impact"];
const MODOS: Array<[string, string]> = [
  ["0", "Normal"],
  ["1", "Etiqueta em faixa"],
  ["2", "Etiqueta em caixa"],
  ["3", "Imagem em faixa"],
  ["4", "Imagem em caixa"],
];
const NIVEIS: Array<[string, string]> = [
  ["L", "Baixo (7%)"],
  ["M", "Médio (15%)"],
  ["Q", "1/4 (25%)"],
  ["H", "Alto (30%)"],
];

export const recurso: Recurso = {
  id: "qr-code",
  globais(c: Contexto) {
    const A = c.adaptador;
    const avisar = (t: string) => avisarEditor(c.doc, t);
    const q = <T extends Element>(sel: string) => c.doc.querySelector<T>(sel);
    const valor = (id: string) => q<HTMLInputElement>(`#${id}`)?.value ?? "";
    const nomeDaMarca = () => (c.win as unknown as { NAMESPACE_SPRO?: string }).NAMESPACE_SPRO ?? "SEI Pro";
    const iconePadrao = () => `${c.base}icons/menu/seipro.png`;

    const faixa = (id: string, min: number, max: number, passo: number) =>
      intervalo({ id, min, max, step: passo, value: PADROES[id] ?? "" });
    const subtitulo = (texto: string) => h("p", { class: "spro-subtitulo" }, texto);

    /** A previa, o botao das opcoes avancadas e o painel delas. Devolve o elemento (o legado devolvia o HTML). */
    function buildHtmlQrCodeLab(): HTMLElement {
      const opcoes = painel(
        { id: "optionsQrAdvanced", style: "display:none;" },
        subtitulo("Tamanho e margens"),
        grade(
          "duas",
          grupo("Tamanho do QR", { para: "QrPro-size", valor: "140 px" }, faixa("QrPro-size", 100, 500, 50)),
          grupo("Versão", { para: "QrPro-minversion", valor: "6" }, faixa("QrPro-minversion", 1, 10, 1)),
          grupo("Margem de folga", { para: "QrPro-quiet", valor: "1 módulo" }, faixa("QrPro-quiet", 0, 4, 1)),
          grupo("Raio de canto", { para: "QrPro-radius", valor: "50%" }, faixa("QrPro-radius", 0, 50, 10)),
        ),
        subtitulo("Cores"),
        grade(
          "duas",
          grupo("Preenchimento", { para: "QrPro-fill" }, corCampo({ id: "QrPro-fill", value: PADROES["QrPro-fill"] ?? "" })),
          grupo(
            "Fundo",
            { para: "QrPro-background" },
            corCampo({ id: "QrPro-background", value: PADROES["QrPro-background"] ?? "" }),
            caixa({ id: "QrPro-background-transparent" }, "Fundo transparente"),
          ),
        ),
        subtitulo("Correção e modo"),
        grade(
          "duas",
          grupo(
            "Correção de erros",
            { para: "QrPro-eclevel" },
            h("select", { id: "QrPro-eclevel" }, ...NIVEIS.map(([v, t]) => h("option", { value: v }, t))),
          ),
          grupo("Modo", { para: "QrPro-mode" }, h("select", { id: "QrPro-mode" }, ...MODOS.map(([v, t]) => h("option", { value: v }, t)))),
        ),
        h(
          "div",
          { class: "QrMode-etiqueta QrMode-imagem", style: "display:none;" },
          grade(
            "tres",
            grupo("Tamanho da etiqueta", { para: "QrPro-msize", valor: "20%" }, faixa("QrPro-msize", 0, 40, 1)),
            grupo("Posição X", { para: "QrPro-mposx", valor: "50%" }, faixa("QrPro-mposx", 0, 100, 1)),
            grupo("Posição Y", { para: "QrPro-mposy", valor: "50%" }, faixa("QrPro-mposy", 0, 100, 1)),
          ),
        ),
        h(
          "div",
          { class: "QrMode-etiqueta", style: "display:none;" },
          grade(
            "tres",
            grupo(
              "Nome da fonte",
              { para: "QrPro-font" },
              h("select", { id: "QrPro-font" }, ...FONTES.map((f) => h("option", { value: f }, f))),
            ),
            grupo(
              "Cor da fonte",
              { para: "QrPro-fontcolor" },
              corCampo({ id: "QrPro-fontcolor", value: PADROES["QrPro-fontcolor"] ?? "" }),
            ),
            grupo("Etiqueta", { para: "QrPro-label" }, h("input", { id: "QrPro-label", type: "text", value: nomeDaMarca() })),
          ),
        ),
        h(
          "div",
          { class: "QrMode-imagem", style: "display:none;" },
          grupo(
            "Imagem",
            { para: "QrPro-image", dica: "A imagem entra no QR conforme o modo escolhido." },
            h("input", { id: "QrPro-image", type: "file", accept: "image/*" }),
          ),
          h("img", { id: "QrPro-img-buffer", style: "display:none", src: iconePadrao(), alt: "" }),
        ),
      );
      const reiniciar = botaoTexto("Restaurar padrões", () => resetOptionsQR(), { id: "QrPro-reset" });
      reiniciar.style.display = "none";
      return h(
        "div",
        { id: "qrCodeLab", class: "spro-form spro-lateral" },
        previa({ id: "qrCodeResult" }, { vazio: "A prévia do QR aparece aqui", xadrez: false }),
        h(
          "div",
          { class: "spro-barra" },
          botaoTexto("Opções avançadas", () => toggleOptionsQR(), { id: "toggleOptionsQR", expansivel: true }),
          reiniciar,
        ),
        opcoes,
      );
    }

    function toggleOptionsQR(): void {
      const aberto = q<HTMLElement>("#optionsQrAdvanced");
      if (!aberto) return;
      aberto.style.display = aberto.style.display === "none" ? "" : "none";
      const lab = q("#qrCodeLab");
      if (aberto.style.display === "") lab?.setAttribute("data-aberto", "");
      else lab?.removeAttribute("data-aberto");
      const reiniciar = q<HTMLElement>("#QrPro-reset");
      if (reiniciar) reiniciar.style.display = aberto.style.display;
    }

    function resetOptionsQR(): void {
      for (const [id, padrao] of Object.entries(PADROES)) {
        const campo = q<HTMLInputElement>(`#${id}`);
        if (campo) campo.value = padrao;
      }
      const rotuloQr = q<HTMLInputElement>("#QrPro-label");
      if (rotuloQr) rotuloQr.value = nomeDaMarca();
      const transparente = q<HTMLInputElement>("#QrPro-background-transparent");
      if (transparente) {
        transparente.checked = false;
        transparente.removeAttribute("checked");
      }
      q<HTMLImageElement>("#QrPro-img-buffer")?.setAttribute("src", iconePadrao());
      const lab = q("#qrCodeLab");
      if (lab) sincronizarControles(lab);
      updateQrCode();
    }

    /** A dica do link curto: so para URL http(s) com mais de 50 caracteres. */
    function tipQrCodeUrl(texto: string): void {
      q("#tipQrCodeUrl")?.remove();
      const ancora = q("#qrCodeResult");
      if (texto === "" || !urlHttpValida(texto) || texto.length <= 50 || !ancora) return;
      const dica = h(
        "div",
        { id: "tipQrCodeUrl", class: "spro-aviso-inline" },
        h("span", {}, "Endereço longo deixa o QR denso e difícil de ler."),
        botaoTexto("Gerar link curto", () => convertTinyURL()),
      );
      ancora.before(dica);
    }

    function setInputTinyUrl(url: string): void {
      const campo = q<HTMLInputElement>("#qrCodeText");
      if (campo) campo.value = url;
      updateQrCode();
    }

    /** Pede o link curto ao TinyURL (global `ajaxTinyUrl`); em erro (CORS, rede) o recurso do TinyURL avisa e o texto fica como esta. */
    function convertTinyURL(): void {
      const url = valor("qrCodeText").trim();
      const ajax = (c.win as unknown as { ajaxTinyUrl?: (u: string, a: string, m: string) => unknown }).ajaxTinyUrl;
      if (typeof ajax !== "function") {
        avisar("O serviço de link curto não está disponível.");
        return;
      }
      void Promise.resolve(ajax(url, "", "setinput")).catch(() => avisar("Erro: não foi possível gerar o link curto"));
    }

    function atualizarRotulos(): void {
      const raiz = q("#qrCodeLab");
      if (!raiz) return;
      for (const [id, unidade] of ROTULOS) {
        const v = valor(id);
        atualizarValor(raiz, id, unidade === "módulo" ? `${v} ${v === "1" ? "módulo" : "módulos"}` : `${v}${unidade}`);
      }
    }

    function opcoesAtuais(texto: string): OpcoesQr {
      const inteiro = (id: string) => Number.parseInt(valor(id), 10);
      return {
        render: "image",
        ecLevel: valor("QrPro-eclevel"),
        minVersion: inteiro("QrPro-minversion"),
        fill: valor("QrPro-fill"),
        background: q("#QrPro-background-transparent:checked") ? null : valor("QrPro-background"),
        text: texto,
        size: inteiro("QrPro-size"),
        radius: inteiro("QrPro-radius") * 0.01,
        quiet: inteiro("QrPro-quiet"),
        mode: inteiro("QrPro-mode"),
        mSize: inteiro("QrPro-msize") * 0.01,
        mPosX: inteiro("QrPro-mposx") * 0.01,
        mPosY: inteiro("QrPro-mposy") * 0.01,
        label: valor("QrPro-label"),
        fontname: valor("QrPro-font"),
        fontcolor: valor("QrPro-fontcolor"),
        image: q<HTMLImageElement>("#QrPro-img-buffer"),
      };
    }

    function updateQrCode(): void {
      const resultado = q<HTMLElement>("#qrCodeResult");
      if (!resultado) return;
      resultado.replaceChildren();
      resultado.classList.toggle("xadrez", q("#QrPro-background-transparent:checked") !== null);
      for (const el of c.doc.querySelectorAll<HTMLElement>(".QrMode-etiqueta, .QrMode-imagem")) el.style.display = "none";
      atualizarRotulos();
      const modo = valor("QrPro-mode");
      if (modo === "1" || modo === "2") for (const el of c.doc.querySelectorAll<HTMLElement>(".QrMode-etiqueta")) el.style.display = "";
      else if (modo === "3" || modo === "4") for (const el of c.doc.querySelectorAll<HTMLElement>(".QrMode-imagem")) el.style.display = "";
      const texto = valor("qrCodeText");
      if (texto !== "" && !gerarQr(c.win, resultado, opcoesAtuais(texto))) avisar("Não foi possível gerar o QR Code para este texto.");
      tipQrCodeUrl(texto);
    }

    /** Insere no documento a imagem que a previa gerou (data URI), com o texto no `alt`. */
    function setQrCode(texto: string, editor?: object): boolean {
      const ed = editor ?? A.getInstance();
      if (!ed) return false;
      const src = q<HTMLImageElement>("#qrCodeResult img")?.getAttribute("src") ?? "";
      if (!/^data:image\/(png|jpeg|gif|webp);base64,/i.test(src)) {
        avisar("Não foi possível gerar o QR Code para este texto.");
        return false;
      }
      // secao somente leitura: o adaptador recusa (e avisa); o dialogo continua aberto para o texto nao se perder
      if (A.somenteLeitura(ed)) {
        A.recusarEscrita();
        return false;
      }
      A.withEdit(ed, () => A.insertHtml(ed, `<img src="${escaparHtml(src)}" alt="${escaparHtml(texto)}">`));
      return true;
    }

    function openDialogQrCode(editor?: object): void {
      const ed = editor ?? A.getInstance();
      if (!ed) return;
      const campo = h("input", { type: "text", id: "qrCodeText", placeholder: "Endereço, texto ou qualquer dado", autocomplete: "off" });
      // CK4: a selecao do texto esta no iframe da secao, nao na janela da pagina
      const selecionado = (A.getSelectedText(ed) || String(c.win.getSelection?.() ?? "")).trim();
      if (selecionado) campo.value = selecionado;
      campo.addEventListener("input", () => updateQrCode());
      campo.addEventListener("change", () => updateQrCode());
      const lab = buildHtmlQrCodeLab();
      for (const e of ["input", "change"]) lab.querySelector("#optionsQrAdvanced")?.addEventListener(e, () => updateQrCode());
      lab.querySelector<HTMLInputElement>("#QrPro-image")?.addEventListener("change", (ev) => {
        const arquivo = (ev.target as HTMLInputElement).files?.[0];
        if (!arquivo) return;
        const leitor = new FileReader();
        leitor.onload = () => {
          const url = String(leitor.result ?? "");
          if (!/^data:image\//i.test(url)) {
            avisar("Escolha um arquivo de imagem.");
            return;
          }
          q<HTMLImageElement>("#QrPro-img-buffer")?.setAttribute("src", url);
          const modo = q<HTMLSelectElement>("#QrPro-mode");
          if (modo) modo.value = "4";
          setTimeout(updateQrCode, 200);
        };
        leitor.readAsDataURL(arquivo);
      });
      const dialogo = abrirDialogo(c.doc, {
        titulo: "Gerar Código QR",
        largura: 760,
        conteudo: formulario(
          grupo("Texto a codificar", { para: "qrCodeText" }, campo),
          lab,
          h(
            "div",
            { class: "spro-dialogo-rodape" },
            h(
              "button",
              {
                type: "button",
                class: "spro-botao primario",
                onclick: () => {
                  const texto = campo.value.trim();
                  if (!texto) {
                    avisar("Digite o texto a codificar");
                    return;
                  }
                  if (setQrCode(texto, ed)) dialogo.fechar();
                },
              },
              "Inserir",
            ),
          ),
        ),
      });
      if (selecionado) updateQrCode();
    }

    return {
      getQrCode(this_: Element | null): void {
        const ed = A.getInstance(this_);
        if (ed) openDialogQrCode(ed);
      },
      /** Compat com o `initFunctions` do legado: o dialogo agora abre sob demanda. */
      getDialogQrCode: () => {},
      openDialogQrCode,
      buildHtmlQrCodeLab,
      resetOptionsQR,
      toggleOptionsQR,
      tipQrCodeUrl,
      setInputTinyUrl,
      convertTinyURL,
      updateQrCode,
      setQrCode,
    };
  },
};
