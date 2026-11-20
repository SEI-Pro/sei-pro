import { alinharBlocos, lcsIndices } from "@cd/modelo/alinhar";
import type { Bloco } from "@cd/modelo/blocos";
import { compararBlocos } from "@cd/modelo/diff";
import { diffPalavras } from "@cd/modelo/palavras";
import { checar, igual, secao } from "./util";

const b = (texto: string, tag = "p"): Bloco => ({ html: texto, texto, tag });
const blocos = (...t: string[]): Bloco[] => t.map((x) => b(x));

export function verificarDiff(): void {
  secao("diff: alinhar (fase 1)");
  igual("lcs simples", lcsIndices([1, 2, 3, 4], [1, 3, 4, 5]), [
    { antes: 0, depois: 0 },
    { antes: 2, depois: 1 },
    { antes: 3, depois: 2 },
  ]);
  igual("lcs sem nada em comum", lcsIndices([1, 2], [3, 4]), []);
  igual("alinhar blocos iguais por texto", alinharBlocos(blocos("a", "b", "c"), blocos("a", "x", "c")).iguais, [
    { antes: 0, depois: 0 },
    { antes: 2, depois: 2 },
  ]);
  const rep = alinharBlocos(blocos(..."aaaaaaaaaa".split("")), blocos(..."aaaaa".split(""))).iguais;
  checar(
    "repetidos: indices crescentes nos dois lados",
    rep.every((p, i) => i === 0 || (p.antes > rep[i - 1]!.antes && p.depois > rep[i - 1]!.depois)),
    rep,
  );
  igual("repetidos: casa 5 pares", rep.length, 5);

  secao("diff: palavras (fase 2)");
  const pal = diffPalavras("um dois tres", "um quatro tres");
  checar("palavra trocada: del da velha e ins da nova", /<del[^>]*>dois<\/del>/.test(pal) && /<ins[^>]*>quatro<\/ins>/.test(pal), pal);
  checar("palavra trocada: resto intacto", pal.startsWith("um ") && pal.endsWith(" tres"), pal);
  igual("sem mudanca devolve o mesmo html", diffPalavras("a <b>b</b> c", "a <b>b</b> c"), "a <b>b</b> c");
  const tags = diffPalavras("a <b>velho</b> c", "a <b>novo</b> c");
  checar("tags do depois preservadas", tags.includes("<b>") && tags.includes("</b>"), tags);
  const run = diffPalavras("x", "x novo texto aqui");
  checar("palavras novas seguidas viram um unico ins", (run.match(/<ins/g) ?? []).length === 1, run);

  secao("diff: compararBlocos");
  const iguais = compararBlocos(blocos("a", "b"), blocos("a", "b"));
  igual("identicos: html igual e sem removidos", iguais, { depois: ["a", "b"], removidos: [] });

  const ins = compararBlocos(blocos("um", "tres"), blocos("um", "dois novo", "tres"));
  checar("inserido: so o novo tem ins", ins.depois[0] === "um" && ins.depois[2] === "tres" && ins.depois[1]!.includes("<ins"), ins);
  igual("inserido: sem removidos", ins.removidos.length, 0);

  const rem = compararBlocos(blocos("um", "sai este paragrafo inteiro", "tres"), blocos("um", "tres"));
  igual("removido: um item", rem.removidos.length, 1);
  checar(
    "removido: antesDe aponta o bloco seguinte e usa del",
    rem.removidos[0]!.antesDe === 1 && rem.removidos[0]!.html.includes("<del"),
    rem,
  );
  checar("removido: embrulhado em <p>", rem.removidos[0]!.html.startsWith("<p>"), rem.removidos[0]!.html);

  const fim = compararBlocos(blocos("um", "dois"), blocos("um"));
  igual("removido no fim: antesDe = depois.length", fim.removidos[0]?.antesDe, 1);

  const edit = compararBlocos(blocos("o contrato vale por doze meses"), blocos("o contrato vale por vinte e quatro meses"));
  checar("editado dentro do bloco: ins e del no mesmo bloco", edit.depois[0]!.includes("<del") && edit.depois[0]!.includes("<ins"), edit);
  igual("editado dentro do bloco: nada removido", edit.removidos.length, 0);

  const ida = compararBlocos(blocos("um", "dois novo", "tres"), blocos("um", "tres"));
  const volta = compararBlocos(blocos("um", "tres"), blocos("um", "dois novo", "tres"));
  checar("inverter troca del por ins", ida.removidos.length === 1 && volta.depois[1]!.includes("<ins"), { ida, volta });

  // Trechos editados com o mesmo numero de blocos dos dois lados sao edicoes: pareia posicao a posicao (blocos curtos
  // como "R$ 1.000,00" -> "R$ 1.200,00" nao passam do limiar de semelhanca).
  const num = compararBlocos(blocos("a", "R$ 1.000,00", "R$ 20,00", "z"), blocos("a", "R$ 1.200,00", "R$ 25,00", "z"));
  checar(
    "celulas curtas editadas: diff de palavras no proprio bloco, nada removido a parte",
    num.removidos.length === 0 && num.depois[1]!.includes("<del") && num.depois[1]!.includes("<ins") && num.depois[2]!.includes("<del"),
    num,
  );
  const emp = compararBlocos(blocos("Deferido"), blocos("Indeferido"));
  checar(
    "palavra trocada: o del vem antes do ins",
    emp.depois[0]!.indexOf("<del") >= 0 && emp.depois[0]!.indexOf("<del") < emp.depois[0]!.indexOf("<ins"),
    emp,
  );
  const emp2 = compararBlocos(blocos("clausula primeira", "clausula segunda"), blocos("clausula terceira", "clausula quarta"));
  checar(
    "empate de semelhanca: cada bloco vira diff de palavras (sem del/ins de bloco inteiro)",
    emp2.removidos.length === 0 && emp2.depois.every((h) => !h.startsWith('<ins style="') && /<del[^>]*>(primeira|segunda)<\/del>/.test(h)),
    emp2,
  );
  const sobra = compararBlocos(
    blocos("um", "sai este paragrafo inteiro", "sai tambem este outro paragrafo", "fim"),
    blocos("um", "texto totalmente novo aqui", "fim"),
  );
  checar(
    "remocao no trecho com inserido: o removido entra antes do inserido",
    sobra.removidos.length >= 1 && sobra.removidos.every((r) => r.antesDe <= 1) && sobra.depois[1]!.includes("<ins"),
    sobra,
  );

  igual("vazios nos dois lados", compararBlocos([], []), { depois: [], removidos: [] });
  const soDepois = compararBlocos([], blocos("a", "b"));
  checar("so o depois: tudo ins", soDepois.depois.every((h) => h.includes("<ins")) && soDepois.removidos.length === 0, soDepois);
  const soAntes = compararBlocos(blocos("a", "b"), []);
  checar(
    "so o antes: tudo removido no fim",
    soAntes.depois.length === 0 && soAntes.removidos.length === 2 && soAntes.removidos.every((r) => r.antesDe === 0),
    soAntes,
  );

  secao("diff: tamanho");
  const grande = (n: number, mexer: boolean): Bloco[] =>
    Array.from({ length: n }, (_, i) =>
      b(mexer && i % 20 === 0 ? `par ${i} alterado de forma bem clara agora` : `paragrafo numero ${i} com varias palavras de enchimento`),
    );
  const t0 = performance.now();
  const r = compararBlocos(grande(5000, false), grande(5000, true));
  const ms = performance.now() - t0;
  checar("5.000 blocos com 5% alterados em menos de 1 s", ms < 1000, `${Math.round(ms)} ms`);
  igual("5.000 blocos: um html por bloco do depois", r.depois.length, 5000);
  const tudoDiferente = performance.now();
  compararBlocos(
    Array.from({ length: 3000 }, (_, i) => b(`antes ${i} unico`)),
    Array.from({ length: 3000 }, (_, i) => b(`depois ${i} outro`)),
  );
  const ms2 = performance.now() - tudoDiferente;
  checar("3.000 blocos totalmente diferentes em menos de 2 s", ms2 < 2000, `${Math.round(ms2)} ms`);
}
