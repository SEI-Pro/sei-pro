import { criarAdaptador } from "../../src/adaptador";
import { googleParaSeiBasico, recurso as importarDoc, wordParaSei } from "../../src/recursos/importar-doc";
import type { Contexto } from "../../src/recursos/tipos";
import { clicar, usarDocumento } from "../dialogo";
import { type CasoEditor, nosDoisEditores, ultimoInserido } from "../falsos";
import { checar, igual, instalarDom, secao, tique } from "../util";

type Fn = (...a: unknown[]) => unknown;

const analisarDe =
  (doc: Document) =>
  (html: string): Document =>
    new (doc.defaultView as unknown as { DOMParser: typeof DOMParser }).DOMParser().parseFromString(html, "text/html");

const dialogos = (doc: Document) => [...doc.querySelectorAll("dialog.spro-dialogo[open]")] as HTMLElement[];

function arquivo(nome: string, bytes: number[] | string): File {
  const dados = typeof bytes === "string" ? new TextEncoder().encode(bytes) : Uint8Array.from(bytes);
  return {
    name: nome,
    arrayBuffer: async () => dados.buffer.slice(dados.byteOffset, dados.byteOffset + dados.byteLength),
  } as unknown as File;
}

function escolher(d: HTMLElement, f: File | null): void {
  const entrada = d.querySelector("#fileInputImportHTMLDocx") as HTMLInputElement;
  Object.defineProperty(entrada, "files", { configurable: true, value: f ? [f] : [] });
}

const marcar = (d: HTMLElement, id: string, ligado: boolean) => {
  const el = d.querySelector(`#${id}`) as HTMLInputElement;
  if (ligado) el.setAttribute("checked", "checked");
  else el.removeAttribute("checked");
};

export async function verificarImportarDoc(): Promise<void> {
  secao("recurso importar-doc");

  // ---- limpeza Word -> SEI (sobre string) ----
  const doc = instalarDom();
  const word = wordParaSei(
    [
      '<style>p{}</style><meta charset="x"><script>x</script><!-- c -->',
      '<div class="WordSection1">',
      '<p class="MsoNormal" align="center" style="x"><span>Titulo</span><o:p></o:p></p>',
      '<p class="MsoNormal"><span>a</span><del>velho</del> <ins>novo</ins><del>&nbsp;</del></p>',
      '<a class="msocomanchor">c</a><div style="mso-element:comment-list">lista</div>',
      "</div>",
    ].join(""),
    analisarDe(doc),
  );
  checar(
    "wordParaSei: tira estilo, meta, script, comentarios, ancoras e lista de comentarios do Word",
    !/<style|<meta|<script|<!--|msocomanchor|comment-list|o:p/.test(word),
    word,
  );
  checar("wordParaSei: desembrulha .WordSection1", !word.includes("WordSection1"), word);
  checar(
    "wordParaSei: MsoNormal centralizado vira Texto_Centralizado, sem align/style/spans",
    /<p class="Texto_Centralizado">Titulo<\/p>/.test(word),
    word,
  );
  checar(
    "wordParaSei: MsoNormal comum vira Texto_Justificado_Recuo_Primeira_Linha",
    word.includes('class="Texto_Justificado_Recuo_Primeira_Linha"'),
    word,
  );
  checar(
    "wordParaSei: <del> vira riscado vermelho e <ins> sublinhado azul; vazios somem",
    word.includes('<span style="color:#FF0000;"><s>velho</s></span>') &&
      word.includes('<span style="color:#0000FF;"><u>novo</u></span>') &&
      !word.includes("<del") &&
      !word.includes("<ins"),
    word,
  );

  const google = googleParaSeiBasico(
    '<html><head><title>t</title><style>x</style></head><body><script>x</script><a href="https://www.google.com/url?q=https%3A%2F%2Fexemplo.gov.br%2Fx&sa=D">link</a><a href="https://ok.gov.br/">ok</a><p>texto</p></body></html>',
    analisarDe(doc),
  );
  checar("googleParaSeiBasico: sem script/estilo/titulo", !/<script|<style|<title/.test(google), google);
  checar(
    "googleParaSeiBasico: o redirecionamento do Google vira o link direto, com target e rel",
    google.includes('href="https://exemplo.gov.br/x"') && google.includes('target="_blank"') && google.includes('rel="noreferrer"'),
    google,
  );
  checar("googleParaSeiBasico: link normal fica", google.includes('href="https://ok.gov.br/"'), google);

  await nosDoisEditores("importar-doc", async (c: CasoEditor) => {
    usarDocumento(c.doc);
    const v = `[CK${c.versao}]`;
    const w = c.win as unknown as Record<string, unknown>;
    const registro = { urls: [] as string[], substituicoes: 0, google: [] as unknown[][], salvou: 0 };
    let respostaGoogle: { ok: boolean; texto: string } = {
      ok: true,
      texto: "<html><body><script>x</script><p>da planilha</p></body></html>",
    };
    w.mammoth = { convertToHtml: async () => ({ value: '<p class="MsoNormal">do docx</p>' }) };
    w.replaceDadosEditor = () => {
      registro.substituicoes += 1;
    };
    w.enableButtonSavePro = () => {
      registro.salvou += 1;
    };
    w.loadGoogleDocs = (...a: unknown[]) => registro.google.push(a);
    const ctx: Contexto = {
      adaptador: criarAdaptador(c.win),
      doc: c.doc,
      win: c.win,
      base: "",
      checkOpcao: () => true,
      verifyOpcao: () => false,
      fetch: (async (url: string) => {
        registro.urls.push(url);
        return { ok: respostaGoogle.ok, text: async () => respostaGoogle.texto };
      }) as unknown as typeof fetch,
    };
    const g = importarDoc.globais(ctx) as Record<string, Fn>;
    igual(`importar-doc ${v}: globais do contrato`, Object.keys(g).sort(), [
      "converterDocxParaHtml",
      "getGoogleDocs",
      "getGoogleSheets",
      "handleFileImport",
      "importDocPro",
      "importGoogleByUrl",
      "loadFileImportEditor",
      "loadFileImportHTML",
      "wordToSEI",
    ]);
    const ed = ctx.adaptador.getInstance(null) as object;
    const dados = () => ctx.adaptador.getData(ed);
    const inserido = () => ultimoInserido(c) ?? "";
    const aviso = () => c.doc.body.textContent ?? "";
    const limparAvisos = () => {
      for (const a of c.doc.body.querySelectorAll(".spro-aviso")) a.remove();
    };

    // ---- dialogo ----
    g.importDocPro(null);
    const d = dialogos(c.doc)[0] as HTMLElement;
    checar(
      `importar-doc ${v}: abre com 3 abas e sem Cancelar`,
      !!d &&
        d.querySelectorAll('[role="tab"]').length === 3 &&
        ![...d.querySelectorAll("button")].some((b) => /cancelar/i.test(b.textContent ?? "")),
    );
    igual(`importar-doc ${v}: titulo`, d.querySelector("h2")?.textContent, "Inserir conteúdo externo");

    clicar(d, "Inserir");
    checar(`importar-doc ${v}: sem arquivo avisa e nao fecha`, /Escolha um arquivo/.test(aviso()) && dialogos(c.doc).length === 1);
    limparAvisos();
    escolher(d, arquivo("nota.txt", "x"));
    clicar(d, "Inserir");
    await tique(10);
    checar(
      `importar-doc ${v}: extensao nao suportada avisa e nao pede confirmacao`,
      /Formato não suportado/.test(aviso()) && dialogos(c.doc).length === 1,
    );
    limparAvisos();

    // ---- .html substituindo tudo: confirma antes ----
    escolher(d, arquivo("pagina.html", "<p>novo texto</p>"));
    clicar(d, "Inserir");
    await tique(10);
    let confirmacao = dialogos(c.doc).at(-1) as HTMLElement;
    checar(
      `importar-doc ${v}: substituir tudo pede confirmacao (Substituir / Voltar)`,
      dialogos(c.doc).length === 2 && /Substituir todo o conteúdo/.test(confirmacao.textContent ?? ""),
    );
    clicar(confirmacao, "Voltar");
    await tique(10);
    checar(
      `importar-doc ${v}: Voltar nao altera o documento e mantem o dialogo`,
      !dados().includes("novo texto") && dialogos(c.doc).length === 1,
    );
    clicar(d, "Inserir");
    await tique(10);
    confirmacao = dialogos(c.doc).at(-1) as HTMLElement;
    clicar(confirmacao, "Substituir");
    await tique(700);
    checar(
      `importar-doc ${v}: Substituir troca o documento, fecha o dialogo e habilita Salvar`,
      dados().includes("novo texto") && !dados().includes("<p>texto</p>") && dialogos(c.doc).length === 0 && registro.salvou >= 1,
      dados(),
    );
    igual(`importar-doc ${v}: com "substituir campos" marcado chama o monolito`, registro.substituicoes, 1);

    // ---- .docx substituindo tudo: confirma e o documento sai limpo (Word -> SEI) ----
    g.importDocPro(null);
    const dw = dialogos(c.doc)[0] as HTMLElement;
    marcar(dw, "replaceTags", false);
    escolher(dw, arquivo("modelo.docx", "x"));
    clicar(dw, "Inserir");
    await tique(10);
    clicar(dialogos(c.doc).at(-1) as HTMLElement, "Substituir");
    await tique(50);
    checar(
      `importar-doc ${v}: .docx substituindo tudo entra limpo pelo Word->SEI`,
      dados().includes("do docx") && dados().includes("Texto_Justificado_Recuo_Primeira_Linha") && !dados().includes("MsoNormal"),
      dados(),
    );

    // ---- .docx sem substituir: entra antes do paragrafo do cursor, ja limpo ----
    g.importDocPro(null);
    const d2 = dialogos(c.doc)[0] as HTMLElement;
    marcar(d2, "replaceText", false);
    marcar(d2, "replaceTags", false);
    escolher(d2, arquivo("modelo.docx", "x"));
    clicar(d2, "Inserir");
    await tique(50);
    checar(
      `importar-doc ${v}: .docx passa pelo conversor e entra antes do cursor, sem confirmar`,
      inserido().includes("do docx") && dialogos(c.doc).length === 0,
      inserido(),
    );
    igual(`importar-doc ${v}: sem a opcao, nao troca campos`, registro.substituicoes, 1);

    // ---- codificacao ----
    const bytes = [0x3c, 0x70, 0x3e, 0xe9, 0x3c, 0x2f, 0x70, 0x3e];
    for (const [corrigir, esperado] of [
      [true, "é"],
      [false, "�"],
    ] as const) {
      g.importDocPro(null);
      const dc = dialogos(c.doc)[0] as HTMLElement;
      marcar(dc, "replaceText", false);
      marcar(dc, "replaceTags", false);
      marcar(dc, "importWord", corrigir);
      escolher(dc, arquivo("antigo.html", bytes));
      clicar(dc, "Inserir");
      await tique(50);
      checar(
        `importar-doc ${v}: .html ${corrigir ? "com" : "sem"} "corrigir codificacao" le ${corrigir ? "como Windows-1252" : "como UTF-8"}`,
        inserido().includes(esperado),
        inserido(),
      );
    }

    // ---- Google ----
    w.iframeEditor = c.versao === 4 ? {} : undefined;
    g.importDocPro(null);
    const dg = dialogos(c.doc)[0] as HTMLElement;
    (dg.querySelector("#imp" + "Tab_docs") as HTMLElement).click();
    clicar(dg, "Inserir");
    checar(`importar-doc ${v}: Google Docs sem endereco avisa`, /Informe o endereço do Google Docs/.test(aviso()));
    limparAvisos();
    const urlDocs = dg.querySelector("#urlGDocs") as HTMLInputElement;
    urlDocs.value = "https://exemplo.gov.br/nada";
    clicar(dg, "Inserir");
    await tique(10);
    checar(
      `importar-doc ${v}: endereco do Google Docs invalido avisa`,
      /Endereço do documento inválido/.test(aviso()) && registro.urls.length === 0 && registro.google.length === 0,
    );
    limparAvisos();
    urlDocs.value = "https://docs.google.com/document/d/ABC123/edit";
    marcar(dg, "replaceTextDocs", false);
    clicar(dg, "Inserir");
    await tique(50);
    const urlEsperada = "https://docs.google.com/feeds/download/documents/export/Export?id=ABC123&exportFormat=html";
    if (c.versao === 4)
      igual(
        `importar-doc ${v}: CK4 usa a esteira do monolito (loadGoogleDocs)`,
        [registro.google.at(-1)?.[0], registro.google.at(-1)?.[2]],
        [urlEsperada, "docs"],
      );
    else {
      w.iframeEditor = undefined;
      igual(`importar-doc ${v}: CK5 busca o HTML exportado`, registro.urls.at(-1), urlEsperada);
      checar(
        `importar-doc ${v}: e insere so a limpeza basica (sem script)`,
        inserido().includes("da planilha") && !inserido().includes("<script"),
        inserido(),
      );
    }
    if (c.versao === 5) {
      checar(`importar-doc ${v}: Google concluido fecha o dialogo`, dialogos(c.doc).length === 0);
      // planilha publicada
      g.importDocPro(null);
      const dp = dialogos(c.doc)[0] as HTMLElement;
      (dp.querySelector("#impTab_sheets") as HTMLElement).click();
      (dp.querySelector("#urlGSheets") as HTMLInputElement).value =
        "https://docs.google.com/spreadsheets/d/e/2PACX-abc/pubhtml?widget=true";
      marcar(dp, "replaceTextSheets", false);
      clicar(dp, "Inserir");
      await tique(50);
      igual(
        `importar-doc ${v}: planilha usa o endereco publicado (/e/<id>/pubhtml)`,
        registro.urls.at(-1),
        "https://docs.google.com/spreadsheets/d/e/2PACX-abc/pubhtml",
      );
      // falha de rede / resposta vazia
      respostaGoogle = { ok: false, texto: "" };
      g.importDocPro(null);
      const df = dialogos(c.doc)[0] as HTMLElement;
      (df.querySelector("#impTab_docs") as HTMLElement).click();
      (df.querySelector("#urlGDocs") as HTMLInputElement).value = "https://docs.google.com/document/d/ZZZ/edit";
      marcar(df, "replaceTextDocs", false);
      limparAvisos();
      clicar(df, "Inserir");
      await tique(50);
      checar(
        `importar-doc ${v}: resposta vazia avisa e mantem o dialogo aberto`,
        /Nenhum documento encontrado/.test(aviso()) && dialogos(c.doc).length === 1,
      );
    }
  });
}
