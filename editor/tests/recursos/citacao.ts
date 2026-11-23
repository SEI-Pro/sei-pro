import { criarAdaptador } from "../../src/adaptador";
import { recurso as citacao, rotuloDoDocumento } from "../../src/recursos/citacao";
import type { Contexto } from "../../src/recursos/tipos";
import { clicar, dialogoAberto, usarDocumento } from "../dialogo";
import { type CasoEditor, nosDoisEditores, totalInseridos, ultimoInserido } from "../falsos";
import { checar, disparar, igual, secao } from "../util";

type Fn = (...a: unknown[]) => unknown;

const DOCS = [
  { id_protocolo: "101", documento: "Ofício 12", nr_sei: "3021277" },
  { id_protocolo: "102", documento: "Despacho & Decisão", nr_sei: "3021300" },
  { id_protocolo: "103", documento: "Nota Técnica", nr_sei: "" },
  { id_protocolo: "104", documento: "", nr_sei: "999" },
];

const escapar = (t: string) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export async function verificarCitacao(): Promise<void> {
  secao("recurso citacao");
  igual(
    "rotuloDoDocumento: com e sem numero SEI",
    [rotuloDoDocumento(DOCS[0] as never), rotuloDoDocumento(DOCS[2] as never)],
    ["Ofício 12 (3021277)", "Nota Técnica"],
  );

  await nosDoisEditores("citacao", (c: CasoEditor) => {
    usarDocumento(c.doc);
    const v = `[CK${c.versao}]`;
    const w = c.win as unknown as Record<string, unknown>;
    const ctx = (): Contexto => ({
      adaptador: criarAdaptador(c.win),
      doc: c.doc,
      win: c.win,
      base: "",
      checkOpcao: () => true,
      verifyOpcao: () => false,
    });
    const estado = { sigiloso: false, config: "citacaodoc_1" };
    w.dadosProcessoPro = { listDocumentos: DOCS };
    w.checkProcessoSigiloso = () => estado.sigiloso;
    w.getCitacaoDoc = () => "SEI nº ";
    w.getConfigValue = () => estado.config;
    w.textoParaHtmlPro = escapar;
    const g = citacao.globais(ctx()) as Record<string, Fn>;
    igual(`citacao ${v}: globais do contrato`, Object.keys(g).sort(), [
      "getCitacaoDocumento",
      "getDialogCitacaoDocumento",
      "insertCitacaoDocumento",
    ]);

    // sigiloso: avisa e nao abre
    estado.sigiloso = true;
    g.getCitacaoDocumento(null);
    checar(`citacao ${v}: processo sigiloso avisa e nao abre`, !dialogoAberto(c.doc) && /sigilosos/.test(c.doc.body.textContent ?? ""));
    for (const a of c.doc.body.querySelectorAll(".spro-aviso")) a.remove();
    estado.sigiloso = false;

    // dialogo
    g.getCitacaoDocumento(null);
    const d = dialogoAberto(c.doc) as HTMLElement;
    const caixas = () => [...d.querySelectorAll("#listaCitacao label")] as HTMLElement[];
    igual(
      `citacao ${v}: lista os documentos (sem o de nome vazio), com o numero SEI`,
      caixas().map((l) => l.textContent),
      ["Ofício 12 (3021277)", "Despacho & Decisão (3021300)", "Nota Técnica"],
    );
    checar(
      `citacao ${v}: sem botao Cancelar; titulo certo`,
      d.querySelector("h2")?.textContent === "Inserir referência de documento do processo" &&
        ![...d.querySelectorAll("button")].some((b) => /cancelar/i.test(b.textContent ?? "")),
    );
    igual(`citacao ${v}: o contador comeca em 0`, d.querySelector('[data-valor-de="filtroCitacao"]')?.textContent, "0 selecionados");

    clicar(d, "Inserir");
    checar(
      `citacao ${v}: sem marcar nada avisa e nao fecha`,
      /Selecione ao menos um documento/.test(c.doc.body.textContent ?? "") && !!dialogoAberto(c.doc),
    );
    for (const a of c.doc.body.querySelectorAll(".spro-aviso")) a.remove();

    // filtro (sem acento e sem maiuscula)
    const filtro = d.querySelector("#filtroCitacao") as HTMLInputElement;
    filtro.value = "decisao";
    disparar(filtro, "input");
    igual(
      `citacao ${v}: o filtro ignora acento e maiuscula`,
      caixas().map((l) => l.hasAttribute("hidden")),
      [true, false, true],
    );
    filtro.value = "zzz";
    disparar(filtro, "input");
    checar(
      `citacao ${v}: filtro sem resultado avisa`,
      /Nenhum documento corresponde/.test(d.querySelector("#resumoCitacao")?.textContent ?? ""),
    );
    filtro.value = "";
    disparar(filtro, "input");
    igual(
      `citacao ${v}: limpar o filtro mostra tudo`,
      caixas().map((l) => l.hasAttribute("hidden")),
      [false, false, false],
    );

    // marcar tres e inserir: ", " e " e " entre as referencias
    for (const l of caixas()) {
      (l.querySelector("input") as HTMLInputElement).setAttribute("checked", "checked");
    }
    disparar(d.querySelector("#listaCitacao") as HTMLElement, "change");
    igual(`citacao ${v}: o contador acompanha`, d.querySelector('[data-valor-de="filtroCitacao"]')?.textContent, "3 selecionados");
    clicar(d, "Inserir");
    checar(`citacao ${v}: Inserir fecha o dialogo`, !dialogoAberto(c.doc));
    // o falso do CK5 conta tambem os separadores (", " e " e ") como insercoes; o do CK4 os guarda a parte
    igual(`citacao ${v}: uma insercao por documento marcado (mais os 2 separadores no CK5)`, totalInseridos(c), c.versao === 4 ? 3 : 5);
    checar(
      `citacao ${v}: o ultimo (sem numero SEI) entra so como ancora com o nome do documento`,
      (ultimoInserido(c) ?? "").includes(">Nota Técnica</a>") && !(ultimoInserido(c) ?? "").includes("&nbsp;("),
      ultimoInserido(c),
    );
  });

  // ---- insercao de um documento (formato do HTML) ----
  await nosDoisEditores("citacao (html)", (c: CasoEditor) => {
    usarDocumento(c.doc);
    const v = `[CK${c.versao}]`;
    const w = c.win as unknown as Record<string, unknown>;
    w.dadosProcessoPro = { listDocumentos: DOCS };
    w.checkProcessoSigiloso = () => false;
    w.getCitacaoDoc = () => "SEI nº ";
    let config = "citacaodoc_1";
    w.getConfigValue = () => config;
    w.textoParaHtmlPro = escapar;
    const g = citacao.globais({
      adaptador: criarAdaptador(c.win),
      doc: c.doc,
      win: c.win,
      base: "",
      checkOpcao: () => true,
      verifyOpcao: () => false,
    }) as Record<string, Fn>;

    igual(
      `citacao ${v}: documento inexistente devolve false e nao insere`,
      [g.insertCitacaoDocumento("999"), totalInseridos(c)],
      [false, 0],
    );
    igual(`citacao ${v}: documento de nome vazio nao e inserido`, g.insertCitacaoDocumento("104"), false);
    const ancora102 =
      '<span contenteditable="false" style="text-indent:0;"><a class="ancoraSei" id="lnkSei102" style="text-indent:0;">3021300</a></span>';
    igual(
      `citacao ${v}: com numero: "Tipo (SEI no <ancora>)", tipo escapado`,
      [g.insertCitacaoDocumento("102"), ultimoInserido(c)],
      [true, `Despacho &amp; Decisão&nbsp;(SEI nº ${ancora102})`],
    );
    g.insertCitacaoDocumento("103");
    checar(
      `citacao ${v}: sem numero SEI (e sem a opcao 4) entra so a ancora com o nome do documento`,
      (ultimoInserido(c) ?? "").includes(">Nota Técnica</a>") && !(ultimoInserido(c) ?? "").includes("&nbsp;("),
      ultimoInserido(c),
    );
    config = "citacaodoc_4";
    g.insertCitacaoDocumento("103");
    checar(
      `citacao ${v}: com a opcao citacaodoc_4 o tipo vem antes, mesmo sem numero`,
      (ultimoInserido(c) ?? "").startsWith("Nota Técnica&nbsp;("),
      ultimoInserido(c),
    );
  });
}
