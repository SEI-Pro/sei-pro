/**
 * Fluxo em Markdown: o formato que vai para a pasta do GitHub da equipe.
 *
 * Precisa servir a dois leitores ao mesmo tempo: a extensão, que o interpreta,
 * e a PESSOA, que abre o arquivo no GitHub para conferir e editar. Por isso não
 * é JSON num bloco de código — é texto que se lê.
 *
 * A ida e volta tem de ser sem perda: fluxo → md → fluxo. Se perder um campo no
 * caminho, a equipe publica um fluxo e recebe outro de volta, sem aviso.
 */

import { deMarkdown, paraMarkdown } from "../src/fluxos/markdown";
import { etapaNova, fluxoNovo, validarFluxo, type Fluxo } from "../src/fluxos/modelo";
import { checar, lanca, secao } from "./util";

const COMPLETO: Fluxo = {
  ...fluxoNovo("Contrato de transição"),
  descricao: "Rito do contrato, da NT ao arquivamento",
  aplicaSe: { tipoProcessoContem: ["Contratação Direta", "Dispensa"], marcador: ["Urgente"], unidade: ["GPF", "SFC"] },
  etapas: [
    { ...etapaNova("Nota Técnica"), id: "e1", documento: { tituloContem: ["Nota Técnica", "NT"], assinado: true }, prazoDias: 5 },
    { ...etapaNova("Despacho de aprovação"), id: "e2", documento: { tituloContem: ["Despacho"], daMinhaUnidade: true }, obrigatoria: false,
      acao: { titulo: "Preparar despacho", pedido: "Crie um Despacho aprovando a Nota Técnica anterior. Não assine." },
      condicao: { seDocumentoContem: "MINUTA", entaoIrPara: "e1" } },
  ],
};

export async function verificarFluxoMarkdown(): Promise<void> {
  secao("fluxo em md: da e para");
  const md = paraMarkdown(COMPLETO);
  checar("o nome vira titulo do arquivo", /^#\s+Contrato de transição/m.test(md), md.slice(0, 80));
  checar("uma secao por etapa, numerada", (md.match(/^##\s+\d+\./gm) ?? []).length === 2, md);
  checar("o arquivo cita as variacoes do titulo", md.includes("Nota Técnica") && md.includes("NT"));
  checar("e o pedido ao agente", md.includes("Crie um Despacho aprovando"));

  const volta = deMarkdown(md);
  checar("o nome volta", volta.nome === COMPLETO.nome, volta.nome);
  checar("a descricao volta", volta.descricao === COMPLETO.descricao);
  checar("os tipos de processo voltam", JSON.stringify(volta.aplicaSe.tipoProcessoContem) === JSON.stringify(["Contratação Direta", "Dispensa"]), volta.aplicaSe);
  checar("marcador e unidade voltam", JSON.stringify(volta.aplicaSe.marcador) === '["Urgente"]' && JSON.stringify(volta.aplicaSe.unidade) === '["GPF","SFC"]');
  checar("as duas etapas voltam, na ordem", volta.etapas.map((e) => e.nome).join("|") === "Nota Técnica|Despacho de aprovação", volta.etapas.map((e) => e.nome));
  checar("as variacoes do titulo voltam", JSON.stringify(volta.etapas[0].documento.tituloContem) === '["Nota Técnica","NT"]', volta.etapas[0].documento);
  checar("assinado volta", volta.etapas[0].documento.assinado === true);
  checar("prazo volta", volta.etapas[0].prazoDias === 5);
  checar("da minha unidade volta", volta.etapas[1].documento.daMinhaUnidade === true);
  checar("opcional volta", volta.etapas[1].obrigatoria === false);
  checar("a acao volta inteira", volta.etapas[1].acao?.titulo === "Preparar despacho" && volta.etapas[1].acao?.pedido.startsWith("Crie um Despacho"));
  checar("o desvio volta, apontando pela etapa certa", volta.etapas[1].condicao?.seDocumentoContem === "MINUTA" && volta.etapas[1].condicao?.entaoIrPara === volta.etapas[0].id, volta.etapas[1].condicao);
  checar("o que volta e valido", validarFluxo({ ...fluxoNovo("x"), ...volta } as Fluxo).length === 0, validarFluxo({ ...fluxoNovo("x"), ...volta } as Fluxo));

  secao("fluxo em md: nasce desligado e sem ids do outro navegador");
  checar("volta DESLIGADO, venha como vier", deMarkdown(paraMarkdown({ ...COMPLETO, ativo: true })).ativo === false);
  checar("os ids sao novos, nao os do arquivo", volta.etapas[0].id !== "e1");
  checar("a origem diz que veio da colecao", volta.origem === "colecao", volta.origem);

  secao("fluxo em md: arquivo escrito a mao");
  const aMao = `# Rito simples

Uma descrição qualquer.

- aplica-se a: Gestão de Pessoal

## 1. Requerimento
- documento: Requerimento

## 2. Despacho
- documento: Despacho
- assinado: sim
`;
  const simples = deMarkdown(aMao);
  checar("le arquivo minimo", simples.nome === "Rito simples" && simples.etapas.length === 2, simples);
  checar("le a descricao solta", simples.descricao === "Uma descrição qualquer.", simples.descricao);
  checar("le o aplica-se a", JSON.stringify(simples.aplicaSe.tipoProcessoContem) === '["Gestão de Pessoal"]');
  checar("etapa sem 'obrigatória' e obrigatoria", simples.etapas[0].obrigatoria === true);

  secao("fluxo em md: arquivo que nao serve");
  checar("sem titulo lanca", (await lanca(() => deMarkdown("## 1. Etapa\n- documento: X"))) !== null);
  checar("sem etapa lanca", (await lanca(() => deMarkdown("# Só o nome\n\nUm texto."))) !== null);
  checar("etapa sem documento e descartada com aviso", deMarkdown("# X\n\n## 1. Vazia\n\n## 2. Boa\n- documento: Y").etapas.length === 1);
}
