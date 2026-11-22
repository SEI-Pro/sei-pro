import { criarAdaptador } from "../../src/adaptador";
import { recurso as qrCode } from "../../src/recursos/qr-code";
import type { Contexto } from "../../src/recursos/tipos";
import { clicar, dialogoAberto, digitar, tique, usarDocumento } from "../dialogo";
import { type CasoEditor, nosDoisEditores, ultimoInserido } from "../falsos";
import { checar, igual, secao } from "../util";

type Fn = (...a: unknown[]) => unknown;

const ctxDe = (c: { win: Window; doc: Document }): Contexto => ({
  adaptador: criarAdaptador(c.win),
  doc: c.doc,
  win: c.win,
  base: "chrome-extension://abc/",
  checkOpcao: () => true,
  verifyOpcao: () => false,
});

const evento = (el: Element, tipo: string) =>
  el.dispatchEvent(new (el.ownerDocument.defaultView as unknown as { Event: typeof Event }).Event(tipo, { bubbles: true }));

/** O plugin jQuery do QR, falso: registra as opcoes e poe o <img> com data URI no alvo. */
function instalarQr(c: CasoEditor, chamadas: Array<Record<string, unknown>>, src = "data:image/png;base64,AAAA"): void {
  (c.win as unknown as Record<string, unknown>).jQuery = (alvo: Element) => ({
    qrcode: (o: Record<string, unknown>) => {
      chamadas.push(o);
      const img = c.doc.createElement("img");
      img.setAttribute("src", src);
      alvo.append(img);
    },
  });
}

export async function verificarQrCode(): Promise<void> {
  secao("recurso qr-code");
  await nosDoisEditores("qr-code", async (c: CasoEditor) => {
    usarDocumento(c.doc);
    const v = `[CK${c.versao}]`;
    const chamadas: Array<Record<string, unknown>> = [];
    instalarQr(c, chamadas);
    (c.win as unknown as Record<string, unknown>).NAMESPACE_SPRO = "SEI Pro";
    const g = qrCode.globais(ctxDe(c)) as Record<string, Fn>;
    igual(`qr-code ${v}: os 11 globais do contrato`, Object.keys(g).sort(), [
      "buildHtmlQrCodeLab",
      "convertTinyURL",
      "getDialogQrCode",
      "getQrCode",
      "openDialogQrCode",
      "resetOptionsQR",
      "setInputTinyUrl",
      "setQrCode",
      "tipQrCodeUrl",
      "toggleOptionsQR",
      "updateQrCode",
    ]);

    // abre com o texto selecionado e gera a previa com as opcoes do legado
    (c.win as unknown as Record<string, unknown>).getSelection = () => "https://exemplo.gov.br/x";
    g.getQrCode(null);
    const d = dialogoAberto(c.doc) as HTMLElement;
    igual(
      `qr-code ${v}: o texto selecionado preenche o campo`,
      (d.querySelector("#qrCodeText") as HTMLInputElement).value,
      "https://exemplo.gov.br/x",
    );
    igual(`qr-code ${v}: a previa chama a biblioteca com as opcoes padrao do legado`, chamadas.at(-1), {
      render: "image",
      ecLevel: "L",
      minVersion: 6,
      fill: "#333333",
      background: "#ffffff",
      text: "https://exemplo.gov.br/x",
      size: 140,
      radius: 0.5,
      quiet: 1,
      mode: 0,
      mSize: 0.2,
      mPosX: 0.5,
      mPosY: 0.5,
      label: "SEI Pro",
      fontname: "Arial",
      fontcolor: "#ff9818",
      image: d.querySelector("#QrPro-img-buffer"),
    });
    checar(`qr-code ${v}: sem botao Cancelar`, ![...d.querySelectorAll("button")].some((b) => /cancelar/i.test(b.textContent ?? "")));
    igual(
      `qr-code ${v}: os rotulos mostram o valor atual`,
      [d.querySelector('label[for="QrPro-size"]')?.textContent, d.querySelector('label[for="QrPro-quiet"]')?.textContent],
      ["Tamanho do QR: 140px", "Margens de folga: 1 módulos"],
    );

    // digitar atualiza a previa
    const antes = chamadas.length;
    digitar(d.querySelector("#qrCodeText") as HTMLInputElement, "outro texto");
    igual(`qr-code ${v}: digitar regera o QR com o texto novo`, [chamadas.length - antes, chamadas.at(-1)?.text], [1, "outro texto"]);
    checar(`qr-code ${v}: a previa tem a imagem`, !!d.querySelector("#qrCodeResult img"));

    // "Opcoes avancadas" e "Resetar" clicam DE VERDADE (regressao de 11/09/2026)
    const painel = d.querySelector("#optionsQrAdvanced") as HTMLElement;
    igual(`qr-code ${v}: o painel comeca fechado`, painel.style.display, "none");
    evento(d.querySelector("#toggleOptionsQR") as Element, "click");
    igual(`qr-code ${v}: clicar em Opcoes avancadas abre o painel`, painel.style.display, "");
    evento(d.querySelector("#toggleOptionsQR") as Element, "click");
    igual(`qr-code ${v}: clicar de novo fecha`, painel.style.display, "none");
    const tamanho = d.querySelector("#QrPro-size") as HTMLInputElement;
    tamanho.value = "300";
    evento(tamanho, "input");
    igual(`qr-code ${v}: mudar o tamanho regera com 300`, chamadas.at(-1)?.size, 300);
    evento(d.querySelector("#QrPro-reset") as Element, "click");
    igual(`qr-code ${v}: clicar em Resetar volta ao padrao (140) e regera`, [tamanho.value, chamadas.at(-1)?.size], ["140", 140]);
    // modo com imagem/etiqueta mostra as linhas certas
    const modo = d.querySelector("#QrPro-mode") as HTMLSelectElement;
    modo.value = "1";
    evento(modo, "change");
    const visivel = (sel: string) => [...d.querySelectorAll<HTMLElement>(sel)].every((e) => e.style.display !== "none");
    igual(
      `qr-code ${v}: modo etiqueta mostra os campos da etiqueta e esconde os da imagem`,
      [
        visivel(".QrMode-etiqueta"),
        [...d.querySelectorAll<HTMLElement>(".QrMode-imagem:not(.QrMode-etiqueta)")].every((e) => e.style.display === "none"),
      ],
      [true, true],
    );
    modo.value = "0";
    evento(modo, "change");

    // texto vazio nao insere
    digitar(d.querySelector("#qrCodeText") as HTMLInputElement, "   ");
    clicar(d, "Inserir");
    checar(
      `qr-code ${v}: texto vazio avisa e mantem o dialogo`,
      !!dialogoAberto(c.doc) && /Digite o texto a codificar/.test(c.doc.body.textContent ?? "") && ultimoInserido(c) === null,
    );
    c.doc.body.querySelector(".spro-aviso")?.remove();

    // inserir: imagem data URI com alt escapado
    digitar(d.querySelector("#qrCodeText") as HTMLInputElement, 'a"<b>&');
    clicar(d, "Inserir");
    igual(
      `qr-code ${v}: Inserir poe a imagem (data URI) com o texto ESCAPADO no alt`,
      ultimoInserido(c),
      '<img src="data:image/png;base64,AAAA" alt="a&quot;&lt;b&gt;&amp;">',
    );
    checar(`qr-code ${v}: o dialogo fecha`, !dialogoAberto(c.doc));
  });

  await nosDoisEditores("qr-code sem biblioteca e link curto", async (c: CasoEditor) => {
    usarDocumento(c.doc);
    const v = `[CK${c.versao}]`;
    const g = qrCode.globais(ctxDe(c)) as Record<string, Fn>;
    // biblioteca ausente: avisa e nao insere
    g.getQrCode(null);
    let d = dialogoAberto(c.doc) as HTMLElement;
    digitar(d.querySelector("#qrCodeText") as HTMLInputElement, "texto");
    checar(
      `qr-code ${v}: sem a biblioteca avisa que nao foi possivel gerar`,
      /Não foi possível gerar o QR/.test(c.doc.body.textContent ?? ""),
    );
    c.doc.body.querySelector(".spro-aviso")?.remove();
    clicar(d, "Inserir");
    checar(`qr-code ${v}: sem imagem gerada nao insere nada`, ultimoInserido(c) === null);
    (d.closest("dialog") as HTMLDialogElement | null)?.close();
    c.doc.body.querySelector(".spro-aviso")?.remove();

    // uma imagem que nao e data URI nunca entra no documento
    instalarQr(c, [], "javascript:alert(1)");
    g.getQrCode(null);
    d = dialogoAberto(c.doc) as HTMLElement;
    digitar(d.querySelector("#qrCodeText") as HTMLInputElement, "texto");
    clicar(d, "Inserir");
    checar(`qr-code ${v}: src que nao e data:image e recusado`, ultimoInserido(c) === null);
    (d.closest("dialog") as HTMLDialogElement | null)?.close();
    c.doc.body.querySelector(".spro-aviso")?.remove();

    // dica do link curto (URL > 50 caracteres) e conversao
    const chamadas: Array<Record<string, unknown>> = [];
    instalarQr(c, chamadas);
    const longa = `https://exemplo.gov.br/${"a".repeat(60)}`;
    g.getQrCode(null);
    d = dialogoAberto(c.doc) as HTMLElement;
    const campo = d.querySelector("#qrCodeText") as HTMLInputElement;
    digitar(campo, "https://curta.gov.br/x");
    checar(`qr-code ${v}: URL curta nao mostra a dica`, !d.querySelector("#tipQrCodeUrl"));
    digitar(campo, longa);
    checar(`qr-code ${v}: URL longa mostra a dica do link curto`, !!d.querySelector("#tipQrCodeUrl a"));
    const pedidos: unknown[][] = [];
    (c.win as unknown as Record<string, unknown>).ajaxTinyUrl = (...a: unknown[]) => {
      pedidos.push(a);
      return Promise.reject(new TypeError("Failed to fetch"));
    };
    evento(d.querySelector("#tipQrCodeUrl a") as Element, "click");
    await tique();
    igual(`qr-code ${v}: clicar na dica chama ajaxTinyUrl(url, "", "setinput")`, pedidos, [[longa, "", "setinput"]]);
    checar(
      `qr-code ${v}: rede bloqueada (CORS) avisa o erro e deixa o texto como esta`,
      /Erro: não foi possível gerar o link curto/.test(c.doc.body.textContent ?? "") && campo.value === longa,
    );
    c.doc.body.querySelector(".spro-aviso")?.remove();
    // sem o global do TinyURL
    (c.win as unknown as Record<string, unknown>).ajaxTinyUrl = undefined;
    g.convertTinyURL();
    checar(
      `qr-code ${v}: sem ajaxTinyUrl avisa que o servico nao esta disponivel`,
      /link curto não está disponível/.test(c.doc.body.textContent ?? ""),
    );
    // a conversao chegou: troca o campo e regera
    const antes = chamadas.length;
    g.setInputTinyUrl("https://tinyurl.com/abc");
    igual(
      `qr-code ${v}: setInputTinyUrl troca o texto e regera o QR`,
      [campo.value, chamadas.length - antes, chamadas.at(-1)?.text],
      ["https://tinyurl.com/abc", 1, "https://tinyurl.com/abc"],
    );
  });
}
