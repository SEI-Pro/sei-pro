import { criarAdaptador } from "../../src/adaptador";
import { recurso as latex } from "../../src/recursos/latex";
import type { Contexto } from "../../src/recursos/tipos";
import { clicar, dialogoAberto, digitar, tique, usarDocumento } from "../dialogo";
import { type CasoEditor, nosDoisEditores, primeiroP, selecionarTexto, ultimoInserido } from "../falsos";
import { checar, igual, secao } from "../util";

const BASE = "https://latex.codecogs.com/png.latex?";

type Conversao = { src: string; resolve: (v: string) => void; reject: (e: Error) => void };

function contexto(c: CasoEditor, conversoes: Conversao[]): Contexto {
  return {
    adaptador: criarAdaptador(c.win),
    doc: c.doc,
    win: c.win,
    base: "",
    checkOpcao: () => true,
    verifyOpcao: () => false,
    imagemParaDataUri: (src) => new Promise((resolve, reject) => conversoes.push({ src, resolve, reject })),
  };
}

const texto = (d: HTMLElement) => d.querySelector("#MathText") as HTMLTextAreaElement;
const img = (d: HTMLElement) => d.querySelector("#latexPreview img") as HTMLImageElement | null;

export async function verificarLatex(): Promise<void> {
  secao("recurso latex");
  await nosDoisEditores("latex", async (c: CasoEditor) => {
    usarDocumento(c.doc);
    const v = `[CK${c.versao}]`;
    const conversoes: Conversao[] = [];
    const g = latex.globais(contexto(c, conversoes)) as Record<string, (...a: unknown[]) => unknown>;
    igual(`latex ${v}: globais do contrato`, Object.keys(g).sort(), ["getDialogLatex", "openDialogLatex", "updatePreviewLatex"]);

    selecionarTexto(c, primeiroP(c), "x");
    (c.win as unknown as Record<string, unknown>).getSelection = () => "x^2";
    g.openDialogLatex(null);
    const d = dialogoAberto(c.doc) as HTMLElement;
    igual(
      `latex ${v}: dialogo Inserir Equacao com o texto selecionado na caixa`,
      [d.querySelector("h2")?.textContent, texto(d).value],
      ["Inserir Equação", "x^2"],
    );
    checar(`latex ${v}: sem botao Cancelar`, ![...d.querySelectorAll("button")].some((b) => /cancelar/i.test(b.textContent ?? "")));
    checar(
      `latex ${v}: os links de ajuda abrem em outra aba sem vazar o opener`,
      [...d.querySelectorAll("a")].length === 2 &&
        [...d.querySelectorAll("a")].every((a) => a.getAttribute("target") === "_blank" && /noopener/.test(a.getAttribute("rel") ?? "")),
    );
    igual(`latex ${v}: a selecao ja gera o preview (imagem remota enquanto converte)`, img(d)?.getAttribute("src"), `${BASE}x%5E2`);

    // digitar: preview com encodeURI e conversao para data URI
    digitar(texto(d), "\\frac{a}{b}");
    igual(`latex ${v}: preview usa encodeURI da formula`, img(d)?.getAttribute("src"), `${BASE}${encodeURI("\\frac{a}{b}")}`);
    const ultima = conversoes.at(-1) as Conversao;
    ultima.resolve("data:image/png;base64,FAKE");
    await tique();
    igual(
      `latex ${v}: depois de converter, o preview vira data URI`,
      [img(d)?.getAttribute("src"), img(d)?.getAttribute("class")],
      ["data:image/png;base64,FAKE", "img-base64"],
    );

    // resposta atrasada de uma digitacao antiga nao sobrescreve a atual
    conversoes.length = 0;
    digitar(texto(d), "a");
    digitar(texto(d), "ab");
    conversoes[1]?.resolve("data:image/png;base64,NOVA");
    await tique();
    conversoes[0]?.resolve("data:image/png;base64,VELHA");
    await tique();
    igual(`latex ${v}: conversao atrasada da digitacao antiga e ignorada`, img(d)?.getAttribute("src"), "data:image/png;base64,NOVA");

    // limpar apaga o preview
    digitar(texto(d), "");
    checar(`latex ${v}: formula vazia limpa o preview`, img(d) === null);

    // inserir sem formula
    c.doc.body.querySelector(".spro-aviso")?.remove();
    const antes = ultimoInserido(c);
    clicar(d, "Inserir");
    await tique();
    checar(`latex ${v}: sem formula avisa e nao insere`, ultimoInserido(c) === antes && /Digite a equa/.test(c.doc.body.textContent ?? ""));

    // inserir enquanto converte
    conversoes.length = 0;
    digitar(texto(d), "E=mc^2");
    c.doc.body.querySelector(".spro-aviso")?.remove();
    clicar(d, "Inserir");
    await tique();
    checar(
      `latex ${v}: antes de a imagem ficar pronta avisa e nao insere`,
      ultimoInserido(c) === antes && /Aguarde/.test(c.doc.body.textContent ?? ""),
    );

    // inserir pronto
    conversoes[0]?.resolve("data:image/png;base64,PRONTA");
    await tique();
    clicar(d, "Inserir");
    await tique();
    igual(
      `latex ${v}: insere a imagem com a formula no alt`,
      ultimoInserido(c),
      '<img class="img-base64" src="data:image/png;base64,PRONTA" alt="E=mc^2">',
    );
    checar(`latex ${v}: o dialogo fecha`, !dialogoAberto(c.doc));

    // formula hostil: o alt sai escapado
    (c.win as unknown as Record<string, unknown>).getSelection = () => '"><script>alert(1)</script>';
    conversoes.length = 0;
    g.openDialogLatex(null);
    const d2 = dialogoAberto(c.doc) as HTMLElement;
    conversoes[0]?.resolve("data:image/png;base64,H");
    await tique();
    clicar(d2, "Inserir");
    await tique();
    const html = ultimoInserido(c) ?? "";
    checar(
      `latex ${v}: formula com marcacao entra escapada no alt`,
      !html.includes("<script") && html.includes("&quot;&gt;&lt;script&gt;"),
      html,
    );

    // falha de conversao
    (c.win as unknown as Record<string, unknown>).getSelection = () => "";
    conversoes.length = 0;
    g.openDialogLatex(null);
    const d3 = dialogoAberto(c.doc) as HTMLElement;
    digitar(texto(d3), "z");
    conversoes[0]?.reject(new Error("CORS"));
    await tique();
    c.doc.body.querySelector(".spro-aviso")?.remove();
    const antes3 = ultimoInserido(c);
    clicar(d3, "Inserir");
    await tique();
    checar(
      `latex ${v}: se a imagem nao carregou avisa e nao insere`,
      ultimoInserido(c) === antes3 && /não foi possível/i.test(c.doc.body.textContent ?? ""),
    );
  });
}
