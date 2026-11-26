import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseHTML } from "linkedom";
import {
  aplicarConfigGeral,
  atualizarContagens,
  coletarConfigGeral,
  controleDe,
  definirEscolhasDinamicas,
  type ItemConfig,
} from "../src/config";
import { AVISO_SEM_HIPOTESES, hipotesesDoArmazenamento } from "../src/listas";
import { urlManual } from "../src/manual";
import { montarComplementos, montarGeral } from "../src/render";
import { checar, instalarDom, secao } from "./util";
import { ADICIONADAS, REMOVIDAS } from "./verificar-schema";

const FIXTURE = join(dirname(fileURLToPath(import.meta.url)), "fixtures", "options-legado.html");

/** O que o options.js legado (changeConfigGeral) devolveria para a pagina intocada, calculado direto do HTML legado. */
function esperadoDoLegado(): ItemConfig[] {
  const { document: d } = parseHTML(readFileSync(FIXTURE, "latin1")) as unknown as { document: Document };
  const nome = (e: Element) => e.getAttribute("data-name") as string;
  const chaves = (raiz: string) =>
    [...d.querySelectorAll(`${raiz} input[name="infraAncoraSigla"]`)].map((e) => ({ name: nome(e), value: e.hasAttribute("checked") }));
  const sobrevive = <T extends { name: string }>(i: T) => !REMOVIDAS.includes(i.name);
  const naoVazios = (sel: string) =>
    [...d.querySelectorAll(`#options-functions ${sel}`)].filter((e) => (e.getAttribute("value") ?? "") !== "");
  return [
    ...chaves("#options-functions"),
    ...chaves("#options-complements").filter(sobrevive),
    ...naoVazios('input[type="text"]').map((e) => ({ name: nome(e), value: e.getAttribute("value") as string })),
    ...naoVazios('input[type="number"]').map((e) => ({ name: nome(e), value: Number.parseInt(e.getAttribute("value") as string, 10) })),
    ...[...d.querySelectorAll("#options-functions select")]
      .map((e) => ({ name: nome(e), value: e.querySelector("option")?.getAttribute("value") ?? "" }))
      .filter((i) => i.value !== ""),
  ];
}

function montarMinimo(c: { lab: boolean; foraAntaq: boolean }): HTMLElement {
  const raiz = document.createElement("div");
  const ctx = { ...c, homepage: "https://seipro.app" };
  raiz.append(montarGeral(ctx), montarComplementos(ctx));
  document.body.append(raiz);
  return raiz;
}

const nomes = (l: ItemConfig[]) => l.map((i) => i.name);
const valor = (l: ItemConfig[], n: string) => l.find((i) => i.name === n)?.value;

export function verificarConfig(): void {
  secao("manual: URL");
  checar("slug + homepage", urlManual("https://seipro.app", "FAVORITOS") === "https://seipro.app/pages/FAVORITOS.html");
  checar("homepage com barra final", urlManual("https://seipro.app/", "PRAZOS") === "https://seipro.app/pages/PRAZOS.html");
  checar(
    "homepage do ANTAQ",
    urlManual("https://antaqgovbr.github.io/antaq-pro", "AGRUPAR") === "https://antaqgovbr.github.io/antaq-pro/pages/AGRUPAR.html",
  );
  checar(
    "URL absoluta passa direto",
    urlManual("https://seipro.app", "https://bit.ly/Guia-SEI-Pro-Atividades") === "https://bit.ly/Guia-SEI-Pro-Atividades",
  );

  secao("config: pagina intocada = o que o legado gravava");
  instalarDom();
  const raiz = montarMinimo({ lab: true, foraAntaq: true });
  const atual = coletarConfigGeral(raiz);
  const legado = esperadoDoLegado();
  const atualSemNovas = atual.filter((i) => !ADICIONADAS.includes(i.name));
  checar("mesmos itens, mesma ordem (fora as adicionadas)", JSON.stringify(atualSemNovas) === JSON.stringify(legado), {
    atual: atualSemNovas.length,
    legado: legado.length,
  });
  // 59 chaves (62 menos formularios, natjus e sincronizarprocessos) + 1 texto preenchido (certidaosigilo_nomedoc) + 3 numeros + 3 selects com valor (newdocsigilo, vazio, nao entra)
  checar("66 itens legados na pagina intocada (69 menos as 3 removidas)", atualSemNovas.length === 66, atualSemNovas.length);
  const iProj = nomes(atual).indexOf("gerenciarprojetos");
  checar(
    "gerenciardemandas gravada LIGADA (padrao novo), logo depois de gerenciarprojetos (72 itens)",
    atual.length === 72 && atual[iProj + 1]?.name === "gerenciardemandas" && atual[iProj + 1]?.value === true,
  );

  secao("config: dependencias");
  const marcar = (r: ParentNode, n: string, v: boolean) => {
    (controleDe(r, n) as HTMLInputElement).checked = v;
  };
  const oculta = (r: ParentNode, n: string) => (r.querySelector(`[data-opcao="${n}"]`) as Element).hasAttribute("data-dep-oculta");
  marcar(raiz, "reaberturaprogramada", false);
  coletarConfigGeral(raiz);
  checar("periodo escondido com a chave desligada", oculta(raiz, "reaberturaprogramada_periodo"));
  marcar(raiz, "reaberturaprogramada", true);
  coletarConfigGeral(raiz);
  checar("periodo aparece com a chave ligada", !oculta(raiz, "reaberturaprogramada_periodo"));
  marcar(raiz, "uploaddocsexternos", true);
  marcar(raiz, "sortbeforeupload", true);
  marcar(raiz, "uploaddocsexternos", false);
  const s1 = coletarConfigGeral(raiz);
  checar(
    "sortbeforeupload some e desmarca com o pai desligado",
    oculta(raiz, "sortbeforeupload") && valor(s1, "sortbeforeupload") === false,
  );
  marcar(raiz, "newdocdefault", false);
  const s2 = coletarConfigGeral(raiz);
  checar(
    "newdocdefault desligado esconde a tabela, mas os campos continuam coletados",
    oculta(raiz, "newdocname") && nomes(s2).includes("newdocformat") && valor(s2, "newdocnivel") === true,
  );

  secao("config: newdocsigilo (id|nivel|rotulo)");
  const r2 = montarMinimo({ lab: false, foraAntaq: true });
  aplicarConfigGeral(r2, [
    { name: "newdocnivel", value: false },
    { name: "newdocsigilo", value: "123|1|Informação restrita" },
  ]);
  const sel = controleDe(r2, "newdocsigilo") as HTMLSelectElement;
  checar("mostra o rotulo", ([...sel.querySelectorAll("option")].find((o) => o.selected)?.textContent ?? "") === "Informação restrita");
  checar("round-trip guarda o valor inteiro", valor(coletarConfigGeral(r2), "newdocsigilo") === "123|1|Informação restrita");
  marcar(r2, "newdocnivel", true);
  checar("nivel publico ligado limpa o sigilo", valor(coletarConfigGeral(r2), "newdocsigilo") === undefined);
  const r6 = montarMinimo({ lab: false, foraAntaq: true });
  aplicarConfigGeral(r6, [
    { name: "newdocnivel", value: false },
    { name: "newdocsigilo", value: "so-um-id" },
  ]);
  checar(
    "valor sem pipes e ignorado (como no legado): o select continua vazio",
    valor(coletarConfigGeral(r6), "newdocsigilo") === undefined,
  );

  secao("config: hipoteses legais lidas do SEI");
  const guardado = {
    "sei.exemplo.gov.br": {
      hipoteses: [
        { id: "7", nome: "Informação Pessoal", nivel: 1 },
        { id: "9", nome: "Sigilo | Fiscal", nivel: 2 },
        { id: "", nome: "sem id", nivel: 1 },
        { nome: "sem id nenhum" },
      ],
    },
  };
  const escolhas = hipotesesDoArmazenamento(guardado);
  checar(
    "converte para id|nivel|rotulo, troca o pipe do nome e descarta item sem id",
    escolhas.length === 2 && escolhas[0].valor === "7|1|Informação Pessoal" && escolhas[1].valor === "9|2|Sigilo / Fiscal",
  );
  checar("sigiloso leva o aviso no rotulo", escolhas[1].rotulo === "Sigilo / Fiscal (Sigiloso)");
  checar(
    "lixo no armazenamento vira lista vazia",
    hipotesesDoArmazenamento(null).length === 0 && hipotesesDoArmazenamento("x").length === 0,
  );
  const dois = hipotesesDoArmazenamento({ ...guardado, "outro.gov.br": { hipoteses: [{ id: "1", nome: "Outra", nivel: 1 }] } });
  checar("dois enderecos de SEI viram grupos", dois.length === 3 && dois.every((e) => !!e.grupo));

  const rVazio = montarMinimo({ lab: false, foraAntaq: true });
  definirEscolhasDinamicas(rVazio, "newdocsigilo", [], AVISO_SEM_HIPOTESES);
  const selVazio = controleDe(rVazio, "newdocsigilo") as HTMLSelectElement;
  checar("sem lista, o item vazio explica o que fazer", (selVazio.querySelector("option")?.textContent ?? "") === AVISO_SEM_HIPOTESES);
  checar("sem lista e sem escolha, nada e coletado", valor(coletarConfigGeral(rVazio), "newdocsigilo") === undefined);

  const rLista = montarMinimo({ lab: false, foraAntaq: true });
  definirEscolhasDinamicas(rLista, "newdocsigilo", escolhas, AVISO_SEM_HIPOTESES);
  const selLista = controleDe(rLista, "newdocsigilo") as HTMLSelectElement;
  checar(
    "o combo oferece as hipoteses da lista",
    [...selLista.querySelectorAll("option")].map((o) => o.value).join(",") === ",7|1|Informação Pessoal,9|2|Sigilo / Fiscal",
  );
  aplicarConfigGeral(rLista, [
    { name: "newdocnivel", value: false },
    { name: "newdocsigilo", value: "7|1|Informação Pessoal" },
  ]);
  checar(
    "o gravado seleciona a opcao da lista, sem duplicar",
    selLista.value === "7|1|Informação Pessoal" && selLista.querySelectorAll("option").length === 3,
  );
  marcar(rLista, "newdocnivel", true);
  coletarConfigGeral(rLista);
  marcar(rLista, "newdocnivel", false);
  coletarConfigGeral(rLista);
  checar(
    "esconder e mostrar de novo limpa a escolha, mas a lista continua",
    selLista.value === "" && selLista.querySelectorAll("option").length === 3,
  );
  aplicarConfigGeral(rLista, [{ name: "newdocsigilo", value: "55|1|De outro SEI" }]);
  checar(
    "gravado que a lista nao traz fica como opcao extra",
    selLista.value === "55|1|De outro SEI" && valor(coletarConfigGeral(rLista), "newdocsigilo") === "55|1|De outro SEI",
  );
  definirEscolhasDinamicas(rLista, "newdocsigilo", [], "");

  secao("config: aplicar");
  const r3 = montarMinimo({ lab: false, foraAntaq: true });
  const gravado: ItemConfig[] = [
    { name: "gerenciarfavoritos", value: false },
    { name: "debugpage", value: true },
    { name: "newdocname", value: "Anexo" },
    { name: "qualidadeimagens", value: 80 },
    { name: "citacaodoc", value: "citacaodoc_3" },
    { name: "opcao_que_nao_existe_mais", value: true },
  ];
  aplicarConfigGeral(r3, gravado);
  const depois = coletarConfigGeral(r3);
  checar("liga e desliga chaves", valor(depois, "gerenciarfavoritos") === false && valor(depois, "debugpage") === true);
  checar(
    "texto, numero e selecao",
    valor(depois, "newdocname") === "Anexo" && valor(depois, "qualidadeimagens") === 80 && valor(depois, "citacaodoc") === "citacaodoc_3",
  );
  checar("nome desconhecido e ignorado", !nomes(depois).includes("opcao_que_nao_existe_mais"));
  checar("opcao ausente da config antiga fica no padrao", valor(depois, "gerenciarprazos") === true && valor(depois, "ditado") === true);
  const r4 = montarMinimo({ lab: false, foraAntaq: true });
  aplicarConfigGeral(r4, depois);
  checar("coletar -> aplicar -> coletar e estavel", JSON.stringify(coletarConfigGeral(r4)) === JSON.stringify(depois));

  secao("config: nome malformado nao derruba a pagina");
  const r7 = montarMinimo({ lab: false, foraAntaq: true });
  let lancou = false;
  try {
    aplicarConfigGeral(r7, [
      { name: 'x"]', value: true },
      { name: "debugpage", value: true },
    ]);
  } catch {
    lancou = true;
  }
  checar("nome com aspas e colchete e ignorado sem lancar", !lancou && controleDe(r7, 'x"]') === null);
  checar("o item valido seguinte ainda e aplicado", valor(coletarConfigGeral(r7), "debugpage") === true);

  secao("config: icones e contagens");
  const ico = (r: ParentNode, n: string) => (r.querySelector(`[data-opcao="${n}"] .ico`) as Element).classList;
  checar(
    "chave desligada: icone cinza",
    ico(r3, "gerenciarfavoritos").contains("desligado") && !ico(r3, "gerenciarfavoritos").contains("ligado"),
  );
  checar("chave ligada: icone azul", ico(r3, "debugpage").contains("ligado"));
  checar("texto preenchido: icone azul", ico(r3, "newdocname").contains("ligado"));
  atualizarContagens(r3);
  const cont = (r3.querySelector('[data-secao="controle"] .contagem') as Element).textContent ?? "";
  checar("contagem 'N de M ativas'", /^\d+ de \d+ ativas$/.test(cont), cont);

  secao("config: linhas escondidas por produto continuam coletadas");
  const r5 = montarMinimo({ lab: false, foraAntaq: false });
  checar(
    "ferramentasia escondida mas coletada",
    (r5.querySelector('[data-opcao="ferramentasia"]') as Element).hasAttribute("hidden") &&
      valor(coletarConfigGeral(r5), "ferramentasia") === true,
  );
  checar("opcoes removidas nao sao mais gravadas", !nomes(coletarConfigGeral(r5)).some((n) => REMOVIDAS.includes(n)));
}
