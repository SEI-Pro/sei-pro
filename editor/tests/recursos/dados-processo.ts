import { criarAdaptador } from "../../src/adaptador";
import { recurso as dadosProcesso, entidadesParaTexto, NOMES_RESERVADOS } from "../../src/recursos/dados-processo";
import type { Contexto } from "../../src/recursos/tipos";
import { clicar, dialogoAberto, usarDocumento } from "../dialogo";
import { type CasoEditor, nosDoisEditores, ultimoInserido } from "../falsos";
import { checar, igual, secao } from "../util";

type Fn = (...a: unknown[]) => unknown;

const ctxDe = (c: { win: Window; doc: Document }): Contexto => ({
  adaptador: criarAdaptador(c.win),
  doc: c.doc,
  win: c.win,
  base: "",
  checkOpcao: () => true,
  verifyOpcao: () => false,
});

const escapar = (t: string) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export async function verificarDadosProcesso(): Promise<void> {
  secao("recurso dados-processo");
  igual(
    "entidadesParaTexto: nomeadas, decimais e hexadecimais",
    entidadesParaTexto("A &amp; B &lt;c&gt; &#233; &#xE7; &quot;x&quot;"),
    'A & B <c> é ç "x"',
  );
  igual(
    "entidadesParaTexto: nao interpreta tags e deixa entidade desconhecida",
    entidadesParaTexto("<b>x</b> &inexistente;"),
    "<b>x</b> &inexistente;",
  );
  checar(
    "NOMES_RESERVADOS: inclui as hashtags do sistema (e as avancadas sem o numero/sinal)",
    ["processo", "hoje", "qrcode", "documento", "assunto", "interessado"].every((n) => NOMES_RESERVADOS.has(n)) &&
      !NOMES_RESERVADOS.has("gestor"),
  );

  await nosDoisEditores("dados-processo", (c: CasoEditor) => {
    usarDocumento(c.doc);
    const v = `[CK${c.versao}]`;
    const w = c.win as unknown as Record<string, unknown>;
    const registro = { atualizacoes: [] as unknown[][], substituicoes: 0, sigiloso: false };
    w.dadosProcessoPro = {
      propProcesso: {
        txaTagsObservacoes: [{ unidade: "GPF", tags: [{ name: "gestor", value: "Ana" }] }],
        txaObservacoes: [{ unidade: "GPF", observacao: "obs antiga" }],
      },
      listDocumentos: [],
    };
    w.siglaUnidadeAtual = "GPF";
    w.checkProcessoSigiloso = () => registro.sigiloso;
    w.arrayDadosEditor = () => [[""], ["Processo: 5030/2018", "<b>link</b>"], ["Interessado: A &amp; B", "A &amp; B"]];
    w.getHashTagsPro = (t: string) => t.match(/#\w+/g) ?? [];
    w.textoParaHtmlPro = escapar;
    w.updateDadosProcesso = (...a: unknown[]) => registro.atualizacoes.push(a);
    w.replaceDadosEditor = () => {
      registro.substituicoes += 1;
    };

    const g = dadosProcesso.globais(ctxDe(c)) as Record<string, Fn>;
    igual(`dados-processo ${v}: globais do contrato`, Object.keys(g).sort(), [
      "getDadosEditor",
      "getDialogDadosEditor",
      "insertDadosEditor",
    ]);

    // chamada de boot (sem elemento): nao abre nada
    g.getDialogDadosEditor();
    checar(`dados-processo ${v}: a chamada de boot, sem elemento, nao abre dialogo`, !dialogoAberto(c.doc));

    // processo sigiloso: avisa e nao abre
    registro.sigiloso = true;
    g.getDadosEditor(null);
    checar(
      `dados-processo ${v}: processo sigiloso avisa e nao abre`,
      !dialogoAberto(c.doc) && /sigilosos/.test(c.doc.body.textContent ?? ""),
    );
    c.doc.body.querySelector(".spro-aviso")?.remove();
    registro.sigiloso = false;

    // com os dados prontos o clique abre o dialogo
    g.getDadosEditor(null);
    const d = dialogoAberto(c.doc) as HTMLElement;
    checar(
      `dados-processo ${v}: clique abre o dialogo com 4 abas e sem Cancelar`,
      !!d &&
        d.querySelectorAll('[role="tab"]').length === 4 &&
        ![...d.querySelectorAll("button")].some((b) => /cancelar/i.test(b.textContent ?? "")),
    );
    igual(`dados-processo ${v}: titulo`, d.querySelector("h2")?.textContent, "Dados do processo");

    // ---- aba 1 ----
    const opcoes = [...d.querySelectorAll("#listDados option")];
    igual(
      `dados-processo ${v}: as opcoes vem do monolito, com a entidade virando texto`,
      opcoes.map((o) => o.textContent),
      ["Selecione um dado…", "Processo: 5030/2018", "Interessado: A & B"],
    );
    clicar(d, "Inserir");
    checar(
      `dados-processo ${v}: sem escolher nada avisa e nao fecha`,
      !!dialogoAberto(c.doc) && /Escolha o dado/.test(c.doc.body.textContent ?? ""),
    );
    c.doc.body.querySelector(".spro-aviso")?.remove();
    (d.querySelector("#listDados") as HTMLSelectElement).value = "<b>link</b>";
    clicar(d, "Inserir");
    igual(`dados-processo ${v}: Inserir poe o valor escolhido no cursor`, ultimoInserido(c), "<b>link</b>");
    checar(`dados-processo ${v}: e fecha o dialogo`, !dialogoAberto(c.doc));

    // ---- abas 2 a 4 ----
    g.getDialogDadosEditor(null);
    const e = dialogoAberto(c.doc) as HTMLElement;
    const aba = (id: string) => e.querySelector(`#dadosTab_${id}`) as HTMLElement;
    aba("substituir").click();
    checar(
      `dados-processo ${v}: na aba Substituir o rodape (botao Inserir) some`,
      e.querySelector(".spro-dialogo-rodape")?.hasAttribute("hidden") === true,
    );
    clicar(e, "Substituir campos dinâmicos");
    igual(`dados-processo ${v}: Substituir chama o monolito uma vez`, registro.substituicoes, 1);
    checar(
      `dados-processo ${v}: a aba mostra quantos campos foram detectados`,
      /campos? dinâmicos? detectados?/.test(e.querySelector("#tabReplaceTag_result")?.textContent ?? ""),
    );

    aba("lista").click();
    const lista = e.textContent ?? "";
    checar(
      `dados-processo ${v}: a lista de referencia traz campos e avancados`,
      lista.includes("#processo") && lista.includes("#hoje-5") && lista.includes("#documento+1"),
    );

    // ---- aba 3: CRUD dos personalizados ----
    aba("personalizados").click();
    const linhas = () => [...e.querySelectorAll("#tabNewDynamicField_result .spro-linha-campo")];
    igual(
      `dados-processo ${v}: lista os campos ja salvos da unidade`,
      linhas().map((l) => l.getAttribute("data-tag")),
      ["gestor"],
    );
    const nome = e.querySelector("#dinNome") as HTMLInputElement;
    const valor = e.querySelector("#dinValor") as HTMLInputElement;
    const aviso = () => e.querySelector("#tabNewDynamicField_alert")?.textContent ?? "";

    clicar(e, "Salvar campo");
    checar(`dados-processo ${v}: nome e valor vazios avisam`, /Informe o nome e o valor/.test(aviso()) && linhas().length === 1);
    nome.value = "hoje";
    valor.value = "x";
    clicar(e, "Salvar campo");
    checar(
      `dados-processo ${v}: nome reservado e recusado`,
      /reservado/.test(aviso()) && linhas().length === 1 && registro.atualizacoes.length === 0,
    );

    nome.value = "#Prazo Respostá: lixo";
    valor.value = "30 dias";
    clicar(e, "Salvar campo");
    igual(
      `dados-processo ${v}: nome normalizado (sem #, acento, espaco, maiuscula, depois dos dois pontos)`,
      linhas().map((l) => l.getAttribute("data-tag")),
      ["prazoresposta", "gestor"],
    );
    igual(
      `dados-processo ${v}: grava nas observacoes da unidade (campos novos antes da observacao existente)`,
      registro.atualizacoes.at(-1),
      ["txaObservacoes", "#prazoresposta: 30 dias\n#gestor: Ana\nobs antiga"],
    );
    igual(
      `dados-processo ${v}: o dado novo aparece na aba 1`,
      [...e.querySelectorAll("#listDados option")].at(-1)?.textContent,
      "Personalizado (GPF) #gestor: Ana",
    );
    checar(
      `dados-processo ${v}: campos limpos e sucesso avisado`,
      nome.value === "" && valor.value === "" && /salvo com sucesso/.test(aviso()),
    );

    clicar(e, "Editar #gestor");
    igual(`dados-processo ${v}: Editar devolve nome e valor aos campos`, [nome.value, valor.value], ["gestor", "Ana"]);
    valor.value = "Beto";
    clicar(e, "Salvar campo");
    igual(
      `dados-processo ${v}: salvar o mesmo nome atualiza a linha (sem duplicar)`,
      linhas().map((l) => [l.getAttribute("data-tag"), l.getAttribute("data-valor")]),
      [
        ["prazoresposta", "30 dias"],
        ["gestor", "Beto"],
      ],
    );

    clicar(e, "Remover #prazoresposta");
    igual(
      `dados-processo ${v}: Remover tira a linha e regrava`,
      [linhas().length, registro.atualizacoes.at(-1)],
      [1, ["txaObservacoes", "#gestor: Beto\nobs antiga"]],
    );
    const memoria = (w.dadosProcessoPro as { propProcesso: { txaTagsObservacoes: Array<{ tags: unknown[] }> } }).propProcesso
      .txaTagsObservacoes[0]?.tags;
    igual(`dados-processo ${v}: os dados em memoria acompanham`, memoria, [{ name: "gestor", value: "Beto" }]);
    (e.querySelector("button[aria-label='Fechar']") as HTMLElement).click();

    // sem os dados prontos o clique espera (nao abre ainda)
    w.dadosProcessoPro = {};
    g.getDadosEditor(null, 100);
    checar(`dados-processo ${v}: sem os dados do processo o clique nao abre dialogo`, !dialogoAberto(c.doc));
  });
}
