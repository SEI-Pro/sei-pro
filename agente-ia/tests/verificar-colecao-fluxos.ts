/**
 * Coleção de fluxos da equipe: uma pasta do GitHub com um `.md` por fluxo.
 *
 * Mesma ideia das coleções de skills do agente, e as mesmas armadilhas: o que
 * a equipe publica MANDA nos fluxos daquela coleção (arquivo apagado lá some
 * aqui), mas não pode encostar no que a pessoa escreveu à mão — perder o fluxo
 * próprio de alguém porque a equipe mexeu na pasta seria imperdoável.
 */

import { mesclarColecaoDeFluxos, type ColecaoFluxos } from "../src/fluxos/colecao";
import { fluxoNovo, type Fluxo } from "../src/fluxos/modelo";
import { checar, secao } from "./util";

const COL: ColecaoFluxos = { id: "c1", nome: "Equipe SOG", url: "https://github.com/org/repo/tree/main/fluxos" };
const md = (nome: string, etapa = "Nota Técnica") => `# ${nome}\n\n## 1. ${etapa}\n- documento: ${etapa}\n`;
const baixado = (arquivo: string, nome: string, etapa?: string) => ({ arquivo, nome, texto: md(nome, etapa) });

const meu = (): Fluxo => ({ ...fluxoNovo("Meu fluxo"), id: "meu", ativo: true, etapas: [{ id: "x", nome: "X", documento: { tituloContem: ["X"] }, obrigatoria: true }] });

export function verificarColecaoDeFluxos(): void {
  secao("colecao de fluxos: primeira sincronia");
  const r1 = mesclarColecaoDeFluxos([meu()], COL, [baixado("paf.md", "PAF"), baixado("ferias.md", "Férias")]);
  checar("traz os dois da pasta", r1.novos === 2, r1);
  checar("e nao encosta no meu", r1.lista.some((f) => f.id === "meu"), r1.lista.map((f) => f.id));
  checar("os da colecao nascem DESLIGADOS", r1.lista.filter((f) => f.colecao === "c1").every((f) => !f.ativo));
  checar("cada um sabe de que arquivo veio", r1.lista.some((f) => f.id === "c1:paf.md"), r1.lista.map((f) => f.id));

  secao("colecao de fluxos: o que a equipe publica manda");
  const r2 = mesclarColecaoDeFluxos(r1.lista, COL, [baixado("paf.md", "PAF", "Ordem de Serviço"), baixado("novo.md", "Novo")]);
  checar("arquivo mudado conta como atualizado", r2.atualizados === 1, r2);
  checar("arquivo apagado na pasta some aqui", !r2.lista.some((f) => f.id === "c1:ferias.md"), r2.lista.map((f) => f.id));
  checar("e isso e contado", r2.removidos === 1, r2);
  checar("o meu continua intacto", r2.lista.find((f) => f.id === "meu")?.ativo === true);
  checar("a etapa nova do arquivo chegou", r2.lista.find((f) => f.id === "c1:paf.md")?.etapas[0].nome === "Ordem de Serviço");

  secao("colecao de fluxos: o que o usuario decidiu aqui e respeitado");
  const ligado = r2.lista.map((f) => (f.id === "c1:paf.md" ? { ...f, ativo: true } : f));
  const r3 = mesclarColecaoDeFluxos(ligado, COL, [baixado("paf.md", "PAF", "Ordem de Serviço"), baixado("novo.md", "Novo")]);
  checar("fluxo da equipe que EU liguei continua ligado", r3.lista.find((f) => f.id === "c1:paf.md")?.ativo === true, r3.lista.map((f) => [f.id, f.ativo]));
  checar("sem mudanca no arquivo, nada conta como atualizado", r3.atualizados === 0, r3);

  secao("colecao de fluxos: arquivo quebrado nao derruba a sincronia");
  const r4 = mesclarColecaoDeFluxos([], COL, [{ arquivo: "torto.md", nome: "Torto", texto: "isto nao e um fluxo" }, baixado("bom.md", "Bom")]);
  checar("o bom entra", r4.lista.some((f) => f.id === "c1:bom.md"), r4.lista.map((f) => f.id));
  checar("o torto fica de fora, com aviso", r4.avisos.some((a) => /torto\.md/.test(a)), r4.avisos);
  checar("e a conta nao mente", r4.novos === 1, r4);
}
