import { h } from "@comum/ui/dom";
import { abrirDialogo } from "../ui/abrir";
import { avisarEditor } from "../ui/avisar";
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
  ["QrPro-size", "px"],
  ["QrPro-minversion", ""],
  ["QrPro-quiet", " módulos"],
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

    const rotulo = (texto: string, id: string, controle: HTMLElement) =>
      h("div", { style: "display:grid;gap:2px;" }, h("label", { for: id }, texto), controle);
    const faixa = (id: string, min: number, max: number, passo: number) =>
      h("input", { id, type: "range", value: PADROES[id] ?? "", min: String(min), max: String(max), step: String(passo) });

    /** O painel de opcoes avancadas + a previa. Devolve o elemento (o legado devolvia o HTML). */
    function buildHtmlQrCodeLab(): HTMLElement {
      const opcoes = h(
        "div",
        { id: "optionsQrAdvanced", style: "display:none;" },
        h(
          "div",
          { style: "display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px 14px;font-size:12px;" },
          rotulo("Tamanho do QR: 140px", "QrPro-size", faixa("QrPro-size", 100, 500, 50)),
          rotulo("Cor de Preenchimento", "QrPro-fill", h("input", { id: "QrPro-fill", type: "color", value: PADROES["QrPro-fill"] ?? "" })),
          rotulo(
            "Cor de Fundo",
            "QrPro-background",
            h(
              "div",
              {},
              h("input", { id: "QrPro-background", type: "color", value: PADROES["QrPro-background"] ?? "" }),
              h(
                "label",
                { style: "margin-left:12px;" },
                h("input", { id: "QrPro-background-transparent", type: "checkbox" }),
                " Transparente",
              ),
            ),
          ),
          rotulo("Versão: 6", "QrPro-minversion", faixa("QrPro-minversion", 1, 10, 1)),
          rotulo(
            "Nível de correção de erros",
            "QrPro-eclevel",
            h("select", { id: "QrPro-eclevel" }, ...NIVEIS.map(([v, t]) => h("option", { value: v }, t))),
          ),
          rotulo("Margens de folga: 1 módulos", "QrPro-quiet", faixa("QrPro-quiet", 0, 4, 1)),
          rotulo("Raio de canto: 50%", "QrPro-radius", faixa("QrPro-radius", 0, 50, 10)),
          rotulo("Modo", "QrPro-mode", h("select", { id: "QrPro-mode" }, ...MODOS.map(([v, t]) => h("option", { value: v }, t)))),
          h("div"),
          h(
            "div",
            { class: "QrMode-etiqueta QrMode-imagem", style: "display:none;grid-column:1 / span 3;" },
            h(
              "div",
              { style: "display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px 14px;" },
              rotulo("Tamanho da etiqueta: 20%", "QrPro-msize", faixa("QrPro-msize", 0, 40, 1)),
              rotulo("Posição X: 50%", "QrPro-mposx", faixa("QrPro-mposx", 0, 100, 1)),
              rotulo("Posição Y: 50%", "QrPro-mposy", faixa("QrPro-mposy", 0, 100, 1)),
            ),
          ),
          h(
            "div",
            { class: "QrMode-etiqueta", style: "display:none;grid-column:1 / span 3;" },
            h(
              "div",
              { style: "display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px 14px;" },
              rotulo("Nome da fonte", "QrPro-font", h("select", { id: "QrPro-font" }, ...FONTES.map((f) => h("option", { value: f }, f)))),
              rotulo(
                "Cor da fonte",
                "QrPro-fontcolor",
                h("input", { id: "QrPro-fontcolor", type: "color", value: PADROES["QrPro-fontcolor"] ?? "" }),
              ),
              rotulo("Etiqueta", "QrPro-label", h("input", { id: "QrPro-label", type: "text", value: nomeDaMarca() })),
            ),
          ),
          h(
            "div",
            { class: "QrMode-imagem", style: "display:none;grid-column:1 / span 3;" },
            rotulo("Imagem", "QrPro-image", h("input", { id: "QrPro-image", type: "file", accept: "image/*" })),
            h("img", { id: "QrPro-img-buffer", style: "display:none", src: iconePadrao(), alt: "" }),
          ),
        ),
        h(
          "a",
          {
            id: "QrPro-reset",
            class: "linkDialog",
            role: "button",
            tabindex: "0",
            style: "margin-top:14px;display:block;cursor:pointer;",
            onclick: () => resetOptionsQR(),
          },
          "Resetar configurações",
        ),
      );
      return h(
        "div",
        { id: "qrCodeLab" },
        h(
          "div",
          { style: "text-align:right;" },
          h(
            "a",
            {
              id: "toggleOptionsQR",
              class: "linkDialog",
              role: "button",
              tabindex: "0",
              style: "cursor:pointer;color:inherit;text-decoration:underline;",
              onclick: () => toggleOptionsQR(),
            },
            "Opções avançadas ",
          ),
        ),
        h(
          "div",
          { style: "display:grid;gap:10px;" },
          opcoes,
          h("div", { id: "qrCodeResult", style: "text-align:center;margin:10px 0;min-width:180px;" }),
        ),
      );
    }

    function toggleOptionsQR(): void {
      const painel = q<HTMLElement>("#optionsQrAdvanced");
      if (!painel) return;
      painel.style.display = painel.style.display === "none" ? "" : "none";
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
      updateQrCode();
    }

    /** A dica do link curto: so para URL http(s) com mais de 50 caracteres. */
    function tipQrCodeUrl(texto: string): void {
      q("#tipQrCodeUrl")?.remove();
      const ancora = q("#toggleOptionsQR");
      if (texto === "" || !urlHttpValida(texto) || texto.length <= 50 || !ancora) return;
      const estiloDoIcone = q(".getTinyUrlButtom span")?.getAttribute("style") ?? "";
      const dica = h(
        "span",
        {
          id: "tipQrCodeUrl",
          style: "display:block;margin-bottom:8px;padding:5px 8px 8px 8px;background:#f9f9dc;color:#333;border-radius:5px;",
        },
        "Dica: Experimente ",
        h(
          "a",
          {
            class: "linkDialog",
            role: "button",
            tabindex: "0",
            style: "cursor:pointer;color:inherit;text-decoration:underline;",
            onclick: () => convertTinyURL(),
          },
          h("span", { style: `width:16px;height:16px;display:inline-block;${estiloDoIcone}` }),
          "Gerar link curto do TinyURL",
        ),
      );
      (ancora.parentElement ?? ancora).before(dica);
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
      if (typeof ajax !== "function") return avisar("O serviço de link curto não está disponível.");
      void Promise.resolve(ajax(url, "", "setinput")).catch(() => avisar("Erro: não foi possível gerar o link curto"));
    }

    function atualizarRotulos(): void {
      for (const [id, unidade] of ROTULOS) {
        const r = q<HTMLElement>(`label[for="${id}"]`);
        if (r) r.textContent = (r.textContent ?? "").replace(/:.*/, `: ${valor(id)}${unidade}`);
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
    function setQrCode(texto: string, editor?: object): void {
      const ed = editor ?? A.getInstance();
      if (!ed) return;
      const src = q<HTMLImageElement>("#qrCodeResult img")?.getAttribute("src") ?? "";
      if (!/^data:image\/(png|jpeg|gif|webp);base64,/i.test(src)) return avisar("Não foi possível gerar o QR Code para este texto.");
      A.withEdit(ed, () => A.insertHtml(ed, `<img src="${escaparHtml(src)}" alt="${escaparHtml(texto)}">`));
    }

    function openDialogQrCode(editor?: object): void {
      const ed = editor ?? A.getInstance();
      if (!ed) return;
      const campo = h("input", { type: "text", id: "qrCodeText", style: "width:100%;box-sizing:border-box;margin:6px 0 10px 0;" });
      const selecionado = String(c.win.getSelection?.() ?? "").trim();
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
          if (!/^data:image\//i.test(url)) return avisar("Escolha um arquivo de imagem.");
          q<HTMLImageElement>("#QrPro-img-buffer")?.setAttribute("src", url);
          const modo = q<HTMLSelectElement>("#QrPro-mode");
          if (modo) modo.value = "4";
          setTimeout(updateQrCode, 200);
        };
        leitor.readAsDataURL(arquivo);
      });
      const dialogo = abrirDialogo(c.doc, {
        titulo: "Gerar Código QR",
        conteudo: h(
          "div",
          { style: "min-width:560px;max-width:100%;font-size:13px;" },
          h("label", { for: "qrCodeText" }, "Insira o texto que deseja codificar:"),
          campo,
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
                  if (!texto) return avisar("Digite o texto a codificar");
                  setQrCode(texto, ed);
                  dialogo.fechar();
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
