import { areaMemoria } from "@comum/armazenamento/area";
import type { PastaExibida } from "../src/arvore/mesclar";
import { montarExibicao } from "../src/arvore/mesclar";
import type { EntidadesArvore, Pasta } from "../src/arvore/modelo";
import { nomeNumerado, numeroDaPasta } from "../src/arvore/numeracao";
import { CHAVE_NUMERAR, lerNumeracao } from "../src/preferencias";
import { checar, teste } from "./util";

const CARIMBO = { atualizadoEm: 1, dispositivo: "d1" };
const pasta = (id: string, nome: string, pai: string | null = null, ordem = "a0"): Pasta => ({ id, nome, pai, ordem, ...CARIMBO });

await teste("numeroDaPasta numera raizes e filhas pela posicao dos irmaos", () => {
  const e = montarExibicao(
    {
      p: [
        pasta("p1", "Fiscalizacao", null, "a0"),
        pasta("p2", "Pareceres", null, "a1"),
        pasta("p3", "Notas", "p2", "a0"),
        pasta("p4", "Sub", "p1", "a0"),
        pasta("p5", "Neta 1", "p4", "a0"),
        pasta("p6", "Neta 2", "p4", "a1"),
        pasta("p7", "Neta 3", "p4", "a2"),
      ],
      v: [],
    } as EntidadesArvore,
    [],
  );
  checar("primeira raiz", numeroDaPasta(e.pastas, "p1") === "1");
  checar("segunda raiz", numeroDaPasta(e.pastas, "p2") === "2");
  checar("filha da segunda raiz", numeroDaPasta(e.pastas, "p3") === "2.1");
  checar("filha da primeira raiz", numeroDaPasta(e.pastas, "p4") === "1.1");
  checar("terceira neta", numeroDaPasta(e.pastas, "p7") === "1.1.3");
});

await teste("pasta fora da arvore nao tem numero", () => {
  const e = montarExibicao({ p: [pasta("p1", "A")], v: [] } as EntidadesArvore, []);
  checar("inexistente", numeroDaPasta(e.pastas, "xx") === "");
});

await teste("ciclo de pais nao trava e nao numera", () => {
  const a: PastaExibida = { id: "a", nome: "A", pai: "b", ordem: "a0", filhas: [], contagem: 0 };
  const b: PastaExibida = { id: "b", nome: "B", pai: "a", ordem: "a0", filhas: [], contagem: 0 };
  a.filhas.push(b);
  b.filhas.push(a);
  checar("sem numero", numeroDaPasta([a], "a") === "");
});

await teste("nomeNumerado poe o numero a frente so quando existe", () => {
  checar("sem numero", nomeNumerado("Fiscalização", "") === "Fiscalização");
  checar("com numero", nomeNumerado("Fiscalização", "1.2") === "1.2. Fiscalização");
});

await teste("lerNumeracao so liga com o valor sim", async () => {
  checar("ausente e desligada", (await lerNumeracao(areaMemoria())) === false);
  checar("sim liga", (await lerNumeracao(areaMemoria({ [CHAVE_NUMERAR]: "sim" }))) === true);
  checar("nao desliga", (await lerNumeracao(areaMemoria({ [CHAVE_NUMERAR]: "nao" }))) === false);
  checar("valor estranho desliga", (await lerNumeracao(areaMemoria({ [CHAVE_NUMERAR]: "abc" }))) === false);
});
