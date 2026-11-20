import { criarAdaptador } from "../../src/adaptador";
import { recurso as capLetter } from "../../src/recursos/cap-letter";
import { recurso as checkbox } from "../../src/recursos/checkbox";
import type { Contexto, Recurso } from "../../src/recursos/tipos";
import { capitalizar } from "../../src/util/capitalizar";
import { escaparHtml } from "../../src/util/html";
import { type CasoEditor, nosDoisEditores, primeiroP, selecionarTexto, totalInseridos, ultimoInserido } from "../falsos";
import { checar, igual, instalarDom, secao } from "../util";

function ctx(c: { win: Window; doc: Document }): Contexto {
  return { adaptador: criarAdaptador(c.win), doc: c.doc, win: c.win, base: "", checkOpcao: () => true, verifyOpcao: () => false };
}
const aciona = (r: Recurso, c: CasoEditor, nome: string) => (r.globais(ctx(c))[nome] as (el: Element | null) => void)(null);

export async function verificarCheckboxCapLetter(): Promise<void> {
  secao("util capitalizar (paridade com capitalizeFirstLetter do legado)");
  // valores obtidos rodando o legado em Node
  const dourado: Array<[string, string]> = [
    ["", ""],
    ["   ", ""],
    ["de", "De"],
    ["regulação DO setor", "Regulação do Setor"],
    ["DIREITO CIVIL", "Direito CIVIL"],
    ["direito civil", "Direito Civil"],
    ["AGÊNCIA nacional de TRANSPORTES aquaviários", "Agência Nacional de Transportes Aquaviários"],
    ["artigo II da lei", "Artigo II da Lei"],
    ["ii", "Ii"],
    ["texto XIV final", "Texto XIV Final"],
    ["a ação do estado", "A Ação do Estado"],
    ["ÀS vezes", "Às Vezes"],
    ["minha CASA", "Minha Casa"],
    ["x", "X"],
    ["Mixed cAsE wOrDs", "Mixed Case Words"],
    ["LEI DE ACESSO À INFORMAÇÃO", "Lei de Acesso à Informação"],
  ];
  for (const [entrada, esperado] of dourado) igual(`capitalizar(${JSON.stringify(entrada)})`, capitalizar(entrada), esperado);
  // o legado lancava TypeError aqui; o porte preserva o espacamento
  igual("dois espacos seguidos nao lancam (legado lancava)", capitalizar("um  dois"), "Um  Dois");
  igual("espaco no inicio nao lanca (legado lancava)", capitalizar(" início"), " Início");
  igual("escaparHtml", escaparHtml(`a<b & "c">`), "a&lt;b &amp; &quot;c&quot;&gt;");

  secao("recursos checkbox e cap-letter");
  instalarDom(); // `avisar` usa o document global
  await nosDoisEditores("checkbox", (c) => {
    igual("checkbox: unico global", Object.keys(checkbox.globais(ctx(c))), ["getInsertCheckboxButtom"]);
    selecionarTexto(c, primeiroP(c), "");
    aciona(checkbox, c, "getInsertCheckboxButtom");
    const html = ultimoInserido(c) ?? "";
    checar(
      `checkbox [CK${c.versao}]: HTML do legado com data-id de 16 caracteres`,
      /^<span class="ancoraSei checkboxSEI" data-id="[0-9a-zA-Z]{16}" style="font-size: 1\.5em;font-weight: bold;">&#9744;<\/span>&nbsp;$/.test(
        html,
      ),
      html,
    );
    aciona(checkbox, c, "getInsertCheckboxButtom");
    const outro = ultimoInserido(c) ?? "";
    checar(`checkbox [CK${c.versao}]: cada caixa tem data-id proprio`, outro !== html);
  });

  await nosDoisEditores("cap-letter com texto", (c) => {
    selecionarTexto(c, primeiroP(c), "regulação DO setor");
    aciona(capLetter, c, "convertFirstLetter");
    igual(`cap-letter [CK${c.versao}]: troca o texto selecionado`, ultimoInserido(c), "Regulação do Setor");
  });
  await nosDoisEditores("cap-letter com marcacao", (c) => {
    selecionarTexto(c, primeiroP(c), 'a<b & "c"');
    aciona(capLetter, c, "convertFirstLetter");
    const html = ultimoInserido(c) ?? "";
    checar(
      `cap-letter [CK${c.versao}]: o texto selecionado volta como TEXTO (sem <)`,
      !html.includes("<") && html.includes("&lt;") && html.includes("&amp;"),
      html,
    );
  });
  for (const [rotulo, selecao] of [
    ["vazia", ""],
    ["so espacos", "   "],
  ] as const) {
    await nosDoisEditores(`cap-letter ${rotulo}`, (c) => {
      c.doc.body.querySelector(".spro-aviso")?.remove();
      selecionarTexto(c, primeiroP(c), selecao);
      aciona(capLetter, c, "convertFirstLetter");
      checar(`cap-letter [CK${c.versao}]: selecao ${rotulo} nao altera o documento`, totalInseridos(c) === 0);
      checar(`cap-letter [CK${c.versao}]: selecao ${rotulo} avisa`, /Selecione um texto para converter/.test(c.doc.body.textContent ?? ""));
    });
  }
}
