import type { Area } from "@comum/armazenamento/area";
import { areaMemoria } from "@comum/armazenamento/area";
import { ErroArvore, LIMITE_NOME_PASTA } from "../src/arvore/modelo";
import { RepositorioArvore } from "../src/arvore/repositorio";
import { checar, lanca, teste } from "./util";

const IDENT = { host: "sei.exemplo.gov.br", unidade: "110000108" };

function repositorio(area: Area, inicio = 1, dispositivo = "d1") {
  let agora = inicio;
  return new RepositorioArvore({ area, ident: IDENT, carimbo: () => ({ agora: agora++, dispositivo }) });
}

await teste("criarPasta cria raiz e subpasta e ordena por indice", async () => {
  const repo = repositorio(areaMemoria());
  const raiz = await repo.criarPasta("Fiscalizacao", null);
  const notas = await repo.criarPasta("Notas", raiz.id);
  const pareceres = await repo.criarPasta("Pareceres", raiz.id);
  checar("pai da subpasta", notas.pai === raiz.id);
  const lista = await repo.listar();
  const filhas = lista.p.filter((p) => p.pai === raiz.id).sort((a, b) => (a.ordem < b.ordem ? -1 : 1));
  checar("ordem de criacao", filhas.map((p) => p.nome).join(",") === "Notas,Pareceres");
  checar("tres pastas", lista.p.length === 3);
  checar("pareceres existe", pareceres.id !== notas.id);
});

await teste("criarPasta com antes insere na posicao pedida", async () => {
  const repo = repositorio(areaMemoria());
  const a = await repo.criarPasta("A", null);
  const c = await repo.criarPasta("C", null);
  const b = await repo.criarPasta("B", null, c.id);
  const lista = (await repo.listar()).p.sort((x, y) => (x.ordem < y.ordem ? -1 : 1));
  checar("ordem A, B, C", lista.map((p) => p.nome).join(",") === "A,B,C");
  checar("ids distintos", new Set([a.id, b.id, c.id]).size === 3);
});

await teste("renomearPasta valida o nome", async () => {
  const repo = repositorio(areaMemoria());
  const p = await repo.criarPasta("Fiscalizacao", null);
  const nova = await repo.renomearPasta(p.id, "  Juridico  ");
  checar("aparou espacos", nova.nome === "Juridico");
  const e1 = await lanca(() => repo.renomearPasta(p.id, "   "));
  checar("vazio", e1 instanceof ErroArvore);
  const e2 = await lanca(() => repo.renomearPasta(p.id, "x".repeat(LIMITE_NOME_PASTA + 1)));
  checar("longo", e2 instanceof ErroArvore);
});

await teste("moverPasta recusa ciclo e aceita mover para a raiz", async () => {
  const repo = repositorio(areaMemoria());
  const a = await repo.criarPasta("A", null);
  const b = await repo.criarPasta("B", a.id);
  const erro = await lanca(() => repo.moverPasta(a.id, b.id));
  checar("ciclo recusado", erro instanceof ErroArvore);
  const movida = await repo.moverPasta(b.id, null);
  checar("subiu para a raiz", movida.pai === null);
});

await teste("excluirPasta exclui a subarvore e devolve os vinculos para Sem pasta", async () => {
  const repo = repositorio(areaMemoria());
  const a = await repo.criarPasta("A", null);
  const b = await repo.criarPasta("B", a.id);
  const c = await repo.criarPasta("C", b.id);
  const d = await repo.criarPasta("D", a.id);
  await repo.moverVinculo("40", b.id, "PROCEDIMENTO A");
  await repo.moverVinculo("41", c.id, "PROCEDIMENTO C");
  await repo.moverVinculo("42", d.id, "PROCEDIMENTO D");
  await repo.excluirPasta(b.id);
  const lista = await repo.listar();
  checar("pasta tem lapide", typeof lista.p.find((p) => p.id === b.id)?.removidoEm === "number");
  checar("subpasta tambem tem lapide", typeof lista.p.find((p) => p.id === c.id)?.removidoEm === "number");
  checar("avo intacto", lista.p.find((p) => p.id === a.id)?.removidoEm === undefined);
  checar("irma intacta", lista.p.find((p) => p.id === d.id)?.removidoEm === undefined);
  checar("vinculo da pasta excluida sem pasta", lista.v.find((v) => v.id === "40")?.pasta === null);
  checar("vinculo da subpasta sem pasta", lista.v.find((v) => v.id === "41")?.pasta === null);
  checar("vinculo da irma intacto", lista.v.find((v) => v.id === "42")?.pasta === d.id);
});

await teste("moverVinculo cria quando ausente e atualiza pasta e titulo quando existe", async () => {
  const repo = repositorio(areaMemoria());
  const a = await repo.criarPasta("A", null);
  const v1 = await repo.moverVinculo("40", a.id, "Titulo antigo");
  checar("criado", v1.pasta === a.id && v1.titulo === "Titulo antigo");
  const v2 = await repo.moverVinculo("40", null, "Titulo novo");
  checar("atualizado", v2.pasta === null && v2.titulo === "Titulo novo");
  checar("mesma chave", (await repo.listar()).v.length === 1);
  const erro = await lanca(() => repo.moverVinculo("41", "nao-existe", "x"));
  checar("pasta inexistente recusada", erro instanceof ErroArvore);
});

await teste("removerVinculo deixa lapide", async () => {
  const repo = repositorio(areaMemoria());
  await repo.moverVinculo("40", null, "PROCEDIMENTO A");
  await repo.removerVinculo("40");
  const vinculo = (await repo.listar()).v.find((v) => v.id === "40");
  checar("lapide", typeof vinculo?.removidoEm === "number");
});

await teste("importar mescla por entidade e o mais recente vence", async () => {
  const areaA = areaMemoria();
  const areaB = areaMemoria();
  const a = repositorio(areaA, 100, "dA");
  const b = repositorio(areaB, 200, "dB");
  const pasta = await a.criarPasta("Fiscalizacao", null);
  await b.importar((await a.exportar()).entidades);
  await b.renomearPasta(pasta.id, "Fiscalizacao (B)");
  await a.importar((await b.exportar()).entidades);
  const vencedora = (await a.listar()).p.find((p) => p.id === pasta.id);
  checar("versao mais recente venceu", vencedora?.nome === "Fiscalizacao (B)");
  checar("envelope exportado carrega a identidade", (await a.exportar()).host === IDENT.host);
});

await teste("importar propaga lapide", async () => {
  const areaA = areaMemoria();
  const areaB = areaMemoria();
  const a = repositorio(areaA, 100, "dA");
  const b = repositorio(areaB, 200, "dB");
  await a.moverVinculo("40", null, "PROCEDIMENTO A");
  await b.importar((await a.exportar()).entidades);
  await b.removerVinculo("40");
  await a.importar((await b.exportar()).entidades);
  const vinculo = (await a.listar()).v.find((v) => v.id === "40");
  checar("lapide chegou", typeof vinculo?.removidoEm === "number");
});

await teste("exportar e estavel com carimbo fixo", async () => {
  const area = areaMemoria();
  const repo = new RepositorioArvore({ area, ident: IDENT, carimbo: () => ({ agora: 1, dispositivo: "d1" }) });
  await repo.criarPasta("A", null);
  const e1 = JSON.stringify(await repo.exportar());
  const e2 = JSON.stringify(await repo.exportar());
  checar("mesmo JSON", e1 === e2);
});
