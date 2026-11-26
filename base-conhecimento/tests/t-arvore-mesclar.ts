import { caminhoDaPasta, montarExibicao, vinculosDesatualizados } from "../src/arvore/mesclar";
import type { EntidadesArvore, Pasta, Vinculo } from "../src/arvore/modelo";
import type { ItemBase } from "../src/nucleo/tipos";
import { checar, teste } from "./util";

const CARIMBO = { atualizadoEm: 1, dispositivo: "d1" };
const pasta = (id: string, nome: string, pai: string | null = null, ordem = "a0", extra: Partial<Pasta> = {}): Pasta => ({
  id,
  nome,
  pai,
  ordem,
  ...CARIMBO,
  ...extra,
});
const vinculo = (id: string, pastaId: string | null, titulo = "Titulo", ordem = "a0", extra: Partial<Vinculo> = {}): Vinculo => ({
  id,
  titulo,
  pasta: pastaId,
  ordem,
  ...CARIMBO,
  ...extra,
});
const item = (agrupador: string, titulo = "Titulo"): ItemBase => ({
  agrupador,
  id: agrupador,
  titulo,
  gerador: "usuario.teste",
  dataGeracao: "01/01/2026 10:00:00",
  liberado: true,
  visualizar: "x",
});
const ent = (p: Pasta[], v: Vinculo[]): EntidadesArvore => ({ p, v });

await teste("item novo sem vinculo cai em Sem pasta", () => {
  const e = montarExibicao(ent([pasta("p1", "Fiscalizacao")], []), [item("40", "Novo item")]);
  checar("sem pasta", e.semPasta.length === 1 && e.semPasta[0]?.agrupador === "40");
  checar("sem orfaos", e.orfaos.length === 0);
});

await teste("vinculo sem item correspondente e orfao e nao quebra", () => {
  const e = montarExibicao(ent([pasta("p1", "Fiscalizacao")], [vinculo("99", "p1", "Sumiu")]), [item("40")]);
  checar("orfao", e.orfaos.length === 1 && e.orfaos[0]?.id === "99");
  checar("item 40 sem pasta", e.semPasta.length === 1);
});

await teste("vinculo para pasta inexistente ou removida cai em Sem pasta", () => {
  const e = montarExibicao(
    ent([pasta("p1", "Fiscalizacao", null, "a0", { removidoEm: 5 })], [vinculo("40", "p1"), vinculo("41", "fantasma")]),
    [item("40"), item("41")],
  );
  checar("dois sem pasta", e.semPasta.length === 2);
  checar("nenhuma pasta viva", e.pastas.length === 0);
});

await teste("contagem e so dos vinculos diretos e a arvore aninha filhas", () => {
  const e = montarExibicao(
    ent(
      [pasta("p1", "Fiscalizacao", null, "a0"), pasta("p2", "Notas", "p1", "a0")],
      [vinculo("40", "p1"), vinculo("41", "p2"), vinculo("42", "p2")],
    ),
    [item("40"), item("41"), item("42")],
  );
  checar("uma raiz", e.pastas.length === 1);
  checar("uma filha", e.pastas[0]?.filhas.length === 1);
  checar("contagem do pai", e.pastas[0]?.contagem === 1);
  checar("contagem da filha", e.pastas[0]?.filhas[0]?.contagem === 2);
});

await teste("pastas ordenam por indice fracionario", () => {
  const e = montarExibicao(ent([pasta("p1", "B", null, "a1"), pasta("p2", "A", null, "a0"), pasta("p3", "C", null, "a2")], []), []);
  checar("ordem A,B,C", e.pastas.map((p) => p.nome).join(",") === "A,B,C");
});

await teste("filho de pasta removida vira raiz (pai efetivo nulo)", () => {
  const e = montarExibicao(ent([pasta("p1", "Pai", null, "a0", { removidoEm: 5 }), pasta("p2", "Filha", "p1", "a0")], []), []);
  checar("filha na raiz", e.pastas.length === 1 && e.pastas[0]?.id === "p2");
  checar("pai efetivo nulo", e.pastas[0]?.pai === null);
});

await teste("vinculosDesatualizados aponta titulo em cache diferente", () => {
  const desatualizados = vinculosDesatualizados(ent([pasta("p1", "A")], [vinculo("40", "p1", "Antigo"), vinculo("41", "p1", "Igual")]), [
    item("40", "Novo"),
    item("41", "Igual"),
  ]);
  checar("so o 40", desatualizados.length === 1 && desatualizados[0]?.id === "40");
});

await teste("caminhoDaPasta monta o caminho com a hierarquia", () => {
  const e = montarExibicao(
    ent([pasta("p1", "Fiscalizacao", null, "a0"), pasta("p2", "Pareceres", null, "a1"), pasta("p3", "Notas", "p1", "a0")], []),
    [],
  );
  checar("caminho da subpasta", caminhoDaPasta(e.pastas, "p3") === "Fiscalizacao › Notas");
  checar("caminho da raiz", caminhoDaPasta(e.pastas, "p2") === "Pareceres");
  checar("inexistente", caminhoDaPasta(e.pastas, "xx") === "");
});

await teste("caminhoDaPasta numerado prefixa cada segmento sem mudar a arvore", () => {
  const e = montarExibicao(
    ent([pasta("p1", "Fiscalizacao", null, "a0"), pasta("p2", "Pareceres", null, "a1"), pasta("p3", "Notas", "p1", "a0")], []),
    [],
  );
  checar("numerado", caminhoDaPasta(e.pastas, "p3", true) === "1. Fiscalizacao › 1.1. Notas");
  checar("sem numerar igual ao de antes", caminhoDaPasta(e.pastas, "p3") === "Fiscalizacao › Notas");
  checar("nome da raiz intacto", e.pastas[0]?.nome === "Fiscalizacao");
  checar("nome da filha intacto", e.pastas[0]?.filhas[0]?.nome === "Notas");
});
