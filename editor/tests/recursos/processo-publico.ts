import { criarAdaptador } from "../../src/adaptador";
import { lerDocumentosPublicos, recurso as processoPublico } from "../../src/recursos/processo-publico";
import type { Contexto } from "../../src/recursos/tipos";
import { clicar, dialogoAberto, usarDocumento } from "../dialogo";
import { type CasoEditor, nosDoisEditores, ultimoInserido } from "../falsos";
import { checar, igual, instalarDom, secao, tique } from "../util";

type Fn = (...a: unknown[]) => unknown;

const PAGINA = `<html><body>
<table id="tblCabecalho"><tr class="infraTrClara"><td>Processo:</td><td>50300.000001/2024-00</td></tr></table>
<table id="tblDocumentos">
<tr class="infraTrClara"><td>1</td><td>111</td><td>Parecer <b>&</b> Nota</td><td><a class="ancoraPadraoAzul" onclick="abrir('md_doc.php?id=1&x=2')">ver</a></td></tr>
<tr class="infraTrClara"><td>2</td><td>222</td><td>Oficio</td><td></td></tr>
</table></body></html>`;

export async function verificarProcessoPublico(): Promise<void> {
  secao("recurso processo-publico");
  const doc = instalarDom();
  const Parser = (doc.defaultView as unknown as { DOMParser: typeof DOMParser }).DOMParser;
  const itens = lerDocumentosPublicos(
    new Parser().parseFromString(PAGINA, "text/html"),
    "https://sei.x",
    "https://sei.x/sei/modulos/pesquisa/md_proc.php?a=1&b=2",
    "SEI nº ",
  );
  igual(
    "lerDocumentosPublicos: um item por documento e o processo por ultimo",
    itens.map((i) => i.rotulo),
    ["Parecer & Nota (SEI nº 111)", "Oficio (SEI nº 222) [documento restrito]", "50300.000001/2024-00 (o processo)"],
  );
  igual(
    "lerDocumentosPublicos: documento publico vira link com o endereco absoluto, texto escapado",
    itens[0]?.html,
    '<a class="ancoraSei" href="https://sei.x/sei/modulos/pesquisa/md_doc.php?id=1&amp;x=2" target="_blank">Parecer &amp; Nota&nbsp;(SEI nº 111)</a>',
  );
  igual(
    "lerDocumentosPublicos: documento restrito entra so como texto",
    [itens[1]?.html, itens[1]?.restrito],
    ["Oficio&nbsp;(SEI nº 222)", true],
  );
  checar(
    "lerDocumentosPublicos: o processo vira link para a pagina dele",
    /^<a class="ancoraSei" href="https:\/\/sei\.x\/sei\/modulos\/pesquisa\/md_proc\.php\?a=1&amp;b=2"/.test(itens[2]?.html ?? ""),
    itens[2]?.html,
  );

  await nosDoisEditores("processo-publico", async (c: CasoEditor) => {
    usarDocumento(c.doc);
    const v = `[CK${c.versao}]`;
    const w = c.win as unknown as Record<string, unknown>;
    w.dadosProcessoPro = { listAndamento: { processo: "50300.000001/2024-00" } };
    w.getCitacaoDoc = () => "SEI nº ";
    Object.defineProperty(c.win, "location", { configurable: true, value: { origin: "https://sei.x" } });
    const ctx: Contexto = {
      adaptador: criarAdaptador(c.win),
      doc: c.doc,
      win: c.win,
      base: "",
      checkOpcao: () => true,
      verifyOpcao: () => false,
      fetch: (async () => ({ ok: true, text: async () => PAGINA })) as unknown as typeof fetch,
    };
    const g = processoPublico.globais(ctx) as Record<string, Fn>;
    igual(`processo-publico ${v}: globais do contrato`, Object.keys(g).sort(), [
      "getCheckerProcessoPublicoPro",
      "openDialogProcessoPublicoPro",
    ]);

    // o iframe oculto da pesquisa publica: um documento falso com o formulario e o captcha
    const iframe = g.getCheckerProcessoPublicoPro() as HTMLIFrameElement;
    const pagina = new Parser().parseFromString(
      '<html><body><form id="seiSearch"></form><label id="lblCaptcha"><img src="captcha.png"></label><input id="txtProtocoloPesquisa"><input id="txtCaptcha"><button id="sbmPesquisar"></button><div id="conteudo"></div></body></html>',
      "text/html",
    );
    Object.defineProperty(iframe, "contentDocument", { configurable: true, value: pagina });
    let pesquisou = 0;
    pagina.querySelector("#sbmPesquisar")?.addEventListener("click", () => {
      pesquisou += 1;
      const a = pagina.createElement("a");
      a.setAttribute("class", "protocoloNormal");
      a.setAttribute("href", "md_proc.php?a=1");
      pagina.querySelector("#conteudo")?.append(a);
    });

    g.openDialogProcessoPublicoPro(null);
    const d = dialogoAberto(c.doc) as HTMLElement;
    igual(
      `processo-publico ${v}: titulo e processo ja preenchido`,
      [d.querySelector("h2")?.textContent, (d.querySelector("#processoPub") as HTMLInputElement).value],
      ["Adicionar link de documento público", "50300.000001/2024-00"],
    );
    checar(`processo-publico ${v}: sem Cancelar`, ![...d.querySelectorAll("button")].some((b) => /cancelar/i.test(b.textContent ?? "")));
    await tique(50);
    igual(
      `processo-publico ${v}: mostra a imagem de verificacao da pagina publica`,
      d.querySelector("#searchPub_captcha img")?.getAttribute("src"),
      "captcha.png",
    );

    // sem codigo: avisa
    clicar(d, "Pesquisar");
    checar(
      `processo-publico ${v}: sem o codigo avisa e nao pesquisa`,
      /Digite o processo e o código/.test(c.doc.body.textContent ?? "") && pesquisou === 0,
    );
    for (const a of c.doc.body.querySelectorAll(".spro-aviso")) a.remove();

    (d.querySelector("#captchaPub") as HTMLInputElement).value = "ab12";
    clicar(d, "Pesquisar");
    await tique(1500);
    igual(
      `processo-publico ${v}: preenche o formulario publico e pesquisa`,
      [
        (pagina.querySelector("#txtProtocoloPesquisa") as HTMLInputElement).value,
        (pagina.querySelector("#txtCaptcha") as HTMLInputElement).value,
        pesquisou,
      ],
      ["50300.000001/2024-00", "ab12", 1],
    );
    igual(
      `processo-publico ${v}: lista os documentos publicos e o processo`,
      [...d.querySelectorAll("#listaDocPublico label")].map((l) => l.textContent),
      ["Parecer & Nota (SEI nº 111)", "Oficio (SEI nº 222) [documento restrito]", "50300.000001/2024-00 (o processo)"],
    );

    clicar(d, "Inserir");
    checar(
      `processo-publico ${v}: Inserir poe o link do documento escolhido (o primeiro) e fecha`,
      (ultimoInserido(c) ?? "").includes('href="https://') &&
        (ultimoInserido(c) ?? "").includes("Parecer &amp; Nota") &&
        !dialogoAberto(c.doc),
      ultimoInserido(c),
    );
  });
}
